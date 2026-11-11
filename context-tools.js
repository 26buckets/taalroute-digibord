/* One contextual control row for every playing surface. Content stays with its renderer. */
function contextTools(prefix, options={}) {
 const definitions=[
  ['Help','conversation','Hulp','Een aanwijzing voor deze opdracht, zonder het antwoord weg te geven.'],
  ['Example','eye','Voorbeeld','Bekijk een mogelijk voorbeeld bij deze opdracht.'],
  ['Goals','mission','Doel en rollen','Bekijk wat je oefent en wie welke rol heeft.'],
  ['Partner','people','Voor de gesprekspartner','Bekijk hoe je meedoet, luistert en reageert.'],
  ['More','more','Meer','Vervolg, verdieping en extra mogelijkheden bij deze opdracht.']
 ];
 const controls=definitions.map(([key,icon,label,description])=>{
  const o=options[key]||{},id=o.id||prefix+key,disabled=!!o.disabled,visibleLabel=o.label||({Goals:'Leerdoel',Partner:'Rol partner',More:'Extra uitleg'}[key]||label);
  return `<span class="context-tool" ${disabled?`tabindex="0" aria-label="${esc(visibleLabel)}"`:''} data-tip-label="${esc(o.label||label)}" data-tip="${esc(o.tip||description)}"><button type="button" class="smallbtn" id="${esc(id)}" aria-label="${esc(visibleLabel)}" ${o.controls?`aria-expanded="false" aria-controls="${esc(o.controls)}"`:'aria-haspopup="dialog"'} ${disabled?'disabled':''}>${gameIcon(icon)}<span class="context-label">${esc(visibleLabel)}</span>${o.count?`<span class="context-count" aria-hidden="true">${esc(o.count)}</span>`:''}</button></span>`;
 });
 const compact=prefix==='card',helpers=controls.filter((_,i)=>i!==1).join('');
 return `<div class="card-tools context-tools" role="group" aria-label="Bij deze opdracht">${compact?controls[1]+`<div class="card-teacher-tools"><button type="button" class="smallbtn card-teacher-toggle" aria-expanded="false" aria-controls="cardTeacherPanel">Docenthulp</button><div id="cardTeacherPanel" class="card-teacher-panel">${helpers}</div></div>`:controls.join('')}</div>`;
}
function unlockContextTool(id) {
 const button=document.getElementById(id);button.disabled=false;
 const tool=button.closest('.context-tool');tool?.removeAttribute('tabindex');
 if(tool)tool.dataset.tip=id.endsWith('Example')?'Bekijk het mogelijke voorbeeld en bespreek hoe het bij de opdracht past.':tool.dataset.tip;
}
function installContextTooltips() {
 const tip=document.createElement('div');tip.id='contextTooltip';tip.className='context-tooltip';tip.setAttribute('role','tooltip');tip.setAttribute('popover','manual');document.body.append(tip);
 let anchor, timer;
 function hide(){clearTimeout(timer);anchor?.querySelector('button')?.removeAttribute('aria-describedby');anchor?.removeAttribute('aria-describedby');anchor=null;if(tip.matches(':popover-open'))tip.hidePopover()}
 function show(el){
  clearTimeout(timer);if(!el)return;
  if(anchor!==el)hide();anchor=el;
  const parent=document.fullscreenElement||document.body;if(tip.parentElement!==parent)parent.append(tip);
  tip.innerHTML=`<strong>${esc(el.dataset.tipLabel)}</strong><span>${esc(el.dataset.tip)}</span>`;
  const button=el.querySelector('button');(button.disabled?el:button).setAttribute('aria-describedby',tip.id);
  if(!tip.matches(':popover-open'))tip.showPopover();
  const r=el.getBoundingClientRect(),t=tip.getBoundingClientRect();
  tip.style.left=Math.max(12,Math.min(innerWidth-t.width-12,r.left+(r.width-t.width)/2))+'px';
  tip.style.top=(r.top-t.height-12>=8?r.top-t.height-12:Math.min(innerHeight-t.height-8,r.bottom+12))+'px';
 }
 document.addEventListener('pointerover',e=>{const el=e.target.closest('.context-tool');if(el)show(el);else if(tip.contains(e.target))clearTimeout(timer);else if(!anchor?.contains(document.activeElement))hide()});
 document.addEventListener('pointerout',e=>{if(anchor&&!anchor.contains(e.relatedTarget)&&!tip.contains(e.relatedTarget))timer=setTimeout(()=>{if(!anchor?.contains(document.activeElement))hide()},120)});
 document.addEventListener('focusin',e=>{const el=e.target.closest('.context-tool');if(el)show(el);else hide()});
 document.addEventListener('click',e=>{const info=e.target.closest('.board-info,.context-tool:has(button:disabled)');if(info)show(info);else hide()});
 document.addEventListener('pointerup',e=>{if(e.pointerType==='touch'){const tool=e.target.closest('.context-tool:has(button:disabled)');if(tool)show(tool)}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
 document.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
}

// Keep the same controls and focus targets when the mobile help panel opens.
function closeTeacherTools(panel){panel.removeAttribute('data-open');panel.querySelector('.card-teacher-toggle').setAttribute('aria-expanded','false')}
if(typeof document!=='undefined'){
document.addEventListener('click',event=>{const button=event.target.closest?.('.card-teacher-toggle');if(button){const panel=button.parentElement,open=!panel.hasAttribute('data-open');panel.toggleAttribute('data-open',open);button.setAttribute('aria-expanded',String(open))}});
matchMedia('(min-width:601px)').addEventListener('change',event=>{document.querySelectorAll('.card-teacher-tools').forEach(panel=>{if(!event.matches&&panel.contains(document.activeElement))panel.querySelector('.card-teacher-toggle').focus();closeTeacherTools(panel)})});
document.addEventListener('keydown',event=>{const panel=event.target.closest?.('.card-teacher-tools');if(event.key==='Escape'&&panel&&matchMedia('(max-width:600px)').matches){closeTeacherTools(panel);panel.querySelector('.card-teacher-toggle').focus()}});
}
