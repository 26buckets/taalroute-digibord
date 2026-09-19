// De drie JSON-bestanden in Lessen/taalworp-sets/ zijn de onderhouden, leidende bron (aangeleverd door
// Nico/ChatGPT). Deze wrapper zet ze om naar een laadbaar .js-bestand, exact zoals build-matrix.cjs dat al
// doet voor Lessen/opdrachtenmatrix.json. Claude genereert of wijzigt hier geen onderwijsinhoud — alleen
// integriteitscontroles die aantonen dat de generieke resolver op deze data kan vertrouwen.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.join(__dirname,'../Lessen/taalworp-sets');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'Taalworp_A2_content_manifest_v1.0.json'),'utf8'));
const setRegistry=JSON.parse(fs.readFileSync(path.join(dir,'Taalworp_A2_setregister_v1.0.json'),'utf8'));
const setArchitecture=JSON.parse(fs.readFileSync(path.join(dir,'Taalworp_A2_setarchitectuur_v1.0.json'),'utf8'));

// Integriteitscontroles: elke recordId in elke set moet echt in het manifest bestaan en vrijgegeven zijn.
// Dit is verificatie van aangeleverde content, geen contentgeneratie.
const verbIds=new Set(Object.keys(manifest.verbs));
const patternIds=new Set(Object.keys(manifest.verbPatterns));
for(const [setId,s] of Object.entries(setRegistry.sets)){
 if(s.contentKind==='verb'){
  for(const rid of s.recordIds){
   assert.ok(verbIds.has(rid),`${setId}: onbekend werkwoord-recordId ${rid}`);
   assert.equal(manifest.verbs[rid].releaseEligible,true,`${setId}: ${rid} is niet vrijgegeven`);
  }
  assert.equal(s.recordIds.length,s.recordCount,`${setId}: recordCount komt niet overeen met recordIds.length`);
 } else if(s.contentKind==='verb_pattern'){
  for(const rid of s.recordIds){
   assert.ok(patternIds.has(rid),`${setId}: onbekend patroon-recordId ${rid}`);
   assert.equal(manifest.verbPatterns[rid].releaseEligible,true,`${setId}: ${rid} is niet vrijgegeven`);
  }
  assert.equal(s.recordIds.length,s.recordCount,`${setId}: recordCount komt niet overeen met recordIds.length`);
 } else if(s.contentKind==='dynamic'){
  assert.equal(s.recordIds.length,0,`${setId}: dynamic set mag geen statische recordIds hebben`);
 }
}

fs.writeFileSync(path.join(dir,'..','taalworp-sets-data.js'),
 'globalThis.TaalworpA2ContentManifest='+JSON.stringify(manifest)+';\n'+
 'globalThis.TaalworpA2SetRegistry='+JSON.stringify(setRegistry)+';\n'+
 'globalThis.TaalworpA2SetArchitecture='+JSON.stringify(setArchitecture)+';\n');
console.log(`Built Taalworp set data: ${Object.keys(setRegistry.sets).length} sets, ${verbIds.size} verbs, ${patternIds.size} verbPatterns.`);
