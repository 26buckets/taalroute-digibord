const{chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
 const p=await b.newPage({viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{const Native=Audio;window.__played=0;window.Audio=function(...args){const a=new Native(...args);window.__sound=a;a.addEventListener('playing',()=>__played++);return a;};});
 await p.goto(`http://127.0.0.1:${server.address().port}/Praatpad.html`);
 async function menu(){await p.locator('#pp-settings-button').click();await p.locator('#pp-nav-sound').click();}
 await menu();assert.deepEqual(await p.locator('#pp-sound-choice option').allTextContents(),['Origineel','Zacht op vilt','Klassiek op hout','Dobbelbeker en rollen','Licht op het spelbord']);assert.equal(await p.locator('#pp-sound-choice').inputValue(),'original');
 await p.locator('#pp-sound-enabled').uncheck();
 for(const id of ['original','felt','wood','cup','board']){await p.locator('#pp-sound-choice').selectOption(id);const count=await p.evaluate(()=>__played);await p.locator('#pp-sound-preview').click();await p.waitForFunction(n=>__played>n,count);assert.equal(await p.locator('#pp-sound-preview').textContent(),'Stop');await p.waitForFunction(()=>__sound.ended);assert.equal(await p.locator('#pp-sound-preview').textContent(),'Beluisteren');assert.equal(await p.locator('#pp-sound-enabled').isChecked(),false);}
 await p.locator('#pp-sound-choice').selectOption('felt');await p.locator('#pp-settings-close').click();await p.reload();await menu();assert.equal(await p.locator('#pp-sound-choice').inputValue(),'felt');assert.equal(await p.locator('#pp-sound-enabled').isChecked(),false);
 await p.locator('#pp-sound-choice').selectOption('original');await p.locator('#pp-sound-enabled').check();await p.locator('#pp-sound-preview').click();await p.waitForFunction(()=>!__sound.paused);await p.locator('#pp-settings-close').click();assert(await p.evaluate(()=>__sound.paused));
 await menu();await p.screenshot({path:__dirname+'/artifacts/geluidsmenu.png'});assert.deepEqual(errors,[]);console.log('PASS five original sounds, original default, preview while muted, playback completion, remembered choices and stop on close');
 }finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
