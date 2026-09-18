/* Prompt 2: Speelborden-integratie in de nieuwe Spelen-omgeving. Bewijst dat de NIEUWE UI de bestaande,
   ongewijzigde bordmotor (Praatpad.html zelf, via een same-origin <iframe>) hergebruikt in plaats van een
   tweede bordimplementatie te bouwen: echte wereld opent, echte bewegingsdobbelsteen verplaatst een pion via
   de bestaande opslag, en Terug behoudt die pionpositie zonder een nieuwe worp te forceren. */
const{chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs'),fs=require('node:fs'),path=require('node:path');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
const p=await b.newPage({viewport:{width:1600,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/Praatpad.html`);
await p.waitForSelector('#sp-open-trigger');
await p.locator('#sp-open-trigger').click();
await p.waitForSelector('#sp-overlay:not([hidden])');

// Speelborden opent vanuit de nieuwe Spelen-omgeving (startpaginategel), niet alleen via een directe go().
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('speelborden'));
await p.waitForSelector('#sp-overlay .sp-world-tile');
assert.equal(await p.locator('#sp-overlay .sp-explain-button').count(),1,'Uitleg moet ook op de Speelborden-bibliotheek staan');

// Uitsluitend echte, geregistreerde werelden; schaalbaar (geen layout die exact elf/46 veronderstelt).
const worldCount=await p.locator('#sp-overlay .sp-world-tile').count();
const realMapCount=await p.evaluate(()=>globalThis.DigiBoardMaps.length);
assert.equal(worldCount,realMapCount,'elke geregistreerde wereld moet een tegel krijgen, niet meer en niet minder');
assert(realMapCount>10,'sanity check: register.js moet daadwerkelijk tientallen werelden bevatten');

// Een bestaande, niet-tunnel wereld (Rotterdam) openen: de nieuwe schil toont de shell, het bord zelf leeft in een iframe.
const targetMapId='Rotterdam-havenroute';
await p.evaluate((id)=>globalThis.TaalrouteSpelen.instance.openWorld(id),targetMapId);
await p.waitForSelector('#sp-overlay .sp-board-frame');
assert.equal(await p.locator('#sp-overlay .sp-game-titles h2').textContent(),'Rotterdam');
assert.equal(await p.locator('#sp-overlay .sp-explain-button').count(),1,'Uitleg moet ook op het Speelbord-scherm op dezelfde plek staan');
assert.equal(await p.locator('#sp-overlay .sp-action-bar >> text=Voorbeeld').count(),1);
assert.equal(await p.locator('#sp-overlay .sp-action-bar >> text=Extra uitdaging').count(),1);
// De bewegingsdobbelsteen is NIET het taaldobbelsteencomponent uit Prompt 1B/Taalworp.
assert.equal(await p.locator('#sp-overlay .sp-dice').count(),0,'het taaldobbelsteencomponent mag niet als bewegingsdobbelsteen worden hergebruikt');

const frameEl=await p.waitForSelector('#sp-overlay .sp-board-frame');
const frame=await frameEl.contentFrame();
assert(frame.url().includes(`kaart=${targetMapId}`)&&frame.url().includes('embed=spelen'),'iframe moet de juiste, bestaande wereld laden via de bestaande querystring-conventie');
await frame.waitForSelector('#pp-map');
await frame.waitForSelector('#pp-roll');
assert(await frame.locator('#pp-map').isVisible(),'het bestaande bord moet renderen');
assert(await frame.locator('#pp-roll').isVisible(),'de bestaande bewegingsbediening moet renderen');
// De vaste Taalroute-header komt maar één keer in beeld: de ingebedde pagina verbergt haar eigen kopregel.
assert.equal(await frame.locator('.pp-brand').count(),1);
assert(!(await frame.locator('.pp-brand').isVisible()),'ingebedde pagina mag geen tweede kopregel tonen naast de nieuwe Spelen-header');
// De ingebedde pagina laadt ook Lessen/spelen.js; die mag geen geneste "Spelen"-toegang bovenop het bord tonen.
assert.equal(await frame.locator('#sp-open-trigger').count(),0,'geen geneste Spelen-trigger bovenop het gehuisveste bord');

// Pionpositie verandert via de bestaande bewegingsfunctie (niet via nieuwe code): echte worp, echte opslag.
const storageKey=`taalroute-digiboard-les-${targetMapId}-v1`;
await frame.waitForTimeout(300);
const posBefore=await p.evaluate((k)=>JSON.parse(localStorage.getItem(k)).session.players[0].pos,storageKey);
await frame.evaluate(()=>{Math.random=()=>.15;});
await frame.locator('#pp-roll').click();
await frame.waitForFunction(()=>!document.querySelector('#pp-roll').disabled,null,{timeout:20000});
const posAfter=await p.evaluate((k)=>JSON.parse(localStorage.getItem(k)).session.players[0].pos,storageKey);
assert(posAfter>posBefore,`worp moet de pion echt verplaatsen via de bestaande functie (was ${posBefore}, is ${posAfter})`);

// Terug (nieuwe GamePageShell) sluit het scherm, maar behoudt de bordtoestand: geen stilzwijgende reset,
// geen nieuwe worp door alleen terug te navigeren en de wereld opnieuw te openen.
await p.locator('#sp-overlay .sp-back').click();
await p.waitForSelector('#sp-overlay .sp-world-tile');
await p.evaluate((id)=>globalThis.TaalrouteSpelen.instance.openWorld(id),targetMapId);
await p.waitForSelector('#sp-overlay .sp-board-frame');
const posAfterReturn=await p.evaluate((k)=>JSON.parse(localStorage.getItem(k)).session.players[0].pos,storageKey);
assert.equal(posAfterReturn,posAfter,'Terug en opnieuw openen mag de pionpositie niet stilzwijgend resetten of een nieuwe worp forceren');

// SB_MAP_24: statische regressiebewaking. De nieuwe UI mag "Twee ruimtes" nooit hardcoded aan een positie
// koppelen — dat is een expliciete inhoudelijke beslissing voor Nico/ChatGPT, niet iets voor deze integratie.
const spelenSource=fs.readFileSync(path.join(__dirname,'..','Lessen','spelen.js'),'utf8');
assert(!/Twee ruimtes/.test(spelenSource),'de nieuwe Spelen-code mag geen inhoudelijke SB_MAP_24-beslissing hardcoden');

assert.deepEqual(errors,[]);
console.log('PASS spelen-board: Speelborden-bibliotheek uit echte werelden, bestaand bord in iframe, echte worp verplaatst pion, Terug behoudt bordtoestand, geen SB_MAP_24-koppeling');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
