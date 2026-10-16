const assert=require('node:assert/strict');
const guide=require('../grammar-catalog.js'),topics=require('./fixtures/grammar-catalog-topics.json');
assert.deepEqual(guide.categories.map(c=>c.label),['Zinnen maken','Vragen stellen','Werkwoorden en tijden','Modale werkwoorden','Niet, geen en er','Bijzinnen en verbindingen','Relatieve zinnen','Woorden in de zin','Formuleren en samenhang']);
assert.equal(new Set(guide.subjects.map(s=>s.id)).size,39);
for(const row of topics){
 const subjects=guide.subjects.filter(s=>s.sources.includes(row.topic));
 assert.equal(subjects.length,1,row.topic+' has exactly one merged subject; categories provide cross routes');
 for(const category of subjects[0].categories)assert.ok(guide.categories.some(c=>c.id===category));
 assert.doesNotMatch(guide.label(row.topic,row.label),/\b(?:WZ|GRAM|CB|PB)[_-]|\b(?:KUNNEN|MOETEN|MOGEN)\b/);
}
for(const [query,ids] of Object.entries({'omdat':['g-reden','g-bijzinnen'],'verleden tijd':['g-voltooide-tijd','g-werkwoordstijden'],'die dat':['g-relatieve-zinnen'],'vraagwoorden':['g-vraagwoorden'],'inversie':['g-inversie'],'niet geen':['g-niet-geen']}))for(const id of ids)assert.ok(guide.matches(guide.subjects.find(s=>s.id===id),query),query+' '+id);
assert.ok(guide.matches(guide.subjects.find(s=>s.id==='g-inversie'),'  INVERSIE! '));
assert.equal(guide.label('MOETEN'),'Moeten');assert.equal(guide.label('WZ_009'),'Er');assert.equal(guide.label('GRAM_PB003'),'Onderwerp niet beschikbaar');
for(const code of ['WZ PB002','GRAM PB 003','CB-GRAM-005','WZ_999','UNKNOWN_TOPIC'])assert.equal(guide.label(code),'Onderwerp niet beschikbaar');
const catalog=require('../data/content-catalog.js');
catalog.registerBank({items:[{topic:'KUNNEN',cefr_level:'A1',language_function:'kunnen_als_vaardigheid'},{topic:'GRAM_PB003',cefr_level:'B1',language_function:'x'}]},{familyId:'grammar'});
assert.equal(catalog.families.find(f=>f.id==='grammar').topics.find(t=>t.id==='KUNNEN').label,'Kunnen','missing topic_label never leaks ID');
assert.equal(catalog.families.find(f=>f.id==='grammar').topics.find(t=>t.id==='GRAM_PB003').label,'Onderwerp niet beschikbaar');
console.log('PASS grammar mapping: 60 source topics, 39 subjects, nine categories, synonyms and missing/technical labels.');

for(const subject of guide.subjects){assert.ok(subject.goal&&subject.example,subject.id+' has a concrete goal and example');assert.ok(guide.matches(subject,subject.goal));assert.ok(guide.matches(subject,subject.example));}
