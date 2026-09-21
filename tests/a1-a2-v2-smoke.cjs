const {control}=require('./ui-controls.cjs');
const {chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 try{
  const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:'+server.address().port+'/Praatpad.html?kaart=Rotterdam-havenroute');
  const checks=[
   ['circle','mx-2-onderweg-04-circle','Vertel hoe je naar het station gaat'],
   ['square','mx-2-winkelen-06-square','Vraag welke kaas mild is'],
   ['triangle','mx-2-dagelijks-08-triangle','Het is vijf kilometer en droog. Kies: fiets of bus'],
   ['diamond','mx-2-in-de-les-10-diamond','Je kunt de volgende les niet komen']
  ];
  for(const [shape,id,fragment] of checks){
   await p.evaluate(({shape,id})=>{
    const k=DigiBoard.storageKey(),d=JSON.parse(localStorage.getItem(k));
    d.settings.learningLevel='A2';
    d.settings.questionMode='conversation';
    d.settings.diceStyle='numbers';
    d.settings.workForm='pairs';
    const n=DigiBoardTileShapes[DigiBoard.mapId].indexOf(shape)+1;
    if(n<1)throw new Error('Geen vak voor '+shape);
    d.session.players[0].pos=n;d.session.active=0;d.session.selected=n;d.session.started=true;d.session.turn=(d.session.turn||0)+1;d.settings.motion=false;
    const type=({circle:'vertel',square:'vraag',triangle:'kies',diamond:'losop'})[shape];
    const base={id:d.session.board.tasks[n-1],number:n,type};
    DigiBoardMatrix.ensure(d,{tasks:[base]});
    if(!DigiBoardMatrix.select(d,base,id))throw new Error('Selectie mislukt '+id);
    localStorage.setItem(k,JSON.stringify(d));DigiBoard.saveShared(d);
   },{shape,id});
   await p.reload();
   assert.equal(await p.locator('#pp-task').getAttribute('data-matrix-id'),id);
   assert.ok((await p.locator('#pp-instruction').textContent()).includes(fragment),id);
   const visible=await p.locator('#pp-task').textContent();
   const model=await p.evaluate(id=>DigiBoardMatrix.byId.get(id).model,id);
   assert.ok(!visible.includes(model),'Model vooraf zichtbaar bij '+id);
   await control(p,'#pp-help','click');
   assert.equal((await p.locator('.db-support-example').textContent()).trim(),model.trim());
   await p.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS A1-A2 v2 browser smoke: Vertel, Vraag, Kies en Regel iets');
 }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
