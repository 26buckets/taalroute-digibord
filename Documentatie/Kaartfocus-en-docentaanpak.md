# Kaartfocus, spatiebalk en docentaanpak

13 september 2026 — lokale KANDIDAAT. Geen push of deployment in deze wijziging.

## Gebruik

- **Docentaanpak** opent een rustig venster van maximaal 580 px breed. Start, Luister, Help kort en Opnieuw zijn de vier korte stappen. Gewone tekst is 15 px, de venstertitel 20 px. Doel en voorbeeld en Achtergrond staan op aparte tabs; de volledige notitie is uitklapbaar. Bestaande didactische gegevens blijven beschikbaar.
- **Spatiebalk** gooit op het speelbord, ook nadat de knop Volledig scherm is aangeklikt. Invoervelden, keuzelijsten, links, het appmenu, open dialogen en instellingen behouden hun eigen bediening. Ingedrukt houden veroorzaakt geen extra worpen. Tijdens een lopende worp is opnieuw gooien geblokkeerd. De opdrachttekst houdt zijn eigen toetsenbordactie om te vergroten.
- Klik op **de opdrachttekst** om de bestaande grote opdrachtweergave te openen. Enter en spatie werken ook wanneer deze tekst toetsenbordfocus heeft. **Speelbord tonen** brengt de kaart terug.
- **Kaart groter** maakt het opdrachtvak een vaste strook van 142 px. De volledige taak, voorbeelden en docentknoppen blijven bereikbaar via **Lees alles** of de opdrachttekst. **Kaart en opdracht** herstelt de gewone verdeling.
- Bij het betreden van volledig scherm wordt de kaartstand actief; bij verlaten wordt de eerdere verdeling hersteld. Dit verandert geen opgeslagen lesinstellingen. Bij bijzondere verplaatsingen blijven de knoppen voor de routekeuze bereikbaar in de strook.

## Metingen

| Venster | Kaartvlak normaal | Kaartvlak in kaartstand |
| --- | ---: | ---: |
| 767 × 889 | 491,19 px hoog | 687 px hoog |
| 1280 × 720 | 386,41 px hoog | 518 px hoog |
| 1920 × 1080 | 680 px hoog | 878 px hoog |

Dit zijn maten van het kaartvlak. De afbeelding behoudt haar oorspronkelijke verhouding en wordt volledig passend getoond. Op smalle vensters kan de breedte de afbeeldingsgrootte begrenzen; meer hoogte levert daar niet automatisch een grotere afbeelding op. Op brede schermen krijgt de kaart daadwerkelijk meer afbeeldingsruimte. Geen afbeeldingen uitgerekt of afgesneden, geen route- of tunnelgeometrie veranderd.

## Controle

De volledige bestaande npm-testreeks is geslaagd. De nieuwe `tests/focus-controls.cjs` is apart geslaagd en toegevoegd aan npm test. Die controleert één worp per spatie, herhaalde toetsaanslagen, dialoog-/instellingenblokkering, spatie direct na de fullscreenknop, docenttabs en tekstgrootte, klikken op de opdracht, bereikbare hulp in grote opdrachtweergave, ongewijzigde kaartgeometrie tijdens worpen op drie schermmaten, herstellen na fullscreen en een werkelijke transportkeuze naar vak 25 op Ruimtewereld in kaartstand.

Visuele controle uitgevoerd in de lokale app en met schermafbeeldingen. JSON-opdrachten, bronmedia, kaarten, pionstanden, opslagstructuur en het Taalroute-appmenu zijn niet gewijzigd.

- [Docentaanpak](Kaartfocus-QA/docentaanpak.png)
- [Grote kaart bij 1920 × 1080](Kaartfocus-QA/grote-kaart.png)
- [Meetgegevens](Kaartfocus-QA/metingen.json)

Bronwijzigingen: `Lessen/bediening.js`, `Lessen/bediening.css`, `package.json`, `tests/focus-controls.cjs`.
