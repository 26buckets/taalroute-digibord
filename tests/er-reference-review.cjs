const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.references,version:api.referenceVersion},{createContentRuntime}=require('../content-runtime.js');
const previous=review.previous(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'7377f6eb72b60a1354639806159145a73b60e3c0fb31a7659697d2b0eb300619','Retained repair must not change');assert.equal(hash(bank.items),bank.source_sha256);
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:[original,previous]});
const set=bank.items.filter(i=>i.version===review.version);assert.equal(set.length,30);assert.equal(set.filter(i=>i.cefr_level==='B1').length,22);assert.equal(set.filter(i=>i.cefr_level==='B2').length,8);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);
 if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'B2');assert.equal(item.level_review.level,item.cefr_level);
 assert.ok(item.context.length>25);assert.ok(item.explanation.length>90);assert.doesNotMatch(item.learning_goal,/complex voornaamwoordelijk|op niveau B2/);
 assert.equal(item.language_function,'complex_voornaamwoordelijk_bijwoord');
 if(item.exercise_type==='invullen'){assert.doesNotMatch(item.prompt,/Vul er in/);assert.ok(item.accepted_answers.includes('er'));}
 if(item.options.length){assert.equal(item.options.length,3);assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));}
}
assert.match(current.itemById('ER_B2_113').model_answer,/niet werken/);assert.doesNotMatch(current.itemById('ER_B2_113').model_answer,/niet.*deelnemen|niet.*komen/);
assert.match(current.itemById('ER_B2_097').context,/niet of iedereen op tijd/);assert.match(current.itemById('ER_B2_111').context,/kasten voor de nooduitgang/);
assert.match(current.itemById('ER_B2_106').model_answer,/er ook van af/);assert.doesNotMatch(current.itemById('ER_B2_106').accepted_answers.join(' '),/vanaf/);
assert.equal(current.itemById('ER_B2_110').model_answer,'We moeten er samen uit komen.');
assert.equal(current.itemById('ER_B2_096').practice_group,current.itemById('ER_B2_113').practice_group);
assert.equal(current.filterSource({topics:['ER'],levels:['B1']}).length,202);assert.equal(current.filterSource({levels:['B2']}).length,458);
for(const source of [original,previous]){
 const old=createContentRuntime(source,{familyId:'grammar'});
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  const session=old.createSession({filters:{topics:['ER'],levels:['B2'],language_functions:['complex_voornaamwoordelijk_bijwoord']},targetDurationSeconds:old.filterSource({topics:['ER'],levels:['B2'],language_functions:['complex_voornaamwoordelijk_bijwoord']}).reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine});
  assert.equal(session.selected_item_ids.length,30);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));
  const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
}
const priorRuntime=createContentRuntime(previous,{familyId:'grammar'});
const saved=priorRuntime.specFromFilters({topics:['ER'],levels:['B2'],language_functions:['complex_voornaamwoordelijk_bijwoord'],exercise_types:['invullen']});
const updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,['B1']);assert.deepEqual(current.selectionPool(updated).map(i=>i.content_item_id).sort(),['ER_B2_092','ER_B2_104','ER_B2_116']);
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,[item.cefr_level]);assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
console.log('PASS 30 Er tasks: 22 B1/8 B2, explicit goals and explanations, no fill-answer leak, logic repairs, all other 1410 unchanged, both previous versions restored across five engines, level-bound lesson guidance.');
