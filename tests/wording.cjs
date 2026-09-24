const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),wording=require('../wording.js'),retained=require('./fixtures/wording-retained-sources.json');
assert.equal(wording.text('Mijn buur. Buur! BUUR?'), 'Mijn buurman. Buurman! BUURMAN?');
assert.equal(wording.text('buurvrouw, buurman, buren, buurt, buurthuis'), 'buurvrouw, buurman, buren, buurt, buurthuis');
assert.equal(wording.text(null),'');assert.equal(wording.text('<b>buur</b>'),'<'+'b>buurman</b>');
const files=[...fs.readdirSync(root).filter(f=>/\.(js|html)$/.test(f)&&f!=='wording.js'),...fs.readdirSync(path.join(root,'data')).filter(f=>/\.(js|json)$/.test(f)).map(f=>'data/'+f),'settings/settings.js','settings/index.html'];
for(const file of files){const source=fs.readFileSync(path.join(root,file));if(!/\bbuur\b/i.test(source.toString()))continue;assert.ok(retained[file],file+': new content must use buurman or buurvrouw');assert.equal(crypto.createHash('sha256').update(source).digest('hex'),retained[file],file+': retained source changed; use a clean review overlay');}
const card={id:'TR-TONGUE-D240-A2-018',audio:{src:'old.mp3'}};
assert.ok(fs.statSync(path.join(root,wording.audio(card))).size>1000);assert.equal(wording.audio({...card,id:'other'}),'old.mp3');assert.equal(card.audio.src,'old.mp3');
for(const file of ['index.html','settings/index.html']){const html=fs.readFileSync(path.join(root,file),'utf8');assert.ok(html.indexOf('wording.js')<html.indexOf(file==='index.html'?'app.js?':'settings.js?'));}
console.log('PASS fixed wording: complete words, case, existing buurvrouw/buurman unchanged, retained sources protected, new content guarded, matching audio and early loading.');
