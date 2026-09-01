/* LOS SECRETOS DEL CHAÑAR — PUEBLO VIVO V21 */
(function () {
    "use strict";
    const town = { version: 21, events: [], activeEvents: [], ambient: { pedestrians: 0, vehicles: 0, animals: 0 }, lastDay: -1 };
    const activities = { home:{label:"en casa"}, work:{label:"trabajando"}, shopping:{label:"haciendo compras"}, lunch:{label:"almorzando"}, history:{label:"en el museo"}, radio:{label:"en la radio"}, school:{label:"en la escuela"}, recreation:{label:"paseando"} };
    function hourFloat(){ return (world.hour||0)+((world.minute||0)/60); }
    function scheduleFor(npc){ return window.ChanarV20?.currentSchedule(npc)||null; }
    function buildingTarget(id){ const b=(window.buildings||[]).find(x=>x.id===id); return b?{x:b.x+b.width/2,y:b.y+b.height/2,building:b}:null; }
    function setNpcActivity(npc,slot){ npc.activity=slot.activity||"recreation"; npc.activityLabel=activities[npc.activity]?.label||npc.activity; const t=buildingTarget(slot.place); if(t){npc.destination=slot.place;npc.targetX=t.x;npc.targetY=t.y;npc.targetBuilding=t.building;} }
    function updateNpc(npc,dt){ const slot=scheduleFor(npc); if(!slot)return; const key=`${slot.from}-${slot.to}-${slot.place}`; if(npc._v21Slot!==key){npc._v21Slot=key;setNpcActivity(npc,slot);window.ChanarV20?.bus.emit("npc:activity",{npc,slot});} if(typeof npc.targetX!=="number")return; const dx=npc.targetX-npc.x,dy=npc.targetY-npc.y,dist=Math.hypot(dx,dy); if(dist<22){npc.v21State="at_destination";return;} npc.v21State="walking"; const step=Math.min(dist,Math.max(.5,(npc.speed||1)*32)*dt); npc.x+=dx/dist*step;npc.y+=dy/dist*step;npc.direction=Math.abs(dx)>=Math.abs(dy)?(dx>=0?"right":"left"):(dy>=0?"down":"up"); }
    function ambient(){ town.ambient.pedestrians=(world.hour>=7&&world.hour<20)?12:3; town.ambient.vehicles=(world.hour>=7&&world.hour<19)?7:2; town.ambient.animals=window.CHANAR_IDENTITY?.landmarks?.length?8:4; }
    function dailyEvents(){ const day=world.day||1;if(town.lastDay===day)return;town.lastDay=day;town.events=[];const w=(day-1)%7;if(w===5)town.events.push({id:"feria",title:"Movimiento de feria",zone:"center",start:10,end:14});if(w===6)town.events.push({id:"plaza",title:"Tarde en la plaza",zone:"center",start:17,end:21});town.events.push({id:"chacra",title:"Actividad en chacras",zone:"chacras",start:8,end:18}); }
    function update(dt){if(!Array.isArray(window.npcs))return;ambient();dailyEvents();window.npcs.forEach(n=>updateNpc(n,dt));town.activeEvents=town.events.filter(e=>{const h=hourFloat();return h>=e.start&&h<e.end;});}
    function getStatus(npc){return{name:npc.name,activity:npc.activityLabel||"andando",destination:npc.destination||null,state:npc.v21State||"idle"};}
    window.ChanarLivingTown={town,update,getStatus,activities,activeEvents:()=>town.activeEvents};
    let last=performance.now();setInterval(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.25);last=now;try{update(dt);}catch(e){console.error("Pueblo V21:",e);}},100);
})();
