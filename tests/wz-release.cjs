const assert=require('node:assert/strict'),data=require('../data/wz-reviewed.js'),source=require('./fixtures/wz-release-source.json'),routes=require('../route-architecture.js'),{createContentRuntime}=require('../content-runtime.js'),adapt=require('../content-bank-adapters.js');
require('../release-policy.js');
const banks=Object.values(data.banks),runtime=createContentRuntime(banks[0],{familyId:'words',previousVersions:[adapt(require('../Lessen/woorden-zinnen.json'))]});
for(const bank of banks.slice(1))runtime.registerBank(bank,{familyId:'words',excludedEngines:['DICE','MATCH','MEMORY','SORT']});
globalThis.ContentRuntime=runtime;
assert.equal(runtime.items().length,3560);assert.equal(runtime.filterSource().length,2519);assert.equal(runtime.availableForPreparation().length,2698);
const counts={A0_A1:[535,0],A1_A2:[1276,93],A2_B1:[708,86]},all=runtime.availableForPreparation(),sourceRows=new Map(source.masters.flatMap(b=>b.rows.map(x=>[x.ID,x])));
for(const [route,[free,guided]] of Object.entries(counts)){
 assert.equal(runtime.filterSource({levels:[route]}).length,free);
 const rows=all.filter(i=>routes.classification(i).displayRoute===route),micros=[...new Set(rows.map(i=>i.Microconstructie))];
 assert.equal(runtime.filterSource({levels:[route],microconstructures:micros}).length,free+guided);
 for(const micro of micros){const pool=runtime.filterSource({levels:[route],microconstructures:[micro]});assert.ok(pool.length);assert.ok(pool.every(i=>i.Microconstructie===micro&&i['Nieuwe route']===routes.label(route).replace(/ /g,'')));}
}
for(const i of all){
 const row=Object.fromEntries(Object.entries(sourceRows.get(i.content_item_id)).map(([k,v])=>[k,typeof v==='string'?require('../wording.js').text(v):v]));assert.equal(i.stimulus,row.Stimulus);assert.equal(i.prompt,row.Instructie+(row.Stimulus?': '+row.Stimulus:''));
 assert.ok(runtime.compatibility(i,'CARDS').compatible);assert.ok(runtime.compatibility(i,'BOARD').compatible);assert.ok(runtime.compatibility(i,'WHEEL').compatible);
 if(i.answer_type==='open'){assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(i.correct_answer,null);assert.equal(i.interaction_type,'IT_001_OPEN_ANSWER')}
 if(i.order_tokens?.length){const norm=s=>s.toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();assert.equal(norm(i.expected_tokens.join(' ')),norm(i.correct_answer),i.content_item_id)}
}
assert.equal(runtime.items().filter(i=>i.revocation_status==='HARD_REVOKED').length,862);
const chosen=all.find(i=>i.FreePlayGate==='GUIDED'),spec=runtime.specFromFilters({levels:[routes.resolve(chosen['Nieuwe route'])],microconstructures:[chosen.Microconstructie]});
const session=runtime.createSession({selectionSpec:spec,engines:['CARDS','BOARD','WHEEL'],selectedGameEngine:'CARDS',targetDurationSeconds:30});
assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(session))),session);assert.ok(globalThis.ReleasePolicy.sessionAllowed(session));
const previous=runtime.banks()[0].previousVersions[0].items[0];assert.throws(()=>runtime.validateContentRefs([runtime.contentRef(previous)],{historical:true}),/niet beschikbaar/);
const original=require('../Lessen/woorden-zinnen.json');assert.notEqual(original.source.version,data.version);
delete globalThis.ContentRuntime;delete globalThis.ReleasePolicy;
console.log('PASS WZ release: all 2698 approved tasks, 862 blocked, exact routes, guided opt-in, original texts, open-answer policy and versioned resume.');
