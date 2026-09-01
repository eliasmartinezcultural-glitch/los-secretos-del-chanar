/* =====================================================
   LOS SECRETOS DEL CHAÑAR — V20 CORE
   Capa incremental sobre V19.0.
   No reemplaza el motor existente: agrega estado,
   guardado, eventos, rutinas NPC y utilidades.
===================================================== */
(function () {
    "use strict";

    const STORAGE_KEY = "chanar_save_v20";
    const AUTOSAVE_MS = 30000;

    const bus = {
        events: Object.create(null),
        on(name, fn) {
            (this.events[name] ||= []).push(fn);
            return () => {
                this.events[name] = (this.events[name] || []).filter(x => x !== fn);
            };
        },
        emit(name, payload) {
            (this.events[name] || []).forEach(fn => {
                try { fn(payload); } catch (error) { console.error("Evento V20:", name, error); }
            });
        }
    };

    function snapshot() {
        return {
            version: 20,
            savedAt: new Date().toISOString(),
            player: {
                x: player.x, y: player.y, direction: player.direction,
                bread: player.bread || 0, mate: player.mate || 0,
                inside: !!player.inside,
                currentBuilding: player.currentBuilding || null
            },
            world: {
                day: world.day, hour: world.hour, minute: world.minute,
                weather: world.weather, rain: !!world.rain
            },
            npcs: npcs.map(npc => ({
                id: npc.id, x: npc.x, y: npc.y,
                destination: npc.destination || null
            }))
        };
    }

    function save(reason = "manual") {
        try {
            const data = snapshot();
            data.reason = reason;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            bus.emit("save", data);
            notify("Partida guardada");
            return true;
        } catch (error) {
            console.error("No se pudo guardar la partida:", error);
            notify("No se pudo guardar la partida");
            return false;
        }
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);
            if (!data || data.version !== 20) return false;

            Object.assign(player, data.player || {});
            Object.assign(world, data.world || {});

            const savedNPCs = data.npcs || [];
            savedNPCs.forEach(saved => {
                const npc = npcs.find(n => n.id === saved.id);
                if (npc) Object.assign(npc, saved);
            });

            bus.emit("load", data);
            notify("Partida cargada");
            return true;
        } catch (error) {
            console.error("No se pudo cargar la partida:", error);
            notify("La partida guardada está dañada");
            return false;
        }
    }

    function notify(message) {
        const el = document.getElementById("notification");
        if (!el) return;
        el.textContent = message;
        el.classList.add("show");
        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => el.classList.remove("show"), 1800);
    }

    function currentSchedule(npc) {
        const schedules = window.CHANAR_NPC_SCHEDULES || {};
        const list = schedules[npc.id];
        if (!list) return null;
        const hour = world.hour + ((world.minute || 0) / 60);
        return list.find(slot => hour >= slot.from && hour < slot.to) || list[list.length - 1];
    }

    function applySchedules() {
        npcs.forEach(npc => {
            const slot = currentSchedule(npc);
            if (!slot) return;
            if (npc.destination !== slot.place) {
                npc.destination = slot.place;
                bus.emit("npc:schedule", { npc, slot });
            }
        });
    }

    function updateHUD() {
        const clock = document.getElementById("clock");
        const day = document.getElementById("day-label");
        const weather = document.getElementById("weather-label");
        if (clock) clock.textContent = `${String(world.hour).padStart(2, "0")}:${String(world.minute || 0).padStart(2, "0")}`;
        if (day) day.textContent = `Día ${world.day}`;
        const type = (window.weatherTypes || []).find(x => x.id === world.weather);
        if (weather && type) weather.textContent = `${type.icon} ${type.name}`;
    }

    // Semilla determinística disponible para futuros sistemas de generación.
    function seededRandom(seed) {
        let value = (seed >>> 0) || 1;
        return function () {
            value = (value * 1664525 + 1013904223) >>> 0;
            return value / 4294967296;
        };
    }

    window.ChanarV20 = {
        version: 20,
        bus,
        save,
        load,
        snapshot,
        applySchedules,
        seededRandom
    };

    // Controles de desarrollo: F5 guardar, F9 cargar.
    window.addEventListener("keydown", event => {
        if (event.key === "F5") {
            event.preventDefault();
            save("keyboard");
        }
        if (event.key === "F9") {
            event.preventDefault();
            load();
        }
    });

    let lastDay = world.day;
    let lastHour = world.hour;

    setInterval(() => {
        applySchedules();
        updateHUD();
        if (world.day !== lastDay || world.hour !== lastHour) {
            bus.emit("time:changed", {
                day: world.day,
                hour: world.hour,
                minute: world.minute
            });
            lastDay = world.day;
            lastHour = world.hour;
        }
    }, 1000);

    setInterval(() => save("autosave"), AUTOSAVE_MS);

    window.addEventListener("beforeunload", () => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot())); } catch (_) {}
    });
})();
