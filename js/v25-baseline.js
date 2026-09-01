/* =====================================================
   LOS SECRETOS DEL CHAÑAR — V25 BASELINE
   Capa de compatibilidad y diagnóstico.
   No reemplaza el motor V19/V20/V22/V23/V24.
===================================================== */
(function () {
    "use strict";

    window.ChanarBaseline = {
        version: "25.0",
        systems: {},
        errors: [],
        startedAt: Date.now()
    };

    function register(name, value) {
        window.ChanarBaseline.systems[name] = !!value;
    }

    register("canvas", window.ctx);
    register("player", window.player);
    register("world", window.world);
    register("npcs", window.npcs);
    register("buildings", window.buildings);
    register("vehicles", window.vehicles);
    register("animals", window.animals);
    register("roads", window.roads);
    register("zones", window.zones);
    register("inventory", window.inventory);
    register("mission", window.mission);
    register("v20", window.ChanarV20);
    register("worldSystem", window.ChanarWorld);
    register("npcLife", window.ChanarNPCLife);

    window.addEventListener("error", function (event) {
        window.ChanarBaseline.errors.push({
            message: event.message || "Error desconocido",
            source: event.filename || "",
            line: event.lineno || 0,
            time: Date.now()
        });
    });

    window.ChanarBaseline.report = function () {
        return {
            version: this.version,
            systems: { ...this.systems },
            errors: this.errors.slice(),
            dimensions: {
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
    };
})();
