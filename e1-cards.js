// Replace only the released source records; the existing card shell and assets stay in use.
(function(root){
 'use strict';
 if(!root.E1Release||root.DigiBordArchiveReview)return;
 const data=root.DIGIBORD_DATA,e1=root.E1Release;
 for(const family of data.cardGames.families){
  if(family.id==='story'){family.cards=[];continue;}
  if(family.id==='tongue')continue;
  const previous=new Map(family.cards.map(c=>[c.id,c]));
  family.cards=e1.cards.filter(c=>c.appFamily===family.id).map(c=>{
   const visualRebus=previous.get(c.id)?.visualRebus;
   return visualRebus?{...c,visualRebus}:c;
  });
  if(family.id==='idioms')family.cards.push(...root.RestoredRebuses);
 }
 data.cardGames.source=e1.version;
 for(const card of data.tongueBank.cards){const entry=Object.entries(e1.tongues).find(([,m])=>m.text===card.text),meta=entry?.[1];if(!meta)throw new Error('Ontbrekende canonieke tongbreker: '+card.id);card.canonical_id=entry[0];card.finalRoute=meta.route;card.finalLevel=meta.level;card.freePlayGate=meta.gate;}
})(globalThis);
