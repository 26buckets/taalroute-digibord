# Controleverslag — twintig Nederlandse speelkaarten

14 september 2026 · lokale kandidaat. Geen push of publicatie.

## Gerichte controles

- Alle twintig kaarten laden; twintig oorspronkelijke afbeeldingen blijven SHA-256-identiek. 878 bestaande kaart-/lesbestanden vergeleken met bb24ca9, zonder inhoudelijke wijziging. Register en vormregister zijn afzonderlijke uitbreidingen.
- Alle 556 opdrachtvakken met echte muisklikken op hun beeldpositie gecontroleerd: het juiste vak wordt geselecteerd. Alle kaart- en SVG-ID’s zijn uniek. De vier bestaande vormen worden gebruikt.
- Iedere routestap heeft eindpunten op de geregistreerde ankers. Heen-/teruggeometrie, einddiepte en getallen zijn gecontroleerd. Per doorgang en richting zijn 1.001 posities op zichtbare sprongen gecontroleerd.
- 25 passages (22 tunnel/poort, drie pont) zijn in beide richtingen als echte animatie afgespeeld. Ondergrondse fase heeft exact nul zichtbaarheid. Uitloop en stilstand gebruiken dezelfde diepte, ook na herladen. Preview laat de lesstand intact.
- Echte worp bij iedere passage, optionele keuze waar van toepassing, bestemming, herladen en ongedaan maken gecontroleerd. Gewone passages ook met worp drie: doorlopen, verder lopen en terugzetten.
- Alle 25 passages tussentijds afgebroken en met rustig bewegen gespeeld; geen achterblijvende verborgen pion of zichtbare lege boot. Vijftig afzonderlijke gevallen geslaagd.
- Veertien brugvoorbeelden heen en terug op drie momenten bekeken. De voorste constructie bedekt de pion alleen op de betreffende beeldstroken. Nijmegen na de routecorrectie opnieuw gecontroleerd en visueel beoordeeld.
- Zes contactbladen met tunneluitgangen in beide richtingen visueel bekeken. Er zijn dunne mondranden gebruikt; groei vindt buiten de mond plaats.
- Kaartkiezer: 46 miniaturen, vier categorieën met aantallen 6/28/8/4, actieve kaart, selectie, Escape, buitenklik en browser-Terug gecontroleerd.
- Breedtes 320, 390, 768, 1280 en 1920 px: geen horizontale pagina-overloop; kiezer blijft binnen het venster. Labels en zichtbare vaknummers op alle 46 kaarten op overlap en kaartgrenzen gecontroleerd op 390, 1024 en 1600 px.
- Op het ontwerpoverzicht laden alle 54 beelden, alle negen documentlinks en alle 24 speellinks. De twintig Nederlandse speellinks hebben ieder een eigen kaart-ID. Bladeren blijft binnen de gekozen collectie.

## Tijdens de controle hersteld

- Kleine perspectieftegels hadden overlappende klikgebieden. De echte muisklik kiest nu het dichtstbijzijnde vakcentrum; toetsenbordbediening blijft behouden.
- Leiden: aanloop langs de droge parkzijde en uitloop langs de oever, zonder lopen over het kanaal.
- Biesbosch: twee echte pontjes verbinden de eilanden; de pion loopt niet over open water.
- Den Bosch: boot blijft bij de pion tot de aanlegplek.
- Brugleuningen hebben een eigen laag boven de maximale pionlaag. Een nabijgelegen tunnelmond kan de pion daardoor niet vóór een brugleuning plaatsen. Dit is ook op de slotbrug opnieuw afgespeeld.
- Dubbele tunnelknoppen vervangen door één label per passage; nummer 11 bij Neeltje Jans iets verschoven ten opzichte van nummer 10.
- Nijmegen: onlogische lus langs de finish verwijderd. De hoofdroute heeft nu 32 vakken en gebruikt de parkbrug vóór aankomst bij de finish. Vijf tegels van de andere parkarm blijven decoratief. De eerdere totaaltelling 561 is daarom vervangen door 556.

## Testharnas

De oude ruimtelijke tunnelcontrole werkt uitsluitend met de oorspronkelijke DigiBoardSpatial-geometrie. Nieuwe Nederlandse passages hebben hun eigen tests; labelcontrole en gewone routestappen blijven voor alle kaarten gelden. De schaalcontrole is aangepast om een aangeboden routekeuze te beantwoorden; anders bleef de test wachten op een bewuste gebruikerskeuze. Dit was geen vastgelopen animatie.

Alle 33 onderdelen van de actuele app-testsuite zijn in etappes geslaagd: de eerste run tot de schaaltest, de herstelde schaaltest afzonderlijk, daarna alle resterende appcontroles. De grotere-worp- en afbreektests zijn afzonderlijk geslaagd en toegevoegd aan de suite. Na de laatste geometrie-/laagcorrecties zijn alle twintig Nederlandse geometrieën, alle klikposities en de betrokken brug-/slotpassages opnieuw gecontroleerd. De eerste onderbroken run blijft als historische uitvoer bewaard; dit verslag claimt geen ononderbroken geslaagde `npm test`-aanroep.

## Afbakening

Dit is een controle in lokaal Chrome met geautomatiseerde bewegingen en visuele beoordeling van vastgelegde frames. Het is geen garantie dat ieder beeldpunt op ieder digibord is beproefd. De originele tekeningen zijn vrije composities: sommige zijpaden blijven decoratief en ongenummerde verbindingsstukken zijn loopafstand, geen extra beurt. Er zijn geen afbeeldingen opnieuw gegenereerd en geen bestaande Spreektijd-dieptecorrecties geclaimd. De bestaande algemene oefeningen worden hergebruikt.

## Reproduceren

- `npm run test:nederland`: geometrie, klikposities, kiezer, doorganganimaties, grotere worpen, afbreken en rustig bewegen.
- `node tests/nederland-bridges.cjs`: brugframes en contactbladen.
- `npm test`: de volledige bestaande en nieuwe appcontroles.
- `Bronbehoud.json`, `Geometrie.json` en `Controles/`: bronvergelijking, definitieve registratie en controle-uitvoer.
