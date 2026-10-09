const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),review=require('../tests/fixtures/snelvragen-review.json'),source=require('../tests/fixtures/snelvragen-source.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [file,expected] of [['tests/fixtures/snelvragen-source.json',review.source_sha256],['Lessen/directe-vragen.json',review.legacy_sha256],['Lessen/opdrachtenmatrix.json',review.board_sha256]])assert.equal(hash(fs.readFileSync(path.join(root,file))),expected,file+' changed; review required.');
const legacy=require('../Lessen/directe-vragen.json'),bankId='CB-QUICK-014',version=review.version;
const rows=new Map(source.cards.slice(1).map(r=>[r[0],r])),direct=new Map(legacy.cards.map(c=>[c.id,c])),regel=new Map(source.regel_iets.items.map(c=>[c.id,c]));
assert.equal(review.items.length,3785);assert.equal(new Set(review.items.map(r=>r.id)).size,3785);
const actions={circle:['quick-tell','Vertel'],square:['quick-ask','Stel een vraag'],triangle:['quick-choose','Kies'],diamond:['quick-arrange','Regel iets']};
const guidance={sources:{quick:{title:'Snelvragen · bestaande bronnen en lokale beoordeling',url:source.spreadsheet_url,version}},examples:{},bindings:{}};
const items=review.items.filter(r=>['ADD','KEEP_EXISTING'].includes(r.status)).map(r=>{
 const id=r.id,edit=r.edits;let topic,label,theme,title,context,prompt,model,help,goal,privacy,url,sourceRoute,practiceGroup;
 if(r.source==='legacy'){
  const c=direct.get(id);assert.ok(c);topic='quick-answer';label='Antwoord geven';theme=legacy.shapes.find(s=>s.id===c.shape).task;title=theme;context=c.input;prompt=c.instruction;model=c.model;help=c.support;goal=c.criterion;privacy='Je mag iets verzinnen of overslaan. Een nee-antwoord mag ook.';url='Lessen/directe-vragen.json';sourceRoute=legacy.routes.find(x=>x.id===c.routeId).label;practiceGroup='quick-direct-'+c.shape+'-'+id.split('-').at(-1);
 }else if(r.source==='drive'){
  const row=rows.get(id);assert.ok(row);[topic,label]=actions[id.split('-')[2]];theme=row[3];title=theme;context=r.context;prompt=r.prompt;model=row[6];help=row[5];goal=row[7];privacy=row[14];url=source.spreadsheet_url;sourceRoute=row[1];practiceGroup=row[11]||'quick-'+id.slice(6);
 }else{
  const c=regel.get(id);assert.ok(c);topic='quick-arrange';label='Regel iets';theme={werk:'Werk',geld:'Geld',wonen:'Thuis',dienstverlening:'Afspraken en hulp',consument:'Winkelen',onderwijs:'In de les',school:'Opvang',buurt:'Buurt',zorg:'Afspraken en hulp',organisatie:'Samenwerken'}[c.theme];title=c.title;context='';prompt=c.prompt;model=c.model;help=c.help;goal='Doe een passend voorstel en maak duidelijk wat er nog afgesproken moet worden.';privacy='Je mag details verzinnen. Houd rekening met de gegeven situatie.';url=source.regel_iets.url;sourceRoute={4:'B1 → B2',5:'B2 → C1',6:'C1 → C2'}[id[3]];practiceGroup='quick-arrange-'+c.action;
 }
 assert.ok(['A1','A2','B1','B2'].includes(r.level));
 if(Object.hasOwn(edit,'prompt'))prompt=edit.prompt;if(Object.hasOwn(edit,'model'))model=edit.model;if(Object.hasOwn(edit,'help'))help=edit.help;
 const explanation=goal+' '+privacy+(help?' Hulp: '+help:'');
 guidance.examples[id]={goal,evidence:'Bespreek of de eigen reactie de opdracht uitvoert. Een voorbeeld is één mogelijkheid.',source:'quick'};
 guidance.bindings[id]={item_version:version,bank_id:bankId,erk:{status:'reviewed',version,source:'quick',levels:[r.level],skill:'Spreken en gesprekken voeren',goal,evidence:(r.level_reason||'Eigen niveauadvies bij de bestaande directe vraag en het antwoord.')+' Geen formele niveautoets.'},bow:{example:id,criteria:['goal','activate','support','feedback','close']}};
 return {content_item_id:id,content_bank_id:bankId,version,domain:'QUICK',topic,topic_label:label,cefr_level:r.level,language_function:theme,title,context,prompt,exercise_type:r.source==='legacy'?'snelvraag':'scenario',interaction_type:'IT_001_OPEN_ANSWER',answer_type:'open',openness:'open',productive_or_receptive:'productief',difficulty:r.level==='A1'?'basis':r.level==='B2'?'hoog':'midden',options:[],correct_answer:null,model_answer:model||'',accepted_answers:[],feedback_correct:explanation,feedback_incorrect:help||goal,explanation,learning_goal:goal,technical_tags:['snelvragen'],practice_group:practiceGroup,estimated_duration_seconds:{A1:30,A2:45,B1:60,B2:90}[r.level],media_requirements:[],review_status:'REVIEW_GO',publication_status:'staging_only',rights_status:'owned_original',selection_safety:true,speaking_safety:true,source_ref:{drive_url:url,source_id:id,source_route:sourceRoute,source_sha256:r.source==='legacy'?review.legacy_sha256:review.source_sha256,review_version:version,changes:edit}};
});
const topicOrder=['quick-answer','quick-tell','quick-ask','quick-choose','quick-arrange'];
items.sort((a,b)=>topicOrder.indexOf(a.topic)-topicOrder.indexOf(b.topic));
assert.equal(new Set(items.map(i=>i.content_item_id)).size,items.length);
const bank={bank_id:bankId,bank_name:'Snelvragen',family_id:'quick',source_version:version,source_sha256:hash(review.source_sha256+JSON.stringify(review)),qa_id:'SNELVRAGEN-LOCAL-20260923',review_scope:review.scope,item_count:items.length,items,guidance};
const output='// Generated from retained sources and per-card review; run scripts/import-snelvragen.cjs --write.\n(function(root){\n const bank='+JSON.stringify(bank)+';\n if(typeof module===\'object\'&&module.exports)module.exports=bank;else root.DIGIBORD_QUICK=bank;\n})(typeof globalThis!==\'undefined\'?globalThis:this);\n';
const target=path.join(root,'data/snelvragen-content.js');
if(require.main===module){if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output);console.log('PASS: '+items.length+' Snelvragen; reviewed selection, original IDs, reproducible import and frozen legacy banks.');}
module.exports={bank,review,source,output};
