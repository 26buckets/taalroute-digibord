(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./data/wz-micro-audit.js'):root.WZMicroAudit);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DigiRoutes=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(audit){
 'use strict';
 const REVIEW='MIGRATION_REVIEW_REQUIRED';
 const routes=Object.freeze([
  {id:'ALPHA_AC',label:'Alpha A–C',executionLevel:'Alpha A'},
  {id:'A0_A1',label:'A0 → A1',executionLevel:'A0'},
  {id:'A1_A2',label:'A1 → A2',executionLevel:'A1'},
  {id:'A2_B1',label:'A2 → B1',executionLevel:'A2'},
  {id:'B1_B2',label:'B1 → B2',executionLevel:'B1'},
  {id:'B2_C1',label:'B2 → C1',executionLevel:'B2'}
 ].map(Object.freeze));
 const clean=v=>String(v??'').trim().replace(/\s+/g,'').replace(/tot|->/gi,'→').replace(/–/g,'-').toUpperCase();
 const aliases=new Map(routes.flatMap(r=>[[clean(r.id),r.id],[clean(r.label),r.id]]));
 for(const [id,values] of Object.entries({ALPHA_AC:['Alpha','Alpha A','Alpha B','Alpha C'],A0_A1:['A0'],A1_A2:['A1','A1+','A1→A1+'],A2_B1:['A2'],B1_B2:['B1'],B2_C1:['B2','C1','C1→C2','C2']}))for(const value of values)aliases.set(clean(value),id);
 const resolve=value=>aliases.get(clean(value))||REVIEW;
 const label=value=>routes.find(r=>r.id===resolve(value))?.label||'Route nog te bepalen';
 // Adapter for the existing engine only; never use this to classify audited WZ records.
 const executionLevel=value=>/^(Alpha [ABC]|A[012]|A1\+|[BC][12])$/.test(value)?value:routes.find(r=>r.id===resolve(value))?.executionLevel||null;
 const ordered=values=>routes.filter(r=>values.some(v=>resolve(v)===r.id)).map(r=>r.id);
 function classification(item){
  const sourceLevel=item.sourceLevel??item.cefr_level??item.level??item.Niveau??item.route;
  const record=audit?.records[item.source_ref?.source_id]||audit?.records[item.content_item_id]||audit?.records[item.id];
  const fields=Object.hasOwn(item,'Nieuwe route')?item:record||(Object.hasOwn(item,'FreePlayGate')?item:null);
  return {sourceLevel,...(fields?Object.fromEntries(['Nieuwe route','Microconstructie','FreePlayGate','ComplexityBudget','Reclassificatie','NormVersion'].map(k=>[k,fields[k]])):{}),displayRoute:resolve(fields&&Object.hasOwn(fields,'Nieuwe route')?fields['Nieuwe route']:sourceLevel)};
 }
 function selectable(item,selectedMicroconstructures=[]){
  const c=classification(item);if(c.displayRoute===REVIEW)return false;
  if(!Object.hasOwn(c,'Nieuwe route'))return true;
  if(c.FreePlayGate==='FREE')return c.ComplexityBudget===1;
  return c.FreePlayGate==='GUIDED'&&[1,2].includes(c.ComplexityBudget)&&selectedMicroconstructures.includes(c.Microconstructie);
 }
 // Preserve the old source/execution level and the exact rolled objects. Never reroll during migration.
 function migrateApp(app,data){
  if(app.routeArchitectureVersion===1.1)return app;
  const displayRoute=resolve(app.level);
  const migrated={...app,displayRoute,routeArchitectureVersion:1.1};
  const kind=app.last?.type==='card'&&(app.cardKind||app.last.data?.kind);
  if(kind&&data){
   const oldRoute=/^Alpha|^A0/.test(app.level)?'R0':({A1:'R1','A1+':'R2',A2:'R3',B1:'R4',B2:'R5',C1:'R6',C2:'R6'}[app.level]);
   let pool=data.cardGames?.families.find(f=>f.id===kind)?.cards.filter(c=>c.routeId===oldRoute);
   if(kind==='tongue'&&data.tongueBank){const bank=data.tongueBank,level=bank.levels.includes(app.level)?app.level:app.level==='A1+'?'A1':'A0';pool=bank.cards.filter(c=>bank.levels.indexOf(c.entryLevel)<=bank.levels.indexOf(level))}
   if(pool?.length)migrated.legacyCardPool={kind,sourceLevel:app.level,ids:pool.map(c=>c.id)};
  }
  if(displayRoute===REVIEW)migrated.routeMigrationStatus=REVIEW;
  if(app.taalworpDice?.CONNECT_1?.active&&app.taalworpDice?.CONNECT_2?.active)migrated.taalworpLegacySnapshot={version:1,sourceLevel:app.level,currentVerb:app.currentVerb,verbLocked:!!app.verbLocked,setIds:structuredClone(app.taalworpSets||[app.taalworpSet].filter(Boolean)),dice:structuredClone(app.taalworpDice)};
  return migrated;
 }
 return Object.freeze({version:'1.1',REVIEW,routes,resolve,label,executionLevel,ordered,classification,selectable,migrateApp});
});
