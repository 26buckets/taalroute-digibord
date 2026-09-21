const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(process.env.LEVEL_TEST_URL||require('node:url').pathToFileURL(path.resolve(__dirname,'../index.html')).href);
  await page.evaluate(()=>{settingsPatch({reducedMotion:true});APP.level='A1';APP.cardRoute='R6';APP.tongueLevel='C2';save()});
  await page.reload();
  await page.evaluate(()=>startCards('conversation'));assert.equal(await page.evaluate(()=>currentCard().routeId),'R1');
  await page.evaluate(()=>startCards('tongue'));assert.equal(await page.evaluate(()=>tongueLevel()),'A1');
  const options=await page.locator('#levelSelect option').allTextContents();
  const routes={'Alpha A':'R0','Alpha B':'R0','Alpha C':'R0',A0:'R0',A1:'R1','A1+':'R2',A2:'R3',B1:'R4',B2:'R5',C1:'R6',C2:'R6'};
  for(const level of options){
   await page.locator('#levelSelect').selectOption(level);
   for(const kind of ['mission','conversation','verbs','spelling','puzzles','idioms','story','tongue']){
    await page.evaluate(kind=>startCards(kind),kind);
    assert.equal(await page.locator('#levelSelect').inputValue(),level);
    assert.deepEqual(await page.locator('#levelSelect option').allTextContents(),options);
    if(kind!=='tongue')assert.equal(await page.evaluate(()=>currentCard().routeId),routes[level]);
    else assert.equal(await page.evaluate(()=>tongueLevel()),level.startsWith('Alpha')?'A0':level==='A1+'?'A1':level);
   }
   for(const screen of ['play','boards','dice','words','workforms','activities','lessons']){
    await page.evaluate(screen=>goScreen(screen),screen);
    assert.equal(await page.locator('#levelSelect').inputValue(),level);
   }
   await page.reload();assert.equal(await page.locator('#levelSelect').inputValue(),level);
  }
  // Switching away from an unfinished board retains positions, but refreshes both boards' tasks.
  await page.locator('#levelSelect').selectOption('A1');
  await page.evaluate(()=>{startBoard('rotterdam');showBoardTask('rotterdam',routeCache.rotterdam);startBoard('zwolle');showBoardTask('zwolle',routeCache.zwolle);rememberAction('niveau-regressie')});
  const positions=await page.evaluate(()=>Object.fromEntries(Object.entries(APP.boardStates).map(([key,s])=>[key,JSON.stringify({...s,pending:null})])));
  await page.locator('#levelSelect').selectOption('B1');
  await page.locator('#undoAction').click();
  assert.equal(await page.locator('#levelSelect').inputValue(),'B1');
  for(const board of ['rotterdam','zwolle']){
   await page.evaluate(board=>startBoard(board),board);
   assert.equal(await page.evaluate(()=>APP.boardStates[APP.last.data.board].pending.task.routeId),await page.evaluate(()=>selectedTaskRoute().id));
  }
  assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(APP.boardStates).map(([key,s])=>[key,JSON.stringify({...s,pending:null})]))),positions);
  await page.evaluate(()=>home());await page.locator('#settingsBtn').click();
  assert.equal(await page.frameLocator('#settingsOverlay iframe').locator('#routeSelect').isDisabled(),true);
  await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();
  assert.equal(await page.locator('#levelSelect').inputValue(),'B1');
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   await page.evaluate(()=>startStory('basis'));
   await page.locator('#levelSelect').selectOption('A1');assert.match(await page.locator('#storyPromptCount').innerText(),/korte zin/);
   await page.evaluate(()=>startTaalworp('SET_A2_BASIS'));
   assert.match(await page.locator('.card-activity-heading h1').innerText(),/A1/);
   await page.evaluate(()=>startWords('build'));assert.equal(await page.locator('#levelSelect').inputValue(),'A1');
   await page.evaluate(()=>DigiActivities.start('draaiwiel'));
   await page.locator('#levelSelect').selectOption('B1');assert.match(await page.locator('#na-level').innerText(),/vervolgvraag/);
   await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);
   await page.locator('#levelSelect').selectOption('A2');assert.equal(await page.evaluate(()=>!!document.fullscreenElement),true);
   await page.locator('#fullscreenBtn').click();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: global level across all levels, card families, screens, stale saved filters, reload, undo, both pending boards, settings, dice, words, activities, mobile and fullscreen.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
