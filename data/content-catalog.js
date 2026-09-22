(function(root){
 const levels=['A2','B1','B2'];
 const profile=(topic,level)=>({id:'SP_GRAM_'+topic+'_'+level+'_PB001',label:(topic==='MODAAL'?'Modale werkwoorden':topic)+' '+level+' compleet',level});
 const topics=[
  {id:'ER',label:'ER',description:'Plaats, hoeveelheid, presentatief er, voornaamwoordelijke bijwoorden, passief en formele constructies.',levels,profiles:levels.map(level=>profile('ER',level))},
  {id:'ZULLEN',label:'ZULLEN',description:'Voorstel, aanbod, belofte, voorspelling, verwachting, formele en modale functies.',levels,profiles:levels.map(level=>profile('ZULLEN',level))},
  {id:'ZOUDEN',label:'ZOUDEN',description:'Beleefdheid, advies, hypothese, toekomst in het verleden, onzekerheid en contrafeitelijkheid.',levels,profiles:levels.map(level=>profile('ZOUDEN',level))},
  {id:'MODAAL',label:'Modale mix',description:'Selecteert de bestaande ZULLEN en ZOUDEN records via MODAAL zonder inhoud te dupliceren.',levels,profiles:levels.map(level=>profile('MODAAL',level))}
 ];
 const labels={
  plaats:'Plaats',hoeveelheid:'Hoeveelheid',presentatief:'Presentatief er',richting:'Richting',woordvolgorde:'Woordvolgorde',functieonderscheid:'Functieonderscheid',
  voornaamwoordelijk_bijwoord:'Voornaamwoordelijk bijwoord',vaste_combinatie:'Vaste combinatie',passief_onpersoonlijk:'Onpersoonlijk passief',onpersoonlijk_passief:'Onpersoonlijk passief',
  abstract_existenteel:'Abstract existentieel',blijken_lijken:'Blijken en lijken',complex_voornaamwoordelijk_bijwoord:'Complex voornaamwoordelijk bijwoord',rapportage_met_bijzin:'Rapportage met bijzin',register_en_argumentatie:'Register en argumentatie',
  voorstel:'Voorstel',aanbod:'Aanbod',belofte:'Belofte',voorspelling:'Voorspelling',toekomstige_mededeling:'Toekomstige mededeling',
  verwachting:'Verwachting',noodzaak:'Noodzaak',formeel:'Formeel',waarschuwing_stelligheid:'Waarschuwing en stelligheid',toezegging:'Toezegging',
  aanname:'Aanname',projectie:'Projectie',nuance:'Nuance',formeel_argumentatief:'Formeel argumentatief',zekerheid_en_grens:'Zekerheid en grens',
  beleefd_verzoek:'Beleefd verzoek',wens:'Wens',voorzichtig_voorstel:'Voorzichtig voorstel',toestemming:'Toestemming',voorkeur:'Voorkeur',
  advies:'Advies',hypothese:'Hypothese',toekomst_in_verleden:'Toekomst in het verleden',mogelijkheid:'Mogelijkheid',formeel_beleefd:'Formeel beleefd',
  contrafeitelijk_verleden:'Contrafeitelijk verleden',gerapporteerde_onzekerheid:'Gerapporteerde onzekerheid',voorzichtige_inferentie:'Voorzichtige inferentie',diplomatiek:'Diplomatiek',hypothetische_consequentie:'Hypothetische consequentie'
 };
 const catalog={
  version:'2.0',
  families:[{id:'grammar',label:'Grammatica',description:'Oefen grammaticale vormen en functies.',topics}],
  functionLabel:id=>labels[id]||String(id||'').replaceAll('_',' ').replace(/^./,m=>m.toUpperCase()),
  focuses:[
   {id:'all',label:'Gemengd',exerciseTypes:[]},
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
  organizations:[{id:'class',label:'Klassikaal'},{id:'groups',label:'Groepen'},{id:'individual',label:'Individueel'}],
  engines:[
   {id:'BOARD',label:'Speelbord',description:'Volg een route en krijg bij ieder oefenmoment een opdracht.',variants:[{id:'rotterdam',label:'Rotterdam'},{id:'zwolle',label:'Zwolle'}]},
   {id:'WHEEL',label:'Draaischijf',description:'Draai en open een opdracht uit dezelfde sessieselectie.',variants:[{id:'draaiwiel',label:'Draaischijf'}]},
   {id:'CARDS',label:'Kaarten',description:'Trek opdrachten als kaarten uit dezelfde sessieselectie.',variants:[{id:'content-grammar',label:'Canonieke grammaticakaarten'}]}
  ]
 };
 if(typeof module==='object'&&module.exports)module.exports=catalog;else root.DIGIBORD_CONTENT_CATALOG=catalog;
})(typeof globalThis!=='undefined'?globalThis:this);
