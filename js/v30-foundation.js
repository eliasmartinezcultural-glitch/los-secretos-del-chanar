/*
 * LOS SECRETOS DEL CHAÑAR — V30 FOUNDATION
 *
 * Stable application layer on top of the existing V19-V29 runtime.
 * Goals:
 * - central event bus
 * - versioned persistent saves
 * - autosave + manual save/load
 * - resilient state snapshots
 * - mission/flag API for future content
 * - runtime diagnostics without changing the renderer
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'chanar:v30:save:slot1';
  const VERSION = '30.0';
  const SAVE_INTERVAL = 30000;

  const V30 = window.ChanarV30 = {
    version: VERSION,
    ready: false,
    dirty: false,
    lastSave: null,
    events: Object.create(null),
    flags: Object.create(null),
    missions: Object.create(null),
    activeMission: null
  };

  /* -----------------------------
     EVENT BUS
  ----------------------------- */
  V30.on = function (name, handler) {
    if (!V30.events[name]) V30.events[name] = [];
    V30.events[name].push(handler);
    return function unsubscribe () {
      V30.events[name] = V30.events[name].filter(function (fn) { return fn !== handler; });
    };
  };

  V30.emit = function (name, payload) {
    (V30.events[name] || []).slice().forEach(function (handler) {
      try { handler(payload); } catch (error) { console.error('[V30 event]', name, error); }
    });
  };

  /* -----------------------------
     FLAGS + MISSIONS
  ----------------------------- */
  V30.setFlag = function (key, value) {
    V30.flags[key] = value;
    V30.dirty = true;
    V30.emit('flag:changed', { key: key, value: value });
  };

  V30.getFlag = function (key, fallback) {
    return Object.prototype.hasOwnProperty.call(V30.flags, key) ? V30.flags[key] : fallback;
  };

  V30.registerMission = function (mission) {
    if (!mission || !mission.id) throw new Error('Mission requires an id');
    V30.missions[mission.id] = Object.assign({ status: 'available' }, mission);
    return V30.missions[mission.id];
  };

  V30.startMission = function (id) {
    const mission = V30.missions[id];
    if (!mission) return false;
    mission.status = 'active';
    V30.activeMission = id;
    V30.dirty = true;
    V30.emit('mission:started', mission);
    return true;
  };

  V30.completeMission = function (id) {
    const mission = V30.missions[id];
    if (!mission) return false;
    mission.status = 'completed';
    mission.completedAt = Date.now();
    if (V30.activeMission === id) V30.activeMission = null;
    V30.dirty = true;
    V30.emit('mission:completed', mission);
    return true;
  };

  /* -----------------------------
     NOTIFICATIONS
  ----------------------------- */
  function notify(message) {
    const node = document.getElementById('notification');
    if (!node) return;
    node.textContent = message;
    node.classList.add('v30-visible');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(function () {
      node.classList.remove('v30-visible');
    }, 2200);
  }

  V30.notify = notify;

  /* -----------------------------
     SNAPSHOT / RESTORE
  ----------------------------- */
  function numberOr(value, fallback) {
    return Number.isFinite(Number(value)) ? Number(value) : fallback;
  }

  function snapshot() {
    const p = window.player || {};
    const w = window.world || {};

    return {
      schema: 1,
      version: VERSION,
      savedAt: new Date().toISOString(),
      player: {
        x: numberOr(p.x, 2500),
        y: numberOr(p.y, 1800),
        direction: p.direction || 'down',
        bread: numberOr(p.bread, 0),
        mate: numberOr(p.mate, 0),
        inside: !!p.inside,
        currentBuilding: p.currentBuilding || null
      },
      world: {
        day: numberOr(w.day, 1),
        hour: numberOr(w.hour, 8),
        minute: numberOr(w.minute, 0),
        weather: w.weather || 'clear',
        rain: !!w.rain
      },
      progression: {
        flags: Object.assign({}, V30.flags),
        missions: JSON.parse(JSON.stringify(V30.missions)),
        activeMission: V30.activeMission
      }
    };
  }

  function restore(data) {
    if (!data || data.schema !== 1) throw new Error('Save incompatible');

    if (window.player && data.player) {
      window.player.x = numberOr(data.player.x, window.player.x);
      window.player.y = numberOr(data.player.y, window.player.y);
      window.player.direction = data.player.direction || window.player.direction;
      window.player.bread = numberOr(data.player.bread, window.player.bread || 0);
      window.player.mate = numberOr(data.player.mate, window.player.mate || 0);
      window.player.inside = !!data.player.inside;
      window.player.currentBuilding = data.player.currentBuilding || null;
    }

    if (window.world && data.world) {
      window.world.day = numberOr(data.world.day, window.world.day || 1);
      window.world.hour = numberOr(data.world.hour, window.world.hour || 8);
      window.world.minute = numberOr(data.world.minute, window.world.minute || 0);
      window.world.weather = data.world.weather || window.world.weather || 'clear';
      window.world.rain = !!data.world.rain;
    }

    V30.flags = Object.assign(Object.create(null), data.progression && data.progression.flags || {});
    V30.missions = Object.assign(Object.create(null), data.progression && data.progression.missions || {});
    V30.activeMission = data.progression && data.progression.activeMission || null;
    V30.dirty = false;
    V30.lastSave = data.savedAt || new Date().toISOString();
    V30.emit('save:loaded', data);
  }

  V30.save = function (silent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
      V30.lastSave = new Date().toISOString();
      V30.dirty = false;
      V30.emit('save:saved', { at: V30.lastSave });
      if (!silent) notify('Partida guardada');
      return true;
    } catch (error) {
      console.error('[V30 save]', error);
      notify('No se pudo guardar la partida');
      return false;
    }
  };

  V30.load = function () {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        notify('Todavía no hay una partida guardada');
        return false;
      }
      restore(JSON.parse(raw));
      const start = document.getElementById('start-screen');
      if (start) start.classList.add('hidden');
      window.gameStarted = true;
      notify('Partida cargada');
      return true;
    } catch (error) {
      console.error('[V30 load]', error);
      notify('La partida guardada está dañada o es incompatible');
      return false;
    }
  };

  V30.hasSave = function () {
    return !!localStorage.getItem(STORAGE_KEY);
  };

  /* -----------------------------
     INPUT + UI WIRING
  ----------------------------- */
  function wire() {
    const saveButton = document.createElement('button');
    saveButton.id = 'v30-save-button';
    saveButton.className = 'v30-save-button';
    saveButton.type = 'button';
    saveButton.textContent = '💾';
    saveButton.title = 'Guardar partida';
    saveButton.setAttribute('aria-label', 'Guardar partida');
    saveButton.addEventListener('click', function () { V30.save(false); });
    document.body.appendChild(saveButton);

    const loadButton = document.getElementById('load-button');
    if (loadButton) {
      loadButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        V30.load();
      }, true);
      loadButton.style.display = V30.hasSave() ? '' : 'none';
    }

    window.addEventListener('keydown', function (event) {
      if (event.key === 'F5') {
        event.preventDefault();
        V30.save(false);
      }
      if (event.key === 'F9') {
        event.preventDefault();
        V30.load();
      }
    }, true);

    window.addEventListener('beforeunload', function () {
      if (V30.dirty) V30.save(true);
    });

    setInterval(function () {
      if (V30.dirty && window.gameStarted) V30.save(true);
    }, SAVE_INTERVAL);
  }

  /* -----------------------------
     CORE MISSIONS — content-neutral
     The real historical content can be attached without touching the engine.
  ----------------------------- */
  V30.registerMission({
    id: 'explore-town',
    title: 'Explorá el pueblo',
    description: 'Recorré Chañar y descubrí lugares, personas y caminos.',
    status: 'active'
  });
  V30.activeMission = 'explore-town';

  /* Any meaningful gameplay mutation can mark the save dirty. */
  ['keydown', 'pointerdown', 'touchstart'].forEach(function (eventName) {
    window.addEventListener(eventName, function () {
      if (window.gameStarted) V30.dirty = true;
    }, { passive: true });
  });

  function boot() {
    window.CHANAR_VERSION = VERSION;
    window.CHANAR_ENGINE = 'V30';
    wire();
    V30.ready = true;
    V30.emit('ready', V30);
    console.info('[CHANAR] V30 foundation ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
