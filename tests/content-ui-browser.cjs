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
 await page.locator('[data-main="practice"]').click();
 await page.waitForSelector('#screen-practice.active #contentPracticeApp .practice-layout');
 assert.equal(await page.locator('#screen-practice h1').textContent(),'Stel je oefensessie samen');
 assert.equal(await page.locator('[name=family]').inputValue(),'grammar');
 assert.equal(await page.locator('[name=topic]').inputValue(),'ER');
 assert.equal(await page.locator('[name=level]').inputValue(),'B1');
 assert.equal(await page.locator('.practice-count strong').textContent(),'162');
 assert.equal(await page.locator('#practiceStart').isDisabled(),true,'game form is required');

 // Content first.
 await page.locator('.practice-engine').filter({hasText:'Speelbord'}).click();
 await page.locator('[name=variant]').selectOption('zwolle');
 const contentFirst=await page.evaluate(()=>ContentUI.sessionOptions(20260922));
 assert.equal(contentFirst.selectedGameEngine,'BOARD');
 assert.equal(contentFirst.selectedGameVariant,'zwolle');
 assert.equal(contentFirst.targetDurationSeconds,600);

 // Game first resolves to the same config after making the same choices.
 await page.evaluate(()=>goScreen('boards'));
 await page.locator('[data-practice-engine="BOARD"]').click();
 await page.locator('[name=variant]').selectOption('zwolle');
 const gameFirst=await page.evaluate(()=>ContentUI.sessionOptions(20260922));
 const normalize=o=>({targetDurationSeconds:o.targetDurationSeconds,engines:o.engines,filters:o.filters,organizationMode:o.organizationMode,selectedGameEngine:o.selectedGameEngine,selectedGameVariant:o.selectedGameVariant});
 assert.deepEqual(normalize(gameFirst),normalize(contentFirst),'content first and game first produce the same session options');

 // Unsupported ORDER focus is not silently redirected.
 await page.locator('label.practice-choice').filter({hasText:'Zin bouwen'}).click();
 assert.equal(await page.locator('.practice-count strong').textContent(),'0');
 assert.equal(await page.locator('#practiceStart').isDisabled(),true);
 assert.match(await page.locator('.practice-warning').textContent(),/geen spelmotor/i);
 assert.equal(await page.locator('.practice-engine input:enabled').count(),0);

 // A valid but too narrow selection blocks an impossible duration instead of changing scope.
 await page.locator('label.practice-choice').filter({hasText:'Gemengd'}).first().click();
 await page.locator('label.practice-choice').filter({hasText:'Hoeveelheden'}).click();
 await page.locator('label.practice-choice').filter({hasText:'20 minuten'}).click();
 assert.equal(await page.locator('#practiceStart').isDisabled(),true);
 assert.match(await page.locator('.practice-warning').textContent(),/kortere duur|ruimer/i);

 // Restore broad scope and start a real BOARD session on Zwolle.
 await page.locator('label.practice-choice').filter({hasText:'Alles'}).click();
 await page.locator('label.practice-choice').filter({hasText:'10 minuten'}).click();
 await page.locator('label.practice-choice').filter({hasText:'Groepen'}).click();
 await page.locator('.practice-engine').filter({hasText:'Speelbord'}).click();
 await page.locator('[name=variant]').selectOption('zwolle');
 await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 await page.locator('#practiceStart').click();
 await page.waitForSelector('#screen-game.active .board-game');
 const boardSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.equal(boardSession.selected_game_engine,'BOARD');
 assert.equal(boardSession.selected_game_variant,'zwolle');
 assert.equal(boardSession.organization_mode,'groups');
 assert.equal(await page.evaluate(()=>APP.last.data.board),'zwolle');
 assert.deepEqual(await page.evaluate(()=>ContentRuntime.activeSession().selected_item_ids),boardSession.selected_item_ids);

 // The same teacher selection and seed yields the same canonical IDs for WHEEL.
 await page.evaluate(()=>ContentUI.open({engine:'WHEEL'}));
 await page.evaluate(()=>ContentUI.setState({subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));
 await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 const wheelExpected=await page.evaluate(()=>ContentUI.sessionOptions(20260922));
 await page.locator('#practiceStart').click();
 await page.waitForSelector('#screen-game.active .na-wheel');
 const wheelSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.deepEqual(wheelSession.selected_item_ids,boardSession.selected_item_ids,'WHEEL uses the same selected IDs');
 assert.deepEqual(wheelSession.selected_item_ids,wheelExpected.engines.length?await page.evaluate(()=>ContentRuntime.activeSession().selected_item_ids):[]);
 const wheelIds=await page.locator('.na-wheel-legend [data-content-item-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.contentItemId));
 assert.deepEqual(wheelIds,wheelSession.selected_item_ids.slice(0,wheelIds.length));

 // And CARDS receives the same session IDs and canonical prompt.
 await page.evaluate(()=>ContentUI.open({engine:'CARDS'}));
 await page.evaluate(()=>ContentUI.setState({subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'groups'}));
 await page.evaluate(()=>ContentUI.setSeedOverride(20260922));
 await page.locator('#practiceStart').click();
 await page.waitForSelector('#screen-game.active .content-vert001-cards');
 const cardSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.deepEqual(cardSession.selected_item_ids,boardSession.selected_item_ids,'CARDS uses the same selected IDs');
 const cardId=await page.locator('.content-vert001-cards [data-content-item-id]').getAttribute('data-content-item-id');
 assert.equal(cardId,cardSession.selected_item_ids[0]);
 assert.equal(await page.locator('.content-vert001-cards h2').textContent(),await page.evaluate(id=>ContentRuntime.itemById(id).prompt,cardId));

 // Normal play exits the canonical content session before launching a standard game.
 await page.evaluate(()=>goScreen('boards'));
 await page.locator('#screen-boards [data-board="rotterdam"]').click();
 await page.waitForSelector('#screen-game.active .board-game');
 assert.equal(await page.evaluate(()=>ContentRuntime.activeSession()),null);
 assert.equal(await page.evaluate(()=>APP.contentSessionConfig===undefined),true);

 // Responsive configuration page has no horizontal overflow.
 for(const [width,height] of [[1024,768],[768,1024],[390,844]]){
  await page.setViewportSize({width,height});
  await page.locator('[data-main="play"]').click();
  if(width<=720){assert.equal(await page.locator('.practice-mobile-launch').isVisible(),true,'mobile Oefenen entry visible '+width);await page.locator('.practice-mobile-launch').click()}
  else await page.locator('[data-main="practice"]').click();
  await page.waitForSelector('#screen-practice.active .practice-layout');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'practice UI fits '+width);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: CONTENT UI 001 content first, game first, filters, capacity, variants and shared sessions');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
