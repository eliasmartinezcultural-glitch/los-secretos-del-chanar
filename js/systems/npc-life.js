/* LOS SECRETOS DEL CHAÑAR — NPC LIFE V20.2 */
(function () {
    "use strict";

    const ARRIVAL_DISTANCE = 18;
    const WAIT_MS = 3500;
    const memory = new Map();

    function placeById(id) {
        const b = (window.buildings || buildings || []).find(x => x.id === id);
        if (!b) return null;
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }

    function targetFor(npc) {
        const slot = window.ChanarV20?.currentSchedule
            ? window.ChanarV20.currentSchedule(npc)
            : null;
        if (!slot) return null;
        if (typeof slot.x === "number" && typeof slot.y === "number") return slot;
        if (slot.place) return placeById(slot.place);
        return null;
    }

    function updateNpc(npc, dt) {
        const target = targetFor(npc);
        if (!target) return;
        const dx = target.x - npc.x;
        const dy = target.y - npc.y;
        const distance = Math.hypot(dx, dy);
        const state = memory.get(npc.id) || { waitingUntil: 0 };
        if (distance <= ARRIVAL_DISTANCE) {
            if (!state.waitingUntil) state.waitingUntil = performance.now() + WAIT_MS;
            memory.set(npc.id, state);
            npc.vx = 0; npc.vy = 0;
            return;
        }
        state.waitingUntil = 0;
        memory.set(npc.id, state);
        const speed = npc.speed || 45;
        const step = Math.min(distance, speed * dt);
        npc.x += dx / distance * step;
        npc.y += dy / distance * step;
        npc.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    }

    function update(dt) {
        if (!Array.isArray(window.npcs || npcs)) return;
        (window.npcs || npcs).forEach(npc => updateNpc(npc, dt));
    }

    window.ChanarNPCLife = { update, targetFor };
})();
