/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   GAME ENGINE V5.0
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const miniCtx = minimap.getContext("2d");

const bigMap = document.getElementById("big-map");
const bigMapCtx = bigMap.getContext("2d");


/* =====================================================
   MUNDO
===================================================== */

const WORLD = {
    width: 5200,
    height: 3600
};


/* =====================================================
   CANVAS
===================================================== */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =====================================================
   ESTADO
===================================================== */

let gameStarted = false;

let worldTime = 0;

let notificationTimer = null;


/* =====================================================
   TECLADO
===================================================== */

const keys = {};

document.addEventListener("keydown", event => {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key === "e" &&
        !event.repeat
    ) {
        interact();
    }

    if (
        key === "m" &&
        !event.repeat
    ) {
        toggleMap();
    }

    if (
        key === "i" &&
        !event.repeat
    ) {
        toggleInventory();
    }

});


document.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2600,

    y: 1800,

    width: 32,

    height: 42,

    speed: 4.5,

    moving: false,

    frame: 0,

    direction: "down",

    level: 1,

    xp: 0,

    discovered: []

};


/* =====================================================
   CAMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth: 0.10

};


/* =====================================================
   JOYSTICK
===================================================== */

const joystick = {

    active: false,

    x: 0,

    y: 0

};


/* =====================================================
   ZONAS TERRITORIALES
===================================================== */

const zones = [

    {
        id: "centro",
        name: "Centro de San Patricio del Chañar",
        x: 1900,
        y: 1200,
        width: 1400,
        height: 1100
    },

    {
        id: "rural-norte",
        name: "Sector rural norte",
        x: 300,
        y: 250,
        width: 1600,
        height: 850
    },

    {
        id: "rural-sur",
        name: "Sector rural sur",
        x: 300,
        y: 2450,
        width: 1700,
        height: 800
    },

    {
        id: "viñedos",
        name: "Zona de viñedos",
        x: 3350,
        y: 400,
        width: 1500,
        height: 1200
    },

    {
        id: "canal",
        name: "Sector del canal",
        x: 300,
        y: 3150,
        width: 4500,
        height: 300
    },

    {
        id: "este",
        name: "Sector este",
        x: 3500,
        y: 1750,
        width: 1300,
        height: 1100
    }

];


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        id: "plaza",
        name: "Plaza central",
        x: 2380,
        y: 1500,
        width: 620,
        height: 400,
        type: "public"
    },

    {
        id: "municipio",
        name: "Municipalidad",
        x: 2080,
        y: 1150,
        width: 420,
        height: 230,
        type: "public"
    },

    {
        id: "escuela",
        name: "Escuela",
        x: 1050,
        y: 1350,
        width: 420,
        height: 230,
        type: "school"
    },

    {
        id: "radio",
        name: "Radio",
        x: 3300,
        y: 1450,
        width: 430,
        height: 240,
        type: "radio"
    },

    {
        id: "almacen",
        name: "Almacén",
        x: 1450,
        y: 2150,
        width: 350,
        height: 220,
        type: "shop"
    },

    {
        id: "museo",
        name: "Casa de la memoria",
        x: 2850,
        y: 850,
        width: 440,
        height: 230,
        type: "museum"
    },

    {
        id: "bodega",
        name: "Bodega",
        x: 4000,
        y: 700,
        width: 470,
        height: 260,
        type: "vineyard"
    }

];


/* =====================================================
   ARBOLES
===================================================== */

const trees = [];

function generateTrees() {

    const positions = [

        [300,300],
        [700,500],
        [1200,350],
        [1700,450],

        [500,2400],
        [900,2700],
        [1400,2500],
        [1800,2900],

        [3650,350],
        [4200,300],
        [4650,600],

        [3900,1900],
        [4500,2200],
        [4700,2700],

        [700,3200],
        [1200,3300],
        [1800,3200],
        [2500,3300],
        [3300,3300],
        [4100,3300]

    ];

    positions.forEach(pos => {

        trees.push({
            x: pos[0],
            y: pos[1]
        });

    });

}

generateTrees();


/* =====================================================
   VIÑEDOS
===================================================== */

