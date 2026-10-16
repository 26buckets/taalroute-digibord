// Shared reader for retained choice cards, in Markdown or the frozen plain-text format.
const assert=require('node:assert/strict');
module.exports=function(raw){
 raw=raw.replace(/\r\n/g,'\n');
 if(/^1\. C1_/m.test(raw))raw=raw.replace(/^(\d+)\. (C1_\w+_\d+)\n+([^\n]+)/gm,'### $1. $2\n**$3**').replace(/^(Situatie|Vraag|Juiste antwoord|Uitleg|Let op)$/gm,'**$1**').replace(/^DOMEIN \d+\n+([^\n]+)/gm,'## $1').replace(/^(?:REVIEWSTATUS|PRODUCTIESTATUS)/gm,'# Reviewbesluit');
 const clean=s=>s.trim().replace(/\*/g,''),parts=[...raw.replace(/\r\n/g,'\n').matchAll(/^### (\d+)\. (C1_\w+_\d+)\n([\s\S]*?)(?=^### |^# (?:Reviewbesluit|FREEZE)|$(?![\s\S]))/gm)];
 return parts.map(([,number,id,text])=>{
  const field=(label,next)=>{const m=text.match(new RegExp('\\*\\*'+label+'\\*\\*\\s*([\\s\\S]*?)'+next));assert.ok(m,id+' '+label);return clean(m[1])};
  const item={id,title:clean(text.match(/\*\*(.*?)\*\*/)[1]),context:field('Situatie','\\*\\*Vraag'),prompt:field('Vraag','\\nA\\.'),options:[...text.matchAll(/^([ABC])\. (.+)$/gm)].map(m=>clean(m[2])),letter:field('Juiste antwoord','\\*\\*Uitleg').replace('.',''),explanation:field('Uitleg','\\*\\*Let op'),note:field('Let op','(?:\\n## |$)')};
  assert.equal(item.options.length,3,id);assert.match(item.letter,/^[ABC]$/);assert.equal(Number(id.slice(-3)),Number(number));return item;
 });
};
