import test from 'node:test';
import assert from 'node:assert/strict';
import {blankModel} from '../zinnenbouwer/model.mjs';
import {createSession,joinSession,applyCommand,snapshot,assertOpen,SESSION_TTL} from '../zinnenbouwer/session.mjs';
function fixture(type='sentenceBuild'){
 const model=blankModel();for(const c of model.components){c.value={subject:'ik',finiteVerb:'werk',time:'morgen',place:'thuis'}[c.type]||'';c.enabled=!!c.value;if(c.verb){c.verb.lemma='werken';c.verb.surfaceForm=c.value;}}
 return createSession(model,type,'123456','owner',0,()=>0);
}
const command=(type,extra={})=>({type,requestId:crypto.randomUUID(),...extra});
const order=['subject','finiteVerb','time','place'];
test('waiting → active → review → new round → closed; answers grouped; no participant data leaks',()=>{
 const s=fixture();assert.equal(s.status,'waiting');
 for(let i=0;i<3;i++)joinSession(s,'Naam '+i,'p'+i,'t'+i,1);
 assert.equal(snapshot(s,'t0').model,undefined);assert.equal(snapshot(s,'t0').participants,undefined);
 assert.throws(()=>applyCommand(s,'t0',command('start'),2),/Alleen de docent/);
 assert.throws(()=>applyCommand(s,'t0',command('submit',{round:0,order}),2),/afgelopen/);
 applyCommand(s,'owner',command('start'),3);assert.equal(s.round,1);
 for(let i=0;i<3;i++)applyCommand(s,'t'+i,command('submit',{round:1,order:i===2?['time','subject','finiteVerb','place']:order}),4);
 const teacher=snapshot(s,'owner',['p0']);assert.equal(teacher.participants,3);assert.equal(teacher.received,3);assert.equal(teacher.remaining,0);assert.deepEqual(teacher.groups.map(g=>g.count),[2,1]);
 assert.equal(snapshot(s,'t0').groups,undefined);assert.equal(snapshot(s,'t0').ownerToken,undefined);
 applyCommand(s,'owner',command('review'),5);const first=structuredClone(s.exercise);
 applyCommand(s,'owner',command('start'),6);assert.equal(s.round,2);assert.deepEqual(s.exercise,first);assert.equal(snapshot(s,'owner').received,0);
 assert.throws(()=>applyCommand(s,'t0',command('submit',{round:1,order}),7),/afgelopen/);
 applyCommand(s,'owner',command('review'),8);applyCommand(s,'owner',command('start',{shuffle:true}),9,()=>0.99);assert.equal(s.round,3);
 applyCommand(s,'owner',command('close'),10);assert.equal(s.status,'closed');assert.throws(()=>joinSession(s,'','p4','t4',11),/gesloten/);
});
test('idempotent teacher commands, submit retries, duplicate answer and malformed/partial answer',()=>{
 const s=fixture();joinSession(s,'','p','token',1);const start=command('start');applyCommand(s,'owner',start,2);applyCommand(s,'owner',start,3);assert.equal(s.round,1);
 for(const bad of [undefined,[],['subject'],['x','finiteVerb','time','place'],['subject','subject','time','place']])assert.throws(()=>applyCommand(s,'token',command('submit',{round:1,order:bad}),4));
 applyCommand(s,'token',command('submit',{round:1,order}),5);applyCommand(s,'token',command('submit',{round:1,order}),6);assert.equal(Object.keys(s.answers).length,1);
 assert.throws(()=>applyCommand(s,'token',command('submit',{round:1,order:['time','finiteVerb','subject','place']}),7),/al ontvangen/);
 assert.throws(()=>snapshot(s,'forged'),/opnieuw/);
});
test('unknown, expired and full session; malformed model; fixed sentence cannot be bypassed',()=>{
 assert.throws(()=>assertOpen(null),/niet bekend/);assert.throws(()=>assertOpen(fixture(),SESSION_TTL),/gesloten/);
 assert.throws(()=>createSession(blankModel(),'sentenceBuild','123456','owner'),/Vul/);
 const s=fixture('completeSentence');joinSession(s,'','p','token',1);applyCommand(s,'owner',command('start'),2);
 assert.throws(()=>applyCommand(s,'token',command('submit',{round:1,order:['time','finiteVerb','subject','place']}),3),/vaste kaarten/);
 for(let i=1;i<100;i++)joinSession(s,'','p'+i,'token'+i,4);
 assert.throws(()=>joinSession(s,'','extra','extra',5),/vol/);
});
