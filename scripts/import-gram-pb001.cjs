const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const stagingPath=path.join(root,'staging/gram-pb001-v1.2-source.json');
const targetPath=path.join(root,'data/content-vert001-er-b1.js');
const backupDir=path.join(root,'bank-backups');

const INTERACTION={
 meerkeuze_vorm:'IT_004_MULTIPLE_CHOICE',invullen:'IT_005_FILL_GAP',zinnen_leggen:'IT_008_ORDER',
 fout_verbeteren:'IT_006_CORRECT_ERROR',betekenis_kiezen:'IT_017_IDENTIFY',scenario:'IT_001_OPEN_ANSWER',
 snelvraag:'IT_002_RAPID_ANSWER',herschrijven:'IT_007_TRANSFORM_SENTENCE',dialoog_aanvullen:'IT_018_COMPLETE_SENTENCE',
 functie_sorteren:'IT_017_IDENTIFY',vrije_productie:'IT_012_CREATE_EXAMPLE',meerkeuze_context:'IT_004_MULTIPLE_CHOICE'
};
const ANSWER={
 meerkeuze_vorm:'gesloten',invullen:'gesloten',zinnen_leggen:'gesloten',fout_verbeteren:'geleid_gesloten',
 betekenis_kiezen:'gesloten',scenario:'open',snelvraag:'open',herschrijven:'open_geleid',dialoog_aanvullen:'open_geleid',
 functie_sorteren:'gesloten',vrije_productie:'open',meerkeuze_context:'gesloten'
};
const DURATION={meerkeuze_vorm:20,invullen:25,zinnen_leggen:30,fout_verbeteren:35,betekenis_kiezen:20,scenario:45,snelvraag:15,herschrijven:45,dialoog_aanvullen:30,functie_sorteren:20,vrije_productie:45,meerkeuze_context:20};
const ROUTE={A2:'A1→A2',B1:'A2→B1',B2:'B1→B2'};
const SUPPORT={basis:'meer_steun',midden:'standaard',hoog:'weinig_steun'};
const TOPICS=new Set(['ER','ZULLEN','ZOUDEN']),LEVELS=new Set(['A2','B1','B2']),MODES=new Set(['productief','receptief']),DIFFICULTIES=new Set(['basis','midden','hoog']);
const FIELDS=['id','topic','lemma','surface_form','level','function','subfunction','exercise_type','mode','difficulty','context','register','prompt','options','correct_answer','model_answer','feedback_correct','feedback_incorrect','grammar_note','tags','randomization_safe','spoken_safe','board_safe','review_status','version','source'];
const REQUIRED=['id','topic','lemma','surface_form','level','function','subfunction','exercise_type','mode','difficulty','context','register','prompt','correct_answer','model_answer','feedback_correct','feedback_incorrect','grammar_note','tags','randomization_safe','spoken_safe','board_safe','review_status','version','source'];

