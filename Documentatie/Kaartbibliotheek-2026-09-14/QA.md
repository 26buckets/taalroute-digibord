# Kaartbibliotheek — controle en categorieën

Opdracht van 14 september 2026: alle kaarten dubbel controleren, categorieën bij Wissel kaart organiseren, Kort toevoegen en de complete versie naar GitHub en online publiceren.

## Indeling

| Categorie | Kaarten | Gebruik |
| --- | ---: | --- |
| Algemeen | 6 | Dorp, Markt, Station, Buurttuin, Bibliotheek, Museum |
| Nederland | 28 | Acht bestaande landschappen/steden en twintig nieuwe Nederlandse kaarten |
| Fantasie & avontuur | 8 | Fantasie, ruimte, pool, onderwater, jungle, woestijn, kasteel en bergdorp |
| Spreektijd | 4 | Smalltalk, Werken in Nederland, Afspraak maken en verzetten, Gezondheid en zorg |
| Kort | 12 | Alle kaarten met maximaal twintig vakken; aanvullende selectie |

Kort bevat Markt (12), Station (16), Buurttuin (12), Bibliotheek (16), Museum (20), Afspraak (16), Gezondheid en zorg (17), Leiden (18), Haarlem (18), Den Bosch (19), Zaanse Schans (20), Giethoorn (19). Het blijven dezelfde kaarten, met dezelfde URL en lesopslag. Een korte route is geen vaste tijdsbelofte: opdrachtduur en aantal afzonderlijke pionnen beïnvloeden de speelduur.

## Beeld- en routecontrole

Alle 46 kaartbeelden en hoofdtrajecten zijn opnieuw op twaalf contactbladen bekeken. Voor de latere kaarten zijn de route en aanloop-/uitlooppaden over het beeld geprojecteerd. De twintig Nederlandse herstelkaarten van commit ac42d8a gaan ongewijzigd mee. De vorige herstelcontrole en beperkingen blijven van toepassing: ongebruikte geschilderde zijpaden zijn decor, onder meer in Zaanse Schans; de genummerde route is leidend.

Extra gevonden en hersteld: op de gedeelde nieuwe kaartwerking kon de pion na uitlopen opnieuw achter de tunnelrand komen zodra de animatie eindigde. De positiegebonden vrije zone rondom beide monden geldt nu ook bij stilstand, herladen en de volgende stap. De langere uitloop van de Station-kaart is meegenomen. Twintig monden op tien kaarten zijn als echte opgeslagen eindstand geopend en visueel bekeken; de overige vijf uitbreidingen hebben geen tunnel. De twee Spreektijd-brugbeelden zijn eveneens visueel nagekeken. Kaartbeelden, nummers en routegeometrie zijn in deze ronde behouden.

## Controles

De categoriecontrole is geslaagd: vijf groepen, 46 unieke kaartknoppen, twaalf korte links, huidige kaartmarkering, sluiten met Escape/buitenklik, browser-Terug, vijf vensterbreedten (320/390/768/1280/1920), lichte en donkere browservoorkeur, minimaal 44px categorieknoppen en geladen miniaturen. Schermmetingen wachten op twee tekenrondes na een vensterwijziging.

De nieuwe tunnelcontrole is geslaagd op alle vijftien uitbreidingen, inclusief eindstand, opslag/herladen, voor- en achterwaartse uitloop en volgende stap. Bij het maken van contactbladen wordt eerst de app gesloten zodat geen oude schermverversing over een vervangen pagina doorloopt.

Alle 37 testscripts zijn geslaagd. De hoofdreeks is aangevuld met afzonderlijk geslaagde herhalingen van de laatste scripts nadat enkele testbrowsers onverwacht sloten. Bij de routekeuze na herladen is bovendien een bedieningsfout gevonden: de tijdelijke statusmelding kon zes seconden muisklikken op een onderliggende keuze onderscheppen. De niet-interactieve melding laat nu muisklikken door; de controle op de bewaarde pontkeuze in het zinnenspel is daarmee geslaagd. De volledige ruimtelijke controle is daarna met 46 geslaagde kaarten en exitcode 0 afgerond. Ook geluid, menu’s, pionlagen en zinnenspel zijn met exitcode 0 afgerond. Publicatie volgt op deze gecontroleerde bronversie.

Bronnen: Kaarten/register.js, Kaarten/nieuwe-werelden.js, Praatpad.html. Tests: library-categories.cjs, new-world-rest-depth.cjs, all-map-review.cjs en de volledige npm-testreeks.

De bronbouwers onder Bronnen/ bewaren het aanvullende categorie-register bij een toekomstige kaartuitbreiding. Ze zijn gecontroleerd op syntaxis; de kaartproductie is niet opnieuw uitgevoerd.
