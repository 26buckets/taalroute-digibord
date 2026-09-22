(function(root){
 const catalog={
  version:'1.0',
  families:[{
   id:'grammar',label:'Grammatica',description:'Oefen grammaticale vormen en functies.',
   topics:[{
    id:'ER',label:'ER',description:'Verwijzen, hoeveelheden, vaste combinaties, passief en woordvolgorde.',
    levels:['B1'],
    profiles:[{id:'SP_GRAM_ER_B1_VERT001',label:'ER B1 compleet',level:'B1'}]
   }]
  }],
  subtopics:[
   {id:'all',label:'Alles'},
   {id:'voornaamwoordelijk_bijwoord',label:'Voornaamwoordelijk bijwoord'},
   {id:'vaste_combinatie',label:'Vaste combinaties'},
   {id:'hoeveelheid',label:'Hoeveelheden'},
   {id:'passief_onpersoonlijk',label:'Onpersoonlijk passief'},
   {id:'woordvolgorde',label:'Woordvolgorde'},
   {id:'functieonderscheid',label:'Functiemix'}
  ],
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
  productionModes:[
   {id:'all',label:'Gemengd'},
   {id:'receptief',label:'Receptief'},
   {id:'productief',label:'Productief'}
  ],
  difficulties:[
   {id:'all',label:'Gemengd'},
   {id:'basis',label:'Basis'},
   {id:'midden',label:'Gemiddeld'},
   {id:'hoog',label:'Uitdagend'}
  ],
  durations:[
   {seconds:300,label:'5 minuten'},
   {seconds:600,label:'10 minuten'},
   {seconds:900,label:'15 minuten'},
   {seconds:1200,label:'20 minuten'}
  ],
  organizations:[
   {id:'class',label:'Klassikaal'},
   {id:'groups',label:'Groepen'},
   {id:'individual',label:'Individueel'}
  ],
  engines:[
   {id:'BOARD',label:'Speelbord',description:'Volg een route en krijg bij ieder oefenmoment een opdracht.',variants:[{id:'rotterdam',label:'Rotterdam'},{id:'zwolle',label:'Zwolle'}]},
   {id:'WHEEL',label:'Draaischijf',description:'Draai en open een opdracht uit dezelfde sessieselectie.',variants:[{id:'draaiwiel',label:'Draaischijf'}]},
   {id:'CARDS',label:'Kaarten',description:'Trek opdrachten als kaarten uit dezelfde sessieselectie.',variants:[{id:'content-vert001',label:'Canonieke kaarten'}]}
  ]
 };
 if(typeof module==='object'&&module.exports)module.exports=catalog;else root.DIGIBORD_CONTENT_CATALOG=catalog;
})(typeof globalThis!=='undefined'?globalThis:this);
