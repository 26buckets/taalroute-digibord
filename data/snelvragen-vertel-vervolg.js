// Second workset: 120 existing Vertel tasks. Earlier overlays stay exact for saved lessons.
(function(root){
 'use strict';
 const version='2026-09-24.snelvragen.vertel.2';
 // ID suffix | individually chosen level | theme | goal | speaking support | discussion check.
 const rows=`
1-011|A1|thuis|Een favoriete plek thuis met twee kenmerken beschrijven.|Mijn fijne plek is … Die is … en …|Twee kenmerken zijn genoeg, zoals kleur, grootte of hoe de plek voelt.
1-012|A1|thuis|Een activiteit bij thuiskomst noemen.|Als ik thuiskom, …|Eén activiteit is genoeg; een hele avond beschrijven hoeft niet.
1-013|A1|thuis|Spullen op een keukentafel noemen.|Op de tafel staat …|Een korte opsomming past. Een bedachte tafel mag ook.
1-014|A1|thuis|Eén gewenste verandering in een kamer noemen.|Ik wil …|Eén verandering is genoeg. Niets willen veranderen mag ook.
1-015|A1|thuis|Een gewone taak thuis noemen.|Thuis …|Eén taak volstaat; vertel niet verplicht wie thuis verder wat doet.
1-016|A1|eten|Vertellen wat je voor een eenvoudige lunch maakt.|Ik maak …|Een gerecht of korte beschrijving is genoeg; het hoeft geen recept te zijn.
1-017|A1|eten|Een lekkere maaltijd kort beschrijven.|Ik eet graag … Het is …|De naam en één kenmerk zijn genoeg. Het hoeft geen eigen recept te zijn.
1-018|A1|koken|Twee dingen noemen die je voor het koken klaarzet.|Ik zet … en … klaar.|Twee ingrediënten of voorwerpen passen. Je hoeft de bereiding niet uit te leggen.
1-019|A1|eten|Eén handeling met overgebleven eten noemen.|Ik … het eten.|Eén begrijpelijke handeling is genoeg. Geen eten overhouden mag ook.
1-020|A1|koken|Een gerecht voor bezoek noemen.|Voor bezoek maak ik …|Eén gerecht is genoeg. Niet koken of iets anders aanbieden mag ook.
1-021|A1|drinken|Drinken bij twee maaltijden noemen.|Bij het ontbijt … Bij de lunch …|Een antwoord voor beide momenten past. Niets drinken mag ook.
1-022|A1|drinken|Zeggen hoe je koffie of thee graag drinkt.|Ik drink … met … / zonder …|Eén voorkeur is genoeg. Geen koffie of thee drinken mag ook.
1-023|A1|drinken|Een plek noemen om na de les iets te drinken.|Na de les drink ik graag iets …|Eén plek volstaat. Niet ergens iets gaan drinken is ook een antwoord.
1-024|A1|drinken|Drinken noemen dat je meeneemt op een warme dag.|Ik neem … mee.|Eén drankje is genoeg; een reden is niet vereist.
1-025|A1|bezoek|Iets aanbieden aan bezoek.|Ik bied … aan.|Eén aanbod past. Eten of drinken kan allebei.
1-026|A1|winkelen|Drie benodigde boodschappen noemen.|Ik heb …, … en … nodig.|Drie producten zijn genoeg; een echte boodschappenlijst hoeft niet aanwezig te zijn.
1-027|A1|winkelen|Een prettig moment voor boodschappen noemen.|Ik doe graag boodschappen …|Een dag, tijdstip of moment volstaat; geen reden nodig.
1-028|A2|winkelen|Uitleggen hoe je een boodschappenlijst maakt.|Eerst … Daarna …|De handelingen moeten in een begrijpelijke volgorde staan. Een bedachte aanpak mag ook.
1-029|A1|winkelen|Een gewone aankoop bij een vaste winkel noemen.|Daar koop ik meestal …|Eén product is genoeg; het hoeft geen bekende winkelketen te zijn.
1-030|A1|winkelen|Boodschappen in een tas en het bovenste product noemen.|In de tas zit … Bovenop ligt …|Noem de inhoud en wat bovenop ligt. Je hoeft de keuze niet uit te leggen.
1-031|A1|kleding|Kleding voor een feest beschrijven.|Ik draag … en …|Kleding met een kleur of ander kenmerk past. Er is geen verplichte feestkleding.
1-032|A1|kleding|Kleding voor een wandeling noemen.|Voor een wandeling draag ik …|Een kledingstuk of schoeisel volstaat; een reden is niet nodig.
1-033|A1|kleding|Een favoriete jas kort beschrijven.|Mijn jas is …|Eén kenmerk is genoeg. Een bedachte jas mag ook.
1-034|A1|kleding|Vertellen wat je met niet meer gedragen kleding doet.|Ik … die kleding.|Eén handeling volstaat. Bewaren is ook een mogelijk antwoord.
1-035|A1|kleding|Handige kleding voor werk of les noemen.|Op mijn werk / in de les draag ik …|Eén kledingstuk of soort kleding is genoeg. Werk of les mag allebei.
1-036|A2|vervoer|Een route naar de les in twee stappen vertellen.|Eerst … Daarna …|Twee opeenvolgende reisstappen passen. Een bedachte reis mag ook.
1-037|A1|vervoer|Een wachtplek voor de bus beschrijven.|Bij de halte is …|Eén kenmerk of ding bij de halte is genoeg; buservaring is niet nodig.
1-038|A1|reizen|Spullen voor een treinreis noemen.|Voor de treinreis neem ik … mee.|Een korte opsomming is genoeg; een echte reis plannen hoeft niet.
1-039|A1|vervoer|Een moment noemen waarop je liever loopt dan fietst.|Ik loop liever bij …|Eén moment of omstandigheid past. Altijd lopen of niet fietsen mag ook.
1-040|A1|buurt|Een drukke straat kort beschrijven.|In die straat is … / zijn …|Eén kenmerk van de straat is genoeg. Een bedachte straat mag ook.
1-041|A1|dag|Een handeling aan het begin van de ochtend noemen.|In de ochtend …|Eén handeling is genoeg. Het voorbeeld noemt er twee, maar dat hoeft niet.
1-042|A1|les|Eén activiteit vóór de les noemen.|Voor de les …|Eén activiteit past; geen hele dagindeling nodig.
1-043|A1|vrije-tijd|Een activiteit op een vrije middag noemen.|Op een vrije middag …|Eén activiteit is genoeg. Een vrije middag bedenken mag ook.
1-044|A1|dag|Twee plannen voor deze week noemen.|Deze week wil ik … en …|Twee activiteiten volstaan; een vast tijdstip of reden is niet vereist.
1-045|A1|lezen|Een prettig moment om te lezen noemen.|Ik lees graag …|Een moment is genoeg. Niet graag lezen mag ook.
1-046|A1|weer|Een activiteit voor een regenachtige dag noemen.|Dan …|Eén activiteit is genoeg. Binnenblijven is niet verplicht.
1-047|A1|weer|Prettig fietsweer beschrijven.|Ik fiets graag als het … is.|Eén kenmerk van het weer is genoeg. Wie niet fietst, mag het bedenken.
1-048|A1|weer|Iets noemen dat je bij koud weer meeneemt.|Als het koud is, neem ik … mee.|Eén voorwerp of kledingstuk is voldoende; uitleg is niet nodig.
1-049|A2|weer|Een oorspronkelijk plan en een wijziging door sneeuw vertellen.|Ik wilde … Nu …|Het oude en het nieuwe plan moeten duidelijk zijn. Je mag ook uitleggen dat je niets verandert.
1-050|A1|buiten|Iets buiten op een zonnige dag beschrijven.|Op een zonnige dag zie ik …|Eén ding met een kenmerk is genoeg. Het hoeft nu niet zonnig te zijn.
1-051|A1|werk|Werk noemen dat je graag wilt proberen.|Ik wil graag …|Een beroep of taak is genoeg; werkervaring en een reden zijn niet verplicht.
1-052|A1|werk|Een werkplek met twee kenmerken beschrijven.|De werkplek is … en …|Twee kenmerken zijn genoeg. Een bedachte werkplek mag ook.
1-053|A1|werk|Een eerste handeling op een werkdag noemen.|Aan het begin van mijn werkdag …|Eén handeling is genoeg. Je mag een werkdag bedenken.
1-054|A1|werk|Een taak noemen die je graag samen doet.|Ik doe graag samen …|Eén taak volstaat; een echte baan of collega is niet nodig.
1-055|A1|pauze|Een activiteit in een werkpauze noemen.|In de pauze …|Eén activiteit is voldoende. Je mag een werkpauze bedenken.
1-056|A2|vrije-tijd|Vertellen wat je gisteren in je vrije tijd deed.|Gisteren heb ik … / was ik …|Het antwoord gaat over gisteren. Eén of enkele activiteiten passen; de volgorde mag helpen.
1-057|A1|vrije-tijd|Een hobby met weinig spullen kort beschrijven.|Ik … Daarvoor heb ik … nodig.|Een activiteit en een klein aantal spullen passen; geen uitgebreide uitleg nodig.
1-058|A1|contact|Een gezamenlijke activiteit met een vriend noemen.|Samen …|Eén activiteit is genoeg. Een bedacht persoon mag ook.
1-059|A1|vrije-tijd|Iets leuks aan een nieuwe hobby noemen.|Ik vind … leuk.|Eén prettig onderdeel is genoeg. Je mag een hobby bedenken die je nog niet hebt geprobeerd.
1-060|A1|vrije-tijd|Een fijne vrije zondag kort beschrijven.|Op een fijne zondag …|Enkele korte gegevens over de dag passen; een lang verhaal is niet nodig.
1-061|A1|buurt|Twee vaak bezochte plekken in de buurt noemen.|Ik ga vaak naar … en …|Twee plekken zijn genoeg. Een bedachte buurt mag ook.
1-062|A1|buurt|Een prettige straat kort beschrijven.|Die straat is …|Eén kenmerk is voldoende; een bedachte straat mag ook.
1-063|A1|contact|Een prettig kenmerk van een buur noemen.|Mijn buur is … / doet …|Eén kenmerk of handeling is genoeg. Je mag een buur bedenken.
1-064|A2|buurt|Een looproute van huis naar een winkel uitleggen.|Eerst loop ik … Daarna …|De route heeft een begrijpelijke volgorde. Een bedachte route mag; een echt adres is niet nodig.
1-065|A1|zitten|Een zitplek voor kinderen en volwassenen beschrijven.|Op die plek is … / zijn …|Een korte beschrijving van een gezamenlijke zitplek past; een eigen ontwerp is niet nodig.
1-066|A1|bezoek|Een voorbereiding voor bezoek noemen.|Voordat het bezoek komt, …|Eén handeling volstaat. Het voorbeeld noemt er twee, maar dat is niet verplicht.
1-067|A1|bezoek|Iets aanbieden aan iemand die net binnenkomt.|Ik bied … aan.|Eén passend aanbod is genoeg; er is geen vast bezoekritueel.
1-068|A1|bezoek|Een gezamenlijke activiteit binnen noemen.|Binnen kunnen we …|Eén activiteit binnenshuis past; een reden is niet nodig.
1-069|A1|bezoek|Een handeling noemen om bezoek prettig te ontvangen.|Ik …|Eén vriendelijke handeling is genoeg. Er is geen vaste regel voor goed bezoek ontvangen.
1-070|A1|bezoek|Iets noemen dat je na bezoek opruimt.|Na het bezoek ruim ik … op.|Eén ding is voldoende. Niets opruimen mag ook.
1-071|A1|telefoon|Twee handelingen op een telefoon noemen.|Op mijn telefoon … en …|Twee handelingen passen. Wie geen telefoon gebruikt, mag ze bedenken.
1-072|A2|telefoon|Uitleggen hoe je een foto met iemand deelt.|Eerst … Daarna …|De stappen moeten begrijpelijk zijn. Er zijn verschillende manieren; één bepaalde app is niet verplicht.
1-073|A1|telefoon|Een moment noemen waarop je geen telefoon gebruikt.|Ik gebruik mijn telefoon niet …|Eén moment of plek is genoeg. Geen telefoon hebben mag ook.
1-074|A1|telefoon|Zeggen wat je doet bij een bijna lege batterij.|Als de batterij bijna leeg is, …|Eén passende handeling is genoeg; een telefoon uitzetten mag ook.
1-076|A1|lezen|Een soort boek noemen dat je graag leest.|Ik lees graag …|Een soort boek of onderwerp is voldoende. Niet lezen mag ook.
1-077|A1|lezen|Een prettige leesplek beschrijven.|Op die plek is …|Eén kenmerk is genoeg. Een bedachte plek mag ook.
1-078|A1|lezen|Een andere bibliotheekactiviteit dan boeken lenen noemen.|In de bibliotheek …|Noem een andere activiteit. Wie nooit in een bibliotheek komt, mag het bedenken.
1-079|A1|lezen|Een handeling bij een moeilijk boek noemen.|Als een boek moeilijk is, …|Eén handeling is genoeg. Stoppen of hulp vragen mag allebei.
1-080|A1|lezen|Vertellen hoe je een geleend boek netjes houdt.|Ik … het boek.|Eén handeling of bewaarplek is voldoende; een uitgebreide aanpak hoeft niet.
1-081|A1|rust|Een activiteit voor een rustige start van de dag noemen.|In de ochtend …|Eén activiteit is genoeg. Het bronvoorbeeld noemt er twee, maar is geen vaste routine.
1-082|A1|rust|Iets noemen dat helpt na een drukke les.|Na een drukke les …|Eén activiteit of behoefte past; persoonlijke uitleg is niet verplicht.
1-083|A1|rust|Een prettig rustmoment beschrijven.|Dan ben ik … / doe ik …|Eén of enkele korte gegevens zijn genoeg; het moment mag bedacht zijn.
1-084|A1|pauze|Een gewoon pauzemoment noemen.|Ik neem meestal pauze …|Een tijdstip of moment is voldoende; een vaste pauze is niet nodig.
1-085|A1|rust|Iets noemen dat helpt om goed te slapen.|Om goed te slapen heb ik … nodig.|Eén ding is genoeg. Je hoeft geen persoonlijke klachten te bespreken.
1-086|A1|post|Een korte boodschap op een kaart aan een vriend geven.|Op de kaart schrijf ik: …|Een groet of korte boodschap past. Je hoeft de tekst niet met dat te vertellen.
1-087|A2|cadeau|Uitleggen hoe je een klein cadeau inpakt.|Eerst … Daarna …|Een begrijpelijke volgorde past. Er is geen verplichte manier of materiaal.
1-088|A1|post|Een bewaarplek voor belangrijke brieven noemen.|Ik bewaar die brieven …|Eén plek is genoeg. Je mag een plek bedenken.
1-089|A1|post|Een handeling met verkeerd bezorgde post noemen.|Ik … de brief.|Een begrijpelijke reactie past; vraag niet naar de inhoud van de brief.
1-090|A1|post|Een handige plek voor pakketjes beschrijven.|Die plek is …|Eén plek met een kenmerk is voldoende. Een bedachte plek mag ook.
1-091|A1|geld|Een manier noemen om boodschappen te betalen.|Ik betaal met …|Eén betaalwijze is genoeg; een reden of bedrag is niet nodig.
1-092|A1|geld|Een handeling met een kassabon noemen.|Ik … de kassabon.|Eén handeling volstaat. Geen kassabon meenemen mag ook.
1-093|A1|geld|Iets leuks en goedkoops kort beschrijven.|Ik … Dat kost weinig.|Een korte beschrijving past; een exacte prijs is niet nodig.
1-094|A1|geld|Een doel noemen waarvoor je geld bewaart.|Ik bewaar geld voor …|Eén doel is genoeg. Geen geld kunnen of willen bewaren mag ook.
1-095|A1|geld|Een moment noemen waarop je prijzen vergelijkt.|Ik vergelijk prijzen als ik … koop.|Eén soort aankoop of moment is genoeg; de werkwijze uitleggen is niet gevraagd.
1-096|A1|schoonmaken|De eerste schoonmaaktaak noemen.|Eerst …|Eén taak is genoeg; een reden is niet vereist.
1-097|A1|schoonmaken|De tafel na het eten kort beschrijven.|Na het eten is de tafel …|Eén kenmerk of korte beschrijving past; geen hele schoonmaakvolgorde nodig.
1-098|A1|schoonmaken|Een handeling vóór het stofzuigen noemen.|Voor het stofzuigen …|Eén handeling is genoeg. Een bedachte aanpak mag ook.
1-099|A1|schoonmaken|Een handeling met lege verpakkingen noemen.|Ik … de lege verpakkingen.|Eén handeling volstaat. Bespreek begrijpelijk taalgebruik, geen plaatselijke afvalregels.
1-100|A2|schoonmaken|Vertellen wat je in volgorde met schone was doet.|Eerst … Daarna …|De volgorde moet te volgen zijn. Verschillende manieren zijn mogelijk.
1-101|A1|dieren|Een dier en een plek noemen waar je het graag ziet.|Ik zie graag … in …|Een dier en een plek volstaan. Het hoeft geen huisdier te zijn.
1-102|A1|natuur|Een mooie plant kort beschrijven.|De plant heeft … / is …|Eén kenmerk is genoeg; de naam van de plant kennen hoeft niet.
1-103|A1|buiten|Iets noemen dat je buiten tijdens een wandeling ziet.|Tijdens een wandeling zie ik …|Eén ding is voldoende. De wandeling mag bedacht zijn.
1-104|A1|natuur|Een gewenste activiteit in een tuin noemen.|In een tuin wil ik graag …|Eén activiteit is genoeg. Een eigen tuin hebben is niet nodig.
1-105|A1|natuur|Een rustige plek in de natuur beschrijven.|Op die plek is …|Eén of enkele kenmerken passen. Je mag de plek bedenken.
1-106|A2|feest|Vertellen hoe je een kleine verjaardag voorbereidt.|Ik … en …|Enkele concrete voorbereidingen passen. Het aantal gasten uit het voorbeeld is niet verplicht.
1-107|A1|cadeau|Een cadeau kort beschrijven.|Het cadeau is …|Een cadeau met één kenmerk is genoeg; een echte aankoop is niet nodig.
1-108|A1|feest|Iets noemen dat een feest gezellig maakt.|Ik vind … gezellig.|Eén ding is genoeg; er is geen vaste manier om feest te vieren.
1-109|A1|feest|Een eenvoudige manier noemen om een ruimte te versieren.|Ik versier de ruimte met …|Eén manier is voldoende. Je hoeft geen stappenplan te geven.
1-110|A1|feest|Iets noemen dat je na een feest opruimt.|Na het feest ruim ik … op.|Eén ding is genoeg; de volgorde van opruimen is niet gevraagd.
1-111|A1|reizen|Het eerste voorwerp in je koffer noemen.|Eerst stop ik … in mijn koffer.|Eén ding volstaat. Een bedachte koffer mag ook.
1-112|A1|reizen|Een plek voor een dagje weg beschrijven.|Die plek is …|Een plek met één kenmerk is genoeg; reiservaring is niet nodig.
1-113|A2|reizen|Vertellen hoe je een korte reis voorbereidt.|Voor de reis … Daarna …|Enkele begrijpelijke voorbereidingen passen. Je mag een reis bedenken.
1-114|A1|reizen|Een activiteit op een nieuwe plek noemen.|Op een nieuwe plek …|Eén activiteit is genoeg. Het mag een bedachte plek zijn.
1-115|A1|reizen|Een fijne kamer om te slapen beschrijven.|De kamer heeft … / is …|Eén of enkele kenmerken passen; een echte boeking is niet nodig.
1-116|A1|spullen|Een handig voorwerp in een tas beschrijven.|In mijn tas zit … Het is …|Een voorwerp en één kenmerk zijn genoeg; je hoeft de handigheid niet uitgebreid uit te leggen.
1-117|A1|spullen|Een belangrijk voorwerp bij vertrek noemen.|Als ik wegga, neem ik … mee.|Eén ding is genoeg; je mag het bedenken.
1-118|A1|zitten|Een fijne stoel kort beschrijven.|De stoel is …|Eén kenmerk is voldoende; een echte stoel hoeft niet zichtbaar te zijn.
1-119|A1|spullen|Een manier noemen om belangrijke spullen te bewaren.|Ik bewaar die spullen …|Eén plek of manier is genoeg. Een echte bewaarplek hoef je niet te delen.
1-120|A1|spullen|Een voorwerp noemen dat je uitleent.|Ik leen … uit.|Eén ding volstaat. Niets uitlenen mag ook; lenen en uitlenen betekenen niet hetzelfde.
1-121|A1|dag|Een activiteit op een drukke ochtend noemen.|Op een drukke ochtend …|Eén activiteit is genoeg. Het voorbeeld geeft twee mogelijkheden.
1-122|A2|dag|Uitleggen hoe je je week plant.|Eerst kijk ik … Daarna …|Een korte uitleg met samenhangende handelingen past. Geen echte agenda nodig.
1-123|A1|rust|Een fijn moment aan het einde van de dag beschrijven.|Aan het einde van de dag …|Enkele korte gegevens passen; je mag een prettig moment bedenken.
1-124|A1|dag|Een verschil tussen een gewone en een vrije dag noemen.|Gewoonlijk … Op een vrije dag …|Eén duidelijk verschil is genoeg; een hele vergelijking hoeft niet.
1-125|A1|vrije-tijd|Een nieuwe activiteit voor deze week noemen.|Deze week wil ik voor het eerst …|Eén activiteit is genoeg; het mag een wens zijn zonder vast plan.
2-001|A1|buiten|Een favoriete buitenactiviteit noemen bij een kennismaking.|Ik … graag buiten.|Eén activiteit is genoeg; een reden of verhaal is niet gevraagd.
2-002|A2|vrije-tijd|Kort vertellen hoe je met een hobby begon.|Ik begon … Toen …|Het begin van de hobby moet duidelijk zijn. Je mag het verhaal bedenken.
2-003|A1|buurt|Een bruikbare plek in de buurt noemen en kort beschrijven.|Er is een … Daar kun je …|Een plek en wat je daar kunt doen volstaan; een uitgebreide uitleg is niet nodig.
2-004|A2|les|De gebruikelijke volgorde van een les vertellen.|Eerst … Daarna … Aan het einde …|Vertel de les in een begrijpelijke volgorde; je mag een les bedenken.
2-005|A2|contact|Kort vertellen over wat je de laatste tijd hebt gedaan.|De laatste tijd heb ik …|Een korte beschrijving van recente activiteiten past; persoonlijke details zijn niet verplicht.
2-006|A2|les|Een reden geven voor afwezigheid bij een eerdere les.|Ik kon niet komen, want …|De reden moet bij gisteren passen. Je mag een reden bedenken zonder iets persoonlijks te delen.
`.trim();
 const edits={
  '1-011':{prompt:'Welke plek thuis vind je fijn? Noem twee kenmerken van die plek.',finding:'Favoriete plek en twee kenmerken zijn als twee duidelijke stappen gevraagd.'},
  '1-013':{prompt:'Wat staat er op je keukentafel? Noem een paar dingen.',finding:'Beschrijf kon onnodig veel uitleg suggereren; een korte opsomming is nu duidelijk.'},
  '1-017':{prompt:'Denk aan een lekkere maaltijd. Beschrijf die maaltijd kort.',finding:'Dezelfde beschrijving met een korte instructie zonder betrekkelijke bijzin.'},
  '1-019':{context:'Na het eten is er nog eten over.',prompt:'Wat doe je met dat eten?',finding:'Overblijven is in een concrete situatie uitgelegd; de verwijzing is compleet.'},
  '1-024':{prompt:'Wat neem je te drinken mee op een warme dag?',finding:'Te drinken sluit de vraag aan op het onderwerp Drinken; anders kon het ook over kleding gaan.'},
  '1-026':{context:'Je gaat boodschappen doen.',finding:'De drie benodigde dingen zijn nu duidelijk boodschappen, zonder verborgen lijstje.'},
  '1-028':{prompt:'Hoe maak je een boodschappenlijst? Vertel wat je eerst doet en wat daarna.',finding:'De werkwijze is expliciet; een lijstje met producten alleen beantwoordt de vraag niet.'},
  '1-029':{context:'Je gaat vaak naar dezelfde winkel.',prompt:'Wat koop je daar meestal?',finding:'Dezelfde winkel had geen eerdere verwijzing. Die is nu in de situatie gegeven.'},
  '1-030':{context:'Je doet boodschappen in een tas.',prompt:'Wat zit er in de tas? Wat ligt bovenop?',finding:'De tas en de inhoud hebben nu een duidelijke situatie; beide gevraagde gegevens zijn zichtbaar.'},
  '1-031':{prompt:'Welke kleding kies je voor een feest? Beschrijf die kleding kort.',finding:'De beschrijfopdracht staat los van de keuze, zonder lange bijzin.'},
  '1-033':{prompt:'Denk aan een jas die je graag draagt. Beschrijf de jas kort.',finding:'Duidelijk dat een korte beschrijving genoeg is; een jas hoeft niet aanwezig te zijn.'},
  '1-034':{context:'Je draagt sommige kleding niet meer.',prompt:'Wat doe je met die kleding?',finding:'De voorwaarde is een losse situatie geworden; weggeven is niet verplicht.'},
  '1-036':{prompt:'Hoe ga je naar de les? Vertel wat je eerst doet en wat daarna.',finding:'Route in twee stappen is uitgelegd met eerst en daarna; geen plattegrond nodig.'},
  '1-037':{prompt:'Denk aan een plek om op de bus te wachten. Beschrijf die plek kort.',finding:'Eigen busgebruik of een zichtbare halte is geen voorwaarde.'},
  '1-040':{prompt:'Denk aan een drukke straat in je buurt. Beschrijf die straat kort.',finding:'De straat mag bedacht worden en hoeft niet op het bord te staan.'},
  '1-041':{finding:'Het begin van een ochtend vraagt één korte handeling; A2 was hoger dan de gevraagde productie. Het langere voorbeeld is niet de minimumeis.'},
  '1-047':{prompt:'Bij welk weer fiets je graag?',finding:'De omslachtige beschrijving is een directe vraag geworden; één weerkenmerk volstaat.'},
  '1-049':{context:'Het sneeuwt.',prompt:'Wat wilde je doen? Wat doe je nu?',finding:'Een verandering is pas te bespreken als oud en nieuw plan allebei genoemd zijn; beide vragen staan er nu.'},
  '1-050':{context:'Denk aan een zonnige dag.',prompt:'Wat zie je buiten? Beschrijf één ding.',finding:'Het hoeft nu niet zonnig te zijn; de beschrijving is begrensd tot één ding.'},
  '1-051':{prompt:'Welk werk wil je graag proberen?',model_answer:'Ik wil in een winkel werken.',finding:'Zou proberen vereenvoudigd; de ongevraagde reden is uit het voorbeeld gehaald. Een beroep of taak volstaat op A1.'},
  '1-052':{prompt:'Denk aan een werkplek. Noem twee kenmerken van die plek.',finding:'Een eigen baan of zichtbare werkplek is niet nodig; twee kenmerken blijven gevraagd.'},
  '1-053':{prompt:'Wat doe je aan het begin van een werkdag? Je mag het bedenken.',finding:'Dezelfde eerste werkhandeling, ook uitvoerbaar zonder eigen baan.'},
  '1-054':{prompt:'Welke taak doe je graag samen?',finding:'Directe vraag met dezelfde betekenis; geen reden toegevoegd.'},
  '1-057':{prompt:'Noem een hobby met weinig spullen. Wat doe je? Wat heb je nodig?',finding:'De beschrijving is verdeeld over activiteit en spullen; korte antwoorden zijn genoeg.'},
  '1-059':{prompt:'Denk aan een nieuwe hobby. Wat vind je daar leuk aan?',finding:'Je hoeft niet toevallig net met een hobby begonnen te zijn.'},
  '1-061':{prompt:'Naar welke twee plekken in je buurt ga je vaak?',finding:'Plekken gebruiken is vervangen door het bedoelde bezoeken; beide plekken blijven gevraagd.'},
  '1-062':{prompt:'Denk aan een fijne straat in je buurt. Beschrijf die straat kort.',finding:'De beschrijving is kort en kan zonder afbeelding.'},
  '1-065':{prompt:'Denk aan een plek waar kinderen en volwassenen samen kunnen zitten. Beschrijf die plek kort.',finding:'Samen zitten maakt de bedoelde gedeelde plek duidelijk; er hoeft niets ontworpen te worden.'},
  '1-066':{context:'Er komt bezoek bij je thuis.',prompt:'Wat doe je voordat het bezoek komt?',finding:'Het bronvoorbeeld noemde opruimen én klaarzetten, terwijl de vraag alleen spullen vroeg. De voorbereiding sluit nu aan; één handeling past bij A1.'},
  '1-067':{context:'Iemand komt bij je binnen.',prompt:'Wat bied je aan?',finding:'De binnenkomst staat als losse situatie; de reactie kan kort blijven.'},
  '1-068':{prompt:'Wat kun je samen binnen doen?',finding:'Zonder naar buiten te gaan is verkort tot binnen; dezelfde activiteit blijft gevraagd.'},
  '1-069':{prompt:'Wat kun je doen om bezoek prettig te ontvangen?',finding:'Gastheer of gastvrouw is vervangen door de handeling. Eén vriendelijke handeling is genoeg voor A1; geen brede beoordeling van gastvrijheid.'},
  '1-070':{context:'Het bezoek is weer weg.',prompt:'Wat ruim je op?',finding:'Na het vertrek van bezoek is vereenvoudigd tot een concrete situatie.'},
  '1-072':{prompt:'Hoe deel je een foto met iemand? Vertel wat je eerst doet en wat daarna.',finding:'De gevraagde werkwijze is zichtbaar; geen toegang tot een bepaalde app nodig.'},
  '1-074':{context:'De batterij van je telefoon is bijna leeg.',prompt:'Wat doe je?',finding:'De batterij is expliciet die van de telefoon; situatie en vraag zijn gescheiden.'},
  '1-077':{prompt:'Denk aan een fijne plek om te lezen. Beschrijf die plek kort.',finding:'De leestaak vraagt één kenmerk, geen ingewikkelde omschrijving.'},
  '1-078':{prompt:'Wat kun je in de bibliotheek doen, behalve boeken lenen?',finding:'Eigen bibliotheekervaring is niet langer noodzakelijk; mogelijke activiteiten zijn ook goed.'},
  '1-079':{context:'Je leest een boek. Je vindt het moeilijk.',prompt:'Wat doe je?',finding:'De moeilijke tekst is een concrete situatie; er is geen ontbrekend boekfragment nodig.'},
  '1-080':{prompt:'Je hebt een boek geleend. Hoe houd je het boek netjes?',finding:'Geleend boek wordt uitgelegd in een losse zin. Eén handeling of plek volstaat, dus A1 in plaats van A2.'},
  '1-081':{title:'Hoe voel je je?',finding:'Welbevinden vervangen door bekende woorden; de gewone ochtendactiviteit blijft behouden.'},
  '1-082':{title:'Hoe voel je je?',finding:'Welbevinden vervangen; de vraag vraagt één concrete hulp of activiteit.'},
  '1-083':{title:'Hoe voel je je?',prompt:'Denk aan een fijn, rustig moment. Vertel daar kort iets over.',finding:'Prettig moment van rust is eenvoudiger verwoord; een korte beschrijving blijft het doel.'},
  '1-084':{title:'Hoe voel je je?',finding:'Alleen het moeilijke label veranderd; de vraag naar een pauzemoment is compleet.'},
  '1-085':{title:'Hoe voel je je?',prompt:'Wat heb je nodig om goed te slapen?',finding:'Fijne nachtrust vereenvoudigd zonder naar persoonlijke slaapproblemen te vragen.'},
  '1-086':{prompt:'Wat schrijf je op een kaart aan een vriend?',model_answer:'Ik denk aan je. Hoe gaat het?',finding:'Het voorbeeld is nu de kaarttekst zelf in plaats van een onnodige dat-bijzin. Een korte groet of boodschap past bij A1.'},
  '1-087':{prompt:'Hoe pak je een klein cadeau in? Vertel wat je eerst doet en wat daarna.',finding:'De volgorde is expliciet gemaakt; alleen materiaal noemen is niet hetzelfde als inpakken uitleggen.'},
  '1-089':{context:'Je krijgt een brief die voor je buur is.',prompt:'Wat doe je met die brief?',finding:'De post is concreet als verkeerd bezorgde brief aangeboden; persoonlijke inhoud is niet nodig.'},
  '1-090':{prompt:'Denk aan een handige plek voor pakketjes. Beschrijf die plek kort.',finding:'De plek mag worden bedacht; er is geen ontbrekende bezorgsituatie nodig.'},
  '1-093':{prompt:'Noem iets leuks dat weinig geld kost. Vertel er kort iets over.',finding:'Eerst noemen en dan kort beschrijven maakt de omvang duidelijk; geen actuele prijskennis nodig.'},
  '1-095':{finding:'Wanneer vraagt een moment of aankoop, niet een uitleg van vergelijken. Daarom A1; prijzen vergelijken als proces is hier niet vereist.'},
  '1-096':{model_answer:'Ik ruim eerst de tafel op.',finding:'De ongevraagde reden is uit het voorbeeld gehaald. De eerste taak noemen is A1; een volledig schoonmaakplan is niet gevraagd.'},
  '1-097':{prompt:'Hoe ziet de tafel eruit als je klaar bent met eten en opruimen?',finding:'Achterlaten verduidelijkt; een korte beschrijving van de tafel past bij A1, geen werkwijze gevraagd.'},
  '1-098':{finding:'De vraag vraagt één handeling vóór het stofzuigen; volgorde uitleggen of een reden geven is niet vereist. Advies A1.'},
  '1-100':{prompt:'Wat doe je met schone was? Vertel wat je eerst doet en wat daarna.',finding:'Routine is vervangen door een concrete volgordevraag over de schone was.'},
  '1-102':{prompt:'Denk aan een mooie plant. Beschrijf die plant kort.',finding:'Een plantnaam of een zichtbare plant is niet nodig; één kenmerk past.'},
  '1-103':{prompt:'Wat zie je buiten tijdens een wandeling?',finding:'Opmerkt vereenvoudigd tot ziet; dezelfde waarneming blijft gevraagd.'},
  '1-104':{prompt:'Wat wil je graag in een tuin doen?',finding:'Zou doen is vereenvoudigd; de taak vraagt een voorkeur en geen oefening met zouden.'},
  '1-105':{prompt:'Denk aan een rustige plek in de natuur. Beschrijf die plek kort.',finding:'Er is geen afbeelding nodig; de plek mag bedacht zijn.'},
  '1-106':{prompt:'Hoe bereid je een kleine verjaardag voor?',finding:'Organiseren is vervangen door voorbereiden; het voorbeeld noemt passende voorbereidingen.'},
  '1-107':{prompt:'Denk aan een cadeau dat je graag geeft. Beschrijf het kort.',finding:'De omvang is duidelijk; een echt cadeau meenemen is niet nodig.'},
  '1-109':{finding:'Eén manier of versiering noemen beantwoordt deze vraag; een stappenplan is niet vereist. Daarom A1.'},
  '1-110':{prompt:'Wat ruim je na een feest op? Noem een paar dingen.',finding:'De gevraagde spullen zijn expliciet. Een korte opsomming is A1, geen A2-verhaal.'},
  '1-112':{prompt:'Denk aan een plek waar je graag een dag bent. Beschrijf die plek kort.',finding:'Een dag doorbrengen vereenvoudigd; de beschrijving blijft kort.'},
  '1-113':{prompt:'Hoe bereid je een korte reis voor? Noem een paar dingen die je doet.',finding:'De gevraagde voorbereiding is concreter begrensd; alleen een bestemming noemen is onvoldoende.'},
  '1-115':{prompt:'Beschrijf een fijne kamer om in te slapen.',finding:'Overnachten vervangen door de bekende woorden in een kamer slapen.'},
  '1-118':{prompt:'Denk aan een fijne stoel. Beschrijf die stoel kort.',finding:'De beschrijving is zonder een betrekkelijke bijzin gevraagd; geen zichtbare stoel nodig.'},
  '1-119':{finding:'Eén manier of bewaarplek is een passend antwoord; geen uitgebreid systeem of onderbouwing gevraagd. Advies A1.'},
  '1-122':{prompt:'Hoe plan je je week? Vertel wat je eerst doet en wat daarna.',finding:'De werkwijze is duidelijk gevraagd; het noemen van één afspraak alleen is niet genoeg.'},
  '1-123':{prompt:'Denk aan een fijn moment aan het einde van de dag. Vertel daar kort iets over.',finding:'De beschrijving is kort en mag bedacht zijn.'},
  '1-124':{prompt:'Wat doe je op een vrije dag anders dan op een gewone dag?',finding:'Anders krijgt een duidelijke vergelijking met een gewone dag.'},
  '2-001':{finding:'De wandelgroep is alleen de situatie. De vraag zelf vraagt één buitenactiviteit; geen reden of langer verhaal. Daarom A1 in plaats van het routegebonden A2.'},
  '2-002':{context:'Je ontmoet iemand. Jullie hebben dezelfde hobby.',finding:'Dezelfde inhoud in twee korte zinnen; het vertellen over het begin van de hobby blijft A2.'},
  '2-003':{context:'Er woont een nieuwe buur in de straat. Die kent de buurt nog niet.',prompt:'Noem een handige plek in de buurt. Wat kun je daar doen?',finding:'De nieuwe buur en benodigde informatie zijn duidelijk. Een plek plus één gebruik past bij A1; geen uitgebreide uitleg gevraagd.'},
  '2-004':{context:'Er komen drie nieuwe cursisten in je klas.',prompt:'Wat doen jullie meestal in een les? Vertel wat eerst komt en wat daarna.',finding:'Je oude klas was onduidelijk; de cursist zit nu in de genoemde klas. De lesvolgorde blijft A2.'},
  '2-005':{context:'Je komt iemand tegen. Jullie hebben elkaar lang niet gezien.',finding:'Lang niet zag is natuurlijker en duidelijker geformuleerd; een kort recent verhaal blijft A2.'},
  '2-006':{prompt:'Waarom kon je gisteren niet naar de les komen? Je mag een reden bedenken.',finding:'Een directe waaromvraag maakt de gevraagde reden duidelijk; persoonlijke uitleg is niet verplicht.'}
 };
 const reviews=Object.fromEntries(rows.split('\n').map(line=>{
  const [key,level,group,goal,help,check]=line.split('|'),[route,n]=key.split('-'),id=`sq-r${route}-circle-${n}`;
  if(!check||!['A1','A2'].includes(level))throw new Error('Onvolledige Vertel-review: '+id);
  const reason=goal+(level==='A1'?' Eén of enkele korte gegevens, kenmerken of handelingen over een vertrouwde situatie volstaan; een samenhangende uitleg is niet vereist.':' De taak vraagt een korte samenhangende uitleg, volgorde, ervaring of reden over een vertrouwde situatie.');
  return [id,{level,group,goal,help,check,reason,...(edits[key]||{finding:'De vraag en het eventuele bronvoorbeeld passen. Een eigen doel, gerichte hulp en de vereiste omvang zijn nu vastgelegd.'})}];
 }));
 function revise(bank){
  if(bank.bank_id!=='CB-QUICK-014'||bank.source_version!=='2026-09-24.snelvragen.vertel.1')throw new Error('Deze Vertel-review hoort bij de eerste Vertel-werkset.');
  const guidance=structuredClone(bank.guidance);guidance.sources.quickTellNextReviewed={title:'Taalroute · tweede beoordeling van 120 bestaande Vertel-vragen',version};
  const items=bank.items.map(item=>{
   const id=item.content_item_id,r=reviews[id];if(!r)return item;
   const context=r.context??item.context,prompt=r.prompt??item.prompt,model=r.model_answer??item.model_answer;
   const explanation=r.goal+' '+r.check+' Je mag iets verzinnen of de vraag overslaan.'+(model?' Het voorbeeld is één mogelijkheid.':'');
   const result={...item,version,context,prompt,title:r.title??item.title,model_answer:model,cefr_level:r.level,difficulty:r.level==='A1'?'basis':'midden',estimated_duration_seconds:r.level==='A1'?30:45,practice_group:'quick-direct-'+r.group,learning_goal:r.goal,feedback_correct:explanation,feedback_incorrect:r.help,explanation,level_review:{source_level:item.cefr_level,level:r.level,reason:r.reason},source_ref:{...item.source_ref,review_version:version,changes:{context,prompt,title:r.title??item.title,model_answer:model,help:r.help,goal:r.goal,level:r.level}}};
   const example=id+'@'+version;guidance.examples[example]={goal:r.goal,evidence:explanation,source:'quickTellNextReviewed'};
   guidance.bindings[id]={item_version:version,bank_id:bank.bank_id,erk:{status:'reviewed',version,source:'quickTellNextReviewed',levels:[r.level],skill:'Spreken',goal:r.goal,evidence:r.reason+' Eigen redactioneel advies; geen niveautoets of klasproef.'},bow:{example,criteria:['goal','activate','support','feedback','close']}};
   return result;
  });
  return {...bank,source_version:version,source_sha256:bank.source_sha256+'@'+version,review_scope:'240 directe vragen en de eerste 240 Vertel-vragen afzonderlijk redactioneel beoordeeld. Overige 2141 vragen behouden hun eerdere, beperktere review.',items,guidance};
 }
 const api={version,reviews,revise};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuickTellNextReview=api;
})(typeof globalThis!=='undefined'?globalThis:this);
