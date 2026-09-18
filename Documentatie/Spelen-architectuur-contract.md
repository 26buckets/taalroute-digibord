# Spelen — technisch architectuurcontract (Prompt 3)

Korte technische notitie, geen productdocument. Dit is het contract voor volgende Claude-prompts op de
nieuwe Spelen-omgeving. De huidige visuele laag (GamePageShell/GameActionBar-rendering) is tijdelijk —
Nico ontwerpt de definitieve UI apart — maar de onderstaande data-/gedragscontracten zijn dat niet.

Bestanden: `Lessen/spelen-context.js` (AppContext, ModuleRegistry, ActivityRegistry, SessionState — puur
data/state, geen DOM) laadt vóór `Lessen/spelen.js` (bouwt de huidige UI erbovenop, inclusief GamePage-
vertaalfunctie en BoardAdapter).

## AppContext (`globalThis.TaalrouteSpelenContext`)
Eén centrale, DOM-onafhankelijke contextlaag. `getState()` geeft een snapshot; `subscribe(fn)` geeft
updates. Velden: `level`, `lessonContext` (zie hieronder), `page`, `workContext`, `sectorId`,
`participationMode`, `activeModule`, `activeActivity`, `activeWorld`, `sessionId`. Alleen `level` en
`participationMode` worden bewaard tussen bezoeken (`localStorage['taalroute-spelen-context-v1']`); de
rest is sessievluchtig. `setLevel()` wijzigt uitsluitend de globale voorkeur — een lopende activiteit-
sessie bewaart haar eigen `levelAtStart` (zie SessionState) en wordt nooit stilzwijgend geconverteerd.

## LessonContext (onderdeel van AppContext)
Schema, geen inhoud: `productId, bookId, routeId, themeId, lessonId, pageNumber, languageGoals,
workContext, sectorId`. `setLessonContext(patch)` merget; `clearLessonContext()` reset naar leeg.
`setSectorId`/`clearSectorId` werken los van de rest van lessonContext. Werk/sector zijn hier
contextvelden, geen aparte apps — toekomstige activiteiten kunnen hierop matchen zodra ze
`themeIds`/`sectorIds`-metadata krijgen (zie ActivityRegistry). Er is nog geen contentselectielogica
gebouwd die hierop filtert.

## ModuleRegistry (`globalThis.TaalrouteModuleRegistry`)
`register(mod)` / `unregister(id)` / `get(id)` / `list()` (alleen `enabled`, gesorteerd op `order`) /
`all()`. Record: `id, label, description, icon, order, enabled, route, openHandler, capabilities`. De
startpagina (`screenHome`) rendert uitsluitend via `list()` — nooit een vast aantal tegels. De vier
bestaande modules (Speelborden/Dobbelspellen/Kaartspellen/Woorden & zinnen) zijn hierin geregistreerd
met hun bestaande labels/beschrijvingen/miniaturen, niets nieuws geschreven.

## ActivityRegistry (`globalThis.TaalrouteActivityRegistry`)
`define(def)` / `get(id)` / `list()` / `forModule(moduleId)` / `hasCapability(id, cap)` /
`supportsParticipationMode(id, mode)` / `participationModesFor(id)`. Record: `id, gameFamily, moduleId,
title, supportedLevels, levelRange, themeIds, sectorIds, participationModes, capabilities, contentRef,
renderer, status`. Een activiteit ≠ een module (§8): Taalworp/Bouw een zin/Verhaalworp/Speelborden zijn
hierin geregistreerd als activiteiten, elk met `moduleId` naar hun module (Verhaalworp heeft er
eerlijkheidshalve nog geen — geen bestaande starttegel-koppeling). `contentRef` is voor alle vier `null`:
er is geen onderwijsinhoud aangesloten of geschreven.

`participationModesFor(id)` is de enige plek die bepaalt welke deelnamevormen een scherm mag aanbieden:
puur capability-gedreven (`live` alleen als de activiteit die capability heeft), nooit hardgecodeerd per
scherm. `screenBouwEenZin` gebruikt dit al echt (niet alleen als contract op papier).

## Capabilities
Vaste lijst (`AppContext.CAPABILITIES`): `help, example, extraChallenge, solution, classroom, live,
results, audio, image, openResponse, closedResponse`. Geen activiteit hoeft ze allemaal te hebben; de
GamePage-shell toont nooit een lege knop voor een ontbrekende capability.

