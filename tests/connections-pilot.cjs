const controls=require('./practice-controls.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),http=require('node:http');
const {chromium}=require('playwright');
const {createContentRuntime}=require('../content-runtime.js');
const gram=require('../data/content-vert001-er-b1.js'),bank=require('../data/connections-pilot.js');
const runtime=createContentRuntime(gram),before=JSON.stringify(gram);
assert.throws(()=>runtime.registerBank(bank),/reviewstatus/);
runtime.registerBank(bank,{familyId:'connections',reviewGate:['PILOT_REVIEW'],excludedEngines:['DICE']});
const legacyRuntime=createContentRuntime(gram);legacyRuntime.registerBank(bank,{familyId:'connections',reviewGate:['PILOT_REVIEW']});
const filters={family_ids:['connections'],topics:['oorzaak-gevolg'],levels:['B2']};
assert.equal(bank.items.length,12);assert.equal(new Set(bank.items.map(i=>i.content_item_id)).size,12);
for(const i of bank.items){assert.equal(i.publication_status,'pilot_only');assert.equal(runtime.answerPolicy(i).mode,'teacher_or_peer_review');assert.ok(i.context&&i.explanation&&i.model_answer);assert.ok(i.source_ref.signal_ids.every(id=>/^TLE\.NL\.SIG\.SW\.00000[123789]$/.test(id)));}
assert.deepEqual(runtime.fullCoverageEngines(filters),['BOARD','WHEEL','CARDS']);
assert.ok(runtime.fullCoverageEngines(filters,'groups').includes('QUIZ'));
const selected=runtime.createSession({filters,seed:19,targetDurationSeconds:600,selectedGameEngine:'CARDS'});
for(const game of ['BOARD','WHEEL'])assert.deepEqual(runtime.createSession({filters,seed:19,targetDurationSeconds:600,selectedGameEngine:game}).selected_item_ids,selected.selected_item_ids);
assert.throws(()=>runtime.createSession({filters:{...filters,levels:['A2']},targetDurationSeconds:300}),/Geen|gekozen/);
const oldDice=legacyRuntime.createSession({filters,seed:19,targetDurationSeconds:600,selectedGameEngine:'DICE'});
assert.throws(()=>runtime.createSession({filters,selectedGameEngine:'DICE',targetDurationSeconds:600}),/spelvorm|contentselectie/);
assert.throws(()=>runtime.createSession({filters,engines:['DICE'],selectedGameEngine:'DICE',targetDurationSeconds:600}),/spelvorm|contentselectie/);
assert.deepEqual(runtime.restoreSession(oldDice).selected_item_ids,oldDice.selected_item_ids);
assert.equal(runtime.enginePool('DICE',oldDice).length,5);
assert.deepEqual(runtime.fullCoverageEngines({family_ids:['grammar'],topics:['ER'],levels:['B1']}),legacyRuntime.fullCoverageEngines({family_ids:['grammar'],topics:['ER'],levels:['B1']}));
assert.equal(JSON.stringify(gram),before);
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 await page.locator('[data-main=practice]').click();await page.locator('.practice-inventory>summary').click();
 assert.match(await page.locator('#inventoryCount').textContent(),/8\.414 opdrachten/);
 await page.evaluate(()=>ContentUI.openPilot());assert.equal(await page.evaluate(()=>ContentUI.state().topic),'oorzaak-gevolg');
 await page.locator('.practice-guidance>summary').click();
 for(const logo of await page.locator('.practice-help [data-guidance]').all())assert.equal(await logo.isVisible(),true);
 assert.equal(await page.locator('input[name=engine][value=DICE]').count(),0);assert.equal(await page.locator('#practiceStart').isEnabled(),true);
 await page.evaluate(()=>ContentUI.open({engine:'DICE'}));assert.equal(await page.locator('#practiceStart').isEnabled(),false);
 assert.equal(await page.locator('input[name=engine][value=DICE]').count(),0);
 await controls.game(page,'.practice-engine:has(input[name=engine][value=CARDS])');assert.equal(await page.locator('#practiceStart').isEnabled(),true);
 await page.locator('select[name=duration]').focus();await page.keyboard.press('ArrowDown');
 assert.equal(await page.evaluate(()=>document.activeElement.name),'duration');
 await page.locator('select[name=duration]').selectOption('600');
 assert.equal(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).length),12);
 await page.evaluate(()=>ContentUI.setSeedOverride(19));
 const contentFirst=await page.evaluate(()=>ContentRuntime.createSession(ContentUI.sessionOptions(19)).selected_item_ids);
 await page.locator('#practiceSave').click();await page.locator('#lessonName').fill('Proefles oorzaak en gevolg');await page.locator('#lessonSaveForm .primary').click();
 await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);assert.equal(await page.locator('#practiceForm').count(),1);
 assert.deepEqual(await page.evaluate(()=>ContentRuntime.createSession(ContentUI.sessionOptions(19)).selected_item_ids),contentFirst);
 await page.reload();await page.evaluate(()=>ContentUI.setSeedOverride(19));await page.locator('[data-main=lessons]').click();await page.locator('.lesson-card').filter({hasText:'Proefles oorzaak en gevolg'}).locator('[data-lesson-action=edit]').click();
 await page.locator('#practiceForm').waitFor({state:'visible'});assert.equal(await page.locator('#practiceForm').count(),1);assert.deepEqual(await page.evaluate(()=>ContentRuntime.createSession(ContentUI.sessionOptions(19)).selected_item_ids),contentFirst);
 await page.evaluate(()=>goScreen('workforms'));await page.locator('#screen-workforms .category-head [data-practice-engine=WHEEL]').click();
 await page.evaluate(()=>ContentUI.clearEditing());await page.evaluate(()=>ContentUI.openPilot());
 assert.deepEqual(await page.evaluate(()=>ContentRuntime.createSession(ContentUI.sessionOptions(19)).selected_item_ids),contentFirst);
 for(const width of [320,390,768,1024,1440,1920]){
  await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page '+width);
  assert.ok(await page.locator('#contentPracticeApp').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'lesson '+width);
  if(process.env.PILOT_SCREENSHOTS&&[390,1440].includes(width)){fs.mkdirSync(process.env.PILOT_SCREENSHOTS,{recursive:true});await page.locator('#screen-practice').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(process.env.PILOT_SCREENSHOTS,`proefles-${width}.png`)});}
 }
 await page.setViewportSize({width:1440,height:1000});await controls.game(page,'.practice-engine:has(input[value=CARDS])');await page.evaluate(()=>ContentUI.setSeedOverride(19));await page.locator('#practiceStart').click();await page.waitForSelector('.content-vert001-cards');
 const session=await page.evaluate(()=>APP.contentSessionConfig);assert.deepEqual(session.selected_item_ids,contentFirst);
 const id=await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id');assert.ok(id.startsWith('CONNECT_B2_PILOT_'));
 assert.equal(await page.locator('#contentCardAnswer').isVisible(),false);await page.locator('#contentCardReveal').click();assert.equal(await page.locator('#contentCardAnswer').isVisible(),true);
 await page.locator('#primaryGame').click();await page.reload();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),session.selected_item_ids);
 // Exercise every task in the real renderer, without treating the model as the only correct answer.
 await page.evaluate(()=>{ContentUI.openPilot();ContentUI.setState({engine:'CARDS'});ContentUI.launch(ContentRuntime.createSession({...ContentUI.sessionOptions(9),targetDurationSeconds:1440}))});
 const seen=new Set();for(let n=0;n<12;n++){seen.add(await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id'));await page.locator('#contentCardReveal').click();assert.match(await page.locator('#contentCardAnswer').textContent(),/./);await page.locator('#primaryGame').click();}assert.equal(seen.size,12);
 // Real controls across two full board cycles, including restore and same-square replacement.
 await page.evaluate(()=>{ContentUI.openPilot();ContentUI.setState({engine:'BOARD',variant:'rotterdam'});APP.fixedRoll=1;settingsPatch({showConnections:false,reducedMotion:true});ContentUI.start(19)});
 const boardCount=await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids.length),boardSeen=[];
 for(let n=0;n<boardCount*2;n++){
  await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));
  boardSeen.push(await page.locator('#taskDrawer').getAttribute('data-task-id'));
  assert.ok((await page.locator('#taskInput .content-situation').textContent()).includes('De situatie'));
  if(n===1){await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('#taskDrawer').getAttribute('data-task-id'),boardSeen.at(-1));}
 }
 assert.equal(new Set(boardSeen.slice(0,boardCount)).size,boardCount);assert.deepEqual(boardSeen.slice(boardCount),boardSeen.slice(0,boardCount));
 const pos=await page.evaluate(()=>APP.boardStates.rotterdam.classPos);await page.locator('#contentBoardNext').click();assert.notEqual(await page.locator('#taskDrawer').getAttribute('data-task-id'),boardSeen.at(-1));assert.equal(await page.evaluate(()=>APP.boardStates.rotterdam.classPos),pos);
 await page.locator('#contentBoardAnswer').click();assert.ok(await page.locator('.content-support').isVisible());await page.locator('#dialogClose').click();
 if(process.env.PILOT_SCREENSHOTS)await page.screenshot({path:path.join(process.env.PILOT_SCREENSHOTS,'speelbord-1440.png')});
 // Every die outcome, including a roll equal to the selection size, must change the task.
 await page.evaluate(config=>ContentUI.launch(config),oldDice);
 for(let roll=1;roll<=6;roll++){
  const previous=await page.locator('.content-reading').getAttribute('data-content-item-id');
  await page.evaluate(n=>{window.testRandom=Math.random;Math.random=()=> (n-.5)/6},roll);
  await page.locator('#contentDie').click();await page.waitForFunction(()=>!contentDiceBusy);
  await page.evaluate(()=>{Math.random=window.testRandom});
  assert.notEqual(await page.locator('.content-reading').getAttribute('data-content-item-id'),previous);assert.equal(await page.evaluate(()=>APP.contentDiceLastRoll),roll);
  assert.equal(await page.locator('#contentDie canvas').count(),1);assert.ok((await page.locator('#contentDie').boundingBox()).height>=110);
 }
 await page.locator('#contentDiceReveal').click();assert.ok(await page.locator('#contentDiceAnswer').isVisible());
 if(process.env.PILOT_SCREENSHOTS)await page.screenshot({path:path.join(process.env.PILOT_SCREENSHOTS,'dobbelspel-1440.png')});
 const dieId=await page.locator('.content-reading').getAttribute('data-content-item-id');await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('.content-reading').getAttribute('data-content-item-id'),dieId);
 // Existing 3D die animation, single-action guard and undo work through the real controls.
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>settingsPatch({reducedMotion:false}));
 const beforeDie=await page.evaluate(()=>({id:APP.contentDiceIndex,roll:APP.contentDiceLastRoll,history:undoHistory.length}));
 await page.locator('#primaryGame').click();assert.equal(await page.locator('#contentDie').isEnabled(),false);
 await page.evaluate(()=>document.querySelector('#contentDie').click());await page.waitForFunction(()=>!contentDiceBusy);
 assert.equal(await page.evaluate(()=>undoHistory.length),Math.min(beforeDie.history+1,5));
 await page.locator('#undoAction').click();assert.deepEqual(await page.evaluate(()=>({id:APP.contentDiceIndex,roll:APP.contentDiceLastRoll})),{id:beforeDie.id,roll:beforeDie.roll});
 await page.locator('[data-grules]').click();assert.match(await page.locator('#dialogBody').textContent(),/Gooi de dobbelsteen/);await page.locator('#dialogClose').click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>settingsPatch({reducedMotion:true}));
 // Wheel contains the full situation and cycles through this five-task lesson without repeats.
 await page.evaluate(()=>{ContentUI.openPilot();ContentUI.setState({engine:'WHEEL'});ContentUI.start(19)});
 const wheelSeen=[];
 for(let n=0;n<boardCount+1;n++){
  await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);await page.locator('.na-wheel-result [data-content-item-id]').waitFor({state:'visible'});
  wheelSeen.push(await page.locator('.na-wheel-result [data-content-item-id]').getAttribute('data-content-item-id'));
  const selected=await page.locator('.na-wheel-legend li').evaluateAll(items=>items.findIndex(e=>e.getAttribute('aria-current')==='true'));
  assert.equal(await page.locator('.na-selected-number').textContent(),'Vak '+(selected+1));
  assert.equal(await page.locator('.na-wheel text').count(),boardCount);
  assert.equal(await page.locator('.wheel-game .card-ribbon').count(),0);
  assert.doesNotMatch(await page.locator('.wheel-game').innerText(),/\bB2\b/);
  assert.equal(await page.locator('#levelSelect option:checked').textContent(),'B2');
  assert.ok(await page.locator('.na-wheel-result .content-situation').isVisible());assert.ok(await page.locator('.na-wheel-result .content-situation p').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=18));
 }
 assert.equal(new Set(wheelSeen.slice(0,boardCount)).size,boardCount);assert.notEqual(wheelSeen.at(-1),wheelSeen.at(-2));
 await page.locator('.na-wheel-result summary').click();assert.ok(await page.locator('.na-wheel-result .content-answer').isVisible());
 if(process.env.PILOT_SCREENSHOTS)await page.screenshot({path:path.join(process.env.PILOT_SCREENSHOTS,'draaischijf-1440.png')});
 for(const width of [390,1024,1440]){
  await page.setViewportSize({width,height:900});
  const head=await page.locator('.wheel-game .card-activity-heading').boundingBox();
  const work=await page.locator('.wheel-game .card-work').boundingBox();
  assert.ok(Math.abs(head.x-work.x)<2&&Math.abs(head.width-work.width)<2,'Wheel header spans the wood');
  assert.ok(await page.locator('.wheel-game .card-work').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  if(process.env.PILOT_SCREENSHOTS)await page.screenshot({path:path.join(process.env.PILOT_SCREENSHOTS,`draaischijf-${width}.png`)});
 }
 for(const game of ['CARDS','DICE']){
  if(game==='DICE')await page.evaluate(config=>ContentUI.launch(config),oldDice);else await page.evaluate(engine=>{ContentUI.openPilot();ContentUI.setState({engine});ContentUI.start(19)},game);
  await page.locator(game==='CARDS'?'#contentCardReveal':'#contentDiceReveal').click();
  for(const width of [390,1024,1440,1920]){
   await page.setViewportSize({width,height:width===1024?768:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const dimensions=await page.locator('#screen-game .content-reading').evaluate(e=>({overflow:e.scrollWidth>e.clientWidth+1,gap:parseFloat(getComputedStyle(e).gap),font:parseFloat(getComputedStyle(e.querySelector('p')).fontSize)}));assert.equal(dimensions.overflow,false);assert.ok(dimensions.gap>=20);assert.ok(dimensions.font>=18);assert.equal(await page.locator('#screen-game .content-reading').evaluate(e=>getComputedStyle(e).columnCount),'auto');
   if(process.env.PILOT_SCREENSHOTS&&[390,1440].includes(width))await page.screenshot({path:path.join(process.env.PILOT_SCREENSHOTS,`${game.toLowerCase()}-${width}.png`)});
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS trial: status guard, source IDs, suitability gate, old dice sessions, route parity, saved lesson, keyboard, six widths, answers, two board cycles, six die outcomes, wheel context, layout and reload.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
