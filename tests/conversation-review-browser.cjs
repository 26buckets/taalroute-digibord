const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root,dir=path.join(root,'tests/artifacts/conversation-review');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const f=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(served+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});
let browser;
(async()=>{
 fs.mkdirSync(dir,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'chrome'});const url=`http://127.0.0.1:${server.address().port}/index.html`,errors=[];
 for(const engine of ['CARDS','BOARD','WHEEL']){
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/data/conversation-review.js*',route=>route.fulfill({contentType:'text/javascript',body:'/* Previous bank versions. */'}));await page.goto(url);await page.locator('[data-main=practice]').click();
  await page.evaluate(()=>{ContentUI.open({family:'conversation'});ContentUI.setState({level:'C1'})});
  await page.evaluate(engine=>{settingsPatch({reducedMotion:true});APP.fixedRoll=1;ContentUI.launch(ContentRuntime.createSession({filters:{family_ids:['conversation'],levels:['C1']},targetDurationSeconds:600,seed:4,selectedGameEngine:engine}))},engine);
  const savedId=await page.evaluate(async()=>{const saved=await LessonUI.service.saveSelection({name:'Bewaarde C1-keuzes',selection_spec:APP.contentSessionConfig.normalized_selection_spec,execution_preferences:{target_duration_seconds:600,organization_mode:'class',preferred_game_engine:'CARDS'}});return saved.saved_selection_id});
  await page.locator('#primaryGame').click();
  if(engine==='BOARD')await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));
  if(engine==='WHEEL')await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);
  await page.evaluate(()=>LessonUI.flush());const before=await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex,items:ContentRuntime.enginePool(APP.contentSessionConfig.selected_game_engine,APP.contentSessionConfig)}));
  await page.unroute('**/data/conversation-review.js*');await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active');
  assert.equal(await page.evaluate(()=>ContentUI.state().level),'B2','Saved preparation follows the revised advice');
  const after=await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex,items:ContentRuntime.enginePool(APP.contentSessionConfig.selected_game_engine,APP.contentSessionConfig)}));assert.deepEqual(after,before,'Exact old session '+engine);
  await page.locator('[data-ghelp]').click();assert.equal(await page.locator('.guidance-status').innerText(),'C1');assert.equal(await page.locator('.guidance-content details').count(),before.items.length);await page.keyboard.press('Escape');
  assert.ok(await page.evaluate(()=>ContentRuntime.filterSource({family_ids:['conversation']}).every(i=>i.cefr_level!=='C1')));
  if(engine==='CARDS'){await page.locator('#primaryGame').click();assert.equal(await page.evaluate(()=>APP.cardIndex),2)}
  const saved=await page.evaluate(async id=>{const r=await LessonUI.service.resolveSavedSelection(id),original=await LessonUI.service.get('saved_selection',id);return {status:r.status,levels:r.session?.cefr_levels,stored:original.selection_spec.scope_clauses[0].cefr_levels}},savedId);assert.deepEqual(saved,{status:'READY',levels:['B2'],stored:['C1']});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true});page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.locator('[data-main=practice]').click();
 const lessons=[];for(const id of ['begrijpen','afspraken','bedoeling']){
  await page.evaluate(()=>ContentUI.open());await page.locator('.practice-inventory > summary').click();await page.getByText('Korte lessen',{exact:true}).click();await page.locator(`[data-conversation-trial="${id}"]`).click();
  const prepared=await page.evaluate(()=>({ids:ContentUI.previewItems().map(i=>i.content_item_id),levels:[...new Set(ContentUI.previewItems().map(i=>i.cefr_level))],groups:ContentUI.previewItems().map(i=>i.practice_group||i.content_item_id),title:document.querySelector('.practice-chosen').firstChild.textContent.trim()}));assert.equal(prepared.ids.length,7);assert.equal(new Set(prepared.groups).size,7);assert.deepEqual(prepared.levels,[id==='begrijpen'?'B1':'B2']);
  await page.locator('#practiceForm [data-guidance=erk]').click();assert.equal(await page.locator('.guidance-status').innerText(),prepared.levels[0]);assert.equal(await page.locator('.guidance-content details').count(),7);await page.keyboard.press('Escape');
  await page.screenshot({path:path.join(dir,id+'.png')});await page.locator('#practiceSave').click();await page.locator('#lessonName').fill(prepared.title);await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
  // Saving preferences may refresh the selection; preserve and start what is actually shown.
  const saved=await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id));await page.locator('#practiceStart').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),saved);lessons.push({id,...prepared});
 }
 await page.evaluate(()=>{ContentUI.clearEditing();ContentUI.open({family:'conversation'});ContentUI.setState({topic:'betekenisnuances',level:'B2'})});assert.deepEqual(await page.locator('[name=level] option').allTextContents(),['B1','B2']);
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'lessons.json'),JSON.stringify(lessons,null,2)+'\n');console.log('PASS revision browser: persisted old C1 cards/board/wheel resume exactly with old guidance; three new lessons visible, save/start and revised guidance agree.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
