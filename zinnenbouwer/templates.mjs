import {blankModel} from './model.mjs';
export const templates=Object.freeze({
 main:{title:'Hoofdzin',description:'Begin met het onderwerp.',example:'Ik werk morgen thuis.',clauseType:'main',values:{subject:'ik',finiteVerb:'werk',time:'morgen',place:'thuis'},lemma:'werken'},
 inversion:{title:'Inversie',description:'Begin met tijd of plaats.',example:'Morgen werk ik thuis.',clauseType:'inversion',values:{subject:'ik',finiteVerb:'werk',time:'morgen',place:'thuis'},lemma:'werken'},
 question:{title:'Vraagzin',description:'Zet de persoonsvorm vooraan.',example:'Werk jij morgen thuis?',clauseType:'question',values:{subject:'jij',finiteVerb:'werk',time:'morgen',place:'thuis'},lemma:'werken'},
 subordinate:{title:'Bijzin',description:'Bouw een bijzin met een voegwoord.',example:'omdat ik morgen thuis werk',clauseType:'subordinate',values:{conjunction:'omdat',subject:'ik',finiteVerb:'werk',time:'morgen',place:'thuis'},lemma:'werken'},
 compound:{title:'Hoofdzin + bijzin',description:'Verbind twee zinnen. De bijzin mag ook vooraan.',example:'Ik blijf thuis omdat ik ziek ben.',clauseType:'compound',values:{subject:'ik',finiteVerb:'blijf',place:'thuis'},lemma:'blijven'},
 perfect:{title:'Voltooide tijd',description:'Bouw met een hulpwerkwoord en voltooid deelwoord.',example:'Ik heb gisteren thuis gewerkt.',clauseType:'main',values:{subject:'ik',finiteVerb:'heb',time:'gisteren',place:'thuis',secondVerb:'gewerkt'},lemma:'hebben'}
});
/** Ready-to-use, editable examples; the shared grammar rules validate every variant.
 * @param {string} key @returns {import('./model.mjs').SentenceModel} */
export function templateModel(key){
 const preset=templates[key];if(!preset)throw new Error('Kies een zinsvorm.');
 const model=blankModel();model.clauseType=preset.clauseType;
 for(const c of model.components){c.value=preset.values[c.type]||'';c.enabled=!!c.value;if(c.verb){c.verb.surfaceForm=c.value;c.verb.lemma=c.type==='finiteVerb'?preset.lemma:key==='perfect'?'werken':c.value;if(key==='perfect'&&c.type==='secondVerb')c.verb.form='pastParticiple';}}
 if(key==='subordinate')model.components.unshift({id:'conjunction',type:'conjunction',value:'omdat',enabled:true});
 if(key==='compound'){
  const sub=templateModel('subordinate');
  for(const c of sub.components){c.id='sub-'+c.id;c.clause='subordinate';c.value=({conjunction:'omdat',subject:'ik',rest:'ziek',finiteVerb:'ben'})[c.type]||'';c.enabled=!!c.value;if(c.verb){c.verb.surfaceForm=c.value;c.verb.lemma='zijn';}}
  model.components.push(...sub.components);
 }
 return model;
}
