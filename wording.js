// Taalroute's fixed wording also applies when displaying a retained lesson version.
(function(root){
 'use strict';
 const text=value=>String(value??'').replace(/\bbuur\b/gi,word=>word==='BUUR'?'BUURMAN':word[0]==='B'?'Buurman':'buurman');
 const audio=card=>card?.id==='TR-TONGUE-D240-A2-018'?'assets/audio/tongbrekers/tr-tongue-d240-a2-018-woordkeuze.mp3':card?.audio?.src;
 const api={text,audio};if(typeof module==='object'&&module.exports)module.exports=api;else root.AppWording=api;
})(typeof globalThis!=='undefined'?globalThis:this);
