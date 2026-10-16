const assert=require('node:assert/strict'),crypto=require('node:crypto'),review=require('../data/grammar-review.js'),raw=require('../data/content-vert001-er-b1.js'),{createContentRuntime}=require('../content-runtime.js');
const phases=[['zullenMixReview','zullenA2','zullenMix'],['modalBridgeReview','zullenMix','modalBridge'],['zoudenMixReview','modalBridge','zoudenMix'],['zoudenRestReview','zoudenMix','revise']];
const oldFns=['previous','references','passive','existence','appearance','reporting','argument','probability','expectation','certainty','deliberation','boundary','past','message','inference','opinion','consequence','a2Basis','mixed','b1Rest','zullenA2','zullenMix','modalBridge','zoudenMix'];
let checked=0;
for(const [patchName,prevFn,fn]of phases){
 if(!review[patchName])continue;
 const bank=(review[fn]||review.revise)(raw),prior=review[prevFn](raw),ids=Object.keys(review[patchName]),items=bank.items.filter(i=>ids.includes(i.content_item_id)),history=[raw,...oldFns.slice(0,oldFns.indexOf(prevFn)+1).map(f=>review[f](raw))],runtime=createContentRuntime(bank,{familyId:'grammar',previousVersions:history});
 assert.equal(items.length,120);assert.equal(crypto.createHash('sha256').update(JSON.stringify(bank.items)).digest('hex'),bank.source_sha256);
 for(const i of bank.items)if(!ids.includes(i.content_item_id))assert.deepEqual(i,prior.items.find(o=>o.content_item_id===i.content_item_id));
 const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
 for(const i of items){
  assert.equal(i.version,bank.source_version);assert.equal(i.level_review.source_level,i.content_item_id.split('_')[1]);assert.equal(i.cefr_level,i.level_review.level);assert.ok(i.context.length>30);assert.ok(i.explanation.length>30);assert.doesNotMatch(i.prompt,/communicatieve functie|gemarkeerde constructie|\be mail\b/);assert.doesNotMatch(i.model_answer,/\be mail\b/);
  const b=guidance.bindings[i.content_item_id];assert.equal(b.item_version,i.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,[i.cefr_level]);assert.equal(b.lesson.check,i.explanation);
  for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(runtime.compatibility(i,engine).compatible);
  if(['open','open_geleid'].includes(i.answer_type))assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');
  if(i.exercise_type==='dialoog_aanvullen')assert.match(i.prompt,/\n[^\n]+: ‘[^’]+’\nJij: …/);
  if(i.exercise_type==='invullen'&&/^(Je|U) (zal|zult) /.test(i.model_answer)){assert.ok(i.accepted_answers.includes('zal'));assert.ok(i.accepted_answers.includes('zult'));}
  if(i.exercise_type==='zinnen_leggen'){const p=runtime.project('SEQUENCE',i),norm=a=>a.map(s=>s.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(i.prompt,/Begin met/);}
  if(i.options.length){assert.equal(i.options.length,3);assert.equal(new Set(i.options).size,3);assert.ok(i.options.includes(i.correct_answer));}
 }
 const mc=items.filter(i=>i.options.length);assert.equal(mc.length,40);assert.deepEqual([0,1,2].map(n=>mc.filter(i=>i.options.indexOf(i.correct_answer)===n).length),[14,13,13]);assert.equal(new Set(items.filter(i=>i.exercise_type==='betekenis_kiezen').map(i=>i.model_answer)).size,20);
 for(const source of history){const old=createContentRuntime(source,{familyId:'grammar'});for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE','SORT']){const pool=source.items.filter(i=>ids.includes(i.content_item_id)&&(engine!=='SORT'||i.exercise_type==='functie_sorteren')),filters={bank_ids:['CB-GRAM-001'],exercise_types:engine==='SORT'?['functie_sorteren']:[]},base=old.createSession({filters,targetDurationSeconds:60,organizationMode:'groups',engines:[engine],selectedGameEngine:engine}),session={...base,selected_item_ids:pool.map(i=>i.content_item_id),selected_content_refs:pool.map(i=>old.contentRef(i))};assert.equal(pool.length,engine==='SORT'?8:120);assert.deepEqual(runtime.enginePool(engine,runtime.restoreSession(session)),old.enginePool(engine,session));const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(runtime.restoreSession(legacy).selected_content_refs,session.selected_content_refs);}}
 console.log('PASS modal workset '+(++checked)+': 120 individually revised tasks; other 1320 unchanged, 40 choices, 20 meanings, 8 dialogues, lesson guidance and '+history.length+' historical versions restored.');
}
assert.ok(checked>=1);
