"""Image-grounded route corrections, September 14. Original designs retained in ontwerp.py."""
from pathlib import Path
import copy,json

def apply(C):
 for c in C:c['waypoints']={int(k):v for k,v in c['waypoints'].items()}
 by={c['id'].replace('nederland-',''):c for c in C}
 def get(slug):return by[slug]
 def path(c,n,points):c['waypoints'][n]=[c['anchors'][n]]+points+[c['anchors'][n+1]]
 def remap(c,order):
  old=copy.deepcopy(c);c['legacyIndexOrder']=order;idx={n:i for i,n in enumerate(order)};sh=old['shapeString'].split()
  c['anchors']=[old['anchors'][n]for n in order];c['shapeString']=' '.join(sh[n-1]for n in order[1:-1]);c['waypoints']={}
  for i,(a,b)in enumerate(zip(order,order[1:])):
   if b==a+1 and a in old['waypoints']:c['waypoints'][i]=old['waypoints'][a]
  for p in c['passages']+c['previews']:
   key='from_'if'from_'in p else'from';a,b=p[key],p['to'];p[key]=idx.get(a,idx[max(n for n in order if n<=a)]);p['to']=idx.get(b,idx[min(n for n in order if n>=b)])
  c['legacyPositionMap']=[idx.get(n,idx[max(k for k in order if k<=n)])for n in range(len(old['anchors']))]
  return idx
 def rim(c,id,box):
  x,y,r,b=box;c['masks'].append(dict(id=id,path=f'M{x} {b}V{y}H{r}V{b}H{r-5}V{y+5}H{x+5}V{b}Z',area=box,frontY=2000,portal=True))
 def rail(c,id,pts):
  paths=[]
  import math
  for (x,y),(a,b) in zip(pts,pts[1:]):
   d=math.hypot(a-x,b-y);dx=(b-y)/d*2;dy=(a-x)/d*2
   paths.append(f'M{x-dx} {y+dy}L{a-dx} {b+dy}L{a+dx} {b-dy}L{x+dx} {y-dy}Z')
  c['masks'].append(dict(id=id,path=' '.join(paths),area=[min(p[0]for p in pts),min(p[1]for p in pts),max(p[0]for p in pts),max(p[1]for p in pts)],frontY=2000,bridge=True))
 c=get('haarlem');remap(c,list(range(19))+[22])
 c=get('amersfoort');remap(c,list(range(12))+list(range(17,41)))
 path(c,11,[[337,208],[365,255],[405,298],[458,345],[516,377],[494,402]])
 p=c['passages'][1];p['label']='Poort naar de brug';p['exit']=[[888,778],[887,800],[895,814],[932,803],c['anchors'][19]];rim(c,'nieuwe-poort-uitgang',[858,745,919,808])
 c=get('maastricht');path(c,22,[[1097,345],[1113,377],[1136,408],[1170,431],[1194,461],[1228,496],[1270,520],[1309,543],[1350,560]])
 p=c['passages'][0];p['exit']=[[1524,592],[1516,610],[1475,628],[1442,617],[1462,582],[1486,546],[1516,501],c['anchors'][25]]
 c['masks']=[m for m in c['masks']if m['id']!='doorgang-1-mond-1'];rim(c,'doorgang-1-mond-1',[1492,548,1553,620])
 c=get('kinderdijk');path(c,10,[[1092,437],[1028,421],[940,403],[852,386],[775,367],[781,352]])
 # Upper bank connects around the left flank of the small tunnel, never over its arch.
 path(c,13,[[661,328],[613,349],[598,378]])
 rail(c,'gemaal-platform-voor',[[766,385],[846,401],[923,416],[1038,440]])
 c=get('neeltje-jans');remap(c,list(range(26))+[29]+list(range(32,48)));path(c,25,[[955,689],[935,655],[903,621],[859,587],[885,563],[934,542],[977,502],[1029,493]])
 c=get('nijmegen');c['passages'][0]['to']=18;c['passages'][0]['exit']=[[654,429],[645,446],[632,458],[680,475],[748,509],[823,534],[850,496],[882,450],[910,412],[883,386],c['anchors'][18]];remap(c,list(range(8))+list(range(18,34)))
 c=get('zaanse-schans');remap(c,[0]+list(range(3,7))+list(range(10,27)));path(c,4,[[619,614],[673,586],[724,560],[779,546],[793,510],[807,478]])
 c=get('giethoorn');c['anchors'][19]=[1447,235];remap(c,list(range(20))+[23])
 c=get('leiden');p=c['passages'][0];p['from_']=1;p['enter']=[c['anchors'][1],[1475,820],[1395,870],[1263,908],[1193,918],[1125,887],[1058,859],[978,830],[908,798],[850,762],[807,726],[764,695],[738,673],[733,651]];p['exit']=[[447,657],[447,679],[421,705],[405,736],[401,776],[402,817],[365,850],[310,835],[291,805],[282,777],[279,754],[225,734],[159,711],[90,694],[116,659],[196,620],[234,576],[306,526],[398,496],[491,469],[578,453],[659,447],[743,422],[779,407],c['anchors'][14]]
 c=get('groningen');p=c['passages'][0];p['enter']=[c['anchors'][14],[1011,577],[1071,548],[1054,515]];p['exit']=[[1357,557],[1345,590],[1286,625],[1226,604],[1195,557],[1170,533],[1200,492],c['anchors'][20]]
 c=get('afsluitdijk');p=c['passages'][0];p['optional']=True;p['to']=20;p['exit']=[[1322,264],[1351,285],[1385,270],c['anchors'][20]];path(c,13,[[1036,475],[1107,470],[1179,449],[1195,414]])
 c=get('texel');p=c['passages'][0];p['from_']=1;p['enter']=[c['anchors'][1],[275,750],[330,815],[450,850],[594,900],[720,928],[790,910],[808,866],[808,833],[820,785],[833,745],[846,713],[851,690],[854,672]];p['exit']=[[1399,670],[1419,703],[1440,735],[1460,771],[1474,811],[1514,865],[1514,900],[1543,850],[1605,777],[1592,703],[1558,660],[1499,581],[1406,506],[1326,457],[1247,418],c['anchors'][20]]
 c=get('muiderslot');path(c,0,[[405,850],[505,874],[611,880],[705,875]])
 c=get('valkenburg');path(c,24,[[552,99],[584,104],[643,138],[698,149],[780,166],[868,181],[950,192]])
 c=get('delft');c['passages'][0]['exit']=[[1176,858],[1187,926],[1270,931],[1340,926],[1430,870],[1490,815],[1540,748],[1582,645],c['anchors'][16]];c['waypoints'].pop(15,None);c['passages'].append(dict(id='pont-15',kind='ferry',from_=15,to=16,label='Pont over de gracht',enter=[c['anchors'][15],[1038,382],[1049,408],[1065,424],[1090,436],[1110,450]],water=[[1110,450],[1160,498],[1250,567],[1320,625],[1400,660],[1460,665]],exit=[[1460,665],[1515,675],[1550,667],[1580,645],[1603,619],c['anchors'][16]],labelPos=[1295,590]))
 c=get('den-bosch');p=c['passages'][0];p['enter']=[c['anchors'][1],[429,677],[371,637],[319,594],[268,551],[318,512],[369,477],[428,461],[481,458],[500,478],[526,465],[554,429],[577,400]];p['boardAt']=9;p['exit']=[[1295,625],[1250,667],[1170,674],[1145,618],[1120,617],[1113,593],[1096,569],[1080,544],[1073,523],[1058,510],c['anchors'][10]];p['landAt']=3
 c=get('biesbosch');c['passages'][0]['water']=[[606,343],[738,385],[902,380],[1100,369],[1300,345],[1440,325],[1570,321],[1632,346],[1635,380]];c['passages'][0]['exit']=[[1635,380],[1595,379],[1585,414],[1537,428],c['anchors'][14]];p=c['passages'][2];p['enter']=[c['anchors'][30],[1585,432],[1595,409],[1610,383],[1640,380]];p['water']=[[1640,380],[1632,346],[1570,321],[1440,325],[1300,345],[1140,366],[1030,351],[975,321],[981,286]];path(c,25,[[1580,874],[1625,830],[1632,774],[1607,731],[1567,687],[1515,650],[1472,615],[1460,586]])
 for c in C:
  c['routeRevision']='20260914-routelogica-3'
  file=Path('outputs/Nederlandse-kaarten-routeherstel')/(c['id']+'-route-v2.png')
  if file.exists():c['image']=c['id']+'-route-v2';c['imageSource']=str(file)
