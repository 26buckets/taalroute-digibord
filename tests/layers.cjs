const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
 const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));const base=`http://127.0.0.1:${server.address().port}/Praatpad.html`;
 await p.goto(base);const maps=await p.evaluate(()=>DigiBoardMaps);
 for(const map of maps){await p.goto(base+'?kaart='+map.id);await p.locator('#pp-scenery').evaluate(e=>e.decode());
 const result=await p.evaluate(()=>{
  const root=document.getElementById('praatpad-board'),pawn=document.querySelector('#pp-pawns .pp-pawn'),tiles=document.getElementById('pp-tiles'),transport=document.getElementById('pp-transport');root.dataset.routeHelp='true';
  const failures=[];const pawnZ=+getComputedStyle(pawn).zIndex,tileZ=+getComputedStyle(tiles).zIndex;
  if(tileZ>=pawnZ||tileZ>=+getComputedStyle(transport).zIndex)failures.push('numbers cover normal or travelling pawn');
  // Temporarily place the actual pawn over each marker and hit-test browser paint order.
  // Pointer events are enabled only for the diagnostic, since pawns are normally transparent to clicks.
  const original=pawn.style.cssText;pawn.style.pointerEvents='auto';pawn.style.zIndex='7';
  for(const n of [12,13,15,20,21,28]){const tile=document.querySelector(`[data-node="${n}"]`);if(!tile)continue;tile.dataset.active='true';tile.dataset.preview='true';pawn.style.left=tile.style.left;pawn.style.top=tile.style.top;
   const a=pawn.getBoundingClientRect(),c=tile.getBoundingClientRect(),x=(Math.max(a.left,c.left)+Math.min(a.right,c.right))/2,y=(Math.max(a.top,c.top)+Math.min(a.bottom,c.bottom))/2;
   if(a.right<c.left||a.bottom<c.top)failures.push('missing overlap '+n);
   const stack=document.elementsFromPoint(x,y),pi=stack.findIndex(e=>e===pawn||pawn.contains(e)),ti=stack.findIndex(e=>e===tile||tile.contains(e));
   if(pi<0||ti<0||pi>=ti)failures.push('paint order '+n);
   delete tile.dataset.active;delete tile.dataset.preview;
  }
  for(const [id,z] of [['map-green-front',10],['rotterdam-near-pylon',10],['rotterdam-far-pylon',8]]){const e=document.getElementById(id);if(e&&+getComputedStyle(e).zIndex!==z)failures.push('changed foreground depth '+id);}
  const bridge=document.querySelector('.dutch-bridge-front');if(bridge&&+getComputedStyle(bridge).zIndex<=11)failures.push('doorway depth overrides bridge railing');
  if(getComputedStyle(pawn.parentElement).zIndex!=='auto')failures.push('pawn wrapper traps dynamic depth');
  return{failures,tileZ,pawnZ};
 });assert.deepEqual(result.failures,[],map.id);console.log('PASS pawn above markers',map.id);
 if(map.id==='Rotterdam-havenroute'){fs.mkdirSync(__dirname+'/artifacts',{recursive:true});await p.screenshot({path:__dirname+'/artifacts/pion-boven-vaknummers.png'});}
 }
 assert.deepEqual(errors,[]);
 }finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
