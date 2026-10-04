import {blankModel,labels,modelIssues,sentenceText} from './model.mjs';
import {canonicalOrder,validate} from './grammar.mjs';
import {createExercise,exerciseLabels} from './exercise.mjs';
import {SentenceBoard,escapeHtml as esc,button} from './board.mjs';
import {LiveClient,request} from './live-client.mjs';
const root=document.querySelector('#app'),STORE='taalroute-zinnenbouwer-v1',LIVE='taalroute-zinnenbouwer-host';
let type=/** @type {import('./exercise.mjs').ExerciseType} */('sentenceBuild');
let model=blankModel(),draftModel,draftType,board,exercise,client,liveState,credentials,connection='',chosen=[],shown=[],busy=false,pendingCommand=null;
function read(key,storage=localStorage){try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}}
function put(key,value,storage=localStorage){try{if(value===null)storage.removeItem(key);else storage.setItem(key,JSON.stringify(value));}catch{/* In-memory operation remains available when storage is denied. */}}
function save(){put(STORE,{model,type,order:board?.order});}
function error(message){const el=root.querySelector('[data-error]');if(el)el.textContent=message;}
function starterModel(){
 const result=blankModel();
 for(const c of result.components){c.value=({subject:'ik',finiteVerb:'werk',time:'morgen',place:'thuis'})[c.type]||'';c.enabled=!!c.value;if(c.type==='finiteVerb')c.verb={lemma:'werken',surfaceForm:'werk',role:'finiteVerb',form:'finite'};}
 return result;
}
function settings(){return /** @type {HTMLDialogElement} */(root.querySelector('[data-settings]'));}
function settingsError(message){settings().querySelector('[data-settings-error]').textContent=message;}
function renderSettings(){
 const dialog=settings();
 dialog.innerHTML=`<div class="zb-settings-head"><div><p class="zb-step">Voor de docent</p><h2 id="zb-settings-title">Zin en onderdelen</h2></div>${button('cancel-settings','Sluiten')}</div><p>Kies de onderdelen, vul de woorden in en kies de oefenvorm.</p><div class="zb-settings-fields">${draftModel.components.map(c=>`<section class="zb-setting-part"><label class="zb-part-toggle"><input type="checkbox" data-enable="${c.id}" ${c.enabled?'checked':''} ${['subject','finiteVerb'].includes(c.type)?'disabled':''}>${labels[c.type]}</label><div class="zb-part-inputs" ${!c.enabled?'hidden':''}><label>${c.verb?'Vorm in de zin':'Woorden op de kaart'}<input data-value="${c.id}" aria-label="${labels[c.type]}" maxlength="160" value="${esc(c.value)}"></label>${c.type==='finiteVerb'?`<label>Heel werkwoord<input data-lemma="${c.id}" aria-label="Heel werkwoord bij persoonsvorm" maxlength="160" value="${esc(c.verb.lemma)}"></label>`:''}</div></section>`).join('')}</div><label class="zb-mode-select">Oefenvorm<select data-mode-select>${Object.entries(exerciseLabels).map(([id,label])=>`<option value="${id}" ${draftType===id?'selected':''}>${label}</option>`).join('')}</select></label><p class="zb-preview" data-preview>${esc(sentenceText(draftModel,canonicalOrder(draftModel))||'Je voorbeeldzin verschijnt hier.')}</p><p class="zb-error" data-settings-error role="alert"></p><div class="zb-settings-actions">${button('new','Nieuwe zin')}${button('cancel-settings','Annuleren')}${button('apply-settings','Klaar · terug naar het bord','class="primary"')}</div>`;
 if(!dialog.open)dialog.showModal();
}
function openSettings(){
 if(client)return error('Sluit eerst de Live-sessie om de activiteit aan te passen.');
 draftModel=structuredClone(model);draftType=type;renderSettings();
}
function feedback(){
 const result=validate(model,board.order),el=/** @type {HTMLElement} */(root.querySelector('[data-feedback]'));
 el.dataset.status=result.status;el.textContent=({correct:'Deze structuur klopt.',correctAlternative:'Deze andere volgorde klopt ook.',incomplete:'Leg alle kaarten in de bouwzone.',incorrect:result.issues.map(i=>i.message).join(' ')})[result.status];
 /** @type {HTMLButtonElement} */(root.querySelector('button[data-action="undo"]')).disabled=!board.history.length;save();
}
function renderRun(order){
 exercise??=createExercise(model,type);
 root.innerHTML=`<div class="zb-toolbar"><h1>Zinnenbouwer</h1>${button('edit','Docentinstellingen',`aria-haspopup="dialog"`)}${button('live','Start Live','class="primary"')}</div><section class="zb-panel"><div data-board></div><p class="zb-feedback" data-feedback role="status" aria-live="polite"></p><div class="zb-actions">${button('undo','Ongedaan maken')}${button('mix','Mengen')}${button('reset','Herstellen')}${button('clear','Opnieuw beginnen')}${button('solution','Toon correcte structuur')}</div></section><p class="zb-error" data-error role="alert"></p><section class="zb-live" data-live></section><dialog class="zb-settings" data-settings aria-labelledby="zb-settings-title"></dialog>`;
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
  if(!liveState){exercise=state.exercise;renderRun(board?.model.id===model.id?board.order:state.exercise.order);}
  if(liveState?.round!==state.round){chosen=[];shown=[];}
  liveState=state;renderLive();if(state.status==='closed'){put(LIVE,null,sessionStorage);client.stop();}
 },(status,message)=>{connection=status;renderLive();if(message)error(message);});
}
async function startLive(){
 if(busy||client)return;const issues=modelIssues(model);if(issues.length){error(issues.map(i=>i.message).join(' '));return;}
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
 const field=/** @type {HTMLInputElement} */(e.target),id=field.dataset.value||field.dataset.lemma,c=draftModel?.components.find(c=>c.id===id);if(!c)return;
 if(field.dataset.value){c.value=field.value;if(c.verb){c.verb.surfaceForm=field.value;if(c.type==='secondVerb')c.verb.lemma=field.value;}}
 else c.verb.lemma=field.value;
 const preview=root.querySelector('[data-preview]');if(preview)preview.textContent=sentenceText(draftModel,canonicalOrder(draftModel));
});
root.addEventListener('change',e=>{
 const field=/** @type {HTMLInputElement} */(e.target),c=draftModel?.components.find(c=>c.id===field.dataset.enable);
 if(c){c.enabled=field.checked;renderSettings();/** @type {HTMLInputElement} */(settings().querySelector(`[data-enable="${c.id}"]`)).focus();}
 if(field.hasAttribute('data-mode-select'))draftType=field.value;
});
root.addEventListener('click',async e=>{
 const b=/** @type {HTMLButtonElement} */(/** @type {HTMLElement} */(e.target).closest('[data-action]'));if(!b||b.closest('[data-board]'))return;
 const action=b.dataset.action;
 if(action==='edit')openSettings();
 if(action==='new'){draftModel=blankModel();renderSettings();/** @type {HTMLInputElement} */(settings().querySelector('[data-value]')).focus();}
 if(action==='cancel-settings')settings().close();
 if(action==='apply-settings'){
  const issues=modelIssues(draftModel);if(issues.length)return settingsError(issues.map(i=>i.message).join(' '));
  if(type===draftType&&JSON.stringify(model)===JSON.stringify(draftModel)){settings().close();return;}
  model=draftModel;type=draftType;exercise=createExercise(model,type);renderRun();/** @type {HTMLButtonElement} */(root.querySelector('[data-action="edit"]')).focus();
 }
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
const saved=read(STORE),validSaved=saved&&Object.hasOwn(exerciseLabels,saved.type)&&!modelIssues(saved.model).length;
if(validSaved){model=saved.model;type=saved.type;}else{if(saved)put(STORE+'-backup',saved);model=starterModel();}
exercise=createExercise(model,type);renderRun(validSaved?saved.order:canonicalOrder(model));
const savedCredentials=read(LIVE,sessionStorage);if(savedCredentials?.code&&savedCredentials?.token)connect(savedCredentials);
