(function(root){
 'use strict';
 const source=typeof module==='object'&&module.exports?require('./data/e1-release.js'):root.E1Release;
 const wording=typeof module==='object'&&module.exports?require('./wording.js'):root.AppWording;
 const originals=new Map((source?.cards||[]).map(c=>[c.id,c]));
 // [Situation, separate reading material, steps] keeps the retained task and answer intact.
 const spelling=[
  ['Je neemt iets mee.',['tas','taas'],['Wijs het juiste woord aan.','Zeg: Dit is mijn …']],
  ['Je kijkt vanuit het lokaal naar buiten.',['r…m'],['Vul één of twee a’s in.','Zeg het woord hardop.']],
  ['Op een kaartje staat:',['Een kop kofee.'],['Verbeter het woord kofee.','De docent mag het woord eerst voorlezen.']],
  ['Je gaat met de trein.',['reis','rijs'],['Kies het woord voor je tocht.','Bedenk waar je naartoe gaat. Vertel het.']],
  ['Het is winter.',['Het is k…d.'],['Vul au of ou in.','Vertel wat je aantrekt.']],
  ['Op een briefje over de tuin staat:',['We planten twee boomen.'],['Verbeter het woord boomen.']],
  ['Je beschrijft een route.',['Je loopt langs het …','station','stasion'],['Kies het juiste woord.','Geef daarna nog een stap van de route.']],
  ['Je krijgt een klein boek.',['boek…','je','tje'],['Maak het verkleinwoord. Kies je of tje.','Waarvoor gebruik je een klein boek? Vertel het.']],
  ['In een bericht staat:',['De les begind om negen uur.'],['Verbeter de spelling van begind.','Houd het onderwerp en de tijd hetzelfde.']],
  ['', ['bomen','ramen','katten','pennen'],['Maak twee groepen: woorden met één medeklinker in het midden en woorden met twee dezelfde medeklinkers in het midden.','Lees de woorden in elke groep voor.']],
  ['Je maakt een titel voor een formulier.',['aanvraagformulier','aanvraag formulier'],['Kies de juiste schrijfwijze.','Leg uit waarvoor je dit formulier gebruikt.']],
  ['Je hebt de bevestiging al verstuurd.',['Ik heb de bevestiging ge…','Werkwoord: mailen'],['Vul de hele werkwoordsvorm in.']],
  ['De school houdt een informatieavond voor nieuwe cursisten. Op de uitnodiging staat:',['U bent van harte welkom op onze informatie avond.'],['Verbeter de spelling van informatie avond.','Leg uit voor wie de avond is.']],
  ['In de eerste versie van een verslag staat één foto. In de tweede versie staan er twee.',['foto → twee …'],['Maak het meervoud van foto.','Leg uit waarom het teken nodig is.']],
  ['', ['A. Ten slotte bedankte de voorzitter iedereen.','B. Je kunt het nog proberen; je bent tenslotte op tijd.'],['Leg het verschil in betekenis uit tussen ten slotte en tenslotte.','Maak met elke vorm een nieuwe zin.']],
  ['', ['papier','stoel','plastic','tafel'],['Maak twee groepen: materialen en voorwerpen.','Maak van elk materiaal een bijvoeglijk naamwoord bij tas of map.']],
  ['', ['A. Ik ga ervan uit dat iedereen komt.','B. Ik ga er vanuit dat iedereen komt.'],['Kies de juiste spelling voor deze betekenis.','Leg uit welke woorden je aan elkaar schrijft.']],
  ['In een folder staan twee woorden. Het gaat om een vervallen gebouw en een bijeenkomst van mensen die elkaar terugzien.',['ruine','reunie'],['Verbeter beide woorden.','Leg uit hoe het trema helpt bij het lezen.']],
  ['Je controleert drie zinnen voor een publieksbericht.',['A. Voor zover bekend is er geen schade.','B. De ingang ligt zo ver weg dat een bordje nodig is.','C. Ik wist niet dat het al zover was.'],['Leg de spelling van zover en zo ver in A en B uit.','Leg uit wat zover in C kan betekenen.']],
  ['In een vacature staat:',['We bieden een EU stage en vragen later een BTW nummer.'],['Verbeter de spelling.','Leg uit wanneer je een afkorting voor de lezer uitschrijft.']],
  ['Je vult een bezorgformulier in.',['adres','adress'],['Kies het juiste woord.','Noem daarna een straatnaam en huisnummer. Je mag die zelf bedenken.']],
  ['Je schrijft een adres op een envelop.',['str…t'],['Vul de ontbrekende letters in.','Noem daarna de naam van een weg. Je mag die zelf bedenken.']],
  ['Je stuurt je buurvrouw een bericht.',['Morgen ben ik thuus.'],['Verbeter één woord.','Lees het hele bericht hardop.']],
  ['Je geeft aan wanneer je kunt.',['in het weekend','in het week end'],['Kies de juiste schrijfwijze.','Vertel op welke dag je kunt.']],
  ['Je stuurt een bericht over een afspraak.',['Ik ben te laat.','Ik ben telaat.'],['Kies de juiste spelling.','Maak een kort bericht. Vertel hoeveel minuten later je komt. Je mag het aantal zelf kiezen.']],
  ['Je stuurt een e-mail met twee afbeeldingen.',['foto → twee …','Ik stuur twee … mee.'],['Maak het meervoud van foto.','Maak de zin af.']],
  ['Dit is de onderwerpregel van een e-mail:',['Vraag aan de klanten service.'],['Verbeter de spelling in de onderwerpregel.','Stel daarna één korte vraag over een bestelling. Je mag die zelf bedenken.']],
  ['Je vult een contactformulier in.',['e-mailadres','emailadres','e mailadres'],['Kies de juiste schrijfwijze.','Vraag je partner waar je een bericht naartoe kunt mailen. Die mag een adres bedenken.']],
  ['Je bedoelt één klein of kort sms-bericht.',['sms → een …'],['Maak het verkleinwoord van sms.','Gebruik het in een korte zin.']],
  ['Bij een balie vraagt iemand om één klein vel papier van A4-formaat.',['A4’tje','A4-tje'],['Welke schrijfwijze is goed?','Waarom kies je die vorm?']],
  ['Je bedoelt een bestand dat je als reservekopie bewaart.',['back-upbestand','backup bestand','back upbestand'],['Kies de juiste schrijfwijze.','Schrijf één korte instructie voor een collega.']],
  ['Je controleert een factuur.',['Ik heb te veel betaald.','Het teveel aan verzendkosten wordt terugbetaald.'],['Leg uit waarom te veel en teveel hier verschillend worden geschreven.','Maak met elke vorm een nieuwe zin.']],
  ['Je schrijft een instructie over een bestand in pdf-formaat.',['pdf-bestand','PDF bestand','pdf bestand'],['Kies de juiste schrijfwijze.','Maak een korte zin waarin je iemand vraagt het bestand mee te sturen.']],
  ['In een projectmail ontbreekt een trema.',['coordinator'],['Schrijf het woord met het trema.','Leg uit wat het trema duidelijk maakt over de uitspraak.']],
  ['Een buurthuis gebruikt deze twee teksten:',['Alleen voor niet-rokers.','Hier niet roken.'],['Vergelijk niet-rokers en niet roken. Leg het verschil uit.','Maak met elke vorm een nieuwe zin.']],
  ['In een handleiding staat:',['Open het gedownloadde bestand.'],['Verbeter de spelling van gedownloadde.','Leg uit hoe je de juiste vorm schrijft.']],
  ['Je bedoelt iemand met wie je vroeger werkte.',['oud-collega','oude collega'],['Kies de vorm die daarbij past.','Leg uit wat de andere vorm kan betekenen.']],
  ['Je controleert drie woordgroepen in een beleidsnotitie.',['niet lid','niet-roker','nog niet ingeschreven deelnemer'],['Verbeter de spelling waar dat nodig is. Bij niet lid gaat het om een zelfstandig naamwoord.','Leg per woordgroep uit waarom je wel of geen koppelteken gebruikt.']],
  ['Je controleert deze instructie:',['Mail het PDF bestand naar het emailadres en bewaar ook een backupbestand.'],['Verbeter alleen de spelling en de leestekens waar dat nodig is.','Houd de inhoud en de volgorde gelijk.','Leg twee van je keuzes uit aan een collega.']],
  ['Een redacteur wil in elk paar één vorm verbieden.',['typfout / typefout','niet ingevulde formulieren / niet-ingevulde formulieren'],['Beoordeel beide paren. Welke vormen zijn toegestaan?','Leg uit wat fout is en wat een keuze in de huisstijl kan zijn.']]
 ];
 const verbs=[
  ["Je zit in de pauze.",["Ik drink thee.","Ik drinken thee."],["Kies de goede zin.","Zeg daarna de hele zin."]],
  ["Je ziet de bus.",["De bus … er.","is / zijn"],["Kies het woord dat op de lege plek past.","Zeg de hele zin."]],
  ["Op een kaart staat:",["Ik pakt een boek."],["Verbeter het onderstreepte woord.","Zeg de goede zin."],"pakt"],
  ["Je vertelt over morgen.",["Morgen werk ik.","Morgen werkt ik."],["Kies de goede zin en lees hem hardop.","Vertel ook wanneer jij werkt of oefent."]],
  ["Het is warm in het lokaal.",["Jij … het raam open.","doet / doen"],["Kies het woord dat op de lege plek past.","Vraag je partner om het raam open te doen."]],
  ["Je vertelt nu over twee mensen: jij en iemand anders.",["Ik eet om twaalf uur."],["Begin de zin met ‘Wij’ en pas het werkwoord aan.","Vertel daarna hoe laat jullie pauze hebben."]],
  ["Je bezoek is voorbij.",["Gisteren ben / was ik bij mijn buurvrouw."],["Kies ‘ben’ of ‘was’.","Bedenk wat je tijdens het bezoek hebt gedaan. Vertel één ding."]],
  ["Je beschrijft je ochtend.",["Ik … om zeven uur … .","sta / op"],["Vul beide woorden op de juiste plek in.","Vraag hoe laat je partner opstaat."]],
  ["Je hebt gisteren een afspraak geregeld.",["Ik heb een afspraak maken."],["Verbeter het onderstreepte woord.","Waarover gaat de afspraak? Vertel het."],"maken"],
  ["Je wilt weten of iemand morgen kan helpen.",["Je kunt morgen helpen."],["Maak van deze zin een vraag.","Vraag daarna op welk tijdstip het kan."]],
  ["Je komt op het perron. De trein reed twee minuten geleden weg.",["De trein heeft vertrokken.","De trein is vertrokken."],["Kies de goede zin.","Leg je partner uit waarom je wacht."]],
  ["Je meldt jezelf aan voor een workshop.",["Ik heb … gisteren aangemeld."],["Vul het woord in dat naar jezelf verwijst.","Bedenk hoe je je hebt aangemeld. Vertel het."]],
  ["In een bericht staat:",["Ik weet niet hoe laat begint de les."],["Zet de woorden in de juiste volgorde.","Stel daarna rechtstreeks de vraag naar de begintijd."]],
  ["Je vertelt op dezelfde dag aan een collega wat de monteur zegt.",["De monteur zegt: Ik kom morgen terug."],["Begin met: ‘De monteur zegt dat …’","Leg uit wie er komt."]],
  ["De tafel is niet opgeruimd.",["A. Kun je de tafel opruimen?","B. Had je de tafel niet kunnen opruimen?"],["Vergelijk A en B. Wat hoort de luisteraar waarschijnlijk?","Doe daarna een duidelijk verzoek zonder verwijt."]],
  ["Een collega schrijft:",["Ik heb gisteren niet kunnen gekomen."],["Verbeter de werkwoordgroep.","Leg kort uit wat de collega wil meedelen.","Stel daarna een nieuw moment voor."]],
  ["",["A. Als ik het wist, zou ik je bellen.","B. Als ik het had geweten, zou ik je hebben gebeld."],["Vergelijk de tijd in A en B. In welke zin is de mogelijkheid nog open en in welke is die voorbij?","Bedenk bij elke zin een passende situatie."]],
  ["Je vergelijkt een terugblik met de samenvatting ervan.",["Terugblik: We zouden vrijdag openen, maar de sleutel werd pas maandag geleverd.","Samenvatting: We zijn vrijdag geopend."],["Leg uit waarom de samenvatting niet uit de terugblik volgt.","Maak een nieuwe samenvatting die wel klopt."]],
  ["Een redactie bespreekt deze zin. Een collega denkt dat de begeleider zelf wachtte.",["De begeleider heeft de deelnemers laten wachten."],["Leg uit wie wachtte en wie dat veroorzaakte.","Schrijf de zin opnieuw zodat die rollen duidelijk zijn."]],
  ["In een conceptbrief staat:",["Mocht de zaal niet beschikbaar zijn, dan wijken we uit naar het atelier.","A. De zaal is zeker bezet.","B. Er wordt rekening gehouden met de mogelijkheid dat de zaal niet beschikbaar is."],["Kies de betekenis die past: A of B.","Vergelijk ‘mocht’ met ‘als’. Bespreek het verschil in zekerheid en hoe formeel de zin klinkt."]],
  ["Je vertelt bij een kennismaking waar je woont.",["Ik woon hier.","Ik woont hier."],["Kies de goede zin en zeg hem hardop."]],
  ["Je vraagt bij een kennismaking naar iemands werkplek.",["Waar … u?","Werkwoord: werken"],["Vul de juiste vorm van ‘werken’ in.","Stel de hele vraag."]],
  ["De terugbelafspraak is morgen tussen 10.00 en 11.00 uur.",["De monteur bellen morgen terug."],["Verbeter het onderstreepte werkwoord.","Bevestig daarna wanneer je wordt teruggebeld."],"bellen"],
  ["Je vertelt nu over twee personen.",["Ik neem de bus om acht uur."],["Vervang ‘Ik’ door ‘Wij’ en pas het werkwoord aan.","Zeg de hele zin opnieuw."],"Ik"],
  ["Je wilt een afspraak verzetten. Een alternatief is donderdag om 14.00 uur.",["Mag ik de afspraak verzetten?","Mogen ik de afspraak verzetten?"],["Kies de goede vraag.","Stel de vraag en noem het andere moment."]],
  ["Je vertelt over gisteren.",["Vandaag moet ik tot zes uur werken."],["Verander de zin zodat die over gisteren gaat.","Bedenk wat je daardoor niet kon doen. Vertel het."]],
  ["De nieuwe afspraak is vrijdag om 11.00 uur.",["De afspraak is gisteren verplaatsen naar vrijdag."],["Verbeter het onderstreepte werkwoord.","Bevestig daarna de nieuwe dag."],"verplaatsen"],
  ["Je kunt donderdagavond of vrijdagochtend.",["Omdat ik morgen moet werken, ik kan niet komen."],["Zet de woorden in de juiste volgorde.","Vraag daarna om een nieuwe tijd."]],
  ["Je vertelt op dezelfde dag aan een collega wat Noor zegt.",["Noor zegt: ‘Ik stuur het formulier vanmiddag.’"],["Begin met: ‘Noor zegt dat …’"]],
  ["Je maakt aan een balie een afspraak. Beide zinnen zijn mogelijk.",["A. Ik wil graag een afspraak maken.","B. Ik zou graag een afspraak willen maken."],["Vergelijk A en B. Hoe klinkt elke zin?","Kies één zin en maak de afspraak."]],
  ["Een collega vertelt wanneer je een formulier moet sturen. Het is nog niet duidelijk of vandaag de uiterste datum is.",["A. U moet dit vandaag sturen.","B. U zou dit vandaag moeten sturen."],["Vergelijk A en B.","Stel een vraag om duidelijk te krijgen wat de collega bedoelt."]],
  ["Iemand schrijft:",["Ik had gisteren willen komen, maar mijn trein viel uit."],["Leg uit wat de persoon van plan was en wat er echt gebeurde.","Geef daarna een korte samenvatting zonder je eigen oordeel."]],
  ["Je stelt maandag om 15.00 uur als nieuw moment voor.",["We hebben de afspraak moeten verzet."],["Verbeter het onderstreepte woord.","Leg kort uit wat er is gebeurd en stel het nieuwe moment voor."],"verzet"],
  ["De aanvraag ligt nog bij de manager. Er is nog geen besluit. Morgen wordt de aanvraag beoordeeld.",["A. De aanvraag is goedgekeurd.","B. De aanvraag wordt morgen beoordeeld.","C. De aanvraag zou zijn goedgekeurd."],["Kies de zin die past bij de situatie.","Leg kort uit waarom de andere zinnen te veel of verkeerde informatie geven."]],
  ["Je bespreekt de planning. Er is ruimte op donderdag. Niemand heeft besloten dat de afspraak verplaatst moet worden.",["A. We kunnen de afspraak verplaatsen.","B. We zouden de afspraak kunnen verplaatsen."],["Leg het verschil tussen A en B uit.","Gebruik één variant in een voorstel aan je collega."]],
  ["In een overleg zegt iemand dit. De nieuwe planning noemt maandag. Het is niet bekend wie de fout heeft gemaakt.",["Ik had begrepen dat de levering vrijdag kwam."],["Leg uit wat ‘had begrepen’ hier betekent.","Vraag welke planning nu geldt."]],
  ["Je hebt de informatie alleen via een collega gehoord. De informatie is nog niet bevestigd.",["De zaal wordt vrijdag gesloten."],["Schrijf de zin opnieuw met ‘zou’ om dat verschil duidelijk te maken.","Leg uit wat je daarmee wel en niet beweert."]],
  ["In een evaluatie staat:",["De opmerking was bedoeld als voorstel, maar werd door een deel van de groep opgevat als besluit."],["Leg uit wat ‘was bedoeld’ en ‘werd opgevat’ ieder toevoegen.","Zeg hetzelfde in andere woorden. Voeg geen reden toe die niet in de tekst staat."]],
  ["Je hebt twee bronnen: officiële notulen vermelden het besluit; een collega zegt dat er waarschijnlijk al een besluit is, maar dat er nog geen officiële bevestiging is.",["A. Het besluit is genomen.","B. Het besluit zou zijn genomen."],["Vergelijk A en B.","Koppel elke zin aan een bron en leg het verschil in zekerheid uit."]],
  ["Een klant heeft nog niet op een voorstel gereageerd. Over de reden is niets bekend.",["A. Dat de klant niet reageert, betekent niet dat hij niet akkoord is.","B. Dat de klant niet reageert, hoeft niet te betekenen dat hij niet akkoord is."],["Kies de zin die het best past bij alleen deze informatie.","Leg uit waarom die zin minder stellig is."]]
 ];
 // Explicitly separate given facts from an invented follow-up; retain the original keys.
 const otherCards={
  'TR-PUZZLES-P001-014-R3':['In een bericht ontbreekt één werkwoord. Het begint met ver en heeft negen letters.',['Dinsdag lukt niet. Kunnen we de afspraak ___ naar donderdag?'],['Vul het werkwoord in dat betekent: een afspraak naar een ander tijdstip brengen.','Bedenk waarom dinsdag niet lukt. Maak daarna een bericht met die reden en het nieuwe voorstel.']],
  'TR-PUZZLES-P001-020-R6':['Een projectteam verdeelt taken en spreekt af wie waarover beslist.',['VERANTWOORDELIJKHEID'],['Zoek in dit woord een woord van acht letters dat past bij een vraag. De letters staan direct achter elkaar.','Leg het verschil uit tussen dat woord en verantwoordelijkheid in deze werksituatie.']],
  'TR-PUZZLES-P002-006-R2':['Je kiest hoe je wilt betalen.',['pinnen','contant betalen','overmaken','fietsen'],['Welk woord hoort niet bij betalen?','Kies een van de drie manieren om te betalen. Zeg: Ik betaal …']]
 };
 const verbById=new Map((source?.cards||[]).filter(c=>c.family==='verbs').map((c,i)=>[c.id,verbs[i]]));
 const spellingCards=(source?.cards||[]).filter(c=>c.family==='spelling');
 const spellingById=new Map(spellingCards.map((c,i)=>[c.id,spelling[i]]));
 const verbTitles={'TR-VERBS-P001-006-R1':'Samen in de pauze','TR-VERBS-P001-001-R0':'In de pauze','TR-VERBS-P001-002-R0':'Bij de bushalte','TR-VERBS-P001-009-R2':'Een afspraak regelen','TR-VERBS-P001-016-R4':'Een bericht van een collega','TR-VERBS-P002-001-R0':'Bij een kennismaking','TR-VERBS-P002-002-R0':'Vragen naar werk','TR-VERBS-P002-003-R1':'De terugbelafspraak','TR-VERBS-P002-005-R2':'Een ander moment afspreken','TR-VERBS-P002-006-R2':'Langer werken','TR-VERBS-P002-007-R2':'Een andere dag','TR-VERBS-P002-008-R3':'Een nieuwe tijd afspreken'};
 const spellingTitles=['Wat neem je mee?','In het lokaal','Een warme drank','Met de trein','Winterweer','In de tuin','De route naar huis','Een klein boek','Om negen uur','Lange en korte klinkers','Een aanvraag indienen','Een bevestiging per mail','Welkom bij ons','Meer dan één afbeelding','Ten slotte of tenslotte','Het materiaal dat er ligt','Een verwachting','Trema in een publieksfolder','Zover of zo ver','Afkortingen in een publieksbericht','Op het formulier','Op de envelop','Een bericht voor morgen','Wanneer kun je?','Later aankomen','Afbeeldingen meesturen','Een vraag over je bestelling','Een contactformulier','Een kort bericht','Een klein vel papier','Een reservekopie bewaren','Te veel of een teveel','Een bestand meesturen','Wie organiseert het?','Niet-roker of niet roken','Een bestand openen','Oud-collega of oude collega','Woorden in een beleidsnotitie','Een digitale handleiding redigeren','Niet alles hoeft gecorrigeerd'];
 function standalone(card){
  const original=originals.get(card.id),row=spellingById.get(card.id)||verbById.get(card.id)||otherCards[card.id];
  if(source?.version!=='2026-10-04.e1.r25.1'||!original||original.version!==card.version||original.situation!==card.situation||original.instruction!==card.instruction)return null;
  if(card.id==='TR-PUZZLES-P002-008-R3')return {situation:'',stimuli:['Ik zette de fiets naast de scooter. Die was kapot.'],steps:['Welk voertuig kan ‘Die’ zijn: de fiets of de scooter?','Kies één voertuig. Schrijf de tweede zin opnieuw en noem daarin dat voertuig.'],title:card.title,target:'Die'};
  if(!row)return null;
  return {situation:row[0],stimuli:row[1],steps:row[2],target:row[3]||null,title:verbTitles[card.id]||(spellingById.has(card.id)?spellingTitles[spellingCards.findIndex(c=>c.id===card.id)]:card.id==='TR-PUZZLES-P001-020-R6'?'Een woord in een woord':card.id==='TR-SPELLING-P002-010-R3'?'Een klein vel papier':card.title)};
 }
 const action=/^(?:Vraag|Kies|Zeg|Vertel|Leg|Bespreek|Vergelijk|Maak|Noem|Wijs|Lees|Schrijf|Reageer|Controleer|Gebruik|Geef|Laat|Stel|Vat|Speel|Bekijk|Los|Herschrijf|Onderzoek|Voorspel|Zet|Benoem|Bedenk|Herhaal|Erken|Breng|Herstel|Regel|Verhelder|Beoordeel|Luister|Verbeter|Vul|Verander|Begin|Orden|Formuleer|Weeg|Houd|Verwerk|Bepaal|Vervang|Voeg|Ontleed|Koppel|Bouw|Combineer|Sorteer|Beschrijf|Bied|Beloof|Bestel|Nodig|Bedank|Spreek|Licht|Meld|Kijk|Waarnaar|Waaraan|Doe|Vermijd|In welke|Bij welke|Met welke|Welke|Welk|Wat|Hoe|Waarom|Wanneer|Waar|Wie|Is|Zijn|Kan|Kun)\b/iu;
 function sentences(text){return [...new Intl.Segmenter('nl',{granularity:'sentence'}).segment(text)].map(p=>p.segment.trim()).filter(Boolean);}
 function steps(text){return sentences(text).reduce((list,line)=>{if(!list.length||action.test(line))list.push(line);else list[list.length-1]+=' '+line;return list;},[]);}
 function end(text){return /[.!?…]$/.test(text)?text:text+'.';}
 // Simplify instructions only; quoted exercise language and answer keys stay intact.
 function clearInstruction(text){return wording.text(text)
  .replace(/Welke formulering past grammaticaal en inhoudelijk het best/g,'Welke zin is goed en past het best bij de situatie')
  .replace(/Welke zakelijke formulering past grammaticaal en inhoudelijk het best/g,'Welke zakelijke zin is goed en past het best bij de situatie')
  .replace(/Welke herformulering/g,'Welke versie')
  .replace(/Welke formulering past het best bij deze communicatieve functie:/g,'Welke zin past bij dit doel:')
  .replace(/voorzichtige analytische inferentie/g,'voorzichtige conclusie')
  .replace(/voorzichtige inferentie/g,'voorzichtige conclusie')
  .replace(/Wat is waarschijnlijk de communicatieve functie\?/g,'Wat wil de spreker hiermee bereiken?')
  .replace(/Wat geef je daarmee impliciet aan\?/g,'Wat laat je daarmee merken zonder het direct te zeggen?')
  .replace(/Wat kan hier impliciet worden uitgedrukt\?/g,'Wat kan de spreker hiermee bedoelen zonder het direct te zeggen?')
  .replace(/Wat kan deze uitspraak impliciet betekenen\?/g,'Wat kan de spreker hiermee bedoelen?')
  .replace(/Wat is de (?:meest waarschijnlijke )?impliciete boodschap\?/g,'Wat bedoelt de spreker waarschijnlijk zonder het direct te zeggen?')
  .replace(/Wat kan deze formulering impliciet aangeven\?/g,'Wat kan de spreker hiermee bedoelen zonder het direct te zeggen?')
  .replace(/Wat kan deze reactie impliciet communiceren\?/g,'Wat kan iemand met deze reactie bedoelen?')
  .replace(/Wat maakt daarentegen expliciet\?/g,'Welk verschil maakt ‘daarentegen’ duidelijk?')
;}
 const learnerPhrases={
  C1_NU_008:{
   "Hoe moet misschien hier waarschijnlijk worden geïnterpreteerd?":"Hoe bedoelt de voorzitter ‘misschien’?",
   "Misschien kan een voorstel sociaal zachter maken zonder dat de spreker werkelijk sterk twijfelt over de gewenste stap.\n\nVoorzichtig geformuleerde taal kan inhoudelijk behoorlijk sturend zijn.":"Met ‘misschien’ klinkt het voorstel voorzichtiger. De voorzitter wil wel dat de groep eerst de cijfers controleert.",
   'A. Als bewijs dat de voorzitter zelf niet weet wat verstandig is.':'A. De voorzitter weet zelf niet wat de beste keuze is.',
   'B. Als een verzachter van een inhoudelijk vrij duidelijke sturing.':'B. De voorzitter zegt voorzichtig dat de groep eerst de cijfers moet controleren.',
   'C. Als toestemming om de cijfers eventueel helemaal niet te controleren.':'C. De groep mag het controleren van de cijfers overslaan.'
  },
  C1_NU_028:{
   "Allerminst betekent ongeveer “helemaal niet”. Het klinkt formeler en stelliger dan een gewone ontkenning.\n\nHet woord komt vooral voor in formeel spreken en schrijven.":"‘Allerminst’ betekent ‘helemaal niet’. Het woord klinkt sterker en formeler. De spreker bedoelt dat de verbetering nog niet betekent dat het hele probleem is opgelost.",
   'A. Dat de verbetering wordt geïnterpreteerd als bewijs dat het hele probleem opgelost is.':'A. Dat iemand door de verbetering denkt dat het hele probleem is opgelost.',
   'B. Dat iemand denkt dat er überhaupt enige verbetering was.':'B. Dat iemand denkt dat er ook maar iets is verbeterd.'
  },
  C1_WK_047:{
   "Waarom moet dit expliciet worden gemaakt?":"Waarom moet je dit duidelijk afspreken?",
   "Expliciet maken betekent dat onuitgesproken aannames duidelijk worden benoemd. Dat kan mondeling of schriftelijk gebeuren, afhankelijk van de context.\n\nVeel misverstanden ontstaan juist doordat beide partijen denken dat iets vanzelfsprekend is.":"Zeg duidelijk wie na de oplevering het beheer doet. Zo weten beide teams wat ze van elkaar kunnen verwachten. Dat kan mondeling of schriftelijk.",
   'B. Omdat impliciete verwachtingen verschillend kunnen worden geïnterpreteerd en daardoor later problemen ontstaan.':'B. Omdat de teams zonder duidelijke afspraken iets anders kunnen verwachten. Dat kan later problemen geven.',
   'C. Omdat één van de teams per definitie fout zit.':'C. Omdat één van de teams zeker een fout heeft gemaakt.'
  }
 };
 function learnerText(item,text){return learnerPhrases[item.content_item_id]?.[text]||text;}
 const themeLabels=new Set(['Afspraken','Vrije tijd','Sociaal','Eten en drinken','Winkel','Les','Vervoer','Werk','Thuis','Wonen','Dagelijks leven','Praktisch','Familie','Gezondheid','Participatie','Opleiding']);
 function shared(item,displayPrompt=item.prompt){
  const prompt=wording.text(displayPrompt).trim().replace(/\b(?:Snelvraag|Opdracht):\s*([a-z])/g,(_,c)=>c.toUpperCase()).replace(/\b(?:Snelvraag|Opdracht):\s*/g,'');
  if(!prompt)return null;
  let stimulus=wording.text(item.stimulus).trim(),instruction=prompt,situation=wording.text(item.context).trim(),target=null;
  if(/^WZ_/.test(item.content_item_id)&&['herschrijven','zinnen_leggen','meerkeuze_vorm','fout_verbeteren'].includes(item.exercise_type)&&stimulus&&themeLabels.has(situation))situation='';
  if(item.content_item_id==='ER_B2_078'&&prompt==='De gegevens laten geen duidelijk verband zien. Je wilt voorzichtig formuleren dat er waarschijnlijk geen direct verband is.')return {situation:'De gegevens laten geen duidelijk verband zien.',stimulus:'',words:null,target:null,instruction:'Formuleer voorzichtig dat er waarschijnlijk geen direct verband is.'};
  const reply=prompt.match(/^A:\s*(.*?)\s+B:\s*(Antwoord[\s\S]+)$/);
  if(reply)return {situation,stimulus:'A: '+reply[1]+'\nB: …',words:null,target:null,instruction:reply[2]};
  if(item.order_tokens?.length&&prompt.includes(':'))stimulus=prompt.slice(prompt.indexOf(':')+1).trim();
  if(stimulus&&prompt.endsWith(stimulus))instruction=prompt.slice(0,-stimulus.length).trim().replace(/[:.]+$/,'').trim();
  else if(!stimulus){
   // Move an introductory case before the first task, retaining all of its conditions.
   const lines=sentences(prompt),first=lines.findIndex(t=>action.test(t));
   if(first>0){const intro=lines.slice(0,first).join(' ');situation=situation&&situation!==intro?situation+'\n'+intro:intro;instruction=lines.slice(first).join(' ');}
   const dialogue=instruction.match(/^(.+?[.!?])\s+(A[:.]\s[\s\S]+)$/);
   const marked=instruction.match(/^(.*?)\s*(?:\n(?=A:)|(?:Bron|Achtergrond|Uitgangszin|Informatie|Onderwerp|Referent):\s*|Gebruik als inspiratie:\s*)([\s\S]+)$/);
   const colon=instruction.match(/^((?:Maak|Verbeter|Herstel|Herschrijf|Zet|Orden|Leg|Vul|Kies|Sorteer|Combineer|Vermijd|Wat|Welke)[^:\n]*):\s*([\s\S]+)$/);
   if(dialogue){instruction=dialogue[1];stimulus=dialogue[2].replace(/^A[.] /,'A: ');}
   else if(marked){instruction=marked[1].trim();stimulus=marked[2].trim();}
   else if(colon){instruction=colon[1];stimulus=colon[2];}
   else if(first<0&&/___|…|\.\.\./.test(prompt)){stimulus=prompt;instruction=item.options?.length?'Kies wat op de lege plek past.':'Vul de lege plek in.';}
   if(stimulus){
    const reading=sentences(stimulus),next=reading.findIndex((t,n)=>n>0&&action.test(t)&&! /^(?:Wat|Welke|Welk|Hoe|Waarom|Wanneer|Waar|Wie|Is|Zijn|Kan|Kun|In welke)\b/i.test(t));
    if(next>0){instruction=end(instruction)+' '+reading.slice(next).join(' ');stimulus=reading.slice(0,next).join(' ');}
   }
  }
  if(!instruction)return null;
  instruction=instruction[0].toUpperCase()+instruction.slice(1);
  if(stimulus){
   if(instruction==='Kies')instruction=/___|…|\.\.\./.test(stimulus)?'Kies wat op de lege plek past':'Kies het juiste antwoord';
   if(instruction==='Verbeter')instruction='Verbeter de zin';
   if(/^(?:Wat|Welke)/.test(instruction)&&!/[.!?]$/.test(instruction)){instruction=instruction.replace(/\b(in|in de zin)$/, 'in deze tekst')+'?';}
  }
  const verbChange=instruction.match(/^Verander het (?:eerste|modale) werkwoord naar (moet|mag|kan|wil|gaat) als dat past$/);
  if(instruction==='Verander alleen het laatste deel'||verbChange){
   const before=stimulus.replace(/[.!?]$/,'').split(' '),after=wording.text(item.model_answer).replace(/[.!?]$/,'').split(' ');
   let n=0,e=0;while(n<before.length&&n<after.length&&before[n]===after[n])n++;
   while(e<before.length-n&&e<after.length-n&&before[before.length-1-e]===after[after.length-1-e])e++;
   if(n>0&&n<before.length&&n<after.length){
    target=before.slice(n,before.length-e).join(' ');
    if(verbChange){
     const verb={moet:'moeten',mag:'mogen',kan:'kunnen',wil:'willen',gaat:'gaan'}[verbChange[1]];
     instruction='Vervang het onderstreepte werkwoord door ‘'+verb+'’. Zet het werkwoord in de juiste vorm';
    }else instruction='Vervang het onderstreepte deel door ‘'+after.slice(n,after.length-e).join(' ')+'’';
   }
  }
  const replace=instruction.match(/^(?:Verander|Vervang) [‘']?(.+?)[’']? (?:in|door) .+$/);
  if(!target&&replace&&stimulus.includes(replace[1]))target=replace[1];
  let words=null;
  if(stimulus.includes(' | '))words=stimulus.split(' | ');
  else if((item.interaction_type==='IT_008_ORDER'||/^(?:Zet|Orden|Leg).*(?:volgorde|zinsdelen|hoofdzin)/.test(instruction))&&stimulus.includes(' / '))words=stimulus.split(' / ');
  return {instruction:learnerText(item,clearInstruction(end(instruction))),stimulus,words,target,situation};
 }
 const taskHeadings={betekenis_kiezen:'Kies de betekenis',dialoog_aanvullen:'Maak het gesprek af',fout_verbeteren:'Verbeter de zin',functie_sorteren:'Sorteer de zinnen',herschrijven:'Schrijf de zin opnieuw',invullen:'Vul de zin aan',meerkeuze_context:'Kies wat bij de situatie past',meerkeuze_vorm:'Kies de juiste vorm',referent_kiezen:'Waar verwijst het woord naar?',register_kiezen:'Kies wat bij de situatie past',scenario:'Wat zeg je?',snelvraag:'Vertel',vrije_productie:'Geef je antwoord',zinnen_leggen:'Zet de woorden in volgorde'};
 function heading(item){return wording.text(item.title||taskHeadings[item.exercise_type]||'Maak de opdracht');}
 function readAloud(card){const p=standalone(card);return p?[p.situation,...p.stimuli,...p.steps].filter(Boolean).join(' '):card.mediaRequirements?.readAloudText||card.instruction;}
 const api={standalone,shared,steps,heading,clearInstruction,learnerText,readAloud};if(typeof module==='object'&&module.exports)module.exports=api;else root.CardPresentation=api;
})(typeof globalThis!=='undefined'?globalThis:this);
