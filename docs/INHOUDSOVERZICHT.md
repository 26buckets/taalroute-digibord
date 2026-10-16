# Inhoudsoverzicht, vaste ingangen en startmixen

Besluit en uitvoering op verzoek van Nico, 5 oktober 2026. De bestaande instellingenpagina houdt haar navigatie en compositie. Actuele opdrachtenbank wordt Inhoudsoverzicht; Didactische uitleg blijft een eigen ingang. De oude losse demonstratielijst, vaste telling van 960 en bevestigingsknoppen zonder leskoppeling zijn vervangen. Er is geen bronbank gewijzigd, extra inhoud vrijgegeven of opdracht verwijderd.

## Eén telling uit de beschikbare inhoud

`content-overview.js` leest `ContentUI.teacherEntries()`. Dat zijn de actuele, vrijgegeven opdrachten uit `ContentRuntime.availableForPreparation()`, met de bestaande docentmapping, individuele routes en oorspronkelijke IDs. De browserregressie vergelijkt de volledige unieke verzameling met de runtime: 11.338 IDs bij deze basis, inclusief alle 7.148 grammatica- en WZ-opdrachten. Dit zijn controletellingen, geen constanten voor de interface.

- Totalen worden per `content_item_id` ontdubbeld, ook tussen onderwerpen en families. Hergebruik wordt geen tweede opdracht.
- Niveau betekent de huidige leerroute van de individuele opdracht; oude bronlabels worden niet opnieuw als huidige niveaus gebruikt.
- Vrij inzetbaar en met gericht oefendoel tellen afzonderlijk op tot het beschikbare totaal. Afgekeurde en niet vrijgegeven records blijven buiten beide tellingen.
- Oefensoorten sluiten aan op de bestaande filters. Functies sorteren valt bij Herkennen; vrije productie en scenario vallen bij Zelf een antwoord maken. Gemengd is de vereniging, geen extra soort voorraad. Niet ingedeelde soorten blijven zichtbaar onder Andere oefeningen.
- De route-onderwerpmatrix toont aantallen en klikbare selecties. Nul betekent geen beschikbare inhoud; er wordt zonder inhoudsbesluit geen tekort of ongeschikt niveau van gemaakt.
- Een onderwerp kan langs meerdere categorieën gevonden worden. De pagina waarschuwt dat rijtotalen daardoor niet opgeteld mogen worden.

De drie tabbladen zijn Oefeningen, Spellen en materiaal en Spreiding per niveau. Filters, totalen, voorbeelden en doorklikken gebruiken dezelfde bronselectie. Voorbeelden zijn gepagineerd en blijven allemaal bereikbaar; antwoorden zijn standaard dicht. De gedeelde opdrachtweergave houdt situaties, nadruk en opties intact.

## Vanuit overzicht naar een echte les

Een onderwerp-/niveaukeuze maakt via de bestaande runtime een selectie met de oorspronkelijke bronfamilies, banken en topics. Vrij oefenen gebruikt alleen FREE. Een gericht oefendoel vraagt een bewuste keuze; dan worden uitsluitend opdrachten voor die constructie geselecteerd. De knop vermeldt het daadwerkelijke aantal in de lesselectie en beschikbare spelvormen. Geen stille niveauvervanging of afzwakking van de vrijgavecontrole.

Gebruik in een les sluit Instellingen en opent de bestaande lesvoorbereiding. De gekozen soort oefening, constructie en route blijven in de selectiespecificatie staan. Tijd, spelvorm, opslaan, zelf aanpassen en hervatten lopen daarna via de bestaande lesfuncties. Er wordt door bladeren geen lopende les, groep of voortgang overschreven.

De instellingeniframe leest de al geladen inhoud van haar eigen DigiBord-venster. Zij laadt geen tweede bank en houdt geen kopie van de aantallen bij. Wanneer de instellingen los worden geopend, verwijst een melding naar DigiBord in plaats van aantallen te verzinnen.

## Spellen en materiaal

Gezamenlijke spelvormen tonen dezelfde opdrachten in een andere vorm; hun aantallen worden niet vermenigvuldigd. Nederlands tussen de regels hoort bij de gezamenlijke voorbereiding. Zelfstandige kaartfamilies gebruiken hun eigen vrijgegeven kaarten, routes en FREE/GUIDED-indeling: bij deze basis 560 unieke zelfstandige kaarten, naast de 50 kaarten Nederlands tussen de regels in de gezamenlijke voorraad.

