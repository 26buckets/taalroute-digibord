// Taalroute's fixed wording also applies when displaying a retained lesson version.
(function(root){
 'use strict';
 function text(value){return sourceText(value)
  .replace(/\.\s*:/g,':')
  .replace(/Maak de zin natuurlijk/gi,'Verbeter de zin')
  .replace(/herschrijf natuurlijk:/gi,'herschrijf:')
  .replace(/in deze context natuurlijk\?/gi,'in deze context passend?')
  .replace(/natuurlijk\?/gi,'duidelijk?')
  .replace(/Kies de natuurlijke /gi,'Kies de juiste ')
  .replace(/\bnatuurlijke (?=(?:zin|zinnen|ja[ -]nee|relatieve zin|varianten|mededelende|hoofdzin|dat-zin|vraagwoordvraag|tegenwoordige tijd|en grammaticale woordvolgorde)\b)/gi,'')
  .replace(/\bnatuurlijke (plaats|positie|woordvolgorde|volgorde|neutrale middenveldvolgorde)\b/gi,'juiste $1')
  .replace(/\bnatuurlijke, /gi,'')
  .replace(/\bnatuurlijke variant\b/gi,'passende variant')
  .replace(/\bnatuurlijker\b/gi,'duidelijker')
  .replace(/\bnatuurlijkst\b/gi,'het best')
  .replace(/\bnatuurlijk (voor dagelijks contact|tussen directe collega’s)/gi,'passend $1')
  .replace(/\bnatuurlijk informeel Nederlands\b/gi,'informeel Nederlands')
  .replace(/\bnatuurlijk en proportioneel\b/gi,'duidelijk en passend')
  .replace(/\bnatuurlijk bericht\b/gi,'duidelijk bericht')
  .replace(/\b(correct|grammaticaal) en natuurlijk\b/gi,'$1')
  .replace(/\bnatuurlijk (?=(?:bij|in|aan|met|zonder|verbinden|combineren|ordenen|gebruiken)\b)/gi,'')
  .replace(/\bnatuurlijk (blijven|is|uitdrukt)\b/gi,'duidelijk $1')
  .replace(/\bnatuurlijke middenveldpositie\b/gi,'juiste plaats in de zin')
  .replace(/\bnatuurlijke (spreektaal|bevestiging)\b/gi,'$1')
  .replace(/\bnatuurlijke productie\b/gi,'taalgebruik')
  .replace(/\bnatuurlijke wijzigingsafspraak\b/gi,'afspraak over een wijziging');}
 function sourceText(value){
  const plain=String(value??'').replace(/\bbuur\b/gi,word=>word==='BUUR'?'BUURMAN':word[0]==='B'?'Buurman':'buurman');
  if(!/\bfictie(?:f|ve)\b|\b(?:denkbeeldige|verzonnen) (?:medewerker|persoon|collega|buurman|buurvrouw|ouder|klant|gesprekspartner|vriend|huisgenoot)\b/i.test(plain))return plain;
  // Preserve the source and saved references; remove editorial labels at display time.
  return plain
  .replace(/\bGebruik een fictief kind en fictieve schoolgegevens\./gi,'Kies zelf een naam voor het kind en gegevens over de school.')
  .replace(/\bGebruik (?:alleen|uitsluitend) fictieve (?:gegevens|adresinformatie|huisnummers|beschikbaarheid)\./gi,'Je mag zelf gegevens kiezen.')
  .replace(/\bAccepteer alleen fictieve gegevens\./gi,'De cursist hoeft geen persoonlijke gegevens te delen.')
  .replace(/\bGeen echt werkadres of werkgever verplicht stellen; fictieve antwoorden zijn goed\./gi,'De cursist hoeft geen werkadres of werkgever te noemen.')
  .replace(/\bGebruik fictieve informatie; noem geen echte medische gegevens\./gi,'Noem geen persoonlijke medische gegevens.')
  .replace(/\bJe bent in een fictieve situatie /g,'Je bent ')
  .replace(/\bvoor jezelf of een verzonnen persoon\b/gi,'voor jezelf of iemand anders')
  .replace(/\bKies zelf of voor een verzonnen persoon\./g,'Kies voor jezelf of iemand anders.')
  .replace(/\b(?:De casus|Het scenario) is fictief en niet acuut\./gi,'Er is geen spoed.')
  .replace(/\bDe werksituatie is fictief en vraagt geen echte sleutel of locatie\./gi,'Je hoeft geen sleutel of locatie te delen.')
  .replace(/\bAlle partnergegevens zijn fictief en openbaar; er wordt geen privékanaal geclaimd\./gi,'De gegevens van beide rollen staan op de kaart.')
  .replace(/\bAlle rolgegevens zijn fictief en openbaar op het gedeelde bord\./gi,'De rolgegevens staan op het bord.')
  .replace(/\bHet verhaal is fictief; laat geen echte adressen of bezorggegevens noemen\./gi,'Laat geen persoonlijke adressen of bezorggegevens noemen.')
  .replace(/\b(?:Alle|De|Het) [^.!?\n<>]*?\b(?:is|zijn) fictief\.[ \t]*/gi,'')
  .replace(/\b(?:mag|mogen) fictief zijn\b/gi,'mag je zelf bedenken')
  .replace(/\bfictief (?:mag|mogen) zijn\b/gi,'zelf bedacht mag worden')
  .replace(/,\s*fictief of\b/gi,' of')
  .replace(/\bHet fictieve personage\b/g,'De medewerker')
  .replace(/\bhet fictieve personage\b/g,'de medewerker')
  .replace(/\bfictief sollicitatiepersonage\b/gi,'sollicitant')
  .replace(/\bJe speelt een fictieve ouder\b/g,'Je bent een ouder')
  .replace(/\bvoeg ik een fictief motief toe\b/gi,'voeg ik een motief toe dat niet in de tekst staat')
  .replace(/\bfictie(?:f|ve)\b[ \t\u00a0]*/gi,'')
  .replace(/\b(?:denkbeeldige|verzonnen) (?=(?:medewerker|persoon|collega|buurman|buurvrouw|ouder|klant|gesprekspartner|vriend|huisgenoot)\b)/gi,'');
 }
 const audio=card=>card?.id==='TR-TONGUE-D240-A2-018'?'assets/audio/tongbrekers/tr-tongue-d240-a2-018-woordkeuze.mp3':card?.audio?.src;
 const api={text,sourceText,audio};if(typeof module==='object'&&module.exports)module.exports=api;else root.AppWording=api;
})(typeof globalThis!=='undefined'?globalThis:this);
