/* =========================================================
   LOS SECRETOS DEL CHAÑAR
   V0.8
   MAPA + HISTORIA + EXPLORACIÓN
========================================================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const miniCtx = minimap.getContext("2d");

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const WORLD_WIDTH = 5200;
const WORLD_HEIGHT = 3600;

let gameStarted = false;

const keys = {};

const camera = {
    x: 0,
    y: 0,
    smooth: 0.08
};

/* =========================================================
   JUGADOR
========================================================= */

const player = {
    x: 2500,
    y: 1750,

    width: 30,
    height: 30,

    speed: 4.2,

    moving: false,
    frame: 0,

    direction: "down"
};

/* =========================================================
   ESTADO
========================================================= */

const inventory = [];

let reputation = 0;

let worldMinutes = 8 * 60;

const discoveredZones = new Set();

/* =========================================================
   MISIÓN
========================================================= */

const mission = {

    active: false,

    completed: false,

    title: "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía antigua. " +
        "Encontrala y descubrí qué historia guarda."
};

/* =========================================================
   ZONAS
========================================================= */

const zones = [

    {
        id: "centro",

        x: 2050,
        y: 1350,
        width: 1000,
        height: 800,

        name: "Centro de San Patricio del Chañar",

        color: "#78985d"
    },

    {
        id: "chacras",

        x: 500,
        y: 1250,
        width: 1300,
        height: 1500,

        name: "Zona de chacras",

        color: "#8ca56a"
    },

    {
        id: "vinedos",

        x: 3300,
        y: 900,
        width: 1500,
        height: 1100,

        name: "Zona de viñedos",

        color: "#718c56"
    },

    {
        id: "rio",

        x: 0,
        y: 3000,
        width: WORLD_WIDTH,
        height: 250,

        name: "Río Neuquén",

        color: "#4b879b"
    },

    {
        id: "barda",

        x: 0,
        y: 0,
        width: WORLD_WIDTH,
        height: 700,

        name: "Bardas y miradores",

        color: "#8f7b61"
    }

];

/* =========================================================
   EDIFICIOS
========================================================= */

const buildings = [

    {
        x: 2360,
        y: 1450,
        width: 380,
        height: 230,

        name: "MUNICIPALIDAD",

        color: "#9a765b"
    },

    {
        x: 1500,
        y: 1550,
        width: 330,
        height: 210,

        name: "ESCUELA 273",

        color: "#aa7658"
    },

    {
        x: 2850,
        y: 1550,
        width: 390,
        height: 220,

        name: "CENTRO CULTURAL",

        color: "#82705d"
    },

    {
        x: 2550,
        y: 2200,
        width: 390,
        height: 220,

        name: "CLUB ATLÉTICO",

        color: "#7c6656"
    },

    {
        x: 3550,
        y: 1100,
        width: 450,
        height: 230,

        name: "BODEGA",

        color: "#795c4b"
    },

    {
        x: 750,
        y: 1750,
        width: 350,
        height: 200,

        name: "CHACRA",

        color: "#987653"
    },

    {
        x: 4200,
        y: 2500,
        width: 360,
        height: 210,

        name: "RADIO",

        color: "#716458"
    }

];

/* =========================================================
   NPC
========================================================= */

const npcs = [

    {
        id: "pedro",

        x: 2150,
        y: 1900,

        name: "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Si querés conocer el Chañar, " +
            "tenés que aprender a mirar el agua, " +
            "la tierra y las historias de su gente.",

        mission: true
    },

    {
        id: "maria",

        x: 2750,
        y: 2050,

        name: "María",

        text:
            "Las fotografías viejas son como " +
            "pequeñas ventanas. A veces muestran " +
            "lugares que ya no existen."
    },

    {
        id: "julian",

        x: 4300,
        y: 2600,

        name: "Julián",

        text:
            "La radio siempre tuvo una función " +
            "importante: hacer que la gente se entere " +
            "de lo que pasa."
    },

    {
        id: "productor",

        x: 1100,
        y: 2050,

        name: "Don Ernesto",

        text:
            "Acá el agua cambia todo. " +
            "Sin riego, esta tierra sería otra."
    }

];

/* =========================================================
   OBJETOS
========================================================= */

