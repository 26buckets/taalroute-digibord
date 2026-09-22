const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const imp=require('../scripts/import-gram-pb001.cjs');
const source=JSON.parse(fs.readFileSync(path.join(root,'staging/gram-pb001-v1.2-source.json'),'utf8'));
assert.equal(imp.validateSource(source),true);
assert.equal(source.source_sha256,'17516b89747772425798de5a1a18e58fd4303c4b67397c3f94146cb5e21ed550');
assert.equal(imp.sourceHash(source.items),source.source_sha256);
const projected=imp.projectSource(source);
assert.equal(projected.items.length,1440);
assert.equal(new Set(projected.items.map(x=>x.content_item_id)).size,1440);
assert.equal(projected.source_version,'1.2');
assert.equal(projected.qa_id,'GRAM_REV004');
assert.equal(projected.staging_status,'staging_only');
const count=(topic,level)=>projected.items.filter(x=>x.topic===topic&&x.cefr_level===level).length;
for(const level of ['A2','B1','B2']){assert.equal(count('ER',level),180);assert.equal(count('ZULLEN',level),150);assert.equal(count('ZOUDEN',level),150)}
assert.equal(projected.items.filter(x=>x.technical_tags.includes('MODAAL')).length,900);
assert.equal(projected.items.filter(x=>x.review_status==='REVIEW_GO').length,1440);
assert.equal(projected.items.filter(x=>x.publication_status==='staging_only').length,1440);
assert.equal(projected.items.filter(x=>x.version==='1.2').length,1440);
assert.ok(projected.items.every(x=>x.selection_safety===true&&x.speaking_safety===true&&x.legacy_board_safe===true));
assert.ok(projected.items.every(x=>Array.isArray(x.options)&&Array.isArray(x.accepted_answers)&&Array.isArray(x.technical_tags)&&Array.isArray(x.media_requirements)));
const types=new Set(projected.items.map(x=>x.exercise_type));
assert.deepEqual([...types].sort(),Object.keys(imp.INTERACTION).sort());
for(const item of projected.items){assert.equal(item.interaction_type,imp.INTERACTION[item.exercise_type]);assert.equal(item.answer_type,imp.ANSWER[item.exercise_type]);assert.equal(item.taalroute_route,imp.ROUTE[item.cefr_level]);assert.equal(item.estimated_duration_seconds,imp.DURATION[item.exercise_type])}
const runtime=require('../data/content-vert001-er-b1.js');
assert.deepEqual(runtime,projected,'Committed runtime projection must equal staging projector output');
assert.equal(imp.renderProjection(projected),fs.readFileSync(path.join(root,'data/content-vert001-er-b1.js'),'utf8'));

const mutated=change=>{const copy=structuredClone(source);change(copy.items);copy.source_sha256=imp.sourceHash(copy.items);return copy};
const duplicate=mutated(items=>{items[1].id=items[0].id});
assert.throws(()=>imp.validateSource(duplicate),/Dubbel ID/);
const badType=mutated(items=>{items[0].exercise_type='onbekend'});
assert.throws(()=>imp.validateSource(badType),/exercise_type/);
const badReview=mutated(items=>{items[0].review_status='pilot_ready'});
assert.throws(()=>imp.validateSource(badReview),/review_status/);
const badVersion=mutated(items=>{items[0].version='1.1'});
assert.throws(()=>imp.validateSource(badVersion),/version/);
assert.throws(()=>imp.rollback('../package.json'),/bank-backups/);
console.log('PASS: GRAM PB 001 staging/projector parity, 1440 IDs, enums, MODAAL, source hash, conflict guards and rollback path guard.');
