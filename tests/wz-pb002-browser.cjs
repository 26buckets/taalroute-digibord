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
 await page.locator('[name=family]').selectOption('words');assert.equal(await page.evaluate(()=>ContentRuntime.filterSource({family_ids:['words']}).length),840);
 await page.locator('[name=topic]').selectOption('WZ_009');assert.equal(await page.locator('[name=level]').inputValue(),'A0→A1');
 await page.locator('.practice-engine:has(input[value=CARDS])').click();assert.ok(await page.locator('.practice-engine .lucide-icon').count());
 assert.equal(await page.locator('.practice-engine input[value=DICE]').count(),0);assert.equal(await page.evaluate(()=>ContentUI.state().difficulty),'basis');
 await page.locator('.practice-inventory>summary').click();await page.locator('.practice-level-info>summary').click();assert.equal(await page.locator('.practice-levels .practice-level').last().textContent(),'C2');await page.locator('.practice-inventory>summary').click();
 const first=await page.evaluate(()=>ContentRuntime.createSession(ContentUI.sessionOptions(24)).selected_item_ids);
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-practice-engine=BOARD]:not([data-practice-variant])').click();assert.deepEqual(await page.evaluate(()=>ContentRuntime.createSession(ContentUI.sessionOptions(24)).selected_item_ids),first);
 await page.locator('.practice-engine:has(input[value=CARDS])').click();
 for(const width of [320,390,768,1024,1440,1920]){
  await page.setViewportSize({width,height:1000});assert.ok(await page.locator('#contentPracticeApp').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'No preparation overflow '+width);
  assert.ok(await page.locator('.practice-choice>span').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).every(e=>e.getBoundingClientRect().height>=44)),'Touch targets '+width);
  if([390,1440].includes(width)){const dir=path.join(root,'tests/artifacts/compact');fs.mkdirSync(dir,{recursive:true});await page.locator('#screen-practice').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(dir,`words-${width}.png`)});}
 }
 await page.setViewportSize({width:1440,height:1000});await page.locator('#practiceSave').click();await page.locator('#lessonName').fill('Er oefenen');await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 await page.locator('#practiceStart').click();await page.locator('#primaryGame').click();await page.evaluate(()=>LessonUI.flush());const session=await page.evaluate(()=>APP.contentSessionConfig);
 await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active .content-vert001-cards');await page.evaluate(()=>LessonUI.flush());assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),session.selected_item_ids);assert.equal(await page.evaluate(()=>APP.cardIndex),1);
 // Every imported task is displayed using the same real card renderer.
 await page.evaluate(()=>{ContentUI.clearEditing();const filters={family_ids:['words'],topics:['WZ_009','WZ_010'],levels:['A0→A1']};const duration=ContentRuntime.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0);ContentUI.launch(ContentRuntime.createSession({filters,targetDurationSeconds:duration,selectedGameEngine:'CARDS'}))});
 const seen=new Set();for(let n=0;n<160;n++){
  const id=await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id');assert.ok(!seen.has(id),JSON.stringify({n,id,state:await page.evaluate(()=>({index:APP.cardIndex,size:APP.contentSessionConfig.selected_item_ids.length}))}));seen.add(id);
  await page.locator('#contentCardReveal').click();assert.ok((await page.locator('#contentCardAnswer').textContent()).trim());await page.locator('#primaryGame').click();await page.waitForFunction(previous=>document.querySelector('[data-content-item-id]')?.dataset.contentItemId!==previous,id);
 }assert.equal(seen.size,160);
 for(const engine of ['BOARD','WHEEL','QUIZ','SEQUENCE','MATCH','MEMORY']){
  await page.evaluate(engine=>{const fn=engine==='SEQUENCE'?'Bouw':['MATCH','MEMORY'].includes(engine)?'Herstel':null;const filters={family_ids:['words'],topics:['WZ_010'],levels:['A0→A1'],language_functions:fn?[fn]:[]};APP.fixedRoll=1;settingsPatch({reducedMotion:true});ContentUI.launch(ContentRuntime.createSession({filters,targetDurationSeconds:300,selectedGameEngine:engine,organizationMode:'groups',seed:11}))},engine);
  assert.ok(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids.every(id=>id.startsWith('WZ_010_'))));
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));assert.match(await page.locator('#taskDrawer').getAttribute('data-task-id'),/^WZ_010_/);}
  if(engine==='WHEEL')assert.ok(await page.locator('.na-wheel-legend [data-content-item-id]').count());
  if(engine==='QUIZ')assert.ok(await page.locator('.na-quiz-board [data-content-item-id]').count());
  if(engine==='MATCH')assert.ok(await page.locator('.na-pairs .na-pair-text').count());
  if(engine==='MEMORY')assert.ok(await page.locator('.na-memory').isVisible());
  if(engine==='SEQUENCE'){
   const count=await page.locator('.na-step-bank [data-na=step]').count();for(let n=0;n<count;n++)await page.locator(`[data-na=step][data-value="${n}"]`).click();await page.locator('#primaryGame').click();await page.waitForFunction(()=>/De volgorde klopt!/.test(document.querySelector('#na-feedback')?.textContent||''));
  }
 }
 await page.evaluate(()=>ContentUI.openPilot());const dir=path.join(root,'tests/artifacts/compact');await page.screenshot({path:path.join(dir,'pilot-1440.png')});
 assert.equal(await page.locator('.pilot-preview').getAttribute('open'),null);assert.deepEqual(errors,[]);
 console.log('PASS PB002 browser: 840 loaded, both routes, source topics, C2 label, icons, suitable games, six widths, saved/resumed progress all 160 cards, board/wheel/quiz/matching/memory and correct sentence ordering.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
