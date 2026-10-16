const assert=require('node:assert/strict'),fs=require('node:fs');
const {bank,originals,review,output}=require('../scripts/import-gram-pb003.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/gram-pb003.js'),'utf8'),output);
const base=require('../data/content-vert001-er-b1.js'),before=JSON.stringify(base),r=createContentRuntime(base);
r.registerBank(bank,{excludedEngines:['DICE','MATCH','MEMORY','SORT']});guidance.register(bank.guidance);
assert.equal(JSON.stringify(base),before);
const levels={},positions={},pairs=new Set();
for(const [index,item] of bank.items.entries()){
 const source=originals[index],rev=review.items[source.id],expected={...source,...rev.changes};levels[item.cefr_level]=(levels[item.cefr_level]||0)+1;
 for(const [target,key] of [['prompt','prompt'],['context','context'],['model_answer','model_answer'],['correct_answer','correct_answer'],['explanation','grammar_note'],['cefr_level','level'],['language_function','function']])assert.equal(item[target],expected[key]);
 assert.equal(item.source_ref.original_level,source.level);assert.equal(item.source_ref.original_review,'productie_v1');
 assert.ok(!/in staat is om|wil doen|andere modale functie|epistemische/.test(item.prompt+item.options.join(' ')));
 assert.ok(guidance.mapping(item,'erk'));assert.ok(guidance.mapping(item,'bow'));assert.equal(guidance.mapping({...item,version:'other'},'erk'),null);
 for(const e of ['BOARD','WHEEL','CARDS'])assert.ok(r.compatibility(item,e).compatible);
 assert.ok(!r.compatibility(item,'DICE').compatible);
 if(item.options.length){const k=item.options.indexOf(item.correct_answer);positions[k]=(positions[k]||0)+1;assert.equal(new Set(item.options).size,3)}
 if(item.exercise_type==='invullen'){assert.ok(item.prompt.includes('vorm van '+item.lemma));assert.ok(item.prompt.includes('___'));}
 if(item.exercise_type==='zinnen_leggen'){assert.deepEqual(item.expected_tokens.slice().sort(),item.order_tokens.slice().sort());assert.equal(item.expected_tokens.join(' ')+'.',item.correct_answer);assert.deepEqual(r.project('SEQUENCE',item).orderExpectedTokens,item.expected_tokens);}
 if(item.exercise_type==='fout_verbeteren')assert.ok(item.prompt.startsWith('Verbeter de vorm van '+item.lemma+':'));
 const fingerprint=item.context+'\n'+item.prompt+'\n'+item.options.slice().sort().join(' | ');assert.ok(!pairs.has(fingerprint),'Duplicate task: '+item.content_item_id);pairs.add(fingerprint);
}
assert.deepEqual(levels,{A1:78,A2:176,B1:118,B2:78});assert.ok(Object.values(positions).every(n=>n>25));
assert.ok(r.itemById('MOD_KUNNEN_A2_015').correct_answer.includes('e-mail'));
assert.ok(r.itemById('MOD_MOGEN_B1_064').prompt.includes('Je mogen de documenten mee naar huis nemen.'));
assert.ok(r.itemById('MOD_MOGEN_B2_061').model_answer.startsWith('Het mag duidelijk zijn'));
assert.ok(r.itemById('MOD_HOEVEN_B1_139').model_answer.includes('je niet opnieuw te registreren'));
for(const topic of ['KUNNEN','MOETEN','MOGEN','WILLEN','HOEVEN']){
 assert.equal(r.filterSource({topics:[topic]}).length,90);
 for(const level of [...new Set(bank.items.filter(i=>i.topic===topic).map(i=>i.cefr_level))]){
  const options={filters:{topics:[topic],levels:[level]},seed:41,targetDurationSeconds:300,selectedGameEngine:'CARDS'};
  const a=r.createSession(options),b=r.createSession({...options,selectionSpec:r.specFromFilters(options.filters),selectedGameEngine:'BOARD'});
  assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>1);assert.deepEqual(r.restoreSession(a).selected_item_ids,a.selected_item_ids);
  assert.ok(r.fullCoverageEngines(options.filters,'groups').includes('QUIZ'));
  const fresh=r.createSession({...options,recentItemIds:a.selected_item_ids});if(r.filterSource(options.filters).length>=a.selected_item_ids.length*2)assert.ok(fresh.selected_item_ids.some(id=>!a.selected_item_ids.includes(id)));
 }
}
const mix={family_ids:['grammar'],family_tags:['MODAAL']};assert.equal(r.filterSource(mix).length,1350);assert.equal(new Set(r.filterSource(mix).map(i=>i.content_item_id)).size,1350);
const old=r.createSession({filters:{topics:['ZULLEN','ZOUDEN'],levels:['B1']},targetDurationSeconds:300,selectedGameEngine:'DICE'});assert.ok(old.selected_item_ids.every(id=>!id.startsWith('MOD_')));assert.deepEqual(r.restoreSession(old).selected_item_ids,old.selected_item_ids);
const blocked=structuredClone(bank);blocked.items[0].review_status='productie_v1';assert.throws(()=>createContentRuntime(blocked),/reviewstatus/);
console.log('PASS PB003: 450 source-linked reviewed items, five lemmas, level advice, truthful correction tasks, ordered groups, varied answer positions, guidance, routes, 1350-item mix and unchanged original grammar.');
