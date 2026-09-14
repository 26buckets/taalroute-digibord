# Taalroute DigiBoard

Eén app met vier spelvormen, bereikbaar via **Instellingen → Spel & beelden**:

- **Speel op de kaart**: 46 speelbare kaarten, verdeeld over Algemeen (6), Nederland (28), Fantasie & avontuur (8) en Spreektijd (4). De extra categorie Kort verzamelt de twaalf kaarten met maximaal twintig vakken. Die kaarten blijven ook in hun inhoudelijke categorie staan; er zijn geen dubbele lessen.
- **Vertel een verhaal**: negen beelddobbelstenen, wisselen van sets, woorden tonen/verbergen, geluid en vorige worp.
- **Eenvoudig zinnenspel**: persoon, werkwoord en kleur voor de tijd; 24 werkwoorden en maximaal 432 combinaties.
- **Bouw een zin**: het woordspel met verschillende oefenvormen en een vrij instelbare zinnentafel.

De 54 nieuwe basisiconen zijn beschikbaar in Lijn en Lijn met vlakken. Die laatste stijl is standaard. De bestaande 54 actiewoorden en acht themapakketten met niveauprofielen A1–C2 zijn meegenomen.

## Starten

Open `Praatpad.html` in een moderne browser, of dubbelklik op `Start-DigiBoard.command` op een Mac. De oude ingang Start-Praatpad.html verwijst door. De lokale server blijft dezelfde poort en opslagsleutels gebruiken voor bestaande lesgegevens.

Met Node.js:

```sh
npm start
```

Open daarna http://127.0.0.1:4173. Er is geen buildstap nodig. Alle speelbeelden en geluiden zijn lokaal aanwezig.

## Kaart kiezen en voortgang

Open **Bediening → Wissel kaart** en kies een categorie en afbeelding. Niveau en oefening blijven afzonderlijk instelbaar. De app bewaart de pionstand per kaart. Geluid, iconenstijl, bewaarde groepen, deelnemersgegevens, het woordspel en de verhaaldobbelstenen worden gedeeld.

Bij een nog niet gebruikte kaart gaat de huidige groep mee. Een eerder gebruikte kaart hervat de deelnemers en pionnen van haar bewaarde les; bijgewerkte namen blijven beschikbaar. Opslag hoort bij de browser en het lokale webadres. Gebruik hetzelfde adres om bestaande voortgang terug te vinden. De reservekopie bij Bewaren bevat de huidige kaartles en de gedeelde onderdelen.

Rotterdam heeft drie speciale landingsvakken: **13 → 12**, **15 → 20** en **28 → 21**. Alleen landen telt, met maximaal één extra verplaatsing per worp. In de oefenstand waarbij alle vakken achtereenvolgens worden bezocht zijn deze effecten uit. Via **Speciale plekken** kun je bewegingen bekijken zonder de lesstand te veranderen. **Toon vaknummers** maakt de nummering zichtbaar.

## Controle

```sh
npm ci
npx playwright install chromium
npm test
```

De controle start een eigen tijdelijke lokale server. Ze test spelvormen, behoud van de verhaaldobbelstenen, kaartvoortgang, speciale vakken, terugnemen, herladen, voorbeeldbewegingen en de vaste bordweergave. Voor een lokaal geïnstalleerde browser kan `CHROME_PATH` worden ingesteld.

## Onderdelen

- `Praatpad.html`: gezamenlijke bediening, leslogica en dobbelsteenrenderer.
- `digiboard.js`: kaartkeuze en gedeelde opslag.
- `Kaarten/`: kaartinhoud, geometrie, voorgrondlagen en vormgeving.
- `Beeldbibliotheek/`: basisiconen, thema's, niveauprofielen en stijlkeuze.
- `Actiewoorden/`: negen dobbelstenen en unieke worpcombinaties.
- `Woordspel/`: woordenkaarten en zinnenbouw.

Deze repository is de gezamenlijke ontwikkelbasis. Nieuwe kaarten en iconen worden hier toegevoegd als onderdelen, zonder opnieuw een volledige app te kopiëren. De oudere zelfstandige proefversies blijven buiten deze repository bewaard.

De thema-niveauprofielen zijn didactische oefenpakketten, geen volledige officiële ERK-woordenlijsten. Nieuwe kaarten en de hertekening van de actiewoorden zijn uitbreidingen op deze basis.

## Geïntegreerde kaartfamilie — 13 september 2026

Alle elf geschilderde kaarten uit de kaartfamilie zijn beschikbaar in dezelfde app. Tunnels, het polderpontje, de fantasiepoorten, de hellingkeuze en de transportstraal gebruiken de gewone pion met echte voorgrondlagen. De kaartmodules bevatten hun eigen geometrie en bewegingen; de app heeft één instellingenmenu en één opslagmodel. Bij Elk vak staan alle speciale verbindingen uit.

