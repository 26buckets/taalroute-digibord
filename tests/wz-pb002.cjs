const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const adapt=require('../content-bank-adapters.js'),supplement=require('../data/wz-pb002.js');
const {createContentRuntime}=require('../content-runtime.js');
const base=adapt(require('../Lessen/woorden-zinnen.json')),bank=adapt(supplement),runtime=createContentRuntime(base);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(JSON.stringify(base)),'680f38cf0e46ea0f0675da192a64f239f6ccc4c2a9091eaf168ce7a7403c61c7','All 680 original items and bank metadata remain byte-identical');
const csv=fs.readFileSync(path.join(__dirname,'fixtures/wz-pb002-source.csv'),'utf8');
assert.equal(hash(csv),supplement.source.sourceSha256);
// Read quoted CSV fields, including commas and embedded newlines in the Drive export.
const records=[];let row=[],field='',quoted=false;
for(let n=0;n<csv.length;n++){
 const c=csv[n];if(c==='"'){if(quoted&&csv[n+1]==='"'){field+='"';n++}else quoted=!quoted}
 else if(!quoted&&(c===','||c==='\n')){row.push(field.replace(/\r$/,''));field='';if(c==='\n'){records.push(row);row=[]}}
 else field+=c;
}
if(field||row.length){row.push(field);records.push(row)}
assert.equal(quoted,false);
const [header,...data]=records,source=data.filter(r=>/^WZ_0(09|10)_/.test(r[1])).slice(0,160).map(r=>Object.fromEntries(header.map((h,n)=>[h,r[n]])));
assert.equal(source.length,160);assert.equal(bank.items.length,160);
for(let n=0;n<160;n++){
 const r=source[n],i=supplement.items[n],mapped=bank.items[n];
 assert.equal(i.id,r.ID);assert.equal(i.goalId,r.DoelID);assert.equal(i.context,r.Context);assert.equal(i.instruction,r.Instructie);assert.equal(i.stimulus,r.Stimulus);assert.equal(i.answerModel,r.Antwoordmodel);assert.equal(i.feedback,r.Feedback);assert.equal(i.answerType,r.Antwoordtype);
 assert.equal(i.band,Number(r.Moeilijkheid));assert.equal(i.level,'A0 tot A1');
 for(const num of [1,2,3]){assert.equal(i.review['sourceReview'+num],r['Review '+num]);assert.ok(['PASS','AANGEPAST; PASS'].includes(r['Review '+num]))}
 assert.ok(['PASS MET GUARDRAIL','AANGEPAST; PASS MET GUARDRAIL'].includes(r.Advocaat));assert.equal(i.review.sourceImplementation,'KLAAR VOOR IMPLEMENTATIE');
 assert.equal(i.sourceConstructions.join('; '),r.Bronconstructie);assert.deepEqual(mapped.source_ref.construct_ids,i.sourceConstructions);
 assert.deepEqual(i.options.map(o=>o.text),['A','B','C'].map(c=>r['Optie '+c]).filter(Boolean));
 if(i.type==='Kies')assert.equal(mapped.correct_answer,i.options.find(o=>o.id===r.Correct).text);
 if(i.type==='Bouw'){assert.equal(i.tokens.join(' ').toLowerCase(),i.answerModel.replace(/[.!?]$/,'').toLowerCase());assert.notEqual(runtime.displayPrompt(mapped),mapped.prompt);assert.deepEqual(runtime.displayPrompt(mapped).split(': ')[1].split(' | ').sort(),[...i.tokens].sort());}
 if(i.answerType==='OPEN'||i.requiresTeacherReview){assert.equal(runtime.answerPolicy(mapped).modelIsExample,true);assert.equal(mapped.correct_answer,null);assert.deepEqual(mapped.accepted_answers,[])}
}
runtime.registerBank(bank,{familyId:'words',excludedEngines:['DICE']});
assert.equal(runtime.items().length,840);assert.equal(new Set(runtime.items().map(i=>i.content_item_id)).size,840);
assert.equal(supplement.items.filter(i=>i.answerType==='OPEN').length,48);assert.equal(supplement.items.filter(i=>i.requiresTeacherReview).length,6);
const unsafe=structuredClone(supplement);unsafe.items[0].review.sourceReview3='OPEN';assert.throws(()=>adapt(unsafe),/niet vrijgegeven/);
for(const topic of ['WZ_009','WZ_010'])for(const difficulty of ['basis','midden','hoog']){
 const filters={family_ids:['words'],topics:[topic],levels:['A0→A1'],difficulty},options={filters,seed:24,targetDurationSeconds:300,selectedGameEngine:'CARDS'};
 const pool=runtime.filterSource(filters);assert.equal(pool.length,{basis:25,midden:28,hoog:27}[difficulty]);
 const a=runtime.createSession(options);assert.deepEqual(runtime.createSession({...options,selectedGameEngine:'BOARD'}).selected_item_ids,a.selected_item_ids);assert.deepEqual(runtime.createSession({...options,selectedGameEngine:'WHEEL'}).selected_item_ids,a.selected_item_ids);
 assert.deepEqual(runtime.restoreSession(a).selected_item_ids,a.selected_item_ids);
 const next=runtime.createSession({...options,recentItemIds:a.selected_item_ids});assert.ok(next.selected_item_ids.every(id=>!a.selected_item_ids.includes(id)),'No early repeats when enough items remain');
 assert.deepEqual(new Set(a.selected_item_ids.map(id=>runtime.itemById(id).language_function)),new Set(pool.map(i=>i.language_function)),'Balanced exercise types include open production');
 assert.ok(!runtime.fullCoverageEngines(filters).includes('DICE'));assert.ok(runtime.fullCoverageEngines(filters,'groups').includes('QUIZ'));
 assert.ok(runtime.fullCoverageEngines({...filters,language_functions:['Bouw']}).includes('SEQUENCE'));
 assert.throws(()=>runtime.createSession({...options,selectedGameEngine:'DICE'}),/spelvorm/);
}
const old=runtime.createSession({filters:{topics:['WZ_001'],levels:['A0→A1']},selectedGameEngine:'CARDS',targetDurationSeconds:300});assert.deepEqual(runtime.restoreSession(old).selected_item_ids,old.selected_item_ids);
console.log('PASS WZ PB002: all source fields, review, 840 unique items, unchanged 680, six flexible answers, levels, bands, balanced mix, rotation, route parity, restoration and suitable games.');
