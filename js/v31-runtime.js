/* =========================================================
   LOS SECRETOS DEL CHAÑAR — V31 RUNTIME
   MOTOR DE ESTABILIDAD Y ESTADO
========================================================= */
(function () {
  'use strict';
  const V = window.ChanarV31 = window.ChanarV31 || {};
  const SAVE_KEY = 'chanar:v31:save:slot1';
  const BACKUP_KEY = 'chanar:v31:save:backup';
  const SCHEMA = 3;
  const AUTOSAVE_MS = 45000;
  const MAX_NPC = 300;

  V.version = '31.0';
  V.ready = false;
  V.pausedBySystem = false;
  V.lastError = null;
  V.metrics = { frames: 0, fps: 0, frameMs: 0, errors: 0 };
  V.contract = { renderer: 'legacy-canvas', state: 'lexical-runtime', persistence: 'transactional-local', schema: SCHEMA };

  function getPlayer(){return typeof player!=='undefined'?player:null}
  function getWorld(){return typeof world!=='undefined'?world:null}
  function getNPCs(){return typeof npcs!=='undefined'&&Array.isArray(npcs)?npcs:(Array.isArray(window.npcs)?window.npcs:[])}
  function safeNumber(v,f){const n=Number(v);return Number.isFinite(n)?n:f}
  function safeJson(v){try{return JSON.parse(JSON.stringify(v))}catch(_){return null}}

  V.state=function(){const p=getPlayer()||{},w=getWorld()||{};return{engine:V.version,player:{x:safeNumber(p.x,2500),y:safeNumber(p.y,1800),direction:p.direction||'down',inside:!!p.inside,currentBuilding:p.currentBuilding||null,bread:safeNumber(p.bread,0),mate:safeNumber(p.mate,0),money:safeNumber(p.money,12000),groceries:safeNumber(p.groceries,0)},world:{day:safeNumber(w.day,1),hour:safeNumber(w.hour,8),minute:safeNumber(w.minute,0),weather:w.weather||'clear',rain:!!w.rain)}};

  V.snapshot=function(){const s=V.state();const ns=getNPCs().slice(0,MAX_NPC).map(n=>({id:n.id||null,x:safeNumber(n.x,0),y:safeNumber(n.y,0),destination:n.destination||null,direction:n.direction||'down',moving:!!n.moving,routineActivity:n.routineActivity||null,chanarRoutine:safeJson(n.chanarRoutine)})).filter(n=>!!n.id);const social=window.ChanarSocial?.relationships?safeJson(window.ChanarSocial.relationships)||{}:{};const missions=window.ChanarV28Missions?{active:safeJson(window.ChanarV28Missions.active),completed:safeJson(window.ChanarV28Missions.completed)||[],knowledge:safeJson(window.ChanarV28Missions.knowledge)||{},events:(window.ChanarV28Missions.events||[]).slice(-100)}:null;return{schema:SCHEMA,engine:V.version,savedAt:new Date().toISOString(),player:s.player,world:s.world,npcs:ns,social,missions,flags:window.ChanarV30?safeJson(window.ChanarV30.flags)||{}:{},meta:{npcCount:ns.length,saveSource:'V31'}}};

  function write(k,d){localStorage.setItem(k,JSON.stringify(d))}
  V.save=function(silent){try{const data=V.snapshot();const old=localStorage.getItem(SAVE_KEY);if(old)localStorage.setItem(BACKUP_KEY,old);write(SAVE_KEY,data);if(window.ChanarV30)window.ChanarV30.dirty=false;V.lastSave=data.savedAt;if(!silent&&window.ChanarV30?.notify)window.ChanarV30.notify('Partida guardada');return true}catch(e){V.lastError=String(e?.message||e);V.metrics.errors++;try{write(BACKUP_KEY,V.snapshot())}catch(_){}if(!silent&&window.ChanarV30?.notify)window.ChanarV30.notify('No se pudo guardar la partida');return false}};

  function restoreNPCs(list){if(!Array.isArray(list))return;const cur=getNPCs();list.forEach(s=>{const n=cur.find(x=>x.id===s.id);if(!n)return;n.x=safeNumber(s.x,n.x);n.y=safeNumber(s.y,n.y);n.destination=s.destination||n.destination||null;n.direction=s.direction||n.direction||'down';n.moving=!!s.moving;if(s.routineActivity!==undefined)n.routineActivity=s.routineActivity;if(s.chanarRoutine)n.chanarRoutine=s.chanarRoutine})}
  function restore(data){if(!data||![1,2,3].includes(Number(data.schema)))throw new Error('Formato de partida incompatible');const p=getPlayer(),w=getWorld();if(p&&data.player)Object.assign(p,{x:safeNumber(data.player.x,p.x),y:safeNumber(data.player.y,p.y),direction:data.player.direction||p.direction,bread:safeNumber(data.player.bread,0),mate:safeNumber(data.player.mate,0),money:safeNumber(data.player.money,p.money||12000),groceries:safeNumber(data.player.groceries,p.groceries||0),inside:!!data.player.inside,currentBuilding:data.player.currentBuilding||null});if(w&&data.world)Object.assign(w,{day:safeNumber(data.world.day,w.day||1),hour:safeNumber(data.world.hour,w.hour||8),minute:safeNumber(data.world.minute,w.minute||0),weather:data.world.weather||w.weather||'clear',rain:!!data.world.rain});restoreNPCs(data.npcs);if(window.ChanarSocial&&data.social)Object.assign(window.ChanarSocial.relationships,data.social);if(window.ChanarV28Missions&&data.missions){const M=window.ChanarV28Missions;M.active=data.missions.active||null;M.completed=Array.isArray(data.missions.completed)?data.missions.completed:[];M.knowledge=data.missions.knowledge||{};M.events=Array.isArray(data.missions.events)?data.missions.events:[]}if(window.ChanarV30&&data.flags)window.ChanarV30.flags=Object.assign(Object.create(null),data.flags);V.lastLoad=data.savedAt||null}

  V.load=function(){try{const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem(BACKUP_KEY);if(!raw){window.ChanarV30?.notify?.('Todavía no hay una partida guardada');return false}restore(JSON.parse(raw));if(typeof gameStarted!=='undefined')gameStarted=true;document.getElementById('start-screen')?.classList.add('hidden');V.emit('loaded',V.state());window.ChanarV30?.notify?.('Partida cargada');return true}catch(e){V.lastError=String(e?.message||e);V.metrics.errors++;try{const raw=localStorage.getItem(BACKUP_KEY);if(!raw)throw e;restore(JSON.parse(raw));if(typeof gameStarted!=='undefined')gameStarted=true;document.getElementById('start-screen')?.classList.add('hidden');return true}catch(_){window.ChanarV30?.notify?.('La partida guardada no pudo recuperarse');return false}}};
  V.hasSave=function(){return!!(localStorage.getItem(SAVE_KEY)||localStorage.getItem(BACKUP_KEY))};

  V.listeners=Object.create(null);V.on=function(name,fn){(V.listeners[name]||(V.listeners[name]=[])).push(fn);return()=>{V.listeners[name]=(V.listeners[name]||[]).filter(x=>x!==fn)}};V.emit=function(name,payload){(V.listeners[name]||[]).slice().forEach(fn=>{try{fn(payload)}catch(_){V.metrics.errors++}});window.ChanarV30?.emit?.('v31:'+name,payload)};

  document.addEventListener('visibilitychange',()=>{const hidden=document.hidden;V.pausedBySystem=hidden;if(typeof paused!=='undefined')paused=hidden;V.emit(hidden?'suspended':'resumed',{reason:'visibility'});if(hidden)V.save(true)});

  let last=performance.now(),frames=0,windowStart=last;function telemetry(now){V.metrics.frameMs=now-last;last=now;frames++;if(now-windowStart>=1000){V.metrics.fps=frames;frames=0;windowStart=now;V.emit('metrics',Object.assign({},V.metrics))}V.metrics.frames++;requestAnimationFrame(telemetry)}

  window.addEventListener('error',e=>{V.lastError=String(e.message||'Error de runtime');V.metrics.errors++;V.emit('error',{message:V.lastError,source:e.filename||null,line:e.lineno||null})});window.addEventListener('unhandledrejection',e=>{V.lastError=String(e.reason?.message||e.reason||'Promesa rechazada');V.metrics.errors++;V.emit('error',{message:V.lastError})});
  window.addEventListener('keydown',e=>{if(e.key==='F5'){e.preventDefault();V.save(false)}if(e.key==='F9'){e.preventDefault();V.load()}},true);

  function boot(){if(V.ready)return;V.ready=true;window.CHANAR_ENGINE='V31';window.CHANAR_SCHEMA=SCHEMA;requestAnimationFrame(telemetry);setInterval(()=>{const started=typeof gameStarted!=='undefined'&&gameStarted;if(started&&window.ChanarV30?.dirty)V.save(true)},AUTOSAVE_MS);V.emit('ready',V.contract);console.info('[CHANAR] V31 runtime online')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
