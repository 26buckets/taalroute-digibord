const assert=require('node:assert/strict'),fs=require('node:fs');
const {bank,review,output}=require('../scripts/import-mr03.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/mr03.js'),'utf8'),output);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));
const old=runtime.createSession({filters:{levels:['B1']},selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:7});
runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']});guidance.register(bank.guidance);guidance.complete(bank.items);
assert.deepEqual(runtime.restoreSession(structuredClone(old)).selected_item_ids,old.selected_item_ids);
assert.equal(bank.items.length,12);assert.equal(new Set(bank.items.map(i=>i.content_item_id)).size,12);
for(const [n,i] of bank.items.entries()){
 const r=review.items[n];assert.equal(i.content_item_id,r.id);assert.equal(i.prompt,r.prompt);assert.equal(i.context,r.context);assert.equal(i.model_answer,r.teacher.example_answer);assert.deepEqual(i.reasoning.presentation,r.presentation);
 assert.equal(i.cefr_level,'B2');assert.equal(i.correct_answer,null);assert.deepEqual(i.options,[]);assert.ok(runtime.answerPolicy(i).modelIsExample);assert.equal(i.interaction_type,'IT_001_OPEN_ANSWER');
 for(const k of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,k));assert.equal(guidance.mapping({...i,version:'unknown'},k),null);}
 assert.equal(i.reasoning.presentation.source_blocks.join(' '),i.context);
 assert.equal(!!i.reasoning.hint,n<10);assert.equal(!!i.reasoning.extension_note,[8,9,10].includes(n));
}
const filters={bank_ids:[bank.bank_id],levels:['B2']},options={filters,selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:42};
assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);
const a=runtime.createSession(options),b=runtime.createSession({...options,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:'BOARD'});assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.equal(a.selected_item_ids.length,4);
assert.deepEqual(runtime.restoreSession(structuredClone(a)).selected_item_ids,a.selected_item_ids);
for(const selectedGameEngine of ['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE'])assert.throws(()=>runtime.createSession({...options,selectedGameEngine}));
const catalog=require('../data/content-catalog.js');catalog.registerBank(bank,{familyId:'reading',label:'Teksten begrijpen'});assert.deepEqual(catalog.families.find(f=>f.id==='reading').topics[0].levels,['B2']);
console.log('PASS MR03: 12 exact reviewed tasks, B2 plus optional C1 enrichment, open discussion, guidance, three suitable engines, route parity and old session preservation.');
