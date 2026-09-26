const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto(process.env.BASE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 for(const [width,height] of [[1920,1080],[1440,900],[1366,768]]){
  await page.setViewportSize({width,height});
  const failures=await page.evaluate(()=>{const errors=[];for(const kind of CARD_GAMES.map(c=>c.id))for(const c of cardsFor(kind,true)){
   APP.level=({R0:'A0',R1:'A1',R2:'A1+',R3:'A2',R4:'B1',R5:'B2',R6:'C1'}[c.routeId])||'C2';APP.cardIndex=cardsFor(kind).findIndex(x=>x.id===c.id);delete APP.cardRound;startCards(kind);
   const check=()=>{const card=document.querySelector('.active-card'),text=document.querySelector('.card-content'),bar=document.querySelector('.gamebar');if(card.getBoundingClientRect().bottom>bar.getBoundingClientRect().top+1||text.scrollWidth>text.clientWidth+1||text.scrollHeight>text.clientHeight+1)errors.push(c.id);if(/pilot|AI-redactie|proefset/i.test(card.innerText))errors.push(c.id+' system copy')};check();
   if(kind==='c1-between-lines'){document.querySelector('[data-c1-choice]').click();check();document.querySelector('#c1Review').click();check();document.querySelector('#c1Review').click();check()}
  }return errors});assert.deepEqual(failures,[],`all card content fits at ${width}`);
 }
 console.log('PASS: all 570 cards fit without scrolling or clipping on three classroom viewports, including C1 feedback/question review; no pilot copy.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
