const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.SCREENSHOT_DIR;
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LIVE_URL||'file://'+path.join(root,process.env.BUILD_SMOKE?'dist/index.html':'index.html'));
 await page.locator('[data-category="dice"]').click();await page.locator('.tile[data-dicegame="taalworp"]').click();
 await page.evaluate(()=>selectLevel('B2'));
 assert.equal(await page.locator('.sentence-choice').count(),6);
 assert.equal(await page.locator('.langlabel').first().innerText(),'Wie/wat');
 await page.locator('[data-die="CONNECT_2"]').click();
 assert.equal(await page.locator('[data-die="CONNECT_1"]').getAttribute('aria-pressed'),'false');
 await page.locator('#twBothLinks').check();await page.locator('[data-die="CONNECT_1"]').click();
 assert.equal(await page.locator('[data-die="CONNECT_2"]').getAttribute('aria-pressed'),'true');
 await page.locator('#twBothLinks').uncheck();
 assert.equal(await page.locator('[data-die="CONNECT_2"]').getAttribute('aria-pressed'),'false');
 const examples=await page.evaluate(()=>{
  APP.currentVerb='VRB_WERKEN';const verb=tw.manifest.verbs.VRB_WERKEN,who=languageChoices('WHO',verb).find(v=>v.label==='de machine');
  const present={code:'present'},past={code:'past'},perfect={code:'perfect'};
  const examples=[present,past,perfect].map(TENSE=>taalworpExample(verb,{WHO:who,TENSE}));
  twDiceState.WHO={active:true,locked:true,value:who};APP.taalworpSets=['SET_A2_BASIS'];
  for(let i=0;i<40;i++){drawVerb();if(!TaalworpChoices.subjectFits(who,tw.manifest.verbs[APP.currentVerb]))throw Error('subject mismatch')}
  APP.currentVerb='VRB_WERKEN';APP.verbLocked=true;
  for(const id of TW_DICE_IDS){twDiceState[id].active=true;twDiceState[id].locked=false;const vals=languageChoices(id);twDiceState[id].value=vals.at(-1)}
  twDiceState.WHO={active:true,locked:true,value:who};APP.taalworpBothLinks=true;APP.taalworpDice=twDiceState;renderLanguageDice();renderVerbCard();save();
  return examples;
 });
 assert.deepEqual(examples,['De machine werkt weer goed.','De machine werkte weer goed.','De machine heeft weer goed gewerkt.']);
 const saved=await page.evaluate(()=>{delete APP.taalworpBothLinks;save();return JSON.stringify(twDiceState)});await page.reload();await page.locator('#resumeBtn').click();
 assert.equal(await page.evaluate(()=>JSON.stringify(twDiceState)),saved);assert.equal(await page.evaluate(()=>APP.taalworpBothLinks),true);
 await page.locator('#primaryGame').click();assert.equal(await page.evaluate(()=>twDiceState.WHO.value.label),'de machine');
 // A locked nonhuman subject survives an incompatible set: no nonsense replacement card.
 await page.evaluate(()=>startTaalworp(['SET_A2_WEDERKEREND']));assert.equal(await page.evaluate(()=>APP.currentVerb),'VRB_WERKEN');
 await page.locator('#verbLock').click();assert.equal(await page.locator('#drawVerb').isDisabled(),true);await page.locator('#verbLock').click();
 await page.locator('#twExample').click();assert.match(await page.locator('#gameDialog').innerText(),/machine/);await page.keyboard.press('Escape');
 // All six longest current choices, including both connections, remain visible on a board.
 await page.evaluate(()=>{for(const id of TW_DICE_IDS){const vals=languageChoices(id);if(vals.length){twDiceState[id].value=vals.reduce((a,b)=>languageDieLabel(id,a).length>languageDieLabel(id,b).length?a:b);twDiceState[id].active=true}}renderLanguageDice();renderVerbCard()});
 for(const [width,height] of [[1920,1080],[1440,900],[1366,768]]){
  await page.setViewportSize({width,height});
  const clipped=await page.evaluate(()=>{const original=APP.currentVerb,failures=[];APP.verbLocked=true;for(const verb of Object.values(tw.manifest.verbs)){APP.currentVerb=verb.id;renderVerbCard();const el=document.querySelector('.verb-assignment');if(el.scrollHeight>el.clientHeight+1)failures.push({id:verb.id,lemma:verb.lemma,scroll:el.scrollHeight,height:el.clientHeight})}APP.currentVerb=original;renderVerbCard();return failures});
  assert.deepEqual(clipped,[],'long verb cards '+width);
 }
 if(out)fs.mkdirSync(out,{recursive:true});
 for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1024,768],[390,844],[320,568]]){
  await page.setViewportSize({width,height});
  const box=await page.locator('.verb-assignment').evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight,overflow:document.documentElement.scrollWidth>innerWidth,visible:[...el.querySelectorAll('.sentence-choice')].every(x=>{const a=x.getBoundingClientRect(),b=el.getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom})}));
  assert.ok(!box.overflow,'page overflow '+width);
  if(width>=1366){assert.ok(box.scroll<=box.client+1,'card scroll '+width+' '+JSON.stringify(box));assert.ok(box.visible,'six choices '+width)}
  if(out)await page.screenshot({path:path.join(out,'zinnen-'+width+'.png')});
 }
 await page.evaluate(()=>selectLevel('A1'));assert.equal(await page.locator('[data-die="CONNECT_2"]').isDisabled(),true);
 await page.locator('#primaryGame').click();assert.equal(await page.locator('[data-die="CONNECT_2"]').isDisabled(),true);
 // Imperative is an alternative; a locked imperative blocks conflicting active dice.
 await page.evaluate(()=>{selectLevel('B2');for(const id of ['WHO','TENSE','CONNECT_1','CONNECT_2'])twDiceState[id].active=false;twDiceState.SENTENCE_TYPE={active:true,locked:true,value:languageChoices('SENTENCE_TYPE').find(v=>v.recipe==='imperative')};renderLanguageDice();renderVerbCard()});
 await page.locator('[data-die="WHO"]').click();assert.equal(await page.locator('[data-die="WHO"]').getAttribute('aria-pressed'),'false');
 assert.deepEqual(errors,[]);console.log('PASS: six choices, connector switching/opt-in, compatible subjects, examples, saved dice, locked cards, levels, imperative and board/mobile layout.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
