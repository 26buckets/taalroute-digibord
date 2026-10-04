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
  this.root.addEventListener('lostpointercapture',()=>this.cancel());
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
  this.cancel();
  this.root.innerHTML=`<p class="zb-instruction">${escapeHtml(this.exercise.instruction)}</p><p class="zb-hint">Pak een kaart en sleep hem naar de gewenste plek.</p><p class="zb-sr">Met het toetsenbord: Enter legt een kaart in de zin, de pijltoetsen verplaatsen de kaart en Delete legt hem terug. Escape breekt slepen af.</p><section aria-label="Bouwzone" class="zb-zone" data-zone="sentence">${this.order.map(id=>this.card(id)).join('')||'<span class="zb-empty">Leg hier je zin</span>'}</section><section aria-label="Beschikbare kaarten" class="zb-zone zb-bank" data-zone="bank">${this.bankOrder.filter(id=>!this.order.includes(id)).map(id=>this.card(id)).join('')||'<span class="zb-empty">Alle kaarten liggen in de zin</span>'}</section><p class="zb-sr" role="status" aria-live="polite" data-board-status></p>`;
  if(this.locked)this.root.querySelectorAll('button').forEach(b=>b.disabled=true);
 }
 click(e) {
  if(this.suppressClick){this.suppressClick=false;e.preventDefault();return;}
  if(this.locked)return;
  const card=e.target.closest('[data-card]');
  if(card){const id=card.dataset.card;this.selected=id;if(!this.order.includes(id))this.place(id);else this.render();this.focus(id);return;}

 }
 key(e) {
  if(e.key==='Escape'&&this.drag){e.preventDefault();this.cancel();return;}
  this.suppressClick=false;
  const id=e.target.closest('[data-card]')?.dataset.card;if(!id||this.locked)return;
  const index=this.order.indexOf(id);
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.selected=id;this.place(id,index+(e.key==='ArrowLeft'?-1:1));this.focus(id);}
  if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();this.setOrder(this.order.filter(x=>x!==id));this.focus(id);}
 }
 focus(id){/** @type {HTMLButtonElement} */(this.root.querySelector(`[data-card="${id}"]`))?.focus({preventScroll:true});}
 down(e) {
  const card=e.target.closest('[data-card]');if(!card||this.locked||this.drag||e.button!==0||!e.isPrimary||card.dataset.fixed==='true')return;
  this.suppressClick=false;
  const rect=card.getBoundingClientRect();
  this.drag={id:card.dataset.card,card,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top,pointer:e.pointerId,moved:false};
  card.setPointerCapture(e.pointerId);
 }
 move(e) {
  const drag=this.drag;if(!drag||drag.pointer!==e.pointerId)return;
  drag.x=e.clientX;drag.y=e.clientY;
  if(!drag.moved&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)<7)return;
  e.preventDefault();
  if(!drag.moved){
   drag.moved=true;
   const rect=drag.card.getBoundingClientRect();
   this.ghost=/** @type {HTMLElement} */(drag.card.cloneNode(true));
   this.ghost.removeAttribute('data-card');this.ghost.removeAttribute('aria-pressed');this.ghost.setAttribute('aria-hidden','true');this.ghost.setAttribute('tabindex','-1');
   this.ghost.classList.add('zb-drag-ghost');this.ghost.style.width=rect.width+'px';this.ghost.style.height=rect.height+'px';
   this.marker=document.createElement('div');this.marker.className='zb-insertion';this.marker.setAttribute('aria-hidden','true');
   this.root.append(this.ghost,this.marker);drag.card.classList.add('zb-dragging');
   this.scrollFrame=requestAnimationFrame(time=>this.scrollDrag(time));
  }
  this.previewDrop();
 }
 // Choose a boundary in the nearest wrapped row, including the space between cards.
 dropTarget() {
  const {x,y,id}=this.drag,zone=/** @type {HTMLElement} */(document.elementFromPoint(x,y)?.closest('[data-zone]'));
  if(!zone||!this.root.contains(zone))return null;
  const cards=Array.from(zone.querySelectorAll('[data-card]')).filter(c=>c.getAttribute('data-card')!==id).map(c=>({id:c.getAttribute('data-card'),rect:c.getBoundingClientRect()}));
  let index=0;
  if(cards.length&&y>Math.max(...cards.map(c=>c.rect.bottom)))index=cards.length;
  else if(cards.length&&y>=cards[0].rect.top){
   const nearest=cards.reduce((a,b)=>Math.max(a.rect.top-y,y-a.rect.bottom,0)<=Math.max(b.rect.top-y,y-b.rect.bottom,0)?a:b);
   const row=cards.filter(c=>Math.abs(c.rect.top-nearest.rect.top)<2);
   const next=row.find(c=>x<c.rect.left+c.rect.width/2);
   index=next?cards.indexOf(next):cards.indexOf(row[row.length-1])+1;
  }
  if(zone.dataset.zone==='sentence')index=Math.max(this.exercise.fixed.length,index);
  const next=cards[index],previous=cards[index-1],rect=next?.rect||previous?.rect||zone.getBoundingClientRect();
  return {zone,index,left:next?rect.left-7:previous?rect.right+3:rect.left+12,top:rect.top+(cards.length?-8:12),height:cards.length?rect.height+16:rect.height-24};
 }
 previewDrop() {
  const drag=this.drag;
  this.ghost.style.left=(drag.x-drag.offsetX)+'px';this.ghost.style.top=(drag.y-drag.offsetY)+'px';
  this.root.querySelectorAll('.zb-drop').forEach(el=>el.classList.remove('zb-drop'));
  const target=this.dropTarget();this.marker.hidden=!target;
  if(target){target.zone.classList.add('zb-drop');Object.assign(this.marker.style,{left:target.left+'px',top:target.top+'px',height:target.height+'px'});}
 }
 scrollDrag(time) {
  if(!this.drag?.moved||!this.root.isConnected){this.cancel();return;}
  const edge=64,y=this.drag.y,speed=y<edge?-Math.min(1,(edge-y)/edge):y>innerHeight-edge?Math.min(1,(y-innerHeight+edge)/edge):0;
  if(speed){window.scrollBy(0,speed*Math.min(32,time-(this.scrollTime||time))*0.65);this.previewDrop();}
  this.scrollTime=time;this.scrollFrame=requestAnimationFrame(t=>this.scrollDrag(t));
 }
 up(e) {
  if(!this.drag||this.drag.pointer!==e.pointerId)return;
  const drag=this.drag;drag.x=e.clientX;drag.y=e.clientY;
  const target=drag.moved?this.dropTarget():null;this.cancel();if(!drag.moved)return;
  this.suppressClick=true;
  if(!target)return;
  this.selected=drag.id;
  if(target.zone.dataset.zone==='bank'){
   const bank=this.bankOrder.filter(id=>!this.order.includes(id)&&id!==drag.id);bank.splice(target.index,0,drag.id);
   this.setOrder(this.order.filter(id=>id!==drag.id),true,[...bank,...this.order.filter(id=>id!==drag.id)]);
  }else this.place(drag.id,target.index);
  this.focus(drag.id);
  this.root.querySelector('[data-board-status]').textContent=this.order.includes(drag.id)?`Kaart geplaatst op plek ${this.order.indexOf(drag.id)+1}.`:'Kaart teruggelegd.';
 }
 cancel(){
  const drag=this.drag;this.drag=null;if(drag?.moved)this.suppressClick=true;
  if(drag?.card.hasPointerCapture(drag.pointer))drag.card.releasePointerCapture(drag.pointer);
  cancelAnimationFrame(this.scrollFrame);this.scrollTime=0;
  this.ghost?.remove();this.marker?.remove();
  this.root.querySelectorAll('.zb-dragging,.zb-drop').forEach(el=>el.classList.remove('zb-dragging','zb-drop'));
 }
}
