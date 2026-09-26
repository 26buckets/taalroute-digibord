/* Shared DigiBord card table; speaking first, arranging words optional. */
const WORD_EXERCISES = [
 ['build', 'Bouw een zin', 'Woorden ordenen'], ['make', 'Maak en verander', 'Een zin aanpassen'],
 ['guess', 'Beschrijf en raad', 'Omschrijven en raden'], ['combine', 'Combineer en beschrijf', 'Begrippen verbinden']
];
const WORD_CARDS = WORD_CONTENT.items.filter(item => item.source === 'V0124_WORD_CARDS').map(item => ({...item, answer: item.answerModel}));
let wordRound = null, wordBusy = false;
function sentenceContent(state = wordRound) {
 if (state.version === 4) {
  const item = wordItem(state);
  return {...item, answer: item.answerModel, prefix: '', words: item.tokens || [], order: (item.tokens || []).map((_, id) => id), structure: item.goal, hint: item.feedback, variation: 'Gebruik de zin in een gesprek.'};
 }
 const card = WORD_CARDS[(state.round - 1) % WORD_CARDS.length];
 const prefix = state.wholeSentence ? '' : card.prefix;
 const words = card.answer.slice(prefix.length).trim().split(' ');
 return {...card, prefix, words, order: words.map((_, id) => id)};
}
function ExerciseNavigation(active) {
 return `<aside class="cardtypes activity-navigation"><h3>Oefenvormen</h3><nav aria-label="Oefenvormen">${WORD_EXERCISES.map(([id, label, description], i) => `<button class="typebtn ${id === active ? 'active' : ''}" ${id === active ? 'aria-current="page"' : 'disabled'}>${gameIcon(['verbs','spelling','conversation','puzzles'][i])}<span>${label}<small>${description}${id !== 'build' ? ' · Binnenkort' : ''}</small></span></button>`).join('')}</nav></aside>`;
}
function ActivityHeader(total = WORD_CARDS.length) {
 return `<div class="card-activity-heading"><div><h1>Woorden &amp; zinnen <span>${total} kaarten</span></h1><p>Overleg samen. Zeg je zin. Luister naar elkaar.</p></div></div>`;
}
function FeedbackPanel() {
 return '<div class="supportbox activity-feedback" id="wordFeedback" role="status" aria-live="polite" aria-atomic="true" hidden></div>';
}
function WordsAndSentencesActivityShell({active, name, title, instruction, workspace, counter, structure, navigation = ExerciseNavigation(active), total = WORD_CARDS.length, color = '#176b9a'}) {
 const cardColor = safeColor(color);
 const cover = playCardBack(name, 'Woorden & zinnen', 'verbs', `${total} kaarten`, cardColor).replace(gameIcon('verbs'), '<span class="word-deck-symbol" aria-hidden="true">Aa</span>');
 return `<div class="game-shell card-table-shell words-activity" style="--ribbon:${cardColor}"><div class="game-work card-work">${ActivityHeader(total)}<div class="cards-stage"><div class="deckpanel"><button class="card-deck-button" id="wordDeck" aria-label="Volgende woordenkaart trekken">${cover}</button></div><div class="game-card-motion"><article class="active-card" aria-label="${esc(name)}"><div class="card-ribbon">${gameIcon('verbs')}<strong>${esc(name)}</strong><span class="card-counter">${esc(counter)}</span></div><div class="card-content"><p class="word-structure">${esc(structure)}</p><h2>${esc(title)}</h2><p class="card-instruction">${esc(instruction)}</p><div class="activity-workspace">${workspace}</div>${FeedbackPanel()}<div class="word-mode-actions"><button class="smallbtn" id="wordCheck" hidden>Controleren</button><button class="smallbtn" id="wordArrange" aria-controls="sentenceBuilder" aria-expanded="false">${gameIcon('spelling')}<span>Leg de zin</span></button></div></div>${contextTools('word',{Help:{id:'wordHint',controls:'wordFeedback'},Example:{controls:'wordFeedback'}})}</article></div>${navigation}</div></div>${gameBar(`<button class="primary card-next-primary" id="primaryGame">${cardFan()}<span>VOLGENDE KAART</span></button>`)}</div>`;
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
function startWords(kind) {
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 if (kind === 'wz' || (!kind && wordRound?.version === 4)) return startWZ();
 if (['make','guess','combine'].includes(kind)) return goScreen('words');
 if (wordRound?.version === 4) wordRound = null;
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
  completeTurn(); wordRound = wordRound.version === 4 ? newWZRound({...wordRound, round: wordRound.round + 1}) : newSentenceRound(wordRound.round + 1); startWords();
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
 const isWZ = wordRound.version === 4;
 $('#wordWholeRow').hidden = isWZ || !WORD_CARDS[(wordRound.round - 1) % WORD_CARDS.length].prefix;
 $('#wordWhole').checked = !!wordRound.wholeSentence;
 $('#wordLead').hidden = !prefix; $('#wordLead').textContent = lessonText(prefix);
 $('.words-activity .card-instruction').textContent = isWZ ? lessonText(wordItem().instruction) : prefix ? 'Maak de zin af. Gebruik alle losse woorden.' : 'Gebruik alle woorden. Zeg jullie zin hardop.';
 $('#wordSpeaking').hidden = !!wordRound.arranging;
 $('.words-activity .card-content h2').hidden = !!wordRound.arranging;
 $('.words-activity .card-instruction').hidden = !isWZ && !!wordRound.arranging;
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
 feedback.textContent = lessonText(wordRound.feedback); feedback.hidden = !wordRound.feedback;
 feedback.classList.toggle('open', !!wordRound.feedback); feedback.dataset.status = wordRound.status;
 $('#wordHint').setAttribute('aria-expanded', String(wordRound.support === 'help'));
 $('#wordExample').setAttribute('aria-expanded', String(wordRound.support === 'example'));
 if (isWZ) persistWZ();
 if (focusId !== undefined) $(`[data-token="${focusId}"]`)?.focus({preventScroll: true});
}
function moveWord(id, destination, index) {
 const next = structuredClone(wordRound);
 if (!moveSentenceWord(next, id, destination, index)) return;
 rememberAction('woord verplaatsen'); wordRound = next; renderSentenceBuilder(id);
 if (!settingsState().reducedMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches) $(`[data-token="${id}"]`)?.animate([{opacity: .45, transform: 'translateY(4px)'}, {opacity: 1, transform: 'none'}], {duration: 140, easing: 'ease-out'});
}
function checkSentence() {
 if (wordRound.version === 4) return checkWZ();
 rememberAction('antwoord controleren'); wordRound.checked = true; wordRound.support = 'check';
 const {words, order, answer} = sentenceContent();
 const correct = wordRound.selected.join(',') === order.join(',');
 wordRound.status = correct ? 'correct' : 'incorrect';
 wordRound.feedback = correct ? 'Goed gedaan. ' + answer : wordRound.selected.length < words.length ? 'Gebruik alle woorden om je zin af te maken.' : 'Jullie volgorde is anders dan het voorbeeld. Lees de zin samen hardop. Kan deze volgorde ook?';
 renderSentenceBuilder(); $('#wordFeedback').scrollIntoView({block: 'nearest'});
}
function showWordSupport(kind) {
 if (wordRound.version === 4) return showWZSupport(kind);
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

// WZ uses the same shell, turn controls, feedback and token builder as the retained cards.
const WZ_TYPES = ['Bouw','Kies','Herstel','Verander','Spreek','Transfer'];
const WZ_ITEMS = WORD_CONTENT.items.filter(item => item.source === 'WZ_BATCH_001');
const WORD_ITEMS = WORD_CONTENT.items.filter(item => item.source !== 'V0124_WORD_CARDS');
const WORD_TYPES = [...WZ_TYPES, 'Raad'];
const HISTORICAL_GOALS = [...new Map(WORD_ITEMS.filter(i=>i.source==='PRAATPAD_WORDS').map(i=>[i.goalId,i.goal])).entries()];
const WZ_GOALS = [...new Map(WZ_ITEMS.map(item => [item.goalId, item.goal])).entries()];
function wordItem(state = wordRound) { return WORD_ITEMS.find(item => item.id === state?.itemId); }
function wzPool({goalId, type, band, context = '', source = 'WZ_BATCH_001', level = ''}) {
 return WORD_ITEMS.filter(item => item.source === source && item.goalId === goalId && (!type || item.type === type) && (!band || item.band === band) && (!context || item.context === context) && (!level || item.level === level));
}
function shuffledWords(values) {
 const out = [...values];
 for (let i = out.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]];}
 return out;
}
function newWZRound({goalId = 'WZ_001', type = 'Bouw', band = 1, context = '', round = 1, source = 'WZ_BATCH_001', level = ''} = {}) {
 const pool = wzPool({goalId,type,band,context,source,level});
 if (!pool.length) throw new Error('Geen oefeningen voor deze selectie.');
 const item = pool[(round - 1) % pool.length];
 const bankOrder = shuffledWords((item.tokens || []).map((_, i) => i));
 if (bankOrder.length > 1 && bankOrder.every((id, i) => id === i)) bankOrder.push(bankOrder.shift());
 return {version:4,source,level,clueCount:1,revealed:false,goalId,type,band,context,round,itemId:item.id,bankOrder,optionOrder:shuffledWords(item.options.map(o=>o.id)),selected:[],response:'',choice:null,status:'initial',checked:false,feedback:'',support:null,arranging:false,moveId:null};
}
function validWZRound(state) {
 if (!state || state.version !== 4 || !Number.isInteger(state.round) || state.round < 1 || ![0,1,2,3].includes(state.band) || !WORD_TYPES.includes(state.type) || typeof state.context !== 'string') return false;
 if (state.source !== undefined && !['WZ_BATCH_001','PRAATPAD_WORDS'].includes(state.source)) return false;
 if (state.level !== undefined && !['','A1','A2','B1','B2'].includes(state.level)) return false;
 const pool = wzPool(state), item = wordItem(state);
 if (item?.type === 'Raad' && (!Number.isInteger(state.clueCount) || state.clueCount < 1 || state.clueCount > item.clues.length || typeof state.revealed !== 'boolean')) return false;
 if (!pool.length || pool[(state.round - 1) % pool.length]?.id !== item?.id) return false;
 const validOrder = (values, expected) => Array.isArray(values) && values.length === expected.length && new Set(values).size === expected.length && values.every(v=>expected.includes(v));
 return validOrder(state.bankOrder,(item.tokens || []).map((_,i)=>i)) && validOrder(state.optionOrder,item.options.map(o=>o.id)) && Array.isArray(state.selected) && new Set(state.selected).size === state.selected.length && state.selected.every(id=>state.bankOrder.includes(id)) && typeof state.response === 'string' && state.response.length <= 1000 && (state.choice === null || item.options.some(o=>o.id===state.choice));
}
function persistWZ() {APP.wzRound = structuredClone(wordRound); save();}
function normalizeWordAnswer(value) {return String(value).normalize('NFC').toLocaleLowerCase('nl').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'').trim();}
function assessWordAnswer(item, response) {
 // Guard the actual type too: malformed metadata must never score open speech.
 if (item.answerType === 'OPEN' || ['Spreek','Transfer','Raad'].includes(item.type)) return 'unassessed';
 if (item.type === 'Kies') return item.options.some(o=>o.id===response) ? response === item.correctOptionId ? 'correct' : 'incorrect' : 'incomplete';
 if (!normalizeWordAnswer(response)) return 'incomplete';
 return item.acceptedAnswers.some(answer=>normalizeWordAnswer(answer)===normalizeWordAnswer(response)) ? 'correct' : 'review';
}
function selectWZGoal(goalId, source = 'WZ_BATCH_001') {
 const goalItems = WORD_ITEMS.filter(i=>i.source===source&&i.goalId===goalId);
 if (!goalItems.length) return;
 wordRound = newWZRound({goalId,source,type:goalItems[0].type,band:source==='WZ_BATCH_001'?Math.min(...goalItems.map(i=>i.band)):0}); startWords('wz');
}
function WZNavigation() {
 const state = wordRound, historical = state.source === 'PRAATPAD_WORDS';
 const option = (value,label,selected) => `<option value="${esc(value)}" ${selected ? 'selected' : ''}>${esc(label)}</option>`;
 const contexts = [...new Set(wzPool({...state,type:'',context:''}).map(i=>i.context))].sort();
 const levels = [...new Set(wzPool({...state,type:'',context:'',level:''}).map(i=>i.level))];
 const difficulty = historical ? `<label>Niveau<select id="wzLevel">${option('','Alle niveaus',!state.level)}${levels.map(level=>option(level,level,level===state.level)).join('')}</select></label>` : `<label>Moeilijkheid<select id="wzBand">${[[1,'1 · Instap met docent'],[2,'2 · Verder oefenen'],[3,'3 · Later in A1'],[0,'Alle banden']].filter(([band])=>!band || wzPool({...state,type:'',context:'',band}).length).map(([band,label])=>option(band,label,band===state.band)).join('')}</select></label>`;
 const types = historical ? WORD_TYPES.filter(type=>wzPool({...state,type,context:'',level:''}).length) : WZ_TYPES;
 return `<aside class="cardtypes activity-navigation wz-navigation"><label>Taaldoel<select id="wzGoal">${(historical?HISTORICAL_GOALS:WZ_GOALS).map(([id,label])=>option(id,label,id===state.goalId)).join('')}</select></label>${difficulty}<h3>Oefenvorm</h3><nav aria-label="Oefenvormen">${types.map(type=>{const count=wzPool({...state,type}).length;return `<button class="typebtn ${type===state.type?'active':''}" data-wz-type="${type}" ${count?'':'disabled'} ${type===state.type?'aria-current="page"':''}><span>${type}<small>${count} oefeningen</small></span></button>`}).join('')}</nav><label>Context<select id="wzContext">${option('','Alle contexten',!state.context)}${contexts.map(c=>option(c,c,c===state.context)).join('')}</select></label><button class="smallbtn" id="wzGoalsBack">Alle taaldoelen</button></aside>`;
}
function WZWorkspace(item) {
 if (item.type === 'Bouw') return SentenceBuilderExercise();
 if (item.type === 'Raad') return '<ol id="wordClues" aria-label="Aanwijzingen" aria-live="polite"></ol><button class="smallbtn" id="wordClue">Volgende aanwijzing</button><p id="wordTarget" role="status" hidden></p><p>Raad samen. Geef daarna zelf een omschrijving.</p>';
 const stimulus = item.stimulus ? `<p class="wz-stimulus">${esc(item.stimulus)}</p>` : '';
 if (item.type === 'Kies') return `${stimulus}<div class="wz-options" role="group" aria-label="Kies je antwoord">${wordRound.optionOrder.map(id=>{const o=item.options.find(o=>o.id===id);return `<button class="smallbtn" data-wz-option="${o.id}" aria-pressed="${wordRound.choice===o.id}">${esc(o.text)}</button>`}).join('')}</div>`;
 if (item.answerType === 'OPEN') return `${stimulus}<p class="wz-open">Zeg je antwoord. Luister naar elkaar.</p><p>Bespreek samen: ${esc(item.feedback)}</p><p class="word-gesture-hint">Verschillende antwoorden zijn mogelijk. De docent beoordeelt het antwoord.</p>`;
 return `${stimulus}<label class="wz-response-label" for="wzResponse">Jouw zin</label><textarea id="wzResponse" rows="2" maxlength="1000" spellcheck="false">${esc(wordRound.response)}</textarea>`;
}
function startWZ() {
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 if (wordRound?.version !== 4) wordRound = validWZRound(APP.wzRound) ? structuredClone(APP.wzRound) : newWZRound();
 if (!validWZRound(wordRound)) wordRound = newWZRound();
 const item = wordItem(), pool = wzPool(wordRound);
 APP.wordKind = 'wz'; persistWZ();
 setLast('word', `${item.goal} · ${item.type}`, {kind:'wz',goalId:item.goalId,itemId:item.id});
 $('#gameMount').innerHTML = WordsAndSentencesActivityShell({active:item.type,name:item.type,title:item.goal,instruction:item.instruction,workspace:WZWorkspace(item),structure:`${item.source==='PRAATPAD_WORDS'?item.level:'Band '+item.band} · ${item.context}`,counter:`${(wordRound.round-1)%pool.length+1} / ${pool.length}`,total:pool.length,navigation:WZNavigation()});
 goScreen('game');bindGameBar(nextWordCard);
 $('[data-ghelp]').onclick=()=>openGameDialog('Spelhulp','<p>Kies eerst een taaldoel en daarna een oefenvorm. De docent kan de opdracht voorlezen en voordoen. Bij Raad toon je de aanwijzingen één voor één; met het oog onthul je het woord. Bij Spreek, Transfer en Raad is er geen automatische beoordeling.</p>');
 $('#wordDeck').onclick = () => {rememberAction('volgende kaart');nextWordCard();};
 $('#wzGoal').onchange = event => {rememberAction('taaldoel wisselen'); selectWZGoal(event.target.value,wordRound.source);};
 const filter = patch => {
  const focused = document.activeElement;
  const focusSelector = focused?.dataset.wzType ? `[data-wz-type="${focused.dataset.wzType}"]` : focused?.id ? '#'+CSS.escape(focused.id) : null;
  rememberAction('oefening kiezen');
  const selection = {...wordRound,...patch,round:1};
  if (!wzPool(selection).length) selection.type = WORD_TYPES.find(type=>wzPool({...selection,type}).length);
  wordRound = newWZRound(selection);startWZ();
  if(focusSelector)$(focusSelector)?.focus({preventScroll:true});
 };
 if ($('#wzBand')) $('#wzBand').onchange = event => filter({band:Number(event.target.value),context:''});
 if ($('#wzLevel')) $('#wzLevel').onchange = event => filter({level:event.target.value,context:''});
 $('#wzContext').onchange = event => filter({context:event.target.value});
 $$('[data-wz-type]').forEach(button=>button.onclick=()=>filter({type:button.dataset.wzType}));
 $('#wzGoalsBack').onclick = () => goScreen('words');
 $('#wordArrange').hidden = item.type !== 'Bouw';
 $('#wordHint').onclick = () => showWZSupport('help');
 $('#wordExample').onclick = () => showWZSupport('example');
 if (item.type === 'Bouw') {
  bindSentenceBuilder();renderSentenceBuilder();
  $('#wordArrange').onclick = () => {rememberAction('oefenvorm wisselen');wordRound.arranging=!wordRound.arranging;wordRound.feedback='';wordRound.support=null;renderSentenceBuilder();};
 } else {
  $('#wordCheck').hidden = item.answerType === 'OPEN';
  $('#wordCheck').onclick = checkWZ;
  $$('[data-wz-option]').forEach(button=>button.onclick=()=>{
   rememberAction('antwoord kiezen');wordRound.choice=button.dataset.wzOption;wordRound.feedback='';wordRound.checked=false;wordRound.status='initial';
   $$('[data-wz-option]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderWZFeedback();
  });
  const input = $('#wzResponse');
  if(input){input.onfocus=()=>rememberAction('zin schrijven');input.oninput=()=>{wordRound.response=input.value;wordRound.feedback='';wordRound.checked=false;wordRound.status='initial';renderWZFeedback();};}
  if (item.type==='Raad') {
   $('#wordClue').onclick=()=>showWZSupport('help');
   $('#wordExample').setAttribute('aria-controls','wordTarget');
  }
  renderWZFeedback();
 }
 for(const key of ['Goals','Partner','More'])$('#word'+key).onclick=()=>{
  const sections={Goals:[['Doel',item.goal],['Waar let je op?',item.feedback]],Partner:[['Samen bespreken',item.answerType==='OPEN'?'Luister naar de bedoeling en naar de zin. Geef ruimte voor een ander passend antwoord.':'Vergelijk de gekozen zin met het antwoordmodel. Bespreek een andere geldige formulering.']],More:[['Verder oefenen',item.source==='PRAATPAD_WORDS'?'Zeg een eigen zin of geef zelf aanwijzingen. Bespreek het antwoord samen.':'Oefen hetzelfde taaldoel ook met Spreek of Transfer. Deze vormen hebben open antwoorden.']]};
  openGameDialog({Goals:'Doel en rollen',Partner:'Voor de gesprekspartner',More:'Meer bij deze oefening'}[key],sections[key].map(([h,t])=>`<h3>${esc(h)}</h3><p>${esc(t)}</p>`).join(''));
 };
}
function renderWZFeedback() {
 const item=wordItem();
 if (item.type==='Raad') {
  $('#wordClues').innerHTML=item.clues.slice(0,wordRound.clueCount).map(clue=>`<li>${esc(clue)}</li>`).join('');
  $('#wordClue').disabled=wordRound.clueCount>=item.clues.length;
  $('#wordTarget').hidden=!wordRound.revealed;
  $('#wordTarget').textContent=wordRound.revealed?'Het woord: '+lessonText(item.answerModel):'';
  $('#wordExample').setAttribute('aria-label',wordRound.revealed?'Verberg het woord':'Onthul het woord');
  const exampleTool=$('#wordExample').closest('.context-tool');
  exampleTool.dataset.tipLabel=wordRound.revealed?'Verberg het woord':'Onthul het woord';
  exampleTool.dataset.tip='Bekijk het gezochte woord na het raden. Bespreek daarna de aanwijzingen.';
  $('#wordHint').setAttribute('aria-controls','wordClues');
  $('#wordHint').closest('.context-tool').dataset.tip='Toon de volgende aanwijzing. Het gezochte woord blijft verborgen.';
 }
 const box=$('#wordFeedback');box.textContent=lessonText(wordRound.feedback);box.hidden=!wordRound.feedback;box.classList.toggle('open',!!wordRound.feedback);box.dataset.status=wordRound.status;
 $('#wordHint').setAttribute('aria-expanded',String(item.type==='Raad'?wordRound.clueCount>1:wordRound.support==='help'));
 $('#wordExample').setAttribute('aria-expanded',String(item.type==='Raad'?wordRound.revealed:wordRound.support==='example'));persistWZ();
}
function checkWZ() {
 const item=wordItem();
 if (item.answerType==='OPEN' || ['Spreek','Transfer','Raad'].includes(item.type)) return;
 rememberAction('antwoord controleren');
 const response=item.type==='Kies'?wordRound.choice:item.type==='Bouw'?wordRound.selected.map(id=>item.tokens[id]).join(' '):wordRound.response;
 wordRound.status=item.type==='Bouw'&&wordRound.selected.length!==item.tokens.length?'incomplete':assessWordAnswer(item,response);
 wordRound.checked=true;wordRound.support='check';
 const model=` Voorbeeld: ${item.answerModel}`;
 wordRound.feedback={correct:'Goed gedaan.'+model,incorrect:item.feedback+model,incomplete:item.type==='Bouw'?'Gebruik alle bouwstenen.':'Geef eerst een antwoord.',review:'Dit antwoord wijkt af van het model. Bespreek of het ook past. '+item.feedback+model}[wordRound.status];
 // A repair task always follows the error sentence with a correct model after checking.
 if(item.type==='Herstel'&&wordRound.status==='incomplete')wordRound.feedback+=model;
 if(item.type==='Bouw')renderSentenceBuilder();else renderWZFeedback();
 $('#wordFeedback').scrollIntoView({block:'nearest'});
}
function showWZSupport(kind) {
 rememberAction(kind==='help'?'hulp bekijken':'voorbeeld bekijken');
 const item=wordItem();
 if(item.type==='Raad'){
  if(kind==='example')wordRound.revealed=!wordRound.revealed;
  else wordRound.clueCount=Math.min(item.clues.length,wordRound.clueCount+1);
  wordRound.feedback='';wordRound.support=kind;renderWZFeedback();return;
 }
 wordRound.support=wordRound.support===kind?null:kind;
 wordRound.feedback=!wordRound.support?'':kind==='help'?item.feedback:item.answerType==='OPEN'?'Open antwoord. Bespreek samen: '+item.feedback:'Een mogelijke zin: '+item.answerModel;
 if(item.type==='Bouw')renderSentenceBuilder();else renderWZFeedback();
}
function renderWordGoals() {
 const mount = $('#wordGoalTiles');if(!mount)return;
 mount.innerHTML=WZ_GOALS.map(([id,label])=>`<button class="tile" data-wz-goal="${id}"><div class="tile-body"><span class="status">${id} · ${WZ_ITEMS.filter(i=>i.goalId===id).length} oefeningen</span><h3>${esc(label)}</h3><p>A0–A1 · kies daarna de oefenvorm</p></div></button>`).join('');
 const archive=$('#wordArchiveGoals');
 if(archive){
  archive.innerHTML=HISTORICAL_GOALS.map(([id,label])=>`<button class="tile" data-word-archive="${id}"><div class="tile-body"><h3>${esc(label)}</h3><p>${WORD_ITEMS.filter(i=>i.source==='PRAATPAD_WORDS'&&i.goalId===id).length} historische kaarten</p></div></button>`).join('');
  archive.querySelectorAll('[data-word-archive]').forEach(button=>button.onclick=()=>selectWZGoal(button.dataset.wordArchive,'PRAATPAD_WORDS'));
 }
 mount.querySelectorAll('[data-wz-goal]').forEach(button=>button.onclick=()=>selectWZGoal(button.dataset.wzGoal));
}
