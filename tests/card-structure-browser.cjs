const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Historical structural contracts include the deliberately blocked Story40. Public E1 coverage lives in p0-cards-browser.cjs.
 await page.addInitScript(()=>{window.DigiBordArchiveReview=true});
 await page.goto(process.env.BASE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 const result=await page.evaluate(()=>{
  const errors=[],norm=s=>s.replace(/\s+/g,' ').trim(),source=JSON.stringify(RUNTIME.cardGames);
  for(const family of CARD_GAMES.filter(f=>!['tongue','c1-between-lines'].includes(f.id)))for(const c of cardsFor(family.id,true)){
   APP.level=({R0:'A0',R1:'A1',R2:'A1+',R3:'A2',R4:'B1',R5:'B2',R6:'C1'})[c.routeId];APP.cardIndex=cardsFor(family.id).findIndex(x=>x.id===c.id);delete APP.cardRound;APP.cardShuffles={};APP.last={type:'card',data:{kind:family.id}};startCards(family.id);
   const title=document.querySelector('.card-readable>h2'),steps=document.querySelectorAll('.card-actions li');
   if(!title?.textContent||!steps.length)errors.push(c.id+' structure');
   if(['mission','conversation'].includes(family.id)&&!document.querySelector('.card-roles')?.textContent.includes(lessonText(c.conversationPartner).split(';')[0]))errors.push(c.id+' role');
   if(norm(cardActionSteps(c.instruction).join(' '))!==norm(c.instruction))errors.push(c.id+' lost instruction');
   if(document.querySelector('[data-support="example"]').checkVisibility())errors.push(c.id+' answer visible');
  }
  return {errors,unchanged:source===JSON.stringify(RUNTIME.cardGames)};
 });assert.deepEqual(result,{errors:[],unchanged:true});
 const open=async(kind,id)=>page.evaluate(({kind,id})=>{APP.level='A2';APP.cardIndex=cardsFor(kind).findIndex(c=>c.id===id);delete APP.cardRound;APP.cardShuffles={};APP.last={type:'card',data:{kind:kind}};startCards(kind)}, {kind,id});
 for(const [width,height] of [[1440,900],[390,844]]){
  await page.setViewportSize({width,height});
  for(const [kind,id] of [['mission','TR-FSM-P001-010-R3'],['conversation','TR-CONVERSATION-P001-011-R3'],['verbs','TR-VERBS-P001-011-R3'],['spelling','TR-SPELLING-P001-011-R3'],['puzzles','TR-PUZZLES-P001-011-R3'],['story','TR-STORY-P001-014-R3'],['idioms','TR-IDIOMS-P002-010-R3']]){
   await open(kind,id);
   assert.ok(await page.locator('.card-readable>h2').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=28));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.ok(await page.locator('.card-readable').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
   if(kind==='mission'){
    assert.equal(await page.locator('.card-actions li').count(),3);
    const visible=await page.locator('.card-reading-main').innerText();assert.match(visible,/15.00.*17.00/);assert.doesNotMatch(visible,/maandag|borg/);
    await page.locator('#cardPartner').click();assert.equal(await page.locator('#cardRevealed').isVisible(),false);await page.locator('#cardReveal').click();assert.equal(await page.locator('#cardRevealed').isVisible(),true);await open(kind,id);
   }
   if(kind==='conversation'){const text=await page.locator('.card-situation').innerText();assert.match(text,/vier stoelen/);assert.match(text,/geen extra ruimte/)}
   if(kind==='puzzles'){assert.equal(await page.locator('.card-focus').innerText(),'FIETSBELHALTE');assert.equal(await page.locator('.card-focus strong').count(),0)}
   if(kind==='idioms')assert.doesNotMatch(await page.locator('.card-reading-main').innerText(),/terugbelafspraak/i);
   if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`${kind}-${width}.png`)});}
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS: 280 cards structured, sources intact, roles visible, answers hidden; seven approved examples readable on desktop/mobile with complete facts and delayed reveal.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
