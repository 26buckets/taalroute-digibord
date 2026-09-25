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
 // Public references are separate from the retained internal review trail.
 function sourceLink(id){const publicId={lowanLesson:'lowanLesson',fLesson:'fLesson',erkLesson:'erkLesson',bow:'bowPublic',bowPublic:'bowPublic'}[id],s=data.sources[publicId];return s?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`:''}
 function facts(rows){return `<table class="guidance-facts"><tbody>${rows.filter(([,value])=>value).map(([label,value])=>`<tr><th scope="row">${esc(label)}</th><td>${esc(Array.isArray(value)?value.join(', '):value)}</td></tr>`).join('')}</tbody></table>`}
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
 function statusLabel(summary){return ({'Nog niet gekoppeld':'Geen advies','Deels gekoppeld':'Deels beschikbaar','Gekoppeld':'Beschikbaar','Meerdere':'Meerdere niveaus'})[summary.status]||summary.status}
 function buttons(items,selected=null){return Object.entries(sections).map(([key,s])=>`<button type="button" data-guidance="${key}" ${selected?`aria-pressed="${selected===key}"`:''} aria-label="${s.name} · ${s.label}: ${esc(statusLabel(summarize(items,key)))}" ${selected?'':'aria-haspopup="dialog"'}><span class="guidance-icon guidance-${key}" aria-hidden="true"></span><span>${s.label}</span></button>`).join('')}
 function row(items){return `<div class="guidance-row" role="group" aria-label="Uitleg bij deze oefeningen">${buttons(items)}</div>`}
 function details(entry,key){
  const m=entry.mapping;
  if(m.status==='not_applicable')return facts([['Niveau','Niet van toepassing'],['Toelichting',m.evidence]]);
  if(m.status==='source_route')return facts([['Leerroute',m.routes],['Doel',m.goal],['Toelichting',m.evidence]]);
  return facts([...Object.entries(sections[key].fields).map(([field,label])=>[m.status==='source_level'&&field==='levels'?'Niveau uit de bron':label,m[field]]),['Waarom dit niveau?',entry.item.level_review?.reason?.split(' Deze inhoud is daarom verplaatst')[0]]])+(m.status==='source_level'?`<p>${esc(m.evidence)}</p>`:'');
 }
 function content(items,key){
  const summary=summarize(items,key),s=sections[key];
  let body=`<h3 id="guidanceHeading" tabindex="-1">${s.name} · ${s.label}</h3><p>${s.intro}</p><p class="guidance-status">${esc(statusLabel(summary))}</p>`;
  if(!items.length)return body+'<p>Kies eerst de inhoud die je wilt oefenen.</p>';
  if(summary.missing)body+=`<p>${summary.missing===items.length?'Bij deze oefeningen is deze informatie niet beschikbaar.':`Bij ${summary.missing} van de ${items.length} oefeningen is deze informatie niet beschikbaar.`} Je kunt ze wel gebruiken.</p>`;
  if(key==='bow'){
   if(summary.known.length){
    body+=`<p>Tips bij ${summary.known.length} van de ${items.length} gekozen oefeningen.</p>`;
    const lessons=new Map();
    for(const {item,mapping:m} of summary.known){const lesson=binding(item)?.lesson,example=data.examples[m.example];const key=JSON.stringify([lesson?.goal||example.goal,lesson?.source||example.source]);const group=lessons.get(key)||{lesson,example,items:[],tips:new Map()};group.items.push(item);if(lesson)group.tips.set(JSON.stringify(lesson),lesson);lessons.set(key,group);}
    body+=Array.from(lessons.values()).map(({lesson,example,items:group,tips})=>`<details class="guidance-lesson"><summary>${esc(lesson?.goal||example.goal)}${group.length>1?` (${group.length})`:''}</summary>${lesson?Array.from(tips.values()).map(t=>facts([['Werkvorm',t.activity],['Hulp',t.help],['Bespreek',t.check],['Daarna',t.next]])).join(''):`<p>${esc(example.evidence)}</p>`}<details><summary>Opdrachten bij deze tip</summary>${group.map(item=>`<p>${esc(item.prompt)}</p>`).join('')}</details></details>`).join('');
    const ids=[...new Set(summary.known.flatMap(e=>e.mapping.criteria))];
    body+='<details><summary>Zo kun je de les geven</summary>'+ids.map(id=>{const c=data.criteria[id];return `<section class="guidance-tip"><h4>${esc(c.title)}</h4>${facts([['Docent',c.teacher],['Cursist',c.learner],['Let op',c.observe]])}</section>`}).join('')+`<p>${sourceLink('bowPublic')}</p></details>`;
   }
   body+='<p class="guidance-note">Bespreek het antwoord samen. Deze lestips helpen bij het lesgeven; ze zijn geen beoordeling of keurmerk van de les.</p>';
  }else{
   const uses=summary.known.filter(e=>e.mapping.status==='lesson_use');
   if(uses.length){
    const areas=[...new Set(uses.map(e=>e.mapping.area).filter(Boolean))],tips=[...new Set(uses.map(e=>e.mapping.use))];
    body+=facts([['Bij deze les',key==='lowan'?'Oefen binnen de al gekozen route van de cursist.':areas.join(', ')],['Gebruik',tips.join(' ')],['Goed om te weten',key==='lowan'?'De LOWAN-route hangt af van de cursist en het vervolgonderwijs. Een losse oefening bepaalt die route niet. Buiten de ISK is een ISK-route niet van toepassing.':'Een losse opdracht bepaalt geen niveau 1F, 2F, 3F of 4F. Er is daarom geen F-niveau toegekend.']])+`<p class="guidance-note">${sourceLink(uses[0].mapping.source)}</p>`;
   }
   body+=summary.known.filter(e=>e.mapping.status!=='lesson_use').map(e=>`<details><summary>${esc(binding(e.item)?.lesson?.goal||e.item.prompt)}</summary>${details(e,key)}</details>`).join('');
   if(key==='erk')body+='<p class="guidance-note">Het niveau helpt je bij het kiezen van een oefening. Het is geen toets van het niveau van de cursist.</p>';
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
   dlg.querySelector('#guidanceHeading').focus({preventScroll:true});
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
