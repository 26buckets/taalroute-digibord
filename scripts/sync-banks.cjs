// Explicit, offline-only synchronization; never replaces UI or other game data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),target=process.argv[2];
assert.ok(target,'Gebruik: node scripts/sync-banks.cjs /pad/naar/lokale-app');
const dest=path.resolve(target);assert.notEqual(dest,root);
const check=path.join(__dirname,'check-banks.cjs');
execFileSync(process.execPath,[check,root],{stdio:'inherit'});
assert.ok(fs.existsSync(path.join(dest,'banken-manifest.json')),'Eerste integratie moet bewust worden vergeleken en vastgelegd. Geen onbekende lokale bank overschrijven.');
execFileSync(process.execPath,[check,dest],{stdio:'inherit'});
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dest,'data-bundle.js'),'utf8'),ctx);
const data=ctx.window.DIGIBORD_DATA;
const files=[['Lessen/opdrachtenmatrix.json','data/opdrachtenbank.json','taskBank'],['Lessen/directe-vragen.json','data/snelvragen.json','directBank']];
const backup=path.join(dest,'bank-backups',new Date().toISOString().replace(/[:.]/g,'-'));
fs.mkdirSync(backup,{recursive:true});
for(const file of ['banken-manifest.json','data-bundle.js',...files.map(x=>x[1])]){const to=path.join(backup,file);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(dest,file),to);}
for(const [source,file,key]of files){const raw=fs.readFileSync(path.join(root,source));data[key]=JSON.parse(raw);fs.writeFileSync(path.join(dest,file),raw);}
fs.writeFileSync(path.join(dest,'data-bundle.js'),'window.DIGIBORD_DATA = '+JSON.stringify(data)+';\n');
fs.copyFileSync(path.join(root,'Documentatie/Banken-v2/manifest.json'),path.join(dest,'banken-manifest.json'));
execFileSync(process.execPath,[check,dest],{stdio:'inherit'});
console.log('Banken gesynchroniseerd; UI en overige spelgegevens behouden. Bouw de lokale app opnieuw voor dist/ en ZIP.');
