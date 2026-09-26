const assert=require('node:assert/strict'),fs=require('node:fs');
const {bank,review,source,output}=require('../scripts/import-snelvragen.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/snelvragen-content.js'),'utf8'),output);
const statuses={};for(const r of review.items){const key=r.source+':'+r.status;statuses[key]=(statuses[key]||0)+1;}
assert.deepEqual(statuses,{'legacy:KEEP_EXISTING':240,'drive:ADD':2344,'drive:HOLD':763,'drive:DUPLICATE':393,'regel:ADD':37,'regel:HOLD':8});
assert.equal(bank.item_count,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));
const old=runtime.createSession({filters:{levels:['B1']},selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:7});
runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']});guidance.register(bank.guidance);guidance.complete(bank.items);
assert.deepEqual(runtime.restoreSession(structuredClone(old)).selected_item_ids,old.selected_item_ids);
const byId=new Map(bank.items.map(i=>[i.content_item_id,i])),rows=new Map(source.cards.slice(1).map(r=>[r[0],r]));
for(const r of review.items){
 const item=byId.get(r.id);assert.equal(!!item,['ADD','KEEP_EXISTING'].includes(r.status),r.id);
 if(!item)continue;
 assert.equal(item.cefr_level,r.level);assert.ok(!['C1','C2'].includes(item.cefr_level));assert.equal(item.correct_answer,null);assert.deepEqual(item.options,[]);assert.equal(runtime.answerPolicy(item).mode,'teacher_or_peer_review');
 assert.ok(item.prompt.trim());assert.ok(item.explanation.trim());assert.ok(item.language_function);assert.ok(item.practice_group);
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(item,key));assert.equal(guidance.mapping({...item,version:'unreviewed'},key),null);}
 if(r.source==='drive'){
  const row=rows.get(r.id);assert.equal((r.context?r.context+' ':'')+r.prompt,row[4],'Lossless situation split '+r.id);
  assert.equal(item.prompt,r.edits.prompt??r.prompt);assert.equal(item.model_answer,r.edits.model??row[6]);
 }
}
for(const c of require('../Lessen/directe-vragen.json').cards){assert.equal(byId.get(c.id).prompt,c.instruction);assert.equal(byId.get(c.id).model_answer,c.model);}
assert.ok(!byId.has('dq_5_diamond_07'));assert.ok(!byId.has('dq_6_diamond_06'));
assert.ok(!byId.has('sq-r0-square-001'),'Existing board question not copied');assert.ok(byId.has('sq-r0-square-012'),'Asking where a key is differs from telling where it is');
assert.ok(bank.items.some(i=>!i.model_answer),'No invented models for missing source answers');
const totals={};for(const i of bank.items)totals[i.cefr_level]=(totals[i.cefr_level]||0)+1;assert.deepEqual(totals,{A1:774,A2:853,B1:571,B2:423});
for(const topic of new Set(bank.items.map(i=>i.topic)))for(const level of new Set(bank.items.filter(i=>i.topic===topic).map(i=>i.cefr_level))){
 const filters={bank_ids:[bank.bank_id],topics:[topic],levels:[level]},opts={filters,targetDurationSeconds:300,seed:23};
 assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);
 const a=runtime.createSession({...opts,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...opts,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);assert.deepEqual(runtime.restoreSession(structuredClone(a)).selected_item_ids,a.selected_item_ids);
 const groups=a.selected_item_ids.map(id=>byId.get(id).practice_group);assert.equal(new Set(groups).size,groups.length,'Spread repeated cases before reuse');
 for(const engine of ['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE'])assert.throws(()=>runtime.createSession({...opts,selectedGameEngine:engine}));
}
const catalog=require('../data/content-catalog.js');catalog.registerBank(bank);assert.equal(catalog.families.find(f=>f.id==='quick').topics.length,5);
console.log('PASS Snelvragen: 3785 decisions, 2621 connected (240 retained), 37/45 Regel iets, source text/IDs, levels, open discussion, three engines, route parity, case spread and saved sessions.');
