(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports={createContentRuntime:factory};
 else root.ContentRuntime=factory(root.GrammarReview.revise(root.DIGIBORD_CONTENT_VERT001),{familyId:'grammar',previousVersions:[root.DIGIBORD_CONTENT_VERT001,root.GrammarReview.previous(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.references(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.passive(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.existence(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.appearance(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.reporting(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.argument(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.probability(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.expectation(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.certainty(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.deliberation(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.boundary(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.past(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.message(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.inference(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.opinion(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.consequence(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.a2Basis(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.mixed(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.b1Rest(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.zullenA2(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.zullenMix(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.modalBridge(root.DIGIBORD_CONTENT_VERT001),root.GrammarReview.zoudenMix(root.DIGIBORD_CONTENT_VERT001)]});
})(typeof globalThis!=='undefined'?globalThis:this,function(source,options){
 'use strict';
 options=options||{};
 const engineRegistry=globalThis.GameEngineRegistry||(typeof require==='function'?require('./game-engine-registry.js'):null);
 const rendererRegistry=globalThis.InteractionRendererRegistry||(typeof require==='function'?require('./interaction-renderer-registry.js'):null);
 const pairContract=globalThis.MatchPairContract||(typeof require==='function'?require('./match-pair-contract.js'):null);
 const banks=new Map(),byId=new Map(),itemBanks=new Map(),domains=new Map(),itemEntries=new WeakMap(),history=new Map();let active=null;
 const PROFILE=Object.freeze({id:'CONTENT-1.25',version:'3.0',bankId:source?.bank_id,targetDurationSeconds:600,reviewGate:['REVIEW_GO'],publicationGate:options.publicationGate||['staging_only','pilot_only','published'],get engines(){return engineRegistry.contentEngines().map(x=>x.id)}});
 const list=value=>Array.isArray(value)?[...new Set(value.filter(Boolean))]:value?[value]:[];
 const unique=values=>[...new Set(values)].sort();
 const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
 // Integrity fingerprints, not cryptographic signatures (UI002A 42.29).
 function fingerprint(value){let h=2166136261;for(const c of stable(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
 const contentData=item=>Object.fromEntries(Object.entries(item).filter(([key])=>!['revocation_status','review_status','publication_status','rights_status'].includes(key)));
 function fail(code,message){throw Object.assign(new Error(message),{code})}
 function registerBank(bank,metadata={}){
  if(!bank?.bank_id||!Array.isArray(bank.items)||!bank.source_version||banks.has(bank.bank_id))fail('BLOCKED_SCHEMA_VERSION','Ongeldige of dubbele inhoudsbank.');
  if(bank.item_count!==bank.items.length)fail('BLOCKED_SCHEMA_VERSION','Het aantal opdrachten wijkt af van de bron.');
  const ids=new Set();
  for(const item of bank.items){
   if(!item.content_item_id||ids.has(item.content_item_id)||byId.has(item.content_item_id))fail('BLOCKED_SCHEMA_VERSION','Dubbel content_item_id: '+item.content_item_id);
   ids.add(item.content_item_id);
   if(item.content_bank_id!==bank.bank_id||!item.version||!item.topic||!item.cefr_level||!item.language_function||!item.prompt)fail('BLOCKED_SCHEMA_VERSION','Onvolledige opdracht: '+item.content_item_id);
   if(!(metadata.reviewGate||PROFILE.reviewGate).includes(item.review_status))fail('BLOCKED_CONTENT_STATUS','Niet vrijgegeven reviewstatus op '+item.content_item_id);
   if(!['staging_only','pilot_only','published'].includes(item.publication_status))fail('BLOCKED_CONTENT_STATUS','Niet toegestane publicatiestatus op '+item.content_item_id);
   if(!['owned_original','licensed'].includes(item.rights_status))fail('BLOCKED_RIGHTS','Onbekende gebruiksrechten op '+item.content_item_id);
   if(!['gesloten','geleid_gesloten','open','open_geleid'].includes(item.answer_type)||!['basis','midden','hoog'].includes(item.difficulty)||!['productief','receptief'].includes(item.productive_or_receptive))fail('BLOCKED_SCHEMA_VERSION','Ongeldige didactische metadata op '+item.content_item_id);
   if(!/^IT_\d{3}_[A-Z_]+$/.test(item.interaction_type)||!['options','accepted_answers','technical_tags','media_requirements'].every(k=>Array.isArray(item[k])))fail('BLOCKED_SCHEMA_VERSION','Ongeldige interactie op '+item.content_item_id);
   if(item.selection_safety!==true||item.speaking_safety!==true||!(item.estimated_duration_seconds>0))fail('BLOCKED_CONTENT_STATUS','Opdracht is niet vrijgegeven: '+item.content_item_id);
  }
  if(metadata.excludedEngines&&(!Array.isArray(metadata.excludedEngines)||metadata.excludedEngines.some(id=>!engineRegistry.get(id))))fail('BLOCKED_SCHEMA_VERSION','Onbekende spelvorm in inhoudsafspraak.');
  const entry={...metadata,bank,immutableKey:bank.source_sha256||fingerprint(bank.items.map(contentData)),familyId:metadata.familyId||bank.family_id||String(bank.items[0]?.domain||'content').toLowerCase()};
  // Each historical edition needs its own item identity, even when text is shared.
  entry.previousVersions=(metadata.previousVersions||[]).map(previous=>({...previous,items:previous.items.map(item=>({...item}))}));
  banks.set(bank.bank_id,entry);
  for(const item of bank.items){byId.set(item.content_item_id,item);itemBanks.set(item.content_item_id,entry);itemEntries.set(item,entry);for(const key of ['topic','cefr_level','technical_tags','language_function','exercise_type','interaction_type','support_level','oral_or_written']){if(!domains.has(key))domains.set(key,new Set());for(const value of list(item[key]))domains.get(key).add(value)}}
  for(const previous of entry.previousVersions){
   if(previous.bank_id!==bank.bank_id||previous.source_version===bank.source_version||previous.items.length!==bank.items.length)fail('BLOCKED_SCHEMA_VERSION','Ongeldige vorige inhoudsversie.');
   const prior={...entry,bank:previous,immutableKey:previous.source_sha256||fingerprint(previous.items.map(contentData))};
   for(const item of previous.items){
    if(!ids.has(item.content_item_id)||item.content_bank_id!==bank.bank_id)fail('BLOCKED_SCHEMA_VERSION','Vorige versie hoort bij andere opdrachten.');
    itemEntries.set(item,prior);const ref=contentRef(item);
    if(history.has(ref.immutable_version_ref))fail('BLOCKED_SCHEMA_VERSION','Dubbele vorige inhoudsversie.');
    history.set(ref.immutable_version_ref,item);
   }
  }
  return entry;
 }
 registerBank(source,{familyId:options.familyId,previousVersions:options.previousVersions});
 const items=()=>[...byId.values()];
 const values=key=>[...(domains.get(key)||[])].sort();
 function normalizeFilters(filters={}){
  const fields={topics:'topic',levels:'cefr_level',family_tags:'technical_tags',language_functions:'language_function',exercise_types:'exercise_type',interaction_types:'interaction_type',support_levels:'support_level',oral_or_written:'oral_or_written'};
  const f={};for(const [key,field] of Object.entries(fields)){
   f[key]=list(filters[key]);const known=values(field);
   if(f[key].some(x=>!known.includes(x)))fail('BLOCKED_CONTENT_STATUS','Ongeldig '+({topics:'onderwerp',levels:'niveau',family_tags:'contentfamilietag',language_functions:'functie',exercise_types:'oefenvorm'}[key]||key)+' in contentselectie.');
  }
  f.bank_ids=list(filters.bank_ids);f.family_ids=list(filters.family_ids);
  if(f.bank_ids.some(id=>!banks.has(id))||f.family_ids.some(id=>![...banks.values()].some(b=>b.familyId===id)))fail('BLOCKED_MISSING_REFERENCE','Deze inhoudsbank of familie is niet beschikbaar.');
  f.productive_or_receptive=filters.productive_or_receptive??'all';f.difficulty=filters.difficulty??'all';
  if(!['all','productief','receptief'].includes(f.productive_or_receptive)||!['all','basis','midden','hoog'].includes(f.difficulty))fail('BLOCKED_SCHEMA_VERSION','Ongeldige productievorm of moeilijkheid in contentselectie.');
  if(globalThis.ReleasePolicy?.enabled){
   const available=items().filter(i=>globalThis.ReleasePolicy.bankAllowed(itemBanks.get(i.content_item_id).bank));
   if(f.bank_ids.some(id=>!available.some(i=>i.content_bank_id===id))||f.family_ids.some(id=>!available.some(i=>itemBanks.get(i.content_item_id).familyId===id))||f.topics.some(id=>!available.some(i=>i.topic===id)))fail('BLOCKED_CONTENT_STATUS',globalThis.ReleasePolicy.message);
  }
  return Object.freeze(f);
 }
 function eligible(item){return (!globalThis.ReleasePolicy||globalThis.ReleasePolicy.bankAllowed(itemBanks.get(item.content_item_id).bank))&&(itemBanks.get(item.content_item_id).reviewGate||PROFILE.reviewGate).includes(item.review_status)&&PROFILE.publicationGate.includes(item.publication_status)&&['owned_original','licensed'].includes(item.rights_status)&&!['SOFT_DEPRECATED','HARD_REVOKED'].includes(item.revocation_status)}
 function matches(item,f){
  return (!f.topics.length||f.topics.includes(item.topic))&&(!f.levels.length||f.levels.includes(item.cefr_level))&&(!f.bank_ids.length||f.bank_ids.includes(item.content_bank_id))&&(!f.family_ids.length||f.family_ids.includes(itemBanks.get(item.content_item_id).familyId))&&
   (!f.family_tags.length||f.family_tags.every(t=>item.technical_tags.includes(t)))&&(!f.language_functions.length||f.language_functions.includes(item.language_function))&&(!f.exercise_types.length||f.exercise_types.includes(item.exercise_type))&&(!f.interaction_types.length||f.interaction_types.includes(item.interaction_type))&&(!f.support_levels.length||f.support_levels.includes(item.support_level))&&(!f.oral_or_written.length||f.oral_or_written.includes(item.oral_or_written))&&
   (f.productive_or_receptive==='all'||f.productive_or_receptive===item.productive_or_receptive)&&(f.difficulty==='all'||f.difficulty===item.difficulty);
 }
 function filterSource(filters={}){const f=normalizeFilters(filters);return items().filter(item=>eligible(item)&&matches(item,f))}
 // Suitability limits new lessons; stored sessions retain their technical playability.
 function compatibility(item,engine,historical=false){
  if(!historical&&itemBanks.get(item.content_item_id)?.excludedEngines?.includes(engine))return {compatible:false,reason:'not_suitable_for_lesson',mode:'NOT_COMPATIBLE',renderer:null,adapter:null};
  if(['MATCH','MEMORY'].includes(engine)){
   const result=pairContract?.candidate(item);return {compatible:!!result?.safe,reason:result?.reason||'pair_missing',mode:result?.safe?'COMPATIBLE_WITH_ADAPTER':'NOT_COMPATIBLE',renderer:'MATCH',adapter:'source_pair'};
  }
  if(engine==='RIDDLE'){const safe=Array.isArray(item.clues)&&item.clues.length>=2&&new Set(item.clues).size===item.clues.length&&!!item.riddle_word;return {compatible:safe,reason:safe?'source_clues':'clues_missing',mode:safe?'COMPATIBLE_WITH_ADAPTER':'NOT_COMPATIBLE',renderer:'OPEN_PROMPT',adapter:'source_clues'}}
  if(engine==='SORT'){
   const safe=item.exercise_type==='functie_sorteren'&&item.interaction_type==='IT_017_IDENTIFY'&&item.options.length>=2&&new Set(item.options).size===item.options.length&&item.options.includes(item.correct_answer);
   return {compatible:safe,reason:safe?'canonical_categories':'categories_missing',mode:safe?'COMPATIBLE_WITH_ADAPTER':'NOT_COMPATIBLE',renderer:'SORT',adapter:'canonical_categories'};
  }
  return rendererRegistry.compatibility(item,engine);
 }
 function setCompatibility(pool,engine,historical=false){
  if(!pool.length||pool.some(item=>!compatibility(item,engine,historical).compatible))return false;
  if(['MATCH','MEMORY'].includes(engine)){try{const audit=pairContract.audit(pool);return audit.safe_count===pool.length&&audit.safe_count>=2}catch{return false}}
  return true;
 }
 const currentEngines=()=>engineRegistry.contentEngines().map(x=>x.id);
 function eligibleItems(engines=null,filters={}){const pool=filterSource(filters),chosen=engines||currentEngines();return pool.filter(item=>chosen.every(engine=>compatibility(item,engine).compatible))}
 function availability(filters={},engines=currentEngines()){
  const filtered=filterSource(filters),sum=pool=>pool.reduce((n,i)=>n+i.estimated_duration_seconds,0);
  const full=engines.filter(engine=>setCompatibility(filtered,engine)),common=eligibleItems(full,filters);
  return {source_count:filtered.length,source_duration_seconds:sum(filtered),common_count:full.length?common.length:0,common_duration_seconds:full.length?sum(common):0,engines:Object.fromEntries(engines.map(engine=>{const pool=filtered.filter(item=>compatibility(item,engine).compatible);return[engine,{count:pool.length,duration_seconds:sum(pool),full_coverage:setCompatibility(filtered,engine),adapter_count:pool.filter(item=>compatibility(item,engine).mode==='COMPATIBLE_WITH_ADAPTER').length}]}))};
 }
 function fullCoverageEngines(filters={},organizationMode='class'){const pool=filterSource(filters);return currentEngines().filter(engine=>engineRegistry.supportsOrganization(engine,organizationMode)&&setCompatibility(pool,engine))}
 function rng(seed){let state=(Number(seed)||1)>>>0;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296}}
 function shuffle(input,random){const out=[...input];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function normalizeSelection(spec){
  if(!spec||!Array.isArray(spec.scope_clauses)||!spec.scope_clauses.length)fail('BLOCKED_SCHEMA_VERSION','Kies minimaal één onderwerp.');
  const scopes=spec.scope_clauses.map((s,i)=>({scope_id:s.scope_id||'scope-'+i,content_family_id:s.content_family_id||null,content_bank_ids:list(s.content_bank_ids),topic_ids:list(s.topic_ids),cefr_levels:list(s.cefr_levels),subtopic_ids:list(s.subtopic_ids),interaction_type_ids:list(s.interaction_type_ids),weight:s.weight??1,...Object.fromEntries(['minimum_items','maximum_items','minimum_duration_seconds','maximum_duration_seconds'].filter(k=>s[k]!==undefined).map(k=>[k,s[k]]))}));
  if(new Set(scopes.map(s=>s.scope_id)).size!==scopes.length||scopes.some(s=>!Number.isFinite(s.weight)||s.weight<=0))fail('BLOCKED_SCHEMA_VERSION','Ongeldige mixverdeling.');
  for(const s of scopes)for(const k of ['minimum_items','maximum_items','minimum_duration_seconds','maximum_duration_seconds'])if(s[k]!==undefined&&(!Number.isInteger(s[k])||s[k]<0))fail('BLOCKED_SCHEMA_VERSION','Ongeldige selectiegrens.');
  const filter=spec.filter_spec||{},distribution=spec.distribution_spec||{mode:'equal'};
  const filterKeys=['production_mode','difficulty','support_level','oral_or_written','exercise_type_ids','family_tags'];
  if(Object.keys(filter).some(k=>!filterKeys.includes(k)))fail('BLOCKED_SCHEMA_VERSION','Deze selectiefilter wordt nog niet ondersteund.');
  if(Object.keys(distribution).some(k=>k!=='mode'))fail('BLOCKED_SCHEMA_VERSION','Deze verdelingsregel wordt nog niet ondersteund.');
  for(const scope of scopes){if(scope.minimum_items>(scope.maximum_items??Infinity)||scope.minimum_duration_seconds>(scope.maximum_duration_seconds??Infinity))fail('BLOCKED_CAPACITY','De minimale verdeling is groter dan het maximum.');}

  if(!['equal','weighted'].includes(distribution.mode||'equal'))fail('BLOCKED_SCHEMA_VERSION','Deze verdeling wordt nog niet ondersteund.');
  if(spec.compatibility_policy&&spec.compatibility_policy!=='compatible_only')fail('BLOCKED_COMPATIBILITY','Onbekend geschiktheidsbeleid.');
  return {scope_clauses:scopes,filter_spec:{...filter},distribution_spec:{...distribution,mode:distribution.mode||'equal'},compatibility_policy:'compatible_only'};
 }
 // Saved choices follow an unambiguous level revision; exact sessions keep their references.
 function currentSelection(input){
  const spec=normalizeSelection(input);
  for(const scope of spec.scope_clauses){
   const filters=normalizeFilters({...filtersForScope(scope,spec),levels:[]});
   scope.cefr_levels=unique(scope.cefr_levels.flatMap(level=>{
    if(items().some(i=>eligible(i)&&matches(i,filters)&&i.cefr_level===level))return [level];
    const previous=[...history.values()].filter(i=>i.cefr_level===level&&matches(i,filters));
    const levels=unique(previous.map(i=>byId.get(i.content_item_id)?.cefr_level).filter(Boolean));
    return previous.length&&levels.length===1?levels:[level];
   }));
  }
  return spec;
 }
 function filtersForScope(scope,spec){const f=spec.filter_spec;return {family_ids:scope.content_family_id?[scope.content_family_id]:[],bank_ids:scope.content_bank_ids,topics:scope.topic_ids,levels:scope.cefr_levels,language_functions:scope.subtopic_ids,interaction_types:scope.interaction_type_ids,exercise_types:f.exercise_type_ids||[],family_tags:f.family_tags||[],productive_or_receptive:f.production_mode||'all',difficulty:f.difficulty||'all',support_levels:f.support_level?list(f.support_level):[],oral_or_written:f.oral_or_written?list(f.oral_or_written):[]}}
 function specFromFilters(filters){const f=normalizeFilters(filters);return normalizeSelection({scope_clauses:[{scope_id:'selection',content_family_id:f.family_ids[0]||null,content_bank_ids:f.bank_ids,topic_ids:f.topics,cefr_levels:f.levels,subtopic_ids:f.language_functions,interaction_type_ids:f.interaction_types}],filter_spec:{exercise_type_ids:f.exercise_types,family_tags:f.family_tags,production_mode:f.productive_or_receptive,difficulty:f.difficulty},distribution_spec:{mode:'equal'}})}
 function scopePools(spec){return spec.scope_clauses.map(scope=>({scope,pool:filterSource(filtersForScope(scope,spec))}))}
 function selectionPool(spec){return [...new Map(scopePools(normalizeSelection(spec)).flatMap(s=>s.pool.map(i=>[i.content_item_id,i]))).values()]}
 function compatibleSelectionEngines(spec,mode){const pool=selectionPool(spec);return currentEngines().filter(e=>engineRegistry.supportsOrganization(e,mode)&&setCompatibility(pool,e))}
 function selectItems({seed=20260922,targetDurationSeconds=600,engines=null,filters={},selectionSpec=null,recentItemIds=[]}={}){
  const spec=selectionSpec?normalizeSelection(selectionSpec):specFromFilters(filters),scopes=scopePools(spec),pool=selectionPool(spec),chosen=engines||currentEngines().filter(e=>setCompatibility(pool,e));
  if(!pool.length)fail('BLOCKED_CAPACITY','Geen compatibele content voor deze selectie.');
  if(scopes.some(s=>!s.pool.length))fail('BLOCKED_CAPACITY','Een gekozen onderwerp bevat geen passende opdrachten.');
  if(!chosen.length||chosen.some(e=>!setCompatibility(pool,e)))fail('BLOCKED_COMPATIBILITY','Spelvorm dekt niet de volledige gekozen contentselectie.');
  if(!Array.isArray(recentItemIds)||recentItemIds.some(id=>typeof id!=='string'))fail('BLOCKED_SCHEMA_VERSION','Ongeldige recente opdrachten.');
  let buckets=[];
  const random=rng(seed),recency=new Map(recentItemIds.map((id,i)=>[id,i]));
  for(const {scope,pool:scopePool} of scopes){for(const fn of unique(scopePool.map(i=>i.language_function)))buckets.push({scope,fn,items:shuffle(scopePool.filter(i=>i.language_function===fn),random).sort((a,b)=>(recency.get(a.content_item_id)??-1)-(recency.get(b.content_item_id)??-1)),count:0})}
  buckets=shuffle(buckets,random);
  const practiceKey=i=>i.practice_group||i.content_item_id,practiceCounts=new Map();
  const selected=[],used=new Set(),counts=new Map(scopes.map(s=>[s.scope.scope_id,{count:0,duration:0}]));let total=0;
  const minimumMet=()=>scopes.every(({scope})=>{const s=counts.get(scope.scope_id);return s.count>=Math.max(1,scope.minimum_items||0)&&s.duration>=(scope.minimum_duration_seconds||0)});
  const permitted=item=>!used.has(item.content_item_id)&&scopes.every(entry=>{if(!entry.pool.includes(item))return true;const c=counts.get(entry.scope.scope_id);return c.count<(entry.scope.maximum_items??Infinity)&&c.duration+item.estimated_duration_seconds<=(entry.scope.maximum_duration_seconds??Infinity)});
  while(total<targetDurationSeconds||!minimumMet()){
   for(const b of buckets)b.items.sort((a,b)=>Number(recency.has(a.content_item_id))-Number(recency.has(b.content_item_id))||(practiceCounts.get(practiceKey(a))||0)-(practiceCounts.get(practiceKey(b))||0)||(recency.get(a.content_item_id)??-1)-(recency.get(b.content_item_id)??-1));
   const available=buckets.filter(b=>b.items.some(permitted));
   if(!available.length)break;
   available.sort((a,b)=>{const x=counts.get(a.scope.scope_id),y=counts.get(b.scope.scope_id);const need=(c,bucket)=>c.count<Math.max(1,bucket.scope.minimum_items||0)||c.duration<(bucket.scope.minimum_duration_seconds||0);return Number(need(y,b))-Number(need(x,a))||(x.count/(spec.distribution_spec.mode==='weighted'?a.scope.weight:1))-(y.count/(spec.distribution_spec.mode==='weighted'?b.scope.weight:1))||(practiceCounts.get(practiceKey(a.items.find(permitted)))||0)-(practiceCounts.get(practiceKey(b.items.find(permitted)))||0)||(recency.get(a.items.find(permitted).content_item_id)??-1)-(recency.get(b.items.find(permitted).content_item_id)??-1)||a.count-b.count});
   const b=available[0],item=b.items.find(permitted);
   selected.push(item);used.add(item.content_item_id);practiceCounts.set(practiceKey(item),(practiceCounts.get(practiceKey(item))||0)+1);total+=item.estimated_duration_seconds;
   // An overlapping item counts once, but satisfies each matching scope's coverage.
   for(const bucket of buckets)if(bucket.items.includes(item))bucket.count++;
   for(const entry of scopes)if(entry.pool.includes(item)){const c=counts.get(entry.scope.scope_id);c.count++;c.duration+=item.estimated_duration_seconds}
  }
  if(total<targetDurationSeconds||!minimumMet())fail('BLOCKED_CAPACITY','Onvoldoende content voor de gekozen tijdsduur of verdeling. Maak de selectie ruimer of kies een kortere duur.');
  return selected;
 }
 function contentRef(item){const entry=itemEntries.get(item),bank=entry.bank;return {content_item_id:item.content_item_id,content_item_version:item.version,content_bank_id:item.content_bank_id,source_version:bank.source_version,immutable_version_ref:bank.bank_id+'@'+entry.immutableKey+'/'+item.content_item_id+'@'+item.version,content_hash:fingerprint(contentData(item))}}
 function itemByRef(ref){
  const current=byId.get(ref.content_item_id),item=current&&stable(contentRef(current))===stable(ref)?current:history.get(ref.immutable_version_ref);
  if(!item||stable(contentRef(item))!==stable(ref))fail('BLOCKED_VERSION_UNAVAILABLE','Deze oude inhoudsversie is niet beschikbaar.');
  return item;
 }
 function itemForSession(id,session=active){const ref=session?.selected_content_refs?.find(r=>r.content_item_id===id);return ref?itemByRef(ref):byId.get(id)||null}
 function validateContentRefs(refs,{historical=false}={}){
  if(!Array.isArray(refs)||!refs.length)fail('BLOCKED_MISSING_REFERENCE','Opdrachten ontbreken.');
  for(const ref of refs){const item=itemByRef(ref),current=byId.get(ref.content_item_id);
   if(globalThis.ReleasePolicy?.enabled&&(!globalThis.ReleasePolicy.bankAllowed(itemBanks.get(item.content_item_id).bank)||item.version!==current?.version))fail('BLOCKED_CONTENT_STATUS',globalThis.ReleasePolicy.message);
   if([item,current].some(i=>!i||i.revocation_status==='HARD_REVOKED'||!['owned_original','licensed'].includes(i.rights_status)))fail('BLOCKED_RIGHTS','Een onderdeel uit deze sessie is ingetrokken.');
   if(!historical&&(item!==current||!eligible(item)))fail('BLOCKED_CONTENT_STATUS','Een onderdeel is niet beschikbaar voor een nieuwe sessie.');
  }return true;
 }
 const newSessionId=()=> 'CONTENT-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
 function createSession({seed=20260922,targetDurationSeconds=600,engines=null,filters={},selectionSpec=null,organizationMode='class',selectedGameEngine=null,selectedGameVariant=null,startedAt=null,selectionTopic=null,recentItemIds=[]}={}){
  if(!['class','groups','pairs','individual'].includes(organizationMode))fail('BLOCKED_SCHEMA_VERSION','Ongeldige organisatievorm in contentselectie.');
  if(!Number.isFinite(Number(targetDurationSeconds))||Number(targetDurationSeconds)<=0)fail('BLOCKED_SCHEMA_VERSION','Ongeldige tijdsduur in contentselectie.');
  const f=normalizeFilters(filters),spec=selectionSpec?normalizeSelection(selectionSpec):specFromFilters(f),pool=selectionPool(spec),resolved=engines||compatibleSelectionEngines(spec,organizationMode);
  if(!resolved.length||resolved.some(e=>!setCompatibility(pool,e)))fail('BLOCKED_COMPATIBILITY','Geen spelvorm ondersteunt de volledige gekozen contentselectie.');
  if(resolved.some(e=>!engineRegistry.supportsOrganization(e,organizationMode)))fail('BLOCKED_COMPATIBILITY','Spelvorm ondersteunt deze organisatievorm niet.');
  if(selectedGameEngine&&!resolved.includes(selectedGameEngine))fail('BLOCKED_COMPATIBILITY','De gekozen spelvorm past niet bij deze selectie.');
  if(selectedGameVariant&&!engineRegistry.get(selectedGameEngine)?.variants.some(v=>v.id===selectedGameVariant))fail('BLOCKED_COMPATIBILITY','De gekozen spelvariant is niet beschikbaar.');
  const selected=selectItems({seed,targetDurationSeconds:Number(targetDurationSeconds),engines:resolved,filters:f,selectionSpec:spec,recentItemIds}),bankIds=unique(selected.map(i=>i.content_bank_id)),topics=unique(selected.map(i=>i.topic)),levels=unique(selected.map(i=>i.cefr_level)),families=unique(selected.map(i=>itemBanks.get(i.content_item_id).familyId));
  const topic=selectionTopic|| (topics.length===1?topics[0]:'MIX'),level=levels.length===1?levels[0]:'MIX',sources=Object.fromEntries(bankIds.map(id=>{const b=banks.get(id).bank;return[id,{drive_id:b.source_drive_id,source_sha256:b.source_sha256,qa_id:b.qa_id,version:b.source_version}]}));
  return Object.freeze({schema_version:2,wheel_draw_version:2,session_id:newSessionId(),selection_profile_id:'SP_'+families.join('_').toUpperCase()+'_'+topic+'_'+level,selection_profile_version:PROFILE.version,adapter_version:banks.get(bankIds[0]).bank.adapter_version||'1.0',adapter_versions:Object.fromEntries(bankIds.map(id=>[id,banks.get(id).bank.adapter_version||'1.0'])),content_bank_id:bankIds.length===1?bankIds[0]:'MIX',content_bank_ids:bankIds,content_family:families.length===1?families[0]:'mix',topic,topic_ids:topics,cefr_level:level,cefr_levels:levels,filters:f,normalized_selection_spec:spec,organization_mode:organizationMode,selected_game_engine:selectedGameEngine,selected_game_variant:selectedGameVariant,game_engines:[...resolved],game_engine_versions:Object.fromEntries(resolved.map(e=>[e,engineRegistry.get(e).version])),selected_item_ids:selected.map(i=>i.content_item_id),selected_content_refs:selected.map(contentRef),selection_seed:seed,target_duration_seconds:Number(targetDurationSeconds),actual_estimated_duration_seconds:selected.reduce((s,i)=>s+i.estimated_duration_seconds,0),review_gate:unique(selected.map(i=>i.review_status)),publication_gate:[...PROFILE.publicationGate],rights_gate:['owned_original','licensed'],content_source:sources[bankIds[0]],content_source_versions:sources,started_at:startedAt||new Date().toISOString()});
 }
 function restoreSession(config){
  if(!config?.selected_item_ids?.length||!Array.isArray(config.game_engines))fail('BLOCKED_SCHEMA_VERSION','Ongeldige opgeslagen sessie.');
  let refs=config.selected_content_refs;
  if(!refs){const entry=banks.get(config.content_bank_id),bank=[entry?.bank,...(entry?.previousVersions||[])].find(b=>b&&config.content_source?.version===b.source_version&&config.content_source?.source_sha256===b.source_sha256);if(!bank)fail('BLOCKED_VERSION_UNAVAILABLE','De oorspronkelijke inhoudsversie ontbreekt.');refs=config.selected_item_ids.map(id=>{const i=bank.items.find(item=>item.content_item_id===id);if(!i)fail('BLOCKED_VERSION_UNAVAILABLE','Een oorspronkelijke opdracht ontbreekt.');return contentRef(i)})}
  validateContentRefs(refs,{historical:true});
  if(stable(refs.map(r=>r.content_item_id))!==stable(config.selected_item_ids))fail('BLOCKED_SCHEMA_VERSION','De opgeslagen inhoudsverwijzingen wijken af.');
  for(const engine of config.game_engines)if(!engineRegistry.supportsOrganization(engine,config.organization_mode)||!setCompatibility(refs.map(itemByRef),engine,true))fail('BLOCKED_COMPATIBILITY','De opgeslagen spelvorm kan deze sessie niet uitvoeren.');
  active=Object.freeze({...config,selected_content_refs:refs});return active;
 }
 function enginePool(engine,session){
  if(!session?.game_engines.includes(engine))fail('BLOCKED_COMPATIBILITY','Engine niet opgenomen in SessionConfig: '+engine);
  if(session.selected_content_refs)validateContentRefs(session.selected_content_refs,{historical:true});
  const pool=session.selected_item_ids.map(id=>{const item=itemForSession(id,session);if(!item)fail('BLOCKED_VERSION_UNAVAILABLE','Ontbrekend content_item_id: '+id);return item});
  if(!setCompatibility(pool,engine,true))fail('BLOCKED_COMPATIBILITY','Incompatibele inhoud voor '+engine);return pool;
 }
 function answerPolicy(item){const open=['open','open_geleid'].includes(item.openness)||['open','open_geleid'].includes(item.answer_type);return {mode:open?'teacher_or_peer_review':'canonical_answer',requiresExactMatch:false,canonicalAnswer:open?null:item.correct_answer,modelAnswer:item.model_answer,modelIsExample:open}}
 function displayPrompt(item){
  if(!item.order_tokens?.length)return item.prompt;
  const tokens=shuffle(item.order_tokens,rng(parseInt(fingerprint(item.content_item_id),16)));
  if(tokens.join('|')===item.order_tokens.join('|'))tokens.push(tokens.shift());
  return item.prompt.slice(0,item.prompt.indexOf(':')+1)+' '+tokens.join(' | ');
 }
 function project(engine,item){const check=compatibility(item,engine,true);if(!check.compatible)fail('BLOCKED_COMPATIBILITY','Niet compatibel: '+item.content_item_id+' voor '+engine);const part=String(item.prompt).slice(String(item.prompt).lastIndexOf(':')+1);return {engine,contentItemId:item.content_item_id,sourceItem:item,prompt:displayPrompt(item),options:item.options,interactionType:item.interaction_type,renderer:check.renderer,compatibility:check,adapter:check.adapter,orderTokens:item.order_tokens|| (check.adapter==='text_order'?part.split('/').map(x=>x.trim()).filter(Boolean):[]),orderExpectedTokens:item.expected_tokens||(check.adapter==='text_order'?String(item.correct_answer).trim().replace(/[.!?]+$/,'').split(/\s+/):[]),pair:['MATCH','MEMORY'].includes(engine)?pairContract.candidate(item).pair:null,answerPolicy:answerPolicy(item)}}
 function nextItem(engine,session,usedIds=[]){const pool=enginePool(engine,session),used=new Set(usedIds);return pool.find(i=>!used.has(i.content_item_id))||pool[0]||null}
 return Object.freeze({PROFILE,get ENGINE_VERSIONS(){return Object.fromEntries(currentEngines().map(e=>[e,engineRegistry.get(e).version]))},get TOPICS(){return values('topic')},get LEVELS(){return values('cefr_level')},get FUNCTIONS(){return values('language_function')},source,registerBank,itemForSession,banks:()=>[...banks.values()],items,compatibility,setCompatibility,normalizeFilters,filterSource,eligibleItems,availability,fullCoverageEngines,selectItems,normalizeSelection,currentSelection,specFromFilters,selectionPool,compatibleSelectionEngines,createSession,restoreSession,enginePool,answerPolicy,displayPrompt,project,nextItem,activateSession:o=>(active=createSession(o)),activeSession:()=>active,clearSession:()=>{active=null},itemById:id=>byId.get(id)||null,contentRef,validateContentRefs,newSessionId,fingerprint,stable,fail});
});