const objects = [

    {
        id: "foto1",

        x: 1900,
        y: 1900,

        type: "photo",

        name: "Fotografía antigua",

        description:
            "Una fotografía que parece mostrar " +
            "una escena antigua del pueblo.",

        collected: false
    },

    {
        id: "documento1",

        x: 1250,
        y: 2600,

        type: "document",

        name: "Documento de riego",

        description:
            "Un documento relacionado con " +
            "la transformación productiva del territorio.",

        collected: false
    },

    {
        id: "foto2",

        x: 3100,
        y: 1300,

        type: "photo",

        name: "Fotografía del pueblo",

        description:
            "Una imagen que parece pertenecer " +
            "a los primeros años del pueblo.",

        collected: false
    },

    {
        id: "documento2",

        x: 2700,
        y: 2600,

        type: "document",

        name: "Documento histórico",

        description:
            "Un documento todavía sin investigar.",

        collected: false
    }

];

/* =========================================================
   ÁRBOLES
========================================================= */

const trees = [];

for (let i = 0; i < 130; i++) {

    let x =
        150 +
        Math.random() *
        (WORLD_WIDTH - 300);

    let y =
        800 +
        Math.random() *
        2100;

    trees.push({
        x,
        y
    });
}

/* =========================================================
   VIÑEDOS
========================================================= */

const vineyards = [

    {
        x: 3450,
        y: 1450,
        rows: 14,
        cols: 24
    },

    {
        x: 700,
        y: 900,
        rows: 12,
        cols: 18
    },

    {
        x: 900,
        y: 2800,
        rows: 10,
        cols: 20
    }

];

/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    e => {

        const key = e.key.toLowerCase();

        keys[key] = true;

        if (
            [
                "w",
                "a",
                "s",
                "d",
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                " "
            ].includes(key)
        ) {

            e.preventDefault();

        }

        if (key === "e") {

            interact();

        }

        if (key === "m") {

            toggleInventory();

        }

    }
);

document.addEventListener(
    "keyup",
    e => {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);

/* =========================================================
   UTILIDADES
========================================================= */

function distance(a, b) {

    const ax =
        a.x + (a.width || 0) / 2;

    const ay =
        a.y + (a.height || 0) / 2;

    const bx =
        b.x + (b.width || 0) / 2;

    const by =
        b.y + (b.height || 0) / 2;

    return Math.hypot(
        ax - bx,
        ay - by
    );

}

function collision(a, b) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}

/* =========================================================
   MOVIMIENTO
========================================================= */

function canMove(x, y) {

    const test = {

        x,
        y,

        width: player.width,
        height: player.height

    };

    for (
        const building of buildings
    ) {

        if (
            collision(
                test,
                building
            )
        ) {

            return false;

        }

    }

    return true;

}

function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -= player.speed;

        player.direction = "up";

    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy += player.speed;

        player.direction = "down";

    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -= player.speed;

        player.direction = "left";

    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx += player.speed;

        player.direction = "right";

    }

    if (dx !== 0 && dy !== 0) {

        dx *= .707;
        dy *= .707;

    }

    player.moving =
        dx !== 0 ||
        dy !== 0;

    if (player.moving) {

        player.frame += .18;

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
                WORLD_WIDTH -
                player.width,
                player.x
            )
        );

    player.y =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT -
                player.height,
                player.y
            )
        );

}

/* =========================================================
   CÁMARA
========================================================= */

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
                WORLD_WIDTH -
                canvas.width,
                camera.x
            )
        );

    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT -
                canvas.height,
                camera.y
            )
        );

}

/* =========================================================
   MUNDO
========================================================= */

function drawWorld() {

    ctx.fillStyle = "#c7aa76";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    /* BARDAS */

    ctx.fillStyle = "#8c775e";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        700
    );

    /* CAMINOS */

    ctx.fillStyle = "#a0845a";

    ctx.fillRect(
        0,
        1750,
        WORLD_WIDTH,
        180
    );

    ctx.fillRect(
        2500,
        0,
        180,
        WORLD_HEIGHT
    );

    ctx.fillRect(
        700,
        900,
        1300,
        130
    );

    /* PLAZA */

    ctx.fillStyle = "#71965c";

    ctx.fillRect(
        2050,
        1350,
        1000,
        800
    );

    /* FUENTE */

    ctx.fillStyle = "#6997a2";

    ctx.beginPath();

    ctx.arc(
        2550,
        1750,
        85,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* RÍO */

    ctx.fillStyle = "#4c899d";

    ctx.fillRect(
        0,
        3000,
        WORLD_WIDTH,
        250
    );

    /* BARRANCA DEL RÍO */

    ctx.fillStyle = "#6f6a51";

    ctx.fillRect(
        0,
        2920,
        WORLD_WIDTH,
        80
    );

    /* MONTAÑAS */

    drawMountains();

    /* VIÑEDOS */

    for (
        const vineyard of vineyards
    ) {

        drawVineyard(
            vineyard
        );

    }

    /* ÁRBOLES */

    for (
        const tree of trees
    ) {

        drawTree(
            tree.x,
            tree.y
        );

    }

}

