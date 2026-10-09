const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),base=process.env.LIVE_URL||'https://digibord.taalroute.nl/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const files=fs.readdirSync(dist,{recursive:true}).filter(f=>/\.(m?js|css|html|json)$/.test(f)&&fs.statSync(path.join(dist,f)).isFile()),result=[];
 // Bound network concurrency, and compare source -> dist -> public bytes.
 let next=0;await Promise.all(Array.from({length:4},async()=>{while(next<files.length){const file=files[next++],local=fs.readFileSync(path.join(dist,file));assert.equal(hash(local),hash(fs.readFileSync(path.join(root,file))),file+' source/dist');const response=await fetch(new URL(file==='index.html'?'':file,base));assert.ok(response.ok,file+' HTTP '+response.status);const bytes=Buffer.from(await response.arrayBuffer());assert.equal(hash(bytes),hash(local),file+' live/dist');result.push({file,sha256:hash(local),bytes:local.length});}}));
 const report={status:'PASS',url:base,files:result.sort((a,b)=>a.file.localeCompare(b.file))};fs.writeFileSync(path.join(root,'test-results/p0-live-parity.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS source/dist/live byte parity:',files.length,'runtime files');
})().catch(e=>{console.error(e);process.exitCode=1});
