import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('./words-content.js', import.meta.url), 'utf8'), context);
vm.runInContext(fs.readFileSync(new URL('./words-activity.js', import.meta.url), 'utf8'), context);
const run = code => vm.runInContext(code, context);
run('var state = newSentenceRound()');
assert.equal(run('state.selected.length'), 0);
assert.equal(run("moveSentenceWord(state, 7, 'sentence')"), true);
assert.equal(run("moveSentenceWord(state, 3, 'sentence')"), true);
assert.equal(run("moveSentenceWord(state, 7, 'sentence', 1)"), true);
assert.equal(run('state.selected.join()'), '3,7');
assert.equal(run("moveSentenceWord(state, 7, 'bank')"), true);
assert.equal(run('state.selected.join()'), '3');
for (const id of ['NaN', '1.5', '-1', '8', '"7"']) assert.equal(run(`moveSentenceWord(state, ${id}, 'sentence')`), false);
assert.equal(run("moveSentenceWord(state, 7, 'outside')"), false);
assert.equal(run("moveSentenceWord(state, 7, 'sentence', NaN)"), false);
run("state.checked=true; state.status='correct'; moveSentenceWord(state, 0, 'sentence')");
assert.equal(run('state.status'), 'incorrect');
for (let round = 2; round < 100; round++) {
 assert.equal(run(`newSentenceRound(${round}).bankOrder.sort((a,b)=>a-b).join()`), run(`sentenceContent({round:${round}}).words.map((_,id)=>id).join()`));
}
console.log('PASS: sentence moves, reordering, return, unique IDs, invalid input, feedback reset and round integrity.');

assert.equal(run('newSentenceRound().arranging'),false);
assert.notEqual(run('sentenceContent({round:1}).answer'),run('sentenceContent({round:2}).answer'));
assert.equal(run('WORD_CARDS.length'), 30);
assert.equal(run('new Set(WORD_CARDS.map(card=>card.answer)).size'), 30);
for (const structure of ['Hoofdzin', 'Andere start', 'Bijzin']) assert.equal(run(`WORD_CARDS.filter(card=>card.structure===${JSON.stringify(structure)}).length`), 10);
for (let round = 1; round <= 60; round++) {
 for (const wholeSentence of [false, true]) {
  run(`var card = sentenceContent({round:${round}, wholeSentence:${wholeSentence}}); var next = newSentenceRound(${round}, ${wholeSentence})`);
  assert.equal(run("[card.prefix, card.order.map(id=>card.words[id]).join(' ')].filter(Boolean).join(' ')"), run('card.answer'));
  assert.ok(run('card.hint.length > 10 && card.variation.length > 10'));
  assert.equal(run('next.bankOrder.length'), run('card.words.length'));
  assert.notEqual(run('next.bankOrder.join()'), run('card.order.join()'));
  assert.equal(run('next.version'), 3);
  if (wholeSentence) assert.equal(run('card.prefix'), '');
 }
}
assert.equal(run('sentenceContent({round:31}).answer'), run('sentenceContent({round:1}).answer'));
for (const sentence of [
 'Morgen ga ik met de trein naar Rotterdam.', 'Vandaag koopt mijn buurman brood bij de bakker.',
 'Na het werk drinken wij samen koffie.', 'Mijn zus leest een boek in de tuin.',
 'Wij gaan zaterdag met de bus naar school.', 'De afspraak bij de huisarts is om tien uur.'
]) assert.equal(run(`WORD_CARDS.some(card=>card.answer===${JSON.stringify(sentence)})`), true);
console.log('PASS: 30 unique cards, 10 per structure, six original sentences, per-card help/variation, clause and whole-sentence word integrity, shuffled starts and wraparound.');
