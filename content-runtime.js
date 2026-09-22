(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports={createContentRuntime:factory};
  else root.ContentRuntime=factory(root.DIGIBORD_CONTENT_VERT001);
})(typeof globalThis!=='undefined'?globalThis:this,function(source){
 'use strict';
 const PROFILE={id:'SP_GRAM_ER_B1_VERT001',version:'1.1',bankId:'CB-GRAM-001',topic:'ER',level:'B1',targetDurationSeconds:600,reviewGate:['pilot_ready','approved'],publicationGate:['pilot_only','published'],engines:['BOARD','WHEEL','CARDS']};
 const ENGINE_VERSIONS={BOARD:'VERT001-1.1',WHEEL:'VERT001-1.1',CARDS:'VERT001-1.1'};
 const SUPPORTED={
  BOARD:new Set(['IT_001_OPEN_ANSWER','IT_002_RAPID_ANSWER','IT_004_MULTIPLE_CHOICE','IT_005_FILL_GAP','IT_006_CORRECT_ERROR','IT_007_TRANSFORM_SENTENCE','IT_012_CREATE_EXAMPLE','IT_017_IDENTIFY','IT_018_COMPLETE_SENTENCE']),
  WHEEL:new Set(['IT_001_OPEN_ANSWER','IT_002_RAPID_ANSWER','IT_004_MULTIPLE_CHOICE','IT_005_FILL_GAP','IT_006_CORRECT_ERROR','IT_007_TRANSFORM_SENTENCE','IT_012_CREATE_EXAMPLE','IT_017_IDENTIFY','IT_018_COMPLETE_SENTENCE']),
  CARDS:new Set(['IT_001_OPEN_ANSWER','IT_002_RAPID_ANSWER','IT_004_MULTIPLE_CHOICE','IT_005_FILL_GAP','IT_006_CORRECT_ERROR','IT_007_TRANSFORM_SENTENCE','IT_012_CREATE_EXAMPLE','IT_017_IDENTIFY','IT_018_COMPLETE_SENTENCE'])
 };
 const FUNCTIONS=['voornaamwoordelijk_bijwoord','vaste_combinatie','hoeveelheid','passief_onpersoonlijk','woordvolgorde','functieonderscheid'];
 let active=null;
 function assertSource(){
  if(!source||!Array.isArray(source.items))throw new Error('CONTENT VERT 001 source ontbreekt.');
  if(source.bank_id!==PROFILE.bankId||source.topic!==PROFILE.topic||source.cefr_level!==PROFILE.level)throw new Error('CONTENT VERT 001 bronidentiteit klopt niet.');
  if(source.items.length!==180)throw new Error('CONTENT VERT 001 verwacht exact 180 ER B1 records.');
  const ids=new Set();
  for(const item of source.items){
   if(ids.has(item.content_item_id))throw new Error('Dubbel content_item_id: '+item.content_item_id);ids.add(item.content_item_id);
   if(item.content_bank_id!==PROFILE.bankId||item.topic!==PROFILE.topic||item.cefr_level!==PROFILE.level)throw new Error('Record buiten ER B1 scope: '+item.content_item_id);
   if(!PROFILE.reviewGate.includes(item.review_status)||!PROFILE.publicationGate.includes(item.publication_status))throw new Error('Record niet vrijgegeven voor vertical slice: '+item.content_item_id);
  }
 }
 assertSource();
 const byId=new Map(source.items.map(item=>[item.content_item_id,item]));
 function compatibility(item,engine){
  if(!SUPPORTED[engine])return{compatible:false,reason:'unknown_engine'};
  if(!SUPPORTED[engine].has(item.interaction_type))return{compatible:false,reason:item.interaction_type==='IT_008_ORDER'?'renderer_missing_order':'interaction_not_supported'};
  return{compatible:true,reason:'supported'};
 }
 function normalizeFilters(filters={}){
  const list=value=>Array.isArray(value)?value.filter(Boolean):value?[value]:[];
  return Object.freeze({
   language_functions:Object.freeze(list(filters.language_functions)),
   exercise_types:Object.freeze(list(filters.exercise_types)),
   productive_or_receptive:['productief','receptief'].includes(filters.productive_or_receptive)?filters.productive_or_receptive:'all',
   difficulty:['basis','midden','hoog'].includes(filters.difficulty)?filters.difficulty:'all'
  });
 }
 function filterSource(filters={}){
  const f=normalizeFilters(filters);
  return source.items.filter(item=>
   PROFILE.reviewGate.includes(item.review_status)&&
   PROFILE.publicationGate.includes(item.publication_status)&&
   (!f.language_functions.length||f.language_functions.includes(item.language_function))&&
   (!f.exercise_types.length||f.exercise_types.includes(item.exercise_type))&&
   (f.productive_or_receptive==='all'||item.productive_or_receptive===f.productive_or_receptive)&&
   (f.difficulty==='all'||item.difficulty===f.difficulty)
  );
 }
 function eligibleItems(engines=PROFILE.engines,filters={}){
  return filterSource(filters).filter(item=>engines.every(engine=>compatibility(item,engine).compatible));
 }
 function availability(filters={}){
  const filtered=filterSource(filters);
  const common=eligibleItems(PROFILE.engines,filters);
  return Object.freeze({
   source_count:filtered.length,
   source_duration_seconds:filtered.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),
   common_count:common.length,
   common_duration_seconds:common.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),
   engines:Object.freeze(Object.fromEntries(PROFILE.engines.map(engine=>{
    const pool=filtered.filter(item=>compatibility(item,engine).compatible);
    return [engine,Object.freeze({count:pool.length,duration_seconds:pool.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0)})];
   })))
  });
 }
 function rng(seed){let state=(Number(seed)||1)>>>0;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296}}
 function shuffle(list,random){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function selectItems({seed=20260922,targetDurationSeconds=PROFILE.targetDurationSeconds,engines=PROFILE.engines,filters={}}={}){
  const f=normalizeFilters(filters),eligible=eligibleItems(engines,f);
  if(!eligible.length)throw new Error('Geen compatibele content voor deze selectie.');
  const random=rng(seed),activeFunctions=f.language_functions.length?f.language_functions:FUNCTIONS.filter(fn=>eligible.some(item=>item.language_function===fn));
  if(!activeFunctions.length)throw new Error('Geen grammaticale functies beschikbaar voor deze selectie.');
  const buckets=new Map(activeFunctions.map(fn=>[fn,shuffle(eligible.filter(item=>item.language_function===fn),random)]));
  if(activeFunctions.some(fn=>!(buckets.get(fn)||[]).length))throw new Error('De selectie bevat onvoldoende content voor alle gekozen subonderwerpen.');
  const selected=[],used=new Set();let total=0,round=0;
  while(total<targetDurationSeconds||selected.length<activeFunctions.length){
   let progressed=false;
   for(const fn of activeFunctions){
    const bucket=buckets.get(fn)||[],item=bucket[round];
    if(!item||used.has(item.content_item_id))continue;
    selected.push(item);used.add(item.content_item_id);total+=item.estimated_duration_seconds||30;progressed=true;
    if(total>=targetDurationSeconds&&selected.length>=activeFunctions.length)break;
   }
   if(!progressed)break;round++;
  }
  if(activeFunctions.some(fn=>!selected.some(item=>item.language_function===fn)))throw new Error('Selectie mist minimaal één gekozen grammaticale functie.');
  if(total<targetDurationSeconds)throw new Error('Onvoldoende content voor de gekozen tijdsduur. Maak de selectie ruimer of kies een kortere duur.');
  return selected;
 }
 function createSession({seed=20260922,targetDurationSeconds=PROFILE.targetDurationSeconds,engines=PROFILE.engines,filters={},organizationMode='class',selectedGameEngine=null,startedAt=null}={}){
  const f=normalizeFilters(filters),selected=selectItems({seed,targetDurationSeconds,engines,filters:f}),ids=selected.map(item=>item.content_item_id);
  if(selectedGameEngine&&!engines.includes(selectedGameEngine))throw new Error('De gekozen spelvorm is niet compatibel met deze selectie.');
  return Object.freeze({
   session_id:'CONTENT-VERT001-'+String(seed)+'-'+ids.length,
   selection_profile_id:PROFILE.id,
   selection_profile_version:PROFILE.version,
   adapter_version:source.adapter_version||'1.0',
   content_bank_id:PROFILE.bankId,
   content_family:'grammar',
   topic:PROFILE.topic,
   cefr_level:PROFILE.level,
   filters:f,
   organization_mode:['class','groups','individual'].includes(organizationMode)?organizationMode:'class',
   selected_game_engine:selectedGameEngine,
   game_engines:Object.freeze([...engines]),
   game_engine_versions:Object.freeze(Object.fromEntries(engines.map(engine=>[engine,ENGINE_VERSIONS[engine]]))),
   selected_item_ids:Object.freeze(ids),
   selection_seed:seed,
   target_duration_seconds:targetDurationSeconds,
   actual_estimated_duration_seconds:selected.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),
   review_gate:Object.freeze([...PROFILE.reviewGate]),
   publication_gate:Object.freeze([...PROFILE.publicationGate]),
   content_source:Object.freeze({drive_id:source.source_drive_id,qa_id:source.qa_id,version:source.items[0]?.version||null}),
   started_at:startedAt
  });
 }
 function restoreSession(config){
  if(!config||config.selection_profile_id!==PROFILE.id)throw new Error('Ongeldige opgeslagen CONTENT VERT 001 sessie.');
  const engines=[...config.game_engines],ids=[...config.selected_item_ids],filters=normalizeFilters(config.filters||{});
  for(const id of ids){const item=byId.get(id);if(!item)throw new Error('Opgeslagen sessie verwijst naar onbekend item: '+id);if(!engines.every(engine=>compatibility(item,engine).compatible))throw new Error('Opgeslagen sessie bevat nu incompatibel item: '+id)}
  active=Object.freeze({...config,filters,game_engines:Object.freeze(engines),selected_item_ids:Object.freeze(ids),game_engine_versions:Object.freeze({...config.game_engine_versions}),content_source:Object.freeze({...config.content_source})});return active
 }
 function enginePool(engine,session){
  if(!session||session.selection_profile_id!==PROFILE.id)throw new Error('Ongeldige CONTENT VERT 001 sessie.');
  if(!session.game_engines.includes(engine))throw new Error('Engine niet opgenomen in SessionConfig: '+engine);
  return session.selected_item_ids.map(id=>{const item=byId.get(id);if(!item)throw new Error('Ontbrekend content_item_id: '+id);if(!compatibility(item,engine).compatible)throw new Error('Incompatibel item in SessionConfig: '+id+' voor '+engine);return item});
 }
 function answerPolicy(item){
  const open=item.openness==='open'||item.openness==='open_geleid';
  return Object.freeze({mode:open?'teacher_or_peer_review':'canonical_answer',requiresExactMatch:false,canonicalAnswer:open?null:item.correct_answer,modelAnswer:item.model_answer,modelIsExample:open});
 }
 function project(engine,item){
  const check=compatibility(item,engine);if(!check.compatible)throw new Error('Niet compatibel: '+item.content_item_id+' voor '+engine);
  return Object.freeze({engine,contentItemId:item.content_item_id,sourceItem:item,prompt:item.prompt,options:item.options,interactionType:item.interaction_type,answerPolicy:answerPolicy(item)});
 }
 function nextItem(engine,session,usedIds=[]){
  const pool=enginePool(engine,session),used=new Set(usedIds),item=pool.find(x=>!used.has(x.content_item_id))||pool[0];return item||null;
 }
 function activateSession(options){active=createSession(options);return active}
 function activeSession(){return active}
 function clearSession(){active=null}
 return Object.freeze({PROFILE,ENGINE_VERSIONS,FUNCTIONS,compatibility,normalizeFilters,filterSource,eligibleItems,availability,selectItems,createSession,restoreSession,enginePool,answerPolicy,project,nextItem,activateSession,activeSession,clearSession,itemById:id=>byId.get(id)||null,source});
});
