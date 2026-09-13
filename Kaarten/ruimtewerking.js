/* Shared spatial contracts. Coordinates use the 1672 × 941 painted scene.
   Tunnel art, walking paths and labels all read the same placement record. */
globalThis.DigiBoardSpatial=(()=>{
 'use strict';
 const maps={
  'amsterdam-grachtenroute':{prefix:'amsterdam',size:96,entry:[670,110],exit:[1046,124],front:[.54,.94],deep:[.555,.60]},
  'utrecht-werfroute':{prefix:'utrecht',size:96,entry:[661,719],exit:[653,398],front:[.54,.94],deep:[.555,.60]},
  'dorp-boomgaardroute':{prefix:'dorp',size:110,entry:[983,374],exit:[1420,603],entryPath:[[929,419],[962,495],[1038,495]],deep:[.5,.60]},
  'kust-duinroute':{prefix:'kust',size:100,entry:[1279,480],exit:[1147,316],signs:[[1210,526],[1320,373]],deep:[.5,.60]},
  'bos-bosroute':{prefix:'bos',size:112,entry:[508,369],exit:[741,503],entryPath:[[642,522],[564,506]],exitPath:[[797,632]],deep:[.5,.60]},
  'polder-slotenroute':{prefix:'polder',size:110,entry:[1180,536],exit:[1490,534],exitPath:[[1545,650],[1424,650]],deep:[.5,.60]},
  'haven-kaderoute':{prefix:'haven',size:122,entry:[505,555],exit:[1190,587],entryPath:[[487,694],[566,691]],exitPath:[[1323,727],[1370,620]],deep:[.5,.60]},
  'heuvels-panorama':{prefix:'heuvel',size:100,entry:[998,268],exit:[1198,222],signWidth:88,signs:[[1048,251],[1143,227]],deep:[.525,.61]},
  'fantasie-eilanden':{prefix:'fantasie',size:105,entry:[1441,228],exit:[1334,431],exitPath:[[1390,569],[1450,581]],deep:[.53,.66]},
  'ruimte-maanroute':{prefix:'ruimte',size:104,entry:[462,305],exit:[576,196],front:[.62,.91],deep:[.5,.66],entryPath:[[579,462],[532,450],[526.48,423]],exitPath:[[652,316]]}
 };
 const objects={
  'fantasie-eilanden':[{selector:'#fantasie-paddenstoel-front image',rect:[252,476,128,141]}],
  'polder-slotenroute':[{selector:'#polder-boom-front image',rect:[232,401,160,180]}],
  'heuvels-panorama':[{selector:'image[href$="15300d0ecbb493a9.png"]',rect:[518,539,118,118]}],
  'haven-kaderoute':[{selector:'image[href$="cbe9f0661d0dfb55.png"]',rect:[1467,310,120,120]}]
 };
 const lerp=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k),clamp=x=>Math.max(0,Math.min(1,x));
 const at=(c,site,uv)=>uv.map((v,i)=>c[site][i]+v*c.size);
 function geometry(id){const c=maps[id];if(!c)return null;return{...c,frontA:at(c,'entry',c.front||[.5,.94]),deepA:at(c,'entry',c.deep),frontB:at(c,'exit',c.front||[.5,.94]),deepB:at(c,'exit',c.deep)};}
 function paths(id,from,to){const c=geometry(id),a=PraatpadWorld.anchors;return{entry:[a[from],...(c.entryPath||[]),c.frontA],exit:[c.frontB,...(c.exitPath||[]),a[to]]};}
 function pose(id,t,from,to){
  const c=geometry(id),routes=paths(id,from,to);t=clamp(t);
  if(t<.16)return{point:PraatpadRoutes.along(routes.entry,t/.16),scale:1,opacity:1,phase:'approach'};
  if(t<.38){const k=(t-.16)/.22;return{point:lerp(c.frontA,c.deepA,k),scale:1-.68*k,opacity:1-clamp((k-.72)/.28),phase:'enter'};}
  if(t<.62)return{point:c.deepA,scale:.32,opacity:0,phase:'hidden',progress:(t-.38)/.24};
  if(t<.84){const k=(t-.62)/.22;return{point:lerp(c.deepB,c.frontB,k),scale:.32+.68*k,opacity:clamp(k/.28),phase:'exit'};}
  return{point:PraatpadRoutes.along(routes.exit,(t-.84)/.16),scale:1,opacity:1,phase:'arrive'};
 }
 function trace(id){const c=geometry(id);return[c.deepA,lerp(c.deepA,c.deepB,.33),lerp(c.deepA,c.deepB,.66),c.deepB];}
 const set=(el,attrs)=>{if(el)for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));};
 let mapEl,obstacles=[],cache=null;
 function prepare(m,map){
  mapEl=map;obstacles=[];cache=null;const c=geometry(m.id);
  if(c){
   // Prefixes from the older standalone assets are kept for existing animation hooks.
   const back=map.querySelector('[id$="-tunnel-back"]'),front=map.querySelector('[id$="-tunnel-front"]'),signs=map.querySelector('[id$="-tunnel-signs"]');
   [c.entry,c.exit].forEach((p,i)=>{
    const attrs={x:p[0],y:p[1],width:c.size,height:c.size};
    set(back?.querySelectorAll(':scope > use')[i],attrs);set(front?.querySelectorAll(':scope > svg')[i],attrs);
    const center=c.signs?.[i]||[p[0]+c.size/2,p[1]-20],signWidth=c.signWidth||110;
    set(signs?.querySelectorAll('rect')[i],{x:center[0]-signWidth/2,y:center[1]-12,width:signWidth,height:24});set(signs?.querySelectorAll('text')[i],{x:center[0],y:center[1]+5,'font-size':14});
    obstacles.push([p[0],p[1],c.size,c.size]);
   });
   // Artwork is prepared before install(); the route is attached lazily by layoutLabels().
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='db-tunnel-paths';svg.setAttribute('viewBox','0 0 1672 941');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4';map.append(svg);
   const tracePath=map.querySelector('[id$="-underground"] path');set(tracePath,{d:'M '+trace(m.id).map(p=>p.join(' ')).join(' L ')});
  }
  for(const o of objects[m.id]||[]){const [x,y,width,height]=o.rect;set(map.querySelector(o.selector),{x,y,width,height});obstacles.push(o.rect);}
  if(m.id==='fantasie-eilanden'){
   const sites=[[247,231],[1307,158]];
   map.querySelectorAll('.fantasie-portal-layer > svg').forEach((el,i)=>set(el,{x:sites[i%2][0],y:sites[i%2][1],width:120,height:120}));
   map.querySelectorAll('.fantasie-portal-aura').forEach((el,i)=>set(el,{cx:sites[i][0]+60,cy:sites[i][1]+61,rx:26,ry:40}));
   for(const [i,text]of [...map.querySelectorAll('.fantasie-portal-layer text')].entries()){
    const p=sites[i];set(text,{x:p[0]+60,y:p[1]-7});set(text.previousElementSibling,{x:p[0]+8,y:p[1]-24,width:104});
   }
   obstacles.push(...sites.map(p=>[...p,120,120]));m.positions.kristalgrot=[1270,588];
  }
  if(m.id==='ruimte-maanroute'){set(map.querySelector('#ruimte-relay-front > g'),{transform:'translate(522 575)'});obstacles.push([503,500,40,82],[264,594,72,41],[835,174,72,41],[1328,545,72,41]);}
 }
 function overlaps(a,b,pad=7){return a[0]<b[0]+b[2]+pad&&a[0]+a[2]+pad>b[0]&&a[1]<b[1]+b[3]+pad&&a[1]+a[3]+pad>b[1];}
 function layoutLabels(w,h){
  if(!mapEl||!globalThis.PraatpadWorld)return;
  const id=DigiBoardMap.id,f=PraatpadWorld.fit(w,h),c=geometry(id),ports=[...mapEl.querySelectorAll('.pp-port')];
  const key=[id,w,h,document.getElementById('praatpad-board').dataset.routeHelp,...ports.map(e=>e.textContent+'|'+e.offsetWidth)].join('/');
  if(cache?.key===key){for(const [el,x,y]of cache.ports){el.style.left=x+'px';el.style.top=y+'px';}return;}
  const tunnel=PraatpadWorld.connections?.find(x=>x.type==='tunnel');
  if(c&&tunnel){const route=paths(id,tunnel.from,tunnel.exits[0]),access=[route.entry,route.exit];if(id==='fantasie-eilanden')access.push([PraatpadWorld.anchors[8],[307,341.4]],[PraatpadWorld.anchors[26],[1367,268.4]]);mapEl.querySelector('#db-tunnel-paths').innerHTML=access.map(points=>`<path d="M ${points.map(p=>p.join(' ')).join(' L ')}" fill="none" stroke="${id==='ruimte-maanroute'?'#9ea5a8':'#bfab83'}" stroke-width="5" stroke-opacity=".7" stroke-linecap="round" stroke-linejoin="round"/><path d="M ${points.map(p=>p.join(' ')).join(' L ')}" fill="none" stroke="#f5ecd7" stroke-opacity=".65" stroke-width="1.5" stroke-dasharray="2 5"/>`).join('');}
  const screen=r=>[r[0]*f.scale+f.x,r[1]*f.scale+f.y,r[2]*f.scale,r[3]*f.scale];
  const blocked=obstacles.map(screen);for(const p of [PraatpadWorld.anchors[0],PraatpadWorld.anchors.at(-1)])blocked.push(screen([p[0]-78,p[1]-50,156,100]));
  // Reserve the full walking corridor, including between the tile centres.
  for(const leg of PraatpadWorld.legs||[]){let length=0;for(let i=1;i<leg.length;i++)length+=Math.hypot(leg[i][0]-leg[i-1][0],leg[i][1]-leg[i-1][1]);for(let i=0;i<=Math.ceil(length/14);i++){const p=PraatpadRoutes.along(leg,i/Math.max(1,Math.ceil(length/14)));blocked.push(screen([p[0]-31,p[1]-25,62,50]));}}
  // The pawn also needs clear headroom on the access paths, not only on numbered tiles.
  if(c&&tunnel)for(const leg of Object.values(paths(id,tunnel.from,tunnel.exits[0]))){
   let length=0;for(let i=1;i<leg.length;i++)length+=Math.hypot(leg[i][0]-leg[i-1][0],leg[i][1]-leg[i-1][1]);
   const steps=Math.max(1,Math.ceil(length/14));for(let i=0;i<=steps;i++){const p=PraatpadRoutes.along(leg,i/steps);blocked.push(screen([p[0]-31,p[1]-68,62,78]));}
  }
  // Labels and controls form a top layer; their reserved rectangles stay clear of scenery and the route.
  const origin=mapEl.getBoundingClientRect();
  // Number badges have a fixed screen size, even on the smallest maps.
  for(const number of mapEl.querySelectorAll('.pp-number'))if(getComputedStyle(number).visibility==='visible'){
   const r=number.getBoundingClientRect();blocked.push([r.x-origin.x,r.y-origin.y,r.width,r.height]);
  }
  const worldLabels=[...mapEl.querySelectorAll('svg text')].filter(t=>t.previousElementSibling?.tagName.toLowerCase()==='rect');
  for(const text of worldLabels){let g=text.parentElement;if(!g.classList.contains('db-world-label')){const wrap=document.createElementNS('http://www.w3.org/2000/svg','g');wrap.classList.add('db-world-label');g.insertBefore(wrap,text.previousElementSibling);wrap.append(text.previousElementSibling,text);g=wrap;}g.removeAttribute('transform');}
  const choose=(preferred,width,height)=>{
   const candidates=[preferred];for(let r=18;r<=420;r+=18)for(let i=0;i<24;i++){const angle=2*Math.PI*i/24;candidates.push([preferred[0]+Math.cos(angle)*r,preferred[1]+Math.sin(angle)*r]);}
   for(const p of candidates){const b=[p[0]-width/2,p[1]-height/2,width,height];if(b[0]<f.x+6||b[1]<f.y+6||b[0]+width>w-f.x-6||b[1]+height>h-f.y-6)continue;if(!blocked.some(r=>overlaps(b,r,5))){blocked.push(b);return p;}}
   return preferred;
  };
  for(const text of worldLabels){const g=text.parentElement,r=g.getBoundingClientRect(),preferred=[r.x-origin.x+r.width/2,r.y-origin.y+r.height/2],p=choose(preferred,r.width,r.height);g.setAttribute('transform',`translate(${(p[0]-preferred[0])/f.scale} ${(p[1]-preferred[1])/f.scale})`);}
  const placed=[];for(const el of ports){const preferred=[parseFloat(el.style.left),parseFloat(el.style.top)];if(!preferred.every(Number.isFinite))continue;const p=choose(preferred,el.offsetWidth,el.offsetHeight);el.style.left=p[0]+'px';el.style.top=p[1]+'px';placed.push([el,...p]);}
  cache={key,ports:placed};
 }
 function pawnDepth(point,w,h,base,travelling,tunnelPhase='',tunnelScale=1){
  // A full-size pawn is still on the apron, not yet inside the opening.
  // Change layers only after it fits in the mouth; reverse the same crossing on exit.
  if(travelling&&maps[globalThis.DigiBoardMap?.id]&&tunnelPhase){
   if(tunnelPhase==='approach'||tunnelPhase==='arrive')return 11;
   if((tunnelPhase==='enter'||tunnelPhase==='exit')&&tunnelScale>.66)return 11;
  }
  if(travelling||!globalThis.PraatpadWorld||!globalThis.DigiBoardMap)return base;
  const f=PraatpadWorld.fit(w,h),x=(point[0]-f.x)/f.scale,y=(point[1]-f.y)/f.scale,c=geometry(DigiBoardMap.id);
  const foreground=[...(objects[DigiBoardMap.id]||[]).map(o=>o.rect),...(c?[c.entry,c.exit].map(p=>[...p,c.size,c.size]):[])];
  return foreground.some(r=>x>r[0]-22&&x<r[0]+r[2]+22&&y>r[1]+r[3]&&y<r[1]+r[3]+75)?11:base;
 }
 return{maps,geometry,paths,pose,trace,prepare,layoutLabels,pawnDepth,obstacles:()=>obstacles.map(x=>[...x])};
})();
