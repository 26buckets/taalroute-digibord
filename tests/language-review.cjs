// Regression checks for concrete defects found in the editorial review.
// These checks support, but cannot replace, a Dutch-language editorial review.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const b=JSON.parse(fs.readFileSync(__dirname+'/../Lessen/opdrachtenmatrix.json','utf8'));
const get=(r,topic,n,shape)=>b.cards.find(c=>c.id===`mx-${r}-${topic}-${String(n).padStart(2,'0')}-${shape}`);
for(const c of b.cards){
 assert.ok(!/je getal staat|verzonnen land|duurdere versie is groter|mijn keuze doen|Volgend jaar wil ik ook brood|Waarom is het nu anders\?/i.test(c.instruction+' '+c.model),c.id);
 if(c.routeId==='route-0')assert.ok(c.instruction.split(/\s+/).length<=18,c.id+' beginner instruction too long');
}
for(let n=1;n<=10;n++){
 const cashier=get(3,'winkelen',n,'diamond');assert.match(cashier.input,/winkelmedewerker/i);assert.match(cashier.input,/afspraak|correctie|oplossing/i);assert.ok(cashier.instruction.trim()&&cashier.model.trim());
 const price=get(2,'winkelen',n,'triangle');const costs=[...price.input.matchAll(/voor (\d+) euro/g)].map(m=>+m[1]);assert.equal(costs.length,2);assert.ok(costs[0]<costs[1]);assert.match(price.input,/hoeveelheid is gelijk/);
 const late=get(2,'onderweg',n,'diamond');assert.match(late.input,/14\.00 uur/);assert.match(late.input,/tien minuten/);assert.match(late.model,/tien over twee/);
 const form=get(0,'kennismaken',n,'diamond');assert.match(form.input,/Formulier:/);assert.match(form.input,/Goed:/);
 if(n!==4)assert.doesNotMatch(get(2,'spullen',n,'circle').model,/Ik gebruik het om/);
}
for(let n=6;n<=10;n++)assert.doesNotMatch(get(3,'in-de-les',n,'triangle').model,/eerst.*daarna.*keuze|eerst mijn|vijf minuten/);
assert.equal(get(0,'in-de-les',10,'diamond').model,'Tot ziens!');
assert.match(get(2,'in-de-les',10,'diamond').input,/maandag om 9\.00/);
assert.match(get(2,'in-de-les',10,'diamond').model,/maandag om negen/);
assert.match(get(0,'dagelijks',2,'diamond').model,/Wil je ook water/);
assert.notEqual(get(0,'in-de-les',1,'square').model,get(0,'in-de-les',1,'diamond').model);
// Independently specified finite forms and participles for all 24 verbs.
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/../Lessen/zinnenspel.js','utf8'),ctx);const S=ctx.DigiBoardSentence;
const forms=[
 ['werken','werk','werkt','werken','werkte','werkten','gewerkt','heb','thuis',''],['wonen','woon','woont','wonen','woonde','woonden','gewoond','heb','in Utrecht',''],['leren','leer','leert','leren','leerde','leerden','geleerd','heb','Nederlands',''],['koken','kook','kookt','koken','kookte','kookten','gekookt','heb','rijst',''],['drinken','drink','drinkt','drinken','dronk','dronken','gedronken','heb','water',''],['eten','eet','eet','eten','at','aten','gegeten','heb','een appel',''],['lezen','lees','leest','lezen','las','lazen','gelezen','heb','een boek',''],['slapen','slaap','slaapt','slapen','sliep','sliepen','geslapen','heb','acht uur',''],['maken','maak','maakt','maken','maakte','maakten','gemaakt','heb','een foto',''],['kopen','koop','koopt','kopen','kocht','kochten','gekocht','heb','een brood',''],['zoeken','zoek','zoekt','zoeken','zocht','zochten','gezocht','heb','een sleutel',''],['luisteren','luister','luistert','luisteren','luisterde','luisterden','geluisterd','heb','naar muziek',''],['bellen','bel','belt','bellen','belde','belden','gebeld','heb','met een vriend',''],['wachten','wacht','wacht','wachten','wachtte','wachtten','gewacht','heb','op de bus',''],['spelen','speel','speelt','spelen','speelde','speelden','gespeeld','heb','een spel',''],['praten','praat','praat','praten','praatte','praatten','gepraat','heb','met de buren',''],['lopen','loop','loopt','lopen','liep','liepen','gelopen','ben','naar de winkel',''],['fietsen','fiets','fietst','fietsen','fietste','fietsten','gefietst','ben','naar school',''],['gaan','ga','gaat','gaan','ging','gingen','gegaan','ben','naar huis',''],['komen','kom','komt','komen','kwam','kwamen','gekomen','ben','naar de les',''],['zien','zie','ziet','zien','zag','zagen','gezien','heb','een vogel',''],['geven','geef','geeft','geven','gaf','gaven','gegeven','heb','een cadeau',''],['opstaan','sta','staat','staan','stond','stonden','opgestaan','ben','om zeven uur','op'],['meenemen','neem','neemt','nemen','nam','namen','meegenomen','heb','een tas','mee']
];
const subjects=['Ik','Jij','Zij','Wij','Jullie','Zij'],all=[];
for(const [verb,ik,singular,plural,past,pastPlural,pp,aux,rest,particle] of forms)for(let person=0;person<6;person++){
 const tail=rest+(particle?' '+particle:'');
 const expected={present:`${subjects[person]} ${person===0?ik:person<3?singular:plural} ${tail}.`,past:`${subjects[person]} ${person<3?past:pastPlural} ${tail}.`,perfect:`${subjects[person]} ${(aux==='heb'?['heb','hebt','heeft','hebben','hebben','hebben']:['ben','bent','is','zijn','zijn','zijn'])[person]} ${rest} ${pp}.`};
 for(const tense of ['present','past','perfect']){const actual=S.answer({person,verb,tense});assert.equal(actual,expected[tense]);all.push({person:person+1,verb,tense,answer:actual});}
}
fs.mkdirSync(__dirname+'/artifacts',{recursive:true});fs.writeFileSync(__dirname+'/artifacts/language-review.json',JSON.stringify({cards:960,sentenceCombinations:all.length,regressions:'form fields, quantities, times, personal choices, pronouns, greetings, beginner instruction length',sentences:all},null,2));
console.log('PASS language regressions and all 432 sentences against reviewed Dutch forms');
