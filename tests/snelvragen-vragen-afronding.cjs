const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),direct=require('../data/snelvragen-review.js').revise(source),firstReview=require('../data/snelvragen-vertel-review.js'),first=firstReview.revise(direct),secondReview=require('../data/snelvragen-vertel-vervolg.js'),second=secondReview.revise(first),thirdReview=require('../data/snelvragen-vertel-situaties.js'),third=thirdReview.revise(second),fourthReview=require('../data/snelvragen-vertel-uitleg.js'),fourth=fourthReview.revise(third),fifth=require('../data/snelvragen-vertel-afronding.js').revise(fourth),sixth=require('../data/snelvragen-vragen-review.js').revise(fifth),seventh=require('../data/snelvragen-vragen-vervolg.js').revise(sixth),eighth=require('../data/snelvragen-vragen-situaties.js').revise(seventh),previous=require('../data/snelvragen-vragen-uitleg.js').revise(eighth),review=require('../data/snelvragen-vragen-afronding.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-ask').slice(480).map(i=>i.content_item_id));assert.equal(ids.length,86);assert.equal(JSON.stringify(previous),snapshot);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2535 other tasks unchanged, including previous 1301 reviewed questions');assert.equal(bank.items.length,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:[source,direct,first,second,third,fourth,fifth,sixth,seventh,eighth,previous]});
for(const b of [source,direct,first,second,third,fourth,fifth,sixth,seventh,eighth,previous])guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
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
assert.equal(models,1);assert.equal(changedModels,0);assert.equal(changedLevels,86);
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{A2:69,B1:15,A1:2});
for(const oldBank of [source,direct,first,second,third,fourth,fifth,sixth,seventh,eighth,previous]){
 const old=createContentRuntime(oldBank,meta);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A1','A2','B1','B2'])seeds[level]=old.createSession({filters:{topics:['quick-ask'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i);}
 }
}
const get=n=>runtime.itemById('sq-'+n.replace('-','-square-'));
assert.match(get('r4-115').context,/toren/);assert.match(get('r4-119').context,/voorleesfunctie/);assert.match(get('r4-122').context,/Jij vraagt/);assert.match(get('r5-022').context,/nog geen hoeveelheid afgesproken/);assert.match(get('r5-022').explanation,/nog geen afspraak/);assert.match(get('r5-040').context,/twintig euro.*achtentwintig euro/);assert.match(get('r5-053').explanation,/Geen metingen/);assert.match(get('r5-062').context,/Pas op!/);assert.match(get('r5-073').context,/👍/);assert.match(get('r5-083').context,/Je gaat mee/);assert.match(get('r5-090').context,/Uw aanvraag is onvolledig/);assert.match(get('r5-092').explanation,/niet vooraf vermeld/);assert.match(get('r5-108').prompt,/zonder trappen of treden/);assert.match(get('r5-118').context,/buurman/);
assert.equal(get('r5-091').model_answer,'Kunt u toelichten welke onderdelen afzonderlijk te betalen zijn? Niet iedereen gebruikt het hele programma.');
for(const id of ids){const lesson=require('../data/content-guidance.js').bindings[id].lesson;assert.equal(lesson.activity,'Stel een vraag');assert.match(lesson.help,['sq-r4-square-117','sq-r5-square-018','sq-r5-square-062','sq-r5-square-117'].includes(id)?/zelf één of twee korte vragen stellen/:/zelf één vraag stellen/);assert.ok(!lesson.help.includes('eigen antwoord geven'));assert.equal(runtime.itemById(id).model_answer,source.items.find(i=>i.content_item_id===id).model_answer);}
assert.equal(bank.items.filter(i=>i.topic==='quick-tell'&&!i.version.includes('.vertel.')).length,0,'All 581 connected Vertel questions now reviewed');

for(const level of ['A1','A2','B1']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-ask'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length);
}
assert.equal(bank.items.filter(i=>i.topic==='quick-ask'&&!i.version.includes('.vragen.')).length,0,'All 566 connected ask tasks reviewed');
for(const id of ids.filter(id=>id.startsWith('sq-r5-'))){const related=bank.items.filter(i=>i.topic==='quick-ask'&&i.content_item_id.endsWith(id.slice(5))&&Number(i.content_item_id.match(/sq-r(\d)/)[1])<5).at(-1);assert.equal(runtime.itemById(id).practice_group,related.practice_group,id+' same goal uses same spread group');}
assert.deepEqual(bank.items.filter(i=>i.topic==='quick-ask').reduce((a,i)=>(a[i.cefr_level]=(a[i.cefr_level]||0)+1,a),{}),{A1:305,A2:226,B1:35});
assert.throws(()=>runtime.createSession({filters:{topics:['quick-ask'],levels:['B2']},targetDurationSeconds:60,selectedGameEngine:'CARDS'}),/Geen/,'No silent fallback from empty B2');
assert.throws(()=>review.revise(source));
console.log('PASS final 86 Stel een vraag: 2 A1/69 A2/15 B1, 86 level repairs, one original model unchanged; 2535 other tasks unchanged; 2838 historical restores plus pre-ref sessions, individual guidance, four paired questions and three-engine parity.');
