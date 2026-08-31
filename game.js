/* ============================================================
   LOS SECRETOS DEL CHAÑAR
   VERSION 0.8
   MOTOR MULTIPLATAFORMA
============================================================ */


/* ============================================================
   CANVAS
============================================================ */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const miniCtx = minimap.getContext("2d");


/* ============================================================
   MUNDO
============================================================ */

const WORLD = {
    width: 4200,
    height: 3000
};


/* ============================================================
   ESTADO DEL JUEGO
============================================================ */

let gameStarted = false;
let paused = false;

let worldTime = 0;

let notificationTimer = null;


/* ============================================================
   CANVAS RESPONSIVO
============================================================ */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* ============================================================
   JUGADOR
============================================================ */

const player = {

    x: 2040,
    y: 1460,

    width: 32,
    height: 32,

    speed: 4.5,

    moving: false,

    frame: 0,

    direction: "down",

    level: 1,

    xp: 0,

    coins: 0

};


/* ============================================================
   CÁMARA
============================================================ */

const camera = {

    x: 0,
    y: 0,

    smooth: 0.10

};


/* ============================================================
   TECLADO
============================================================ */

const keys = {};


document.addEventListener("keydown", function(e) {

    const key = e.key.toLowerCase();

    keys[key] = true;


    if (
        key === "e" ||
        key === "enter"
    ) {

        interact();

    }


    if (key === "m") {

        toggleInventory();

    }


    if (key === "escape") {

        togglePause();

    }

});


document.addEventListener("keyup", function(e) {

    keys[e.key.toLowerCase()] = false;

});


/* ============================================================
   EDIFICIOS
============================================================ */

const buildings = [

    {
        x: 450,
        y: 420,
        width: 430,
        height: 240,
        color: "#a96c4d",
        name: "ESCUELA"
    },

    {
        x: 2800,
        y: 390,
        width: 480,
        height: 240,
        color: "#756554",
        name: "RADIO OCARINA"
    },

    {
        x: 430,
        y: 1850,
        width: 370,
        height: 230,
        color: "#9a765c",
        name: "ALMACÉN"
    },

    {
        x: 2920,
        y: 1900,
        width: 390,
        height: 230,
        color: "#96705a",
        name: "CASA"
    },

    {
        x: 1850,
        y: 180,
        width: 430,
        height: 240,
        color: "#826b5a",
        name: "MUSEO"
    },

    {
        x: 1050,
        y: 1900,
        width: 350,
        height: 220,
        color: "#86644e",
        name: "BODEGA"
    },

    {
        x: 3350,
        y: 1050,
        width: 390,
        height: 220,
        color: "#8d6b54",
        name: "VIVIENDA"
    }

];


/* ============================================================
   ÁRBOLES
============================================================ */

const trees = [

    [180,180],
    [700,160],
    [1300,220],
    [2400,150],
    [3200,190],
    [3900,250],

    [180,1100],
    [800,900],
    [1100,1200],
    [2500,850],
    [3500,900],
    [4000,1200],

    [200,2700],
    [800,2500],
    [1500,2700],
    [2300,2600],
    [3200,2700],
    [3900,2500]

];


/* ============================================================
   NPC
============================================================ */

const npcs = [

    {
        x: 1600,
        y: 1400,

        name: "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission: true

    },

    {
        x: 2250,
        y: 1150,

        name: "María",

        text:
            "Las fotografías antiguas " +
            "pueden mostrarnos cómo era " +
            "el Chañar antes de que nosotros " +
            "llegáramos."

    },

    {
        x: 2700,
        y: 1400,

        name: "Julián",

        text:
            "La radio siempre fue una forma " +
            "de unir a la gente del pueblo."

    },

    {
        x: 1200,
        y: 1600,

        name: "Ana",

        text:
            "Mirá bien el paisaje. " +
            "El agua y las chacras son parte " +
            "de la historia de este lugar."

    }

];


/* ============================================================
   OBJETOS
============================================================ */

