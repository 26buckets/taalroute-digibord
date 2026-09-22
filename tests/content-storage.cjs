const assert=require('node:assert/strict');
const source=require('../data/content-vert001-er-b1.js');
const {createContentRuntime}=require('../content-runtime.js');
const {SCHEMA_VERSION,createMemoryStorageAdapter,createLocalStorageAdapter,createContentStorageService,STATUS,OBJECT_TYPES,ContentStorageError}=require('../content-storage.js');

const cloned=JSON.parse(JSON.stringify(source));
const runtime=createContentRuntime(cloned);
let tick=0,id=0;
const clock=()=>`2026-09-22T10:${String(tick++).padStart(2,'0')}:00.000Z`;
const idFactory=prefix=>prefix+'_TEST_'+String(++id).padStart(3,'0');
const progressAdapters={BOARD:{canResume:p=>p.progress_schema_version==='BOARD-PROGRESS-1'}};
const adapter=createMemoryStorageAdapter();
const service=createContentStorageService({adapter,contentRuntime:runtime,clock,idFactory,progressAdapters});
const actor={owner_ref:'teacher-1'};
const owner={owner_scope:'user',owner_ref:'teacher-1',created_by_ref:'teacher-1',visibility:'private',edit_policy:'owner_only'};

const selectionSpec={
 scope_clauses:[{scope_id:'scope-1',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ER'],cefr_levels:['B1'],subtopic_ids:[],interaction_type_ids:[]}],
 filter_spec:{production_mode:'all',difficulty:'all',exercise_types:[]},
 distribution_spec:{mode:'equal'},
 compatibility_policy:'compatible_only'
};
const execution={target_duration_seconds:600,organization_mode:'groups',preferred_game_engine:'BOARD',preferred_game_variant:'rotterdam'};

const saved=service.saveSelection({name:'ER B1 les',selection_spec:selectionSpec,execution_preferences:execution,owner},actor);
assert.equal(saved.record_revision,1);
assert.equal(saved.owner_ref,'teacher-1');
assert.equal(saved.selection_spec_fingerprint.startsWith('fp_'),true);
assert.equal('selected_item_ids' in saved,false);
assert.equal(service.resolveSavedSelection(saved.saved_selection_id,{actor}).status,STATUS.READY);

assert.throws(()=>service.saveSelection({name:'fout',selection_spec:{...selectionSpec,selected_item_ids:['ER_B1_001']},execution_preferences:execution,owner},actor),e=>e.code===STATUS.BLOCKED_SELECTION_SPEC);
const updated=service.updateSavedSelection(saved.saved_selection_id,{description:'Herhaling'},{actor,expectedRevision:1});
assert.equal(updated.record_revision,2);
assert.throws(()=>service.updateSavedSelection(saved.saved_selection_id,{description:'Conflict'},{actor,expectedRevision:1}),e=>e.code===STATUS.CONFLICT_REVISION);

const session=service.createSessionFromSelection(saved.saved_selection_id,{actor,seed:20260922,engines:['BOARD','WHEEL','CARDS'],startedAt:'2026-09-22T10:30:00.000Z'});
assert.equal(session.content_bank_id,'CB-GRAM-001');
assert.equal(session.topic,'ER');
assert.equal(session.cefr_level,'B1');
assert.ok(session.selected_item_ids.length>0);
assert.equal(new Set(session.selected_item_ids).size,session.selected_item_ids.length);

const recent=service.storeRecentSession({
 sessionConfig:session,
 runtimeProgress:{engine_id:'BOARD',engine_version:session.game_engine_versions.BOARD,progress_schema_version:'BOARD-PROGRESS-1',state_payload:{board:'rotterdam',position:7},last_checkpoint_at:'2026-09-22T10:40:00.000Z'},
 savedSelectionId:saved.saved_selection_id,
 owner
});
assert.equal(recent.selected_content_refs.length,session.selected_item_ids.length);
assert.deepEqual(recent.selected_content_refs.map(x=>x.content_item_id),session.selected_item_ids);
assert.ok(recent.selected_content_refs.every(x=>x.content_item_version==='1.2'));
assert.equal(recent.session_config_snapshot.selected_item_ids.length,session.selected_item_ids.length);
assert.equal(recent.session_config_fingerprint.startsWith('fp_'),true);

const resumed=service.resumeRecentSession(recent.recent_session_id,{actor});
assert.equal(resumed.sessionConfig.session_id,session.session_id);
assert.deepEqual(resumed.sessionConfig.selected_item_ids,session.selected_item_ids);
assert.deepEqual(resumed.runtimeProgress.state_payload,{board:'rotterdam',position:7});

const replay=service.replayRecentSessionExact(recent.recent_session_id,{actor,owner,startedAt:'2026-09-22T11:00:00.000Z'});
assert.notEqual(replay.sessionConfig.session_id,session.session_id);
assert.deepEqual(replay.sessionConfig.selected_item_ids,session.selected_item_ids);
assert.equal(replay.recentSession.runtime_progress,null);

const reroll=service.rerollRecentSession(recent.recent_session_id,{actor,owner,seed:20260923,startedAt:'2026-09-22T11:10:00.000Z'});
assert.notEqual(reroll.sessionConfig.session_id,session.session_id);
assert.notDeepEqual(reroll.sessionConfig.selected_item_ids,session.selected_item_ids);
assert.equal(reroll.recentSession.runtime_progress,null);

assert.throws(()=>service.storeRecentSession({
 sessionConfig:session,
 runtimeProgress:{engine_id:'BOARD',engine_version:'x',progress_schema_version:'BOARD-PROGRESS-1',state_payload:{student_id:'123',position:1}},
 owner
}),e=>e.code===STATUS.BLOCKED_PRIVACY_PAYLOAD);

const exactRef=recent.selected_content_refs[0],exactItem=runtime.itemById(exactRef.content_item_id),oldPrompt=exactItem.prompt;
exactItem.prompt=oldPrompt+' gewijzigd';
assert.equal(service.validateHistoricalContentRefs(recent.selected_content_refs).status,STATUS.BLOCKED_VERSION_UNAVAILABLE);
exactItem.prompt=oldPrompt;
assert.equal(service.validateHistoricalContentRefs(recent.selected_content_refs).status,STATUS.READY);

const oldRights=exactItem.rights_status;
exactItem.rights_status='revoked';
assert.equal(service.validateHistoricalContentRefs(recent.selected_content_refs).status,STATUS.BLOCKED_RIGHTS);
assert.throws(()=>service.replayRecentSessionExact(recent.recent_session_id,{actor,owner}),e=>e.code===STATUS.BLOCKED_RIGHTS);
exactItem.rights_status=oldRights;

const contentOnly=service.storeRecentSession({sessionConfig:session,runtimeProgress:null,owner,resumePolicy:'ALLOW_CONTENT_ONLY'});
assert.throws(()=>service.resumeRecentSession(contentOnly.recent_session_id,{actor}),e=>e.code===STATUS.BLOCKED_PROGRESS_SCHEMA);
const contentOnlyReplay=service.replayRecentSessionExact(contentOnly.recent_session_id,{actor,owner});
assert.deepEqual(contentOnlyReplay.sessionConfig.selected_item_ids,session.selected_item_ids);

const hard=service.storeRecentSession({sessionConfig:session,runtimeProgress:null,owner,revocationStatus:'HARD_REVOKED'});
assert.throws(()=>service.resumeRecentSession(hard.recent_session_id,{actor}),e=>e.code===STATUS.BLOCKED_CONTENT_STATUS);
assert.throws(()=>service.replayRecentSessionExact(hard.recent_session_id,{actor,owner}),e=>e.code===STATUS.BLOCKED_CONTENT_STATUS);

const favorite1=service.addFavorite({ref_type:'saved_selection',ref_id:saved.saved_selection_id,owner});
const favorite2=service.addFavorite({ref_type:'saved_selection',ref_id:saved.saved_selection_id,owner});
assert.equal(favorite1.favorite_ref_id,favorite2.favorite_ref_id,'favorite addition is idempotent');
assert.equal(service.resolveFavorite(favorite1.favorite_ref_id,{actor}).status,STATUS.READY);

const mix=service.createMixProfile({
 name:'Grammaticamix B1',
 scope_clauses:[
  {scope_id:'er',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ER'],cefr_levels:['B1'],subtopic_ids:[],interaction_type_ids:[],weight:1},
  {scope_id:'zullen',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ZULLEN'],cefr_levels:['B1'],subtopic_ids:[],interaction_type_ids:[],weight:1}
 ],
 filter_spec:{production_mode:'all',difficulty:'all'},
 distribution_spec:{mode:'equal'},
 compatibility_policy:'compatible_only',
 owner
},actor);
assert.equal(mix.scope_clauses.length,2);
assert.equal('items' in mix,false);
assert.equal(service.resolveMixProfile(mix.mix_profile_id,{actor}).status,STATUS.READY);

const multi=service.saveSelection({
 name:'Mix als les',
 selection_spec:{scope_clauses:mix.scope_clauses,filter_spec:mix.filter_spec,distribution_spec:mix.distribution_spec,compatibility_policy:'compatible_only'},
 execution_preferences:execution,
 owner
},actor);
assert.throws(()=>service.createSessionFromSelection(multi.saved_selection_id,{actor,seed:1,engines:['BOARD']}),e=>e.code===STATUS.BLOCKED_SELECTION_SPEC,'multi scope execution must not silently flatten clauses');

const otherActor={owner_ref:'teacher-2'};
assert.equal(service.resolveSavedSelection(saved.saved_selection_id,{actor:otherActor}).status,STATUS.BLOCKED_PERMISSION);
assert.throws(()=>service.updateSavedSelection(saved.saved_selection_id,{name:'Niet toegestaan'},{actor:otherActor,expectedRevision:2}),e=>e.code===STATUS.BLOCKED_PERMISSION);

// P1 guard: a favorite may never expose another user's private target.
const privateOther=service.saveSelection({name:'Privé van ander',selection_spec:selectionSpec,execution_preferences:execution,owner:{...owner,owner_ref:'teacher-2',created_by_ref:'teacher-2'}},{owner_ref:'teacher-2'});
assert.throws(()=>service.addFavorite({ref_type:'saved_selection',ref_id:privateOther.saved_selection_id,owner,actor}),e=>e.code===STATUS.BLOCKED_PERMISSION);
const forgedFavorite={favorite_ref_id:'FR_FORGED',schema_version:SCHEMA_VERSION,record_revision:1,ref_type:'saved_selection',ref_id:privateOther.saved_selection_id,label_override:'',owner_scope:'user',owner_ref:'teacher-1',created_by_ref:'teacher-1',visibility:'private',edit_policy:'owner_only',sort_order:0,created_at:clock(),updated_at:clock(),status:STATUS.READY};
assert.equal(adapter.put(OBJECT_TYPES.FAVORITE_REF,forgedFavorite.favorite_ref_id,forgedFavorite,{expectedRevision:0}).ok,true);
assert.equal(service.resolveFavorite(forgedFavorite.favorite_ref_id,{actor}).status,STATUS.BLOCKED_PERMISSION);

// P1 guard: filters that the current runtime cannot honor must fail instead of being ignored.
const unsupportedFilter=service.saveSelection({name:'Steunfilter',selection_spec:{...selectionSpec,filter_spec:{...selectionSpec.filter_spec,support_level:'meer_steun'}},execution_preferences:execution,owner},actor);
assert.throws(()=>service.createSessionFromSelection(unsupportedFilter.saved_selection_id,{actor,seed:1,engines:['BOARD']}),e=>e.code===STATUS.BLOCKED_SELECTION_SPEC);

// P1 guard: every declared bank must be connected, not merely one bank in the list.
const mixedBank=service.saveSelection({name:'Gemengde bank',selection_spec:{...selectionSpec,scope_clauses:[{...selectionSpec.scope_clauses[0],content_bank_ids:['CB-GRAM-001','CB-OTHER']}]},execution_preferences:execution,owner},actor);
assert.throws(()=>service.createSessionFromSelection(mixedBank.saved_selection_id,{actor,seed:1,engines:['BOARD']}),e=>e.code===STATUS.BLOCKED_SELECTION_SPEC);

// P1 guard: exact replay fingerprint covers all execution-relevant learner content.
const hashItem=runtime.itemById(exactRef.content_item_id),oldOptions=[...hashItem.options];
hashItem.options=[...oldOptions,'extra optie'];
assert.equal(service.validateHistoricalContentRefs(recent.selected_content_refs).status,STATUS.BLOCKED_VERSION_UNAVAILABLE);
hashItem.options=oldOptions;
assert.equal(service.validateHistoricalContentRefs(recent.selected_content_refs).status,STATUS.READY);

// P1 guard: school-owned objects default to a policy that matching school editors can actually edit.
const schoolActor={owner_ref:'teacher-school',school_ref:'school-1'};
const schoolSelection=service.saveSelection({name:'Schoolles',selection_spec:selectionSpec,execution_preferences:execution,owner:{owner_scope:'school',owner_ref:'school-1',created_by_ref:'teacher-school',visibility:'school_shared'}},schoolActor);
assert.equal(schoolSelection.edit_policy,'school_editors');
const schoolUpdated=service.updateSavedSelection(schoolSelection.saved_selection_id,{description:'gedeeld bijgewerkt'},{actor:schoolActor,expectedRevision:1});
assert.equal(schoolUpdated.record_revision,2);

const fakeStorage=(()=>{
 let value=null;
 return{getItem:()=>value,setItem:(_,v)=>{value=v},removeItem:()=>{value=null}};
})();
const localAdapter=createLocalStorageAdapter(fakeStorage);
const localService=createContentStorageService({adapter:localAdapter,contentRuntime:runtime,clock,idFactory,progressAdapters});
const localSaved=localService.saveSelection({name:'Lokaal',selection_spec:selectionSpec,execution_preferences:execution,owner},actor);
const localAdapterReloaded=createLocalStorageAdapter(fakeStorage);
const reloaded=createContentStorageService({adapter:localAdapterReloaded,contentRuntime:runtime,clock,idFactory,progressAdapters});
assert.equal(reloaded.resolveSavedSelection(localSaved.saved_selection_id,{actor}).object.name,'Lokaal');

const archived=service.archiveSavedSelection(saved.saved_selection_id,{actor,expectedRevision:3});
assert.equal(archived.status,'ARCHIVED');
assert.ok(archived.archived_at);
assert.equal(service.list(OBJECT_TYPES.SAVED_SELECTION,actor).some(x=>x.saved_selection_id===saved.saved_selection_id),true);

assert.ok(ContentStorageError);
console.log('PASS: CONTENT UI 002B storage adapter, domain service, revisions, privacy, historical refs, replay and reroll');
