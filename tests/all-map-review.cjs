const {chromium}=require('playwright'),server=require('../server.cjs'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:1672,height:1080},reducedMotion:'reduce'}),out=path.join(__dirname,'artifacts/all-map-review'),errors=[];fs.mkdirSync(out,{recursive:true});
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const base=`http://127.0.0.1:${server.address().port}`;await page.goto(base+'/Praatpad.html');const maps=await page.evaluate(()=>DigiBoardMaps);
  for(const map of (process.env.REVIEW_REUSE?[]:maps)){
   await page.goto(base+'/Praatpad.html?kaart='+map.id);await page.locator('#pp-scenery').evaluate(e=>e.decode());
   await page.evaluate(()=>{
    const root=document.querySelector('#praatpad-board'),m=document.querySelector('#pp-map');root.dataset.routeHelp='true';
    const W=globalThis.PraatpadWorld;if(!W?.legs)return;
    const f=W.fit(m.clientWidth,m.clientHeight),screen=q=>[q[0]*f.scale+f.x,q[1]*f.scale+f.y],passages=W.passages||[];
    const line=(points,color)=>`<polyline points="${points.map(p=>screen(p).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
    let art=W.legs.map((leg,i)=>passages.some(p=>p.from===i&&p.to===i+1)?'':line(leg,'#e62c45')).join('');
    art+=passages.flatMap(p=>[p.enter&&line(p.enter,'#12c54c'),p.exit&&line(p.exit,'#12c54c'),p.water&&line(p.water,'#16b6eb')]).filter(Boolean).join('');
    m.insertAdjacentHTML('beforeend',`<svg aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;z-index:20;pointer-events:none" viewBox="0 0 ${m.clientWidth} ${m.clientHeight}">${art}</svg>`);
   });
   await page.locator('#pp-map').screenshot({path:path.join(out,map.id+'.png')});console.log('REVIEW',map.id);
  }
  await page.goto("about:blank");
  await page.setViewportSize({width:1672,height:1080});
  for(let i=0;i<maps.length;i+=4){
   await page.setContent(`<style>body{margin:12px;background:#eae7df;font:18px Arial}main{display:grid;grid-template-columns:1fr 1fr;gap:12px}article{background:white}h2{font-size:20px;margin:8px}img{display:block;width:100%}</style><main>${maps.slice(i,i+4).map(m=>`<article><h2>${m.label} · ${m.count} vakken</h2><img src="data:image/png;base64,${fs.readFileSync(path.join(out,m.id+'.png')).toString('base64')}"></article>`).join('')}</main>`);
   await page.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));await page.screenshot({path:path.join(out,`contact-${i/4+1}.png`),fullPage:true});
  }
  assert.deepEqual(errors,[]);console.log('PASS all 46 images loaded and route review sheets produced');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
