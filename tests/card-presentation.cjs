const assert=require('node:assert/strict'),source=require('../data/e1-release'),presentation=require('../card-presentation'),wording=require('../wording');
const before=JSON.stringify(source),items=Object.values(source.banks).flatMap(b=>b.items);
const structured=items.filter(i=>presentation.shared(i));assert.equal(structured.length,items.length);
for(const item of structured){const p=presentation.shared(item);assert.ok(p.instruction);if(item.stimulus)assert.equal(p.stimulus,wording.text(item.stimulus));assert.ok(!p.instruction.includes('.:'));if(p.target){assert.ok(p.stimulus.includes(p.target));}if(p.words)assert.ok([p.words.join(' | '),p.words.join(' / ')].includes(p.stimulus));}
for(const card of source.cards.filter(c=>c.family==='spelling')){const p=presentation.standalone(card);assert.ok(p,card.id);assert.ok(p.stimuli.length&&p.steps.length);assert.equal(presentation.standalone({...card,instruction:card.instruction+' changed'}),null);assert.equal(presentation.standalone({...card,version:'other'}),null);}
assert.equal(source.cards.filter(c=>c.family==='spelling').length,40);
const byId=id=>items.find(i=>i.content_item_id===id);
assert.deepEqual(presentation.shared(byId('WZ_001_V14')),{instruction:'Vervang het onderstreepte deel door ‘vandaag’.',stimulus:'Jullie werken morgen.',words:null,target:'morgen',situation:''});
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

// Theme metadata must not invent a situation for a grammar sentence.
assert.equal(presentation.shared(byId('WZ_018_K04')).situation,'');
assert.equal(presentation.shared({content_item_id:'WZ_TEST',prompt:'Vertel over je werk.',context:'Werk'}).situation,'Werk');
assert.equal(presentation.shared({content_item_id:'WZ_TEST',prompt:'Kies de juiste zin.',stimulus:'Hij werkt.',context:'Je collega vertelt over zijn nieuwe baan.'}).situation,'Je collega vertelt over zijn nieuwe baan.');
assert.equal(presentation.clearInstruction('Welke herformulering bewaart de voorwaarde precies?'),'Welke versie bewaart de voorwaarde precies?');
assert.equal(presentation.clearInstruction('Zet de woorden in de juiste volgorde: geïnterpreteerd / anders'),'Zet de woorden in de juiste volgorde: geïnterpreteerd / anders');
const nuance=byId('C1_NU_008');
assert.equal(presentation.shared(nuance).instruction,'Hoe bedoelt de voorzitter ‘misschien’?');
assert.equal(presentation.learnerText(nuance,nuance.options[1]),'B. De voorzitter zegt voorzichtig dat de groep eerst de cijfers moet controleren.');
assert.equal(nuance.options.indexOf(nuance.correct_answer),1);
assert.equal(presentation.learnerText({content_item_id:'other'},nuance.options[1]),nuance.options[1]);
console.log('PASS: learner instructions, exact options/answer mapping, real situations retained and generic grammar themes omitted.');

assert.equal(presentation.shared({content_item_id:"WZ_TEST",exercise_type:"scenario",prompt:"Wat zeg je?",stimulus:"Ik wil koffie.",context:"Eten en drinken"}).situation,"Eten en drinken");

// Given context must answer the question; open follow-ups must name the learner's choice.
const direct=id=>presentation.standalone(source.cards.find(c=>c.id===id));
assert.match(direct('TR-SPELLING-P001-013-R3').situation,/nieuwe cursisten/);
assert.match(direct('TR-SPELLING-P001-004-R1').steps.join(' '),/Bedenk waar/);
assert.match(direct('TR-PUZZLES-P001-014-R3').steps.join(' '),/Bedenk waarom/);
assert.doesNotMatch(direct('TR-PUZZLES-P001-020-R6').situation+' '+direct('TR-PUZZLES-P001-020-R6').steps.join(' '),/ANTWOORD/);
assert.match(direct('TR-PUZZLES-P002-006-R2').steps[1],/Kies een van de drie/);
assert.equal(JSON.stringify(source),before);
assert.equal(direct('TR-PUZZLES-P001-020-R6').title,'Een woord in een woord');
console.log('PASS: answerable context, explicit invented follow-ups, retained answer keys.');

assert.match(presentation.readAloud(source.cards.find(c=>c.id==='TR-SPELLING-P001-013-R3')),/informatieavond voor nieuwe cursisten/);
assert.match(presentation.readAloud(source.cards.find(c=>c.id==='TR-PUZZLES-P001-014-R3')),/Bedenk waarom/);

// A title or a second instruction must not reveal a closed spelling/verb answer.
for(const [id,answer] of [
 ['TR-SPELLING-P002-010-R3','apostrof'],['TR-VERBS-P001-006-R1','eten'],['TR-SPELLING-P001-008-R2','boekje'],['TR-SPELLING-P001-006-R1','bomen'],['TR-SPELLING-P001-009-R2','begint'],['TR-SPELLING-P001-014-R3','foto’s'],['TR-SPELLING-P002-007-R2','klantenservice'],['TR-SPELLING-P002-009-R3','sms’je'],['TR-SPELLING-P002-014-R4','coördinator'],['TR-SPELLING-P002-016-R5','gedownloade'],
 ['TR-VERBS-P001-001-R0','Ik drink thee'],['TR-VERBS-P001-002-R0','De bus is er'],['TR-VERBS-P001-009-R2','gemaakt'],['TR-VERBS-P001-016-R4','kunnen komen'],['TR-VERBS-P002-002-R0','werkt'],['TR-VERBS-P002-003-R1','belt'],['TR-VERBS-P002-006-R2','moest']
]){const p=direct(id),visible=[p.title,p.situation,...p.steps].join(' ').toLocaleLowerCase('nl');assert(!visible.includes(answer.toLocaleLowerCase('nl')),id+' reveals '+answer)}
console.log('PASS: no premature answers in reviewed spelling/verb titles and instructions.');
