const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.certainty,version:api.certaintyVersion},{createContentRuntime}=require('../content-runtime.js');
const previous=review.expectation(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'149c8ca9303ce25b15ec15b43e687bd32d3d0210da3eba09c497815b4a88080d');assert.equal(hash(bank.items),bank.source_sha256);
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:[original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),review.reporting(original),review.argument(original),review.probability(original),previous]});
const set=bank.items.filter(i=>i.version===review.version);assert.equal(set.length,30);assert.equal(set.filter(i=>i.cefr_level==='B1').length,30);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'B2');assert.equal(item.level_review.level,'B1');assert.equal(item.language_function,'nuance');
 assert.ok(item.context.length>30);assert.ok(item.explanation.length>90);assert.doesNotMatch(item.explanation,/maak duidelijk waar het naar verwijst/);
 if(item.exercise_type==='invullen'){assert.match(item.prompt,/Vul zal of zullen in/);assert.ok(item.accepted_answers.includes('zal'));assert.equal(item.correct_answer,'zal');}
 if(item.options.length){assert.equal(item.options.length,3);assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));assert.ok(item.options.every(o=>o[0]===o[0].toUpperCase()));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(item.prompt,/Begin met/);}
}
for(const [id,pattern] of [['067',/kassa.*vlotter/],['078',/wegvallen van de buslijn/],['079',/herhaalde vertraging/],['081',/Of dit rooster beter werkt/],['083',/voorkeur voor online les/],['090',/verschillende wensen.*zullen wel/]])assert.match(current.itemById('ZULLEN_B2_'+id).model_answer,pattern);
for(const [id,pattern] of [['061',/afwijzend/],['068',/heffen elkaar niet op/],['071',/niet dat je toestemming/],['085',/wissel is goedgekeurd/],['086',/vervangt geen controle/]])assert.match(current.itemById('ZULLEN_B2_'+id).explanation,pattern);
const mc=set.filter(i=>i.options.length);assert.equal(mc.length,10);assert.deepEqual([0,1,2].map(n=>mc.filter(i=>i.options.indexOf(i.correct_answer)===n).length),[4,3,3]);assert.equal(new Set(set.filter(i=>i.exercise_type==='betekenis_kiezen').map(i=>i.model_answer)).size,5);
assert.equal(current.filterSource({topics:['ZULLEN'],levels:['B1']}).length,240);assert.equal(current.filterSource({levels:['B2']}).length,218);
assert.equal(require('../match-pair-contract.js').audit(set).pairs.length,6);
for(const source of [original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),review.reporting(original),review.argument(original),review.probability(original),previous]){
 const old=createContentRuntime(source,{familyId:'grammar'}),filters={topics:['ZULLEN'],levels:['B2'],language_functions:['nuance']};
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  const session=old.createSession({filters,targetDurationSeconds:old.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine});
  assert.equal(session.selected_item_ids.length,30);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));
  const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
 const saved=old.specFromFilters({...filters,exercise_types:['invullen']}),updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,['B1']);assert.deepEqual(current.selectionPool(updated).map(i=>i.content_item_id).sort(),['ZULLEN_B2_062','ZULLEN_B2_074','ZULLEN_B2_086']);
}
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,['B1']);assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
console.log('PASS 30 certainty Zullen tasks: concrete context, B1 advice, no answer leaks, six closed pairs, grammar/meaning repairs, other 1410 unchanged and ten historical versions restored across five engines.');
