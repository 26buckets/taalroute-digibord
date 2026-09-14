// Read-only site verification; browser lesson changes use a fresh, isolated profile.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),{control}=require('./ui-controls.cjs');
const base=process.env.APP_URL;if(!base)throw Error('Set APP_URL to the published Praatpad.html URL');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const registry={};vm.runInNewContext(fs.readFileSync('Kaarten/register.js','utf8'),registry);
 const maps=registry.DigiBoardMaps,out=path.join(__dirname,'artifacts/published-library');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
 const errors=[],verified={},pending=[],wanted=new Set(['Praatpad.html','Kaarten/register.js','Kaarten/nieuwe-werelden.js','Kaarten/nederland-werelden.js','Kaarten/ruimtewerking.js','digiboard.js','Lessen/kaartvormen.js',...maps.flatMap(m=>['Kaarten/'+m.id+'.js',m.image])]);
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{
  const url=new URL(r.url()),file=decodeURIComponent(url.pathname).replace(/^\//,'');
  if(url.origin!==new URL(base).origin)return;
  if(r.status()>=400)errors.push(r.status()+' '+file);
  if(wanted.has(file))pending.push((async()=>{try{const online=await r.body(),local=fs.readFileSync(file);assert.equal(hash(online),hash(local),'Published bytes differ: '+file);verified[file]=hash(online);}catch(e){errors.push(e.message);}})());
 });
 try{
  for(const map of maps){
   const url=new URL(base);url.searchParams.set('kaart',map.id);await page.goto(url.href);await page.locator('#pp-scenery').evaluate(e=>e.decode());
   assert.equal(await page.evaluate(()=>DigiBoard.mapId),map.id);assert.equal(await page.locator('[data-node]').count(),map.count,map.id);
   console.log('ONLINE',map.id,map.count);
  }
  await control(page,'#db-open-maps','click');
  for(const [id,count]of [['dagelijks',6],['nederland',28],['fantasie',8],['spreektijd',4],['kort',12]]){
   await page.locator(`[data-map-category="${id}"]`).click();assert.equal(await page.locator('[data-choose-world]:visible').count(),count);
  }
  await page.locator('[data-choose-world]:visible img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode()})));
  await page.screenshot({path:path.join(out,'online-kort.png')});
  await page.locator('[data-choose-world="spreektijd-afspraak"]').click();await page.waitForURL(/kaart=spreektijd-afspraak/);await page.locator('#pp-scenery').evaluate(e=>e.decode());
  await page.goBack();await page.locator('#pp-scenery').evaluate(e=>e.decode());assert.equal(await page.evaluate(()=>DigiBoard.mapId),'nederland-veluwe');assert.equal(await page.locator('#pp-dialog').evaluate(e=>e.open),false);
  const delft=new URL(base);delft.searchParams.set('kaart','nederland-delft');await page.goto(delft.href);await page.locator('#pp-scenery').evaluate(e=>e.decode());
  await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem(DigiBoard.storageKey()));Object.assign(d.settings,{motion:false,sound:false,pace:'dice',turnStyle:'turns'});d.session.players.forEach(p=>p.pos=15);d.session.selected=15;d.session.active=0;d.session.finished=false;d.history=[];localStorage.setItem(DigiBoard.storageKey(),JSON.stringify(d));DigiBoard.saveShared(d);});
  await page.reload();await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#pp-scenery').evaluate(e=>e.decode());await page.evaluate(()=>Math.random=()=>0);await page.locator('#pp-roll').click();
  await page.waitForFunction(()=>document.querySelector('[data-dutch-boat]')?.getAttribute('visibility')==='visible');
  await page.screenshot({path:path.join(out,'online-delft-pont.png')});
  await page.waitForFunction(()=>!document.querySelector('#pp-roll').disabled);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem(DigiBoard.storageKey())).session.players[0].pos),16);
  await Promise.all(pending);assert.deepEqual(errors,[]);for(const file of wanted)assert(verified[file],'Not loaded online: '+file);
  fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({url:base,maps:46,categories:5,short:12,boat:'15→16 passed',history:true,verified,errors},null,2));
  console.log('PASS published 46 maps, five categories, short links/history, actual Delft ferry and '+Object.keys(verified).length+' identical source/media files');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
