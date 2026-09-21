// One-time, repeatable import from the preserved repository archive; never a runtime bank.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),sourceCommit='0aae53a943630ff573b1d9b42ecc69ea3014562b';
const sourcePath='Woordspel/woordspel-content.js';
function historicalItems(){
 const code=execFileSync('git',['show',`${sourceCommit}:${sourcePath}`],{cwd:root,encoding:'utf8'});
 const sandbox={};vm.runInNewContext(code,sandbox,{timeout:1000});
 const {buildData,guessData,levels}=sandbox.PraatpadWordspelContent;
 const goals=[
  ['WZ_001','Gewone hoofdzin'],['WZ_004','Ja nee vraag'],['WS_INVERSIE','Een andere start'],
  ['WS_SCHEIDBAAR','Scheidbare werkwoorden'],['WS_VOLTOOID','Voltooide tijd'],['WS_WEDERKERIG','Wederkerige werkwoorden'],
  ['WS_OMDAT','Een reden met omdat'],['WS_ALS','Een voorwaarde met als'],['WS_DAT','Een bijzin met dat'],
  ['WS_INDIRECT','Een indirecte vraag'],['WS_HOEWEL','Een tegenstelling met hoewel'],['WS_ONWERKELIJK','Een onwerkelijke voorwaarde']
 ];
 const base={source:'PRAATPAD_WORDS',band:null,options:[],correctOptionId:null,constructionIds:[],review:{editorial:'import_preserved',human:'pending',pilot:'pending',publication:'preview'}};
 const items=[];
 for(const [level,cards] of Object.entries(buildData))cards.forEach((card,index)=>{
  const [goalId,goal]=goals[items.length],answerModel=card.parts.map(p=>p[0]).join(' ');
  items.push({...base,id:`LEGACY_WS_BUILD_${level}_${String(index+1).padStart(2,'0')}`,goalId,goal,level,context:'Zinsbouw',type:'Bouw',instruction:card.instruction,stimulus:'',tokens:card.parts.map(p=>p[0]),tokenRoles:card.parts.map(p=>p[1]),answerType:'GESLOTEN',answerModel,acceptedAnswers:[answerModel],feedback:card.note,tags:['historisch','zinsdelen'],legacyRef:{sourceCommit,sourcePath,kind:'build',level,index}});
 });
 guessData.forEach((card,index)=>items.push({...base,id:`LEGACY_WS_GUESS_${String(index+1).padStart(3,'0')}`,goalId:'WS_OMSCHRIJVEN',goal:'Omschrijven en herkennen',level:levels[card.min],minimumLevelIndex:card.min,context:card.type==='objects'?'Voorwerpen en begrippen':'Eigenschappen',type:'Raad',instruction:'Luister naar de aanwijzingen. Welk woord zoeken we?',stimulus:'',clues:card.clues,answerType:'OPEN',answerModel:card.w,acceptedAnswers:[],feedback:'Bespreek welke aanwijzingen bij jullie woord passen. Geef daarna zelf een omschrijving.',tags:['historisch','raadsels'],legacyRef:{sourceCommit,sourcePath,kind:'guess',index,category:card.type}}));
 assert.equal(items.length,28);return JSON.parse(JSON.stringify(items));
}
function mergeHistoricalItems(bank, incoming){
 const existing=new Map(bank.items.map(item=>[item.id,item]));
 for(const item of incoming)if(existing.has(item.id))assert.deepEqual(existing.get(item.id),item,`${item.id}: lokaal gewijzigd; vergelijk eerst, niets overschrijven.`);
 const added=incoming.filter(item=>!existing.has(item.id));
 return {...bank,items:[...bank.items,...added]};
}
if(require.main===module){
 const target=path.join(root,'Lessen/woorden-zinnen.json'),original=fs.readFileSync(target,'utf8');
 const bank=JSON.parse(original),next=mergeHistoricalItems(bank,historicalItems()),count=next.items.length-bank.items.length;
 if(count&&process.argv.includes('--write')){
  const dir=path.join(root,'bank-backups');fs.mkdirSync(dir,{recursive:true});
  const backup=path.join(dir,`woorden-zinnen-${Date.now()}.json`);fs.writeFileSync(backup,original,{flag:'wx'});
  const temporary=target+'.tmp';fs.writeFileSync(temporary,JSON.stringify(next,null,2)+'\n',{flag:'wx'});fs.renameSync(temporary,target);
  console.log(`Back-up: ${backup}`);
 }
 console.log(`${count} nieuwe kaarten; ${next.items.length} totaal${process.argv.includes('--write')?'':' (controle, niets geschreven)'}.`);
}
module.exports={historicalItems,mergeHistoricalItems};
