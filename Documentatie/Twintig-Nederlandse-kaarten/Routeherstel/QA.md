# Nederlandse kaarten — herstel van de routelogica

Status: **KANDIDAAT, lokaal**. Geen push of publicatie uitgevoerd. Correctie op de eerste integratie van 14 september 2026 (basiscommit `4bb62a7`).

De eerste controle bewees dat animaties zonder technische sprongen afspeelden, maar niet dat de pion op een aannemelijk geschilderd pad bleef. Daarom zijn alle twintig hoofdtrajecten én alle optionele routes opnieuw op de beelden beoordeeld. De bevindingen hieronder vervangen de eerdere algemene uitspraak dat de routes al goed waren.

## Herstel per kaart

| Kaart | Vakken | Uitkomst van de routecontrole |
| --- | ---: | --- |
| Delft | 25 | Stap 15→16 is nu een pontovertocht met twee aanlegplaatsen, trappen en een zichtbaar varend bootje. De optionele kadepassage 4→16 blijft apart. Het voetpad na de uitgang loopt langs de beplanting naar de kade. |
| Leiden | 18 | Tuintunnel begint bij 1, loopt via de rechter mond naar de linker en sluit met een zichtbaar tuinpad aan op 14. De grote lus die opnieuw over de brug en door het park liep vervalt. |
| Haarlem | 18 | Na poort 17→18 gaat de route naar de finish. De tegelstaart achter het pakhuis en de doodlopende kadezijtak zijn uit het beeld verwijderd. |
| Amersfoort | 34 | Doodlopende bovenste vijf vakken vervallen. Een geschilderde trap verbindt de walroute met het lagere pad. De tweede poort heeft een aparte droge uitgang bij de voet van de brug; de waterboog is geen wandeluitgang. |
| Dordrecht | 24 | Hoofdroute, pakhuizenpassage en aansluiting over de brede bestrate kade opnieuw beoordeeld; bestaande geometrie behouden. |
| Den Bosch | 19 | Boot blijft varen tot de aanlegplaats. Toegevoegde treden en een trap sluiten de aanlegplaats op de brugroute aan; de pion loopt niet door de kademuur omhoog. |
| Groningen | 25 | Optionele passage gaat eerst de dichtstbijzijnde trap in. Na de andere uitgang volgt de pion de bestrating rondom het trappenhuis. |
| Maastricht | 30 | Twee zichtbare trappen verbinden brugdek, lage kade, tunneluitgang en hoge vervolgroute. Positie van de rechter mond aangepast aan het nieuwe beeld. |
| Nijmegen | 22 | Onderste teruglus en extra bovenste zijtak vervallen. Na de walpassage volgt een doorlopend traject over de kade en de bestaande trap naar de parkroute. Behouden parkbrugbocht blijft onderdeel van de geometrie. |
| Deventer | 26 | Veer, kade, pakhuizenpassage en vervolgroute opnieuw beoordeeld; bestaande route behouden. |
| Kinderdijk | 27 | Houten platform vóór het gemaal vervangt de route over het dak. Een zichtbare trap links van de kleine tunnel verbindt boven- en benedenpad. Platform heeft een voorgrondleuning. |
| Zaanse Schans | 20 | Route start bij het blauwe vak naast Start; de voorste omweg en de lus vóór de werkplaats worden niet meer gelopen. Oorspronkelijke schildering behouden: de eerste bewerking verwijderde te veel tegels en is afgewezen. De genummerde hoofdroute bepaalt welke tak gespeeld wordt. |
| Afsluitdijk | 23 | Tunnel 13→20 is een keuze. De gewone route volgt 13→14 over de bestrating rondom het trappenhuis. De tunnel stuurt de pion niet eerst naar de verste uitgang en daarna terug langs dezelfde kade. |
| Neeltje Jans | 41 | Nieuwe trap verbindt lager pad 25 met bovenpad 26. De bovenste doodlopende tegelstaart vervalt. |
| Giethoorn | 19 | Na het boothuis eindigt de route bij de finish. Bovenste doodlopende bocht verwijderd. De ongebruikte voorgrondbrug is zichtbaar een gewone voetgangersbrug geworden. |
| Biesbosch | 39 | Houten vlonder verbindt de losse padstukken tussen 25 en 26. Aanlegplaatsen en vaarroutes sluiten aan op de wilgeneilandroute en de uitkijkroute. |
| Texel | 28 | Optionele route vanaf 1 bereikt de tunnel via een houten pad. Na de uitgang volgt de pion de zichtbare buitentrap en het duinpad naar 20. |
| Valkenburg | 26 | Geschilderd stenen terraspaadje verbindt het einde van de lange trap met de twee laatste vakken. De brug zelf is geen onbedoelde spelafslag. |
| Muiderslot | 35 | Zichtbaar grindpad verbindt Start met het eerste blauwe vak, vóór de heggen langs. Tuinwalpassage en slotpoort behouden. |
| Veluwe | 26 | Heidepad, brug en zandheuveltunnel opnieuw beoordeeld; bestaande geometrie behouden. |

Samen: **525 vakken, 22 tunnel-/poortpassages en 4 pontpassages**. Den Bosch gebruikt daarnaast een boot tijdens zijn tunnelpassage. Veertien bestaande brugvoorbeelden blijven beschikbaar. Veertien kaartafbeeldingen zijn bewerkt; originele afbeeldingen zijn behouden.

## Beweging en herkenbaarheid

