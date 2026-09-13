# Taalreview van de opdrachtenmatrix

Uitgevoerd op 13 september 2026. De herziening is verwerkt in de app en het Excel-overzicht.

## Bereik en resultaat

De review omvat alle 960 kaarten op de vier routes A0 → A1, A1 → A1+, A1 → A2 en A2 → B1: opdracht, situatie, hulp, mogelijk antwoord, grammatica, extra stap, gesprekspartner en docentaanwijzing. De 96 patrooncombinaties (zes onderwerpen × vier vormen × vier routes) en alle zestig inhoudelijke invullingen zijn op samenhang gecontroleerd. Waar een invulling een andere aanpak vraagt, heeft die een eigen tekst gekregen.

Bij 839 kaarten is de opdrachttekst aangepast; bij 684 kaarten het voorbeeld; bij 712 kaarten de hulp. Dit zijn aantallen aangepaste velden, geen aantallen spelfouten. Alle 960 kaarten kregen verduidelijkte docent- en partneraanwijzingen. Aantallen, vaste opdracht-ID’s, routes en vormen zijn behouden.

Het zinnenspel is afzonderlijk gecontroleerd: 24 werkwoorden × zes personen × drie tijden = 432 combinaties. De werkwoordvormen hoefden niet te worden gewijzigd. Alle combinaties komen overeen met een afzonderlijk vastgelegde controletabel.

## Wat is inhoudelijk verbeterd?

| Gevonden probleem | Herstel |
|---|---|
| ‘Je getal staat fout’ zegt niet welk gegeven verkeerd is. | Het formulier noemt nu het veld, de foutieve waarde en de juiste waarde. De cursist geeft de correctie in een zin. |
| ‘Kies een verzonnen land’ bij bestaande landen. | De cursist speelt iemand anders en kiest uit twee bestaande landen. |
| Een vervolgvraag neemt aan dat iemand verhuisd is of iets veranderd heeft. | De vraag laat ruimte voor het werkelijke antwoord; noodzakelijke omstandigheden staan vooraf in de situatie. |
| ‘Wil je samen water drinken?’ als afspraak over verschillende dagen. | Een concreet aanbod: ‘Wil je ook water?’ Op hogere routes is er een passend probleem met glazen of beschikbaar water. |
| Een duurdere kilo appels zou ineens ‘groter’ zijn. | De hoeveelheden zijn expliciet gelijk. De opdracht vergelijkt prijzen; de hoogste route weegt prijs tegen smaak af. |
| Iemand zonder contant geld vraagt om contant te betalen. | De cursist legt het probleem uit en vraagt de boodschappen even te bewaren terwijl die een andere pas haalt. |
| Tien minuten vertraging zonder oorspronkelijke afspraaktijd. | De situatie geeft 14.00 uur; het voorstel is tien over twee. |
| ‘Eerst mijn keuze, daarna jouw keuze’ bij twee persoonlijke drankjes. | Persoonlijke keuzes mogen naast elkaar bestaan. Alleen gedeelde omstandigheden, zoals het raam, vragen een gezamenlijke oplossing. |
| ‘Het’ verwees onduidelijk naar bijvoorbeeld de tas of de pen. | Het voorbeeld gebruikt een passend verwijswoord of herhaalt het zelfstandig naamwoord. |
| ‘Tot morgen’ terwijl de volgende les onbekend is. | ‘Tot ziens.’ Een concrete volgende les wordt alleen genoemd wanneer dag en tijd gegeven zijn. |
| Losse, niet aansluitende hulp zoals ‘… jij vaak …?’ | Een passend begin zoals ‘Eet jij …?’ of ‘Mag ik … lenen?’ |
| Een grammaticadoel paste niet bij de voorbeeldzin. | Het doel beschrijft de daadwerkelijk geoefende constructie; een vaste vraag met ‘mag’ wordt niet automatisch als infinitiefconstructie benoemd. |

## Niveaubeoordeling

| Route | Verwachte taalproductie | Voorbeeld van de opbouw |
|---|---|---|
| A0 → A1 | Eén korte taalhandeling met bekende woorden of een vaste zin. Voorlezen en voordoen mogen. | ‘Wil je ook water?’ |
| A1 → A1+ | Korte zinnen met één extra gegeven of een eenvoudige vervolgvraag. | ‘Wil je ook water? Wil je koud water?’ |
| A1 → A2 | Een eenvoudig probleem uitleggen en een passend alternatief voorstellen; ook oefenen met eerder en nu. | ‘Wil je water in een beker? De glazen zijn niet schoon.’ |
| A2 → B1 | Een hindernis uitleggen, opties afwegen, doorvragen of een oplossing onderbouwen. | ‘Het koude water is op. Wil je water op kamertemperatuur of liever thee?’ |

De route beschrijft een leertraject. Niet iedere taak binnen A0 → A1 is zonder voorbereiding geschikt voor iemand die nog geen Nederlands kent. De instructies van deze route zijn maximaal veertien woorden; de benodigde informatie staat apart. Een correcte korte reactie mag voldoende zijn. De cursist hoeft niet alle woorden van een modelantwoord precies over te nemen.

Bij de beoordeling zijn de algemene ERK-beschrijvingen voor eenvoudige persoonlijke informatie, routine-uitwisselingen en samenhangende uitleg gebruikt. De vier routes en hun grammaticale volgorde zijn eigen didactische keuzes. A1+ is hier een tussenstap. Zie de [descriptoren van de Raad van Europa](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search) en het [ERK-overzicht van Europass](https://europass.europa.eu/en/common-european-framework-reference-language-skills). Het ERK is geen verplichte woordenlijst of vaste grammaticalijst voor deze app.

## Zinnenspel

De controle omvat persoonsvorm, onderwerp, enkelvoud en meervoud, onregelmatige verleden tijd, voltooid deelwoord, hulpwerkwoord en scheidbare delen. Voorbeelden:

- Jij wacht op de bus.
- Ik at een appel.
- Wij staan om zeven uur op.
- Jullie namen een tas mee.
- Zij zijn naar de winkel gelopen.
- Zij is naar de les gekomen.
- Ik ben naar school gefietst.

‘Hij/zij’ gebruikt in het model ‘zij’; ‘hij’ met dezelfde enkelvoudsvorm is ook goed. Bij de richtingszinnen met lopen en fietsen hoort hier ‘zijn’. De andere betekenis, bijvoorbeeld een uur fietsen zonder bestemming, vraagt een eigen zin en is geen onderdeel van deze combinatie.

## Controle en onderhoud

De inhoudelijke review is redactioneel uitgevoerd. Automatische controles bewaken daarnaast de concrete herstelde fouten: formulierinformatie, prijsvergelijkingen, afspraaktijden, persoonlijke keuzes, verwijswoorden, afscheid en korte beginnersinstructies. Alle 432 zinscombinaties worden tegen de gecontroleerde werkwoordtabel getest. Deze controles staan in `tests/language-review.cjs`, dat via de bestaande matrixcontrole meedraait.

De browsercontrole bewaakt selectie van de vier routes, hulp en voorbeelden, bewaren en terugzetten, de elf kaarten en de bestaande werkvormen. Het Excel-overzicht behoudt de zes bladen, vaste ID’s, filters, notitiekolom en tellingen van 240 opdrachten per route.

De review geeft geen officiële niveaucertificering of garantie dat iedere cursist elke opdracht meteen begrijpt. Beoordeel in de les of de groep de gebruikte woorden en constructies al kent. Bewaar concrete verbeterpunten bij de opdracht-ID; daarmee kan een onduidelijke kaart gericht worden verbeterd zonder de opgebouwde voortgang te veranderen.
