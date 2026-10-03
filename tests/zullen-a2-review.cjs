const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.zullenA2,version:api.zullenA2Version},{createContentRuntime}=require('../content-runtime.js');
const previous=review.b1Rest(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'51f0f33db2beaf4852eb1327e14c22fe97b5ed4fa297d615dc08dd8aeb25ca1a');assert.equal(hash(bank.items),bank.source_sha256);
const history=[original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),review.reporting(original),review.argument(original),review.probability(original),review.expectation(original),review.certainty(original),review.deliberation(original),review.boundary(original),review.past(original),review.message(original),review.inference(original),review.opinion(original),review.consequence(original),review.a2Basis(original),review.mixed(original),previous];
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:history}),set=bank.items.filter(i=>i.version===review.version),filters=[{topics:['ZULLEN'],levels:['A2'],language_functions:['voorstel','aanbod','belofte','voorspelling']}];
assert.equal(current.contentRef(current.itemById('ZULLEN_A2_001')).source_version,review.version);
assert.equal(set.length,120);assert.deepEqual(['A2','B1'].map(l=>set.filter(i=>i.cefr_level===l).length),[120,0]);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'A2');assert.equal(item.cefr_level,item.level_review.level);assert.ok(item.context.length>30);assert.ok(item.explanation.trim());
 assert.doesNotMatch(item.prompt,/presentatief|functie van er|richtingconstructie|zelfstandig naamwoord/);
 if(item.exercise_type==='invullen'){assert.match(item.prompt,/^Vul zal of zullen in:/);assert.ok(['zal','zullen'].includes(item.correct_answer.toLowerCase()));}
 if(item.options.length){assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));assert.ok(item.options.every(o=>o[0]===o[0].toUpperCase()));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(item.prompt,/Begin met/);}
 if(item.exercise_type==='dialoog_aanvullen')assert.match(item.prompt,/\n[^\n]+: ‘[^’]+’\nJij: …/);
}
const mc=set.filter(i=>i.options.length);assert.equal(mc.length,40);assert.deepEqual([0,1,2].map(n=>mc.filter(i=>i.options.indexOf(i.correct_answer)===n).length),[14,13,13]);assert.equal(new Set(set.filter(i=>i.exercise_type==='betekenis_kiezen').map(i=>i.model_answer)).size,20);assert.equal(require('../match-pair-contract.js').audit(set).pairs.length,24);
assert.equal(current.filterSource({topics:['ZULLEN'],levels:['A2']}).length,150);assert.equal(current.filterSource({levels:['B2']}).length,38);
for(const source of history)for(const filter of filters){
 const old=createContentRuntime(source,{familyId:'grammar'});
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE','SORT']){
  const f=engine==='SORT'?{...filter,exercise_types:['functie_sorteren']}:filter,pool=old.filterSource(f).filter(i=>set.some(x=>x.content_item_id===i.content_item_id)),base=old.createSession({filters:f,targetDurationSeconds:pool.reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine}),session={...base,selected_item_ids:pool.map(i=>i.content_item_id),selected_content_refs:pool.map(i=>old.contentRef(i))};
  assert.equal(session.selected_item_ids.length,engine==='SORT'?8:120);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
 const saved=old.specFromFilters({...filter,exercise_types:['invullen']}),updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,filter.levels);assert.equal(current.selectionPool(updated).length,12);
}
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,[item.cefr_level]);assert.ok(b.erk.evidence.includes('bronlabel '+item.source_ref.original_cefr_level));assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
console.log('PASS 120 Zullen A2: concrete situations, eight dialogues, twenty meanings, 24 closed pairs, lesson guidance, other 1320 unchanged and twenty-one historical versions restored including sorting.');
