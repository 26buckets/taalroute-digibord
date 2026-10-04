# Zinnenbouwer V1 — bouwkaart, 4 oktober 2026

## Basis en analyse vóór implementatie

Basis: actuele productbranch `origin/codex/digibord-v1.25`, commit f211035. GitHub main is de oudere V01.24-app en is daarom niet de implementatiebasis. Eigen lokale branch `codex/zinnenbouwer-v1`; andere werkkopieën blijven intact.

De app gebruikt klassieke JavaScript, globale appstate, DOM-renderers, CSS en een statische Cloudflare Workers-build. Geen React of serverframework. `app.js` beheert schermen, `new-activities.js` de zeven interactieve werkvormen; releasebeleid leidt hun ingang naar `ContentUI.open`. `lesson-storage*` bewaart bestaande lessen/lokale groepen. Deze opslag en de bestaande contentbanken veranderen niet. De bestaande rangschik-oefening gebruikt vaste teksttokens en is geen bruikbare grammaticamotor.

Live is uitsluitend een disabled landingskaart met regressiecontract. Geen sessieserver, QR-bibliotheek, WebSocket/SSE-client, deelnemersauthenticatie of Live-opslag aanwezig. Er is dus geen geschikt Live-systeem dat dubbel zou worden gebouwd. De bestaande `wrangler.jsonc` serveert alleen statische bestanden.

Style Control is in deze repository een CSS-/browsertestcontract, geen componentbibliotheek. Hergebruik: systeemletters, 400/500, Lucide-lijniconen, blauwe rustige knoppen, minimaal 44 px, bestaand logo; settings.css/open-quiet.css en de bindende lokale referentie zijn gelezen/bekeken. Grote zinskaarten krijgen eigen projectietypografie. Geen herindeling van bestaande schermen.

## Bouwbesluiten en bestanden

- Nieuwe `zinnenbouwer.html` docentpagina en `meedoen.html` minimale deelnemerspagina. De eigen tegel in de werkvormencatalogus opent direct het bewaarde bord; instellingen staan in een docentdialoog. De oude Live-tegel en zijn contract blijven staan. De nieuwe Start Live-actie staat in Zinnenbouwer, zoals gevraagd. Afzonderlijke pagina's passen bij de bestaande instellingenroute en isoleren legacy globale spelstate.
- `zinnenbouwer/model.mjs`: versieerbaar functies-/werkwoordmodel en invoercontrole. `grammar.mjs`: pure, afzonderlijke regels; geen UI, netwerk, AI of lijst voorbeeldzinnen. `exercise.mjs`: projecties op één activiteit. `review.mjs`: canonieke groepering.
- `board.mjs` en `style.css`: gedeelde kaartweergave, Pointer Events voor muis/touch, klikken en toetsenbord als alternatief, undo. `teacher.mjs` en `participant.mjs`: hun eigen schermflow. `live-client.mjs`: verbinding, herstel en foutmeldingen.
- `session.mjs`: sessiestatus, ronde, idempotente antwoorden en rolgebonden projecties. `worker/live.mjs`: één Durable Object per korte code, servervalidatie met dezelfde motor, WebSockets, docenttoken, tijdelijke deelnemertokens, automatische gegevensverwijdering. Geen accounts/profielen. Dit is de noodzakelijke uitbreiding van de bestaande statische hosting; geen externe database of tweede backend.
- `wrangler.jsonc`: worker-ingang, ASSETS-binding, Live-binding/migratie. `scripts/build.cjs`: uitsluitend browsermodules en QR-vendor meebouwen; worker/test/documentatie niet in dist. Eén kleine QR-bibliotheek, geen eigen QR-implementatie.
- `tests/zinnenbouwer*.mjs`: motor, oefeningen, sessies en echte browser-/multi-clienttests tegen lokale Cloudflare-runtime. `package.json`, lockfile, lintconfig en typecheckconfig: voeg deze modules aan verplichte controles toe.

## Volgorde en acceptatie

Eerst model en motor met unit tests; dan klassikaal en vier oefenvormen; daarna Live, mobiel, bespreken/vergelijking/nieuwe ronde; dan regressie. GO alleen met werkende kerncriteria, groene build en relevante bestaande regressie. Geen publicatie zonder expliciete opdracht. Een lokale browser-/touchsimulatie is geen fysieke telefoon- of klasproef.

