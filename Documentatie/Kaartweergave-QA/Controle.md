# QA — grotere kaartweergave

Status: lokale KANDIDAAT; publicatie gesloten.

## Visuele en meetcontrole

- Kaartbeeld en bedieningspaneel bekeken in de bestaande lokale preview op 788 × 889 px, met behoud van de bestaande spelstand (Bos, vak 50).
- Geautomatiseerde schermafbeeldingen beoordeeld op 788 × 889, 1280 × 720 en 1920 × 1080 px.
- Werkelijke afbeelding 31,8%, 32,5% en 28,2% groter in breedte én hoogte dan de eerdere normale indeling. Meetbestand: `metingen.json`.
- De kaart vult de beschikbare breedte; de oorspronkelijke beeldverhouding blijft behouden. Op afwijkende schermverhoudingen blijven randen zichtbaar.
- Dobbelsteen 140 × 140 px. Opdrachtstrook 148 px. Header 60 px inclusief 2 px accent; het bestaande appmenu test deze maten op 20 combinaties van schermbreedte, thema en tekstvergroting.
- Openen/sluiten van Bediening verandert de kaartafmetingen niet. Gewone worpen en terugkeer uit de vergrote opdracht behouden dezelfde kaartgeometrie.
- Dagelijkse leskeuzes en kaartopties staan bovenaan Bediening; overige opties blijven in het scrollbare paneel beschikbaar. De bestaande actieve naam/klassikale spreker blijft zichtbaar op het bord.

## Functionele controle

Alle 22 testonderdelen uit de npm-testreeks zijn geslaagd. De eerste elf slaagden in de volledige run; na aanpassing van de Terug-knopnavigatie in de integratietest is de reeks vanaf `integration.cjs` hervat en succesvol afgerond. De oude tests verwachtten enkele knoppen nog direct op het bord; zij openen nu eerst Bediening. De spelcontroles zijn behouden. Zie `testresultaten.txt` voor de geslaagde onderdelen.

De reeks omvat de nieuwe kaartweergave, het witte opdrachtvlak, spatie, hulpknoppen, docentaanpak, fullscreen, appmenu en menu-exclusiviteit, elf kaartwerelden, nummerlabels, alle bordoefeningen, niveauwissels, opslaan/herladen/Terug, deelnemers en klassikale spreker, bijzondere routes, tunnels, pont, bruglagen, geluid, beeldspellen en de opdrachtenmatrix.

De nieuwe `tests/ui-controls.cjs` opent en sluit Bediening met normale browserklikken voordat verborgen bediening wordt gebruikt. De bestaande inhoudelijke controles blijven behouden. Geen geforceerde klikken toegevoegd.

## Behoud en bestanden

`behoud.json` bevestigt dat de 191 ID-vermeldingen in de bestaande HTML en de ingesloten lesgegevens gelijk zijn gebleven. Kaartmodules, JSON-opdrachten en bronmedia zijn niet gewijzigd. De nieuwe interface verplaatst bestaande knoppen als dezelfde elementen, inclusief hun handlers en ID’s. Bestaande browseropslag wordt niet gewist of gemigreerd.

Productbestanden: `Lessen/kaartweergave.js`, `Lessen/kaartweergave.css`, `Lessen/bediening.js`, `Lessen/bediening.css`, `Start-Praatpad.html`. Daarnaast zijn documentatie, tests en de testopdracht bijgewerkt.

Lokale preview: http://127.0.0.1:61381/Start-Praatpad.html?kaart=bos-bosroute

Geen push of deployment uitgevoerd voor deze wijziging.
