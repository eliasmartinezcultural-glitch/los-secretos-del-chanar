/* LOS SECRETOS DEL CHAÑAR — V27.13 QA FINAL */
(function(){'use strict';
const Q=window.ChanarV27QA={version:'27.13',last:null};
function list(){return typeof npcs!=='undefined'&&Array.isArray(npcs)?npcs:(Array.isArray(window.npcs)?window.npcs:[])}
function run(){const n=list(),town=window.ChanarTown,phys=window.ChanarPhysicalRoutines,life=window.ChanarNPCLife,world=typeof window.world!=='undefined'?window.world:null;const targets=n.filter(x=>x.chanarRoutine||x.v27).length,moving=n.filter(x=>x.moving||x.routineTarget).length,arrived=n.filter(x=>x.v27?.arrived||x.routineArrived).length,blocked=n.filter(x=>x.v27Blocked).length;const checks={core:!!window.ChanarV20,schedules:!!window.CHANAR_NPC_SCHEDULES,town:!!town&&town.initialized,npcs:n.length>0,physical:!!phys&&phys.active,movement:!!life,targets:targets>0,blocked:blocked===0};Q.last={version:Q.version,passed:Object.values(checks).every(Boolean),checks,npcs:n.length,targets,moving,arrived,blocked,time:world?`${world.hour}:${Math.floor(world.minute||0)}`:'?'};return Q.last}
Q.run=run;setInterval(run,3000);window.addEventListener('load',run);})();
