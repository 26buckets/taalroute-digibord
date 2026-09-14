from pathlib import Path
app=Path('/Users/nicoknoester/Documents/Codex/2026-09-12/ik-wil-een-volgend-onderdeel-maken/outputs/DigiBoard')
s=(app/'Kaarten/nieuwe-werelden.js').read_text().replace('DigiBoardNewWorld','DigiBoardDutchWorld')
s=s.replace('/* New maps share geometry for the painted scene, tiles, masks and moving pawn.\n * Existing map modules and their spatial overrides are deliberately independent. */','/* Dutch map runtime: portal depth follows the doorway plane at rest and in motion.\n * Kept separate from earlier maps to preserve their registered behaviour. */')
s=s.replace("const find=(a,b)=>passages.find(p=>p.from===Math.min(a,b)&&p.to===Math.max(a,b));", "const find=(a,b)=>passages.find(p=>(p.from===a&&p.to===b)||(p.from===b&&p.to===a));")
a=s.index(' function pose(');b=s.index(' const svg=',a)
s=s[:a]+''' function depthAt(point){
  // Only the apron outside a doorway is in front of its rim. Size never decides depth.
  for(const p of passages.filter(p=>p.kind==='tunnel'))for(const path of[p.enter,[...p.exit].reverse()]){
   const mouth=path.at(-2),inner=path.at(-1),dx=inner[0]-mouth[0],dy=inner[1]-mouth[1],len=Math.hypot(dx,dy),vx=point[0]-mouth[0],vy=point[1]-mouth[1];
   const forward=(vx*dx+vy*dy)/len,side=Math.abs(vx*dy-vy*dx)/len;
   if(forward<=1&&forward>=-125&&side<65)return 11;
  }
  return 7;
 }
 function pose(from,to,t){
  const p=find(from,to),reverse=p?from===p.to:from>to;t=clamp(t);
  const along=(path,k)=>PraatpadRoutes.along(path,clamp(k));
  if(!p){const point=along(legs[Math.min(from,to)],reverse?1-t:t);return{point,opacity:1,scale:1,phase:'walk',kind:'walk',depth:depthAt(point)};}
  const distance=ps=>ps.slice(1).reduce((s,q,i)=>s+Math.hypot(q[0]-ps[i][0],q[1]-ps[i][1]),0);
  const k=reverse?1-t:t;let point,opacity=1,scale=1,phase,boat=false;
  if(p.kind==='ferry'){
   const [a,b]=p.timeline||[.18,.82];
   if(k<a){point=along(p.enter,k/a);phase='boarding';}
   else if(k<=b){point=along(p.water,(k-a)/(b-a));phase='sailing';boat=true;}
   else{point=along(p.exit,(k-b)/(1-b));phase='leaving';}
   if(reverse)phase=({boarding:'leaving',leaving:'boarding'})[phase]||phase;
   return{point,opacity,scale,phase,kind:'ferry',depth:depthAt(point),boat,boatPoint:point};
  }
  const [a,b,d,e]=p.timeline||[.26,.4,.6,.74];
  if(k<a){point=along(p.enter.slice(0,-1),k/a);phase='approach';const len=distance(p.enter.slice(0,-1));scale=.45+.55*clamp((1-k/a)*len/Math.min(32,len||1));boat=!!p.boat&&(k/a)*len>=distance(p.enter.slice(0,(p.boardAt??p.enter.length-3)+1));}
  else if(k<b){const z=(k-a)/(b-a);point=mix(p.enter.at(-2),p.enter.at(-1),z);scale=.45-z*.17;opacity=1-clamp((z-.72)/.28);phase='enter';boat=!!p.boat;}
  else if(k<=d){point=mix(p.enter.at(-1),p.exit[0],(k-b)/(d-b));opacity=0;scale=.28;phase='hidden';boat=!!p.boat;}
  else if(k<e){const z=(k-d)/(e-d);point=mix(p.exit[0],p.exit[1],z);scale=.28+z*.17;opacity=clamp(z/.28);phase='exit';boat=!!p.boat;}
  else{point=along(p.exit.slice(1),(k-e)/(1-e));phase='arrive';const len=distance(p.exit.slice(1));scale=.45+.55*clamp((k-e)/(1-e)*len/Math.min(32,len||1));boat=!!p.boat&&((k-e)/(1-e))*len<=distance(p.exit.slice(1,(p.landAt??2)+1));}
  if(reverse)phase=({approach:'arrive',arrive:'approach',enter:'exit',exit:'enter'})[phase]||phase;
  return{point,opacity,scale,phase,kind:'tunnel',depth:depthAt(point),boat,boatPoint:point};
 }
''' + s[b:]
s=s.replace('connections:[],passages,pose','connections:passages.filter(p=>p.optional).map(p=>({id:p.id,type:p.boat?\'ferry\':\'tunnel\',from:p.from,exits:[p.to],optional:true,label:p.label})),passages,pose,depthAt')
a=s.index('pawnDepth(point,w,h){');b=s.index(',duration:',a)
s=s[:a]+"pawnDepth(point,w,h){const f=fit(w,h);return depthAt([(point[0]-f.x)/f.scale,(point[1]-f.y)/f.scale]);}"+s[b:]
s=s.replace("const m=globalThis.DigiBoardMap=",'''if(passages.some(p=>p.kind==='ferry'||p.boat))extras+=svg('boat','new-world-lift-back','<g data-dutch-boat visibility="hidden"><ellipse cx="0" cy="9" rx="39" ry="11" fill="#173d49" opacity=".25"/><path d="M-38 -3Q-34 19 0 21Q34 19 38 -3L24 -17H-24Z" fill="#805939" stroke="#f2e6cf" stroke-width="3"/><path d="M-31 -3L-21 -12H21L31 -3Q0 11 -31 -3Z" fill="#d5bb8c"/><path d="M-26 4Q0 15 26 4" fill="none" stroke="#263f46" stroke-width="3"/></g>');
 const m=globalThis.DigiBoardMap=''' )
