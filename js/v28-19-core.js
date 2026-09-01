/* V28.19 — integration, diagnostics and safe visual bridge. */
(function(){'use strict';
const V=window.ChanarV2819={version:'28.19',status:'booting',errors:[],frames:0,visual:true};
function canvas(){return document.getElementById('game')}
function diag(){V.canvas=!!canvas();V.ctx=!!(canvas()&&canvas().getContext);V.renderer=!!window.ChanarV2817;V.entities=!!window.ChanarV2818;V.missions=!!window.ChanarV28Missions;V.runtime=!!window.ChanarV28Runtime;V.status=V.canvas&&V.ctx?'ready':'canvas-missing';return V}
V.safe=function(fn){try{return fn()}catch(e){V.errors.push(String(e&&e.message||e));return null}}
function boot(){diag();V.startedAt=Date.now();V.status='ready';window.CHANAR_VERSION='28.19';window.CHANAR_BUILD='visual-integration';setInterval(diag,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
