const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright'),{expected,compare}=require('../scripts/p0-card-gate.cjs');
const root=path.resolve(__dirname,'..');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const report={cards:[],screens:[],errors:[]};try{
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});p.on('pageerror',e=>report.errors.push(e.message));
 await p.goto(process.env.LIVE_URL||'file://'+path.join(root,process.env.BUILD_SMOKE?'dist':'','index.html'));await p.waitForFunction(()=>window.ContentUI&&window.E1Release);
 assert.equal(compare(await p.evaluate(require('../scripts/p0-card-snapshot.cjs'))).status,'PASS');
 // Exact route IDs and menu counts from the frozen source-derived manifests in both modes.
 for(const mode of [false,true])for(const route of ['ALPHA_AC','A0_A1','A1_A2','A2_B1','B1_B2','B2_C1']){
  const rows=await p.evaluate(({mode,route})=>{APP.cardGuided=mode;APP.level=route;goScreen('cards');return CARD_GAMES.map(f=>({id:f.id,count:cardCount(f.id),disabled:document.querySelector(`[data-cardgame="${f.id}"]`).disabled}))},{mode,route});
  for(const row of rows){const family=row.id==='c1-between-lines'?'between':row.id,count=expected.filter(c=>c.family===family&&c[mode?'guided':'free'].includes(route)).length;assert.equal(row.count,count,family+route+mode);assert.equal(row.disabled,count===0);}
 }
 // Render every active ID individually at desktop and mobile widths. Full source parity above covers all fields.
 for(const [width,height]of [[1440,900],[1366,768],[390,844],[320,740]]){
  await p.setViewportSize({width,height});
  const audit=await p.evaluate(async rows=>{const failures=[],seen=[];settingsPatch({reducedMotion:true,sound:false});
   for(const row of rows){const {id,family}=row;CONTENT_VERT001.stop();APP.cardGuided=true;APP.level=row.guided[0];APP.cardShuffles={};APP.last=null;delete APP.cardRound;
    if(family==='between'){
     const item=ContentRuntime.itemById(id),session=ContentRuntime.createSession({filters:{bank_ids:['CB-BETWEEN-LINES-012'],levels:row.guided},selectedGameEngine:'CARDS',targetDurationSeconds:ContentRuntime.filterSource({bank_ids:['CB-BETWEEN-LINES-012'],levels:row.guided}).reduce((n,c)=>n+c.estimated_duration_seconds,0),seed:9});ContentUI.launch(session);
     selectShuffledCard('content-vert001',contentSessionCards(),'reset');const list=contentSessionCards();APP.cardIndex=list.findIndex(x=>x.content_item_id===id);APP.cardShuffles={};startContentCards();
     if(document.querySelector('[data-content-item-id]')?.dataset.contentItemId!==id)failures.push(id+' render');
     document.querySelector('#contentCardReveal').click();if(!document.querySelector('#contentCardAnswer').textContent.includes(AppWording.text(item.model_answer)))failures.push(id+' model');
    }else{
     APP.tongueDifficulty='';APP.cardIndex=cardsFor(family).findIndex(c=>c.id===id);APP.cardKind=family;APP.last={type:'card',data:{kind:family}};startCards(family);
     if(currentCard()?.id!==id||document.querySelector('[data-card-id]')?.dataset.cardId!==id)failures.push(id+' render');
     if(family==='tongue'){if(!document.querySelector('#tongueRead').disabled)failures.push(id+' audio');}
     else{const c=currentCard(),text=[...document.querySelectorAll('.card-instruction li')].map(e=>e.textContent).join(' ').replace(/\s+/g,' ').trim();const expected=AppWording.text(c.instruction).replace(/\s+/g,' ').trim();if(!text.includes(expected))failures.push(id+' instruction');
      if(c.visualRebus){if(!document.querySelector('.active-card').textContent.includes(AppWording.text(c.situation)))failures.push(id+' situation');const img=document.querySelector('#cardRebus img');await img.decode().catch(()=>failures.push(id+' media decode'));if(!img.naturalWidth||!img.src.endsWith(c.visualRebus.src))failures.push(id+' media');}
      for(const action of ['cardAttempt','cardExample','cardHelp'])document.getElementById(action)?.click();
      if(!document.querySelector('.active-card').textContent.includes(AppWording.text(c.model.text)))failures.push(id+' model');
     }
    }
    fitCardViewport();const content=document.querySelector('.card-content');if(content&&(content.scrollWidth>content.clientWidth+1||content.scrollHeight>content.clientHeight+1))failures.push(id+' overflow');if(document.documentElement.scrollWidth>innerWidth+1)failures.push(id+' horizontal');seen.push(id);
   }return {seen,failures};},expected);
  report.cards.push({width,height,count:audit.seen.length,failures:audit.failures});assert.equal(new Set(audit.seen).size,530);assert.deepEqual(audit.failures,[],width+' individual renders');
 }
 // Persist each family and each eligible individual ID in the actual shuffle transition, not a positional index.
 const saved=await p.evaluate(rows=>{const failures=[];for(const r of rows){if(r.family==='between')continue;const options={family:r.family,route:r.guided[0],eligibleIds:[r.id],knownIds:rows.filter(x=>x.family===r.family).map(x=>x.id),preferredId:r.id};const deck=CardShuffle.transition(null,options),copy=JSON.parse(JSON.stringify(deck));if(CardShuffle.transition(copy,options).currentCardId!==r.id)failures.push(r.id)}return failures},expected);assert.deepEqual(saved,[]);
 for(const family of [...new Set(expected.filter(x=>x.family!=='between').map(x=>x.family))]){
  const row=expected.find(x=>x.family===family);await p.evaluate(async row=>{CONTENT_VERT001.stop();APP.cardGuided=true;APP.level=row.guided[0];await prepareCards(row.family)},row);
  await p.locator('#primaryGame').click();const before=await p.evaluate(async()=>{await LessonUI.flush();return{id:currentCard().id,deck:APP.cardShuffles[APP.cardKind],groups:APP.groups,boards:APP.boardStates}});
  await p.reload();await p.locator('#resumeBtn').click();assert.deepEqual(await p.evaluate(()=>({id:currentCard().id,deck:APP.cardShuffles[APP.cardKind],groups:APP.groups,boards:APP.boardStates})),before,family+' resume');
 }
 await p.setViewportSize({width:1440,height:900});await p.evaluate(()=>{APP.cardGuided=true;APP.level='A0_A1';APP.cardIndex=1;APP.cardShuffles={};APP.last={type:'card',data:{kind:'idioms'}};startCards('idioms')});
 const out=process.env.EVIDENCE_DIR||path.join(root,'test-results/p0-browser');fs.mkdirSync(out,{recursive:true});await p.screenshot({path:path.join(out,'rebus-desktop.png')});await p.setViewportSize({width:390,height:844});await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await p.screenshot({path:path.join(out,'rebus-mobile.png')});
 assert.deepEqual(report.errors,[]);report.status='PASS';fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('PASS P0: 570 accounted IDs; all 530 active cards at four viewports; 40 blocked; 108 route/mode/family projections; media decode, source instructions, help/models, audio off and resume.');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
