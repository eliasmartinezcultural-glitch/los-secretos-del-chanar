/* LOS SECRETOS DEL CHAÑAR — V27.5 AUTONOMOUS MOVEMENT
   FALLBACK ONLY: V27.6 is now the authoritative NPC mover. */
(function(){'use strict';
const M=window.ChanarAutonomousMovement=window.ChanarAutonomousMovement||{version:'27.5',enabled:false,stats:{moving:0,arrived:0,blocked:0}};
M.enabled=false;
M.reason='Delegado a ChanarNPCLife V27.6 para evitar doble movimiento';
M.step=function(){return false};
})();