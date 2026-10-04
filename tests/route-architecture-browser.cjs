const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 const ids=['ALPHA_AC','A0_A1','A1_A2','A2_B1','B1_B2','B2_C1'];
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 assert.deepEqual(await page.locator('#levelSelect option').evaluateAll(es=>es.map(e=>e.value)),ids);
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().length),9578); // Frozen R25 FREE count, also independently checked in e1-release-browser.cjs.
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().filter(i=>i.domain==='WORDS').length),2519);
 assert.equal(await page.evaluate(()=>ContentRuntime.items().filter(i=>DigiRoutes.classification(i).displayRoute===DigiRoutes.REVIEW).length),30);
 await page.locator('#settingsBtn').click();
 await page.waitForFunction(()=>document.querySelector('#settingsOverlay').classList.contains('open')&&document.querySelector('#settingsOverlay iframe').contentWindow?.DigiRoutes);
 assert.deepEqual(await page.frameLocator('#settingsOverlay iframe').locator('#routeSelect option').allTextContents(),await page.evaluate(()=>DigiRoutes.routes.map(r=>r.label)));
 await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();
 await page.waitForFunction(()=>!document.querySelector('#settingsOverlay').classList.contains('open'));
 // Historical A1+/C2 card snapshots require the explicit archive fixture; R25 public decks have different route coverage.
 await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.reload();
 for(const level of ['A1+','C2','A1→A1+']){
  const before=await page.evaluate(async level=>{
   goScreen('play');selectLevel(level);await startTaalworp('SET_A2_BASIS');
   twDiceState.CONNECT_1={active:true,locked:true,value:structuredClone(tw.manifest.diceFamilies.CONNECT_1.values[1])};
   twDiceState.CONNECT_2={active:true,locked:false,value:structuredClone(tw.manifest.diceFamilies.CONNECT_2.values[1])};
   APP.taalworpBothLinks=true;APP.taalworpDice=twDiceState;delete APP.routeArchitectureVersion;delete APP.taalworpLegacySnapshot;save();
   return {dice:structuredClone(twDiceState),verb:APP.currentVerb,sets:APP.taalworpSets,level:APP.level};
  },level);
  await page.reload();await page.locator('#resumeBtn').click();
  assert.deepEqual(await page.evaluate(()=>({dice:twDiceState,verb:APP.currentVerb,sets:APP.taalworpSets,level:APP.level})),before);
  assert.deepEqual(await page.evaluate(()=>APP.taalworpLegacySnapshot.dice),before.dice);
  assert.equal(await page.locator('#levelSelect').inputValue(),level==='C2'?'B2_C1':'A1_A2');
  assert.ok(!(await page.locator('.card-activity-heading').innerText()).includes('C2'));
  await page.evaluate(()=>{startCards('conversation');save()});
  const card=await page.evaluate(()=>{delete APP.routeCardMigration;save();return currentCard().id});
  await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.evaluate(()=>currentCard().id),card);
 }
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('taalroute-route-v1.1-backup')).values));
 await page.addInitScript(()=>{window.DigiBordArchiveReview=false});await page.reload();
 await page.locator('[data-main="practice"]').click();
 await page.evaluate(()=>ContentUI.setState({family:'grammar',topic:'ER',level:'A2_B1',engine:'CARDS'}));
 const values=await page.locator('[name=level]').evaluateAll(es=>es.map(e=>e.value));assert.ok(values.length);assert.ok(values.every(id=>ids.includes(id)));
 await page.locator('#practiceStart').click();
 assert.equal(await page.locator('#levelSelect').innerText(),'A2 → B1');
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});await page.locator('[data-main="practice"]').click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'routes-'+width+'.png'),fullPage:true})}
 }
 assert.deepEqual(errors,[]);
 console.log('PASS routes browser: six shared routes, 9578 unchanged R25 released items, 30 unresolved hidden, settings/preparation, exact A1+/C2 dice+card resume, backup and desktop/mobile.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
