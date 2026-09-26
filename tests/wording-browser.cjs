const assert=require('node:assert/strict'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.addInitScript(()=>{window.DigiBordArchiveReview=true});
  await page.goto('file://'+path.join(served,'index.html'));
  const audit=await page.evaluate(()=>{
   const affected=ContentRuntime.items().filter(i=>/\bbuur\b/i.test(JSON.stringify(i))),bad=[];
   for(const i of affected){const html=contentTaskText(i)+contentAnswerText(i,ContentRuntime.answerPolicy(i));const el=document.createElement('div');el.innerHTML=html;if(/\bbuur\b/i.test(el.textContent))bad.push(i.content_item_id)}
   return {count:affected.length,bad};
  });assert.ok(audit.count>0);assert.deepEqual(audit.bad,[]);
  // Retain the actual old lesson reference; only its displayed wording changes.
  const source=require('../data/snelvragen-content.js'),runtime=require('../content-runtime.js').createContentRuntime(source),item=source.items.find(i=>i.content_item_id==='sq-r2-circle-003');assert.match(JSON.stringify(item),/\bbuur\b/i);
  for(const engine of ['CARDS','BOARD','WHEEL']){
   const s=structuredClone(runtime.createSession({filters:{topics:[item.topic],levels:[item.cefr_level]},targetDurationSeconds:60,selectedGameEngine:engine,seed:51}));s.selected_item_ids=[item.content_item_id];s.selected_content_refs=[runtime.contentRef(item)];s.actual_estimated_duration_seconds=item.estimated_duration_seconds;
   await page.evaluate(s=>{ContentUI.clearEditing();APP.fixedRoll=1;settingsPatch({reducedMotion:true});ContentUI.launch(ContentRuntime.restoreSession(s))},s);
   if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'))}
   if(engine==='WHEEL'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled)}
   const selector=engine==='BOARD'?'#taskDrawer.open':engine==='CARDS'?'.content-reading[data-content-item-id]':'.na-wheel-result';
   let text=await page.locator(selector).innerText();assert.ok(!/\bbuur\b/i.test(text));assert.match(text,/buurman/i);
   await page.locator(engine==='BOARD'?'#contentBoardAnswer':engine==='CARDS'?'#contentCardReveal':'.na-wheel-result summary').click();assert.ok(!/\bbuur\b/i.test(await page.locator(engine==='BOARD'?'#gameDialog':selector).innerText()));if(engine==='BOARD')await page.keyboard.press('Escape');
   await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.locator(selector).waitFor({state:'visible'});
   text=await page.locator(selector).innerText();assert.ok(!/\bbuur\b/i.test(text));assert.match(text,/buurman/i);
   assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_content_refs),s.selected_content_refs);
  }
  await page.evaluate(()=>{ContentUI.clearEditing();APP.level='C2';APP.cardKind='tongue';startTongue();APP.cardIndex=cardsFor('tongue').findIndex(c=>c.id==='TR-TONGUE-D240-A2-018');startTongue()});
  assert.equal(await page.locator('.tongue-text').innerText(),'De buurman brengt bruine borden naar boven.');
  const style=await page.locator('.tongue-text').evaluate(e=>({font:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,weight:getComputedStyle(e).fontWeight}));assert.deepEqual(style,{font:'72px',line:'90px',weight:'700'});
  assert.ok(await page.locator('#tongueRead').isDisabled());assert.match(await page.evaluate(()=>AppWording.audio(currentCard())),/woordkeuze\.mp3$/);assert.equal(await page.evaluate(()=>tongueAudio),null);
  await page.evaluate(()=>openCabinetSet('cards','tongue'));assert.ok(!/\bbuur\b/i.test(await page.locator('.detail-text-cards').innerText()));
  await page.goto('file://'+path.join(served,'settings/index.html'));assert.equal(await page.evaluate(()=>AppWording.text('Buur')),'Buurman');assert.ok(!/\bbuur\b/i.test(await page.locator('body').innerText()));
  assert.deepEqual(errors,[]);console.log('PASS wording: '+audit.count+' affected current tasks; historical card/board/wheel including examples and reload, unchanged saved references, tongue text/audio and frozen 72px type, cabinet and settings.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
