const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/new-activities.js'),'utf8'),context);
const c=JSON.parse(JSON.stringify(context.window.DIGIBORD_ACTIVITIES));
const unique=(items,label)=>assert.equal(new Set(items).size,items.length,label);
for(const key of ['wheel','pictureSets','sorting','sequences','quiz','riddles'])assert.ok(c[key].length>=30,key+' has at least 30 variants');
unique(c.wheel,'wheel topics');assert.equal(c.wheelTitles.length*6,c.wheel.length);c.wheel.forEach(x=>assert.ok(x.length<=48));
const pictures=JSON.parse(fs.readFileSync(path.join(root,'data/storydice.json'),'utf8')).icons;
unique(c.pictureSets.map(s=>s.title),'picture set titles');unique(c.pictureSets.map(s=>[...s.words].sort().join('|')),'picture sets');
for(const set of c.pictureSets){assert.equal(set.words.length,4);unique(set.words,set.title);for(const word of set.words){const image=pictures.find(p=>p.label===word);assert.ok(image,word);assert.ok(fs.existsSync(path.join(root,image.file)),image.file)}}
unique(c.sorting.map(s=>s.title),'sorting titles');
for(const set of c.sorting){assert.equal(set.groups.length,2);assert.equal(set.items.length,6);unique(set.items.map(i=>i[0]),set.title);for(const group of [0,1])assert.equal(set.items.filter(i=>i[1]===group).length,3)}
unique(c.sequences.map(s=>s.title),'sequence titles');for(const set of c.sequences){assert.equal(set.steps.length,4);unique(set.steps,set.title)}
unique(c.quiz.map(q=>q.question),'quiz questions');for(const q of c.quiz){assert.equal(q.options.length,3);unique(q.options,q.question);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);assert.ok([100,200,300].includes(q.points));assert.ok(q.explanation)}
for(const category of new Set(c.quiz.map(q=>q.category)))assert.deepEqual(c.quiz.filter(q=>q.category===category).map(q=>q.points),[100,200,300]);
unique(c.riddles.map(r=>r.word),'riddle answers');for(const r of c.riddles){assert.equal(r.clues.length,3);unique(r.clues,r.word);assert.equal(r.word,r.word.toLocaleLowerCase('nl'))}
console.log('PASS: 30 unique variants in every content bank, valid images, complete sorting groups, sequences, quiz answers and riddle clues.');

const assets=require('../assets/activities/sources.json'),crypto=require('node:crypto');
assert.deepEqual(assets.map(f=>f.name),['DRAAIWIEL','MEMORY','KOPPELEN','SORTEREN','RANGSCHIKKEN','CATEGORIEENQUIZ','RAAD_HET_WOORD','MEER_ACTIVITEITEN'].map((name,i)=>`DIGIBORD_ACT_${name}_VOLWASSEN_FINAL_${i===5?'v02':'v01'}.png`));
for(const file of assets){const bytes=fs.readFileSync(path.join(root,'assets/activities',file.name));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256)}
unique(c.pictureSets.map(s=>s.id),'stable set IDs');
for(const set of c.pictureSets)assert.deepEqual(set.forms,['memory','koppelen']);
console.log('PASS: eight exact final PNGs unchanged, quiz v02, thirty shared content sets.');
