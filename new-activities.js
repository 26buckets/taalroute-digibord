/* Seven starter games on the existing DigiBord card table and shared controls. */
window.DigiActivities = (() => {
 const content=window.DIGIBORD_ACTIVITIES, rounds={}, histories={};
 let kind, state, timer;
 const game=()=>content.games.find(g=>g[0]===kind);
 const contentSession=()=>window.ContentRuntime?.activeSession?.()||null;
 const shuffled=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const picture=label=>RUNTIME.storydice.icons.find(x=>x.label===label);
 const button=(action,arg,label,extra='')=>`<button type="button" class="na-choice" id="na-${action}-${arg}" data-na="${action}" data-value="${arg}" ${extra}>${label}</button>`;
 function fresh(id,round=0){
  const s={round,feedback:'',selected:null,done:[],revealed:[],sequence:[],attempts:0,correct:false,hints:1,answer:false,question:null,answers:{},team:0,scores:[0,0],rotation:0,busy:false};
  if(id==='memory'||id==='koppelen'){
   s.words=content.pictureSets[round%content.pictureSets.length].words;
   s.order=shuffled(id==='memory'?s.words.flatMap((_,i)=>[i,i]):s.words.map((_,i)=>i));
  }
  if(id==='sorteren')s.order=shuffled(content.sorting[round%content.sorting.length].items.map((_,i)=>i));
  if(id==='rangschikken'){
   s.order=shuffled(content.sequences[round%content.sequences.length].steps.map((_,i)=>i));
   if(s.order.every((x,i)=>x===i))s.order.reverse();
  }
  if(id==='draaiwiel'){
   const session=contentSession();
   if(session){const pool=ContentRuntime.enginePool('WHEEL',session),count=Math.min(6,pool.length),offset=(round*count)%pool.length;s.contentSessionId=session.session_id;s.contentOptions=Array.from({length:count},(_,i)=>pool[(offset+i)%pool.length]).map(item=>({id:item.content_item_id,label:item.language_function.replaceAll('_',' '),prompt:item.prompt,model:item.model_answer,interactionType:item.interaction_type,orderTokens:item.order_tokens||[]}));s.options=s.contentOptions.map((entry,i)=>`${i+1}. ${entry.label}`)}
   else{const offset=(round%content.wheelTitles.length)*6;s.options=content.wheel.slice(offset,offset+6)}
  }
  return s;
 }
 function start(id,setId){
  if(!content.games.some(g=>g[0]===id))return;
  const setIndex=setId===undefined?-1:content.pictureSets.findIndex(s=>s.id===setId&&s.forms.includes(id));
  if(setId!==undefined&&setIndex<0)return;
  clearTimeout(timer);kind=id;
  if(setIndex<0){
   const existing=rounds[id],session=id==='draaiwiel'?contentSession():null,wrongWheelState=id==='draaiwiel'&&existing&&((session&&existing.contentSessionId!==session.session_id)||(!session&&existing.contentOptions));
   state=wrongWheelState?(rounds[id]=fresh(id,existing.round||0)):(rounds[id]??=fresh(id));
  }else state=rounds[id]=fresh(id,setIndex);
  state.busy=false;
  if(setIndex>=0)histories[id]=[];else histories[id]??=[];
  setLast('activity',game()[1],{kind});render();goScreen('game');
 }
 function checkpoint(){histories[kind].push({state:structuredClone(state),turn:structuredClone(APP.turn)});histories[kind]=histories[kind].slice(-20)}
 function feedback(text){state.feedback=text}
 function imageCard(label){const p=picture(label);return `<img src="${esc(p.file)}" alt="${esc(label)}">`}
 function body(){
  if(kind==='draaiwiel'){
   const n=state.options.length,colors=['#176b9a','#39765c','#b57b20','#76569c','#a44932','#438d9b'];
   const gradient=state.options.map((_,i)=>`${colors[i%colors.length]} ${i*360/n}deg ${(i+1)*360/n}deg`).join(',');
   const chosen=state.selected!==null&&!state.busy?state.contentOptions?.[state.selected]:null,result=chosen?chosen.prompt:(state.selected!==null&&!state.busy?state.options[state.selected]:'Wat wordt het onderwerp?'),edit=state.contentOptions?'':'<button type="button" class="smallbtn" data-na="edit-wheel">Eigen onderwerpen</button>',order=chosen?.interactionType==='IT_008_ORDER'?`<div class="content-order-renderer"><strong>Zinsdelen</strong><div class="content-order-tokens">${chosen.orderTokens.map(x=>`<span>${esc(x)}</span>`).join('')}</div><details><summary>Toon antwoord</summary><p>${esc(chosen.model)}</p></details></div>`:'';
   return `<div class="na-wheel-layout"><div class="na-wheel-frame"><span class="na-pointer" aria-hidden="true"></span><div class="na-wheel" aria-hidden="true" style="background:conic-gradient(${gradient});transform:rotate(${state.rotation}deg)">${state.options.map((_,i)=>{const a=(i+.5)*Math.PI*2/n;return `<b style="left:${50+37*Math.sin(a)}%;top:${50-37*Math.cos(a)}%">${i+1}</b>`}).join('')}<span class="na-hub"></span></div></div><div class="na-wheel-result"><h2 ${chosen?`data-content-item-id="${esc(chosen.id)}"`:''}>${esc(result)}</h2>${order}<p>${state.busy?'Het wiel draait…':'Druk op Draaien of gebruik de spatiebalk.'}</p></div></div><ol class="na-wheel-legend">${state.options.map((x,i)=>`<li ${state.contentOptions?`data-content-item-id="${esc(state.contentOptions[i].id)}"`:''}>${esc(x)}</li>`).join('')}</ol>${edit}`;
  }
  if(kind==='memory')return `<div class="na-memory">${state.order.map((pair,i)=>{
   const open=state.revealed.includes(i)||state.done.includes(pair),matched=state.done.includes(pair);
   return button('flip',i,open?`${imageCard(state.words[pair])}<span>${esc(state.words[pair])}${matched?' ✓':''}</span>`:`<img class="na-card-logo" src="assets/brand/taalroute-white.svg" alt=""><span>Kaart ${i+1}</span>`,`aria-label="${open?esc(state.words[pair])+(matched?', paar gevonden':''): 'Kaart '+(i+1)+', omdraaien'}" aria-pressed="${open}" ${open||state.revealed.length===2?'disabled':''} data-face="${open?'front':'back'}"`);
  }).join('')}</div><p class="na-progress">${state.done.length} / ${state.words.length} paren · ${state.attempts} pogingen</p>`;
  if(kind==='koppelen')return `<div class="na-pairs"><div aria-label="Beelden">${state.words.map((word,i)=>button('select',i,`${imageCard(word)}<span>${state.done.includes(i)?'Gekoppeld ✓':'Beeld '+(i+1)}</span>`,`aria-label="Beeld ${i+1}: ${esc(word)}" aria-pressed="${state.selected===i}" ${state.done.includes(i)?'disabled':''}`)).join('')}</div><div aria-label="Woorden">${state.order.map(i=>button('match',i,esc(state.words[i])+(state.done.includes(i)?' ✓':''),state.done.includes(i)?'disabled':'')).join('')}</div></div>`;
  if(kind==='sorteren'){
   const c=content.sorting[state.round%content.sorting.length],item=c.items[state.order[state.done.length]];
   return `<h2>${esc(c.title)}</h2>${item?`<div class="na-word">${esc(item[0])}</div><div class="na-options">${c.groups.map((x,i)=>button('sort',i,esc(x))).join('')}</div>`:'<p class="na-word">Alles gesorteerd ✓</p>'}<p class="na-progress">${state.done.length} / ${c.items.length} woorden</p><div class="na-sort-result">${c.groups.map((g,i)=>`<section><h3>${esc(g)}</h3><p>${state.done.filter(k=>c.items[k][1]===i).map(k=>esc(c.items[k][0])).join(' · ')||'Nog geen woorden'}</p></section>`).join('')}</div>`;
  }
  if(kind==='rangschikken'){
   const c=content.sequences[state.round%content.sequences.length];
   return `<h2>${esc(c.title)}</h2><ol class="na-sequence">${state.sequence.map((i,j)=>`<li>${button('remove-step',j,esc(c.steps[i]),`aria-label="Stap ${j+1} terugleggen: ${esc(c.steps[i])}" ${state.correct?'disabled':''}`)}</li>`).join('')}</ol>${state.sequence.length?'':'<p class="na-empty">Kies hieronder wat eerst komt.</p>'}<div class="na-step-bank">${state.order.filter(i=>!state.sequence.includes(i)).map(i=>button('step',i,esc(c.steps[i]))).join('')}</div>`;
  }
  if(kind==='categorieenquiz'){
   const q=content.quiz[state.question];
   if(q){const answered=Object.hasOwn(state.answers,state.question);return `<p class="na-progress">${esc(q.category)} · ${q.points} punten · Team ${state.team+1}</p><h2>${esc(q.question)}</h2><div class="na-options na-quiz-options">${q.options.map((x,i)=>button('quiz-answer',i,esc(x)+(answered&&i===q.answer?' ✓':''),`${answered?'disabled':''} ${answered&&i===q.answer?'data-correct="true"':''}`)).join('')}</div>`}
   return `<div class="na-scoreboard">${state.scores.map((score,i)=>button('team',i,`Team ${i+1}<strong>${score}</strong>`,`aria-pressed="${state.team===i}"`)).join('')}</div><div class="na-quiz-board">${[...new Set(content.quiz.map(q=>q.category))].map(category=>`<section><h3>${esc(category)}</h3>${content.quiz.map((q,i)=>q.category===category?button('question',i,Object.hasOwn(state.answers,i)?'Gespeeld ✓':String(q.points),`aria-label="${esc(category)}, ${q.points} punten" ${Object.hasOwn(state.answers,i)?'disabled':''}`):'').join('')}</section>`).join('')}</div>`;
  }
  const r=content.riddles[state.round%content.riddles.length];
  return `<ol class="na-clues">${r.clues.slice(0,state.hints).map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${state.answer?`<p class="na-word">${esc(r.word)}</p>`:`<form id="na-guess-form"><label for="na-guess">Jullie antwoord <small>(of raad samen hardop)</small></label><div class="na-guess-input"><input id="na-guess" maxlength="80" autocomplete="off"><button class="smallbtn" type="submit">Controleer</button></div></form>`}<div class="na-options">${button('hint',0,'Nog een hint',state.hints===r.clues.length?'disabled':'')}${button('reveal',0,'Toon antwoord',state.answer?'disabled':'')}</div>`;
 }
 function primary(){
  if(kind==='draaiwiel')return ['DRAAIEN',state.busy];
  if(kind==='memory')return [state.done.length===state.words.length?'NIEUWE RONDE':'VERDER',state.done.length!==state.words.length&&state.revealed.length!==2];
  if(kind==='koppelen')return ['NIEUWE RONDE',state.done.length!==state.words.length];
  if(kind==='sorteren')return ['VOLGENDE RONDE',state.done.length!==state.order.length];
  if(kind==='rangschikken')return [state.correct?'VOLGENDE RONDE':'CONTROLEREN',state.sequence.length!==state.order.length];
  if(kind==='categorieenquiz')return [state.question!==null?'NAAR HET QUIZBORD':'NIEUWE QUIZ',state.question!==null?!Object.hasOwn(state.answers,state.question):Object.keys(state.answers).length!==content.quiz.length];
  return ['VOLGEND WOORD',false];
 }
 function variants(){
  if(kind==='draaiwiel')return content.wheelTitles;
  if(kind==='memory'||kind==='koppelen')return content.pictureSets.map(s=>s.title);
  if(kind==='sorteren')return content.sorting.map(s=>s.title);
  if(kind==='rangschikken')return content.sequences.map(s=>s.title);
  if(kind==='raad-het-woord')return content.riddles.map((_,i)=>`Raadsel ${i+1}`);
  return [];
 }
 function setPicker(){
  const list=variants();
  return list.length?`<label class="card-route-label na-set-picker" for="na-set">${kind==='draaiwiel'?'Onderwerpen op het wiel':'Kies een ronde'}<select id="na-set" ${state.busy?'disabled':''}>${state.custom?'<option selected disabled value="custom">Eigen onderwerpen</option>':''}${list.map((name,i)=>`<option value="${i}" ${!state.custom&&state.round%list.length===i?'selected':''}>${i+1}. ${esc(name)}</option>`).join('')}</select></label>`:'';
 }
 function render(focusId){
  const [,title,world,icon,color,intro]=game(),[label,disabled]=primary();
  let footer=gameBar(`<button class="primary card-next-primary" id="primaryGame" ${disabled?'disabled':''}>${gameIcon(kind==='draaiwiel'?'mission':'cards')}<span>${label}</span></button>`).replace('id="undoAction"','id="activityUndo"');
  if(kind==='categorieenquiz')footer=footer.replace(/<div class="turnzone">.*?<\/div>(?=<div class="primary-slot">)/,`<div class="turnzone"><div class="chip active">Team ${state.team+1}</div><div class="chip">${state.scores[state.team]} punten</div></div>`);
  $('#gameMount').innerHTML=`<div class="game-shell card-table-shell new-activity" data-workspace="${['draaiwiel','raad-het-woord'].includes(kind)?'standard':'wide'}" style="--ribbon:${color}"><div class="game-work card-work"><div class="card-activity-heading"><div><button class="smallbtn na-back" data-activities-back>← Activiteiten</button><h1>${esc(title)}</h1><p>${esc(intro)}</p></div>${setPicker()}</div><div class="cards-stage"><div class="game-card-motion"><article class="active-card"><div class="card-ribbon">${gameIcon(icon)}<strong>${esc(title)}</strong><span class="card-counter">${state.custom?'Eigen set':variants().length?`${state.round%variants().length+1} / ${variants().length}`:`${Object.keys(state.answers).length} / ${content.quiz.length}`}</span></div><div class="card-content"><div class="na-workspace">${body()}</div><p id="na-level" class="na-level">${esc(levelInstruction())}</p><p class="na-feedback" id="na-feedback" role="status" aria-live="polite" aria-atomic="true"></p></div>${contextTools('na',{Example:{disabled:!exampleAvailable(),tip:exampleAvailable()?'Bekijk een voorbeeld bij deze ronde.':'Doe eerst een poging of onthul het antwoord in het spel.'}})}</article></div></div></div>${footer}</div>`;
  bindGameBar(actPrimary);
  for(const key of ['Help','Example','Goals','Partner','More'])$('#na'+key).onclick=()=>context(key);
  $('#na-set')?.addEventListener('change',e=>{
   const round=Number(e.target.value);if(state.busy||!Number.isInteger(round)||round<0||round>=variants().length)return;
   checkpoint();state=rounds[kind]=fresh(kind,round);render('na-set');
  });
  $('#activityUndo').disabled=!histories[kind].length||state.busy;
  $('#activityUndo').onclick=()=>{if(!histories[kind].length||state.busy)return;const prior=histories[kind].pop();state=rounds[kind]=prior.state;APP.turn=prior.turn;save();render('activityUndo')};
  $('[data-ghelp]').onclick=help;
  $('[data-grules]').onclick=help;
  $('[data-goptions]').onclick=()=>kind==='draaiwiel'?editWheel():openGameDialog('Spelopties','<p>Kies de spelmodus links onderaan. Het niveau bovenaan past de gesprekstip aan. Kies bovenaan een andere ronde. Het niveau verandert de gesprekstip.</p><p>Bij de quiz kies je op het quizbord welk team antwoordt. Een goed antwoord levert punten op; een fout antwoord kost geen punten.</p>');
  $('#na-guess-form')?.addEventListener('submit',e=>{e.preventDefault();guess()});
  const message=state.feedback;
  requestAnimationFrame(()=>{const el=$('#na-feedback');if(el)el.textContent=message});
  if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
 }
 function exampleAvailable(){
  if(kind==='categorieenquiz')return state.question!==null&&Object.hasOwn(state.answers,state.question);
  if(kind==='raad-het-woord')return state.answer;
  if(kind==='rangschikken')return state.attempts>0||state.correct;
  return true;
 }
 function context(key){
  if(key==='Help')return help();
  const round=variants()[state.round%variants().length]||game()[1];
  const examples={
   draaiwiel:()=>state.contentOptions?(state.contentOptions[state.selected??0]?.model||'Bekijk het mogelijke antwoord bij deze grammaticaopdracht.'):`Kies één onderwerp, bijvoorbeeld “${state.options[state.selected??0]}”. Vertel één eigen ervaring en laat je gesprekspartner doorvragen.`,
   memory:()=>`Als je twee kaarten met “${state.words[0]}” omdraait, heb je een paar. Benoem wat je ziet.`,
   koppelen:()=>`Bij een beeld van “${state.words[0]}” kies je het woord “${state.words[0]}”.`,
   sorteren:()=>{const c=content.sorting[state.round%content.sorting.length],item=c.items[state.order[state.done.length]??0];return `“${item[0]}” hoort bij “${c.groups[item[1]]}”. Bespreek samen waarom.`},
   rangschikken:()=>content.sequences[state.round%content.sequences.length].steps.join(' → '),
   categorieenquiz:()=>{const q=content.quiz[state.question];return q.options[q.answer]+'. '+q.explanation},
   'raad-het-woord':()=>{const r=content.riddles[state.round%content.riddles.length];return r.word+': '+r.clues.join(' ')}
  };
  if(key==='Example'&&!exampleAvailable())return;
  const sections={Example:[['Bij deze ronde',key==='Example'?examples[kind]():'']],Goals:[['Doel',game()[5]],['Deze ronde',round],['Rollen',kind==='categorieenquiz'?'Het actieve team overlegt en kiest een antwoord. Het andere team luistert. Daarna wisselt de beurt.':'Eén deelnemer kiest of vertelt. De gesprekspartner luistert, vraagt door en denkt mee. Wissel na de beurt.']],Partner:[['Bij deze ronde',round],['Jouw rol',kind==='categorieenquiz'?'Overleg met je team voordat één van jullie het antwoord kiest. Leg daarna uit hoe jullie tot de keuze kwamen.':'Laat de ander eerst kiezen of vertellen. Vraag: waarom kies je dat? Wat herken je? Bespreek samen de uitkomst.'],['Gesprekstip',levelInstruction()]],More:[['Verder oefenen','Vertel waar je de woorden of de situatie uit deze ronde in je eigen leven tegenkomt.'],['Opnieuw','Je kunt deze ronde opnieuw beginnen. Terug herstelt je vorige stap.']]}[key];
  openGameDialog({Example:'Voorbeeld',Goals:'Doel en rollen',Partner:'Voor de gesprekspartner',More:'Meer bij deze ronde'}[key],sections.map(([title,text])=>`<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join('')+(key==='More'?'<button class="smallbtn" id="naRestartRound">Ronde opnieuw beginnen</button>':''),()=>{if(key==='More')$('#naRestartRound').onclick=()=>{$('#gameDialog').close();action('restart')}});
 }
 function help(){openGameDialog(game()[1],`<p>${esc(game()[5])}</p><p>${esc({draaiwiel:state.contentOptions?'Dit wiel gebruikt de actieve canonieke ER B1 contentsessie. De segmenten verwijzen naar dezelfde content IDs als BOARD en CARDS.':'Gebruik Eigen onderwerpen om twee tot twaalf eigen keuzes in te vullen. Draaien kiest willekeurig één onderwerp.',memory:'Draai twee kaarten om. Een paar blijft zichtbaar. Gebruik Verder om twee verschillende kaarten weer om te draaien.',koppelen:'Selecteer links een beeld en rechts het juiste woord. Een verkeerd antwoord kun je opnieuw proberen.',sorteren:'Kies de juiste groep voor het woord. Bij een fout blijft het woord staan zodat je opnieuw kunt kiezen.',rangschikken:'Tik de stappen van begin tot eind aan. Tik een gekozen stap aan om hem terug te leggen. Controleer als alle stappen zijn gekozen.',categorieenquiz:'Selecteer Team 1 of Team 2, kies een vak en geef één antwoord. Goed: de punten van het vak. Fout: geen punten. Daarna is het andere team aan de beurt. Bij gelijkspel delen de teams de winst.','raad-het-woord':'Raad samen hardop of typ een antwoord. Vraag om nog een hint of toon het antwoord. Volgend woord start een nieuwe ronde.'}[kind])}</p><p>${esc(levelInstruction())}</p>`)}
 function next(){checkpoint();const options=state.options,contentOptions=state.contentOptions;state=rounds[kind]=fresh(kind,state.round+1);if(options&&!contentOptions)state.options=options;completeTurn();render('primaryGame')}
 function actPrimary(){
  if(primary()[1])return;
  if(kind==='draaiwiel'){
   checkpoint();state.busy=true;state.selected=Math.floor(Math.random()*state.options.length);const rotation=Math.ceil(state.rotation/360)*360+1080-(state.selected+.5)*360/state.options.length;
   $('#primaryGame').disabled=true;$('#activityUndo').disabled=true;$('#na-set').disabled=true;$('.na-wheel').style.transform=`rotate(${rotation}deg)`;state.rotation=rotation;$('#na-feedback').textContent='Het wiel draait…';
   timer=setTimeout(()=>{state.busy=false;state.feedback=state.contentOptions?.[state.selected]?.prompt||state.options[state.selected];if(APP.last?.type==='activity'&&APP.last.data.kind===kind&&$('#screen-game').classList.contains('active'))render('primaryGame')},settingsState().reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);return;
  }
  if(kind==='memory'&&state.done.length!==state.words.length){checkpoint();state.revealed=[];completeTurn();feedback('Kies weer twee kaarten.');render();return}
  if(kind==='rangschikken'&&!state.correct){checkpoint();state.attempts++;state.correct=state.sequence.every((x,i)=>x===i);feedback(state.correct?'De volgorde klopt! Vertel nu alle stappen in je eigen woorden.':'De volgorde klopt nog niet. Leg een stap terug en probeer opnieuw.');render('primaryGame');return}
  if(kind==='categorieenquiz'&&state.question!==null){checkpoint();state.question=null;state.team=1-state.team;completeTurn();feedback(Object.keys(state.answers).length===content.quiz.length?(state.scores[0]===state.scores[1]?'Gelijkspel!':`Team ${state.scores[0]>state.scores[1]?1:2} wint!`):`Team ${state.team+1} kiest een vak.`);render();return}
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
  checkpoint();const normalize=x=>x.toLocaleLowerCase('nl').normalize('NFC').replace(/^(de|het|een)\s+/,'').replace(/[.!?]+$/,'').trim();
  state.answer=normalize(value)===content.riddles[state.round%content.riddles.length].word;
  feedback(state.answer?'Goed geraden! Maak samen een zin met dit woord.':'Dat is het nog niet. Probeer opnieuw of vraag een hint.');render(state.answer?'primaryGame':'na-guess');
 }
 function action(action,value,focusId){
  if(state.busy)return;
  if(action==='help')return help();if(action==='edit-wheel')return editWheel();
  if(action==='restart'){checkpoint();const prior=state;state=rounds[kind]=fresh(kind,state.round);if(prior.custom){state.options=prior.options;state.custom=true}render();return}
  const i=Number(value);if(!Number.isInteger(i)||i<0)return;
  checkpoint();
  if(action==='flip'&&kind==='memory'&&i<state.order.length&&!state.done.includes(state.order[i])&&!state.revealed.includes(i)&&state.revealed.length<2){
   state.revealed.push(i);feedback('Draai nog een kaart om.');
   if(state.revealed.length===2){state.attempts++;const [a,b]=state.revealed;if(state.order[a]===state.order[b]){state.done.push(state.order[a]);state.revealed=[];feedback(state.done.length===state.words.length?'Alle paren gevonden!':'Een paar gevonden! Zoek verder.')}else feedback('Geen paar. Bekijk de kaarten en kies Verder.')}
  }else if(action==='select'&&kind==='koppelen'&&i<state.words.length&&!state.done.includes(i)){state.selected=i;feedback('Kies nu het woord dat erbij hoort.')}
  else if(action==='match'&&kind==='koppelen'&&i<state.words.length&&!state.done.includes(i)){if(state.selected===null)feedback('Kies eerst links een beeld.');else if(state.selected===i){state.done.push(i);state.selected=null;feedback(state.done.length===state.words.length?'Alles gekoppeld!':'Dat hoort bij elkaar!')}else feedback('Dat hoort nog niet bij elkaar. Kies een ander woord.')}
  else if(action==='sort'&&kind==='sorteren'){
   const c=content.sorting[state.round%content.sorting.length],index=state.order[state.done.length],item=c.items[index];
   if(item&&i<c.groups.length){if(item[1]===i){state.done.push(index);feedback(state.done.length===c.items.length?'Alles goed gesorteerd!':'Goed! Kies de groep voor het volgende woord.')}else feedback('Probeer de andere groep. Bespreek waarom het woord daar hoort.')}
  }else if(action==='step'&&kind==='rangschikken'&&state.order.includes(i)&&!state.sequence.includes(i)){state.sequence.push(i);state.correct=false;feedback('')}
  else if(action==='remove-step'&&kind==='rangschikken'&&i<state.sequence.length&&!state.correct){state.sequence.splice(i,1);feedback('Kies de volgende stap.')}
  else if(action==='team'&&kind==='categorieenquiz'&&i<2&&state.question===null){state.team=i;feedback(`Team ${i+1} kiest een vak.`)}
  else if(action==='question'&&kind==='categorieenquiz'&&i<content.quiz.length&&!Object.hasOwn(state.answers,i)){state.question=i;feedback('Overleg en kies één antwoord.')}
  else if(action==='quiz-answer'&&kind==='categorieenquiz'&&state.question!==null&&!Object.hasOwn(state.answers,state.question)){
   const q=content.quiz[state.question];if(i<q.options.length){state.answers[state.question]=i;const correct=i===q.answer;if(correct)state.scores[state.team]+=q.points;feedback((correct?`Goed! ${q.points} punten voor Team ${state.team+1}. `:'Nog niet goed. ')+q.explanation)}
  }else if(action==='hint'&&kind==='raad-het-woord'){state.hints=Math.min(3,state.hints+1);feedback('Er is een nieuwe aanwijzing.')}
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
 return {start};
})();
