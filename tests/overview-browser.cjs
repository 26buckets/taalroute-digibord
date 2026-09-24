const controls=require('./practice-controls.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser,page;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'chrome'});page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();await page.locator('.practice-inventory>summary').click();
 assert.ok((await page.locator('#inventoryCount').innerText()).endsWith('8.414 opdrachten'));
 const entries=await page.locator('[data-inventory-topic]').evaluateAll(es=>es.map(e=>({family:e.dataset.inventoryFamily,topic:e.dataset.inventoryTopic,level:e.dataset.inventoryLevel})));
 assert.equal(new Set(entries.map(e=>e.family)).size,7);
 assert.equal(await page.locator('.inventory-family[open]').count(),0);
 assert.equal(entries.some(e=>['MODAAL','MODAAL_ALLES'].includes(e.topic)),false,'Mixes do not duplicate the inventory');
 await page.locator('.inventory-family>summary').nth(0).click();await page.locator('.inventory-family>summary').nth(1).click();assert.equal(await page.locator('.inventory-family[open]').count(),1);
 await page.locator('#inventoryLevel').selectOption('B2');assert.equal(await page.locator('#inventoryCount').innerText(),'Beschikbaar bij B2: 1.242 opdrachten');assert.equal(await page.locator('.inventory-family[open]').count(),0);await page.locator('#inventoryReset').click();
 // Every displayed topic/level opens usable preparation; selection never silently falls back.
 const empty=[];for(const entry of entries){
  if(!await page.locator('.practice-inventory').evaluate(e=>e.open))await page.locator('.practice-inventory>summary').click();await page.locator('[data-inventory-topic]').first().waitFor({state:'attached'});
  await page.evaluate(({family,topic,level})=>document.querySelector(`[data-inventory-family="${family}"][data-inventory-topic="${topic}"][data-inventory-level="${level}"]`).click(),entry);
  const result=await page.evaluate(()=>({state:ContentUI.state(),error:ContentUI.scopeError(),count:ContentUI.previewItems().length,levels:[...new Set(ContentUI.previewItems().map(i=>i.cefr_level))],availability:ContentUI.availability()}));
  assert.equal(result.error,'',JSON.stringify(entry));assert.equal(result.state.topic,entry.topic);if(!result.count)empty.push({entry,state:result.state,availability:result.availability});else assert.deepEqual(result.levels,[entry.level]);
 }
 assert.deepEqual(empty,[]);await page.locator('.practice-inventory>summary').click();await page.locator('#inventorySearch').fill('relatieve');await page.locator('#inventoryLevel').selectOption('A2');assert.equal(await page.locator('[data-inventory-topic]').count(),0);assert.ok((await page.locator('#inventoryResults').innerText()).includes('Geen aangesloten inhoud'));
 await page.locator('#inventoryLevel').selectOption('B1');assert.ok(await page.locator('[data-inventory-topic]').count()>0);
 assert.equal(await page.locator('.inventory-family[open]').count(),0);await page.locator('.inventory-family>summary').first().click();
 for(const width of [390,1024,1920]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('.inventory-pick').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)));}
 await page.setViewportSize({width:1440,height:1000});const dir=path.join(root,'tests/artifacts/overview');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,'zoeken.png')});
 await page.locator('[data-inventory-family=grammar]').first().click();await controls.game(page,'.practice-engine:has(input[value=CARDS])');assert.equal(await page.locator('#practiceStart').isEnabled(),true);
 await page.locator('#practiceSave').click();assert.ok(!(await page.locator('#lessonName').inputValue()).includes('B1'));await page.locator('#lessonName').fill('Mijn testles');await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 await page.locator('[data-main=lessons]').click();await page.locator('[data-lesson-action=start]').waitFor();assert.ok(await page.locator('#levelSelect').isHidden());assert.equal(await page.locator('.lesson-card').first().locator('.practice-level').innerText(),'B1');
 await page.locator('#lessonSearch').fill('relatieve');await page.locator('#lessonSearch').press('Tab');await page.waitForFunction(()=>document.querySelector('[data-lesson-action=start]'));assert.equal(await page.locator('[data-lesson-action=start]').count(),1,'Search on subject, not only lesson name');
 await page.locator('[data-lesson-action=start]').click();await page.locator('#screen-game .content-reading[data-content-item-id]').waitFor({state:'visible'});await page.locator('#primaryGame').click();await page.evaluate(()=>LessonUI.flush());
 const progress=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,index:APP.cardIndex}));await page.reload();await page.locator('[data-main=lessons]').click();await page.locator('[data-lesson-action=resume]').waitFor();await page.locator('[data-lesson-action=resume]').first().click();await page.locator('#screen-game .content-reading[data-content-item-id]').waitFor({state:'visible'});assert.deepEqual(await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,index:APP.cardIndex})),progress);
 await page.locator('[data-main=lessons]').click();await page.locator('[data-lesson-action=resume]').waitFor();await page.screenshot({path:path.join(dir,'mijn-lessen.png')});
 await page.locator('[data-main=practice]').click();await page.locator('.practice-inventory>summary').click();await page.locator('#inventoryReset').click();assert.ok((await page.locator('#inventoryCount').innerText()).endsWith('8.414 opdrachten'));
 await page.locator('#inventoryLevel').selectOption('C2');assert.equal(await page.locator('[data-inventory-topic]').count(),0);await page.locator('#inventoryReset').click();await page.locator('#inventorySearch').fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('#inventoryResults img').count(),0);await page.locator('#inventoryReset').click();
 await page.locator('#inventorySearch').fill('Vertel');await page.locator('#inventoryLevel').selectOption('B2');await page.locator('.inventory-family>summary').click();await page.locator('[data-inventory-topic=quick-tell]').click();await page.locator('.practice-preview>summary').click();assert.equal(await page.locator('.practice-preview .content-reading>details>summary').innerText(),'Bespreek samen');
 // Niveau eerst keeps the chosen level while the teacher changes topics.
 await page.evaluate(()=>{settingsPatch({practiceLayout:'level'});ContentUI.applyLayout()});
 await controls.level(page,'A1');assert.equal(await page.evaluate(()=>ContentUI.state().level),'A1');assert.ok((await page.evaluate(()=>ContentUI.previewItems())).every(i=>i.cefr_level==='A1'));
 assert.equal(await page.locator('[data-choose-topic=RELATIEVE_BIJZIN]').count(),0);
 await controls.level(page,'B1');await controls.topic(page,'ER');assert.equal(await page.evaluate(()=>ContentUI.state().topic),'ER');assert.ok(await page.locator('[name=subtopic]').count());
 await controls.openStep(page,'level');assert.equal(await page.locator('[name=level][value=C2]').count(),0,'Unavailable levels stay in the inventory, not in the choices');
 for(const level of await page.locator('[name=level]').evaluateAll(inputs=>inputs.map(i=>i.value))){
  await controls.level(page,level);
  const topics=await page.locator('[data-choose-topic]').evaluateAll(buttons=>buttons.map(b=>b.dataset.chooseTopic));
  for(const id of topics){await controls.topic(page,id);assert.equal(await page.evaluate(()=>ContentUI.state().level),level);assert.equal(await page.evaluate(()=>ContentUI.scopeError()),'');assert.ok(await page.evaluate(()=>ContentUI.availability().source_count>0),JSON.stringify({id,level,state:await page.evaluate(()=>ContentUI.state())}))}
 }
 assert.deepEqual(errors,[]);console.log(`PASS overview: all ${entries.length} topic/level links, unique total, search, unavailable C2, relative clauses B1+, labels, touch widths, choose/prepare/play/save/reload/resume, no missing-model preview or browser errors.`);
})().catch(async e=>{console.error(e);if(page)await page.screenshot({path:path.join(root,'tests/artifacts/overview-failure.png')});process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(r=>server.close(r))});
