(function(root){
 'use strict';
 // Free responses stay in memory; the existing lesson store excludes personal answers.
 const drafts=new Map();
 const esc=s=>(globalThis.AppWording?.text(s)??String(s??'')).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function key(item,preview){return (preview?'preview':root.ContentRuntime.activeSession()?.session_id||'preview')+':'+item.content_item_id+':'+item.version}
 function state(item,preview){const k=key(item,preview);if(!drafts.has(k))drafts.set(k,{read:false,attempted:false,hint:false,showExample:false,fields:item.reasoning.presentation.layout==='zinstrips'?[...item.reasoning.presentation.source_blocks]:item.reasoning.presentation.layout==='twee_kolommen'?['','']:['']});return drafts.get(k)}
 function render(item,{preview=false}={}){
  const r=item.reasoning,p=r.presentation,s=state(item,preview),strips=p.layout==='zinstrips',ready=!p.answer_space_after_reading||s.read;
  const blocks=`<div class="reasoning-blocks ${p.layout==='twee_zinnen'?'reasoning-columns':''}">${p.source_blocks.map((t,n)=>`<p><span class="sr-only">Tekst ${n+1}. </span>${esc(t)}</p>`).join('')}</div>`;
  const fields=s.fields.map((text,n)=>{const label=strips?'Zin '+(n+1):p.columns[n]||'Je antwoord';return `<label class="reasoning-field"><span>${esc(label)}</span><textarea rows="3" maxlength="2000" data-reasoning-field="${n}">${esc(text)}</textarea></label>${strips?`<div class="reasoning-strip-tools">${p.selectable_markers.filter(m=>m.block===n).map(m=>`<button class="smallbtn" type="button" data-reasoning-action="remove" data-index="${n}" data-word="${esc(m.text)}" ${text.startsWith(m.text+' ')?'':'disabled'}>${esc(m.text)} weglaten</button>`).join('')}<button class="smallbtn" type="button" data-reasoning-action="reset" data-index="${n}">Oorspronkelijke zin ${n+1}</button></div>`:''}`}).join('');
  return `<div class="reasoning-task" data-reasoning-item="${esc(item.content_item_id)}" data-reasoning-preview="${preview}">${strips?`<details><summary>Oorspronkelijke tekst</summary>${blocks}</details>`:`<section><h3>De tekst</h3>${blocks}</section>`}<section class="content-prompt"><h3>De opdracht</h3><h2>${esc(item.prompt)}</h2></section>${r.extension_note?'<small>Ook voor verdieping bij C1.</small>':''}${r.hint?`<button class="smallbtn" type="button" data-reasoning-action="hint" aria-expanded="${s.hint}">Hulp</button><p class="reasoning-hint" ${s.hint?'':'hidden'}>${esc(r.hint)}</p>`:''}${ready?`<section class="reasoning-work"><h3>${strips?'Bewerk de zinnen':'Je antwoord'}</h3><p class="reasoning-note">Bespreek samen of schrijf. Je tekst blijft hier staan tot je een nieuwe les start of de app herlaadt.</p><div class="${p.layout==='twee_kolommen'?'reasoning-columns':''}">${fields}</div><button class="smallbtn" type="button" data-reasoning-action="attempt" aria-pressed="${s.attempted}">${s.attempted?'Eigen antwoord klaar ✓':'Eigen antwoord klaar'}</button></section>`:'<button class="smallbtn" type="button" data-reasoning-action="read">Gelezen · geef antwoord</button>'}${s.attempted?`<button class="smallbtn" type="button" data-reasoning-action="example" aria-expanded="${s.showExample}">Bekijk een mogelijk antwoord</button><div class="content-answer" ${s.showExample?'':'hidden'}><section><h3>Een mogelijk antwoord</h3><p>${esc(r.teacher.example_answer)}</p></section><section><h3>Bespreek samen</h3><ul>${r.teacher.acceptance_points.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>${esc(r.teacher.avoid)}</p></section><section><h3>Daarna</h3><p>${esc(r.teacher.next_step)}</p></section></div>`:''}</div>`;
 }
 function current(host){const preview=host.dataset.reasoningPreview==='true',id=host.dataset.reasoningItem;return {preview,item:preview?root.ContentRuntime.itemById(id):root.ContentRuntime.itemForSession(id)}}
 document.addEventListener('input',event=>{
  const field=event.target.closest('[data-reasoning-field]'),host=field?.closest('[data-reasoning-item]');if(!host)return;
  const {item,preview}=current(host),s=state(item,preview),n=Number(field.dataset.reasoningField);s.fields[n]=field.value.slice(0,2000);
  host.querySelectorAll(`[data-reasoning-action="remove"][data-index="${n}"]`).forEach(button=>button.disabled=!s.fields[n].startsWith(button.dataset.word+' '));
  // A changed response needs another own attempt before reopening the example.
  s.attempted=false;s.showExample=false;host.querySelector('.content-answer')?.setAttribute('hidden','');host.querySelector('[data-reasoning-action="example"]')?.remove();const attempt=host.querySelector('[data-reasoning-action="attempt"]');if(attempt){attempt.textContent='Eigen antwoord klaar';attempt.setAttribute('aria-pressed','false')}
 });
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-reasoning-action]'),host=button?.closest('[data-reasoning-item]');if(!host)return;
  const {item,preview}=current(host),s=state(item,preview),action=button.dataset.reasoningAction,n=Number(button.dataset.index);let focus=action;
  if(action==='hint')s.hint=!s.hint;
  if(action==='read'){s.read=true;focus='field'}
  if(action==='attempt'){s.attempted=true;focus='example'}
  if(action==='example')s.showExample=!s.showExample;
  if(action==='remove'||action==='reset'){
   s.fields[n]=action==='reset'?item.reasoning.presentation.source_blocks[n]:s.fields[n].startsWith(button.dataset.word+' ')?s.fields[n].slice(button.dataset.word.length).trimStart():s.fields[n];
   s.attempted=false;s.showExample=false;focus='field';
  }
  const shell=document.createElement('div');shell.innerHTML=render(item,{preview});const replacement=shell.firstElementChild;host.replaceWith(replacement);
  replacement.querySelector(focus==='field'?`[data-reasoning-field="${Number.isInteger(n)?n:0}"]`:`[data-reasoning-action="${focus}"]`)?.focus({preventScroll:true});
 });
 root.ReasoningTasks=Object.freeze({render,clear:()=>drafts.clear()});
})(globalThis);
