const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const server=http.createServer((req,res)=>{const f=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(served+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile())return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.DigiBordArchiveReview=true});await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 await page.evaluate(()=>{APP.level='A2';APP.questionMode='direct';settingsPatch({reducedMotion:true,pawnMode:'groups',groupCount:3});ContentUI.setState({family:'grammar',topic:'ER',level:'B2',subtopic:'all',focus:'sequence',duration:1200,difficulty:'hoog'},{render:false});goScreen('boards')});
 for(const board of ['rotterdam','zwolle']){
  await page.evaluate(()=>goScreen('boards'));const before=await page.evaluate(()=>JSON.stringify({boards:APP.boardStates,last:APP.last,turn:APP.turn,used:APP.boardTaskUsed}));
  await page.locator(`#screen-boards [data-board=${board}]`).click();
  assert.ok(await page.locator('#screen-practice.active').isVisible());const state=await page.evaluate(()=>ContentUI.state());
  assert.equal(state.topic,'quick-answer');assert.equal(state.level,'A2');assert.equal(state.variant,board);assert.equal(state.engine,'BOARD');assert.equal(state.organization,'groups');assert.equal(state.focus,'all');assert.equal(state.difficulty,'all');
  assert.equal(await page.evaluate(()=>JSON.stringify({boards:APP.boardStates,last:APP.last,turn:APP.turn,used:APP.boardTaskUsed})),before,'Preparing does not alter saved game');
  assert.ok(await page.locator('[data-practice-step=level]').evaluate(e=>e.open));
  assert.ok(await page.evaluate(()=>ContentUI.previewItems().every(i=>i.version===QuickReview.version&&i.topic==='quick-answer')));
 }
 // Selecting the same lesson through either entry yields the same content.
 await page.evaluate(()=>ContentUI.setSeedOverride(17));const entryIds=await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id));
 await page.evaluate(()=>{ContentUI.clearEditing();ContentUI.open({family:'quick',topic:'quick-answer',level:'A2',engine:'BOARD',variant:'zwolle'});ContentUI.setSeedOverride(17)});
 assert.deepEqual(await page.evaluate(()=>ContentUI.previewItems().map(i=>i.content_item_id)),entryIds);
 // Higher levels remain explicit empty choices, never a hidden fallback to A1/B1.
 await page.evaluate(()=>{APP.level='C2';goScreen('boards')});await page.locator('#screen-boards [data-board=rotterdam]').click();
 assert.equal(await page.evaluate(()=>ContentUI.state().level),'C2');assert.ok(await page.locator('#practiceStart').isDisabled());assert.match(await page.locator('.practice-warning').innerText(),/niet beschikbaar/);
 // The dynamic activity library uses the same entry, without starting or clearing the old game.
 await page.evaluate(()=>{APP.level='A2';goScreen('activities')});await page.locator('[data-library-board=zwolle]').click();assert.equal(await page.evaluate(()=>ContentUI.state().variant),'zwolle');
 // Retained classic source task (with changed wording in the new bank) remains exact through preparation/cancel/reload.
 const old=await page.evaluate(()=>{
  CONTENT_VERT001.stop();APP.level='A2';APP.questionMode='direct';APP.turn.active=0;APP.boardStates.rotterdam={};startBoard('rotterdam');APP.fixedRoll=1;
  const s=APP.boardStates.rotterdam;s.groupPositions.g1=5;s.round=3;s.pending={task:{id:'dq-2-square-11'}};showBoardTask('rotterdam',routeCache.rotterdam);save();
  return {board:structuredClone(s),turn:structuredClone(APP.turn),question:$('#taskTitle').textContent};
 });
 assert.match(old.question,/eerder komen/);
 await page.getByRole('button',{name:'Bordopties',exact:true}).click();await page.locator('#newQuickBoard').click();assert.equal(await page.evaluate(()=>ContentUI.state().topic),'quick-answer');
 assert.deepEqual(await page.evaluate(()=>APP.boardStates.rotterdam),old.board);assert.deepEqual(await page.evaluate(()=>APP.turn),old.turn);
 await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('#taskTitle').innerText(),old.question);assert.deepEqual(await page.evaluate(()=>APP.boardStates.rotterdam),old.board);
 // Restarting a classic direct lesson prepares the revised bank without clearing old pawns.
 await page.getByRole('button',{name:'Bordopties',exact:true}).click();await page.locator('#restartBoard').click();assert.ok(await page.locator('#screen-practice.active').isVisible());assert.deepEqual(await page.evaluate(()=>APP.boardStates.rotterdam),old.board);
 await page.locator('#practiceStart').click();await page.locator('#screen-game.active .board-game').waitFor();
 const session=await page.evaluate(()=>structuredClone(APP.contentSessionConfig));assert.equal(session.selected_game_variant,'rotterdam');assert.equal(session.organization_mode,'groups');
 assert.ok(await page.evaluate(()=>ContentRuntime.enginePool('BOARD',ContentRuntime.activeSession()).every(i=>i.version===QuickReview.version)));
 assert.deepEqual(await page.evaluate(()=>APP.contentBoardBaseline.rotterdam),old.board,'Original board retained behind new lesson');
 await page.locator('#primaryGame').click();await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer.open'));
 const pending=await page.locator('#taskDrawer').getAttribute('data-task-id');await page.evaluate(()=>LessonUI.flush());await page.reload();await page.locator('#resumeBtn').click();await page.locator('#taskDrawer.open').waitFor();
 assert.equal(await page.locator('#taskDrawer').getAttribute('data-task-id'),pending);assert.deepEqual(await page.evaluate(()=>APP.contentSessionConfig.selected_content_refs),session.selected_content_refs);
 // Opening another board must not discard an active shared lesson before the teacher starts a new one.
 const saved=await page.evaluate(()=>({board:structuredClone(APP.boardStates.rotterdam),session:structuredClone(APP.contentSessionConfig)}));
 await page.evaluate(()=>goScreen('boards'));await page.locator('#screen-boards [data-board=zwolle]').click();
 assert.deepEqual(await page.evaluate(()=>({board:APP.boardStates.rotterdam,session:APP.contentSessionConfig})),saved);
 await page.reload();await page.locator('#resumeBtn').click();await page.locator('#taskDrawer.open').waitFor();assert.equal(await page.locator('#taskDrawer').getAttribute('data-task-id'),pending);
 // The untouched conversation route is still playable; stopping a shared lesson restores its original board baseline.
 await page.evaluate(()=>{APP.questionMode='conversation';goScreen('boards')});await page.locator('#screen-boards [data-board=rotterdam]').click();await page.locator('.board-game').waitFor();assert.equal(await page.evaluate(()=>ContentRuntime.activeSession()),null);
 assert.deepEqual(await page.evaluate(()=>APP.boardStates.rotterdam.positions),old.board.positions);assert.deepEqual(await page.evaluate(()=>APP.boardStates.rotterdam.groupPositions),old.board.groupPositions);
 assert.deepEqual(errors,[]);
 console.log('PASS quick entry: Rotterdam/Zwolle/library, same reviewed selection, cleared draft filters, honest C2 empty state, unchanged classic task/pawns on cancel+reload, new lesson+resume, preserved active shared session and conversation route.');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
