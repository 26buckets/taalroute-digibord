const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist');
for(const name of ['Praatpad.html','digiboard.js','digiboard.css','Lessen','Actiewoorden','Beeldbibliotheek','Woordspel','Kaarten','tests','node_modules','data/kaartenkast_160.json','data/kaartenkast_180.json'])assert.ok(!fs.existsSync(path.join(root,name)),'Legacy/development file in deployment: '+name);
for(const page of ['index.html','settings/index.html'])for(const [,url] of fs.readFileSync(path.join(root,page),'utf8').matchAll(/(?:src|href)="([^"#]+)"/g)){
 if(/^(https?:|data:)/.test(url))continue;
 assert.ok(fs.existsSync(path.resolve(root,path.dirname(page),url.split('?')[0])),'Missing asset '+page+': '+url);
}
for(const file of fs.readdirSync(root,{recursive:true})){const p=path.join(root,file);if(fs.statSync(p).isFile())assert.ok(fs.statSync(p).size<=25*1024*1024,'Cloudflare asset exceeds 25 MiB: '+file)}
console.log('PASS: no legacy app or historical banks deployed; entry assets exist; Cloudflare file sizes valid.');
