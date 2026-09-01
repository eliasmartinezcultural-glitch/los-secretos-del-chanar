/* LOS SECRETOS DEL CHAÑAR — V27.12 QA */
(function(){'use strict';
const Q=window.ChanarV27QA={version:'27.12',last:null};
function list(){return typeof npcs!=='undefined'&&Array.isArray(npcs)?npcs:(Array.isArray(window.npcs)?window.npcs:[])}
function run(){const n=list(),town=window.ChanarTown,phys=window.ChanarPhysicalRoutines,core=window.ChanarV20,life=window.ChanarNPCLife;const targets=n.filter(x=>x.chanarRoutine).length,moving=n.filter(x=>x.moving).length,arrived=n.filter(x=>x.routineArrived).length,blocked=n.filter(x=>x.v27Blocked).length;const checks={core:!!core,schedules:!!window.CHANAR_NPC_SCHEDULES,town:!!town&&town.initialized,npcs:n.length>0,physical:!!phys&&phys.active,movement:!!life,targets:targets>0,blocked:blocked===0};Q.last={version:Q.version,passed:Object.values(checks).every(Boolean),checks,npcs:n.length,targets,moving,arrived,blocked,time:typeof world!=='undefined'?`${world.hour}:${Math.floor(world.minute||0)}`:'?'};return Q.last}
Q.run=run;setInterval(run,3000);window.addEventListener('load',run);})();
