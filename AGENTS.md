# DigiBoard

Dit is de gezamenlijke ontwikkelbasis voor Taalroute DigiBoard. Gebruik één toepassing en één instellingenmenu. Maak geen volledige kopieën van de app voor nieuwe kaarten.

- `Start-Praatpad.html` is de gezamenlijke ingang; `index.html` verwijst ernaar.
- Kaarten zijn gegevens, geometrie en voorgrondlagen onder `Kaarten/`. Registreer nieuwe kaarten in `Kaarten/register.js`.
- Behoud de afgesproken speeltafel met negen dobbelstenen, zichtbare woorden als standaard, bediening rechts en geen scroll op het digibord.
- Kaartlessen bewaren hun eigen pionstand. De beeldbibliotheek, geluid, iconenstijl en verhaaldobbelstenen zijn gedeeld.
- Behoud de bestaande lokale opslag van de Praatpad-basisles. Verwijder of reset geen lesgegevens bij een vormgevingswijziging.
- Voorgrondlagen moeten de pion werkelijk afdekken waar een route achter een boom of bouwwerk loopt.
- Controleer relevante wijzigingen met `npm test` en visuele browserinspectie. `CHROME_PATH` kan naar een bestaande Chrome-installatie wijzen.

De volledige geschilderde kaartfamilie is geïntegreerd: Rotterdam, Amsterdam, Utrecht, Dorp, Kust, Bos, Polder, Haven, Heuvels, Fantasiewereld en Ruimtewereld. Op uitdrukkelijk verzoek van de gebruiker toont de kaartkiezer vanaf 13 september alleen deze elf werelden; oude bronmodules en opgeslagen lessen blijven bewaard. Nieuwe kaartmodules gebruiken `connectRuntime(host)` voor eigen animaties, diepte en spelregeltekst binnen de gezamenlijke app. Geen zelfstandige HTML-apps of iframes in de kaartkiezer toevoegen. `npm test` omvat ook `tests/map-family.cjs`. Het Mac-startbestand blijft poort 61381 gebruiken om eerdere browseropslag bereikbaar te houden.

DigiBoard is een algemene taal- en oefenapp. De eigen zes families, 48 taalhandelingen en vier routes A0–A1, A1–A1+, A1–A2 en A2–B1 zijn leidend. Spreektijd is één mogelijke gebruiker van de app en bepaalt niet de didactiek of de productie-eisen. Gebruik geen boek- of themaspecifieke Spreektijd-regels als algemene appvereisten. De concrete routeopdrachten staan onder Lessen/leerroutes-content.js en zijn verbonden met de kaart en Didactiek.


Vanaf de kaartcontrole van 13 september 2026 staat de actuele tunnel- en objectplaatsing van de gezamenlijke app in `Kaarten/ruimtewerking.js`. Deze overschrijft de oudere posities uit de kaartmodules bij voorbereiding. Beeldplaatsing en pionpad moeten altijd dezelfde geometrie gebruiken. Labels reserveren vrije ruimte buiten de hoofdroute en objecten. De nieuwe controle `tests/spatial.cjs` is opgenomen in `npm test`; zie `Documentatie/Kaartcontrole-en-aanpassingen.md` in de gezamenlijke app. De zelfstandige kaartdemo’s zijn historische bronversies.
