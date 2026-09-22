(function(root){
 'use strict';
 const data=typeof module==='object'&&module.exports?require('./data/content-guidance.js'):root.DIGIBORD_CONTENT_GUIDANCE;
 const sections={
  lowan:{name:'LOWAN',label:'Leerroute',intro:'Welke leerroute past bij deze oefening?',fields:{routes:'Leerroute',exit:'Vervolgonderwijs of werk',phase:'Stap in de leerroute',goal:'Doel'}},
  erk:{name:'ERK',label:'Taalniveau',intro:'Welk taalniveau past bij deze oefening?',fields:{levels:'Niveauadvies',skill:'Vaardigheid',goal:'Doel'}},
  f:{name:'F',label:'Referentieniveau',intro:'Wat oefen je voor taal op school of op het werk?',fields:{levels:'Referentieniveau',area:'Taalonderdeel',goal:'Doel'}},
  bow:{name:'BoW',label:'Leskwaliteit',intro:'Korte tips voor de docent. Je kijkt zelf wat nodig is in je les.'}
 };
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function sourceLink(id,registry=data){const s=registry.sources[id];return s&&/^https:\/\//.test(s.url)?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a> · ${esc(s.version)}`:''}
 function mapping(item,key,registry=data){
  const b=registry.bindings[item?.content_item_id];
  if(!b||b.item_version!==item.version||b.bank_id!==item.content_bank_id)return null;
  const m=b[key];if(!m)return null;
  if(key==='bow')return registry.examples[m.example]&&m.criteria?.length&&m.criteria.every(id=>registry.criteria[id])?m:null;
  if(!m.version||!m.evidence||!registry.sources[m.source])return null;
  if(m.status==='not_applicable')return m;
  return m.status==='reviewed'&&Object.keys(sections[key].fields).every(f=>Array.isArray(m[f])?m[f].length&&m[f].every(v=>typeof v==='string'&&v.trim()):typeof m[f]==='string'&&m[f].trim())?m:null;
 }
 function summarize(items,key,registry=data){
  const entries=items.map(item=>({item,mapping:mapping(item,key,registry)})),known=entries.filter(e=>e.mapping),missing=entries.length-known.length;
  const levels=[...new Set(known.flatMap(e=>e.mapping.levels||e.mapping.routes||[]))];
  let status='Nog niet gekoppeld';
  if(known.length){
   if(key==='bow')status=missing?'Enkele lestips':'Lestips';
   else if(levels.length>1)status='Meerdere';
   else if(missing)status='Deels gekoppeld';
   else if(known.every(e=>e.mapping.status==='not_applicable'))status='Niet van toepassing';
   else status=levels[0]||'Gekoppeld';
  }
  return {entries,known,missing,levels,status};
 }
 function buttons(items,selected=null){return Object.entries(sections).map(([key,s])=>`<button type="button" data-guidance="${key}" ${selected?`aria-pressed="${selected===key}"`:''} aria-label="${s.name} · ${s.label}: ${esc(summarize(items,key).status)}" ${selected?'':'aria-haspopup="dialog"'}><span class="guidance-icon guidance-${key}" aria-hidden="true"></span><span>${key==='f'?'Referentie-<br>niveau':s.label}</span></button>`).join('')}
 function row(items){return `<div class="guidance-row" role="group" aria-label="Uitleg bij deze oefeningen">${buttons(items)}</div>`}
 function details(entry,key){
  const m=entry.mapping;
  if(m.status==='not_applicable')return `<p>Niet van toepassing: ${esc(m.evidence)}</p><p>${sourceLink(m.source)} · ${esc(m.version)}</p>`;
  return `<dl class="guidance-facts">${Object.entries(sections[key].fields).map(([field,label])=>`<div><dt>${label}</dt><dd>${esc(Array.isArray(m[field])?m[field].join(', '):m[field])}</dd></div>`).join('')}</dl><p>${esc(m.evidence)}</p><p>${sourceLink(m.source)} · ${esc(m.version)}</p>`;
 }
 function content(items,key){
  const summary=summarize(items,key),s=sections[key];
  let body=`<h3 id="guidanceHeading" tabindex="-1">${s.name} · ${s.label}</h3><p>${s.intro}</p><p class="guidance-status">${esc(summary.status)}</p>`;
  if(!items.length)return body+'<p>Kies eerst de inhoud die je wilt oefenen.</p>';
  if(summary.missing)body+=`<p>${summary.missing===items.length?'Deze oefeningen zijn nog niet gekoppeld.':`Voor ${summary.missing} van de ${items.length} oefeningen is nog geen koppeling gemaakt.`} Je kunt ze wel gebruiken.</p>`;
  if(key==='bow'){
   if(summary.known.length){
    body+=`<p>De tips hieronder horen bij ${summary.known.length} van de ${items.length} gekozen oefeningen. Dit is een voorstel voor je les. Er is niet vastgelegd of de les zo is gegeven.</p>`;
    body+=summary.known.map(({item,mapping:m})=>{const example=data.examples[m.example];return `<details><summary>${esc(example.goal)}</summary><p>${esc(item.prompt)}</p><p>${esc(example.evidence)}</p><p>${sourceLink(example.source)}</p></details>`}).join('');
    const ids=[...new Set(summary.known.flatMap(e=>e.mapping.criteria))];
    body+=ids.map(id=>{const c=data.criteria[id];return `<section class="guidance-tip"><h4>${esc(c.title)}</h4><dl class="guidance-facts"><div><dt>Docent</dt><dd>${esc(c.teacher)}</dd></div><div><dt>Cursist</dt><dd>${esc(c.learner)}</dd></div><div><dt>Let op</dt><dd>${esc(c.observe)}</dd></div></dl><details><summary>Waar komt deze tip vandaan?</summary><p>Taalroute-lestip bij ${esc(c.layer)} ${esc(c.code)} · ${esc(c.name)}. Dit is geen volledige beoordeling van dit punt.</p><p>${sourceLink(c.source)} · ${esc(c.version)}</p></details></section>`}).join('');
   }
   body+='<p>Een knop voor het antwoord is nog geen feedback. Bespreek het antwoord en kijk of de cursist de tip gebruikt.</p><p>BoW gaat over leskwaliteit. Het is geen taalniveau of keurmerk voor deze oefening. Voor de hele les, het leertraject en de school zijn meer punten van belang.</p><details><summary>Eigen afspraken van Taalroute</summary><p>Er zijn hier nog geen eigen afspraken gekoppeld. Afspraken voor online en klassikaal lesgeven horen apart van BoW.</p></details>';
  }else{
   body+=summary.known.map(e=>`<details><summary>${esc(e.item.prompt)}</summary>${details(e,key)}</details>`).join('');
   body+='<p>Het niveau dat je bij Oefenen kiest, is nog geen gecontroleerd advies. LOWAN, ERK en F worden apart bekeken.</p>';
  }
  return body;
 }
 let openerButton=null;
 if(root.document)document.querySelector('#gameDialog').addEventListener('close',()=>{
  const dlg=document.querySelector('#gameDialog');
  // A queued close event can arrive after the next click has reopened the dialog.
  if(dlg.open)return;
  if(dlg.classList.contains('guidance-dialog')){dlg.classList.remove('guidance-dialog');openerButton?.focus();openerButton=null}
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
 const api=Object.freeze({mapping,summarize,row,bind,open});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.ContentGuidance=api;
})(typeof globalThis!=='undefined'?globalThis:this);
