const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser,page;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'chrome'});
 const errors=[];
 for(const touch of [false,true]){
  page=await browser.newPage({viewport:{width:touch?390:1440,height:1000},hasTouch:touch,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('taalroute-poc0141-settings',JSON.stringify({practiceLayout:'topic'})));await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();
  async function activate(locator,keyboard=false){if(keyboard){await locator.focus();await locator.press(keyboard===3?'Enter':'Space')}else if(touch)await locator.tap();else await locator.click()}
  async function expectStep(step,label){
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   assert.deepEqual(await page.locator('[data-practice-step][open]').evaluateAll(es=>es.map(e=>e.dataset.practiceStep)),step?[step]:[],label);
  }
  for(let round=0;round<4;round++)for(const topic of ['ER','ZULLEN','ZOUDEN']){
   const topicStep=page.locator('[data-practice-step=topic]');if(!await topicStep.evaluate(e=>e.open))await activate(topicStep.locator(':scope > summary'));
   const id=await page.evaluate(topic=>DIGIBORD_CONTENT_CATALOG.families.find(f=>f.id==='grammar').topics.find(t=>t.navigationCategory&&t.sourceTopics.includes(topic)&&t.rows.some(i=>DigiRoutes.classification(i).FreePlayGate==='FREE')).id,topic);
   const choice=page.locator(`[data-choose-topic="${id}"]`);for(const group of await page.locator('.practice-topic-group').filter({has:choice}).all())if(!await group.evaluate(e=>e.open))await activate(group.locator(':scope > summary'));
   await activate(choice,round>=2&&!touch?round:false);await expectStep('level',`${touch} ${topic} topic advances`);
   // Never open the next step in the test: its choices must already be visible.
   // Choose only routes actually available for the selected concrete goal.
   const levels=await page.locator('input[name=level]').evaluateAll(es=>es.map(e=>e.value));assert.ok(levels.length);
   const selected=await page.evaluate(()=>ContentUI.state().level),level=round<2?levels[round%levels.length]:levels.includes(selected)?selected:levels[0];
   const input=page.locator(`input[name=level][value="${level}"]`),label=input.locator('..');
   await activate(round>=2&&!touch?input:label,round>=2&&!touch?round:false);await expectStep('game',`${touch} ${topic} ${level} level advances`);
   const engine=round===0?'CARDS':round===1?'WHEEL':'CARDS',gameInput=page.locator(`input[name=engine][value="${engine}"]`);
   await activate(round>=2&&!touch?gameInput:gameInput.locator('..'),round>=2&&!touch?round:false);await expectStep(null,`${touch} ${topic} game completes`);
   assert.equal(await page.locator('#practiceStart').isEnabled(),true);
   // Same selected level and same selected game must also advance without change events.
   await activate(page.locator('[data-practice-step=level]>summary'));
   await activate(page.locator(`input[name=level][value="${level}"]`).locator('..'));await expectStep('game','same level');
   await activate(page.locator(`input[name=engine][value="${engine}"]`).locator('..'));await expectStep(null,'same game');
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS automatic steps for Er/Zullen/Zouden: changed and repeated topic/level/game, mouse, touch, Space/Enter, no helper opening the expected next step.');
})().catch(async e=>{console.error(e);if(page&&!page.isClosed()){console.error(await page.locator('#practiceForm').innerText());await page.screenshot({path:path.join(root,'tests/artifacts/practice-advance-failure.png')});}process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(r=>server.close(r))});
