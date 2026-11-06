const assert=require('node:assert/strict'),source=require('../data/e1-release'),presentation=require('../card-presentation'),wording=require('../wording');
const before=JSON.stringify(source),items=Object.values(source.banks).flatMap(b=>b.items);
const structured=items.filter(i=>presentation.shared(i));assert.equal(structured.length,1710);
for(const item of structured){const p=presentation.shared(item);assert.ok(p.instruction);assert.equal(p.stimulus,wording.text(item.stimulus));assert.ok(!p.instruction.includes('.:'));if(p.target){assert.ok(p.stimulus.includes(p.target));assert.ok(p.instruction.includes('onderstreepte'));}if(p.words)assert.equal(p.words.join(' | '),p.stimulus);}
for(const card of source.cards.filter(c=>c.family==='spelling')){const p=presentation.standalone(card);assert.ok(p,card.id);assert.ok(p.stimuli.length&&p.steps.length);assert.equal(presentation.standalone({...card,instruction:card.instruction+' changed'}),null);assert.equal(presentation.standalone({...card,version:'other'}),null);}
assert.equal(source.cards.filter(c=>c.family==='spelling').length,40);
const byId=id=>items.find(i=>i.content_item_id===id);
assert.deepEqual(presentation.shared(byId('WZ_001_V14')),{instruction:'Vervang het onderstreepte deel door ‘vandaag’.',stimulus:'Jullie werken morgen.',words:null,target:'morgen'});
assert.equal(presentation.shared(byId('WZ_006_H03')).instruction,'Verbeter de zin.');
assert.equal(wording.text('Maak één natuurlijke zin.'),'Maak één zin.');
assert.equal(wording.text('Maak de zin natuurlijk.: De bus niet komt op tijd.'),'Verbeter de zin: De bus niet komt op tijd.');
assert.equal(wording.text('Een natuurlijke mededelende hoofdzin.'),'Een mededelende hoofdzin.');
assert.equal(wording.text('Natuurlijk! Natuurlijke materialen.'),'Natuurlijk! Natuurlijke materialen.');
assert.ok(presentation.standalone(source.cards.find(c=>c.id==='TR-PUZZLES-P002-008-R3')).steps[0].includes('de fiets of de scooter'));
assert.equal(JSON.stringify(source),before);
console.log('PASS: 1710 separate instructions/stimuli, 40 spelling layouts, explicit change target, plain wording and unchanged canonical tasks.');
