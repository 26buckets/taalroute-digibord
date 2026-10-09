const assert=require('node:assert/strict');
const engines=require('../game-engine-registry.js');
globalThis.GameEngineRegistry=engines;
const renderers=require('../interaction-renderer-registry.js');
globalThis.InteractionRendererRegistry=renderers;
const source=require('../data/content-vert001-er-b1.js');
const {createContentRuntime}=require('../content-runtime.js');
const runtime=createContentRuntime(source);

const sequence=engines.get('SEQUENCE');
assert.equal(sequence.contentSessionEnabled,true);
assert.equal(sequence.integrationStatus,'CONTENT_READY');
assert.equal(sequence.version,'CONTENTENG-2.0');
assert.ok(sequence.capabilities.includes('TEXT_ORDER'));
assert.deepEqual(sequence.organizations,['class','groups','pairs','individual']);

const orderItems=source.items.filter(item=>item.interaction_type==='IT_008_ORDER');
const otherItems=source.items.filter(item=>item.interaction_type!=='IT_008_ORDER');
assert.equal(orderItems.length,144);
assert.ok(orderItems.every(item=>runtime.compatibility(item,'SEQUENCE').compatible));
assert.ok(otherItems.every(item=>!runtime.compatibility(item,'SEQUENCE').compatible));

assert.deepEqual(runtime.fullCoverageEngines({topics:['ER'],levels:['B1']},'class'),['BOARD','WHEEL','CARDS','DICE']);
assert.deepEqual(runtime.fullCoverageEngines({topics:['ER'],levels:['B1']},'groups'),['BOARD','WHEEL','CARDS','DICE','QUIZ']);
assert.deepEqual(runtime.fullCoverageEngines({topics:['ER'],levels:['B1'],exercise_types:['zinnen_leggen']},'class'),['BOARD','WHEEL','CARDS','DICE','MEMORY','MATCH','SEQUENCE']);
assert.deepEqual(runtime.fullCoverageEngines({topics:['ER'],levels:['B1'],exercise_types:['zinnen_leggen']},'groups'),['BOARD','WHEEL','CARDS','DICE','QUIZ','MEMORY','MATCH','SEQUENCE']);

const session=runtime.createSession({seed:220902,targetDurationSeconds:300,engines:['BOARD','WHEEL','CARDS','DICE','QUIZ','SEQUENCE'],filters:{topics:['ER'],levels:['B1'],exercise_types:['zinnen_leggen']},selectionTopic:'ER',organizationMode:'groups',selectedGameEngine:'SEQUENCE',selectedGameVariant:'rangschikken'});
assert.equal(session.selected_game_engine,'SEQUENCE');
assert.equal(session.organization_mode,'groups');
assert.ok(session.selected_item_ids.every(id=>runtime.itemById(id).interaction_type==='IT_008_ORDER'));
for(const engine of ['BOARD','WHEEL','CARDS','DICE','QUIZ','SEQUENCE'])assert.deepEqual(runtime.enginePool(engine,session).map(item=>item.content_item_id),session.selected_item_ids);

for(const item of orderItems){
 const projection=runtime.project('SEQUENCE',item);
 assert.equal(projection.renderer,'TEXT_ORDER');
 assert.equal(projection.adapter,'text_order');
 const expected=String(item.correct_answer).trim().replace(/[.!?]+$/,'').split(/\s+/).filter(Boolean);
 assert.deepEqual(projection.orderExpectedTokens,expected);
 assert.ok(projection.orderExpectedTokens.length>=2);
}
const splitItem=runtime.itemById('ER_B1_027');
const splitProjection=runtime.project('SEQUENCE',splitItem);
assert.ok(splitProjection.orderTokens.includes('eraan'));
assert.ok(splitProjection.orderExpectedTokens.includes('er'));
assert.ok(splitProjection.orderExpectedTokens.includes('aan'));
assert.ok(!splitProjection.orderExpectedTokens.includes('eraan'));

assert.throws(()=>runtime.createSession({seed:1,targetDurationSeconds:300,engines:['SEQUENCE'],filters:{topics:['ER'],levels:['B1']},selectionTopic:'ER',organizationMode:'class',selectedGameEngine:'SEQUENCE'}),/Geen compatibele content|Onvoldoende content|gekozen spelvorm|volledige gekozen contentselectie/);

console.log('PASS: CONTENT ENG 002 Fase 2 SEQUENCE maps canonical IT_008_ORDER through TEXT_ORDER, uses correct_answer order and never silently narrows mixed content.');
