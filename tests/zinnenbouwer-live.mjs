import test from 'node:test';
import assert from 'node:assert/strict';
import {blankModel} from '../zinnenbouwer/model.mjs';
const base=process.env.LIVE_TEST_URL||'http://127.0.0.1:8799';
const model=blankModel();for(const c of model.components){c.enabled=['subject','finiteVerb','time'].includes(c.type);c.value={subject:'ik',finiteVerb:'werk',time:'morgen'}[c.type]||'';if(c.verb){c.verb.lemma='werken';c.verb.surfaceForm=c.value;}}
async function post(path,data,token,headers={}){const res=await fetch(base+'/api/live/'+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...headers},body:JSON.stringify(data)});return {status:res.status,body:await res.json()};}
const command=(type,extra={})=>({type,requestId:crypto.randomUUID(),...extra});
function socket(code,token){
 const ws=new WebSocket(base.replace('http','ws')+'/api/live/'+code+'/socket');
 const messages=[];ws.addEventListener('message',e=>messages.push(JSON.parse(String(e.data))));
 ws.addEventListener('open',()=>ws.send(JSON.stringify({type:'auth',token})));
 return {ws,messages,async wait(predicate){for(let i=0;i<100;i++){const value=messages.find(predicate);if(value)return value;await new Promise(r=>setTimeout(r,25));}throw new Error('Geen verwachte Live-update: '+JSON.stringify(messages));}};
}
test('real Cloudflare worker rejects cross-origin, invalid model, payload size and method',async()=>{
 assert.equal((await post('sessions',{model,type:'sentenceBuild'},null,{Origin:'https://other.invalid'})).status,403);
 assert.equal((await post('sessions',{model:{},type:'sentenceBuild'})).status,400);
 assert.equal((await post('sessions',{padding:'x'.repeat(17000)})).status,413);
 assert.equal((await fetch(base+'/api/live/123456/command')).status,405);
 assert.equal((await post('000000/join',{})).status,404);
});
test('role isolation, exact duplicate retry, stale rounds, invalid orders and closed session over HTTP + WebSocket',async()=>{
 const created=await post('sessions',{model,type:'sentenceBuild'});assert.equal(created.status,200);const host=created.body;
 const guest=(await post(host.code+'/join',{name:'Tijdelijke naam'})).body;
 const teacher=socket(host.code,host.token),participant=socket(host.code,guest.token),forged=socket(host.code,'forged');
 try{
  const waiting=await participant.wait(m=>m.type==='snapshot');assert.equal(waiting.state.status,'waiting');assert.equal(waiting.state.model,undefined);assert.equal(waiting.state.groups,undefined);assert.equal(waiting.state.ownerToken,undefined);
  await forged.wait(m=>m.type==='error'&&m.code==='AUTH');
  assert.equal((await post(host.code+'/command',command('start'),'forged')).status,401);
  assert.equal((await post(host.code+'/command',command('start'),guest.token)).status,403);
  const start=command('start');assert.equal((await post(host.code+'/command',start,host.token)).status,200);assert.equal((await post(host.code+'/command',start,host.token)).body.round,1);
  await participant.wait(m=>m.type==='snapshot'&&m.state.status==='active');
  const answer=command('submit',{round:1,order:['time','finiteVerb','subject']});
  assert.equal((await post(host.code+'/command',{...answer,order:['time','time','subject']},guest.token)).status,400);
  assert.equal((await post(host.code+'/command',answer,guest.token)).status,200);assert.equal((await post(host.code+'/command',answer,guest.token)).status,200);
  assert.equal((await post(host.code+'/command',command('submit',{round:1,order:['subject','finiteVerb','time']}),guest.token)).status,409);
  const received=await teacher.wait(m=>m.type==='snapshot'&&m.state.received===1);assert.equal(received.state.groups[0].text,'Morgen werk ik.');assert.equal(received.state.groups[0].count,1);
  const own=await participant.wait(m=>m.type==='snapshot'&&m.state.answer);assert.equal(own.state.groups,undefined);assert.equal(own.state.participants,undefined);
  await post(host.code+'/command',command('review'),host.token);await post(host.code+'/command',command('start'),host.token);
  assert.equal((await post(host.code+'/command',answer,guest.token)).status,200); // exact old request is an idempotent acknowledgement
  assert.equal((await post(host.code+'/command',command('submit',{round:1,order:answer.order}),guest.token)).status,409);
  await post(host.code+'/command',command('close'),host.token);
  await participant.wait(m=>m.type==='snapshot'&&m.state.status==='closed');
  assert.equal((await post(host.code+'/join',{})).status,410);
  const reconnect=socket(host.code,guest.token);await reconnect.wait(m=>m.type==='error'&&m.code==='CLOSED');reconnect.ws.close();
 }finally{teacher.ws.close();participant.ws.close();forged.ws.close();}
});
