# Slim kaartschudden met geheugen — v1.25

Opdracht: Nico, 4 oktober 2026. Deze wijziging gaat uitsluitend over kaartvolgorde. Taalworp Selector v1.1 en inhoudelijke kaartreviews zijn afzonderlijke opdrachten.

## Broncontrole

Drive is gecontroleerd op kaartschudden, schudden, shuffle, geheugen, currentCardId, reshuffle en eligible, plus de volledige centrale overdrachtmap. Geen afzonderlijke vastgestelde shufflespecificatie of implementatie gevonden. Het functionele contract is daarom de expliciete gebruikersopdracht en de daarin aangehaalde bouwprompt; niet een verzonnen Drive-specificatie.

Gelezen Drive-bronnen:
- CHAT-OVERDRACHT.md: `1Oh1crwgXhuchG04rhkSQ55es2S3uvZZF`, gewijzigd 3 oktober 2026.
- OPEN-WERK.md: `1geCswfYsBMu14KeSwNKZoh8JLbeDn1zy`, gewijzigd 3 oktober 2026.
- Sluitcontrole routes WZ en kaarten: `16OZzSHzYpEI1p9tJKCT5FJZOjOT2sa4p`.
- Hoofdmap: `1LertxIY2VeDDWewY4dZK6JOGjdZ6Vu25`.

De actuele basis is `17b08dc93f303ded3edf56205bc3fb09ca7ead9b`, branch `codex/digibord-v1.25`. Daarin bestond sequentieel bladeren en opslag van een arraypositie, maar geen centrale kaartqueue. De oorspronkelijke werkmap bevat ongecommitteerd selectorwerk. Deze wijziging is gemaakt in een aparte werkboom van diezelfde gepubliceerde basis en bevat dat selectorwerk niet.

## Werking

`card-shuffle.js` is één centrale engine. De bestaande route-, vrijgave- en lesselectie bepaalt de eligible IDs. De engine bepaalt uitsluitend hun volgorde: Fisher–Yates één keer per resterende voorraad, daarna uit de opgeslagen queue trekken. De huidige kaart telt als gezien zodra zij wordt getoond. Er vindt geen nieuwe loting per klik plaats.

De zeven families en tongbrekers hebben elk een eigen geheugen. Nederlands tussen de regels deelt geheugen onder `between-lines`, ook bij een nieuwe voorbereide selectie. Overige voorbereide kaartlessen bewaren hun deck per onveranderlijke sessie-ID. Zo blijft de gekozen lesinhoud exact behouden. De oude, publiek verborgen C1-archiefweergave behoudt haar oorspronkelijke vorige/volgende-gedrag; de publieke verbeterde bank gebruikt de centrale engine.

Bij een route/filterwijziging blijft de huidige kaart staan als haar ID nog geldig is. De queue behoudt haar volgorde voor resterende geldige IDs; nieuwe ongeziene IDs worden geschud toegevoegd. Gezien-geheugen buiten het actuele filter blijft behouden. Alleen IDs die niet meer in de bekende familie voorkomen worden verwijderd. Een lege selectie wist de familiehistorie niet.

Een cyclus eindigt wanneer alle kaarten van de actuele geldige selectie gezien zijn. Een nieuwe cyclus maakt alleen de IDs van die selectie opnieuw beschikbaar; geheugen voor andere routes blijft staan. De laatste kaart mag bij twee of meer geschikte kaarten niet meteen opnieuw verschijnen. Bij één kaart is herhaling onvermijdelijk. Bewust Terug/undo is navigatie, geen nieuwe trekking.

## Opslag

Additief in bestaande `APP.cardShuffles`, binnen `taalroute-digibord-v020`. Geen tweede zelfstandig opslagmodel. Opgeslagen velden per deck: `schemaVersion=1`, `family`, `route`, `eligible`, `queue`, `used`, `currentCardId`, `lastCardId`, `cycle`, `position`, `history`, `cursor`, `resetCount`.

Voor de eerste wijziging worden de oorspronkelijke app- en undo-opslag letterlijk bewaard onder `taalroute-card-shuffle-v1-backup`. Bestaande gebruikers hervatten eerst hun huidige geldige kaart; er wordt geen vroegere gezien-historie verzonnen die de oude app niet opsloeg. Bestaande kaartlessen krijgen het deck als optioneel, gevalideerd veld in hun bestaande IndexedDB-voortgang. Oude voortgang zonder dat veld blijft hervatbaar. Nieuwe ID-based voortgang wordt gecontroleerd tegen de onveranderlijke sessie.

Elke trekking, reset en herstel wordt meteen opgeslagen via de bestaande save/checkpoint-route. Refresh, menu, familiewissel en hervatten verbruiken geen kaart en schudden niet opnieuw. Opslag is apparaat/browsergebonden, zoals de bestaande app.

## Bediening en tests

`Kaartvolgorde opnieuw beginnen` is een expliciete actie met bevestiging, alleen voor de actuele familie/sessie. Andere decks en pionnen blijven bewaard. De bestaande undo kan de reset herstellen. Sinds de correctie van 4 oktober 2026 staat alleen een kleine shuffle-icoonknop naast Volgende kaart, met dezelfde bevestiging. De kaart past zich aan de beschikbare schermhoogte aan, ook na fullscreen, resize en het openen van hulp of antwoorden; tekst wordt alleen verkleind wanneer dat nodig is om scrollen te voorkomen. Op smalle schermen opent een kaarticoon de bestaande kaartkeuze. Voorlezen is grijs en uitgeschakeld, zonder extra statustekst. Shufflelogica staat los van de animatie en respecteert zowel de appinstelling als de systeemvoorkeur voor minder beweging.

`npm test` bevat de enginecontrole. `npm run test:shuffle:browser` controleert de 48 zelfstandige route/familiecombinaties plus 19/31 publieke tussen-de-regelskaarten, alle negen families, volledige cycli, grensherhaling, route/filteroverlap, refresh, familie- en leshervatten, reset/undo, legacy-back-up, vrijgavegrenzen, desktop/mobiel en beide bewegingsvoorkeuren. `BUILD_SMOKE=1` test dist; `LIVE_URL=...` test de publicatie. `SCREENSHOT_DIR` bewaart visueel bewijs.

Presentatie-audits selecteren hun testkaart expliciet als migratiefixture. Tests van de kaartvolgorde controleren nu echte kaart-ID’s, opgeslagen queue en cycluspositie in plaats van een oplopende bronarray-index. Inhoudelijke bronhashes en vrijgave-aantallen zijn niet aangepast.

De definitieve testlog, commit, deployment en live-regressie worden vastgelegd in Drive-map `1vSKdyBbuApozUjld2bFyQCtEmYg7LW2Q`.
