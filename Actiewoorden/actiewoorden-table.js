globalThis.PraatpadActionTable=(()=>{
'use strict';
const A=globalThis.PraatpadActions,R=globalThis.PraatpadActionRolls,L=globalThis.PraatpadLibrary;
let root,strip,rollButton,wordButton,backButton,status,help,dialog,zoomImage,zoomWord,context,setButton,setDialog,setGrid,setPageLabel,previousSetPage,nextSetPage,setLevel,setMode,setOptions,setApply;
let setDraft,setPage=0;
const cards=[],views=[];let lastRun=null,profiles=[],activeDecks=[],deckKey=null,languageIndex=0;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
function button(text,fn,cls='pp-secondary'){const b=node('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
function init(){
 root=node('div','aw-table');
 const lead=node('div','aw-lead');lead.append(node('span','aw-eyebrow','JULLIE OPDRACHT'),node('p','','Werp samen. Verbind de beelden tot een verhaal.'),node('span','aw-count','9 dobbelstenen · 54 actiewoorden'));const heading=node('div','aw-heading');heading.append(node('h2','','Vertel een verhaal'),node('div','aw-set-context'));lead.prepend(heading);root.append(lead);
 const rail=node('div','aw-rail');rail.setAttribute('role','region');rail.setAttribute('aria-label','Alle negen dobbelstenen op de vaste speeltafel');
 strip=node('div','aw-strip');rail.append(strip);root.append(rail);
 for(let i=0;i<9;i++){
  const card=node('section','aw-card');card.style.setProperty('--aw-accent',['#4769b1','#a55235','#25818a','#7652a1','#ae577b','#907037','#3d8365','#526bb4','#956345'][i]);
  const name=node('span','aw-card-head');name.append(node('span','aw-number',String(i+1)),node('span','aw-theme',A.groups[i]));
  const face=button('',()=>zoom(i),'aw-face');face.setAttribute('aria-label','Vergroot dobbelsteen '+(i+1));
  const canvas=node('canvas','aw-canvas');canvas.setAttribute('aria-hidden','true');face.append(canvas,name);
  const label=node('p','aw-word','');card.append(face,label);strip.append(card);cards.push({card,face,canvas,label});
 }
 help=node('p','aw-help','Tik op een dobbelsteen om het beeld te vergroten.');root.append(help);
 const tools=node('div','aw-tools');
 rollButton=button('Werp alle negen',()=>{if(!context.rolling&&!context.p.paused)context.roll();},'pp-primary aw-roll');
 wordButton=button('Toon de woorden',()=>context.words(),'pp-secondary');
 backButton=button('Vorige worp',()=>context.undo(),'pp-text-button');
 setButton=button('',openSets,'pp-secondary aw-set-button');setButton.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h3c5 0 5 10 10 10h5m-4-4 4 4-4 4M3 17h3c5 0 5-10 10-10h5m-4-4 4 4-4 4"/></svg><span>Wissel set</span>';setButton.setAttribute('aria-haspopup','dialog');
 const utilities=node('div','aw-utilities');utilities.append(backButton);tools.append(setButton,rollButton,wordButton,utilities);root.append(tools);
 status=node('p','aw-status');root.append(status,node('p','aw-partner','A vertelt. B stelt een vraag. Wissel daarna van rol.'));
 const language=node('section','aw-language');language.hidden=true;language.setAttribute('aria-label','Woordkaarten bij de opdracht');root.append(language);
 const support=node('details','aw-support');support.append(node('summary','','Een beginzin nodig?'),node('p'));support.hidden=true;root.append(support);
 const sidebar=node('aside','aw-sidebar');sidebar.setAttribute('aria-label','Bediening van de speeltafel');sidebar.append(tools,status,language,support);root.append(sidebar);
 document.getElementById('pp-pictures').append(root);
 dialog=node('dialog','aw-zoom');dialog.setAttribute('aria-labelledby','aw-zoom-title');
 const title=node('h2');title.id='aw-zoom-title';zoomImage=node('div','aw-zoom-image');zoomWord=node('p','aw-zoom-word');
 dialog.append(title,zoomImage,zoomWord,button('Terug naar de dobbelstenen',()=>dialog.close(),'pp-primary'));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 document.getElementById('praatpad-board').append(dialog);
 initSets();

}
function initSets(){
 setDialog=node('dialog','aw-set-dialog');setDialog.setAttribute('aria-labelledby','aw-set-title');
 const head=node('div','aw-set-head'),title=node('h2','','Kies je set');title.id='aw-set-title';head.append(title,button('Sluiten',()=>setDialog.close(),'pp-text-button'));
 setGrid=node('div','aw-set-grid');setGrid.setAttribute('role','group');setGrid.setAttribute('aria-label','Beschikbare sets');
 const pager=node('div','aw-set-pager');previousSetPage=button('Vorige',()=>{setPage--;renderSets();});nextSetPage=button('Volgende',()=>{setPage++;renderSets();});setPageLabel=node('span');setPageLabel.setAttribute('aria-live','polite');pager.append(previousSetPage,setPageLabel,nextSetPage);
 setOptions=node('div','aw-set-options');const levelLabel=node('label','','Niveau');setLevel=node('select');setLevel.setAttribute('aria-label','Niveau van de set');L.levels.forEach(l=>{const o=node('option','',l);o.value=l;setLevel.append(o);});levelLabel.append(setLevel);setLevel.onchange=()=>{setDraft.level=setLevel.value;};
 const modeLabel=node('label','','Werkvorm');setMode=node('select');setMode.setAttribute('aria-label','Werkvorm bij de set');[['speak','Samen spreken'],['write','Verhaal schrijven']].forEach(([v,t])=>{const o=node('option','',t);o.value=v;setMode.append(o);});modeLabel.append(setMode);setMode.onchange=()=>{setDraft.practiceMode=setMode.value;};setOptions.append(levelLabel,modeLabel);
 const footer=node('div','aw-set-footer');setApply=button('Gebruik deze set',()=>{const selection={...setDraft};setDialog.close();context.choose(selection);setButton.focus();},'pp-primary');footer.append(setApply);
 setDialog.append(head,setGrid,pager,setOptions,footer);setDialog.addEventListener('close',()=>setButton.focus());document.getElementById('praatpad-board').append(setDialog);
}
function openSets(){if(context.rolling)return;setDraft={collection:context.p.collection||'actions',level:L.level(context.p),practiceMode:context.p.practiceMode||'speak'};setPage=Math.floor(L.choices.findIndex(x=>x.id===setDraft.collection)/6);renderSets();setDialog.showModal();}
function renderSets(){
 const count=Math.ceil(L.choices.length/6);setGrid.replaceChildren();L.choices.slice(setPage*6,setPage*6+6).forEach(choice=>{const label=choice.id==='base'?'Basisset':choice.id==='mix'?'Basisset + actiewoorden':choice.label;const tile=button(label,()=>{setDraft.collection=choice.id;renderSets();setGrid.querySelector('[aria-pressed="true"]').focus();},'aw-set-tile');tile.dataset.set=choice.id;tile.setAttribute('aria-pressed',String(choice.id===setDraft.collection));setGrid.append(tile);});
 previousSetPage.disabled=setPage===0;nextSetPage.disabled=setPage===count-1;setPageLabel.textContent=(setPage+1)+' / '+count;setOptions.hidden=!L.theme(setDraft.collection);setLevel.value=setDraft.level;setMode.value=setDraft.practiceMode;
 setApply.textContent='Gebruik deze set';
}

function zoom(i){if(context.rolling||context.p.paused)return;const id=activeDecks[i].ids[context.p.actions.values[i]-1],item=L.lookup.get(id);dialog.querySelector('h2').textContent='Dobbelsteen '+(i+1)+' · '+activeDecks[i].label;zoomImage.innerHTML=L.svg(id);zoomImage.setAttribute('role','img');zoomImage.setAttribute('aria-label',item.description);zoomWord.textContent=item.label;zoomWord.hidden=!context.p.word;dialog.showModal();}
function configure(p){
 const id=p.collection||'actions',selection=p.selection||0,key=id+':'+selection+':'+(globalThis.PraatpadBasisIcons?.getStyle()||'b');
 if(deckKey!==key){
  views.splice(0).forEach(v=>v.destroy());activeDecks=L.decks(id,selection);deckKey=key;lastRun=null;
  cards.forEach((c,i)=>{const old=c.face.querySelector('canvas'),canvas=old.cloneNode(false);old.replaceWith(canvas);c.canvas=canvas;views.push(globalThis.PraatpadDice.create(canvas,{pictures:L.provider(activeDecks[i].ids),fill:.43,front:true}));c.card.querySelector('.aw-theme').textContent=activeDecks[i].label;});
 }
 const theme=L.theme(id),pack=L.profile(p),level=L.level(p),goal=L.goals[level],writing=p.practiceMode==='write';
 const gameTitle=document.getElementById('pp-game-title');gameTitle.textContent=L.title(id);if(pack)gameTitle.append(document.createTextNode(' '),node('span','aw-level-badge',level));
 root.querySelector('.aw-heading h2').textContent=writing?'Schrijf een verhaal':'Vertel een verhaal';const setContext=root.querySelector('.aw-set-context');setContext.replaceChildren(node('span','',id==='base'?'Basisset':L.title(id)));if(pack)setContext.append(node('span','aw-level-badge',level));
 root.querySelector('.aw-lead p').textContent=pack?pack[writing?'write':'speak']:theme?theme.task:'Verbind de beelden. Wat gebeurt er?';
 root.querySelector('.aw-count').textContent=pack?level+' · '+pack.title:theme?'9 dobbelstenen · '+theme.ids.length+' themabegrippen':id==='actions'?'9 dobbelstenen · 54 actiewoorden':id==='base'?'9 dobbelstenen · 54 basisbeelden':'9 dobbelstenen · basis + actiewoorden';
 root.querySelector('.aw-partner').textContent=pack?(writing?goal.feedback:pack.partner):theme?theme.partner:'A vertelt. B stelt een vraag. Wissel daarna van rol.';
 document.getElementById('pp-picture-collection').value=id;
 document.getElementById('pp-picture-reselect').hidden=['base','actions'].includes(id);
 document.getElementById('pp-picture-collection-note').textContent=theme?theme.ids.length+' themabegrippen, aangevuld met basisbeelden en actiewoorden. Iedere worp toont minstens drie themabeelden.':id==='actions'?'De negen oorspronkelijke reeksen met zes actiewoorden.':id==='base'?'Twee dobbelstenen met personen, drie met plaatsen en vier met voorwerpen.':'Eén dobbelsteen met personen, twee met plaatsen, drie met voorwerpen en drie met actiewoorden. Kies een andere beeldselectie om andere woorden uit de bibliotheek te gebruiken.';
 document.getElementById('pp-theme-level-options').hidden=!pack;
 document.getElementById('pp-theme-level').value=level;
 document.getElementById('pp-theme-mode').value=writing?'write':'speak';
 document.getElementById('pp-theme-cards').value=p.languageCards?'shown':'hidden';
 document.getElementById('pp-theme-level-note').textContent=pack?goal.label+'. '+goal.goal+' De beelden blijven herkenbare bouwstenen; de opdracht en woordkaarten veranderen per niveau.':'';
 const language=root.querySelector('.aw-language');language.hidden=!pack||!p.languageCards;
 if(pack&&language.dataset.pack!==pack.id){language.dataset.pack=pack.id;languageIndex=0;language.replaceChildren(node('h3','','Woordkaarten · '+level));const list=node('div','aw-language-grid');pack.cards.forEach(card=>{const article=node('article','aw-language-card');article.append(node('h4','',card.term),node('p','',card.meaning));list.append(article);});const pager=node('div','aw-language-pager');const previous=button('‹',()=>{languageIndex=(languageIndex+5)%6;showLanguageCard();});previous.setAttribute('aria-label','Vorige woordkaart');const next=button('›',()=>{languageIndex=(languageIndex+1)%6;showLanguageCard();});next.setAttribute('aria-label','Volgende woordkaart');pager.append(previous,node('span','aw-language-page'),next);language.append(list,pager);showLanguageCard();}
 const support=root.querySelector('.aw-support');support.hidden=!pack;
 if(pack){if(support.dataset.pack!==pack.id){support.open=false;support.dataset.pack=pack.id;}support.querySelector('p').textContent=pack.support;}
 collection(document.getElementById('pp-picture-set'),id);
}
function showLanguageCard(){const language=root.querySelector('.aw-language');language.querySelectorAll('.aw-language-card').forEach((c,i)=>c.hidden=i!==languageIndex);language.querySelector('.aw-language-page').textContent=(languageIndex+1)+' / 6';}
function render(next){
 context=next;const {p,rolling,key,duration,quiet,layout}=next;
 if(!p.actions)p.actions=R.create();
 if(!root)init();configure(p);root.dataset.layout=layout;root.setAttribute('aria-busy',String(rolling));
 if(rolling&&lastRun!==key){lastRun=key;profiles=cards.map((_,i)=>R.motion(i));}
 cards.forEach((c,i)=>{
  const value=p.actions.values[i],item=L.lookup.get(activeDecks[i].ids[value-1]),motion=profiles[i]||R.motion(i);
  // All animations finish before the host commits its shared rolling phase.
  const delay=Math.min(motion.delay,duration*.06),ms=Math.max(1,duration*motion.fraction-delay);
  views[i].show(value,{style:'verbs',animate:rolling&&!quiet,key,duration:ms,delay,spin:motion.spin,lift:motion.lift});
  c.card.dataset.value=String(value);c.card.dataset.word=item.id;
  c.face.dataset.rolling=String(rolling&&!quiet);
  c.face.disabled=rolling||p.paused;
  c.face.setAttribute('aria-label','Vergroot dobbelsteen '+(i+1)+'. '+(rolling?'De dobbelsteen rolt.':item.description));
  c.label.textContent=item.label;c.label.hidden=!p.word||rolling;
 });
 rollButton.setAttribute('aria-disabled',String(rolling||p.paused));rollButton.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path stroke-linecap="round" stroke-width="3" d="M8 8h0m8 0h0m-4 4h0m-4 4h0m8 0h0"/></svg><span>'+(rolling?'De dobbelstenen rollen…':'Werp alle negen')+'</span>';
 wordButton.disabled=rolling;wordButton.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>'+(p.word?'Verberg de woorden':'Toon de woorden')+'</span>';wordButton.setAttribute('aria-pressed',String(p.word));
 backButton.disabled=rolling||!p.history.length;
 setButton.disabled=rolling;
 status.textContent=rolling?'De dobbelstenen rollen…':'Worp '+p.turn;
 help.textContent='Tik op een dobbelsteen om het beeld te vergroten.';
 if(L.profile(p))help.textContent=L.goals[L.level(p)].images+' Wat je mist, mag je erbij bedenken. '+help.textContent;
}
function collection(target,id='actions'){
 const collectionKey=id+':'+(globalThis.PraatpadBasisIcons?.getStyle()||'b');if(target.dataset.collection===collectionKey)return;target.dataset.collection=collectionKey;
 target.replaceChildren();target.className='aw-collection';target.setAttribute('aria-label','Beelden in '+L.title(id));
 const theme=L.theme(id);
 const groups=id==='actions'?A.groups.map((name,i)=>({name,items:A.items.slice(i*6,i*6+6)})):Object.entries(L.labels).map(([kind,name])=>({name,items:L.items.filter(item=>item.kind===kind&&(theme?theme.ids.includes(item.id):id==='base'?item.kind!=='action':true))})).filter(g=>g.items.length);
 groups.forEach(({name,items})=>{const details=node('details');const summary=node('summary','',name+' · '+items.length);details.append(summary);const group=node('div','aw-collection-grid');
 items.forEach(item=>{const figure=node('figure');figure.innerHTML=L.svg(item.id);figure.append(node('figcaption','',item.label));group.append(figure);});details.append(group);target.append(details);});

}
return {render,collection};
})();
