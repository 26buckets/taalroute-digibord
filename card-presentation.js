(function(root){
 'use strict';
 const source=typeof module==='object'&&module.exports?require('./data/e1-release.js'):root.E1Release;
 const wording=typeof module==='object'&&module.exports?require('./wording.js'):root.AppWording;
 const originals=new Map((source?.cards||[]).map(c=>[c.id,c]));
 // [Situation, separate reading material, steps] keeps the retained task and answer intact.
 const spelling=[
  ['Je neemt iets mee.',['tas','taas'],['Wijs het juiste woord aan.','Zeg: Dit is mijn …']],
  ['Je kijkt naar het raam in het lokaal.',['r…m'],['Vul één of twee a’s in.','Zeg het woord hardop.']],
  ['Op een kaartje staat:',['Een kop kofee.'],['Verbeter het woord kofee.','De docent mag het woord eerst voorlezen.']],
  ['Je gaat met de trein.',['reis','rijs'],['Kies het woord voor je tocht.','Vertel waar de reis naartoe gaat.']],
  ['Het is winter.',['Het is k…d.'],['Vul au of ou in.','Vertel wat je aantrekt.']],
  ['Op een briefje over de tuin staat:',['We planten twee boomen.'],['Verbeter het woord boomen.']],
  ['Je beschrijft een route.',['Je loopt langs het …','station','stasion'],['Kies het juiste woord.','Geef daarna nog een stap van de route.']],
  ['Je krijgt een klein boek.',['boek…','je','tje'],['Maak het verkleinwoord. Kies je of tje.','Vertel waarvoor je het gebruikt.']],
  ['In een bericht staat:',['De les begind om negen uur.'],['Verbeter de spelling van begind.','Houd het onderwerp en de tijd hetzelfde.']],
  ['', ['bomen','ramen','katten','pennen'],['Maak twee groepen: woorden met één medeklinker in het midden en woorden met twee dezelfde medeklinkers in het midden.','Lees de woorden in elke groep voor.']],
  ['Je maakt een titel voor een formulier.',['aanvraagformulier','aanvraag formulier'],['Kies de juiste schrijfwijze.','Leg uit wat voor formulier het is.']],
  ['Je hebt de bevestiging al verstuurd.',['Ik heb de bevestiging ge…','Werkwoord: mailen'],['Vul de hele werkwoordsvorm in.']],
  ['Op een uitnodiging staat:',['U bent van harte welkom op onze informatie avond.'],['Verbeter de spelling van informatie avond.','Leg uit voor wie de avond is.']],
  ['In de eerste versie van een verslag staat één foto. In de tweede versie staan er twee.',['foto → twee …'],['Maak het meervoud van foto.','Leg uit waarom het teken nodig is.']],
  ['', ['A. Ten slotte bedankte de voorzitter iedereen.','B. Je kunt het nog proberen; je bent tenslotte op tijd.'],['Leg het verschil in betekenis uit tussen ten slotte en tenslotte.','Maak met elke vorm een nieuwe zin.']],
  ['', ['papier','stoel','plastic','tafel'],['Maak twee groepen: materialen en voorwerpen.','Maak van elk materiaal een bijvoeglijk naamwoord bij tas of map.']],
  ['', ['A. Ik ga ervan uit dat iedereen komt.','B. Ik ga er vanuit dat iedereen komt.'],['Kies de juiste spelling voor deze betekenis.','Leg uit welke woorden je aan elkaar schrijft.']],
  ['In een folder staan twee woorden. Het gaat om een vervallen gebouw en een bijeenkomst van mensen die elkaar terugzien.',['ruine','reunie'],['Verbeter beide woorden.','Leg uit hoe het trema helpt bij het lezen.']],
  ['Je controleert drie zinnen voor een publieksbericht.',['A. Voor zover bekend is er geen schade.','B. De ingang ligt zo ver weg dat een bordje nodig is.','C. Ik wist niet dat het al zover was.'],['Leg de spelling van zover en zo ver in A en B uit.','Leg uit wat zover in C kan betekenen.']],
  ['In een vacature staat:',['We bieden een EU stage en vragen later een BTW nummer.'],['Verbeter de spelling.','Leg uit wanneer je een afkorting voor de lezer uitschrijft.']],
  ['Je vult een bezorgformulier in.',['adres','adress'],['Kies het juiste woord.','Zeg: Mijn adres is … Je mag een straatnaam en huisnummer bedenken.']],
  ['Je schrijft een adres op een envelop.',['str…t'],['Vul de ontbrekende letters in. Het woord is straat.','Noem daarna een straatnaam. Je mag die zelf bedenken.']],
  ['Je stuurt je buurvrouw een bericht.',['Morgen ben ik thuus.'],['Verbeter één woord.','Lees het hele bericht hardop.']],
  ['Je geeft aan wanneer je kunt.',['in het weekend','in het week end'],['Kies de juiste schrijfwijze.','Vertel wanneer je in het weekend kunt.']],
  ['Je stuurt een bericht over een afspraak.',['Ik ben te laat.','Ik ben telaat.'],['Kies de juiste spelling.','Maak een kort bericht. Vertel hoeveel minuten later je komt. Je mag het aantal zelf kiezen.']],
  ['Je stuurt een e-mail met twee afbeeldingen.',['foto → twee …','Ik stuur twee … mee.'],['Maak het meervoud van foto.','Maak de zin af.']],
  ['Dit is de onderwerpregel van een e-mail:',['Vraag aan de klanten service.'],['Verbeter de spelling in de onderwerpregel.','Stel daarna één korte vraag over een bestelling. Je mag die zelf bedenken.']],
  ['Je vult een contactformulier in.',['e-mailadres','emailadres','e mailadres'],['Kies de juiste schrijfwijze.','Vraag je partner om een e-mailadres. Die mag een adres bedenken.']],
  ['Je bedoelt één klein of kort sms-bericht.',['sms → een …'],['Maak het verkleinwoord van sms.','Gebruik het in een korte zin.']],
  ['Bij een balie vraagt iemand om één klein vel papier van A4-formaat.',['A4’tje','A4-tje'],['Welke schrijfwijze is goed?','Leg uit waarom je hier een apostrof gebruikt.']],
  ['Je bedoelt een bestand dat je als reservekopie bewaart.',['back-upbestand','backup bestand','back upbestand'],['Kies de juiste schrijfwijze.','Schrijf één korte instructie voor een collega.']],
  ['Je controleert een factuur.',['Ik heb te veel betaald.','Het teveel aan verzendkosten wordt terugbetaald.'],['Leg uit waarom te veel en teveel hier verschillend worden geschreven.','Maak met elke vorm een nieuwe zin.']],
  ['Je schrijft een instructie over een bestand in pdf-formaat.',['pdf-bestand','PDF bestand','pdf bestand'],['Kies de juiste schrijfwijze.','Maak een korte zin waarin je iemand vraagt het bestand mee te sturen.']],
  ['In een projectmail ontbreekt een trema.',['coordinator'],['Schrijf het woord met het trema.','Leg uit wat het trema duidelijk maakt over de uitspraak.']],
  ['Een buurthuis gebruikt deze twee teksten:',['Alleen voor niet-rokers.','Hier niet roken.'],['Vergelijk niet-rokers en niet roken. Leg het verschil uit.','Maak met elke vorm een nieuwe zin.']],
  ['In een handleiding staat:',['Open het gedownloadde bestand.'],['Verbeter de spelling van gedownloadde.','Leg uit waarom je in de juiste vorm één d voor de uitgang schrijft.']],
  ['Je bedoelt iemand met wie je vroeger werkte.',['oud-collega','oude collega'],['Kies de vorm die daarbij past.','Leg uit wat de andere vorm kan betekenen.']],
  ['Je controleert drie woordgroepen in een beleidsnotitie.',['niet lid','niet-roker','nog niet ingeschreven deelnemer'],['Verbeter de spelling waar dat nodig is. Bij niet lid gaat het om een zelfstandig naamwoord.','Leg per woordgroep uit waarom je wel of geen koppelteken gebruikt.']],
  ['Je controleert deze instructie:',['Mail het PDF bestand naar het emailadres en bewaar ook een backupbestand.'],['Verbeter alleen de spelling en de leestekens waar dat nodig is.','Houd de inhoud en de volgorde gelijk.','Leg twee van je keuzes uit aan een collega.']],
  ['Een redacteur wil in elk paar één vorm verbieden.',['typfout / typefout','niet ingevulde formulieren / niet-ingevulde formulieren'],['Beoordeel beide paren. Welke vormen zijn toegestaan?','Leg uit wat fout is en wat een keuze in de huisstijl kan zijn.']]
 ];
 const spellingCards=(source?.cards||[]).filter(c=>c.family==='spelling');
 const spellingById=new Map(spellingCards.map((c,i)=>[c.id,spelling[i]]));
 function standalone(card){
  const original=originals.get(card.id),row=spellingById.get(card.id);
  if(source?.version!=='2026-10-04.e1.r25.1'||!original||original.version!==card.version||original.situation!==card.situation||original.instruction!==card.instruction)return null;
  if(card.id==='TR-PUZZLES-P002-008-R3')return {situation:'',stimuli:['Ik zette de fiets naast de scooter. Die was kapot.'],steps:['Welk voertuig kan ‘Die’ zijn: de fiets of de scooter?','Kies één voertuig. Schrijf de tweede zin opnieuw en noem daarin dat voertuig.'],title:card.title,target:'Die'};
  if(!row)return null;
  return {situation:row[0],stimuli:row[1],steps:row[2],title:card.id==='TR-SPELLING-P002-010-R3'?'Een klein vel papier':card.title};
 }
 function shared(item){
  const stimulus=wording.text(item.stimulus).trim(),prompt=wording.text(item.prompt).trim();
  if(!stimulus||!prompt.endsWith(stimulus))return null;
  let instruction=prompt.slice(0,-stimulus.length).trim().replace(/[:.]+$/,'').trim();
  if(!instruction)return null;
  let target=null;
  if(instruction==='Verander alleen het laatste deel'){
   const before=stimulus.replace(/[.!?]$/,'').split(' '),after=wording.text(item.model_answer).replace(/[.!?]$/,'').split(' ');
   let n=0;while(n<before.length&&n<after.length&&before[n]===after[n])n++;
   if(n>0&&n<before.length&&n<after.length){target=before.slice(n).join(' ');instruction='Vervang het onderstreepte deel door ‘'+after.slice(n).join(' ')+'’';}
  }
  return {instruction:instruction+'.',stimulus,words:stimulus.includes(' | ')?stimulus.split(' | '):null,target};
 }
 const api={standalone,shared};if(typeof module==='object'&&module.exports)module.exports=api;else root.CardPresentation=api;
})(typeof globalThis!=='undefined'?globalThis:this);
