const assert=require('node:assert/strict');
const BANK_ID='CB-GRAM-001',DRIVE_ID='1ofjEPAW9Crq4CgLWlsUS-FTubsgvEh4S_giFY4vhxCQ';
const INTERACTION={meerkeuze_vorm:'IT_004_MULTIPLE_CHOICE',invullen:'IT_005_FILL_GAP',zinnen_leggen:'IT_008_ORDER',fout_verbeteren:'IT_006_CORRECT_ERROR',betekenis_kiezen:'IT_017_IDENTIFY',scenario:'IT_001_OPEN_ANSWER',snelvraag:'IT_002_RAPID_ANSWER',herschrijven:'IT_007_TRANSFORM_SENTENCE',dialoog_aanvullen:'IT_018_COMPLETE_SENTENCE',functie_sorteren:'IT_017_IDENTIFY',vrije_productie:'IT_012_CREATE_EXAMPLE',meerkeuze_context:'IT_004_MULTIPLE_CHOICE'};
const ANSWER={meerkeuze_vorm:'gesloten',invullen:'gesloten',zinnen_leggen:'gesloten',fout_verbeteren:'geleid_gesloten',betekenis_kiezen:'gesloten',scenario:'open',snelvraag:'open',herschrijven:'open_geleid',dialoog_aanvullen:'open_geleid',functie_sorteren:'gesloten',vrije_productie:'open',meerkeuze_context:'gesloten'};
const DURATION={meerkeuze_vorm:20,invullen:25,zinnen_leggen:30,fout_verbeteren:35,betekenis_kiezen:20,scenario:45,snelvraag:15,herschrijven:45,dialoog_aanvullen:30,functie_sorteren:20,vrije_productie:45,meerkeuze_context:20};
const ROUTE={A2:'A1→A2',B1:'A2→B1',B2:'B1→B2'};
const FIELDS=['content_item_id','content_bank_id','source_bank','domain','topic','lemma','surface_form','cefr_level','taalroute_route','difficulty','learning_goal','language_function','grammar_function','subtopic','exercise_type','interaction_type','answer_type','productive_or_receptive','oral_or_written','individual_or_social','context','register','lexical_load','grammar_load','prompt','stimulus','options','correct_answer','model_answer','accepted_answers','explanation','feedback_correct','feedback_incorrect','estimated_duration_seconds','support_level','openness','media_requirements','technical_tags','review_status','source_review_status','publication_status','rights_status','source_ref','qa_id','version','selection_safety','speaking_safety','legacy_board_safe','order_tokens'];
const split=(s,d)=>String(s||'').split(d).map(x=>x.trim()).filter(Boolean);
const load=d=>d==='basis'?'laag':d==='midden'?'midden':'hoog';
const support=d=>d==='basis'?'meer_steun':d==='midden'?'standaard':'weinig_steun';
function validateSource(source){
 assert.equal(source.schema_version,'GRAM-PB001-RAW-1.0');
 assert.equal(source.bank_id,BANK_ID);assert.equal(source.source_drive_id,DRIVE_ID);
 assert.equal(source.review_status,'REVIEW_GO');assert.equal(source.source_version,'1.2');
 assert.equal(source.records.length,1440);assert.equal(new Set(source.records.map(x=>x.id)).size,1440);
 const allowed={topic:new Set(['ER','ZULLEN','ZOUDEN']),level:new Set(['A2','B1','B2']),exercise_type:new Set(Object.keys(INTERACTION)),mode:new Set(['receptief','productief']),difficulty:new Set(['basis','midden','hoog'])};
 for(const item of source.records){
  for(const [field,set] of Object.entries(allowed))assert.ok(set.has(item[field]),item.id+': '+field+' '+item[field]);
  assert.equal(item.review_status,'REVIEW_GO',item.id);assert.equal(item.version,'1.2',item.id);assert.equal(item.source,'GRAM PB 001',item.id);
  for(const field of ['randomization_safe','spoken_safe','board_safe'])assert.equal(item[field],'ja',item.id+': '+field);
  assert.ok(item.prompt&&item.correct_answer&&item.model_answer,item.id+': required content');
 }
}
function projectRecord(x){
 const answerType=ANSWER[x.exercise_type],closed=['gesloten','geleid_gesloten'].includes(answerType),tags=split(x.tags,'|');
 const item={
  content_item_id:x.id,content_bank_id:BANK_ID,source_bank:'GRAM PB 001',domain:'GRAMMAR',topic:x.topic,lemma:x.lemma,surface_form:x.surface_form,
  cefr_level:x.level,taalroute_route:ROUTE[x.level],difficulty:x.difficulty,
  learning_goal:`Kan ${x.function.replaceAll('_',' ')} met ${x.topic} op ${x.level} ${x.mode==='productief'?'gebruiken':'herkennen'}.`,
  language_function:x.function,grammar_function:x.subfunction,subtopic:x.subfunction,exercise_type:x.exercise_type,interaction_type:INTERACTION[x.exercise_type],
  answer_type:answerType,productive_or_receptive:x.mode,oral_or_written:x.mode==='productief'?'mondeling_of_schriftelijk':'schriftelijk_of_klassikaal',
  individual_or_social:x.mode==='productief'?'individual_or_social':'individual_or_class',context:x.context,register:x.register,lexical_load:load(x.difficulty),grammar_load:load(x.difficulty),
  prompt:x.prompt,stimulus:x.surface_form,options:split(x.options,'||'),correct_answer:x.correct_answer,model_answer:x.model_answer,accepted_answers:closed?[x.correct_answer]:[],
  explanation:x.grammar_note,feedback_correct:x.feedback_correct,feedback_incorrect:x.feedback_incorrect,estimated_duration_seconds:DURATION[x.exercise_type],support_level:support(x.difficulty),
  openness:answerType,media_requirements:[],technical_tags:tags,review_status:'approved',source_review_status:x.review_status,publication_status:'staging_only',rights_status:'owned_original',
  source_ref:`GRAM PB 001|${DRIVE_ID}|Items|${x.id}`,qa_id:'GRAM_REV004',version:x.version,selection_safety:x.randomization_safe,speaking_safety:x.spoken_safe,legacy_board_safe:x.board_safe,
  order_tokens:x.exercise_type==='zinnen_leggen'?x.prompt.split(':').slice(1).join(':').split('/').map(v=>v.trim()).filter(Boolean):[]
 };
 assert.ok(item.interaction_type,item.content_item_id+': interaction');
 if(item.interaction_type==='IT_008_ORDER')assert.ok(item.order_tokens.length>=2,item.content_item_id+': order tokens');
 return item;
}
function projectSource(source){
 validateSource(source);const items=source.records.map(projectRecord);
 assert.equal(items.filter(x=>x.topic==='ER').length,540);assert.equal(items.filter(x=>x.topic==='ZULLEN').length,450);assert.equal(items.filter(x=>x.topic==='ZOUDEN').length,450);
 assert.equal(items.filter(x=>x.technical_tags.includes('MODAAL')).length,900);
 return items;
}
function compactRuntime(source,sourceSha256){
 const items=projectSource(source);
 return {schema_version:'CONTENT000-1.1',adapter_version:'2.0',bank_id:BANK_ID,bank_name:'GRAM PB 001 ER ZULLEN ZOUDEN',source_drive_id:DRIVE_ID,source_sheet:'Items',source_version:'1.2',source_review_status:'REVIEW_GO',source_sha256,qa_id:'GRAM_REV004',publication_scope:'staging_only',item_count:items.length,topics:['ER','ZULLEN','ZOUDEN'],levels:['A2','B1','B2'],fields:FIELDS,records:items.map(item=>FIELDS.map(field=>item[field]))};
}
function inflateRuntime(raw){return {...raw,items:raw.records.map(row=>Object.fromEntries(raw.fields.map((field,i)=>[field,row[i]])))}}
function browserBundle(runtime){return `(function(root){const raw=${JSON.stringify(runtime)};const items=raw.records.map(row=>Object.fromEntries(raw.fields.map((field,i)=>[field,row[i]])));const data=Object.freeze({...raw,items:Object.freeze(items),records:undefined});if(typeof module==='object'&&module.exports)module.exports=data;else{root.DIGIBORD_CONTENT_PB001=data;root.DIGIBORD_CONTENT_VERT001=data;}})(typeof globalThis!=='undefined'?globalThis:this);\n`}
module.exports={BANK_ID,DRIVE_ID,INTERACTION,ANSWER,DURATION,ROUTE,FIELDS,validateSource,projectRecord,projectSource,compactRuntime,inflateRuntime,browserBundle};
