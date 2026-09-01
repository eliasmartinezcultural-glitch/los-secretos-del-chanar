/* V28.16 — visible world upgrade */
(function(){'use strict';const W=window.ChanarV28VisualWorld={version:'28.16',enabled:true};
function addClass(id,c){const e=document.getElementById(id);if(e)e.classList.add(c)}
W.boot=function(){addClass('hud','v28-world-hud');addClass('map-container','v28-world-map');const canvas=document.getElementById('game');if(canvas)canvas.dataset.world='chanar'};
W.describe=function(){return{identity:'San Patricio del Chañar',features:['canales','chacras','viñedos','álamos','calles','barrios','sector rural','vida cotidiana'],renderer:'stable-v19-plus-v28'}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',W.boot);else W.boot()})();
