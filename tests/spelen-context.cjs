/* Prompt 3: centrale applicatiecontext, module-/activiteitregistratie en gedeelde contracten.
   Puur technische infrastructuur; alle content-achtige waarden hier zijn expliciet gemarkeerde fixtures. */
const{chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/Praatpad.html`);
await p.waitForSelector('#sp-open-trigger');

// ModuleRegistry bevat de vier huidige modules; extra modules werken zonder wijziging aan de renderer.
const moduleIds=await p.evaluate(()=>globalThis.TaalrouteModuleRegistry.list().map(m=>m.id));
assert.deepEqual(moduleIds,['speelborden','dobbelspellen','kaartspellen','woorden-en-zinnen']);
await p.evaluate(()=>{
 globalThis.TaalrouteModuleRegistry.register({id:'fixture-5',label:'Fixture 5'});
 globalThis.TaalrouteModuleRegistry.register({id:'fixture-6',label:'Fixture 6'});
 globalThis.TaalrouteModuleRegistry.register({id:'fixture-7',label:'Fixture 7'});
});
assert.equal(await p.evaluate(()=>globalThis.TaalrouteModuleRegistry.list().length),7);
await p.locator('#sp-open-trigger').click();
await p.waitForSelector('#sp-overlay:not([hidden])');
assert.equal(await p.locator('#sp-overlay .sp-tile').count(),7,'startpagina moet alle 7 geregistreerde modules tonen zonder codewijziging aan de renderer');

// Globaal niveau: een wijziging via de centrale context is overal beschikbaar, inclusief de zichtbare selector.
await p.evaluate(()=>globalThis.TaalrouteSpelenContext.setLevel('B1'));
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelenContext.getState().level),'B1');
assert.equal(await p.locator('#sp-overlay .sp-level-select').inputValue(),'B1','de zichtbare niveauselector moet de centrale context volgen');

// Actieve sessie behoudt levelAtStart: een latere globale niveauwijziging converteert een lopende sessie niet stilzwijgend.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('taalworp'));
await p.waitForSelector('#sp-overlay .sp-dice-row');
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.currentSession.levelAtStart),'B1');
await p.evaluate(()=>globalThis.TaalrouteSpelenContext.setLevel('C1'));
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelenContext.getState().level),'C1');
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.currentSession.levelAtStart),'B1','een globale niveauwijziging mag een lopende sessie niet stilzwijgend converteren');

// LessonContext: thema/les/pagina kunnen gezet worden; sector staat er los van en is apart te wissen.
await p.evaluate(()=>globalThis.TaalrouteSpelenContext.setLessonContext({themeId:'fixture-thema',lessonId:'fixture-les-4',pageNumber:25}));
const lessonCtx=await p.evaluate(()=>globalThis.TaalrouteSpelenContext.getState().lessonContext);
assert.equal(lessonCtx.themeId,'fixture-thema');
assert.equal(lessonCtx.lessonId,'fixture-les-4');
assert.equal(lessonCtx.pageNumber,25);
await p.evaluate(()=>globalThis.TaalrouteSpelenContext.setSectorId('fixture-sector-zorg'));
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelenContext.getState().sectorId),'fixture-sector-zorg');
await p.evaluate(()=>globalThis.TaalrouteSpelenContext.clearSectorId());
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelenContext.getState().sectorId),null,'sector moet apart te wissen zijn');
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelenContext.getState().lessonContext.themeId),'fixture-thema','wissen van sector mag thema/les/pagina niet raken');

// ActivityRegistry: accepteert capabilities; een activiteit kan classroom+live ondersteunen; zonder
// live-capability toont participationModesFor geen Live-mogelijkheid.
const bouwCaps=await p.evaluate(()=>globalThis.TaalrouteActivityRegistry.get('bouw-een-zin').capabilities);
assert(bouwCaps.includes('live')&&bouwCaps.includes('classroom'));
assert.deepEqual(await p.evaluate(()=>globalThis.TaalrouteActivityRegistry.participationModesFor('bouw-een-zin')),['classroom','live']);
assert.deepEqual(await p.evaluate(()=>globalThis.TaalrouteActivityRegistry.participationModesFor('taalworp')),['classroom'],'taalworp heeft geen live-capability en mag geen Live-mogelijkheid tonen');

// Dat vertaalt zich ook echt naar het zichtbare scherm: Bouw een zin toont Klassikaal+Live via de capability.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('bouw-een-zin'));
await p.waitForSelector('#sp-overlay .sp-mode-switch');
assert.deepEqual(await p.locator('#sp-overlay .sp-mode-switch button').allTextContents(),['Klassikaal','Live']);

// GamePage-contract: acties worden uit configuratie opgebouwd, met generieke identifiers (geen visuele
// positie als functionele identiteit). Getest via de geëxposeerde contractfunctie zelf (__internal).
const gamePageResult=await p.evaluate(()=>{
 const GamePage=globalThis.TaalrouteSpelen.instance.__internal.GamePage;
 const page=GamePage({
  title:'Fixture testpagina', description:'', actions:[
   {id:'example', content:'Fixture voorbeeldinhoud'},
   {id:'primary', label:'Fixture primaire actie', onClick:()=>{}},
   {id:'extraChallenge', content:'Fixture uitdaging'},
   {id:'reset', label:'Fixture reset', icon:'refresh'},
  ], onBack:()=>{},
 });
 return [...page.actionBar.node.querySelectorAll('button')].map((b)=>b.textContent.trim());
});
assert(gamePageResult.some((t)=>t.includes('Voorbeeld')));
assert(gamePageResult.some((t)=>t.includes('Fixture primaire actie')));
assert(gamePageResult.some((t)=>t.includes('Extra uitdaging')));
assert(gamePageResult.some((t)=>t.includes('Fixture reset')));

// BoardAdapter opent een bestaande wereld en behoudt de bestaande opslagwerking (geen eigen kopie).
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.boardAdapter.openWorld('Rotterdam-havenroute'));
const frameEl=await p.waitForSelector('#sp-overlay .sp-board-frame');
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.boardAdapter.getWorldId()),'Rotterdam-havenroute');
const frame=await frameEl.contentFrame();
await frame.waitForSelector('#pp-roll');
await frame.waitForTimeout(300);
const sessionBefore=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.boardAdapter.getSessionState());
assert(sessionBefore&&sessionBefore.session&&Array.isArray(sessionBefore.session.players),'BoardAdapter.getSessionState moet de echte, bestaande opslagstructuur teruggeven');
await frame.evaluate(()=>{Math.random=()=>.1;});
await frame.locator('#pp-roll').click();
await frame.waitForFunction(()=>!document.querySelector('#pp-roll').disabled,null,{timeout:20000});
const sessionAfter=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.boardAdapter.getSessionState());
assert(sessionAfter.session.players[0].pos>sessionBefore.session.players[0].pos,'BoardAdapter moet de echte, bestaande opslag weerspiegelen (geen eigen kopie van de sessie)');
assert.equal(await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.boardAdapter.status),'legacy-iframe-adapter');

// Geen onderwijscontent toegevoegd: elke geregistreerde activiteit heeft uitdrukkelijk geen inhoudsverwijzing.
assert(await p.evaluate(()=>globalThis.TaalrouteActivityRegistry.list().every((a)=>a.contentRef===null)),'ActivityRegistry-registraties mogen in deze ronde geen inhoudsverwijzing bevatten');

assert.deepEqual(errors,[]);
console.log('PASS spelen-context: ModuleRegistry uitbreidbaar, centraal niveau/levelAtStart, lessonContext+sector, ActivityRegistry-capabilities/live, GamePage-configuratie, BoardAdapter op bestaande opslag, geen nieuwe content');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
