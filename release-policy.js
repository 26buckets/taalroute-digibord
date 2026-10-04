// One release decision for new selections, saved lessons and legacy entry points.
(function(root){
 'use strict';
 // Only automated archive tests set this before loading; no URL or saved setting changes the release.
 const enabled=root.DigiBordArchiveReview!==true;
 const versions=Object.freeze({'CB-GRAM-001':'2026-09-24.modals.rest.4','CB-QUICK-014':'2026-09-25.snelvragen.regel.6','CB-BETWEEN-LINES-012':'2026-09-23.1'});
 const wzVersion='2026-10-03.wz.release.1';
 const releasedVersions=Object.freeze({...versions,...Object.fromEntries(['001','002','003','004','005'].map(n=>['CB-WZ-'+n,wzVersion])),...Object.fromEntries(Object.values(root.E1Release?.banks||{}).map(b=>[b.bank_id,b.source_version]))});
 const cardKinds=Object.freeze(['mission','conversation','verbs','spelling','puzzles','tongue','idioms',...(!root.E1Release?['story']:[])]);
 const cardAllowed=kind=>!enabled||cardKinds.includes(kind);
 const message='Deze les is nu niet beschikbaar. Je opgeslagen les blijft bewaard.';
 const bankAllowed=bank=>!enabled||(!(root.E1Release&&bank?.bank_id==='CB-QUICK-014')&&releasedVersions[bank?.bank_id]===bank?.source_version);
 function sessionAllowed(session){
  if(!enabled)return true;
  if(!session?.selected_item_ids?.length||!session.selected_content_refs?.length)return false;
  try{return session.selected_content_refs.every(ref=>{const current=root.ContentRuntime.itemById(ref.content_item_id);return current&&releasedVersions[current.content_bank_id]&&current.version===ref.content_item_version})}catch{return false}
 }
 function selectionAllowed(spec){
  if(!enabled)return true;
  try{return !!spec?.scope_clauses?.length&&spec.scope_clauses.every(scope=>root.ContentRuntime.selectionPool({...spec,scope_clauses:[scope]}).length>0)}catch{return false}
 }
 root.ReleasePolicy=Object.freeze({enabled,versions:releasedVersions,cardKinds,cardAllowed,message,bankAllowed,sessionAllowed,selectionAllowed});
})(typeof globalThis!=='undefined'?globalThis:this);
