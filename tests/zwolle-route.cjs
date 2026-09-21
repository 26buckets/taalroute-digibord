const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const route=JSON.parse(fs.readFileSync(path.join(root,'data/zwolle-route.json')));
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const frames=[];let reduced=false,clock=0,connected=true;
const mount={get isConnected(){return connected;}};
const ctx={settingsState:()=>({reducedMotion:reduced}),matchMedia:()=>({matches:false}),
 $:s=>s==='#boardMap'?mount:{classList:{contains:()=>true}},
 renderBoardPawns:(_b,_r,point)=>frames.push(point),setTaxiPoint:()=>{throw Error('Walking must not animate the taxi');},
 requestAnimationFrame:cb=>queueMicrotask(()=>cb(clock+=100))};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('function boardWalkPoints('),source.indexOf('async function rollBoard(')),ctx);
const plain=value=>JSON.parse(JSON.stringify(value));
(async()=>{
 const bundle={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data-bundle.js'),'utf8'),bundle);
 assert.deepEqual(plain(bundle.window.DIGIBORD_DATA.routes.zwolle),route,'offline and hosted route match');
 assert.deepEqual(route.nodes.map(n=>n.id),Array.from({length:42},(_,i)=>i),'saved positions keep their IDs');
 assert.equal(route.taskNodeCount,40);assert.equal(route.finishPosition,41);
 const all=ctx.boardWalkPoints(route,0,41),tunnels=all.filter(p=>p[2]===true);
 assert.equal(tunnels.length,1,'one underground connection between two portals');
 for(const [x,y] of all)assert.ok(x>=0&&x<=route.sourceWidth&&y>=0&&y<=route.sourceHeight,'path lies in image');
 for(const [x,y] of [[1176,499],[1176,431],[365,112],[466,256],[1395,691],[1450,700]])assert.ok(all.some(p=>p[0]===x&&p[1]===y),'route visits reviewed gate, hill and tunnel/bridge landmark '+x+','+y);
 for(let i=1;i<all.length;i++)if(!all[i][2])assert.ok(Math.hypot(all[i][0]-all[i-1][0],all[i][1]-all[i-1][1])<80,'visible walking follows the bend waypoints');
 const tunnelNode=route.nodes.findIndex(n=>n.pathToNext?.some(p=>p[2]===true));
 const points=ctx.boardWalkPoints(route,tunnelNode,tunnelNode+1);
 assert.equal(await ctx.animateBoardPath('zwolle',route,points),true);
 assert.ok(frames.some(p=>p.underground),'pawn is hidden inside tunnel');
 assert.equal(frames.at(-1).underground,false,'pawn emerges before next task');
 assert.deepEqual([frames.at(-1).x,frames.at(-1).y],[route.nodes[tunnelNode+1].x,route.nodes[tunnelNode+1].y]);
 // The underground crossing must never be rendered over buildings or water.
 const index=points.findIndex(p=>p[2]===true),entry=points[index-1],exit=points[index];
 assert.ok(frames.filter(p=>p.underground).every(p=>p.x>=Math.min(entry[0],exit[0])&&p.x<=Math.max(entry[0],exit[0])));
 assert.ok(frames.filter(p=>!p.underground).every(p=>p.x<500||p.x>1350),'no visible flight across the city between portals');
 frames.length=0;reduced=true;
 assert.equal(await ctx.animateBoardPath('zwolle',route,points),true);
 assert.equal(frames.length,1);assert.ok(!frames[0].underground,'reduced motion lands visibly at destination');
 reduced=false;connected=false;
 assert.equal(await ctx.animateBoardPath('zwolle',route,points),false,'navigation cancels movement');
 const rotterdam=JSON.parse(fs.readFileSync(path.join(root,'data/rotterdam-route.json')));
 assert.deepEqual(plain(ctx.boardWalkPoints(rotterdam,3,9)),rotterdam.nodes.slice(3,10).map(n=>[n.x,n.y]),'Rotterdam walking unchanged');
 console.log('PASS: Zwolle route parity, saved positions, tunnel hiding/emergence, reduced motion, cancellation and Rotterdam fallback.');
})().catch(e=>{console.error(e);process.exitCode=1;});
