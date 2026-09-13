globalThis.DigiBoardSupport=(()=>{
 const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const card=(label,text,large=false)=>'<section class="db-support-card"><h3>'+escape(label)+'</h3><p'+(large?' class="db-support-example"':'')+'>'+escape(text)+'</p></section>';
 function show(kind,t,dialog,close){
  const back='<button type="button" id="db-support-back" class="pp-primary">Terug naar de opdracht</button>';
  if(kind!=='teacher'){
   const example=kind==='example',body=example?card('Zo kun je het zeggen',t.model||t.help?.replace(/^Voorbeeld: /,''),true):card('Doe nu dit',t.variants.extra.instruction,true);
   dialog((example?'Voorbeeld':'Extra stap')+' · '+t.title,'<div class="db-support">'+body+back+'</div>',()=>document.getElementById('db-support-back').onclick=close);return;
  }
  const row=globalThis.DigiBoardRouteLessons?.cards.find(c=>c.id===t.lessonId);
  const summary=card('Doel',t.definition||t.criterion)+card('Grammatica',t.grammar)+card('Voorbeeld',t.model,true);
  const approach='<ol class="db-support-steps"><li><strong>Start</strong><span>'+(t.preparatory?'Doe de voorbeeldzin één keer voor.':'Laat de cursist de opdracht proberen.')+'</span></li><li><strong>Let op</strong><span>'+escape(t.definition||t.criterion)+'</span></li><li><strong>Geef één tip</strong><span>'+escape(t.grammar)+'</span></li><li><strong>Opnieuw</strong><span>Gebruik de extra stap voor een volgende poging.</span></li></ol><details class="db-more"><summary>Volledige docentnotitie</summary><p>'+escape(t.teacher)+'</p><p>'+escape(t.criterion)+'</p></details>';
  const source='<dl class="db-source"><dt>Materiaal</dt><dd>Taalroute · DigiBoard</dd><dt>Reeks</dt><dd>48 handelingen · vier niveauroutes</dd><dt>Route</dt><dd>'+escape(t.routeLabel||t.level)+'</dd><dt>Familie</dt><dd>'+escape(t.family)+'</dd></dl>'+(t.input?'<details class="db-more"><summary>Oefengegevens</summary><p>'+escape(t.input)+'</p></details>':'')+(row?'<details class="db-more"><summary>Oorspronkelijke opdracht</summary><p>'+escape(row.sourceInstruction)+'</p></details>':'');
  const tabs=[['goal','Lesdoel',summary],['approach','Aanpak',approach],['source','Bron',source]];
  dialog('Voor de docent · '+t.title,'<div class="db-support"><p class="db-support-meta">'+escape(t.routeLabel||t.level)+' · '+escape(t.family)+(t.preparatory?' · Voorbereidend':'')+'</p><div class="db-support-tabs" role="tablist" aria-label="Docentinformatie">'+tabs.map(([id,label],i)=>'<button type="button" role="tab" id="db-tab-'+id+'" aria-controls="db-tabpanel-'+id+'" aria-selected="'+!i+'" tabindex="'+(i?-1:0)+'">'+label+'</button>').join('')+'</div>'+tabs.map(([id,label,body],i)=>'<div role="tabpanel" id="db-tabpanel-'+id+'" aria-labelledby="db-tab-'+id+'" tabindex="0" '+(i?'hidden':'')+'>'+body+'</div>').join('')+back+'</div>',()=>{
   const buttons=[...document.querySelectorAll('.db-support-tabs [role="tab"]')];
   function choose(n){buttons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=i!==n;});buttons[n].focus();}
   buttons.forEach((b,i)=>{b.onclick=()=>choose(i);b.onkeydown=e=>{let n;if(e.key==='ArrowRight')n=(i+1)%buttons.length;if(e.key==='ArrowLeft')n=(i+buttons.length-1)%buttons.length;if(e.key==='Home')n=0;if(e.key==='End')n=buttons.length-1;if(n!==undefined){e.preventDefault();choose(n);}};});document.getElementById('db-support-back').onclick=close;
  });
 }
 function organize(){
  const $=id=>document.getElementById(id),node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;};
  const nav=document.querySelector('.pp-settings-nav');
  for(const [heading,items] of [['Les',[['pp-nav-board','Kaart & les'],['pp-nav-dice','Spel & beelden'],['pp-home','Lessen & printen']]],['Groep',[['pp-nav-people','Deelnemers'],['pp-nav-groups','Bewaarde groepen']]],['Beheer',[['pp-nav-didactics','Leerdoelen'],['pp-nav-storage','Bewaren & terugzetten']]]]){
   nav.append(node('p','db-nav-heading',heading));for(const[id,label]of items){const b=$(id);b.querySelector('span').textContent=label;nav.append(b);}
  }nav.append($('pp-finish-button'));
  $('pp-board-settings-title').textContent='Kaart & les';$('pp-dice-title').textContent='Spel & beelden';
  const label=$('pp-default-help').closest('label');label.hidden=true;
  // Keep the same controls and event handlers; organize their existing DOM nodes.
  const panel=document.querySelector('.db-learning-options');if(panel){const children=[...panel.children];let group;for(const child of children){if(child.tagName==='H4'){group=node('section','db-settings-card');panel.append(group);}if(group)group.append(child);}for(const group of panel.querySelectorAll('.db-settings-card')){const notes=[...group.querySelectorAll(':scope > .pp-note')];if(notes.length){const details=node('details','db-more');details.append(node('summary','','Toelichting'));notes.forEach(n=>details.append(n));group.append(details);}}}
  const correction=document.querySelector('.pp-correction');if(correction){const more=node('details','db-more');more.append(node('summary','','Pion verplaatsen'));correction.before(more);more.append(correction);correction.querySelector('h4').hidden=true;}
  const appearance=document.querySelector('.pp-tile-appearance');if(appearance){const more=node('details','db-more');more.append(node('summary','','Weergave speelvakken'));appearance.before(more);more.append(appearance);}
  const set=$('pp-picture-set');if(set){const more=node('details','db-more');more.append(node('summary','','Bekijk de beelden in deze set'));set.before(more);more.append(set);}
  const toolbar=node('div','db-task-support');toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Bij deze opdracht');
  $('pp-task').append(toolbar);for(const[id,label]of [['pp-help','Voorbeeld'],['pp-extra','Extra stap'],['db-lesson-support','Voor de docent']]){const button=$(id);button.textContent=label;button.className='pp-secondary';button.setAttribute('aria-haspopup','dialog');toolbar.append(button);}
 }
 document.addEventListener('DOMContentLoaded',organize,{once:true});
 return{show};
})();
