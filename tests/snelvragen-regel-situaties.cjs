const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),review=require('../data/snelvragen-regel-situaties.js'),guidance=require('../content-guidance.js'),{createContentRuntime}=require('../content-runtime.js');
const historical=[source];
for(const file of ['review','vertel-review','vertel-vervolg','vertel-situaties','vertel-uitleg','vertel-afronding','vragen-review','vragen-vervolg','vragen-situaties','vragen-uitleg','vragen-afronding','kies-review','kies-vervolg','kies-situaties','kies-uitleg','kies-afronding','regel-review','regel-vervolg'])historical.push(require('../data/snelvragen-'+file+'.js').revise(historical.at(-1)));
const previous=historical.at(-1),snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.equal(historical.length,19);assert.equal(JSON.stringify(previous),snapshot);assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-arrange').slice(240,360).map(i=>i.content_item_id));assert.equal(ids.length,120);assert.equal(bank.items.length,2621);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'Other 2501 tasks, including 2240 reviewed, unchanged');
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:historical});for(const b of historical)guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
const a2=new Set(['004','012','014','031','035','036','037','050','053','059','061','069','073','075','080','081','086','092','095','096','099','100','116','121','123'].map(n=>'sq-r2-diamond-'+n));
let models=0,changedModels=0;
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=source.items.find(x=>x.content_item_id===id);
 assert.equal(i.version,review.version);assert.equal(i.topic,'quick-arrange');assert.equal(i.cefr_level,a2.has(id)?'A2':'A1');assert.equal(i.level_review.source_level,old.cefr_level);assert.ok(i.level_review.reason.includes(r.goal));
 assert.ok(i.context&&i.prompt&&i.explanation.includes(r.check));assert.equal(i.learning_goal,r.goal);assert.equal(i.feedback_incorrect,r.help);assert.ok(!i.title.includes('Welbevinden'));assert.doesNotMatch(i.context+' '+i.prompt+' '+i.explanation,/\bbuur\b/i);
 assert.equal(i.correct_answer,null);assert.equal(i.options.length,0);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(runtime.compatibility(i,'QUIZ').compatible,false);
 if(!old.model_answer)assert.equal(i.model_answer,'','No invented missing models');if(i.model_answer)models++;if(i.model_answer!==old.model_answer)changedModels++;
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' old '+key)}
 assert.deepEqual(guidance.mapping(i,'erk').levels,[i.cefr_level]);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
 const lesson=require('../data/content-guidance.js').bindings[id].lesson;assert.equal(lesson.activity,'Regel iets');assert.match(lesson.help,i.cefr_level==='A1'?/één korte passende reactie/:/gevraagde gegevens/);assert.match(lesson.next,/onderhandeling of echte uitvoering is niet verplicht/);
}
assert.equal(models,3);assert.equal(changedModels,0);
for(const oldBank of historical){const old=createContentRuntime(oldBank,meta);for(const engine of ['CARDS','BOARD','WHEEL']){const seed=old.createSession({filters:{topics:['quick-arrange'],levels:['A1']},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});for(const id of ids){const i=old.itemById(id),saved={...seed,selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const noRefs=structuredClone(saved);delete noRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(noRefs)),i);}}}
const get=n=>runtime.itemById('sq-'+n.replace('-','-diamond-'));
assert.match(get('r2-036').context,/twintig minuten/);assert.match(get('r2-054').context,/plakband/);assert.match(get('r2-075').context,/drie uur/);assert.match(get('r2-081').context,/elf uur/);assert.match(get('r2-113').context,/vier uur/);assert.match(get('r2-123').context,/ophangen/);
assert.equal(ids.filter(id=>bank.items.find(i=>i.content_item_id===id).cefr_level==='A1').length,95);
for(const level of ['A1','A2']){
const filters={bank_ids:[bank.bank_id],topics:['quick-arrange'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);
}
assert.equal(bank.items.filter(i=>i.topic==='quick-arrange'&&!i.version.includes('.regel.')).length,261);assert.throws(()=>review.revise(source));
console.log('PASS third 120 Regel iets: 95 A1 / 25 A2; 95 level changes; 3 unchanged models, 117 without invented models; 2501 other tasks unchanged; 6840 historical restores plus pre-ref sessions, four lesson links and three-engine parity.');
