const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.LIVE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html');
 await page.goto(url);await page.waitForFunction(()=>window.CardShuffle&&window.LessonUI);
 const matrix=await page.evaluate(async()=>{
  const failures=[],rows=[];
  for(const route of DigiRoutes.routes)for(const family of ReleasePolicy.cardKinds){
   goScreen('cards');selectLevel(route.id);APP.tongueDifficulty='';const ids=cardsFor(family).map(c=>c.id);
   if(!ids.length){rows.push({route:route.id,family,count:0});continue}
   APP.cardShuffles={};APP.last=null;await prepareCards(family);const seen=new Set(),order=[];
   for(let i=0;i<ids.length;i++){
    const id=currentCard().id;order.push(id);if(seen.has(id)||!ids.includes(id))failures.push(family+route.id+':duplicate/invalid');seen.add(id);
    if(document.querySelector('[data-card-id]')?.dataset.cardId!==id)failures.push(family+':render');
    await nextCard();
   }
   if(seen.size!==ids.length)failures.push(family+':coverage');
   if(ids.length>1&&currentCard().id===order.at(-1))failures.push(family+':boundary');
   rows.push({route:route.id,family,count:seen.size,cycle:APP.cardShuffles[family].cycle});
  }
  return {rows,failures};
 });assert.deepEqual(matrix.failures,[]);assert.equal(matrix.rows.length,48);
 // Real UI route/filter switches keep all overlapping IDs and the pending queue.
 await page.evaluate(()=>{APP.cardShuffles={};goScreen('cards');selectLevel('A0_A1');prepareCards('tongue')});
 for(let i=0;i<12;i++)await page.locator('#primaryGame').click();
 const lower=await page.evaluate(()=>structuredClone(APP.cardShuffles.tongue));
 await page.locator('#levelSelect').selectOption('B2_C1');
 const higher=await page.evaluate(()=>APP.cardShuffles.tongue);
 assert.equal(higher.currentCardId,lower.currentCardId);assert.ok(lower.used.every(id=>higher.used.includes(id)));assert.equal(higher.eligible.length,240);assert.equal(higher.queue.length,240-higher.used.length);
 await page.locator('#levelSelect').selectOption('B1_B2');assert.deepEqual(await page.evaluate(()=>APP.cardShuffles.tongue.queue),higher.queue);
 await page.locator('#levelSelect').selectOption('A0_A1');assert.ok((await page.evaluate(()=>APP.cardShuffles.tongue.used)).length>=lower.used.length);
 await page.locator('#levelSelect').selectOption('B2_C1');await page.locator('#tongueDifficulty').selectOption('hard');
 assert.ok(lower.used.every(id=>higher.used.includes(id)));
 await page.locator('#tongueDifficulty').selectOption('');
 // Every family survives menu, reload and returning from a different family.
 for(const kind of await page.evaluate(()=>ReleasePolicy.cardKinds)){
  await page.evaluate(kind=>prepareCards(kind),kind);await page.locator('#primaryGame').click();
  const state=await page.evaluate(()=>({deck:APP.cardShuffles[APP.cardKind],id:currentCard().id,level:APP.level,turn:APP.turn,boards:APP.boardStates}));
  await page.evaluate(()=>goScreen('cards'));await page.locator('#cardMenuResume').click();
  await page.reload();await page.locator('#resumeBtn').click();
  assert.deepEqual(await page.evaluate(()=>({deck:APP.cardShuffles[APP.cardKind],id:currentCard().id,level:APP.level,turn:APP.turn,boards:APP.boardStates})),state,kind+' exact resume');
  await page.evaluate(other=>prepareCards(other),kind==='tongue'?'verbs':'tongue');await page.evaluate(kind=>prepareCards(kind),kind);
  assert.deepEqual(await page.evaluate(()=>APP.cardShuffles[APP.cardKind]),state.deck,kind+' family return');
 }
 // Manual reset is explicit, cancellable, scoped to one family and undoable.
 const all=await page.evaluate(()=>structuredClone(APP.cardShuffles));await page.locator('#cardOrderReset').click();await page.locator('#dialogClose').click();assert.deepEqual(await page.evaluate(()=>APP.cardShuffles),all);
 await page.locator('#cardOrderReset').click();await page.locator('#confirmCardOrderReset').click();
 const reset=await page.evaluate(()=>({kind:APP.cardKind,decks:APP.cardShuffles}));assert.equal(reset.decks[reset.kind].resetCount,all[reset.kind].resetCount+1);assert.equal(reset.decks[reset.kind].used.length,1);
 for(const k of Object.keys(all))if(k!==reset.kind)assert.deepEqual(reset.decks[k],all[k]);
 await page.locator('#undoAction').click();assert.deepEqual(await page.evaluate(()=>APP.cardShuffles),all);
 // Canonical between-lines selection: 19/31, separate from the archived C1 deck.
 for(const [route,count] of [['B1_B2',19],['B2_C1',31]]){
  await page.evaluate(route=>{const filters={bank_ids:['CB-BETWEEN-LINES-012'],levels:[route]};ContentUI.launch(ContentRuntime.createSession({filters,selectedGameEngine:'CARDS',targetDurationSeconds:ContentRuntime.filterSource(filters).reduce((n,c)=>n+c.estimated_duration_seconds,0),seed:9}))},route);
  assert.equal(await page.evaluate(()=>cardShuffleScope()),'between-lines');
  const audit=await page.evaluate(async()=>{selectShuffledCard('content-vert001',contentSessionCards(),'reset');startContentCards();const seen=new Set();for(let i=0;i<contentSessionCards().length;i++){seen.add(contentSessionCards()[APP.cardIndex].content_item_id);await nextCard()}return [...seen]});assert.equal(audit.length,count);
  await page.locator('#contentCardReveal').click();
  const state=await page.evaluate(async()=>{await LessonUI.flush();return {deck:structuredClone(APP.cardShuffles['between-lines']),index:APP.cardIndex,session:APP.contentSessionConfig,ids:contentSessionCards().map(c=>c.content_item_id)}});
  await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('.content-vert001-cards');
  assert.deepEqual(await page.evaluate(()=>({deck:APP.cardShuffles['between-lines'],index:APP.cardIndex,session:APP.contentSessionConfig,ids:contentSessionCards().map(c=>c.content_item_id)})),state);
  // IndexedDB resume after another family, not only localStorage.
  await page.evaluate(()=>prepareCards('tongue'));await page.evaluate(id=>LessonUI.handle('resume','recent-'+id),state.session.session_id);
  assert.deepEqual(await page.evaluate(()=>APP.cardShuffles['between-lines']),state.deck);
 }
 // Legacy current ID + unrelated state are preserved by the additive migration.
 await page.evaluate(()=>{ContentRuntime.clearSession();APP.cardShuffles={};APP.level='B2';APP.cardKind='tongue';APP.cardIndex=173;APP.tongueCardId=cardsFor('tongue')[173].id;APP.last={type:'card',title:'Tongbrekers',data:{kind:'tongue'}};save();localStorage.removeItem('taalroute-card-shuffle-v1-backup')});
 const legacy=await page.evaluate(()=>({raw:localStorage.getItem(STORE),id:APP.tongueCardId}));await page.reload();await page.locator('#resumeBtn').click();
 assert.equal(await page.evaluate(()=>currentCard().id),legacy.id);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('taalroute-card-shuffle-v1-backup')).values[STORE]),legacy.raw);
 // Frozen generic lessons also persist their shuffle through the existing progress adapter.
 await page.evaluate(()=>{ContentUI.setState({family:'grammar',topic:'ER',level:'B1_B2',engine:'CARDS',focus:'all',subtopic:'all',duration:600});ContentUI.start(33)});
 await page.locator('#primaryGame').click();const generic=await page.evaluate(async()=>{await LessonUI.flush();return {scope:cardShuffleScope(),deck:APP.cardShuffles[cardShuffleScope()],session:APP.contentSessionConfig}});
 await page.evaluate(()=>prepareCards('tongue'));await page.evaluate(id=>LessonUI.handle('resume','recent-'+id),generic.session.session_id);
 assert.deepEqual(await page.evaluate(()=>APP.cardShuffles[cardShuffleScope()]),generic.deck);
 // Public release selection still excludes revoked content and generic GUIDED.
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().length),6630);
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().filter(i=>DigiRoutes.classification(i).freePlayGate==='GUIDED').length),0);
 for(const width of [1920,390,320]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>{goScreen('cards');selectLevel('B2_C1');prepareCards('tongue')});
  const old=await page.evaluate(()=>currentCard().id);await page.locator('#primaryGame').click();assert.notEqual(await page.evaluate(()=>currentCard().id),old);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.ok(await page.locator('.tongue-text').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=36));
  await page.locator('#cardOrderReset').scrollIntoViewIfNeeded();assert.ok(await page.locator('#cardOrderReset').isVisible());
  if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'shuffle-'+width+'.png'),fullPage:true})}
 }
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>settingsPatch({reducedMotion:true}));
 await page.locator('#primaryGame').click();assert.equal(await page.evaluate(()=>cardBusy),false);
 await page.evaluate(()=>settingsPatch({reducedMotion:false}));await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy);
 await page.evaluate(()=>LessonUI.flush());assert.deepEqual(errors,[]);
 console.log(JSON.stringify({status:'PASS',matrix:matrix.rows,checks:'nine families; exact cycles; route/filter overlap; persisted queues; menu/reload/family/IndexedDB resume; scoped reset + undo; legacy backup; 19+31 between-lines; frozen generic lesson; release gates; desktop/mobile; OS and app reduced motion; animation'},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
