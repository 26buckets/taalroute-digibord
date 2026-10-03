const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),review=require('../tests/fixtures/mr03-review.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const raw=fs.readFileSync(path.join(root,'tests/fixtures/mr03-source.json'),'utf8');
assert.equal(hash(raw),'8f5c43958d6a292b449f77428efef9b58e92acf557a192ee642f8f902a409ce2');
assert.equal(hash(fs.readFileSync(path.join(root,'tests/fixtures/mr03-review.json'))),'840376a260f88f1debe66a42f75859b5e4c79ba1bb9437dec2f7594ff1ed1dae');
assert.equal(review.items.length,12);
const version=review.version,bankId='CB-MR03-013',source='mr03';
const guidance={sources:{[source]:{title:'Verbanden begrijpen · herstelde MR03-taken',url:review.items[0].source_ref.url,version}},examples:{},bindings:{}};
const sections={bronblokken:'Een verband uitleggen',twee_zinnen:'Zinnen verbinden',zinstrips:'Een tekst verbeteren',twee_kolommen:'Wat weten we zeker?'};
const items=review.items.map(r=>{
 const id=r.id,goal=r.presentation.layout==='zinstrips'?'Een tekst natuurlijker maken zonder de betekenis te veranderen.':r.presentation.layout==='twee_zinnen'?'Zinnen verbinden en het bedoelde verband duidelijk maken.':'Een verband uitleggen en aangeven wat de tekst wel en niet bewijst.';
 assert.equal(r.source_ref.source_sha256,hash(raw));assert.equal(r.auto_score,false);assert.equal(r.correct_answer,null);
 guidance.examples[id]={goal,evidence:r.teacher.next_step,source};
 guidance.bindings[id]={item_version:version,bank_id:bankId,erk:{status:'reviewed',version,source,levels:['B2'],skill:'Lezen en uitleggen',goal,evidence:'Eigen voorlopig advies bij deze open teksttaak; geen formele niveautoets.'+(r.extension_note?' '+r.extension_note:'')},bow:{example:id,criteria:['goal','activate','support','feedback','close']}};
 return {content_item_id:id,content_bank_id:bankId,version,domain:'READING',topic:'verbanden',topic_label:'Verbanden begrijpen',cefr_level:'B2',language_function:sections[r.presentation.layout],title:r.title,context:r.context,prompt:r.prompt,
 exercise_type:'redeneren',interaction_type:'IT_001_OPEN_ANSWER',answer_type:'open',openness:'open',productive_or_receptive:'productief',difficulty:'midden',options:[],correct_answer:null,model_answer:r.teacher.example_answer,accepted_answers:[],feedback_correct:'Bespreek het antwoord samen.',feedback_incorrect:'Bespreek het antwoord samen.',explanation:r.teacher.acceptance_points.join('\n')+'\n\n'+r.teacher.avoid,learning_goal:goal,technical_tags:['mr03'],estimated_duration_seconds:180,media_requirements:[],review_status:'REVIEW_GO',publication_status:'staging_only',rights_status:'owned_original',selection_safety:true,speaking_safety:true,
 reasoning:{presentation:r.presentation,hint:r.hint,teacher:r.teacher,extension_note:r.extension_note},source_ref:{...r.source_ref,review_version:version,changes:r.changes}};
});
const bank={bank_id:bankId,bank_name:'Teksten begrijpen',family_id:'reading',source_version:version,source_sha256:hash(raw+JSON.stringify(review)),item_count:items.length,items,guidance};
const output='// Generated from the retained MR03 source and reviewed repairs.\n(function(root){const bank='+JSON.stringify(bank,null,1)+';\nif(typeof module===\'object\'&&module.exports)module.exports=bank;else root.DIGIBORD_MR03=bank;})(typeof globalThis!==\'undefined\'?globalThis:this);\n';
if(require.main===module){const target=path.join(root,'data/mr03.js');if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output);console.log('PASS: MR03 source and reviewed repair hashes; 12 reproducible tasks.');}
module.exports={bank,review,output};
