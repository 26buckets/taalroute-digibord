const assert=require('node:assert/strict'),fs=require('fs');
const maps=JSON.parse(fs.readFileSync('Documentatie/Twintig-Nederlandse-kaarten/Geometrie.json')),get=id=>maps.find(c=>c.id==='nederland-'+id);
// Regressions from the visual route review: quay crossings require transport;
// an exit cannot send the ordinary route back along the removed entry-side branch.
const d=get('delft'),pont=d.passages.find(p=>p.kind==='ferry'&&p.from===15&&p.to===16);assert(pont);assert.deepEqual(pont.enter.at(-1),pont.water[0]);assert.deepEqual(pont.water.at(-1),pont.exit[0]);assert(pont.water.some(p=>p[0]>1200&&p[0]<1400&&p[1]>500&&p[1]<660));assert.equal(d.waypoints['15'],undefined);
assert.equal(get('haarlem').count,18);assert.equal(get('haarlem').passages[0].to,18);assert.deepEqual(get('haarlem').anchors.at(-1),[1588,146]);
assert.equal(get('giethoorn').count,19);assert.deepEqual(get('giethoorn').anchors.at(-1),[1556,234]);
assert.equal(get('afsluitdijk').passages[0].optional,true);assert.equal(get('afsluitdijk').passages[0].to,20);
for(const [id,leg,checkpoint]of[['amersfoort',11,[405,298]],['maastricht',22,[1194,461]],['kinderdijk',10,[940,403]],['kinderdijk',13,[598,378]],['neeltje-jans',25,[859,587]],['muiderslot',0,[505,874]],['biesbosch',25,[1632,774]]])assert(get(id).waypoints[leg].some(p=>JSON.stringify(p)===JSON.stringify(checkpoint)),id+' painted connection');
for(const c of maps){assert.equal(c.shapes.length,c.count);for(const[k,path]of Object.entries(c.waypoints)){assert.deepEqual(path[0],c.anchors[+k],c.id+' leg start');assert.deepEqual(path.at(-1),c.anchors[+k+1],c.id+' leg end');}if(c.legacyPositionMap){assert.equal(c.legacyPositionMap[0],0);assert.equal(c.legacyPositionMap.at(-1),c.count+1);assert(c.legacyPositionMap.slice(1,-1).every(n=>n<=c.count),c.id+' removed tile cannot prematurely finish');}}
console.log('PASS route logic: water crossing, portal exits, painted stairs, 20 routes, safe renumbering');
