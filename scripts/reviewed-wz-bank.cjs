const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),adapt=require('../content-bank-adapters.js');
module.exports=function({number,spreadsheetId,sourceCount,itemCount,previous},writeCheck){
const root=path.resolve(__dirname,'..'),raw=fs.readFileSync(path.join(root,`tests/fixtures/wz-pb${number}-source.json`),'utf8'),rows=JSON.parse(raw),review=require(`../tests/fixtures/wz-pb${number}-review.json`);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),headers=['ID','DoelID','Taaldoel','Niveau','Oefentype','Moeilijkheid','Context','Instructie','Stimulus','Optie A','Optie B','Optie C','Correct','Antwoordmodel','Feedback','Bronconstructie','Review 1','Review 2','Review 3','Advocaat','Implementatiestatus','Antwoordtype','Tags'];
assert.equal(hash(raw),review.source_sha256);assert.deepEqual(rows[0],headers);assert.equal(rows.length,sourceCount+1);assert.equal(Object.keys(review.items).length,sourceCount);
const originals=rows.slice(1).map(row=>Object.fromEntries(headers.map((h,n)=>[h,row[n]??'']))),source={spreadsheetId,bankId:`CB-WZ-${number}`,batch:`WZ_BATCH_${number}`,name:'Woorden en zinnen: meer oefenen',version:review.version,localReviewVersion:review.version,sourceSha256:hash(raw+JSON.stringify(review)),appSource:`data/wz-pb${number}.js`};
const ids=new Set([...originals.map(x=>x.ID),...previous.map(x=>x.content_item_id)]);
const items=[];
for(const x of originals){
 const r=review.items[x.ID];assert.ok(['GO','DUPLICATE'].includes(r?.status));assert.ok(r.level_reason&&r.goal);assert.equal(x['Review 3'],'OPEN');assert.equal(x.Implementatiestatus,'PRODUCTIE EDITION 0.1');
 assert.ok(Object.keys(r.changes).every(k=>['Taaldoel','Context','Feedback','Instructie','Stimulus','Optie A','Optie B','Optie C','Correct','Antwoordmodel'].includes(k)));
 if(r.status==='DUPLICATE'){assert.ok(r.duplicate_of!==x.ID&&ids.has(r.duplicate_of));assert.notEqual(review.items[r.duplicate_of]?.status,'DUPLICATE');continue}
 const y={...x,...r.changes},open=y.Antwoordtype==='OPEN'||r.teacher_review===true,options='ABC'.split('').map(c=>({id:c,text:y['Optie '+c]})).filter(o=>o.text);
 assert.ok(['A1','A2','B1'].includes(r.level));if(x.DoelID==='WZ_029')assert.equal(r.level,'B1');assert.ok(y.Instructie.trim()&&y.Antwoordmodel.trim()&&y.Antwoordmodel!=='Open antwoord');
 if(y.Oefentype==='Kies'){assert.equal(new Set(options.map(o=>o.text)).size,3);assert.equal(options.find(o=>o.id===y.Correct)?.text,y.Antwoordmodel)}
 if(y.Oefentype==='Verander')assert.notEqual(y.Stimulus,y.Antwoordmodel,x.ID);
 if(y.Oefentype==='Bouw'){assert.equal(r.expected_tokens.join(' ')+y.Antwoordmodel.slice(-1),y.Antwoordmodel);assert.deepEqual(r.order_tokens,r.expected_tokens);}
 items.push({id:y.ID,source:source.batch,goalId:y.DoelID,goal:y.Taaldoel,cefrLevel:r.level,route:'A1→A1+',type:y.Oefentype,band:Number(y.Moeilijkheid),context:y.Context,instruction:y.Instructie,stimulus:y.Stimulus,options,correctOptionId:y.Correct,answerType:open?'OPEN':'GESLOTEN',answerModel:y.Antwoordmodel,acceptedAnswers:open?[]:[y.Antwoordmodel],feedback:y.Feedback,tags:y.Tags.split(';').map(t=>t.trim()),tokens:r.expected_tokens||[],sourceConstructions:y.Bronconstructie.split(';').map(t=>t.trim()),requiresTeacherReview:open,review:{sourceReview1:x['Review 1'],sourceReview2:x['Review 2'],sourceReview3:x['Review 3'],sourceAdvocate:x.Advocaat,sourceImplementation:x.Implementatiestatus,localStatus:r.status,localVersion:review.version,human:'pending'}});
}
const bank=adapt({source,items});assert.equal(bank.items.length,itemCount);
bank.qa_id=`WZ-PB${number}-LOCAL-20260923`;const sourceKey='words'+number;bank.guidance={sources:{[sourceKey]:{title:`Woorden en zinnen PB${number} · bron en lokale review`,url:review.source_url,version:review.version}},examples:{},bindings:{}};
for(const i of bank.items){delete i.taalroute_route;const r=review.items[i.content_item_id],n=originals.findIndex(x=>x.ID===i.content_item_id),x=originals[n];i.source_ref={...i.source_ref,sheet:'Masterbank',row:n+2,original_level:x.Niveau,original_version:'0.1',review_version:review.version,changed_fields:Object.keys(r.changes)};i.learning_goal=r.goal;if(r.topic){i.source_ref.original_topic=x.DoelID;i.topic=r.topic;}
 const key=sourceKey+'_'+i.content_item_id;bank.guidance.examples[key]={goal:r.goal,evidence:'Bespreek de zin en laat de cursist zelf een voorbeeld geven.',source:sourceKey};
 bank.guidance.bindings[i.content_item_id]={bank_id:bank.bank_id,item_version:review.version,erk:{status:'reviewed',version:review.version,source:sourceKey,levels:[r.level],skill:'Spreken, lezen en zinnen maken',goal:r.goal,evidence:r.level_reason+' Eigen advies bij deze opdracht, geen officiële niveautoets. A1+ is een interne tussenstap.'},bow:{example:key,criteria:['goal','activate','support','feedback','close']}};
}
const output=`// Generated from unchanged WZ PB${number} source and explicit local review.\n(function(root){const bank=`+JSON.stringify(bank)+";if(typeof module==='object'&&module.exports)module.exports=bank;else root.WZ_PB"+number+"=bank;})(typeof globalThis!=='undefined'?globalThis:this);\n";
if(writeCheck){const target=path.join(root,`data/wz-pb${number}.js`);if(process.argv.includes('--write'))fs.writeFileSync(target,output);else assert.equal(fs.readFileSync(target,'utf8'),output);console.log(`PASS WZ PB${number} import: ${sourceCount} reviewed rows; ${itemCount} tasks; ${sourceCount-itemCount} duplicate references; source status and reproducible output.`);}
return {bank,review,originals,output};
};
