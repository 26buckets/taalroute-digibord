
const STORAGE='taalroute-poc0141-settings';
const PAWN_COLORS=['#2389e8','#cf4d42','#4a8d69','#8165c7','#df9829','#269f9b','#d65d91','#426f9d','#90a83e','#9a6b45','#b85bac','#687b8b'];
const DEFAULT_NAMES=['Laila','Daan','Yusuf','Sara'];

const FAMILIES=[
 {id:'verwoorden',name:'Verwoorden',color:'#d87546',actions:['Benoemen','Beschrijven','Vertellen','Navertellen','Uitleggen','Instructies geven','Samenvatten','Presenteren']},
 {id:'gesprek',name:'In gesprek',color:'#2389d7',actions:['Begroeten','Voorstellen','Vragen','Doorvragen','Antwoorden','Reageren','De beurt nemen','Afronden']},
 {id:'kiezen',name:'Kiezen en redeneren',color:'#3f9b73',actions:['Kiezen','Vergelijken','Een mening geven','Een reden geven','Onderbouwen','Overtuigen','Weerleggen','Nuanceren']},
 {id:'regelen',name:'Samen regelen',color:'#8665b4',actions:['Hulp vragen','Een verzoek doen','Iets voorstellen','Uitnodigen','Afspreken','Onderhandelen','Oplossen','Bezwaar maken']},
 {id:'relatie',name:'Relatie en houding',color:'#bf852b',actions:['Bedanken','Excuses aanbieden','Feliciteren','Geruststellen','Begrip tonen','Advies geven','Instemmen','Weigeren']},
 {id:'doorgeven',name:'Begrijpen en doorgeven',color:'#3c8b9f',actions:['Uitleg vragen','Begrip controleren','Jezelf verbeteren','Iets anders zeggen','Doorgeven','Ideeën verbinden','Bemiddelen','Je toon aanpassen']}
];
const ROUTES=['A0 → A1','A1 → A1+','A1 → A2','A2 → B1','B1 → B2','B2 → C1','C1 → C2'];
const ROUTE_STATUS={'A0 → A1':'available','A1 → A1+':'available','A1 → A2':'available','A2 → B1':'available','B1 → B2':'concept','B2 → C1':'concept','C1 → C2':'concept'};
const SOUNDS=[{"id": "original", "label": "Origineel", "duration": 1.045, "description": "Het oorspronkelijke DigiBord rolgeluid. Helder, ritmisch en herkenbaar."}, {"id": "felt", "label": "Zacht op vilt", "duration": 1.2, "description": "Rustiger en zachter. Geschikt voor een stille lesomgeving."}, {"id": "wood", "label": "Klassiek op hout", "duration": 1.35, "description": "Een duidelijk klassiek dobbelsteengeluid met houten resonantie."}, {"id": "cup", "label": "Dobbelbeker en rollen", "duration": 1.65, "description": "Langere beweging met een hoorbare beker en uitrol."}, {"id": "board", "label": "Licht op het spelbord", "duration": 1.05, "description": "Kort en licht. Minder nadrukkelijk tijdens klassikaal gebruik."}];

const METHOD_DATA=[
 {id:'kleurrijker',name:'KleurRijker',sub:'TaalCompleet A2',status:'8 thema’s · paragrafen · opdrachten',path:['TaalCompleet A2','Thema 1 Verhuizen','1.1 Nieuwe buren']},
 {id:'vanstart',name:'Van Start',sub:'Cursus A0 tot A2',status:'blokken · lessen · lesplannen',path:['Van Start','Blok 4','Les 40']},
 {id:'fundament',name:'Taalroute Fundament',sub:'A0 tot A2',status:'thema · 10 lessen · opdrachtobjecten',path:['Fundament','Thema 1 Hallo, ik doe mee','Les 1 Welkom in de groep']},
 {id:'a0a1',name:'Taalroute A0 → A1',sub:'Nieuwe boekenlijn',status:'thema · les · opdracht',path:['A0 → A1','Thema 1','Les 1']},
 {id:'a1a2',name:'Taalroute A1 → A2',sub:'Nieuwe boekenlijn',status:'thema · les · opdracht',path:['A1 → A2','Thema 1','Les 1']},
 {id:'totaalroute',name:'Totaal Route',sub:'Methodemapping',status:'bronstructuur nog exact koppelen',path:['Totaal Route']}
];

