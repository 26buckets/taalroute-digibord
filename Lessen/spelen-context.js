/* Prompt 3: centrale applicatiecontext, module-/activiteitregistratie en gedeelde contracten voor de
   nieuwe Spelen-omgeving. Puur technische infrastructuur — geen visueel ontwerp, geen onderwijsinhoud.
   Alle fixture-achtige voorbeeldwaarden hieronder (in ActivityRegistry-registraties in Lessen/spelen.js)
   zijn expliciet technische placeholders, geen didactische content. Laadt VOOR Lessen/spelen.js: die
   registreert er zijn modules/activiteiten in en bouwt de GamePage/BoardAdapter-contracten erbovenop.
   Draagt bewust geen "DigiBoard"-naam: dit hoort net als TaalrouteSpelen bij de nieuwe, nog kandidaat
   Spelen-omgeving, niet bij de bestaande kernapp. */
globalThis.TaalrouteSpelenContext = (() => {
 'use strict';

 /* ---------- §4 Niveau: één centrale lijst, door de hele omgeving gedeeld. ---------- */
 const LEVELS = Object.freeze(['A0', 'A1', 'A1+', 'A2', 'B1', 'B2', 'C1', 'C2']);

 /* ---------- §10 Deelnamevormen: technisch contract, geen Live-backend. ---------- */
 const PARTICIPATION_MODES = Object.freeze(['classroom', 'live']);

 /* ---------- §9 Capabilities: shell bepaalt hierop welke controls relevant zijn. ---------- */
 const CAPABILITIES = Object.freeze([
  'help', 'example', 'extraChallenge', 'solution', 'classroom', 'live',
  'results', 'audio', 'image', 'openResponse', 'closedResponse',
 ]);

 /* ---------- §16 Navigatie: technische bestemmingen, geen headerredesign. ---------- */
 const NAV_DESTINATIONS = Object.freeze(['home', 'module', 'activity', 'world', 'lesson', 'collection']);

 /* ---------- §12 Generieke actie-identifiers: geen visuele positie als functionele identiteit. ---------- */
 const ACTION_IDS = Object.freeze(['help', 'example', 'primary', 'extraChallenge', 'reset', 'next', 'discuss', 'results', 'back']);

 const STORAGE_KEY = 'taalroute-spelen-context-v1';

 /* ---------- §5 LessonContext: schema/technische toestand, geen Taalroute-inhoud. ---------- */
 function freshLessonContext() {
  return {
   productId: null, // methode of product
   bookId: null, // boek (bv. "A2 naar B1")
   routeId: null, // route
   themeId: null, // thema
   lessonId: null, // les
   pageNumber: null, // pagina
   languageGoals: null, // taaldoelen
   workContext: null, // werkcontext
   sectorId: null, // sector
  };
 }

 /* ---------- §3 AppContext: minimale technische plaats voor alle genoemde velden. ---------- */
 function freshContext() {
  return {
   level: 'A2',
   lessonContext: freshLessonContext(),
   themeId: null,
   lessonId: null,
   page: 'home',
   workContext: null,
   sectorId: null,
   participationMode: 'classroom',
   activeModule: null,
   activeActivity: null,
   activeWorld: null,
   sessionId: null,
  };
 }

 function load() {
  try {
   const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
   if (raw && LEVELS.includes(raw.level)) {
    const base = freshContext();
    if (PARTICIPATION_MODES.includes(raw.participationMode)) base.participationMode = raw.participationMode;
    base.level = raw.level;
    return base;
   }
  } catch { /* val terug op standaard */ }
  return freshContext();
 }
 function persist() {
  // Uitsluitend de globale voorkeuren die zinvol zijn om te onthouden tussen bezoeken; geen sessie-/inhoudsdata.
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ level: state.level, participationMode: state.participationMode })); } catch { /* opslag optioneel */ }
 }

 let state = load();
 const listeners = new Set();
 function emit() {
  const snapshot = getState();
  for (const fn of listeners) {
   try { fn(snapshot); } catch (err) { console.error('[Lessen/spelen-context.js] Fout in een AppContext-listener.', err); }
  }
 }
 function getState() {
  return { ...state, lessonContext: { ...state.lessonContext } };
 }

 // Een niveauwijziging is uitdrukkelijk alleen de GLOBALE voorkeur (§4): een al gestarte sessie bewaart
 // haar eigen levelAtStart (zie TaalrouteSessionState.start) en wordt hier nooit stilzwijgend aangepast.
 function setLevel(level) {
  if (!LEVELS.includes(level)) return false;
  state.level = level;
  persist();
  emit();
  return true;
 }

 function setLessonContext(patch) {
  state.lessonContext = { ...state.lessonContext, ...(patch || {}) };
  emit();
 }
 function clearLessonContext() {
  state.lessonContext = freshLessonContext();
  emit();
 }
 // §6: werk/sector zijn inhoudelijke contextlagen, geen aparte apps. Los te zetten/wissen van de rest.
 function setSectorId(sectorId) {
  state.sectorId = sectorId ?? null;
  state.lessonContext.sectorId = state.sectorId;
  emit();
 }
 function clearSectorId() { setSectorId(null); }
 function setWorkContext(workContext) {
  state.workContext = workContext ?? null;
  state.lessonContext.workContext = state.workContext;
  emit();
 }
 function setParticipationMode(mode) {
  if (!PARTICIPATION_MODES.includes(mode)) return false;
  state.participationMode = mode;
  persist();
  emit();
  return true;
 }
 function setPage(page) { state.page = page ?? null; emit(); }
 function setActiveModule(moduleId) { state.activeModule = moduleId ?? null; emit(); }
 function setActiveActivity(activityId) { state.activeActivity = activityId ?? null; emit(); }
 function setActiveWorld(worldId) { state.activeWorld = worldId ?? null; emit(); }
 function setSessionId(sessionId) { state.sessionId = sessionId ?? null; emit(); }
 function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
 function reset() { state = freshContext(); emit(); }

 return {
  LEVELS, PARTICIPATION_MODES, CAPABILITIES, NAV_DESTINATIONS, ACTION_IDS,
  getState, subscribe, reset,
  setLevel, setLessonContext, clearLessonContext, setSectorId, clearSectorId, setWorkContext,
  setParticipationMode, setPage, setActiveModule, setActiveActivity, setActiveWorld, setSessionId,
  freshLessonContext,
 };
})();

