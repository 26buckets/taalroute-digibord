const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser,page;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'chrome'});page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();
 assert.equal(await page.locator('[data-practice-step=topic] .practice-open-title').innerText(),'Wat wil je oefenen?');
 assert.ok(await page.evaluate(()=>document.querySelector('#practiceForm').compareDocumentPosition(document.querySelector('.practice-inventory'))&Node.DOCUMENT_POSITION_FOLLOWING));
 await page.locator('.practice-topic-group').first().locator('summary').click();
 const dir=path.join(root,'tests/artifacts/open-quiet');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,'oefenen.png')});
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  const steps=await page.locator('.practice-step').evaluateAll(es=>es.map(el=>{const head=el.querySelector('summary'),badge=head.querySelector('.practice-step-number'),r=badge.getBoundingClientRect(),s=getComputedStyle(badge);return {width:r.width,height:r.height,font:parseFloat(s.fontSize),headHeight:head.getBoundingClientRect().height,open:el.open,color:getComputedStyle(head).backgroundColor,overflow:head.scrollWidth>head.clientWidth+1}}));
  assert.ok(steps.every(s=>s.width>=44&&s.height>=44&&s.font>=22&&s.headHeight>=80&&!s.overflow),`Readable step badges at ${width}: ${JSON.stringify(steps)}`);
  assert.notEqual(steps.find(s=>s.open).color,steps.find(s=>!s.open).color,'Open step stands out');
  await page.screenshot({path:path.join(dir,`stappen-${width}.png`)});
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('[name=duration]').selectOption('900');await page.locator('[name=organization]').selectOption('pairs');
 await page.reload();await page.locator('[data-main=practice]').click();assert.equal(await page.locator('[name=duration]').inputValue(),'900');assert.equal(await page.locator('[name=organization]').inputValue(),'pairs');
 await page.locator('#settingsBtn').click();const frame=page.frameLocator('#settingsOverlay iframe');await frame.locator('.nav-btn').first().waitFor();
 const pages=await frame.locator('.nav-btn').evaluateAll(es=>es.map(e=>e.dataset.page));
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  for(const name of pages){
   await frame.locator(`.nav-btn[data-page="${name}"]`).click();
   const overflow=await frame.locator('.content').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
   assert.ok(overflow.scroll<=overflow.width+1,`Settings ${name} at ${width}: ${JSON.stringify(overflow)}`);
   const clipped=await frame.locator('.page.active').evaluate(el=>{const bounds=el.closest('.content').getBoundingClientRect();return [...el.querySelectorAll('button,input:not([type=hidden]),select')].filter(x=>x.getClientRects().length).filter(x=>{const r=x.getBoundingClientRect();return r.right>bounds.right+1||r.left<bounds.left-1}).map(x=>x.id||x.className)});
   assert.deepEqual(clipped,[],`Clipped controls ${name} ${width}`);
   if(width===1440&&['people','lesson','practice','didactic','sound'].includes(name)||width===390&&name==='people')await page.screenshot({path:path.join(dir,`${name}-${width}.png`)});
  }
 }
 await frame.locator('.nav-btn[data-page=practice]').click();await frame.locator('#practiceLayout').selectOption('level');await frame.locator('.back-btn').click();await page.waitForFunction(()=>!document.querySelector('#settingsOverlay').classList.contains('open'));
 assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'level');
 assert.deepEqual(errors,[]);console.log(`PASS open/quiet order, preparation reload, ${pages.length} settings pages at four widths, preference round-trip and no clipped controls.`);
})().catch(async e=>{console.error(e);if(page)await page.screenshot({path:path.join(root,'tests/artifacts/open-quiet-failure.png')});process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(r=>server.close(r))});
