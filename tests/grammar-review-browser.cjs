const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser,page;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'chrome'});page=await browser.newPage({viewport:{width:1630,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();
 await require('./practice-controls.cjs').level(page,'B2');assert.equal(await page.locator('[name=subtopic] option').filter({hasText:/^Verwijzen met er$/}).count(),1);
 assert.equal(await page.evaluate(()=>ContentRuntime.filterSource({bank_ids:['CB-GRAM-001'],levels:['B2']}).every(i=>ContentGuidance.mapping(i,'erk'))),true);
 const dir=path.join(root,'tests/artifacts/grammar-review');fs.mkdirSync(dir,{recursive:true});
 async function launch(engine,id='ER_B2_099'){await page.evaluate(({engine,id})=>{
  ContentUI.clearEditing();APP.fixedRoll=1;settingsPatch({reducedMotion:true});
  const item=ContentRuntime.itemById(id);
  const session=ContentRuntime.createSession({filters:{bank_ids:[item.content_bank_id],topics:[item.topic],levels:[item.cefr_level],language_functions:[item.language_function],exercise_types:[item.exercise_type]},targetDurationSeconds:Math.min(60,item.estimated_duration_seconds),organizationMode:'groups',engines:[engine],selectedGameEngine:engine,seed:51});
  ContentUI.launch({...session,selected_item_ids:[item.content_item_id],selected_content_refs:[ContentRuntime.contentRef(item)],actual_estimated_duration_seconds:item.estimated_duration_seconds});
 },{engine,id})}
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  await launch(engine);
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));}
  if(engine==='WHEEL'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);}
  if(engine==='QUIZ')await page.locator('.na-quiz-board [data-content-item-id=ER_B2_099]').click();
  const container=page.locator(engine==='BOARD'?'#taskDrawer':engine==='WHEEL'?'.na-wheel-result':engine==='QUIZ'?'.na-workspace':'.content-reading[data-content-item-id]');
  const text=await container.innerText();assert.match(text,/factuur|nooduitgang/);assert.match(text,/Collega:/);assert.match(text,/Jij: …/);assert.doesNotMatch(text,/abstracte verwijzing|complex voornaamwoordelijk/);
  assert.doesNotMatch(text,/Nee, we moeten er eerst beter naar kijken|Nee, we kunnen er niet zomaar aan voorbijgaan/,'Example is hidden until requested');
  const reveal=page.locator(engine==='BOARD'?'#contentBoardAnswer':engine==='WHEEL'?'.na-wheel-result summary':engine==='QUIZ'?'[data-na=quiz-reveal]':engine==='DICE'?'#contentDiceReveal':'#contentCardReveal');await reveal.click();
  const answer=await page.locator(engine==='BOARD'?'#gameDialog':engine==='WHEEL'?'.na-wheel-result .content-answer':engine==='QUIZ'?'.na-quiz-review':engine==='DICE'?'#contentDiceAnswer':'#contentCardAnswer').innerText();assert.match(answer,/Nee, we/);
  if(engine==='BOARD')await page.keyboard.press('Escape');
  await page.screenshot({path:path.join(dir,engine.toLowerCase()+'.png')});
  for(const width of [390,1024,1630]){await page.setViewportSize({width,height:900});assert.ok(await container.evaluate(e=>e.scrollWidth<=e.clientWidth+1),engine+' width '+width)}
  await page.setViewportSize({width:1630,height:900});
 }
 // The actual reported sentence must emphasize the same words in every shared game.
 for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  await launch(engine,'ER_B1_127');
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));}
  if(engine==='WHEEL'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);}
  if(engine==='QUIZ')await page.locator('.na-quiz-board [data-content-item-id=ER_B1_127]').click();
  const focus=page.locator('#screen-game.active .content-required');
  assert.deepEqual(await focus.locator('strong').allTextContents(),['er','voor zorgen']);
  assert.equal(await focus.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(231, 243, 254)');
  for(const width of [1440,390]){await page.setViewportSize({width,height:900});assert.ok(await focus.evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Required words fit '+engine+' '+width);}
  await page.setViewportSize({width:1440,height:900});
  if(engine==='CARDS')await page.screenshot({path:path.join(dir,'required-words.png')});
 }
 const emphasisAudit=await page.evaluate(()=>ContentRuntime.filterSource().map(item=>{
  const prompt=ContentRuntime.displayPrompt(item),node=document.createElement('div');node.innerHTML=contentPromptHtml(prompt);
  return {id:item.content_item_id,bank:item.content_bank_id,prompt:lessonText(prompt),text:node.textContent,words:[...node.querySelectorAll('strong')].map(e=>e.textContent),unsafe:!!node.querySelector('script,img,iframe'),required:/\b(?:Begin met|Reageer met|Vul .+ in:|Kies:|Gebruik:|Herschrijf met)\b/.test(prompt)};
 }));
 assert.equal(emphasisAudit.length,4061);
 assert.equal(emphasisAudit.filter(i=>i.words.length).length,1570);
 for(const item of emphasisAudit){assert.equal(item.text,item.prompt,item.id+' exact instruction retained');assert.ok(!item.unsafe,item.id+' safe markup');assert.ok(item.words.every(w=>w.trim()),item.id+' no empty emphasis');if(item.required)assert.ok(item.words.length,item.id+' named instruction emphasized');}
 fs.writeFileSync(path.join(dir,'emphasis-audit.json'),JSON.stringify(emphasisAudit,null,2));
 console.log('PASS all '+emphasisAudit.length+' published instructions: '+emphasisAudit.filter(i=>i.words.length).length+' with explicit emphasis; text and release scope retained.');
 const emphasisCases=[['ZULLEN_A2_006',['Zullen we','een datum kiezen']],['ZOUDEN_B1_038',['zou']],['ER_A2_003',['‘Ik kom er’']],['sq-r3-circle-117',['‘compact’']]];
 const choice=emphasisAudit.find(i=>i.bank==='CB-QUICK-014'&&i.prompt.startsWith('Kies:'));
 emphasisCases.push([choice.id,choice.words]);
 for(const [id,expected] of emphasisCases){
  const engines=id.startsWith('sq-')||id.startsWith('dq-')?['CARDS','BOARD','WHEEL']:['CARDS','BOARD','WHEEL','QUIZ','DICE',...(id==='ER_A2_003'?['SEQUENCE']:[])];
  for(const engine of engines){
   await launch(engine,id);
   if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));}
   if(engine==='WHEEL'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);}
   if(engine==='QUIZ')await page.locator('.na-quiz-board [data-content-item-id="'+id+'"]').click();
   const selector=engine==='BOARD'?'#taskTitle':engine==='QUIZ'?'.na-workspace h2[data-content-item-id]':engine==='SEQUENCE'?'.na-sequence-source':engine==='WHEEL'?'.na-wheel-result .content-prompt h2':'.content-reading .content-prompt h2';
   const task=page.locator(selector);assert.deepEqual(await task.locator('strong').allTextContents(),expected,id+' '+engine);
   assert.equal(await task.evaluate(e=>getComputedStyle(e).fontWeight),'400',id+' ordinary instruction stays lighter');
   assert.ok((await task.locator('strong').evaluateAll(es=>es.every(e=>getComputedStyle(e).fontWeight==='800'))),id+' required words bold');
   for(const width of [1440,390]){await page.setViewportSize({width,height:900});assert.ok(await task.evaluate(e=>e.scrollWidth<=e.clientWidth+1),id+' '+engine+' '+width);}
   if(engine==='CARDS')await page.screenshot({path:path.join(dir,id+'-emphasis.png')});
   await page.setViewportSize({width:1440,height:900});
  }
 }
 await launch('CARDS');await page.locator('#primaryGame').click();await page.evaluate(()=>LessonUI.flush());const saved=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,index:APP.cardIndex,refs:APP.contentSessionConfig.selected_content_refs}));await page.reload();await page.locator('#resumeBtn').click();await page.locator('#contentCardReveal').waitFor();assert.deepEqual(await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,index:APP.cardIndex,refs:APP.contentSessionConfig.selected_content_refs})),saved);
 // Pin the reported card for the visual check, without editing application data.
 await page.evaluate(()=>{APP.cardIndex=APP.contentSessionConfig.selected_item_ids.indexOf('ER_B2_099');startContentCards()});
 await page.setViewportSize({width:1630,height:724});await page.screenshot({path:path.join(dir,'reported-card-fixed.png')});
 assert.ok(await page.locator('.content-reading .content-situation p').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=22),'Situation remains readable on a large board');
 assert.equal(await page.locator('.content-prompt h2').evaluate(e=>getComputedStyle(e).whiteSpace),'pre-line');
 await page.setViewportSize({width:1630,height:900});
 const reviewed=await page.evaluate(()=>Object.keys({...GrammarReview.referenceReview,...GrammarReview.passiveReview,...GrammarReview.existenceReview,...GrammarReview.appearanceReview,...GrammarReview.reportingReview,...GrammarReview.argumentReview,...GrammarReview.probabilityReview,...GrammarReview.expectationReview,...GrammarReview.certaintyReview,...GrammarReview.deliberationReview,...GrammarReview.boundaryReview,...GrammarReview.pastReview,...GrammarReview.messageReview,...GrammarReview.inferenceReview,...GrammarReview.opinionReview,...GrammarReview.consequenceReview,...GrammarReview.a2Review,...GrammarReview.mixedReview,...GrammarReview.b1RestReview,...GrammarReview.zullenA2Review,...GrammarReview.zullenMixReview,...GrammarReview.modalBridgeReview,...GrammarReview.zoudenMixReview,...GrammarReview.zoudenRestReview}));
 const scope=process.env.REVIEW_WORKSET;const targetIds=scope?await page.evaluate(version=>ContentRuntime.items().filter(i=>i.version===version).map(i=>i.content_item_id),scope):reviewed;if(scope)assert.equal(targetIds.length,120);
 for(const id of targetIds)for(const engine of ['CARDS','BOARD','WHEEL','QUIZ','DICE']){
  await launch(engine,id);
  if(engine==='BOARD'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));}
  if(engine==='WHEEL'){await page.locator('#primaryGame').click();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);}
  if(engine==='QUIZ')await page.locator('.na-quiz-board [data-content-item-id="'+id+'"]').click();
  const item=await page.evaluate(id=>ContentRuntime.itemById(id),id);
  const container=page.locator(engine==='BOARD'?'#taskDrawer':engine==='WHEEL'?'.na-wheel-result':engine==='QUIZ'?'.na-workspace':'.content-reading[data-content-item-id]');
  const text=await container.innerText();assert.ok(text.includes(item.context),id+' '+engine+' situation visible');
  assert.ok(text.replace(/\s+/g,' ').includes(item.prompt.split('\n')[0].replace(/\s+/g,' ')),id+' '+engine+' instruction visible');
  if(['open','open_geleid'].includes(item.answer_type))assert.ok(!text.includes(item.model_answer),id+' hidden example');
  let answer;
  if(engine==='QUIZ'&&item.options.length){
   await page.locator('[data-na=quiz-answer]').nth(item.options.indexOf(item.correct_answer)).click();
   await page.waitForFunction(()=>document.querySelector('#na-feedback').textContent.length>0);
   answer=await page.locator('.na-workspace').innerText()+' '+await page.locator('#na-feedback').innerText();
  }else{
   const reveal=page.locator(engine==='BOARD'?'#contentBoardAnswer':engine==='WHEEL'?'.na-wheel-result summary':engine==='QUIZ'?'[data-na=quiz-reveal]':engine==='DICE'?'#contentDiceReveal':'#contentCardReveal');await reveal.click();
   answer=await page.locator(engine==='BOARD'?'#gameDialog':engine==='WHEEL'?'.na-wheel-result .content-answer':engine==='QUIZ'?'.na-quiz-review':engine==='DICE'?'#contentDiceAnswer':'#contentCardAnswer').innerText();
  }
  assert.ok(answer.includes(item.model_answer),id+' '+engine+' model');assert.ok(answer.includes(item.explanation),id+' '+engine+' explanation');
  if(engine==='BOARD')await page.keyboard.press('Escape');
  assert.ok(await container.evaluate(e=>e.scrollWidth<=e.clientWidth+1),id+' '+engine+' no horizontal clipping');
  if(engine==='CARDS'&&['ZULLEN_A2_006','ZULLEN_A2_038','ZULLEN_A2_069','ZULLEN_A2_099','ER_B1_069','ER_B1_099','ER_B1_104','ER_B1_155','ER_B1_168','ER_A2_125','ER_A2_150','ER_B1_018','ER_B1_027','ER_B1_039','ER_A2_009','ER_A2_038','ER_A2_069','ER_A2_108','ZOUDEN_B2_129','ZOUDEN_B2_131','ZOUDEN_B2_142','ZOUDEN_B2_099','ZOUDEN_B2_109','ZOUDEN_B2_111','ZOUDEN_B2_069','ZOUDEN_B2_073','ZOUDEN_B2_090','ZOUDEN_B2_039','ZOUDEN_B2_052','ZOUDEN_B2_053','ZOUDEN_B2_009','ZOUDEN_B2_016','ZOUDEN_B2_020','ZULLEN_B2_129','ZULLEN_B2_131','ZULLEN_B2_141','ZULLEN_B2_094','ZULLEN_B2_099','ZULLEN_B2_111','ZULLEN_B2_061','ZULLEN_B2_081','ZULLEN_B2_086','ZULLEN_B2_037','ZULLEN_B2_048','ZULLEN_B2_060','ZULLEN_B2_007','ZULLEN_B2_009','ZULLEN_B2_021','ER_B2_159','ER_B2_168','ER_B2_180','ER_B2_129','ER_B2_141','ER_B2_143','ER_B2_070','ER_B2_078','ER_B2_090','ER_B2_049','ER_B2_053','ER_B2_060','ER_B2_002','ER_B2_009','ER_B2_020','ER_B2_092','ER_B2_111','ER_B2_113'].includes(id))await page.screenshot({path:path.join(dir,id+'-review.png')});
 }
 await launch('CARDS','ER_B2_111');await page.locator('#contentCardReveal').click();
 for(const viewport of [{width:390,height:844},{width:1630,height:724}]){
  await page.setViewportSize(viewport);
  const end=page.locator('#contentCardAnswer section').last();await end.scrollIntoViewIfNeeded();
  assert.ok(await end.evaluate(e=>{const r=e.getBoundingClientRect(),bar=document.querySelector('.gamebar')?.getBoundingClientRect();return r.bottom<=Math.min(innerHeight,bar?.top||innerHeight)+1}), 'Long explanation stays reachable');
 }
 await page.screenshot({path:path.join(dir,'long-answer-scrolled.png')});await page.setViewportSize({width:1630,height:900});
 const orderIds=await page.evaluate(ids=>ids.filter(id=>ContentRuntime.itemById(id).exercise_type==='zinnen_leggen'),targetIds);
 for(const id of orderIds){
  await launch('SEQUENCE',id);
  const item=await page.evaluate(id=>ContentRuntime.itemById(id),id);
  assert.ok((await page.locator('.na-workspace').innerText()).includes(item.context),id+' sequence context');
  const tokens=await page.evaluate(id=>ContentRuntime.project('SEQUENCE',ContentRuntime.itemById(id)).orderExpectedTokens,id);
  for(let i=0;i<tokens.length;i++)await page.locator('[data-na=step][data-value="'+i+'"]').click();
  await page.locator('#primaryGame').click();
  await page.waitForFunction(()=>document.querySelector('#na-feedback').textContent.length>0);
  assert.equal(await page.locator('#na-feedback').innerText(),'De volgorde klopt! '+item.explanation,id+' sequence explanation');
 }
 console.log('PASS '+targetIds.length+' reviewed grammar tasks on five game surfaces: '+targetIds.length*5+' rendered situations, instructions, hidden open examples, models, explanations, no horizontal clipping.');
 assert.deepEqual(errors,[]);console.log('PASS B2 browser: actual dialogues and context on cards/board/wheel/quiz/dice, hidden examples, plain labels, guidance, 390/1024/1630px and exact saved progress.');
})().catch(async e=>{console.error(e);if(page)console.error(await page.locator('body').innerText());process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(r=>server.close(r))});