/* ==========================================================================================
   §7 ModuleRegistry: centrale, uitbreidbare lijst van hoofdmodules (startpaginategels).
   De startpagina moet hier ALTIJD uit lezen, nooit een hardgecodeerd aantal veronderstellen.
   ========================================================================================== */
globalThis.TaalrouteModuleRegistry = (() => {
 'use strict';
 const modules = [];
 function register(mod) {
  if (!mod || !mod.id) throw new Error('TaalrouteModuleRegistry.register: een module vereist een id');
  const record = {
   label: mod.id, description: '', icon: null, order: modules.length, enabled: true,
   route: null, openHandler: null, capabilities: [],
   ...mod,
  };
  const existing = modules.findIndex((m) => m.id === record.id);
  if (existing >= 0) modules[existing] = { ...modules[existing], ...record };
  else modules.push(record);
  return record;
 }
 function unregister(id) {
  const i = modules.findIndex((m) => m.id === id);
  if (i >= 0) modules.splice(i, 1);
 }
 function get(id) { return modules.find((m) => m.id === id) || null; }
 // Zichtbare, gesorteerde lijst: dit is wat een startpagina mag renderen zonder zelf aannames te doen.
 function list() { return modules.filter((m) => m.enabled).slice().sort((a, b) => a.order - b.order); }
 function all() { return modules.slice(); }
 return { register, unregister, get, list, all };
})();

/* ==========================================================================================
   §8 ActivityRegistry: technisch contract voor spelactiviteiten, los van modules. Registreert
   uitsluitend metadata/capabilities — schrijft of kiest geen onderwijsinhoud.
   ========================================================================================== */
globalThis.TaalrouteActivityRegistry = (() => {
 'use strict';
 const activities = new Map();
 function define(def) {
  if (!def || !def.id) throw new Error('TaalrouteActivityRegistry.define: een activiteit vereist een id');
  const record = {
   gameFamily: null, moduleId: null, title: def.id,
   supportedLevels: null, levelRange: null,
   themeIds: [], sectorIds: [], participationModes: ['classroom'],
   capabilities: [], contentRef: null, renderer: null, status: 'draft',
   ...def,
  };
  activities.set(record.id, record);
  return record;
 }
 function get(id) { return activities.get(id) || null; }
 function list() { return [...activities.values()]; }
 function forModule(moduleId) { return list().filter((a) => a.moduleId === moduleId); }
 function hasCapability(id, capability) { return !!get(id)?.capabilities?.includes(capability); }
 function supportsParticipationMode(id, mode) { return !!get(id)?.participationModes?.includes(mode); }
 // §10: bepaalt welke deelnamevormen een GamePage voor deze activiteit mag aanbieden — puur op
 // basis van capabilities, nooit hardgecodeerd per scherm.
 function participationModesFor(id) {
  const record = get(id);
  if (!record) return ['classroom'];
  return record.participationModes.filter((m) => m === 'classroom' || record.capabilities.includes('live'));
 }
 return { define, get, list, forModule, hasCapability, supportsParticipationMode, participationModesFor };
})();

/* ==========================================================================================
   §15 SessionState: onderscheid tussen globale voorkeur (AppContext), actieve sessie (hier) en
   inhoudsrecord/Live-deelnamestatus (elders, nog niet gebouwd). Een sessie bevat NOOIT cursistnamen.
   ========================================================================================== */
globalThis.TaalrouteSessionState = (() => {
 'use strict';
 function start({ activityId, worldId = null, level, participationMode }) {
  return {
   activityId: activityId ?? null,
   worldId: worldId ?? null,
   levelAtStart: level ?? null, // bevroren bij start; een latere globale niveauwijziging raakt dit niet
   participationMode: participationMode ?? 'classroom',
   roundState: {},
   seenExamples: [],
   openedHelp: false,
   startedAt: new Date().toISOString(),
  };
 }
 function markExampleSeen(session, exampleId) {
  if (session && exampleId && !session.seenExamples.includes(exampleId)) session.seenExamples.push(exampleId);
  return session;
 }
 function markHelpOpened(session) {
  if (session) session.openedHelp = true;
  return session;
 }
 return { start, markExampleSeen, markHelpOpened };
})();
