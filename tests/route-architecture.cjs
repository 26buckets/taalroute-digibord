const assert=require('node:assert/strict');
const routes=require('../route-architecture.js'),audit=require('../data/wz-micro-audit.js');
assert.deepEqual(routes.routes.map(r=>r.id),['ALPHA_AC','A0_A1','A1_A2','A2_B1','B1_B2','B2_C1']);
const mapping={ALPHA_AC:['Alpha','Alpha A','Alpha B','Alpha C'],A0_A1:['A0','A0→A1','A0 tot A1'],A1_A2:['A1','A1+','A1→A1+','A1 → A2'],A2_B1:['A2','A2→B1'],B1_B2:['B1','B1→B2'],B2_C1:['B2','B2→C1','C1','C1→C2','C2']};
for(const [expected,values] of Object.entries(mapping))for(const value of values)assert.equal(routes.resolve(value),expected,value);
assert.equal(routes.resolve('Niveauvrij'),routes.REVIEW);
const counts={};
for(const [id,record] of Object.entries(audit.records)){
 const item={id,level:record.sourceLevel},before=JSON.stringify(item),result=routes.classification(item);
 assert.equal(result.displayRoute,routes.resolve(record['Nieuwe route']),id);
 for(const field of ['Nieuwe route','Microconstructie','FreePlayGate','ComplexityBudget','Reclassificatie','NormVersion'])assert.equal(result[field],record[field],id+' '+field);
 assert.equal(result.sourceLevel,record.sourceLevel);assert.equal(JSON.stringify(item),before);
 const key=result.displayRoute+' '+result.FreePlayGate;counts[key]=(counts[key]||0)+1;
 assert.equal(routes.selectable(item),record.FreePlayGate==='FREE'&&record.ComplexityBudget===1);
 if(record.FreePlayGate==='GUIDED'){assert.equal(routes.selectable(item,['ander']),false);assert.equal(routes.selectable(item,[record.Microconstructie]),true)}
}
assert.deepEqual(counts,{'A0_A1 FREE':550,'A1_A2 FREE':1523,'A1_A2 GUIDED':249,'A2_B1 FREE':1107,'A2_B1 GUIDED':131});
assert.equal(Object.keys(audit.records).length,3560);
const records=Object.values(audit.records);
assert.equal(records.filter(r=>routes.resolve(r.sourceLevel)==='A1_A2'&&r.sourceLevel.includes('+')).length,640);
assert.equal(records.filter(r=>/A1\s*(?:tot|→)\s*A2/.test(r.sourceLevel)&&r['Nieuwe route']==='A2→B1').length,118);
const sample=Object.keys(audit.records)[0];
assert.equal(routes.classification({id:sample,'Nieuwe route':'onbekend',level:'A1'}).displayRoute,routes.REVIEW,'unknown authoritative route never falls back');
assert.equal(routes.selectable({level:'A1',FreePlayGate:'BLOCKED',ComplexityBudget:1}),false);
assert.equal(routes.selectable({'Nieuwe route':'A1→A2',FreePlayGate:'BLOCKED',ComplexityBudget:1}),false);
assert.equal(routes.selectable({'Nieuwe route':'A1→A2',FreePlayGate:'FREE',ComplexityBudget:2}),false);
const {createContentRuntime}=require('../content-runtime.js');
const bank=require('../data/wz-pb004.js'),runtime=createContentRuntime(bank,{familyId:'words'}),source=JSON.stringify(bank);
const guided=bank.items.find(i=>routes.classification(i).FreePlayGate==='GUIDED'),micro=routes.classification(guided).Microconstructie;
assert.ok(guided);assert.ok(!runtime.filterSource().includes(guided));
assert.ok(runtime.filterSource({microconstructures:[micro]}).includes(guided));
const spec=runtime.specFromFilters({microconstructures:[micro]});assert.ok(runtime.selectionPool(spec).includes(guided));
require('../release-policy.js');assert.equal(runtime.filterSource({microconstructures:[micro]}).length,0,'no audit classification unlocks an unreleased bank');delete globalThis.ReleasePolicy;
assert.equal(JSON.stringify(bank),source,'canonical bank and content fingerprints unchanged');
for(const level of ['A1+','C2','A1→A1+']){
 const old={level,currentVerb:'VRB_WERKEN',verbLocked:false,taalworpSets:['SET_A2_BASIS'],taalworpDice:{CONNECT_1:{active:true,locked:true,value:{id:'and',label:'en'}},CONNECT_2:{active:true,locked:false,value:{id:'because',label:'omdat'}}}},before=JSON.stringify(old),migrated=routes.migrateApp(old);
 assert.equal(JSON.stringify(old),before);assert.equal(migrated.level,level);assert.equal(migrated.displayRoute,routes.resolve(level));assert.deepEqual(migrated.taalworpLegacySnapshot.dice,old.taalworpDice);assert.deepEqual(routes.migrateApp(migrated),migrated);
}
console.log('PASS routes v1.1: six routes, all legacy mappings, 3560 records, 640/118 relocations, immutable metadata, guided/blocked/budget/release gates and exact legacy snapshots.');