/* =========================================================
   MONTAÑAS
========================================================= */

function drawMountains() {

    ctx.fillStyle = "#756957";

    ctx.beginPath();

    ctx.moveTo(0, 700);

    ctx.lineTo(450, 220);
    ctx.lineTo(900, 620);

    ctx.lineTo(1400, 170);
    ctx.lineTo(1900, 620);

    ctx.lineTo(2450, 240);
    ctx.lineTo(3000, 620);

    ctx.lineTo(3650, 150);
    ctx.lineTo(4300, 600);

    ctx.lineTo(4800, 220);
    ctx.lineTo(WORLD_WIDTH, 650);

    ctx.lineTo(WORLD_WIDTH, 0);

    ctx.lineTo(0, 0);

    ctx.closePath();

    ctx.fill();

}

/* =========================================================
   ÁRBOLES
========================================================= */

function drawTree(x, y) {

    ctx.fillStyle = "#644631";

    ctx.fillRect(
        x - 7,
        y,
        14,
        40
    );

    ctx.fillStyle = "#45683e";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 5,
        32,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#557b47";

    ctx.beginPath();

    ctx.arc(
        x - 18,
        y + 5,
        23,
        0,
        Math.PI * 2
    );

    ctx.fill();

}

/* =========================================================
   VIÑEDOS
========================================================= */

function drawVineyard(vineyard) {

    for (
        let row = 0;
        row < vineyard.rows;
        row++
    ) {

        for (
            let col = 0;
            col < vineyard.cols;
            col++
        ) {

            const x =
                vineyard.x +
                col * 45;

            const y =
                vineyard.y +
                row * 38;

            ctx.strokeStyle = "#536a3e";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y + 25
            );

            ctx.stroke();

            ctx.fillStyle = "#4e753f";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                10,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}

/* =========================================================
   EDIFICIOS
========================================================= */

function drawBuildings() {

    for (
        const building of buildings
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,.25)";

        ctx.fillRect(
            building.x + 12,
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

        /* techo */

        ctx.fillStyle = "#49372e";

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
            building.width +
            15,
            building.y
        );

        ctx.closePath();

        ctx.fill();

        /* puerta */

        ctx.fillStyle = "#49372e";

        ctx.fillRect(
            building.x +
            building.width / 2 -
            20,

            building.y +
            building.height -
            75,

            40,
            75
        );

        /* ventanas */

        ctx.fillStyle = "#b6d1cc";

        ctx.fillRect(
            building.x + 40,
            building.y + 40,
            55,
            45
        );

        ctx.fillRect(
            building.x +
            building.width -
            95,

            building.y + 40,

            55,
            45
        );

        /* cartel */

        ctx.fillStyle = "#fff";

        ctx.font = "bold 17px Arial";

        ctx.fillText(
            building.name,
            building.x,
            building.y +
            building.height +
            25
        );

    }

}

/* =========================================================
   NPC
========================================================= */

function drawNPC(npc) {

    const near =
        distance(
            player,
            npc
        ) < 110;

    /* cuerpo */

    ctx.fillStyle = "#60435b";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* cabeza */

    ctx.fillStyle = "#ddb08a";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 25,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* nombre */

    ctx.fillStyle = "#fff";

    ctx.font = "14px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 42
    );

    /* misión */

    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle = "#f2c94c";

        ctx.font = "bold 25px Arial";

        ctx.fillText(
            "!",
            npc.x,
            npc.y - 48
        );

    }

    ctx.textAlign = "left";

    return near;

}

/* =========================================================
   OBJETOS
========================================================= */

