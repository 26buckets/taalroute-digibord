import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// Run: LIVE_TEST_URL=http://127.0.0.1:8893 node live-card.test.mjs
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage(),errors=[],results=[];
const screenshots=process.env.SCREENSHOT_DIR;
if(screenshots)fs.mkdirSync(screenshots,{recursive:true});
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&!r.url().includes('favicon'))errors.push(`${r.status()} ${r.url()}`)});
try{
  await page.goto(process.env.LIVE_TEST_URL||'http://127.0.0.1:8893');
  assert.deepEqual(await page.locator('.gamecard h2').allTextContents(),['Speelborden','Dobbelspellen','Kaartspellen','Woorden en zinnen','Meer manieren om te oefenen','Live']);
  const live=page.locator('.gamecard-live');
  assert.equal(await live.isDisabled(),true);
  assert.equal(await live.getAttribute('data-category'),null);
  assert.equal(await live.locator('a,.arrowbubble').count(),0);
  assert.equal(await page.locator('#live-subtitle').innerText(),'Iedereen doet mee');
  assert.equal(await page.locator('#live-status').innerText(),'Binnenkort');
  assert.equal(await live.evaluate(el=>el.onclick===null),true);
  assert.equal(await page.locator('#screen-live').count(),0);
  assert.equal(await live.evaluate(el=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0);img.onerror=()=>resolve(false);img.src=getComputedStyle(el.querySelector('.photo')).backgroundImage.slice(5,-2)})),true);
  for(const [width,height,columns] of [[1920,1080,6],[1440,900,6],[1280,720,6],[1080,890,3],[1024,768,3],[700,800,2],[390,844,1],[320,568,1]]){
    await page.setViewportSize({width,height});
    await page.locator('#screen-play').evaluate(el=>el.scrollTop=0);
    for(const control of await page.locator('header button:visible,header select:visible').all()){
      const box=await control.boundingBox(),header=await page.locator('header').boundingBox();
      assert.ok(box.x>=0&&box.x+box.width<=width+1&&box.y+box.height<=header.y+header.height+1,`header control clipped at ${width}`);
    }
    const layout=await page.locator('#screen-play').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,columns:getComputedStyle(el.querySelector('.gamecards')).gridTemplateColumns.split(' ').length}));
    assert.ok(layout.scroll<=layout.width,`horizontal overflow at ${width}`);
    assert.ok(layout.width<=width,`landing wider than viewport at ${width}`);
    assert.equal(layout.columns,columns);
    for(const card of await page.locator('.gamecard').all()){
      const box=await card.boundingBox();
      assert.ok(box.width>=(width>=1200?180:270)&&box.height>=(width>=900?240:380),`squashed card at ${width}: ${JSON.stringify(box)}`);
    }
    const shortcuts=await page.locator('.landing-bottom > *').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}));
    assert.equal(shortcuts.length,3);
    assert.equal(await page.locator("#resumeBtn .chev").isVisible(),true,`resume arrow visible at ${width}`);
    assert.ok(shortcuts.every(r=>Math.abs(r.y-shortcuts[0].y)<1&&r.x>=0&&r.x+r.width<=width),`shortcut row at ${width}`);
    if(width>=1200||width===1080)assert.ok(await page.locator('#screen-play').evaluate(el=>el.scrollHeight<=el.clientHeight+1),`landing fits one screen at ${width}`);
    for(const img of await page.locator('.landing-shortcut img').all())assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
    if(screenshots&&width>=900)await page.screenshot({path:`${screenshots}/compact-landing-${width}.png`});
    if(screenshots&&[1920,390].includes(width))await page.screenshot({path:`${screenshots}/live-${width}-top.png`});
    await live.scrollIntoViewIfNeeded();
    const box=await live.boundingBox();
    const screenBox=await page.locator('#screen-play').boundingBox();
    assert.ok(box.x>=0&&box.x+box.width<=width+1,`Live clipped horizontally at ${width}`);
    assert.ok(box.y>=screenBox.y&&box.y+box.height<=height+1,`Live is not fully reachable at ${width}`);
    assert.equal(await page.locator('#live-subtitle').isVisible(),true);
    const before=await live.evaluate(el=>[getComputedStyle(el).transform,getComputedStyle(el.querySelector('.photo')).transform]);
    await live.hover();
    assert.deepEqual(await live.evaluate(el=>[getComputedStyle(el).transform,getComputedStyle(el.querySelector('.photo')).transform]),before);
    assert.equal(await live.evaluate(el=>getComputedStyle(el).cursor),'default');
    await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
    await live.evaluate(el=>{el.click();el.focus()});
    assert.equal(await live.evaluate(el=>el===document.activeElement),false);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#screen-play').isVisible(),true);
    if(screenshots&&[1440,390,320].includes(width))await page.screenshot({path:`${screenshots}/live-${width}-bottom.png`});
    results.push({width,height,columns,disabled:true,overflow:false});
  }
  await page.setViewportSize({width:1440,height:900});
  for(const [category,screen] of [['boards','boards'],['dice','dice'],['cards','game'],['words','words'],['workforms','workforms']]){
    await page.locator('.gamecard[data-category="'+category+'"]').click();
    assert.equal(await page.locator('#screen-'+screen).isVisible(),true,category);
    await page.locator('.navitem[data-main="play"]').click();
  }
  await page.locator('#screen-play [data-category="workforms"]').click();await page.locator('#workformDecks [data-activity="memory"]').click();await page.locator('[data-main="play"]').click();await page.locator('#resumeBtn').click();assert.equal(await page.locator('.new-activity .card-ribbon strong').innerText(),'Memory');await page.locator('[data-main="play"]').click();
  await page.locator('#levelSelect').focus();
  for(let i=0;i<12;i++){
    await page.keyboard.press('Tab');
    assert.equal(await live.evaluate(el=>el===document.activeElement),false);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await live.scrollIntoViewIfNeeded();await live.hover();
  assert.equal(await live.evaluate(el=>getComputedStyle(el.querySelector('.photo')).transform),'none');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'PASS',viewports:results,navigation:'5 category routes pass',keyboard:'Live skipped; Enter/Space inert',errors},null,2));
}finally{await browser.close()}
