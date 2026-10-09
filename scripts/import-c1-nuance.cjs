const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),raw=fs.readFileSync(path.join(root,'tests/fixtures/c1-nuance-source.md'),'utf8'),review=require('../tests/fixtures/c1-nuance-review.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(raw),review.source_sha256,'Source changed: review again before importing.');
const parsed=require('./read-choice-cards.cjs')(raw);
assert.equal(parsed.length,80);assert.equal(Object.keys(review.items).length,80);
const guidance={sources:{nuance:{title:'Nuancewoorden en register · bron en lokale redactie',url:review.source_url,version:review.version},cefr2020:{title:'ERK Companion Volume 2020',url:'https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4',version:'2020 · pagina 60, 137 en 141'}},examples:{},bindings:{}};
const counts={A:0,B:0,C:0},originals=[];
const items=parsed.map(original=>{
 const id=original.id;counts[original.letter]++;originals.push(original);
 const r=review.items[id];assert.ok(r&&r.review==='GO',id);assert.ok(['B1','B2','C1'].includes(r.level));assert.ok(['canonical','discuss'].includes(r.scoring));
 assert.ok(Object.keys(r.patch).every(k=>['context','prompt','options','explanation','note'].includes(k)),id);
 const task={...original,...r.patch},discussion=r.scoring==='discuss',topic=discussion?'passende-toon':'betekenis-woorden',label=discussion?'Passende toon':'Betekenis van woorden';
 const options=task.options.map((s,i)=>'ABC'[i]+'. '+s),answer=options['ABC'.indexOf(task.letter)];
 const explanation=task.explanation+'\n\n'+task.note+(discussion?'\n\nBespreek waarom dit antwoord past. Een andere formulering kan ook goed zijn.':'');
 guidance.examples[id]={goal:'Je oefent: '+task.title+'.',evidence:'Lestip bij kaart '+id+': vergelijk de antwoorden, leg je keuze uit en bespreek de verschillen.',source:'nuance'};
 guidance.bindings[id]={item_version:review.version,bank_id:'CB-NUANCE-002',erk:{status:'reviewed',version:review.version,source:'cefr2020',levels:[r.level],skill:'Lezen en betekenis begrijpen',goal:label+': '+task.title,evidence:r.level_reason+' Eigen niveauadvies; de bronreeks noemt C1. Geen formele niveautoets.'},bow:{example:id,criteria:['goal','activate','support','feedback','close']}};
 return {content_item_id:id,content_bank_id:'CB-NUANCE-002',version:review.version,domain:'CONVERSATION',topic,topic_label:label,cefr_level:r.level,language_function:label,title:task.title,context:task.context,prompt:task.prompt,
  exercise_type:'betekenis_kiezen',interaction_type:'IT_004_MULTIPLE_CHOICE',answer_type:discussion?'open_geleid':'gesloten',openness:discussion?'open':'gesloten',productive_or_receptive:'receptief',difficulty:'midden',options,correct_answer:discussion?null:answer,model_answer:answer,accepted_answers:[],feedback_correct:explanation,feedback_incorrect:explanation,explanation,learning_goal:label+': '+task.title,
  technical_tags:['nuance-register'],estimated_duration_seconds:90,media_requirements:[],review_status:'REVIEW_GO',publication_status:'staging_only',rights_status:'owned_original',selection_safety:true,speaking_safety:true,
  source_ref:{drive_url:review.source_url,card_id:id,source_level:review.source_level,source_sha256:review.source_sha256,review_version:review.version,review_scope:review.scope,changes:Object.keys(r.patch),change_reason:r.change_reason}};
});
assert.equal(new Set(items.map(i=>i.content_item_id)).size,80);assert.equal(new Set(items.map(i=>i.context+'\n'+i.prompt)).size,80);assert.deepEqual(counts,review.actual_answer_counts);
const bank={bank_id:'CB-NUANCE-002',bank_name:'Taal in gesprekken',family_id:'conversation',source_version:review.version,source_drive_id:'11UCnlRwX9MPEL1dcjnDjAXDgGPyC7aol',source_sha256:hash(raw+JSON.stringify(review)),qa_id:'NUANCE-LOCAL-20260922',item_count:items.length,items,guidance};
const output='// Generated from the retained source and explicit review; run scripts/import-c1-nuance.cjs --write.\n(function(root){\n const bank='+JSON.stringify(bank,null,1)+';\n if(typeof module===\'object\'&&module.exports)module.exports=bank;else root.DIGIBORD_NUANCE=bank;\n})(typeof globalThis!==\'undefined\'?globalThis:this);\n';
const target=path.join(root,'data/c1-nuance.js');
if(require.main===module){if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output,'Run reviewed import --write.');console.log('PASS: 80 source cards, explicit review, unique IDs and questions, answer counts, reproducible import.');}
module.exports={bank,originals,review,output};
