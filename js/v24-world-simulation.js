/* LOS SECRETOS DEL CHAÑAR — V24 WORLD SIMULATION */
(function(){
'use strict';
const S=window.ChanarV24={version:'24.0',population:42,traffic:0,events:[],shops:{},families:{},needs:{},initialized:false};
const names=['Pedro','María','Juan','Ana','Rosa','Luis','Carlos','Elena','Martín','Sofía','Miguel','Laura','Diego','Clara','Nicolás','Paula','Ramiro','Valentina','Jorge','Marta'];
function init(){if(S.initialized)return; names.forEach((name,i)=>{const id='citizen_'+i;S.needs[id]={hunger:20+Math.random()*30,energy:60+Math.random()*40,social:30+Math.random()*40};S.families[id]='family_'+Math.floor(i/3);}); ['bakery','market','radio','school'].forEach(id=>S.shops[id]={open:true,customers:0,stock:20});S.initialized=true;}
function hour(){return Number(window.gameTime?.hour ?? window.gameState?.hour ?? 12);}
function update(){init();const h=hour();S.traffic=(h>=7&&h<=9||h>=17&&h<=20)?Math.round(12+Math.random()*8):Math.round(3+Math.random()*7);Object.values(S.needs).forEach(n=>{n.energy=Math.max(0,n.energy-.015);n.hunger=Math.min(100,n.hunger+.02);if(h>=18)n.social=Math.min(100,n.social+.03)});S.shops.bakery.open=h>=7&&h<20;S.shops.market.open=h>=8&&h<21;S.shops.school.open=h>=7&&h<17;}
function pulse(){const h=hour();let label='El pueblo está tranquilo.';if(h>=6&&h<9)label='La mañana empieza: movimiento hacia escuelas, comercios y chacras.';else if(h>=9&&h<13)label='Las chacras están activas y el centro empieza a moverse.';else if(h>=13&&h<16)label='La actividad baja durante la siesta.';else if(h>=17&&h<21)label='La tarde reactiva el pueblo.';else label='La noche reduce el movimiento y las calles quedan más vacías.';S.events.unshift({time:h,text:label});S.events=S.events.slice(0,8);return label;}
window.addEventListener('chanar:hour',update);window.addEventListener('chanar:day',pulse);update();
})();
