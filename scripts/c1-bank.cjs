const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const filename='DIGIBORD_C1_Nederlands_tussen_de_regels_Batch_001_Reviewronde_2_DEFINITIEF.md';
const source=fs.readFileSync(path.join(root,'imports/c1',filename),'utf8');
assert.equal(require('node:crypto').createHash('sha256').update(source).digest('hex'),'71e8ff0a4786c9a466399b8070657e845296cc542688aa7345933ffd04393451','Frozen source changed; requires a new review');
const domains=[],cards=[];
for(const section of source.split(/^DOMEIN /m).slice(1)){
 const [,number,title,body]=section.match(/^(\d+)\n([^\n]+)\n\n([\s\S]+)$/);
 const domainId=Number(number);domains.push({id:domainId,title});
 for(const block of body.trim().split(/\n\n(?=\d+\. C1_)/)){
  const match=block.match(/^(\d+)\. (C1_[A-Z]+_\d+)\n([^\n]+)\n\nSituatie\n([\s\S]+?)\n\nVraag\n([\s\S]+?)\n\nA\. (.+)\nB\. (.+)\nC\. (.+)\n\nNa de keuze\nJuiste antwoord: ([ABC])\. (.+)\n\nUitleg\n([\s\S]+?)\n\nLet op\n([\s\S]+)$/);
  assert.ok(match,'Unrecognized frozen card: '+block.slice(0,60));
  const [,ordinal,id,expression,situation,question,a,b,c,correct,answer,explanation,attention]=match;
  const options=[a,b,c].map((text,i)=>({id:'ABC'[i],text}));
  assert.equal(options.find(o=>o.id===correct).text,answer,id);
  cards.push({id,ordinal:Number(ordinal),level:'C1',domainId,expression,situation,question,options,correct,explanation,attention});
 }
}
assert.deepEqual(cards.map(c=>c.ordinal),Array.from({length:50},(_,i)=>i+1));
assert.equal(cards.length,50);assert.equal(new Set(cards.map(c=>c.id)).size,50);assert.equal(domains.length,5);
const bank={id:'c1-between-lines',title:'Nederlands tussen de regels',description:'C1 · Batch 001 · 50 kaarten in vijf domeinen.',intro:'Kies het antwoord dat het best bij de situatie past.',color:'#665398',icon:'idioms',level:'C1',status:'FROZEN',source:{filename,url:'https://drive.google.com/file/d/1MpxtfcBHfE3CFpCQmpbJ7KFzbH5qMrss/view'},domains,cards};
const output='// Generated from the frozen Drive source by scripts/c1-bank.cjs.\nwindow.DIGIBORD_DATA.c1BetweenLines = '+JSON.stringify(bank,null,2)+';\n';
const destination=path.join(root,'data/c1-between-lines.js');
if(process.argv.includes('--write'))fs.writeFileSync(destination,output);
else assert.equal(fs.readFileSync(destination,'utf8'),output,'C1 runtime differs from frozen source');
console.log('PASS: all 50 frozen C1 cards, five domains, exact wording and ordered answers.');
