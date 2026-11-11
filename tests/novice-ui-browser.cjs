const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,firefox,webkit}=require('playwright'),header=require('./header-actions.cjs');
const engine=process.env.TEST_ENGINE||'chromium',out=process.env.NOVICE_OUTPUT||path.resolve(__dirname,'../../novice-ui-20261111',engine);
fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await ({chromium,firefox,webkit}[engine]).launch(engine==='chromium'?{channel:'chrome'}:engine==='firefox'?{executablePath:process.env.FIREFOX_PATH}:{});try{
 const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.LIVE_URL||'http://127.0.0.1:8192/',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.AppNavigation);
 const stable=async()=>{await p.waitForFunction(()=>!gameIsBusy());await p.waitForTimeout(100)};
 const shot=async name=>{await p.locator('#toast.show').waitFor({state:'detached'});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+name);await p.screenshot({path:path.join(out,name+'.png')});};
 assert(await p.locator('[data-practice-open]').isVisible());await shot('start-desktop');
 await p.locator('[data-practice-open]').click();assert(await p.locator('#screen-practice').isVisible());
 await p.locator('[data-browse-family=quick]').click();await p.locator('[data-choose-topic=vertel]').click();await p.locator('label:has([name=level][value=A1_A2])').click();
 assert.equal(await p.locator('#practiceMix').innerText(),'Onderwerpen combineren');await shot('les-maken-desktop');await p.locator('#practiceStart').click();await stable();await p.locator('#primaryGame').click();await stable();
 await p.evaluate(()=>settingsPatch({participants:[{id:'p1',name:'Testcursist',present:true,group:'Groep 1',color:'#2389e8'}],savedGroups:[{id:'g1',name:'Testgroep',names:['Testcursist'],pawnMode:'Groepen'}]}));
 const state=()=>p.evaluate(()=>({session:ContentRuntime.activeSession()?.session_id,items:ContentRuntime.activeSession()?.selected_item_ids,card:document.querySelector('#gameMount [data-content-item-id]')?.dataset.contentItemId,participants:settingsState().participants,groups:settingsState().savedGroups}));
 const before=await state();
 await p.setViewportSize({width:390,height:844});await header(p,'[data-main=practice]','click');await p.locator('.hdr001-menu-trigger').click();
 assert(await p.locator('[data-menu-resume]').isVisible());assert(!await p.locator('#settingsBtn').isVisible());assert(!await p.locator('[data-main=mycollection]').isVisible());
 assert(await p.locator('[data-main=practice] small').isVisible());await shot('menu-mobiel');
 await p.locator('[data-menu-group=display]>summary').focus();await p.keyboard.press('Enter');assert(await p.locator('#settingsBtn').isVisible());await shot('menu-weergave-mobiel');
 await p.locator('#settingsBtn').click();await p.frameLocator('#settingsOverlay iframe').locator('.back-btn').click();await p.locator('.hdr001-menu-trigger').click();await p.locator('[data-menu-resume]').click();await stable();assert.deepEqual(await state(),before);
 await header(p,'[data-main=practice]','click');await p.locator('#practiceMix').click();await p.locator('#gameDialog[open]').waitFor();assert.match(await p.locator('#dialogBody').innerText(),/Je lopende les blijft bewaard/);await p.keyboard.press('Escape');await p.locator('[data-nav-resume]').click();await stable();assert.deepEqual(await state(),before);
 await p.reload({waitUntil:'domcontentloaded'});await p.locator('#screen-game.active').waitFor();assert.deepEqual(await state(),before);checks.push('new teacher path, settings and combining do not replace lesson; reload keeps card and groups');
 // All mobile functions remain reachable, including below 380px, and survive resizing.
 for(const width of [320,390,768,1050,1440]){
  await p.setViewportSize({width,height:width===320?640:1000});await stable();await p.locator('.hdr001-menu-trigger').click();
  const extra=p.locator('[data-menu-group=extra]');if(!await extra.evaluate(e=>e.open))await extra.locator(':scope>summary').click();
  for(const selector of ['[data-main=mycollection]','#curriculumContext','[data-share-app-trigger]'])assert(await p.locator(selector).isVisible(),selector+' '+width);
  await p.keyboard.press('Escape');assert(await p.locator('.hdr001-menu-trigger').evaluate(e=>e===document.activeElement));
  assert(!await p.locator('#settingsBtn').isVisible(),'closed menu hides nested open group');assert.equal(await p.locator('#settingsBtn').count(),1);assert.equal(await p.locator('[data-menu-resume]').count(),1);assert.deepEqual(await state(),before);
 }
 await p.locator('.hdr001-menu-trigger').focus();await p.keyboard.press('ArrowDown');assert(await p.evaluate(()=>!!document.activeElement.closest('.hdr001-panel')&&document.activeElement.checkVisibility()));await p.keyboard.press('Escape');
 checks.push('five widths, keyboard disclosure/Escape, all extras retained, no duplicated controls');
 async function exact(id){await p.evaluate(async id=>{const raw=E1Release.cards.find(c=>c.id===id);APP.level=DigiRoutes.resolve(raw.route);APP.cardGuided=raw.freePlayGate==='GUIDED';await prepareCards(raw.appFamily||raw.family);APP.cardIndex=cardsFor(APP.cardKind).findIndex(c=>c.id===id);if(APP.cardIndex<0)throw Error('Unavailable '+id);APP.cardShuffles={};delete APP.cardRound;startCards(APP.cardKind);},id);await stable();}
 for(const [id,name] of [['TR-SPELLING-P001-013-R3','spelling-a2'],['TR-SPELLING-P001-004-R1','spelling-a1'],['TR-PUZZLES-P002-006-R2','taalkraker-a2'],['TR-PUZZLES-P001-020-R6','taalkraker-c1']]){
  await exact(id);
  for(const [width,height] of [[1440,1000],[390,844],[320,568]]){
   await p.setViewportSize({width,height});await stable();const content=p.locator('.card-content');await content.evaluate(e=>e.scrollTop=0);if(height<700){assert(await content.evaluate(e=>e.clientHeight>=220),'reading area stays large on a short phone');await p.locator('.card-viewport').evaluate(e=>e.scrollTop=0);}const font=await p.locator('.card-instruction').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));assert(font>=20);
   assert(await p.locator('#cardAttemptHint').isVisible());assert(await p.locator('#cardExample').isDisabled());
   await content.evaluate(e=>e.scrollTop=e.scrollHeight);assert(await content.evaluate(e=>e.scrollHeight-e.clientHeight-e.scrollTop<2));await content.evaluate(e=>e.scrollTop=0);
   await shot(name+'-'+width);
  }
  if(name==='spelling-a2'){
   assert.match(await p.locator('.card-situation').innerText(),/nieuwe cursisten/);
   await p.locator('#cardSetInfo').click();await p.locator('#dialogBody details>summary').click();assert.match(await p.locator('#dialogBody details').innerText(),/nieuwe cursisten/);await p.locator('#cardViewSet').click();const preview=p.locator('.detail-text-cards article').filter({has:p.getByRole('heading',{name:'Welkom bij ons',exact:true})});assert.match(await preview.innerText(),/nieuwe cursisten/);assert.equal(await preview.locator('ol>li').count(),2);await exact(id);
  }
  if(name==='taalkraker-c1'){assert.doesNotMatch(await p.locator('.card-actions').innerText(),/ANTWOORD/);assert(await p.getByRole('heading',{name:'Een woord in een woord',exact:true}).isVisible());}
  await p.locator('#cardAttempt').click();assert(await p.locator('#cardExample').isEnabled());assert.match(await p.locator('#cardAttemptHint').innerText(),/nu/);await p.locator('#cardExample').click();assert(await p.locator('[data-support=example]').isVisible());await p.keyboard.press('Escape');
 }
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>TaalrouteAppearance.set('dark'));await p.locator('.hdr001-menu-trigger').click();await shot('menu-donker-mobiel');await p.keyboard.press('Escape');await p.evaluate(()=>TaalrouteAppearance.set('light'));
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({status:'PASS',engine,checks,errors},null,2));console.log('PASS novice UI: '+engine+'; explicit tasks, entry choice, answer gate, grouped menus, large text, session and groups preserved.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
