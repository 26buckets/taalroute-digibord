const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.join(served,'index.html'));
 await page.evaluate(()=>{APP.boardStates.rotterdam={positions:{p0:7}};settingsPatch({participants:[{id:'p0',name:'Test',color:'#2389e8'}]});save();});
 const before=await page.evaluate(()=>JSON.stringify({boards:APP.boardStates,settings:settingsState()}));
 await page.locator('[data-category="words"]').click();
 assert.equal(await page.locator('[data-wz-goal]').count(),9);
 for(const goal of await page.locator('[data-wz-goal]').evaluateAll(bs=>bs.map(b=>b.dataset.wzGoal))){
  await page.locator(`[data-wz-goal="${goal}"]`).click();
  assert.equal(await page.locator('#wzGoal').inputValue(),goal);
  if(goal==='WZ_006_007')assert.equal(await page.locator('#wzBand').inputValue(),'2');
  await page.locator('#wzBand').selectOption('0');
  for(const type of await page.locator('[data-wz-type]:enabled').evaluateAll(bs=>bs.map(b=>b.dataset.wzType))){
   await page.locator(`[data-wz-type="${type}"]`).click();
   assert.equal(await page.evaluate(()=>wordItem().type),type);
   if(['Spreek','Transfer'].includes(type)){
    assert.equal(await page.locator('#wordCheck').isVisible(),false);
    assert.equal(await page.locator('#wordArrange').isVisible(),false);
    assert.equal(await page.evaluate(()=>{checkWZ();return wordRound.status}),'initial');
   }
  }
  await page.locator('#wzGoalsBack').click();
 }
 await page.locator('[data-wz-goal="WZ_001"]').click();
 await page.locator('#wordArrange').click();
 for(const id of await page.evaluate(()=>sentenceContent().order))await page.locator(`#wordBank [data-token="${id}"]`).click();
 await page.locator('#wordCheck').click();assert.match(await page.locator('#wordFeedback').innerText(),/^Goed gedaan/);
 await page.locator('#primaryGame').click();await page.waitForFunction(()=>!wordBusy);
 await page.locator('#undoAction').click();assert.equal(await page.evaluate(()=>wordRound.itemId),'WZ_001_B01');assert.equal(await page.locator('#sentence [data-token]').count(),3);
 await page.locator('[data-wz-type="Kies"]').click();
 await page.locator('[data-wz-option="B"]').click();await page.locator('#wordCheck').click();assert.equal(await page.evaluate(()=>wordRound.status),'incorrect');
 await page.locator('[data-wz-option="A"]').click();await page.locator('#wordCheck').click();assert.equal(await page.evaluate(()=>wordRound.status),'correct');
 await page.locator('[data-wz-type="Verander"]').click();
 const model=await page.evaluate(()=>wordItem().answerModel);
 await page.locator('#wzResponse').fill(model);await page.locator('#wordCheck').click();assert.equal(await page.evaluate(()=>wordRound.status),'correct');
 await page.locator('#wzResponse').fill('Een andere zin.');await page.locator('#wordCheck').click();assert.equal(await page.evaluate(()=>wordRound.status),'review');
 const saved=await page.evaluate(()=>({itemId:wordRound.itemId,response:wordRound.response}));
 await page.reload();await page.locator('#resumeBtn').click();
 assert.deepEqual(await page.evaluate(()=>({itemId:wordRound.itemId,response:wordRound.response})),saved);
 assert.equal(await page.evaluate(()=>JSON.stringify({boards:APP.boardStates,settings:settingsState()})),before);
 // Every source record renders its own instruction/model without substituting another card.
 const rendered=await page.evaluate(()=>{
  for(const item of WZ_ITEMS){
   const pool=wzPool({goalId:item.goalId,type:item.type,band:item.band});
   wordRound=newWZRound({goalId:item.goalId,type:item.type,band:item.band,round:pool.findIndex(i=>i.id===item.id)+1});startWZ();
   if(!document.querySelector('.card-instruction').textContent.includes(item.instruction))throw Error(item.id+' instruction');
   if(item.type==='Bouw'&&document.querySelectorAll('#spokenWords [role=listitem]').length!==item.tokens.length)throw Error(item.id+' tokens');
   if(item.type==='Kies'&&document.querySelectorAll('[data-wz-option]').length!==item.options.length)throw Error(item.id+' options');
   if(item.answerType==='OPEN'&&!document.querySelector('#wordCheck').hidden)throw Error(item.id+' check');
  }return WZ_ITEMS.length;
 });assert.equal(rendered,680);
 fs.mkdirSync(path.join(root,'test-results/wz'),{recursive:true});
 for(const [width,height] of [[1440,900],[1024,768],[390,844]]){
  await page.setViewportSize({width,height});
  await page.evaluate(()=>selectWZGoal('WZ_001'));
  for(const type of ['Bouw','Kies','Verander','Spreek']){
   await page.locator(`[data-wz-type="${type}"]`).click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.querySelector('.game-work').scrollWidth>document.querySelector('.game-work').clientWidth),false,type+' '+width);
   const next=await page.locator('#primaryGame').boundingBox();assert.ok(next.x>=0&&next.x+next.width<=width+1&&next.y+next.height<=height+1,type+' footer '+width);
   await page.locator('.game-work').evaluate(el=>el.scrollTop=0);
   await page.screenshot({path:path.join(root,`test-results/wz/${type}-${width}.png`)});
  }
 }
 // Keyboard choice and a touch alternative to dragging.
 await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>selectWZGoal('WZ_001'));
 await page.locator('#wordArrange').click();await page.locator('#wordBank button').first().focus();await page.keyboard.press('Space');assert.equal(await page.locator('#sentence button').count(),1);
 const touch=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});await touch.goto('file://'+path.join(served,'index.html'));await touch.locator('[data-category="words"]').tap();await touch.locator('[data-wz-goal="WZ_005"]').tap();await touch.locator('#wordArrange').tap();await touch.locator('#wordBank button').first().tap();assert.equal(await touch.locator('#sentence button').count(),1);await touch.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: 9 taaldoelen via UI, 680 renders, 6 vormen, antwoordcontrole, open guard, hervatten/Terug, pion- en instellingenbehoud, toetsenbord/tik, 3 schermbreedtes.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
