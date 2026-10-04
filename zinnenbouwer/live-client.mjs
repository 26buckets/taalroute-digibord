export class LiveError extends Error {
 constructor(message,code='NETWORK'){super(message);this.code=code;}
}
export async function request(path,body,token) {
 let response;
 try {response=await fetch('/api/live/'+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});}catch{throw new LiveError('Geen verbinding. Je zin blijft bewaard. Probeer opnieuw.');}
 let data;try{data=await response.json();}catch{throw new LiveError('Live is niet bereikbaar. Probeer opnieuw of ga klassikaal verder.');}
 if(!response.ok)throw new LiveError(data.message||'Live is niet bereikbaar.',data.code);
 return data;
}
export class LiveClient {
 constructor(credentials,onSnapshot,onConnection){this.credentials=credentials;this.onSnapshot=onSnapshot;this.onConnection=onConnection;this.attempt=0;this.stopped=false;this.revision=-1;this.connect();}
 connect(){
  if(this.stopped)return;
  clearTimeout(this.timer);this.socket?.close();
  this.onConnection('connecting');
  const socket=new WebSocket(`${location.protocol==='https:'?'wss:':'ws:'}//${location.host}/api/live/${this.credentials.code}/socket`);this.socket=socket;
  const timeout=setTimeout(()=>socket.close(),10000);
  socket.onopen=()=>socket.send(JSON.stringify({type:'auth',token:this.credentials.token}));
  socket.onmessage=e=>{
   let data;try{data=JSON.parse(e.data);}catch{return;}
   if(data.type==='error'){this.onConnection('error',data.message);if(['AUTH','CLOSED','UNKNOWN'].includes(data.code)){this.stopped=true;socket.close();}return;}
   if(data.type==='snapshot'){
    clearTimeout(timeout);this.attempt=0;this.onConnection('connected');
    if(data.state.revision>=this.revision){this.revision=data.state.revision;this.onSnapshot(data.state);}
   }
  };
  socket.onclose=()=>{clearTimeout(timeout);if(this.stopped||this.socket!==socket)return;this.onConnection('disconnected');this.timer=setTimeout(()=>this.connect(),Math.min(1000*2**this.attempt++,15000));};
  socket.onerror=()=>socket.close();
 }
 async command(command){return request(this.credentials.code+'/command',{...command,requestId:command.requestId||crypto.randomUUID()},this.credentials.token);}
 stop(){this.stopped=true;clearTimeout(this.timer);this.socket?.close();}
}
