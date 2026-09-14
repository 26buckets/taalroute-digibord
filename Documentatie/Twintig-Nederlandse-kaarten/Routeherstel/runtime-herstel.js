function migrateRoute(c,storage=globalThis.localStorage){
 const key='taalroute-digiboard-les-'+c.id+'-v1',marker=key+'-route-revision';
 try{
  if(!c.routeRevision||storage.getItem(marker)===c.routeRevision)return;
  let mapping,order;const finish=c.anchors.length-1;
  const pos=n=>Number.isInteger(n)&&mapping?mapping[n]??Math.min(n,finish):n;
  const taskId=id=>/^t\d+$/.test(id)?'t'+Math.max(1,Math.min(finish-1,pos(Number(id.slice(1))))).toString().padStart(2,'0'):id;
  const connections=(c.passages||[]).filter(p=>p.optional).map(p=>({id:p.id,type:p.boat?'ferry':'tunnel',from:p.from,exits:[p.to],optional:true,label:p.label}));
  const board=b=>{if(!b)return;if(order&&Array.isArray(b.tasks))b.tasks=order.slice(1,-1).map(n=>taskId(b.tasks[n-1]));if(b.layout)b.layout.connections=JSON.parse(JSON.stringify(connections));};
  const assignments=a=>!a||!order?a:Object.fromEntries(order.slice(1,-1).map((old,i)=>['t'+String(i+1).padStart(2,'0'),a['t'+String(old).padStart(2,'0')]]).filter(([,v])=>v!==undefined));
  const session=s=>{if(!s)return;board(s.board);s.players?.forEach(p=>p.pos=pos(p.pos));s.selected=Math.min(pos(s.selected),finish-1);if(s.lessonAssignments)s.lessonAssignments=assignments(s.lessonAssignments);if(s.matrix?.slots)s.matrix.slots=assignments(s.matrix.slots);
   if(s.travel){s.travel.visits?.forEach(v=>v.at=pos(v.at));s.travel.uses=s.travel.uses.filter(v=>connections.some(c=>c.id===v.id));s.travel.keys=s.travel.keys.map(v=>({...v,ids:v.ids.filter(id=>connections.some(c=>c.id===id))}));s.travel.pending=null;s.travel.last=null;}
  };
  for(const suffix of['','-reserve']){
   const raw=storage.getItem(key+suffix);if(!raw)continue;
   const d=JSON.parse(raw);if(!d||d.schemaVersion!==2||!Array.isArray(d.boards)||!d.session)continue;
   if(d.routeRevision===c.routeRevision)continue;mapping=d.routeRevision?null:c.legacyPositionMap;order=d.routeRevision?null:c.legacyIndexOrder;
   const backup=key+suffix+'-voor-routeherstel';if(storage.getItem(backup)===null)storage.setItem(backup,raw);
   d.boards.forEach(board);session(d.session);d.history?.forEach(session);d.previous?.forEach(p=>{session(p.session);p.history?.forEach(session);});d.routeRevision=c.routeRevision;
   storage.setItem(key+suffix,JSON.stringify(d));
  }
  storage.setItem(marker,c.routeRevision);
 }catch(error){console.warn('Routeherstel: oorspronkelijke lesopslag behouden.',error);}
}
