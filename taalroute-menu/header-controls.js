/* HDR 001. Official Lucide SVG paths, lucide-static 1.61.0 (ISC). */
(()=>{
  if(window.TaalrouteHeaderControls)return;
  const icons = {"maximize": "<svg aria-hidden=\"true\" focusable=\"false\" class=\"lucide lucide-maximize\" xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M8 3H5a2 2 0 0 0-2 2v3\" /> <path d=\"M21 8V5a2 2 0 0 0-2-2h-3\" /> <path d=\"M3 16v3a2 2 0 0 0 2 2h3\" /> <path d=\"M16 21h3a2 2 0 0 0 2-2v-3\" /> </svg>", "minimize": "<svg aria-hidden=\"true\" focusable=\"false\" class=\"lucide lucide-minimize\" xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M8 3v3a2 2 0 0 1-2 2H3\" /> <path d=\"M21 8h-3a2 2 0 0 1-2-2V3\" /> <path d=\"M3 16h3a2 2 0 0 1 2 2v3\" /> <path d=\"M16 21v-3a2 2 0 0 1 2-2h3\" /> </svg>", "menu": "<svg aria-hidden=\"true\" focusable=\"false\" class=\"lucide lucide-menu\" xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M4 5h16\" /> <path d=\"M4 12h16\" /> <path d=\"M4 19h16\" /> </svg>"};
  const studioLogo=document.currentScript?.src?new URL('studio.svg',document.currentScript.src).href:'/taalroute-menu/studio.svg';
  const mounted = new WeakSet();
  const layouts = new WeakMap();
  let dialogMenuTrigger;
  function sync(button) {
    const full=Boolean(document.fullscreenElement),supported=document.fullscreenEnabled!==false&&typeof document.documentElement.requestFullscreen==='function'&&typeof document.exitFullscreen==='function';
    button.disabled=!supported;button.title=supported?(full?'Normale weergave':'Volledig scherm'):'Volledig scherm niet beschikbaar';
    button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(full));
    const icon=full?'minimize':'maximize';if(button.dataset.icon!==icon){button.innerHTML=icons[icon];button.dataset.icon=icon;}
  }
  function labelActions(panel){for(const action of panel.querySelectorAll('button[aria-label]:not([data-appearance-choice])'))if(!action.textContent.trim()&&!action.hidden){const label=document.createElement('span');label.textContent=action.getAttribute('aria-label');action.append(label);}}
  function install(header, menu, {actions='',oldFullscreen='',manualUrl='https://studio.taalroute.nl/#/hulp',cardNavigation=[],materialsUrl='',materialsSelector='',centerNavigation=''}={}) {
    if(!header)return;
    if(oldFullscreen)for(const old of header.querySelectorAll(oldFullscreen)){old.hidden=true;old.setAttribute('data-hdr001-old-fullscreen','');}
    const links=header.querySelector('nav.taalroute-suite-links, #taalrouteAppMenu');if(!links)return;
    if(!links.querySelector('[data-app-id="studio"]')){
      const row=document.createElement('a');row.className='tr-suite-row';row.dataset.appId='studio';row.href='https://studio.taalroute.nl/';row.target='_blank';row.rel='noopener noreferrer';row.setAttribute('aria-label','Studio, Docentenomgeving');
      row.innerHTML='<img alt=""><span class="tr-suite-label"><span class="tr-suite-wordmark"><span>Studio</span><small>Docentenomgeving</small></span><small class="taalroute-beta" aria-hidden="true">BETA</small></span>';
      row.querySelector('img').src=studioLogo;links.prepend(row);
    }
    for(const image of links.querySelectorAll('img[alt=""]'))image.setAttribute('aria-hidden','true');
    if(mounted.has(header)&&header.querySelector('.hdr001-controls')){refresh(header);labelActions(header.querySelector('.hdr001-panel'));return;}
    const brandDetails=links.closest('details');
    const brandTrigger=brandDetails?.querySelector(':scope > summary')||header.querySelector('[popovertarget], .brand-trigger, .teacher-app-trigger');
    if(!brandTrigger)return;
    mounted.add(header);header.classList.add('hdr001-header');
    const shell=header.closest('header')||header;shell.classList.add('hdr001-shell');if(getComputedStyle(shell).position==='static')shell.style.position='relative';
    // Keep the existing logo trigger, app links and their handlers on the left.
    if(oldFullscreen)for(const old of header.querySelectorAll(oldFullscreen)){old.hidden=true;old.setAttribute('data-hdr001-old-fullscreen','');}
    let panel;
    if(menu?.matches('details')){panel=[...menu.children].find(e=>e.tagName!=='SUMMARY');menu.open=false;}
    else {const action=menu;menu=document.createElement('details');menu.innerHTML='<summary></summary><div></div>';header.append(menu);panel=menu.lastElementChild;if(action)panel.append(action);}
    if(!panel){panel=document.createElement('div');menu.append(panel);}
    menu.classList.add('hdr001-menu');menu.removeAttribute('name');panel.classList.add('hdr001-panel');
    const trigger=menu.querySelector(':scope > summary');trigger.classList.add('hdr001-menu-trigger');trigger.innerHTML=icons.menu;trigger.title='Menu';trigger.setAttribute('aria-label','Menu');
    // Move the original nodes, preserving app handlers, selected values and state.
    if(actions)for(const action of header.querySelectorAll(actions))if(action!==menu&&!action.contains(menu)&&!menu.contains(action))panel.append(action);
    const manual=[...panel.querySelectorAll('a')].find(a=>a.getAttribute('href')===manualUrl)||document.createElement('a');
    manual.href=manualUrl;manual.classList.add('hdr001-manual');manual.textContent='Docentenhandleiding';panel.prepend(manual);
    labelActions(panel);
    for(const old of panel.querySelectorAll('[data-theme-toggle]'))old.hidden=true;
    window.TaalrouteMenu?.mount(panel,manual);
    const row=document.createElement('div');row.className='hdr001-controls';menu.before(row);
    const screen=document.createElement('button');screen.type='button';screen.className='hdr001-fullscreen';
    const status=document.createElement('span');status.className='hdr001-status';status.setAttribute('role','status');row.append(screen,menu,status);sync(screen);
    screen.addEventListener('click',async()=>{status.textContent='';try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{status.textContent='Volledig scherm kon niet worden geopend of gesloten.';}sync(screen);});
    const close=()=>{menu.open=false;trigger.setAttribute('aria-expanded','false');};
    menu.addEventListener('toggle',()=>trigger.setAttribute('aria-expanded',String(menu.open)));
    trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();menu.open=true;panel.querySelector('a,button:not([hidden]):not(:disabled),input:not(:disabled),select:not(:disabled)')?.focus();}});
    // Capture before existing lesson shortcuts; Escape closes the menu, never the lesson.
    menu.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){event.preventDefault();event.stopPropagation();close();trigger.focus();}},true);
    menu.addEventListener('click',event=>{if(event.target.closest('a'))close();if(event.target.closest('button'))setTimeout(()=>{if(document.querySelector('dialog[open]'))dialogMenuTrigger=trigger;},0);});
    menu.addEventListener('keydown',event=>{if(event.key==='Tab')requestAnimationFrame(()=>{if(!menu.contains(document.activeElement))close();});});
    trigger.setAttribute('aria-expanded','false');
    layouts.set(header,{cardNavigation,materialsUrl,materialsSelector,center:header.querySelector(centerNavigation||':not(*)')});refresh(header);
  }
  const compact=matchMedia('(max-width:760px)'),narrow=matchMedia('(max-width:379px)');
  const lineIcon=paths=>'<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+paths+'</svg>';
  function refresh(header){
    const options=layouts.get(header);if(!options)return;
    const row=header.querySelector('.hdr001-controls'),panel=header.querySelector('.hdr001-panel'),menu=header.querySelector('.hdr001-menu');
    if(!row||!panel)return;
    const help=header.querySelector('.hdr001-manual');
    if(!help.classList.contains('hdr002-help')){help.classList.add('hdr002-action','hdr002-help');help.title='Docentenhulp';help.setAttribute('aria-label','Docentenhulp');help.innerHTML=lineIcon('<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 3h.01"/>')+'<span>Docentenhulp</span>';}
    let material=header.querySelector('.hdr002-materials');
    if(!material&&options.materialsUrl){material=document.createElement('a');material.className='hdr002-materials';material.href=options.materialsUrl;material.title='Lesmateriaal';material.setAttribute('aria-label','Lesmateriaal');material.innerHTML=lineIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>')+'<span>Lesmateriaal</span>';material.addEventListener('click',event=>{const target=options.materialsSelector&&document.querySelector(options.materialsSelector);if(target&&!target.disabled){event.preventDefault();menu.open=false;target.click();}});row.insertBefore(material,menu);}

    if(material)material.classList.add('hdr002-action');
    let navigation=header.querySelector('.hdr002-navigation');
    if(!navigation&&options.cardNavigation.length){
      navigation=document.createElement('div');navigation.className='hdr002-navigation';
      options.cardNavigation.forEach((selector,index)=>{const b=document.createElement('button');b.type='button';b.title=index?'Volgende kaart':'Vorige kaart';b.setAttribute('aria-label',b.title);b.innerHTML=lineIcon(index?'<path d="m9 6 6 6-6 6"/>':'<path d="m15 6-6 6 6 6"/>')+'<span>'+b.title+'</span>';b.addEventListener('click',()=>{const target=document.querySelector(selector);if(target&&!target.disabled){menu.open=false;target.click();requestAnimationFrame(()=>{const focus=narrow.matches?header.querySelector('.hdr001-menu-trigger'):header.querySelectorAll('.hdr002-navigation button')[index];if(focus&&!focus.disabled)focus.focus({preventScroll:true});});}});navigation.append(b);});
      row.prepend(navigation);
    }
    if(navigation){
      let available=false;
      options.cardNavigation.forEach((selector,index)=>{const target=document.querySelector(selector),visible=target&&target.getClientRects().length&&!target.closest('[hidden]');available ||= Boolean(visible);navigation.children[index].disabled=!visible||target.disabled;});
      navigation.hidden=!available;
      const parent=narrow.matches?panel:row;
      if(navigation.parentElement!==parent)parent.prepend(navigation);
    }
    const center=options.center;if(center){center.classList.add('hdr002-center');const parent=innerWidth<=1050?panel:header;if(center.parentElement!==parent){if(parent===header)header.insertBefore(center,row);else panel.append(center);}}
    const screen=header.querySelector('.hdr001-fullscreen');
    const actions=[material,help,screen].filter(Boolean);
    if(compact.matches){
      let anchor=[...panel.children].find(e=>!actions.includes(e)&&e!==navigation&&!(header.id==='appHeader'&&(e===center||e.hasAttribute('data-menu-resume'))))||null;
      for(const action of [...actions].reverse()){if(action.nextSibling!==anchor||action.parentElement!==panel)panel.insertBefore(action,anchor);anchor=action;}
      if(narrow.matches&&navigation&&navigation.nextSibling!==anchor)panel.insertBefore(navigation,anchor);
    }else{
      let anchor=menu;
      for(const action of [...actions].reverse()){if(action.nextSibling!==anchor||action.parentElement!==row)row.insertBefore(action,anchor);anchor=action;}
    }
    if(header.id==='appHeader'&&center?.parentElement===panel){
      if(panel.firstElementChild!==center)panel.prepend(center);
      const resume=panel.querySelector('[data-menu-resume]');if(resume&&center.nextElementSibling!==resume)center.after(resume);
    }
  }
  for(const query of [compact,narrow,matchMedia('(max-width:1050px)')])query.addEventListener('change',()=>{for(const header of document.querySelectorAll('.hdr001-header'))refresh(header);});
  function observe(options){
    const mount=()=>{for(const header of document.querySelectorAll(options.headers))install(header,header.querySelector(options.menu),options);};
    mount();new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
  }
  document.addEventListener('keydown',event=>{if(event.key!=='Escape'||document.querySelector('dialog[open]'))return;const menu=document.querySelector('.hdr001-menu[open]');if(menu){event.preventDefault();event.stopPropagation();menu.open=false;menu.querySelector(':scope > summary').focus();}},true);
  document.addEventListener('close',()=>{if(dialogMenuTrigger&&!document.querySelector('dialog[open]')){if(dialogMenuTrigger.isConnected)dialogMenuTrigger.focus();dialogMenuTrigger=undefined;}},true);
  document.addEventListener('pointerdown',event=>{for(const menu of document.querySelectorAll('.hdr001-menu[open]'))if(!menu.contains(event.target))menu.open=false;});
  document.addEventListener('fullscreenchange',()=>{for(const button of document.querySelectorAll('.hdr001-fullscreen'))sync(button);for(const status of document.querySelectorAll('.hdr001-status'))status.textContent='';});
  window.TaalrouteHeaderControls={install,observe,icons};
})();

window.TaalrouteHeaderControls.observe({"headers": "#appHeader, header.topbar:has(.taalroute-suite)", "menu": "details.suite-header-controls", "oldFullscreen": "#fullscreenBtn", "actions": "", "centerNavigation":".mainnav", "cardNavigation": ["#previousCard", ".card-navigation #primaryGame"], "manualUrl": "https://studio.taalroute.nl/#/apps/actief/handleiding"});

// Preserve Actief's pointer-vs-keyboard fullscreen behavior for the board's Space shortcut.
document.addEventListener('click',event=>{if(event.detail>0)event.target.closest('#appHeader .hdr001-fullscreen')?.blur();});
document.addEventListener('click',event=>{const action=event.target.closest('#appHeader .hdr001-panel button');if(action&&!action.closest('.tr-menu-appearance')){const menu=action.closest('.hdr001-menu');menu.open=false;menu.querySelector('.hdr001-menu-trigger').setAttribute('aria-expanded','false');}});
