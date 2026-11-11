/* Navigation changes the view; only a new task or explicit undo changes the turn. */
(function(root){
 'use strict';
 const routes={play:'spelen',practice:'oefenen',lessons:'mijn-lessen',mycollection:'collectie',boards:'speelborden',dice:'dobbelspellen',cards:'kaartspellen',workforms:'oefenvormen',activities:'oefenbibliotheek',words:'taaldoelen',game:'les'};
 let renderedKey='',renderedCard='',scheduled=false,restoring=false,historyMoving=false,screenAtSettings=null;
 const screen=()=>document.querySelector('.screen.active')?.id.replace('screen-','')||'play';
 const nav=()=>APP.navigation??=( {version:1,sessions:{}} );
 function key(type=APP.last?.type,data=APP.last?.data){
  const session=root.ContentRuntime?.activeSession();
  if(session&&!['taalworp','story'].includes(type)&&!(type==='card'&&data?.kind!=='content-vert001'))return session.session_id;
  return type?type+':'+(data?.kind||data?.board||'')+':'+publicRoute():'';
 }
 function record(k=key()){if(!k)return null;nav().sessions??={};return nav().sessions[k]??={origin:'play',cards:{},history:[],finished:false}}
 function currentId(){return document.querySelector('#gameMount [data-content-item-id],#gameMount [data-card-id]')?.getAttribute('data-content-item-id')||document.querySelector('#gameMount [data-card-id]')?.dataset.cardId||''}
 function deck(){try{return APP.cardShuffles?.[cardShuffleScope()]}catch{return null}}
 function cardKey(id=currentId()){return (deck()?.cycle||1)+':'+id}
 function captureCard(){
  if(restoring||screen()!=='game'||renderedKey!==key()||renderedCard!==currentId()||!renderedCard)return;
  const r=record(),id=cardKey(),old=r.cards[id]||{};
  const content=document.querySelector('#gameMount .card-content'),support=document.querySelector('#cardSupport');
  r.cards[id]={...old,answer:!document.querySelector('#contentCardAnswer')?.hidden&&!!document.querySelector('#contentCardAnswer'),scroll:content?.scrollTop||0,support:support?.classList.contains('open')||false,section:support?.dataset.section||'',...(APP.cardRound?.id===renderedCard?{round:structuredClone(APP.cardRound)}:{})};
 }
 // The new family renders before setLast replaces the previous game's key.
 function restoreRound(card){if(APP.cardRound?.id===card.id)return;const state=record(key('card',{kind:APP.cardKind}))?.cards[cardKey(card.id)]?.round;if(state&&state.id===card.id&&state.bankRevision===RUNTIME.cardGames.source)APP.cardRound=structuredClone(state)}
 function restoreCard(){
  const state=record()?.cards[cardKey()];if(!state)return;
  restoring=true;
  const answer=document.querySelector('#contentCardAnswer'),button=document.querySelector('#contentCardReveal'),support=document.querySelector('#cardSupport');
  if(answer&&button){answer.hidden=!state.answer;button.setAttribute('aria-expanded',String(!!state.answer))}
  if(support){support.classList.toggle('open',!!state.support);support.dataset.section=state.section||'help';const b=document.querySelector(state.section==='example'?'#cardExample':state.section==='partner'?'#cardPartner':'#cardHelp');b?.setAttribute('aria-expanded',String(!!state.support))}
  const content=document.querySelector('#gameMount .card-content');if(content)content.scrollTop=state.scroll||0;
  restoring=false;
 }
 function enterGame(type,data){
  const k=key(type,data),r=record(k),from=screen();if(!r)return;
  if(from!=='game'&&!historyMoving)r.origin=from==='collection'?'cards':from==='play'?(type==='card'?'cards':['taalworp','story'].includes(type)?'dice':type==='board'?'boards':'practice'):from;
  r.finished=false;
 }
 function busy(){return gameIsBusy()||!!root.DigiActivities?.isBusy()}
 function beforeScreen(id){
  if(screen()==='game'&&id!=='game'){
   if(busy()){toast('Wacht tot deze spelactie klaar is.');return false}
   captureCard();captureHistory();root.LessonUI?.checkpoint(true);save();
  }
  return true;
 }
 function afterScreen(id){
  const url=routes[id];
  if(url&&!historyMoving&&location.hash!=='#/'+url)history.pushState({actief:id},'', '#/'+url);
  if(id==='game'){
   renderedKey=key();renderedCard=currentId();restoring=true;queueMicrotask(()=>{restoreCard();restoring=false;refresh();captureHistory()});
  }else refresh();
 }
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;refresh();captureHistory()})}
 function setText(element,value){if(element&&element.textContent!==value)element.textContent=value}
 function refresh(){
  const playing=screen()==='game',r=record(),origin=r?.origin||'practice';
  const active=document.querySelector('.screen.active'),heading=active?.querySelector('h1')?.textContent.trim(),counter=playing?active?.querySelector('.card-ribbon .card-counter')?.textContent.trim():'';
  setText(document.querySelector('#navigationStatus'),[heading,counter].filter(Boolean).join('. '));
  document.querySelectorAll('#screen-boards .tile[data-board] .status').forEach(el=>{const count=el.textContent.match(/\d+ posities/)?.[0]||'';setText(el,(root.ContentRuntime?.activeSession()?'Met je lopende les':'Kies eerst je les')+' · '+count)});
  document.querySelectorAll('.navitem').forEach(b=>{const active=playing?(['practice','lessons'].includes(origin)?origin:'play'):['practice','lessons','mycollection'].includes(screen())?screen():'play';const selected=b.dataset.main===active;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  const banner=document.querySelector('#lessonResume'),resumeButton=document.querySelector('#resumeBtn');
  banner.hidden=playing||!APP.last||!!resumeButton?.disabled;
  setText(banner.querySelector('span'),APP.last?.label||'');
  const panel=document.querySelector('#appHeader .hdr001-panel');
  if(panel){let menuResume=panel.querySelector('[data-menu-resume]');if(!menuResume){menuResume=document.createElement('button');menuResume.className='smallbtn';menuResume.dataset.menuResume='';menuResume.textContent='Verder met mijn les';menuResume.onclick=resume;panel.append(menuResume)}menuResume.hidden=banner.hidden||innerWidth>1050;}
  document.querySelector('#stage').classList.toggle('has-resume',!banner.hidden);
  if(playing&&APP.last?.type==='card'&&APP.cardKind!=='story')mountCardNavigation();
  if(playing)root.revealCurrentCardType?.();
  const height=Math.ceil(document.querySelector('#appHeader').getBoundingClientRect().height);
  document.documentElement.style.setProperty('--actief-header-height',height+'px');
 }
 function mountCardNavigation(){
  const next=document.querySelector('#primaryGame'),slot=next?.parentElement,d=deck();if(!next||!slot||!d)return;
  slot.classList.add('card-navigation');
  const shuffle=document.querySelector('#cardOrderReset'),tools=document.querySelector('.game-tools-body');
  const shuffleParent=matchMedia('(max-width:900px), (max-height:650px)').matches?tools:slot;
  if(shuffle&&shuffleParent&&shuffle.parentElement!==shuffleParent)shuffleParent.append(shuffle);
  if(!document.querySelector('#previousCard')){const b=document.createElement('button');b.id='previousCard';b.className='smallbtn';b.textContent='← Vorige';b.setAttribute('aria-label','Vorige opdracht');b.onclick=()=>nextCard(-1);slot.prepend(b);const overview=document.createElement('button');overview.id='cardOverview';overview.className='smallbtn';overview.innerHTML='<span class="card-count"></span><span class="card-overview-label">Overzicht</span>';overview.onclick=showHistory;next.before(overview);}
  document.querySelector('#previousCard').disabled=busy()||d.cursor===0;
  setText(document.querySelector('#cardOverview .card-count'),`${d.cursor+1} van ${d.eligible.length}`);
  const end=d.cursor===d.history.length-1&&!d.queue.length;
  setText(next.querySelector('span'),end?'Afronden':'Volgende →');next.disabled=busy();
  next.setAttribute('aria-label',end?'Les afronden':'Volgende opdracht');
  for(const id of ['cardDeck','contentCardDeck']){const b=document.getElementById(id);if(b){b.disabled=busy();b.setAttribute('aria-label',end?'Les afronden':'Volgende opdracht trekken')}}
 }
 async function resume(){
  if(!APP.last)return;
  await root.LessonUI?.flush();await resumeLast(!!document.querySelector('#gameMount .game-shell')&&renderedKey===key());refresh();
 }
 function beforeLaunch(session,resuming){
  captureCard();captureHistory();
  if(!resuming){root.LessonUI?.checkpoint(true);const r=record(session.session_id);r.origin=screen()==='lessons'?'lessons':'practice'}
 }
 function finish(){
  if(busy())return;captureCard();root.LessonUI?.checkpoint(true);save();
  openGameDialog('Les afronden','<p>De les en voortgang blijven op dit apparaat bewaard. Je kunt later verdergaan.</p><div class="navigation-dialog-actions"><button class="smallbtn" id="continueLesson">Verder met mijn les</button><button class="primary" id="finishLesson">Afronden en naar Spel kiezen</button></div>',()=>{
   document.querySelector('#continueLesson').onclick=()=>document.querySelector('#gameDialog').close();
   document.querySelector('#finishLesson').onclick=async()=>{await root.LessonUI?.flush();record().finished=true;save();document.querySelector('#gameDialog').close();home()};
  });
 }
 function endCards(){
  captureCard();
  openGameDialog('Alle opdrachten bekeken','<p>Je hebt alle opdrachten in deze selectie bekeken. Je kunt terugkijken, de les afronden of de kaarten opnieuw schudden.</p><div class="navigation-dialog-actions"><button class="smallbtn" id="reviewCards">Opdrachten bekijken</button><button class="smallbtn" id="shuffleCardsAgain">Opnieuw schudden</button><button class="primary" id="completeCardLesson">Les afronden</button></div>',()=>{
   document.querySelector('#reviewCards').onclick=()=>{document.querySelector('#gameDialog').close();showHistory()};document.querySelector('#completeCardLesson').onclick=()=>{document.querySelector('#gameDialog').close();finish()};document.querySelector('#shuffleCardsAgain').onclick=()=>{document.querySelector('#gameDialog').close();document.querySelector('#cardOrderReset')?.click()};
  });
 }
 // Keep the previous cycle's answers so undoing a shuffle can restore them.
 function resetCards(){renderedCard=''}
 function cardTitle(id){const item=APP.cardKind==='content-vert001'?root.ContentRuntime?.itemForSession(id):cardsFor(APP.cardKind).find(c=>c.id===id);const reading=item?.content_item_id?root.CardPresentation?.shared(item):null;return reading?.stimulus||item?.title||reading?.instruction||item?.instruction||item?.prompt||'Opdracht'}
 function showHistory(){
  if(APP.last?.type==='card'&&APP.cardKind!=='story'&&deck()){
   captureCard();const d=deck();
   openGameDialog('Bekeken opdrachten',`<p>Terugkijken verandert de beurt niet.</p><div class="navigation-history">${d.history.map((id,i)=>`<button class="smallbtn" data-history-card="${i}" ${i===d.cursor?'aria-current="step"':''}>${i+1}. ${esc(cardTitle(id))}${i===d.cursor?' · nu in beeld':''}</button>`).join('')}</div>`,()=>{
    document.querySelectorAll('[data-history-card]').forEach(b=>b.onclick=()=>{const target=Number(b.dataset.historyCard),current=deck();captureCard();current.cursor=target;current.currentCardId=current.history[target];APP.cardIndex=(APP.cardKind==='content-vert001'?contentSessionCards():cardsFor(APP.cardKind)).findIndex(c=>(c.content_item_id||c.id)===current.currentCardId);delete APP.cardRound;document.querySelector('#gameDialog').close();startCards(APP.cardKind);save();document.querySelector('#cardOverview')?.focus()});
   });return;
  }
  captureHistory();const entries=record()?.history||[];
  openGameDialog('Terugkijken',`<p>Alleen terugkijken: de huidige beurt, worp en score blijven staan.</p><div class="navigation-history">${entries.length?entries.map((entry,i)=>`<details ${i===entries.length-1?'open':''}><summary>${i+1}. ${esc(entry.title)}</summary><div class="history-reading">${entry.images.map(src=>`<img src="${esc(src)}" alt="Afbeelding bij de eerdere opdracht">`).join('')}<p>${esc(entry.text)}</p></div></details>`).join(''):'<p>Hier verschijnen de opdrachten of worpen die je bekijkt.</p>'}</div>`);
 }
 function captureHistory(){
  if(screen()!=='game'||busy()||renderedKey!==key()||APP.last?.type==='card')return;
  let element=document.querySelector('#taskDrawer.open .drawer-body,#taskDrawer.open .task-content');
  if(APP.last?.type==='board')element=element||document.querySelector('#taskDrawer.open');
  else element=document.querySelector(APP.last?.type==='taalworp'?'#gameMount .taalworp-page':'#gameMount .card-content,#gameMount .story-stage');
  if(!element||!element.checkVisibility())return;
  const text=element.innerText.trim();if(!text)return;
  const images=[...element.querySelectorAll('img')].filter(e=>e.checkVisibility()).map(e=>e.getAttribute('src')).filter(src=>src&&/^(assets\/|data:image\/svg\+xml;)/.test(src));
  const progress=root.DigiActivities?.exportProgress(),token=APP.last.type==='board'?JSON.stringify(APP.boardStates[APP.last.data.board]?.pending||{}):APP.last.type==='taalworp'?JSON.stringify([APP.currentVerb,twDiceState]):APP.last.type==='story'?JSON.stringify(APP.storyRoll):JSON.stringify([APP.contentDiceIndex,progress?.kind,progress?.round,progress?.question,progress?.selected]);
  const r=record(),entry={token,title:APP.last.label,text,images},existing=r.history.findIndex(x=>x.token===token);
  if(existing>=0)r.history[existing]=entry;else r.history.push(entry);
 }
 function settingsOpened(){screenAtSettings=screen();if(!historyMoving)history.pushState({actief:'settings',returnTo:screenAtSettings},'','#/instellingen')}
 function settingsClosed(){if(location.hash==='#/instellingen'){history.replaceState({actief:screenAtSettings||screen()},'','#/'+(routes[screenAtSettings||screen()]||'spelen'))}refresh()}
 async function followRoute(id){
  historyMoving=true;
  try{
   if(document.querySelector('#settingsOverlay.open'))closeSettings();
   if(id==='game'){if(APP.last)await resume();else goScreen('play')}else if(id==='settings')openSettings();else if(id==='practice')ContentUI.open({keepLevel:ContentUI.state().keepLevel});else if(id==='lessons'){goScreen(id);await LessonUI.render()}else goScreen(routes[id]?id:'play');
  }finally{historyMoving=false;refresh()}
 }
 root.AppNavigation={resume,beforeScreen,afterScreen,enterGame,schedule,captureCard,restoreRound,beforeLaunch,endCards,resetCards,showHistory,settingsOpened,settingsClosed,finish};
 document.querySelector('.skip-content').onclick=event=>{event.preventDefault();document.querySelector('#stage').focus()};
 document.querySelector('[data-nav-resume]').onclick=resume;
 document.querySelector('#resumeBtn').onclick=resume;document.querySelector('#collectionResume').onclick=resume;
 document.addEventListener('click',()=>{captureCard();captureHistory();queueMicrotask(()=>{captureCard();schedule();if(screen()==='game')save()})},true);
 document.addEventListener('input',event=>{if(event.target.closest('#gameMount')){captureCard();save()}},true);
 window.addEventListener('popstate',event=>{if(busy()){history.pushState({actief:'game'},'','#/les');toast('Wacht tot deze spelactie klaar is.');return}followRoute(event.state?.actief||Object.keys(routes).find(id=>'#/'+routes[id]===location.hash)||'play')});
 new ResizeObserver(refresh).observe(document.querySelector('#appHeader'));
 const requested=Object.keys(routes).find(id=>'#/'+routes[id]===location.hash);
 history.replaceState({actief:requested||screen()},'','#/'+(routes[requested||screen()]||'spelen'));
 if(requested&&requested!==screen())root.AppNavigation.ready=followRoute(requested);else{renderedKey=key();renderedCard=currentId();refresh();root.AppNavigation.ready=Promise.resolve()}
})(globalThis);
