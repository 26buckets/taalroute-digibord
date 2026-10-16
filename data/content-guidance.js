(function(root){
 'use strict';
 // Separate from bank items: guidance must never change saved content hashes.
 const data={version:'1.0',reviewed_on:'2026-09-22',sources:{
  bow:{title:'BOWKIT · Toezicht in de Klas',version:'juni 2023; bronbesluit 16 juli 2026',url:'https://docs.google.com/document/d/1kTI5lgqBc30nxSlNLWlm1-X3DibTKmxFetk9o_B8wmI/edit'},
  bowPublic:{title:'BOWKIT · openbare criterialijst',version:'rapport 7 oktober 2025',url:'https://www.bowkit.nl/schools/6333/public_inspection_report'},
  grammar:{title:'GRAM PB 001 · Items',version:'1.2 · GRAM_REV004',url:'https://docs.google.com/spreadsheets/d/1ofjEPAW9Crq4CgLWlsUS-FTubsgvEh4S_giFY4vhxCQ/edit'}
 },criteria:{
  goal:{code:'A1a',name:'Lesdoel in relatie tot leertraject',source:'bow',version:'juni 2023',layer:'BoW',title:'Vertel het doel',teacher:'Vertel wat je gaat oefenen. Leg uit waarom dit past bij de les.',learner:'Zeg wat je gaat oefenen.',observe:'De cursist kan het doel in eigen woorden zeggen.'},
  activate:{code:'A2a',name:'Activering, stimulering en motivatie',source:'bow',version:'juni 2023',layer:'BoW',title:'Laat iedereen meedoen',teacher:'Laat iedereen eerst zelf nadenken. Vraag daarna om antwoorden.',learner:'Denk na en geef een antwoord.',observe:'Je hoort ook cursisten die niet als eerste reageren.'},
  support:{code:'A3f',name:'Maatwerk en differentiatie',source:'bow',version:'juni 2023',layer:'BoW',title:'Geef hulp waar nodig',teacher:'Lees de zin voor als dat helpt. Laat een cursist die klaar is de keuze uitleggen.',learner:'Vraag hulp of leg je keuze uit.',observe:'Je ziet wie hulp nodig heeft en wie de keuze kan uitleggen.'},
  feedback:{code:'A3g',name:'Feedback',source:'bow',version:'juni 2023',layer:'BoW',title:'Bespreek het antwoord',teacher:'Laat de cursist eerst antwoorden. Bespreek daarna wat goed gaat en wat anders kan.',learner:'Luister naar de tip en probeer het opnieuw.',observe:'Je hoort of de cursist de tip gebruikt.'},
  close:{code:'A3a',name:'Structuur van de les',source:'bow',version:'juni 2023',layer:'BoW',title:'Rond samen af',teacher:'Vraag aan het eind wat de cursisten hebben geleerd. Vraag ook wat nog lastig is.',learner:'Vertel wat je nu kunt en waarbij je nog hulp wilt.',observe:'Je hebt een duidelijk punt om in de volgende les op terug te komen.'}
 },examples:{
  erAan:{goal:'Je oefent: Ik denk er vaak aan.',evidence:'Meerkeuzezin over denken aan het examen; Items, rij 182.',source:'grammar'},
  erOver:{goal:'Je oefent: We praten er morgen verder over.',evidence:'Invulzin met er en over; Items, rij 183.',source:'grammar'},
  erOp:{goal:'Je oefent: Ik wacht er al weken op.',evidence:'Woorden in de juiste volgorde zetten met er en op; Items, rij 184.',source:'grammar'}
 },bindings:{
  // Task text and answer inspected individually. These are teaching suggestions,
  // not level validation, observed teaching, or a formal BoW assessment.
  ER_B1_001:{item_version:'1.2',bank_id:'CB-GRAM-001',bow:{example:'erAan',criteria:['goal','activate','support','feedback','close']}},
  ER_B1_002:{item_version:'1.2',bank_id:'CB-GRAM-001',bow:{example:'erOver',criteria:['goal','activate','support','feedback','close']}},
  ER_B1_003:{item_version:'1.2',bank_id:'CB-GRAM-001',bow:{example:'erOp',criteria:['goal','activate','support','feedback','close']}}
 }};
 if(typeof module==='object'&&module.exports)module.exports=data;else root.DIGIBORD_CONTENT_GUIDANCE=data;
})(typeof globalThis!=='undefined'?globalThis:this);
