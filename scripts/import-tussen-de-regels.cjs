const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {bank:legacy,source}=require('./c1-bank.cjs'),review=require('../tests/fixtures/tussen-de-regels-review.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(source),review.source_sha256);assert.equal(review.items.length,50);
const bankId='CB-BETWEEN-LINES-012',topic='tussen-de-regels',label='Nederlands tussen de regels';
const sections=['Reacties begrijpen','Instemmen en tegenspreken','Een gesprek voeren','Overleggen','Wat iemand bedoelt'];
const guidance={sources:{betweenLines:{title:label+' · bron en lokale redactie',url:legacy.source.url,version:review.version}},examples:{},bindings:{}};
const items=legacy.cards.map(original=>{
 const r=review.items.find(r=>r.id===original.id);assert.ok(r);assert.ok(['B1','B2'].includes(r.advised_level));
 const card=structuredClone(original),edit=r.proposed_edit;
 if(edit){assert.ok(['attention','explanation','options.A','question'].includes(edit.field));if(edit.field==='options.A')card.options[0].text=edit.text;else card[edit.field]=edit.text;}
 const id=card.id,goal='Begrijpen wat iemand bedoelt met: '+card.expression+'.',section=sections[card.domainId-1];
 const options=card.options.map(o=>o.id+'. '+o.text),answer=options['ABC'.indexOf(card.correct)],explanation=card.explanation+'\n\n'+card.attention;
 guidance.examples[id]={goal,evidence:'Vergelijk de antwoorden en bespreek welke woorden in de situatie helpen bij je keuze.',source:'betweenLines'};
 guidance.bindings[id]={item_version:review.version,bank_id:bankId,erk:{status:'reviewed',version:review.version,source:'betweenLines',levels:[r.advised_level],skill:'Lezen en betekenis begrijpen',goal,evidence:r.reason+' Eigen niveauadvies; de bron noemt C1. Geen formele niveautoets.'},bow:{example:id,criteria:['goal','activate','support','feedback','close']}};
 return {content_item_id:id,content_bank_id:bankId,version:review.version,domain:'CONVERSATION',topic,topic_label:label,cefr_level:r.advised_level,language_function:section,title:card.expression,context:card.situation,prompt:card.question,
  exercise_type:'betekenis_kiezen',interaction_type:'IT_004_MULTIPLE_CHOICE',answer_type:'gesloten',openness:'gesloten',productive_or_receptive:'receptief',difficulty:'midden',options,correct_answer:answer,model_answer:answer,accepted_answers:[],feedback_correct:explanation,feedback_incorrect:explanation,explanation,learning_goal:goal,
  technical_tags:[topic],estimated_duration_seconds:90,media_requirements:[],review_status:'REVIEW_GO',publication_status:'staging_only',rights_status:'owned_original',selection_safety:true,speaking_safety:true,
  source_ref:{drive_url:legacy.source.url,card_id:id,source_level:'C1',source_status:'FROZEN',source_section:legacy.domains.find(d=>d.id===card.domainId).title,source_sha256:review.source_sha256,review_version:review.version,review_scope:review.scope,source_answer_letter:original.correct,reviewed_answer_letter:card.correct,changes:edit?[edit.field]:[],change_reason:edit?.reason||''}};
});
assert.equal(new Set(items.map(i=>i.content_item_id)).size,50);
const bank={bank_id:bankId,bank_name:'Taal in gesprekken',family_id:'conversation',source_version:review.version,source_drive_id:'1MpxtfcBHfE3CFpCQmpbJ7KFzbH5qMrss',source_sha256:hash(source+JSON.stringify(review)),qa_id:'BETWEEN-LINES-LOCAL-20260923',item_count:items.length,items,guidance};
const output='// Generated from the frozen source and approved local review; run scripts/import-tussen-de-regels.cjs --write.\n(function(root){\n const bank='+JSON.stringify(bank,null,1)+';\n if(typeof module===\'object\'&&module.exports)module.exports=bank;else root.DIGIBORD_BETWEEN_LINES=bank;\n})(typeof globalThis!==\'undefined\'?globalThis:this);\n';
const target=path.join(__dirname,'../data/tussen-de-regels.js');
if(require.main===module){if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output,'Run reviewed import --write.');console.log('PASS: 50 between-lines cards; frozen source and reproducible import.');}
module.exports={bank,legacy,review,output};
