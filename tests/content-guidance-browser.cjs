const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:900},hasTouch:true});const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url())});
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 await page.locator('[data-main="practice"]').click();
 assert.equal(await page.locator('#practiceForm [data-guidance]').count(),4);
 const before=await page.evaluate(()=>JSON.stringify(localStorage));
 for(const key of ['lowan','erk','f','bow']){
  const button=page.locator(`#practiceForm [data-guidance=${key}]`);await button.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#gameDialog[open].guidance-dialog').count(),1,JSON.stringify({key,errors,dialog:await page.locator('#gameDialog').evaluate(e=>e.outerHTML.slice(0,180))}));
  assert.equal(await page.locator('#guidanceHeading').evaluate(e=>e===document.activeElement),true);
  assert.match(await page.locator('.guidance-status').textContent(),key==='bow'?/Enkele lestips/:/Nog niet gekoppeld/);
  await page.keyboard.press('Escape');
  await page.waitForFunction(key=>!document.querySelector('#gameDialog').open&&document.activeElement===document.querySelector(`#practiceForm [data-guidance=${key}]`),key);
  assert.equal(await button.evaluate(e=>e===document.activeElement),true);
 }
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);
 await page.locator('#practiceForm [data-guidance=bow]').click();
 assert.match(await page.locator('.guidance-content').textContent(),/3 van de 180/);
 assert.match(await page.locator('.guidance-content').textContent(),/A3f/);
 await page.locator('#gameDialog [data-guidance=erk]').click();assert.match(await page.locator('#guidanceHeading').textContent(),/ERK/);
 await page.locator('#dialogClose').click();
 const first=await page.locator('#practiceForm .guidance-row').innerHTML();
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-practice-engine="BOARD"]:not([data-practice-variant])').click();
 assert.equal(await page.locator('#practiceForm .guidance-row').innerHTML(),first);
 // Saved selection is resolved by the same item IDs, without writing new lesson fields.
 const selection=await page.evaluate(()=>({spec:ContentUI.selectionSpec(),p:ContentUI.preferences()}));
 await page.evaluate(({spec,p})=>ContentUI.loadSelection(spec,p,{record:{name:'Bewaarde les'}}),selection);
 assert.equal(await page.locator('#practiceForm .guidance-row').innerHTML(),first);
 await page.reload();await page.locator('[data-main="practice"]').click();
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:900});
  const button=page.locator('#practiceForm [data-guidance=bow]');await button.tap();
  const sizes=await page.locator('#gameDialog [data-guidance]').evaluateAll(bs=>bs.map(b=>({width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height})));
  assert.ok(sizes.every(s=>s.width>=44&&s.height>=44));
  assert.ok(await page.locator('#gameDialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(process.env.GUIDANCE_SCREENSHOT){await page.screenshot({path:path.resolve(process.env.GUIDANCE_SCREENSHOT,`guidance-${width}.png`)});}
  await page.locator('#dialogClose').tap();
 }
 await page.evaluate(()=>ContentUI.setState({family:'words'}));await page.locator('#practiceForm [data-guidance=bow]').click();
 assert.match(await page.locator('.guidance-status').textContent(),/Nog niet gekoppeld/);assert.equal(await page.locator('.guidance-tip').count(),0);await page.keyboard.press('Escape');
 await page.evaluate(()=>ContentUI.setState({family:'grammar',topic:'ER',level:'B1',engine:'CARDS',duration:300}));
 await page.locator('#practiceStart').click();await page.waitForSelector('#screen-game.active .content-vert001-cards');
 assert.equal(await page.locator('#screen-game [data-guidance]').count(),0);
 const session=await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids);assert.ok(session.length);
 await page.reload();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),session);
 assert.deepEqual(errors,[]);console.log('Guidance browser: keyboard, touch, both routes, saved selection, reload and 320–1920px OK');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve))});
