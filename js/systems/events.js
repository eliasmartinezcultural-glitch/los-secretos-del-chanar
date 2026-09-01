/* LOS SECRETOS DEL CHAÑAR — AMBIENT EVENTS V23 */
(function(){"use strict";
const events=[
 {id:"morning_rural",from:6,to:9,text:"La mañana arranca en las chacras. Se escucha movimiento de trabajo rural."},
 {id:"school",from:8,to:13,text:"Entrada y salida escolar: el centro gana movimiento."},
 {id:"siesta",from:13,to:16,text:"La actividad baja. El pueblo entra en ritmo de siesta."},
 {id:"afternoon",from:16,to:19,text:"La tarde vuelve a activar calles, comercios y espacios públicos."},
 {id:"river_evening",from:19,to:22,text:"La tarde cae sobre el valle del río Neuquén."}
];
let last="";
function tick(){if(!window.world)return;const h=world.hour;const e=events.find(x=>h>=x.from&&h<x.to);if(e&&e.id!==last){last=e.id;window.ChanarV20?.bus.emit("ambient:event",e);const n=document.getElementById("notification");if(n&&typeof notify==="function")notify(e.text)}}
window.ChanarEvents={tick,events};setInterval(tick,1500);
})();
