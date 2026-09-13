const {chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
 const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{const Native=window.Audio;window.__audio=[];window.__played=0;window.Audio=function(...args){const a=new Native(...args);a.addEventListener('playing',()=>window.__played++);window.__audio.push(a);return a;};});
 await p.goto(`http://127.0.0.1:${server.address().port}/Start-Praatpad.html`);
 assert.equal(await p.locator('#pp-sound').getAttribute('aria-pressed'),'true');
 await p.locator('#pp-roll').click();await p.waitForFunction(()=>window.__played===1);await p.waitForFunction(()=>window.__audio[0].ended);
 assert(await p.evaluate(()=>window.__audio[0].currentTime>.5));
 // Decode the shipped recording and confirm it contains audible samples.
 const peak=await p.evaluate(async()=>{const ctx=new AudioContext(),buf=await ctx.decodeAudioData(await(await fetch(__audio[0].src)).arrayBuffer());let peak=0;for(const v of buf.getChannelData(0))peak=Math.max(peak,Math.abs(v));await ctx.close();return peak;});assert(peak>.1);
 await p.locator('#pp-sound').click();await p.reload();assert.equal(await p.locator('#pp-sound').getAttribute('aria-pressed'),'false');
 await p.locator('#pp-roll').click();await p.waitForFunction(()=>!document.getElementById('pp-roll').disabled);assert.equal(await p.evaluate(()=>__played),0);
 await p.locator('#pp-settings-button').click();await p.locator('#pp-nav-dice').click();await p.locator('#pp-dice-style').selectOption('verbs');await p.locator('#pp-settings-close').click();
 assert(await p.locator('.aw-utilities #pp-sound').isVisible());await p.locator('#pp-sound').click();await p.waitForFunction(()=>__played===1);await p.waitForFunction(()=>__audio[0].ended);
 await p.getByRole('button',{name:'Werp alle negen',exact:true}).click();await p.waitForFunction(()=>__played===2);await p.locator('#pp-sound').click();assert(await p.evaluate(()=>__audio[0].paused));
 await p.reload();assert.equal(await p.locator('#pp-sound').getAttribute('aria-pressed'),'false');
 // Old app forced this field off; restore it once, then respect explicit mute.
 await p.evaluate(()=>{const k=DigiBoard.storageKey(),d=JSON.parse(localStorage.getItem(k));delete d.settings.diceAudioRestored;d.settings.sound=false;localStorage.setItem(k,JSON.stringify(d));DigiBoard.saveShared(d);});await p.reload();assert.equal(await p.locator('#pp-sound').getAttribute('aria-pressed'),'true');
 assert.deepEqual(errors,[]);console.log('PASS actual audio playback, non-silent sample, both dice games, mute, reload and one-time restoration');
 }finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
