const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const runtime = vm.runInNewContext(read('data-bundle.js') + read('data/taalmix.js') + ';window.DIGIBORD_DATA', {window:{}});
const bank = JSON.parse(read('data/kaartenkast_320.json'));
const games = JSON.parse(read('data/card-games.json'));
assert.equal(JSON.stringify(runtime.cardGames), JSON.stringify(games));
const bundled = games.families.flatMap(f => f.cards);
assert.deepEqual(new Map(bundled.map(c => [c.id,c])), new Map(bank.cards.map(c => [c.id,c])));
const rebuses = bundled.filter(c => c.actionType === 'rebus');
assert.equal(rebuses.length, 90);
assert.equal(bundled.filter(c => c.visualRebus).length, 90);
const source = read('app.js');
let rendered;
const ctx = vm.createContext({CARD_GAMES:games.families, APP:{cardIndex:0},
 cardsFor:()=>ctx.list, cardRound:()=>({attempted:false}), shapeMeta:()=>({color:'#123456',symbol:'△',task:'Kies'}),
 stopTongueAudio(){}, setLast(){}, toast:msg=>assert.fail(msg), esc:s=>String(s??''), renderCardTable:(kind,counter,html)=>{rendered=html}});
vm.runInContext(source.slice(source.indexOf('function rebusImage('), source.indexOf('function cardTools(')),ctx);
vm.runInContext(source.slice(source.indexOf('function startCards('), source.indexOf('/* Woorden en zinnen */')),ctx);
for (const c of rebuses) {
 assert.equal(c.visualRebus.src, 'assets/rebussen/'+c.id+'.png');
 const bytes=fs.readFileSync(path.join(root,c.visualRebus.src));
 assert.equal(bytes.subarray(1,4).toString(),'PNG');
 assert.ok(c.visualRebus.alt && c.visualRebus.explanation);
 assert.deepEqual(c.visualRebus.context,c.taskData.slice(1));
 ctx.list=[c];vm.runInContext("startCards('idioms')",ctx);
 assert.ok(rendered.includes('src="'+c.visualRebus.src+'"'));
 assert.ok(!rendered.match(/<div class="card-situation">[\s\S]*?<\/div><\/div>/)?.[0].includes(c.situation));
 assert.ok(rendered.indexOf('id="cardRebus"')<rendered.indexOf('class="card-instruction"'));
 assert.ok(rendered.includes(c.visualRebus.explanation));
}
console.log('PASS: all 90 pictures, exact card IDs, original contexts, image-first rendering, solution explanations and JSON/runtime parity.');
