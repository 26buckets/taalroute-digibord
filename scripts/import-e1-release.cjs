// Deterministic adapter for the frozen, current E1.0 sources. No content review.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),raw=fs.readFileSync(path.join(root,'tests/fixtures/e1-release-source.json'),'utf8'),s=JSON.parse(raw),version=s.version;
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const split=x=>String(x||'').split(/\s*\|\|\s*/).filter(Boolean),banks={},reuse={};
function base(id,bank,topic,level,route,gate){assert.ok(['FREE','GUIDED'].includes(gate),id);return {content_item_id:id,content_bank_id:bank,topic,cefr_level:level,final_level:level,route,free_play_gate:gate,e1_canonical:true,version,media_requirements:[],review_status:'REVIEW_GO',publication_status:'published',rights_status:'owned_original',selection_safety:true,speaking_safety:true,options:[],accepted_answers:[],technical_tags:[]};}
function bank(id,name,family,source,items){assert.equal(new Set(items.map(x=>x.content_item_id)).size,items.length,id);banks[id]={bank_id:id,bank_name:name,family_id:family,adapter_version:'E1-R25-1',source_version:version,source_drive_id:source,source_sha256:hash(items),qa_id:'DIGIBORD-REVIEWSTANDARD-001-E1.0',item_count:items.length,items};}
const labels={'CB-GRAM-005':'Woordvolgorde','CB-GRAM-006':'Werkwoordstijden','CB-GRAM-007':'Voorzetsels en voornaamwoorden','CB-GRAM-008':'Voegwoorden en bijzinnen','CB-GRAM-009':'Lidwoorden, adjectieven en negatie','CB-GRAM-010':'Scheidbare werkwoorden en te-infinitief'};
for(const [id,b] of Object.entries(s.grammar)){
 const reviews=new Map((b.review||[]).map(x=>[x.id,x]));
 const items=b.items.map((x,index)=>{
  const r=reviews.get(x.id)||x,level=r.final_level||x.level,route=r.route||x.route,gate=r.gate||x.free_play_gate,topic=id==='CB-GRAM-003'?x.lemma.toUpperCase():x.topic;
  assert.ok(level&&route&&gate,x.id);
  const item={...base(x.id,id,topic,level,route,gate),domain:'GRAMMAR',topic_label:labels[id]||({RELATIEVE_BIJZIN:'Relatieve bijzin'}[topic])||topic,language_function:x.function,exercise_type:x.exercise_type,interaction_type:x.interaction_type_canonical,answer_type:x.answer_type_canonical,productive_or_receptive:x.mode,difficulty:x.difficulty,context:x.context,register:x.register,prompt:x.prompt,options:split(x.options),correct_answer:x.correct_answer||null,model_answer:x.model_answer,accepted_answers:split(x.accepted_solutions||x.correct_answer),feedback_correct:x.feedback_correct,feedback_incorrect:x.feedback_incorrect,feedback:{correct:x.feedback_correct,incorrect:x.feedback_incorrect},explanation:x.grammar_note,help:x.grammar_note,technical_tags:String(x.tags||'').split('|'),learning_goal:x.learning_goal,oral_or_written:x.oral_or_written,estimated_duration_seconds:+x.estimated_duration_seconds,support_level:x.support_level,openness:x.openness,microconstructure:x.microconstructie||x.subfunction||x.function,source_ref:{drive_id:b.id,sheet:'Items',row:index+2,source_id:x.id,source_level:x.level,source_version:x.version,review_sheet:b.review?'GRAM_REV_E1':'Items',norm_version:x.norm_version||r.review_standard}};
  // Preserve the source's exercise and answer enums; the renderer handles their existing contracts.
  return item;
 });
 bank(id,labels[id]||b.name,'grammar',b.id,items);
 for(const ref of b.refs){assert.ok(ref.source_item_id);(reuse[ref.source_item_id]??=[]).push({bank_id:id,topic:items[0].topic,topic_label:labels[id],family_id:'grammar',microconstructure:ref.micro_id,route:ref.route,source_gate:ref.source_gate||'FREE'});}
}
const identities={'CB-C1-002':['CB-NUANCE-002','nuancewoorden','Nuancewoorden en register'],'CB-C1-003':['CB-WORK-003','werkvloertaal','Werkvloertaal'],'CB-C1-004':['CB-MEETING-004','vergadertaal','Vergadertaal'],'CB-C1-005':['CB-IMPLICIT-005','impliciete-boodschap','Impliciete boodschap'],'CB-C1-006':['CB-HUMOR-006','humor-ironie','Humor en ironie'],'CB-C1-007':['CB-CONNOTATION-007','betekenisnuances','Betekenisnuances'],'CB-C1-008':['CB-REPHRASE-008','herformuleren','Zinnen anders zeggen'],'CB-C1-009':['CB-REPAIR-009','gesprek-repareren','Gesprek repareren'],'CB-C1-010':['CB-MEDIATION-010','samenvatten-bemiddelen','Samenvatten en bemiddelen'],'CB-C1-011':['CB-PERSUASION-011','overtuigen-onderhandelen','Overtuigen en onderhandelen']};
for(const [sourceId,b] of Object.entries(s.c1)){
 if(sourceId==='CB-C1-001')continue; // Exact live parity: retain the existing 50-item bank and its session identities.
 const [id,topic,label]=identities[sourceId],clean=x=>String(x||'').replace(/\*/g,'');
 const items=b.cards.map(c=>{const m=c.metadata,gate=m.free_play_gate,options=c.options.map((o,i)=>'ABC'[i]+'. '+clean(o)),letter=m.active_answer||c.letter,answer=options['ABC'.indexOf(letter)],explanation=clean(c.explanation)+'\n\n'+clean(c.note);assert.ok(answer,c.id);
 return {...base(c.id,id,topic,m.final_level,m.route,gate),canonical_bank_id:sourceId,domain:'CONVERSATION',topic_label:label,language_function:m.domain,title:clean(m.app_title||m.expression||c.title),context:clean(c.context),prompt:clean(c.prompt),exercise_type:'betekenis_kiezen',interaction_type:'IT_004_MULTIPLE_CHOICE',answer_type:gate==='GUIDED'?'open_geleid':'gesloten',openness:gate==='GUIDED'?'open_geleid':'gesloten',productive_or_receptive:'receptief',difficulty:'midden',options,correct_answer:gate==='GUIDED'?null:answer,model_answer:answer,feedback_correct:explanation,feedback_incorrect:explanation,explanation,learning_goal:label+': '+clean(m.app_title||m.expression||c.title),technical_tags:[topic],estimated_duration_seconds:90,microconstructure:m.domain,source_ref:{drive_id:b.document_id,source_id:c.id,canonical_bank_id:sourceId,source_revision:b.revision_id,source_version:'E1.0',review_drive_id:s.register,review_sheet:'C1 B'+sourceId.slice(-3)+' review E1.0',active_answer:letter,audit_override:c.audit_override||null}};});
 bank(id,label,'conversation',b.document_id,items);
}
for(let n=0;n<7;n++){
 const id='CB-SNEL-'+String(n+1).padStart(3,'0'),records=s.quick.filter(x=>x.ID.startsWith('sq-r'+n+'-'));
 assert.equal(records.length,500,id);
 const items=records.map(x=>{const route=x.Taalroute.replace(/\s/g,''),level=['A1','A1+','A2','B1','B2','C1','C2'][n],shape=x.ID.split('-')[2],topic=({circle:'vertel',square:'vraag',triangle:'kies',diamond:'regel'})[shape],goal=x.Oefendoel;
 return {...base(x.ID,id,topic,level,route,'FREE'),domain:'QUICK',topic_label:({circle:'Vertel',square:'Stel een vraag',triangle:'Kies',diamond:'Regel iets'})[shape],language_function:x.Thema,title:x.Thema,context:'',prompt:x.Opdrachttekst,exercise_type:'snelvraag',interaction_type:'IT_002_RAPID_ANSWER',answer_type:'open',openness:'open',productive_or_receptive:'productief',difficulty:'basis',model_answer:x['Mogelijk antwoord']||'',correct_answer:null,explanation:goal,feedback_correct:goal,feedback_incorrect:goal,help:x.Hulp,learning_goal:goal,estimated_duration_seconds:60,support_level:x.Steunniveau,technical_tags:[topic],source_ref:{drive_id:'17EMtunM2p7XPJZZ8JKIHOy2Ilz7XaBTDfyve2vwuKHw',sheet:'Kaarten',source_id:x.ID,source_version:x.Versie},case_id:x['Casus-ID'],teacher_focus:x.Docentfocus,teacher_nuance:x.Docentnuance,privacy_choice:x.Privacykeuze};});
 bank(id,'Snelvragen','quick','17EMtunM2p7XPJZZ8JKIHOy2Ilz7XaBTDfyve2vwuKHw',items);
}
// Reconcile only actual WZ differences. PB005 stays byte-for-byte unchanged.
const wz=require('../data/wz-reviewed.js');
const wzDifferences=[];
for(const [id,records] of Object.entries(s.wz)){
 const old=wz.banks[id],byId=new Map(records.map(x=>[x.ID,x])),items=structuredClone(old.items);let changed=false;
 for(const i of items){if(i.revocation_status==='HARD_REVOKED')continue;const x=byId.get(i.content_item_id);assert.ok(x);
  const open=x.Antwoordtype==='OPEN',patch={context:x.Context,answer_type:open?'open':'gesloten',openness:open?'open':'gesloten',interaction_type:open?'IT_001_OPEN_ANSWER':i.interaction_type,correct_answer:open?null:i.correct_answer,accepted_answers:open?[]:i.accepted_answers};
  for(const [key,value] of Object.entries(patch))if(JSON.stringify(i[key])!==JSON.stringify(value)){wzDifferences.push({id:i.content_item_id,field:key,before:i[key],after:value});i[key]=value;changed=true;}
 }
 if(changed){for(const i of items)i.version=version;banks[id]={...old,items,source_version:version,source_sha256:hash(items)};}
}
const cardMeta=new Map(s.card_audit.filter(x=>x.final_route&&['FREE','GUIDED'].includes(x.gate)).map(x=>[x.item_id||x.id,x]));
const cards=s.cards.cards.filter(c=>!['tongue','story'].includes(c.appFamily)).map(c=>{const m=cardMeta.get(c.id);assert.ok(m,c.id);return {...c,e1_canonical:true,finalRoute:m.final_route,finalLevel:m.final_level,freePlayGate:m.gate,route:m.final_route,targetLevel:m.final_level,version,e1FinalStatus:'RELEASE'};});
assert.equal(cards.length,240);assert.equal(cards.filter(x=>x.freePlayGate==='FREE').length,129);assert.equal(cards.filter(x=>x.freePlayGate==='GUIDED').length,111);
const tongues=Object.fromEntries([...cardMeta].filter(([,m])=>m.bank==='Tongbrekers').map(([id,m])=>[id,{route:m.final_route,level:m.final_level,gate:m.gate,text:m.title}]));
assert.equal(Object.keys(tongues).length,240);
const existingMetadata=Object.fromEntries(s.c1['CB-C1-001'].cards.map(c=>[c.id,{route:c.metadata.route,free_play_gate:c.metadata.free_play_gate,microconstructure:c.metadata.domain}]));
const data={version,existingMetadata,source_sha256:hash(raw),banks,reuse,cards,tongues,identities,wzDifferences,sourceIssues:[{id:'WZ_027_B10',master_gate:'BLOCKED',final_review_gate:'GUIDED',decision:'Retain the final closure gate and report PARITY ISSUE; no new review.'}]};
const output='// Generated from canonical E1.0 snapshots by scripts/import-e1-release.cjs.\n(function(root){const data='+JSON.stringify(data)+';if(typeof module==="object"&&module.exports)module.exports=data;else if(!root.DigiBordArchiveReview)root.E1Release=data;})(typeof globalThis!=="undefined"?globalThis:this);\n',target=path.join(root,'data/e1-release.js');
if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output,'E1.0 projection differs from its canonical snapshot');
console.log('PASS E1 adapter:',Object.keys(banks).length,'banks;',Object.keys(reuse).length,'reused source IDs;',cards.length,'cards;',Object.keys(tongues).length,'tongue records');
