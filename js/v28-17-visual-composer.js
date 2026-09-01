/* V28.17 — visible world rendering layer, additive to the stable renderer. */
(function(){'use strict';
const R=window.ChanarV2817={version:'28.17',active:true};
const C={water:'#628f9b',tree:'#49634b',light:'#70855a',wood:'#70513d',vine:'#66724c'};
function get(){const c=document.getElementById('game');return c&&c.getContext('2d')}
function tree(g,x,y,s){g.save();g.translate(x,y);g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(0,s*.42,s*.7,s*.18,0,0,Math.PI*2);g.fill();g.fillStyle=C.wood;g.fillRect(-s*.08,0,s*.16,s*.65);g.fillStyle=C.tree;g.beginPath();g.arc(0,-s*.05,s*.42,0,Math.PI*2);g.fill();g.fillStyle=C.light;g.beginPath();g.arc(-s*.24,-s*.18,s*.27,0,Math.PI*2);g.fill();g.restore()}
function canal(g,x,y,w,h){g.fillStyle=C.water;g.fillRect(x,y,w,h);g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=2;for(let yy=y+8;yy<y+h;yy+=18){g.beginPath();g.moveTo(x+5,yy);g.quadraticCurveTo(x+w/2,yy-5,x+w-5,yy);g.stroke()}}
function vines(g,x,y,w,h){g.strokeStyle=C.vine;g.lineWidth=2;for(let yy=y;yy<y+h;yy+=24){g.beginPath();g.moveTo(x,yy);g.lineTo(x+w,yy);g.stroke()}for(let xx=x;xx<x+w;xx+=28){g.beginPath();g.moveTo(xx,y);g.lineTo(xx,y+h);g.stroke()}}
function fence(g,x,y,w){g.strokeStyle=C.wood;g.lineWidth=3;for(let xx=x;xx<=x+w;xx+=32){g.beginPath();g.moveTo(xx,y-15);g.lineTo(xx,y+15);g.stroke()}g.beginPath();g.moveTo(x,y-7);g.lineTo(x+w,y-7);g.moveTo(x,y+7);g.lineTo(x+w,y+7);g.stroke()}
R.draw=function(){const g=get();if(!g)return;const w=window.WORLD_WIDTH||5200,h=window.WORLD_HEIGHT||3600;g.save();g.globalAlpha=.9;for(let y=0;y<h;y+=240){g.fillStyle=y<1000?'rgba(105,125,82,.08)':'rgba(130,105,70,.045)';g.fillRect(0,y,w,120)}[[120,520,1050,16],[250,2320,900,15],[300,2920,1500,16],[3650,700,16,1500]].forEach(a=>canal(g,...a));[[180,650,760,360],[420,1750,700,380],[2800,2700,800,380]].forEach(a=>vines(g,...a));[[180,360,1100],[3600,500,900],[500,2480,1300],[3900,2750,850]].forEach(a=>fence(g,...a));[[140,420,42],[180,420,42],[3850,620,54],[3910,620,54],[4050,2650,54],[4110,2650,54]].forEach(a=>tree(g,...a));g.restore()};
R.install=function(){let last=0;function loop(t){if(t-last>500){last=t;try{R.draw()}catch(e){}}requestAnimationFrame(loop)}requestAnimationFrame(loop)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',R.install);else R.install();
})();
