const assert=require('node:assert/strict'),fs=require('node:fs');
const {bank,legacy,review,output}=require('../scripts/import-tussen-de-regels.cjs');
const {createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/tussen-de-regels.js'),'utf8'),output);
assert.deepEqual(review.items.filter(r=>r.proposed_edit).map(r=>r.id),['C1_AL_004','C1_INT_025','C1_REG_035','C1_IMP_048']);
const runtime=createContentRuntime(require('../data/gesprek-repareren.js'));
const saved=runtime.createSession({filters:{levels:['B1']},selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:3});
runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(saved))).selected_item_ids,saved.selected_item_ids);
guidance.register(bank.guidance);guidance.complete(bank.items);
const levels={},signatures=new Set();let edits=0;
for(const [n,item] of bank.items.entries()){
 const original=legacy.cards[n],card=structuredClone(original),r=review.items.find(r=>r.id===original.id);
 if(r.proposed_edit){edits++;const {field,text}=r.proposed_edit;if(field==='options.A')card.options[0].text=text;else card[field]=text;}
 assert.equal(item.content_item_id,original.id);assert.equal(item.title,card.expression);assert.equal(item.context,card.situation);assert.equal(item.prompt,card.question);
 assert.deepEqual(item.options,card.options.map(o=>o.id+'. '+o.text));assert.equal(item.model_answer,item.options['ABC'.indexOf(original.correct)]);assert.equal(item.correct_answer,item.model_answer);
 assert.equal(item.explanation,card.explanation+'\n\n'+card.attention);assert.equal(item.source_ref.source_level,'C1');assert.equal(original.level,'C1');
 assert.equal(item.productive_or_receptive,'receptief');assert.deepEqual(item.media_requirements,[]);
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(item,key));assert.equal(guidance.mapping({...item,version:'changed'},key),null);}
 levels[item.cefr_level]=(levels[item.cefr_level]||0)+1;signatures.add(item.context+'\n'+item.prompt);
}
assert.equal(edits,4);assert.equal(signatures.size,50);assert.deepEqual(levels,{B1:19,B2:31});
for(const level of ['B1','B2']){
 const filters={bank_ids:[bank.bank_id],levels:[level]};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);
 const options={filters,selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:42},cards=runtime.createSession(options),board=runtime.createSession({...options,selectedGameEngine:'BOARD',selectionSpec:runtime.specFromFilters(filters)});
 assert.deepEqual(cards.selected_item_ids,board.selected_item_ids);assert.ok(cards.selected_item_ids.length>=7);assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(cards))).selected_item_ids,cards.selected_item_ids);
 for(const selectedGameEngine of ['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE'])assert.throws(()=>runtime.createSession({...options,selectedGameEngine}));
}
assert.throws(()=>runtime.filterSource({bank_ids:[bank.bank_id],levels:['C1']}),/niveau/);
const catalog=require('../data/content-catalog.js');catalog.registerBank(bank);const topic=catalog.families.find(f=>f.id==='conversation').topics.find(t=>t.id==='tussen-de-regels');assert.deepEqual(topic.levels,['B1','B2']);assert.equal(topic.subtopics.length,6);
console.log('PASS between-lines: all 50 source IDs, exactly four approved edits, 19 B1/31 B2, guidance, suitable engines, both routes and saved selection.');
