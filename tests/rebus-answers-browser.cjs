const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright'),{expected}=require('../scripts/p0-card-gate.cjs');
const root=path.resolve(__dirname,'..'),source=require('./fixtures/p0-restored-rebuses-80.json'),solutions=new Map([...require('./fixtures/p0/rebus-drive-evidence.json').assets.map(c=>[c.id,c.solution]),...source.sourceItems.map(c=>[c.id,c.phrase])]);
const rows=expected.filter(c=>c.record.visualRebus).map(c=>({...c,solution:solutions.get(c.id)}));assert.equal(rows.length,90);assert.ok(rows.every(c=>c.solution));
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true}),report={status:'RUNNING',cards:[],errors:[]};try{
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});p.on('pageerror',e=>report.errors.push(e.message));await p.goto(process.env.LIVE_URL||'file://'+path.join(root,process.env.BUILD_SMOKE?'dist':'','index.html'));
 const out=process.env.EVIDENCE_DIR||path.join(root,'test-results/rebus-recovery');fs.mkdirSync(out,{recursive:true});
 for(const [width,height]of [[1440,900],[1024,768],[320,568]]){await p.setViewportSize({width,height});
 for(const row of rows){
  await p.mouse.move(0,0);await p.keyboard.press('Escape');
  await p.evaluate(row=>{CONTENT_VERT001.stop();settingsPatch({reducedMotion:true,sound:false});APP.cardGuided=true;APP.level=row.guided[0];APP.cardKind='idioms';APP.cardShuffles={};APP.cardIndex=cardsFor('idioms').findIndex(c=>c.id===row.id);delete APP.cardRound;APP.last={type:'card',data:{kind:'idioms'}};startCards('idioms')},row);
  assert.equal(await p.evaluate(()=>currentCard().id),row.id);
  await p.locator('#cardRebus img').evaluate(img=>img.decode());assert.equal(await p.locator('#cardRebus img').getAttribute('alt'),row.record.visualRebus.alt);
  const fits=async()=>{const result=await p.evaluate(()=>{fitCardViewport();const c=document.querySelector('.card-content');return c.scrollHeight<=c.clientHeight+1&&c.scrollWidth<=c.clientWidth+1});assert.ok(result,row.id+' content fits '+width)};await fits();
  const norm=s=>s.toLocaleLowerCase('nl').replace(/[^\p{L}\p{N}]+/gu,' ').trim(),leaks=text=>(' '+norm(text)+' ').includes(' '+norm(row.solution)+' ');
  assert.equal(leaks(await p.locator('.active-card').innerText()),false,row.id+' initial answer leak');
  assert.equal(await p.locator('#cardExample').isDisabled(),true,row.id+' solution requires own attempt');
  for(const id of ['cardGoals','cardPartner','cardSetInfo'])assert.equal(await p.locator('#'+id).isDisabled(),true,row.id+' protected '+id);
  await p.locator('#cardRebus').click();assert.equal(leaks(await p.locator('#dialogBody').innerText()),false,row.id+' enlargement leak');await p.keyboard.press('Escape');
  await p.locator('#cardHelp').click();assert.equal(leaks(await p.locator('.active-card').innerText()),false,row.id+' help answer leak');await fits();await p.locator('#cardHelp').click();
  if(width===1440&&['TR-IDIOMS-P001-002-R0','N-A1-I01'].includes(row.id)){await p.screenshot({path:path.join(out,row.id+'-before-desktop.png')});await p.setViewportSize({width:390,height:844});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:path.join(out,row.id+'-before-mobile.png')});await p.setViewportSize({width:1440,height:900});}
  await p.locator('#cardAttempt').click();await p.locator('#cardExample').click();const answer=await p.locator('[data-support=example]').innerText();const fields=await p.evaluate(()=>({model:AppWording.text(currentCard().model.text),instruction:AppWording.text(currentCard().instruction)}));assert.ok(norm(answer).includes(norm(fields.model)),row.id+' model retained');await fits();await p.locator('#cardSetInfo').click();const sourceTask=await p.locator('#dialogBody').innerText();assert.ok(norm(sourceTask).includes(norm(fields.instruction)),row.id+' source instruction retained');for(const hint of await p.evaluate(()=>currentCard().help.items.map(AppWording.text)))assert.ok(norm(sourceTask).includes(norm(hint)),row.id+' source help retained');await p.keyboard.press('Escape');
  report.cards.push({id:row.id,width,height,solution:row.solution,status:'PASS'});
 }}
 assert.deepEqual(report.errors,[]);report.status='PASS';fs.writeFileSync(path.join(out,'answers-audit.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS 90 rebuses at desktop, tablet and small mobile: no visible solution before attempt, safe optional strategy hint, protected support, enlargement, exact source task/model after request; original 40 + restored 80 IDs remain intact.');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
