const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root,dir=path.join(root,'tests/artifacts/gesprekslesproef');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 fs.mkdirSync(dir,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();
 const audit=await page.evaluate(()=>{
  const rows=ContentRuntime.filterSource({family_ids:['conversation']}),levelCounts={},banks={},trials=[];
  for(const i of rows){levelCounts[i.cefr_level]=(levelCounts[i.cefr_level]||0)+1;banks[i.content_bank_id]??={count:0,levels:{}};banks[i.content_bank_id].count++;banks[i.content_bank_id].levels[i.cefr_level]=(banks[i.content_bank_id].levels[i.cefr_level]||0)+1}
  for(const level of ['B1','B2'])for(let seed=1;seed<=30;seed++){
   const args={filters:{family_ids:['conversation'],levels:[level]},targetDurationSeconds:600,seed},a=ContentRuntime.createSession({...args,selectedGameEngine:'CARDS'}),b=ContentRuntime.createSession({...args,selectedGameEngine:'WHEEL'}),next=ContentRuntime.createSession({...args,seed:seed+1,selectedGameEngine:'CARDS',recentItemIds:a.selected_item_ids});
   trials.push({level,seed,ids:a.selected_item_ids,seconds:a.selected_item_ids.reduce((n,id)=>n+ContentRuntime.itemById(id).estimated_duration_seconds,0),routeParity:JSON.stringify(a.selected_item_ids)===JSON.stringify(b.selected_item_ids),repeatNext:next.selected_item_ids.filter(id=>a.selected_item_ids.includes(id))});
  }
  return {count:rows.length,levelCounts,banks,trials,discussion:rows.filter(i=>ContentRuntime.answerPolicy(i).modelIsExample).length,canonical:rows.filter(i=>!ContentRuntime.answerPolicy(i).modelIsExample).length};
 });
 assert.equal(audit.count,690);assert.deepEqual(audit.levelCounts,{B2:537,B1:153});
 for(const t of audit.trials){assert.equal(new Set(t.ids).size,t.ids.length);assert.ok(t.seconds>=600&&t.seconds<640,'Duration respected '+t.level);assert.ok(t.routeParity);assert.deepEqual(t.repeatNext,[],'No immediate repeat with fresh cards available')}
 for(const level of ['B1','B2']){
  const eligible=await page.evaluate(level=>[...new Set(ContentRuntime.filterSource({family_ids:['conversation'],levels:[level]}).map(i=>i.content_bank_id))].sort(),level);
  const reached=await page.evaluate(ids=>[...new Set(ids.map(id=>ContentRuntime.itemById(id).content_bank_id))].sort(),audit.trials.filter(t=>t.level===level).flatMap(t=>t.ids));assert.deepEqual(reached,eligible,'No bank starved across 30 seeds '+level);
 }
 const scenarios=[{level:'B1',topics:['gesprek-repareren','samenvatten-bemiddelen']},{level:'B2',topics:['samenvatten-bemiddelen','overtuigen-onderhandelen']},{level:'B2',topics:['impliciete-boodschap','humor-ironie']}];
 audit.lessons=[];
 for(const trial of scenarios){
  await page.evaluate(()=>{ContentUI.clearEditing();ContentUI.open();ContentUI.setState({duration:600,engine:'CARDS'})});
  await page.locator('#practiceMix').click();assert.equal(await page.locator('#mixDifficulty').inputValue(),'all','New mixes must include conversation cards');
  const labels=await page.evaluate(topics=>topics.map(id=>DIGIBORD_CONTENT_CATALOG.families.flatMap(f=>f.topics).find(t=>t.id===id).label),trial.topics);
  for(const label of labels){const row=page.locator('.lesson-mix-option').filter({hasText:label});await row.locator('input').check();await row.locator('[data-mix-level]').selectOption(trial.level)}
  await page.locator('#mixName').fill('Lesproef '+trial.level);await page.locator('#lessonMixForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
  const ids=await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id));assert.equal(ids.length,7);assert.equal(await page.locator('#practiceStart').isEnabled(),true);
  const counts=await page.evaluate(ids=>Object.values(ids.reduce((a,id)=>{const t=ContentRuntime.itemById(id).topic;a[t]=(a[t]||0)+1;return a},{})),ids);assert.deepEqual(counts.sort(),[3,4]);
  await page.locator('.practice-facts summary').click();for(const label of labels)assert.ok((await page.locator('.practice-facts').innerText()).includes(label));
  await page.locator('#practiceForm [data-guidance=erk]').click();assert.equal(await page.locator('.guidance-status').innerText(),trial.level);assert.equal(await page.locator('.guidance-content details').count(),ids.length);await page.keyboard.press('Escape');
  await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-practice-engine=BOARD]:not([data-practice-variant])').click();assert.deepEqual(await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id)),ids,'Teacher routes preserve mixed lesson');await page.locator('.practice-engine:has(input[value=CARDS])').click();
  await page.screenshot({path:path.join(dir,'mix-'+trial.level+'.png')});
  await page.locator('#practiceStart').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),ids);await page.locator('#primaryGame').click();await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active');assert.equal(await page.evaluate(()=>APP.cardIndex),1);assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),ids);
  audit.lessons.push({...trial,ids});
 }
 // Editing keeps an explicitly chosen difficulty, including old saved choices.
 await page.evaluate(()=>{ContentUI.open();const s=ContentUI.selectionSpec();s.filter_spec.difficulty='midden';LessonUI.openMix(s)});assert.equal(await page.locator('#mixDifficulty').inputValue(),'midden');await page.keyboard.press('Escape');
 await page.evaluate(()=>{const s=ContentUI.selectionSpec();s.filter_spec.difficulty='basis';LessonUI.openMix(s)});assert.equal(await page.locator('#mixDifficulty').inputValue(),'basis');await page.keyboard.press('Escape');
 // An explicit all-topic mix cannot fit seven cards; make this visible before starting.
 await page.evaluate(()=>{const topics=DIGIBORD_CONTENT_CATALOG.families.find(f=>f.id==='conversation').topics;ContentUI.loadSelection({scope_clauses:topics.map(t=>({scope_id:t.id,content_family_id:'conversation',topic_ids:[t.id],cefr_levels:['B2']})),filter_spec:{difficulty:'all'}},{target_duration_seconds:600,organization_mode:'class',preferred_game_engine:'CARDS'})});
 assert.equal(await page.locator('#practiceStart').isDisabled(),true);assert.match(await page.locator('.practice-warning').innerText(),/meer tijd/);
 await page.evaluate(()=>{ContentUI.clearEditing();const filters={family_ids:['conversation']};ContentUI.launch(ContentRuntime.createSession({filters,targetDurationSeconds:ContentRuntime.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),selectedGameEngine:'CARDS'}))});
 const seen=new Set();for(let n=0;n<audit.count;n++){
  const id=await page.locator('#screen-game [data-content-item-id]').first().getAttribute('data-content-item-id');assert.ok(!seen.has(id));seen.add(id);const item=await page.evaluate(id=>ContentRuntime.itemById(id),id);
  assert.equal(await page.locator('#screen-game .content-prompt li').count(),3);assert.ok((await page.locator('#screen-game .content-situation').innerText()).includes(item.context));await page.locator('#contentCardReveal').click();assert.ok((await page.locator('#contentCardAnswer').innerText()).includes(item.model_answer));
  if(item.openness==='open')assert.match(await page.locator('#contentCardReveal').innerText(),/mogelijk antwoord/);
  if(n===320)await page.screenshot({path:path.join(dir,'card.png')});
  if(n+1<audit.count){await page.locator('#primaryGame').click();await page.waitForFunction(prev=>document.querySelector('#screen-game [data-content-item-id]')?.dataset.contentItemId!==prev,id)}
 }
 assert.equal(seen.size,690);audit.rendered=seen.size;
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:1000});await page.locator('#contentCardAnswer section:last-child p').scrollIntoViewIfNeeded();assert.ok(await page.locator('.card-work').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  assert.ok(await page.locator('#contentCardAnswer section:last-child p').evaluate(e=>{const r=e.getBoundingClientRect(),bar=document.querySelector('#primaryGame').closest('.gamebar').getBoundingClientRect();return r.bottom<=bar.top+1&&r.top>=0}));
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const engine of ['BOARD','WHEEL']){
  await page.evaluate(engine=>{APP.fixedRoll=1;settingsPatch({reducedMotion:true});ContentUI.launch(ContentRuntime.createSession({filters:{family_ids:['conversation'],levels:['B2']},targetDurationSeconds:600,selectedGameEngine:engine,seed:42}))},engine);
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));assert.ok(await page.locator('#taskDrawer').getAttribute('data-task-id'));await page.screenshot({path:path.join(dir,'board.png')})}
  else{const spun=new Set();for(let n=0;n<12;n++){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);spun.add(await page.locator('.na-wheel-result [data-content-item-id]').getAttribute('data-content-item-id'))}assert.equal(spun.size,7);await page.locator('.na-wheel-result details summary').click();assert.ok(await page.locator('.na-wheel-result li').evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).fontSize)>=18)));await page.screenshot({path:path.join(dir,'wheel.png')})}
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(audit,null,2)+'\n');
 console.log('PASS 690-card combined trial: all cards rendered, 60 seeded lessons, 3 UI mixes, both routes, guidance, resume, duration, cards/board/wheel and five screen sizes.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