const vineyards = [

    {
        x: 3450,
        y: 400,
        rows: 13,
        cols: 25
    },

    {
        x: 3500,
        y: 1100,
        rows: 8,
        cols: 20
    }

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        id: "pedro",

        x: 2200,
        y: 2050,

        name: "Don Pedro",

        avatar: "👴",

        text:
            "Este pueblo tiene memoria. " +
            "Algunas historias están en los " +
            "papeles. Otras viven en la gente.",

        mission: "fotografia"
    },

    {
        id: "maria",

        x: 2700,
        y: 1300,

        name: "María",

        avatar: "👩",

        text:
            "Si querés conocer un lugar de verdad, " +
            "mirá cómo vive su gente."
    },

    {
        id: "julian",

        x: 3150,
        y: 2000,

        name: "Julián",

        avatar: "🧑",

        text:
            "La radio guarda voces que muchas veces " +
            "no aparecen en los libros."
    },

    {
        id: "ana",

        x: 3050,
        y: 1000,

        name: "Ana",

        avatar: "👩‍🌾",

        text:
            "La tierra, el agua y las cosechas " +
            "explican buena parte de nuestra historia."
    }

];


/* =====================================================
   OBJETOS
===================================================== */

const objects = [

    {
        id: "foto1",
        x: 1600,
        y: 1950,
        type: "photo",
        name: "Fotografía antigua",
        description:
            "Una fotografía que conserva una imagen del pasado.",
        collected: false
    },

    {
        id: "documento1",
        x: 1800,
        y: 2500,
        type: "document",
        name: "Documento histórico",
        description:
            "Un documento que puede aportar una nueva pista.",
        collected: false
    },

    {
        id: "foto2",
        x: 3000,
        y: 750,
        type: "photo",
        name: "Fotografía del territorio",
        description:
            "Una imagen relacionada con el paisaje local.",
        collected: false
    },

    {
        id: "foto3",
        x: 4250,
        y: 1150,
        type: "photo",
        name: "Fotografía de los viñedos",
        description:
            "Una imagen vinculada a la producción de la zona.",
        collected: false
    },

    {
        id: "documento2",
        x: 3900,
        y: 2200,
        type: "document",
        name: "Registro de la comunidad",
        description:
            "Un registro que contiene información sobre habitantes.",
        collected: false
    }

];


/* =====================================================
   INVENTARIO
===================================================== */

let inventory = [];


/* =====================================================
   MISIONES
===================================================== */

const missions = {

    fotografia: {

        id: "fotografia",

        title: "La fotografía perdida",

        description:
            "Don Pedro perdió una fotografía antigua. " +
            "Encontrala y llevásela.",

        active: false,

        completed: false,

        target: "foto1",

        reward: 100

    },

    documento: {

        id: "documento",

        title: "Una pista en el archivo",

        description:
            "Encontraste una fotografía. " +
            "Ahora buscá el documento que puede explicar su historia.",

        active: false,

        completed: false,

        target: "documento1",

        reward: 150

    }

};


/* =====================================================
   MISION ACTUAL
===================================================== */

let currentMission = null;


/* =====================================================
   DISTANCIA
===================================================== */

function distance(a, b) {

    const ax = a.x + (a.width || 0) / 2;
    const ay = a.y + (a.height || 0) / 2;

    const bx = b.x + (b.width || 0) / 2;
    const by = b.y + (b.height || 0) / 2;

    return Math.hypot(ax - bx, ay - by);

}


/* =====================================================
   COLISION
===================================================== */

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


/* =====================================================
   MOVIMIENTO
===================================================== */

function canMove(x, y) {

    const test = {

        x,
        y,

        width: player.width,
        height: player.height

    };

    for (const building of buildings) {

        if (collision(test, building)) {

            return false;

        }

    }

    return (

        x >= 0 &&
        y >= 0 &&
        x + player.width <= WORLD.width &&
        y + player.height <= WORLD.height

    );

}