## ParticipationMode
`AppContext.PARTICIPATION_MODES = ['classroom', 'live']`. Dezelfde ActivityDefinition wordt in beide
modi gebruikt — Live is geen aparte inhoudsdatabase en er is geen Live-backend gebouwd. `ParticipationModeSwitch`
neemt nu technische id's aan (`classroom`/`live`) i.p.v. de zichtbare labels; de labelvertaling
(`Klassikaal`/`Live`) zit apart in `PARTICIPATION_LABELS`.

## GamePage-contract (`GamePage(config)` in `Lessen/spelen.js`, geëxposeerd via `instance.__internal.GamePage`)
Neemt `title, description, icon, actions[], capabilities, levelContext, lessonContext, participationMode,
content, sessionState, onBack`. `actions` is een lijst generieke identifiers (`help, example, primary,
extraChallenge, reset, next, discuss, results, back`) — geen visuele positie als functionele identiteit.
Vertaalt dit naar de huidige, tijdelijke visuele laag (`GamePageShell` + `GameActionBar`). Een toekomstige
redesign vervangt uitsluitend déze vertaalfunctie; de `actions`-configuratie die een scherm meegeeft hoeft
niet te wijzigen. Bestaande schermen die nog rechtstreeks `GamePageShell`/`GameActionBar` aanroepen
(Taalworp, Bouw een zin, Verhaalworp, Speelborden-bibliotheek) blijven ongewijzigd werken — het contract
is dit rond alleen ingevoerd op het Speelbord-scherm, om regressie te vermijden.

## BoardAdapter (`instance.boardAdapter` op `Lessen/spelen.js`'s bouwresultaat)
Status: `'legacy-iframe-adapter'` — expliciet zo gemarkeerd. Dun contract rond de bestaande, ONGEWIJZIGDE
speelbordmotor (same-origin iframe naar `Praatpad.html?kaart=<id>&embed=spelen`):
- `openWorld(worldId)` / `closeWorld()` / `getWorldId()` / `resume()` — werken.
- `getSessionState()` — leest de bestaande, stabiele opslagsleutel (`taalroute-digiboard-les-<id>-v1`,
  dezelfde conventie als `DigiBoard.storageKey()`) rechtstreeks. Geen DOM-scraping van de ingebedde
  pagina voor businesslogica, geen eigen kopie van de sessie.
- `openTask`, `onTaskOpened`, `onPositionChanged` — bewust `undefined` (feature-detection), niet
  nagemaakt: de bestaande motor biedt hiervoor nog geen stabiel uitbreidingspunt zonder de 1728-regel
  inline motor in `Praatpad.html` open te breken. Zie de Prompt 2-oplevering voor de volledige
  onderzoeksbasis van deze grens.

Andere spelmotor-adapters (DiceGameAdapter/CardGameAdapter/WordGameAdapter) zijn NIET gebouwd — er is nog
geen tweede motor die dat rechtvaardigt (§14: geen abstractie om de abstractie). Wel vastgelegd: een
toekomstige adapter hoeft niet identiek te zijn aan BoardAdapter waar de spelwerking wezenlijk verschilt.

## SessionState (`globalThis.TaalrouteSessionState`)
`start({activityId, worldId, level, participationMode})` bevriest `levelAtStart` bij aanmaak — een latere
`AppContext.setLevel()` raakt een al gestarte sessie niet. `markExampleSeen`/`markHelpOpened` zijn kleine
mutators. Bevat nooit cursistnamen. `Lessen/spelen.js`'s router (`render()`) maakt bij elke activiteit-
routewissel een nieuwe sessie aan en zet die op `instance.currentSession` — puur technisch bijgehouden,
niet gekoppeld aan enige echte voortgangslogica.

## Navigatie
`AppContext.NAV_DESTINATIONS = ['home', 'module', 'activity', 'world', 'lesson', 'collection']` — puur
technisch vastgelegd; de bestaande router (`render(next, params)` in `Lessen/spelen.js`) is niet herschreven,
alleen aangevuld om bij elke wissel de AppContext bij te werken. Mijn collectie en Lessen zijn niet
inhoudelijk gebouwd — alleen deze technische aansluitpunten bestaan.