const objects = [

    {
        x: 1050,
        y: 1350,

        type: "photo",

        name: "Fotografía antigua",

        description:
            "Una fotografía que muestra " +
            "una época pasada del pueblo.",

        collected: false

    },

    {
        x: 2500,
        y: 1750,

        type: "document",

        name: "Documento histórico",

        description:
            "Un documento que podría ayudar " +
            "a reconstruir parte de la historia.",

        collected: false

    },

    {
        x: 2050,
        y: 700,

        type: "photo",

        name: "Fotografía del Chañar",

        description:
            "Una imagen antigua del territorio.",

        collected: false

    },

    {
        x: 3200,
        y: 1400,

        type: "document",

        name: "Viejo documento",

        description:
            "Una hoja deteriorada encontrada " +
            "cerca de una antigua vivienda.",

        collected: false

    },

    {
        x: 1450,
        y: 2250,

        type: "photo",

        name: "Fotografía de las chacras",

        description:
            "Una fotografía relacionada " +
            "con la producción local.",

        collected: false

    }

];


/* ============================================================
   INVENTARIO
============================================================ */

const inventory = [];


/* ============================================================
   MISIÓN
============================================================ */

let mission = {

    active: false,

    completed: false,

    title: "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía " +
        "antigua. Explorá el pueblo y encontrala."

};


/* ============================================================
   DISTANCIA
============================================================ */

function distance(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


/* ============================================================
   COLISIÓN
============================================================ */

function collision(a, b) {

    return (

        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y

    );

}


/* ============================================================
   MOVIMIENTO
============================================================ */

function canMove(x, y) {

    const test = {

        x: x,
        y: y,

        width: player.width,
        height: player.height

    };


    for (const building of buildings) {

        if (collision(test, building)) {

            return false;

        }

    }


    return true;

}


/* ============================================================
   INPUT MOVIMIENTO
============================================================ */

let mobileInput = {

    x: 0,
    y: 0

};


function updatePlayer() {

    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -= 1;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy += 1;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -= 1;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx += 1;

    }


    dx += mobileInput.x;
    dy += mobileInput.y;


    const magnitude =
        Math.hypot(dx, dy);


    if (magnitude > 0) {

        dx /= magnitude;
        dy /= magnitude;

        dx *= player.speed;
        dy *= player.speed;

        player.moving = true;

        player.frame += 0.15;


        if (Math.abs(dx) > Math.abs(dy)) {

            player.direction =
                dx > 0
                    ? "right"
                    : "left";

        } else {

            player.direction =
                dy > 0
                    ? "down"
                    : "up";

        }

    } else {

        player.moving = false;

    }


    if (
        canMove(
            player.x + dx,
            player.y
        )
    ) {

        player.x += dx;

    }


    if (
        canMove(
            player.x,
            player.y + dy
        )
    ) {

        player.y += dy;

    }


    player.x =
        Math.max(
            0,
            Math.min(
                WORLD.width - player.width,
                player.x
            )
        );


    player.y =
        Math.max(
            0,
            Math.min(
                WORLD.height - player.height,
                player.y
            )
        );

}


/* ============================================================
   CÁMARA
============================================================ */

function updateCamera() {

    const targetX =
        player.x -
        canvas.width / 2;

    const targetY =
        player.y -
        canvas.height / 2;


    camera.x +=
        (
            targetX -
            camera.x
        ) *
        camera.smooth;


    camera.y +=
        (
            targetY -
            camera.y
        ) *
        camera.smooth;


    camera.x =
        Math.max(
            0,
            Math.min(
                WORLD.width - canvas.width,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD.height - canvas.height,
                camera.y
            )
        );

}


/* ============================================================
   MUNDO
============================================================ */

function drawWorld() {

    ctx.fillStyle = "#c7a878";

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );


    /* CAMINOS */

    ctx.fillStyle = "#9e8057";

    ctx.fillRect(
        0,
        1250,
        WORLD.width,
        210
    );


    ctx.fillRect(
        2000,
        0,
        210,
        WORLD.height
    );


    /* PLAZA */

    ctx.fillStyle = "#71935d";

    ctx.fillRect(
        1600,
        1050,
        800,
        500
    );


    /* FUENTE */

    ctx.fillStyle = "#719da3";

    ctx.beginPath();

    ctx.arc(
        2000,
        1300,
        75,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* AGUA */

    ctx.fillStyle = "#568b99";

    ctx.fillRect(
        0,
        2450,
        WORLD.width,
        55
    );


    /* MONTAÑAS */

    drawMountains();


    /* ÁRBOLES */

    for (const tree of trees) {

        drawTree(
            tree[0],
            tree[1]
        );

    }


    /* VIÑEDOS */

    drawVineyard(
        450,
        850
    );


    drawVineyard(
        2800,
        800
    );


    drawVineyard(
        1100,
        2300
    );

}


/* ============================================================
   MONTAÑAS
============================================================ */

