const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.UI001_URL || 'http://127.0.0.1:8764/outputs/Taalroute-DigiBord-V01.24/index.html';
const out=process.env.UI001_OUTPUT_DIR || 'test-results/woordkaarten/';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const errors=[];
 const open=async(width=1366,height=768,touch=false)=>{const context=await browser.newContext({viewport:{width,height},hasTouch:touch});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.locator('[data-category="words"]').click();await p.locator('.word-legacy summary').click();await p.locator('[data-wordgame="build"]').click();return p;};
 const p=await open();
 const wait=async()=>p.waitForFunction(()=>!wordBusy);
 const state=async()=>p.evaluate(()=>JSON.parse(JSON.stringify(wordRound)));
 const selected=async()=>p.locator('#sentence [data-token]').evaluateAll(els=>els.map(x=>Number(x.dataset.token)));
 assert.equal(await p.locator('#wordSpeaking').isVisible(),true);assert.equal(await p.locator('#sentenceBuilder').isVisible(),false);assert.equal(await p.locator('#wordCheck').isVisible(),false);
 assert.equal(await p.locator('#spokenWords button').count(),0);assert.equal(await p.locator('#primaryGame').innerText(),'VOLGENDE KAART');
 assert.equal(await p.locator('#primaryGame .card-fan-icon').count(),1);assert.equal(await p.locator('.activity-navigation button:disabled').count(),3);
 await p.locator('#wordExample').click();assert.match(await p.locator('#wordFeedback').innerText(),/mogelijke zin.*Mijn zus leest/);assert.equal(await p.locator('#primaryGame').innerText(),'VOLGENDE KAART');
 await p.locator('#wordHint').click();assert.match(await p.locator('#wordFeedback').innerText(),/Wie leest/);
 await p.locator('[data-ghelp]').click();assert.equal(await p.locator('#dialogTitle').innerText(),'Spelhulp');await p.locator('#dialogClose').click();
 await p.locator('#wordArrange').click();assert.equal(await p.locator('#sentenceBuilder').isVisible(),true);assert.equal(await p.locator('#wordSpeaking').isVisible(),false);
 await p.locator('#wordBank [data-token="7"]').click();assert.deepEqual(await selected(),[7]);
 await p.locator('#sentence [data-token="7"]').click();assert.deepEqual(await selected(),[]);
 await p.locator('#wordBank [data-token="7"]').focus();await p.keyboard.press('Space');assert.deepEqual(await selected(),[7]);
 await p.locator('#wordBank [data-token="3"]').click();await p.locator('.sentence-tools summary').click();await p.locator('#wordLeft').click();assert.deepEqual(await selected(),[3,7]);
 await p.locator('#wordRight').click();assert.deepEqual(await selected(),[7,3]);await p.locator('#undoAction').click();assert.deepEqual(await selected(),[3,7]);
 await p.locator('#wordClear').click();await p.locator('#undoAction').click();assert.deepEqual(await selected(),[3,7]);await p.locator('#wordClear').click();
 await p.locator('.words-activity .card-content').evaluate(el=>el.scrollTop=0);
 async function drag(page,source,target,edge=.5){await source.scrollIntoViewIfNeeded();const a=await source.boundingBox(),z=await target.boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(z.x+z.width*edge,z.y+z.height/2,{steps:10});await page.mouse.up();}
 await drag(p,p.locator('#wordBank [data-token="7"]'),p.locator('#sentence'));assert.deepEqual(await selected(),[7]);
 await p.locator('#wordBank [data-token="3"]').click();await drag(p,p.locator('#sentence [data-token="3"]'),p.locator('#sentence [data-token="7"]'),.1);assert.deepEqual(await selected(),[3,7]);
 await drag(p,p.locator('#sentence [data-token="3"]'),p.locator('#wordBank'));assert.deepEqual(await selected(),[7]);
 await p.locator('#wordClear').click();for(const id of await p.evaluate(()=>sentenceContent().order))await p.locator(`#wordBank [data-token="${id}"]`).click();
 await p.locator('#wordCheck').click();assert.match(await p.locator('#wordFeedback').innerText(),/^Goed gedaan/);assert.equal(await p.locator('#primaryGame').innerText(),'VOLGENDE KAART');
 await p.locator('#wordArrange').click();assert.equal(await p.locator('#wordCheck').isVisible(),false);await p.locator('#wordArrange').click();assert.equal((await selected()).length,8);
 await p.locator('#modeSelect').selectOption('individual');const actor=await p.locator('.turnzone .chip.active').innerText();
 await p.locator('#primaryGame').click();await wait();assert.equal((await state()).round,2);assert.equal((await state()).arranging,false);assert.notEqual(await p.locator('.turnzone .chip.active').innerText(),actor);assert.match(await p.locator('#spokenWords').innerText(),/afspraak/);
 await p.locator('#undoAction').click();assert.equal((await state()).round,1);assert.equal((await state()).arranging,true);assert.equal((await selected()).length,8);assert.equal(await p.locator('.turnzone .chip.active').innerText(),actor);
 await p.locator('#wordDeck').click();await wait();assert.equal((await state()).round,2);
 // Guard a second next-card request during the shared draw animation.
 await p.locator('#primaryGame').click();await p.evaluate(()=>nextWordCard());await wait();assert.equal((await state()).round,3);
 // Incomplete and alternative orders do not automatically reject spoken answers.
 await p.locator('#wordArrange').click();await p.locator('#wordBank button').first().click();await p.locator('#wordCheck').click();assert.match(await p.locator('#wordFeedback').innerText(),/alle woorden/);
 await p.locator('#wordClear').click();for(const id of await p.evaluate(()=>sentenceContent().order.slice().reverse()))await p.locator(`#wordBank [data-token="${id}"]`).click();await p.locator('#wordCheck').click();assert.match(await p.locator('#wordFeedback').innerText(),/Kan deze volgorde ook/);
 // Every production card is reachable through the real next-card button.
 const deck=await open();await deck.evaluate(()=>settingsPatch({reducedMotion:true}));
 const answers=new Set();
 for(let round=1;round<=30;round++){
  const card=await deck.evaluate(()=>sentenceContent());answers.add(card.answer);
  assert.equal(await deck.locator('.card-counter').innerText(),`${round} / 30`);
  assert.equal(await deck.locator('.word-structure').innerText(),card.structure);
  assert.equal(await deck.locator('#spokenWords [role="listitem"]').count(),card.words.length);
  await deck.locator('#wordHint').click();assert.equal(await deck.locator('#wordFeedback').innerText(),card.hint);
  await deck.locator('#wordExample').click();assert.ok((await deck.locator('#wordFeedback').innerText()).includes(card.answer));assert.ok((await deck.locator('#wordFeedback').innerText()).includes(card.variation));
  if(round>=21){
   assert.equal(await deck.locator('#wordLead').innerText(),card.prefix);
   await deck.locator('#wordArrange').click();
   for(const id of card.order)await deck.locator(`#wordBank [data-token="${id}"]`).click();
   await deck.locator('#wordCheck').click();assert.ok((await deck.locator('#wordFeedback').innerText()).startsWith('Goed gedaan. '+card.answer));
   await deck.locator('#wordWhole').check();assert.equal(await deck.locator('#wordLead').isVisible(),false);assert.equal(await deck.locator('#sentence [data-token]').count(),0);
   await deck.locator('#undoAction').click();assert.equal(await deck.locator('#wordWhole').isChecked(),false);assert.equal(await deck.locator('#sentence [data-token]').count(),card.words.length);
   await deck.locator('#wordWhole').check();
   for(const id of await deck.evaluate(()=>sentenceContent().order))await deck.locator(`#wordBank [data-token="${id}"]`).click();
   await deck.locator('#wordCheck').click();assert.match(await deck.locator('#wordFeedback').innerText(),/^Goed gedaan/);
  }
  await deck.locator('#primaryGame').click();await deck.waitForFunction(()=>!wordBusy);
 }
 assert.equal(answers.size,30);assert.equal(await deck.locator('.card-counter').innerText(),'1 / 30');await deck.close();
 console.log('PASS: all 30 cards through real navigation; unique answers, specific help and variations; 10 clauses in both modes, reset, undo and deck wraparound.');
 console.log('PASS: speaking default, optional arranging, click/keyboard/drag/reorder/return, local checks, example/help, new cards, participants, undo and animation guard.');
 for(const [name,w,h]of[['digibord',1920,1080],['desktop',1366,768],['klein',800,700],['smal',600,700]]){
  const q=await open(w,h);const metrics=await q.evaluate(()=>{const b=document.querySelector('#primaryGame').getBoundingClientRect();const scroll=document.querySelector('.words-activity .game-work');return{overflow:scroll.scrollWidth>scroll.clientWidth||document.documentElement.scrollWidth>innerWidth,primary:b.bottom<=innerHeight&&b.left>=0&&b.right<=innerWidth,actions:[...document.querySelectorAll('.words-activity .card-tools button:not([hidden])')].every(x=>x.getBoundingClientRect().height>=44)}});assert.deepEqual(metrics,{overflow:false,primary:true,actions:true},name);
  if(w>=1366)assert.equal(await q.locator('.card-content').evaluate(el=>el.scrollHeight<=el.clientHeight+2),true,name+' speaking fits');
  await q.screenshot({path:out+name+'.png'});await q.locator('#wordArrange').click();await q.locator('#wordBank button').first().click();await q.locator('#wordCheck').click();assert.equal(await q.locator('#wordFeedback').isVisible(),true);await q.screenshot({path:out+name+'-leggen.png'});
  for(const round of [21,24,28]){
   await q.evaluate(round=>{wordRound=newSentenceRound(round);startWords();},round);
   for(const wholeSentence of [false,true]){
    await q.locator('#wordWhole').setChecked(wholeSentence);
    assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.querySelector('.game-work').scrollWidth>document.querySelector('.game-work').clientWidth),false,`${name}, card ${round}, whole ${wholeSentence}`);
    assert.equal(await q.locator('#wordLead').isVisible(),!wholeSentence);
    const box=await q.locator('#primaryGame').boundingBox();assert.ok(box.y+box.height<=h);
    if(round===24)await q.screenshot({path:out+name+(wholeSentence?'-hele-zin.png':'-bijzin.png')});
   }
  }
  await q.close();
 }
 console.log('PASS: four viewport sizes, fixed shared primary, no horizontal overflow, desktop speaking without scrolling.');
 const touch=await open(1366,900,true);await touch.locator('#wordArrange').tap();await touch.locator('#wordBank [data-token="7"]').tap();await touch.locator('#sentence [data-token="7"]').tap();
 const cdp=await touch.context().newCDPSession(touch);
 async function touchDrag(source,target){const a=await source.boundingBox(),z=await target.boundingBox();const from={x:a.x+a.width/2,y:a.y+a.height/2},to={x:z.x+z.width/2,y:z.y+z.height/2};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/10,y:from.y+(to.y-from.y)*i/10}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 await touchDrag(touch.locator('#wordBank [data-token="7"]'),touch.locator('#sentence'));assert.equal(await touch.locator('#sentence [data-token="7"]').count(),1);await touchDrag(touch.locator('#sentence [data-token="7"]'),touch.locator('#wordBank'));assert.equal(await touch.locator('#wordBank [data-token="7"]').count(),1);
 await touch.locator('#primaryGame').tap();await touch.waitForFunction(()=>!wordBusy);assert.equal(await touch.locator('#wordSpeaking').isVisible(),true);
 console.log('PASS: touch tap, drag, return and next speaking card.');
 // Shared footer matches the actual cards screen at the same viewport.
 const footerStyle=async()=>p.locator('.gamebar').evaluate(el=>{const s=getComputedStyle(el),b=getComputedStyle(el.querySelector('#primaryGame'));return[s.background,s.gridTemplateColumns,b.height,b.borderRadius,b.fontSize]});
 const wordFooter=await footerStyle();await p.goto(base);await p.locator('[data-category="cards"]').click();assert.deepEqual(await footerStyle(),wordFooter);await p.locator('#primaryGame').click();await p.waitForFunction(()=>!cardBusy);
 for(const [category,selector,expected]of[['boards','[data-board="rotterdam"]','#boardMap'],['boards','[data-board="zwolle"]','#boardMap'],['dice','[data-dicegame="taalworp"]','#languageStage'],['dice','[data-dicegame="verhaalworp"]','.story-stage']]){await p.goto(base);await p.locator(`[data-category="${category}"]`).click();await p.locator(selector+':visible').first().click();await p.locator(expected).waitFor({state:'visible'});}
 assert.deepEqual(errors,[]);console.log('PASS: exact card-footer styles, existing games smoke, no browser errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
