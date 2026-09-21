/* Shared DigiBord card table; speaking first, arranging words optional. */
const WORD_EXERCISES = [
 ['build', 'Bouw een zin', 'Woorden ordenen'], ['make', 'Maak en verander', 'Een zin aanpassen'],
 ['guess', 'Beschrijf en raad', 'Omschrijven en raden'], ['combine', 'Combineer en beschrijf', 'Begrippen verbinden']
];
const WORD_CARDS = [
 {
  "structure": "Hoofdzin",
  "answer": "Mijn zus leest een boek in de tuin.",
  "hint": "Wie leest? Begin daarmee.",
  "variation": "Maak een zin over iets wat jij leest.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "De afspraak bij de huisarts is om tien uur.",
  "hint": "Begin met “De afspraak bij de huisarts”.",
  "variation": "Verander het tijdstip van de afspraak.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "Ik koop groente op de markt.",
  "hint": "Wat doe ik? Zet dat na “Ik”.",
  "variation": "Vertel wat jij op de markt koopt.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "De kinderen spelen buiten.",
  "hint": "Wie spelen er? Zet daarna wat zij doen.",
  "variation": "Verander de plaats waar de kinderen spelen.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "Mijn broer werkt in een winkel.",
  "hint": "Begin met “Mijn broer”. Wat doet hij?",
  "variation": "Maak de zin over iemand die jij kent.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "Wij eten samen aan tafel.",
  "hint": "Begin met “Wij”. Zoek daarna het werkwoord.",
  "variation": "Vertel waar jij meestal eet.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "De bus stopt bij het station.",
  "hint": "Wat stopt er? Begin daarmee.",
  "variation": "Verander de plaats waar de bus stopt.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "Sara belt haar moeder.",
  "hint": "Wie belt wie? Begin met “Sara”.",
  "variation": "Vertel wie jij weleens belt.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "De buurman maakt zijn fiets schoon.",
  "hint": "“Schoonmaken” wordt hier “maakt … schoon”.",
  "variation": "Vertel wat jij schoonmaakt.",
  "prefix": ""
 },
 {
  "structure": "Hoofdzin",
  "answer": "Ik wil Nederlands leren.",
  "hint": "Na “Ik” komt “wil”. “Leren” staat achteraan.",
  "variation": "Vertel wat jij nog wilt leren.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Morgen ga ik met de trein naar Rotterdam.",
  "hint": "Begin met “Morgen”. Daarna komt “ga”.",
  "variation": "Begin dezelfde zin met “Ik”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Vandaag koopt mijn buurman brood bij de bakker.",
  "hint": "Na “Vandaag” komt “koopt”. Wie koopt het brood?",
  "variation": "Begin dezelfde zin met “Mijn buurman”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Na het werk drinken wij samen koffie.",
  "hint": "“Na het werk” hoort bij elkaar. Daarna komt “drinken”.",
  "variation": "Vertel wat jullie na het werk doen.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Wij gaan zaterdag met de bus naar school.",
  "hint": "Bouw de zin eerst met “Wij”. Probeer daarna “Zaterdag”.",
  "variation": "Begin dezelfde zin met “Zaterdag”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Om acht uur begint de les.",
  "hint": "Houd “Om acht uur” bij elkaar. Daarna komt “begint”.",
  "variation": "Begin dezelfde zin met “De les”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "In de keuken maakt Amir soep.",
  "hint": "Begin met de plaats. Daarna komt “maakt”.",
  "variation": "Begin dezelfde zin met “Amir”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Op maandag sport ik met mijn vriendin.",
  "hint": "Na “Op maandag” komt “sport”.",
  "variation": "Vertel wat jij op maandag doet.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Vanavond kijken we naar een film.",
  "hint": "Begin met “Vanavond”. Waar komt “we”?",
  "variation": "Begin dezelfde zin met “We”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Bij de bushalte wacht een vrouw.",
  "hint": "Begin met “Bij de bushalte”. Wat gebeurt daar?",
  "variation": "Begin dezelfde zin met “Een vrouw”.",
  "prefix": ""
 },
 {
  "structure": "Andere start",
  "answer": "Na de les doe ik boodschappen.",
  "hint": "Begin met “Na de les”. Daarna komt “doe”.",
  "variation": "Vertel wat jij na de les doet.",
  "prefix": ""
 },
 {
  "structure": "Bijzin",
  "answer": "Ik neem een paraplu mee, omdat het regent.",
  "hint": "“Omdat” geeft de reden. Daarna: “het regent”.",
  "variation": "Bedenk een andere reden om een paraplu mee te nemen.",
  "prefix": "Ik neem een paraplu mee,"
 },
 {
  "structure": "Bijzin",
  "answer": "Sara gaat vroeg naar bed, omdat ze morgen werkt.",
  "hint": "Zet “werkt” achteraan in de bijzin.",
  "variation": "Bedenk een andere reden waarom Sara vroeg naar bed gaat.",
  "prefix": "Sara gaat vroeg naar bed,"
 },
 {
  "structure": "Bijzin",
  "answer": "Ik denk dat de winkel open is.",
  "hint": "Na “dat” komt de mededeling. “Is” staat achteraan.",
  "variation": "Maak een eigen zin die begint met “Ik denk dat”.",
  "prefix": "Ik denk"
 },
 {
  "structure": "Bijzin",
  "answer": "De docent zegt dat de les om negen uur begint.",
  "hint": "Zet “begint” achteraan in het deel met “dat”.",
  "variation": "Verander het tijdstip waarop de les begint.",
  "prefix": "De docent zegt"
 },
 {
  "structure": "Bijzin",
  "answer": "We gaan wandelen als het droog is.",
  "hint": "Het deel met “als” eindigt op “is”.",
  "variation": "Vertel wat jullie doen als het regent.",
  "prefix": "We gaan wandelen"
 },
 {
  "structure": "Bijzin",
  "answer": "Ik bel je als ik thuis ben.",
  "hint": "Na “als” komt “ik”. “Ben” staat achteraan.",
  "variation": "Vertel wanneer jij iemand belt.",
  "prefix": "Ik bel je"
 },
 {
  "structure": "Bijzin",
  "answer": "Amir kookt terwijl zijn dochter de tafel dekt.",
  "hint": "Wat gebeurt tegelijk? Eindig met “dekt”.",
  "variation": "Bedenk twee andere dingen die tegelijk gebeuren.",
  "prefix": "Amir kookt"
 },
 {
  "structure": "Bijzin",
  "answer": "Ik luister naar muziek terwijl ik de afwas doe.",
  "hint": "Het deel met “terwijl” eindigt op “doe”.",
  "variation": "Vertel wat jij doet terwijl je naar muziek luistert.",
  "prefix": "Ik luister naar muziek"
 },
 {
  "structure": "Bijzin",
  "answer": "Ik ontbijt voordat ik naar mijn werk ga.",
  "hint": "Eindig het deel met “voordat” met “ga”.",
  "variation": "Vertel wat jij doet voordat je naar buiten gaat.",
  "prefix": "Ik ontbijt"
 },
 {
  "structure": "Bijzin",
  "answer": "We controleren het adres voordat we vertrekken.",
  "hint": "Wat doen we eerst? Wat gebeurt daarna?",
  "variation": "Vertel wat jullie nog meer doen voordat jullie vertrekken.",
  "prefix": "We controleren het adres"
 }
];
let wordRound = null, wordBusy = false;
function sentenceContent(state = wordRound) {
 const card = WORD_CARDS[(state.round - 1) % WORD_CARDS.length];
 const prefix = state.wholeSentence ? '' : card.prefix;
 const words = card.answer.slice(prefix.length).trim().split(' ');
 return {...card, prefix, words, order: words.map((_, id) => id)};
}
function ExerciseNavigation(active) {
 return `<aside class="cardtypes activity-navigation"><h3>Oefenvormen</h3><nav aria-label="Oefenvormen">${WORD_EXERCISES.map(([id, label, description], i) => `<button class="typebtn ${id === active ? 'active' : ''}" ${id === active ? 'aria-current="page"' : 'disabled'}>${gameIcon(['verbs','spelling','conversation','puzzles'][i])}<span>${label}<small>${description}${id !== 'build' ? ' · Binnenkort' : ''}</small></span></button>`).join('')}</nav></aside>`;
}
function ActivityHeader() {
 return `<div class="card-activity-heading"><div><h1>Woorden &amp; zinnen <span>${WORD_CARDS.length} kaarten</span></h1><p>Overleg samen. Zeg je zin. Luister naar elkaar.</p></div></div>`;
}
function FeedbackPanel() {
 return '<div class="supportbox activity-feedback" id="wordFeedback" role="status" aria-live="polite" aria-atomic="true" hidden></div>';
}
function WordsAndSentencesActivityShell({active, name, title, instruction, workspace, counter, structure, color = '#176b9a'}) {
 const cardColor = safeColor(color);
 const cover = playCardBack(name, 'Woorden & zinnen', 'verbs', `${WORD_CARDS.length} kaarten`, cardColor).replace(gameIcon('verbs'), '<span class="word-deck-symbol" aria-hidden="true">Aa</span>');
 return `<div class="game-shell card-table-shell words-activity" style="--ribbon:${cardColor}"><div class="game-work card-work">${ActivityHeader()}<div class="cards-stage"><div class="deckpanel"><button class="card-deck-button" id="wordDeck" aria-label="Volgende woordenkaart trekken">${cover}</button></div><div class="game-card-motion"><article class="active-card" aria-label="${esc(name)}"><div class="card-ribbon">${gameIcon('verbs')}<strong>${esc(name)}</strong><span class="card-counter">${esc(counter)}</span></div><div class="card-content"><p class="word-structure">${esc(structure)}</p><h2>${esc(title)}</h2><p class="card-instruction">${esc(instruction)}</p><div class="activity-workspace">${workspace}</div>${FeedbackPanel()}<div class="word-mode-actions"><button class="smallbtn" id="wordCheck" hidden>Controleren</button><button class="smallbtn" id="wordArrange" aria-controls="sentenceBuilder" aria-expanded="false">${gameIcon('spelling')}<span>Leg de zin</span></button></div></div>${contextTools('word',{Help:{id:'wordHint',controls:'wordFeedback'},Example:{controls:'wordFeedback'}})}</article></div>${ExerciseNavigation(active)}</div></div>${gameBar(`<button class="primary card-next-primary" id="primaryGame">${cardFan()}<span>VOLGENDE KAART</span></button>`)}</div>`;
}
function SentenceCanvas() {
 return '<div class="sentence-canvas" id="sentence" role="group" aria-label="Jouw zin" data-drop-zone="sentence"></div>';
}
function WordBank() {
 return '<section class="word-bank" aria-labelledby="wordBankTitle"><h3 id="wordBankTitle">Woorden</h3><div id="wordBank" data-drop-zone="bank"></div></section>';
}
function SentenceBuilderExercise() {
 return `<label class="word-whole-option" id="wordWholeRow" hidden><input type="checkbox" id="wordWhole">Ook de hoofdzin bouwen</label><p class="word-lead" id="wordLead" aria-label="Vaste hoofdzin" hidden></p><section id="wordSpeaking" aria-label="Samen spreken"><div class="spoken-words" id="spokenWords" role="list" aria-label="Woorden voor jullie zin"></div><ol class="word-talk-steps"><li><strong>Overleg</strong></li><li><strong>Zeg en luister</strong></li><li><strong>Vergelijk</strong></li></ol></section><div class="sentence-builder" id="sentenceBuilder" hidden><p class="word-gesture-hint">Tik om te kiezen. Tik in de zin om terug te leggen.</p>${SentenceCanvas()}${WordBank()}<div class="sentence-actions"><button class="smallbtn" id="wordClear">Leegmaken</button></div><details class="sentence-tools"><summary>Volgorde aanpassen zonder slepen</summary><div><label for="moveWord">Woord</label><select id="moveWord" aria-label="Woord om te verplaatsen"></select><button class="smallbtn" id="wordLeft" aria-label="Woord één plek naar links">←</button><button class="smallbtn" id="wordRight" aria-label="Woord één plek naar rechts">→</button></div></details></div>`;
}
function newSentenceRound(round = 1, wholeSentence = false) {
 const bankOrder = sentenceContent({round, wholeSentence}).words.map((_, id) => id);
 for (let i = bankOrder.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [bankOrder[i], bankOrder[j]] = [bankOrder[j], bankOrder[i]];
 }
 // A new exercise must not already display the example order.
 if (bankOrder.every((id, i) => id === i)) bankOrder.push(bankOrder.shift());
 return {version: 3, round, wholeSentence, bankOrder, selected: [], status: 'initial', checked: false, feedback: '', support: null, arranging: false, moveId: null};
}

