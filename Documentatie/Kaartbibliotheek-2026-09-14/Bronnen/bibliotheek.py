from pathlib import Path
import json,re
app=Path('/Users/nicoknoester/Documents/Codex/2026-09-12/ik-wil-een-volgend-onderdeel-maken/outputs/DigiBoard');p=app/'Kaarten/register.js';payload=p.read_text().split('=',1)[1];items,cut=json.JSONDecoder().raw_decode(payload);register_tail=payload[cut:]
life=['dorp-boomgaardroute','markt-pleinroute','station-perronroute','buurttuin-kasroute','bibliotheek-leesroute','museum-zalenroute'];nl=['Rotterdam-havenroute','amsterdam-grachtenroute','utrecht-werfroute','kust-duinroute','bos-bosroute','polder-slotenroute','haven-kaderoute','heuvels-panorama']
for m in items:
 m['category']='nederland' if m['id'].startswith('nederland-') or m['id']in nl else 'spreektijd' if m['id'].startswith('spreektijd-') else 'dagelijks' if m['id']in life else 'fantasie'
 if not m.get('image'):
  s=(app/'Kaarten'/(m['id']+'.js')).read_text();match=re.search(r'"image"\s*:\s*"([^"\n]+)"',s)
  if match:
   img=match[1];m['image']=img if img.startswith('Kaarten/') else 'Kaarten/assets/'+m['id']+'/'+img+'.png'
p.write_text('globalThis.DigiBoardMaps='+json.dumps(items,ensure_ascii=False,separators=(',',':'))+register_tail)
f=app/'Praatpad.html';s=f.read_text();a=s.index('function showMapPicker(){');b=s.index('function showMapRules(',a)
s=s[:a]+'''function showMapPicker(){
 if(busy())return;
 const library=DigiBoardMapLibrary,categories=library.categories;
 const active=DigiBoardMaps.find(m=>m.id===DigiBoard.mapId)?.category||'nederland';
 const title=m=>m.category==='spreektijd'?({'spreektijd-afspraak':'Afspraak maken en verzetten','spreektijd-werken':'Werken in Nederland'}[m.id]||m.label.replace(/^Spreektijd · /,'')):m.label;
 dialog('Wissel kaart','<p>Je voortgang blijft per kaart bewaard. Kies een omgeving; niveau en oefening blijven afzonderlijk instelbaar.</p><div class="db-map-categories" role="group" aria-label="Kaartcategorie">'+categories.map(([id,label])=>'<button type="button" class="pp-secondary" data-map-category="'+id+'" aria-pressed="'+(id===active)+'">'+esc(label)+'</button>').join('')+'</div><p id="db-map-results" aria-live="polite"></p><div class="db-world-grid db-library-grid">'+DigiBoardMaps.map(m=>'<button type="button" class="pp-secondary" data-category="'+m.category+'" data-choose-world="'+esc(m.id)+'" aria-pressed="'+(m.id===DigiBoard.mapId)+'">'+(m.image?'<img loading="lazy" src="'+esc(m.image)+'" alt="">':icon('map'))+'<span>'+esc(title(m))+'<small>'+m.count+' vakken'+(library.isShort(m)?' · Kort':'')+'</small>'+(m.features?.length?'<small>'+m.features.map(esc).join(' · ')+'</small>':'')+(m.id===DigiBoard.mapId?'<small>Huidige kaart</small>':'')+'</span></button>').join('')+'</div>',()=>{
 const filter=id=>{root.querySelectorAll('[data-map-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapCategory===id)));root.querySelectorAll('[data-choose-world]').forEach(b=>b.hidden=!library.includes(DigiBoardMaps.find(m=>m.id===b.dataset.chooseWorld),id));$('db-map-results').textContent=categories.find(c=>c[0]===id)[1]+' · '+DigiBoardMaps.filter(m=>library.includes(m,id)).length+' kaarten'+(id==='kort'?' · Maximaal 20 vakken':'');};
 filter(active);root.querySelectorAll('[data-map-category]').forEach(b=>b.onclick=()=>filter(b.dataset.mapCategory));root.querySelectorAll('[data-choose-world]').forEach(b=>b.onclick=()=>{if(busy())return;closeDialog();if(b.dataset.chooseWorld!==DigiBoard.mapId){save();DigiBoard.changeMap(b.dataset.chooseWorld);}});
 });
}
''' + s[b:]
if 'kaartbibliotheek.css'not in s:s=s.replace('</head>','<link rel="stylesheet" href="Lessen/kaartbibliotheek.css?v=20260914-nederland"></head>')
f.write_text(s)
(app/'Lessen/kaartbibliotheek.css').write_text('''#praatpad-board.db-ui #pp-dialog:has(.db-library-grid){width:min(980px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto}
#praatpad-board.db-ui .db-map-categories{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 8px}
#praatpad-board.db-ui .db-map-categories button{min-height:44px;padding:8px 12px;font:700 15px Arial,sans-serif;white-space:normal}
#praatpad-board.db-ui .db-map-categories [aria-pressed=true]{background:#175b70;color:white;border-color:#175b70}
#praatpad-board.db-ui .db-library-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
#praatpad-board.db-ui .db-library-grid button{display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:8px;min-width:0;font:700 16px Arial,sans-serif;white-space:normal}
#praatpad-board.db-ui .db-library-grid button[hidden]{display:none!important}
#praatpad-board.db-ui .db-library-grid img{display:block;width:100%;height:auto;aspect-ratio:1672/941;object-fit:cover;border-radius:6px}
#praatpad-board.db-ui .db-library-grid button>span{padding:2px 4px 8px}
#praatpad-board.db-ui .db-library-grid small{font-size:13px;line-height:1.4;font-weight:400}
#praatpad-board.db-ui :is(.db-library-grid,.db-map-categories) button:focus-visible{outline:3px solid #0090f2;outline-offset:3px}
@media(max-width:750px){#praatpad-board.db-ui .db-library-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:420px){#praatpad-board.db-ui .db-library-grid{grid-template-columns:1fr}}
''')
print('Bibliotheek',len(items),'kaarten',sum(bool(m.get('image'))for m in items),'miniaturen')
