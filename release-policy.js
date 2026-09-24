// One release decision for new selections, saved lessons and legacy entry points.
(function(root){
 'use strict';
 // Only automated archive tests set this before loading; no URL or saved setting changes the release.
 const enabled=root.DigiBordArchiveReview!==true;
 const versions=Object.freeze({'CB-GRAM-001':'2026-09-24.modals.rest.4','CB-QUICK-014':'2026-09-25.snelvragen.regel.6'});
 const message='Deze inhoud is nog niet volledig nagekeken. Je opgeslagen les blijft bewaard.';
 const bankAllowed=bank=>!enabled||versions[bank?.bank_id]===bank?.source_version;
 function sessionAllowed(session){
  if(!enabled)return true;
  if(!session?.selected_item_ids?.length||!session.selected_content_refs?.length)return false;
  try{return session.selected_content_refs.every(ref=>{const current=root.ContentRuntime.itemById(ref.content_item_id);return current&&versions[current.content_bank_id]&&current.version===ref.content_item_version})}catch{return false}
 }
 function selectionAllowed(spec){
  if(!enabled)return true;
  try{return !!spec?.scope_clauses?.length&&spec.scope_clauses.every(scope=>root.ContentRuntime.selectionPool({...spec,scope_clauses:[scope]}).length>0)}catch{return false}
 }
 root.ReleasePolicy=Object.freeze({enabled,versions,message,bankAllowed,sessionAllowed,selectionAllowed});
})(typeof globalThis!=='undefined'?globalThis:this);
