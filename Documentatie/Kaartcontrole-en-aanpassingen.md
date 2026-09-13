# Kaartcontrole — plaatsing, leesbaarheid en diepte

13 september 2026 · gezamenlijke DigiBoard-app

De elf werelden gebruiken nu een gedeelde plaatsingslaag. Tunnelbeelden, toegangspaden en pionbewegingen lezen dezelfde coördinaten. De tunnelopeningen staan naast de looproute. Labels reserveren ruimte buiten de hoofdroute en de geplaatste objecten en wijken uit wanneer ze elkaar zouden bedekken.

## Wat is aangepast?

| Wereld | Aanpassing en controle |
| --- | --- |
| Rotterdam | Labels vrij geplaatst; boompassage en hoge Erasmusbrug vooruit en achteruit gecontroleerd. |
| Amsterdam | Kleinere tunnelopeningen naast de route; aanloop, afdalen, verdwijnen en uitlopen opnieuw gekoppeld aan de afbeelding. Brug en boom gecontroleerd. |
| Utrecht | Werftunnel naast de route gezet; beide openingen en animatie uitgelijnd. Stenen brug en boompassage gecontroleerd. |
| Dorp | Kleinere tunnelopeningen met toegangspad dat om de rand loopt; route en vaknummers blijven vrij. Houten brug en groen gecontroleerd. |
| Kust | Tunnelopeningen en bordjes verschoven; toegang vanaf het pad aangesloten. Strandbrug en helmgras in beide richtingen gecontroleerd. |
| Bos | Worteltunnel naast het pad met eigen toegangen; terugweg 49 → 46 behouden. Boomstambrug en boompassage gecontroleerd. |
| Polder | Tunnelopeningen verder uit elkaar: van 179 naar 310 eenheden tussen de middelpunten op de oorspronkelijke kaartbreedte van 1672. Openingen verkleind van 150 naar 110; uitgang krijgt een teruglopend toegangspad naar 57. Knotwilg naast het pad geplaatst; pont en brug behouden. |
| Haven | Tunnelranden naast de kade, met een aanloop om de zijwand en een uitloop terug naar de route. Lading verschoven. Vakwerkbrug gecontroleerd. |
| Heuvels | Tunnelopeningen verkleind en naast de route geplaatst; compacte bordjes naast de tunnelzone. Meidoorn verschoven. Hangbrug heen en terug gecontroleerd. |
| Fantasiewereld | Paddenstoel verplaatst: steel naast de route, hoed als voorgrond boven een deel van het pad. Poorten verkleind en toegang uitgelijnd. Kristalgrot voorzien van passend toegangspad. Maanbrug gecontroleerd. |
| Ruimtewereld | Maantunnel verplaatst en verkleind; pion loopt naar de zichtbare opening en daalt daarin af. Antenne verschoven. Transportstraal behouden en labels vrij van platforms geplaatst. Brug gecontroleerd. |

De pion blijft bij verkleinen op zijn voeten staan. De animatie bevat vijf opeenvolgende delen: aanlopen, inlopen, volledig onzichtbaar ondergronds bewegen, uitlopen en teruglopen naar het eindvak. Voorgrondranden bedekken de pion tijdens het in- en uitlopen. Bij gewoon lopen vóór een geplaatst object krijgt de pion de bijpassende voorste laag. Brugleuningen blijven afzonderlijke voorgrondlagen.

## Controle

- De bestaande volledige appcontrole is geslaagd: geïntegreerde kaartfamilie, bijzondere bewegingen, voorbeelden, opslaan, lesvormen, leerroutes, opdrachtenbank, dobbelstenen en woordspel.
- De nieuwe ruimtelijke controle loopt over alle elf kaarten op 1600 × 1000, 1024 × 768 en 390 × 844. De gecontroleerde routebordjes overlappen geen andere bordjes of zichtbare vaknummers en blijven binnen de kaart.
- Alle normale routestukken gecontroleerd op eindpunten en geldige coördinaten. Alle tien tunnels gecontroleerd op vrije afstand tot vakcentra en doorlopende zichtbare beweging.
- Alle tien tunnelvoorbeelden daadwerkelijk afgespeeld in Chrome. Ingang, ondergrondse onzichtbaarheid, uitgang en het verankeren van de pionvoet gecontroleerd. De voorbeelden veranderen de opgeslagen les niet.
- 44 aanvullende voorbeelden afgespeeld: groen/obstakel en brug, op iedere kaart heen én terug. Controlebeelden bekeken; geen JavaScript-fouten of wijzigingen van opgeslagen lessen tijdens deze voorbeelden.
- Overzichtsbeelden en beelden tijdens het in- en uitlopen opgeslagen bij de controle-uitvoer. Dit is een controle van de huidige elf werelden en de genoemde schermformaten; vrije toekomstige kaartplaatsingen moeten opnieuw worden gecontroleerd.

## Onderhoud

`Kaarten/ruimtewerking.js` bevat de actuele plaatsing van tunnelbeelden, toegangspaden, verplaatste objecten en labels. De oorspronkelijke posities in oudere kaartmodules worden bij het voorbereiden van de kaart overschreven. Verander de gedeelde plaatsing bij volgende correcties; verplaats niet alleen het beeld zonder het pad aan te passen.

`tests/spatial.cjs` is opgenomen in `npm test`. Visuele controle blijft nodig bij nieuwe beelden, maskers of plaatsingen. De zelfstandige HTML-kaarten in het bronarchief zijn eerdere demonstratieversies; de aangepaste gezamenlijke app staat onder DigiBoard.

## Gebruiken

Ververs de gezamenlijke app op http://127.0.0.1:61381/Start-Praatpad.html. Gebruik bij Speciale plekken de bewegingsvoorbeelden om de tunnel, brug en groenpassage te bekijken. De spelregels en bestemmingen zijn behouden.
