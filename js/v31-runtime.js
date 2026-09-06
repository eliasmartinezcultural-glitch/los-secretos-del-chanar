/* =========================================================
   LOS SECRETOS DEL CHAÑAR — V31 RUNTIME
   MOTOR DE ESTABILIDAD Y ESTADO

   V31 no reemplaza todavía el renderer legado.
   Se ocupa de que el juego tenga un contrato central para:
   - estado runtime
   - persistencia transaccional
   - NPC + relaciones
   - economía
   - pausa por pestaña
   - diagnóstico de rendimiento
   - recuperación de errores
   - ciclo de vida
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
  V.metrics = { frames: 0, fps: 0, frameMs: 0, errors: 0, lastTick: 0 };
  V.contract = {
    renderer: 'legacy-canvas',
    state: 'lexical-runtime',
    persistence: 'transactional-local',
    schema: SCHEMA
  };

  function getPlayer () { return typeof player !== 'undefined' ? player : null; }
  function getWorld () { return typeof world !== 'undefined' ? world : null; }
  function getNPCs () {
    if (typeof npcs !== 'undefined' && Array.isArray(npcs)) return npcs;
    return Array.isArray(window.npcs) ? window.npcs : [];
  }
  function getBuildings () {
    if (typeof buildings !== 'undefined' && Array.isArray(buildings)) return buildings;
    return Array.isArray(window.buildings) ? window.buildings : [];
  }

  function safeNumber (value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeJson (value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return null; }
  }

  /* -------------------------
     RUNTIME STATE CONTRACT
  ------------------------- */
  V.state = function () {
    const p = getPlayer() || {};
    const w = getWorld() || {};
    return {
      engine: V.version,
      player: {
        x: safeNumber(p.x, 2500), y: safeNumber(p.y, 1800),
        direction: p.direction || 'down',
        inside: !!p.inside, currentBuilding: p.currentBuilding || null,
        bread: safeNumber(p.bread, 0), mate: safeNumber(p.mate, 0),
        money: safeNumber(p.money, 12000), groceries: safeNumber(p.groceries, 0)
      },
      world: {
        day: safeNumber(w.day, 1), hour: safeNumber(w.hour, 8),
        minute: safeNumber(w.minute, 0), weather: w.weather || 'clear', rain: !!w.rain
      }
    };
  };

  /* -------------------------
     SAVE SNAPSHOT
  ------------------------- */
  V.snapshot = function () {
    const base = V.state();
    const ns = getNPCs().slice(0, MAX_NPC).map(function (n) {
      return {
        id: n.id || null,
        x: safeNumber(n.x, 0), y: safeNumber(n.y, 0),
        destination: n.destination || null,
        direction: n.direction || 'down',
        moving: !!n.moving,
        routineActivity: n.routineActivity || null,
        chanarRoutine: safeJson(n.chanarRoutine)
      };
    }).filter(function (n) { return !!n.id; });

    const social = window.ChanarSocial && window.ChanarSocial.relationships
      ? safeJson(window.ChanarSocial.relationships) || {} : {};
    const missions = window.ChanarV28Missions ? {
      active: safeJson(window.ChanarV28Missions.active),
      completed: safeJson(window.ChanarV28Missions.completed) || [],
      knowledge: safeJson(window.ChanarV28Missions.knowledge) || {},
      events: (window.ChanarV28Missions.events || []).slice(-100)
    } : null;

    return {
      schema: SCHEMA,
      engine: V.version,
      savedAt: new Date().toISOString(),
      player: base.player,
      world: base.world,
      npcs: ns,
      social: social,
      missions: missions,
      flags: window.ChanarV30 ? safeJson(window.ChanarV30.flags) || {} : {},
      meta: { npcCount: ns.length, saveSource: 'V31' }
    };
  };

  function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  V.save = function (silent) {
    try {
      const data = V.snapshot();
      const previous = localStorage.getItem(SAVE_KEY);
      if (previous) localStorage.setItem(BACKUP_KEY, previous);
      write(SAVE_KEY, data);
      if (window.ChanarV30) window.ChanarV30.dirty = false;
      V.lastSave = data.savedAt;
      if (!silent && typeof window.ChanarV30?.notify === 'function') {
        window.ChanarV30.notify('Partida guardada');
      }
      return true;
    } catch (error) {
      V.lastError = String(error && error.message || error);
      V.metrics.errors++;
      try {
        const data = V.snapshot();
        write(BACKUP_KEY, data);
      } catch (_) {}
      if (!silent && typeof window.ChanarV30?.notify === 'function') {
        window.ChanarV30.notify('No se pudo guardar la partida');
      }
      return false;
    }
  };

  function restoreNPCs(list) {
    if (!Array.isArray(list)) return;
    const current = getNPCs();
    list.forEach(function (saved) {
      const n = current.find(function (item) { return item.id === saved.id; });
      if (!n) return;
      n.x = safeNumber(saved.x, n.x);
      n.y = safeNumber(saved.y, n.y);
      n.destination = saved.destination || n.destination || null;
      n.direction = saved.direction || n.direction || 'down';
      n.moving = !!saved.moving;
      if (saved.routineActivity !== undefined) n.routineActivity = saved.routineActivity;
      if (saved.chanarRoutine) n.chanarRoutine = saved.chanarRoutine;
    });
  }

  function restore(data) {
    if (!data || ![1, 2, 3].includes(Number(data.schema))) {
      throw new Error('Formato de partida incompatible');
    }
    const p = getPlayer();
    const w = getWorld();
    if (p && data.player) Object.assign(p, {
      x: safeNumber(data.player.x, p.x), y: safeNumber(data.player.y, p.y),
      direction: data.player.direction || p.direction,
      bread: safeNumber(data.player.bread, 0), mate: safeNumber(data.player.mate, 0),
      money: safeNumber(data.player.money, p.money || 12000),
      groceries: safeNumber(data.player.groceries, p.groceries || 0),
      inside: !!data.player.inside, currentBuilding: data.player.currentBuilding || null
    });
    if (w && data.world) Object.assign(w, {
      day: safeNumber(data.world.day, w.day || 1),
      hour: safeNumber(data.world.hour, w.hour || 8),
      minute: safeNumber(data.world.minute, w.minute || 0),
      weather: data.world.weather || w.weather || 'clear', rain: !!data.world.rain
    });
    restoreNPCs(data.npcs);
    if (window.ChanarSocial && data.social) {
      window.ChanarSocial.relationships = Object.assign({}, data.social);
    }
    if (window.ChanarV28Missions && data.missions) {
      const M = window.ChanarV28Missions;
      M.active = data.missions.active || null;
      M.completed = Array.isArray(data.missions.completed) ? data.missions.completed : [];
      M.knowledge = data.missions.knowledge || {};
      M.events = Array.isArray(data.missions.events) ? data.missions.events : [];
    }
    if (window.ChanarV30 && data.flags) {
      window.ChanarV30.flags = Object.assign(Object.create(null), data.flags);
    }
    V.lastLoad = data.savedAt || null;
  }

  V.load = function () {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(BACKUP_KEY);
      if (!raw) {
        if (typeof window.ChanarV30?.notify === 'function') window.ChanarV30.notify('Todavía no hay una partida guardada');
        return false;
      }
      restore(JSON.parse(raw));
      if (typeof gameStarted !== 'undefined') gameStarted = true;
      const start = document.getElementById('start-screen');
      if (start) start.classList.add('hidden');
      V.emit('loaded', V.state());
      if (typeof window.ChanarV30?.notify === 'function') window.ChanarV30.notify('Partida cargada');
      return true;
    } catch (error) {
      V.lastError = String(error && error.message || error);
      V.metrics.errors++;
      if (typeof window.ChanarV30?.notify === 'function') window.ChanarV30.notify('Partida dañada: se intentará la copia de respaldo');
      try {
        const backup = localStorage.getItem(BACKUP_KEY);
        if (!backup) return false;
        restore(JSON.parse(backup));
        if (typeof gameStarted !== 'undefined') gameStarted = true;
        const start = document.getElementById('start-screen');
        if (start) start.classList.add('hidden');
        return true;
      } catch (_) { return false; }
    }
  };

  V.hasSave = function () { return !!(localStorage.getItem(SAVE_KEY) || localStorage.getItem(BACKUP_KEY)); };

  /* -------------------------
     EVENT / LIFECYCLE BUS
  ------------------------- */
  V.listeners = Object.create(null);
  V.on = function (name, fn) {
    (V.listeners[name] || (V.listeners[name] = [])).push(fn);
    return function () { V.listeners[name] = (V.listeners[name] || []).filter(function (x) { return x !== fn; }); };
  };
  V.emit = function (name, payload) {
    (V.listeners[name] || []).slice().forEach(function (fn) { try { fn(payload); } catch (e) { V.metrics.errors++; } });
    if (window.ChanarV30?.emit) window.ChanarV30.emit('v31:' + name, payload);
  };

  /* -------------------------
     VISIBILITY / PAUSE
  ------------------------- */
  document.addEventListener('visibilitychange', function () {
    const hidden = document.hidden;
    V.pausedBySystem = hidden;
    if (typeof paused !== 'undefined') paused = hidden;
    V.emit(hidden ? 'suspended' : 'resumed', { reason: 'visibility' });
    if (hidden) V.save(true);
  });

  /* -------------------------
     PERFORMANCE TELEMETRY
  ------------------------- */
  let lastFrame = performance.now();
  let fpsFrames = 0;
  let fpsStart = lastFrame;
  function telemetry(now) {
    const delta = now - lastFrame;
    lastFrame = now;
    V.metrics.frameMs = delta;
    fpsFrames++;
    if (now - fpsStart >= 1000) {
      V.metrics.fps = fpsFrames;
      fpsFrames = 0;
      fpsStart = now;
      V.emit('metrics', Object.assign({}, V.metrics));
    }
    V.metrics.frames++;
    requestAnimationFrame(telemetry);
  }

  /* -------------------------
     GLOBAL ERROR CONTAINMENT
  ------------------------- */
  window.addEventListener('error', function (event) {
    V.lastError = String(event.message || 'Error de runtime');
    V.metrics.errors++;
    V.emit('error', { message: V.lastError, source: event.filename || null, line: event.lineno || null });
  });
  window.addEventListener('unhandledrejection', function (event) {
    V.lastError = String(event.reason && event.reason.message || event.reason || 'Promesa rechazada');
    V.metrics.errors++;
    V.emit('error', { message: V.lastError });
  });

  /* -------------------------
     SAFE SAVE INPUT
  ------------------------- */
  window.addEventListener('keydown', function (event) {
    if (event.key === 'F5') { event.preventDefault(); V.save(false); }
    if (event.key === 'F9') { event.preventDefault(); V.load(); }
  }, true);

  function boot() {
    if (V.ready) return;
    V.ready = true;
    window.CHANAR_ENGINE = 'V31';
    window.CHANAR_SCHEMA = SCHEMA;
    requestAnimationFrame(telemetry);
    setInterval(function () {
      const started = typeof gameStarted !== 'undefined' ? gameStarted : false;
      if (started && (window.ChanarV30?.dirty || V.hasSave())) V.save(true);
    }, AUTOSAVE_MS);
    V.emit('ready', V.contract);
    console.info('[CHANAR] V31 runtime online');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
