const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await page.goto(process.env.BASE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 await page.locator('[data-category="cards"]').click();
 for(const [level,route,tongue] of [['A0','R0','A0'],['A1','R1','A1'],['A1+','R2','A1'],['B2','R5','B2']]){
  await page.locator('[data-ctype="conversation"]').click();await page.locator('#levelSelect').selectOption(level);
  const options=await page.locator('#levelSelect').innerHTML();
  assert.equal(await page.evaluate(()=>currentCard().routeId),route);
  await page.locator('[data-ctype="tongue"]').click();assert.equal(await page.locator('#levelSelect').inputValue(),level);assert.equal(await page.evaluate(()=>tongueLevel()),tongue);
  await page.locator('[data-ctype="c1-between-lines"]').click();assert.equal(await page.locator('#levelSelect').inputValue(),'C1');assert.ok(await page.locator('#levelSelect').isDisabled());assert.equal(await page.evaluate(()=>APP.level),level);
  await page.locator('[data-main="play"]').click();assert.equal(await page.locator('#levelSelect').inputValue(),level);assert.equal(await page.locator('#levelSelect').innerHTML(),options);
  await page.reload();assert.equal(await page.locator('#levelSelect').inputValue(),level);
  await page.locator('[data-category="cards"]').click();await page.locator('[data-ctype="conversation"]').click();assert.equal(await page.evaluate(()=>currentCard().routeId),route);
 }
 await page.locator('[data-ctype="tongue"]').click();await page.locator('#levelSelect').selectOption('A0');
 await page.locator('[data-ctype="conversation"]').click();assert.equal(await page.evaluate(()=>currentCard().routeId),'R0');
 await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsOverlay iframe').contentDocument?.querySelector('#routeSelect')?.value==='A0 → A1');assert.equal(await page.frameLocator('#settingsOverlay iframe').locator('#routeSelect').inputValue(),'A0 → A1');await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();assert.equal(await page.locator('#levelSelect').inputValue(),'A0');
 console.log('PASS: app-wide level, every route including A1+, fixed C1 without changing preference, tongue selection, reload and settings return.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
