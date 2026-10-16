const assert=require('node:assert/strict');
const source=require('../data/snelvragen-content.js'),review=require('../data/snelvragen-regel-afronding.js'),guidance=require('../content-guidance.js'),{createContentRuntime}=require('../content-runtime.js');
const historical=[source];
for(const file of ['review','vertel-review','vertel-vervolg','vertel-situaties','vertel-uitleg','vertel-afronding','vragen-review','vragen-vervolg','vragen-situaties','vragen-uitleg','vragen-afronding','kies-review','kies-vervolg','kies-situaties','kies-uitleg','kies-afronding','regel-review','regel-vervolg','regel-situaties','regel-uitleg','regel-afweging'])historical.push(require('../data/snelvragen-'+file+'.js').revise(historical.at(-1)));
const previous=historical.at(-1),snapshot=JSON.stringify(previous),bank=review.revise(previous),ids=Object.keys(review.reviews),idSet=new Set(ids),meta={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
assert.equal(historical.length,22);assert.equal(JSON.stringify(previous),snapshot);assert.deepEqual(ids,source.items.filter(i=>i.topic==='quick-arrange').slice(600).map(i=>i.content_item_id));assert.equal(ids.length,21);assert.equal(bank.items.length,2621);
assert.deepEqual(bank.items.filter(i=>!idSet.has(i.content_item_id)),previous.items.filter(i=>!idSet.has(i.content_item_id)),'Other 2600 reviewed tasks, unchanged');
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...meta,previousVersions:historical});for(const b of historical)guidance.registerHistorical(b);guidance.register(bank.guidance);guidance.complete(bank.items);
const a2=new Set(["dq_5_diamond_04", "dq_5_diamond_08", "dq_5_diamond_09", "dq_5_diamond_12"]);
const b2=new Set(["dq_6_diamond_01", "dq_6_diamond_05", "dq_6_diamond_08", "dq_6_diamond_13", "dq_6_diamond_14"]);
let models=0,changedModels=0;
for(const id of ids){
 const i=runtime.itemById(id),r=review.reviews[id],old=source.items.find(x=>x.content_item_id===id);
 assert.equal(i.version,review.version);assert.equal(i.topic,'quick-arrange');assert.equal(i.cefr_level,a2.has(id)?'A2':b2.has(id)?'B2':'B1');assert.equal(i.level_review.source_level,old.cefr_level);assert.ok(i.level_review.reason.includes(r.goal));
 assert.ok(i.context&&i.prompt&&i.explanation.includes(r.check));assert.equal(i.learning_goal,r.goal);assert.equal(i.feedback_incorrect,r.help);assert.ok(!i.title.includes('Welbevinden'));assert.doesNotMatch(i.context+' '+i.prompt+' '+i.explanation,/\bbuur\b/i);
 assert.equal(i.correct_answer,null);assert.equal(i.options.length,0);assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.equal(runtime.compatibility(i,'QUIZ').compatible,false);
 if(!old.model_answer)assert.equal(i.model_answer,'','No invented missing models');if(i.model_answer)models++;if(i.model_answer!==old.model_answer)changedModels++;
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key),id+' '+key);assert.ok(guidance.mapping(old,key),id+' old '+key)}
 assert.deepEqual(guidance.mapping(i,'erk').levels,[i.cefr_level]);assert.equal(guidance.mapping(i,'f').status,'lesson_use');assert.equal(guidance.mapping(i,'lowan').status,'lesson_use');
 const lesson=require('../data/content-guidance.js').bindings[id].lesson;assert.equal(lesson.activity,'Regel iets');assert.match(lesson.help,i.cefr_level==='B2'?/voorstel toelichten/:i.cefr_level==='B1'?/genoemde wensen/:/gevraagde gegevens/);assert.match(lesson.next,/onderhandeling of echte uitvoering is niet verplicht/);
}
assert.equal(models,21);assert.equal(changedModels,15);
for(const oldBank of historical){const old=createContentRuntime(oldBank,meta);for(const engine of ['CARDS','BOARD','WHEEL']){const seed=old.createSession({filters:{topics:['quick-arrange'],levels:['A1']},targetDurationSeconds:60,selectedGameEngine:engine,seed:3});for(const id of ids){const i=old.itemById(id),saved={...seed,selected_item_ids:[id],selected_content_refs:[old.contentRef(i)],actual_estimated_duration_seconds:i.estimated_duration_seconds};assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(saved)),i);const noRefs=structuredClone(saved);delete noRefs.selected_content_refs;assert.deepEqual(runtime.itemForSession(id,runtime.restoreSession(noRefs)),i);}}}
const get=id=>runtime.itemById(id);
assert.match(get('dq_5_diamond_05').context,/4 september/);assert.match(get('dq_5_diamond_09').model_answer,/half elf/);assert.match(get('dq_5_diamond_03').context,/tussen één en vier uur/);assert.match(get('dq_6_diamond_05').context,/oorzaak is nog onbekend/);assert.match(get('dq_6_diamond_14').model_answer,/andere programma-afspraken kunnen blijven/);
assert.equal(ids.filter(id=>get(id).cefr_level==='A2').length,4);assert.equal(ids.filter(id=>get(id).cefr_level==='B1').length,12);assert.equal(ids.filter(id=>get(id).cefr_level==='B2').length,5);assert.equal(ids.filter(id=>get(id).cefr_level!==source.items.find(i=>i.content_item_id===id).cefr_level).length,9);
for(const level of ['A2','B1','B2']){
const filters={bank_ids:[bank.bank_id],topics:['quick-arrange'],levels:[level]},base={filters,targetDurationSeconds:600,seed:24};assert.deepEqual(runtime.fullCoverageEngines(filters).sort(),['BOARD','CARDS','WHEEL']);const a=runtime.createSession({...base,selectedGameEngine:'CARDS'});for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...base,selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:engine}).selected_item_ids,a.selected_item_ids);assert.equal(new Set(a.selected_item_ids).size,a.selected_item_ids.length);
}
assert.equal(bank.items.filter(i=>i.topic==='quick-arrange'&&!i.version.includes('.regel.')).length,0);assert.throws(()=>review.revise(source));
console.log('PASS final 21 Regel iets: 4 A2 / 12 B1 / 5 B2; 9 revised levels; 21 existing models checked; other 2600 reviewed tasks unchanged; 1386 historical restores plus pre-ref sessions; all 2621 connected Snelvragen reviewed.');