V1 toetst zinsdelen/posities en expliciet opgegeven werkwoordvormen. De docent levert passende woorden en vervoegingen. Congruentie, betekenis en toekomstige bijzinnen/complexere werkwoordgroepen zijn geen impliciete V1-beloften. Het model reserveert de gevraagde vormen; niet-ondersteunde grammatica wordt expliciet geweigerd.

## Uitgewerkte grenzen

De bestaande app is bewust niet omgezet naar een framework. De engine en sessieregels zijn kleine ES-modules; de gedeelde kaartcontroller gebruikt Pointer Events plus native knoppen en toetsenbord. `tsconfig.json` controleert zowel alle browsermodules als de worker. Draggen naar voren herschikt uitsluitend de gekozen kaart. Correcte structuur tonen is een afzonderlijke docentactie. Vaste delen van Zin afmaken worden ook op de server gehandhaafd.

Zinsmodel, grammatica, oefeningen, UI, sessie en bespreking blijven gescheiden. De worker importeert exact dezelfde `validate()` als de docent. Ingezonden tekst wordt niet vertrouwd: deelnemers sturen alleen component-ID's; de server controleert IDs, volledigheid, ronde, vaste delen en deelnemersrol en maakt de zin zelf. Woordkeuze, verbuiging/vervoeging en betekenis zijn verantwoordelijkheden van de docent; de UI zegt daarom dat de **structuur** klopt. V2 kan nieuwe modelversies, clausetypen, componenttypen en regelcollecties toevoegen zonder sessie- of kaartinteractie te kopiëren.

## Live en bewaring

Eén Cloudflare Durable Object per zescijferige code. WebSocket-snapshots zijn rolgebonden: deelnemers krijgen geen antwoordwand, docenttoken of andere namen/antwoorden. Accountloze deelnemers krijgen alleen een tijdelijk willekeurig token in sessionStorage. Docenttokens staan eveneens uitsluitend in sessionStorage, niet in QR of URL. Same-origin-controle, groottebeperking, maximaal 100 deelnemers en maximaal 220 verbindingen per sessie. Namen zijn optioneel en maximaal 40 tekens. Sessiedata verloopt na vier uur en wordt bij sluiten direct uit opslag verwijderd; een korte gesloten-markering blijft één minuut. Geen permanent cursistprofiel.

Nieuwe rondes behouden de deelname. Round-ID en request-ID blokkeren oude/dubbele inzendingen. HTTP-acties zijn idempotent; WebSockets geven realtime updates en herstellen met begrensde wachttijd. Een lokale draft blijft bij tijdelijke uitval en herladen in dezelfde tab bewaard. Klassikaal verder koppelt de Live-client los; een onbereikbare sessie verloopt vanzelf. Er wordt niet automatisch opnieuw ingestuurd zonder bewuste deelnemersactie.

## Bestaande regressietests onderhouden

De basiscommit bevatte drie oudere browsertests met verwachtingen van vóór R25. Alleen hun fixtures/selecties zijn bijgewerkt, niet de productie-inhoud:

- `practice-advance-browser.cjs`: selecteert werkelijk vrijgegeven route-ID's in plaats van A2/B1. Zullen heeft in R25 alleen B1_B2. Alle controles van muis/touch/toetsenbord, automatisch doorgaan en opnieuw dezelfde keuze blijven staan.
- `practice-layout-browser.cjs`: zes huidige inhoudsgroepen; de niet-beschikbare RIDDLE-keuze wordt expliciet afwezig verwacht. Beschikbare werkvormen en alle vijf indelingen blijven gecontroleerd.
- `route-architecture-browser.cjs`: verwacht de bevroren 9.578 FREE-opdrachten, conform de zelfstandige E1-regressie. Historische A1+/C2-kaartsnapshots gebruiken de al voorgeschreven archive-testvlag; publieke routecontrole wordt daarna weer ingeschakeld. De actuele E1-regressie controleert de echte publicatie zonder die vlag.

Geen inhoudsbank, release-policy, borgingshash, bestaande grammaticaregel of opslagmigratie aangepast.

## Lokale uitvoering en latere publicatie

Installeer met `npm ci`; voer `npm run dev:live` uit en open `/zinnenbouwer.html`. Dit start uitsluitend een lokale Cloudflare-runtime. Voor een telefoon op hetzelfde netwerk moet de pagina via het LAN-adres van de computer worden geopend; localhost in een QR verwijst anders naar de telefoon zelf. In de publieke app gebruikt de QR vanzelf de publieke origin.

