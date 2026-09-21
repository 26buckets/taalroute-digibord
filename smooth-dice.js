/* Adapter: retain the local game's outcomes, colours, images and roll/lock controls. */
window.SmoothDice=(()=>{
 const views=new Map(),images=new Map();let rollKey=0;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(spec){return `<span class="die-scene smooth-die-host" data-die-spec="${escape(JSON.stringify(spec))}" aria-hidden="true"><canvas class="smooth-die"></canvas></span>`}
 function loadImage(url){if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Dobbelsteenbeeld kon niet worden geladen.'));img.src=window.DICE_TEXTURES?.[url]||url}));return images.get(url)}
 async function provider(spec){
  const atlas=document.createElement('canvas');atlas.width=1536;atlas.height=256;const ctx=atlas.getContext('2d');
  const labels=[spec.word,...(spec.words||[]).filter(x=>x!==spec.word)],pictures=[spec.image,...(spec.images||[]).filter(x=>x!==spec.image)];
  const loaded=spec.image?await Promise.all(pictures.map(loadImage)):[];
  for(let i=0;i<6;i++){
   ctx.save();ctx.translate(i*256,0);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';
   if(loaded.length){const img=loaded[i%loaded.length],scale=Math.min(228/img.width,228/img.height);ctx.drawImage(img,128-img.width*scale/2,128-img.height*scale/2,img.width*scale,img.height*scale)}
   else if(i===1&&spec.topIcon){const icon=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(spec.topIcon.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" fill="none" stroke="white" stroke-width="2.5" ')));ctx.drawImage(icon,46,46,164,164)}
   else{const text=String(labels[i%labels.length]||spec.word||''),words=text.split(/\s+/);let size=106,lines=[];do{ctx.font=`700 ${size}px Arial,sans-serif`;lines=[''];for(const word of words){const last=lines.length-1,next=(lines[last]+' '+word).trim();if(lines[last]&&ctx.measureText(next).width>220)lines.push(word);else lines[last]=next}if(lines.length*size*1.12<=202&&lines.every(line=>ctx.measureText(line).width<=220))break;size-=2}while(size>24);lines.forEach((line,j)=>ctx.fillText(line,128,128+(j-(lines.length-1)/2)*size*1.12))}
   ctx.restore();
  }
  return {colour:!!spec.image,atlas:()=>atlas};
 }
 function mount(root=document){
  for(const [host,entry] of views)if(!host.isConnected){entry.view?.destroy();entry.finish?.();views.delete(host)}
  for(const host of root.querySelectorAll('.smooth-die-host')){
   if(views.has(host))continue;const spec=JSON.parse(host.dataset.dieSpec),entry={view:null,finish:null};views.set(host,entry);
   entry.ready=(async()=>{
    const pictures=spec.value==null?await provider(spec):null;if(!host.isConnected)return;
    const inactive=!!host.closest('.inactive'),body=inactive?'#a8b1bb':spec.color||'#fffefa';
    entry.view=PraatpadDice.create(host.querySelector('canvas'),{pictures,body,front:spec.front!==false,ink:spec.value!=null||spec.image?'#21384c':body==='#fffefa'?'#21384c':'#ffffff',fill:spec.front===false?.315:.4,onProgress:t=>{if(t===1&&entry.finish){const done=entry.finish;entry.finish=null;done()}}});
    entry.view.show(spec.value||1,{style:pictures?'verbs':'numbers'});
   })().catch(()=>{host.classList.add('dice-load-error');host.textContent=spec.word||String(spec.value||'Beeld');});
  }
 }
 async function roll(host,duration=700,delay=0){
  mount();const entry=views.get(host);if(!entry)return;await entry.ready;if(!entry.view||!host.isConnected)return;
  const spec=JSON.parse(host.dataset.dieSpec);entry.finish?.();
  return new Promise(resolve=>{entry.finish=resolve;entry.view.show(spec.value||1,{style:spec.value==null?'verbs':'numbers',animate:true,key:++rollKey,duration,delay,lift:5})});
 }
 return {markup,mount,roll};
})();
