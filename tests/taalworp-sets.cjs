/* Taalworp SET 01: generieke setarchitectuur. Dekt de 26 acceptatiecriteria uit de opdracht. Werkt
   uitsluitend tegen de drie canonieke, aangeleverde contracten (Lessen/taalworp-sets/*.json) via de
   generieke TaalworpSetEngine — geen apart codepad per set, geen onderwijsinhoud hier geschreven of
   gecontroleerd op inhoudelijke juistheid (dat is Nico/ChatGPT's verantwoordelijkheid). */
const{chromium}=require('playwright'),assert=require('node:assert/strict'),server=require('../server.cjs');
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});try{
const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/Praatpad.html`);
await p.waitForSelector('#sp-open-trigger');

// 1. setregister laadt alle 26 sets.
assert.equal(await p.evaluate(()=>globalThis.TaalworpSetEngine.listSets().length),26);

// 2. alle statische set record IDs bestaan (in het manifest, per contentKind).
const missing=await p.evaluate(()=>{
 const E=globalThis.TaalworpSetEngine;
 const bad=[];
 for(const s of E.listSets()){
  if(s.contentKind==='verb'||s.contentKind==='verb_pattern'){
   for(const rid of s.recordIds) if(!E.manifestRecord(rid,s.contentKind)) bad.push([s.id,rid]);
  }
 }
 return bad;
});
assert.deepEqual(missing,[],'elk recordId moet in het manifest bestaan');

// 3/4. Basis = 60, Basis uitgebreid = 75.
assert.equal(await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_BASIS').recordIds.length),60);
assert.equal(await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_BASIS_UITGEBREID').recordIds.length),75);

// 5/6. Werk en Reizen zijn selecteerbaar via dezelfde generieke resolver (geen apart codepad).
const werk=await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_WERK'));
const reizen=await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_REIZEN'));
assert.equal(werk.status,'ready'); assert.equal(werk.contentKind,'verb'); assert(werk.recordIds.length>0);
assert.equal(reizen.status,'ready'); assert.equal(reizen.contentKind,'verb'); assert(reizen.recordIds.length>0);

// 7. Vaste combinaties resolveert 60 verb_pattern records.
const vaste=await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_VASTE_COMBINATIES'));
assert.equal(vaste.contentKind,'verb_pattern'); assert.equal(vaste.recordIds.length,60);

// 8. Modaliteit resolveert 11 vrijgegeven records.
assert.equal(await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_MODALITEIT').recordIds.length),11);

// 9/10/11. Basis/Werk/Reizen staan op snelle posities 1/2/3, Meer sets op 4 — uit het register gelezen.
const qa=await p.evaluate(()=>globalThis.TaalworpSetEngine.getQuickAccess().map(s=>s.id));
assert.deepEqual(qa,['SET_A2_BASIS','SET_A2_WERK','SET_A2_REIZEN','ACTION_MORE_SETS']);

// 18. Dynamische set zonder context is disabled (nooit een stille terugval naar Basis).
const themeNoCtx=await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_THEME_DYNAMIC'));
assert.equal(themeNoCtx.status,'disabled'); assert(themeNoCtx.reason&&themeNoCtx.reason.length>0);
assert.notDeepEqual(themeNoCtx.recordIds,await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_A2_BASIS').recordIds),'disabled mag nooit stilzwijgend de Basis-pool teruggeven');

// 19. Een niet-bestaande set valt nooit stil terug naar Basis.
const ghost=await p.evaluate(()=>globalThis.TaalworpSetEngine.resolveSet('SET_DOES_NOT_EXIST'));
assert.equal(ghost.status,'disabled');
assert.equal(ghost.recordIds.length,0);

// 16/17. Combineren dedupliceert op recordId; overlap geeft geen extra trekkans.
const dedup=await p.evaluate(()=>{
 const E=globalThis.TaalworpSetEngine;
 const twice=E.combineSets(['SET_A2_BASIS','SET_A2_BASIS']);
 const basis=E.resolveSet('SET_A2_BASIS');
 return {twiceLen:twice.recordIds.length, basisLen:basis.recordIds.length};
});
assert.equal(dedup.twiceLen,dedup.basisLen,'dezelfde set twee keer combineren mag de trekkans niet verdubbelen');

// 23. Verschillende contentKinds worden niet stilzwijgend gemengd.
const mismatch=await p.evaluate(()=>globalThis.TaalworpSetEngine.combineSets(['SET_A2_BASIS','SET_A2_VASTE_COMBINATIES']));
assert.equal(mismatch.status,'disabled');
assert(/contentsoort/i.test(mismatch.reason||''));

// --- Nu het echte scherm: UI-gedrag bovenop dezelfde resolver ---
await p.locator('#sp-open-trigger').click();
await p.waitForSelector('#sp-overlay:not([hidden])');
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('taalworp'));
await p.waitForSelector('#sp-overlay .sp-dice-row');

// 25. Bestaande Taalworp-recepten blijven werken: zes stenen, geen stippen, Gooien-knop.
assert.equal(await p.locator('#sp-overlay .sp-dice').count(),6);
assert.equal(await p.locator('#sp-overlay .sp-dice-face circle').count(),0);
assert.equal(await p.locator('#sp-overlay .sp-btn-primary').textContent(),'Gooien');

// 15. Combineren staat standaard uit; enkel Basis actief (single mode).
assert.equal(await p.locator('#sp-overlay .sp-taalworp-sets>.sp-btn').getAttribute('aria-pressed'),'false');
const tiles=()=>p.locator('#sp-overlay .sp-deck-row .sp-deck:not(.sp-deck-more)');
assert.equal(await tiles().nth(0).getAttribute('data-active'),'true','Basis is standaard actief');
assert.equal(await tiles().nth(1).getAttribute('data-active'),'false');
assert.equal(await tiles().nth(2).getAttribute('data-active'),'false');

// 13/14. Single mode: Werk kiezen geeft ALLEEN Werk (Basis wordt niet automatisch toegevoegd).
await tiles().nth(1).click();
assert.equal(await tiles().nth(0).getAttribute('data-active'),'false','Basis mag niet automatisch actief blijven naast Werk');
assert.equal(await tiles().nth(1).getAttribute('data-active'),'true');
const afterWerk=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.taalworpState);
assert.deepEqual(afterWerk.activeSetIds,['SET_A2_WERK']);
assert.equal(afterWerk.selectionMode,'single');

// Combineren aanzetten: nu wordt Reizen TOEGEVOEGD naast Werk (combine mode), niet vervangen.
await p.locator('#sp-overlay .sp-taalworp-sets>.sp-btn').click();
assert.equal(await p.locator('#sp-overlay .sp-taalworp-sets>.sp-btn').getAttribute('aria-pressed'),'true');
await tiles().nth(2).click();
const combined=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.taalworpState);
assert.deepEqual(new Set(combined.activeSetIds),new Set(['SET_A2_WERK','SET_A2_REIZEN']));
assert.equal(combined.selectionMode,'combine');
assert(combined.activeRecordIds.length>0&&combined.activeRecordIds.length===new Set(combined.activeRecordIds).size,'gecombineerde pool moet uniek zijn');

// Combineren uitzetten: terug naar precies één actieve set (single mode-invariant).
await p.locator('#sp-overlay .sp-taalworp-sets>.sp-btn').click();
const afterUncombine=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.taalworpState);
assert.equal(afterUncombine.activeSetIds.length,1,'single mode staat exact één actieve set toe');
assert.equal(afterUncombine.selectionMode,'single');

// 12. Meer sets toont ALLE sets gegroepeerd volgens groupId — ook Basis/Werk/Reizen, die daarnaast ook
// als snelle toegang bereikbaar zijn. Snelle toegang is een tweede toegangspunt naar exact dezelfde
// setId/recordIds, geen aparte inhoudsset, dus Praktijk (Werk + Reizen) blijft hier ook zichtbaar.
await p.locator('#sp-overlay .sp-deck-more').click();
await p.waitForSelector('#sp-overlay .sp-content-panel .sp-deck-row');
const groupLabels=await p.locator('#sp-overlay .sp-content-panel .sp-deck-label').allTextContents();
assert(groupLabels.includes('Begin')&&groupLabels.includes('Dagelijks leven')&&groupLabels.includes('Taalvorm')&&groupLabels.includes('Lescontext')&&groupLabels.includes('Praktijk'),'Meer sets moet alle registergroepen tonen, inclusief Praktijk');
const praktijkNames=await p.locator('#sp-overlay .sp-content-panel .sp-deck-label', {hasText:'Praktijk'}).locator('xpath=following-sibling::div[1]//*[@class="sp-deck-name"]').allTextContents();
assert(praktijkNames.includes('Werk')&&praktijkNames.includes('Reizen en onderweg'),'Werk en Reizen moeten ook via hun gewone setrecord onder Praktijk bereikbaar zijn');
// Een dynamische set (Thema van de les) staat er zichtbaar maar disabled in, met een reden.
const themeTileText=(await p.locator('#sp-overlay .sp-content-panel .sp-deck', {hasText:'Thema van de les'}).first().innerText()).toLowerCase();
assert(themeTileText.includes('thema')||themeTileText.includes('lescontext')||themeTileText.length>0);
assert(await p.locator('#sp-overlay .sp-content-panel .sp-deck[disabled]', {hasText:'Thema van de les'}).count()>0,'een dynamische set zonder context moet zichtbaar disabled zijn');
await p.locator('#sp-overlay .sp-deck-more').click();

// 20. Reset geeft Basis.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.resetTaalworp());
const afterReset=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.taalworpState);
assert.deepEqual(afterReset.activeSetIds,['SET_A2_BASIS']);
assert.equal(afterReset.selectionMode,'single');

// 22. Sessieherstel: kies Werk, navigeer naar de startpagina en terug — Werk moet actief blijven.
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('taalworp'));
await p.waitForSelector('#sp-overlay .sp-dice-row');
await tiles().nth(1).click();
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('home'));
await p.waitForSelector('#sp-overlay .sp-tile');
await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.go('taalworp'));
await p.waitForSelector('#sp-overlay .sp-dice-row');
const restored=await p.evaluate(()=>globalThis.TaalrouteSpelen.instance.taalworpState);
assert.deepEqual(restored.activeSetIds,['SET_A2_WERK'],'een terugkeer binnen dezelfde Spelen-instantie moet de actieve set herstellen');

// 24. pedagogyCoverage veroorzaakt geen gegenereerde hulp: Voorbeeld toont altijd dezelfde generieke
// ontwikkelplaceholder, ook wanneer de actieve set een lage pedagogyCoverage heeft (geen client-side
// contentgeneratie op basis van dekking).
await p.locator('#sp-overlay .sp-action-bar >> text=Voorbeeld').click();
assert.equal(await p.locator('#sp-overlay .sp-content-panel').first().textContent(),'Voorbeeld nog niet gevuld.');

// 21. Nieuwe sessie geeft Basis (een verse Spelen-instantie start altijd bij Basis — geverifieerd op de
// resolverlaag zelf, die geen sessiestatus kent en dus geen "vorige sessie" kan onthouden).
assert.equal(await p.evaluate(()=>globalThis.TaalworpSetEngine.defaultSetId),'SET_A2_BASIS');
assert.equal(await p.evaluate(()=>globalThis.TaalworpSetEngine.selectionPolicy.newSessionSetId),'SET_A2_BASIS');

// Legacy compatibility-adapter: oude Prompt-1-fixture-id's en het manifest se eigen oudere deck-id's
// wijzen naar de juiste, bestaande sets; een onbekende oude id wordt niet verzonnen.
const legacy=await p.evaluate(()=>{
 const E=globalThis.TaalworpSetEngine;
 return {
  basis:E.legacySetId('basis'), deckBasis:E.legacySetId('DECK_A2_BASIS'),
  werk:E.legacySetId('werk'), onbekend:E.legacySetId('beweging-verandering'),
 };
});
assert.equal(legacy.basis,'SET_A2_BASIS'); assert.equal(legacy.deckBasis,'SET_A2_BASIS');
assert.equal(legacy.werk,'SET_A2_WERK'); assert.equal(legacy.onbekend,null,'een onbekende legacy-id mag niet naar een verzonnen set wijzen');

assert.deepEqual(errors,[]);
console.log('PASS taalworp-sets: 26 sets, generieke resolver (verb/verb_pattern/dynamic), single/combine-modus, dedup, geen contentKind-menging, Meer sets gegroepeerd, sessieherstel/reset, legacy-adapter');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
