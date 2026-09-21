const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const served = process.env.BUILD_SMOKE ? path.join(root, 'dist') : root;
const results = path.join(root, 'test-results');
fs.mkdirSync(results, {recursive: true});
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server = http.createServer((req, res) => {
  const file = path.resolve(served, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(served + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404).end(); return;}
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const sizes = [[1920,1080],[1600,900],[1440,900],[1366,768],[1024,768]];
const errors = [], measurements = [];
let browser;
async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function check(page, label) {
  await settle(page);
  await page.evaluate(async()=>{const image=new Image();image.src=document.querySelector('#boardBackground').getAttribute('href');await image.decode();});
  const m = await page.evaluate(() => {
    const v = document.querySelector('#boardViewport').getBoundingClientRect();
    const svg = document.querySelector('#boardMap'), layers = document.querySelector('#boardLayers');
    const c = layers.getScreenCTM(), design = svg.getScreenCTM();
    const route = routeCache[APP.last.data.board];
    const rect = r => ({x:r.x,y:r.y,width:r.width,height:r.height});
    const inside = (x,y) => x >= v.left-.1 && x <= v.right+.1 && y >= v.top-.1 && y <= v.bottom+.1;
    const point = p => {const q = new DOMPoint(p.x,p.y).matrixTransform(c); return inside(q.x,q.y);};
    const elements = [...layers.querySelectorAll('#boardBackground,#boardRoute,#pawnLayer,.bridge-front')];
    const same = elements.every(el => {const d=el.getScreenCTM();return ['a','b','c','d','e','f'].every(k=>Math.abs(d[k]-c[k])<1e-7);});
    const task = document.querySelector('#taskDrawer'), options = document.querySelector('#boardOptions');
    const nodeBounds = [...document.querySelectorAll('#boardRoute text,#boardRoute>g,.map-pawn')].every(el => {
      const b=el.getBoundingClientRect();return inside(b.left,b.top)&&inside(b.right,b.bottom);
    });
    const corners = [[0,0],[route.sourceWidth,0],[route.sourceWidth,route.sourceHeight],[0,route.sourceHeight]].every(([x,y])=>point({x,y}));
    const tripPoints = (route.alternativeRoutes||[]).flatMap(t=>t.segments||[]).flatMap(s=>s.points).every(([x,y])=>point({x,y}));
    const maskPoints = (route.occlusionPolygons||[]).flatMap(m=>m.points).every(([x,y])=>point({x,y}));
    return {viewport:rect(v),source:rect(document.querySelector('#boardBackground').getBoundingClientRect()),scale:design.a,
      optimal:Math.min(v.width/1920,v.height/900),uniform:Math.abs(c.a-c.d)<1e-7&&c.b===0&&c.c===0,
      same,corners,nodes:route.nodes.every(point),nodeBounds,tripPoints,maskPoints,
      taskClear:!task.classList.contains('open')||v.bottom<=task.getBoundingClientRect().top+.2,
      optionsClear:!options.classList.contains('open')||v.right<=options.getBoundingClientRect().left+.2,
      pageFits:document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight,
      viewBox:svg.getAttribute('viewBox'),aspect:svg.getAttribute('preserveAspectRatio'),
      layers:[...layers.children].map(el=>el.id||el.tagName)};
  });
  for (const key of ['same','corners','nodes','nodeBounds','tripPoints','maskPoints','uniform','taskClear','optionsClear','pageFits']) assert.equal(m[key], true, `${label}: ${key}\n${JSON.stringify(m)}`);
  assert.ok(m.viewport.width>0&&m.viewport.height>0,label+' has space');
  assert.ok(Math.abs(m.scale-m.optimal)<1e-7,label+' maximizes contain');
  assert.equal(m.viewBox,'0 0 1920 900');assert.equal(m.aspect,'xMidYMid meet');
  measurements.push({label,...m});
  return m;
}
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--allow-file-access-from-files']});
  const page = await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))errors.push(response.status()+' '+response.url());});
  await page.addInitScript(() => {
    const NativeResizeObserver=window.ResizeObserver;
    window.observedViewports=[];
    window.ResizeObserver=class extends NativeResizeObserver {
      constructor(callback){super(callback);this.targets=new Set();window.observedViewports.push(this);}
      observe(el,options){this.targets.add(el);super.observe(el,options);}
      disconnect(){this.targets.clear();super.disconnect();}
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  // Default overlay mode keeps board size and position when panels open.
  await page.evaluate(()=>{settingsPatch({reducedMotion:true});startBoard('rotterdam');});
  const boardRect = () => page.locator('#boardBackground').evaluate(el => JSON.stringify(el.getBoundingClientRect()));
  const fixedRect = await boardRect();
  await page.getByRole('button',{name:'Bordopties',exact:true}).click();
  await page.waitForTimeout(250);
  assert.equal(await boardRect(),fixedRect,'options must not shrink the default board');
  await page.locator('#closeBoardOptions').click();
  await page.evaluate(()=>showBoardTask('rotterdam',routeCache.rotterdam));
  await page.waitForTimeout(350);
  assert.equal(await boardRect(),fixedRect,'task must not shrink the default board');
  await page.locator('#taskHelp').click();
  await settle(page);
  assert.equal(await boardRect(),fixedRect,'help must not shrink the default board');
  await page.locator('#dialogClose').click();
  await page.getByRole('button',{name:'Bordopties',exact:true}).click();
  await page.getByRole('radio',{name:'Alles zichtbaar',exact:true}).check();
  await page.waitForTimeout(250);
  assert.notEqual(await boardRect(),fixedRect,'adaptive mode must fit the remaining space');
  await page.reload();
  await page.evaluate(()=>startBoard('rotterdam'));
  assert.equal(await page.locator('.board-game').getAttribute('data-board-fit'),'adaptive','choice persists');
  await page.evaluate(()=>{delete APP.boardStates.rotterdam.pending;save();});
  if (process.env.BUILD_SMOKE) {
    await page.evaluate(()=>startBoard('rotterdam'));await check(page,'built Rotterdam');
    await page.evaluate(()=>startBoard('zwolle'));await check(page,'built Zwolle');
  } else {
    const fixture = JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/deventer.json')));
    await page.evaluate(route=>{routeCache.deventer=route;},fixture);
    for (const [width,height] of (process.env.QUICK_SMOKE?[]:sizes)) {
      await page.setViewportSize({width,height});
      for (const board of ['rotterdam','zwolle','deventer']) {
        await page.evaluate(board=>startBoard(board),board);
        for (const fullscreen of [false,true]) {
          if(fullscreen){await page.locator('#fullscreenBtn').click();assert.equal(await page.evaluate(()=>!!document.fullscreenElement),true);}
          const base=`${board} ${width}x${height} ${fullscreen?'fullscreen':'window'}`;
          await check(page,base+' closed');
          if(width===1920&&!fullscreen)await page.screenshot({path:path.join(results,board+'-closed.png')});
          await page.getByRole('button',{name:'Bordopties',exact:true}).click();
          await page.waitForTimeout(250);await check(page,base+' options');
          await page.locator('#closeBoardOptions').click();
          await page.evaluate(board=>{APP.fixedRoll=1;showBoardTask(board,routeCache[board]);},board);
          await page.waitForTimeout(330);await check(page,base+' task');
          if(width===1024&&!fullscreen)await page.screenshot({path:path.join(results,board+'-task-1024.png')});
          await page.getByRole('button',{name:'Bordopties',exact:true}).click();
          await page.waitForTimeout(250);await check(page,base+' task+options');
          await page.locator('#closeBoardOptions').click();
          await page.evaluate(board=>{delete APP.boardStates[board].pending;startBoard(board);},board);
          if(fullscreen){await page.locator('#fullscreenBtn').click();assert.equal(await page.evaluate(()=>!!document.fullscreenElement),false);}
          await check(page,base+' restored');
        }
      }
      console.log(`PASS: three worlds, task/options open/closed, actual fullscreen at ${width}x${height}`);
    }
    // Resize the same mount; open support must trigger ResizeObserver without app render.
    await page.evaluate(()=>{settingsPatch({pawnMode:'individual',participants:[{id:'p0',name:'Laila'},{id:'p1',name:'Daan'}]});APP.boardStates.rotterdam={};APP.turn.active=0;startBoard('rotterdam');});
    for(const [width,height] of sizes){await page.setViewportSize({width,height});await check(page,`live resize ${width}`);}
    await page.evaluate(()=>{APP.fixedRoll=1;save();});
    await page.locator('#boardViewport').click();await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('#taskDrawer').classList.contains('open'));
    await page.waitForTimeout(350);await check(page,'real roll');
    await page.locator('#taskHelp').click();assert.equal(await page.locator('#gameDialog').isVisible(),true);await check(page,'help dialog');await page.locator('#dialogClose').click();
    await page.locator('#taskExample').click();await check(page,'example expanded');
    await page.evaluate(()=>{document.querySelector('#dialogBody').textContent='Lange ondersteuning. '.repeat(150);});
    await check(page,'long support dialog preserves board');await page.locator('#dialogClose').click();
    const before = await page.evaluate(()=>APP.boardStates.rotterdam.positions.p0);
    await page.locator('#boardViewport').click();await page.keyboard.press('Space');await page.waitForFunction(()=>!boardBusy&&document.querySelector('#taskDrawer').classList.contains('open'));
    assert.equal(await page.evaluate(()=>APP.boardStates.rotterdam.positions.p0),before);
    assert.equal(await page.evaluate(()=>APP.boardStates.rotterdam.positions.p1),1);
    await page.waitForTimeout(350);await check(page,'next space rolls next pawn');
    // Toggling numbers must only update route labels, preserving background, pawns, masks and taxi.
    await page.getByRole('button',{name:'Bordopties',exact:true}).click();
    await page.locator('#optNumbers').uncheck();
    assert.equal(await page.locator('#boardBackground').count(),1);assert.ok(await page.locator('.map-pawn').count()>0);
    assert.ok(await page.locator('.bridge-front image').count()>0);assert.equal(await page.locator('#boardTaxi').count(),1);
    await page.evaluate(()=>{home();startBoard('zwolle');home();startBoard('rotterdam');});await check(page,'navigation reconnect');
    // Animated taxi and pawn share the same source coordinates throughout resize.
    await page.evaluate(()=>{settingsPatch({reducedMotion:false});document.querySelector('#closeBoardOptions')?.click();});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(()=>{window.viewportTrip=animateBoardPath('rotterdam',routeCache.rotterdam,[[820,500],[870,530]],true);});
    await page.setViewportSize({width:1440,height:900});await check(page,'resize during taxi movement');
    assert.equal(await page.evaluate(()=>window.viewportTrip),true);
    const taxiPosition=await page.evaluate(()=>{const c=document.querySelector('#boardLayers').getScreenCTM(),t=document.querySelector('#boardTaxi').getScreenCTM();return {x:t.e,y:t.f,expectedX:c.a*870+c.e,expectedY:c.d*530+c.f};});
    assert.ok(Math.abs(taxiPosition.x-taxiPosition.expectedX)<.01&&Math.abs(taxiPosition.y-taxiPosition.expectedY)<.01);
    await page.evaluate(()=>home());
    assert.equal(await page.evaluate(()=>window.observedViewports.filter(o=>[...o.targets].some(el=>el.id==='boardView')).length),0,'leaving board disconnects observer');
    await page.evaluate(()=>startBoard('zwolle'));
    assert.equal(await page.evaluate(()=>window.observedViewports.filter(o=>[...o.targets].some(el=>el.id==='boardView')).length),1,'one current board observer');
    // Existing activities remain usable after observer disposal.
    for(const expression of ["startTaalworp('SET_A2_BASIS')","startStory('basis')","startCards('conversation')"]){await page.evaluate(expression);assert.equal(await page.locator('#primaryGame').count(),1);}
    // Self-contained file entry remains supported.
    const offline=await browser.newPage();offline.on('pageerror',e=>errors.push(e.message));
    await offline.goto('file://'+path.join(root,'index.html'));await offline.evaluate(()=>startBoard('rotterdam'));await check(offline,'offline file');await offline.close();
  }
  assert.deepEqual(errors,[],'browser errors');
  fs.writeFileSync(path.join(results,process.env.BUILD_SMOKE?'build-smoke.json':process.env.QUICK_SMOKE?'quick-smoke.json':'board-matrix.json'),JSON.stringify(measurements,null,2));
  console.log(`PASS: ${measurements.length} geometry checks; no browser errors.`);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
