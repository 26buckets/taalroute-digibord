# Twintig Nederlandse speelkaarten

Status: LOKALE KANDIDAAT — 14 september 2026. Niet gepusht of gepubliceerd.

Open http://127.0.0.1:61381/Praatpad.html?kaart=nederland-delft of kies in de bestaande app **Wisselkaart → Nederland**. Het ontwerpoverzicht op http://127.0.0.1:61460/#nederland bevat bij alle twintig beelden een link **Open speelkaart**.

## Wat is gebouwd

De twintig bestaande Nederlandse ontwerpbeelden zijn ongewijzigd gebruikt. Het geschilderde pad en de vormen blijven zichtbaar; onzichtbare klikgebieden, vaknummers, pionnen en uitgesneden voorgronden maken ze speelbaar. Samen bevatten de kaarten 556 opdrachtvakken, ieder met een start en finish buiten dat aantal.

Volg de genummerde hoofdroute. De beelden waren vrije ontwerpcomposities: sommige geschilderde zijpaden en extra tegelvormen blijven decoratief. Onbenummerde verbindingsstukken zijn loopafstand, geen extra beurt. De definitieve aantallen volgen de gekozen hoofdroute en vervangen de eerdere globale richtgetallen. De kaarten zijn geen geografisch exacte plattegronden; verschillende tunnels zijn spelonderdelen.

De bestaande niveaus, vier vormen, oefenkeuze, zinnenspel, pionindeling, docentbediening, geluid, ongedaan maken en lesopslag worden hergebruikt. Deze uitbreiding maakt geen nieuwe thematische opdrachtenbank.

## Kaarten

| Kaart | Opdrachtvakken | Bijzondere passages en voorbeelden |
| --- | ---: | --- |
| Delft | 25 | Over de grachtbrug (5→10); Kadepassage (4→16) |
| Leiden | 18 | Over de singelbrug (6→12); Tuintunnel (10→14) |
| Haarlem | 21 | Over de ophaalbrug (7→11); Pakhuispassage (17→18) |
| Amersfoort | 39 | Over de stenen brug (25→35); Door de stadswal (10→11); Door de Koppelpoort (23→24) |
| Dordrecht | 24 | Over de draaibrug (7→8); Pakhuizenpassage (11→12) |
| Den Bosch | 19 | Over de Binnendieze (2→8); Varen onder de huizen (1→10) |
| Groningen | 25 | Over de museumbrug (9→13); Pleinonderdoorgang (14→20) |
| Maastricht | 30 | Over de Sint-Servaasbrug (8→22); Kademuurpassage (24→25) |
| Nijmegen | 32 | Over de parkbrug (25→26); Walpassage (7→8) |
| Deventer | 26 | Met het pontje over de IJssel (8→9); Pakhuizenpassage (14→15) |
| Kinderdijk | 27 | Dijktunnel (1→14) |
| Zaanse Schans | 25 | Over de houten ophaalbrug (6→7); Door de werkplaats (17→18) |
| Afsluitdijk | 23 | Onder de onderhoudsstrook (13→14) |
| Neeltje Jans | 46 | Door de deltawerken (11→12) |
| Giethoorn | 22 | Door het boothuis (13→14) |
| Biesbosch | 39 | Over de kreekbrug (17→24); Pont naar het wilgeneiland (13→14); Wilgentunnel (14→15); Pont naar de uitkijkroute (30→31) |
| Texel | 28 | Over de duinbrug (12→18); Duintunnel (5→20) |
| Valkenburg | 26 | Door de mergelgrot (11→12) |
| Muiderslot | 35 | Over de slotbrug (27→33); Door de tuinwal (16→17); Door de slotpoort (33→34) |
| Veluwe | 26 | Over de zandbrug (9→15); Zandheuveltunnel (18→19) |

## Route en diepte

Gewone doorgangen tussen opeenvolgende vakken worden ook tijdens een grotere worp doorlopen. Optionele verbindingen geven bij landen een keuze; de gewone route blijft beschikbaar. Bekijk de uitleg en beweging bij **Speciale plekken**. Voorbeelden veranderen de lesstand niet.

Tunnels hebben een aanloop, de mond passeren, volledig verdwijnen, uitkomen en uitlopen. De pion krimpt pas vlak voor de mond en groeit buiten de mond terug. De positie ten opzichte van de mond bepaalt de voor-/achterlaag, ook bij omgekeerde beweging en stilstand. Dunne randen worden uit het oorspronkelijke beeld gekopieerd; geen brede kopie van een huis die de pion bij uitkomen bedekt.

De drie pontpassages hebben instappen, samen varen en uitstappen. In Den Bosch vaart een boot onder de huizen; deze blijft tot de aanlegplek bij de pion. Brugleuningen hebben smalle voorgrondmaskers, afgestemd op het dek. Alle passages gebruiken dezelfde geometrie voor pion, afbeelding en eventuele boot.

## Bibliotheek

De app bevat 46 kaarten: Dagelijks leven (6), Nederland (28, inclusief acht bestaande kaarten), Fantasie & avontuur (8) en Spreektijd (4). De huidige categorie opent direct. Kaartkeuze behoudt bestaande route-URL's, geschiedenis en lesvoorkeuren. De vorige 26 kaartmodules en hun beelden blijven behouden.

## Bestanden en onderhoud

- `Geometrie.json`: definitieve routepunten, vormen, doorgangen, maskercontouren en voorbeelden.
- `Bronbehoud.json`: SHA-256-controle van de twintig oorspronkelijke beelden en vergelijking van bestaande kaart-/lesbestanden met bb24ca9.
- `Kaarten/nederland-*.js` en `.css`: zelfstandige kaartmodules en gedeelde Nederlandse runtime.
- `Lessen/kaartbibliotheek.css`, `Kaarten/register.js`, `Lessen/kaartvormen.js`, `Praatpad.html`: koppeling aan de bestaande app.
- `QA.md`: controles en afbakening.

Bestaande kaarten gebruiken hun eigen bewegingscode. Deze uitbreiding corrigeert niet automatisch eerder gemelde problemen in de vier Spreektijd-kaarten.
