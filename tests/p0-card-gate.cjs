const assert=require('node:assert/strict'),{compare,verifyFiles,expected}=require('../scripts/p0-card-gate.cjs');
verifyFiles(require('node:path').resolve(__dirname,'..'));
assert.equal(compare(expected).status,'PASS');
function rejects(change){const cards=structuredClone(expected);change(cards);assert.equal(compare(cards).status,'FAIL');}
rejects(c=>c.pop());rejects(c=>c.push(c[0]));rejects(c=>c[0].record.instruction='silent overwrite');rejects(c=>c[0].family='wrong');rejects(c=>c[0].guided=[]);rejects(c=>c[0].free=['B2_C1']);rejects(c=>delete c.find(c=>c.record.visualRebus).record.visualRebus);rejects(c=>c.push({...c[0],id:'new-unapproved'}));
console.log('PASS P0: immutable 570 baseline, exact family/route/field/media parity; deletion, hiding, overwrite, duplicate and addition mutations rejected');