function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy--;

    if (keys["s"] || keys["arrowdown"]) dy++;

    if (keys["a"] || keys["arrowleft"]) dx--;

    if (keys["d"] || keys["arrowright"]) dx++;

    dx += joystick.x;
    dy += joystick.y;

    const length = Math.hypot(dx, dy);

    if (length > 0) {

        dx /= Math.max(1, length);
        dy /= Math.max(1, length);

        dx *= player.speed;
        dy *= player.speed;

        player.moving = true;

        player.frame += .15;

        if (Math.abs(dx) > Math.abs(dy)) {

            player.direction =
                dx > 0 ? "right" : "left";

        } else {

            player.direction =
                dy > 0 ? "down" : "up";

        }

    } else {

        player.moving = false;

    }

    if (canMove(player.x + dx, player.y)) {

        player.x += dx;

    }

    if (canMove(player.x, player.y + dy)) {

        player.y += dy;

    }

}


/* =====================================================
   CAMARA
===================================================== */

function updateCamera() {

    const targetX =
        player.x -
        canvas.width / 2 +
        player.width / 2;

    const targetY =
        player.y -
        canvas.height / 2 +
        player.height / 2;

    camera.x +=
        (targetX - camera.x) *
        camera.smooth;

    camera.y +=
        (targetY - camera.y) *
        camera.smooth;

    camera.x = Math.max(
        0,
        Math.min(
            WORLD.width - canvas.width,
            camera.x
        )
    );

    camera.y = Math.max(
        0,
        Math.min(
            WORLD.height - canvas.height,
            camera.y
        )
    );

}


/* =====================================================
   ZONA ACTUAL
===================================================== */

function updateZone() {

    let found = "Territorio de San Patricio del Chañar";

    for (const zone of zones) {

        if (

            player.x >= zone.x &&
            player.x <= zone.x + zone.width &&
            player.y >= zone.y &&
            player.y <= zone.y + zone.height

        ) {

            found = zone.name;

            discoverLocation(zone.id, zone.name);

            break;

        }

    }

    document
        .getElementById("location-name")
        .textContent = found;

}


/* =====================================================
   DESCUBRIMIENTO
===================================================== */

function discoverLocation(id, name) {

    if (player.discovered.includes(id)) return;

    player.discovered.push(id);

    addXP(20);

    notify(
        "📍 Lugar descubierto: " + name
    );

    updateInventoryUI();

}


/* =====================================================
   EXPERIENCIA
===================================================== */

function addXP(amount) {

    player.xp += amount;

    while (player.xp >= player.level * 100) {

        player.xp -= player.level * 100;

        player.level++;

        notify(
            "⭐ ¡Subiste al nivel " +
            player.level + "!"
        );

    }

    updateXP();

    saveGame();

}


function updateXP() {

    const required =
        player.level * 100;

    const percent =
        Math.min(
            100,
            (player.xp / required) * 100
        );

    document
        .getElementById("xp-fill")
        .style.width =
        percent + "%";

    document
        .getElementById("xp-text")
        .textContent =
        player.xp +
        " / " +
        required +
        " XP";

    document
        .getElementById("level-value")
        .textContent =
        player.level;

}


/* =====================================================
   INTERACCION
===================================================== */

function interact() {

    if (!gameStarted) return;

    if (
        tryNPCInteraction()
    ) return;

    if (
        tryObjectInteraction()
    ) return;

    if (
        tryBuildingInteraction()
    ) return;

    notify("No hay nada con lo que interactuar.");

}


/* =====================================================
   NPC
===================================================== */

function tryNPCInteraction() {

    for (const npc of npcs) {

        if (
            distance(player, npc) < 100
        ) {

            showDialogue(
                npc.name,
                npc.text,
                npc.avatar
            );

            if (npc.mission) {

                activateMission(
                    npc.mission
                );

            }

            return true;

        }

    }

    return false;

}


/* =====================================================
   OBJETOS
===================================================== */

function tryObjectInteraction() {

    for (const object of objects) {

        if (object.collected) continue;

        if (
            distance(player, object) < 85
        ) {

            collectObject(object);

            return true;

        }

    }

    return false;

}


/* =====================================================
   EDIFICIOS
===================================================== */

