/* V28.13 — runtime repair + gameplay adapter. Keeps V19/V27 movers authoritative. */
(function(){'use strict';
const R=window.ChanarV28Runtime={version:'28.13',ticks:0,repairs:0};
const normalizeZone=z=>{const s=String(z||'').toLowerCase();if(s.includes('chacra')||s.includes('rural'))return'farm';if(s.includes('centro'))return'plaza';if(s.includes('ribera'))return'river';return'street'};
const targets={farm:'farmhouse',bakery:'bakery',market:'market',radio:'radio',school:'school'};
function building(id){const a=typeof buildings!=='undefined'?buildings:window.buildings;const b=Array.isArray(a)?a.find(x=>x.id===id):null;return b?{x:b.x+b.width/2,y:b.y+b.height/2,place:id}:null}
function resolveDestination(entry){const id=entry&&entry.destination;if(!id||id==='street'||id==='plaza'||id==='river'||id==='home')return null;return building(id)||building(targets[id]);}
R.tick=function(){R.ticks++;if(!window.ChanarV28Life)return;const list=typeof npcs!=='undefined'&&Array.isArray(npcs)?npcs:[];const hour=typeof world!=='undefined'?world.hour:8;list.forEach(n=>{const zone=normalizeZone(window.ChanarV28Architecture&&ChanarV28Architecture.zoneAt?ChanarV28Architecture.zoneAt(n.x,n.y):'street');const entry=ChanarV28Life.tick(n,{hour:hour,zone:zone});const t=resolveDestination(entry);if(t){n.chanarRoutine={state:entry.state,destination:t.place,targetX:t.x,targetY:t.y};}else if(entry&&entry.state==='wander'){n.chanarRoutine={state:entry.state,destination:zone,targetX:n.x,targetY:n.y};}n.v28State=entry&&entry.state||'idle';n.v28Destination=entry&&entry.destination||null});R.repairs++};
R.mission=function(action,target){const M=window.ChanarV28Missions;if(!M)return false;return M.do(action,target)};
R.updateHUD=function(){const M=window.ChanarV28Missions;if(!M)return;const cur=M.current(),el=document.getElementById('mission-hud');if(el)el.textContent=cur&&cur.current?cur.current.text:'Explorá el pueblo'};
function boot(){if(R.timer)return;R.timer=setInterval(function(){try{R.tick();R.updateHUD()}catch(e){R.lastError=String(e&&e.message||e)}},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
