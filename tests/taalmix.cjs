const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={window:{}};vm.runInNewContext(read('data-bundle.js')+read('data/taalmix.js'),context);
const runtime=JSON.parse(JSON.stringify(context.window.DIGIBORD_DATA));
assert.deepEqual(runtime.cardGames,JSON.parse(read('data/card-games.json')));
const bank=JSON.parse(read('data/kaartenkast_320.json'));
assert.equal(bank.cardCount,542);assert.deepEqual(new Map(bank.cards.map(c=>[c.id,c])),new Map(runtime.cardGames.families.flatMap(f=>f.cards).map(c=>[c.id,c])));
const family=runtime.cardGames.families.find(f=>f.id==='idioms'),mix=family.cards.filter(c=>c.taalmix);
assert.equal(mix.length,240);assert.equal(family.cards.filter(c=>!c.taalmix).length,22);
assert.equal(new Set(bank.cards.map(c=>c.id)).size,542);
const source=read('app.js'),ctx=vm.createContext({RUNTIME:runtime,CARD_GAMES:runtime.cardGames.families,APP:{},activeCardRoute:()=> 'all'});
vm.runInContext(source.slice(source.indexOf('function cardsFor('),source.indexOf('function tongueLevel(')),ctx);
const selected=()=>Array.from(vm.runInContext("cardsFor('idioms')",ctx));
for(const level of ['A1','A2','B1','B2']){
 ctx.APP={mixLevel:level};assert.equal(selected().length,60);
 assert.equal(selected().filter(c=>c.visualRebus).length,20);
 for(const group of ['Instapper','Vervolg','Uitdaging']){
  ctx.APP.mixGroup=group;assert.equal(selected().length,20);
  for(const kind of ['Dagelijkse taal','Uitdrukking','Spreekwoord','Rebus']){
   ctx.APP.mixKind=kind;
   assert.deepEqual(selected().map(c=>c.id),mix.filter(c=>c.targetLevel===level&&c.taalmix.group===group&&c.taalmix.kind===kind).map(c=>c.id));
  }
  delete ctx.APP.mixKind;
 }
}
ctx.APP={mixLevel:'A1',mixKind:'Spreekwoord'};assert.equal(selected().length,0);
ctx.APP={mixLevel:'all'};assert.equal(selected().length,240);
ctx.APP.mixCollection='legacy';assert.equal(selected().length,22);
ctx.APP.mixCollection='all';assert.equal(selected().length,262);
for(const c of mix){
 for(const value of [c.instruction,c.partnerPrompt,c.model.text,c.criterion,c.followUp.instruction,c.teacherNote])assert.ok(value.trim(),c.id);
 assert.equal(c.model.defaultVisible,false);assert.equal(c.model.showWhen,'after_attempt_on_request');
 assert.equal(c.humanReviewStatus,'not_performed');assert.equal(c.lessonTrialStatus,'not_performed');
 assert.equal(c.taalmix.level,c.targetLevel);assert.ok(c.help.items.length);
 if(c.visualRebus){assert.equal(c.taalmix.kind,'Rebus');assert.ok(Number.isInteger(c.taalmix.puzzleLoad));assert.ok(fs.existsSync(path.join(root,c.visualRebus.src)));assert.ok(c.model.text.includes('Betekenis:'));assert.ok(c.visualRebus.driveUrl.startsWith('https://drive.google.com/'));}
 else {assert.equal(c.taalmix.puzzleLoad,null);assert.ok(c.model.text.length>c.title.length+30);}
}
console.log('PASS: 240 complete Taalmix cards, 60 per level, 20 per stage, 80 mapped images, 22 preserved cards, all level/stage/type filters, empty selections and truthful review status.');
