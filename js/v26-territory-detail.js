/* =====================================================
   V26 — IDENTIDAD VISUAL TERRITORIAL
   Elementos de referencia del Alto Valle y San Patricio del Chañar.
   Es una capa visual no destructiva.
===================================================== */
(function () {
    "use strict";

    const T = window.ChanarVisualIdentity = {
        version: "26.0",
        references: [
            "trama urbana en damero",
            "cortinas de álamos",
            "viñedos en hileras",
            "chacras irrigadas",
            "canales de riego y drenaje",
            "caminos rurales",
            "bardas",
            "río Neuquén",
            "RP7"
        ]
    };

    function draw(ctx, camera) {
        if (!ctx || !camera || !window.CHANAR_WORLD_DATA) return;
        // La identidad visual se dibuja sólo en espacios abiertos.
        // Los assets existentes permanecen intactos.
        const zones = window.CHANAR_WORLD_DATA.zones || [];
        zones.forEach(z => {
            if (z.id === "chacras") drawRows(ctx, z, camera, 72, 8);
            if (z.id === "rural") drawRows(ctx, z, camera, 110, 10);
        });
    }

    function drawRows(ctx, zone, camera, spacing, width) {
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let y = zone.y + 35; y < zone.y + zone.height; y += spacing) {
            ctx.moveTo(zone.x - camera.x, y - camera.y);
            ctx.lineTo(zone.x + zone.width - camera.x, y - camera.y);
        }
        ctx.stroke();
        ctx.restore();
    }

    T.draw = draw;
    window.ChanarVisualIdentity = T;
})();
