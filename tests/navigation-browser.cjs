const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 await page.locator('#levelSelect').selectOption('A2_B1');
 const choose=async(id)=>{const pick=page.locator(`[data-choose-topic="${id}"]`).first();await pick.evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true});await pick.click()};
 await page.locator('[data-category=cards]').click();await page.locator('[data-card-family=quick]').click();
 assert.equal(await page.locator('#screen-practice h1').innerText(),'Snelvragen');
 assert.equal(await page.evaluate(()=>ContentUI.state().level),'A2_B1');
 assert.equal(await page.locator('[data-practice-step=game]').count(),0);
 assert.equal(await page.locator('[data-choose-topic]').count(),4);
 await choose('vertel');assert.ok(await page.locator('#practiceStart').isEnabled());
 assert.equal(await page.locator('#practiceStart').innerText(),'Start kaartspel');
 assert.ok(await page.locator('[data-main=play]').evaluate(e=>e.classList.contains('active')));
 assert.ok(!await page.locator('[name=duration]').isVisible(),'time is optional');
 assert.ok(!await page.locator('.practice-librarybar').isVisible(),'unrelated inventory stays out of a fixed game entry');
 await page.locator('#practiceStart').click();await page.locator('#screen-game.active').waitFor();
 const session=await page.evaluate(()=>({session:APP.contentSessionConfig,groups:APP.groups}));
 assert.deepEqual(session.session.display_routes,['A2_B1']);
 await page.locator('#contentCardMenu').click();await page.locator('[data-card-family=grammar-guide]').click();
 assert.equal(await page.locator('.grammar-category').count(),9);assert.equal(await page.locator('[data-practice-step=game]').count(),0);
 await choose('g-zullen');assert.equal(await page.evaluate(()=>ContentUI.state().level),'A2_B1');
 assert.ok(await page.locator('#practiceStart').isEnabled());
 assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,groups:APP.groups})),session,'browsing preserves active lesson');
 // An unavailable level must not silently change when choosing a topic.
 await page.locator('[data-practice-step=topic]>summary').click();await choose('g-hoofdzin');
 assert.equal(await page.evaluate(()=>ContentUI.state().level),'A2_B1');
 // The level picker always displays the selected route even if unavailable.
 assert.ok(await page.locator('.practice-breadcrumb').innerText().then(t=>t.includes('A2 → B1')));
 await page.locator('#screen-practice .practice-head button').click();await page.locator('#screen-cards.active').waitFor();
 await page.locator('[data-main=play]').click();await page.locator('[data-category=boards]').click();await page.locator('#screen-boards [data-board=rotterdam]').click();
 assert.equal(await page.locator('#screen-practice h1').innerText(),'Rotterdam');
 assert.equal(await page.evaluate(()=>ContentUI.state().level),'A2_B1');assert.equal(await page.evaluate(()=>ContentUI.state().engine),'BOARD');
 await page.locator('#screen-practice .practice-head button').click();await page.locator('#screen-boards.active').waitFor();
 await page.locator('[data-main=play]').click();await page.locator('[data-category=dice]').click();await page.locator('[data-dice-preparation]').click();
 assert.equal(await page.locator('#screen-practice h1').innerText(),'Dobbelen met opdrachten');
 assert.equal(await page.evaluate(()=>ContentUI.state().level),'A2_B1');assert.equal(await page.evaluate(()=>ContentUI.state().engine),'DICE');
 assert.ok(await page.locator('#practiceStart').isEnabled(),'compatible content is chosen for the requested dice game');
 assert.equal(await page.locator('[data-choose-family=quick]').count(),0,'incompatible quick prompts not offered');
 await page.locator('#screen-practice .practice-head button').click();await page.locator('#screen-dice.active').waitFor();
 await page.locator('[data-main=play]').click();await page.locator('[data-category=words]').click();
 assert.equal(await page.evaluate(()=>ContentUI.state().engine),'CARDS','a previous dice game does not leak into grammar');
 assert.equal(await page.locator('.grammar-category').count(),9);assert.equal(await page.locator('[data-practice-step=game]').count(),1,'general catalog retains exercise forms');
 // Fixed-entry filters survive returning through the parent menu.
 await page.locator('#screen-practice .practice-head button').click();await page.locator('[data-category=cards]').click();await page.locator('[data-card-family=quick]').click();
 await page.locator('[name=subtopic]').selectOption({index:1});const draft=await page.evaluate(()=>ContentUI.state());
 await page.locator('#screen-practice .practice-head button').click();await page.locator('[data-card-family=quick]').click();
 assert.equal(await page.evaluate(()=>ContentUI.state().subtopic),draft.subtopic);
 await page.locator('[data-main=play]').click();await page.locator('[data-category=words]').click();
 // An explicit level choice follows the teacher back into the main menu.
 await choose('g-zullen');
 await page.locator('.practice-choice:has(input[name=level][value=B1_B2])').click();
 await page.locator('#screen-practice .practice-head button').click();
 assert.equal(await page.locator('#levelSelect').inputValue(),'B1_B2');
 await page.locator('[data-main=practice]').click();assert.equal(await page.locator('#screen-practice h1').innerText(),'Les samenstellen');
 assert.equal(await page.locator('[data-practice-step=game]').count(),1);
 assert.equal(await page.locator('[data-main=mycollection]').innerText(),'Voortgang en groepen');
 // The separate mobile preparation shortcut inherits the same selected route.
 await page.setViewportSize({width:390,height:1000});await page.locator('[data-main=play]').click();
 await page.locator('[data-practice-open]').click();assert.equal(await page.evaluate(()=>ContentUI.state().level),'B1_B2');
 // No source or active session rewrite; exactly resume the earlier cards after reload.
 await page.reload();await page.locator('#resumeBtn').click();
 assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,groups:APP.groups})),session);
 const out=process.env.EVIDENCE_DIR||path.join(__dirname,'artifacts/navigation');fs.mkdirSync(out,{recursive:true});
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:1000});await page.locator('[data-main=play]').click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'home width '+width);
  for(const key of ['play','practice','lessons','mycollection'])assert.ok(await page.locator(`[data-main=${key}]`).isVisible());
  await page.locator('[data-category=cards]').click();await page.locator('[data-card-family=quick]').click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'cards width '+width);
  assert.ok(await page.locator('.practice-topic-row>span:first-child').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().width>=100)),'readable subject labels '+width);
  if([320,390,1440].includes(width))await page.screenshot({path:path.join(out,'snelvragen-'+width+'.png'),fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS navigation: fixed game routes, shared nine-category catalog, stable level, parent back buttons, compatible dice, active lesson preservation, exact reload/resume, desktop and mobile.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
