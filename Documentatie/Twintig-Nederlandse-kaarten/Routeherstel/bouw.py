from pathlib import Path
import json,copy,shutil,math
from ontwerp import C
from herstel import apply
apply(C)
app=Path('/Users/nicoknoester/Documents/Codex/2026-09-12/ik-wil-een-volgend-onderdeel-maken/outputs/DigiBoard');src=Path('outputs/Twintig-Nederlandse-werelden');items=json.loads((src/'Beeldmanifest.json').read_text());shape={'c':'circle','s':'square','t':'triangle','d':'diamond'}
base=json.loads((app/'Kaarten/jungle-watervalroute.js').read_text().split('create(',1)[1].rsplit(');',1)[0])['content']
for c,item in zip(C,items):
 c['label']=item['title'].split(' — ')[0];c['title']=item['title'];c['count']=len(c['anchors'])-2;c['shapes']=[shape[x] for x in c.pop('shapeString').split()];assert len(c['shapes'])==c['count']
 c.update(size=[50,32],paintedRoute=True,image=c.get('image',c['id']+'-speelroute'),routeNote='Volg de genummerde speelroute. De extra doorgangen worden aangegeven met hun vertrek- en aankomstvak. Bij een extra route kun je ook op je vak blijven en gewoon verder spelen.')
 for p in c['passages']+c['previews']:
  if 'from_' in p:p['from']=p.pop('from_')
  if p in c['passages']:
   p['icon']='ship' if p['kind']=='ferry' or p.get('boat') else 'move-down';p['description']=(f'Bij vak {p["from"]} kun je via deze doorgang naar vak {p["to"]}. Je kunt ook de gewone route volgen.' if p.get('optional') else f'Deze passage hoort bij de stap van vak {p["from"]} naar {p["to"]}. Ook bij een grotere worp wordt de passage gebruikt.')
  assert 0<=p['from']<len(c['anchors']) and 0<=p['to']<len(c['anchors'])
  if p in c['passages']:
   assert p['enter'][0]==c['anchors'][p['from']],(c['id'],'start',p['enter'][0],c['anchors'][p['from']])
   assert p['exit'][-1]==c['anchors'][p['to']],(c['id'],'end')
 for p in c['passages']:
  distance=lambda ps:sum(math.dist(a,b) for a,b in zip(ps,ps[1:]))
  if p['kind']=='tunnel':
   durations=[max(.65,distance(p['enter'][:-1])/150),.9,1.2,.9,max(.65,distance(p['exit'][1:])/150)]
  else:
   durations=[max(.7,distance(p['enter'])/150),max(2,distance(p['water'])/150),max(.7,distance(p['exit'])/150)]
  p['duration']=round(sum(durations)*1000);p['timeline']=[sum(durations[:i+1])/sum(durations) for i in range(len(durations)-1)]
 c['previews']+=copy.deepcopy(c['passages']);content=copy.deepcopy(base);content.update(id=c['id']+'-v1',title=c['title'],finish=c['count']+1,coordinates=[[x/1672,y/941] for x,y in c['anchors']]);content['tasks']=[dict(copy.deepcopy(base['tasks'][i%len(base['tasks'])]),id=f't{i+1:02}',number=i+1) for i in range(c['count'])];c['content']=content
 media=app/'Kaarten/assets'/c['id'];media.mkdir(parents=True,exist_ok=True);shutil.copy2(Path(c.pop('imageSource')) if 'imageSource' in c else src/item.get('originalFile',item['file']),media/(c['image']+'.png'))
 (app/'Kaarten'/f"{c['id']}.js").write_text('DigiBoardDutchWorld.create('+json.dumps(c,ensure_ascii=False,indent=2)+');\n')
 (app/'Kaarten'/f"{c['id']}.css").write_text('@import url("nederland-werelden.css?v=20260914-nederland");\n')
 item.update(playUrl='http://127.0.0.1:61381/Praatpad.html?kaart='+c['id'],appMapId=c['id'],suggestedTiles=str(c['count']),status='LOKAAL SPEELBAAR — vrije spelcompositie')
reg=app/'Kaarten/register.js';old=json.loads(reg.read_text().split('=',1)[1].rstrip(';\n'));ids={c['id'] for c in C};old=[x for x in old if x['id']not in ids];old.extend(dict(id=c['id'],label=c['label'],count=c['count'],category='nederland',image='Kaarten/assets/'+c['id']+'/'+c['image']+'.png',features=list(dict.fromkeys(['Pont' if p['kind']=='ferry' else 'Boot' if p.get('boat') else 'Tunnel' for p in c['passages']]+(['Brug']if any(m.get('bridge')for m in c['masks'])else[]))))for c in C)
reg.write_text('globalThis.DigiBoardMaps='+json.dumps(old,ensure_ascii=False,separators=(',',':'))+';\n')
f=app/'Lessen/kaartvormen.js';data=json.loads(f.read_text().split('=',1)[1].rstrip(';\n'));data.update({c['id']:c['shapes']for c in C});f.write_text('globalThis.DigiBoardTileShapes='+json.dumps(data,separators=(',',':'))+';\n')
f=app/'Praatpad.html';s=f.read_text().replace('20260914-spreektijd-routes','20260914-nederland');needle='<script src="digiboard.js?v=20260914-nederland">';s=s.replace(needle,'<script src="Kaarten/nederland-werelden.js?v=20260914-nederland"></script>\n'+needle)if 'src="Kaarten/nederland-werelden.js'not in s else s
s=s.replace('<p>Volg de gewone route. Iedere stap brengt je één vak verder. Er zijn geen terugstuurvakken of beurten die je moet overslaan.</p>','<p>${esc(DigiBoardMap.routeNote||"Volg de gewone route. Iedere stap brengt je één vak verder. Er zijn geen terugstuurvakken of beurten die je moet overslaan.")}</p>')
f.write_text(s)
(src/'Beeldmanifest.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
doc=app/'Documentatie/Twintig-Nederlandse-kaarten';doc.mkdir(exist_ok=True);(doc/'Geometrie.json').write_text(json.dumps([{k:v for k,v in c.items()if k!='content'}for c in C],ensure_ascii=False,indent=2))
Path('work/nederland-speelbaar/kaarten.json').write_text(json.dumps([{k:v for k,v in c.items()if k!='content'}for c in C],ensure_ascii=False,indent=2))
print('Gebouwd',[(c['label'],c['count'])for c in C])
