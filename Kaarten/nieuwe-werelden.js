/* New maps share geometry for the painted scene, tiles, masks and moving pawn.
 * Existing map modules and their spatial overrides are deliberately independent. */
globalThis.DigiBoardNewWorld=(()=>{
'use strict';
const W=1672,H=941,clamp=t=>Math.max(0,Math.min(1,t)),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function create(c){
 const image=`Kaarten/assets/${c.id}/${c.image}.png`,prefix=c.id+'-',passages=c.passages||[],anchors=c.anchors;
 const fit=(w,h)=>{const scale=Math.min(w/W,h/H);return{scale,x:(w-W*scale)/2,y:(h-H*scale)/2};},screen=(p,f)=>[p[0]*f.scale+f.x,p[1]*f.scale+f.y];
 const find=(a,b)=>passages.find(p=>p.from===Math.min(a,b)&&p.to===Math.max(a,b));
 const legs=anchors.slice(0,-1).map((a,i)=>c.waypoints?.[i]||[a,anchors[i+1]]);
 function pose(from,to,t){
  const p=find(from,to),reverse=from>to;t=clamp(t);if(!p)return{point:PraatpadRoutes.along(legs[Math.min(from,to)],reverse?1-t:t),opacity:1,scale:1,phase:'walk',kind:'walk',depth:7};
  const k=reverse?1-t:t;
  if(p.kind==='lift'||p.kind==='cable'){
   const on=k>=.18&&k<=.82,point=k<.18?mix(anchors[p.from],p.bottom,k/.18):k>.82?mix(p.top,anchors[p.to],(k-.82)/.18):mix(p.bottom,p.top,(k-.18)/.64);
   const liftPoint=k<.18?p.bottom:k>.82?p.top:point;
   return{point,opacity:1,scale:p.kind==='cable'?(k<.18?1-.22*k/.18:k>.82?.78+.22*(k-.82)/.18:.78):1,phase:on?'riding':k<.18?'boarding':'leaving',kind:p.kind,depth:7,liftPoint};
  }
  const along=(path,k)=>PraatpadRoutes.along(path,clamp(k));
  let point,opacity=1,scale=1,phase;
  if(k<.20){point=along(p.enter.slice(0,2),k/.20);phase='approach';}
  else if(k<.38){const z=(k-.20)/.18;point=along(p.enter.slice(1),z);scale=1-z*.72;opacity=1-clamp((z-.65)/.35);phase='enter';}
  else if(k<=.62){point=mix(p.enter.at(-1),p.exit[0],(k-.38)/.24);opacity=0;scale=.28;phase='hidden';}
  else if(k<.80){const z=(k-.62)/.18;point=along(p.exit.slice(0,-1),z);scale=.28+z*.72;opacity=clamp(z/.35);phase='exit';}
  else{point=mix(p.exit.at(-2),p.exit.at(-1),(k-.80)/.20);phase='arrive';}
  if(reverse)phase=({approach:'arrive',arrive:'approach',enter:'exit',exit:'enter'})[phase]||phase;
  return{point,opacity,scale,phase,kind:'tunnel',depth:scale>.66?11:7};
 }
 const svg=(id,cls,body)=>`<svg id="${prefix+id}" class="new-world-layer ${cls}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${body}</svg>`;
 const palette={circle:['#e4bdb2','#985746'],square:['#aed3e8','#367aa4'],triangle:['#b6d6be','#3b7655'],diamond:['#dbccea','#785799']};
 const tile=(shape)=>shape==='circle'?'<ellipse rx=".47" ry=".44"/>':shape==='square'?'<rect x="-.44" y="-.42" width=".88" height=".84" rx=".08"/>':shape==='triangle'?'<path d="M0 -.50 L.51 .40 Q.54 .47 .45 .47 H-.45 Q-.54 .47 -.51 .40 Z"/>':'<path d="M0 -.53 L.52 0 L0 .53 L-.52 0 Z"/>';
 const fills=Object.entries(palette).map(([shape,colors])=>`<linearGradient id="${prefix}fill-${shape}" x2=".4" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".4" stop-color="#fff8e8"/><stop offset="1" stop-color="${colors[0]}"/></linearGradient>`).join('');
 let extras=svg('tiles','new-world-tiles',`<defs>${fills}<filter id="${prefix}shade" x="-25%" y="-25%" width="150%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#153044" flood-opacity=".35"/></filter></defs>`+anchors.slice(1,-1).map((a,i)=>{const shape=c.shapes[i],colors=palette[shape];return`<g transform="translate(${a})" style="filter:url(#${prefix}shade)"><g transform="scale(${c.size})" fill="url(#${prefix}fill-${shape})" stroke="${colors[1]}" stroke-width=".04" stroke-linejoin="round">${tile(shape)}</g></g>`;}).join(''));
 if(c.paintedRoute)extras='';
 extras+=svg('front','new-world-front',`<defs>${c.masks.map(m=>`<clipPath id="${prefix+m.id}"><path d="${m.path}"/></clipPath>`).join('')}</defs>`+c.masks.map(m=>`<image width="${W}" height="${H}" href="${image}" clip-path="url(#${prefix+m.id})"/>`).join(''));
 if(passages.some(p=>p.kind==='cable')){
  extras+=svg('cable-back','new-world-lift-back','<g data-lift-car><path d="M0 -65V-47 M-20 -47H20" stroke="#293e49" stroke-width="4" fill="none"/><path d="M-28 -45 Q0 -53 28 -45 L31 5 H-31Z" fill="#bb8c53" stroke="#473e32" stroke-width="3"/><path d="M-23 -40 H23 L26 -2 H-26Z" fill="#b4c6bf"/><path d="M-29 2 H29 V8 H-29Z" fill="#55493b"/></g>');
  extras+=svg('cable-front','new-world-front','<g data-lift-car><path d="M-28 -44 L-30 7 H30 L28 -44 M-28 -44 Q0 -51 28 -44 M-30 -9 H30" fill="none" stroke="#63452a" stroke-width="4"/><path d="M-29 -5 H29 V8 H-29Z" fill="#b68042" stroke="#63452a" stroke-width="2"/><path d="M-9 -44V-10 M9 -44V-10" stroke="#71583e" stroke-width="2"/></g>');
 }
 if(passages.some(p=>p.kind==='lift')){
  extras+=svg('lift-back','new-world-lift-back','<g data-lift-car><path d="M-25 -54 H25 V2 H-25Z" fill="#334d61" stroke="#d6e3e7" stroke-width="3"/><path d="M-20 -48 H20 V-5 H-20Z" fill="#bdcfdb"/><path d="M-30 0 L-22 -9 H25 L32 0 L23 9 H-25Z" fill="#c9d0cf" stroke="#344f60" stroke-width="3"/></g>');
  extras+=svg('lift-front','new-world-front','<g data-lift-car><path d="M-27 -52 V5 M27 -52 V5 M-27 -52 H27 M-27 -15 H27 M-27 3 H27" fill="none" stroke="#496274" stroke-width="4"/><path d="M-22 -12 V3 M-10 -12 V3 M3 -12 V3 M15 -12 V3" stroke="#9eb0bd" stroke-width="2"/><path d="M-30 4 H30 V10 H-30Z" fill="#6b7f8a"/></g>');
 }
 const m=globalThis.DigiBoardMap={id:c.id,label:c.label,content:c.content,image,extras,special:true,previews:c.previews,positions:{},newWorld:true,paintedRoute:!!c.paintedRoute};
 m.install=()=>{
  document.getElementById('praatpad-board').dataset.paintedRoute=String(!!c.paintedRoute);
  const R=PraatpadRoutes;
  R.layout=(b,w,h)=>{const f=fit(w,h);return{points:anchors.map(p=>screen(p,f)),tileWidth:c.size[0]*f.scale,tileHeight:c.size[1]*f.scale,pawnOffsetX:0,pawnOffsetY:0,scale:f.scale};};
  R.coordinates=()=>anchors.map(([x,y])=>[x/W,y/H]);
  R.routeGeometry=(b,w,h,c,to=c.exits[0])=>{const f=fit(w,h),points=(Math.abs(c.from-to)===1?(to>c.from?legs[c.from]:[...legs[to]].reverse()):[anchors[c.from],anchors[to]]).map(p=>screen(p,f));return{points,d:'M '+points.map(p=>p.join(' ')).join(' L '),from:points[0],to:points.at(-1),layout:R.layout(b,w,h),clear:true};};
  // Underground and vertical passages are not drawn as a surface shortcut.
  R.mainPath=(b,w,h,stop=anchors.length-1)=>Array.from({length:stop},(_,i)=>find(i,i+1)?'':R.routeGeometry(b,w,h,{from:i,exits:[i+1]}).d).join(' ');
  R.artwork=()=>'';R.portPosition=(b,w,h,c)=>R.layout(b,w,h).points[c.from];
  globalThis.PraatpadWorld={anchors,legs,fit,connections:[],passages,pose,step:(a,b,t,w,h)=>{const q=pose(a,b,t);return{...q,point:screen(q.point,fit(w,h)),boat:null};},pawnDepth(point,w,h){const f=fit(w,h),x=(point[0]-f.x)/f.scale,y=(point[1]-f.y)/f.scale;return c.masks.some(m=>x>=m.area[0]-25&&x<=m.area[2]+25&&y>=m.frontY&&y<=m.area[3]+70)?11:7;},duration:from=>find(from,from+1)?5200:650};
  globalThis.PraatpadCity={fit,anchors,angles:Array(anchors.length).fill(0)};
  installPawn();
 };
 m.connectRuntime=host=>{
  const {$,root,drawMap,reduced}=host;
  function draw(){
   const f=fit($('pp-map').clientWidth,$('pp-map').clientHeight);
   for(const p of passages){let el=$('pp-ports').querySelector('[data-new-passage="'+p.id+'"]');if(!el){el=document.createElement('button');el.type='button';el.className='pp-port new-passage-label';el.dataset.newPassage=p.id;el.textContent=(p.kind==='cable'?'Kabelbaan':p.kind==='lift'?'Lift':'T1')+' · '+p.from+'–'+p.to;el.setAttribute('aria-label',p.label+' · bekijk uitleg');el.onclick=()=>host.showMapRules();$('pp-ports').append(el);}const pos=p.labelPos||(p.kind==='lift'?[1270,370]:c.id==='station-perronroute'?[970,500]:[492,170]),point=screen(pos,f);el.style.left=point[0]+'px';el.style.top=point[1]+'px';el.disabled=!!host.anim;}
   root.dataset.tunnelPhase=host.anim?.tunnelPhase||'';root.dataset.liftPhase=host.anim?.liftPhase||'';const lift=passages.find(p=>p.kind==='lift'||p.kind==='cable');if(lift){const point=host.anim?.liftPoint||(host.current().pos>=lift.to?lift.top:lift.bottom);root.querySelectorAll('[data-lift-car]').forEach(el=>el.setAttribute('transform',`translate(${point})`));}}
  function segment(from,to,token){
   if(reduced()){host.anim.pos=to;drawMap();return Promise.resolve();}
   root.classList.add('pp-stepping');const passage=find(from,to),duration=passage?5200:650;
   return new Promise(resolve=>{let start=null,raf=0,ended=false;
    const done=()=>{if(ended)return;ended=true;cancelAnimationFrame(raf);host.transportCancel=null;if(host.anim)for(const k of ['stepPoint','cityTunnelOpacity','tunnelScale','tunnelPhase','liftPhase','liftPoint','newDepth'])delete host.anim[k];root.classList.remove('pp-stepping');root.dataset.journey='';root.dataset.tunnelPhase='';root.dataset.liftPhase='';$('pp-transit-label').hidden=true;resolve();};
    host.transportCancel=done;
    const frame=now=>{if(token!==host.run||!host.anim){done();return;}start??=now;const t=clamp((now-start)/duration),q=pose(from,to,t),f=fit($('pp-map').clientWidth,$('pp-map').clientHeight);
     Object.assign(host.anim,{stepPoint:screen(q.point,f),cityTunnelOpacity:q.opacity,tunnelScale:q.scale,newDepth:q.kind==='tunnel'?q.depth:undefined});
     if(q.kind==='tunnel')host.anim.tunnelPhase=q.phase;
     if(q.kind==='lift'||q.kind==='cable'){host.anim.liftPhase=q.phase;host.anim.liftPoint=q.liftPoint;}
     root.dataset.journey=q.kind;
     if(passage){$('pp-transit-label').hidden=false;$('pp-transit-label').textContent=passage.label+' · '+(q.phase==='hidden'?'Onder de grond':q.kind==='cable'?'Met de kabelbaan naar vak '+to:q.kind==='lift'?'Met de lift naar vak '+to:'Op weg naar vak '+to);}
     drawMap();if(t===1){host.anim.pos=to;done();drawMap();}else raf=requestAnimationFrame(frame);
    };raf=requestAnimationFrame(frame);
   });
  }
  return{draw,adjustPawn(){},rule:c=>c.label||'',pawnDepth(el,current,base){return current&&host.anim?.newDepth!==undefined?host.anim.newDepth:base;},animateStep:segment,async animate(record,token){host.anim.pos=record.from;const direction=Math.sign(record.to-record.from);for(let from=record.from;from!==record.to&&token===host.run&&host.anim;from+=direction)await segment(from,from+direction,token);}};
 };
}
function installPawn(){
PraatpadCity.pawn=(number='')=>`<svg viewBox="0 0 48 68" aria-hidden="true" focusable="false"><ellipse cx="24" cy="63" rx="21" ry="4" fill="#102e3a" opacity=".22"/><path d="M17 25C9 21 10 7 18 4C30-1 40 13 32 23L30 25C29 29 30 35 34 42L41 53C44 57 42 62 37 63H11C6 62 4 57 7 53L14 42C18 35 19 29 17 25Z" fill="currentColor" stroke="#fffdf4" stroke-width="3" stroke-linejoin="round"/><path d="M29 5C38 12 34 21 29 24C26 30 29 38 33 45L39 55C41 58 39 60 36 60H29C33 55 26 44 24 35C22 29 23 25 26 21C30 16 31 10 29 5Z" fill="#102e3a" opacity=".2"/><path d="M16 14C16 10 19 7 23 7" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/><path d="M10 54C19 57 30 57 39 54" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/><text x="24" y="48" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700">${number}</text></svg>`;
PraatpadCity.terminal=end=>`<span class="city-terminal-name">${end?'FINISH':'START'}</span><span class="city-terminal-sign" aria-hidden="true">${end?'<svg viewBox="0 0 40 32"><path d="M7 29V3" stroke="#163d4c" stroke-width="3"/><path d="M8 3H34V21H8Z" fill="#fff" stroke="#163d4c" stroke-width="2"/><path d="M8 3h7v6H8zm13 0h7v6h-7zm-6 6h6v6h-6zm13 0h6v6h-6zm-20 6h7v6H8zm13 0h7v6h-7z" fill="#163d4c"/></svg>':'<svg viewBox="0 0 40 32"><path d="M6 16H32M23 6L33 16L23 26" fill="none" stroke="#167562" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'}</span>`;}
return{create};
})();
