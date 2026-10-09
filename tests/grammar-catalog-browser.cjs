const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{chromium}=require('playwright');
const baseline=require('./fixtures/grammar-catalog-baseline.json');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'file://'+path.join(__dirname,'..',process.env.BUILD_SMOKE?'dist':'','index.html'));
 await page.waitForFunction(()=>window.ContentUI&&window.LessonUI);
 const audit=await page.evaluate(()=>{
  const families=new Map(ContentRuntime.banks().map(e=>[e.bank.bank_id,e.familyId]));
  const all=ContentRuntime.items().filter(i=>['grammar','words'].includes(families.get(i.content_bank_id)));
  const available=ContentRuntime.availableForPreparation().filter(i=>['grammar','words'].includes(families.get(i.content_bank_id)));
  const entries=ContentUI.teacherEntries().filter(e=>e.family.id===GrammarCatalog.familyId),reachable=new Set(),problems=[],groups=[];
  for(const entry of entries){
   for(const level of entry.topic.levels){
    const items=entry.rows.filter(i=>DigiRoutes.classification(i).displayRoute===level);
    const micros=['',...new Set(items.filter(i=>DigiRoutes.classification(i).FreePlayGate==='GUIDED').map(i=>DigiRoutes.classification(i).Microconstructie))];
    for(const micro of micros){
     ContentUI.setState({family:GrammarCatalog.familyId,topic:entry.topic.id,level,microconstructure:micro,engine:'CARDS',duration:30,subtopic:'all',focus:'all',production:'all',difficulty:'all'},{render:false});
     const spec=ContentUI.selectionSpec(),pool=ContentRuntime.selectionPool(spec);
     if(!micro&&pool.some(i=>DigiRoutes.classification(i).FreePlayGate==='GUIDED'))problems.push('guided random '+entry.topic.id);
     if(new Set(pool.map(i=>i.content_item_id)).size!==pool.length)problems.push('duplicate '+entry.topic.id);
     for(const item of pool)reachable.add(item.content_item_id);
     if(pool.length){for(const engine of ['CARDS','BOARD','WHEEL'])if(!ContentRuntime.setCompatibility(pool,engine))problems.push('unplayable '+engine+' '+entry.topic.id);groups.push({topic:entry.topic.id,level,micro,ids:pool.map(i=>i.content_item_id)});}
    }
   }
  }
  return {all,refs:all.map(i=>ContentRuntime.contentRef(i)),available:available.map(i=>i.content_item_id).sort(),reachable:[...reachable].sort(),problems,groups,subjects:entries.length};
 });
 const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
 assert.equal(hash(audit.all),baseline.sourceHash,'every source field unchanged');assert.equal(hash(audit.refs),baseline.refsHash,'every immutable source reference unchanged');
 assert.deepEqual(audit.available,baseline.ids,'same released ID inventory');assert.deepEqual(audit.reachable,baseline.ids,'zero unreachable valid tasks');assert.deepEqual(audit.problems,[]);assert.equal(audit.subjects,39);
 // Real teacher controls: two choices reach each known subject (category, subject).
 await page.locator('[data-category=words]').click();
 assert.match(await page.locator('[data-category=words]').innerText(),/Grammatica en zinsbouw/);
 const categories=await page.evaluate(()=>GrammarCatalog.categories.map(c=>c.label));
 assert.deepEqual(await page.locator('.grammar-category>span:first-child').allTextContents(),categories);
 assert.equal(await page.locator('[data-choose-family=words],[data-choose-family=grammar]').count(),0);
 for(const [query,expected] of Object.entries({'omdat':'g-reden','verleden tijd':'g-werkwoordstijden','die dat':'g-relatieve-zinnen','vraagwoorden':'g-vraagwoorden','inversie':'g-inversie','niet geen':'g-niet-geen'})){
  await page.locator('#practiceTopicSearch').fill(query);assert.ok(await page.locator(`[data-choose-topic="${expected}"]`).isVisible(),query);
  const ids=await page.locator('[data-choose-family=grammar-guide]').evaluateAll(es=>es.map(e=>e.dataset.chooseTopic));assert.equal(new Set(ids).size,ids.length,'no duplicate search results');
 }
 await page.locator('#practiceTopicSearch').fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('#practiceTopicRows img').count(),0);
 await page.locator('#practiceTopicSearch').fill('');
 const subjects=await page.evaluate(()=>GrammarCatalog.subjects.map(s=>({id:s.id,category:GrammarCatalog.categories.find(c=>c.id===s.categories[0]).label})));
 for(const subject of subjects){
  await page.evaluate(()=>ContentUI.open({family:GrammarCatalog.familyId}));
  const category=page.locator('.grammar-category').filter({hasText:subject.category});
  await category.click();assert.equal(await page.locator('.grammar-category').count(),0,'only the selected category is shown');assert.equal(await page.locator('.grammar-catalog svg').evaluateAll(es=>es.filter(e=>!e.children.length).length),0,'no missing icons');assert.equal(await page.locator('.grammar-goal .practice-level').count(),0,'levels come after the goal');await page.locator(`[data-choose-topic="${subject.id}"]`).click();
  assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'level',subject.id+' reached in two choices');
 }
 // The third step exposes exercise types as well as the compatible game surfaces.
 await page.evaluate(()=>{ContentUI.open({family:GrammarCatalog.familyId});ContentUI.setState({topic:'g-er',level:'A1_A2',engine:'CARDS',duration:30,difficulty:'all'})});
 await page.locator('[data-practice-step=game]>summary').click();
 await page.locator('[data-practice-step=game] .practice-choice:has(input[name=focus][value=fill])').click();
 assert.ok(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).every(i=>i.exercise_type==='invullen')));
 assert.ok(await page.locator('#practiceStart').isEnabled());
 // Every guided selection goes through the actual selector, then can start.
 for(const group of audit.groups.filter(g=>g.micro)){
  await page.evaluate(g=>{ContentUI.clearEditing();ContentUI.open({family:GrammarCatalog.familyId});ContentUI.setState({topic:g.topic,level:g.level,engine:'CARDS',duration:30,microconstructure:'',difficulty:'all'});},group);
  await page.selectOption('[name=microconstructure]',group.micro);
  assert.deepEqual(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).map(i=>i.content_item_id)),group.ids);
  assert.ok(await page.locator('#practiceStart').isEnabled(),group.topic+' '+group.micro);
  assert.doesNotMatch(await page.locator('#practiceForm').innerText(),/\b(?:WZ_\d|GRAM_PB|CB-GRAM|CB-WZ|KUNNEN|MOETEN|MOGEN)\b/);
 }
 // Cross-category routes and mixed overlapping subjects never duplicate canonical IDs.
 const overlap=await page.evaluate(()=>{
  const subject=GrammarCatalog.subjects.find(s=>s.id==='g-bijzinnen');
  const spec={scope_clauses:subject.categories.map((c,index)=>({scope_id:String(index),topic_ids:subject.sources,cefr_levels:[]})),filter_spec:{}};
  return {count:ContentRuntime.selectionPool(spec).length,one:ContentRuntime.selectionPool({...spec,scope_clauses:[spec.scope_clauses[0]]}).length};
 });assert.equal(overlap.count,overlap.one);
 // Persist, resume and surface actual history/favorites through the existing service.
 await page.evaluate(()=>{ContentUI.open({family:GrammarCatalog.familyId});ContentUI.setState({topic:'g-inversie',level:'A1_A2',engine:'CARDS',duration:30,microconstructure:'',difficulty:'all'});ContentUI.start(517)});
 await page.waitForSelector('#screen-game.active');
 const saved=await page.evaluate(async()=>{await LessonUI.flush();const record=await LessonUI.service.saveSelection({name:'Inversie voor mijn groep',selection_spec:ContentUI.selectionSpec(),execution_preferences:ContentUI.preferences()});await LessonUI.service.addFavorite('saved_selection',record.saved_selection_id);return {session:APP.contentSessionConfig,groups:APP.groups}});
 await page.reload();await page.locator('#resumeBtn').click();assert.deepEqual(await page.evaluate(()=>({session:APP.contentSessionConfig,groups:APP.groups})),saved);
 await page.locator('[data-main=practice]').click();
 for(const [key,text] of [['0','keer gestart'],['1','Inversie'],['2','Inversie voor mijn groep']]){
  await page.locator(`[data-grammar-quick="${key}"]`).click();await page.locator('#grammarQuickResults').getByText(new RegExp(text)).first().waitFor();
 }
 await page.locator('#grammarQuickResults [data-lesson-action=edit]').click();await page.waitForFunction(()=>ContentUI.editing()?.name==='Inversie voor mijn groep');assert.deepEqual(await page.evaluate(()=>ContentUI.selectionSpec()),saved.session.normalized_selection_spec);
 await page.evaluate(()=>{ContentUI.clearEditing();settingsPatch({practiceLayout:'level'});ContentUI.open({family:GrammarCatalog.familyId})});
 assert.equal(await page.locator('[data-practice-step][open]').getAttribute('data-practice-step'),'topic','grammar ignores level-first library preference');
 const out=process.env.EVIDENCE_DIR||path.join(__dirname,'artifacts/grammar-catalog');fs.mkdirSync(out,{recursive:true});
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:1000});assert.equal(await page.locator('.grammar-category').count(),9);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no overflow '+width);
  assert.ok(await page.locator('.grammar-category').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)));
  if([390,1440].includes(width))await page.screenshot({path:path.join(out,'catalog-'+width+'.png'),fullPage:true});
 }
 // Page scrolling must work over short and long goal lists and other expanded families.
 async function scrollOver(row){
  await row.scrollIntoViewIfNeeded();
  // Wait for Chromium to commit the replaced list before hit-testing a wheel gesture.
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const box=await row.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  const before=await page.locator('#screen-practice').evaluate(e=>e.scrollTop);
  await page.mouse.wheel(0,220);
  await page.waitForFunction(before=>document.querySelector('#screen-practice').scrollTop>before+20,before);
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:700});
  // Load at the target device size: Chromium retains stale compositor hit regions after emulated viewport resizing.
  await page.reload();await page.waitForFunction(()=>window.ContentUI);
  for(const category of ['grammar-1','grammar-2','grammar-4']){
   await page.evaluate(()=>ContentUI.open({family:GrammarCatalog.familyId}));
   const before=await page.evaluate(()=>ContentUI.selectionSpec());
   await page.locator(`[data-grammar-category="${category}"]`).click();
   assert.deepEqual(await page.evaluate(()=>ContentUI.selectionSpec()),before,'browsing does not change the lesson');
   assert.equal(await page.locator('#grammarCategoryTitle').evaluate(e=>e===document.activeElement),true);
   await scrollOver(page.locator('.grammar-goal').first());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(category==='grammar-1')await page.screenshot({path:path.join(out,'goals-'+width+'.png'),fullPage:true});
   // Search also finds other categories; clearing it returns to the category being browsed.
   await page.locator('#practiceTopicSearch').fill('die dat');
   assert.ok(await page.locator('[data-choose-topic=g-relatieve-zinnen]').isVisible());
   await page.locator('#practiceTopicSearch').fill('');
   assert.equal(await page.locator('#grammarCategoryTitle').count(),1);
   await page.locator('[data-grammar-back]').click();
   assert.equal(await page.locator('.grammar-category').count(),9);
   assert.equal(await page.locator(`[data-grammar-category="${category}"]`).evaluate(e=>e===document.activeElement),true);
  }
  const group=page.locator('.practice-topic-group').first();
  await group.locator('summary').click();await scrollOver(group.locator('.practice-topic-row').first());
  await page.locator('#practiceStart').scrollIntoViewIfNeeded();assert.ok(await page.locator('#practiceStart').isVisible(),'lower controls remain reachable');
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'reachability.json'),JSON.stringify({base:baseline.base,available:audit.available.length,reachable:audit.reachable.length,subjects:audit.subjects,groups:audit.groups.length,guidedGroups:audit.groups.filter(g=>g.micro).length,sourceHash:hash(audit.all),refsHash:hash(audit.refs),errors},null,2));
 console.log(`PASS teacher catalog: ${audit.available.length} unchanged/reachable IDs, 39 subjects, nine categories, ${audit.groups.length} real selector scopes, search, gates, no duplicates, saved resume/favorites and 320–1920px.`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