function drawObjects() {

    for (
        const object of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }

        const pulse =
            Math.sin(
                Date.now() / 250
            ) * 3;

        ctx.font = "27px Arial";

        ctx.fillText(
            object.type === "photo"
                ? "📷"
                : "📜",

            object.x,
            object.y + pulse
        );

        if (
            distance(
                player,
                object
            ) < 100
        ) {

            ctx.fillStyle =
                "rgba(255,220,130,.35)";

            ctx.beginPath();

            ctx.arc(
                object.x + 10,
                object.y - 8,
                27,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}

/* =========================================================
   JUGADOR
========================================================= */

function drawPlayer() {

    const bob =
        player.moving
            ? Math.sin(
                player.frame * 8
            ) * 3
            : 0;

    const x = player.x;
    const y = player.y + bob;

    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.3)";

    ctx.beginPath();

    ctx.ellipse(
        x + 15,
        y + 33,
        22,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* cuerpo */

    ctx.fillStyle = "#263d50";

    ctx.fillRect(
        x,
        y,
        30,
        32
    );

    /* cabeza */

    ctx.fillStyle = "#dfae88";

    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 11,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* pelo */

    ctx.fillStyle = "#30231d";

    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 17,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

}

/* =========================================================
   INTERACCIÓN
========================================================= */

function interact() {

    /* NPC */

    for (
        const npc of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 100
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

                reputation += 1;

                updateHUD();

                setTimeout(
                    showMission,
                    400
                );

            }

            return;

        }

    }

    /* OBJETOS */

    for (
        const object of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }

        if (
            distance(
                player,
                object
            ) < 90
        ) {

            collectObject(
                object
            );

            return;

        }

    }

}

/* =========================================================
   COLECCIONAR
========================================================= */

function collectObject(object) {

    object.collected = true;

    inventory.push({
        name: object.name,
        description: object.description
    });

    reputation += 2;

    updateInventory();

    updateHUD();

    if (
        mission.active &&
        object.type === "photo"
    ) {

        mission.active = false;
        mission.completed = true;

        reputation += 5;

        setMissionHUD();

        setTimeout(
            () => {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "Encontraste la fotografía. " +
                    "Ahora comienza una investigación " +
                    "mucho más grande sobre la memoria " +
                    "del pueblo."
                );

            },
            350
        );

    }

}

/* =========================================================
   DIÁLOGOS
========================================================= */

function showDialogue(
    name,
    text
) {

    document
        .getElementById(
            "dialogue-name"
        )
        .textContent = name;

    document
        .getElementById(
            "dialogue-text"
        )
        .textContent = text;

    document
        .getElementById(
            "dialogue"
        )
        .classList
        .remove("hidden");

}

/* =========================================================
   MISIONES
========================================================= */

function showMission() {

    document
        .getElementById(
            "mission-title"
        )
        .textContent =
        mission.title;

    document
        .getElementById(
            "mission-description"
        )
        .textContent =
        mission.description;

    document
        .getElementById(
            "mission-panel"
        )
        .classList
        .remove("hidden");

}

function setMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );

    if (
        mission.completed
    ) {

        hud.textContent =
            "✓ Investigación iniciada";

        return;

    }

    if (
        mission.active
    ) {

        hud.textContent =
            "Misión: encontrar la fotografía";

        return;

    }

    hud.textContent =
        "Explorá el pueblo";

}

/* =========================================================
   INVENTARIO
========================================================= */

function toggleInventory() {

    document
        .getElementById(
            "inventory-panel"
        )
        .classList
        .toggle("hidden");

}

function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );

    if (
        inventory.length === 0
    ) {

        container.innerHTML =
            "Todavía no encontraste objetos.";

        return;

    }

    container.innerHTML =
        inventory
            .map(
                item => `
                    <div style="
                        padding:12px 0;
                        border-bottom:1px solid #493f34;
                    ">
                        <strong>${item.name}</strong>
                        <br>
                        <small>${item.description}</small>
                    </div>
                `
            )
            .join("");

}

/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    document
        .getElementById(
            "reputation"
        )
        .textContent =
        reputation;

    document
        .getElementById(
            "photo-count"
        )
        .textContent =
        inventory.filter(
            item =>
                item.name.includes(
                    "Fotografía"
                )
        ).length;

    document
        .getElementById(
            "document-count"
        )
        .textContent =
        inventory.filter(
            item =>
                item.name.includes(
                    "Documento"
                )
        ).length;

}

/* =========================================================
   RELOJ
========================================================= */

function updateWorldTime() {

    worldMinutes += .035;

    if (
        worldMinutes >= 1440
    ) {

        worldMinutes = 0;

    }

    const hours =
        Math.floor(
            worldMinutes / 60
        );

    const minutes =
        Math.floor(
            worldMinutes % 60
        );

    document
        .getElementById(
            "clock"
        )
        .textContent =
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0");

}

