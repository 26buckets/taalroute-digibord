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

 const session=await page.evaluate(()=>CONTENT_VERT001.start({seed:20260922,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS','DICE','QUIZ'],filters:{topics:['ER'],levels:['B1']},selectionTopic:'ER',organizationMode:'groups',startedAt:'2026-09-22T08:00:00+02:00'}));
 assert.equal(session.topic,'ER');assert.equal(session.cefr_level,'B1');assert.ok(session.selected_item_ids.length>=6);
 assert.equal(await page.evaluate(ids=>ids.every(id=>{const x=window.ContentRuntime.itemById(id);return x.topic==='ER'&&x.cefr_level==='B1'}),session.selected_item_ids),true);
 assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),session.selected_item_ids);

 const boardIds=await page.evaluate(()=>{APP.contentVert001Used={};return Array.from({length:8},()=>routeTask(1,routeCache.rotterdam).contentItemId)});
 assert.ok(boardIds.every(id=>session.selected_item_ids.includes(id)));assert.equal(new Set(boardIds).size,boardIds.length);

 await page.evaluate(()=>CONTENT_VERT001.wheel());
 const wheelIds=await page.locator('.na-wheel-legend [data-content-item-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.contentItemId));
 assert.deepEqual(wheelIds,session.selected_item_ids.slice(0,wheelIds.length));

 await page.evaluate(()=>CONTENT_VERT001.cards());
 const cardId=await page.locator('.content-vert001-cards [data-content-item-id]').getAttribute('data-content-item-id');
 assert.equal(cardId,session.selected_item_ids[0]);
 assert.match(await page.locator('.content-vert001-cards .card-activity-heading h1').textContent(),/Grammatica ER · B1/);
 assert.equal(await page.locator('.content-vert001-cards .card-content h2').textContent(),await page.evaluate(id=>window.ContentRuntime.itemById(id).prompt,cardId));

 await page.evaluate(()=>CONTENT_VERT001.dice());
 await page.waitForSelector('#screen-game.active .content-engine-dice');
 const diceId=await page.locator('.content-engine-dice [data-content-item-id]').getAttribute('data-content-item-id');
 assert.equal(diceId,session.selected_item_ids[0]);
 assert.equal(await page.locator('.content-engine-dice .card-content h2').textContent(),await page.evaluate(id=>window.ContentRuntime.itemById(id).prompt,diceId));
 await page.locator('#primaryGame').click();
 const diceSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.deepEqual(diceSession.selected_item_ids,session.selected_item_ids);

 await page.evaluate(()=>CONTENT_VERT001.quiz());
 await page.waitForSelector('#screen-game.active .na-quiz-board');
 const quizBoardIds=await page.locator('.na-quiz-board [data-content-item-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.contentItemId));
 assert.deepEqual(new Set(quizBoardIds),new Set(session.selected_item_ids));
 const quizSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.deepEqual(quizSession.selected_item_ids,session.selected_item_ids);

 const orderReport=await page.evaluate(()=>{
  const pool=window.ContentRuntime.filterSource({topics:['ER'],levels:['B1'],exercise_types:['zinnen_leggen']});
  const item=pool[0],projection=window.ContentRuntime.project('CARDS',item);
  return {count:pool.length,mode:window.ContentRuntime.compatibility(item,'CARDS').mode,adapter:projection.adapter,tokens:projection.orderTokens};
 });
 assert.equal(orderReport.count,18);assert.equal(orderReport.mode,'COMPATIBLE_WITH_ADAPTER');assert.equal(orderReport.adapter,'text_order');assert.ok(orderReport.tokens.length>=2);

 // Existing Rangschikken engine executes the canonical IT_008_ORDER item directly.
 await page.evaluate(()=>{CONTENT_VERT001.stop();CONTENT_VERT001.start({seed:777,targetDurationSeconds:300,engines:['BOARD','WHEEL','CARDS','DICE','SEQUENCE'],filters:{topics:['ER'],levels:['B1'],exercise_types:['zinnen_leggen']},selectionTopic:'ER',organizationMode:'class',selectedGameEngine:'SEQUENCE',selectedGameVariant:'rangschikken'});CONTENT_VERT001.sequence()});
 await page.waitForSelector('#screen-game.active [data-content-item-id]');
 const seqId=await page.locator('[data-content-item-id]').first().getAttribute('data-content-item-id');
 const seqExpected=await page.evaluate(id=>window.ContentRuntime.project('SEQUENCE',window.ContentRuntime.itemById(id)).orderExpectedTokens,seqId);
 const seqSession=await page.evaluate(()=>APP.contentSessionConfig);
 assert.ok(seqSession.selected_item_ids.includes(seqId));
 assert.equal(await page.evaluate(ids=>ids.every(id=>window.ContentRuntime.itemById(id).interaction_type==='IT_008_ORDER'),seqSession.selected_item_ids),true);
 const bankValues=await page.locator('.na-step-bank [data-na="step"]').evaluateAll(nodes=>nodes.map(n=>({i:Number(n.dataset.value),text:n.textContent.trim()})));
 assert.deepEqual(new Set(bankValues.map(x=>x.text)),new Set(seqExpected));
 for(let i=0;i<seqExpected.length;i++)await page.locator(`[data-na="step"][data-value="${i}"]`).click();
 const chosen=await page.locator('.na-sequence [data-na="remove-step"]').evaluateAll(nodes=>nodes.map(n=>n.textContent.trim()));
 assert.deepEqual(chosen,seqExpected);
 await page.locator('#primaryGame').click();
 await page.waitForFunction(()=>/De volgorde klopt!/.test(document.querySelector('#na-feedback')?.textContent||''));

 const modal=await page.evaluate(()=>window.ContentRuntime.createSession({seed:66,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS','DICE','QUIZ'],filters:{topics:['ZULLEN','ZOUDEN'],levels:['B2'],family_tags:['MODAAL']},selectionTopic:'MODAAL',organizationMode:'groups'}));
 assert.equal(modal.topic,'MODAAL');assert.equal(modal.cefr_level,'B2');
 const modalTopics=await page.evaluate(ids=>[...new Set(ids.map(id=>window.ContentRuntime.itemById(id).topic))],modal.selected_item_ids);
 assert.deepEqual(new Set(modalTopics),new Set(['ZULLEN','ZOUDEN']));

 const openPolicy=await page.evaluate(()=>{const item=window.ContentRuntime.source.items.find(x=>x.openness==='open');return window.ContentRuntime.answerPolicy(item)});
 assert.equal(openPolicy.requiresExactMatch,false);assert.equal(openPolicy.mode,'teacher_or_peer_review');
 const closedPolicy=await page.evaluate(()=>{const item=window.ContentRuntime.source.items.find(x=>x.openness==='gesloten');return window.ContentRuntime.answerPolicy(item)});
 assert.equal(closedPolicy.mode,'canonical_answer');assert.ok(closedPolicy.canonicalAnswer);

 // Closed quiz item scores automatically from the canonical answer.
 await page.evaluate(()=>{CONTENT_VERT001.stop();CONTENT_VERT001.start({seed:501,targetDurationSeconds:300,engines:['QUIZ'],filters:{topics:['ER'],levels:['B1'],exercise_types:['meerkeuze_vorm']},selectionTopic:'ER',organizationMode:'groups'});CONTENT_VERT001.quiz()});
 await page.waitForSelector('.na-quiz-board');
 const closedButton=page.locator('.na-quiz-board [data-content-item-id]').first();
 const closedId=await closedButton.getAttribute('data-content-item-id'),closedPoints=Number((await closedButton.textContent()).trim());
 await closedButton.click();
 const closedCorrect=await page.evaluate(id=>window.ContentRuntime.itemById(id).correct_answer,closedId);
 await page.locator('.na-quiz-options .na-choice').filter({hasText:closedCorrect}).click();
 await page.waitForFunction(()=>/Goed!/.test(document.querySelector('#na-feedback')?.textContent||''));
 await page.locator('#primaryGame').click();
 assert.equal(Number(await page.locator('.na-scoreboard strong').first().textContent()),closedPoints);

 // Open quiz item is never exact-string scored and requires teacher grading.
 await page.evaluate(()=>{CONTENT_VERT001.stop();CONTENT_VERT001.start({seed:502,targetDurationSeconds:300,engines:['QUIZ'],filters:{topics:['ER'],levels:['B1'],exercise_types:['scenario']},selectionTopic:'ER',organizationMode:'groups'});CONTENT_VERT001.quiz()});
 await page.waitForSelector('.na-quiz-board');
 const openButton=page.locator('.na-quiz-board [data-content-item-id]').first();
 const openId=await openButton.getAttribute('data-content-item-id'),openPoints=Number((await openButton.textContent()).trim());
 await openButton.click();
 await page.waitForSelector(`h2[data-content-item-id="${openId}"]`);
 await page.waitForSelector('button[data-na="quiz-reveal"]');
 await page.locator('button[data-na="quiz-reveal"]').click();
 const openModel=await page.evaluate(id=>window.ContentRuntime.itemById(id).model_answer,openId);
 assert.equal((await page.locator('.na-quiz-review p').textContent()).trim(),openModel);
 await page.getByText('Goed · punten toekennen',{exact:true}).click();
 await page.waitForFunction(()=>/punten voor Team 1/.test(document.querySelector('#na-feedback')?.textContent||''));
 await page.locator('#primaryGame').click();
 assert.equal(Number(await page.locator('.na-scoreboard strong').first().textContent()),openPoints);

 await page.evaluate(()=>CONTENT_VERT001.stop());
 await page.evaluate(()=>CONTENT_VERT001.start({seed:44,targetDurationSeconds:300,engines:['BOARD','WHEEL','CARDS','DICE','QUIZ'],filters:{topics:['ZOUDEN'],levels:['A2']},selectionTopic:'ZOUDEN',organizationMode:'groups'}));
 const saved=await page.evaluate(()=>JSON.parse(JSON.stringify(APP.contentSessionConfig)));
 await page.reload();await page.waitForFunction(()=>!!window.ContentRuntime);
 const restored=await page.evaluate(()=>CONTENT_VERT001.restore());
 assert.deepEqual(restored.selected_item_ids,saved.selected_item_ids);assert.equal(restored.topic,'ZOUDEN');assert.equal(restored.cefr_level,'A2');

 assert.deepEqual(errors,[]);
 console.log('PASS: full GRAM PB001 browser runtime across BOARD WHEEL CARDS DICE QUIZ SEQUENCE, automatic and teacher-scored quiz paths, canonical ORDER execution, MODAAL and restore.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
