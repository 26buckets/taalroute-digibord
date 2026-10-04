/** @typedef {'subject'|'finiteVerb'|'time'|'rest'|'place'|'secondVerb'} SentenceComponentType */
/** @typedef {{lemma:string,surfaceForm:string,role:'finiteVerb'|'secondVerb',form:'finite'|'infinitive'|'pastParticiple'|'teInfinitive',verbType?:string,positionBehavior?:string}} VerbData */
/** @typedef {{id:string,type:SentenceComponentType,value:string,enabled:boolean,metadata?:Record<string,unknown>,verb?:VerbData}} SentenceComponent */
/** @typedef {{modelVersion:1,id:string,clauseType:'main',components:SentenceComponent[]}} SentenceModel */
/** @typedef {'correct'|'correctAlternative'|'incomplete'|'incorrect'} ValidationStatus */
/** @typedef {{code:string,message:string,status:'incomplete'|'incorrect'}} Issue */
export const labels = Object.freeze({subject:'Onderwerp',finiteVerb:'Persoonsvorm',time:'Tijd',rest:'Rest',place:'Plaats',secondVerb:'Tweede werkwoord'});
export const clean = value => String(value ?? '').normalize('NFC').trim().replace(/\s+/gu,' ');
/** @param {SentenceModel} model */
export const enabled = model => model.components.filter(c => c.enabled);
/** Validate untrusted activities before executing rules or starting a session.
 * @param {unknown} input @returns {Issue[]} */
export function modelIssues(input) {
 const m = /** @type {SentenceModel} */ (input), issues = [];
 const add = (code,message,status = 'incorrect') => issues.push({code,message,status});
 if (!m || m.modelVersion !== 1 || m.clauseType !== 'main' || !Array.isArray(m.components) || typeof m.id !== 'string' || m.id.length > 100) return [{code:'model',message:'Deze activiteit heeft geen ondersteunde modelversie.',status:'incorrect'}];
 if (m.components.length > 6) add('size','Gebruik maximaal zes zinsdelen.');
 const ids = new Set(), types = new Set();
 for (const c of m.components) {
  if (!c || typeof c.id !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(c.id) || !Object.hasOwn(labels,c.type) || typeof c.value !== 'string' || typeof c.enabled !== 'boolean') {add('component','Een zinsdeel is ongeldig.');continue;}
  if(ids.has(c.id)||types.has(c.type)) add('duplicate','Gebruik elke grammaticale functie eenmaal.');
  ids.add(c.id);types.add(c.type);
  if (c.value.length > 160) add('length',`${labels[c.type]} is te lang (maximaal 160 tekens).`);
  if (!c.enabled) continue;
  if (!clean(c.value)) {add('empty',`Vul ${labels[c.type].toLocaleLowerCase('nl')} in.`,'incomplete');continue;}
  if (c.type === 'finiteVerb' || c.type === 'secondVerb') {
   const v = c.verb, expected = c.type === 'finiteVerb' ? 'finite' : 'infinitive';
   if (!v || v.role !== c.type || v.form !== expected || typeof v.lemma !== 'string' || !clean(v.lemma) || clean(v.surfaceForm) !== clean(c.value)) add('verb',`${labels[c.type]}: kies ${expected === 'finite' ? 'een persoonsvorm' : 'een infinitief'} met een heel werkwoord.`);
  }
 }
 for (const type of ['subject','finiteVerb']) if (!m.components.some(c=>c?.type===type&&c.enabled)) add('required',`${labels[type]} ontbreekt.`,'incomplete');
 return /** @type {Issue[]} */ (issues);
}
/** @returns {SentenceModel} */
export function blankModel() {
 return {modelVersion:1,id:crypto.randomUUID(),clauseType:'main',components:Object.keys(labels).map(type=>({id:type,type:/** @type {SentenceComponentType} */(type),value:'',enabled:['subject','finiteVerb'].includes(type),...(['finiteVerb','secondVerb'].includes(type)?{verb:{lemma:'',surfaceForm:'',role:/** @type {'finiteVerb'|'secondVerb'} */(type),form:/** @type {'finite'|'infinitive'} */(type==='finiteVerb'?'finite':'infinitive')}}:{})}))};
}
/** @param {SentenceModel} model @param {string[]} order */
export function sentenceText(model,order) {
 const text = clean(order.map(id=>model.components.find(c=>c.id===id)).filter(Boolean).map(c=>clean(c.value)).join(' '));
 return text ? text[0].toLocaleUpperCase('nl') + text.slice(1).replace(/[.!?]+$/u,'') + '.' : '';
}
