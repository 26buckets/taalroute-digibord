const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {bank,originals,review,output}=require('../scripts/import-gesprek-repareren.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/gesprek-repareren.js'),'utf8'),output);
const old=require('../scripts/import-c1-nuance.cjs');assert.equal(fs.readFileSync(require.resolve('../data/c1-nuance.js'),'utf8'),old.output,'Existing bank unchanged by shared reader');
const workplace=require('../scripts/import-werkvloertaal.cjs');assert.equal(fs.readFileSync(require.resolve('../data/werkvloertaal.js'),'utf8'),workplace.output,'Existing workplace bank unchanged');
const meeting=require('../scripts/import-vergadertaal.cjs');assert.equal(fs.readFileSync(require.resolve('../data/vergadertaal.js'),'utf8'),meeting.output,'Existing meeting bank unchanged');
const implicit=require('../scripts/import-impliciete-boodschap.cjs');assert.equal(fs.readFileSync(require.resolve('../data/impliciete-boodschap.js'),'utf8'),implicit.output,'Earlier implicit bank unchanged');
const humor=require('../scripts/import-humor-ironie.cjs');assert.equal(fs.readFileSync(require.resolve('../data/humor-ironie.js'),'utf8'),humor.output,'Earlier humor bank unchanged');
const connotation=require('../scripts/import-betekenisnuances.cjs');assert.equal(fs.readFileSync(require.resolve('../data/betekenisnuances.js'),'utf8'),connotation.output,'Earlier connotation bank unchanged');
const rephrase=require('../scripts/import-herformuleren.cjs');assert.equal(fs.readFileSync(require.resolve('../data/herformuleren.js'),'utf8'),rephrase.output,'Earlier rephrase bank unchanged');
const runtime=createContentRuntime(old.bank),saved=runtime.createSession({filters:{levels:['B2']},selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:7});runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});guidance.register(bank.guidance);guidance.complete(bank.items);assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(saved))).selected_item_ids,saved.selected_item_ids,'Earlier saved selection survives new bank');
const levels={},counts={},seen=new Set();
for(const [n,i] of bank.items.entries()){
 const r=review.items[i.content_item_id],source=originals[n],task={...source,...r.patch};levels[i.cefr_level]=(levels[i.cefr_level]||0)+1;counts[source.letter]=(counts[source.letter]||0)+1;
 assert.equal(i.content_item_id,'C1_GR_'+String(n+1).padStart(3,'0'));for(const k of ['title','context','prompt'])assert.equal(i[k],task[k]);assert.deepEqual(i.options,task.options.map((s,n)=>'ABC'[n]+'. '+s));assert.equal(i.model_answer,i.options['ABC'.indexOf(task.letter)]);
 assert.equal(i.source_ref.source_level,'C1');assert.equal(i.source_ref.source_status,review.source_status);assert.ok(i.source_ref.source_sha256===review.source_sha256);assert.ok(i.explanation.startsWith(task.explanation+'\n\n'+task.note));
 assert.equal(runtime.answerPolicy(i).modelIsExample,r.scoring==='discuss');if(r.scoring==='discuss')assert.equal(i.correct_answer,null);
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key));assert.equal(guidance.mapping({...i,version:'changed'},key),null)}
 const signature=i.context+'\n'+i.prompt;assert.ok(!seen.has(signature));seen.add(signature);
}
assert.deepEqual(levels,{B1:26,B2:24});assert.deepEqual(counts,{A:17,B:17,C:16});assert.equal(Object.values(review.items).filter(r=>Object.keys(r.patch).length).length,50);
assert.equal(bank.items.filter(i=>i.correct_answer===null).length,24);
for(const [n,i] of bank.items.entries()){assert.equal(i.model_answer[0],originals[n].letter);assert.equal(i.productive_or_receptive,'receptief');assert.deepEqual(i.media_requirements,[])}
const card=n=>runtime.itemById('C1_GR_'+String(n).padStart(3,'0'));
for(const n of [1,6,8,12])assert.ok(!/de (eerste|tweede|derde) (reactie|optie|vraag)/i.test(card(n).explanation),'No stale explanation position '+n);
assert.ok(!/morgen/.test(card(8).model_answer),'No added promise');
assert.match(card(14).model_answer,/genoeg informatie/);
assert.match(card(20).model_answer,/beide of iets anders/);
assert.match(card(22).model_answer,/volgorde in de tijd/);
assert.match(card(30).model_answer,/letterlijk te herhalen/);
assert.match(card(36).prompt,/opmerking over de kosten/);
assert.match(card(45).model_answer,/Klopt het/);
assert.match(card(48).model_answer,/alleen vanwege de persoon/);
assert.ok(!bank.items.some(i=>/pragmatisch|operationeel|bronattributie|antecedent|reparatiefunctie|informatierisico/i.test(i.prompt+' '+i.options.join(' '))));
assert.equal(runtime.filterSource({bank_ids:[bank.bank_id],levels:['C1']}).length,0,'Source label does not create C1 content');
assert.throws(()=>runtime.createSession({filters:{bank_ids:[bank.bank_id],levels:['C1']},selectedGameEngine:'CARDS',targetDurationSeconds:600}));
for(const level of ['B1','B2']){
 const filters={bank_ids:[bank.bank_id],levels:[level]},engines=runtime.fullCoverageEngines(filters);assert.deepEqual(engines.slice().sort(),['BOARD','CARDS','WHEEL']);
 const options={filters,seed:42,targetDurationSeconds:600,selectedGameEngine:'CARDS'},a=runtime.createSession(options),b=runtime.createSession({...options,selectedGameEngine:'BOARD',selectionSpec:runtime.specFromFilters(filters)});assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>=7);assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(a))).selected_item_ids,a.selected_item_ids);
 for(const game of ['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE'])assert.throws(()=>runtime.createSession({...options,selectedGameEngine:game}),/spelvorm/);
}
// Same expression may be practiced differently; exact copied situations/questions are not inserted twice.
const ctx={window:{DIGIBORD_DATA:{}}};vm.runInNewContext(fs.readFileSync(require.resolve('../data/c1-between-lines.js'),'utf8'),ctx);
const adapt=require('../content-bank-adapters.js'),activityContext={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../data/new-activities.js'),'utf8'),activityContext);
const previousBanks=[rephrase.bank,connotation.bank,humor.bank,old.bank,workplace.bank,require('../data/impliciete-boodschap.js'),require('../data/vergadertaal.js'),require('../data/content-vert001-er-b1.js'),require('../data/gram-pb003.js'),require('../data/gram-pb002.js'),require('../data/wz-pb003.js'),require('../data/wz-pb004.js'),require('../data/wz-pb005.js'),adapt(require('../Lessen/woorden-zinnen.json')),adapt(require('../data/wz-pb002.js')),require('../data/connections-pilot.js'),adapt.riddles(activityContext.window.DIGIBORD_ACTIVITIES)];
assert.equal(previousBanks.reduce((n,b)=>n+b.items.length,0),5581);
const previous=[...previousBanks.flatMap(b=>b.items),...ctx.window.DIGIBORD_DATA.c1BetweenLines.cards.map(i=>({context:i.situation,prompt:i.question}))];
const signature=i=>(i.context+' '+i.prompt).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const signatures=new Set(previous.map(signature));assert.equal(new Set(bank.items.map(signature)).size,50);
for(const i of bank.items)assert.ok(!signatures.has(signature(i)),i.content_item_id+' duplicates earlier content');
const catalog=require('../data/content-catalog.js');catalog.registerBank(old.bank);catalog.registerBank(bank);const topic=catalog.families.find(f=>f.id==='conversation').topics.find(t=>t.id==='gesprek-repareren');assert.deepEqual(topic.levels,['B1','B2']);assert.equal(topic.subtopics.length,6);assert.throws(()=>runtime.filterSource({bank_ids:[bank.bank_id],levels:['A2']}),/niveau/);
const corrupt=structuredClone(bank);corrupt.items[0].review_status='OPEN';assert.throws(()=>createContentRuntime(corrupt),/reviewstatus/);
console.log('PASS Gesprek repareren: 50 source IDs, frozen hash, semantic repairs, B1/B2 26/24, no automatic C1 or audio, old banks unchanged, overlap against 5581 + 50, guidance, routes and game restrictions.');
