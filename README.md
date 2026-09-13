# Taalroute DigiBoard

Eén app met drie spelvormen, bereikbaar via **Instellingen → Spelvorm**:

- **Speel op de kaart**: Praatpad buurt, Rotterdam, Twee werelden, Stad met 24 vakken, Stad met 12 vakken en 15 routevormen.
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

Kies de kaart in **Instellingen → Kaarten & oefenen**, of onder de spelvorm **Speel op de kaart**. De app bewaart de pionstand per kaart. Geluid, iconenstijl, bewaarde groepen, deelnemersgegevens, het woordspel en de verhaaldobbelstenen worden gedeeld.

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

De thema-niveauprofielen zijn didactische oefenpakketten, geen volledige officiële ERK-woordenlijsten. Verdere kaarten en de hertekening van de actiewoorden zijn uitbreidingen op deze basis.
