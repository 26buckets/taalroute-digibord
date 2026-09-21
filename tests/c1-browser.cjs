const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.BASE_URL||'file://'+path.join(served,'index.html'));
  await page.locator('[data-category="cards"]').click();
  await page.locator('[data-ctype="c1-between-lines"]').click();
  const boards=await page.evaluate(()=>JSON.stringify(APP.boardStates));
  assert.equal(await page.locator('#levelSelect').inputValue(),'C1');
  assert.equal(await page.locator('#levelSelect').isDisabled(),true);
  const bank=await page.evaluate(()=>RUNTIME.c1BetweenLines),seen=new Set();
  const expected={window:{DIGIBORD_DATA:{}}};require('node:vm').runInNewContext(fs.readFileSync(path.join(root,'data/c1-between-lines.js'),'utf8'),expected);
  assert.deepEqual(bank,JSON.parse(JSON.stringify(expected.window.DIGIBORD_DATA.c1BetweenLines)));
  assert.equal(bank.cards.length,50);
  for(let i=0;i<50;i++){
   const c=bank.cards[i];
   assert.equal(await page.locator('[data-card-id]').getAttribute('data-card-id'),c.id);seen.add(c.id);
   assert.equal(await page.locator('.c1-content h2').innerText(),c.expression);
   assert.equal(await page.locator('.card-situation p').innerText(),c.situation);
   assert.equal(await page.locator('#c1Question').innerText(),c.question);
   assert.deepEqual(await page.locator('[data-c1-choice]').allTextContents(),c.options.map(o=>o.id+'. '+o.text));
   assert.equal(await page.locator('#c1Feedback').textContent(),'');
   assert.equal(await page.locator('#cardHelp,#cardExample,#cardAttempt,#cardSupport').count(),0);
   const choice=i%2?c.options.find(o=>o.id!==c.correct).id:c.correct;
   await page.locator(`[data-c1-choice="${choice}"]`).click();
   assert.equal(await page.locator('#c1Feedback > strong').innerText(),i%2?'Fout':'Goed');
   assert.deepEqual(await page.locator('#c1Feedback p').allTextContents(),[
    'Juiste antwoord: '+c.correct+'. '+c.options.find(o=>o.id===c.correct).text,c.explanation,c.attention]);
   assert.equal(await page.locator('[data-c1-choice]:disabled').count(),3);
   assert.equal(await page.locator('[data-c1-choice][aria-pressed="true"]').count(),1);
   await page.locator('#primaryGame').click();
  }
  assert.equal(seen.size,50);assert.equal(await page.locator('[data-card-id]').getAttribute('data-card-id'),bank.cards[0].id);
  await page.locator('#c1Previous').click();assert.equal(await page.locator('[data-card-id]').getAttribute('data-card-id'),bank.cards[49].id);
  await page.locator('#primaryGame').click();assert.equal(await page.locator('[data-card-id]').getAttribute('data-card-id'),bank.cards[0].id);
  for(const domain of bank.domains){
   await page.locator('#c1Domain').selectOption(String(domain.id));
   const expected=bank.cards.filter(c=>c.domainId===domain.id),ids=[];
   for(const c of expected){
    ids.push(await page.locator('[data-card-id]').getAttribute('data-card-id'));
    assert.equal(await page.locator('#c1Feedback').textContent(),'');
    await page.locator('#primaryGame').click();
   }
   assert.deepEqual(ids,expected.map(c=>c.id));
   assert.equal(await page.locator('.card-counter').innerText(),'1 van '+expected.length);
  }
  await page.locator('[data-c1-choice="B"]').focus();await page.keyboard.press('Enter');
  const before=await page.locator('#c1Feedback').innerText();
  await page.reload();await page.locator('#resumeBtn').click();
  assert.equal(await page.locator('#c1Domain').inputValue(),'5');assert.equal(await page.locator('#c1Feedback').innerText(),before);
  await page.locator('#undoAction').click();assert.equal(await page.locator('#c1Feedback').textContent(),'');
  await page.locator('#settingsBtn').click();
  await page.frameLocator('#settingsOverlay iframe').locator('button[data-page="display"]').click();
  await page.frameLocator('#settingsOverlay iframe').locator('#cardAnimation').selectOption('slide');
  await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();
  assert.equal(await page.evaluate(()=>cardEffect()),'slide');
  const longest=[...bank.cards].sort((a,b)=>JSON.stringify(b).length-JSON.stringify(a).length).slice(0,3);
  await page.locator('#c1Domain').selectOption('');
  for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[320,568]]){
   await page.setViewportSize({width,height});
   for(const c of longest){
    await page.evaluate(id=>{APP.cardIndex=cardsFor('c1-between-lines').findIndex(c=>c.id===id);delete APP.cardRound;startCards('c1-between-lines')},c.id);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+width);
    for(const selector of ['.c1-content','#c1Domain','.card-ribbon'])assert.ok(await page.locator(selector).evaluate(e=>e.scrollWidth<=e.clientWidth+1),selector+' overflow '+width);
    await page.locator('[data-c1-choice="C"]').click();
    await page.locator('#c1Feedback p').last().scrollIntoViewIfNeeded();
    assert.ok(await page.locator('#c1Feedback p').last().isVisible());
    const rect=await page.locator('#primaryGame').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=width+1&&rect.y+rect.height<=height+1,'next clipped '+width);
   }
   if(process.env.SCREENSHOT_DIR&&[1440,390].includes(width)){
    fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});
    await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'c1-'+width+'.png')});
   }
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);
  await page.locator('#primaryGame').click();assert.equal(await page.locator('#c1Feedback').textContent(),'');
  await page.locator('#fullscreenBtn').click();
  await page.locator('[data-ctype="conversation"]').click();assert.equal(await page.locator('#levelSelect').isDisabled(),false);
  await page.locator('[data-ctype="c1-between-lines"]').click();
  await page.locator('#c1ViewSet').click();
  await page.locator('#backToCabinet').click();
  await page.locator('#cabinetSearch').fill('C1');
  await page.locator('[data-cabinet-id="c1-between-lines"]').click();
  assert.equal(await page.locator('.detail-text-cards article').count(),50);
  await page.locator('#startCabinetActivity').click();assert.equal(await page.locator('#levelSelect').inputValue(),'C1');
  assert.equal(await page.evaluate(()=>JSON.stringify(APP.boardStates)),boards);
  assert.deepEqual(errors,[]);
  console.log('PASS: 50 exact C1 cards, ordered choices, correct/incorrect immediate feedback, no premature reveal, answer lock, wraparound/previous, five full domain cycles, reload/undo, Style Control, six viewports/long text, fullscreen, cabinet and board-state preservation.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
