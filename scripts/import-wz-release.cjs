// Reproduce the approved Drive edition; historical banks and review snapshots stay intact.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),raw=fs.readFileSync(path.join(root,'tests/fixtures/wz-release-source.json'),'utf8'),source=JSON.parse(raw),version=source.version;
const wording=require('../wording.js');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const mapping={Bouw:['zinnen_leggen','IT_008_ORDER'],Kies:['meerkeuze_vorm','IT_004_MULTIPLE_CHOICE'],Herstel:['fout_verbeteren','IT_006_CORRECT_ERROR'],Verander:['herschrijven','IT_007_TRANSFORM_SENTENCE'],Spreek:['vrije_productie','IT_001_OPEN_ANSWER'],Transfer:['scenario','IT_001_OPEN_ANSWER']};
// The final release review supersedes these eight stale budget-2 cells (known lower building blocks).
const correctedBudgets=new Set(['WZ_006_H10','WZ_006_V16','WZ_006_S12','WZ_007_B05','WZ_007_K02','WZ_007_H12','WZ_007_V04','WZ_007_V18']);
const counts={},ids=new Set(),banks={};
for(const master of source.masters){
 const items=master.rows.map((original,index)=>{
  const x=Object.fromEntries(Object.entries(original).map(([k,v])=>[k,typeof v==='string'?wording.text(v):v]));
  const review=source.reviews[x.ID],active=['RELEASE','GUIDED'].includes(review?.FinalStatus),open=x.Antwoordtype==='OPEN',gate=active?review.FinalGate:'BLOCKED',route=x['Nieuwe route'];
  assert.ok(review&&!ids.has(x.ID),x.ID);ids.add(x.ID);
  assert.equal(review.SourceSpreadsheetID,master.spreadsheet_id,x.ID);assert.equal(review.SourceRow,String(index+2),x.ID);
  if(active){
   assert.equal(x.FreePlayGate,gate,x.ID);assert.equal(review.Microconstructie,x.Microconstructie,x.ID);
   assert.equal(review.R08,'PASS_'+route,x.ID);assert.equal(review.Severity,'NONE',x.ID);
   for(let n=1;n<=26;n++)assert.match(review['R'+String(n).padStart(2,'0')],/^(PASS|N\/A)/,x.ID+' R'+n);
   assert.match(review.TweedeNacht,/^PASS/);assert.match(review.Advocaat,/^PASS/);
   assert.ok(gate==='FREE'?(+x.ComplexityBudget===1||correctedBudgets.has(x.ID)):[1,2].includes(+x.ComplexityBudget),x.ID);
   const key=route+' '+gate;counts[key]=(counts[key]||0)+1;
  }
  const [exercise,interaction]=mapping[x.Oefentype],options=['A','B','C'].map(k=>x['Optie '+k]||'').filter(Boolean),model=x.Antwoordmodel==='Open antwoord'?'':x.Antwoordmodel;
  if(active&&x.Oefentype==='Kies'){assert.ok(options.length>=2,x.ID);assert.equal(new Set(options).size,options.length,x.ID);assert.ok(options.includes(x['Optie '+x.Correct]),x.ID)}
  const tokens=x.Oefentype==='Bouw'?x.Stimulus.split('|').map(t=>t.trim()).filter(Boolean):[];
  const item={content_item_id:x.ID,content_bank_id:master.bank_id,source_bank:'Woorden en zinnen',domain:'WORDS',topic:x.DoelID,topic_label:x.Taaldoel,cefr_level:route,language_function:x.Oefentype,exercise_type:exercise,interaction_type:open?'IT_001_OPEN_ANSWER':interaction,answer_type:open?'open':'gesloten',openness:open?'open':'gesloten',productive_or_receptive:x.Oefentype==='Kies'?'receptief':'productief',difficulty:['basis','midden','hoog'][+x.Moeilijkheid-1],context:x.Context,prompt:x.Instructie+(x.Stimulus?': '+x.Stimulus:''),stimulus:x.Stimulus,options,correct_answer:open?null:(x.Oefentype==='Kies'?x['Optie '+x.Correct]:model),model_answer:model,accepted_answers:open?[]:[model],feedback_correct:x.Feedback,feedback_incorrect:x.Feedback,explanation:x.Feedback,technical_tags:(x.Tags||'').split(';').map(t=>t.trim()).filter(Boolean),learning_goal:x.Taaldoel,estimated_duration_seconds:open?60:30,support_level:+x.Moeilijkheid===1?'meer_steun':+x.Moeilijkheid===2?'midden':'weinig_steun',oral_or_written:open?'mondeling':'schriftelijk_of_klassikaal',media_requirements:[],review_status:active?'REVIEW_GO':'REVIEW_REJECTED',publication_status:active?'published':'staging_only',rights_status:'owned_original',version,selection_safety:true,speaking_safety:true,source_ref:{drive_id:master.spreadsheet_id,sheet:'Masterbank',row:index+2,source_id:x.ID,original_level:x.Niveau,original_complexity_budget:+x.ComplexityBudget,review_sheet:review.sheet,review_drive_id:review.review_spreadsheet_id,review_version:review.ReviewVersion},'Nieuwe route':route,Microconstructie:x.Microconstructie,FreePlayGate:gate,ComplexityBudget:correctedBudgets.has(x.ID)?1:+x.ComplexityBudget,NormVersion:x.NormVersion,Reclassificatie:x.Reclassificatie,release_review:{status:review.FinalStatus,canonical_id:review.CanonicalID,human_pilot:review.HumanPilot}};
  if(!active)item.revocation_status='HARD_REVOKED';
  if(tokens.length){item.order_tokens=tokens;item.expected_tokens=tokens}
  return item;
 });
 banks[master.bank_id]={bank_id:master.bank_id,bank_name:'Woorden en zinnen',family_id:'words',adapter_version:'WZ-RELEASE-1.0',source_version:version,source_drive_id:master.spreadsheet_id,source_sha256:hash(JSON.stringify(items)),qa_id:'DB-REVIEW-001-E1.0',item_count:items.length,items};
}
assert.equal(ids.size,3560);assert.deepEqual(counts,{'A0→A1 FREE':535,'A1→A2 FREE':1276,'A2→B1 FREE':708,'A1→A2 GUIDED':93,'A2→B1 GUIDED':86});
const data={version,source_sha256:hash(raw),counts,banks};
const output='// Generated by scripts/import-wz-release.cjs from the frozen Drive review edition.\n(function(root){const data='+JSON.stringify(data)+';if(typeof module==="object"&&module.exports)module.exports=data;else root.WZReviewed=data;})(typeof globalThis!=="undefined"?globalThis:this);\n';
const target=path.join(root,'data/wz-reviewed.js');
if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output);
console.log('PASS WZ release: 3560 traced records, 2519 FREE, 179 GUIDED, 862 withheld; canonical texts and review evidence.');
