const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']}),page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 const errors=[],output=process.env.SCREENSHOT_DIR;
 if(output)fs.mkdirSync(output,{recursive:true});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
 const ids=['draaiwiel','memory','koppelen','sorteren','rangschikken','categorieenquiz','raad-het-woord'];
 const open=async id=>{await page.locator('[data-main="play"]').click();await page.locator('#screen-play [data-category="workforms"]').click();await page.locator('.new-workforms [data-activity="'+id+'"]').click();assert.equal(await page.locator('.new-activity').isVisible(),true);assert.equal(await page.locator('.new-activity').getAttribute('data-workspace'),['draaiwiel','raad-het-woord'].includes(id)?'standard':'wide');assert.equal(await page.locator('.new-activity .deckpanel,.new-activity .cardtypes').count(),0)};
 const click=async(action,value)=>page.locator(`[data-na="${action}"]${value===undefined?'':`[data-value="${value}"]`}`).click();
 const next=()=>page.locator('#primaryGame').click();
 const feedback=async text=>{await page.waitForFunction(t=>document.querySelector('#na-feedback').textContent.includes(t),text)};
 try{
  await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto(process.env.LANDING_TEST_URL||require('node:url').pathToFileURL(require('node:path').resolve(__dirname,'../index.html')).href);
  assert.deepEqual(await page.locator('.gamecard h2').allTextContents(),['Speelborden','Dobbelspellen','Kaartspellen','Woorden en zinnen','Meer manieren om te oefenen','Live']);
  assert.deepEqual(await page.locator('.new-workforms [data-activity]').evaluateAll(es=>es.map(e=>e.dataset.activity)),ids);
  assert.equal(await page.locator('#workformDecks .activity-tile').count(),8);
  assert.deepEqual(await page.locator('#workformDecks strong').allTextContents(),['Draaiwiel','Memory','Koppelen','Sorteren','Rangschikken','Categorieënquiz','Raad het woord','Meer activiteiten']);
  assert.match(await page.locator('#workformDecks img').nth(5).getAttribute('src'),/CATEGORIEENQUIZ_VOLWASSEN_FINAL_v02.png$/);
  await page.locator('#screen-play [data-category="workforms"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#workformDecks img')].every(img=>img.complete&&img.naturalWidth>0));
  await page.locator('[data-activities-library]').click();
  assert.equal(await page.locator('#screen-activities').isVisible(),true);
  assert.equal(await page.locator('.activity-shared-set').count(),30);
  for(const id of ['memory','koppelen']){
   await page.locator('.activity-shared-set').nth(29).locator(`[data-activity="${id}"]`).click();
   assert.equal(await page.locator('#na-set').inputValue(),'29');
   assert.equal(await page.locator('.new-activity').getAttribute('data-workspace'),'wide');
   await page.locator('[data-activities-back]').click();await page.locator('[data-activities-library]').click();
  }
  await page.locator('#screen-activities [data-category="workforms"]').click();
  assert.equal(await page.locator('#screen-play .activity-entry,#screen-play .workform-world').count(),0);
  await page.locator('#screen-workforms [data-home]').click();assert.equal(await page.locator('#screen-play').isVisible(),true);
  await open('draaiwiel');await next();await page.waitForFunction(()=>!document.querySelector('#primaryGame').disabled);assert.notEqual(await page.locator('.na-wheel-result h2').innerText(),'Wat wordt het onderwerp?');
  await click('edit-wheel');await page.locator('#na-wheel-input').fill('Eén');await page.locator('#na-wheel-form button').click();assert.ok(await page.locator('#na-wheel-error').innerText());
  await page.locator('#na-wheel-input').fill('<img src=x onerror=alert(1)>\nTweede onderwerp');await page.locator('#na-wheel-form button').click();assert.equal(await page.locator('.na-wheel-legend img').count(),0);assert.equal(await page.locator('.na-wheel-legend li').count(),2);await click('edit-wheel');await page.locator('#na-wheel-input').fill((await page.evaluate(()=>DIGIBORD_ACTIVITIES.wheel.slice(0,6))).join('\n'));await page.locator('#na-wheel-form button').click();
  await open('memory');await page.locator('#na-set').selectOption('0');const known={};
  for(let i=0;i<8;i+=2){for(const j of [i,i+1]){await click('flip',j);known[j]=await page.locator('#na-flip-'+j+' img').getAttribute('alt')}if(await page.locator('#primaryGame').innerText()==='VERDER'&&await page.locator('#primaryGame').isEnabled())await next()}
  for(const word of new Set(Object.values(known))){const pair=Object.keys(known).filter(i=>known[i]===word);if(await page.locator('#na-flip-'+pair[0]).isEnabled()){await click('flip',pair[0]);await click('flip',pair[1])}}
  assert.match(await page.locator('.na-progress').innerText(),/4 \/ 4/);await next();assert.match(await page.locator('.na-progress').innerText(),/0 \/ 4/);
  await open('koppelen');await page.locator('#na-set').selectOption('0');await click('match',0);await feedback('Kies eerst');await click('select',0);await click('match',1);await feedback('nog niet');for(let i=0;i<4;i++){await click('select',i);await click('match',i)}await feedback('Alles gekoppeld');await next();
  await open('sorteren');const foods=['de appel','het brood','de kaas'];const first=await page.locator('.na-word').innerText();await click('sort',foods.includes(first)?1:0);await feedback('andere groep');for(let i=0;i<6;i++){const word=await page.locator('.na-word').innerText();await click('sort',foods.includes(word)?0:1)}await feedback('Alles goed');await next();
  await open('rangschikken');for(const i of [3,2,1,0])await click('step',i);await next();await feedback('nog niet');for(let i=0;i<4;i++)await click('remove-step',0);for(let i=0;i<4;i++)await click('step',i);await next();await feedback('volgorde klopt!');await next();
  await open('categorieenquiz');for(let i=0;i<30;i++){await click('question',i);const answer=await page.evaluate(i=>window.DIGIBORD_ACTIVITIES.quiz[i].answer,i);await click('quiz-answer',i===0?1:answer);await feedback(i===0?'Nog niet':'Goed!');await next()}assert.deepEqual(await page.locator('.na-scoreboard strong').allTextContents(),['2900','3000']);assert.equal(await page.locator('.na-quiz-board button:enabled').count(),0);await next();assert.equal(await page.locator('.na-quiz-board button:enabled').count(),30);
  await open('raad-het-woord');await page.locator('#na-guess').fill('auto');await page.locator('#na-guess-form button').click();await feedback('nog niet');await click('hint',0);assert.equal(await page.locator('.na-clues li').count(),2);await page.locator('#na-guess').fill('De fiets!');await page.locator('#na-guess-form button').click();await feedback('Goed geraden');await next();await click('reveal',0);assert.equal(await page.locator('.na-word').innerText(),'sleutel');await page.locator('#activityUndo').click();assert.equal(await page.locator('#na-guess').count(),1);
  await page.locator('#levelSelect').selectOption('B1');assert.match(await page.locator('#na-level').innerText(),/vervolgvraag/);await page.locator('[data-main="play"]').click();await page.locator('#resumeBtn').click();assert.equal(await page.locator('.new-activity .card-ribbon strong').innerText(),'Raad het woord');
  for(const id of ids.filter(id=>id!=='categorieenquiz')){
   await open(id);const count=id==='draaiwiel'?5:30;assert.equal(await page.locator('#na-set option').count(),count+(id==='draaiwiel'?1:0));
   await page.locator('#na-set').selectOption(String(count-1));if(id!=='draaiwiel')assert.equal(await page.locator('.card-counter').innerText(),`${count} / ${count}`);else assert.equal(await page.locator('#na-set').inputValue(),String(count-1));
   if(id==='draaiwiel')assert.equal(await page.locator('.na-wheel-legend li').count(),6);
   if(id==='memory'){await click('flip',0);await page.waitForFunction(()=>{const img=document.querySelector('.na-memory [data-face=front] img');return img&&img.complete&&img.naturalWidth>0})}
   if(id==='koppelen'){for(let i=0;i<4;i++){await click('select',i);await click('match',i)}await feedback('Alles gekoppeld')}
   if(id==='sorteren'){for(let i=0;i<6;i++){const word=await page.locator('.na-word').innerText();const group=await page.evaluate(word=>DIGIBORD_ACTIVITIES.sorting[29].items.find(x=>x[0]===word)[1],word);await click('sort',group)}await feedback('Alles goed')}
   if(id==='rangschikken'){for(let i=0;i<4;i++)await click('step',i);await next();await feedback('volgorde klopt!')}
   if(id==='raad-het-woord'){await click('reveal',0);assert.equal(await page.locator('.na-word').innerText(),'fietspomp')}
   await page.locator('#na-set').selectOption('0');if(id!=='draaiwiel')assert.equal(await page.locator('.card-counter').innerText(),`1 / ${count}`);else assert.equal(await page.locator('#na-set').inputValue(),'0');
  }
  for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[320,568]]){
   await page.setViewportSize({width,height});
   for(const id of ids){await open(id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('.new-activity .card-work').evaluate(el=>el.scrollWidth<=el.clientWidth),'workspace overflow '+id+' '+width);const b=await page.locator('#primaryGame').boundingBox();const layout=await page.evaluate(()=>{const rect=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};return{header:rect('#appHeader'),stage:rect('#stage'),shell:rect('.new-activity'),work:rect('.new-activity .card-work'),gamebar:rect('.new-activity .gamebar'),primary:rect('#primaryGame')}});assert.ok(b.x>=0&&b.x+b.width<=width+1&&b.y+b.height<=height+1,'primary fits '+id+' '+width+': '+JSON.stringify(layout));for(const control of await page.locator('.na-workspace button:visible,.new-activity .gamebar button:visible').all()){await control.scrollIntoViewIfNeeded();const c=await control.boundingBox();assert.ok(c.width>=30&&c.height>=44&&c.x>=0&&c.x+c.width<=width+1,'control fits '+id+' '+width)}if(output&&[1920,390].includes(width)){await page.locator('.new-activity .card-work').evaluate(el=>el.scrollTop=0);await page.screenshot({path:`${output}/${id}-${width}.png`})}}
   await page.locator('[data-main="play"]').click();await page.locator('#screen-play [data-category="workforms"]').click();assert.ok(await page.locator('#screen-workforms').evaluate(el=>el.scrollWidth<=el.clientWidth));assert.equal(await page.locator('#workformDecks').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width>900?4:width>480?2:1);for(const tile of await page.locator('.activity-tile').all()){await tile.scrollIntoViewIfNeeded();const r=await tile.boundingBox();assert.ok(r.width>=200&&r.x>=0&&r.x+r.width<=width+1,'photo tile fits '+width)}await page.locator('[data-main="play"]').click();assert.ok(await page.locator('#screen-play').evaluate(el=>el.scrollWidth<=el.clientWidth));if(output){await page.locator('#screen-play [data-category="workforms"]').click();await page.locator('#screen-workforms').evaluate(el=>el.scrollTop=0);await page.screenshot({path:`${output}/activities-${width}.png`});await page.locator('#screen-workforms [data-home]').click();await page.locator('#screen-play').evaluate(el=>el.scrollTop=0);await page.screenshot({path:`${output}/landing-${width}.png`})}
  }
  await page.setViewportSize({width:1920,height:1080});await open('memory');await page.locator('#fullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);assert.equal(await page.locator('.new-activity').isVisible(),true);await page.locator('#fullscreenBtn').click();await page.locator('[data-main="play"]').click();
  for(const kind of ['mission','conversation']){await page.locator('#screen-play [data-category="workforms"]').click();await page.locator('[data-activities-library]').click();await page.locator('[data-library-card="'+kind+'"]').click();assert.equal(await page.locator('#screen-game').isVisible(),true);await page.locator('[data-main="play"]').click()}
  const library=async()=>{await page.locator('[data-main="play"]').click();await page.locator('#screen-play [data-category="workforms"]').click();await page.locator('[data-activities-library]').click()};
  await library();
  const routes=await page.locator('#activityLibrary [data-library-card],#activityLibrary [data-library-board],#activityLibrary [data-library-word],#activityLibrary [data-dicegame],#activityLibrary [data-library-cabinet]').evaluateAll(bs=>bs.map(b=>[...b.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value])[0]));
  for(const [attr,value] of routes){await library();await page.locator(`#activityLibrary [${attr}="${value}"]`).click();assert.equal(await page.locator(attr==='data-library-cabinet'?'#screen-collection':attr==='data-library-word'?'#screen-words':attr==='data-library-board'?'#screen-practice':'#screen-game').isVisible(),true,attr+' '+value)}
  for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:900});await library();assert.ok(await page.locator('#screen-activities').evaluate(e=>e.scrollWidth<=e.clientWidth),'library overflow '+width)}
  assert.deepEqual(errors,[]);console.log('PASS: all seven games completed; wrong answers, undo, custom input validation/escaping, resume, six viewports 320–1920, fullscreen, existing routes and no browser errors.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
