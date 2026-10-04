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
   "terms": "zinsbouw zin bouwen gewone zin onderwerp persoonsvorm"
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
   "terms": "wie doet wat werkwoord langere zinnen"
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
   "terms": "gewone zin langer extra informatie tijd plaats"
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
   "terms": "omgekeerde volgorde inversie morgen vandaag eerst tijd plaats"
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
   "terms": "zinsvolgorde inversie hoofdzin bijzin onderwerp persoonsvorm"
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
   "terms": "ja nee vraag vragen stellen"
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
   "terms": "vraagwoordvraag vraagwoorden wie wat waar wanneer waarom hoe hoeveel extra informatie"
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
   "terms": "nu vandaag morgen tijd plaats werkwoord vervoegen ott"
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
   "terms": "verleden tijd perfectum voltooid deelwoord hebben zijn"
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
   "terms": "verleden tijd imperfectum perfectum tegenwoordige tijd toekomstige tijd ott ovt vtt vvt"
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
   "terms": "opbellen afspreken scheiden scheidbaar om te infinitief"
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
   "terms": "twee werkwoorden werkwoordgroep bijzin infinitief"
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
   "terms": "kunnen moeten mogen willen hoeven modaliteit praktijksituaties"
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
   "terms": "kan kon konden mogelijkheid"
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
   "terms": "moet moest moesten verplichting"
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
   "terms": "mag mocht mochten toestemming"
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
   "terms": "wil wilde wilden wens"
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
   "terms": "hoeft hoefde niet geen noodzaak"
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
   "terms": "zal voorstel toekomst"
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
   "terms": "zou beleefd verzoek advies hypothese"
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
   "terms": "ontkenning negatie niet geen"
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
   "terms": "ontkenning negatie niet geen"
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
   "terms": "contrast ontkenning negatie niet geen uitgebreidere zinnen"
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
   "terms": "aanwezigheid presentatief plaats hoeveelheid gebeurtenissen er is er zijn"
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
   "terms": "er plaatswerkwoorden locatie aanwezigheid"
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
   "terms": "omdat dat als terwijl voegwoord verbindingswoorden zinnen verbinden"
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
   "terms": "omdat want doordat daardoor waarom"
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
   "terms": "om te zodat doel infinitief"
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
   "terms": "zodat daarom dus daardoor gevolg"
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
   "terms": "als indien mits tenzij voorwaarde"
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
   "terms": "voordat nadat terwijl toen wanneer voor na"
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
   "terms": "eerst daarna vervolgens en maar want omdat samenhang signaalwoorden"
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
   "terms": "die dat betrekkelijke bijzin betrekkelijk voornaamwoord relatieve bijzin herkennen voorbereiden"
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
   "terms": "in op aan met voor voorzetsel persoonlijk bezittelijk aanwijzend voornaamwoord"
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
   "terms": "de het een adjectieven bijvoeglijk naamwoord verbuiging niet geen negatie"
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
   "terms": "lijdende vorm worden zijn actief passief"
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
   "terms": "formuleren herschrijven samenvoegen verbinden"
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
   "terms": "mening argument onderbouwen omdat want"
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
   "terms": "samenhangende zinnen kort verhaal samenvatten eerst daarna"
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
  if(!text||/\b(?:WZ|GRAM|CB|PB|SP|IT)[_-]|_\d|^[A-Z\d]+(?:_[A-Z\d]+)+$/.test(text))return 'Onderwerp niet beschikbaar';
  return text===text.toUpperCase()?text[0]+text.slice(1).toLocaleLowerCase('nl'):text.replace(/_/g,' ');
 }
 function matches(topic,query){
  const subject=definition.subjects.find(s=>s.id===topic.id||s.sources.includes(topic.id));
  const haystack=normalize([topic.label,subject?.terms,...(subject?.categories||[]).map(id=>definition.categories.find(c=>c.id===id).label),...(topic.subtopics||[]).map(s=>s.label)].join(' '));
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
