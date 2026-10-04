import {enabled, modelIssues} from './model.mjs';
/** @typedef {import('./model.mjs').SentenceModel} SentenceModel */
/** @typedef {{model:SentenceModel,order:string[],parts:import('./model.mjs').SentenceComponent[]}} RuleContext */
/** @typedef {{id:string,check:(context:RuleContext)=>string|null}} GrammarRule */
// Positions count constituents, not words: “naar Rotterdam” is one place.
/** @type {GrammarRule[]} */
export const mainClauseRules = [
 {id:'finite-second',check:({parts})=>parts[1]?.type==='finiteVerb'?null:'Zet de persoonsvorm op de tweede plek.'},
 {id:'main-or-inversion',check:({parts})=>parts[0]?.type==='subject'||(['time','place'].includes(parts[0]?.type)&&parts[2]?.type==='subject')?null:'Begin met het onderwerp, of begin met tijd of plaats en zet het onderwerp na de persoonsvorm.'},
 {id:'infinitive-last',check:({parts})=>!parts.some(p=>p.type==='secondVerb')||parts.at(-1)?.type==='secondVerb'?null:'Zet het tweede werkwoord achteraan.'}
];
/** @param {SentenceModel} model */
export const canonicalOrder = model => ['subject','finiteVerb','time','rest','place','secondVerb'].flatMap(t=>enabled(model).filter(c=>c.type===t).map(c=>c.id));
/** Independent rule collection is the extension point for later clause types.
 * @param {SentenceModel} model @param {string[]} order @param {GrammarRule[]} rules
 * @returns {{status:import('./model.mjs').ValidationStatus,issues:import('./model.mjs').Issue[]}} */
export function validate(model,order,rules=mainClauseRules) {
 const issues=modelIssues(model);
 if(issues.length) return {status:issues.some(i=>i.status==='incorrect')?'incorrect':'incomplete',issues};
 const available=enabled(model);
 if(!Array.isArray(order)||order.length>available.length||new Set(order).size!==order.length||order.some(id=>!available.some(c=>c.id===id))) return {status:'incorrect',issues:[{status:'incorrect',code:'order',message:'Gebruik elk beschikbaar zinsdeel eenmaal.'}]};
 const missing=available.filter(c=>!order.includes(c.id));
 if(missing.length) return {status:'incomplete',issues:[{status:'incomplete',code:'missing',message:'Plaats alle zinsdelen in de bouwzone.'}]};
 const context={model,order,parts:order.map(id=>available.find(c=>c.id===id))};
 const failures=rules.flatMap(rule=>{const message=rule.check(context);return message?[{status:/** @type {'incorrect'} */('incorrect'),code:rule.id,message}]:[]});
 if(failures.length)return {status:'incorrect',issues:failures};
 return {status:order.every((id,i)=>id===canonicalOrder(model)[i])?'correct':'correctAlternative',issues:[]};
}
