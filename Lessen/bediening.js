globalThis.DigiBoardSupport=(()=>{
 const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shape=id=>'<span class="db-shape" aria-hidden="true"><i data-lucide="'+({circle:'circle',square:'square',triangle:'triangle',diamond:'diamond'}[id]||'shapes')+'"></i></span>';
 const card=(label,text,large=false)=>'<section class="db-support-card"><h3>'+escape(label)+'</h3><p'+(large?' class="db-support-example"':'')+'>'+escape(text)+'</p></section>';
 function show(kind,t,dialog,close){
  const back='<button type="button" id="db-support-back" class="pp-primary">Terug naar de opdracht</button>';
  if(kind!=='teacher'){
   const example=kind==='example',hint=kind==='hint',body=example?card('Zo kun je het zeggen',t.model||t.help?.replace(/^Voorbeeld: /,''),true):hint?card('Een begin',t.support||'Probeer een korte zin.',true):'<p>Bied deze extra stap aan als de cursist klaar is voor een vervolg.</p>'+card('Vervolgopdracht',t.variants.extra.instruction,true);
   dialog((example?'Voorbeeld':hint?'Hulp':'Extra stap voor de docent')+' · '+t.title,'<div class="db-support">'+body+back+'</div>',()=>document.getElementById('db-support-back').onclick=close);return;
  }
  const row=globalThis.DigiBoardRouteLessons?.cards.find(c=>c.id===t.lessonId);
  const summary=card('Doel',t.definition||t.criterion)+card('Grammatica',t.grammar)+card('Voorbeeld',t.model,true)+(t.partner?card('Samen oefenen',t.partner):'');
  const approach='<ol class="db-support-steps"><li><strong>Start</strong><span>'+(t.preparatory?'Doe de voorbeeldzin één keer voor.':'Laat de cursist de opdracht proberen.')+'</span></li><li><strong>Let op</strong><span>'+escape(t.definition||t.criterion)+'</span></li><li><strong>Geef één tip</strong><span>'+escape(t.grammar)+'</span></li><li><strong>Opnieuw</strong><span>Gebruik de extra stap voor een volgende poging.</span></li></ol><details class="db-more"><summary>Volledige docentnotitie</summary><p>'+escape(t.teacher)+'</p><p>'+escape(t.criterion)+'</p></details>';
  const source='<dl class="db-source"><dt>Materiaal</dt><dd>Taalroute · DigiBoard</dd><dt>Reeks</dt><dd>960 opdrachten · vier niveauroutes</dd><dt>Route</dt><dd>'+escape(t.routeLabel||t.level)+'</dd><dt>Familie</dt><dd>'+escape(t.family)+'</dd></dl>'+(t.input?'<details class="db-more"><summary>Oefengegevens</summary><p>'+escape(t.input)+'</p></details>':'')+(row?'<details class="db-more"><summary>Oorspronkelijke opdracht</summary><p>'+escape(row.sourceInstruction)+'</p></details>':'');
  const tabs=[['goal','Lesdoel',summary],['approach','Aanpak',approach],['source','Bron',source]];
  dialog('Voor de docent · '+t.title,'<div class="db-support"><p class="db-support-meta">'+escape(t.routeLabel||t.level)+' · '+escape(t.family)+(t.preparatory?' · Voorbereidend':'')+'</p><div class="db-support-tabs" role="tablist" aria-label="Docentinformatie">'+tabs.map(([id,label],i)=>'<button type="button" role="tab" id="db-tab-'+id+'" aria-controls="db-tabpanel-'+id+'" aria-selected="'+!i+'" tabindex="'+(i?-1:0)+'">'+label+'</button>').join('')+'</div>'+tabs.map(([id,label,body],i)=>'<div role="tabpanel" id="db-tabpanel-'+id+'" aria-labelledby="db-tab-'+id+'" tabindex="0" '+(i?'hidden':'')+'>'+body+'</div>').join('')+back+'</div>',()=>{
   const buttons=[...document.querySelectorAll('.db-support-tabs [role="tab"]')];
   function choose(n){buttons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=i!==n;});buttons[n].focus();}
   buttons.forEach((b,i)=>{b.onclick=()=>choose(i);b.onkeydown=e=>{let n;if(e.key==='ArrowRight')n=(i+1)%buttons.length;if(e.key==='ArrowLeft')n=(i+buttons.length-1)%buttons.length;if(e.key==='Home')n=0;if(e.key==='End')n=buttons.length-1;if(n!==undefined){e.preventDefault();choose(n);}};});document.getElementById('db-support-back').onclick=close;
  });
 }
 function organize(){
  const $=id=>document.getElementById(id),node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;};
  $('praatpad-board').classList.add('db-ui');
  $('db-map-tools').before($('db-lesson-bar'));
  const rollArea=node('div','db-roll-area');
  const rollParts=[document.querySelector('.pp-roll-heading'),$('pp-roll'),document.querySelector('.pp-current'),document.querySelector('.pp-progress'),document.querySelector('.pp-demo')];
  rollParts[0].before(rollArea);rollParts.forEach(e=>rollArea.append(e));
  for(const [id,name,label] of [['db-open-maps','map','Wissel kaart'],['map-rules-button','signpost','Speciale plekken'],['world-route-help','list-ordered','Vaknummers']]){
   const b=$(id);if(!b)continue;b.innerHTML='<i data-lucide="'+name+'" aria-hidden="true"></i><span class="db-map-tool-label">'+(label==='Vaknummers'?'Vak<wbr>nummers':label)+'</span>';b.setAttribute('aria-label',label);b.title=label;
  }
  // Only an actual backdrop press closes a dialog; dragging out of its content does not.
  let outsideDialog=null;
  const outside=(e,d)=>{const r=d.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};
  document.addEventListener('pointerdown',e=>{outsideDialog=e.target instanceof HTMLDialogElement&&outside(e,e.target)?e.target:null;});
  document.addEventListener('click',e=>{if(e.target===outsideDialog&&outside(e,outsideDialog))outsideDialog.close();outsideDialog=null;});

  const nav=document.querySelector('.pp-settings-nav');
  for(const [heading,items] of [
   ['Les',[['pp-nav-board','Kaart en oefening'],['pp-nav-dice','Andere spelvormen']]],
   ['Groep',[['pp-nav-people','Namen en pionnen'],['pp-nav-groups','Bewaarde groepen']]],
   ['Opdrachten & lessen',[['pp-home','Lessen en printen'],['pp-nav-didactics','Didactische uitleg']]],
   ['Weergave & geluid',[['pp-nav-sound','Beeld en geluid']]],
   ['Bewaren',[['pp-nav-storage','Reservekopie en herstel']]]]){
   const group=node('div','db-nav-group');group.append(node('p','db-nav-heading',heading));
   for(const[id,label]of items){const b=$(id);b.querySelector('span').textContent=label;group.append(b);}nav.append(group);
  }nav.append($('pp-finish-button'));
  $('pp-board-settings-title').textContent='Kaart en oefening';$('pp-dice-title').textContent='Andere spelvormen';
  $('pp-library-title').textContent='Lessen en printen';$('pp-didactics-title').textContent='Didactische uitleg';
  const board=$('pp-panel-board');board.prepend($('pp-board-settings-title'));
  // One visible map selector, beside the board exercise settings.
  document.querySelector('.db-map-picker').classList.add('db-duplicate-setting');
  $('pp-form-note').textContent='Kies de kaart, verhalen met beelden of het woordspel. Stel de oefening op de kaart in bij Kaart en oefening.';
  const duplicateSentence=$('db-sentence-settings-open').closest('section');duplicateSentence.classList.add('db-duplicate-setting');
  const lessonLink=node('button','pp-secondary','Kaart en oefening instellen');lessonLink.type='button';lessonLink.onclick=()=>$('pp-nav-board').click();$('pp-form-note').after(lessonLink);
  const bg=node('p','pp-note','Dit is achtergrond voor de docent. De speelopdrachten zijn beschikbaar voor A0 → A1, A1 → A1+, A1 → A2 en A2 → B1. Hogere routes zijn ontwerpvoorbeelden.');
  document.querySelector('.didactics-heading').after(bg);
  for(const o of $('pp-fl-level').options)if(+o.value.slice(-1)>3)o.textContent+=' · ontwerpvoorbeeld';
  const label=$('pp-default-help').closest('label');label.hidden=true;
  // Keep the same controls and event handlers; organize their existing DOM nodes.
  const panel=document.querySelector('.db-learning-options');if(panel){const children=[...panel.children];let group;for(const child of children){if(child.tagName==='H4'){group=node('section','db-settings-card');panel.append(group);}if(group)group.append(child);}for(const group of panel.querySelectorAll('.db-settings-card')){const notes=[...group.querySelectorAll(':scope > .pp-note')];if(notes.length){const details=node('details','db-more');details.append(node('summary','','Toelichting'));notes.forEach(n=>details.append(n));group.append(details);}}}
  const basics=node('div','db-lesson-basics'),level=node('div','db-level-choice');
  level.append(document.querySelector('label[for="db-learning-level"]'),$('db-learning-level'));
  basics.append(document.querySelector('.db-board-select'),level);$('pp-board-settings-title').after(basics);
  const workCard=$('db-work-form').closest('.db-settings-card');workCard.querySelector('h4').textContent='Werkvorm en beurten';
  const catalogue=node('div','db-catalog-entry');catalogue.append($('db-lesson-catalog'),document.querySelector('.db-matrix-legend'));board.append(catalogue);
  // Move the existing pawn controls with their handlers and saved values intact.
  const pawnCard=$('db-pawn-mode').closest('.db-settings-card');
  if(pawnCard){pawnCard.id='db-group-pawns';$('pp-panel-people').append(pawnCard);}
  const groupLink=node('button','pp-secondary','Deelnemers en pionnen instellen');groupLink.type='button';groupLink.onclick=()=>$('pp-nav-people').click();board.append(groupLink);
  const appearancePanel=$('pp-panel-sound');appearancePanel.querySelector('h3').textContent='Beeld en geluid';
  const display=node('section','db-settings-card');display.append(node('h4','','Weergave en beweging'));
  display.append($('pp-motion').closest('label'));appearancePanel.prepend(display);appearancePanel.prepend(appearancePanel.querySelector('h3'));
  const soundHeading=node('h4','','Dobbelsteengeluid');display.after(soundHeading);
  const correction=document.querySelector('.pp-correction');if(correction){const more=node('details','db-more');more.append(node('summary','','Pion verplaatsen'));$('pp-panel-people').append(more);more.append(correction);correction.querySelector('h4').hidden=true;}
  const appearance=document.querySelector('.pp-tile-appearance');if(appearance){const more=node('details','db-more');more.append(node('summary','','Weergave speelvakken'));display.append(more);more.append(appearance);}
  display.append($('pp-icon-style-options'));
  const set=$('pp-picture-set');if(set){const more=node('details','db-more');more.append(node('summary','','Bekijk de beelden in deze set'));set.before(more);more.append(set);}
  const toolbar=node('div','db-task-support');toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Bij deze opdracht');
  const addIcon=(button,label,name)=>{button.type='button';button.className='pp-secondary db-support-icon';button.setAttribute('aria-label',label);button.title=label;button.dataset.tooltip=label;button.dataset.label=label==='Extra stap voor de docent'?'Extra stap':label;button.innerHTML='<i data-lucide="'+name+'" aria-hidden="true"></i>';return button;};
  const hint=addIcon(node('button'),'Hulp','life-buoy');hint.id='db-matrix-hint';hint.onclick=()=>globalThis.DigiBoardMatrixUI?.hint();hint.setAttribute('aria-haspopup','dialog');
  const next=addIcon(node('button'),'Andere opdracht','split');next.id='db-matrix-next';next.onclick=()=>globalThis.DigiBoardMatrixUI?.next();
  const example=addIcon($('pp-help'),'Voorbeeld','message-square-quote');example.setAttribute('aria-haspopup','dialog');
  toolbar.append(hint,next,example);
  const teacher=node('div','db-teacher-actions');teacher.setAttribute('role','group');teacher.setAttribute('aria-label','Voor de docent');teacher.append(node('span','db-teacher-label','Docent'));
  const extra=addIcon($('pp-extra'),'Extra stap voor de docent','footprints');extra.setAttribute('aria-haspopup','dialog');
  const notes=addIcon($('db-lesson-support'),'Docentaanpak','graduation-cap');notes.setAttribute('aria-haspopup','dialog');teacher.append(extra,notes);toolbar.append(teacher);$('pp-task').append(toolbar);
  const expandLabel=node('span','db-expand-label','Lees alles');$('pp-large-button').append(expandLabel);
  const textArea=document.querySelector('#pp-task .pp-roles');
  const overflowObserver=new ResizeObserver(()=>$('pp-task').classList.toggle('db-long-task',textArea.scrollHeight>textArea.clientHeight+1));
  for(const element of [textArea,$('pp-instruction'),$('pp-partner')])overflowObserver.observe(element);
  globalThis.lucide?.createIcons({attrs:{width:20,height:20,'stroke-width':1.8}});

 }
 document.addEventListener('DOMContentLoaded',organize,{once:true});
 return{show,shape};
})();
