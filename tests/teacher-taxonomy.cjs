const assert=require('node:assert/strict');
globalThis.E1Release=require('../data/e1-release.js');require('../release-policy.js');
const routes=require('../route-architecture.js'),taxonomy=require('../teacher-taxonomy.js'),{createContentRuntime}=require('../content-runtime.js'),wz=require('../data/wz-reviewed.js');
const runtime=createContentRuntime(E1Release.banks['CB-GRAM-001'],{familyId:'grammar'});
for(const b of Object.values({...wz.banks,...E1Release.banks}))if(b.bank_id!=='CB-GRAM-001'&&['grammar','words','quick'].includes(b.family_id||(/WZ/.test(b.bank_id)?'words':'')))runtime.registerBank(b,{familyId:b.family_id||'words'});
const before=JSON.stringify(runtime.items()),families=new Map(runtime.banks().map(b=>[b.bank.bank_id,b.familyId])),all=runtime.availableForPreparation(),grammar=all.filter(i=>['grammar','words'].includes(families.get(i.content_bank_id))),topics=taxonomy.build(grammar,routes.classification),ids=rows=>rows.map(i=>i.content_item_id).sort();
assert.equal(taxonomy.categories.length,9);assert.deepEqual(ids(topics.flatMap(t=>t.rows)),ids(grammar),'Every available grammar/word item occurs exactly once in the navigation');
assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
let selections=0;
for(const t of topics){
 assert.ok(t.label&&!t.label.includes('_'));assert.ok(taxonomy.categories.some(c=>c.id===t.navigationCategory));
 for(const level of t.levels)for(const gate of ['FREE','GUIDED']){
  const filters={bank_ids:t.bankIds,topics:t.sourceTopics,levels:[level],microconstructures:t.microconstructures,free_play_gate:gate};
  const expected=t.rows.filter(i=>routes.classification(i).displayRoute===level&&routes.classification(i).FreePlayGate===gate),actual=runtime.filterSource(filters);
  assert.deepEqual(ids(actual),ids(expected),t.label+' '+level+' '+gate+' must not widen the selected goal');
  const spec=runtime.specFromFilters(filters);assert.deepEqual(ids(runtime.selectionPool(spec)),ids(expected));selections++;
  if(actual.reduce((n,i)=>n+i.estimated_duration_seconds,0)>=30&&selections%17===0){const session=runtime.createSession({selectionSpec:spec,engines:['CARDS'],selectedGameEngine:'CARDS',targetDurationSeconds:30});assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(session))),session);assert.ok(session.selected_item_ids.every(id=>actual.some(i=>i.content_item_id===id)));}
 }
}
assert.equal(JSON.stringify(runtime.items()),before,'Navigation does not modify canonical content');
assert.throws(()=>runtime.filterSource({free_play_gate:'invented'}),/begeleiding/);
const inversion=topics.find(t=>t.label==='Tijd of plaats vooraan zetten');assert.ok(['WZ_010','WZ_018','WZ_020'].every(id=>inversion.sourceTopics.includes(id)),'Inversion duplicates merge without copying records');
assert.equal(topics.filter(t=>t.label==='Een zin uitbreiden').length,1);
assert.ok(topics.filter(t=>t.sourceTopics.includes('ZULLEN')).flatMap(t=>t.rows).length===450,'All released Zullen items remain findable despite old tag mismatch');
assert.deepEqual([...new Set(topics.flatMap(t=>t.levels))].sort(),[...new Set(grammar.map(i=>routes.classification(i).displayRoute))].sort(),'Do not invent higher routes');
console.log(`PASS teacher taxonomy: ${grammar.length} unique items, nine subjects, ${topics.length} goals, ${selections} exact route/support selections, merged overlaps, canonical preservation and saved-session restore.`);

(async()=>{const service=require('../lesson-storage.js')(runtime,require('../lesson-storage-adapter.js').createMemoryAdapter()),topic=topics.find(t=>t.label==='Tijd of plaats vooraan zetten'),selection_spec=runtime.specFromFilters({bank_ids:topic.bankIds,topics:topic.sourceTopics,microconstructures:topic.microconstructures,levels:['A1_A2'],free_play_gate:'FREE'});for(const seconds of [30,60,...new Set(grammar.map(i=>i.estimated_duration_seconds).filter(n=>n<30))]){const saved=await service.saveSelection({name:'Korte oefening',selection_spec,execution_preferences:{target_duration_seconds:seconds,organization_mode:'class',preferred_game_engine:'CARDS'}});assert.equal(saved.execution_preferences.target_duration_seconds,seconds)}await assert.rejects(()=>service.saveSelection({name:'Ongeldig',selection_spec,execution_preferences:{target_duration_seconds:-1,organization_mode:'class'}}),/lesduur/);console.log('PASS short teacher selections: one task, 30 seconds and one minute remain saveable.')})().catch(error=>{console.error(error);process.exitCode=1});
