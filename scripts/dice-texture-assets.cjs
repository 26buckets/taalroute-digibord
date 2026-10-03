// Byte-identical copies of the existing optimized textures, fetched only when a die uses them.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'dice-textures.js'),'utf8'),ctx);
const mapping={},write=process.argv.includes('--write');
for(const [source,data] of Object.entries(ctx.window.DICE_TEXTURES)){
 const dest='assets/dice-textures/'+source.replace(/^assets\//,'');const bytes=Buffer.from(data.split(',')[1],'base64');mapping[source]=dest;
 if(write){fs.mkdirSync(path.dirname(path.join(root,dest)),{recursive:true});fs.writeFileSync(path.join(root,dest),bytes)}
 else assert.ok(fs.readFileSync(path.join(root,dest)).equals(bytes),'Texture changed: '+source);
}
const output='// GENERATED: node scripts/dice-texture-assets.cjs --write\nwindow.DICE_TEXTURES='+JSON.stringify(mapping)+';\n';
if(write)fs.writeFileSync(path.join(root,'data/dice-texture-index.js'),output);else assert.equal(fs.readFileSync(path.join(root,'data/dice-texture-index.js'),'utf8'),output);
console.log('PASS: '+Object.keys(mapping).length+' byte-identical dice textures loaded on demand.');
