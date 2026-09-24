const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),direct=require('../data/snelvragen-review.js').revise(source),firstReview=require('../data/snelvragen-vertel-review.js'),first=firstReview.revise(direct),secondReview=require('../data/snelvragen-vertel-vervolg.js'),second=secondReview.revise(first),thirdReview=require('../data/snelvragen-vertel-situaties.js'),third=thirdReview.revise(second),fourthReview=require('../data/snelvragen-vertel-uitleg.js'),fourth=fourthReview.revise(third),fifth=require('../data/snelvragen-vertel-afronding.js').revise(fourth),sixth=require('../data/snelvragen-vragen-review.js').revise(fifth),seventh=require('../data/snelvragen-vragen-vervolg.js').revise(sixth),eighth=require('../data/snelvragen-vragen-situaties.js').revise(seventh),ninth=require('../data/snelvragen-vragen-uitleg.js').revise(eighth),tenth=require('../data/snelvragen-vragen-afronding.js').revise(ninth),eleventh=require('../data/snelvragen-kies-review.js').revise(tenth),twelfth=require('../data/snelvragen-kies-vervolg.js').revise(eleventh),thirteenth=require('../data/snelvragen-kies-situaties.js').revise(twelfth),previous=require('../data/snelvragen-kies-uitleg.js').revise(thirteenth),review=require('../data/snelvragen-kies-afronding.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-choose').slice(480).map(i=>i.content_item_id));assert.equal(ids.length,133);assert.equal(JSON.stringify(previous),snapshot);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'2488 other tasks unchanged, including previous 1867 reviewed questions');assert.equal(bank.items.length,2621);
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:[source,direct,first,second,third,fourth,fifth,sixth,seventh,eighth,ninth,tenth,eleventh,twelfth,thirteenth,previous]});
for(const b of [source,direct,first,second,third,fourth,fifth,sixth,seventh,eighth,ninth,tenth,eleventh,twelfth,thirteenth,previous])guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
let changedLevels=0,changedModels=0,models=0;
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=source.items.find(i=>i.content_item_id===id);
 assert.equal(i.version,review.version);assert.equal(i.topic,'quick-choose');assert.ok(r.goal&&r.check&&r.help&&r.finding&&r.reason.includes(r.goal));assert.ok(i.prompt&&i.explanation.includes(r.check));
 assert.equal(i.correct_answer,null);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(i.learning_goal,r.goal);assert.match(i.prompt,i.cefr_level==='A2'?/één korte reden/:/Bespreek|Leg .*uit|Vergelijk/);assert.equal(i.cefr_level,r.level);
 assert.ok(!i.feedback_incorrect.includes('Samenhangende eenvoudige informatie'));assert.ok(!i.title.includes('Welbevinden'));
 if(!old.model_answer)assert.equal(i.model_answer,'','No invented missing model '+id);if(i.model_answer)models++;if(i.model_answer!==old.model_answer)changedModels++;if(i.cefr_level!==old.cefr_level)changedLevels++;
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' historical '+key)}
 assert.equal(guidance.mapping(i,'erk').levels[0],i.cefr_level);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
}
assert.equal(models,0);assert.equal(changedModels,0);assert.equal(changedLevels,70);
assert.deepEqual(ids.reduce((a,id)=>(a[runtime.itemById(id).cefr_level]=(a[runtime.itemById(id).cefr_level]||0)+1,a),{}),{B1:74,A2:2,B2:57});
for(const oldBank of [source,direct,first,second,third,fourth,fifth,sixth,seventh,eighth,ninth,tenth,eleventh,twelfth,thirteenth,previous]){
 const old=createContentRuntime(oldBank,meta);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const seeds={};for(const level of ['A1','A2','B1','B2'])seeds[level]=old.createSession({filters:{topics:['quick-choose'],levels:[level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});
  for(const id of ids){const i=old.itemById(id),saved={...seeds[i.cefr_level],selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const preRefs=structuredClone(saved);delete preRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(preRefs)),i);}
 }
}
const get=n=>runtime.itemById('sq-'+n.replace('-','-triangle-'));
assert.match(get('r5-007').context,/wel e-mail/);assert.match(get('r5-007').prompt,/direct beschikbaar/);
assert.match(get('r5-053').context,/niet samen gemeten/);assert.match(get('r5-053').prompt,/nog niet vaststaat/);
assert.match(get('r5-083').context,/als steunpersoon/);assert.match(get('r5-092').explanation,/huidige rekening/);
assert.match(get('r5-113').explanation,/niet kleiner/);assert.match(get('r5-117').context,/nog niets gekocht/);
assert.equal(get('r5-117').practice_group,get('r3-117').practice_group);
for(const id of ids){const i=runtime.itemById(id),lesson=require('../data/content-guidance.js').bindings[id].lesson;assert.equal(lesson.activity,'Kies');assert.match(lesson.help,i.cefr_level==='B1'?/beide keuzes bespreken/:i.cefr_level==='B2'?/belangen, betekenis of onzekerheid/:/één korte reden/);assert.match(lesson.next,/Beide opties zijn mogelijk/);assert.equal(i.options.length,0,'Open preference, not automatic quiz');assert.equal(runtime.compatibility(i,'QUIZ').compatible,false);assert.equal(i.model_answer,source.items.find(i=>i.content_item_id===id).model_answer);}
for(const level of ['A1','A2','B1','B2']){
 const filters={bank_ids:[bank.bank_id],topics:['quick-choose'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);
 assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);const groups=a.selected_item_ids.map(id=>runtime.itemById(id).practice_group);assert.equal(new Set(groups).size,groups.length);
}
assert.equal(bank.items.filter(i=>i.topic==='quick-choose'&&!i.version.includes('.kies.')).length,0);
assert.throws(()=>review.revise(source));
console.log('PASS final 133 Kies: 2 A2/74 B1/57 B2, 70 level changes, no invented models; 2488 other tasks unchanged; 6384 historical restores plus pre-ref sessions, individual guidance and three-engine parity; all 613 Kies reviewed.');
