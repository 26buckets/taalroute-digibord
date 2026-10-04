import test from 'node:test';
import assert from 'node:assert/strict';
import {blankModel,modelIssues} from '../zinnenbouwer/model.mjs';
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
 m.components.find(c=>c.type==='secondVerb').verb.form='pastParticiple';assert.ok(modelIssues(m).length);
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
