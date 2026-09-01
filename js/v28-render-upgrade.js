/* V28.15 — visual upgrade without replacing the V19 renderer. */
(function(){'use strict';
const U=window.ChanarV28RenderUpgrade={version:'28.15',enabled:true};
U.canvas=function(){const c=document.getElementById('game');if(!c)return;c.setAttribute('aria-label','Mundo de Los Secretos del Chañar')};
U.hud=function(){const h=document.getElementById('hud');if(h)h.classList.add('v28-enhanced')};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{U.canvas();U.hud()});else{U.canvas();U.hud()}
})();
