(function(root){
 'use strict';
 const runtime=root.ContentRuntime,catalog=root.DIGIBORD_CONTENT_CATALOG,engines=root.GameEngineRegistry;
 const $=s=>document.querySelector(s),clone=v=>structuredClone(v),engineKinds={WHEEL:'draaiwiel',MEMORY:'memory',MATCH:'koppelen',SORT:'sorteren',SEQUENCE:'rangschikken',QUIZ:'categorieenquiz',RIDDLE:'raad-het-woord'};
 let service,search='',onlyFavorites=false,scheduled=false,writing=Promise.resolve(),restoring=false;
 const revisions=new Map();
 const int=n=>Number.isInteger(n)&&n>=0,nums=a=>Array.isArray(a)&&a.every(int),bools=a=>Array.isArray(a)&&a.every(x=>typeof x==='boolean');
 const keys=(o,allowed)=>!!o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>allowed.includes(k));
 const activityKeys=['kind','round','selected','done','revealed','sequence','attempts','correct','hints','answer','question','answers','quizRevealed','team','scores','rotation','order'];
 function validActivity(p){
  if(!keys(p,activityKeys)||!Object.values(engineKinds).includes(p.kind))return false;
  for(const [k,v] of Object.entries(p)){
   if(k==='kind')continue;
   if(['selected','question'].includes(k)&&v===null)continue;
   if(['done','revealed','sequence','scores','order'].includes(k)){if(!nums(v))return false;continue}
   if(['correct','answer'].includes(k)){if(typeof v!=='boolean')return false;continue}
   if(['answers','quizRevealed'].includes(k)){if(!v||Array.isArray(v)||Object.entries(v).some(([key,x])=>!/^\d+$/.test(key)||!(int(x)||typeof x==='boolean'||['manual-correct','manual-incorrect'].includes(x))))return false;continue}
   if(!Number.isFinite(v)||k!=='rotation'&&!int(v))return false;
  }return true;
 }
 function validBoard(p){return keys(p,['variant','mode','positions','finished','round','turn','pending','used','seatCount'])&&['rotterdam','zwolle'].includes(p.variant)&&['class','groups','pairs','individual'].includes(p.mode)&&nums(p.positions)&&bools(p.finished)&&p.positions.length===p.finished.length&&int(p.round)&&int(p.turn)&&int(p.seatCount)&&Array.isArray(p.used)&&p.used.every(x=>typeof x==='string'&&/^[\w-]+$/.test(x))&&(!p.pending||keys(p.pending,['actor','position','choice','contentItemId'])&&int(p.pending.actor)&&int(p.pending.position)&&typeof p.pending.choice==='boolean'&&(p.pending.contentItemId===null||typeof p.pending.contentItemId==='string'))}
 const progressAdapters=Object.fromEntries(engines.contentEngines().map(e=>[e.id,{version:e.version,schemaVersion:1,validate:p=>e.id==='BOARD'?validBoard(p):e.id==='CARDS'||e.id==='DICE'?keys(p,['index','lastRoll','turn'])&&int(p.index)&&int(p.lastRoll)&&int(p.turn):validActivity(p)&&p.kind===engineKinds[e.id]}]));
 service=LessonStorage(runtime,LessonStorageAdapters.createIndexedDBAdapter(indexedDB),undefined,progressAdapters);
 function progress(){
  const s=runtime.activeSession();if(!s||!$('#screen-game.active'))return null;
  let payload;
  if(s.selected_game_engine==='BOARD'){
   if(APP.last?.type!=='board')return null;
   const variant=s.selected_game_variant||'rotterdam',b=APP.boardStates[variant],actors=boardActors(variant);if(!b||boardBusy)return null;
   const pending=b.pending?{actor:Math.max(0,actors.findIndex(a=>a.id===b.pending.actorId)),position:b.pending.position,choice:!!b.pending.choice,contentItemId:b.pending.task?.contentItemId||null}:null;
   payload={variant,mode:s.organization_mode,positions:actors.map(a=>a.pos),finished:actors.map(a=>a.finished),round:b.round,turn:APP.turn.active,seatCount:actors.length,pending,used:[...(APP.contentVert001Used?.[s.session_id+':BOARD']||[])]};
  }else if(['CARDS','DICE'].includes(s.selected_game_engine)){
   if(s.selected_game_engine==='CARDS'&&APP.cardKind!=='content-vert001'||s.selected_game_engine==='DICE'&&APP.last?.data.kind!=='content-dice')return null;
   payload={index:s.selected_game_engine==='CARDS'?APP.cardIndex||0:APP.contentDiceIndex||0,lastRoll:s.selected_game_engine==='DICE'?APP.contentDiceLastRoll||0:0,turn:APP.turn.active};
  }else{payload=DigiActivities.exportProgress();if(!payload||payload.kind!==engineKinds[s.selected_game_engine])return null}
  return {engine_id:s.selected_game_engine,engine_version:engines.get(s.selected_game_engine).version,progress_schema_version:1,state_payload:payload,last_checkpoint_at:new Date().toISOString()};
 }
 function checkpoint(){
  if(restoring||scheduled||root.DigiStorageBackupError)return;scheduled=true;
  queueMicrotask(()=>{scheduled=false;const session=runtime.activeSession();if(!session||!$('#screen-game.active'))return;const snapshot=clone(session),p=progress();if(!p)return;
   writing=writing.then(async()=>{const key='recent-'+snapshot.session_id;if(!revisions.has(key)){const existing=await service.list('recent_session',{archived:true});revisions.set(key,existing.find(r=>r.recent_session_id===key)?.record_revision??null)}const record=await service.storeRecentSession(snapshot,p,{expected_revision:revisions.get(key)});revisions.set(key,record.record_revision)}).catch(error=>showError(error));
  });
 }
 function showError(error){let el=$('#lessonError');if(!el){el=document.createElement('p');el.id='lessonError';el.className='lesson-error';el.setAttribute('role','alert');$('#lessonLibrary').prepend(el)}el.textContent=error.message;toast(error.message)}
 function validateProgress(p,s){
  service.validatePrivacyPayload(p);const v=p.state_payload;
  if(s.selected_game_engine!==p.engine_id||s.game_engine_versions[p.engine_id]!==p.engine_version)throw new Error('De spelversie van deze voortgang wijkt af.');
  if(p.engine_id==='BOARD'){
   const count=s.organization_mode==='class'?1:teamMode(s.organization_mode)?teamInfo(s.organization_mode).count:participants().length;
   if(count!==v.seatCount||v.positions.length!==count||v.pending?.actor>=count||v.variant!==(s.selected_game_variant||'rotterdam')||v.mode!==s.organization_mode)throw new Error('De groepsindeling of bordindeling is veranderd. Gebruik dezelfde indeling om verder te gaan.');
   if(v.used.some(id=>!s.selected_item_ids.includes(id))||v.pending?.contentItemId&&!s.selected_item_ids.includes(v.pending.contentItemId))throw new Error('Deze voortgang verwijst naar andere opdrachten.');
  }else if(['CARDS','DICE'].includes(p.engine_id)&& (v.index>=s.selected_item_ids.length||v.lastRoll>6))throw new Error('Ongeldige kaartpositie.');
  else if(!['BOARD','CARDS','DICE'].includes(p.engine_id))DigiActivities.validateProgress(v,s);
 }
 async function resumeActive(){const s=runtime.activeSession();await writing;const key='recent-'+s.session_id;try{const record=(await service.list('recent_session',{archived:true})).find(r=>r.recent_session_id===key);if(record)return handle('resume',key);ContentUI.launch(s,{resume:true})}catch(error){showError(error)}}
 function restoreProgress(p){
  const s=runtime.activeSession(),v=p.state_payload;validateProgress(p,s);
  if(s.selected_game_engine!==p.engine_id||s.game_engine_versions[p.engine_id]!==p.engine_version)throw new Error('De spelversie van deze voortgang wijkt af.');
  if(p.engine_id==='BOARD'){
   const count=s.organization_mode==='class'?1:teamMode(s.organization_mode)?teamInfo(s.organization_mode).count:participants().length;
   if(count!==v.seatCount)throw new Error('De groepsindeling is veranderd. Gebruik dezelfde indeling om verder te gaan.');
   if(v.used.some(id=>!s.selected_item_ids.includes(id))||v.pending?.contentItemId&&!s.selected_item_ids.includes(v.pending.contentItemId))throw new Error('Deze voortgang verwijst naar andere opdrachten.');
   APP.contentBoardBaseline??={};APP.contentBoardBaseline[v.variant]??=clone(APP.boardStates[v.variant]||{});
   const b=APP.boardStates[v.variant]={positions:{},finished:{},groupPositions:{},groupFinished:{},round:v.round,classPos:v.positions[0]||0};
   const ids=s.organization_mode==='class'?['class']:teamMode(s.organization_mode)?v.positions.map((_,i)=>teamInfo(s.organization_mode).prefix+(i+1)):participants().map(p=>p.id);
   ids.forEach((id,i)=>{if(teamMode(s.organization_mode)){b.groupPositions[id]=v.positions[i];b.groupFinished[id]=v.finished[i]}else{b.positions[id]=v.positions[i];b.finished[id]=v.finished[i]}});
   if(v.pending)b.pending={mode:v.mode,actorId:ids[v.pending.actor],position:v.pending.position,choice:v.pending.choice,task:v.pending.contentItemId?contentBoardTask(runtime.itemById(v.pending.contentItemId)):undefined};
   APP.turn.active=v.turn;APP.contentVert001Used??={};APP.contentVert001Used[s.session_id+':BOARD']=[...v.used];
  }else if(['CARDS','DICE'].includes(p.engine_id)){if(v.index>=s.selected_item_ids.length||v.lastRoll>6)throw new Error('Ongeldige kaartpositie.');if(p.engine_id==='CARDS')APP.cardIndex=v.index;else{APP.contentDiceIndex=v.index;APP.contentDiceLastRoll=v.lastRoll}APP.turn.active=v.turn}
  else DigiActivities.restoreProgress(v);
 }
 const labelTopic=id=>catalog.families.flatMap(f=>f.topics).find(t=>t.id===id)?.label||id;
 function description(spec){return spec.scope_clauses.map(c=>(c.topic_ids.length?c.topic_ids.map(labelTopic).join(', '):'Alle onderwerpen')+' · '+(c.cefr_levels.join(', ')||'Alle beschikbare niveaus')).join(' + ')}
 const action=(kind,id,label,disabled=false)=>`<button class="smallbtn" type="button" data-lesson-action="${kind}" data-id="${esc(id)}" ${disabled?'disabled':''}>${esc(label)}</button>`;
 async function render(){
  const mount=$('#lessonLibrary');if(!mount)return;
  try{
   await writing;
   const [lessons,recent,favorites,mixes]=await Promise.all(['saved_selection','recent_session','favorite','mix_profile'].map(k=>service.list(k)));
   const fav=(type,id)=>favorites.find(f=>f.ref_type===type&&f.ref_id===id),toggle=(type,id)=>action('favorite:'+type,id,fav(type,id)?'★ Favoriet':'☆ Favoriet');
   const query=search.toLocaleLowerCase('nl'),visible=(o,type)=>o.name.toLocaleLowerCase('nl').includes(query)&&(!onlyFavorites||fav(type,o[kindId(type)]));
   const cards=await Promise.all(lessons.filter(o=>visible(o,'saved_selection')).map(async o=>{const result=await service.resolveSavedSelection(o.saved_selection_id),ready=result.status==='READY';return `<article class="lesson-card"><span class="lesson-origin">${o.owner_scope==='system'?'Van Taalroute':o.owner_scope==='school'?'Van mijn school':'Mijn les'}</span><h3>${esc(o.name)}</h3><p>${esc(description(o.selection_spec))}</p><p class="lesson-status">${ready?'Klaar':esc(result.message)}</p><div class="lesson-actions">${action('start',o.saved_selection_id,'Start',!ready)}${action('edit',o.saved_selection_id,'Aanpassen')}${toggle('saved_selection',o.saved_selection_id)}${action('archive',o.saved_selection_id,'Archiveren')}</div></article>`}));
   const recents=await Promise.all(recent.sort((a,b)=>b.last_active_at.localeCompare(a.last_active_at)).slice(0,12).map(async o=>{let canResume=false,reason='';try{await service.resumeRecentSession(o.recent_session_id);canResume=true}catch(error){reason=error.message}const session=o.session_config_snapshot;return `<article class="lesson-card"><h3>${esc(labelTopic(session.topic))} · ${esc(session.cefr_level)}</h3><p>${esc(engines.get(session.selected_game_engine)?.label||'Spel')} · ${new Date(o.last_active_at).toLocaleDateString('nl-NL')}</p>${reason?`<p class="lesson-status">${esc(reason)}</p>`:''}<div class="lesson-actions">${canResume?action('resume',o.recent_session_id,'Ga verder'):''}${action('replay',o.recent_session_id,'Dezelfde opdrachten opnieuw')}${action('reroll',o.recent_session_id,'Nieuwe opdrachten')}${action('other',o.recent_session_id,'Andere spelvorm')}${action('archive-recent',o.recent_session_id,'Archiveren')}</div></article>`}));
   const favoriteCards=[];for(const f of favorites.filter(f=>!['saved_selection','mix_profile'].includes(f.ref_type))){try{const target=await service.resolveFavorite(f);favoriteCards.push(`<article class="lesson-card"><h3>${esc(engines.get(target.engine)?.label||f.ref_id)}</h3><div class="lesson-actions">${action('favorite-open',f.favorite_ref_id,'Kies inhoud')}${action('unfavorite',f.favorite_ref_id,'Verwijder favoriet')}</div></article>`)}catch{favoriteCards.push(`<article class="lesson-card"><h3>Niet meer beschikbaar</h3>${action('unfavorite',f.favorite_ref_id,'Verwijder uit favorieten')}</article>`)}}
   mount.innerHTML=`<h1>Mijn lessen</h1><p>Bewaar je keuzes en ga verder met je les. Je lessen staan op dit apparaat.</p><div class="lesson-toolbar"><input id="lessonSearch" aria-label="Zoek je les" placeholder="Zoek je les" value="${esc(search)}"><button class="smallbtn" id="lessonFavorites" aria-pressed="${onlyFavorites}">★ Favorieten</button><button class="primary" id="lessonNew">Nieuwe les</button><button class="smallbtn" id="lessonMix">Mix maken</button></div><section class="lesson-group"><h2>Bewaarde lessen</h2><div class="lesson-grid">${cards.join('')||'<p>Nog geen lessen. Kies Oefenen en gebruik Bewaar als les.</p>'}</div></section><section class="lesson-group"><h2>Mijn mixen</h2><div class="lesson-grid">${mixes.filter(o=>visible(o,'mix_profile')).map(o=>`<article class="lesson-card"><h3>${esc(o.name)}</h3><p>${esc(description(o))}</p><div class="lesson-actions">${action('mix-open',o.mix_profile_id,'Kies spelvorm')}${action('mix-edit',o.mix_profile_id,'Aanpassen')}${toggle('mix_profile',o.mix_profile_id)}${action('archive-mix',o.mix_profile_id,'Archiveren')}</div></article>`).join('')||'<p>Combineer onderwerpen zonder opdrachten te kopiëren.</p>'}</div></section>${favoriteCards.length?`<section class="lesson-group"><h2>Favoriete spelvormen</h2><div class="lesson-grid">${favoriteCards.join('')}</div></section>`:''}<section class="lesson-group"><h2>Recent gebruikt</h2><div class="lesson-grid">${recents.join('')||'<p>Hier verschijnen je gestarte lessen.</p>'}</div></section>`;
   $('#lessonSearch').onchange=e=>{search=e.target.value;render()};$('#lessonFavorites').onclick=()=>{onlyFavorites=!onlyFavorites;render()};$('#lessonNew').onclick=()=>{ContentUI.clearEditing();ContentUI.open()};$('#lessonMix').onclick=()=>openMix();
   if(root.DigiStorageBackupError)showError(new Error('De reservekopie van 1.24 kon niet worden gemaakt. Maak ruimte vrij voordat je gegevens bewaart.'));
  }catch(error){mount.innerHTML='<h1>Mijn lessen</h1>';showError(error)}
 }
 function kindId(type){return type==='saved_selection'?'saved_selection_id':'mix_profile_id'}
 function saveDraft(update=false){
  const editing=ContentUI.editing(),spec=ContentUI.selectionSpec(),prefs=ContentUI.preferences(),name=editing?.name||description(spec);
  openGameDialog(update?'Les opslaan':'Bewaar als les',`<form id="lessonSaveForm" class="lesson-form"><label>Naam<input id="lessonName" maxlength="160" value="${esc(name)}" required></label><p>Je bewaart de keuzes. Start maakt steeds een nieuwe les met passende opdrachten.</p><p id="lessonSaveError" role="alert"></p><button class="primary">${update?'Opslaan':'Bewaar als nieuwe les'}</button></form>`,()=>{$('#lessonSaveForm').onsubmit=async e=>{e.preventDefault();try{if(root.DigiStorageBackupError)throw new Error('Maak eerst ruimte vrij voor de reservekopie.');const input={name:$('#lessonName').value,selection_spec:spec,execution_preferences:prefs};const result=update?await service.updateSavedSelection(editing.saved_selection_id,input,editing.record_revision):await service.saveSelection(input);$('#gameDialog').close();ContentUI.loadSelection(result.selection_spec,result.execution_preferences,{record:result});toast('Les bewaard.')}catch(error){$('#lessonSaveError').textContent=error.message}}});
 }
 async function favoriteGame(engine,variant){try{await service.addFavorite(variant?'game_variant':'game_engine',engine+(variant?'/'+variant:''));toast('Spelvorm toegevoegd aan favorieten.')}catch(error){showError(error)}}
 function openMix(existing=null,record=null){
  const options=catalog.families.flatMap(f=>f.topics.map(t=>({family:f.id,topic:t.id,label:t.label,levels:t.levels}))),chosen=existing?.scope_clauses||[];
  openGameDialog('Mix maken',`<form id="lessonMixForm" class="lesson-form"><label>Naam<input id="mixName" maxlength="160" value="${esc(record?.name||'Mijn mix')}" required></label><label>Zoek onderwerp<input id="mixSearch" type="search" placeholder="Bijvoorbeeld ER of hoofdzin"></label><div class="lesson-mix-options">${options.map((o,i)=>{const c=chosen.find(c=>c.content_family_id===o.family&&(c.topic_ids.includes(o.topic)||o.topic==='MODAAL'&&c.topic_ids.includes('ZULLEN')&&c.topic_ids.includes('ZOUDEN')));return `<label class="lesson-mix-option" data-search="${esc(o.label.toLocaleLowerCase('nl'))}"><input type="checkbox" name="mixTopic" value="${i}" ${c?'checked':''}><span>${esc(o.label)}</span><select aria-label="Niveau voor ${esc(o.label)}" data-mix-level="${i}">${o.levels.map(l=>`<option ${c?.cefr_levels.includes(l)?'selected':''}>${esc(l)}</option>`).join('')}</select><select aria-label="Nadruk op ${esc(o.label)}" data-mix-weight="${i}"><option value="1">Normaal</option><option value="2" ${c?.weight===2?'selected':''}>Meer nadruk</option></select></label>`}).join('')}</div><label>Verdeling<select id="mixDistribution"><option value="equal">Gelijk verdelen</option><option value="weighted" ${existing?.distribution_spec.mode==='weighted'?'selected':''}>Gebruik mijn nadruk</option></select></label><label>Moeilijkheid<select id="mixDifficulty"><option value="basis">Basis · instap A0</option><option value="midden" ${existing?.filter_spec?.difficulty==='midden'?'selected':''}>Gemiddeld</option><option value="hoog" ${existing?.filter_spec?.difficulty==='hoog'?'selected':''}>Uitdagend · later in A1</option><option value="all" ${existing?.filter_spec?.difficulty==='all'?'selected':''}>Gemengd</option></select></label><p>De gekozen niveaus blijven behouden. Kies voor een A0-instap Basis.</p><p id="mixError" role="alert"></p><button class="primary">${record?'Mix opslaan':'Bewaar mix en kies spelvorm'}</button></form>`,()=>{
   $('#mixSearch').oninput=e=>document.querySelectorAll('[data-search]').forEach(el=>{el.hidden=!el.dataset.search.includes(e.target.value.toLocaleLowerCase('nl'))});
   $('#lessonMixForm').onsubmit=async e=>{e.preventDefault();try{const scope_clauses=[...document.querySelectorAll('[name=mixTopic]:checked')].map(input=>{const i=Number(input.value),o=options[i];return {scope_id:'scope-'+o.family+'-'+o.topic,content_family_id:o.family,content_bank_ids:[],topic_ids:o.topic==='MODAAL'?['ZULLEN','ZOUDEN']:[o.topic],cefr_levels:[$('[data-mix-level="'+i+'"]').value],subtopic_ids:[],interaction_type_ids:[],weight:Number($('[data-mix-weight="'+i+'"]').value)}});const input={name:$('#mixName').value,scope_clauses,filter_spec:{...(existing?.filter_spec||{}),difficulty:$('#mixDifficulty').value},distribution_spec:{mode:$('#mixDistribution').value},compatibility_policy:'compatible_only',execution_defaults:ContentUI.preferences()};const mix=record?await service.updateMixProfile(record.mix_profile_id,input,record.record_revision):await service.createMixProfile(input);$('#gameDialog').close();ContentUI.loadSelection(mix,mix.execution_defaults);toast('Mix bewaard.')}catch(error){$('#mixError').textContent=error.message}};
  });
 }
 async function handle(actionName,key){
  try{
   await writing;
   if(actionName.startsWith('favorite:')){const type=actionName.split(':')[1],prior=(await service.list('favorite')).find(f=>f.ref_type===type&&f.ref_id===key);if(prior)await service.removeFavorite(prior.favorite_ref_id,prior.record_revision);else await service.addFavorite(type,key);return render()}
   if(actionName==='start'){ContentUI.launch(await service.createSessionFromSelection(key));return}
   if(actionName==='edit'){const o=await service.get('saved_selection',key);ContentUI.loadSelection(o.selection_spec,o.execution_preferences,{record:o});return}
   if(actionName==='resume'){const {session,progress:p,record}=await service.resumeRecentSession(key);restoring=true;try{ContentUI.launch(session,{resume:true,progress:p});revisions.set(key,record.record_revision)}finally{restoring=false}checkpoint();return}
   if(actionName==='replay'){ContentUI.launch(await service.replayRecentSessionExact(key));return}
   if(actionName==='reroll'){
    openGameDialog('Nieuwe opdrachten','<p>Je start een nieuwe sessie met dezelfde instellingen en de huidige beschikbare inhoud. De opdrachten kunnen verschillen van je vorige les.</p><button class="primary" id="confirmReroll">Start nieuwe sessie</button>',()=>{$('#confirmReroll').onclick=async()=>{try{const session=await service.rerollRecentSession(key);$('#gameDialog').close();ContentUI.launch(session)}catch(error){showError(error)}}});return;
   }
   if(actionName==='other'){const o=await service.get('recent_session',key),s=o.session_config_snapshot;ContentUI.loadSelection(s.normalized_selection_spec,{target_duration_seconds:s.target_duration_seconds,organization_mode:s.organization_mode,preferred_game_engine:null,preferred_game_variant:null});return}
   if(actionName==='archive'){const o=await service.get('saved_selection',key);await service.archiveSavedSelection(key,o.record_revision)}
   if(actionName==='archive-recent'){const o=await service.get('recent_session',key);await service.archiveRecentSession(key,o.record_revision)}
   if(actionName==='archive-mix'){const o=await service.get('mix_profile',key);await service.archiveMixProfile(key,o.record_revision)}
   if(actionName==='mix-open'||actionName==='mix-edit'){const o=await service.get('mix_profile',key);if(actionName==='mix-edit')openMix(o,o);else ContentUI.loadSelection(o,o.execution_defaults);return}
   if(actionName==='unfavorite'){const o=await service.get('favorite',key);await service.removeFavorite(key,o.record_revision)}
   if(actionName==='favorite-open'){const target=await service.resolveFavorite(key);ContentUI.clearEditing();ContentUI.open(target);return}
   await render();
  }catch(error){showError(error)}
 }
 document.addEventListener('click',event=>{const b=event.target.closest('[data-lesson-action]');if(b&&!b.disabled)handle(b.dataset.lessonAction,b.dataset.id)});
 $('[data-main="lessons"]')?.addEventListener('click',render);
 root.LessonUI={service,progressAdapters,checkpoint,validateProgress,resumeActive,restoreProgress,saveDraft,favoriteGame,openMix,render,handle,flush:async()=>{await Promise.resolve();await writing}};
 // Each established game keeps its original entry and gains the same content-first preparation.
 for(const tile of document.querySelectorAll('[data-activity],[data-board],[data-library-board]')){
  const engine=tile.dataset.board||tile.dataset.libraryBoard?'BOARD':Object.keys(engineKinds).find(e=>engineKinds[e]===tile.dataset.activity);
  if(!engine||tile.dataset.set||tile.closest('#gameMount'))continue;
  const button=document.createElement('button');button.type='button';button.className='smallbtn';button.dataset.practiceEngine=engine;if(engine==='BOARD')button.dataset.practiceVariant=tile.dataset.board||tile.dataset.libraryBoard;button.textContent='Kies inhoud';button.setAttribute('aria-label','Kies inhoud voor '+(engines.get(engine)?.label||'dit spel'));
  const wrapper=document.createElement('div');wrapper.className='activity-entry';tile.before(wrapper);wrapper.append(tile,button);
 }
 const diceHead=$('#screen-dice .category-head'),wordsHead=$('#screen-words .category-head');
 if(diceHead){const b=document.createElement('button');b.className='smallbtn';b.dataset.practiceEngine='DICE';b.textContent='Kies inhoud voor dobbelspel';diceHead.append(b)}
 if(wordsHead){const b=document.createElement('button');b.className='smallbtn';b.textContent='Oefenen met Woorden en zinnen';b.onclick=()=>{ContentUI.clearEditing();ContentUI.open({family:'words'})};wordsHead.append(b)}
 if(root.contentRestoreError)toast('Je oude sessie is bewaard, maar deze inhoudsversie kan nu niet worden hervat.');
})(typeof globalThis!=='undefined'?globalThis:this);
