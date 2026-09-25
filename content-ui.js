(function(root){
 'use strict';
 const catalog=root.DIGIBORD_CONTENT_CATALOG,engineRegistry=root.GameEngineRegistry;
 if(!catalog||!root.ContentRuntime||!engineRegistry)return;
 function registerBank(bank,metadata){const original=bank;bank=root.ConversationReview?.revise(bank)||bank;if(bank!==original){const prior=root.ConversationReview.revise(original,true);metadata={...metadata,previousVersions:[original,prior]};ContentGuidance.registerHistorical(original);ContentGuidance.registerHistorical(prior)}ContentRuntime.registerBank(bank,metadata);catalog.registerBank(bank,metadata);if(bank.guidance)ContentGuidance.register(bank.guidance);if(root.ContentUI){topicIndex=null;gameChoices.clear()}}
 registerBank(ContentBankAdapters(WORD_CONTENT),{familyId:'words',label:'Woorden en zinnen',defaultDifficulty:'basis',description:'Begin met een korte zin en voeg daarna meer informatie toe.'});
 registerBank(root.WZ_PB003,{familyId:'words',excludedEngines:['DICE','MATCH','MEMORY','SORT']});
 registerBank(root.WZ_PB004,{familyId:'words',excludedEngines:['DICE','MATCH','MEMORY','SORT']});
 registerBank(root.WZ_PB005,{familyId:'words',excludedEngines:['DICE','MATCH','MEMORY','SORT']});
 registerBank(ContentBankAdapters(root.WZ_PB002),{familyId:'words',excludedEngines:['DICE']});
 registerBank(ContentBankAdapters.riddles(DIGIBORD_ACTIVITIES),{familyId:'riddles',label:'Woordraadsels',description:'Bestaande woordraadsels zonder vastgesteld taalniveau. De docent kiest wat past.',reviewGate:['LEGACY_PRESERVED'],selection_dimensions:{topic:'required',level:'required',production:'not_applicable',difficulty:'not_applicable'}});
 registerBank(root.CONNECTIONS_PILOT,{familyId:'connections',label:'Zinnen verbinden',excludedEngines:['DICE'],description:'Proefles B2 · Oorzaak en gevolg. Samen beoordelen voordat we uitbreiden.',reviewGate:['PILOT_REVIEW']});
 registerBank(root.DIGIBORD_NUANCE,{familyId:'conversation',label:'Taal in gesprekken',excludedEngines:['DICE','QUIZ','MATCH','MEMORY'],description:'Betekenis van woorden en passende toon. Bespreek je keuze samen.'});
 registerBank(root.DIGIBORD_WORKPLACE,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_MEETING,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_IMPLICIT,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_HUMOR,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_CONNOTATION,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_REPHRASE,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_REPAIR,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_MEDIATION,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_PERSUASION,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.GRAM_PB002,{familyId:'grammar',excludedEngines:['DICE','MATCH','MEMORY','SORT']});
 registerBank(root.GRAM_PB003,{familyId:'grammar',excludedEngines:['DICE','MATCH','MEMORY','SORT']});
 registerBank(root.DIGIBORD_BETWEEN_LINES,{familyId:'conversation',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE']});
 registerBank(root.DIGIBORD_MR03,{familyId:'reading',label:'Teksten begrijpen',description:'Leg verbanden uit en bespreek wat de tekst wel en niet bewijst.',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']});
 ContentGuidance.registerHistorical(root.DIGIBORD_QUICK);
 const quickPrevious=root.QuickReview.revise(root.DIGIBORD_QUICK);
 ContentGuidance.registerHistorical(quickPrevious);
 const quickTellPrevious=root.QuickTellReview.revise(quickPrevious);
 ContentGuidance.registerHistorical(quickTellPrevious);
 const quickTellNextPrevious=root.QuickTellNextReview.revise(quickTellPrevious);
 ContentGuidance.registerHistorical(quickTellNextPrevious);
 const quickTellSituationsPrevious=root.QuickTellSituationsReview.revise(quickTellNextPrevious);
 ContentGuidance.registerHistorical(quickTellSituationsPrevious);
 const quickTellExplainPrevious=root.QuickTellExplainReview.revise(quickTellSituationsPrevious);
 ContentGuidance.registerHistorical(quickTellExplainPrevious);
 const quickTellFinalPrevious=root.QuickTellFinalReview.revise(quickTellExplainPrevious);
 ContentGuidance.registerHistorical(quickTellFinalPrevious);
 const quickAskPrevious=root.QuickAskReview.revise(quickTellFinalPrevious);
 ContentGuidance.registerHistorical(quickAskPrevious);
 const quickAskNextPrevious=root.QuickAskNextReview.revise(quickAskPrevious);
 ContentGuidance.registerHistorical(quickAskNextPrevious);
 const quickAskSituationsPrevious=root.QuickAskSituationsReview.revise(quickAskNextPrevious);
 ContentGuidance.registerHistorical(quickAskSituationsPrevious);
 const quickAskExplainPrevious=root.QuickAskExplainReview.revise(quickAskSituationsPrevious);
 ContentGuidance.registerHistorical(quickAskExplainPrevious);
 const quickAskFinalPrevious=root.QuickAskFinalReview.revise(quickAskExplainPrevious);
 ContentGuidance.registerHistorical(quickAskFinalPrevious);
 const quickChoosePrevious=root.QuickChooseReview.revise(quickAskFinalPrevious);
 ContentGuidance.registerHistorical(quickChoosePrevious);
 const quickChooseNextPrevious=root.QuickChooseNextReview.revise(quickChoosePrevious);
 ContentGuidance.registerHistorical(quickChooseNextPrevious);
 const quickChooseSituationsPrevious=root.QuickChooseSituationsReview.revise(quickChooseNextPrevious);
 ContentGuidance.registerHistorical(quickChooseSituationsPrevious);
 const quickChooseExplainPrevious=root.QuickChooseExplainReview.revise(quickChooseSituationsPrevious);
 ContentGuidance.registerHistorical(quickChooseExplainPrevious);
 const quickChooseFinalPrevious=root.QuickChooseFinalReview.revise(quickChooseExplainPrevious);
 ContentGuidance.registerHistorical(quickChooseFinalPrevious);
 const quickArrangePrevious=root.QuickArrangeReview.revise(quickChooseFinalPrevious);
 ContentGuidance.registerHistorical(quickArrangePrevious);
 const quickArrangeNextPrevious=root.QuickArrangeNextReview.revise(quickArrangePrevious);
 ContentGuidance.registerHistorical(quickArrangeNextPrevious);
 const quickArrangeSituationsPrevious=root.QuickArrangeSituationsReview.revise(quickArrangeNextPrevious);
 ContentGuidance.registerHistorical(quickArrangeSituationsPrevious);
 const quickArrangeExplainPrevious=root.QuickArrangeExplainReview.revise(quickArrangeSituationsPrevious);
 ContentGuidance.registerHistorical(quickArrangeExplainPrevious);
 const quickArrangeBalancePrevious=root.QuickArrangeBalanceReview.revise(quickArrangeExplainPrevious);
 ContentGuidance.registerHistorical(quickArrangeBalancePrevious);
 registerBank(root.QuickArrangeFinalReview.revise(quickArrangeBalancePrevious),{previousVersions:[root.DIGIBORD_QUICK,quickPrevious,quickTellPrevious,quickTellNextPrevious,quickTellSituationsPrevious,quickTellExplainPrevious,quickTellFinalPrevious,quickAskPrevious,quickAskNextPrevious,quickAskSituationsPrevious,quickAskExplainPrevious,quickAskFinalPrevious,quickChoosePrevious,quickChooseNextPrevious,quickChooseSituationsPrevious,quickChooseExplainPrevious,quickChooseFinalPrevious,quickArrangePrevious,quickArrangeNextPrevious,quickArrangeSituationsPrevious,quickArrangeExplainPrevious,quickArrangeBalancePrevious],familyId:'quick',label:'Snelvragen',description:'Geef antwoord, vertel iets, stel een vraag of maak een afspraak. Kies zelf de oefening.',excludedEngines:['DICE','QUIZ','MATCH','MEMORY','SORT','SEQUENCE','RIDDLE']});
 ContentGuidance.registerHistorical(root.DIGIBORD_CONTENT_VERT001);
 ContentGuidance.registerHistorical(root.GrammarReview.previous(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.references(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.passive(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.existence(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.appearance(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.reporting(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.argument(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.probability(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.expectation(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.certainty(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.deliberation(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.boundary(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.past(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.message(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.inference(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.opinion(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.consequence(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.a2Basis(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.mixed(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.b1Rest(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.zullenA2(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.zullenMix(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.modalBridge(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.registerHistorical(root.GrammarReview.zoudenMix(root.DIGIBORD_CONTENT_VERT001));
 ContentGuidance.complete(ContentRuntime.items());
 catalog.families.find(f=>f.id==='grammar').topics.push({id:'MODAAL_ALLES',label:'Mix: alle modale werkwoorden',sourceTopics:['KUNNEN','MOETEN','MOGEN','WILLEN','HOEVEN','ZULLEN','ZOUDEN'],familyTags:['MODAAL'],levels:['A1','A2','B1','B2'],profiles:[],subtopics:[{id:'all',label:'Alles',levels:['A1','A2','B1','B2']}]});
 if(root.ReleasePolicy?.enabled){
  const available=ContentRuntime.filterSource(),families=new Map(ContentRuntime.banks().map(b=>[b.bank.bank_id,b.familyId]));
  catalog.families=catalog.families.map(f=>({...f,topics:f.topics.filter(t=>t.id!=='MODAAL_ALLES').map(t=>{
   const rows=available.filter(i=>families.get(i.content_bank_id)===f.id&&(t.sourceTopics||[t.id]).includes(i.topic)&&(t.familyTags||[]).every(tag=>i.technical_tags.includes(tag)));
   return {...t,levels:[...new Set(rows.map(i=>i.cefr_level))].sort(),subtopics:t.subtopics.filter(s=>s.id==='all'||rows.some(i=>i.language_function===s.id))};
  }).filter(t=>t.levels.length)})).filter(f=>f.topics.length);
 }
 let externalSpec=null,editing=null,moreOpen=false,guidanceOpen=false,selectionName=null;
 const $=s=>document.querySelector(s);
 const esc=value=>(globalThis.AppWording?.text(value)??String(value??'')).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const defaults={family:'grammar',topic:'ER',profile:'',level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'class',engine:null,variant:null};
 let state={...defaults,...(APP.contentUiDraft||{})},seedOverride=null,previewSeed=Math.floor(Date.now()%4294967295);
 if(root.ReleasePolicy?.enabled&&!catalog.families.some(f=>f.id===state.family&&f.topics.some(t=>t.id===state.topic)))state={...defaults};
 if(state.family==='conversation'&&state.level==='C1'&&catalog.families.find(f=>f.id==='conversation')?.topics.some(t=>t.id===state.topic&&!t.levels.includes('C1')&&t.levels.includes('B2')))state.level='B2';
 function family(){return catalog.families.find(x=>x.id===state.family)||null}
 function isMix(t){return (t.sourceTopics||[]).length>1}
 function topicChoices(f){return (f?.topics||[]).filter(t=>!isMix(t)||t.id===state.topic)}
 function topic(){const f=family();return f?.topics.find(x=>x.id===state.topic)||null}
 function focus(){return catalog.focuses.find(x=>x.id===state.focus)||null}
 function engines(){return engineRegistry.contentEngines().map(x=>({id:x.id,label:x.label,description:x.description,variants:x.variants}))}
 function engine(){return engines().find(x=>x.id===state.engine)||null}
 function topicSubtopics(){
  const t=topic();if(!t)return[];
  return (t.subtopics||[{id:'all',label:'Alles',levels:t.levels}]).filter(x=>!x.levels||x.levels.includes(state.level));
 }
 function scopeError(){
  if(externalSpec){try{ContentRuntime.selectionPool(externalSpec);return ''}catch(e){return e.message}}
  const f=family();if(!f)return'De gekozen inhoud is niet beschikbaar.';
  const t=topic();if(!t)return'Het gekozen onderwerp is niet beschikbaar.';
  if(!t.levels.includes(state.level))return'Dit niveau is niet beschikbaar voor het gekozen onderwerp.';
  if(!topicSubtopics().some(x=>x.id===state.subtopic))return'Het gekozen subonderwerp is niet beschikbaar op dit niveau.';
  if(!focus())return'Deze oefening is niet beschikbaar.';
  if(!catalog.productionModes.some(x=>x.id===state.production))return'Deze manier van antwoorden is niet beschikbaar.';
  if(!catalog.difficulties.some(x=>x.id===state.difficulty))return'De gekozen moeilijkheid is niet beschikbaar.';
  if(!catalog.durations.some(x=>x.seconds===state.duration))return'De gekozen tijdsduur is niet beschikbaar.';
  if(!catalog.organizations.some(x=>x.id===state.organization))return'Deze groepsindeling is niet beschikbaar.';
  return'';
 }
 function emptyAvailability(){return Object.freeze({source_count:0,source_duration_seconds:0,common_count:0,common_duration_seconds:0,engines:Object.freeze(Object.fromEntries(engines().map(e=>[e.id,Object.freeze({count:0,duration_seconds:0,adapter_count:0})])))})}
 function filters(){
  const error=scopeError();if(error)throw new Error(error);
  const t=topic();
  return {
   family_ids:[state.family],topics:t.sourceTopics||[t.id],levels:[state.level],family_tags:t.familyTags||[],
   language_functions:state.subtopic==='all'?[]:[state.subtopic],exercise_types:focus().exerciseTypes,
   productive_or_receptive:state.production,difficulty:state.difficulty
  };
 }
 function selectionSpec(){return externalSpec||ContentRuntime.specFromFilters(filters())}
 function preferences(){return {target_duration_seconds:state.duration,organization_mode:state.organization,preferred_game_engine:state.engine,preferred_game_variant:state.variant}}
 let renderCache=null;
 function availability(){if(!renderCache)return calculateAvailability();return renderCache.availability??=calculateAvailability()}
 function calculateAvailability(){
  if(scopeError())return emptyAvailability();
  if(!externalSpec)return ContentRuntime.availability(filters());
  const pool=ContentRuntime.selectionPool(externalSpec),duration=pool.reduce((n,i)=>n+i.estimated_duration_seconds,0);
  return {source_count:pool.length,source_duration_seconds:duration,engines:Object.fromEntries(engines().map(e=>[e.id,{count:pool.filter(i=>ContentRuntime.compatibility(i,e.id).compatible).length,full_coverage:ContentRuntime.setCompatibility(pool,e.id),duration_seconds:duration}]))};
 }
 function compatibleEngineIds(){if(scopeError())return [];if(!renderCache)return ContentRuntime.compatibleSelectionEngines(selectionSpec(),state.organization);return renderCache.compatible??=ContentRuntime.compatibleSelectionEngines(selectionSpec(),state.organization)}
 function capacitySeconds(){return compatibleEngineIds().length?availability().source_duration_seconds:0}
 function persist(){APP.contentUiDraft={...state};save()}
 function applyProfile(id){
  const t=topic(),profile=t?.profiles.find(x=>x.id===id);state.profile=id||'';
  if(profile){state.level=profile.level;state.subtopic='all';state.focus='all';state.production='all';state.difficulty='all'}
 }
 function setState(patch,{render=true}={}){
  if(Object.keys(patch).some(k=>['family','topic','level','focus','subtopic','production','difficulty'].includes(k)))externalSpec=null;
  if(Object.keys(patch).some(k=>['family','topic','level','focus','subtopic','production','difficulty','duration'].includes(k)))seedOverride=null;
  const previousFamily=state.family,previousTopic=state.topic,previousLevel=state.level;state={...state,...patch};
  if(state.family!==previousFamily){
   const f=family();
   if(f){state.topic=patch.topic||f.topics[0]?.id||'';const t=topic();state.level=patch.level||t?.levels[0]||'';state.profile='';state.subtopic='all';state.focus='all';state.production='all';state.difficulty=patch.difficulty??f.defaultDifficulty??'all'}
  }else if(state.topic!==previousTopic){
   const t=topic();
   if(t){state.level=patch.level||state.level;state.profile='';state.subtopic='all';state.focus='all';state.production='all';state.difficulty=patch.difficulty??family().defaultDifficulty??'all'}
  }else if(state.level!==previousLevel&&topic()?.levels.includes(state.level))state.subtopic='all';
  if(patch.focus!=null)state.focus=patch.focus;
  if(state.profile&&Object.keys(patch).some(k=>['level','subtopic','focus','production','difficulty'].includes(k)))state.profile='';
  const e=engine();if(e&&!e.variants.some(v=>v.id===state.variant))state.variant=e.variants[0]?.id||null;
  persist();if(render)renderPage();
 }
 function icon(name){return gameIcon(name)}
 function engineIcon(id){return icon({BOARD:'board',WHEEL:'wheel',CARDS:'cards',DICE:'dice',QUIZ:'bulb',SEQUENCE:'sequence',MATCH:'puzzles',MEMORY:'memory',SORT:'sort',RIDDLE:'search'}[id]||'cards')}
 function levelLabel(value){return value==='A0→A1'?'A0 → A1':value}
 function levelBadge(value){return `<span class="practice-level${value.includes('→')?' practice-level-route':value==='Niveauvrij'?' practice-level-free':''}">${esc(levelLabel(value))}</span>`}
 function choiceGroup(name,label,items,value){
  return `<fieldset class="practice-field"><legend>${icon({level:'chart',duration:'clock',organization:'people',subtopic:'tree',focus:'verbs',production:'conversation',difficulty:'gauge'}[name])}${esc(label)}</legend><div class="practice-choice-row">${items.map(item=>`<label class="practice-choice ${String(value)===String(item.id??item.seconds)?'selected':''}"><input type="radio" name="${esc(name)}" value="${esc(item.id??item.seconds)}" ${String(value)===String(item.id??item.seconds)?'checked':''}><span>${esc(name==='duration'?item.seconds/60+' min':name==='organization'?{class:'Klas',groups:'Groepjes',pairs:'Tweetallen',individual:'Alleen'}[item.id]:item.label)}</span></label>`).join('')}</div></fieldset>`;
 }
 function selectField(name,label,items,value){
  const valid=items.some(item=>String(item.id)===String(value)),invalid=!valid&&value!==''&&value!=null?'<option value="__invalid__" selected disabled>Niet beschikbaar</option>':'';
  return `<label class="practice-select"><span>${icon({family:'layers',topic:'tag',level:'chart',profile:'notebook',variant:'board',subtopic:'tree',duration:'clock',organization:'people'}[name])}${esc(label)}</span><select name="${esc(name)}" ${name==='level'?'class="practice-level-select"':''}>${invalid}${items.map(item=>`<option value="${esc(item.id)}" ${String(item.id)===String(value)?'selected':''} ${item.disabled?'disabled':''}>${esc(name==='level'?levelLabel(item.label):item.label)}</option>`).join('')}</select></label>`;
 }
 function renderEngines(a,compatible,capacity){
  const visible=engines().filter(item=>compatible.includes(item.id));
  const suggestions=!externalSpec&&state.engine&&!compatible.includes(state.engine)&&!scopeError()?catalog.focuses.filter(f=>{try{return f.id!==state.focus&&ContentRuntime.fullCoverageEngines({...filters(),exercise_types:f.exerciseTypes},state.organization).includes(state.engine)}catch{return false}}):[];
  const guidance=suggestions.length?`<p class="practice-note">Voor ${esc(engine()?.label)} kun je kiezen:</p><div class="lesson-actions">${suggestions.map(f=>`<button type="button" class="smallbtn" data-practice-focus="${esc(f.id)}">${esc(f.label)}</button>`).join('')}</div>`:'';
  return `${guidance}<fieldset class="practice-field practice-engines"><legend>Hoe wil je oefenen?</legend><div class="practice-engine-grid">${visible.map(item=>{
   const enabled=capacity>=state.duration;
   return `<label class="practice-engine ${state.engine===item.id?'selected':''}"><input type="radio" name="engine" value="${item.id}" ${state.engine===item.id?'checked':''} ${enabled?'':'disabled'}>${engineIcon(item.id)}<strong>${esc(item.label)}</strong>${enabled?'':'<small>Kies een kortere les</small>'}</label>`;
  }).join('')}</div></fieldset>`;
 }
 function renderSummary(a,compatible,capacity){
  const t=topic(),e=engine(),variant=e?.variants.find(v=>v.id===state.variant),minutes=Math.round(capacity/60),selected=previewItems(),selectedCount=selected.length,selectedSeconds=selected.reduce((n,i)=>n+i.estimated_duration_seconds,0),error=scopeError();
  const blocker=error||(!a.source_count?'Geen inhoud gevonden voor deze selectie.':!compatible.length?'Er is nog geen passend spel voor deze oefening.':capacity<state.duration?`Je hebt oefeningen voor ongeveer ${minutes} minuten. Kies een kortere duur of kies meer inhoud.`:selectedSeconds>state.duration+Math.max(0,...selected.map(i=>i.estimated_duration_seconds))?'Deze mix heeft meer tijd nodig. Kies minder onderwerpen of een langere duur.':!state.engine?'Kies nog een spelvorm.':!compatible.includes(state.engine)?'Deze spelvorm past niet bij de volledige selectie. Kies een andere spelvorm of pas de inhoud aan.':'');
  return `<aside class="practice-summary"><h2>Je les</h2><div class="practice-chosen">${esc(externalSpec?editing?.name||selectionName||'Mijn mix':t?.label||state.topic)} ${externalSpec?'':levelBadge(state.level)}<span>· ${esc(e?.label||'Kies een spel')}</span></div><div class="practice-summary-fields">${selectField('duration','Tijd',catalog.durations.map(d=>({id:d.seconds,label:d.label})),state.duration)}${selectField('organization','Met wie?',catalog.organizations,state.organization)}</div><details class="practice-facts"><summary>${icon('clipboard')}Les bekijken</summary><dl>${externalSpec?`<div><dt>Inhoud</dt><dd>${externalSpec.scope_clauses.map(c=>esc(c.topic_ids.map(id=>catalog.families.flatMap(f=>f.topics).find(t=>t.id===id)?.label||id).join(', ')+' · '+c.cefr_levels.join(', '))).join('<br>')}</dd></div><div><dt>Moeilijkheid</dt><dd>${esc(catalog.difficulties.find(d=>d.id===externalSpec.filter_spec.difficulty)?.label||'Gemengd')}</dd></div>`:`<div><dt>Onderdeel</dt><dd>${esc(topicSubtopics().find(x=>x.id===state.subtopic)?.label||state.subtopic)}</dd></div><div><dt>Oefening</dt><dd>${esc(focus()?.label||state.focus)}</dd></div><div><dt>Antwoord</dt><dd>${esc(catalog.productionModes.find(x=>x.id===state.production)?.label||state.production)}</dd></div><div><dt>Moeilijkheid</dt><dd>${esc(catalog.difficulties.find(x=>x.id===state.difficulty)?.label||state.difficulty)}</dd></div>`}<div><dt>Duur</dt><dd>${esc(catalog.durations.find(x=>x.seconds===state.duration)?.label||state.duration)}</dd></div><div><dt>Met wie?</dt><dd>${esc(catalog.organizations.find(x=>x.id===state.organization)?.label||state.organization)}</dd></div><div><dt>Spel</dt><dd>${esc(e?.label||'Nog kiezen')}${variant&&e?.variants.length>1?' · '+esc(variant.label):''}</dd></div></dl></details><div class="practice-count"><strong>${selectedCount}</strong><span>opdrachten in deze les</span></div>${blocker?`<p class="practice-warning" role="status">${esc(blocker)}</p>`:`<p class="practice-ready" role="status">Klaar om te starten.</p>`}<button type="button" class="primary practice-start" id="practiceStart" ${blocker?'disabled':''}>${icon('play')}Start les</button><button type="button" class="smallbtn lesson-save" id="practiceSave" ${scopeError()?'disabled':''}>${icon('save')}Bewaar${editing?' als nieuwe les':''}</button>${editing?'<button type="button" class="smallbtn lesson-save" id="practiceUpdate">Wijzigingen opslaan</button>':''}${state.engine?`<button type="button" class="smallbtn lesson-save" id="practiceFavorite">${icon('heart')}Favoriet</button>`:''}<button type="button" class="smallbtn lesson-save" id="practiceMix">${icon('shuffle')}Mix maken</button></aside>`;
 }
 function openPilot(){
  externalSpec=null;editing=null;
  setState({family:'connections',topic:'oorzaak-gevolg',level:'B2',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,engine:state.engine||'CARDS'},{render:false});
  const e=engine();state.variant=e?.variants.some(v=>v.id===state.variant)?state.variant:e?.variants[0]?.id||null;
  persist();recentNew=true;currentLayout=null;goScreen('practice');renderPage();$('#practiceForm summary')?.focus();
 }
 function overview(){
  return `<details class="practice-inventory"><summary>${icon('library')}Inhoud bekijken</summary><div class="inventory-toolbar"><label>${icon('search')}Onderwerp<input type="search" id="inventorySearch" placeholder="Zoek een onderwerp" value="${esc(inventoryQuery)}"></label><label>${icon('chart')}Niveau<select id="inventoryLevel"><option value="">Alle niveaus</option>${['A0→A1','A1','A1+','A2','B1','B2','C1','C2','Niveauvrij'].map(l=>`<option value="${esc(l)}" ${inventoryLevel===l?'selected':''}>${esc(levelLabel(l))}</option>`).join('')}</select></label><button class="smallbtn" type="button" id="inventoryReset">Wis filters</button></div><p class="practice-note">Kies een niveau bij het onderwerp om je les klaar te zetten.</p><p id="inventoryCount" role="status"></p><div id="inventoryResults"></div><details class="practice-level-info"><summary>${icon('notebook')}Korte lessen</summary><div class="lesson-actions">${(root.ReleasePolicy?.enabled?[]:root.ConversationReview?.trials||[]).map(t=>`<button type="button" class="smallbtn" data-conversation-trial="${esc(t.id)}">${esc(t.name)} ${levelBadge(t.level)}</button>`).join('')}</div></details><details class="practice-level-info"><summary>${icon('help')}Niveaus</summary><div class="practice-levels">${['A0','A1','A1+','A2','B1','B2','C1','C2'].map(levelBadge).join('')}</div><p>A0 → A1 is een oefenroute. A1+ is een tussenstap. Een niveau bij een opdracht zegt wat je oefent; het is geen toetsuitslag. C1 en C2 blijven onderdeel van de indeling. De beschikbare niveaus verschillen per onderwerp. Een leeg niveau krijgt pas keuzes wanneer er passende inhoud is aangesloten.</p></details><p class="practice-note">Hier staat de beschikbare inhoud. Nog niet volledig nagekeken opdrachten blijven bewaard en verborgen.</p></details>`;
 }
 let inventoryQuery='',inventoryLevel='';
 function inventoryRows(){
  if(inventoryLevel&&!ContentRuntime.LEVELS.includes(inventoryLevel))return [];
  const query=inventoryQuery.toLocaleLowerCase('nl').trim().split(/\s+/).filter(Boolean);
  return indexedTopics().map(entry=>{
   const {family:f,topic:t}=entry,haystack=[f.label,t.label,...(t.subtopics||[]).map(s=>s.label)].join(' ').toLocaleLowerCase('nl');
   return {...entry,rows:query.every(word=>haystack.includes(word))?entry.rows.filter(i=>!inventoryLevel||i.cefr_level===inventoryLevel):[]};
  }).filter(entry=>entry.rows.length);
 }
 function renderInventory(){
  const mount=$('#inventoryResults');if(!mount)return;
  const entries=inventoryRows(),ids=new Set(entries.flatMap(e=>e.rows.map(i=>i.content_item_id)));
  $('#inventoryCount').textContent=`${inventoryLevel?'Beschikbaar bij '+levelLabel(inventoryLevel):'Beschikbaar op alle niveaus'}${inventoryQuery?' · zoekresultaat':''}: ${ids.size.toLocaleString('nl-NL')} opdrachten`;
  mount.innerHTML=entries.length?catalog.families.map(f=>{
   const group=entries.filter(e=>e.family===f);if(!group.length)return '';
   return `<details class="inventory-family" name="inventory-family"><summary>${esc(f.label)}<small>${group.length} ${group.length===1?'onderwerp':'onderwerpen'}</small></summary><div class="inventory-topics">${group.map(({topic:t,rows})=>`<article class="inventory-topic"><div><h3>${esc(t.label)}</h3><small>${rows.length.toLocaleString('nl-NL')} opdrachten</small>${(t.sourceTopics||[]).length>1?' <span class="practice-type-label">Mix</span>':''}${f.id==='connections'?' <span class="practice-status-label">Proefles</span>':''}</div><div class="practice-labels" aria-label="Kies het niveau voor ${esc(t.label)}">${[...new Set(rows.map(i=>i.cefr_level))].sort().map(l=>`<button type="button" class="inventory-pick" data-inventory-family="${esc(f.id)}" data-inventory-topic="${esc(t.id)}" data-inventory-level="${esc(l)}" aria-label="Kies ${esc(t.label)}, ${esc(levelLabel(l))}">${levelBadge(l)}</button>`).join('')}</div></article>`).join('')}</div></details>`;
  }).join(''):'<p class="practice-note">Geen aangesloten inhoud gevonden. Kies een ander niveau of wis de filters.</p>';
  mount.querySelectorAll('.inventory-family').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)mount.querySelectorAll('.inventory-family').forEach(other=>{if(other!==details)other.open=false})}));
  mount.querySelectorAll('[data-inventory-topic]').forEach(button=>button.onclick=()=>{
   externalSpec=null;editing=null;selectionName=null;moreOpen=false;
   setState({family:button.dataset.inventoryFamily,topic:button.dataset.inventoryTopic,level:button.dataset.inventoryLevel,subtopic:'all',focus:'all',production:'all',difficulty:'all'},{render:false});
   const capacity=capacitySeconds();if(capacity<state.duration)state.duration=[...catalog.durations].reverse().find(d=>d.seconds<=capacity)?.seconds||catalog.durations[0].seconds;
   openStep='game';recentNew=true;persist();renderPage();$('#practiceForm select')?.focus();$('#practiceForm')?.scrollIntoView({block:'start'});
  });
 }
 function bindOverview(){
  $('.practice-inventory>summary')?.addEventListener('click',()=>{if(!$('.practice-inventory').open)renderInventory()});
  $('#inventorySearch')?.addEventListener('input',e=>{inventoryQuery=e.target.value;renderInventory()});
  $('#inventoryLevel')?.addEventListener('change',e=>{inventoryLevel=e.target.value;renderInventory()});
  $('#inventoryReset')?.addEventListener('click',()=>{inventoryQuery='';inventoryLevel='';$('#inventorySearch').value='';$('#inventoryLevel').value='';renderInventory();$('#inventorySearch').focus()});
  document.querySelectorAll('[data-conversation-trial]').forEach(button=>button.onclick=()=>{const t=root.ConversationReview.trials.find(t=>t.id===button.dataset.conversationTrial);loadSelection({scope_clauses:t.topics.map(id=>({scope_id:id,content_family_id:'conversation',topic_ids:[id],cefr_levels:[t.level]})),filter_spec:{difficulty:'all'}},{target_duration_seconds:600,organization_mode:'pairs',preferred_game_engine:'CARDS'},{seed:t.seed,name:t.name})});
  document.querySelectorAll('[data-practice-family]').forEach(button=>button.onclick=()=>{
   if(button.dataset.practiceFamily==='connections'){openPilot();return}
   externalSpec=null;editing=null;setState({family:button.dataset.practiceFamily});
  });
 }
 const layoutLabels={topic:'Onderwerp eerst',level:'Niveau eerst',goal:'Lesdoel eerst',game:'Spel eerst',recent:'Eerder gebruikt'};
 const familyIcons={grammar:'verbs',words:'spelling',riddles:'search',connections:'sequence',conversation:'conversation',reading:'rules',quick:'bulb'};
 const goals=[
  {id:'sentences',label:'Zinnen maken',icon:'verbs',includes:e=>['grammar','words','connections'].includes(e.family.id)},
  {id:'words',label:'Woorden oefenen',icon:'spelling',includes:e=>e.family.id==='riddles'||['betekenis-woorden','betekenisnuances'].includes(e.topic.id)},
  {id:'conversation',label:'Een gesprek voeren',icon:'conversation',includes:e=>e.family.id==='conversation'||(e.family.id==='quick'&&e.topic.id!=='quick-tell')},
  {id:'text',label:'Een tekst begrijpen',icon:'rules',includes:e=>e.family.id==='reading'||e.topic.id==='tussen-de-regels'},
  {id:'tell',label:'Vertellen en uitleggen',icon:'story',includes:e=>e.topic.id==='quick-tell'}
 ];
 let currentLayout=null,openStep='topic',chosenGoal='sentences',topicQuery='',topicIndex=null,gameChoices=new Map();
 function practiceLayout(){const saved=settingsState().practiceLayout,value=recentNew&&saved==='recent'?'topic':saved;return Object.hasOwn(layoutLabels,value)?value:'topic'}
 function indexedTopics(){
  if(!topicIndex)topicIndex=catalog.families.flatMap(f=>{
   const items=ContentRuntime.filterSource({family_ids:[f.id]});
   return f.topics.filter(t=>!isMix(t)).map(t=>({family:f,topic:t,rows:items.filter(i=>(t.sourceTopics||[t.id]).includes(i.topic)&&(t.familyTags||[]).every(tag=>i.technical_tags.includes(tag)))})).filter(e=>e.rows.length);
  });
  return topicIndex;
 }
 function topicLevels(entry){return [...new Set(entry.rows.map(i=>i.cefr_level))].sort()}
 function initialDifficulty(familyId,topicId,level){return familyId==='words'&&level==='A0→A1'&&indexedTopics().find(e=>e.family.id===familyId&&e.topic.id===topicId)?.rows.some(i=>i.cefr_level===level&&i.difficulty==='basis')?'basis':'all'}
 function gameEntries(id){
  if(!gameChoices.has(id))gameChoices.set(id,indexedTopics().map(e=>{
   const focusByLevel={};
   for(const level of topicLevels(e)){
    const pool=e.rows.filter(i=>i.cefr_level===level),focusId={SEQUENCE:'order',SORT:'sort',MATCH:'correct',MEMORY:'correct'}[id];
    if(ContentRuntime.setCompatibility(pool,id))focusByLevel[level]='all';
    else if(focusId&&ContentRuntime.setCompatibility(pool.filter(i=>catalog.focuses.find(f=>f.id===focusId).exerciseTypes.includes(i.exercise_type)),id))focusByLevel[level]=focusId;
   }
   return {...e,levels:Object.keys(focusByLevel),focusByLevel};
  }).filter(e=>e.levels.length));
  return gameChoices.get(id);
 }
 function routeEntries(){
  if(currentLayout==='game'&&state.engine)return gameEntries(state.engine);
  return indexedTopics().filter(e=>currentLayout!=='goal'||goals.find(g=>g.id===chosenGoal)?.includes(e)).map(e=>({...e,levels:topicLevels(e).filter(l=>currentLayout!=='level'||l===state.level)})).filter(e=>e.levels.length);
 }
 function stepOrder(){return currentLayout==='level'?['level','topic','game']:currentLayout==='goal'?['goal','topic','level','game']:currentLayout==='game'?['game','topic','level']:['topic','level','game']}
 function nextStep(step){const order=stepOrder();openStep=order[order.indexOf(step)+1]||'ready'}
 function focusStep(){const step=document.querySelector('[data-practice-step="'+openStep+'"]>summary')||document.querySelector('#practiceStart');step?.focus({preventScroll:true})}
 function rowsForTopics(){
  const entries=routeEntries(),query=topicQuery.trim().toLocaleLowerCase('nl');
  return catalog.families.map(f=>{
   const topics=entries.filter(e=>e.family.id===f.id&&(!query||[f.label,e.topic.label,...(e.topic.subtopics||[]).map(s=>s.label)].join(' ').toLocaleLowerCase('nl').includes(query)));
   if(!topics.length)return '';
   return `<details class="practice-topic-group" ${query?'open':'name="practice-topics"'}><summary>${icon(familyIcons[f.id]||'layers')}<strong>${esc(f.label)}</strong><small>${topics.length}</small></summary>${topics.map(e=>`<button type="button" class="practice-topic-row" data-choose-topic="${esc(e.topic.id)}" data-choose-family="${esc(f.id)}" aria-pressed="${state.topic===e.topic.id&&state.family===f.id}"><span>${esc(e.topic.label)}${e.focusByLevel&&Object.values(e.focusByLevel).some(id=>id!=='all')?`<small class="practice-focus-label">${[...new Set(Object.values(e.focusByLevel))].map(id=>esc(catalog.focuses.find(f=>f.id===id).label)).join(' · ')}</small>`:''}</span><span class="practice-labels">${e.levels.map(levelBadge).join('')}</span><span aria-hidden="true">›</span></button>`).join('')}</details>`;
  }).join('')||'<p class="practice-note">Geen onderwerp gevonden. Wis je zoekwoord of kies een ander spel.</p>';
 }
 function renderSteps(a,compatible,capacity){
  const own=indexedTopics().find(e=>e.family.id===state.family&&e.topic.id===state.topic);
  const availableLevels=currentLayout==='level'?[...new Set(indexedTopics().flatMap(topicLevels))].sort():own?(currentLayout==='game'&&state.engine?gameEntries(state.engine).find(e=>e.topic.id===own.topic.id&&e.family.id===own.family.id)?.levels||[]:topicLevels(own)):topic()?.levels||[];
  const parts={
   topic:{title:'Onderwerp',value:topic()?.label||'Kies een onderwerp',icon:'tag',body:`<label class="practice-topic-search">${icon('search')}<input type="search" id="practiceTopicSearch" aria-label="Zoek een onderwerp" placeholder="Zoek een onderwerp" value="${esc(topicQuery)}"></label><div id="practiceTopicRows">${rowsForTopics()}</div>`},
   level:{title:'Niveau',value:levelLabel(state.level),icon:'chart',body:choiceGroup('level','Kies een niveau',availableLevels.map(id=>({id,label:levelLabel(id)})),state.level)},
   goal:{title:'Lesdoel',value:goals.find(g=>g.id===chosenGoal)?.label,icon:'mission',body:goals.filter(g=>indexedTopics().some(g.includes)).map(g=>`<button type="button" class="practice-topic-row" data-practice-goal="${g.id}" aria-pressed="${g.id===chosenGoal}">${icon(g.icon)}<span>${g.label}</span><span aria-hidden="true">›</span></button>`).join('')},
   game:{title:'Spel',value:engine()?.label||'Kies een spel',icon:'cards',body:currentLayout==='game'?`<div class="practice-game-first">${engines().filter(g=>gameEntries(g.id).length).map(g=>`<button type="button" class="practice-topic-row" data-choose-engine="${g.id}" aria-pressed="${g.id===state.engine}">${engineIcon(g.id)}<span>${esc(g.label)}</span><span aria-hidden="true">›</span></button>`).join('')}</div>`:renderEngines(a,compatible,capacity)}
  };
  return stepOrder().map((id,i)=>`<details class="practice-step" data-practice-step="${id}" name="practice-step" ${openStep===id?'open':''}><summary><span class="practice-step-number">${i+1}</span>${icon(parts[id].icon)}<strong><span class="practice-closed-title">${parts[id].title}</span><span class="practice-open-title">${{topic:'Wat wil je oefenen?',level:'Kies een niveau',game:'Kies een spel',goal:'Wat wil je bereiken?'}[id]}</span></strong><span class="practice-step-value">${esc(parts[id].value)}</span></summary><div class="practice-step-body">${parts[id].body}</div></details>`).join('');
 }
 async function renderRecent(mount){
  try{
   await LessonUI.flush();const records=(await LessonUI.service.list('recent_session')).filter(r=>!root.ReleasePolicy?.enabled||root.ReleasePolicy.sessionAllowed(r.session_config_snapshot)).sort((a,b)=>(b.last_active_at||'').localeCompare(a.last_active_at||'')).slice(0,12);
   if(!mount.isConnected)return;
   mount.innerHTML=records.map(r=>{const s=r.session_config_snapshot,titles=(s.topic_ids||[s.topic]).map(id=>catalog.families.flatMap(f=>f.topics).find(t=>t.id===id)?.label||id);return `<article class="practice-recent-row"><div><h3>${esc(titles.join(', '))}</h3><span>${esc(engines().find(e=>e.id===s.selected_game_engine)?.label||'Les')} · ${esc(new Date(r.last_active_at).toLocaleDateString('nl-NL'))}</span></div><div class="practice-labels">${(s.cefr_levels||[s.cefr_level]).map(levelBadge).join('')}</div><div class="lesson-actions"><button type="button" class="smallbtn" data-lesson-action="resume" data-id="${esc(r.recent_session_id)}">Hervatten</button><button type="button" class="smallbtn" data-lesson-action="other" data-id="${esc(r.recent_session_id)}">Opnieuw kiezen</button></div></article>`}).join('')||'<p>Je hebt hier nog geen lessen gestart.</p>';
  }catch{if(mount.isConnected)mount.innerHTML='<p role="alert">Je eerdere lessen konden niet worden geladen. Probeer het opnieuw via Mijn lessen.</p>'}
 }
 function renderPage(){
  const mount=$('#contentPracticeApp');if(!mount)return;
  const layout=practiceLayout();if(layout!==currentLayout){currentLayout=layout;openStep=stepOrder()[0];topicQuery='';if(layout==='goal'){const entry=indexedTopics().find(e=>e.family.id===state.family&&e.topic.id===state.topic);chosenGoal=goals.find(g=>entry&&g.includes(entry))?.id||'sentences'}}
  $('#screen-practice').classList.remove('practice-pilot');
  if(currentLayout==='recent'){mount.innerHTML=`<section class="practice-panel"><h2>Eerder gebruikt</h2><div id="practiceRecent" aria-live="polite">Lessen laden…</div><div class="lesson-actions"><button class="primary" id="practiceNew">Nieuwe les</button><button class="smallbtn" id="practiceAllLessons">Mijn lessen</button></div></section><div class="practice-librarybar">${overview()}</div>`;$('#practiceAllLessons').onclick=()=>document.querySelector('[data-main=lessons]').click();$('#practiceNew').onclick=()=>{openStep='topic';renderPageWithTopic()};bindOverview();renderRecent($('#practiceRecent'));return}
  renderCache={};
  try{
  const a=availability(),compatible=compatibleEngineIds(),capacity=capacitySeconds(),e=engine();
  if(e&&!state.variant)state.variant=e.variants[0]?.id||null;
  const f=family(),t=topic(),profileItems=[{id:'',label:'Zelf samenstellen'},...(t?.profiles||[]).filter(p=>indexedTopics().find(e=>e.topic.id===t.id&&e.family.id===state.family)?.rows.some(i=>i.cefr_level===p.level)).map(p=>({id:p.id,label:p.label}))];
  mount.innerHTML=`<form class="practice-layout" id="practiceForm"><div class="practice-config">
   <section class="practice-panel practice-steps">${externalSpec?`<p>${esc(externalSpec.scope_clauses.map(c=>c.topic_ids.map(id=>catalog.families.flatMap(f=>f.topics).find(t=>t.id===id)?.label||id).join(', ')+' · '+c.cefr_levels.join(', ')).join(' + '))}</p><button type="button" class="smallbtn" id="practiceEditMix">Inhoud aanpassen</button>`:renderSteps(a,compatible,capacity)}</section>
   ${externalSpec?`<section class="practice-panel">${renderEngines(a,compatible,capacity)}</section>`:''}
   <section class="practice-panel practice-lesson">${!externalSpec&&topicSubtopics().length>1?selectField('subtopic','Onderdeel',topicSubtopics(),state.subtopic):''}${e?.variants.length>1?selectField('variant','Spelvariant',e.variants,state.variant):''}</section>
   ${externalSpec?'':`<details class="practice-panel practice-more" ${moreOpen?'open':''}><summary>${icon('options')}Meer opties</summary>${selectField('profile','Lesvoorstel',profileItems,state.profile)}${choiceGroup('focus','Oefening',catalog.focuses,state.focus)}${f?.selection_dimensions?.production==='not_applicable'?'':choiceGroup('production','Spreken en begrijpen',catalog.productionModes,state.production)}${f?.selection_dimensions?.difficulty==='not_applicable'?'':choiceGroup('difficulty','Moeilijkheid',catalog.difficulties,state.difficulty)}</details>`}
   </div>${renderSummary(a,compatible,capacity)}<section class="practice-panel practice-help"></section></form><div class="practice-librarybar">${overview()}<span class="practice-layout-label">${esc(layoutLabels[currentLayout])}</span></div>`;
  const selectedItems=previewItems(),panel=mount.querySelector('.practice-help');
  if(selectedItems[0])panel.insertAdjacentHTML('beforeend',`<details class="practice-preview"><summary>${icon('eye')}Bekijk een opdracht</summary><article class="content-reading">${contentTaskText(selectedItems[0],{preview:true})}${selectedItems[0].reasoning?'':`<details><summary>${contentAnswerLabel(selectedItems[0])}</summary>${contentAnswerText(selectedItems[0],ContentRuntime.answerPolicy(selectedItems[0]))}</details>`}</article></details>`);
  panel.insertAdjacentHTML('beforeend',`<details class="practice-guidance" ${guidanceOpen?'open':''}><summary>${icon('help')}Bij deze les</summary><section aria-label="Uitleg bij de gekozen les">${ContentGuidance.row(selectedItems)}</section></details>`);
  ContentGuidance.bind(panel,selectedItems);bind();bindOverview();bindSteps();
  }finally{renderCache=null}
 }
 // A new lesson from the recent list uses the default route for this visit only.
 let recentNew=false;
 function renderPageWithTopic(){editing=null;externalSpec=null;seedOverride=null;selectionName=null;recentNew=true;renderPage()}
 function bindSteps(){
  document.querySelectorAll('[data-practice-step]').forEach(el=>el.addEventListener('toggle',()=>{if(el.isConnected&&el.open)openStep=el.dataset.practiceStep}));
  $('#practiceTopicSearch')?.addEventListener('input',e=>{topicQuery=e.target.value;$('#practiceTopicRows').innerHTML=rowsForTopics()});
  // Native radios emit no click/change when Space confirms an already selected option.
  // Keep focus on the radio until keyup, then use the same path as a pointer click.
  for(const type of ['keydown','keyup'])$('#practiceForm').addEventListener(type,event=>{
   if(![' ','Enter'].includes(event.key)||!event.target.matches('input[name=level],input[name=engine]')||event.target.disabled)return;
   event.preventDefault();if(type==='keyup')event.target.click();
  });
  $('#practiceForm').addEventListener('click',event=>{
   if(event.target.matches('input[name=level],input[name=engine]')&&state[event.target.name]===event.target.value){nextStep(event.target.name==='engine'?'game':'level');renderPage();focusStep();return}
   const goal=event.target.closest('[data-practice-goal]'),pick=event.target.closest('[data-choose-topic]'),game=event.target.closest('[data-choose-engine]');
   if(goal){chosenGoal=goal.dataset.practiceGoal;nextStep('goal');topicQuery='';const choices=routeEntries(),entry=choices.find(e=>e.family.id===state.family&&e.topic.id===state.topic)||choices[0];if(entry)setState({family:entry.family.id,topic:entry.topic.id,level:entry.levels.includes(state.level)?state.level:entry.levels[0],subtopic:'all',focus:'all',production:'all',difficulty:'all'});else renderPage();focusStep()}
   if(pick){const entry=routeEntries().find(e=>e.family.id===pick.dataset.chooseFamily&&e.topic.id===pick.dataset.chooseTopic);if(!entry)return;const level=entry.levels.includes(state.level)?state.level:entry.levels[0];nextStep('topic');setState({family:entry.family.id,topic:entry.topic.id,level,subtopic:'all',focus:entry.focusByLevel?.[level]||'all',production:'all',difficulty:initialDifficulty(entry.family.id,entry.topic.id,level)});focusStep()}
   if(game){const id=game.dataset.chooseEngine;topicQuery='';nextStep('game');setState({engine:id,variant:engines().find(e=>e.id===id).variants[0]?.id||null,organization:engineRegistry.supportsOrganization(id,state.organization)?state.organization:'groups'});focusStep()}
  });
 }
 function bind(){
  const form=$('#practiceForm');if(!form)return;
  form.onsubmit=e=>e.preventDefault();
  form.onchange=e=>{
   const name=e.target.name,value=e.target.value;if(!name||value==='__invalid__')return;
   try{
   if(name==='level')nextStep('level');
   if(name==='engine')nextStep('game');
   if(name==='level'&&currentLayout!=='level'){setState({level:value,difficulty:initialDifficulty(state.family,state.topic,value),...(currentLayout==='game'?{focus:gameEntries(state.engine).find(e=>e.topic.id===state.topic&&e.family.id===state.family)?.focusByLevel[value]||'all'}:{})});focusStep();return}
   if(name==='level'||name==='family'){
    const level=name==='level'?value:state.level;
    const candidates=catalog.families.filter(f=>f.topics.some(t=>t.levels.includes(level)));
    const chosen=name==='family'?catalog.families.find(f=>f.id===value):candidates.find(f=>f.id===state.family)||candidates[0];
    const topics=topicChoices(chosen).filter(t=>t.levels.includes(level));
    const chosenTopic=topics.find(t=>t.id===state.topic)||topics[0];
    setState({level,...(chosenTopic?{family:chosen.id,topic:chosenTopic.id}:{}),profile:'',subtopic:'all',focus:'all',production:'all',difficulty:initialDifficulty(chosen?.id,chosenTopic?.id,level)});return;
   }
   if(name==='profile'){applyProfile(value);persist();renderPage();return}
   if(name==='duration'){setState({duration:Number(value)});return}
   if(name==='engine'){const item=engines().find(x=>x.id===value);setState({engine:value,variant:item?.variants[0]?.id||null});return}
   setState({[name]:value});
   }finally{if(['level','engine'].includes(name))focusStep();else [...document.querySelectorAll('#practiceForm [name]')].find(el=>el.name===name&&(el.tagName==='SELECT'||el.value===value))?.focus({preventScroll:true})}
  };
  form.querySelectorAll('[data-practice-focus]').forEach(b=>b.onclick=()=>setState({focus:b.dataset.practiceFocus}));
  $('.practice-guidance')?.addEventListener('toggle',e=>{guidanceOpen=e.target.open});
  $('.practice-more')?.addEventListener('toggle',e=>{moreOpen=e.target.open});
  $('#practiceSave')?.addEventListener('click',()=>LessonUI.saveDraft(false));
  $('#practiceUpdate')?.addEventListener('click',()=>LessonUI.saveDraft(true));
  $('#practiceFavorite')?.addEventListener('click',()=>LessonUI.favoriteGame(state.engine,state.variant));
  $('#practiceMix')?.addEventListener('click',()=>LessonUI.openMix());
  $('#practiceEditMix')?.addEventListener('click',()=>LessonUI.openMix(externalSpec));
  $('#practiceStart')?.addEventListener('click',()=>start());
 }
 function previewItems(){if(!renderCache)return calculatePreviewItems();return renderCache.preview??=calculatePreviewItems()}
 function calculatePreviewItems(){
  if(scopeError()||!compatibleEngineIds().length||capacitySeconds()<state.duration)return [];
  try{return ContentRuntime.selectItems({selectionSpec:selectionSpec(),engines:compatibleEngineIds(),seed:seedOverride??previewSeed,recentItemIds:seedOverride!=null?[]:APP.contentRecentItemIds||[],targetDurationSeconds:state.duration})}catch{return []}
 }
 function sessionOptions(seed){
  const error=scopeError();if(error)throw new Error(error);
  const compatible=compatibleEngineIds(),capacity=capacitySeconds();
  if(!state.engine||!compatible.includes(state.engine))throw new Error('Kies een beschikbare spelvorm.');
  if(capacity<state.duration)throw new Error('Te weinig oefeningen voor de gekozen tijd.');
  return {recentItemIds:seed!=null||seedOverride!=null?[]:APP.contentRecentItemIds||[],seed:seed??seedOverride??previewSeed,targetDurationSeconds:state.duration,engines:compatible,filters:externalSpec?{}:filters(),selectionSpec:selectionSpec(),organizationMode:state.organization,selectedGameEngine:state.engine,selectedGameVariant:state.variant,selectionTopic:externalSpec?null:state.topic,startedAt:new Date().toISOString()};
 }
 function launch(session,{resume=false,progress=null}={}){
  if(progress)LessonUI.validateProgress(progress,session);
  ContentRuntime.restoreSession(session);delete root.contentRestoreError;APP.contentSessionConfig=structuredClone(session);
  APP.turn.mode=session.organization_mode;settingsPatch({pawnMode:session.organization_mode});
  if(!resume){root.ReasoningTasks.clear();APP.contentVert001Used={};APP.cardIndex=0;APP.contentDiceIndex=0;APP.contentDiceLastRoll=0;if(session.selected_game_engine==='BOARD'){const b=session.selected_game_variant||'rotterdam';APP.contentBoardBaseline??={};APP.contentBoardBaseline[b]??=structuredClone(APP.boardStates[b]||{});APP.boardStates[b]={};}}
  if(progress)LessonUI.restoreProgress(progress);
  const engine=session.selected_game_engine,variant=session.selected_game_variant;
  const starts={BOARD:()=>startBoard(variant||'rotterdam'),WHEEL:()=>DigiActivities.start('draaiwiel'),CARDS:startContentCards,DICE:startContentDice,QUIZ:()=>DigiActivities.start('categorieenquiz'),SEQUENCE:()=>DigiActivities.start('rangschikken'),MATCH:()=>DigiActivities.start('koppelen'),MEMORY:()=>DigiActivities.start('memory'),SORT:()=>DigiActivities.start('sorteren'),RIDDLE:()=>DigiActivities.start('raad-het-woord')};
  if(!starts[engine])throw new Error('Deze spelvorm kan nog niet vanuit je les worden gestart.');
  starts[engine]();
  if(!resume){const selected=new Set(session.selected_item_ids);APP.contentRecentItemIds=[...(APP.contentRecentItemIds||[]).filter(id=>!selected.has(id)),...selected].slice(-840)}
  previewSeed=Math.floor(Date.now()%4294967295);save();root.LessonUI?.checkpoint();return session;
 }
 function start(seed){try{const session=ContentRuntime.createSession(sessionOptions(seed));launch(session);return session}catch(error){toast(error.message||'Deze sessie kan niet worden gestart.');renderPage();return null}}
 function loadSelection(spec,p,{record=null,seed=null,name=spec.name||null}={}){recentNew=true;currentLayout=null;selectionName=name;seedOverride=seed;externalSpec=ContentRuntime.currentSelection(spec);editing=record;state={...state,duration:p.target_duration_seconds,organization:p.organization_mode,engine:p.preferred_game_engine,variant:p.preferred_game_variant};goScreen('practice');renderPage()}
 function openBetweenLines(){
  editing=null;selectionName=null;
  setState({family:'conversation',topic:'tussen-de-regels',level:['B1','B2'].includes(state.level)?state.level:'B1',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:'class',engine:'CARDS'},{render:false});
  return open({engine:'CARDS'});
 }
 function openQuickBoard(board){
  if(!engines().find(e=>e.id==='BOARD').variants.some(v=>v.id===board))throw new Error('Dit bord is niet beschikbaar.');
  editing=null;selectionName=null;externalSpec=null;seedOverride=null;
  // A source route is not an ERK level. Higher levels stay unavailable instead of silently becoming A1.
  const level=APP.level==='A1+'||APP.level==='A0'||APP.level.startsWith('Alpha')?'A1':APP.level;
  setState({family:'quick',topic:'quick-answer',level,profile:'',subtopic:'all',focus:'all',production:'all',difficulty:'all',duration:600,organization:currentMode(),engine:'BOARD',variant:board},{render:false});
  open({engine:'BOARD',variant:board});openStep='level';renderPage();focusStep();
 }
 function open(preset={}){
  recentNew=true;currentLayout=null;
  if(preset.family)setState({family:preset.family}, {render:false});
  if(preset.topic&&family()?.topics.some(x=>x.id===preset.topic))state.topic=preset.topic;
  if(preset.level&&topic()?.levels.includes(preset.level))state.level=preset.level;
  if(preset.engine){const e=engines().find(x=>x.id===preset.engine);state.engine=e?.id||null;state.variant=preset.variant&&e?.variants.some(v=>v.id===preset.variant)?preset.variant:e?.variants[0]?.id||null}
  persist();goScreen('practice');renderPage();return {...state};
 }
 document.querySelector('[data-main="practice"]')?.addEventListener('click',()=>{recentNew=false;currentLayout=null;renderPage()});
 document.addEventListener('click',e=>{
  const direct=e.target.closest('[data-practice-open]');if(direct&&!direct.disabled){e.preventDefault();open();return}
  const entry=e.target.closest('[data-practice-engine]');if(entry&&!entry.disabled){e.preventDefault();open({engine:entry.dataset.practiceEngine,variant:entry.dataset.practiceVariant});return}
 },true);
 document.addEventListener('click',e=>{
  const quickBoard=e.target.closest('[data-board],[data-library-board]');
  if(root.ReleasePolicy?.enabled&&quickBoard&&!quickBoard.disabled){e.preventDefault();e.stopImmediatePropagation();if(boardTaskMode()==='direct')openQuickBoard(quickBoard.dataset.board||quickBoard.dataset.libraryBoard);else open({engine:'BOARD',variant:quickBoard.dataset.board||quickBoard.dataset.libraryBoard});return}
  if(quickBoard&&!quickBoard.disabled&&boardTaskMode()==='direct'){e.preventDefault();e.stopImmediatePropagation();openQuickBoard(quickBoard.dataset.board||quickBoard.dataset.libraryBoard);return}
  const launcher=e.target.closest('[data-board],[data-cardgame],[data-dicegame],[data-wordgame],[data-activity],[data-library-board],[data-library-card],[data-library-word],[data-start-work],#startCabinetActivity');
  if(launcher&&!launcher.closest('#screen-practice')&&(APP.contentSessionConfig||ContentRuntime.activeSession?.()))CONTENT_VERT001.stop();
 },true);
 try{if(APP.contentSessionConfig)CONTENT_VERT001.restore()}catch(error){root.contentRestoreError=error;ContentRuntime.clearSession()}
 root.ContentUI=Object.freeze({levelBadge,open,openQuickBoard,openPilot,openBetweenLines,registerBank,launch,loadSelection,selectionSpec,preferences,editing:()=>editing,clearEditing:()=>{editing=null;externalSpec=null;seedOverride=null},render:renderPage,applyLayout:()=>{recentNew=false;currentLayout=null;renderPage()},start,previewItems,sessionOptions,filters,availability,scopeError,engines,state:()=>({...state}),setState:(patch,options)=>setState(patch,options),setSeedOverride:value=>{seedOverride=value}});
})(typeof globalThis!=='undefined'?globalThis:this);

if(globalThis.ReleasePolicy?.enabled){
 document.querySelectorAll('[data-main="curriculum"],[data-main="collection"],[data-open-main="curriculum"],[data-open-main="collection"]').forEach(el=>{el.hidden=true;el.style.display='none'});
 const words=document.querySelector('[data-category="words"]');
 words.disabled=true;words.querySelector('p').textContent='Nog niet nagekeken';words.querySelector('.arrowbubble').hidden=true;
 document.querySelector('#collectionStorySets').closest('.simple-card').hidden=true;
 document.querySelector('#screen-mycollection>p').textContent='Je bewaarde voortgang en groepen.';
 updateResume();
}
