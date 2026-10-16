const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const {publicationFreeze,assertPublicationOpen,hash}=require('../scripts/publication-contract.cjs');
const repo=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'digibord-freeze-'));
try{
 const freeze=publicationFreeze(repo),manifest=JSON.parse(fs.readFileSync(path.join(repo,freeze.manifest),'utf8'));
 assert.equal(freeze.frozen,true,'The approved release must remain frozen');
 for(const [file,digest] of Object.entries(manifest.assets))assert.equal(hash(fs.readFileSync(path.join(repo,file))),digest,'Frozen application changed: '+file);
 assert.throws(()=>assertPublicationOpen(repo),/Publication frozen/);
 const blocked=cp.spawnSync(process.execPath,[path.join(repo,'scripts/check-publication.cjs'),'--deploy'],{cwd:repo,env:{...process.env,DIGIBORD_INITIAL_RECOVERY:'1'},encoding:'utf8'});
 assert.equal(blocked.status,1);assert.match(blocked.stderr,/Publication frozen/);
 assert.throws(()=>assertPublicationOpen(temp));
 fs.mkdirSync(path.join(temp,'publication'));
 fs.copyFileSync(path.join(repo,freeze.manifest),path.join(temp,freeze.manifest));
 const write=value=>fs.writeFileSync(path.join(temp,'publication-freeze.json'),JSON.stringify(value));
 write({...freeze,frozen:'false'});assert.throws(()=>assertPublicationOpen(temp),/explicit/);
 write(freeze);fs.appendFileSync(path.join(temp,freeze.manifest),' ');assert.throws(()=>publicationFreeze(temp),/fingerprint changed/);
 fs.copyFileSync(path.join(repo,freeze.manifest),path.join(temp,freeze.manifest));
 write({...freeze,approvedCommit:'0'.repeat(40)});assert.throws(()=>publicationFreeze(temp),/commit differs/);
 write({...freeze,frozen:false});assertPublicationOpen(temp);
 console.log('PASS: frozen release bytes, blocked deployment including old recovery flag, missing/malformed lock, modified manifest and mismatched commit.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
