// The same check protects the repository source and the separate offline app.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const native=fs.existsSync(path.join(root,'data/opdrachtenbank.json'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,native?'banken-manifest.json':'Documentatie/Banken-v2/manifest.json')));
const files=native?['data/opdrachtenbank.json','data/snelvragen.json']:['Lessen/opdrachtenmatrix.json','Lessen/directe-vragen.json'];
const banks=files.map((file,i)=>{
 const raw=fs.readFileSync(path.join(root,file));
 assert.equal(createHash('sha256').update(raw).digest('hex'),manifest.banks[i].sha256,'Verouderde of gewijzigde bank: '+file+'. Controleer de inhoud en synchroniseer bewust; overschrijf de borging niet automatisch.');
 const bank=JSON.parse(raw);assert.equal(bank.cards.length,i?240:960);assert.equal(new Set(bank.cards.map(c=>c.id)).size,bank.cards.length);
 for(const route of bank.routes){const cards=bank.cards.filter(c=>c.routeId===route.id);assert.equal(cards.length,i?60:240);for(const shape of bank.shapes)assert.equal(cards.filter(c=>c.shape===shape.id).length,i?15:60);}
 return bank;
});
if(native){
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data-bundle.js'),'utf8'),ctx);
 assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.DIGIBORD_DATA.taskBank)),banks[0],'Losse gespreksbank en runtime verschillen');
 assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.DIGIBORD_DATA.directBank)),banks[1],'Losse Snelvraagbank en runtime verschillen');
}else{
 for(const [i,name]of ['opdrachtenmatrix','directe-vragen'].entries()){
  const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'Lessen',name+'-data.js'),'utf8'),ctx);
  assert.deepEqual(JSON.parse(JSON.stringify(ctx[i?'DigiBoardDirectContent':'DigiBoardMatrixContent'])),banks[i]);
 }
}
console.log('PASS: vier vernieuwde gespreksroutes (960) en aparte Snelvraagbank (240); bronhashes, IDs, verdeling en browserdata gelijk.');
