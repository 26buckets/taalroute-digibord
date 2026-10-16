const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const baseline='f86075c8c42d62e759ab5e8c046123948e2249f5';
const required=['app.js','content-runtime.js','content-ui.js','content-overview.js','content-lessons.js','lesson-storage.js','storage-migration.js','release-policy.js','data/tongbrekers-opnamen.js'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function publicationFreeze(root){
 const freeze=JSON.parse(fs.readFileSync(path.join(root,'publication-freeze.json'),'utf8'));
 assert.equal(freeze.schema,1,'Unknown publication freeze format');
 assert.equal(typeof freeze.frozen,'boolean','Publication freeze must be explicit');
 assert.equal(freeze.manifest,'publication/frozen-v01.25-release.json','Unknown frozen release manifest');
 const bytes=fs.readFileSync(path.join(root,freeze.manifest));
 assert.equal(hash(bytes),freeze.manifestSha256,'Frozen release fingerprint changed');
 assert.equal(JSON.parse(bytes).commit,freeze.approvedCommit,'Frozen release commit differs');
 return freeze;
}
function assertPublicationOpen(root){
 const freeze=publicationFreeze(root);
 assert.equal(freeze.frozen,false,'Publication frozen by Nico: V01.25 must remain online. A new explicit publication decision is required; do not bypass this guard.');
}
function verify(root){
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(html,/<title>Taalroute DigiBord V01\.25<\/title>/,'Publication must retain the approved V01.25 application');
 for(const route of ['play','practice','lessons','mycollection'])assert.ok(html.includes('data-main="'+route+'"'),'Missing published navigation: '+route);
 for(const file of required){assert.ok(html.includes('src="'+file),'Missing loaded module: '+file);assert.ok(fs.statSync(path.join(root,file)).size>0,'Empty module: '+file);}
 const recordings=JSON.parse(fs.readFileSync(path.join(root,'data/tongbrekers-opnamen.json'))).recordings;
 assert.equal(recordings.length,480,'Keep both approved recordings for all 240 tongue twisters');
 for(const r of recordings){
  const bytes=fs.readFileSync(path.join(root,r.src));
  assert.equal(hash(bytes),r.sha256,'Audio changed after verification: '+r.src);
  assert.equal(r.deliveryBrand,'Taalroute','Audio branding has not been verified: '+r.src);
 }
 return Object.fromEntries(['index.html','settings/index.html','taalroute-menu/menu.css','taalroute-menu/menu.js','data/tongbrekers-opnamen.json',...required].map(file=>[file,hash(fs.readFileSync(path.join(root,file)))]));
}
module.exports={verify,baseline,hash,required,publicationFreeze,assertPublicationOpen};
