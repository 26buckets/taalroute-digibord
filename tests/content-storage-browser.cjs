const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),served=process.env.BUILD_SMOKE?path.join(root,'dist'):root;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{const file=path.resolve(served,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(served+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url())});
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
 const first=await page.evaluate(()=>{
  localStorage.removeItem('content002b-browser-test');
  const adapter=ContentStorage.createLocalStorageAdapter(localStorage,{key:'content002b-browser-test'});
  const service=ContentStorage.createContentStorageService({
   adapter,contentRuntime:ContentRuntime,
   progressAdapters:{BOARD:{canResume:p=>p.progress_schema_version==='BOARD-PROGRESS-1'}},
   referenceResolvers:{game_variant:(refId,{engine}={})=>({BOARD:['rotterdam','zwolle'],WHEEL:['draaiwiel'],CARDS:['content-pb001']}[engine]||[]).includes(refId)}
  });
  const owner={owner_scope:'user',owner_ref:'local-user',created_by_ref:'local-user',visibility:'private',edit_policy:'owner_only'};
  const selection_spec={scope_clauses:[{scope_id:'scope-1',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ER'],cefr_levels:['B1'],subtopic_ids:[],interaction_type_ids:[]}],filter_spec:{production_mode:'all',difficulty:'all',exercise_types:[]},distribution_spec:{mode:'equal'},compatibility_policy:'compatible_only'};
  const execution_preferences={target_duration_seconds:600,organization_mode:'class',preferred_game_engine:'BOARD',preferred_game_variant:'rotterdam'};
  const saved=service.saveSelection({name:'Browser ER B1',selection_spec,execution_preferences,owner});
  const session=service.createSessionFromSelection(saved.saved_selection_id,{seed:20260922,engines:['BOARD','WHEEL','CARDS'],startedAt:'2026-09-22T10:00:00.000Z'});
  const recent=service.storeRecentSession({sessionConfig:session,runtimeProgress:{engine_id:'BOARD',engine_version:session.game_engine_versions.BOARD,progress_schema_version:'BOARD-PROGRESS-1',state_payload:{board:'rotterdam',position:4}},savedSelectionId:saved.saved_selection_id,owner});
  const favorite=service.addFavorite({ref_type:'saved_selection',ref_id:saved.saved_selection_id,owner});
  const mix=service.createMixProfile({name:'Browser mix',scope_clauses:[{scope_id:'er',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ER'],cefr_levels:['B1'],subtopic_ids:[],interaction_type_ids:[]},{scope_id:'zullen',content_family_id:'grammar',content_bank_ids:['CB-GRAM-001'],topic_ids:['ZULLEN'],cefr_levels:['B1'],subtopic_ids:[],interaction_type_ids:[]}],filter_spec:{production_mode:'all',difficulty:'all'},distribution_spec:{mode:'equal'},compatibility_policy:'compatible_only',owner});
  return{savedId:saved.saved_selection_id,recentId:recent.recent_session_id,favoriteId:favorite.favorite_ref_id,mixId:mix.mix_profile_id,selectedIds:session.selected_item_ids};
 });
 assert.ok(first.selectedIds.length>0);

 await page.reload();
 const second=await page.evaluate(ids=>{
  const adapter=ContentStorage.createLocalStorageAdapter(localStorage,{key:'content002b-browser-test'});
  const service=ContentStorage.createContentStorageService({adapter,contentRuntime:ContentRuntime,progressAdapters:{BOARD:{canResume:p=>p.progress_schema_version==='BOARD-PROGRESS-1'}},referenceResolvers:{game_variant:(refId,{engine}={})=>({BOARD:['rotterdam','zwolle'],WHEEL:['draaiwiel'],CARDS:['content-pb001']}[engine]||[]).includes(refId)}});
  const actor={owner_ref:'local-user'},owner={owner_scope:'user',owner_ref:'local-user',created_by_ref:'local-user',visibility:'private',edit_policy:'owner_only'};
  const saved=service.resolveSavedSelection(ids.savedId,{actor});
  const favorite=service.resolveFavorite(ids.favoriteId,{actor});
  const mix=service.resolveMixProfile(ids.mixId,{actor});
  const resumed=service.resumeRecentSession(ids.recentId,{actor});
  const replay=service.replayRecentSessionExact(ids.recentId,{actor,owner,startedAt:'2026-09-22T11:00:00.000Z'});
  const reroll=service.rerollRecentSession(ids.recentId,{actor,owner,seed:20260923,startedAt:'2026-09-22T11:10:00.000Z'});
  let privacyCode='';
  try{service.storeRecentSession({sessionConfig:resumed.sessionConfig,runtimeProgress:{engine_id:'BOARD',engine_version:'x',progress_schema_version:'BOARD-PROGRESS-1',state_payload:{cursistId:'123'}},owner})}catch(e){privacyCode=e.code}
  let conflictCode='';
  try{service.updateSavedSelection(ids.savedId,{description:'conflict'},{actor,expectedRevision:1})}catch(e){conflictCode=e.code}
  return{
   savedStatus:saved.status,savedName:saved.object?.name,favoriteStatus:favorite.status,mixStatus:mix.status,
   resumedIds:resumed.sessionConfig.selected_item_ids,replayIds:replay.sessionConfig.selected_item_ids,rerollIds:reroll.sessionConfig.selected_item_ids,
   replaySessionId:replay.sessionConfig.session_id,oldSessionId:resumed.sessionConfig.session_id,
   privacyCode,conflictCode,
   savedCount:service.list(ContentStorage.OBJECT_TYPES.SAVED_SELECTION,actor).length,
   recentCount:service.list(ContentStorage.OBJECT_TYPES.RECENT_SESSION,actor).length
  };
 },first);
 assert.equal(second.savedStatus,'READY');assert.equal(second.savedName,'Browser ER B1');
 assert.equal(second.favoriteStatus,'READY');assert.equal(second.mixStatus,'READY');
 assert.deepEqual(second.resumedIds,first.selectedIds);
 assert.deepEqual(second.replayIds,first.selectedIds);
 assert.notDeepEqual(second.rerollIds,first.selectedIds);
 assert.notEqual(second.replaySessionId,second.oldSessionId);
 assert.equal(second.privacyCode,'BLOCKED_PRIVACY_PAYLOAD');
 assert.equal(second.conflictCode,'CONFLICT_REVISION');
 assert.equal(second.savedCount,1);assert.ok(second.recentCount>=3);
 assert.deepEqual(errors,[]);
 console.log('PASS: CONTENT UI 002B browser persistence, resume, exact replay, reroll, privacy and revision conflicts');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
