const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 const dir=path.join(root,'tests/artifacts/mr03');fs.mkdirSync(dir,{recursive:true});
 await page.locator('[data-main=practice]').click();await page.locator('[name=family]').selectOption('reading');assert.equal(await page.locator('[name=topic]').inputValue(),'verbanden');assert.equal(await page.locator('[name=level]').inputValue(),'B2');
 await page.locator('.practice-engine:has(input[value=CARDS])').click();const prepared=await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id));assert.equal(prepared.length,4);
 assert.equal(await page.evaluate(()=>ContentRuntime.items().length),8414);assert.deepEqual(await page.locator('.practice-engine input').evaluateAll(es=>es.map(e=>e.value).sort()),['BOARD','CARDS','WHEEL']);
 await page.locator('#practiceForm [data-guidance=erk]').click();assert.equal(await page.locator('.guidance-status').textContent(),'B2');await page.keyboard.press('Escape');
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-practice-engine=BOARD]:not([data-practice-variant])').click();assert.deepEqual(await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id)),prepared);
 await page.locator('.practice-engine:has(input[value=CARDS])').click();await page.locator('#practiceSave').click();await page.locator('#lessonName').fill('Verbanden begrijpen');await page.locator('#lessonSaveForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);await page.locator('#practiceStart').click();
 assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),prepared);
 async function launch(engine){await page.evaluate(engine=>{ContentUI.clearEditing();APP.fixedRoll=1;settingsPatch({reducedMotion:true});ContentUI.launch(ContentRuntime.createSession({filters:{bank_ids:['CB-MR03-013']},selectedGameEngine:engine,targetDurationSeconds:2160,seed:8}))},engine)}
 async function checkTask(){
  const host=page.locator('#screen-game [data-reasoning-item]'),id=await host.getAttribute('data-reasoning-item'),n=Number(id.slice(-3)),source=await page.evaluate(id=>ContentRuntime.itemForSession(id),id);
  assert.equal(await host.locator('[data-reasoning-action=example]').count(),0,'No model before own attempt');
  assert.equal(await host.locator('[data-reasoning-action=hint]').count(),n<=10?1:0);
  if(n<=6){assert.equal(await host.locator('textarea').count(),0);await host.locator('[data-reasoning-action=read]').click();}
  assert.equal(await host.locator('textarea').count(),n===9?4:n===10?5:n>=11?2:1);
  if(n<=10){await host.locator('[data-reasoning-action=hint]').click();assert.equal(await host.locator('.reasoning-hint').innerText(),source.reasoning.hint);await host.locator('[data-reasoning-action=hint]').click();}
  if(n===9||n===10){
   const remove=host.locator('[data-reasoning-action=remove]').first(),index=Number(await remove.getAttribute('data-index')),word=await remove.getAttribute('data-word');await remove.click();assert.ok(!(await host.locator('textarea').nth(index).inputValue()).startsWith(word));
   await host.locator(`[data-reasoning-action=reset][data-index="${index}"]`).click();assert.equal(await host.locator('textarea').nth(index).inputValue(),source.reasoning.presentation.source_blocks[index]);
  }
  if(n>=11)assert.deepEqual(await host.locator('.reasoning-field>span').allTextContents(),['Mogelijke uitleg','Wat weten we nog niet zeker?']);
  await host.locator('textarea').first().fill('Mijn eigen uitleg');const before=await page.evaluate(()=>APP.cardIndex);await host.locator('textarea').first().press('Space');assert.equal(await page.evaluate(()=>APP.cardIndex),before,'Typing space does not advance the game');
  await host.locator('[data-reasoning-action=attempt]').click();await host.locator('[data-reasoning-action=example]').click();assert.ok((await host.locator('.content-answer').innerText()).includes(source.model_answer));
  await host.locator('textarea').first().fill('Aangepast antwoord');assert.equal(await host.locator('.content-answer:visible').count(),0);assert.equal(await host.locator('[data-reasoning-action=example]').count(),0);
  await host.locator('[data-reasoning-action=attempt]').click();await host.locator('[data-reasoning-action=example]').click();const last=host.locator('.content-answer section:last-child p');await last.scrollIntoViewIfNeeded();assert.ok(await last.evaluate(e=>{const r=e.getBoundingClientRect(),bar=document.querySelector('.gamebar').getBoundingClientRect();return r.top>=0&&r.bottom<=bar.top+1}),'Complete explanation reachable');return id;
 }
 await launch('CARDS');const seen=new Set();
 for(let k=0;k<12;k++){
  const id=await checkTask();assert.ok(!seen.has(id));seen.add(id);
  if(['009','011'].includes(id.slice(-3))){
   await page.locator('#screen-game [data-reasoning-item]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(dir,'cards-'+id.slice(-3)+'.png')});
   for(const width of [320,390,768,1440,1920]){await page.setViewportSize({width,height:1000});assert.ok(await page.locator('#screen-game .reasoning-task').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'No horizontal overflow '+width);assert.ok(await page.locator('#screen-game .reasoning-task button').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)))}
   await page.setViewportSize({width:1440,height:1000});
  }
  if(k<11)await page.locator('#primaryGame').click();
 }
 // Navigating away and back in the same lesson keeps drafts; source and lesson records remain untouched.
 const last=await page.locator('#screen-game [data-reasoning-item]').getAttribute('data-reasoning-item');
 await page.locator('#screen-game textarea').first().fill('<img src=x onerror=alert(1)>');await page.evaluate(()=>nextContentCard(-1));await page.evaluate(()=>nextContentCard(1));assert.equal(await page.locator('#screen-game textarea').first().inputValue(),'<img src=x onerror=alert(1)>');assert.equal(await page.locator('#screen-game .reasoning-task img').count(),0);
 await page.evaluate(()=>LessonUI.flush());const savedText=await page.evaluate(async()=>JSON.stringify(await LessonUI.service.list('recent_session')));assert.ok(!savedText.includes('onerror=alert'));assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('onerror=alert'));
 await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('#screen-game [data-reasoning-item]').getAttribute('data-reasoning-item'),last);assert.equal(await page.locator('#screen-game [data-reasoning-action=example]').count(),0);
 const reloadHost=page.locator('#screen-game [data-reasoning-item]');if(await reloadHost.locator('[data-reasoning-action=read]').count())await reloadHost.locator('[data-reasoning-action=read]').click();assert.ok(!(await reloadHost.locator('textarea').first().inputValue()).includes('onerror'));
 for(const engine of ['BOARD','WHEEL']){
  await launch(engine);const visited=new Set();
  for(let n=0;n<12;n++){
   if(engine==='BOARD'){if(n===0){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'))}else await page.locator('#contentBoardNext').click();assert.ok(await page.locator('#contentBoardAnswer').isHidden());assert.ok(await page.locator('#taskDrawer .context-tools').isHidden())}
   else{await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);assert.ok(await page.locator('.new-activity .context-tools').isHidden(),'No second route to a premature example');}
   const id=await checkTask();assert.ok(!visited.has(id),'No repeat before exhaustion '+engine);visited.add(id);
   if(n===0){await page.evaluate(()=>LessonUI.flush());await page.screenshot({path:path.join(dir,engine.toLowerCase()+'.png')});}
  }
  assert.equal(visited.size,12);
  await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.locator('#screen-game [data-reasoning-item]').waitFor({state:'visible'});assert.equal(await page.locator('#screen-game [data-reasoning-item]').count(),1,'Resume '+engine+' with dotted source IDs');
  for(const width of [390,1440]){await page.setViewportSize({width,height:1000});assert.ok(await page.locator('#screen-game .reasoning-task').evaluate(e=>e.scrollWidth<=e.clientWidth+1),engine+' overflow');}
 }
 assert.deepEqual(errors,[]);console.log('PASS MR03 browser: all 12 tasks in CARDS/BOARD/WHEEL, both preparation routes, source blocks/edits/columns, hint and example gates, keyboard, draft navigation, no response persistence, lesson resume, dotted IDs and responsive layout.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
