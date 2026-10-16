// Protect the executed E1 runtime, not the obsolete archive-only count.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),ctx={window:{}};ctx.globalThis=ctx;
vm.runInNewContext(read('data-bundle.js'),ctx);ctx.DIGIBORD_DATA=ctx.window.DIGIBORD_DATA;
ctx.DIGIBORD_DATA.tongueBank={cards:require('./fixtures/p0/tongue.json').historical.map(c=>c.record)};
vm.runInNewContext(read('data/e1-release.js')+'\n'+read('data/restored-rebuses.js').replace('window.RestoredRebuses','RestoredRebuses')+'\n'+read('e1-cards.js'),ctx);
const expected=[...require('./fixtures/p0/idioms.json').approved,...require('./fixtures/p0-restored-rebuses-80.json').cards.map(record=>({id:record.id,record}))],actual=ctx.DIGIBORD_DATA.cardGames.families.find(f=>f.id==='idioms').cards;
assert.deepEqual(Array.from(actual,c=>c.id).sort(),expected.map(c=>c.id).sort(), 'canonical IDs');
const rebuses=expected.filter(c=>c.record.visualRebus);
assert.equal(actual.filter(c=>c.visualRebus).length,rebuses.length);
for(const e of rebuses){const c=actual.find(c=>c.id===e.id);assert.equal(JSON.stringify(c.visualRebus),JSON.stringify(e.record.visualRebus));assert.equal(c.instruction,e.record.instruction);const bytes=fs.readFileSync(path.join(root,c.visualRebus.src));assert.equal(bytes.subarray(1,4).toString(),'PNG');}
console.log('PASS: canonical 40 + recovered 80 IDs and frozen Drive-backed rebus media preserved after the actual E1 adapter');
