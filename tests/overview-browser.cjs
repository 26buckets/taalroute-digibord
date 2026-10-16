const assert=require('node:assert/strict'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.LIVE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
  await page.locator('[data-main=practice]').click();await page.locator('.practice-inventory>summary').click();
  assert.ok((await page.locator('#inventoryCount').innerText()).endsWith('11.338 opdrachten'),'current E1 release inventory, not the pre-E1 8,414 snapshot');
  assert.equal(await page.locator('.inventory-family[open]').count(),0);
  const entries=await page.locator('[data-inventory-topic]').evaluateAll(es=>[...new Map(es.map(e=>[e.dataset.inventoryFamily+'|'+e.dataset.inventoryTopic+'|'+e.dataset.inventoryLevel,{family:e.dataset.inventoryFamily,topic:e.dataset.inventoryTopic,level:e.dataset.inventoryLevel}])).values()]);
  assert.ok(entries.length);assert.equal(entries.some(e=>['grammar','words'].includes(e.family)),false,'one teacher family');
  assert.equal(entries.some(e=>['MODAAL','MODAAL_ALLES'].includes(e.topic)),false);
  await page.locator('.inventory-family>summary').nth(0).click();await page.locator('.inventory-family>summary').nth(1).click();assert.equal(await page.locator('.inventory-family[open]').count(),1);
  const levelCount=await page.evaluate(()=>ContentRuntime.availableForPreparation().filter(i=>DigiRoutes.classification(i).displayRoute==='A1_A2').length);
  await page.selectOption('#inventoryLevel','A1_A2');assert.ok((await page.locator('#inventoryCount').innerText()).endsWith(levelCount.toLocaleString('nl-NL')+' opdrachten'));
  assert.equal(await page.locator('.inventory-family[open]').count(),0);await page.locator('#inventoryReset').click();
  // Every listed subject/level opens the exact selection, including guided-only groups.
  for(const entry of entries){
   if(!await page.locator('.practice-inventory').evaluate(e=>e.open))await page.locator('.practice-inventory>summary').click();
   await page.evaluate(e=>document.querySelector(`[data-inventory-family="${e.family}"][data-inventory-topic="${e.topic}"][data-inventory-level="${e.level}"]`).click(),entry);
   if(!await page.evaluate(()=>ContentUI.availability().source_count)){
    const micro=await page.locator('[name=microconstructure] option').evaluateAll(es=>es.find(e=>e.value)?.value);assert.ok(micro,JSON.stringify(entry));await page.selectOption('[name=microconstructure]',micro);
   }
   const state=await page.evaluate(()=>({state:ContentUI.state(),error:ContentUI.scopeError(),ids:ContentUI.previewItems().map(i=>i.content_item_id),levels:[...new Set(ContentUI.previewItems().map(i=>DigiRoutes.classification(i).displayRoute))]}));
   assert.equal(state.error,'',JSON.stringify(entry));assert.equal(state.state.topic,entry.topic);assert.ok(state.ids.length,JSON.stringify(entry));assert.deepEqual(state.levels,[entry.level]);
  }
  await page.locator('.practice-inventory>summary').click();await page.locator('#inventorySearch').fill('die dat');
  assert.ok(await page.locator('[data-inventory-topic=g-relatieve-zinnen]').count());
  assert.equal(await page.locator('.inventory-family[open]').count(),0,'search is direct, no hidden source family');
  await page.locator('#inventorySearch').fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('#inventoryResults img').count(),0);assert.match(await page.locator('#inventoryResults').innerText(),/Geen aangesloten inhoud/);
  await page.locator('#inventoryReset').click();await page.locator('#inventorySearch').fill('inversie');
  for(const width of [320,390,1024,1920]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.ok(await page.locator('.inventory-pick').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)));}
  await page.locator('[data-inventory-topic=g-inversie][data-inventory-level=A1_A2]').click();
  await page.locator('.practice-engine:has(input[value=CARDS])').click();assert.ok(await page.locator('#practiceStart').isEnabled());
  await page.locator('#practiceSave').click();await page.locator('#lessonName').fill('Mijn testles');await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
  await page.locator('[data-main=lessons]').click();await page.locator('[data-lesson-action=start]').waitFor();
  await page.locator('#lessonSearch').fill('inversie');await page.locator('#lessonSearch').press('Tab');await page.waitForFunction(()=>document.querySelector('[data-lesson-action=start]'));assert.equal(await page.locator('[data-lesson-action=start]').count(),1);
  await page.locator('[data-lesson-action=start]').click();await page.waitForSelector('#screen-game.active .content-reading');await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy);
  const saved=await page.evaluate(async()=>{await LessonUI.flush();return {session:APP.contentSessionConfig,index:APP.cardIndex}});await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex})),saved);
  assert.deepEqual(errors,[]);console.log(`PASS overview: all 11338 E1 IDs, ${entries.length} subject/level choices, guided-only reachability, unique counts, shared synonym search, safe markup, save/search/resume and 320–1920px.`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
