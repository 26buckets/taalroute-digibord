/* Spelen: nieuwe app shell en eerste schermfamilies (Taalworp, Bouw een zin, Verhaalworp) boven op de bestaande DigiBoard-app.
   KANDIDAAT-uitbreiding. Geen bestaande speelwerelden, kaartenbanken, opslag of didactiek gewijzigd.
   Alle inhoudelijke teksten hieronder die als DEV FIXTURE zijn gemarkeerd komen uitsluitend uit de aangeleverde UI-referentie
   of zijn expliciete placeholders ("Content nog aan te leveren"). Er is hier geen nieuwe onderwijscontent geschreven. */
globalThis.TaalrouteSpelen = (() => {
 'use strict';

 /* ---------- Klein hulpprogramma voor DOM-opbouw (geen framework, past bij de bestaande vanilla-stack) ---------- */
 function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
   if (key === 'class') node.className = value;
   else if (key === 'text') node.textContent = value;
   else if (key === 'html') node.innerHTML = value;
   else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
   else if (value === false || value === null || value === undefined) continue;
   else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of [].concat(children)) if (child) node.append(child);
  return node;
 }
 const clear = (node) => { while (node.firstChild) node.firstChild.remove(); };

 /* ---------- Iconen: eenvoudige lijniconen, geen extern iconenpakket nodig voor deze fase ---------- */
 const ICONS = {
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  star: '<path d="m12 3 2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L12 16.9l-5.6 3.1 1.4-6.3L3 9.4l6.4-.6Z"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  cards: '<rect x="7" y="4" width="13" height="17" rx="2"/><rect x="3" y="8" width="13" height="17" rx="2" fill="#fff"/>',
  words: '<rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="15" width="7" height="7" rx="1.5"/><rect x="14" y="15" width="7" height="7" rx="1.5"/>',
  board: '<circle cx="6" cy="6" r="2.4"/><path d="M9 6h11"/><rect x="9.5" y="14" width="4.4" height="4.4" transform="rotate(45 11.7 16.2)"/><path d="M18 16.2h3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM19 14v7M14 19h4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.7 7.7 0 0 0-1.7-1l-.4-2.6H9.1l-.4 2.6a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 11a7.7 7.7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.7 7.7 0 0 0 1.7 1l.4 2.6h5.8l.4-2.6a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.4Z"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v5h-5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 };
 const icon = (name, size = 20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

 /* ---------- Echt bestaand Taalroute-woordmerk, verbatim overgenomen uit Lessen/appmenu.js (logoTemplate). ---------- */
 /* Niet opnieuw getekend, geen eigen variant: dezelfde SVG-bron als de bestaande KANDIDAAT-appmenu-integratie. */
 const BRAND_SVG = "<svg class=\"tr-logo\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"750\" height=\"94\" viewBox=\"0 0 750 94\">\n  \n  \n  <g id=\"WOORDMERK_TAAL_VAST\" fill=\"#223A59\">\n    <path d=\"M71.84540389972145 0.0V18.149572649572647H47.23537604456825V93.0H24.610027855153206V18.149572649572647H0.0V0.0Z\"/>\n    <path d=\"M122.78551532033427 76.57264957264957H88.11977715877438L82.56267409470752 93.0H58.87883008356546L92.48607242339833 0.0H118.68384401114207L152.29108635097492 93.0H128.3426183844011ZM116.96378830083566 59.085470085470085 105.45264623955433 25.038461538461533 94.07381615598887 59.085470085470085Z\"/>\n    <path d=\"M204.6866295264624 76.57264957264957H170.02089136490252L164.4637883008357 93.0H140.77994428969362L174.38718662952647 0.0H200.5849582172702L234.1922005571031 93.0H210.24373259052925ZM198.8649025069638 59.085470085470085 187.35376044568247 25.038461538461533 175.97493036211702 59.085470085470085Z\"/>\n    <path d=\"M255.36211699164346 75.51282051282051H285.0V93.0H232.73676880222843V0.0H255.36211699164346Z\"/>\n  </g>\n  <g id=\"WOORDMERK_ROUTE_VAST\" fill=\"#223A59\">\n    <path d=\"M338.3985428051002 93.07584269662921 316.50710382513665 55.44943820224719H302.00072859744995V93.07584269662921H290.0V1.0561797752808957H319.672131147541Q330.09034608378875 1.0561797752808957 337.2775956284153 4.620786516853933Q344.4648451730419 8.18539325842697 348.0255009107468 14.258426966292134Q351.5861566484517 20.3314606741573 351.5861566484517 28.12078651685394Q351.5861566484517 37.62640449438202 346.1132969034609 44.8876404494382Q340.64043715847 52.14887640449438 329.6947176684882 54.5252808988764L352.77304189435336 93.07584269662921ZM302.00072859744995 45.811797752808985H319.672131147541Q329.43096539162116 45.811797752808985 334.31038251366124 40.99297752808988Q339.1897996357013 36.174157303370784 339.1897996357013 28.12078651685394Q339.1897996357013 19.93539325842697 334.37632058287795 15.446629213483149Q329.56284153005464 10.957865168539328 319.672131147541 10.957865168539328H302.00072859744995Z\"/>\n    <path d=\"M357.784335154827 47.0Q357.784335154827 33.53370786516854 363.91657559198546 22.77387640449438Q370.04881602914395 12.014044943820224 380.5989071038252 6.007022471910112Q391.1489981785064 0.0 403.94098360655744 0.0Q416.86484517304194 0.0 427.4149362477232 6.007022471910112Q437.9650273224044 12.014044943820224 444.0313296903461 22.707865168539325Q450.09763205828784 33.401685393258425 450.09763205828784 47.0Q450.09763205828784 60.598314606741575 444.0313296903461 71.29213483146067Q437.9650273224044 81.98595505617978 427.4149362477232 87.99297752808988Q416.86484517304194 94.0 403.94098360655744 94.0Q391.1489981785064 94.0 380.5989071038252 87.99297752808988Q370.04881602914395 81.98595505617978 363.91657559198546 71.22612359550561Q357.784335154827 60.466292134831455 357.784335154827 47.0ZM437.83315118397087 47.0Q437.83315118397087 35.91011235955056 433.41530054644807 27.65870786516854Q428.9974499089253 19.407303370786522 421.34863387978146 14.918539325842701Q413.69981785063754 10.42977528089888 403.94098360655744 10.42977528089888Q394.1821493624773 10.42977528089888 386.53333333333336 14.918539325842701Q378.88451730418944 19.407303370786522 374.4666666666667 27.65870786516854Q370.04881602914395 35.91011235955056 370.04881602914395 47.0Q370.04881602914395 57.95786516853932 374.4666666666667 66.2752808988764Q378.88451730418944 74.59269662921348 386.59927140255013 79.0814606741573Q394.31402550091076 83.57022471910112 403.94098360655744 83.57022471910112Q413.56794171220406 83.57022471910112 421.2826958105647 79.0814606741573Q428.9974499089253 74.59269662921348 433.41530054644807 66.2752808988764Q437.83315118397087 57.95786516853932 437.83315118397087 47.0Z\"/>\n    <path d=\"M469.74717668488165 1.0561797752808957V59.27808988764045Q469.74717668488165 71.5561797752809 475.7475409836066 77.49719101123596Q481.74790528233154 83.43820224719101 492.42987249544626 83.43820224719101Q502.97996357012755 83.43820224719101 508.9803278688525 77.49719101123596Q514.9806921675774 71.5561797752809 514.9806921675774 59.27808988764045V1.0561797752808957H526.9814207650273V59.146067415730336Q526.9814207650273 70.6320224719101 522.3657559198543 78.48735955056179Q517.7500910746812 86.34269662921348 509.9034608378871 90.17134831460675Q502.05683060109294 94.0 492.2979963570128 94.0Q482.5391621129326 94.0 474.69253187613845 90.17134831460675Q466.8459016393443 86.34269662921348 462.296174863388 78.48735955056179Q457.7464480874317 70.6320224719101 457.7464480874317 59.146067415730336V1.0561797752808957Z\"/>\n    <path d=\"M595.6888888888889 1.0561797752808957V10.82584269662921H570.632422586521V93.07584269662921H558.6316939890711V10.82584269662921H533.4433515482697V1.0561797752808957Z\"/>\n    <path d=\"M614.5471766848815 10.82584269662921V41.587078651685395H648.0437158469945V51.48876404494382H614.5471766848815V83.17415730337078H651.9999999999999V93.07584269662921H602.5464480874316V0.9241573033707908H651.9999999999999V10.82584269662921Z\"/>\n  </g>\n  <path id=\"DRIEHOEK_BOEK_ACCENT\" d=\"M671 2 L750 47.5 L671 93 Z\" fill=\"#C76349\"/>\n</svg>";
 function brandmark(accent) {
  return BRAND_SVG.replace('#223A59', 'currentColor').replace('#C76349', accent);
 }

 /* ---------- Vaste vormtaal (○ □ △ ◇), zoals in Kaarten/register.js/Lessen/opdrachtenmatrix.js beschreven; alleen gerenderd, niet opnieuw gedefinieerd. ---------- */
 const SHAPES_SVG = '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">'
  + '<circle cx="16" cy="16" r="9" fill="#176b9a"/>'
  + '<rect x="34" y="7" width="18" height="18" rx="2" fill="#a44932"/>'
  + '<path d="M16 38 26 56H6Z" fill="#407354"/>'
  + '<path d="M43 36 54 47 43 58 32 47Z" fill="#8a6426"/>'
  + '</svg>';

 /* ==========================================================================================
    NIVEAU: globale context (A0..C2). Herbruikbaar, niet hardgecodeerd in losse spelcomponenten.
    Eigen instellingensleutel, apart van de bestaande vier-niveau kaartroute (data.settings.route).
    ========================================================================================== */
 const LEVELS = ['A0', 'A1', 'A1+', 'A2', 'B1', 'B2', 'C1', 'C2'];
 const STORAGE_KEY = 'taalroute-spelen-v1';

 function loadState() {
  try {
   const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
   if (raw && LEVELS.includes(raw.level)) return { level: raw.level };
  } catch { /* val terug op standaard */ }
  return { level: 'A2' };
 }
 function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ level: s.level })); } catch { /* opslag optioneel */ }
 }

 /* ==========================================================================================
    MODULEREGISTER voor de Spelen-startpagina. Uitbreidbaar: de grid veronderstelt geen vast aantal.
    ========================================================================================== */
 const BASE_MODULES = [
  { id: 'speelborden', label: 'Speelborden', desc: 'Reis door Nederland en oefen taal in echte situaties.', art: SHAPES_SVG },
  { id: 'dobbelspellen', label: 'Dobbelspellen', desc: 'Gooi, combineer en maak taal.', art: icon('dice', 56) },
  { id: 'kaartspellen', label: 'Kaartspellen', desc: 'Praat, denk en oefen met kaarten.', art: icon('cards', 56) },
  { id: 'woorden-en-zinnen', label: 'Woorden & zinnen', desc: 'Bouw, orden en ontdek taal.', art: icon('words', 56) },
 ];

 /* ==========================================================================================
    Gedeelde componenten
    ========================================================================================== */

 function ExplainButton(text) {
  const wrap = el('div', { class: 'sp-explain-wrap' });
  const button = el('button', { type: 'button', class: 'sp-explain-button', 'aria-haspopup': 'true', 'aria-expanded': 'false', html: icon('help', 16) + ' Uitleg' });
  const panel = el('div', { class: 'sp-explain-panel', role: 'note', text: text || 'Uitleg nog niet aangeleverd' });
  panel.hidden = true;
  button.addEventListener('click', () => {
   const open = panel.hidden;
   panel.hidden = !open;
   button.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); } });
  wrap.append(button, panel);
  return wrap;
 }

 function PreviewButton(content) {
  if (!content) return null; // Claude schrijft geen voorbeelden; zonder aangeleverde inhoud bestaat de knop niet.
  const panel = el('div', { class: 'sp-content-panel', text: content });
  panel.hidden = true;
  const button = el('button', { type: 'button', class: 'sp-btn', html: icon('eye', 17) + ' Voorbeeld', onclick: () => { panel.hidden = !panel.hidden; } });
  return { button, panel };
 }

 function ChallengeButton(content) {
  if (!content) return null; // Geen uitdaging gedefinieerd: knop wordt niet getoond.
  const panel = el('div', { class: 'sp-content-panel', text: content });
  panel.hidden = true;
  const button = el('button', { type: 'button', class: 'sp-btn sp-btn-star', html: icon('star', 17) + ' Extra uitdaging', onclick: () => { panel.hidden = !panel.hidden; } });
  return { button, panel };
 }

 /* GameActionBar: toont uitsluitend de geconfigureerde acties, in de aanbevolen volgorde
    Voorbeeld -> primaire actie -> Extra uitdaging -> maximaal twee contextacties. */
 function GameActionBar({ preview, primary, challenge, context = [] } = {}) {
  const bar = el('div', { class: 'sp-action-bar' });
  const previewCmp = preview ? PreviewButton(preview) : null;
  const challengeCmp = challenge ? ChallengeButton(challenge) : null;
  const rendered = [];
  if (previewCmp) rendered.push(previewCmp.button);
  if (primary) rendered.push(el('button', { type: 'button', class: 'sp-btn sp-btn-primary', ...(primary.attrs || {}), onclick: primary.onClick, text: primary.label }));
  if (challengeCmp) rendered.push(challengeCmp.button);
  for (const action of context.slice(0, 2)) rendered.push(el('button', { type: 'button', class: 'sp-btn', ...(action.attrs || {}), onclick: action.onClick, html: (action.icon ? icon(action.icon, 17) : '') + ' ' + action.label }));
  bar.append(...rendered);
  const panels = [previewCmp?.panel, challengeCmp?.panel].filter(Boolean);
  return { node: bar, panels };
 }

 /* GamePageShell: gedeelde structuur voor elke spelpagina. */
 function GamePageShell({ icon: iconSvg, name, description, contextBadges = [], explain, onBack }) {
  const head = el('div', { class: 'sp-game-head' }, [
   el('button', { type: 'button', class: 'sp-back', html: icon('arrowLeft', 16) + ' Terug', onclick: onBack }),
   el('div', { class: 'sp-game-icon', html: iconSvg || icon('dice', 24) }),
   el('div', { class: 'sp-game-titles' }, [
    el('h2', { text: name }),
    el('p', { text: description }),
    contextBadges.length ? el('div', { class: 'sp-action-bar' }, contextBadges.map((b) => el('span', { class: 'sp-badge', text: b }))) : null,
   ]),
   el('div', { class: 'sp-explain' }, [ExplainButton(explain)]),
  ]);
  const body = el('div', { class: 'sp-game-body' });
  const shell = el('div', { class: 'sp-game-shell' }, [head, body]);
  return { shell, body };
 }

 /* ParticipationModeSwitch: alleen relevant bij activiteiten die zowel Klassikaal als Live ondersteunen. */
 function ParticipationModeSwitch({ modes = ['Klassikaal', 'Live'], value, onChange }) {
  const wrap = el('div', { class: 'sp-mode-switch', role: 'group', 'aria-label': 'Deelnamevorm' });
  let current = value || modes[0];
  const buttons = modes.map((m) => el('button', {
   type: 'button', 'aria-pressed': String(m === current), text: m,
   onclick: () => { current = m; for (const b of buttons) b.setAttribute('aria-pressed', String(b.textContent === current)); onChange?.(current); },
  }));
  wrap.append(...buttons);
  return wrap;
 }

 /* VerbDeckSelector / StoryDiceSetSelector delen hetzelfde stapel-/setpatroon: meervoudig actief,
    generieke tags in plaats van één exclusieve categorie per record. */
 function DeckTile({ id, name, hint, art, active, onToggle }) {
  const tile = el('button', {
   type: 'button', class: 'sp-deck', 'data-active': String(!!active), 'aria-pressed': String(!!active),
   onclick: () => onToggle(id),
  }, [
   el('div', { class: 'sp-deck-art', html: art || '' }),
   el('div', { class: 'sp-deck-name', text: name }),
   hint ? el('div', { class: 'sp-deck-hint', text: hint }) : null,
   el('span', { class: 'sp-deck-check', html: icon('check', 11) }),
  ]);
  return tile;
 }

 function MoreStacksTile({ extra, onOpen }) {
  const art = extra.length <= 1
   ? el('div', { class: 'sp-deck-art', html: icon('cards', 32) })
   : el('div', { class: 'sp-deck-art' }, [el('div', { class: 'sp-deck-more-stack' }, extra.slice(0, 3).map(() => el('span')))]);
  return el('button', { type: 'button', class: 'sp-deck sp-deck-more', onclick: onOpen }, [
   art,
   el('div', { class: 'sp-deck-name', text: 'Meer stapels' }),
   el('div', { class: 'sp-deck-hint', text: extra.length ? `${extra.length} extra` : 'Kies extra stapels' }),
  ]);
 }

 /* Meervoudige selectie: records mogen tot meerdere actieve stapels/sets behoren.
    Combineren van pools levert unieke records op (geen dubbele kans door dubbele selectie). */
 function combineUniquePools(pools, idKey = 'id') {
  const seen = new Set(); const out = [];
  for (const pool of pools) for (const record of pool) {
   const key = record[idKey];
   if (seen.has(key)) continue;
   seen.add(key); out.push(record);
  }
  return out;
 }

 function VerbDeckSelector({ decks, extraDecks = [], onChange }) {
  const activeIds = new Set(decks.filter((d) => d.defaultActive).map((d) => d.id));
  const wrap = el('div');
  const row = el('div', { class: 'sp-deck-row' });
  let modal = null;
  function currentPools() {
   const all = decks.concat(extraDecks);
   return all.filter((d) => activeIds.has(d.id)).map((d) => d.records);
  }
  function emit() { onChange?.(combineUniquePools(currentPools())); }
  function toggle(id) {
   if (activeIds.has(id)) activeIds.delete(id); else activeIds.add(id);
   redraw(); emit();
  }
  function redraw() {
   clear(row);
   for (const deck of decks) row.append(DeckTile({ ...deck, active: activeIds.has(deck.id), onToggle: toggle }));
   for (const deck of extraDecks) if (activeIds.has(deck.id)) row.append(DeckTile({ ...deck, active: true, onToggle: toggle }));
   row.append(MoreStacksTile({
    extra: extraDecks,
    onOpen: () => openMore(),
   }));
  }
  function openMore() {
   if (modal) { modal.remove(); modal = null; return; }
   modal = el('div', { class: 'sp-content-panel' }, [
    el('div', { class: 'sp-deck-label', text: 'Meer stapels' }),
    el('div', { class: 'sp-deck-row' }, extraDecks.map((deck) => DeckTile({ ...deck, active: activeIds.has(deck.id), onToggle: (id) => { toggle(id); } }))),
   ]);
   wrap.append(modal);
  }
  redraw();
  wrap.prepend(row);
  emit();
  wrap.getActiveIds = () => new Set(activeIds);
  wrap.getPool = () => combineUniquePools(currentPools());
  return wrap;
 }

 function StoryDiceSetSelector({ sets, onChange }) {
  const activeIds = new Set(sets.filter((s) => s.defaultActive).map((s) => s.id));
  const row = el('div', { class: 'sp-deck-row' });
  function pool() { return combineUniquePools(sets.filter((s) => activeIds.has(s.id)).map((s) => s.records)); }
  function redraw() {
   clear(row);
   for (const s of sets) row.append(DeckTile({ id: s.id, name: s.name, hint: s.records.length ? `${s.records.length} beelden` : 'Nog niet gevuld', art: s.art, active: activeIds.has(s.id), onToggle: (id) => { activeIds.has(id) ? activeIds.delete(id) : activeIds.add(id); redraw(); onChange?.(pool()); } }));
  }
  redraw(); onChange?.(pool());
  row.getPool = pool;
  return row;
 }

 /* ==========================================================================================
    Fixture-inhoud. Alle waarden hieronder zijn ontwikkelfixtures uit de aangeleverde UI-referentie
    of expliciete "content nog aan te leveren"-placeholders. Geen nieuwe onderwijscontent.
    ========================================================================================== */

 // Taalworp: zes vaste dobbelsteensoorten. DiceType (stabiel) en DiceValue (afhankelijk van niveau/pool) zijn bewust gescheiden dataconcepten.
 const TAALWORP_DICE_TYPES = [
  { id: 'wie', label: 'Wie', color: '#2f6fb0' },
  { id: 'tijd', label: 'Tijd', color: '#c0392b' },
  { id: 'zinssoort', label: 'Zinssoort', color: '#2f7d5b' },
  { id: 'verbind1', label: 'Verbind 1', sub: '(nevenschikking)', color: '#c98a1e' },
  { id: 'verbind2', label: 'Verbind 2', sub: '(onderschikking)', color: '#7a4fa0' },
  { id: 'werkwoordsvorm', label: 'Werkwoordsvorm', color: '#5b6b73' },
 ];
 // DEV FIXTURE — exact overgenomen uit de aangeleverde schermreferentie, geen zelfstandig geschreven inhoud.
 const TAALWORP_FIXTURE_FACE = { wie: 'wij', tijd: 'vtt', zinssoort: 'vraag', verbind1: 'maar', verbind2: 'omdat', werkwoordsvorm: 'pv' };

 // DEV FIXTURE — namen uit de aangeleverde referentie. Records zijn placeholders (id + naam), geen werkwoordenlijst.
 function fixtureRecords(prefix, count) {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}-${i}`, text: 'Content nog aan te leveren' }));
 }
 const VERB_DECKS = [
  { id: 'basis', name: 'Basis', hint: 'veelgebruikt', defaultActive: true, records: fixtureRecords('basis', 12), art: '<div style="font-size:11px;color:#4b6577">Basis</div>' },
  { id: 'scheidbaar', name: 'Scheidbaar', hint: 'Klik om te activeren', defaultActive: false, records: fixtureRecords('scheidbaar', 8) },
  { id: 'wederkerend', name: 'Wederkerend', hint: 'Klik om te activeren', defaultActive: false, records: fixtureRecords('wederkerend', 6) },
  { id: 'uitdaging', name: 'Uitdaging', hint: 'Klik om te activeren', defaultActive: false, records: fixtureRecords('uitdaging', 6) },
 ];
 // Voorlopige mogelijke stapelidentiteiten (type/fixture, geen ingevulde inhoud): onregelmatig, modaal, vaste combinaties, beweging en verandering, werk, sector, thema van de les.
 const VERB_DECKS_EXTRA = [
  { id: 'onregelmatig', name: 'Onregelmatig', hint: 'Nog niet gevuld', records: [] },
  { id: 'modaal', name: 'Modaal', hint: 'Nog niet gevuld', records: [] },
  { id: 'vaste-combinaties', name: 'Vaste combinaties', hint: 'Nog niet gevuld', records: [] },
  { id: 'beweging-verandering', name: 'Beweging en verandering', hint: 'Nog niet gevuld', records: [] },
  { id: 'werk', name: 'Werk', hint: 'Nog niet gevuld', records: [] },
  { id: 'sector', name: 'Sector', hint: 'Nog niet gevuld', records: [] },
  { id: 'thema-les', name: 'Thema van de les', hint: 'Nog niet gevuld', records: [] },
 ];

 // Bouw een zin: DEV FIXTURE-woorden, letterlijk uit de aangeleverde referentie.
 const BUILD_WORDS = ['Morgen', 'gaan', 'wij', 'naar', 'de', 'markt'];

 // Verhaalworp: "Basis" hergebruikt de echte, bestaande beelddobbelstenen (Actiewoorden/actiewoorden-content.js).
 // De overige setnamen zijn uitsluitend architectuur/fixture: nog geen eigen beeldpool, dus leeg totdat aangeleverd.
 function storySets() {
  const base = globalThis.PraatpadActions?.items || [];
  const basisRecords = base.slice(0, 12).map((it) => ({ id: it.id, svg: pathsToSvg(it.paths) }));
  const names = ['Personen', 'Plaatsen', 'Voorwerpen', 'Acties', 'Werk', 'Reizen', 'Zorg', 'Techniek'];
  return [
   { id: 'basis', name: 'Basis', defaultActive: true, records: basisRecords, art: basisRecords[0]?.svg },
   ...names.map((name, i) => ({ id: `set-${i}`, name, defaultActive: false, records: [] })),
  ];
 }
 function pathsToSvg(paths) {
  return `<svg viewBox="0 0 96 96" width="40" height="40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
 }

 /* ==========================================================================================
    Schermen
    ========================================================================================== */

 function screenHome(ctx) {
  const wrap = el('div', { class: 'sp-home' });
  wrap.append(el('div', { class: 'sp-welcome' }, [el('h1', { text: 'Welkom!' }), el('p', { text: 'Ontdek, speel en spreek Nederlands.' })]));
  const grid = el('div', { class: 'sp-grid' });
  function drawTile(mod) {
   return el('button', { type: 'button', class: 'sp-tile', onclick: () => ctx.go(mod.id) }, [
    el('div', { class: 'sp-tile-art', html: mod.art }),
    el('div', { class: 'sp-tile-body' }, [el('strong', { text: mod.label }), el('span', { text: mod.desc })]),
   ]);
  }
  for (const mod of ctx.modules) grid.append(drawTile(mod));
  wrap.append(grid);
  const row = el('div', { class: 'sp-row-grid' }, [
   el('button', { type: 'button', class: 'sp-panel-row', onclick: () => ctx.go('taalworp'), html: icon('refresh', 22) }, [
    el('div', {}, [el('strong', { text: 'Hervat je laatste spel' }), el('span', { text: 'Taalworp – Werkwoorden – A2' })]),
    el('span', { class: 'sp-panel-row-chevron', html: icon('chevronRight', 18) }),
   ]),
   el('button', { type: 'button', class: 'sp-panel-row', html: icon('dice', 22) }, [
    el('div', {}, [el('strong', { text: 'Bekijk je voortgang' })]),
    el('span', { class: 'sp-panel-row-chevron', html: icon('chevronRight', 18) }),
   ]),
  ]);
  wrap.append(row);
  wrap.__grid = grid;
  return wrap;
 }

 function screenTaalworp(ctx) {
  const { shell, body } = GamePageShell({
   iconSvg: icon('dice', 28), name: 'Taalworp', description: 'Gooi de taalstenen, kies een werkwoord en maak taal.',
   contextBadges: [], explain: 'Content nog aan te leveren', onBack: ctx.back,
  });
  const diceRow = el('div', { class: 'sp-dice-row' });
  for (const type of TAALWORP_DICE_TYPES) {
   diceRow.append(el('div', { class: 'sp-dice' }, [
    el('div', { class: 'sp-dice-face', style: `background:${type.color}`, text: TAALWORP_FIXTURE_FACE[type.id] }),
    el('div', { class: 'sp-dice-label', text: type.label }),
    type.sub ? el('div', { class: 'sp-dice-sub', text: type.sub }) : null,
   ]));
  }
  const deckLabel = el('div', { class: 'sp-deck-label', text: `Kies je werkwoordstapels (${ctx.level})` });
  const decks = VerbDeckSelector({ decks: VERB_DECKS, extraDecks: VERB_DECKS_EXTRA });
  const actionBar = GameActionBar({
   preview: null,
   primary: { label: 'Gooien', attrs: { html: icon('dice', 17) + ' Gooien' }, onClick: () => {} },
   challenge: null,
   context: [{ label: 'Wisselen', icon: 'refresh', onClick: () => {} }],
  });
  body.append(diceRow, deckLabel, decks, actionBar.node, ...actionBar.panels);
  shell.__decks = decks;
  shell.__diceRow = diceRow;
  return shell;
 }

 function screenBouwEenZin(ctx) {
  const { shell, body } = GamePageShell({
   iconSvg: icon('words', 26), name: 'Bouw een zin', description: 'Zet de woorden in de juiste volgorde.',
   contextBadges: [], explain: 'Content nog aan te leveren', onBack: ctx.back,
  });
  let mode = 'Klassikaal';
  const modeSwitch = ParticipationModeSwitch({ value: mode, onChange: (m) => { mode = m; livePanel.hidden = m !== 'Live'; } });
  const zone = el('div', { class: 'sp-sentence-zone', 'data-empty': 'true' });
  const placed = [];
  const tiles = BUILD_WORDS.map((word) => {
   const tile = el('button', { type: 'button', class: 'sp-word-tile', text: word, onclick: () => {
    if (tile.dataset.placed === 'true') return;
    tile.dataset.placed = 'true';
    zone.dataset.empty = 'false';
    zone.append(el('span', { class: 'sp-word-tile', text: word, onclick: () => { tile.dataset.placed = 'false'; zone.querySelector(`[data-src="${word}"]`)?.remove(); if (![...zone.children].length) zone.dataset.empty = 'true'; } }));
    placed.push(word);
   } });
   return tile;
  });
  const words = el('div', { class: 'sp-word-row' }, [...tiles, el('button', { type: 'button', class: 'sp-word-tile', text: '…' })]);
  const livePanel = el('div', { class: 'sp-live-panel' }, [
   el('div', { class: 'sp-qr-placeholder', html: icon('qr', 40) }),
   el('div', {}, [el('strong', { text: 'Live meedoen' }), el('div', { text: 'Laat cursisten op hun telefoon dezelfde opdracht maken.' })]),
   el('div', {}, [el('span', { text: 'Ga naar taalroute.live · Code: ' }), el('code', { text: '7K3P' })]),
  ]);
  livePanel.hidden = mode !== 'Live';
  const results = ResultsPanel();
  const actionBar = GameActionBar({
   preview: null,
   primary: { label: 'Controleer volgorde', onClick: () => {} },
   challenge: null,
   context: [{ label: 'Wissen', icon: 'trash', onClick: () => { for (const t of tiles) t.dataset.placed = 'false'; clear(zone); zone.dataset.empty = 'true'; } }],
  });
  const layout = el('div', { style: 'display:flex;gap:24px;flex-wrap:wrap' }, [
   el('div', { style: 'flex:1;min-width:260px;display:flex;flex-direction:column;gap:16px' }, [modeSwitch, zone, words]),
   livePanel,
  ]);
  body.append(layout, actionBar.node, ...actionBar.panels, results);
  shell.__modeSwitch = modeSwitch;
  shell.__livePanel = livePanel;
  return shell;
 }

 function ResultsPanel() {
  // Claude beoordeelt en genereert geen inhoud; toont uitsluitend status van aangeleverde inzendingen.
  const list = el('ul', { class: 'sp-results-list' });
  const node = el('div', {}, [el('button', { type: 'button', class: 'sp-btn', text: 'Resultaten (0)' }), list]);
  node.setStatus = (entries) => {
   clear(list);
   for (const entry of entries) list.append(el('li', {}, [
    el('span', { text: `${entry.name}: ${entry.text}` }),
    el('span', { class: 'sp-result-status', 'data-status': entry.status, text: entry.status === 'seen' ? 'besproken' : 'nog niet bekeken' }),
   ]));
  };
  return node;
 }

 function screenVerhaalworp(ctx) {
  const { shell, body } = GamePageShell({
   iconSvg: icon('board', 26), name: 'Verhaalworp', description: 'Gooi de dobbelstenen en vertel samen een verhaal.',
   contextBadges: [], explain: 'Content nog aan te leveren', onBack: ctx.back,
  });
  let count = 6; const locked = new Set();
  const stepper = el('div', { class: 'sp-stepper' }, [
   el('button', { type: 'button', 'aria-label': 'Minder dobbelstenen', text: '–', onclick: () => setCount(count - 1) }),
   el('span', { text: String(count) }),
   el('button', { type: 'button', 'aria-label': 'Meer dobbelstenen', text: '+', onclick: () => setCount(count + 1) }),
  ]);
  const dieRow = el('div', { class: 'sp-story-dice-row' });
  let pool = [];
  function setCount(n) {
   count = Math.max(3, Math.min(9, n));
   stepper.children[1].textContent = String(count);
   drawDice();
  }
  function drawDice() {
   clear(dieRow);
   for (let i = 0; i < count; i++) {
    const record = pool.length ? pool[i % pool.length] : null;
    const isLocked = locked.has(i);
    const die = el('div', { class: 'sp-story-die', 'data-locked': String(isLocked) }, [
     el('div', { html: record?.svg || icon('dice', 32) }),
     el('button', { type: 'button', class: 'sp-story-die-lock', 'aria-pressed': String(isLocked), 'aria-label': isLocked ? 'Losmaken' : 'Vastzetten', html: icon('lock', 13), onclick: () => { isLocked ? locked.delete(i) : locked.add(i); drawDice(); } }),
    ]);
    dieRow.append(die);
   }
  }
  const sets = StoryDiceSetSelector({ sets: storySets(), onChange: (p) => { pool = p; drawDice(); } });
  const note = el('div', { class: 'sp-fixture-note', text: '"Basis" gebruikt de bestaande beelddobbelstenen. Overige sets zijn nog niet gevuld.' });
  const actionBar = GameActionBar({
   preview: null,
   primary: { label: 'Gooien', attrs: { html: icon('dice', 17) + ' Gooien' }, onClick: drawDice },
   challenge: null,
   context: [{ label: 'Alles los', icon: 'refresh', onClick: () => { locked.clear(); drawDice(); } }],
  });
  body.append(el('div', { class: 'sp-story-controls' }, [el('span', { class: 'sp-deck-label', text: 'Aantal dobbelstenen' }), stepper]), dieRow, el('div', { class: 'sp-deck-label', text: 'Kies je beeldensets' }), sets, note, actionBar.node, ...actionBar.panels);
  drawDice();
  shell.__stepper = stepper; shell.__dieRow = dieRow; shell.__sets = sets;
  shell.__setCount = setCount; shell.__getLocked = () => new Set(locked);
  return shell;
 }

 /* ==========================================================================================
    App shell: bovenbalk, navigatie en router tussen de schermen hierboven.
    ========================================================================================== */
 function build() {
  const state = loadState();
  const overlay = el('div', { id: 'sp-overlay', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Spelen' });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) overlay.dataset.motion = 'reduce';

  const levelSelect = el('select', { class: 'sp-level-select', 'aria-label': 'Niveau' }, LEVELS.map((lv) => el('option', { value: lv, text: lv, selected: lv === state.level ? '' : undefined })));
  levelSelect.value = state.level;
  levelSelect.addEventListener('change', () => { state.level = levelSelect.value; saveState(state); });

  const nav = el('div', { class: 'sp-nav' }, [
   el('button', { type: 'button', 'aria-current': 'page', text: 'Spelen' }),
   el('button', { type: 'button', text: 'Lessen' }),
   el('button', { type: 'button', text: 'Mijn collectie' }),
  ]);

  const settingsButton = el('button', { type: 'button', class: 'sp-icon-button', 'aria-label': 'Instellingen', html: icon('gear', 19),
   onclick: () => { document.getElementById('pp-settings-button')?.click(); } });

  const topbar = el('div', { class: 'sp-topbar' }, [
   el('div', { class: 'sp-brand' }, [el('span', { html: brandmark('#0090f2') })]),
   el('span', { class: 'sp-product-name', text: 'Digibord' }),
   nav,
   el('div', { class: 'sp-topbar-end' }, [
    el('span', { class: 'sp-context-pill', text: 'Thema 3 · Werk' }),
    levelSelect,
    settingsButton,
    el('button', { type: 'button', class: 'sp-close', onclick: () => close(), html: icon('chevronDown', 16) + ' Sluiten' }),
   ]),
  ]);

  const main = el('div', { class: 'sp-main' });
  const modules = BASE_MODULES.slice();
  const ctx = {
   modules,
   level: state.level,
   go: (id) => render(id),
   back: () => render('home'),
  };

  const SCREENS = { home: () => screenHome(ctx), taalworp: () => screenTaalworp(ctx), 'bouw-een-zin': () => screenBouwEenZin(ctx), verhaalworp: () => screenVerhaalworp(ctx) };
  // Module-tegels linken (waar al een schermbasis bestaat) naar hun spelpagina.
  const MODULE_TARGET = { dobbelspellen: 'taalworp', 'woorden-en-zinnen': 'bouw-een-zin' };
  ctx.go = (id) => render(MODULE_TARGET[id] || id);

  let route = 'home';
  function render(next) {
   route = SCREENS[next] ? next : 'home';
   clear(main);
   main.append(SCREENS[route]());
   overlay.dataset.route = route;
  }

  overlay.append(topbar, main);

  function open() { overlay.hidden = false; render('home'); document.getElementById('sp-open-trigger')?.setAttribute('aria-expanded', 'true'); }
  function close() { overlay.hidden = true; document.getElementById('sp-open-trigger')?.setAttribute('aria-expanded', 'false'); }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });

  document.body.append(overlay);

  return {
   open, close, overlay,
   get route() { return route; },
   go: (id) => ctx.go(id),
   addModule: (mod) => { modules.push(mod); if (route === 'home') render('home'); },
   __internal: { combineUniquePools, VERB_DECKS, VERB_DECKS_EXTRA, storySets, LEVELS },
  };
 }

 let instance = null;
 function ensure() {
  if (!instance) instance = build();
  return instance;
 }

 // Losstaande, vast gepositioneerde knop: geen kind van #pp-main-tools, om de bestaande
 // breedte-/naamzichtbaarheidsberekening van de KANDIDAAT-appmenu-integratie niet te raken.
 function mountTrigger() {
  if (document.getElementById('sp-open-trigger')) return;
  const button = el('button', { type: 'button', id: 'sp-open-trigger', class: 'sp-trigger-fab', title: 'Spelen', 'aria-label': 'Spelen', 'aria-expanded': 'false', html: icon('dice', 20) });
  button.addEventListener('click', () => ensure().open());
  document.body.append(button);
 }

 function init() {
  mountTrigger();
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

 return { open: () => ensure().open(), close: () => ensure().close(), ensure, get instance() { return instance; } };
})();
