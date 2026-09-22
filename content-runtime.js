(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports={createContentRuntime:factory};
 else root.ContentRuntime=factory(root.DIGIBORD_CONTENT_PB001||root.DIGIBORD_CONTENT_VERT001);
})(typeof globalThis!=='undefined'?globalThis:this,function(source){
 'use strict';
 const BANK_ID='CB-GRAM-001',PROFILE_VERSION='2.0',REVIEW_GATE=['approved'],PUBLICATION_GATE=['staging_only','published'];
 const ENGINE_VERSIONS={BOARD:'PB001-2.0',WHEEL:'PB001-2.0',CARDS:'PB001-2.0'};
 const SUPPORTED_LIST=['IT_001_OPEN_ANSWER','IT_002_RAPID_ANSWER','IT_004_MULTIPLE_CHOICE','IT_005_FILL_GAP','IT_006_CORRECT_ERROR','IT_007_TRANSFORM_SENTENCE','IT_008_ORDER','IT_012_CREATE_EXAMPLE','IT_017_IDENTIFY','IT_018_COMPLETE_SENTENCE'];
 const SUPPORTED={BOARD:new Set(SUPPORTED_LIST),WHEEL:new Set(SUPPORTED_LIST),CARDS:new Set(SUPPORTED_LIST)};
 const TOPICS=['ER','ZULLEN','ZOUDEN','MODAAL'],LEVELS=['A2','B1','B2'],ENGINES=['BOARD','WHEEL','CARDS'];
 let active=null;
 function assertSource(){
  if(!source||!Array.isArray(source.items))throw new Error('GRAM PB 001 source ontbreekt.');
  if(source.bank_id!==BANK_ID||source.source_version!=='1.2')throw new Error('GRAM PB 001 bronidentiteit of versie klopt niet.');
  if(source.items.length!==1440)throw new Error('GRAM PB 001 verwacht exact 1440 records.');
  const ids=new Set(),topicCounts={ER:0,ZULLEN:0,ZOUDEN:0},levelCounts={A2:0,B1:0,B2:0};
  for(const item of source.items){
   if(ids.has(item.content_item_id))throw new Error('Dubbel content_item_id: '+item.content_item_id);ids.add(item.content_item_id);
   if(item.content_bank_id!==BANK_ID||!Object.hasOwn(topicCounts,item.topic)||!Object.hasOwn(levelCounts,item.cefr_level))throw new Error('Record buiten PB001 scope: '+item.content_item_id);
   if(!REVIEW_GATE.includes(item.review_status)||!PUBLICATION_GATE.includes(item.publication_status))throw new Error('Record niet vrijgegeven voor staging runtime: '+item.content_item_id);
   if(item.source_review_status!=='REVIEW_GO'||item.version!=='1.2')throw new Error('Record zonder actuele reviewpoort: '+item.content_item_id);
   if(!SUPPORTED_LIST.includes(item.interaction_type))throw new Error('Onbekend interactietype: '+item.content_item_id+' '+item.interaction_type);
   if(item.interaction_type==='IT_008_ORDER'&&(!Array.isArray(item.order_tokens)||item.order_tokens.length<2))throw new Error('ORDER payload ontbreekt: '+item.content_item_id);
   topicCounts[item.topic]++;levelCounts[item.cefr_level]++;
  }
  if(topicCounts.ER!==540||topicCounts.ZULLEN!==450||topicCounts.ZOUDEN!==450)throw new Error('PB001 topicverdeling klopt niet.');
  if(levelCounts.A2!==480||levelCounts.B1!==480||levelCounts.B2!==480)throw new Error('PB001 niveauverdeling klopt niet.');
  if(source.items.filter(item=>item.technical_tags.includes('MODAAL')).length!==900)throw new Error('MODAAL koppeling verwacht 900 records.');
 }
 assertSource();
 const byId=new Map(source.items.map(item=>[item.content_item_id,item]));
 function list(value){return Array.isArray(value)?value.filter(Boolean):value?[value]:[]}
 function normalizeFilters(filters={}){
  const topic=TOPICS.includes(filters.topic)?filters.topic:'ER',level=LEVELS.includes(filters.level)?filters.level:'B1';
  return Object.freeze({topic,level,language_functions:Object.freeze(list(filters.language_functions)),exercise_types:Object.freeze(list(filters.exercise_types)),productive_or_receptive:['productief','receptief'].includes(filters.productive_or_receptive)?filters.productive_or_receptive:'all',difficulty:['basis','midden','hoog'].includes(filters.difficulty)?filters.difficulty:'all'});
 }
 function topicMatch(item,topic){return topic==='MODAAL'?item.technical_tags.includes('MODAAL'):item.topic===topic}
 function filterSource(filters={}){
  const f=normalizeFilters(filters);
  return source.items.filter(item=>REVIEW_GATE.includes(item.review_status)&&PUBLICATION_GATE.includes(item.publication_status)&&topicMatch(item,f.topic)&&item.cefr_level===f.level&&(!f.language_functions.length||f.language_functions.includes(item.language_function))&&(!f.exercise_types.length||f.exercise_types.includes(item.exercise_type))&&(f.productive_or_receptive==='all'||item.productive_or_receptive===f.productive_or_receptive)&&(f.difficulty==='all'||item.difficulty===f.difficulty));
 }
 function functionsFor(filters={}){
  const f=normalizeFilters({...filters,language_functions:[],exercise_types:[],productive_or_receptive:'all',difficulty:'all'});
  return [...new Set(filterSource(f).map(item=>item.language_function))];
 }
 function compatibility(item,engine){
  if(!SUPPORTED[engine])return{compatible:false,reason:'unknown_engine'};
  if(!SUPPORTED[engine].has(item.interaction_type))return{compatible:false,reason:'interaction_not_supported'};
  return{compatible:true,reason:'supported'};
 }
 function eligibleItems(engines=ENGINES,filters={}){return filterSource(filters).filter(item=>engines.every(engine=>compatibility(item,engine).compatible))}
 function availability(filters={}){
  const f=normalizeFilters(filters),filtered=filterSource(f),common=eligibleItems(ENGINES,f);
  return Object.freeze({source_count:filtered.length,source_duration_seconds:filtered.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),common_count:common.length,common_duration_seconds:common.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),engines:Object.freeze(Object.fromEntries(ENGINES.map(engine=>{const pool=filtered.filter(item=>compatibility(item,engine).compatible);return[engine,Object.freeze({count:pool.length,duration_seconds:pool.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0)})]})))});
 }
 function rng(seed){let state=(Number(seed)||1)>>>0;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296}}
 function shuffle(list,random){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function selectItems({seed=20260922,targetDurationSeconds=600,engines=ENGINES,filters={}}={}){
  const f=normalizeFilters(filters),eligible=eligibleItems(engines,f);
  if(!eligible.length)throw new Error('Geen compatibele content voor deze selectie.');
  const activeFunctions=f.language_functions.length?f.language_functions:functionsFor(f).filter(fn=>eligible.some(item=>item.language_function===fn));
  if(!activeFunctions.length)throw new Error('Geen grammaticale functies beschikbaar voor deze selectie.');
  const random=rng(seed),buckets=new Map(activeFunctions.map(fn=>[fn,shuffle(eligible.filter(item=>item.language_function===fn),random)]));
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
 function profileId(topic,level){return'SP_GRAM_'+topic+'_'+level+'_PB001'}
 function createSession({seed=20260922,targetDurationSeconds=600,engines=ENGINES,filters={},organizationMode='class',selectedGameEngine=null,selectedGameVariant=null,startedAt=null}={}){
  const f=normalizeFilters(filters),selected=selectItems({seed,targetDurationSeconds,engines,filters:f}),ids=selected.map(item=>item.content_item_id);
  if(selectedGameEngine&&!engines.includes(selectedGameEngine))throw new Error('De gekozen spelvorm is niet compatibel met deze selectie.');
  return Object.freeze({session_id:'GRAM-PB001-'+f.topic+'-'+f.level+'-'+String(seed)+'-'+ids.length,selection_profile_id:profileId(f.topic,f.level),selection_profile_version:PROFILE_VERSION,adapter_version:source.adapter_version||'2.0',content_bank_id:BANK_ID,content_family:'grammar',topic:f.topic,cefr_level:f.level,filters:f,organization_mode:['class','groups','individual'].includes(organizationMode)?organizationMode:'class',selected_game_engine:selectedGameEngine,selected_game_variant:selectedGameVariant,game_engines:Object.freeze([...engines]),game_engine_versions:Object.freeze(Object.fromEntries(engines.map(engine=>[engine,ENGINE_VERSIONS[engine]]))),selected_item_ids:Object.freeze(ids),selection_seed:seed,target_duration_seconds:targetDurationSeconds,actual_estimated_duration_seconds:selected.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0),review_gate:Object.freeze([...REVIEW_GATE]),publication_gate:Object.freeze([...PUBLICATION_GATE]),content_source:Object.freeze({drive_id:source.source_drive_id,qa_id:source.qa_id,version:source.source_version,source_sha256:source.source_sha256||null}),started_at:startedAt});
 }
 function restoreSession(config){
  if(!config||config.content_bank_id!==BANK_ID||!TOPICS.includes(config.topic)||!LEVELS.includes(config.cefr_level))throw new Error('Ongeldige opgeslagen PB001 sessie.');
  const engines=[...config.game_engines],ids=[...config.selected_item_ids],filters=normalizeFilters(config.filters||{topic:config.topic,level:config.cefr_level});
  for(const id of ids){const item=byId.get(id);if(!item)throw new Error('Opgeslagen sessie verwijst naar onbekend item: '+id);if(!topicMatch(item,filters.topic)||item.cefr_level!==filters.level)throw new Error('Opgeslagen sessie lekt buiten topic of niveau: '+id);if(!engines.every(engine=>compatibility(item,engine).compatible))throw new Error('Opgeslagen sessie bevat nu incompatibel item: '+id)}
  active=Object.freeze({...config,filters,game_engines:Object.freeze(engines),selected_item_ids:Object.freeze(ids),game_engine_versions:Object.freeze({...config.game_engine_versions}),content_source:Object.freeze({...config.content_source})});return active
 }
 function enginePool(engine,session){
  if(!session||session.content_bank_id!==BANK_ID)throw new Error('Ongeldige PB001 sessie.');
  if(!session.game_engines.includes(engine))throw new Error('Engine niet opgenomen in SessionConfig: '+engine);
  return session.selected_item_ids.map(id=>{const item=byId.get(id);if(!item)throw new Error('Ontbrekend content_item_id: '+id);if(!compatibility(item,engine).compatible)throw new Error('Incompatibel item in SessionConfig: '+id+' voor '+engine);return item});
 }
 function answerPolicy(item){const open=item.openness==='open'||item.openness==='open_geleid';return Object.freeze({mode:open?'teacher_or_peer_review':'canonical_answer',requiresExactMatch:false,canonicalAnswer:open?null:item.correct_answer,modelAnswer:item.model_answer,modelIsExample:open})}
 function project(engine,item){const check=compatibility(item,engine);if(!check.compatible)throw new Error('Niet compatibel: '+item.content_item_id+' voor '+engine);return Object.freeze({engine,contentItemId:item.content_item_id,sourceItem:item,prompt:item.prompt,options:item.options,interactionType:item.interaction_type,orderTokens:Object.freeze([...(item.order_tokens||[])]),answerPolicy:answerPolicy(item)})}
 function nextItem(engine,session,usedIds=[]){const pool=enginePool(engine,session),used=new Set(usedIds),item=pool.find(x=>!used.has(x.content_item_id))||pool[0];return item||null}
 function activateSession(options){active=createSession(options);return active}
 function activeSession(){return active}
 function clearSession(){active=null}
 return Object.freeze({BANK_ID,PROFILE_VERSION,ENGINE_VERSIONS,TOPICS,LEVELS,ENGINES,REVIEW_GATE,PUBLICATION_GATE,compatibility,normalizeFilters,filterSource,functionsFor,eligibleItems,availability,selectItems,createSession,restoreSession,enginePool,answerPolicy,project,nextItem,activateSession,activeSession,clearSession,itemById:id=>byId.get(id)||null,source});
});
