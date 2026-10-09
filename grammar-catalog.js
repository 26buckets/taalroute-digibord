(function(root){
 'use strict';
 // Presentation only. Source IDs, banks, item references and release gates stay authoritative.
 const definition={
 "version": 1,
 "categories": [
  {
   "id": "grammar-1",
   "label": "Zinnen maken"
  },
  {
   "id": "grammar-2",
   "label": "Vragen stellen"
  },
  {
   "id": "grammar-3",
   "label": "Werkwoorden en tijden"
  },
  {
   "id": "grammar-4",
   "label": "Modale werkwoorden"
  },
  {
   "id": "grammar-5",
   "label": "Niet, geen en er"
  },
  {
   "id": "grammar-6",
   "label": "Bijzinnen en verbindingen"
  },
  {
   "id": "grammar-7",
   "label": "Relatieve zinnen"
  },
  {
   "id": "grammar-8",
   "label": "Woorden in de zin"
  },
  {
   "id": "grammar-9",
   "label": "Formuleren en samenhang"
  }
 ],
 "subjects": [
  {
   "id": "g-hoofdzin",
   "label": "Gewone hoofdzin",
   "categories": [
    "grammar-1"
   ],
   "sources": [
    "WZ_001"
   ],
   "terms": "zinsbouw zin bouwen gewone zin onderwerp persoonsvorm",
   "goal": "Een korte zin maken",
   "example": "Ik werk."
  },
  {
   "id": "g-onderwerp-persoonsvorm",
   "label": "Onderwerp en persoonsvorm",
   "categories": [
    "grammar-1",
    "grammar-8"
   ],
   "sources": [
    "WZ_002",
    "WZ_012"
   ],
   "terms": "wie doet wat werkwoord langere zinnen",
   "goal": "Onderwerp en persoonsvorm herkennen",
   "example": "De cursist werkt vandaag."
  },
  {
   "id": "g-uitbreiden",
   "label": "Zinnen uitbreiden",
   "categories": [
    "grammar-1"
   ],
   "sources": [
    "WZ_011",
    "WZ_019"
   ],
   "terms": "gewone zin langer extra informatie tijd plaats",
   "goal": "Een zin langer maken",
   "example": "Ik werk vandaag thuis."
  },
  {
   "id": "g-inversie",
   "label": "Inversie: tijd of plaats vooraan",
   "categories": [
    "grammar-1"
   ],
   "sources": [
    "WZ_010",
    "WZ_018",
    "WZ_020"
   ],
   "terms": "omgekeerde volgorde inversie morgen vandaag eerst tijd plaats",
   "goal": "Tijd of plaats vooraan zetten",
   "example": "Vandaag werk ik thuis."
  },
  {
   "id": "g-woordvolgorde",
   "label": "Woordvolgorde",
   "categories": [
    "grammar-1"
   ],
   "sources": [
    "WOORDVOLGORDE"
   ],
   "terms": "zinsvolgorde inversie hoofdzin bijzin onderwerp persoonsvorm",
   "goal": "Woordvolgorde in verschillende zinnen oefenen",
   "example": "Ik werk thuis. Vandaag werk ik thuis. Je weet dat ik thuis werk."
  },
  {
   "id": "g-janee",
   "label": "Ja/nee-vragen",
   "categories": [
    "grammar-2"
   ],
   "sources": [
    "WZ_004"
   ],
   "terms": "ja nee vraag vragen stellen",
   "goal": "Een vraag maken met ja of nee als antwoord",
   "example": "Werk je vandaag?"
  },
  {
   "id": "g-vraagwoorden",
   "label": "Vraagwoorden en uitgebreidere vragen",
   "categories": [
    "grammar-2"
   ],
   "sources": [
    "WZ_005",
    "WZ_014"
   ],
   "terms": "vraagwoordvraag vraagwoorden wie wat waar wanneer waarom hoe hoeveel extra informatie",
   "goal": "Vragen wie, wat, waar, wanneer of waarom",
   "example": "Waar werk je vandaag?"
  },
  {
   "id": "g-tegenwoordige-tijd",
   "label": "Tegenwoordige tijd",
   "categories": [
    "grammar-3"
   ],
   "sources": [
    "WZ_003",
    "WZ_013"
   ],
   "terms": "nu vandaag morgen tijd plaats werkwoord vervoegen ott",
   "goal": "Het werkwoord in de tegenwoordige tijd zetten",
   "example": "Ik werk. Zij werkt."
  },
  {
   "id": "g-voltooide-tijd",
   "label": "Voltooide tijd",
   "categories": [
    "grammar-3"
   ],
   "sources": [
    "WZ_023"
   ],
   "terms": "verleden tijd perfectum voltooid deelwoord hebben zijn",
   "goal": "Vertellen wat je hebt gedaan",
   "example": "Ik heb gisteren gewerkt."
  },
  {
   "id": "g-werkwoordstijden",
   "label": "Werkwoordstijden",
   "categories": [
    "grammar-3"
   ],
   "sources": [
    "WERKWOORDSTIJDEN"
   ],
   "terms": "verleden tijd imperfectum perfectum tegenwoordige tijd toekomstige tijd ott ovt vtt vvt",
   "goal": "Werkwoordstijden kiezen en gebruiken",
   "example": "Ik werk. Ik werkte. Ik heb gewerkt."
  },
  {
   "id": "g-scheidbaar",
   "label": "Scheidbare werkwoorden en te + infinitief",
   "categories": [
    "grammar-3",
    "grammar-6"
   ],
   "sources": [
    "WZ_022",
    "SCHEIDBARE_WERKWOORDEN_TE_INFINITIEF"
   ],
   "terms": "opbellen afspreken scheiden scheidbaar om te infinitief",
   "goal": "Een scheidbaar werkwoord in de zin zetten",
   "example": "Ik bel je op. Ik probeer je op te bellen."
  },
  {
   "id": "g-twee-werkwoorden",
   "label": "Twee werkwoorden en werkwoordgroepen",
   "categories": [
    "grammar-3",
    "grammar-6"
   ],
   "sources": [
    "WZ_024",
    "WZ_033"
   ],
   "terms": "twee werkwoorden werkwoordgroep bijzin infinitief",
   "goal": "Twee of meer werkwoorden op de juiste plaats zetten",
   "example": "Ik wil morgen werken. Ik zeg dat ik morgen wil werken."
  },
  {
   "id": "g-modale-werkwoorden",
   "label": "Modale werkwoorden samen oefenen",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "WZ_008",
    "WZ_016"
   ],
   "terms": "kunnen moeten mogen willen hoeven modaliteit praktijksituaties",
   "goal": "Kunnen, moeten, mogen en andere modale werkwoorden oefenen",
   "example": "Ik kan komen, maar ik moet werken."
  },
  {
   "id": "g-kunnen",
   "label": "Kunnen",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "KUNNEN"
   ],
   "terms": "kan kon konden mogelijkheid",
   "goal": "Zinnen maken met kunnen",
   "example": "Ik kan zwemmen."
  },
  {
   "id": "g-moeten",
   "label": "Moeten",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "MOETEN"
   ],
   "terms": "moet moest moesten verplichting",
   "goal": "Zinnen maken met moeten",
   "example": "Ik moet werken."
  },
  {
   "id": "g-mogen",
   "label": "Mogen",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "MOGEN"
   ],
   "terms": "mag mocht mochten toestemming",
   "goal": "Zinnen maken met mogen",
   "example": "Mag ik hier zitten?"
  },
  {
   "id": "g-willen",
   "label": "Willen",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "WILLEN"
   ],
   "terms": "wil wilde wilden wens",
   "goal": "Zinnen maken met willen",
   "example": "Ik wil Nederlands leren."
  },
  {
   "id": "g-hoeven",
   "label": "Hoeven",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "HOEVEN"
   ],
   "terms": "hoeft hoefde niet geen noodzaak",
   "goal": "Zinnen maken met hoeven",
   "example": "Je hoeft niet te wachten."
  },
  {
   "id": "g-zullen",
   "label": "Zullen",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "ZULLEN"
   ],
   "terms": "zal voorstel toekomst",
   "goal": "Zinnen maken met zullen",
   "example": "Zullen we beginnen?"
  },
  {
   "id": "g-zouden",
   "label": "Zouden",
   "categories": [
    "grammar-4"
   ],
   "sources": [
    "ZOUDEN"
   ],
   "terms": "zou beleefd verzoek advies hypothese",
   "goal": "Zinnen maken met zouden",
   "example": "Zou u mij kunnen helpen?"
  },
  {
   "id": "g-niet",
   "label": "Niet",
   "categories": [
    "grammar-5"
   ],
   "sources": [
    "WZ_006"
   ],
   "terms": "ontkenning negatie niet geen",
   "goal": "Een zin ontkennen met niet",
   "example": "Ik werk vandaag niet."
  },
  {
   "id": "g-geen",
   "label": "Geen",
   "categories": [
    "grammar-5"
   ],
   "sources": [
    "WZ_007"
   ],
   "terms": "ontkenning negatie niet geen",
   "goal": "Een zin ontkennen met geen",
   "example": "Ik heb geen auto."
  },
  {
   "id": "g-niet-geen",
   "label": "Niet of geen",
   "categories": [
    "grammar-5"
   ],
   "sources": [
    "WZ_006_007",
    "WZ_015"
   ],
   "terms": "contrast ontkenning negatie niet geen uitgebreidere zinnen",
   "goal": "Kiezen tussen niet en geen",
   "example": "Ik heb geen auto. Ik fiets niet."
  },
  {
   "id": "g-er",
   "label": "Er",
   "categories": [
    "grammar-5"
   ],
   "sources": [
    "ER",
    "WZ_009",
    "WZ_021",
    "WZ_038"
   ],
   "terms": "aanwezigheid presentatief plaats hoeveelheid gebeurtenissen er is er zijn",
   "goal": "Er op de juiste manier gebruiken",
   "example": "Er staat een fiets. Ik woon er. Ik heb er twee."
  },
  {
   "id": "g-plaatswerkwoorden",
   "label": "Staan, liggen, zitten en hangen",
   "categories": [
    "grammar-3",
    "grammar-5"
   ],
   "sources": [
    "WZ_017"
   ],
   "terms": "er plaatswerkwoorden locatie aanwezigheid",
   "goal": "Zeggen waar iets staat, ligt, zit of hangt",
   "example": "Er liggen twee boeken op tafel."
  },
  {
   "id": "g-bijzinnen",
   "label": "Hoofdzinnen en bijzinnen combineren",
   "categories": [
    "grammar-6",
    "grammar-1"
   ],
   "sources": [
    "WZ_025",
    "WZ_031",
    "VOEGWOORDEN_EN_BIJZINNEN"
   ],
   "terms": "omdat dat als terwijl voegwoord verbindingswoorden zinnen verbinden",
   "goal": "Een hoofdzin en een bijzin verbinden",
   "example": "Ik blijf thuis omdat ik ziek ben."
  },
  {
   "id": "g-reden",
   "label": "Reden en oorzaak",
   "categories": [
    "grammar-6",
    "grammar-9"
   ],
   "sources": [
    "WZ_026",
    "WZ_035"
   ],
   "terms": "omdat want doordat daardoor waarom",
   "goal": "Vertellen waarom iets gebeurt",
   "example": "Ik ga naar huis omdat ik moe ben."
  },
  {
   "id": "g-doel",
   "label": "Doel uitdrukken met om te",
   "categories": [
    "grammar-6"
   ],
   "sources": [
    "WZ_027",
    "WZ_039"
   ],
   "terms": "om te zodat doel infinitief",
   "goal": "Zeggen waarvoor je iets doet met om te",
   "example": "Ik bel om een afspraak te maken."
  },
  {
   "id": "g-gevolg",
   "label": "Gevolg en doel",
   "categories": [
    "grammar-6"
   ],
   "sources": [
    "WZ_036"
   ],
   "terms": "zodat daarom dus daardoor gevolg",
   "goal": "Een gevolg of doel aangeven",
   "example": "Ik zet de wekker, zodat ik op tijd wakker word."
  },
  {
   "id": "g-voorwaarden",
   "label": "Voorwaarden met als",
   "categories": [
    "grammar-6"
   ],
   "sources": [
    "WZ_034"
   ],
   "terms": "als indien mits tenzij voorwaarde",
   "goal": "Zeggen onder welke voorwaarde iets kan",
   "example": "Als je tijd hebt, kun je mij bellen."
  },
  {
   "id": "g-tijdrelaties",
   "label": "Tijdrelaties",
   "categories": [
    "grammar-6"
   ],
   "sources": [
    "WZ_037"
   ],
   "terms": "voordat nadat terwijl toen wanneer voor na",
   "goal": "Zeggen wat vóór, na of tegelijk met iets gebeurt",
   "example": "Voordat ik vertrek, controleer ik mijn tas."
  },
  {
   "id": "g-verbindingen",
   "label": "Volgorde en verbindingswoorden",
   "categories": [
    "grammar-6",
    "grammar-9"
   ],
   "sources": [
    "WZ_028",
    "WZ_040"
   ],
   "terms": "eerst daarna vervolgens en maar want omdat samenhang signaalwoorden",
   "goal": "Verbindingswoorden gebruiken voor volgorde en samenhang",
   "example": "Eerst ontbijt ik. Daarna ga ik naar mijn werk."
  },
  {
   "id": "g-relatieve-zinnen",
   "label": "Relatieve zinnen met die en dat",
   "categories": [
    "grammar-7"
   ],
   "sources": [
    "RELATIEVE_BIJZIN",
    "WZ_029",
    "WZ_032"
   ],
   "terms": "die dat betrekkelijke bijzin betrekkelijk voornaamwoord relatieve bijzin herkennen voorbereiden",
   "goal": "Extra informatie geven met die of dat",
   "example": "Dit is de docent die Nederlands geeft."
  },
  {
   "id": "g-voorzetsels-voornaamwoorden",
   "label": "Voorzetsels en voornaamwoorden",
   "categories": [
    "grammar-8"
   ],
   "sources": [
    "VOORZETSELS_EN_VOORNAAMWOORDEN"
   ],
   "terms": "in op aan met voor voorzetsel persoonlijk bezittelijk aanwijzend voornaamwoord",
   "goal": "Voorzetsels en verwijswoorden kiezen",
   "example": "Zij praat met hem over haar werk."
  },
  {
   "id": "g-lidwoorden-adjectieven",
   "label": "Lidwoorden, bijvoeglijke naamwoorden en ontkenning",
   "categories": [
    "grammar-8",
    "grammar-5"
   ],
   "sources": [
    "LIDWOORDEN_ADJECTIEVEN_NEGATIE"
   ],
   "terms": "de het een adjectieven bijvoeglijk naamwoord verbuiging niet geen negatie",
   "goal": "De, het, een, bijvoeglijke naamwoorden en ontkenning oefenen",
   "example": "Het is een grote tas. Het is geen kleine tas."
  },
  {
   "id": "g-passief",
   "label": "Passief herkennen en gebruiken",
   "categories": [
    "grammar-3",
    "grammar-9"
   ],
   "sources": [
    "WZ_041"
   ],
   "terms": "lijdende vorm worden zijn actief passief",
   "goal": "Vertellen wat er met iets wordt gedaan",
   "example": "De brief wordt morgen verstuurd."
  },
  {
   "id": "g-combineren",
   "label": "Zinnen combineren en herschrijven",
   "categories": [
    "grammar-9",
    "grammar-1"
   ],
   "sources": [
    "WZ_030",
    "WZ_042"
   ],
   "terms": "formuleren herschrijven samenvoegen verbinden",
   "goal": "Zinnen samenvoegen of anders formuleren",
   "example": "Ik wil komen, maar ik moet werken."
  },
  {
   "id": "g-mening",
   "label": "Mening, reden en onderbouwing",
   "categories": [
    "grammar-9"
   ],
   "sources": [
    "WZ_043"
   ],
   "terms": "mening argument onderbouwen omdat want",
   "goal": "Een mening geven en onderbouwen",
   "example": "Ik vind de bus handig, omdat hij vaak rijdt."
  },
  {
   "id": "g-samenhang",
   "label": "Samenhang over meerdere zinnen",
   "categories": [
    "grammar-9"
   ],
   "sources": [
    "WZ_044"
   ],
   "terms": "samenhangende zinnen kort verhaal samenvatten eerst daarna",
   "goal": "Van losse zinnen een samenhangend verhaal maken",
   "example": "De trein had vertraging. Daardoor kwam ik later. Ik belde mijn collega."
  }
 ]
};
 const sourceFamilies=['grammar','words'];
 const familyId='grammar-guide';
 const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('nl').replace(/[^a-z0-9]+/g,' ').trim();
 function label(id,fallback){
  if(id==='MODAAL')return 'Mix: zullen en zouden';
  if(id==='MODAAL_ALLES')return 'Mix: alle modale werkwoorden';
  if(id==='MIX')return 'Mijn mix';
  const subject=definition.subjects.find(s=>s.id===id||s.sources.includes(id));
  if(subject)return subject.label;
  const text=String(fallback||id||'').trim();
  if(!text||/\b(?:WZ|GRAM|CB|PB|SP|IT)[ _-]|_\d|^[A-Z\d]+(?:_[A-Z\d]+)+$/.test(text))return 'Onderwerp niet beschikbaar';
  return text===text.toUpperCase()?text[0]+text.slice(1).toLocaleLowerCase('nl'):text.replace(/_/g,' ');
 }
 function matches(topic,query){
  const subject=definition.subjects.find(s=>s.id===topic.id||s.sources.includes(topic.id));
  const haystack=normalize([topic.label,subject?.goal,subject?.example,subject?.terms,...(subject?.categories||[]).map(id=>definition.categories.find(c=>c.id===id).label),...(topic.subtopics||[]).map(s=>s.label)].join(' '));
  return normalize(query).split(' ').filter(Boolean).every(word=>haystack.includes(word));
 }
 function project(catalog,runtime,routes){
  const available=runtime.availableForPreparation();
  const family={id:familyId,label:'Grammatica en zinsbouw',description:'Kies wat je wilt oefenen.',defaultDifficulty:'all',selection_dimensions:{topic:'required',level:'optional'},topics:[]};
  for(const s of definition.subjects){
   const rows=available.filter(i=>runtime.inTopic(i,s.sources));
   if(!rows.length)continue;
   family.topics.push({...s,sourceTopics:s.sources,sourceFamilies,levels:routes.ordered(rows.map(i=>routes.classification(i).displayRoute)),familyTags:[],profiles:[],subtopics:[{id:'all',label:'Alles'}]});
  }
  catalog.families=catalog.families.filter(f=>f.id!==familyId);
  catalog.families.unshift(family);
  return family;
 }
 const api=Object.freeze({...definition,familyId,sourceFamilies,label,matches,project});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.GrammarCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this);