Het Mac-startbestand gebruikt het vaste lokale adres http://127.0.0.1:61381. Dat blijft behouden voor bestaande lesgegevens. `npm start` gebruikt voor ontwikkeling poort 4173; die browseropslag is afzonderlijk.

## Niveau, werkvorm en pionnen

Onder Kaarten & oefenen kies je A0, A1, A2 of B1. Opdrachten, grammaticale oefendoelen en voorbeelden volgen dit niveau. A0 is de lokale instapbenaming bij Pre-A1; de grammaticale leerlijn is een didactische keuze. De inhoud staat los van de bediening onder Lessen/.

Kies Individueel, Tweetallen, Groepjes, Klassikaal of Klassikaal · één spreker. Bij de laatste vorm maakt iedereen dezelfde opdracht en spreekt één aangewezen cursist. De lijst wordt per les één keer gehusseld en daarna steeds in dezelfde volgorde doorlopen, onafhankelijk van de dobbelsteen. Afwezigen worden overgeslagen. Herladen en Terug bewaren de lijst.

Eén klassenpion, 1–30 groepspionnen of maximaal 30 individuele pionnen zijn mogelijk, begrensd door de cursistenlijst. Bij een gezamenlijke ronde krijgt elke pion een eigen worp en opdracht; routekeuzes worden één voor één afgehandeld. De animaties zijn in die ronde verkort tot directe verplaatsingen.

Tests: npm test controleert de gedeelde app, kaartfamilie en lesvormen, inclusief volledige namenronde, vier niveaus, twintig pionnen, afzonderlijke worpen, routekeuzes en Terug.

## Algemene leerroutes en taalhandelingen

DigiBoard biedt 960 concrete opdrachten: 240 op elk van de routes A0–A1, A1–A1+, A1–A2 en A2–B1. Rondje = vertel, vierkant = vraag, driehoek = kies, ruit = regel iets. De bron staat in `Lessen/opdrachtenmatrix.json`. Per groep, route en vorm bewaart de app welke opdrachten gespeeld zijn. Hulp en voorbeelden verschijnen pas na een klik.

Onder **Kaart & les** staat een filterbare catalogus met 240 opdrachten per route. **Leerdoelen** houdt de zes families en 48 taalhandelingen beschikbaar als docentachtergrond en verwijst naar de concrete catalogus. Spreektijd is één mogelijke toepassing van deze algemene app.

Zie [Opdrachtenmatrix en eenvoudig zinnenspel](Documentatie/Opdrachtenmatrix-en-zinnenspel.md) en het [Excel-overzicht](Documentatie/Opdrachtenmatrix.xlsx). Excel is een reviewbestand; de app leest de JSON-bron.

## Filosofie, opdrachten en archief

- [Filosofie en gebruik](Documentatie/Filosofie-en-gebruik.md)
- [Historisch: eerdere 192 opdrachten en grammaticale oefendoelen](Documentatie/Alle-192-opdrachten-en-grammatica.md)
- [Kaartfamilie en variatieafspraken](Documentatie/Kaartfamilie-en-variatie.md)
- [Leerroutes: gebruik en afbakening](Documentatie/Leerroutes-gebruik-en-afbakening.md)
- [Kaartcontrole: plaatsing, labels en dieptewerking](Documentatie/Kaartcontrole-en-aanpassingen.md)

De oorspronkelijke kaarten gebruiken `Kaarten/ruimtewerking.js`; latere uitbreidingen gebruiken `Kaarten/nieuwe-werelden.js` en de Nederlandse reeks `Kaarten/nederland-werelden.js`. Beeldplaatsing, toegangspaden en pionbewegingen gebruiken dezelfde geometrie. `npm test` controleert alle 46 kaarten, de categorieën, doorgangen, keuzes, herladen en bestaande bediening.

De [Google Drive-overdracht](https://drive.google.com/drive/folders/15_yOMXk-xiSsmJc0dNCIpJ8ojrF6SvH-) bevat de complete app, de documentatie en het bronarchief met eerdere kaartdemo’s en controlebeelden. De repository bevat de actuele gezamenlijke app. Persoonlijke lesstanden staan in de browser en kunnen via Bewaren worden geëxporteerd.

## Publicatie

De 46 kaarten en vijf categorieën staan op [digibord.taalroute.nl](https://digibord.taalroute.nl/). Zie het [publicatie- en controleverslag van 14 september 2026](Documentatie/Publicatie-2026-09-14.md).
