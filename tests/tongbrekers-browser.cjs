const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.spoken=[];window.cancelled=0;Object.defineProperty(window,'speechSynthesis',{value:{cancel(){window.cancelled++},speak(u){window.spoken.push({text:u.text,lang:u.lang})}}})});
 try{
  await page.goto('file://'+path.join(served,'index.html'));
  await page.locator('[data-main="play"]').click();await page.locator('[data-category="workforms"]').click();await page.locator('.new-workforms [data-cardgame="conversation"]').click();await page.locator('[data-ctype="tongue"]').click();
  await page.locator('#tongueLevel').selectOption('C2');
  assert.equal(await page.locator('.card-activity-heading h1 span').innerText(),'142 kaarten');
  assert.equal(await page.locator('#cardHelp,#cardGoals,#cardPartner,#cardSetInfo,#cardSupport,#cardAttempt,[data-ghelp],[data-grules]').count(),0);
  await page.locator('#tongueLevel').selectOption('A1');assert.equal(await page.locator('.card-counter').innerText(),'1 van 61');await page.locator('#tongueLevel').selectOption('A2');assert.equal(await page.locator('.card-counter').innerText(),'1 van 121');await page.locator('#tongueLevel').selectOption('C2');
  const initial=await page.locator('.tongue-text').innerText();await page.locator('#tongueRead').click();await page.locator('#tongueRead').click();
  assert.deepEqual(await page.evaluate(()=>window.spoken),[{text:initial,lang:'nl-NL'},{text:initial,lang:'nl-NL'}]);
  const seen=new Set();
  for(let i=0;i<142;i++){seen.add(await page.locator('.tongue-content').getAttribute('data-card-id'));await page.locator('#primaryGame').click()}
  assert.equal(seen.size,142);assert.equal(await page.locator('.tongue-text').innerText(),initial);
  await page.locator('#primaryGame').click();await page.locator('#undoAction').click();assert.equal(await page.locator('.tongue-text').innerText(),initial);
  for(const level of ['A0','A1','A2','B1','B2','C1','C2'])for(const difficulty of ['','easy','medium','hard']){
   await page.locator('#tongueLevel').selectOption(level);await page.locator('#tongueDifficulty').selectOption(difficulty);
   assert.equal(await page.locator('#levelSelect').inputValue(),level);
   const expected=await page.evaluate(()=>cardsFor('tongue').length);
   assert.equal(await page.locator('.card-counter').innerText(),expected?'1 van '+expected:'0 kaarten');
   assert.equal(await page.locator('#primaryGame').isDisabled(),!expected);
   assert.equal(await page.locator('#tongueRead').isDisabled(),!expected);
   if(!expected)assert.equal(await page.locator('.tongue-text').innerText(),'Geen tongbrekers bij deze filters.');
  }
  await page.locator('#tongueDifficulty').selectOption('');await page.locator('#levelSelect').selectOption('A0');assert.equal(await page.locator('.tongue-text').innerText(),'Pim pakt papier.');
  await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('.tongue-text').innerText(),'Pim pakt papier.');
  await page.locator('#tongueLevel').selectOption('C2');
  const states=await page.evaluate(()=>JSON.stringify(APP.boardStates));
  for(const kind of ['mission','conversation','verbs','spelling','puzzles','idioms','story']){
   await page.locator('[data-ctype="'+kind+'"]').click();assert.equal(await page.locator('#cardHelp').count(),1);assert.equal(await page.locator('#levelSelect').getAttribute('data-routes'),'true');
   await page.locator('#primaryGame').click();assert.ok(await page.locator('#cardAttempt').isVisible());
  }
  await page.locator('[data-ctype="tongue"]').click();assert.equal(await page.locator('#tongueLevel').inputValue(),'C2');
  await page.locator('#settingsBtn').click();assert.ok(await page.locator('#settingsOverlay').evaluate(e=>e.classList.contains('open')));
  await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();await page.waitForFunction(()=>!document.querySelector('#settingsOverlay').classList.contains('open'));assert.equal(await page.locator('#settingsOverlay').evaluate(e=>e.classList.contains('open')),false);
  assert.equal(await page.evaluate(()=>JSON.stringify(APP.boardStates)),states);
  for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[320,568]]){
   await page.setViewportSize({width,height});
   for(const sourceNumber of [1,39,40,49]){
    await page.evaluate(n=>{APP.cardIndex=cardsFor('tongue').findIndex(c=>c.sourceNumber===n);startTongue()},sourceNumber);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${width}`);
    const b=await page.locator('#primaryGame').boundingBox();assert.ok(b.x>=0&&b.x+b.width<=width+1&&b.y+b.height<=height+1,`next clipped ${width}`);
    assert.ok(await page.locator('.tongue-content').evaluate(e=>e.scrollWidth<=e.clientWidth),`text width ${width}`);
    await page.locator('#tongueRead').scrollIntoViewIfNeeded();assert.ok(await page.locator('#tongueRead').isVisible());
    if(process.env.SCREENSHOT_DIR&&[1440,390].includes(width)&&sourceNumber===39){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'tongbrekers-'+width+'.png')})}
   }
  }
  await page.setViewportSize({width:1440,height:900});await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.locator('#fullscreenBtn').click();
  await page.locator('[data-main="play"]').click();assert.equal(await page.locator('#levelSelect').getAttribute('data-tongue'),'false');
  await page.evaluate(()=>openCabinetSet('cards','tongue'));assert.equal(await page.locator('.detail-text-cards article').count(),142);assert.equal(await page.locator('.detail-text-cards').innerText().then(t=>t.includes('Mila maakt soep.')),false);
  await page.locator('#startCabinetActivity').click();assert.ok(await page.locator('.tongue-table').isVisible());
  assert.deepEqual(errors,[]);console.log('PASS: real navigation, 142-card cycle, undo, 28 filter combinations, empty states, Dutch read/repeat dispatch, reload, all seven other games, Style Control, unchanged board state, six viewports, fullscreen and cabinet.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
