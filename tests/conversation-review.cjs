const assert=require('node:assert/strict'),crypto=require('node:crypto'),previousHashes=require('./fixtures/conversation-preview-v2-hashes.json');
const {createContentRuntime}=require('../content-runtime.js'),review=require('../data/conversation-review.js');
const names=['c1-nuance','werkvloertaal','vergadertaal','impliciete-boodschap','humor-ironie','betekenisnuances','herformuleren','gesprek-repareren','samenvatten-bemiddelen','overtuigen-onderhandelen'];
const banks=names.map(n=>require('../data/'+n+'.js')),unchanged=JSON.stringify(banks),base=require('../data/content-vert001-er-b1.js');
const old=createContentRuntime(base),current=createContentRuntime(base),interim=createContentRuntime(base);
for(const bank of banks){old.registerBank(bank,{familyId:'conversation'});interim.registerBank(review.revise(bank,true),{familyId:'conversation'});current.registerBank(review.revise(bank),{familyId:'conversation',previousVersions:[bank,review.revise(bank,true)],excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']})}
for(const bank of banks)assert.equal(crypto.createHash('sha256').update(JSON.stringify(review.revise(bank,true).items)).digest('hex'),previousHashes.banks[bank.bank_id],'Actual previous preview retained');
assert.equal(JSON.stringify(banks),unchanged);assert.equal(Object.keys(review.levels).length,107);
const rows=current.filterSource({family_ids:['conversation']});assert.equal(rows.length,640);assert.equal(rows.filter(i=>i.cefr_level==='B1').length,134);assert.equal(rows.filter(i=>i.cefr_level==='B2').length,506);assert.equal(rows.filter(i=>i.cefr_level==='C1').length,0);
const fieldNames=['context','prompt','options','correct_answer','model_answer','explanation','feedback_correct','feedback_incorrect'];
assert.equal(Object.keys(review.edits).length,18);
for(const [id,edit] of Object.entries(review.edits)){assert.ok(current.itemById(id));assert.ok(edit.reason);assert.ok(Object.keys(edit.fields).every(k=>fieldNames.includes(k)));}
for(const item of rows){
 assert.equal(item.options.length,3);assert.equal(new Set(item.options).size,3);assert.ok(item.options.includes(item.model_answer));
 assert.equal(item.feedback_correct,item.explanation);assert.equal(item.feedback_incorrect,item.explanation);
 assert.equal(item.correct_answer,item.openness==='open'?null:item.model_answer);
 assert.ok(!Object.values(item).filter(v=>typeof v==='string').some(v=>v.includes('de negatieve oordeel')));
}
assert.ok(current.validateContentRefs(interim.filterSource({family_ids:['conversation']}).map(i=>interim.contentRef(i)),{historical:true}));
for(const i of interim.filterSource({family_ids:['conversation']})){const session={selected_content_refs:[interim.contentRef(i)]};assert.deepEqual(current.itemForSession(i.content_item_id,session),i)}
const grouped=Object.values(review.groups).flat();assert.equal(new Set(grouped).size,grouped.length);for(const id of grouped)assert.ok(current.itemById(id));
// Validate every retained reference, including unchanged cards from revised banks.
const refs=banks.flatMap(b=>b.items.map(i=>old.contentRef(i)));assert.ok(current.validateContentRefs(refs,{historical:true}));assert.throws(()=>current.validateContentRefs(refs),/niet beschikbaar/);
for(const engine of ['CARDS','BOARD','WHEEL']){
 const s=old.createSession({filters:{family_ids:['conversation'],levels:['C1']},selectedGameEngine:engine,seed:17});
 assert.deepEqual(current.restoreSession(s).selected_content_refs,s.selected_content_refs);assert.deepEqual(current.enginePool(engine,s),old.enginePool(engine,s));
 for(const id of s.selected_item_ids){assert.equal(current.itemForSession(id).cefr_level,'C1');assert.equal(current.itemById(id).cefr_level,'B2')}
 const bad=structuredClone(s);bad.selected_content_refs[0].content_hash='invalid';assert.throws(()=>current.restoreSession(bad),/oude inhoudsversie/);
 const i=current.itemById(s.selected_item_ids[0]);i.revocation_status='HARD_REVOKED';assert.throws(()=>current.restoreSession(s),/ingetrokken/);delete i.revocation_status;
}
assert.match(current.itemById('C1_BC_073').context,/het negatieve oordeel/);assert.match(old.itemById('C1_BC_073').context,/de negatieve oordeel/);
const results=[];
for(const trial of review.trials){
 const selectionSpec={scope_clauses:trial.topics.map(id=>({scope_id:id,content_family_id:'conversation',topic_ids:[id],cefr_levels:[trial.level]})),filter_spec:{difficulty:'all'}};
 for(let seed=1;seed<=60;seed++){
  const opts={selectionSpec,targetDurationSeconds:600,seed,selectedGameEngine:'CARDS'},s=current.createSession(opts),pool=current.enginePool('CARDS',s),groups=pool.map(i=>i.practice_group||i.content_item_id);
  assert.equal(s.selected_item_ids.length,7);assert.equal(new Set(groups).size,groups.length,'Avoid known same-goal cards: '+trial.id+' seed '+seed);
  assert.equal(new Set(s.selected_item_ids).size,7);assert.ok(pool.every(i=>i.cefr_level===trial.level));
  assert.deepEqual(current.createSession({...opts,selectedGameEngine:'BOARD'}).selected_item_ids,s.selected_item_ids);
  const next=current.createSession({...opts,recentItemIds:s.selected_item_ids});assert.ok(next.selected_item_ids.every(id=>!s.selected_item_ids.includes(id)));
 }
 const s=current.createSession({selectionSpec,targetDurationSeconds:600,seed:trial.seed,selectedGameEngine:'CARDS'});results.push({name:trial.name,level:trial.level,ids:s.selected_item_ids});
}
const legacySpec=old.specFromFilters({family_ids:['conversation'],topics:['humor-ironie'],levels:['C1']}),copy=structuredClone(legacySpec);
assert.deepEqual(current.currentSelection(legacySpec).scope_clauses[0].cefr_levels,['B2']);assert.deepEqual(legacySpec,copy);assert.throws(()=>current.filterSource({family_ids:['conversation'],levels:['C1']}),/niveau/);
// Known overlap remains usable in a deliberately narrow selection; no cards are discarded.
const small=structuredClone(banks[0]);small.bank_id='TEST-SPREAD';small.items=small.items.slice(0,3).map(i=>({...i,content_item_id:'T'+i.content_item_id,content_bank_id:small.bank_id,practice_group:'same-goal'}));small.item_count=3;
current.registerBank(small,{familyId:'test'});assert.equal(current.createSession({filters:{bank_ids:['TEST-SPREAD']},targetDurationSeconds:270,selectedGameEngine:'CARDS'}).selected_item_ids.length,3);
console.log('PASS conversation review: 107 explicit level revisions, 640 old references retained, 70 grouped cards, 180 varied lessons, all game routes, exact historical content and guards.');
if(require.main===module)console.log(JSON.stringify(results));
