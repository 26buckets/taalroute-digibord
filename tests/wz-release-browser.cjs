const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.LIVE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
  await page.waitForFunction(()=>window.ContentUI&&window.WZReviewed);
  assert.equal(await page.evaluate(()=>ReleasePolicy.enabled),true);
  assert.deepEqual(await page.evaluate(()=>({all:ContentRuntime.availableForPreparation().length,free:ContentRuntime.filterSource().length,version:WZReviewed.version})),{all:11338,free:9578,version:'2026-10-03.wz.release.1'});
  await page.locator('[data-category=words]').click();assert.equal(await page.evaluate(()=>ContentUI.state().family),'grammar-guide');
  // Every approved item is projectable in the three shared games, using its real renderer.
  assert.deepEqual(await page.evaluate(()=>{
   const items=ContentRuntime.availableForPreparation().filter(i=>i.domain==='WORDS'),problems=[];
   for(const item of items)for(const game of ['CARDS','BOARD','WHEEL']){
    const p=ContentRuntime.project(game,item),el=document.createElement('div');el.innerHTML=contentPromptHtml(p.prompt);
    if(!el.textContent.trim()||!p.renderer||/undefined|\bfictie(?:f|ve)\b|\bbuur\b/i.test(el.textContent))problems.push(item.content_item_id+' '+game);
    if(item.answer_type==='open'&&p.answerPolicy.mode!=='teacher_or_peer_review')problems.push(item.content_item_id+' answer');
   }
   return {count:items.length,problems};
  }),{count:2698,problems:[]});
  // Verify the real selector, including each guided-only group and sparse groups.
  const groups=await page.evaluate(()=>[...new Map(ContentRuntime.availableForPreparation().filter(i=>i.domain==='WORDS'&&i.FreePlayGate==='GUIDED').map(i=>[i.topic+'|'+i['Nieuwe route']+'|'+i.Microconstructie,{topic:i.topic,level:DigiRoutes.classification(i).displayRoute,micro:i.Microconstructie}])).values()]);
  for(const group of groups){
   await page.evaluate(g=>{ContentUI.open({family:'words'});ContentUI.setState({topic:g.topic,level:g.level,engine:'CARDS',duration:180,difficulty:'all',focus:'all',subtopic:'all'});},group);
   assert.ok(await page.locator('[name=microconstructure]').count());
   await page.selectOption('[name=microconstructure]',group.micro);
   const detail=await page.evaluate(()=>({error:ContentUI.scopeError(),micro:ContentUI.selectionSpec().filter_spec.microconstructures,ids:ContentRuntime.selectionPool(ContentUI.selectionSpec()).map(i=>i.content_item_id),duration:ContentUI.state().duration,disabled:document.querySelector('#practiceStart').disabled}));
   assert.equal(detail.error,'');assert.deepEqual(detail.micro,[group.micro]);assert.ok(detail.ids.length);assert.equal(detail.disabled,false,JSON.stringify(group));
   assert.ok(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).every(i=>i.Microconstructie===ContentUI.state().microconstructure)));
  }
  for(const level of ['A0_A1','A1_A2','A2_B1'])for(const engine of ['CARDS','BOARD','WHEEL']){
   const session=await page.evaluate(({level,engine})=>{
    CONTENT_VERT001.stop();const spec=ContentRuntime.specFromFilters({family_ids:['words'],levels:[level]});
    ContentUI.loadSelection(spec,{target_duration_seconds:180,organization_mode:'class',preferred_game_engine:engine,preferred_game_variant:engine==='BOARD'?'rotterdam':null});
    return ContentUI.start(731);
   },{level,engine});
   assert.ok(session,level+' '+engine);assert.ok(session.selected_item_ids.length);
   assert.ok(await page.evaluate(()=>ContentRuntime.enginePool(APP.contentSessionConfig.selected_game_engine,APP.contentSessionConfig).every(i=>i.FreePlayGate==='FREE')));
   if(engine==='CARDS'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy)}
   const before=await page.evaluate(async()=>{await LessonUI.flush();return {session:APP.contentSessionConfig,index:APP.cardIndex}});
   await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active');
   assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex})),before);
  }
  // Guided selection is kept in both the saved draft and the session across reload.
  await page.evaluate(g=>{CONTENT_VERT001.stop();ContentUI.open({family:'words'});ContentUI.setState({topic:g.topic,level:g.level,engine:'CARDS',duration:60,difficulty:'all',focus:'all'});ContentUI.setState({microconstructure:g.micro});},groups[0]);
  await page.locator('#practiceStart').click();const guided=await page.evaluate(async()=>{await LessonUI.flush();return APP.contentSessionConfig});
  assert.deepEqual(guided.normalized_selection_spec.filter_spec.microconstructures,[groups[0].micro]);
  await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig),guided);
  await page.evaluate(()=>{ContentUI.open({family:'grammar'});ContentUI.setState({topic:'ER',level:'B1_B2',difficulty:'all',subtopic:'all',focus:'all'})});
  assert.equal(await page.evaluate(()=>ContentUI.scopeError()),'','Switching from a short WZ lesson restores a valid grammar duration');
  await page.evaluate(s=>ContentUI.loadSelection(s.normalized_selection_spec,{target_duration_seconds:60,organization_mode:'class',preferred_game_engine:'CARDS'}),guided);
  assert.equal(await page.locator('[name=duration]').inputValue(),'60','Short saved WZ lesson remains available after another family');
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});await page.locator('[data-main=practice]').click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.ok(await page.locator('.beta-label').isVisible());
   if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'wz-voorbereiding-'+width+'.png'),fullPage:true})}
  }
  assert.deepEqual(errors,[]);console.log('PASS WZ browser: 2698 tasks / 8094 projections; every guided choice, sparse groups, 9 game routes, exact reload/resume and mobile preparation.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
