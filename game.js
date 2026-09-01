/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   V19.0
   PUEBLO VIVO

   Juego creado por Elías Martínez
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");

const minimap =
    document.getElementById("minimap");

const miniCtx =
    minimap.getContext("2d");


/* =====================================================
   MUNDO
===================================================== */

const WORLD = {

    width: 4200,

    height: 3000

};


/* =====================================================
   ESTADO
===================================================== */

let gameStarted = false;

let gamePaused = false;

let worldMinutes = 8 * 60;

let lastTime = 0;

let discoveryTimer = null;


/* =====================================================
   TECLADO
===================================================== */

const keys = {};


document.addEventListener(
    "keydown",
    e => {

        const key =
            e.key.toLowerCase();

        keys[key] = true;


        if (
            key === "e" ||
            key === " "
        ) {

            interact();

        }


        if (key === "m") {

            toggleInventory();

        }


        if (key === "escape") {

            closePanels();

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


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2070,

    y: 1530,

    width: 28,

    height: 40,

    speed: 220,

    moving: false,

    direction: "down",

    frame: 0,

    money: 500,

    energy: 100,

    inside: false,

    currentBuilding: null

};


/* =====================================================
   CÁMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth: 7

};


/* =====================================================
   DATOS DEL PUEBLO
===================================================== */

const buildings = [

    {
        id: "municipalidad",
        x: 1920,
        y: 1080,
        w: 330,
        h: 180,
        color: "#a77d5e",
        name: "MUNICIPALIDAD",
        type: "public",
        interior: true
    },

    {
        id: "panaderia",
        x: 2450,
        y: 1280,
        w: 250,
        h: 150,
        color: "#b77a50",
        name: "PANADERÍA",
        type: "shop",
        interior: true
    },

    {
        id: "almacen",
        x: 1550,
        y: 1320,
        w: 250,
        h: 150,
        color: "#9d7659",
        name: "ALMACÉN",
        type: "shop",
        interior: true
    },

    {
        id: "radio",
        x: 2850,
        y: 1070,
        w: 340,
        h: 180,
        color: "#806d5d",
        name: "RADIO",
        type: "radio",
        interior: true
    },

    {
        id: "escuela",
        x: 1050,
        y: 980,
        w: 400,
        h: 190,
        color: "#a36e50",
        name: "ESCUELA",
        type: "school",
        interior: true
    },

    {
        id: "club",
        x: 800,
        y: 1640,
        w: 420,
        h: 210,
        color: "#8b694e",
        name: "CLUB ATLÉTICO SAN PATRICIO",
        type: "club",
        interior: true
    },

    {
        id: "casa1",
        x: 500,
        y: 1080,
        w: 220,
        h: 145,
        color: "#9a795f",
        name: "CASA",
        type: "house",
        interior: true
    },

    {
        id: "casa2",
        x: 650,
        y: 1300,
        w: 210,
        h: 140,
        color: "#ad8665",
        name: "CASA",
        type: "house",
        interior: true
    },

    {
        id: "casa3",
        x: 3100,
        y: 1450,
        w: 230,
        h: 145,
        color: "#96745b",
        name: "CASA",
        type: "house",
        interior: true
    },

    {
        id: "casa4",
        x: 3350,
        y: 1200,
        w: 220,
        h: 145,
        color: "#a77e60",
        name: "CASA",
        type: "house",
        interior: true
    }

];


/* =====================================================
   CALLES
===================================================== */

const roads = [

    {
        x: 0,
        y: 1450,
        w: WORLD.width,
        h: 150
    },

    {
        x: 1900,
        y: 0,
        w: 150,
        h: WORLD.height
    },

    {
        x: 650,
        y: 1050,
        w: 150,
        h: 1200
    },

    {
        x: 2700,
        y: 850,
        w: 150,
        h: 1500
    },

    {
        x: 850,
        y: 720,
        w: 2500,
        h: 120
    }

];


/* =====================================================
   PLAZAS / LUGARES
===================================================== */

const places = [

    {
        id: "plaza",
        x: 1750,
        y: 1250,
        w: 500,
        h: 300,
        name: "PLAZA"
    },

    {
        id: "infancias",
        x: 2250,
        y: 1800,
        w: 430,
        h: 300,
        name: "PLAZA DE LAS INFANCIAS"
    },

    {
        id: "balneario",
        x: 150,
        y: 2450,
        w: 850,
        h: 350,
        name: "BALNEARIO MUNICIPAL"
    },

    {
        id: "rio",
        x: 0,
        y: 2800,
        w: WORLD.width,
        h: 200,
        name: "RÍO NEUQUÉN"
    }

];


/* =====================================================
   CANALES
===================================================== */

const canals = [

    {
        x: 0,
        y: 2250,
        w: WORLD.width,
        h: 38
    },

    {
        x: 1350,
        y: 700,
        w: 38,
        h: 1600
    }

];


/* =====================================================
   VIÑEDOS
===================================================== */

const vineyards = [

    {
        x: 50,
        y: 300,
        w: 1000,
        h: 350
    },

    {
        x: 2850,
        y: 300,
        w: 1100,
        h: 400
    },

    {
        x: 1000,
        y: 2250,
        w: 900,
        h: 350
    }

];


/* =====================================================
   ÁRBOLES
===================================================== */

const trees = [];

for (
    let i = 0;
    i < 130;
    i++
) {

    trees.push({

        x:
            80 +
            Math.random() *
            (WORLD.width - 160),

        y:
            100 +
            Math.random() *
            2550,

        size:
            18 +
            Math.random() * 18

    });

}


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        id: "pedro",

        name: "Don Pedro",

        x: 1710,

        y: 1510,

        color: "#5b4436",

        role: "vecino",

        schedule: "plaza",

        dialogue: [

            "Buen día, vecino.",

            "¿Sabés que este lugar antes era prácticamente monte?",

            "Cuando escuches hablar de El Chañar, acordate que antes de la ciudad hubo un paraje y hubo gente que apostó por estas tierras.",

            "Hay historias que todavía no están escritas."

        ]

    },

    {
        id: "maria",

        name: "María",

        x: 2160,

        y: 1430,

        color: "#754f5d",

        role: "panadera",

        schedule: "panaderia",

        dialogue: [

            "Buen día. ¿Pan calentito?",

            "Acá nos conocemos todos.",

            "A veces un negocio es también un lugar donde se enteran las noticias del pueblo.",

            "Si querés conocer Chañar, hablá con la gente."

        ]

    },

    {
        id: "raul",

        name: "Raúl",

        x: 1180,

        y: 1480,

        color: "#4b5f43",

        role: "trabajador rural",

        schedule: "chacra",

        dialogue: [

            "Buen día.",

            "El agua es parte de la historia de este lugar.",

            "Sin riego, este paisaje sería completamente distinto.",

            "Acá el trabajo de la tierra transformó el territorio."

        ]

    },

    {
        id: "sofia",

        name: "Sofía",

        x: 2500,

        y: 1900,

        color: "#805c45",

        role: "estudiante",

        schedule: "escuela",

        dialogue: [

            "Hola.",

            "Estoy yendo a la escuela.",

            "¿Vos también estás buscando historias?",

            "Mi abuela siempre cuenta cosas que no aparecen en los libros."

        ]

    },

    {
        id: "julian",

        name: "Julián",

        x: 2980,

        y: 1150,

        color: "#344c62",

        role: "radio",

        schedule: "radio",

        dialogue: [

            "Hola, ¿cómo estás?",

            "La radio tiene algo especial en los pueblos.",

            "Acá una voz puede llegar a una casa, a una chacra o a alguien trabajando lejos.",

            "Hay historias que algún día deberían quedar grabadas."

        ]

    },

    {
        id: "nora",

        name: "Nora",

        x: 760,

        y: 1520,

        color: "#72583f",

        role: "vecina",

        schedule: "casa",

        dialogue: [

            "Hola, ¿todo bien?",

            "Estoy preparando el almuerzo.",

            "Después de tantos años uno conoce las historias de cada esquina.",

            "Pero siempre aparece alguna nueva."

        ]

    }

];