- De beide monden van een passage dragen hetzelfde T-nummer. De bestaande knop met vertrek- en aankomstvak opent nog steeds de uitleg.
- Lange gewone verbindingspaden krijgen looptijd op basis van hun lengte (150 bronpixels per seconde, minimaal 650 ms per stap). Er is geen kaartzoom toegevoegd.
- Pion en boot gebruiken dezelfde positie. Ondergronds is de pion volledig onzichtbaar; buiten de mond groeit hij terug. Teruglopen gebruikt dezelfde geometrie in omgekeerde richting.
- Voorbeeldbewegingen veranderen de lesstand niet. Gewone passages werken ook bij grotere worpen; optionele passages behouden een keuze.

## Behoud van lessen

Zes kaarten zijn hernummerd. Bij de eerste keer openen worden de huidige les, Terug-geschiedenis, eerdere lessen, bordlijsten en taakverwijzingen omgezet. Een vervallen vak verwijst naar het laatste behouden vak ervoor, niet automatisch naar de finish. Namen, groepen, instellingen en de gekozen oefeningen blijven bewaard. De oorspronkelijke opslag en reserve krijgen een afzonderlijke kopie met achtervoegsel `-voor-routeherstel`. Een tweede keer herladen voert de omzetting niet opnieuw uit. Een achterhaalde, nog open tunnelkeuze wordt gesloten.

De 26 eerdere kaartmodules en 814 bijbehorende bron-/mediabestanden zijn vergeleken met `4bb62a7`: byte-identiek. Zie `../Bronbehoud-routeherstel.json`. Algemene lesbanken zijn niet aangepast.

## Controles en grenzen

Afgerond:

- Alle twintig hoofdtrajecten als lijn op de definitieve schildering bekeken, inclusief lange verbindingsstukken. Optionele aanloop- en uitlooptrajecten afzonderlijk bekeken.
- Alle 525 vakcentra aangeklikt; 46 kaarten in de kiezer, categorieën, Terug en sluiten gecontroleerd.
- Alle 26 passages vooruit en achteruit, voorbeeldstand, echte worp, optionele keuze, eindstand, herladen en Terug getest.
- Grotere worpen door gewone passages, afbreken en minder beweging getest.
- Veertien brugvoorbeelden op kwart-, half- en driekwartpunt gecontroleerd, beide richtingen. De test gebruikt nu de werkelijke looptijd in plaats van een vaste oude schatting.
- 44 tunneluitgangen in beide richtingen op contactbladen visueel nagekeken; de staande pion blijft buiten de voorrand zichtbaar.
- Zes oude kaartconfiguraties als testfixture: opgeslagen lessen worden zonder reset hernummerd, en een tweede herlading behoudt de omzetting.
- Vensterbreedten 320, 390, 768, 1280 en 1920 px: geen horizontale overloop. Het lokale overzicht bevat 54 beelden in drie aparte reeksen; alle twintig Nederlandse speellinks geven een geldige pagina.
- Specifieke regressiecontrole op Delft 15→16 per boot, Haarlem zonder staart na de poort, Afsluitdijk zonder teruglus en de geschilderde trapverbindingen.

De bewerkingen zijn spelcomposities, geen topografische reconstructies. Een automatische geometriecontrole kan niet zelfstandig bepalen of geschilderde bestrating logisch is; daarom zijn de lijnbeelden en bewegingsbeelden ook handmatig bekeken. Ongebruikte geschilderde zijpaden blijven op enkele kaarten decor aanwezig, met name Zaanse Schans. Alleen de genummerde hoofdroute en aangegeven passagekeuzes zijn spelroutes.

Alle **35 testscripts van de huidige app-suite zijn geslaagd**. De uitvoering liep in twee delen: het eerste deel stopte bij de browserstart van `map-cache.cjs`, omdat de standaard Playwright-browser hier ontbreekt. Vanaf dat script is de suite opnieuw gestart met de aanwezige Google Chrome via `CHROME_PATH` en volledig met exitcode 0 afgerond. De twee nieuwe regressie- en migratietests zijn daarnaast afzonderlijk geslaagd en staan nu standaard in `npm test`. De definitieve Nederlandse deelreeks en de aanvullende brugcontrole zijn eveneens geslaagd. Geen resterende testfouten. Zie de uitvoerbestanden onder `Controles/`.

## Bestanden en preview

- `../Geometrie.json`: definitieve coördinaten, passages, maskers en conversietabellen.
- `Routecontrole-1.png` t/m `Routecontrole-5.png`: alle twintig hoofdtrajecten.
- `Beeldbewerkingen.json`: bronbestanden, beeldbewerkingen en afgewezen versie.
- `ontwerp.py`, `herstel.py`, `bouw.py`, `runtime.py`, `runtime-herstel.js`: gebruikte bron- en bouwkopieën. De scripts zijn oorspronkelijk uitgevoerd vanuit de kaartproductietaak; de genoemde absolute ontwikkelpaden zijn broncontext, geen productafhankelijkheid.
- Runtime: `Kaarten/nederland-werelden.js`; kaartgegevens: `Kaarten/nederland-*.js`; nieuwe media: de `*-route-v2.png` bestanden onder `Kaarten/assets/`.
- Lokale app: <http://127.0.0.1:61381/Praatpad.html?kaart=nederland-delft>
- Lokaal overzicht: <http://127.0.0.1:61460/#nederland>

Herhaal de suite met `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm test`. Aanvullende visuele brugcontrole: `node tests/nederland-bridges.cjs`.
