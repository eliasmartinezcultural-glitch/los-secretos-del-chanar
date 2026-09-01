/* LOS SECRETOS DEL CHAÑAR — COLLISION SYSTEM V20.1 */
(function () {
    "use strict";

    function rectsOverlap(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x &&
               a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function playerRect(x, y) {
        return { x, y, width: player.width, height: player.height };
    }

    function blockedAt(x, y) {
        const r = playerRect(x, y);
        if (x < 0 || y < 0 || x + player.width > WORLD_WIDTH || y + player.height > WORLD_HEIGHT) return true;
        return buildings.some(b => rectsOverlap(r, b));
    }

    function movePlayer(dx, dy) {
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (!blockedAt(nx, player.y)) player.x = nx;
        if (!blockedAt(player.x, ny)) player.y = ny;
    }

    window.ChanarCollision = { rectsOverlap, blockedAt, movePlayer };
})();
