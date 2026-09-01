/* V28.14 — presentation layer. Visual feedback over the stable V19 renderer. */
(function(){'use strict';
const P=window.ChanarV28Presentation={version:'28.14'};
function el(id){return document.getElementById(id)}
P.notify=function(text,kind){const n=el('notification');if(!n)return;n.textContent=text||'';n.dataset.kind=kind||'info';n.classList.remove('v28-show');void n.offsetWidth;n.classList.add('v28-show');clearTimeout(P._timer);P._timer=setTimeout(()=>n.classList.remove('v28-show'),2600)};
P.mission=function(){const M=window.ChanarV28Missions;if(!M)return;const cur=M.current();const h=el('mission-hud');if(h)h.textContent=cur&&cur.current?cur.current.text:(cur?cur.title:'Explorá el pueblo');const panel=el('mission-panel');if(panel&&cur){const t=el('mission-title'),d=el('mission-description');if(t)t.textContent=cur.title;if(d)d.textContent=cur.description}}
P.start=function(){P.mission();P.notify('Tu aventura en Chañar comienza.','success')};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>P.mission());else P.mission();
})();
