const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {bank,originals,review,output}=require('../scripts/import-betekenisnuances.cjs'),{createContentRuntime}=require('../content-runtime.js'),guidance=require('../content-guidance.js');
assert.equal(fs.readFileSync(require.resolve('../data/betekenisnuances.js'),'utf8'),output);
const old=require('../scripts/import-c1-nuance.cjs');assert.equal(fs.readFileSync(require.resolve('../data/c1-nuance.js'),'utf8'),old.output,'Existing bank unchanged by shared reader');
const workplace=require('../scripts/import-werkvloertaal.cjs');assert.equal(fs.readFileSync(require.resolve('../data/werkvloertaal.js'),'utf8'),workplace.output,'Existing workplace bank unchanged');
const meeting=require('../scripts/import-vergadertaal.cjs');assert.equal(fs.readFileSync(require.resolve('../data/vergadertaal.js'),'utf8'),meeting.output,'Existing meeting bank unchanged');
const implicit=require('../scripts/import-impliciete-boodschap.cjs');assert.equal(fs.readFileSync(require.resolve('../data/impliciete-boodschap.js'),'utf8'),implicit.output,'Earlier implicit bank unchanged');
const humor=require('../scripts/import-humor-ironie.cjs');assert.equal(fs.readFileSync(require.resolve('../data/humor-ironie.js'),'utf8'),humor.output,'Earlier humor bank unchanged');
const runtime=createContentRuntime(old.bank),saved=runtime.createSession({filters:{levels:['B2']},selectedGameEngine:'CARDS',targetDurationSeconds:600,seed:7});runtime.registerBank(bank,{excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});guidance.register(bank.guidance);guidance.complete(bank.items);assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(saved))).selected_item_ids,saved.selected_item_ids,'Earlier saved selection survives new bank');
const levels={},counts={},seen=new Set();
for(const [n,i] of bank.items.entries()){
 const r=review.items[i.content_item_id],source=originals[n],task={...source,...r.patch};levels[i.cefr_level]=(levels[i.cefr_level]||0)+1;counts[source.letter]=(counts[source.letter]||0)+1;
 assert.equal(i.content_item_id,'C1_BC_'+String(n+1).padStart(3,'0'));for(const k of ['title','context','prompt'])assert.equal(i[k],task[k]);assert.deepEqual(i.options,task.options.map((s,n)=>'ABC'[n]+'. '+s));assert.equal(i.model_answer,i.options['ABC'.indexOf(task.letter)]);
 assert.equal(i.source_ref.source_level,'C1');assert.equal(i.source_ref.source_status,review.source_status);assert.ok(i.source_ref.source_sha256===review.source_sha256);assert.ok(i.explanation.startsWith(task.explanation+'\n\n'+task.note));
 assert.equal(runtime.answerPolicy(i).modelIsExample,r.scoring==='discuss');if(r.scoring==='discuss')assert.equal(i.correct_answer,null);
 for(const key of ['erk','lowan','f','bow']){assert.ok(guidance.mapping(i,key));assert.equal(guidance.mapping({...i,version:'changed'},key),null)}
 const signature=i.context+'\n'+i.prompt;assert.ok(!seen.has(signature));seen.add(signature);
}
assert.deepEqual(levels,{B2:54,B1:14,C1:12});assert.deepEqual(counts,{A:27,B:27,C:26});assert.equal(Object.values(review.items).filter(r=>Object.keys(r.patch).length).length,80);
for(const [n,sourceLetter,reviewedLetter] of [[71,'A','B'],[72,'B','A']]){
 const item=runtime.itemById('C1_BC_'+String(n).padStart(3,'0'));
 assert.equal(originals[n-1].letter,sourceLetter);assert.equal(item.model_answer,item.options['ABC'.indexOf(reviewedLetter)]);assert.equal(item.source_ref.source_answer_letter,sourceLetter);assert.equal(item.source_ref.reviewed_answer_letter,reviewedLetter);
}
assert.deepEqual(bank.items.reduce((c,i)=>{c[i.model_answer[0]]++;return c},{A:0,B:0,C:0}),{A:27,B:27,C:26});
assert.equal(bank.items.filter(i=>i.correct_answer===null).length,42);
assert.match(runtime.itemById('C1_BC_028').explanation,/nog steeds uitzonderlijk/);
assert.match(runtime.itemById('C1_BC_049').explanation,/Beide kunnen formeel/);
assert.match(runtime.itemById('C1_BC_052').explanation,/Nieuwsgierig kan ook goed/);
assert.match(runtime.itemById('C1_BC_038').explanation,/Verwerpen kan op zichzelf ook/);
assert.ok(!bank.items.some(i=>/parafraseren|connotatie|framing|semantisch|denotatie/i.test(i.prompt+' '+i.title)));
for(const level of ['B1','B2','C1']){
 const filters={bank_ids:[bank.bank_id],levels:[level]},engines=runtime.fullCoverageEngines(filters);assert.deepEqual(engines.slice().sort(),['BOARD','CARDS','WHEEL']);
 const options={filters,seed:42,targetDurationSeconds:600,selectedGameEngine:'CARDS'},a=runtime.createSession(options),b=runtime.createSession({...options,selectedGameEngine:'BOARD',selectionSpec:runtime.specFromFilters(filters)});assert.deepEqual(a.selected_item_ids,b.selected_item_ids);assert.ok(a.selected_item_ids.length>=7);assert.deepEqual(runtime.restoreSession(JSON.parse(JSON.stringify(a))).selected_item_ids,a.selected_item_ids);
 for(const game of ['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE'])assert.throws(()=>runtime.createSession({...options,selectedGameEngine:game}),/spelvorm/);
}
// Same expression may be practiced differently; exact copied situations/questions are not inserted twice.
const ctx={window:{DIGIBORD_DATA:{}}};vm.runInNewContext(fs.readFileSync(require.resolve('../data/c1-between-lines.js'),'utf8'),ctx);
const adapt=require('../content-bank-adapters.js'),activityContext={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../data/new-activities.js'),'utf8'),activityContext);
const previousBanks=[humor.bank,old.bank,workplace.bank,require('../data/impliciete-boodschap.js'),require('../data/vergadertaal.js'),require('../data/content-vert001-er-b1.js'),require('../data/gram-pb003.js'),require('../data/gram-pb002.js'),require('../data/wz-pb003.js'),require('../data/wz-pb004.js'),require('../data/wz-pb005.js'),adapt(require('../Lessen/woorden-zinnen.json')),adapt(require('../data/wz-pb002.js')),require('../data/connections-pilot.js'),adapt.riddles(activityContext.window.DIGIBORD_ACTIVITIES)];
assert.equal(previousBanks.reduce((n,b)=>n+b.items.length,0),5441);
const previous=[...previousBanks.flatMap(b=>b.items),...ctx.window.DIGIBORD_DATA.c1BetweenLines.cards.map(i=>({context:i.situation,prompt:i.question}))];
const signature=i=>(i.context+' '+i.prompt).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const signatures=new Set(previous.map(signature));assert.equal(new Set(bank.items.map(signature)).size,80);
for(const i of bank.items)assert.ok(!signatures.has(signature(i)),i.content_item_id+' duplicates earlier content');
const catalog=require('../data/content-catalog.js');catalog.registerBank(old.bank);catalog.registerBank(bank);const topic=catalog.families.find(f=>f.id==='conversation').topics.find(t=>t.id==='betekenisnuances');assert.deepEqual(topic.levels,['B1','B2','C1']);assert.equal(topic.subtopics.length,9);assert.throws(()=>runtime.filterSource({bank_ids:[bank.bank_id],levels:['A2']}),/niveau/);
const corrupt=structuredClone(bank);corrupt.items[0].review_status='OPEN';assert.throws(()=>createContentRuntime(corrupt),/reviewstatus/);
console.log('PASS Woordkeuze: 80 source IDs, frozen hash, answer repairs 071/072, B1/B2/C1 14/54/12, old banks unchanged, overlap against 5441 + 50, lesson guidance, both routes and game restrictions.');
