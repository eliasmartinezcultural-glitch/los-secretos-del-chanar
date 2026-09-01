/* LOS SECRETOS DEL CHAÑAR — V28 WORLD INTERIORS
   Etapa: mundo transitable con interiores funcionales.
   No reemplaza el motor existente: añade una capa de transición.
*/
(function(){'use strict';
const V=window.ChanarV28=window.ChanarV28||{version:'28.0',inside:false,current:null,history:[]};
function getBuildings(){return typeof buildings!=='undefined'&&Array.isArray(buildings)?buildings:(Array.isArray(window.buildings)?window.buildings:[])}
function distance(a,b){return Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0))}
function nearestDoor(){if(typeof player==='undefined')return null;const bs=getBuildings();let best=null,bd=Infinity;bs.forEach(b=>{const doors=Array.isArray(b.doors)?b.doors:[];doors.forEach(d=>{const p={x:d.x,y:d.y};const z=distance(player,p);if(z<bd){bd=z;best={building:b,door:d,distance:z}}})});return best}
function canEnter(){const n=nearestDoor();return !!n&&n.distance<42&&!V.inside}
function enter(building){if(!building)return false;V.inside=true;V.current=building.id||building.name||'interior';V.history.push({action:'enter',building:V.current,time:Date.now()});window.dispatchEvent(new CustomEvent('chanar:interior-enter',{detail:{building:building}}));return true}
function exit(){if(!V.inside)return false;const old=V.current;V.inside=false;V.current=null;V.history.push({action:'exit',building:old,time:Date.now()});window.dispatchEvent(new CustomEvent('chanar:interior-exit',{detail:{building:old}}));return true}
function interact(){const n=nearestDoor();if(V.inside)return exit();if(n)return enter(n.building);return false}
V.nearestDoor=nearestDoor;V.canEnter=canEnter;V.enter=enter;V.exit=exit;V.interact=interact;
window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'&&!e.repeat)interact()});
})();
