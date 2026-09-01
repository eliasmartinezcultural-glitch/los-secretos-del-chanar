/* =====================================================
   LOS SECRETOS DEL CHAÑAR — V25.1 STABILITY LAYER
   No reemplaza sistemas existentes. Centraliza diagnóstico,
   estado y compatibilidad para futuras versiones.
===================================================== */
(function () {
    "use strict";

    const state = window.CHANAR_RUNTIME = window.CHANAR_RUNTIME || {
        version: "25.1",
        boot: Date.now(),
        frames: 0,
        lastFrame: 0,
        errors: [],
        systems: {}
    };

    const names = [
        ["motor", window.player && window.canvas],
        ["mundo", window.ChanarWorld],
        ["colisiones", window.ChanarCollision],
        ["npcLife", window.ChanarNPCLife],
        ["economia", window.ChanarEconomy],
        ["social", window.ChanarSocial],
        ["eventos", window.ChanarEvents],
        ["estaciones", window.ChanarSeason],
        ["simulacion", window.ChanarV24Simulation],
        ["territorio", window.ChanarV24Territory]
    ];

    names.forEach(([name, value]) => state.systems[name] = !!value);

    window.addEventListener("error", function (e) {
        state.errors.push({ message: e.message || "error", file: e.filename || "", line: e.lineno || 0, at: Date.now() });
        if (state.errors.length > 50) state.errors.shift();
    });

    window.ChanarRuntime = {
        tick(dt) {
            state.frames++;
            state.lastFrame = dt || 0;
        },
        report() {
            return {
                version: state.version,
                uptime: Date.now() - state.boot,
                frames: state.frames,
                systems: { ...state.systems },
                errors: state.errors.slice(),
                world: {
                    width: typeof WORLD_WIDTH === "number" ? WORLD_WIDTH : null,
                    height: typeof WORLD_HEIGHT === "number" ? WORLD_HEIGHT : null
                },
                counts: {
                    npcs: Array.isArray(window.npcs) ? window.npcs.length : 0,
                    buildings: Array.isArray(window.buildings) ? window.buildings.length : 0,
                    vehicles: Array.isArray(window.vehicles) ? window.vehicles.length : 0,
                    animals: Array.isArray(window.animals) ? window.animals.length : 0,
                    objects: Array.isArray(window.objects) ? window.objects.length : 0
                }
            };
        }
    };
})();