s=s.replace("special:true,previews:c.previews", "special:true,routeNote:c.routeNote,previews:c.previews")
s=s.replace("(p.kind==='cable'?'Kabelbaan':p.kind==='lift'?'Lift':'T1')", "(p.kind==='ferry'?'Pont':p.boat?'Boot':'T'+(passages.filter(x=>x.kind==='tunnel').indexOf(p)+1))")
s=s.replace("const f=fit($('pp-map').clientWidth,$('pp-map').clientHeight);\n   for(const p", "const f=fit($('pp-map').clientWidth,$('pp-map').clientHeight);\n   const boat=root.querySelector('[data-dutch-boat]');if(boat){const q=host.anim?.boatPose;boat.setAttribute('visibility',q?.boat?'visible':'hidden');if(q?.boat){boat.setAttribute('transform',`translate(${q.point}) scale(${q.scale})`);boat.style.opacity=q.opacity;}}\n   for(const p")
s=s.replace("'newDepth']", "'newDepth','boatPose']")
s=s.replace("newDepth:q.kind==='tunnel'?q.depth:undefined", "newDepth:q.depth,boatPose:q")
s=s.replace("if(passage){$('pp-transit-label')", "if(passage){$('pp-transit-label')")
s=s.replace("q.kind==='lift'?'Met de lift naar vak '+to:'Op weg naar vak '+to", "q.kind==='lift'?'Met de lift naar vak '+to:q.kind==='ferry'?'Met het pontje naar vak '+to:'Op weg naar vak '+to")
s=s.replace("host.anim.pos=record.from;const direction=", "host.anim.pos=record.from;if(find(record.from,record.to)){await segment(record.from,record.to,token);return;}const direction=")
s=s.replace('duration=passage?5200:650','duration=passage?(passage.duration||5200):650')
s=s.replace(" m.install=()=>{", """ m.install=()=>{
  document.getElementById('praatpad-board').dataset.dutchMap='true';
  document.getElementById('pp-map').addEventListener('click',event=>{
   if(!event.isTrusted||event.detail===0)return;
   const control=event.target.closest('button');if(control&&!control.matches('.pp-tile'))return;
   const map=document.getElementById('pp-map'),rect=map.getBoundingClientRect(),f=fit(map.clientWidth,map.clientHeight),point=[(event.clientX-rect.x-f.x)/f.scale,(event.clientY-rect.y-f.y)/f.scale];
   let nearest=0,best=Infinity;anchors.slice(1,-1).forEach((p,i)=>{const d=Math.hypot(p[0]-point[0],p[1]-point[1]);if(d<best){best=d;nearest=i+1;}});
   const tile=map.querySelector('[data-node="'+nearest+'"]');
   if(best<42&&tile&&!tile.disabled){event.preventDefault();event.stopImmediatePropagation();tile.click();}
  },true);""")