function tryBuildingInteraction() {

    for (const building of buildings) {

        const center = {

            x:
                building.x +
                building.width / 2,

            y:
                building.y +
                building.height / 2

        };

        if (
            distance(player, center) < 150
        ) {

            showDialogue(
                building.name,
                getBuildingText(building)
            );

            return true;

        }

    }

    return false;

}


function getBuildingText(building) {

    const texts = {

        plaza:
            "La plaza es uno de los espacios donde " +
            "la comunidad se encuentra.",

        municipio:
            "Un espacio asociado a la vida institucional " +
            "del pueblo.",

        escuela:
            "La escuela conserva parte importante " +
            "de la memoria de varias generaciones.",

        radio:
            "Un lugar donde las voces del pueblo " +
            "pueden transformarse en memoria.",

        almacen:
            "Los comercios también forman parte " +
            "de la historia cotidiana.",

        museo:
            "Un espacio dedicado a conservar recuerdos " +
            "y documentos.",

        bodega:
            "La producción vitivinícola es parte " +
            "del paisaje productivo de la zona."

    };

    return texts[building.id] ||
        "Un lugar del territorio.";

}


/* =====================================================
   COLECCIONAR
===================================================== */

function collectObject(object) {

    object.collected = true;

    inventory.push({
        id: object.id,
        name: object.name,
        type: object.type,
        description: object.description
    });

    addXP(30);

    notify(
        "📦 Encontraste: " +
        object.name
    );

    checkMission(object);

    updateInventoryUI();

    saveGame();

}


/* =====================================================
   MISION
===================================================== */

function activateMission(id) {

    const mission = missions[id];

    if (!mission) return;

    if (mission.completed) return;

    if (!mission.active) {

        mission.active = true;

        currentMission = mission;

        setMissionHUD();

        setTimeout(() => {

            showMission(
                mission
            );

        }, 250);

    }

}


function checkMission(object) {

    for (
        const missionKey in missions
    ) {

        const mission =
            missions[missionKey];

        if (
            mission.active &&
            mission.target === object.id
        ) {

            mission.active = false;
            mission.completed = true;

            addXP(
                mission.reward
            );

            notify(
                "🏆 Misión completada"
            );

            if (
                mission.id === "fotografia"
            ) {

                activateMission("documento");

            }

            currentMission = null;

            setMissionHUD();

        }

    }

}


function setMissionHUD() {

    const element =
        document.getElementById(
            "mission-text"
        );

    if (!currentMission) {

        element.textContent =
            "Explorá el territorio";

        return;

    }

    element.textContent =
        currentMission.title;

}


/* =====================================================
   DIALOGO
===================================================== */

function showDialogue(
    name,
    text,
    avatar = "👤"
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
            "dialogue-avatar"
        )
        .textContent = avatar;

    document
        .getElementById(
            "dialogue"
        )
        .classList
        .remove("hidden");

}


document
    .getElementById("dialogue-close")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("dialogue")
                .classList
                .add("hidden");

        }
    );


/* =====================================================
   MISION PANEL
===================================================== */

function showMission(mission) {

    document
        .getElementById("mission-title")
        .textContent =
        mission.title;

    document
        .getElementById("mission-description")
        .textContent =
        mission.description;

    document
        .getElementById("mission-panel")
        .classList
        .remove("hidden");

}


document
    .getElementById("mission-close")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("mission-panel")
                .classList
                .add("hidden");

        }
    );


/* =====================================================
   INVENTARIO
===================================================== */

function toggleInventory() {

    document
        .getElementById("inventory-panel")
        .classList
        .toggle("hidden");

}


document
    .getElementById("inventory-button")
    .addEventListener(
        "click",
        toggleInventory
    );


document
    .getElementById("inventory-close")
    .addEventListener(
        "click",
        toggleInventory
    );


