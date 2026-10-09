/* Teacher counts and lesson proposals share the released runtime and original IDs. */
(function(root){
 'use strict';
 const runtime=()=>root.ContentRuntime,routes=()=>root.DigiRoutes;
 const unique=items=>[...new Map(items.map(i=>[i.content_item_id,i])).values()];
 const routeOf=i=>routes().classification(i).displayRoute;
 const guided=i=>routes().classification(i).FreePlayGate==='GUIDED';
 const entries=()=>root.ContentUI.teacherEntries();
 const find=(family,topic)=>entries().find(e=>e.family.id===family&&e.topic.id===topic);
 const kinds=()=>[...root.DIGIBORD_CONTENT_CATALOG.focuses.filter(f=>!['all','sort'].includes(f.id)),{id:'other',label:'Andere oefeningen',exerciseTypes:[]}];
 const kindOf=i=>kinds().find(k=>k.exerciseTypes.includes(i.exercise_type))?.id||'other';
 const title=e=>e.topic.goal||e.topic.label;
 function matching(filters={}){return entries().filter(e=>(!filters.family||e.family.id===filters.family)&&(!filters.topic||e.topic.id===filters.topic)&&(!filters.category||e.topic.categories?.includes(filters.category))&&(!filters.query||root.GrammarCatalog.matches(e.topic,filters.query)||e.family.label.toLocaleLowerCase('nl').includes(filters.query.toLocaleLowerCase('nl')))).map(e=>({...e,rows:unique(e.rows.filter(i=>(!filters.route||routeOf(i)===filters.route)&&(!filters.kind||kindOf(i)===filters.kind)))})).filter(e=>e.rows.length)}
 function counts(items){const rows=unique(items);return {total:rows.length,free:rows.filter(i=>!guided(i)).length,guided:rows.filter(guided).length}}
 function scope(entry,route){const t=entry.topic;return {scope_id:entry.family.id+'-'+t.id,content_family_id:t.sourceFamilies?null:entry.family.id,content_bank_ids:t.sourceFamilies?runtime().banks().filter(b=>t.sourceFamilies.includes(b.familyId)).map(b=>b.bank.bank_id):[],topic_ids:t.sourceTopics||[t.id],cefr_levels:[route],subtopic_ids:[],interaction_type_ids:[],weight:1}}
 function selection(entry,route,{kind='',micro=''}={}){
  if(!entry||!routes().routes.some(r=>r.id===route))throw new Error('Kies een onderwerp en niveau.');
  const types=kind?[...new Set(entry.rows.filter(i=>kindOf(i)===kind).map(i=>i.exercise_type))]:[];
  if(kind&&!types.length)throw new Error('Deze soort oefening is hier niet beschikbaar.');
  return runtime().normalizeSelection({scope_clauses:[scope(entry,route)],filter_spec:{exercise_type_ids:types,microconstructures:micro?[micro]:[],...(!micro?{free_play_gate:'FREE'}:{}),family_tags:entry.topic.familyTags||[]},distribution_spec:{mode:'equal'}});
 }
 function lessonDuration(seconds){const choices=[30,60,...root.DIGIBORD_CONTENT_CATALOG.durations.map(d=>d.seconds)].filter(n=>n<=Math.min(600,seconds));return choices.length?Math.max(...choices):seconds}
 function prepare(family,topic,route,options={}){
  const entry=find(family,topic),spec=selection(entry,route,options),pool=runtime().selectionPool(spec),engines=runtime().compatibleSelectionEngines(spec,'class');
  if(!pool.length||!engines.length)throw new Error('Kies een andere oefening of een ander oefendoel.');
  const engine=engines.includes('CARDS')?'CARDS':engines[0],seconds=pool.reduce((s,i)=>s+i.estimated_duration_seconds,0);
  if(root.document.querySelector('#settingsOverlay.open'))root.closeSettings();root.ContentUI.loadSelection(spec,{target_duration_seconds:lessonDuration(seconds),organization_mode:'class',preferred_game_engine:engine,preferred_game_variant:root.GameEngineRegistry.get(engine).variants[0]?.id||null},{name:title(entry)});
 }
 // Deliberate topic choices per route. Counts determine availability, never a silent level fallback.
 const recipes={
  A0_A1:{title:'Korte zinnen en eerste reacties',topics:['g-hoofdzin','vertel','vraag']},
  A1_A2:{title:'Vertellen en vragen stellen',topics:['g-vraagwoorden','vertel','vraag']},
  A2_B1:{title:'Redenen geven en iets regelen',topics:['g-reden','kies','regel','gesprek-repareren']},
  B1_B2:{title:'Je mening uitleggen en reageren',topics:['g-zouden','kies','regel','overtuigen-onderhandelen']},
  B2_C1:{title:'Precies formuleren en afwegen',topics:['herformuleren','kies','regel']}
 };
 const mixCache=new Map();
 function startMix(route){
  if(mixCache.has(route))return mixCache.get(route);
  const recipe=recipes[route];if(!recipe)return null;
  const available=entries().filter(e=>e.rows.some(i=>routeOf(i)===route&&!guided(i)));
  const chosen=[];
  for(const family of [root.GrammarCatalog.familyId,'quick','conversation']){
   const preferred=recipe.topics.map(id=>available.find(e=>e.family.id===family&&e.topic.id===id)).filter(Boolean);
   // No arbitrary topic substitution: only reviewed recipe topics are proposed.
   for(const entry of preferred.slice(0,family==='quick'?2:1))if(!chosen.includes(entry))chosen.push(entry);
  }
  if(chosen.length<2)return null;
  const spec=runtime().normalizeSelection({scope_clauses:chosen.map(e=>scope(e,route)),filter_spec:{free_play_gate:'FREE'},distribution_spec:{mode:'equal'}});
  const engines=runtime().compatibleSelectionEngines(spec,'class');if(!engines.length)return null;
  const pool=runtime().selectionPool(spec),seconds=pool.reduce((s,i)=>s+i.estimated_duration_seconds,0),duration=lessonDuration(seconds),engine=engines.includes('CARDS')?'CARDS':engines[0];
  const preview=runtime().selectItems({selectionSpec:spec,targetDurationSeconds:duration,engines:[engine],seed:20261005});
  const mix={route,title:recipe.title,name:'Startmix '+routes().label(route),entries:chosen,spec,engines,pool,count:preview.length,duration,kinds:[...new Set(pool.map(kindOf))].map(id=>kinds().find(k=>k.id===id).label),preferences:{target_duration_seconds:duration,organization_mode:'class',preferred_game_engine:engine,preferred_game_variant:root.GameEngineRegistry.get(engine).variants[0]?.id||null}};mixCache.set(route,mix);return mix;
 }
 function useMix(route){const mix=startMix(route);if(!mix)throw new Error('Voor dit niveau is nog geen passende startmix beschikbaar.');if(root.document.querySelector('#settingsOverlay.open'))root.closeSettings();root.ContentUI.loadSelection(mix.spec,mix.preferences,{name:mix.name})}
 function materials(){
  const data=root.DIGIBORD_DATA;
  const cards=(root.ReleasePolicy.cardKinds||[]).map(id=>{
   const family=data.cardGames.families.find(f=>f.id===id),all=root.cardsFor(id,true);
   return {id,title:family?.title||'Tongbrekers',unit:'kaarten',count:new Set(all.map(c=>c.id)).size,note:'Eigen kaartspel met eigen niveaukeuze.'};
  });
  // Standalone card metadata uses its own gate; never derive it from the current lesson.
  for(const card of cards){const all=root.cardsFor(card.id,true);card.routes=routes().routes.map(r=>{const rows=all.filter(c=>routes().resolve(c.finalRoute||c.route)===r.id);return {label:r.label,total:new Set(rows.map(c=>c.id)).size,free:new Set(rows.filter(c=>c.freePlayGate!=='GUIDED').map(c=>c.id)).size,guided:new Set(rows.filter(c=>c.freePlayGate==='GUIDED').map(c=>c.id)).size}})}
  const sets=Object.values(data.taalworpSets?.sets||{}).filter(s=>s.recordIds?.length),images=data.storydice?.icons||[],collections=(data.storydice?.collections||[]).filter(s=>s.status==='ready');
  return {cards,sets:sets.map(s=>({title:s.title||s.label||s.name,count:s.recordIds?.length||0})),verbs:new Set(sets.flatMap(s=>s.recordIds||[])).size,images:new Set(images.map(i=>i.id)).size,collections:collections.map(s=>({title:s.title||s.label||s.name,count:new Set(images.filter(i=>i.collection===s.id||(s.includeNumbers||[]).includes(i.number)).map(i=>i.id)).size}))};
 }
 function lesson(item){const registry=root.DIGIBORD_CONTENT_GUIDANCE;const b=registry?.bindings?.[item.content_item_id];return b?.item_version===item.version?b.lesson:null}
 function open(filters={},page='tasks'){root.ContentOverview.context={...filters};root.openSettings(page)}
 root.ContentOverview={entries,find,title,kinds,kindOf,routeOf,guided,unique,matching,counts,scope,selection,prepare,startMix,useMix,lesson,materials,open,context:{}};
})(typeof globalThis!=='undefined'?globalThis:this);
