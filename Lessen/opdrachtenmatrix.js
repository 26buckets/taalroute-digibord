globalThis.DigiBoardMatrix=(()=>{
 'use strict';
 const B=DigiBoardMatrixContent,byId=new Map(B.cards.map(c=>[c.id,c])),buckets=new Map();
 for(const r of B.routes)for(const s of B.shapes)buckets.set(r.id+'/'+s.id,B.cards.filter(c=>c.routeId===r.id&&c.shape===s.id));
 const route=settings=>B.routes.find(r=>r.legacyLevel===settings.learningLevel)||B.routes[2];
 const shape=(base,mapId=globalThis.DigiBoard?.mapId)=>DigiBoardTileShapes[mapId]?.[base.number-1]||({vertel:'circle',vraag:'square',kies:'triangle',losop:'diamond'})[base.type]||'circle';
 const day=()=>new Date().toLocaleDateString('sv-SE');
 const group=s=>s.groupId?'group:'+s.groupId:s.groupName?'name:'+s.groupName:'people:'+s.people.slice().sort().join(',');
 const random=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n;};
 function progress(d){if(!validProgress(d.matrixProgress))d.matrixProgress=null;d.matrixProgress??={version:1,groups:{}};if(d.matrixProgress.version!==1||!d.matrixProgress.groups||typeof d.matrixProgress.groups!=='object')d.matrixProgress={version:1,groups:{}};const key=group(d.session);return d.matrixProgress.groups[key]??={used:{},recent:[],cycles:{}};}
 function pick(d,shapeId,exclude=[],topic='all'){
  const p=progress(d),r=route(d.settings).id,key=r+'/'+shapeId,all=buckets.get(key).filter(c=>topic==='all'||c.topic===topic),seen=p.used[key]||[],available=all.filter(c=>!seen.includes(c.id)&&!exclude.includes(c.id));
  let pool=available;
  if(!pool.length){pool=all.filter(c=>!seen.includes(c.id));if(!pool.length){pool=all.filter(c=>!exclude.includes(c.id));if(!pool.length)pool=all;}}
  const fresh=pool.filter(c=>!p.recent.slice(-3).includes(c.scenario));if(fresh.length)pool=fresh;
  return pool[random(pool.length)];
 }
 function consume(d,row){const p=progress(d),key=row.routeId+'/'+row.shape,all=buckets.get(key);p.used[key]??=[];if(p.used[key].length>=all.length){p.used[key]=[];p.cycles[key]=(p.cycles[key]||0)+1;}if(!p.used[key].includes(row.id))p.used[key].push(row.id);p.recent.push(row.scenario);p.recent=p.recent.slice(-12);}
 function ensure(d,content){
  const s=d.session,r=route(d.settings),date=day();progress(d);
  let m=s.matrix;
  if(!m||m.route!==r.id||!m.slots||m.version!==1){
   m=s.matrix={version:1,route:r.id,day:date,slots:{},playerSlots:{},lastTurn:s.turn||0,awaiting:false,revision:(m?.revision||0)+1};
   const chosen=[];for(const base of content.tasks){const row=pick(d,shape(base),chosen);m.slots[base.id]=row.id;chosen.push(row.id);}
  }
  // Assignment changes only on a committed turn, never on animation or rendering.
  if((s.turn||0)!==m.lastTurn||m.awaiting){
   if(s.travel?.pending){m.awaiting=true;return;}
   const p=s.players[s.active],base=content.tasks.find(c=>c.id===s.board.tasks[p.pos-1]);
   if(base){const row=pick(d,shape(base),[m.slots[base.id]]);m.slots[base.id]=row.id;m.playerSlots??={};m.playerSlots[p.id]={baseId:base.id,id:row.id};consume(d,row);m.revision++;}
   m.lastTurn=s.turn||0;m.awaiting=false;
  }
 }
 function select(d,base,id){const row=byId.get(id);if(!row||row.routeId!==route(d.settings).id||row.shape!==shape(base))return false;d.session.matrix.slots[base.id]=id;const p=d.session.players[d.session.active];if(p.pos===base.number){d.session.matrix.playerSlots??={};d.session.matrix.playerSlots[p.id]={baseId:base.id,id};}d.session.matrix.revision++;consume(d,row);return true;}
 function another(d,base){return select(d,base,pick(d,shape(base),[task(base,d.settings,d.session).lessonId]).id);}
 function task(base,settings,session){
  const r=route(settings),sh=shape(base),player=session.players?.[session.active],saved=player?.pos===base.number?session.matrix?.playerSlots?.[player.id]:null,chosen=byId.get(saved?.baseId===base.id?saved.id:session.matrix?.slots?.[base.id]),row=chosen?.routeId===r.id&&chosen.shape===sh?chosen:buckets.get(r.id+'/'+sh)[(base.number-1)%60];
  return fromRow(base,row,settings);
 }
 function fromRow(base,row,settings){const r=B.routes.find(r=>r.id===row.routeId),sh=B.shapes.find(s=>s.id===row.shape),partner=['pairs','groups'].includes(settings.workForm)?row.partner:'';
  return{...base,...row,id:base.id,lessonId:row.id,type:sh.kind,level:r.legacyLevel,routeLabel:r.label,shapeLabel:sh.label,shapeSymbol:sh.symbol,family:sh.task,familyColor:sh.color,teacherCriterion:row.criterion,grammarId:row.id,partner,help:'Voorbeeld: '+row.model,printSummary:row.instruction+(row.input?' '+row.input:''),printShort:row.instruction,variants:{instap:{instruction:row.instruction,support:row.support},basis:{instruction:row.instruction},extra:{instruction:row.retry}}};
 }
 function byLesson(id,base,settings){const c=byId.get(id);return c?fromRow(base,c,settings):null;}
 function validProgress(p){return !p||p.version===1&&p.groups&&typeof p.groups==='object'&&!Array.isArray(p.groups)&&Object.values(p.groups).every(g=>g&&g.used&&typeof g.used==='object'&&Object.values(g.used).every(a=>Array.isArray(a)&&a.length<=1000&&a.every(x=>byId.has(x)))&&Array.isArray(g.recent)&&g.recent.length<=12&&g.cycles&&typeof g.cycles==='object');}
 function validSession(m){return !m||m.version===1&&B.routes.some(r=>r.id===m.route)&&typeof m.day==='string'&&Number.isInteger(m.lastTurn)&&Number.isInteger(m.revision)&&typeof m.awaiting==='boolean'&&m.slots&&typeof m.slots==='object'&&Object.values(m.slots).every(x=>byId.has(x));}
 return{bank:B,byId,route,shape,ensure,select,another,task,byLesson,validProgress,validSession,consume,pick,group,progress};
})();
