const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {bank,originals,review,output}=require('../scripts/import-werkvloertaal.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/werkvloertaal.js'),'utf8'),output);
const old=require('../scripts/import-c1-nuance.cjs');assert.equal(fs.readFileSync(require.resolve('../data/c1-nuance.js'),'utf8'),old.output,'Existing bank unchanged by shared reader');
const runtime=createContentRuntime(old.bank);runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});guidance.register(bank.guidance);guidance.complete(bank.items);
const levels={},counts={},seen=new Set();
for(const [n,i] of bank.items.entries()){
 const r=review.items[i.content_item_id],source=originals[n],task={...source,...r.patch};levels[i.cefr_level]=(levels[i.cefr_level]||0)+1;counts[source.letter]=(counts[source.letter]||0)+1;
 assert.equal(i.content_item_id,'C1_WK_'+String(n+1).padStart(3,'0'));for(const k of ['title','context','prompt'])assert.equal(i[k],task[k]);assert.deepEqual(i.options,task.options.map((s,n)=>'ABC'[n]+'. '+s));assert.equal(i.model_answer,i.options['ABC'.indexOf(source.letter)]);
 assert.equal(i.source_ref.source_level,'C1');assert.equal(i.source_ref.source_status,review.source_status);assert.ok(i.source_ref.source_sha256===review.source_sha256);assert.ok(i.explanation.startsWith(task.explanation+'\n\n'+task.note));
 assert.equal(runtime.answerPolicy(i).modelIsExample,r.scoring==='discuss');if(r.scoring==='discuss')assert.equal(i.correct_answer,null);
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key));assert.equal(guidance.mapping({...i,version:'changed'},key),null)}
 const signature=i.context+'\n'+i.prompt;assert.ok(!seen.has(signature));seen.add(signature);
}
assert.deepEqual(levels,{B2:65,B1:23,C1:12});assert.deepEqual(counts,{A:34,B:33,C:33});assert.equal(Object.values(review.items).filter(r=>Object.keys(r.patch).length).length,10);
assert.ok(runtime.itemById('C1_WK_090').options[0].includes('haalbaar'));assert.ok(!runtime.itemById('C1_WK_077').model_answer.includes('bewust'));
for(const level of ['B1','B2','C1']){
 const filters={bank_ids:[bank.bank_id],levels:[level]},engines=runtime.fullCoverageEngines(filters);assert.deepEqual(engines.slice().sort(),['BOARD','CARDS','WHEEL']);
 const options={filters,seed:42,targetDurationSeconds:600,selectedGameEngine:'CARDS'},a=runtime.createSession(options),b=runtime.createSession({...options,selectedGameEngine:'BOARD',selectionSpec:runtime.specFromFilters(filters)});assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>=7);assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(a))).selected_item_ids,a.selected_item_ids);
 for(const game of ['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE'])assert.throws(()=>runtime.createSession({...options,selectedGameEngine:game}),/spelvorm/);
}
// Same expression may be practiced differently; exact copied situations/questions are not inserted twice.
const ctx={window:{DIGIBORD_DATA:{}}};vm.runInNewContext(fs.readFileSync(require.resolve('../data/c1-between-lines.js'),'utf8'),ctx);
const previous=[...old.bank.items,...ctx.window.DIGIBORD_DATA.c1BetweenLines.cards.map(i=>({context:i.situation,prompt:i.question}))];
for(const i of bank.items)assert.ok(!previous.some(p=>p.context===i.context&&p.prompt===i.prompt));
const catalog=require('../data/content-catalog.js');catalog.registerBank(old.bank);catalog.registerBank(bank);const topic=catalog.families.find(f=>f.id==='conversation').topics.find(t=>t.id==='werkvloertaal');assert.deepEqual(topic.levels,['B1','B2','C1']);assert.equal(topic.subtopics.length,11);assert.throws(()=>runtime.filterSource({bank_ids:[bank.bank_id],levels:['A2']}),/niveau/);
const corrupt=structuredClone(bank);corrupt.items[0].review_status='OPEN';assert.throws(()=>createContentRuntime(corrupt),/reviewstatus/);
console.log('PASS Werkvloertaal: all 100 retained IDs, frozen hash, 10 corrections, B1/B2/C1 23/65/12, existing Nuance untouched, overlap, source/guidance, both routes, game restrictions and restored lessons.');
