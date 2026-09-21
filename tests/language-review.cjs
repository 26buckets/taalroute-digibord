// Regression checks for concrete defects found in the editorial review.
// These checks support, but cannot replace, a Dutch-language editorial review.
const assert=require('node:assert/strict'),fs=require('node:fs');
const b=JSON.parse(fs.readFileSync(__dirname+'/../Lessen/opdrachtenmatrix.json','utf8'));
const get=(r,topic,n,shape)=>b.cards.find(c=>c.id===`mx-${r}-${topic}-${String(n).padStart(2,'0')}-${shape}`);
for(const c of b.cards){
 assert.ok(!/je getal staat|verzonnen land|duurdere versie is groter|mijn keuze doen|Volgend jaar wil ik ook brood|Waarom is het nu anders\?/i.test(c.instruction+' '+c.model),c.id);
 if(c.routeId==='route-0')assert.ok(c.instruction.split(/\s+/).length<=18,c.id+' beginner instruction too long');
}
const route1=b.cards.filter(c=>c.routeId==='route-1');
assert.equal(route1.length,240);
assert.equal(new Set(route1.map(c=>c.id)).size,240);
assert.equal(new Set(route1.map(c=>c.instruction.trim().toLowerCase())).size,240);
assert.equal(new Set(route1.map(c=>c.model.trim().toLowerCase())).size,240);
for(const c of route1){
 const words=s=>s.trim().split(/\s+/).length;
 assert.ok(words(c.instruction)<=17,c.id+' A1-A1+ instruction too long');
 assert.ok(words(c.input)<=14,c.id+' A1-A1+ context too long');
 assert.ok(words(c.model)<=13,c.id+' A1-A1+ model too long');
 assert.doesNotMatch(c.model,/\b(naar|met|de|het|een|om|van|in|te|bij|als|en|of)\.$/i,c.id+' truncated model');
 if(c.shape==='circle')assert.match(c.instruction,/Vertel|Stel jezelf/);
 if(c.shape==='square')assert.match(c.instruction,/Vraag|Hoe |Wat |Waar |Wanneer |Welke |Van wie/);
 if(c.shape==='triangle')assert.match(c.instruction,/Kies/);
 if(c.shape==='diamond')assert.match(c.instruction,/Vraag|Meld|Laat|Spreek|Stel|Bel|Zeg/i);
}
assert.doesNotMatch(route1.map(c=>c.instruction+' '+c.input).join(' '),/wat is jouw huisnummer|wat is je huisnummer|wat is jouw exacte adres/i);
const route2=b.cards.filter(c=>c.routeId==='route-2');
assert.equal(route2.length,240);
assert.equal(new Set(route2.map(c=>c.id)).size,240);
assert.equal(new Set(route2.map(c=>c.instruction.trim().toLowerCase())).size,240);
assert.equal(new Set(route2.map(c=>c.model.trim().toLowerCase())).size,240);
for(const c of route2){
 const words=s=>s.trim().split(/\s+/).length;
 assert.ok(words(c.instruction)<=18,c.id+' A1-A2 instruction too long');
 assert.ok(words(c.input)<=13,c.id+' A1-A2 context too long');
 assert.ok(words(c.model)<=17,c.id+' A1-A2 model too long');
 if(c.shape==='circle')assert.match(c.instruction,/Vertel|Stel jezelf/);
 if(c.shape==='square'){assert.match(c.instruction,/Vraag|Hoe |Wat |Waar |Wanneer |Welke |Van wie/);assert.doesNotMatch(c.instruction,/Vertel daarna/i);}
 if(c.shape==='triangle')assert.match(c.instruction,/Kies/);
 if(c.shape==='diamond')assert.match(c.instruction,/Vraag|Meld|Laat|Spreek|Stel|Bel|Zeg/i);
}
assert.doesNotMatch(route2.map(c=>c.instruction+' '+c.input).join(' '),/wat is jouw huisnummer|wat is je huisnummer|wat is jouw exacte adres/i);
for(let n=1;n<=10;n++){
 const cashier=get(3,'winkelen',n,'diamond');assert.match(cashier.input,/winkelmedewerker/i);assert.match(cashier.input,/afspraak|correctie|oplossing/i);assert.ok(cashier.instruction.trim()&&cashier.model.trim());
}
assert.match(get(0,'kennismaken',1,'diamond').input,/Sam.*Sami/);
assert.equal(get(0,'kennismaken',1,'diamond').model,'Ik heet Sami, niet Sam.');
assert.equal(get(0,'kennismaken',7,'diamond').model,'Donderdag, niet dinsdag.');
const route0=b.cards.filter(c=>c.routeId==='route-0');
assert.equal(new Set(route0.map(c=>c.instruction)).size,240);
for(const c of route0){
 assert.ok(c.instruction.split(/\s+/).length<=13,c.id);
 assert.ok(c.model.split(/\s+/).length<=12,c.id);
 assert.equal(c.version,2);
 assert.match(c.support,/…/);
 assert.doesNotMatch(c.instruction,/Wat is jouw huisnummer|exacte adres|Leg uit waarom|Noem twee redenen/i);
}
for(let n=6;n<=10;n++)assert.doesNotMatch(get(3,'in-de-les',n,'triangle').model,/eerst.*daarna.*keuze|eerst mijn|vijf minuten/);
assert.equal(get(0,'in-de-les',10,'diamond').model,'Tot ziens!');
assert.match(get(0,'dagelijks',2,'diamond').model,/Wil je ook water/);
assert.notEqual(get(0,'in-de-les',1,'square').model,get(0,'in-de-les',1,'diamond').model);
console.log('PASS: preserved editorial bank regressions.');
