const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const runtime=vm.runInNewContext(read('data-bundle.js')+read('data/tongbrekers.js')+';window.DIGIBORD_DATA',{window:{}});
const bank=JSON.parse(read('data/tongbrekers.json'));
assert.equal(JSON.stringify(runtime.tongueBank),JSON.stringify(bank));
assert.equal(bank.cards.length,161);assert.equal(new Set(bank.cards.map(c=>c.id)).size,161);assert.equal(new Set(bank.cards.map(c=>c.text)).size,161);
assert.equal(bank.cards.filter(c=>c.type==='tongbreker').length,142);assert.equal(bank.cards.filter(c=>c.type==='uitspraakzin').length,19);
const levels='B1 A2 A2 A1 B1 A1 B2 A1 A2 B1 A2 A2 A1 B1 B2 A1 B1 A1 A2 B1 A2 A1 A2 A2 A2 A1 A1 A2 B1 B1 A1 A2 B2 A2 A2 B1 A2 B1 C1 C2 B1 B2 B2 A1 C1 B1 A2 B2 A0 A0 A0 A1 A1 A1 A1 A1 A1 A2 A1 A2 A1 A2 A2 A2 A2 A1 A2 A2 A1 A1 A1 A1 A2 A1 A1 A2 A2 A2 A2 A2 A2 A2 B1 B1 B1 B1 B2 B1'.split(' ');
const difficulties='5332435244343452423533343223442353344455455254451112223233232444324322322222222222233332';
// Definitive source numbers; pronunciation sentences stay in the bank only.
const excluded=[50,51,66,...Array.from({length:16},(_,i)=>73+i)];
bank.cards.slice(0,88).forEach((c,i)=>{assert.equal(c.sourceNumber,i+1);assert.equal(c.entryLevel,levels[i]);assert.equal(c.difficulty,Number(difficulties[i]),c.id);assert.equal(c.type,excluded.includes(i+1)?'uitspraakzin':'tongbreker')});
for(const level of ['A1','A2'])assert.equal(bank.cards.filter(c=>c.type==='tongbreker'&&c.entryLevel===level).length,60);
for(const c of bank.cards.slice(88)){assert.ok(['A1','A2'].includes(c.entryLevel));assert.equal(c.type,'tongbreker');assert.ok(Number.isInteger(c.difficulty)&&c.difficulty>=1&&c.difficulty<=5)}
const source=read('app.js');let rendered;
const ctx=vm.createContext({RUNTIME:runtime,CARD_GAMES:runtime.cardGames.families,APP:{level:'A2',cardIndex:0},window:{},$$:()=>[],activeCardRoute:()=>ctx.APP.cardRoute||'all',esc:s=>String(s??''),setLast(){},renderCardTable:(kind,count,html)=>rendered={kind,count,html}});
vm.runInContext(source.slice(source.indexOf('function cardsFor('),source.indexOf('function cardActivityHeader(')),ctx);
for(const level of bank.levels){
 ctx.APP.tongueLevel=level;
 for(const difficulty of ['','easy','medium','hard']){
  ctx.APP.tongueDifficulty=difficulty;
  const selected=vm.runInContext("cardsFor('tongue')",ctx);
  const expected=bank.cards.filter(c=>c.type==='tongbreker'&&bank.levels.indexOf(c.entryLevel)<=bank.levels.indexOf(level)&&(!difficulty||({easy:c.difficulty<=2,medium:c.difficulty===3,hard:c.difficulty>=4}[difficulty])));
  assert.deepEqual(Array.from(selected,c=>c.id),expected.map(c=>c.id));
  ctx.APP.cardIndex=999;vm.runInContext('startTongue()',ctx);
  assert.ok(!/undefined|NaN/.test(rendered.html));
  assert.ok(!/cardSupport|cardAttempt|Situatie|Oefentekst|Vervolg|Doel en rollen/.test(rendered.html));
  if(!expected.length)assert.ok(rendered.html.includes('Geen tongbrekers bij deze filters.'));
 }
}
ctx.APP.tongueLevel='C2';ctx.APP.tongueDifficulty='';
for(let i=0;i<142;i++){ctx.APP.cardIndex=i;vm.runInContext('startTongue()',ctx);assert.ok(rendered.html.includes(bank.cards.filter(c=>c.type==='tongbreker')[i].text))}
assert.equal(vm.runInContext("cardsFor('tongue',true).length",ctx),142);
for(const family of runtime.cardGames.families.filter(f=>f.id!=='tongue'))for(const route of runtime.cardGames.routeDefinitions){ctx.APP.cardRoute=route.id;ctx.kind=family.id;assert.deepEqual(Array.from(vm.runInContext('cardsFor(kind)',ctx),c=>c.id),Array.from(family.cards.filter(c=>c.routeId===route.id),c=>c.id))}
console.log('PASS: exact 88 classifications; 142 playable/19 retained; 60 A1 and 60 A2 records; all 28 filter combinations, all 142 texts, empty selections and seven unchanged card families.');

// Every playable record must point to its own bundled audio; retained sentences stay silent.
const audioManifest=JSON.parse(read('data/tongbrekers-audio.json'));
assert.equal(audioManifest.recordings.length,142);
for(const c of bank.cards){
 if(c.type!=='tongbreker'){assert.equal(c.audio,undefined);continue}
 assert.equal(c.audio.src,`assets/audio/tongbrekers/${c.id.toLowerCase()}.mp3`);
 assert.ok(['Rick','Jennifer','Roland'].includes(c.audio.voice));
 const info=audioManifest.recordings.find(r=>r.id===c.id);assert.ok(info);assert.equal(info.text,c.text);
 const bytes=fs.readFileSync(path.join(root,c.audio.src));assert.ok(bytes.length>1000);
 assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),info.sha256);
}
(async()=>{
 const players=[],messages=[];let rejectPlay=false,release;
 ctx.Audio=function(src){this.src=src;this.currentTime=1;this.paused=false;this.pause=()=>{this.paused=true};this.play=()=>rejectPlay?Promise.reject(new Error('load failed')):new Promise(resolve=>{release=resolve});players.push(this)};
 ctx.toast=m=>messages.push(m);
 const card=bank.cards.find(c=>c.type==='tongbreker'),button={isConnected:true,textContent:'Voorlezen'};
 ctx.card=card;ctx.button=button;
 let playing=vm.runInContext('readTongue(card,button)',ctx);release();await playing;
 assert.equal(players[0].src,card.audio.src);assert.equal(button.textContent,'Nog een keer');
 playing=vm.runInContext('readTongue(card,button)',ctx);assert.equal(players[0].paused,true);assert.equal(players[0].currentTime,0);
 vm.runInContext('stopTongueAudio()',ctx);release();await playing;assert.equal(players[1].paused,true);
 const staleError=players[1].onerror;rejectPlay=true;await vm.runInContext('readTongue(card,button)',ctx);
 assert.equal(button.textContent,'Voorlezen');assert.equal(messages.length,1);staleError();assert.equal(messages.length,1);
 console.log('PASS: 142 exact audio mappings and file hashes; repeat, cancellation, stale callbacks and playback failure.');
})().catch(e=>{console.error(e);process.exitCode=1});
