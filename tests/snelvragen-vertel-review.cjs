const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const original=require('../data/snelvragen-content.js'),previous=require('../data/snelvragen-review.js').revise(original),review=require('../data/snelvragen-vertel-review.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const before=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),metadata={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,original.items.filter(i=>i.topic==='quick-tell').slice(0,120).map(i=>i.content_item_id));assert.equal(ids.length,120);assert.equal(JSON.stringify(previous),before);
assert.equal(bank.items.length,2621);assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2501 other cards unchanged, including 240 reviewed direct questions');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../Lessen/directe-vragen.json'))).digest('hex'),require('./fixtures/snelvragen-review.json').legacy_sha256);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...metadata,previousVersions:[original,previous]});
guidance.registerHistorical(original);guidance.registerHistorical(previous);guidance.register(bank.guidance);guidance.complete(bank.items);
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=original.items.find(i=>i.content_item_id===id);
 assert.equal(i.topic,'quick-tell');assert.equal(i.version,review.version);assert.ok(r.goal.endsWith('.')&&r.check.endsWith('.')&&r.finding&&r.reason.includes(r.goal),id+' explicit review');
 assert.ok(i.prompt&&i.feedback_incorrect&&i.explanation.includes(r.check));assert.equal(i.model_answer,old.model_answer,'No missing model filled or source model rewritten');
 assert.equal(i.learning_goal,r.goal);assert.equal(i.cefr_level,r.level);assert.equal(i.correct_answer,null);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');
 assert.ok(!i.feedback_incorrect.includes('Een concrete kernboodschap'));assert.ok(!i.title.includes('Welbevinden'));
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' old '+key)}
 assert.equal(guidance.mapping(i,'erk').levels[0],i.cefr_level);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
 assert.deepEqual(runtime.fullCoverageEngines({bank_ids:[bank.bank_id],topics:['quick-tell'],levels:[i.cefr_level]}).sort(),['BOARD','CARDS','WHEEL']);
}
// Every reviewed task restores its former exact text through both earlier bank versions and all three games.
for(const oldBank of [original,previous]){
 const old=createContentRuntime(oldBank,metadata);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A1','A2'])seeds[level]=old.createSession({filters:{topics:['quick-tell'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){
   const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};
   assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i,id+' original content');
   const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i,id+' old selection without refs');
  }
 }
}
const get=id=>runtime.itemById('sq-r'+id.split('-')[0]+'-circle-'+id.split('-')[1]);
assert.equal(get('0-062').context,'Denk aan een plein.');assert.equal(get('0-012').prompt,'Waar is je jas?');assert.match(get('0-072').prompt,/scherm/);assert.match(get('0-070').context,/bezoek/);assert.match(get('0-109').context,/jarig/);assert.doesNotMatch(get('0-116').feedback_incorrect,/Groot/);assert.match(get('1-006').feedback_incorrect,/want/);assert.equal(get('1-006').cefr_level,'A2');
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{A1:119,A2:1});
for(const level of ['A1','A2']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-tell'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};
 const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length,'Themes spread before repetition');
}
assert.throws(()=>review.revise(original));
console.log('PASS 120 Vertel questions: 119 A1/1 A2, individual support/checks and four guidance links, unchanged source models and other 2501 cards, 720 historical restores plus pre-ref sessions, three-engine route parity and theme spread.');
