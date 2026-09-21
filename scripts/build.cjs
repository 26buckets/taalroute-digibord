const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
require('node:child_process').execFileSync(process.execPath,[path.join(__dirname,'check-banks.cjs'),root],{stdio:'inherit'});
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist);
// Runtime only: historical sources, reports, tests and the archived app are not published.
for(const name of ['assets','data','settings','banken-manifest.json','_redirects','_headers',...fs.readdirSync(root).filter(n=>/\.(html|css|js)$/.test(n))]){
 fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true,filter:file=>!['kaartenkast_160.json','kaartenkast_180.json','.DS_Store'].includes(path.basename(file))});
}
console.log('PASS: clean V01.24 static build in dist/.');
