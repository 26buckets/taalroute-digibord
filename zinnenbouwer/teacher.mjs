import {blankModel,labels,modelIssues,sentenceText} from './model.mjs';
import {canonicalOrder,validate} from './grammar.mjs';
import {createExercise,exerciseLabels} from './exercise.mjs';
import {SentenceBoard,escapeHtml as esc,button} from './board.mjs';
import {LiveClient,request} from './live-client.mjs';
const root=document.querySelector('#app'),STORE='taalroute-zinnenbouwer-v1',LIVE='taalroute-zinnenbouwer-host';
let type=/** @type {import('./exercise.mjs').ExerciseType} */('sentenceBuild');
let model=blankModel(),phase=0,board,exercise,client,liveState,credentials,connection='',chosen=[],shown=[],busy=false,pendingCommand=null;
function read(key,storage=localStorage){try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}}
function put(key,value,storage=localStorage){try{if(value===null)storage.removeItem(key);else storage.setItem(key,JSON.stringify(value));}catch{/* In-memory operation remains available when storage is denied. */}}
function save(){put(STORE,{model,type,order:board?.order});}
function error(message){const el=root.querySelector('[data-error]');if(el)el.textContent=message;}
function nextButton(){return `<div class="zb-actions">${button('back','Vorige')}${button('next','Verder','class="primary"')}</div>`;}
function render(){
 if(phase===4){renderRun();return;}
 let body='';
 if(phase===0){const saved=read(STORE);body=`<h1>Zinnenbouwer</h1><p>Bouw samen een zin en ontdek wat er verandert als je kaarten verplaatst.</p><div class="zb-actions">${button('new','Nieuwe zin bouwen','class="primary"')}${saved&&Object.hasOwn(exerciseLabels,saved.type)&&!modelIssues(saved.model).length?button('resume','Verder met je zin'):''}</div>`;}
 if(phase===1)body=`<p class="zb-step">1 van 4 · Onderdelen</p><h1>Welke onderdelen gebruik je?</h1><div class="zb-options">${model.components.map(c=>`<label><input type="checkbox" data-enable="${c.id}" ${c.enabled?'checked':''} ${['subject','finiteVerb'].includes(c.type)?'disabled':''}>${labels[c.type]}</label>`).join('')}</div>${nextButton()}`;
 if(phase===2)body=`<p class="zb-step">2 van 4 · Inhoud</p><h1>Vul je zin in</h1>${model.components.filter(c=>c.enabled).map(c=>`<div class="zb-field"><span>${labels[c.type]}</span><label>${c.type==='secondVerb'?'Heel werkwoord (infinitief)':c.verb?'Vorm in de zin':'Tekst'}<input data-value="${c.id}" aria-label="${labels[c.type]}" maxlength="160" value="${esc(c.value)}" placeholder="${esc({subject:'ik',finiteVerb:'wil',time:'morgen',rest:'een boek',place:'thuis',secondVerb:'werken'}[c.type])}"></label>${c.type==='finiteVerb'?`<label>Heel werkwoord<input data-lemma="${c.id}" aria-label="Heel werkwoord bij ${labels[c.type].toLowerCase()}" maxlength="160" value="${esc(c.verb.lemma)}" placeholder="${c.type==='finiteVerb'?'willen':'werken'}"></label>`:''}</div>`).join('')}<p class="zb-preview" data-preview aria-live="polite">${esc(sentenceText(model,canonicalOrder(model))||'Je voorbeeldzin verschijnt hier.')}</p>${nextButton()}`;
 if(phase===3)body=`<p class="zb-step">3 van 4 · Oefenvorm</p><h1>Hoe wil je oefenen?</h1><div class="zb-options">${Object.entries(exerciseLabels).map(([id,label])=>button('mode',label,`class="zb-mode" data-mode="${id}" aria-pressed="${type===id}"`)).join('')}</div>${nextButton()}`;
 if(phase===5)body=`<p class="zb-step">4 van 4 · Uitvoeren</p><h1>Klaar om te oefenen</h1><p class="zb-preview">${esc(sentenceText(model,canonicalOrder(model)))}</p><p>${exerciseLabels[type]}</p><div class="zb-actions">${button('back','Vorige')}${button('class','Klassikaal','class="primary"')}${button('live','Start Live')}</div>`;
 root.innerHTML=`<section class="zb-panel zb-wizard">${body}<p class="zb-error" data-error role="alert"></p></section>`;
 root.querySelector('h1')?.setAttribute('tabindex','-1');root.querySelector('h1')?.focus();
}
function feedback(){
 const result=validate(model,board.order),el=/** @type {HTMLElement} */(root.querySelector('[data-feedback]'));
 el.dataset.status=result.status;el.textContent=({correct:'Deze structuur klopt.',correctAlternative:'Deze andere volgorde klopt ook.',incomplete:'Leg alle kaarten in de bouwzone.',incorrect:result.issues.map(i=>i.message).join(' ')})[result.status];
 /** @type {HTMLButtonElement} */(root.querySelector('button[data-action="undo"]')).disabled=!board.history.length;save();
}
function renderRun(order){
 exercise??=createExercise(model,type);
 root.innerHTML=`<div class="zb-toolbar"><h1>Zinnenbouwer</h1>${button('edit','Zin aanpassen')}${button('live','Start Live','class="primary"')}</div><section class="zb-panel"><div data-board></div><p class="zb-feedback" data-feedback role="status" aria-live="polite"></p><div class="zb-actions">${button('undo','Ongedaan maken')}${button('mix','Mengen')}${button('reset','Herstellen')}${button('clear','Opnieuw beginnen')}${button('solution','Toon correcte structuur')}</div></section><p class="zb-error" data-error role="alert"></p><section class="zb-live" data-live></section>`;
 board=new SentenceBoard(/** @type {HTMLElement} */(root.querySelector('[data-board]')),model,exercise,feedback,order||exercise.order);feedback();renderLive();
}
function renderLive(){
 const target=root.querySelector('[data-live]');if(!target)return;
 /** @type {HTMLButtonElement} */(root.querySelector('button[data-action="live"]')).disabled=!!client||busy;
 if(!client){target.innerHTML='';return;}
 const state=liveState,connected=connection==='connected',joinUrl=new URL('meedoen.html?code='+credentials.code,location.href).href;
 const label={waiting:'Wachten op deelnemers',active:'Ronde bezig',review:'Samen bespreken',closed:'Sessie gesloten'}[state?.status]||'Live verbinden';
 target.innerHTML=`<h2>Live · ${label}</h2><p class="zb-connection" role="status">${connected?'Verbonden':connection==='connecting'?'Verbinding maken…':'Verbinding onderbroken. Je klassikale zin blijft beschikbaar.'}</p>${!connected?button('retry','Opnieuw verbinden'):''}${button('fallback','Klassikaal verder')}${state?.status!=='closed'?button('close','Sessie sluiten'):''}${state?.status==='closed'?'':`<div class="zb-lobby"><div class="zb-qr" data-qr role="img" aria-label="QR-code om mee te doen"></div><div><p>Scan de QR-code of open <a href="${esc(joinUrl)}" target="_blank" rel="noopener">Meedoen</a> en gebruik code</p><p class="zb-code">${esc(credentials.code)}</p></div></div>`}${state?`<p class="zb-counts" data-counts aria-live="polite">${state.participants} deelnemers · ${state.connected} verbonden · ${state.received} antwoorden · ${state.remaining} zonder antwoord</p>`:''}<div class="zb-actions">${state?.status==='waiting'?button('start','Start ronde',`class="primary" ${busy?'disabled':''}`):''}${state?.status==='active'?button('review','Bespreken',`class="primary" ${busy?'disabled':''}`):''}${state?.status==='review'?`${button('again','Nog een keer · dezelfde volgorde',busy?'disabled':'')}${button('again-mix','Nog een keer · opnieuw mengen',busy?'disabled':'')}`:''}</div>${state?.status==='review'?`<h3>Welke antwoorden wil je tonen?</h3><div class="zb-groups">${state.groups.map((g,i)=>button('select',`<b>${g.count}</b> ${esc(g.text)}`,`class="zb-group" data-group="${i}" aria-pressed="${chosen.includes(g.key)}"`)).join('')||'<p>Er zijn geen antwoorden ingestuurd.</p>'}</div><div class="zb-actions">${button('show','Toon selectie',!chosen.length?'disabled':'')}${button('hide','Verberg selectie')}</div>`:''}<div class="zb-compare" data-comparison>${shown.map((g,i)=>`<article><h3>${String.fromCharCode(65+i)} · ${g.count} ${g.count===1?'antwoord':'antwoorden'}</h3><p>${esc(g.text)}</p></article>`).join('')}</div>`;
 if(state?.status!=='closed'&&globalThis.qrcode){const qr=globalThis.qrcode(0,'M');qr.addData(joinUrl);qr.make();target.querySelector('[data-qr]').innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});}
}
function connect(creds){
 credentials=creds;put(LIVE,creds,sessionStorage);client?.stop();
 client=new LiveClient(creds,state=>{
  if(state.model){model=state.model;type=state.type;}
  if(!board){exercise=state.exercise;phase=4;renderRun();}
  if(liveState?.round!==state.round){chosen=[];shown=[];}
  liveState=state;renderLive();if(state.status==='closed'){put(LIVE,null,sessionStorage);client.stop();}
 },(status,message)=>{connection=status;renderLive();if(message)error(message);});
}
async function startLive(){
 if(busy||client)return;const issues=modelIssues(model);if(issues.length){error(issues.map(i=>i.message).join(' '));return;}
 if(phase!==4){phase=4;renderRun();}
 busy=true;renderLive();error('');
 try{const creds=await request('sessions',{model,type});connect(creds);renderLive();}
 catch(e){error(e.message+' Je kunt klassikaal verdergaan.');}
 finally{busy=false;renderLive();}
}
async function command(type,extra={}){
 if(busy||!client)return;busy=true;error('');renderLive();
 // Keep an idempotency key on network retry; never accidentally start two rounds.
 if(!pendingCommand||pendingCommand.type!==type||pendingCommand.shuffle!==extra.shuffle)pendingCommand={type,...extra,requestId:crypto.randomUUID()};
 try{await client.command(pendingCommand);pendingCommand=null;}
 catch(e){error(e.message);if(e.code!=='NETWORK')pendingCommand=null;}
 finally{busy=false;renderLive();}
}
root.addEventListener('input',e=>{
 const field=/** @type {HTMLInputElement} */(e.target),id=field.dataset.value||field.dataset.lemma,c=model.components.find(c=>c.id===id);if(!c)return;
 if(field.dataset.value){c.value=field.value;if(c.verb){c.verb.surfaceForm=field.value;if(c.type==='secondVerb')c.verb.lemma=field.value;}}
 else c.verb.lemma=field.value;
 const preview=root.querySelector('[data-preview]');if(preview)preview.textContent=sentenceText(model,canonicalOrder(model));
});
root.addEventListener('change',e=>{const field=/** @type {HTMLInputElement} */(e.target),c=model.components.find(c=>c.id===field.dataset.enable);if(c)c.enabled=field.checked;});
root.addEventListener('click',async e=>{
 const b=/** @type {HTMLButtonElement} */(/** @type {HTMLElement} */(e.target).closest('[data-action]'));if(!b||b.closest('[data-board]'))return;
 const action=b.dataset.action;
 if(action==='new'){model=blankModel();phase=1;exercise=null;board=null;render();}
 if(action==='resume'){const stored=read(STORE);if(stored&&Object.hasOwn(exerciseLabels,stored.type)&&!modelIssues(stored.model).length){model=stored.model;type=stored.type;exercise=createExercise(model,type);phase=4;renderRun(stored.order);}}
 if(action==='back'){phase=phase===5?3:Math.max(0,phase-1);render();}
 if(action==='next'){
  if(phase===2){const issues=modelIssues(model);if(issues.length)return error(issues.map(i=>i.message).join(' '));}
  phase=phase===3?5:phase+1;render();
 }
 if(action==='mode'){type=/** @type {import('./exercise.mjs').ExerciseType} */(b.dataset.mode);render();}
 if(action==='class'){phase=4;renderRun();}
 if(action==='edit'){if(client)return error('Sluit eerst de Live-sessie om de activiteit aan te passen.');phase=1;exercise=null;render();}
 if(action==='undo')board.undo();if(action==='mix')board.mix();if(action==='reset')board.reset();if(action==='clear')board.clear();
 if(action==='solution')board.setOrder(canonicalOrder(model));
 if(action==='live')await startLive();
 if(action==='retry'){client?.connect();error('');}
 if(action==='fallback'){client?.stop();client=null;liveState=null;chosen=[];shown=[];put(LIVE,null,sessionStorage);renderLive();error('Je werkt nu klassikaal verder.');}
 if(action==='start'||action==='again')await command('start');
 if(action==='again-mix')await command('start',{shuffle:true});
 if(action==='review')await command('review');
 if(action==='close'){await command('close');if(liveState?.status==='closed'){client?.stop();client=null;liveState=null;put(LIVE,null,sessionStorage);renderLive();}}
 if(action==='select'){const g=liveState.groups[Number(b.dataset.group)];chosen=chosen.includes(g.key)?chosen.filter(k=>k!==g.key):[...chosen,g.key].slice(-2);renderLive();}
 if(action==='show'){shown=liveState.groups.filter(g=>chosen.includes(g.key));renderLive();}
 if(action==='hide'){shown=[];renderLive();}
});
render();const savedCredentials=read(LIVE,sessionStorage);if(savedCredentials?.code&&savedCredentials?.token)connect(savedCredentials);
