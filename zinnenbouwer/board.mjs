import {labels,enabled} from './model.mjs';
import {shuffle,respectsFixed} from './exercise.mjs';
export const escapeHtml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const button = (id,text,extra='') => `<button type="button" data-action="${id}" ${extra}>${text}</button>`;
/** Shared pointer/keyboard/tap interaction; never repairs or validates grammar. */
export class SentenceBoard {
 /** @param {HTMLElement} root @param {import("./model.mjs").SentenceModel} model @param {import("./exercise.mjs").Exercise} exercise @param {(order:string[])=>void} onChange @param {string[]} order */
 constructor(root,model,exercise,onChange=()=>{},order=exercise.order) {
  this.root=root;this.model=model;this.exercise=exercise;this.onChange=onChange;
  const ids=enabled(model).map(c=>c.id);
  this.order=Array.isArray(order)&&new Set(order).size===order.length&&order.every(id=>ids.includes(id))&&respectsFixed(exercise,order)?[...order]:[...exercise.order];this.history=[];this.selected=null;this.locked=false;
  this.bankOrder=[...exercise.bank,...exercise.order];
  this.root.addEventListener('click',e=>this.click(e));
  this.root.addEventListener('keydown',e=>this.key(e));
  this.root.addEventListener('pointerdown',e=>this.down(e));
  this.root.addEventListener('pointermove',e=>this.move(e));
  this.root.addEventListener('pointerup',e=>this.up(e));
  this.root.addEventListener('pointercancel',()=>this.cancel());
  this.render();
 }
 setOrder(order,remember=true,bankOrder=this.bankOrder) {
  if(this.locked||!respectsFixed(this.exercise,order))return;
  const ids=enabled(this.model).map(c=>c.id);
  if(new Set(order).size!==order.length||order.some(id=>!ids.includes(id)))return;
  if(remember)this.history.push({order:[...this.order],bankOrder:[...this.bankOrder]});this.history=this.history.slice(-30);
  this.order=[...order];this.bankOrder=[...bankOrder];this.render();this.onChange([...this.order]);
 }
 place(id,index=this.order.length) {
  if(this.exercise.fixed.includes(id))return;
  const next=this.order.filter(x=>x!==id);
  next.splice(Math.max(this.exercise.fixed.length,Math.min(index,next.length)),0,id);
  this.setOrder(next);
 }
 reset(){this.selected=null;this.setOrder(this.exercise.order,true,[...this.exercise.bank,...this.exercise.order]);}
 clear(){this.selected=null;this.setOrder(this.exercise.fixed);}
 undo(){if(this.history.length){const previous=this.history.pop();this.setOrder(previous.order,false,previous.bankOrder);}}
 mix(){this.setOrder([...this.exercise.fixed,...shuffle(this.order.filter(id=>!this.exercise.fixed.includes(id)))],true,shuffle(this.bankOrder));}
 card(id) {
  const c=this.model.components.find(c=>c.id===id),fixed=this.exercise.fixed.includes(id);
  return `<button type="button" class="zb-card" data-card="${id}" aria-pressed="${this.selected===id}" aria-label="${escapeHtml(labels[c.type]+': '+c.value+(fixed?', staat vast':''))}" ${this.locked?'disabled':''} data-fixed="${fixed}"><span>${labels[c.type]}${fixed?' · vast':''}</span><strong>${escapeHtml(c.value)}</strong></button>`;
 }
 render() {
  const chosen=this.selected&&this.model.components.find(c=>c.id===this.selected),movable=chosen&&!this.exercise.fixed.includes(chosen.id),index=this.order.indexOf(this.selected);
  this.root.innerHTML=`<p class="zb-instruction">${escapeHtml(this.exercise.instruction)}</p><p class="zb-hint">Sleep een kaart, of tik erop. Gebruik de pijlen om een gekozen kaart te verplaatsen.</p><section aria-label="Bouwzone" class="zb-zone" data-zone="sentence">${this.order.map(id=>this.card(id)).join('')||'<span class="zb-empty">Leg hier je zin</span>'}</section><div class="zb-card-actions" aria-label="Gekozen kaart"><span>${chosen?escapeHtml(chosen.value):'Kies een kaart'}</span>${button('left','← Naar links',!movable||index<=this.exercise.fixed.length?'disabled':'')}${button('right','Naar rechts →',!movable||index<0||index===this.order.length-1?'disabled':'')}${button('return','Terugleggen',!movable||index<0?'disabled':'')}</div><section aria-label="Beschikbare kaarten" class="zb-zone zb-bank" data-zone="bank">${this.bankOrder.filter(id=>!this.order.includes(id)).map(id=>this.card(id)).join('')||'<span class="zb-empty">Alle kaarten liggen in de zin</span>'}</section><p class="zb-sr" role="status" aria-live="polite" data-board-status></p>`;
  if(this.locked)this.root.querySelectorAll('button').forEach(b=>b.disabled=true);
 }
 click(e) {
  if(this.suppressClick){this.suppressClick=false;e.preventDefault();return;}
  if(this.locked)return;
  const card=e.target.closest('[data-card]');
  if(card){const id=card.dataset.card;this.selected=id;if(!this.order.includes(id))this.place(id);else this.render();this.focus(id);return;}
  const action=e.target.closest('[data-action]')?.dataset.action;
  const index=this.order.indexOf(this.selected);
  if(action==='left')this.place(this.selected,index-1);
  if(action==='right')this.place(this.selected,index+1);
  if(action==='return')this.setOrder(this.order.filter(id=>id!==this.selected));
  if(action)this.focus(this.selected);
 }
 key(e) {
  const id=e.target.closest('[data-card]')?.dataset.card;if(!id||this.locked)return;
  const index=this.order.indexOf(id);
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.selected=id;this.place(id,index+(e.key==='ArrowLeft'?-1:1));this.focus(id);}
  if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();this.setOrder(this.order.filter(x=>x!==id));this.focus(id);}
 }
 focus(id){/** @type {HTMLButtonElement} */(this.root.querySelector(`[data-card="${id}"]`))?.focus();}
 down(e) {
  const card=e.target.closest('[data-card]');if(!card||this.locked||e.button!==0||card.dataset.fixed==='true')return;
  this.drag={id:card.dataset.card,x:e.clientX,y:e.clientY,pointer:e.pointerId,moved:false};
  card.setPointerCapture(e.pointerId);
 }
 move(e) {
  if(!this.drag||this.drag.pointer!==e.pointerId)return;
  if(Math.hypot(e.clientX-this.drag.x,e.clientY-this.drag.y)>7){this.drag.moved=true;e.preventDefault();this.root.querySelector(`[data-card="${this.drag.id}"]`)?.classList.add('zb-dragging');
   this.root.querySelectorAll('.zb-drop').forEach(el=>el.classList.remove('zb-drop'));
   document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-card],[data-zone]')?.classList.add('zb-drop');
  }
 }
 up(e) {
  if(!this.drag)return;const drag=this.drag;this.cancel();if(!drag.moved)return;
  this.suppressClick=true;setTimeout(()=>{this.suppressClick=false;},0);
  const target=document.elementFromPoint(e.clientX,e.clientY),zone=/** @type {HTMLElement} */(target?.closest('[data-zone]'));
  if(!zone||!this.root.contains(zone))return;
  this.selected=drag.id;
  if(zone.dataset.zone==='bank')this.setOrder(this.order.filter(id=>id!==drag.id));
  else {const card=/** @type {HTMLElement} */(target.closest('[data-card]')),without=this.order.filter(id=>id!==drag.id);let i=without.length;if(card&&card.dataset.card!==drag.id){const r=card.getBoundingClientRect();i=without.indexOf(card.dataset.card)+(e.clientX>r.left+r.width/2?1:0);}this.place(drag.id,i);}
  this.focus(drag.id);
 }
 cancel(){this.drag=null;this.root.querySelectorAll('.zb-dragging,.zb-drop').forEach(el=>el.classList.remove('zb-dragging','zb-drop'));}
}
