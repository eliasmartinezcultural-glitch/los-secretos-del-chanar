/*
 * V30 runtime adapter.
 * The legacy engine declares player/world/gameStarted as top-level lexical globals,
 * not window properties. This adapter deliberately accesses those bindings directly.
 */
(function () {
  'use strict';

  const KEY = 'chanar:v30:save:slot1';

  function runtimePlayer() {
    return typeof player !== 'undefined' ? player : null;
  }

  function runtimeWorld() {
    return typeof world !== 'undefined' ? world : null;
  }

  function runtimeStarted() {
    return typeof gameStarted !== 'undefined' ? gameStarted : false;
  }

  function setRuntimeStarted(value) {
    if (typeof gameStarted !== 'undefined') gameStarted = !!value;
  }

  function snapshot() {
    const p = runtimePlayer() || {};
    const w = runtimeWorld() || {};
    const V = window.ChanarV30;

    return {
      schema: 2,
      version: '30.0',
      savedAt: new Date().toISOString(),
      player: {
        x: Number(p.x) || 2500,
        y: Number(p.y) || 1800,
        direction: p.direction || 'down',
        bread: Number(p.bread) || 0,
        mate: Number(p.mate) || 0,
        inside: !!p.inside,
        currentBuilding: p.currentBuilding || null
      },
      world: {
        day: Number(w.day) || 1,
        hour: Number(w.hour) || 8,
        minute: Number(w.minute) || 0,
        weather: w.weather || 'clear',
        rain: !!w.rain
      },
      progression: {
        flags: Object.assign({}, V.flags),
        missions: JSON.parse(JSON.stringify(V.missions)),
        activeMission: V.activeMission
      }
    };
  }

  function restore(data) {
    if (!data || (data.schema !== 1 && data.schema !== 2)) {
      throw new Error('Save incompatible');
    }

    const p = runtimePlayer();
    const w = runtimeWorld();
    const V = window.ChanarV30;

    if (p && data.player) {
      p.x = Number(data.player.x) || p.x;
      p.y = Number(data.player.y) || p.y;
      p.direction = data.player.direction || p.direction;
      p.bread = Number(data.player.bread) || 0;
      p.mate = Number(data.player.mate) || 0;
      p.inside = !!data.player.inside;
      p.currentBuilding = data.player.currentBuilding || null;
    }

    if (w && data.world) {
      w.day = Number(data.world.day) || w.day;
      w.hour = Number(data.world.hour) || w.hour;
      w.minute = Number(data.world.minute) || w.minute;
      w.weather = data.world.weather || w.weather;
      w.rain = !!data.world.rain;
    }

    V.flags = Object.assign(Object.create(null), data.progression && data.progression.flags || {});
    V.missions = Object.assign(Object.create(null), data.progression && data.progression.missions || {});
    V.activeMission = data.progression && data.progression.activeMission || null;
    V.dirty = false;
    V.lastSave = data.savedAt || new Date().toISOString();
  }

  function boot() {
    const V = window.ChanarV30;
    if (!V || V.__lexicalRuntimeReady) return;

    V.save = function (silent) {
      try {
        localStorage.setItem(KEY, JSON.stringify(snapshot()));
        V.lastSave = new Date().toISOString();
        V.dirty = false;
        V.emit('save:saved', { at: V.lastSave });
        if (!silent && typeof V.notify === 'function') V.notify('Partida guardada');
        return true;
      } catch (error) {
        console.error('[V30 runtime save]', error);
        if (typeof V.notify === 'function') V.notify('No se pudo guardar la partida');
        return false;
      }
    };

    V.load = function () {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) {
          if (typeof V.notify === 'function') V.notify('Todavía no hay una partida guardada');
          return false;
        }
        const data = JSON.parse(raw);
        restore(data);
        setRuntimeStarted(true);
        const start = document.getElementById('start-screen');
        if (start) start.classList.add('hidden');
        V.emit('save:loaded', data);
        if (typeof V.notify === 'function') V.notify('Partida cargada');
        return true;
      } catch (error) {
        console.error('[V30 runtime load]', error);
        if (typeof V.notify === 'function') V.notify('La partida guardada está dañada o es incompatible');
        return false;
      }
    };

    V.hasSave = function () {
      return !!localStorage.getItem(KEY);
    };

    setInterval(function () {
      if (V.dirty && runtimeStarted()) V.save(true);
    }, 30000);

    V.__lexicalRuntimeReady = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
})();
