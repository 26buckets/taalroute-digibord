# Taalroute DigiBoard

Eén app met drie spelvormen, bereikbaar via **Instellingen → Spelvorm**:

- **Speel op de kaart**: Rotterdam, Amsterdam, Utrecht, Dorp, Kust, Bos, Polder, Haven, Heuvels, Fantasiewereld en Ruimtewereld. De kaartkiezer toont uitsluitend deze elf werelden; oude bronmodules en lesgegevens zijn behouden.
- **Vertel een verhaal**: negen beelddobbelstenen, wisselen van sets, woorden tonen/verbergen, geluid en vorige worp.
- **Bouw een zin**: het woordspel met verschillende oefenvormen en een vrij instelbare zinnentafel.

De 54 nieuwe basisiconen zijn beschikbaar in Lijn en Lijn met vlakken. Die laatste stijl is standaard. De bestaande 54 actiewoorden en acht themapakketten met niveauprofielen A1–C2 zijn meegenomen.

## Starten

Open `Start-Praatpad.html` in een moderne browser, of dubbelklik op `Start-DigiBoard.command` op een Mac. De bestandsnaam van de HTML-ingang blijft behouden om bestaande lokale lesgegevens te kunnen blijven gebruiken.

Met Node.js:

```sh
npm start
```

Open daarna http://127.0.0.1:4173. Er is geen buildstap nodig. Alle speelbeelden en geluiden zijn lokaal aanwezig.

## Kaart kiezen en voortgang

Gebruik de knop **Kaarten** bovenaan, kies de kaart in **Instellingen → Kaarten & oefenen**, of onder de spelvorm **Speel op de kaart**. De app bewaart de pionstand per kaart. Geluid, iconenstijl, bewaarde groepen, deelnemersgegevens, het woordspel en de verhaaldobbelstenen worden gedeeld.

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

- `Start-Praatpad.html`: gezamenlijke bediening, leslogica en dobbelsteenrenderer.
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

DigiBoard heeft een eigen, methodeonafhankelijk didactisch systeem: zes families en 48 taalhandelingen. De kaartapp biedt 48 uitgewerkte opdrachten op elk van de routes A0–A1, A1–A1+, A1–A2 en A2–B1, in totaal 192 routeopdrachten. De opdrachten staan in Lessen/leerroutes-content.js. Bij een voorbereidende handeling blijft begeleiding expliciet vermeld.

Onder Kaarten staat de opdrachtenbank met een familiefilter. Didactiek kan dezelfde handelingen direct op het bord zetten. Bron & docent toont input, model, grammatica en observatiepunt. Spreektijd kan deze algemene app gebruiken, maar is niet leidend voor haar opbouw. De bank is een verzameling oefentaken, geen volledige methode of officiële grammaticale niveaulijst.


## Filosofie, opdrachten en archief

- [Filosofie en gebruik](Documentatie/Filosofie-en-gebruik.md)
- [Alle 192 opdrachten en grammaticale oefendoelen](Documentatie/Alle-192-opdrachten-en-grammatica.md)
- [Kaartfamilie en variatieafspraken](Documentatie/Kaartfamilie-en-variatie.md)
- [Leerroutes: gebruik en afbakening](Documentatie/Leerroutes-gebruik-en-afbakening.md)
- [Kaartcontrole: plaatsing, labels en dieptewerking](Documentatie/Kaartcontrole-en-aanpassingen.md)

De actuele tunnel- en objectplaatsing staat in `Kaarten/ruimtewerking.js`. Beeldplaatsing, toegangspaden en pionbewegingen gebruiken dezelfde geometrie. `npm test` controleert ook alle elf kaarten op leesbare labels en de tien tunnelanimaties.

De [Google Drive-overdracht](https://drive.google.com/drive/folders/15_yOMXk-xiSsmJc0dNCIpJ8ojrF6SvH-) bevat de complete app, de documentatie en het bronarchief met eerdere kaartdemo’s en controlebeelden. De repository bevat de actuele gezamenlijke app. Persoonlijke lesstanden staan in de browser en kunnen via Bewaren worden geëxporteerd.
