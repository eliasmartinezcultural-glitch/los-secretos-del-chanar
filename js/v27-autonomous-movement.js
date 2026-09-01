/* LOS SECRETOS DEL CHAÑAR — V27.5 AUTONOMOUS MOVEMENT */
(function(){'use strict';
const M=window.ChanarAutonomousMovement={version:'27.5',enabled:true,stats:{moving:0,arrived:0,blocked:0}};
const SIZE={w:28,h:34};
function overlap(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y}
function blocked(x,y,target){if(x<0||y<0||x+SIZE.w>window.WORLD_WIDTH||y+SIZE.h>window.WORLD_HEIGHT)return true;const r={x,y,width:SIZE.w,height:SIZE.h};return (window.buildings||[]).some(b=>b.id!==target&&overlap(r,b))}
function tryMove(n,dx,dy,target){const x=n.x+dx,y=n.y+dy;if(!blocked(x,y,target)){n.x=x;n.y=y;return true}return false}
function step(){if(!M.enabled||!Array.isArray(window.npcs))return;let moving=0,arrived=0,blockedCount=0;window.npcs.forEach(n=>{const t=n.routineTarget;if(!t||n.inside)return;const dx=t.x-n.x,dy=t.y-n.y,d=Math.hypot(dx,dy);if(d<=30){n.x=t.x;n.y=t.y;n.routineTarget=null;n.routineActivity=n.chanarRoutine?.state||n.routineActivity;n.moving=false;arrived++;return}const speed=Math.min(Number(n.speed)||1,1.7),ux=dx/d*speed,uy=dy/d*speed;let ok=tryMove(n,ux,uy,t.place);if(!ok)ok=tryMove(n,ux,0,t.place);if(!ok)ok=tryMove(n,0,uy,t.place);if(!ok){const side=Math.random()<.5?1:-1;ok=tryMove(n,-uy*side,ux*side,t.place)}if(ok){n.moving=true;n.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');n.v27Blocked=false;moving++}else{n.moving=false;n.v27Blocked=true;blockedCount++}});M.stats={moving,arrived,blocked:blockedCount}}
M.step=step;function loop(){step();requestAnimationFrame(loop)}loop();})();
