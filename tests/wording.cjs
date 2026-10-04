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
// E1.0 sources are immutable under Nico's R25 instruction; wording is applied at display time.
const e1Path=path.join(root,'data/e1-release.js');
if(fs.existsSync(e1Path)){const e1=require(e1Path);assert.equal(e1.source_sha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'tests/fixtures/e1-release-source.json'))).digest('hex'));for(const bank of Object.values(e1.banks))for(const item of bank.items)for(const key of ['prompt','context','model_answer','feedback_correct','feedback_incorrect','explanation','help'])assert.ok(!/\bfictie(?:f|ve)\b|\bbuur\b/i.test(wording.text(item[key])),item.content_item_id+' '+key);}
// Restored Taalmix records are exact historical sources; retain their hash and normalize only the visible text.
for(const c of require('./fixtures/p0-restored-rebuses-80.json').cards)for(const text of [c.instruction,c.situation,c.goal,c.model.text,...c.help.items])assert.ok(!/\bbuur\b|\bfictie(?:f|ve)\b/i.test(wording.text(text)),c.id+' normalized historical wording');
const files=[...fs.readdirSync(root).filter(f=>/\.(js|html)$/.test(f)&&f!=='wording.js'),...fs.readdirSync(path.join(root,'data')).filter(f=>/\.(js|json)$/.test(f)).map(f=>'data/'+f).filter(f=>f!=='data/e1-release.js'),'settings/settings.js','settings/index.html'];
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
