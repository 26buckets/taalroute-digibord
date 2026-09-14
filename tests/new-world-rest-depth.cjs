const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),server=require('../server.cjs');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),base=`http://127.0.0.1:${server.address().port}/Praatpad.html`,out=path.join(__dirname,'artifacts/rest-depth');fs.mkdirSync(out,{recursive:true});
  await page.goto(base);const maps=await page.evaluate(()=>DigiBoardMaps.slice(11,26));
  for(const map of maps){
   await page.goto(base+'?kaart='+map.id);await page.locator('#pp-scenery').evaluate(e=>e.decode());
   const results=await page.evaluate(()=>{
    const W=PraatpadWorld,m=document.querySelector('#pp-map'),f=W.fit(m.clientWidth,m.clientHeight),issues=[];
    for(const p of W.passages.filter(p=>p.kind==='tunnel'))for(const reverse of [false,true]){
     const from=reverse?p.to:p.from,to=reverse?p.from:p.to;
     const last=W.pose(from,to,1),atRest=W.pawnDepth([last.point[0]*f.scale+f.x,last.point[1]*f.scale+f.y],m.clientWidth,m.clientHeight);
     if(atRest!==last.depth)issues.push({passage:p.id,reverse,atRest,animated:last.depth});
     if(last.opacity!==1||last.scale!==1)issues.push('not fully emerged');
     const next=to+(reverse?-1:1);
     if(next>=0&&next<W.anchors.length){const q=W.pose(to,next,.01),d=W.pawnDepth([q.point[0]*f.scale+f.x,q.point[1]*f.scale+f.y],m.clientWidth,m.clientHeight);if(d!==11)issues.push({passage:p.id,reverse,next,depth:d});}
    }
    return issues;
   });assert.deepEqual(results,[],map.id);
   const endpoints=await page.evaluate(()=>PraatpadWorld.passages.filter(p=>p.kind==='tunnel').flatMap(p=>[p.from,p.to]));
   for(const pos of endpoints){
    await page.evaluate(pos=>{const d=JSON.parse(localStorage.getItem(DigiBoard.storageKey()));d.session.players.forEach(p=>p.pos=pos);d.session.selected=pos;d.session.active=0;d.session.finished=false;d.history=[];localStorage.setItem(DigiBoard.storageKey(),JSON.stringify(d));},pos);
    await page.reload();await page.locator('#pp-scenery').evaluate(e=>e.decode());
    assert.equal(await page.locator('.pp-pawn[data-current=true]').evaluate(e=>getComputedStyle(e).zIndex),'11',map.id+' reload at '+pos);
    const clip=await page.evaluate(pos=>{const m=document.querySelector('#pp-map'),r=m.getBoundingClientRect(),f=PraatpadWorld.fit(m.clientWidth,m.clientHeight),p=PraatpadWorld.anchors[pos];return{x:Math.max(0,Math.min(innerWidth-250,r.x+f.x+p[0]*f.scale-125)),y:Math.max(0,Math.min(innerHeight-230,r.y+f.y+p[1]*f.scale-160)),width:250,height:230};},pos);
    await page.screenshot({path:path.join(out,`${map.id}-${pos}.png`),clip});
   }
   console.log('PASS exit, rest, reload and next step both directions',map.id);
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