function drawMountains() {

    ctx.fillStyle = "#88745e";

    ctx.beginPath();

    ctx.moveTo(0, 420);

    ctx.lineTo(450, 100);

    ctx.lineTo(900, 390);

    ctx.lineTo(1400, 80);

    ctx.lineTo(1900, 400);

    ctx.lineTo(2450, 100);

    ctx.lineTo(3000, 420);

    ctx.lineTo(3550, 120);

    ctx.lineTo(WORLD.width, 400);

    ctx.lineTo(WORLD.width, 0);

    ctx.lineTo(0, 0);

    ctx.closePath();

    ctx.fill();

}


/* ============================================================
   ÁRBOL
============================================================ */

function drawTree(x, y) {

    ctx.fillStyle = "#62442e";

    ctx.fillRect(
        x - 8,
        y,
        16,
        45
    );


    ctx.fillStyle = "#3e683c";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        38,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* ============================================================
   VIÑEDO
============================================================ */

function drawVineyard(x, y) {

    for (
        let row = 0;
        row < 9;
        row++
    ) {

        for (
            let col = 0;
            col < 14;
            col++
        ) {

            const px =
                x + col * 35;

            const py =
                y + row * 34;


            ctx.strokeStyle = "#46623c";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                px,
                py
            );

            ctx.lineTo(
                px,
                py + 22
            );

            ctx.stroke();


            ctx.fillStyle = "#527945";

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                9,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}


/* ============================================================
   EDIFICIOS
============================================================ */

function drawBuildings() {

    for (const building of buildings) {

        ctx.fillStyle =
            "rgba(0,0,0,.22)";

        ctx.fillRect(
            building.x + 10,
            building.y + 12,
            building.width,
            building.height
        );


        ctx.fillStyle =
            building.color;

        ctx.fillRect(
            building.x,
            building.y,
            building.width,
            building.height
        );


        /* TECHO */

        ctx.fillStyle = "#48352d";

        ctx.beginPath();

        ctx.moveTo(
            building.x - 15,
            building.y
        );

        ctx.lineTo(
            building.x +
            building.width / 2,
            building.y - 65
        );

        ctx.lineTo(
            building.x +
            building.width + 15,
            building.y
        );

        ctx.closePath();

        ctx.fill();


        /* PUERTA */

        ctx.fillStyle = "#3f3029";

        ctx.fillRect(
            building.x +
            building.width / 2 - 22,

            building.y +
            building.height - 75,

            44,
            75
        );


        /* VENTANAS */

        ctx.fillStyle = "#bad0c8";

        ctx.fillRect(
            building.x + 40,
            building.y + 45,
            48,
            48
        );


        ctx.fillRect(
            building.x +
            building.width - 88,

            building.y + 45,

            48,
            48
        );


        /* NOMBRE */

        ctx.fillStyle = "#fff";

        ctx.font = "bold 18px Arial";

        ctx.fillText(
            building.name,
            building.x,
            building.y +
            building.height +
            27
        );

    }

}


/* ============================================================
   NPC
============================================================ */

function drawNPC(npc) {

    const near =
        distance(player, npc) < 90;


    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 17,
        20,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CUERPO */

    ctx.fillStyle = "#654261";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CABEZA */

    ctx.fillStyle = "#e0ad87";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 24,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* NOMBRE */

    ctx.fillStyle = "#fff";

    ctx.font = "14px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 42
    );

    ctx.textAlign = "left";


    /* INDICADOR */

    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle = "#f3c84b";

        ctx.font = "bold 25px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "!",
            npc.x,
            npc.y - 48
        );

        ctx.textAlign = "left";

    }


    if (near) {

        ctx.strokeStyle =
            "rgba(255,255,255,.6)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            npc.x,
            npc.y,
            30,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

}


/* ============================================================
   OBJETOS
============================================================ */

function drawObjects() {

    for (const object of objects) {

        if (object.collected) {

            continue;

        }


        const near =
            distance(player, object) < 75;


        ctx.font = "28px Arial";


        ctx.fillText(
            object.type === "photo"
                ? "📷"
                : "📜",

            object.x,
            object.y
        );


        if (near) {

            ctx.fillStyle = "#fff";

            ctx.font = "12px Arial";

            ctx.fillText(
                "E",
                object.x + 25,
                object.y - 10
            );

        }

    }

}


/* ============================================================
   JUGADOR
============================================================ */

