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
 await page.locator('[name=topic]').selectOption('RELATIEVE_BIJZIN');await page.locator('[name=level]').selectOption('B1');await page.locator('.practice-engine:has(input[value=CARDS])').click();
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource({bank_ids:['CB-GRAM-002']}).length),600);
 assert.equal(await page.locator('.practice-engine input[value=DICE]').count(),0);
 assert.deepEqual(await page.locator('[name=level] option').evaluateAll(es=>es.map(e=>e.value)),['B1','B2']);
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource({topics:['RELATIEVE_BIJZIN'],levels:['A2']}).length),0);
 const prepared=await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id));assert.ok(prepared.length>1);
 await page.locator('#practiceForm [data-guidance=erk]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B1');await page.keyboard.press('Escape');
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-practice-engine=BOARD]:not([data-practice-variant])').click();assert.deepEqual(await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id)),prepared);
 await page.locator('.practice-engine:has(input[value=CARDS])').click();
 for(const width of [320,390,768,1440,1920]){await page.setViewportSize({width,height:1000});assert.ok(await page.locator('#contentPracticeApp').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Preparation overflow '+width);}
 await page.setViewportSize({width:1440,height:1000});const dir=path.join(root,'tests/artifacts/relative');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,'preparation.png')});
 await page.locator('#practiceSave').click();await page.locator('#lessonName').fill('Relatieve bijzin oefenen');await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 await page.locator('#practiceStart').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),prepared);await page.locator('#primaryGame').click();await page.evaluate(()=>LessonUI.flush());
 await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),prepared);assert.equal(await page.evaluate(()=>APP.cardIndex),1);
 await page.locator('[data-ghelp]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B1');await page.keyboard.press('Escape');
 await page.evaluate(()=>{ContentUI.clearEditing();const filters={bank_ids:['CB-GRAM-002']},pool=ContentRuntime.filterSource(filters);ContentUI.launch(ContentRuntime.createSession({filters,targetDurationSeconds:pool.reduce((n,i)=>n+i.estimated_duration_seconds,0),selectedGameEngine:'CARDS'}));settingsPatch({reducedMotion:true})});
 const seen=new Set();for(let n=0;n<600;n++){
  const id=await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id');assert.ok(!seen.has(id),'Repeated '+id);seen.add(id);
  const item=await page.evaluate(id=>ContentRuntime.itemById(id),id);
  const prompt=await page.evaluate(id=>ContentRuntime.displayPrompt(ContentRuntime.itemById(id)),id);
  assert.ok((await page.locator('.content-prompt').textContent()).includes(prompt),id);assert.equal(await page.locator('.content-prompt li').count(),item.options.length);
  await page.locator('#contentCardReveal').click();assert.ok((await page.locator('#contentCardAnswer').textContent()).includes(item.model_answer));
  if(n===20)await page.screenshot({path:path.join(dir,'card.png')});
  await page.locator('#primaryGame').click();await page.waitForFunction(previous=>document.querySelector('[data-content-item-id]')?.dataset.contentItemId!==previous,id);
 }
 assert.equal(seen.size,600);
 for(const engine of ['BOARD','WHEEL','QUIZ','SEQUENCE']){
  await page.evaluate(engine=>{const filters={bank_ids:['CB-GRAM-002'],levels:['B2'],exercise_types:engine==='SEQUENCE'?['zinnen_leggen']:[]};APP.fixedRoll=1;ContentUI.launch(ContentRuntime.createSession({filters,targetDurationSeconds:300,selectedGameEngine:engine,organizationMode:'groups',seed:11}))},engine);
  await page.locator('[data-ghelp]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B2');await page.keyboard.press('Escape');
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));assert.match(await page.locator('#taskDrawer').getAttribute('data-task-id'),/^REL_/);}
  if(engine==='WHEEL'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);assert.match(await page.locator('.na-wheel-result [data-content-item-id]').getAttribute('data-content-item-id'),/^REL_/);await page.screenshot({path:path.join(dir,'wheel.png')});}
  if(engine==='QUIZ')assert.ok(await page.locator('.na-quiz-board [data-content-item-id]').count());
  if(engine==='SEQUENCE'){const count=await page.locator('.na-step-bank [data-na=step]').count();assert.equal(count,3);for(let n=0;n<count;n++)await page.locator(`[data-na=step][data-value="${n}"]`).click();await page.locator('#primaryGame').click();await page.waitForFunction(()=>/De volgorde klopt!/.test(document.querySelector('#na-feedback')?.textContent||''));}
 }
 assert.deepEqual(errors,[]);console.log('PASS PB002 browser: all 600 cards, five screen sizes, actual lesson, both routes, save/reload, four other engines, guidance and source IDs.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
