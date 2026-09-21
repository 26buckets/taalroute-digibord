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
      ['circle','mx-3-onderweg-04-circle','Vertel wat je doet als een trein vertraging heeft'],
      ['square','mx-3-winkelen-06-square','Je koopt kaas. Vraag naar een milde en een pittige soort'],
      ['triangle','mx-3-onderweg-10-triangle','Het is laat. Kies: een dure taxi'],
      ['diamond','mx-3-in-de-les-05-diamond','Je hebt het koud maar een ander juist warm']
    ];
    for(const [shape,id,fragment] of checks){
      await p.evaluate(({shape,id})=>{
        const k=DigiBoard.storageKey(),d=JSON.parse(localStorage.getItem(k));
        d.settings.learningLevel='B1';
        d.settings.questionMode='conversation';
        d.settings.diceStyle='numbers';
        d.settings.workForm='pairs';
        const n=DigiBoardTileShapes[DigiBoard.mapId].indexOf(shape)+1;
        if(n<1) throw new Error('Geen vak voor '+shape);
        d.session.players[0].pos=n;
        d.session.active=0;
        d.session.selected=n;
        d.session.started=true;
        d.session.turn=(d.session.turn||0)+1;
        d.settings.motion=false;
        const type=({circle:'vertel',square:'vraag',triangle:'kies',diamond:'losop'})[shape];
        const base={id:d.session.board.tasks[n-1],number:n,type};
        DigiBoardMatrix.ensure(d,{tasks:[base]});
        const ok=DigiBoardMatrix.select(d,base,id);
        if(!ok) throw new Error('Selectie mislukt '+id);
        localStorage.setItem(k,JSON.stringify(d));
        DigiBoard.saveShared(d);
      },{shape,id});
      await p.reload();
      assert.equal(await p.locator('#pp-task').getAttribute('data-matrix-id'),id);
      assert.ok((await p.locator('#pp-instruction').textContent()).includes(fragment),id);
      const visibleText=await p.locator('#pp-task').textContent();
      const model=await p.evaluate(id=>DigiBoardMatrix.byId.get(id).model,id);
      assert.ok(!visibleText.includes(model),'Model vooraf zichtbaar bij '+id);
      await control(p,'#pp-help','click');
      assert.equal((await p.locator('.db-support-example').textContent()).trim(),model.trim());
      await p.keyboard.press('Escape');
    }
    assert.deepEqual(errors,[]);
    console.log('PASS A2-B1 v2 browser smoke: Vertel, Vraag, Kies en Regel iets');
  }finally{
    await b.close();
    server.close();
  }
})().catch(e=>{console.error(e);process.exit(1);});