const TASK_POOL=[
 {shape:'○',title:'Nieuwe buren',desc:'Vertel kort wie er naast je woont of kies een fictieve buurman.',family:'Verwoorden',topic:'Wonen',level:'A1 → A2',method:'kleurrijker',section:'Aanbevolen'},
 {shape:'□',title:'Kennismaken met de buurman',desc:'Vraag hoe iemand heet en stel één vervolgvraag.',family:'In gesprek',topic:'Wonen',level:'A1 → A2',method:'kleurrijker',section:'Spreken'},
 {shape:'◇',title:'Vraag om hulp in de buurt',desc:'Vraag iemand om hulp met een praktisch probleem.',family:'Samen regelen',topic:'Wonen',level:'A1 → A2',method:'kleurrijker',section:'Samen regelen'},
 {shape:'△',title:'Welke woning kies je?',desc:'Kies tussen twee woningen en geef één reden.',family:'Kiezen en redeneren',topic:'Wonen',level:'A1 → A2',method:'kleurrijker',section:'Herhaling'},
 {shape:'○',title:'Terugblik op de les',desc:'Vertel drie dingen die je vandaag hebt geoefend.',family:'Verwoorden',topic:'Dagelijks leven',level:'A1 → A2',method:'vanstart',section:'Aanbevolen'},
 {shape:'□',title:'Korte afspraak',desc:'Vraag wanneer iemand tijd heeft en bevestig de afspraak.',family:'In gesprek',topic:'Dagelijks leven',level:'A1 → A2',method:'vanstart',section:'Spreken'},
 {shape:'◇',title:'Samen iets regelen',desc:'Maak met je partner een eenvoudige afspraak.',family:'Samen regelen',topic:'Dagelijks leven',level:'A1 → A2',method:'vanstart',section:'Samen regelen'},
 {shape:'○',title:'Welkom in de groep',desc:'Begroet iemand, zeg je gekozen naam en rol en sluit af.',family:'In gesprek',topic:'Kennismaken',level:'A0 → A1',method:'fundament',section:'Aanbevolen'},
 {shape:'□',title:'Wie ben jij?',desc:'Vraag naar naam en rol. Reageer op het antwoord.',family:'In gesprek',topic:'Kennismaken',level:'A1 → A2',method:'fundament',section:'Spreken'},
 {shape:'◇',title:'Eerste contact op het werk',desc:'Stel jezelf voor en controleer een aanspreekvorm.',family:'Samen regelen',topic:'Werk',level:'A1 → A2',method:'fundament',section:'Samen regelen'},
 {shape:'△',title:'Kies veilige informatie',desc:'Kies welke informatie nodig, vrijwillig of privé is.',family:'Kiezen en redeneren',topic:'Kennismaken',level:'A1 → A2',method:'fundament',section:'Herhaling'},
 {shape:'○',title:'Mijn dag',desc:'Vertel in korte zinnen wat je vandaag doet.',family:'Verwoorden',topic:'Dagelijks leven',level:'A0 → A1',method:'a0a1',section:'Aanbevolen'},
 {shape:'□',title:'Vraag door',desc:'Stel een vraag en daarna één passende vervolgvraag.',family:'In gesprek',topic:'Dagelijks leven',level:'A1 → A2',method:'a1a2',section:'Aanbevolen'},
 {shape:'◇',title:'Afspraak veranderen',desc:'Leg uit waarom een afspraak niet lukt en stel iets anders voor.',family:'Samen regelen',topic:'Dagelijks leven',level:'A1 → A2',method:'a1a2',section:'Samen regelen'}
];

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
 savedGroups:[
  {id:'g1',name:'Maandag A2',lastUsed:'Gisteren',pawnMode:'Individueel',names:['Ali','Fatima','Omar','Sophie','Leyla','Daan','Youssef','Sara']},
  {id:'g2',name:'Dinsdag B1',lastUsed:'3 dagen geleden',pawnMode:'Groepen',names:['Nadia','Bilal','Meryem','Samir','Esra','Hamza']},
  {id:'g3',name:'Intakegroep september',lastUsed:'12 september',pawnMode:'Klassikaal',names:['Amina','Rayan','Mina','Adam','Lina']}
 ]
};
let state;
try{state={...structuredClone(defaults),...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch{state=structuredClone(defaults)}
if(!Array.isArray(state.participants))state.participants=structuredClone(defaults.participants);
if(!Array.isArray(state.savedGroups))state.savedGroups=structuredClone(defaults.savedGroups);
if(!state.didactic)state.didactic=structuredClone(defaults.didactic);

function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
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
qsa('.nav-btn').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function showPage(page){
 state.page=page;save();
 qsa('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 qsa('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===page));
 qs('.content').scrollTop=0;
 if(page==='people')renderParticipants();
 if(page==='saved')renderSaved();
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
 qs('#routeSelect').value=state.route;qs('#boardSelect').value=state.board;
 qsa('[data-workmode]').forEach(b=>b.classList.toggle('active',b.dataset.workmode===state.workMode));
 qsa('[data-pawnmode]').forEach(b=>b.classList.toggle('active',b.dataset.pawnmode===state.pawnMode));
}

/* Participants */
const swatches=qs('.swatches');swatches.innerHTML=PAWN_COLORS.map(c=>`<button class="swatch" style="--c:${c}" data-swatch="${c}"></button>`).join('');
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
    <select class="presence" data-presence="${p.id}"><option value="1" ${p.present?'selected':''}>Aanwezig</option><option value="0" ${!p.present?'selected':''}>Afwezig</option></select>
    ${groupMode?`<select class="group-select" data-group="${p.id}">${Array.from({length:state.groupCount||4},(_,g)=>`<option ${p.group===`Groep ${g+1}`?'selected':''}>Groep ${g+1}</option>`).join('')}</select>`:''}
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
   const removable=state.participants.slice(target).every((p,idx)=>p.name===`Cursist ${target+idx+1}`||/^Cursist \d+$/.test(p.name));
   if(removable)state.participants=state.participants.slice(0,target);
   else{
     const ok=confirm(`Er staan echte namen na deelnemer ${target}. Deze deelnemers worden niet verwijderd maar op afwezig gezet. Doorgaan?`);
     if(!ok)return;
     state.participants.forEach((p,i)=>{if(i>=target)p.present=false});
   }
 }
 save();renderParticipants();toast(`Les ingesteld op ${target} deelnemers.`);
}
qs('#groupCount').onchange=e=>{state.groupCount=Number(e.target.value);normalizeGroups();save();renderParticipants()};
qs('#balanceGroups').onclick=()=>{state.participants.forEach((p,i)=>p.group='Groep '+((i%state.groupCount)+1));save();renderParticipants();toast('Groepen evenwichtig verdeeld.')};
qs('#randomGroups').onclick=()=>{[...state.participants].sort(()=>Math.random()-.5).forEach((p,i)=>p.group='Groep '+((i%state.groupCount)+1));save();renderParticipants();toast('Groepen willekeurig verdeeld.')};
function normalizeGroups(){state.participants.forEach((p,i)=>{const n=Number((p.group||'').replace(/\D/g,''));if(!n||n>state.groupCount)p.group='Groep '+((i%state.groupCount)+1)})}

