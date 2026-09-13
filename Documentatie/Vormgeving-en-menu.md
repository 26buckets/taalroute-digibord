# Vormgeving en menu — 13 september 2026

De bestaande gezamenlijke app heeft een gedeelde tekst- en bedieningsstijl. De kaart en de dobbelsteen blijven het speelbord. Niveau, oefening en opdrachtkeuze staan rechtsonder naast de kaart.

## Tekst en knoppen

Arial is het vaste interfacelettertype. Normale tekst heeft gewicht 400; koppen en belangrijke acties 700. De opdracht op de kaart is 28–32 pixels, context 20–22 pixels. Bij vergroten groeit de opdracht mee. Menu- en dialoogkoppen zijn 24 pixels, tussenkoppen 20 pixels, invoervelden en knoppen 16 pixels, labels en secundaire acties 14 pixels. De compacte bovenbalk gebruikt 14–16 pixels. Kleuren voor vormen, tijden en kaartobjecten houden hun betekenis.

De opdracht staat op een witte ondergrond. Een lege contextkolom wordt weggelaten. Hoofdacties hebben dezelfde donkere blauwgroene kleur, overige acties een rustige rand of tekststijl. Verhaaldobbelstenen en het woordspel gebruiken dezelfde tekstgewichten en bedieningsmaten; de oefenwoorden blijven groot.

## Menu

| Onderdeel | Inhoud |
| --- | --- |
| Les | Kaart en oefening; andere spelvormen |
| Groep | Namen en pionnen van deze les; bewaarde groepen |
| Opdrachten & lessen | Lessen en printen; didactische uitleg |
| Weergave & geluid | Beeldstijl, minder beweging, speelvakweergave, dobbelsteengeluid |
| Bewaren | Reservekopie en herstel |

De kaartkiezer en niveauroute staan samen bovenaan de lesinstellingen. De werkvorm en beurten staan bij de les; pionindeling staat bij de deelnemers. De oorspronkelijke invoervelden, opslag en actiehandlers zijn hergebruikt. De duplicate kaartkiezer en tweede zinnenspelconfiguratie zijn uit de zichtbare bediening gehaald. Het paneel voor andere spelvormen verwijst naar de kaartinstellingen. De vensterbreedte en navigatie blijven gelijk bij didactische uitleg.

Didactische uitleg vermeldt expliciet dat de eerste vier routes speelopdrachten hebben. De drie hogere routes blijven herkenbare ontwerpvoorbeelden.

## Controle

Visuele controle van de korte opdracht, de langste B1-gespreksopdracht inclusief individuele werkwijze, de lesinstellingen, deelnemers, didactische uitleg, verhaaldobbelstenen en het woordspel. De lange opdracht is gecontroleerd op 1024×768, 1280×720, 1366×768 en 1920×1080: de volledige tekst is zichtbaar en de kaart blijft in beeld.

De automatische appcontrole is uitgevoerd, inclusief de elf kaarten en ruimtelijke werking. Een kleine overschrijding van de rechterbediening bij 720 pixels hoogte is verholpen met compactere tussenruimte en opnieuw gecontroleerd. De controles voor bediening, opgeslagen voortgang, niveaus, oefeningen, groepen, pionnen, geluid en voorgrondlagen blijven onderdeel van de bestaande tests.

De wijzigingen zijn lokaal aangebracht in de bestaande app. Dit document claimt geen nieuwe online publicatie of synchronisatie met Google Drive.

## Compacte Lucide-bediening

De gebruiker heeft vervolgens compactere knoppen en Lucide-iconen gevraagd. De bovenbalk is teruggebracht van 80 naar 64 pixels; de bovenste knoppen en keuzelijsten zijn 44 pixels hoog. Iconen zijn 20 pixels, met een lijngewicht van 1,8. Dit maakt de bediening rustiger en geeft de kaart meer ruimte, met behoud van klikruimte.

