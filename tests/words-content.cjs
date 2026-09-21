const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ctx=vm.createContext({structuredClone});
for(const file of ['words-content.js','words-activity.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const run=code=>vm.runInContext(code,ctx);
run(`for(const item of WZ_ITEMS){
 const state=newWZRound({goalId:item.goalId,type:item.type,band:item.band,round:wzPool({goalId:item.goalId,type:item.type,band:item.band}).findIndex(i=>i.id===item.id)+1});
 if(!validWZRound(state))throw Error(item.id+' state');
 if(item.answerType==='OPEN'){
  if(assessWordAnswer(item,item.answerModel)!=='unassessed')throw Error(item.id+' open scoring');
  if(assessWordAnswer({...item,answerType:'GESLOTEN'},item.answerModel)!=='unassessed')throw Error(item.id+' unsafe metadata');
 }else if(assessWordAnswer(item,item.type==='Kies'?item.correctOptionId:item.answerModel)!=='correct')throw Error(item.id+' answer');
}`);
assert.equal(run('WZ_ITEMS.length'),680);assert.equal(run('WORD_CARDS.length'),30);
assert.equal(run("assessWordAnswer(WZ_ITEMS.find(i=>i.id==='WZ_007_B01'),' ik HEB geen auto! ')"),'correct');
assert.equal(run("assessWordAnswer(WZ_ITEMS.find(i=>i.id==='WZ_007_B01'),'Ik heb auto.')"),'review');
assert.equal(run("assessWordAnswer(WZ_ITEMS.find(i=>i.id==='WZ_002_K01'),'B')"),'incorrect');
assert.equal(run("assessWordAnswer(WZ_ITEMS.find(i=>i.id==='WZ_002_K01'),'C')"),'incomplete');
for(const state of [null,{}, {version:4,round:0}, {version:4,round:1,type:'bogus',band:1,context:''}])assert.equal(run(`validWZRound(${JSON.stringify(state)})`),false);
run('var state=newWZRound();state.selected=[999]');assert.equal(run('validWZRound(state)'),false);
assert.equal(run("wzPool({goalId:'WZ_006_007',band:1}).length"),0);
assert.equal(run("wzPool({goalId:'WZ_005',band:1}).some(i=>/waarom|welke|hoeveel/i.test(i.instruction+' '+i.answerModel))"),false);
const current=JSON.parse(run('JSON.stringify(WORD_CARDS)'));
const originalFields=current.map(({structure,answer,hint,variation,prefix})=>({structure,answer,hint,variation,prefix}));
assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(originalFields)).digest('hex'),"f072ea3c1cfabaf1bf42be79874d07483ba4a39dcf62e77e58e6cc4083e48c0e");
current.forEach((card,i)=>assert.equal(card.id,`LEGACY_WORD_${String(i+1).padStart(3,'0')}`));
console.log('PASS: alle 680 items selecteerbaar; open scoring geblokkeerd; gesloten antwoorden, invoercontrole, instapgrenzen en exact behoud van 30 kaarten.');
