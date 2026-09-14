/* Dutch map runtime: portal depth follows the doorway plane at rest and in motion.
 * Kept separate from earlier maps to preserve their registered behaviour. */
globalThis.DigiBoardDutchWorld=(()=>{
'use strict';
const W=1672,H=941,clamp=t=>Math.max(0,Math.min(1,t)),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function create(c){
 const image=`Kaarten/assets/${c.id}/${c.image}.png`,prefix=c.id+'-',passages=c.passages||[],anchors=c.anchors;
 const fit=(w,h)=>{const scale=Math.min(w/W,h/H);return{scale,x:(w-W*scale)/2,y:(h-H*scale)/2};},screen=(p,f)=>[p[0]*f.scale+f.x,p[1]*f.scale+f.y];
 const find=(a,b)=>passages.find(p=>(p.from===a&&p.to===b)||(p.from===b&&p.to===a));
 const legs=anchors.slice(0,-1).map((a,i)=>c.waypoints?.[i]||[a,anchors[i+1]]);
 function depthAt(point){
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
 const svg=(id,cls,body)=>`<svg id="${prefix+id}" class="new-world-layer ${cls}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${body}</svg>`;
 const palette={circle:['#e4bdb2','#985746'],square:['#aed3e8','#367aa4'],triangle:['#b6d6be','#3b7655'],diamond:['#dbccea','#785799']};
 const tile=(shape)=>shape==='circle'?'<ellipse rx=".47" ry=".44"/>':shape==='square'?'<rect x="-.44" y="-.42" width=".88" height=".84" rx=".08"/>':shape==='triangle'?'<path d="M0 -.50 L.51 .40 Q.54 .47 .45 .47 H-.45 Q-.54 .47 -.51 .40 Z"/>':'<path d="M0 -.53 L.52 0 L0 .53 L-.52 0 Z"/>';
 const fills=Object.entries(palette).map(([shape,colors])=>`<linearGradient id="${prefix}fill-${shape}" x2=".4" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".4" stop-color="#fff8e8"/><stop offset="1" stop-color="${colors[0]}"/></linearGradient>`).join('');
 let extras=svg('tiles','new-world-tiles',`<defs>${fills}<filter id="${prefix}shade" x="-25%" y="-25%" width="150%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#153044" flood-opacity=".35"/></filter></defs>`+anchors.slice(1,-1).map((a,i)=>{const shape=c.shapes[i],colors=palette[shape];return`<g transform="translate(${a})" style="filter:url(#${prefix}shade)"><g transform="scale(${c.size})" fill="url(#${prefix}fill-${shape})" stroke="${colors[1]}" stroke-width=".04" stroke-linejoin="round">${tile(shape)}</g></g>`;}).join(''));
 if(c.paintedRoute)extras='';
 for(const [id,cls,masks]of[['front','new-world-front',c.masks.filter(m=>!m.bridge)],['bridge-front','new-world-front dutch-bridge-front',c.masks.filter(m=>m.bridge)]]){
  if(!masks.length)continue;
  extras+=svg(id,cls,`<defs>${masks.map(m=>`<clipPath id="${prefix+m.id}"><path d="${m.path}"/></clipPath>`).join('')}</defs>`+masks.map(m=>`<image width="${W}" height="${H}" href="${image}" clip-path="url(#${prefix+m.id})"/>`).join(''));
 }
 if(passages.some(p=>p.kind==='cable')){
  extras+=svg('cable-back','new-world-lift-back','<g data-lift-car><path d="M0 -65V-47 M-20 -47H20" stroke="#293e49" stroke-width="4" fill="none"/><path d="M-28 -45 Q0 -53 28 -45 L31 5 H-31Z" fill="#bb8c53" stroke="#473e32" stroke-width="3"/><path d="M-23 -40 H23 L26 -2 H-26Z" fill="#b4c6bf"/><path d="M-29 2 H29 V8 H-29Z" fill="#55493b"/></g>');
  extras+=svg('cable-front','new-world-front','<g data-lift-car><path d="M-28 -44 L-30 7 H30 L28 -44 M-28 -44 Q0 -51 28 -44 M-30 -9 H30" fill="none" stroke="#63452a" stroke-width="4"/><path d="M-29 -5 H29 V8 H-29Z" fill="#b68042" stroke="#63452a" stroke-width="2"/><path d="M-9 -44V-10 M9 -44V-10" stroke="#71583e" stroke-width="2"/></g>');
 }
 if(passages.some(p=>p.kind==='lift')){
  extras+=svg('lift-back','new-world-lift-back','<g data-lift-car><path d="M-25 -54 H25 V2 H-25Z" fill="#334d61" stroke="#d6e3e7" stroke-width="3"/><path d="M-20 -48 H20 V-5 H-20Z" fill="#bdcfdb"/><path d="M-30 0 L-22 -9 H25 L32 0 L23 9 H-25Z" fill="#c9d0cf" stroke="#344f60" stroke-width="3"/></g>');
  extras+=svg('lift-front','new-world-front','<g data-lift-car><path d="M-27 -52 V5 M27 -52 V5 M-27 -52 H27 M-27 -15 H27 M-27 3 H27" fill="none" stroke="#496274" stroke-width="4"/><path d="M-22 -12 V3 M-10 -12 V3 M3 -12 V3 M15 -12 V3" stroke="#9eb0bd" stroke-width="2"/><path d="M-30 4 H30 V10 H-30Z" fill="#6b7f8a"/></g>');
 }
 if(passages.some(p=>p.kind==='ferry'||p.boat))extras+=svg('boat','new-world-lift-back','<g data-dutch-boat visibility="hidden"><ellipse cx="0" cy="9" rx="39" ry="11" fill="#173d49" opacity=".25"/><path d="M-38 -3Q-34 19 0 21Q34 19 38 -3L24 -17H-24Z" fill="#805939" stroke="#f2e6cf" stroke-width="3"/><path d="M-31 -3L-21 -12H21L31 -3Q0 11 -31 -3Z" fill="#d5bb8c"/><path d="M-26 4Q0 15 26 4" fill="none" stroke="#263f46" stroke-width="3"/></g>');
 const m=globalThis.DigiBoardMap={id:c.id,label:c.label,content:c.content,image,extras,special:true,routeNote:c.routeNote,previews:c.previews,positions:{},newWorld:true,paintedRoute:!!c.paintedRoute};
 m.install=()=>{
  document.getElementById('praatpad-board').dataset.dutchMap='true';
  document.getElementById('pp-map').addEventListener('click',event=>{
   if(!event.isTrusted||event.detail===0)return;
   const control=event.target.closest('button');if(control&&!control.matches('.pp-tile'))return;
   const map=document.getElementById('pp-map'),rect=map.getBoundingClientRect(),f=fit(map.clientWidth,map.clientHeight),point=[(event.clientX-rect.x-f.x)/f.scale,(event.clientY-rect.y-f.y)/f.scale];
   let nearest=0,best=Infinity;anchors.slice(1,-1).forEach((p,i)=>{const d=Math.hypot(p[0]-point[0],p[1]-point[1]);if(d<best){best=d;nearest=i+1;}});
   const tile=map.querySelector('[data-node="'+nearest+'"]');
   if(best<42&&tile&&!tile.disabled){event.preventDefault();event.stopImmediatePropagation();tile.click();}
  },true);
  document.getElementById('praatpad-board').dataset.paintedRoute=String(!!c.paintedRoute);
  const R=PraatpadRoutes;
  R.layout=(b,w,h)=>{const f=fit(w,h);return{points:anchors.map(p=>screen(p,f)),tileWidth:c.size[0]*f.scale,tileHeight:c.size[1]*f.scale,pawnOffsetX:0,pawnOffsetY:0,scale:f.scale};};
  R.coordinates=()=>anchors.map(([x,y])=>[x/W,y/H]);
  R.routeGeometry=(b,w,h,c,to=c.exits[0])=>{const f=fit(w,h),points=(Math.abs(c.from-to)===1?(to>c.from?legs[c.from]:[...legs[to]].reverse()):[anchors[c.from],anchors[to]]).map(p=>screen(p,f));return{points,d:'M '+points.map(p=>p.join(' ')).join(' L '),from:points[0],to:points.at(-1),layout:R.layout(b,w,h),clear:true};};
  // Underground and vertical passages are not drawn as a surface shortcut.
  R.mainPath=(b,w,h,stop=anchors.length-1)=>Array.from({length:stop},(_,i)=>find(i,i+1)?'':R.routeGeometry(b,w,h,{from:i,exits:[i+1]}).d).join(' ');
  R.artwork=()=>'';R.portPosition=(b,w,h,c)=>R.layout(b,w,h).points[c.from];
  globalThis.PraatpadWorld={anchors,legs,fit,connections:passages.filter(p=>p.optional).map(p=>({id:p.id,type:p.boat?'ferry':'tunnel',from:p.from,exits:[p.to],optional:true,label:p.label})),passages,pose,depthAt,step:(a,b,t,w,h)=>{const q=pose(a,b,t);return{...q,point:screen(q.point,fit(w,h)),boat:null};},pawnDepth(point,w,h){const f=fit(w,h);return depthAt([(point[0]-f.x)/f.scale,(point[1]-f.y)/f.scale]);},duration:from=>find(from,from+1)?5200:650};
  globalThis.PraatpadCity={fit,anchors,angles:Array(anchors.length).fill(0)};
  installPawn();
 };
 m.connectRuntime=host=>{
  const {$,root,drawMap,reduced}=host;
  function draw(){
   const f=fit($('pp-map').clientWidth,$('pp-map').clientHeight);
   const boat=root.querySelector('[data-dutch-boat]');if(boat){const q=host.anim?.boatPose;boat.setAttribute('visibility',q?.boat?'visible':'hidden');if(q?.boat){boat.setAttribute('transform',`translate(${q.point}) scale(${q.scale})`);boat.style.opacity=q.opacity;}}
   for(const p of passages){let el=$('pp-ports').querySelector('[data-new-passage="'+p.id+'"]');if(!el){el=document.createElement('button');el.type='button';el.className='pp-port new-passage-label';el.dataset.newPassage=p.id;el.textContent=(p.kind==='ferry'?'Pont':p.boat?'Boot':'T'+(passages.filter(x=>x.kind==='tunnel').indexOf(p)+1))+' · '+p.from+'–'+p.to;el.setAttribute('aria-label',p.label+' · bekijk uitleg');el.onclick=()=>host.showMapRules();$('pp-ports').append(el);}const pos=p.labelPos||(p.kind==='lift'?[1270,370]:c.id==='station-perronroute'?[970,500]:[492,170]),point=screen(pos,f);el.style.left=point[0]+'px';el.style.top=point[1]+'px';el.disabled=!!host.anim;}
   root.dataset.tunnelPhase=host.anim?.tunnelPhase||'';root.dataset.liftPhase=host.anim?.liftPhase||'';const lift=passages.find(p=>p.kind==='lift'||p.kind==='cable');if(lift){const point=host.anim?.liftPoint||(host.current().pos>=lift.to?lift.top:lift.bottom);root.querySelectorAll('[data-lift-car]').forEach(el=>el.setAttribute('transform',`translate(${point})`));}}
  function segment(from,to,token){
   if(reduced()){host.anim.pos=to;drawMap();return Promise.resolve();}
   root.classList.add('pp-stepping');const passage=find(from,to),duration=passage?(passage.duration||5200):650;
   return new Promise(resolve=>{let start=null,raf=0,ended=false;
    const done=()=>{if(ended)return;ended=true;cancelAnimationFrame(raf);host.transportCancel=null;if(host.anim)for(const k of ['stepPoint','cityTunnelOpacity','tunnelScale','tunnelPhase','liftPhase','liftPoint','newDepth','boatPose'])delete host.anim[k];root.classList.remove('pp-stepping');root.dataset.journey='';root.dataset.tunnelPhase='';root.dataset.liftPhase='';$('pp-transit-label').hidden=true;resolve();};
    host.transportCancel=done;
    const frame=now=>{if(token!==host.run||!host.anim){done();return;}start??=now;const t=clamp((now-start)/duration),q=pose(from,to,t),f=fit($('pp-map').clientWidth,$('pp-map').clientHeight);
     Object.assign(host.anim,{stepPoint:screen(q.point,f),cityTunnelOpacity:q.opacity,tunnelScale:q.scale,newDepth:q.depth,boatPose:q});
     if(q.kind==='tunnel')host.anim.tunnelPhase=q.phase;
     if(q.kind==='lift'||q.kind==='cable'){host.anim.liftPhase=q.phase;host.anim.liftPoint=q.liftPoint;}
     root.dataset.journey=q.kind;
     if(passage){$('pp-transit-label').hidden=false;$('pp-transit-label').textContent=passage.label+' · '+(q.phase==='hidden'?(passage.hiddenLabel||'Onder de grond'):q.kind==='cable'?'Met de kabelbaan naar vak '+to:q.kind==='lift'?'Met de lift naar vak '+to:q.kind==='ferry'?'Met het pontje naar vak '+to:'Op weg naar vak '+to);}
     drawMap();if(t===1){host.anim.pos=to;done();drawMap();}else raf=requestAnimationFrame(frame);
    };raf=requestAnimationFrame(frame);
   });
  }
  return{draw,adjustPawn(){},rule:c=>c.label||'',pawnDepth(el,current,base){return current&&host.anim?.newDepth!==undefined?host.anim.newDepth:base;},animateStep:segment,async animate(record,token){host.anim.pos=record.from;if(find(record.from,record.to)){await segment(record.from,record.to,token);return;}const direction=Math.sign(record.to-record.from);for(let from=record.from;from!==record.to&&token===host.run&&host.anim;from+=direction)await segment(from,from+direction,token);}};
 };
}
function installPawn(){
PraatpadCity.pawn=(number='')=>`<svg viewBox="0 0 48 68" aria-hidden="true" focusable="false"><ellipse cx="24" cy="63" rx="21" ry="4" fill="#102e3a" opacity=".22"/><path d="M17 25C9 21 10 7 18 4C30-1 40 13 32 23L30 25C29 29 30 35 34 42L41 53C44 57 42 62 37 63H11C6 62 4 57 7 53L14 42C18 35 19 29 17 25Z" fill="currentColor" stroke="#fffdf4" stroke-width="3" stroke-linejoin="round"/><path d="M29 5C38 12 34 21 29 24C26 30 29 38 33 45L39 55C41 58 39 60 36 60H29C33 55 26 44 24 35C22 29 23 25 26 21C30 16 31 10 29 5Z" fill="#102e3a" opacity=".2"/><path d="M16 14C16 10 19 7 23 7" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/><path d="M10 54C19 57 30 57 39 54" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/><text x="24" y="48" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700">${number}</text></svg>`;
PraatpadCity.terminal=end=>`<span class="city-terminal-name">${end?'FINISH':'START'}</span><span class="city-terminal-sign" aria-hidden="true">${end?'<svg viewBox="0 0 40 32"><path d="M7 29V3" stroke="#163d4c" stroke-width="3"/><path d="M8 3H34V21H8Z" fill="#fff" stroke="#163d4c" stroke-width="2"/><path d="M8 3h7v6H8zm13 0h7v6h-7zm-6 6h6v6h-6zm13 0h6v6h-6zm-20 6h7v6H8zm13 0h7v6h-7z" fill="#163d4c"/></svg>':'<svg viewBox="0 0 40 32"><path d="M6 16H32M23 6L33 16L23 26" fill="none" stroke="#167562" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'}</span>`;}
return{create};
})();
