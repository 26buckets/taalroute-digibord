import {createSession,joinSession,applyCommand,snapshot,actor,assertOpen,SessionError} from '../zinnenbouwer/session.mjs';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const error=e=>json({code:e instanceof SessionError?e.code:'UNAVAILABLE',message:e instanceof SessionError?e.message:'Live is tijdelijk niet bereikbaar. Probeer opnieuw.'},e instanceof SessionError?e.status:503);
async function body(request){
 if(Number(request.headers.get('Content-Length'))>16000)throw new SessionError('SIZE','De activiteit is te groot.',413);
 const reader=request.body?.getReader();let bytes=0,text='';const decoder=new TextDecoder();
 if(!reader)throw new SessionError('JSON','Geen gegevens ontvangen.');
 try{for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>16000){await reader.cancel();throw new SessionError('SIZE','De activiteit is te groot.',413);}text+=decoder.decode(value,{stream:true});}return JSON.parse(text+decoder.decode());}catch(e){if(e instanceof SessionError)throw e;throw new SessionError('JSON','Ongeldige gegevens.');}
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/live/'))return env.ASSETS.fetch(request);
  try{
   if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)throw new SessionError('ORIGIN','Open Live vanuit DigiBord.',403);
   if(url.pathname==='/api/live/sessions'&&request.method==='POST'){
    const data=await body(request);
    for(let i=0;i<5;i++){
     const code=String(100000+crypto.getRandomValues(new Uint32Array(1))[0]%900000),stub=env.LIVE_SESSIONS.get(env.LIVE_SESSIONS.idFromName(code));
     const response=await stub.fetch(new Request(url.origin+'/create',{method:'POST',body:JSON.stringify({...data,code})}));
     if(response.status!==409)return response;
    }
    throw new SessionError('BUSY','Probeer Live opnieuw te starten.',503);
   }
   const match=url.pathname.match(/^\/api\/live\/(\d{6})\/(join|command|socket)$/);
   if(!match)throw new SessionError('UNKNOWN','Deze sessiecode is niet bekend.',404);
   if(match[2]!=='socket'&&request.method!=='POST')throw new SessionError('METHOD','Deze actie is niet toegestaan.',405);
   const stub=env.LIVE_SESSIONS.get(env.LIVE_SESSIONS.idFromName(match[1]));
   const target=new URL('/'+match[2],url.origin);
   if(match[2]==='socket')return await stub.fetch(new Request(target,request));
   // Buffer bounded JSON before crossing the DO boundary, including early closed/unknown replies.
   const payload=await body(request),headers=new Headers(request.headers);headers.delete('Content-Length');
   return await stub.fetch(new Request(target,{method:'POST',headers,body:JSON.stringify(payload)}));
  }catch(e){return error(e);}
 }
};
export class LiveSession {
 constructor(ctx,env){this.ctx=ctx;this.env=env;this.session=null;ctx.blockConcurrencyWhile(async()=>{this.session=await ctx.storage.get('session')||((await ctx.storage.get('closed'))?{status:'closed',expiresAt:0}:null);});}
 async fetch(request){
  try{
   const path=new URL(request.url).pathname;
   if(path==='/create'){
    const data=await body(request),token=crypto.randomUUID();
    // Claim only after reading the body: concurrent creates must not both pass an earlier empty-state check.
    if(this.session&&this.session.expiresAt>Date.now())throw new SessionError('COLLISION','Code bestaat al.',409);
    this.session=createSession(data.model,data.type,data.code,token);
    await this.ctx.storage.put('session',this.session);await this.ctx.storage.setAlarm(this.session.expiresAt);
    return json({code:data.code,token});
   }
   if(path==='/socket'){
    if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')throw new SessionError('UPGRADE','Open een Live-verbinding.',426);
    if(this.ctx.getWebSockets().length>=220)throw new SessionError('FULL','Te veel verbindingen. Probeer opnieuw.',429);
    const pair=new WebSocketPair(),[client,server]=Object.values(pair);
    this.ctx.acceptWebSocket(server);server.serializeAttachment({token:null,opened:Date.now()});
    setTimeout(()=>{if(!server.deserializeAttachment()?.token)server.close(1008,'Authenticatie nodig');},10000);
    return new Response(null,{status:101,webSocket:client});
   }
   assertOpen(this.session);
   const data=await body(request);
   if(path==='/join'){
    const result=joinSession(this.session,data.name||'',crypto.randomUUID(),crypto.randomUUID());
    await this.persist();this.broadcast();return json(result);
   }
   if(path==='/command'){
    const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');
    applyCommand(this.session,token,data);await this.persist();this.broadcast();
    const response=json({ok:true,round:this.session.round,revision:this.session.revision});
    if(this.session.status==='closed')await this.close();
    return response;
   }
   throw new SessionError('UNKNOWN','Onbekende actie.',404);
  }catch(e){return error(e);}
 }
 async persist(){await this.ctx.storage.put('session',this.session);}
 connected(){return [...new Set(this.ctx.getWebSockets().flatMap(ws=>{const a=ws.deserializeAttachment();if(!a?.token)return [];try{const who=actor(this.session,a.token);return who.role==='participant'?[who.id]:[];}catch{return [];}}))];}
 broadcast(){
  const connected=this.connected();
  for(const ws of this.ctx.getWebSockets()){
   const auth=ws.deserializeAttachment();
   if(!auth?.token){if(Date.now()-auth?.opened>10000)ws.close(1008,'Authenticatie nodig');continue;}
   try{ws.send(JSON.stringify({type:'snapshot',state:snapshot(this.session,auth.token,connected)}));}catch{ws.close(1011,'Verbinding herstellen');}
  }
 }
 async webSocketMessage(ws,message){
  try{
   assertOpen(this.session);
   if(typeof message!=='string'||message.length>300)throw new SessionError('SIZE','Ongeldig bericht.');
   const data=JSON.parse(message),previous=ws.deserializeAttachment();
   if(previous?.token||data.type!=='auth')throw new SessionError('AUTH','Ongeldige verbinding.',401);
   actor(this.session,data.token);ws.serializeAttachment({token:data.token,opened:previous.opened});this.broadcast();
  }catch(e){ws.send(JSON.stringify({type:'error',code:e instanceof SessionError?e.code:'AUTH',message:e instanceof SessionError?e.message:'Open de sessie opnieuw.'}));ws.close(1008,'Verbinding niet toegestaan');}
 }
 webSocketClose(ws,code){try{ws.close(code===1006?1000:code);}catch{}if(this.session?.ownerToken)this.broadcast();}
 webSocketError(ws){try{ws.close(1011,'Verbinding herstellen');}catch{}}
 async close(){
  // Keep only a short-lived closed tombstone; no names, models, tokens or answers.
  await this.ctx.storage.deleteAll();await this.ctx.storage.put('closed',true);await this.ctx.storage.setAlarm(Date.now()+60000);
  for(const ws of this.ctx.getWebSockets())ws.close(1000,'Sessie gesloten');
  this.session={status:'closed',expiresAt:0};
 }
 async alarm(){
  if(this.session?.ownerToken){this.session.status='closed';this.session.revision++;this.broadcast();for(const ws of this.ctx.getWebSockets())ws.close(1000,'Sessie afgelopen');}
  this.session=null;await this.ctx.storage.deleteAll();
 }
}