/* =====================================================
   VEHÍCULOS
===================================================== */

const vehicles = [

    {
        type: "car",

        x: 100,

        y: 1515,

        direction: 1,

        speed: 90,

        road: "horizontal",

        color: "#8d4f43"
    },

    {
        type: "car",

        x: 3400,

        y: 1480,

        direction: -1,

        speed: 75,

        road: "horizontal",

        color: "#536879"
    },

    {
        type: "tractor",

        x: 1000,

        y: 780,

        direction: 1,

        speed: 45,

        road: "horizontal",

        color: "#617c45"
    },

    {
        type: "truck",

        x: 2500,

        y: 780,

        direction: -1,

        speed: 65,

        road: "horizontal",

        color: "#706454"
    }

];


/* =====================================================
   OBJETOS INTERACTIVOS
===================================================== */

const objects = [

    {
        id: "photo1",

        x: 1320,

        y: 1510,

        type: "photo",

        name: "Fotografía antigua",

        collected: false

    },

    {
        id: "document1",

        x: 2050,

        y: 1100,

        type: "document",

        name: "Documento histórico",

        collected: false

    },

    {
        id: "bread",

        x: 2580,

        y: 1390,

        type: "bread",

        name: "Pan casero",

        collected: false

    },

    {
        id: "oldsign",

        x: 870,

        y: 1720,

        type: "history",

        name: "Viejo cartel",

        collected: false

    }

];


/* =====================================================
   INVENTARIO
===================================================== */

const inventory = [];


/* =====================================================
   MISIONES
===================================================== */

