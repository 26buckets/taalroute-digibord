const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),controls=require('./practice-controls.cjs');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'file://'+path.join(root,process.env.BUILD_SMOKE?'dist':'','index.html'));
 await page.locator('[data-main=practice]').click();
 assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'level','Fresh users choose their route first');
 assert.deepEqual(await page.locator('input[name=level]').evaluateAll(es=>es.map(e=>e.value)),['A0_A1','A1_A2','A2_B1','B1_B2','B2_C1']);
 await controls.level(page,'A1_A2');
 assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'topic');
 await page.locator('#practiceTopicSearch').fill('inversie');
 const inversion=page.getByRole('button',{name:/^Tijd of plaats vooraan zetten/});assert.equal(await inversion.count(),1,'Overlapping inversion sources have one choice');await inversion.click();
 assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'game');
 assert.ok(await page.locator('.practice-engine:has(input[value=CARDS])').isVisible());await page.locator('.practice-engine:has(input[value=CARDS])').click();
 assert.equal(await page.locator('#practiceStart').isEnabled(),true);
 await page.locator('select[name=duration]').selectOption('30');
 const selected=await page.evaluate(()=>({ids:ContentUI.previewItems().map(i=>i.content_item_id),spec:ContentUI.selectionSpec(),state:ContentUI.state()}));
 assert.equal(selected.spec.filter_spec.free_play_gate,'FREE');assert.ok(selected.ids.length);
 assert.equal(await page.evaluate(()=>ContentUI.previewItems().every(i=>DigiRoutes.classification(i).FreePlayGate==='FREE')),true);
 await page.locator('#practiceSave').click();assert.equal(await page.locator('#lessonName').inputValue(),'Tijd of plaats vooraan zetten');await page.locator('#lessonName').fill('Mijn inversieles');await page.locator('#lessonSaveForm button[type=submit], #lessonSaveForm button.primary').click();
 await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);assert.equal(await page.locator('#practiceStart').isEnabled(),true);assert.equal(await page.locator('[data-practice-step=topic]').count(),1,'Saved teacher goals reopen in the same selector');await page.locator('#practiceStart').click();
 await page.waitForFunction(()=>!!APP.contentSessionConfig);assert.doesNotMatch(await page.locator('#screen-game').innerText(),/teach-|kunnen_als_/,'No navigation IDs on the classroom screen');const session=await page.evaluate(async()=>{await LessonUI.flush();return structuredClone(APP.contentSessionConfig)});assert.ok(session.selected_item_ids.length);
 await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_item_ids),session.selected_item_ids,'Resume preserves exact selected IDs');
 await page.locator('[data-main=practice]').click();await page.evaluate(()=>{ContentUI.clearEditing();ContentUI.open()});
 await controls.level(page,'A1_A2');await page.locator('select[name=support]').selectOption('GUIDED');
 const guided=await page.locator('[data-choose-topic^="teach-"]').first().getAttribute('data-choose-topic');
 await page.evaluate(id=>{const el=[...document.querySelectorAll('[data-choose-topic]')].find(e=>e.dataset.chooseTopic===id);for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true},guided);
 await page.locator(`[data-choose-topic="${guided}"]`).click();
 assert.equal(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).every(i=>DigiRoutes.classification(i).FreePlayGate==='GUIDED')),true);
 await controls.level(page,'B2_C1');assert.equal(await page.evaluate(()=>ContentUI.state().level),'B2_C1');
 const grammar=page.locator('.practice-topic-group').filter({has:page.locator('summary strong').getByText('Grammatica',{exact:true})});
 // Switching sections never silently lowers the route, including an empty grammar route.
 await page.locator('#practiceTopicSearch').fill('Grammatica');assert.match(await page.locator('#practiceTopicRows').textContent(),/Geen grammaticaoefeningen/);assert.equal(await page.locator('#practiceStart').isDisabled(),true);
 await page.locator('#practiceTopicSearch').fill('');await controls.level(page,'A1_A2');await page.locator('select[name=support]').selectOption('FREE');
 await page.getByText('Snelvragen',{exact:true}).click();await page.locator('[data-choose-topic=vraag]').click();assert.equal(await page.evaluate(()=>ContentUI.state().level),'A1_A2');
 await page.locator('#practiceChooseGame').click();assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'game');
 await controls.openStep(page,'topic');await page.locator('#practiceTopicSearch').fill('kunnen_als_vaardigheid');assert.equal(await page.getByRole('button',{name:/^Zeggen wat je kunt/}).count(),1);await page.locator('#practiceTopicSearch').fill('<img onerror=alert(1)>');assert.equal(await page.locator('#practiceTopicRows img').count(),0);await page.locator('#practiceTopicSearch').fill('');
 for(const layout of ['topic','level','goal','game','recent']){await page.evaluate(layout=>{settingsPatch({practiceLayout:layout});ContentUI.applyLayout()},layout);assert.ok(await page.locator(layout==='recent'?'#practiceRecent':'#practiceForm').count());}
 await page.evaluate(()=>{settingsPatch({practiceLayout:'level'});ContentUI.applyLayout()});await controls.level(page,'A1_A2');await page.getByText('Grammatica',{exact:true}).click();
 const out=process.env.EVIDENCE_DIR||path.join(root,'test-results/teacher-taxonomy');fs.mkdirSync(out,{recursive:true});
 for(const width of [320,390,768,1440,1920]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow at '+width);assert.ok(await page.locator('.practice-topic-group>summary:visible').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)));if([390,1440].includes(width))await page.screenshot({path:path.join(out,'selection-'+width+'.png'),fullPage:true});}
 await page.setViewportSize({width:1440,height:1000});await page.locator('#practiceChooseGame').click();await page.screenshot({path:path.join(out,'games-1440.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS teacher navigation: five routes, preserved layout preferences, search aliases, merged inversion, explicit guidance, visible games, save/start/resume, empty C1 route, Snelvragen and 320–1920px.');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