Zinnen bouwen toont de 23 daadwerkelijk gevulde werkwoordsets en 303 unieke werkwoorden. Lege voorbereidende setdefinities tellen niet als beschikbare sets. Verhaal maken toont tien beschikbare beeldsets en 320 unieke beelden. Gedeelde beelden of werkwoorden tellen in het totaal eenmaal. Mogelijke worpen worden niet als geschreven opdrachten opgevoerd. De eigen spelinstellingen en bronmateriaal blijven intact.

## Didactische uitleg

De uitleg gebruikt dezelfde onderwerp-/niveaufilters en concrete opdrachten. Leerdoel, taalsteun, werkvorm en docenttip komen uit de gekoppelde actuele lesuitleg, met bestaande opdrachtvelden als terugval. Ontbrekende informatie wordt niet aangevuld met een fictieve bronkoppeling of niveaucertificering. De docent kan tussen opdrachten en uitleg wisselen met behoud van de gekozen inhoud en vandaaruit de echte voorbereiding openen.

## Vaste ingangen bij Oefenen

Grammatica en zinsbouw, Taal in gesprekken en Snelvragen blijven boven de voorbereiding bereikbaar, ook als een grammaticale categorie openstaat. Het kiezen van een ingang opent de onderwerpen; een bestaande les wordt pas vervangen wanneer de docent inhoud kiest. De zoekfunctie blijft over alle inhoud zoeken. De grammaticale categorie-/onderwerproute, vorige indelingsvoorkeuren, opgeslagen lessen en archiefcontrole blijven ondersteund.

## Aanbevolen startmixen

De voorgestelde onderwerpen worden expliciet per route gekozen; een ontbrekend onderwerp wordt niet willekeurig vervangen. De runtime bepaalt beschikbaarheid, geschiktheid voor spelvormen en lesduur. Alleen FREE-opdrachten doen mee. De bestaande gelijkmatige verdeling over onderwerpen voorkomt dat een grote bron de mix overheerst. Elke gekozen bron krijgt ten minste één opdracht, zonder dubbele IDs.

| Route | Doel | Onderwerpen |
|---|---|---|
| A0 → A1 | Korte zinnen en eerste reacties | Een korte zin maken; Vertel; Stel een vraag |
| A1 → A2 | Vertellen en vragen stellen | Vraagwoorden; Vertel; Stel een vraag |
| A2 → B1 | Redenen geven en iets regelen | Reden geven; Kies; Regel iets; Gesprek repareren |
| B1 → B2 | Je mening uitleggen en reageren | Zouden; Kies; Regel iets; Overtuigen en onderhandelen |
| B2 → C1 | Precies formuleren en afwegen | Kies; Regel iets; Zinnen anders zeggen |

Alpha A–C krijgt geen automatische vervangende route: er staat dat nog geen passende startmix beschikbaar is. De kaart toont circa tien minuten, een indicatief aantal opdrachten, de onderwerpen en variatie in oefensoorten. De bestaande selector kiest de concrete opdrachten met behoud van recente geschiedenis; opnieuw kiezen is geen vastgezette herhaling van dezelfde voorbeeldset. Na kiezen blijven tijd, geschikte spelvormen en de bestaande mixeditor beschikbaar. Een startmix is een redactioneel lesvoorstel, geen claim over feitelijk gebruik of een uitgevoerde klasproef.

## Controle en publicatie

`npm run test:content-overview:browser` controleert volledige ID-dekking, ontdubbeling, alle onderwerp-/route-/constructieselecties, oefensoorttotalen, gerichte keuzes, alle voorbeelden via paginering, aantallen voor eigen spelmaterialen, vijf mixen met meerdere seeds, vaste ingangen, echte lesvoorbereiding en exacte sessiereferenties na herladen. Desktop en mobiel worden op 1440, 768, 390 en 320 px gecontroleerd. Het nieuwe script draait in de volledige DigiBord-CI op de gebouwde website, naast de bestaande grammatica-, kaart-, WZ-, P0- en overige spelcontroles. Alleen dist wordt gepubliceerd na de groene regressiepoort.
