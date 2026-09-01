/* =====================================================
   LOS SECRETOS DEL CHAÑAR — V26 SOCIAL SIMULATION
   Ciudadanos autónomos sobre la base V24. No elimina V24.
===================================================== */
(function () {
    "use strict";

    const S = window.ChanarSocialSim = window.ChanarSocialSim || {
        version: "26.0",
        citizens: [],
        encounters: [],
        initialized: false
    };

    const archetypes = [
        { role: "productor", home: "farmhouse", work: "vineyards" },
        { role: "comerciante", home: "house1", work: "market" },
        { role: "comunicador", home: "house3", work: "radio" },
        { role: "docente", home: "house2", work: "school" },
        { role: "trabajador_rural", home: "farmhouse", work: "chacras" },
        { role: "vecino", home: "house1", work: "market" }
    ];

    function init() {
        if (S.initialized) return;
        const source = Array.isArray(window.npcs) ? window.npcs : [];
        source.forEach((npc, i) => {
            const a = archetypes[i % archetypes.length];
            S.citizens.push({
                id: npc.id,
                name: npc.name,
                role: a.role,
                home: a.home,
                work: a.work,
                mood: 50 + Math.random() * 40,
                lastActivity: "en casa",
                lastEncounter: null
            });
        });
        S.initialized = true;
    }

    function hour() {
        return Number(window.gameTime?.hour ?? window.gameState?.hour ?? 12);
    }

    function activity(c) {
        const h = hour();
        if (h < 7) return "durmiendo";
        if (h < 9) return c.role === "trabajador_rural" || c.role === "productor" ? "yendo a la chacra" : "saliendo de casa";
        if (h < 13) return c.role === "docente" ? "trabajando en la escuela" : c.role === "comerciante" ? "atendiendo el comercio" : c.role === "comunicador" ? "en la radio" : "trabajando";
        if (h < 16) return "en casa / descanso";
        if (h < 20) return c.role === "trabajador_rural" || c.role === "productor" ? "volviendo de la chacra" : "haciendo compras o visitando vecinos";
        return "actividad social / en casa";
    }

    function update() {
        init();
        S.citizens.forEach(c => c.lastActivity = activity(c));
        const visible = S.citizens.filter(c => c.lastActivity !== "durmiendo");
        if (visible.length > 1 && Math.random() < 0.18) {
            const a = visible[Math.floor(Math.random() * visible.length)];
            const b = visible[Math.floor(Math.random() * visible.length)];
            if (a !== b) {
                const encounter = { a: a.name, b: b.name, activity: "encuentro casual", hour: hour(), time: Date.now() };
                S.encounters.unshift(encounter);
                S.encounters = S.encounters.slice(0, 12);
                a.lastEncounter = b.name;
                b.lastEncounter = a.name;
                window.dispatchEvent(new CustomEvent("chanar:encounter", { detail: encounter }));
            }
        }
    }

    window.ChanarSocialSim = S;
    window.ChanarSocialSim.update = update;
    window.addEventListener("chanar:hour", update);
    update();
})();