function updateInventoryUI() {

    const container =
        document.getElementById(
            "inventory-items"
        );

    if (inventory.length === 0) {

        container.textContent =
            "Inventario vacío.";

    } else {

        container.innerHTML =
            inventory
                .map(item =>
                    "• <strong>" +
                    item.name +
                    "</strong><br>" +
                    "<small>" +
                    item.description +
                    "</small>"
                )
                .join("<hr>");

    }

    document
        .getElementById("photo-count")
        .textContent =
        inventory.filter(
            item =>
                item.type === "photo"
        ).length;

    document
        .getElementById("document-count")
        .textContent =
        inventory.filter(
            item =>
                item.type === "document"
        ).length;

    document
        .getElementById("location-count")
        .textContent =
        player.discovered.length;

}


/* =====================================================
   MAPA
===================================================== */

function toggleMap() {

    document
        .getElementById("map-panel")
        .classList
        .toggle("hidden");

    drawBigMap();

}


document
    .getElementById("mobile-map")
    .addEventListener(
        "click",
        toggleMap
    );


document
    .getElementById("map-close")
    .addEventListener(
        "click",
        toggleMap
    );


/* =====================================================
   GUARDADO
===================================================== */

function saveGame() {

    const save = {

        player: {

            x: player.x,
            y: player.y,

            level: player.level,
            xp: player.xp,

            discovered:
                player.discovered

        },

        inventory,

        objects:
            objects.map(object => ({
                id: object.id,
                collected: object.collected
            })),

        missions:
            Object.fromEntries(
                Object.entries(missions)
                    .map(([key, mission]) => [
                        key,
                        {
                            active:
                                mission.active,
                            completed:
                                mission.completed
                        }
                    ])
            )

    };

    localStorage.setItem(
        "chanar-v5-save",
        JSON.stringify(save)
    );

}


function loadGame() {

    const raw =
        localStorage.getItem(
            "chanar-v5-save"
        );

    if (!raw) return false;

    try {

        const save =
            JSON.parse(raw);

        player.x =
            save.player.x;

        player.y =
            save.player.y;

        player.level =
            save.player.level;

        player.xp =
            save.player.xp;

        player.discovered =
            save.player.discovered || [];

        inventory.length = 0;

        if (save.inventory) {

            inventory.push(
                ...save.inventory
            );

        }

        if (save.objects) {

            save.objects.forEach(saved => {

                const object =
                    objects.find(
                        item =>
                            item.id === saved.id
                    );

                if (object) {

                    object.collected =
                        saved.collected;

                }

            });

        }

        if (save.missions) {

            Object.keys(save.missions)
                .forEach(key => {

                    if (!missions[key]) return;

                    missions[key].active =
                        save.missions[key].active;

                    missions[key].completed =
                        save.missions[key].completed;

                });

        }

        currentMission =
            Object.values(missions)
                .find(
                    mission =>
                        mission.active
                ) || null;

        updateInventoryUI();
        updateXP();
        setMissionHUD();

        return true;

    } catch (error) {

        console.error(
            "Error cargando partida:",
            error
        );

        return false;

    }

}


/* =====================================================
   BOTON GUARDAR
===================================================== */

document
    .getElementById("save-button")
    .addEventListener(
        "click",
        () => {

            saveGame();

            notify(
                "💾 Partida guardada"
            );

        }
    );


/* =====================================================
   NOTIFICACION
===================================================== */

