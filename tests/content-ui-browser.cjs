const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url())});
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 await page.locator('[data-main="practice"]').click();await page.waitForSelector('#screen-practice.active .practice-layout');
 assert.equal(await page.locator('[name=topic]').inputValue(),'ER');assert.equal(await page.locator('[name=level]').inputValue(),'B1');
 assert.equal(await page.locator('.practice-count strong').textContent(),'180');
 assert.equal(await page.locator('input[name=organization][value=pairs]').count(),1);

 // No silent fallback for invalid selections.
 await page.evaluate(()=>ContentUI.setState({level:'C1'}));
 assert.equal(await page.locator('#practiceStart').isDisabled(),true);assert.match(await page.locator('.practice-warning').textContent(),/niveau.*niet beschikbaar/i);
 assert.match(await page.evaluate(()=>{try{ContentUI.sessionOptions(7);return''}catch(e){return e.message}}),/niveau.*niet beschikbaar/i);
 await page.evaluate(()=>ContentUI.setState({topic:'NIET_BESTAAND'}));
 assert.match(await page.locator('.practice-warning').textContent(),/onderwerp.*niet beschikbaar/i);
 await page.evaluate(()=>ContentUI.setState({topic:'ER',level:'B1',subtopic:'all'}));

 // ER, ZULLEN, ZOUDEN and MODAAL expose real source counts.
 await page.evaluate(()=>ContentUI.setState({topic:'ZULLEN',level:'B2',subtopic:'all'}));
 assert.equal(await page.locator('.practice-count strong').textContent(),'150');
 await page.evaluate(()=>ContentUI.setState({topic:'ZOUDEN',level:'A2',subtopic:'all'}));
 assert.equal(await page.locator('.practice-count strong').textContent(),'150');
 await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all'}));
 assert.equal(await page.locator('.practice-count strong').textContent(),'300');

 // ORDER is supported through the explicit text-order adapter and never silently redirected.
 await page.locator('[name=topic]').selectOption('ER');
 await page.locator('[name=level]').selectOption('B1');
 await page.locator('label.practice-choice').filter({hasText:'Zin bouwen'}).click();
 await page.locator('label.practice-choice').filter({hasText:/^5 minuten$/}).click();
 assert.equal(await page.locator('.practice-count strong').textContent(),'18');
 assert.equal(await page.locator('.practice-engine input:enabled').count(),5);
 await page.locator('.practice-engine').filter({hasText:'Kaarten'}).click();
 const orderOpts=await page.evaluate(()=>ContentUI.sessionOptions(55));
 assert.deepEqual(orderOpts.filters.exercise_types,['zinnen_leggen']);
 assert.equal(await page.locator('.practice-engine').filter({hasText:'Rangschikken'}).count(),1);
 await page.evaluate(()=>ContentUI.open({engine:'SEQUENCE'}));await page.evaluate(()=>ContentUI.setState({topic:'ER',level:'B1',subtopic:'all',focus:'order',production:'all',difficulty:'all',duration:300,organization:'class'}));await page.evaluate(()=>ContentUI.setSeedOverride(5501));
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active [data-content-item-id]');
 const sequenceSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.equal(sequenceSession.selected_game_engine,'SEQUENCE');
 assert.ok(sequenceSession.selected_item_ids.every(id=>window.ContentRuntime.itemById(id).interaction_type==='IT_008_ORDER'));
 const sequenceId=await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id');
 assert.ok(sequenceSession.selected_item_ids.includes(sequenceId));

 // Mixed selection must hide SEQUENCE instead of silently narrowing to ORDER.
 await page.evaluate(()=>ContentUI.open());await page.evaluate(()=>ContentUI.setState({topic:'ER',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:300,organization:'class'}));
 assert.equal(await page.locator('.practice-engine').filter({hasText:'Rangschikken'}).count(),0);

 // Too long for the narrow ORDER pool is blocked instead of changing scope.
 await page.evaluate(()=>ContentUI.setState({duration:600}));
 assert.equal(await page.locator('#practiceStart').isDisabled(),true);assert.match(await page.locator('.practice-warning').textContent(),/kortere duur|ruimer/i);

 // Content first and game first produce the same options.
 await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups',engine:'BOARD',variant:'zwolle'}));
 const contentFirst=await page.evaluate(()=>ContentUI.sessionOptions(20260922));
 await page.evaluate(()=>goScreen('boards'));await page.locator('[data-practice-engine="BOARD"]').click();await page.locator('[name=variant]').selectOption('zwolle');
 await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));
 const gameFirst=await page.evaluate(()=>ContentUI.sessionOptions(20260922));
 const normalize=o=>({targetDurationSeconds:o.targetDurationSeconds,engines:o.engines,filters:o.filters,organizationMode:o.organizationMode,selectedGameEngine:o.selectedGameEngine,selectedGameVariant:o.selectedGameVariant,selectionTopic:o.selectionTopic});
 assert.deepEqual(normalize(gameFirst),normalize(contentFirst));

 // Start MODAAL BOARD and prove no topic/level leak.
 await page.evaluate(()=>ContentUI.setSeedOverride(20260922));await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .board-game');
 const boardSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.equal(boardSession.topic,'MODAAL');assert.equal(boardSession.cefr_level,'B1');assert.equal(boardSession.organization_mode,'groups');
 const leak=await page.evaluate(ids=>ids.some(id=>{const x=window.ContentRuntime.itemById(id);return !['ZULLEN','ZOUDEN'].includes(x.topic)||x.cefr_level!=='B1'||!x.technical_tags.includes('MODAAL')}),boardSession.selected_item_ids);
 assert.equal(leak,false);

 // Same selection and seed across WHEEL and CARDS.
 await page.evaluate(()=>ContentUI.open({engine:'WHEEL'}));await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .na-wheel');
 const wheelSession=await page.evaluate(()=>APP.contentSessionConfig);assert.deepEqual(wheelSession.selected_item_ids,boardSession.selected_item_ids);
 await page.evaluate(()=>ContentUI.open({engine:'CARDS'}));await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .content-vert001-cards');
 const cardSession=await page.evaluate(()=>APP.contentSessionConfig);assert.deepEqual(cardSession.selected_item_ids,boardSession.selected_item_ids);
 assert.match(await page.locator('.content-vert001-cards .card-activity-heading h1').textContent(),/Modale werkwoorden · B1/);
 await page.evaluate(()=>ContentUI.open({engine:'DICE'}));await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .content-engine-dice');
 const diceSession=await page.evaluate(()=>APP.contentSessionConfig);assert.deepEqual(diceSession.selected_item_ids,boardSession.selected_item_ids);
 assert.equal(await page.evaluate(()=>ContentUI.engines().map(x=>x.id).join(',')),'BOARD,WHEEL,CARDS,DICE,QUIZ,SEQUENCE');

 // QUIZ is offered for groups, uses the same IDs, and is hidden for unsupported organization modes.
 await page.evaluate(()=>ContentUI.open({engine:'QUIZ'}));await page.evaluate(()=>ContentUI.setState({topic:'MODAAL',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 assert.equal(await page.locator('.practice-engine').filter({hasText:'Categorieënquiz'}).count(),1);
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .na-quiz-board');
 const quizSession=await page.evaluate(()=>APP.contentSessionConfig);assert.deepEqual(quizSession.selected_item_ids,boardSession.selected_item_ids);assert.equal(quizSession.organization_mode,'groups');
 await page.evaluate(()=>ContentUI.open());await page.evaluate(()=>ContentUI.setState({organization:'class'}));
 assert.equal(await page.locator('.practice-engine').filter({hasText:'Categorieënquiz'}).count(),0);

 // Duo remains a real organization mode in the board runtime.
 await page.evaluate(()=>ContentUI.open({engine:'BOARD',variant:'rotterdam'}));await page.evaluate(()=>ContentUI.setState({topic:'ER',level:'A2',subtopic:'all',focus:'all',duration:600,organization:'pairs'}));await page.evaluate(()=>ContentUI.setSeedOverride(99));
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .board-game');
 assert.equal(await page.evaluate(()=>APP.contentSessionConfig.organization_mode),'pairs');assert.match(await page.locator('.board-players-heading').textContent(),/Duo/);

 // Standard play exits canonical session.
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-board="rotterdam"]').click();await page.waitForSelector('#screen-game.active .board-game');
 assert.equal(await page.evaluate(()=>window.ContentRuntime.activeSession()),null);

 for(const [width,height] of [[1024,768],[768,1024],[390,844]]){
  await page.setViewportSize({width,height});await page.locator('[data-main="play"]').click();
  if(width<=720){assert.equal(await page.locator('.practice-mobile-launch').isVisible(),true);await page.locator('.practice-mobile-launch').click()}else await page.locator('[data-main="practice"]').click();
  await page.waitForSelector('#screen-practice.active .practice-layout');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: CONTENT UI full PB001 topics, levels, MODAAL, ORDER, strict no-fallback, shared sessions, dynamic six-engine registry, scoped SEQUENCE, organization-aware QUIZ and duo mode.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
