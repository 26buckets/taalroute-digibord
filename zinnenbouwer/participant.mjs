import {SentenceBoard,escapeHtml as esc,button} from './board.mjs';
import {enabled} from './model.mjs';
import {LiveClient,request} from './live-client.mjs';
const root=document.querySelector('#app'),KEY='taalroute-zinnenbouwer-participant';
let credentials,client,state,board,connection='connecting',busy=false,pending=null;
const read=key=>{try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch{return null;}};
const put=(key,value)=>{try{if(value===null)sessionStorage.removeItem(key);else sessionStorage.setItem(key,JSON.stringify(value));}catch{}};
const draftKey=round=>`${KEY}-${credentials.code}-${round}`;
function error(text){const e=root.querySelector('[data-error]');if(e)e.textContent=text;}
function joinScreen(message=''){
 root.innerHTML=`<section class="zb-panel zb-join"><h1>Doe mee</h1><form data-join><label for="code">Sessiecode</label><input id="code" name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required autocomplete="off" value="${esc(new URLSearchParams(location.search).get('code')?.replace(/\D/g,'').slice(0,6)||'')}"><label for="name">Je naam (mag leeg blijven)</label><input id="name" name="name" maxlength="40" autocomplete="off"><button class="primary" type="submit">Meedoen</button></form><p data-error class="zb-error" role="alert">${esc(message)}</p></section>`;
 root.querySelector('form').addEventListener('submit',async e=>{
  e.preventDefault();if(busy)return;busy=true;root.querySelector('button').disabled=true;
  const data=new FormData(/** @type {HTMLFormElement} */(e.currentTarget));
  try{credentials=await request(String(data.get('code'))+'/join',{name:String(data.get('name'))});put(KEY,credentials);connect();}
  catch(e){error(e.message);root.querySelector('button').disabled=false;}
  finally{busy=false;}
 });
}
function connectionText(){const el=root.querySelector('[data-connection]');if(el)el.textContent=connection==='connected'?'':connection==='connecting'?'Verbinding maken…':'Verbinding onderbroken. Je zin blijft staan. We proberen opnieuw.';updateSubmit();}
function updateSubmit(){const b=/** @type {HTMLButtonElement} */(root.querySelector('button[data-action="submit"]'));if(b)b.disabled=busy||connection!=='connected'||!!state?.answer||!board||board.order.length!==enabled(state.model).length;}
function render(){
 if(!state)return;
 const status=state.status;
 if(status==='closed'){
  root.innerHTML='<section class="zb-panel"><h1>De sessie is afgelopen</h1><p>Bedankt voor het meedoen.</p><a class="zb-link" href="meedoen.html">Andere sessie</a></section>';put(KEY,null);put(draftKey(state.round),null);client?.stop();return;
 }
 root.innerHTML=`<h1>${status==='waiting'?'Wacht op de docent':status==='review'?'Samen bespreken':'Bouw je zin'}</h1><p data-connection class="zb-connection" role="status"></p>${status==='waiting'?'<p>Je bent erbij. De docent start zo de ronde.</p>':status==='review'?'<p>Bekijk de antwoorden samen op het bord. De volgende ronde verschijnt vanzelf.</p>':'<div data-board></div><button type="button" class="primary zb-submit" data-action="submit">Antwoord insturen</button><p data-received role="status"></p>'}<p data-error class="zb-error" role="alert"></p>`;
 if(status==='active'){
  const saved=read(draftKey(state.round));pending=saved?.pending||null;
  board=new SentenceBoard(/** @type {HTMLElement} */(root.querySelector('[data-board]')),state.model,state.exercise,order=>{pending=null;put(draftKey(state.round),{order,pending});updateSubmit();},state.answer||saved?.order||state.exercise.order);
  if(state.answer){board.locked=true;board.render();root.querySelector('[data-received]').textContent='Je antwoord is ontvangen. Wacht op de docent.';}
 }
 connectionText();
}
function connect(){
 client?.stop();
 root.innerHTML='<h1>Je sessie openen</h1><p data-connection class="zb-connection" role="status">Verbinding maken…</p><p data-error role="alert"></p>';
 client=new LiveClient(credentials,next=>{
  const previous=state,changed=!previous||next.round!==previous.round||next.status!==previous.status;
  state=next;
  if(previous&&next.round!==previous.round){put(draftKey(previous.round),null);board=null;pending=null;}
  if(changed)render();
  else if(state.answer&&board){error('');board.locked=true;board.render();put(draftKey(state.round),{order:state.answer});root.querySelector('[data-received]').textContent='Je antwoord is ontvangen. Wacht op de docent.';updateSubmit();}
 },(status,message)=>{connection=status;connectionText();if(message){client?.stop();put(KEY,null);joinScreen(message);}});
}
root.addEventListener('click',async e=>{
 if(!/** @type {HTMLElement} */(e.target).closest('[data-action="submit"]')||busy||!board||connection!=='connected')return;
 busy=true;updateSubmit();error('');
 pending??={type:'submit',round:state.round,order:[...board.order],requestId:crypto.randomUUID()};
 put(draftKey(state.round),{order:board.order,pending});
 const submission=pending;board.locked=true;board.render();
 try{await client.command(submission);if(state.round===submission.round&&state.status==='active'){state.answer=submission.order;root.querySelector('[data-received]').textContent='Je antwoord is ontvangen. Wacht op de docent.';}}
 catch(e){if(!state.answer)error(e.message);}
 finally{busy=false;if(state.round===submission.round&&state.status==='active'){board.locked=!!state.answer;board.render();}updateSubmit();}
});
const saved=read(KEY),requested=new URLSearchParams(location.search).get('code');
if(saved?.token&&(!requested||requested===saved.code)){credentials=saved;connect();}else joinScreen();
