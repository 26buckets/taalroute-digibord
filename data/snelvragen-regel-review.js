// First 120 existing request/offer tasks. Sources and saved lessons remain unchanged.
(function(root){
 'use strict';
 const version='2026-09-24.snelvragen.regel.1';
 // Source ID | spread group | situation override | instruction override | goal | help | discussion.
 const rows=`
r0-001|kennismaken|Een paar mensen zitten aan een tafel. Je wilt kennismaken.||Bij een groep komen zitten.|Mag ik …?|De cursist vraagt of die erbij mag zitten. Begroeten mag, maar is niet verplicht.
r0-002|kennismaken|Iemand zegt hoe die heet. Je verstaat de naam niet.|Vraag of die persoon de naam nog een keer wil zeggen.|Een naam opnieuw laten zeggen.|Kun je je naam …?|Het verzoek gaat over herhalen. De cursist hoeft geen niet-gegeven naam te raden.
r0-004|kennismaken|Je praat met iemand en wilt naar huis.||Kort afscheid nemen.|Ik ga …|De ander begrijpt dat de cursist vertrekt. Een reden is niet nodig.
r0-005|kennismaken|Bij de les staat je naam verkeerd op de lijst. De docent heeft de lijst.|Vraag de docent je naam op de lijst te verbeteren.|Een geschreven naam laten verbeteren.|Kun je mijn naam …?|De cursist vraagt om verbetering. Een verzonnen naam mag; de juiste spelling noemen is extra.
r0-007|les|||Om langzamer spreken vragen.|Kun je wat …?|Het verzoek om minder snel te praten is duidelijk. Je en u kunnen allebei passen.
r0-008|les|Je ziet het bord niet goed vanaf je stoel. Je wilt ergens anders zitten.|Vraag de docent of je op een andere plaats mag zitten.|Een andere plaats in de les vragen.|Mag ik ergens anders …?|De cursist vraagt om een andere zitplaats. De reden herhalen is niet verplicht.
r0-009|les|||Hulp bij een opdracht vragen.|Kun je mij …?|Het is duidelijk dat hulp wordt gevraagd. De cursist hoeft de ontbrekende opdracht niet uit te leggen.
r0-010|les|De docent praat met de klas. Jij wilt iets zeggen.|Vraag of je iets mag zeggen.|Vragen of je iets mag zeggen.|Mag ik iets …?|Een kort verzoek om te spreken is genoeg; de inhoud van de beurt hoeft niet te worden bedacht.
r0-011|thuis|Thuis staat het raam open. Je hebt het koud.||Vragen of het raam dicht mag.|Mag het raam …?|Het verzoek noemt het raam. Zelf sluiten of hulp vragen kan allebei passen.
r0-012|thuis|Je staat voor je huis. Je huisgenoot heeft de sleutel.||De huissleutel vragen.|Mag ik de …?|De cursist vraagt de sleutel aan de huisgenoot. Toegang tot een onbekende woning wordt niet verondersteld.
r0-014|thuis|||Hulp bij dragen aanbieden.|Zal ik …?|De cursist biedt eigen hulp aan, in plaats van zelf hulp te vragen.
r0-016|eten|Je bent bij een broodjeszaak. Je wilt een broodje.||Een broodje bestellen.|Een …, alstublieft.|Een korte bestelling is genoeg. Het soort broodje noemen mag, maar is geen extra eis.
r0-017|eten|Je gaat eten. Je hebt geen lepel.||Om een lepel vragen.|Mag ik een …?|Het gevraagde voorwerp is een lepel. Een volledige lange zin is niet nodig.
r0-018|eten|||Een bestelling zonder vlees vragen.|Graag zonder …|De cursist zegt dat die geen vlees wil. Een reden of uitleg over voeding is niet nodig.
r0-019|eten|||Hulp bij een pot openen vragen.|Kun je deze pot …?|De ander begrijpt welke hulp nodig is. Een algemene hulpvraag met aanwijzen mag ook.
r0-020|eten|Je hebt eten over in een restaurant. Je wilt het meenemen.||Een bakje voor eten vragen.|Mag ik een …?|De cursist vraagt om een bakje. Het is een verzoek, geen garantie dat het restaurant er een heeft.
r0-021|drinken|||Om water vragen.|Mag ik …?|Water vragen is genoeg. Een beleefd woord mag; een verklaring over dorst is niet nodig.
r0-022|drinken|||Koffie zonder suiker bestellen.|Koffie zonder …, alstublieft.|De bestelling bevat koffie en geen suiker. Andere wensen zijn niet nodig.
r0-023|drinken|||Om meer water vragen.|Mag ik nog …?|De cursist vraagt opnieuw om water. Nog maakt duidelijk dat het om aanvullen gaat.
r0-024|drinken|Je hebt thee gezet. Er is iemand bij je.||Thee aanbieden.|Wil je …?|Het aanbod is aan de ander gericht. Zelf thee bestellen is een andere handeling.
r0-025|drinken|Je hebt drinken op tafel gemorst.||Een doekje om op te ruimen vragen.|Mag ik een …?|De cursist vraagt om een doekje. Schuld uitleggen of excuses maken is niet verplicht.
r0-026|winkelen|||Een hoeveelheid appels bestellen.|Een kilo …, alstublieft.|De bestelling noemt appels en één kilo. Uitspraak van een is genoeg; nadruk op één hoeft niet.
r0-027|winkelen|Een pak rijst staat hoog in de winkel. Je kunt er niet bij.|Vraag een medewerker het pak te pakken.|Hulp bij een hoog product vragen.|Kun je dat pak …?|Het verzoek gaat om het pakken. Aanwijzen mag; kennis van de winkelindeling is niet nodig.
r0-028|winkelen|||Een tas bij de kassa vragen.|Mag ik een …?|De cursist vraagt een tas. Een prijs of gratis tas wordt niet verondersteld.
r0-029|winkelen|||Zeggen dat je wilt betalen.|Ik wil graag …|De bedoeling betalen is duidelijk. Een betaalmiddel noemen is extra.
r0-030|winkelen|||Een te grote bestelling corrigeren.|Ik wil maar …|De cursist maakt duidelijk dat die één brood wil. Er hoeft geen klacht of lange uitleg bij.
r0-031|kleding|Je bent in een kledingwinkel en wilt een jas passen.||Toestemming vragen om te passen.|Mag ik deze jas …?|De cursist vraagt om te passen. De bestaande voorbeeldzin past; deze en de zijn beide bruikbaar.
r0-032|kleding|Je past schoenen in een winkel. Ze zijn te klein.||Een grotere schoenmaat vragen.|Heb je een grotere …?|Groter is de benodigde richting. Een maatnummer is niet gegeven en hoeft niet te worden verzonnen.
r0-033|kleding|||Zeggen dat je een trui wilt kopen.|Ik wil deze trui …|De aankoopwens is duidelijk. Prijs en maat hoeven niet te worden genoemd.
r0-034|kleding|Een verkoper houdt een muts vast. Je wilt die even bekijken.||Een muts vragen om te bekijken.|Mag ik de muts even …?|Het gaat om even bekijken, niet noodzakelijk kopen of lenen voor later.
r0-035|kleding|Je jas hangt hoog en je kunt er niet bij.||Hulp bij een hoog hangende jas vragen.|Kun je mijn jas …?|De cursist vraagt iemand de jas te pakken. Aanwijzen kan het verzoek ondersteunen.
r0-037|vervoer|In de trein is een stoel bij het raam vrij. Er zit iemand naast.||Vragen of je bij het raam mag zitten.|Mag ik bij het raam …?|De plek bij het raam staat centraal. Het verzoek vraagt niet om een gereserveerde plaats op te eisen.
r0-038|vervoer|Je wilt uit de bus. Iemand staat voor je.||Ruimte vragen om uit te stappen.|Mag ik er …?|Het verzoek is aan degene die in de weg staat gericht. Een kort pardon met een duidelijk verzoek past.
r0-039|vervoer|Je koopt een treinkaartje naar Utrecht.|Zeg tegen de verkoper dat je een kaartje naar Utrecht wilt.|Een kaartje naar een genoemde plaats vragen.|Een kaartje naar …, alstublieft.|De bestemming is Utrecht. Reistijd, prijs en soort kaartje zijn geen extra eisen.
r0-040|vervoer|In de fietsenstalling staat je fiets tussen twee andere fietsen klem. Er is een medewerker.||Hulp bij een klemstaande fiets vragen.|Kun je mij helpen met …?|De cursist vraagt hulp bij het vrijmaken. Er hoeft geen kapot slot te worden verondersteld.
r0-041|afspraak|Je wilt met iemand afspreken om tien uur.||Een afspraaktijd voorstellen.|Zullen we om …?|Tien uur is gegeven. Een datum of lange onderhandeling is niet nodig.
r0-042|afspraak|Je gaat naar een afspraak, maar komt te laat. Je belt de ander.||Te laat komen melden.|Sorry, ik kom …|Een kort excuus en de melding later te komen zijn genoeg. Een precieze vertraging is niet gegeven.
r0-043|afspraak|Iemand wil met je vertrekken. Jij hebt nog even tijd nodig.||Even laten wachten.|Kun je even …?|Het verzoek om kort te wachten is duidelijk. Een reden hoeft niet.
r0-044|afspraak|Je wilt morgen bij iemand langskomen.||Een bezoek voor morgen voorstellen.|Kan ik morgen …?|De cursist vraagt of morgen past. Er wordt geen vaststaande afspraak aangekondigd.
r0-045|afspraak|Je bent vrijdag uitgenodigd, maar kunt dan niet. Je wilt zaterdag komen.||Een andere dag voorstellen.|Kan ik zaterdag …?|Zaterdag wordt als wens of voorstel genoemd. De ander moet nog kunnen reageren.
r0-046|weer|Het regent. Een vriend heeft een paraplu.||Een paraplu lenen.|Mag ik je paraplu …?|Lenen is duidelijk. De bronzin past bij het aanspreken van een vriend.
r0-047|weer|Je zit binnen en hebt het warm. De deur is dicht.||Vragen of de deur open mag.|Mag de deur …?|De cursist vraagt om een open deur. Een reden mag maar hoeft niet.
r0-048|weer|Je bent op bezoek. Je jas is nat en je ziet een kapstok.||Een natte jas mogen ophangen.|Mag ik mijn jas hier …?|Het verzoek gaat om ophangen op deze plek. Hier kan met aanwijzen duidelijk worden gemaakt.
r0-049|weer|Je zit thuis op de bank en hebt het koud. Iemand is bij je.||Om een deken vragen.|Mag ik een …?|Een kort verzoek om een deken volstaat. De cursist hoeft geen medische klacht te beschrijven.
r0-051|werk|Een collega ruimt op. Jij wilt helpen.||Hulp bij opruimen aanbieden.|Zal ik …?|De cursist biedt aan zelf mee te doen. De voorbeeldvraag past bij het aanbod.
r0-052|werk|Je gaat op het werk koken. Je hebt nog geen schort.||Een schort voor het werk vragen.|Mag ik een …?|Het voorwerp is duidelijk. Uitleg over werkkledingregels is niet nodig.
r0-053|werk|||Hulp bij het tillen van een doos vragen.|Kun je helpen met …?|De cursist vraagt hulp; zelf alleen tillen wordt niet als opdracht gevraagd.
r0-054|werk|Op je werk moeten dozen worden ingepakt. Je wilt die taak proberen.||Aanbieden mee te helpen met inpakken.|Ik wil graag …|De wens om te helpen is genoeg. Er hoeft geen ervaring te worden geclaimd.
r0-055|werk|Je taak op het werk is klaar. Je spreekt je begeleider.||Een volgende taak vragen.|Wat kan ik nu …?|De cursist vraagt wat die daarna kan doen. Zelf een onbekende taak verzinnen hoeft niet.
r0-056|vrije-tijd|||Iemand uitnodigen om te wandelen.|Zullen we samen …?|Het voorstel is samen wandelen. Een plaats of tijd toevoegen mag maar is niet verplicht.
r0-057|vrije-tijd|Een groep speelt een spel. Jij wilt meedoen.||Vragen om mee te spelen.|Mag ik …?|De cursist vraagt om deelname. De regels van een niet-genoemd spel hoeven niet te worden uitgelegd.
r0-058|vrije-tijd|Een vriend heeft een bal. Jij wilt die even gebruiken.||Een bal lenen.|Mag ik je bal …?|Lenen of even gebruiken is de bedoeling. Er wordt niet gevraagd de bal te houden.
r0-059|vrije-tijd|||Samen koffie drinken voorstellen.|Zullen we samen …?|De cursist nodigt de ander uit om samen te drinken. Dit verschilt van koffie bestellen.
r0-061|buurt|De fiets van je buurman staat in de doorgang. Hij staat erbij.||Vragen een fiets opzij te zetten.|Kun je de fiets …?|Het verzoek is aan de eigenaar gericht. De cursist vraagt ruimte om langs te lopen.
r0-062|buurt|Je wilt je buurman spreken. Hij is buiten.|Vraag of je buurman even tijd heeft.|Vragen of iemand tijd heeft voor een gesprek.|Heb je even …?|Een korte vraag naar tijd is genoeg. Het onderwerp van het gesprek hoeft niet te worden bedacht.
r0-063|buurt|Iemand staat in de lift en wil de deuren sluiten. Jij wilt mee.||Vragen even met de lift te wachten.|Kun je even …?|De vraag maakt duidelijk dat de cursist mee wil. Wachten is een verzoek aan de ander.
r0-064|buurt|Je wilt bij je buurvrouw op bezoek.|Vraag je buurvrouw of je mag langskomen.|Toestemming vragen voor een bezoek.|Mag ik …?|Het bezoek wordt gevraagd, niet als al afgesproken voorgesteld.
r0-065|buurt|Een bezoeker heeft een tas voor de deur gezet en staat erbij. Jij wilt naar buiten.||Vragen een tas uit de doorgang te halen.|Kun je de tas …?|De cursist vraagt de tas te verplaatsen. Weggooien is niet de bedoeling.
r0-066|bezoek|Er staat bezoek voor je deur. Je wilt de ander binnenlaten.||Een bezoeker binnenlaten.|Kom …|Een vriendelijke uitnodiging om binnen te komen volstaat. Kom binnen is hier gastvrij, geen onbeleefd bevel.
r0-067|bezoek|Je bezoek staat nog. Er is een vrije stoel.||Een zitplaats aanbieden.|Ga maar …|De ander begrijpt dat die mag zitten. Er hoeft niet om toestemming voor jezelf te worden gevraagd.
r0-068|bezoek|Je bent op bezoek en wilt nog even blijven.||Vragen of je langer mag blijven.|Mag ik nog even …?|Het verzoek laat ruimte voor een antwoord. De cursist hoeft geen reden te geven.
r0-069|bezoek|Je bent op bezoek geweest en had een fijne middag. Je wilt naar huis.||Bedanken en afscheid nemen.|Bedankt voor … Tot …|Een kort bedankje en afscheid passen. Een uitgebreid verhaal over de middag is niet nodig.
r0-070|bezoek|||Iemand voor zaterdag uitnodigen.|Kom je zaterdag …?|Zaterdag en de uitnodiging zijn duidelijk. Tijd en adres zijn niet vereist.
r0-071|telefoon|De batterij van je telefoon is leeg. Een vriend heeft een oplader.||Een oplader lenen.|Mag ik je oplader …?|De cursist vraagt de oplader te lenen. Technische gegevens van de aansluiting hoeven niet.
r0-072|telefoon|||Een beller vragen luider te spreken.|Kun je wat harder …?|De cursist vraagt om meer volume. Langzamer praten is een andere vraag.
r0-073|telefoon|Je bent in een wachtruimte en wilt bellen. Er is een medewerker.||Vragen of bellen op deze plek mag.|Mag ik hier …?|Hier verwijst naar de wachtruimte. De cursist hoeft de regels niet vooraf te kennen.
r0-074|telefoon|Iemand belt je. Je kunt nu niet praten.||Zeggen dat je later terugbelt.|Ik bel je …|De cursist kondigt later bellen aan. Een exact tijdstip is niet gegeven.
r0-075|telefoon|Je wilt bellen met een telefoon die je niet kent. Er is iemand die je kan helpen.||Hulp bij een onbekende telefoon vragen.|Kun je helpen met …?|Een eenvoudige hulpvraag volstaat. De cursist hoeft geen technische storing te beschrijven.
r0-076|bibliotheek|Je staat met een boek bij de balie van de bibliotheek. Je wilt het lenen.||Een boek lenen.|Ik wil dit boek …|De leenwens is duidelijk. De bestaande voorbeeldzin is één passende mogelijkheid.
r0-077|bibliotheek|Je bent in de bibliotheek. Er is een stille ruimte waar je wilt lezen.||Een stille leesplek vragen.|Kan ik in de stille ruimte …?|Het verzoek gaat over rustig lezen. De cursist hoeft geen vrije plek te garanderen.
r0-078|bibliotheek|Je bent in de bibliotheek en wilt daar een computer gebruiken.||Toestemming voor computergebruik vragen.|Mag ik de computer …?|De vraag is gericht op gebruik. Een reden of uitleg van het programma is niet nodig.
r0-079|bibliotheek|||Een geleend boek teruggeven.|Ik wil dit boek …|De bedoeling teruggeven is duidelijk. Dit verschilt van een nieuw boek lenen.
r0-080|bibliotheek|Je wilt een boek lenen, maar hebt je bibliotheekpas niet bij je.||Hulp vragen bij lenen zonder pas.|Ik heb mijn pas niet. Kan ik …?|Een korte hulpvraag is genoeg. Het hoeft niet vast te staan dat lenen zonder pas kan.
r0-081|afspraak|Je doet mee aan een activiteit en bent moe.||Een korte pauze vragen.|Mag ik even …?|Het verzoek om pauze is duidelijk. Een persoonlijke of medische reden is niet verplicht.
r0-082|afspraak|Je staat bij de balie van een tandarts en wilt een afspraak maken.||Een afspraak aanvragen.|Ik wil graag een …|Een afspraak vragen is genoeg. Een klacht, echte naam of gewenste tijd is geen extra eis.
r0-083|afspraak|Een medewerker geeft uitleg, maar gebruikt woorden die je niet begrijpt.||Om uitleg met gewone woorden vragen.|Kun je het makkelijker …?|Het verzoek richt zich op begrijpelijk uitleggen. De cursist hoeft de ontbrekende uitleg niet na te vertellen.
r0-084|afspraak|Je zit in een groep. Er is een vrije stoel bij de deur waar je wilt zitten.||Een plaats bij de deur vragen.|Mag ik bij de deur …?|De plek is gegeven en vrij. Een reden voor die voorkeur hoeft niet te worden genoemd.
r0-085|afspraak|Je volgt een les en wilt even naar buiten.||Vragen of je even naar buiten mag.|Mag ik even …?|Een korte toestemmingsvraag is genoeg. Een verklaring over gezondheid is niet nodig.
r0-086|post|Je staat bij een postbalie en wilt een postzegel kopen.||Een postzegel vragen.|Mag ik een …?|De cursist vraagt een postzegel. Een bestemming of tarief is niet gegeven.
r0-087|post|||Een pakket aanbieden om te versturen.|Ik wil dit pakket …|De verzendwens is duidelijk. Een adres of prijs hoeft niet te worden genoemd.
r0-088|post|Je staat bij een postbalie met een zwaar pakket. Een medewerker is aanwezig.||Hulp bij een zwaar pakket vragen.|Kun je helpen met …?|Hulp bij tillen is de vraag. Het pakket zelfstandig optillen wordt niet verlangd.
r0-089|post|Iemand geeft je een brief, maar er staat een andere naam op.||Een verkeerd gegeven brief melden.|Deze brief is niet …|De cursist zegt dat de brief niet voor die persoon is. De echte ontvanger hoeft niet bekend te zijn.
r0-090|post|||Een pen gebruiken om te schrijven.|Mag ik een pen …?|Een pen vragen of vragen die te gebruiken past. Terugbrengen of schrijven hoeft niet werkelijk te gebeuren.
r0-092|geld|Je probeert bij de kassa te betalen. Je betaalpas werkt niet.||Hulp bij betalen vragen.|Mijn pas werkt niet. Kun je …?|Een eenvoudige hulpvraag past. Geen pincode, rekeninggegevens of technische diagnose nodig.
r0-093|geld|||Zeggen dat je contant wilt betalen.|Ik wil contant …|De betaalwijze is duidelijk. De cursist hoeft geen bedrag te noemen of echt te betalen.
r0-095|geld|Je hebt met iemand gegeten in een café. Je wilt ieder je eigen deel betalen.||Apart betalen vragen.|Kunnen we apart …?|Apart betekent hier ieder het eigen deel. Bedragen uitrekenen is niet nodig.
r0-096|schoonmaken|Je gaat schoonmaken, maar hebt geen emmer.||Een emmer vragen.|Mag ik een …?|Het gevraagde voorwerp is duidelijk. Een reden toevoegen is niet nodig.
r0-097|schoonmaken|Iemand doet de afwas. Jij wilt helpen door af te drogen.||Aanbieden af te drogen.|Zal ik …?|De cursist biedt eigen hulp aan. Afwassen en afdrogen zijn verschillende taken.
r0-098|schoonmaken|Je huisgenoot heeft een stofzuiger. Je wilt die gebruiken.||Toestemming vragen voor de stofzuiger.|Mag ik de stofzuiger …?|Het gaat om toestemming om te gebruiken, niet om een koopverzoek.
r0-099|schoonmaken|De kamer moet worden opgeruimd. Je wilt dat samen met iemand doen.||Hulp bij opruimen vragen.|Kun je helpen met …?|De cursist vraagt de ander mee te helpen. Zelf hulp aanbieden is hier een andere handeling.
r0-100|schoonmaken|Iemand wil een volle vuilniszak naar buiten dragen. Jij wilt helpen.||Aanbieden een vuilniszak te dragen.|Zal ik die zak …?|De cursist biedt hulp bij het dragen aan. Een kort aanbod volstaat.
r0-101|dieren|Je ziet iemand met een hond. Je wilt de hond aaien.||Toestemming vragen om een hond te aaien.|Mag ik de hond …?|De cursist vraagt het eerst aan de eigenaar. De opdracht verlangt geen echt contact met een dier.
r0-102|natuur|Je wilt bloemen kopen bij een bloemenkraam.|Zeg welke kleur bloemen je wilt. Kies zelf een kleur.|Bloemen in een gewenste kleur vragen.|Ik wil graag … bloemen.|De cursist mag de kleur zelf kiezen. Een beschikbare bloemenlijst hoeft niet te worden geraden.
r0-103|natuur|Je bent bij iemand met planten. Je wilt helpen met water geven.||Aanbieden planten water te geven.|Zal ik de planten …?|Het is een aanbod aan de ander, geen opdracht om zelf zonder overleg te beginnen.
r0-104|natuur|||Iemand uitnodigen naar het bos.|Zullen we samen naar …?|Samen naar het bos gaan is het voorstel. Reizen of een route plannen is niet nodig.
r0-105|natuur|Je bezoekt iemands tuin en wilt een foto maken.||Toestemming vragen voor een tuinfoto.|Mag ik een foto van …?|De cursist vraagt het aan de eigenaar. Toestemming om online te delen wordt niet verondersteld.
r0-106|feest|Je geeft een feest en wilt iemand uitnodigen.|Nodig die persoon uit voor je feest.|Iemand voor een feest uitnodigen.|Kom je op …?|Een uitnodiging past; doen alsof de ander al heeft toegezegd niet. De bronvraag is bruikbaar.
r0-107|feest|Op een feest danst een groep. Jij wilt meedoen.||Vragen of je mee mag dansen.|Mag ik …?|Het verzoek gaat om deelname. Dansen of een partner aanraken is geen echte lesverplichting.
r0-108|feest|||Papier voor een cadeau vragen.|Mag ik wat …?|Papier om in te pakken is de bedoeling. Cadeaupapier en inpakpapier zijn beide passend.
r0-109|feest|Voor een feest zet iemand stoelen klaar. Jij wilt helpen.||Hulp bij stoelen klaarzetten aanbieden.|Zal ik helpen met …?|De cursist biedt hulp aan bij een concrete taak. Aantallen stoelen hoeven niet.
r0-110|feest|Je bent op een feest en wilt eerder naar huis.||Vertrek van een feest melden.|Ik ga nu …|De ander begrijpt dat de cursist vertrekt. Een reden of uitgebreide verontschuldiging is niet vereist.
r0-111|reizen|Je belt een hotel en wilt één kamer boeken.||Eén hotelkamer aanvragen.|Ik wil graag één kamer …|Eén kamer is de gevraagde informatie. Datums, prijs en aantal gasten horen niet bij deze korte taak.
r0-112|reizen|Je komt bij een hotel met een tas. Je wilt de tas even neerzetten.||Vragen waar een tas mag staan.|Waar mag ik mijn tas …?|De cursist vraagt naar een plek. Die plek hoeft niet vooraf bekend te zijn.
r0-113|reizen|Je hebt een kamer in een hotel en staat bij de balie. Je wilt de sleutel.||Een kamersleutel vragen.|Mag ik de sleutel van …?|Een kort verzoek is voldoende. Een echt kamernummer hoeft niet te worden genoemd.
r0-114|reizen|Je staat bij de balie van een hotel en wilt een taxi.||Hulp bij een taxi bellen vragen.|Kun je een taxi …?|De cursist vraagt de medewerker te bellen. Zelf een echt telefoongesprek voeren hoeft niet.
r0-115|reizen|Je vertrekt uit een hotel. Je koffer staat nog daar en je wilt hem later ophalen.||Vragen of een koffer later mag worden opgehaald.|Mag ik mijn koffer later …?|Later ophalen is een verzoek, geen al verleende toestemming om de koffer te laten staan.
r0-116|spullen|Iemand heeft een schaar. Je wilt die even gebruiken.||Een schaar lenen.|Mag ik je schaar …?|De leenwens is duidelijk. De bestaande voorbeeldzin past zonder extra reden.
r0-117|spullen|Je vindt een sleutel in een gebouw. Bij de balie zit een medewerker.||Een gevonden sleutel afgeven.|Ik heb een sleutel gevonden. Ik wil …|De cursist zegt dat die de sleutel wil afgeven. De eigenaar hoeft niet bekend te zijn.
r0-118|spullen|||Een schaar voor een doos vragen.|Mag ik een …?|Het verzoek gaat om een schaar. Hoe de doos wordt geopend hoeft niet te worden uitgelegd.
r0-119|spullen|Je bent op bezoek en wilt een stoel op een andere plek zetten.||Toestemming vragen om een stoel te verplaatsen.|Mag ik deze stoel …?|Verplaatsen is het verzoek. De stoel meenemen of houden is niet de bedoeling.
r0-120|spullen|Je hebt een boek van iemand geleend. Je geeft het nu terug.|Zeg dat je het boek teruggeeft.|Een geleend boek teruggeven.|Hier is je …|De cursist maakt duidelijk wat wordt teruggegeven. Bedanken mag, maar is niet verplicht.
r0-121|dag|||Samen ontbijten voorstellen.|Zullen we samen …?|De uitnodiging gaat over samen ontbijten. Een plaats en tijd zijn geen extra eisen.
r0-122|dag|||Samen eten voor vanavond voorstellen.|Zullen we vanavond …?|Samen eten en vanavond zijn de benodigde gegevens. Een menu bedenken hoeft niet.
r0-123|dag|Je bent thuis met iemand. Je wilt even alleen zijn.||Een behoefte aan tijd alleen zeggen.|Ik wil graag even …|Een rustige mededeling volstaat. Een persoonlijke reden geven is niet nodig.
r0-124|afspraak|||Iemand voor morgen uitnodigen.|Kun je morgen …?|De uitnodiging noemt morgen. De ander moet nog kunnen zeggen of het past.
r0-125|dag|Het is avond. Je bent met iemand en wilt nog samen thee drinken.||Samen thee drinken voorstellen.|Zullen we nog …?|Het voorstel is een kop thee samen. De abstracte uitdrukking de dag afsluiten hoeft niet te worden gebruikt.
r1-002|kennismaken|Je kent niemand op een bijeenkomst. Een groepje staat te praten.||Bij een gesprek aansluiten.|Mag ik erbij …?|De cursist geeft aan mee te willen doen. Zich uitgebreid voorstellen is niet nodig.
r1-003|kennismaken|Iemand zegt je naam verkeerd.|Zeg vriendelijk hoe je heet. Je mag een naam verzinnen.|Een verkeerd uitgesproken naam verbeteren.|Ik heet …|De cursist geeft de gewenste naam. Een echte naam of uitleg over uitspraakregels is niet verplicht.
r1-004|afspraak|Je hebt iemand ontmoet en wilt contact houden.||Een nieuwe ontmoeting voorstellen.|Zullen we volgende week …?|Volgende week en opnieuw ontmoeten zijn duidelijk. Een dag of tijd toevoegen mag, maar hoeft niet.
r1-005|kennismaken|Jij en een nieuwe cursist willen bij een groep gaan zitten.||Vragen of twee mensen bij een groep mogen zitten.|Mogen wij …?|De vraag betreft jullie allebei. Een verzoek voor alleen jezelf mist dat gegeven.
`.trim();
 const reviews=Object.fromEntries(rows.split('\n').map(line=>{
  const [n,group,context,prompt,goal,help,check]=line.split('|'),id='sq-'+n.replace('-','-diamond-');
  if(!group||!goal||!help||!check)throw new Error('Onvolledige verzoekreview: '+id);
  const title={'r0-081':'Een korte pauze','r0-082':'Een afspraak maken','r0-083':'Uitleg begrijpen','r0-084':'Een andere plaats','r0-085':'Even naar buiten'}[n];
  const model={'r0-081':'Mag ik even pauze nemen?','r0-121':'Zullen we samen ontbijten?'}[n];
  return [id,{level:'A1',group,context,prompt,goal,help,check,reason:goal+' De cursist gebruikt een korte vertrouwde vraag, mededeling of uitnodiging met de gegeven informatie. Een reden, onderhandeling of zelfstandig uitgebreid gesprek is niet vereist. Voorlezen en een zinsbegin mogen helpen.',finding:'De situatie en de gevraagde handeling zijn concreet. '+check,...(title?{title}:{}),...(model?{model}:{})}];
 }));
 function revise(bank){
  if(bank.bank_id!=='CB-QUICK-014'||bank.source_version!=='2026-09-24.snelvragen.kies.5')throw new Error('Deze verzoekreview volgt op alle 613 Kies-opdrachten.');
  const guidance=structuredClone(bank.guidance);guidance.sources.quickArrangeReviewed={title:'Taalroute · beoordeling van de eerste 120 bestaande Regel iets-opdrachten',version};
  const items=bank.items.map(item=>{
   const id=item.content_item_id,r=reviews[id];if(!r)return item;
   const model_answer=r.model??item.model_answer,context=r.context||item.context,prompt=r.prompt||item.prompt;
   const explanation=r.goal+' '+r.check+' Een korte passende reactie is genoeg.'+(model_answer?' Het voorbeeld is één mogelijkheid.':'');
   const result={...item,version,context,prompt,title:r.title??item.title,model_answer,cefr_level:r.level,difficulty:'basis',estimated_duration_seconds:30,practice_group:'quick-direct-'+r.group,learning_goal:r.goal,feedback_correct:explanation,feedback_incorrect:r.help,explanation,level_review:{source_level:item.cefr_level,level:r.level,reason:r.reason},source_ref:{...item.source_ref,review_version:version,changes:{context,prompt,title:r.title??item.title,help:r.help,goal:r.goal,level:r.level,...(r.model?{model:r.model}:{})}}};
   const example=id+'@'+version;guidance.examples[example]={goal:r.goal,evidence:explanation,source:'quickArrangeReviewed'};
   guidance.bindings[id]={item_version:version,bank_id:bank.bank_id,erk:{status:'reviewed',version,source:'quickArrangeReviewed',levels:[r.level],skill:'Gesprekken voeren',goal:r.goal,evidence:r.reason+' Eigen redactioneel advies; geen niveautoets of klasproef.'},bow:{example,criteria:['goal','activate','support','feedback','close']}};
   return result;
  });
  return {...bank,source_version:version,source_sha256:bank.source_sha256+'@'+version,review_scope:'240 directe vragen, alle 581 Vertel-vragen, alle 566 Stel een vraag-opdrachten, alle 613 Kies-opdrachten en de eerste 120 Regel iets-opdrachten afzonderlijk redactioneel beoordeeld. Overige 501 vragen behouden hun eerdere, beperktere review.',items,guidance};
 }
 const api={version,reviews,revise};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuickArrangeReview=api;
})(typeof globalThis!=='undefined'?globalThis:this);
