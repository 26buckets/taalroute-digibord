import {modelIssues} from './model.mjs';
import {createExercise,exerciseLabels,respectsFixed} from './exercise.mjs';
import {validate} from './grammar.mjs';
import {groupAnswers} from './review.mjs';
/** @typedef {'waiting'|'active'|'review'|'closed'} SessionStatus */
export const SESSION_TTL = 4*60*60*1000;
export class SessionError extends Error {
 constructor(code,message,status=400){super(message);this.code=code;this.status=status;}
}
const reject=(code,message,status=400)=>{throw new SessionError(code,message,status);};
export function createSession(model,type,code,ownerToken,now=Date.now(),random=Math.random) {
 const issues=modelIssues(model);if(issues.length)reject('ACTIVITY',issues.map(i=>i.message).join(' '));
 if(!Object.hasOwn(exerciseLabels,type))reject('EXERCISE','Kies een oefenvorm.');
 return {version:1,code,ownerToken,model:structuredClone(model),type,status:/** @type {SessionStatus} */('waiting'),round:0,revision:0,exercise:createExercise(model,type,random),participants:{},answers:{},requests:[],createdAt:now,expiresAt:now+SESSION_TTL};
}
export function assertOpen(s,now=Date.now()) {
 if(!s)reject('UNKNOWN','Deze sessiecode is niet bekend.',404);
 if(s.expiresAt<=now||s.status==='closed')reject('CLOSED','Deze sessie is gesloten.',410);
}
export function actor(s,token) {
 if(typeof token!=='string'||!token)reject('AUTH','Open de sessie opnieuw.',401);
 if(token===s.ownerToken)return {role:'teacher',id:'teacher'};
 const p=Object.values(s.participants).find(p=>p.token===token);
 if(!p)reject('AUTH','Open de sessie opnieuw.',401);
 return {role:'participant',id:p.id};
}
export function joinSession(s,name,id,token,now=Date.now()) {
 assertOpen(s,now);
 if(typeof name!=='string'||name.length>40)reject('NAME','Gebruik maximaal 40 tekens voor je naam.');
 if(Object.keys(s.participants).length>=100)reject('FULL','Deze sessie is vol.');
 s.participants[id]={id,token,name:name.trim(),joinedAt:now};s.revision++;
 return {id,token,code:s.code};
}
export function applyCommand(s,token,command,now=Date.now(),random=Math.random) {
 assertOpen(s,now);const who=actor(s,token);
 if(!command||typeof command.requestId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(command.requestId))reject('REQUEST','Deze actie is niet geldig.');
 const requestKey=who.id+':'+command.requestId;
 if(s.requests.includes(requestKey))return;
 if(who.role==='teacher') {
  if(command.type==='start'){
   if(!['waiting','review'].includes(s.status))reject('STATE','Deze ronde is al gestart.');
   if(command.shuffle===true)s.exercise=createExercise(s.model,s.type,random);
   s.round++;s.status='active';s.answers={};
  }else if(command.type==='review'){
   if(s.status!=='active')reject('STATE','Start eerst een ronde.');s.status='review';
  }else if(command.type==='close'){s.status='closed';}
  else reject('COMMAND','Onbekende docentactie.');
 }else {
  if(command.type!=='submit')reject('FORBIDDEN','Alleen de docent kan deze actie uitvoeren.',403);
  if(s.status!=='active'||command.round!==s.round)reject('ROUND','Deze ronde is afgelopen. Wacht op de volgende ronde.',409);
  const result=validate(s.model,command.order);
  if(result.status==='incomplete'||result.issues.some(i=>['order','model','component'].includes(i.code)))reject('ANSWER','Plaats eerst alle kaarten eenmaal in de bouwzone.');
  if(!respectsFixed(s.exercise,command.order))reject('FIXED','Laat de vaste kaarten op hun plek.');
  const previous=s.answers[who.id];
  if(previous){if(JSON.stringify(previous.order)!==JSON.stringify(command.order))reject('DUPLICATE','Je antwoord is al ontvangen.',409);return;}
  s.answers[who.id]={participantId:who.id,order:[...command.order],receivedAt:now};
 }
 s.revision++;s.requests.push(requestKey);s.requests=s.requests.slice(-300);
}
export function snapshot(s,token,connected=[]) {
 const who=actor(s,token),base={code:s.code,status:s.status,round:s.round,revision:s.revision,expiresAt:s.expiresAt};
 if(who.role==='teacher')return {...base,model:s.model,type:s.type,exercise:s.exercise,participants:Object.keys(s.participants).length,connected:connected.length,received:Object.keys(s.answers).length,remaining:Object.keys(s.participants).length-Object.keys(s.answers).length,groups:groupAnswers(s.model,Object.values(s.answers))};
 return {...base,...(s.status==='waiting'?{}:{model:s.model,exercise:s.exercise}),answer:s.answers[who.id]?.order||null};
}
