/* LOS SECRETOS DEL CHAÑAR — V27.3 INTEGRATION */
(function(){'use strict';
const I=window.ChanarV27Integration=window.ChanarV27Integration||{version:'27.3',synced:0,targets:0};
function sync(){const citizens=window.ChanarTown?.citizens,npcs=window.npcs;if(!Array.isArray(citizens)||!Array.isArray(npcs))return;let synced=0,targets=0;citizens.forEach(c=>{const n=npcs.find(x=>x.id===c.id);if(!n)return;const r=n.chanarRoutine;if(!r)return;n.v27={state:c.state,destination:c.destination,targetX:r.targetX,targetY:r.targetY};targets++;n.v27.arrived=Math.hypot(r.targetX-n.x,r.targetY-n.y)<=24;if(n.v27.arrived)synced++});I.synced=synced;I.targets=targets}
I.sync=sync;I.report=()=>({version:I.version,synced:I.synced,targets:I.targets,active:!!window.ChanarTown?.initialized});window.addEventListener('chanar:town-update',sync);if(window.ChanarV20?.bus)window.ChanarV20.bus.on('time:changed',sync);
})();