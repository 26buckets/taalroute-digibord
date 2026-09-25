/* Seven starter games on the existing DigiBord card table and shared controls. */
window.DigiActivities = (() => {
 const content=window.DIGIBORD_ACTIVITIES, rounds={}, histories={};
 let kind, state, timer;
 const engineIds={draaiwiel:'WHEEL',memory:'MEMORY',koppelen:'MATCH',sorteren:'SORT',rangschikken:'SEQUENCE',categorieenquiz:'QUIZ','raad-het-woord':'RIDDLE'};
 const game=()=>content.games.find(g=>g[0]===kind);
 const contentSession=()=>window.ContentRuntime?.activeSession?.()||null;
 const shuffled=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const picture=label=>RUNTIME.storydice.icons.find(x=>x.label===label);
 const button=(action,arg,label,extra='')=>`<button type="button" class="na-choice" id="na-${action}-${arg}" data-na="${action}" data-value="${arg}" ${extra}>${label}</button>`;
 const quizData=()=>state?.contentQuiz||content.quiz;
 const quizLabel=value=>String(value||'Mix').replaceAll('_',' ').replace(/\b\w/g,ch=>ch.toLocaleUpperCase('nl'));
 function buildContentQuiz(session){
  const pool=ContentRuntime.enginePool('QUIZ',session),functions=[...new Set(pool.map(item=>item.language_function))],primary=functions.length<=5?functions:functions.slice(0,4),counts={};
  return pool.map(item=>{
   const projection=ContentRuntime.project('QUIZ',item),policy=projection.answerPolicy,options=[...(item.options||[])],answer=options.findIndex(option=>option===item.correct_answer),rawCategory=primary.includes(item.language_function)?item.language_function:'mix',category=rawCategory==='mix'?'Mix':item.title||quizLabel(rawCategory);
   counts[category]=(counts[category]||0)+1;
   return {category,points:Math.min(counts[category],5)*100,question:projection.prompt,options,answer,explanation:item.explanation||item.feedback_correct||item.model_answer,model:item.model_answer,contentItemId:item.content_item_id,interactionType:item.interaction_type,renderer:projection.renderer,manual:!(policy.mode==='canonical_answer'&&options.length>=2&&answer>=0),orderTokens:[...(projection.orderTokens||[])],modelIsExample:policy.modelIsExample};
  });
 }
 function fresh(id,round=0,sessionOverride=contentSession()){
  const s={round,feedback:'',selected:null,done:[],revealed:[],sequence:[],attempts:0,correct:false,hints:1,answer:false,question:null,answers:{},quizRevealed:{},quizResponses:{},team:0,scores:[0,0],rotation:0,busy:false};
  if(id==='memory'||id==='koppelen'){
   const session=sessionOverride;
   if(session){const engine=engineIds[id],pool=ContentRuntime.enginePool(engine,session),offset=(round*6)%pool.length;s.contentSessionId=session.session_id;s.contentPairs=pool.slice(offset,offset+6).map(i=>ContentRuntime.project(engine,i).pair);s.words=s.contentPairs.map(p=>p.left.value);s.order=shuffled(id==='memory'?s.words.flatMap((_,i)=>[i*2,i*2+1]):s.words.map((_,i)=>i));}
   else{s.words=content.pictureSets[round%content.pictureSets.length].words;s.order=shuffled(id==='memory'?s.words.flatMap((_,i)=>[i,i]):s.words.map((_,i)=>i));}
  }
  if(id==='sorteren'){
   const session=sessionOverride;
   if(session){const pool=ContentRuntime.enginePool('SORT',session),offset=(round*6)%pool.length,rows=pool.slice(offset,offset+6),groups=[...new Set(rows.flatMap(i=>i.options))];s.contentSessionId=session.session_id;s.contentSort={title:'Sorteer de functies',groups,items:rows.map(i=>[i.prompt,groups.indexOf(i.correct_answer)]),ids:rows.map(i=>i.content_item_id)};}
   s.order=shuffled((s.contentSort||content.sorting[round%content.sorting.length]).items.map((_,i)=>i));
  }
  if(id==='rangschikken'){
   const session=sessionOverride;
   if(session){
    const pool=ContentRuntime.enginePool('SEQUENCE',session),item=pool[round%pool.length],projection=item?ContentRuntime.project('SEQUENCE',item):null;
    if(projection){s.contentSessionId=session.session_id;s.contentSequence={id:item.content_item_id,title:'Zet de zin in de goede volgorde',prompt:projection.prompt,steps:[...projection.orderExpectedTokens],model:item.model_answer};}
   }
   const sequence=s.contentSequence||content.sequences[round%content.sequences.length];
   s.order=shuffled(sequence.steps.map((_,i)=>i));
   if(s.order.every((x,i)=>x===i))s.order.reverse();
  }
  if(id==='draaiwiel'){
   const session=sessionOverride;
   if(session){const pool=ContentRuntime.enginePool('WHEEL',session),completeCycles=session.wheel_draw_version===2,offset=completeCycles?(round%Math.ceil(pool.length/6))*6:(round*Math.min(6,pool.length))%pool.length,count=Math.min(6,completeCycles?pool.length-offset:pool.length);s.contentSessionId=session.session_id;s.contentOptions=Array.from({length:count},(_,i)=>pool[(offset+i)%pool.length]).map(item=>({id:item.content_item_id,label:item.title||item.language_function.replaceAll('_',' '),prompt:ContentRuntime.displayPrompt(item),choices:item.options,model:item.model_answer}));s.options=s.contentOptions.map((entry,i)=>`${i+1}. ${entry.label}`)}
   else{const offset=(round%content.wheelTitles.length)*6;s.options=content.wheel.slice(offset,offset+6)}
  }
  if(id==='raad-het-woord'&&sessionOverride){const session=sessionOverride,pool=ContentRuntime.enginePool('RIDDLE',session),item=pool[round%pool.length];s.contentSessionId=session.session_id;s.contentRiddle={id:item.content_item_id,word:item.riddle_word,clues:item.clues};}
  if(id==='categorieenquiz'){
   const session=sessionOverride;
   if(session){s.contentSessionId=session.session_id;s.contentQuiz=buildContentQuiz(session)}
  }
  return s;
 }
 function start(id,setId){
  if(globalThis.ReleasePolicy?.enabled&&!ContentRuntime.activeSession()?.game_engines.includes(engineIds[id]))return ContentUI.open({engine:({draaiwiel:'WHEEL',categorieenquiz:'QUIZ',rangschikken:'SEQUENCE',koppelen:'MATCH',memory:'MEMORY',sorteren:'SORT','raad-het-woord':'RIDDLE'})[id]});
  if(!content.games.some(g=>g[0]===id))return;
  const setIndex=setId===undefined?-1:content.pictureSets.findIndex(s=>s.id===setId&&s.forms.includes(id));
  if(setId!==undefined&&setIndex<0)return;
  clearTimeout(timer);kind=id;
  if(setIndex<0){
   const existing=rounds[id],session=engineIds[id]?contentSession():null;
   const wrongWheelState=id==='draaiwiel'&&existing&&((session&&existing.contentSessionId!==session.session_id)||(!session&&existing.contentOptions));
   const wrongQuizState=id==='categorieenquiz'&&existing&&((session&&existing.contentSessionId!==session.session_id)||(!session&&existing.contentQuiz));
   const wrongSequenceState=id==='rangschikken'&&existing&&((session&&existing.contentSessionId!==session.session_id)||(!session&&existing.contentSequence));
   const wrongSession=existing&&existing.contentSessionId!==(session?.session_id);
   state=(wrongSession||wrongWheelState||wrongQuizState||wrongSequenceState)?(rounds[id]=fresh(id)):(rounds[id]??=fresh(id));
  }else state=rounds[id]=fresh(id,setIndex);
  state.busy=false;
  if(setIndex>=0)histories[id]=[];else histories[id]??=[];
  setLast('activity',game()[1],{kind});render();goScreen('game');
 }
 function rootCheckpoint(){window.LessonUI?.checkpoint()}
 function checkpoint(){histories[kind].push({state:structuredClone(state),turn:structuredClone(APP.turn)});histories[kind]=histories[kind].slice(-20)}
 function feedback(text){state.feedback=text}
 const riddleData=()=>state.contentRiddle||content.riddles[state.round%content.riddles.length];
 const sortData=()=>state.contentSort||content.sorting[state.round%content.sorting.length];
 function imageCard(label){const p=picture(label);return `<img src="${esc(p.file)}" alt="${esc(label)}">`}
 function wheelFace(){
  const n=state.options.length,colors=['#126ba5','#174a78','#2686b8'],point=(a,r)=>[200+r*Math.sin(a),200-r*Math.cos(a)];
  const sectors=state.options.map((_,i)=>{const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,[x,y]=point(a,180),[u,v]=point(b,180),[tx,ty]=point((a+b)/2,133);return `<path d="${n===1?'M200 20 A180 180 0 1 1 200 380 A180 180 0 1 1 200 20 Z':`M200 200 L${x} ${y} A180 180 0 ${b-a>Math.PI?1:0} 1 ${u} ${v} Z`}" fill="${colors[i%colors.length]}" stroke="#cce4f3" stroke-width="2"/><text x="${tx}" y="${ty}" transform="rotate(${-state.rotation} ${tx} ${ty})">${i+1}</text>`}).join('');
  const ticks=Array.from({length:60},(_,i)=>{const a=i*Math.PI/30,[x,y]=point(a,i%5?187:183),[u,v]=point(a,192);return `<path d="M${x} ${y}L${u} ${v}"/>`}).join('');
  return `<svg viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="197" fill="#eaf2f7"/>${sectors}<g class="na-wheel-ticks">${ticks}</g></svg>`;
 }
 function body(){
  if(kind==='draaiwiel'){
   const chosen=state.selected!==null&&!state.busy?state.contentOptions?.[state.selected]:null,result=chosen?chosen.prompt:(state.selected!==null&&!state.busy?state.options[state.selected]:'Wat wordt het onderwerp?'),edit=state.contentOptions?'':'<button type="button" class="smallbtn" data-na="edit-wheel">Eigen onderwerpen</button>';
   return `<div class="na-wheel-layout"><div class="na-wheel-frame"><span class="na-pointer" aria-hidden="true"></span><div class="na-wheel" aria-hidden="true" style="transform:rotate(${state.rotation}deg)">${wheelFace()}</div><span class="na-hub" aria-hidden="true">${gameIcon('wheel')}</span></div><div class="na-wheel-result ${chosen?'content-reading':''}" aria-live="polite" aria-atomic="true">${state.selected!==null&&!state.busy?`<span class="na-selected-number">Vak ${state.selected+1}</span>`:''}${chosen?`<div data-content-item-id="${esc(chosen.id)}">${contentTaskText(ContentRuntime.itemForSession(chosen.id))}${ContentRuntime.itemForSession(chosen.id).reasoning?'':`<details><summary>${contentAnswerLabel(ContentRuntime.itemForSession(chosen.id))}</summary><div class="content-answer">${contentAnswerText(ContentRuntime.itemForSession(chosen.id),ContentRuntime.project('WHEEL',ContentRuntime.itemForSession(chosen.id)).answerPolicy)}</div></details>`}</div>`:`<h2>${esc(result)}</h2><p>${state.busy?'Het wiel draait…':'Druk op Draaien of gebruik de spatiebalk.'}</p>`}</div></div><ol class="na-wheel-legend">${state.options.map((x,i)=>`<li class="${state.selected===i&&!state.busy?'selected':''}" ${state.selected===i&&!state.busy?'aria-current="true"':''} ${state.contentOptions?`data-content-item-id="${esc(state.contentOptions[i].id)}"`:''}>${esc(x)}</li>`).join('')}</ol>${edit}`;
  }
  if(kind==='memory')return `<div class="na-memory">${state.order.map((token,i)=>{
   const pair=state.contentPairs?Math.floor(token/2):token;
   const open=state.revealed.includes(i)||state.done.includes(pair),matched=state.done.includes(pair);
   if(state.contentPairs){const p=state.contentPairs[pair],text=token%2?p.right.value:p.left.value;return button('flip',i,open?`<span class="na-pair-text">${esc(text)}${matched?' ✓':''}</span>`:`<span>Kaart ${i+1}</span>`,`aria-label="${open?esc(text):'Kaart '+(i+1)+', omdraaien'}" ${open||state.revealed.length===2?'disabled':''} data-content-item-id="${esc(p.content_item_id)}" data-face="${open?'front':'back'}"`)}
   return button('flip',i,open?`${imageCard(state.words[pair])}<span>${esc(state.words[pair])}${matched?' ✓':''}</span>`:`<img class="na-card-logo" src="assets/brand/taalroute-white.svg" alt=""><span>Kaart ${i+1}</span>`,`aria-label="${open?esc(state.words[pair])+(matched?', paar gevonden':''): 'Kaart '+(i+1)+', omdraaien'}" aria-pressed="${open}" ${open||state.revealed.length===2?'disabled':''} data-face="${open?'front':'back'}"`);
  }).join('')}</div><p class="na-progress">${state.done.length} / ${state.words.length} paren · ${state.attempts} pogingen</p>`;
  if(kind==='koppelen'&&state.contentPairs)return `<div class="na-pairs"><div aria-label="Opdrachten">${state.contentPairs.map((p,i)=>button('select',i,`<span class="na-pair-text">${esc(p.left.value)}</span>`,`data-content-item-id="${esc(p.content_item_id)}" aria-pressed="${state.selected===i}" ${state.done.includes(i)?'disabled':''}`)).join('')}</div><div aria-label="Antwoorden">${state.order.map(i=>button('match',i,`<span class="na-pair-text">${esc(state.contentPairs[i].right.value)}${state.done.includes(i)?' ✓':''}</span>`,state.done.includes(i)?'disabled':'')).join('')}</div></div>`;
  if(kind==='koppelen')return `<div class="na-pairs"><div aria-label="Beelden">${state.words.map((word,i)=>button('select',i,`${imageCard(word)}<span>${state.done.includes(i)?'Gekoppeld ✓':'Beeld '+(i+1)}</span>`,`aria-label="Beeld ${i+1}: ${esc(word)}" aria-pressed="${state.selected===i}" ${state.done.includes(i)?'disabled':''}`)).join('')}</div><div aria-label="Woorden">${state.order.map(i=>button('match',i,esc(state.words[i])+(state.done.includes(i)?' ✓':''),state.done.includes(i)?'disabled':'')).join('')}</div></div>`;
  if(kind==='sorteren'){
   const c=sortData(),item=c.items[state.order[state.done.length]];
   return `<h2>${esc(c.title)}</h2>${item?`<div class="na-word" ${state.contentSort?`data-content-item-id="${esc(c.ids[state.order[state.done.length]])}"`:""}>${esc(item[0])}</div><div class="na-options">${c.groups.map((x,i)=>button('sort',i,esc(x))).join('')}</div>`:'<p class="na-word">Alles gesorteerd ✓</p>'}<p class="na-progress">${state.done.length} / ${c.items.length} woorden</p><div class="na-sort-result">${c.groups.map((g,i)=>`<section><h3>${esc(g)}</h3><p>${state.done.filter(k=>c.items[k][1]===i).map(k=>esc(c.items[k][0])).join(' · ')||'Nog geen woorden'}</p></section>`).join('')}</div>`;
  }
  if(kind==='rangschikken'){
   const sequence=state.contentSequence||content.sequences[state.round%content.sequences.length],attr=state.contentSequence?` data-content-item-id="${esc(sequence.id)}"`:'';
   return `<div${attr}><h2>${esc(sequence.title)}</h2>${state.contentSequence?`${contentSituation(ContentRuntime.itemForSession(sequence.id))}<p class="na-sequence-source">${esc(sequence.prompt)}</p>`:''}<ol class="na-sequence">${state.sequence.map((i,j)=>`<li>${button('remove-step',j,esc(sequence.steps[i]),`aria-label="Stap ${j+1} terugleggen: ${esc(sequence.steps[i])}" ${state.correct?'disabled':''}`)}</li>`).join('')}</ol>${state.sequence.length?'':'<p class="na-empty">Kies hieronder wat eerst komt.</p>'}<div class="na-step-bank">${state.order.filter(i=>!state.sequence.includes(i)).map(i=>button('step',i,esc(sequence.steps[i]))).join('')}</div></div>`;
  }
  if(kind==='categorieenquiz'){
   const quiz=quizData(),q=quiz[state.question];
   if(q){
    const situation=q.contentItemId?contentSituation(ContentRuntime.itemForSession(q.contentItemId)):'';
    const answered=Object.hasOwn(state.answers,state.question),revealed=!!state.quizRevealed?.[state.question],contentAttr=q.contentItemId?` data-content-item-id="${esc(q.contentItemId)}"`:'';
    if(!q.manual)return `<p class="na-progress">${esc(q.category)} · ${q.points} punten · Team ${state.team+1}</p>${situation}<h2${contentAttr}>${q.contentItemId?contentPromptHtml(q.question):esc(q.question)}</h2><div class="na-options na-quiz-options">${q.options.map((x,i)=>button('quiz-answer',i,esc(x)+(answered&&i===q.answer?' ✓':''),`${answered?'disabled':''} ${answered&&i===q.answer?'data-correct="true"':''}`)).join('')}</div>`;
    const tokens=q.orderTokens?.length?`<p class="na-quiz-tokens"><strong>Gebruik deze delen:</strong> ${q.orderTokens.map(esc).join(' · ')}</p>`:'',input=['TEXT_INPUT','TEXT_ORDER'].includes(q.renderer)?`<form id="na-quiz-form"><label for="na-quiz-text">Antwoord van Team ${state.team+1}</label><div class="na-guess-input"><input id="na-quiz-text" value="${esc(state.quizResponses?.[state.question]||'')}" autocomplete="off"><button class="smallbtn" type="submit">Antwoord vastleggen</button></div></form>`:`<p class="na-quiz-oral">Team ${state.team+1} geeft het antwoord hardop. Toon daarna het modelantwoord.</p>`;
    const review=revealed?`<div class="na-quiz-review">${q.contentItemId?contentAnswerText(ContentRuntime.itemForSession(q.contentItemId),ContentRuntime.answerPolicy(ContentRuntime.itemForSession(q.contentItemId))):`<strong>${q.modelIsExample?'Mogelijk voorbeeld':'Modelantwoord'}</strong><p>${esc(q.model)}</p>`}<div class="na-options">${button('quiz-grade',1,'Goed · punten toekennen',answered?'disabled':'')}${button('quiz-grade',0,'Niet goed · geen punten',answered?'disabled':'')}</div></div>`:`<div class="na-options">${button('quiz-reveal',state.question,'Toon modelantwoord',answered?'disabled':'')}</div>`;
    return `<p class="na-progress">${esc(q.category)} · ${q.points} punten · Team ${state.team+1}</p>${situation}<h2${contentAttr}>${q.contentItemId?contentPromptHtml(q.question):esc(q.question)}</h2>${tokens}${input}${review}`;
   }
   return `<div class="na-scoreboard">${state.scores.map((score,i)=>button('team',i,`Team ${i+1}<strong>${score}</strong>`,`aria-pressed="${state.team===i}"`)).join('')}</div><div class="na-quiz-board">${[...new Set(quiz.map(q=>q.category))].map(category=>`<section><h3>${esc(category)}</h3>${quiz.map((q,i)=>q.category===category?button('question',i,Object.hasOwn(state.answers,i)?'Gespeeld ✓':String(q.points),`aria-label="${esc(category)}, ${q.points} punten" ${Object.hasOwn(state.answers,i)?'disabled':''} ${q.contentItemId?`data-content-item-id="${esc(q.contentItemId)}"`:''}`):'').join('')}</section>`).join('')}</div>`;
  }
  const r=riddleData();
  return `<ol class="na-clues" ${state.contentRiddle?`data-content-item-id="${esc(state.contentRiddle.id)}"`:''}>${r.clues.slice(0,state.hints).map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${state.answer?`<p class="na-word">${esc(r.word)}</p>`:`<form id="na-guess-form"><label for="na-guess">Jullie antwoord <small>(of raad samen hardop)</small></label><div class="na-guess-input"><input id="na-guess" maxlength="80" autocomplete="off"><button class="smallbtn" type="submit">Controleer</button></div></form>`}<div class="na-options">${button('hint',0,'Nog een hint',state.hints===r.clues.length?'disabled':'')}${button('reveal',0,'Toon antwoord',state.answer?'disabled':'')}</div>`;
 }
 function primary(){
  if(kind==='draaiwiel')return ['DRAAIEN',state.busy];
  if(kind==='memory')return [state.done.length===state.words.length?'NIEUWE RONDE':'VERDER',state.done.length!==state.words.length&&state.revealed.length!==2];
  if(kind==='koppelen')return ['NIEUWE RONDE',state.done.length!==state.words.length];
  if(kind==='sorteren')return ['VOLGENDE RONDE',state.done.length!==state.order.length];
  if(kind==='rangschikken')return [state.correct?'VOLGENDE RONDE':'CONTROLEREN',state.sequence.length!==state.order.length];
  if(kind==='categorieenquiz')return [state.question!==null?'NAAR HET QUIZBORD':'NIEUWE QUIZ',state.question!==null?!Object.hasOwn(state.answers,state.question):Object.keys(state.answers).length!==quizData().length];
  return ['VOLGEND WOORD',false];
 }
 function variants(){
  if(state.contentSessionId)return [];
  if(kind==='draaiwiel')return content.wheelTitles;
  if(kind==='memory'||kind==='koppelen')return content.pictureSets.map(s=>s.title);
  if(kind==='sorteren')return content.sorting.map(s=>s.title);
  if(kind==='rangschikken')return state.contentSequence?[]:content.sequences.map(s=>s.title);
  if(kind==='raad-het-woord')return content.riddles.map((_,i)=>`Raadsel ${i+1}`);
  return [];
 }
 function setPicker(){
  const list=variants();
  return list.length?`<label class="card-route-label na-set-picker" for="na-set">${kind==='draaiwiel'?'Onderwerpen op het wiel':'Kies een ronde'}<select id="na-set" ${state.busy?'disabled':''}>${state.custom?'<option selected disabled value="custom">Eigen onderwerpen</option>':''}${list.map((name,i)=>`<option value="${i}" ${!state.custom&&state.round%list.length===i?'selected':''}>${i+1}. ${esc(name)}</option>`).join('')}</select></label>`:'';
 }
 function render(focusId){
  rootCheckpoint();
  const [,title,world,icon,color,intro]=game(),[label,disabled]=primary();
  let footer=gameBar(`<button class="primary card-next-primary" id="primaryGame" ${disabled?'disabled':''}>${gameIcon(kind==='draaiwiel'?'mission':'cards')}<span>${label}</span></button>`).replace('id="undoAction"','id="activityUndo"');
  if(kind==='categorieenquiz')footer=footer.replace(/<div class="turnzone">.*?<\/div>(?=<div class="primary-slot">)/,`<div class="turnzone"><div class="chip active">Team ${state.team+1}</div><div class="chip">${state.scores[state.team]} punten</div></div>`);
  $('#gameMount').innerHTML=`<div class="game-shell card-table-shell new-activity${kind==='draaiwiel'?' wheel-game':''}${state.contentOptions?' content-wheel':''}" data-workspace="${['draaiwiel','raad-het-woord'].includes(kind)?'standard':'wide'}" style="--ribbon:${color}"><div class="game-work card-work"><div class="card-activity-heading"><div><button class="smallbtn na-back" data-activities-back>← Activiteiten</button><h1>${esc(title)}</h1><p>${esc(state.contentSessionId?contentSessionLabel(contentSession(),null,false):intro)}</p></div>${setPicker()}</div><div class="cards-stage"><div class="game-card-motion"><article class="active-card">${kind==='draaiwiel'?'':`<div class="card-ribbon">${gameIcon(icon)}<strong>${esc(title)}</strong><span class="card-counter">${state.custom?'Eigen set':state.contentSessionId&&kind!=='categorieenquiz'?`Ronde ${state.round+1}`:variants().length?`${state.round%variants().length+1} / ${variants().length}`:`${Object.keys(state.answers).length} / ${quizData().length}`}</span></div>`}<div class="card-content"><div class="na-workspace">${body()}</div><p id="na-level" class="na-level" ${state.contentSessionId||kind==='draaiwiel'?'hidden':''}>${esc(levelInstruction())}</p><p class="na-feedback" id="na-feedback" role="status" aria-live="polite" aria-atomic="true"></p></div>${contextTools('na',{Example:{disabled:!exampleAvailable(),tip:exampleAvailable()?'Bekijk een voorbeeld bij deze ronde.':'Doe eerst een poging of onthul het antwoord in het spel.'}})}</article></div></div></div>${footer}</div>`;
  bindGameBar(actPrimary);
  if(state.contentOptions)$('#naExample').closest('.context-tool').hidden=!state.contentOptions[state.selected]?.model;
  for(const key of ['Help','Example','Goals','Partner','More'])$('#na'+key).onclick=()=>context(key);
  $('#na-set')?.addEventListener('change',e=>{
   const round=Number(e.target.value);if(state.busy||!Number.isInteger(round)||round<0||round>=variants().length)return;
   checkpoint();state=rounds[kind]=fresh(kind,round);render('na-set');
  });
  $('#activityUndo').disabled=!histories[kind].length||state.busy;
  $('#activityUndo').onclick=()=>{if(!histories[kind].length||state.busy)return;const prior=histories[kind].pop();state=rounds[kind]=prior.state;APP.turn=prior.turn;save();render('activityUndo')};
  if(!contentSession())$('[data-ghelp]').onclick=help;
  $('[data-grules]').onclick=help;
  $('[data-goptions]').onclick=()=>kind==='draaiwiel'?editWheel():openGameDialog('Spelopties','<p>Kies de spelmodus links onderaan. Het niveau bovenaan past de gesprekstip aan. Kies bovenaan een andere ronde. Het niveau verandert de gesprekstip.</p><p>Bij de quiz kies je op het quizbord welk team antwoordt. Een goed antwoord levert punten op; een fout antwoord kost geen punten.</p>');
  $('#na-guess-form')?.addEventListener('submit',e=>{e.preventDefault();guess()});
  $('#na-quiz-form')?.addEventListener('submit',e=>{e.preventDefault();const value=$('#na-quiz-text')?.value.trim();if(!value)return;checkpoint();state.quizResponses[state.question]=value;feedback('Antwoord vastgelegd. Toon nu het modelantwoord en beoordeel het antwoord.');render('na-quiz-text')});
  const message=state.feedback;
  requestAnimationFrame(()=>{const el=$('#na-feedback');if(el)el.textContent=lessonText(message)});
  if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
 }
 function exampleAvailable(){
  if(kind==='categorieenquiz')return state.question!==null&&(Object.hasOwn(state.answers,state.question)||!!state.quizRevealed?.[state.question]);
  if(kind==='raad-het-woord')return state.answer;
  if(kind==='rangschikken')return state.attempts>0||state.correct;
  return true;
 }
 function context(key){
  if(key==='Help')return help();
  const round=variants()[state.round%variants().length]||game()[1];
  const examples={
   draaiwiel:()=>state.contentOptions?(state.contentOptions[state.selected??0]?.model||'Bekijk het mogelijke antwoord bij deze opdracht.'):`Kies één onderwerp, bijvoorbeeld “${state.options[state.selected??0]}”. Vertel één eigen ervaring en laat je gesprekspartner doorvragen.`,
   memory:()=>state.contentPairs?`Zoek de opdracht en het passende antwoord. ${state.contentPairs[0].left.value} → ${state.contentPairs[0].right.value}`:`Als je twee kaarten met “${state.words[0]}” omdraait, heb je een paar. Benoem wat je ziet.`,
   koppelen:()=>state.contentPairs?`${state.contentPairs[0].left.value} → ${state.contentPairs[0].right.value}`:`Bij een beeld van “${state.words[0]}” kies je het woord “${state.words[0]}”.`,
   sorteren:()=>{const c=sortData(),item=c.items[state.order[state.done.length]??0];return `“${item[0]}” hoort bij “${c.groups[item[1]]}”. Bespreek samen waarom.`},
   rangschikken:()=>state.contentSequence?(state.contentSequence.model||state.contentSequence.steps.join(' ')):content.sequences[state.round%content.sequences.length].steps.join(' → '),
   categorieenquiz:()=>{const q=quizData()[state.question];return q?(q.manual?q.model:(q.options[q.answer]+'. '+q.explanation)):''},
   'raad-het-woord':()=>{const r=riddleData();return r.word+': '+r.clues.join(' ')}
  };
  if(key==='Example'&&!exampleAvailable())return;
  const sections={Example:[['Bij deze ronde',key==='Example'?examples[kind]():'']],Goals:[['Doel',game()[5]],['Deze ronde',round],['Rollen',kind==='categorieenquiz'?'Het actieve team overlegt en kiest een antwoord. Het andere team luistert. Daarna wisselt de beurt.':'Eén deelnemer kiest of vertelt. De gesprekspartner luistert, vraagt door en denkt mee. Wissel na de beurt.']],Partner:[['Bij deze ronde',round],['Jouw rol',kind==='categorieenquiz'?'Overleg met je team voordat één van jullie het antwoord kiest. Leg daarna uit hoe jullie tot de keuze kwamen.':'Laat de ander eerst kiezen of vertellen. Vraag: waarom kies je dat? Wat herken je? Bespreek samen de uitkomst.'],['Gesprekstip',levelInstruction()]],More:[['Verder oefenen','Vertel waar je de woorden of de situatie uit deze ronde in je eigen leven tegenkomt.'],['Opnieuw','Je kunt deze ronde opnieuw beginnen. Terug herstelt je vorige stap.']]}[key];
  openGameDialog({Example:'Voorbeeld',Goals:'Doel en rollen',Partner:'Voor de gesprekspartner',More:'Meer bij deze ronde'}[key],sections.map(([title,text])=>`<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join('')+(key==='More'?'<button class="smallbtn" id="naRestartRound">Ronde opnieuw beginnen</button>':''),()=>{if(key==='More')$('#naRestartRound').onclick=()=>{$('#gameDialog').close();action('restart')}});
 }
 function help(){openGameDialog(game()[1],`<p>${esc(game()[5])}</p><p>${esc({draaiwiel:state.contentOptions?'Dit wiel gebruikt de opdrachten die je voor deze les hebt gekozen.':'Gebruik Eigen onderwerpen om twee tot twaalf eigen keuzes in te vullen. Draaien kiest willekeurig één onderwerp.',memory:'Draai twee kaarten om. Een paar blijft zichtbaar. Gebruik Verder om twee verschillende kaarten weer om te draaien.',koppelen:'Selecteer links een kaart en rechts het bijbehorende antwoord. Een verkeerd antwoord kun je opnieuw proberen.',sorteren:'Kies de juiste groep voor het woord. Bij een fout blijft het woord staan zodat je opnieuw kunt kiezen.',rangschikken:state.contentSequence?'Zet de zinsdelen in de juiste volgorde. Controleer daarna je antwoord.':'Tik de stappen van begin tot eind aan. Tik een gekozen stap aan om hem terug te leggen. Controleer als alle stappen zijn gekozen.',categorieenquiz:state.contentQuiz?'Deze quiz gebruikt je gekozen opdrachten. Kies een vak. Meerkeuze wordt automatisch beoordeeld; open opdrachten beoordeelt de docent na het modelantwoord.':'Selecteer Team 1 of Team 2, kies een vak en geef één antwoord. Goed: de punten van het vak. Fout: geen punten. Daarna is het andere team aan de beurt. Bij gelijkspel delen de teams de winst.','raad-het-woord':'Raad samen hardop of typ een antwoord. Vraag om nog een hint of toon het antwoord. Volgend woord start een nieuwe ronde.'}[kind])}</p><p>${esc(levelInstruction())}</p>`)}
 function next(){checkpoint();const options=state.options,contentOptions=state.contentOptions;state=rounds[kind]=fresh(kind,state.round+1);if(options&&!contentOptions)state.options=options;completeTurn();render('primaryGame')}
 function actPrimary(){
  if(primary()[1])return;
  if(kind==='draaiwiel'){
   checkpoint();const previous=state.contentOptions?.[state.selected]?.id;if(state.contentOptions&&state.done.length===state.options.length){state=rounds[kind]=fresh(kind,state.round+1);render()}const available=state.options.map((_,i)=>i).filter(i=>!state.contentOptions||!state.done.includes(i)&&(state.options.length===1||state.contentOptions[i].id!==previous));state.busy=true;state.selected=available[Math.floor(Math.random()*available.length)];if(state.contentOptions)state.done.push(state.selected);const rotation=Math.ceil(state.rotation/360)*360+1080-(state.selected+.5)*360/state.options.length;
   $('#primaryGame').disabled=true;$('#activityUndo').disabled=true;if($('#na-set'))$('#na-set').disabled=true;$('.na-wheel').style.transform=`rotate(${rotation}deg)`;state.rotation=rotation;$('#na-feedback').textContent='Het wiel draait…';
   timer=setTimeout(()=>{state.busy=false;state.feedback='';if(APP.last?.type==='activity'&&APP.last.data.kind===kind&&$('#screen-game').classList.contains('active'))render('primaryGame')},settingsState().reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);return;
  }
  if(kind==='memory'&&state.done.length!==state.words.length){checkpoint();state.revealed=[];completeTurn();feedback('Kies weer twee kaarten.');render();return}
  if(kind==='rangschikken'&&!state.correct){checkpoint();state.attempts++;state.correct=state.sequence.every((x,i)=>x===i);feedback(state.correct?(state.contentSequence?'De volgorde klopt! '+ContentRuntime.itemForSession(state.contentSequence.id).explanation:'De volgorde klopt! Vertel nu alle stappen in je eigen woorden.'):'De volgorde klopt nog niet. Leg een stap terug en probeer opnieuw.');render('primaryGame');return}
  if(kind==='categorieenquiz'&&state.question!==null){checkpoint();state.question=null;state.team=1-state.team;completeTurn();feedback(Object.keys(state.answers).length===quizData().length?(state.scores[0]===state.scores[1]?'Gelijkspel!':`Team ${state.scores[0]>state.scores[1]?1:2} wint!`):`Team ${state.team+1} kiest een vak.`);render();return}
  next();
 }
 function editWheel(){
  if(state.busy||state.contentOptions)return;
  openGameDialog('Eigen onderwerpen','<p>Schrijf één onderwerp per regel: 2 tot 12 onderwerpen, maximaal 48 tekens per onderwerp.</p><form id="na-wheel-form"><label for="na-wheel-input">Onderwerpen</label><textarea id="na-wheel-input" rows="8" maxlength="588"></textarea><p id="na-wheel-error" role="alert"></p><button class="primary" type="submit">Gebruik onderwerpen</button></form>',()=>{
   $('#na-wheel-input').value=state.options.join('\n');
   $('#na-wheel-form').onsubmit=e=>{e.preventDefault();const list=$('#na-wheel-input').value.split('\n').map(x=>x.trim()).filter(Boolean);if(list.length<2||list.length>12||list.some(x=>x.length>48)){ $('#na-wheel-error').textContent='Vul 2 tot 12 onderwerpen in, van maximaal 48 tekens per onderwerp.';return}checkpoint();state.options=list;state.custom=true;state.selected=null;state.rotation=0;feedback('Je eigen onderwerpen staan op het wiel.');$('#gameDialog').close();render('primaryGame')};
  });
 }
 function guess(){
  const value=$('#na-guess').value.trim();if(!value)return;
  checkpoint();if(state.contentRiddle){state.answer=true;feedback('Vergelijk samen jullie antwoord met het voorbeeld. Bespreek welke aanwijzingen passen.');render('primaryGame');return}const normalize=x=>x.toLocaleLowerCase('nl').normalize('NFC').replace(/^(de|het|een)\s+/,'').replace(/[.!?]+$/,'').trim();
  state.answer=normalize(value)===riddleData().word;
  feedback(state.answer?'Goed geraden! Maak samen een zin met dit woord.':'Dat is het nog niet. Probeer opnieuw of vraag een hint.');render(state.answer?'primaryGame':'na-guess');
 }
 function action(action,value,focusId){
  if(state.busy)return;
  if(action==='help')return help();if(action==='edit-wheel')return editWheel();
  if(action==='restart'){checkpoint();const prior=state;state=rounds[kind]=fresh(kind,state.round);if(prior.custom){state.options=prior.options;state.custom=true}render();return}
  const i=Number(value);if(!Number.isInteger(i)||i<0)return;
  checkpoint();
  if(action==='flip'&&kind==='memory'&&i<state.order.length&&!state.done.includes(state.contentPairs?Math.floor(state.order[i]/2):state.order[i])&&!state.revealed.includes(i)&&state.revealed.length<2){
   state.revealed.push(i);feedback('Draai nog een kaart om.');
   if(state.revealed.length===2){state.attempts++;const [a,b]=state.revealed;if((state.contentPairs?Math.floor(state.order[a]/2):state.order[a])===(state.contentPairs?Math.floor(state.order[b]/2):state.order[b])){state.done.push(state.contentPairs?Math.floor(state.order[a]/2):state.order[a]);state.revealed=[];feedback(state.done.length===state.words.length?'Alle paren gevonden!':'Een paar gevonden! Zoek verder.')}else feedback('Geen paar. Bekijk de kaarten en kies Verder.')}
  }else if(action==='select'&&kind==='koppelen'&&i<state.words.length&&!state.done.includes(i)){state.selected=i;feedback('Kies nu het woord dat erbij hoort.')}
  else if(action==='match'&&kind==='koppelen'&&i<state.words.length&&!state.done.includes(i)){if(state.selected===null)feedback('Kies eerst links een beeld.');else if(state.selected===i){state.done.push(i);state.selected=null;feedback(state.done.length===state.words.length?'Alles gekoppeld!':'Dat hoort bij elkaar!')}else feedback('Dat hoort nog niet bij elkaar. Kies een ander woord.')}
  else if(action==='sort'&&kind==='sorteren'){
   const c=sortData(),index=state.order[state.done.length],item=c.items[index];
   if(item&&i<c.groups.length){if(item[1]===i){state.done.push(index);feedback(state.done.length===c.items.length?'Alles goed gesorteerd!':'Goed! Kies de groep voor het volgende woord.')}else feedback('Probeer de andere groep. Bespreek waarom het woord daar hoort.')}
  }else if(action==='step'&&kind==='rangschikken'&&state.order.includes(i)&&!state.sequence.includes(i)){state.sequence.push(i);state.correct=false;feedback('')}
  else if(action==='remove-step'&&kind==='rangschikken'&&i<state.sequence.length&&!state.correct){state.sequence.splice(i,1);feedback('Kies de volgende stap.')}
  else if(action==='team'&&kind==='categorieenquiz'&&i<2&&state.question===null){state.team=i;feedback(`Team ${i+1} kiest een vak.`)}
  else if(action==='question'&&kind==='categorieenquiz'&&i<quizData().length&&!Object.hasOwn(state.answers,i)){state.question=i;feedback('Overleg en geef één antwoord.')}
  else if(action==='quiz-answer'&&kind==='categorieenquiz'&&state.question!==null&&!Object.hasOwn(state.answers,state.question)){
   const q=quizData()[state.question];if(q&&!q.manual&&i<q.options.length){state.answers[state.question]=i;const correct=i===q.answer;if(correct)state.scores[state.team]+=q.points;feedback((correct?`Goed! ${q.points} punten voor Team ${state.team+1}. `:'Nog niet goed. ')+q.explanation)}
  }else if(action==='quiz-reveal'&&kind==='categorieenquiz'&&state.question!==null&&!Object.hasOwn(state.answers,state.question)){state.quizRevealed[state.question]=true;feedback('Vergelijk het antwoord van het team met het modelantwoord.')}
  else if(action==='quiz-grade'&&kind==='categorieenquiz'&&state.question!==null&&!Object.hasOwn(state.answers,state.question)){
   const q=quizData()[state.question];if(q&&q.manual){const correct=i===1;state.answers[state.question]=correct?'manual-correct':'manual-incorrect';if(correct)state.scores[state.team]+=q.points;feedback(correct?`Goed beoordeeld. ${q.points} punten voor Team ${state.team+1}.`:'Geen punten. Bespreek kort wat er anders moest.')}
  }else if(action==='hint'&&kind==='raad-het-woord'){state.hints=Math.min(riddleData().clues.length,state.hints+1);feedback('Er is een nieuwe aanwijzing.')}
  else if(action==='reveal'&&kind==='raad-het-woord'){state.answer=true;feedback('Bespreek de aanwijzingen en maak een zin met dit woord.')}
  render(focusId);
 }
 document.addEventListener('click',e=>{
  const choice=e.target.closest('[data-activity]');if(choice&&!choice.disabled)return start(choice.dataset.activity,choice.dataset.set);
  const control=e.target.closest('.new-activity [data-na]');if(control&&!control.disabled)action(control.dataset.na,control.dataset.value,control.id);
 });
 // Navigation stays on goScreen/startCards; content is never copied into tile definitions.
 const assets=['DRAAIWIEL','MEMORY','KOPPELEN','SORTEREN','RANGSCHIKKEN','CATEGORIEENQUIZ','RAAD_HET_WOORD','MEER_ACTIVITEITEN'];
 const tiles=[...content.games.map(([id,title])=>({id,title})),{id:'library',title:'Meer activiteiten'}];
 $('#workformDecks').innerHTML=tiles.map((t,i)=>`<button type="button" class="activity-tile" ${t.id==='library'?'data-activities-library':`data-activity="${t.id}"`}><span class="photo-frame"><img src="assets/activities/DIGIBORD_ACT_${assets[i]}_VOLWASSEN_FINAL_${i===5?'v02':'v01'}.png" alt="" width="1536" height="1024"></span><strong>${esc(t.title)}</strong></button>`).join('');
 const entry=(attr,id,title,icon)=>`<button type="button" class="smallbtn" ${attr}="${esc(id)}">${gameIcon(icon)}<span>${esc(title)}</span></button>`;
 const group=(title,body)=>`<section class="activity-library-group"><h2>${esc(title)}</h2><div class="activity-library-grid">${body}</div></section>`;
 $('#activityLibrary').innerHTML=[
  ...[...new Set(content.games.map(g=>g[2]))].map(world=>group(world,content.games.filter(g=>g[2]===world).map(([id,title,,icon])=>entry('data-activity',id,title,icon)).join(''))),
  group('Kaarten, missies en gesprekken',CARD_GAMES.map(g=>entry('data-library-card',g.id,g.title,g.icon)).join('')+entry('data-library-cabinet','all','Alle kaartensets','cards')),
  group('Speelborden',Array.from(document.querySelectorAll('#screen-boards [data-board]')).map(b=>entry('data-library-board',b.dataset.board,b.querySelector('h3').textContent,'mission')).join('')),
  group('Dobbelspellen',entry('data-dicegame','taalworp','Taalworp','verbs')+entry('data-dicegame','story','Verhaalworp','story')),
  group('Woorden en zinnen',entry('data-library-word','goals','Kies een taaldoel','spelling')),
  group('Gedeelde activiteitensets',content.pictureSets.map(set=>`<article class="activity-shared-set"><h3>${esc(set.title)}</h3><div>${set.forms.map(id=>`<button type="button" class="smallbtn" data-activity="${id}" data-set="${esc(set.id)}">${esc(content.games.find(g=>g[0]===id)[1])}</button>`).join('')}</div></article>`).join(''))
 ].join('');
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.hasAttribute('data-activities-back'))goScreen('workforms');
  if(b.hasAttribute('data-activities-library'))goScreen('activities');
  if(b.dataset.libraryCard)startCards(b.dataset.libraryCard);
  if(b.dataset.libraryBoard)startBoard(b.dataset.libraryBoard);
  if(b.dataset.libraryWord)goScreen('words');
  if(b.hasAttribute('data-library-cabinet'))openCabinet('all');
 });
 $('#levelSelect').addEventListener('change',()=>{if(APP.last?.type==='activity'&&$('#na-level'))$('#na-level').textContent=levelInstruction()});
 const progressKeys=['round','selected','done','revealed','sequence','attempts','correct','hints','answer','question','answers','quizRevealed','team','scores','rotation','order'];
 function exportProgress(){if(!state||state.busy||!state.contentSessionId)return null;return {kind,...Object.fromEntries(progressKeys.filter(k=>state[k]!==undefined).map(k=>[k,structuredClone(state[k])]))}}
 function validateProgress(payload,session=contentSession()){
  if(!engineIds[payload.kind]||!Number.isSafeInteger(payload.round)||payload.round<0)throw new Error('Ongeldige activiteitvoortgang.');
  const base=fresh(payload.kind,payload.round,session),candidate={...base,...structuredClone(payload)};
  const fail=()=>{throw new Error('Deze spelvoortgang past niet bij de oorspronkelijke opdrachten.')};
  const indices=(values,n)=>Array.isArray(values)&&new Set(values).size===values.length&&values.every(i=>Number.isInteger(i)&&i>=0&&i<n);
  if(base.order&&(!indices(candidate.order,base.order.length)||candidate.order.length!==base.order.length))fail();
  if(base.contentPairs){const n=base.contentPairs.length;if(!indices(candidate.done,n)||!indices(candidate.revealed,n*2)||candidate.revealed.length>2||candidate.selected!==null&&candidate.selected>=n)fail()}
  if(base.contentSort&&!indices(candidate.done,base.contentSort.items.length))fail();
  if(base.contentSequence&&!indices(candidate.sequence,base.contentSequence.steps.length))fail();
  if(base.contentOptions&&(!indices(candidate.done,base.contentOptions.length)||candidate.selected!==null&&candidate.selected>=base.contentOptions.length))fail();
  if(base.contentRiddle&&(candidate.hints<1||candidate.hints>base.contentRiddle.clues.length))fail();
  if(base.contentQuiz){const n=base.contentQuiz.length;if(candidate.question!==null&&candidate.question>=n||candidate.team>1||candidate.scores.length!==2)fail();for(const [key,value] of Object.entries(candidate.answers)){const q=base.contentQuiz[key];if(!q||(q.manual?!['manual-correct','manual-incorrect'].includes(value):!Number.isInteger(value)||value>=q.options.length))fail()}if(Object.keys(candidate.quizRevealed).some(k=>Number(k)>=n))fail()}
  return candidate;
 }
 function restoreProgress(payload){const candidate=validateProgress(payload);kind=payload.kind;state=rounds[kind]=candidate;histories[kind]=[];state.busy=false;}
 return {start,exportProgress,restoreProgress,validateProgress};
})();
