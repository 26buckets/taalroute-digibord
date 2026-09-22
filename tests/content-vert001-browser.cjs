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
 const session=await page.evaluate(()=>CONTENT_VERT001.start({seed:20260922,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS'],startedAt:'2026-09-22T08:00:00+02:00'}));
 assert.ok(session.selected_item_ids.length>=6);
 assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),session.selected_item_ids,'SessionConfig persisted in app state');

 const boardIds=await page.evaluate(()=>{APP.contentVert001Used={};return Array.from({length:8},()=>routeTask(1,routeCache.rotterdam).contentItemId)});
 assert.ok(boardIds.every(id=>session.selected_item_ids.includes(id)),'BOARD draws only from active canonical session');
 assert.equal(new Set(boardIds).size,boardIds.length,'BOARD does not repeat before pool use requires it');

 await page.evaluate(()=>CONTENT_VERT001.wheel());
 const wheelIds=await page.locator('.na-wheel-legend [data-content-item-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.contentItemId));
 assert.equal(wheelIds.length,Math.min(6,session.selected_item_ids.length));
 assert.deepEqual(wheelIds,session.selected_item_ids.slice(0,wheelIds.length),'WHEEL starts from the exact same SessionConfig ordering');
 await page.locator('#primaryGame').click();
 await page.waitForFunction(()=>document.querySelector('.na-wheel-result h2[data-content-item-id]'));
 const wheelChosen=await page.locator('.na-wheel-result h2').getAttribute('data-content-item-id');
 assert.ok(session.selected_item_ids.includes(wheelChosen));

 await page.evaluate(()=>CONTENT_VERT001.cards());
 const cardId=await page.locator('.content-vert001-cards [data-content-item-id]').getAttribute('data-content-item-id');
 assert.equal(cardId,session.selected_item_ids[0],'CARDS uses first item from the same SessionConfig');
 const cardPrompt=await page.locator('.content-vert001-cards .card-content h2').textContent();
 const sourcePrompt=await page.evaluate(id=>ContentRuntime.itemById(id).prompt,cardId);
 assert.equal(cardPrompt,sourcePrompt,'CARDS renders canonical prompt without a game copy');
 await page.locator('#contentCardReveal').click();
 const model=await page.locator('#contentCardAnswer p').first().textContent();
 assert.equal(model,await page.evaluate(id=>ContentRuntime.itemById(id).model_answer,cardId),'CARDS reveals canonical model answer');

 const openPolicy=await page.evaluate(()=>{const item=ContentRuntime.eligibleItems(['BOARD','WHEEL','CARDS']).find(x=>x.openness==='open'||x.openness==='open_geleid');return ContentRuntime.answerPolicy(item)});
 assert.equal(openPolicy.requiresExactMatch,false);assert.equal(openPolicy.mode,'teacher_or_peer_review');
 const closedPolicy=await page.evaluate(()=>{const item=ContentRuntime.eligibleItems(['BOARD','WHEEL','CARDS']).find(x=>x.openness==='gesloten'||x.openness==='geleid_gesloten');return ContentRuntime.answerPolicy(item)});
 assert.equal(closedPolicy.mode,'canonical_answer');assert.ok(closedPolicy.canonicalAnswer);
 assert.deepEqual(errors,[]);
 console.log('PASS: CONTENT VERT 001 browser smoke across BOARD, WHEEL and CARDS');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
