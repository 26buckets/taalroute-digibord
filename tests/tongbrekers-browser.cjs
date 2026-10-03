const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  const NativeAudio=window.Audio;window.NativeAudio=NativeAudio;window.spoken=[];window.cancelled=0;window.audioFailed=false;
  window.Audio=function(src){
   if(!String(src).startsWith('assets/audio/tongbrekers/'))return new NativeAudio(src);
   this.src=src;this.currentTime=0;this.pause=()=>{window.cancelled++};
   this.play=()=>{window.spoken.push(src);return window.audioFailed?Promise.reject(new Error('test load failure')):Promise.resolve()};
  };
 });
 try{
  await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto('file://'+path.join(served,'index.html'));
  await page.locator('[data-main="play"]').click();await page.locator('[data-category="cards"]').click();await page.locator('[data-ctype="tongue"]').click();
  await page.locator('#levelSelect').selectOption('B2_C1');
  assert.equal(await page.locator('.card-activity-heading h1 span').innerText(),'240 kaarten');
  assert.equal(await page.locator('#cardHelp,#cardGoals,#cardPartner,#cardSetInfo,#cardSupport,#cardAttempt,[data-ghelp],[data-grules]').count(),0);
  await page.locator('#levelSelect').selectOption('A1_A2');assert.equal(await page.locator('.card-counter').innerText(),(await page.evaluate(()=>APP.cardShuffles.tongue.position))+' van 120');await page.locator('#levelSelect').selectOption('A2_B1');assert.equal(await page.locator('.card-counter').innerText(),(await page.evaluate(()=>APP.cardShuffles.tongue.position))+' van 180');await page.locator('#levelSelect').selectOption('B2_C1');
  await page.evaluate(()=>{selectShuffledCard('tongue',cardsFor('tongue'),'reset');startTongue()});const cycleStart=await page.evaluate(()=>APP.cardShuffles.tongue.cycle);
  assert.ok(await page.locator('#tongueRead').isVisible());assert.ok(await page.locator('#tongueRead').isDisabled());
  assert.match(await page.locator('#tongueRead').innerText(),/tijdelijk uit/);
  assert.equal(await page.locator('#tongueRead').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(237, 240, 243)');
  await page.locator('#tongueRead').evaluate(e=>e.click());
  await page.evaluate(()=>readTongue(currentCard(),document.querySelector('#tongueRead')));
  assert.deepEqual(await page.evaluate(()=>window.spoken),[]);
  const seen=new Set();
  for(let i=0;i<240;i++){seen.add(await page.locator('.tongue-content').getAttribute('data-card-id'));await page.locator('#primaryGame').click()}
  assert.equal(seen.size,240);const nextCycle=await page.locator('.tongue-text').innerText();assert.equal(await page.evaluate(()=>APP.cardShuffles.tongue.cycle),cycleStart+1);
  await page.locator('#primaryGame').click();await page.locator('#undoAction').click();assert.equal(await page.locator('.tongue-text').innerText(),nextCycle);
  for(const level of ['A0_A1','A1_A2','A2_B1','B1_B2','B2_C1'])for(const difficulty of ['','easy','medium','hard']){
   await page.locator('#levelSelect').selectOption(level);await page.locator('#tongueDifficulty').selectOption(difficulty);
   assert.equal(await page.locator('#levelSelect').inputValue(),level);
   const expected=await page.evaluate(()=>cardsFor('tongue').length);
   assert.equal(await page.locator('.card-counter').innerText(),expected?(await page.evaluate(()=>APP.cardShuffles.tongue.position))+' van '+expected:'0 kaarten');
   assert.equal(await page.locator('#primaryGame').isDisabled(),!expected);
   assert.equal(await page.locator('#tongueRead').isDisabled(),true);
   if(!expected)assert.equal(await page.locator('.tongue-text').innerText(),'Geen tongbrekers bij deze filters.');
  }
  await page.locator('#tongueDifficulty').selectOption('');await page.locator('#levelSelect').selectOption('A0_A1');assert.ok(await page.evaluate(()=>cardsFor('tongue').some(c=>c.id===currentCard().id)));const retainedTongue=await page.locator('.tongue-text').innerText();
  await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('.tongue-text').innerText(),retainedTongue);
  await page.locator('#levelSelect').selectOption('B2_C1');
  const states=await page.evaluate(()=>JSON.stringify(APP.boardStates));
  for(const kind of ['mission','conversation','verbs','spelling','puzzles','idioms','story']){
   await page.locator('[data-ctype="'+kind+'"]').click();assert.equal(await page.locator('#cardHelp').count(),1);assert.equal(await page.locator('#levelSelect').getAttribute('data-routes'),'false');
   await page.locator('#primaryGame').click();assert.ok(await page.locator('#cardAttempt').isVisible());
  }
  await page.locator('[data-ctype="tongue"]').click();assert.equal(await page.locator('#levelSelect').inputValue(),'B2_C1');
  await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsOverlay').classList.contains('open'));assert.ok(await page.locator('#settingsOverlay').evaluate(e=>e.classList.contains('open')));
  await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();await page.waitForFunction(()=>!document.querySelector('#settingsOverlay').classList.contains('open'));assert.equal(await page.locator('#settingsOverlay').evaluate(e=>e.classList.contains('open')),false);
  assert.equal(await page.evaluate(()=>JSON.stringify(APP.boardStates)),states);
  // Frozen classroom typography: short windows must not shrink the sentence.
  const longest=await page.evaluate(()=>cardsFor('tongue').reduce((a,b)=>a.text.length>b.text.length?a:b).sourceNumber);
  for(const [width,height,fontSize] of [[1920,1080,88],[1440,900,72],[1440,800,72],[1440,650,72],[1024,768,51.2],[768,1024,38.4],[390,844,36],[320,568,36]]){
   await page.setViewportSize({width,height});
   for(const sourceNumber of [1,181,210,longest]){
    await page.evaluate(n=>{APP.cardIndex=cardsFor('tongue').findIndex(c=>c.sourceNumber===n);APP.cardShuffles={};APP.last={type:'card',data:{kind:'tongue'}};startTongue()},sourceNumber);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${width}`);
    const b=await page.locator('#primaryGame').boundingBox();assert.ok(b.x>=0&&b.x+b.width<=width+1&&b.y+b.height<=height+1,`next clipped ${width}`);
    assert.ok(await page.locator('.tongue-content').evaluate(e=>e.scrollWidth<=e.clientWidth),`text width ${width}`);
    const textStyle=await page.locator('.tongue-text').evaluate(e=>{const s=getComputedStyle(e);return {size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),weight:s.fontWeight}});
    assert.ok(Math.abs(textStyle.size-fontSize)<.1,`frozen tongue font ${width}x${height}: ${textStyle.size}`);
    assert.ok(Math.abs(textStyle.line/textStyle.size-1.25)<.01,`tongue line spacing ${width}x${height}`);assert.equal(textStyle.weight,'700');
    await page.locator('#tongueRead').scrollIntoViewIfNeeded();assert.ok(await page.locator('#tongueRead').isVisible());
    if(process.env.SCREENSHOT_DIR&&[1440,390].includes(width)&&sourceNumber===210){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'tongbrekers-'+width+'.png')})}
   }
  }
  await page.setViewportSize({width:1440,height:900});await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.locator('#fullscreenBtn').click();
  await page.locator('[data-main="play"]').click();assert.equal(await page.locator('#levelSelect').getAttribute('data-tongue'),'false');
  await page.evaluate(()=>openCabinetSet('cards','tongue'));assert.equal(await page.locator('.detail-text-cards article').count(),240);assert.equal(await page.locator('.detail-text-cards').innerText().then(t=>t.includes('Mila maakt soep.')),false);
  await page.locator('#startCabinetActivity').click();assert.ok(await page.locator('.tongue-table').isVisible());
  assert.deepEqual(await page.evaluate(()=>window.spoken),[],'No tongue audio played through any route');
  assert.deepEqual(errors,[]);console.log('PASS: real navigation, 240-card cycle, undo, 28 filter combinations, empty states, retained audio with playback disabled across all routes, reload, all seven other games, Style Control, unchanged board state, frozen large typography at eight viewports including short windows and longest text, fullscreen and cabinet.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
