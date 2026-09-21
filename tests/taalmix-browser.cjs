const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.join(served,'index.html'));
 await page.locator('[data-main="play"]').click();await page.locator('[data-category="cards"]').click();await page.locator('[data-ctype="idioms"]').click();
 const boards=await page.evaluate(()=>JSON.stringify(APP.boardStates));
 await page.locator('#levelSelect').selectOption('A1');
 assert.equal(await page.locator('.card-counter').innerText(),'A1 · 1 van 60');
 assert.equal(await page.locator('#cardExample').isDisabled(),true);
 await page.locator('#cardAttempt').click();await page.locator('#cardExample').click();
 assert.ok(await page.locator('[data-support="example"]').isVisible());
 assert.ok((await page.locator('[data-support="example"]').innerText()).includes('Spreker: Goedemorgen.'));
 for(const level of ['A1','A2','B1','B2']){
  await page.locator('#levelSelect').selectOption(level);
  const seen=new Set();
  for(let i=0;i<60;i++){
   const id=await page.locator('[data-card-id]').getAttribute('data-card-id');assert.ok(!seen.has(id));seen.add(id);
   assert.equal(await page.locator('#cardExample').isDisabled(),true);
   assert.equal(await page.locator('[data-support="example"]').isVisible(),false);
   if(await page.locator('#cardRebus').count()){
    await page.waitForFunction(()=>document.querySelector('#cardRebus img').complete&&document.querySelector('#cardRebus img').naturalWidth>0);
    assert.equal(await page.locator('.card-content h2').innerText(),'Beeldrebus');
   }
   await page.locator('#primaryGame').click();
  }
  assert.equal(seen.size,60);assert.ok(seen.has(await page.locator('[data-card-id]').getAttribute('data-card-id')));
 }
 await page.locator('#levelSelect').selectOption('A1');await page.locator('#mixKind').selectOption('Spreekwoord');
 assert.ok(await page.getByText('Geen kaarten bij deze filters',{exact:true}).isVisible());assert.equal(await page.locator('#primaryGame').isDisabled(),true);
 await page.locator('#mixKind').selectOption('Rebus');await page.locator('#mixGroup').selectOption('Uitdaging');
 assert.equal(await page.locator('.card-counter').innerText(),'A1 · 1 van 6');
 const first=await page.locator('[data-card-id]').getAttribute('data-card-id');
 await page.locator('#primaryGame').click();await page.locator('#undoAction').click();assert.equal(await page.locator('[data-card-id]').getAttribute('data-card-id'),first);
 await page.locator('#cardRebus').click();assert.ok(await page.locator('#gameDialog img').isVisible());await page.locator('#dialogClose').click();
 await page.reload();await page.locator('#resumeBtn').click();
 assert.equal(await page.locator('#mixKind').inputValue(),'Rebus');assert.equal(await page.locator('#mixGroup').inputValue(),'Uitdaging');assert.equal(await page.locator('#levelSelect').inputValue(),'A1');
 assert.equal(await page.locator('[data-card-id]').getAttribute('data-card-id'),first);
 for(const width of [1920,1440,1024,768,390,320]){
  await page.setViewportSize({width,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+width);
  assert.ok(await page.locator('.taalmix-filters').evaluate(e=>e.scrollWidth<=e.clientWidth),'filter overflow '+width);
  await page.locator('#cardRebus').scrollIntoViewIfNeeded();
  assert.ok(await page.locator('#cardRebus').evaluate(e=>e.scrollWidth<=e.clientWidth),'image overflow '+width);
  if(process.env.SCREENSHOT_DIR&&[1440,390].includes(width)){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'taalmix-'+width+'.png')});}
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#mixKind').selectOption('');await page.locator('#mixGroup').selectOption('');await page.locator('#mixCollection').selectOption('legacy');await page.locator('#levelSelect').selectOption('all');
 assert.equal(await page.locator('.card-counter').innerText().then(s=>s.split(' van ')[1]),'22');
 assert.equal(await page.evaluate(()=>JSON.stringify(APP.boardStates)),boards);
 assert.deepEqual(errors,[]);
 console.log('PASS: 240-card cycle, all 80 images loaded, gated answers, empty filters, undo, enlargement, persisted filters, unchanged board state and six viewports.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