a=s.index(" extras+=svg('front','new-world-front'")
b=s.index(" if(passages.some(p=>p.kind==='cable'))",a)
s=s[:a]+""" for(const [id,cls,masks]of[['front','new-world-front',c.masks.filter(m=>!m.bridge)],['bridge-front','new-world-front dutch-bridge-front',c.masks.filter(m=>m.bridge)]]){
  if(!masks.length)continue;
  extras+=svg(id,cls,`<defs>${masks.map(m=>`<clipPath id="${prefix+m.id}"><path d="${m.path}"/></clipPath>`).join('')}</defs>`+masks.map(m=>`<image width="${W}" height="${H}" href="${image}" clip-path="url(#${prefix+m.id})"/>`).join(''));
 }
"""+s[b:]
(app/'Kaarten/nederland-werelden.js').write_text(s)
s=(app/'Kaarten/nederland-werelden.js').read_text()
s=s.replace('function create(c){',Path('work/nederland-speelbaar/runtime-herstel.js').read_text()+'\nfunction create(c){\n migrateRoute(c);')
s=s.replace(' const legs=anchors.slice(0,-1).map((a,i)=>c.waypoints?.[i]||[a,anchors[i+1]]);',''' const legs=anchors.slice(0,-1).map((a,i)=>c.waypoints?.[i]||[a,anchors[i+1]]);
 const walkDuration=i=>Math.max(650,legs[i].slice(1).reduce((n,p,j)=>n+Math.hypot(p[0]-legs[i][j][0],p[1]-legs[i][j][1]),0)/150*1000);
 const durationFor=(a,b)=>find(a,b)?.duration||walkDuration(Math.min(a,b));''')
s=s.replace('duration:from=>find(from,from+1)?5200:650','duration:from=>durationFor(from,from+1)')
s=s.replace('duration=passage?(passage.duration||5200):650','duration=durationFor(from,to)')
s=s.replace('return{create};','return{create,migrateRoute};')
s=s.replace(" const m=globalThis.DigiBoardMap=",''' const mouthBadges=passages.filter(p=>p.kind==='tunnel').flatMap((p,i)=>[p.enter.at(-2),p.exit[1]].map((point,j)=>({point:p.mouthLabels?.[j]||[point[0]-40,point[1]-38],text:'T'+(i+1),id:p.id+'-'+j})));
 extras+=svg('mouth-labels','dutch-mouth-labels',mouthBadges.map(b=>`<g transform="translate(${b.point})"><rect x="-17" y="-13" width="34" height="26" rx="8" fill="#fcf8ed" stroke="#39515b" stroke-width="1.5"/><text text-anchor="middle" y="5" font-family="Arial,sans-serif" font-size="17" font-weight="bold" fill="#253f49">${b.text}</text></g>`).join(''));
 const m=globalThis.DigiBoardMap=''' )
(app/'Kaarten/nederland-werelden.js').write_text(s)
