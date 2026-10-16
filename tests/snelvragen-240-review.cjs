const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const review=require('../data/snelvragen-review.js'),original=require('../data/snelvragen-content.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
const before=JSON.stringify(original),bank=review.revise(original),ids=Object.keys(review.reviews),baseIds=original.items.filter(i=>i.topic==='quick-answer').map(i=>i.content_item_id);
assert.deepEqual(ids,baseIds);assert.equal(ids.length,240);assert.equal(JSON.stringify(original),before,'Canonical runtime bank unchanged');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../Lessen/directe-vragen.json'))).digest('hex'),require('./fixtures/snelvragen-review.json').legacy_sha256);
assert.equal(bank.items.length,2621);assert.deepEqual(bank.items.slice(240),original.items.slice(240),'2381 out-of-scope additions unchanged');
const metadata={familyId:'quick',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']};
const old=createContentRuntime(original,metadata);
// createContentRuntime passes family/history only; set engine exclusions for the check via registerBank.
const runtime=createContentRuntime(require('../data/tussen-de-regels.js'));runtime.registerBank(bank,{...metadata,previousVersions:[original]});
guidance.registerHistorical(original);guidance.register(bank.guidance);guidance.complete(bank.items);
for(const [index,id] of ids.entries()){
 const item=runtime.itemById(id),r=review.reviews[id],prior=old.itemById(id);
 assert.ok(r.goal?.endsWith('.')&&r.group&&r.reason.includes(r.goal),id+' individual review');
 assert.ok(item.prompt&&item.model_answer&&item.feedback_incorrect,id+' complete');assert.equal(item.learning_goal,r.goal);assert.equal(item.cefr_level,r.level);
 assert.ok(!/oefenhuis|halfnegen|halfacht/.test(item.prompt+item.model_answer+item.feedback_incorrect),id);
 assert.equal(item.correct_answer,null);assert.equal(runtime.answerPolicy(item).mode,'teacher_or_peer_review');
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(item,key),id+' '+key);assert.ok(guidance.mapping(prior,key),id+' historical '+key)}
 assert.equal(guidance.mapping(item,'erk').levels[0],item.cefr_level);for(const key of ['lowan','f'])assert.equal(guidance.mapping(item,key).status,'lesson_use');
 assert.deepEqual(runtime.fullCoverageEngines({bank_ids:[bank.bank_id],topics:['quick-answer'],levels:[item.cefr_level]}).sort(),['BOARD','CARDS','WHEEL']);
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const saved=old.createSession({filters:{topics:['quick-answer'],levels:[prior.cefr_level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:index});
  const exact={...saved,selected_item_ids:[id],selected_content_refs:[old.contentRef(prior)],actual_estimated_duration_seconds:prior.estimated_duration_seconds};
  const restored=runtime.restoreSession(structuredClone(exact));assert.deepEqual(runtime.itemForSession(id,restored),prior,'Old text restored '+id);
  const preRefs=structuredClone(exact);delete preRefs.selected_content_refs;assert.equal(runtime.itemForSession(id,runtime.restoreSession(preRefs)).prompt,prior.prompt,'Pre-reference lessons restore');
 }
}
const get=id=>runtime.itemById(id);
assert.match(get('dq-2-square-11').context,/negen uur/);assert.match(get('dq-2-square-11').prompt,/vóór negen uur/);assert.match(get('dq-2-square-11').model_answer,/half negen/);
assert.equal(get('dq-0-diamond-13').context,'Er ligt hier een jas.');assert.doesNotMatch(get('dq-0-diamond-13').context,/Je jas/);
assert.match(get('dq-3-diamond-12').context,/tien uur tot vier uur/);assert.match(get('dq-3-triangle-02').model_answer,/bespaar elke dag reistijd/);
assert.equal(get('dq-2-diamond-11').cefr_level,'A1');assert.equal(get('dq-3-triangle-03').cefr_level,'B1');
assert.equal(new Set(['dq-0-circle-01','dq-0-diamond-02','dq-0-diamond-15'].map(id=>get(id).practice_group)).size,1,'Equivalent name questions spread');
for(const level of ['A1','A2','B1']){
 const opts={filters:{bank_ids:[bank.bank_id],topics:['quick-answer'],levels:[level]},targetDurationSeconds:600,seed:37};
 const cards=runtime.createSession({...opts,selectedGameEngine:'CARDS'});
 for(const engine of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({...opts,selectionSpec:runtime.specFromFilters(opts.filters),selectedGameEngine:engine}).selected_item_ids,cards.selected_item_ids);
 assert.equal(new Set(cards.selected_item_ids.map(id=>get(id).practice_group)).size,cards.selected_item_ids.length,'Distinct themes before repeating');
}
assert.deepEqual(bank.items.slice(0,240).reduce((a,i)=>(a[i.cefr_level]=(a[i.cefr_level]||0)+1,a),{}),{A1:129,A2:77,B1:34});
assert.throws(()=>review.revise({...original,source_version:'unknown'}));
console.log('PASS: 240 individually reviewed questions, 129 A1/77 A2/34 B1; 2381 unchanged, protected source hash, 720 historical restores plus pre-ref sessions, independent guidance and three-engine parity.');
