/* Shuffled combinations without replacement. Random visual motion is separate. */
globalThis.PraatpadActionRolls=(()=>{
'use strict';
const SIZE=6**9;
const integer=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
const validValues=v=>Array.isArray(v)&&v.length===9&&v.every(n=>integer(n,1,6));
const valid=s=>s&&[1,2].includes(s.version)&&integer(s.seed,1,0xffffffff)&&integer(s.offset,0,SIZE-1)&&integer(s.cursor,0,SIZE-1)&&integer(s.epoch,0,100000)&&validValues(s.values)&&(s.reserved===undefined||Array.isArray(s.reserved)&&s.reserved.length<=32&&s.reserved.every(validValues));
function random(){const a=new Uint32Array(1);globalThis.crypto.getRandomValues(a);return a[0]/4294967296;}
function mix(n){n=Math.imul(n^(n>>>16),0x7feb352d);n=Math.imul(n^(n>>>15),0x846ca68b);return(n^(n>>>16))>>>0;}
function faces(seed,n){
 // Eight unbalanced Feistel rounds permute exactly 6^9 indices. The two
 // domains swap each round; modular addition is invertible even for base 6.
 let left=Math.floor(n/7776),right=n%7776,a=1296,b=7776;
 for(let round=0;round<8;round++){
  const next=(left+mix(right^mix(seed+round*0x9e3779b9)))%a;
  left=right;right=next;[a,b]=[b,a];
 }
 let value=left*7776+right;
 return Array.from({length:9},()=>{const face=value%6+1;value=Math.floor(value/6);return face;});
}
function create(r=random){const seed=1+Math.floor(r()*0xffffffff),offset=Math.floor(r()*SIZE);return {version:2,seed,offset,cursor:0,epoch:0,values:faces(seed,offset),reserved:[]};}
function next(s,r=random,recent=[],accept=()=>true){
 if(!valid(s))throw Error('Ongeldige beeldworp');
 const old=[...s.values];
 if(s.version===1){const reserved=[old,...recent.filter(validValues)].slice(0,32);Object.assign(s,create(r),{values:old,reserved});}
 for(;;){
  if(s.cursor===SIZE-1){const epoch=s.epoch+1;Object.assign(s,create(r),{epoch,values:old});}
  s.cursor++;
  const values=faces(s.seed,(s.offset+s.cursor)%SIZE);
  // Skipped indices are never revisited. All dice must change, including after
  // undo. No large list of previously emitted combinations is needed.
  if(values.some((v,i)=>v===old[i]))continue;
  if(s.reserved?.some(row=>row.every((v,i)=>v===values[i])))continue;
  if(!accept(values))continue;
  s.values=values;return values;
 }
}
function motion(index,r=random){return {spin:[(1+index%2)*(r()<.5?-1:1),(1+index%2)*(r()<.5?-1:1),(index%2)*(r()<.5?-1:1)],fraction:.90+index*.006+r()*.02,delay:r()*35,lift:0};}
return {SIZE,valid,validValues,create,next,faces,motion};
})();
