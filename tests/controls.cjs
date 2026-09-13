const {chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/Start-Praatpad.html`);
 assert.equal(await page.locator('#pp-main-tools button').count(),3);
 await page.locator('[data-node="1"]').click();await page.locator('#pp-use-task').click();
 async function check(){
 const issues=await page.evaluate(()=>{
 const issues=[];if(document.getElementById('pp-roll').getBoundingClientRect().height<140)issues.push('die too small for the board');for(const e of document.querySelectorAll('#pp-main-tools button,#db-open-exercise,#db-map-tools button,#db-round-controls button,#pp-group')){
 if(!e.getClientRects().length)continue;const r=e.getBoundingClientRect();
 if(r.bottom>innerHeight+.5||r.right>innerWidth||r.top<0)issues.push(e.id+' outside viewport '+r.bottom);
 if(!e.disabled&&!e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)))issues.push(e.id+' covered');
 if(e.closest('#pp-main-tools')&&(r.width<44||r.height<44))issues.push(e.id+' too small');
 }
 if(document.documentElement.scrollHeight>innerHeight)issues.push('page scrolls');return issues;
 });if(issues.length){await page.screenshot({path:__dirname+'/artifacts/controls-overflow.png'});console.log(await page.locator('.pp-play-controls').evaluate(e=>[...e.children].map(e=>[e.id||e.className,e.getBoundingClientRect().height])));}assert.deepEqual(issues,[]);
 }
 for(const mode of ['class','teams']){
 await page.evaluate(mode=>{const d=JSON.parse(localStorage.getItem(DigiBoard.storageKey()));d.session.mode=mode;d.session.players=DigiBoardLearning.players(mode,d.session.people,5);d.session.active=0;d.settings.workForm='pairs';localStorage.setItem(DigiBoard.storageKey(),JSON.stringify(d));DigiBoard.saveShared(d);},mode);await page.reload();
 for(const size of [{width:1366,height:768},{width:1280,height:720},{width:1024,height:768},{width:1920,height:1080}]){await page.setViewportSize(size);await check();}
 }
 await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem(DigiBoard.storageKey()));d.session.roundResults=d.session.players.map(p=>({id:p.id,roll:1,to:1}));localStorage.setItem(DigiBoard.storageKey(),JSON.stringify(d));});await page.reload();
 await check();
 await page.setViewportSize({width:1366,height:768});
 await page.locator('#pp-fullscreen').click();await page.waitForFunction(()=>!!document.fullscreenElement);await check();
 await page.locator('#pp-pause-button').click();assert(await page.locator('#pp-paused').isVisible());await check();await page.locator('#pp-pause-button').click();
 await page.locator('#pp-settings-button').click();assert(await page.locator('#pp-settings').isVisible());await page.locator('#pp-settings-close').click();
 await page.locator('#world-route-help').click();assert.equal(await page.locator('#world-route-help').getAttribute('aria-pressed'),'true');
 await page.locator('#map-rules-button').click();assert(await page.locator('#pp-dialog').isVisible());await page.locator('#pp-dialog-close').click();
 await page.locator('#db-pawns').click();assert(await page.locator('#pp-dialog').isVisible());await page.locator('#pp-dialog-close').click();
 await page.locator('#db-open-maps').click();assert(await page.locator('[data-choose-world]').first().isVisible());await page.locator('#pp-dialog-close').click();
 await page.screenshot({path:__dirname+'/artifacts/controls-fullscreen.png'});
 await page.locator('#pp-fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement);
 assert.deepEqual(errors,[]);console.log('PASS toolbar hit targets, sidebar bounds, shared/team pawns, fullscreen pause/settings/map controls');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
