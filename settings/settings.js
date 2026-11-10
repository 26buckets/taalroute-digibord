
const STORAGE='taalroute-poc0141-settings';
const PAWN_COLORS=['#2389e8','#cf4d42','#4a8d69','#8165c7','#df9829','#269f9b','#d65d91','#426f9d','#90a83e','#9a6b45','#b85bac','#687b8b'];
const DEFAULT_NAMES=['Cursist 1','Cursist 2','Cursist 3','Cursist 4'];

const SOUNDS=[{"id": "original", "label": "Origineel", "duration": 1.045, "description": "Het oorspronkelijke Actief rolgeluid. Helder, ritmisch en herkenbaar."}, {"id": "felt", "label": "Zacht op vilt", "duration": 1.2, "description": "Rustiger en zachter. Geschikt voor een stille lesomgeving."}, {"id": "wood", "label": "Klassiek op hout", "duration": 1.35, "description": "Een duidelijk klassiek dobbelsteengeluid met houten resonantie."}, {"id": "cup", "label": "Dobbelbeker en rollen", "duration": 1.65, "description": "Langere beweging met een hoorbare beker en uitrol."}, {"id": "board", "label": "Licht op het spelbord", "duration": 1.05, "description": "Kort en licht. Minder nadrukkelijk tijdens klassikaal gebruik."}];

const defaults={
 page:'people',
 practiceLayout:'topic',
 participants:DEFAULT_NAMES.map((name,i)=>({id:'p'+(i+1),name,present:true,group:'Groep '+(i<4?1:2),color:PAWN_COLORS[i%PAWN_COLORS.length]})),
 workMode:'classSpeaker',
 pawnMode:'class',
 groupCount:4,
 route:'A1 → A2',
 board:'Rotterdam',
 iconStyle:'filled',
 reducedMotion:false,
 cardAnimation:'draw',
 showNumbers:false,
 showConnections:true,
 soundEnabled:true,
 diceSound:'original',
 volume:72,
 bankTab:'method',
 selectedMethod:'fundament',
 didactic:{family:'gesprek',action:'Afronden',route:'A1 → A2'},
 savedGroups:[]
};
let state,settingsReadFailed=false;
try{const stored=JSON.parse(localStorage.getItem(STORAGE)||'{}');if(!stored||typeof stored!=='object'||Array.isArray(stored)||(stored.participants!==undefined&&!Array.isArray(stored.participants))||(stored.savedGroups!==undefined&&!Array.isArray(stored.savedGroups)))throw Error();state={...structuredClone(defaults),...stored}}catch{settingsReadFailed=true;state=structuredClone(defaults)}
if(!Array.isArray(state.participants))state.participants=structuredClone(defaults.participants);
if(!Array.isArray(state.savedGroups))state.savedGroups=structuredClone(defaults.savedGroups);
if(!state.didactic)state.didactic=structuredClone(defaults.didactic);
state.sourceRoute??=state.route;state.route=DigiRoutes.label(state.route);
state.didactic.sourceRoute??=state.didactic.route;state.didactic.route=DigiRoutes.label(state.didactic.route);
for(const id of ['routeSelect'])qs('#'+id).innerHTML=DigiRoutes.routes.map(r=>`<option>${r.label}</option>`).join('');

