const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.argument,version:api.argumentVersion},{createContentRuntime}=require('../content-runtime.js');
const previous=review.reporting(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'b6b3d74f1cd31f38fed8738e76c6f49f17ef4880f656bb1002c1ee17ad21c1ad');assert.equal(hash(bank.items),bank.source_sha256);
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:[original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),previous]});
const set=bank.items.filter(i=>i.version===review.version);assert.equal(set.length,30);assert.equal(set.filter(i=>i.cefr_level==='B1').length,30);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'B2');assert.equal(item.level_review.level,'B1');assert.equal(item.language_function,'register_en_argumentatie');
 assert.ok(item.context.length>30);assert.ok(item.explanation.length>90);assert.doesNotMatch(item.explanation,/maak duidelijk waar het naar verwijst/);
 if(item.exercise_type==='invullen'){assert.doesNotMatch(item.prompt,/Vul er in/);assert.ok(item.accepted_answers.includes('Er'));assert.equal(item.correct_answer,'Er');}
 if(item.options.length){assert.equal(item.options.length,3);assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));assert.ok(item.options.every(o=>o[0]===o[0].toUpperCase()));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(item.prompt,/Begin met/);}
}
for(const [id,pattern] of [['157',/vanaf het station/],['159',/cijfers of ervaringen.*kortere pauze/],['161',/andere 97/],['168',/0,1 punt.*groep B/],['169',/mogelijk vaker laat/],['170',/Er zijn veel voordelen aan een extra proefperiode/],['173',/acht van de tweehonderd/],['180',/hogere prijs, de werkzaamheden of beide/]])assert.match(current.itemById('ER_B2_'+id).model_answer,pattern);
assert.match(current.itemById('ER_B2_153').prompt,/eindig met ‘tegen de nadelen’/);assert.match(current.itemById('ER_B2_165').prompt,/eindig met ‘op langere termijn dalen’/);assert.match(current.itemById('ER_B2_177').prompt,/Begin met ‘Er kan worden betoogd dat meer transparantie’/);
assert.match(current.itemById('ER_B2_168').context,/van 1 tot 10/);assert.match(current.itemById('ER_B2_175').explanation,/ook niet dat de lessen geen invloed/);
assert.deepEqual(current.itemById('ER_B2_152').accepted_answers,['Er','Daar','Hier']);assert.deepEqual(current.itemById('ER_B2_164').accepted_answers,['Er','Hier','Daar']);assert.deepEqual(current.itemById('ER_B2_176').accepted_answers,['Er','Het']);assert.match(current.itemById('ER_B2_176').model_answer,/Er kan niet worden uitgesloten/);
assert.equal(current.filterSource({topics:['ER'],levels:['B1']}).length,352);assert.equal(current.filterSource({levels:['B2']}).length,308);
assert.equal(require('../match-pair-contract.js').audit(set).pairs.length,6);
for(const source of [original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),previous]){
 const old=createContentRuntime(source,{familyId:'grammar'}),filters={topics:['ER'],levels:['B2'],language_functions:['register_en_argumentatie']};
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  const session=old.createSession({filters,targetDurationSeconds:old.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine});
  assert.equal(session.selected_item_ids.length,30);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));
  const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
 const saved=old.specFromFilters({...filters,exercise_types:['invullen']}),updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,['B1']);assert.deepEqual(current.selectionPool(updated).map(i=>i.content_item_id).sort(),['ER_B2_152','ER_B2_164','ER_B2_176']);
}
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,['B1']);assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
console.log('PASS 30 argument Er tasks: concrete context, B1 advice, no answer leaks, six closed pairs, grammar/meaning repairs, other 1410 unchanged and seven historical versions restored across five engines.');
