const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),direct=require('../data/snelvragen-review.js').revise(source),firstReview=require('../data/snelvragen-vertel-review.js'),first=firstReview.revise(direct),secondReview=require('../data/snelvragen-vertel-vervolg.js'),second=secondReview.revise(first),thirdReview=require('../data/snelvragen-vertel-situaties.js'),previous=thirdReview.revise(second),review=require('../data/snelvragen-vertel-uitleg.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-tell'&&!firstReview.reviews[i.content_item_id]&&!secondReview.reviews[i.content_item_id]&&!thirdReview.reviews[i.content_item_id]).slice(0,120).map(i=>i.content_item_id));assert.equal(ids.length,120);assert.equal(JSON.stringify(previous),snapshot);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2501 other tasks unchanged, including previous 600 reviewed questions');assert.equal(bank.items.length,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:[source,direct,first,second,previous]});
for(const b of [source,direct,first,second,previous])guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
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
assert.equal(models,0);assert.equal(changedModels,0);assert.equal(changedLevels,77);
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{A2:76,B1:43,A1:1});
for(const oldBank of [source,direct,first,second,previous]){
 const old=createContentRuntime(oldBank,meta);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A1','A2','B1'])seeds[level]=old.createSession({filters:{topics:['quick-tell'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i);}
 }
}
const get=s=>runtime.itemById('sq-r'+s.split('-')[0]+'-circle-'+s.split('-')[1]);
assert.match(get('3-016').context,/geen ui/);assert.match(get('3-024').context,/thee.*koffie.*opnieuw koffie/);assert.match(get('3-032').context,/donderdag.*zaterdag.*vrijdag/);assert.equal(get('3-045').cefr_level,'A1');assert.match(get('3-045').explanation,/9.50/);assert.match(get('3-074').context,/verstuur het nog niet.*Verstuur het verslag nu/);assert.match(get('3-113').explanation,/verdeeld over kleine groepen/);assert.match(get('3-118').explanation,/niet bewezen dat het te laat/);assert.match(get('3-119').context,/radio zelf.*alleen via een app/);assert.match(get('3-116').explanation,/niet dat de lener/);

for(const level of ['A1','A2','B1']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-tell'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length);
}
assert.throws(()=>review.revise(source));
console.log('PASS fourth 120 Vertel: 1 A1/76 A2/43 B1; 77 level repairs, no source models invented; individual goals/guidance, other 2501 unchanged, 1800 exact historical restores plus pre-ref sessions, three-engine parity and theme spread.');
