(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.ContentStorage=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';

 const SCHEMA_VERSION='CONTENT-UI-002B-1.0';
 const OBJECT_TYPES=Object.freeze({
  SAVED_SELECTION:'SavedSelection',
  RECENT_SESSION:'RecentSession',
  FAVORITE_REF:'FavoriteRef',
  MIX_PROFILE:'MixProfile'
 });
 const STATUS=Object.freeze({
  READY:'READY',
  READY_WITH_REVALIDATION:'READY_WITH_REVALIDATION',
  BLOCKED_CONTENT_STATUS:'BLOCKED_CONTENT_STATUS',
  BLOCKED_COMPATIBILITY:'BLOCKED_COMPATIBILITY',
  BLOCKED_CAPACITY:'BLOCKED_CAPACITY',
  BLOCKED_MISSING_REFERENCE:'BLOCKED_MISSING_REFERENCE',
  BLOCKED_SCHEMA_VERSION:'BLOCKED_SCHEMA_VERSION',
  BLOCKED_RIGHTS:'BLOCKED_RIGHTS',
  BLOCKED_VERSION_UNAVAILABLE:'BLOCKED_VERSION_UNAVAILABLE',
  BLOCKED_PERMISSION:'BLOCKED_PERMISSION',
  BLOCKED_PROGRESS_SCHEMA:'BLOCKED_PROGRESS_SCHEMA',
  BLOCKED_PRIVACY_PAYLOAD:'BLOCKED_PRIVACY_PAYLOAD',
  BLOCKED_SELECTION_SPEC:'BLOCKED_SELECTION_SPEC',
  CONFLICT_REVISION:'CONFLICT_REVISION'
 });
 const OWNER_SCOPES=new Set(['user','school','system']);
 const VISIBILITIES=new Set(['private','school_shared','system']);
 const EDIT_POLICIES=new Set(['owner_only','school_editors','read_only','system_only']);
 const FAVORITE_TYPES=new Set(['content_item','saved_selection','selection_profile','mix_profile','game_engine','game_variant']);
 const RESUME_POLICIES=new Set(['ALLOW_HISTORICAL','ALLOW_CONTENT_ONLY','BLOCK']);
 const REVOCATIONS=new Set(['ACTIVE','SOFT_DEPRECATED','HARD_REVOKED']);
 const HARD_RIGHTS=new Set(['revoked','hard_revoked','blocked','not_cleared','expired']);
 const FORBIDDEN_PRIVACY_KEYS=new Set([
  'student_id','studentId','cursist_id','cursistId','cursistnaam','student_name','studentName',
  'email','emailadres','phone','phone_number','telefoonnummer','individual_answer','individueel_antwoord',
  'individual_score','individuele_score','audio_recording','audio_opname','medical_data','medische_gegevens',
  'external_person_id','extern_persoonsnummer'
 ]);
 let fallbackCounter=0;

 class ContentStorageError extends Error{
  constructor(code,message,details={}){super(message);this.name='ContentStorageError';this.code=code;this.details=details}
 }

 function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}
 function isObject(value){return !!value&&typeof value==='object'&&!Array.isArray(value)}
 function stableValue(value){
  if(Array.isArray(value))return value.map(stableValue);
  if(isObject(value))return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stableValue(value[key])]));
  return value;
 }
 function stableStringify(value){return JSON.stringify(stableValue(value))}
 function fingerprint(value){
  const text=stableStringify(value);let hash=2166136261;
  for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619)}
  return 'fp_'+(hash>>>0).toString(16).padStart(8,'0');
 }
 function defaultId(prefix){
  const uuid=globalThis.crypto?.randomUUID?.();
  if(uuid)return prefix+'_'+uuid;
  fallbackCounter++;return prefix+'_'+Date.now().toString(36)+'_'+fallbackCounter.toString(36);
 }
 function nowIso(){return new Date().toISOString()}
 function fail(code,message,details){throw new ContentStorageError(code,message,details)}
 function assert(condition,code,message,details){if(!condition)fail(code,message,details)}
 function arrays(value){return Array.isArray(value)?value:[]}
 function nonEmptyString(value){return typeof value==='string'&&value.trim().length>0}
 function unique(values){return [...new Set(values)]}
 function revisionOf(object){return Number(object?.record_revision||0)}
 function noContentCopies(value,path='root'){
  if(!isObject(value)&&!Array.isArray(value))return;
  if(isObject(value)){
   for(const [key,v] of Object.entries(value)){
    if(key==='selected_item_ids'||key==='selected_content_refs'||key==='prompt'||key==='model_answer'||key==='correct_answer')fail(STATUS.BLOCKED_SELECTION_SPEC,'Opgeslagen selectie mag geen getrokken taalcontent bevatten.',{path:path+'.'+key});
    noContentCopies(v,path+'.'+key);
   }
  }else value.forEach((v,i)=>noContentCopies(v,path+'['+i+']'));
 }
 function validateOwnerFields(object){
  assert(OWNER_SCOPES.has(object.owner_scope),STATUS.BLOCKED_PERMISSION,'Ongeldige owner_scope.');
  assert(nonEmptyString(object.owner_ref),STATUS.BLOCKED_PERMISSION,'owner_ref ontbreekt.');
  assert(nonEmptyString(object.created_by_ref),STATUS.BLOCKED_PERMISSION,'created_by_ref ontbreekt.');
  assert(VISIBILITIES.has(object.visibility),STATUS.BLOCKED_PERMISSION,'Ongeldige visibility.');
  if(object.edit_policy!=null)assert(EDIT_POLICIES.has(object.edit_policy),STATUS.BLOCKED_PERMISSION,'Ongeldige edit_policy.');
 }
 function normalizeOwner(owner={}){
  const scope=owner.owner_scope||'user',ref=owner.owner_ref||'local-user';
  return {
   owner_scope:scope,
   owner_ref:ref,
   created_by_ref:owner.created_by_ref||ref,
   visibility:owner.visibility||(scope==='system'?'system':'private'),
   edit_policy:owner.edit_policy||(scope==='system'?'system_only':scope==='school'?'school_editors':'owner_only')
  };
 }
 function actorCanRead(object,actor={}){
  const ref=actor.owner_ref||actor.user_ref||'local-user';
  if(object.visibility==='system')return true;
  if(object.owner_scope==='user')return object.owner_ref===ref;
  if(object.owner_scope==='school')return object.owner_ref===actor.school_ref||arrays(actor.school_refs).includes(object.owner_ref);
  return !!actor.system_admin;
 }
 function actorCanEdit(object,actor={}){
  const ref=actor.owner_ref||actor.user_ref||'local-user';
  if(object.owner_scope==='system'||object.edit_policy==='system_only'||object.edit_policy==='read_only')return !!actor.system_admin;
  if(object.owner_scope==='user')return object.owner_ref===ref;
  if(object.owner_scope==='school'&&object.edit_policy==='owner_only')return object.created_by_ref===ref;
  if(object.owner_scope==='school'&&object.edit_policy==='school_editors')return object.owner_ref===actor.school_ref||arrays(actor.school_refs).includes(object.owner_ref);
  return false;
 }
 function assertReadable(object,actor){assert(actorCanRead(object,actor),STATUS.BLOCKED_PERMISSION,'Dit object is niet leesbaar voor deze gebruiker.')}
 function assertEditable(object,actor){assert(actorCanEdit(object,actor),STATUS.BLOCKED_PERMISSION,'Dit object mag niet door deze gebruiker worden gewijzigd.')}

 function privacyScan(value,path='root',hits=[]){
  if(Array.isArray(value)){value.forEach((v,i)=>privacyScan(v,path+'['+i+']',hits));return hits}
  if(!isObject(value))return hits;
  for(const [key,v] of Object.entries(value)){
   const lower=key.toLowerCase();
   if(FORBIDDEN_PRIVACY_KEYS.has(key)||/(student|cursist|email|phone|telefoon|medical|medisch|audio[_-]?record|persoon.*id|individual[_-]?(answer|score))/.test(lower))hits.push(path+'.'+key);
   privacyScan(v,path+'.'+key,hits);
  }
  return hits;
 }
 function validatePrivacyPayload(payload){
  const hits=privacyScan(payload);
  return hits.length?{status:STATUS.BLOCKED_PRIVACY_PAYLOAD,reasons:hits}:{status:STATUS.READY,reasons:[]};
 }

 function normalizeScopeClause(clause,index){
  assert(isObject(clause),STATUS.BLOCKED_SELECTION_SPEC,'scope_clause moet een object zijn.');
  assert(nonEmptyString(clause.scope_id||String(index+1)),STATUS.BLOCKED_SELECTION_SPEC,'scope_id ontbreekt.');
  assert(nonEmptyString(clause.content_family_id),STATUS.BLOCKED_SELECTION_SPEC,'content_family_id ontbreekt.');
  const result={
   scope_id:clause.scope_id||'scope_'+(index+1),
   content_family_id:clause.content_family_id,
   content_bank_ids:unique(arrays(clause.content_bank_ids)),
   topic_ids:unique(arrays(clause.topic_ids)),
   cefr_levels:unique(arrays(clause.cefr_levels)),
   subtopic_ids:unique(arrays(clause.subtopic_ids)),
   interaction_type_ids:unique(arrays(clause.interaction_type_ids))
  };
  for(const key of ['weight','minimum_items','maximum_items','minimum_duration_seconds','maximum_duration_seconds'])if(clause[key]!=null)result[key]=Number(clause[key]);
  return result;
 }
 function normalizeSelectionSpec(spec){
  assert(isObject(spec),STATUS.BLOCKED_SELECTION_SPEC,'selection_spec ontbreekt.');
  noContentCopies(spec,'selection_spec');
  const scopes=arrays(spec.scope_clauses).map(normalizeScopeClause);
  assert(scopes.length>0,STATUS.BLOCKED_SELECTION_SPEC,'selection_spec heeft minimaal één scope_clause nodig.');
  return Object.freeze({
   scope_clauses:Object.freeze(scopes.map(Object.freeze)),
   filter_spec:Object.freeze(clone(spec.filter_spec||{})),
   distribution_spec:Object.freeze(clone(spec.distribution_spec||{mode:'equal'})),
   compatibility_policy:spec.compatibility_policy||'compatible_only'
  });
 }
 function normalizeExecutionPreferences(value={}){
  const out={
   target_duration_seconds:Number(value.target_duration_seconds||600),
   organization_mode:value.organization_mode||'class',
   preferred_game_engine:value.preferred_game_engine||null,
   preferred_game_variant:value.preferred_game_variant||null
  };
  assert(Number.isFinite(out.target_duration_seconds)&&out.target_duration_seconds>0,STATUS.BLOCKED_SELECTION_SPEC,'Ongeldige tijdsduur.');
  assert(['class','groups','pairs','individual'].includes(out.organization_mode),STATUS.BLOCKED_SELECTION_SPEC,'Ongeldige organisatievorm.');
  return Object.freeze(out);
 }
 function normalizeProvenance(value={}){
  return Object.freeze({
   source_selection_profile_id:value.source_selection_profile_id||null,
   source_selection_profile_version:value.source_selection_profile_version||null,
   profile_binding_mode:value.profile_binding_mode||'SNAPSHOT_PROFILE',
   derived_from_ref:value.derived_from_ref||null,
   derived_from_version:value.derived_from_version||null
  });
 }
 function selectionSpecToRuntimeOptions(spec,preferences,overrides={}){
  const scopes=spec.scope_clauses;
  assert(scopes.every(s=>s.content_family_id==='grammar'),STATUS.BLOCKED_SELECTION_SPEC,'De huidige CONTENT runtime ondersteunt in deze bouwpoort alleen de aangesloten grammaticafamilie.');
  const topics=unique(scopes.flatMap(s=>s.topic_ids));
  const levels=unique(scopes.flatMap(s=>s.cefr_levels));
  const subtopics=unique(scopes.flatMap(s=>s.subtopic_ids).filter(x=>x&&x!=='all'));
  const interactions=unique(scopes.flatMap(s=>s.interaction_type_ids));
  assert(scopes.every(s=>s.content_bank_ids.every(id=>id==='CB-GRAM-001')),STATUS.BLOCKED_SELECTION_SPEC,'Een scope verwijst naar een niet aangesloten contentbank.');
  assert(!interactions.length,STATUS.BLOCKED_SELECTION_SPEC,'InteractionType filtering uit opgeslagen selecties is nog niet door de huidige runtimefilter ondersteund.');
  const filter=spec.filter_spec||{};
  const unsupported=Object.entries(filter).filter(([key,value])=>!['production_mode','difficulty','exercise_types'].includes(key)&&value!=null&&value!==''&&!(Array.isArray(value)&&!value.length));
  assert(!unsupported.length,STATUS.BLOCKED_SELECTION_SPEC,'selection_spec bevat een filter dat de huidige runtime nog niet ondersteunt.',{keys:unsupported.map(([key])=>key)});
  assert(scopes.length===1,STATUS.BLOCKED_SELECTION_SPEC,'Meerdere scope_clauses worden wel opgeslagen, maar uitvoering wacht op de clause aware uitbreiding van de bestaande selectiemotor.');
  return {
   seed:overrides.seed,
   targetDurationSeconds:Number(overrides.targetDurationSeconds||preferences.target_duration_seconds),
   engines:overrides.engines,
   filters:{
    topics,
    levels,
    language_functions:subtopics,
    exercise_types:arrays(filter.exercise_types),
    productive_or_receptive:filter.production_mode||'all',
    difficulty:filter.difficulty||'all'
   },
   organizationMode:overrides.organizationMode||preferences.organization_mode,
   selectedGameEngine:overrides.selectedGameEngine??preferences.preferred_game_engine,
   selectedGameVariant:overrides.selectedGameVariant??preferences.preferred_game_variant,
   selectionTopic:topics.length===1?topics[0]:null,
   startedAt:overrides.startedAt
  };
 }

 function createMemoryStorageAdapter(){
  const collections=new Map(Object.values(OBJECT_TYPES).map(type=>[type,new Map()]));
  function collection(type){assert(collections.has(type),STATUS.BLOCKED_SCHEMA_VERSION,'Onbekend opslagtype: '+type);return collections.get(type)}
  return Object.freeze({
   get(type,id){return clone(collection(type).get(id)||null)},
   list(type){return [...collection(type).values()].map(clone)},
   put(type,id,object,{expectedRevision}={}){
    const c=collection(type),existing=c.get(id)||null,current=revisionOf(existing);
    if(expectedRevision!=null&&Number(expectedRevision)!==current)return{ok:false,code:STATUS.CONFLICT_REVISION,current_revision:current};
    c.set(id,clone(object));return{ok:true,object:clone(object)}
   },
   remove(type,id,{expectedRevision}={}){
    const c=collection(type),existing=c.get(id)||null,current=revisionOf(existing);
    if(!existing)return{ok:true,removed:false};
    if(expectedRevision!=null&&Number(expectedRevision)!==current)return{ok:false,code:STATUS.CONFLICT_REVISION,current_revision:current};
    c.delete(id);return{ok:true,removed:true}
   },
   clear(){for(const c of collections.values())c.clear()}
  });
 }
 function createLocalStorageAdapter(storage,{key='taalroute.content002b.v1'}={}){
  assert(storage&&typeof storage.getItem==='function'&&typeof storage.setItem==='function',STATUS.BLOCKED_SCHEMA_VERSION,'LocalStorageAdapter vereist een storage object.');
  function empty(){return{schema_version:SCHEMA_VERSION,collections:Object.fromEntries(Object.values(OBJECT_TYPES).map(type=>[type,{}]))}}
  function read(){const raw=storage.getItem(key);if(!raw)return empty();const parsed=JSON.parse(raw);if(parsed.schema_version!==SCHEMA_VERSION)fail(STATUS.BLOCKED_SCHEMA_VERSION,'Opgeslagen CONTENT UI 002B schema wordt niet ondersteund.');return parsed}
  function write(db){storage.setItem(key,JSON.stringify(db))}
  function ensure(db,type){assert(db.collections&&db.collections[type],STATUS.BLOCKED_SCHEMA_VERSION,'Onbekend opslagtype: '+type);return db.collections[type]}
  return Object.freeze({
   get(type,id){const db=read(),c=ensure(db,type);return clone(c[id]||null)},
   list(type){const db=read(),c=ensure(db,type);return Object.values(c).map(clone)},
   put(type,id,object,{expectedRevision}={}){
    const db=read(),c=ensure(db,type),existing=c[id]||null,current=revisionOf(existing);
    if(expectedRevision!=null&&Number(expectedRevision)!==current)return{ok:false,code:STATUS.CONFLICT_REVISION,current_revision:current};
    c[id]=clone(object);write(db);return{ok:true,object:clone(object)}
   },
   remove(type,id,{expectedRevision}={}){
    const db=read(),c=ensure(db,type),existing=c[id]||null,current=revisionOf(existing);
    if(!existing)return{ok:true,removed:false};
    if(expectedRevision!=null&&Number(expectedRevision)!==current)return{ok:false,code:STATUS.CONFLICT_REVISION,current_revision:current};
    delete c[id];write(db);return{ok:true,removed:true}
   },
   clear(){storage.removeItem(key)}
  });
 }

 function createContentStorageService({adapter,contentRuntime,clock=nowIso,idFactory=defaultId,progressAdapters={},referenceResolvers={}}={}){
  assert(adapter&&typeof adapter.get==='function'&&typeof adapter.put==='function',STATUS.BLOCKED_SCHEMA_VERSION,'StorageAdapter ontbreekt.');
  assert(contentRuntime&&typeof contentRuntime.createSession==='function'&&typeof contentRuntime.itemById==='function',STATUS.BLOCKED_SCHEMA_VERSION,'ContentRuntime ontbreekt.');

  function save(type,object,expectedRevision){
   const result=adapter.put(type,object[identityField(type)],object,{expectedRevision});
   if(!result.ok)fail(result.code||STATUS.CONFLICT_REVISION,'Dit object is intussen gewijzigd.',result);
   return clone(result.object);
  }
  function identityField(type){return({
   [OBJECT_TYPES.SAVED_SELECTION]:'saved_selection_id',
   [OBJECT_TYPES.RECENT_SESSION]:'recent_session_id',
   [OBJECT_TYPES.FAVORITE_REF]:'favorite_ref_id',
   [OBJECT_TYPES.MIX_PROFILE]:'mix_profile_id'
  })[type]}
  function read(type,id,actor){
   const object=adapter.get(type,id);if(!object)return null;
   assertReadable(object,actor);return object;
  }
  function currentActor(owner){return{owner_ref:owner.owner_ref,school_ref:owner.owner_scope==='school'?owner.owner_ref:null,system_admin:owner.owner_scope==='system'}}
  function base(type,id,owner,status=STATUS.READY){
   const stamp=clock();return{[identityField(type)]:id,schema_version:SCHEMA_VERSION,record_revision:1,...normalizeOwner(owner),created_at:stamp,updated_at:stamp,status};
  }
  function validateSchema(object){return object?.schema_version===SCHEMA_VERSION?{status:STATUS.READY,reasons:[]}:{status:STATUS.BLOCKED_SCHEMA_VERSION,reasons:['schema_version']}}
  function validateStoredObject(type,object,actor={}){
   if(!object)return{status:STATUS.BLOCKED_MISSING_REFERENCE,reasons:['missing_object']};
   const schema=validateSchema(object);if(schema.status!==STATUS.READY)return schema;
   try{validateOwnerFields(object);assertReadable(object,actor)}catch(error){return{status:error.code||STATUS.BLOCKED_PERMISSION,reasons:[error.message]}};
   if(type===OBJECT_TYPES.SAVED_SELECTION){
    try{normalizeSelectionSpec(object.selection_spec);normalizeExecutionPreferences(object.execution_preferences)}catch(error){return{status:error.code||STATUS.BLOCKED_SELECTION_SPEC,reasons:[error.message]}};
   }
   if(type===OBJECT_TYPES.MIX_PROFILE){
    try{normalizeSelectionSpec({scope_clauses:object.scope_clauses,filter_spec:object.filter_spec,distribution_spec:object.distribution_spec,compatibility_policy:object.compatibility_policy})}catch(error){return{status:error.code||STATUS.BLOCKED_SELECTION_SPEC,reasons:[error.message]}};
   }
   return{status:STATUS.READY,reasons:[]};
  }

  function saveSelection(input,actor={}){
   noContentCopies(input,'SavedSelection');
   const owner=normalizeOwner(input.owner||actor),selectionSpec=normalizeSelectionSpec(input.selection_spec),execution=normalizeExecutionPreferences(input.execution_preferences),provenance=normalizeProvenance(input.provenance);
   const id=input.saved_selection_id||idFactory('SS'),object={
    ...base(OBJECT_TYPES.SAVED_SELECTION,id,owner),
    name:String(input.name||'Nieuwe les').trim()||'Nieuwe les',
    description:String(input.description||''),
    selection_spec:clone(selectionSpec),execution_preferences:clone(execution),provenance:clone(provenance),
    selection_spec_fingerprint:fingerprint(selectionSpec),last_used_at:null,archived_at:null,deleted_at:null
   };
   validateOwnerFields(object);return save(OBJECT_TYPES.SAVED_SELECTION,object,0);
  }
  function updateSavedSelection(id,patch,{actor={},expectedRevision}={}){
   const old=read(OBJECT_TYPES.SAVED_SELECTION,id,actor);assert(old,STATUS.BLOCKED_MISSING_REFERENCE,'Opgeslagen les bestaat niet.');assertEditable(old,actor);
   assert(Number(expectedRevision)===revisionOf(old),STATUS.CONFLICT_REVISION,'Dit object is intussen gewijzigd.',{current_revision:revisionOf(old)});
   noContentCopies(patch,'SavedSelection.patch');
   const selection=patch.selection_spec?normalizeSelectionSpec(patch.selection_spec):old.selection_spec,execution=patch.execution_preferences?normalizeExecutionPreferences(patch.execution_preferences):old.execution_preferences;
   const next={...old,...clone(patch),saved_selection_id:id,selection_spec:clone(selection),execution_preferences:clone(execution),selection_spec_fingerprint:fingerprint(selection),record_revision:revisionOf(old)+1,updated_at:clock()};
   for(const key of ['owner_scope','owner_ref','created_by_ref'])next[key]=old[key];
   return save(OBJECT_TYPES.SAVED_SELECTION,next,expectedRevision);
  }
  function archiveSavedSelection(id,{actor={},expectedRevision}={}){
   return updateSavedSelection(id,{archived_at:clock(),status:'ARCHIVED'},{actor,expectedRevision});
  }
  function deleteSavedSelection(id,{actor={},expectedRevision}={}){
   const old=read(OBJECT_TYPES.SAVED_SELECTION,id,actor);assert(old,STATUS.BLOCKED_MISSING_REFERENCE,'Opgeslagen les bestaat niet.');assertEditable(old,actor);
   const result=adapter.remove(OBJECT_TYPES.SAVED_SELECTION,id,{expectedRevision});if(!result.ok)fail(result.code,'Dit object is intussen gewijzigd.',result);return result.removed;
  }
  function assessSelectionExecution(object,{engines,selectedGameEngine,selectedGameVariant}={}){
   try{
    const effectiveEngines=engines||contentRuntime.PROFILE.engines;
    const options=selectionSpecToRuntimeOptions(object.selection_spec,object.execution_preferences,{engines:effectiveEngines,selectedGameEngine,selectedGameVariant});
    const chosen=options.selectedGameEngine;
    if(chosen&&!effectiveEngines.includes(chosen))return{status:STATUS.BLOCKED_COMPATIBILITY,reasons:['selected_game_engine']};
    if(chosen&&contentRuntime.ENGINE_VERSIONS&&!contentRuntime.ENGINE_VERSIONS[chosen])return{status:STATUS.BLOCKED_COMPATIBILITY,reasons:['unknown_game_engine']};
    if(options.selectedGameVariant){
     if(typeof referenceResolvers.game_variant!=='function')return{status:STATUS.BLOCKED_MISSING_REFERENCE,reasons:['game_variant_resolver_missing']};
     if(!referenceResolvers.game_variant(options.selectedGameVariant,{engine:chosen}))return{status:STATUS.BLOCKED_MISSING_REFERENCE,reasons:['selected_game_variant']};
    }
    const pool=contentRuntime.eligibleItems(effectiveEngines,options.filters);
    if(!pool.length)return{status:STATUS.BLOCKED_COMPATIBILITY,reasons:['empty_compatible_pool']};
    const duration=pool.reduce((sum,item)=>sum+(item.estimated_duration_seconds||30),0);
    if(duration<Number(options.targetDurationSeconds||0))return{status:STATUS.BLOCKED_CAPACITY,reasons:['insufficient_duration'],available_duration_seconds:duration};
    if(chosen&&!contentRuntime.eligibleItems([chosen],options.filters).length)return{status:STATUS.BLOCKED_COMPATIBILITY,reasons:['selected_game_engine']};
    return{status:STATUS.READY,reasons:[],available_count:pool.length,available_duration_seconds:duration};
   }catch(error){return{status:error.code||STATUS.BLOCKED_SELECTION_SPEC,reasons:[error.message],details:error.details||{}}}
  }
  function resolveSavedSelection(id,{actor={},engines,selectedGameEngine,selectedGameVariant}={}){
   const object=adapter.get(OBJECT_TYPES.SAVED_SELECTION,id),validation=validateStoredObject(OBJECT_TYPES.SAVED_SELECTION,object,actor);
   if(validation.status!==STATUS.READY)return{...validation,object:object?clone(object):null};
   const execution=assessSelectionExecution(object,{engines,selectedGameEngine,selectedGameVariant});
   return{...execution,object:clone(object)};
  }
  function createSessionFromSelection(id,{actor={},seed,engines,selectedGameEngine,selectedGameVariant,startedAt}={}){
   const result=resolveSavedSelection(id,{actor,engines,selectedGameEngine,selectedGameVariant});if(result.status!==STATUS.READY)fail(result.status,'Opgeslagen les kan niet worden gestart.',result);
   const object=result.object,options=selectionSpecToRuntimeOptions(object.selection_spec,object.execution_preferences,{seed,engines,selectedGameEngine,selectedGameVariant,startedAt:startedAt||clock()});
   if(options.seed==null)options.seed=Date.now()%4294967295;
   if(!options.engines)options.engines=contentRuntime.PROFILE.engines;
   const session=contentRuntime.createSession(options);
   updateSavedSelection(id,{last_used_at:clock()},{actor,expectedRevision:object.record_revision});
   return session;
  }

  function contentRefFor(id){
   const item=contentRuntime.itemById(id);assert(item,STATUS.BLOCKED_MISSING_REFERENCE,'ContentItem ontbreekt: '+id);
   const source=contentRuntime.source||{};
   const {review_status,publication_status,rights_status,qa_id,source_ref,...executionItem}=item;
   void review_status;void publication_status;void rights_status;void qa_id;void source_ref;
   const ref={
    content_item_id:id,content_item_version:item.version||null,content_bank_id:item.content_bank_id||null,
    source_version:source.source_version||item.version||null,
    immutable_version_ref:[item.content_bank_id||'bank',id,item.version||'version',source.source_sha256||'source'].join(':'),
    content_hash:fingerprint(executionItem)
   };
   return Object.freeze(ref);
  }
  function selectedContentRefs(sessionConfig){return arrays(sessionConfig.selected_item_ids).map(contentRefFor)}
  function validateHistoricalContentRefs(refs){
   for(const ref of arrays(refs)){
    const item=contentRuntime.itemById(ref.content_item_id);
    if(!item)return{status:STATUS.BLOCKED_MISSING_REFERENCE,reasons:[ref.content_item_id]};
    if(String(item.version||'')!==String(ref.content_item_version||''))return{status:STATUS.BLOCKED_VERSION_UNAVAILABLE,reasons:[ref.content_item_id]};
    if(item.revocation_status==='HARD_REVOKED'||HARD_RIGHTS.has(String(item.rights_status||'').toLowerCase()))return{status:STATUS.BLOCKED_RIGHTS,reasons:[ref.content_item_id]};
    const current=contentRefFor(ref.content_item_id);
    if(current.content_hash!==ref.content_hash)return{status:STATUS.BLOCKED_VERSION_UNAVAILABLE,reasons:[ref.content_item_id]};
   }
   return{status:STATUS.READY,reasons:[]};
  }
  function normalizeProgress(progress){
   if(progress==null)return null;
   assert(isObject(progress),STATUS.BLOCKED_PROGRESS_SCHEMA,'runtime_progress moet een object zijn.');
   assert(nonEmptyString(progress.engine_id),STATUS.BLOCKED_PROGRESS_SCHEMA,'runtime_progress engine_id ontbreekt.');
   assert(nonEmptyString(progress.engine_version),STATUS.BLOCKED_PROGRESS_SCHEMA,'runtime_progress engine_version ontbreekt.');
   assert(nonEmptyString(progress.progress_schema_version),STATUS.BLOCKED_PROGRESS_SCHEMA,'runtime_progress schema ontbreekt.');
   const out={engine_id:progress.engine_id,engine_version:progress.engine_version,progress_schema_version:progress.progress_schema_version,state_payload:clone(progress.state_payload||{}),last_checkpoint_at:progress.last_checkpoint_at||clock()};
   const privacy=validatePrivacyPayload(out.state_payload);if(privacy.status!==STATUS.READY)fail(privacy.status,'Spelvoortgang bevat persoonsgegevens die niet in CONTENT UI 002 mogen worden opgeslagen.',privacy);
   return out;
  }
  function validateProgress(progress){
   if(!progress)return{status:STATUS.READY,reasons:[]};
   const adapterForEngine=progressAdapters[progress.engine_id];
   if(!adapterForEngine)return{status:STATUS.BLOCKED_PROGRESS_SCHEMA,reasons:['missing_progress_adapter']};
   if(typeof adapterForEngine.canResume==='function'&&!adapterForEngine.canResume(progress))return{status:STATUS.BLOCKED_PROGRESS_SCHEMA,reasons:['unsupported_progress_schema']};
   return{status:STATUS.READY,reasons:[]};
  }
  function sessionConfigSnapshot(config){
   const snapshot=clone(config);
   if(!snapshot.normalized_selection_spec&&snapshot.filters){
    snapshot.normalized_selection_spec={
     scope_clauses:[{scope_id:'session_scope_1',content_family_id:snapshot.content_family||'grammar',content_bank_ids:[snapshot.content_bank_id].filter(Boolean),topic_ids:snapshot.topic&&snapshot.topic!=='GRAMMATICA'?[snapshot.topic]:arrays(snapshot.filters.topics),cefr_levels:snapshot.cefr_level&&snapshot.cefr_level!=='MIX'?[snapshot.cefr_level]:arrays(snapshot.filters.levels),subtopic_ids:arrays(snapshot.filters.language_functions),interaction_type_ids:[]}],
     filter_spec:{production_mode:snapshot.filters.productive_or_receptive||'all',difficulty:snapshot.filters.difficulty||'all',exercise_types:arrays(snapshot.filters.exercise_types)},
     distribution_spec:{mode:'equal'},compatibility_policy:'compatible_only'
    };
   }
   return snapshot;
  }
  function storeRecentSession({sessionConfig,runtimeProgress=null,savedSelectionId=null,mixProfileId=null,owner={},resumePolicy='ALLOW_HISTORICAL',revocationStatus='ACTIVE'}={}){
   assert(isObject(sessionConfig)&&arrays(sessionConfig.selected_item_ids).length,STATUS.BLOCKED_SELECTION_SPEC,'SessionConfig met selected_item_ids is verplicht.');
   assert(RESUME_POLICIES.has(resumePolicy),STATUS.BLOCKED_SCHEMA_VERSION,'Ongeldige resume_policy.');
   assert(REVOCATIONS.has(revocationStatus),STATUS.BLOCKED_SCHEMA_VERSION,'Ongeldige revocation_status.');
   const own=normalizeOwner(owner),snapshot=sessionConfigSnapshot(sessionConfig),refs=selectedContentRefs(snapshot),progress=normalizeProgress(runtimeProgress),id=idFactory('RS'),stamp=clock();
   const object={
    ...base(OBJECT_TYPES.RECENT_SESSION,id,own),
    session_id:snapshot.session_id,saved_selection_id:savedSelectionId,mix_profile_id:mixProfileId,
    session_config_snapshot:snapshot,selected_content_refs:refs,runtime_progress:progress,
    session_config_fingerprint:fingerprint(snapshot),started_at:snapshot.started_at||stamp,last_active_at:stamp,completed_at:null,
    archived_at:null,retention_until:null,session_status:'ACTIVE',resume_policy:resumePolicy,revocation_status:revocationStatus
   };
   return save(OBJECT_TYPES.RECENT_SESSION,object,0);
  }
  function validateRecentSession(object,actor,{checkProgress=false}={}){
   const stored=validateStoredObject(OBJECT_TYPES.RECENT_SESSION,object,actor);if(stored.status!==STATUS.READY)return stored;
   if(object.revocation_status==='HARD_REVOKED'||object.resume_policy==='BLOCK')return{status:STATUS.BLOCKED_CONTENT_STATUS,reasons:['resume_blocked']};
   const refs=validateHistoricalContentRefs(object.selected_content_refs);if(refs.status!==STATUS.READY)return refs;
   if(checkProgress){
    const progress=validateProgress(object.runtime_progress);if(progress.status!==STATUS.READY)return progress;
   }
   if(object.session_config_fingerprint!==fingerprint(object.session_config_snapshot))return{status:STATUS.BLOCKED_SCHEMA_VERSION,reasons:['session_config_fingerprint_mismatch']};
   return{status:STATUS.READY,reasons:[]};
  }
  function resumeRecentSession(id,{actor={}}={}){
   const object=adapter.get(OBJECT_TYPES.RECENT_SESSION,id);if(object?.resume_policy!=='ALLOW_HISTORICAL')fail(STATUS.BLOCKED_PROGRESS_SCHEMA,'Deze sessie kan niet met oude spelvoortgang worden hervat.');
   const validation=validateRecentSession(object,actor,{checkProgress:!!object?.runtime_progress});
   if(validation.status!==STATUS.READY)fail(validation.status,'Deze sessie kan niet worden hervat.',validation);
   const session=contentRuntime.restoreSession(clone(object.session_config_snapshot));
   return{sessionConfig:session,recentSession:clone(object),runtimeProgress:clone(object.runtime_progress)};
  }
  function newSessionId(base,kind){return String(base||'CONTENT')+'-'+kind+'-'+idFactory('S').replace(/^S_/,'')}
  function replayRecentSessionExact(id,{actor={},owner=null,selectedGameEngine,selectedGameVariant,startedAt}={}){
   const old=adapter.get(OBJECT_TYPES.RECENT_SESSION,id),validation=validateRecentSession(old,actor,{checkProgress:false});
   if(validation.status!==STATUS.READY)fail(validation.status,'Dezelfde opdrachten kunnen niet exact opnieuw worden gestart.',validation);
   const snapshot=clone(old.session_config_snapshot);snapshot.session_id=newSessionId(snapshot.session_id,'REPLAY');snapshot.started_at=startedAt||clock();
   if(selectedGameEngine&&selectedGameEngine!==snapshot.selected_game_engine)fail(STATUS.BLOCKED_COMPATIBILITY,'Exact opnieuw spelen gebruikt dezelfde spelvorm. Gebruik een nieuwe sessie voor een andere spelvorm.');
   if(selectedGameVariant&&selectedGameVariant!==snapshot.selected_game_variant)fail(STATUS.BLOCKED_COMPATIBILITY,'Exact opnieuw spelen gebruikt dezelfde spelvariant.');
   const session=contentRuntime.restoreSession(snapshot),recent=storeRecentSession({sessionConfig:session,runtimeProgress:null,savedSelectionId:old.saved_selection_id,mixProfileId:old.mix_profile_id,owner:owner||normalizeOwner(old),resumePolicy:old.resume_policy,revocationStatus:old.revocation_status});
   return{sessionConfig:session,recentSession:recent};
  }
  function rerollRecentSession(id,{actor={},owner=null,seed,selectedGameEngine,selectedGameVariant,startedAt}={}){
   const old=adapter.get(OBJECT_TYPES.RECENT_SESSION,id);assert(old,STATUS.BLOCKED_MISSING_REFERENCE,'Recente sessie bestaat niet.');assertReadable(old,actor);
   const spec=old.session_config_snapshot.normalized_selection_spec;assert(spec,STATUS.BLOCKED_SELECTION_SPEC,'Historische sessie bevat geen genormaliseerde selectie.');
   const preferences={
    target_duration_seconds:old.session_config_snapshot.target_duration_seconds,
    organization_mode:old.session_config_snapshot.organization_mode,
    preferred_game_engine:selectedGameEngine??old.session_config_snapshot.selected_game_engine,
    preferred_game_variant:selectedGameVariant??old.session_config_snapshot.selected_game_variant
   };
   const options=selectionSpecToRuntimeOptions(normalizeSelectionSpec(spec),normalizeExecutionPreferences(preferences),{seed:seed??Date.now()%4294967295,engines:old.session_config_snapshot.game_engines,selectedGameEngine:preferences.preferred_game_engine,selectedGameVariant:preferences.preferred_game_variant,startedAt:startedAt||clock()});
   const session=contentRuntime.createSession(options),recent=storeRecentSession({sessionConfig:session,runtimeProgress:null,savedSelectionId:old.saved_selection_id,mixProfileId:old.mix_profile_id,owner:owner||normalizeOwner(old)});
   return{sessionConfig:session,recentSession:recent};
  }
  function archiveRecentSession(id,{actor={},expectedRevision}={}){
   const old=read(OBJECT_TYPES.RECENT_SESSION,id,actor);assert(old,STATUS.BLOCKED_MISSING_REFERENCE,'Recente sessie bestaat niet.');assertEditable(old,actor);
   assert(Number(expectedRevision)===revisionOf(old),STATUS.CONFLICT_REVISION,'Dit object is intussen gewijzigd.',{current_revision:revisionOf(old)});
   const next={...old,archived_at:clock(),session_status:'ARCHIVED',record_revision:revisionOf(old)+1,updated_at:clock()};
   return save(OBJECT_TYPES.RECENT_SESSION,next,expectedRevision);
  }

  function favoriteTarget(refType,refId,actor){
   if(refType==='saved_selection'){
    const target=adapter.get(OBJECT_TYPES.SAVED_SELECTION,refId);assert(target,STATUS.BLOCKED_MISSING_REFERENCE,'Favorietdoel bestaat niet.');assertReadable(target,actor);return target;
   }
   if(refType==='mix_profile'){
    const target=adapter.get(OBJECT_TYPES.MIX_PROFILE,refId);assert(target,STATUS.BLOCKED_MISSING_REFERENCE,'Favorietdoel bestaat niet.');assertReadable(target,actor);return target;
   }
   if(refType==='content_item'){
    const target=contentRuntime.itemById(refId);assert(target,STATUS.BLOCKED_MISSING_REFERENCE,'Favorietdoel bestaat niet.');return target;
   }
   if(refType==='game_engine'){
    const target=contentRuntime.ENGINE_VERSIONS?.[refId]?{ref_id:refId,ref_type:refType,version:contentRuntime.ENGINE_VERSIONS[refId]}:null;
    assert(target,STATUS.BLOCKED_MISSING_REFERENCE,'Favorietdoel bestaat niet.');return target;
   }
   const resolver=referenceResolvers[refType];
   assert(typeof resolver==='function',STATUS.BLOCKED_MISSING_REFERENCE,'Voor dit favoriettype is geen referentieresolver aangesloten.',{ref_type:refType});
   const target=resolver(refId,{actor});assert(target,STATUS.BLOCKED_MISSING_REFERENCE,'Favorietdoel bestaat niet.');return target;
  }
  function addFavorite({ref_type,ref_id,label_override='',owner={},actor=null}={}){
   assert(FAVORITE_TYPES.has(ref_type),STATUS.BLOCKED_SCHEMA_VERSION,'Ongeldig favoriettype.');assert(nonEmptyString(ref_id),STATUS.BLOCKED_MISSING_REFERENCE,'Favorietdoel ontbreekt.');
   const own=normalizeOwner(owner),effectiveActor=actor||currentActor(own);favoriteTarget(ref_type,ref_id,effectiveActor);
   const existing=adapter.list(OBJECT_TYPES.FAVORITE_REF).find(x=>x.owner_ref===own.owner_ref&&x.ref_type===ref_type&&x.ref_id===ref_id);
   if(existing)return clone(existing);
   const id=idFactory('FR'),object={...base(OBJECT_TYPES.FAVORITE_REF,id,own),ref_type,ref_id,label_override:String(label_override||''),sort_order:0};
   return save(OBJECT_TYPES.FAVORITE_REF,object,0);
  }
  function removeFavorite(id,{actor={},expectedRevision}={}){
   const old=read(OBJECT_TYPES.FAVORITE_REF,id,actor);assert(old,STATUS.BLOCKED_MISSING_REFERENCE,'Favoriet bestaat niet.');assertEditable(old,actor);
   const result=adapter.remove(OBJECT_TYPES.FAVORITE_REF,id,{expectedRevision});if(!result.ok)fail(result.code,'Favoriet is intussen gewijzigd.',result);return result.removed;
  }
  function resolveFavorite(id,{actor={}}={}){
   const favorite=adapter.get(OBJECT_TYPES.FAVORITE_REF,id);if(!favorite)return{status:STATUS.BLOCKED_MISSING_REFERENCE,reasons:['favorite_missing'],object:null,target:null};
   try{assertReadable(favorite,actor)}catch(error){return{status:error.code,reasons:[error.message],object:clone(favorite),target:null}};
   let target=null;
   try{target=favoriteTarget(favorite.ref_type,favorite.ref_id,actor)}
   catch(error){return{status:error.code||STATUS.BLOCKED_PERMISSION,reasons:[error.message],object:clone(favorite),target:null}}
   return target?{status:STATUS.READY,reasons:[],object:clone(favorite),target:clone(target)}:{status:STATUS.BLOCKED_MISSING_REFERENCE,reasons:[favorite.ref_id],object:clone(favorite),target:null};
  }

  function createMixProfile(input,actor={}){
   noContentCopies(input,'MixProfile');
   const owner=normalizeOwner(input.owner||actor),spec=normalizeSelectionSpec({scope_clauses:input.scope_clauses,filter_spec:input.filter_spec,distribution_spec:input.distribution_spec,compatibility_policy:input.compatibility_policy}),id=input.mix_profile_id||idFactory('MP');
   const object={
    ...base(OBJECT_TYPES.MIX_PROFILE,id,owner),
    version:String(input.version||'1.0'),name:String(input.name||'Nieuwe mix').trim()||'Nieuwe mix',description:String(input.description||''),
    scope_clauses:clone(spec.scope_clauses),filter_spec:clone(spec.filter_spec),distribution_spec:clone(spec.distribution_spec),compatibility_policy:spec.compatibility_policy,
    execution_defaults:clone(input.execution_defaults||{}),review_gate:clone(input.review_gate||[]),publication_gate:clone(input.publication_gate||[]),rights_gate:clone(input.rights_gate||[]),
    derived_from_ref:input.derived_from_ref||null,derived_from_version:input.derived_from_version||null,selection_spec_fingerprint:fingerprint(spec),archived_at:null
   };
   return save(OBJECT_TYPES.MIX_PROFILE,object,0);
  }
  function updateMixProfile(id,patch,{actor={},expectedRevision}={}){
   const old=read(OBJECT_TYPES.MIX_PROFILE,id,actor);assert(old,STATUS.BLOCKED_MISSING_REFERENCE,'Mix bestaat niet.');assertEditable(old,actor);
   assert(Number(expectedRevision)===revisionOf(old),STATUS.CONFLICT_REVISION,'Dit object is intussen gewijzigd.',{current_revision:revisionOf(old)});
   noContentCopies(patch,'MixProfile.patch');
   const spec=normalizeSelectionSpec({scope_clauses:patch.scope_clauses||old.scope_clauses,filter_spec:patch.filter_spec||old.filter_spec,distribution_spec:patch.distribution_spec||old.distribution_spec,compatibility_policy:patch.compatibility_policy||old.compatibility_policy});
   const next={...old,...clone(patch),mix_profile_id:id,scope_clauses:clone(spec.scope_clauses),filter_spec:clone(spec.filter_spec),distribution_spec:clone(spec.distribution_spec),compatibility_policy:spec.compatibility_policy,selection_spec_fingerprint:fingerprint(spec),record_revision:revisionOf(old)+1,updated_at:clock()};
   for(const key of ['owner_scope','owner_ref','created_by_ref'])next[key]=old[key];
   return save(OBJECT_TYPES.MIX_PROFILE,next,expectedRevision);
  }
  function archiveMixProfile(id,{actor={},expectedRevision}={}){
   return updateMixProfile(id,{archived_at:clock(),status:'ARCHIVED'},{actor,expectedRevision});
  }
  function resolveMixProfile(id,{actor={}}={}){
   const object=adapter.get(OBJECT_TYPES.MIX_PROFILE,id),validation=validateStoredObject(OBJECT_TYPES.MIX_PROFILE,object,actor);return{...validation,object:object?clone(object):null};
  }

  return Object.freeze({
   SCHEMA_VERSION,OBJECT_TYPES,STATUS,
   saveSelection,updateSavedSelection,archiveSavedSelection,deleteSavedSelection,resolveSavedSelection,createSessionFromSelection,
   storeRecentSession,resumeRecentSession,replayRecentSessionExact,rerollRecentSession,archiveRecentSession,
   addFavorite,removeFavorite,resolveFavorite,
   createMixProfile,updateMixProfile,archiveMixProfile,resolveMixProfile,
   validateStoredObject,assessSelectionExecution,validatePermissions:(object,actor)=>({read:actorCanRead(object,actor),edit:actorCanEdit(object,actor)}),
   validatePrivacyPayload,validateHistoricalContentRefs,
   fingerprint,selectionSpecToRuntimeOptions,
   list:(type,actor={})=>adapter.list(type).filter(object=>actorCanRead(object,actor)).map(clone)
  });
 }

 return Object.freeze({SCHEMA_VERSION,OBJECT_TYPES,STATUS,ContentStorageError,createMemoryStorageAdapter,createLocalStorageAdapter,createContentStorageService,fingerprint,validatePrivacyPayload,normalizeSelectionSpec,normalizeExecutionPreferences});
});
