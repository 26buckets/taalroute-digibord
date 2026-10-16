const assert=require('node:assert/strict');
const engines=require('../game-engine-registry.js');
globalThis.GameEngineRegistry=engines;
const renderers=require('../interaction-renderer-registry.js');
globalThis.InteractionRendererRegistry=renderers;
const source=require('../data/content-vert001-er-b1.js');
const {createContentRuntime}=require('../content-runtime.js');
const runtime=createContentRuntime(source);

assert.equal(engines.get('QUIZ').contentSessionEnabled,true);
assert.equal(engines.get('QUIZ').integrationStatus,'CONTENT_READY');
assert.ok(['PROMPT','CHOICE','TEXT_INPUT','TEXT_ORDER','FEEDBACK','SCORING','TEAMS','TURNS'].every(cap=>engines.get('QUIZ').capabilities.includes(cap)));
assert.deepEqual(engines.get('QUIZ').organizations,['groups']);
assert.ok(source.items.every(item=>runtime.compatibility(item,'QUIZ').compatible),'QUIZ supports every PB001 renderer through automatic or teacher grading');
assert.equal(runtime.eligibleItems(['BOARD','WHEEL','CARDS','DICE','QUIZ'],{topics:['ER'],levels:['B1']}).length,180);

const session=runtime.createSession({seed:2209,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS','DICE','QUIZ'],filters:{topics:['ER'],levels:['B1']},selectionTopic:'ER',organizationMode:'groups',selectedGameEngine:'QUIZ',selectedGameVariant:'categorieenquiz'});
assert.equal(session.selected_game_engine,'QUIZ');
assert.equal(session.organization_mode,'groups');
const ids=session.selected_item_ids;
for(const engine of ['BOARD','WHEEL','CARDS','DICE','QUIZ'])assert.deepEqual(runtime.enginePool(engine,session).map(x=>x.content_item_id),ids);
assert.throws(()=>runtime.createSession({seed:1,targetDurationSeconds:300,engines:['QUIZ'],filters:{topics:['ER'],levels:['B1']},selectionTopic:'ER',organizationMode:'class',selectedGameEngine:'QUIZ'}),/organisatievorm/);

const choice=source.items.find(item=>item.options.length>=2&&runtime.answerPolicy(item).mode==='canonical_answer');
const open=source.items.find(item=>runtime.answerPolicy(item).mode==='teacher_or_peer_review');
assert.ok(choice&&open);
assert.equal(runtime.project('QUIZ',choice).renderer,'CHOICE');
assert.equal(runtime.project('QUIZ',open).renderer,'OPEN_PROMPT');
assert.equal(runtime.answerPolicy(open).requiresExactMatch,false);

console.log('PASS: CONTENT ENG 002 QUIZ uses the shared SessionConfig, full PB001 renderer coverage, team-only organization guard and no content copies.');
