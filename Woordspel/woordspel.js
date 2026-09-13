/* Praatpad Woordspel: native classroom module, no network dependencies. */
(()=>{
const MARKUP="\n<section class=\"ws-shell\">\n  <header class=\"ws-header\">\n    <div class=\"ws-brand\"><i data-lucide=\"layers\" aria-hidden=\"true\"></i><div>Woordspel<small>Spreken met woorden</small></div></div>\n    \n    \n    <span class=\"ws-secondary\" data-config-summary></span>\n  </header>\n  <div class=\"ws-body\">\n    <div class=\"ws-heading\"><div><h2 data-heading>Maak en verander</h2><p data-instruction class=\"ws-secondary\">Maak een zin. Vul de rest zelf in.</p></div></div>\n    <div class=\"ws-layout\">\n      <main class=\"ws-stage\" data-stage></main>\n      <aside class=\"ws-mission\" data-mission aria-label=\"Opdracht kiezen\"></aside>\n    <div class=\"ws-example\" data-example hidden><div class=\"ws-secondary\" data-example-label>Een mogelijke zin</div><p class=\"ws-example-text\" data-example-text></p><p class=\"ws-note\" data-example-note></p></div>\n\n    </div>\n  </div>\n  <footer class=\"ws-footer\"><span data-footer>Maak eerst zelf een zin. Bekijk daarna het voorbeeld.</span><span>Startcollectie · A1–B2</span></footer>\n</section>\n<div class=\"ws-live\" role=\"status\" aria-live=\"polite\" data-live></div>\n";

const host=globalThis.PraatpadWordspelHost,board=document.getElementById('praatpad-board');
if(!host||!board||document.getElementById('pp-wordgame'))return;
const root=document.createElement('section');root.id='pp-wordgame';root.lang='nl';root.hidden=true;root.setAttribute('aria-label','Woordspel');
const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('woordspel.css',document.currentScript.src).href;document.head.append(style);
root.innerHTML=MARKUP;board.append(root);
const settingsBox=document.createElement('section');settingsBox.id='pp-wordgame-options';settingsBox.hidden=true;settingsBox.setAttribute('aria-label','Woordspel instellen');settingsBox.innerHTML="<h4>Woordspel instellen</h4><div class=\"pp-wordgame-fields\"><label>Oefenvorm <select data-control=\"mode\"><option value=\"make\">Maak en verander</option><option value=\"guess\">Beschrijf en raad</option><option value=\"combine\">Combineer en beschrijf</option><option value=\"build\">Bouw een zin</option></select></label><label>Niveau <select data-control=\"level\"><option>A1</option><option selected>A2</option><option>B1</option><option>B2</option></select></label><label data-set-label>Serie <select data-control=\"series\"></select></label><label data-task-label>Opdracht <select data-control=\"task\"></select></label></div><label class=\"pp-check\" data-labels-label><input type=\"checkbox\" data-control=\"labels\">Toon de namen van de zinsdelen</label><p class=\"pp-note\" data-setting-description></p><button type=\"button\" id=\"pp-wordgame-start\" class=\"pp-primary\">Speel Woordspel</button>";document.getElementById('pp-panel-dice').append(settingsBox);
const q=s=>root.querySelector(s)||settingsBox.querySelector(s);
const {subj,verbs,nounData,adjectives,guessData,buildData,makeTasks,combineTasks,levels}=globalThis.PraatpadWordspelContent;
const Table=globalThis.PraatpadWordspelTable;
const defaults={mode:'make',level:'A2',series:'all',subject:0,verb:5,noun:0,adj:'zwaar',task:0,locks:{subject:false,verb:false,noun:false,adj:false,rest:false,time:false,place:false,secondVerb:false,link:false},example:false,guess:0,clues:1,revealed:false,build:0,placed:[],pool:[],labels:false,roll:null};
defaults.table=Table.defaults();
const state=structuredClone(defaults);
let tableNotice='';
let assignmentDie=null,assignmentView=null,assignmentTimer=0,assignmentRun=0;
const design={shape:'Kaarten',colors:true};
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function icon(name){const i=document.createElement('i');i.dataset.lucide=name;i.setAttribute('aria-hidden','true');return i}
function button(text,action,cls,iconName){const b=el('button',cls);b.type='button';b.dataset.action=action;if(iconName)b.append(icon(iconName));b.append(document.createTextNode(text));return b}
function announce(text){q('[data-live]').textContent=text}
function pick(list,old){const options=list.filter(x=>x!==old);return options.length?options[Math.floor(Math.random()*options.length)]:old}
function shuffled(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function vPool(){return Table.verbPool(state)}
function gPool(){const series=state.mode==='guess'?state.series:'all',level=levels.indexOf(state.level);return guessData.flatMap((v,i)=>v.min<=level&&v.min>=Math.max(0,level-1)&&(series==='all'||v.type===series)?[i]:[])}
function nPool(){return nounData.flatMap((v,i)=>v.min<=levels.indexOf(state.level)&&(!state.locks.adj||v.adjs.includes(state.adj))?[i]:[])}
function currentBuild(){return buildData[state.level][state.build]}
function setupBuild(){const ids=currentBuild().parts.map((_,i)=>i);state.placed=[];state.pool=shuffled(ids);if(state.pool.every((x,i)=>x===i))state.pool.reverse()}
function tasks(){return state.mode==='make'?makeTasks[state.level]:combineTasks[state.level]}
function closeExample(){state.example=false;state.roll=null}
function cap(t){return t.charAt(0).toUpperCase()+t.slice(1)}
function makeExample(){return Table.sentence(state)}
function combineExample(){
 const n=nounData[state.noun],a=adjectives[state.adj],id=tasks()[state.task][0],dem=n.art==='het'?'dit':'deze',other=n.art==='het'?'dat':'die';
 const subject=cap(dem)+' '+n.w;
 switch(id){
 case 'before':return 'Dit is een '+(n.art==='het'?state.adj:a.f)+' '+n.w+'.';
 case 'question':return state.level==='B1'?'Vind jij '+dem+' '+n.w+' '+state.adj+'?':'Is '+dem+' '+n.w+' '+state.adj+'?';
 case 'mine':return 'Mijn '+n.w+' is '+state.adj+'.';
 case 'opposite':return 'Deze woorden vormen een tegenstelling: '+state.adj+' en '+a.opp+'.';
 case 'two':return subject+' is '+state.adj+'. '+cap(other)+' '+n.w+' is '+a.opp+'.';
 case 'compare':return subject+' is '+a.comp+' dan '+other+' '+n.w+'.';
 case 'reason':return subject+' is '+state.adj+', omdat '+n.reason[state.adj]+'.';
 case 'advice':return subject+' is '+state.adj+'. Ik zou '+n.advice+'.';
 case 'contrast':return subject+' is '+state.adj+', maar niet iedereen vindt dat een probleem.';
 case 'nuance':return 'Of '+dem+' '+n.w+' '+state.adj+' is, hangt af van waarmee je '+(n.art==='het'?'dat':'die')+' vergelijkt.';
 case 'although':return 'Hoewel '+dem+' '+n.w+' '+state.adj+' is, kan '+(n.art==='het'?'dat':'die')+' voor iemand toch geschikt zijn.';
 default:return subject+' is '+state.adj+'.';
 }
}
function tile(type,label,word,key){
 const box=el('div','ws-tile');box.dataset.type=type;
 if(Object.hasOwn(Table.kinds,type)){
  box.classList.add('ws-language-card');box.dataset.locked=String(state.locks[key]);box.setAttribute('role','group');box.setAttribute('aria-label',label+'kaart');
  const face=el('div','ws-card-face'),head=el('div','ws-card-heading'),symbol=el('span','ws-card-symbol');
  symbol.append(icon(type==='subject'?(subj[state.subject].n===3?'users-round':'user-round'):Table.kinds[type].icon));
  const caption=el('span','ws-tile-label',label);caption.hidden=!state.table.showLabels;head.append(symbol,caption);
  const held=el('span','ws-card-held','Vast');held.hidden=!state.locks[key];head.append(held);
  const wordArea=el('div','ws-card-center'),wordText=el('div','ws-tile-word',word.replace(' (meervoud)',''));
  if(word.length>13)wordText.dataset.long='true';wordArea.append(wordText);
  if(word.includes('(meervoud)'))wordArea.append(el('span','ws-card-word-note','meervoud'));
  if(type==='secondVerb'&&verbs[state.verb].ref)wordArea.append(el('span','ws-card-word-note',verbs[state.verb].w));
  face.append(head,wordArea);box.append(face);
 }else box.append(el('span','ws-tile-label',label),el('div','ws-tile-word',word));
 const actions=el('div','ws-tile-actions');
 const lock=button(state.locks[key]?'Vastgezet':'Vastzetten','lock',null,state.locks[key]?'lock-keyhole':'lock-keyhole-open');lock.dataset.key=key;lock.setAttribute('aria-pressed',String(state.locks[key]));lock.setAttribute('aria-label',label+(state.locks[key]?' loslaten':' vastzetten'));
 const next=button('Andere','change',null,'refresh-cw');next.dataset.key=key;next.disabled=Object.hasOwn(Table.kinds,key)?!Table.canChange(state,key):state.locks[key]||(key==='noun'&&nPool().length<2);if(next.disabled&&!state.locks[key])next.title='Er is nu één passende keuze bij deze kaarten en opdracht.';next.setAttribute('aria-label','Andere '+label.toLowerCase());
 actions.append(lock,next);box.append(actions);return box;
}
function setOptions(){
 const series=q('[data-control="series"]');series.replaceChildren();
 const sets=state.mode==='make'?[['all','Alle werkwoorden'],['regular','Regelmatig'],['irregular','Onregelmatig'],['separable','Scheidbaar'],['reflexive','Wederkerig']]:[['all','Alle woorden'],['objects','Voorwerpen en begrippen'],['qualities','Eigenschappen']];
 sets.forEach(([value,name])=>{const opt=el('option',null,name);opt.value=value;series.append(opt)});series.value=state.series;
 q('[data-set-label]').hidden=!['make','guess'].includes(state.mode);
}
function renderMake(stage){
 const keys=Table.activeKeys(state),tiles=el('div','ws-tiles ws-configurable');tiles.dataset.count=String(keys.length);
 keys.forEach(k=>tiles.append(tile(k,Table.kinds[k].label,Table.text(state,k),k)));stage.append(tiles);
 const actions=el('div','ws-actions'),next=button('Volgende ronde','next','ws-primary','arrow-right');next.disabled=!keys.some(k=>Table.canChange(state,k));actions.append(next);
 if(state.table.allowExample)actions.append(button(state.example?'Verberg voorbeeld':'Toon een voorbeeld','example',null,'eye'));stage.append(actions);
 stage.append(el('p','ws-note','Gebruik de kaarten als bouwstenen. Kies zelf de volgorde en vul aan. Vastgezette kaarten blijven liggen.'));
}
function renderCombine(stage){
 const n=nounData[state.noun];const tiles=el('div','ws-tiles');tiles.append(tile('word','Zelfstandig naamwoord',n.art+' '+n.w,'noun'),tile('adj','Eigenschap',state.adj,'adj'));stage.append(tiles);
 const actions=el('div','ws-actions');const next=button('Nieuwe combinatie','next','ws-primary','arrow-right');next.disabled=state.locks.noun&&state.locks.adj;
 actions.append(next,button(state.example?'Verberg voorbeeld':'Toon een voorbeeld','example',null,'eye'));stage.append(actions);
}
function renderGuess(stage){
 const item=guessData[state.guess],box=el('div','ws-guess');
 box.append(el('p','ws-secondary',state.revealed?'Het woord':'Welk woord zoeken we?'));
 box.append(el('div','ws-hidden-word',state.revealed?item.w:'?'));
 const clues=el('div','ws-clues');
 item.clues.slice(0,state.clues).forEach((text,i)=>{const clue=el('div','ws-clue');clue.append(el('span','ws-clue-number',String(i+1)),el('span',null,text));clues.append(clue)});
 box.append(clues);stage.append(box);
 const actions=el('div','ws-actions');const hint=button('Volgende aanwijzing','hint','ws-primary','lightbulb');hint.disabled=state.clues>=item.clues.length||state.revealed;
 const reveal=button(state.revealed?'Verberg het woord':'Onthul het woord','reveal',null,'eye');reveal.setAttribute('aria-expanded',String(state.revealed));
 actions.append(hint,reveal,button('Volgend woord','next',null,'arrow-right'));stage.append(actions);
}
function piece(i,placed){
 const [text,role]=currentBuild().parts[i],b=button('','piece','ws-piece');b.dataset.token=String(i);b.dataset.where=placed?'placed':'pool';b.dataset.role=role;b.draggable=true;
 const label=el('small',null,role);label.hidden=!state.labels;b.append(label,el('span',null,text));b.setAttribute('aria-label',text+' · '+role+(placed?' · terugleggen':' · toevoegen aan je zin'));return b;
}
function renderBuild(stage){
 stage.append(el('p','ws-secondary','Jullie zin'));
 const zone=el('div','ws-build-zone');zone.dataset.zone='placed';zone.setAttribute('aria-label','Gebouwde zin');
 if(!state.placed.length)zone.append(el('span','ws-placeholder','Tik de zinsdelen in de gewenste volgorde aan.'));
 state.placed.forEach(i=>zone.append(piece(i,true)));stage.append(zone);
 const pool=el('div','ws-pool');pool.dataset.zone='pool';pool.setAttribute('aria-label','Losse zinsdelen');state.pool.forEach(i=>pool.append(piece(i,false)));stage.append(pool);
 const actions=el('div','ws-actions');actions.append(button('Volgende zin','next','ws-primary','arrow-right'),button('Opnieuw leggen','restart',null,'rotate-ccw'),button(state.example?'Verberg voorbeeld':'Bekijk een voorbeeld','example',null,'eye'));stage.append(actions);
 stage.append(el('p','ws-note','Tik op een gelegd deel om het terug te leggen. Je kunt delen ook verslepen.'));
}
// Keep one canvas and renderer: the shared dice renderer owns a resize observer.
function stopAssignmentRoll(){
 clearTimeout(assignmentTimer);assignmentTimer=0;
 if(assignmentDie){
  assignmentDie.removeAttribute('aria-busy');assignmentDie.removeAttribute('aria-disabled');
  assignmentDie.querySelector('.ws-dice-caption').textContent='Werp een opdracht';
 }
}
function assignmentButton(){
 if(!assignmentDie){
  assignmentDie=button('','roll','ws-assignment-dice');
  assignmentDie.setAttribute('aria-label','Werp een opdracht');
  const canvas=el('canvas','ws-dice-canvas');canvas.setAttribute('aria-hidden','true');
  assignmentDie.append(canvas,el('span','ws-dice-caption','Werp een opdracht'));
 }
 return assignmentDie;
}
function rollAssignment(){
 const choices=state.mode==='make'?Table.compatibleTasks(state):[0,1,2,3,4,5];
 if(assignmentTimer||choices.length<2)return;
 state.task=choices[Math.floor(Math.random()*choices.length)];state.roll=state.task+1;state.example=false;render();
 const quiet=board.classList.contains('pp-quiet')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 assignmentView.show(state.roll,{animate:!quiet,key:++assignmentRun,duration:1100,style:'numbers'});
 if(quiet){announce('Worp '+state.roll+'. '+tasks()[state.task][1]);return;}
 assignmentDie.setAttribute('aria-disabled','true');assignmentDie.setAttribute('aria-busy','true');
 assignmentDie.querySelector('.ws-dice-caption').textContent='De dobbelsteen rolt…';
 assignmentTimer=setTimeout(()=>{
  stopAssignmentRoll();
  assignmentDie.disabled=state.mode==='make'&&Table.compatibleTasks(state).length<2;
  if(!root.hidden)announce('Worp '+state.roll+'. '+tasks()[state.task][1]);
 },1100);
}
function renderMission(){
 const mission=q('[data-mission]');mission.replaceChildren();
 if(state.mode==='guess'){
  mission.append(el('span','ws-mission-title','Samen raden'),el('p','ws-mission-name',state.revealed?'Geef een andere omschrijving':'Bespreek wat het kan zijn'));
  mission.append(el('p',null,state.revealed?'Omschrijf hetzelfde woord met een eigen voorbeeld.':'Noem een mogelijkheid en leg uit welke aanwijzing daarbij past.'));
  return;
 }
 if(state.mode==='build'){
  mission.append(el('span','ws-mission-title','Samen bouwen'),el('p','ws-mission-name','Eerst leggen, dan bespreken'));
  mission.append(el('p',null,'Vertel waarom je voor deze volgorde kiest. Bekijk daarna een voorbeeld.'));
  return;
 }
 const list=tasks();mission.append(el('span','ws-mission-title',state.roll===null?'De opdracht':'Worp '+state.roll),el('p','ws-mission-name',list[state.task][1]));
 const roll=assignmentButton();roll.disabled=false;
 if(state.mode==='make'){
  const count=Table.compatibleTasks(state).length;roll.disabled=count<2;
  if(count<6)mission.append(el('p','ws-secondary',count<2?'Deze opdracht past bij de vastgezette kaarten. Laat een kaart los voor meer opdrachten.':count+' opdrachten passen bij je vastgezette kaarten.'));
 }
 mission.append(roll);
 if(!assignmentView)assignmentView=globalThis.PraatpadDice.create(roll.querySelector('canvas'));
 assignmentView.show(state.roll||state.task+1,{style:'numbers'});
}
function renderExample(){
 const show=state.example&&state.mode!=='guess'&&(state.mode!=='make'||state.table.allowExample);q('[data-example]').hidden=!show;
 if(!show)return;
 q('[data-example-label]').textContent=state.mode==='build'?'Een mogelijke volgorde':'Een mogelijke zin';
 q('[data-example-text]').textContent=state.mode==='make'?makeExample():state.mode==='combine'?combineExample():currentBuild().parts.map(p=>p[0]).join(' ');
 q('[data-example-note]').textContent=state.mode==='build'?currentBuild().note:state.mode==='make'?'De zin gebruikt jullie kaarten en vult aan waar nodig. Andere zinnen kunnen ook passen.':'Andere antwoorden kunnen ook passen. Bespreek ze samen.';
}
function render(shouldSave=true){
 stopAssignmentRoll();
 const adjustments=Table.reconcile(state);if(adjustments.length)tableNotice=adjustments.join(' ');
 root.dataset.cardCount=String(Table.activeKeys(state).length);
 root.dataset.cardLayout=state.mode==='make'&&Table.activeKeys(state).length>2?'dense':'normal';
 const focused=root.contains(document.activeElement)?document.activeElement:null;
 const focusData=focused?{...focused.dataset}:null;
 root.style.setProperty('--ws-radius',design.shape==='Kaarten'?'16px':'5px');root.dataset.color=design.colors?'color':'quiet';
 const headings={make:['Maak en verander','Maak een zin met jullie kaarten.'],guess:['Beschrijf en raad','Raad het woord bij de aanwijzingen.'],combine:['Combineer en beschrijf','Gebruik beide woorden en volg de opdracht.'],build:['Bouw een zin',currentBuild().instruction]};
 const [heading,instruction]=headings[state.mode];q('[data-heading]').textContent=heading;q('[data-instruction]').textContent=instruction;
 q('[data-control="mode"]').value=state.mode;q('[data-control="level"]').value=state.level;setOptions();renderSettings();
 const stage=q('[data-stage]');stage.replaceChildren();({make:renderMake,guess:renderGuess,combine:renderCombine,build:renderBuild})[state.mode](stage);
 renderMission();renderExample();
 q('[data-footer]').textContent=state.mode==='guess'?'Geef iedereen denktijd vóór de onthulling.':state.mode==='build'?'Vergelijk de volgorde samen. Er is geen automatische beoordeling.':'Maak eerst zelf een zin. Bekijk daarna het voorbeeld.';
 root.querySelectorAll('[data-action="example"]').forEach(b=>b.setAttribute('aria-expanded',String(state.example)));
 if(shouldSave)persist();
 if(globalThis.lucide)lucide.createIcons({attrs:{width:18,height:18}});
 if(focusData&&document.activeElement!==focused){
  const candidates=[...root.querySelectorAll('button,input,select')];
  const replacement=candidates.find(n=>focusData.control?n.dataset.control===focusData.control:n.dataset.action===focusData.action&&(!focusData.key||n.dataset.key===focusData.key)&&(!focusData.index||n.dataset.index===focusData.index)&&(!focusData.token||n.dataset.token===focusData.token));
  if(replacement&&!replacement.disabled)replacement.focus({preventScroll:true});
 }
}
function changeWord(key){
 if(state.locks[key])return;
 if(state.mode==='make'&&Object.hasOwn(Table.kinds,key)){Table.change(state,key);return;}
 if(key==='subject')state.subject=pick(subj.map((_,i)=>i),state.subject);
 if(key==='verb')state.verb=pick(vPool(),state.verb);
 if(key==='noun'){
  state.noun=pick(nPool(),state.noun);
  if(!nounData[state.noun].adjs.includes(state.adj))state.adj=nounData[state.noun].adjs[0];
 }
 if(key==='adj')state.adj=pick(nounData[state.noun].adjs,state.adj);
}
function nextRound(){
 closeExample();
 if(state.mode==='make')Table.activeKeys(state).forEach(changeWord)
 if(state.mode==='combine'){changeWord('noun');changeWord('adj')}
 if(state.mode==='guess'){state.guess=pick(gPool(),state.guess);state.clues=1;state.revealed=false}
 if(state.mode==='build'){state.build=(state.build+1)%buildData[state.level].length;setupBuild()}
 render();announce(state.mode==='guess'?'Nieuw woord. Eerste aanwijzing: '+guessData[state.guess].clues[0]:state.mode==='build'?'Nieuwe zin: '+currentBuild().instruction:state.mode==='make'?'Nieuwe ronde: '+Table.activeKeys(state).map(k=>Table.text(state,k)).join(', '):'Nieuwe combinatie: '+nounData[state.noun].art+' '+nounData[state.noun].w+', '+state.adj);
}
function movePiece(id,zone,before){
 if(!Number.isInteger(id)||!currentBuild().parts[id])return;
 if(id===before)return;
 state.placed=state.placed.filter(x=>x!==id);state.pool=state.pool.filter(x=>x!==id);
 const arr=zone==='placed'?state.placed:state.pool;const idx=before===undefined?-1:arr.indexOf(before);if(idx<0)arr.push(id);else arr.splice(idx,0,id);
 state.example=false;render();announce('Jullie zin: '+state.placed.map(i=>currentBuild().parts[i][0]).join(' '));
}
root.addEventListener('click',event=>{
 const b=event.target.closest('button[data-action]');if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return;
 const action=b.dataset.action;
 if(action==='settings'){host.settings();return}
 if(action==='next'){nextRound();return}
 if(action==='piece'){movePiece(Number(b.dataset.token),b.dataset.where==='pool'?'placed':'pool');return}
 if(action==='lock'){state.locks[b.dataset.key]=!state.locks[b.dataset.key];render();return}
 if(action==='change'){changeWord(b.dataset.key);closeExample();render();announce('Woord vervangen.');return}
 if(action==='example'){state.example=!state.example;render();if(state.example)announce(q('[data-example-text]').textContent);return}
 if(action==='task'){state.task=Number(b.dataset.index);closeExample();render();announce('Opdracht: '+tasks()[state.task][1]);return}
 if(action==='roll'){rollAssignment();return;}
 if(action==='hint'){state.clues=Math.min(3,state.clues+1);render();announce('Aanwijzing '+state.clues+': '+guessData[state.guess].clues[state.clues-1]);return}
 if(action==='reveal'){state.revealed=!state.revealed;render();announce(state.revealed?'Het woord is '+guessData[state.guess].w:'Het woord is afgedekt.');return}
 if(action==='restart'){setupBuild();closeExample();render();announce('De zinsdelen liggen weer los.');return}
});
function changeSettings(event){
 const control=event.target.dataset.control;if(!control)return;
 tableNotice='';
 if(control==='second-form'){
  state.table.picks.secondVerb=event.target.value;
  if(state.locks.verb){state.locks.verb=false;tableNotice='Het eerste werkwoord is losgelaten om de nieuwe vorm te gebruiken.';}
  if(state.locks.secondVerb){state.locks.secondVerb=false;tableNotice='Het tweede werkwoord is losgelaten om de nieuwe vorm te gebruiken.';}
  closeExample();render();return;
 }
 if(control==='table-card'){
  const key=event.target.dataset.key;
  if(key==='secondVerb'&&state.locks.verb){state.locks.verb=false;tableNotice='Het werkwoord is losgelaten om de kaartindeling aan te passen.';}
  if(!event.target.checked&&Table.activeKeys(state).length===1){event.target.checked=true;tableNotice='Laat minstens één kaart op tafel liggen.';renderSettings();return;}
  state.table.cards[key]=event.target.checked;if(!event.target.checked)state.locks[key]=false;
  closeExample();render();return;
 }
 if(control==='table-labels'||control==='table-example'){
  state.table[control==='table-labels'?'showLabels':'allowExample']=event.target.checked;closeExample();render();return;
 }
 if(control==='labels'){state.labels=event.target.checked;render();return}
 if(control==='task'){
  const before={verb:Table.text(state,'verb'),secondVerb:Table.text(state,'secondVerb')};state.task=Number(event.target.value);
  const notes=Table.reconcile(state);for(const k of ['verb','secondVerb'])if(state.locks[k]&&Table.text(state,k)!==before[k]){state.locks[k]=false;notes.push(Table.kinds[k].label+' is losgelaten voor de nieuwe opdracht.');}
  tableNotice=notes.join(' ');closeExample();render();return;
 }
 closeExample();state.clues=1;state.revealed=false;
 if(control==='mode'){
  state.mode=event.target.value;state.series='all';state.task=0;state.locks=structuredClone(defaults.locks);
  if(state.mode==='guess')state.guess=gPool()[0];if(state.mode==='build')setupBuild();
 }
 if(control==='level'){
  state.level=event.target.value;state.task=0;state.build=0;
  if(!gPool().includes(state.guess))state.guess=gPool()[0];
  if(nounData[state.noun].min>levels.indexOf(state.level)){state.noun=0;state.adj='zwaar';state.locks.noun=false;state.locks.adj=false}
  setupBuild();
 }
 if(control==='series'){
  state.series=event.target.value;
  if(state.mode==='guess'){state.guess=gPool()[0]}
 }
 render();announce('Instellingen aangepast. '+q('[data-instruction]').textContent);
}
settingsBox.addEventListener('change',changeSettings);
root.addEventListener('dragstart',event=>{
 const piece=event.target.closest('[data-token]');if(!piece)return;event.dataTransfer.setData('text/plain',piece.dataset.token);event.dataTransfer.effectAllowed='move';
});
root.addEventListener('dragover',event=>{if(event.target.closest('[data-zone]')){event.preventDefault();event.dataTransfer.dropEffect='move'}});
root.addEventListener('drop',event=>{
 const zone=event.target.closest('[data-zone]');if(!zone)return;event.preventDefault();const raw=event.dataTransfer.getData('text/plain');if(!/^\d+$/.test(raw))return;const target=event.target.closest('[data-token]');movePiece(Number(raw),zone.dataset.zone,target?Number(target.dataset.token):undefined);
});

let savedSignature='';
function restore(saved){
 Object.assign(state,structuredClone(defaults));
 if(saved&&saved.version===1){
  const v=saved.state,integer=(n,max)=>Number.isInteger(n)&&n>=0&&n<max;
  if(v&&['make','guess','combine','build'].includes(v.mode)&&levels.includes(v.level)&&integer(v.subject,subj.length)&&integer(v.verb,verbs.length)&&integer(v.noun,nounData.length)&&Object.hasOwn(adjectives,v.adj)&&integer(v.guess,guessData.length)&&integer(v.build,buildData[v.level].length)&&integer(v.task,6)){
   for(const k of ['mode','level','subject','verb','noun','adj','guess','build','task'])state[k]=v[k];
   state.table=Table.readConfig(v.table);
   const series=state.mode==='make'?['all','regular','irregular','separable','reflexive']:state.mode==='guess'?['all','objects','qualities']:['all'];
   state.series=series.includes(v.series)?v.series:'all';
   for(const k of Object.keys(state.locks))state.locks[k]=v.locks?.[k]===true;
   Table.reconcile(state);
   if(!gPool().includes(state.guess))state.guess=gPool()[0];
   if(nounData[state.noun].min>levels.indexOf(state.level)){state.noun=0;state.locks.noun=false}
   if(!nounData[state.noun].adjs.includes(state.adj)){state.adj=nounData[state.noun].adjs[0];state.locks.adj=false}
   state.clues=Number.isInteger(v.clues)?Math.max(1,Math.min(3,v.clues)):1;state.labels=v.labels===true;
   const count=currentBuild().parts.length,all=[...(Array.isArray(v.placed)?v.placed:[]),...(Array.isArray(v.pool)?v.pool:[])];
   if(Array.isArray(v.placed)&&Array.isArray(v.pool)&&all.length===count&&new Set(all).size===count&&all.every(i=>integer(i,count))){state.placed=[...v.placed];state.pool=[...v.pool]}else setupBuild();
   return;
  }
 }
 setupBuild();
}
function snapshot(){return {version:1,state:{...state,table:structuredClone(state.table),locks:{...state.locks},placed:[...state.placed],pool:[...state.pool],example:false,revealed:false,roll:null}}}
function persist(){const value=snapshot(),signature=JSON.stringify(value);if(signature!==savedSignature){savedSignature=signature;host.write(value)}}
function sync(saved){const signature=JSON.stringify(saved);if(signature===savedSignature){renderSettings();return;}savedSignature=signature;restore(saved);render(false)}

function renderSettings(){
 settingsBox.hidden=!host.active();
 q('[data-control="mode"]').value=state.mode;q('[data-control="level"]').value=state.level;
 const taskSelect=q('[data-control="task"]');taskSelect.replaceChildren();
 q('[data-table-settings]').hidden=state.mode!=='make';
 settingsBox.querySelectorAll('[data-control="table-card"]').forEach(input=>input.checked=state.table.cards[input.dataset.key]);
 q('[data-control="table-labels"]').checked=state.table.showLabels;q('[data-control="table-example"]').checked=state.table.allowExample;
 const secondForm=q('[data-control="second-form"]');secondForm.replaceChildren();
 Table.pool(state,'secondVerb').forEach(form=>{const option=el('option',null,form==='perfect'?'Voltooid deelwoord · hebben/zijn + gewerkt':'Infinitief · willen + werken');option.value=form;secondForm.append(option)});
 secondForm.value=state.table.picks.secondVerb;q('[data-second-form-label]').hidden=!state.table.cards.secondVerb;
 q('[data-table-feedback]').hidden=!tableNotice;q('[data-table-feedback]').textContent=tableNotice;
 const withTask=['make','combine'].includes(state.mode);
 if(withTask)tasks().forEach(([id,name],i)=>{const option=el('option',null,(i+1)+'. '+name);option.value=String(i);taskSelect.append(option)});
 taskSelect.value=String(state.task);q('[data-task-label]').hidden=!withTask;
 q('[data-labels-label]').hidden=state.mode!=='build';q('[data-control="labels"]').checked=state.labels;
 const descriptions={make:'Het niveau bepaalt de woorden en opdrachten. Jij kiest hoeveel kaarten en ondersteuning de groep krijgt. Tijdens het spel kun je kaarten vastzetten of vervangen.',guess:'De groep raadt een woord met maximaal drie aanwijzingen. Onthul het woord wanneer iedereen heeft kunnen nadenken.',combine:'Combineer een zelfstandig naamwoord met een passende eigenschap. Kies een opdracht of laat de dobbelsteen kiezen.',build:'Tik of sleep de zinsdelen in een volgorde. Bekijk daarna samen een mogelijke zin.'};
 q('[data-setting-description]').textContent=descriptions[state.mode];
 const seriesName=['make','guess'].includes(state.mode)?' · '+q('[data-control="series"]').selectedOptions[0]?.textContent:'';
 q('[data-config-summary]').textContent=state.level+seriesName+(state.mode==='make'?' · '+Table.activeKeys(state).length+' kaarten':'');
}

const tableSettings=document.createElement('div');tableSettings.dataset.tableSettings='';
tableSettings.innerHTML='<fieldset class="ws-table-options"><legend>Kaarten op tafel</legend><p>Subject → werkwoord → tijd → aanvulling → plaats → tweede werkwoord → verbinding.</p><div class="ws-table-presets"><button type="button" data-table-preset="basic">Subject + werkwoord</button><button type="button" data-table-preset="four">Met tijd en plaats</button><button type="button" data-table-preset="all">Alle zeven kaarten</button></div><div class="ws-table-checks"></div></fieldset><label data-second-form-label>Vorm van het tweede werkwoord<select data-control="second-form"></select></label><fieldset class="ws-table-support"><legend>Ondersteuning</legend><label class="pp-check"><input type="checkbox" data-control="table-labels">Toon de namen van de kaartsoorten</label><label class="pp-check"><input type="checkbox" data-control="table-example">Voorbeeldzin op verzoek beschikbaar</label></fieldset><p data-table-feedback class="pp-note" role="status" hidden></p>';
for(const [key,info] of Object.entries(Table.kinds)){
 const label=el('label','ws-card-choice'),input=document.createElement('input');input.type='checkbox';input.dataset.control='table-card';input.dataset.key=key;
 const description=el('span');description.append(el('strong',null,info.label),el('small',null,info.hint));label.append(input,description);tableSettings.querySelector('.ws-table-checks').append(label);
}
settingsBox.insertBefore(tableSettings,q('[data-setting-description]'));
tableSettings.addEventListener('click',event=>{
 const preset=event.target.closest('[data-table-preset]');if(!preset)return;
 const keys=preset.dataset.tablePreset==='all'?Object.keys(Table.kinds):preset.dataset.tablePreset==='four'?['subject','verb','time','place']:['subject','verb'];
 const changesSecond=state.table.cards.secondVerb!==keys.includes('secondVerb');if(changesSecond)state.locks.verb=false;
 for(const k of Object.keys(Table.kinds)){state.table.cards[k]=keys.includes(k);if(!state.table.cards[k])state.locks[k]=false;}
 tableNotice='';closeExample();render();
});

q('#pp-wordgame-start').onclick=()=>{persist();host.play()};
const intro=document.createElement('article');intro.className='pp-wordgame-intro';intro.innerHTML='<h4>Woordspel</h4><p>Maak zinnen, raad woorden en bouw samen. Kies een oefenvorm en niveau bij Spelvorm.</p><button type="button" class="pp-secondary">Woordspel instellen</button>';intro.querySelector('button').onclick=()=>host.configure();
document.getElementById('pp-library').insertBefore(intro,board.querySelector('.pp-library-filter'));
globalThis.PraatpadWordspel={sync};sync(host.read());host.refresh();
if(location.hash==='#woordspel'&&!host.active())host.play();
})();
