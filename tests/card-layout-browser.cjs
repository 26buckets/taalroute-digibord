const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 await page.waitForFunction(()=>window.LessonUI);
 async function check(){
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const result=await page.evaluate(()=>{
   const shell=document.querySelector('.card-viewport'),work=shell.querySelector('.card-work'),card=shell.querySelector('.active-card'),text=shell.querySelector('.card-content'),bar=shell.querySelector('.gamebar'),reset=document.querySelector('#cardOrderReset'),next=document.querySelector('#primaryGame');
   const a=card.getBoundingClientRect(),b=bar.getBoundingClientRect(),r=reset.getBoundingClientRect(),n=next.getBoundingClientRect();
   return {workFits:work.scrollHeight<=work.clientHeight+1,textFits:text.scrollHeight<=text.clientHeight+1&&text.scrollWidth<=text.clientWidth+1,cardFits:a.top>=0&&a.bottom<=b.top+1,resetFits:r.width===44&&r.height===44&&r.x>=n.right&&r.right<=innerWidth&&r.top>=n.top&&r.bottom<=n.bottom,iconOnly:reset.textContent.trim()==='',label:reset.getAttribute('aria-label'),overflow:document.documentElement.scrollWidth>innerWidth};
  });assert.deepEqual(result,{workFits:true,textFits:true,cardFits:true,resetFits:true,iconOnly:true,label:'Kaartvolgorde opnieuw beginnen',overflow:false},JSON.stringify(await page.evaluate(()=>({id:currentCard()?.id,width:innerWidth,height:innerHeight,section:document.querySelector('#cardSupport')?.dataset.section,zoom:document.querySelector('.card-content').style.zoom,sh:document.querySelector('.card-content').scrollHeight,ch:document.querySelector('.card-content').clientHeight}))));
 }
 for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[1440,650],[1024,768],[768,1024],[390,844],[320,568]]){
  await page.setViewportSize({width,height});
  for(const kind of await page.evaluate(()=>ReleasePolicy.cardKinds)){
   await page.evaluate(k=>{APP.cardGuided=true;goScreen('cards');selectLevel('B2_C1');prepareCards(k)},kind);await check();
   if(kind==='tongue'){
    await page.evaluate(()=>{APP.cardIndex=cardsFor('tongue').indexOf(cardsFor('tongue').reduce((a,b)=>a.text.length>b.text.length?a:b));APP.cardShuffles={};APP.last={type:'card',data:{kind:'tongue'}};startTongue()});await check();
    assert.equal(await page.locator('#tongueRead').innerText(),'Voorlezen');assert.equal(await page.locator('#tongueRead').isDisabled(),true);
   }else{if(await page.evaluate(()=>!!currentCard().visualRebus)){assert.equal(await page.locator('#cardGoals').isDisabled(),true);await page.locator('#cardAttempt').click()}await page.locator('#cardGoals').click();await check();await page.locator('#cardGoals').click();await check()}
  }
  await page.evaluate(()=>{ContentUI.setState({family:'grammar',topic:'ER',level:'B1_B2',engine:'CARDS',focus:'all',subtopic:'all',duration:600});ContentUI.start(33)});await check();
  await page.locator('#contentCardReveal').click();await check();await page.locator('#contentCardReveal').click();await check();
  if(width<=850){await page.locator('#contentCardMenu').click();await page.evaluate(()=>prepareCards('tongue'));await page.locator('#cardMenuOpen').click();assert.ok(await page.locator('#screen-cards.active').count())}
  await page.evaluate(()=>prepareCards('tongue'));await check();
  if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`card-fit-${width}-${height}.png`)})}
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);await check();await page.locator('#primaryGame').click();await check();await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!document.fullscreenElement);await check();
 const before=await page.evaluate(()=>structuredClone(APP.cardShuffles));await page.locator('#cardOrderReset').click();await page.locator('#dialogClose').click();assert.deepEqual(await page.evaluate(()=>APP.cardShuffles),before);
 await page.locator('#cardOrderReset').click();await page.locator('#confirmCardOrderReset').click();await check();assert.equal(await page.evaluate(()=>APP.cardShuffles.tongue.position),1);
 assert.deepEqual(errors,[]);console.log('PASS: seven released standalone families and prepared cards fit without scrolling at eight screen sizes; long tongue twisters, revealed help/answers, compact reset + confirmation, disabled Voorlezen, mobile card menu, resize and fullscreen.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