/* Saved groups */
function renderSaved(){
 qs('#savedGrid').innerHTML=state.savedGroups.map(g=>`<article class="saved-card">
  <div class="saved-top"><div><h3>${esc(g.name)}</h3><div class="saved-sub">${g.names.length} deelnemers · laatst gebruikt ${g.lastUsed}</div></div><span class="page-meta">${g.pawnMode}</span></div>
  <div class="name-preview">${g.names.slice(0,5).map(n=>`<span class="person-pill">${esc(n)}</span>`).join('')}${g.names.length>5?`<span class="person-pill">+${g.names.length-5}</span>`:''}</div>
  <div class="saved-actions"><button class="mini-btn primary-mini" data-usegroup="${g.id}">Gebruik groep</button><button class="mini-btn" data-viewgroup="${g.id}">${icon('eye')}Bekijken</button><button class="mini-btn" data-editgroup="${g.id}">${icon('edit')}Bewerken</button><button class="mini-btn" data-copygroup="${g.id}">${icon('copy')}Dupliceren</button></div>
 </article>`).join('');
 qsa('[data-usegroup]').forEach(b=>b.onclick=()=>useGroup(b.dataset.usegroup));
 qsa('[data-viewgroup]').forEach(b=>b.onclick=()=>viewGroup(b.dataset.viewgroup));
 qsa('[data-editgroup]').forEach(b=>b.onclick=()=>editGroup(b.dataset.editgroup));
 qsa('[data-copygroup]').forEach(b=>b.onclick=()=>copyGroup(b.dataset.copygroup));
}
function useGroup(id){const g=state.savedGroups.find(x=>x.id===id);state.participants=g.names.map((name,i)=>({id:'p'+Date.now()+i,name,present:true,group:'Groep '+((i%4)+1),color:PAWN_COLORS[i%PAWN_COLORS.length]}));save();toast(g.name+' geladen.')};
function viewGroup(id){const g=state.savedGroups.find(x=>x.id===id);alert(`${g.name}\n\n${g.names.join(', ')}`)}
function editGroup(id){const g=state.savedGroups.find(x=>x.id===id),n=prompt('Naam van de groep',g.name);if(n&&n.trim()){g.name=n.trim();save();renderSaved()}}
function copyGroup(id){const g=state.savedGroups.find(x=>x.id===id);state.savedGroups.push({...structuredClone(g),id:'g'+Date.now(),name:g.name+' kopie',lastUsed:'Nog niet'});save();renderSaved();toast('Groep gedupliceerd.')}
qs('#saveCurrentGroup').onclick=()=>{const n=prompt('Naam voor deze groep','Nieuwe groep');if(!n)return;state.savedGroups.push({id:'g'+Date.now(),name:n,lastUsed:'Nu',pawnMode:state.pawnMode==='groups'?'Groepen':state.pawnMode==='individual'?'Individueel':'Klassikaal',names:state.participants.map(p=>p.name)});save();renderSaved();toast('Huidige groep bewaard.')};

