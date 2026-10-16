(function(root){
 'use strict';
 const CONTRACT_VERSION='MATCH001-1.0';
 const BLOCK=Object.freeze({
  OPTION_CONTEXT_REQUIRED:'OPTION_CONTEXT_REQUIRED',
  RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN:'RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN',
  OPEN_RELATION_NOT_UNIQUE:'OPEN_RELATION_NOT_UNIQUE',
  NO_CANONICAL_PAIR_RULE:'NO_CANONICAL_PAIR_RULE',
  EMPTY_SIDE:'EMPTY_SIDE',
  DUPLICATE_LEFT:'DUPLICATE_LEFT',
  DUPLICATE_RIGHT:'DUPLICATE_RIGHT',
  CROSS_SIDE_COLLISION:'CROSS_SIDE_COLLISION'
 });
 function afterColon(value){
  const text=String(value||'').trim(),i=text.indexOf(':');
  return(i>=0?text.slice(i+1):text).trim();
 }
 const rules=Object.freeze({
  fout_verbeteren:Object.freeze({
   pairType:'ERROR_CORRECTION',
   relation:'incorrect_sentence_to_correct_sentence',
   leftSource:'prompt_after_first_colon',
   rightSource:'correct_answer',
   interactionRequirement:'IT_006_CORRECT_ERROR',
   build(item){return{left:afterColon(item.prompt),right:String(item.correct_answer||'').trim()}}
  }),
  zinnen_leggen:Object.freeze({
   pairType:'ORDER_TO_SENTENCE',
   relation:'scrambled_parts_to_correct_sentence',
   leftSource:'prompt_after_first_colon',
   rightSource:'correct_answer',
   interactionRequirement:'IT_008_ORDER',
   build(item){return{left:afterColon(item.prompt),right:String(item.correct_answer||'').trim()}}
  })
 });
 const blockedExerciseTypes=Object.freeze({
  meerkeuze_vorm:BLOCK.OPTION_CONTEXT_REQUIRED,
  meerkeuze_context:BLOCK.OPTION_CONTEXT_REQUIRED,
  invullen:BLOCK.RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN,
  betekenis_kiezen:BLOCK.RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN,
  functie_sorteren:BLOCK.RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN,
  scenario:BLOCK.OPEN_RELATION_NOT_UNIQUE,
  snelvraag:BLOCK.OPEN_RELATION_NOT_UNIQUE,
  herschrijven:BLOCK.OPEN_RELATION_NOT_UNIQUE,
  dialoog_aanvullen:BLOCK.OPEN_RELATION_NOT_UNIQUE,
  vrije_productie:BLOCK.OPEN_RELATION_NOT_UNIQUE
 });
 function candidate(item){
  const rule=rules[item?.exercise_type];
  if(!rule)return Object.freeze({safe:false,reason:blockedExerciseTypes[item?.exercise_type]||BLOCK.NO_CANONICAL_PAIR_RULE,pair:null});
  if(item.interaction_type!==rule.interactionRequirement)return Object.freeze({safe:false,reason:BLOCK.NO_CANONICAL_PAIR_RULE,pair:null});
  const built=rule.build(item);
  if(!built.left||!built.right)return Object.freeze({safe:false,reason:BLOCK.EMPTY_SIDE,pair:null});
  return Object.freeze({safe:true,reason:'SOURCE_DERIVED',pair:Object.freeze({
   pair_id:'PAIR-'+item.content_item_id,
   content_item_id:item.content_item_id,
   pair_type:rule.pairType,
   relation:rule.relation,
   left:Object.freeze({kind:'text',value:built.left,source:rule.leftSource}),
   right:Object.freeze({kind:'text',value:built.right,source:rule.rightSource}),
   topic:item.topic,
   cefr_level:item.cefr_level,
   source_bank:item.content_bank_id,
   source_version:item.version,
   contract_version:CONTRACT_VERSION
  })});
 }
 function audit(items){
  const safe=[],blocked=[],left=new Map(),right=new Map();
  for(const item of items||[]){
   const result=candidate(item);
   if(!result.safe){blocked.push(Object.freeze({content_item_id:item?.content_item_id||null,exercise_type:item?.exercise_type||null,reason:result.reason}));continue}
   const pair=result.pair;
   if(left.has(pair.left.value)){blocked.push(Object.freeze({content_item_id:pair.content_item_id,exercise_type:item.exercise_type,reason:BLOCK.DUPLICATE_LEFT,conflicts_with:left.get(pair.left.value)}));continue}
   if(right.has(pair.right.value)){blocked.push(Object.freeze({content_item_id:pair.content_item_id,exercise_type:item.exercise_type,reason:BLOCK.DUPLICATE_RIGHT,conflicts_with:right.get(pair.right.value)}));continue}
   left.set(pair.left.value,pair.content_item_id);right.set(pair.right.value,pair.content_item_id);safe.push(pair);
  }
  const leftValues=new Set(safe.map(pair=>pair.left.value)),cross=[];
  for(const pair of safe)if(leftValues.has(pair.right.value))cross.push(pair.content_item_id);
  if(cross.length)throw new Error('MATCH 001 kruisconflict tussen linker en rechter zijde: '+cross.join(', '));
  return Object.freeze({
   contract_version:CONTRACT_VERSION,
   source_count:(items||[]).length,
   safe_count:safe.length,
   blocked_count:blocked.length,
   pairs:Object.freeze(safe),
   blocked:Object.freeze(blocked),
   blocked_by_reason:Object.freeze(blocked.reduce((acc,row)=>(acc[row.reason]=(acc[row.reason]||0)+1,acc),{}))
  });
 }
 const api=Object.freeze({CONTRACT_VERSION,BLOCK,rules,blockedExerciseTypes,candidate,audit});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.MatchPairContract=api;
})(typeof globalThis!=='undefined'?globalThis:this);
