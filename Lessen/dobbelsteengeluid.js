/* Shared roll audio and one movable mute button for both dice tables. */
globalThis.DigiBoardDiceAudio={connect({root,read,save,notice}){
 const audio=new Audio(new URL('dobbelsteen-hout.mp3',document.currentScript?.src||new URL('Lessen/dobbelsteengeluid.js',location.href)).href);
 audio.preload='auto';audio.volume=.85;
 let attempt=0;
 const enabled=()=>read().settings.sound!==false;
 const button=document.createElement('button');button.id='pp-sound';button.type='button';button.className='pp-icon-button';
 button.style.cssText='width:44px;height:44px;min-width:44px;min-height:44px;flex:0 0 44px;padding:10px;border:1px solid #dce3e8;border-radius:10px;background:#f7f9fb;touch-action:manipulation';
 function stop(){attempt++;audio.pause();audio.currentTime=0;}
 function sync(){
  const on=enabled(),label=on?'Geluid uitzetten':'Geluid aanzetten';button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(on));button.title=label;
  button.innerHTML='<svg style="width:24px;height:24px;flex-shrink:0;pointer-events:none" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/>'+(on?'<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>':'<path d="m16 9 5 6m0-6-5 6"/>')+'</svg>';
  const target=read().settings.diceStyle==='verbs'?root.querySelector('.aw-utilities'):root.querySelector('.pp-roll-heading');
  if(target&&button.parentNode!==target)target.append(button);
 }
 function play(){
  if(!enabled())return;stop();const current=attempt;
  audio.play().catch(error=>{if(current===attempt&&error.name!=='AbortError')notice('Het dobbelsteengeluid kon niet starten. Probeer de luidsprekerknop.');});
 }
 button.onclick=()=>{read().settings.sound=!enabled();read().settings.diceAudioRestored=true;save();sync();if(enabled())play();else stop();};
 root.addEventListener('click',event=>{if(event.target.closest('#pp-back,#pp-pause-button,#pp-settings-button,#db-open-maps,.aw-utilities button:not(#pp-sound)'))stop();},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
 sync();return{play,stop,sync};
}};
