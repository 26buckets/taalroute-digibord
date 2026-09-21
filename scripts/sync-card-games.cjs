// Keep the protected base bundle byte-for-byte intact; update only this card family.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),games=JSON.parse(fs.readFileSync(path.join(root,'data/card-games.json'),'utf8'));
const family=games.families.find(f=>f.id==='idioms');
fs.writeFileSync(path.join(root,'data/taalmix.js'),'// Generated from data/card-games.json by scripts/sync-card-games.cjs.\n'+
 'window.DIGIBORD_DATA.cardGames.families = window.DIGIBORD_DATA.cardGames.families.map(f => f.id === "idioms" ? '+JSON.stringify(family)+' : f);\n'+
 'window.DIGIBORD_DATA.cardGames.source = '+JSON.stringify(games.source)+';\n'+
 'window.DIGIBORD_DATA.cardGames.status = '+JSON.stringify(games.status)+';\n');
