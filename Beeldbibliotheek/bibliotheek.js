globalThis.PraatpadLibrary=(()=>{
'use strict';
const C=globalThis.PraatpadLibraryContent,A=globalThis.PraatpadActions,R=globalThis.PraatpadActionRolls;
const actions=A.items.map(x=>({...x,kind:'action'})),items=[...C.items,...actions].map(item=>({...item,...globalThis.PraatpadBoldPictures?.[item.id],...(globalThis.PraatpadBasisIcons?.description(item.id)?{description:globalThis.PraatpadBasisIcons.description(item.id)}:{})})),lookup=new Map(items.map(x=>[x.id,x]));
const choices=[{id:'actions',label:'54 actiewoorden'},{id:'base',label:'Basisset · personen, plaatsen en voorwerpen'},{id:'mix',label:'Basisset + actiewoorden'},...C.themes.map(t=>({id:t.id,label:t.label}))];
const known=id=>choices.some(c=>c.id===id),theme=id=>C.themes.find(t=>t.id===id),title=id=>choices.find(c=>c.id===id)?.label||choices[0].label;
const labels={person:'Personen en rollen',place:'Plaatsen',object:'Voorwerpen',action:'Actiewoorden'};
function svg(id,large=false){if(globalThis.PraatpadBasisIcons?.has(id))return globalThis.PraatpadBasisIcons.svg(id);const item=lookup.get(id),[x,y,w,h]=item.bounds||pictureBounds[id]||[0,0,96,96],side=Math.max(w,h)+12,box=large?[x+w/2-side/2,y+h/2-side/2,side,side].join(' '):'0 0 96 96';return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" fill="${item.solid?'#07539a':'none'}" fill-rule="evenodd" stroke="${item.solid?'none':'#0865b0'}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.paths.map(d=>`<path d="${d}"/>`).join('')}</svg>`;}
function shuffled(array,seed){let n=(seed+1)*2654435761>>>0;const a=[...array];for(let i=a.length-1;i>0;i--){n^=n<<13;n^=n>>>17;n^=n<<5;const j=(n>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
const cache=new Map();
function decks(id='actions',selection=0){
 const key=id+':'+selection;if(cache.has(key))return cache.get(key);
 let result=[];
 if(id==='actions')result=A.groups.map((label,i)=>({label,ids:A.items.slice(i*6,i*6+6).map(x=>x.id)}));
 else{
  const t=theme(id),priority=new Set(t?.ids||[]),counts=id==='base'?{person:2,place:3,object:4}:{person:1,place:2,object:3,action:3};
  Object.entries(counts).forEach(([kind,count],index)=>{
   const pool=shuffled(items.filter(x=>x.kind===kind),selection*7+index);
   const sorted=[...pool.filter(x=>priority.has(x.id)),...pool.filter(x=>!priority.has(x.id))];
   for(let i=0;i<count;i++)result.push({label:labels[kind],ids:sorted.slice(i*6,i*6+6).map(x=>x.id)});
  });
 }
 if(cache.size>30)cache.clear();cache.set(key,result);return result;
}
function accepts(id,selection,values){const t=theme(id);if(!t)return true;const ids=new Set(t.ids),d=decks(id,selection);return values.filter((v,i)=>ids.has(d[i].ids[v-1])).length>=3;}
// Measured SVG path bounds: center each drawing and use more of the die face.
const pictureBounds={"basis-buurvrouw":[12,14,78,68],"basis-buurman":[12,14,78,68],"basis-vriend":[14,19,68,64],"basis-vriendin":[14,15.44,68,67.56],"basis-verkoper":[10,14,76,69],"basis-klant":[12,12,72,72],"basis-docent":[8,11,79,72],"basis-cursist":[12,12,73,76],"basis-collega":[8,21,80,62],"basis-arts":[18,13,60,71],"basis-reiziger":[16,9,65,75],"basis-bezorger":[21,12,51,70],"basis-huis":[10,12,76,72],"basis-markt":[8,20,82,59],"basis-winkel":[9,13,78,71],"basis-supermarkt":[9,21,75,66],"basis-bakkerij":[9,15,78,69],"basis-restaurant":[15,18,66,66],"basis-cafe":[7,14,82,72],"basis-school":[14,7,68,78],"basis-bibliotheek":[9,13,78,72],"basis-kantoor":[13,12,71,73],"basis-ziekenhuis":[10,11,76,73],"basis-apotheek":[10,12,76,72],"basis-station":[9,15,78,72],"basis-bushalte":[17,13,69,72],"basis-park":[9.86,12,79.14,73],"basis-straat":[7,17,83,71],"basis-sporthal":[12,19,72,65],"basis-gemeentehuis":[9,6,79,79],"basis-sleutel":[14,14,69,63],"basis-tas":[20,11,58,70],"basis-telefoon":[23,10,50,77],"basis-fiets":[6,24,85,59.01],"basis-portemonnee":[10,20,77,58],"basis-geld":[10,22,79,64],"basis-boodschappentas":[13,10,71,74],"basis-appel":[15.21,10,69.05,72.5],"basis-brood":[12,28.88,73,46.12],"basis-fles":[28,5,40,78],"basis-beker":[18,12,68.25,70],"basis-bord":[13,12.99,70,70.02],"basis-boek":[11,21.11,74,63.89],"basis-pen":[19,13.73,64.27,68.27],"basis-agenda":[19,9,59,76],"basis-computer":[11,13,75,74],"basis-kaartje":[9,24,78,50],"basis-koffer":[23,10,52,79],"basis-pakket":[13,13,70,74],"basis-medicijn":[16,10,74.06,68],"basis-thermometer":[17.22,17,62.78,70],"basis-bal":[13,12.99,70,70.02],"basis-stoel":[23,11,52,75],"basis-tafel":[10,18,77,68],"aw-01":[12,17,73,67],"aw-02":[10,9,67,73],"aw-03":[14,14,68,73],"aw-04":[14,9,69,73],"aw-05":[18,12,69,75],"aw-06":[18,12,56,70],"aw-07":[10,16,76,68],"aw-08":[11,38,74,48],"aw-09":[10,23,76,59],"aw-10":[10,14,74,72],"aw-11":[9,27,78,60],"aw-12":[12,39,73,43],"aw-13":[12,7,67,76],"aw-14":[7,8,72,61],"aw-15":[8,9,80,72],"aw-16":[11,12,74,71],"aw-17":[9,9,77,75],"aw-18":[9,9,77,75],"aw-19":[16,13,64,69],"aw-20":[18,18,69.29,64],"aw-21":[16,16,71,67],"aw-22":[10,12,77,72],"aw-23":[11,10,76,74],"aw-24":[9,12,76,73],"aw-25":[21,13,47,68],"aw-26":[10,16,76,68],"aw-27":[18,10,70,74],"aw-28":[9,16,78,71],"aw-29":[8,19,80,64],"aw-30":[11,15,73,69],"aw-31":[9,11,81,74],"aw-32":[8,19,80,69],"aw-33":[7,12,81.39,69],"aw-34":[9,25,80,59],"aw-35":[11,8,69,75],"aw-36":[9,16,77,71],"aw-37":[18,26,60,59],"aw-38":[9,10,77,75],"aw-39":[8,15,78,68],"aw-40":[8,10,81,74],"aw-41":[10,13,77,73],"aw-42":[9,12,80,74],"aw-43":[9,22,76,65],"aw-44":[10.43,12,71.07,72],"aw-45":[16,15,67,70],"aw-46":[17,13,71,71],"aw-47":[20,11,56,72],"aw-48":[12,9,77,78.01],"aw-49":[9,12,71,74],"aw-50":[10,12,70,74],"aw-51":[12,17,76,70],"aw-52":[15,9,66,75],"aw-53":[12,17,75,69],"aw-54":[10,17,74,70]};
function provider(ids){let atlas;return {atlas(){if(atlas)return atlas;const c=document.createElement('canvas');c.width=1536;c.height=256;const x=c.getContext('2d');x.strokeStyle='#fff';x.fillStyle='#fff';x.lineWidth=5;x.lineCap='round';x.lineJoin='round';ids.forEach((id,i)=>{x.save();x.translate(i*256,0);if(globalThis.PraatpadBasisIcons?.has(id)){x.scale(2,2);globalThis.PraatpadBasisIcons.draw(x,id);x.restore();return;}x.scale(256/96,256/96);const [bx,by,bw,bh]=lookup.get(id).bounds||pictureBounds[id]||[0,0,96,96],zoom=Math.min(1.25,82/Math.max(bw,bh));x.translate(48,48);x.scale(zoom,zoom);x.translate(-bx-bw/2,-by-bh/2);x.lineWidth=6/zoom;for(const p of lookup.get(id).paths){if(lookup.get(id).solid)x.fill(new Path2D(p),'evenodd');else x.stroke(new Path2D(p));}x.restore();});return atlas=c;}};}
const N=globalThis.PraatpadLevelContent;
const level=p=>N.levels.includes(p.level)?p.level:'A2';
const profile=p=>N.packs.find(x=>x.theme===(p.collection||'actions')&&x.level===level(p));
const stateKey=(id,l)=>theme(id)?id+'@'+l:id;
const knownKey=key=>known(key)||N.levels.some(l=>key.endsWith('@'+l)&&!!theme(key.slice(0,-3)));
const clone=x=>JSON.parse(JSON.stringify(x));
const snapshot=p=>({actions:clone(p.actions),history:clone(p.history),result:p.result,turn:p.turn,word:p.word,selection:p.selection||0});
function select(p,id,newSelection=false,nextLevel=level(p)){
 if(!known(id)||!N.levels.includes(nextLevel))return;
 p.collections??={};p.collections[stateKey(p.collection||'actions',level(p))]=snapshot(p);
 const key=stateKey(id,nextLevel);
 let next=p.collections[key]||(nextLevel==='A2'?p.collections[id]:undefined);
 if(!next||newSelection){const selection=newSelection?((p.selection||0)+1)%100000:0,actions=R.create();if(!accepts(id,selection,actions.values))R.next(actions,undefined,[],values=>accepts(id,selection,values));next={actions,history:[],result:null,turn:0,word:true,selection};}
 Object.assign(p,clone(next),{collection:id,level:nextLevel});
}
const integer=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
function validSnapshot(s){return s&&R.valid(s.actions)&&integer(s.selection,100000)&&integer(s.turn,100000)&&(s.result===null||Number.isInteger(s.result)&&s.result>=1&&s.result<=6)&&typeof s.word==='boolean'&&Array.isArray(s.history)&&s.history.length<=20&&s.history.every(h=>h&&R.validValues(h.actions)&&integer(h.turn,100000)&&(h.result===null||Number.isInteger(h.result)&&h.result>=1&&h.result<=6));}
function validState(p){return (p.wordsDefaultApplied===undefined||typeof p.wordsDefaultApplied==='boolean')&&(p.level===undefined||N.levels.includes(p.level))&&(p.practiceMode===undefined||['speak','write'].includes(p.practiceMode))&&(p.languageCards===undefined||typeof p.languageCards==='boolean')&&(p.collection===undefined||known(p.collection))&&(p.selection===undefined||integer(p.selection,100000))&&(p.collections===undefined||p.collections&&typeof p.collections==='object'&&!Array.isArray(p.collections)&&Object.keys(p.collections).length<=59&&Object.entries(p.collections).every(([key,value])=>knownKey(key)&&validSnapshot(value)));}
return {levels:N.levels,goals:N.goals,level,profile,items,lookup,choices,known,title,theme,labels,svg,decks,accepts,provider,select,validState};
})();
