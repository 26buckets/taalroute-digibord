const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto(process.env.BASE_URL||'file://'+path.join(served,'index.html'));
 await page.locator('[data-category="cards"]').click();
 const kinds=await page.locator('[data-ctype]').evaluateAll(nodes=>nodes.map(n=>n.dataset.ctype));
 const selectors=['#app>header .mainnav','#app>header .header-actions','#levelSelect','.card-activity-heading','.game-card-motion','.active-card','.card-ribbon','.card-controls','.cardtypes','.gamebar','#primaryGame','#undoAction','[data-goptions]'];
 const geometry=()=>page.evaluate(selectors=>selectors.map(s=>{const r=document.querySelector(s).getBoundingClientRect();const keys=innerWidth<1100&&!s.includes('header')&&!['#levelSelect','.gamebar','#primaryGame','#undoAction','[data-goptions]'].includes(s)?['x','width']:['x','y','width','height'];return [s,...keys.map(k=>Math.round(r[k]))]}),selectors);
 for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[320,568]]){
  await page.setViewportSize({width,height});let reference;
  for(const kind of kinds){
   await page.locator(`[data-ctype="${kind}"]`).click();await page.locator('.card-work').evaluate(e=>e.scrollTop=0);
   assert.ok(await page.locator('.card-content').evaluate(e=>!['auto','scroll'].includes(getComputedStyle(e).overflowY)),'nested card scroll');
   const actual=await geometry();if(!reference)reference=actual;else assert.deepEqual(actual,reference,`${kind}: moving layout at ${width}`);
   assert.equal(await page.locator('.card-activity-heading select').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${kind} ${width}`);
   assert.ok(await page.locator('.card-controls').evaluate(e=>e.scrollWidth<=e.clientWidth),`toolbar overflow ${kind} ${width}`);
   if(kind==='tongue'){
    assert.equal(await page.locator('.card-controls #tongueDifficulty,.card-controls #tongueRead').count(),2);
    await page.locator('#tongueDifficulty').selectOption('hard');assert.deepEqual(await geometry(),reference,'difficulty moved layout');
    await page.locator('#tongueDifficulty').selectOption('');
   }
   if(kind==='c1-between-lines'){
    assert.equal(await page.locator('.card-controls #c1Domain').count(),1);
    await page.locator('#c1Domain').selectOption('1');assert.deepEqual(await geometry(),reference,'domain moved layout');
    await page.locator('[data-c1-choice="A"]').click();await page.locator('.card-work').evaluate(e=>e.scrollTop=0);assert.deepEqual(await geometry(),reference,'feedback moved layout');
    await page.locator('#c1Domain').selectOption('');
   }
   if(process.env.SCREENSHOT_DIR&&['tongue','c1-between-lines','conversation'].includes(kind)&&[1440,390].includes(width)){
    fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`kaartindeling-${kind}-${width}.png`)});
   }
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS: all nine card families keep a stable table on classroom screens and full readable cards without nested scrolling on small screens.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
