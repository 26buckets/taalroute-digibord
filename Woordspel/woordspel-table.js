/* Original, compatible word banks and sentence examples for Praatpad's free table. */
(()=>{
'use strict';
const {subj,verbs,levels,makeTasks}=globalThis.PraatpadWordspelContent;
const kinds={
 subject:{label:'Subject',icon:'user-round',hint:'Wie? Bijvoorbeeld ik of wij.'},
 verb:{label:'Werkwoord',icon:'zap',hint:'Wat gebeurt er? Of: hebben, zijn, willen.'},
 time:{label:'Tijd',icon:'clock',hint:'Bijvoorbeeld vandaag of morgen.'},
 rest:{label:'Aanvulling',icon:'puzzle',hint:'Bijvoorbeeld een boek of met een collega.'},
 place:{label:'Plaats',icon:'map-pin',hint:'Bijvoorbeeld thuis of op kantoor.'},
 secondVerb:{label:'Tweede werkwoord',icon:'zap',hint:'Bijvoorbeeld gewerkt of werken.'},
 link:{label:'Verbinding',icon:'link',hint:'Verbind met de volgende zin.'}
};
// Alternatives describe the same sense of each verb. Locked complements constrain new verbs.
const contexts={
 'werken':{rest:['aan een opdracht','met een collega','aan een verslag'],place:['thuis','op kantoor','in de bibliotheek'],reason:['er ligt veel werk','er veel werk ligt'],result:'het werk op tijd klaar is',condition:'is een rustige plek prettig'},
 'koken':{rest:['voor de buren','voor vrienden','voor de familie'],place:['thuis','in de keuken','op de camping'],reason:['er komt bezoek','er bezoek komt'],result:'iedereen op tijd kan eten',condition:'is een grote pan handig'},
 'wonen':{rest:['met familie','met vrienden','met een partner'],place:['in de stad','in een dorp','in een appartement'],requiredPlace:true,reason:['de huur is betaalbaar','de huur betaalbaar is'],result:'de reistijd korter is',condition:'is goed contact met de buren prettig'},
 'eten':{rest:['een appel','een broodje','een salade'],place:['thuis','op kantoor','in de keuken'],reason:['het is etenstijd','het etenstijd is'],result:'er weer energie is',condition:'is een korte pauze prettig'},
 'lezen':{rest:['een boek','een brief','een bericht'],place:['thuis','in de bibliotheek','in de trein'],reason:['de tekst is interessant','de tekst interessant is'],result:'de informatie duidelijk is',condition:'is voldoende licht prettig'},
 'meenemen':{rest:['een tas','een boek','een broodje'],requiredRest:true,place:['naar school','naar kantoor','naar de cursus'],reason:['dat is onderweg handig','dat onderweg handig is'],result:'alles bij de hand is',condition:'komt dat onderweg van pas'},
 'opstaan':{rest:['zonder wekker','met moeite','zonder hulp'],place:['thuis','in het hotel','op de camping'],reason:['de dag begint vroeg','de dag vroeg begint'],result:'er genoeg tijd voor het ontbijt is',condition:'is er tijd om rustig te beginnen'},
 'zich wassen':{rest:['met zeep','met warm water','met koud water'],place:['thuis','in de badkamer','op de camping'],reason:['hygiëne is belangrijk','hygiëne belangrijk is'],result:'het lichaam weer schoon is',condition:'is een schone handdoek prettig'},
 'overleggen':{rest:['met een collega','over de planning','over een voorstel'],place:['op kantoor','in de vergaderzaal','op school'],reason:['er is een besluit nodig','er een besluit nodig is'],result:'de taakverdeling duidelijk is',condition:'wordt de taakverdeling duidelijker'},
 'uitzoeken':{rest:['een nieuwe fiets','een jas','een cadeau'],requiredRest:true,place:['in de winkel','op de markt','thuis'],reason:['er is iets nieuws nodig','er iets nieuws nodig is'],result:'er een passende keuze is',condition:'is goed vergelijken verstandig'},
 'zich aanmelden':{rest:['voor de cursus','voor een workshop','voor een bijeenkomst'],place:['op school','bij de balie','in de bibliotheek'],reason:['er is nog plaats','er nog plaats is'],result:'deelname mogelijk is',condition:'volgt er een bevestiging'},
 'toelichten':{rest:['het voorstel','de planning','een besluit'],requiredRest:true,place:['op kantoor','in de vergaderzaal','op school'],reason:['er zijn vragen','er vragen zijn'],result:'de bedoeling duidelijk is',condition:'kan iedereen gerichte vragen stellen'},
 'zich voorbereiden':{rest:['op het gesprek','op de toets','op een presentatie'],place:['thuis','in de bibliotheek','op school'],reason:['het is een belangrijk moment','het een belangrijk moment is'],result:'het vertrouwen kan groeien',condition:'verloopt het meestal rustiger'}
};
const timeBank=[
 {w:'vandaag',min:0,t:['present','past','perfect','modal']},
 {w:'morgen',min:0,t:['present','modal']},
 {w:'elke week',min:0,t:['present','past','modal']},
 {w:'gisteren',min:0,t:['past','perfect']},
 {w:'vorige week',min:0,t:['past','perfect']},
 {w:'volgende week',min:1,t:['present','modal']},
 {w:'deze maand',min:1,t:['present','past','perfect','modal']},
 {w:'binnenkort',min:2,t:['present','modal']},
 {w:'onlangs',min:2,t:['past','perfect']},
 {w:'regelmatig',min:2,t:['present','past','perfect','modal']}
];
const linkBank=[{w:'en',min:0},{w:'maar',min:0},{w:'want',min:1},{w:'omdat',min:1},{w:'als',min:2},{w:'dat',min:2},{w:'terwijl',min:2},{w:'hoewel',min:3},{w:'zodat',min:3},{w:'waarom',min:3}];
const forcedLinks={dat:'dat',als:'als',although:'hoewel',indirect:'waarom'};
function defaults(){return {cards:{subject:true,verb:true,rest:false,time:false,place:false,secondVerb:false,link:false},picks:{rest:'',time:'vandaag',place:'',secondVerb:'perfect',link:'en'},showLabels:true,allowExample:true}}
function readConfig(value){
 const out=defaults();if(!value||typeof value!=='object')return out;
 for(const k of Object.keys(kinds))if(typeof value.cards?.[k]==='boolean')out.cards[k]=value.cards[k];
 if(!Object.values(out.cards).some(Boolean))out.cards=defaults().cards;
 for(const k of Object.keys(out.picks))if(typeof value.picks?.[k]==='string'&&value.picks[k].length<=160)out.picks[k]=value.picks[k];
 for(const k of ['showLabels','allowExample'])if(typeof value[k]==='boolean')out[k]=value[k];return out;
}
const context=s=>contexts[verbs[s.verb].w];
const task=s=>makeTasks[s.level][s.task][0];
const tense=s=>task(s)==='past'?'past':task(s)==='perfect'?'perfect':task(s)==='modal'?'modal':s.table.cards.secondVerb?(s.table.picks.secondVerb==='perfect'?'perfect':'modal'):'present';
const conditional=s=>s.level==='B2'&&task(s)==='modal';
function secondText(s){return s.table.picks.secondVerb==='perfect'?verbs[s.verb].pp:(conditional(s)?'willen ':'')+verbs[s.verb].w.replace('zich ','')}
function primaryText(s){return !s.table.cards.secondVerb?verbs[s.verb].w:s.table.picks.secondVerb==='perfect'?(verbs[s.verb].aux==='z'?'zijn':'hebben'):conditional(s)?'zouden':'willen'}
const activeKeys=s=>Object.keys(kinds).filter(k=>s.table.cards[k]);
function baseVerbs(s){return verbs.flatMap((v,i)=>v.min<=levels.indexOf(s.level)&&(s.mode!=='make'||s.series==='all'||v.tags.includes(s.series))?[i]:[])}
function verbPool(s){
 return baseVerbs(s).filter(i=>s.mode!=='make'||(!s.table.cards.secondVerb||!s.locks.secondVerb||i===s.verb)&&['rest','place'].every(k=>!s.table.cards[k]||!s.locks[k]||contexts[verbs[i].w][k].includes(s.table.picks[k])));
}
function pool(s,k){
 if(k==='subject')return subj.map((_,i)=>i);
 if(k==='verb')return verbPool(s);
 if(k==='rest'||k==='place')return context(s)[k];
 const id=task(s),level=levels.indexOf(s.level);
 if(k==='secondVerb'){
  const forms=id==='perfect'?['perfect']:['modal','tomorrow'].includes(id)?['infinitive']:['perfect','infinitive'];
  return s.table.cards.secondVerb&&s.table.cards.verb&&s.locks.verb&&forms.includes(s.table.picks.secondVerb)?[s.table.picks.secondVerb]:forms;
 }
 if(k==='time'){
  if(id==='today')return ['vandaag'];if(id==='tomorrow')return ['morgen'];
  return timeBank.filter(v=>v.min<=level&&v.t.includes(tense(s))).map(v=>v.w);
 }
 if(k==='link'){
  if(forcedLinks[id])return [forcedLinks[id]];
  return linkBank.filter(v=>v.min<=level&&v.w!=='waarom'&&
   (id!=='question'||['en','maar','omdat','terwijl'].includes(v.w))&&
   (!['today','tomorrow','perhaps'].includes(id)||!['dat','als','hoewel'].includes(v.w))&&
   (!['past','perfect'].includes(tense(s))||v.w!=='zodat')).map(v=>v.w);
 }
 return [];
}
function reconcile(s){
 const notes=[],oldPrimary=primaryText(s);
 const release=k=>{if(s.locks[k])notes.push(kinds[k].label+' is losgelaten omdat de kaart niet bij de nieuwe instellingen past.');s.locks[k]=false};
 let candidates=verbPool(s);
 if(!candidates.length){for(const k of ['rest','place','secondVerb'])release(k);candidates=baseVerbs(s)}
 if(!candidates.includes(s.verb)){release('verb');s.verb=candidates[0]}
 for(const k of ['secondVerb','rest','time','place','link']){const choices=pool(s,k);if(!choices.includes(s.table.picks[k])){release(k);s.table.picks[k]=choices[0]}}
 if(s.table.cards.verb&&primaryText(s)!==oldPrimary)release('verb');
 return notes;
}
function selection(s,k){return ['subject','verb'].includes(k)?s[k]:s.table.picks[k]}
function value(s,k){return k==='verb'?s.verb+':'+primaryText(s):k==='secondVerb'?secondText(s):selection(s,k)}
function text(s,k){return k==='subject'?subj[s.subject].label:k==='verb'?primaryText(s):k==='secondVerb'?secondText(s):s.table.picks[k]}
function canChange(s,k){return !s.locks[k]&&pool(s,k).some(v=>v!==selection(s,k))}
function change(s,k,random=Math.random){
 if(!canChange(s,k))return;
 const options=pool(s,k).filter(v=>v!==selection(s,k)),selected=options[Math.min(options.length-1,Math.floor(random()*options.length))];
 if(k==='subject'||k==='verb')s[k]=selected;else s.table.picks[k]=selected;
 reconcile(s);
}
function compatibleTasks(s){
 return makeTasks[s.level].flatMap((_,i)=>{
  const trial=structuredClone(s);trial.task=i;reconcile(trial);
  return activeKeys(s).every(k=>!s.locks[k]||value(s,k)===value(trial,k))?[i]:[];
 });
}
function sentence(s){
 const v=verbs[s.verb],who=subj[s.subject],ctx=context(s),id=task(s),cards=s.table.cards;
 const t=cards.secondVerb&&id==='past'?(s.table.picks.secondVerb==='perfect'?'pluperfect':'modalPast'):tense(s);
 const rest=cards.rest?s.table.picks.rest:ctx.requiredRest?ctx.rest[0]:'';
 const place=cards.place?s.table.picks.place:ctx.requiredPlace?ctx.place[0]:'';
 const time=cards.time?s.table.picks.time:'';
 const adverb=id==='often'?'vaak':id==='also'?'ook':'';
 const ref=v.ref?who.r:'';
 const words=(...parts)=>parts.flat(Infinity).filter(Boolean).join(' ');
 const finite=(invert=false)=>t==='pluperfect'?(v.aux==='z'?(who.n===3?'waren':'was'):(who.n===3?'hadden':'had')):t==='modalPast'?(who.n===3?'wilden':'wilde'):t==='past'?v.past[who.n===3?1:0]:t==='perfect'?who[v.aux]:t==='modal'?(conditional(s)?(who.n===3?'zouden':'zou'):(who.n===3?'willen':who.n===1?'wilt':'wil')):v.p[who.n===1&&invert?0:who.n];
 const tail=['perfect','pluperfect'].includes(t)?v.pp:['modal','modalPast'].includes(t)?[conditional(s)?'willen':'',v.w.replace('zich ','')]:v.particle||'';
 const prefix=id==='today'?'vandaag':id==='tomorrow'?'morgen':id==='perhaps'?'misschien':'';
 const restAndPlace=ctx.requiredRest||['eten','lezen'].includes(v.w)?[rest,place]:[place,rest];
 const middle=words(ref,time===prefix?'':time,adverb,restAndPlace);
 const question=id==='question';
 const main=prefix?words(prefix,finite(true),who.word,middle,tail):question?words(finite(true),who.word,middle,tail):words(who.word,finite(),middle,tail);
 const subTail=['present','past'].includes(t)?(v.particle||'')+finite():words(finite(),tail);
 const sub=words(who.word,ref,time,adverb,restAndPlace,subTail);
 const link=cards.link?s.table.picks.link:forcedLinks[id];
 let output=main;
 if(link==='dat')output='ik vertel dat '+sub;
 if(link==='waarom')output='ik vraag me af waarom '+sub;
 if(link==='als')output='als '+sub+', '+ctx.condition;
 if(link==='hoewel')output='hoewel '+sub+', is dat niet altijd gemakkelijk';
 if(link==='en')output=main+(question?' en gaat dat goed':' en dat gaat goed');
 if(link==='maar')output=main+(question?', maar is dat wel haalbaar':', maar dat is niet altijd gemakkelijk');
 const reason=ctx.reason.map(text=>['past','perfect','pluperfect','modalPast'].includes(t)?text.replace(/\b(is|zijn|ligt|komt|begint)\b/g,w=>({is:'was',zijn:'waren',ligt:'lag',komt:'kwam',begint:'begon'})[w]):text);
 if(link==='want')output=main+', want '+reason[0];
 if(link==='omdat')output=main+', omdat '+reason[1];
 if(link==='terwijl')output=main+', terwijl iemand '+(['past','perfect','pluperfect','modalPast'].includes(t)?'wachtte':'wacht');
 if(link==='zodat')output=main+', zodat '+ctx.result;
 return output.charAt(0).toUpperCase()+output.slice(1)+(question?'?':'.');
}
globalThis.PraatpadWordspelTable={kinds,contexts,timeBank,linkBank,defaults,readConfig,activeKeys,pool,verbPool,reconcile,text,value,canChange,change,compatibleTasks,sentence};
})();
