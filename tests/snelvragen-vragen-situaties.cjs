const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),direct=require('../data/snelvragen-review.js').revise(source),firstReview=require('../data/snelvragen-vertel-review.js'),first=firstReview.revise(direct),secondReview=require('../data/snelvragen-vertel-vervolg.js'),second=secondReview.revise(first),thirdReview=require('../data/snelvragen-vertel-situaties.js'),third=thirdReview.revise(second),fourthReview=require('../data/snelvragen-vertel-uitleg.js'),fourth=fourthReview.revise(third),fifth=require('../data/snelvragen-vertel-afronding.js').revise(fourth),sixth=require('../data/snelvragen-vragen-review.js').revise(fifth),previous=require('../data/snelvragen-vragen-vervolg.js').revise(sixth),review=require('../data/snelvragen-vragen-situaties.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-ask').slice(240,360).map(i=>i.content_item_id));assert.equal(ids.length,120);assert.equal(JSON.stringify(previous),snapshot);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2501 other tasks unchanged, including previous 1061 reviewed questions');assert.equal(bank.items.length,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:[source,direct,first,second,third,fourth,fifth,sixth,previous]});
for(const b of [source,direct,first,second,third,fourth,fifth,sixth,previous])guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
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
assert.equal(models,2);assert.equal(changedModels,0);assert.equal(changedLevels,68);
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{A1:68,A2:52});
for(const oldBank of [source,direct,first,second,third,fourth,fifth,sixth,previous]){
 const old=createContentRuntime(oldBank,meta);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A1','A2'])seeds[level]=old.createSession({filters:{topics:['quick-ask'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i);}
 }
}
const get=n=>runtime.itemById('sq-r2-square-'+n);
assert.match(get('003').context,/buurvrouw/);assert.match(get('010').context,/Ik mis de bus/);assert.match(get('012').context,/E10/);assert.match(get('020').context,/Na het eten/);assert.match(get('027').prompt,/goedkoopste.*per kilo/);assert.match(get('028').context,/vier euro.*drie euro/);assert.match(get('037').context,/overstap mist/);assert.match(get('041').explanation,/nog niet opgelost/);assert.match(get('051').context,/bestelling inpakken/);assert.match(get('054').context,/plakband/);assert.match(get('069').context,/wel een slaapbank/);assert.match(get('075').explanation,/moet de juiste tijd nog/);assert.match(get('085').prompt,/langer.*wachten/);assert.match(get('089').context,/dag is voorbij/);assert.match(get('099').explanation,/Vraag eerst/);assert.match(get('101').context,/buurvrouw/);assert.match(get('113').context,/rijden geen treinen/);assert.match(get('118').context,/naaimachine/);
assert.equal(get('012').model_answer,'Wat betekent deze foutmelding op de wasmachine?');assert.equal(get('023').model_answer,'Hoe groot mag mijn beker voor deze koffieautomaat zijn?');
for(const id of ids){const lesson=require('../data/content-guidance.js').bindings[id].lesson;assert.equal(lesson.activity,'Stel een vraag');assert.match(lesson.help,/zelf één vraag stellen/);assert.ok(!lesson.help.includes('eigen antwoord geven'));assert.equal(runtime.itemById(id).model_answer,source.items.find(i=>i.content_item_id===id).model_answer);}
assert.equal(bank.items.filter(i=>i.topic==='quick-tell'&&!i.version.includes('.vertel.')).length,0,'All 581 connected Vertel questions now reviewed');

for(const level of ['A1','A2']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-ask'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length);
}
assert.throws(()=>review.revise(source));
console.log('PASS third 120 Stel een vraag: 68 A1/52 A2, 68 level repairs, two original models unchanged; 2501 other tasks unchanged; 3240 historical restores plus pre-ref sessions, individual guidance and three-engine parity.');
