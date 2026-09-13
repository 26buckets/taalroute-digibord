/* Shared roll audio and one movable mute button for both dice tables. */
globalThis.DigiBoardDiceAudio={connect({root,read,save,notice}){
 const choices=[['original','Origineel','original.wav'],['felt','Zacht op vilt','felt.mp3'],['wood','Klassiek op hout','hout.mp3'],['cup','Dobbelbeker en rollen','cup.mp3'],['board','Licht op het spelbord','board.mp3']];
 const settings=()=>read().settings;
 // Restore the first-ever sound once; later choices and mute remain user preferences.
 if(!settings().diceSoundMenuRestored){settings().diceSound='original';settings().diceSoundMenuRestored=true;queueMicrotask(save);}
 const selected=()=>choices.find(c=>c[0]===settings().diceSound)||choices[0];
 const source=()=>new URL('Lessen/dobbelsteen-'+selected()[2],location.href).href;
 const audio=new Audio(source());audio.preload='auto';
 let attempt=0,previewing=false;
 const choice=root.querySelector('#pp-sound-choice'),preview=root.querySelector('#pp-sound-preview'),checkbox=root.querySelector('#pp-sound-enabled');
 choice.replaceChildren(...choices.map(([id,label])=>{const option=document.createElement('option');option.value=id;option.textContent=label;return option;}));
 const enabled=()=>read().settings.sound!==false;
 const button=document.createElement('button');button.id='pp-sound';button.type='button';button.className='pp-icon-button';
 button.style.cssText='width:44px;height:44px;min-width:44px;min-height:44px;flex:0 0 44px;padding:10px;border:1px solid #dce3e8;border-radius:10px;background:#f7f9fb;touch-action:manipulation';
 function stop(){attempt++;previewing=false;audio.pause();audio.currentTime=0;preview.textContent='Beluisteren';preview.setAttribute('aria-label','Beluister '+selected()[1]);}
 function sync(){
  if(previewing&&(root.querySelector('#pp-settings').hidden||root.querySelector('#pp-panel-sound').hidden))stop();
  choice.value=selected()[0];checkbox.checked=enabled();preview.textContent=previewing?'Stop':'Beluisteren';preview.setAttribute('aria-label',(previewing?'Stop het voorbeeld van ':'Beluister ')+selected()[1]);
  const on=enabled(),label=on?'Geluid uitzetten':'Geluid aanzetten';button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(on));button.title=label;
  button.innerHTML='<i data-lucide="'+(on?'volume-2':'volume-x')+'" aria-hidden="true"></i>';
  globalThis.lucide?.createIcons({attrs:{width:20,height:20}});
  const target=read().settings.diceStyle==='verbs'?root.querySelector('.aw-utilities'):root.querySelector('.pp-roll-heading');
  if(target&&button.parentNode!==target)target.append(button);
 }
 function play(isPreview=false){
  if(!isPreview&&!enabled())return;stop();const current=attempt;previewing=isPreview;
  if(audio.src!==source())audio.src=source();audio.volume=selected()[0]==='original'?.62:1;sync();
  audio.play().catch(error=>{if(current===attempt&&error.name!=='AbortError'){stop();notice('Het dobbelsteengeluid kon niet starten. Probeer de luidsprekerknop.');}});
 }
 function setSound(on){settings().sound=on;settings().diceAudioRestored=true;stop();save();sync();}
 button.onclick=()=>{setSound(!enabled());if(enabled())play();};
 checkbox.onchange=()=>setSound(checkbox.checked);
 choice.onchange=()=>{stop();settings().diceSound=choice.value;save();sync();};
 preview.onclick=()=>{if(previewing)stop();else play(true);};
 audio.addEventListener('ended',()=>{previewing=false;sync();});
 root.addEventListener('click',event=>{if(event.target.closest('#pp-back,#pp-pause-button,#pp-settings-button,#db-open-maps,.aw-utilities button:not(#pp-sound)'))stop();},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
 sync();return{play,stop,sync};
}};