Bij de opdracht: Hulp gebruikt `life-buoy`, Andere opdracht `split` en Voorbeeld `message-square-quote`. Het aparte groepje Docent bevat `footprints` voor Extra stap en `graduation-cap` voor Docentaanpak. Elke pictogramknop heeft een Nederlandse toegankelijke naam en een uitleg bij aanwijzen of toetsenbordfocus. De extra-stapdialoog richt zich nu expliciet tot de docent.

Ook de eerder handgetekende bedieningsiconen van geluid en verhaaldobbelstenen gebruiken de ingebouwde Lucide-bibliotheek: `volume-2`, `volume-x`, `shuffle`, `dice-5`, `eye` en `eye-off`. Hiervoor is geen externe verbinding of nieuw iconenpakket nodig.

## Stabiel speelbord tijdens worpen

De kaart en het opdrachtvak hebben op desktop een vaste verdeling op basis van de schermhoogte. De opdrachttekst bepaalt de kaarthoogte niet meer. Lange opdrachten blijven volledig beschikbaar via scrollen binnen het tekstgedeelte en via Opdracht vergroten. Bij tekst die niet volledig past verschijnt naast het vergrooticoon de tekst Lees alles; de kaartverdeling blijft daarbij gelijk. Kop en hulpknoppen hebben gereserveerde ruimte. De dobbelsteen, voortgang en tekstblokken rechts hebben vaste afmetingen.

Tijdens gewone worpen en verplaatsingen blijft de vorige opdracht staan. De bestaande vaste melding boven de dobbelsteen geeft aan dat de pion onderweg is. De nieuwe opdracht verschijnt bij de bestaande landingsvoorvertoning. Keuzes voor pontjes, tunnels en andere bijzondere routes blijven bereikbaar in het opdrachtvak.

Controle: tests/stable-layout.cjs is opgenomen in de volledige appcontrole. De test vergelijkt kaart-, opdrachtvak- en dobbelsteengeometrie tijdens opeenvolgende worpen op 1024×768, 1280×720 en 1366×768, voor taalopdrachten en het zinnenspel. Ook de langste B1-context en de vergrote weergave worden gecontroleerd. Een aanvullende meting met gewone animaties op 1366×768 gaf gedurende drie worpen steeds dezelfde kaarthoogte van 412,2 pixels, dezelfde bovenrand van het opdrachtvak en dezelfde dobbelsteenruimte.

## Kaartbediening rechtsonder

Niveau, Oefening en Opdracht kiezen staan naast de kaart, rechtsonder. Daaronder staan drie Lucide-knoppen: Wissel kaart, Speciale plekken en Vaknummers. De kaartkiezer toont alleen de elf werelden. Speciale plekken toont per verbinding een compacte uitleg en een bewegingsvoorbeeld. Vaknummers uit toont enkele herkenningsnummers bij speciale vertrek- en eindvakken; aan toont de volledige reeks ronde nummerlabels. De drie kaarticonen hebben altijd zichtbare tekstlabels.

De vier opdrachtvormen gebruiken overal dezelfde 24px Lucide-symbolen in de vormkeuze en opdrachten. Klikken op de achtergrond buiten een venster sluit het. De bestaande bordverdeling blijft vast tijdens worpen. Gecontroleerd met tests/board-tools.cjs en de bestaande regressiecontroles.

De vaste schermindeling geldt ook voor appvensters van 600–899px breed. Het opdrachtgedeelte krijgt daar een vaste hoogte; lange inhoud blijft intern bereikbaar. De regressiecontrole meet bij echte worpen ook de kaartafbeelding en interne kaartschaal op alle elf werelden.

De dobbelsteen is vergroot naar 140–190px schermruimte. Les- en kaartbediening blijven onderaan staan; bij weinig hoogte kan alleen de bovenste statusregio intern scrollen. Pauze, Scherm, Instellingen, Geluid en de opdrachthulp hebben zichtbare labels.
