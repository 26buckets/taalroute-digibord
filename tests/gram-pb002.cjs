const assert=require('node:assert/strict'),fs=require('node:fs');
const {bank,originals,review,output}=require('../scripts/import-gram-pb002.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/gram-pb002.js'),'utf8'),output);
const base=require('../data/content-vert001-er-b1.js'),before=JSON.stringify(base),runtime=createContentRuntime(base);
runtime.registerBank(bank,{excludedEngines:['DICE','MATCH','MEMORY','SORT']});guidance.register(bank.guidance);guidance.complete(bank.items);
assert.equal(JSON.stringify(base),before);
const levels={},positions={},fingerprints=new Set();
for(const [index,item] of bank.items.entries()){
 const source=originals[index],expected={...source,...review.items[source.id].changes};levels[item.cefr_level]=(levels[item.cefr_level]||0)+1;
 for(const [target,key] of [['prompt','prompt'],['context','context'],['model_answer','model_answer'],['correct_answer','correct_answer'],['explanation','grammar_note'],['cefr_level','level'],['language_function','function']])assert.equal(item[target],expected[key]);
 assert.equal(item.source_ref.original_level,source.level);assert.equal(item.source_ref.original_version,'2.0');assert.equal(item.source_ref.original_review,'REVIEW_GO');assert.equal(item.source_ref.row,index+2);
 assert.ok(!/antecedent|Hoofdmededeling|Bijzin-informatie|nominale|B2-relatieve|Sorteer/.test(item.prompt+item.context+item.options.join(' ')),item.content_item_id);
 assert.ok(!item.taalroute_route);assert.ok(item.prompt.trim()&&item.model_answer.trim());
 for(const key of ['erk','bow','lowan','f']){assert.ok(guidance.mapping(item,key));assert.equal(guidance.mapping({...item,version:'other'},key),null)}
 for(const e of ['BOARD','WHEEL','CARDS'])assert.ok(runtime.compatibility(item,e).compatible);
 for(const e of ['DICE','MATCH','MEMORY','SORT'])assert.ok(!runtime.compatibility(item,e).compatible);
 if(item.options.length){const k=item.options.indexOf(item.correct_answer);positions[k]=(positions[k]||0)+1;assert.equal(new Set(item.options).size,3);assert.ok(k>=0)}
 if(item.exercise_type==='zinnen_leggen'){assert.equal(item.expected_tokens.length,3);assert.equal(item.expected_tokens.join(' ')+'.',item.correct_answer);assert.deepEqual(runtime.project('SEQUENCE',item).orderExpectedTokens,item.expected_tokens);}
 const fp=item.context+'\n'+item.prompt+'\n'+item.options.slice().sort().join(' | ');assert.ok(!fingerprints.has(fp),'Duplicate '+item.content_item_id);fingerprints.add(fp);
}
assert.deepEqual(levels,{B1:458,B2:142});assert.ok(Object.values(positions).every(n=>n>30));
assert.equal(runtime.filterSource({topics:['RELATIEVE_BIJZIN']}).length,600);
assert.equal(runtime.filterSource({topics:['RELATIEVE_BIJZIN'],levels:['A2']}).length,0);
for(const level of ['B1','B2'])for(const engine of ['BOARD','WHEEL','CARDS']){
 const filters={topics:['RELATIEVE_BIJZIN'],levels:[level]},a=runtime.createSession({filters,selectedGameEngine:engine,seed:41,targetDurationSeconds:300}),b=runtime.createSession({selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine,seed:41,targetDurationSeconds:300});
 assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>1);assert.deepEqual(runtime.restoreSession(a).selected_item_ids,a.selected_item_ids);
}
assert.equal(runtime.itemById('REL_A2_130').correct_answer,'De cursus');
assert.ok(runtime.itemById('REL_A2_066').model_answer.includes('naar haar werk meenam'));
assert.ok(runtime.itemById('REL_B2_088').context.includes('De lezer weet al'));
assert.equal(runtime.itemById('REL_B2_094').exercise_type,'herschrijven');
assert.ok(runtime.itemById('REL_B1_161').prompt.includes('waaraan'));
const old=runtime.createSession({filters:{topics:['ZULLEN','ZOUDEN'],levels:['B1']},targetDurationSeconds:300,selectedGameEngine:'DICE'});assert.ok(old.selected_item_ids.every(id=>!id.startsWith('REL_')));assert.deepEqual(runtime.restoreSession(old).selected_item_ids,old.selected_item_ids);
const rejected=structuredClone(bank);rejected.items[0].review_status='REVIEW';assert.throws(()=>createContentRuntime(rejected),/reviewstatus/);
console.log('PASS PB002: 600 retained IDs, B1 minimum (458 B1 / 142 B2), source-linked edits, choices, 60 ordered groups, both routes, lesson guidance, restoration and game restrictions.');
