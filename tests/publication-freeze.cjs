const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const {publicationFreeze,assertPublicationOpen,verifyApprovedFiles,hash}=require('../scripts/publication-contract.cjs');
const repo=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'digibord-freeze-'));
try{
 const freeze=publicationFreeze(repo),manifest=JSON.parse(fs.readFileSync(path.join(repo,freeze.manifest),'utf8'));
 assert.equal(cp.execFileSync('git',['rev-parse',freeze.approvedTag+'^{commit}'],{cwd:repo,encoding:'utf8'}).trim(),freeze.approvedCommit,'The original approved tag stays fixed');
 cp.execFileSync('git',['merge-base','--is-ancestor',freeze.approvedCommit,'HEAD'],{cwd:repo});
 assert.equal(manifest.commit,freeze.approvedCommit);
 assertPublicationOpen(repo);
 assert.throws(()=>assertPublicationOpen(temp));
 fs.mkdirSync(path.join(temp,'publication'));
 fs.copyFileSync(path.join(repo,freeze.manifest),path.join(temp,freeze.manifest));
 const write=value=>fs.writeFileSync(path.join(temp,'publication-freeze.json'),JSON.stringify(value));
 write({...freeze,frozen:true});assert.throws(()=>assertPublicationOpen(temp),/Publication frozen/);
 process.env.DIGIBORD_INITIAL_RECOVERY='1';assert.throws(()=>assertPublicationOpen(temp),/Publication frozen/);delete process.env.DIGIBORD_INITIAL_RECOVERY;
 write({...freeze,frozen:'false'});assert.throws(()=>assertPublicationOpen(temp),/explicit/);
 write(freeze);fs.appendFileSync(path.join(temp,freeze.manifest),' ');assert.throws(()=>publicationFreeze(temp),/fingerprint changed/);
 fs.copyFileSync(path.join(repo,freeze.manifest),path.join(temp,freeze.manifest));
 write({...freeze,approvedCommit:'0'.repeat(40)});assert.throws(()=>publicationFreeze(temp),/commit differs/);
 write({...freeze,releaseDecision:null});assert.throws(()=>assertPublicationOpen(temp),/scoped release/);
 write(freeze);assert.throws(()=>assertPublicationOpen(temp),/ENOENT/);
 fs.writeFileSync(path.join(temp,'unchanged.txt'),'original');fs.writeFileSync(path.join(temp,'renamed.txt'),'Actief');
 const base={'unchanged.txt':hash('original'),'renamed.txt':hash('DigiBord')},allowed={'renamed.txt':hash('Actief')};
 verifyApprovedFiles(temp,base,allowed);
 fs.writeFileSync(path.join(temp,'unchanged.txt'),'unexpected');assert.throws(()=>verifyApprovedFiles(temp,base,allowed),/Outside the approved/);
 fs.writeFileSync(path.join(temp,'unchanged.txt'),'original');fs.writeFileSync(path.join(temp,'renamed.txt'),'unreviewed');assert.throws(()=>verifyApprovedFiles(temp,base,allowed),/Outside the approved/);
 assert.throws(()=>verifyApprovedFiles(temp,base,{}),/fingerprints/);assert.throws(()=>verifyApprovedFiles(temp,{}, {'../unsafe':hash('x')}),/Unsafe/);
 console.log('PASS: original tag/manifest, frozen and malformed locks, removed recovery bypass, scoped owner decision, exact approved changes and rejection of unapproved changes.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
