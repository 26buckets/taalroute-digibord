const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=require('../data/content-vert001-er-b1.js');
const {createContentRuntime}=require('../content-runtime.js');
const runtime=createContentRuntime(source);

assert.equal(source.items.length,180,'exact 180 ER B1 records');
assert.equal(new Set(source.items.map(x=>x.content_item_id)).size,180,'all content IDs unique');
assert.deepEqual(source.items.map(x=>x.content_item_id),Array.from({length:180},(_,i)=>'ER_B1_'+String(i+1).padStart(3,'0')),'stable sequential IDs');
assert.ok(source.items.every(x=>x.content_bank_id==='CB-GRAM-001'&&x.topic==='ER'&&x.cefr_level==='B1'),'scope locked to canonical ER B1');
assert.ok(source.items.every(x=>x.review_status==='pilot_ready'&&x.publication_status==='pilot_only'),'runtime only reads released pilot subset');

const legacyTypes=new Set(source.items.map(x=>x.exercise_type));
assert.deepEqual([...legacyTypes].sort(),['betekenis_kiezen','dialoog_aanvullen','fout_verbeteren','functie_sorteren','herschrijven','invullen','meerkeuze_context','meerkeuze_vorm','scenario','snelvraag','vrije_productie','zinnen_leggen'].sort(),'all 12 legacy exercise types mapped');
assert.ok(source.items.every(x=>/^IT_\d{3}_[A-Z_]+$/.test(x.interaction_type)),'every item has canonical InteractionType');

const order=source.items.find(x=>x.interaction_type==='IT_008_ORDER');
assert.ok(order,'ORDER record exists in source');
for(const engine of ['BOARD','WHEEL','CARDS'])assert.deepEqual(runtime.compatibility(order,engine),{compatible:false,reason:'renderer_missing_order'},engine+' rejects unsupported ORDER renderer');
const eligible=runtime.eligibleItems(['BOARD','WHEEL','CARDS']);
assert.equal(eligible.length,162,'compatibility resolver excludes the 18 ORDER items before selection');

