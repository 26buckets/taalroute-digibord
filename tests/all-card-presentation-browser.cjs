const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'http://127.0.0.1:8896/index.html');
 const audit=await page.evaluate(()=>{
  const items=ContentRuntime.availableForPreparation(),before=JSON.stringify(items),failures=[],groups={},samples=[];
  const tokens=t=>AppWording.text(t).toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  const labels=new Set('snelvraag opdracht bron achtergrond uitgangszin informatie onderwerp referent gebruik als inspiratie de zin je wilt'.split(' '));
  const node=document.createElement('div');
  for(const item of items){
   node.innerHTML=contentTaskText(item,{card:true});const p=CardPresentation.shared(item),key=item.content_bank_id+'|'+DigiRoutes.classification(item).displayRoute+'|'+item.interaction_type;
   groups[key]=(groups[key]||0)+1;if(groups[key]===1)samples.push(item.content_item_id);
   if(!node.querySelector('.card-action-line')?.textContent.trim())failures.push(item.content_item_id+' no action');
   if(node.querySelectorAll('.content-stimulus').length>1)failures.push(item.content_item_id+' duplicate reading');
   if(/\.:|als dat past/.test(node.querySelector('.content-prompt h2').textContent))failures.push(item.content_item_id+' unclear punctuation/target');
   const visible=node.textContent;
   if(item.options?.some(option=>!visible.includes(AppWording.text(option))))failures.push(item.content_item_id+' missing option');
   if(p?.target&&!node.querySelector('u')?.textContent.includes(p.target))failures.push(item.content_item_id+' missing target');
   if(p?.stimulus&&p.instruction.includes(p.stimulus))failures.push(item.content_item_id+' duplicated stimulus');
   // A bound replacement deliberately replaces the old instruction, not the source sentence.
   if(!/^Verander (?:alleen het laatste deel|het (?:eerste|modale) werkwoord)/.test(item.prompt)){
    const texts=[],walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);while(walker.nextNode())texts.push(walker.currentNode.textContent);
    const seen=new Set(tokens(texts.join(' '))),missing=tokens(item.prompt).filter(t=>!seen.has(t)&&!labels.has(t)&&!(item.content_item_id==='ER_B2_078'&&t==='formuleren'));
    if(missing.length)failures.push(item.content_item_id+' lost words: '+[...new Set(missing)].join(' '));
   }
  }
  return {count:items.length,groups,samples,failures,unchanged:before===JSON.stringify(items)};
 });
 const out=process.env.EVIDENCE_DIR||path.join(__dirname,'artifacts/all-card-presentation');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2));
 assert.equal(audit.count,11338);assert.deepEqual(audit.failures,[]);assert.equal(audit.unchanged,true);
 async function show(id){await page.evaluate(id=>{const item=ContentRuntime.itemById(id),filters={bank_ids:[item.content_bank_id],topics:[item.topic],levels:[DigiRoutes.classification(item).displayRoute],microconstructures:[DigiRoutes.classification(item).Microconstructie].filter(Boolean)};const pool=ContentRuntime.filterSource(filters);ContentUI.launch(ContentRuntime.createSession({filters,selectedGameEngine:'CARDS',targetDurationSeconds:pool.reduce((n,i)=>n+i.estimated_duration_seconds,0),seed:21}));APP.cardShuffles={};APP.last={type:'card',data:{kind:'content-vert001'}};APP.cardIndex=contentSessionCards().findIndex(i=>i.content_item_id===id);if(APP.cardIndex<0)throw Error(id);startContentCards();},id);}
 const verbIds=['016','024'].flatMap(series=>Array.from({length:18},(_,n)=>`WZ_${series}_V${String(n+1).padStart(2,'0')}`));
 const examples=['WZ_024_V14','WZ_024_V10','WZ_024_V18','WZ_016_V05','WZ_024_S01','PB007_A2_01_001','PB005_B1_01_001','REL_B1_081','sq-r0-diamond-024','sq-r6-circle-001'];
 for(const size of [{width:1366,height:768},{width:390,height:620}]){
  await page.setViewportSize(size);
  for(const id of [...new Set([...examples,...verbIds])]){
   await show(id);const content=page.locator('.card-content');assert.ok(await content.evaluate(e=>{e.scrollTop=e.scrollHeight;return e.scrollWidth<=e.clientWidth+1&&e.scrollHeight-e.clientHeight-e.scrollTop<2}));await content.evaluate(e=>e.scrollTop=0);
   if(id==='WZ_024_V14'){assert.equal(await page.locator('.content-stimulus u').innerText(),'moet');assert.match(await page.locator('.content-prompt').innerText(),/‘gaan’/);assert.doesNotMatch(await page.locator('.content-prompt').innerText(),/‘gaat’/);assert.equal(await page.locator('.card-action-line').count(),2);}
   if(verbIds.includes(id)){
    assert.match(await page.locator('.content-prompt').innerText(),/‘(?:gaan|moeten|mogen|kunnen|willen)’/);
    assert.equal(await page.locator('.card-action-line').count(),2);
    assert.ok(await page.locator('.content-stimulus u').innerText());
   }
   if(id==='WZ_024_S01')assert.ok((await page.locator('.content-prompt strong').allTextContents()).some(t=>t.includes('willen')));
   assert.equal(await page.locator('#contentCardAnswer').isVisible(),false);await page.locator('#contentCardReveal').click();assert.ok((await page.locator('#contentCardAnswer').innerText()).trim());await page.locator('#contentCardReveal').click();await content.evaluate(e=>e.scrollTop=0);
   if(examples.includes(id))await page.screenshot({path:path.join(out,id+'-'+size.width+'.png')});
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS: '+audit.count+' available tasks, '+Object.keys(audit.groups).length+' bank/route/type groups, source-word conservation, options, numbered actions, targets, hidden answers and desktop/mobile scrolling.');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
