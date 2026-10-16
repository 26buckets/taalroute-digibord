const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {verify,baseline,hash,assertPublicationOpen}=require('./publication-contract.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
function ancestor(parent,head){try{git('merge-base','--is-ancestor',parent,head);}catch{throw new Error('Publication blocked: source does not contain published commit '+parent);}}
function builtAssets(){
 verify(dist);
 return Object.fromEntries(fs.readdirSync(dist,{recursive:true}).filter(file=>file!=='release.json'&&fs.statSync(path.join(dist,file)).isFile()).sort().map(file=>{
  const digest=hash(fs.readFileSync(path.join(dist,file)));
  assert.equal(digest,hash(fs.readFileSync(path.join(root,file))),'Build differs from source; run npm run build: '+file);
  return [file,digest];
 }));
}
function stamp(){
 const assets=builtAssets(),commit=git('rev-parse','HEAD');
 fs.writeFileSync(path.join(dist,'release.json'),JSON.stringify({schema:1,version:'1.25.0',commit,baseline,assets},null,2)+'\n');
 console.log('PASS: V01.25 publication contract and release fingerprint.');
}
function remote(url){return cp.execFileSync('curl',['--fail','--silent','--show-error','--max-time','30','-H','Cache-Control: no-cache',url],{maxBuffer:2*1024*1024});}
function deployCheck(){
 assertPublicationOpen(root);
 const assets=builtAssets(),release=JSON.parse(fs.readFileSync(path.join(dist,'release.json'))),head=git('rev-parse','HEAD');
 assert.deepEqual(release.assets,assets,'Build changed after its release fingerprint');assert.equal(release.commit,head,'Build belongs to another commit');
 assert.equal(git('status','--porcelain','--untracked-files=normal'),'','Commit all source changes before publishing');
 git('fetch','origin','main');assert.equal(git('rev-parse','origin/main'),head,'Publish exactly the current canonical main branch');ancestor(baseline,head);
 const current=JSON.parse(remote('https://digibord.taalroute.nl/release.json').toString());
 assert.equal(current.schema,1,'Unknown production release contract');assert.match(current.commit,/^[a-f0-9]{40}$/);ancestor(current.commit,head);
 console.log('PASS: canonical main, clean source, approved baseline and forward-only production ancestry.');
}
if(require.main===module){try{if(process.argv.includes('--deploy'))deployCheck();else stamp();}catch(e){console.error(e.message);process.exitCode=1;}}