const session=runtime.createSession({seed:20260922,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS'],startedAt:'2026-09-22T08:00:00+02:00'});
assert.equal(session.selection_profile_id,'SP_GRAM_ER_B1_VERT001');
assert.equal(session.content_bank_id,'CB-GRAM-001');
assert.equal(session.selection_seed,20260922);
assert.ok(session.selected_item_ids.length>=6);
assert.ok(session.actual_estimated_duration_seconds>=600);
assert.equal(new Set(session.selected_item_ids).size,session.selected_item_ids.length,'no duplicate draw inside session');
assert.deepEqual(new Set(runtime.enginePool('BOARD',session).map(x=>x.language_function)),new Set(runtime.FUNCTIONS),'selection covers all six grammar functions');

const board=runtime.enginePool('BOARD',session),wheel=runtime.enginePool('WHEEL',session),cards=runtime.enginePool('CARDS',session);
assert.deepEqual(board.map(x=>x.content_item_id),session.selected_item_ids,'BOARD uses SessionConfig IDs');
assert.deepEqual(wheel.map(x=>x.content_item_id),session.selected_item_ids,'WHEEL uses the same SessionConfig IDs');
assert.deepEqual(cards.map(x=>x.content_item_id),session.selected_item_ids,'CARDS uses the same SessionConfig IDs');
for(let i=0;i<board.length;i++){assert.strictEqual(board[i],wheel[i],'BOARD and WHEEL reference one canonical object');assert.strictEqual(board[i],cards[i],'BOARD and CARDS reference one canonical object')}

const repeat=runtime.createSession({seed:20260922,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS']});
assert.deepEqual(repeat.selected_item_ids,session.selected_item_ids,'same seed reproduces exact draw');
const other=runtime.createSession({seed:20260923,targetDurationSeconds:600,engines:['BOARD','WHEEL','CARDS']});
assert.notDeepEqual(other.selected_item_ids,session.selected_item_ids,'different seed changes draw');

const open=eligible.find(x=>x.openness==='open'||x.openness==='open_geleid');
const closed=eligible.find(x=>x.openness==='gesloten'||x.openness==='geleid_gesloten');
assert.ok(open&&closed,'open and closed tasks both present');
assert.deepEqual(runtime.answerPolicy(open),{mode:'teacher_or_peer_review',requiresExactMatch:false,canonicalAnswer:null,modelAnswer:open.model_answer,modelIsExample:true},'open tasks never use exact string matching');
const closedPolicy=runtime.answerPolicy(closed);
assert.equal(closedPolicy.mode,'canonical_answer');assert.equal(closedPolicy.requiresExactMatch,false);assert.equal(closedPolicy.canonicalAnswer,closed.correct_answer);assert.ok(closedPolicy.modelAnswer,'closed task exposes canonical model');
for(const engine of ['BOARD','WHEEL','CARDS']){const projection=runtime.project(engine,board[0]);assert.equal(projection.contentItemId,board[0].content_item_id);assert.strictEqual(projection.sourceItem,board[0]);assert.equal(projection.prompt,board[0].prompt)}

assert.deepEqual(session.game_engine_versions,{BOARD:'VERT001-1.1',WHEEL:'VERT001-1.1',CARDS:'VERT001-1.1'});
assert.deepEqual(session.content_source,{drive_id:'1ofjEPAW9Crq4CgLWlsUS-FTubsgvEh4S_giFY4vhxCQ',qa_id:'GRAM_QA_001',version:'1.1'});

const orderAvailability=runtime.availability({exercise_types:['zinnen_leggen']});
assert.equal(orderAvailability.source_count,18,'all 18 ORDER records remain in the canonical source');
assert.equal(orderAvailability.common_count,0,'ORDER has no common renderer yet');
assert.equal(orderAvailability.engines.BOARD.count,0);
assert.equal(orderAvailability.engines.WHEEL.count,0);
assert.equal(orderAvailability.engines.CARDS.count,0);
assert.throws(()=>runtime.createSession({targetDurationSeconds:300,filters:{exercise_types:['zinnen_leggen']}}),/Geen compatibele content/,'unsupported focus is blocked without fallback');

const amountAvailability=runtime.availability({language_functions:['hoeveelheid']});
assert.equal(amountAvailability.source_count,30,'subtopic filter keeps exact canonical function scope');
assert.ok(amountAvailability.common_count>0&&amountAvailability.common_count<30,'compatibility is applied after content filtering');
const amountSession=runtime.createSession({seed:77,targetDurationSeconds:300,filters:{language_functions:['hoeveelheid']},organizationMode:'groups',selectedGameEngine:'BOARD',selectedGameVariant:'zwolle'});
assert.ok(amountSession.selected_item_ids.every(id=>runtime.itemById(id).language_function==='hoeveelheid'),'subtopic session never leaks another function');
assert.equal(amountSession.organization_mode,'groups');
assert.equal(amountSession.selected_game_engine,'BOARD');
assert.equal(amountSession.selected_game_variant,'zwolle');
const pairSession=runtime.createSession({seed:78,targetDurationSeconds:300,filters:{language_functions:['hoeveelheid']},organizationMode:'pairs',selectedGameEngine:'BOARD',selectedGameVariant:'rotterdam'});
assert.equal(pairSession.organization_mode,'pairs','duo organization is preserved in SessionConfig');
assert.throws(()=>runtime.createSession({targetDurationSeconds:300,filters:{language_functions:['hoeveelheid'],exercise_types:['snelvraag']}}),/Onvoldoende content/,'too narrow selection is blocked instead of silently changing topic, level or duration');
assert.throws(()=>runtime.createSession({targetDurationSeconds:300,organizationMode:'unknown'}),/Ongeldige organisatievorm/,'invalid organization never falls back to class');
assert.throws(()=>runtime.createSession({targetDurationSeconds:300,filters:{productive_or_receptive:'unknown'}}),/Ongeldige productievorm/,'invalid production filter never falls back to all');
assert.throws(()=>runtime.createSession({targetDurationSeconds:300,filters:{difficulty:'unknown'}}),/Ongeldige moeilijkheid/,'invalid difficulty never falls back to all');
assert.throws(()=>runtime.createSession({targetDurationSeconds:0}),/Ongeldige tijdsduur/,'invalid duration never starts a session');


const index=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const dataPos=index.indexOf('data/content-vert001-er-b1.js'),runtimePos=index.indexOf('content-runtime.js'),appPos=index.indexOf('app.js');
assert.ok(dataPos>=0&&runtimePos>dataPos&&appPos>runtimePos,'browser loads one canonical source, then runtime, then app');
const contentFiles=fs.readdirSync(path.join(__dirname,'..','data')).filter(name=>/content-vert001-er-b1/i.test(name));
assert.deepEqual(contentFiles,['content-vert001-er-b1.js'],'no BOARD, WHEEL or CARDS content copies exist');
console.log('PASS: CONTENT VERT 001 runtime and regression smoke for ER B1');
