import test from 'node:test';
import assert from 'node:assert/strict';
import {blankModel,modelIssues,sentenceText} from '../zinnenbouwer/model.mjs';
import {validate,canonicalOrder} from '../zinnenbouwer/grammar.mjs';
import {createExercise,respectsFixed} from '../zinnenbouwer/exercise.mjs';
import {groupAnswers,canonicalAnswer} from '../zinnenbouwer/review.mjs';
export function example(values={subject:'ik',finiteVerb:'werk',time:'vandaag',place:'thuis'}) {
 const model=blankModel();
 for(const c of model.components){c.enabled=Object.hasOwn(values,c.type);c.value=values[c.type]||'';if(c.verb){c.verb.lemma=c.type==='finiteVerb'?'werken':c.value;c.verb.surfaceForm=c.value;}}
 return model;
}
const cases=[
 [{subject:'ik',finiteVerb:'werk',time:'vandaag',place:'thuis'},['subject','finiteVerb','time','place'],'correct'],
 [{subject:'ik',finiteVerb:'werk',time:'vandaag',place:'thuis'},['time','finiteVerb','subject','place'],'correctAlternative'],
 [{subject:'ik',finiteVerb:'werk',time:'vandaag',place:'thuis'},['time','subject','finiteVerb','place'],'incorrect'],
 [{subject:'ik',finiteVerb:'ga',time:'morgen',place:'naar Rotterdam'},['subject','finiteVerb','time','place'],'correct'],
 [{subject:'ik',finiteVerb:'ga',time:'morgen',place:'naar Rotterdam'},['time','finiteVerb','subject','place'],'correctAlternative'],
 [{subject:'ik',finiteVerb:'wil',time:'morgen',secondVerb:'werken'},['subject','finiteVerb','time','secondVerb'],'correct'],
 [{subject:'ik',finiteVerb:'wil',time:'morgen',secondVerb:'werken'},['time','finiteVerb','subject','secondVerb'],'correctAlternative'],
 [{subject:'ik',finiteVerb:'wil',time:'morgen',place:'thuis',secondVerb:'werken'},['subject','finiteVerb','time','place','secondVerb'],'correct'],
 [{subject:'ik',finiteVerb:'wil',time:'morgen',place:'thuis',secondVerb:'werken'},['time','subject','finiteVerb','place','secondVerb'],'incorrect']
];
for(const [values,order,status] of cases)test(Object.values(values).join(' ')+' / '+order.join(','),()=>assert.equal(validate(example(values),order).status,status));
test('missing finite verb, second verb, empty model and unsupported verbs',()=>{
 assert.equal(validate(example({subject:'ik'}),['subject']).status,'incomplete');
 const m=example({subject:'ik',finiteVerb:'wil',secondVerb:'werken'});
 assert.equal(validate(m,['subject','finiteVerb']).status,'incomplete');
 assert.equal(validate(blankModel(),[]).status,'incomplete');
 m.components.find(c=>c.type==='secondVerb').verb.form='teInfinitive';assert.ok(modelIssues(m).length);
});
test('position, disabled/unknown/duplicate IDs, place inversion and alternative tail order',()=>{
 const m=example();assert.equal(validate(m,['place','finiteVerb','subject','time']).status,'correctAlternative');
 assert.equal(validate(m,['subject','finiteVerb','place','time']).status,'correctAlternative');
 for(const ids of [['subject','finiteVerb','time','x'],['subject','finiteVerb','time','time'],['subject','finiteVerb','time','place','rest']])assert.equal(validate(m,ids).status,'incorrect');
 const v=example({subject:'ik',finiteVerb:'wil',time:'morgen',secondVerb:'werken'});assert.equal(validate(v,['subject','finiteVerb','secondVerb','time']).status,'incorrect');
 assert.equal(validate(null,[]).status,'incorrect');
});
test('four projections share one unchanged model, fixed prefix, deliberately incorrect repair',()=>{
 const m=example(),before=JSON.stringify(m);
 for(const type of ['sentenceBuild','reorder','completeSentence','repairSentence']){
  const e=createExercise(m,type,()=>0);assert.equal(new Set([...e.order,...e.bank]).size,4);
  if(type==='repairSentence')assert.equal(validate(m,e.order).status,'incorrect');
  if(type==='completeSentence'){assert.ok(respectsFixed(e,canonicalOrder(m)));assert.ok(!respectsFixed(e,[...canonicalOrder(m)].reverse()));}
 }
 assert.equal(JSON.stringify(m),before);
});
test('canonical grouping and counts use structural validation',()=>{
 assert.equal(canonicalAnswer(' Ik  werk\n thuis. '),canonicalAnswer('ik werk thuis.'));
 const groups=groupAnswers(example(),[{order:['subject','finiteVerb','time','place']},{order:['subject','finiteVerb','time','place']},{order:['time','subject','finiteVerb','place']}]);
 assert.deepEqual(groups.map(g=>g.count),[2,1]);assert.equal(groups[1].status,'incorrect');
});

