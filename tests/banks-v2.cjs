const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 try{
 const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:'+server.address().port+'/index.html');
 // Fresh boards default to direct questions; settings and inline help preserve the game.
 await p.evaluate(()=>startBoard('rotterdam'));
 await p.getByRole('button',{name:'Bordopties',exact:true}).click();
 assert.equal(await p.locator('#questionMode').inputValue(),'direct');
 assert.deepEqual(await p.locator('#questionMode option').allTextContents(),['Snelvragen','Met gesprekspartner','Mix van beide']);
 const optionState=await p.evaluate(()=>JSON.stringify(APP.boardStates));
 await p.getByRole('button',{name:'Uitleg: Speelmodus',exact:true}).hover();
 assert.match(await p.locator('#contextTooltip').innerText(),/Klassikaal:.*één pion/);
 await p.keyboard.press('Escape');assert.equal(await p.locator('#contextTooltip').isVisible(),false);
 await p.getByRole('button',{name:'Uitleg: Groot houden',exact:true}).focus();
 assert.equal(await p.locator('#contextTooltip').isVisible(),true);
 await p.locator('#optDark').check();await p.locator('#optSound').uncheck();
 assert.equal(await p.locator('.board-game').getAttribute('data-dark'),'true');
 await p.evaluate(()=>playDiceSound());assert.equal(await p.evaluate(()=>appAudio),null,'muted game creates no sound');
 await p.locator('#optSound').check();await p.evaluate(()=>playDiceSound());
 assert.equal(await p.evaluate(()=>!!appAudio),true,'enabled game plays its effect');
 await p.locator('#optSound').uncheck();assert.equal(await p.evaluate(()=>appAudio),null,'muting stops the current sound');
 assert.equal(await p.evaluate(()=>JSON.stringify(APP.boardStates)),optionState);
 await p.reload();await p.evaluate(()=>resumeLast());await p.getByRole('button',{name:'Bordopties',exact:true}).click();
 assert.equal(await p.locator('#optDark').isChecked(),true);assert.equal(await p.locator('#optSound').isChecked(),false);
 await p.setViewportSize({width:390,height:844});
 await p.getByRole('button',{name:'Uitleg: Donkere modus',exact:true}).click();
 assert.equal(await p.locator('#contextTooltip').isVisible(),true,'tap opens explanation');
 assert.equal(await p.locator('#contextTooltip').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}),true);
 await p.keyboard.press('Escape');
 await p.locator('#fullscreenBtn').click();await p.waitForFunction(()=>!!document.fullscreenElement);
 await p.getByRole('button',{name:'Uitleg: Geluid',exact:true}).click();
 assert.equal(await p.evaluate(()=>!!document.fullscreenElement),true,'opening explanation keeps fullscreen');
 assert.equal(await p.locator('#contextTooltip').isVisible(),true,'help is visible in fullscreen');
 assert.equal(await p.locator('#contextTooltip').evaluate(el=>getComputedStyle(el).backgroundColor),await p.locator('#boardOptions').evaluate(el=>getComputedStyle(el).backgroundColor),'fullscreen explanation uses the dark palette');
 await p.locator('#fullscreenBtn').click();await p.waitForFunction(()=>!document.fullscreenElement);
 await p.locator('#optDark').uncheck();await p.locator('#optSound').check();
 await p.setViewportSize({width:1440,height:900});await p.locator('#closeBoardOptions').click();
 const report=await p.evaluate(()=>{
  settingsPatch({reducedMotion:true});startBoard('rotterdam');let count=0,cycles=0;
  const fail=m=>{throw Error(m)};
  // All source records must reach the actual drawer, help, model and criterion.
  for(const bank of [taskBank,directBank])for(const c of bank.cards){
   APP.level=taskBank.routes.find(r=>r.id===c.routeId).legacyLevel;
   APP.questionMode=c.exerciseMode==='direct'?'direct':'conversation';
   APP.boardStates.rotterdam.pending={task:{id:c.id,instruction:'OUDE TEKST'}};
   showBoardTask('rotterdam',routeCache.rotterdam);
   if($('#taskTitle').textContent!==c.instruction||$('#taskInput').textContent!==c.input)fail(c.id+' renderer');
   if($('#gameDialog').open)fail(c.id+' example visible before request');
   showBoardSupport('support');if(!$('#dialogBody').textContent.includes(c.support))fail(c.id+' help');$('#gameDialog').close();showBoardSupport('partner');if(!$('#dialogBody').textContent.includes(c.partner))fail(c.id+' partner');$('#gameDialog').close();
   showBoardSupport('model');if(!$('#dialogBody').textContent.includes(c.model)||!$('#dialogBody').textContent.includes(c.criterion))fail(c.id+' example');$('#gameDialog').close();count++;
  }
  // Every card can be drawn; nothing repeats before the route/shape/mode deck is exhausted.
  for(const mode of ['conversation','direct','mixed'])for(const r of taskBank.routes)for(const shape of taskBank.shapes){
   APP.questionMode=mode;APP.level=r.legacyLevel;const size=mode==='direct'?15:mode==='mixed'?75:60;
   const route={nodes:[{shape:shape.id}]};APP.boardTaskUsed={};
   for(let cycle=0;cycle<2;cycle++){const ids=new Set();for(let n=0;n<size;n++){const c=routeTask(0,route);if(ids.has(c.id)||c.routeId!==r.id||c.shape!==shape.id)fail('cycle '+mode+'/'+r.id+'/'+shape.id);if(mode!=='mixed'&&(c.exerciseMode==='direct')!==(mode==='direct'))fail('mode');ids.add(c.id)}cycles++;}
  }
  APP.questionMode='conversation';APP.level='A0';APP.boardTaskUsed={};APP.boardStates.rotterdam={};APP.turn.active=0;startBoard('rotterdam');APP.fixedRoll=1;save();
  return {records:count,cycles};
 });
 await p.locator('#primaryGame').click();await p.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer').classList.contains('open'));
 const before=await p.evaluate(()=>({positions:JSON.stringify(APP.boardStates.rotterdam.positions),groups:JSON.stringify(APP.boardStates.rotterdam.groupPositions),classPos:APP.boardStates.rotterdam.classPos,turn:JSON.stringify(APP.turn)}));
 await p.getByRole('button',{name:'Bordopties',exact:true}).click();await p.locator('#questionMode').selectOption('direct');
 assert.equal(await p.locator('#taskDrawer').getAttribute('data-question-mode'),'direct');assert.match(await p.locator('#taskMeta').textContent(),/SNELVRAAG/);
 const id=await p.locator('#taskDrawer').getAttribute('data-task-id');await p.locator('#taskExample').click();assert.equal(await p.locator('#gameDialog').isVisible(),true);await p.locator('#dialogClose').click();
 await p.getByRole('button',{name:'Bordopties',exact:true}).click();await p.locator('#nextBoardTask').click();
 assert.notEqual(await p.locator('#taskDrawer').getAttribute('data-task-id'),id);assert.equal(await p.locator('#gameDialog').isVisible(),false);
 const next=await p.locator('#taskDrawer').getAttribute('data-task-id');await p.reload();await p.evaluate(()=>resumeLast());
 assert.equal(await p.locator('#taskDrawer').getAttribute('data-task-id'),next);
 await p.locator('#undoAction').click();assert.equal(await p.locator('#taskDrawer').getAttribute('data-task-id'),id);
 for(const mode of ['mixed','conversation','direct']){
  await p.getByRole('button',{name:'Bordopties',exact:true}).click();await p.locator('#questionMode').selectOption(mode);
  assert.deepEqual(await p.evaluate(()=>({positions:JSON.stringify(APP.boardStates.rotterdam.positions),groups:JSON.stringify(APP.boardStates.rotterdam.groupPositions),classPos:APP.boardStates.rotterdam.classPos,turn:JSON.stringify(APP.turn)})),before);
 }
 await p.locator('#levelSelect').selectOption('A1');assert.equal(await p.locator('#boardMenuToggle').getAttribute('aria-expanded'),'false');assert.ok((await p.locator('#taskDrawer').getAttribute('data-task-id')).startsWith('dq-1-'));
 // Check real UI selections and long help on small and large screens.
 fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
 for(const [width,height]of [[1440,900],[1024,768],[390,844]]){
  await p.setViewportSize({width,height});await p.getByRole('button',{name:'Bordopties',exact:true}).click();
  await p.locator('#questionMode').scrollIntoViewIfNeeded();assert.equal(await p.locator('#questionMode').isVisible(),true);
  assert.equal(await p.locator('#questionMode').evaluate(el=>{const r=el.getBoundingClientRect();return r.height>=44&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===el}),true,'Exercise selector must be unobscured and touch-sized');
  await p.screenshot({path:path.join(root,'test-results',`banks-options-${width}.png`)});await p.locator('#closeBoardOptions').click();
  await p.locator('#taskHelp').click();assert.equal(await p.locator('#gameDialog').isVisible(),true);
  await p.screenshot({path:path.join(root,'test-results',`banks-task-${width}.png`)});await p.locator('#dialogClose').click();
 }
 // Other main activities still use their own banks and shell.
 for(const expression of ["startBoard('zwolle')","startTaalworp('SET_A2_BASIS')","startStory('basis')","startCards('conversation')","startWords('build')"]){await p.evaluate(expression);assert.equal(await p.locator('#primaryGame').count(),1);}
 assert.deepEqual(errors,[]);assert.equal(report.records,1200);assert.equal(report.cycles,96);
 fs.writeFileSync(path.join(root,'test-results/banks-v2.json'),JSON.stringify({...report,errors,ui:'pass',reload:'pass',undo:'pass',pawnPreservation:'pass'},null,2));
 console.log('PASS: 1200 rendered cards, 96 complete deck cycles, mode/route switches, hidden support, reload, undo, pawn preservation, three viewports and other activities.');
 }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
