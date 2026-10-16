// Inspect the executed public runtime, including both intentional selection modes.
function snapshot(){
 const records=[],routes=DigiRoutes.routes.map(r=>r.id);
 function wrap(record,family){
  const id=record.id||record.content_item_id,free=[],guided=[];
  for(const route of routes){APP.level=route;for(const mode of [false,true]){
   APP.cardGuided=mode;
   const list=family==='between'?ContentRuntime.filterSource({bank_ids:['CB-BETWEEN-LINES-012'],levels:[route]}):cardsFor(family,false,route,'');
   if(list.some(x=>(x.id||x.content_item_id)===id))(mode?guided:free).push(route);
  }}
  return {id,family,record,free,guided};
 }
 for(const f of RUNTIME.cardGames.families.filter(f=>f.id!=='tongue'))for(const c of f.cards)records.push(wrap(c,f.id));
 for(const c of RUNTIME.tongueBank.cards)records.push(wrap(c,'tongue'));
 for(const c of ContentRuntime.items().filter(c=>c.content_bank_id==='CB-BETWEEN-LINES-012'))records.push(wrap(c,'between'));
 return records.sort((a,b)=>a.id.localeCompare(b.id));
}
module.exports=snapshot;
