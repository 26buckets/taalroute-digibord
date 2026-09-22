const assert=require('node:assert/strict');
const source=require('../data/content-vert001-er-b1.js');
const {createContentRuntime}=require('../content-runtime.js');
const runtime=createContentRuntime(source);

assert.equal(source.items.length,1440);
assert.equal(new Set(source.items.map(x=>x.content_item_id)).size,1440);
assert.equal(source.source_version,'1.2');
assert.ok(source.items.every(x=>x.review_status==='REVIEW_GO'&&x.publication_status==='staging_only'));
const expected={ER:180,ZULLEN:150,ZOUDEN:150};
for(const topic of Object.keys(expected))for(const level of ['A2','B1','B2'])assert.equal(runtime.filterSource({topics:[topic],levels:[level]}).length,expected[topic],topic+' '+level);
assert.equal(runtime.filterSource({topics:['ZULLEN','ZOUDEN'],family_tags:['MODAAL']}).length,900);
for(const level of ['A2','B1','B2'])assert.equal(runtime.filterSource({topics:['ZULLEN','ZOUDEN'],levels:[level],family_tags:['MODAAL']}).length,300);

const exerciseTypes=[...new Set(source.items.map(x=>x.exercise_type))].sort();
assert.deepEqual(exerciseTypes,['betekenis_kiezen','dialoog_aanvullen','fout_verbeteren','functie_sorteren','herschrijven','invullen','meerkeuze_context','meerkeuze_vorm','scenario','snelvraag','vrije_productie','zinnen_leggen'].sort());
const order=source.items.filter(x=>x.interaction_type==='IT_008_ORDER');
assert.equal(order.length,144);
for(const engine of ['BOARD','WHEEL','CARDS','DICE']){
 assert.ok(source.items.every(item=>runtime.compatibility(item,engine).compatible),engine+' supports all 1440 through direct or safe adapter');
 assert.ok(order.every(item=>runtime.compatibility(item,engine).mode==='COMPATIBLE_WITH_ADAPTER'),engine+' ORDER adapter');
}
assert.equal(runtime.eligibleItems(['BOARD','WHEEL','CARDS','DICE']).length,1440);
assert.equal(runtime.availability({exercise_types:['zinnen_leggen']}).common_count,144);

for(const topic of ['ER','ZULLEN','ZOUDEN']){
 for(const level of ['A2','B1','B2']){
  const session=runtime.createSession({seed:77,targetDurationSeconds:300,filters:{topics:[topic],levels:[level]},selectionTopic:topic,engines:['BOARD','WHEEL','CARDS','DICE']});
  assert.equal(session.topic,topic);assert.equal(session.cefr_level,level);
  assert.ok(session.selected_item_ids.length>0);
  assert.ok(session.selected_item_ids.every(id=>{const x=runtime.itemById(id);return x.topic===topic&&x.cefr_level===level}));
  const board=runtime.enginePool('BOARD',session),wheel=runtime.enginePool('WHEEL',session),cards=runtime.enginePool('CARDS',session),dice=runtime.enginePool('DICE',session);
  assert.deepEqual(board.map(x=>x.content_item_id),session.selected_item_ids);
  assert.deepEqual(wheel.map(x=>x.content_item_id),session.selected_item_ids);
  assert.deepEqual(cards.map(x=>x.content_item_id),session.selected_item_ids);
  assert.deepEqual(dice.map(x=>x.content_item_id),session.selected_item_ids);
  for(let i=0;i<board.length;i++){assert.strictEqual(board[i],wheel[i]);assert.strictEqual(board[i],cards[i]);assert.strictEqual(board[i],dice[i])}
 }
}
const modal=runtime.createSession({seed:88,targetDurationSeconds:600,filters:{topics:['ZULLEN','ZOUDEN'],levels:['B1'],family_tags:['MODAAL']},selectionTopic:'MODAAL',engines:['BOARD','WHEEL','CARDS','DICE']});
assert.equal(modal.topic,'MODAAL');assert.equal(modal.cefr_level,'B1');
assert.ok(modal.selected_item_ids.every(id=>{const x=runtime.itemById(id);return ['ZULLEN','ZOUDEN'].includes(x.topic)&&x.cefr_level==='B1'&&x.technical_tags.includes('MODAAL')}));
assert.ok(new Set(modal.selected_item_ids.map(id=>runtime.itemById(id).topic)).size===2,'MODAAL session covers both source topics');
assert.equal(new Set(modal.selected_item_ids).size,modal.selected_item_ids.length);

const repeat=runtime.createSession({seed:88,targetDurationSeconds:600,filters:{topics:['ZULLEN','ZOUDEN'],levels:['B1'],family_tags:['MODAAL']},selectionTopic:'MODAAL',engines:['BOARD','WHEEL','CARDS','DICE']});
assert.deepEqual(repeat.selected_item_ids,modal.selected_item_ids);
const other=runtime.createSession({seed:89,targetDurationSeconds:600,filters:{topics:['ZULLEN','ZOUDEN'],levels:['B1'],family_tags:['MODAAL']},selectionTopic:'MODAAL',engines:['BOARD','WHEEL','CARDS','DICE']});
assert.notDeepEqual(other.selected_item_ids,modal.selected_item_ids);

const open=source.items.find(x=>x.openness==='open'),closed=source.items.find(x=>x.openness==='gesloten'),orderItem=order[0];
assert.equal(runtime.answerPolicy(open).mode,'teacher_or_peer_review');
assert.equal(runtime.answerPolicy(open).requiresExactMatch,false);
assert.equal(runtime.answerPolicy(closed).mode,'canonical_answer');
const orderProjection=runtime.project('CARDS',orderItem);
assert.equal(orderProjection.adapter,'text_order');assert.ok(orderProjection.orderTokens.length>=2);

assert.deepEqual(modal.content_source,{drive_id:source.source_drive_id,source_sha256:source.source_sha256,qa_id:'GRAM_REV004',version:'1.2'});
const badReview=structuredClone(source);badReview.items[0].review_status='pilot_ready';
assert.throws(()=>createContentRuntime(badReview),/reviewstatus/);
const badPublication=structuredClone(source);badPublication.items[0].publication_status='draft';
assert.throws(()=>createContentRuntime(badPublication),/publicatiestatus/);
console.log('PASS: CONTENT 000 full PB001 runtime, all 1440 records, A2-B2, ER/ZULLEN/ZOUDEN/MODAAL, ORDER adapter and shared BOARD/WHEEL/CARDS/DICE SessionConfig.');