function drawPlayer() {

    const bob =
        player.moving
            ? Math.sin(
                player.frame * 8
            ) * 3
            : 0;


    const x = player.x;
    const y = player.y + bob;


    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        x + 16,
        y + 34,
        23,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CUERPO */

    ctx.fillStyle = "#273d4e";

    ctx.fillRect(
        x,
        y,
        32,
        32
    );


    /* CABEZA */

    ctx.fillStyle = "#e0ad87";

    ctx.beginPath();

    ctx.arc(
        x + 16,
        y - 11,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* PELO */

    ctx.fillStyle = "#30231e";

    ctx.beginPath();

    ctx.arc(
        x + 16,
        y - 17,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* INDICADOR */

    if (!player.moving) {

        ctx.strokeStyle =
            "rgba(255,255,255,.35)";

        ctx.beginPath();

        ctx.arc(
            x + 16,
            y + 10,
            27,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

}


/* ============================================================
   INTERACCIÓN
============================================================ */

function interact() {

    if (!gameStarted || paused) {

        return;

    }


    /* NPC */

    for (const npc of npcs) {

        if (
            distance(
                player,
                npc
            ) < 95
        ) {

            showDialogue(
                npc.name,
                npc.text
            );


            if (
                npc.mission &&
                !mission.active &&
                !mission.completed
            ) {

                mission.active = true;

                setMissionHUD();

                setTimeout(
                    showMission,
                    250
                );

            }


            return;

        }

    }


    /* OBJETOS */

    for (const object of objects) {

        if (object.collected) {

            continue;

        }


        if (
            distance(
                player,
                object
            ) < 80
        ) {

            collectObject(object);

            return;

        }

    }

}


/* ============================================================
   COLECCIONAR
============================================================ */

function collectObject(object) {

    object.collected = true;

    inventory.push(object);


    player.coins += 10;

    addXP(25);


    updateInventory();

    updateResources();


    showNotification(
        "Encontraste: " +
        object.name
    );


    if (
        mission.active &&
        object.type === "photo"
    ) {

        mission.completed = true;

        mission.active = false;

        setMissionHUD();


        setTimeout(
            function() {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "Encontraste una fotografía " +
                    "que puede ayudarnos a reconstruir " +
                    "la memoria del pueblo."
                );

            },
            500
        );

    }

}


/* ============================================================
   EXPERIENCIA
============================================================ */

function addXP(amount) {

    player.xp += amount;


    const required =
        player.level * 100;


    if (
        player.xp >= required
    ) {

        player.xp -= required;

        player.level++;

        showNotification(
            "¡Subiste al nivel " +
            player.level +
            "!"
        );

    }


    updateXP();

}


/* ============================================================
   HUD XP
============================================================ */

function updateXP() {

    document.getElementById(
        "level"
    ).textContent =
        player.level;


    const required =
        player.level * 100;


    const percent =
        Math.min(
            100,
            (player.xp / required) * 100
        );


    document.getElementById(
        "xp-fill"
    ).style.width =
        percent + "%";

}


/* ============================================================
   RECURSOS
============================================================ */

function updateResources() {

    document.getElementById(
        "coins"
    ).textContent =
        player.coins;


    document.getElementById(
        "photo-count"
    ).textContent =

        inventory.filter(
            item =>
                item.type === "photo"
        ).length;


    document.getElementById(
        "document-count"
    ).textContent =

        inventory.filter(
            item =>
                item.type === "document"
        ).length;

}


/* ============================================================
   DIÁLOGOS
============================================================ */

function showDialogue(name, text) {

    document.getElementById(
        "dialogue-name"
    ).textContent = name;


    document.getElementById(
        "dialogue-text"
    ).textContent = text;


    document.getElementById(
        "dialogue"
    ).classList.remove(
        "hidden"
    );

}


/* ============================================================
   MISIÓN
============================================================ */

function showMission() {

    document.getElementById(
        "mission-title"
    ).textContent =
        mission.title;


    document.getElementById(
        "mission-description"
    ).textContent =
        mission.description;


    document.getElementById(
        "mission-panel"
    ).classList.remove(
        "hidden"
    );

}


function setMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );


    if (mission.completed) {

        hud.textContent =
            "✓ Misión completada";

        return;

    }


    if (mission.active) {

        hud.textContent =
            "Encontrá la fotografía";

        return;

    }


    hud.textContent =
        "Explorá el pueblo";

}


/* ============================================================
   INVENTARIO
============================================================ */

function toggleInventory() {

    if (!gameStarted) {

        return;

    }


    document.getElementById(
        "inventory-panel"
    ).classList.toggle(
        "hidden"
    );

}


function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );


    if (inventory.length === 0) {

        container.innerHTML =
            "Inventario vacío.";

        return;

    }


    container.innerHTML =
        inventory
            .map(
                item =>
                    `<div>
                        ${
                            item.type === "photo"
                                ? "📷"
                                : "📜"
                        }
                        ${item.name}
                    </div>`
            )
            .join("");

}


