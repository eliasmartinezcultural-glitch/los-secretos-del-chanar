/* =========================================================
   LOS SECRETOS DEL CHAÑAR — V31 ENGINE CORE
   CONTRATO ESTRUCTURAL DEL MOTOR
   No crea un segundo game loop: organiza los sistemas existentes.
========================================================= */
(function () {
  'use strict';

  const Engine = window.ChanarEngine = window.ChanarEngine || {};
  Engine.version = '31.1';
  Engine.state = Engine.state || 'booting';
  Engine.services = Engine.services || Object.create(null);
  Engine.systems = Engine.systems || [];
  Engine.clock = Engine.clock || {
    last: 0,
    accumulator: 0,
    delta: 0,
    elapsed: 0,
    fixedStep: 1 / 60,
    maxDelta: 0.1
  };

  Engine.register = function (name, service) {
    if (!name || !service) return false;
    Engine.services[name] = service;
    return service;
  };

  Engine.get = function (name) {
    return Engine.services[name] || null;
  };

  Engine.addSystem = function (name, hooks) {
    if (!name || !hooks) return false;
    const existing = Engine.systems.find(function (s) { return s.name === name; });
    if (existing) return existing;
    const system = { name: name, hooks: hooks, enabled: true };
    Engine.systems.push(system);
    return system;
  };

  Engine.setEnabled = function (name, enabled) {
    const system = Engine.systems.find(function (s) { return s.name === name; });
    if (system) system.enabled = !!enabled;
    return !!system;
  };

  Engine.tick = function (timestamp) {
    const c = Engine.clock;
    if (!c.last) c.last = timestamp;
    c.delta = Math.min(Math.max((timestamp - c.last) / 1000, 0), c.maxDelta);
    c.last = timestamp;
    c.elapsed += c.delta;
    c.accumulator += c.delta;

    while (c.accumulator >= c.fixedStep) {
      Engine.systems.forEach(function (system) {
        if (!system.enabled || !system.hooks || typeof system.hooks.fixedUpdate !== 'function') return;
        try { system.hooks.fixedUpdate(c.fixedStep); } catch (error) {
          if (window.ChanarV31) window.ChanarV31.emit('engine:error', { system: system.name, error: error });
        }
      });
      c.accumulator -= c.fixedStep;
    }

    Engine.systems.forEach(function (system) {
      if (!system.enabled || !system.hooks || typeof system.hooks.update !== 'function') return;
      try { system.hooks.update(c.delta); } catch (error) {
        if (window.ChanarV31) window.ChanarV31.emit('engine:error', { system: system.name, error: error });
      }
    });
  };

  Engine.register('runtime', window.ChanarV31 || {});
  Engine.register('world', window.ChanarWorld || window.ChanarWorldSimulation || null);
  Engine.register('collision', window.ChanarCollision || null);
  Engine.register('npc', window.ChanarNPCLife || window.ChanarNPC || null);
  Engine.register('economy', window.ChanarEconomy || null);
  Engine.register('social', window.ChanarSocial || null);
  Engine.register('missions', window.ChanarV28Missions || null);

  Engine.health = function () {
    const required = ['runtime', 'world', 'collision', 'npc', 'economy', 'social', 'missions'];
    return required.reduce(function (report, name) {
      report[name] = !!Engine.get(name);
      return report;
    }, { version: Engine.version, ok: true });
  };

  const health = Engine.health();
  health.ok = health.runtime && health.world && health.collision && health.npc && health.economy && health.social && health.missions;
  Engine.healthReport = health;

  if (window.ChanarV31) {
    window.ChanarV31.engine = Engine;
    window.ChanarV31.emit('engine:ready', health);
  }

  window.CHANAR_ENGINE_CORE = Engine.version;
  console.info('[CHANAR] Engine Core 31.1 online', health);
})();
