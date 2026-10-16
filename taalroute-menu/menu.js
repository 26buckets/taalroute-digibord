/* global document */
document.addEventListener('pointerdown',event=>{for(const menu of document.querySelectorAll('details.taalroute-suite[open]'))if(!menu.contains(event.target))menu.open=false;});
document.addEventListener('keydown',event=>{const menu=event.target.closest('details.taalroute-suite')||document.querySelector('details.taalroute-suite[open]');if(!menu)return;if(event.key==='Escape'&&menu.open){event.preventDefault();menu.open=false;menu.querySelector('summary').focus();}if(event.key==='ArrowDown'&&event.target.matches('summary')){event.preventDefault();menu.open=true;menu.querySelector('nav a,button,select')?.focus();}});

const headerControls=document.querySelector('details.suite-header-controls');
if(headerControls){const smallHeader=window.matchMedia('(max-width:600px)');const boardControls=()=>!!document.querySelector('#screen-game.active .board-game');const resizeHeader=()=>{headerControls.open=!smallHeader.matches||boardControls();};smallHeader.addEventListener('change',resizeHeader);resizeHeader();const gameScreen=document.querySelector('#screen-game');if(gameScreen)new MutationObserver(resizeHeader).observe(gameScreen,{attributes:true,attributeFilter:['class'],childList:true});
 document.addEventListener('pointerdown',event=>{if(smallHeader.matches&&!boardControls()&&!headerControls.contains(event.target))headerControls.open=false;});
 document.addEventListener('keydown',event=>{if(smallHeader.matches&&!boardControls()&&headerControls.open&&event.key==='Escape'){event.preventDefault();headerControls.open=false;headerControls.querySelector('summary').focus();}});
}
