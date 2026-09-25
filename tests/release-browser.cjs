// Published view: no archive-test flag. Archive sources remain covered by the old suites.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/index.html`,browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.ContentUI&&window.LessonUI);
 assert.equal(await page.evaluate(()=>ReleasePolicy.enabled),true);
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().length),4061);
 assert.equal(await page.evaluate(()=>ContentRuntime.items().length),8414,'Unreviewed sources retained');
 assert.deepEqual(await page.evaluate(()=>DIGIBORD_CONTENT_CATALOG.families.map(f=>f.id)),['grammar','quick']);
 assert.deepEqual(await page.evaluate(()=>DIGIBORD_CONTENT_CATALOG.families[0].topics.map(t=>t.id)),['ER','ZULLEN','ZOUDEN','MODAAL']);
 assert.equal(await page.locator('[data-category=words]').isVisible(),true);
 assert.equal(await page.locator('[data-category=words]').isDisabled(),true);
 assert.match(await page.locator('[data-category=words]').innerText(),/Binnenkort/);
 assert.equal(await page.locator('[data-category=words]').evaluate(e=>getComputedStyle(e).filter),'grayscale(1)');
 assert.equal(await page.locator('[data-category=words] .arrowbubble').isVisible(),false);
 assert.doesNotMatch(await page.locator('body').innerText(),/nog niet (?:volledig )?nagekeken/i);
 assert.equal(await page.locator('.gamecard-live').isVisible(),true);
 assert.equal(await page.locator('.gamecard-live').isDisabled(),true);
 assert.equal(await page.locator('#resumeBtn').isVisible(),true);
 assert.equal(await page.locator('#resumeBtn').isDisabled(),true);
 for(const width of [1440,900,720,700,650,390,320]){
  await page.setViewportSize({width,height:1000});
  const nav=await page.locator('.mainnav .navitem').evaluateAll(es=>es.map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,right:r.right,font:parseFloat(getComputedStyle(el).fontSize)}}));
  const cover=await page.locator('[data-category=words]').boundingBox(),badge=await page.locator('#words-status').boundingBox();
  assert.ok(badge&&badge.x>=cover.x&&badge.x+badge.width<=cover.x+cover.width&&badge.y>=cover.y&&badge.y+badge.height<=cover.y+cover.height,'Soon label remains inside the cover at '+width);
  if(width===1440){fs.mkdirSync(path.join(root,'tests/artifacts/release'),{recursive:true});await page.locator('[data-category=words]').screenshot({path:path.join(root,'tests/artifacts/release/woorden-binnenkort.png')});}
  assert.equal(nav.length,4);assert.ok(nav.every(r=>r.width>=44&&r.height>=44&&r.left>=0&&r.right<=width&&r.font>=12),`Navigation visible at ${width}: ${JSON.stringify(nav)}`);
 }
 await page.locator('[data-main=lessons]').click();await page.waitForSelector('#lessonLibrary h1');
 await page.locator('[data-main=mycollection]').click();assert.ok(await page.locator('#screen-mycollection.active').isVisible());
 assert.equal(await page.locator('#collectionStorySets').isVisible(),false);assert.ok(await page.locator('#screen-mycollection [data-open-settings]').isVisible());
 await page.locator('#screen-mycollection [data-open-settings]').click();await page.waitForSelector('#settingsOverlay.open');await page.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();
 await page.setViewportSize({width:1440,height:1000});
 assert.match(await page.evaluate(()=>{const prior=ContentRuntime.banks().find(b=>b.bank.bank_id==='CB-GRAM-001').previousVersions[0].items[0];try{ContentRuntime.validateContentRefs([ContentRuntime.contentRef(prior)],{historical:true});return ''}catch(e){return e.message}}),/niet beschikbaar/,'Unreviewed historical text cannot reopen through an approved bank ID');
 // All legacy entry points must lead to reviewed preparation or leave state intact.
 for(const code of ['startWords("build")','startWZ()','startTaalworp("SET_A2_BASIS")','startStory("basis")','startTongue()','startC1()']){
  const before=await page.evaluate(()=>JSON.stringify(APP));await page.evaluate(code);assert.equal(await page.evaluate(()=>JSON.stringify(APP)),before,code);
 }
 for(const screen of ['cards','dice','workforms','activities','words','collection']){await page.evaluate(id=>goScreen(id),screen);assert.ok(await page.locator('#screen-practice.active').isVisible(),screen)}
 for(const board of ['rotterdam','zwolle']){await page.evaluate(b=>{CONTENT_VERT001.stop();APP.questionMode='conversation';startBoard(b)},board);assert.ok(await page.locator('#screen-practice.active').isVisible());assert.equal(await page.evaluate(()=>ContentUI.state().variant),board)}
 await page.evaluate(()=>ContentUI.setState({family:'grammar',topic:'ER',level:'B1',engine:'CARDS',focus:'all',subtopic:'all',duration:180}));
 await page.locator('#practiceMix').click();assert.equal(await page.locator('.lesson-mix-option').count(),9);await page.locator('#dialogClose').click();
 for(const filter of [{bank_ids:['CB-WZ-002']},{family_ids:['words']},{topics:['ER','RELATIEVE_BIJZIN']}]){
  assert.notEqual(await page.evaluate(f=>{try{ContentRuntime.filterSource(f);return ''}catch(e){return e.message}},filter),'');
 }
 // Each approved family renders and resumes in each suitable common game.
 for(const family of ['grammar','quick'])for(const engine of ['CARDS','BOARD','WHEEL']){
  await page.evaluate(({family,engine})=>{CONTENT_VERT001.stop();ContentUI.setState({family,topic:family==='grammar'?'ER':'quick-arrange',level:family==='grammar'?'B1':'B2',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:180,engine,variant:engine==='BOARD'?'rotterdam':null});ContentUI.start(41)}, {family,engine});
  if(engine==='BOARD'){
   for(const width of [1440,900,390]){
    await page.setViewportSize({width,height:900});
    const buttons=await page.locator('.board-game .right-actions .game-action').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,left:r.left,right:r.right,bottom:r.bottom,font:getComputedStyle(e).fontSize}}));
    assert.equal(buttons.length,3);assert.ok(buttons.every(b=>b.h>=44&&Math.abs(b.w-buttons[0].w)<1&&b.h===buttons[0].h&&b.left>=0&&b.right<=width&&b.bottom<=900&&b.font==='12px'),'Uniform board actions '+width);
    await page.locator('[data-goptions]').click();await page.locator('#boardOptions.open').waitFor();
    assert.equal(await page.locator('#boardOptions').evaluate(e=>getComputedStyle(e).fontSize),'15px');
    assert.ok(await page.locator('#boardOptions').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Options fit '+width);
    assert.deepEqual(await page.locator('.board-settings-heading').allTextContents(),['Spelen','Beeld en geluid','Nieuwe ronde']);
    if(family==='grammar')await page.screenshot({path:path.join(root,'tests/artifacts/release/board-options-'+width+'.png')});
    await page.locator('#closeBoardOptions').click();
   }
   await page.setViewportSize({width:1440,height:1000});
  }
  assert.ok(await page.locator('#screen-game.active').isVisible());const old=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs}));
  await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active');assert.deepEqual(await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs})),old);
 }
 // A previous unreviewed session stays stored but cannot resume in the released view.
 const archive=await browser.newContext();await archive.addInitScript(()=>{window.DigiBordArchiveReview=true});const ap=await archive.newPage();await ap.goto(url);
 const saved=await ap.evaluate(async()=>{const item=ContentRuntime.items().find(i=>i.content_bank_id==='CB-WZ-002');const session=ContentRuntime.createSession({filters:{bank_ids:[item.content_bank_id],topics:[item.topic],levels:[item.cefr_level]},engines:['CARDS'],selectedGameEngine:'CARDS',targetDurationSeconds:180});ContentUI.launch(session);await LessonUI.flush();return {session:APP.contentSessionConfig,boards:APP.boardStates};});
 const storageState=await archive.storageState({indexedDB:true});const live=await browser.newContext({storageState});const lp=await live.newPage();await lp.goto(url);await lp.waitForFunction(()=>window.LessonUI);
 assert.deepEqual(await lp.evaluate(()=>({session:APP.contentSessionConfig,boards:APP.boardStates})),saved);
 assert.equal(await lp.locator('#resumeBtn').isVisible(),true);assert.equal(await lp.locator('#resumeBtn').isDisabled(),true);assert.match(await lp.locator('#resumeText').innerText(),/bewaard/);assert.ok(await lp.evaluate(()=>contentRestoreError.message.includes('niet beschikbaar')));
 await lp.evaluate(()=>{goScreen('lessons');return LessonUI.render()});await lp.waitForSelector('#lessonLibrary h1');assert.equal(await lp.locator('[data-lesson-action=resume]').count(),0);
 assert.equal(await lp.evaluate(async()=>(await LessonUI.service.list('recent_session')).length),1,'Hidden session not deleted');
 assert.deepEqual(errors,[]);console.log('PASS: 4061 approved, 4353 retained/hidden; legacy routes, catalog, mixes, six live game/resume routes, old IndexedDB preserved/hidden.');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
