# Taalroute-appmenu — KANDIDAAT

Datum: 13 september 2026. Publicatie: **GESLOTEN**. Alleen de bestaande lokale Digibord-app is gewijzigd. Geen push of deployment uitgevoerd.

## Implementatie

De lokale Spreektijd-kandidaat op `http://127.0.0.1:18815/02_digitaal/` is de referentie: `outputs/digibord-header-vergelijking-20260913/site/02_digitaal/shared/app-header.css` en `app-header.js` in het Spreektijd-project. De ingesloten woordmerkpaden zijn rechtstreeks uit diens bestaande SVG overgenomen. Geen nieuw lettertype, tekstlogo of beeld gegenereerd. Alle SVG-ID’s hebben een eigen app-prefix.

`Lessen/appmenu.js` bevat één register met de vier opgegeven bestemmingen, de bestaande woordmerkvormen en de interactie. Alleen de andere drie apps verschijnen als gewone links. `Lessen/appmenu.css` bevat de gedeelde geometrie: `--tr-header-height:60px`, `--tr-accent-height:2px`, `--tr-active-accent:#0090F2`. De productnaam is Digibord.

De bestaande witte Digibord-header blijft wit, ook bij de donkere systeemvoorkeur. Het woordmerk blijft daarop donker leesbaar. Het apppaneel krijgt bij die voorkeur een donkere achtergrond en lichte woordmerken. De Missies-regel houdt altijd #FCF8ED met het gehele logo in #59402D. De andere driehoeken blijven exact #285F47, #0090F2 en #C76349.

Op smalle schermen verhuizen dezelfde drie knoppen — Pauze, Scherm, Instellingen — naar Bediening. Er worden geen knoppen, handlers of ID’s gekopieerd. Het appmenu en de bediening sluiten elkaar. Vanuit de instellingen brengt openen van het appmenu eerst de bestaande les terug.

## Controle

`tests/appmenu.cjs` controleert 320, 390, 768, 1280 en 1920 px, elk in licht/donker en met 100%/200% tekst: twintig combinaties. Tekstvergroting wordt gemeten met een root-lettergrootte van 16/32 px; de productnaam en appnamen gebruiken rem. Bestaande lesstijlen met px worden hierdoor niet algemeen vergroot of herontworpen.

In alle twintig combinaties:

- Header werkelijk **60 px**, accent werkelijk **2 px**.
- Kaart- en opdrachtverplaatsing door openen **0 px**; dezelfde positie én afmetingen. Op telefoons, waar de bestaande kaartweergave verborgen is, is het zichtbare opdrachtvak gemeten.
- Volledige productnaam zichtbaar; paneel binnen de vensterbreedte.
- Logo’s en scheidingslijnen horizontaal uitgelijnd.
- Logoknop minimaal 44 px, appregels minimaal 58 px.
- Unieke document-ID’s en exact de opgegeven driehoekkleuren.

Verder geslaagd: opnieuw aanklikken, buitenklik, Escape met focusterugkeer, ArrowDown met eerste link, Tab door de links en sluiten bij focusverlaten; wederzijdse uitsluiting met instellingen en compacte bediening; werkelijk fullscreen met header van 60 px; scrollbaar menu bij 160 px vensterhoogte.

De drie links zijn afzonderlijk in hetzelfde tabblad aangeklikt en met browser-Terug is de eerdere Bos-route teruggekomen met gesloten menu. In deze geautomatiseerde navigatiecontrole worden alleen de externe antwoordpagina’s vervangen door een testpagina; de exacte linkadressen en echte geschiedenisnavigatie blijven intact. Geen wijzigingen of transacties op externe sites. Beschikbaarheid van de productie-apps is niet onderdeel van deze lokale test.

De gewone lokale app is daarnaast in de Codex-browser visueel bekeken: Bos, pion op vak 7 en bestaande opdracht bleven na laden van de kandidaat behouden.

## Behoud en bestanden

De enige wijziging in `Start-Praatpad.html` is het laden van de nieuwe CSS en JavaScript. De oorspronkelijke logoafbeelding met ID `pp-logo` blijft beschikbaar voor de bestaande afdrukfunctie, maar wordt in de header vervangen door het bestaande vectorwoordmerk. Kaartmodules, geometrie, media, opdrachten, instellingen, opslag en overige broninhoud zijn niet gewijzigd. Het menu schrijft niet naar de lesopslag en voegt geen terugverwijsparameters toe.

Gewijzigd/toegevoegd: `Start-Praatpad.html`, `Lessen/appmenu.js`, `Lessen/appmenu.css`, `tests/appmenu.cjs`, `package.json`, deze documentatie en de bijbehorende QA-bestanden. De nieuwe test is opgenomen in `npm test`.

- [Metingen](Appmenu-QA/metingen.json)
- [Breed, licht](Appmenu-QA/breed-licht.png)
- [320 px, donker, 200% tekst](Appmenu-QA/smal-donker-200.png)
- Lokale preview: http://127.0.0.1:61381/Start-Praatpad.html?kaart=bos-bosroute

## Eindresultaat

De volledige bestaande `npm test`-reeks is geslaagd (exitcode 0), inclusief stabiele kaartindeling tijdens worpen op alle elf kaarten, tunnels en teruglopen, opgeslagen voortgang, opdrachtenmatrix, snelle leskeuzes, bedieningsknoppen, fullscreen, audio, zinnenspel en voorgrondlagen. De nieuwe appmenutest is daarnaast volledig geslaagd. Een bronvergelijking bevestigt dat het oorspronkelijke HTML-bestand na weglaten van de twee nieuwe imports bytegelijk is en alle gekopieerde SVG-paden identieke geometrie hebben.

Vastlegging: lokale Git-commit; geen push, geen deployment. Status blijft **KANDIDAAT**.
