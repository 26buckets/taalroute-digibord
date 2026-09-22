(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports={createContentRuntime:factory};
 else root.ContentRuntime=factory(root.DIGIBORD_CONTENT_VERT001);
})(typeof globalThis!=='undefined'?globalThis:this,function(source){
 'use strict';
 const engineRegistry=globalThis.GameEngineRegistry||(typeof require==='function'?require('./game-engine-registry.js'):null);
 const rendererRegistry=globalThis.InteractionRendererRegistry||(typeof require==='function'?require('./interaction-renderer-registry.js'):null);
 if(!engineRegistry||!rendererRegistry)throw new Error('CONTENT ENG 001 registers ontbreken.');
 const CONTENT_ENGINES=Object.freeze(engineRegistry.contentEngines().map(engine=>engine.id));
 const PROFILE=Object.freeze({id:'SP_GRAM_PB001',version:'2.1',bankId:'CB-GRAM-001',targetDurationSeconds:600,reviewGate:['REVIEW_GO'],publicationGate:['staging_only','pilot_only','published'],engines:CONTENT_ENGINES});
 const ENGINE_VERSIONS=Object.freeze(Object.fromEntries(engineRegistry.contentEngines().map(engine=>[engine.id,engine.version])));
 const TOPICS=Object.freeze(['ER','ZULLEN','ZOUDEN']),LEVELS=Object.freeze(['A2','B1','B2']);
 const ANSWER_TYPES=new Set(['gesloten','geleid_gesloten','open','open_geleid']);
 const DIFFICULTIES=new Set(['basis','midden','hoog']);
 const MODES=new Set(['productief','receptief']);
 let active=null;
 function list(value){return Array.isArray(value)?value.filter(Boolean):value?[value]:[]}
 function assertSource(){
  if(!source||!Array.isArray(source.items))throw new Error('GRAM PB 001 runtimebron ontbreekt.');
  if(source.bank_id!==PROFILE.bankId)throw new Error('Onjuiste contentbank: '+source.bank_id);
  if(source.item_count!==1440||source.items.length!==1440)throw new Error('GRAM PB 001 verwacht exact 1440 records.');
  if(source.source_version!=='1.2')throw new Error('GRAM PB 001 verwacht bronversie 1.2.');
  const ids=new Set();
  for(const item of source.items){
   if(ids.has(item.content_item_id))throw new Error('Dubbel content_item_id: '+item.content_item_id);ids.add(item.content_item_id);
   if(item.content_bank_id!==PROFILE.bankId)throw new Error('Verkeerde bank op '+item.content_item_id);
   if(!TOPICS.includes(item.topic))throw new Error('Onbekend topic op '+item.content_item_id+': '+item.topic);
   if(!LEVELS.includes(item.cefr_level))throw new Error('Onbekend niveau op '+item.content_item_id+': '+item.cefr_level);
   if(!PROFILE.reviewGate.includes(item.review_status))throw new Error('Niet vrijgegeven reviewstatus op '+item.content_item_id);
   if(!PROFILE.publicationGate.includes(item.publication_status))throw new Error('Niet toegestane publicatiestatus op '+item.content_item_id);
   if(!ANSWER_TYPES.has(item.answer_type))throw new Error('Onbekend antwoordtype op '+item.content_item_id);
   if(!DIFFICULTIES.has(item.difficulty))throw new Error('Onbekende moeilijkheid op '+item.content_item_id);
   if(!MODES.has(item.productive_or_receptive))throw new Error('Onbekende productiemodus op '+item.content_item_id);
   if(!item.interaction_type||!/^IT_\d{3}_[A-Z_]+$/.test(item.interaction_type))throw new Error('Ongeldig InteractionType op '+item.content_item_id);
   if(!Array.isArray(item.options)||!Array.isArray(item.accepted_answers)||!Array.isArray(item.technical_tags)||!Array.isArray(item.media_requirements))throw new Error('Arrayveld ongeldig op '+item.content_item_id);
   if(item.selection_safety!==true||item.speaking_safety!==true)throw new Error('Veiligheidsvlag niet groen op '+item.content_item_id);
  }
 }
 assertSource();
 const byId=new Map(source.items.map(item=>[item.content_item_id,item]));
 const FUNCTIONS=Object.freeze([...new Set(source.items.map(item=>item.language_function))].sort());
 function compatibility(item,engine){return rendererRegistry.compatibility(item,engine)}
 function normalizeFilters(filters={}){
  const topics=list(filters.topics),levels=list(filters.levels),familyTags=list(filters.family_tags),languageFunctions=list(filters.language_functions),exerciseTypes=list(filters.exercise_types);
  const knownExercises=new Set(source.items.map(item=>item.exercise_type));
  if(topics.some(x=>!TOPICS.includes(x)))throw new Error('Ongeldig grammaticaonderwerp in contentselectie.');
  if(levels.some(x=>!LEVELS.includes(x)))throw new Error('Ongeldig niveau in contentselectie.');
  if(familyTags.some(x=>x!=='MODAAL'))throw new Error('Ongeldige contentfamilietag in contentselectie.');
  if(languageFunctions.some(x=>!FUNCTIONS.includes(x)))throw new Error('Ongeldige grammaticale functie in contentselectie.');
  if(exerciseTypes.some(x=>!knownExercises.has(x)))throw new Error('Ongeldige oefenvorm in contentselectie.');
  const production=filters.productive_or_receptive??'all',difficulty=filters.difficulty??'all';
  if(!['all','productief','receptief'].includes(production))throw new Error('Ongeldige productievorm in contentselectie.');
  if(!['all','basis','midden','hoog'].includes(difficulty))throw new Error('Ongeldige moeilijkheid in contentselectie.');
  return Object.freeze({
   topics:Object.freeze(topics),levels:Object.freeze(levels),family_tags:Object.freeze(familyTags),
   language_functions:Object.freeze(languageFunctions),exercise_types:Object.freeze(exerciseTypes),
   productive_or_receptive:production,difficulty
  });
 }
 function filterSource(filters={}){
  const f=normalizeFilters(filters);
  return source.items.filter(item=>
   PROFILE.reviewGate.includes(item.review_status)&&
   PROFILE.publicationGate.includes(item.publication_status)&&
   (!f.topics.length||f.topics.includes(item.topic))&&
   (!f.levels.length||f.levels.includes(item.cefr_level))&&
   (!f.family_tags.length||f.family_tags.every(tag=>item.technical_tags.includes(tag)))&&
   (!f.language_functions.length||f.language_functions.includes(item.language_function))&&
   (!f.exercise_types.length||f.exercise_types.includes(item.exercise_type))&&
   (f.productive_or_receptive==='all'||item.productive_or_receptive===f.productive_or_receptive)&&
   (f.difficulty==='all'||item.difficulty===f.difficulty)
  );
 }
 function eligibleItems(engines=PROFILE.engines,filters={}){
  return filterSource(filters).filter(item=>engines.every(engine=>compatibility(item,engine).compatible));
 }
 function availability(filters={},engines=PROFILE.engines){
  const filtered=filterSource(filters),common=eligibleItems(engines,filters);
  const sum=pool=>pool.reduce((n,item)=>n+(item.estimated_duration_seconds||30),0);
  return Object.freeze({
   source_count:filtered.length,source_duration_seconds:sum(filtered),
   common_count:common.length,common_duration_seconds:sum(common),
   engines:Object.freeze(Object.fromEntries(engines.map(engine=>{
    const pool=filtered.filter(item=>compatibility(item,engine).compatible);
    return[engine,Object.freeze({count:pool.length,duration_seconds:sum(pool),adapter_count:pool.filter(item=>compatibility(item,engine).mode==='COMPATIBLE_WITH_ADAPTER').length})];
   })))
  });
 }
 function rng(seed){let state=(Number(seed)||1)>>>0;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296}}
 function shuffle(listIn,random){const out=[...listIn];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function selectItems({seed=20260922,targetDurationSeconds=PROFILE.targetDurationSeconds,engines=PROFILE.engines,filters={}}={}){
  const f=normalizeFilters(filters),eligible=eligibleItems(engines,f);
  if(!eligible.length)throw new Error('Geen compatibele content voor deze selectie.');
  const random=rng(seed);
  const activeFunctions=f.language_functions.length?f.language_functions:[...new Set(eligible.map(item=>item.language_function))].sort();
  if(activeFunctions.some(fn=>!eligible.some(item=>item.language_function===fn)))throw new Error('De selectie bevat onvoldoende content voor alle gekozen subonderwerpen.');
  const buckets=new Map(activeFunctions.map(fn=>[fn,shuffle(eligible.filter(item=>item.language_function===fn),random)]));
  const selected=[],used=new Set();let total=0,round=0;
  while(total<targetDurationSeconds||selected.length<activeFunctions.length){
   let progressed=false;
   for(const fn of activeFunctions){
    const item=(buckets.get(fn)||[])[round];
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
 function sessionTopic(f,selectionTopic){
  if(selectionTopic){
   if(!['ER','ZULLEN','ZOUDEN','MODAAL'].includes(selectionTopic))throw new Error('Ongeldig sessieonderwerp.');
   return selectionTopic;
  }
  if(f.family_tags.includes('MODAAL')&&f.topics.length>1)return'MODAAL';
  return f.topics.length===1?f.topics[0]:'GRAMMATICA';
 }
 function profileId(topic,level){return'SP_GRAM_'+topic+'_'+level}
 function createSession({seed=20260922,targetDurationSeconds=PROFILE.targetDurationSeconds,engines=PROFILE.engines,filters={},organizationMode='class',selectedGameEngine=null,selectedGameVariant=null,startedAt=null,selectionTopic=null}={}){
  if(!['class','groups','pairs','individual'].includes(organizationMode))throw new Error('Ongeldige organisatievorm in contentselectie.');
  if(!Number.isFinite(Number(targetDurationSeconds))||Number(targetDurationSeconds)<=0)throw new Error('Ongeldige tijdsduur in contentselectie.');
  const f=normalizeFilters(filters),selected=selectItems({seed,targetDurationSeconds:Number(targetDurationSeconds),engines,filters:f}),ids=selected.map(item=>item.content_item_id);
  if(selectedGameEngine&&!engines.includes(selectedGameEngine))throw new Error('De gekozen spelvorm is niet compatibel met deze selectie.');
  const topic=sessionTopic(f,selectionTopic),level=f.levels.length===1?f.levels[0]:'MIX';
  return Object.freeze({
   session_id:'CONTENT-PB001-'+topic+'-'+level+'-'+String(seed)+'-'+ids.length,
   selection_profile_id:profileId(topic,level),selection_profile_version:PROFILE.version,
   adapter_version:source.adapter_version||'2.0',content_bank_id:PROFILE.bankId,content_family:'grammar',
   topic,cefr_level:level,filters:f,
   organization_mode:organizationMode,
   selected_game_engine:selectedGameEngine,selected_game_variant:selectedGameVariant,
   game_engines:Object.freeze([...engines]),game_engine_versions:Object.freeze(Object.fromEntries(engines.map(engine=>[engine,ENGINE_VERSIONS[engine]]))),
   selected_item_ids:Object.freeze(ids),selection_seed:seed,target_duration_seconds:targetDurationSeconds,
   actual_estimated_duration_seconds:selected.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),
   review_gate:Object.freeze([...PROFILE.reviewGate]),publication_gate:Object.freeze([...PROFILE.publicationGate]),
   content_source:Object.freeze({drive_id:source.source_drive_id,source_sha256:source.source_sha256,qa_id:source.qa_id,version:source.source_version}),
   started_at:startedAt
  });
 }
 function restoreSession(config){
  if(!config||config.content_bank_id!==PROFILE.bankId)throw new Error('Ongeldige opgeslagen GRAM PB 001 sessie.');
  const engines=[...config.game_engines],ids=[...config.selected_item_ids],filters=normalizeFilters(config.filters||{});
  for(const id of ids){
   const item=byId.get(id);if(!item)throw new Error('Opgeslagen sessie verwijst naar onbekend item: '+id);
   if(!engines.every(engine=>compatibility(item,engine).compatible))throw new Error('Opgeslagen sessie bevat nu incompatibel item: '+id);
  }
  active=Object.freeze({...config,filters,game_engines:Object.freeze(engines),selected_item_ids:Object.freeze(ids),game_engine_versions:Object.freeze({...config.game_engine_versions}),content_source:Object.freeze({...config.content_source})});
  return active;
 }
 function enginePool(engine,session){
  if(!session||session.content_bank_id!==PROFILE.bankId)throw new Error('Ongeldige GRAM PB 001 sessie.');
  if(!session.game_engines.includes(engine))throw new Error('Engine niet opgenomen in SessionConfig: '+engine);
  return session.selected_item_ids.map(id=>{
   const item=byId.get(id);if(!item)throw new Error('Ontbrekend content_item_id: '+id);
   if(!compatibility(item,engine).compatible)throw new Error('Incompatibel item in SessionConfig: '+id+' voor '+engine);
   return item;
  });
 }
 function answerPolicy(item){
  const open=item.openness==='open'||item.openness==='open_geleid';
  return Object.freeze({mode:open?'teacher_or_peer_review':'canonical_answer',requiresExactMatch:false,canonicalAnswer:open?null:item.correct_answer,modelAnswer:item.model_answer,modelIsExample:open});
 }
 function orderTokens(item){
  const marker=':';
  const part=String(item.prompt||'').includes(marker)?String(item.prompt).slice(String(item.prompt).lastIndexOf(marker)+1):'';
  return part.split('/').map(x=>x.trim()).filter(Boolean);
 }
 function project(engine,item){
  const check=compatibility(item,engine);if(!check.compatible)throw new Error('Niet compatibel: '+item.content_item_id+' voor '+engine);
  return Object.freeze({
   engine,contentItemId:item.content_item_id,sourceItem:item,prompt:item.prompt,options:item.options,
   interactionType:item.interaction_type,compatibility:check,adapter:check.adapter,
   orderTokens:check.adapter==='text_order'?Object.freeze(orderTokens(item)):Object.freeze([]),
   answerPolicy:answerPolicy(item)
  });
 }
 function nextItem(engine,session,usedIds=[]){const pool=enginePool(engine,session),used=new Set(usedIds),item=pool.find(x=>!used.has(x.content_item_id))||pool[0];return item||null}
 function activateSession(options){active=createSession(options);return active}
 function activeSession(){return active}
 function clearSession(){active=null}
 return Object.freeze({PROFILE,ENGINE_VERSIONS,TOPICS,LEVELS,FUNCTIONS,compatibility,normalizeFilters,filterSource,eligibleItems,availability,selectItems,createSession,restoreSession,enginePool,answerPolicy,project,nextItem,activateSession,activeSession,clearSession,itemById:id=>byId.get(id)||null,source});
});
