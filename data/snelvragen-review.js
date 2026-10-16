// Local editorial review of the 240 retained direct questions. Originals remain in snelvragen-content.js.
(function(root){
 'use strict';
 const version='2026-09-24.snelvragen.2';
 // Each line is a separately read task: concrete discussion point and repetition group.
 const goals=[
`Je naam noemen.|naam
Je woonplaats noemen.|wonen
Het land noemen waar je vandaan komt.|herkomst
Een taal noemen die je spreekt.|talen
Je leeftijd noemen. Een verzonnen leeftijd mag.|leeftijd
Een drankje noemen dat je lekker vindt.|drinken
Eten noemen dat je lekker vindt.|eten
De kleur van je tas noemen. Zonder tas mag je een kleur kiezen.|kleur
De kleur van je jas noemen. Zonder jas mag je een kleur kiezen.|kleur
De naam van je docent noemen.|naam
Zeggen wie naast je zit. Niemand is ook een passend antwoord.|kennismaken
Kort vertellen hoe het met je gaat.|gevoel
Zeggen waar je tas is. Geen tas bij je hebben mag ook.|spullen
Iets in je tas noemen. Een lege tas is ook mogelijk.|spullen
Eén activiteit van vandaag noemen.|dag
Zeggen of je in de stad woont.|wonen
Zeggen of je vandaag een trui draagt.|kleding
Zeggen of je koffie drinkt.|drinken
Zeggen of je een fiets hebt.|vervoer
Zeggen of je een pen hebt.|spullen
Zeggen of je Engels spreekt.|talen
Zeggen of je met de bus komt.|vervoer
Zeggen of je graag brood eet.|eten
Zeggen of je moe bent.|gevoel
Zeggen of je het koud hebt.|gevoel
Zeggen of je vandaag les hebt.|les
Zeggen of je in een flat woont.|wonen
Zeggen of je graag leest.|lezen
Zeggen of je vandaag kookt.|koken
Zeggen of je graag naar muziek luistert.|muziek
Kiezen tussen koffie en thee. Geen van beide mag ook.|drinken
Kiezen tussen brood en rijst. Geen van beide mag ook.|eten
Kiezen tussen lopen en fietsen. Geen van beide mag ook.|vervoer
Kiezen tussen blauw en rood. Geen voorkeur mag ook.|kleur
Kiezen tussen water en sap. Geen van beide mag ook.|drinken
Kiezen tussen een appel en een banaan. Geen van beide mag ook.|eten
Kiezen tussen een boek en een krant. Geen van beide mag ook.|lezen
Kiezen tussen rijst en pasta. Geen van beide mag ook.|koken
Zeggen of je liever binnen of buiten bent.|buiten
Zeggen of je liever in de ochtend of avond werkt.|werktijd
Kiezen tussen de bus en de trein. Geen van beide mag ook.|vervoer
Kiezen tussen een trui en een vest. Geen van beide mag ook.|kleding
Kiezen tussen een pen en een potlood. Geen van beide mag ook.|spullen
Zeggen of je suiker in je thee wilt. Geen thee drinken mag ook.|drinken
Kiezen tussen kaas en jam op brood. Iets anders mag ook.|eten
Koffie aannemen of vriendelijk afslaan.|drinken
Op een kennismaking reageren met je naam.|naam
Een blauwe of zwarte pen kiezen.|spullen
Hulp bij het zoeken aannemen of afslaan.|hulp
Een broodje aannemen of vriendelijk afslaan.|eten
Zeggen of je suiker wilt.|drinken
Zeggen of je klaar bent met winkelen.|winkelen
Een boodschappentas aannemen of afslaan.|spullen
Zeggen of je op de vrije stoel wilt zitten.|zitten
Zeggen of het raam open mag.|raam
Zeggen of je pauze wilt.|pauze
Zeggen of je mee naar buiten gaat.|buiten
Zeggen of de jas van jou is.|kleding
Kort afscheid nemen.|afscheid
Je naam nog een keer zeggen.|naam`,
`Vertellen hoe je naar de les gaat en met wie. Alleen reizen mag ook.|vervoer
Een tijd noemen waarop je opstaat en zeggen wat je daarna doet.|dag
Eten en drinken bij je ontbijt noemen. Niet ontbijten mag ook.|eten
Vertellen waar je na de les heen gaat en hoe je daar komt.|vervoer
Een winkelplek en een dag noemen.|winkelen
Zeggen of je alleen of met anderen woont. Je mag het verzinnen.|wonen
Een sport noemen en zeggen hoe vaak je die doet. Niet sporten mag ook.|sport
Een wandelplek en gezelschap noemen. Alleen of niet wandelen mag ook.|buiten
Twee dingen noemen die je meeneemt naar de les.|spullen
De begintijd van de les en de pauzetijd noemen.|les
Zeggen waar je telefoon ligt en of het geluid aanstaat. Geen telefoon mag ook.|telefoon
Een activiteit thuis noemen en zeggen wanneer je die doet.|thuis
Zeggen wanneer je iemand belt en hoelang. Niet bellen mag ook.|contact
Het weer beschrijven en noemen wat je draagt.|weer
Buiten- en binnenkleding noemen voor koud weer.|kleding
Zeggen of je elke dag naar buiten gaat.|buiten
Zeggen of je kunt zwemmen.|sport
Zeggen of er een supermarkt in de buurt is.|winkelen
Zeggen of je op zaterdag werkt.|werktijd
Zeggen of je thuis huiswerk maakt.|les
Zeggen of je elke dag fruit eet.|eten
Zeggen of je je telefoon in de trein gebruikt. Niet met de trein reizen mag ook.|telefoon
Zeggen of je vandaag tijd hebt om te koken.|koken
Zeggen of je om negen uur kunt komen.|afspraak
Zeggen of je dicht bij school woont.|wonen
Zeggen of je soms eten op de markt koopt.|winkelen
Zeggen of je een tas meeneemt naar de winkel.|spullen
Zeggen of je thuis nieuwe woorden leert.|leren
Zeggen of je koffie drinkt voordat je gaat slapen.|drinken
Zeggen of je morgen een afspraak hebt.|afspraak
Een eetplek kiezen en zeggen met wie je wilt eten. Alleen eten mag ook.|eten
Kiezen tussen de markt en de supermarkt.|winkelen
Zeggen of je liever alleen of samen leert.|leren
Binnen of buiten sporten kiezen en een moment noemen. Niet sporten mag ook.|sport
Een film of serie kiezen en gezelschap noemen. Alleen kijken mag ook.|vrije-tijd
Zeggen of je liever vroeg of laat naar bed gaat.|dag
Kiezen tussen zelf koken en eten bestellen.|koken
Kiezen tussen de fiets en de bus.|vervoer
Kiezen tussen thee en koffie bij het ontbijt.|drinken
Kiezen tussen nieuws op papier en nieuws op je telefoon.|lezen
Kiezen tussen een rustige en een drukke straat.|wonen
Kiezen tussen het park en het strand.|buiten
Kiezen tussen contant betalen en betalen met een pinpas.|betalen
Kiezen tussen een afspraak op maandag en op vrijdag.|afspraak
Zeggen of je liever in de ochtend of avond woorden oefent.|leren
Kort en vriendelijk een bestelling doorgeven.|bestellen
Zeggen of je ter plekke wilt eten of het eten wilt meenemen.|bestellen
Zeggen hoeveel broodjes je wilt.|eten
Een bonnetje aannemen of vriendelijk afslaan.|betalen
Een kledingmaat noemen.|kleding
De kleur noemen van de trui die je wilt.|kleur
Een dag of tijd noemen waarop je kunt langskomen.|afspraak
Een tijd voorstellen om af te spreken.|afspraak
Een plek voorstellen om af te spreken.|afspraak
Zeggen wat je voor de les nodig hebt.|spullen
Zeggen of langzamer praten je helpt.|gesprek
Een paginanummer noemen.|lezen
Zeggen of je de uitleg nog eens wilt horen.|gesprek
Een plek noemen waar de ander je tas kan neerzetten.|spullen
Kiezen tussen eerst de opdracht lezen en meteen beginnen.|les`,
`Vertellen wat je gisteren hebt gegeten.|eten
Vertellen wat je afgelopen weekend hebt gedaan.|vrije-tijd
Zeggen waar je gisteren bent geweest.|buiten
Vertellen hoe je vandaag naar de les bent gekomen.|vervoer
Vertellen wat je deze week hebt gekocht. Niets gekocht hebben mag ook.|winkelen
Zeggen met wie je gisteren hebt gepraat. Met niemand is ook mogelijk.|contact
Vertellen wat je vandaag al hebt gedaan.|dag
Een reden noemen waarom je Nederlands leert.|leren
Kort vertellen wat je morgen gaat doen.|dag
Je ochtend beschrijven in een logische volgorde.|dag
Iets leuks in je buurt noemen. Een reden is hier extra, niet verplicht.|wonen
Vertellen wat je de laatste keer hebt gekookt. Niet koken mag ook.|koken
Zeggen wat je doet als je een woord niet kent.|leren
Vertellen hoe je buiten de les Nederlands oefent.|leren
Zeggen wat je deze maand wilt leren.|leren
Zeggen of je gisteren hebt gekookt; alleen bij ja vertellen wat.|koken
Zeggen of je met de trein hebt gereisd; alleen bij ja zeggen waarheen.|vervoer
Zeggen of je deze week hebt gesport; alleen bij ja vertellen wat je deed.|sport
Zeggen of je vandaag hebt ontbeten; alleen bij ja vertellen wat je at.|eten
Zeggen of je iets hebt geleend; alleen bij ja noemen wat.|lenen
Zeggen of je gisteren buiten bent geweest; alleen bij ja noemen waar.|buiten
Zeggen of je vandaag Nederlands hebt gesproken; alleen bij ja zeggen met wie.|talen
Zeggen of je een sleutel hebt verloren; alleen bij ja vertellen wat je toen deed.|spullen
Zeggen of je gisteren muziek hebt geluisterd; alleen bij ja noemen welke muziek.|muziek
Zeggen of je een trein hebt gemist; alleen bij ja vertellen wat je toen deed.|vervoer
Zeggen of je vóór negen uur kunt komen en zo nodig een andere tijd voorstellen.|afspraak
Zeggen of je een andere taal wilt leren; alleen bij ja noemen welke.|talen
Zeggen of je online iets hebt gekocht; alleen bij ja noemen wat.|winkelen
Zeggen of je deze week iemand hebt geholpen; alleen bij ja vertellen waarmee.|hulp
Zeggen of je gisteren iets hebt gelezen; alleen bij ja vertellen wat.|lezen
Kiezen tussen trein en bus en één reden geven.|vervoer
Kiezen tussen nieuw en tweedehands en één reden geven.|winkelen
Kiezen tussen leren met een boek of app en één reden geven.|leren
Kiezen tussen samen of alleen koken en één reden geven.|koken
Kiezen tussen stad en dorp en één reden geven.|wonen
Kiezen tussen vroeg of laat werken en één reden geven.|werktijd
Een voorkeur voor thuis of in een café afspreken uitleggen.|afspraak
Kiezen tussen bellen en een bericht sturen en één reden geven.|contact
Kiezen tussen wandelen en zwemmen en één reden geven.|sport
Zeggen of je het weekend vooraf plant en één reden geven.|vrije-tijd
Een winkeldag kiezen en één reden geven.|winkelen
Kiezen tussen spreken en schrijven oefenen en één reden geven.|leren
Kiezen tussen een korte en lange vakantie en één reden geven.|vakantie
Kiezen wanneer je warm eet en één reden geven.|eten
Kiezen tussen fietsen en lopen naar de winkel en één reden geven.|vervoer
Zeggen of tien uur past. Een andere tijd voorstellen mag, maar hoeft niet.|afspraak
Kiezen tussen wachten en geld terug. Een reden geven mag, maar hoeft niet.|winkelen
Zeggen of de broek te groot of te klein is.|kleding
Een andere manier noemen om naar de les te komen als de bus niet rijdt.|vervoer
Zeggen of je het koud hebt. Je mag vragen of het raam dicht kan.|raam
Iets anders bestellen als de soep op is.|bestellen
Zeggen of je het boek langer wilt lenen.|lenen
Een oplader aannemen of afslaan. Een afspraak over teruggeven is extra.|telefoon
Zeggen wat je gaat doen terwijl je op de les wacht.|pauze
Een andere dag voorstellen als dinsdag niet past.|afspraak
Hulp bij het dragen van de tas aannemen of afslaan.|hulp
Zeggen of je grotere letters wilt.|lezen
Zeggen of je het eten wilt meenemen.|bestellen
Zeggen bij welke huiswerkopdracht je hulp wilt.|les
Een fiets te leen aannemen of afslaan. Terugbrengen afspreken is extra.|lenen`,
`Vertellen wat bij Nederlands leren eerst lastig was en nu beter gaat.|leren
Een verandering voor je buurt voorstellen. Uitleggen wat die oplevert mag als vervolg.|wonen
Vertellen hoe je een drukke week voorbereidt.|plannen
Een fout beschrijven en vertellen wat je ervan hebt geleerd. Een verzonnen voorbeeld mag.|ervaring
Een gewoonte noemen die helpt bij leren en uitleggen hoe die helpt.|leren
Vroeger en nu vergelijken met een voorbeeld uit je dagelijks leven.|ervaring
Uitleggen waarop je let bij het kiezen van een opleiding.|opleiding
Vertellen hoe je contact houdt met mensen die ver weg wonen.|contact
Vertellen hoe je een drukke dag afsluit. Uitleggen waarom dat helpt is extra.|rust
Een bruikbare tip noemen en beschrijven wat die heeft veranderd.|ervaring
Uitleggen hoe je begint aan een onbekende taak.|werk
Vertellen wat je prettig vindt aan samenwerken.|samenwerken
Een plek aanraden en één reden geven.|buiten
Vertellen wat je met een extra vrije dag zou doen.|vrije-tijd
Uitleggen wanneer je tevreden bent over een Nederlands gesprek.|gesprek
Een veranderde planning beschrijven en uitleggen waarom die moest veranderen.|plannen
Je mening geven over zondagopenstelling en die onderbouwen.|winkelen
Vertellen of je dichter bij je werk zou willen wonen en waarom. Geen werk hebben mag ook.|werk
Vertellen of dagelijks oefenen lukt en hoe. Bij nee benoemen wat lastig is.|leren
Een misverstand en de oplossing uitleggen. Zonder eigen ervaring mag een verzonnen voorbeeld.|gesprek
Uitleggen waarom hulp vragen makkelijk of moeilijk voor je is.|hulp
Zeggen of je een avondcursus wilt volgen en één reden geven.|opleiding
Vertellen hoe het terugbrengen van een aankoop ging. Geen ervaring mag ook.|winkelen
Online contact en contact in dezelfde ruimte vergelijken en je voorkeur uitleggen.|contact
Uitleggen hoe je een week zonder auto zou reizen. Ook zonder eigen auto kun je antwoorden.|vervoer
Vertellen hoe je een verzoek hebt geweigerd. Een verzonnen voorbeeld mag.|hulp
Je mening over gelijke werktijden geven en onderbouwen.|werktijd
Uitleggen hoe je iets aan een nieuwe collega hebt uitgelegd. Een verzonnen voorbeeld mag.|werk
Vertellen of je in een andere stad zou willen wonen en welke punten je meeweegt.|wonen
Uitleggen wat jou helpt bij veel keuzemogelijkheden.|kiezen
Kiezen tussen meer vrije tijd en meer salaris en één reden geven.|werk
Huur en reistijd tegen elkaar afwegen en je keuze uitleggen.|wonen
Online leren en leren op een leslocatie vergelijken met een voordeel en nadeel.|opleiding
Prijs en gebruiksduur afwegen bij een aankoop en je keuze uitleggen.|winkelen
Kiezen tussen thuis en op kantoor werken en één reden geven.|werk
Een snelle of goedkope reis kiezen en een situatie noemen waarin je anders kiest.|vervoer
Kiezen tussen klein centraal of ruim buiten de stad wonen en één reden geven.|wonen
Uitleggen hoeveel je vooraf plant en waarom je eventueel tijd vrijhoudt.|plannen
Kiezen tussen vast en tijdelijk werk en uitleggen wat voor jou belangrijk is.|werk
Kiezen tussen meteen een probleem bespreken of eerst nadenken en één reden geven.|gesprek
Kiezen tussen een kleine winkel en een winkelketen en één reden geven.|winkelen
Een manier van leren kiezen en één reden geven.|leren
Kiezen tussen een bekende en nieuwe vakantieplek en één reden geven.|vakantie
Een agenda kiezen en twee verschillende redenen geven.|plannen
Kiezen tussen samen of alleen op pad gaan en zeggen wanneer je anders kiest.|buiten
Een andere afspraak voorstellen als de oude afspraak niet doorgaat.|afspraak
Kiezen tussen een vervanging en geld terug en één reden geven.|winkelen
Een uitvoerbare volgorde voorstellen voor oefenen en opruimen binnen de gegeven tijd.|plannen
Een oplossing voorstellen voor een te kleine ruimte.|samenwerken
Zeggen hoe laat vroeg voor jou is en een voorbeeldtijd noemen.|afspraak
Een afspraak voorstellen waarbij de één muziek kan luisteren en de ander rust heeft.|samenwerken
Kiezen tussen wachten en een andere cursus en één reden geven.|opleiding
Voorstellen hoe je een verschil van mening over oefenen samen bespreekt.|gesprek
Zeggen waarmee en wanneer je bij de bijeenkomst kunt helpen.|hulp
Zeggen wat je wilt weten over de hogere prijs. Naar de reden of de oude afspraak vragen kan allebei.|betalen
Een ander moment zoeken als de beschikbare tijden niet overlappen.|afspraak
Buren vertellen wanneer er lawaai is, waardoor het komt en vriendelijk afsluiten.|wonen
Een tip geven om een afspraak niet te vergeten.|afspraak
Om een oplossing vragen als de lestijd samenvalt met je werk.|opleiding
Voorstellen hoe je samen kiest tussen de twee genoemde plannen.|kiezen`
 ];
 const edits={
 'dq-0-square-12':{prompt:'Woon jij in een flat?',model_answer:'Nee, ik woon in een rijtjeshuis.',help:'Ja, ik woon in een flat. / Nee, ik woon in …',finding:'Een flat is ook een huis in de betekenis van woning; de oude tegenstelling was onduidelijk.'},
 'dq-0-diamond-13':{prompt:'Er ligt hier een jas. Is deze jas van jou?',finding:'De situatie gaf het ja-antwoord al weg; nu mag ja of nee.'},
 'dq-0-diamond-14':{prompt:'Ik ga naar huis. Tot morgen!',finding:'Een gewone afscheidsgroet past beter dan de kunstmatige vraag “Tot morgen, goed?”.'},
 'dq-1-circle-06':{prompt:'Woon je alleen of met andere mensen?',finding:'Het ongewone woord oefenhuis vervangen door een gewone vraag; verzinnen blijft toegestaan.'},
 'dq-1-circle-13':{prompt:'Wanneer bel je een vriend en hoelang praten jullie?',finding:'Duur duidelijk onderscheiden van lengte.'},
 'dq-1-diamond-01':{context:'Je bent in een café. De medewerker vraagt:',finding:'De bestelvraag krijgt een herkenbare plek en spreker.'},
 'dq-1-diamond-02':{context:'Je hebt eten besteld. De medewerker vraagt:',finding:'“Meenemen” verwijst nu naar eten, niet naar een ontbrekend voorwerp.'},
 'dq-1-diamond-05':{context:'Je zoekt een trui in een kledingwinkel. De medewerker vraagt:',finding:'Maat heeft nu een duidelijk onderwerp.'},
 'dq-1-diamond-12':{context:'Je zoekt een pagina in je lesboek. Je docent vraagt:',finding:'Het paginanummer hoort bij een zichtbaar benoemd lesboek.'},
 'dq-1-diamond-13':{context:'Je docent heeft de opdracht uitgelegd en vraagt:',finding:'“Het” verwijst nu naar de uitleg.'},
 'dq-1-diamond-15':{context:'Je krijgt een nieuwe opdracht. De docent vraagt:',prompt:'Wil je eerst de opdracht lezen of meteen beginnen?',finding:'Het ontbrekende onderwerp van lezen en beginnen benoemd.'},
 'dq-2-circle-02':{prompt:'Wat heb jij afgelopen weekend gedaan?',model_answer:'Ik heb afgelopen weekend gewandeld.',help:'Ik heb afgelopen weekend …',finding:'Afgelopen weekend voorkomt verwarring met een komend weekend.'},
 'dq-2-circle-14':{help:'Ik praat … / Ik luister … / Ik lees …',finding:'Hulp sluit aan op het antwoord; geen moeilijkere door-te-constructie opleggen.'},
 'dq-2-square-11':{context:'De les begint morgen om negen uur. Je docent vraagt:',prompt:'Kun jij morgen vóór negen uur komen? Hoe laat kun je er zijn?',model_answer:'Ja, ik kan om half negen komen.',help:'Ja, ik kan om … / Nee, ik kan pas om …',finding:'Eerder had geen begintijd. Negen uur benoemd en half negen los geschreven.'},
 'dq-2-diamond-12':{prompt:'De letters zijn klein. Wil je grotere letters?',finding:'Grotere tekst kon meer tekst betekenen; het gaat om leesbare letters.'},
 'dq-3-circle-08':{context:'Een vriend woont ver weg.',prompt:'Hoe houd jij contact met deze vriend?',finding:'De betrekkelijke bijzin in de vraag vervangen door twee eenvoudige zinnen bij A2; contact houden blijft het doel.'},
 'dq-3-circle-04':{help:'Ik had … / Ik was … / Ik deed … Nu …',finding:'Hulp past ook bij het bestaande voorbeeld “Ik was een afspraak vergeten”.'},
 'dq-3-circle-09':{prompt:'Wat doe jij om na een drukke dag rustig te worden?',finding:'De figuurlijke formulering een dag afsluiten vervangen door gewone woorden.'},
 'dq-3-circle-10':{prompt:'Welke tip heeft jou geholpen? Wat ging daarna beter?',finding:'“Waar jij veel aan had” uitgelegd; beide delen van het voorbeeld worden expliciet gevraagd.'},
 'dq-3-square-04':{prompt:'Lukt het jou om elke dag Nederlands te oefenen? Vertel hoe je dat doet, of wat het lastig maakt.',help:'Het lukt … Ik … / Het is lastig, want …',finding:'De vervolgvraag is nu ook uitvoerbaar als het niet lukt.'},
 'dq-3-square-09':{prompt:'Vind jij online contact even prettig als samen in dezelfde ruimte praten? Waarom?',model_answer:'Nee, ik praat liever met iemand in dezelfde ruimte, omdat ik die persoon dan beter begrijp.',finding:'Online contact kan ook persoonlijk zijn; het verschil gaat om samen in dezelfde ruimte zijn.'},
 'dq-3-triangle-02':{prompt:'Huur jij liever een dure woning dicht bij je werk of een goedkopere woning verder weg? Waarom?',model_answer:'Ik kies de woning dicht bij mijn werk. Ik betaal meer huur, maar bespaar elke dag reistijd. Dat vind ik belangrijker.',finding:'Onbenoemd iets en dichtbij concreet gemaakt. Het oude voorbeeld draaide de afweging om.'},
 'dq-3-triangle-03':{prompt:'Leer jij liever online of in een leslokaal? Noem een voordeel en een nadeel van jouw keuze.',model_answer:'Ik leer liever in een leslokaal. Ik kan makkelijk vragen stellen, maar ik moet wel reizen.',finding:'Op locatie vereenvoudigd; duidelijk gemaakt van welke keuze voor- en nadeel nodig zijn.'},
 'dq-3-triangle-04':{context:'Je wilt een nieuwe tas kopen.',prompt:'Kies je een goedkope tas of een duurdere tas die langer meegaat? Waarom?',model_answer:'Ik kies een tas die langer meegaat als ik die kan betalen. Dan hoef ik minder vaak een nieuwe tas te kopen.',finding:'Goedkoop/iets duurders had geen duidelijk voorwerp; tas toegevoegd binnen dezelfde afweging.'},
 'dq-3-diamond-03':{context:'De les duurt nog tien minuten. Opruimen kost ongeveer vijf minuten. Jullie willen ook nog oefenen.',prompt:'Wat stel je voor?',model_answer:'Laten we eerst vijf minuten oefenen en daarna vijf minuten opruimen.',finding:'Weinig tijd was onbepaald; de voorgestelde oplossing is nu te toetsen aan concrete tijd.'},
 'dq-3-diamond-05':{model_answer:'Voor mij is vroeg vóór acht uur, bijvoorbeeld om half acht.',finding:'Half acht wordt los geschreven.'},
 'dq-3-diamond-06':{context:'Jij en een collega werken in dezelfde ruimte. Je collega wil muziek aan, maar jij wilt rust.',prompt:'Wat spreken jullie af?',finding:'Sprekers en plek zijn nu duidelijk; koptelefoon is een mogelijke, geen verplichte oplossing.'},
 'dq-3-diamond-08':{context:'Je wilt Nederlands oefenen met een app. Je klasgenoot gebruikt liever een boek.',prompt:'Hoe kunnen jullie samen verder praten over deze keuze?',model_answer:'Laten we eerst allebei uitleggen waarom we daarvoor kiezen. Daarna kunnen we kijken wat we samen willen proberen.',finding:'Een verschil van mening had geen onderwerp; het gesprek gaat nu concreet over boek of app.'},
 'dq-3-diamond-09':{context:'Vrijdag is er een bijeenkomst. Er moeten stoelen klaargezet worden en bezoekers ontvangen worden.',prompt:'Waarmee kun jij helpen en wanneer?',model_answer:'Ik kan vrijdag helpen met de stoelen klaarzetten. Daarna moet ik weg.',finding:'Helpen en klaarzetten hadden geen onderwerp; concrete werkzaamheden benoemd.'},
 'dq-3-diamond-12':{context:'Morgen klussen jullie thuis van tien uur tot vier uur. Dat maakt lawaai.',prompt:'Wat zou jij in een bericht aan de buren zetten?',finding:'Datum, reden en tijden uit het voorbeeld zijn nu ook beschikbaar voor de cursist.'},
 'dq-3-diamond-15':{context:'Jullie willen iets samen doen. Eén plan is naar het park gaan. Het andere plan is samen koken.',prompt:'Hoe komen jullie samen tot een keuze?',finding:'Twee onbenoemde plannen concreet gemaakt; meerdere manieren om te kiezen blijven geldig.'}
 };
 const lowerA1=new Set(['dq-2-circle-09','dq-2-diamond-03','dq-2-diamond-05','dq-2-diamond-06','dq-2-diamond-08','dq-2-diamond-11','dq-2-diamond-12','dq-2-diamond-13','dq-2-diamond-15']);
 const lowerA2=new Set(['dq-3-circle-02','dq-3-circle-07','dq-3-diamond-10','dq-3-circle-01','dq-3-circle-03','dq-3-circle-08','dq-3-circle-09','dq-3-circle-12','dq-3-circle-13','dq-3-square-04','dq-3-square-07','dq-3-square-08','dq-3-triangle-01','dq-3-triangle-05','dq-3-triangle-07','dq-3-triangle-10','dq-3-triangle-11','dq-3-triangle-12','dq-3-triangle-13','dq-3-diamond-01','dq-3-diamond-02','dq-3-diamond-04','dq-3-diamond-05','dq-3-diamond-07','dq-3-diamond-13','dq-3-diamond-14']);
 const splitIds=new Set(['dq-0-diamond-02','dq-0-diamond-04','dq-0-diamond-06','dq-0-diamond-07','dq-0-diamond-09','dq-0-diamond-10','dq-0-diamond-11','dq-0-diamond-12','dq-0-diamond-13','dq-0-diamond-14','dq-0-diamond-15','dq-1-diamond-06',...Array.from({length:15},(_,i)=>'dq-2-diamond-'+String(i+1).padStart(2,'0')), 'dq-3-diamond-01','dq-3-diamond-02','dq-3-diamond-04','dq-3-diamond-05','dq-3-diamond-07','dq-3-diamond-10','dq-3-diamond-11','dq-3-diamond-13','dq-3-diamond-14']);
 const levels={A1:'Een woord, vaste reactie of korte zin over een herkenbare dagelijkse situatie is voldoende.',A2:'De vraag vraagt eenvoudige informatie, een korte beschrijving of één reden over een vertrouwd onderwerp.',B1:'De vraag vraagt een samenhangende uitleg, afweging, ervaring of oplossing met meerdere samenhangende punten.'};
 const reviews=Object.fromEntries(goals.flatMap((block,route)=>block.split('\n').map((line,n)=>{
  const id=`dq-${route}-${['circle','square','triangle','diamond'][Math.floor(n/15)]}-${String(n%15+1).padStart(2,'0')}`,[goal,group]=line.split('|');
  const level=lowerA1.has(id)?'A1':lowerA2.has(id)?'A2':['A1','A1','A2','B1'][route];
  return [id,{goal,group,level,reason:goal+' '+levels[level],...(edits[id]||{})}];
 })));
 function revise(bank){
  if(bank.bank_id!=='CB-QUICK-014'||bank.source_version!=='2026-09-23.snelvragen.1')throw new Error('Snelvragenreview hoort bij de bewaarde bronversie.');
  const guidance=structuredClone(bank.guidance);
  guidance.sources.quickReviewed={title:'Taalroute · beoordeling van 240 bestaande Snelvragen',version};
  const items=bank.items.map(item=>{
   const id=item.content_item_id,r=reviews[id];if(!r)return item;
   let context=r.context??item.context,prompt=r.prompt??item.prompt;
   if(splitIds.has(id)){const cut=prompt.indexOf('. ');if(cut<0)throw new Error('Ontbrekende situatie: '+id);context=prompt.slice(0,cut+1);prompt=prompt.slice(cut+2);}
   const help=(r.help??item.feedback_incorrect).replace(' Je mag ook nee zeggen en een mogelijk plan noemen.','');
   const alternative=id.includes('-triangle-')?'Een andere voorkeur of geen voorkeur mag ook. Geef alleen de uitleg die de vraag vraagt.':id.startsWith('dq-2-square-')||id.startsWith('dq-3-square-')?'Bij nee vervalt een vervolgvraag over die ervaring. Bespreek alleen wat de cursist wel kan vertellen.':'Andere antwoorden zijn goed als ze bij de vraag en de situatie passen.';
   const explanation=r.goal+' '+alternative+' Je mag iets verzinnen of de vraag overslaan. Het voorbeeld is één mogelijkheid.';
   const result={...item,version,context,prompt,model_answer:r.model_answer??item.model_answer,cefr_level:r.level,difficulty:r.level==='A1'?'basis':'midden',estimated_duration_seconds:{A1:30,A2:45,B1:60}[r.level],practice_group:'quick-direct-'+r.group,learning_goal:r.goal,feedback_correct:explanation,feedback_incorrect:help,explanation:explanation+(help?' Hulp: '+help:''),level_review:{source_level:item.cefr_level,level:r.level,reason:r.reason},source_ref:{...item.source_ref,review_version:version,changes:{context,prompt,model_answer:r.model_answer??item.model_answer,help,goal:r.goal,level:r.level}}};
   const example=id+'@'+version;
   guidance.examples[example]={goal:r.goal,evidence:explanation,source:'quickReviewed'};
   guidance.bindings[id]={item_version:version,bank_id:bank.bank_id,erk:{status:'reviewed',version,source:'quickReviewed',levels:[r.level],skill:'Spreken en gesprekken voeren',goal:r.goal,evidence:r.reason+' Eigen redactioneel advies; geen niveautoets of klasproef.'},bow:{example,criteria:['goal','activate','support','feedback','close']}};
   return result;
  });
  return {...bank,source_version:version,source_sha256:bank.source_sha256+'@'+version,review_scope:'240 directe vragen afzonderlijk redactioneel beoordeeld. Overige 2381 vragen behouden hun eerdere, beperktere review.',items,guidance};
 }
 const api={version,reviews,revise};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.QuickReview=api;
})(typeof globalThis!=='undefined'?globalThis:this);
