```javascript
/* =========================================================
   LOS SECRETOS DEL CHAÑAR
   V18.0 — PUEBLO VIVO

   Sistema:
   - Ciudadano
   - Calles
   - Peatones
   - Vehículos
   - Tractores
   - Edificios
   - Entrar / salir
   - Interiores
   - Globos de diálogo
   - Comercios
   - Pan
   - Mate
   - Inventario
   - Misiones
   - Minimap
   - PC + CELULAR
========================================================= */


/* =========================================================
   CANVAS
========================================================= */

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");

const minimap =
    document.getElementById("minimap");

const miniCtx =
    minimap.getContext("2d");


/* =========================================================
   MUNDO
========================================================= */

const WORLD_WIDTH = 4200;
const WORLD_HEIGHT = 3000;


/* =========================================================
   RESIZE
========================================================= */

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


/* =========================================================
   TECLADO
========================================================= */

const keys = {};


document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

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

            toggleInventory();

        }


        if (
            key === "escape"
        ) {

            closePanels();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   CONTROLES CELULAR
========================================================= */

document
    .querySelectorAll(".control")
    .forEach(
        button => {

            const key =
                button.dataset.key;


            button.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();

                    keys[key] = true;

                }
            );


            button.addEventListener(
                "pointerup",
                event => {

                    event.preventDefault();

                    keys[key] = false;

                }
            );


            button.addEventListener(
                "pointercancel",
                () => {

                    keys[key] = false;

                }
            );


            button.addEventListener(
                "pointerleave",
                () => {

                    keys[key] = false;

                }
            );

        }
    );


document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            interact();

        }
    );


document
    .getElementById(
        "mobile-inventory"
    )
    .addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            toggleInventory();

        }
    );


/* =========================================================
   CÁMARA
========================================================= */

const camera = {

    x: 0,

    y: 0,

    smooth: 0.12

};


/* =========================================================
   JUGADOR
========================================================= */

const player = {

    x: 2070,

    y: 1470,

    width: 30,

    height: 30,

    speed: 4.2,

    moving: false,

    frame: 0,

    direction: "down",

    state: "world",

    money: 500

};


/* =========================================================
   EXPERIENCIA
========================================================= */

let xp = 0;

let historyCount = 0;

let zonesUnlocked = 1;


/* =========================================================
   INVENTARIO
========================================================= */

const inventory = [];


/* =========================================================
   EDIFICIOS
========================================================= */

const buildings = [

    {
        id: "almacen",

        name: "Almacén El Chañar",

        x: 650,
        y: 820,

        width: 280,
        height: 190,

        color: "#ad7654",

        interior: "almacen",

        door: {
            x: 780,
            y: 1010
        }
    },


    {
        id: "casa1",

        name: "Casa de Don Pedro",

        x: 1160,
        y: 1170,

        width: 250,
        height: 180,

        color: "#a97c61",

        interior: "casa",

        door: {
            x: 1275,
            y: 1350
        }
    },


    {
        id: "escuela",

        name: "Escuela",

        x: 480,
        y: 360,

        width: 420,
        height: 220,

        color: "#a96d52",

        interior: "escuela",

        door: {
            x: 690,
            y: 580
        }
    },


    {
        id: "radio",

        name: "Radio Ocarina",

        x: 2950,
        y: 760,

        width: 430,
        height: 220,

        color: "#776653",

        interior: "radio",

        door: {
            x: 3165,
            y: 980
        }
    },


    {
        id: "museo",

        name: "Museo del Chañar",

        x: 1850,
        y: 300,

        width: 390,

        height: 220,

        color: "#8d715c",

        interior: "museo",

        door: {
            x: 2045,
            y: 520
        }
    },


    {
        id: "casa2",

        name: "Casa de María",

        x: 2500,
        y: 1300,

        width: 260,

        height: 180,

        color: "#b0876b",

        interior: "casa2",

        door: {
            x: 2630,
            y: 1480
        }
    },


    {
        id: "taller",

        name: "Taller Rural",

        x: 3250,
        y: 1700,

        width: 330,

        height: 220,

        color: "#81715d",

        interior: "taller",

        door: {
            x: 3415,
            y: 1920
        }
    }

];


/* =========================================================
   CALLES
========================================================= */

const roads = [

    {
        x: 0,
        y: 1330,
        width: WORLD_WIDTH,
        height: 180,
        name: "Avenida Principal"
    },


    {
        x: 1980,
        y: 0,
        width: 190,
        height: WORLD_HEIGHT,
        name: "Avenida Central"
    },


    {
        x: 0,
        y: 610,
        width: WORLD_WIDTH,
        height: 100,
        name: "Calle Norte"
    },


    {
        x: 0,
        y: 2180,
        width: WORLD_WIDTH,
        height: 120,
        name: "Camino Rural"
    },


    {
        x: 970,
        y: 0,
        width: 110,
        height: WORLD_HEIGHT,
        name: "Calle Este"
    },


    {
        x: 2870,
        y: 0,
        width: 110,
        height: WORLD_HEIGHT,
        name: "Calle Oeste"
    }

];


/* =========================================================
   CHACRAS
========================================================= */

const fields = [

    {
        x: 80,
        y: 2050,
        width: 850,
        height: 700
    },

    {
        x: 2350,
        y: 2100,
        width: 850,
        height: 650
    },

    {
        x: 3400,
        y: 350,
        width: 650,
        height: 500
    }

];


/* =========================================================
   ÁRBOLES
========================================================= */

const trees = [

    [170,180],
    [480,150],
    [900,190],
    [1250,190],
    [1600,150],
    [2350,180],
    [2700,160],
    [3200,180],
    [3700,190],

    [150,1150],
    [400,1150],
    [1030,1100],
    [1500,1160],
    [2400,1150],
    [2850,1120],
    [3500,1200],

    [150,2700],
    [1000,2750],
    [1800,2700],
    [2300,2800],
    [3300,2700],
    [4000,2650]

];


/* =========================================================
   NPC
========================================================= */

const npcs = [

    {
        id: "pedro",

        x: 1530,
        y: 1280,

        name: "Don Pedro",

        type: "neighbor",

        text:
            "Buen día, vecino. " +
            "¿Cómo anda?",

        longText:
            "Hace años que vivo acá. " +
            "Uno camina por estas calles y " +
            "parece que no cambia nada, pero " +
            "si mirás con atención, el pueblo " +
            "guarda muchísimas historias.",

        mission: true,

        color: "#526070",

        activity: "standing"

    },


    {
        id: "maria",

        x: 2240,
        y: 1420,

        name: "María",

        type: "neighbor",

        text:
            "¡Hola! ¿Todo bien?",

        longText:
            "Si alguna vez encontrás una " +
            "fotografía vieja, mirala con cuidado. " +
            "Las fotografías también cuentan " +
            "la historia del pueblo.",

        color: "#744c57",

        activity: "walking"

    },


    {
        id: "julian",

        x: 2750,
        y: 1110,

        name: "Julián",

        type: "radio",

        text:
            "Buen día. ¿Ya escuchaste la radio?",

        longText:
            "La radio tiene algo especial: " +
            "hace que la gente se encuentre " +
            "aunque esté cada uno en su casa.",

        color: "#4e6670",

        activity: "standing"

    },


    {
        id: "panadero",

        x: 820,
        y: 760,

        name: "Roberto",

        type: "shopkeeper",

        text:
            "Recién salieron los panes.",

        longText:
            "Si querés, podés comprar uno. " +
            "Todavía están calentitos.",

        color: "#86593e",

        activity: "working"

    },


    {
        id: "trabajador",

        x: 3350,
        y: 2250,

        name: "Carlos",

        type: "worker",

        text:
            "Buen día. Hay bastante trabajo hoy.",

        longText:
            "En esta zona el día empieza temprano. " +
            "Entre las chacras, los caminos y " +
            "el trabajo, siempre hay algo para hacer.",

        color: "#506246",

        activity: "working"

    }

];


/* =========================================================
   PEATONES
========================================================= */

const pedestrians = [

    {
        x: 1320,
        y: 1390,

        targetX: 1700,
        targetY: 1390,

        name: "Vecina",

        color: "#8b5960",

        speed: 0.8,

        state: "walking"
    },


    {
        x: 1760,
        y: 1400,

        targetX: 1450,
        targetY: 1400,

        name: "Vecino",

        color: "#596b78",

        speed: 0.65,

        state: "walking"
    },


    {
        x: 2250,
        y: 1350,

        targetX: 2550,
        targetY: 1350,

        name: "Trabajadora",

        color: "#6d7851",

        speed: 0.7,

        state: "walking"
    },


    {
        x: 2600,
        y: 1510,

        targetX: 2300,
        targetY: 1510,

        name: "Joven",

        color: "#75516d",

        speed: 0.75,

        state: "walking"
    }

];


/* =========================================================
   VEHÍCULOS
========================================================= */

const vehicles = [

    {
        x: 300,
        y: 1380,

        width: 62,
        height: 32,

        speed: 1.8,

        direction: 1,

        type: "car",

        color: "#5b6870"
    },


    {
        x: 3400,
        y: 1430,

        width: 62,
        height: 32,

        speed: 1.4,

        direction: -1,

        type: "car",

        color: "#874e47"
    },


    {
        x: 1500,
        y: 650,

        width: 58,
        height: 30,

        speed: 1.1,

        direction: 1,

        type: "car",

        color: "#5c7359"
    },


    {
        x: 2950,
        y: 2220,

        width: 95,
        height: 42,

        speed: 0.75,

        direction: 1,

        type: "tractor",

        color: "#65734a"
    }

];


/* =========================================================
   OBJETOS
========================================================= */

const objects = [

    {
        x: 1120,
        y: 1510,

        type: "photo",

        name: "Fotografía antigua",

        collected: false
    },


    {
        x: 1750,
        y: 1540,

        type: "document",

        name: "Documento antiguo",

        collected: false
    },


    {
        x: 2150,
        y: 700,

        type: "photo",

        name: "Fotografía del pueblo",

        collected: false
    },


    {
        x: 760,
        y: 720,

        type: "bread",

        name: "Pan casero",

        collected: false
    },


    {
        x: 1550,
        y: 1350,

        type: "mate",

        name: "Mate",

        collected: false
    }

];


/* =========================================================
   MISIÓN
========================================================= */

let mission = {

    active: false,

    completed: false,

    title: "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía " +
        "antigua. Recorré el pueblo y encontrala."

};


/* =========================================================
   INTERIORES
========================================================= */

const interiors = {

    almacen: {

        title: "Almacén El Chañar",

        subtitle: "Un pequeño comercio del barrio",

        width: 900,

        height: 600,

        spawnX: 450,

        spawnY: 500,

        color: "#c49b6d",

        objects: [

            {
                x: 180,
                y: 150,
                type: "shelf",
                label: "Estantería"
            },

            {
                x: 620,
                y: 150,
                type: "shelf",
                label: "Estantería"
            },

            {
                x: 450,
                y: 180,
                type: "counter",
                label: "Mostrador"
            },

            {
                x: 450,
                y: 540,
                type: "door",
                label: "Salir"
            }

        ]

    },


    casa: {

        title: "Casa de Don Pedro",

        subtitle: "Una casa del barrio",

        width: 850,

        height: 600,

        spawnX: 425,

        spawnY: 500,

        color: "#b99b7a",

        objects: [

            {
                x: 200,
                y: 170,
                type: "table",
                label: "Mesa"
            },

            {
                x: 650,
                y: 180,
                type: "chair",
                label: "Silla"
            },

            {
                x: 425,
                y: 540,
                type: "door",
                label: "Salir"
            }

        ]

    },


    casa2: {

        title: "Casa de María",

        subtitle: "Una vivienda del pueblo",

        width: 850,

        height: 600,

        spawnX: 425,

        spawnY: 500,

        color: "#c0a17f",

        objects: [

            {
                x: 300,
                y: 180,
                type: "table",
                label: "Mesa"
            },

            {
                x: 600,
                y: 220,
                type: "chair",
                label: "Silla"
            },

            {
                x: 425,
                y: 540,
                type: "door",
                label: "Salir"
            }

        ]

    },


    escuela: {

        title: "Escuela",

        subtitle: "Lugar de aprendizaje",

        width: 1000,

        height: 650,

        spawnX: 500,

        spawnY: 560,

        color: "#c6aa7e",

        objects: [

            {
                x: 180,
                y: 150,
                type: "desk",
                label: "Banco"
            },

            {
                x: 380,
                y: 150,
                type: "desk",
                label: "Banco"
            },

            {
                x: 580,
                y: 150,
                type: "desk",
                label: "Banco"
            },

            {
                x: 800,
                y: 150,
                type: "desk",
                label: "Banco"
            },

            {
                x: 500,
                y: 600,
                type: "door",
                label: "Salir"
            }

        ]

    },


    radio: {

        title: "Radio Ocarina",

        subtitle: "La voz del pueblo",

        width: 1000,

        height: 650,

        spawnX: 500,

        spawnY: 560,

        color: "#514d45",

        objects: [

            {
                x: 500,
                y: 150,
                type: "console",
                label: "Consola"
            },

            {
                x: 300,
                y: 160,
                type: "chair",
                label: "Silla"
            },

            {
                x: 700,
                y: 160,
                type: "chair",
                label: "Silla"
            },

            {
                x: 500,
                y: 600,
                type: "door",
                label: "Salir"
            }

        ]

    },


    museo: {

        title: "Museo del Chañar",

        subtitle: "Memoria del territorio",

        width: 1000,

        height: 650,

        spawnX: 500,

        spawnY: 560,

        color: "#a98d6d",

        objects: [

            {
                x: 250,
                y: 150,
                type: "photoFrame",
                label: "Fotografía histórica"
            },

            {
                x: 500,
                y: 150,
                type: "photoFrame",
                label: "Fotografía histórica"
            },

            {
                x: 750,
                y: 150,
                type: "photoFrame",
                label: "Documento"
            },

            {
                x: 500,
                y: 600,
                type: "door",
                label: "Salir"
            }

        ]

    },


    taller: {

        title: "Taller Rural",

        subtitle: "Herramientas y trabajo",

        width: 950,

        height: 620,

        spawnX: 475,

        spawnY: 530,

        color: "#706957",

        objects: [

            {
                x: 200,
                y: 170,
                type: "tool",
                label: "Herramientas"
            },

            {
                x: 700,
                y: 170,
                type: "tool",
                label: "Herramientas"
            },

            {
                x: 475,
                y: 570,
                type: "door",
                label: "Salir"
            }

        ]

    }

};


/* =========================================================
   ESTADO INTERIOR
========================================================= */

let currentInterior = null;


/* =========================================================
   TIEMPO
========================================================= */

let worldTime = 0;


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


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


/* =========================================================
   AÑADIR XP
========================================================= */

function addXP(amount) {

    xp += amount;

    document
        .getElementById("xp-count")
        .textContent = xp;

    document
        .getElementById("xp-panel")
        .textContent = xp;

}


/* =========================================================
   INVENTARIO
========================================================= */

function addInventory(item) {

    inventory.push(item);

    updateInventory();

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
            "Inventario vacío.";

    } else {

        container.innerHTML =
            inventory
                .map(
                    item =>
                        "• " + item
                )
                .join("<br>");

    }

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
   CERRAR PANELES
========================================================= */

function closePanels() {

    document
        .querySelectorAll(".panel")
        .forEach(
            panel => {

                panel
                    .classList
                    .add("hidden");

            }
        );

    hideSpeech();

}


/* =========================================================
   DIÁLOGOS
========================================================= */

function showSpeech(
    name,
    text
) {

    document
        .getElementById(
            "speech-name"
        )
        .textContent = name;

    document
        .getElementById(
            "speech-text"
        )
        .textContent = text;

    document
        .getElementById(
            "speech-bubble"
        )
        .classList
        .remove("hidden");

}


function hideSpeech() {

    document
        .getElementById(
            "speech-bubble"
        )
        .classList
        .add("hidden");

}


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

    hideSpeech();

}


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


function setMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );

    if (
        mission.completed
    ) {

        hud.textContent =
            "✓ Fotografía encontrada";

    } else if (
        mission.active
    ) {

        hud.textContent =
            "Misión: encontrá la fotografía";

    } else {

        hud.textContent =
            "Explorá el pueblo";

    }

}


/* =========================================================
   MOVIMIENTO EXTERIOR
========================================================= */

function canMoveWorld(
    x,
    y
) {

    const test = {

        x: x,

        y: y,

        width:
            player.width,

        height:
            player.height

    };


    for (
        const building
        of buildings
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


/* =========================================================
   MOVIMIENTO INTERIOR
========================================================= */

function canMoveInterior(
    x,
    y
) {

    const interior =
        interiors[
            currentInterior
        ];

    if (!interior) {

        return false;

    }


    const margin = 25;


    if (
        x < margin ||
        y < margin ||
        x + player.width >
            interior.width - margin ||
        y + player.height >
            interior.height - margin
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   ACTUALIZAR JUGADOR
========================================================= */

function updatePlayer() {

    let dx = 0;

    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -=
            player.speed;

        player.direction =
            "up";

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy +=
            player.speed;

        player.direction =
            "down";

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -=
            player.speed;

        player.direction =
            "left";

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx +=
            player.speed;

        player.direction =
            "right";

    }


    if (
        dx !== 0 &&
        dy !== 0
    ) {

        dx *= .707;

        dy *= .707;

    }


    player.moving =
        dx !== 0 ||
        dy !== 0;


    if (
        player.moving
    ) {

        player.frame += .18;

        hideSpeech();

    }


    if (
        currentInterior
    ) {

        if (
            canMoveInterior(
                player.x + dx,
                player.y
            )
        ) {

            player.x += dx;

        }


        if (
            canMoveInterior(
                player.x,
                player.y + dy
            )
        ) {

            player.y += dy;

        }

    } else {

        if (
            canMoveWorld(
                player.x + dx,
                player.y
            )
        ) {

            player.x += dx;

        }


        if (
            canMoveWorld(
                player.x,
                player.y + dy
            )
        ) {

            player.y += dy;

        }

    }

}


/* =========================================================
   CÁMARA
========================================================= */

function updateCamera() {

    if (
        currentInterior
    ) {

        const interior =
            interiors[
                currentInterior
            ];

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
            ) * .14;

        camera.y +=
            (
                targetY -
                camera.y
            ) * .14;


        camera.x =
            clamp(
                camera.x,
                0,
                Math.max(
                    0,
                    interior.width -
                    canvas.width
                )
            );

        camera.y =
            clamp(
                camera.y,
                0,
                Math.max(
                    0,
                    interior.height -
                    canvas.height
                )
            );

        return;

    }


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
        ) * camera.smooth;

    camera.y +=
        (
            targetY -
            camera.y
        ) * camera.smooth;


    camera.x =
        clamp(
            camera.x,
            0,
            Math.max(
                0,
                WORLD_WIDTH -
                canvas.width
            )
        );


    camera.y =
        clamp(
            camera.y,
            0,
            Math.max(
                0,
                WORLD_HEIGHT -
                canvas.height
            )
        );

}


/* =========================================================
   MUNDO EXTERIOR
========================================================= */

function drawWorld() {

    /* tierra */

    ctx.fillStyle =
        "#c9ad78";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* zonas rurales */

    for (
        const field
        of fields
    ) {

        ctx.fillStyle =
            "#a9a35f";

        ctx.fillRect(
            field.x,
            field.y,
            field.width,
            field.height
        );

        drawVineyard(
            field.x + 40,
            field.y + 50,
            field.width - 80,
            field.height - 100
        );

    }


    /* caminos */

    drawRoads();


    /* plaza */

    ctx.fillStyle =
        "#72955f";

    ctx.fillRect(
        1420,
        1080,
        700,
        430
    );


    /* fuente */

    ctx.fillStyle =
        "#6f9ba0";

    ctx.beginPath();

    ctx.arc(
        1770,
        1290,
        72,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#c8d5d1";

    ctx.lineWidth = 8;

    ctx.stroke();


    /* canal */

    ctx.fillStyle =
        "#568998";

    ctx.fillRect(
        0,
        2500,
        WORLD_WIDTH,
        50
    );


    /* árboles */

    for (
        const tree
        of trees
    ) {

        drawTree(
            tree[0],
            tree[1]
        );

    }

}


/* =========================================================
   CALLES
========================================================= */

function drawRoads() {

    for (
        const road
        of roads
    ) {

        ctx.fillStyle =
            "#957957";

        ctx.fillRect(
            road.x,
            road.y,
            road.width,
            road.height
        );


        ctx.strokeStyle =
            "rgba(245,225,163,.55)";

        ctx.lineWidth = 3;

        if (
            road.width >
            road.height
        ) {

            ctx.setLineDash(
                [24, 24]
            );

            ctx.beginPath();

            ctx.moveTo(
                road.x,
                road.y +
                road.height / 2
            );

            ctx.lineTo(
                road.x +
                road.width,
                road.y +
                road.height / 2
            );

            ctx.stroke();

        } else {

            ctx.setLineDash(
                [24, 24]
            );

            ctx.beginPath();

            ctx.moveTo(
                road.x +
                road.width / 2,
                road.y
            );

            ctx.lineTo(
                road.x +
                road.width / 2,
                road.y +
                road.height
            );

            ctx.stroke();

        }

        ctx.setLineDash([]);

    }

}


/* =========================================================
   VIÑEDO
========================================================= */

function drawVineyard(
    x,
    y,
    width,
    height
) {

    const cols =
        Math.max(
            5,
            Math.floor(
                width / 40
            )
        );

    const rows =
        Math.max(
            4,
            Math.floor(
                height / 40
            )
        );


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const px =
                x +
                col * 40;

            const py =
                y +
                row * 40;


            ctx.strokeStyle =
                "#536842";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                px,
                py
            );

            ctx.lineTo(
                px,
                py + 25
            );

            ctx.stroke();


            ctx.fillStyle =
                "#577642";

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                8,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}


/* =========================================================
   ÁRBOL
========================================================= */

function drawTree(
    x,
    y
) {

    ctx.fillStyle =
        "#65472f";

    ctx.fillRect(
        x - 8,
        y,
        16,
        42
    );


    ctx.fillStyle =
        "#42683e";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        35,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#54794a";

    ctx.beginPath();

    ctx.arc(
        x - 18,
        y + 5,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   EDIFICIOS
========================================================= */

function drawBuildings() {

    for (
        const building
        of buildings
    ) {

        /* sombra */

        ctx.fillStyle =
            "rgba(0,0,0,.18)";

        ctx.fillRect(
            building.x + 9,
            building.y + 12,
            building.width,
            building.height
        );


        /* edificio */

        ctx.fillStyle =
            building.color;

        ctx.fillRect(
            building.x,
            building.y,
            building.width,
            building.height
        );


        /* techo */

        ctx.fillStyle =
            "#4c382e";

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


        /* ventanas */

        ctx.fillStyle =
            "#b9d1cc";

        ctx.fillRect(
            building.x + 35,
            building.y + 40,
            45,
            45
        );

        ctx.fillRect(
            building.x +
            building.width -
            80,
            building.y + 40,
            45,
            45
        );


        /* puerta */

        ctx.fillStyle =
            "#4b352a";

        ctx.fillRect(
            building.door.x - 18,
            building.door.y - 45,
            36,
            55
        );


        /* cartel */

        ctx.fillStyle =
            "rgba(35,28,22,.78)";

        ctx.fillRect(
            building.x + 15,
            building.y +
            building.height +
            13,
            Math.min(
                building.width - 30,
                240
            ),
            28
        );


        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 13px Arial";

        ctx.fillText(
            building.name,
            building.x + 25,
            building.y +
            building.height +
            32
        );

    }

}


/* =========================================================
   NPC
========================================================= */

function drawNPC(
    npc
) {

    const bob =
        npc.activity === "walking"
            ? Math.sin(
                worldTime * 8 +
                npc.x
            ) * 2
            : 0;


    const x =
        npc.x;

    const y =
        npc.y + bob;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.22)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 23,
        19,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#3b3b3b";

    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(
        x - 5,
        y + 12
    );

    ctx.lineTo(
        x - 7,
        y + 27
    );

    ctx.moveTo(
        x + 5,
        y + 12
    );

    ctx.lineTo(
        x + 7,
        y + 27
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        npc.color;

    ctx.fillRect(
        x - 13,
        y - 5,
        26,
        25
    );


    /* brazos */

    ctx.strokeStyle =
        npc.color;

    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(
        x - 12,
        y
    );

    ctx.lineTo(
        x - 22,
        y + 13
    );

    ctx.moveTo(
        x + 12,
        y
    );

    ctx.lineTo(
        x + 22,
        y + 13
    );

    ctx.stroke();


    /* cabeza */

    ctx.fillStyle =
        "#d8a57e";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 17,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#35271f";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 21,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* nombre */

    ctx.font =
        "bold 11px Arial";

    ctx.fillStyle =
        "rgba(255,255,255,.9)";

    ctx.textAlign =
        "center";

    ctx.fillText(
        npc.name,
        x,
        y + 43
    );

    ctx.textAlign =
        "left";

}


/* =========================================================
   PEATONES
========================================================= */

function updatePedestrians() {

    for (
        const person
        of pedestrians
    ) {

        const dx =
            person.targetX -
            person.x;

        const dy =
            person.targetY -
            person.y;

        const d =
            Math.hypot(
                dx,
                dy
            );


        if (
            d < 8
        ) {

            const oldTargetX =
                person.targetX;

            person.targetX =
                person.x;

            person.targetY =
                person.y;

            setTimeout(
                () => {

                    if (
                        person.targetX ===
                        oldTargetX
                    ) {

                        person.targetX =
                            clamp(
                                Math.random() *
                                WORLD_WIDTH,
                                100,
                                WORLD_WIDTH - 100
                            );

                        person.targetY =
                            1380 +
                            Math.random() * 100;

                    }

                },
                300
            );

            continue;

        }


        const vx =
            dx / d;

        const vy =
            dy / d;


        person.x +=
            vx *
            person.speed;

        person.y +=
            vy *
            person.speed;

    }

}


function drawPedestrian(
    person
) {

    const walk =
        Math.sin(
            worldTime * 9 +
            person.x
        ) * 3;


    const x =
        person.x;

    const y =
        person.y +
        walk;


    ctx.fillStyle =
        "rgba(0,0,0,.2)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 23,
        17,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#333";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        x - 4,
        y + 10
    );

    ctx.lineTo(
        x - 7,
        y + 25
    );

    ctx.moveTo(
        x + 4,
        y + 10
    );

    ctx.lineTo(
        x + 7,
        y + 25
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        person.color;

    ctx.fillRect(
        x - 11,
        y - 5,
        22,
        22
    );


    /* cabeza */

    ctx.fillStyle =
        "#d6a27d";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 17,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelota ocasional */

    if (
        person.name === "Joven"
    ) {

        ctx.fillStyle =
            "#d7a63e";

        ctx.beginPath();

        ctx.arc(
            x + 24,
            y + 17,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   VEHÍCULOS
========================================================= */

function updateVehicles() {

    for (
        const vehicle
        of vehicles
    ) {

        vehicle.x +=
            vehicle.speed *
            vehicle.direction;


        if (
            vehicle.direction > 0 &&
            vehicle.x >
            WORLD_WIDTH + 100
        ) {

            vehicle.x = -150;

        }


        if (
            vehicle.direction < 0 &&
            vehicle.x <
            -150
        ) {

            vehicle.x =
                WORLD_WIDTH + 100;

        }

    }

}


function drawVehicle(
    vehicle
) {

    const x =
        vehicle.x;

    const y =
        vehicle.y;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.fillRect(
        x + 5,
        y + vehicle.height - 3,
        vehicle.width,
        8
    );


    if (
        vehicle.type ===
        "tractor"
    ) {

        /* ruedas */

        ctx.fillStyle =
            "#292929";

        ctx.beginPath();

        ctx.arc(
            x + 20,
            y + 36,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            x + 75,
            y + 35,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* carrocería */

        ctx.fillStyle =
            vehicle.color;

        ctx.fillRect(
            x + 18,
            y + 10,
            55,
            25
        );


        /* cabina */

        ctx.strokeStyle =
            "#30362c";

        ctx.lineWidth = 5;

        ctx.strokeRect(
            x + 45,
            y - 4,
            27,
            22
        );

        return;

    }


    /* auto */

    ctx.fillStyle =
        vehicle.color;

    ctx.fillRect(
        x,
        y + 8,
        vehicle.width,
        22
    );


    ctx.fillStyle =
        "#8fb2b5";

    ctx.fillRect(
        x + 12,
        y,
        27,
        15
    );


    ctx.fillRect(
        x + 43,
        y,
        12,
        15
    );


    /* ruedas */

    ctx.fillStyle =
        "#282828";

    ctx.beginPath();

    ctx.arc(
        x + 13,
        y + 30,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x + vehicle.width - 13,
        y + 30,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   OBJETOS
========================================================= */

function drawObjects() {

    for (
        const object
        of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        ctx.font =
            "26px Arial";


        let icon =
            "•";


        if (
            object.type ===
            "photo"
        ) {

            icon = "📷";

        }


        if (
            object.type ===
            "document"
        ) {

            icon = "📜";

        }


        if (
            object.type ===
            "bread"
        ) {

            icon = "🥖";

        }


        if (
            object.type ===
            "mate"
        ) {

            icon = "🧉";

        }


        ctx.fillText(
            icon,
            object.x,
            object.y
        );

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


    const x =
        player.x;

    const y =
        player.y +
        bob;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.28)";

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


    /* piernas */

    ctx.strokeStyle =
        "#30353b";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        x + 10,
        y + 25
    );

    ctx.lineTo(
        x + 8,
        y + 39
    );

    ctx.moveTo(
        x + 20,
        y + 25
    );

    ctx.lineTo(
        x + 22,
        y + 39
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        "#314b5e";

    ctx.fillRect(
        x,
        y,
        30,
        30
    );


    /* brazos */

    ctx.strokeStyle =
        "#314b5e";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        x + 3,
        y + 5
    );

    ctx.lineTo(
        x - 7,
        y + 20
    );

    ctx.moveTo(
        x + 27,
        y + 5
    );

    ctx.lineTo(
        x + 37,
        y + 20
    );

    ctx.stroke();


    /* cuello */

    ctx.fillStyle =
        "#d7a17b";

    ctx.fillRect(
        x + 10,
        y - 5,
        10,
        8
    );


    /* cabeza */

    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 12,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#2d241e";

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
   INTERIORES
========================================================= */

function enterBuilding(
    building
) {

    if (
        !building.interior
    ) {

        return;

    }


    currentInterior =
        building.interior;


    player.state =
        "interior";


    const interior =
        interiors[
            currentInterior
        ];


    player.x =
        interior.spawnX;

    player.y =
        interior.spawnY;


    camera.x = 0;

    camera.y = 0;


    document
        .getElementById(
            "interior-overlay"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "interior-title"
        )
        .textContent =
        interior.title;


    document
        .getElementById(
            "interior-subtitle"
        )
        .textContent =
        interior.subtitle;


    document
        .getElementById(
            "location-hud"
        )
        .textContent =
        interior.title;


    addXP(5);

}


/* =========================================================
   SALIR
========================================================= */

function exitBuilding() {

    const building =
        buildings.find(
            item =>
                item.interior ===
                currentInterior
        );


    if (!building) {

        currentInterior = null;

        player.state =
            "world";

        return;

    }


    currentInterior = null;

    player.state =
        "world";


    player.x =
        building.door.x -
        player.width / 2;

    player.y =
        building.door.y +
        25;


    document
        .getElementById(
            "interior-overlay"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "location-hud"
        )
        .textContent =
        "San Patricio del Chañar";

}


/* =========================================================
   DIBUJAR INTERIOR
========================================================= */

function drawInterior() {

    const interior =
        interiors[
            currentInterior
        ];


    if (!interior) {

        return;

    }


    ctx.fillStyle =
        interior.color;

    ctx.fillRect(
        0,
        0,
        interior.width,
        interior.height
    );


    /* paredes */

    ctx.fillStyle =
        "#604d3a";

    ctx.fillRect(
        0,
        0,
        interior.width,
        25
    );

    ctx.fillRect(
        0,
        0,
        25,
        interior.height
    );

    ctx.fillRect(
        interior.width - 25,
        0,
        25,
        interior.height
    );

    ctx.fillRect(
        0,
        interior.height - 25,
        interior.width,
        25
    );


    /* piso */

    ctx.strokeStyle =
        "rgba(75,53,37,.15)";

    ctx.lineWidth = 2;

    for (
        let x = 30;
        x < interior.width - 30;
        x += 45
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            30
        );

        ctx.lineTo(
            x,
            interior.height - 30
        );

        ctx.stroke();

    }


    /* objetos */

    for (
        const object
        of interior.objects
    ) {

        drawInteriorObject(
            object
        );

    }

}


/* =========================================================
   OBJETOS INTERIORES
========================================================= */

function drawInteriorObject(
    object
) {

    const x =
        object.x;

    const y =
        object.y;


    if (
        object.type ===
        "shelf"
    ) {

        ctx.fillStyle =
            "#65452f";

        ctx.fillRect(
            x - 65,
            y - 15,
            130,
            70
        );


        ctx.fillStyle =
            "#d2a858";

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            ctx.fillRect(
                x - 50 + i * 25,
                y,
                14,
                14
            );

        }

    }


    if (
        object.type ===
        "counter"
    ) {

        ctx.fillStyle =
            "#6d4931";

        ctx.fillRect(
            x - 120,
            y - 30,
            240,
            55
        );

    }


    if (
        object.type ===
        "table"
    ) {

        ctx.fillStyle =
            "#704b32";

        ctx.fillRect(
            x - 70,
            y - 35,
            140,
            70
        );

    }


    if (
        object.type ===
        "chair"
    ) {

        ctx.fillStyle =
            "#61442f";

        ctx.fillRect(
            x - 20,
            y - 20,
            40,
            45
        );

    }


    if (
        object.type ===
        "desk"
    ) {

        ctx.fillStyle =
            "#775337";

        ctx.fillRect(
            x - 45,
            y - 20,
            90,
            40
        );

    }


    if (
        object.type ===
        "console"
    ) {

        ctx.fillStyle =
            "#24292c";

        ctx.fillRect(
            x - 140,
            y - 45,
            280,
            90
        );


        ctx.fillStyle =
            "#83a99d";

        ctx.fillRect(
            x - 100,
            y - 25,
            55,
            30
        );

        ctx.fillRect(
            x - 20,
            y - 25,
            55,
            30
        );

        ctx.fillRect(
            x + 60,
            y - 25,
            35,
            30
        );

    }


    if (
        object.type ===
        "photoFrame"
    ) {

        ctx.fillStyle =
            "#5d432e";

        ctx.fillRect(
            x - 55,
            y - 45,
            110,
            90
        );


        ctx.fillStyle =
            "#ddd1b2";

        ctx.fillRect(
            x - 45,
            y - 35,
            90,
            70
        );


        ctx.fillStyle =
            "#7d8968";

        ctx.beginPath();

        ctx.moveTo(
            x - 40,
            y + 20
        );

        ctx.lineTo(
            x - 5,
            y - 10
        );

        ctx.lineTo(
            x + 15,
            y + 8
        );

        ctx.lineTo(
            x + 40,
            y - 25
        );

        ctx.lineTo(
            x + 40,
            y + 30
        );

        ctx.lineTo(
            x - 40,
            y + 30
        );

        ctx.closePath();

        ctx.fill();

    }


    if (
        object.type ===
        "tool"
    ) {

        ctx.strokeStyle =
            "#68492f";

        ctx.lineWidth = 7;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y - 40
        );

        ctx.lineTo(
            x,
            y + 40
        );

        ctx.stroke();


        ctx.lineWidth = 4;

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x + i * 7,
                y - 40
            );

            ctx.lineTo(
                x + i * 7,
                y - 52
            );

            ctx.stroke();

        }

    }


    if (
        object.type ===
        "door"
    ) {

        ctx.fillStyle =
            "#4b3326";

        ctx.fillRect(
            x - 35,
            y - 55,
            70,
            110
        );


        ctx.fillStyle =
            "#d6b15c";

        ctx.beginPath();

        ctx.arc(
            x + 18,
            y,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   INTERACCIÓN
========================================================= */

function interact() {

    if (
        currentInterior
    ) {

        interactInterior();

        return;

    }


    /* edificio */

    for (
        const building
        of buildings
    ) {

        const doorPoint = {

            x:
                building.door.x,

            y:
                building.door.y,

            width: 1,

            height: 1

        };


        if (
            distance(
                player,
                doorPoint
            ) < 85
        ) {

            enterBuilding(
                building
            );

            return;

        }

    }


    /* NPC */

    for (
        const npc
        of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 80
        ) {

            interactNPC(
                npc
            );

            return;

        }

    }


    /* objetos */

    for (
        const object
        of objects
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
            ) < 70
        ) {

            collectObject(
                object
            );

            return;

        }

    }


    /* nada */

    showSpeech(
        "San Patricio del Chañar",
        "No hay nada para hacer acá."
    );

    setTimeout(
        hideSpeech,
        1800
    );

}


/* =========================================================
   NPC INTERACCIÓN
========================================================= */

function interactNPC(
    npc
) {

    if (
        npc.id ===
        "pedro"
    ) {

        showDialogue(
            npc.name,
            npc.longText
        );


        if (
            !mission.active &&
            !mission.completed
        ) {

            mission.active =
                true;

            setMissionHUD();

            setTimeout(
                showMission,
                300
            );

        }

        return;

    }


    if (
        npc.id ===
        "panadero"
    ) {

        showDialogue(
            npc.name,
            npc.longText
        );

        setTimeout(
            () => {

                if (
                    player.money >= 100
                ) {

                    player.money -=
                        100;

                    addInventory(
                        "Pan casero"
                    );

                    addXP(10);

                    showSpeech(
                        "Roberto",
                        "Tomá. Recién salido del horno."
                    );

                } else {

                    showSpeech(
                        "Roberto",
                        "Hoy no te alcanza, vecino."
                    );

                }

            },
            900
        );

        return;

    }


    showDialogue(
        npc.name,
        npc.longText
    );

}


/* =========================================================
   INTERACCIÓN INTERIOR
========================================================= */

function interactInterior() {

    const interior =
        interiors[
            currentInterior
        ];


    /* puerta de salida */

    const exitObject =
        interior.objects.find(
            object =>
                object.type ===
                "door"
        );


    if (
        exitObject &&
        distance(
            player,
            exitObject
        ) < 90
    ) {

        exitBuilding();

        return;

    }


    /* acciones especiales */

    if (
        currentInterior ===
        "almacen"
    ) {

        if (
            player.money >= 100
        ) {

            player.money -=
                100;

            addInventory(
                "Pan casero"
            );

            addXP(10);

            showSpeech(
                "Almacén",
                "Compraste pan fresco."
            );

        } else {

            showSpeech(
                "Almacén",
                "No tenés suficiente dinero."
            );

        }

        return;

    }


    if (
        currentInterior ===
        "casa" ||
        currentInterior ===
        "casa2"
    ) {

        addInventory(
            "Mate compartido"
        );

        addXP(15);

        showSpeech(
            "Momento cotidiano",
            "Te sentaste a tomar unos mates."
        );

        return;

    }


    if (
        currentInterior ===
        "museo"
    ) {

        historyCount++;

        addXP(25);

        document
            .getElementById(
                "history-count"
            )
            .textContent =
            historyCount;

        document
            .getElementById(
                "history-panel"
            )
            .textContent =
            historyCount;

        showDialogue(
            "Museo",
            "Una fotografía puede ser una " +
            "puerta hacia la memoria del territorio."
        );

        return;

    }


    showSpeech(
        interior.title,
        "Podés recorrer este lugar."
    );

}


/* =========================================================
   COLECCIONAR
========================================================= */

function collectObject(
    object
) {

    object.collected =
        true;


    addInventory(
        object.name
    );


    addXP(15);


    if (
        object.type ===
        "photo"
    ) {

        const count =
            objects.filter(
                item =>
                    item.type ===
                    "photo" &&
                    item.collected
            ).length;


        document
            .getElementById(
                "photo-count"
            )
            .textContent =
            count;

    }


    if (
        mission.active &&
        object.type ===
        "photo"
    ) {

        mission.active =
            false;

        mission.completed =
            true;

        historyCount++;

        addXP(50);

        setMissionHUD();


        setTimeout(
            () => {

                showDialogue(
                    "MISIÓN COMPLETADA",
                    "Encontraste la fotografía. " +
                    "Tal vez este pequeño objeto " +
                    "ayude a reconstruir una parte " +
                    "de la memoria del pueblo."
                );

            },
            250
        );

    }

}


/* =========================================================
   INDICADOR DE INTERACCIÓN
========================================================= */

function updateInteractionHint() {

    const hint =
        document.getElementById(
            "interaction-hint"
        );

    const text =
        document.getElementById(
            "interaction-text"
        );


    let found = false;

    let message =
        "Interactuar";


    if (
        currentInterior
    ) {

        const interior =
            interiors[
                currentInterior
            ];

        const exitObject =
            interior.objects.find(
                object =>
                    object.type ===
                    "door"
            );


        if (
            exitObject &&
            distance(
                player,
                exitObject
            ) < 100
        ) {

            found = true;

            message =
                "Salir";

        }

    } else {

        for (
            const building
            of buildings
        ) {

            if (
                distance(
                    player,
                    building.door
                ) < 95
            ) {

                found = true;

                message =
                    "Entrar a " +
                    building.name;

                break;

            }

        }


        if (!found) {

            for (
                const npc
                of npcs
            ) {

                if (
                    distance(
                        player,
                        npc
                    ) < 90
                ) {

                    found = true;

                    message =
                        "Hablar con " +
                        npc.name;

                    break;

                }

            }

        }


        if (!found) {

            for (
                const object
                of objects
            ) {

                if (
                    !object.collected &&
                    distance(
                        player,
                        object
                    ) < 75
                ) {

                    found = true;

                    message =
                        "Recoger " +
                        object.name;

                    break;

                }

            }

        }

    }


    if (found) {

        text.textContent =
            message;

        hint.classList.remove(
            "hidden"
        );

    } else {

        hint.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   MINIMAPA
========================================================= */

function drawMinimap() {

    miniCtx.clearRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    const scaleX =
        minimap.width /
        WORLD_WIDTH;

    const scaleY =
        minimap.height /
        WORLD_HEIGHT;


    miniCtx.fillStyle =
        "#c9ad78";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* campos */

    miniCtx.fillStyle =
        "#999658";

    for (
        const field
        of fields
    ) {

        miniCtx.fillRect(
            field.x * scaleX,
            field.y * scaleY,
            field.width * scaleX,
            field.height * scaleY
        );

    }


    /* calles */

    miniCtx.fillStyle =
        "#8e7355";

    for (
        const road
        of roads
    ) {

        miniCtx.fillRect(
            road.x * scaleX,
            road.y * scaleY,
            road.width * scaleX,
            road.height * scaleY
        );

    }


    /* edificios */

    miniCtx.fillStyle =
        "#60483a";

    for (
        const building
        of buildings
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
        "#e33c32";

    miniCtx.beginPath();

    miniCtx.arc(
        player.x * scaleX,
        player.y * scaleY,
        4,
        0,
        Math.PI * 2
    );

    miniCtx.fill();


    /* NPC */

    miniCtx.fillStyle =
        "#ffffff";

    for (
        const npc
        of npcs
    ) {

        miniCtx.beginPath();

        miniCtx.arc(
            npc.x * scaleX,
            npc.y * scaleY,
            2,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    }

}


/* =========================================================
   ILUMINACIÓN
========================================================= */

function drawLighting() {

    worldTime +=
        0.0004;


    const darkness =
        (
            Math.sin(
                worldTime
            ) + 1
        ) / 2;


    ctx.fillStyle =
        `rgba(25,35,70,${
            darkness * .12
        })`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* =========================================================
   DIBUJAR
========================================================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.save();


    if (
        currentInterior
    ) {

        ctx.translate(
            -camera.x,
            -camera.y
        );


        drawInterior();

        drawPlayer();


    } else {

        ctx.translate(
            -camera.x,
            -camera.y
        );


        drawWorld();

        drawBuildings();

        drawObjects();


        for (
            const vehicle
            of vehicles
        ) {

            drawVehicle(
                vehicle
            );

        }


        for (
            const pedestrian
            of pedestrians
        ) {

            drawPedestrian(
                pedestrian
            );

        }


        for (
            const npc
            of npcs
        ) {

            drawNPC(
                npc
            );

        }


        drawPlayer();

        drawLighting();

    }


    ctx.restore();


    drawMinimap();

}


/* =========================================================
   INICIO
========================================================= */

let gameStarted =
    false;


document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        function() {

            gameStarted =
                true;


            document
                .getElementById(
                    "start-screen"
                )
                .classList
                .add("hidden");


            /* colocar cámara inmediatamente */

            updateCamera();

        }
    );


/* =========================================================
   LOOP
========================================================= */

function gameLoop() {

    if (
        gameStarted
    ) {

        updatePlayer();

        updateCamera();

        updatePedestrians();

        updateVehicles();

        updateInteractionHint();

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   ESTADO INICIAL
========================================================= */

updateInventory();

setMissionHUD();

gameLoop();
```
