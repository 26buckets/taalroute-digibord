// Published view: no archive-test flag. Archive sources remain covered by the old suites.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/index.html`,browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'#kaartspellen');await page.waitForFunction(()=>window.ContentUI&&window.LessonUI);
 assert.deepEqual(await page.locator('#screen-cards.active [data-card-family]').evaluateAll(es=>es.map(e=>e.dataset.cardFamily)),['grammar','quick'],'Direct card link waits for both registered families');await page.locator('#cardMenuHome').click();await page.evaluate(()=>history.replaceState(null,'',location.pathname));
 assert.equal(await page.evaluate(()=>ReleasePolicy.enabled),true);
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().length),4061);
 assert.equal(await page.evaluate(()=>ContentRuntime.items().length),8414,'Unreviewed sources retained');
 // Lesson help is tied to the released items; review metadata stays internal.
 assert.deepEqual(await page.evaluate(()=>Object.fromEntries(['lowan','erk','f','bow'].map(key=>[key,ContentGuidance.summarize(ContentRuntime.filterSource(),key).known.length]))),{lowan:4061,erk:4061,f:4061,bow:4061});
 const guidanceAudit=await page.evaluate(()=>{
  const items=ContentRuntime.filterSource(),failures=[];
  for(let start=0;start<items.length;start+=120)for(const key of ['erk','bow']){
   ContentGuidance.open(items.slice(start,start+120),key,document.querySelector('[data-main=practice]'));
   const text=document.querySelector('.guidance-content').textContent;
   if(/beoordeling van \d+ bestaande|2026-\d\d-\d\d|GRAM_REV|bronlabel|redactioneel|A3f/.test(text))failures.push({start,key,match:text.match(/.{0,90}(?:beoordeling van \d+ bestaande|2026-\d\d-\d\d|GRAM_REV|bronlabel|redactioneel|A3f).{0,150}/g)});
  }
  document.querySelector('#gameDialog').close();return failures;
 });
 assert.deepEqual(guidanceAudit,[],'No internal review text in guidance for any of the 4061 released exercises');
 fs.mkdirSync(path.join(root,'tests/artifacts/release'),{recursive:true});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const key of ['lowan','erk','f','bow']){
   await page.evaluate(key=>ContentGuidance.open(ContentRuntime.filterSource().filter(i=>i.domain==='QUICK').slice(0,14),key,document.querySelector('[data-main=practice]')),key);
   await page.locator('.guidance-content details').evaluateAll(ds=>ds.forEach(d=>d.open=true));
   const text=await page.locator('.guidance-content').innerText();
   assert.doesNotMatch(text,/beoordeling van \d+ bestaande|2026-|snelvragen\.\d|bronlabel|redactioneel|A3f/);
   assert.ok(await page.locator('.guidance-facts').count(),'Selected lesson has readable information rows: '+key);
   assert.ok(await page.locator('.guidance-content').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'No clipped text '+key+' '+width);
   await page.screenshot({path:path.join(root,`tests/artifacts/release/lesuitleg-${key}-${width}.png`)});
   await page.keyboard.press('Escape');
  }
 }
 await page.setViewportSize({width:1440,height:1000});
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
 for(const width of [1920,1440,1100,1024,900,720,700,650,390,320]){
  await page.setViewportSize({width,height:1000});
  let positions;
  for(const screen of ['play','practice','lessons','mycollection']){
   await page.locator(`[data-main=${screen}]`).click();
   const current=await page.locator('.mainnav .navitem').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(n=>Math.round(n*10)/10)}));
   if(positions)assert.deepEqual(current,positions,'Header stays fixed on '+screen+' at '+width);else positions=current;
   if(['practice','lessons'].includes(screen))assert.equal(await page.locator('#levelSelect').isVisible(),false,'Hidden level control remains unavailable');
  }
  await page.locator('[data-main=play]').click();
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
 for(const screen of ['dice','workforms','activities','words','collection']){await page.evaluate(id=>goScreen(id),screen);assert.ok(await page.locator('#screen-practice.active').isVisible(),screen)}
 for(const board of ['rotterdam','zwolle']){await page.evaluate(b=>{CONTENT_VERT001.stop();APP.questionMode='conversation';startBoard(b)},board);assert.ok(await page.locator('#screen-practice.active').isVisible());assert.equal(await page.evaluate(()=>ContentUI.state().variant),board)}
 await page.evaluate(()=>ContentUI.setState({family:'grammar',topic:'ER',level:'B1',engine:'CARDS',focus:'all',subtopic:'all',duration:180}));
 await page.locator('#practiceMix').click();assert.equal(await page.locator('.lesson-mix-option').count(),9);await page.locator('#dialogClose').click();
 for(const filter of [{bank_ids:['CB-WZ-002']},{family_ids:['words']},{topics:['ER','RELATIEVE_BIJZIN']}]){
  assert.notEqual(await page.evaluate(f=>{try{ContentRuntime.filterSource(f);return ''}catch(e){return e.message}},filter),'');
 }
 // Restored card menu exposes only approved families; upcoming cards cannot launch.
 await page.locator('[data-main=play]').click();await page.locator('[data-category=cards]').click();
 assert.ok(await page.locator('#screen-cards.active').isVisible());
 assert.deepEqual(await page.locator('[data-card-family]').evaluateAll(es=>es.map(e=>e.dataset.cardFamily)),['grammar','quick']);
 assert.equal(await page.locator('[data-card-soon]').count(),9);
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  assert.ok(await page.locator('#screen-cards').evaluate(e=>e.scrollWidth<=e.clientWidth),'Menu fits '+width);
  assert.ok(await page.locator('.card-menu-choice').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.height>=44&&r.left>=0&&r.right<=innerWidth&&e.scrollWidth<=e.clientWidth})),'Readable choices '+width);
  assert.ok(await page.locator('[data-card-soon]').evaluateAll(es=>es.every(e=>e.disabled&&e.textContent.includes('Binnenkort')&&getComputedStyle(e).filter==='grayscale(1)')));
  if(width===1440||width===390)await page.screenshot({path:path.join(root,`tests/artifacts/release/kaartspelmenu-${width}.png`)});
 }
 const unchanged=await page.evaluate(()=>JSON.stringify(APP));await page.locator('[data-card-soon]').evaluateAll(es=>es.forEach(e=>e.click()));assert.equal(await page.evaluate(()=>JSON.stringify(APP)),unchanged);
 assert.doesNotMatch(await page.locator('#screen-cards').innerText(),/nagekeken|review|bronlabel|Werkend/);
 for(const family of ['grammar','quick']){
  await page.locator(`[data-card-family=${family}]`).click();assert.ok(await page.locator('#screen-practice.active').isVisible());
  assert.equal(await page.evaluate(()=>ContentUI.state().family),family);assert.equal(await page.evaluate(()=>ContentUI.state().engine),'CARDS');
  await page.evaluate(()=>goScreen('cards'));
 }
 await page.setViewportSize({width:1440,height:1000});
 // Each approved family renders and resumes in each suitable common game.
 for(const family of ['grammar','quick'])for(const engine of ['CARDS','BOARD','WHEEL']){
  await page.evaluate(({family,engine})=>{CONTENT_VERT001.stop();ContentUI.setState({family,topic:family==='grammar'?'ER':'quick-arrange',level:family==='grammar'?'B1':'B2',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:180,engine,variant:engine==='BOARD'?'rotterdam':null});ContentUI.start(41)}, {family,engine});
  if(engine==='CARDS'){
   await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy);
   const progress=await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex,turn:APP.turn}));
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:900});
    await page.locator('#contentCardMenu').scrollIntoViewIfNeeded();
    assert.ok(await page.locator('#contentCardMenu').evaluate(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth}));
    await page.locator('#contentCardMenu').click();await page.locator('#cardMenuResume').click();
    assert.ok(await page.locator('#screen-game.active').isVisible());
    assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex,turn:APP.turn})),progress,'Menu does not reset the active lesson');
   }
   await page.setViewportSize({width:1440,height:1000});
  }
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
   await page.evaluate(()=>{APP.fixedRoll=1;settingsPatch({reducedMotion:true})});await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));
   for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});const done=page.getByRole('button',{name:'Verder en gooien',exact:true});
    assert.equal(await done.getAttribute('aria-keyshortcuts'),'Space');assert.equal(await done.locator('kbd').innerText(),'Spatie');
    await done.scrollIntoViewIfNeeded();assert.ok(await done.evaluate(e=>{const r=e.getBoundingClientRect();return r.height>=44&&r.left>=0&&r.right<=innerWidth&&e.scrollWidth<=e.clientWidth+1}),'Continue button fits '+width);
    if(family==='grammar')await page.screenshot({path:path.join(root,'tests/artifacts/release/verder-gooien-'+width+'.png')});
   }
   await page.locator('#taskDone').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));
   await page.locator('#taskDone').press('Space');await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));
   await page.setViewportSize({width:1440,height:1000});
  }
  assert.ok(await page.locator('#screen-game.active').isVisible());const old=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs}));
  await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active');assert.deepEqual(await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs})),old);
 }
 // Shared cards reuse the existing draw/slide/turn animation and its motion preferences.
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(const family of ['grammar','quick'])for(const effect of ['draw','slide','turn']){
  await page.evaluate(({family,effect})=>{CONTENT_VERT001.stop();settingsPatch({reducedMotion:false,cardAnimation:effect});ContentUI.setState({family,topic:family==='grammar'?'ER':'quick-arrange',level:'B1',engine:'CARDS',variant:null,focus:'all',subtopic:'all',duration:180});ContentUI.start(41)}, {family,effect});
  const before=await page.evaluate(()=>APP.cardIndex);
  const motion=await page.evaluate(()=>{
   document.querySelector('#contentCardDeck').click();
   const card=document.querySelector('.game-card-motion'),animation=card.getAnimations()[0];
   if(!animation)return null;
   animation.pause();animation.currentTime=animation.effect.getTiming().duration*.2;
   const index=APP.cardIndex;document.querySelector('#primaryGame').click();nextCard();
   return {index,afterRepeat:APP.cardIndex,busy:cardBusy,disabled:document.querySelector('#primaryGame').disabled,frames:animation.effect.getKeyframes().map(f=>f.transform),backface:getComputedStyle(card.querySelector('.game-card-back')).backfaceVisibility};
  });
  assert.ok(motion,'A real card animation runs: '+family+' '+effect);
  assert.equal(motion.index,before+1);assert.equal(motion.afterRepeat,motion.index,'Rapid input cannot skip a card');
  assert.equal(motion.busy,true);assert.equal(motion.disabled,true);assert.equal(motion.backface,'hidden');
  assert.ok(motion.frames.some(f=>f!=='none'),'Card moves');
  if(family==='grammar'&&effect==='draw')await page.screenshot({path:path.join(root,'tests/artifacts/release/kaart-in-beweging.png')});
  await page.evaluate(()=>document.querySelector('.game-card-motion').getAnimations()[0].finish());
  await page.waitForFunction(()=>!cardBusy);
  assert.equal(await page.locator('#primaryGame').isEnabled(),true);
  assert.equal(await page.locator('#contentCardAnswer').isVisible(),false);
  assert.equal(await page.locator('.game-card-motion').evaluate(e=>getComputedStyle(e).transform),'none');
 }
 await page.screenshot({path:path.join(root,'tests/artifacts/release/kaart-geopend.png')});
 const savedCard=await page.evaluate(async()=>{await LessonUI.flush();return {index:APP.cardIndex,id:document.querySelector('[data-content-item-id]').dataset.contentItemId}});
 await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('#screen-game.active [data-content-item-id]');
 assert.deepEqual(await page.evaluate(()=>({index:APP.cardIndex,id:document.querySelector('[data-content-item-id]').dataset.contentItemId})),savedCard,'Resume keeps the animated card');
 for(const pref of [{os:'reduce',app:false},{os:'no-preference',app:true}]){
  await page.emulateMedia({reducedMotion:pref.os});await page.evaluate(app=>settingsPatch({reducedMotion:app}),pref.app);
  assert.equal(await page.evaluate(async()=>{const before=APP.cardIndex;await nextCard();return APP.cardIndex===(before+1)%contentSessionCards().length&&!cardBusy&&document.querySelector('.game-card-motion').getAnimations().length===0}),true,'Reduced motion skips animation: '+JSON.stringify(pref));
 }
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:900});
 await page.evaluate(()=>settingsPatch({reducedMotion:false,cardAnimation:'draw'}));
 assert.equal(await page.locator('#contentCardDeck').isVisible(),false);
 await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy);
 assert.equal(await page.locator('#primaryGame').isEnabled(),true,'Mobile draw works without a visible deck');
 await page.setViewportSize({width:1440,height:1000});
 // A previous unreviewed session stays stored but cannot resume in the released view.
 const archive=await browser.newContext();await archive.addInitScript(()=>{window.DigiBordArchiveReview=true});const ap=await archive.newPage();await ap.goto(url);
 // Archived editable cards still retain drafts through the shared next-card path.
 assert.equal(await ap.evaluate(async()=>{
  settingsPatch({reducedMotion:true});
  ContentUI.launch(ContentRuntime.createSession({filters:{bank_ids:['CB-MR03-013']},selectedGameEngine:'CARDS',targetDurationSeconds:2160,seed:8}));
  APP.cardIndex=contentSessionCards().findIndex(i=>i.content_item_id.endsWith('009'));startContentCards();
  const field=document.querySelector('#screen-game textarea');field.value='Mijn bewaarde antwoord';field.dispatchEvent(new Event('input',{bubbles:true}));
  await nextCard();await nextCard(-1);
  return document.querySelector('#screen-game textarea').value==='Mijn bewaarde antwoord';
 }),true,'Archived draft survives next and previous card');
 const saved=await ap.evaluate(async()=>{const item=ContentRuntime.items().find(i=>i.content_bank_id==='CB-WZ-002');const session=ContentRuntime.createSession({filters:{bank_ids:[item.content_bank_id],topics:[item.topic],levels:[item.cefr_level]},engines:['CARDS'],selectedGameEngine:'CARDS',targetDurationSeconds:180});ContentUI.launch(session);await LessonUI.flush();return {session:APP.contentSessionConfig,boards:APP.boardStates};});
 const storageState=await archive.storageState({indexedDB:true});const live=await browser.newContext({storageState});const lp=await live.newPage();await lp.goto(url);await lp.waitForFunction(()=>window.LessonUI);
 assert.deepEqual(await lp.evaluate(()=>({session:APP.contentSessionConfig,boards:APP.boardStates})),saved);
 assert.equal(await lp.locator('#resumeBtn').isVisible(),true);assert.equal(await lp.locator('#resumeBtn').isDisabled(),true);assert.match(await lp.locator('#resumeText').innerText(),/bewaard/);assert.ok(await lp.evaluate(()=>contentRestoreError.message.includes('niet beschikbaar')));
 await lp.evaluate(()=>{goScreen('lessons');return LessonUI.render()});await lp.waitForSelector('#lessonLibrary h1');assert.equal(await lp.locator('[data-lesson-action=resume]').count(),0);
 assert.equal(await lp.evaluate(async()=>(await LessonUI.service.list('recent_session')).length),2,'Both hidden sessions remain stored');
 assert.deepEqual(errors,[]);console.log('PASS: 4061 approved, 4353 retained/hidden; legacy routes, catalog, mixes, six live game/resume routes, old IndexedDB preserved/hidden.');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
