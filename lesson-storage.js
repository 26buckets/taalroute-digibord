(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory;
 else root.LessonStorage=factory;
})(typeof globalThis!=='undefined'?globalThis:this,function(runtime,adapter,identity={owner_scope:'user',owner_ref:'local-device',school_ref:null},progressAdapters={}){
 const clone=v=>v==null?v:structuredClone(v),now=()=>new Date().toISOString(),fail=runtime.fail;
 const id=prefix=>prefix+'-'+runtime.newSessionId();
 const kinds={saved_selection:'saved_selection_id',recent_session:'recent_session_id',favorite:'favorite_ref_id',mix_profile:'mix_profile_id'};
 const scopeFields={owner_scope:identity.owner_scope,owner_ref:identity.owner_ref,created_by_ref:identity.owner_ref,visibility:'private',edit_policy:'owner'};
 function validatePermissions(object,write=false){
  if(!object)fail('BLOCKED_MISSING_REFERENCE','Dit onderdeel bestaat niet meer.');
  const owner=object.owner_scope===identity.owner_scope&&object.owner_ref===identity.owner_ref;
  const readable=owner||object.owner_scope==='system'&&object.visibility==='system'||object.visibility==='school_shared'&&identity.school_ref&&object.owner_ref===identity.school_ref;
  const editable=object.owner_scope!=='system'&&(owner&&object.edit_policy==='owner'||identity.school_ref&&object.owner_scope==='school'&&object.owner_ref===identity.school_ref&&object.edit_policy==='school_edit');
  if(write?!editable:!readable)fail('BLOCKED_PERMISSION','Je hebt geen toegang tot deze actie.');return true;
 }
 function assertNoContent(value){
  if(!value||typeof value!=='object')return;
  for(const [key,v] of Object.entries(value)){if(['selected_item_ids','selected_content_refs','items','content','prompt','model_answer'].includes(key))fail('BLOCKED_SCHEMA_VERSION','Een bewaarde selectie bevat alleen instellingen.');assertNoContent(v)}
 }
 function validatePrivacyPayload(progress){
  if(progress==null)return true;
  if(typeof progress!=='object'||Object.keys(progress).some(k=>!['engine_id','engine_version','progress_schema_version','state_payload','last_checkpoint_at'].includes(k)))fail('BLOCKED_PRIVACY_PAYLOAD','Onbekende gegevens in de spelvoortgang.');
  const forbidden=/^(name|names|cursistnaam|student_id|studentId|participants|email|e_mailadres|phone|telefoonnummer|audio|recording|medical|individual_score|individual_answer|quizResponses|answer_text|free_text)$/i;
  function scan(value){if(!value||typeof value!=='object')return;for(const [key,v] of Object.entries(value)){if(forbidden.test(key))fail('BLOCKED_PRIVACY_PAYLOAD','Persoonlijke antwoorden of gegevens worden niet bij de les bewaard.');scan(v)}}scan(progress);
  const engine=progressAdapters[progress.engine_id];
  if(!engine||progress.progress_schema_version!==engine.schemaVersion||progress.engine_version!==engine.version)fail('BLOCKED_PROGRESS_SCHEMA','Deze voortgangsversie kan niet worden hervat.');
  if(!engine.validate(progress.state_payload))fail('BLOCKED_PRIVACY_PAYLOAD','Deze spelvoortgang bevat onbekende of persoonlijke gegevens.');return true;
 }
 function validateStoredObject(object,kind){
  if(!object||object.schema_version!==1||!Number.isInteger(object.record_revision)||!object[kinds[kind]]||!object.created_at||!object.updated_at)fail('BLOCKED_SCHEMA_VERSION','Deze opgeslagen versie wordt niet ondersteund.');
  if(!['user','school','system'].includes(object.owner_scope)||!['private','school_shared','system'].includes(object.visibility)||!['owner','school_edit','immutable'].includes(object.edit_policy))fail('BLOCKED_PERMISSION','Ongeldig eigenaarschap.');
  if(kind==='saved_selection'){assertNoContent(object.selection_spec);runtime.normalizeSelection(object.selection_spec);if(object.selection_spec_fingerprint!==runtime.fingerprint(object.selection_spec))fail('BLOCKED_SCHEMA_VERSION','De bewaarde selectie is beschadigd.')}
  if(kind==='mix_profile'){assertNoContent(object);runtime.normalizeSelection(object);if(object.selection_spec_fingerprint!==runtime.fingerprint(specOfMix(object)))fail('BLOCKED_SCHEMA_VERSION','De bewaarde mix is beschadigd.')}
  if(kind==='recent_session'){
   if(object.session_config_fingerprint!==runtime.fingerprint(object.session_config_snapshot))fail('BLOCKED_SCHEMA_VERSION','De bewaarde sessie is beschadigd.');
   if(runtime.stable(object.selected_content_refs)!==runtime.stable(object.session_config_snapshot.selected_content_refs)||object.session_id!==object.session_config_snapshot.session_id)fail('BLOCKED_SCHEMA_VERSION','De inhoudsverwijzingen komen niet overeen.');
  }return true;
 }
 async function get(kind,key,write=false){const object=await adapter.get(kind,key);validatePermissions(object,write);validateStoredObject(object,kind);return object}
 async function list(kind,{archived=false}={}){const out=[];for(const o of await adapter.list(kind)){try{validatePermissions(o);validateStoredObject(o,kind);if(!o.deleted_at&&(archived||!o.archived_at))out.push(o)}catch{/* Invalid records remain stored for recovery, never silently rewritten. */}}return out}
 function base(kind,key){const time=now();return {[kinds[kind]]:key,schema_version:1,record_revision:1,...scopeFields,created_at:time,updated_at:time,status:'READY'}}
 async function put(kind,obj,expected){validatePermissions(obj,true);validateStoredObject(obj,kind);await adapter.put(kind,obj[kinds[kind]],clone(obj),expected);return clone(obj)}
 function cleanName(name){if(typeof name!=='string'||!name.trim()||name.length>160)fail('BLOCKED_SCHEMA_VERSION','Geef de les een naam van maximaal 160 tekens.');return name.trim()}
 function preferences(p){if(!p||![180,300,600,900,1200].includes(p.target_duration_seconds)||!['class','groups','pairs','individual'].includes(p.organization_mode))fail('BLOCKED_SCHEMA_VERSION','Kies een geldige lesduur en organisatievorm.');return {target_duration_seconds:p.target_duration_seconds,organization_mode:p.organization_mode,preferred_game_engine:p.preferred_game_engine||null,preferred_game_variant:p.preferred_game_variant||null}}
 async function saveSelection({name,description='',selection_spec,execution_preferences,provenance=null,derived_from_ref=null,derived_from_version=null}){
  assertNoContent(selection_spec);const spec=runtime.normalizeSelection(selection_spec),o={...base('saved_selection',id('lesson')),name:cleanName(name),description:String(description).slice(0,500),selection_spec:spec,execution_preferences:preferences(execution_preferences),provenance:clone(provenance),derived_from_ref,derived_from_version,selection_spec_fingerprint:runtime.fingerprint(spec),last_used_at:null,archived_at:null,deleted_at:null};return put('saved_selection',o,null);
 }
 async function updateSavedSelection(key,patch,expected_revision){const old=await get('saved_selection',key,true);if(old.record_revision!==expected_revision)fail('CONFLICT_REVISION','Deze les is elders gewijzigd. Open de nieuwste versie.');
  const o={...old,name:patch.name===undefined?old.name:cleanName(patch.name),description:patch.description===undefined?old.description:String(patch.description).slice(0,500),selection_spec:patch.selection_spec?runtime.normalizeSelection(patch.selection_spec):old.selection_spec,execution_preferences:patch.execution_preferences?preferences(patch.execution_preferences):old.execution_preferences,record_revision:old.record_revision+1,updated_at:now()};assertNoContent(o.selection_spec);o.selection_spec_fingerprint=runtime.fingerprint(o.selection_spec);return put('saved_selection',o,expected_revision);
 }
 async function archive(kind,key,revision,deleted=false){const o=await get(kind,key,true);o.record_revision++;o.updated_at=now();o.archived_at=now();if(deleted)o.deleted_at=now();o.status='ARCHIVED';return put(kind,o,revision)}
 function resolveOptions(spec,p,seed){return {selectionSpec:runtime.currentSelection(spec),targetDurationSeconds:p.target_duration_seconds,organizationMode:p.organization_mode,selectedGameEngine:p.preferred_game_engine,selectedGameVariant:p.preferred_game_variant,seed:seed??Math.floor(Math.random()*4294967295)}}
 async function resolveSavedSelection(key){try{const o=await get('saved_selection',key);if(o.archived_at||o.deleted_at)fail('BLOCKED_MISSING_REFERENCE','Deze les is gearchiveerd.');const session=runtime.createSession(resolveOptions(o.selection_spec,o.execution_preferences,1));return {status:'READY',object:o,session}}catch(error){return {status:error.code||'BLOCKED_SCHEMA_VERSION',message:error.message}}}
 async function createSessionFromSelection(key,overrides={}){const o=await get('saved_selection',key);if(o.archived_at||o.deleted_at)fail('BLOCKED_MISSING_REFERENCE','Deze les is gearchiveerd.');const recent=(await list('recent_session')).sort((a,b)=>a.last_active_at.localeCompare(b.last_active_at)).flatMap(r=>r.selected_content_refs.map(i=>i.content_item_id));return runtime.createSession({...resolveOptions(o.selection_spec,{...o.execution_preferences,...overrides},overrides.seed),recentItemIds:recent.slice(-840)})}
 function validateHistoricalContentRefs(o,forResume=false){
  if(o.revocation_status==='HARD_REVOKED'||forResume&&o.resume_policy!=='ALLOW_HISTORICAL'||o.resume_policy==='BLOCK')fail('BLOCKED_RIGHTS','Deze sessie mag niet worden hervat.');
  return runtime.validateContentRefs(o.selected_content_refs,{historical:true});
 }
 async function storeRecentSession(session,progress=null,{saved_selection_id=null,mix_profile_id=null,expected_revision=null}={}){
  runtime.validateContentRefs(session.selected_content_refs,{historical:true});validatePrivacyPayload(progress);
  const key='recent-'+session.session_id,old=await adapter.get('recent_session',key);
  if(old){validatePermissions(old,true);validateStoredObject(old,'recent_session');if(expected_revision===null||old.record_revision!==expected_revision)fail('CONFLICT_REVISION','Deze voortgang is elders gewijzigd.');if(old.session_config_fingerprint!==runtime.fingerprint(session))fail('BLOCKED_SCHEMA_VERSION','De gestarte sessie mag niet worden herschreven.');}
  const time=now(),o=old?{...old,record_revision:old.record_revision+1,updated_at:time}:{...base('recent_session',key),session_id:session.session_id,saved_selection_id,mix_profile_id,session_config_snapshot:clone(session),selected_content_refs:clone(session.selected_content_refs),session_config_fingerprint:runtime.fingerprint(session),started_at:session.started_at,completed_at:null,archived_at:null,retention_until:null,session_status:'active',revocation_status:'ACTIVE'};
  o.runtime_progress=clone(progress);o.last_active_at=time;o.resume_policy=progress?'ALLOW_HISTORICAL':'ALLOW_CONTENT_ONLY';return put('recent_session',o,old?expected_revision:null);
 }
 async function resumeRecentSession(key){const o=await get('recent_session',key);validateHistoricalContentRefs(o,true);validatePrivacyPayload(o.runtime_progress);return {session:clone(o.session_config_snapshot),progress:clone(o.runtime_progress),record:clone(o)}}
 async function replayRecentSessionExact(key){const o=await get('recent_session',key);validateHistoricalContentRefs(o);const session=clone(o.session_config_snapshot);session.session_id=runtime.newSessionId();session.started_at=now();return session}
 async function rerollRecentSession(key){const o=await get('recent_session',key),s=o.session_config_snapshot;return runtime.createSession({...resolveOptions(s.normalized_selection_spec||runtime.specFromFilters(s.filters),{target_duration_seconds:s.target_duration_seconds,organization_mode:s.organization_mode,preferred_game_engine:s.selected_game_engine,preferred_game_variant:s.selected_game_variant},(Number(s.selection_seed)+1+Math.floor(Math.random()*4294967293))%4294967295),recentItemIds:s.selected_item_ids})}
 function specOfMix(o){return runtime.normalizeSelection({scope_clauses:o.scope_clauses,filter_spec:o.filter_spec,distribution_spec:o.distribution_spec,compatibility_policy:o.compatibility_policy})}
 async function createMixProfile(input){const spec=runtime.normalizeSelection(input),o={...base('mix_profile',id('mix')),version:1,name:cleanName(input.name),description:String(input.description||'').slice(0,500),...spec,execution_defaults:preferences(input.execution_defaults),review_gate:[...runtime.PROFILE.reviewGate],publication_gate:[...runtime.PROFILE.publicationGate],rights_gate:['owned_original','licensed'],derived_from_ref:null,derived_from_version:null,selection_spec_fingerprint:runtime.fingerprint(spec),archived_at:null};return put('mix_profile',o,null)}
 async function updateMixProfile(key,patch,revision){const old=await get('mix_profile',key,true),spec=specOfMix({...old,...patch}),o={...old,...spec,name:patch.name===undefined?old.name:cleanName(patch.name),version:old.version+1,record_revision:old.record_revision+1,updated_at:now(),execution_defaults:patch.execution_defaults?preferences(patch.execution_defaults):old.execution_defaults,selection_spec_fingerprint:runtime.fingerprint(spec)};return put('mix_profile',o,revision)}
 async function resolveMixProfile(key){const o=await get('mix_profile',key);if(o.archived_at)fail('BLOCKED_MISSING_REFERENCE','Deze mix is gearchiveerd.');const spec=specOfMix(o);return {object:o,selection_spec:spec,execution_preferences:o.execution_defaults,session:runtime.createSession(resolveOptions(spec,o.execution_defaults))}}
 async function resolveFavorite(ref){const o=typeof ref==='string'?await get('favorite',ref):ref;validatePermissions(o);if(o.ref_type==='saved_selection')return get('saved_selection',o.ref_id);if(o.ref_type==='mix_profile')return get('mix_profile',o.ref_id);if(o.ref_type==='game_engine'||o.ref_type==='game_variant'){const parts=o.ref_id.split('/'),e=globalThis.GameEngineRegistry||(typeof require==='function'?require('./game-engine-registry.js'):null),engine=e.get(parts[0]);if(engine&&(o.ref_type==='game_engine'||engine.variants.some(v=>v.id===parts[1])))return {engine:parts[0],variant:parts[1]||null}}
  if(o.ref_type==='content_item'){const item=runtime.itemById(o.ref_id);if(item)return item}fail('BLOCKED_MISSING_REFERENCE','Niet meer beschikbaar.');
 }
 async function addFavorite(ref_type,ref_id){if(!['saved_selection','mix_profile','game_engine','game_variant','content_item','selection_profile'].includes(ref_type))fail('BLOCKED_SCHEMA_VERSION','Ongeldig favoriettype.');const key='favorite-'+encodeURIComponent(identity.owner_ref)+'-'+encodeURIComponent(ref_type+'-'+ref_id),old=await adapter.get('favorite',key);if(old){validatePermissions(old);return old}const o={...base('favorite',key),ref_type,ref_id,label_override:null,sort_order:0};await resolveFavorite(o);try{return await put('favorite',o,null)}catch(error){if(error.code==='CONFLICT_REVISION')return get('favorite',key);throw error}}
 async function removeFavorite(key,revision){await get('favorite',key,true);await adapter.remove('favorite',key,revision)}
 return {list,get,saveSelection,updateSavedSelection,archiveSavedSelection:(k,r)=>archive('saved_selection',k,r),deleteSavedSelection:(k,r)=>archive('saved_selection',k,r,true),resolveSavedSelection,createSessionFromSelection,storeRecentSession,resumeRecentSession,replayRecentSessionExact,rerollRecentSession,archiveRecentSession:(k,r)=>archive('recent_session',k,r),addFavorite,removeFavorite,resolveFavorite,createMixProfile,updateMixProfile,archiveMixProfile:(k,r)=>archive('mix_profile',k,r),resolveMixProfile,validateStoredObject,validatePermissions,validatePrivacyPayload,validateHistoricalContentRefs};
});
