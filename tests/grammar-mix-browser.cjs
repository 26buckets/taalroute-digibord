const assert=require('node:assert/strict'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));await page.waitForFunction(()=>window.LessonUI);
 const before=await page.evaluate(()=>{
  ContentUI.open({family:GrammarCatalog.familyId});ContentUI.setState({engine:'CARDS',duration:60});
  const spec=ContentRuntime.normalizeSelection({scope_clauses:[{scope_id:'legacy-er',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ER'],cefr_levels:['A1_A2','B1_B2'],subtopic_ids:[],weight:3,maximum_items:12},{scope_id:'legacy-wz',content_family_id:'words',content_bank_ids:['CB-WZ-002'],topic_ids:['WZ_009'],cefr_levels:['A1_A2'],weight:2}],filter_spec:{difficulty:'all'},distribution_spec:{mode:'weighted'}});
  LessonUI.openMix(spec);return {spec,ids:ContentRuntime.selectionPool(spec).map(i=>i.content_item_id)};
 });
 assert.equal(await page.locator('[name=mixTopic]:checked').count(),2);
 assert.doesNotMatch(await page.locator('#lessonMixForm').innerText(),/WZ_009|CB-GRAM|CB-WZ/);
 await page.locator('#mixName').fill('Bewaarde mix');await page.locator('#lessonMixForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 assert.deepEqual(await page.evaluate(()=>ContentUI.selectionSpec().scope_clauses),before.spec.scope_clauses,'preserve IDs, families, banks, levels, weight and caps');
 assert.deepEqual(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).map(i=>i.content_item_id)),before.ids,'no silent widening or lost assignments');
 const record=await page.evaluate(async()=>{const r=(await LessonUI.service.list('mix_profile')).find(r=>r.name==='Bewaarde mix');LessonUI.openMix(r,r);return r});
 await page.locator('#lessonMixForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 assert.equal(await page.evaluate(async id=>(await LessonUI.service.get('mix_profile',id)).record_revision,record.mix_profile_id),2);
 assert.deepEqual(await page.evaluate(()=>ContentUI.selectionSpec().scope_clauses),before.spec.scope_clauses);
 await page.evaluate(()=>{ContentUI.clearEditing();LessonUI.openMix()});assert.equal(await page.locator('[name=mixTopic]:checked').count(),0,'new mixes still start with the teacher catalog');
 const option=page.locator('.lesson-mix-option').filter({has:page.getByText('Inversie: tijd of plaats vooraan',{exact:true})});await option.locator('input').check();await page.locator('#lessonMixForm .primary').click();await page.waitForFunction(()=>!document.querySelector('#gameDialog').open);
 assert.deepEqual(await page.evaluate(()=>ContentUI.selectionSpec().scope_clauses[0].topic_ids),['WZ_010','WZ_018','WZ_020']);
 console.log('PASS mixeditor: legacy selections stay checked, exact banks/topics/levels/weights/caps and IDs retained on create/update; new teacher mixes use original sources.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
