import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.LIVE_TEST_URL||'http://127.0.0.1:8799';
const out=new URL('../test-results/zinnenbouwer/',import.meta.url);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[];
const track=page=>page.on('pageerror',e=>errors.push(e.message));
const teacher=await browser.newPage({viewport:{width:1440,height:1000}});track(teacher);
const action=(page,id)=>page.locator(`[data-action="${id}"]`).click();
const order=page=>page.locator('[data-zone="sentence"] [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));
async function setup(page,type='sentenceBuild'){
 await page.goto(base+'/zinnenbouwer.html');await action(page,'new');
 for(const id of ['time','place','secondVerb'])await page.locator(`[data-enable="${id}"]`).check();
 await action(page,'next');await action(page,'next');assert.ok(await page.locator('[data-error]').innerText());
 for(const [id,value] of Object.entries({subject:'ik',finiteVerb:'wil',time:'morgen',place:'thuis',secondVerb:'werken'}))await page.locator(`[data-value="${id}"]`).fill(value);
 await page.locator('[data-lemma="finiteVerb"]').fill('willen');
 await action(page,'next');await page.locator(`[data-mode="${type}"]`).click();await action(page,'next');await action(page,'class');
}
async function arrange(page,ids){
 // Only visible UI: empty the movable row, then tap the desired cards.
 for(const id of await order(page)){
  const card=page.locator(`[data-zone="sentence"] [data-card="${id}"]`);
  if(await card.getAttribute('data-fixed')==='true')continue;
  await card.click();await action(page,'return');
 }
 for(const id of ids)if(!(await order(page)).includes(id))await page.locator(`[data-zone="bank"] [data-card="${id}"]`).click();
}
const normal=['subject','finiteVerb','time','place','secondVerb'],inverted=['time','finiteVerb','subject','place','secondVerb'];
try{
 await teacher.goto(base+'/index.html');await teacher.locator('#screen-play [data-category="workforms"]').click();
 assert.equal(await teacher.locator('#screen-practice a[href="zinnenbouwer.html"]').isVisible(),true);
 await setup(teacher);const initialBank=await teacher.locator('[data-zone="bank"] [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card));await action(teacher,'mix');assert.notDeepEqual(await teacher.locator('[data-zone="bank"] [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card)),initialBank);await action(teacher,'undo');assert.deepEqual(await teacher.locator('[data-zone="bank"] [data-card]').evaluateAll(es=>es.map(e=>e.dataset.card)),initialBank);await arrange(teacher,normal);assert.equal(await teacher.locator('[data-feedback]').getAttribute('data-status'),'correct');
 // Real mouse drag, with intermediate pointermove events.
 const source=await teacher.locator('[data-zone="sentence"] [data-card="time"]').boundingBox(),dest=await teacher.locator('[data-zone="sentence"] [data-card="subject"]').boundingBox();
 await teacher.mouse.move(source.x+source.width/2,source.y+source.height/2);await teacher.mouse.down();await teacher.mouse.move(dest.x+8,dest.y+dest.height/2,{steps:12});await teacher.mouse.up();
 assert.deepEqual(await order(teacher),['time','subject','finiteVerb','place','secondVerb']);assert.equal(await teacher.locator('[data-feedback]').getAttribute('data-status'),'incorrect');
 await teacher.locator('[data-card="finiteVerb"]').focus();await teacher.keyboard.press('ArrowLeft');assert.deepEqual(await order(teacher),inverted);assert.equal(await teacher.locator('[data-feedback]').getAttribute('data-status'),'correctAlternative');
 await action(teacher,'undo');assert.equal(await teacher.locator('[data-feedback]').getAttribute('data-status'),'incorrect');await action(teacher,'solution');assert.deepEqual(await order(teacher),normal);
 await teacher.screenshot({path:new URL('teacher-desktop.png',out).pathname,fullPage:true});
 for(const type of ['reorder','completeSentence','repairSentence']){
  await setup(teacher,type);
  if(type==='completeSentence'){assert.equal(await teacher.locator('[data-fixed="true"]').count(),4);await arrange(teacher,normal);}
  else {if(type==='repairSentence')assert.equal(await teacher.locator('[data-feedback]').getAttribute('data-status'),'incorrect');await arrange(teacher,inverted);}
  assert.match(await teacher.locator('[data-feedback]').getAttribute('data-status'),/^correct/);
 }
 await setup(teacher);await arrange(teacher,normal);
 // Failure path must preserve classroom functionality.
 await teacher.route('**/api/live/sessions',r=>r.abort());await action(teacher,'live');await teacher.waitForFunction(()=>document.querySelector('[data-error]').textContent.includes('klassikaal'));
 await action(teacher,'clear');assert.equal((await order(teacher)).length,0);await action(teacher,'solution');assert.deepEqual(await order(teacher),normal);await teacher.unroute('**/api/live/sessions');
 await action(teacher,'live');await teacher.locator('[data-action="start"]').waitFor();assert.equal(await teacher.locator('[data-qr] svg').count(),1);
 const code=(await teacher.locator('.zb-code').innerText()).trim();assert.match(code,/^\d{6}$/);
 const contexts=[],pages=[];
 for(let i=0;i<3;i++){
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});contexts.push(ctx);
  const page=await ctx.newPage();track(page);pages.push(page);await page.goto(base+'/meedoen.html?code='+code);await page.locator('#name').fill('Deelnemer '+(i+1));await page.locator('form button').click();await page.getByText('Wacht op de docent',{exact:true}).waitFor();
 }
 await teacher.waitForFunction(()=>document.querySelector('[data-counts]').textContent.includes('3 deelnemers'));
 await action(teacher,'start');for(const p of pages)await p.locator('[data-board]').waitFor();
 await arrange(pages[0],normal);await arrange(pages[1],normal);await arrange(pages[2],['time','subject','finiteVerb','place','secondVerb']);
 // Native touch events through CDP verify the shared Pointer Events implementation.
 const touch=await contexts[0].newCDPSession(pages[0]);
 const from=await pages[0].locator('[data-zone="sentence"] [data-card="time"]').boundingBox(),to=await pages[0].locator('[data-zone="sentence"] [data-card="subject"]').boundingBox();
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from.x+from.width/2,y:from.y+from.height/2}]});
 for(let step=1;step<=8;step++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+from.width/2+(to.x+5-from.x-from.width/2)*step/8,y:from.y+from.height/2+(to.y+to.height/2-from.y-from.height/2)*step/8}]});
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.deepEqual(await order(pages[0]),['time','subject','finiteVerb','place','secondVerb']);await arrange(pages[0],normal);
 await pages[0].screenshot({path:new URL('participant-mobile.png',out).pathname,fullPage:true});
 // Interrupt the real network, preserve order, reload offline draft after reconnect.
 await contexts[0].setOffline(true);await pages[0].waitForTimeout(1200);assert.deepEqual(await order(pages[0]),normal);
 await contexts[0].setOffline(false);await pages[0].reload();await pages[0].locator('[data-board]').waitFor();assert.deepEqual(await order(pages[0]),normal);
 // Simulate a dropped HTTP response after the server has accepted the answer.
 await pages[0].route('**/api/live/*/command',async route=>{await route.fetch();await route.abort();});
 for(const p of pages){await p.locator('[data-action="submit"]:enabled').waitFor();await action(p,'submit');await p.getByText('Je antwoord is ontvangen. Wacht op de docent.',{exact:true}).waitFor();}
 await pages[0].unroute('**/api/live/*/command');assert.equal(await pages[0].locator('[data-error]').innerText(),'');
 await teacher.waitForFunction(()=>document.querySelector('[data-counts]').textContent.includes('3 antwoorden'));
 assert.equal(await teacher.locator('[data-comparison] article').count(),0);
 await action(teacher,'review');await teacher.locator('.zb-group').first().waitFor();assert.equal(await teacher.locator('.zb-group').count(),2);assert.deepEqual(await teacher.locator('.zb-group b').allTextContents(),['2','1']);
 await teacher.locator('.zb-group').nth(0).click();await teacher.locator('.zb-group').nth(1).click();assert.equal(await teacher.locator('[data-comparison] article').count(),0);
 await action(teacher,'show');assert.equal(await teacher.locator('[data-comparison] article').count(),2);await teacher.screenshot({path:new URL('comparison.png',out).pathname,fullPage:true});
 await action(teacher,'again');for(const p of pages){await p.locator('[data-action="submit"]').waitFor();assert.equal((await order(p)).length,0);}
 await arrange(pages[0],inverted);await action(pages[0],'submit');await teacher.waitForFunction(()=>document.querySelector('[data-counts]').textContent.includes('1 antwoorden'));
 await action(teacher,'review');await action(teacher,'again-mix');for(const p of pages)await p.locator('[data-action="submit"]').waitFor();
 // Reload host credentials: same session and no lost participant count.
 await teacher.reload();await teacher.waitForFunction(()=>document.querySelector('[data-counts]')?.textContent.includes('3 deelnemers'));
 assert.equal((await teacher.locator('.zb-code').innerText()).trim(),code);
 for(const [width,height] of [[1920,1080],[1366,768],[390,844],[320,568]]){
  await teacher.setViewportSize({width,height});assert.ok(await teacher.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const b of await teacher.locator('button:visible').all()){const box=await b.boundingBox();assert.ok(box.height>=44&&box.width>=44,'touch target '+await b.innerText());}
 }
 await teacher.screenshot({path:new URL('teacher-mobile.png',out).pathname,fullPage:true});
 await action(teacher,'close');await pages[0].getByText('De sessie is afgelopen',{exact:true}).waitFor();
 const closed=await contexts[0].newPage();await closed.goto(base+'/meedoen.html?code='+code);await closed.locator('form button').click();await closed.waitForFunction(()=>document.querySelector('[data-error]').textContent.includes('gesloten'));
 const unknown=await browser.newPage();await unknown.goto(base+'/meedoen.html?code=000000');await unknown.locator('form button').click();await unknown.waitForFunction(()=>document.querySelector('[data-error]').textContent.includes('niet bekend'));
 assert.deepEqual(errors,[]);await fs.writeFile(new URL('results.json',out),JSON.stringify({status:'PASS',clients:4,exercises:4,mouseDrag:true,touchDrag:true,offlineDraft:true,reconnect:true,grouping:true,explicitComparison:true,newRounds:true,hostReload:true,closed:true,unknown:true,viewports:[1920,1366,390,320],errors},null,2));
 console.log('PASS: four exercises, teacher/mouse/keyboard, native touch, three mobile clients, offline/reload, realtime grouping, explicit compare, new rounds, host reload, closure, unknown code, four sizes.');
}finally{await browser.close();}
