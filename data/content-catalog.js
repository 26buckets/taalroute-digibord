(function(root){
 const sub=(id,label,levels)=>({id,label,levels});
 const profiles=(topic)=>['A2','B1','B2'].map(level=>({id:'SP_GRAM_'+topic+'_'+level,label:({ER:'Er',ZULLEN:'Zullen',ZOUDEN:'Zouden',MODAAL:'Zullen en zouden'}[topic]||topic)+' '+level+' compleet',level}));
 const catalog={
  version:'3.0',
  families:[{
   id:'grammar',selection_dimensions:{topic:'required',level:'required',subtopic:'optional',production:'optional',difficulty:'optional'},label:'Grammatica',description:'Oefen met woorden en zinnen.',
   topics:[
    {id:'ER',label:'Er',description:'Oefen zinnen met er.',levels:['A2','B1','B2'],sourceTopics:['ER'],familyTags:[],profiles:profiles('ER'),subtopics:[
     sub('all','Alles',['A2','B1','B2']),
     sub('plaats','Plaats',['A2']),sub('hoeveelheid','Hoeveel',['A2','B1']),sub('presentatief','Wat is er?',['A2']),sub('richting','Waarheen en waarvandaan',['A2']),sub('woordvolgorde','Woordvolgorde',['A2','B1']),sub('functieonderscheid','Verschillende functies',['A2','B1']),
     sub('voornaamwoordelijk_bijwoord','Er met een voorzetsel',['B1']),sub('vaste_combinatie','Vaste combinaties',['B1']),sub('passief_onpersoonlijk','Wat gebeurt er?',['B1']),
     sub('onpersoonlijk_passief','Wat wordt er gedaan?',['B1']),sub('abstract_existenteel','Wat is er?',['B1']),sub('blijken_lijken','Wat blijkt of lijkt zo?',['B1']),sub('complex_voornaamwoordelijk_bijwoord','Verwijzen met er',['B1','B2']),sub('rapportage_met_bijzin','Informatie doorgeven',['B1']),sub('register_en_argumentatie','Een reden geven',['B1'])
    ]},
    {id:'ZULLEN',label:'Zullen',description:'Doe een voorstel, beloof iets of vertel wat je verwacht.',levels:['A2','B1'],sourceTopics:['ZULLEN'],familyTags:['MODAAL'],profiles:profiles('ZULLEN'),subtopics:[
     sub('all','Alles',['A2','B1']),
     sub('voorstel','Voorstel',['A2']),sub('aanbod','Aanbod',['A2']),sub('belofte','Belofte',['A2']),sub('voorspelling','Voorspelling',['A2']),sub('toekomstige_mededeling','Toekomstige mededeling',['A2']),
     sub('verwachting','Verwachting',['B1']),sub('noodzaak','Zullen moeten',['B1']),sub('formeel','Formele mededeling',['A2','B1']),sub('waarschuwing_stelligheid','Waarschuwing en stelligheid',['B1']),sub('toezegging','Toezegging',['A2','B1']),
     sub('aanname','Wat is waarschijnlijk?',['B1']),sub('projectie','Wat verwacht je?',['B1']),sub('nuance','Hoe zeker ben je?',['B1']),sub('formeel_argumentatief','Een afweging maken',['B1']),sub('zekerheid_en_grens','Een verwachting uitspreken',['B1'])
    ]},
    {id:'ZOUDEN',label:'Zouden',description:'Vraag iets beleefd, geef advies of vertel wat mogelijk is.',levels:['A2','B1','B2'],sourceTopics:['ZOUDEN'],familyTags:['MODAAL'],profiles:profiles('ZOUDEN'),subtopics:[
     sub('all','Alles',['A2','B1','B2']),
     sub('beleefd_verzoek','Beleefd verzoek',['A2']),sub('wens','Wens',['A2']),sub('voorzichtig_voorstel','Voorzichtig voorstel',['A2']),sub('toestemming','Toestemming',['A2']),sub('voorkeur','Voorkeur',['A2']),
     sub('advies','Advies',['A2','B1']),sub('hypothese','Hypothese',['B1']),sub('toekomst_in_verleden','Toekomst in het verleden',['B1']),sub('mogelijkheid','Mogelijkheid',['B1']),sub('formeel_beleefd','Formeel beleefd',['A2','B1']),
     sub('contrafeitelijk_verleden','Als het anders was gegaan',['B2']),sub('gerapporteerde_onzekerheid','Een bericht doorgeven',['B1']),sub('voorzichtige_inferentie','Een mogelijke verklaring',['B1']),sub('diplomatiek','Voorzichtig je mening geven',['B1']),sub('hypothetische_consequentie','Een mogelijk gevolg',['B1'])
    ]},
    {id:'MODAAL',label:'Mix: zullen en zouden',description:'Combineert de bestaande ZULLEN en ZOUDEN records zonder kopieën.',levels:['A2','B1','B2'],sourceTopics:['ZULLEN','ZOUDEN'],familyTags:['MODAAL'],profiles:profiles('MODAAL'),subtopics:[sub('all','Alles',['A2','B1','B2'])]}
   ]
  }],
  focuses:[
   {id:'all',label:'Gemengd',exerciseTypes:[]},
   {id:'sort',label:'Functies sorteren',exerciseTypes:['functie_sorteren']},
   {id:'recognize',label:'Herkennen',exerciseTypes:['meerkeuze_vorm','betekenis_kiezen','functie_sorteren','meerkeuze_context']},
   {id:'fill',label:'Invullen',exerciseTypes:['invullen']},
   {id:'order',label:'Zin bouwen',exerciseTypes:['zinnen_leggen']},
   {id:'correct',label:'Fout verbeteren',exerciseTypes:['fout_verbeteren']},
   {id:'rapid',label:'Snel antwoorden',exerciseTypes:['snelvraag']},
   {id:'rewrite',label:'Herschrijven',exerciseTypes:['herschrijven']},
   {id:'produce',label:'Zelf een antwoord maken',exerciseTypes:['scenario','dialoog_aanvullen','vrije_productie']}
  ],
  productionModes:[{id:'all',label:'Gemengd'},{id:'receptief',label:'Begrijpen'},{id:'productief',label:'Zelf spreken of schrijven'}],
  difficulties:[{id:'all',label:'Gemengd'},{id:'basis',label:'Basis'},{id:'midden',label:'Gemiddeld'},{id:'hoog',label:'Uitdagend'}],
  durations:[{seconds:180,label:'3 minuten'},{seconds:300,label:'5 minuten'},{seconds:600,label:'10 minuten'},{seconds:900,label:'15 minuten'},{seconds:1200,label:'20 minuten'}],
  organizations:[{id:'class',label:'Met de klas'},{id:'groups',label:'Groepen'},{id:'pairs',label:'In tweetallen'},{id:'individual',label:'Alleen'}]
 };
 catalog.registerBank=function(bank,metadata={}){
  const id=metadata.familyId||bank.family_id;
  let family=catalog.families.find(f=>f.id===id);
  if(!family){family={id,label:metadata.label||bank.bank_name,description:metadata.description||'',selection_dimensions:metadata.selection_dimensions||{topic:'required',level:'required',subtopic:'optional',production:'optional',difficulty:'optional'},defaultDifficulty:metadata.defaultDifficulty||'all',topics:[]};catalog.families.push(family)}
  for(const topicId of [...new Set(bank.items.map(i=>i.topic))]){
   const rows=bank.items.filter(i=>i.topic===topicId),levels=[...new Set(rows.map(i=>i.cefr_level))].sort();
   const prior=family.topics.find(t=>t.id===topicId);
   if(prior){
    prior.levels=[...new Set([...prior.levels,...levels])].sort();
    for(const fn of ['all',...new Set(rows.map(i=>i.language_function))]){
     const added=fn==='all'?levels:[...new Set(rows.filter(i=>i.language_function===fn).map(i=>i.cefr_level))],existing=prior.subtopics.find(s=>s.id===fn);
     if(existing)existing.levels=[...new Set([...(existing.levels||prior.levels),...added])].sort();
     else prior.subtopics.push(sub(fn,fn==='all'?'Alles':fn,added));
    }
    continue;
   }
   family.topics.push({id:topicId,label:rows[0].topic_label||topicId,sourceTopics:[topicId],familyTags:[],levels,profiles:[],subtopics:[sub('all','Alles',levels),...[...new Set(rows.map(i=>i.language_function))].map(fn=>sub(fn,fn,[...new Set(rows.filter(i=>i.language_function===fn).map(i=>i.cefr_level))].sort()))]});
  }
  return family;
 };
 if(typeof module==='object'&&module.exports)module.exports=catalog;else root.DIGIBORD_CONTENT_CATALOG=catalog;
})(typeof globalThis!=='undefined'?globalThis:this);
