(function(root){
 'use strict';
 const catalog=root.DIGIBORD_CONTENT_CATALOG,engineRegistry=root.GameEngineRegistry;
 if(!catalog||!root.ContentRuntime||!engineRegistry)return;
 function registerBank(bank,metadata){ContentRuntime.registerBank(bank,metadata);catalog.registerBank(bank,metadata)}
 registerBank(ContentBankAdapters(WORD_CONTENT),{familyId:'words',label:'Woorden en zinnen',defaultDifficulty:'basis',description:'A0 naar A1: begin met Basis en kies later meer uitdaging.'});
 registerBank(ContentBankAdapters.riddles(DIGIBORD_ACTIVITIES),{familyId:'riddles',label:'Woordraadsels',description:'Bestaande woordraadsels zonder vastgesteld taalniveau. De docent kiest wat past.',reviewGate:['LEGACY_PRESERVED'],selection_dimensions:{topic:'required',level:'required',production:'not_applicable',difficulty:'not_applicable'}});
 let externalSpec=null,editing=null,moreOpen=false;
 const $=s=>document.querySelector(s);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const defaults={family:'grammar',topic:'ER',profile:'',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'class',engine:null,variant:null};
 let state={...defaults,...(APP.contentUiDraft||{})},seedOverride=null;
 function family(){return catalog.families.find(x=>x.id===state.family)||null}
 function topic(){const f=family();return f?.topics.find(x=>x.id===state.topic)||null}
 function focus(){return catalog.focuses.find(x=>x.id===state.focus)||null}
 function engines(){return engineRegistry.contentEngines().map(x=>({id:x.id,label:x.label,description:x.description,variants:x.variants}))}
 function engine(){return engines().find(x=>x.id===state.engine)||null}
 function topicSubtopics(){
  const t=topic();if(!t)return[];
  return (t.subtopics||[{id:'all',label:'Alles',levels:t.levels}]).filter(x=>!x.levels||x.levels.includes(state.level));
 }
 function scopeError(){
  if(externalSpec){try{ContentRuntime.selectionPool(externalSpec);return ''}catch(e){return e.message}}
  const f=family();if(!f)return'De gekozen inhoud is niet beschikbaar.';
  const t=topic();if(!t)return'Het gekozen onderwerp is niet beschikbaar.';
  if(!t.levels.includes(state.level))return'Dit niveau is niet beschikbaar voor het gekozen onderwerp.';
  if(!topicSubtopics().some(x=>x.id===state.subtopic))return'Het gekozen subonderwerp is niet beschikbaar op dit niveau.';
  if(!focus())return'Deze oefening is niet beschikbaar.';
  if(!catalog.productionModes.some(x=>x.id===state.production))return'Deze manier van antwoorden is niet beschikbaar.';
  if(!catalog.difficulties.some(x=>x.id===state.difficulty))return'De gekozen moeilijkheid is niet beschikbaar.';
  if(!catalog.durations.some(x=>x.seconds===state.duration))return'De gekozen tijdsduur is niet beschikbaar.';
  if(!catalog.organizations.some(x=>x.id===state.organization))return'Deze groepsindeling is niet beschikbaar.';
  return'';
 }
 function emptyAvailability(){return Object.freeze({source_count:0,source_duration_seconds:0,common_count:0,common_duration_seconds:0,engines:Object.freeze(Object.fromEntries(engines().map(e=>[e.id,Object.freeze({count:0,duration_seconds:0,adapter_count:0})])))})}
 function filters(){
  const error=scopeError();if(error)throw new Error(error);
  const t=topic();
  return {
   family_ids:[state.family],topics:t.sourceTopics||[t.id],levels:[state.level],family_tags:t.familyTags||[],
   language_functions:state.subtopic==='all'?[]:[state.subtopic],exercise_types:focus().exerciseTypes,
   productive_or_receptive:state.production,difficulty:state.difficulty
  };
 }
 function selectionSpec(){return externalSpec||ContentRuntime.specFromFilters(filters())}
 function preferences(){return {target_duration_seconds:state.duration,organization_mode:state.organization,preferred_game_engine:state.engine,preferred_game_variant:state.variant}}
 function availability(){
  if(scopeError())return emptyAvailability();
  if(!externalSpec)return ContentRuntime.availability(filters());
  const pool=ContentRuntime.selectionPool(externalSpec),duration=pool.reduce((n,i)=>n+i.estimated_duration_seconds,0);
  return {source_count:pool.length,source_duration_seconds:duration,engines:Object.fromEntries(engines().map(e=>[e.id,{count:pool.filter(i=>ContentRuntime.compatibility(i,e.id).compatible).length,full_coverage:ContentRuntime.setCompatibility(pool,e.id),duration_seconds:duration}]))};
 }
 function compatibleEngineIds(){if(scopeError())return [];return ContentRuntime.compatibleSelectionEngines(selectionSpec(),state.organization)}
 function capacitySeconds(){return compatibleEngineIds().length?availability().source_duration_seconds:0}
 function persist(){APP.contentUiDraft={...state};save()}
 function applyProfile(id){
  const t=topic(),profile=t?.profiles.find(x=>x.id===id);state.profile=id||'';
  if(profile){state.level=profile.level;state.subtopic='all';state.focus='all';state.production='all';state.difficulty='all'}
 }
 function setState(patch,{render=true}={}){
  if(Object.keys(patch).some(k=>['family','topic','level','focus','subtopic','production','difficulty'].includes(k)))externalSpec=null;
  const previousFamily=state.family,previousTopic=state.topic,previousLevel=state.level;state={...state,...patch};
  if(state.family!==previousFamily){
   const f=family();
   if(f){state.topic=patch.topic||f.topics[0]?.id||'';const t=topic();state.level=patch.level||t?.levels[0]||'';state.profile='';state.subtopic='all';state.focus='all';state.production='all';state.difficulty=f.defaultDifficulty||'all'}
  }else if(state.topic!==previousTopic){
   const t=topic();
   if(t){state.level=patch.level||state.level;state.profile='';state.subtopic='all';state.focus='all';state.production='all';state.difficulty=family().defaultDifficulty||'all'}
  }else if(state.level!==previousLevel&&topic()?.levels.includes(state.level))state.subtopic='all';
  if(state.profile&&Object.keys(patch).some(k=>['level','subtopic','focus','production','difficulty'].includes(k)))state.profile='';
  const e=engine();if(e&&!e.variants.some(v=>v.id===state.variant))state.variant=e.variants[0]?.id||null;
  persist();if(render)renderPage();
 }
 function choiceGroup(name,label,items,value){
  return `<fieldset class="practice-field"><legend>${esc(label)}</legend><div class="practice-choice-row">${items.map(item=>`<label class="practice-choice ${String(value)===String(item.id??item.seconds)?'selected':''}"><input type="radio" name="${esc(name)}" value="${esc(item.id??item.seconds)}" ${String(value)===String(item.id??item.seconds)?'checked':''}><span>${esc(item.label)}</span></label>`).join('')}</div></fieldset>`;
 }
 function selectField(name,label,items,value){
  const valid=items.some(item=>String(item.id)===String(value)),invalid=!valid&&value!==''&&value!=null?'<option value="__invalid__" selected disabled>Niet beschikbaar</option>':'';
  return `<label class="practice-select"><span>${esc(label)}</span><select name="${esc(name)}">${invalid}${items.map(item=>`<option value="${esc(item.id)}" ${String(item.id)===String(value)?'selected':''}>${esc(item.label)}</option>`).join('')}</select></label>`;
 }
 function renderEngines(a,compatible,capacity){
  const visible=engines().filter(item=>compatible.includes(item.id));
  const suggestions=!externalSpec&&state.engine&&!compatible.includes(state.engine)&&!scopeError()?catalog.focuses.filter(f=>{try{return f.id!==state.focus&&ContentRuntime.fullCoverageEngines({...filters(),exercise_types:f.exerciseTypes},state.organization).includes(state.engine)}catch{return false}}):[];
  const guidance=suggestions.length?`<p class="practice-note">Voor ${esc(engine()?.label)} kun je kiezen:</p><div class="lesson-actions">${suggestions.map(f=>`<button type="button" class="smallbtn" data-practice-focus="${esc(f.id)}">${esc(f.label)}</button>`).join('')}</div>`:'';
  return `${guidance}<fieldset class="practice-field practice-engines"><legend>Hoe wil je oefenen?</legend><div class="practice-engine-grid">${visible.map(item=>{
   const own=a.engines[item.id]?.count||0,enabled=capacity>=state.duration;
   return `<label class="practice-engine ${state.engine===item.id?'selected':''}"><input type="radio" name="engine" value="${item.id}" ${state.engine===item.id?'checked':''} ${enabled?'':'disabled'}><strong>${esc(item.label)}</strong><span>${esc(item.description)}</span><small>${own} geschikte opdrachten${enabled?'':' · onvoldoende voor de gekozen duur'}</small></label>`;
  }).join('')}</div></fieldset>`;
 }
 function renderSummary(a,compatible,capacity){
  const t=topic(),e=engine(),variant=e?.variants.find(v=>v.id===state.variant),minutes=Math.round(capacity/60),selectedCount=e?(a.engines[e.id]?.count||0):a.source_count,error=scopeError();
  const blocker=error||(!a.source_count?'Geen inhoud gevonden voor deze selectie.':!compatible.length?'Er is nog geen passend spel voor deze oefening.':capacity<state.duration?`Je hebt oefeningen voor ongeveer ${minutes} minuten. Kies een kortere duur of kies meer inhoud.`:!state.engine?'Kies nog een spelvorm.':!compatible.includes(state.engine)?'Deze spelvorm past niet bij de volledige selectie. Kies een andere spelvorm of pas de inhoud aan.':'');
  return `<aside class="practice-summary"><span class="eyebrow">Jouw les</span><h2>${esc(externalSpec?editing?.name||'Mijn mix':t?.label||state.topic)} · ${esc(externalSpec?'Eigen selectie':state.level)}</h2><dl>${externalSpec?`<div><dt>Inhoud</dt><dd>${externalSpec.scope_clauses.map(c=>esc(c.topic_ids.join(', ')+' · '+c.cefr_levels.join(', '))).join('<br>')}</dd></div><div><dt>Moeilijkheid</dt><dd>${esc(catalog.difficulties.find(d=>d.id===externalSpec.filter_spec.difficulty)?.label||'Gemengd')}</dd></div>`:`<div><dt>Onderdeel</dt><dd>${esc(topicSubtopics().find(x=>x.id===state.subtopic)?.label||state.subtopic)}</dd></div><div><dt>Oefening</dt><dd>${esc(focus()?.label||state.focus)}</dd></div><div><dt>Antwoord</dt><dd>${esc(catalog.productionModes.find(x=>x.id===state.production)?.label||state.production)}</dd></div><div><dt>Moeilijkheid</dt><dd>${esc(catalog.difficulties.find(x=>x.id===state.difficulty)?.label||state.difficulty)}</dd></div>`}<div><dt>Duur</dt><dd>${esc(catalog.durations.find(x=>x.seconds===state.duration)?.label||state.duration)}</dd></div><div><dt>Met wie?</dt><dd>${esc(catalog.organizations.find(x=>x.id===state.organization)?.label||state.organization)}</dd></div><div><dt>Spel</dt><dd>${esc(e?.label||'Nog kiezen')}${variant&&e?.variants.length>1?' · '+esc(variant.label):''}</dd></div></dl><div class="practice-count"><strong>${selectedCount}</strong><span>geschikte oefeningen voor de gekozen spelvorm</span></div>${blocker?`<p class="practice-warning" role="status">${esc(blocker)}</p>`:`<p class="practice-ready" role="status">Alles staat klaar voor je les.</p>`}<button type="button" class="primary practice-start" id="practiceStart" ${blocker?'disabled':''}>Start</button><button type="button" class="smallbtn lesson-save" id="practiceSave" ${scopeError()?'disabled':''}>Bewaar als ${editing?'nieuwe les':'les'}</button>${editing?'<button type="button" class="smallbtn lesson-save" id="practiceUpdate">Wijzigingen opslaan</button>':''}${state.engine?'<button type="button" class="smallbtn lesson-save" id="practiceFavorite">Spelvorm als favoriet</button>':''}<button type="button" class="smallbtn lesson-save" id="practiceMix">Mix maken</button></aside>`;
 }
 function renderPage(){
  const mount=$('#contentPracticeApp');if(!mount)return;
  const a=availability(),compatible=compatibleEngineIds(),capacity=capacitySeconds();
  // Preserve an incompatible choice so the teacher can explicitly change it.
  const e=engine();if(e&&!state.variant)state.variant=e.variants[0]?.id||null;
  const f=family(),t=topic(),profileItems=[{id:'',label:'Zelf samenstellen'},...(t?.profiles||[]).map(p=>({id:p.id,label:p.label}))];
  mount.innerHTML=`<div class="practice-layout"><form class="practice-config" id="practiceForm">
   <section class="practice-panel"><h2>Wat wil je oefenen?</h2>${!externalSpec&&f?.description?`<p class="practice-note">${esc(f.description)}</p>`:''}${externalSpec?`<p>${esc(externalSpec.scope_clauses.map(c=>c.topic_ids.map(id=>catalog.families.flatMap(f=>f.topics).find(t=>t.id===id)?.label||id).join(', ')+' · '+c.cefr_levels.join(', ')).join(' + '))}</p><button type="button" class="smallbtn" id="practiceEditMix">Inhoud aanpassen</button>`:`<div class="practice-select-grid">${selectField('family','Inhoud',catalog.families,state.family)}${selectField('topic','Onderwerp',f?.topics||[],state.topic)}${selectField('level','Niveau',(t?.levels||[]).map(id=>({id,label:id})),state.level)}</div>`}${!externalSpec&&f?.id==='words'?'<p class="practice-note">Je begint bij A0 en oefent verder naar A1. Kies Basis om te beginnen. Kies Uitdagend als het goed gaat. Bespreek open antwoorden samen.</p>':''}</section>
   ${externalSpec?'':`<details class="practice-panel practice-more" ${moreOpen?'open':''}><summary>Meer opties</summary>${selectField('profile','Lesvoorstel',profileItems,state.profile)}${choiceGroup('subtopic','Onderdeel',topicSubtopics(),state.subtopic)}${choiceGroup('focus','Oefening',catalog.focuses,state.focus)}${f?.selection_dimensions?.production==='not_applicable'?'':choiceGroup('production','Spreken en begrijpen',catalog.productionModes,state.production)}${f?.selection_dimensions?.difficulty==='not_applicable'?'':choiceGroup('difficulty','Moeilijkheid',catalog.difficulties,state.difficulty)}</details>`}
   <section class="practice-panel"><h2>Hoe ziet je les eruit?</h2>${choiceGroup('duration','Tijdsduur',catalog.durations,state.duration)}${choiceGroup('organization','Met wie?',catalog.organizations,state.organization)}</section>
   <section class="practice-panel"><h2>Kies je spelvorm</h2>${renderEngines(a,compatible,capacity)}${e&&e.variants.length>1?`<label class="practice-select practice-variant"><span>Spelvariant</span><select name="variant">${e.variants.map(v=>`<option value="${v.id}" ${v.id===state.variant?'selected':''}>${esc(v.label)}</option>`).join('')}</select></label>`:''}</section>
  </form>${renderSummary(a,compatible,capacity)}</div>`;
  const selectedItems=scopeError()?[]:ContentRuntime.selectionPool(selectionSpec());
  const panel=mount.querySelector(".practice-panel");
  panel.insertAdjacentHTML("beforeend",ContentGuidance.row(selectedItems));
  ContentGuidance.bind(panel,selectedItems);
  bind();
 }
 function bind(){
  const form=$('#practiceForm');if(!form)return;
  form.onchange=e=>{
   const name=e.target.name,value=e.target.value;if(!name||value==='__invalid__')return;
   if(name==='profile'){applyProfile(value);persist();renderPage();return}
   if(name==='duration'){setState({duration:Number(value)});return}
   if(name==='engine'){const item=engines().find(x=>x.id===value);setState({engine:value,variant:item?.variants[0]?.id||null});return}
   setState({[name]:value});
  };
  form.querySelectorAll('[data-practice-focus]').forEach(b=>b.onclick=()=>setState({focus:b.dataset.practiceFocus}));
  $('.practice-more')?.addEventListener('toggle',e=>{moreOpen=e.target.open});
  $('#practiceSave')?.addEventListener('click',()=>LessonUI.saveDraft(false));
  $('#practiceUpdate')?.addEventListener('click',()=>LessonUI.saveDraft(true));
  $('#practiceFavorite')?.addEventListener('click',()=>LessonUI.favoriteGame(state.engine,state.variant));
  $('#practiceMix')?.addEventListener('click',()=>LessonUI.openMix());
  $('#practiceEditMix')?.addEventListener('click',()=>LessonUI.openMix(externalSpec));
  $('#practiceStart')?.addEventListener('click',()=>start());
 }
 function sessionOptions(seed){
  const error=scopeError();if(error)throw new Error(error);
  const compatible=compatibleEngineIds(),capacity=capacitySeconds();
  if(!state.engine||!compatible.includes(state.engine))throw new Error('Kies een beschikbare spelvorm.');
  if(capacity<state.duration)throw new Error('Te weinig oefeningen voor de gekozen tijd.');
  return {seed:seed??seedOverride??Math.floor(Date.now()%4294967295),targetDurationSeconds:state.duration,engines:compatible,filters:externalSpec?{}:filters(),selectionSpec:selectionSpec(),organizationMode:state.organization,selectedGameEngine:state.engine,selectedGameVariant:state.variant,selectionTopic:externalSpec?null:state.topic,startedAt:new Date().toISOString()};
 }
 function launch(session,{resume=false,progress=null}={}){
  if(progress)LessonUI.validateProgress(progress,session);
  ContentRuntime.restoreSession(session);delete root.contentRestoreError;APP.contentSessionConfig=structuredClone(session);
  APP.turn.mode=session.organization_mode;settingsPatch({pawnMode:session.organization_mode});
  if(!resume){APP.contentVert001Used={};APP.cardIndex=0;APP.contentDiceIndex=0;APP.contentDiceLastRoll=0;if(session.selected_game_engine==='BOARD'){const b=session.selected_game_variant||'rotterdam';APP.contentBoardBaseline??={};APP.contentBoardBaseline[b]??=structuredClone(APP.boardStates[b]||{});APP.boardStates[b]={};}}
  if(progress)LessonUI.restoreProgress(progress);
  const engine=session.selected_game_engine,variant=session.selected_game_variant;
  const starts={BOARD:()=>startBoard(variant||'rotterdam'),WHEEL:()=>DigiActivities.start('draaiwiel'),CARDS:startContentCards,DICE:startContentDice,QUIZ:()=>DigiActivities.start('categorieenquiz'),SEQUENCE:()=>DigiActivities.start('rangschikken'),MATCH:()=>DigiActivities.start('koppelen'),MEMORY:()=>DigiActivities.start('memory'),SORT:()=>DigiActivities.start('sorteren'),RIDDLE:()=>DigiActivities.start('raad-het-woord')};
  if(!starts[engine])throw new Error('Deze spelvorm kan nog niet vanuit je les worden gestart.');
  starts[engine]();save();root.LessonUI?.checkpoint();return session;
 }
 function start(seed){try{const session=ContentRuntime.createSession(sessionOptions(seed));launch(session);return session}catch(error){toast(error.message||'Deze sessie kan niet worden gestart.');renderPage();return null}}
 function loadSelection(spec,p,{record=null}={}){externalSpec=ContentRuntime.normalizeSelection(spec);editing=record;state={...state,duration:p.target_duration_seconds,organization:p.organization_mode,engine:p.preferred_game_engine,variant:p.preferred_game_variant};goScreen('practice');renderPage()}
 function open(preset={}){
  if(preset.family)setState({family:preset.family}, {render:false});
  if(preset.topic&&family()?.topics.some(x=>x.id===preset.topic))state.topic=preset.topic;
  if(preset.level&&topic()?.levels.includes(preset.level))state.level=preset.level;
  if(preset.engine){const e=engines().find(x=>x.id===preset.engine);state.engine=e?.id||null;state.variant=preset.variant&&e?.variants.some(v=>v.id===preset.variant)?preset.variant:e?.variants[0]?.id||null}
  persist();goScreen('practice');renderPage();return {...state};
 }
 document.querySelector('[data-main="practice"]')?.addEventListener('click',()=>renderPage());
 document.addEventListener('click',e=>{
  const direct=e.target.closest('[data-practice-open]');if(direct&&!direct.disabled){e.preventDefault();open();return}
  const entry=e.target.closest('[data-practice-engine]');if(entry&&!entry.disabled){e.preventDefault();open({engine:entry.dataset.practiceEngine,variant:entry.dataset.practiceVariant});return}
 },true);
 document.addEventListener('click',e=>{
  const launcher=e.target.closest('[data-board],[data-cardgame],[data-dicegame],[data-wordgame],[data-activity],[data-library-board],[data-library-card],[data-library-word],[data-start-work],#startCabinetActivity');
  if(launcher&&!launcher.closest('#screen-practice')&&(APP.contentSessionConfig||ContentRuntime.activeSession?.()))CONTENT_VERT001.stop();
 },true);
 try{if(APP.contentSessionConfig)CONTENT_VERT001.restore()}catch(error){root.contentRestoreError=error;ContentRuntime.clearSession()}
 root.ContentUI=Object.freeze({open,registerBank,launch,loadSelection,selectionSpec,preferences,editing:()=>editing,clearEditing:()=>{editing=null;externalSpec=null},render:renderPage,start,sessionOptions,filters,availability,scopeError,engines,state:()=>({...state}),setState:(patch,options)=>setState(patch,options),setSeedOverride:value=>{seedOverride=value}});
})(typeof globalThis!=='undefined'?globalThis:this);
