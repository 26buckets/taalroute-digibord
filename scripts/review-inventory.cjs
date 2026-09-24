// Snapshot of existing content. This registers the same banks as the app; it does not approve them.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const context={console,structuredClone};context.window=context;vm.createContext(context);
const core=new Set(['data-bundle.js','words-content.js','game-engine-registry.js','interaction-renderer-registry.js','match-pair-contract.js','content-runtime.js','content-bank-adapters.js','content-guidance.js']);
const scripts=[...read('index.html').matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]);
for(const file of scripts)if(core.has(file)||file.startsWith('data/')&&!file.includes('tongbrekers-migration'))vm.runInContext(read(file),context,{filename:file});
const ui=read('content-ui.js');vm.runInContext(ui.slice(0,ui.indexOf(' let externalSpec='))+'})(globalThis);',context,{filename:'content-ui-registration'});
const shared=JSON.parse(JSON.stringify(context.ContentRuntime.items()));assert.equal(shared.length,8414);
const records=[],seen=new Set(),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function add(bank,id,source,item,{kind='Opdracht',connected='Andere spelroute',level='',alias='',note=''}={}){
 const key=bank+'/'+id;assert.ok(!seen.has(key),'Duplicate review key '+key);seen.add(key);
 records.push({key,bank,id,source,version:String(item.version||item.source_version||''),sha256:hash(item),kind,connected,level,alias,note,status:'Nog nakijken',rounds:{cursist:'Nog nakijken',docent:'Nog nakijken',taal_en_niveau:'Nog nakijken',reeks_en_scherm:'Nog nakijken'},finding:'',change:'',evidence:'',reviewed_on:''});
}
for(const i of shared)add(i.content_bank_id,i.content_item_id,i.source_ref?.app_source||'ContentRuntime.items() (index.html → content-ui.js)',i,{connected:'Gezamenlijke voorbereiding',level:i.cefr_level,note:i.cefr_level==='B2'&&i.content_bank_id==='CB-GRAM-001'?'B2-herstel uitgevoerd; volledige vier-rondencontrole nog open.':''});
const sharedIds=new Map(shared.map(i=>[i.content_item_id,i.content_bank_id+'/'+i.content_item_id]));
const board=json('data/opdrachtenbank.json');for(const i of board.cards)add('Bordvragen',i.id,'data/opdrachtenbank.json',i,{level:board.routes.find(r=>r.id===i.routeId)?.label});
for(const i of json('data/tongbrekers.json').cards)add('Tongbrekers',i.id,'data/tongbrekers.json',i,{level:i.entryLevel});
for(const f of context.DIGIBORD_DATA.cardGames.families.filter(f=>f.id!=='tongue'))for(const i of f.cards)add('Kaartspel-'+f.id,i.id,'data/card-games.json',i,{level:i.routeId,note:'Controleer de kaart zoals deze in de eigen spelroute wordt getoond.'});
for(const i of json('data/kaartenkast_320.json').cards)add('Kaartenkast',i.id,'data/kaartenkast_320.json',i,{level:i.route||i.targetLevel,note:'Kaartenkast-route apart vergelijken met eventuele spelkaartvariant.'});
const words=json('Lessen/woorden-zinnen.json');for(const i of words.items)if(!sharedIds.has(i.id))add('Woordspel',i.id,'Lessen/woorden-zinnen.json',i,{level:i.level});
for(const [group,items] of Object.entries(context.DIGIBORD_ACTIVITIES))if(Array.isArray(items)&&group!=='wheelTitles')items.forEach((item,index)=>{const i=typeof item==='object'?item:{text:item};add('Activiteit-'+group,i.id||String(index+1).padStart(3,'0'),'data/new-activities.js',i,{kind:'Spelonderdeel',alias:group==='riddles'?sharedIds.get('ACT_RIDDLE_'+String(index+1).padStart(3,'0')):'',note:'Controle op de eigen spelroute; onderdeel is niet automatisch een losse opdracht.'})});
for(const i of context.DIGIBORD_DATA.c1BetweenLines.cards)add('Tussen-de-regels-oude-route',i.id,'data/c1-between-lines.js',i,{level:i.level,alias:sharedIds.get(i.id)||'',note:'Bevroren oorspronkelijke kaartversie; vergelijk actuele route en aangepaste versie, geen extra nieuwe inhoud.'});
const tongueOld=json('data/card-games.json').families.find(f=>f.id==='tongue');assert.equal(tongueOld.cards.length,40); // Replaced by the 240-card runtime bank, not counted again.
const story=json('data/storydice.json');for(const i of story.icons)add('Verhaalworp',i.id,'data/storydice.json',i,{kind:'Afbeelding en woord',level:'Niveauvrij'});
const diceFile='data/taalworp/Taalworp_A2_content_manifest_v1.0.json',dice=json(diceFile);
for(const group of ['diceFamilies','verbDecks','moreDecks','verbs','verbPatterns','recipes','compatibilityRules','sets'])for(const [id,item] of Object.entries(dice[group]))add('Taalworp-'+group,item.id||id,diceFile,item,{kind:'Spelonderdeel',level:'A2',note:'Controleer ook combinaties; dit is geen vooraf geschreven vraag.'});
for(const i of json('tests/fixtures/snelvragen-review.json').items.filter(i=>i.status==='HOLD'))add('Snelvragen-uitgesteld',i.id,'tests/fixtures/snelvragen-review.json',i,{connected:'Niet aangesloten',level:i.level||'',note:i.reason||''});
assert.equal(records.filter(i=>i.connected==='Niet aangesloten').length,771);
// Retained Drive snapshots: source records stay separate from playable questions.
const outputs=path.resolve(root,'../../outputs'),signalFile=path.join(outputs,'signaalwoorden-broncontrole-20260923.json'),higherFile=path.join(outputs,'c1-c2-broncontrole-20260923.json');
const signal=JSON.parse(fs.readFileSync(signalFile,'utf8')),higher=JSON.parse(fs.readFileSync(higherFile,'utf8'));
for(const [key,label] of [['signal-master','Signaalwoorden-bron'],['signal-recipes','Signaalwoorden-recept']])for(const row of signal.sources[key].values.slice(1))if(row[0])add(label,row[0],signalFile,row,{kind:key==='signal-master'?'Taalmiddel':'Oefenrecept',connected:'Bronvoorraad',note:'Geen uitgewerkte speelbare opdracht. Bronfouten en ontbrekende context staan in het signaalwoordenverslag.'});
for(const row of higher.crosswalk.values.slice(1))if(row[0])add('Hogere-taakontwerpen',row[0],higherFile,row,{kind:'Ontwerp',connected:'Bronvoorraad',level:row[3],note:'Taakontwerp of onderdeel, geen bevestigde zelfstandige C1/C2-opdracht.'});
const candidates=[...higher.praatpad.matchAll(/^### (PP-KAND-\d+) · ([\s\S]*?)(?=^### PP-KAND-|$(?![\s\S]))/gm)];assert.equal(candidates.length,72);
for(const match of candidates)add('Praatpad-kandidaten',match[1],higherFile,{text:match[2]},{kind:'Kandidaat',connected:'Ander product: Praatpad',note:'Eigen productbestemming behouden; niet automatisch aansluiten op DigiBord.'});
const groups=new Map();for(const r of records){
 if(r.bank==='CB-GRAM-001'&&/^ER_B2_(09[1-9]|10[0-9]|11[0-9]|120)$/.test(r.id)){r.workset='Eerst · Er B2 · Verwijzen (30)';continue}
 const group=r.bank+' · '+(r.level||r.kind),n=(groups.get(group)||0)+1;groups.set(group,n);r.workset=group+' · deel '+Math.ceil(n/40);
}
assert.equal(records.filter(r=>r.workset.startsWith('Eerst')).length,30);
const output=process.argv[2];if(!output){console.log(JSON.stringify({shared:shared.length,reviewEntries:records.length,byBank:records.reduce((a,r)=>(a[r.bank]=(a[r.bank]||0)+1,a),{})},null,2));process.exit(0)}
const dest=path.resolve(output);fs.mkdirSync(dest,{recursive:true});
const target=path.join(dest,'beoordelingslijst.json');assert.ok(!fs.existsSync(target),'Bestaande beoordelingslijst behouden: gebruik een nieuwe uitvoermap.');
fs.writeFileSync(target,JSON.stringify({date:'2026-09-23',scope:'Lokale aangesloten inhoud, overige spelroutes, spelonderdelen, 771 bewaarde uitgestelde Snelvragen en eerder bewaarde bronvoorraad. Geen nieuwe volledige Drive-inventaris.',meaning:'Nog nakijken betekent: de nieuwe volledige vier-rondencontrole is niet uitgevoerd. Eerdere afgebakende reviews blijven in hun bron behouden. Aliassen tellen niet als nieuwe unieke inhoud.',records},null,2)+'\n');
const cols=['key','workset','bank','id','source','version','sha256','kind','connected','level','alias','note','status','cursist','docent','taal_en_niveau','reeks_en_scherm','finding','change','evidence','reviewed_on'],cell=x=>'"'+String(x??'').replaceAll('"','""')+'"';
fs.writeFileSync(path.join(dest,'beoordelingslijst.csv'),'\uFEFF'+cols.map(cell).join(';')+'\r\n'+records.map(r=>cols.map(k=>cell(r[k]??r.rounds[k])).join(';')).join('\r\n')+'\r\n');
console.log(`PASS: ${shared.length} aangesloten opdrachten; ${records.length} afzonderlijke beoordelingsregels inclusief andere routes, onderdelen en uitgestelde vragen. Geen inhoud goedgekeurd.`);
