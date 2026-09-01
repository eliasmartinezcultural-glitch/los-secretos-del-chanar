/* LOS SECRETOS DEL CHAÑAR — V22 CHANAR LIFE
   Capa territorial y simulación ligera de vida cotidiana.
*/
(function(){"use strict";
const T={
  center:{label:"CENTRO",weight:4}, chacras:{label:"CHACRAS",weight:3}, rural:{label:"RURAL",weight:1}, river:{label:"RÍO",weight:1}
};
const ACTIVITIES={
  home:{label:"En casa",icon:"⌂"}, work:{label:"Trabajando",icon:"⚒"}, shopping:{label:"Comprando",icon:"▣"}, school:{label:"En la escuela",icon:"✎"}, recreation:{label:"Tiempo libre",icon:"●"}, rural:{label:"Trabajando en chacra",icon:"🌿"}, travel:{label:"Viajando",icon:"→"}
};
function zone(x,y){const z=window.CHANAR_WORLD_DATA?.zones||[];return z.find(a=>x>=a.x&&x<=a.x+a.width&&y>=a.y&&y<=a.y+a.height)||null}
function hour(){return Number(window.gameTime?.hour ?? window.time?.hour ?? window.hour ?? 12)}
function activity(n){const h=hour(), role=(n.role||"").toLowerCase(); if(role.includes("escuela")&&h>=8&&h<13)return ACTIVITIES.school; if((role.includes("chacra")||role.includes("product"))&&h>=7&&h<18)return ACTIVITIES.rural; if((role.includes("panader")||role.includes("comerc")||role.includes("almac"))&&h>=8&&h<20)return ACTIVITIES.work; if(h>=18&&h<21)return ACTIVITIES.recreation; if(h>=22||h<7)return ACTIVITIES.home; return ACTIVITIES.work}
function townPulse(){const h=hour(); return {pedestrians:h>=8&&h<21?Math.round(6+Math.abs(Math.sin(h))*7):2,traffic:h>=7&&h<20?Math.round(2+Math.abs(Math.cos(h))*4):1,shopsOpen:h>=8&&h<20,schoolOpen:h>=8&&h<14,ruralActive:h>=6&&h<19};}
function annotate(){const list=window.npcs||[];list.forEach(n=>{n.lifeActivity=activity(n);n.zone=zone(n.x,n.y)?.id||null;n.lifeState=n.lifeActivity.label});window.CHANAR_TOWN_PULSE=townPulse();}
window.ChanarLife={zone,activity,annotate,townPulse,activities:ACTIVITIES,zones:T};
})();