const missions = [

    {

        id: "first",

        title:
            "LAS VOCES DEL PUEBLO",

        description:
            "Hablá con tres vecinos y descubrí qué recuerdos conservan sobre Chañar.",

        requirement:
            3,

        progress:
            0,

        completed:
            false

    },

    {

        id: "photo",

        title:
            "UNA FOTOGRAFÍA PERDIDA",

        description:
            "Encontrá la fotografía antigua que quedó cerca de la plaza.",

        requirement:
            1,

        progress:
            0,

        completed:
            false

    },

    {

        id: "bread",

        title:
            "UN ENCARGO DE LA MAÑANA",

        description:
            "Comprá pan en la panadería y lleváselo a Don Pedro.",

        requirement:
            1,

        progress:
            0,

        completed:
            false

    }

];


let currentMission =
    missions[0];


/* =====================================================
   HISTORIA DESBLOQUEABLE
===================================================== */

const discoveries = [

    {

        title:
            "EL NOMBRE",

        text:
            "El Chañar fue un nombre utilizado históricamente para el paraje. La identidad del lugar está ligada a la presencia del árbol llamado chañar."

    },

    {

        title:
            "EL RIEGO",

        text:
            "El desarrollo productivo de la localidad estuvo profundamente ligado a la transformación del territorio mediante obras de riego."

    },

    {

        title:
            "TRATAYÉN",

        text:
            "Antes de la ciudad moderna existieron antecedentes territoriales vinculados a Tratayén y a antiguos procesos de ocupación."

    },

    {

        title:
            "EL VINO",

        text:
            "El Chañar se convirtió en uno de los principales polos vitivinícolas de Neuquén."

    }

];


let discoveriesFound = [];


/* =====================================================
   UTILIDADES
===================================================== */

function distance(a,b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function rectCollision(a,b) {

    return (

        a.x <
        b.x + b.w &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.h &&

        a.y + a.height >
        b.y

    );

}


/* =====================================================
   RESIZE
===================================================== */

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =====================================================
   MOVIMIENTO
===================================================== */

function movementInput() {

    let x = 0;

    let y = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    )
        y--;

    if (
        keys["s"] ||
        keys["arrowdown"]
    )
        y++;

    if (
        keys["a"] ||
        keys["arrowleft"]
    )
        x--;

    if (
        keys["d"] ||
        keys["arrowright"]
    )
        x++;


    if (
        joystick.active
    ) {

        x =
            joystick.dx;

        y =
            joystick.dy;

    }


    const length =
        Math.hypot(x,y);


    if (
        length > 1
    ) {

        x /= length;

        y /= length;

    }


    return {
        x,
        y
    };

}


/* =====================================================
   COLISIONES
===================================================== */

function canMove(x,y) {

    const test = {

        x,
        y,

        width:
            player.width,

        height:
            player.height

    };


    /* EDIFICIOS */

    for (
        const b
        of buildings
    ) {

        if (
            rectCollision(
                test,
                b
            )
        ) {

            return false;

        }

    }


    return (

        x >= 0 &&
        y >= 0 &&

        x <
            WORLD.width -
            player.width &&

        y <
            WORLD.height -
            player.height

    );

}


/* =====================================================
   ACTUALIZAR JUGADOR
===================================================== */

function updatePlayer(dt) {

    if (
        player.inside
    )
        return;


    const input =
        movementInput();


    player.moving =
        Math.abs(input.x) +
        Math.abs(input.y) >
        .05;


    if (
        player.moving
    ) {

        player.frame +=
            dt * 10;


        if (
            Math.abs(input.x) >
            Math.abs(input.y)
        ) {

            player.direction =
                input.x > 0
                    ? "right"
                    : "left";

        } else {

            player.direction =
                input.y > 0
                    ? "down"
                    : "up";

        }

    }


    const speed =
        player.speed *
        dt;


    const nx =
        player.x +
        input.x *
        speed;


    const ny =
        player.y +
        input.y *
        speed;


    if (
        canMove(
            nx,
            player.y
        )
    ) {

        player.x =
            nx;

    }


    if (
        canMove(
            player.x,
            ny
        )
    ) {

        player.y =
            ny;

    }


    player.energy =
        Math.min(
            100,
            player.energy +
            dt * .7
        );

}


/* =====================================================
   VEHÍCULOS
===================================================== */

function updateVehicles(dt) {

    for (
        const v
        of vehicles
    ) {

        v.x +=
            v.speed *
            v.direction *
            dt;


        if (
            v.x >
            WORLD.width + 100
        ) {

            v.x = -100;

        }


        if (
            v.x < -100
        ) {

            v.x =
                WORLD.width + 100;

        }

    }

}


/* =====================================================
   NPC
===================================================== */

function updateNPCs(dt) {

    for (
        const npc
        of npcs
    ) {

        const target =
            getNPCTarget(npc);


        if (!target)
            continue;


        const dx =
            target.x -
            npc.x;

        const dy =
            target.y -
            npc.y;


        const d =
            Math.hypot(dx,dy);


        if (
            d > 8
        ) {

            npc.x +=
                dx /
                d *
                25 *
                dt;

            npc.y +=
                dy /
                d *
                25 *
                dt;

        }

    }

}


