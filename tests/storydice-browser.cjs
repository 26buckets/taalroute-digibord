const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.join(served,'index.html'));
  const boards=await page.evaluate(()=>JSON.stringify(APP.boardStates));
  await page.locator('[data-category="dice"]').click();
  assert.match(await page.locator('.tile[data-dicegame="verhaalworp"]').innerText(),/320 beelden · 10 sets/);
  await page.locator('.tile[data-dicegame="verhaalworp"]').click();
  assert.equal(await page.locator('#storySet option').count(),10);
  const sets=await page.evaluate(()=>story.collections.map(s=>({id:s.id,label:s.label,count:s.count})));
  assert.deepEqual(sets.map(s=>s.count),[54,54,36,54,6,12,18,12,54,22]);
  // Decode every original and offline texture, including the last new image.
  assert.deepEqual(await page.evaluate(async()=>{
   const failed=[];
   for(const icon of story.icons){
    for(const src of [icon.file,window.DICE_TEXTURES[icon.file]]){
     const image=new Image();image.src=src;
     try{await image.decode();if(!image.naturalWidth)failed.push(icon.id)}catch{failed.push(icon.id)}
    }
   }
   return failed;
  }),[]);
  for(const set of sets){
   await page.locator('#storySet').selectOption(set.id);
   const counts=set.count<9?[3,6]:[3,6,9];
   assert.deepEqual(await page.locator('[data-storycount]').allTextContents(),counts.map(String));
   for(const count of counts){
    await page.locator(`[data-storycount="${count}"]`).click();
    assert.equal(await page.locator('.story-tile').count(),count);
    for(let n=0;n<2;n++){
     await page.locator('#primaryGame').click();
     const roll=await page.evaluate(()=>({ids:APP.storyRoll,pool:storyPool().map(x=>x.id)}));
     assert.equal(new Set(roll.ids).size,count);assert.ok(roll.ids.every(id=>roll.pool.includes(id)));
    }
   }
   await page.waitForFunction(()=>[...document.querySelectorAll('#storyGrid canvas')].every(c=>c.width>0));
   assert.equal(await page.locator('.dice-load-error').count(),0);
  }
  await page.locator('#storySet').selectOption('basis');await page.locator('[data-storycount="9"]').click();
  await page.locator('#storySet').selectOption('familie');
  assert.equal(await page.locator('.story-tile').count(),6);
  await page.locator('[data-storylock="0"]').click();await page.locator('[data-storydie="1"]').click();
  const held=await page.evaluate(()=>APP.storyRoll.slice(0,2));
  await page.locator('#primaryGame').click();assert.deepEqual(await page.evaluate(()=>APP.storyRoll.slice(0,2)),held);
  const rolled=await page.evaluate(()=>APP.storyRoll);
  await page.locator('#primaryGame').click();await page.locator('#undoAction').click();
  assert.deepEqual(await page.evaluate(()=>APP.storyRoll),rolled);
  await page.reload();await page.locator('#resumeBtn').click();
  assert.equal(await page.locator('#storySet').inputValue(),'familie');
  assert.deepEqual(await page.evaluate(()=>APP.storyRoll),rolled);
  assert.equal(await page.locator('[data-storylock="0"]').getAttribute('aria-pressed'),'true');
  // Every new set is also discoverable and starts from the existing cabinet.
  for(const set of sets){
   await page.locator('[data-main="mycollection"]').click();await page.locator('#collectionStorySets').click();
   assert.equal(await page.locator('[data-cabinet-type="story"]').count(),10);
   await page.locator(`[data-cabinet-id="${set.id}"][data-cabinet-type="story"]`).click();
   assert.equal(await page.locator('#setDetailTitle').innerText(),set.label);
   assert.equal(await page.locator('#setStoryCount option').count(),set.count<9?2:3);
   await page.locator('#startCabinetActivity').click();
   assert.equal(await page.locator('#storySet').inputValue(),set.id);
  }
  for(const width of [1440,1024,768,390]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
   await page.locator('#storySet').selectOption('extra-acties');
   await page.locator('#primaryGame').click();
   if(process.env.SCREENSHOT_DIR&&[1440,390].includes(width)){
    fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'verhaalworp-'+width+'.png'),fullPage:true});
   }
  }
  assert.equal(await page.evaluate(()=>JSON.stringify(APP.boardStates)),boards);assert.deepEqual(errors,[]);
  console.log('PASS: 320 original images and offline textures; ten sets, valid counts, unique rolls, locks, disabled dice, undo, resume, cabinet, four viewports and preserved boards.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
