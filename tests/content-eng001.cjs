const assert=require('node:assert/strict');
const engines=require('../game-engine-registry.js');
globalThis.GameEngineRegistry=engines;
const renderers=require('../interaction-renderer-registry.js');
globalThis.InteractionRendererRegistry=renderers;
const source=require('../data/content-vert001-er-b1.js');
const {createContentRuntime}=require('../content-runtime.js');
const runtime=createContentRuntime(source);

const all=engines.all();
assert.ok(all.length>=13,'existing DigiBord game landscape inventoried');
assert.deepEqual(engines.contentEngines().map(x=>x.id),['BOARD','WHEEL','CARDS','DICE']);
for(const id of ['QUIZ','MEMORY','MATCH','SORT','SEQUENCE','RIDDLE','TAALWORP','STORY_DICE','WORDS'])assert.ok(engines.get(id),id+' inventoried');
assert.equal(engines.get('MEMORY').classification,'GameEngine plus InteractionRenderer');
assert.equal(engines.get('TAALWORP').classification,'GameEngine plus gespecialiseerd contentproduct');
assert.equal(engines.get('WORDS').classification,'Contentproduct plus uitvoeringsmotor');
assert.ok(engines.all().filter(x=>!x.contentSessionEnabled).length>=9,'specialized engines remain visible without false universal compatibility');

const rendererIds=renderers.all().map(x=>x.id).sort();
assert.deepEqual(rendererIds,['CHOICE','OPEN_PROMPT','TEXT_INPUT','TEXT_ORDER']);
const interactionTypes=new Set(source.items.map(x=>x.interaction_type));
for(const type of interactionTypes)assert.ok(renderers.getByInteraction(type),'renderer registered for '+type);
for(const engine of engines.contentEngines())assert.ok(source.items.every(item=>renderers.compatibility(item,engine.id).compatible),engine.id+' covers current PB001 interactions');

const session=runtime.createSession({seed:1001,targetDurationSeconds:600,engines:engines.contentEngines().map(x=>x.id),filters:{topics:['ER'],levels:['B1']},selectionTopic:'ER'});
const ids=session.selected_item_ids;
for(const engine of engines.contentEngines())assert.deepEqual(runtime.enginePool(engine.id,session).map(x=>x.content_item_id),ids,engine.id+' receives one shared SessionConfig');
assert.deepEqual(Object.keys(session.game_engine_versions),['BOARD','WHEEL','CARDS','DICE']);
assert.equal(runtime.PROFILE.engines.includes('DICE'),true);

const fake={...source.items[0],interaction_type:'IT_999_UNKNOWN'};
assert.equal(renderers.compatibility(fake,'BOARD').compatible,false);
assert.equal(renderers.compatibility(fake,'BOARD').reason,'renderer_missing');
assert.equal(renderers.compatibility(source.items[0],'UNKNOWN').compatible,false);

console.log('PASS: CONTENT ENG 001 dynamic GameEngine and InteractionRenderer registers with DICE fourth-engine proof.');
