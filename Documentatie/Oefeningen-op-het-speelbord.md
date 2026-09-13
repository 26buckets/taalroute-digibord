# Vier oefeningen op één speelbord

Het speelbord is het hart van DigiBoard. Je kiest een kaart, gooit de bestaande dobbelsteen en loopt met de pion. De knop **Oefening: …** boven de kaart opent de oefenkeuze in het bestaande instellingenmenu.

| Oefening | Wat staat op het bord? | Wat doet de cursist? |
|---|---|---|
| **Directe vragen** | Woon jij in de stad? | Geeft zelf antwoord: bijvoorbeeld *Ja, ik woon in de stad.* |
| **Met een gesprekspartner** | Vraag of de ander in de stad woont. | Bedenkt zelf de vraag, stelt die en luistert naar de reactie. Ook vertellen, kiezen en iets regelen krijgen een plaats in het gesprek. |
| **Mix van beide** | Een directe vraag óf een gespreksopdracht. | Ziet bij iedere opdracht welke oefening het is. Alleen deze keuze combineert de twee voorraden. |
| **Zinnen maken** | Bij worp 5: *jullie · werken*, met een tijd. | Loopt vijf stappen en maakt een zin met *jullie*. Groen = nu, blauw = verleden tijd, rood = voltooide tijd. |

## Drie onafhankelijke keuzes

**Oefening** bepaalt welke taalhandeling je oefent. **Werkvorm** bepaalt wie het antwoord voorbereidt en wie spreekt. **Pionindeling** bepaalt met hoeveel pionnen je over de kaart loopt.

Een gedeelde pion betekent dus niet dat iedereen een gesprekspartner nodig heeft. Je kunt met één pion spelen terwijl iedereen zelfstandig een eigen antwoord bedenkt. Je kunt ook vijf, tien of twintig pionnen gebruiken, voor zover er genoeg cursisten in de lijst staan.

- **Directe vragen + individueel + één pion:** iedereen beantwoordt dezelfde vraag met eigen informatie.
- **Directe vragen + klassikaal, één spreker + één pion:** iedereen bereidt een antwoord voor. Alleen de cursist die op het bord staat, zegt het hardop. De namenlijst blijft onafhankelijk van de worp.
- **Gesprekspartner + tweetallen:** A voert de opdracht uit; B reageert. Daarna kunnen de rollen wisselen.
- **Gesprekspartner + individueel:** de cursist oefent zijn of haar eerste zin in een gesprek. De app zegt expliciet dat daarvoor geen partner gezocht hoeft te worden. Een echte uitwisseling vraagt daarna wel een gesprekspartner.
- **Zinnen maken:** dezelfde worp bepaalt zowel de stappen als de grammaticale persoon. Dat werkt bij één gedeelde pion en bij meerdere pionnen.

De oefenkeuze verandert geen namen, groepsindeling of pionstanden.

## Directe vragen op vier routes

Er zijn **240 nieuwe directe vragen: 60 per route, 15 per vorm**. De bestaande **960 opdrachtkaarten: 240 per route** blijven bewaard als gespreksvoorraad. Samen zijn dat 1.200 kaarten; de mix heeft 300 kaarten per route. De 432 mogelijke combinaties van het zinnenspel staan daar los van.

| Route | Directe vraag | Wat is voldoende? |
|---|---|---|
| A0 → A1 | Draag jij vandaag een trui? | *Ja*, *nee* of een korte zin. De docent kan de vraag voorlezen. |
| A1 → A1+ | Hoe ga jij naar de les? | Een korte concrete antwoordzin, bijvoorbeeld *Ik ga met de fiets.* |
| A1 → A2 | Wat heb jij gisteren gegeten? | Een antwoord over eerder, met geoefende zinsbouw. Bij andere vragen kan een korte reden worden gevraagd. |
| A2 → B1 | Werk jij liever thuis of op kantoor? Leg je keuze uit. | Een begrijpelijk antwoord met de gevraagde toelichting. |

De route A0 → A1 is begeleid instapmateriaal; de vragen zijn geen zelfstandige leestoets voor iemand die net begint. Begin met bekende woorden en ja/nee-vragen. Introduceer bijvoorbeeld *liever* voordat je voorkeuren laat vergelijken. Meer zinnen eisen maakt een eenvoudige vraag niet vanzelf didactisch beter.

Hulp en Voorbeeld verschijnen pas na aanklikken. Een voorbeeld is één mogelijk antwoord, geen antwoord dat iedereen moet overnemen. Eigen en verzonnen informatie zijn allebei bruikbaar.

## De vier vormen blijven herkenbaar

| Vorm | Directe vragen | Met een gesprekspartner |
|---|---|---|
| ○ Rondje | Vertel over jezelf. | Vertel iets in het gesprek. |
| □ Vierkant | Beantwoord de vraag op het bord. | Formuleer zelf een vraag. |
| △ Driehoek | Geef jouw keuze of voorkeur. | Maak of bespreek een keuze. |
| ◇ Ruit | Reageer op een concreet aanbod of een praktische vraag. | Regel iets met taal. |

Het onderscheid bij het vierkant is bewust: een vraag **begrijpen en beantwoorden** is iets anders dan een vraag **zelf formuleren**. Bij de ruit kan A0 beginnen met *Ja, graag* en *Nee, dank je*. De kleuren en vormen op de geschilderde kaarten veranderen niet. Het bord toont steeds de gekozen oefening en het niveau.

## Variatie en opslag

De app bewaart gebruikte kaarten per groep, niveauroute, vorm en oefenkeuze. Directe vragen trekken uitsluitend uit hun eigen voorraad. Gespreksopdrachten trekken uitsluitend uit de oorspronkelijke voorraad. De mix is een bewuste derde keuze; de aantallen van beide soorten zijn daarin niet gelijk.

Per vorm zijn er in de directe voorraad vijftien vragen per route, in de gespreksvoorraad zestig en in de mix vijfenzeventig. De automatische selectie vermijdt herhaling tot die voorraad is doorlopen. Een docent kan in de catalogus bewust een eerdere opdracht kiezen.

Herladen houdt de huidige opdracht vast. Iedere pion bewaart zijn eigen opdracht. Wisselen van oefening kiest passende opdrachten bij de bestaande pionstanden. Een nieuwe oefenkeuze verplaatst geen pion. Alle elf kaarten, tunnels, bruggen en bijzondere routes blijven dezelfde.

## Inhoud en controle

`Lessen/directe-vragen.json` is de bron voor de 240 directe vragen. `Lessen/opdrachtenmatrix.json` bewaart de 960 bestaande opdrachten. De opdracht, hulp, het voorbeeld en het oefendoel staan per kaart bij elkaar. `npm run build:matrix` bouwt beide browserbestanden.

De bestaande Excel bevat de oorspronkelijke 960 opdrachten en het zinnenspel. De 240 nieuwe directe vragen staan voorlopig in hun eigen JSON en in de leesbare lijst **Directe-vragen-overzicht.md**. Ze zijn dus niet stilzwijgend als 960 nieuwe directe vragen geteld.

De nieuwe vragen en mogelijke antwoorden zijn redactioneel gecontroleerd op natuurlijk Nederlands, spelling, logische aansluiting en begrijpelijkheid van de instructie. De controles bewaken daarnaast aantallen, vier vormen, gescheiden voorraden, herhaling, bewaarde opdrachten, pionstanden en de zichtbare werking op het bord. Het niveau is een didactische keuze; observeer in de les welke woorden en patronen de groep al kent.