Unit: `npm run test:zinnenbouwer`. Met de lokale server actief: `npm run test:zinnenbouwer:live` en `npm run test:zinnenbouwer:browser`. `LIVE_TEST_URL` kan een andere test-origin kiezen. `npm run types`, `npm run lint`, `npm test`, `npm run build` omvatten de nieuwe code naast bestaande controles. Browserbewijs staat in `test-results/zinnenbouwer`.

Publicatie is niet uitgevoerd. De noodzakelijke nieuwe Durable Object-binding/migratie staat in `wrangler.jsonc`; een toekomstige publicatie moet zowel deze worker als de nieuwe statische build publiceren. Alleen dist kopiëren naar statische hosting biedt klassikaal gebruik maar geen Live. Bestaande statische routes blijven via de ASSETS-binding lopen. Geen externe AI-, login- of databasevoorziening nodig.

## Direct slepen — aanvulling 4 oktober 2026

Kaarten volgen nu direct de vinger of muis met behoud van het vastpakpunt. Een invoegstreep toont de plaats in de zin of kaartenbank, ook bij meerdere regels. Loslaten plaatst de kaart; aan de schermrand scrolt de pagina mee. Vaste kaarten blijven staan. Loslaten buiten de zones, Escape en touch-annulering wijzigen de volgorde niet. De zichtbare schuifknoppen zijn verwijderd. Tappen en toetsenbordbediening blijven toegankelijk: Enter toevoegen, pijlen verplaatsen, Delete terugleggen. Dezelfde controller bedient docent en deelnemer. Geen nieuwe afhankelijkheden.

De browsertest controleert de positie van de kaart tijdens echte muis- en gesimuleerde native touchbewegingen, invoegstreep, terugleggen, annuleren, vaste kaarten en randscrollen op een klein scherm. Een fysieke digibord-/telefoonproef blijft niet uitgevoerd.

## Direct openen en docentinstellingen — correctie 4 oktober 2026

Op Nico’s expliciete verzoek is de verplichte vierstapsvoorbereiding vervangen. Zinnenbouwer opent nu rechtstreeks op het bord en hervat de laatste geldige zin en volgorde op dit apparaat. Bij het eerste gebruik staat ‘Ik werk morgen thuis’ klaar. De docent kan optioneel via Docentinstellingen de onderdelen, woorden en oefenvorm aanpassen. Het dialoogvenster werkt met een aparte conceptkopie: Annuleren, Escape en herladen laten de bewaarde activiteit intact. Nieuwe zin is een bewuste docentactie. Ongeldige instellingen kunnen niet worden toegepast. Tijdens Live kan de actieve activiteit niet worden aangepast.

De werkvormencatalogus opent weer als catalogus, met een eigen Zinnenbouwer-tegel die het bord direct opent. De tekstlink in Oefenen is verwijderd. Terug naar de werkvormen gaat naar dezelfde catalogus. De overige werkvormen blijven hun bestaande vrijgavecontrole en voorbereidingsingang gebruiken; Raad het woord blijft uitgeschakeld. Dit geeft geen inhoudsbanken vrij.

De woordkaarten hebben een duidelijke kaartvorm, gescheiden functielabel, groot woord en sleepgreep. De labels blijven ook bij deelnemers zichtbaar, conform Nico’s antwoord; alleen de instellingen zijn voor de docent. Meedoen heeft geen instellingen, onderdeelkeuzes of invoerwizard. De controle omvat directe ingang, herladen, heen/terug, annuleren, vier oefenvormen, Live-hervatten, deelnemers zonder instellingen en behoud van drag-and-drop.

De aanvullende oudere `tests/release-browser.cjs` stopt op zijn ongewijzigde verwachting van 6.630 vrijgegeven opdrachten, terwijl de vastgezette R25-bron en `tests/e1-release-browser.cjs` 9.578 FREE-opdrachten voorschrijven. Dit is een al verouderd testcontract, geen nieuwe inhoudsvrijgave. Deze oude suite is niet als geslaagd gerapporteerd. De nieuwe publieke ingang en uitgeschakelde RIDDLE-ingangen worden afzonderlijk gecontroleerd in `tests/zinnenbouwer-browser.mjs`; de actuele R25-vrijgavecontrole blijft leidend.
