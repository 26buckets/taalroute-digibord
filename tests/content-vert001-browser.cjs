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

 const session=await page.evaluate(()=>CONTENT_VERT001.start({seed:20260922,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS'],filters:{topics:['ER'],levels:['B1']},selectionTopic:'ER',startedAt:'2026-09-22T08:00:00+02:00'}));
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

 const orderReport=await page.evaluate(()=>{
  const pool=window.ContentRuntime.filterSource({topics:['ER'],levels:['B1'],exercise_types:['zinnen_leggen']});
  const item=pool[0],projection=window.ContentRuntime.project('CARDS',item);
  return {count:pool.length,mode:window.ContentRuntime.compatibility(item,'CARDS').mode,adapter:projection.adapter,tokens:projection.orderTokens};
 });
 assert.equal(orderReport.count,18);assert.equal(orderReport.mode,'COMPATIBLE_WITH_ADAPTER');assert.equal(orderReport.adapter,'text_order');assert.ok(orderReport.tokens.length>=2);

 const modal=await page.evaluate(()=>window.ContentRuntime.createSession({seed:66,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS'],filters:{topics:['ZULLEN','ZOUDEN'],levels:['B2'],family_tags:['MODAAL']},selectionTopic:'MODAAL'}));
 assert.equal(modal.topic,'MODAAL');assert.equal(modal.cefr_level,'B2');
 const modalTopics=await page.evaluate(ids=>[...new Set(ids.map(id=>window.ContentRuntime.itemById(id).topic))],modal.selected_item_ids);
 assert.deepEqual(new Set(modalTopics),new Set(['ZULLEN','ZOUDEN']));

 const openPolicy=await page.evaluate(()=>{const item=window.ContentRuntime.source.items.find(x=>x.openness==='open');return window.ContentRuntime.answerPolicy(item)});
 assert.equal(openPolicy.requiresExactMatch,false);assert.equal(openPolicy.mode,'teacher_or_peer_review');
 const closedPolicy=await page.evaluate(()=>{const item=window.ContentRuntime.source.items.find(x=>x.openness==='gesloten');return window.ContentRuntime.answerPolicy(item)});
 assert.equal(closedPolicy.mode,'canonical_answer');assert.ok(closedPolicy.canonicalAnswer);

 await page.evaluate(()=>CONTENT_VERT001.stop());
 await page.evaluate(()=>CONTENT_VERT001.start({seed:44,targetDurationSeconds:300,engines:['BOARD','WHEEL','CARDS'],filters:{topics:['ZOUDEN'],levels:['A2']},selectionTopic:'ZOUDEN'}));
 const saved=await page.evaluate(()=>JSON.parse(JSON.stringify(APP.contentSessionConfig)));
 await page.reload();await page.waitForFunction(()=>!!window.ContentRuntime);
 const restored=await page.evaluate(()=>CONTENT_VERT001.restore());
 assert.deepEqual(restored.selected_item_ids,saved.selected_item_ids);assert.equal(restored.topic,'ZOUDEN');assert.equal(restored.cefr_level,'A2');

 assert.deepEqual(errors,[]);
 console.log('PASS: full GRAM PB001 browser runtime across BOARD WHEEL CARDS, ORDER adapter, MODAAL and restore.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
