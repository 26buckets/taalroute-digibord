const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();
 await page.locator('[name=family]').selectOption('conversation');
 assert.deepEqual(await page.locator('[name=level] option').allTextContents(),['B1','B2','C1']);
 await page.locator('[name=topic]').selectOption('gesprek-repareren');assert.deepEqual(await page.locator('[name=level] option:not([disabled])').allTextContents(),['B1','B2']);await page.locator('[name=level]').selectOption('B2');
 await page.locator('.practice-engine:has(input[value=CARDS])').click();
 const prepared=await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id));assert.ok(prepared.length>=7);
 assert.equal(await page.locator('.practice-count strong').textContent(),String(prepared.length));
 assert.equal(await page.locator('.practice-engine input[value=DICE]').count(),0);
 await page.locator('#practiceForm [data-guidance=erk]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B2');assert.equal(await page.locator('.guidance-content details').count(),prepared.length);await page.keyboard.press('Escape');
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-practice-engine=BOARD]:not([data-practice-variant])').click();
 assert.deepEqual(await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id)),prepared,'Both routes retain exactly the prepared lesson');
 await page.locator('.practice-engine:has(input[value=CARDS])').click();
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:1000});assert.ok(await page.locator('#contentPracticeApp').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Preparation overflow '+width);
  assert.ok(await page.locator('#practiceForm [data-guidance]').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44&&e.getBoundingClientRect().width>=44)));
 }
 await page.setViewportSize({width:1440,height:1000});const dir=path.join(root,'tests/artifacts/gesprek-repareren');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,'preparation.png')});
 await page.locator('#practiceSave').click();await page.locator('#lessonName').fill('Misverstanden oplossen');await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 await page.locator('#practiceStart').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),prepared,'Start uses the actual preview IDs');
 await page.locator('[data-ghelp]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B2');assert.equal(await page.locator('.guidance-content details').count(),prepared.length);await page.locator('#gameDialog [data-guidance=bow]').click();assert.ok((await page.locator('.guidance-content').textContent()).includes(prepared.length+' van de '+prepared.length));await page.keyboard.press('Escape');
 await page.locator('#contentCardReveal').click();await page.screenshot({path:path.join(dir,'card.png')});await page.locator('#primaryGame').click();await page.evaluate(()=>LessonUI.flush());
 await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),prepared);assert.equal(await page.evaluate(()=>APP.cardIndex),1);
 await page.locator('[data-ghelp]').click();assert.equal(await page.locator('.guidance-content details').count(),prepared.length);await page.keyboard.press('Escape');
 await page.evaluate(()=>{ContentUI.clearEditing();const filters={bank_ids:['CB-REPAIR-009']};ContentUI.launch(ContentRuntime.createSession({filters,targetDurationSeconds:ContentRuntime.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),selectedGameEngine:'CARDS'}))});
 const seen=new Set();for(let n=0;n<50;n++){
  const id=await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id');assert.ok(!seen.has(id));seen.add(id);
  assert.equal(await page.locator('.content-prompt li').count(),3);const item=await page.evaluate(id=>ContentRuntime.itemById(id),id);assert.ok((await page.locator('.content-situation').textContent()).includes(item.context));
  await page.locator('#contentCardReveal').click();assert.ok((await page.locator('#contentCardAnswer').textContent()).includes(item.model_answer));if(n===30)await page.screenshot({path:path.join(dir,'full-card.png')});
  if((await page.evaluate(id=>ContentRuntime.answerPolicy(ContentRuntime.itemById(id)).modelIsExample,id)))assert.match(await page.locator('#contentCardReveal').textContent(),/mogelijk antwoord/);
  await page.locator('#primaryGame').click();await page.waitForFunction(previous=>document.querySelector('[data-content-item-id]')?.dataset.contentItemId!==previous,id);
 }
 assert.equal(seen.size,50);
 await page.locator('#contentCardReveal').click();
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});await page.locator('#contentCardAnswer section:last-child p').scrollIntoViewIfNeeded();
  assert.ok(await page.locator('.card-work').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'No horizontal overflow');
  assert.ok(await page.locator('#contentCardAnswer section:last-child p').evaluate(e=>{const r=e.getBoundingClientRect(),bar=document.querySelector('#primaryGame').closest('.gamebar').getBoundingClientRect();return r.bottom<=bar.top+1&&r.top>=0}),'Last explanation is reachable');
  await page.screenshot({path:path.join(dir,'explanation-'+width+'.png')});
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const engine of ['BOARD','WHEEL']){
  await page.evaluate(engine=>{APP.fixedRoll=1;settingsPatch({reducedMotion:true});ContentUI.launch(ContentRuntime.createSession({filters:{family_ids:['conversation'],topics:['gesprek-repareren'],levels:['B2']},targetDurationSeconds:600,selectedGameEngine:engine,seed:11}))},engine);
  const gameCount=await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids.length);await page.locator('[data-ghelp]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B2');assert.equal(await page.locator('.guidance-content details').count(),gameCount);await page.keyboard.press('Escape');
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));assert.match(await page.locator('#taskDrawer').getAttribute('data-task-id'),/^C1_GR_/);}
  if(engine==='WHEEL'){
   assert.equal(await page.locator('.na-wheel-legend [data-content-item-id]').count(),6);const spun=new Set();
   for(let n=0;n<12;n++){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);const id=await page.locator('.na-wheel-result [data-content-item-id]').getAttribute('data-content-item-id');spun.add(id);assert.match(id,/^C1_GR_/);}
   assert.equal(spun.size,gameCount,'Wheel reaches every lesson item over successive rounds');assert.ok(await page.locator('.na-wheel-result li').evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).fontSize)>=18)),'Wheel choices readable at board distance');await page.screenshot({path:path.join(dir,'wheel.png')});
   await page.locator('.na-wheel-result details summary').click();
   for(const width of [390,1440]){
    await page.setViewportSize({width,height:1000});const last=page.locator('.na-wheel-result .content-answer p').last();await last.scrollIntoViewIfNeeded();
    assert.ok(await last.evaluate(e=>{const r=e.getBoundingClientRect(),bar=document.querySelector('#primaryGame').closest('.gamebar').getBoundingClientRect();return r.bottom<=bar.top+1&&r.top>=0}),'Wheel explanation remains reachable '+width);
    assert.ok(await page.locator('.na-wheel-result').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Wheel has no horizontal overflow '+width);
    await page.screenshot({path:path.join(dir,'wheel-answer-'+width+'.png')});
   }

  }
 }
 assert.deepEqual(errors,[]);console.log('PASS Misverstanden oplossen browser: 50 cards, actual lesson and counts, both routes, guidance, suitable games, saving, progress/reload, board/wheel and five screen sizes.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
