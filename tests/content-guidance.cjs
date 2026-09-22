const assert=require('node:assert/strict');
const guidance=require('../content-guidance.js'),data=require('../data/content-guidance.js');
const bank=require('../data/content-vert001-er-b1.js');
const items=bank.items.filter(i=>i.cefr_level==='B1'&&i.topic==='ER');
assert.equal(guidance.summarize(items,'bow').known.length,3);
for(const key of ['lowan','erk','f'])assert.equal(guidance.summarize(items,key).status,'Nog niet gekoppeld');
for(const [id,b] of Object.entries(data.bindings)){
 const item=bank.items.find(i=>i.content_item_id===id);assert.ok(item);assert.equal(item.version,b.item_version);
 assert.equal(item.content_bank_id,b.bank_id);assert.ok(guidance.mapping(item,'bow'));
 assert.equal(guidance.mapping({...item,version:'next'},'bow'),null);
 assert.equal(guidance.mapping({...item,content_bank_id:'other'},'bow'),null);
}
// Synthetic mappings exercise aggregation; these are never shipped as validated content.
const fixture=structuredClone(data),[a,b,c]=items;
const reviewed={status:'reviewed',source:'grammar',version:'test',evidence:'test-only',levels:['B1'],skill:'Lezen',goal:'Test'};
fixture.bindings[a.content_item_id].erk=reviewed;
fixture.bindings[b.content_item_id].erk={...reviewed,levels:['B2']};
assert.equal(guidance.summarize([a,b,c],'erk',fixture).status,'Meerdere');
assert.equal(guidance.summarize([a,c],'erk',fixture).status,'Deels gekoppeld');
assert.equal(guidance.summarize([a],'erk',fixture).status,'B1');
assert.equal(guidance.summarize([a],'f',fixture).status,'Nog niet gekoppeld');
fixture.bindings[a.content_item_id].erk={...reviewed,evidence:''};
assert.equal(guidance.summarize([a],'erk',fixture).status,'Nog niet gekoppeld');
fixture.bindings[a.content_item_id].erk={...reviewed,status:'not_applicable'};
assert.equal(guidance.summarize([a],'erk',fixture).status,'Niet van toepassing');
assert.equal(guidance.summarize([],'erk').status,'Nog niet gekoppeld');
assert.equal(data.criteria.support.code,'A3f');assert.equal(data.criteria.feedback.code,'A3g');
console.log('Guidance: independent mappings, sources, versions, partial sets and missing values OK');