/* ============================================================
   NOTIFICACIONES
============================================================ */

function showNotification(text) {

    const notification =
        document.getElementById(
            "notification"
        );


    document.getElementById(
        "notification-text"
    ).textContent =
        text;


    notification.classList.add(
        "visible"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            function() {

                notification.classList.remove(
                    "visible"
                );

            },
            2500
        );

}


/* ============================================================
   PAUSA
============================================================ */

function togglePause() {

    if (!gameStarted) {

        return;

    }


    paused = !paused;


    document.getElementById(
        "pause-panel"
    ).classList.toggle(
        "hidden",
        !paused
    );

}


/* ============================================================
   GUARDAR
============================================================ */

function saveGame() {

    const data = {

        player: {
            x: player.x,
            y: player.y,
            level: player.level,
            xp: player.xp,
            coins: player.coins
        },

        mission: mission,

        objects:
            objects.map(
                object => ({
                    collected:
                        object.collected
                })
            ),

        inventory:
            inventory.map(
                item => item.name
            )

    };


    localStorage.setItem(
        "chanar-save",
        JSON.stringify(data)
    );


    showNotification(
        "Partida guardada"
    );

}


/* ============================================================
   CARGAR
============================================================ */

function loadGame() {

    const saved =
        localStorage.getItem(
            "chanar-save"
        );


    if (!saved) {

        showNotification(
            "No hay una partida guardada"
        );

        return;

    }


    const data =
        JSON.parse(saved);


    player.x =
        data.player.x;

    player.y =
        data.player.y;

    player.level =
        data.player.level;

    player.xp =
        data.player.xp;

    player.coins =
        data.player.coins;


    mission =
        data.mission;


    data.objects.forEach(
        (savedObject, index) => {

            if (objects[index]) {

                objects[index].collected =
                    savedObject.collected;

            }

        }
    );


    inventory.length = 0;


    data.inventory.forEach(
        name => {

            const object =
                objects.find(
                    item =>
                        item.name === name
                );


            if (object) {

                inventory.push(object);

            }

        }
    );


    updateInventory();

    updateResources();

    updateXP();

    setMissionHUD();


    gameStarted = true;

    document.getElementById(
        "start-screen"
    ).classList.add(
        "hidden"
    );


    showNotification(
        "Partida cargada"
    );

}


/* ============================================================
   REINICIAR
============================================================ */

function restartGame() {

    localStorage.removeItem(
        "chanar-save"
    );

    location.reload();

}


/* ============================================================
   MINIMAPA
============================================================ */

function drawMinimap() {

    miniCtx.clearRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    const scaleX =
        minimap.width /
        WORLD.width;

    const scaleY =
        minimap.height /
        WORLD.height;


    miniCtx.fillStyle =
        "#c7a878";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* agua */

    miniCtx.fillStyle =
        "#568b99";

    miniCtx.fillRect(
        0,
        2450 * scaleY,
        minimap.width,
        55 * scaleY
    );


    /* edificios */

    miniCtx.fillStyle =
        "#684f43";


    for (const building of buildings) {

        miniCtx.fillRect(

            building.x * scaleX,

            building.y * scaleY,

            building.width * scaleX,

            building.height * scaleY

        );

    }


    /* NPC */

    miniCtx.fillStyle =
        "#e5bd4f";


    for (const npc of npcs) {

        miniCtx.fillRect(

            npc.x * scaleX - 2,

            npc.y * scaleY - 2,

            4,
            4

        );

    }


    /* jugador */

    miniCtx.fillStyle =
        "#ff3333";


    miniCtx.beginPath();

    miniCtx.arc(

        player.x * scaleX,

        player.y * scaleY,

        5,

        0,

        Math.PI * 2

    );

    miniCtx.fill();

}


/* ============================================================
   DÍA / NOCHE
============================================================ */

function drawLighting() {

    worldTime += 0.0005;


    const darkness =
        (
            Math.sin(worldTime)
            + 1
        ) / 2;


    ctx.fillStyle =
        `rgba(20,30,70,${darkness * 0.16})`;


    ctx.fillRect(
        camera.x,
        camera.y,
        canvas.width,
        canvas.height
    );

}


