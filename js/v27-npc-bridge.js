/* LOS SECRETOS DEL CHAÑAR — V27.7 NPC BRIDGE */
(function(){'use strict';
const previous=window.updateNPCs;
window.updateNPCs=function(){
  if(window.ChanarNPCLife?.update){
    window.ChanarNPCLife.update(0.05);
    return;
  }
  if(typeof previous==='function')previous();
};
})();
