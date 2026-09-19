const{chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
const p=await b.newPage({reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/Praatpad.html`);
await p.waitForSelector('#sp-open-trigger');
await p.locator('#sp-open-trigger').click();
await p.waitForSelector('#sp-overlay:not([hidden])');

// Startpagina: vier of meer modulekaarten, uitleg-, hervat- en voortgangsrij op dezelfde grid.
const tileCount=await p.locator('#sp-overlay .sp-tile').count();
assert(tileCount>=4,`verwacht >=4 modulekaarten, kreeg ${tileCount}`);

// De vier basismodulekaarten zijn exact gelijk in hoogte en breedte (Prompt 1B §4).
const firstFourBoxes=await p.locator('#sp-overlay .sp-tile').evaluateAll(nodes=>nodes.slice(0,4).map(n=>{const r=n.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height)};}));
for(const box of firstFourBoxes.slice(1))assert.deepEqual(box,firstFourBoxes[0],'de vier starttegels moeten identieke afmetingen hebben');

// Grid blijft bruikbaar bij vijf, zes en zeven modules (geen logica die exact vier veronderstelt).
for(const extra of [1,1,1]){
 await p.evaluate(()=>{globalThis.TaalrouteSpelen.instance.addModule({id:'x-'+Math.random(),label:'Extra',desc:'Fixture',art:'<svg></svg>'});});
}
const grownCount=await p.locator('#sp-overlay .sp-tile').count();
assert.equal(grownCount,tileCount+3,'modulegrid moet meegroeien met extra modules');
const gridDisplay=await p.locator('#sp-overlay .sp-grid').evaluate(e=>getComputedStyle(e).display);
assert.equal(gridDisplay,'grid');

// Niveaukeuze ondersteunt alle acht labels.
const levelOptions=await p.locator('#sp-overlay .sp-level-select option').allTextContents();
assert.deepEqual(levelOptions,['A0','A1','A1+','A2','B1','B2','C1','C2']);

// GamePageShell toont Uitleg consequent, op Taalworp, Bouw een zin en Verhaalworp.
for(const [id,expectName] of [['taalworp','Taalworp'],['dobbelspellen','Taalworp'],['woorden-en-zinnen','Bouw een zin']]){
 await p.locator('#sp-overlay').evaluate((node,targetId)=>{globalThis.TaalrouteSpelen.instance.go(targetId);},id);
 await p.waitForSelector('#sp-overlay .sp-game-titles h2');
 assert.equal(await p.locator('#sp-overlay .sp-game-titles h2').textContent(),expectName);
 assert.equal(await p.locator('#sp-overlay .sp-explain-button').count(),1);
}

// Taalworp: zes dobbelsteensoorten, geen stippen (Prompt 1B §6). GameActionBar toont Voorbeeld/Extra uitdaging
// altijd (Prompt 1B §8), met een expliciete ontwikkelplaceholder zolang er geen fixtureinhoud is (§13/§14).
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('taalworp'));
await p.waitForSelector('#sp-overlay .sp-dice-row');
assert.equal(await p.locator('#sp-overlay .sp-dice').count(),6);
assert.equal(await p.locator('#sp-overlay .sp-dice-face circle').count(),0,'taaldobbelstenen mogen geen stippen tonen');
assert.equal(await p.locator('#sp-overlay .sp-btn-primary').textContent(),'Gooien');
assert.equal(await p.locator('#sp-overlay .sp-action-bar >> text=Voorbeeld').count(),1);
assert.equal(await p.locator('#sp-overlay .sp-action-bar >> text=Extra uitdaging').count(),1);
await p.locator('#sp-overlay .sp-action-bar >> text=Voorbeeld').click();
assert.equal(await p.locator('#sp-overlay .sp-content-panel').first().textContent(),'Voorbeeld nog niet gevuld.');
await p.locator('#sp-overlay .sp-action-bar >> text=Extra uitdaging').click();
assert(await p.locator('#sp-overlay .sp-content-panel', {hasText:'Extra uitdaging nog niet gevuld.'}).count()>0);
// De Wisselen-contextactie heeft nog geen echte functie: klikken opent een expliciete ontwikkelplaceholder, geen verzonnen gedrag.
await p.locator('#sp-overlay .sp-action-bar >> text=Wisselen').click();
assert(await p.locator('#sp-overlay .sp-content-panel', {hasText:'Wisselen: nog niet gebouwd.'}).count()>0);

// Werkwoordstapels (nu de generieke Taalworp-setkiezer, SET 01): Basis/Werk/Reizen/Meer sets tegels
// renderen; actieve rand op de standaard-actieve set (Prompt 1B §7). Gedetailleerd setgedrag
// (single/combine-modus, resolver, sessieherstel) staat in tests/taalworp-sets.cjs.
const deckButtons=p.locator('#sp-overlay .sp-deck-row .sp-deck:not(.sp-deck-more)');
assert.equal(await deckButtons.count(),3,'snelle toegang toont Basis/Werk/Reizen als losse stapeltegels');
assert.equal(await p.locator('#sp-overlay .sp-deck-row .sp-deck-more').count(),1,'Meer sets staat als vierde tegel in de snelle toegang');
assert.equal(await deckButtons.nth(0).getAttribute('data-active'),'true','Basis is standaard actief');
const uniqueCheck=await p.evaluate(()=>{
 const T=globalThis.TaalrouteSpelen.instance.__internal;
 const pools=[[{id:'a'},{id:'b'}],[{id:'a'},{id:'c'}]];
 return T.combineUniquePools(pools).length===3;
});
assert(uniqueCheck,'dubbele records na poolcombinatie moeten uniek blijven');

// Meer sets kan extra selecties tonen.
await p.locator('#sp-overlay .sp-deck-more').click();
assert(await p.locator('#sp-overlay .sp-content-panel .sp-deck-row').count()>0);

// Bouw een zin: wisselen Klassikaal/Live toont/verbergt het Live-paneel; Resultaten zit nu ín dat paneel (Prompt 1B §10).
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('woorden-en-zinnen'));
await p.waitForSelector('#sp-overlay .sp-mode-switch');
assert.equal(await p.locator('#sp-overlay .sp-live-panel').isVisible(),false);
await p.locator('#sp-overlay .sp-mode-switch button:has-text("Live")').click();
assert(await p.locator('#sp-overlay .sp-live-panel').isVisible());
assert.equal(await p.locator('#sp-overlay .sp-live-panel .sp-btn', {hasText:'Resultaten'}).count(),1,'Resultaten-knop moet onderdeel van het Live-paneel zijn');
// Ontbrekende content veroorzaakt geen door Claude gegenereerde onderwijszin: woordtegels zijn de aangeleverde fixture, geen extra verzonnen tekst.
const words=await p.locator('#sp-overlay .sp-word-row .sp-word-tile').allTextContents();
assert.deepEqual(words.slice(0,6),['Morgen','gaan','wij','naar','de','markt']);
// Beschikbare woorden en de gelegde zin zijn los van elkaar te onderscheiden: plaatsen maakt de bronknop inactief
// én zet het losstaande woord in de zinzone (geen kapotte data-src-koppeling zoals in Prompt 1).
await p.locator('#sp-overlay .sp-word-row .sp-word-tile-source').first().click();
assert.equal(await p.locator('#sp-overlay .sp-word-row .sp-word-tile-source').first().getAttribute('data-placed'),'true');
assert.equal(await p.locator('#sp-overlay .sp-sentence-zone .sp-word-tile-placed').count(),1);
await p.locator('#sp-overlay .sp-sentence-zone .sp-word-tile-placed').first().click();
assert.equal(await p.locator('#sp-overlay .sp-word-row .sp-word-tile-source').first().getAttribute('data-placed'),'false');
assert.equal(await p.locator('#sp-overlay .sp-sentence-zone .sp-word-tile-placed').count(),0,'geplaatst woord moet na terugklikken echt uit de zinzone verdwijnen');
// Bespreek samen: nog geen echte functie, dus expliciete ontwikkelplaceholder, geen verzonnen gespreksinhoud.
await p.locator('#sp-overlay .sp-action-bar >> text=Bespreek samen').click();
assert(await p.locator('#sp-overlay .sp-content-panel', {hasText:'Bespreek samen: nog niet gebouwd.'}).count()>0);

// Verhaalworp: gebruikt echte beelddobbelstenen (Basis-set actief per default), geen stippen, aantal begrensd op 3-9.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('verhaalworp'));
await p.waitForSelector('#sp-overlay .sp-story-dice-row');
assert.equal(await p.locator('#sp-overlay .sp-story-die').count(),6);
assert.equal(await p.locator('#sp-overlay .sp-story-die circle').count(),0,'beelddobbelstenen mogen geen stippen tonen');
assert(await p.locator('#sp-overlay .sp-story-die svg path').count()>0,'beelddobbelstenen moeten een echt beeld tonen');
for(let i=0;i<8;i++)await p.locator('#sp-overlay .sp-stepper button').nth(1).click();
assert.equal(await p.locator('#sp-overlay .sp-story-die').count(),9,'mag niet boven 9 dobbelstenen komen');
for(let i=0;i<12;i++)await p.locator('#sp-overlay .sp-stepper button').first().click();
assert.equal(await p.locator('#sp-overlay .sp-story-die').count(),3,'mag niet onder 3 dobbelstenen komen');
await p.locator('#sp-overlay .sp-story-die-lock').first().click();
assert.equal(await p.locator('#sp-overlay .sp-story-die').first().getAttribute('data-locked'),'true');

assert.deepEqual(errors,[]);
console.log('PASS spelen-hub: modulegrid+gelijke tegels, niveaus, GamePageShell/Uitleg, GameActionBar met altijd-zichtbare Voorbeeld/Extra uitdaging, werkwoordstapels, Meer stapels, Bouw een zin/Resultaten-in-Live-paneel, Verhaalworp-beeldstenen/grenzen');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