/* ============================================================
   INDICADOR DE INTERACCIÓN
============================================================ */

function updateInteractionHint() {

    let near = false;


    for (const npc of npcs) {

        if (
            distance(player, npc) < 95
        ) {

            near = true;

        }

    }


    for (const object of objects) {

        if (
            !object.collected &&
            distance(player, object) < 80
        ) {

            near = true;

        }

    }


    document.getElementById(
        "interaction-hint"
    ).classList.toggle(
        "hidden",
        !near
    );

}


/* ============================================================
   DIBUJAR
============================================================ */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.save();


    ctx.translate(
        -camera.x,
        -camera.y
    );


    drawWorld();

    drawBuildings();

    drawObjects();


    for (const npc of npcs) {

        drawNPC(npc);

    }


    drawPlayer();

    drawLighting();


    ctx.restore();


    drawMinimap();

}


/* ============================================================
   JOYSTICK
============================================================ */

const joystick =
    document.getElementById(
        "joystick"
    );

const joystickStick =
    document.getElementById(
        "joystick-stick"
    );


let joystickActive = false;


function updateJoystick(clientX, clientY) {

    const rect =
        joystick.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    let dx =
        clientX - centerX;

    let dy =
        clientY - centerY;


    const max =
        rect.width / 2 - 27;


    const distanceValue =
        Math.hypot(dx, dy);


    if (
        distanceValue > max
    ) {

        dx =
            dx /
            distanceValue *
            max;

        dy =
            dy /
            distanceValue *
            max;

    }


    joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;


    mobileInput.x =
        dx / max;

    mobileInput.y =
        dy / max;

}


function resetJoystick() {

    joystickActive = false;

    mobileInput.x = 0;
    mobileInput.y = 0;

    joystickStick.style.transform =
        "translate(0,0)";

}


joystick.addEventListener(
    "pointerdown",
    function(e) {

        joystickActive = true;

        joystick.setPointerCapture(
            e.pointerId
        );

        updateJoystick(
            e.clientX,
            e.clientY
        );

    }
);


joystick.addEventListener(
    "pointermove",
    function(e) {

        if (!joystickActive) {

            return;

        }

        updateJoystick(
            e.clientX,
            e.clientY
        );

    }
);


joystick.addEventListener(
    "pointerup",
    resetJoystick
);


joystick.addEventListener(
    "pointercancel",
    resetJoystick
);


/* ============================================================
   BOTONES
============================================================ */

document.getElementById(
    "start-button"
).addEventListener(
    "click",
    function() {

        gameStarted = true;

        paused = false;

        document.getElementById(
            "start-screen"
        ).classList.add(
            "hidden"
        );

        showNotification(
            "Bienvenido a Los Secretos del Chañar"
        );

    }
);


document.getElementById(
    "load-button"
).addEventListener(
    "click",
    loadGame
);


document.getElementById(
    "dialogue-close"
).addEventListener(
    "click",
    function() {

        document.getElementById(
            "dialogue"
        ).classList.add(
            "hidden"
        );

    }
);


document.getElementById(
    "mission-close"
).addEventListener(
    "click",
    function() {

        document.getElementById(
            "mission-panel"
        ).classList.add(
            "hidden"
        );

    }
);


document.getElementById(
    "inventory-button"
).addEventListener(
    "click",
    toggleInventory
);


document.getElementById(
    "mobile-inventory"
).addEventListener(
    "click",
    toggleInventory
);


document.getElementById(
    "inventory-close"
).addEventListener(
    "click",
    function() {

        document.getElementById(
            "inventory-panel"
        ).classList.add(
            "hidden"
        );

    }
);


document.getElementById(
    "pause-button"
).addEventListener(
    "click",
    togglePause
);


document.getElementById(
    "resume-button"
).addEventListener(
    "click",
    togglePause
);


document.getElementById(
    "save-button"
).addEventListener(
    "click",
    saveGame
);


document.getElementById(
    "restart-button"
).addEventListener(
    "click",
    restartGame
);


document.getElementById(
    "mobile-interact"
).addEventListener(
    "click",
    interact
);


/* ============================================================
   MOTOR
============================================================ */

function gameLoop() {

    if (
        gameStarted &&
        !paused
    ) {

        updatePlayer();

        updateCamera();

        updateInteractionHint();

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* ============================================================
   INICIALIZACIÓN
============================================================ */

updateInventory();

updateResources();

updateXP();

setMissionHUD();

gameLoop();