function getNPCTarget(npc) {

    const hour =
        Math.floor(
            worldMinutes / 60
        );


    if (
        npc.schedule ===
        "panaderia"
    ) {

        return {
            x: 2550,
            y: 1470
        };

    }


    if (
        npc.schedule ===
        "radio"
    ) {

        return {
            x: 3010,
            y: 1320
        };

    }


    if (
        npc.schedule ===
        "escuela"
    ) {

        if (
            hour >= 8 &&
            hour <= 13
        ) {

            return {
                x: 1230,
                y: 1230
            };

        }

    }


    if (
        npc.schedule ===
        "chacra"
    ) {

        return {

            x:
                1000 +
                Math.sin(
                    worldMinutes / 100
                ) *
                400,

            y:
                500

        };

    }


    if (
        hour >= 17
    ) {

        return {

            x:
                1800,

            y:
                1400

        };

    }


    return {

        x:
            npc.x,

        y:
            npc.y

    };

}


/* =====================================================
   TIEMPO
===================================================== */

function updateTime(dt) {

    worldMinutes +=
        dt * 2;


    if (
        worldMinutes >=
        24 * 60
    ) {

        worldMinutes = 0;

    }


    updateClock();

}


function updateClock() {

    const h =
        Math.floor(
            worldMinutes / 60
        );

    const m =
        Math.floor(
            worldMinutes % 60
        );


    document
        .getElementById(
            "clock"
        )
        .textContent =

        String(h)
            .padStart(2,"0")
        +
        ":"
        +
        String(m)
            .padStart(2,"0");

}


/* =====================================================
   INTERACCIÓN
===================================================== */

function nearestInteraction() {

    let nearest =
        null;

    let best =
        90;


    for (
        const npc
        of npcs
    ) {

        const d =
            distance(
                player,
                npc
            );


        if (
            d < best
        ) {

            best =
                d;

            nearest = {

                type:
                    "npc",

                object:
                    npc

            };

        }

    }


    for (
        const object
        of objects
    ) {

        if (
            object.collected
        )
            continue;


        const d =
            distance(
                player,
                object
            );


        if (
            d < best
        ) {

            best =
                d;

            nearest = {

                type:
                    "object",

                object:
                    object

            };

        }

    }


    for (
        const building
        of buildings
    ) {

        const center = {

            x:
                building.x +
                building.w / 2,

            y:
                building.y +
                building.h / 2

        };


        const d =
            distance(
                player,
                center
            );


        if (
            d < 130
        ) {

            if (
                d < best
            ) {

                best =
                    d;

                nearest = {

                    type:
                        "building",

                    object:
                        building

                };

            }

        }

    }


    return nearest;

}


function interact() {

    if (
        !gameStarted
    )
        return;


    if (
        player.inside
    ) {

        exitBuilding();

        return;

    }


    const target =
        nearestInteraction();


    if (!target)
        return;


    if (
        target.type ===
        "npc"
    ) {

        talkTo(
            target.object
        );

        return;

    }


    if (
        target.type ===
        "object"
    ) {

        collectObject(
            target.object
        );

        return;

    }


    if (
        target.type ===
        "building"
    ) {

        enterBuilding(
            target.object
        );

    }

}


/* =====================================================
   NPC DIALOGO
===================================================== */

function talkTo(npc) {

    showDialogue(
        npc.name,
        npc.dialogue
    );


    if (
        !npc.spoken
    ) {

        npc.spoken =
            true;


        if (
            currentMission &&
            currentMission.id ===
            "first"
        ) {

            currentMission.progress++;

            updateMission();

        }

    }

}


/* =====================================================
   DIALOGOS
===================================================== */

let dialogueLines = [];

let dialogueIndex = 0;


function showDialogue(
    name,
    text
) {

    dialogueLines =
        Array.isArray(text)
            ? text
            : [text];


    dialogueIndex =
        0;


    document
        .getElementById(
            "dialogue-name"
        )
        .textContent =
        name;


    document
        .getElementById(
            "dialogue-text"
        )
        .textContent =
        dialogueLines[0];


    document
        .getElementById(
            "dialogue"
        )
        .classList
        .remove(
            "hidden"
        );

}


document
    .getElementById(
        "dialogue-next"
    )
    .addEventListener(
        "click",
        () => {

            dialogueIndex++;


            if (
                dialogueIndex >=
                dialogueLines.length
            ) {

                document
                    .getElementById(
                        "dialogue"
                    )
                    .classList
                    .add(
                        "hidden"
                    );

                return;

            }


            document
                .getElementById(
                    "dialogue-text"
                )
                .textContent =
                dialogueLines[
                    dialogueIndex
                ];

        }
    );


/* =====================================================
   EDIFICIOS
===================================================== */

function enterBuilding(building) {

    player.inside =
        true;

    player.currentBuilding =
        building;


    showDialogue(

        building.name,

        getInteriorDialogue(
            building
        )

    );

}


function exitBuilding() {

    player.inside =
        false;

    player.currentBuilding =
        null;

}


