const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),server=require('../server.cjs'),{control}=require('./ui-controls.cjs');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[],out=path.join(__dirname,'artifacts/library');fs.mkdirSync(out,{recursive:true});
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const base=process.env.APP_URL||`http://127.0.0.1:${server.address().port}/Praatpad.html`;
  await page.goto(base+'?kaart=pool-ijsroute');await page.locator('#pp-scenery').evaluate(e=>e.decode());
  const maps=await page.evaluate(()=>DigiBoardMaps),short=maps.filter(m=>m.count<=20);
  assert.equal(maps.length,46);assert.equal(short.length,12);
  const expected={dagelijks:6,nederland:28,fantasie:8,spreektijd:4,kort:12};
  await control(page,'#db-open-maps','click');
  for(const [id,count]of Object.entries(expected)){
   await page.locator(`[data-map-category="${id}"]`).click();
   assert.equal(await page.locator('[data-choose-world]:visible').count(),count);
   assert.equal(await page.locator('[data-map-category][aria-pressed="true"]').count(),1);
   assert.equal(await page.locator('[data-choose-world]').count(),46,'one button per map');
   await page.locator('[data-choose-world]:visible img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode()})));
  }
  assert.match(await page.locator('#db-map-results').textContent(),/12 kaarten · Maximaal 20 vakken/);
  for(const colorScheme of ['light','dark'])for(const width of [320,390,768,1280,1920]){
   await page.emulateMedia({colorScheme});await page.setViewportSize({width,height:900});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const box=await page.locator('#pp-dialog').boundingBox();assert(box.x>=0&&box.x+box.width<=width);
   for(const id of Object.keys(expected))assert((await page.locator(`[data-map-category="${id}"]`).boundingBox()).height>=44);
   await page.screenshot({path:path.join(out,`${colorScheme}-${width}.png`)});
  }
  await page.setViewportSize({width:1280,height:900});await page.keyboard.press('Escape');
  for(const map of short){
   await control(page,'#db-open-maps','click');await page.locator('[data-map-category="kort"]').click();
   await page.locator(`[data-choose-world="${map.id}"]`).click();await page.waitForURL(u=>u.searchParams.get('kaart')===map.id);
   await page.locator('#pp-scenery').evaluate(e=>e.decode());assert.equal(await page.evaluate(()=>DigiBoard.mapId),map.id);
   await control(page,'#db-open-maps','click');assert.equal(await page.locator(`[data-choose-world="${map.id}"]`).getAttribute('aria-pressed'),'true');
   await page.keyboard.press('Escape');console.log('PASS short map link',map.id);
  }
  await page.goBack();await page.locator('#pp-scenery').evaluate(e=>e.decode());assert.equal(await page.locator('#pp-dialog').evaluate(e=>e.open),false);
  await control(page,'#db-open-maps','click');await page.mouse.click(2,2);assert.equal(await page.locator('#pp-dialog').evaluate(e=>e.open),false);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({maps:maps.length,categories:expected,short:short.map(m=>m.id),errors},null,2));
  console.log('PASS five categories, twelve short maps, links, history, previews, light/dark and five widths');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
