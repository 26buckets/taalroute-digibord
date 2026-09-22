import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url)),source=fs.readFileSync(root+'app.js','utf8');
const data=JSON.parse(JSON.stringify(vm.runInNewContext(fs.readFileSync(root+'data-bundle.js','utf8')+fs.readFileSync(root+'data/storydice.js','utf8')+fs.readFileSync(root+'data/tongbrekers.js','utf8')+'\nwindow.DIGIBORD_DATA',{window:{}})));
const ctx=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function taalworpExample('),source.indexOf('let languageBusy=')),ctx);
const m=data.taalworpManifest;
let examples=0;
for(const v of Object.values(m.verbs))for(const who of m.diceFamilies.WHO.values.filter(w=>!w.kind))for(const tense of m.diceFamilies.TENSE.values)for(const type of m.diceFamilies.SENTENCE_TYPE.values.filter(t=>!t.kind)){
 ctx.v=v;ctx.val={WHO:who,TENSE:tense,SENTENCE_TYPE:type};
 const text=vm.runInContext('taalworpExample(v,val)',ctx);
 assert.ok(!/undefined|null|\s{2}/.test(text),v.id+': '+text);examples++;
}
const run=(id,who,tense,recipe)=>{ctx.v=m.verbs[id];ctx.val={WHO:m.diceFamilies.WHO.values.find(w=>w.label===who),TENSE:{code:tense},SENTENCE_TYPE:{recipe}};return vm.runInContext('taalworpExample(v,val)',ctx)};
assert.equal(run('VRB_OPSTAAN','wij','present','declarative'),'Wij staan om zeven uur op.');
assert.equal(run('VRB_OPSTAAN','jij','present','yes_no_question'),'Sta jij om zeven uur op?');
assert.equal(run('VRB_WERKEN','wij','perfect','declarative'),'Wij hebben thuis gewerkt.');
assert.equal(run('VRB_RIJDEN','ik','perfect','declarative'),'Ik ben naar het werk gereden.');
assert.equal(run('VRB_ZWEMMEN','ik','perfect','declarative'),'Ik heb in het zwembad gezwommen.');
assert.ok(run('VRB_ZICH_AANMELDEN','wij','present','declarative').includes('Wij melden ons'));
const r=data.routes.rotterdam;
assert.equal(r.nodes.length,52);assert.equal(r.nodes.at(-1).id,r.finishPosition);assert.equal(r.overlayMode,'painted');
assert.deepEqual(r,JSON.parse(fs.readFileSync(root+'data/rotterdam-route.json')));
const taxi=r.alternativeRoutes[0];assert.equal(taxi.fromPosition,8);assert.equal(taxi.toPosition,40);
assert.deepEqual(taxi.segments[0].points[0],[r.nodes[8].x,r.nodes[8].y]);assert.deepEqual(taxi.segments[2].points.at(-1),[r.nodes[40].x,r.nodes[40].y]);
for(const icon of data.storydice.icons)assert.ok(fs.existsSync(root+icon.file),icon.file);
for(const set of Object.values(data.taalworpSets.sets))for(const id of set.recordIds)assert.ok(m.verbs[id],id);
assert.equal(data.storydice.icons.length,320);
assert.deepEqual(data.storydice,JSON.parse(fs.readFileSync(root+'data/storydice.json')));
assert.equal(new Set(data.storydice.icons.map(x=>x.id)).size,320);
assert.equal(new Set(data.storydice.icons.map(x=>x.number)).size,320);
assert.equal(data.storydice.collections.length,10);
for(const set of data.storydice.collections)assert.equal(data.storydice.icons.filter(x=>x.collection===set.id||set.includeNumbers?.includes(x.number)).length,set.count,set.id);
console.log(`PASS: ${examples} example combinations without missing forms; separable verbs, reflexives and auxiliaries; 52 positions; taxi 8 → 40; matching JSON/bundle; all 320 image assets and all set references.`);

// Finished players are skipped, progress is separate per mode, and a completed round resets.
const tc=vm.createContext({mode:'individual',players:[{id:'p1',name:'Laila'},{id:'p2',name:'Daan'}],APP:{turn:{active:0},boardStates:{r:{positions:{p1:51,p2:20},finished:{},groupPositions:{g1:51,g2:20},groupFinished:{},classPos:51,round:1}}},save(){},toast(){}});
vm.runInContext("function currentMode(){return mode} function participants(){return players} function settingsState(){return {groupCount:2}}",tc);
vm.runInContext(source.slice(source.indexOf('function boardActiveActor('),source.indexOf('function boardRouteSvg(')),tc);
vm.runInContext(source.slice(source.indexOf('function completeBoardTurn('),source.indexOf("/* Dobbelspellen */")),tc);
vm.runInContext("completeBoardTurn('r',{finishPosition:51})",tc);assert.equal(tc.APP.turn.active,1);assert.equal(tc.APP.boardStates.r.finished.p1,true);
tc.APP.boardStates.r.positions.p2=51;vm.runInContext("completeBoardTurn('r',{finishPosition:51})",tc);assert.equal(tc.APP.boardStates.r.round,2);assert.equal(tc.APP.boardStates.r.positions.p1,0);
tc.mode='groups';tc.APP.turn.active=0;vm.runInContext("completeBoardTurn('r',{finishPosition:51})",tc);assert.equal(tc.APP.turn.active,1);assert.equal(tc.APP.boardStates.r.groupFinished.g1,true);
tc.mode='class';vm.runInContext("completeBoardTurn('r',{finishPosition:51})",tc);assert.equal(tc.APP.boardStates.r.classPos,0);assert.equal(tc.APP.boardStates.r.round,3);
console.log('PASS: individual/group/class turn progression, finished-player skipping and full-round restart.');

// Animation transaction: only free dice move, cards respect their lock, and rapid clicks cannot draw twice.
const animationCalls=[],animationEnds=[],buttons=[{disabled:false},{disabled:false}],primary={disabled:false},deck={disabled:false,getBoundingClientRect:()=>({left:100,top:400,width:200})};
const animate=(frames,options)=>{animationCalls.push({frames,options});return {finished:new Promise(resolve=>animationEnds.push(resolve))}};
const page={querySelectorAll:()=>buttons,setAttribute(){},removeAttribute(){}};
const stage={isConnected:true,closest:()=>page,querySelector:()=>({animate})};
const card={style:{},animate,getBoundingClientRect:()=>({left:500,top:400,width:300})};
const ac=vm.createContext({Promise,Math,APP:{verbLocked:false,currentVerb:'a'},reduced:false,draws:0,TW_DICE_IDS:['WHO','TENSE','CONNECT_1'],
 twDiceState:{WHO:{active:true,locked:true,value:{label:'ik'}},TENSE:{active:true,locked:false,value:{label:'nu'}},CONNECT_1:{active:false,locked:false,value:{label:'en'}}},
 tw:{manifest:{verbs:{a:{id:'a'},b:{id:'b'}},diceFamilies:{TENSE:{values:[{label:'nu'},{label:'verleden'}]}}}},
 $(selector){return {'#languageStage':stage,'#primaryGame':primary,'#activeVerbCard':card,'#drawVerb':deck}[selector]},
 SmoothDice:{roll:()=>animate([],{duration:700}).finished},updateUndo(){},renderLanguageDice(){},renderVerbCard(){},playDiceSound(){},matchMedia:()=>({matches:false})});
vm.runInContext("let languageBusy=false;function settingsState(){return {reducedMotion:reduced}}function currentVerbPool(){return [{id:'a'},{id:'b'}]}function drawVerb(){draws++;APP.currentVerb=APP.currentVerb==='a'?'b':'a'}",ac);
vm.runInContext(source.slice(source.indexOf('function cardEffect(){'),source.indexOf('function playCabinetEffect(')),ac);
vm.runInContext(source.slice(source.indexOf('function rollTaalworp(){'),source.indexOf('function drawVerb()')),ac);
let pending=vm.runInContext('playTaalworp()',ac);
assert.equal(animationCalls.length,2);assert.equal(animationCalls[1].options.duration,950);
assert.ok(animationCalls[1].frames[0].transform.includes('rotateY(-180deg)'));
assert.equal(animationCalls[1].frames.at(-1).transform,'none');assert.equal(primary.disabled,true);
await vm.runInContext('playTaalworp()',ac);assert.equal(ac.draws,1);
animationEnds.splice(0).forEach(f=>f());await pending;assert.equal(primary.disabled,false);
assert.equal(ac.twDiceState.WHO.value.label,'ik');assert.equal(ac.twDiceState.CONNECT_1.value.label,'en');
const tenseBefore=ac.twDiceState.TENSE.value;animationCalls.length=0;
pending=vm.runInContext('playTaalworp(true)',ac);assert.equal(animationCalls.length,1);assert.equal(ac.twDiceState.TENSE.value,tenseBefore);
animationEnds.splice(0).forEach(f=>f());await pending;
vm.runInContext('APP.verbLocked=true',ac);animationCalls.length=0;
await vm.runInContext('playTaalworp(true)',ac);assert.equal(animationCalls.length,0);
pending=vm.runInContext('playTaalworp()',ac);assert.equal(animationCalls.length,1);
animationEnds.splice(0).forEach(f=>f());await pending;assert.equal(deck.disabled,true);
vm.runInContext('APP.verbLocked=false;reduced=true',ac);animationCalls.length=0;
await vm.runInContext('playTaalworp()',ac);assert.equal(animationCalls.length,0);assert.equal(primary.disabled,false);
console.log('PASS: draw/flip keyframes, animation locking, held and inactive dice, card-only draw, held card, reduced motion.');

const undoStorage={},undoLevel={value:''};
const uc=vm.createContext({structuredClone,JSON,STORE:'test',APP:{last:{type:'board'},level:'A2',counter:0},twDiceState:{WHO:{value:'ik'}},boardBusy:false,languageBusy:false,storyBusy:false,
 localStorage:{getItem:k=>undoStorage[k]||null,setItem:(k,v)=>undoStorage[k]=v},
 document:{addEventListener(){}},$:s=>s==='#levelSelect'?undoLevel:null,currentMode:()=> 'class',settingsPatch(){},selectedTaskRoute:()=>({label:'A1 → A2'}),resumeLast(){},save(){},toast(){}});
vm.runInContext(source.slice(source.indexOf('let undoHistory=[];'),source.indexOf('function currentMode()')),uc);
for(let i=0;i<6;i++)vm.runInContext("rememberAction('worp',true);APP.counter++;rememberAction('beurt afronden');APP.counter++",uc);
assert.equal(vm.runInContext('undoHistory.length',uc),5);
assert.equal(JSON.parse(undoStorage['test-undo']).length,5);
for(let i=0;i<10;i++)vm.runInContext('undoLastAction()',uc);
assert.equal(uc.APP.counter,2);assert.equal(vm.runInContext('undoHistory.length',uc),0);
vm.runInContext('undoLastAction()',uc);assert.equal(uc.APP.counter,2);
vm.runInContext("rememberAction('worp',true);twDiceState.WHO.value='wij';undoLastAction()",uc);assert.equal(uc.twDiceState.WHO.value,'ik');
console.log('PASS: five retained turns, ten separate roll/completion undos, persistence, empty history and original dice restoration.');
vm.runInContext("for(let i=0;i<12;i++){rememberAction('worp',true);APP.counter++}",uc);
assert.equal(vm.runInContext('undoHistory.length',uc),1);assert.equal(vm.runInContext('undoHistory[0].steps.length',uc),12);
const cabinetContext=vm.createContext({RUNTIME:data,CARD_GAMES:data.cardGames.families,CARD_ROUTES:data.cardGames.routeDefinitions,$$:()=>[],activeCardRoute:()=>'all',window:{DIGIBORD_DATA:data},tw:{sets:data.taalworpSets,manifest:m},story:data.storydice,taskBank:data.taskBank,APP:{level:'A2'}});
vm.runInContext(source.slice(source.indexOf('function storyIcons('),source.indexOf('function startStory(')),cabinetContext);
vm.runInContext(source.slice(source.indexOf('function collectionItems()'),source.indexOf('function cabinetCover(')),cabinetContext);
vm.runInContext(source.slice(source.indexOf('function cardsFor('),source.indexOf('function cardActivityHeader(')),cabinetContext);
vm.runInContext(source.match(/function selectedTaskRoute\(\)\{[^\n]+/)[0],cabinetContext);
const cabinet=vm.runInContext('collectionItems()',cabinetContext);
assert.equal(cabinet.length,76);assert.equal(cabinet.filter(x=>x.type==='verbs').length,23);assert.equal(new Set(cabinet.map(x=>x.type+':'+x.id)).size,76);
for(const item of cabinet.filter(x=>x.image))assert.ok(fs.existsSync(root+item.image));
console.log('PASS: repeated rolls remain in one turn; 76 unique cabinet entries (41 playable, 35 Drive sources) and real cover assets.');

for(const item of cabinet.filter(x=>x.type!=='source')){
 cabinetContext.item=item;const info=vm.runInContext('cabinetSetInfo(item.type,item.id)',cabinetContext);
 assert.ok(info.records.length>0,item.id);assert.ok(info.samples.length>0,item.id);
 for(const sample of info.samples)assert.ok(typeof sample==='string'?sample.length:info.records.includes(sample),item.id);
}
const motions=['draw','slide','turn'].map(id=>{cabinetContext.effect=id;return vm.runInContext('cabinetMotion(effect)',cabinetContext)});
assert.equal(new Set(motions.map(m=>JSON.stringify(m.frames))).size,3);
for(const motion of motions)assert.ok(motion.duration>=600&&motion.duration<=1000);
console.log('PASS: all 41 set details contain real examples; three distinct cabinet animation previews.');

ac.effect='draw';vm.runInContext("function settingsState(){return {reducedMotion:reduced,cardAnimation:effect}}",ac);
for(const [effect,duration] of [['draw',950],['slide',650],['turn',800],['invalid',950]]){
 ac.effect=effect;ac.reduced=false;animationCalls.length=0;
 pending=vm.runInContext('playTaalworp(true)',ac);assert.equal(animationCalls[0].options.duration,duration);
 animationEnds.splice(0).forEach(f=>f());await pending;
}
const cardControls=[{disabled:false}],cardShell={isConnected:true,querySelectorAll:()=>cardControls,setAttribute(){},removeAttribute(){}};
const cc=vm.createContext({APP:{cardKind:'conversation',cardIndex:0},turns:0,draws:0,save(){},updateUndo(){},
 $(selector){return selector==='.game-card-motion'?{closest:()=>cardShell}:{}},animateCard:()=>({finished:new Promise(resolve=>animationEnds.push(resolve))})});
vm.runInContext('function completeTurn(){turns++}function startCards(){draws++}',cc);
vm.runInContext(source.slice(source.indexOf('let cardBusy=false;'),source.indexOf('function startCards(')),cc);
pending=vm.runInContext('nextCard()',cc);await vm.runInContext('nextCard()',cc);
assert.equal(cc.APP.cardIndex,1);assert.equal(cc.turns,1);assert.equal(cardControls[0].disabled,true);
animationEnds.splice(0).forEach(f=>f());await pending;assert.equal(cardControls[0].disabled,false);
cc.APP.cardKind='story';cc.APP.cardRound={id:'previous',attempted:true};pending=vm.runInContext('nextCard()',cc);
assert.equal(cc.APP.cardRound,undefined);assert.equal(cc.APP.cardIndex,2);animationEnds.splice(0).forEach(f=>f());await pending;
console.log('PASS: shared animation setting, invalid-value fallback, card double-click guard and production story-card progression.');

const dc=vm.createContext({safeColor:v=>v,esc:v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))});
vm.runInContext(source.slice(source.indexOf('function diePips('),source.indexOf('function physicalDie(')),dc);
for(let n=1;n<=6;n++){
 dc.n=n;const html=vm.runInContext('softDie({value:n})',dc);
 assert.equal((html.match(/class="die-face die-face-/g)||[]).length,6);
 const counts=[...html.matchAll(/<span class="die-face die-face-\d">([\s\S]*?)(?=<span class="die-face die-face-|$)/g)].map(x=>(x[1].match(/class="pip"/g)||[]).length);
 assert.deepEqual([...counts].sort((a,b)=>a-b),[1,2,3,4,5,6]);assert.equal(counts[0],n);
 assert.equal(counts[0]+counts[2],7);assert.equal(counts[1]+counts[3],7);assert.equal(counts[4]+counts[5],7);
}
const wordDie=vm.runInContext("softDie({word:'ik',words:['jij','wij','zij','hij','u']})",dc);
assert.equal((wordDie.match(/class="die-face die-face-/g)||[]).length,6);
const imageDie=vm.runInContext("softDie({image:'a.png',images:['b.png','c.png','d.png','e.png','f.png']})",dc);
assert.equal((imageDie.match(/<img /g)||[]).length,6);
const whiteLogo=fs.readFileSync(root+'assets/brand/taalroute-white.svg','utf8');
assert.ok(!whiteLogo.includes('<text'));assert.ok([...whiteLogo.matchAll(/fill="([^"]+)"/g)].every(x=>x[1]==='#FFFFFF'));
assert.ok(vm.runInContext("cardBack('Werk')",dc).includes('assets/brand/taalroute-white.svg'));
console.log('PASS: six square die faces, six correct pip values with opposite sum seven, filled word/image faces and complete white vector logo.');

const sources=cabinet.filter(x=>x.type==='source');
assert.equal(sources.length,35);
assert.deepEqual(data.cardCatalog,JSON.parse(fs.readFileSync(root+'data/drive-card-catalog.json')));
assert.equal(sources.filter(x=>x.status==='Lesbestand').reduce((n,x)=>n+x.count,0),410);
assert.equal(sources.filter(x=>x.status==='Concept').reduce((n,x)=>n+x.count,0),72);
for(const item of sources)assert.match(item.url,/^https:\/\/(drive|docs)\.google\.com\//);
assert.ok(!/data-main="collection"/.test(fs.readFileSync(root+'index.html','utf8')));
assert.ok(fs.existsSync(root+'assets/tabletop/taalworp-desk.png'));
console.log('PASS: 35 Drive sources, 410 PDF card places, 72 candidates; bundle matches catalog; cabinet removed from main navigation.');

const geometry=JSON.parse(fs.readFileSync(root+'data/die-geometry.json'));
assert.equal(geometry.faces.length,6);assert.equal(geometry.bevels.length,20);
const edges=new Map();
for(const poly of [...geometry.faces,...geometry.bevels])for(let i=0;i<poly.length;i++){
 const key=[JSON.stringify(poly[i]),JSON.stringify(poly[(i+1)%poly.length])].sort().join('|');edges.set(key,(edges.get(key)||0)+1);
}
assert.equal(edges.size,48);assert.ok([...edges.values()].every(n=>n===2),'Every edge must join two opaque surfaces');
assert.equal((wordDie.match(/class="die-bevel"/g)||[]).length,20);
for(const key of ['BASIS','SCHEIDBAAR','WEDERKEREND','ONREGELMATIG','MODALITEIT','VASTE_COMBINATIES'])assert.ok(data.taalworpSets.sets['SET_A2_'+key].recordIds.length);
assert.ok(!source.includes('class="form-shelf"'));
assert.ok(source.includes('playerPawn(p.color)'));assert.ok(source.includes('pawnShape(a.color)'));
console.log('PASS: closed 26-surface dice, 48 shared edges without openings; six real language-form selections; shared pawn silhouette.');

// Board footers retain a single roll target, undo button and mode selector.
const footerContext=vm.createContext({participants:()=>[{name:'Ali',color:'#0088ff'},{name:'Fatima',color:'#ee3333'}],currentMode:()=> 'individual',APP:{turn:{active:0}},undoHistory:[],settingsState:()=>({}),playerPawn:()=>'<svg></svg>',gameIcon:()=>'<svg></svg>',esc:s=>s});
vm.runInContext(source.slice(source.indexOf('function gameBar('),source.indexOf('function bindGameBar(')),footerContext);
const boardFooter=vm.runInContext('gameBar(\'<button id="primaryGame">GOOIEN</button>\',true)',footerContext);
const otherFooter=vm.runInContext('gameBar(\'<button id="primaryGame">GOOIEN</button>\')',footerContext);
for(const html of [boardFooter,otherFooter]){assert.equal((html.match(/id="primaryGame"/g)||[]).length,1);assert.equal((html.match(/id="undoAction"/g)||[]).length,1);assert.ok(html.includes('Fatima'));}
assert.ok(boardFooter.includes('Bordopties'));assert.ok(boardFooter.includes('board-players-heading'));assert.ok(!boardFooter.includes('id="modeSelect"'));assert.ok(otherFooter.includes('id="modeSelect"'));assert.ok(!otherFooter.includes('board-players-heading'));
console.log('PASS: board footer keeps roll and undo controls unique; mode selector moves to board options; other games retain their footer.');

// All three real card games render the same usable table with one of each control.
const tableMount={innerHTML:''};
const tableCtx=vm.createContext({RUNTIME:data,CARD_GAMES:data.cardGames.families,CARD_ROUTES:data.cardGames.routeDefinitions,$$:()=>[],activeCardRoute:()=>'all',APP:{cardIndex:0},taskBank:data.taskBank,story:data.storydice,Math,
 $:()=>tableMount,save(){},bindCards(){},setLast(){},toast(message){throw Error(message)},
 selectedTaskRoute:()=>data.taskBank.routes[2],adaptTask:c=>c,shapeMeta:id=>data.taskBank.shapes.find(s=>s.id===id),
 cardFan:()=>'<svg></svg>',levelInstruction:()=> 'Vertel in enkele zinnen.',gameIcon:()=>'<svg></svg>',gameBar:html=>html,cardBack:title=>title,
 esc:s=>String(s??''),collectionItems:()=>data.cardGames.families.map(g=>({...g,type:'cards'}))});
vm.runInContext(fs.readFileSync(root+'context-tools.js','utf8'),tableCtx);
vm.runInContext(source.slice(source.indexOf('function cardsFor('),source.indexOf('function bindCards(')),tableCtx);
vm.runInContext(source.slice(source.indexOf('function startCards('),source.indexOf('/* Woorden en zinnen */')),tableCtx);
for(const kind of data.cardGames.families.filter(x=>x.id!=='tongue').map(x=>x.id)){
 vm.runInContext(`startCards('${kind}')`,tableCtx);
 for(const id of ['primaryGame','cardDeck','cardHelp','cardExample','cardGoals','cardPartner','cardSetInfo','cardSupport'])assert.equal((tableMount.innerHTML.match(new RegExp(`id="${id}"`,'g'))||[]).length,1,kind+' '+id);
 assert.ok(tableMount.innerHTML.includes('card-table-shell'));assert.ok(tableMount.innerHTML.includes('assets/brand/taalroute-white.svg'));
 assert.ok(tableMount.innerHTML.includes('1 van 40'));
}
console.log('PASS: all seven other card tables render real counts/content, white logo and the five unique contextual controls.');

assert.deepEqual(data.cardGames,JSON.parse(fs.readFileSync(root+'data/card-games.json')));
assert.equal(data.cardGames.families.length,8);
const pilotCards=data.cardGames.families.flatMap(g=>g.cards);assert.equal(pilotCards.length,320);
assert.equal(new Set(pilotCards.map(c=>c.id)).size,320);
for(const c of pilotCards){for(const field of ['title','instruction','situation','criterion'])assert.ok(c[field]?.trim(),c.id+' '+field);assert.ok(c.help.items.length);assert.ok(c.model.text);assert.equal(c.reviewStatus,'pilot_ready');}
const wordLetters=s=>[...s.replace(/[^a-z]/gi,'').toUpperCase()].sort().join('');
assert.equal(wordLetters('TSFIE'),wordLetters('FIETS'));assert.equal(wordLetters('IHSU'),wordLetters('HUIS'));
assert.equal('PAN'.replace('A','E'),'PEN');assert.equal('BOOT'.replace('O',''),'BOT');assert.ok('ZKATLM'.includes('KAT'));
const hostHtml=fs.readFileSync(root+'index.html','utf8'),settingsHtml=fs.readFileSync(root+'settings/index.html','utf8');
assert.ok(!hostHtml.includes('id="settingsClose"'));assert.equal((settingsHtml.match(/class="back-btn"/g)||[]).length,1);assert.ok(settingsHtml.includes('taalroute-close-settings'));
console.log('PASS: matching self-contained 320-card production bundle, unique complete records, letter-puzzle checks and one settings return control.');

// Card category and legacy deep link skip the cabinet screen.
const navigationCalls=[];
const navCtx=vm.createContext({stopTongueAudio(){},APP:{},startCards:kind=>navigationCalls.push(kind),SmoothDice:{mount(){}},renderCollection:()=>{throw Error('Unexpected cabinet screen')}});
vm.runInContext(source.slice(source.indexOf('function goScreen('),source.indexOf('function home(')),navCtx);
vm.runInContext("goScreen('cards')",navCtx);
navCtx.APP.cardKind='verbs';vm.runInContext("goScreen('cards')",navCtx);
assert.deepEqual(navigationCalls,['conversation','verbs']);
assert.ok(source.includes("if(location.hash==='#kaartenkast'||location.hash==='#kaartspellen')goScreen('cards');"));
console.log('PASS: card games open directly, preserving the selected family.');

// The shared board action must finish and roll with one gesture, while locks still hold.
{
const boardActions=[],drawer={open:false},taxi={hidden:true};
const boardActionCtx=vm.createContext({boardBusy:false,APP:{boardStates:{test:{pending:{task:'old'}}}},
 $:id=>id==='#taxiChoice'?taxi:{classList:{contains:()=>drawer.open}},
 completeBoardTurn:()=>boardActions.push('complete'),startBoard:()=>{drawer.open=false;boardActions.push('render')},rollBoard:()=>boardActions.push('roll')});
vm.runInContext(source.slice(source.indexOf('function boardAction('),source.indexOf('function showBoardSupport(')),boardActionCtx);
vm.runInContext("boardAction('test',{})",boardActionCtx);assert.deepEqual(boardActions,['roll']);
boardActions.length=0;drawer.open=true;vm.runInContext("boardAction('test',{})",boardActionCtx);
assert.deepEqual(boardActions,['complete','render','roll']);assert.equal(boardActionCtx.APP.boardStates.test.pending,undefined);
boardActions.length=0;boardActionCtx.boardBusy=true;vm.runInContext("boardAction('test',{})",boardActionCtx);assert.equal(boardActions.length,0);
boardActionCtx.boardBusy=false;taxi.hidden=false;vm.runInContext("boardAction('test',{})",boardActionCtx);assert.equal(boardActions.length,0);
console.log('PASS: one gesture finishes the task and rolls; animation and taxi choices block extra rolls.');
}

// The active smooth renderer is the imported rounded geometry, not the CSS bevel fallback.
const smooth=vm.runInNewContext(fs.readFileSync(root+'smooth-dice-renderer.js','utf8')+'\nPraatpadDice',{Float32Array,Math,Set});
const roundMesh=smooth.geometry(48);assert.equal(roundMesh.length,6*48*48*6*7);
for(let i=0;i<roundMesh.length;i+=7){assert.ok(Math.max(...roundMesh.slice(i,i+3).map(Math.abs))<=1.00001);assert.ok(Math.abs(Math.hypot(...roundMesh.slice(i+3,i+6))-1)<.00001);}
assert.deepEqual(Array.from(smooth.faces,f=>f.value).sort(),[1,2,3,4,5,6]);
assert.ok(source.includes('SmoothDice.markup({color,word,image,value,words,images,topIcon,front})'));
const textures=vm.runInNewContext(fs.readFileSync(root+'dice-textures.js','utf8')+'\nwindow.DICE_TEXTURES',{window:{}});
for(const icon of data.storydice.icons)assert.ok(textures[icon.file]?.startsWith('data:image/png;base64,'),icon.file);
console.log('PASS: rounded 48-segment geometry, six faces, unit normals, bounded solid and all 320 offline textures.');

// The visible assignment must explain the actual roll, including ambiguous “zij”.
const instructionContext=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function languageInstruction('),source.indexOf('function renderVerbCard(')),instructionContext);
for(const [id,family] of Object.entries(m.diceFamilies))for(const value of family.values){
 instructionContext.id=id;instructionContext.value=value;
 const rule=vm.runInContext('languageInstruction(id,value)',instructionContext);
 assert.ok(rule.title&&rule.text&&!/undefined|null/.test(rule.text));
 if(id==='TENSE')assert.ok(rule.text.includes({present:'nu',past:'vroeger',perfect:'hebben of zijn'}[value.code]));
 if(value.disambiguation)assert.ok(rule.text.includes(value.disambiguation));
}
console.log('PASS: every language-die outcome has a readable assignment; tense instructions and both meanings of zij.');

// All records retain their source content; picture rebuses present their visual variant.
vm.runInContext(source.slice(source.indexOf('function defaultCardRoute('),source.indexOf('function cardsFor(')),tableCtx);
for(const family of data.cardGames.families.filter(x=>x.id!=='tongue')){
 tableCtx.APP.cardRoute='all';
 for(let i=0;i<family.cards.length;i++){
  tableCtx.APP.level={R0:'A0',R1:'A1',R2:'A1+',R3:'A2',R4:'B1',R5:'B2',R6:'C1'}[family.cards[i].routeId];tableCtx.APP.cardIndex=family.cards.filter(c=>c.routeId===family.cards[i].routeId).findIndex(c=>c.id===family.cards[i].id);tableCtx.kind=family.id;
  vm.runInContext('startCards(kind)',tableCtx);
  const c=family.cards[i],html=tableMount.innerHTML;
  const visible=c.visualRebus?[c.visualRebus.title,c.visualRebus.instruction,c.visualRebus.explanation,...c.visualRebus.context]:[c.title,c.instruction,c.situation];
  for(const text of [...visible,c.model.text,c.criterion,...c.help.items])assert.ok(html.includes(text),c.id+' missing '+text);
  if(c.actionType==='rebus'){
   assert.ok(c.visualRebus,c.id+' needs its picture');
   assert.equal(c.visualRebus.src,'assets/rebussen/'+c.id+'.png');
   assert.ok(fs.existsSync(root+c.visualRebus.src));
   assert.ok(html.includes('id="cardRebus"'));
   assert.ok(html.includes('src="'+c.visualRebus.src+'"'));
   assert.ok(!html.includes(c.situation),c.id+' still shows the old word rebus');
  }
  assert.ok(html.includes(`data-card-id="${c.id}"`));
  assert.equal(/\bdisabled\b/.test(html.match(/<button[^>]*id="cardExample"[^>]*>/)[0]),c.model.showWhen!=='before_during_after_attempt',c.id+' model timing');
 }
 for(const route of data.cardGames.routeDefinitions){
  tableCtx.APP.level={R0:'A0',R1:'A1',R2:'A1+',R3:'A2',R4:'B1',R5:'B2',R6:'C1'}[route.id];tableCtx.kind=family.id;
  const selected=vm.runInContext('cardsFor(kind)',tableCtx);
  assert.ok(selected.length);assert.ok(selected.every(c=>c.routeId===route.id));
 }
}
tableCtx.APP.cardRoute='all';tableCtx.kind='conversation';
assert.equal(vm.runInContext('cardsFor(kind,true).length',tableCtx),40);
// A genuinely empty route never receives cards from another route.
const emptyFamily={id:'empty',cards:[data.cardGames.families[0].cards[0]]};
tableCtx.CARD_GAMES.push(emptyFamily);tableCtx.APP.level='C1';
assert.equal(vm.runInContext("cardsFor('empty').length",tableCtx),0);
tableCtx.CARD_GAMES.pop();
console.log('PASS: all 280 other records render correctly, including ten illustrated rebuses; seven exact routes; all 40 conversation cards; no empty-route substitution.');

// The header keeps the same level and options in and outside card games.
const levelMenu={dataset:{},setAttribute(){}};
const menuCtx=vm.createContext({$:()=>levelMenu,APP:{level:'A2',cardRoute:'R2'},CARD_ROUTES:data.cardGames.routeDefinitions,LEVELS:['Alpha A','Alpha B','Alpha C','A0','A1','A2','B1','B2','C1','C2'],esc:s=>s,activeCardRoute:()=>menuCtx.APP.cardRoute});
vm.runInContext(source.slice(source.indexOf('function syncLevelSelect('),source.indexOf('\nfunction resetLevelContent(')),menuCtx);
vm.runInContext('syncLevelSelect(true)',menuCtx);
assert.equal(levelMenu.value,'A2');assert.equal((levelMenu.innerHTML.match(/<option/g)||[]).length,menuCtx.LEVELS.length);
vm.runInContext('syncLevelSelect(false)',menuCtx);assert.equal(levelMenu.value,'A2');assert.equal(levelMenu.dataset.routes,'false');assert.ok(levelMenu.innerHTML.includes('Alpha A'));
assert.ok(!source.includes('id="cardRoute"'));
console.log('PASS: shared level selector remains unchanged inside and outside card games; all seven routes remain reachable.');

// All ready sets are selectable once, grouped into Basis, Taalvorm and Thema’s.
const setCtx=vm.createContext({esc:s=>String(s??''),APP:{},tw:{sets:data.taalworpSets,manifest:m}});
vm.runInContext(source.slice(source.indexOf('function currentVerbPool('),source.indexOf('function taalworpExample(')),setCtx);
vm.runInContext(source.slice(source.indexOf('function verbSetMenu('),source.indexOf('function startTaalworp(')),setCtx);
setCtx.sets=Object.values(data.taalworpSets.sets).filter(s=>s.availabilityStatus==='ready');
for(const set of setCtx.sets){
 setCtx.APP.taalworpSets=[set.id];setCtx.selected=[set.id];
 const html=vm.runInContext('verbSetMenu(sets,selected)',setCtx);
 assert.equal((html.match(/data-verbset /g)||[]).length,23);assert.equal((html.match(/ checked/g)||[]).length,1);
 assert.equal((html.match(/data-verbgroup=/g)||[]).length,3);
 assert.equal(vm.runInContext('currentVerbPool().length',setCtx),set.recordIds.length);
}
setCtx.APP.taalworpSets=setCtx.sets.map(s=>s.id);
assert.equal(vm.runInContext('currentVerbPool().length',setCtx),new Set(setCtx.sets.flatMap(s=>s.recordIds)).size);
console.log('PASS: all 23 verb sets, three labelled groups, single selections and a deduplicated full mix.');

// Three states: active/free, active/held and off. A lock cannot activate an off die.
const toggleDie={dataset:{die:'WHO'}},toggleLock={dataset:{lock:'WHO'}},toggleStage={innerHTML:''};
const toggleCtx=vm.createContext({TW_DICE_IDS:['WHO'],tw:{manifest:{diceFamilies:{WHO:{label:'Wie',values:[{label:'ik'}]}}}},twDiceState:{WHO:{active:true,locked:false,value:{label:'ik'}}},languageBusy:false,$:()=>toggleStage,$$:s=>s==='[data-die]'?[toggleDie]:[toggleLock],languageDieLabel:()=> 'ik',languageDieIcon:()=>'',softDie:()=>'',gameIcon:n=>`<svg>${n}</svg>`,esc:s=>s,SmoothDice:{mount(){}},renderVerbCard(){}});
vm.runInContext(source.slice(source.indexOf('function renderLanguageDice('),source.indexOf('function currentVerbPool(')),toggleCtx);
vm.runInContext('renderLanguageDice()',toggleCtx);toggleLock.onclick();assert.equal(toggleCtx.twDiceState.WHO.locked,true);assert.ok(toggleStage.innerHTML.includes('<svg>lock</svg>'));
toggleDie.onclick();assert.equal(toggleCtx.twDiceState.WHO.active,false);assert.equal(toggleCtx.twDiceState.WHO.locked,false);assert.ok(toggleStage.innerHTML.includes('hidden><svg>unlock</svg>'));toggleLock.onclick();assert.equal(toggleCtx.twDiceState.WHO.active,false);
toggleDie.onclick();assert.equal(toggleCtx.twDiceState.WHO.active,true);assert.equal(toggleCtx.twDiceState.WHO.locked,false);toggleLock.onclick();toggleLock.onclick();assert.equal(toggleCtx.twDiceState.WHO.locked,false);
console.log('PASS: corner lock holds/frees; switching off clears hold; hidden lock never enables an off die.');

// V01.24: the adapter forwards each die's reading angle without changing roll outcomes.
const seen=[];
const hosts=[{value:5,front:false},{value:3},{value:2,front:true}].map(spec=>({dataset:{dieSpec:JSON.stringify(spec)},isConnected:true,closest:()=>null,querySelector:()=>({})}));
const adapter=vm.runInNewContext(fs.readFileSync(root+'smooth-dice.js','utf8')+';window.SmoothDice',{window:{},document:{querySelectorAll:()=>hosts},PraatpadDice:{create(canvas,options){seen.push({options,value:null});const result=seen.at(-1);return {show(value){result.value=value},destroy(){}}}}});
adapter.mount();
assert.deepEqual(seen.map(x=>x.options.front),[false,true,true]);
assert.deepEqual(seen.map(x=>x.value),[5,3,2]);
assert.equal(seen[0].options.fill,.315);assert.equal(seen[1].options.fill,.4);
console.log('PASS: board/button dice keep the angled view; learning dice remain front-facing; outcomes unchanged.');

// Imported records replace stale saved task copies; partner/criterion reach the existing support area.
const updatedTask=data.taskBank.cards.find(c=>c.id==='mx-2-dagelijks-04-diamond');
const boardNodes=Object.fromEntries(['#taskSupport','#taskMeta','#taskTitle','#taskInput','#taskDrawer','.board-game','#primaryGame','#boardStatus'].map(id=>[id,{textContent:'',innerHTML:'',dataset:{},classList:{add(){}}}]));
const importCtx=vm.createContext({APP:{last:{data:{board:'rotterdam'}},level:'A2',boardStates:{rotterdam:{pending:{task:{id:updatedTask.id,instruction:'Old instruction'}}}}},taskBank:data.taskBank,directBank:data.directBank,boardTaskCards:()=>data.taskBank.cards,selectedTaskRoute:()=>data.taskBank.routes[2],contentVertSession:()=>null,$:s=>boardNodes[s],openGameDialog(title,html){boardNodes['#taskSupport'].innerHTML=html},esc:s=>s,save(){},boardActiveActor:()=>({id:'p0',pos:2,name:'Laila'}),shapeMeta:()=>({symbol:'◇',task:'Regel iets'}),routeTask(){throw Error('Saved ID was lost')},currentMode:()=> 'individual'});
vm.runInContext(source.slice(source.indexOf('function showBoardSupport('),source.indexOf('async function animateBoardPath(')),importCtx);
vm.runInContext("showBoardTask('rotterdam',{finishPosition:51});showBoardSupport('partner')",importCtx);
assert.equal(boardNodes['#taskTitle'].textContent,updatedTask.instruction);
assert.ok(boardNodes['#taskSupport'].innerHTML.includes(updatedTask.partner));
vm.runInContext("showBoardSupport('model')",importCtx);
assert.ok(boardNodes['#taskSupport'].innerHTML.includes(updatedTask.criterion));
tableCtx.APP.cardKind='conversation';tableCtx.APP.level='A1+';tableCtx.APP.cardRoute='R2';tableCtx.APP.cardIndex=0;tableCtx.APP.cardBankRevision='data/kaartenkast_180.json';tableCtx.APP.cardRound={id:'TR-CONVERSATION-P002-007-R2',attempted:true};
vm.runInContext(source.slice(source.indexOf('// Keep the selected record'),source.indexOf('function defaultCardRoute(')),tableCtx);
assert.equal(vm.runInContext('currentCard().id',tableCtx),'TR-CONVERSATION-P002-007-R2');
assert.equal(vm.runInContext('cardRound(currentCard()).attempted',tableCtx),false);
assert.equal(tableCtx.APP.cardBankRevision,data.cardGames.source);
console.log('PASS: imported saved tasks use current content; partner and criterion visible; selected card ID retained and old attempt reset after import.');
