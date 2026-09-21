const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const data = JSON.parse(read('data/curriculum.json'));
const bundled = JSON.parse(read('curriculum.js').split('const TAALROUTE_CURRICULUM = ')[1].split(';\n\nconst curriculumPanel')[0]);
assert.deepEqual(bundled,data.books);
assert.equal(data.books.length,10);
assert.equal(new Set(data.books.map(b=>b.id)).size,10);
const ids=new Set();
for(const book of data.books){
 assert.equal(book.themes.length,book.id.startsWith('alfa-')?16:8);
 assert.equal(book.themeIds.length,book.themes.length);
 assert.equal(book.focus.length,book.themes.length);
 assert.ok(book.themes.every(t=>typeof t==='string'&&t.trim()));
 assert.equal(new Set(book.themeIds).size,book.themeIds.length);
 book.themeIds.forEach(id=>ids.add(id));
}
assert.equal(ids.size,72);
assert.equal(data.sourceStatus,'candidate_not_active');
assert.equal((read('index.html').match(/id="curriculumPanel"/g)||[]).length,1);
assert.match(read('index.html'),/gamecard-live[^>]*disabled/);
console.log('PASS: 56 regular + 16 shared Alfa themes, all source identities preserved, runtime/JSON parity, Live disabled.');
