const assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=require('../data/e1-release.js'),cases=require('../data/quick-lesson-cases.js'),{lesson}=require('../quick-lesson-guidance.js');
const before=JSON.stringify(source),items=Object.values(source.banks).filter(b=>b.family_id==='quick').flatMap(b=>b.items);
assert.equal(items.length,3500);assert.equal(cases.scenarios.length,125);assert.ok(cases.scenarios.every(row=>row.length===2&&row.every(Boolean)));assert.deepEqual(cases.tellStarts.map(a=>a.length),[125,125,125]);
for(const item of items){
 const guide=lesson(item);assert.ok(guide,item.content_item_id);
 for(const field of ['goal','help','check','discussion','activity'])assert.ok(guide[field]?.trim(),item.content_item_id+': '+field);
 assert.equal(new Set([guide.goal,guide.help,guide.check,guide.discussion]).size,4,item.content_item_id);
 assert.ok(!JSON.stringify(guide).includes('kernboodschap'),item.content_item_id);
 assert.equal(lesson({...item,version:'old-version'}),null);
 assert.equal(lesson({...item,prompt:item.prompt+' Changed.'}),null);
 assert.equal(lesson({...item,content_bank_id:'other'}),null);
}
assert.equal(JSON.stringify(source),before,'Source banks must not be mutated');
assert.equal(lesson({content_item_id:'other'}),null);
const byId=id=>items.find(i=>i.content_item_id===id);
assert.equal(lesson(byId('sq-r0-circle-002')).help,'Ik spreek …');
assert.ok(lesson(byId('sq-r0-circle-002')).goal.includes('taal'));
assert.ok(lesson(byId('sq-r0-circle-002')).check.includes('Een kort antwoord is genoeg'));
assert.ok(lesson(byId('sq-r3-circle-007')).discussion.includes('inloggen'));
assert.ok(lesson(byId('sq-r3-circle-116')).discussion.includes('zeker'));
assert.ok(lesson(byId('sq-r3-circle-116')).check.includes('onbekende oorzaak'));
assert.ok(lesson(byId('sq-r5-triangle-001')).help.includes('zolang'));
assert.ok(lesson(byId('sq-r6-square-002')).check.includes('verschillend'));
console.log('PASS lesson support: 3500 source-bound tasks; 125 situations; 375 specific sentence starters; source SHA256 '+crypto.createHash('sha256').update(before).digest('hex'));
