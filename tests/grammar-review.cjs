const assert=require('node:assert/strict'),crypto=require('node:crypto');
const original=require('../data/content-vert001-er-b1.js'),moduleReview=require('../data/grammar-review.js'),review={...moduleReview,version:moduleReview.previousVersion,revise:moduleReview.previous},{createContentRuntime}=require('../content-runtime.js');
const before=JSON.stringify(original),revised=review.revise(original),old=createContentRuntime(original,{familyId:'grammar'}),current=createContentRuntime(revised,{familyId:'grammar',previousVersions:[original]});
assert.equal(JSON.stringify(original),before);assert.equal(revised.items.length,1440);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(revised.items)).digest('hex'),revised.source_sha256);
assert.equal(review.revise(revised),revised);
assert.throws(()=>review.revise({...original,source_version:'unknown'}),/Onbekende bron/);
const b2=current.filterSource({levels:['B2']});assert.equal(b2.length,480);assert.equal(Object.keys(review.open).length,144);
const openTypes=['scenario','snelvraag','dialoog_aanvullen','vrije_productie'];
for(const item of revised.items){
 const source=old.itemById(item.content_item_id);
 if(item.cefr_level!=='B2'){assert.deepEqual(item,source);continue}
 assert.equal(item.version,review.version);assert.deepEqual(item.source_ref,source.source_ref);assert.equal(item.cefr_level,source.cefr_level);
 assert.ok(item.title&&item.prompt&&item.model_answer&&item.explanation,item.content_item_id);
 assert.doesNotMatch(item.prompt,/abstracte verwijzing|analytische inferentie|gevraagde functie|gemarkeerde constructie|contrafeitelijk|communicatieve functie/);
 assert.doesNotMatch(item.model_answer,/De gevolgen zullen.*gevolgen|woon werkverkeer|e mail|nuanceren dat/);
 if(openTypes.includes(item.exercise_type)){
  assert.ok(item.context.length>50,item.content_item_id+' concrete facts');assert.ok(!item.prompt.includes(item.model_answer),item.content_item_id+' answer leak');
  assert.equal(current.answerPolicy(item).mode,'teacher_or_peer_review');
 }
 if(item.exercise_type==='dialoog_aanvullen')assert.match(item.prompt,/\n[A-Z][a-z]+: ‘.+’\nJij: …/,item.content_item_id+' actual dialogue');
 if(item.options.length){assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.correct_answer),item.content_item_id);assert.deepEqual(item.accepted_answers,[item.correct_answer])}
 if(item.exercise_type==='zinnen_leggen'){
  const p=current.project('CARDS',item),normalize=xs=>xs.map(s=>s.toLowerCase().replace(/[.!?,]/g,'')).sort();
  assert.deepEqual(normalize(p.orderTokens),normalize(p.orderExpectedTokens),item.content_item_id+' order tokens must match the repaired sentence');
 }
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE'])assert.equal(current.compatibility(item,engine).compatible,true,item.content_item_id+' '+engine);
}
assert.equal(b2.filter(x=>x.exercise_type==='dialoog_aanvullen').length,32);
assert.equal(b2.filter(x=>x.exercise_type==='betekenis_kiezen').length,80);
assert.equal(b2.filter(x=>x.exercise_type==='herschrijven').length,38);
assert.equal(b2.filter(x=>current.compatibility(x,'SORT').compatible).length,0,'Sentence meanings must not produce eighteen unrelated sort buttons');
assert.match(current.itemById('ER_B2_099').context,/factuur/);assert.match(current.itemById('ER_B2_099').prompt,/Kan ik deze factuur al betalen/);
assert.match(current.itemById('ER_B2_111').context,/nooduitgang/);
assert.equal(current.itemById('ZOUDEN_B2_064').exercise_type,'herschrijven');
assert.equal(current.answerPolicy(current.itemById('ZOUDEN_B2_064')).mode,'teacher_or_peer_review');
assert.match(current.itemById('ZOUDEN_B2_008').prompt,/De organisatie handelde te laat/);
for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
 const prior=old.createSession({filters:{levels:['B2']},organizationMode:'groups',selectedGameEngine:engine,engines:[engine],seed:58});
 assert.deepEqual(current.restoreSession(prior).selected_content_refs,prior.selected_content_refs);
 assert.deepEqual(current.enginePool(engine,prior),old.enginePool(engine,prior));
 const legacy=structuredClone(prior);delete legacy.selected_content_refs;assert.deepEqual(current.restoreSession(legacy).selected_content_refs,prior.selected_content_refs);
 legacy.content_source.source_sha256='unknown';assert.throws(()=>current.restoreSession(legacy),/oorspronkelijke inhoudsversie/);
 const session=current.createSession({filters:{levels:['B2']},organizationMode:'groups',selectedGameEngine:engine,engines:['CARDS','BOARD','WHEEL','QUIZ','DICE'],seed:44});
 assert.ok(current.enginePool(engine,session).every(i=>i.version===review.version));
 assert.deepEqual(session.selected_item_ids,current.createSession({filters:{levels:['B2']},organizationMode:'groups',selectedGameEngine:'CARDS',engines:['CARDS','BOARD','WHEEL','QUIZ','DICE'],seed:44}).selected_item_ids);
}
current.validateContentRefs(original.items.map(i=>old.contentRef(i)),{historical:true});
const complete=require('../data/lesson-guidance.js'),guidance={sources:{},examples:{},bindings:{}};complete(revised.items,guidance);assert.equal(Object.keys(guidance.bindings).length,1440);assert.equal(guidance.bindings.ER_B2_099.item_version,review.version);
console.log('PASS retained B2 repair version: 480 records, 144 concrete situations, 32 dialogues, 80 meaning questions, 38 rewrites, order tokens, source integrity, all 1440 historical references and five game routes.');
