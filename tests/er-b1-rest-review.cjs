const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),api=require('../data/grammar-review.js'),review={...api,revise:api.b1Rest,version:api.b1RestVersion},{createContentRuntime}=require('../content-runtime.js');
const previous=review.mixed(original),bank=review.revise(original),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
assert.equal(hash(previous.items),'17a3e28323b06ea85e57d701c553a6d71da44a3eff3a926c1a392de70a7205aa');assert.equal(hash(bank.items),bank.source_sha256);
const history=[original,review.previous(original),review.references(original),review.passive(original),review.existence(original),review.appearance(original),review.reporting(original),review.argument(original),review.probability(original),review.expectation(original),review.certainty(original),review.deliberation(original),review.boundary(original),review.past(original),review.message(original),review.inference(original),review.opinion(original),review.consequence(original),review.a2Basis(original),previous];
const current=createContentRuntime(bank,{familyId:'grammar',previousVersions:history}),set=bank.items.filter(i=>i.version===review.version),filters=[{topics:['ER'],levels:['B1'],language_functions:['hoeveelheid','passief_onpersoonlijk','woordvolgorde','functieonderscheid']}];
assert.equal(current.contentRef(current.itemById('ER_A2_121')).source_version,review.version);
assert.equal(set.length,120);assert.deepEqual(['A2','B1'].map(l=>set.filter(i=>i.cefr_level===l).length),[34,86]);
for(const item of bank.items){
 const old=previous.items.find(i=>i.content_item_id===item.content_item_id);if(!set.includes(item)){assert.deepEqual(item,old);continue}
 assert.equal(item.source_ref.original_cefr_level,'B1');assert.equal(item.cefr_level,item.level_review.level);assert.ok(item.context.length>30);assert.ok(item.explanation.trim());
 assert.doesNotMatch(item.prompt,/presentatief|functie van er|richtingconstructie|zelfstandig naamwoord/);
 if(item.exercise_type==='invullen'){const word=item.content_item_id==='ER_B1_104'?'samengewerkt':item.prompt.match(/^Vul er in:/)&&'er';assert.ok(word);assert.equal(item.correct_answer.toLowerCase(),word);}
 if(item.options.length){assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer));assert.ok(item.options.every(o=>o[0]===o[0].toUpperCase()));}
 if(['open','open_geleid'].includes(item.answer_type))assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.ok(current.compatibility(item,engine).compatible);
 if(item.exercise_type==='zinnen_leggen'){const p=current.project('SEQUENCE',item),norm=xs=>xs.map(x=>x.toLowerCase().replace(/[.!?]/g,'')).sort();assert.deepEqual(norm(p.orderTokens),norm(p.orderExpectedTokens));assert.match(item.prompt,/Begin met/);}
 if(item.exercise_type==='dialoog_aanvullen')assert.match(item.prompt,/\n[^\n]+: ‘[^’]+’\nJij: …/);
}
assert.match(current.itemById('ER_B1_104').prompt,/vorm van samenwerken/);assert.match(current.itemById('ER_B1_168').context,/vrijdag/);assert.match(current.itemById('ER_B1_152').explanation,/verwijst.*over/);assert.equal(current.itemById('ER_B1_118').model_answer,'Hier wordt er af en toe gerookt.');
const mc=set.filter(i=>i.options.length);assert.equal(mc.length,40);assert.deepEqual([0,1,2].map(n=>mc.filter(i=>i.options.indexOf(i.correct_answer)===n).length),[14,13,13]);assert.equal(new Set(set.filter(i=>i.exercise_type==='betekenis_kiezen').map(i=>i.model_answer)).size,20);assert.equal(require('../match-pair-contract.js').audit(set).pairs.length,24);
assert.equal(current.filterSource({topics:['ER'],levels:['A2']}).length,207);assert.equal(current.filterSource({levels:['B2']}).length,38);
for(const source of history)for(const filter of filters){
 const old=createContentRuntime(source,{familyId:'grammar'});
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE','SORT']){
  const f=engine==='SORT'?{...filter,exercise_types:['functie_sorteren']}:filter,pool=old.filterSource(f).filter(i=>set.some(x=>x.content_item_id===i.content_item_id)),base=old.createSession({filters:f,targetDurationSeconds:pool.reduce((n,i)=>n+i.estimated_duration_seconds,0),organizationMode:'groups',engines:[engine],selectedGameEngine:engine}),session={...base,selected_item_ids:pool.map(i=>i.content_item_id),selected_content_refs:pool.map(i=>old.contentRef(i))};
  assert.equal(session.selected_item_ids.length,engine==='SORT'?8:120);assert.deepEqual(current.enginePool(engine,current.restoreSession(session)),old.enginePool(engine,session));const legacy=structuredClone(session);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,session.selected_content_refs);
 }
 const saved=old.specFromFilters({...filter,exercise_types:['invullen']}),updated=current.currentSelection(saved);assert.deepEqual(updated.scope_clauses[0].cefr_levels,filter.levels);assert.equal(current.selectionPool(updated).length,10);
}
const guidance={sources:{},examples:{},bindings:{}};require('../data/lesson-guidance.js')(bank.items,guidance);
for(const item of set){const b=guidance.bindings[item.content_item_id];assert.equal(b.item_version,review.version);assert.equal(b.erk.status,'reviewed');assert.deepEqual(b.erk.levels,[item.cefr_level]);assert.ok(b.erk.evidence.includes('bronlabel '+item.source_ref.original_cefr_level));assert.equal(b.lesson.check,item.explanation);assert.equal(b.lowan.status,'lesson_use');assert.equal(b.f.status,'lesson_use');}
const seedContext={};require('node:vm').runInNewContext(require('node:fs').readFileSync(require.resolve('../data/content-guidance.js'),'utf8'),seedContext);
const seeded=structuredClone(seedContext.DIGIBORD_CONTENT_GUIDANCE),seedBefore=structuredClone(seeded.bindings);
require('../data/lesson-guidance.js')(bank.items,seeded);
for(const id of Object.keys(seedBefore)){assert.deepEqual(seeded.historicalBindings[id+'@1.2'],seedBefore[id]);assert.equal(seeded.bindings[id].item_version,review.mixedVersion);assert.equal(seeded.bindings[id].erk.status,'reviewed');assert.equal(seeded.bindings[id].lesson.check,current.itemById(id).explanation);}
console.log('PASS 120 Er tasks: 34 A2 / 86 B1, concrete situations, eight dialogues, twenty meanings, 24 closed pairs, level guidance, other 1320 unchanged and twenty historical versions restored including sorting sessions.');
