/* Echte browser smoke test: laadt de daadwerkelijke Praatpad.html via de normale ontwikkelserver en
   controleert dat de kernapp zonder JavaScript-crash opstart en dat de nieuwe Spelen-overlay opent.
   Dit dekt precies het scenario dat de vorige ronde niet werd onderschept: een render die op het scherm
   goed lijkt maar met een niet-afgevangen ReferenceError in de console. */
const{chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
const p=await b.newPage({viewport:{width:1400,height:900}});
const pageErrors=[];const consoleErrors=[];
p.on('pageerror',e=>pageErrors.push(e.message));
p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
await p.goto(`http://127.0.0.1:${server.address().port}/Praatpad.html`,{waitUntil:'load'});
await p.waitForTimeout(300);

// Geen niet-afgevangen fouten, en specifiek geen ReferenceError voor de kernglobals.
assert.deepEqual(pageErrors,[],'geen uncaught JavaScript errors bij opstarten');
assert.deepEqual(consoleErrors,[],'geen console errors bij opstarten');
assert(!pageErrors.concat(consoleErrors).some(m=>/ReferenceError/.test(m)),'geen ReferenceError');

// DigiBoard-kern is echt geïnitialiseerd (geen dummy/placeholder-object).
const core=await p.evaluate(()=>({
 digiBoard:typeof globalThis.DigiBoard,
 digiBoardHasApi:!!(globalThis.DigiBoard&&globalThis.DigiBoard.connect&&globalThis.DigiBoard.saveShared),
 routeLessons:typeof globalThis.DigiBoardRouteLessons,
 routeLessonsHasData:!!(globalThis.DigiBoardRouteLessons&&Array.isArray(globalThis.DigiBoardRouteLessons.routes)),
}));
assert.equal(core.digiBoard,'object','DigiBoard moet een echt object zijn, geen undefined');
assert(core.digiBoardHasApi,'DigiBoard moet zijn echte API (connect/saveShared) hebben, geen lege placeholder');
assert.equal(core.routeLessons,'object','DigiBoardRouteLessons moet een echt object zijn, geen undefined');
assert(core.routeLessonsHasData,'DigiBoardRouteLessons moet echte routedata bevatten');

// De bestaande hoofdinterface verschijnt (geen leeg hoofdvlak door een JS-crash).
assert(await p.locator('#praatpad-board').isVisible());
assert(await p.locator('#pp-map').isVisible());
assert((await p.locator('#pp-game').boundingBox()).height>100,'hoofdvlak mag niet leeg/ingeklapt zijn');
assert(await p.locator('#pp-roll').isVisible(),'dobbelsteenbediening moet zichtbaar zijn');

// Het Taalroute-logo/de header is zichtbaar. De KANDIDAAT-appmenu (Lessen/appmenu.js) verbergt het
// oorspronkelijke rasterlogo bewust en toont in plaats daarvan het SVG-woordmerk in de trigger-knop
// (het originele beeld blijft alleen als bron voor de afdrukweergave); beide gelden hier als geldig.
assert(await p.locator('.pp-brand').isVisible(),'header met merk moet zichtbaar zijn');
const logoVisible=await p.locator('#pp-logo').isVisible()||await p.locator('.pp-brand .tr-logo').first().isVisible();
assert(logoVisible,'Taalroute-logo (rasterbeeld of SVG-woordmerk) moet zichtbaar zijn');
assert(['DigiBoard','Digibord'].includes(await p.locator('.pp-brand strong').first().textContent()));

// De nieuwe Spelen-interface kan worden geopend, boven op de draaiende kernapp.
assert(await p.locator('#sp-open-trigger').isVisible());
await p.locator('#sp-open-trigger').click();
await p.waitForSelector('#sp-overlay:not([hidden])');
assert(await p.locator('#sp-overlay .sp-tile').count()>=4);
assert.deepEqual(pageErrors,[],'geen uncaught JavaScript errors na openen van Spelen');
await p.locator('#sp-overlay .sp-close').click();
assert(await p.locator('#sp-overlay').isHidden());

// Ook een directe file://-opening van dezelfde pagina mag niet crashen (README-ontwikkelroute).
const filePage=await b.newPage();
const fileErrors=[];filePage.on('pageerror',e=>fileErrors.push(e.message));
filePage.on('console',m=>{if(m.type()==='error')fileErrors.push(m.text());});
await filePage.goto('file://'+require('node:path').resolve(__dirname,'..','Praatpad.html'),{waitUntil:'load'});
await filePage.waitForTimeout(300);
assert.deepEqual(fileErrors,[],'geen JavaScript errors bij direct openen van Praatpad.html (file://)');
assert.equal(await filePage.evaluate(()=>typeof globalThis.DigiBoard),'object');
assert.equal(await filePage.evaluate(()=>typeof globalThis.DigiBoardRouteLessons),'object');
await filePage.close();

console.log('PASS app-boot-smoke: server- en file://-opening zonder uncaught errors, echte DigiBoard/DigiBoardRouteLessons-init, zichtbare hoofdinterface en logo, Spelen-overlay opent en sluit');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
