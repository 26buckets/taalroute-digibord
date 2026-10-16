const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const runtime=vm.runInNewContext(read('data-bundle.js')+read('data/tongbrekers.js')+read('data/tongbrekers-migration.js')+';window.DIGIBORD_DATA',{window:{}});
const bank=JSON.parse(read('data/tongbrekers.json'));
assert.equal(JSON.stringify(runtime.tongueBank),JSON.stringify(bank));
require('../imports/tongbrekers-240-20260921/validate.cjs');
assert.deepEqual(bank,JSON.parse(read('imports/tongbrekers-240-20260921/tongbrekers-240.json')));
assert.equal(read('data/tongbrekers.js'),read('imports/tongbrekers-240-20260921/tongbrekers-240.js'));
assert.equal(read('data/tongbrekers-audio.json'),read('imports/tongbrekers-240-20260921/tongbrekers-audio-240.json'));
const source=read('app.js');let rendered;
const ctx=vm.createContext({DigiRoutes:require('../route-architecture.js'),RUNTIME:runtime,CARD_GAMES:runtime.cardGames.families,APP:{level:'A2',cardIndex:0},window:{},$$:()=>[],activeCardRoute:()=>ctx.APP.cardRoute||'all',esc:s=>String(s??''),setLast(){},renderCardTable:(kind,count,html)=>rendered={kind,count,html}});
// This source/presentation audit selects each row explicitly; shuffle behavior has its own tests.
ctx.selectShuffledCard=()=>({position:ctx.APP.cardIndex+1});
vm.runInContext(source.slice(source.indexOf('function cardsFor('),source.indexOf('function cardActivityHeader(')),ctx);
for(const level of bank.levels){
 ctx.APP.level=level;
 for(const difficulty of ['','easy','medium','hard']){
  ctx.APP.tongueDifficulty=difficulty;
  const selected=vm.runInContext("cardsFor('tongue')",ctx);
  const expected=bank.cards.filter(c=>c.type==='tongbreker'&&bank.levels.indexOf(c.entryLevel)<=bank.levels.indexOf(level)&&(!difficulty||({easy:c.difficulty<=2,medium:c.difficulty===3,hard:c.difficulty>=4}[difficulty])));
  assert.deepEqual(Array.from(selected,c=>c.id),expected.map(c=>c.id));
  ctx.APP.cardIndex=999;vm.runInContext('startTongue()',ctx);
  assert.ok(!/undefined|NaN/.test(rendered.html));
  assert.ok(!/cardSupport|cardAttempt|Situatie|Oefentekst|Vervolg|Doel en rollen/.test(rendered.html));
  if(!expected.length){assert.equal(ctx.APP.tongueDifficulty,'');assert.ok(!rendered.html.includes('Geen tongbrekers bij deze filters.'))}
 }
}
ctx.APP.level='C2';ctx.APP.tongueDifficulty='';
for(let i=0;i<240;i++){ctx.APP.cardIndex=i;vm.runInContext('startTongue()',ctx);assert.ok(rendered.html.includes(bank.cards.filter(c=>c.type==='tongbreker')[i].text))}
assert.equal(vm.runInContext("cardsFor('tongue',true).length",ctx),240);
for(const family of runtime.cardGames.families.filter(f=>f.id!=='tongue'))for(const route of runtime.cardGames.routeDefinitions){ctx.APP.cardRoute=ctx.DigiRoutes.resolve(route.label);ctx.kind=family.id;assert.deepEqual(Array.from(vm.runInContext('cardsFor(kind)',ctx),c=>c.id),Array.from(family.cards.filter(c=>ctx.DigiRoutes.resolve(c.route)===ctx.DigiRoutes.resolve(route.label)),c=>c.id))}
// Bank upgrades preserve the old selected ID, other games and filters. Removed IDs get an explicit notice.
const messages=[],savedBoards={rotterdam:{position:12}};
ctx.toast=m=>messages.push(m);
const previous=runtime.tonguePreviousCards;
const retained=previous.findIndex(c=>bank.cards.some(n=>n.id===c.id));
ctx.APP={level:'C2',tongueLevel:'C2',cardIndex:retained,last:{data:{kind:'tongue'}},boardStates:savedBoards,turn:{active:2}};
vm.runInContext('startTongue()',ctx);
assert.equal(ctx.APP.tongueCardId,previous[retained].id);assert.equal(messages.length,0);
assert.equal(ctx.APP.boardStates,savedBoards);assert.equal(ctx.APP.turn.active,2);assert.equal(ctx.APP.tongueLevel,'C2');
ctx.APP.cardIndex=239;vm.runInContext('startTongue()',ctx);assert.equal(ctx.APP.cardIndex,239);
ctx.APP={level:'C2',cardIndex:previous.findIndex(c=>!bank.cards.some(n=>n.id===c.id)),last:{data:{kind:'tongue'}}};
vm.runInContext('startTongue()',ctx);assert.equal(ctx.APP.cardIndex,0);assert.equal(messages.length,1);
vm.runInContext('startTongue()',ctx);assert.equal(messages.length,1);
console.log('PASS: 240 source-identical playable cards; all 28 filters, all 240 texts, empty selections and seven unchanged families.');

