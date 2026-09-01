/* LOS SECRETOS DEL CHAÑAR — WORLD SYSTEM V20.1 */
(function () {
    "use strict";

    function getZoneAt(x, y) {
        const zones = window.CHANAR_WORLD_DATA?.zones || [];
        return zones.find(z => x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) || null;
    }

    function getBuilding(id) {
        return (window.buildings || buildings || []).find(b => b.id === id) || null;
    }

    function getNearestBuilding(x, y, radius = 90) {
        const list = window.buildings || buildings || [];
        let nearest = null;
        let best = radius;
        list.forEach(b => {
            const cx = b.x + b.width / 2;
            const cy = b.y + b.height / 2;
            const d = Math.hypot(cx - x, cy - y);
            if (d < best) { best = d; nearest = b; }
        });
        return nearest;
    }

    window.ChanarWorld = { getZoneAt, getBuilding, getNearestBuilding };
})();
