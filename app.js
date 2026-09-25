
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const STORE='taalroute-digibord-v020', SETTINGS_STORE='taalroute-poc0141-settings';
let APP={last:null,level:'A2',boardStates:{rotterdam:{},zwolle:{}},turn:{mode:'individual',active:0},sound:true,storyCount:3};
try{APP={...APP,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
function save(){if(globalThis.DigiStorageBackupError)return;try{localStorage.setItem(STORE,JSON.stringify(APP));window.LessonUI?.checkpoint()}catch{toast('Bewaren is niet beschikbaar in deze browser.')}}
function esc(value){return (globalThis.AppWording?.text(value)??String(value??'')).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeColor(value){return /^#[0-9a-f]{3,8}$/i.test(value)?value:'#2389e8'}
function lessonText(value){return globalThis.AppWording?.text(value)??String(value??'')}
function toast(s){const t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1700)}
function settingsState(){try{return JSON.parse(localStorage.getItem(SETTINGS_STORE)||'{}')}catch{return {}}}
function participants(){
 const s=settingsState(), defs=['Laila','Daan','Yusuf','Sara'];
 return Array.isArray(s.participants)&&s.participants.length?s.participants.filter(p=>p.present!==false):defs.map((name,i)=>({id:'p'+i,name,color:['#2389e8','#cf4d42','#4a8d69','#8165c7','#df9829','#269f9b','#d65d91','#426f9d'][i]}))
}
// Five complete turns, retaining individual actions within each turn.
let undoHistory=[];
function gameIsBusy(){if(APP.last?.data?.kind==='content-dice')return contentDiceBusy;return APP.last?.type==='board'?boardBusy:APP.last?.type==='taalworp'?languageBusy:APP.last?.type==='story'?storyBusy:APP.last?.type==='card'?cardBusy:APP.last?.type==='word'?wordBusy:false}
try{undoHistory=JSON.parse(localStorage.getItem(STORE+'-undo')||'[]')}catch{}
function storeUndo(){if(globalThis.DigiStorageBackupError)return;try{localStorage.setItem(STORE+'-undo',JSON.stringify(undoHistory))}catch{}updateUndo()}
function updateUndo(){const b=$('#undoAction');if(!b)return;const step=undoHistory.at(-1)?.steps.at(-1);b.disabled=!step||gameIsBusy();b.title=step?'Terug: '+step.label:'Nog geen spelactie';b.querySelector('span').textContent='Terug';}
function rememberAction(label){
 if(!APP.last||gameIsBusy())return;
 const word=APP.last.type==='word'?{round:structuredClone(wordRound)}:null;
 const snap={label,app:structuredClone(APP),dice:structuredClone(twDiceState),mode:currentMode(),word,support:$('#cardSupport')?.classList.contains('open'),supportSection:$('#cardSupport')?.dataset.section};
 const context=APP.last.type+'-'+JSON.stringify(APP.last.data)+'-'+currentMode();
 if(!undoHistory.length||undoHistory.at(-1).closed||undoHistory.at(-1).context!==context)undoHistory.push({steps:[],context,closed:false});
 undoHistory.at(-1).steps.push(snap);undoHistory.at(-1).closed=['beurt afronden','volgende kaart','volgende ronde'].includes(label);undoHistory=undoHistory.slice(-5);storeUndo();
}
function undoLastAction(){
 if(gameIsBusy())return toast('De beweging wordt eerst afgerond.');
 const group=undoHistory.at(-1),snap=group?.steps.pop();if(!snap)return;
 if(!group.steps.length)undoHistory.pop();else group.closed=false;APP=structuredClone(snap.app);twDiceState=structuredClone(snap.dice);
 settingsPatch({pawnMode:snap.mode,route:selectedTaskRoute().label});$('#levelSelect').value=APP.level;
 resumeLast(true);
 if(snap.word){wordRound=validWZRound(snap.word.round)?structuredClone(snap.word.round):snap.word.round?.version===3&&Array.isArray(snap.word.round.selected)?structuredClone(snap.word.round):newSentenceRound();startWords(wordRound.version===4?'wz':'build')}
 if($('#cardSupport')){const box=$('#cardSupport');box.classList.toggle('open',!!snap.support);box.dataset.section=snap.supportSection||'help';$('#cardHelp')?.setAttribute('aria-expanded',!!snap.support&&box.dataset.section==='help');$('#cardExample')?.setAttribute('aria-expanded',!!snap.support&&box.dataset.section==='example')}
 save();storeUndo();toast('Hersteld: '+snap.label);
}
function rememberPrimary(){
 const type=APP.last?.type;if(type==='activity')return;if(type==='board')rememberAction($('#taskDrawer').classList.contains('open')?'beurt afronden':'worp',!$('#taskDrawer').classList.contains('open'));
 else if(type==='word')rememberAction('volgende kaart');
 else rememberAction(type==='taalworp'||type==='story'?'worp':type==='card'?'volgende kaart':'antwoord',['taalworp','story'].includes(type)||type==='card'&&APP.cardKind==='story');
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.id==='undoAction'){undoLastAction();return}
 if(b.id==='primaryGame'){if(APP.last?.type==='board'&&!$('#taxiChoice').hidden)return;rememberPrimary();return}
 const actions={taskDone:['beurt afronden',false],takeTaxi:['watertaxi',false],stayOnRoad:['hoofdweg kiezen',false],twFinish:['beurt afronden',false],storyFinish:['beurt afronden',false],drawVerb:['kaart trekken',true],cardNext:['volgende kaart',true],cardDeck:['volgende kaart',true],wordNext:['volgende ronde',true]};
 if(actions[b.id])rememberAction(...actions[b.id]);
},true);
function currentMode(){const s=settingsState();return ['class','groups','pairs','individual'].includes(s.pawnMode)?s.pawnMode:(['class','groups','pairs','individual'].includes(APP.turn.mode)?APP.turn.mode:'individual')}
function teamMode(mode){return mode==='groups'||mode==='pairs'}
function teamInfo(mode,ppl=participants()){
 if(mode==='pairs')return{count:Math.max(1,Math.ceil(ppl.length/2)),prefix:'d',label:'Duo'};
 return{count:settingsState().groupCount||4,prefix:'g',label:'Groep'};
}
function goScreen(id){
 if(globalThis.ReleasePolicy?.enabled&&['cards','dice','words','workforms','activities','collection','curriculum'].includes(id)){
  if(!globalThis.ContentUI)return;
  return ContentUI.open({engine:({cards:'CARDS',dice:'DICE',workforms:'WHEEL',activities:'WHEEL'})[id]});
 }
 stopTongueAudio();
 if(id==='cards')return startCards(APP.cardKind||'conversation');
 setBoardMenu(false);
 BoardViewport.disconnect();
 if(id==='collection')renderCollection();
 if(id==='mycollection')updateResume();
 $$('.screen').forEach(x=>x.classList.remove('active'));$('#screen-'+id)?.classList.add('active');
 $$('.navitem').forEach(n=>n.classList.toggle('active',(id==='play'||['boards','dice','cards','words','workforms','activities','game','collection'].includes(id))?n.dataset.main==='play':n.dataset.main===id));
 syncLevelSelect(id==='game'&&APP.last?.type==='card');SmoothDice.mount();
}
function home(){goScreen('play');updateResume()}
function setBoardMenu(open){
 if(open)$('#boardOptions')?.classList.remove('open');
 $('#appHeader').classList.toggle('board-menu-open',open);
 $('#boardMenuToggle').setAttribute('aria-expanded',String(open));
 $('#boardMenuToggle').textContent=open?'Sluit menu':'Menu';
}
$('#boardMenuToggle').onclick=()=>setBoardMenu($('#boardMenuToggle').getAttribute('aria-expanded')!=='true');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#boardMenuToggle').getAttribute('aria-expanded')==='true'){setBoardMenu(false);$('#boardMenuToggle').focus()}});
$('#collectionResume').onclick=()=>APP.last?resumeLast():home();
$('#collectionStorySets').onclick=()=>openCabinet('story');
$$('[data-home]').forEach(b=>b.onclick=home);$$('[data-category]').forEach(b=>b.onclick=()=>goScreen(b.dataset.category));$$('[data-open-main]').forEach(b=>b.onclick=()=>goScreen(b.dataset.openMain));$$('.navitem').forEach(b=>b.onclick=()=>goScreen(b.dataset.main==='play'?'play':b.dataset.main));

let settingsRouteAtOpen;
function openSettings(){if(globalThis.DigiStorageBackupError)return toast('Maak eerst ruimte vrij voor de reservekopie.');settingsPatch({route:CARD_ROUTES.find(r=>r.id===defaultCardRoute()).label.replace('→',' → ')});settingsRouteAtOpen=settingsState().route;const frame=$('#settingsOverlay iframe');frame.onload=()=>$('#settingsOverlay').classList.add('open');frame.src='settings/index.html'}
function closeSettings(){const selected=settingsState().route;if(selected&&selected!==settingsRouteAtOpen){const route=CARD_ROUTES.findIndex(r=>r.label.replaceAll(' ','')===selected.replaceAll(' ',''));selectLevel(['A0','A1','A1+','A2','B1','B2','C1'][route]||APP.level)}$('#settingsOverlay').classList.remove('open');if($('#screen-practice').classList.contains('active'))globalThis.ContentUI?.applyLayout();refreshCurrentGame()}
function syncFullscreen(){
 const active=!!document.fullscreenElement,button=$('#fullscreenBtn');
 button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',active?'Volledig scherm verlaten':'Volledig scherm');button.title=button.getAttribute('aria-label');
}
$('#fullscreenBtn').onclick=async e=>{
 // Pointer activation returns Space to the game; keyboard activation keeps button focus.
 if(e.detail>0)$('#fullscreenBtn').blur();
 try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}
 catch{toast('Volledig scherm is niet beschikbaar in deze browser. Gebruik de fullscreenfunctie van je browser.')}
 syncFullscreen();
};
document.addEventListener('fullscreenchange',syncFullscreen);syncFullscreen();
$('#settingsBtn').innerHTML=gameIcon('settings');$('#settingsBtn').onclick=openSettings;$$('[data-open-settings]').forEach(b=>b.onclick=openSettings);
window.addEventListener('message',e=>{if(e.source===$('#settingsOverlay iframe').contentWindow&&e.data?.type==='taalroute-close-settings'){closeSettings();toast('Instellingen bijgewerkt.')}});

function setLast(type,label,data={}){APP.last={type,label,data};save();updateResume()}
function updateResume(){
 const blocked=globalThis.ReleasePolicy?.enabled&&!ReleasePolicy.sessionAllowed(APP.contentSessionConfig);
 const message=!APP.last?'Nog geen spel gestart':blocked?'Je les is bewaard · nog niet nagekeken':APP.last.label;
 for(const id of ['resumeBtn','collectionResume']){const button=$('#'+id);button.hidden=false;button.style.display='';button.disabled=!APP.last||!!blocked;}
 $('#resumeText').textContent=message;
 $('#collectionResume').previousElementSibling.textContent=message;
}
$('#resumeBtn').onclick=()=>{if(!APP.last)return toast('Start eerst een spel.');resumeLast()};
function resumeLast(fromMemory=false){
 if(globalThis.ReleasePolicy?.enabled&&!ReleasePolicy.sessionAllowed(APP.contentSessionConfig))return toast(ReleasePolicy.message);
 if(fromMemory){if(APP.contentSessionConfig)globalThis.ContentRuntime?.restoreSession(APP.contentSessionConfig);else globalThis.ContentRuntime?.clearSession();}
 if(window.contentRestoreError&&APP.contentSessionConfig)return toast('De oorspronkelijke inhoud is niet beschikbaar. Open Mijn lessen om je opties te bekijken.');
 if(APP.contentSessionConfig&&ContentRuntime.activeSession()?.selected_game_engine)return fromMemory?ContentUI.launch(ContentRuntime.activeSession(),{resume:true}):window.LessonUI?.resumeActive();
 const l=APP.last;if(!l)return;
 if(l.type==='board')startBoard(l.data.board); if(l.type==='taalworp')startTaalworp(l.data.setIds||l.data.setId||'SET_A2_BASIS'); if(l.type==='story')startStory(l.data.collections||l.data.collection||'basis'); if(l.type==='card')startCards(l.data.kind||'conversation'); if(l.type==='word')startWords(l.data.kind||'build'); if(l.type==='activity')DigiActivities.start(l.data.kind);
}
updateResume();

const RUNTIME = window.DIGIBORD_DATA || {};
let taskBank = RUNTIME.taskBank || null;
const directBank = RUNTIME.directBank || {cards:[],shapes:[]};
let tw = (RUNTIME.taalworpManifest && RUNTIME.taalworpSets)
  ? {manifest:RUNTIME.taalworpManifest,sets:RUNTIME.taalworpSets}
  : null;
let story = RUNTIME.storydice || null;
let routeCache = {...(RUNTIME.routes || {})};
function runtimeReady(kind){
 if(kind==='board') return !!(routeCache.rotterdam && routeCache.zwolle);
 if(kind==='taalworp') return !!tw;
 if(kind==='story') return !!story;
 return true;
}