/* Tasks bank */
qsa('[data-banktab]').forEach(b=>b.onclick=()=>{state.bankTab=b.dataset.banktab;save();renderBank()});
function renderBank(){
 qsa('[data-banktab]').forEach(b=>b.classList.toggle('active',b.dataset.banktab===state.bankTab));
 qsa('[data-bankpanel]').forEach(p=>p.classList.toggle('active',p.dataset.bankpanel===state.bankTab));
 renderMethods();renderDidacticResults();renderFreeResults();
}
function renderMethods(){
 qs('#methodGrid').innerHTML=METHOD_DATA.map(m=>`<button class="method-card ${state.selectedMethod===m.id?'active':''}" data-method="${m.id}"><strong>${m.name}</strong><span>${m.sub}</span><span class="smallstatus">${m.status}</span></button>`).join('');
 qsa('[data-method]').forEach(b=>b.onclick=()=>{state.selectedMethod=b.dataset.method;save();renderMethods()});
 const m=METHOD_DATA.find(x=>x.id===state.selectedMethod)||METHOD_DATA[0];
 if(m.id==='totaalroute'){
  qs('#methodBrowser').innerHTML=`<div class="section cardish soft" style="margin-top:14px"><div class="section-body"><h3 style="font-size:14px;font-weight:600;margin:0 0 6px">Totaal Route</h3><p class="helptext">Deze methode is nog niet gekoppeld. De spelletjes zijn beschikbaar via Spelen.</p></div></div>`;
  return;
 }
 const tasks=TASK_POOL.filter(t=>t.method===m.id);
 qs('#methodBrowser').innerHTML=`<div class="method-path">${m.path.map(x=>`<span class="crumb">${x}</span>`).join('<span class="helptext">›</span>')}</div>${renderTaskGroups(tasks)}`;
 bindUseButtons();
}
function renderTaskGroups(tasks){
 if(!tasks.length)return `<div class="section cardish soft"><div class="section-body"><p class="helptext">Voor deze methode zijn nog geen leskoppelingen geladen.</p></div></div>`;
 const order=['Aanbevolen','Spreken','Samen regelen','Herhaling'];
 return `<div class="result-summary"><h3>${tasks.length} passende DigiBord opdrachten</h3><span>Alleen selectie voor deze methodeplaats</span></div><div class="task-sections">${
  order.map(sec=>{const a=tasks.filter(t=>t.section===sec);if(!a.length)return'';return `<section class="task-section"><div class="task-section-head"><strong>${sec}</strong><span>${a.length}</span></div><div class="task-list">${a.map(taskRow).join('')}</div></section>`}).join('')
 }</div>`;
}
function taskRow(t){return `<div class="task-row"><div class="task-shape">${t.shape}</div><div class="task-copy"><strong>${t.title}</strong><span>${t.desc}</span></div><div class="task-tag">${t.level}</div><button class="use-btn" data-use="${esc(t.title)}">Gebruik</button></div>`}
function bindUseButtons(){qsa('[data-use]').forEach(b=>b.onclick=()=>toast(`“${b.dataset.use}” gekoppeld aan het huidige vak.`))}
['#didFamily','#didRoute','#didWork'].forEach(id=>qs(id).onchange=renderDidacticResults);
function renderDidacticResults(){
 const fam=qs('#didFamily').value,route=qs('#didRoute').value;
 let tasks=TASK_POOL.filter(t=>(fam==='Alle families'||t.family===fam)&&t.level===route);
 if(!tasks.length)tasks=TASK_POOL.filter(t=>fam==='Alle families'||t.family===fam).slice(0,5);
 qs('#didacticResults').innerHTML=renderTaskGroups(tasks.map(t=>({...t,section:'Aanbevolen'})));
 bindUseButtons();
}
qs('#freeSearch').oninput=renderFreeResults;qs('#freeTopic').onchange=renderFreeResults;
function renderFreeResults(){
 const q=qs('#freeSearch').value.toLowerCase(),topic=qs('#freeTopic').value;
 const tasks=TASK_POOL.filter(t=>(!q||(t.title+' '+t.desc).toLowerCase().includes(q))&&(topic==='Alle onderwerpen'||t.topic===topic)).slice(0,12);
 qs('#freeResults').innerHTML=renderTaskGroups(tasks.map(t=>({...t,section:'Aanbevolen'})));
 bindUseButtons();
}

