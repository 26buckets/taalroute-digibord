const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,file=path.resolve(served,'.'+(p==='/'?'/index.html':decodeURIComponent(p)));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 await page.getByRole('button',{name:'Kaartspellen Praat, denk en oefen met kaarten.'}).click();
 await page.locator('[data-card-family=quick]').click();
 assert.equal(await page.locator('[data-browse-family=quick]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('[data-grammar-category]').count(),0);
 assert.ok(await page.locator('[data-choose-topic=vertel]').isVisible());
 await page.locator('[data-choose-topic=vertel]').click();await page.locator('label:has([name=level][value=A0_A1])').click();
 await page.locator('[name=duration]').selectOption('300');assert.equal(await page.locator('.practice-count strong').innerText(),'5');assert.match(await page.locator('.practice-summary').innerText(),/125 beschikbare opdrachten/);assert.match(await page.locator('.practice-summary').innerText(),/Tijd is een schatting/);
 await page.locator('#practiceOverview').click();const frame=page.frameLocator('#settingsOverlay iframe');await frame.locator('[data-ov-explain]').click();
 const examples=frame.locator('#contentDidactic .ov-example');await examples.first().waitFor();const second=await examples.nth(1).innerText();assert.match(second,/Ik spreek/);assert.doesNotMatch(second,/kernboodschap/);assert.match(second,/Docenttip/);assert.match(second,/Werkvorm/);assert.match(await frame.locator('#contentDidactic').innerText(),/beschikbaar bij deze keuzes/);
 await frame.locator('[data-ov-prepare]').click();assert.equal(await page.locator('#settingsOverlay').evaluate(e=>e.classList.contains('open')),false);
 // The overview prepares the pool; the duration chooses the actual lesson, not all 125 tasks.
 for(const seconds of [300,600]){
  await page.locator('[name=duration]').selectOption(String(seconds));await page.locator('#practiceStart').click();assert.equal(await page.locator('.card-counter').innerText(),`1 van ${seconds/60}`);
  const before=await page.evaluate(()=>JSON.stringify(ContentRuntime.activeSession()));
  await page.locator('#contentCardReveal').click();assert.ok((await page.locator('#contentCardAnswer').innerText()).length>35);assert.doesNotMatch(await page.locator('#contentCardAnswer').innerText(),/kernboodschap/);
  assert.equal(await page.evaluate(()=>JSON.stringify(ContentRuntime.activeSession())),before,'Showing support must not mutate the saved content');
  await page.locator('#contentCardMenu').click();await page.locator('[data-card-family=quick]').click();
 }
 await page.locator('#practiceOverview').click();await frame.locator('[data-ov-explain]').click();await frame.locator('#ovRoute').selectOption('A2_B1');
 assert.match(await frame.locator('#contentDidactic').innerText(),/kennismaking/);assert.match(await frame.locator('#contentDidactic').innerText(),/Luisteraar|luisteraar/);
 const dir=path.join(root,'tests/artifacts/quick-lesson-guidance');fs.mkdirSync(dir,{recursive:true});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});const bounds=await frame.locator('.content').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth}));assert.ok(bounds.scroll<=bounds.width+1,'No horizontal overflow');
  await examples.first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(dir,`didactic-${width}.png`)});
 }
 assert.deepEqual(errors,[]);console.log('PASS real entries, source-bound help, inventory vs lesson size, 5/10 cards, unchanged session and desktop/mobile layout.');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
