// First 120 existing Vertel tasks. No new tasks or missing model answers are generated.
(function(root){
 'use strict';
 const version='2026-09-24.snelvragen.vertel.1';
 // ID suffix | level | shared theme | individual goal | optional speaking support | teacher check.
 const rows=`
0-005|A1|vrije-tijd|Iets noemen dat je leuk vindt.|Ik vind … leuk.|Eén voorkeur is genoeg; vraag geen reden.
0-009|A1|pauze|Eén activiteit in de pauze noemen.|In de pauze …|Een gewone pauzeactiviteit past; er hoeft nu geen pauze te zijn.
0-010|A1|spullen|Eén kenmerk van een schrift noemen.|Mijn schrift is …|Een kleur, maat of ander kenmerk past. Het mag een bedacht schrift zijn.
0-011|A1|thuis|Eén ruimte in een woning noemen.|De … / Het …|Een kamer of keuken noemen is voldoende; een volledige zin hoeft niet.
0-012|A1|kleding|De plek van een jas noemen.|Mijn jas is …|Liggen, hangen en zijn mogen alle drie, als de plek duidelijk is.
0-013|A1|koken|Eén voorwerp of product in een keuken noemen.|In de keuken is …|Een voorwerp, meubel of product past; wijs niet alleen één soort antwoord goed.
0-014|A1|zitten|Een plek noemen waar je graag zit.|Ik zit graag …|Eén plek is genoeg; een stoel, kamer of plaats buiten kan passen.
0-015|A1|thuis|Eén activiteit thuis noemen.|Thuis …|Eén herkenbare activiteit is genoeg, zonder vaste dagindeling.
0-017|A1|eten|Eten bij het ontbijt noemen.|Ik eet … / Ik ontbijt niet.|Niet ontbijten is ook een volledig antwoord.
0-018|A1|eten|Eén groente noemen.|Een … / …|Eén woord is genoeg. Het gaat om de naam van een groente.
0-019|A1|eten|Eten tussen de middag noemen.|Ik eet … / Ik eet dan niet.|Niet eten op dat moment is ook passend; vraag geen persoonlijke reden.
0-020|A1|koken|Eten noemen dat je kunt koken.|Je kunt … koken.|Eén product of gerecht is genoeg. Je hoeft het niet zelf te kunnen maken.
0-022|A1|drinken|Eén warm drankje noemen.|Een … / …|Een soort warme drank volstaat; een merk is niet nodig.
0-023|A1|drinken|Een drankje voor de ochtend noemen.|Ik drink …|Een drankje of niets noemen past; er is geen verplicht gezond antwoord.
0-024|A1|drinken|Zeggen of je koffie lekker vindt.|Ja. / Nee. / Ik drink geen koffie.|Een korte reactie is genoeg; proeven of een reden geven hoeft niet.
0-025|A1|eten|Eten bij thee noemen.|Bij thee eet ik … / Niets.|Niets eten of geen thee drinken is ook een passend antwoord.
0-026|A1|winkelen|Eén product van een boodschappenlijst noemen.|Ik wil … kopen.|Het product noemen is genoeg; een echt lijstje hoeft niet aanwezig te zijn.
0-027|A1|winkelen|Een plek noemen waar je brood koopt.|Ik koop brood …|Een soort winkel of andere koopplek past; geen adres nodig. Geen brood kopen mag ook.
0-028|A1|eten|Eén product in een koelkast noemen.|In de koelkast ligt of staat …|Een bedacht product past; de inhoud van de eigen koelkast hoeft niet bekend te zijn.
0-029|A1|winkelen|Een moment voor boodschappen noemen.|Ik doe boodschappen …|Een dag, tijdstip of hoe vaak is voldoende; een reden is niet nodig.
0-030|A1|winkelen|Eén product noemen dat je op een markt kunt kopen.|Op de markt koop je …|Een denkbeeldige aankoop past; marktbezoek of eigen koopervaring is niet nodig.
0-032|A1|kleding|Iets noemen dat je aan je voeten draagt.|Ik draag …|Eén soort kleding of schoeisel past; beoordeel geen merk of smaak.
0-033|A1|kleding|Kleding voor koud weer noemen.|Als het koud is, draag ik …|Eén kledingstuk is voldoende; ook andere passende kleding dan het eerste idee telt.
0-034|A1|kleding|Eén kledingstuk voor de zomer noemen.|In de zomer draag ik …|Eén kledingstuk volstaat; verschillende gewoonten en weersomstandigheden mogen.
0-035|A1|kleding|Een plek noemen waar je je jas ophangt.|Ik hang mijn jas …|Een concrete plek volstaat. Wie de jas neerlegt, mag dat zeggen.
0-036|A1|vervoer|Zeggen hoe je naar de les komt.|Ik kom …|Het vervoermiddel of lopen noemen is genoeg; beoordeel geen reisroute.
0-037|A1|vervoer|Eén vervoermiddel noemen.|Een … / …|Eén woord is genoeg. Leg vervoermiddel zo nodig samen uit.
0-038|A1|vervoer|Een plek noemen waar je vaak heen gaat.|Ik ga vaak naar …|Eén plek is genoeg. Je hoeft niet te zeggen hoe vaak je er komt.
0-039|A1|buiten|Zeggen of je graag loopt.|Ja. / Nee. / Soms.|Alle drie passen; een reden of persoonlijke uitleg is niet nodig.
0-040|A1|buurt|Eén ding op straat noemen.|Op straat zie ik …|Eén ding op straat is genoeg. Je mag een straat bedenken.
0-041|A1|dag|Een tijd noemen waarop je opstaat.|Ik sta om … op.|Een tijd of tijdvak is genoeg. Een wisselende tijd mag ook; geen vaste routine verplicht.
0-042|A1|tijd|Eén dag van de week noemen.|…|Eén dag is genoeg, zonder de hele week op te zeggen.
0-043|A1|dag|Eén activiteit in de avond noemen.|In de avond …|Eén activiteit is voldoende; geen verhaal over de hele avond nodig.
0-044|A1|tijd|Eén maand noemen.|…|De naam van één maand volstaat; geen datum of seizoen vereist.
0-045|A1|dag|Een slaaptijd noemen.|Ik ga om … slapen.|Een tijdstip of deel van de dag past. Verschillende slaaptijden mogen.
0-046|A1|weer|Het weer kort beschrijven.|Het …|Eén kenmerk van het weer is genoeg. Spreek samen af over welke plek je praat.
0-047|A1|kleding|Kleding voor regen noemen.|In de regen draag ik …|Kleding noemen past. Een paraplu noemen is begrijpelijk; help dan met gebruiken of meenemen.
0-048|A1|buiten|Een activiteit bij mooi weer noemen.|Bij mooi weer …|Eén activiteit is genoeg. Binnen of buiten kan allebei.
0-049|A1|weer|Een prettig seizoen noemen.|Ik vind … fijn.|Eén seizoen of geen voorkeur is voldoende; geen reden vereist.
0-050|A1|weer|Iets noemen dat je in de winter gebruikt.|In de winter gebruik ik …|Een passend voorwerp of kledingstuk is genoeg; sneeuw is niet noodzakelijk.
0-051|A1|werk|Eén beroep noemen.|Een … / …|De naam van een beroep volstaat; eigen werkervaring is niet nodig.
0-052|A1|werk|Eén product van een bakker noemen.|Een bakker maakt …|Eén bekend bakkerijproduct is genoeg; geen uitleg over het maken vereist.
0-053|A1|werk|Eén ding op een werktafel noemen.|Op een werktafel ligt of staat …|Eén ding op een werktafel is genoeg. Je mag de tafel bedenken.
0-054|A1|werk|Werk noemen dat je graag zou doen.|Ik wil graag …|Een beroep of taak noemen is genoeg; geen sollicitatie of onderbouwing vragen.
0-055|A1|winkelen|Eén activiteit in een winkel noemen.|In een winkel kun je …|Eén activiteit is genoeg. Je mag klant of medewerker zijn.
0-056|A1|vrije-tijd|Eén activiteit in je vrije tijd noemen.|Ik …|Eén activiteit volstaat; het bestaande voorbeeld is geen verplichte hobby.
0-057|A1|muziek|Muziek noemen die je leuk vindt.|Ik luister graag naar …|Een soort muziek, lied of artiest is passend. Geen muziek luisteren mag ook.
0-058|A1|sport|Eén sport noemen.|…|Een sportnaam is genoeg; zelf sporten is niet nodig.
0-059|A1|dag|Eén activiteit op zondag noemen.|Op zondag …|Eén activiteit is genoeg. Werken of rusten mag ook.
0-060|A1|vrije-tijd|Zeggen of je graag danst.|Ja. / Nee. / Soms.|Een korte reactie volstaat; geen uitleg of demonstratie vragen.
0-062|A1|buurt|Eén ding op een plein noemen.|Op het plein zie ik …|Eén ding op het plein is genoeg. Je mag zelf een plein bedenken.
0-063|A1|winkelen|Een winkel in de buurt noemen.|In mijn buurt is …|Een winkelsoort of naam is genoeg. Geen winkel in de buurt is ook een geldig antwoord.
0-064|A1|buurt|Zeggen of het in je buurt rustig is.|Het is … / Soms is het …|Een korte beschrijving past; rustig hoeft niet altijd of overal waar te zijn.
0-066|A1|contact|Zeggen bij wie je graag op bezoek gaat.|Ik bezoek graag …|Eén persoon noemen is genoeg. Niemand of een bedacht persoon mag ook.
0-067|A1|bezoek|Iets noemen dat je aan bezoek geeft.|Ik geef …|Drinken, eten of een ander passend aanbod telt; geven is niet verplicht.
0-068|A1|bezoek|Een activiteit met bezoek noemen.|Samen …|Eén activiteit volstaat; een bedacht bezoek is toegestaan.
0-069|A1|bezoek|Iets voor bij de koffie noemen.|Bij de koffie …|Eten, drinken of iets anders voor op tafel mag. Eén ding is genoeg.
0-070|A1|contact|Vertellen bij wie je op bezoek bent.|Ik ben bij …|Eén persoon is genoeg; het bezoek mag bedacht zijn en hoeft niet nu plaats te vinden.
0-071|A1|telefoon|Eén gebruik van een telefoon noemen.|Ik … met mijn telefoon.|Eén handeling is voldoende; iemand zonder telefoon mag een gebruik bedenken.
0-072|A1|telefoon|Iets op het scherm van een telefoon noemen.|Op het scherm zie ik …|Een afbeelding, woord, cijfer of knop telt; een echte telefoon hoeft niet zichtbaar te zijn.
0-074|A1|contact|Zeggen wie je graag belt.|Ik bel graag …|Eén persoon volstaat. Niemand bellen of een bedacht antwoord mag ook.
0-075|A1|telefoon|Iets noemen dat je online bekijkt.|Online kijk ik naar …|Eén ding is genoeg. Gebruik je geen internet? Dan mag je dat zeggen.
0-076|A1|lezen|Eén ding in een bibliotheek noemen.|Een … / Het …|Een boek of ander passend voorwerp telt; geen bibliotheekbezoek nodig.
0-077|A1|lezen|Een boek noemen dat je wilt lezen.|Ik wil een boek over … lezen.|Een onderwerp of titel is genoeg. Geen boek willen lezen mag ook.
0-078|A1|lezen|Een plek noemen waar je graag leest.|Ik lees graag …|Eén plek is voldoende; niet graag lezen is ook een antwoord.
0-079|A1|kleur|Een kleur van een boek noemen.|Het boek is …|Een echte of bedachte boekomslag mag; één kleur volstaat.
0-080|A1|lezen|Zeggen of je graag naar verhalen luistert.|Ja. / Nee. / Soms.|Een korte reactie volstaat; zelf lezen is niet nodig.
0-081|A1|gevoel|Kort vertellen hoe je je voelt.|Ik voel me …|Eén woord of korte zin is genoeg. Je hoeft niet te vertellen waarom.
0-082|A1|lichaam|Eén deel van het lichaam noemen.|Een … / …|Eén woord is genoeg. Je hoeft niets aan te wijzen of uit te leggen.
0-083|A1|rust|Eén activiteit noemen om uit te rusten.|Ik … om uit te rusten.|Eén activiteit is genoeg. Vertel wat voor jou helpt.
0-084|A1|pauze|Een moment noemen voor een pauze.|Ik neem pauze …|Een tijdstip of moment past; geen vaste pauzetijd verplicht.
0-085|A1|rust|Iets prettigs na een drukke dag noemen.|Na een drukke dag …|Een activiteit of gewenste rust is voldoende; geen hele dag beschrijven.
0-086|A1|post|Iets noemen dat je met de post krijgt.|Ik krijg …|Eén soort post volstaat. Geen post krijgen mag ook.
0-087|A1|contact|Een ontvanger voor een kaart noemen.|Ik wil een kaart sturen aan …|Eén persoon is voldoende; een echt adres of een verzendplan is niet nodig.
0-088|A1|post|Eén ding op een envelop noemen.|Op een envelop staat of zit …|Tekst of iets op de envelop past; geen gegevens van een echte persoon nodig.
0-089|A1|post|Een plek voor post noemen.|Ik leg mijn post …|Eén plek is genoeg; de plek mag bedacht zijn.
0-090|A1|post|Een korte tekst voor een kaart noemen.|Op de kaart schrijf ik …|Een groet of andere korte passende boodschap volstaat; geen hele brief vragen.
0-091|A1|geld|Eén aankoop of betaalde dienst noemen.|Ik betaal voor …|Eén product of dienst is voldoende; persoonlijke bedragen zijn niet nodig.
0-092|A1|geld|Een mogelijke aankoop voor één euro noemen.|Voor één euro koop ik …|Een aankoop van ongeveer één euro past. Je hoeft de prijs niet precies te weten.
0-093|A1|geld|Iets noemen waarvoor je niet betaalt.|… is gratis.|Eén ding is genoeg. Leg zo nodig samen uit wat gratis betekent.
0-094|A1|spullen|Een plek voor een portemonnee noemen.|Mijn portemonnee is …|Eén plek is genoeg. Je mag een plek bedenken.
0-095|A1|geld|Iets noemen dat je goedkoop vindt.|Ik vind … goedkoop.|Een product of dienst is genoeg; goedkoop is een persoonlijke mening, geen vaste prijsgrens.
0-096|A1|schoonmaken|Eén schoonmaakmiddel of hulpmiddel noemen.|Een … / …|Een middel of voorwerp noemen is genoeg. Je hoeft niet uit te leggen hoe het werkt.
0-097|A1|schoonmaken|Iets noemen dat je na het eten opruimt.|Ik ruim … op.|Eén ding is genoeg. Je hoeft niet te vertellen wie thuis opruimt.
0-098|A1|schoonmaken|Eén ding noemen dat je wast.|Ik was …|Kleding, vaat of een ander passend antwoord telt; een los woord is voldoende.
0-099|A1|schoonmaken|Een plek voor lege flessen noemen.|Ik zet de lege flessen …|Een plek noemen of zeggen dat je de flessen wegbrengt, kan allebei.
0-100|A1|schoonmaken|Zeggen wat je met vuile kleding doet.|Ik …|Eén handeling volstaat; niet iedere cursist wast zelf.
0-101|A1|dieren|Eén dier noemen.|Een … / …|De naam van één dier is genoeg. Je hoeft het niet te beschrijven.
0-102|A1|natuur|Bloemen noemen die je mooi vindt.|Ik vind … bloemen mooi.|Een kleur of bloemnaam past. Geen bloemen mooi vinden mag ook.
0-103|A1|natuur|Iets noemen dat in een tuin groeit.|In een tuin groeit …|Eén plant, boom of ander passend antwoord volstaat; een eigen tuin is niet nodig.
0-104|A1|dieren|Een plek noemen waar je vogels ziet.|Ik zie vogels …|Eén plek is genoeg; een bedachte plek mag ook.
0-105|A1|kleur|Een kleur buiten noemen.|Buiten zie ik …|Eén kleur is voldoende; buiten kijken is niet verplicht.
0-106|A1|eten|Eten op een feest noemen.|Ik eet …|Eén gerecht of product volstaat; geen vast soort feest of eten opleggen.
0-107|A1|muziek|Muziek voor een feest noemen.|Op een feest wil ik …|Een soort muziek, lied of artiest past. Liever geen muziek mag ook.
0-108|A1|cadeau|Eén mogelijk cadeau noemen.|Ik geef …|Een eenvoudig cadeau is voldoende; geld uitgeven is geen vereiste.
0-109|A1|feest|Iets zeggen tegen iemand die jarig is.|Je kunt zeggen: …|Een korte wens past. Je mag zeggen wat je zelf gewend bent.
0-110|A1|feest|Eén versiering voor een kamer noemen.|Ik versier de kamer met …|Eén voorwerp is voldoende; niet zelf versieren is geen bezwaar.
0-111|A1|reizen|Een gewenste bestemming noemen.|Ik wil naar …|Eén plek is genoeg; een echte reis plannen hoeft niet.
0-112|A1|reizen|Eén ding voor in een koffer noemen.|In mijn koffer doe ik …|Eén voorwerp is voldoende; een echte koffer of reiservaring is niet nodig.
0-113|A1|reizen|Zeggen met wie je wilt reizen.|Ik wil reizen met … / Alleen.|Alleen reizen is ook een volledig antwoord; een echt reisplan is niet nodig.
0-114|A1|reizen|Eén vakantieactiviteit noemen.|Op vakantie …|Eén activiteit is genoeg; een bedachte vakantie is toegestaan.
0-115|A1|vrije-tijd|Iets noemen dat je graag fotografeert.|Ik maak graag foto's van …|Eén ding is genoeg. Maak je geen foto's? Dan mag je dat zeggen.
0-116|A1|spullen|Een tas met één kenmerk beschrijven.|Mijn tas is …|Eén kenmerk is genoeg. Groot is het voorbeeld; een ander passend woord mag ook.
0-117|A1|spullen|Een klein voorwerp voor in een broekzak noemen.|Een … / …|Een passend klein voorwerp volstaat; eigen broekzakken zijn niet nodig.
0-119|A1|spullen|Eén zacht voorwerp of materiaal noemen.|… is zacht.|Eén passend woord is genoeg; de cursist hoeft niets aan te raken.
0-120|A1|spullen|Een plek voor een bril noemen.|Mijn bril is …|Eén plek volstaat; ook zonder bril mag de cursist een plek bedenken.
0-121|A1|dag|Eén handeling na het opstaan noemen.|Na het opstaan …|Eén handeling is genoeg; geen hele ochtendroutine vereist.
0-122|A1|spullen|Eén dagelijks gebruikt voorwerp noemen.|Ik gebruik elke dag …|Eén voorwerp is voldoende; een bedacht antwoord mag ook.
0-124|A1|dag|Eén activiteit voor het slapen noemen.|Voor het slapen …|Eén activiteit is genoeg. Vertel wat je zelf doet.
0-125|A1|dag|Eén plan voor deze week noemen.|Deze week wil ik …|Eén activiteit is genoeg; een wens mag ook zonder vast plan.
1-001|A1|kennismaken|Je naam en één hobby noemen.|Ik ben … en ik … graag.|Twee eenvoudige gegevens zijn voldoende; een verzonnen naam mag en geen hobby hebben mag ook.
1-002|A1|talen|Een taal en een gesprekspartner thuis noemen.|Thuis spreek ik … met …|Twee korte gegevens volstaan. Wie alleen woont, mag dat zeggen of de situatie bedenken.
1-003|A1|contact|Eén kenmerk van een vriend en één gezamenlijke activiteit noemen.|Mijn vriend is … Samen …|Twee korte zinnen volstaan; geen uitgebreid portret. Een bedacht persoon mag.
1-004|A1|kennismaken|Een plek noemen om nieuwe mensen te ontmoeten.|Ik ontmoet graag mensen …|Eén plek is genoeg; geen verhaal over een ontmoeting vragen. Geen behoefte eraan mag ook.
1-005|A1|wonen|Twee prettige dingen in je woonplaats noemen.|Ik vind … en … fijn.|Twee woorden of korte zinnen zijn genoeg. Je hoeft niet uit te leggen waarom.
1-006|A2|les|Een prettig lesonderdeel noemen en één reden geven.|Ik vind … fijn, want …|Beoordeel het onderdeel én een begrijpelijke reden. Het voorbeeld met spreken is niet verplicht.
1-007|A1|spullen|Spullen voor de les op tafel noemen.|Ik leg … op tafel.|Een korte opsomming is genoeg; de spullen hoeven niet nu aanwezig te zijn.
1-008|A1|les|Iets noemen dat je in de les al goed kunt.|Ik kan al goed …|Eén activiteit is genoeg. Je mag ook zeggen dat je het nog niet weet.
1-009|A1|les|Een tijd en plek voor huiswerk noemen.|Ik maak huiswerk …|Twee korte gegevens zijn genoeg. Geen huiswerk maken mag ook zonder verdere uitleg.
1-010|A1|les|Eén handeling met je aantekeningen na de les noemen.|Na de les …|Eén handeling is genoeg. Maak je geen aantekeningen? Dan mag je dat zeggen.
`.trim();
 const edits={
  '0-005':{prompt:'Wat vind je leuk? Noem één ding.',finding:'De brede voorkeur blijft open; één ding maakt de omvang duidelijk.'},
  '0-010':{prompt:'Noem de kleur of de grootte van je schrift.',finding:'Zeg iets gaf geen houvast. Kleur of grootte geeft één concrete beschrijfkeuze.'},
  '0-012':{prompt:'Waar is je jas?',finding:'Ligt veronderstelde een liggende jas; is laat ook een hangende jas toe.'},
  '0-014':{prompt:'Waar zit je graag?',finding:'Indirecte vraag vervangen door een korte rechtstreekse vraag.'},
  '0-020':{prompt:'Wat kun je koken? Noem één ding.',finding:'De opdracht vraagt één product of gerecht, geen uitleg over koken.'},
  '0-025':{prompt:'Wat eet je bij thee? Niets mag ook.',finding:'De vraag veronderstelt niet meer dat iedereen iets bij thee eet.'},
  '0-026':{context:'Je maakt een boodschappenlijst.',finding:'Er hoeft geen echt lijstje te liggen; de bestaande koopopdracht wordt als situatie aangeboden.'},
  '0-028':{prompt:'Wat kan er in een koelkast liggen of staan? Noem één ding.',finding:'Uit de koelkast kon betekenen dat er een zichtbare koelkast nodig was. De vraag kan nu zonder afbeelding.'},
  '0-030':{prompt:'Wat kun je op een markt kopen? Noem één ding.',finding:'Eigen ervaring met de markt is niet langer vereist.'},
  '0-032':{prompt:'Wat draag je aan je voeten? Noem één ding.',finding:'Dezelfde woordenschatvraag, met een directe vraagzin.'},
  '0-034':{prompt:'Wat draag je in de zomer? Noem één ding.',finding:'Dezelfde kledingvraag, zonder lange instructie.'},
  '0-037':{prompt:'Noem een vervoermiddel.',finding:'Vervoermiddel is de bekende categorie bij hoe je reist; de docent kan het begrip zo nodig toelichten.'},
  '0-040':{prompt:'Denk aan een straat. Noem één ding op die straat.',finding:'Een denkbeeldige straat is expliciet toegestaan; geen ontbrekend beeld nodig.'},
  '0-043':{prompt:'Wat doe je in de avond?',finding:'In de avond is eenvoudiger leesbaar dan een instructie met een indirecte vraag en apostrof.'},
  '0-048':{prompt:'Wat doe je bij mooi weer? Noem één ding.',finding:'Een korte directe vraag houdt dezelfde betekenis.'},
  '0-053':{prompt:'Wat kan er op een werktafel liggen of staan? Noem één ding.',finding:'De opdracht is uitvoerbaar zonder werktafel in beeld.'},
  '0-054':{prompt:'Welk werk lijkt je leuk?',finding:'Dezelfde voorkeur met een korte directe vraag; geen ervaring verondersteld.'},
  '0-055':{prompt:'Wat kun je in een winkel doen? Noem één ding.',finding:'Direct gevraagd; klant en medewerker blijven allebei mogelijk.'},
  '0-056':{prompt:'Wat doe je in je vrije tijd? Noem één ding.',finding:'Dezelfde activiteit gevraagd in een korte directe vraag.'},
  '0-062':{context:'Denk aan een plein.',prompt:'Noem één ding op dat plein.',finding:'Het plein was niet aangewezen. De denkbeeldige situatie maakt de kaart zelfstandig bruikbaar.'},
  '0-064':{prompt:'Is het rustig in jouw buurt?',finding:'Directe vraag in plaats van een indirecte instructie.'},
  '0-067':{context:'Er komt iemand bij je op bezoek.',prompt:'Wat geef je aan het bezoek? Noem één ding.',finding:'Bezoek wordt als persoon in een concrete situatie geïntroduceerd.'},
  '0-069':{prompt:'Noem iets voor op tafel bij de koffie.',finding:'Koffietafel kan ook een bijzondere maaltijd betekenen; de bedoelde situatie is nu duidelijk.'},
  '0-070':{context:'Denk aan een bezoek.',prompt:'Bij wie ben je op bezoek?',finding:'Er is geen bezoek gaande op het bord; de cursist mag de situatie nu bedenken.'},
  '0-072':{prompt:'Denk aan het scherm van een telefoon. Noem één ding op het scherm.',finding:'Op je telefoon kon een voorwerp op het toestel betekenen. Het scherm is nu expliciet.'},
  '0-075':{prompt:'Wat bekijk je op internet? Noem één ding.',finding:'Directe vraag; de docent hoeft geen ontbrekende webpagina te tonen.'},
  '0-076':{prompt:'Wat kun je in een bibliotheek vinden? Noem één ding.',finding:'Geen zichtbare bibliotheek of eigen bezoek nodig; het voorbeeld blijft passend.'},
  '0-077':{prompt:'Welk boek wil je lezen? Noem een titel of een onderwerp.',finding:'Welk boek kon verwijzen naar ontbrekende boeken. Een titel kennen is nu niet verplicht.'},
  '0-079':{prompt:'Denk aan een boek. Welke kleur heeft de buitenkant?',finding:'Kleur van een boek is verduidelijkt als buitenkant, zonder een afbeelding te vereisen.'},
  '0-081':{title:'Hoe voel je je?',finding:'Het label Welbevinden is vervangen door gewone woorden.'},
  '0-082':{title:'Hoe voel je je?',prompt:'Noem één deel van je lichaam.',finding:'Het samengetrokken lichaamsdeel en het label Welbevinden zijn eenvoudiger verwoord.'},
  '0-083':{title:'Hoe voel je je?',finding:'Alleen het moeilijke label Welbevinden vervangen; de vraag zelf is bruikbaar.'},
  '0-084':{title:'Hoe voel je je?',finding:'Alleen het moeilijke label Welbevinden vervangen; het gevraagde moment is duidelijk.'},
  '0-085':{title:'Hoe voel je je?',finding:'Alleen het moeilijke label Welbevinden vervangen; één voorkeur is voldoende.'},
  '0-088':{prompt:'Wat staat of zit er op een envelop? Noem één ding.',finding:'Tekst en bijvoorbeeld een postzegel passen allebei; geen lege envelop in beeld nodig.'},
  '0-090':{prompt:'Denk aan een kaart voor iemand. Wat schrijf je erop?',finding:'Een berichtkaart is nu onderscheiden van een speelkaart of plattegrond.'},
  '0-093':{prompt:'Noem iets waarvoor je niet hoeft te betalen.',finding:'Gratis wordt in gewone woorden uitgelegd; één voorbeeld is genoeg.'},
  '0-102':{prompt:'Welke bloemen vind je mooi? Een kleur noemen mag ook.',finding:'De vraag toetst een voorkeur, niet het kennen van bloemnamen.'},
  '0-103':{prompt:'Wat groeit er in een tuin? Noem één ding.',finding:'Dezelfde woordenschatvraag zonder betrekkelijke bijzin in de instructie.'},
  '0-105':{prompt:'Noem één kleur die je buiten kunt zien.',finding:'Buiten kijken is geen vereiste; een mogelijke kleur is genoeg.'},
  '0-106':{prompt:'Wat eet je op een feest? Noem één ding.',finding:'Dezelfde korte feestvraag in directe vorm.'},
  '0-108':{prompt:'Wat kun je cadeau geven? Noem één ding.',finding:'Dezelfde woordenschatvraag, met directe formulering.'},
  '0-109':{context:'Iemand is jarig.',prompt:'Wat zeg je tegen die persoon?',finding:'Op een verjaardag zeggen was erg breed. De ontvanger en bedoeling zijn nu duidelijk.'},
  '0-110':{prompt:'Waarmee kun je een kamer versieren? Noem één ding.',finding:'Een directe vraag geeft dezelfde opdracht met minder omwegen.'},
  '0-112':{prompt:'Wat doe je in een koffer? Noem één ding.',finding:'Dezelfde bagagevraag in directe vorm; bezit van een koffer is niet nodig.'},
  '0-114':{prompt:'Wat doe je op vakantie? Noem één ding.',finding:'Dezelfde activiteit gevraagd, zonder een lange instructie.'},
  '0-115':{prompt:"Waar maak je graag foto's van?",finding:'Fotograferen vervangen door de bekende woorden foto’s maken.'},
  '0-117':{prompt:'Wat past er in een broekzak? Noem één ding.',finding:'Dezelfde vraag naar een klein voorwerp, in directe vorm.'},
  '0-119':{prompt:'Wat voelt zacht? Noem één ding.',finding:'Dezelfde eigenschap in een korte directe vraag.'},
  '0-122':{prompt:'Wat gebruik je elke dag? Noem één ding.',finding:'Dezelfde dagelijkse woordenschatvraag, direct gesteld.'},
  '0-125':{prompt:'Wat wil je deze week doen? Noem één ding.',finding:'Dezelfde korte planvraag in directe vorm.'},
  '1-001':{prompt:'Noem je naam en één hobby.',finding:'Stel jezelf voor vereenvoudigd; beide oorspronkelijke gegevens blijven gevraagd.'},
  '1-003':{prompt:'Vertel één ding over een vriend. Wat doen jullie samen?',finding:'Iets over een vriend begrensd tot één kenmerk; twee korte antwoorden blijven genoeg.'},
  '1-004':{prompt:'Waar ontmoet je graag nieuwe mensen?',finding:'De omslachtige instructie teruggebracht tot de eigenlijke vraag.'},
  '1-005':{prompt:'Wat vind je fijn in je woonplaats? Noem twee dingen.',finding:'Dezelfde voorkeur voor twee dingen, zonder langere bijzin in de opdracht.'},
  '1-006':{prompt:'Wat vind je fijn in de les? Vertel ook waarom.',finding:'Onderdeel vereenvoudigd. De reden blijft verplicht en het A2-advies blijft passend; hulp gebruikt want.'},
  '1-007':{prompt:'Wat leg je voor de les op tafel?',finding:'Beschrijf kon extra eigenschappen suggereren; het gaat om spullen noemen.'},
  '1-008':{prompt:'Wat kun je al goed in de les?',finding:'Dezelfde korte zelfbeschrijving direct gevraagd.'},
  '1-010':{prompt:'Je hebt in de les iets opgeschreven. Wat doe je daarna met die aantekeningen?',finding:'Aantekeningen wordt vanuit de handeling uitgelegd; geen denkstap naar een ontbrekende tekst nodig.'}
 };
 const reviews=Object.fromEntries(rows.split('\n').map(line=>{
  const [key,level,group,goal,help,check]=line.split('|'),id='sq-r'+key.split('-')[0]+'-circle-'+key.split('-')[1];
  if(!check||!['A1','A2'].includes(level))throw new Error('Onvolledige Vertel-review: '+id);
  return [id,{level,group,goal,help,check,reason:level==='A1'?goal+' Eén of enkele korte woorden of zinnen over een vertrouwde situatie volstaan; samenhangende uitleg is niet vereist.':goal+' De cursist noemt een vertrouwde lesactiviteit en geeft daarbij zelf één eenvoudige reden.',...(edits[key]||{finding:'Vraag en eventueel bestaand voorbeeld zijn passend; concrete hulp en eigen bespreekpunt toegevoegd.'})}];
 }));
 function revise(bank){
  if(bank.bank_id!=='CB-QUICK-014'||bank.source_version!=='2026-09-24.snelvragen.2')throw new Error('Vertel-review hoort bij de voorafgaande Snelvragenversie.');
  const guidance=structuredClone(bank.guidance);guidance.sources.quickTellReviewed={title:'Taalroute · beoordeling van 120 bestaande Vertel-vragen',version};
  const items=bank.items.map(item=>{
   const id=item.content_item_id,r=reviews[id];if(!r)return item;
   const context=r.context??item.context,prompt=r.prompt??item.prompt;
   const explanation=r.goal+' '+r.check+' Je mag iets verzinnen of de vraag overslaan.'+(item.model_answer?' Het voorbeeld is één mogelijkheid.':'');
   const result={...item,version,context,prompt,title:r.title??item.title,cefr_level:r.level,difficulty:r.level==='A1'?'basis':'midden',estimated_duration_seconds:r.level==='A1'?30:45,practice_group:'quick-direct-'+r.group,learning_goal:r.goal,feedback_correct:explanation,feedback_incorrect:r.help,explanation,level_review:{source_level:item.cefr_level,level:r.level,reason:r.reason},source_ref:{...item.source_ref,review_version:version,changes:{context,prompt,title:r.title??item.title,help:r.help,goal:r.goal,level:r.level}}};
   const example=id+'@'+version;guidance.examples[example]={goal:r.goal,evidence:explanation,source:'quickTellReviewed'};
   guidance.bindings[id]={item_version:version,bank_id:bank.bank_id,erk:{status:'reviewed',version,source:'quickTellReviewed',levels:[r.level],skill:'Spreken',goal:r.goal,evidence:r.reason+' Eigen redactioneel advies; geen niveautoets of klasproef.'},bow:{example,criteria:['goal','activate','support','feedback','close']}};
   return result;
  });
  return {...bank,source_version:version,source_sha256:bank.source_sha256+'@'+version,review_scope:'240 directe vragen en de eerste 120 Vertel-vragen afzonderlijk redactioneel beoordeeld. Overige 2261 vragen behouden hun eerdere, beperktere review.',items,guidance};
 }
 const api={version,reviews,revise};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuickTellReview=api;
})(typeof globalThis!=='undefined'?globalThis:this);
