const assert=require('node:assert/strict'),{transition,valid}=require('../card-shuffle');
const opts=ids=>({family:'tongue',route:'A0_A1',eligibleIds:ids,knownIds:Array.from({length:240},(_,i)=>'C'+i)});
for(const n of [0,1,2,60,120,180,240]){
 const ids=Array.from({length:n},(_,i)=>'C'+i),o=opts(ids);let s=transition(null,o),last=null;
 for(let cycle=0;cycle<3;cycle++){
  const seen=new Set();if(n>1)assert.notEqual(s.currentCardId,last);
  for(let i=0;i<n;i++){
   assert.ok(valid(s));assert.ok(ids.includes(s.currentCardId));assert.ok(!seen.has(s.currentCardId));seen.add(s.currentCardId);
   const persisted=JSON.parse(JSON.stringify(s));assert.deepEqual(transition(persisted,o,'resume',()=>{throw Error('reshuffle on resume')}),s);
   last=s.currentCardId;s=transition(s,o,'next');
  }
  assert.equal(seen.size,n);if(n)assert.equal(s.cycle,cycle+2);
 }
 if(!n)assert.equal(s.currentCardId,null);
}
let s=transition(null,opts(['C0','C1','C2']), 'resume',()=>0);
s=transition(s,opts(['C0','C1','C2']),'next');const seen=[...s.used],current=s.currentCardId;
s=transition(s,{...opts(['C0','C1','C2','C3']),route:'A1_A2'});assert.equal(s.currentCardId,current);assert.ok(seen.every(id=>s.used.includes(id)));assert.ok(s.queue.includes('C3'));
s=transition(s,opts(['C3']));assert.equal(s.currentCardId,'C3');assert.ok(seen.every(id=>s.used.includes(id)));
s=transition(s,opts(['C0','C1','C2','C3']));assert.ok(seen.every(id=>!s.queue.includes(id)));
const keep=structuredClone(s);s=transition(s,opts([]));assert.ok(keep.used.every(id=>s.used.includes(id)));s=transition(s,opts(['C0','C1','C2','C3']));assert.ok(valid(s));
s=transition(s,{...opts(['C0','C4']),knownIds:['C0','C4']});assert.ok(s.used.every(id=>['C0','C4'].includes(id)));assert.ok(s.lastCardId===null||['C0','C4'].includes(s.lastCardId));assert.ok(s.currentCardId==='C4'||s.queue.includes('C4'));
s=transition(s,opts(['C0','C1']),'reset');assert.equal(s.resetCount,1);assert.equal(s.used.length,1);assert.equal(s.queue.length,1);
const before=structuredClone(s);s=transition(s,opts(['C0','C1']),'next');const after=structuredClone(s);s=transition(s,opts(['C0','C1']),'previous');assert.equal(s.currentCardId,before.currentCardId);assert.deepEqual(transition(s,opts(['C0','C1']),'next'),after);
assert.deepEqual(transition(null,opts(['C0','C1','C2']), 'resume',()=>0).history,['C1']);
const migrated=transition(null,{...opts(['C0','C1','C2']),preferredId:'C2'});assert.equal(migrated.currentCardId,'C2');assert.ok(!migrated.queue.includes('C2'));
assert.equal(transition(null,opts(['C0','C0','C1'])).eligible.length,2);
assert.ok(valid(transition({queue:'broken'},opts(['C0']))));assert.equal(valid({...migrated,privateText:'no'}),false);
assert.throws(()=>transition(null,opts([null])));
for(let run=0;run<50;run++){
 let deck=null;for(let i=0;i<100;i++){
  const eligible=Array.from({length:1+Math.floor(Math.random()*240)},(_,j)=>'C'+j),o=opts(eligible);
  const resumed=transition(deck,o),unseen=eligible.filter(id=>!resumed.used.includes(id));
  deck=transition(resumed,o,'next');assert.ok(valid(deck));if(unseen.length)assert.ok(unseen.includes(deck.currentCardId));
 }
}
console.log('PASS card shuffle: exact cycles 0/1/2/60/120/180/240, boundary, no-random resume, route/filter overlap, changed content, reset, previous, legacy, invalid state, 5000 randomized transitions.');