function getInteriorDialogue(building) {

    switch (
        building.type
    ) {

        case "shop":

            return [

                "Entraste al negocio.",

                "Hay movimiento, vecinos y productos.",

                "Podés volver a salir cuando quieras."

            ];

        case "radio":

            return [

                "Estás dentro de la radio.",

                "Desde acá una voz puede atravesar todo el pueblo.",

                "Quizás alguna historia de Chañar termine siendo registrada acá."

            ];

        case "school":

            return [

                "Escuela.",

                "Las escuelas también guardan memoria.",

                "Generaciones enteras pasaron por sus aulas."

            ];

        case "club":

            return [

                "Club Atlético San Patricio.",

                "El club nació muy ligado a la historia social de la localidad.",

                "Acá el deporte también es una forma de pertenencia."

            ];

        case "public":

            return [

                "Municipalidad.",

                "Desde acá se organiza parte de la vida pública del pueblo."

            ];

        default:

            return [

                "Una casa de Chañar.",

                "Cada vivienda guarda una historia."

            ];

    }

}


/* =====================================================
   OBJETOS
===================================================== */

function collectObject(object) {

    object.collected =
        true;


    inventory.push(
        object.name
    );


    if (
        object.type ===
        "bread"
    ) {

        currentMission =
            missions[2];

        currentMission.progress =
            1;

    }


    if (
        object.type ===
        "photo"
    ) {

        currentMission =
            missions[1];

        currentMission.progress =
            1;


        discover(
            discoveries[0]
        );

    }


    updateMission();


    showDialogue(

        "OBJETO",

        "Encontraste: " +
        object.name

    );

}


/* =====================================================
   MISIONES
===================================================== */

function updateMission() {

    if (!currentMission)
        return;


    if (
        currentMission.progress >=
        currentMission.requirement
    ) {

        currentMission.completed =
            true;


        const index =
            missions.indexOf(
                currentMission
            );


        if (
            index <
            missions.length - 1
        ) {

            currentMission =
                missions[index + 1];

            currentMission.progress =
                0;

        }

    }


    updateMissionHUD();

}


function updateMissionHUD() {

    if (!currentMission) {

        document
            .getElementById(
                "mission-hud"
            )
            .textContent =
            "Explorá el pueblo";

        return;

    }


    document
        .getElementById(
            "mission-hud"
        )
        .textContent =

        currentMission.title
        +
        " · "
        +
        currentMission.progress
        +
        "/"
        +
        currentMission.requirement;

}


/* =====================================================
   DESCUBRIMIENTOS
===================================================== */

function discover(discovery) {

    if (
        discoveriesFound.includes(
            discovery.title
        )
    )
        return;


    discoveriesFound.push(
        discovery.title
    );


    document
        .getElementById(
            "discovery-title"
        )
        .textContent =
        discovery.title;


    document
        .getElementById(
            "discovery-text"
        )
        .textContent =
        discovery.text;


    const panel =
        document.getElementById(
            "discovery"
        );


    panel.classList.remove(
        "hidden"
    );


    clearTimeout(
        discoveryTimer
    );


    discoveryTimer =
        setTimeout(
            () => {

                panel.classList.add(
                    "hidden"
                );

            },
            7000
        );

}


/* =====================================================
   INVENTARIO
===================================================== */

function updateInventory() {

    const box =
        document.getElementById(
            "inventory-items"
        );


    if (
        inventory.length === 0
    ) {

        box.innerHTML =
            "Todavía no tenés objetos.";

        return;

    }


    box.innerHTML =
        inventory
            .map(
                item =>
                    "• " +
                    item
            )
            .join(
                "<br>"
            );

}


function toggleInventory() {

    document
        .getElementById(
            "inventory-panel"
        )
        .classList
        .toggle(
            "hidden"
        );

}


document
    .getElementById(
        "inventory-button"
    )
    .onclick =
    toggleInventory;


document
    .getElementById(
        "inventory-close"
    )
    .onclick =
    toggleInventory;


/* =====================================================
   MAPA
===================================================== */

document
    .getElementById(
        "map-button"
    )
    .onclick =
    () => {

        document
            .getElementById(
                "map-panel"
            )
            .classList
            .remove(
                "hidden"
            );

    };


document
    .getElementById(
        "map-close"
    )
    .onclick =
    () => {

        document
            .getElementById(
                "map-panel"
            )
            .classList
            .add(
                "hidden"
            );

    };


/* =====================================================
   PANELES
===================================================== */

function closePanels() {

    document
        .querySelectorAll(
            ".panel"
        )
        .forEach(
            panel =>
                panel.classList.add(
                    "hidden"
                )
        );

}


/* =====================================================
   DIBUJO DEL MUNDO
===================================================== */

function drawWorld() {

    ctx.fillStyle =
        "#c9ab73";

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );


    drawMountains();

    drawVineyards();

    drawCanals();

    drawPlaces();

    drawRoads();

    drawTrees();

    drawBuildings();

    drawObjects();

    drawVehicles();

    drawNPCs();

    drawPlayer();

}


/* =====================================================
   CERROS
===================================================== */

