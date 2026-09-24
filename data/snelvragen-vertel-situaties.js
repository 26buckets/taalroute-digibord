// Third workset of 120 existing Vertel tasks: complete situations, no new tasks or source models.
(function(root){
 'use strict';
 const version='2026-09-24.snelvragen.vertel.3';
 // ID | individually assessed level | theme | goal | support | discussion check.
 const rows=`
2-007|A2|les|Uitleggen wat je nog niet begrijpt aan een opdracht.|Ik weet niet of ik …|Het antwoord noemt de onduidelijke handeling; niet doen alsof alle woorden onbekend zijn.
2-008|A2|les|Vertellen hoe je dagelijks tien minuten oefenen plant.|Ik oefen … Dan …|Een moment en een manier om te oefenen passen; het plan mag bedacht zijn.
2-009|A2|vervoer|Een verandering in je reis naar de les uitleggen.|Eerst … Volgende week …|Noem wat hetzelfde blijft en welke reisstap erbij komt.
2-011|A2|thuis|Een kamer inrichten met genoeg zitplaatsen.|Ik zet … Dan kunnen …|Gebruik de beschikbare stoelen en bank. Verschillende opstellingen mogen; zes mensen moeten kunnen zitten.
2-012|A2|thuis|Vertellen wat je aan een gestopte wasmachine merkt.|Ik zie … Ik hoor …|Beschrijf de gegeven waarnemingen. De oorzaak is niet bekend; die hoef je niet te raden.
2-013|A1|spullen|Zeggen wat je eerst inpakt bij een verhuizing.|Ik pak eerst … in.|Eén ding is genoeg. Een reden of een volledig verhuisplan is niet gevraagd.
2-014|A2|thuis|Uitleggen hoe je zonder veel lawaai thuiskomt.|Ik … zodat …|Een rustige aanpak past bij een slapende huisgenoot; meerdere oplossingen zijn mogelijk.
2-015|A1|afspraak|Een tijd noemen waarop je thuis bent.|Vanaf … ben ik thuis.|Noem de gegeven tijd; een uitleg over de bezorgroute is niet nodig.
2-016|A2|koken|Vertellen hoe je soep zonder tomaten kunt maken.|Ik gebruik … Dan …|Een andere soep of andere ingrediënten passen. Je hoeft geen volledig recept te geven.
2-017|A1|eten|Een maaltijd zonder vlees noemen.|Ik maak …|Eén maaltijd past. Zonder vlees betekent niet automatisch zonder alle dierlijke producten.
2-018|A2|eten|Vertellen hoe je een lunch voor een korte pauze voorbereidt.|Voor de pauze … In de pauze …|De voorbereiding moet helpen om binnen twintig minuten te eten; een uitgebreid recept is niet nodig.
2-019|A1|eten|Zeggen wat anders is aan je bestelling.|Ik bestelde … maar ik kreeg …|Het verschil rijst en friet moet duidelijk zijn; geen oorzaak verzinnen.
2-020|A1|eten|Een bestemming voor overgebleven eten noemen.|Met het extra eten kan ik …|Eén idee volstaat. Er eten twee mensen, niet zes.
2-021|A1|drinken|Drinken klaarzetten voor verschillende voorkeuren.|Ik zet … en … klaar.|Noem ook iets voor de persoon die geen koffie drinkt. Aantallen zijn niet gegeven of vereist.
2-022|A1|drinken|Je oorspronkelijke bestelling noemen.|Ik had … besteld.|Noem de kleine thee; je hoeft geen prijs of inhoud in milliliters te bedenken.
2-023|A1|drinken|Een herbruikbare beker voor onderweg noemen.|Ik neem … mee.|Eén geschikt voorwerp is genoeg; een milieubetoog is niet nodig.
2-024|A1|drinken|Beschrijven wat nog op tafel staat.|Er staan …|Gebruik de gegeven spullen. De waterglazen zijn op, niet alle drinkbekers.
2-025|A2|drinken|Kort vertellen hoe je een drankje omstootte.|Ik … en toen …|De volgorde en het omgestoten drankje moeten duidelijk zijn; geen extra schuld of schade toevoegen.
2-026|A1|winkelen|Zeggen welk brood je meestal koopt.|Meestal koop ik …|Een soort brood is genoeg. Je mag een voorkeur bedenken.
2-027|A2|winkelen|Boodschappen voor twee dagen kort beschrijven.|Voor de eerste dag … Voor de tweede dag …|Een eenvoudig plan voor één persoon past. Er zijn geen winkelprijzen gegeven; toets geen exacte begroting.
2-028|A1|geld|Twee verschillende prijzen noemen.|Op het bordje … Bij de kassa …|Noem beide gegeven prijzen. Het verschil uitrekenen is niet verplicht.
2-029|A2|winkelen|Uitleggen hoe je zware boodschappen verdeelt.|Ik doe … in …|Verdeel spullen over tas en rugzak; noem geen hulpmiddel dat verplicht zou ontbreken.
2-030|A2|winkelen|Uitleggen hoe je een boodschappenlijst gebruikt.|Eerst kijk ik … Daarna …|Een begrijpelijke werkwijze past; de exacte groenten op het lijstje zijn niet nodig voor deze uitleg.
2-031|A1|kleding|Beschrijven wat goed past en wat niet aan een jas.|De jas … maar de mouwen …|Behoud het verschil tussen de jas en de te lange mouwen.
2-032|A1|kleding|Kleding voor werken in de regen noemen.|Ik neem … mee.|Een passend kledingstuk of korte opsomming is genoeg; een reden is niet vereist.
2-033|A1|kleding|Zeggen wanneer je merkte dat een broek te klein was.|Dat merkte ik …|Het moment thuis tijdens het passen is genoeg; een heel verhaal hoeft niet.
2-034|A1|kleding|Nette en prettige kleding kort beschrijven.|Ik zoek …|Noem kleding of kenmerken die bij beide wensen passen; smaak kan verschillen.
2-035|A1|spullen|Vertellen waarvoor je een tas nodig hebt.|Met de tas wil ik …|Eén gebruik past. Je hoeft de rits niet te kunnen repareren.
2-036|A2|vervoer|Een andere reis naar de les beschrijven.|Ik kan … Daarna …|Gebruik een mogelijke andere route; een rit met de uitgevallen bus is geen oplossing.
2-037|A2|vervoer|Het gevolg van vertraging voor een overstap uitleggen.|Ik kom om … De trein van …|De trein van 9.15 uur is al weg bij aankomst om 9.25 uur. De volgende vertrekt om 9.45 uur.
2-038|A2|vervoer|Een route naar het buurthuis in volgorde vertellen.|Eerst … Bij … Daarna …|Gebruik de gegeven route; er hoort geen ontbrekende plattegrond bij.
2-039|A1|vervoer|Vertellen welke fietslamp niet werkt.|De voorlamp … De achterlamp …|Noem het verschil tussen voor- en achterlamp. De oorzaak is niet gegeven.
2-040|A2|buurt|Een andere route voor bezoek uitleggen.|Ga via … Daarna …|Gebruik de twee genoemde straten; de afgesloten straat is niet de route.
2-041|A2|afspraak|Een mogelijke verklaring voor dubbele afspraken geven.|Misschien heb ik …|Een mogelijke verklaring past. Je hoeft niet te doen alsof de oorzaak vaststaat.
2-042|A2|dag|Uitleggen wat eerder werken aan je ochtend verandert.|Normaal … Morgen …|Het plan moet passen bij beginnen om acht in plaats van negen uur; een eigen aanpak mag.
2-043|A1|vrije-tijd|Een activiteit voor een vrij uur noemen.|In dat uur kan ik …|Eén passende activiteit is genoeg; geen heel dagplan nodig.
2-044|A1|afspraak|De tijd in je agenda noemen.|In mijn agenda staat …|Noem tien uur als genoteerde tijd; half elf is de nieuwe begintijd.
2-045|A1|dag|Een taak noemen die je later kunt doen.|Ik kan … later doen.|Eén taak volstaat; je mag een eigen dag bedenken.
2-046|A2|weer|Een picknickplan aanpassen aan regen.|We kunnen … in plaats van …|Een ander passend plan is genoeg; afzeggen of verplaatsen mag ook.
2-047|A2|weer|Vertellen hoe je een wandeling bij warm weer aanpast.|Ik verander … omdat …|Een aanpassing aan tijd, plek of duur past; geen medische uitleg nodig.
2-048|A2|weer|Vertellen hoe je schoenen nat werden.|Ik … Toen …|Een kort verhaal dat bij regen past is genoeg; het mag bedacht zijn.
2-049|A1|weer|Beschrijven wat de wind doet op een terras.|De wind …|Noem de gegeven waarnemingen; schade of gevaar is niet automatisch gegeven.
2-050|A1|weer|Spullen voor twee mogelijke soorten weer noemen.|Voor de zon … Voor de regen …|Noem iets voor zonnig weer en iets voor regen; een voorspelling is niet nodig.
2-051|A1|werk|Vertellen wat je al weet van een nieuwe taak.|Ik weet al dat …|Noem wat je volgens de situatie weet. De hele taak zelfstandig kunnen uitvoeren is niet vereist.
2-052|A1|werk|Een nog niet uitgevoerde taak noemen.|De … moet nog …|Noem de afwas; verzin geen extra taken van de zieke collega.
2-053|A1|werk|Een ongeschikte werkdag noemen.|Op … kan ik niet.|Noem vrijdag. Je hoeft geen nieuw rooster te maken.
2-054|A2|werk|Uitleggen wat door ontbrekend materiaal niet lukt.|Zonder … kan ik niet …|Het verband tussen plakband en dozen sluiten moet duidelijk zijn.
2-055|A1|werk|Afgeronde taken noemen.|De … is al …|Noem de twee afgeronde taken; de kasten zijn nog niet gedaan.
2-056|A1|vrije-tijd|Een andere activiteit voor een uitgevallen sportles noemen.|Dan wil ik …|Eén activiteit is genoeg; een reden is niet nodig.
2-057|A1|vrije-tijd|Een hobby noemen waarvoor je weinig hoeft te kopen.|Ik wil … proberen.|Eén hobby past; het hoeft geen gratis hobby te zijn.
2-058|A2|vrije-tijd|Uitleggen waarom je een film wilt zien.|Ik wil die film zien, want …|Een eigen reden past bij de genoemde komische film. De uitverkochte voorstelling maakt de voorkeur niet ongeldig.
2-059|A1|sport|Een rustige vorm van bewegen noemen.|Ik wil liever …|Eén rustige activiteit volstaat. Rustig bewegen is ook een vorm van bewegen, niet het tegenovergestelde van alle sport.
2-060|A1|vrije-tijd|De onderdelen van een spel noemen.|Ik zie …|Gebruik de gegeven onderdelen; spelregels hoeven niet bedacht te worden.
2-061|A1|buurt|De schade aan een bankje beschrijven.|De … zit …|Beschrijf de losse plank; een oorzaak of reparatieadvies is niet gevraagd.
2-062|A1|buurt|Een bijdrage aan een buurtactiviteit noemen.|Ik kan helpen met …|Kies een passende taak bij de boekenruil. Een andere uitvoerbare bijdrage mag ook.
2-063|A2|buurt|Uitleggen waarom een fiets voor een ingang lastig is.|Door de fiets …|Leg het verband met de geblokkeerde ingang. Verzin geen ongeluk dat al gebeurd zou zijn.
2-064|A1|buurt|Een afvaldag uit de situatie noemen.|Ik zet de afvalbak op … buiten.|Gebruik dinsdag uit de situatie. Dit is geen advies over echte gemeentelijke regels.
2-065|A1|bezoek|Een hulptaak bij een buurtmaaltijd noemen.|Ik kan …|Een genoemde of andere passende taak is genoeg; de hele maaltijd organiseren hoeft niet.
2-066|A2|contact|Een looproute vanaf het station uitleggen.|Vanaf het station … Dan …|Gebruik de gegeven route in de juiste volgorde; een echt woonadres is niet nodig.
2-067|A1|bezoek|Een nog nodige voorbereiding voor bezoek noemen.|Ik moet nog …|Noem wat nog niet klaar is; een verhaal over de hele dag is niet nodig.
2-068|A2|afspraak|Uitleggen waarom je niet op een uitnodiging kunt ingaan.|Ik kan niet komen, want …|Werken op die dag is een passende reden; meer persoonlijke uitleg is niet verplicht.
2-069|A1|bezoek|Een beschikbare slaapplaats beschrijven.|Je kunt op … slapen.|De slaapbank in de woonkamer past; verzin geen beschikbare logeerkamer.
2-070|A1|spullen|Een achtergelaten voorwerp noemen.|Mijn … ligt nog bij …|Noem de jas uit de situatie; een beschrijving van de hele kamer is niet nodig.
2-072|A1|telefoon|Een foutmelding op je telefoon doorgeven.|Op het scherm staat …|Geef de melding door. Een oorzaak of technische oplossing is niet bekend.
2-073|A1|telefoon|Zeggen welke chatberichten je belangrijk vindt.|Ik vind berichten over … belangrijk.|Eén soort bericht is genoeg; de extra uitleg in het bronvoorbeeld is niet verplicht.
2-074|A2|telefoon|Een andere manier uitleggen om contact op te nemen.|Ik kan … Dan …|Een uitvoerbare andere manier past; de kapotte telefoon hoeft niet alsnog te werken.
2-075|A1|afspraak|Een verkeerd doorgegeven tijd corrigeren.|Ik schreef … Het moet … zijn.|Maak duidelijk dat 14.00 uur fout is en 15.00 uur klopt.
2-076|A2|lezen|Uitleggen waarom je meer leentijd nodig hebt.|Ik heb meer tijd nodig, want …|Het niet uitgelezen boek geeft een passende reden. Verlenging is niet automatisch toegestaan.
2-077|A1|lezen|Een gezocht soort boek beschrijven.|Ik zoek een boek over …|Een kookboek met eenvoudige recepten past; geen bestaande titel nodig.
2-078|A1|lezen|Een gewenste werkplek beschrijven.|Ik zoek een plek met …|Noem wat je nodig hebt. Je hoeft geen bezette tafel als beschikbaar voor te stellen.
2-079|A1|les|Een leerwens voor een cursus noemen.|Ik wil leren …|Eén leerwens is genoeg; de cursus hoeft nog niet gevonden te zijn.
2-080|A1|lezen|De beschadiging aan een geleend boek beschrijven.|Er zitten …|Noem de losse pagina's. Wie de schade veroorzaakte, is niet gegeven.
2-081|A1|afspraak|Verschillende tijden in een brief en agenda noemen.|In de brief … In mijn agenda …|Noem beide tijden. Uit dit verschil alleen weet je niet welke tijd juist is.
2-082|A2|afspraak|Uitleggen wat onduidelijk is aan informatie over een afspraak.|Ik begrijp niet welk …|Noem het onduidelijke bewijs; doe niet alsof je al weet welk document gevraagd wordt.
2-083|A1|rust|Een activiteit noemen die je minder wilt doen.|Ik wil minder …|Eén activiteit is genoeg; een persoonlijk herstelplan is niet gevraagd.
2-084|A2|contact|Uitleggen hoe je iemand bij een afspraak kunt steunen.|Ik kan … De ander …|De ander blijft zelf spreken en kiezen. Bespreek hulp zonder diens antwoord over te nemen.
2-085|A1|afspraak|Een wachttijd en afspraak noemen.|Ik wacht … Ik heb een afspraak bij …|Het is dertig minuten sinds aankomst om negen uur. Noem ook de fietsenmaker.
2-086|A1|post|Het verwachte afhaalpunt noemen.|Ik verwachtte het pakket bij …|Noem de winkel naast het station; het werkelijke andere punt is niet het verwachte punt.
2-087|A1|cadeau|Een breekbaar cadeau kort beschrijven.|Het is een … van …|Noem de glazen vaas; een volledige verpakkingsinstructie is niet gevraagd.
2-088|A1|post|De soorten gegevens op een envelop benoemen.|Er staat een … en een …|Noem naam en adres zonder echte persoonsgegevens op te lezen.
2-090|A2|post|Uitleggen waarom je niet voor sluitingstijd kunt komen.|Ik werk tot … maar …|Het werk eindigt later dan het afhaalpunt sluit. Reistijd hoef je niet te bedenken.
2-091|A1|geld|Een kassabon kort beschrijven.|Op de bon staan …|De bon noemt twee broodjes en zes euro; maak er niet één broodje van omdat je er één kreeg.
2-092|A2|geld|Een eenvoudige manier uitleggen om geld voor een fiets te bewaren.|Ik kan … Dan houd ik … over.|Een eigen plan past. Dit is een spreekopdracht; bespreek geen verplichte bedragen of persoonlijke geldproblemen.
2-093|A1|cadeau|Een bedrag voorstellen voor een gezamenlijk cadeau.|Ik vind … euro passend.|Een bedrag is genoeg; er is geen vaste juiste prijs of verplichte bijdrage.
2-094|A1|geld|Een verwacht bedrag noemen.|Ik verwachtte … euro.|Noem twintig euro als verwachting; vijfentwintig euro is het bedrag op de rekening.
2-095|A1|geld|Een melding bij een mislukte betaling doorgeven.|Er staat …|Noem de gegeven melding. Een banksaldo of oorzaak is niet bekend.
2-096|A1|schoonmaken|Taken in een vieze keuken noemen.|De … moet …|Noem taken die passen bij de vuile borden en kruimels; geen complete taakverdeling nodig.
2-097|A1|schoonmaken|Een tijd noemen waarop je kleding nodig hebt.|Ik heb de kleding … nodig.|Noem morgenochtend om acht uur; de wasduur is niet gegeven.
2-098|A2|schoonmaken|Uitleggen waarom papier uit een gang weg moet.|Door het papier …|Leg het verband met moeilijk langs elkaar lopen; geen gebeurd ongeluk verzinnen.
2-099|A2|schoonmaken|Kort vertellen hoe een vlek ontstond.|Ik … Toen …|Vertel over de gevallen koffie en de vlek; geen opzet of extra schade toevoegen.
2-100|A2|thuis|De huidige verdeling van taken uitleggen.|Meestal … De anderen …|Noor doet het meeste. Vertel de gegeven verdeling zonder iemand lui te noemen of een oorzaak te verzinnen.
2-101|A1|dieren|Benodigde informatie voor het oppassen op een hond noemen.|Ik moet weten …|Noem praktische informatie die je nodig hebt; je hoeft de antwoorden nog niet te weten.
2-102|A1|natuur|Bladeren van een plant beschrijven.|De bladeren zijn … en …|Noem de gegeven kleur en stand; stel geen oorzaak vast op grond van alleen de beschrijving.
2-103|A1|schoonmaken|Spullen voor opruimen in een park noemen.|We kunnen … gebruiken.|Een korte opsomming is genoeg; een werkplan is niet gevraagd.
2-104|A1|natuur|De beschikbare ruimte op een balkon beschrijven.|Het balkon is …|Noem de gegeven maten en de stoel. Een exacte berekening van vrije oppervlakte is niet nodig.
2-105|A1|buiten|Kort noemen wat je tijdens een wandeling zag.|Onderweg zag ik …|Gebruik de gegeven waarnemingen. De duur van de wandeling hoef je niet te berekenen.
2-106|A1|feest|Extra spullen voor meer gasten noemen.|We hebben extra … nodig.|Houd rekening met zes gasten in plaats van vier; het voorbeeld hoeft geen boodschappenlijst met prijzen te zijn.
2-107|A2|feest|Uitleggen hoe je een feest naar binnen verplaatst.|Binnen kunnen we …|Een uitvoerbare indeling past bij de beschreven ruimte. Meerdere oplossingen zijn mogelijk.
2-108|A1|cadeau|Bekende interesses van een cadeauontvanger noemen.|Ik weet dat …|Noem lezen en tuinieren. Dat bewijst nog niet welk cadeau die persoon wil.
2-109|A1|afspraak|Een tijd noemen waarop je kunt helpen.|Ik kan van … tot …|Noem vier tot vijf uur als beschikbaar moment, niet de begintijd van het feest.
2-110|A2|afspraak|Uitleggen waarom je de eindtijd van een feest wilt weten.|Ik wil de eindtijd weten, want …|Een passende eigen reden is genoeg; een eindtijd is juist nog niet gegeven.
2-111|A1|reizen|Een activiteit tijdens wachten op een kamer noemen.|In de tussentijd kan ik …|Eén idee volstaat; de nog niet beschikbare kamer kun je nog niet gebruiken.
2-112|A2|reizen|Een eenvoudig plan voor een goedkoop dagje weg beschrijven.|Ik wil … Daarna …|Een kort, samenhangend plan past. Geen exacte prijzen of gegarandeerde budgetberekening vragen.
2-113|A1|reizen|Een gewijzigde aankomsttijd doorgeven.|Eerst zou ik om … Nu …|Noem 14.00 en 14.30 uur. Het verschil in minuten berekenen hoeft niet.
2-114|A1|reizen|Geluid bij een kamer beschrijven.|Ik hoor …|Noem auto's en claxons. De reden voor het toeteren is niet gegeven.
2-115|A1|reizen|Een plek noemen die je die middag wilt bezoeken.|Ik wil naar …|Eén plek is genoeg; een echte stad of uitgewerkt reisplan is niet nodig.
2-116|A1|spullen|Plekken noemen waar je al naar een boek hebt gezocht.|Ik heb al … gekeken.|Noem de tas en de plek onder het bed. Het boek is nog niet gevonden.
2-117|A2|spullen|Uitleggen welke maten je wilt weten voor het verplaatsen van een tafel.|Ik wil weten hoe …|Maten van tafel én deuropening zijn relevant; laat uitleggen waarvoor. Er zijn geen getallen om al te beslissen dat het past.
2-118|A1|spullen|Het doel van een geleend apparaat noemen.|Ik heb het nodig om …|Noem de plank ophangen; een uitleg over de werking van de boormachine is niet nodig.
2-119|A1|spullen|De buitenkant van een gevonden tas beschrijven.|De tas is … en heeft …|Noem de gegeven kleur en hengsels; de inhoud en eigenaar zijn niet bekend.
2-120|A1|vervoer|Beschrijven wat je aan fietsbanden merkt.|De achterband … De voorband …|Noem het verschil. Een zachte band is niet automatisch lek.
2-121|A1|dag|Twee combineerbare taken noemen.|Ik kan … en …|De twee taken moeten bij elkaar kunnen passen; een hele dagplanning is niet gevraagd.
2-122|A2|afspraak|Uitleggen waarom een dag onhandig is om af te spreken.|Die dag … Daarom …|De gegeven werk-, les- en sportmomenten verklaren de drukte; meer persoonlijke redenen zijn niet nodig.
2-123|A2|les|Uitleggen wat je door een andere lestijd anders plant.|Eerst … Nu …|Maak duidelijk wat verschuift door de les om één uur; een eigen oplossing mag.
2-124|A1|vrije-tijd|Een activiteit voor een onverwacht vrije middag noemen.|Ik wil graag …|Eén activiteit is genoeg; de vrije middag hoeft niet echt plaats te vinden.
2-125|A2|dag|Een gewenste verandering in een gewoonte uitleggen.|Nu … Een week lang wil ik …|Maak de huidige en de gewenste gewoonte duidelijk. Je mag een gewoonte bedenken.
3-001|A2|kennismaken|Een kennismakingssituatie en een mogelijk gevolg samenvatten.|De groep … Daardoor kan …|De nieuwe wandelaar kent niemand en de groep vertrekt. Een gevolg is mogelijk, niet zeker.
3-002|A2|kennismaken|Een mogelijke reden voor aarzeling bij een persoonlijke vraag geven.|Misschien …|Er is alleen aarzeling beschreven. Je weet niet waarom; meerdere verklaringen mogen en persoonlijke onthulling is niet verplicht.
3-003|B1|werk|Feiten en ontbrekende kennis in een verwarrende berichtsituatie onderscheiden.|We weten dat … We weten nog niet of …|De namen zijn gelijk en berichten komen verkeerd terecht. Of de collega's dat al weten, staat er niet.
3-004|B1|kennismaken|Een mogelijk gevolg van onduidelijke uitleg voorzichtig toelichten.|Er staat … Dat kan … Maar we weten niet …|Veel afkortingen zijn gegeven. Dat nieuwe leden ze niet begrijpen is mogelijk, niet bewezen.
`.trim();
 const edits={
  '2-007':{context:'De docent zegt: “Werk samen aan opdracht vier.” Je kent de woorden, maar weet niet of je moet schrijven of praten.',finding:'De onduidelijke opdracht ontbrak. De tekst en de concrete onzekerheid zijn nu gegeven.'},
  '2-008':{prompt:'Wanneer kun je tien minuten oefenen? Vertel hoe je dat in je dag plant.',finding:'De eigen planning mag worden bedacht; moment en aanpak zijn duidelijk gevraagd.'},
  '2-009':{context:'Je komt met de trein naar de les. Het oude lesgebouw staat naast het station. Volgende week is de les in de bibliotheek, op tien minuten lopen van het station.',finding:'Oude en nieuwe plek waren onbekend; de benodigde reisverandering is nu te bepalen.'},
  '2-011':{context:'Jullie zijn met zes mensen. In de kamer staan vier stoelen en een bank met twee zitplaatsen.',finding:'Aantal mensen en beschikbare zitplaatsen zijn gegeven; een ontbrekende kamerafbeelding is niet nodig.'},
  '2-012':{context:'De wasmachine stopt. Een rood lampje knippert. De trommel draait niet meer. Je hoort een zacht brommend geluid.',finding:'Er was geen echte machine te zien of horen. De waarneembare gegevens staan nu in de situatie; geen diagnose gevraagd.'},
  '2-013':{finding:'Alleen een eerste voorwerp of groep spullen noemen is A1; weinig dozen maakt die taalhandeling niet vanzelf A2.'},
  '2-014':{context:'Je huisgenoot moet morgen vroeg werken en ligt al te slapen. Jij komt laat thuis.',finding:'De slapende huisgenoot maakt het doel van rustig binnenkomen expliciet.'},
  '2-015':{context:'Een pakket komt vandaag terwijl je weg bent. Vanaf twee uur ben je thuis.',finding:'Het beschikbare tijdstip ontbrak. Eén gegeven tijd doorgeven past bij A1.'},
  '2-016':{prompt:'Hoe kun je soep zonder tomaten maken? Je mag andere ingrediënten kiezen.',finding:'De cursist mag zelf een alternatief kiezen; er wordt geen onbekende voorraad verondersteld.'},
  '2-017':{finding:'Een maaltijd zonder vlees noemen is een korte woordenschattaak op A1; geen recept of reden gevraagd.'},
  '2-019':{finding:'Twee gegeven producten tegenover elkaar zetten volstaat; A1 in plaats van een routegebonden A2-label.'},
  '2-020':{context:'Je hebt eten gemaakt voor vier mensen. Uiteindelijk eten jullie met twee mensen.',finding:'Er komen er twee kon twee extra gasten betekenen; het totaal is nu ondubbelzinnig.'},
  '2-021':{finding:'Een korte opsomming van drinken is voldoende; rekening houden met geen koffie vraagt geen langer A2-verhaal.'},
  '2-022':{context:'Je hebt een kleine thee besteld. Je krijgt een grote mok thee.',finding:'De oorspronkelijke bestelling ontbrak. De maat en het drankje zijn nu benoemd; kort doorgeven past bij A1.'},
  '2-023':{finding:'Eén herbruikbare beker noemen is A1; een reden over duurzaamheid is niet gevraagd.'},
  '2-024':{context:'Bij een bijeenkomst zijn alle waterglazen in gebruik. Op tafel staan nog een kan water, kopjes en herbruikbare bekers.',finding:'Wat op tafel staat was niet zichtbaar of beschreven. Een korte opsomming is nu uitvoerbaar op A1.'},
  '2-025':{context:'Je zit in een café. Je stoot met je elleboog tegen je glas water. Het glas valt om en het water loopt over de tafel.',finding:'Het verloop is concreet genoeg om na te vertellen zonder gebeurtenissen te verzinnen.'},
  '2-026':{finding:'Een eigen broodsoort noemen is A1; uitverkocht is alleen de aanleiding.'},
  '2-027':{context:'Je hebt twintig euro voor eten voor jezelf, voor twee dagen.',prompt:'Vertel wat je voor die twee dagen wilt kopen.',finding:'Voor hoeveel mensen was onduidelijk. Eén persoon is nu gegeven; zonder prijzen wordt geen exacte begroting beoordeeld.'},
  '2-028':{context:'Op het prijsbordje staat twee euro. Bij de kassa verschijnt twee euro vijftig.',finding:'Beide prijzen ontbraken. Nu kan de cursist het verschil benoemen; rekenen is geen verborgen eis.'},
  '2-029':{context:'Je boodschappentas met flessen en brood is te zwaar. Je hebt ook een lege rugzak bij je.',finding:'Beschikbare spullen en een tweede draagmogelijkheid zijn nu gegeven.'},
  '2-030':{context:'Je koopt groenten voor iemand anders. Die persoon heeft je een boodschappenlijst gegeven.',finding:'De lijst is expliciet beschikbaar; de vraag gaat over gebruiken, niet over ontbrekende producten aflezen.'},
  '2-031':{finding:'De pasvorm en lange mouwen zijn gegeven. Een korte tegenstelling volstaat op A1.'},
  '2-032':{finding:'Eén passend kledingstuk of een korte lijst volstaat op A1; een aanpak uitleggen is niet gevraagd.'},
  '2-033':{context:'In de winkel leek een broek goed te passen. Thuis pas je hem opnieuw. Als je gaat zitten, voel je dat hij te klein is.',finding:'Het moment waarop de cursist iets merkte was onbekend; nu kan dat kort worden genoemd.'},
  '2-034':{finding:'Kleding met twee kenmerken noemen past bij A1; een uitgebreide vergelijking is niet gevraagd.'},
  '2-035':{context:'De rits van je tas is kapot. Je gebruikt de tas voor je boeken en je lunch.',finding:'De functie van de tas is gegeven. Vertellen waarvoor je de tas nodig hebt is A1, geen reparatietaak.'},
  '2-036':{context:'Je gewone bus naar de les rijdt vandaag niet. Je kunt ook fietsen of met een andere bus vanaf het station gaan.',finding:'Er zijn uitvoerbare alternatieven gegeven; lokale vervoerskennis is niet vereist.'},
  '2-037':{context:'Je trein zou om 9.10 uur aankomen, maar komt om 9.25 uur. Je volgende trein vertrekt om 9.15 uur. Daarna gaat er een om 9.45 uur.',finding:'Zonder tijden was niet te bepalen of de overstap mislukte. De drie relevante tijden zijn nu beschikbaar.'},
  '2-038':{context:'Jullie staan bij het station. Loop rechtdoor tot de bakker. Sla daar rechtsaf. Het buurthuis staat naast het park.',finding:'De route en het vertrekpunt ontbraken; de kaart kan nu zonder plattegrond.'},
  '2-039':{context:'Het wordt donker. Je zet je fietslampen aan. De achterlamp brandt, maar de voorlamp geeft geen licht.',finding:'Het waarneembare verschil staat er nu. Kort doorgeven is A1; de oorzaak hoeft niet geraden te worden.'},
  '2-040':{context:'De Hoofdstraat naar je huis is afgesloten. Bezoek kan via de Kerkstraat en daarna de Parklaan bij je huis komen.',finding:'Een alternatieve route ontbrak; de benodigde straten en volgorde zijn gegeven.'},
  '2-041':{prompt:'Vertel hoe dat kan zijn gebeurd.',finding:'De oorzaak stond niet in de bron. De vraag vraagt nu uitdrukkelijk een mogelijke verklaring in plaats van een onbekend feit.'},
  '2-042':{context:'Je werk begint normaal om negen uur. Morgen begin je om acht uur.',finding:'Het verschil van een uur heeft nu concrete tijden, zonder een verborgen rooster.'},
  '2-043':{finding:'Eén activiteit noemen voor een vrij uur past bij A1; geen plan of reden vereist.'},
  '2-044':{context:'In je agenda staat dat de activiteit om tien uur begint. Je krijgt bericht dat de activiteit om half elf begint.',finding:'De genoteerde en nieuwe tijd ontbraken. Het gevraagde gegeven doorgeven past bij A1.'},
  '2-045':{prompt:'Denk aan een drukke dag. Welke taak kun je later doen?',finding:'Een eigen of bedachte dag mag; een onbekende takenlijst is niet vereist. Eén taak is A1.'},
  '2-048':{prompt:'Vertel hoe je schoenen nat werden. Je mag het verhaal bedenken.',finding:'Er is geen vaste oorzaak buiten de regen gegeven; de ruimte voor een eigen kort verhaal is expliciet.'},
  '2-049':{context:'Het waait hard op het terras. Servetten waaien van tafel en je jas wappert.',finding:'De waarnemingen ontbraken. Het beschrijven van de gegeven dingen is A1.'},
  '2-050':{context:'Je gaat morgen een dagje weg. Het kan zonnig worden, maar het kan ook regenen.',finding:'Beide soorten weer waren niet benoemd. Zon en regen staan er nu; spullen noemen is A1.'},
  '2-051':{context:'Je gaat voor het eerst prijskaartjes bij producten leggen. Je weet al dat de naam en de prijs bij het product moeten passen.',finding:'De nieuwe taak en bestaande kennis ontbraken. Korte bekende gegevens doorgeven past bij A1.'},
  '2-052':{context:'Je collega is ziek. Die zou vandaag de afwas doen. De borden en bekers zijn nog vuil.',finding:'De onbekende taak is nu benoemd; één resterende taak doorgeven is A1.'},
  '2-053':{context:'Je staat op vrijdag ingeroosterd op je werk. Op vrijdag heb je les en kun je niet werken.',finding:'De dag ontbrak. Eén dag noemen is A1; een nieuwe planning is niet gevraagd.'},
  '2-054':{context:'Je moet dozen dichtmaken voor verzending. Het plakband is op.',finding:'Materiaal en taak waren onbekend; het gevolg kan nu aan de situatie worden gekoppeld.'},
  '2-055':{context:'Je bent eerder klaar met de vloer dweilen en de tafel schoonmaken. De kasten moet je nog doen.',finding:'De afgeronde en nog open taken staan er nu; de afgeronde taken opsommen past bij A1.'},
  '2-056':{finding:'Eén vrijetijdsactiviteit noemen is A1; de uitval van de les verhoogt het taalniveau niet vanzelf.'},
  '2-057':{finding:'Een hobby noemen volstaat op A1; een vergelijking of kostenberekening is niet gevraagd.'},
  '2-058':{context:'Je wilt een komische film zien, maar alle kaartjes voor de voorstelling zijn verkocht.',finding:'De voorstelling is uitverkocht, niet de film als product; het type film geeft houvast voor een eigen reden.'},
  '2-059':{context:'Een vriend wil hardlopen. Jij wilt rustig bewegen.',finding:'Hardlopen vervangt het te brede sporten: rustig bewegen kan ook sport zijn. Eén gewenste activiteit is A1.'},
  '2-060':{context:'Je hebt een spel gekocht zonder duidelijke uitleg. In de doos zitten een speelbord, pionnen, kaarten en een dobbelsteen.',finding:'Er was geen spelbeeld of onderdelenlijst. De onderdelen staan nu in de situatie; opsommen is A1.'},
  '2-061':{context:'Bij het bankje in je straat zit één houten plank los. De andere planken zitten vast.',finding:'De schade is concreet beschreven. Een kort antwoord past bij A1; de oorzaak is niet gegeven.'},
  '2-062':{context:'Er is een boekenruil in de buurt. Er moeten tafels worden klaargezet en boeken worden neergelegd.',prompt:'Waarmee kun je helpen?',finding:'Bijdrage leveren vereenvoudigd; activiteit en taken zijn gegeven. Eén hulptaak noemen is A1.'},
  '2-064':{context:'Je zet jouw afvalbak op dinsdag buiten. Je nieuwe buur weet niet op welke dag jij dat doet.',finding:'Een dag ontbrak. Dinsdag is alleen een gegeven in deze situatie, geen verzonnen gemeenteregel. Kort doorgeven is A1.'},
  '2-065':{context:'Er komt een buurtmaaltijd. Er zijn weinig helpers voor tafels klaarzetten en de afwas.',finding:'Mogelijke taken zijn concreet gemaakt. Eén passende taak noemen volstaat op A1.'},
  '2-066':{context:'Je vriend staat bij het station. Vanaf daar loopt de route rechtdoor tot de brug, dan links. Je huis is het derde huis aan de rechterkant.',prompt:'Vertel je vriend hoe die vanaf het station kan lopen.',finding:'De looproute ontbrak. Alle nodige aanwijzingen staan nu op de kaart, zonder echt adres.'},
  '2-067':{context:'Je bezoek zou om vier uur komen, maar komt om drie uur. De tafel is nog niet opgeruimd en de kopjes staan nog in de kast.',finding:'De resterende voorbereidingen zijn gegeven. Eén handeling noemen past bij A1.'},
  '2-069':{context:'Een gast wil blijven slapen. Je hebt geen logeerkamer, maar wel een slaapbank in de woonkamer.',finding:'Een beschikbare slaapplaats ontbrak. De gegeven plek kort beschrijven past bij A1.'},
  '2-070':{context:'Je jas hangt nog bij een vriend. Je bent vergeten die mee te nemen.',finding:'Het voorwerp was onbekend. Het is nu benoemd; kort zeggen welk voorwerp het is, past bij A1.'},
  '2-072':{context:'Je probeert een bericht op je telefoon te openen. Op het scherm staat: “Kan bericht niet openen.”',finding:'Een scherm of foutmelding ontbrak. De melding is nu te geven; geen technische verklaring gevraagd. Advies A1.'},
  '2-073':{finding:'Eén soort bericht noemen is genoeg. Het langere voorbeeld is geen minimumeis; taakadvies A1.'},
  '2-074':{context:'Je telefoon is kapot vlak voor een afspraak. Je hebt wel een laptop en het e-mailadres van de ander.',finding:'Er is een bruikbaar alternatief beschikbaar; de cursist hoeft geen onbekende middelen aan te nemen.'},
  '2-075':{context:'Je afspraak is om 15.00 uur. In je bericht schreef je per ongeluk 14.00 uur.',finding:'De verkeerde en juiste tijd ontbraken. Die twee gegevens kort doorgeven past bij A1.'},
  '2-077':{context:'Je zoekt een kookboek met eenvoudige recepten. Het boek is aan iemand anders uitgeleend.',finding:'Het gezochte soort boek is gegeven; een korte beschrijving is A1.'},
  '2-078':{finding:'Een wens voor een werkplek kort noemen past bij A1; een uitgebreide oplossing is niet gevraagd.'},
  '2-079':{finding:'Eén leerwens noemen past bij A1; de cursus vinden of beoordelen is niet gevraagd.'},
  '2-080':{prompt:'Wat is er kapot aan het boek?',finding:'Beschadiging is eenvoudiger verwoord. Losse pagina’s zijn gegeven; kort doorgeven past bij A1.'},
  '2-081':{title:'Afspraken',context:'In je afspraakbrief staat tien uur. In je agenda staat half elf.',finding:'Beide tijden ontbraken; er is nog geen bewijs welke klopt. Titel Afspraken past beter dan Welbevinden. Taakadvies A1.'},
  '2-082':{title:'Afspraken',context:'Bij een afspraak krijg je deze uitleg: “Neem een bewijs mee.” Je weet niet welk bewijs bedoeld wordt.',finding:'De onduidelijke uitleg ontbrak. De kaart toont nu de echte leemte, zonder een document te verzinnen.'},
  '2-083':{title:'Rust',prompt:'Welke activiteit wil je minder doen?',finding:'Activiteit verminderen vereenvoudigd. Eén eigen activiteit noemen is A1; titel past nu bij de vraag.'},
  '2-084':{title:'Hulp bij een afspraak',finding:'Titel concreet gemaakt. Help de ander zonder diens stem over te nemen; geen onbekende persoonlijke wensen als feiten behandelen.'},
  '2-085':{title:'Afspraken',context:'Je hebt om negen uur een afspraak bij de fietsenmaker. Je kwam om negen uur aan. Nu is het half tien en je wacht nog.',finding:'Aankomsttijd, huidige tijd en soort afspraak ontbraken. Twee korte gegevens doorgeven past bij A1.'},
  '2-086':{context:'Je verwachtte je pakket bij de winkel naast het station. Het is naar een ander afhaalpunt gebracht.',finding:'Het verwachte punt was onbekend. Eén plek noemen past bij A1.'},
  '2-087':{context:'Je wilt een glazen vaas als cadeau opsturen. De vaas kan makkelijk breken.',finding:'Het cadeau was onbekend. De opdracht vraagt een beschrijving, niet een verpakkingsplan; advies A1.'},
  '2-088':{context:'Je krijgt post voor de vorige bewoner. Op de envelop staan diens naam en jouw adres.',prompt:'Welke gegevens staan op de envelop? Noem geen echte naam of echt adres.',finding:'Een envelop ontbrak. De soorten gegevens zijn nu bekend; er hoeven geen persoonsgegevens te worden ingevuld. Taakadvies A1.'},
  '2-090':{context:'Het afhaalpunt sluit om vijf uur. Jij werkt tot half zes.',finding:'Sluiting en einde werktijd zijn gegeven, zodat de reden te controleren is.'},
  '2-091':{context:'Op je bon staat: twee broodjes, samen zes euro. Je krijgt maar één broodje.',finding:'De bon ontbrak. Aantal en bedrag zijn nu zichtbaar; kort doorgeven is A1.'},
  '2-092':{prompt:'Hoe kun je geld sparen voor de fiets?',finding:'Geld bewaren is vervangen door sparen: het doel van minder uitgeven en geld overhouden is duidelijker.'},
  '2-093':{finding:'Eén eigen bedrag noemen volstaat op A1; een moreel juist bedrag of reden is niet vereist.'},
  '2-094':{context:'Je verwachtte een rekening van twintig euro. Op de rekening staat vijfentwintig euro.',finding:'Het verwachte bedrag ontbrak. Eén gegeven bedrag noemen is A1.'},
  '2-095':{context:'Je probeert met je pas te betalen. Op de betaalautomaat staat: “Betaling mislukt.”',finding:'Het scherm ontbrak. De melding kan nu worden doorgegeven; saldo of oorzaak blijft onbekend. Advies A1.'},
  '2-096':{context:'Na een gezamenlijke maaltijd staan vuile borden op tafel en liggen er kruimels op de keukenvloer.',finding:'De nodige taken zijn nu af te leiden uit concrete waarnemingen. Korte taken noemen is A1.'},
  '2-097':{context:'Je wilt kleding wassen, maar iemand gebruikt de machine. Je hebt de schone kleding morgenochtend om acht uur nodig.',finding:'Het benodigde moment ontbrak. Alleen dat moment doorgeven past bij A1.'},
  '2-098':{context:'Er ligt veel papier in de gezamenlijke gang. Mensen kunnen daardoor moeilijk langs elkaar lopen.',finding:'Het concrete gevolg is benoemd; geen ongeval of brandgevaar als vaststaand feit verzinnen.'},
  '2-099':{context:'Je hebt een kleed geleend. Je laat een kop koffie vallen en er komt een bruine vlek op het kleed.',finding:'De gebeurtenis is beschikbaar om kort na te vertellen; geen verborgen oorzaak meer.'},
  '2-100':{context:'Je woont met Noor en Sam. Meestal kookt Noor, doet Noor de afwas en maakt Noor schoon. Jij en Sam helpen soms.',finding:'De feitelijke verdeling ontbrak. De kaart geeft taken en frequentie, geen oordeel over iemands karakter.'},
  '2-101':{finding:'Benodigde informatie noemen kan in korte woorden of vragen; geen volledig verzorgingsplan vereist. Advies A1.'},
  '2-102':{context:'De bladeren van je plant zijn bruin aan de rand en hangen naar beneden.',finding:'De bladeren waren niet zichtbaar. Beschrijven is nu mogelijk zonder een oorzaak of behandeling te raden; A1.'},
  '2-103':{finding:'Een korte lijst van opruimspullen is A1; een aanpak of reden is niet gevraagd.'},
  '2-104':{context:'Je balkon is twee meter lang en één meter breed. Er staat al een stoel. Je wilt er ook planten neerzetten.',finding:'De afmetingen en bestaande inrichting ontbraken; de ruimte kan nu kort worden beschreven op A1.'},
  '2-105':{context:'Tijdens een lange wandeling zag je een bos, een brug en koeien in een weiland.',finding:'De waarnemingen ontbraken. De gegeven dingen kort noemen volstaat op A1; een verhaal of volgorde is niet gevraagd.'},
  '2-106':{context:'Je hebt stoelen en borden klaargezet voor vier gasten. Er komen zes gasten.',finding:'Oud en nieuw aantal zijn bekend. Extra spullen noemen is A1; prijzen of een volledig feestplan ontbreken niet voor deze taak.'},
  '2-107':{context:'Een feest voor zes mensen kan door regen niet buiten. Binnen is een woonkamer met een grote tafel en zes stoelen.',finding:'Ruimte, spullen en aantal mensen zijn gegeven voor een uitvoerbaar binnenplan.'},
  '2-108':{context:'Je koopt samen een cadeau voor een collega. Je weet dat die graag leest en tuiniert, maar niet welk cadeau die wil.',finding:'De bekende interesses ontbraken. Die kort noemen is A1; cadeauwensen blijven onzeker.'},
  '2-109':{context:'Het feest begint om zes uur. Jij kunt van vier tot vijf uur helpen, maar daarna niet meer.',finding:'Het beschikbare tijdvak ontbrak. Kort doorgeven past bij A1.'},
  '2-111':{finding:'Eén activiteit voor de wachttijd noemen volstaat op A1; een compleet reisplan is niet gevraagd.'},
  '2-112':{prompt:'Beschrijf een eenvoudig plan voor dat dagje weg.',finding:'Wat voor dag was erg breed; een kort samenhangend dagplan maakt de A2-taak duidelijk.'},
  '2-113':{context:'Door werkzaamheden kom je met de trein om 14.30 uur aan in plaats van om 14.00 uur.',finding:'Beide aankomsttijden ontbraken. Twee tijden doorgeven is A1; een reisgevolg uitleggen is niet verplicht.'},
  '2-114':{context:'Je kamer ligt aan een drukke straat. Je hoort auto’s rijden en mensen toeteren.',finding:'De geluiden zijn gegeven; kort beschrijven past bij A1 zonder ontbrekende audio.'},
  '2-115':{prompt:'Welke plek wil je die middag bezoeken? Je mag een plek bedenken.',finding:'Een echte stadskaart of reiservaring is niet nodig. Eén plek noemen past bij A1.'},
  '2-116':{context:'Je kunt een geleend boek niet vinden. Je hebt al in je tas en onder je bed gekeken.',finding:'De al doorzochte plekken ontbraken. Een korte opsomming is A1; geen verzonnen zoekgeschiedenis nodig.'},
  '2-117':{prompt:'Welke maten moet je weten? Leg uit waarom.',finding:'De vraag vraagt nu ook waarvoor de maten nodig zijn; dat past bij het A2-doel en de bespreekpunten.'},
  '2-118':{prompt:'Waarvoor heb je de boormachine nodig?',context:'Je wilt een boormachine één middag lenen om een plank op te hangen.',finding:'Apparaat en doel ontbraken. Het doel kort noemen past bij A1; geen instructie voor gebruik gevraagd.'},
  '2-119':{context:'Je vindt een blauwe sporttas met twee zwarte hengsels in het lokaal.',finding:'Er was geen tas of afbeelding. De zichtbare kenmerken staan nu in de situatie; A1-beschrijving zonder verzonnen inhoud.'},
  '2-120':{context:'Bij een geleende fiets voelt de achterband zacht. De voorband voelt stevig.',finding:'Waarneembaar verschil benoemd. Kort beschrijven is A1; een zachte band is niet automatisch lek.'},
  '2-121':{finding:'Twee taken noemen is A1 als geen verdere aanpak of reden gevraagd wordt; beoordeel wel of ze samen kunnen passen.'},
  '2-122':{context:'Een vriend wil afspreken op je drukste dag. Die ochtend werk je, in de middag heb je les en in de avond sport je.',finding:'De drukke dag bevat nu concrete activiteiten die de reden kunnen ondersteunen.'},
  '2-123':{context:'Je les begint voortaan om één uur in plaats van om negen uur. Normaal lunch je om één uur.',finding:'Oude en nieuwe lestijd en de botsende routine zijn gegeven; een eigen aanpassing blijft mogelijk.'},
  '2-124':{finding:'Eén vrijetijdsactiviteit noemen past bij A1; onverwacht vrij zijn maakt de productie niet A2.'},
  '2-125':{prompt:'Wat doe je nu? Wat wil je één week anders doen?',finding:'Huidige en gewenste gewoonte zijn apart gevraagd; verandering is daardoor duidelijk uit te leggen.'},
  '3-001':{prompt:'Vat de situatie samen. Welk probleem kan dit voor de nieuwe wandelaar geven?',finding:'Een gevolg is niet zeker. Kan voorkomt ongegronde conclusies; een korte samenvatting met één mogelijk gevolg past bij A2.'},
  '3-002':{prompt:'Welke reden kan iemand hebben om niet over het gezin te willen vertellen?',finding:'Aarzeling bewijst geen specifieke reden. Een mogelijke reden is expliciet gevraagd; kort toelichten past bij A2.'},
  '3-003':{prompt:'Wat weet je zeker uit deze situatie? Wat weet je nog niet over de twee collega’s?',finding:'Wat betrokkenen zelf weten was niet gegeven. Feiten en ontbrekende kennis zijn nu onderscheiden; voorlopig B1-taakadvies voor die uitleg.'},
  '3-004':{prompt:'Wat weet je zeker? Wat kan de uitleg betekenen voor de nieuwe leden?',finding:'Een verandering zonder beginsituatie was niet te bepalen. De vraag scheidt nu feiten van mogelijke gevolgen; B1 voor de voorzichtige toelichting.'}
 };
 const reviews=Object.fromEntries(rows.split('\n').map(line=>{
  const [key,level,group,goal,help,check]=line.split('|'),[route,n]=key.split('-'),id=`sq-r${route}-circle-${n}`;
  if(!check||!['A1','A2','B1'].includes(level))throw new Error('Onvolledige Vertel-review: '+id);
  const reason=goal+' '+({A1:'Eén of enkele korte gegevens, kenmerken of handelingen volstaan; een samenhangende uitleg is niet vereist.',A2:'De taak vraagt een korte samenhangende uitleg, volgorde, ervaring, plan of reden over een herkenbare situatie.',B1:'De cursist onderscheidt gegeven feiten van ontbrekende kennis of mogelijke gevolgen en licht dit voorzichtig toe; de korte tekst biedt steun.'}[level]);
  return [id,{level,group,goal,help,check,reason,...(edits[key]||{finding:'De situatie en vraag zijn uitvoerbaar; eigen doel, passende hulp en concrete bespreekpunten vastgelegd.'})}];
 }));
 function revise(bank){
  if(bank.bank_id!=='CB-QUICK-014'||bank.source_version!=='2026-09-24.snelvragen.vertel.2')throw new Error('Deze Vertel-review hoort bij de tweede werkset.');
  const guidance=structuredClone(bank.guidance);guidance.sources.quickTellSituationsReviewed={title:'Taalroute · derde beoordeling van 120 bestaande Vertel-vragen',version};
  const items=bank.items.map(item=>{
   const id=item.content_item_id,r=reviews[id];if(!r)return item;
   const context=r.context??item.context,prompt=r.prompt??item.prompt,explanation=r.goal+' '+r.check+' Je mag iets verzinnen of de vraag overslaan.'+(item.model_answer?' Het voorbeeld is één mogelijkheid.':'');
   const result={...item,version,context,prompt,title:r.title??item.title,cefr_level:r.level,difficulty:r.level==='A1'?'basis':'midden',estimated_duration_seconds:{A1:30,A2:45,B1:60}[r.level],practice_group:'quick-direct-'+r.group,learning_goal:r.goal,feedback_correct:explanation,feedback_incorrect:r.help,explanation,level_review:{source_level:item.cefr_level,level:r.level,reason:r.reason},source_ref:{...item.source_ref,review_version:version,changes:{context,prompt,title:r.title??item.title,help:r.help,goal:r.goal,level:r.level}}};
   const example=id+'@'+version;guidance.examples[example]={goal:r.goal,evidence:explanation,source:'quickTellSituationsReviewed'};
   guidance.bindings[id]={item_version:version,bank_id:bank.bank_id,erk:{status:'reviewed',version,source:'quickTellSituationsReviewed',levels:[r.level],skill:'Spreken',goal:r.goal,evidence:r.reason+' Eigen redactioneel advies; geen niveautoets of klasproef.'},bow:{example,criteria:['goal','activate','support','feedback','close']}};
   return result;
  });
  return {...bank,source_version:version,source_sha256:bank.source_sha256+'@'+version,review_scope:'240 directe vragen en de eerste 360 Vertel-vragen afzonderlijk redactioneel beoordeeld. Overige 2021 vragen behouden hun eerdere, beperktere review.',items,guidance};
 }
 const api={version,reviews,revise};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuickTellSituationsReview=api;
})(typeof globalThis!=='undefined'?globalThis:this);