function gameIcon(name){
 const paths={sequence:'<path d="M10 6h11M10 12h11M10 18h11M3 4h1v4M3 11c0-2 3-2 3 0 0 1-3 2-3 3h3M3 17h2l-1 2c3-1 3 3-1 2"/>',sort:'<path d="M3 5h18M6 10h12M9 15h6M11 20h2"/>',memory:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',library:'<path d="M3 3v18M7 3v18M11 3v18M15 3l6 18"/>',layers:'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',tag:'<path d="M3 3h7l11 11-7 7L3 10z"/><circle cx="7" cy="7" r="1"/>',chart:'<path d="M4 20V16M10 20V11M16 20V6M22 20V2"/>',notebook:'<rect x="5" y="3" width="16" height="18" rx="2"/><path d="M3 7h4M3 12h4M3 17h4M10 7h7M10 11h7"/>',tree:'<path d="M5 3v12a4 4 0 0 0 4 4h5M5 7h9"/><rect x="14" y="4" width="7" height="6" rx="1"/><rect x="14" y="16" width="7" height="6" rx="1"/>',gauge:'<path d="M4 19a10 10 0 1 1 16 0ZM12 13l4-5"/><circle cx="12" cy="13" r="1"/>',clipboard:'<rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="2" width="6" height="5" rx="1"/><path d="M9 12h6M9 16h4"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',shuffle:'<path d="m18 2 4 4-4 4M18 14l4 4-4 4M2 18h3c6 0 8-12 14-12h3M2 6h3c2 0 3 1 4 3M15 15c1 2 2 3 4 3h3"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',play:'<path d="m8 5 12 7-12 7z"/>',save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',board:'<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>',wheel:'<circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"/>',dice:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',"verbs": "<path d=\"M13 5h8\" />\n  <path d=\"M13 12h8\" />\n  <path d=\"M13 19h8\" />\n  <path d=\"m3 17 2 2 4-4\" />\n  <path d=\"m3 7 2 2 4-4\" />", "spelling": "<path d=\"M13 21h8\" />\n  <path d=\"m15 5 4 4\" />\n  <path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" />", "puzzles": "<path d=\"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z\" />", "tongue": "<path d=\"M12 19v3\" />\n  <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" />\n  <rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\" />", "idioms": "<path d=\"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z\" />\n  <path d=\"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z\" />", "conversation": "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\" />", "mission": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <circle cx=\"12\" cy=\"12\" r=\"6\" />\n  <circle cx=\"12\" cy=\"12\" r=\"2\" />", "story": "<path d=\"M12 5v16\" />\n  <path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\" />", "bulb": "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\" />\n  <path d=\"M9 18h6\" />\n  <path d=\"M10 22h4\" />", "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" />\n  <circle cx=\"12\" cy=\"12\" r=\"3\" />", "more": "<circle cx=\"12\" cy=\"12\" r=\"1\" />\n  <circle cx=\"19\" cy=\"12\" r=\"1\" />\n  <circle cx=\"5\" cy=\"12\" r=\"1\" />", "cards": "<path d=\"M7 2h10\" />\n  <path d=\"M5 6h14\" />\n  <rect width=\"18\" height=\"12\" x=\"3\" y=\"10\" rx=\"2\" />", "people": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" />\n  <path d=\"M16 3.128a4 4 0 0 1 0 7.744\" />\n  <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" />\n  <circle cx=\"9\" cy=\"7\" r=\"4\" />", "help": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" />\n  <path d=\"M12 17h.01\" />", "rules": "<path d=\"M12 5v16\" />\n  <path d=\"M16 13h2\" />\n  <path d=\"M16 9h2\" />\n  <path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\" />\n  <path d=\"M6 13h2\" />\n  <path d=\"M6 9h2\" />", "options": "<path d=\"M10 5H3\" />\n  <path d=\"M12 19H3\" />\n  <path d=\"M14 3v4\" />\n  <path d=\"M16 17v4\" />\n  <path d=\"M21 12h-9\" />\n  <path d=\"M21 19h-5\" />\n  <path d=\"M21 5h-7\" />\n  <path d=\"M8 10v4\" />\n  <path d=\"M8 12H3\" />", "undo": "<path d=\"M9 14 4 9l5-5\" />\n  <path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\" />", "settings": "<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\" />\n  <circle cx=\"12\" cy=\"12\" r=\"3\" />", "lock": "<circle cx=\"12\" cy=\"16\" r=\"1\" />\n  <rect x=\"3\" y=\"10\" width=\"18\" height=\"12\" rx=\"2\" />\n  <path d=\"M7 10V7a5 5 0 0 1 10 0v3\" />", "unlock": "<circle cx=\"12\" cy=\"16\" r=\"1\" />\n  <rect width=\"18\" height=\"12\" x=\"3\" y=\"10\" rx=\"2\" />\n  <path d=\"M7 10V7a5 5 0 0 1 9.33-2.5\" />"};
 return `<svg class="game-icon lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
}
function pawnShape(color){const c=safeColor(color),id='pawn-shade-'+(pawnShape.serial=(pawnShape.serial||0)+1);return `<g><defs><radialGradient id="${id}" cx="30%" cy="22%" r="80%"><stop offset="0" stop-color="white" stop-opacity=".5"/><stop offset=".45" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="#082950" stop-opacity=".38"/></radialGradient></defs><ellipse cx="0" cy="2" rx="14" ry="3.5" fill="#102c45" opacity=".2"/><path d="M0-19C-8-19-13-11-13-4C-13 3 13 3 13-4C13-11 8-19 0-19Z" fill="${c}" stroke="#102c45" stroke-opacity=".3" stroke-width="1.5"/><path d="M-10-4Q0 1 10-4" fill="none" stroke="#102c45" stroke-opacity=".15" stroke-width="3"/><ellipse cy="-27" rx="9.5" ry="10" fill="${c}" stroke="#102c45" stroke-opacity=".3" stroke-width="1.5"/><path d="M0-19C-8-19-13-11-13-4C-13 3 13 3 13-4C13-11 8-19 0-19Z" fill="url(#${id})"/><ellipse cy="-27" rx="9.5" ry="10" fill="url(#${id})"/><path d="M-8-8Q-7-14-3-15" fill="none" stroke="white" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/></g>`}
function playerPawn(color){return `<svg class="player-pawn" viewBox="-17 -41 34 48" aria-hidden="true">${pawnShape(color)}</svg>`}
function cardFan(){return `<svg class="game-icon card-fan-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="15" height="21" rx="2.5" transform="rotate(-15 11.5 18.5)"/><rect x="14" y="5" width="15" height="21" rx="2.5" transform="rotate(15 21.5 15.5)"/><rect x="9" y="3" width="15" height="23" rx="2.5" fill="currentColor" fill-opacity=".22"/></svg>`}
function gameBar(primaryHtml,board=false){
 const ppl=participants(),mode=currentMode();let actorHtml='';
 if(mode==='class')actorHtml='<div class="chip active">Klassikaal</div>';
 else if(teamMode(mode)){
   const info=teamInfo(mode,ppl),teams=Array.from({length:info.count},(_,i)=>{
    if(mode==='pairs'){const names=ppl.slice(i*2,i*2+2).map(p=>p.name);return names.length?`${info.label} ${i+1} · ${names.join(' + ')}`:`${info.label} ${i+1}`}
    return `${info.label} ${i+1}`
   });
   const active=APP.turn.active%Math.max(1,teams.length),ordered=teams.slice(active).concat(teams.slice(0,active));
   actorHtml=ordered.slice(0,4).map((g,i)=>`<div class="chip ${i===0?'active':''}">${esc(g)}</div>`).join('');
 }else{
   if(APP.turn.active>=ppl.length)APP.turn.active=0;
   const ordered=ppl.slice(APP.turn.active).concat(ppl.slice(0,APP.turn.active));
   actorHtml=ordered.slice(0,4).map((p,i)=>`<div class="chip ${i===0?'active':''}">${playerPawn(p.color)}${esc(p.name)}</div>`).join('')+(ppl.length>4?`<div class="chip">+${ppl.length-4}</div>`:'');
 }
 const tongue=APP.last?.type==='card'&&APP.cardKind==='tongue';
 const undo=`<button class="game-action undo-action" id="undoAction" ${undoHistory.length?'':'disabled'} aria-label="Vorige spelactie herstellen">${gameIcon('undo')}<span>Terug</span></button>`;
 const modeSelect='<select class="mode-select" id="modeSelect" aria-label="Spelmodus"><option value="individual">Individueel</option><option value="class">Klassikaal</option><option value="groups">Groepen</option><option value="pairs">Duo\'s</option></select>';
 return `<footer class="gamebar">${board?`<div class="board-players"><div class="board-players-heading"><span>${mode==='groups'?'Groepen':mode==='pairs'?"Duo's":mode==='class'?'Samen spelen':'Spelers'}</span>${undo}</div><div class="turnzone">${actorHtml}</div></div>`:`<div class="turnzone">${modeSelect}${actorHtml}</div>`}<div class="primary-slot">${primaryHtml}</div><div class="right-actions">${board?'':undo}${tongue?'':`<button class="game-action" data-ghelp aria-label="${contentVertSession()?'Bij deze les':'Spelhulp'}" title="${contentVertSession()?'Uitleg bij deze les':'Hulp bij het spel'}">${gameIcon('help')}<span>${contentVertSession()?'Bij deze les':'Hulp'}</span></button><button class="game-action" data-grules>${gameIcon('rules')}<span>Spelregels</span></button>`}<button class="game-action" data-goptions>${gameIcon('options')}<span>${board?'Bordopties':'Opties'}</span></button></div></footer>`;
}
function bindGameBar(primaryHandler){
 const sel=$('#modeSelect');
 if(sel){
  sel.value=currentMode();
  sel.onchange=()=>{
   APP.turn.mode=sel.value;
   const st=settingsState();st.pawnMode=sel.value;
   if(!globalThis.DigiStorageBackupError)localStorage.setItem(SETTINGS_STORE,JSON.stringify(st));
   save();toast('Spelmodus gewijzigd.');
   refreshCurrentGame();
  }
 }
 $$('[data-ghelp]').forEach(b=>b.onclick=()=>{
  const session=contentVertSession();
  if(session&&globalThis.ContentGuidance)return ContentGuidance.open(session.selected_item_ids.map(id=>ContentRuntime.itemForSession(id)),'erk',b);
  openGameDialog('Spelhulp',`<p>${esc(levelInstruction())}</p><p>Lees zo nodig voor. Geef eerst ruimte voor een eigen antwoord; bekijk daarna samen het voorbeeld.</p>`);
 });
 $$('[data-grules]').forEach(b=>b.onclick=()=>openGameDialog('Spelregels',`<p>${esc(currentGameRules())}</p>`));
 $$('[data-goptions]').forEach(b=>b.onclick=()=>{
  const panel=$('#boardOptions');if(panel){setBoardMenu(false);panel.classList.toggle('open');return}
  openGameDialog('Spelopties',`<label class="option-row">Minder beweging <input id="gameMotion" type="checkbox" ${settingsState().reducedMotion?'checked':''}></label><label class="option-row">Geluid <input id="gameSound" type="checkbox" ${settingsState().soundEnabled!==false?'checked':''}></label><p>${APP.last?.type==='word'&&APP.last.data.kind==='wz'?'De moeilijkheid kies je bij het taaldoel.':'Het niveau kies je rechtsboven.'} De beschikbare sets en aantallen staan bij het spel.</p>`,()=>{$('#gameMotion').onchange=e=>settingsPatch({reducedMotion:e.target.checked});$('#gameSound').onchange=e=>settingsPatch({soundEnabled:e.target.checked})});
 });
 if(primaryHandler)$('#primaryGame')?.addEventListener('click',primaryHandler);
}
function completeTurn(){
 const mode=currentMode(),ppl=participants();
 if(mode==='individual'&&ppl.length)APP.turn.active=(APP.turn.active+1)%ppl.length;
 if(teamMode(mode)){const info=teamInfo(mode,ppl);APP.turn.active=(APP.turn.active+1)%Math.max(1,info.count)}
 save();
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
let appAudio=null,appAudioCtx=null;const appOriginalBuffers=new WeakMap();
async function playDiceSound(){
 const st=settingsState(),enabled=st.soundEnabled!==false;if(!enabled)return;
 const id=st.diceSound||'original',volume=(Number(st.volume??72))/100;
 try{
  if(appAudio){appAudio.pause?.();appAudio=null}
  if(id==='original'){
   appAudioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
   if(appAudioCtx.state!=='running')await appAudioCtx.resume();
   if(settingsState().soundEnabled===false)return;
   const source=appAudioCtx.createBufferSource(),gain=appAudioCtx.createGain();source.buffer=appOriginalDiceBuffer(appAudioCtx);gain.gain.value=volume*.62;source.connect(gain);gain.connect(appAudioCtx.destination);source.start();appAudio={pause:()=>source.stop()};
  }else{
   const a=new Audio('assets/sounds/'+id+'.mp3');a.volume=volume;appAudio=a;await a.play();
  }
 }catch(e){console.warn('sound',e)}
}
function appOriginalDiceBuffer(ctx){
 if(appOriginalBuffers.has(ctx))return appOriginalBuffers.get(ctx);
 const duration=1.045,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),samples=buffer.getChannelData(0),hits=[[.012,.80],[.066,.58],[.131,.85],[.207,.67],[.287,.73],[.386,.57],[.487,.48],[.603,.39],[.730,.29],[.855,.20],[.970,.12]];
 let seed=73241;const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1};
 hits.forEach(([when,level],hit)=>{const start=Math.floor(when*ctx.sampleRate),pitch=1+(hit%4-.8)*.085;let low=0;for(let j=0;j<Math.min(Math.ceil(.072*ctx.sampleRate),samples.length-start);j++){const t=j/ctx.sampleRate,n=noise();low+=.38*(n-low);const attack=1-Math.exp(-t/.00045),body=Math.sin(2*Math.PI*620*pitch*t)*.44+Math.sin(2*Math.PI*1280*pitch*t)*.21+Math.sin(2*Math.PI*2240*pitch*t)*.08;samples[start+j]+=level*attack*(low*.55*Math.exp(-t/.0055)+body*Math.exp(-t/.012))*1.05}});
 appOriginalBuffers.set(ctx,buffer);return buffer
}
function boardTaskMode(){return ['direct','conversation','mixed'].includes(APP.questionMode)?APP.questionMode:'direct'}
function boardTaskCards(){return boardTaskMode()==='direct'?directBank.cards:boardTaskMode()==='mixed'?[...taskBank.cards,...directBank.cards]:taskBank.cards}
function contentVertSession(){return window.ContentRuntime?.activeSession?.()||null}
function contentVertHistory(engine,session){APP.contentVert001Used??={};const key=session.session_id+':'+engine;APP.contentVert001Used[key]??=[];return APP.contentVert001Used[key]}
function contentSessionLabel(session,item,includeLevel=true){
 const topic=session?.topic||item?.topic||'GRAMMATICA',level=session?.cefr_level||item?.cefr_level||APP.level;
 const label=window.DIGIBORD_CONTENT_CATALOG?.families.flatMap(f=>f.topics).find(t=>t.id===topic)?.label||topic;
 return (topic==='MODAAL'?'Modale werkwoorden':(session?.content_family==='grammar'?'Grammatica ':'')+label)+(includeLevel?' · '+level:'');
}
function contentBoardTask(item){
 const session=contentVertSession(),projection=ContentRuntime.project('BOARD',item),choices=item.options.length?'Keuzes: '+item.options.join(' · '):item.context||'Geef een passend antwoord.',label=contentSessionLabel(session,item);
 return {id:item.content_item_id,contentItemId:item.content_item_id,routeId:selectedTaskRoute().id,shape:'circle',title:label,instruction:projection.prompt,input:choices,support:item.feedback_incorrect,model:item.model_answer,criterion:item.learning_goal,partner:projection.answerPolicy.modelIsExample?'Luister naar het antwoord. Een andere natuurlijke formulering kan ook goed zijn.':'Controleer samen de grammaticale vorm.',retry:'Probeer opnieuw met een andere passende formulering.',teacher:item.explanation,exerciseMode:item.domain==='QUICK'&&item.exercise_type!=='snelvraag'?'conversation':'direct',definition:item.learning_goal,answerPolicy:projection.answerPolicy}
}
function nextContentBoardTask(){
 const session=contentVertSession();if(!session)return null;const used=contentVertHistory('BOARD',session),pool=ContentRuntime.enginePool('BOARD',session);if(pool.every(i=>used.includes(i.content_item_id)))used.length=0;const item=ContentRuntime.nextItem('BOARD',session,used);if(!item)return null;used.push(item.content_item_id);save();return contentBoardTask(item)
}
function routeTask(pos,route){
 const contentTask=nextContentBoardTask();if(contentTask)return contentTask;
 if(!taskBank)return {shape:'circle',title:'Vertel',instruction:'Vertel iets over deze situatie.',input:'Gebruik taal die bij je niveau past.',support:'Begin met één korte zin.',model:'Ik ben hier vandaag.'};
 const r=selectedTaskRoute();
 const wanted=route?.nodes?.[pos]?.shape;
 let cards=boardTaskCards().filter(c=>c.routeId===r.id&&(wanted?c.shape===wanted:true));
 if(!cards.length)cards=boardTaskCards().filter(c=>c.routeId===r.id);
 // ponytail: shared classroom history; use per-group histories if separate classes share this browser.
 const key=r.id+'/'+(wanted||'all')+'/'+boardTaskMode();
 APP.boardTaskUsed??={};
 const used=Array.isArray(APP.boardTaskUsed[key])?APP.boardTaskUsed[key]:[];
 let fresh=cards.filter(c=>!used.includes(c.id));
 if(!fresh.length){fresh=cards;APP.boardTaskUsed[key]=[]}
 const card=fresh[Math.floor(Math.random()*fresh.length)];
 APP.boardTaskUsed[key]=[...(APP.boardTaskUsed[key]||[]),card.id];
 return {...card}
}
function shapeMeta(shape){return (taskBank?.shapes||[]).find(x=>x.id===shape)||{symbol:'○',task:'Vertel',color:'#176b9a'}}

/* Speelborden */
$$('[data-board]').forEach(b=>b.onclick=()=>startBoard(b.dataset.board));
async function getRoute(id){return routeCache[id] || null}
function settingsPatch(patch){const s=settingsState();if(globalThis.DigiStorageBackupError)return s;Object.assign(s,patch);localStorage.setItem(SETTINGS_STORE,JSON.stringify(s));const board=$('.board-game');if(board){board.dataset.reducedMotion=String(!!s.reducedMotion);board.dataset.dark=String(!!s.boardDark)}if(patch.soundEnabled===false){appAudio?.pause?.();appAudio=null}return s}
function boardState(board,route){
 const ppl=participants(),s=APP.boardStates[board]||{};
 s.positions??={};s.finished??={};s.groupPositions??={};s.groupFinished??={};s.round??=1;
 ppl.forEach(p=>{if(s.positions[p.id]==null)s.positions[p.id]=0});
 s.classPos??=0;APP.boardStates[board]=s;return s
}
function diceFaceHtml(n){
 const map={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
 return Array.from({length:9},(_,i)=>`<span class="pip ${map[n]?.includes(i+1)?'on':''}"></span>`).join('')
}
function boardActors(board){
 const s=APP.boardStates[board],ppl=participants(),mode=currentMode();
 if(mode==='class')return[{id:'class',name:'Klassikaal',color:'#0b87f3',pos:s.classPos||0,finished:false}];
 if(teamMode(mode)){
   const info=teamInfo(mode,ppl),colors=['#2389e8','#cf4d42','#4a8d69','#8165c7','#df9829','#269f9b'];
   return Array.from({length:info.count},(_,i)=>{const id=info.prefix+(i+1);if(s.groupPositions[id]==null)s.groupPositions[id]=0;return{id,name:info.label+' '+(i+1),color:colors[i%colors.length],pos:s.groupPositions[id],finished:!!s.groupFinished[id]}})
 }
 return ppl.map(p=>({id:p.id,name:p.name,color:p.color||'#2389e8',pos:s.positions[p.id]||0,finished:!!s.finished[p.id]}))
}
function boardActiveActor(board){
 const s=APP.boardStates[board],mode=currentMode(),ppl=participants();
 if(mode==='class')return{id:'class',name:'Klassikaal',pos:s.classPos||0};
 if(teamMode(mode)){
  const info=teamInfo(mode,ppl);
  for(let step=0;step<info.count;step++){const idx=(APP.turn.active+step)%info.count,id=info.prefix+(idx+1);if(!s.groupFinished[id]){APP.turn.active=idx;return{id,name:info.label+' '+(idx+1),pos:s.groupPositions[id]||0}}}
  const first=info.prefix+'1';return{id:first,name:info.label+' 1',pos:s.groupPositions[first]||0}
 }
 if(!ppl.length)return null;
 for(let step=0;step<ppl.length;step++){const idx=(APP.turn.active+step)%ppl.length,p=ppl[idx];if(!s.finished[p.id]){APP.turn.active=idx;return{id:p.id,name:p.name,pos:s.positions[p.id]||0}}}
 return{id:ppl[0].id,name:ppl[0].name,pos:s.positions[ppl[0].id]||0}
}
function boardRouteSvg(board,route){
 const numbers=settingsState().showNumbers!==false;
 if(route.overlayMode==='painted')return route.nodes.map(n=>`<text class="painted-number" x="${n.x}" y="${n.y}" ${numbers&&n.showNumber!==false?'':'visibility="hidden"'}>${n.id}</text>`).join('');
 return route.nodes.map(n=>`<g transform="translate(${n.x} ${n.y})"><circle r="15" fill="${shapeMeta(n.shape).color}" stroke="white" stroke-width="2"/><text class="painted-number" y="1">${numbers?n.id:shapeMeta(n.shape).symbol}</text></g>`).join('');
}
function boardOcclusionSvg(route,img){
 const masks=route.occlusionPolygons||[];
 return `<defs>${masks.map((o,i)=>`<clipPath id="occ${i}"><polygon points="${o.points.map(p=>p.join(',')).join(' ')}"/></clipPath>`).join('')}</defs><g class="bridge-front">${masks.map((o,i)=>`<image href="${img}" width="${route.sourceWidth}" height="${route.sourceHeight}" preserveAspectRatio="xMidYMid meet" clip-path="url(#occ${i})"/>`).join('')}</g>`;
}
function diePips(n){
 const points={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
 return `<span class="die-pips">${Array.from({length:9},(_,i)=>`<i class="${points[n]?.includes(i)?'pip':''}"></i>`).join('')}</span>`;
}
function softDie({color='#fffefa',word='',image='',value=null,words=[],images=[],topIcon='',front=true}={}){
 if(typeof SmoothDice!=='undefined')return SmoothDice.markup({color,word,image,value,words,images,topIcon,front});
 const top=[1,2,3,4,5,6].find(n=>n!==value&&n!==7-value),side=[1,2,3,4,5,6].find(n=>![value,7-value,top,7-top].includes(n));
 const values=[value,side,7-value,7-side,top,7-top];
 const labels=[word,...words.filter(x=>x!==word)],pictures=[image,...images.filter(x=>x!==image)];
 return `<span class="die-scene" style="--die-color:${safeColor(color)};--die-ink:${color==='#fffefa'?'#21384c':'#fff'}" aria-hidden="true"><span class="die-cube"><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0.08),calc(var(--die-edge)*0),calc(var(--die-edge)*-0.42)) matrix3d(1,0,0,0,0,0.7071068,-0.7071068,0,-0,0.7071068,0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0.08),calc(var(--die-edge)*0),calc(var(--die-edge)*0.42)) matrix3d(1,0,0,0,-0,0.7071068,0.7071068,0,0,-0.7071068,0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0.08),calc(var(--die-edge)*1),calc(var(--die-edge)*-0.42)) matrix3d(1,0,0,0,0,-0.7071068,-0.7071068,0,0,0.7071068,-0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0.08),calc(var(--die-edge)*1),calc(var(--die-edge)*0.42)) matrix3d(1,0,0,0,0,-0.7071068,0.7071068,0,0,-0.7071068,-0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.08),calc(var(--die-edge)*-0.42)) matrix3d(0,1,0,0,0.7071068,0,-0.7071068,0,-0.7071068,0,-0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.08),calc(var(--die-edge)*0.42)) matrix3d(0,1,0,0,0.7071068,-0,0.7071068,0,0.7071068,0,-0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.08),calc(var(--die-edge)*-0.42)) matrix3d(0,1,0,0,-0.7071068,0,-0.7071068,0,-0.7071068,0,0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.08),calc(var(--die-edge)*0.42)) matrix3d(0,1,0,0,-0.7071068,0,0.7071068,0,0.7071068,-0,0.7071068,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.08),calc(var(--die-edge)*-0.42)) matrix3d(0,0,1,0,0.7071068,-0.7071068,0,0,0.7071068,0.7071068,-0,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.92),calc(var(--die-edge)*-0.42)) matrix3d(0,0,1,0,0.7071068,0.7071068,-0,0,-0.7071068,0.7071068,0,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.08),calc(var(--die-edge)*-0.42)) matrix3d(0,0,1,0,-0.7071068,-0.7071068,0,0,0.7071068,-0.7071068,0,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,84% 0%,84% 11.3137085%,0% 11.3137085%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.92),calc(var(--die-edge)*-0.42)) matrix3d(0,0,1,0,-0.7071068,0.7071068,0,0,-0.7071068,-0.7071068,0,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.08),calc(var(--die-edge)*-0.42)) matrix3d(0.7071068,-0.7071068,0,0,0.4082483,0.4082483,-0.8164966,0,0.5773503,0.5773503,0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.08),calc(var(--die-edge)*0.42)) matrix3d(0.7071068,-0.7071068,0,0,0.4082483,0.4082483,0.8164966,0,-0.5773503,-0.5773503,0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.92),calc(var(--die-edge)*-0.42)) matrix3d(0.7071068,0.7071068,0,0,0.4082483,-0.4082483,-0.8164966,0,-0.5773503,0.5773503,-0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*0),calc(var(--die-edge)*0.92),calc(var(--die-edge)*0.42)) matrix3d(0.7071068,0.7071068,0,0,0.4082483,-0.4082483,0.8164966,0,0.5773503,-0.5773503,-0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.08),calc(var(--die-edge)*-0.42)) matrix3d(-0.7071068,-0.7071068,0,0,-0.4082483,0.4082483,-0.8164966,0,0.5773503,-0.5773503,-0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.08),calc(var(--die-edge)*0.42)) matrix3d(-0.7071068,-0.7071068,0,0,-0.4082483,0.4082483,0.8164966,0,-0.5773503,0.5773503,-0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),white 20%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.92),calc(var(--die-edge)*-0.42)) matrix3d(-0.7071068,0.7071068,0,0,-0.4082483,-0.4082483,-0.8164966,0,-0.5773503,-0.5773503,0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i><i class="die-bevel" style="clip-path:polygon(0% 0%,11.3137085% 0%,5.6568542% 9.797959%);transform:translate3d(calc(var(--die-edge)*1),calc(var(--die-edge)*0.92),calc(var(--die-edge)*0.42)) matrix3d(-0.7071068,0.7071068,0,0,-0.4082483,-0.4082483,0.8164966,0,0.5773503,0.5773503,0.5773503,0,0,0,0,1);background:color-mix(in srgb,var(--die-color),black 10%)"></i>${Array.from({length:6},(_,i)=>`<span class="die-face die-face-${i}">${value?diePips(values[i]):i===4&&topIcon?topIcon:image?`<img src="${esc(pictures[i%pictures.length])}" alt="">`:`<span class="die-word ${(labels[i%labels.length]||'').length>7?'long-word':''}">${esc(labels[i%labels.length])}</span>`}</span>`).join('')}</span></span>`;
}
function cardBack(title='Kaarten',family=''){return `<img class="card-brand" src="assets/brand/taalroute-white.svg" alt="Taalroute"><span class="card-set-title">${esc(title)}</span>${family?`<span class="card-family">${esc(family)}</span>`:''}`}
function physicalDie(n=5){return `<div class="dice-cradle"><div class="dice-float"><div id="moveDie" class="physical-die sculpted-board-die" aria-label="Dobbelsteen ${n}">${softDie({value:n,front:false})}</div></div></div>`}
function boardOptionInfo(label,description){
 return `<span class="context-tool board-info" data-tip-label="${esc(label)}" data-tip="${esc(description)}"><button type="button" aria-label="Uitleg: ${esc(label)}"><span aria-hidden="true">ⓘ</span></button></span>`;
}
function boardOptionTitle(id,label,description){return `<span class="board-option-title"><label for="${id}">${label}</label>${boardOptionInfo(label,description)}</span>`}
function startBoard(board){
 if(globalThis.ReleasePolicy?.enabled&&!ContentRuntime.activeSession())return ContentUI.open({engine:'BOARD',variant:board});
 const route=routeCache[board];if(!route)return toast('Dit bord is niet beschikbaar.');
 const img=route.sourceAsset||`assets/boards/${board}.png`,s=boardState(board,route);boardBusy=false;
 boardActiveActor(board);setLast('board',`${route.label||board[0].toUpperCase()+board.slice(1)} · Speelbord`,{board});
 const taxi=route.alternativeRoutes?.[0];
 $('#gameMount').innerHTML=`<div class="game-shell board-game" data-dark="${!!settingsState().boardDark}" data-board-fit="${settingsState().boardFit==='adaptive'?'adaptive':'fixed'}" data-reduced-motion="${!!settingsState().reducedMotion}" data-footer="${settingsState().boardFooter==='red'?'red':'blue'}"><div class="game-work"><div class="board-view" id="boardView">
 <div id="boardViewport"><svg id="boardMap" viewBox="0 0 1920 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Speelbord ${board}, ${route.nodes.length} posities"><g id="boardLayers"><image id="boardBackground" href="${img}" width="${route.sourceWidth}" height="${route.sourceHeight}" preserveAspectRatio="xMidYMid meet"/><g id="boardRoute">${boardRouteSvg(board,route)}</g><ellipse id="activeFieldMarker" rx="20" ry="8"/><g id="pawnLayer"></g>${taxi?'<g id="boardTaxi"><image href="assets/boards/watertaxi.png" x="-45" y="-43" width="90" height="60"/></g>':''}${boardOcclusionSvg(route,img)}</g></svg></div>
 <div class="board-hud"><strong>${esc(route.label||board[0].toUpperCase()+board.slice(1))}</strong><span>Ronde <b id="roundValue">${s.round}</b></span><span id="boardStatus">Spatie om te gooien</span></div>
 <aside class="board-options" id="boardOptions"><div class="board-options-head"><strong>Bordopties</strong><button id="closeBoardOptions" aria-label="Sluit bordopties">×</button></div>
 <div class="board-option-row board-exercise-choice">${boardOptionTitle('questionMode','Oefening',`Snelvragen: geef zelf antwoord op een korte vraag. Met gesprekspartner: voer samen een gesprek. Mix: beide soorten door elkaar. Voor het gekozen niveau zijn ${directBank.cards.filter(c=>c.routeId===selectedTaskRoute().id).length} snelvragen beschikbaar; de aangesloten snelvraagbank bevat ${directBank.cards.length} vragen in totaal.`)}<select class="mode-select" id="questionMode"><option value="direct">Snelvragen</option><option value="conversation">Met gesprekspartner</option><option value="mixed">Mix van beide</option></select></div>
 <div class="board-option-row">${boardOptionTitle('modeSelect','Speelmodus','Klassikaal: de hele klas speelt met één pion. Individueel: iedere deelnemer heeft een eigen pion en beurt. Duo’s: telkens twee deelnemers spelen samen. Groepen: iedere groep speelt met één pion. Deelnemers en groepen stel je in via Menu → Instellingen.')}<select class="mode-select" id="modeSelect"><option value="individual">Individueel</option><option value="class">Klassikaal</option><option value="groups">Groepen</option><option value="pairs">Duo's</option></select></div>
 <div class="board-option-row"><button class="smallbtn" id="nextBoardTask">Andere opdracht</button>${boardOptionInfo('Andere opdracht','Toon een andere opdracht voor het huidige vak, niveau en de gekozen oefening. De pion blijft staan.')}</div>
 <fieldset class="footer-choices"><legend>Bordweergave</legend>${[['fixed','Groot houden','Het bord blijft groot als je een opdracht of de bordopties opent. Het paneel kan een deel van het bord bedekken.'],['adaptive','Alles zichtbaar','Het bord wordt kleiner als je een opdracht of de bordopties opent. Zo blijven het hele bord en het paneel naast elkaar zichtbaar.']].map(([value,label,tip])=>`<div class="board-choice-row"><label class="footer-choice"><input type="radio" name="boardFit" value="${value}" ${(settingsState().boardFit==='adaptive'?'adaptive':'fixed')===value?'checked':''}><span>${label}</span></label>${boardOptionInfo(label,tip)}</div>`).join('')}</fieldset>
 <fieldset class="footer-choices"><legend>Gooiknop ${boardOptionInfo('Gooiknop','Kies de blauwe knop met dobbelsteen of de rode ronde knop. Beide gebruiken dezelfde worpen en spelregels.')}</legend>${[['blue','Blauw · dobbelsteen'],['red','Rood · ronde knop']].map(([value,label])=>`<label class="footer-choice"><input type="radio" name="boardFooter" value="${value}" ${(settingsState().boardFooter==='red'?'red':'blue')===value?'checked':''}><span class="footer-swatch ${value}" aria-hidden="true">⚄</span><span>${label}</span></label>`).join('')}</fieldset>
 <div class="board-option-row">${boardOptionTitle('optNumbers','Vaknummers','Toon of verberg de nummers van de vakken op het speelbord. De route en de opdrachten blijven hetzelfde.')}<input type="checkbox" id="optNumbers" ${settingsState().showNumbers!==false?'checked':''}></div>
 ${taxi?`<div class="board-option-row">${boardOptionTitle('optConnections','Watertaxi','Bied bij de steiger de keuze om de watertaxi als kortere route te nemen. Zet dit uit om alleen de hoofdweg te gebruiken.')}<input type="checkbox" id="optConnections" ${settingsState().showConnections!==false?'checked':''}></div>`:''}
 <div class="board-option-row">${boardOptionTitle('optMotion','Minder beweging','Beperk de animaties van de dobbelsteen en pionnen. De worp en de spelregels blijven hetzelfde.')}<input type="checkbox" id="optMotion" ${settingsState().reducedMotion?'checked':''}></div>
 <div class="board-option-row">${boardOptionTitle('optSound','Geluid','Zet de geluidseffecten van het spel aan of uit. Het gekozen geluid en het volume stel je in via Menu → Instellingen → Geluid.')}<input type="checkbox" id="optSound" ${settingsState().soundEnabled!==false?'checked':''}></div>
 <div class="board-option-row">${boardOptionTitle('optDark','Donkere modus','Maak de achtergrond, knoppen en tekstpanelen rond het speelbord donkerder. De kleuren van de bordafbeelding blijven behouden.')}<input type="checkbox" id="optDark" ${settingsState().boardDark?'checked':''}></div>
 <div class="board-option-row">${boardOptionTitle('fixedRoll','Bepaal de worp','Willekeurig: de dobbelsteen kiest een getal van 1 tot en met 6. Kies een vast getal om elke keer dat aantal stappen te zetten, bijvoorbeeld voor een demonstratie.')}<select id="fixedRoll"><option value="0">Willekeurig</option>${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join('')}</select></div>
 <div class="board-option-row"><button class="smallbtn" id="newQuickBoard">Nieuwe Snelvragenles</button></div>
 <div class="board-option-row"><button class="smallbtn" id="restartBoard">Opnieuw beginnen</button>${boardOptionInfo('Opnieuw beginnen',!contentVertSession()&&boardTaskMode()==='direct'?'Stel een nieuwe Snelvragenles samen. Je huidige spel blijft bewaard totdat je de nieuwe les start.':'Zet alle pionnen op dit bord terug naar de start. Je krijgt eerst een bevestigingsvraag.')}</div></aside>
 <div class="taxi-choice" id="taxiChoice" hidden><strong>Neem je de watertaxi?</strong><p>${taxi?`Wandel naar de steiger en vaar door naar vak ${taxi.toPosition}.`:''}</p><button class="primary" id="takeTaxi">Neem de watertaxi</button><button class="smallbtn" id="stayOnRoad">Blijf op de hoofdweg</button></div>
 <div class="task-drawer" id="taskDrawer"><div><div class="task-meta" id="taskMeta"></div><h2 id="taskTitle"></h2><div id="taskInput"></div><div id="contentBoardActions" hidden><button class="smallbtn" id="contentBoardAnswer">Bekijk een mogelijk antwoord</button><button class="smallbtn" id="contentBoardNext">Andere opdracht</button></div>${contextTools('task')}</div><button class="donebtn" id="taskDone">Verder en gooien · spatie</button></div>
 </div></div>${gameBar(`<div class="board-dice-control">${physicalDie(s.lastRoll||5)}<button class="primary" id="primaryGame" title="Gooien · spatie">GOOIEN</button></div>`,true)}</div>`;
 goScreen('game');BoardViewport.connect($('#boardView'),route);bindGameBar(()=>boardAction(board,route));renderBoardPawns(board,route);setTaxiPoint(route,s.taxiArrived);
 $('#taskDone').onclick=()=>boardAction(board,route);
 for(const [id,key] of [['Help','support'],['Example','model'],['Goals','goals'],['Partner','partner'],['More','more']])$('#task'+id).onclick=()=>showBoardSupport(key);
 $('#closeBoardOptions').onclick=()=>$('#boardOptions').classList.remove('open');
 $('#questionMode').value=boardTaskMode();$('#questionMode').onchange=e=>{if(boardBusy||!$('#taxiChoice').hidden){e.target.value=boardTaskMode();return}rememberAction('oefening kiezen');APP.questionMode=e.target.value;if(s.pending)delete s.pending.task;save();startBoard(board)};
 $('#contentBoardAnswer').onclick=()=>showBoardSupport('model');
 $('#contentBoardNext').onclick=$('#nextBoardTask').onclick=()=>{if(boardBusy||!$('#taxiChoice').hidden)return;rememberAction('andere opdracht');if(s.pending)delete s.pending.task;showBoardTask(board,route);$('#boardOptions').classList.remove('open')};
 $$('[name=boardFooter]').forEach(input=>input.onchange=()=>{settingsPatch({boardFooter:input.value});$('.board-game').dataset.footer=input.value});
 $$('[name=boardFit]').forEach(input=>input.onchange=()=>{settingsPatch({boardFit:input.value});$('.board-game').dataset.boardFit=input.value});
 $('#optNumbers').onchange=e=>{settingsPatch({showNumbers:e.target.checked});$('#boardRoute').innerHTML=boardRouteSvg(board,route)};
 $('#optConnections')?.addEventListener('change',e=>settingsPatch({showConnections:e.target.checked}));
 $('#optMotion').onchange=e=>settingsPatch({reducedMotion:e.target.checked});
 $('#optSound').onchange=e=>settingsPatch({soundEnabled:e.target.checked});
 $('#optDark').onchange=e=>settingsPatch({boardDark:e.target.checked});
 $('#fixedRoll').value=String(APP.fixedRoll||0);$('#fixedRoll').onchange=e=>{APP.fixedRoll=Number(e.target.value);save()};
 $('#newQuickBoard').onclick=()=>{if(!boardBusy&&$('#taxiChoice').hidden)ContentUI.openQuickBoard(board)};
 $('#restartBoard').onclick=()=>{if(!contentVertSession()&&boardTaskMode()==='direct')return ContentUI.openQuickBoard(board);return openGameDialog('Opnieuw beginnen',`<p>Alle pionnen op dit bord gaan terug naar het eerste vak.</p><button class="primary" id="confirmRestart">Begin opnieuw</button>`,()=>{$('#confirmRestart').onclick=()=>{APP.boardStates[board]={};APP.turn.active=0;save();$('#gameDialog').close();startBoard(board)}})};
 $('#stayOnRoad').onclick=()=>resolveTaxi(board,route,false);$('#takeTaxi').onclick=()=>resolveTaxi(board,route,true);
 const actor=boardActiveActor(board);
 if(s.pending?.mode===currentMode()&&s.pending.actorId===actor?.id){if(s.pending.choice)$('#taxiChoice').hidden=false;else showBoardTask(board,route)}
}
function coverPoint(route,node){return{x:node.x,y:node.y}}
function renderBoardPawns(board,route,override){
 const layer=$('#pawnLayer');if(!layer)return;
 const actors=boardActors(board),active=boardActiveActor(board),groups={};
 actors.forEach(a=>(groups[a.pos]??=[]).push(a));
 layer.innerHTML=Object.values(groups).flatMap(arr=>arr.map((a,j)=>{
  const at=override&&a.id===active?.id?override:route.nodes[Math.min(route.finishPosition,a.pos)];
  const offset=override&&a.id===active?.id?0:(j-(arr.length-1)/2)*9;
  const scale=.58+.5*at.y/route.sourceHeight;
  return `<g data-actor="${esc(a.id)}" class="map-pawn ${a.id===active?.id?'active':''}" transform="translate(${at.x+offset} ${at.y}) scale(${scale})" ${(override?.onWater||override?.underground)&&a.id===active?.id?'visibility="hidden"':''}><title>${esc(a.name)}, vak ${a.pos}</title>${pawnShape(a.color)}</g>`;
 })).join('');
 if(active){const at=override||route.nodes[Math.min(route.finishPosition,active.pos)];$('#activeFieldMarker').setAttribute('cx',at.x);$('#activeFieldMarker').setAttribute('cy',at.y);$('#activeFieldMarker').style.visibility=override?.onWater||override?.underground?'hidden':'visible'}
 if($('#roundValue'))$('#roundValue').textContent=APP.boardStates[board].round;
}
function setTaxiPoint(route,arrived=false,point){
 const el=$('#boardTaxi'),trip=route.alternativeRoutes?.[0];if(!el||!trip)return;
 const ps=trip.segments.find(s=>s.mode==='boat').points,p=point||(arrived?ps.at(-1):ps[0]);el.setAttribute('transform',`translate(${p[0]} ${p[1]})`);
}
let boardBusy=false;
function boardAction(board,route){
 if(boardBusy||!$('#taxiChoice').hidden)return;
 if($('#taskDrawer').classList.contains('open')){
  const s=APP.boardStates[board];delete s.pending;completeBoardTurn(board,route);startBoard(board);
 }
 return rollBoard(board,route);
}
function showBoardSupport(key){
 const task=APP.boardStates[APP.last.data.board].pending.task;
 if(key==='model'&&task.contentItemId){const item=ContentRuntime.itemForSession(task.contentItemId);return openGameDialog(contentAnswerLabel(item),`<div class="content-support">${contentAnswerText(item,ContentRuntime.answerPolicy(item))}</div>`)}
 const sections={support:[['Hulp',task.support]],model:[['Mogelijk voorbeeld',task.model],['Waar let je op?',task.criterion]],goals:[['Doel',task.definition||task.instruction],['Waar let je op?',task.criterion],['Rollen',task.exerciseMode==='direct'?'De voorlezer stelt de vraag; de cursist geeft een eigen antwoord.':'De speler voert de opdracht uit; de gesprekspartner luistert en reageert.']],partner:[[task.exerciseMode==='direct'?'Voor de voorlezer':'Voor de gesprekspartner',task.partner]],more:[['Nog een keer',task.retry],['Voor de docent',task.teacher]]}[key];
 openGameDialog({support:'Hulp bij deze opdracht',model:task.model?'Mogelijk voorbeeld':'Bespreek samen',goals:'Doel en rollen',partner:task.exerciseMode==='direct'?'Voor de voorlezer':'Voor de gesprekspartner',more:'Meer bij deze opdracht'}[key],`<div class="${task.contentItemId?'content-support':''}">${sections.filter(([,text])=>text).map(([label,text])=>`<section><h3>${esc(label)}</h3><p>${esc(text)}</p></section>`).join('')}</div>`);
}
function showBoardTask(board,route){
 const s=APP.boardStates[board],actor=boardActiveActor(board),pos=actor.pos;
 const session=contentVertSession(),pendingItem=session&&s.pending?.task?.contentItemId?ContentRuntime.itemForSession(s.pending.task.contentItemId):null;
 const task=session?(pendingItem?contentBoardTask(pendingItem):routeTask(pos,route)):(boardTaskCards().find(c=>c.id===s.pending?.task?.id&&c.routeId===selectedTaskRoute().id)||routeTask(pos,route)),sm=((task.exerciseMode==='direct'?directBank.shapes:taskBank.shapes).find(sh=>sh.id===task.shape)||shapeMeta(task.shape));
 s.pending={mode:currentMode(),actorId:actor.id,task,position:pos,choice:false};save();
 $('#taskMeta').textContent=task.contentItemId?`${contentSessionLabel(session,pendingItem,false)} · VAK ${pos}`:`${sm.symbol} ${sm.task.toUpperCase()} · ${task.exerciseMode==='direct'?'SNELVRAAG':'GESPREK'} · VAK ${pos} · ${APP.level}`;
 $('#taskDrawer').dataset.taskId=task.id;$('#taskDrawer').dataset.questionMode=task.exerciseMode==='direct'?'direct':'conversation';
 const partnerButton=$('#taskPartner');
 if(partnerButton){const direct=task.exerciseMode==='direct',label=direct?'Voor de voorlezer':'Voor de gesprekspartner';partnerButton.setAttribute('aria-label',label);const tool=partnerButton.closest('.context-tool');tool.dataset.tipLabel=label;tool.dataset.tip=direct?'Lees de vraag voor en luister naar het antwoord.':'Bekijk hoe je meedoet, luistert en reageert.'}
 $('#taskTitle').textContent=lessonText(pos===route.finishPosition?`${actor.name} is aangekomen!`:task.instruction);
 $('#taskInput').textContent=lessonText(pos===route.finishPosition?'Rond je laatste taalopdracht af: '+task.instruction:task.input);
 const contentItem=task.contentItemId?ContentRuntime.itemForSession(task.contentItemId):null;
 $('#contentBoardAnswer').textContent=contentItem?contentAnswerLabel(contentItem):'Bekijk een mogelijk antwoord';
 if($('#taskExample'))$('#taskExample').closest('.context-tool').hidden=!!contentItem&&!contentItem.model_answer;
 $('#taskTitle').hidden=!!contentItem?.reasoning;$('#contentBoardAnswer').hidden=!!contentItem?.reasoning;$('#taskDrawer .context-tools').hidden=!!contentItem?.reasoning;$('#taskDrawer').classList.toggle('content-board-task',!!contentItem);$('#contentBoardActions').hidden=!contentItem;
 if(contentItem){
  const pool=ContentRuntime.enginePool('BOARD',session),number=pool.findIndex(i=>i.content_item_id===contentItem.content_item_id)+1;
  $('#taskMeta').textContent=`${contentSessionLabel(session,contentItem,false)} · Opdracht ${number} van ${pool.length} · Vak ${pos}`;
  $('#taskTitle').textContent=lessonText(contentItem.prompt);$('#taskInput').innerHTML=contentSituation(contentItem)+(contentItem.options.length?`<ul>${contentItem.options.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'');$('#taskTitle').before($('#taskInput'));if(contentItem.reasoning)$('#taskInput').innerHTML=contentTaskText(contentItem);
 }
 $('#taskDrawer').classList.add('open');$('.board-game').classList.add('task-open');$('#primaryGame').textContent='VERDER';$('#primaryGame').title='Beurt afronden en opnieuw gooien · spatie';
 $('#boardStatus').textContent='Spatie: opdracht sluiten en volgende worp.';
}
function boardWalkPoints(route,from,to){
 return route.nodes.slice(from,to+1).flatMap((n,i)=>[...(i?route.nodes[from+i-1].pathToNext||[]:[]),[n.x,n.y]]);
}
async function animateBoardPath(board,route,points,onWater=false,taxiOnly=false){
 const mount=$('#boardMap'),reduced=settingsState().reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){if(!mount?.isConnected)return false;const p=points.at(-1);if(!taxiOnly)renderBoardPawns(board,route,{x:p[0],y:p[1],onWater});if(onWater)setTaxiPoint(route,false,p);return true}
 for(let i=1;i<points.length;i++){
  // A third coordinate marks the hidden journey between two tunnel portals.
  const a=points[i-1],b=points[i],underground=b[2]===true,duration=underground?600:Math.max(100,Math.hypot(b[0]-a[0],b[1]-a[1])/220*1000);let started;
  const alive=await new Promise(resolve=>{function frame(now){
   if(!mount.isConnected||!$('#screen-game').classList.contains('active'))return resolve(false);
   started??=now;const t=Math.min(1,(now-started)/duration),p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
   if(!taxiOnly)renderBoardPawns(board,route,{x:p[0],y:p[1],onWater,underground});if(onWater)setTaxiPoint(route,false,p);
   if(t<1)requestAnimationFrame(frame);else resolve(true)
  }requestAnimationFrame(frame)});if(!alive)return false;
 }return true;
}
async function rollBoard(board,route){
 if(boardBusy)return;const s=APP.boardStates[board],actor=boardActiveActor(board),mode=currentMode(),mount=$('#boardMap');if(!actor)return toast('Zet een deelnemer op aanwezig.');
 boardBusy=true;$('#primaryGame').disabled=true;updateUndo();
 try{
  playDiceSound();const value=APP.fixedRoll||1+Math.floor(Math.random()*6);s.lastRoll=value;
  const die=$('#moveDie');die.innerHTML=softDie({value,front:false});die.setAttribute('aria-label','Dobbelsteen '+value);die.classList.add('roll');
  SmoothDice.mount();if(!settingsState().reducedMotion&&!matchMedia('(prefers-reduced-motion: reduce)').matches)await SmoothDice.roll(die.querySelector('.smooth-die-host'),780);else await wait(30);if(!mount.isConnected||!$('#screen-game').classList.contains('active'))return;die.classList.remove('roll');
  const target=Math.min(route.finishPosition,actor.pos+value),points=boardWalkPoints(route,actor.pos,target);
  $('#boardStatus').textContent=`${actor.name} gooit ${value}`;
  if(!await animateBoardPath(board,route,points))return;
  setBoardPos(s,mode,actor.id,target);s.pending={mode,actorId:actor.id,position:target};save();renderBoardPawns(board,route);
  const taxi=route.alternativeRoutes?.find(t=>t.fromPosition===target);
  if(taxi&&settingsState().showConnections!==false){s.pending.choice=true;save();$('#taxiChoice').hidden=false;$('#boardStatus').textContent='Kies de hoofdweg of de watertaxi.'}
  else showBoardTask(board,route);
 }finally{if(mount.isConnected){boardBusy=false;$('#primaryGame').disabled=false;updateUndo();window.LessonUI?.checkpoint()}}
}
async function resolveTaxi(board,route,take){
 if(boardBusy)return;$('#taxiChoice').hidden=true;
 const s=APP.boardStates[board],actor=boardActiveActor(board),trip=route.alternativeRoutes[0],mount=$('#boardMap');
 if(!take){showBoardTask(board,route);return}
 boardBusy=true;$('#primaryGame').disabled=true;updateUndo();
 try{
  for(const leg of trip.segments){
   if(leg.mode==='boat'&&s.taxiArrived){$('#boardStatus').textContent='De watertaxi komt je ophalen…';if(!await animateBoardPath(board,route,[...leg.points].reverse(),true,true))return;s.taxiArrived=false}
$('#boardStatus').textContent=leg.mode==='boat'?'Varen naar de overkant…':'Wandelen langs de waterkant…';if(!await animateBoardPath(board,route,leg.points,leg.mode==='boat'))return;if(leg.mode==='boat'){s.taxiArrived=true;setTaxiPoint(route,true)}}
  setBoardPos(s,currentMode(),actor.id,trip.toPosition);delete s.pending.task;renderBoardPawns(board,route);showBoardTask(board,route);
 }finally{if(mount.isConnected){boardBusy=false;$('#primaryGame').disabled=false;updateUndo();window.LessonUI?.checkpoint()}}
}

function setBoardPos(s,mode,id,p){if(mode==='class')s.classPos=p;else if(teamMode(mode))s.groupPositions[id]=p;else s.positions[id]=p}
function completeBoardTurn(board,route){
 const s=APP.boardStates[board],mode=currentMode(),ppl=participants(),actor=boardActiveActor(board);
 if(mode==='class'){
  if(s.classPos>=route.finishPosition){s.round=(s.round||1)+1;s.classPos=0;toast(`Ronde ${s.round} gestart.`)}
  save();return
 }
 if(teamMode(mode)){
  const info=teamInfo(mode,ppl),current=Number(actor.id.replace(/\D/g,''))-1;
  if((s.groupPositions[actor.id]||0)>=route.finishPosition)s.groupFinished[actor.id]=true;
  const open=[];for(let i=0;i<info.count;i++){const id=info.prefix+(i+1);if(!s.groupFinished[id])open.push(i)}
  if(!open.length){
   s.round=(s.round||1)+1;s.groupFinished={};for(let i=0;i<info.count;i++)s.groupPositions[info.prefix+(i+1)]=0;APP.turn.active=0;toast(`Alle ${mode==='pairs'?'duo\'s':'groepen'} zijn binnen. Ronde ${s.round} start bij START.`)
  }else{
   let next=open.find(i=>i>current);if(next==null)next=open[0];APP.turn.active=next
  }
  save();return
 }
 if(!ppl.length)return;
 const currentIndex=ppl.findIndex(p=>p.id===actor.id);
 if((s.positions[actor.id]||0)>=route.finishPosition)s.finished[actor.id]=true;
 const open=ppl.map((p,i)=>({p,i})).filter(x=>!s.finished[x.p.id]);
 if(!open.length){
  s.round=(s.round||1)+1;s.finished={};ppl.forEach(p=>s.positions[p.id]=0);APP.turn.active=0;toast(`Iedereen is binnen. Ronde ${s.round} start bij START.`)
 }else{
  let next=open.find(x=>x.i>currentIndex);if(!next)next=open[0];APP.turn.active=next.i
 }
 save()
}


/* Dobbelspellen */
document.addEventListener('click',e=>{const b=e.target.closest('[data-dicegame]');if(!b||gameIsBusy())return;b.dataset.dicegame==='taalworp'?startTaalworp(APP.taalworpSets||APP.taalworpSet||'SET_A2_BASIS'):startStory(APP.storyCollections||APP.storyCollection||'basis')});
let twDiceState={};
const TW_DICE_IDS=['WHO','TENSE','SENTENCE_TYPE','CONNECT_1','CONNECT_2','VERB_FORM'];
function diceSidebar(kind,controls){return `<aside class="cardtypes dice-sidebar"><h3>Dobbelspellen</h3><nav aria-label="Kies een dobbelspel"><button class="typebtn ${kind==='taalworp'?'active':''}" data-dicegame="taalworp" aria-pressed="${kind==='taalworp'}">${gameIcon('verbs')}<span>Taalworp</span></button><button class="typebtn ${kind==='story'?'active':''}" data-dicegame="story" aria-pressed="${kind==='story'}">${gameIcon('story')}<span>Verhaalworp</span></button></nav><div class="dice-set-controls">${controls}</div></aside>`}
function verbSetMenu(sets,selected){
 const groups=[['basis','Basis','#176b9a'],['taalvorm','Taalvorm','#6953a3'],['themas',"Thema’s",'#237e85']];
 const groupOf=s=>s.groupId==='SETGRP_START'?'basis':s.groupId==='SETGRP_GRAMMAR'?'taalvorm':'themas';
 const label=sets.filter(s=>selected.includes(s.id)).map(s=>s.label).join(' + ');
 return `<span class="dice-set-label">Werkwoordsets mengen</span><details class="story-set-picker" id="verbSetPicker"><summary>${esc(label)}<small>${selected.length} ${selected.length===1?'set':'sets'} · ${currentVerbPool().length} unieke werkwoorden</small></summary><div class="verb-set-options">${groups.map(([id,label,color])=>`<details class="verb-set-group" style="--set-color:${color}"><summary>${label}<small>${sets.filter(s=>groupOf(s)===id).length} sets</small></summary><fieldset data-verbgroup="${id}"><legend class="sr-only">${label}</legend>${sets.filter(s=>groupOf(s)===id).map(s=>`<label><input type="checkbox" data-verbset value="${s.id}" ${selected.includes(s.id)?'checked':''}><span>${esc(s.label)}<small>${s.recordIds.length} werkwoorden</small></span></label>`).join('')}</fieldset></details>`).join('')}</div><button class="smallbtn" id="applyVerbSets">Selectie toepassen</button></details>`;
}
function startTaalworp(setId){
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 languageBusy=false;
 if(!tw){toast('Taalworp-data ontbreekt in deze distributie.');return;}
 const sets=Object.values(tw.sets.sets).filter(x=>x.availabilityStatus==='ready'),requested=[].concat(setId);
 const selected=sets.filter(s=>requested.includes(s.id)).map(s=>s.id);if(!selected.length)selected.push('SET_A2_BASIS');
 const changed=JSON.stringify(APP.taalworpSets||[APP.taalworpSet])!==JSON.stringify(selected);
 initTwDice();APP.taalworpSets=selected;APP.taalworpSet=selected[0];if(changed&&!APP.verbLocked)drawVerb();
 const label=sets.filter(s=>selected.includes(s.id)).map(s=>s.label).join(' + ');
 setLast('taalworp',`Taalworp · ${label}`,{setIds:selected});
 $('#gameMount').innerHTML=`<div class="game-shell card-table-shell dice-table-shell taalworp-shell"><div class="game-work card-work">
  <div class="card-activity-heading"><div><h1>Taalworp <span>${esc(APP.level)}</span></h1><p>Maak samen een zin. Gooi, denk, spreek!</p></div></div>
  <div class="dice-table-stage"><div class="dice-page taalworp-page"><div class="tw-tabletop"><div class="table-playfield"><section class="language-tray"><div class="card-ribbon" style="--ribbon:#176b9a">${gameIcon('verbs')}<strong>Jouw worp</strong></div><div class="language-tray-heading"><p>Gooi de stenen. Gebruik de uitkomsten in je zin.</p></div><div class="language-stage" id="languageStage"></div></section>
  <div class="verbcard">
   
   <div class="verbmain" id="activeVerbCard" role="region" aria-label="Werkwoordkaart" aria-live="polite">
    <div class="verb-front"><div class="card-ribbon" style="--ribbon:#176b9a"><strong>Maak een zin</strong><span class="card-counter" id="verbCounter"></span><button class="card-hold" id="verbLock" aria-label="Werkwoordkaart vastzetten" aria-pressed="false">${gameIcon('unlock')}</button></div><div class="verb-assignment"><h2>Gebruik het werkwoord</h2><strong id="verbValue">werken</strong><span id="verbHint"></span><div class="tw-result" id="twResult"></div><p class="say-it">Zeg je zin hardop.</p></div><div class="round-actions" aria-label="Kaartbediening">${contextTools('tw',{Help:{tip:'Stap voor stap hulp bij het werkwoord en de actieve taalstenen.'},Example:{tip:'Een mogelijk voorbeeld bij het huidige werkwoord en deze worp.'}})}<button class="smallbtn" id="twFinish">Beurt afronden</button></div></div>
    <div class="verb-back card-back-design" aria-hidden="true">${cardBack(label,'Werkwoordkaarten')}</div>
   </div>
   <span id="deckCaption" class="sr-only">Trek een kaart van de stapel</span>

   <p id="twExampleText" class="example-text" role="button" tabindex="0" hidden></p>
  </div>
 </div></div></div>
 ${diceSidebar('taalworp',`${verbSetMenu(sets,selected)}<button class="smallbtn" id="drawVerb">Nieuwe werkwoordkaart</button><button class="smallbtn" id="viewVerbStack">Werkwoorden in deze selectie</button><div class="dice-table-tip"><strong>Zo speel je</strong><p>Kies één of meer sets en pas je selectie toe. Vastgezette kaarten en stenen blijven staan, ook als je andere sets kiest.</p></div>`)}
 </div></div>

 ${gameBar(`<button class="primary card-next-primary table-roll" id="primaryGame"><span class="roll-button-die">${softDie({value:5,front:false})}</span><span>GOOIEN</span></button>`)}</div>`;
 goScreen('game');bindGameBar(rollTaalworp);
 $('#verbSetPicker').onchange=()=>{$('#applyVerbSets').disabled=!$$('[data-verbset]:checked').length};
 $('#applyVerbSets').onclick=()=>{if(languageBusy)return;const ids=$$('[data-verbset]:checked').map(x=>x.value);if(!ids.length)return;rememberAction('werkwoordsets wijzigen');startTaalworp(ids);$('#verbSetPicker summary').focus()};
 $('#viewVerbStack').onclick=()=>openGameDialog('Werkwoorden in deze selectie',`<p>${esc(label)} · ${currentVerbPool().length} unieke werkwoorden.</p><div class="detail-words">${currentVerbPool().map(v=>`<span>${esc(v.lemma)}</span>`).join('')}</div>`);
 renderLanguageDice();renderVerbCard();$('#drawVerb').onclick=()=>playTaalworp(true);$('#verbLock').onclick=()=>{APP.verbLocked=!APP.verbLocked;save();renderVerbCard()};$('#twFinish').onclick=()=>{completeTurn();startTaalworp(APP.taalworpSets)};for(const key of ['Help','Example','Goals','Partner','More'])$('#tw'+key).onclick=()=>showDiceContext('taalworp',key);$('#twExampleText').onclick=()=>{$('#twExampleText').hidden=true};$('#twExampleText').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();$('#twExampleText').hidden=true}}
}
function languageDieLabel(id,value){
 return id==='TENSE'?({present:'Nu · TT',past:'Verleden · OVT',perfect:'Voltooid · VTT'}[value?.code]||value?.label||''):({'mededelende zin':'Vertelzin','vraagwoordvraag':'Vraagwoord','begin met tijd of plaats':'Tijd/plaats voorop','persoonsvorm':'PV','infinitief':'Infinitief','voltooid deelwoord':'Deelwoord'}[value?.label]||value?.label||'');
}
function languageDieIcon(i){
 const icons=['<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>','<circle cx="12" cy="12" r="9"/><path d="M12 6v6l5 2"/>','<path d="M8 7a4 4 0 1 1 7 3c-2 1-3 2-3 5M12 19v1"/>','<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>','<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>','<path d="M4 7h16M4 17h16M8 3v8M16 13v8"/>'];
 return `<svg class="die-family-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg>`;
}
function renderLanguageDice(){
 const fam=tw.manifest.diceFamilies;
 $('#languageStage').innerHTML=TW_DICE_IDS.map((id,i)=>{
  const st=twDiceState[id],f=fam[id],label=languageDieLabel(id,st.value);
  return `<div class="langdie" style="--accent:${['#058fe1','#e43735','#1ba25c','#df9f08','#a34de2','#fffefa'][i]}">
   <div class="langlabel">${esc(f.label)}</div>
   <div class="die-control"><button class="tw-cube ${st.active?'':'inactive'}" data-die="${id}" aria-pressed="${st.active}" aria-label="${esc(f.label+': '+(st.active?label:'uit')+'. Klik om '+(st.active?'uit':'aan')+' te zetten.')}">
    <span class="tw-cube-body" aria-hidden="true">${softDie({color:['#058fe1','#e43735','#1ba25c','#df9f08','#a34de2','#fffefa'][i],word:st.active?label:'Uit',words:st.active?f.values.filter(v=>v.releaseEligible!==false).map(v=>languageDieLabel(id,v)):['Uit'],topIcon:languageDieIcon(i)})}</span>
   </button>
   <button class="lockbtn corner-lock ${st.locked?'locked':''}" data-lock="${id}" aria-pressed="${st.locked}" aria-label="${esc(f.label)} ${st.locked?'vrijgeven':'vastzetten'}" title="${st.locked?'Vast — vrijgeven':'Vrij — vastzetten'}" ${st.active?'':'hidden'}>${gameIcon(st.locked?'lock':'unlock')}</button></div>
  </div>`;
 }).join('');
 SmoothDice.mount();
 $$('[data-die]').forEach(b=>b.onclick=()=>{if(languageBusy)return;const s=twDiceState[b.dataset.die];s.active=!s.active;s.locked=false;renderLanguageDice();renderVerbCard()});
 $$('[data-lock]').forEach(b=>b.onclick=()=>{if(languageBusy)return;const s=twDiceState[b.dataset.lock];if(!s.active)return;s.locked=!s.locked;renderLanguageDice();renderVerbCard()});
}
function currentVerbPool(){const ids=APP.taalworpSets||[APP.taalworpSet||'SET_A2_BASIS'];return [...new Set(ids.flatMap(id=>tw.sets.sets[id]?.recordIds||[]))].map(id=>tw.manifest.verbs[id]).filter(Boolean)}
function taalworpExample(v,values){
 const rawWho=values.WHO,who=rawWho?.kind==='joker'||!rawWho?{label:'ik',agreementClass:'firstSingular',id:'TW_A2_WIE_IK'}:rawWho;
 const subject=who.label,person=who.agreementClass,plural=person==='plural',tense=values.TENSE?.code||'present',recipe=values.SENTENCE_TYPE?.recipe||'declarative';
 const inverted=['yes_no_question','wh_question','fronted_time_or_place'].includes(recipe);
 const forms=v.forms,features=v.features||{};
 let finite=tense==='past'?(plural?forms.past.plural:forms.past.singular):(forms.present[person]||forms.present.secondThirdSingular),tail='';
 const motion=['rijden','lopen','vliegen','zwemmen','fietsen','reizen'].includes(forms.infinitive);
 const aux=motion?(/\b(naar|tot|richting)\b/.test(v.defaultComplement||'')?'zijn':'hebben'):(features.perfectAuxiliary==='zijn'?'zijn':'hebben');
 const auxiliary=(base,past=false)=>past?(base==='zijn'?(plural?'waren':'was'):(plural?'hadden':'had')):base==='zijn'?(plural?'zijn':person==='firstSingular'?'ben':person==='secondSingular'||person==='formalSingular'?'bent':'is'):(plural?'hebben':person==='firstSingular'?'heb':person==='secondSingular'||person==='formalSingular'?'hebt':'heeft');
 if(tense==='perfect'){finite=auxiliary(aux);tail=forms.participle}
 else if(features.separable){tail=features.particle||'';if(tail&&finite.startsWith(tail))finite=finite.slice(tail.length)}
 if(inverted&&person==='secondSingular'&&tense==='present')finite=forms.present.firstSingular;
 if(inverted&&person==='secondSingular'&&tense==='perfect')finite=aux==='zijn'?'ben':'heb';
 const reflexive=features.reflexiveType&&features.reflexiveType!=='none'?({ik:'me',jij:'je',hij:'zich',zij:'zich',u:'zich',wij:'ons',jullie:'je'}[subject]||'zich'):'';
 let complement=[v.expressionObject||(v.lemma.includes('zorgen maken')?'zorgen':''),v.defaultComplement||''].filter(Boolean).join(' ');
 complement=complement.replace(/\bmijn\b/g,({ik:'mijn',jij:'jouw',hij:'zijn',zij:plural?'hun':'haar',u:'uw',wij:'onze',jullie:'jullie'})[subject]||'mijn');
 if(subject==='wij')complement=complement.replace(/\bonze kind\b/g,'ons kind');
 let words=inverted?[finite,subject,reflexive,complement,tail]:[subject,finite,reflexive,complement,tail];
 if(recipe==='wh_question')words.unshift('waarom');
 if(recipe==='fronted_time_or_place')words.unshift(tense==='present'?'op dit moment':tense==='past'?'destijds':'inmiddels');
 let sentence=words.filter(Boolean).join(' ');
 if(values.CONNECT_1){
  const link=values.CONNECT_1.label,find=plural?'vinden':subject==='ik'?'vind':'vindt',doForm=plural?'doen':subject==='ik'?'doe':'doet',tell=plural?'vertellen':subject==='ik'?'vertel':'vertelt';
  const clauses={en:`${subject} ${tell} erover`,maar:`${subject} ${auxiliary('hebben')} weinig tijd`,want:`${subject} ${find} dat belangrijk`,of:`${subject} ${doForm} iets anders`,dus:`${subject} ${tell} erover`};
  sentence+=`, ${link} ${clauses[link]||clauses.en}`;
 }
 if(values.CONNECT_2){const link=values.CONNECT_2.label;sentence+=link==='als'?`, als ${subject} tijd ${auxiliary('hebben')}`:`, omdat ${subject} dat belangrijk ${plural?'vinden':subject==='ik'?'vind':'vindt'}`}
 sentence=sentence[0].toUpperCase()+sentence.slice(1)+(['yes_no_question','wh_question'].includes(recipe)?'?':'.');
 const form=values.VERB_FORM?.code;
 return sentence+(form?`\nGevraagde vorm: ${form==='infinitive'?forms.infinitive:form==='participle'?forms.participle:finite}.`:'');
}
let languageBusy=false;
function initTwDice(){
 if(!tw)return;const low=APP.level.startsWith('Alpha')||['A0','A1','A1+'].includes(APP.level),high=['B1','B2','C1','C2'].includes(APP.level);
 TW_DICE_IDS.forEach(id=>{if(!twDiceState[id])twDiceState[id]={active:id==='WHO'||(!low&&id==='TENSE')||(high&&['SENTENCE_TYPE','CONNECT_1'].includes(id)),locked:false,value:tw.manifest.diceFamilies[id].values[0]}})
}
function rollTaalworp(){return playTaalworp(false)}
async function playTaalworp(cardOnly=false){
 const stage=$('#languageStage');if(languageBusy||!stage||(cardOnly&&APP.verbLocked))return;
 languageBusy=true;updateUndo();
 const page=stage.closest('.taalworp-page'),primary=$('#primaryGame');
 try{
  const reduced=settingsState().reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const moving=cardOnly?[]:TW_DICE_IDS.filter(id=>twDiceState[id].active&&!twDiceState[id].locked);
  moving.forEach(id=>{const vals=tw.manifest.diceFamilies[id].values.filter(v=>v.releaseEligible!==false);twDiceState[id].value=vals[Math.floor(Math.random()*vals.length)]});
  const newCard=!APP.verbLocked||!tw.manifest.verbs[APP.currentVerb];
  if(newCard)drawVerb();
  renderLanguageDice();renderVerbCard();
  page.setAttribute('aria-busy','true');page.querySelectorAll('button').forEach(b=>b.disabled=true);primary.disabled=true;
  const animations=[];
  if(!reduced){
   moving.forEach((id,i)=>{
    const cube=stage.querySelector(`[data-die="${id}"] .smooth-die-host`);
    animations.push({finished:SmoothDice.roll(cube,700,i*35)});
   });
   if(newCard){
    animations.push(animateCard($('#activeVerbCard'),$('#drawVerb')));
   }
  }
  if(moving.length)playDiceSound();
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
 }finally{
  if(stage.isConnected){languageBusy=false;updateUndo()}
  if(stage.isConnected){page.removeAttribute('aria-busy');page.querySelectorAll('button').forEach(b=>b.disabled=false);primary.disabled=false;$('#drawVerb').disabled=!!APP.verbLocked;}
 }
}
function drawVerb(){const pool=currentVerbPool(),choices=pool.filter(v=>v.id!==APP.currentVerb),v=(choices.length?choices:pool)[Math.floor(Math.random()*(choices.length||pool.length))];APP.currentVerb=v.id;save()}
function languageInstruction(id,value){
 const label=value?.label||'Kies zelf';
 if(id==='WHO')return {title:'Wie?',text:value?.kind==='joker'?'Kies zelf over wie je vertelt.':`Gebruik “${label}”${value?.disambiguation?' ('+value.disambiguation+')':''}.`};
 if(id==='TENSE')return {title:'Wanneer?',text:({present:'Vertel wat er nu gebeurt. Gebruik de tegenwoordige tijd.',past:'Vertel wat er vroeger gebeurde. Gebruik de verleden tijd.',perfect:'Vertel wat er is gebeurd. Gebruik hebben of zijn + voltooid deelwoord.'})[value?.code]||label};
 if(id==='SENTENCE_TYPE')return {title:'Welke zin?',text:({declarative:'Maak een vertelzin.',yes_no_question:'Maak een vraag waarop je ja of nee kunt antwoorden.',wh_question:'Begin met een vraagwoord, zoals wie, wat of waarom.',fronted_time_or_place:'Begin je zin met een tijd of een plaats.'})[value?.recipe]||'Kies zelf welke soort zin je maakt.'};
 if(id==='CONNECT_1'||id==='CONNECT_2')return {title:'Verbind',text:`Maak je zin langer met “${label}”.`};
 return {title:'Zoek de vorm',text:`Noem ook de ${label} van het werkwoord.`};
}
function renderVerbCard(){
 if(!tw.manifest.verbs[APP.currentVerb]||(!APP.verbLocked&&!currentVerbPool().some(v=>v.id===APP.currentVerb)))drawVerb();
 const verb=tw.manifest.verbs[APP.currentVerb]||currentVerbPool()[0];APP.currentVerb=verb.id;
 $('#verbCounter').textContent=currentVerbPool().some(v=>v.id===verb.id)?`${currentVerbPool().findIndex(v=>v.id===verb.id)+1} van ${currentVerbPool().length}`:'Vastgezet · buiten selectie';$('#verbValue').textContent=verb.lemma;$('#verbHint').textContent=verb.primarySense?.gloss||verb.defaultComplement||'';
 const rules=TW_DICE_IDS.filter(id=>twDiceState[id].active).map(id=>({id,...languageInstruction(id,twDiceState[id].value)}));
 $('#twResult').innerHTML=rules.length?`<ul class="sentence-recipe">${rules.map(r=>`<li class="recipe-${r.id}"><strong>${esc(r.title)}</strong><span>${esc(r.text)}</span></li>`).join('')}</ul>`:'<p>Kies zelf wie en wanneer.</p>';
 $('#verbLock').innerHTML=gameIcon(APP.verbLocked?'lock':'unlock');$('#verbLock').setAttribute('aria-label',APP.verbLocked?'Werkwoordkaart vrijgeven':'Werkwoordkaart vastzetten');$('#verbLock').title=APP.verbLocked?'Vast — vrijgeven':'Vrij — vastzetten';$('#verbLock').setAttribute('aria-pressed',String(!!APP.verbLocked));
 $('#twExampleText').hidden=true;$('#drawVerb').disabled=!!APP.verbLocked;$('#deckCaption').textContent=APP.verbLocked?'Kaart vast · blijft liggen':'Trek een kaart van de stapel';
}
function showTwExample(){
 const v=tw.manifest.verbs[APP.currentVerb]||currentVerbPool()[0],values=Object.fromEntries(TW_DICE_IDS.filter(id=>twDiceState[id].active).map(id=>[id,twDiceState[id].value]));
 $('#twExampleText').textContent=lessonText(taalworpExample(v,values));$('#twExampleText').hidden=false;
}
function showDiceContext(type,key){
 const titles={Help:'Hulp',Example:'Mogelijk voorbeeld',Goals:'Doel en rollen',Partner:'Voor de gesprekspartner',More:'Meer bij deze worp'};
 let sections;
 if(type==='taalworp'){
  const v=tw.manifest.verbs[APP.currentVerb]||currentVerbPool()[0],values=Object.fromEntries(TW_DICE_IDS.filter(id=>twDiceState[id].active).map(id=>[id,twDiceState[id].value]));
  const rules=Object.entries(values).map(([id,value])=>languageInstruction(id,value).text).join(' ');
  sections={Help:[['Werkwoord',v.lemma+' · '+(v.primarySense?.gloss||v.defaultComplement||'')],['Zo bouw je je zin',rules||'Kies zelf wie en wanneer.']],Example:[['Bij jullie worp',taalworpExample(v,values)],['Bespreek','Dit is een mogelijk voorbeeld. Andere passende zinnen mogen ook.']],Goals:[['Doel',`Maak een zin met “${v.lemma}”. ${rules}`],['Rollen','Eén deelnemer maakt de zin. De gesprekspartner luistert en controleert samen met de spreker de voorwaarden. Wissel daarna.']],Partner:[['Luister naar de zin',`Wordt “${v.lemma}” gebruikt? ${rules}`],['Reageer','Vertel wat je begrijpt. Bespreek samen één mogelijke verbetering en laat de spreker de zin opnieuw zeggen.']],More:[['Nog een zin',`Gebruik “${v.lemma}” in een situatie uit je eigen leven.`],['Variëren','Zet een steen vast en gooi de andere stenen opnieuw. Vertel wat er in je zin verandert.']]}[key];
 }else{
  const labels=(APP.storyRoll||[]).filter((_,i)=>APP.storyEnabled?.[i]!==false).map(id=>story.icons.find(x=>x.id===id)?.label).filter(Boolean);
  const words=labels.join(' · ');
  sections={Help:[['Jullie beelden',words||'Zet eerst een beeldsteen aan.'],['Vertel in stappen','Begin: wie en waar? Daarna: wat gebeurt er? Tot slot: hoe loopt het af?']],Example:[['Vertelopzet bij jullie beelden',words||'Zet eerst een beeldsteen aan.'],['Een mogelijke opzet',labels.length?`Begin met “${labels[0]}”. ${labels.length>2?'Verbind daarna '+labels.slice(1,-1).map(x=>'“'+x+'”').join(', ')+'. ':''}${labels.length>1?'Laat “'+labels.at(-1)+'” in het einde terugkomen.':''}`:'Gooi de stenen om een vertelopzet te krijgen.'],['Eigen verhaal','Deze opzet geeft geen vast antwoord. Bedenk zelf wie er iets doet, waarom en hoe het afloopt.']],Goals:[['Doel','Verbind alle actieve beelden tot één samenhangend verhaal: '+words],['Rollen','Eén deelnemer begint. De gesprekspartner luistert, stelt een vraag en voegt iets toe. Geef het verhaal samen een einde.']],Partner:[['Let op deze beelden',words||'Zet eerst een beeldsteen aan.'],['Vraag door','Wat gebeurt er daarna? Waarom gebeurt dat? Welk beeld kan nog in het verhaal? Laat de verteller eerst uitspreken.']],More:[['Een ander einde','Vertel met dezelfde beelden een ander einde.'],['Samen verder','Iedere deelnemer voegt één zin toe. Houd de beelden vast die je wilt bewaren en gooi de andere opnieuw.']]}[key];
 }
 openGameDialog(titles[key],sections.map(([title,text])=>`<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join(''));
}

/* Verhaalworp */
function storyIcons(collection=APP.storyCollections||APP.storyCollection){const ids=[].concat(collection),extra=story.collections.filter(s=>ids.includes(s.id)).flatMap(s=>s.includeNumbers||[]);return story.icons.filter(x=>ids.includes(x.collection)||extra.includes(x.number))}
function storyCounts(collection,held=[]){return [3,6,9].filter(n=>n<=new Set([...storyIcons(collection).map(x=>x.id),...held]).size)}
function heldStoryIds(){return (APP.storyRoll||[]).filter((id,i)=>APP.storyLocks?.[i]&&story.icons.some(x=>x.id===id))}
function startStory(collection){
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 storyBusy=false;
 if(!story){toast('Verhaalworp-data ontbreekt in deze distributie.');return;}
 const sets=story.collections.filter(s=>s.status==='ready'),requested=[].concat(collection);
 collection=sets.filter(s=>requested.includes(s.id)).map(s=>s.id);if(!collection.length)collection=[sets[0].id];
 const changed=JSON.stringify(APP.storyCollections||[APP.storyCollection])!==JSON.stringify(collection);
 const held=heldStoryIds();
 const counts=storyCounts(collection,held),count=counts.filter(n=>n<=(APP.storyCount||3)).at(-1)||3;
 if(APP.storyCount!==count){APP.storyRoll=held;APP.storyLocks=Object.fromEntries(held.map((_,i)=>[i,true]));APP.storyEnabled={}}
 if(changed)APP.storyEnabled={};
 APP.storyCount=count;
 APP.storyCollections=collection;APP.storyCollection=collection[0];APP.storyLocks??={};APP.storyEnabled??={};
 const label=sets.filter(s=>collection.includes(s.id)).map(s=>s.label).join(' + ');
 setLast('story',`Verhaalworp · ${label}`,{collections:collection});
 $('#gameMount').innerHTML=`<div class="game-shell card-table-shell dice-table-shell story-table-shell"><div class="game-work card-work">
 <div class="card-activity-heading"><div><h1>Verhaalworp <span>${esc(APP.level)}</span></h1><p>Gooi beeldstenen en vertel samen een verhaal.</p></div></div>
 <div class="dice-table-stage"><section class="story-stage"><header class="story-prompt"><div class="card-ribbon" style="--ribbon:#176b9a">${gameIcon('story')}<strong>Vertel een verhaal</strong><span class="card-counter" id="storyCounter"></span></div><div class="story-prompt-body"><p id="storyPromptCount">Gebruik de beelden op de voorkant van de stenen.</p></div></header><div class="storygrid count-${APP.storyCount}" id="storyGrid"></div><div class="storyhelp">${contextTools('story',{Help:{tip:'Hulp bij het verbinden van de actieve beelden.'},Example:{tip:'Een vertelopzet met jullie huidige beelden.'}})}<button class="smallbtn" id="storyFinish">Beurt afronden</button></div></section>
 ${diceSidebar('story',`<span class="dice-set-label">Beeldsets mengen</span><details class="story-set-picker" id="storySet"><summary>${esc(label)}<small>${collection.length} ${collection.length===1?'set':'sets'} · ${storyIcons().length} beelden</small></summary><fieldset><legend>Kies één of meer sets</legend>${sets.map(({id,label,count})=>`<label><input type="checkbox" data-storyset value="${id}" ${collection.includes(id)?'checked':''}><span>${esc(label)}<small>${count} beelden</small></span></label>`).join('')}</fieldset><button class="smallbtn" id="applyStorySets">Selectie toepassen</button></details><span class="dice-set-label">Aantal stenen</span><div class="story-count-choices" role="group" aria-label="Aantal stenen">${counts.map(n=>`<button class="smallbtn ${APP.storyCount===n?'active':''}" data-storycount="${n}" aria-pressed="${APP.storyCount===n}">${n}</button>`).join('')}</div><button class="smallbtn" id="storySets">Over de beeldsets</button><div class="dice-table-tip"><strong>Zo speel je</strong><p>Het woord staat onder de steen. Grijze stenen doen niet mee. Vastgezette beelden blijven staan als je andere sets kiest.</p></div>`)}
 </div></div>${gameBar(`<button class="primary card-next-primary" id="primaryGame"><span class="roll-button-die">${softDie({value:5,front:false})}</span><span>GOOIEN</span></button>`)}</div>`;
 goScreen('game');bindGameBar(()=>rollStory(true));
 for(const key of ['Help','Example','Goals','Partner','More'])$('#story'+key).onclick=()=>showDiceContext('story',key);
 $('#storySet').onchange=()=>{$('#applyStorySets').disabled=!$$('[data-storyset]:checked').length};
 $('#applyStorySets').onclick=()=>{if(storyBusy)return;const selected=$$('[data-storyset]:checked').map(x=>x.value);if(!selected.length)return;rememberAction('beeldsets wijzigen');startStory(selected);$('#storySet summary').focus()};
 $$('[data-storycount]').forEach(b=>b.onclick=()=>{if(storyBusy)return;APP.storyCount=Number(b.dataset.storycount);APP.storyRoll=[];APP.storyLocks={};APP.storyEnabled={};save();startStory(collection)});
 $('#storySets').onclick=()=>openGameDialog('Beeldsets',`<p>Vink één of meer beeldsets aan en kies Selectie toepassen. De vrije stenen gebruiken samen alle beelden uit je selectie. Vastgezette beelden blijven staan, ook als je hun set uitvinkt. Er zijn ${story.icons.length} unieke beelden verdeeld over ${story.collections.filter(s=>s.status==='ready').length} sets. Hand en oor vind je zowel bij Dagelijks leven als bij Lichaamsdelen. Met alleen Familie zijn er zes beelden; combineer met een andere set voor negen stenen.</p>`);$('#storyFinish').onclick=()=>{if(storyBusy)return;completeTurn();APP.storyLocks={};APP.storyRoll=[];save();startStory(APP.storyCollections)};
 if(changed||!APP.storyRoll?.length||APP.storyRoll.length!==APP.storyCount||APP.storyRoll.some((id,i)=>!(APP.storyLocks[i]?story.icons:storyIcons()).some(x=>x.id===id)))rollStory(false);else renderStory()
}
function storyPool(){return storyIcons()}
function renderStory(){
 const pool=storyPool(),byId=Object.fromEntries(story.icons.map(x=>[x.id,x])),roll=(APP.storyRoll||[]).map(id=>byId[id]).filter(Boolean),g=$('#storyGrid');if(!g)return;
 g.className=`storygrid count-${APP.storyCount||3}`;
 const active=roll.filter((_,i)=>APP.storyEnabled?.[i]!==false).length;
 $('#storyCounter').textContent=`${active} beelden`;$('#storyPromptCount').textContent=active?`Gebruik ${active===1?'dit beeld':`alle ${active} beelden`} in je verhaal. ${levelInstruction()}`:'Zet een steen aan om een verhaal te maken.';
 g.innerHTML=roll.map((x,i)=>`<div class="story-tile"><div class="die-control"><button class="storydie ${APP.storyLocks?.[i]?'locked':''} ${APP.storyEnabled?.[i]===false?'inactive':''}" data-storydie="${i}" aria-pressed="${APP.storyEnabled?.[i]!==false}" aria-label="${esc(x.label)} · ${APP.storyEnabled?.[i]===false?'uit':'aan'}">${softDie({image:x.file,images:Array.from({length:5},(_,j)=>pool[(pool.indexOf(x)+j+1)%pool.length].file)})}</button><button class="lockbtn corner-lock ${APP.storyLocks?.[i]?'locked':''}" data-storylock="${i}" aria-label="${esc(x.label)} ${APP.storyLocks?.[i]?'vrijgeven':'vastzetten'}" title="${APP.storyLocks?.[i]?'Vast — vrijgeven':'Vrij — vastzetten'}" aria-pressed="${!!APP.storyLocks?.[i]}" ${APP.storyEnabled?.[i]===false?'hidden':''}>${gameIcon(APP.storyLocks?.[i]?'lock':'unlock')}</button></div><span class="story-word">${esc(x.label)}</span></div>`).join('');
 SmoothDice.mount();
 $$('[data-storydie]').forEach(b=>b.onclick=()=>{if(storyBusy)return;const i=Number(b.dataset.storydie);APP.storyEnabled[i]=APP.storyEnabled[i]===false;APP.storyLocks[i]=false;save();renderStory()});
 $$('[data-storylock]').forEach(b=>b.onclick=()=>{if(storyBusy)return;const i=Number(b.dataset.storylock);if(APP.storyEnabled[i]===false)return;APP.storyLocks[i]=!APP.storyLocks[i];save();renderStory()});
}
let storyBusy=false;
async function rollStory(animate=true){
 if(storyBusy)return;
 if(APP.storyCount>storyCounts(APP.storyCollections,heldStoryIds()).at(-1)){startStory(APP.storyCollections);return}
 storyBusy=true;updateUndo();const mount=$('#storyGrid');try{
 if(animate)playDiceSound();const g=$('#storyGrid');
 if(!mount?.isConnected)return;
 const pool=storyPool(),n=APP.storyCount||3,current=APP.storyRoll||[],locks=APP.storyLocks||{},used=new Set(),next=Array(n).fill(null);
 for(let i=0;i<n;i++){if((locks[i]?story.icons:APP.storyEnabled?.[i]===false?pool:[]).some(x=>x.id===current[i])&&!used.has(current[i])){next[i]=current[i];used.add(current[i])}}
 const available=pool.filter(x=>!used.has(x.id)).sort(()=>Math.random()-.5);
 let k=0;for(let i=0;i<n;i++){if(!next[i])next[i]=available[k++]?.id}
 APP.storyRoll=next;save();renderStory();if(animate&&!settingsState().reducedMotion&&!matchMedia('(prefers-reduced-motion: reduce)').matches){g.classList.add('rolling');await Promise.all([...g.querySelectorAll('.storydie:not(.locked):not(.inactive) .smooth-die-host')].map((host,i)=>SmoothDice.roll(host,600,i*30)))}g?.classList.remove('rolling');
 }finally{if(mount?.isConnected){storyBusy=false;updateUndo()}}
}

/* Kaartspellen */
const CARD_GAMES=[...RUNTIME.cardGames.families,{...RUNTIME.c1BetweenLines,description:'B1 · B2 · 50 kaarten in vijf onderdelen.'}];
const CARD_ROUTES=RUNTIME.cardGames.routeDefinitions;
// Keep the selected record when a content import changes its position in the deck.
if(APP.cardBankRevision!==RUNTIME.cardGames.source){
 const id=APP.cardRound?.id,list=cardsFor(APP.cardKind),index=list.findIndex(c=>c.id===id);
 if(index>=0)APP.cardIndex=index;
 delete APP.cardRound;APP.cardBankRevision=RUNTIME.cardGames.source;save();
}
function defaultCardRoute(){return /^Alpha|^A0/.test(APP.level)?'R0':({A1:'R1','A1+':'R2',A2:'R3',B1:'R4',B2:'R5',C1:'R6',C2:'R6'}[APP.level]||'R0')}
function activeCardRoute(){return defaultCardRoute()}
function cardsFor(kind,all=false){if(kind==='c1-between-lines')return RUNTIME.c1BetweenLines.cards.filter(c=>all||!APP.c1Domain||c.domainId===Number(APP.c1Domain));if(kind==='tongue'){const bank=RUNTIME.tongueBank;return bank.cards.filter(c=>c.type==='tongbreker'&&(all||(bank.levels.indexOf(c.entryLevel)<=bank.levels.indexOf(tongueLevel())&&(!APP.tongueDifficulty||({easy:c.difficulty<=2,medium:c.difficulty===3,hard:c.difficulty>=4}[APP.tongueDifficulty]??true)))))}const list=CARD_GAMES.find(x=>x.id===kind)?.cards||[];return all||activeCardRoute()==='all'?list:list.filter(c=>c.routeId===activeCardRoute())}
function tongueLevel(){return RUNTIME.tongueBank.levels.includes(APP.level)?APP.level:APP.level==='A1+'?'A1':'A0'}
function tongueFilters(){return `<label class="card-filter">Moeilijkheid<select id="tongueDifficulty">${[['','Alles'],['easy','Makkelijk'],['medium','Gemiddeld'],['hard','Lastig']].map(([v,label])=>`<option value="${v}" ${(APP.tongueDifficulty||'')===v?'selected':''}>${label}</option>`).join('')}</select></label>`}
let tongueAudio=null;
function stopTongueAudio(){
 const previous=tongueAudio;tongueAudio=null;
 if(previous){previous.pause();previous.currentTime=0}
}
async function readTongue(c,button){
 stopTongueAudio();
 if(!c?.audio?.src)return;
 const audio=new Audio(globalThis.AppWording?.audio(c)??c.audio.src);tongueAudio=audio;
 const failed=()=>{if(tongueAudio===audio){stopTongueAudio();if(button.isConnected){button.textContent='Voorlezen';toast('De opname kan niet worden afgespeeld. Probeer het opnieuw.')}}};
 audio.onerror=failed;
 try{await audio.play();if(tongueAudio===audio&&button.isConnected)button.textContent='Nog een keer'}catch{failed()}
}
function startTongue(){
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 stopTongueAudio();
 const list=cardsFor('tongue');
 if(APP.tongueBankVersion!==RUNTIME.tongueBank.version){
  const previous=(RUNTIME.tonguePreviousCards||[]).filter(c=>RUNTIME.tongueBank.levels.indexOf(c.entryLevel)<=RUNTIME.tongueBank.levels.indexOf(tongueLevel())&&(!APP.tongueDifficulty||({easy:c.difficulty<=2,medium:c.difficulty===3,hard:c.difficulty>=4}[APP.tongueDifficulty]??true)));
  const oldId=APP.tongueCardId||(APP.last?.data?.kind==='tongue'?previous[APP.cardIndex||0]?.id:null);
  const restored=list.findIndex(c=>c.id===oldId);
  APP.cardIndex=Math.max(0,restored);APP.tongueBankVersion=RUNTIME.tongueBank.version;
  if(oldId&&restored<0)toast('Tongbrekers is bijgewerkt. Je vorige kaart valt buiten deze selectie; je begint bij de eerste kaart.');
 }
 APP.cardKind='tongue';APP.cardIndex=list.length?((APP.cardIndex||0)%list.length+list.length)%list.length:0;
 APP.tongueCardId=list[APP.cardIndex]?.id||null;
 const c=list[APP.cardIndex],counter=list.length?`${APP.cardIndex+1} van ${list.length}`:'0 kaarten';
 setLast('card','Tongbrekers',{kind:'tongue'});
 renderCardTable('tongue',counter,`<div class="card-ribbon" style="--ribbon:#b95979"><strong>Tongbrekers</strong><span class="card-counter">${counter}</span></div><div class="card-content tongue-content" aria-live="polite" ${c?`data-card-id="${c.id}"`:''}><p class="tongue-text">${esc(c?.text||'Geen tongbrekers bij deze filters.')}</p></div>`);
}
function c1Filters(){return `<div class="card-control-row"><label class="card-filter">Domein<select id="c1Domain"><option value="">Alle vijf domeinen</option>${RUNTIME.c1BetweenLines.domains.map(d=>`<option value="${d.id}" ${String(d.id)===APP.c1Domain?'selected':''}>${esc(d.title)}</option>`).join('')}</select></label><button class="smallbtn card-control-icon" id="c1Previous" aria-label="Vorige kaart" title="Vorige kaart">${gameIcon('undo')}</button><button class="smallbtn card-control-icon" id="c1ViewSet" aria-label="Bekijk alle 50 kaarten" title="Bekijk alle 50 kaarten">${gameIcon('cards')}</button></div>`}
function c1Feedback(c,choice){return choice?`<strong>${choice===c.correct?'Goed':'Fout'}</strong><p><strong>Juiste antwoord:</strong> ${esc(c.correct)}. ${esc(c.options.find(o=>o.id===c.correct).text)}</p><h3>Uitleg</h3><p>${esc(c.explanation)}</p><h3>Let op</h3><p>${esc(c.attention)}</p>`:''}
function startC1(){
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 const bank=RUNTIME.c1BetweenLines;
 if(!bank.domains.some(d=>String(d.id)===APP.c1Domain))APP.c1Domain='';
 const list=cardsFor(bank.id);APP.cardKind=bank.id;APP.cardIndex=((APP.cardIndex||0)%list.length+list.length)%list.length;
 const c=list[APP.cardIndex],state=cardRound(c),counter=`${APP.cardIndex+1} van ${list.length}`;
 setLast('card',bank.title+' · C1',{kind:bank.id});
 renderCardTable(bank.id,counter,`<div class="card-ribbon" style="--ribbon:${bank.color}"><strong>${esc(bank.title)}</strong><span class="card-counter">${counter}</span></div><div class="card-content c1-content" data-card-id="${esc(c.id)}"><div class="c1-context"><h2>${esc(c.expression)}</h2><div class="card-situation"><div><strong>Situatie</strong><p>${esc(c.situation)}</p></div></div><button class="smallbtn c1-review" id="c1Review" ${state.choice?'':'hidden'}>Bekijk vraag</button></div><div class="c1-answer"><div class="c1-choices" role="group" aria-labelledby="c1Question"><h3 id="c1Question">${esc(c.question)}</h3>${c.options.map(o=>`<button class="smallbtn" data-c1-choice="${o.id}" aria-pressed="${state.choice===o.id}" ${state.choice?'disabled':''}>${o.id}. ${esc(o.text)}</button>`).join('')}</div><section id="c1Feedback" tabindex="-1" role="status" aria-live="polite" aria-atomic="true">${c1Feedback(c,state.choice)}</section></div></div>`);
}
function currentCard(){return cardsFor(APP.cardKind)[APP.cardIndex||0]}
function cardRound(c){if(APP.cardRound?.id!==c.id||APP.cardRound?.bankRevision!==RUNTIME.cardGames.source)APP.cardRound={id:c.id,bankRevision:RUNTIME.cardGames.source,attempted:false,predictionReady:false,revealed:false};return APP.cardRound}
$$('[data-cardgame]').forEach(b=>b.onclick=()=>prepareCards(b.dataset.cardgame));
function cardActivityHeader(kind){const item=CARD_GAMES.find(x=>x.id===kind);return `<div class="card-activity-heading"><h1>${esc(item.title)} <span>${cardsFor(kind,true).length} kaarten</span></h1></div>`}
function cardTypeChoices(kind){return `<aside class="cardtypes"><h3>Kaartspellen</h3><nav aria-label="Kies een kaartspel">${CARD_GAMES.map(item=>`<button class="typebtn ${kind===item.id?'active':''}" data-ctype="${item.id}" aria-pressed="${kind===item.id}">${gameIcon(item.icon)}<span>${esc(item.title)}</span></button>`).join('')}</nav></aside>`}
function playCardBack(title,family,icon,counter,color){return `<span class="play-card-back" style="--deck-color:${color}"><img class="card-brand" src="assets/brand/taalroute-white.svg" alt="Taalroute">${gameIcon(icon)}<strong>${esc(title)}</strong><span class="card-family">${esc(family)}</span><span class="deck-count">${esc(counter)}</span></span>`}
function cardDeck(kind,counter){const item=collectionItems().find(x=>x.type==='cards'&&x.id===kind);return `<div class="deckpanel"><button class="card-deck-button" id="cardDeck" aria-label="Volgende kaart trekken">${playCardBack(item.title,'Kaartspel',CARD_GAMES.find(x=>x.id===kind).icon,counter,item.color)}</button></div>`}
function rebusImage(c){return c.visualRebus?`<img class="rebus-image" src="${esc(c.visualRebus.src)}" alt="${esc(c.visualRebus.alt)}">`:''}
function cardTools(){const c=currentCard();if(APP.cardKind==='tongue')return `<div class="card-control-row">${tongueFilters()}<button class="smallbtn" id="tongueRead" ${c?'':'disabled'}>Voorlezen</button></div>`;if(APP.cardKind==='c1-between-lines')return c1Filters();if(!c)return '';const state=cardRound(c),practice=c.model.showWhen==='before_during_after_attempt';return `<button class="smallbtn card-attempt" id="cardAttempt" aria-label="Antwoord klaar" title="Antwoord klaar: bekijk nu het voorbeeld" aria-pressed="${state.attempted}" ${c.prediction&&!state.predictionReady?'disabled':''}>✓</button>`+contextTools('card',{
 Help:{controls:'cardSupport',disabled:!c.help.availableBeforeAttempt&&!state.attempted,tip:'Aanwijzingen bij deze kaart. '+(c.help.availableBeforeAttempt?'Je mag ze vóór je poging bekijken.':'Beschikbaar na je eigen poging.')},
 Example:{controls:'cardSupport',disabled:!state.attempted&&!practice,label:c.answerType==='hybrid'?'Oplossing':'Voorbeeld',tip:practice?'De docent mag deze oefentekst eerst voordoen.':'Geef eerst je eigen antwoord. Klik op het vinkje als je antwoord klaar is; daarna kun je het voorbeeld bekijken.'},
 Goals:{controls:'cardSupport',tip:'Het doel van deze kaart en de verdeling van de rollen.'},
 Partner:{controls:'cardSupport',count:c.participants.min,tip:`${c.participants.min} deelnemers. ${c.prediction?'Leg eerst ieder je eigen keuze op papier vast.':c.partnerMode==='guided_reveal'?'Bekijk wanneer de partnerreactie onthuld mag worden.':'Bekijk de opdracht voor je gesprekspartner.'}`},
 More:{id:'cardSetInfo',tip:'Vervolgopdracht, succescriterium en informatie voor de docent.'}
})}
function renderCardTable(kind,counter,front){const item=collectionItems().find(x=>x.type==='cards'&&x.id===kind);$('#gameMount').innerHTML=`<div class="game-shell card-table-shell${kind==='tongue'?' tongue-table':kind==='c1-between-lines'?' c1-table':''}"><div class="game-work card-work">${cardActivityHeader(kind)}<div class="cards-stage">${cardDeck(kind,counter)}<div class="game-card-motion"><article class="active-card">${front}<div class="card-controls">${cardTools()}</div></article><div class="game-card-back card-back-design" style="--deck-color:${item.color}" aria-hidden="true">${cardBack(item.title,'Kaartspel')}</div></div>${cardTypeChoices(kind)}</div></div>${gameBar(`<button class="primary card-next-primary" id="primaryGame">${cardFan()}<span>VOLGENDE KAART</span></button>`)}</div>`;bindCards(kind)}
function bindCards(kind){
 goScreen('game');bindGameBar(nextCard);const c=currentCard();

 $$('[data-ctype]').forEach(b=>b.onclick=()=>{APP.cardIndex=0;delete APP.cardRound;prepareCards(b.dataset.ctype)});
 $('#cardDeck').onclick=nextCard;
 if(kind==='c1-between-lines'){
  $('#c1ViewSet').onclick=()=>openCabinetSet('cards',kind);
  $('#c1Domain').onchange=e=>{rememberAction('domein kiezen');APP.c1Domain=e.target.value;APP.cardIndex=0;delete APP.cardRound;save();startCards(kind)};
  $('#c1Previous').onclick=()=>{if(cardBusy)return;rememberAction('vorige kaart');nextCard(-1)};
  $('#c1Review').onclick=()=>{const show=$('.c1-content').classList.toggle('review-question');$('#c1Review').textContent=show?'Bekijk uitleg':'Bekijk vraag'};
  const state=cardRound(c);
  $$('[data-c1-choice]').forEach(button=>button.onclick=()=>{
   if(state.choice||cardBusy)return;
   rememberAction('antwoord kiezen');state.choice=button.dataset.c1Choice;save();
   $$('[data-c1-choice]').forEach(b=>{b.disabled=true;b.setAttribute('aria-pressed',String(b===button))});
   $('#c1Feedback').innerHTML=c1Feedback(c,state.choice);$('#c1Review').hidden=false;$('#c1Feedback').focus({preventScroll:true});

  });
  return;
 }
 if(kind==='tongue'){
  $('#primaryGame').disabled=$('#cardDeck').disabled=!c;
  $('#tongueDifficulty').onchange=e=>{rememberAction('tongbrekerfilter kiezen');APP.tongueDifficulty=e.target.value;APP.cardIndex=0;delete APP.cardRound;save();startTongue()};
  const read=$('#tongueRead');read.disabled=!c?.audio?.src;
  read.onclick=()=>readTongue(c,read);
  return;
 }
 const state=cardRound(c);
 $('#cardSetInfo').onclick=()=>openGameDialog('Meer bij deze kaart',`<h3>Vervolg</h3><p>${esc(c.followUp.instruction)}</p><h3>Waar let je op?</h3><p>${esc(c.criterion)}</p><h3>Voor de docent</h3><p>${esc(c.teacherNote)}</p><details><summary>Voorlezen</summary><p>${esc(c.visualRebus?c.visualRebus.alt+' '+c.visualRebus.instruction:c.mediaRequirements.readAloudText)}</p><p>${esc(c.mediaRequirements.fallback)}</p></details><p>${c.participants.min} deelnemers · ${esc(c.route)} · ${esc(c.difficultyWithinRoute)}</p><button class="smallbtn" id="cardViewSet">Bekijk alle ${cardsFor(kind,true).length} kaarten</button>`,()=>{$('#cardViewSet').onclick=()=>{$('#gameDialog').close();openCabinetSet('cards',kind)}});
 for(const [id,section] of [['cardHelp','help'],['cardExample','example'],['cardGoals','goals'],['cardPartner','partner']])$('#'+id).onclick=()=>{const box=$('#cardSupport'),open=!(box.classList.contains('open')&&box.dataset.section===section);box.dataset.section=section;box.classList.toggle('open',open);for(const [name,key] of [['Help','help'],['Example','example'],['Goals','goals'],['Partner','partner']])$('#card'+name).setAttribute('aria-expanded',String(open&&section===key));if(open)box.scrollIntoView({block:'nearest'})};
 $('#cardAttempt').onclick=()=>{rememberAction('eigen poging afronden');state.attempted=true;save();unlockContextTool('cardExample');unlockContextTool('cardHelp');$('#cardAttempt').setAttribute('aria-pressed','true')};
 if($('#predictionReady'))$('#predictionReady').onclick=()=>{rememberAction('voorspelling vastleggen');state.predictionReady=true;save();$('#predictionDiscussion').hidden=false;$('#predictionReady').textContent='Beiden hebben gekozen ✓';$('#predictionReady').setAttribute('aria-pressed','true');$('#cardAttempt').disabled=false};
 if($('#cardReveal'))$('#cardReveal').onclick=()=>{rememberAction('reactie onthullen');state.revealed=true;save();$('#cardRevealed').hidden=false;$('#cardReveal').setAttribute('aria-expanded','true')};
 if($('#closedChoice'))$('#closedChoice').onsubmit=e=>{e.preventDefault();const selected=new FormData(e.currentTarget).get('choice');if(!selected)return;rememberAction('keuze controleren');state.choice=selected;state.attempted=true;save();$('#closedFeedback').textContent=lessonText((c.closedStep.acceptedOptionIds.includes(selected)?'Deze keuze past. ':'Bekijk de tijden nog eens. ')+c.closedStep.explanation);unlockContextTool('cardExample');unlockContextTool('cardHelp');$('#cardAttempt').setAttribute('aria-pressed','true')};
 if(c.prediction){$('#cardSupport').dataset.section='partner';$('#cardSupport').classList.add('open');$('#cardPartner').setAttribute('aria-expanded','true')}
 else if(!c.visualRebus&&c.help.defaultVisible&&(c.help.availableBeforeAttempt||state.attempted)){$('#cardSupport').classList.add('open');$('#cardHelp').setAttribute('aria-expanded','true')}
 if(c.visualRebus)$('#cardRebus').onclick=()=>openGameDialog('Bekijk de rebus',`<div class="rebus-enlarged">${rebusImage(c)}</div>`);
 $('#cardDeck').onclick=nextCard;
}
function contentSituation(item){return item.context?`<section class="content-situation"><h3>De situatie</h3><p>${esc(item.context)}</p></section>`:''}
function contentTaskText(item,options){if(item.reasoning)return ReasoningTasks.render(item,options);return `${contentSituation(item)}<section class="content-prompt"><h3>De opdracht</h3><h2>${esc(ContentRuntime.displayPrompt(item))}</h2>${item.options?.length?`<ul>${item.options.map(option=>`<li>${esc(option)}</li>`).join('')}</ul>`:''}</section>`}
function contentAnswerLabel(item){return !item.model_answer?'Bespreek samen':ContentRuntime.answerPolicy(item).modelIsExample?'Bekijk een mogelijk antwoord':'Bekijk het antwoord'}
function contentAnswerText(item,policy){return `${policy.modelAnswer?`<section><h3>${policy.modelIsExample?'Een mogelijk antwoord':'Antwoord'}</h3><p>${esc(policy.modelAnswer)}</p></section>`:''}<section><h3>Bespreek samen</h3><p>${esc(item.explanation||item.learning_goal)}</p></section>`}
let contentDiceBusy=false;
function contentSessionDice(){const session=contentVertSession();return session?ContentRuntime.enginePool('DICE',session):[]}
function startContentDice(){
 const session=contentVertSession();if(!session)return toast('Kies eerst de inhoud voor je les.');
 const list=contentSessionDice();if(!list.length)return toast('Deze les bevat geen dobbelopdrachten.');
 APP.contentDiceIndex=((APP.contentDiceIndex||0)%list.length+list.length)%list.length;
 const item=list[APP.contentDiceIndex],policy=ContentRuntime.project('DICE',item).answerPolicy,label=contentSessionLabel(session,item),counter=`${APP.contentDiceIndex+1} van ${list.length}`;
 setLast('activity',label,{kind:'content-dice',contentItemId:item.content_item_id});
 $('#gameMount').innerHTML=`<div class="game-shell card-table-shell content-engine-dice"><div class="game-work card-work"><div class="card-activity-heading"><h1>${esc(contentSessionLabel(session,item,false))}</h1></div><div class="content-dice-stage"><section class="content-dice-tray" aria-label="Dobbelsteen"><button id="contentDie" aria-label="${APP.contentDiceLastRoll?'Dobbelsteen '+APP.contentDiceLastRoll+'. ':''}Gooi de dobbelsteen">${softDie({value:APP.contentDiceLastRoll||1,front:false})}</button><p id="contentDiceRoll" role="status">${APP.contentDiceLastRoll?'Je gooide '+APP.contentDiceLastRoll+'.':'Gooi de dobbelsteen.'}</p><p>Tel zoveel opdrachten verder. Kom je bij dezelfde opdracht? Ga dan één verder.</p></section><article class="active-card"><div class="card-ribbon" style="--ribbon:#087ff5"><strong>Dobbelspel</strong><span class="card-counter">${counter}</span></div><div class="card-content content-reading" data-content-item-id="${esc(item.content_item_id)}">${contentTaskText(item)}<button class="smallbtn content-reveal" id="contentDiceReveal" aria-expanded="false" aria-controls="contentDiceAnswer">${contentAnswerLabel(item)}</button><div id="contentDiceAnswer" class="content-answer" hidden>${contentAnswerText(item,policy)}</div></div></article></div></div>${gameBar('<button class="primary card-next-primary table-roll" id="primaryGame">GOOIEN</button>')}</div>`;
 goScreen('game');bindGameBar(rollContentDice);$('#contentDie').onclick=rollContentDice;SmoothDice.mount();$('#contentDiceReveal').onclick=()=>{const box=$('#contentDiceAnswer'),open=box.hidden;box.hidden=!open;$('#contentDiceReveal').setAttribute('aria-expanded',String(open))};
}
async function rollContentDice(){
 const list=contentSessionDice(),mount=$('#contentDie');if(contentDiceBusy||!list.length||!mount)return;
 rememberAction('dobbelsteen gooien');contentDiceBusy=true;$('#primaryGame').disabled=mount.disabled=true;updateUndo();
 try{
  const roll=1+Math.floor(Math.random()*6);mount.innerHTML=softDie({value:roll,front:false});SmoothDice.mount();playDiceSound();
  if(!settingsState().reducedMotion&&!matchMedia('(prefers-reduced-motion: reduce)').matches)await SmoothDice.roll(mount.querySelector('.smooth-die-host'),780);
  if(!mount.isConnected||!$('#screen-game').classList.contains('active'))return;
  const index=APP.contentDiceIndex||0;let next=(index+roll)%list.length;if(list.length>1&&next===index)next=(next+1)%list.length;
  APP.contentDiceLastRoll=roll;APP.contentDiceIndex=next;completeTurn();save();startContentDice();
 }finally{contentDiceBusy=false;if(mount.isConnected){mount.disabled=false;$('#primaryGame').disabled=false}updateUndo()}
}
function contentSessionCards(){const session=contentVertSession();return session?ContentRuntime.enginePool('CARDS',session):[]}
function startContentCards(){
 const session=contentVertSession();if(!session)return toast('Kies eerst de inhoud voor je les.');
 const list=contentSessionCards();if(!list.length)return toast('Deze contentsessie bevat geen kaarten.');
 APP.cardKind='content-vert001';APP.cardIndex=((APP.cardIndex||0)%list.length+list.length)%list.length;
 const item=list[APP.cardIndex],projection=ContentRuntime.project('CARDS',item),policy=projection.answerPolicy,counter=`${APP.cardIndex+1} van ${list.length}`,label=contentSessionLabel(session,item);
 setLast('card',label,{kind:'content-vert001',contentItemId:item.content_item_id});
 $('#gameMount').innerHTML=`<div class="game-shell card-table-shell content-vert001-cards${item.reasoning?' reasoning-cards':''}"><div class="game-work card-work"><div class="card-activity-heading"><h1>${esc(contentSessionLabel(session,item,false))}</h1></div><div class="cards-stage"><div class="deckpanel"><button class="card-deck-button" id="contentCardDeck" aria-label="Volgende kaart trekken"><span class="play-card-back" style="--deck-color:#176b9a"><img class="card-brand" src="assets/brand/taalroute-white.svg" alt="Taalroute">${gameIcon('cards')}<span class="card-family">Volgende kaart</span></span></button></div><div class="game-card-motion"><article class="active-card"><div class="card-ribbon" style="--ribbon:#176b9a"><strong>${esc(item.title||item.language_function.replaceAll('_',' '))}</strong><span class="card-counter">${counter}</span></div><div class="card-content content-reading" data-content-item-id="${esc(item.content_item_id)}">${contentTaskText(item)}${item.reasoning?'':`<button class="smallbtn content-reveal" id="contentCardReveal" aria-expanded="false" aria-controls="contentCardAnswer">${contentAnswerLabel(item)}</button><div id="contentCardAnswer" class="content-answer" hidden>${contentAnswerText(item,policy)}</div>`}</div></article></div></div></div>${gameBar(`<button class="primary card-next-primary" id="primaryGame">${cardFan()}<span>VOLGENDE KAART</span></button>`)}</div>`;
 goScreen('game');bindGameBar(()=>nextContentCard(1));$('#contentCardDeck').onclick=()=>nextContentCard(1);if($('#contentCardReveal'))$('#contentCardReveal').onclick=()=>{const box=$('#contentCardAnswer'),open=box.hidden;box.hidden=!open;$('#contentCardReveal').setAttribute('aria-expanded',String(open))};
}
function nextContentCard(direction=1){const list=contentSessionCards();if(!list.length)return;APP.cardIndex=(APP.cardIndex||0)+(direction===-1?-1:1);if(direction!==-1)completeTurn();startContentCards();save()}
let cardBusy=false;
async function nextCard(direction=1){
 if(APP.cardKind==='content-vert001')return nextContentCard(direction);
 if(cardBusy)return;cardBusy=true;
 try{
  const kind=APP.cardKind;
  APP.cardIndex=(APP.cardIndex||0)+(direction===-1?-1:1);delete APP.cardRound;
  if(direction!==-1)completeTurn();startCards(kind);save();
  const card=$('.game-card-motion'),shell=card.closest('.game-shell');
  shell.setAttribute('aria-busy','true');const controls=[...shell.querySelectorAll('button,select')].map(b=>[b,b.disabled]);controls.forEach(([b])=>b.disabled=true);updateUndo();
  try{await animateCard(card,$('#cardDeck')).finished.catch(()=>{})}
  finally{if(shell.isConnected){controls.forEach(([b,disabled])=>b.disabled=disabled);shell.removeAttribute('aria-busy')}}
 }finally{cardBusy=false;updateUndo()}
}
function prepareCards(kind){return kind==='c1-between-lines'?ContentUI.openBetweenLines():startCards(kind)}
function startCards(kind){
 if(globalThis.ReleasePolicy?.enabled&&kind!=='content-vert001')return ContentUI.open({engine:'CARDS'});
 stopTongueAudio();
 if(kind==='content-vert001')return startContentCards();
 if(kind==='tongue')return startTongue();
 if(kind==='c1-between-lines')return startC1();
 const family=CARD_GAMES.find(x=>x.id===kind);if(!family)return toast('Dit kaartspel is niet beschikbaar.');
 const list=cardsFor(kind);if(!list.length)return toast('Deze route bevat geen kaarten.');APP.cardKind=kind;APP.cardIndex=((APP.cardIndex||0)%list.length+list.length)%list.length;
 const c=list[APP.cardIndex],state=cardRound(c),sm=shapeMeta(c.primaryShape),counter=`${APP.cardIndex+1} van ${list.length}`;
 setLast('card',`${family.title} · ${c.route}`,{kind});
 const rebus=c.visualRebus,extra=rebus?rebus.context:c.taskData.filter(t=>t!==c.situation);
 const media=c.mediaRequirements.items.map(m=>`<table class="card-input-table"><caption>${esc(m.title)}</caption><thead><tr>${m.headers.map(t=>`<th scope="col">${esc(t)}</th>`).join('')}</tr></thead><tbody>${m.rows.map(row=>`<tr>${row.map(t=>`<td>${esc(t)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('');
 const delayed=c.partnerMode==='guided_reveal',reveal=c.reveal||(delayed?{label:'Toon de partnerreactie',text:c.partnerPrompt,after:c.partnerDelivery.revealAt}:null);
 const partner=c.prediction?`<div class="card-step"><strong>Eerst ieder een eigen keuze</strong><p>${esc(c.prediction.instruction)}</p><button class="smallbtn" id="predictionReady" aria-pressed="${state.predictionReady}">${state.predictionReady?'Beiden hebben gekozen ✓':'Beiden hebben hun keuze vastgelegd'}</button><div id="predictionDiscussion" ${state.predictionReady?'':'hidden'}><p>${esc(c.partnerPrompt)}</p></div></div>`:!delayed?`<div class="card-step"><strong>Voor de gesprekspartner · ${c.participants.min} deelnemers</strong><p>${esc(c.partnerPrompt)}</p></div>`:'';
 const revealHtml=reveal?`<div class="card-step"><p>Onthullen: ${esc(c.reveal?'na '+reveal.after:reveal.after)}. De onthulling is zichtbaar voor iedereen.</p><button class="smallbtn" id="cardReveal" aria-expanded="${state.revealed}" aria-controls="cardRevealed">${esc(reveal.label)}</button><p id="cardRevealed" ${state.revealed?'':'hidden'}>${esc(reveal.text)}</p></div>`:'';
 const closed=c.closedStep.enabled?`<form id="closedChoice" class="card-step"><fieldset><legend>${esc(c.closedStep.prompt)}</legend>${c.closedStep.options.map(o=>`<label><input type="radio" name="choice" value="${esc(o.id)}" required ${state.choice===o.id?'checked':''}> ${esc(o.label)}</label>`).join('')}<button class="smallbtn" type="submit">Controleer deze keuze</button></fieldset><p id="closedFeedback" role="status">${state.choice?esc(c.closedStep.explanation):''}</p></form>`:'';
 renderCardTable(kind,counter,`<div class="card-ribbon" style="--ribbon:${sm.color}"><span class="card-shape" aria-hidden="true">${esc(sm.symbol)}</span><strong>${esc(sm.task)}</strong><span class="card-counter">${esc(c.route)} · ${counter}</span></div><div class="card-content" data-card-id="${esc(c.id)}"><h2 style="color:${sm.color}">${esc(rebus?.title||c.title)}</h2>${rebus?`<button class="rebus-preview" id="cardRebus" aria-label="Vergroot de rebus">${rebusImage(c)}<span>Vergroot de rebus</span></button>`:''}<p class="card-instruction">${esc(rebus?.instruction||c.instruction)}</p><div class="card-situation"><div><strong>${rebus?'Kijk en puzzel':c.practiceText?'Oefentekst':'Situatie'}</strong><p>${esc(rebus?'Benoem de plaatjes. Voer de letteraanwijzingen uit. Lees van links naar rechts.':c.situation)}</p>${extra.length?`<ul>${extra.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</div></div>${media}${closed}<div class="supportbox" id="cardSupport" data-section="help" aria-live="polite"><div data-support="goals"><strong>Doel en rollen</strong><p>${esc(c.goal)}</p><p>Met: ${esc(c.conversationPartner)}</p><p>${c.participants.min} deelnemers: ${c.participants.roles.map(esc).join(', ')}</p></div><div data-support="partner">${partner}${revealHtml}</div><div data-support="help"><strong>Hulp</strong><ul>${c.help.items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>${c.practiceText?'<p>De docent mag eerst voordoen. Verstaanbaarheid gaat voor snelheid.</p>':''}</div><div data-support="example"><strong>${c.answerType==='hybrid'?'Oplossing en uitleg':'Mogelijk voorbeeld'}</strong>${rebus?`<p>${esc(rebus.explanation)}</p>`:''}<p>${esc(c.model.text)}</p><p class="card-feedback-note">${esc(c.criterion)}</p></div></div></div>`);
}

/* Woorden en zinnen */
renderWordGoals();
$$('[data-wordgame]').forEach(b=>b.onclick=()=>startWords(b.dataset.wordgame));
/* Lessen */
$('[data-start-work]').onclick=()=>{if(!tw)return toast('Taalworp wordt geladen.');startTaalworp('SET_A2_WERK')};

/* The cards cabinet uses real set data and CSS covers, not a flattened mockup. */
function collectionItems(){
 const cardItems=CARD_GAMES.map(({id,title,description,color,pilot})=>({id,type:'cards',title,description,symbol:'◌',color,meta:cardsFor(id,true).length+(id==='c1-between-lines'?' kaarten · B1/B2 · 5 onderdelen':id==='tongue'?' tongbrekers · A0–C2':' kaarten · 7 taalroutes')}));
 const images=story.collections.filter(s=>s.status==='ready').map(({id,label,count})=>({id,type:'story',title:label,description:`Kies ${storyCounts(id).join(', ').replace(/, ([^,]*)$/, ' of $1')} beeldstenen voor je verhaal.`,symbol:'✦',color:'#237e85',meta:count+' beelden',image:storyIcons(id)[0]?.file}));
 const verbs=Object.values(tw.sets.sets).filter(x=>x.availabilityStatus==='ready').map((x,i)=>({id:x.id,type:'verbs',title:x.label,description:x.description,symbol:['✦','Aa','↗','◌'][i%4],color:'#187bbb',meta:x.recordIds.length+' kaarten · '+x.level}));
 return [...cardItems,...images,...verbs,...(window.DIGIBORD_DATA.cardCatalog||[])];
}
function cabinetSetInfo(type,id){
 const item=collectionItems().find(x=>x.type===type&&x.id===id);if(!item)return null;
 if(type==='verbs'){const set=tw.sets.sets[id],records=set.recordIds.map(key=>tw.manifest.verbs[key]).filter(Boolean);return {...item,records,activity:'Taalworp',format:'Werkwoorden op tekstkaarten',how:'Een kaart geeft het werkwoord. De gekleurde dobbelstenen bepalen wie, tijd en zinsvorm. Samen maak je een passende zin.',samples:Array.from({length:Math.min(6,records.length)},(_,i)=>records[Math.floor(i*(records.length-1)/5)].lemma)}}
 if(type==='story'){const records=storyIcons(id);return {...item,records,activity:'Verhaalworp',format:'Afbeeldingen op beeldstenen',how:'Gooi de beeldstenen en vertel een verhaal met de actieve beelden. Je kunt stenen uitzetten of vasthouden.',samples:records.slice(0,6)}}

 const records=cardsFor(id,true);if(id==='c1-between-lines'){const reviewed=ContentRuntime.items().filter(i=>i.topic==='tussen-de-regels').map(i=>({id:i.content_item_id,level:i.cefr_level,expression:i.title,question:i.prompt}));return {...item,records:reviewed,activity:item.title,format:'B1 · B2',how:'Kies een niveau en een spel. Bespreek de betekenis en bekijk daarna de uitleg.',samples:reviewed};}if(id==='tongue')return {...item,description:records.length+' tongbrekers',records,activity:item.title,format:'Tongbrekers',how:'',samples:records};return {...item,records,activity:item.title,format:'Tekstkaarten met hulp en een voorbeeldantwoord',how:id==='mission'?'Je krijgt een praktische taalopdracht. Speel de situatie met een ander en bekijk zo nodig het voorbeeld.':'Gebruik de vraag of opdracht om een gesprek te beginnen. Vertel, vraag door en laat anderen reageren.',samples:records.slice(0,3)};
}
function openCabinetSet(type,id){
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 if(type==='source'){
  const item=collectionItems().find(x=>x.type===type&&x.id===id);if(!item)return;
  openGameDialog(item.title,`<p><b>${esc(item.meta)}</b></p><p>${esc(item.description)}</p>${item.samples.length?`<h3>In deze bron</h3><ul>${item.samples.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}<p>${item.cardGameId?'Deze kaarten kun je spelen via de kaartenkast.':'Dit materiaal staat op Google Drive en is nog niet aangesloten als speelbare set.'}</p><a class="primary" href="${item.url}" target="_blank" rel="noopener">Bekijk bron op Google Drive ↗</a>`);return;
 }

 const info=cabinetSetInfo(type,id);if(!info?.records.length)return toast('Deze set bevat op dit niveau nog geen kaarten.');
 goScreen('collection');const section=$('#screen-collection');
 const pictures=type==='story';
 const preview=type==='verbs'?`<div class="detail-words">${info.samples.map(w=>`<span>${esc(w)}</span>`).join('')}</div><details class="set-all-records"><summary>Bekijk alle ${info.records.length} werkwoorden</summary><div class="detail-words">${info.records.map(v=>`<span>${esc(v.lemma)}</span>`).join('')}</div></details>`:pictures?`<div class="detail-pictures">${info.samples.map(x=>`<figure><img src="${x.file}" alt="${esc(x.label)}"><figcaption>${esc(x.label)}</figcaption></figure>`).join('')}</div>`:`<div class="detail-text-cards">${info.records.map(c=>`<article><small>${esc(c.level||c.entryLevel||c.route)}</small><h3>${esc(c.expression||c.text||c.visualRebus?.title||c.title)}</h3>${rebusImage(c)}<p>${esc(c.text?'':c.question||c.visualRebus?.instruction||c.instruction)}</p></article>`).join('')}</div>`;
 section.innerHTML=`<button class="smallbtn" id="backToCabinet">← Terug naar de kaartenkast</button><div class="set-detail"><aside class="set-detail-cover">${cabinetCover(info)}<span>${esc(info.meta)}</span></aside><div class="set-detail-main"><span class="eyebrow">${esc(info.format)}</span><h1 tabindex="-1" id="setDetailTitle">${esc(info.title)}</h1><p class="set-detail-description">${esc(info.description)}</p><p>${esc(info.how)}</p><div class="set-start-row"><button class="primary" id="startCabinetActivity">Start ${esc(info.activity)}</button>${type==='story'?`<label>Aantal stenen <select id="setStoryCount">${storyCounts(id).map(n=>`<option value="${n}">${n} stenen</option>`).join('')}</select></label>`:''}<span>${type==='cards'?(id==='c1-between-lines'?'B1 · B2':id==='tongue'?'A0–C2':'Alle 7 taalroutes'):'Niveau: '+esc(APP.level)}</span></div><div class="set-preview"><h2>Dit zit in deze set</h2>${preview}</div></div></div>`;
 $('#backToCabinet').onclick=()=>goScreen('collection');$('#startCabinetActivity').onclick=()=>startCabinetActivity(info,Number($('#setStoryCount')?.value||3));section.scrollTop=0;$('#setDetailTitle').focus();
}
window.CONTENT_VERT001={
 start(options={}){if(!window.ContentRuntime)throw new Error('ContentRuntime ontbreekt.');const session=ContentRuntime.activateSession(options);APP.contentSessionConfig=JSON.parse(JSON.stringify(session));APP.contentVert001Used={};save();return session},
 restore(){if(!APP.contentSessionConfig)return null;const session=ContentRuntime.restoreSession(APP.contentSessionConfig);APP.contentVert001Used??={};return session},
 stop(){if(APP.contentBoardBaseline){for(const [board,state] of Object.entries(APP.contentBoardBaseline))APP.boardStates[board]=state;delete APP.contentBoardBaseline;}ContentRuntime?.clearSession?.();delete window.contentRestoreError;delete APP.contentSessionConfig;delete APP.contentVert001Used;save()},
 session(){return ContentRuntime?.activeSession?.()||null},
 board(id='rotterdam'){if(!this.session())this.start();startBoard(id)},
 wheel(){if(!this.session())this.start();if(!window.DigiActivities)return toast('Draaiwiel is nog niet geladen.');window.DigiActivities.start('draaiwiel')},
 cards(){if(!this.session())this.start();APP.cardIndex=0;startCards('content-vert001')},
 dice(){if(!this.session())this.start();APP.contentDiceIndex=0;APP.contentDiceLastRoll=0;startContentDice()},
 quiz(){if(!this.session())this.start();if(!window.DigiActivities)return toast('Categorieënquiz is nog niet geladen.');window.DigiActivities.start('categorieenquiz')},
 sequence(){if(!this.session())this.start();if(!window.DigiActivities)return toast('Rangschikken is nog niet geladen.');window.DigiActivities.start('rangschikken')}
};
function startCabinetActivity(info,count=3){
 if(globalThis.ReleasePolicy?.enabled)return toast(ReleasePolicy.message);
 if(info.type==='verbs'){twDiceState={};APP.verbLocked=false;APP.taalworpSet=null;startTaalworp(info.id)}
 else if(info.type==='story'){APP.storyRoll=[];APP.storyLocks={};APP.storyEnabled={};APP.storyCount=[3,6,9].includes(count)?count:3;startStory(info.id)}
 else{APP.cardIndex=0;delete APP.storyCardIds;prepareCards(info.id)}
}
function cardEffect(){const effect=settingsState().cardAnimation;return ['draw','slide','turn'].includes(effect)?effect:'draw'}
function cabinetMotion(effect,dx=-3,dy=3){
 if(effect==='slide')return {duration:650,origin:'center',frames:[{transform:`translate(${dx}px,${dy}px) rotate(-4deg)`,opacity:0},{transform:'translate(18px,-5px) rotate(4deg)',opacity:1,offset:.7},{transform:'none',opacity:1}]};
 if(effect==='turn')return {duration:800,origin:'left center',frames:[{transform:'rotateY(-180deg)'},{transform:'rotateY(12deg)',offset:.85},{transform:'none'}]};
 return {duration:950,origin:'center',frames:[{transform:`translate(${dx}px,${dy}px) rotateY(-180deg) rotate(-3deg)`},{transform:`translate(${dx*.82}px,${dy-28}px) rotateY(-160deg) rotate(-9deg)`,offset:.25},{transform:`translate(${dx*.3+22}px,${dy*.3-18}px) rotateY(-65deg) rotate(6deg)`,offset:.65},{transform:'translate(3px,2px) rotate(2deg)',offset:.9},{transform:'none'}]};
}
function animateCard(card,deck,preview=false){
 if(settingsState().reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches)return {finished:Promise.resolve()};
 const to=card.getBoundingClientRect(),from=deck?.getBoundingClientRect();
 const dx=preview?-3:from?.width?from.left+from.width/2-to.left-to.width/2:-Math.min(to.width*.35,100),dy=preview?3:from?.width?from.top+(from.height||0)/2-to.top-(to.height||0)/2:8;
 const effect=cardEffect(),motion=cabinetMotion(effect,dx,dy);
 if(!preview&&from?.width&&effect!=='turn'){const scale=Math.min(1,from.width/to.width);motion.frames[0].transform+=` scale(${scale})`;motion.frames[1].transform+=` scale(${(1+scale)/2})`;if(effect==='draw')motion.frames[2].transform+=' scale(.85)'}
 card.style.transformOrigin=motion.origin;
 return card.animate(motion.frames,{duration:motion.duration,easing:'cubic-bezier(.25,.6,.3,1)'});
}
function playCabinetEffect(deck,info){
 if(!deck)return;deck.previewAnimation?.cancel?.();deck.querySelector('.cabinet-reveal')?.remove();
 const sample=info?.samples?.[0],pictures=info?.type==='story';
 const content=pictures?`<img src="${sample.file}" alt="${esc(sample.label)}"><strong>${esc(sample.label)}</strong>`:info?.type==='verbs'?`<small>WERKWOORDKAART</small><strong>${esc(sample||'werken')}</strong><span>Maak een passende zin.</span>`:sample?.visualRebus?rebusImage(sample):`<small>OPDRACHT</small><strong>${esc(sample?.expression||sample?.title||'Naam')}</strong><span>${esc((sample?.question||sample?.instruction||'Hoe heet jij?').slice(0,90))}${sample?.instruction?.length>90?'…':''}</span>`;
 const reveal=document.createElement('span');reveal.className='cabinet-reveal';reveal.setAttribute('aria-hidden','true');reveal.innerHTML=`<span class="preview-front">${content}</span><span class="preview-back">${cardBack(info?.title||'Kaarten')}</span>`;deck.appendChild(reveal);
 deck.previewAnimation=animateCard(reveal,deck,true);
}
function cabinetCover(item){return `<span class="cabinet-deck" style="--deck-color:${item.color}" aria-hidden="true"><span class="cabinet-cover">${cardBack(item.title,{cards:'Kaartspel',story:'Beeldset',verbs:'Taalworp',source:item.status}[item.type])}</span></span>`}
function openCabinet(type='all'){cabinetType=type;cabinetQuery='';goScreen('collection')}

let cabinetType='all',cabinetQuery='';
function renderCollection(){
 const items=collectionItems(),section=$('#screen-collection');
 section.innerHTML=`<div class="cabinet-heading"><div><span class="eyebrow">SPELEN / KAARTENKAST</span><h1>Kaartspellen</h1><p>Alle kaartensets op één plek. Kies een spel of bekijk het materiaal op Drive.</p></div><button class="smallbtn" id="cabinetBackToPlay">← Spelen</button></div>
 <p class="cabinet-motion-note">Klik op een stapel om een kaart af te pakken. De kaartbeweging kies je bij <button class="smallbtn" id="cabinetMotionSettings">Instellingen</button>.</p><div class="cabinet-filters" role="group" aria-label="Soort materiaal"><button class="cabinet-filter active" data-cabinet="all" aria-pressed="true">Alles <b>${items.length}</b></button><button class="cabinet-filter" data-cabinet="cards" aria-pressed="false">Kaartspellen <b>${items.filter(x=>x.type==='cards').length}</b></button><button class="cabinet-filter" data-cabinet="verbs" aria-pressed="false">Werkwoordkaarten <b>23</b></button><button class="cabinet-filter" data-cabinet="story" aria-pressed="false">Beeldsets <b>${items.filter(x=>x.type==='story').length}</b></button><button class="cabinet-filter" data-cabinet="source" aria-pressed="false">Op Drive <b>${items.filter(x=>x.type==='source').length}</b></button><label class="cabinet-search"><span class="sr-only">Zoek een set</span><input id="cabinetSearch" type="search" placeholder="Zoek een set…"></label></div>
 <div class="cabinet-note"><span id="cabinetCount" aria-live="polite"></span><span>Niveau voor opdrachten: <b>${esc(APP.level)}</b> · kies bovenaan</span></div><div class="cabinet-grid" id="cabinetGrid"></div>`;
 let type=cabinetType;$('#cabinetSearch').value=cabinetQuery;function filter(){const query=$('#cabinetSearch').value.toLocaleLowerCase('nl'),shown=items.filter(x=>(type==='all'||x.type===type)&&(x.title+' '+x.description).toLocaleLowerCase('nl').includes(query));$('#cabinetCount').textContent=shown.length+' items · '+shown.filter(x=>x.type!=='source').length+' speelbaar';$('#cabinetGrid').innerHTML=shown.length?shown.map(x=>`<article class="cabinet-item"><button class="cabinet-cover-trigger" data-preview-id="${x.id}" data-preview-type="${x.type}" aria-label="${x.type==='source'?'Bekijk bron voor':'Speel kaartbeweging af voor'} ${esc(x.title)}">${cabinetCover(x)}</button><span class="cabinet-copy"><small>${{cards:'SPEELBAAR · KAARTSPEL',story:'SPEELBAAR · BEELDSET',verbs:'SPEELBAAR · TAALWORP',source:'OP DRIVE'}[x.type]}</small><strong>${esc(x.title)}</strong><span>${esc(x.meta)}</span><span class="cabinet-description">${esc(x.description)}</span></span><button class="cabinet-open" data-cabinet-id="${x.id}" data-cabinet-type="${x.type}">${x.type==='source'?'Bekijk bron':'Bekijk inhoud'} <b aria-hidden="true">↗</b></button></article>`).join(''):'<p class="cabinet-empty">Geen set gevonden. Probeer een andere naam of kies Alle sets.</p>';
 section.querySelectorAll('[data-preview-id]').forEach(b=>b.onclick=()=>b.dataset.previewType==='source'?openCabinetSet('source',b.dataset.previewId):playCabinetEffect(b.querySelector('.cabinet-deck'),cabinetSetInfo(b.dataset.previewType,b.dataset.previewId)));
 section.querySelectorAll('[data-cabinet-id]').forEach(b=>b.onclick=()=>openCabinetSet(b.dataset.cabinetType,b.dataset.cabinetId));}
 $('#cabinetMotionSettings').onclick=openSettings;$('#cabinetBackToPlay').onclick=home;
 section.querySelectorAll('[data-cabinet]').forEach(b=>b.onclick=()=>{type=b.dataset.cabinet;cabinetType=type;section.querySelectorAll('[data-cabinet]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});filter()});$('#cabinetSearch').oninput=()=>{cabinetQuery=$('#cabinetSearch').value;filter()};section.querySelectorAll('[data-cabinet]').forEach(x=>{x.classList.toggle('active',x.dataset.cabinet===type);x.setAttribute('aria-pressed',String(x.dataset.cabinet===type))});filter();
}
/* Shared classroom controls */
const LEVELS=['Alpha A','Alpha B','Alpha C','A0','A1','A1+','A2','B1','B2','C1','C2'];
function selectedTaskRoute(){return taskBank.routes[APP.level.startsWith('Alpha')||APP.level==='A0'?0:APP.level==='A1'?1:['A1+','A2'].includes(APP.level)?2:3]}
function levelInstruction(){const session=globalThis.ContentRuntime?.activeSession?.();if(session?.selected_game_engine)return 'Volg de opdracht op de kaart. Bespreek het antwoord samen en gebruik zo nodig het voorbeeld.';return APP.level.startsWith('Alpha')?'Wijs aan en zeg het woord. De docent kan voorlezen.':APP.level==='A0'?'Gebruik een woord of een korte vaste zin.':APP.level==='A1'?'Maak een korte zin.':APP.level==='A1+'?'Maak enkele korte zinnen en voeg een detail toe.':APP.level==='A2'?'Vertel in enkele zinnen en geef een reden.':APP.level==='B1'?'Leg je antwoord uit en stel een vervolgvraag.':APP.level==='B2'?'Onderbouw je antwoord en bespreek een tegenargument.':APP.level==='C1'?'Nuanceer je standpunt en pas je register aan je gesprekspartner aan.':'Formuleer precies, bespreek impliciete aannames en herformuleer voor een ander publiek.'}
function adaptTask(c){return{...c,input:[c.input,levelInstruction()].filter(Boolean).join(' ')}}
function openGameDialog(title,body,bind){
 const dlg=$('#gameDialog');$('#dialogTitle').textContent=lessonText(title);$('#dialogBody').innerHTML=body;
 if(!dlg.open)dlg.showModal();bind?.();
}
function currentGameRules(){
 const type=APP.last?.type;
 if(type==='activity'&&APP.last.data.kind==='content-dice')return 'Gooi de dobbelsteen. Tel zoveel opdrachten verder; na de laatste tel je door vanaf de eerste. Kom je bij dezelfde opdracht? Ga dan één verder. Lees de situatie, voer de opdracht uit en bespreek samen een mogelijk antwoord. Terug herstelt je vorige worp.';
 if(type==='word'&&APP.last.data.kind==='wz')return 'Kies eerst het taaldoel, daarna moeilijkheid en oefenvorm. Bouw met de aangeboden delen, kies een antwoord of schrijf een gewijzigde zin. Controleren vergelijkt gesloten antwoorden met het model. Andere formuleringen bespreek je met de docent. Spreek, Transfer en Raad krijgen geen automatische score. Bij Raad toon je aanwijzingen één voor één; met het oog onthul je het woord. Volgende kaart wisselt de beurt.';
 if(type==='board')return 'Gooi en volg de weg. Voer de opdracht bij je aankomstvak uit. Hulp en Voorbeeld ondersteunen de docent. De eerste spatie gooit en opent de opdracht. De volgende spatie sluit de opdracht, rondt de beurt af en gooit meteen voor de volgende speler. Terug herstelt de vorige opdracht en pionstanden. Bij de steiger mag je kiezen voor de watertaxi. Wie aankomt bij het laatste vak, rondt nog één opdracht af. Als iedereen binnen is, begint een nieuwe ronde.';
 if(type==='taalworp')return 'Trek een werkwoordkaart en gooi de taalstenen. Maak een zin die aan de actieve voorwaarden voldoet. Klik op een steen om hem aan of uit te zetten. Met het slotje zet je een waarde vast of geef je deze vrij. Het voorbeeld gebruikt de huidige worp. Rond de beurt af voordat de volgende speler speelt.';
 if(type==='story')return 'Gooi drie, zes of negen beeldstenen. Vertel een samenhangend verhaal met alle beelden. Klik op een steen om hem aan of uit te zetten. Uitgeschakelde stenen zijn grijs en rollen niet mee. Gebruik het slotje om een actief beeld vast te houden of vrij te geven. Rond je beurt af met de knop onder de beelden.';
 if(type==='card'&&APP.cardKind==='c1-between-lines')return 'Kies zelfstandig één antwoord. Je ziet direct goed of fout, het juiste antwoord, uitleg en Let op. Gebruik het domeinfilter of blader met Vorige kaart en Volgende kaart.';
 if(type==='card'&&CARD_GAMES.find(x=>x.id===APP.cardKind)?.pilot)return APP.cardKind==='tongue'?'Laat de docent voordoen en oefen op je eigen tempo. Hulp deelt de tekst op. Gebruik de vervolgopdracht onder Meer. Volgende kaart wisselt de beurt.':'Geef eerst samen of mondeling een antwoord. Hulp geeft een aanwijzing; Oplossing toont het antwoord met uitleg. Bespreek hoe je het vond en doe de vervolgopdracht onder Meer. Volgende kaart wisselt de beurt.';
 if(type==='card')return 'Lees de kaart of laat de docent voorlezen. Geef je antwoord, laat een ander reageren en bekijk zo nodig de hulp. Volgende kaart rondt je beurt af en geeft de volgende speler een nieuwe kaart.';
 return 'Overleg met je maatje en maak met alle woorden een zin. Eén zegt de zin, de ander luistert en helpt. Voorbeeld toont een mogelijke uitwerking. Leg de zin opent woordtegels om zelf te tikken of slepen; controleren kan daar op de kaart. Volgende kaart geeft een nieuwe opdracht aan de volgende deelnemer.';
}
function refreshCurrentGame(){if($('#screen-game').classList.contains('active'))resumeLast(true)}
function syncLevelSelect(cards=$('#screen-game').classList.contains('active')&&APP.last?.type==='card'){
 const select=$('#levelSelect'),session=$('#screen-game.active')&&globalThis.ContentRuntime?.activeSession?.();
 if(session){select.disabled=true;select.setAttribute('aria-label','Niveau van deze les');select.innerHTML=`<option>${esc(session.cefr_levels.join(' + '))}</option>`;return}
 const fixed=cards&&APP.cardKind==='c1-between-lines';
 select.disabled=fixed;select.dataset.tongue=select.dataset.routes='false';
 select.setAttribute('aria-label',fixed?'Niveau Nederlands tussen de regels':'Niveau');
 select.innerHTML=fixed?'<option value="C1">C1</option>':LEVELS.map(l=>`<option value="${l}">${esc(CARD_ROUTES[['A0','A1','A1+','A2','B1','B2','C1'].indexOf(l)]?.label||l)}</option>`).join('');
 select.value=fixed?'C1':APP.level;
}
function resetLevelContent(){
 delete APP.cardRoute;delete APP.tongueLevel;APP.cardIndex=0;delete APP.cardRound;twDiceState={};
 for(const state of Object.values(APP.boardStates))if(state.pending)delete state.pending.task;
}
function selectLevel(level){
 if(!LEVELS.includes(level))return;
 if(APP.level!==level){APP.level=level;resetLevelContent()}
 settingsPatch({route:CARD_ROUTES.find(r=>r.id===defaultCardRoute()).label.replace('→',' → ')});save();syncLevelSelect();refreshCurrentGame();
 if($('#screen-collection').classList.contains('active'))renderCollection();
}
if(APP.levelPreferenceVersion!==1){
 const route=['A0','A1','A1+','A2','B1','B2','C1'][CARD_ROUTES.findIndex(r=>r.id===APP.cardRoute)];
 if(APP.last?.data?.kind==='tongue'&&LEVELS.includes(APP.tongueLevel))APP.level=APP.tongueLevel;
 else if(route)APP.level=route;
 APP.levelPreferenceVersion=1;save();
}
syncLevelSelect(false);
$('#levelSelect').onchange=e=>selectLevel(e.target.value);
$('#dialogClose').onclick=()=>$('#gameDialog').close();

window.addEventListener('keydown',e=>{
 if(e.code!=='Space'||e.repeat||e.target.closest('#curriculumContext')||$('#curriculumPanel').matches(':popover-open')||e.target.closest('input,textarea,select,[contenteditable=true]')||e.target.closest('button,summary,.context-tool')||$('#settingsOverlay').classList.contains('open')||$('#gameDialog').open||!$('#screen-game').classList.contains('active'))return;
 e.preventDefault();if(APP.last?.type==='board'){if(!boardBusy&&$('#taxiChoice').hidden)rememberPrimary();boardAction(APP.last.data.board,routeCache[APP.last.data.board])}else $('#primaryGame')?.click();
});

if(location.hash==='#kaartenkast'||location.hash==='#kaartspellen')goScreen('cards');

installContextTooltips();