function drawMountains() {

    ctx.fillStyle =
        "#8d7960";

    ctx.beginPath();

    ctx.moveTo(
        0,
        550
    );

    ctx.lineTo(
        500,
        180
    );

    ctx.lineTo(
        1000,
        520
    );

    ctx.lineTo(
        1500,
        220
    );

    ctx.lineTo(
        2000,
        510
    );

    ctx.lineTo(
        2550,
        150
    );

    ctx.lineTo(
        3100,
        500
    );

    ctx.lineTo(
        3700,
        180
    );

    ctx.lineTo(
        WORLD.width,
        550
    );

    ctx.lineTo(
        WORLD.width,
        0
    );

    ctx.lineTo(
        0,
        0
    );

    ctx.closePath();

    ctx.fill();

}


/* =====================================================
   VIÑEDOS
===================================================== */

function drawVineyards() {

    for (
        const v
        of vineyards
    ) {

        ctx.save();

        ctx.beginPath();

        ctx.rect(
            v.x,
            v.y,
            v.w,
            v.h
        );

        ctx.clip();


        ctx.strokeStyle =
            "#4b653c";

        ctx.lineWidth =
            3;


        for (
            let y =
                v.y;

            y <
                v.y +
                v.h;

            y += 35
        ) {

            ctx.beginPath();

            ctx.moveTo(
                v.x,
                y
            );

            ctx.lineTo(
                v.x + v.w,
                y
            );

            ctx.stroke();

        }


        for (
            let x =
                v.x;

            x <
                v.x +
                v.w;

            x += 55
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                v.y
            );

            ctx.lineTo(
                x,
                v.y + v.h
            );

            ctx.stroke();

        }


        ctx.restore();

    }

}


/* =====================================================
   CANALES
===================================================== */

function drawCanals() {

    for (
        const c
        of canals
    ) {

        ctx.fillStyle =
            "#56899a";

        ctx.fillRect(
            c.x,
            c.y,
            c.w,
            c.h
        );


        ctx.fillStyle =
            "rgba(255,255,255,.15)";

        ctx.fillRect(
            c.x,
            c.y,
            c.w,
            4
        );

    }

}


/* =====================================================
   LUGARES
===================================================== */

function drawPlaces() {

    for (
        const p
        of places
    ) {

        if (
            p.id === "rio"
        ) {

            ctx.fillStyle =
                "#467f91";

        }

        else if (
            p.id === "balneario"
        ) {

            ctx.fillStyle =
                "#71935e";

        }

        else {

            ctx.fillStyle =
                "#71965c";

        }


        ctx.fillRect(
            p.x,
            p.y,
            p.w,
            p.h
        );


        ctx.fillStyle =
            "rgba(255,255,255,.7)";

        ctx.font =
            "20px Arial";

        ctx.fillText(
            p.name,
            p.x + 15,
            p.y + 30
        );

    }

}


/* =====================================================
   CALLES
===================================================== */

function drawRoads() {

    for (
        const r
        of roads
    ) {

        ctx.fillStyle =
            "#a1815b";

        ctx.fillRect(
            r.x,
            r.y,
            r.w,
            r.h
        );


        ctx.strokeStyle =
            "rgba(255,235,180,.35)";

        ctx.lineWidth =
            3;

        if (
            r.w >
            r.h
        ) {

            ctx.setLineDash(
                [25,20]
            );

            ctx.beginPath();

            ctx.moveTo(
                r.x,
                r.y +
                r.h / 2
            );

            ctx.lineTo(
                r.x + r.w,
                r.y +
                r.h / 2
            );

            ctx.stroke();

        }

        ctx.setLineDash([]);

    }

}


/* =====================================================
   ÁRBOLES
===================================================== */

