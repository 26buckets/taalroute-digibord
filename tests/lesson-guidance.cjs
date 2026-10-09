const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const guidance=require('../content-guidance.js'),data=require('../data/content-guidance.js'),complete=require('../data/lesson-guidance.js'),adapt=require('../content-bank-adapters.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../data/new-activities.js'),'utf8')+';this.activities=window.DIGIBORD_ACTIVITIES;',context);
const banks=[require('../data/snelvragen-content.js'),require('../data/mr03.js'),require('../data/tussen-de-regels.js'),require('../data/content-vert001-er-b1.js'),require('../data/gram-pb003.js'),require('../data/wz-pb003.js'),require('../data/wz-pb004.js'),require('../data/wz-pb005.js'),require('../data/gram-pb002.js'),require('../data/c1-nuance.js'),require('../data/werkvloertaal.js'),require('../data/vergadertaal.js'),require('../data/impliciete-boodschap.js'),require('../data/humor-ironie.js'),require('../data/betekenisnuances.js'),require('../data/herformuleren.js'),require('../data/gesprek-repareren.js'),require('../data/samenvatten-bemiddelen.js'),require('../data/overtuigen-onderhandelen.js'),adapt(require('../Lessen/woorden-zinnen.json')),adapt(require('../data/wz-pb002.js')),require('../data/connections-pilot.js'),adapt.riddles(context.activities)];
for(const bank of banks)if(bank.guidance)guidance.register(bank.guidance);
const items=banks.flatMap(b=>b.items),original=JSON.stringify(items),old=structuredClone(data.bindings);
guidance.complete(items);assert.equal(items.length,8414);assert.equal(JSON.stringify(items),original);
for(const item of items){
 const binding=data.bindings[item.content_item_id];assert.equal(binding.bank_id,item.content_bank_id);assert.equal(binding.item_version,item.version);
 for(const key of ['lowan','erk','f','bow']){assert.ok(guidance.mapping(item,key),item.content_item_id+' '+key);assert.equal(guidance.mapping({...item,version:'changed'},key),null);assert.equal(guidance.mapping({...item,content_bank_id:'unknown'},key),null);}
 for(const field of ['goal','help','check','next'])assert.ok(binding.lesson[field]?.trim(),item.content_item_id+' '+field);
 assert.ok(data.sources[binding.lesson.source]?.title);
 for(const key of ['erk','bow'])if(old[item.content_item_id]?.[key])assert.deepEqual(binding[key],old[item.content_item_id][key],'Existing advice retained');
 assert.equal(binding.lowan.status,'lesson_use');assert.equal(binding.f.status,'lesson_use');assert.equal(binding.lowan.routes,undefined);assert.equal(binding.f.levels,undefined);
}
const counts={};for(const i of items){const status=guidance.mapping(i,'erk').status;counts[status]=(counts[status]||0)+1;}
assert.deepEqual(counts,{source_level:1452,reviewed:6092,source_route:840,not_applicable:30});
const gram=items.find(i=>i.content_item_id==='ER_B1_001'),word=items.find(i=>i.content_item_id==='WZ_001_B01'),modal=items.find(i=>i.content_bank_id==='CB-GRAM-003'&&i.cefr_level==='B1');
assert.equal(guidance.summarize([gram],'erk').status,'B1 · bron');assert.equal(guidance.summarize([gram,modal],'erk').status,'B1 · bron en advies');assert.equal(guidance.summarize([word],'erk').status,'A0 → A1 · route');
assert.match(data.bindings[word.content_item_id].lesson.help,/Lees eerst voor/);
const snapshot=JSON.stringify(data);guidance.complete(items);assert.equal(JSON.stringify(data),snapshot,'Idempotent completion');
const unknown={...gram,content_item_id:'UNKNOWN',content_bank_id:'NEW'};guidance.complete([unknown]);assert.equal(data.bindings.UNKNOWN,undefined);
const changed={...gram,content_item_id:'NEXT',version:'2.0'};guidance.complete([changed]);assert.equal(data.bindings.NEXT,undefined);
const fixture=structuredClone(data);fixture.bindings[gram.content_item_id].item_version='older';assert.throws(()=>complete([gram],fixture),/Andere versie/);
for(const bad of [{status:'source_level',levels:'B1'},{status:'source_level',levels:['']},{status:'lesson_use',use:' '}]){const f=structuredClone(data);f.bindings[gram.content_item_id].erk={...f.bindings[gram.content_item_id].erk,...bad};assert.equal(guidance.mapping(gram,'erk',f),null);}
console.log('PASS lesson guidance: all 8414 current items, four explicit statuses, practical lesson tips, unchanged source/session data, 6092 level reviews, no invented LOWAN/F level, unknown versions blocked.');
