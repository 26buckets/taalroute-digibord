const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),json=f=>JSON.parse(read(f)),hash=v=>createHash('sha256').update(v).digest('hex');
const manifest=json('manifest.json'),bank=json('tongbrekers-240.json'),migration=json('migration.json'),audio=json('audio-plan.json'),source=read('source.txt');
assert.equal(hash(source),manifest.source.snapshotSha256);assert.equal(hash(read('tongbrekers-240.json')),manifest.bankSha256);
assert.equal(bank.cards.length,240);assert.equal(new Set(bank.cards.map(c=>c.id)).size,240);assert.equal(new Set(bank.cards.map(c=>c.text.normalize('NFC').toLocaleLowerCase('nl').replace(/\s+/g,' ').trim())).size,240);
const sections=source.split(/^(A0|A1|A2|B1 TOT EN MET C2)$/m);assert.equal(sections.length,9);let index=0;
for(let i=1;i<sections.length;i+=2){
 const group=sections[i]==='B1 TOT EN MET C2'?'B1-C2':sections[i],level=group==='B1-C2'?'B1':group;
 const rows=[...sections[i+1].matchAll(/^(\d{2})\. (.+)\nKlankval: (.+)\. Moeilijkheid: ([1-5])\/5\.$/gm)];assert.equal(rows.length,60);
 rows.forEach((m,n)=>{const c=bank.cards[index++];assert.equal(Number(m[1]),n+1);assert.equal(c.text,m[2]);assert.equal(c.soundFocus,m[3]);assert.equal(c.difficulty,Number(m[4]));assert.equal(c.sourceNumber,index);assert.equal(c.sourceGroupNumber,n+1);assert.equal(c.sourceGroup,group);assert.equal(c.entryLevel,level);assert.equal(c.type,'tongbreker')});
}
const data={window:{DIGIBORD_DATA:{retained:true}}};vm.runInNewContext(read('tongbrekers-240.js'),data);assert.equal(data.window.DIGIBORD_DATA.retained,true);assert.deepEqual(JSON.parse(JSON.stringify(data.window.DIGIBORD_DATA.tongueBank)),bank);
assert.equal(migration.retainedIds.length,94);assert.equal(migration.newIds.length,146);assert.deepEqual(new Set([...migration.retainedIds,...migration.newIds]),new Set(bank.cards.map(c=>c.id)));
const existingAudio=JSON.parse(fs.readFileSync(path.join(__dirname,'before-activation-20260921/tongbrekers-audio.json'),'utf8')).recordings;
assert.equal(audio.items.length,240);assert.equal(new Set(audio.items.map(c=>c.id)).size,240);
const completeAudio=json('tongbrekers-audio-240.json');assert.equal(hash(read('tongbrekers-audio-240.json')),manifest.audioManifestSha256);
assert.equal(completeAudio.recordings.length,240);assert.equal(new Set(completeAudio.recordings.map(r=>r.id)).size,240);assert.equal(new Set(completeAudio.recordings.map(r=>r.sha256)).size,240);
for(const c of bank.cards){
 const plan=audio.items.find(a=>a.id===c.id),record=completeAudio.recordings.find(a=>a.id===c.id);assert.ok(record);assert.equal(plan.text,c.text);assert.equal(record.text,c.text);assert.equal(c.audio.src,plan.src);assert.equal(c.audio.src,record.src);assert.equal(c.audio.voice,record.voice);assert.equal(hash(fs.readFileSync(path.join(root,plan.src))),plan.sha256);assert.equal(record.sha256,plan.sha256);assert.ok(record.durationSeconds>0.5&&record.truePeakDbTP<0);
 if(migration.retainedIds.includes(c.id)){const old=existingAudio.find(a=>a.id===c.id);assert.ok(old);assert.equal(old.text,c.text);assert.equal(plan.status,'reuse_exact_text');assert.equal(old.sha256,plan.sha256);assert.equal(old.src,c.audio.src)}
 else assert.ok(['generated_for_240','recovered_existing_history'].includes(plan.status));
}
assert.equal(audio.items.filter(x=>x.status==='reuse_exact_text').length,94);assert.equal(audio.items.filter(x=>x.status==='generated_for_240').length,140);assert.equal(audio.items.filter(x=>x.status==='recovered_existing_history').length,6);assert.equal(audio.recordingRequired,0);
// Validate the full source package with the production filter and renderer.
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');let rendered='';
const ctx=vm.createContext({RUNTIME:{tongueBank:bank},CARD_GAMES:[],APP:{level:'A2'},$$:()=>[],esc:s=>String(s??''),setLast(){},renderCardTable:(kind,count,html)=>{rendered=html}});
vm.runInContext(app.slice(app.indexOf('function cardsFor('),app.indexOf('function cardActivityHeader(')),ctx);
for(const [level,total] of Object.entries({A0:60,A1:120,A2:180,B1:240,B2:240,C1:240,C2:240})){
 ctx.APP.tongueLevel=level;ctx.APP.tongueDifficulty='';assert.equal(vm.runInContext("cardsFor('tongue').length",ctx),total);
 for(const difficulty of ['','easy','medium','hard']){ctx.APP.tongueDifficulty=difficulty;const expected=bank.cards.filter(c=>bank.levels.indexOf(c.entryLevel)<=bank.levels.indexOf(level)&&(!difficulty||({easy:c.difficulty<=2,medium:c.difficulty===3,hard:c.difficulty>=4}[difficulty])));assert.deepEqual(Array.from(vm.runInContext("cardsFor('tongue')",ctx),c=>c.id),expected.map(c=>c.id));ctx.APP.cardIndex=999;vm.runInContext('startTongue()',ctx);assert.ok(!/undefined|NaN/.test(rendered))}
}
ctx.APP.tongueLevel='C2';ctx.APP.tongueDifficulty='';
for(let n=0;n<240;n++){ctx.APP.cardIndex=n;vm.runInContext('startTongue()',ctx);assert.ok(rendered.includes(bank.cards[n].text))}
console.log('PASS: 240 unique source-identical cards; four groups of 60; bundle parity; 240 verified audio links / original 94 preserved / 146 completed; all 28 filters and 240 existing-renderer outputs. Source package verified.');
