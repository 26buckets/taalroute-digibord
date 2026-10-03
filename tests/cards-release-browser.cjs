const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.SCREENSHOT_DIR;
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'file://'+path.join(root,process.env.BUILD_SMOKE?'dist/index.html':'index.html'));
 await page.waitForFunction(()=>window.LessonUI&&window.ContentUI);
 assert.equal(await page.evaluate(()=>ReleasePolicy.enabled),true);
 await page.locator('[data-category=cards]').click();
 assert.equal(await page.locator('#screen-cards [data-cardgame]').count(),9);
 assert.equal(await page.locator('#screen-cards [data-cardgame]:disabled').count(),1);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  assert.ok(await page.locator('.card-menu-choice').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth&&e.getBoundingClientRect().height>=44&&e.getBoundingClientRect().right<=innerWidth)));
  if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,`kaartmenu-${width}.png`),fullPage:true})}
 }
 await page.setViewportSize({width:1440,height:900});
 // Route counts and empty choices update without entering a game or resetting the route.
 for(const [level,verbs,between] of [['A0_A1',5,0],['A1_A2',12,0],['A2_B1',7,0],['B1_B2',6,19],['B2_C1',10,31]]){
  await page.locator('#levelSelect').selectOption(level);
  assert.equal(await page.locator('[data-cardgame="verbs"] .card-menu-count').innerText(),verbs+' kaarten');
  assert.equal(await page.locator('[data-cardgame="c1-between-lines"]').isDisabled(),between===0);
  if(between)assert.equal(await page.locator('[data-cardgame="c1-between-lines"] .card-menu-count').innerText(),between+' kaarten');
 }
 await page.locator('#levelSelect').selectOption('B2_C1');await page.locator('[data-cardgame="c1-between-lines"]').click();
 assert.equal(await page.evaluate(()=>ContentUI.state().level),'B2_C1');
 await page.evaluate(()=>{APP.level='A2';goScreen('cards')});
 for(const [width,height] of [[1440,900],[1366,768],[390,844]]){
  await page.setViewportSize({width,height});
  for(const [kind,title] of [['verbs','Al vertrokken'],['conversation','Wachten zonder ergernis'],['story','Een lekke gieter']]){
   await page.evaluate(({kind,title})=>{APP.level='A2';APP.cardIndex=cardsFor(kind).findIndex(c=>c.title===title);APP.cardShuffles={};APP.last={type:'card',data:{kind:kind}};startCards(kind)},{kind,title});
   assert.equal(await page.locator('.card-activity-heading span').innerText(),'7 kaarten');
   assert.equal(await page.locator('#cardSupport').isVisible(),false);
   if(kind==='verbs'){assert.deepEqual(await page.locator('.card-word-choice').allTextContents(),['heeft','is']);assert.ok(await page.locator('.card-focus').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=30))}
   if(kind==='story'){assert.deepEqual(await page.locator('.card-story-words strong').allTextContents(),['vrijwilliger','buurttuin','gieter']);assert.equal(await page.locator('.card-story-words img,.card-story-words svg').count(),3);assert.equal(await page.locator('#cardRevealed').isVisible(),false)}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(out)await page.screenshot({path:path.join(out,`kaart-${kind}-${width}.png`),fullPage:true});
  }
 }
 await page.setViewportSize({width:1440,height:900});
 // Leave a prepared lesson intact when playing standalone cards.
 await page.evaluate(()=>{ContentUI.setState({family:'grammar',topic:'ER',level:'B1',engine:'CARDS',focus:'all',subtopic:'all',duration:180});ContentUI.start(71)});
 await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy);
 const previous=await page.evaluate(async()=>{await LessonUI.flush();return (await LessonUI.service.list('recent_session')).find(r=>r.recent_session_id==='recent-'+APP.contentSessionConfig.session_id)});
 const kinds=await page.evaluate(()=>ReleasePolicy.cardKinds);
 for(const kind of kinds){
  await page.evaluate(()=>goScreen('cards'));await page.locator(`#screen-cards [data-cardgame="${kind}"]`).click();
  await page.waitForSelector(`#screen-game.active [data-ctype="${kind}"].active`);
  assert.equal(await page.evaluate(()=>ContentRuntime.activeSession()),null,kind+' standalone');
  assert.equal(await page.locator('#levelSelect').isEnabled(),true);
  await page.locator('#primaryGame').click();await page.waitForFunction(()=>!cardBusy);
  if(kind==='tongue')assert.equal(await page.locator('#tongueRead').isDisabled(),true);
  else{await page.locator('#cardHelp').click();assert.equal(await page.locator('#cardSupport').getAttribute('data-section'),'help')}
  const before=await page.evaluate(()=>({id:currentCard().id,index:APP.cardIndex,round:APP.cardRound,turn:APP.turn,boards:APP.boardStates,level:APP.level}));
  await page.evaluate(()=>goScreen('cards'));await page.locator('#cardMenuResume').click();
  assert.deepEqual(await page.evaluate(()=>({id:currentCard().id,index:APP.cardIndex,round:APP.cardRound,turn:APP.turn,boards:APP.boardStates,level:APP.level})),before);
  await page.reload();await page.locator('#resumeBtn').click();
  assert.deepEqual(await page.evaluate(()=>({id:currentCard().id,index:APP.cardIndex,round:APP.cardRound,turn:APP.turn,boards:APP.boardStates,level:APP.level})),before,kind+' exact reload/resume');
  if(kind==='idioms'){await page.locator('#cardSetInfo').click();await page.locator('#cardViewSet').click();assert.equal(await page.locator('.detail-text-cards article').count(),40);await page.locator('#backToCabinet').click();await page.waitForSelector('#screen-cards.active')}
 }
 const kept=await page.evaluate(async id=>{await LessonUI.flush();return (await LessonUI.service.list('recent_session')).find(r=>r.recent_session_id===id)},previous.recent_session_id);
 assert.deepEqual(kept,previous,'Earlier lesson remains intact');
 await page.evaluate(id=>LessonUI.handle('resume',id),previous.recent_session_id);await page.waitForSelector('.content-vert001-cards');assert.equal(await page.evaluate(()=>APP.cardShuffles[cardShuffleScope()].position),2);
 // Every standalone card, including all seven routes and every tongue twister.
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  const audit=await page.evaluate(()=>{
   const failures=[],seen=new Set();
   for(const kind of ReleasePolicy.cardKinds)for(const c of cardsFor(kind,true)){
    APP.level=kind==='tongue'?'C2':({R0:'A0',R1:'A1',R2:'A1+',R3:'A2',R4:'B1',R5:'B2',R6:'C1'}[c.routeId]);
    APP.cardIndex=cardsFor(kind).findIndex(x=>x.id===c.id);delete APP.cardRound;APP.cardShuffles={};APP.last={type:'card',data:{kind:kind}};startCards(kind);seen.add(c.id);
    const node=document.querySelector('[data-card-id]');
    if(node?.dataset.cardId!==c.id||node.scrollWidth>node.clientWidth+1)failures.push(c.id+' render');
    if(kind==='tongue'){if(node.textContent!==AppWording.text(c.text)||!document.querySelector('#tongueRead').disabled)failures.push(c.id+' tongue')}
    else{
     const prompt=document.querySelector('.card-instruction');
     const shown=[...prompt.querySelectorAll('li')].map(li=>li.textContent).join(' ');
     const expected=c.visualRebus?.instruction||CARD_READING_EDITS[c.id]?.steps.join(' ')||c.instruction;
     if(shown.replace(/\s+/g,' ').trim()!==AppWording.text(expected).replace(/\s+/g,' ').trim())failures.push(c.id+' prompt');
     const text=document.querySelector('.active-card').textContent;
     if(/\bbuur\b|\bpilot\b|AI-redactie|reviewronde/i.test(text))failures.push(c.id+' wording');
     if(!text.includes(AppWording.text(c.model.text)))failures.push(c.id+' model');
    }
   }
   return {count:seen.size,failures};
  });
  assert.equal(audit.count,520);assert.deepEqual(audit.failures,[],'All standalone cards '+width);
 }
 await page.setViewportSize({width:1440,height:900});
 await page.evaluate(()=>{APP.level='B1';goScreen('cards')});await page.locator('[data-cardgame="c1-between-lines"]').click();
 await page.waitForSelector('#screen-practice.active');
 assert.equal(await page.evaluate(()=>ContentUI.state().topic),'tussen-de-regels');
 assert.deepEqual(await page.evaluate(()=>DIGIBORD_CONTENT_CATALOG.families.find(f=>f.id==='conversation').topics.map(t=>[t.id,t.levels])),[['tussen-de-regels',['B1_B2','B2_C1']]]);
 await page.evaluate(()=>{const filters={bank_ids:['CB-BETWEEN-LINES-012']};ContentUI.launch(ContentRuntime.createSession({filters,selectedGameEngine:'CARDS',targetDurationSeconds:ContentRuntime.filterSource(filters).reduce((n,i)=>n+i.estimated_duration_seconds,0),seed:9}))});
 const between=await page.evaluate(async()=>{
  const ids=new Set(),levels={},failures=[];
  for(let i=0;i<50;i++){
   const item=contentSessionCards()[APP.cardIndex],node=document.querySelector('#screen-game [data-content-item-id]');ids.add(item.content_item_id);levels[item.cefr_level]=(levels[item.cefr_level]||0)+1;
   if(node.dataset.contentItemId!==item.content_item_id||document.querySelectorAll('#screen-game .content-prompt li').length!==3)failures.push(item.content_item_id);
   document.querySelector('#contentCardReveal').click();
   if(!document.querySelector('#contentCardAnswer').textContent.includes(AppWording.text(item.model_answer)))failures.push(item.content_item_id+' answer');
   await nextCard();
  }return {count:ids.size,levels,failures};
 });
 assert.deepEqual(between,{count:50,levels:{B2:31,B1:19},failures:[]});
 await page.evaluate(()=>LessonUI.flush());const progress=await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex}));
 await page.reload();await page.locator('#resumeBtn').click();await page.waitForSelector('.content-vert001-cards');assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,index:APP.cardIndex})),progress);
 for(const engine of ['BOARD','WHEEL']){await page.evaluate(engine=>ContentUI.launch(ContentRuntime.createSession({filters:{bank_ids:['CB-BETWEEN-LINES-012'],levels:['B1']},selectedGameEngine:engine,selectedGameVariant:engine==='BOARD'?'rotterdam':undefined,targetDurationSeconds:600,seed:9})),engine);assert.ok(await page.locator('#screen-game.active').isVisible())}
 // A direct old C1 launcher must use the improved preparation as well.
 await page.evaluate(()=>startC1());assert.equal(await page.evaluate(()=>ContentUI.state().topic),'tussen-de-regels');
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource().length),6630);
 assert.equal(await page.evaluate(()=>ContentRuntime.items().length),9415);
 assert.deepEqual(errors,[]);console.log('PASS: 570 reviewed cards, nine menu choices, 520 standalone renders at two widths, 50 corrected B1/B2 cards, all standalone reload/resume, retained shared lesson, three between-lines engines, disabled audio and unchanged hidden banks.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
