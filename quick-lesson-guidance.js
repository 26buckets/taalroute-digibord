// Lesson support is separate from the frozen tasks and saved content versions.
(function(root){
 'use strict';
 const source=typeof module==='object'&&module.exports?require('./data/e1-release.js'):root.E1Release;
 const cases=typeof module==='object'&&module.exports?require('./data/quick-lesson-cases.js'):root.QuickLessonCases;
 const items=new Map(Object.values(source?.banks||{}).filter(b=>b.family_id==='quick').flatMap(b=>b.items).map(i=>[i.content_item_id,i]));
 const starts={Bestel:'Je bestelt',Zeg:'Je zegt',Noem:'Je noemt',Vertel:'Je vertelt',Beschrijf:'Je beschrijft',Vraag:'Je vraagt',Kies:'Je kiest',Geef:'Je geeft',Regel:'Je regelt',Bied:'Je biedt',Nodig:'Je nodigt',Bedank:'Je bedankt',Meld:'Je meldt',Spreek:'Je spreekt',Doe:'Je doet',Formuleer:'Je formuleert',Maak:'Je maakt',Stel:'Je stelt'};
 function task(item){return item.prompt.split(/(?<=[.!?])\s+/).filter(s=>/^(Bestel|Zeg|Noem|Vertel|Beschrijf|Leg uit|Vraag|Kies|Geef|Regel|Bied|Nodig|Bedank|Meld|Spreek|Doe|Formuleer|Maak|Stel|Vat|Licht|Weeg|Bevraag)\b/.test(s)).join(' ')}
 function outcome(text){return text.replace(/^Vat samen /,'Je vat samen ').replace(/^Leg uit /,'Je legt uit ').replace(/^Vat (.*?) samen\./,'Je vat $1 samen.').replace(/^(\w+)\b/,word=>starts[word]||word)}
 const checks={
  vertel:'Laat de luisteraar kort terugzeggen wat er is verteld. Is de gevraagde informatie duidelijk? Geef bij een onduidelijk deel één voorbeeld en laat de cursist dat deel opnieuw proberen.',
  vraag:'Speel de aangesproken persoon. Beantwoord alleen wat echt wordt gevraagd. Ontbreekt er iets om te kunnen antwoorden? Noem dat en laat de cursist de vraag aanvullen.',
  kies:'Laat de cursist een van de genoemde mogelijkheden kiezen. Een andere voorkeur dan die van de docent is ook goed. Vraag alleen om een reden als die in de opdracht wordt gevraagd.',
  regel:'Speel de persoon tegen wie de cursist spreekt. Zeg terug wat je hebt begrepen en reageer op het verzoek, aanbod of voorstel. Laat de cursist een onduidelijk deel opnieuw formuleren.'
 };
 const discussion={
  vertel:'Wat heb je de ander horen vertellen? Welk woord of welke zin hielp je om het te begrijpen?',
  vraag:'Wist de ander welke informatie je wilde? Welke vraag leverde die informatie op?',
  kies:'Welke mogelijkheid heb je gekozen? Kon de ander je keuze begrijpen?',
  regel:'Wat wilde de spreker regelen? Was duidelijk wat de ander kon doen of antwoorden?'
 };
 const activity={vertel:'Eén cursist vertelt; een ander luistert en zegt kort terug wat die heeft begrepen.',vraag:'Werk in tweetallen. Eén cursist stelt de vraag; de ander antwoordt. Wissel daarna van rol.',kies:'Laat eerst iedereen een eigen keuze maken. Bespreek daarna twee verschillende antwoorden.',regel:'Werk in tweetallen. Eén cursist doet de opdracht; de ander reageert als gesprekspartner. Wissel daarna van rol.'};
 function lesson(item){
  const original=items.get(item.content_item_id);
  if(source?.version!=='2026-10-04.e1.r25.1'||!original||item.version!==original.version||item.prompt!==original.prompt||item.content_bank_id!==original.content_bank_id)return null;
  const match=item.content_item_id.match(/^sq-r([0-6])-(circle|square|triangle|diamond)-(\d{3})$/);
  if(!match)return null;
  const route=Number(match[1]),number=Number(match[3]),topic=item.topic,context=route>=3?cases.scenarios[number-1]:null;
  let goal=outcome(task(item)),help=item.help,check=checks[topic],discuss=discussion[topic];
  if(topic==='vertel'&&route<3)help=cases.tellStarts[route][number-1];
  if(route===0){check+=' Een kort antwoord is genoeg; maak er geen uitlegopdracht van.';}
  if(context){
   if(topic==='vraag')help='Hoe zit het met …? Kunt u uitleggen …?';
   if(topic==='kies')help=route<5?'Ik kies …, omdat … Een nadeel is …':'Ik kies …, zolang … Als …, kies ik liever …';
   if(topic==='regel')help=route<5?'Ik stel voor dat … Kan dat voor jou?':'Zou het mogelijk zijn om …? Dan … We moeten nog afspreken …';
   if(topic==='vertel')goal=route===3?[
    'Je vertelt kort wat er gebeurt en noemt een belangrijk gevolg bij ',
    'Je legt uit wat lastig is aan ',
    'Je vertelt wat de betrokken mensen al weten over ',
    'Je legt uit wat er voor de betrokken mensen verandert bij ',
    'Je geeft iemand een korte uitleg over '
   ][(number-1)%5]+context[0]+'.':'Je geeft een duidelijke uitleg over '+context[0]+'.';
   else if(topic==='vraag')goal='Je vraagt om duidelijkheid over '+context[0]+'.';
   else if(topic==='kies')goal='Je kiest tussen de genoemde mogelijkheden. Je legt uit wat bij '+context[0]+' voor jou belangrijk is.';
   else goal='Je maakt met de ander een afspraak of doet een verzoek of voorstel over '+context[0]+'.';
   check+=' Let bij deze kaart op '+context[0]+'.';
   discuss=context[1];
   if(topic==='vertel')help=['Er gebeurt … Daardoor …','Aan de ene kant … Aan de andere kant …','Volgens … Maar … We weten nog niet …','Dit kan betekenen dat … Dat betekent nog niet dat …'][route-3];
   if(route>=4)goal+=' Je neemt ook het extra gegeven uit de opdracht mee.';
   if(route>=5)goal+=' Je maakt duidelijk wat zeker is en wat je nog niet weet.';
   if(route===6)goal+=' Je legt uit hoe de woorden verschillend kunnen worden begrepen.';
   if(route>=4)check+=' Laat de cursist ook het extra gegeven uit de opdracht meenemen. Beoordeel de uitleg, niet of je dezelfde mening hebt.';
   if(route>=5)check+=' Vraag welke informatie zeker is en welke uitleg een mogelijkheid blijft.';
   if(route===6)check+=' Laat aanwijzen welke woorden verschillend kunnen worden begrepen.';
  }
  if(topic==='kies'&&route>0)discuss+=' Welke reden past bij de situatie? Er hoeft niet één beste keuze te zijn.';
  if(topic==='vraag'&&context)discuss+=' Welke vraag kun je stellen om dit te controleren?';
  if(topic==='regel'&&context)discuss+=' Wat kun je hierover tegen de ander zeggen? Laat die persoon ook reageren.';
  return {goal,help,check,discussion:discuss,activity:activity[topic]};
 }
 const api={lesson};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuickLessonGuidance=api;
})(typeof globalThis!=='undefined'?globalThis:this);
