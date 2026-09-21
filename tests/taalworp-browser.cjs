const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.join(served,'index.html'));
  const boards=await page.evaluate(()=>JSON.stringify(APP.boardStates));
  await page.locator('[data-category="dice"]').click();await page.locator('.tile[data-dicegame="taalworp"]').click();
  const selectSets=async(...ids)=>{
   if(await page.locator('#verbSetPicker').getAttribute('open')===null)await page.locator('#verbSetPicker > summary').click();
   for(const group of await page.locator('.verb-set-group').all())if(await group.getAttribute('open')===null)await group.locator('summary').click();
   for(const input of await page.locator('[data-verbset]').all())await input.setChecked(ids.includes(await input.inputValue()));
   await page.locator('#applyVerbSets').click();
  };
  const selected=()=>page.locator('[data-verbset]:checked').evaluateAll(xs=>xs.map(x=>x.value));
  assert.equal(await page.locator('[data-verbset]').count(),23);
  assert.deepEqual(await page.locator('[data-verbgroup] legend').allTextContents(),['Basis','Taalvorm','Thema’s']);
  assert.deepEqual(await page.locator('[data-verbgroup]').evaluateAll(xs=>xs.map(x=>x.querySelectorAll('input').length)),[2,5,16]);
  assert.equal(await page.locator('#verbSetRow').count(),0);
  await selectSets('SET_A2_BASIS','SET_A2_BASIS_UITGEBREID','SET_A2_WERK','SET_A2_SCHEIDBAAR');
  const mix=await page.evaluate(()=>({ids:APP.taalworpSets,pool:currentVerbPool().map(x=>x.id),expected:[...new Set(APP.taalworpSets.flatMap(id=>tw.sets.sets[id].recordIds))]}));
  assert.deepEqual(mix.pool,mix.expected);assert.ok(mix.pool.length<await page.evaluate(()=>APP.taalworpSets.reduce((sum,id)=>sum+tw.sets.sets[id].recordIds.length,0)));
  const dice=await page.evaluate(()=>JSON.stringify(twDiceState));
  await page.locator('#drawVerb').click();assert.equal(await page.evaluate(()=>JSON.stringify(twDiceState)),dice);
  assert.ok(mix.pool.includes(await page.evaluate(()=>APP.currentVerb)));
  await page.locator('#primaryGame').click();const rolled=await page.evaluate(()=>APP.currentVerb);
  await page.locator('#drawVerb').click();await page.locator('#undoAction').click();assert.equal(await page.evaluate(()=>APP.currentVerb),rolled);
  await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual((await selected()).sort(),[...mix.ids].sort());
  await page.locator('#verbSetPicker > summary').click();
  for(const group of await page.locator('.verb-set-group').all())await group.locator('summary').click();
  for(const input of await page.locator('[data-verbset]').all())await input.uncheck();
  assert.equal(await page.locator('#applyVerbSets').isDisabled(),true);
  await selectSets('SET_A2_BASIS');
  // Seed a valid basic verb outside the target grammar set, then use the real controls.
  const held=await page.evaluate(()=>{APP.currentVerb=currentVerbPool().find(v=>!tw.sets.sets.SET_A2_WEDERKEREND.recordIds.includes(v.id)).id;renderVerbCard();return APP.currentVerb});
  await page.locator('#verbLock').click();await page.locator('[data-lock="WHO"]').click();
  const who=await page.evaluate(()=>JSON.stringify(twDiceState.WHO));
  await selectSets('SET_A2_WEDERKEREND');
  assert.equal(await page.evaluate(()=>APP.currentVerb),held);
  assert.match(await page.locator('#verbCounter').innerText(),/Vastgezet/);
  assert.equal(await page.locator('#drawVerb').isDisabled(),true);
  await page.locator('#primaryGame').click();assert.equal(await page.evaluate(()=>APP.currentVerb),held);
  assert.equal(await page.evaluate(()=>JSON.stringify(twDiceState.WHO)),who);
  await page.locator('#undoAction').click();await page.locator('#undoAction').click();
  assert.deepEqual(await selected(),['SET_A2_BASIS']);assert.equal(await page.evaluate(()=>APP.currentVerb),held);
  await selectSets('SET_A2_WEDERKEREND');await page.reload();await page.locator('#resumeBtn').click();
  assert.equal(await page.evaluate(()=>APP.currentVerb),held);assert.equal(await page.locator('#verbLock').getAttribute('aria-pressed'),'true');
  await page.locator('#verbLock').click();
  assert.ok(await page.evaluate(()=>currentVerbPool().some(v=>v.id===APP.currentVerb)));
  await page.locator('#twExample').click();assert.ok(await page.locator('#gameDialog').isVisible());
  await page.keyboard.press('Escape');
  // Legacy single-set saves keep their selected set and current card.
  await page.evaluate(()=>{delete APP.taalworpSets;APP.last.data={setId:APP.taalworpSet};save()});
  const legacy=await page.evaluate(()=>APP.currentVerb);
  await page.reload();await page.locator('#resumeBtn').click();
  assert.deepEqual(await selected(),['SET_A2_WEDERKEREND']);assert.equal(await page.evaluate(()=>APP.currentVerb),legacy);
  for(const width of [1440,1024,768,390]){
   await page.setViewportSize({width,height:900});await selectSets('SET_A2_BASIS','SET_A2_WERK');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
   await page.locator('#primaryGame').click();
   if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'taalworp-'+width+'.png'),fullPage:true});
  }
  assert.equal(await page.evaluate(()=>JSON.stringify(APP.boardStates)),boards);assert.deepEqual(errors,[]);
  console.log('PASS: 23 sets in three groups, unique mixed pool, empty selection, card-only draw, locked cards/dice across sets, undo, resume, legacy saves and four viewports.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