// Every playable record must point to its own bundled audio; retained sentences stay silent.
const audioManifest=JSON.parse(read('data/tongbrekers-audio.json'));
assert.equal(audioManifest.recordings.length,240);
for(const c of bank.cards){
 if(c.type!=='tongbreker'){assert.equal(c.audio,undefined);continue}
 assert.equal(c.audio.src,`assets/audio/tongbrekers/${c.id.toLowerCase()}.mp3`);
 assert.ok(['Rick','Jennifer','Roland'].includes(c.audio.voice));
 const info=audioManifest.recordings.find(r=>r.id===c.id);assert.ok(info);assert.equal(info.text,c.text);
 const bytes=fs.readFileSync(path.join(root,c.audio.src));assert.ok(bytes.length>1000);
 assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),info.sha256);
}
// Approved recordings are separate from the frozen historical source bank.
vm.runInContext(read('data/tongbrekers-opnamen.js'),ctx);
const approved=JSON.parse(read('data/tongbrekers-opnamen.json')).recordings;
assert.equal(approved.length,480);
assert.equal(new Set(approved.map(r=>r.id+':'+r.variant)).size,480);
for(const c of bank.cards)for(const variant of ['rustig','normaal']){
 const record=approved.find(r=>r.id===c.id&&r.variant===variant);assert.ok(record);
 assert.equal(ctx.window.TONGUE_RECORDINGS[c.id][variant],record.src);
 assert.equal(record.text,require('../wording.js').text(c.text));
 assert.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,record.src))).digest('hex'),record.sha256);
}
(async()=>{
 const players=[],messages=[];let rejectPlay=false,release;
 ctx.Audio=function(src){this.src=src;this.currentTime=1;this.paused=false;this.pause=()=>{this.paused=true};this.play=()=>rejectPlay?Promise.reject(new Error('load failed')):new Promise(resolve=>{release=resolve});players.push(this)};
 ctx.toast=m=>messages.push(m);ctx.card=bank.cards[0];ctx.button={isConnected:true,textContent:'Voorlezen'};
 let playing=vm.runInContext('readTongue(card,button)',ctx);release();await playing;
 assert.equal(players[0].src,ctx.window.TONGUE_RECORDINGS[ctx.card.id].rustig);
 assert.equal(ctx.button.textContent,'Nog een keer');ctx.APP.tongueTempo='normaal';
 playing=vm.runInContext('readTongue(card,button)',ctx);assert.equal(players[0].paused,true);assert.equal(players[0].currentTime,0);
 assert.equal(players[1].src,ctx.window.TONGUE_RECORDINGS[ctx.card.id].normaal);
 const staleError=players[0].onerror;staleError();assert.equal(messages.length,0);
 vm.runInContext('stopTongueAudio()',ctx);release();await playing;assert.equal(players[1].paused,true);
 rejectPlay=true;await vm.runInContext('readTongue(card,button)',ctx);assert.equal(ctx.button.textContent,'Voorlezen');assert.equal(messages.length,1);
 await vm.runInContext('readTongue({id:"missing"},button)',ctx);assert.equal(players.length,3);
 console.log('PASS: 480 approved files/hashes, both tempos, repeat, cancellation, stale callbacks and failure.');
})().catch(e=>{console.error(e);process.exitCode=1});
