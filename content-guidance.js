(function(root){
 'use strict';
 const data=typeof module==='object'&&module.exports?require('./data/content-guidance.js'):root.DIGIBORD_CONTENT_GUIDANCE;
 const sections={
  lowan:{name:'LOWAN',label:'Leerroute',intro:'Welke leerroute past bij deze oefening?',fields:{routes:'Leerroute',exit:'Vervolgonderwijs of werk',phase:'Stap in de leerroute',goal:'Doel'}},
  erk:{name:'ERK',label:'Taalniveau',intro:'Welk taalniveau past bij deze oefening?',fields:{levels:'Niveauadvies',skill:'Vaardigheid',goal:'Doel'}},
  f:{name:'F',label:'Referentieniveau',intro:'Wat oefen je voor taal op school of op het werk?',fields:{levels:'Referentieniveau',area:'Taalonderdeel',goal:'Doel'}},
  bow:{name:'BoW',label:'Leskwaliteit',intro:'Korte tips voor de docent. Je kijkt zelf wat nodig is in je les.'}
 };
 const esc=value=>(globalThis.AppWording?.text(value)??String(value??'')).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const completion=typeof module==='object'&&module.exports?require('./data/lesson-guidance.js'):root.CompleteLessonGuidance;
 function sourceLink(id,registry=data){const s=registry.sources[id];return s?(/^https:\/\//.test(s.url)?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`:esc(s.title))+` · ${esc(s.version)}`:''}
 function binding(item,registry=data){const b=registry.bindings[item?.content_item_id];return b?.item_version===item?.version?b:registry.historicalBindings?.[item?.content_item_id+'@'+item?.version]}
 function mapping(item,key,registry=data){
  const b=binding(item,registry);
  if(!b||b.item_version!==item.version||b.bank_id!==item.content_bank_id)return null;
  const m=b[key];if(!m)return null;
  if(key==='bow')return registry.examples[m.example]&&m.criteria?.length&&m.criteria.every(id=>registry.criteria[id])?m:null;
  if(!m.version||!m.evidence||!registry.sources[m.source])return null;
  if(m.status==='not_applicable')return m;
  if(m.status==='lesson_use')return ['lowan','f'].includes(key)&&[m.goal,m.use,...(key==='f'?[m.area]:[])].every(v=>typeof v==='string'&&v.trim())?m:null;
  if(['source_level','source_route'].includes(m.status)){const values=m.status==='source_level'?m.levels:m.routes;return key==='erk'&&[m.goal,m.skill].every(v=>typeof v==='string'&&v.trim())&&Array.isArray(values)&&values.length&&values.every(v=>typeof v==='string'&&v.trim())?m:null;}
  return m.status==='reviewed'&&Object.keys(sections[key].fields).every(f=>Array.isArray(m[f])?m[f].length&&m[f].every(v=>typeof v==='string'&&v.trim()):typeof m[f]==='string'&&m[f].trim())?m:null;
 }
 function summarize(items,key,registry=data){
  const entries=items.map(item=>({item,mapping:mapping(item,key,registry)})),known=entries.filter(e=>e.mapping),missing=entries.length-known.length;
  const levels=[...new Set(known.flatMap(e=>e.mapping.levels||e.mapping.routes||[]))];
  let status='Nog niet gekoppeld';
  if(known.length){
   if(key==='bow')status=missing?'Enkele lestips':'Lestips';
   else if(missing)status='Deels gekoppeld';
   else if(known.every(e=>e.mapping.status==='lesson_use'))status=key==='lowan'?'Route bij de cursist':'Taalonderdeel';
   else if(known.every(e=>e.mapping.status==='not_applicable'))status='Niet van toepassing';
   else if(known.some(e=>['not_applicable','lesson_use'].includes(e.mapping.status)))status='Verschilt per opdracht';
   else if(levels.length>1)status='Meerdere';
   else if(known.every(e=>e.mapping.status==='source_route'))status=(levels[0]||'')+' · route';
   else if(known.some(e=>e.mapping.status==='source_level'))status=(levels[0]||'')+(known.every(e=>e.mapping.status==='source_level')?' · bron':' · bron en advies');
   else status=levels[0]||'Gekoppeld';
  }
  return {entries,known,missing,levels,status};
 }
 function buttons(items,selected=null){return Object.entries(sections).map(([key,s])=>`<button type="button" data-guidance="${key}" ${selected?`aria-pressed="${selected===key}"`:''} aria-label="${s.name} · ${s.label}: ${esc(summarize(items,key).status)}" ${selected?'':'aria-haspopup="dialog"'}><span class="guidance-icon guidance-${key}" aria-hidden="true"></span><span>${key==='f'?'Referentie-<br>niveau':s.label}</span></button>`).join('')}
 function row(items){return `<div class="guidance-row" role="group" aria-label="Uitleg bij deze oefeningen">${buttons(items)}</div>`}
 function details(entry,key){
  const m=entry.mapping;
  if(m.status==='not_applicable')return `<p>Niet van toepassing: ${esc(m.evidence)}</p><p>${sourceLink(m.source)} · ${esc(m.version)}</p>`;
  if(m.status==='lesson_use')return `<p>${esc(m.goal)}</p>${m.area?`<p>${esc(m.area)}</p>`:''}<p>${esc(m.use)}</p><p>${esc(m.evidence)}</p><p>${sourceLink(m.source)}</p>`;
  if(m.status==='source_route')return `<dl class="guidance-facts"><div><dt>Route uit de bron</dt><dd>${esc(m.routes.join(', '))}</dd></div><div><dt>Doel</dt><dd>${esc(m.goal)}</dd></div></dl><p>${esc(m.evidence)}</p><p>${sourceLink(m.source)}</p>`;
  return `<dl class="guidance-facts">${Object.entries(sections[key].fields).map(([field,label])=>`<div><dt>${m.status==='source_level'&&field==='levels'?'Niveau uit de bron':label}</dt><dd>${esc(Array.isArray(m[field])?m[field].join(', '):m[field])}</dd></div>`).join('')}</dl><p>${esc(m.evidence)}</p><p>${sourceLink(m.source)} · ${esc(m.version)}</p>`;
 }
 function content(items,key){
  const summary=summarize(items,key),s=sections[key];
  let body=`<h3 id="guidanceHeading" tabindex="-1">${s.name} · ${s.label}</h3><p>${s.intro}</p><p class="guidance-status">${esc(summary.status)}</p>`;
  if(!items.length)return body+'<p>Kies eerst de inhoud die je wilt oefenen.</p>';
  if(summary.missing)body+=`<p>${summary.missing===items.length?'Deze oefeningen zijn nog niet gekoppeld.':`Voor ${summary.missing} van de ${items.length} oefeningen is nog geen koppeling gemaakt.`} Je kunt ze wel gebruiken.</p>`;
  if(key==='bow'){
   if(summary.known.length){
    body+=`<p>Tips bij ${summary.known.length} van de ${items.length} gekozen oefeningen.</p>`;
    const lessons=new Map();
    for(const {item,mapping:m} of summary.known){const lesson=binding(item)?.lesson,example=data.examples[m.example];const key=JSON.stringify([lesson?.goal||example.goal,lesson?.source||example.source]);const group=lessons.get(key)||{lesson,example,items:[],tips:new Map()};group.items.push(item);if(lesson)group.tips.set(JSON.stringify(lesson),lesson);lessons.set(key,group);}
    body+=Array.from(lessons.values()).map(({lesson,example,items:group,tips})=>`<details class="guidance-lesson"><summary>${esc(lesson?.goal||example.goal)}${group.length>1?` (${group.length})`:''}</summary>${lesson?Array.from(tips.values()).map(t=>`<h4>${esc(t.activity)}</h4><dl class="guidance-facts"><div><dt>Hulp</dt><dd>${esc(t.help)}</dd></div><div><dt>Bespreek</dt><dd>${esc(t.check)}</dd></div><div><dt>Daarna</dt><dd>${esc(t.next)}</dd></div></dl>`).join(''):`<p>${esc(example.evidence)}</p>`}<details><summary>Opdrachten bij deze tip</summary>${group.map(item=>`<p>${esc(item.prompt)}</p>`).join('')}</details><p>${sourceLink(lesson?.source||example.source)}</p></details>`).join('');
    const ids=[...new Set(summary.known.flatMap(e=>e.mapping.criteria))];
    body+='<details><summary>Zo kun je de les geven</summary>'+ids.map(id=>{const c=data.criteria[id];return `<section class="guidance-tip"><h4>${esc(c.title)}</h4><dl class="guidance-facts"><div><dt>Docent</dt><dd>${esc(c.teacher)}</dd></div><div><dt>Cursist</dt><dd>${esc(c.learner)}</dd></div><div><dt>Let op</dt><dd>${esc(c.observe)}</dd></div></dl><details><summary>Waar komt deze tip vandaan?</summary><p>Taalroute-lestip bij ${esc(c.layer)} ${esc(c.code)} · ${esc(c.name)}. Dit is geen volledige beoordeling van dit punt.</p><p>${sourceLink(c.source)} · ${esc(c.version)}</p></details></section>`}).join('')+'</details>';
   }
   body+='<p>Een knop voor het antwoord is nog geen feedback. Bespreek het antwoord en kijk of de cursist de tip gebruikt.</p><p>BoW gaat over leskwaliteit. Het is geen taalniveau of keurmerk voor deze oefening. Voor de hele les, het leertraject en de school zijn meer punten van belang.</p><details><summary>Eigen afspraken van Taalroute</summary><p>Er zijn hier nog geen eigen afspraken gekoppeld. Afspraken voor online en klassikaal lesgeven horen apart van BoW.</p></details>';
  }else{
   const uses=summary.known.filter(e=>e.mapping.status==='lesson_use');
   if(uses.length){body+=`<p>${esc(uses[0].mapping.evidence)}</p>`;const tips=[...new Set(uses.map(e=>(e.mapping.area?e.mapping.area+': ':'')+e.mapping.use))];body+=tips.map(t=>`<p>${esc(t)}</p>`).join('')+`<p>${sourceLink(uses[0].mapping.source)}</p>`;}
   body+=summary.known.filter(e=>e.mapping.status!=='lesson_use').map(e=>`<details><summary>${esc(binding(e.item)?.lesson?.goal||e.item.prompt)}</summary>${details(e,key)}</details>`).join('');
   body+='<p>Een niveauadvies bij een opdracht is geen niveautoets. LOWAN, ERK en F worden apart bekeken.</p>';
   if(key==='erk')body+=`<p>${sourceLink('erkLesson')}</p>`;
  }
  return body;
 }
 let openerButton=null;
 if(root.document)document.querySelector('#gameDialog').addEventListener('close',()=>{
  const dlg=document.querySelector('#gameDialog');
  // A queued close event can arrive after the next click has reopened the dialog.
  if(dlg.open)return;
  if(dlg.classList.contains('guidance-dialog')){
   dlg.classList.remove('guidance-dialog');
   // Native closing already restores focus; do not steal a later keyboard choice.
   if(document.activeElement===document.body||dlg.contains(document.activeElement))openerButton?.focus();
   openerButton=null;
  }
 });
 function open(items,key,opener){
  if(!sections[key])return;
  const dlg=document.querySelector('#gameDialog');
  // Reuse the existing dialog; never replace a task already open on the board.
  if(dlg.open&&!dlg.classList.contains('guidance-dialog'))return;
  if(!dlg.open)openerButton=opener;
  dlg.classList.add('guidance-dialog');dlg.setAttribute('aria-labelledby','dialogTitle');
  root.openGameDialog('Bij deze oefeningen',`<div class="guidance-row" role="group" aria-label="Kies uitleg">${buttons(items,key)}</div><div class="guidance-content">${content(items,key)}</div>`,()=>{
   dlg.querySelectorAll('[data-guidance]').forEach(b=>b.onclick=()=>open(items,b.dataset.guidance,opener));
   dlg.querySelector('#guidanceHeading').focus();
  });
 }
 function bind(container,items){container.querySelectorAll('[data-guidance]').forEach(b=>b.onclick=()=>open(items,b.dataset.guidance,b))}
 function register(addition){
  for(const group of ['sources','examples','bindings'])for(const key of Object.keys(addition[group]||{}))if(data[group][key])throw new Error('Dubbele uitleg: '+key);
  for(const group of ['sources','examples','bindings'])Object.assign(data[group],addition[group]||{});
 }
 function registerHistorical(bank){const prior=structuredClone(bank.guidance||{sources:{},bindings:{},examples:{}});completion(bank.items,prior);data.historicalBindings??={};for(const [id,b] of Object.entries(prior.bindings))data.historicalBindings[id+'@'+b.item_version]=b;}
 const api=Object.freeze({registerHistorical,mapping,summarize,row,bind,open,register,complete:items=>completion(items,data)});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.ContentGuidance=api;
})(typeof globalThis!=='undefined'?globalThis:this);