/* Didactics */
function renderDidactic(){
 const f=FAMILIES.find(x=>x.id===state.didactic.family)||FAMILIES[1];
 if(!f.actions.includes(state.didactic.action))state.didactic.action=f.actions[0];
 qs('#familyList').innerHTML=FAMILIES.map(x=>`<button class="family-btn ${x.id===f.id?'active':''}" data-family="${x.id}"><span class="family-mark" style="--family:${x.color}"></span><span class="family-icon">${icon('library')}</span><span>${x.name}</span></button>`).join('');
 qs('#actionList').innerHTML=f.actions.map(a=>`<button class="action-btn ${a===state.didactic.action?'active':''}" data-action="${esc(a)}"><span class="action-icon">${icon('library')}</span><span>${a}</span></button>`).join('');
 qsa('[data-family]').forEach(b=>b.onclick=()=>{state.didactic.family=b.dataset.family;state.didactic.action=FAMILIES.find(x=>x.id===b.dataset.family).actions[0];save();renderDidactic()});
 qsa('[data-action]').forEach(b=>b.onclick=()=>{state.didactic.action=b.dataset.action;save();renderDidactic()});
 renderDidacticDetail(f);
}
function renderDidacticDetail(f){
 const a=state.didactic.action,r=state.didactic.route;
 qs('#didacticDetail').innerHTML=`<div class="detail-kicker"><span class="family-mark" style="--family:${f.color};height:19px"></span>${f.name}</div><div class="detail-title">${a}</div><div class="detail-desc">${description(a)}</div>
 <div class="route-tabs">${ROUTES.map(x=>`<button class="route-tab ${x===r?'active':''}" data-route="${x}">${x}</button>`).join('')}</div>
 <span class="status ${ROUTE_STATUS[r]}">${ROUTE_STATUS[r]==='available'?'Beschikbaar':'Ontwerpvoorbeeld'}</span>
 <div class="detail-grid"><div class="detail-item"><div class="label">Doel</div><div class="value">${goal(a,r)}</div></div><div class="detail-item"><div class="label">Taalsteun</div><div class="value">${support(r)}</div></div><div class="detail-item"><div class="label">Voorbeeld</div><div class="value">${example(a,r)}</div></div><div class="detail-item"><div class="label">Werkvorm</div><div class="value">${workform(r)}</div></div><div class="detail-item" style="grid-column:1/-1"><div class="label">Docenttip</div><div class="value">Laat eerst zelfstandig proberen, geef één gerichte aanwijzing en laat daarna opnieuw proberen.</div></div></div>
 <div class="detail-actions"><button class="primary" id="toBank">Bekijk concrete opdrachten</button><button class="secondary" id="useAction">Gebruik op huidig vak</button></div>`;
 qsa('[data-route]').forEach(b=>b.onclick=()=>{state.didactic.route=b.dataset.route;save();renderDidacticDetail(f)});
 qs('#toBank').onclick=()=>{state.bankTab='didactic';showPage('tasks');qs('#didFamily').value=f.name;qs('#didRoute').value=['A0 → A1','A1 → A1+','A1 → A2','A2 → B1'].includes(r)?r:'A2 → B1';renderBank()};
 qs('#useAction').onclick=()=>toast(a+' gekoppeld aan het huidige vak.');
}
function description(a){return a==='Afronden'?'Sluit een gesprek passend af en bevestig waar nodig de gemaakte afspraak.':`Oefen ${a.toLowerCase()} in een betekenisvolle situatie.`}
function goal(a,r){return a==='Afronden'&&r==='A1 → A2'?'Rond een gesprek af nadat jullie een afspraak hebben gemaakt. Herhaal tijd en neem afscheid.':`${a} op een manier die past bij ${r}.`}
function support(r){return {'A0 → A1':'Voordoen, vaste korte zin en visuele steun.','A1 → A1+':'Korte zinsstarter en één vervolgvraag.','A1 → A2':'Kernwoorden en één bruikbare zinsstarter.','A2 → B1':'Gegevens blijven zichtbaar, steun wordt beperkt.','B1 → B2':'Ontwerpvoorbeeld met nuance.','B2 → C1':'Ontwerpvoorbeeld met precieze formulering.','C1 → C2':'Ontwerpvoorbeeld met hoge mate van nuance.'}[r]}
function example(a,r){return a==='Afronden'&&r==='A1 → A2'?'Dan zie ik u dinsdag om tien uur. Bedankt en tot dan.':`Voorbeeldformulering voor ${a.toLowerCase()} op ${r}.`}
function workform(r){return r==='A0 → A1'?'Klassikaal met begeleiding of tweetallen.':'Tweetallen, groepen of klassikaal met één spreker.'}

