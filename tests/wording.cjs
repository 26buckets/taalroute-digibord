const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),wording=require('../wording.js'),retained=require('./fixtures/wording-retained-sources.json');
assert.equal(wording.text('Mijn buur. Buur! BUUR?'), 'Mijn buurman. Buurman! BUURMAN?');
assert.equal(wording.text('buurvrouw, buurman, buren, buurt, buurthuis'), 'buurvrouw, buurman, buren, buurt, buurthuis');
assert.equal(wording.text(null),'');assert.equal(wording.text('<b>buur</b>'),'<'+'b>buurman</b>');
for(const [before,after] of [
 ['Een fictieve medewerker. Een fictieve\u00a0klant.','Een medewerker. Een klant.'],
 ['Het fictieve personage kan donderdag.','De medewerker kan donderdag.'],
 ['Een denkbeeldige medewerker en een verzonnen persoon.','Een medewerker en een persoon.'],
 ['Een fictief team. De situatie is fictief. Kies een tijd.','Een team. Kies een tijd.'],
 ['Alle gegevens zijn fictief.',''],
 ['Een eigen, fictief of ontkennend antwoord is goed.','Een eigen of ontkennend antwoord is goed.'],
 ['Alle persoonsgegevens mogen fictief zijn.','Alle persoonsgegevens mag je zelf bedenken.'],
 ['De casus is fictief en niet acuut.','Er is geen spoed.'],
 ['Het verhaal is fictief; laat geen echte adressen of bezorggegevens noemen.','Laat geen persoonlijke adressen of bezorggegevens noemen.'],
 ['Als ik zeg waarom, voeg ik een fictief motief toe.','Als ik zeg waarom, voeg ik een motief toe dat niet in de tekst staat.'],
 ['Gebruik alleen fictieve gegevens.','Je mag zelf gegevens kiezen.'],
 ['Een denkbeeldige voorwaarde. De resultaten waren verzonnen.','Een denkbeeldige voorwaarde. De resultaten waren verzonnen.']
]){assert.equal(wording.text(before),after);assert.equal(wording.text(after),after)}
const files=[...fs.readdirSync(root).filter(f=>/\.(js|html)$/.test(f)&&f!=='wording.js'),...fs.readdirSync(path.join(root,'data')).filter(f=>/\.(js|json)$/.test(f)).map(f=>'data/'+f),'settings/settings.js','settings/index.html'];
const editorialRetained=require('./fixtures/wording-editorial-retained-sources.json');
for(const file of [...files,...fs.readdirSync(path.join(root,'Lessen')).filter(f=>/\.(js|json)$/.test(f)).map(f=>'Lessen/'+f)]){
 const source=fs.readFileSync(path.join(root,file));if(!/\bfictie(?:f|ve)\b|\b(?:denkbeeldige|verzonnen) (?:medewerker|persoon|collega|buurman|buurvrouw|ouder|klant|gesprekspartner|vriend|huisgenoot)\b/i.test(source.toString()))continue;
 assert.equal(crypto.createHash('sha256').update(source).digest('hex'),editorialRetained[file],file+': new content must use ordinary role names without editorial labels');
}
for(const file of files){const source=fs.readFileSync(path.join(root,file));if(!/\bbuur\b/i.test(source.toString()))continue;assert.ok(retained[file],file+': new content must use buurman or buurvrouw');assert.equal(crypto.createHash('sha256').update(source).digest('hex'),retained[file],file+': retained source changed; use a clean review overlay');}
const card={id:'TR-TONGUE-D240-A2-018',audio:{src:'old.mp3'}};
assert.ok(fs.statSync(path.join(root,wording.audio(card))).size>1000);assert.equal(wording.audio({...card,id:'other'}),'old.mp3');assert.equal(card.audio.src,'old.mp3');
for(const file of ['index.html','settings/index.html']){const html=fs.readFileSync(path.join(root,file),'utf8');assert.ok(html.indexOf('wording.js')<html.indexOf(file==='index.html'?'app.js?':'settings.js?'));}
console.log('PASS fixed wording: complete words, case, existing buurvrouw/buurman unchanged, retained sources protected, new content guarded, matching audio and early loading.');
