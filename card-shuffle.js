(function(root){
 'use strict';
 const unique=ids=>[...new Set(ids)],id=x=>typeof x==='string'&&/^[\w.:-]+$/.test(x);
 const ids=a=>Array.isArray(a)&&a.every(id)&&new Set(a).size===a.length;
 const integer=n=>Number.isSafeInteger(n)&&n>=0;
 function valid(s){
  return !!s&&typeof s==='object'&&Object.keys(s).every(k=>['schemaVersion','family','route','eligible','queue','used','currentCardId','lastCardId','cycle','position','history','cursor','resetCount'].includes(k))&&s.schemaVersion===1&&id(s.family)&&typeof s.route==='string'&&ids(s.eligible)&&ids(s.queue)&&ids(s.used)&&ids(s.history)&&[s.currentCardId,s.lastCardId].every(x=>x===null||id(x))&&[s.cycle,s.position,s.cursor,s.resetCount].every(integer)&&s.queue.every(x=>s.eligible.includes(x)&&!s.used.includes(x))&&s.history.every(x=>s.eligible.includes(x)&&s.used.includes(x))&&(!s.currentCardId||s.eligible.includes(s.currentCardId)&&s.used.includes(s.currentCardId)&&s.history[s.cursor]===s.currentCardId);
 }
 function shuffle(list,random){
  const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
 }
 // Eligibility belongs to the caller. Only known IDs are retained across filters;
 // a route change must not make a previously drawn ID unseen.
 function transition(previous,{family,route,eligibleIds,knownIds=eligibleIds,preferredId=null},action='resume',random=Math.random){
  if(!id(family)||typeof route!=='string'||!Array.isArray(eligibleIds)||!eligibleIds.every(id)||!Array.isArray(knownIds)||!knownIds.every(id))throw new Error('Invalid card selection');
  const known=new Set(knownIds),eligible=unique(eligibleIds).filter(x=>known.has(x)),allowed=new Set(eligible);
  const old=valid(previous)&&previous.family===family?previous:null;
  const s=old?structuredClone(old):{schemaVersion:1,family,route,eligible:[],queue:[],used:[],currentCardId:null,lastCardId:null,cycle:1,position:0,history:[],cursor:0,resetCount:0};
  if(action==='reset'){
   s.queue=[];s.used=[];s.history=[];s.currentCardId=null;s.position=0;s.cursor=0;s.cycle++;s.resetCount++;
  }
  const changed=JSON.stringify(s.eligible)!==JSON.stringify(eligible);
  s.route=route;s.eligible=eligible;s.used=s.used.filter(x=>known.has(x));
  if(s.lastCardId&&!known.has(s.lastCardId))s.lastCardId=null;
  if(s.currentCardId&&!allowed.has(s.currentCardId)){s.lastCardId=known.has(s.currentCardId)?s.currentCardId:null;s.currentCardId=null}
  if(!old&&action!=='reset'&&allowed.has(preferredId)){s.currentCardId=preferredId;s.used.push(preferredId);s.history=[preferredId]}
  if(changed){s.history=s.history.filter(x=>allowed.has(x));s.cursor=Math.max(0,s.history.indexOf(s.currentCardId))}
  s.queue=unique(s.queue).filter(x=>allowed.has(x)&&!s.used.includes(x));
  const queued=new Set(s.queue),unseen=eligible.filter(x=>!s.used.includes(x)&&!queued.has(x));
  s.queue.push(...shuffle(unseen,random));
  if(!eligible.length){s.currentCardId=null;s.history=[];s.cursor=0;s.position=0;return s}
  if(action==='previous'&&s.currentCardId){s.cursor=Math.max(0,s.cursor-1);s.currentCardId=s.history[s.cursor]}
  else if(action==='next'&&s.cursor<s.history.length-1&&s.currentCardId){s.currentCardId=s.history[++s.cursor]}
  else if(action==='next'||!s.currentCardId){
   const last=s.currentCardId||s.lastCardId;
   if(!s.queue.length){
    s.used=s.used.filter(x=>!allowed.has(x));s.queue=shuffle(eligible,random);s.cycle++;s.history=[];
    if(s.queue.length>1&&s.queue[0]===last){[s.queue[0],s.queue[1]]=[s.queue[1],s.queue[0]]}
   }else if(!s.currentCardId&&s.queue.length>1&&s.queue[0]===last){[s.queue[0],s.queue[1]]=[s.queue[1],s.queue[0]]}
   s.lastCardId=last;s.currentCardId=s.queue.shift();s.used.push(s.currentCardId);s.history.push(s.currentCardId);s.cursor=s.history.length-1;
  }
  s.position=s.used.filter(x=>allowed.has(x)).length;
  return s;
 }
 const api={transition,valid};if(typeof module==='object'&&module.exports)module.exports=api;else root.CardShuffle=api;
})(typeof globalThis!=='undefined'?globalThis:this);
