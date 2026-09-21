// Adapted from 26buckets/taalroute-digibord, commit a513c9e7a8a7f2b5cffe27136ab223cc1f4efbcb.
globalThis.PraatpadDice=(()=>{
 'use strict';
 const RAD=Math.PI/180;
 // Eén fysieke vorm voor alle dobbelstenen: duidelijke kubusvlakken met een brede, tangentiele afronding.
 // De grotere camerafstand beperkt perspectiefvervorming, zodat de steen vierkant blijft ogen.
 const ROUND_RADIUS=.22,CORE=1-ROUND_RADIUS,CAMERA=8.4;
 const faces=[{value:1,n:[0,0,1],u:[1,0,0],v:[0,1,0]},
  {value:6,n:[0,0,-1],u:[-1,0,0],v:[0,1,0]},
  {value:3,n:[1,0,0],u:[0,0,-1],v:[0,1,0]},
  {value:4,n:[-1,0,0],u:[0,0,1],v:[0,1,0]},
  {value:2,n:[0,1,0],u:[1,0,0],v:[0,0,-1]},
  {value:5,n:[0,-1,0],u:[1,0,0],v:[0,0,1]}];
 const ends={1:[0,0,0],2:[90,0,0],3:[0,-90,0],4:[0,90,0],5:[-90,0,0],6:[0,180,0]};
 const dots={1:[[0,0]],2:[[-.42,.42],[.42,-.42]],3:[[-.42,.42],[0,0],[.42,-.42]],
  4:[[-.42,.42],[.42,.42],[-.42,-.42],[.42,-.42]],
  5:[[-.42,.42],[.42,.42],[0,0],[-.42,-.42],[.42,-.42]],
  6:[[-.42,.42],[.42,.42],[-.42,0],[.42,0],[-.42,-.42],[.42,-.42]]};
 const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
 const norm=a=>{const d=Math.hypot(...a);return a.map(v=>v/d);};
 const multiply=(a,b)=>Array.from({length:9},(_,i)=>{const r=i%3,c=Math.floor(i/3);return a[r]*b[c*3]+a[r+3]*b[c*3+1]+a[r+6]*b[c*3+2];});
 const vector=(m,p)=>[m[0]*p[0]+m[3]*p[1]+m[6]*p[2],m[1]*p[0]+m[4]*p[1]+m[7]*p[2],m[2]*p[0]+m[5]*p[1]+m[8]*p[2]];
 function rotation(axis,degrees){const c=Math.cos(degrees*RAD),s=Math.sin(degrees*RAD);return axis===0?[1,0,0,0,c,s,0,-s,c]:axis===1?[c,0,-s,0,1,0,s,0,c]:[c,s,0,-s,c,0,0,0,1];}
 const view=multiply(rotation(0,24),rotation(1,-28));
 function model(angles,orientation=view){return multiply(orientation,multiply(rotation(2,angles[2]),multiply(rotation(1,angles[1]),rotation(0,angles[0]))));}
 function vertex(f,u,v){
  const p=f.n.map((n,i)=>n+u*f.u[i]+v*f.v[i]),core=p.map(n=>Math.max(-CORE,Math.min(CORE,n))),n=norm(p.map((x,i)=>x-core[i]));
  return [...core.map((x,i)=>x+ROUND_RADIUS*n[i]),...n,f.value];
 }
 function geometry(steps=48){
  const out=[];for(const f of faces)for(let j=0;j<steps;j++)for(let i=0;i<steps;i++){
   const a=vertex(f,2*i/steps-1,2*j/steps-1),b=vertex(f,2*(i+1)/steps-1,2*j/steps-1),c=vertex(f,2*(i+1)/steps-1,2*(j+1)/steps-1),d=vertex(f,2*i/steps-1,2*(j+1)/steps-1);
   out.push(...a,...b,...c,...a,...c,...d);
  }return new Float32Array(out);
 }
 const vertexShader=`attribute vec3 aPosition;attribute vec3 aNormal;attribute float aFace;
 uniform mat3 uModel;uniform vec2 uViewport;uniform float uLift;uniform float uScale;
 varying vec3 vPosition;varying vec3 vNormal;varying vec3 vWorld;varying float vFace;
 void main(){vec3 p=uModel*aPosition;float s=uScale;
 vec2 pixel=p.xy*(8.4/(8.4-p.z))*s+vec2(0.,uLift);
 gl_Position=vec4(pixel.x*2./uViewport.x,pixel.y*2./uViewport.y,-p.z*.1,1.);
 vPosition=aPosition;vNormal=aNormal;vWorld=p;vFace=aFace;}`;
 const fragmentShader=`precision highp float;uniform mat3 uModel;uniform sampler2D uPictures;uniform float uPictureMode;uniform vec3 uInkColour;uniform vec3 uBodyColour;uniform float uColourPictures;
 float mark(vec2 p,float face){if(abs(p.x)>.69||abs(p.y)>.69)return 0.;vec2 q=(p/1.38+.5);return texture2D(uPictures,vec2((face-1.+q.x)/6.,1.-q.y)).a;}
 varying vec3 vPosition;varying vec3 vNormal;varying vec3 vWorld;varying float vFace;
 float disc(vec2 p,vec2 c){return length(p-c);}
 void main(){vec2 uv;vec3 tangent;vec3 bitangent;
 if(vFace<1.5){uv=vPosition.xy;tangent=vec3(1.,0.,0.);bitangent=vec3(0.,1.,0.);}
 else if(vFace<2.5){uv=vec2(vPosition.x,-vPosition.z);tangent=vec3(1.,0.,0.);bitangent=vec3(0.,0.,-1.);}
 else if(vFace<3.5){uv=vec2(-vPosition.z,vPosition.y);tangent=vec3(0.,0.,-1.);bitangent=vec3(0.,1.,0.);}
 else if(vFace<4.5){uv=vec2(vPosition.z,vPosition.y);tangent=vec3(0.,0.,1.);bitangent=vec3(0.,1.,0.);}
 else if(vFace<5.5){uv=vec2(vPosition.x,vPosition.z);tangent=vec3(1.,0.,0.);bitangent=vec3(0.,0.,1.);}
 else{uv=vec2(-vPosition.x,vPosition.y);tangent=vec3(-1.,0.,0.);bitangent=vec3(0.,1.,0.);}
 float d=10.;vec2 center=vec2(0.);float next;
 if(vFace<1.5||abs(vFace-3.)<.1||abs(vFace-5.)<.1){d=length(uv);}
 if(vFace>1.5){center=vec2(-.42,.42);next=disc(uv,center);if(next<d)d=next;else center=vec2(0.);
 vec2 c=vec2(.42,-.42);next=disc(uv,c);if(next<d){d=next;center=c;}}
 if(vFace>3.5){vec2 c=vec2(.42,.42);next=disc(uv,c);if(next<d){d=next;center=c;}
 c=vec2(-.42,-.42);next=disc(uv,c);if(next<d){d=next;center=c;}}
 if(vFace>5.5){vec2 c=vec2(-.42,0.);next=disc(uv,c);if(next<d){d=next;center=c;}
 c=vec2(.42,0.);next=disc(uv,c);if(next<d){d=next;center=c;}}
 float ink=(1.-smoothstep(.137,.15,d))*(1.-uPictureMode);vec3 objectN=normalize(vNormal);
 vec2 bowl=(uv-center)/.15;
 vec3 pipN=normalize(objectN-.28*(tangent*bowl.x+bitangent*bowl.y));
 vec3 n=normalize(uModel*mix(objectN,pipN,ink));
 vec3 light=normalize(vec3(-.48,.72,2.1));vec3 eye=normalize(vec3(0.,0.,8.4)-vWorld);
 float diffuse=max(0.,dot(n,light));float spec=pow(max(0.,dot(n,normalize(light+eye))),58.);
 // Echte dobbelsteenlook: grotendeels vlakke zijden, zachte highlight en geen harde bevelrand.
 vec3 white=uBodyColour*(.91+.09*diffuse)+vec3(.065)*spec;
 float rim=smoothstep(.102,.146,d);
 vec3 blue=mix(uInkColour,uInkColour*.58,rim*.42)*(.89+.11*diffuse);
 blue+=vec3(.018)*pow(max(0.,dot(n,normalize(light+eye))),24.);
 if(uPictureMode>.5){
  float face=floor(vFace+.5);ink=mark(uv,face);
  vec2 q=(uv/1.38+.5);blue=uColourPictures>.5?texture2D(uPictures,vec2((face-1.+q.x)/6.,1.-q.y)).rgb:uInkColour;
 }
 gl_FragColor=vec4(mix(white,blue,ink),1.);}`;
 const inkRgb=value=>{const s=String(value||'#174d76').replace('#','');const n=/^[0-9a-fA-F]{6}$/.test(s)?parseInt(s,16):0x174d76;return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];};
 function webgl(canvas,picturesSource=globalThis.PraatpadPictures,fill=.315,ink='#174d76',body='#fffefa'){
  // MSAA edge pixels are already premultiplied; multiplying again creates dark corner speckles.
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:true});if(!gl)return null;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,vertexShader),fs=shader(gl.FRAGMENT_SHADER,fragmentShader);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
  const mesh=geometry(),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
  for(const [name,size,offset]of [['aPosition',3,0],['aNormal',3,12],['aFace',1,24]]){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,size,gl.FLOAT,false,28,offset);}
  const m=gl.getUniformLocation(program,'uModel'),viewport=gl.getUniformLocation(program,'uViewport'),lift=gl.getUniformLocation(program,'uLift'),scale=gl.getUniformLocation(program,'uScale');
  const pictures=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,pictures);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const atlas=picturesSource?.atlas();if(atlas)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));
  gl.uniform1i(gl.getUniformLocation(program,'uPictures'),0);const pictureMode=gl.getUniformLocation(program,'uPictureMode'),inkColour=gl.getUniformLocation(program,'uInkColour'),inkValue=inkRgb(ink),bodyValue=inkRgb(body),bodyColour=gl.getUniformLocation(program,'uBodyColour'),colourPictures=gl.getUniformLocation(program,'uColourPictures');
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(0,0,0,0);
  return {kind:'webgl',destroy(){gl.getExtension('WEBGL_lose_context')?.loseContext();},draw(matrix,w,h,bounce,style='numbers',fullSize=false){gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(pictureMode,style==='verbs'?1:0);gl.uniform3f(inkColour,...inkValue);gl.uniform3f(bodyColour,...bodyValue);gl.uniform1f(colourPictures,picturesSource?.colour?1:0);gl.uniformMatrix3fv(m,false,matrix);gl.uniform2f(viewport,w,h);gl.uniform1f(lift,bounce);gl.uniform1f(scale,fit(matrix,w,h,bounce,fill,fullSize));gl.drawArrays(gl.TRIANGLES,0,mesh.length/7);}};
 }
 function software(canvas,picturesSource=globalThis.PraatpadPictures,fill=.315,ink='#174d76',body='#fffefa'){
  const ctx=canvas.getContext('2d'),mesh=geometry(36),light=norm([-.48,.72,2.1]);
  const atlas=picturesSource?.atlas(),stamps=[];
  if(atlas)for(let i=0;i<6;i++){const stamp=document.createElement('canvas');stamp.width=stamp.height=256;const c=stamp.getContext('2d');c.drawImage(atlas,i*256,0,256,256,0,0,256,256);if(!picturesSource.colour){c.globalCompositeOperation='source-in';c.fillStyle=ink;c.fillRect(0,0,256,256)}stamps.push(stamp);}
  function textureTriangle(image,source,dest){const [a,b,c]=source,[p,q,r]=dest;const det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);if(!det)return;
   const A=((q[0]-p[0])*(c[1]-a[1])-(r[0]-p[0])*(b[1]-a[1]))/det,B=((q[1]-p[1])*(c[1]-a[1])-(r[1]-p[1])*(b[1]-a[1]))/det;
   const C=((r[0]-p[0])*(b[0]-a[0])-(q[0]-p[0])*(c[0]-a[0]))/det,D=((r[1]-p[1])*(b[0]-a[0])-(q[1]-p[1])*(c[0]-a[0]))/det;
   ctx.save();ctx.beginPath();dest.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,p[0]-A*a[0]-C*a[1],p[1]-B*a[0]-D*a[1]);ctx.drawImage(image,0,0);ctx.restore();
  }
  return {kind:'canvas',draw(matrix,w,h,bounce,style='numbers',fullSize=false){
   ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);ctx.clearRect(0,0,w,h);
   const scale=fit(matrix,w,h,bounce,fill,fullSize),project=p=>[w/2+p[0]*CAMERA/(CAMERA-p[2])*scale,h/2-p[1]*CAMERA/(CAMERA-p[2])*scale-bounce];
   const triangles=[];
   for(let i=0;i<mesh.length;i+=21){const points=[0,7,14].map(k=>vector(matrix,Array.from(mesh.slice(i+k,i+k+3))));const n=norm([0,1,2].map(k=>(mesh[i+3+k]+mesh[i+10+k]+mesh[i+17+k])/3));const normal=vector(matrix,n);if(normal[2]<-.18)continue;
    triangles.push({points,z:points.reduce((s,p)=>s+p[2],0)/3,shade:.73+.27*Math.max(0,dot(normal,light))});}
   // An opaque silhouette also closes subpixel seams on software-rendered edges.
   const outline=triangles.flatMap(t=>t.points.map(project)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
   const hull=points=>{const side=[];for(const p of points){while(side.length>1&&cross(side.at(-2),side.at(-1),p)<=0)side.pop();side.push(p);}return side;};
   const lower=hull(outline),upper=hull([...outline].reverse());lower.pop();upper.pop();const contour=lower.concat(upper);ctx.beginPath();contour.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=body;ctx.strokeStyle=body;ctx.lineWidth=1.4;ctx.lineJoin='round';ctx.fill();ctx.stroke();
   triangles.sort((a,b)=>a.z-b.z);for(const t of triangles){const p=t.points.map(project);ctx.beginPath();ctx.moveTo(...p[0]);ctx.lineTo(...p[1]);ctx.lineTo(...p[2]);ctx.closePath();const shade=.91+.09*((t.shade-.73)/.27);ctx.fillStyle=`rgb(${inkRgb(body).map(c=>Math.round(c*255*shade)).join(',')})`;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.14;ctx.fill();ctx.stroke();}
   for(const f of faces){const n=vector(matrix,f.n);if(n[2]<=1/5.8)continue;
    if(style==='verbs'&&stamps.length){
     const point=([x,y])=>project(vector(matrix,f.n.map((v,k)=>v+((x/256-.5)*1.38)*f.u[k]+((.5-y/256)*1.38)*f.v[k])));
     for(let y=0;y<4;y++)for(let x=0;x<4;x++){const a=[x*64,y*64],b=[(x+1)*64,y*64],c=[(x+1)*64,(y+1)*64],d=[x*64,(y+1)*64];textureTriangle(stamps[f.value-1],[a,b,c],[a,b,c].map(point));textureTriangle(stamps[f.value-1],[a,c,d],[a,c,d].map(point));}continue;
    }
    for(const [u,v]of dots[f.value]){const center=f.n.map((x,k)=>1.003*x+u*f.u[k]+v*f.v[k]);const screen=project(vector(matrix,center));ctx.beginPath();
     for(let i=0;i<=32;i++){const a=i/32*Math.PI*2,p=project(vector(matrix,center.map((x,k)=>x+.146*Math.cos(a)*f.u[k]+.146*Math.sin(a)*f.v[k])));if(!i)ctx.moveTo(...p);else ctx.lineTo(...p);}ctx.closePath();
     ctx.fillStyle=ink;ctx.fill();
    }
   }
  }};
 }
 // Shared triangle vertices need measuring only once; avoid per-frame arrays for nine dice.
 const bounds=(()=>{const mesh=geometry(48),seen=new Set(),out=[];for(let i=0;i<mesh.length;i+=7){const key=mesh[i]+','+mesh[i+1]+','+mesh[i+2];if(!seen.has(key)){seen.add(key);out.push(mesh[i],mesh[i+1],mesh[i+2]);}}return new Float32Array(out);})();
 function fit(matrix,w,h,bounce,fill=.315,fullSize=false){let x=0,y=0;for(let i=0;i<bounds.length;i+=3){const a=bounds[i],b=bounds[i+1],c=bounds[i+2],px=matrix[0]*a+matrix[3]*b+matrix[6]*c,py=matrix[1]*a+matrix[4]*b+matrix[7]*c,pz=matrix[2]*a+matrix[5]*b+matrix[8]*c,q=CAMERA/(CAMERA-pz);x=Math.max(x,Math.abs(px*q));y=Math.max(y,Math.abs(py*q));}if(fullSize)return Math.max(1,(Math.min(w,h)-6)/(2*Math.max(x,y)));return Math.max(1,Math.min(Math.min(w,h)*fill,(w/2-7)/x,(h/2-7-Math.abs(bounce))/y));}
 function create(original,{pictures=globalThis.PraatpadPictures,fill=.315,front=false,ink='#174d76',body='#fffefa',onProgress=()=>{}}={}){
  const orientation=front?rotation(0,0):view;
  fill=Number.isFinite(fill)?Math.max(.2,Math.min(.43,fill)):.315;
  const host=original.parentElement;
  let canvas=original,renderer,angles=[0,0,0],raf=0,animation=null,rollKey=null,value=1,style='numbers';
  function fallback(){const next=canvas.cloneNode(false);canvas.replaceWith(next);canvas=next;renderer=software(canvas,pictures,fill,ink,body);canvas.dataset.renderer=renderer.kind;}
  try{renderer=webgl(canvas,pictures,fill,ink,body);}catch{renderer=null;}if(!renderer)fallback();else canvas.dataset.renderer=renderer.kind;
  // Measure before CSS transforms and supersample: small idle dice must stay crisp too.
  function draw(bounce=0){const r={width:canvas.clientWidth,height:canvas.clientHeight};if(!r.width||!r.height)return;const ratio=2;const w=Math.round(r.width*ratio),h=Math.round(r.height*ratio);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}renderer.draw(model(angles,orientation),r.width,r.height,bounce,style,front);}
  function stop(){cancelAnimationFrame(raf);raf=0;animation=null;canvas.dataset.rolling='false';}
  function show(next,{animate=false,key=0,duration=1350,style:nextStyle=style,spin=[2,3,1],lift=4,delay=0}={}){
   style=nextStyle==='verbs'&&pictures?'verbs':'numbers';canvas.dataset.style=style;
   next=ends[next]?next:1;canvas.dataset.value=String(next);
   if(animate&&rollKey===key)return;
   if(!animate&&!animation&&value===next){draw();onProgress(1);return;}
   stop();value=next;canvas.dataset.value=String(value);
   if(!animate){angles=[...ends[value]];draw();onProgress(1);return;}
   rollKey=key;const from=[...angles],target=ends[value].map((a,i)=>a+360*(Number.isInteger(spin[i])?spin[i]:2));
   draw();onProgress(0);animation={from,target,start:performance.now()+Math.max(0,delay),duration:Math.max(1,duration)};canvas.dataset.rolling='true';
   function frame(now){if(!animation)return;const t=Math.max(0,Math.min(1,(now-animation.start)/animation.duration)),u=front?Math.min(1,t/.82):t,e=front?u*u*u*(u*(u*6-15)+10):1-Math.pow(1-u,3);angles=from.map((a,i)=>a+(target[i]-a)*e);draw(front?0:Math.sin(t*Math.PI)*lift);onProgress(t);
    if(t<1)raf=requestAnimationFrame(frame);else{stop();angles=[...ends[value]];draw();}}
   raf=requestAnimationFrame(frame);
  }
  const observer=new ResizeObserver(()=>draw());observer.observe(host);
  const contextLost=event=>{event.preventDefault();stop();fallback();angles=[...ends[value]];draw();onProgress(1);};
  canvas.addEventListener('webglcontextlost',contextLost);
  window.addEventListener('pagehide',stop);draw();return {show,destroy(){stop();observer.disconnect();canvas.removeEventListener('webglcontextlost',contextLost);window.removeEventListener('pagehide',stop);renderer.destroy?.();}};
 }
 return {create,geometry,model,faces,ends};
})();
