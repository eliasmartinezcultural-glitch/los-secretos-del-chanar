/* LOS SECRETOS DEL CHAÑAR — SOCIAL V23 */
(function(){"use strict";
const relationships={};
function init(){(window.npcs||[]).forEach(n=>{if(typeof relationships[n.id]!=="number")relationships[n.id]=0})}
function change(id,delta){init();relationships[id]=Math.max(-100,Math.min(100,(relationships[id]||0)+delta));window.ChanarV20?.bus.emit("social:changed",{id,value:relationships[id]})}
function level(id){const v=relationships[id]||0;if(v>=60)return "amigo";if(v>=20)return "conocido";if(v<=-40)return "distante";return "vecino"}
function greet(id){change(id,2);return level(id)}
window.ChanarSocial={relationships,init,change,level,greet};init();})();