/* =========================================================
   DESCUBRIMIENTO
========================================================= */

function updateDiscovery() {

    for (
        const zone of zones
    ) {

        const inside =

            player.x >
            zone.x &&

            player.x <
            zone.x + zone.width &&

            player.y >
            zone.y &&

            player.y <
            zone.y + zone.height;

        if (
            inside &&
            !discoveredZones.has(
                zone.id
            )
        ) {

            discoveredZones.add(
                zone.id
            );

            showDiscovery(
                zone.name
            );

        }

    }

}

function showDiscovery(name) {

    const element =
        document.getElementById(
            "discovery"
        );

    element.textContent =
        "NUEVO LUGAR · " +
        name.toUpperCase();

    element.classList.add("show");

    setTimeout(
        () => {

            element.classList.remove(
                "show"
            );

        },
        2500
    );

}

/* =========================================================
   AYUDA DE INTERACCIÓN
========================================================= */

function updateInteractionHint() {

    let near = false;

    for (
        const npc of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 100
        ) {

            near = true;

        }

    }

    for (
        const object of objects
    ) {

        if (
            !object.collected &&
            distance(
                player,
                object
            ) < 90
        ) {

            near = true;

        }

    }

    document
        .getElementById(
            "interaction-hint"
        )
        .classList
        .toggle(
            "hidden",
            !near
        );

}

/* =========================================================
   ILUMINACIÓN
========================================================= */

function drawLighting() {

    const phase =
        Math.sin(
            (
                worldMinutes /
                1440
            ) *
            Math.PI *
            2
            -
            Math.PI / 2
        );

    const darkness =
        Math.max(
            0,
            (
                -phase +
                .25
            )
            *
            .20
        );

    if (
        darkness > 0
    ) {

        ctx.fillStyle =
            `rgba(15,25,55,${darkness})`;

        ctx.fillRect(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT
        );

    }

}

/* =========================================================
   MINIMAPA
========================================================= */

function drawMinimap() {

    const scaleX =
        minimap.width /
        WORLD_WIDTH;

    const scaleY =
        minimap.height /
        WORLD_HEIGHT;

    miniCtx.clearRect(
        0,
        0,
        minimap.width,
        minimap.height
    );

    miniCtx.fillStyle =
        "#c7aa76";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );

    /* río */

    miniCtx.fillStyle =
        "#4c899d";

    miniCtx.fillRect(
        0,
        3000 * scaleY,
        minimap.width,
        250 * scaleY
    );

    /* edificios */

    miniCtx.fillStyle =
        "#674c40";

    for (
        const building of buildings
    ) {

        miniCtx.fillRect(
            building.x * scaleX,
            building.y * scaleY,
            building.width * scaleX,
            building.height * scaleY
        );

    }

    /* jugador */

    miniCtx.fillStyle =
        "#ff3333";

    miniCtx.beginPath();

    miniCtx.arc(
        player.x * scaleX,
        player.y * scaleY,
        4,
        0,
        Math.PI * 2
    );

    miniCtx.fill();

}

/* =========================================================
   BOTONES
========================================================= */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        () => {

            gameStarted = true;

            document
                .getElementById(
                    "start-screen"
                )
                .classList
                .add("hidden");

        }
    );

document
    .getElementById(
        "dialogue-close"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "dialogue"
                )
                .classList
                .add("hidden");

        }
    );

document
    .getElementById(
        "mission-close"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "mission-panel"
                )
                .classList
                .add("hidden");

        }
    );

document
    .getElementById(
        "inventory-close"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "inventory-panel"
                )
                .classList
                .add("hidden");

        }
    );

/* =========================================================
   DIBUJO
========================================================= */

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

    for (
        const npc of npcs
    ) {

        drawNPC(
            npc
        );

    }

    drawPlayer();

    drawLighting();

    ctx.restore();

    drawMinimap();

}

/* =========================================================
   MOTOR
========================================================= */

function gameLoop() {

    if (gameStarted) {

        updatePlayer();

        updateCamera();

        updateWorldTime();

        updateDiscovery();

        updateInteractionHint();

    }

    draw();

    requestAnimationFrame(
        gameLoop
    );

}

/* =========================================================
   INICIALIZACIÓN
========================================================= */

updateInventory();

updateHUD();

setMissionHUD();

gameLoop();
