const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto(process.env.BASE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 for(const [width,height] of [[1920,1080],[1440,900],[1366,768]]){
  await page.setViewportSize({width,height});
  const failures=await page.evaluate(()=>{const errors=[];for(const kind of CARD_GAMES.map(c=>c.id))for(const c of cardsFor(kind,true)){
   APP.level=({R0:'A0',R1:'A1',R2:'A1+',R3:'A2',R4:'B1',R5:'B2',R6:'C1'}[c.routeId])||'C2';APP.cardIndex=cardsFor(kind).findIndex(x=>x.id===c.id);delete APP.cardRound;APP.cardShuffles={};APP.last={type:'card',data:{kind:kind}};startCards(kind);
   const check=()=>{const card=document.querySelector('.active-card'),text=document.querySelector('.card-content'),bar=document.querySelector('.gamebar');if(text.scrollWidth>text.clientWidth+1||['auto','scroll'].includes(getComputedStyle(text).overflowY))errors.push(c.id);const work=document.querySelector('.card-work');work.scrollTop=work.scrollHeight;if(document.querySelector('.card-controls').getBoundingClientRect().bottom>bar.getBoundingClientRect().top+1)errors.push(c.id+' controls unreachable');work.scrollTop=0;if(/pilot|AI-redactie|proefset/i.test(card.innerText))errors.push(c.id+' system copy')};check();if(kind==='tongue'){const work=document.querySelector('.card-work');work.scrollTop=work.scrollHeight;const p=document.querySelector('.tongue-text'),range=document.createRange();range.setStart(p.firstChild,p.firstChild.length-1);range.setEnd(p.firstChild,p.firstChild.length);if(range.getBoundingClientRect().bottom>document.querySelector('.gamebar').getBoundingClientRect().top+1)errors.push(c.id+' end unreachable');work.scrollTop=0}
   if(kind==='c1-between-lines'){document.querySelector('[data-c1-choice]').click();check();document.querySelector('#c1Review').click();check();document.querySelector('#c1Review').click();check()}
  }return errors});assert.deepEqual(failures,[],`all card content fits at ${width}`);
 }
 console.log('PASS: all 330 other cards remain readable without clipping or nested scrolling; all 240 fixed large tongue twisters remain reachable on three classroom viewports, including C1 feedback/question review; no pilot copy.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
