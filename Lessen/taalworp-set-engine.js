/* SET 01: generieke Taalworp-setarchitectuur. Puur resolver-/statelogica, geen DOM, geen onderwijsinhoud.
   Werkt uitsluitend met de drie canonieke, aangeleverde contracten (Lessen/taalworp-sets/*.json, via
   scripts/build-taalworp-sets.cjs omgezet naar Lessen/taalworp-sets-data.js). Laadt na dat databestand en
   vóór Lessen/spelen.js. Er is hier geen apart codepad per set: elke set (bestaand of toekomstig) loopt
   door dezelfde resolveSet/combineSets. */
globalThis.TaalworpSetEngine = (() => {
 'use strict';
 const manifest = globalThis.TaalworpA2ContentManifest;
 const registry = globalThis.TaalworpA2SetRegistry;
 const architecture = globalThis.TaalworpA2SetArchitecture;

 function listSets() { return Object.values(registry.sets).slice().sort((a, b) => a.sortOrder - b.sortOrder); }
 function getSet(id) { return registry.sets[id] || null; }
 function getGroups() { return registry.groups.slice().sort((a, b) => a.order - b.order); }
 function groupLabel(groupId) { return getGroups().find((g) => g.id === groupId)?.label || groupId; }
 // Uitsluitend uit registry.quickAccessOrder gelezen — geen los hardgecodeerd Basis/Werk/Reizen-pad.
 function getQuickAccess() {
  return registry.quickAccessOrder.map((id) => (id === 'ACTION_MORE_SETS' ? { id, action: true, label: 'Meer sets' } : getSet(id)));
 }

 function manifestRecord(recordId, contentKind) {
  if (contentKind === 'verb') return manifest.verbs[recordId] || null;
  if (contentKind === 'verb_pattern') return manifest.verbPatterns[recordId] || null;
  return null;
 }
 // releasePolicy.selectableVerbRule: alleen releaseEligible=true mag ooit in een automatische trekking
 // komen. Het register levert al uitsluitend vrijgegeven recordIds; dit filter is de expliciete,
 // controleerbare waarborg, geen impliciet vertrouwen in de brondata.
 function releasedOnly(recordIds, contentKind) {
  return recordIds.filter((rid) => manifestRecord(rid, contentKind)?.releaseEligible === true);
 }

 /* Eén generieke resolver voor alle contentKinds en alle sets. */
 function resolveSet(id, ctx = {}) {
  const set = getSet(id);
  if (!set) return { status: 'disabled', reason: `Onbekende set: ${id}`, contentKind: null, recordIds: [] };
  if (set.contentKind === 'verb' || set.contentKind === 'verb_pattern') {
   const recordIds = releasedOnly(set.recordIds, set.contentKind);
   if (!recordIds.length) return { status: 'disabled', reason: 'Geen vrijgegeven records in deze set.', contentKind: set.contentKind, recordIds: [] };
   return { status: 'ready', reason: null, contentKind: set.contentKind, recordIds };
  }
  if (set.contentKind === 'dynamic') return resolveDynamic(set, ctx);
  return { status: 'disabled', reason: `Onbekende contentsoort: ${set.contentKind}`, contentKind: set.contentKind, recordIds: [] };
 }

 // Dynamische sets resolveren pas op runtime context (§ "Dynamische sets"). Zonder geldige context, of
 // zonder een bestaande koppeling tussen die context en records: disabled met een duidelijke functionele
 // reden. Nooit een stille terugval naar Basis, nooit hier verzonnen inhoud — er bestaat in de aangeleverde
 // contracten geen thema/sector→record-koppeltabel, dus deze twee zijn vooralsnog altijd disabled zodra
 // hun eigen context ontbreekt of aanwezig maar (nog) niet gekoppeld is.
 function resolveDynamic(set, ctx) {
  if (set.dynamicResolver === 'lessonContext.themeId') {
   const themeId = ctx.lessonContext?.themeId;
   if (!themeId) return { status: 'disabled', reason: 'Geen thema geselecteerd in de lescontext.', contentKind: 'dynamic', recordIds: [] };
   return { status: 'disabled', reason: `Nog geen inhoud gekoppeld aan thema "${themeId}".`, contentKind: 'dynamic', recordIds: [] };
  }
  if (set.dynamicResolver === 'lessonContext.sectorId') {
   const sectorId = ctx.lessonContext?.sectorId;
   if (!sectorId) return { status: 'disabled', reason: 'Geen sector geselecteerd in de lescontext.', contentKind: 'dynamic', recordIds: [] };
   return { status: 'disabled', reason: `Nog geen inhoud gekoppeld aan sector "${sectorId}".`, contentKind: 'dynamic', recordIds: [] };
  }
  if (set.dynamicResolver === 'teacherSelection.verbIds') {
   const verbIds = ctx.teacherSelection?.verbIds;
   if (!Array.isArray(verbIds) || !verbIds.length) return { status: 'disabled', reason: 'Nog geen eigen selectie gemaakt.', contentKind: 'dynamic', recordIds: [] };
   const recordIds = releasedOnly(verbIds, 'verb');
   if (!recordIds.length) return { status: 'disabled', reason: 'Geen vrijgegeven werkwoorden in de eigen selectie.', contentKind: 'dynamic', recordIds: [] };
   return { status: 'ready', reason: null, contentKind: 'verb', recordIds };
  }
  return { status: 'disabled', reason: 'Onbekende dynamische resolver.', contentKind: 'dynamic', recordIds: [] };
 }

 // Combineren: alleen ná expliciete activatie door de aanroepende UI (deze functie bepaalt zelf niets over
 // wanneer ze wordt aangeroepen). Verenigt en dedupliceert op recordId — overlap levert nooit een extra
 // trekkans op. Verschillende contentKinds worden nooit stilzwijgend gemengd: bij een mismatch komt er een
 // duidelijke, disabled uitkomst terug in plaats van een gemengde pool.
 function combineSets(ids, ctx = {}) {
  const resolved = ids.map((id) => ({ id, result: resolveSet(id, ctx) }));
  const ready = resolved.filter((r) => r.result.status === 'ready');
  if (!ready.length) return { status: 'disabled', reason: 'Geen van de gekozen sets levert inhoud op.', contentKind: null, recordIds: [], details: resolved };
  const kinds = new Set(ready.map((r) => r.result.contentKind));
  if (kinds.size > 1) return { status: 'disabled', reason: 'Combineren van verschillende contentsoorten wordt niet ondersteund.', contentKind: null, recordIds: [], details: resolved };
  const seen = new Set();
  const recordIds = [];
  for (const r of ready) for (const rid of r.result.recordIds) if (!seen.has(rid)) { seen.add(rid); recordIds.push(rid); }
  return { status: 'ready', reason: null, contentKind: [...kinds][0], recordIds, details: resolved };
 }

 /* Legacy compatibility-adapter. De oude Prompt-1/1B-fixtures (VERB_DECKS/VERB_DECKS_EXTRA in
    Lessen/spelen.js) gebruikten korte eigen id's ('basis', 'scheidbaar', ...); het canonieke manifest zelf
    bevat daarnaast nog een oudere DECK_A2_ / DECK_DYNAMIC_ -structuur (manifest.verbDecks/moreDecks) met
    een eigen defaultVerbDeckId. Elke koppeling hieronder is geverifieerd tegen de canonieke bestanden zelf
    (exacte sleutel, of — voor DECK_A2_UITDAGING_ONREGELMATIG — 100% recordoverlap met SET_A2_ONREGELMATIG),
    nooit op naam geraden. 'beweging-verandering' (een oude VERB_DECKS_EXTRA-placeholder) heeft geen
    tegenhanger in het register en blijft daarom bewust ongemapt. */
 const LEGACY_SET_ID_MAP = Object.freeze({
  basis: 'SET_A2_BASIS',
  DECK_A2_BASIS: 'SET_A2_BASIS',
  scheidbaar: 'SET_A2_SCHEIDBAAR',
  DECK_A2_SCHEIDBAAR: 'SET_A2_SCHEIDBAAR',
  wederkerend: 'SET_A2_WEDERKEREND',
  DECK_A2_WEDERKEREND: 'SET_A2_WEDERKEREND',
  uitdaging: 'SET_A2_ONREGELMATIG',
  DECK_A2_UITDAGING_ONREGELMATIG: 'SET_A2_ONREGELMATIG',
  onregelmatig: 'SET_A2_ONREGELMATIG',
  modaal: 'SET_A2_MODALITEIT',
  DECK_A2_MODALITEIT: 'SET_A2_MODALITEIT',
  'vaste-combinaties': 'SET_A2_VASTE_COMBINATIES',
  DECK_A2_VASTE_COMBINATIES: 'SET_A2_VASTE_COMBINATIES',
  werk: 'SET_A2_WERK',
  DECK_A2_WERK: 'SET_A2_WERK',
  reizen: 'SET_A2_REIZEN',
  DECK_A2_REIZEN: 'SET_A2_REIZEN',
  sector: 'SET_A2_SECTOR_DYNAMIC',
  DECK_DYNAMIC_SECTOR: 'SET_A2_SECTOR_DYNAMIC',
  'thema-les': 'SET_A2_THEME_DYNAMIC',
  DECK_DYNAMIC_THEME: 'SET_A2_THEME_DYNAMIC',
 });
 function legacySetId(oldId) { return LEGACY_SET_ID_MAP[oldId] ?? (oldId === manifest.defaults?.defaultVerbDeckId ? 'SET_A2_BASIS' : null); }

 return {
  listSets, getSet, getGroups, groupLabel, getQuickAccess, manifestRecord,
  resolveSet, combineSets, legacySetId,
  selectionPolicy: registry.selectionPolicy, defaultSetId: registry.defaultSetId, architecture,
 };
})();
