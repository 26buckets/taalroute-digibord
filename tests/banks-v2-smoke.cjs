const {control}=require('./ui-controls.cjs');
const {chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 try{
  const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:'+server.address().port+'/Praatpad.html?kaart=Rotterdam-havenroute');
  const ids=await p.evaluate(()=>[DigiBoardMatrix.bank,DigiBoardMatrix.directBank].flatMap(bank=>bank.routes.flatMap(r=>bank.shapes.map(s=>bank.cards.find(c=>c.routeId===r.id&&c.shape===s.id).id))));
  for(const id of ids){
   const card=await p.evaluate(id=>{
    const c=DigiBoardMatrix.byId.get(id),k=DigiBoard.storageKey(),d=JSON.parse(localStorage.getItem(k));
    d.settings.learningLevel=DigiBoardMatrix.bank.routes.find(r=>r.id===c.routeId).legacyLevel;
    d.settings.questionMode=c.exerciseMode==='direct'?'direct':'conversation';d.settings.diceStyle='numbers';d.settings.workForm='pairs';d.settings.motion=false;
    const n=DigiBoardTileShapes[DigiBoard.mapId].indexOf(c.shape)+1;
    d.session.players[0].pos=n;d.session.active=0;d.session.selected=n;d.session.started=true;d.session.turn++;
    const base={id:d.session.board.tasks[n-1],number:n,type:{circle:'vertel',square:'vraag',triangle:'kies',diamond:'losop'}[c.shape]};
    DigiBoardMatrix.ensure(d,{tasks:[base]});if(!DigiBoardMatrix.select(d,base,id))throw Error(id);
    localStorage.setItem(k,JSON.stringify(d));DigiBoard.saveShared(d);return c;
   },id);
   await p.reload();assert.equal(await p.locator('#pp-task').getAttribute('data-matrix-id'),id);
   assert.equal(await p.locator('#pp-instruction').textContent(),card.instruction);
   await control(p,'#pp-help','click');assert.equal((await p.locator('.db-support-example').textContent()).trim(),card.model.trim());await p.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);console.log('PASS: both banks, all four routes and four shapes render current prompts and models (32 combinations).');
 }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
