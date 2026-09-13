/* The existing controls and die move as nodes; their state and handlers remain shared. */
(()=>{
 function init(){
  const root=document.getElementById('praatpad-board'),game=document.getElementById('pp-game');
  const layout=game.querySelector('.pp-play-layout'),panel=game.querySelector('.pp-play-controls');
  const roll=document.getElementById('pp-roll'),rollHome=roll.parentElement,rollNext=roll.nextSibling;
  const dock=document.createElement('div');dock.className='db-dice-dock';
  const toggle=document.createElement('button');toggle.type='button';toggle.id='db-controls-toggle';toggle.className='pp-secondary';
  panel.id='db-play-controls';panel.setAttribute('aria-label','Lesbediening');
  toggle.innerHTML='<i data-lucide="sliders-horizontal" aria-hidden="true"></i><span>Bediening</span>';
  toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',panel.id);
  toggle.title='Niveau, oefening, namen en kaartopties';
  dock.append(toggle);layout.append(dock);
  const panelHead=document.createElement('div');panelHead.className='db-controls-heading';
  panelHead.innerHTML='<strong>Bediening</strong><button type="button" class="pp-icon-button" aria-label="Bediening sluiten"><i data-lucide="x" aria-hidden="true"></i></button>';
  const lessonBar=document.getElementById('db-lesson-bar'),mapTools=document.getElementById('db-map-tools');
  panel.prepend(panelHead,lessonBar,mapTools);
  const task=document.getElementById('pp-task'),support=task.querySelector('.db-task-support');
  const cue=document.createElement('span');cue.className='db-turn-cue';task.querySelector('.pp-task-heading').append(cue);
  const name=document.getElementById('pp-current-name'),speaker=document.getElementById('pp-speaker');
  function updateCue(){const text=speaker.textContent.startsWith('Hardop:')?speaker.textContent:name.textContent;if(cue.textContent!==text)cue.textContent=text;}
  const cueObserver=new MutationObserver(updateCue);for(const e of [name,speaker])cueObserver.observe(e,{childList:true,subtree:true,characterData:true});updateCue();
  let active=false;
  function syncSupport(){const target=active&&game.dataset.large!=='true'?panel:task;if(support.parentElement!==target){if(target===panel)panel.insertBefore(support,mapTools.nextSibling);else task.append(support);}}
  new MutationObserver(syncSupport).observe(game,{attributes:true,attributeFilter:['data-large']});
  function close(restore=false){root.dataset.controlsOpen='false';if(toggle.getAttribute('aria-expanded')!=='false')toggle.setAttribute('aria-expanded','false');panel.inert=active;if(restore&&active)toggle.focus({preventScroll:true});}
  function open(){
   document.querySelector('.tr-controls')?.removeAttribute('open');
   if(document.getElementById('tr-app-trigger')?.getAttribute('aria-expanded')==='true')document.getElementById('tr-app-trigger').click();
   root.dataset.controlsOpen='true';panel.inert=false;toggle.setAttribute('aria-expanded','true');panel.scrollTop=0;
  }
  toggle.onclick=()=>root.dataset.controlsOpen==='true'?close():open();
  toggle.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();open();panelHead.querySelector('button').focus();}};
  panelHead.querySelector('button').onclick=()=>close(true);
  document.addEventListener('pointerdown',e=>{if(active&&!panel.contains(e.target)&&!toggle.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.dataset.controlsOpen==='true'){e.preventDefault();e.stopPropagation();close(true);}},{capture:true});
  document.addEventListener('focusin',e=>{if(active&&root.dataset.controlsOpen==='true'&&!panel.contains(e.target)&&!toggle.contains(e.target))close();});
  // Existing dialogs/settings take precedence over this nonmodal drawer.
  new MutationObserver(()=>{if(document.querySelector('dialog[open],#tr-app-trigger[aria-expanded="true"],.tr-controls[open]')||game.hidden)close();}).observe(root,{subtree:true,attributes:true,attributeFilter:['open','hidden','aria-expanded']});
  const wide=matchMedia('(min-width:600px)');
  function sync(){
   const next=wide.matches&&root.dataset.dbForm==='numbers';
   if(next===active)return;active=next;root.dataset.cardView=String(active);root.dataset.mapFocus=String(active);
   if(active)dock.prepend(roll);else rollHome.insertBefore(roll,rollNext);
   dock.hidden=!active;syncSupport();close();
  }
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-db-form']});wide.addEventListener('change',sync);sync();
  window.addEventListener('pageshow',()=>close());
  globalThis.lucide?.createIcons({attrs:{width:20,height:20,'stroke-width':1.8}});
 }
 if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
