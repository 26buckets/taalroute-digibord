/** @typedef {'subject'|'finiteVerb'|'time'|'rest'|'place'|'secondVerb'|'conjunction'} SentenceComponentType */
/** @typedef {'main'|'inversion'|'subordinate'|'question'|'compound'} ClauseType */
/** @typedef {{lemma:string,surfaceForm:string,role:'finiteVerb'|'secondVerb',form:'finite'|'infinitive'|'pastParticiple'|'teInfinitive',verbType?:string,positionBehavior?:string}} VerbData */
/** @typedef {{id:string,type:SentenceComponentType,value:string,enabled:boolean,clause?:'main'|'subordinate',metadata?:Record<string,unknown>,verb?:VerbData}} SentenceComponent */
/** @typedef {{modelVersion:1,id:string,clauseType:ClauseType,components:SentenceComponent[]}} SentenceModel */
/** @typedef {'correct'|'correctAlternative'|'incomplete'|'incorrect'} ValidationStatus */
/** @typedef {{code:string,message:string,status:'incomplete'|'incorrect'}} Issue */
export const labels=Object.freeze({subject:'Onderwerp',finiteVerb:'Persoonsvorm',time:'Tijd',rest:'Rest',place:'Plaats',secondVerb:'Tweede werkwoord',conjunction:'Voegwoord'});
export const clauseLabels=Object.freeze({main:'Hoofdzin',inversion:'Inversie',subordinate:'Bijzin',question:'Vraagzin',compound:'Hoofdzin + bijzin'});
export const clean=value=>String(value??'').normalize('NFC').trim().replace(/\s+/gu,' ');
/** @param {SentenceModel} model */
export const enabled=model=>model.components.filter(c=>c.enabled);
/** @param {SentenceModel} model @param {SentenceComponent} component */
export const clauseOf=(model,component)=>component.clause||(model.clauseType==='subordinate'?'subordinate':'main');
/** @param {SentenceModel} model @param {SentenceComponent} component */
export const componentLabel=(model,component)=>labels[component.type]+(model.clauseType==='compound'?' · '+(clauseOf(model,component)==='main'?'hoofdzin':'bijzin'):'');
/** Validate untrusted activities before executing rules or starting a session.
 * @param {unknown} input @returns {Issue[]} */
export function modelIssues(input){
 const m=/** @type {SentenceModel} */(input),issues=[];
 const add=(code,message,status='incorrect')=>issues.push({code,message,status});
 if(!m||m.modelVersion!==1||!Object.hasOwn(clauseLabels,m.clauseType)||!Array.isArray(m.components)||typeof m.id!=='string'||m.id.length>100)return [{code:'model',message:'Deze activiteit heeft geen ondersteunde modelversie.',status:'incorrect'}];
 if(m.components.length>(m.clauseType==='compound'?14:7))add('size','Deze activiteit bevat te veel zinsdelen.');
 const ids=new Set(),types=new Set();
 if(m.clauseType==='inversion'&&!m.components.some(c=>c?.enabled&&['time','place'].includes(c.type)))add('required','Voeg tijd of plaats toe om daarmee te beginnen.','incomplete');
 for(const c of m.components){
  if(!c||typeof c.id!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(c.id)||!Object.hasOwn(labels,c.type)||typeof c.value!=='string'||typeof c.enabled!=='boolean'){add('component','Een zinsdeel is ongeldig.');continue;}
  const clause=clauseOf(m,c),key=clause+':'+c.type;
  if(!['main','subordinate'].includes(clause)||(m.clauseType!=='compound'&&clause!==(m.clauseType==='subordinate'?'subordinate':'main')))add('component','Dit zinsdeel hoort niet bij deze zin.');
  if(ids.has(c.id)||types.has(key))add('duplicate','Gebruik elke grammaticale functie eenmaal per zin.');
  ids.add(c.id);types.add(key);
  if(c.value.length>160)add('length',`${labels[c.type]} is te lang (maximaal 160 tekens).`);
  if(!c.enabled)continue;
  if(!clean(c.value)){add('empty',`Vul ${componentLabel(m,c).toLocaleLowerCase('nl')} in.`,'incomplete');continue;}
  if(c.type==='conjunction'&&(clause!=='subordinate'||!['omdat','dat','als','wanneer','terwijl','hoewel','voordat','nadat','zodat','of'].includes(clean(c.value).toLocaleLowerCase('nl'))))add('conjunction','Kies een onderschikkend voegwoord, zoals omdat, dat, als of terwijl.');
  if(c.type==='finiteVerb'||c.type==='secondVerb'){
   const v=c.verb,forms=c.type==='finiteVerb'?['finite']:['infinitive','pastParticiple'];
   if(!v||v.role!==c.type||!forms.includes(v.form)||typeof v.lemma!=='string'||!clean(v.lemma)||clean(v.surfaceForm)!==clean(c.value))add('verb',`${componentLabel(m,c)}: vul een passende werkwoordsvorm en het hele werkwoord in.`);
  }
 }
 for(const clause of m.clauseType==='compound'?['main','subordinate']:[m.clauseType==='subordinate'?'subordinate':'main']){
  for(const type of clause==='subordinate'?['subject','finiteVerb','conjunction']:['subject','finiteVerb'])if(!m.components.some(c=>c?.type===type&&c.enabled&&clauseOf(m,c)===clause))add('required',`${labels[type]} ontbreekt${m.clauseType==='compound'?' in de '+(clause==='main'?'hoofdzin':'bijzin'):''}.`,'incomplete');
 }
 return /** @type {Issue[]} */(issues);
}
/** @returns {SentenceModel} */
export function blankModel(){
 return {modelVersion:1,id:crypto.randomUUID(),clauseType:'main',components:Object.keys(labels).filter(t=>t!=='conjunction').map(type=>({id:type,type:/** @type {SentenceComponentType} */(type),value:'',enabled:['subject','finiteVerb'].includes(type),...(['finiteVerb','secondVerb'].includes(type)?{verb:{lemma:'',surfaceForm:'',role:/** @type {'finiteVerb'|'secondVerb'} */(type),form:/** @type {'finite'|'infinitive'} */(type==='finiteVerb'?'finite':'infinitive')}}:{})}))};
}
/** @param {SentenceModel} model @param {string[]} order */
export function sentenceText(model,order){
 const parts=order.map(id=>model.components.find(c=>c.id===id)).filter(Boolean);
 const words=parts.map((c,i)=>clean(c.value)+(model.clauseType==='compound'&&i<parts.length-1&&clauseOf(model,c)==='subordinate'&&clauseOf(model,parts[i+1])==='main'?',':''));
 const text=clean(words.join(' '));
 return text?text[0].toLocaleUpperCase('nl')+text.slice(1).replace(/[.!?]+$/u,'')+(model.clauseType==='question'?'?':'.'):'';
}