function notify(text) {

    const element =
        document.getElementById(
            "notification"
        );

    element.textContent = text;

    element.classList.add("show");

    clearTimeout(
        notificationTimer
    );

    notificationTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   DIBUJAR MUNDO
===================================================== */

function drawWorld() {

    /* TIERRA */

    ctx.fillStyle = "#c9ac77";

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );


    /* CAMINOS */

    ctx.fillStyle = "#a58960";

    ctx.fillRect(
        0,
        1650,
        WORLD.width,
        230
    );

    ctx.fillRect(
        2450,
        0,
        220,
        WORLD.height
    );


    /* CAMINOS SECUNDARIOS */

    ctx.fillRect(
        700,
        1050,
        3000,
        110
    );

    ctx.fillRect(
        3300,
        800,
        110,
        2100
    );


    /* PLAZA */

    ctx.fillStyle = "#73945c";

    ctx.fillRect(
        2380,
        1500,
        620,
        400
    );


    /* FUENTE */

    ctx.fillStyle = "#769fa4";

    ctx.beginPath();

    ctx.arc(
        2690,
        1700,
        65,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CANAL */

    ctx.fillStyle = "#548899";

    ctx.fillRect(
        300,
        3150,
        4500,
        75
    );


    /* CERROS */

    drawMountains();


    /* VIÑEDOS */

    drawVineyards();


    /* ARBOLES */

    trees.forEach(
        tree =>
            drawTree(
                tree.x,
                tree.y
            )
    );

}


/* =====================================================
   MONTAÑAS
===================================================== */

function drawMountains() {

    ctx.fillStyle = "#8d7962";

    ctx.beginPath();

    ctx.moveTo(0, 550);

    ctx.lineTo(500, 160);

    ctx.lineTo(900, 500);

    ctx.lineTo(1400, 220);

    ctx.lineTo(1900, 550);

    ctx.lineTo(2400, 170);

    ctx.lineTo(2900, 500);

    ctx.lineTo(3500, 180);

    ctx.lineTo(4100, 500);

    ctx.lineTo(4700, 200);

    ctx.lineTo(WORLD.width, 500);

    ctx.lineTo(WORLD.width, 0);

    ctx.lineTo(0, 0);

    ctx.closePath();

    ctx.fill();

}


/* =====================================================
   ARBOLES
===================================================== */

function drawTree(x, y) {

    ctx.fillStyle = "#60452f";

    ctx.fillRect(
        x - 8,
        y,
        16,
        40
    );

    ctx.fillStyle = "#41683d";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 5,
        34,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   VIÑEDOS
===================================================== */

function drawVineyards() {

    vineyards.forEach(vineyard => {

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
                    row * 45;

                ctx.strokeStyle =
                    "#526d40";

                ctx.lineWidth = 3;

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y
                );

                ctx.lineTo(
                    x,
                    y + 30
                );

                ctx.stroke();

                ctx.fillStyle =
                    "#557c43";

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

    });

}


/* =====================================================
   EDIFICIOS
===================================================== */

function drawBuildings() {

    buildings.forEach(building => {

        /* sombra */

        ctx.fillStyle =
            "rgba(0,0,0,.2)";

        ctx.fillRect(
            building.x + 10,
            building.y + 12,
            building.width,
            building.height
        );


        /* cuerpo */

        const colors = {

            public: "#a97758",

            school: "#b68b68",

            radio: "#725f53",

            shop: "#9c765e",

            museum: "#8f715d",

            vineyard: "#80664f"

        };

        ctx.fillStyle =
            colors[building.type] ||
            "#96725c";

        ctx.fillRect(
            building.x,
            building.y,
            building.width,
            building.height
        );


        /* techo */

        ctx.fillStyle =
            "#49362d";

        ctx.beginPath();

        ctx.moveTo(
            building.x - 15,
            building.y
        );

        ctx.lineTo(
            building.x +
            building.width / 2,
            building.y - 55
        );

        ctx.lineTo(
            building.x +
            building.width + 15,
            building.y
        );

        ctx.closePath();

        ctx.fill();


        /* puerta */

        ctx.fillStyle =
            "#49362d";

        ctx.fillRect(
            building.x +
            building.width / 2 - 22,

            building.y +
            building.height - 70,

            44,
            70
        );


        /* ventanas */

        ctx.fillStyle =
            "#b9d2d1";

        ctx.fillRect(
            building.x + 35,
            building.y + 35,
            45,
            45
        );

        ctx.fillRect(
            building.x +
            building.width - 80,

            building.y + 35,

            45,
            45
        );


        /* nombre */

        ctx.fillStyle = "white";

        ctx.font = "16px Arial";

        ctx.fillText(
            building.name,
            building.x,
            building.y +
            building.height +
            24
        );

    });

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(npc) {

    ctx.fillStyle = "#674660";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 25,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "white";

    ctx.font = "14px Arial";

    ctx.fillText(
        npc.name,
        npc.x - 40,
        npc.y + 45
    );


    if (
        npc.mission &&
        !missions[npc.mission].completed
    ) {

        ctx.fillStyle = "#f4c542";

        ctx.font = "25px Arial";

        ctx.fillText(
            "!",
            npc.x - 5,
            npc.y - 48
        );

    }

}


/* =====================================================
   OBJETOS
===================================================== */

function drawObjects() {

    objects.forEach(object => {

        if (object.collected) return;

        const icon =
            object.type === "photo"
                ? "📷"
                : "📜";

        ctx.font = "27px Arial";

        ctx.fillText(
            icon,
            object.x,
            object.y
        );

    });

}


/* =====================================================
   JUGADOR
===================================================== */

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
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        x + 16,
        y + 42,
        22,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#263b4c";

    ctx.fillRect(
        x,
        y,
        32,
        35
    );


    /* cabeza */

    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        x + 16,
        y - 9,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#33251e";

    ctx.beginPath();

    ctx.arc(
        x + 16,
        y - 15,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* indicador */

    if (
        getNearbyInteractable()
    ) {

        ctx.strokeStyle =
            "rgba(255,255,255,.7)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            x + 16,
            y + 18,
            28,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

}


/* =====================================================
   INTERACTUABLE CERCANO
===================================================== */

function getNearbyInteractable() {

    for (const npc of npcs) {

        if (distance(player, npc) < 110)
            return npc;

    }

    for (const object of objects) {

        if (
            !object.collected &&
            distance(player, object) < 100
        )
            return object;

    }

    return null;

}


/* =====================================================
   ILUMINACION
===================================================== */

function drawLighting() {

    worldTime += 0.0004;

    const darkness =
        (
            Math.sin(worldTime) + 1
        ) / 2;

    ctx.fillStyle =
        `rgba(20,30,70,${darkness * .16})`;

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );

}


/* =====================================================
   MINIMAPA
===================================================== */

function drawMinimap() {

    miniCtx.clearRect(
        0,
        0,
        minimap.width,
        minimap.height
    );

    const sx =
        minimap.width /
        WORLD.width;

    const sy =
        minimap.height /
        WORLD.height;


    miniCtx.fillStyle =
        "#c9ac77";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* zonas */

    zones.forEach(zone => {

        miniCtx.fillStyle =
            "rgba(100,140,90,.22)";

        miniCtx.fillRect(
            zone.x * sx,
            zone.y * sy,
            zone.width * sx,
            zone.height * sy
        );

    });


    /* canal */

    miniCtx.fillStyle =
        "#548899";

    miniCtx.fillRect(
        300 * sx,
        3150 * sy,
        4500 * sx,
        75 * sy
    );


    /* edificios */

    miniCtx.fillStyle =
        "#76594a";

    buildings.forEach(building => {

        miniCtx.fillRect(
            building.x * sx,
            building.y * sy,
            building.width * sx,
            building.height * sy
        );

    });


    /* NPC */

    miniCtx.fillStyle =
        "#e6c14e";

    npcs.forEach(npc => {

        miniCtx.beginPath();

        miniCtx.arc(
            npc.x * sx,
            npc.y * sy,
            3,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    });


    /* jugador */

    miniCtx.fillStyle =
        "#e33b35";

    miniCtx.beginPath();

    miniCtx.arc(
        player.x * sx,
        player.y * sy,
        5,
        0,
        Math.PI * 2
    );

    miniCtx.fill();

}


/* =====================================================
   MAPA GRANDE
===================================================== */

function drawBigMap() {

    const sx =
        bigMap.width /
        WORLD.width;

    const sy =
        bigMap.height /
        WORLD.height;

    bigMapCtx.clearRect(
        0,
        0,
        bigMap.width,
        bigMap.height
    );


    bigMapCtx.fillStyle =
        "#c9ac77";

    bigMapCtx.fillRect(
        0,
        0,
        bigMap.width,
        bigMap.height
    );


    /* zonas */

    zones.forEach(zone => {

        bigMapCtx.fillStyle =
            "rgba(90,130,80,.18)";

        bigMapCtx.fillRect(
            zone.x * sx,
            zone.y * sy,
            zone.width * sx,
            zone.height * sy
        );

        bigMapCtx.fillStyle =
            "#435345";

        bigMapCtx.font =
            "13px Arial";

        bigMapCtx.fillText(
            zone.name,
            zone.x * sx + 5,
            zone.y * sy + 18
        );

    });


    /* caminos */

    bigMapCtx.fillStyle =
        "#9e8157";

    bigMapCtx.fillRect(
        0,
        1650 * sy,
        bigMap.width,
        230 * sy
    );


    bigMapCtx.fillRect(
        2450 * sx,
        0,
        220 * sx,
        bigMap.height
    );


    /* canal */

    bigMapCtx.fillStyle =
        "#548899";

    bigMapCtx.fillRect(
        300 * sx,
        3150 * sy,
        4500 * sx,
        75 * sy
    );


    /* edificios */

    bigMapCtx.fillStyle =
        "#654d40";

    buildings.forEach(building => {

        bigMapCtx.fillRect(
            building.x * sx,
            building.y * sy,
            building.width * sx,
            building.height * sy
        );

    });


    /* jugador */

    bigMapCtx.fillStyle =
        "#e33b35";

    bigMapCtx.beginPath();

    bigMapCtx.arc(
        player.x * sx,
        player.y * sy,
        8,
        0,
        Math.PI * 2
    );

    bigMapCtx.fill();

}


/* =====================================================
   DIBUJADO PRINCIPAL
===================================================== */

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

    npcs.forEach(
        npc =>
            drawNPC(npc)
    );

    drawPlayer();

    drawLighting();

    ctx.restore();

    drawMinimap();

}


/* =====================================================
   INICIO
===================================================== */

function startGame(load = false) {

    if (load) {

        const loaded =
            loadGame();

        if (!loaded) {

            notify(
                "No hay una partida guardada."
            );

            return;

        }

    }

    gameStarted = true;

    document
        .getElementById(
            "start-screen"
        )
        .classList
        .add("hidden");

    notify(
        "🌄 Bienvenido al Chañar"
    );

}


/* =====================================================
   BOTONES DE INICIO
===================================================== */

document
    .getElementById("start-button")
    .addEventListener(
        "click",
        () => startGame(false)
    );


document
    .getElementById("continue-button")
    .addEventListener(
        "click",
        () => startGame(true)
    );


/* =====================================================
   JOYSTICK CELULAR
===================================================== */

const joystickElement =
    document.getElementById(
        "joystick"
    );

const joystickBase =
    document.getElementById(
        "joystick-base"
    );

const joystickStick =
    document.getElementById(
        "joystick-stick"
    );


function updateJoystick(event) {

    const rect =
        joystickBase.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    let dx =
        event.clientX -
        centerX;

    let dy =
        event.clientY -
        centerY;

    const max =
        rect.width / 2 - 25;

    const length =
        Math.hypot(dx, dy);

    if (length > max) {

        dx =
            dx / length *
            max;

        dy =
            dy / length *
            max;

    }

    joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;

    joystick.x =
        dx / max;

    joystick.y =
        dy / max;

}


joystickElement.addEventListener(
    "pointerdown",
    event => {

        joystick.active = true;

        joystickElement.setPointerCapture(
            event.pointerId
        );

        updateJoystick(event);

    }
);


joystickElement.addEventListener(
    "pointermove",
    event => {

        if (!joystick.active) return;

        updateJoystick(event);

    }
);


function resetJoystick() {

    joystick.active = false;

    joystick.x = 0;
    joystick.y = 0;

    joystickStick.style.transform =
        "translate(0,0)";

}


joystickElement.addEventListener(
    "pointerup",
    resetJoystick
);

joystickElement.addEventListener(
    "pointercancel",
    resetJoystick
);


document
    .getElementById("mobile-interact")
    .addEventListener(
        "click",
        interact
    );


/* =====================================================
   LOOP
===================================================== */

function gameLoop() {

    if (gameStarted) {

        updatePlayer();

        updateCamera();

        updateZone();

    }

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   INICIALIZACION
===================================================== */

updateInventoryUI();

updateXP();

setMissionHUD();

draw();

gameLoop();
