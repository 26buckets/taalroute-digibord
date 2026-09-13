# DigiBoard

Dit is de gezamenlijke ontwikkelbasis voor Taalroute DigiBoard. Gebruik één toepassing en één instellingenmenu. Maak geen volledige kopieën van de app voor nieuwe kaarten.

- `Start-Praatpad.html` is de gezamenlijke ingang; `index.html` verwijst ernaar.
- Kaarten zijn gegevens, geometrie en voorgrondlagen onder `Kaarten/`. Registreer nieuwe kaarten in `Kaarten/register.js`.
- Behoud de afgesproken speeltafel met negen dobbelstenen, zichtbare woorden als standaard, bediening rechts en geen scroll op het digibord.
- Kaartlessen bewaren hun eigen pionstand. De beeldbibliotheek, geluid, iconenstijl en verhaaldobbelstenen zijn gedeeld.
- Behoud de bestaande lokale opslag van de Praatpad-basisles. Verwijder of reset geen lesgegevens bij een vormgevingswijziging.
- Voorgrondlagen moeten de pion werkelijk afdekken waar een route achter een boom of bouwwerk loopt.
- Controleer relevante wijzigingen met `npm test` en visuele browserinspectie. `CHROME_PATH` kan naar een bestaande Chrome-installatie wijzen.
