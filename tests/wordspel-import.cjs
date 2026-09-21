const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {mergeHistoricalItems}=require('../scripts/import-wordspel.cjs');
const root=path.resolve(__dirname,'..'),bank=JSON.parse(fs.readFileSync(path.join(root,'Lessen/woorden-zinnen.json'),'utf8'));
const items=bank.items.filter(i=>i.source==='PRAATPAD_WORDS');
assert.equal(items.length,28);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(items)).digest('hex'),'c8fce3b60d8b3e97814960b2025f8f72e938c09c5c34f01b06146d3675cca9a8');
const before=JSON.stringify(bank);
assert.deepEqual(mergeHistoricalItems(bank,items),bank);
const without={...bank,items:bank.items.filter(i=>i.source!=='PRAATPAD_WORDS')};
assert.deepEqual(mergeHistoricalItems(without,items),bank);
assert.throws(()=>mergeHistoricalItems(bank,[{...items[0],answerModel:'Conflicterende wijziging'}]),/niets overschrijven/);
assert.equal(JSON.stringify(bank),before);
const ctx=vm.createContext({structuredClone});
for(const file of ['words-content.js','words-activity.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
vm.runInContext(`for(const item of WORD_ITEMS.filter(i=>i.source==='PRAATPAD_WORDS')){
 const selection={source:item.source,goalId:item.goalId,type:item.type,band:0,level:item.level};
 const pool=wzPool(selection),state=newWZRound({...selection,round:pool.findIndex(i=>i.id===item.id)+1});
 if(!validWZRound(state)||wordItem(state).id!==item.id)throw Error(item.id+' selectie');
 if(item.type==='Raad'){
  if(assessWordAnswer({...item,answerType:'GESLOTEN'},item.answerModel)!=='unassessed')throw Error(item.id+' score');
  state.clueCount=99;if(validWZRound(state))throw Error(item.id+' ongeldige voortgang');
 }else if(assessWordAnswer(item,item.answerModel)!=='correct')throw Error(item.id+' antwoord');
}
const old=newWZRound();delete old.source;delete old.level;delete old.clueCount;delete old.revealed;
if(!validWZRound(old))throw Error('Bestaande WZ-voortgang verloren');`,ctx);
console.log('PASS: 28 brongetrouwe kaarten, herhaalbare import, geen overschrijving bij conflict, selectie/niveau, open guard en bestaande WZ-voortgang.');
