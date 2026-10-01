/* Sentence-building choices. Original bank records and saved dice stay intact. */
(function(root){
 'use strict';
 const labels={WHO:'Wie/wat',TENSE:'Tijd',SENTENCE_TYPE:'Maak een zin',CONNECT_1:'Verbindingswoorden — hoofdzin',CONNECT_2:'Verbindingswoorden — bijzin',VERB_FORM:'Werkwoordsvorm'};
 const rank=level=>Math.max(0,['A0','A1','A2','B1','B2','C1','C2'].indexOf(level==='A1+'?'A1':level));
 // Deliberately explicit: an object is offered only for these checked verb meanings.
 const subjects=[
  {id:'TW_WIE_MAN',label:'de man',possessive:'zijn'},
  {id:'TW_WIE_VROUW',label:'de vrouw',possessive:'haar'},
  {id:'TW_WIE_KINDEREN',label:'de kinderen',agreementClass:'plural',possessive:'hun'},
  {id:'TW_WAT_HOND',label:'de hond',kind:'animal',possessive:'zijn',complements:{VRB_ETEN:'brokjes',VRB_DRINKEN:'water',VRB_SLAPEN:'in zijn mand',VRB_LOPEN:'naar de deur',VRB_SPELEN:'met een bal',VRB_WACHTEN:'bij de deur'}},
  {id:'TW_WAT_AUTO',label:'de auto',kind:'object',complements:{VRB_RIJDEN:'door de straat',VRB_STOPPEN:'voor het stoplicht'}},
  {id:'TW_WAT_MACHINE',label:'de machine',kind:'object',complements:{VRB_WERKEN:'weer goed',VRB_STOPPEN:'vanzelf'}}
 ].map(v=>({agreementClass:'thirdSingular',...v}));
 const extraSentences=[
  {id:'TW_ZIN_HOE',label:'Vraag met hoe',recipe:'wh_question',questionWord:'hoe',min:2},
  {id:'TW_ZIN_WANNEER',label:'Vraag met wanneer',recipe:'wh_question',questionWord:'wanneer',min:2},
  {id:'TW_ZIN_PLAATS',label:'Begin met plaats',recipe:'fronted_place',min:2},
  {id:'TW_ZIN_OPDRACHT',label:'Geef een opdracht',recipe:'imperative',min:2}
 ];
 const extraLinks=[
  ['terwijl',3],['voordat',3],['nadat',3],['hoewel',4],['tenzij',4],['zodra',4]
 ].map(([label,min])=>({id:'TW_BIJZIN_'+label.toUpperCase(),label,min}));
 const subjectFits=(who,verb)=>!who?.complements||Object.hasOwn(who.complements,verb.id);
 function values(manifest,id,level,verb,state={}){
  const n=rank(level),base=manifest.diceFamilies[id].values.filter(v=>v.releaseEligible!==false);
  if(id==='WHO')return [...base,...subjects.filter(s=>subjectFits(s,verb))];
  if(id==='TENSE')return base.filter(v=>n>=2||v.code==='present');
  if(id==='CONNECT_1')return base.filter(v=>n>=3||v.label!=='dus').filter(v=>n>=2||v.label==='en');
  if(id==='CONNECT_2')return n<2?[]:[...base,...extraLinks.filter(v=>n>=v.min)];
  if(id==='VERB_FORM')return n<2?[]:base;
  if(id==='SENTENCE_TYPE')return [...base.filter(v=>n>=2||['declarative','yes_no_question'].includes(v.recipe)),...extraSentences.filter(v=>n>=v.min)].filter(v=>{
   if(['yes_no_question','wh_question'].includes(v.recipe)&&(state.CONNECT_1?.active||state.CONNECT_2?.active))return false;
   if(v.questionWord==='wanneer'&&/\b(vandaag|morgen|gisteren|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|vijf uur|om zeven uur|elke dag|iedere dag)\b/i.test(verb.defaultComplement||''))return false;
   if(v.recipe==='imperative'&&!['VRB_WERKEN','VRB_ETEN','VRB_DRINKEN','VRB_SLAPEN','VRB_WACHTEN','VRB_LOPEN','VRB_STOPPEN','VRB_LUISTEREN','VRB_LEZEN','VRB_SCHRIJVEN','VRB_KIJKEN','VRB_BELLEN','VRB_OPENEN'].includes(verb.id))return false;
   if(v.recipe==='fronted_place'&&!['VRB_WERKEN','VRB_WONEN','VRB_SLAPEN','VRB_SPELEN','VRB_ETEN','VRB_DRINKEN','VRB_WACHTEN','VRB_LOPEN','VRB_RIJDEN'].includes(verb.id))return false;
   return v.recipe!=='imperative'||(!state.WHO?.active&&!state.TENSE?.active&&!state.CONNECT_1?.active&&!state.CONNECT_2?.active);
  });
  return base;
 }
 function label(id,value){
  if(!value)return 'Uit';
  if(id==='WHO'&&value.disambiguation)return value.label+(value.agreementClass==='plural'?' · meer':' · één');
  if(id==='TENSE')return {present:'Nu',past:'Vroeger',perfect:'Al gebeurd'}[value.code]||value.label;
  if(id==='SENTENCE_TYPE')return value.questionWord?'Vraag met '+value.questionWord:({declarative:'Vertel iets',yes_no_question:'Ja/nee-vraag',wh_question:'Vraag met waarom',fronted_time_or_place:'Begin met tijd',fronted_place:'Begin met plaats',imperative:'Geef een opdracht'})[value.recipe]||value.label;
  if(id==='VERB_FORM')return {finite:'Persoonsvorm',infinitive:'Hele werkwoord',participle:'Voltooid deelwoord'}[value.code]||value.label;
  return value.label;
 }
 root.TaalworpChoices={labels,rank,values,label,subjectFits};
 if(typeof module!=='undefined')module.exports=root.TaalworpChoices;
})(typeof globalThis!=='undefined'?globalThis:this);
