const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),direct=require('../data/snelvragen-review.js').revise(source),firstReview=require('../data/snelvragen-vertel-review.js'),first=firstReview.revise(direct),secondReview=require('../data/snelvragen-vertel-vervolg.js'),second=secondReview.revise(first),thirdReview=require('../data/snelvragen-vertel-situaties.js'),third=thirdReview.revise(second),fourthReview=require('../data/snelvragen-vertel-uitleg.js'),previous=fourthReview.revise(third),review=require('../data/snelvragen-vertel-afronding.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-tell'&&!firstReview.reviews[i.content_item_id]&&!secondReview.reviews[i.content_item_id]&&!thirdReview.reviews[i.content_item_id]&&!fourthReview.reviews[i.content_item_id]).slice(0,101).map(i=>i.content_item_id));assert.equal(ids.length,101);assert.equal(JSON.stringify(previous),snapshot);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2520 other tasks unchanged, including previous 720 reviewed questions');assert.equal(bank.items.length,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:[source,direct,first,second,third,previous]});
for(const b of [source,direct,first,second,third,previous])guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
let changedLevels=0,changedModels=0,models=0;
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=source.items.find(i=>i.content_item_id===id);
 assert.equal(i.version,review.version);assert.equal(i.topic,'quick-tell');assert.ok(r.goal&&r.check&&r.help&&r.finding&&r.reason.includes(r.goal));assert.ok(i.prompt&&i.explanation.includes(r.check));
 assert.equal(i.correct_answer,null);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(i.learning_goal,r.goal);assert.equal(i.cefr_level,r.level);
 assert.ok(!i.feedback_incorrect.includes('Samenhangende eenvoudige informatie'));assert.ok(!i.title.includes('Welbevinden'));
 if(!old.model_answer)assert.equal(i.model_answer,'','No invented missing model '+id);if(i.model_answer)models++;if(i.model_answer!==old.model_answer)changedModels++;if(i.cefr_level!==old.cefr_level)changedLevels++;
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' historical '+key)}
 assert.equal(guidance.mapping(i,'erk').levels[0],i.cefr_level);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
}
assert.equal(models,1);assert.equal(changedModels,0);assert.equal(changedLevels,73);
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{B1:65,A2:9,B2:27});
for(const oldBank of [source,direct,first,second,third,previous]){
 const old=createContentRuntime(oldBank,meta);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A2','B1','B2'])seeds[level]=old.createSession({filters:{topics:['quick-tell'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i);}
 }
}
const get=s=>runtime.itemById('sq-r'+s.split('-')[0]+'-circle-'+s.split('-')[1]);
assert.match(get('4-032').context,/vrijdag.*maandag.*weekend/);assert.match(get('4-045').explanation,/9.50.*10.00/);assert.equal(get('4-053').model_answer,source.items.find(i=>i.content_item_id==='sq-r4-circle-053').model_answer);assert.match(get('5-026').explanation,/totaalprijzen ontbreken/);assert.match(get('5-038').context,/lege stoel/);assert.match(get('5-071').explanation,/niet als deadline/);assert.match(get('5-093').context,/Vier vrienden/);assert.match(get('5-108').explanation,/beschikbaarheid, capaciteit en geschiktheid/);assert.match(get('5-116').context,/De eigenaar zegt/);assert.doesNotMatch(get('5-121').context,/qualitytime/);assert.match(get('5-123').context,/tien minuten/);
assert.equal(bank.items.filter(i=>i.topic==='quick-tell'&&!i.version.includes('.vertel.')).length,0,'All 581 connected Vertel questions now reviewed');

for(const level of ['A2','B1','B2']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-tell'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length);
}
assert.throws(()=>review.revise(source));
console.log('PASS final 101 Vertel: 9 A2/65 B1/27 B2; 73 level repairs, source model retained; individual guidance, other 2520 unchanged, 1818 exact historical restores plus pre-ref sessions, three-engine parity and theme spread; all 581 Vertel reviewed.');
