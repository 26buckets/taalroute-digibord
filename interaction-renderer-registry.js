(function(root){
 'use strict';
 const definitions=[
  {id:'OPEN_PROMPT',label:'Open opdracht',capabilities:['PROMPT','FEEDBACK'],interactions:['IT_001_OPEN_ANSWER','IT_002_RAPID_ANSWER','IT_012_CREATE_EXAMPLE','IT_018_COMPLETE_SENTENCE']},
  {id:'CHOICE',label:'Keuze',capabilities:['CHOICE','FEEDBACK'],interactions:['IT_004_MULTIPLE_CHOICE','IT_017_IDENTIFY']},
  {id:'TEXT_INPUT',label:'Tekstinvoer',capabilities:['TEXT_INPUT','FEEDBACK'],interactions:['IT_005_FILL_GAP','IT_006_CORRECT_ERROR','IT_007_TRANSFORM_SENTENCE']},
  {id:'TEXT_ORDER',label:'Tekstvolgorde',capabilities:['TEXT_ORDER','FEEDBACK'],interactions:['IT_008_ORDER'],adapter:'text_order'}
 ];
 const byInteraction=new Map();
 for(const def of definitions){const frozen=Object.freeze({...def,capabilities:Object.freeze([...def.capabilities]),interactions:Object.freeze([...def.interactions])});for(const interaction of frozen.interactions){if(byInteraction.has(interaction))throw new Error('InteractionRenderer dubbel voor '+interaction);byInteraction.set(interaction,frozen)}}
 function getByInteraction(type){return byInteraction.get(type)||null}
 function all(){return Object.freeze([...new Set(byInteraction.values())])}
 function compatibility(item,engineId){
  const renderer=getByInteraction(item?.interaction_type),engines=root.GameEngineRegistry||(typeof require==='function'?require('./game-engine-registry.js'):null);
  if(!renderer)return Object.freeze({compatible:false,reason:'renderer_missing',mode:'NOT_COMPATIBLE',renderer:null,adapter:null});
  const engine=engines?.get(engineId);if(!engine)return Object.freeze({compatible:false,reason:'unknown_engine',mode:'NOT_COMPATIBLE',renderer:renderer.id,adapter:null});
  if(!engines.supports(engineId,renderer.capabilities))return Object.freeze({compatible:false,reason:'engine_capability_missing',mode:'NOT_COMPATIBLE',renderer:renderer.id,adapter:null});
  return Object.freeze({compatible:true,reason:renderer.adapter||'supported',mode:renderer.adapter?'COMPATIBLE_WITH_ADAPTER':'COMPATIBLE',renderer:renderer.id,adapter:renderer.adapter||null});
 }
 const api=Object.freeze({getByInteraction,all,compatibility});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.InteractionRendererRegistry=api;
})(typeof globalThis!=='undefined'?globalThis:this);
