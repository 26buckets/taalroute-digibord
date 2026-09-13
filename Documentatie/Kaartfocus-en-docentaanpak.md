# Kaartweergave en docentbediening

13 september 2026 — lokale KANDIDAAT. Niet gepusht of gepubliceerd in deze wijziging.

## Gebruik

Vanaf 600 px breedte gebruikt de kaart de volledige vensterbreedte. Onder de kaart staat een vaste opdrachtstrook van 148 px. De bestaande dobbelsteen blijft rechtsonder, 140 × 140 px groot. Deze indeling werkt direct in het gewone venster en blijft behouden in volledig scherm.

Klik ergens op het witte opdrachtvlak om de volledige opdracht te lezen. Nogmaals klikken verkleint; Enter schakelt het gefocuste vlak en Escape verkleint. Hulpknoppen behouden hun eigen actie. Er zijn geen extra knoppen Kaart groter of Lees alles.

**Bediening** opent een paneel over de kaart heen. Niveau, Oefening, Opdracht kiezen/Woorden en tijden en de drie kaartopties staan bovenaan. Daaronder staan Hulp, Andere opdracht, Voorbeeld en de docentopties. De bestaande namen, werkvorm, voortgang en terugknop blijven beschikbaar. Bij weinig hoogte kan het paneel scrollen. In de vergrote opdracht staan de hulpknoppen direct bij de opdracht. De naam van de actieve deelnemer of klassikale spreker blijft in de korte opdrachtstrook zichtbaar.

De knop opnieuw aanklikken, buiten het paneel klikken of Escape sluit Bediening. Escape brengt de focus terug naar de knop. Pijl omlaag opent het paneel en focust de sluitknop. Focus buiten het paneel sluit het. Instellingen, appmenu en andere dialogen sluiten het paneel eveneens. Openen verschuift de kaart niet.

De spatiebalk gooit op het speelbord. Invoervelden, keuzelijsten, links en geopende menu’s of dialogen behouden hun eigen toetsenbediening. Ingedrukt houden veroorzaakt geen extra worpen. Tijdens een lopende worp is opnieuw gooien geblokkeerd.

Docentaanpak blijft een venster van maximaal 580 px breed, met 15 px lopende tekst en een titel van 20 px. De vier stappen Start, Luister, Help kort en Opnieuw blijven behouden. Doel en voorbeeld en Achtergrond staan op aparte tabs.

Onder 600 px en bij de andere spelvormen blijft de bestaande indeling actief. Bestaande knoppen worden verplaatst als dezelfde elementen, niet gekopieerd; handlers, ID’s en lesgegevens blijven behouden.

## Werkelijk weergegeven afbeelding

| Venster | Voorheen | Nieuwe kaartweergave | Groei in breedte en hoogte |
| --- | --- | --- | --- |
| 788 × 889 | 598 × 336,55 px | 788 × 443,49 px | 31,8% |
| 1280 × 720 | 686,58 × 386,41 px | 909,74 × 512 px | 32,5% |
| 1920 × 1080 | 1208,25 × 680 px | 1549,40 × 872 px | 28,2% |

Dit zijn de maten van de afbeelding zelf, berekend uit de natuurlijke verhouding en het passende kaartvlak. Het kaartvlak is respectievelijk 788 × 681, 1280 × 512 en 1920 × 872 px. De header blijft 60 px inclusief 2 px accent. Afbeeldingen worden niet uitgerekt of afgesneden; routes en tunnelgeometrie veranderen niet. Door de beeldverhouding kunnen rustige randen overblijven. Geen handmatige zoom toegevoegd.

## Bronnen en controle

Implementatie: `Lessen/kaartweergave.js`, `Lessen/kaartweergave.css`, de inlaadregel in `Start-Praatpad.html` en toetsen-/hulpregels in `Lessen/bediening.js` en `Lessen/bediening.css`.

`tests/card-view.cjs` meet de afbeeldingsgrootte en controleert het paneel, de grote dobbelsteen, onbeweeglijke kaart tijdens worpen, één klik vergroten/verkleinen, toetsenbord, dialogen, volledig scherm en de telefoonindeling. Bestaande tests bedienen verborgen knoppen voortaan via de echte Bediening-knop met `tests/ui-controls.cjs`; controles op inhoud en spelgedrag blijven behouden.

- [Meetgegevens](Kaartweergave-QA/metingen.json)
- [Kaart op 788 px](Kaartweergave-QA/kaart-788.png)
- [Kaart op 1920 px](Kaartweergave-QA/kaart-1920.png)
- [Bedieningspaneel](Kaartweergave-QA/bediening.png)

De definitieve testuitkomst staat in het bijbehorende QA-verslag.