// New sentence forms share the same rules in the classroom and Live.
import {templates,templateModel} from '../zinnenbouwer/templates.mjs';
test('all landing examples and all four exercise projections are valid',()=>{
 for(const key of Object.keys(templates)){
  const m=templateModel(key);assert.deepEqual(modelIssues(m),[]);assert.equal(validate(m,canonicalOrder(m)).status,'correct');
  assert.equal(validate(m,createExercise(m,'repairSentence').order).status,'incorrect');
  for(const type of ['sentenceBuild','reorder','completeSentence'])assert.equal(new Set([...createExercise(m,type).order,...createExercise(m,type).bank]).size,m.components.filter(c=>c.enabled).length);
 }
});
test('questions, required inversion and past participles',()=>{
 const q=templateModel('question');assert.equal(sentenceText(q,canonicalOrder(q)),'Werk jij morgen thuis?');assert.equal(validate(q,['subject','finiteVerb','time','place']).status,'incorrect');
 const i=templateModel('inversion');assert.equal(validate(i,['subject','finiteVerb','time','place']).status,'incorrect');assert.equal(validate(i,['place','finiteVerb','subject','time']).status,'correctAlternative');
 assert.equal(validate(templateModel('perfect'),['subject','finiteVerb','time','secondVerb','place']).status,'incorrect');
});
test('subordinate clauses put one or two verbs last',()=>{
 const m=templateModel('subordinate');assert.equal(validate(m,['conjunction','subject','finiteVerb','time','place']).status,'incorrect');
 const v=m.components.find(c=>c.type==='secondVerb');Object.assign(v,{enabled:true,value:'gewerkt',verb:{lemma:'werken',surfaceForm:'gewerkt',role:'secondVerb',form:'pastParticiple'}});
 assert.equal(validate(m,['conjunction','subject','time','place','finiteVerb','secondVerb']).status,'correct');assert.equal(validate(m,['conjunction','subject','time','place','secondVerb','finiteVerb']).status,'correctAlternative');
 m.components[0].value='en';assert.ok(modelIssues(m).length);
});
test('compound clauses remain contiguous and fronted subordinate triggers inversion',()=>{
 const m=templateModel('compound'),front=['sub-conjunction','sub-subject','sub-rest','sub-finiteVerb','finiteVerb','subject','place'];
 assert.equal(validate(m,front).status,'correctAlternative');assert.equal(sentenceText(m,front),'Omdat ik ziek ben, blijf ik thuis.');
 assert.equal(validate(m,['sub-conjunction','sub-subject','sub-rest','sub-finiteVerb','subject','finiteVerb','place']).status,'incorrect');
 assert.equal(validate(m,['subject','finiteVerb','sub-conjunction','place','sub-subject','sub-rest','sub-finiteVerb']).status,'incorrect');
 m.components[0].clause='bogus';assert.ok(modelIssues(m).length);
});
