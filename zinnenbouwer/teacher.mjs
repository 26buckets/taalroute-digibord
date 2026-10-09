import {labels,clauseLabels,clauseOf,componentLabel,modelIssues,sentenceText} from './model.mjs';
import {canonicalOrder,validate} from './grammar.mjs';
import {templates,templateModel} from './templates.mjs';
import {createExercise,exerciseLabels} from './exercise.mjs';
import {SentenceBoard,escapeHtml as esc,button} from './board.mjs';
import {LiveClient,request} from './live-client.mjs';
const root=/** @type {HTMLElement} */(document.querySelector('#app')),STORE='taalroute-zinnenbouwer-v1',LIVE='taalroute-zinnenbouwer-host';
let type=/** @type {import('./exercise.mjs').ExerciseType} */('sentenceBuild');
let model=templateModel('main'),draftModel,draftType,board,exercise,client,liveState,credentials,connection='',chosen=[],shown=[],busy=false,pendingCommand=null,savedActivity=false;
function read(key,storage=localStorage){try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}}
function put(key,value,storage=localStorage){try{if(value===null)storage.removeItem(key);else storage.setItem(key,JSON.stringify(value));}catch{/* In-memory operation remains available when storage is denied. */}}
function save(){savedActivity=true;put(STORE,{model,type,order:board?.order});}
function error(message){const el=root.querySelector('[data-error]');if(el)el.textContent=message;}
function focusHeading(selector='h1'){const el=/** @type {HTMLElement} */(root.querySelector(selector));el?.focus({preventScroll:true});el?.scrollIntoView({block:'start'});}
const lineIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16"/></svg>';
function renderLanding(){
 board?.cancel();history.replaceState(null,'',location.pathname);root.dataset.screen='landing';
 root.innerHTML=`<section class="zb-landing"><h1 tabindex="-1">Zinnenbouwer</h1><p>Bouw samen zinnen met verschuifbare woordkaarten.</p>${savedActivity?`<div class="zb-resume">${button('resume','Verder met je zin','class="primary"')}<span>${esc(sentenceText(model,read(STORE)?.order||[])||clauseLabels[model.clauseType])}</span></div>`:''}<h2>Kies je zinsvorm</h2><div class="zb-choice-list">${Object.entries(templates).map(([id,p])=>`<button class="zb-choice" data-action="choose" data-template="${id}">${lineIcon}<span><strong>${p.title}</strong><small>${p.description}</small></span><span class="zb-choice-example">${p.example}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>`).join('')}</div><p class="zb-landing-note">Een voorbeeld staat meteen klaar. Bij Docentinstellingen pas je de woorden en de oefenvorm aan.</p><div class="zb-landing-foot"><span>Klassikaal op het bord of samen via Live.</span><a class="zb-link" href="meedoen.html">Meedoen met een code</a></div></section>`;
}
function settings(){return /** @type {HTMLDialogElement} */(root.querySelector('[data-settings]'));}
function settingsError(message){settings().querySelector('[data-settings-error]').textContent=message;}
function renderSettings(){
 const dialog=settings(),groups=draftModel.clauseType==='compound'?['main','subordinate']:[draftModel.clauseType==='subordinate'?'subordinate':'main'];
 dialog.innerHTML=`<div class="zb-settings-head"><div><p class="zb-step">Voor de docent</p><h2 id="zb-settings-title">Zin en onderdelen</h2></div>${button('cancel-settings','Sluiten')}</div><p>${esc(clauseLabels[draftModel.clauseType])} · Pas de woorden aan en kies de oefenvorm.</p>${groups.map(group=>`${groups.length>1?`<h3>${group==='main'?'Hoofdzin':'Bijzin'}</h3>`:''}<div class="zb-settings-fields">${draftModel.components.filter(c=>clauseOf(draftModel,c)===group).map(c=>`<section class="zb-setting-part"><label class="zb-part-toggle"><input type="checkbox" data-enable="${c.id}" ${c.enabled?'checked':''} ${['subject','finiteVerb','conjunction'].includes(c.type)?'disabled':''}>${labels[c.type]}</label><div class="zb-part-inputs" ${!c.enabled?'hidden':''}><label>${c.verb?'Vorm in de zin':'Woorden op de kaart'}<input data-value="${c.id}" aria-label="${componentLabel(draftModel,c)}" maxlength="160" value="${esc(c.value)}"></label>${c.verb?`<label>Heel werkwoord<input data-lemma="${c.id}" aria-label="Heel werkwoord bij ${componentLabel(draftModel,c).toLocaleLowerCase('nl')}" maxlength="160" value="${esc(c.verb.lemma)}"></label>`:''}${c.type==='secondVerb'?`<label>Werkwoordsvorm<select data-verb-form="${c.id}"><option value="infinitive" ${c.verb.form==='infinitive'?'selected':''}>Infinitief · werken</option><option value="pastParticiple" ${c.verb.form==='pastParticiple'?'selected':''}>Voltooid deelwoord · gewerkt</option></select></label>`:''}</div></section>`).join('')}</div>`).join('')}<label class="zb-mode-select">Oefenvorm<select data-mode-select>${Object.entries(exerciseLabels).map(([id,label])=>`<option value="${id}" ${draftType===id?'selected':''}>${label}</option>`).join('')}</select></label><p class="zb-preview" data-preview>${esc(sentenceText(draftModel,canonicalOrder(draftModel))||'Je voorbeeldzin verschijnt hier.')}</p><p class="zb-error" data-settings-error role="alert"></p><div class="zb-settings-actions">${button('new','Nieuwe zin')}${button('cancel-settings','Annuleren')}${button('apply-settings','Klaar · terug naar het bord','class="primary"')}</div>`;
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
 board?.cancel();history.replaceState(null,'',location.pathname+'#bord');root.dataset.screen='board';exercise??=createExercise(model,type);
 root.innerHTML=`<div class="zb-toolbar"><h1 tabindex="-1">${esc(clauseLabels[model.clauseType])}</h1>${button('home','Andere zinsvorm')}${button('edit','Docentinstellingen','aria-haspopup="dialog"')}${button('live','Start Live','class="primary"')}</div><p class="zb-error" data-error tabindex="-1" role="alert"></p><section class="zb-live" data-live hidden></section><section class="zb-panel" data-class-board><div data-board></div><p class="zb-feedback" data-feedback role="status" aria-live="polite"></p><div class="zb-actions">${button('undo','Ongedaan maken')}${button('mix','Mengen')}${button('reset','Herstellen')}${button('clear','Opnieuw beginnen')}${button('solution','Toon correcte structuur')}</div></section><dialog class="zb-settings" data-settings aria-labelledby="zb-settings-title"></dialog>`;
 board=new SentenceBoard(/** @type {HTMLElement} */(root.querySelector('[data-board]')),model,exercise,feedback,order||exercise.order);feedback();renderLive();
}
function renderLive(){
 const target=/** @type {HTMLElement} */(root.querySelector('[data-live]'));if(!target)return;
 for(const action of ['live','edit','home'])/** @type {HTMLButtonElement} */(root.querySelector(`[data-action="${action}"]`)).disabled=!!client||busy;
 const starting=busy&&!client;
 root.querySelector('[data-action="live"]').textContent=starting?'Live openen…':'Start Live';
 target.hidden=!client&&!starting;
 /** @type {HTMLElement} */(root.querySelector('[data-class-board]')).hidden=starting||!!client&&(!liveState||liveState.status==='waiting');
 if(!client){target.innerHTML=starting?'<h2 tabindex="-1">Live openen…</h2><p role="status">De sessie wordt klaargezet.</p>':'';return;}
 const state=liveState,connected=connection==='connected',joinUrl=new URL('meedoen.html?code='+credentials.code,location.href).href;
 const label={waiting:'Wachten op deelnemers',active:'Ronde bezig',review:'Samen bespreken',closed:'Sessie gesloten'}[state?.status]||'Verbinding maken';
 target.innerHTML=`<div class="zb-live-head"><h2 tabindex="-1">Live · ${label}</h2><p class="zb-connection" role="status">${connected?'Verbonden':connection==='connecting'?'Verbinding maken…':'Verbinding onderbroken. Je zin blijft bewaard.'}</p></div><div class="zb-actions">${!connected?button('retry','Opnieuw verbinden'):''}${button('fallback','Klassikaal verder')}${button('close','Sessie sluiten')}</div><div class="zb-actions">${state?.status==='waiting'?button('start','Start ronde',`class="primary" ${busy||!connected?'disabled':''}`):''}${state?.status==='active'?button('review','Bespreken',`class="primary" ${busy?'disabled':''}`):''}${state?.status==='review'?`${button('again','Nog een keer · dezelfde volgorde',busy?'disabled':'')}${button('again-mix','Nog een keer · opnieuw mengen',busy?'disabled':'')}`:''}</div><details class="zb-join-details" ${!state||state.status==='waiting'?'open':''}><summary>Deelnemers uitnodigen</summary><div class="zb-lobby"><div class="zb-qr" data-qr role="img" aria-label="QR-code om mee te doen"></div><div><p>Scan de QR-code of open <a href="${esc(joinUrl)}" target="_blank" rel="noopener">Meedoen</a>.</p><p class="zb-code">${esc(credentials.code)}</p><p>Vul de code in en kies Meedoen.</p></div></div></details>${state?`<p class="zb-counts" data-counts aria-live="polite">${state.participants} deelnemers · ${state.connected} verbonden · ${state.received} antwoorden · ${state.remaining} zonder antwoord</p>`:''}${state?.status==='review'?`<h3>Welke antwoorden wil je tonen?</h3><div class="zb-groups">${state.groups.map((g,i)=>button('select',`<b>${g.count}</b> ${esc(g.text)}`,`class="zb-group" data-group="${i}" aria-pressed="${chosen.includes(g.key)}"`)).join('')||'<p>Er zijn geen antwoorden ingestuurd.</p>'}</div><div class="zb-actions">${button('show','Toon selectie',!chosen.length?'disabled':'')}${button('hide','Verberg selectie')}</div>`:''}<div class="zb-compare" data-comparison>${shown.map((g,i)=>`<article><h3>${String.fromCharCode(65+i)} · ${g.count} ${g.count===1?'antwoord':'antwoorden'}</h3><p>${esc(g.text)}</p></article>`).join('')}</div>`;
 if(globalThis.qrcode){const qr=globalThis.qrcode(0,'M');qr.addData(joinUrl);qr.make();target.querySelector('[data-qr]').innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});}
}
function finishLive(message=''){
 client?.stop();client=null;credentials=null;liveState=null;chosen=[];shown=[];pendingCommand=null;put(LIVE,null,sessionStorage);renderLive();error(message);
}
function connect(creds){
 credentials=creds;put(LIVE,creds,sessionStorage);client?.stop();
 client=new LiveClient(creds,state=>{
  if(state.status==='closed'){finishLive('De sessie is gesloten. Je kunt een nieuwe Live-sessie starten.');return;}
  if(state.model){model=state.model;type=state.type;}
  const first=!liveState,changed=first||liveState.status!==state.status;
  if(first){exercise=state.exercise;renderRun(board?.model.id===model.id?board.order:state.exercise.order);}
  if(liveState?.round!==state.round){chosen=[];shown=[];}
  liveState=state;renderLive();if(changed)focusHeading('[data-live] h2');
 },(status,message)=>{connection=status;if(status==='ended'){finishLive((message||'Deze sessie is niet meer beschikbaar.')+' Start een nieuwe Live-sessie.');return;}renderLive();if(message)error(message);});
 renderLive();
}
async function startLive(){
 if(busy||client)return;const issues=modelIssues(model);if(issues.length){error(issues.map(i=>i.message).join(' '));return;}
 busy=true;renderLive();error('');focusHeading('[data-live] h2');
 try{connect(await request('sessions',{model,type}));}
 catch(e){error(e.message+' Je kunt klassikaal verdergaan.');}
 finally{busy=false;renderLive();if(client)focusHeading('[data-live] h2');else focusHeading('[data-error]');}
}
async function command(type,extra={}){
 if(busy||!client)return;busy=true;error('');renderLive();
 if(!pendingCommand||pendingCommand.type!==type||pendingCommand.shuffle!==extra.shuffle)pendingCommand={type,...extra,requestId:crypto.randomUUID()};
 try{await client.command(pendingCommand);pendingCommand=null;if(type==='close')finishLive('De sessie is gesloten.');}
 catch(e){error(e.message);if(e.code!=='NETWORK')pendingCommand=null;if(['AUTH','CLOSED','UNKNOWN'].includes(e.code))finishLive(e.message+' Start een nieuwe Live-sessie.');}
 finally{busy=false;renderLive();}
}
root.addEventListener('input',e=>{
 const field=/** @type {HTMLInputElement} */(e.target),id=field.dataset.value||field.dataset.lemma,c=draftModel?.components.find(c=>c.id===id);if(!c)return;
 if(field.dataset.value){c.value=field.value;if(c.verb){c.verb.surfaceForm=field.value;if(c.type==='secondVerb'&&!c.verb.lemma)c.verb.lemma=field.value;}}
 else c.verb.lemma=field.value;
 const preview=root.querySelector('[data-preview]');if(preview)preview.textContent=sentenceText(draftModel,canonicalOrder(draftModel));
});
root.addEventListener('change',e=>{
 const field=/** @type {HTMLInputElement} */(e.target),c=draftModel?.components.find(c=>c.id===field.dataset.enable);
 if(c){c.enabled=field.checked;renderSettings();/** @type {HTMLInputElement} */(settings().querySelector(`[data-enable="${c.id}"]`)).focus();}
 if(field.dataset.verbForm)draftModel.components.find(c=>c.id===field.dataset.verbForm).verb.form=field.value;
 if(field.hasAttribute('data-mode-select'))draftType=field.value;
});
root.addEventListener('click',async e=>{
 const b=/** @type {HTMLButtonElement} */(/** @type {HTMLElement} */(e.target).closest('[data-action]'));if(!b||b.disabled||b.closest('[data-board]'))return;
 const action=b.dataset.action;
 if(action==='choose'){model=templateModel(b.dataset.template);type='sentenceBuild';exercise=createExercise(model,type);renderRun();focusHeading();}
 if(action==='resume'){exercise=createExercise(model,type);renderRun(read(STORE)?.order);focusHeading();}
 if(action==='home'&&!client){renderLanding();focusHeading();}
 if(action==='edit')openSettings();
 if(action==='new'){draftModel.components.forEach(c=>{c.value='';if(c.verb){c.verb.surfaceForm='';c.verb.lemma='';}});draftModel.id=crypto.randomUUID();renderSettings();/** @type {HTMLInputElement} */(settings().querySelector('[data-value]')).focus();}
 if(action==='cancel-settings')settings().close();
 if(action==='apply-settings'){
  const issues=modelIssues(draftModel);if(issues.length)return settingsError(issues.map(i=>i.message).join(' '));
  if(type===draftType&&JSON.stringify(model)===JSON.stringify(draftModel)){settings().close();return;}
  model=draftModel;type=draftType;exercise=createExercise(model,type);renderRun();/** @type {HTMLButtonElement} */(root.querySelector('[data-action="edit"]')).focus();
 }
 if(action==='undo')board.undo();if(action==='mix')board.mix();if(action==='reset')board.reset();if(action==='clear')board.clear();if(action==='solution')board.setOrder(canonicalOrder(model));
 if(action==='live')await startLive();
 if(action==='retry'){error('');connect(credentials);focusHeading('[data-live] h2');}
 if(action==='fallback')finishLive('Je werkt nu klassikaal verder.');
 if(action==='start'||action==='again')await command('start');if(action==='again-mix')await command('start',{shuffle:true});if(action==='review')await command('review');if(action==='close')await command('close');
 if(action==='select'){const g=liveState.groups[Number(b.dataset.group)];chosen=chosen.includes(g.key)?chosen.filter(k=>k!==g.key):[...chosen,g.key].slice(-2);renderLive();}
 if(action==='show'){shown=liveState.groups.filter(g=>chosen.includes(g.key));renderLive();}if(action==='hide'){shown=[];renderLive();}
});
const saved=read(STORE),validSaved=saved&&Object.hasOwn(exerciseLabels,saved.type)&&!modelIssues(saved.model).length;
if(validSaved){model=saved.model;type=saved.type;savedActivity=true;}else if(saved)put(STORE+'-backup',saved);
const savedCredentials=read(LIVE,sessionStorage);
if(savedCredentials?.code&&savedCredentials?.token){exercise=createExercise(model,type);renderRun(validSaved?saved.order:canonicalOrder(model));connect(savedCredentials);}
else if(location.hash==='#bord'&&validSaved){exercise=createExercise(model,type);renderRun(saved.order);}
else renderLanding();