function drawTrees() {

    for (
        const tree
        of trees
    ) {

        ctx.fillStyle =
            "#634733";

        ctx.fillRect(
            tree.x - 5,
            tree.y,
            10,
            tree.size * 1.7
        );


        ctx.fillStyle =
            "#45683e";

        ctx.beginPath();

        ctx.arc(
            tree.x,
            tree.y,
            tree.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =====================================================
   EDIFICIOS
===================================================== */

function drawBuildings() {

    for (
        const b
        of buildings
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,.18)";

        ctx.fillRect(
            b.x + 10,
            b.y + 12,
            b.w,
            b.h
        );


        ctx.fillStyle =
            b.color;

        ctx.fillRect(
            b.x,
            b.y,
            b.w,
            b.h
        );


        /* TECHO */

        ctx.fillStyle =
            "#513c32";

        ctx.beginPath();

        ctx.moveTo(
            b.x - 15,
            b.y
        );

        ctx.lineTo(
            b.x +
            b.w / 2,
            b.y - 55
        );

        ctx.lineTo(
            b.x +
            b.w + 15,
            b.y
        );

        ctx.closePath();

        ctx.fill();


        /* VENTANAS */

        ctx.fillStyle =
            "#b9d0c7";

        ctx.fillRect(
            b.x + 25,
            b.y + 40,
            42,
            35
        );

        ctx.fillRect(
            b.x +
            b.w -
            67,
            b.y + 40,
            42,
            35
        );


        /* PUERTA */

        ctx.fillStyle =
            "#4d382e";

        ctx.fillRect(
            b.x +
            b.w / 2 -
            18,

            b.y +
            b.h -
            60,

            36,
            60
        );


        ctx.fillStyle =
            "white";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            b.name,
            b.x,
            b.y +
            b.h +
            22
        );

    }

}


/* =====================================================
   VEHICULOS
===================================================== */

function drawVehicles() {

    for (
        const v
        of vehicles
    ) {

        ctx.save();

        ctx.translate(
            v.x,
            v.y
        );


        if (
            v.direction < 0
        )
            ctx.scale(
                -1,
                1
            );


        if (
            v.type ===
            "tractor"
        ) {

            drawTractor();

        }

        else {

            drawCar(
                v.type,
                v.color
            );

        }


        ctx.restore();

    }

}


function drawCar(
    type,
    color
) {

    ctx.fillStyle =
        color;

    ctx.fillRect(
        -30,
        -14,
        60,
        28
    );


    ctx.fillStyle =
        "#b8d0d0";

    ctx.fillRect(
        -18,
        -10,
        18,
        10
    );

    ctx.fillRect(
        4,
        -10,
        15,
        10
    );


    ctx.fillStyle =
        "#202020";

    ctx.beginPath();

    ctx.arc(
        -20,
        15,
        7,
        0,
        Math.PI * 2
    );

    ctx.arc(
        20,
        15,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


function drawTractor() {

    ctx.fillStyle =
        "#5c7d43";

    ctx.fillRect(
        -35,
        -18,
        45,
        30
    );


    ctx.fillStyle =
        "#719258";

    ctx.fillRect(
        -5,
        -30,
        28,
        25
    );


    ctx.fillStyle =
        "#9fb7b1";

    ctx.fillRect(
        0,
        -26,
        18,
        17
    );


    ctx.fillStyle =
        "#272727";

    ctx.beginPath();

    ctx.arc(
        -20,
        18,
        12,
        0,
        Math.PI * 2
    );

    ctx.arc(
        20,
        18,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   NPC
===================================================== */

function drawNPCs() {

    for (
        const npc
        of npcs
    ) {

        drawPerson(
            npc.x,
            npc.y,
            npc.color,
            false
        );


        ctx.fillStyle =
            "rgba(20,20,20,.8)";

        ctx.font =
            "11px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            npc.name,
            npc.x,
            npc.y + 42
        );

        ctx.textAlign =
            "left";

    }

}


/* =====================================================
   PERSONA
===================================================== */

function drawPerson(
    x,
    y,
    color,
    playerCharacter
) {

    const bob =
        playerCharacter &&
        player.moving
            ? Math.sin(
                player.frame
            ) * 3
            : 0;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 22,
        18,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#302d2a";

    ctx.lineWidth =
        6;

    ctx.beginPath();

    ctx.moveTo(
        x - 5,
        y + bob + 8
    );

    ctx.lineTo(
        x - 7,
        y + bob + 25
    );

    ctx.moveTo(
        x + 5,
        y + bob + 8
    );

    ctx.lineTo(
        x + 7,
        y + bob + 25
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        color;

    ctx.fillRect(
        x - 12,
        y - 8 + bob,
        24,
        22
    );


    /* cabeza */

    ctx.fillStyle =
        "#d59d78";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 20 + bob,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#33251f";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 25 + bob,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   JUGADOR
===================================================== */

function drawPlayer() {

    drawPerson(
        player.x + 14,
        player.y + 20,
        "#29445a",
        true
    );

}


/* =====================================================
   OBJETOS
===================================================== */

function drawObjects() {

    for (
        const o
        of objects
    ) {

        if (
            o.collected
        )
            continue;


        ctx.font =
            "26px Arial";


        let icon =
            "•";


        if (
            o.type ===
            "photo"
        )
            icon =
                "📷";


        if (
            o.type ===
            "document"
        )
            icon =
                "📜";


        if (
            o.type ===
            "bread"
        )
            icon =
                "🥖";


        if (
            o.type ===
            "history"
        )
            icon =
                "📜";


        ctx.fillText(
            icon,
            o.x,
            o.y
        );

    }

}


/* =====================================================
   ILUMINACIÓN
===================================================== */

function drawLighting() {

    const hour =
        worldMinutes / 60;


    let darkness =
        0;


    if (
        hour < 6
    ) {

        darkness =
            .48;

    }

    else if (
        hour < 8
    ) {

        darkness =
            .22;

    }

    else if (
        hour > 19
    ) {

        darkness =
            Math.min(
                .48,
                (hour - 19) * .16
            );

    }


    if (
        darkness <= 0
    )
        return;


    ctx.fillStyle =
        `rgba(18,28,55,${darkness})`;


    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );

}


/* =====================================================
   CAMARA
===================================================== */

function updateCamera(dt) {

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
        Math.min(
            1,
            dt *
            camera.smooth
        );


    camera.y +=
        (
            targetY -
            camera.y
        ) *
        Math.min(
            1,
            dt *
            camera.smooth
        );


    camera.x =
        Math.max(
            0,
            Math.min(
                WORLD.width -
                canvas.width,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD.height -
                canvas.height,
                camera.y
            )
        );

}


/* =====================================================
   MINIMAPA
===================================================== */

function drawMinimap() {

    const sx =
        minimap.width /
        WORLD.width;

    const sy =
        minimap.height /
        WORLD.height;


    miniCtx.fillStyle =
        "#c9aa72";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* calles */

    miniCtx.fillStyle =
        "#9b7b57";


    for (
        const r
        of roads
    ) {

        miniCtx.fillRect(
            r.x * sx,
            r.y * sy,
            r.w * sx,
            r.h * sy
        );

    }


    /* edificios */

    miniCtx.fillStyle =
        "#6d5142";


    for (
        const b
        of buildings
    ) {

        miniCtx.fillRect(
            b.x * sx,
            b.y * sy,
            b.w * sx,
            b.h * sy
        );

    }


    /* río */

    miniCtx.fillStyle =
        "#467f91";

    miniCtx.fillRect(
        0,
        2800 * sy,
        minimap.width,
        200 * sy
    );


    /* jugador */

    miniCtx.fillStyle =
        "#ff3333";

    miniCtx.beginPath();

    miniCtx.arc(
        player.x * sx,
        player.y * sy,
        4,
        0,
        Math.PI * 2
    );

    miniCtx.fill();

}


/* =====================================================
   INTERACTION HUD
===================================================== */

function updateInteractionHint() {

    const target =
        nearestInteraction();

    const hint =
        document.getElementById(
            "interaction-hint"
        );


    if (
        target &&
        !player.inside
    ) {

        hint.style.display =
            "flex";


        const text =
            document.getElementById(
                "interaction-text"
            );


        if (
            target.type ===
            "npc"
        ) {

            text.textContent =
                "Hablar con " +
                target.object.name;

        }

        else if (
            target.type ===
            "building"
        ) {

            text.textContent =
                "Entrar";

        }

        else {

            text.textContent =
                "Recoger";

        }

    }

    else {

        hint.style.display =
            "none";

    }

}


/* =====================================================
   JOYSTICK
===================================================== */

const joystick = {

    active:
        false,

    dx:
        0,

    dy:
        0,

    centerX:
        0,

    centerY:
        0

};


const joystickElement =
    document.getElementById(
        "joystick"
    );

const joystickStick =
    document.getElementById(
        "joystick-stick"
    );


function updateJoystick(
    clientX,
    clientY
) {

    const rect =
        joystickElement
            .getBoundingClientRect();


    const cx =
        rect.left +
        rect.width / 2;

    const cy =
        rect.top +
        rect.height / 2;


    let dx =
        clientX -
        cx;

    let dy =
        clientY -
        cy;


    const max =
        rect.width / 2 -
        25;


    const length =
        Math.hypot(
            dx,
            dy
        );


    if (
        length >
        max
    ) {

        dx =
            dx /
            length *
            max;

        dy =
            dy /
            length *
            max;

    }


    joystick.dx =
        dx / max;

    joystick.dy =
        dy / max;


    joystickStick.style.transform =
        `translate(${dx}px,${dy}px)`;

}


function resetJoystick() {

    joystick.active =
        false;

    joystick.dx =
        0;

    joystick.dy =
        0;

    joystickStick.style.transform =
        "translate(0,0)";

}


joystickElement.addEventListener(
    "pointerdown",
    e => {

        joystick.active =
            true;

        joystickElement.setPointerCapture(
            e.pointerId
        );

        updateJoystick(
            e.clientX,
            e.clientY
        );

    }
);


joystickElement.addEventListener(
    "pointermove",
    e => {

        if (
            joystick.active
        ) {

            updateJoystick(
                e.clientX,
                e.clientY
            );

        }

    }
);


joystickElement.addEventListener(
    "pointerup",
    resetJoystick
);


joystickElement.addEventListener(
    "pointercancel",
    resetJoystick
);


document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "pointerdown",
        e => {

            e.preventDefault();

            interact();

        }
    );


/* =====================================================
   START
===================================================== */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        () => {

            gameStarted =
                true;

            document
                .getElementById(
                    "start-screen"
                )
                .classList
                .add(
                    "hidden"
                );

            updateMissionHUD();

        }
    );


/* =====================================================
   RENDER
===================================================== */

function render() {

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

    drawLighting();


    ctx.restore();


    drawMinimap();

    updateInteractionHint();

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop(timestamp) {

    if (!lastTime)
        lastTime =
            timestamp;


    let dt =
        (
            timestamp -
            lastTime
        ) / 1000;


    lastTime =
        timestamp;


    dt =
        Math.min(
            dt,
            .05
        );


    if (
        gameStarted
    ) {

        updatePlayer(dt);

        updateVehicles(dt);

        updateNPCs(dt);

        updateTime(dt);

        updateCamera(dt);

    }


    render();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

updateInventory();

updateMissionHUD();

updateClock();

requestAnimationFrame(
    gameLoop
);
