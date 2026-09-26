// Preserve 1.24 verbatim before the new version writes any application state.
(function(){
 const key='taalroute-v0124-backup-before-v0125';
 try{if(localStorage.getItem(key)!==null)return;const values={};for(let i=0;i<localStorage.length;i++){const name=localStorage.key(i);if(name.startsWith('taalroute-')&&name!==key)values[name]=localStorage.getItem(name)}
  const snapshot=JSON.stringify({version:'1.24',created_at:new Date().toISOString(),values});localStorage.setItem(key,snapshot);
  if(localStorage.getItem(key)!==snapshot)throw new Error('Reservekopie kon niet worden gecontroleerd.');
 }catch(error){window.DigiStorageBackupError=error}
})();
