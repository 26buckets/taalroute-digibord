const assert=require('node:assert/strict');
const contract=require('../match-pair-contract.js');
const source=require('../data/content-vert001-er-b1.js');

const report=contract.audit(source.items);
assert.equal(report.source_count,1440);
assert.equal(report.safe_count,288);
assert.equal(report.blocked_count,1152);
assert.deepEqual(report.blocked_by_reason,{
 OPTION_CONTEXT_REQUIRED:240,
 RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN:384,
 OPEN_RELATION_NOT_UNIQUE:528
});

const byType=report.pairs.reduce((acc,pair)=>(acc[pair.pair_type]=(acc[pair.pair_type]||0)+1,acc),{});
assert.deepEqual(byType,{ORDER_TO_SENTENCE:144,ERROR_CORRECTION:144});
assert.equal(new Set(report.pairs.map(p=>p.left.value)).size,288);
assert.equal(new Set(report.pairs.map(p=>p.right.value)).size,288);
assert.equal(report.pairs.some(p=>p.left.value===p.right.value),false);
const rightSet=new Set(report.pairs.map(p=>p.right.value));
assert.equal(report.pairs.some(p=>rightSet.has(p.left.value)),false);

for(const pair of report.pairs){
 const item=source.items.find(x=>x.content_item_id===pair.content_item_id);
 assert.ok(item);
 assert.equal(pair.source_bank,'CB-GRAM-001');
 assert.equal(pair.source_version,'1.2');
 if(pair.pair_type==='ERROR_CORRECTION'){
  assert.equal(item.exercise_type,'fout_verbeteren');
  assert.equal(item.interaction_type,'IT_006_CORRECT_ERROR');
  assert.equal(pair.right.value,item.correct_answer);
 }
 if(pair.pair_type==='ORDER_TO_SENTENCE'){
  assert.equal(item.exercise_type,'zinnen_leggen');
  assert.equal(item.interaction_type,'IT_008_ORDER');
  assert.equal(pair.right.value,item.correct_answer);
 }
}
const edge=report.pairs.find(p=>p.content_item_id==='ER_B1_027');
assert.ok(edge);
assert.match(edge.left.value,/eraan/);
assert.equal(edge.right.value,'Ik doe er volgend jaar weer aan mee.');

for(const type of ['scenario','snelvraag','herschrijven','dialoog_aanvullen','vrije_productie']){
 const item=source.items.find(x=>x.exercise_type===type);
 assert.equal(contract.candidate(item).safe,false);
 assert.equal(contract.candidate(item).reason,contract.BLOCK.OPEN_RELATION_NOT_UNIQUE);
}
for(const type of ['invullen','betekenis_kiezen','functie_sorteren']){
 const item=source.items.find(x=>x.exercise_type===type);
 assert.equal(contract.candidate(item).reason,contract.BLOCK.RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN);
}
for(const type of ['meerkeuze_vorm','meerkeuze_context']){
 const item=source.items.find(x=>x.exercise_type===type);
 assert.equal(contract.candidate(item).reason,contract.BLOCK.OPTION_CONTEXT_REQUIRED);
}

assert.equal(source.items.some(x=>Array.isArray(x.media_requirements)&&x.media_requirements.length>0),false,'PB001 has no canonical image relation for image-word MATCH');
console.log('PASS: MATCH 001 pair contract exposes exactly 288 source-derived unique pairs and blocks ambiguous or open relations.');
