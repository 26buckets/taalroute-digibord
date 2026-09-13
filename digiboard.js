/* One entry point, shared preferences and separate resumable map lessons. */
globalThis.DigiBoard=(()=>{
 'use strict';
 const SHARED='taalroute-digiboard-shared-v1',ACTIVE='taalroute-digiboard-map';
 const copy=v=>JSON.parse(JSON.stringify(v)),read=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
 const wanted=new URLSearchParams(location.search).get('kaart')||read(ACTIVE)||'Rotterdam-havenroute';
 const mapId=DigiBoardMaps.some(m=>m.id===wanted)?wanted:'Rotterdam-havenroute';let host;
 function storageKey(){return mapId==='buurt'?'taalroute-praatpad-les-v2':'taalroute-digiboard-les-'+mapId+'-v1';}
 function loadMap(){if(mapId!=='buurt')document.write('<script src="Kaarten/'+mapId+'.js"><\/script>');}
 function prepare(){
  const m=globalThis.DigiBoardMap;if(!m)return;
  document.getElementById('pp-content').textContent=JSON.stringify(m.content);
  const scene=document.getElementById('pp-scenery');scene.src=m.image;
  const map=document.getElementById('pp-map');map.setAttribute('aria-label','Speelroute · '+m.label);map.insertAdjacentHTML('beforeend',m.extras);DigiBoardSpatial.prepare(m,map);
  const style=document.createElement('link');style.rel='stylesheet';style.href='Kaarten/'+mapId+'.css';document.head.append(style);
  map.querySelectorAll('svg > image:not([href]),svg image[clip-path]:not([href])').forEach(i=>i.setAttribute('href',scene.src));
  for(const el of map.children)if(el.tagName.toLowerCase()==='svg'&&!['pp-path','pp-connections'].includes(el.id))el.classList.add('db-map-layer');
  document.getElementById('praatpad-board').dataset.city='true';
 }
 function saveShared(d){try{localStorage.setItem(SHARED,JSON.stringify({version:1,settings:d.settings,roster:d.roster,groups:d.groups,wordspel:d.wordspel,matrixProgress:d.matrixProgress,sentenceGame:d.sentenceGame,pictureDice:d.session.pictureDice,groupId:d.session.groupId,groupName:d.session.groupName,mode:d.session.mode,people:d.session.people,players:d.session.players}));localStorage.setItem(ACTIVE,JSON.stringify(mapId));}catch{/* The core reports storage failures. */}}
 function restoreShared(d,validate,normalize,loaded){
  const common=read(SHARED);if(!common||common.version!==1)return d;
  try{
   const candidate=copy(d);candidate.settings={...candidate.settings,...common.settings};
   if(!common.settings?.diceAudioRestored){candidate.settings.sound=true;candidate.settings.diceAudioRestored=true;}
   const roster=new Map(candidate.roster.map(p=>[p.id,p]));for(const p of common.roster||[])roster.set(p.id,p);candidate.roster=[...roster.values()];
   candidate.groups=common.groups||candidate.groups;
   if(common.pictureDice)candidate.session.pictureDice=copy(common.pictureDice);
   if(common.wordspel)candidate.wordspel=copy(common.wordspel);
   if(DigiBoardMatrix.validProgress(common.matrixProgress))candidate.matrixProgress=copy(common.matrixProgress||{version:1,groups:{}});
   if(common.sentenceGame)candidate.sentenceGame=copy(common.sentenceGame);
   if(!loaded&&common.people?.length&&common.players?.length){candidate.session.groupId=common.groupId??null;candidate.session.groupName=common.groupName||'';candidate.session.mode=common.mode;candidate.session.people=copy(common.people);candidate.session.players=common.players.map(p=>({...copy(p),pos:0,turns:0}));}
   return validate(candidate)?normalize(candidate):d;
  }catch{return d;}
 }
 function changeMap(id){if(!DigiBoardMaps.some(m=>m.id===id))return;const url=new URL(location.href);url.searchParams.set('kaart',id);location.assign(url);}
 function connect(h){host=h;const picker=document.createElement('button');picker.id='db-open-maps';picker.type='button';picker.textContent='Wissel kaart';picker.onclick=()=>{if(!h.busy())h.openMapPicker();};document.getElementById('db-map-tools').append(picker);const select=document.getElementById('db-map');select.replaceChildren(...DigiBoardMaps.map(m=>{const o=document.createElement('option');o.value=m.id;o.textContent=m.label+' · '+m.count+' vakken';return o;}));select.value=mapId;select.onchange=()=>{if(h.busy()){select.value=mapId;return;}h.read().settings.diceStyle='numbers';h.chooseMap(select.value);};
  if(globalThis.DigiBoardMap){const b=document.createElement('button');b.id='world-route-help';b.type='button';b.textContent='Vaknummers';b.setAttribute('aria-pressed','false');b.onclick=()=>{const r=document.getElementById('praatpad-board'),on=r.dataset.routeHelp!=='true';r.dataset.routeHelp=String(on);b.setAttribute('aria-pressed',String(on));};document.getElementById('db-map-tools').append(b);}
  const panel=document.getElementById('pp-panel-board'),wrap=document.createElement('div');wrap.className='db-board-select';const label=document.createElement('label');label.htmlFor='db-board-map';label.textContent='Kaart kiezen';const other=select.cloneNode(true);other.id='db-board-map';other.onchange=()=>{select.value=other.value;select.onchange();};wrap.append(label,other);panel.prepend(wrap);
  if(mapId==='Rotterdam-havenroute'||globalThis.DigiBoardMap?.special){const b=document.createElement('button');b.id='map-rules-button';b.type='button';b.textContent='Speciale plekken';b.onclick=()=>h.showMapRules();document.getElementById('db-map-tools').append(b);}
  if(globalThis.PraatpadVariations){const label=document.createElement('label');label.htmlFor='db-route';label.textContent='Routevorm';const routes=document.createElement('select');routes.id='db-route';routes.replaceChildren(...PraatpadVariations.catalog.map(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.label;return o;}));routes.value=PraatpadRoutes.config(h.read().session.board).shape;routes.onchange=()=>{if(h.busy())return;const d=h.read(),v=PraatpadVariations.catalog.find(v=>v.id===routes.value);d.session.board.layout={shape:v.id,mirror:false,connections:copy(v.connections)};d.session.travel={uses:[],keys:[],visits:[],pending:null,last:null};h.save();};wrap.append(label,routes);}

 }
 function sync(d){const form=d.settings.diceStyle||'numbers';const picker=document.getElementById('db-open-maps');if(picker)picker.disabled=!!host?.busy();const root=document.getElementById('praatpad-board');root.dataset.dbForm=d.settings.diceStyle||'numbers';document.getElementById('db-map-tools').hidden=form!=='numbers';for(const id of ['db-map','db-board-map']){const e=document.getElementById(id);if(e){e.value=mapId;e.disabled=!!host?.busy();}}const help=document.getElementById('world-route-help');if(help)help.hidden=form!=='numbers';const rules=document.getElementById('map-rules-button');if(rules){rules.hidden=form!=='numbers';rules.disabled=!!host?.busy();}const el=document.querySelector('.db-map-picker');if(el)el.hidden=form!=='numbers';}
 return {mapId,storageKey,loadMap,prepare,saveShared,restoreShared,changeMap,connect,sync};
})();
