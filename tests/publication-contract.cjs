const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {verify,hash,required}=require('../scripts/publication-contract.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'digibord-publication-'));
const put=(file,text)=>{fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),text);};
const html='<title>Taalroute DigiBord V01.25</title>'+['play','practice','lessons','mycollection'].map(r=>'data-main="'+r+'"').join(' ')+required.map(f=>'<script src="'+f+'"></script>').join('');
try{
 put('index.html',html);for(const file of ['settings/index.html','taalroute-menu/menu.css','taalroute-menu/menu.js',...required])put(file,'fixture');
 const recordings=Array.from({length:480},(_,i)=>({src:'audio/'+i+'.mp3',sha256:hash('audio'),deliveryBrand:'Taalroute'}));
 for(const r of recordings)put(r.src,'audio');
 const manifest=()=>put('data/tongbrekers-opnamen.json',JSON.stringify({recordings}));manifest();verify(root);
 put('index.html',html.replace('V01.25','V01.24'));assert.throws(()=>verify(root),/V01.25/);
 put('index.html',html.replace('data-main="practice"',''));assert.throws(()=>verify(root),/navigation/);
 put('index.html',html.replace('src="lesson-storage.js"',''));assert.throws(()=>verify(root),/module/);
 put('index.html',html);put(recordings[0].src,'wrong');assert.throws(()=>verify(root),/Audio changed/);
 put(recordings[0].src,'audio');recordings[0].deliveryBrand='';manifest();assert.throws(()=>verify(root),/branding/);
 recordings.pop();manifest();assert.throws(()=>verify(root),/recordings/);
 console.log('PASS: old app, missing navigation/storage, altered audio, missing branding and incomplete recordings are rejected.');
}finally{fs.rmSync(root,{recursive:true,force:true});}