/* Sound */
let activeAudio=null,audioCtx=null;
function renderSound(){
 qs('#soundEnabled').classList.toggle('on',state.soundEnabled);
 qs('#volume').value=state.volume;qs('#volumeValue').textContent=state.volume+'%';
 qs('#soundRows').innerHTML=SOUNDS.map(s=>`<div class="sound-row ${s.id===state.diceSound?'active':''}" data-sound="${s.id}"><span class="sound-radio"></span><div class="sound-copy"><strong>${s.label}</strong><span>${s.description}</span></div><button class="listen" data-listen="${s.id}" data-tip="Beluisteren">${icon('play')}</button></div>`).join('');
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
function renderDisplay(){qs('#practiceLayout').value=['topic','level','goal','game','recent'].includes(state.practiceLayout)?state.practiceLayout:'topic';qs('#cardAnimation').value=['draw','slide','turn'].includes(state.cardAnimation)?state.cardAnimation:'draw';qs('#motionToggle').classList.toggle('on',state.reducedMotion);qs('#numbersToggle').classList.toggle('on',state.showNumbers);qs('#connectionsToggle').classList.toggle('on',state.showConnections);qsa('[data-iconstyle]').forEach(b=>b.classList.toggle('active',b.dataset.iconstyle===state.iconStyle))}

/* Backup and other */
qs('#backupDownload').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Taalroute-DigiBord-V01-5-settings.json';a.click();URL.revokeObjectURL(a.href)};
qs('#backupRestore').onchange=async e=>{if(!e.target.files[0])return;try{state={...structuredClone(defaults),...JSON.parse(await e.target.files[0].text())};save();renderAll();toast('Reservekopie hersteld.')}catch{toast('Reservekopie kon niet worden gelezen.')}};
qs('#resetSettings').onclick=()=>{if(confirm('Alle instellingen herstellen?')){state=structuredClone(defaults);save();renderAll();toast('Instellingen hersteld.')}};
qs('#finishLesson').onclick=()=>toast('Les afgerond. FINISH blijft een apart spelmoment.');
qs('#printLesson').onclick=()=>window.print();
qsa('[data-familylaunch]').forEach(b=>b.onclick=()=>toast(b.dataset.familylaunch+' geselecteerd.'));
qs('.back-btn').onclick=()=>{if(window.parent===window)window.location.href='../index.html'};

function renderAll(){renderLesson();renderParticipants();renderSaved();renderBank();renderDidactic();renderSound();renderDisplay();showPage(state.page||'people')}
renderAll();
