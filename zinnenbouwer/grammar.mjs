import {enabled,modelIssues,clauseOf} from './model.mjs';
/** @typedef {import('./model.mjs').SentenceModel} SentenceModel */
/** @typedef {{model:SentenceModel,order:string[],parts:import('./model.mjs').SentenceComponent[]}} RuleContext */
/** @typedef {{id:string,check:(context:RuleContext)=>string|null}} GrammarRule */
/** @type {GrammarRule[]} */
export const mainClauseRules=[
 {id:'finite-second',check:({parts})=>parts[1]?.type==='finiteVerb'?null:'Zet de persoonsvorm op de tweede plek.'},
 {id:'main-or-inversion',check:({parts})=>parts[0]?.type==='subject'||(['time','place'].includes(parts[0]?.type)&&parts[2]?.type==='subject')?null:'Begin met het onderwerp, of begin met tijd of plaats en zet het onderwerp na de persoonsvorm.'},
 {id:'second-verb-last',check:({parts})=>!parts.some(p=>p.type==='secondVerb')||parts.at(-1)?.type==='secondVerb'?null:'Zet het tweede werkwoord achteraan.'}
];
/** @type {GrammarRule[]} */
const inversionRules=[mainClauseRules[0],{id:'inversion',check:({parts})=>['time','place'].includes(parts[0]?.type)&&parts[2]?.type==='subject'?null:'Begin met tijd of plaats en zet het onderwerp na de persoonsvorm.'},mainClauseRules[2]];
/** @type {GrammarRule[]} */
const questionRules=[
 {id:'finite-first',check:({parts})=>parts[0]?.type==='finiteVerb'&&parts[1]?.type==='subject'?null:'Zet eerst de persoonsvorm en daarna het onderwerp.'},mainClauseRules[2]
];
/** @type {GrammarRule[]} */
const subordinateRules=[
 {id:'conjunction-first',check:({parts})=>parts[0]?.type==='conjunction'&&parts[1]?.type==='subject'?null:'Begin de bijzin met het voegwoord en daarna het onderwerp.'},
 {id:'verbs-last',check:({parts})=>{const verbs=parts.filter(p=>p.type==='finiteVerb'||p.type==='secondVerb');return parts.slice(-verbs.length).every(p=>verbs.includes(p))?null:'Zet de werkwoorden achteraan in de bijzin.';}}
];
/** @param {SentenceModel} model */
export const canonicalOrder=model=>{
 const parts=enabled(model),sort=(clause,types)=>types.flatMap(t=>parts.filter(c=>clauseOf(model,c)===clause&&c.type===t).map(c=>c.id));
 if(model.clauseType==='inversion'){const first=parts.some(c=>c.type==='time')?'time':'place';return sort('main',[first,'finiteVerb','subject',...['time','rest','place'].filter(t=>t!==first),'secondVerb']);}
 return [...sort('main',model.clauseType==='question'?['finiteVerb','subject','time','rest','place','secondVerb']:['subject','finiteVerb','time','rest','place','secondVerb']),...sort('subordinate',['conjunction','subject','time','rest','place','finiteVerb','secondVerb'])];
};
/** @param {SentenceModel} model @param {string[]} order @param {GrammarRule[]} [rules]
 * @returns {{status:import('./model.mjs').ValidationStatus,issues:import('./model.mjs').Issue[]}} */
export function validate(model,order,rules){
 const issues=modelIssues(model);
 if(issues.length)return {status:issues.some(i=>i.status==='incorrect')?'incorrect':'incomplete',issues};
 const available=enabled(model);
 if(!Array.isArray(order)||order.length>available.length||new Set(order).size!==order.length||order.some(id=>!available.some(c=>c.id===id)))return {status:'incorrect',issues:[{status:'incorrect',code:'order',message:'Gebruik elk beschikbaar zinsdeel eenmaal.'}]};
 if(available.some(c=>!order.includes(c.id)))return {status:'incomplete',issues:[{status:'incomplete',code:'missing',message:'Plaats alle zinsdelen in de bouwzone.'}]};
 const parts=order.map(id=>available.find(c=>c.id===id)),failures=[];
 const check=(selected,collection)=>{for(const rule of collection){const message=rule.check({model,order:selected.map(c=>c.id),parts:selected});if(message)failures.push({status:'incorrect',code:rule.id,message});}};
 if(rules)check(parts,rules);
 else if(model.clauseType==='compound'){
  const transitions=parts.slice(1).filter((c,i)=>clauseOf(model,c)!==clauseOf(model,parts[i])).length;
  if(transitions!==1)failures.push({status:'incorrect',code:'clause-blocks',message:'Houd de hoofdzin en de bijzin elk bij elkaar.'});
  const subFirst=clauseOf(model,parts[0])==='subordinate';
  check(parts.filter(c=>clauseOf(model,c)==='main'),subFirst?questionRules:mainClauseRules);
  check(parts.filter(c=>clauseOf(model,c)==='subordinate'),subordinateRules);
 }else check(parts,model.clauseType==='subordinate'?subordinateRules:model.clauseType==='question'?questionRules:model.clauseType==='inversion'?inversionRules:mainClauseRules);
 if(failures.length)return {status:'incorrect',issues:/** @type {import('./model.mjs').Issue[]} */(failures)};
 return {status:order.every((id,i)=>id===canonicalOrder(model)[i])?'correct':'correctAlternative',issues:[]};
}
