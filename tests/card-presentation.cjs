const assert=require('node:assert/strict'),source=require('../data/e1-release'),presentation=require('../card-presentation'),wording=require('../wording');
const before=JSON.stringify(source),items=Object.values(source.banks).flatMap(b=>b.items);
const structured=items.filter(i=>presentation.shared(i));assert.equal(structured.length,items.length);
for(const item of structured){const p=presentation.shared(item);assert.ok(p.instruction);if(item.stimulus)assert.equal(p.stimulus,wording.text(item.stimulus));assert.ok(!p.instruction.includes('.:'));if(p.target){assert.ok(p.stimulus.includes(p.target));}if(p.words)assert.ok([p.words.join(' | '),p.words.join(' / ')].includes(p.stimulus));}
for(const card of source.cards.filter(c=>c.family==='spelling')){const p=presentation.standalone(card);assert.ok(p,card.id);assert.ok(p.stimuli.length&&p.steps.length);assert.equal(presentation.standalone({...card,instruction:card.instruction+' changed'}),null);assert.equal(presentation.standalone({...card,version:'other'}),null);}
assert.equal(source.cards.filter(c=>c.family==='spelling').length,40);
const byId=id=>items.find(i=>i.content_item_id===id);
assert.deepEqual(presentation.shared(byId('WZ_001_V14')),{instruction:'Vervang het onderstreepte deel door ‘vandaag’.',stimulus:'Jullie werken morgen.',words:null,target:'morgen',situation:'Werk'});
assert.equal(presentation.shared(byId('WZ_006_H03')).instruction,'Verbeter de zin.');
assert.equal(wording.text('Maak één natuurlijke zin.'),'Maak één zin.');
assert.equal(wording.text('Maak de zin natuurlijk.: De bus niet komt op tijd.'),'Verbeter de zin: De bus niet komt op tijd.');
assert.equal(wording.text('Een natuurlijke mededelende hoofdzin.'),'Een mededelende hoofdzin.');
assert.equal(wording.text('Natuurlijk! Natuurlijke materialen.'),'Natuurlijk! Natuurlijke materialen.');
assert.ok(presentation.standalone(source.cards.find(c=>c.id==='TR-PUZZLES-P002-008-R3')).steps[0].includes('de fiets of de scooter'));
assert.equal(JSON.stringify(source),before);
const order={prompt:'Zet de woorden in volgorde: ik / werk',order_tokens:['ik','werk']};
assert.deepEqual(presentation.shared(order,'Zet de woorden in volgorde: werk | ik').words,['werk','ik']);
for(const card of source.cards.filter(c=>c.family==='verbs')){const p=presentation.standalone(card);assert.ok(p&&p.stimuli.length&&p.steps.length,card.id);if(p.target)assert.ok(p.stimuli.some(t=>t.includes(p.target)),card.id);}
assert.equal(presentation.shared(byId('WZ_024_V14')).target,'moet');
assert.equal(presentation.shared(byId('WZ_024_V14')).instruction,'Vervang het onderstreepte werkwoord door ‘gaan’. Zet het werkwoord in de juiste vorm.');
assert.equal(presentation.shared(byId('WZ_016_V05')).instruction,'Vervang het onderstreepte werkwoord door ‘moeten’. Zet het werkwoord in de juiste vorm.');
for(const series of ['016','024'])for(let n=1;n<=18;n++){
 const item=byId(`WZ_${series}_V${String(n).padStart(2,'0')}`),p=presentation.shared(item);
 const verb=(series==='016'?['moeten','mogen','kunnen','willen']:['moeten','gaan','willen','kunnen'])[(n-1)%4];
 assert.equal(p.instruction,`Vervang het onderstreepte werkwoord door ‘${verb}’. Zet het werkwoord in de juiste vorm.`,item.content_item_id);
 assert.ok(p.target&&item.stimulus.includes(p.target),item.content_item_id);
 assert.equal(p.stimulus,item.stimulus);
 assert.equal(presentation.steps(p.instruction).length,2);
}
assert.equal(byId('WZ_024_V10').model_answer,'Ik ga het formulier invullen.');
assert.equal(byId('WZ_024_V14').model_answer,'Sara gaat de dokter bellen.');
assert.equal(byId('WZ_024_V18').model_answer,'De kinderen gaan buiten spelen.');
assert.equal(presentation.shared(byId('ER_B1_111')).instruction,'Antwoord onpersoonlijk met er.');
assert.equal(presentation.shared(byId('PB007_A2_01_001')).instruction,'Kies wat op de lege plek past.');
assert.equal(presentation.shared(byId('PB005_B1_01_001')).words.length,7);
assert.ok(presentation.shared(byId('REL_B1_081')).stimulus.includes('A:'));
console.log('PASS: all '+items.length+' shared cards, 40 spelling and 40 verb layouts, exact transformation targets, source and constraints retained.');

assert.equal(presentation.heading({language_function:'abstract_existenteel',exercise_type:'invullen'}),'Vul de zin aan');
assert.equal(presentation.heading({language_function:'onpersoonlijk_passief',exercise_type:'herschrijven'}),'Schrijf de zin opnieuw');
assert.equal(presentation.heading({title:'Welke was kapot?',exercise_type:'scenario'}),'Welke was kapot?');
assert.equal(presentation.heading({exercise_type:'unknown'}),'Maak de opdracht');
