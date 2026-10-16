const assert=require('node:assert/strict'),fs=require('node:fs');
const choices=require('../taalworp-choices.js'),manifest=require('../data/taalworp/Taalworp_A2_content_manifest_v1.0.json');
const verb=manifest.verbs.VRB_WERKEN;
for(const v of Object.values(manifest.verbs))for(const level of ['A0','A1','A1+','A2','B1','B2','C1','C2']){
 const who=choices.values(manifest,'WHO',level,v);
 assert.equal(new Set(who.map(w=>w.id)).size,who.length);
 assert.ok(who.every(w=>choices.subjectFits(w,v)));
 for(const id of Object.keys(manifest.diceFamilies))for(const value of choices.values(manifest,id,level,v))assert.ok(choices.label(id,value));
}
assert.ok(choices.values(manifest,'WHO','A2',verb).some(v=>v.label==='de machine'));
assert.ok(!choices.values(manifest,'WHO','A2',manifest.verbs.VRB_ETEN).some(v=>v.label==='de machine'));
assert.equal(choices.values(manifest,'CONNECT_2','A1',verb).length,0);
assert.deepEqual(choices.values(manifest,'CONNECT_1','A1',verb).map(v=>v.label),['en']);
assert.equal(choices.values(manifest,'TENSE','A1',verb).length,1);
assert.ok(choices.values(manifest,'CONNECT_2','B2',verb).some(v=>v.label==='hoewel'));
assert.ok(!choices.values(manifest,'CONNECT_2','A2',verb).some(v=>v.label==='hoewel'));
assert.ok(!choices.values(manifest,'SENTENCE_TYPE','B2',verb,{WHO:{active:true}}).some(v=>v.recipe==='imperative'));
assert.ok(choices.values(manifest,'SENTENCE_TYPE','B2',verb).some(v=>v.recipe==='imperative'));
assert.ok(!choices.values(manifest,'SENTENCE_TYPE','B2',verb,{CONNECT_1:{active:true}}).some(v=>['yes_no_question','wh_question'].includes(v.recipe)));
assert.ok(!/Nu · TT|OVT|VTT/.test(['present','past','perfect'].map(code=>choices.label('TENSE',{code})).join(' ')));
assert.ok(fs.readFileSync('index.html','utf8').indexOf('taalworp-choices.js')<fs.readFileSync('index.html','utf8').indexOf('app.js?v='));
console.log('PASS: all 303 verbs and eight levels, compatible subjects, level progression, clear labels, imperative conditions and runtime inclusion.');

// Check concrete new examples against independently written expected sentences.
const vm=require('node:vm'),source=fs.readFileSync('app.js','utf8'),context=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function taalworpExample('),source.indexOf('let languageBusy=')),context);
const example=(verbId,subject,tense,recipe='declarative')=>{context.verb=manifest.verbs[verbId];context.values={WHO:choices.values(manifest,'WHO','B2',context.verb).find(w=>w.label===subject),TENSE:{code:tense},SENTENCE_TYPE:{recipe}};return vm.runInContext('taalworpExample(verb,values)',context)};
assert.equal(example('VRB_ETEN','de hond','present'),'De hond eet brokjes.');
assert.equal(example('VRB_ETEN','de hond','past'),'De hond at brokjes.');
assert.equal(example('VRB_ETEN','de hond','perfect'),'De hond heeft brokjes gegeten.');
assert.equal(example('VRB_WERKEN','de vrouw','present','yes_no_question'),'Werkt de vrouw thuis?');
assert.equal(example('VRB_WERKEN','de kinderen','past'),'De kinderen werkten thuis.');
assert.equal(example('VRB_WONEN','de vrouw','present','fronted_place'),'Hier woont de vrouw.');
assert.equal(example('VRB_WERKEN','de man','present','imperative'),'Werk thuis.');
console.log('PASS: new animal/person agreement, three tenses, inversion, place first and imperative examples.');
