/* V30 progression bridge: V28 already contains the game's mission engine.
   V30 owns persistence; this adapter prevents two competing mission systems. */
(function () {
  'use strict';
  const KEY = 'chanar:v30:save:slot1';

  function boot() {
    const V = window.ChanarV30;
    const M = window.ChanarV28Missions;
    if (!V || !M || V.__progressionBridge) return;

    const originalSave = V.save;
    V.save = function (silent) {
      const ok = originalSave(silent);
      if (!ok) return false;
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return true;
        const data = JSON.parse(raw);
        data.legacyMissions = {
          active: M.active,
          completed: M.completed,
          knowledge: M.knowledge,
          events: M.events.slice(-100)
        };
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch (error) {
        console.error('[V30 progression save]', error);
      }
      return true;
    };

    const originalLoad = V.load;
    V.load = function () {
      const ok = originalLoad();
      if (!ok) return false;
      try {
        const raw = localStorage.getItem(KEY);
        const data = raw ? JSON.parse(raw) : null;
        const saved = data && data.legacyMissions;
        if (saved) {
          M.active = saved.active || null;
          M.completed = Array.isArray(saved.completed) ? saved.completed : [];
          M.knowledge = saved.knowledge || {};
          M.events = Array.isArray(saved.events) ? saved.events : [];
        }
      } catch (error) {
        console.error('[V30 progression load]', error);
      }
      V.emit('progression:loaded', M.status());
      return true;
    };

    ['start', 'do', 'finish'].forEach(function (method) {
      const original = M[method];
      if (typeof original !== 'function') return;
      M[method] = function () {
        const result = original.apply(M, arguments);
        V.dirty = true;
        V.emit('progression:changed', M.status());
        return result;
      };
    });

    if (!M.active && M.completed.indexOf('intro-explore') < 0) {
      M.start('intro-explore');
    }

    V.__progressionBridge = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
})();
