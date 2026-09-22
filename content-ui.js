(function(root){
 'use strict';
 const catalog=root.DIGIBORD_CONTENT_CATALOG;
 if(!catalog||!root.ContentRuntime)return;
 const $=s=>document.querySelector(s);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const defaults={family:'grammar',topic:'ER',profile:'',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'class',engine:null,variant:null};
 let state={...defaults,...(APP.contentUiDraft||{})},seedOverride=null;
 function family(){return catalog.families.find(x=>x.id===state.family)||null}
 function topic(){const f=family();return f?.topics.find(x=>x.id===state.topic)||null}
 function focus(){return catalog.focuses.find(x=>x.id===state.focus)||null}
 function scopeError(){
  const f=family();if(!f)return'De gekozen contentfamilie is niet beschikbaar.';
  const t=topic();if(!t)return'Het gekozen onderwerp is niet beschikbaar binnen deze contentfamilie.';
  if(!t.levels.includes(state.level))return`Niveau ${state.level||'onbekend'} is niet vrijgegeven voor ${t.label}.`;
  if(!catalog.subtopics.some(x=>x.id===state.subtopic))return'Het gekozen subonderwerp is niet beschikbaar.';
  if(!focus())return'De gekozen oefenfocus is niet beschikbaar.';
  if(!catalog.productionModes.some(x=>x.id===state.production))return'De gekozen productievorm is niet beschikbaar.';
  if(!catalog.difficulties.some(x=>x.id===state.difficulty))return'De gekozen moeilijkheid is niet beschikbaar.';
  if(!catalog.durations.some(x=>x.seconds===state.duration))return'De gekozen tijdsduur is niet beschikbaar.';
  if(!catalog.organizations.some(x=>x.id===state.organization))return'De gekozen organisatievorm is niet beschikbaar.';
  if(ContentRuntime.PROFILE.topic!==state.topic||ContentRuntime.PROFILE.level!==state.level)return'Deze inhoud is nog niet als vrijgegeven runtimebron aangesloten.';
  return'';
 }
 function emptyAvailability(){return Object.freeze({source_count:0,source_duration_seconds:0,common_count:0,common_duration_seconds:0,engines:Object.freeze(Object.fromEntries(catalog.engines.map(e=>[e.id,Object.freeze({count:0,duration_seconds:0})])))})}
 function engine(){return catalog.engines.find(x=>x.id===state.engine)||null}
 function filters(){
  return {
   language_functions:state.subtopic==='all'?[]:[state.subtopic],
   exercise_types:focus()?.exerciseTypes||[],
   productive_or_receptive:state.production,
   difficulty:state.difficulty
  };
 }
 function availability(){return scopeError()?emptyAvailability():ContentRuntime.availability(filters())}
 function compatibleEngineIds(){
  const a=availability();
  const individually=catalog.engines.filter(e=>(a.engines[e.id]?.count||0)>0).map(e=>e.id);
  if(!individually.length)return[];
  return individually.filter(e=>ContentRuntime.eligibleItems(individually,filters()).length>0);
 }
 function capacitySeconds(){const engines=compatibleEngineIds();return engines.length?ContentRuntime.eligibleItems(engines,filters()).reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0):0}
 function persist(){APP.contentUiDraft={...state};save()}
 function applyProfile(id){
  const t=topic(),profile=t?.profiles.find(x=>x.id===id);state.profile=id||'';
  if(profile){state.level=profile.level;state.subtopic='all';state.focus='all';state.production='all';state.difficulty='all'}
 }
 function setState(patch,{render=true}={}){
  const previousFamily=state.family,previousTopic=state.topic;state={...state,...patch};
  if(state.family!==previousFamily){const f=family();state.topic=f?.topics[0]?.id||'';const t=topic();state.level=t?.levels[0]||'';state.profile='';state.subtopic='all';state.focus='all';state.production='all';state.difficulty='all'}
  else if(state.topic!==previousTopic){const t=topic();state.level=t?.levels[0]||'';state.profile='';state.subtopic='all';state.focus='all';state.production='all';state.difficulty='all'}
  if(state.profile&&Object.keys(patch).some(k=>['level','subtopic','focus','production','difficulty'].includes(k)))state.profile='';
  const e=engine();if(e&&!e.variants.some(v=>v.id===state.variant))state.variant=e.variants[0]?.id||null;
  persist();if(render)renderPage();
 }
 function choiceGroup(name,label,items,value){
  return `<fieldset class="practice-field"><legend>${esc(label)}</legend><div class="practice-choice-row">${items.map(item=>`<label class="practice-choice ${String(value)===String(item.id??item.seconds)?'selected':''}"><input type="radio" name="${esc(name)}" value="${esc(item.id??item.seconds)}" ${String(value)===String(item.id??item.seconds)?'checked':''}><span>${esc(item.label)}</span></label>`).join('')}</div></fieldset>`;
 }
 function selectField(name,label,items,value){
  const valid=items.some(item=>String(item.id)===String(value)),invalid=!valid&&value!==''&&value!=null?`<option value="__invalid__" selected disabled>Niet beschikbaar</option>`:'';
  return `<label class="practice-select"><span>${esc(label)}</span><select name="${esc(name)}">${invalid}${items.map(item=>`<option value="${esc(item.id)}" ${String(item.id)===String(value)?'selected':''}>${esc(item.label)}</option>`).join('')}</select></label>`;
 }
 function renderEngines(a,compatible,capacity){
  return `<fieldset class="practice-field practice-engines"><legend>Hoe wil je oefenen?</legend><div class="practice-engine-grid">${catalog.engines.map(item=>{
   const own=a.engines[item.id]?.count||0,enabled=compatible.includes(item.id)&&capacity>=state.duration;
   return `<label class="practice-engine ${state.engine===item.id?'selected':''} ${enabled?'':'disabled'}"><input type="radio" name="engine" value="${item.id}" ${state.engine===item.id?'checked':''} ${enabled?'':'disabled'}><strong>${esc(item.label)}</strong><span>${esc(item.description)}</span><small>${own} geschikte opdrachten${enabled?'':' · niet beschikbaar voor deze combinatie'}</small></label>`;
  }).join('')}</div></fieldset>`;
 }
 function renderSummary(a,compatible,capacity){
  const e=engine(),variant=e?.variants.find(v=>v.id===state.variant),minutes=Math.round(capacity/60),selectedCount=e?(a.engines[e.id]?.count||0):a.common_count,scopeBlock=scopeError();
  const blocker=scopeBlock||(!a.source_count?'Geen inhoud gevonden voor deze selectie.':!compatible.length?'De gekozen oefenfocus heeft nog geen spelmotor die hem veilig kan uitvoeren.':capacity<state.duration?`Deze selectie bevat ongeveer ${minutes} minuten unieke content. Kies een kortere duur of maak de selectie ruimer.`:!state.engine?'Kies nog een spelvorm.':'');
  return `<aside class="practice-summary"><span class="eyebrow">Jouw sessie</span><h2>${esc(topic()?.label||'Selectie controleren')} · ${esc(state.level||'')}</h2><dl><div><dt>Subonderwerp</dt><dd>${esc(catalog.subtopics.find(x=>x.id===state.subtopic)?.label)}</dd></div><div><dt>Oefenfocus</dt><dd>${esc(focus().label)}</dd></div><div><dt>Productie</dt><dd>${esc(catalog.productionModes.find(x=>x.id===state.production)?.label)}</dd></div><div><dt>Moeilijkheid</dt><dd>${esc(catalog.difficulties.find(x=>x.id===state.difficulty)?.label)}</dd></div><div><dt>Duur</dt><dd>${esc(catalog.durations.find(x=>x.seconds===state.duration)?.label)}</dd></div><div><dt>Organisatie</dt><dd>${esc(catalog.organizations.find(x=>x.id===state.organization)?.label)}</dd></div><div><dt>Spel</dt><dd>${esc(e?.label||'Nog kiezen')}${variant&&e?.variants.length>1?' · '+esc(variant.label):''}</dd></div></dl><div class="practice-count"><strong>${selectedCount}</strong><span>geschikte oefeningen voor de gekozen spelvorm</span></div>${blocker?`<p class="practice-warning" role="status">${esc(blocker)}</p>`:`<p class="practice-ready" role="status">Deze selectie kan als één canonieke SessionConfig worden gestart.</p>`}<button type="button" class="primary practice-start" id="practiceStart" ${blocker?'disabled':''}>Start sessie</button></aside>`;
 }
 function renderPage(){
  const mount=$('#contentPracticeApp');if(!mount)return;
  const a=availability(),compatible=compatibleEngineIds(),capacity=capacitySeconds();
  if(state.engine&&!compatible.includes(state.engine)){state.engine=null;state.variant=null}
  const e=engine();if(e&&!state.variant)state.variant=e.variants[0]?.id||null;
  const t=topic(),f=family(),profileItems=[{id:'',label:'Zelf samenstellen'},...(t?.profiles||[]).map(p=>({id:p.id,label:p.label}))];
  mount.innerHTML=`<div class="practice-layout"><form class="practice-config" id="practiceForm">
   <section class="practice-panel"><h2>1. Inhoud</h2><div class="practice-select-grid">${selectField('family','Contentfamilie',catalog.families,state.family)}${selectField('topic','Onderwerp',f?.topics||[],state.topic)}${selectField('profile','Selectieprofiel',profileItems,state.profile)}${selectField('level','Niveau',(t?.levels||[]).map(id=>({id,label:id})),state.level)}</div></section>
   <section class="practice-panel"><h2>2. Focus</h2>${choiceGroup('subtopic','Subonderwerp',catalog.subtopics,state.subtopic)}${choiceGroup('focus','Oefenfocus',catalog.focuses,state.focus)}${choiceGroup('production','Productief of receptief',catalog.productionModes,state.production)}${choiceGroup('difficulty','Moeilijkheid',catalog.difficulties,state.difficulty)}</section>
   <section class="practice-panel"><h2>3. Lesinstelling</h2>${choiceGroup('duration','Tijdsduur',catalog.durations,state.duration)}${choiceGroup('organization','Organisatievorm',catalog.organizations,state.organization)}</section>
   <section class="practice-panel"><h2>4. Spelvorm</h2>${renderEngines(a,compatible,capacity)}${e&&e.variants.length>1?`<label class="practice-select practice-variant"><span>Spelvariant</span><select name="variant">${e.variants.map(v=>`<option value="${v.id}" ${v.id===state.variant?'selected':''}>${esc(v.label)}</option>`).join('')}</select></label>`:''}</section>
  </form>${renderSummary(a,compatible,capacity)}</div>`;
  bind();
 }
 function bind(){
  const form=$('#practiceForm');if(!form)return;
  form.onchange=e=>{
   const name=e.target.name,value=e.target.value;if(!name)return;
   if(name==='profile'){applyProfile(value);persist();renderPage();return}
   if(name==='duration'){setState({duration:Number(value)});return}
   if(name==='engine'){const item=catalog.engines.find(x=>x.id===value);setState({engine:value,variant:item?.variants[0]?.id||null});return}
   setState({[name]:value});
  };
  $('#practiceStart')?.addEventListener('click',()=>start());
 }
 function sessionOptions(seed){
  const scopeBlock=scopeError();if(scopeBlock)throw new Error(scopeBlock);
  const compatible=compatibleEngineIds(),capacity=capacitySeconds();
  if(!state.engine||!compatible.includes(state.engine))throw new Error('Kies een beschikbare spelvorm.');
  if(capacity<state.duration)throw new Error('Onvoldoende content voor de gekozen tijdsduur.');
  return {
   seed:seed??seedOverride??Math.floor(Date.now()%4294967295),
   targetDurationSeconds:state.duration,
   engines:compatible,
   filters:filters(),
   organizationMode:state.organization,
   selectedGameEngine:state.engine,
   selectedGameVariant:state.variant,
   startedAt:new Date().toISOString()
  };
 }
 function start(seed){
  try{
   const options=sessionOptions(seed),session=CONTENT_VERT001.start(options);
   APP.turn.mode=state.organization;settingsPatch({pawnMode:state.organization});save();
   if(state.engine==='BOARD')CONTENT_VERT001.board(state.variant||'rotterdam');
   else if(state.engine==='WHEEL')CONTENT_VERT001.wheel();
   else if(state.engine==='CARDS')CONTENT_VERT001.cards();
   return session;
  }catch(error){toast(error.message||'Deze sessie kan niet worden gestart.');renderPage();return null}
 }
 function open(preset={}){
  if(preset.engine){const e=catalog.engines.find(x=>x.id===preset.engine);state.engine=e?.id||null;state.variant=preset.variant&&e?.variants.some(v=>v.id===preset.variant)?preset.variant:e?.variants[0]?.id||null}
  persist();goScreen('practice');renderPage();return {...state};
 }
 document.querySelector('[data-main="practice"]')?.addEventListener('click',()=>renderPage());
 document.addEventListener('click',e=>{
  const direct=e.target.closest('[data-practice-open]');if(direct&&!direct.disabled){e.preventDefault();open();return}
  const entry=e.target.closest('[data-practice-engine]');if(entry&&!entry.disabled){e.preventDefault();open({engine:entry.dataset.practiceEngine,variant:entry.dataset.practiceVariant});return}
 },true);
 document.addEventListener('click',e=>{
  const launcher=e.target.closest('[data-board],[data-cardgame],[data-dicegame],[data-wordgame],[data-activity]');
  if(launcher&&!launcher.closest('#screen-practice')&&ContentRuntime.activeSession?.())CONTENT_VERT001.stop();
 },true);
 try{if(APP.contentSessionConfig)CONTENT_VERT001.restore()}catch{delete APP.contentSessionConfig;delete APP.contentVert001Used;save()}
 root.ContentUI=Object.freeze({open,render:renderPage,start,sessionOptions,filters,availability,state:()=>({...state}),setState:(patch)=>setState(patch),setSeedOverride:value=>{seedOverride=value}});
})(typeof globalThis!=='undefined'?globalThis:this);
