/* LOS SECRETOS DEL CHAÑAR — V29 ENGINE
 * Canonical orchestration layer. Keeps existing state/input APIs while centralizing V29 diagnostics and render hooks.
 */
(function(){'use strict';
const V=window.ChanarV29={version:'29.0',status:'booting',booted:false,frame:0,dt:0,last:0,diagnostics:{}};
const canvas=()=>document.getElementById('game');
function snapshot(){return {player:window.player||null,npcs:Array.isArray(window.npcs)?window.npcs:[],animals:Array.isArray(window.animals)?window.animals:[],vehicles:Array.isArray(window.vehicles)?window.vehicles:[],camera:window.camera||null}}
V.inspect=function(){const c=canvas(),s=snapshot();V.diagnostics={canvas:!!c,context:!!(c&&c.getContext),player:!!s.player,npcs:s.npcs.length,animals:s.animals.length,vehicles:s.vehicles.length,visualEntities:!!window.ChanarV2818,visualWorld:!!window.ChanarV2817};return V.diagnostics};
V.safe=function(fn){try{return fn()}catch(e){console.error('[V29]',e);V.diagnostics.lastError=String(e&&e.message||e);return null}};
V.getState=snapshot;
function tick(t){if(!V.booted)return;const now=t||performance.now();V.dt=Math.min(.05,Math.max(0,(now-V.last)/1000));V.last=now;V.frame++;const state=snapshot();if(window.ChanarV29Visual&&typeof window.ChanarV29Visual.render==='function')V.safe(()=>window.ChanarV29Visual.render(state,V.dt));requestAnimationFrame(tick)}
function boot(){V.inspect();window.CHANAR_VERSION='29.0';window.CHANAR_ENGINE='V29';V.status='ready';V.booted=true;V.last=performance.now();requestAnimationFrame(tick);console.info('[CHANAR] V29 ready',V.diagnostics)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
