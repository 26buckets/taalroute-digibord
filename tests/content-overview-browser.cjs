const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser,page;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,channel:'chrome'});page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-main=practice]').click();
 const audit=await page.evaluate(()=>{
  const a=ContentOverview,failures=[],same=(x,y)=>JSON.stringify([...new Set(x.map(i=>i.content_item_id))].sort())===JSON.stringify([...new Set(y.map(i=>i.content_item_id))].sort());let scopes=0,shortSelection=null;
  for(const entry of a.entries())for(const route of DigiRoutes.routes){
   const expected=entry.rows.filter(i=>DigiRoutes.classification(i).displayRoute===route.id);if(!expected.length)continue;
   const pool=ContentRuntime.selectionPool(a.selection(entry,route.id));
   if(!same(pool,expected.filter(i=>DigiRoutes.classification(i).FreePlayGate!=='GUIDED')))failures.push(entry.topic.id+':free:'+route.id);
   for(const micro of [...new Set(expected.map(i=>DigiRoutes.classification(i).Microconstructie).filter(Boolean))]){const actual=ContentRuntime.selectionPool(a.selection(entry,route.id,{micro}));const seconds=actual.reduce((n,i)=>n+i.estimated_duration_seconds,0);if(!shortSelection&&seconds>30&&seconds<600&&![60,180,300].includes(seconds)&&ContentRuntime.setCompatibility(actual,'CARDS'))shortSelection={family:entry.family.id,topic:entry.topic.id,route:route.id,micro};if(!same(actual,expected.filter(i=>DigiRoutes.classification(i).Microconstructie===micro)))failures.push(entry.topic.id+':goal:'+route.id);scopes++}
   const c=a.counts(expected);if(c.free+c.guided!==c.total)failures.push('gate total');
   const kinds=a.kinds().map(k=>expected.filter(i=>a.kindOf(i)===k.id));if(kinds.reduce((n,p)=>n+p.length,0)!==expected.length)failures.push('exercise types');
   scopes++;
  }
  const all=a.matching().flatMap(e=>e.rows),unique=new Set(all.map(i=>i.content_item_id)).size;if(a.counts(all).total!==unique)failures.push('duplicate totals');if(!same(all,ContentRuntime.availableForPreparation()))failures.push('missing released content');
  const e=a.find('grammar-guide','g-hoofdzin'),example=Object.fromEntries(a.kinds().map(k=>[k.id,e.rows.filter(i=>a.kindOf(i)===k.id).length]));
  const recipes=[];
  for(const r of DigiRoutes.routes){
   const m=a.startMix(r.id);if(!m)continue;
   for(const seed of [1,17,93]){
    const items=ContentRuntime.selectItems({selectionSpec:m.spec,targetDurationSeconds:600,engines:[m.preferences.preferred_game_engine],seed});
    if(new Set(items.map(i=>i.content_item_id)).size!==items.length)failures.push('mix duplicates');
    if(items.some(i=>DigiRoutes.classification(i).FreePlayGate==='GUIDED'||a.routeOf(i)!==r.id))failures.push('mix gate or route');
    const sizes=[];
    for(const scope of m.spec.scope_clauses){
     const ids=new Set(ContentRuntime.selectionPool({...m.spec,scope_clauses:[scope]}).map(i=>i.content_item_id));
     const count=items.filter(i=>ids.has(i.content_item_id)).length;sizes.push(count);if(!count)failures.push('mix missing subject');
    }
    if(Math.max(...sizes)-Math.min(...sizes)>1)failures.push('mix is not evenly distributed');
   }
   recipes.push({route:r.id,count:m.count,subjects:m.entries.map(e=>e.topic.id)});
  }
  return {failures,scopes,unique,example,recipes,shortSelection,materials:a.materials(),unsupported:!a.startMix('ALPHA_AC')&&!a.startMix('bad-route')};
 });
 assert.deepEqual(audit.failures,[]);assert.ok(audit.scopes>200);assert.equal(audit.example.recognize,12);assert.equal(audit.example.order,14);assert.equal(audit.example.correct,12);assert.equal(audit.example.rewrite,18);assert.equal(audit.example.produce,24);assert.equal(audit.recipes.length,5);assert.ok(audit.unsupported);assert.equal(audit.materials.sets.length,23);assert.equal(audit.materials.images,320);assert.equal(audit.materials.collections.length,10);assert.equal(audit.materials.cards.reduce((n,c)=>n+c.count,0),560);
 // The existing 610 active P0 cards include 50 shared Between-lines cards, counted with exercises.
 await page.evaluate(()=>{ContentUI.setState({family:'quick',topic:'vertel',level:'A1_A2'});settingsPatch({practiceLayout:'recent'});ContentUI.applyLayout()});assert.equal(await page.locator('#practiceRecent').count(),1);assert.equal(await page.locator('.practice-family-nav button').count(),3);await page.locator('[data-browse-family=quick]').click();assert.ok(await page.locator('[data-choose-topic=vertel]').count());await page.evaluate(()=>{settingsPatch({practiceLayout:'topic'});ContentUI.applyLayout()});
 await page.locator('[data-grammar-category=grammar-1]').click();await page.locator('[data-browse-family=quick]').click();assert.ok(await page.locator('[data-choose-topic=vertel]').count());assert.equal(await page.locator('[data-grammar-category]').count(),0);assert.equal(await page.locator('.practice-family-nav button').count(),3);
 await page.locator('[data-browse-family="grammar-guide"]').click();await page.locator('[data-grammar-category=grammar-1]').click();await page.locator('[data-choose-topic=g-hoofdzin]').click();await page.locator('label:has([name=level][value=A0_A1])').click();await page.locator('#practiceOverview').click();
 const frame=page.frameLocator('#settingsOverlay iframe');await frame.locator('#ovDetailTitle').waitFor();const arrow=await frame.locator('#ovRoute').evaluate(e=>({inset:getComputedStyle(e).backgroundPosition,padding:getComputedStyle(e).paddingRight}));assert.ok(arrow.inset.includes('14px'));assert.equal(arrow.padding,'42px');assert.equal(await frame.locator('#ovDetailTitle').innerText(),'Een korte zin maken');assert.equal(await frame.locator('#contentOverview .ov-stats strong').first().innerText(),'80');await frame.locator('[data-ov-kind=recognize]').click();assert.equal(await frame.locator('#contentOverview .ov-stats strong').first().innerText(),'12');await frame.locator('[data-ov-explain]').click();assert.equal(await frame.locator('#contentDidactic .ov-example').count(),12);assert.ok((await frame.locator('#contentDidactic').innerText()).includes('Leerdoel'));await frame.locator('[data-ov-prepare]').click();
 assert.equal(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).length),12);assert.equal(await page.locator('#settingsOverlay').evaluate(e=>e.classList.contains('open')),false);
 // Guided choices stay opt-in, and the preparation agrees with the shown selection.
 const target=await page.evaluate(()=>{const e=ContentOverview.entries().find(e=>e.rows.some(ContentOverview.guided)),i=e.rows.find(ContentOverview.guided);return {family:e.family.id,topic:e.topic.id,route:ContentOverview.routeOf(i),micro:DigiRoutes.classification(i).Microconstructie}});
 await page.evaluate(x=>ContentOverview.open(x),target);await frame.locator('#ovMicro').waitFor();await frame.locator('#ovMicro').selectOption(target.micro);await frame.locator('[data-ov-prepare]').click();assert.ok(await page.evaluate(()=>ContentRuntime.selectionPool(ContentUI.selectionSpec()).some(ContentOverview.guided)));
 assert.ok(audit.shortSelection);await page.evaluate(x=>ContentOverview.prepare(x.family,x.topic,x.route,{micro:x.micro}),audit.shortSelection);assert.equal(await page.locator('[name=duration]').inputValue(),String(await page.evaluate(()=>ContentUI.preferences().target_duration_seconds)));
 // No examples disappear behind the pagination; switching explanation and counts preserves filters.
 await page.evaluate(()=>ContentOverview.open({family:'grammar-guide',topic:'g-hoofdzin',route:'A0_A1'}));await frame.locator('.ov-example').first().waitFor();for(let i=0;i<6;i++)await frame.locator('[data-ov-more]').click();assert.equal(await frame.locator('.ov-example').count(),80);assert.equal(await frame.locator('[data-ov-more]').count(),0);
 const dir=path.join(root,'tests/artifacts/content-overview');fs.mkdirSync(dir,{recursive:true});
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  for(const tab of ['exercises','spread','games']){
   await frame.locator(`[data-ov-tab=${tab}]`).first().click();
   if(tab==='spread'){await frame.locator('#ovRoute').selectOption('');await frame.locator('#ovFamily').selectOption('');}
   const bounds=await frame.locator('.content').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth}));assert.ok(bounds.scroll<=bounds.width+1,`overflow ${width} ${tab}: ${JSON.stringify(bounds)}`);
   const clipped=await frame.locator('#contentOverview').evaluate(el=>{const b=el.closest('.content').getBoundingClientRect();return [...el.querySelectorAll('button,input,select')].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.right>b.right+1||r.left<b.left-1}).map(e=>e.id||e.textContent)});assert.deepEqual(clipped,[],`clipped ${width} ${tab}`);
   const text=await frame.locator('#contentOverview').innerText();assert.ok(!/CB-[A-Z]+|GRAM_PB|WZ_\d|\bKUNNEN\b|960 opdrachten|undefined/.test(text));
   if(width===1440||width===390)await page.screenshot({path:path.join(dir,`${tab}-${width}.png`)});
  }
 }
 await frame.locator('.back-btn').click();await page.locator('.practice-startmixes>summary').click();await page.locator('[data-startmix=A2_B1]').click();const spec=await page.evaluate(()=>ContentUI.selectionSpec());assert.equal(spec.scope_clauses.length,4);assert.equal(spec.filter_spec.free_play_gate,'FREE');await page.locator('#practiceStart').click();
 const before=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs}));assert.ok(before.ids.length>=4);await page.reload();const after=await page.evaluate(()=>({ids:APP.contentSessionConfig.selected_item_ids,refs:APP.contentSessionConfig.selected_content_refs}));assert.deepEqual(after,before);
 assert.deepEqual(errors,[]);console.log(`PASS content overview: ${audit.unique} unique IDs, ${audit.scopes} runtime selections, exercise counts, guided opt-in, all examples, material units, five startmixes, persistent entrances, exact resume and four viewport sizes.`);
})().catch(async e=>{console.error(e);if(page)await page.screenshot({path:path.join(root,'tests/artifacts/content-overview-failure.png')});process.exitCode=1}).finally(async()=>{await browser?.close();await new Promise(r=>server.close(r))});
