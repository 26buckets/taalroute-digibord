const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),direct=require('../data/snelvragen-review.js').revise(source),firstReview=require('../data/snelvragen-vertel-review.js'),first=firstReview.revise(direct),secondReview=require('../data/snelvragen-vertel-vervolg.js'),second=secondReview.revise(first),thirdReview=require('../data/snelvragen-vertel-situaties.js'),third=thirdReview.revise(second),fourthReview=require('../data/snelvragen-vertel-uitleg.js'),fourth=fourthReview.revise(third),previous=require('../data/snelvragen-vertel-afronding.js').revise(fourth),review=require('../data/snelvragen-vragen-review.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-ask').slice(0,120).map(i=>i.content_item_id));assert.equal(ids.length,120);assert.equal(JSON.stringify(previous),snapshot);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2501 other tasks unchanged, including previous 821 reviewed questions');assert.equal(bank.items.length,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:[source,direct,first,second,third,fourth,previous]});
for(const b of [source,direct,first,second,third,fourth,previous])guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
let changedLevels=0,changedModels=0,models=0;
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=source.items.find(i=>i.content_item_id===id);
 assert.equal(i.version,review.version);assert.equal(i.topic,'quick-ask');assert.ok(r.goal&&r.check&&r.help&&r.finding&&r.reason.includes(r.goal));assert.ok(i.prompt&&i.explanation.includes(r.check));
 assert.equal(i.correct_answer,null);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(i.learning_goal,r.goal);assert.equal(i.cefr_level,r.level);
 assert.ok(!i.feedback_incorrect.includes('Samenhangende eenvoudige informatie'));assert.ok(!i.title.includes('Welbevinden'));
 if(!old.model_answer)assert.equal(i.model_answer,'','No invented missing model '+id);if(i.model_answer)models++;if(i.model_answer!==old.model_answer)changedModels++;if(i.cefr_level!==old.cefr_level)changedLevels++;
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' historical '+key)}
 assert.equal(guidance.mapping(i,'erk').levels[0],i.cefr_level);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
}
assert.equal(models,23);assert.equal(changedModels,1);assert.equal(changedLevels,2);
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{A1:120});
for(const oldBank of [source,direct,first,second,third,fourth,previous]){
 const old=createContentRuntime(oldBank,meta);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A1','A2'])seeds[level]=old.createSession({filters:{topics:['quick-ask'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i);}
 }
}
const get=s=>runtime.itemById('sq-r'+s.split('-')[0]+'-square-'+s.split('-')[1]);
assert.match(get('0-009').explanation,/plek, niet om de begintijd/);assert.match(get('0-103').explanation,/hoeft de plant niet zelf te beoordelen/);assert.match(get('0-104').explanation,/geen foto nodig/);assert.match(get('0-119').explanation,/bewust onbekend/);assert.match(get('0-120').explanation,/Van jou of van u/);assert.equal(get('0-096').model_answer,'Waar kan ik een doek pakken?');assert.equal(get('1-001').cefr_level,'A1');assert.equal(get('1-002').cefr_level,'A1');
assert.equal(require('../data/content-guidance.js').bindings['sq-r1-square-001'].lesson.activity,'Stel een vraag');assert.match(require('../data/content-guidance.js').bindings['sq-r1-square-001'].lesson.help,/zelf één vraag stellen/);
assert.equal(bank.items.filter(i=>i.topic==='quick-tell'&&!i.version.includes('.vertel.')).length,0,'All 581 connected Vertel questions now reviewed');

for(const level of ['A1']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-ask'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length);
}
assert.throws(()=>review.revise(source));
console.log('PASS first 120 Stel een vraag: 120 A1, 2 level repairs, 23 models (1 edited), 2501 other items unchanged, 2520 historical restores plus pre-ref sessions, individual guidance and three-engine parity.');
