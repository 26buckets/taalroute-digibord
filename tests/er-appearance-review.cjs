const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.appearance,version:api.appearanceVersion},{createContentRuntime}=require('../content-runtime.js');
const previous=review.existence(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'329ee67c532d1c770f4ccea83de24f6d294d0fc575567836bbf7a12803901b4b');assert.equal(hash(bank.items),bank.source_sha256);
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:[original,review.previous(original),review.references(original),review.passive(original),previous]});
const set=bank.items.filter(i=>i.version===review.version);assert.equal(set.length,30);assert.equal(set.filter(i=>i.cefr_level==='B1').length,30);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'B2');assert.equal(item.level_review.level,'B1');assert.equal(item.language_function,'blijken_lijken');
 assert.ok(item.context.length>30);assert.ok(item.explanation.length>90);assert.doesNotMatch(item.explanation,/maak duidelijk waar het naar verwijst/);
 if(item.exercise_type==='invullen'){assert.doesNotMatch(item.prompt,/Vul er in/);assert.ok(item.accepted_answers.includes('Er'));assert.equal(item.correct_answer,'Er');}
 if(item.options.length){assert.equal(item.options.length,3);assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));assert.ok(item.options.every(o=>o[0]===o[0].toUpperCase()));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(item.prompt,/Begin met/);}
}
for(const [id,pattern] of [['070',/niet meer dan de helft/],['078',/in dit overzicht.*niet meer ziekmeldingen/],['079',/vandaag één verkoper/],['081',/de meeste deelnemers/],['083',/in dit overleg.*bezwaren te zijn gemaakt/],['090',/in het verslag.*keuze/]])assert.match(current.itemById('ER_B2_'+id).model_answer,pattern);
assert.doesNotMatch(current.itemById('ER_B2_078').model_answer,/geen verband/);assert.match(current.itemById('ER_B2_090').explanation,/wel een besluit/);
assert.equal(current.filterSource({topics:['ER'],levels:['B1']}).length,292);assert.equal(current.filterSource({levels:['B2']}).length,368);
assert.equal(require('../match-pair-contract.js').audit(set).pairs.length,6);
for(const source of [original,review.previous(original),review.references(original),review.passive(original),previous]){
 const old=createContentRuntime(source,{familyId:'grammar'}),filters={topics:['ER'],levels:['B2'],language_functions:['blijken_lijken']};
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  const session=old.createSession({filters,targetDurationSeconds:old.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine});
  assert.equal(session.selected_item_ids.length,30);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));
  const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
 const saved=old.specFromFilters({...filters,exercise_types:['invullen']}),updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,['B1']);assert.deepEqual(current.selectionPool(updated).map(i=>i.content_item_id).sort(),['ER_B2_062','ER_B2_074','ER_B2_086']);
}
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,['B1']);assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
console.log('PASS 30 appearance Er tasks: concrete context, B1 advice, no answer leaks, six closed pairs, grammar/meaning repairs, other 1410 unchanged and five historical versions restored across five engines.');
