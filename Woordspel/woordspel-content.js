/* Original Praatpad starter collection; teaching presets, not certified CEFR word levels. */
(()=>{
const subj=[
{word:'ik',label:'ik',n:0,r:'me',h:'heb',z:'ben'},
{word:'jij',label:'jij',n:1,r:'je',h:'hebt',z:'bent'},
{word:'hij',label:'hij',n:2,r:'zich',h:'heeft',z:'is'},
{word:'wij',label:'wij',n:3,r:'ons',h:'hebben',z:'zijn'},
{word:'jullie',label:'jullie',n:3,r:'je',h:'hebben',z:'zijn'},
{word:'zij',label:'zij (meervoud)',n:3,r:'zich',h:'hebben',z:'zijn'}];
const verbs=[
{w:'werken',tags:['regular'],min:0,p:['werk','werkt','werkt','werken'],past:['werkte','werkten'],pp:'gewerkt',aux:'h',rest:'thuis',cond:'is een rustige plek prettig',contrast:'blijft overleg met collega’s belangrijk'},
{w:'koken',tags:['regular'],min:0,p:['kook','kookt','kookt','koken'],past:['kookte','kookten'],pp:'gekookt',aux:'h',rest:'voor de buren',cond:'is een grote pan handig',contrast:'is er soms eten over'},
{w:'wonen',tags:['regular'],min:0,p:['woon','woont','woont','wonen'],past:['woonde','woonden'],pp:'gewoond',aux:'h',rest:'in de stad',cond:'is de supermarkt meestal dichtbij',contrast:'is de auto soms toch handig'},
{w:'eten',tags:['irregular'],min:0,p:['eet','eet','eet','eten'],past:['at','aten'],pp:'gegeten',aux:'h',rest:'een appel',cond:'blijft er een klokhuis over',contrast:'blijft er soms trek in iets anders'},
{w:'lezen',tags:['irregular'],min:0,p:['lees','leest','leest','lezen'],past:['las','lazen'],pp:'gelezen',aux:'h',rest:'een boek',cond:'is voldoende licht prettig',contrast:'blijft er tijd voor andere dingen'},
{w:'meenemen',tags:['irregular','separable'],min:0,p:['neem','neemt','neemt','nemen'],past:['nam','namen'],pp:'meegenomen',aux:'h',rest:'een tas',particle:'mee',cond:'is er ruimte voor de boodschappen',contrast:'past niet alles erin'},
{w:'opstaan',tags:['irregular','separable'],min:0,p:['sta','staat','staat','staan'],past:['stond','stonden'],pp:'opgestaan',aux:'z',rest:'om zeven uur',particle:'op',cond:'is er genoeg tijd voor het ontbijt',contrast:'is het ontbijt soms toch gehaast'},
{w:'zich wassen',tags:['irregular','reflexive'],min:0,p:['was','wast','wast','wassen'],past:['waste','wasten'],pp:'gewassen',aux:'h',rest:'na het sporten',ref:true,cond:'is een schone handdoek prettig',contrast:'blijven de sportkleren bezweet'},
{w:'overleggen',tags:['regular'],min:1,p:['overleg','overlegt','overlegt','overleggen'],past:['overlegde','overlegden'],pp:'overlegd',aux:'h',rest:'met een collega',cond:'wordt de taakverdeling duidelijker',contrast:'blijven sommige vragen open'},
{w:'uitzoeken',tags:['irregular','separable'],min:1,p:['zoek','zoekt','zoekt','zoeken'],past:['zocht','zochten'],pp:'uitgezocht',aux:'h',rest:'een nieuwe fiets',particle:'uit',cond:'is een proefrit verstandig',contrast:'blijft de prijs belangrijk'},
{w:'zich aanmelden',tags:['regular','separable','reflexive'],min:1,p:['meld','meldt','meldt','melden'],past:['meldde','meldden'],pp:'aangemeld',aux:'h',rest:'voor de cursus',particle:'aan',ref:true,cond:'volgt er een bevestiging',contrast:'is een plaats nog niet gegarandeerd'},
{w:'toelichten',tags:['regular','separable'],min:2,p:['licht','licht','licht','lichten'],past:['lichtte','lichtten'],pp:'toegelicht',aux:'h',rest:'het voorstel',particle:'toe',cond:'kan iedereen gerichte vragen stellen',contrast:'blijft niet iedereen overtuigd'},
{w:'zich voorbereiden',tags:['regular','reflexive'],min:2,p:['bereid','bereidt','bereidt','bereiden'],past:['bereidde','bereidden'],pp:'voorbereid',aux:'h',rest:'op het gesprek',particle:'voor',ref:true,cond:'verloopt het gesprek meestal rustiger',contrast:'kunnen er onverwachte vragen komen'}];
verbs[12].tags.push('separable');
const nounData=[
{w:'tas',art:'de',min:0,adjs:['duur','zwaar','praktisch'],reason:{duur:'hij van leer is',zwaar:'er veel boeken in zitten',praktisch:'er veel vakken in zitten'},advice:'hem eerst even uitproberen'},
{w:'fiets',art:'de',min:0,adjs:['duur','zwaar','praktisch'],reason:{duur:'er een elektrische motor in zit',zwaar:'hij een stalen frame heeft',praktisch:'er een stevige bagagedrager op zit'},advice:'eerst een proefrit maken'},
{w:'kamer',art:'de',min:0,adjs:['duur','groot','rustig'],reason:{duur:'hij midden in de stad ligt',groot:'er veel meubels in passen',rustig:'hij aan de achterkant ligt'},advice:'de kamer eerst gaan bekijken'},
{w:'rooster',art:'het',min:1,adjs:['duidelijk','praktisch'],reason:{duidelijk:'alle begintijden erop staan',praktisch:'er ruimte voor pauzes is'},advice:'het met de groep bespreken'},
{w:'afspraak',art:'de',min:2,adjs:['duidelijk','belangrijk'],reason:{duidelijk:'iedereen weet wat er moet gebeuren',belangrijk:'de verdere planning ervan afhangt'},advice:'die schriftelijk bevestigen'}];
const adjectives={
duur:{f:'dure',comp:'duurder',opp:'goedkoop'},zwaar:{f:'zware',comp:'zwaarder',opp:'licht'},praktisch:{f:'praktische',comp:'praktischer',opp:'onpraktisch'},groot:{f:'grote',comp:'groter',opp:'klein'},rustig:{f:'rustige',comp:'rustiger',opp:'onrustig'},duidelijk:{f:'duidelijke',comp:'duidelijker',opp:'onduidelijk'},belangrijk:{f:'belangrijke',comp:'belangrijker',opp:'onbelangrijk'}};
const guessData=[
{w:'de sleutel',min:0,type:'objects',clues:['Je kunt dit in je zak bewaren.','Je gebruikt dit bij een deur.','Hiermee maak je een slot open.']},
{w:'de fiets',min:0,type:'objects',clues:['Hiermee kun je naar de winkel gaan.','Je zit erop en beweegt je benen.','Het heeft meestal twee wielen.']},
{w:'de agenda',min:1,type:'objects',clues:['Je gebruikt dit om te plannen.','Er staan dagen en tijden in.','Hierin noteer je je afspraken.']},
{w:'het rooster',min:1,type:'objects',clues:['Dit helpt een groep om te plannen.','Je ziet wanneer iemand les of werk heeft.','Het wordt soms elke week aangepast.']},
{w:'de handleiding',min:2,type:'objects',clues:['Dit helpt wanneer je iets nog niet kunt gebruiken.','Je vindt er uitleg in over de bediening.','Er staan vaak stappen en afbeeldingen in.']},
{w:'het overleg',min:2,type:'objects',clues:['Hier doen meestal meerdere mensen aan mee.','Je bespreekt samen wat er moet gebeuren.','Het doel is vaak om afspraken te maken.']},
{w:'de voorwaarde',min:3,type:'objects',clues:['Dit bepaalt of iets kan doorgaan.','Bij een overeenkomst moet je hieraan voldoen.','Je kunt het vaak formuleren met “als”.']},
{w:'het compromis',min:3,type:'objects',clues:['Dit kan een meningsverschil helpen oplossen.','Beide partijen krijgen een deel van wat ze willen.','Iedereen geeft ook iets toe.']},
{w:'zwaar',min:0,type:'qualities',clues:['Je kunt dit over een tas zeggen.','Je hebt moeite om hem op te tillen.','Het is het tegenovergestelde van licht.']},
{w:'rustig',min:0,type:'qualities',clues:['Je kunt dit over een plek zeggen.','Er is weinig lawaai of drukte.','Het is het tegenovergestelde van onrustig.']},
{w:'handig',min:1,type:'qualities',clues:['Je kunt dit over een voorwerp zeggen.','Het helpt je om iets gemakkelijk te doen.','Het is praktisch in het gebruik.']},
{w:'tevreden',min:1,type:'qualities',clues:['Dit zegt iets over hoe iemand zich voelt.','Het resultaat is goed genoeg voor deze persoon.','Er is op dat moment niets te klagen.']},
{w:'betrouwbaar',min:2,type:'qualities',clues:['Dit is een positieve eigenschap.','Iemand doet wat hij heeft beloofd.','Je kunt op deze persoon rekenen.']},
{w:'geschikt',min:2,type:'qualities',clues:['Dit zeg je wanneer iets goed past.','Het kan over een persoon of een voorwerp gaan.','Het voldoet aan wat er voor een bepaalde taak nodig is.']},
{w:'tegenstrijdig',min:3,type:'qualities',clues:['Je kunt dit over twee berichten zeggen.','Ze kunnen niet allebei op dezelfde manier waar zijn.','De ene uitspraak spreekt de andere tegen.']},
{w:'voorlopig',min:3,type:'qualities',clues:['Je kunt dit over een besluit zeggen.','Het kan later nog veranderen.','Het is nog niet definitief.']}];
const buildData={
A1:[
{instruction:'Maak een zin die begint met “Ik”.',parts:[['Ik','Subject'],['drink','Persoonsvorm'],['koffie.','Rest']],note:'In deze zin staat de persoonsvorm na het subject.'},
{instruction:'Maak een vraag die begint met “Drink”.',parts:[['Drink','Persoonsvorm'],['jij','Subject'],['koffie?','Rest']],note:'In deze vraag staat de persoonsvorm voor het subject. Bij “jij” vervalt hier de -t.'},
{instruction:'Begin met “Vandaag”.',parts:[['Vandaag','Tijd'],['werk','Persoonsvorm'],['ik','Subject'],['thuis.','Rest']],note:'De tijd staat vooraan. De persoonsvorm blijft op de tweede zinsplaats.'}],
A2:[
{instruction:'Begin met “Morgen”.',parts:[['Morgen','Tijd'],['neem','Persoonsvorm'],['ik','Subject'],['een tas','Rest'],['mee.','Los deel']],note:'“Meenemen” staat hier uit elkaar. De tijd komt vooraan en de persoonsvorm op de tweede zinsplaats.'},
{instruction:'Maak een zin die begint met “Wij”.',parts:[['Wij','Subject'],['hebben','Persoonsvorm'],['de keuken','Rest'],['schoongemaakt.','Werkwoord']],note:'“Hebben” is de persoonsvorm. “Schoongemaakt” is het voltooid deelwoord.'},
{instruction:'Maak een zin die begint met “Zij”.',parts:[['Zij','Subject'],['meldt','Persoonsvorm'],['zich','Wederkerig'],['voor de cursus','Rest'],['aan.','Los deel']],note:'“Zich aanmelden” is wederkerig én scheidbaar. In deze zin verwijst “zich” naar “zij”.'}],
B1:[
{instruction:'Begin met “Ik blijf thuis,”.',parts:[['Ik blijf thuis,','Hoofdzin'],['omdat','Verbinding'],['ik','Subject'],['me','Wederkerig'],['niet lekker','Rest'],['voel.','Persoonsvorm']],note:'Na “omdat” volgt een bijzin. “Voel” staat hier achteraan.'},
{instruction:'Begin met “Als”.',parts:[['Als','Verbinding'],['het','Subject'],['regent,','Persoonsvorm'],['neem','Persoonsvorm'],['ik','Subject'],['een paraplu','Rest'],['mee.','Los deel']],note:'De vooropgeplaatste bijzin wordt gevolgd door de persoonsvorm van de hoofdzin: “neem ik”.'},
{instruction:'Begin met “Ik denk”.',parts:[['Ik denk','Hoofdzin'],['dat','Verbinding'],['wij','Subject'],['de afspraak','Rest'],['moeten','Persoonsvorm'],['verzetten.','Werkwoord']],note:'In deze bijzin staan “moeten verzetten” bij elkaar. Bespreek het verschil met “Wij moeten de afspraak verzetten”.'}],
B2:[
{instruction:'Begin met “Ik vraag me af”.',parts:[['Ik vraag me af','Hoofdzin'],['waarom','Vraagwoord'],['de afspraak','Subject'],['is','Persoonsvorm'],['uitgesteld.','Werkwoord']],note:'Dit is een indirecte vraag. Ook “… waarom de afspraak uitgesteld is” is mogelijk. Het voorbeeld toont één geldige volgorde.'},
{instruction:'Begin met “Hoewel”.',parts:[['Hoewel','Verbinding'],['de uitleg','Subject'],['duidelijk','Rest'],['was,','Persoonsvorm'],['hadden','Persoonsvorm'],['de deelnemers','Subject'],['nog vragen.','Rest']],note:'“Hoewel” drukt een tegenstelling uit. Na de vooropgeplaatste bijzin volgt de persoonsvorm van de hoofdzin.'},
{instruction:'Begin met “Als”.',parts:[['Als','Verbinding'],['de levering','Subject'],['op tijd','Rest'],['was gekomen,','Werkwoorden'],['hadden','Persoonsvorm'],['we','Subject'],['kunnen beginnen.','Werkwoorden']],note:'De twee werkwoordgroepen horen bij verschillende zinsdelen. Bespreek ook “… op tijd gekomen was”.'}]};
const makeTasks={
A1:[['base','Maak een zin'],['question','Stel een vraag'],['today','Begin met vandaag'],['tomorrow','Begin met morgen'],['often','Gebruik vaak'],['also','Gebruik ook']],
A2:[['base','Maak een zin'],['question','Stel een vraag'],['past','Gebruik verleden tijd'],['perfect','Gebruik de voltooide tijd'],['today','Begin met vandaag'],['modal','Gebruik willen']],
B1:[['past','Gebruik verleden tijd'],['perfect','Gebruik de voltooide tijd'],['dat','Maak een bijzin met dat'],['als','Begin met als'],['modal','Gebruik willen'],['question','Stel een vraag']],
B2:[['indirect','Maak een indirecte vraag'],['although','Begin met hoewel'],['perhaps','Nuanceer met misschien'],['modal','Gebruik zouden willen'],['dat','Maak een bijzin met dat'],['als','Begin met als']]};
const combineTasks={
A1:[['describe','Beschrijf'],['before','Zet de eigenschap vóór het woord'],['question','Stel een vraag'],['mine','Vertel over jouw eigen voorbeeld'],['opposite','Geef een tegenstelling'],['two','Beschrijf twee voorbeelden']],
A2:[['describe','Beschrijf'],['before','Zet de eigenschap vóór het woord'],['compare','Vergelijk'],['reason','Geef een reden'],['question','Stel een vraag'],['contrast','Maak een tegenstelling']],
B1:[['compare','Vergelijk'],['reason','Leg je oordeel uit'],['advice','Geef een advies'],['contrast','Maak een tegenstelling'],['before','Gebruik een woordgroep'],['question','Vraag om een mening']],
B2:[['compare','Vergelijk vanuit één criterium'],['reason','Onderbouw je oordeel'],['advice','Geef een voorzichtig advies'],['contrast','Benoem een tegenargument'],['nuance','Relativeer je oordeel'],['although','Gebruik hoewel']]};
const levels=['A1','A2','B1','B2'];

globalThis.PraatpadWordspelContent={subj,verbs,nounData,adjectives,guessData,buildData,makeTasks,combineTasks,levels};
})();
