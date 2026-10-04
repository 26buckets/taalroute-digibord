const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'tests/fixtures/p0'),manifest=require('../tests/fixtures/p0/manifest.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const stable=v=>JSON.stringify(v&&typeof v==='object'?Array.isArray(v)?v.map(x=>JSON.parse(stable(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(stable(v[k]))])):v);
const families=manifest.families.map(f=>require(path.join(dir,f+'.json'))),expected=families.flatMap(f=>f.approved),historical=families.flatMap(f=>f.historical);
function compare(actual){
 const report={added:[],changed:[],moved:[],hidden:[],mediaLost:[],removed:[],approvedDecisions:families.flatMap(f=>f.decisions).filter(d=>d.decision!=='UNCHANGED'),failures:[]};
 const seen=new Set(),byId=new Map(actual.map(c=>[c.id,c]));
 for(const c of actual){if(seen.has(c.id))report.failures.push('duplicate/overwrite '+c.id);seen.add(c.id);if(!expected.some(e=>e.id===c.id))report.added.push(c.id);}
 for(const e of expected){const a=byId.get(e.id);if(!a){report.removed.push(e.id);continue;}
  if(a.family!==e.family||stable([a.free,a.guided])!==stable([e.free,e.guided]))report.moved.push({id:e.id,expected:[e.family,e.free,e.guided],actual:[a.family,a.free,a.guided]});
  if(e.guided.length&&!a.guided.length)report.hidden.push(e.id);
  const fields=Object.keys({...e.record,...a.record}).filter(k=>stable(e.record[k]??null)!==stable(a.record[k]??null));
  if(fields.length)report.changed.push({id:e.id,fields});
  const refs=v=>{const out=[];function walk(x){if(typeof x==='string'&&x.startsWith('assets/'))out.push(x);else if(x&&typeof x==='object')Object.values(x).forEach(walk)}walk(v);return out};
  const media=refs(a.record);for(const ref of refs(e.record))if(!media.includes(ref))report.mediaLost.push({id:e.id,ref});
 }
 for(const kind of ['added','changed','moved','hidden','mediaLost','removed'])if(report[kind].length)report.failures.push(kind+': '+report[kind].length);
 if(actual.length!==manifest.activeCount)report.failures.push('Active count '+actual.length+' != '+manifest.activeCount);
 report.status=report.failures.length?'FAIL':'PASS';return report;
}
function verifyFiles(target){
 for(const [file,digest]of Object.entries(manifest.hashes))assert.equal(hash(fs.readFileSync(path.join(dir,file))),digest,'Frozen baseline changed: '+file);
 assert.equal(historical.length,570);assert.equal(new Set(historical.map(c=>c.id)).size,570);
 assert.equal(expected.length,530);assert.equal(new Set(expected.map(c=>c.id)).size,530);
 const bank=JSON.parse(fs.readFileSync(path.join(target,'data/card-games.json'))),cards=bank.families.flatMap(f=>f.cards);
 assert.equal(new Set(cards.map(c=>c.id)).size,cards.length,'duplicate source ID');
 const source=require('../tests/fixtures/e1-release-source.json');
 assert.equal(new Set(source.cards.cards.map(c=>c.id)).size,source.cards.cards.length,'duplicate canonical ID');
 for(const c of historical.filter(c=>c.family==='story'))assert.equal(stable(cards.find(x=>x.id===c.id)),stable(c.record),'Blocked story must remain preserved: '+c.id);
 for(const [ref,digest]of Object.entries(require('../tests/fixtures/p0/media.json')))assert.equal(hash(fs.readFileSync(path.join(target,ref))),digest,'Missing/changed media '+ref);
 const idioms=source.cards.cards.filter(c=>c.appFamily==='idioms');assert.equal(idioms.length,40);
 for(const c of idioms){const e=expected.find(x=>x.id===c.id);assert.ok(e);for(const [k,v]of Object.entries(c))if(!['route','targetLevel','version','e1FinalStatus'].includes(k))assert.equal(stable(e.record[k]),stable(v),c.id+' canonical '+k);}
}
async function run(target=root,url){
 const {chromium}=require('playwright'),browser=await chromium.launch({channel:'chrome',headless:true});let report;
 try{verifyFiles(target);const page=await browser.newPage();await page.goto(url||'file://'+path.join(target,'index.html'));await page.waitForFunction(()=>window.ContentRuntime&&window.E1Release);const actual=await page.evaluate(require('./p0-card-snapshot.cjs'));report=compare(actual);
 report.historicalCount=570;report.activeCount=actual.length;report.retainedBlockedIds=historical.filter(c=>c.family==='story').map(c=>c.id);report.target=url||target;
 report.familyCounts=manifest.families.map(f=>({family:f,historical:historical.filter(c=>c.family===f).length,active:actual.filter(c=>c.family===f).length,routeMatrix:Object.fromEntries(['free','guided'].map(mode=>[mode,Object.fromEntries(['ALPHA_AC','A0_A1','A1_A2','A2_B1','B1_B2','B2_C1'].map(route=>[route,actual.filter(c=>c.family===f&&c[mode].includes(route)).map(c=>c.id)]))]))}));
 if(url){report.liveFiles=[];for(const ref of Object.keys(require('../tests/fixtures/p0/media.json'))){const res=await page.request.get(new URL(ref,url).href);assert.equal(res.status(),200,ref);assert.equal(hash(await res.body()),hash(fs.readFileSync(path.join(target,ref))),ref+' live bytes');report.liveFiles.push(ref);}}
 }catch(e){report={...(report||{}),status:'FAIL',error:e.stack};}finally{await browser.close()}
 const out=process.env.P0_REPORT||path.join(root,'test-results/p0-shrink-report.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 console.log('P0',report.status,'570 historical /',report.activeCount??'?','active / 40 explicitly blocked. Report:',out);
 assert.equal(report.status,'PASS',report.error||report.failures?.join('; '));return report;
}
module.exports={compare,verifyFiles,run,stable,expected,historical};
if(require.main===module)run(process.argv.includes('--dist')?path.join(root,'dist'):root,process.env.LIVE_URL).catch(e=>{console.error(e.message);process.exitCode=1});
