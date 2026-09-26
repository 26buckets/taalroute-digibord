const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.consequence,version:api.consequenceVersion},{createContentRuntime}=require('../content-runtime.js');
const previous=review.opinion(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'ee52da785157c935075263511b685f66cda0fe80291b904fb176aea92fc4408f');assert.equal(hash(bank.items),bank.source_sha256);
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:[original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),review.reporting(original),review.argument(original),review.probability(original),review.expectation(original),review.certainty(original),review.deliberation(original),review.boundary(original),review.past(original),review.message(original),review.inference(original),previous]});
const set=bank.items.filter(i=>i.version===review.version);assert.equal(set.length,30);assert.equal(set.filter(i=>i.cefr_level==='B1').length,30);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'B2');assert.equal(item.level_review.level,'B1');assert.equal(item.language_function,'hypothetische_consequentie');
 assert.ok(item.context.length>30);assert.ok(item.explanation.length>90);assert.doesNotMatch(item.explanation,/maak duidelijk waar het naar verwijst/);
 if(item.exercise_type==='invullen'){assert.match(item.prompt,/Vul zou of zouden in/);const expected='zou';assert.ok(item.accepted_answers.includes(expected));assert.equal(item.correct_answer,expected);}
 if(item.options.length){assert.equal(item.options.length,3);assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));assert.ok(item.options.every(o=>o[0]===o[0].toUpperCase()));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(item.prompt,/Begin met/);}
}
for(const [id,pattern] of [['128',/al een mogelijkheid/],['134',/niet vanzelf/],['136',/garanderen geen instemming/],['142',/zonder dat de dienstverlening/],['149',/niet alle activiteiten/]])assert.match(current.itemById('ZOUDEN_B2_'+id).explanation,pattern);
assert.match(current.itemById('ZOUDEN_B2_131').model_answer,/extra lesgroep/);
assert.match(current.itemById('ZOUDEN_B2_134').model_answer,/betrouwbaardere gegevens/);
assert.doesNotMatch(current.itemById('ZOUDEN_B2_144').model_answer,/wegjagen/);
assert.equal(current.filterSource({topics:['ZOUDEN'],levels:['B1']}).length,270);
const mc=set.filter(i=>i.options.length);assert.equal(mc.length,10);assert.deepEqual([0,1,2].map(n=>mc.filter(i=>i.options.indexOf(i.correct_answer)===n).length),[4,3,3]);assert.equal(new Set(set.filter(i=>i.exercise_type==='betekenis_kiezen').map(i=>i.model_answer)).size,5);
assert.equal(current.filterSource({topics:['ZOUDEN'],levels:['B2']}).length,30);assert.equal(current.filterSource({levels:['B2']}).length,38);
assert.equal(require('../match-pair-contract.js').audit(set).pairs.length,6);
for(const source of [original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),review.reporting(original),review.argument(original),review.probability(original),review.expectation(original),review.certainty(original),review.deliberation(original),review.boundary(original),review.past(original),review.message(original),review.inference(original),previous]){
 const old=createContentRuntime(source,{familyId:'grammar'}),filters={topics:['ZOUDEN'],levels:['B2'],language_functions:['hypothetische_consequentie']};
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  const session=old.createSession({filters,targetDurationSeconds:old.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine});
  assert.equal(session.selected_item_ids.length,30);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));
  const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
 const saved=old.specFromFilters({...filters,exercise_types:['invullen']}),updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,['B1']);assert.deepEqual(current.selectionPool(updated).map(i=>i.content_item_id).sort(),['ZOUDEN_B2_122','ZOUDEN_B2_134','ZOUDEN_B2_146']);
}
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,['B1']);assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
console.log('PASS 30 possible-consequence Zouden tasks: concrete context, B1 advice, no answer leaks, six closed pairs, grammar/meaning repairs, other 1410 unchanged and seventeen historical versions restored across five engines.');
