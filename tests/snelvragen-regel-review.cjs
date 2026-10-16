const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),review=require('../data/snelvragen-regel-review.js'),guidance=require('../content-guidance.js'),{createContentRuntime}=require('../content-runtime.js');
const historical=[source];
for(const file of ['review','vertel-review','vertel-vervolg','vertel-situaties','vertel-uitleg','vertel-afronding','vragen-review','vragen-vervolg','vragen-situaties','vragen-uitleg','vragen-afronding','kies-review','kies-vervolg','kies-situaties','kies-uitleg','kies-afronding'])historical.push(require('../data/snelvragen-'+file+'.js').revise(historical.at(-1)));
const previous=historical.at(-1),snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.equal(historical.length,17);assert.equal(JSON.stringify(previous),snapshot);assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-arrange').slice(0,120).map(i=>i.content_item_id));assert.equal(ids.length,120);assert.equal(bank.items.length,2621);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'Other 2501 tasks, including 2000 reviewed, unchanged');
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:historical});for(const b of historical)guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
let models=0,changedModels=0;
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=source.items.find(x=>x.content_item_id===id);
 assert.equal(i.version,review.version);assert.equal(i.topic,'quick-arrange');assert.equal(i.cefr_level,'A1');assert.equal(i.level_review.source_level,old.cefr_level);assert.ok(i.level_review.reason.includes(r.goal));
 assert.ok(i.context&&i.prompt&&i.explanation.includes(r.check));assert.equal(i.learning_goal,r.goal);assert.equal(i.feedback_incorrect,r.help);assert.ok(!i.title.includes('Welbevinden'));assert.doesNotMatch(i.context+' '+i.prompt+' '+i.explanation,/\bbuur\b/i);
 assert.equal(i.correct_answer,null);assert.equal(i.options.length,0);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(runtime.compatibility(i,'QUIZ').compatible,false);
 if(!old.model_answer)assert.equal(i.model_answer,'','No invented missing models');if(i.model_answer)models++;if(i.model_answer!==old.model_answer)changedModels++;
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' old '+key)}
 assert.deepEqual(guidance.mapping(i,'erk').levels,['A1']);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
 const lesson=require('../data/content-guidance.js').bindings[id].lesson;assert.equal(lesson.activity,'Regel iets');assert.match(lesson.help,/één korte passende reactie/);assert.match(lesson.next,/reden of echt uitgevoerde handeling is niet verplicht/);
}
assert.equal(models,22);assert.equal(changedModels,2);
for(const oldBank of historical){const old=createContentRuntime(oldBank,meta);for(const engine of ['CARDS','BOARD','WHEEL']){const seed=old.createSession({filters:{topics:['quick-arrange'],levels:['A1']},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});for(const id of ids){const i=old.itemById(id),saved={...seed,selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const noRefs=structuredClone(saved);delete noRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(noRefs)),i);}}}
const get=n=>runtime.itemById('sq-'+n.replace('-','-diamond-'));
assert.match(get('r0-039').context,/naar Utrecht/);assert.match(get('r0-040').context,/klem/);assert.match(get('r0-062').context,/buurman/);assert.match(get('r0-064').context,/buurvrouw/);assert.match(get('r0-095').context,/ieder je eigen deel/);assert.match(get('r0-120').context,/boek/);assert.match(get('r1-005').context,/Jij en een nieuwe cursist/);
assert.equal(get('r0-081').model_answer,'Mag ik even pauze nemen?');assert.equal(get('r0-121').model_answer,'Zullen we samen ontbijten?');
assert.equal(get('r0-019').practice_group,get('r0-017').practice_group);assert.equal(get('r0-039').practice_group,get('r0-038').practice_group);
const filters={bank_ids:[bank.bank_id],topics:['quick-arrange'],levels:['A1']},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);
assert.equal(bank.items.filter(i=>i.topic==='quick-arrange'&&!i.version.includes('.regel.')).length,501);assert.throws(()=>review.revise(source));
console.log('PASS first 120 Regel iets: all A1, 22 existing models (2 clarified), 98 without invented models; other 2501 unchanged; 6120 historical restores plus pre-ref sessions, four lesson links, concrete requests/offers and three-engine parity.');
