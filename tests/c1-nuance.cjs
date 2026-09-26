const assert=require('node:assert/strict'),fs=require('node:fs');
const {bank,originals,review,output}=require('../scripts/import-c1-nuance.cjs');
const {createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/c1-nuance.js'),'utf8'),output);
const runtime=createContentRuntime(require('../data/content-vert001-er-b1.js'));
runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY']});guidance.register(bank.guidance);
assert.throws(()=>guidance.register(bank.guidance),/Dubbele uitleg/);
const levels={B1:0,B2:0,C1:0};
for(const [n,item] of bank.items.entries()){
 const r=review.items[item.content_item_id],source=originals[n],task={...source,...r.patch};levels[item.cefr_level]++;
 for(const field of ['title','context','prompt'])assert.equal(item[field],task[field]);
 assert.deepEqual(item.options,task.options.map((s,i)=>'ABC'[i]+'. '+s));
 assert.equal(item.model_answer,item.options['ABC'.indexOf(source.letter)]);
 assert.ok(item.explanation.startsWith(task.explanation+'\n\n'+task.note));
 assert.equal(item.source_ref.source_level,'C1');
 assert.equal(runtime.answerPolicy(item).modelIsExample,r.scoring==='discuss');
 assert.equal(guidance.mapping(item,'erk').levels[0],item.cefr_level);assert.ok(guidance.mapping(item,'bow'));
 assert.equal(guidance.mapping(item,'lowan'),null);assert.equal(guidance.mapping(item,'f'),null);
 assert.equal(guidance.mapping({...item,version:'changed'},'erk'),null);
}
assert.deepEqual(levels,{B1:16,B2:37,C1:27});
for(const level of Object.keys(levels))for(const topic of ['betekenis-woorden','passende-toon']){
 const filters={family_ids:['conversation'],topics:[topic],levels:[level]},engines=runtime.fullCoverageEngines(filters);
 assert.deepEqual(engines.slice().sort(),['BOARD','CARDS','WHEEL']);
 const options={filters,seed:42,targetDurationSeconds:300,selectedGameEngine:'CARDS'};
 const a=runtime.createSession(options),b=runtime.createSession({...options,selectedGameEngine:'BOARD',selectionSpec:runtime.specFromFilters(filters)});
 assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>=4);
 assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(a))).selected_item_ids,a.selected_item_ids);
 assert.throws(()=>runtime.createSession({...options,selectedGameEngine:'DICE'}),/spelvorm/);
 const next=runtime.createSession({...options,recentItemIds:a.selected_item_ids});
 if(runtime.filterSource(filters).length>=a.selected_item_ids.length*2)assert.ok(next.selected_item_ids.every(id=>!a.selected_item_ids.includes(id)));
}
const unreviewed=structuredClone(bank);unreviewed.items[0].review_status='OPEN';assert.throws(()=>createContentRuntime(unreviewed),/reviewstatus/);
console.log('PASS: Nuance 80, source preservation and patches, B1/B2/C1 advice, discussion answers, three suitable games, both routes, rotation, reload, versioned guidance and review gate.');
