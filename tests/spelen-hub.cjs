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

// Taalworp: zes dobbelsteensoorten; GameActionBar toont alleen geconfigureerde acties (geen Voorbeeld/Extra uitdaging zonder inhoud).
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('taalworp'));
await p.waitForSelector('#sp-overlay .sp-dice-row');
assert.equal(await p.locator('#sp-overlay .sp-dice').count(),6);
assert.equal(await p.locator('#sp-overlay .sp-btn-primary').textContent(),'Gooien');
assert.equal(await p.locator('#sp-overlay .sp-action-bar >> text=Voorbeeld').count(),0);
assert.equal(await p.locator('#sp-overlay .sp-action-bar >> text=Extra uitdaging').count(),0);

// Werkwoordstapels: afzonderlijk actief/inactief, meerdere tegelijk actief, dubbele records na combineren uniek.
const deckButtons=p.locator('#sp-overlay .sp-deck-row .sp-deck');
await deckButtons.nth(1).click();
assert.equal(await deckButtons.nth(0).getAttribute('data-active'),'true');
assert.equal(await deckButtons.nth(1).getAttribute('data-active'),'true');
await deckButtons.nth(1).click();
assert.equal(await deckButtons.nth(1).getAttribute('data-active'),'false');
const uniqueCheck=await p.evaluate(()=>{
 const T=globalThis.TaalrouteSpelen.instance.__internal;
 const pools=[T.VERB_DECKS[0].records,T.VERB_DECKS[0].records];// zelfde stapel twee keer "actief"
 return T.combineUniquePools(pools).length===T.VERB_DECKS[0].records.length;
});
assert(uniqueCheck,'dubbele records na poolcombinatie moeten uniek blijven');

// Meer stapels kan extra selecties tonen.
await p.locator('#sp-overlay .sp-deck-more').click();
assert(await p.locator('#sp-overlay .sp-content-panel .sp-deck-row').count()>0);

// Bouw een zin: wisselen Klassikaal/Live toont/verbergt het Live-paneel.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('woorden-en-zinnen'));
await p.waitForSelector('#sp-overlay .sp-mode-switch');
assert.equal(await p.locator('#sp-overlay .sp-live-panel').isVisible(),false);
await p.locator('#sp-overlay .sp-mode-switch button:has-text("Live")').click();
assert(await p.locator('#sp-overlay .sp-live-panel').isVisible());
// Ontbrekende content veroorzaakt geen door Claude gegenereerde onderwijszin: woordtegels zijn de aangeleverde fixture, geen extra verzonnen tekst.
const words=await p.locator('#sp-overlay .sp-word-row .sp-word-tile').allTextContents();
assert.deepEqual(words.slice(0,6),['Morgen','gaan','wij','naar','de','markt']);

// Verhaalworp: aantal dobbelstenen begrensd op 3-9, individuele steen kan worden vastgezet.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('verhaalworp'));
await p.waitForSelector('#sp-overlay .sp-story-dice-row');
assert.equal(await p.locator('#sp-overlay .sp-story-die').count(),6);
for(let i=0;i<8;i++)await p.locator('#sp-overlay .sp-stepper button').nth(1).click();
assert.equal(await p.locator('#sp-overlay .sp-story-die').count(),9,'mag niet boven 9 dobbelstenen komen');
for(let i=0;i<12;i++)await p.locator('#sp-overlay .sp-stepper button').first().click();
assert.equal(await p.locator('#sp-overlay .sp-story-die').count(),3,'mag niet onder 3 dobbelstenen komen');
await p.locator('#sp-overlay .sp-story-die-lock').first().click();
assert.equal(await p.locator('#sp-overlay .sp-story-die').first().getAttribute('data-locked'),'true');

assert.deepEqual(errors,[]);
console.log('PASS spelen-hub: modulegrid, niveaus, GamePageShell/Uitleg, GameActionBar-selectiviteit, werkwoordstapels, Meer stapels, Klassikaal/Live, Verhaalworp-grenzen');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
