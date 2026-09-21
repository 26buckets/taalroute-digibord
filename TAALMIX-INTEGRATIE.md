# Taalmix — complete set A1–B2

240 uitgewerkte kaarten: per niveau 40 taalvormen en 20 beeldrebussen, verdeeld over 20 instappers, 20 vervolgkaarten en 20 uitdagingen. De 18 bestaande taalkaarten worden hergebruikt op hun oorspronkelijke ID; 142 nieuwe taalkaarten en 80 beeldrebussen komen erbij. De overige 22 kaarten uit de oorspronkelijke idiomenfamilie blijven apart beschikbaar. Alle 320 oorspronkelijke kaart-ID's blijven bestaan; de kaartenkast heeft nu 542 records.

`data/card-games.json` en `data/kaartenkast_320.json` bevatten dezelfde kaarten. De bestandsnaam van de kaartenkast blijft behouden voor bestaande importverwijzingen. `node scripts/sync-card-games.cjs` maakt `data/taalmix.js` uit de idiomenfamilie in `data/card-games.json`. Dit bestand wordt na de beschermde basisbundel geladen. De basisbundel, de 1.200 bordopdrachten en alle borgingshashes blijven ongewijzigd. Wijzig beide kaart-JSON's per ID en controleer de pariteit met `npm test`.

De 80 toegevoegde PNG's in `assets/rebussen/` zijn ongewijzigde originelen uit de beeldbank; `visualRebus.driveUrl` verwijst naar het losse bestand in Google Drive. De volledige beeldbank blijft 282 afbeeldingen bevatten. De 202 beelden buiten deze selectie zijn geen onderdeel van de 240 gemengde kaarten.

De interface biedt een aparte keuze voor niveau, opbouw, soort en de overige bestaande kaarten. Puzzelbelasting is een afzonderlijk veld. Oplossingen verschijnen pas na een eigen poging. Bij een lege filtercombinatie blijft de filterbediening beschikbaar. Lokale voortgang, groepen en pionnen worden niet vervangen; de bestaande revisiecontrole ververst alleen de actieve kaartinhoud.

De niveau-indeling is een didactisch aanbodadvies. AI-redactie en technische tests zijn uitgevoerd; menselijke beoordeling en lesproeven zijn niet uitgevoerd. Die status blijft zichtbaar en wordt niet als afgerond geregistreerd.

Validatie: `npm test`, `npm run lint`, `npm run types`, `npm run test:activities`, `npm run test:banks:browser`, `npm run smoke`, `npm run test:tongue:browser`, `npm run test:taalmix:browser`, `npm run build` en `node tests/deployment.cjs`. De nieuwe browsercontrole doorloopt alle 240 kaarten en laadt alle 80 toegevoegde afbeeldingen. Publiceer uitsluitend `dist/` via de bestaande GitHub/Cloudflare-route.

## Meenemen in de volgende GitHub-ronde

Gebruik de voorbereide branch `codex/taalmix-compleet`. Deze bevat de volledige Taalmix-integratie (`5e8c74d`), de taalreview van alle 262 kaarten (`0c27ff3`) en het reeds toegevoegde importpakket voor de 240 tongbrekers (`20cd2c4`). De tongbrekerimport is voorbereide inhoud en vervangt nog niet de actieve tongbrekerbank. De actuele GitHub-basis tot en met `79f9f46` is samengevoegd, inclusief het inklapbare bordmenu, de fullscreen-correctie, uitlegknoppen, geluid, donkere modus en de zichtbare niveaukeuze. De kaarten en hun 90 afbeeldingen zijn opgenomen in Git en in de productiebuild; de review is beschreven in `TAALMIX-TAALREVIEW.md`.

De branch is lokaal voorbereid. Er is in deze voorbereidingsronde niet gepusht of live gepubliceerd. Neem de hele branch mee bij de volgende push en samenvoeging naar `main`; alleen een push van een andere branch neemt deze wijzigingen niet mee.

De aanvullende wijziging uit PR #11 (`558ffbf`) is éénmaal opgenomen met behoud van deze actuele bordopties. Er is één Oefening-selectie boven Spelvorm, Snelvragen is de standaard bij een nieuwe sessie, bestaande voorkeuren blijven behouden, de opties zijn compacter en de rode dobbelsteen staat stil en is scherp vóór de eerste worp. De aanvullende browsertests controleren ook de combinatie met uitleg, geluid en donkere modus. Pas PR #11 niet nogmaals apart toe op deze branch.
