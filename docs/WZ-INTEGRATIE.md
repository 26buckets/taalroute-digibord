# Woorden en zinnen — audit, herstel en integratie

Peildatum: 21 september 2026. Status: **lokaal geïmplementeerde docentpreview; niet gepubliceerd en niet didactisch vrijgegeven**.

De bestaande DigiBord-shell is behouden. De WZ-bank is aangesloten op dezelfde Activity Shell, kaartbediening, beurtwisseling, hulpvensters en zinnenbouwer. Er is één bewerkbare appbron: `Lessen/woorden-zinnen.json`. De browser leest uitsluitend de daarvan gegenereerde `words-content.js`. Een bron-/bundelcontrole blokkeert een build bij verschillen. Er is geen nieuwe grammatica-generator toegevoegd.

## 1. Onderzochte bronnen en bewijsgrens

- Actuele GitHub-repository `26buckets/taalroute-digibord`, actuele basiscommit `f6df704` (inclusief de nieuwste Zwolle-routekleuren uit PR #17).
- Actieve V01.24: `words-activity.js`, `app.js`, `index.html`, `new-activities.js`, gedeelde stijlen, opslag en tests.
- Historisch Woordspel: tag `archive/pre-v0124-20260921`, commit `0aae53a943630ff573b1d9b42ecc69ea3014562b`; bestanden `Woordspel/woordspel-content.js`, `Woordspel/woordspel-table.js`, `Woordspel/woordspel.js`, `Praatpad.html` en `digiboard.js`.
- [Google Drive-masterbank](https://docs.google.com/spreadsheets/d/14BWnJEpoph7EJoizneSZibl70gA1_ToQkjloXRAbnlw/edit): alle 680 rijen en 21 kolommen van `Masterbank!A1:U681`, plus Review 3, Advocaat van de duivel en Samenvatting.
- [00 START HIER](https://docs.google.com/document/d/12LnrISwFJ0XW7ygpp39h4KMq76eiO5z0Evye2Y-71lc/edit).

Alle bronitems zijn gelezen en structureel gecontroleerd. Dit is AI-redactie plus geautomatiseerde en visuele appcontrole, geen onafhankelijke menselijke taalreview, CEFR-kalibratie of lespilot. De vorige claim dat er geen inhoudelijke blokkades meer waren, wordt door de brondata weersproken. Het rapport beschrijft aantoonbare problemen en open reviewcategorieën; het garandeert niet dat iedere mogelijke taalkundige afwijking is gevonden. De publieke app is niet gewijzigd of als productie-uitkomst getest.

## 2. Wat bestond er al?

| Onderdeel | Actieve V01.24 bij aanvang | Historisch Woordspel | Besluit |
|---|---|---|---|
| Globale shell | Werkende navigatie, instellingen, deelnemers, beurtwisseling, Terug, fullscreen | Eigen Praatpad-host | Actieve shell behouden; oude host niet terugplaatsen |
| Woorden en zinnen Activity Shell | Werkende kaartenstapel, actieve kaart, hulp, voorbeeld, oefenvormzijbalk | Eigen interface | Bestaande Activity Shell uitbreiden |
| Bouw een zin | 30 kaarten: 10 hoofdzinnen, 10 andere start, 10 bijzinnen; tikken, slepen, toetsenbord, voorbeeldcontrole | 12 zinsdeelkaarten, 3 per A1/A2/B1/B2 | 30 kaarten exact behouden; dezelfde bouwer voor WZ en de 12 geïmporteerde historische kaarten |
| Maak en verander | Uitgeschakelde tegel; `startWords` negeerde het gewenste subtype | Werkende vrije kaartentafel en 24 taakpresets | WZ Herstel/Verander nu speelbaar; vrije tafel vraagt afzonderlijke datamigratie |
| Beschrijf en raad | Uitgeschakelde tegel | 16 woorden met elk 3 aanwijzingen en stapsgewijs onthullen | 16 kaarten geïmporteerd; dezelfde shell, stapsgewijze aanwijzingen en expliciet onthullen; geen automatische score |
| Combineer en beschrijf | Uitgeschakelde tegel | 5 zelfstandige naamwoorden, 7 eigenschappen, compatibiliteitslijsten en 24 taakpresets | Niet gelijkstellen aan WZ Transfer. Koppelingen en criteria behouden bij latere import |

Het oude Woordspel bevat bovendien 6 onderwerpen, 13 werkwoorden met vervoegingen, 13 contextsets, 10 tijdsaanduidingen en 10 verbindingswoorden. De generator heeft al compatibiliteitsregels en slotjes. Hij is niet een lege placeholder, maar bevindt zich buiten de huidige runtime. Zijn niveaupresets A1–B2 zijn geen officieel gevalideerde woordniveaus.

## 3. Feitelijke WZ-aantallen

| Taaldoel | Items |
|---|---:|
| WZ_001 Gewone hoofdzin | 80 |
| WZ_002 Onderwerp en persoonsvorm | 80 |
| WZ_003 Tegenwoordige tijd | 80 |
| WZ_004 Ja/nee-vraag | 80 |
| WZ_005 Vraagwoordvraag | 80 |
| WZ_006 Niet | 80 |
| WZ_007 Geen | 80 |
| WZ_008 Modale werkwoorden | 80 |
| WZ_006_007 Niet of geen | 40 |
| **Totaal** | **680** |

Bouw 122, Kies 106, Herstel 106, Verander 144, Spreek 144, Transfer 58. **478 gesloten en 202 open**; niet 192 open zoals de Review 3 vermeldt. De appbron bevat daarnaast de 30 behouden kaarten: en de 28 geïmporteerde historische kaarten: totaal **738 records**, waarvan 680 WZ.

## 4. Inhoudelijke bevindingen en concrete reparaties

In 134 WZ-items zijn 175 bronvelden veranderd. Alle WZ-ID's en aantallen zijn behouden. `WZ-WIJZIGINGEN.json` bevat per wijziging het ID, veld, oude waarde, nieuwe waarde en de reden. De wijzigingen staan in de appbron; de Google Sheet is niet overschreven.

| Bevinding in de oorspronkelijke bron | Impact | Herstel / grens |
|---|---|---|
| 37 Kies-items met dubbele opties; daarvan 22 met hetzelfde juiste antwoord onder meer dan één letter | Onbetrouwbare automatische beoordeling | Duplicaten in WZ_002/003/004 verwijderd; twee opties behouden. WZ_008_K01 kreeg een echte vormafleider |
| 101 van 106 juiste keuzes op A, slechts 5 op B | Antwoordpositie is een raadstrategie | Antwoordidentiteit blijft stabiel; zichtbare opties worden per nieuwe kaart geschud en bij hervatten behouden |
| Kunstmatige vormen zoals `wachtt`, `makt`, `betalt`, `blijvt`, `kokt`, `nemt`, `kopt` in WZ_008 | Meet onbedoeld spelling of herkenning van nonsens | Alle 12 C-opties van WZ_008 toetsen nu een bestaande persoonsvorm waar een infinitief hoort |
| 18 gesloten WZ_001-Veranderitems zeggen alleen “Verander het laatste deel” | Het model is één van onbeperkt veel juiste antwoorden | Exacte oude en nieuwe woordgroep staan nu in de opdracht |
| WZ_003_V02 en V12 veranderen niets; meerdere andere V-items vervangen alleen een naam | Geen bewijs van werkwoordproductie | Alle 18 V-items richten zich expliciet op een persoonsverandering die ook de werkwoordsvorm verandert |
| `Zij eten om twaalf uur` wordt in WZ_003_H12 als fout behandeld | Kan een volledig correcte meervoudszin zijn | Enkelvoudbetekenis expliciet gemaakt |
| 14 waarom/welke/hoeveel-items staan in band 1 of 2 ondanks de eigen bronafspraak | Instap en latere A1 worden vermengd | Die 14 items naar band 3. Dit is toepassing van de bronafspraak, geen nieuwe officiële niveauclaim |
| WZ_007-Kies vraagt een “goede zin” terwijl een bevestigende optie ook goed is | Opdracht heeft meerdere grammaticaal geldige antwoorden | Ontkennende zin met `geen` expliciet gevraagd |
| WZ_004/005-keuzes bevatten intonatievragen als afleider | Een gebruikelijke vraagvorm kan ten onrechte fout lijken | Expliciet vragen naar werkwoord-eerst respectievelijk vraagwoordvraag |
| 7 open WZ_002-kaarten verwijzen naar “dezelfde zin” of “daarna” zonder bronzin | Kaart werkt niet zelfstandig na filteren of trekken | Zelfstandige opdracht/context toegevoegd |
| 4 exacte taakduplicaten tussen WZ_001 en WZ_003: S05/S17, S07/S14, S09/S15, S15/S13 | De eerdere claim nul taakduplicaten klopt niet bij vergelijking van leerlingtaak en model | Vier WZ_003-opdrachten nu expliciet op werkwoordproductie gericht |
| Buurman praat met “mijn buurman”; kinderen spelen met “de kinderen”; enkele kind/werkcombinaties | Onduidelijke referentie of minder geschikte context | Gericht gecorrigeerd; werkcontext waar nodig naar cursisten |
| WZ_008_S01/S12 zijn vrijwel dezelfde taak | Schijnvariatie | S12 vraagt nu over iemand uit de groep |

De oorspronkelijke bank bevat 62 groepen met hetzelfde gesloten antwoordmodel, samen 186 records. Dat is niet automatisch fout: herkennen, bouwen en zelfstandig produceren kunnen bewust hetzelfde taalpatroon herhalen. Het aantal unieke IDs bewijst echter geen didactische variatie.

## 5. Inhoudelijk nog open

- **WZ_001/002/003 blijven gedeeltelijk overlappen.** De 28 Bouw-items van WZ_002/003 geven het vervoegde werkwoord al. Ze oefenen ordenen en herkennen, niet zelfstandig vervoegen. Dat is per item vastgelegd. Bij zelfstandig controleren van beheersing mogen ze niet als gelijkwaardig bewijs tellen.
- **De 10 contrast-Bouwitems geven niet/geen al weg.** Ze zijn bruikbaar als zinsbouwsteun, maar toetsen de keuze tussen beide woorden niet. Die beperking staat per item in de bron.
- **Moeilijkheid is onvoldoende gekalibreerd.** Veel eenvoudige zinnen staan in band 3, terwijl vergelijkbare zinnen in band 1 staan. De oorspronkelijke 200/230/250-verdeling is na het specifieke herstel 194/222/264. Een mooie verdeling is geen validiteitseis. Docenten moeten per doel hulp, taakcomplexiteit en leeslast beoordelen.
- **Alle 58 Transferitems staan in band 3.** Daardoor is Transfer in de instapselectie niet beschikbaar. Er is geen automatische verschuiving naar een hogere band. Er zijn nog eenvoudige communicatieve toepassingen voor de instap nodig.
- **263 contextlabels zijn generiek:** 158 “Praktisch” en 105 “Dagelijks leven”. De contextfilter werkt, maar een redacteur moet de labels inhoudelijk preciezer maken.
- **Afleiders blijven soms makkelijk**, zoals een bevestigende zin naast een gevraagde ontkenning. Schrappen van duplicaten en schudden maakt de oefening technisch correct, maar bewijst geen goede discriminatie.
- **Herstel bevat soms kunstmatige foutpatronen**, met name alle 12 geen-Herstelitems. De app toont na controle onmiddellijk een correct model. De representativiteit van de fouten moet didactisch worden gereviewd.
- **Sommige modale zinnen missen een functionele aanleiding**, bijvoorbeeld verplicht koffie drinken (WZ_008_K06/V02) of goed moeten fietsen (V10). Grammaticale vormcorrectheid is nog geen natuurlijke communicatieve context.
- **Antwoordmodellen zijn niet uitputtend.** Bij WZ_006 kan een andere positie van `niet` met een passende context een andere geldige betekenis opleveren. Alleen een bekende variant wordt automatisch bevestigd; andere tekst krijgt een bespreekmelding, geen automatische foutscore.
- **Open modellen zijn meestal letterlijk “Open antwoord”.** Dat is geen bruikbaar voorbeeld. De app toont dan het bestaande succescriterium; er worden geen verzonnen voorbeeldantwoorden als broninhoud gepresenteerd. Concrete voorbeeldantwoorden en een korte rubric blijven redactiepunten.
- **Geen WZ-instructieaudio, langzame modellen of opnamefunctie toegevoegd.** Dit is een klassikale docentpreview met voorlezen/voordoen. Geen claim van zelfstandig bruikbaar audio-eerst leermateriaal voor ongeletterde A0-leerders.
- De app bewaart de huidige oefening en het antwoord, maar voegt geen volledig pogingenlog, beheersingsscore of adaptieve herhaling toe.
- Geen menselijke review, schermlezer-luistertest of lespilot uitgevoerd. Technische toegankelijkheid is gecontroleerd via labels, statusmeldingen, focus, toetsenbord en tikbediening.

Deze punten worden niet afgedekt door de oude `PASS`-velden. De nieuwe reviewgegevens bewaren de oude claims als bronmetadata en melden menselijke review/pilot als `pending` en publicatie als `preview`.

## 6. Geïmplementeerde appstructuur

1. Woorden en zinnen en de activiteitenbibliotheek openen eerst de negen taaldoelen.
2. Na een taaldoel kiest de docent een band, daarna Bouw/Kies/Herstel/Verander/Spreek/Transfer; context is een filter. Onbeschikbare vormen zijn uitgeschakeld met telling 0.
3. Contrast begint in band 2 omdat er geen contrastitems in band 1 zijn. De selectie valt nooit stilzwijgend terug naar een andere band.
4. Bouw gebruikt de bestaande tik-/sleepbouwer met **bronbouwstenen**, dus woordgroepen blijven behouden.
5. Kies gebruikt expliciete opties met stabiele antwoord-ID's. Herstel/Verander gebruiken een eenvoudig tekstveld en dezelfde feedbackzone.
6. Spreek/Transfer geven instructie en bespreekcriterium, zonder controleknop. Ook een rechtstreekse aanroep van de beoordelingsfunctie kan deze items niet scoren.
7. WZ-selectie, kaart, volgorde en ingevoerd tekstantwoord worden hervat. Terug gebruikt de bestaande actiegeschiedenis. Deelnemers, pionnen en instellingen blijven bewaard.
8. De globale niveauplek toont binnen WZ A0–A1; de band staat bij het taaldoel. Een oude globale A2/B2-keuze verandert de WZ-inhoud niet. Bij het verlaten wordt de gewone niveaukeuze hersteld.
9. Spelhulp, spelregels en opties geven binnen WZ de juiste uitleg. De bestaande globale vormgeving, footer en navigatie blijven in gebruik.
10. De 30 bestaande kaarten blijven apart herkenbaar bereikbaar, met identieke teksten/hulp/voorbeelden/volgorde en stabiele IDs `LEGACY_WORD_001` t/m `LEGACY_WORD_030`. Hun hogere structuren worden niet als WZ A0-instap gepresenteerd. Op lage laptopschermen is ruimte vrijgemaakt zodat de spreekbediening niet wordt afgesneden.

### Centraal datacontract

| Veld | Betekenis |
|---|---|
| `id`, `goalId`, `goal` | Bestaand WZ-item-ID, taaldoel-ID en leesbare naam |
| `type` | Bouw/Kies/Herstel/Verander/Spreek/Transfer, plus Raad voor historische raadkaarten |
| `level`, `band`, `context` | Bronroute A0 tot A1, moeilijkheidsband en inhoudelijke context |
| `instruction`, `stimulus`, `tokens`, `options` | Expliciete inhoud; geen vrije recombinatie |
| `answerType` | OPEN of GESLOTEN |
| `answerModel`, `acceptedAnswers`, `correctOptionId` | Model, expliciet geaccepteerde varianten en juiste keuze-ID; open items hebben geen geaccepteerde exact-antwoorden |
| `feedback` | Hint of bespreekcriterium |
| `constructionIds`, `tags` | Behouden TLE-bronconstructies en inhoudelijke tags |
| `legacyRef`, `tokenRoles`, `clues` | Herleidbare broncommit/-positie, behouden zinsdeelrollen en oorspronkelijke raadaanwijzingen |
| `source`, `review` | Herkomst, oorspronkelijke reviewclaims, nieuwe redactiestatus, menselijke review/pilot/publicatie |

De scorefunctie negeert uitsluitend hoofdletters, herhaalde witruimte, rechte/typografische apostroffen en afsluitende zinspunctuatie. Ze corrigeert geen woorden, verbuigingen of ontkenningen. Bij gesloten tekst betekent `correct`: past bij een expliciet antwoordmodel; `review`: andere formulering, docent beoordeelt. Dat is geen algemene Nederlandse grammaticacontrole en geen beheersingsscore.

### Eén bron, geen twee redactiesystemen

De centrale JSON is vanaf deze wijziging de bewerkbare appbron. De Sheet is de herleidbare overdrachtsbron en blijft ongewijzigd; er is geen live tweewegsynchronisatie. Bewerk toekomstige appinhoud in de JSON, genereer de browserweergave met `npm run sync:words` en controleer bronpariteit met `npm test`/build. Een nieuwe Drive-versie wordt alleen als gecontroleerde ID-/veld-diff overgenomen, met voorafgaande back-up en behoud van lokale correcties. De wijzigingslijst is een auditdocument, geen tweede runtimebank.

## 7. Migratie van oud Woordspel zonder verlies

**Uitgevoerd:** de 30 actieve kaarten én alle 12 historische Bouw-kaarten en 16 raadkaarten staan in `Lessen/woorden-zinnen.json`. Alle historische tekst, zinsdelen, zinsdeelrollen, toelichtingen, doelwoorden en aanwijzingen zijn overgenomen. De archiefbron is vastgezet op commit `0aae53a943630ff573b1d9b42ecc69ea3014562b`. Elk item bevat zijn bronpad en oorspronkelijke positie in `legacyRef`.

- IDs: `LEGACY_WS_BUILD_A1_01` t/m `LEGACY_WS_BUILD_B2_03` (drie per niveau) en `LEGACY_WS_GUESS_001` t/m `LEGACY_WS_GUESS_016`.
- De importer maakt vóór schrijven een gedateerde back-up, voegt alleen ontbrekende IDs toe, weigert conflicterende lokale wijzigingen en schrijft via een tijdelijk bestand. Tweemaal uitgevoerd: 28 toegevoegd, daarna 0. Gebruik `npm run import:wordspel`; voor alleen vergelijken `node scripts/import-wordspel.cjs`. De vastgezette archiefcommit moet lokaal beschikbaar zijn; zo nodig eerst de bestaande archieftag ophalen. De app zelf leest het archief nooit.
- De oorspronkelijke Bouw-doelen gewone hoofdzin en ja/nee-vraag gebruiken WZ_001 respectievelijk WZ_004. De overige tien structuren hebben eigen expliciete WS-doelen in dezelfde bron. Ze worden niet ten onrechte in de A0–A1-bank gedwongen. De historische collectie opent ook eerst het taaldoel; daarna volgt de oefenvorm.
- Bouw gebruikt de bestaande bouwer, inclusief woordgroepen. Raad voegt binnen dezelfde shell alleen aanwijzingen en een verborgen doelwoord toe. Spreek, Transfer én Raad zijn ook in de gedeelde controlefunctie beschermd tegen exacte scoring.
- Raad heeft standaard alle 16 kaarten; met het niveau kun je filteren op het oorspronkelijke `min`-niveau, nu opgeslagen als kaartniveau. Anders dan het oude spel mengt de expliciete niveaukeuze geen aangrenzend lager niveau bij. Alle oorspronkelijke `min`-waarden zijn bewaard; deze presets zijn niet opnieuw CEFR-gevalideerd.
- Nieuwe historische voortgang (kaart, filter, bouwstenen, aanwijzingen en onthuld woord) gebruikt dezelfde versie-4-opslag en dezelfde Terug-functie als WZ. Bestaande WZ-opslag zonder de nieuwe optionele bronvelden blijft leesbaar.
- **Oude Praatpad-voortgang is behouden, maar nog niet vertaald.** Er zijn geen oude browseropslagsleutels gelezen, vervangen of verwijderd. Deze import betreft de 28 contentkaarten, niet opgeslagen groepen/lessen uit een andere app of origin.

**Resterend migratiepad:**

1. Implementeer export/import van oude lesopslag met voorafgaande export/back-up van zowel oude als huidige gegevens. De oude sleutels zijn `taalroute-praatpad-les-v2` en `taalroute-digiboard-les-<mapId>-v1`, plus reserves. Vertaal `data.wordspel` en oude indices via de nu aanwezige `legacyRef`; behoud originele snapshots. Weiger onbekende of gewijzigde records afzonderlijk, zonder data te wissen. Bij verschillende hosts is expliciete bestandsoverdracht nodig.
2. Importeer daarna de 5 naamwoorden, 7 eigenschappen, toegestane combinaties en 24 combineerpresets als centrale data met open opdrachtcriteria. Willekeurige combinaties blijven uitgesloten.
3. Breng vervolgens de vrije Maak en verander-tafel over: 6 onderwerpen, 13 werkwoorden, vervoegingen, contextregels en 24 taakpresets. Hergebruik de compatibiliteitsregels. De oude generator wordt hoogstens een afgebakende voorstel-/voorbeeldfunctie achter hetzelfde contract, geen tweede bank of grammaticabeoordelaar.
4. Test vertaling van indices, slotjes, geplaatste bouwstenen, hervatten, Terug en herhaalde import met echte geëxporteerde lesbestanden. De import wist de bron nooit.

**Eerstvolgende technische stap na code-review en integratie in main:** een importer voor daadwerkelijk geëxporteerde oude lesvoortgang, met behoud van origin/snapshot en vertaling naar de nu vaste kaart-IDs. Inhoudelijke docentreview en lespilot blijven nodig voordat deze docentpreview wordt vrijgegeven. Publicatie is niet uitgevoerd.

## 8. Verificatie

De definitieve testresultaten en eventuele beperkingen staan in het bijgeleverde opleververslag. Kerncontroles zijn: schema en alle 680 IDs, bron-/bundelpariteit, alle 680 renders, negen taaldoelen via echte bediening, zes WZ-vormen plus Raad, alle 28 historische renders, open beoordelingsguard, gesloten antwoorden, filters, hervatten/Terug, behoud van bestaande data en 30 kaartteksten, toetsenbord/tik en desktop/tablet/smal scherm. Daarnaast draait de bestaande appregressie voor de andere banken en spellen.

De bestaande `npm run types` controleert alleen `board-viewport.js`; dit is geen claim dat de nieuwe JavaScript volledig statisch getypeerd is. De nieuwe logica wordt door lint, uitvoerbare inhoudstests en browsertests gecontroleerd.