function sourceHash(items){return crypto.createHash('sha256').update(JSON.stringify(items)).digest('hex')}
function split(value,separator){return String(value||'').split(separator).map(x=>x.trim()).filter(Boolean)}
function validateSource(source){
 assert.equal(source.schema_version,'GRAM-PB001-STAGING-1.0');
 assert.equal(source.source_drive_id,'1ofjEPAW9Crq4CgLWlsUS-FTubsgvEh4S_giFY4vhxCQ');
 assert.equal(source.source_version,'1.2');
 assert.equal(source.review_gate,'REVIEW_GO');
 assert.equal(source.publication_status,'staging_only');
 assert.equal(source.item_count,1440);
 assert.deepEqual(source.fields,FIELDS);
 assert.equal(source.items.length,1440);
 assert.equal(sourceHash(source.items),source.source_sha256,'Staging source hash verschilt');
 const ids=new Set();
 for(const item of source.items){
  for(const field of REQUIRED)assert.notEqual(String(item[field]??'').trim(),'',item.id+': leeg veld '+field);
  assert.ok(!ids.has(item.id),'Dubbel ID: '+item.id);ids.add(item.id);
  assert.ok(TOPICS.has(item.topic),item.id+': topic');
  assert.ok(LEVELS.has(item.level),item.id+': level');
  assert.ok(MODES.has(item.mode),item.id+': mode');
  assert.ok(DIFFICULTIES.has(item.difficulty),item.id+': difficulty');
  assert.ok(INTERACTION[item.exercise_type],item.id+': exercise_type');
  assert.equal(item.review_status,'REVIEW_GO',item.id+': review_status');
  assert.equal(item.version,'1.2',item.id+': version');
  for(const flag of ['randomization_safe','spoken_safe','board_safe'])assert.equal(String(item[flag]).toLowerCase(),'ja',item.id+': '+flag);
  if(item.topic==='ZULLEN'||item.topic==='ZOUDEN')assert.ok(split(item.tags,'|').includes('MODAAL'),item.id+': MODAAL ontbreekt');
 }
 return true;
}
function projectItem(item,index){
 const ex=item.exercise_type,answerType=ANSWER[ex],options=split(item.options,'||'),tags=split(item.tags,'|');
 return {
  content_item_id:item.id,content_bank_id:'CB-GRAM-001',source_bank:'GRAM PB 001',domain:'GRAMMAR',
  topic:item.topic,lemma:item.lemma,surface_form:item.surface_form,cefr_level:item.level,taalroute_route:ROUTE[item.level],
  language_function:item.function,subtopic:item.subfunction,grammar_function:item.subfunction,
  exercise_type:ex,interaction_type:INTERACTION[ex],answer_type:answerType,productive_or_receptive:item.mode,difficulty:item.difficulty,
  context:item.context,register:item.register,prompt:item.prompt,stimulus:'',options,correct_answer:item.correct_answer,model_answer:item.model_answer,
  accepted_answers:['gesloten','geleid_gesloten'].includes(answerType)?[item.correct_answer]:[],
  feedback_correct:item.feedback_correct,feedback_incorrect:item.feedback_incorrect,
  feedback:{correct:item.feedback_correct,incorrect:item.feedback_incorrect},explanation:item.grammar_note,technical_tags:tags,
  learning_goal:'Kan '+item.topic+' gebruiken voor '+item.function.replaceAll('_',' ')+' op niveau '+item.level+'.',
  oral_or_written:item.mode==='productief'?'mondeling_of_schriftelijk':'schriftelijk_of_klassikaal',
  individual_or_social:['scenario','dialoog_aanvullen'].includes(ex)?'sociaal_of_individueel':'individueel_of_klassikaal',
  lexical_load:item.difficulty,grammar_load:item.difficulty,estimated_duration_seconds:DURATION[ex],
  support_level:SUPPORT[item.difficulty]||'standaard',openness:answerType,media_requirements:[],
  review_status:'REVIEW_GO',publication_status:'staging_only',rights_status:'owned_original',qa_id:'GRAM_REV004',version:'1.2',
  selection_safety:true,speaking_safety:true,legacy_board_safe:true,
  source_ref:{drive_id:'1ofjEPAW9Crq4CgLWlsUS-FTubsgvEh4S_giFY4vhxCQ',sheet:'Items',row:index+2,source:item.source}
 };
}
function projectSource(source){
 validateSource(source);
 const items=source.items.map(projectItem);
 return {
  schema_version:'CONTENT000-2.0',bank_id:'CB-GRAM-001',bank_name:'GRAM PB 001 ER ZULLEN ZOUDEN',adapter_version:'2.0',
  source_drive_id:source.source_drive_id,source_sheet:source.source_sheet,source_version:source.source_version,source_sha256:source.source_sha256,
  qa_id:'GRAM_REV004',staging_status:'staging_only',item_count:items.length,topics:['ER','ZULLEN','ZOUDEN'],levels:['A2','B1','B2'],family_tags:['MODAAL'],items
 };
}
function renderProjection(projected){
 return "(function(root){\n const data="+JSON.stringify(projected)+";\n if(typeof module==='object'&&module.exports)module.exports=data;else root.DIGIBORD_CONTENT_VERT001=data;\n})(typeof globalThis!=='undefined'?globalThis:this);\n";
}
function backupTarget(){
 fs.mkdirSync(backupDir,{recursive:true});
 if(!fs.existsSync(targetPath))return null;
 const stamp=new Date().toISOString().replace(/[:.]/g,'-'),file=path.join(backupDir,'gram-pb001-runtime-'+stamp+'.js');
 fs.copyFileSync(targetPath,file,fs.constants.COPYFILE_EXCL);
 return file;
}
function writeProjection(output){
 const backup=backupTarget(),tmp=targetPath+'.tmp';
 fs.writeFileSync(tmp,output,{flag:'wx'});fs.renameSync(tmp,targetPath);
 return backup;
}
function rollback(file){
 const absolute=path.resolve(root,file);
 if(!absolute.startsWith(backupDir+path.sep))throw new Error('Rollbackbestand moet in bank-backups staan.');
 if(!fs.existsSync(absolute))throw new Error('Rollbackbestand bestaat niet: '+file);
 const tmp=targetPath+'.rollback.tmp';fs.writeFileSync(tmp,fs.readFileSync(absolute),{flag:'wx'});fs.renameSync(tmp,targetPath);
 return absolute;
}
function load(){return JSON.parse(fs.readFileSync(stagingPath,'utf8'))}

if(require.main===module){
 const arg=process.argv[2];
 if(arg==='--rollback'){
  const file=process.argv[3];if(!file)throw new Error('Gebruik --rollback bank-backups/<bestand>.js');
  console.log('Rollback:',rollback(file));process.exit(0);
 }
 const source=load(),projected=projectSource(source),output=renderProjection(projected);
 if(process.argv.includes('--write')){
  const backup=writeProjection(output);console.log('Back-up:',backup||'geen bestaand doelbestand');
 }else{
  assert.ok(fs.existsSync(targetPath),'Runtimeprojectie ontbreekt');
  assert.equal(fs.readFileSync(targetPath,'utf8'),output,'Runtimeprojectie verschilt van staging. Gebruik --write na review.');
 }
 console.log('PASS: GRAM PB 001 staging 1440 -> CONTENT 000 runtime 1440; source hash, IDs, enums en projectie gelijk.');
}
module.exports={INTERACTION,ANSWER,DURATION,ROUTE,SUPPORT,FIELDS,REQUIRED,validateSource,projectItem,projectSource,renderProjection,sourceHash,writeProjection,rollback,load};
