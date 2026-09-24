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
 assert.equal(await page.locator('[data-category=words]').isVisible(),false);
 assert.match(await page.evaluate(()=>{const prior=ContentRuntime.banks().find(b=>b.bank.bank_id==='CB-GRAM-001').previousVersions[0].items[0];try{ContentRuntime.validateContentRefs([ContentRuntime.contentRef(prior)],{historical:true});return ''}catch(e){return e.message}}),/nagekeken/,'Unreviewed historical text cannot reopen through an approved bank ID');
 // All legacy entry points must lead to reviewed preparation or leave state intact.
 for(const code of ['startWords("build")','startWZ()','startTaalworp("SET_A2_BASIS")','startStory("basis")','startTongue()','startC1()']){
  const before=await page.evaluate(()=>JSON.stringify(APP));await page.evaluate(code);assert.equal(await page.evaluate(()=>JSON.stringify(APP)),before,code);
 }
 for(const screen of ['cards','dice','workforms','activities','words','collection','mycollection']){await page.evaluate(id=>goScreen(id),screen);assert.ok(await page.locator('#screen-practice.active').isVisible(),screen)}
 for(const board of ['rotterdam','zwolle']){await page.evaluate(b=>{CONTENT_VERT001.stop();APP.questionMode='conversation';startBoard(b)},board);assert.ok(await page.locator('#screen-practice.active').isVisible());assert.equal(await page.evaluate(()=>ContentUI.state().variant),board)}
 await page.evaluate(()=>ContentUI.setState({family:'grammar',topic:'ER',level:'B1',engine:'CARDS',focus:'all',subtopic:'all',duration:180}));
 await page.locator('#practiceMix').click();assert.equal(await page.locator('.lesson-mix-option').count(),9);await page.locator('#dialogClose').click();
 for(const filter of [{bank_ids:['CB-WZ-002']},{family_ids:['words']},{topics:['ER','RELATIEVE_BIJZIN']}]){
  assert.notEqual(await page.evaluate(f=>{try{ContentRuntime.filterSource(f);return ''}catch(e){return e.message}},filter),'');
 }
 // Each approved family renders and resumes in each suitable common game.
 for(const family of ['grammar','quick'])for(const engine of ['CARDS','BOARD','WHEEL']){
  await page.evaluate(({family,engine})=>{CONTENT_VERT001.stop();ContentUI.setState({family,topic:family==='grammar'?'ER':'quick-arrange',level:family==='grammar'?'B1':'B2',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:180,engine,variant:engine==='BOARD'?'rotterdam':null});ContentUI.start(41)}, {family,engine});
  assert.ok(await page.locator('#screen-game.active').isVisible());const old=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs}));
  await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active');assert.deepEqual(await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs})),old);
 }
 // A previous unreviewed session stays stored but cannot resume in the released view.
 const archive=await browser.newContext();await archive.addInitScript(()=>{window.DigiBordArchiveReview=true});const ap=await archive.newPage();await ap.goto(url);
 const saved=await ap.evaluate(async()=>{const item=ContentRuntime.items().find(i=>i.content_bank_id==='CB-WZ-002');const session=ContentRuntime.createSession({filters:{bank_ids:[item.content_bank_id],topics:[item.topic],levels:[item.cefr_level]},engines:['CARDS'],selectedGameEngine:'CARDS',targetDurationSeconds:180});ContentUI.launch(session);await LessonUI.flush();return {session:APP.contentSessionConfig,boards:APP.boardStates};});
 const storageState=await archive.storageState({indexedDB:true});const live=await browser.newContext({storageState});const lp=await live.newPage();await lp.goto(url);await lp.waitForFunction(()=>window.LessonUI);
 assert.deepEqual(await lp.evaluate(()=>({session:APP.contentSessionConfig,boards:APP.boardStates})),saved);
 assert.equal(await lp.locator('#resumeBtn').isVisible(),false);assert.ok(await lp.evaluate(()=>contentRestoreError.message.includes('nagekeken')));
 await lp.evaluate(()=>{goScreen('lessons');return LessonUI.render()});await lp.waitForSelector('#lessonLibrary h1');assert.equal(await lp.locator('[data-lesson-action=resume]').count(),0);
 assert.equal(await lp.evaluate(async()=>(await LessonUI.service.list('recent_session')).length),1,'Hidden session not deleted');
 assert.deepEqual(errors,[]);console.log('PASS: 4061 approved, 4353 retained/hidden; legacy routes, catalog, mixes, six live game/resume routes, old IndexedDB preserved/hidden.');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
