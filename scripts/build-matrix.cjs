// JSON is the maintained source. This wrapper also works when the app is opened from disk.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.join(__dirname,'../Lessen'),b=JSON.parse(fs.readFileSync(path.join(dir,'opdrachtenmatrix.json'),'utf8'));
assert.equal(b.version,1);assert.equal(new Set(b.cards.map(c=>c.id)).size,b.cards.length,'Duplicate task IDs');
for(const c of b.cards){assert.ok(b.routes.some(r=>r.id===c.routeId));assert.ok(b.shapes.some(s=>s.id===c.shape));assert.ok(b.topics.some(t=>t.id===c.topic));for(const k of ['instruction','support','model','grammar','retry','criterion'])assert.ok(typeof c[k]==='string'&&c[k].trim(),c.id+' missing '+k);}
fs.writeFileSync(path.join(dir,'opdrachtenmatrix-data.js'),'globalThis.DigiBoardMatrixContent='+JSON.stringify(b)+';\n');console.log('Built '+b.cards.length+' tasks from JSON.');