function moveSentenceWord(state, id, destination, index = state.selected.length) {
 if (!Number.isInteger(id) || !state.bankOrder.includes(id) || !['sentence', 'bank'].includes(destination) || !Number.isInteger(index)) return false;
 const next = state.selected.filter(word => word !== id);
 if (destination === 'sentence') next.splice(Math.max(0, Math.min(index, next.length)), 0, id);
 if (next.join(',') === state.selected.join(',')) return false;
 state.selected = next;
 state.moveId = destination === 'sentence' ? id : next[0] ?? null;
 state.status = state.checked ? 'incorrect' : 'initial';
 state.feedback = ''; state.support = null;
 return true;
}
function startWords() {
 APP.wordKind = 'build'; wordRound ??= newSentenceRound();
 setLast('word', 'Bouw een zin · Woorden en zinnen', {kind: 'build'});
 $('#gameMount').innerHTML = WordsAndSentencesActivityShell({active: 'build', name: 'Bouw een zin', title: 'Maak samen een goede zin', instruction: 'Gebruik alle woorden. Zeg jullie zin hardop.', workspace: SentenceBuilderExercise(), structure: sentenceContent().structure, counter: `${(wordRound.round - 1) % WORD_CARDS.length + 1} / ${WORD_CARDS.length}`});
 goScreen('game'); bindGameBar(nextWordCard); bindSentenceBuilder(); renderSentenceBuilder();
 $('#wordDeck').onclick = () => {rememberAction('volgende kaart'); nextWordCard();};
 $('#wordArrange').onclick = () => {
  rememberAction('oefenvorm wisselen'); wordRound.arranging = !wordRound.arranging;
  wordRound.feedback = ''; wordRound.support = null; renderSentenceBuilder();
 };
 $('#wordWhole').onchange = event => {
  rememberAction('hele zin oefenen');
  const next = newSentenceRound(wordRound.round, event.target.checked);
  next.arranging = wordRound.arranging; wordRound = next; renderSentenceBuilder();
 };
 $('#wordHint').onclick = () => showWordSupport('help');
 $('#wordExample').onclick = () => showWordSupport('example');
 for(const key of ['Goals','Partner','More'])$('#word'+key).onclick=()=>{
  const {structure,words,variation}=sentenceContent();
  const sections={Goals:[['Doel',`Oefen de zinsbouw (${structure.toLowerCase()}) met alle woorden: ${words.join(' · ')}.`],['Rollen','Eén deelnemer maakt en zegt de zin. De gesprekspartner luistert en denkt mee. Wissel daarna.']],Partner:[['Luister en reageer','Zijn alle woorden gebruikt? Begrijp je de zin? Zeg wat je begrijpt en bespreek samen de woordvolgorde.'],['Woorden bij deze kaart',words.join(' · ')]],More:[['Probeer ook',variation],['Leg de zin','Gebruik Leg de zin op de kaart om woorden te verplaatsen. Je kunt altijd terug naar Spreken.']]}[key];
  openGameDialog({Goals:'Doel en rollen',Partner:'Voor de gesprekspartner',More:'Meer bij deze zin'}[key],sections.map(([title,text])=>`<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join(''));
 };
}
async function nextWordCard() {
 if (wordBusy) return;
 wordBusy = true;
 try {
  completeTurn(); wordRound = newSentenceRound(wordRound.round + 1); startWords();
  const card = $('.words-activity .game-card-motion'), shell = card.closest('.game-shell');
  shell.setAttribute('aria-busy', 'true');
  const controls = [...shell.querySelectorAll('button,select')].map(b => [b, b.disabled]);
  controls.forEach(([b]) => b.disabled = true); updateUndo();
  try {await animateCard(card, $('#wordDeck')).finished.catch(() => {});}
  finally {if (shell.isConnected) {controls.forEach(([b, disabled]) => b.disabled = disabled); shell.removeAttribute('aria-busy');}}
 } finally {wordBusy = false; updateUndo();}
}
function renderSentenceBuilder(focusId) {
 const {words, prefix} = sentenceContent();
 $('#wordWholeRow').hidden = !WORD_CARDS[(wordRound.round - 1) % WORD_CARDS.length].prefix;
 $('#wordWhole').checked = !!wordRound.wholeSentence;
 $('#wordLead').hidden = !prefix; $('#wordLead').textContent = prefix;
 $('.words-activity .card-instruction').textContent = prefix ? 'Maak de zin af. Gebruik alle losse woorden.' : 'Gebruik alle woorden. Zeg jullie zin hardop.';
 $('#wordSpeaking').hidden = !!wordRound.arranging;
 $('.words-activity .card-content h2').hidden = !!wordRound.arranging;
 $('.words-activity .card-instruction').hidden = !!wordRound.arranging;
 $('#sentenceBuilder').hidden = !wordRound.arranging;
 $('#wordArrange').setAttribute('aria-expanded', String(!!wordRound.arranging));
 $('#wordArrange span').textContent = wordRound.arranging ? 'Spreken' : 'Leg de zin';
 $('#spokenWords').innerHTML = wordRound.bankOrder.map(id => `<span class="sentence-word" role="listitem">${esc(words[id])}</span>`).join('');
 const tile = (id, place) => `<button type="button" class="sentence-word" data-token="${id}" data-place="${place}" aria-label="${esc(words[id])} ${place === 'sentence' ? 'terugplaatsen' : 'toevoegen'}">${esc(words[id])}</button>`;
 $('#sentence').innerHTML = wordRound.selected.length ? wordRound.selected.map(id => tile(id, 'sentence')).join('') : '<p class="sentence-empty">Tik op de woorden of sleep ze hierheen.</p>';
 $('#wordBank').innerHTML = wordRound.bankOrder.filter(id => !wordRound.selected.includes(id)).map(id => tile(id, 'bank')).join('') || '<p class="bank-empty">Alle woorden staan in je zin.</p>';
 const select = $('#moveWord');
 select.innerHTML = wordRound.selected.length ? wordRound.selected.map(id => `<option value="${id}">${esc(words[id])}</option>`).join('') : '<option>Voeg een woord toe</option>';
 if (wordRound.selected.includes(wordRound.moveId)) select.value = String(wordRound.moveId);
 else wordRound.moveId = wordRound.selected[0] ?? null;
 select.disabled = !wordRound.selected.length;
 const position = wordRound.selected.indexOf(wordRound.moveId);
 $('#wordLeft').disabled = position <= 0; $('#wordRight').disabled = position < 0 || position >= wordRound.selected.length - 1;
 $('#wordClear').disabled = !wordRound.selected.length;
 $('#wordCheck').hidden = !wordRound.arranging;
 $('#wordCheck').disabled = !wordRound.selected.length;
 $('#wordCheck').textContent = wordRound.checked ? 'Opnieuw controleren' : 'Controleren';
 const feedback = $('#wordFeedback');
 feedback.textContent = wordRound.feedback; feedback.hidden = !wordRound.feedback;
 feedback.classList.toggle('open', !!wordRound.feedback); feedback.dataset.status = wordRound.status;
 $('#wordHint').setAttribute('aria-expanded', String(wordRound.support === 'help'));
 $('#wordExample').setAttribute('aria-expanded', String(wordRound.support === 'example'));
 if (focusId !== undefined) $(`[data-token="${focusId}"]`)?.focus({preventScroll: true});
}
function moveWord(id, destination, index) {
 const next = structuredClone(wordRound);
 if (!moveSentenceWord(next, id, destination, index)) return;
 rememberAction('woord verplaatsen'); wordRound = next; renderSentenceBuilder(id);
 if (!settingsState().reducedMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches) $(`[data-token="${id}"]`)?.animate([{opacity: .45, transform: 'translateY(4px)'}, {opacity: 1, transform: 'none'}], {duration: 140, easing: 'ease-out'});
}
function checkSentence() {
 rememberAction('antwoord controleren'); wordRound.checked = true; wordRound.support = 'check';
 const {words, order, answer} = sentenceContent();
 const correct = wordRound.selected.join(',') === order.join(',');
 wordRound.status = correct ? 'correct' : 'incorrect';
 wordRound.feedback = correct ? 'Goed gedaan. ' + answer : wordRound.selected.length < words.length ? 'Gebruik alle woorden om je zin af te maken.' : 'Jullie volgorde is anders dan het voorbeeld. Lees de zin samen hardop. Kan deze volgorde ook?';
 renderSentenceBuilder(); $('#wordFeedback').scrollIntoView({block: 'nearest'});
}
function showWordSupport(kind) {
 rememberAction(kind === 'help' ? 'hulp bekijken' : 'voorbeeld bekijken');
 const {answer, hint, variation} = sentenceContent();
 wordRound.support = wordRound.support === kind ? null : kind;
 wordRound.feedback = !wordRound.support ? '' : kind === 'help' ? hint : 'Een mogelijke zin: ' + answer + ' Andere goede zinnen kunnen ook. Probeer ook: ' + variation;
 renderSentenceBuilder(); if (wordRound.feedback) $('#wordFeedback').scrollIntoView({block: 'nearest'});
}
function bindSentenceBuilder() {
 const workspace = $('#sentenceBuilder');
 let drag = null, suppressClick = false;
 workspace.onclick = event => {
  if (suppressClick) {suppressClick = false; return;}
  const tile = event.target.closest('[data-token]');
  if (tile) moveWord(Number(tile.dataset.token), tile.dataset.place === 'bank' ? 'sentence' : 'bank');
 };
 $('#moveWord').onchange = event => {wordRound.moveId = Number(event.target.value); renderSentenceBuilder();};
 for (const [id, delta] of [['wordLeft', -1], ['wordRight', 1]]) $('#' + id).onclick = () => moveWord(wordRound.moveId, 'sentence', wordRound.selected.indexOf(wordRound.moveId) + delta);
 $('#wordCheck').onclick = checkSentence;
 $('#wordClear').onclick = () => {
  rememberAction('zin leegmaken'); wordRound.selected = []; wordRound.moveId = null;
  wordRound.status = 'initial'; wordRound.checked = false; wordRound.feedback = ''; wordRound.support = null;
  renderSentenceBuilder(); $('#wordBank button')?.focus();
 };
 workspace.onpointerdown = event => {
  const tile = event.target.closest('[data-token]');
  if (!tile || event.button !== 0 || !event.isPrimary) return;
  suppressClick = false;
  drag = {id: Number(tile.dataset.token), pointer: event.pointerId, x: event.clientX, y: event.clientY, tile, active: false};
 };
 workspace.onpointermove = event => {
  if (!drag || drag.pointer !== event.pointerId) return;
  if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 8) return;
  if (!drag.active) {drag.active = true; workspace.setPointerCapture(event.pointerId); drag.tile.classList.add('is-dragging');}
  const scroll = workspace.closest('.card-content'), bounds = scroll.getBoundingClientRect();
  if (event.clientY < bounds.top + 40) scroll.scrollTop -= 16;
  else if (event.clientY > bounds.bottom - 40) scroll.scrollTop += 16;
  workspace.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-drop-zone]');
  target?.classList.add('drop-target');
 };
 const cancel = () => {
  if (drag) drag.tile.classList.remove('is-dragging');
  workspace.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
  drag = null;
 };
 workspace.onpointerup = event => {
  if (!drag || drag.pointer !== event.pointerId) return;
  const current = drag;
  if (current.active) {
   suppressClick = true;
   const hit = document.elementFromPoint(event.clientX, event.clientY);
   const zone = hit?.closest('[data-drop-zone]');
   const target = hit?.closest('[data-token]');
   cancel();
   if (zone) {
    const remaining = wordRound.selected.filter(id => id !== current.id);
    let index = remaining.length;
    if (target && target.dataset.place === 'sentence') {
     if (Number(target.dataset.token) === current.id) return;
     const rect = target.getBoundingClientRect();
     index = remaining.indexOf(Number(target.dataset.token)) + (event.clientX > rect.left + rect.width / 2 ? 1 : 0);
    }
    moveWord(current.id, zone.dataset.dropZone, index);
   }
  } else cancel();
 };
 workspace.onpointercancel = cancel;
 workspace.onlostpointercapture = event => {if (event.target === workspace) cancel();};
}
