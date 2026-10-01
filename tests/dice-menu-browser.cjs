const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome',args:['--allow-file-access-from-files']});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'file://'+path.join(served,'index.html'));
 await page.locator('[data-category=dice]').click();
 assert.deepEqual(await page.locator('#screen-dice h3').allTextContents(),['Zinnen bouwen','Verhaal maken','Dobbelen met opdrachten']);
 const images=await page.locator('#screen-dice .tile-img').evaluateAll(async els=>Promise.all(els.map(async e=>{const i=new Image();i.src=getComputedStyle(e).backgroundImage.slice(5,-2);await i.decode();return i.src})));
 assert.equal(new Set(images).size,3,'Each card has its own working image');
 for(const width of [1920,1440,1024,768,390,320]){
  await page.setViewportSize({width,height:900});
  const cards=await page.locator('#screen-dice .tile').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {height:r.height,parts:['.tile-img','.status','h3','p'].map(q=>{const x=e.querySelector(q).getBoundingClientRect();return {top:x.top-r.top,height:x.height}})}}));
  for(const c of cards.slice(1)){
   assert.ok(Math.abs(c.height-cards[0].height)<1,'Equal card height '+width);
   c.parts.forEach((p,i)=>assert.ok(Math.abs(p.top-cards[0].parts[i].top)<1,'Aligned row '+i+' at '+width));
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No sideways overflow '+width);
  if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'dobbelmenu-'+width+'.png'),fullPage:true});}
 }
 await page.setViewportSize({width:1440,height:900});
 await page.locator('#screen-dice [data-dicegame=verhaalworp]').click();
 assert.deepEqual(await page.locator('[data-storycount]').allTextContents(),['3','6','9']);
 assert.ok(await page.locator('.story-count-choices').evaluate(e=>e.getBoundingClientRect().top<document.querySelector('#storySet').getBoundingClientRect().top));
 for(const n of [3,6,9]){await page.locator(`[data-storycount="${n}"]`).click();assert.equal(await page.locator('.story-tile').count(),n);await page.locator('#primaryGame').click();await page.waitForFunction(()=>!storyBusy);assert.equal(await page.evaluate(()=>new Set(APP.storyRoll).size),n);}
 const roll=await page.evaluate(()=>APP.storyRoll);
 if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'negen-stenen.png'),fullPage:true});
 await page.reload();await page.locator('#resumeBtn').click();assert.equal(await page.locator('.story-tile').count(),9);assert.deepEqual(await page.evaluate(()=>APP.storyRoll),roll);
 await page.locator('.dice-sidebar [data-dice-preparation]').click();assert.ok(await page.locator('#screen-practice.active').isVisible());
 assert.deepEqual(errors,[]);console.log('PASS three unique images; uniform image/label/title/text/card geometry at six widths; 3/6/9 unique dice, nine-dice resume and unchanged preparation.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