function lessonContext(){try{return parent!==window?parent.settingsContext?.():null}catch{return null}}
function save(){if(settingsReadFailed)return false;try{localStorage.setItem(STORAGE,JSON.stringify(state));return true}catch{toast('Bewaren lukt niet. Maak ruimte vrij en probeer opnieuw.');return false}}
function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}
function toast(msg){const t=qs('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)}
function esc(s){return (globalThis.AppWording?.text(s)??String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function icon(id){return `<svg class="lucide"><use href="#i-${id}"/></svg>`}

/* Tooltips */
const tip=qs('#tooltip');
document.addEventListener('mouseover',e=>{
 const el=e.target.closest('[data-tip]');if(!el)return;
 tip.textContent=el.dataset.tip;const r=el.getBoundingClientRect();tip.style.left=(r.left+r.width/2)+'px';tip.style.top=(r.bottom+7)+'px';tip.style.transform='translate(-50%,3px)';tip.classList.add('show')
});
document.addEventListener('mouseout',e=>{if(e.target.closest('[data-tip]'))tip.classList.remove('show')});

/* Navigation */
qs('#settingsSection').onchange=e=>showPage(e.target.value);
qsa('.nav-btn').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function showPage(page){
 state.page=page;save();qs('#settingsSection').value=page;
 qsa('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 qsa('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===page));qsa('.nav-btn').forEach(b=>b.setAttribute('aria-current',b.dataset.page===page?'page':'false'));
 qs('.content').scrollTop=0;
 if(page==='people')renderParticipants();
 if(page==='saved')renderSaved();
 if(page==='print'){const facts=[['Niveau',lessonContext()?.route||state.route],['Aantal cursisten',state.participants.length],['Aanwezig',state.participants.filter(p=>p.present).length],['Bewaarde groepen',state.savedGroups.length],['Geluid',state.soundEnabled?'Aan':'Uit'],['Volume',state.volume+'%']];qs('#printFacts').innerHTML=facts.map(([name,value])=>`<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}
 if(page==='backup')qs('#undoSettingsRestore').disabled=!localStorage.getItem(RESTORE_POINT);
 if(page==='tasks')renderBank();
 if(page==='didactic')renderDidactic();
 if(page==='sound')renderSound();
}

/* Lesson */
qs('#routeSelect').onchange=e=>{state.route=e.target.value;save()}
qs('#boardSelect').onchange=e=>{state.board=e.target.value;save()}
qsa('[data-workmode]').forEach(b=>b.onclick=()=>{state.workMode=b.dataset.workmode;save();renderLesson();renderParticipants()});
qsa('[data-pawnmode]').forEach(b=>b.onclick=()=>{state.pawnMode=b.dataset.pawnmode;save();renderLesson();renderParticipants()});
function renderLesson(){
 const ctx=lessonContext();qsa('[data-familylaunch]').forEach(b=>b.disabled=!ctx);qs('#routeSelect').value=ctx?.lesson?ctx.route:state.route;qs('#routeSelect').disabled=!!ctx?.lesson;qs('#boardSelect').closest('.field').hidden=true;qs('#pawnControls').hidden=!ctx?.board;qs('#lessonSettingNote').textContent=ctx?.lesson?'Wil je op een ander niveau werken? Begin dan een nieuwe les via Les maken.':'Kies het niveau waarop je wilt spelen.';qs('#finishLesson').disabled=!ctx?.lesson;
 qsa('[data-workmode]').forEach(b=>{const on=b.dataset.workmode===state.workMode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
 qsa('[data-pawnmode]').forEach(b=>{const on=b.dataset.pawnmode===state.pawnMode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
}

/* Participants */
const swatches=qs('.swatches');swatches.innerHTML=PAWN_COLORS.map((c,i)=>`<button aria-label="Kies pionkleur ${i+1}" class="swatch" style="--c:${c}" data-swatch="${c}"></button>`).join('');
let colorTarget=null;
qsa('[data-swatch]').forEach(b=>b.onclick=()=>{const p=state.participants.find(x=>x.id===colorTarget);if(p)p.color=b.dataset.swatch;save();qs('.color-pop').classList.remove('open');renderParticipants()});
document.addEventListener('click',e=>{if(!e.target.closest('.color-pop')&&!e.target.closest('.color-btn'))qs('.color-pop').classList.remove('open')});

function groupModeActive(){return state.pawnMode==='groups'||state.workMode==='groups'}
function renderParticipants(){
 qs('#participantCount').textContent=state.participants.length;
 qs('#groupControls').classList.toggle('open',groupModeActive());
 qs('#groupCount').value=String(state.groupCount||4);
 const groupMode=groupModeActive();
 qs('#participantList').innerHTML=state.participants.map((p,i)=>`
   <div class="participant-row ${groupMode?'group-mode':''}">
    <button class="color-btn" style="--pawn:${p.color}" data-num="${i+1}" data-color="${p.id}" data-tip="Pionkleur wijzigen" aria-label="Pionkleur wijzigen"></button>
    <input class="name-input" data-name="${p.id}" value="${esc(p.name)}" aria-label="Naam deelnemer ${i+1}">
    <select class="presence" aria-label="Aanwezigheid van ${esc(p.name)}" data-presence="${p.id}"><option value="1" ${p.present?'selected':''}>Aanwezig</option><option value="0" ${!p.present?'selected':''}>Afwezig</option></select>
    ${groupMode?`<select class="group-select" aria-label="Groep van ${esc(p.name)}" data-group="${p.id}">${Array.from({length:state.groupCount||4},(_,g)=>`<option ${p.group===`Groep ${g+1}`?'selected':''}>Groep ${g+1}</option>`).join('')}</select>`:''}
    <div class="row-actions"><button class="icon-btn" data-delete="${p.id}" data-tip="Deelnemer verwijderen" aria-label="Deelnemer verwijderen">${icon('trash')}</button></div>
   </div>`).join('');
 qsa('[data-name]').forEach(i=>i.onchange=()=>{state.participants.find(x=>x.id===i.dataset.name).name=i.value;save()});
 qsa('[data-presence]').forEach(s=>s.onchange=()=>{state.participants.find(x=>x.id===s.dataset.presence).present=s.value==='1';save()});
 qsa('[data-group]').forEach(s=>s.onchange=()=>{state.participants.find(x=>x.id===s.dataset.group).group=s.value;save()});
 qsa('[data-delete]').forEach(b=>b.onclick=()=>{state.participants=state.participants.filter(x=>x.id!==b.dataset.delete);save();renderParticipants()});
 qsa('[data-color]').forEach(b=>b.onclick=e=>openColorPicker(b.dataset.color,e.currentTarget));
}
function openColorPicker(id,btn){
 colorTarget=id;const r=btn.getBoundingClientRect(),pop=qs('.color-pop');
 pop.style.left=Math.min(window.innerWidth-240,r.left)+'px';pop.style.top=Math.min(window.innerHeight-170,r.bottom+8)+'px';pop.classList.add('open')
}
function addParticipant(){
 const n=state.participants.length+1;
 state.participants.push({id:'p'+Date.now()+Math.random().toString(16).slice(2),name:'Cursist '+n,present:true,group:'Groep '+(((n-1)%Math.max(1,state.groupCount||4))+1),color:PAWN_COLORS[(n-1)%PAWN_COLORS.length]});
}
qs('#addParticipant').onclick=()=>{addParticipant();save();renderParticipants();toast('Deelnemer toegevoegd.')};
qs('#allPresent').onclick=()=>{state.participants.forEach(p=>p.present=true);save();renderParticipants();toast('Iedereen staat op aanwezig.')};
qs('#allAbsent').onclick=()=>{state.participants.forEach(p=>p.present=false);save();renderParticipants();toast('Iedereen staat op afwezig.')};
qs('#participantPreset').onchange=e=>{
 if(!e.target.value)return;
 let target=e.target.value==='custom'?Number(prompt('Hoeveel deelnemers zijn er in deze les?',state.participants.length)):Number(e.target.value);
 e.target.value=''; if(!Number.isFinite(target)||target<1||target>300)return;
 setParticipantCount(target);
};
function setParticipantCount(target){
 const current=state.participants.length;
 if(target>current){for(let i=current;i<target;i++)addParticipant()}
 else if(target<current){
   if(!confirm('De overige cursisten op afwezig zetten? Hun namen, kleuren en groepen blijven bewaard.'))return;
   state.participants.forEach((p,i)=>{if(i>=target)p.present=false});
 }
 save();renderParticipants();toast(`Les ingesteld op ${target} deelnemers.`);
}
qs('#groupCount').onchange=e=>{state.groupCount=Number(e.target.value);normalizeGroups();save();renderParticipants()};
qs('#balanceGroups').onclick=()=>{state.participants.forEach((p,i)=>p.group='Groep '+((i%state.groupCount)+1));save();renderParticipants();toast('Groepen evenwichtig verdeeld.')};
qs('#randomGroups').onclick=()=>{[...state.participants].sort(()=>Math.random()-.5).forEach((p,i)=>p.group='Groep '+((i%state.groupCount)+1));save();renderParticipants();toast('Groepen willekeurig verdeeld.')};
function normalizeGroups(){state.participants.forEach((p,i)=>{const n=Number((p.group||'').replace(/\D/g,''));if(!n||n>state.groupCount)p.group='Groep '+((i%state.groupCount)+1)})}

/* Saved groups */
function renderSaved(){
 qs('#saveCurrentGroup').innerHTML=icon('save')+(state.savedGroups.length?'Huidige groep bewaren':'Groep toevoegen');
 qs('#savedGrid').innerHTML=state.savedGroups.length?state.savedGroups.map(g=>`<article class="saved-card">
  <div class="saved-top"><div><h3>${esc(g.name)}</h3><div class="saved-sub">${g.names.length} deelnemers · laatst gebruikt ${esc(g.lastUsed||'Nog niet')}</div></div><span class="page-meta">${esc({class:'Klassikaal',groups:'Groepen',individual:'Individueel',pairs:'Duo’s'}[g.pawnMode]||g.pawnMode||'Klassikaal')}</span></div>
  <div class="name-preview">${g.names.slice(0,5).map(n=>`<span class="person-pill">${esc(n)}</span>`).join('')}${g.names.length>5?`<span class="person-pill">+${g.names.length-5}</span>`:''}</div>
  <div class="saved-actions"><button class="mini-btn primary-mini" data-usegroup="${esc(g.id)}">Gebruik groep</button><button class="mini-btn" data-viewgroup="${esc(g.id)}">${icon('eye')}Bekijken</button><button class="mini-btn" data-editgroup="${esc(g.id)}">${icon('edit')}Bewerken</button><button class="mini-btn" data-copygroup="${esc(g.id)}">${icon('copy')}Dupliceren</button></div>
 </article>`).join(''):'<p>Je hebt nog geen groepen bewaard. Kies ‘Groep toevoegen’ om je huidige cursisten samen te bewaren.</p>';
 qsa('[data-usegroup]').forEach(b=>b.onclick=()=>useGroup(b.dataset.usegroup));
 qsa('[data-viewgroup]').forEach(b=>b.onclick=()=>viewGroup(b.dataset.viewgroup));
 qsa('[data-editgroup]').forEach(b=>b.onclick=()=>editGroup(b.dataset.editgroup));
 qsa('[data-copygroup]').forEach(b=>b.onclick=()=>copyGroup(b.dataset.copygroup));
}
function groupSnapshot(name){return {id:'g'+crypto.randomUUID(),name,lastUsed:new Date().toLocaleDateString('nl-NL'),pawnMode:state.pawnMode,workMode:state.workMode,groupCount:state.groupCount,names:state.participants.map(p=>p.name),participants:structuredClone(state.participants)}}
function useGroup(id){
 const g=state.savedGroups.find(x=>x.id===id);if(!g)return;
 if(!confirm('Deze groep gebruiken? Je huidige cursisten en groepsindeling worden eerst als groep bewaard. De les en kaartpositie blijven behouden.'))return;
 const next=structuredClone(state);
 if(state.participants.length&&!state.savedGroups.some(old=>old.groupCount===state.groupCount&&old.workMode===state.workMode&&old.pawnMode===state.pawnMode&&JSON.stringify(old.participants)===JSON.stringify(state.participants)))next.savedGroups.push(groupSnapshot('Voor groepswissel · '+new Date().toLocaleString('nl-NL')));
 next.groupCount=g.groupCount||state.groupCount;
 next.pawnMode={Klassikaal:'class',Groepen:'groups',Individueel:'individual'}[g.pawnMode]||g.pawnMode||state.pawnMode;
 next.workMode=g.workMode||state.workMode;
 next.participants=g.participants?structuredClone(g.participants):g.names.map((name,i)=>({id:'p'+crypto.randomUUID(),name,present:true,group:'Groep '+(i%next.groupCount+1),color:PAWN_COLORS[i%PAWN_COLORS.length]}));
 next.savedGroups.find(x=>x.id===id).lastUsed=new Date().toLocaleDateString('nl-NL');
 if(replaceSettings(next)){renderAll();toast('Groep geladen. Je vorige groep is ook bewaard.');}
}
function viewGroup(id){const g=state.savedGroups.find(x=>x.id===id);alert(`${g.name}\n\n${g.names.join(', ')}`)}
function editGroup(id){const g=state.savedGroups.find(x=>x.id===id),n=prompt('Naam van de groep',g.name);if(n&&n.trim()){g.name=n.trim();save();renderSaved()}}
function copyGroup(id){const g=state.savedGroups.find(x=>x.id===id);state.savedGroups.push({...structuredClone(g),id:'g'+Date.now(),name:g.name+' kopie',lastUsed:'Nog niet'});save();renderSaved();toast('Groep gedupliceerd.')}
qs('#saveCurrentGroup').onclick=()=>{if(!state.participants.length)return toast('Voeg eerst cursisten toe.');const n=prompt('Naam voor deze groep','Nieuwe groep');if(!n?.trim())return;state.savedGroups.push(groupSnapshot(n.trim()));save();renderSaved();toast('Huidige groep bewaard.');};

function renderBank(){SettingsContent.render('tasks')}
function renderDidactic(){SettingsContent.render('didactic')}

/* Sound */
let activeAudio=null,audioCtx=null;
function renderSound(){
 qs('#soundEnabled').classList.toggle('on',state.soundEnabled);qs('#soundEnabled').setAttribute('aria-pressed',String(state.soundEnabled));
 qs('#volume').value=state.volume;qs('#volumeValue').textContent=state.volume+'%';
 qs('#soundRows').innerHTML=SOUNDS.map(s=>`<div class="sound-row ${s.id===state.diceSound?'active':''}" data-sound="${s.id}"><span class="sound-radio"></span><div class="sound-copy"><strong>${s.label}</strong><span>${s.description}</span></div><button class="listen" data-listen="${s.id}" aria-label="Beluister ${esc(s.label)}" data-tip="Beluisteren">${icon('play')}</button></div>`).join('');
 qsa('[data-sound]').forEach(r=>{r.tabIndex=0;r.setAttribute('role','radio');r.setAttribute('aria-checked',String(r.dataset.sound===state.diceSound));r.onkeydown=e=>{if(e.target===r&&['Enter',' '].includes(e.key)){e.preventDefault();r.click();qs('[data-sound="'+r.dataset.sound+'"]').focus()}}});
 qsa('[data-sound]').forEach(r=>r.onclick=e=>{if(e.target.closest('[data-listen]'))return;state.diceSound=r.dataset.sound;save();renderSound()});
 qsa('[data-listen]').forEach(b=>b.onclick=e=>{e.stopPropagation();previewSound(b.dataset.listen,b)});
}
qs('#soundEnabled').onclick=()=>{state.soundEnabled=!state.soundEnabled;save();renderSound()};
qs('#volume').oninput=e=>{state.volume=Number(e.target.value);qs('#volumeValue').textContent=state.volume+'%';save()};
async function previewSound(id,button){
 stopSound();if(!state.soundEnabled){toast('Geluid staat uit.');return}
 button.innerHTML=icon('pause');
 if(id==='original'){
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  await audioCtx.resume();const source=audioCtx.createBufferSource(),gain=audioCtx.createGain();source.buffer=originalDiceBuffer(audioCtx);gain.gain.value=(state.volume/100)*.62;source.connect(gain);gain.connect(audioCtx.destination);source.start();activeAudio={source,button};source.onended=()=>stopSound()
 }else{
  const file=id;const audio=new Audio('../assets/sounds/'+file+'.mp3');audio.volume=state.volume/100;activeAudio={audio,button};audio.onended=()=>stopSound();audio.play().catch(()=>toast('Geluid kon niet starten.'))
 }
}
function stopSound(){if(!activeAudio)return;try{activeAudio.audio?.pause();activeAudio.source?.stop()}catch{}if(activeAudio.button)activeAudio.button.innerHTML=icon('play');activeAudio=null}
const originalBuffers=new WeakMap();
function originalDiceBuffer(ctx){
 if(originalBuffers.has(ctx))return originalBuffers.get(ctx);
 const duration=1.045,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),samples=buffer.getChannelData(0),hits=[[.012,.80],[.066,.58],[.131,.85],[.207,.67],[.287,.73],[.386,.57],[.487,.48],[.603,.39],[.730,.29],[.855,.20],[.970,.12]];
 let seed=73241;const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1};
 hits.forEach(([when,level],hit)=>{const start=Math.floor(when*ctx.sampleRate),pitch=1+(hit%4-.8)*.085;let low=0;for(let j=0;j<Math.min(Math.ceil(.072*ctx.sampleRate),samples.length-start);j++){const t=j/ctx.sampleRate,n=noise();low+=.38*(n-low);const attack=1-Math.exp(-t/.00045),body=Math.sin(2*Math.PI*620*pitch*t)*.44+Math.sin(2*Math.PI*1280*pitch*t)*.21+Math.sin(2*Math.PI*2240*pitch*t)*.08;samples[start+j]+=level*attack*(low*.55*Math.exp(-t/.0055)+body*Math.exp(-t/.012))*1.05}});
 originalBuffers.set(ctx,buffer);return buffer
}

/* Display */
qs('#motionToggle').onclick=()=>{state.reducedMotion=!state.reducedMotion;save();renderDisplay()};
qs('#numbersToggle').onclick=()=>{state.showNumbers=!state.showNumbers;save();renderDisplay()};
qs('#connectionsToggle').onclick=()=>{state.showConnections=!state.showConnections;save();renderDisplay()};
qsa('[data-iconstyle]').forEach(b=>b.onclick=()=>{state.iconStyle=b.dataset.iconstyle;save();renderDisplay()});
qs('#cardAnimation').onchange=e=>{state.cardAnimation=e.target.value;save();renderDisplay()};
qs('#practiceLayout').onchange=e=>{state.practiceLayout=e.target.value;save()};
function renderDisplay(){qs('#practiceLayout').value=['topic','level','goal','game','recent'].includes(state.practiceLayout)?state.practiceLayout:'topic';qs('#cardAnimation').value=['draw','slide','turn'].includes(state.cardAnimation)?state.cardAnimation:'draw';qs('#motionToggle').classList.toggle('on',state.reducedMotion);qs('#numbersToggle').classList.toggle('on',state.showNumbers);qs('#connectionsToggle').classList.toggle('on',state.showConnections);qsa('[data-iconstyle]').forEach(b=>{b.classList.toggle('active',b.dataset.iconstyle===state.iconStyle);b.setAttribute('aria-pressed',String(b.dataset.iconstyle===state.iconStyle))});qsa('.toggle').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('on'))))}

/* Keep restores local to settings; lesson storage is never replaced here. */
const RESTORE_POINT=STORAGE+'-before-change';
const preferenceKeys=['practiceLayout','iconStyle','reducedMotion','cardAnimation','showNumbers','showConnections','soundEnabled','diceSound','volume'];
function replaceSettings(next){
 try{localStorage.setItem(RESTORE_POINT,localStorage.getItem(STORAGE)||JSON.stringify(state));localStorage.setItem(STORAGE,JSON.stringify(next));state=next;settingsReadFailed=false;return true}
 catch{toast('Niets vervangen: de reservekopie kon niet worden bewaard. Maak eerst ruimte vrij.');return false}
}
function readBackup(raw){
 const data=JSON.parse(raw),v=data?.format==='Actief-instellingen'?(data.version===1?data.settings:null):data;
 const text=(x,max=200)=>typeof x==='string'&&x.length<=max;
 const id=x=>text(x,100)&&/^[\w.-]+$/.test(x);
 const people=a=>Array.isArray(a)&&a.length<=300&&new Set(a.map(p=>p?.id)).size===a.length&&a.every(p=>p&&id(p.id)&&text(p.name)&&typeof p.present==='boolean'&&text(p.group,100)&&/^#[0-9a-f]{6}$/i.test(p.color));
 if(!v||!people(v.participants)||!Array.isArray(v.savedGroups)||v.savedGroups.length>1000||new Set(v.savedGroups.map(g=>g?.id)).size!==v.savedGroups.length)throw Error('Dit is geen geldige reservekopie van Actief-instellingen.');
 if(!v.savedGroups.every(g=>g&&id(g.id)&&text(g.name)&&Array.isArray(g.names)&&g.names.length<=300&&g.names.every(n=>text(n))&&(g.participants===undefined||people(g.participants))&&(g.groupCount===undefined||Number.isInteger(g.groupCount)&&g.groupCount>=2&&g.groupCount<=6)&&['class','groups','individual','pairs','Klassikaal','Groepen','Individueel'].includes(g.pawnMode)&&(g.workMode===undefined||['individual','classSpeaker','groups'].includes(g.workMode))))throw Error('De groepsgegevens zijn niet geldig.');
 const enums={practiceLayout:['topic','level','goal','game','recent'],pawnMode:['class','groups','individual','pairs'],workMode:['individual','classSpeaker','groups'],iconStyle:['line','filled'],cardAnimation:['draw','slide','turn'],diceSound:SOUNDS.map(x=>x.id)};
 for(const [k,values]of Object.entries(enums))if(v[k]!==undefined&&!values.includes(v[k]))throw Error('Ongeldige instelling: '+k);
 for(const k of ['reducedMotion','showNumbers','showConnections','soundEnabled'])if(v[k]!==undefined&&typeof v[k]!=='boolean')throw Error('Ongeldige instelling: '+k);
 if(v.volume!==undefined&&(!Number.isFinite(v.volume)||v.volume<0||v.volume>100)||v.groupCount!==undefined&&(!Number.isInteger(v.groupCount)||v.groupCount<2||v.groupCount>6))throw Error('Ongeldig volume of aantal groepen.');
 const next=structuredClone(state);for(const k of ['participants','savedGroups','groupCount','pawnMode','workMode',...preferenceKeys])if(v[k]!==undefined)next[k]=structuredClone(v[k]);
 return next;
}
qs('#backupDownload').onclick=()=>{const blob=new Blob([JSON.stringify({format:'Actief-instellingen',version:1,settings:state},null,2)],{type:'application/json'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='Actief-groepen-en-instellingen.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
qs('#backupRestore').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;const status=qs('#backupStatus');status.textContent='';try{if(file.size>2*1024*1024)throw Error('Dit bestand is te groot. Kies een instellingenbestand kleiner dan 2 MB.');const next=readBackup(await file.text());if(!confirm('Deze reservekopie bevat '+next.participants.length+' cursisten en '+next.savedGroups.length+' groepen. Wil je je groepen en voorkeuren vervangen? De huidige versie blijft herstelbaar. Je les, niveau en voortgang blijven behouden.'))return;if(replaceSettings(next)){renderAll();status.textContent='Groepen en voorkeuren hersteld. Je les blijft behouden.'}}catch(err){status.textContent=err instanceof SyntaxError?'Dit bestand is geen reservekopie van Actief. Kies een ander bestand.':err.message||'Reservekopie kon niet worden gelezen.'}};
qs('#undoSettingsRestore').onclick=()=>{const raw=localStorage.getItem(RESTORE_POINT);if(!raw)return toast('Er is nog geen vorige versie om terug te zetten.');try{const next=readBackup(raw);if(confirm('De vorige groepen en voorkeuren terugzetten? Je les blijft behouden.')&&replaceSettings(next)){renderAll();toast('Vorige groepen en voorkeuren teruggezet.')}}catch{toast('Deze vorige versie kan niet worden teruggezet. Je gegevens zijn niet veranderd.')}};
qs('#resetSettings').onclick=()=>{if(!confirm('Alleen beeld, geluid en de indeling van Les maken terugzetten? Cursisten, groepen, niveau en lesvoortgang blijven behouden.'))return;const next={...state};for(const k of preferenceKeys)next[k]=defaults[k];if(replaceSettings(next)){renderAll();toast('Voorkeuren teruggezet. Cursisten, groepen en les behouden.')}};
function settingsAction(action,family){if(window.parent===window){location.href='../index.html';return}window.parent.postMessage({type:'taalroute-settings-action',action,family},location.origin)}
qs('#finishLesson').onclick=()=>settingsAction('finish');
qs('#printLesson').onclick=()=>window.print();
qsa('[data-familylaunch]').forEach(b=>b.onclick=()=>settingsAction('family',b.dataset.familylaunch));
qs('.back-btn').onclick=()=>{if(window.parent===window)window.location.href='../index.html'};

function renderAll(){renderLesson();renderParticipants();renderSaved();renderSound();renderDisplay();showPage(state.page||'people');qsa('.toggle').forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('on')))});}
renderAll();
if(settingsReadFailed)toast('Je opgeslagen instellingen konden niet worden gelezen. Ze zijn niet overschreven. Herstel een geldige reservekopie.');
