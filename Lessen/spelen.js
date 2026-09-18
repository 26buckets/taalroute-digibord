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
  chat: '<path d="M4 5h16v11H9l-4 4V5Z"/>',
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
    NIVEAU (Prompt 3 §3/§4): niet langer een eigen lokale kopie. Herbruikt de centrale AppContext uit
    Lessen/spelen-context.js, zodat een niveauwijziging voor alle toekomstige activiteiten beschikbaar
    is via één plek — apart van de bestaande vier-niveau kaartroute (data.settings.route).
    ========================================================================================== */
 const AppContext = globalThis.TaalrouteSpelenContext;
 const ModuleRegistry = globalThis.TaalrouteModuleRegistry;
 const ActivityRegistry = globalThis.TaalrouteActivityRegistry;
 const SessionState = globalThis.TaalrouteSessionState;
 const LEVELS = AppContext.LEVELS;

 /* ==========================================================================================
    Startpaginaminiaturen: visuele voorproefjes van de echte spelwerking, geen betekenisloze iconen.
    Zuiver CSS/SVG-vormen (Prompt 1B §4) — geen externe beelden, geen nieuwe onderwijscontent.
    ========================================================================================== */
 function tileArtBoard() {
  return '<svg viewBox="0 0 120 64" width="88" height="64" aria-hidden="true">'
   + '<path d="M14 46 34 20 62 42 96 16" stroke="#c3ccd4" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="1 9"/>'
   + '<circle cx="14" cy="46" r="8" fill="#176b9a"/>'
   + '<rect x="26" y="12" width="16" height="16" rx="2" fill="#a44932"/>'
   + '<path d="M62 28 74 50H50Z" fill="#407354"/>'
   + '<path d="M96 4 108 16 96 28 84 16Z" fill="#8a6426"/>'
   + '</svg>';
 }
 function tileArtDice() {
  return '<svg viewBox="0 0 96 64" width="88" height="64" aria-hidden="true">'
   + '<rect x="6" y="20" width="30" height="30" rx="7" fill="#2f6fb0"/>'
   + '<rect x="34" y="8" width="30" height="30" rx="7" fill="#c0392b"/>'
   + '<rect x="62" y="24" width="30" height="30" rx="7" fill="#2f7d5b"/>'
   + '</svg>';
 }
 function tileArtCards() {
  return '<svg viewBox="0 0 88 64" width="76" height="64" aria-hidden="true">'
   + '<rect x="30" y="4" width="40" height="52" rx="5" fill="#e4e9ee"/>'
   + '<rect x="18" y="10" width="40" height="52" rx="5" fill="#c7d2da"/>'
   + '<rect x="6" y="16" width="40" height="52" rx="5" fill="#fff" stroke="#b9c4cd" stroke-width="2"/>'
   + '<path d="M14 26h24M14 34h24M14 42h16" stroke="#8a99a6" stroke-width="3" stroke-linecap="round"/>'
   + '</svg>';
 }
 function tileArtWords() {
  return '<svg viewBox="0 0 100 60" width="88" height="52" aria-hidden="true">'
   + '<rect x="2" y="16" width="34" height="28" rx="5" fill="#fff" stroke="#b9c4cd" stroke-width="2"/>'
   + '<rect x="40" y="2" width="26" height="28" rx="5" fill="#fff" stroke="#b9c4cd" stroke-width="2"/>'
   + '<rect x="70" y="22" width="28" height="28" rx="5" fill="#fff" stroke="#b9c4cd" stroke-width="2"/>'
   + '<path d="M8 30h22M46 16h14M76 36h16" stroke="#4b6577" stroke-width="3" stroke-linecap="round"/>'
   + '</svg>';
 }

 /* ==========================================================================================
    MODULEREGISTER voor de Spelen-startpagina. Uitbreidbaar: de grid veronderstelt geen vast aantal.
    ========================================================================================== */
 const BASE_MODULES = [
  { id: 'speelborden', label: 'Speelborden', desc: 'Reis door Nederland en oefen taal in echte situaties.', art: tileArtBoard() },
  { id: 'dobbelspellen', label: 'Dobbelspellen', desc: 'Gooi, combineer en maak taal.', art: tileArtDice() },
  { id: 'kaartspellen', label: 'Kaartspellen', desc: 'Praat, denk en oefen met kaarten.', art: tileArtCards() },
  { id: 'woorden-en-zinnen', label: 'Woorden & zinnen', desc: 'Bouw, orden en ontdek taal.', art: tileArtWords() },
 ];

 /* Prompt 3 §7: de startpagina moet uit deze centrale registry lezen, niet uit een lokale kopie — zo
    kunnen vijf, zes of zeven modules technisch worden ondersteund zonder wijziging aan de renderer.
    Bestaande labels/beschrijvingen/miniaturen hierboven worden hergebruikt, niet herschreven. */
 for (const mod of BASE_MODULES) {
  TaalrouteModuleRegistry.register({ id: mod.id, label: mod.label, description: mod.desc, desc: mod.desc, icon: mod.art, art: mod.art });
 }

 /* Prompt 3 §8: technisch contract per activiteit — metadata/capabilities, geen onderwijsinhoud.
    "status" volgt de werkelijke staat: 'ui-only' waar nog geen echte inhoud is aangesloten,
    'legacy-iframe-adapter' voor Speelborden (zie BoardAdapter hieronder). Verhaalworp heeft nog geen
    starttegel-ingang (geen MODULE_TARGET-koppeling); moduleId blijft eerlijk null in plaats van gegokt. */
 TaalrouteActivityRegistry.define({
  id: 'taalworp', gameFamily: 'dice-sentence', moduleId: 'dobbelspellen', title: 'Taalworp',
  supportedLevels: LEVELS.slice(), themeIds: [], sectorIds: [], participationModes: ['classroom'],
  capabilities: ['help', 'example', 'extraChallenge'], renderer: 'taalworp', status: 'ui-only',
 });
 TaalrouteActivityRegistry.define({
  id: 'bouw-een-zin', gameFamily: 'sentence-build', moduleId: 'woorden-en-zinnen', title: 'Bouw een zin',
  supportedLevels: LEVELS.slice(), themeIds: [], sectorIds: [], participationModes: ['classroom', 'live'],
  capabilities: ['help', 'example', 'extraChallenge', 'classroom', 'live', 'results'], renderer: 'bouw-een-zin', status: 'ui-only',
 });
 TaalrouteActivityRegistry.define({
  id: 'verhaalworp', gameFamily: 'image-dice-story', moduleId: null, title: 'Verhaalworp',
  supportedLevels: LEVELS.slice(), themeIds: [], sectorIds: [], participationModes: ['classroom'],
  capabilities: ['help', 'example', 'extraChallenge', 'image'], renderer: 'verhaalworp', status: 'ui-only',
 });
 TaalrouteActivityRegistry.define({
  id: 'speelborden', gameFamily: 'board', moduleId: 'speelborden', title: 'Speelborden',
  supportedLevels: LEVELS.slice(), themeIds: [], sectorIds: [], participationModes: ['classroom'],
  capabilities: ['help', 'example', 'extraChallenge'], renderer: 'speelbord', status: 'legacy-iframe-adapter',
 });

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

 // Voorbeeld en Extra uitdaging zijn vaste, altijd zichtbare onderdelen van de GameActionBar (Prompt 1B §8).
 // Zonder aangeleverde fixtureinhoud tonen ze een expliciete ontwikkelplaceholder in plaats van te verdwijnen
 // of een verzonnen Nederlandse tekst te tonen (Prompt 1B §13/§14).
 function PreviewButton(content) {
  const panel = el('div', { class: 'sp-content-panel', text: content || 'Voorbeeld nog niet gevuld.' });
  panel.hidden = true;
  const button = el('button', { type: 'button', class: 'sp-btn', 'data-fixture': String(!!content), html: icon('eye', 17) + ' Voorbeeld', onclick: () => { panel.hidden = !panel.hidden; } });
  return { button, panel };
 }

 function ChallengeButton(content) {
  const panel = el('div', { class: 'sp-content-panel', text: content || 'Extra uitdaging nog niet gevuld.' });
  panel.hidden = true;
  const button = el('button', { type: 'button', class: 'sp-btn sp-btn-star', 'data-fixture': String(!!content), html: icon('star', 17) + ' Extra uitdaging', onclick: () => { panel.hidden = !panel.hidden; } });
  return { button, panel };
 }

 /* GameActionBar: vaste volgorde Voorbeeld -> primaire actie -> Extra uitdaging -> maximaal twee
    contextacties. Voorbeeld/Extra uitdaging staan er altijd (met placeholder zonder inhoud); een
    contextactie mag optioneel een eigen toggle-paneel krijgen (panelText) voor een ontwikkelplaceholder
    wanneer de onderliggende functie nog niet bestaat — nooit een verzonnen inhoudelijke tekst. */
 function GameActionBar({ preview, primary, challenge, context = [] } = {}) {
  const bar = el('div', { class: 'sp-action-bar' });
  const previewCmp = PreviewButton(preview);
  const challengeCmp = ChallengeButton(challenge);
  const panels = [previewCmp.panel, challengeCmp.panel];
  const rendered = [previewCmp.button];
  if (primary) rendered.push(el('button', { type: 'button', class: 'sp-btn sp-btn-primary', ...(primary.attrs || {}), onclick: primary.onClick, text: primary.label }));
  rendered.push(challengeCmp.button);
  for (const action of context.slice(0, 2)) {
   let panel = null;
   if (action.panelText !== undefined) {
    panel = el('div', { class: 'sp-content-panel', text: action.panelText });
    panel.hidden = true;
    panels.push(panel);
   }
   rendered.push(el('button', {
    type: 'button', class: 'sp-btn', 'data-fixture': panel ? 'false' : undefined, ...(action.attrs || {}),
    onclick: () => { action.onClick?.(); if (panel) panel.hidden = !panel.hidden; },
    html: (action.icon ? icon(action.icon, 17) : '') + ' ' + action.label,
   }));
  }
  bar.append(...rendered);
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

 /* ==========================================================================================
    Prompt 3 §11/§12 — GamePage-contract: een spelpagina levert generieke, door redesign herplaatsbare
    gegevens (title/description/icon/actions met generieke id's/capabilities/levelContext/lessonContext/
    participationMode/content/sessionState) in plaats van zelf visuele posities te kiezen. Deze functie
    is de vertaling naar de huidige, tijdelijke visuele laag (GamePageShell + GameActionBar); een latere
    redesign kan uitsluitend déze vertaalfunctie vervangen zonder dat spelcode verandert. Bestaande
    schermen die nog rechtstreeks GamePageShell/GameActionBar aanroepen blijven werken — dit contract is
    optioneel, niet verplicht, om regressie op bestaande schermen te vermijden. */
 function GamePage({ title, description, icon: iconSvg, actions = [], capabilities = [], levelContext, lessonContext, participationMode, content, sessionState, onBack }) {
  const byId = {};
  for (const a of actions) if (a && a.id) byId[a.id] = a;
  const primaryAction = byId.primary ? { label: byId.primary.label, onClick: byId.primary.onClick, attrs: byId.primary.attrs } : null;
  // 'back' wordt al structureel door GamePageShell's vaste Terug-knop gedekt; 'help' door de vaste
  // Uitleg-knop hierboven. Beide worden hier bewust niet nogmaals als contextactie gerenderd.
  const contextActions = actions
   .filter((a) => a && a.id && !['example', 'extraChallenge', 'primary', 'back', 'help'].includes(a.id))
   .slice(0, 2)
   .map((a) => ({ label: a.label, icon: a.icon, onClick: a.onClick, panelText: a.panelText, attrs: a.attrs }));
  const { shell, body } = GamePageShell({
   iconSvg, name: title, description, contextBadges: [], explain: byId.help?.content, onBack,
  });
  const actionBar = GameActionBar({ preview: byId.example?.content, primary: primaryAction, challenge: byId.extraChallenge?.content, context: contextActions });
  return { shell, body, actionBar, capabilities, levelContext, lessonContext, participationMode, content, sessionState };
 }

 /* ParticipationModeSwitch: alleen relevant bij activiteiten die zowel classroom als live ondersteunen.
    Neemt de technische deelnamevorm-id's uit de centrale AppContext/ActivityRegistry (Prompt 3 §10) aan
    — niet de zichtbare labels — zodat de identiteit niet langer van de getoonde tekst afhangt. */
 const PARTICIPATION_LABELS = { classroom: 'Klassikaal', live: 'Live' };
 function ParticipationModeSwitch({ modes = ['classroom', 'live'], value, onChange }) {
  const wrap = el('div', { class: 'sp-mode-switch', role: 'group', 'aria-label': 'Deelnamevorm' });
  let current = modes.includes(value) ? value : modes[0];
  const buttons = modes.map((m) => el('button', {
   type: 'button', 'aria-pressed': String(m === current), text: PARTICIPATION_LABELS[m] || m, 'data-mode': m,
   onclick: () => { current = m; for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.mode === current)); onChange?.(current); },
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
  // Prompt 3 §7: bron van waarheid is de centrale ModuleRegistry, niet een lokale kopie — een vijfde,
  // zesde of zevende module verschijnt hier zonder wijziging aan deze renderer.
  for (const mod of ModuleRegistry.list()) grid.append(drawTile(mod));
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
   context: [{ label: 'Wisselen', icon: 'refresh', panelText: 'Wisselen: nog niet gebouwd.' }],
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
  // Prompt 3 §10: de aangeboden deelnamevormen volgen uit de activiteit-capabilities, niet uit een
  // vaste lijst per scherm — een activiteit zonder 'live'-capability zou hier nooit Live aanbieden.
  const allowedModes = ActivityRegistry.participationModesFor('bouw-een-zin');
  let mode = allowedModes.includes(AppContext.getState().participationMode) ? AppContext.getState().participationMode : allowedModes[0];
  const modeSwitch = ParticipationModeSwitch({ modes: allowedModes, value: mode, onChange: (m) => { mode = m; livePanel.hidden = m !== 'live'; AppContext.setParticipationMode(m); } });
  const zone = el('div', { class: 'sp-sentence-zone', 'data-empty': 'true' });
  // Beschikbare woorden en gelegde zin zijn twee losse, visueel onderscheiden zones (Prompt 1B §10):
  // elk woord bestaat als precies twee gekoppelde knoppen (bron + geplaatst), zonder losse querySelector-koppeling.
  const tiles = BUILD_WORDS.map((word) => {
   let placedTile = null;
   const sourceTile = el('button', { type: 'button', class: 'sp-word-tile sp-word-tile-source', text: word, onclick: () => {
    if (sourceTile.dataset.placed === 'true') return;
    sourceTile.dataset.placed = 'true';
    zone.dataset.empty = 'false';
    placedTile = el('button', { type: 'button', class: 'sp-word-tile sp-word-tile-placed', text: word, onclick: () => {
     sourceTile.dataset.placed = 'false';
     placedTile.remove();
     if (!zone.children.length) zone.dataset.empty = 'true';
    } });
    zone.append(placedTile);
   } });
   return sourceTile;
  });
  const availableLabel = el('div', { class: 'sp-deck-label', text: 'Beschikbare woorden' });
  const words = el('div', { class: 'sp-word-row' }, [...tiles, el('button', { type: 'button', class: 'sp-word-tile sp-word-tile-source', text: '…' })]);
  const zoneLabel = el('div', { class: 'sp-deck-label', text: 'Jouw zin' });
  const results = ResultsPanel();
  const livePanel = el('div', { class: 'sp-live-panel' }, [
   el('div', { class: 'sp-qr-placeholder', html: icon('qr', 40) }),
   el('div', {}, [el('strong', { text: 'Live meedoen' }), el('div', { text: 'Laat cursisten op hun telefoon dezelfde opdracht maken.' })]),
   el('div', {}, [el('span', { text: 'Ga naar taalroute.live · Code: ' }), el('code', { text: '7K3P' })]),
   results,
  ]);
  livePanel.hidden = mode !== 'live';
  const actionBar = GameActionBar({
   preview: null,
   primary: { label: 'Controleer volgorde', onClick: () => {} },
   challenge: null,
   context: [{ label: 'Bespreek samen', icon: 'chat', panelText: 'Bespreek samen: nog niet gebouwd.' }],
  });
  const layout = el('div', { class: 'sp-build-layout' }, [
   el('div', { class: 'sp-build-main' }, [availableLabel, words, zoneLabel, zone]),
   livePanel,
  ]);
  body.append(layout, actionBar.node, ...actionBar.panels);
  shell.__modeSwitch = modeSwitch;
  shell.__livePanel = livePanel;
  body.prepend(modeSwitch);
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
    Speelborden (Prompt 2). Bouwt GEEN nieuwe speelbordmotor: de bestaande motor draait
    onveranderd in Praatpad.html zelf (dobbelwerking, pionlogica, routes/tunnels, kaartopening,
    opslag/hervatten). Deze schermen zijn uitsluitend de nieuwe gemeenschappelijke huisvesting
    eromheen: een schaalbare werelden-bibliotheek en een GamePageShell die het bestaande bord
    via een same-origin <iframe> op "Praatpad.html?kaart=<id>&embed=spelen" toont. De
    "embed=spelen"-vlag is de enige wijziging aan Praatpad.html: die verbergt uitsluitend de
    eigen kopregel van die pagina via CSS (html[data-pp-embed="spelen"]) zodat er geen twee
    headers zichtbaar zijn — géén enkele regel dobbel-, positie-, route- of opslaglogica is
    aangeraakt. Zie de Prompt 2-oplevering voor de volledige onderzoeksbasis van deze keuze.
    ========================================================================================== */

 function screenSpeelborden(ctx) {
  const { shell, body } = GamePageShell({
   iconSvg: icon('board', 26), name: 'Speelborden', description: 'Kies een bestaande wereld en speel de route.',
   contextBadges: [], explain: 'Content nog aan te leveren', onBack: ctx.back,
  });
  // Uitsluitend daadwerkelijk geregistreerde werelden (Kaarten/register.js); geen verzonnen werelden,
  // geen layout die een vast aantal veronderstelt (§13).
  const maps = globalThis.DigiBoardMaps || [];
  const categories = globalThis.DigiBoardMapLibrary?.categories || [];
  let activeCategory = 'alle';
  const grid = el('div', { class: 'sp-world-grid' });
  function worldTile(m) {
   return el('button', { type: 'button', class: 'sp-world-tile', onclick: () => ctx.openWorld(m.id) }, [
    el('div', { class: 'sp-world-thumb' }, [m.image ? el('img', { src: m.image, alt: '', loading: 'lazy' }) : null]),
    el('div', { class: 'sp-world-body' }, [
     el('strong', { text: m.label }),
     el('span', { class: 'sp-world-meta', text: `${m.count} vakken` }),
    ]),
   ]);
  }
  function drawGrid() {
   clear(grid);
   const visible = maps.filter((m) => activeCategory === 'alle' || globalThis.DigiBoardMapLibrary?.includes(m, activeCategory));
   for (const m of visible) grid.append(worldTile(m));
  }
  const allTab = el('button', { type: 'button', 'aria-pressed': 'true', text: 'Alle' });
  const tabs = el('div', { class: 'sp-world-tabs', role: 'group', 'aria-label': 'Categorie' }, [
   allTab,
   ...categories.map((c) => el('button', { type: 'button', 'aria-pressed': 'false', text: c.label })),
  ]);
  for (const btn of tabs.children) btn.addEventListener('click', () => {
   activeCategory = btn === allTab ? 'alle' : categories.find((c) => c.label === btn.textContent)?.id || 'alle';
   for (const b of tabs.children) b.setAttribute('aria-pressed', String(b === btn));
   drawGrid();
  });
  drawGrid();
  body.append(tabs, grid);
  shell.__grid = grid;
  return shell;
 }

 function screenSpeelbord(ctx, mapId) {
  const map = (globalThis.DigiBoardMaps || []).find((m) => m.id === mapId);
  const activity = ActivityRegistry.get('speelborden');
  const appState = AppContext.getState();
  const { shell, body, actionBar } = GamePage({
   iconSvg: icon('board', 26), title: map?.label || 'Speelbord', description: '',
   actions: [], capabilities: activity?.capabilities || [],
   levelContext: appState.level, lessonContext: appState.lessonContext, participationMode: appState.participationMode,
   content: map ? { mapId: map.id } : null, sessionState: null,
   onBack: () => { ctx.setBoardFrame(null); ctx.go('speelborden'); },
  });
  if (!map) {
   ctx.setBoardFrame(null);
   body.append(el('div', { class: 'sp-content-panel', text: 'Geen wereld geselecteerd. Ga terug naar de bibliotheek.' }));
  } else {
   // Same-origin iframe: hergebruikt de bestaande, ongewijzigde bordmotor (dobbelsteen, pionnen,
   // routes/tunnels, kaartopening, opslag/hervatten) één-op-één. Geen tweede bordimplementatie.
   const frame = el('iframe', {
    class: 'sp-board-frame', title: `Speelbord: ${map.label}`,
    src: `Praatpad.html?kaart=${encodeURIComponent(map.id)}&embed=spelen`,
   });
   body.append(el('div', { class: 'sp-board-wrap' }, [frame]));
   ctx.setBoardFrame(frame);
  }
  body.append(actionBar.node, ...actionBar.panels);
  return shell;
 }

 /* ==========================================================================================
    App shell: bovenbalk, navigatie en router tussen de schermen hierboven.
    ========================================================================================== */
 function build() {
  const state = AppContext.getState();
  const overlay = el('div', { id: 'sp-overlay', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Spelen' });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) overlay.dataset.motion = 'reduce';

  // Prompt 3 §4: het niveau leeft nu in de centrale AppContext. Een wijziging via deze selector is
  // uitsluitend de globale voorkeur; een al lopende sessie bewaart apart haar eigen levelAtStart.
  const levelSelect = el('select', { class: 'sp-level-select', 'aria-label': 'Niveau' }, LEVELS.map((lv) => el('option', { value: lv, text: lv, selected: lv === state.level ? '' : undefined })));
  levelSelect.value = state.level;
  levelSelect.addEventListener('change', () => { AppContext.setLevel(levelSelect.value); });
  AppContext.subscribe((next) => { if (levelSelect.value !== next.level) levelSelect.value = next.level; });

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
  let currentBoardFrame = null;
  let currentWorldId = null;
  let currentSession = null;
  const ctx = {
   go: (id) => render(id),
   back: () => render('home'),
   openWorld: (mapId) => render('speelbord', { mapId }),
   // Speelbord-scherm meldt hier zijn iframe (of null) aan, zodat de BoardAdapter er zonder DOM-
   // scraping bij kan zonder dat het scherm zelf iets van build()'s interne state hoeft te kennen.
   setBoardFrame: (frame) => { currentBoardFrame = frame || null; },
  };

  const SCREENS = {
   home: () => screenHome(ctx),
   taalworp: () => screenTaalworp(ctx),
   'bouw-een-zin': () => screenBouwEenZin(ctx),
   verhaalworp: () => screenVerhaalworp(ctx),
   speelborden: () => screenSpeelborden(ctx),
   speelbord: (params) => screenSpeelbord(ctx, params?.mapId),
  };
  // Module-tegels linken (waar al een schermbasis bestaat) naar hun spelpagina.
  const MODULE_TARGET = { dobbelspellen: 'taalworp', 'woorden-en-zinnen': 'bouw-een-zin' };
  const ROUTE_ACTIVITY = { taalworp: 'taalworp', 'bouw-een-zin': 'bouw-een-zin', verhaalworp: 'verhaalworp', speelbord: 'speelborden' };
  ctx.go = (id) => render(MODULE_TARGET[id] || id);
  ctx.openWorld = (mapId) => { currentWorldId = mapId; render('speelbord', { mapId }); };

  let route = 'home';
  function render(next, params) {
   route = SCREENS[next] ? next : 'home';
   if (route !== 'speelbord') currentBoardFrame = null;
   clear(main);
   main.append(SCREENS[route](params));
   overlay.dataset.route = route;
   // Prompt 3 §3/§16: elke routewissel houdt de centrale AppContext bij (huidige pagina, module,
   // actieve activiteit/wereld) — puur technisch bijhouden, geen navigatielogica in de activiteiten zelf.
   AppContext.setPage(route);
   const moduleForRoute = ModuleRegistry.list().find((m) => (MODULE_TARGET[m.id] || m.id) === route)?.id || null;
   AppContext.setActiveModule(moduleForRoute);
   const activityId = ROUTE_ACTIVITY[route] || null;
   AppContext.setActiveActivity(activityId);
   AppContext.setActiveWorld(route === 'speelbord' ? currentWorldId : null);
   if (activityId) {
    currentSession = SessionState.start({
     activityId, worldId: route === 'speelbord' ? currentWorldId : null,
     level: AppContext.getState().level, participationMode: AppContext.getState().participationMode,
    });
    AppContext.setSessionId(activityId + ':' + currentSession.startedAt);
   } else {
    currentSession = null;
    AppContext.setSessionId(null);
   }
  }

  overlay.append(topbar, main);

  function open() { overlay.hidden = false; render('home'); document.getElementById('sp-open-trigger')?.setAttribute('aria-expanded', 'true'); }
  function close() { overlay.hidden = true; document.getElementById('sp-open-trigger')?.setAttribute('aria-expanded', 'false'); }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });

  document.body.append(overlay);

  /* Prompt 3 §13: dun contract rond de bestaande, ongewijzigde iframe-koppeling naar de speelbordmotor.
     Expliciet gemarkeerd als legacy-compatibility-adapter (status). getSessionState leest de bestaande,
     stabiele opslagconventie (dezelfde sleutel als DigiBoard.storageKey()) rechtstreeks — geen
     DOM-scraping van de ingebedde pagina voor businesslogica. Functies die de bestaande motor nog geen
     uitbreidingspunt voor biedt (taakopening/positiewijziging als events) blijven bewust `undefined` in
     plaats van een nep-implementatie: feature-detection, geen herschrijving van de bestaande motor. */
  const boardAdapter = Object.freeze({
   status: 'legacy-iframe-adapter',
   openWorld: (mapId) => ctx.openWorld(mapId),
   closeWorld: () => ctx.go('speelborden'),
   getWorldId: () => currentWorldId,
   getSessionState: () => {
    if (!currentWorldId) return null;
    try {
     const raw = localStorage.getItem(`taalroute-digiboard-les-${currentWorldId}-v1`);
     return raw ? JSON.parse(raw) : null;
    } catch { return null; }
   },
   resume: () => { if (currentWorldId) ctx.openWorld(currentWorldId); },
   hasFrame: () => !!currentBoardFrame,
   // Nog niet beschikbaar: de bestaande motor biedt hiervoor nog geen stabiel uitbreidingspunt.
   openTask: undefined,
   onTaskOpened: undefined,
   onPositionChanged: undefined,
  });

  return {
   open, close, overlay,
   get route() { return route; },
   go: (id) => ctx.go(id),
   openWorld: (mapId) => ctx.openWorld(mapId),
   addModule: (mod) => { ModuleRegistry.register(mod); if (route === 'home') render('home'); },
   boardAdapter,
   context: AppContext,
   moduleRegistry: ModuleRegistry,
   activityRegistry: ActivityRegistry,
   get currentSession() { return currentSession; },
   __internal: { combineUniquePools, VERB_DECKS, VERB_DECKS_EXTRA, storySets, LEVELS, GamePage },
  };
 }

 let instance = null;
 function ensure() {
  if (!instance) instance = build();
  return instance;
 }

 /* ---------- Prompt 1B §2 — onderzoek naar een veilige koppeling met de bestaande DigiBoard-header ----------
    Bevinding: Lessen/appmenu.js bewaakt de zichtbare breedte van #pp-main-tools en de merknaam via een
    ResizeObserver (zijn layout()-functie, "compact"-modus). Dat is precies waarom de Spelen-knop tijdens
    Prompt 1 die berekening brak toen hij daar kind van werd (herstel in Prompt 1A: losgekoppeld, vast
    gepositioneerd). Twee kansrijke, veilige routes naar één echte hoofdnavigatie-item "Spelen" — geen van
    beide dit Prompt 1B-rond gebouwd, om dat risico niet zonder eigen regressietest opnieuw te lopen:
     1) Een eigen <details>-item aan #pp-main-tools toevoegen, zoals appmenu.js dat zelf al doet voor zijn
        "Bediening"-paneel (zijn "tr-controls"). Dat patroon wordt al mee bewaakt door de bestaande
        layout()/ResizeObserver-berekening (via zijn "items"-lijst), dus zou niet opnieuw breken.
     2) appmenu.js zelf een klein, expliciet uitbreidingspunt laten bieden (bv. window.TaalrouteAppMenu met
        een registratiefunctie) waarmee Lessen/spelen.js zich veilig in .pp-brand/de navigatie kan haken
        zonder zelf de breedte-berekening te hoeven kennen.
    Optie 1 is de kleinste, laagste-risico stap; optie 2 is schoner maar vereist een gerichte wijziging aan
    appmenu.js zelf, met een eigen test. De zwevende trigger-knop hieronder blijft tot een van beide routes
    is doorgevoerd de tijdelijke ontwikkeltoegang (Prompt 1A/1B), niet de definitieve integratie. */

 // Losstaande, vast gepositioneerde knop: geen kind van #pp-main-tools, om de bestaande
 // breedte-/naamzichtbaarheidsberekening van de KANDIDAAT-appmenu-integratie niet te raken.
 function mountTrigger() {
  if (document.getElementById('sp-open-trigger')) return;
  const button = el('button', { type: 'button', id: 'sp-open-trigger', class: 'sp-trigger-fab', title: 'Spelen', 'aria-label': 'Spelen', 'aria-expanded': 'false', html: icon('dice', 20) });
  button.addEventListener('click', () => {
   try { ensure().open(); } catch (err) { console.error('[Lessen/spelen.js] Kon de Spelen-overlay niet openen.', err); }
  });
  document.body.append(button);
 }

 // Defensieve initialisatie: dit is een optionele, additieve module. Een onverwachte fout hierin mag de
 // rest van de al geladen kernapp niet raken en mag zichzelf niet herhalen; log eenmalig een duidelijke
 // ontwikkelfout in plaats van de fout te maskeren of stil te negeren.
 function init() {
  // Prompt 2: wanneer deze pagina zelf al gehuisvest is in een andere Spelen-omgeving
  // (Kaarten-iframe vanuit Lessen/spelen.js's eigen Speelbord-scherm, ?embed=spelen), moet er geen
  // geneste "Spelen"-toegang bovenop het bord verschijnen. Puur additief: buiten deze expliciete
  // vlag om verandert er niets aan het bestaande gedrag.
  if (document.documentElement.dataset.ppEmbed === 'spelen') return;
  try {
   mountTrigger();
  } catch (err) {
   console.error('[Lessen/spelen.js] Kon de Spelen-uitbreiding niet initialiseren; de bestaande DigiBoard-app blijft ongemoeid.', err);
  }
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

 return { open: () => ensure().open(), close: () => ensure().close(), ensure, get instance() { return instance; } };
})();
