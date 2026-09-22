(function(root){
 const sub=(id,label,levels)=>({id,label,levels});
 const profiles=(topic)=>['A2','B1','B2'].map(level=>({id:'SP_GRAM_'+topic+'_'+level,label:topic+' '+level+' compleet',level}));
 const catalog={
  version:'3.0',
  families:[{
   id:'grammar',selection_dimensions:{topic:'required',level:'required',subtopic:'optional',production:'optional',difficulty:'optional'},label:'Grammatica',description:'Oefen grammaticale vormen en functies.',
   topics:[
    {id:'ER',label:'ER',description:'Plaats, hoeveelheid, presentatief er, voornaamwoordelijke bijwoorden, passief en formele constructies.',levels:['A2','B1','B2'],sourceTopics:['ER'],familyTags:[],profiles:profiles('ER'),subtopics:[
     sub('all','Alles',['A2','B1','B2']),
     sub('plaats','Plaats',['A2']),sub('hoeveelheid','Hoeveelheid',['A2']),sub('presentatief','Presentatief er',['A2']),sub('richting','Richting',['A2']),sub('woordvolgorde','Woordvolgorde',['A2','B1']),sub('functieonderscheid','Functiemix',['A2','B1']),
     sub('voornaamwoordelijk_bijwoord','Voornaamwoordelijk bijwoord',['B1']),sub('vaste_combinatie','Vaste combinaties',['B1']),sub('passief_onpersoonlijk','Onpersoonlijk passief',['B1']),
     sub('onpersoonlijk_passief','Formeel onpersoonlijk passief',['B2']),sub('abstract_existenteel','Abstract existentieel',['B2']),sub('blijken_lijken','Blijken en lijken',['B2']),sub('complex_voornaamwoordelijk_bijwoord','Complex voornaamwoordelijk bijwoord',['B2']),sub('rapportage_met_bijzin','Rapportage met bijzin',['B2']),sub('register_en_argumentatie','Register en argumentatie',['B2'])
    ]},
    {id:'ZULLEN',label:'ZULLEN',description:'Voorstel, aanbod, belofte, verwachting, noodzaak en formele projectie.',levels:['A2','B1','B2'],sourceTopics:['ZULLEN'],familyTags:['MODAAL'],profiles:profiles('ZULLEN'),subtopics:[
     sub('all','Alles',['A2','B1','B2']),
     sub('voorstel','Voorstel',['A2']),sub('aanbod','Aanbod',['A2']),sub('belofte','Belofte',['A2']),sub('voorspelling','Voorspelling',['A2']),sub('toekomstige_mededeling','Toekomstige mededeling',['A2']),
     sub('verwachting','Verwachting',['B1']),sub('noodzaak','Zullen moeten',['B1']),sub('formeel','Formele mededeling',['B1']),sub('waarschuwing_stelligheid','Waarschuwing en stelligheid',['B1']),sub('toezegging','Toezegging',['B1']),
     sub('aanname','Aanname',['B2']),sub('projectie','Projectie',['B2']),sub('nuance','Nuance',['B2']),sub('formeel_argumentatief','Formeel argumentatief',['B2']),sub('zekerheid_en_grens','Zekerheid en grens',['B2'])
    ]},
    {id:'ZOUDEN',label:'ZOUDEN',description:'Beleefdheid, advies, hypothese, onzekerheid, diplomatiek taalgebruik en hypothetische gevolgen.',levels:['A2','B1','B2'],sourceTopics:['ZOUDEN'],familyTags:['MODAAL'],profiles:profiles('ZOUDEN'),subtopics:[
     sub('all','Alles',['A2','B1','B2']),
     sub('beleefd_verzoek','Beleefd verzoek',['A2']),sub('wens','Wens',['A2']),sub('voorzichtig_voorstel','Voorzichtig voorstel',['A2']),sub('toestemming','Toestemming',['A2']),sub('voorkeur','Voorkeur',['A2']),
     sub('advies','Advies',['B1']),sub('hypothese','Hypothese',['B1']),sub('toekomst_in_verleden','Toekomst in het verleden',['B1']),sub('mogelijkheid','Mogelijkheid',['B1']),sub('formeel_beleefd','Formeel beleefd',['B1']),
     sub('contrafeitelijk_verleden','Contrafeitelijk verleden',['B2']),sub('gerapporteerde_onzekerheid','Gerapporteerde onzekerheid',['B2']),sub('voorzichtige_inferentie','Voorzichtige inferentie',['B2']),sub('diplomatiek','Diplomatiek',['B2']),sub('hypothetische_consequentie','Hypothetische consequentie',['B2'])
    ]},
    {id:'MODAAL',label:'Modale mix: ZULLEN en ZOUDEN',description:'Combineert de bestaande ZULLEN en ZOUDEN records zonder kopieën.',levels:['A2','B1','B2'],sourceTopics:['ZULLEN','ZOUDEN'],familyTags:['MODAAL'],profiles:profiles('MODAAL'),subtopics:[sub('all','Alles',['A2','B1','B2'])]}
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
   {id:'produce',label:'Zelf produceren',exerciseTypes:['scenario','dialoog_aanvullen','vrije_productie']}
  ],
  productionModes:[{id:'all',label:'Gemengd'},{id:'receptief',label:'Receptief'},{id:'productief',label:'Productief'}],
  difficulties:[{id:'all',label:'Gemengd'},{id:'basis',label:'Basis'},{id:'midden',label:'Gemiddeld'},{id:'hoog',label:'Uitdagend'}],
  durations:[{seconds:300,label:'5 minuten'},{seconds:600,label:'10 minuten'},{seconds:900,label:'15 minuten'},{seconds:1200,label:'20 minuten'}],
  organizations:[{id:'class',label:'Klassikaal'},{id:'groups',label:'Groepen'},{id:'pairs',label:"Duo's"},{id:'individual',label:'Individueel'}]
 };
 catalog.registerBank=function(bank,metadata={}){
  const id=metadata.familyId||bank.family_id;
  let family=catalog.families.find(f=>f.id===id);
  if(!family){family={id,label:metadata.label||bank.bank_name,description:metadata.description||'',selection_dimensions:metadata.selection_dimensions||{topic:'required',level:'required',subtopic:'optional',production:'optional',difficulty:'optional'},defaultDifficulty:metadata.defaultDifficulty||'all',topics:[]};catalog.families.push(family)}
  for(const topicId of [...new Set(bank.items.map(i=>i.topic))]){
   const rows=bank.items.filter(i=>i.topic===topicId),levels=[...new Set(rows.map(i=>i.cefr_level))];
   const prior=family.topics.find(t=>t.id===topicId);
   if(prior){prior.levels=[...new Set([...prior.levels,...levels])];continue}
   family.topics.push({id:topicId,label:rows[0].topic_label||topicId,sourceTopics:[topicId],familyTags:[],levels,profiles:[],subtopics:[sub('all','Alles',levels),...[...new Set(rows.map(i=>i.language_function))].map(fn=>sub(fn,fn,levels))]});
  }
  return family;
 };
 if(typeof module==='object'&&module.exports)module.exports=catalog;else root.DIGIBORD_CONTENT_CATALOG=catalog;
})(typeof globalThis!=='undefined'?globalThis:this);
