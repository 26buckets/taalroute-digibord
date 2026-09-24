const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {bank,review,originals,output}=require('../scripts/import-wz-pb005.cjs'),adapt=require('../content-bank-adapters.js'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/wz-pb005.js'),'utf8'),output);
const base=adapt(require('../Lessen/woorden-zinnen.json'));assert.equal(crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex'),'680f38cf0e46ea0f0675da192a64f239f6ccc4c2a9091eaf168ce7a7403c61c7');
const previous=require('../data/wz-pb003.js');assert.equal(fs.readFileSync(require.resolve('../data/wz-pb003.js'),'utf8'),require('../scripts/import-wz-pb003.cjs').output);
const runtime=createContentRuntime(base);runtime.registerBank(adapt(require('../data/wz-pb002.js')));runtime.registerBank(previous);runtime.registerBank(require('../data/wz-pb004.js'));runtime.registerBank(bank,{excludedEngines:['DICE','MATCH','MEMORY','SORT']});guidance.register(bank.guidance);guidance.complete(bank.items);
assert.equal(runtime.items().length,2559);assert.equal(new Set(originals.map(i=>i.ID)).size,1120);const levels={},fingerprints=new Set();
for(const item of bank.items){
 const r=review.items[item.content_item_id],source=originals.find(x=>x.ID===item.content_item_id),x={...source,...r.changes};levels[item.cefr_level]=(levels[item.cefr_level]||0)+1;
 assert.equal(item.model_answer,x.Antwoordmodel);assert.equal(item.context,x.Context);assert.equal(item.cefr_level,r.level);assert.equal(item.taalroute_route,undefined);assert.equal(item.source_review.sourceReview3,'OPEN');assert.equal(item.source_ref.original_level,'A2 tot B1');assert.equal(item.source_ref.original_topic,source.DoelID);assert.equal(item.source_review.localStatus,'GO');
 assert.ok(!/werkt jij|Ik gaat|\bsara\b|\bamir\b|Open antwoord|\bwoont (morgen|vandaag|om tien uur)/.test(item.model_answer));assert.ok(!item.prompt.includes('..'));
 for(const k of ['lowan','erk','f','bow']){assert.ok(guidance.mapping(item,k));assert.equal(guidance.mapping({...item,version:'changed'},k),null);}
 for(const e of ['BOARD','CARDS','WHEEL'])assert.ok(runtime.compatibility(item,e).compatible);for(const e of ['DICE','MATCH','MEMORY','SORT'])assert.ok(!runtime.compatibility(item,e).compatible);
 if(item.exercise_type==='zinnen_leggen'){assert.equal(item.expected_tokens.length,3);assert.deepEqual(runtime.project('SEQUENCE',item).orderExpectedTokens,item.expected_tokens);assert.equal(item.expected_tokens.join(' ')+item.model_answer.slice(-1),item.model_answer);}
 if(item.exercise_type==='herschrijven')assert.notEqual(item.stimulus,item.model_answer);
 if(['herschrijven','fout_verbeteren','vrije_productie','scenario'].includes(item.exercise_type)){assert.equal(runtime.answerPolicy(item).modelIsExample,true);assert.equal(item.correct_answer,null);assert.deepEqual(item.accepted_answers,[]);}
 const fp=item.exercise_type+'|'+item.prompt+'|'+item.options.slice().sort().join('|');assert.ok(!fingerprints.has(fp),item.content_item_id);fingerprints.add(fp);
}
assert.deepEqual(levels,{A2:372,B1:324});assert.equal(Object.values(review.items).filter(r=>r.status==='DUPLICATE').length,424);
for(const [id,r] of Object.entries(review.items)){if(id.startsWith('WZ_032_')||id.startsWith('WZ_041_'))assert.equal(r.level,'B1');if(r.status==='DUPLICATE'){assert.equal(runtime.itemById(id),null);assert.ok(runtime.itemById(r.duplicate_of),id+' resolves to playable original');}}
for(const topic of [...new Set(bank.items.map(i=>i.topic))])for(const level of [...new Set(bank.items.filter(i=>i.topic===topic).map(i=>i.cefr_level))]){
 const filters={bank_ids:[bank.bank_id],topics:[topic],levels:[level]},duration=Math.min(300,runtime.filterSource(filters).reduce((s,i)=>s+i.estimated_duration_seconds,0));
 const a=runtime.createSession({filters,selectedGameEngine:'CARDS',seed:39,targetDurationSeconds:duration}),b=runtime.createSession({selectionSpec:runtime.specFromFilters(filters),selectedGameEngine:'BOARD',seed:39,targetDurationSeconds:duration});assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>1);assert.deepEqual(runtime.restoreSession(a).selected_item_ids,a.selected_item_ids);
}
for(const level of ['A0→A1','A1','A2'])assert.equal(runtime.filterSource({topics:['WZ_029'],levels:[level]}).length,0);
assert.ok(runtime.filterSource({topics:['WZ_029'],levels:['B1']}).length>50);
assert.equal(require('../data/wz-pb004.js').items.find(i=>i.content_item_id==='WZ_024_V10').model_answer,'Ik ga het formulier invullen.');assert.equal(require('../data/wz-pb004.js').items.find(i=>i.content_item_id==='WZ_029_V02').model_answer,'Ik zie het kind dat buiten speelt.');
const old=runtime.createSession({filters:{topics:['WZ_001'],levels:['A0→A1']},selectedGameEngine:'CARDS',targetDurationSeconds:300});assert.deepEqual(runtime.restoreSession(old).selected_item_ids,old.selected_item_ids);
console.log('PASS WZ PB005: 1120 reviewed rows, 696 tasks, 424 resolved duplicates, 2559 combined WZ, all relative/passive source rows B1, teacher review, old bank preservation, both routes, restored lessons and guidance.');

// App registration must extend existing topic AND subtopic level choices.
const catalog=require('../data/content-catalog.js');
for(const b of [base,previous,require('../data/wz-pb004.js'),bank])catalog.registerBank(b,{familyId:'words'});
const topics=catalog.families.find(f=>f.id==='words').topics;
for(const item of bank.items){const t=topics.find(t=>t.id===item.topic);assert.ok(t.levels.includes(item.cefr_level));assert.ok(t.subtopics.find(s=>s.id==='all').levels.includes(item.cefr_level));assert.ok(t.subtopics.find(s=>s.id===item.language_function).levels.includes(item.cefr_level));}
for(const id of ['WZ_032_B01','WZ_042_B03','WZ_042_K02','WZ_042_V01','WZ_042_S04','WZ_042_T04','WZ_041_K01','WZ_033_T06'])assert.equal(review.items[id].level,'B1',id);
assert.equal(runtime.itemById('WZ_040_H07').stimulus,'We hebben weinig tijd. Dus begint we meteen.');
assert.ok(runtime.itemById('WZ_044_H03').stimulus.includes('Vervolgens iedereen probeerde'));
assert.equal(runtime.itemById('WZ_038_V03').stimulus,'Gisteren is een ongeluk gebeurd.');
assert.ok(!runtime.itemById('WZ_044_V10').model_answer.includes('collega'));
assert.ok(runtime.itemById('WZ_043_K10').prompt.includes('voorbeeld met omdat'));
assert.ok(runtime.itemById('WZ_037_K03').prompt.includes('voordat'));
for(const i of bank.items.filter(i=>i.source_ref.original_topic==='WZ_042'&&['vrije_productie','scenario'].includes(i.exercise_type)))assert.ok(i.stimulus);
for(const i of bank.items.filter(i=>i.topic==='WZ_044'&&['vrije_productie','scenario'].includes(i.exercise_type)))assert.equal(i.model_answer.split('.').filter(s=>s.trim()).length,3);
