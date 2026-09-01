/* =========================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 19.0
   PUEBLO VIVO
   PC + CELULAR
========================================================= */

"use strict";


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

const WORLD_WIDTH = 5200;
const WORLD_HEIGHT = 3600;


/* =========================================================
   CONFIGURACIÓN
========================================================= */

let gameStarted = false;

let currentBuilding = null;

let worldMinutes = 8 * 60;

let lastTime = 0;

let toastTimer = 0;

let speechTimer = 0;


/* =========================================================
   PLAYER
========================================================= */

const player = {

    x: 2550,

    y: 1650,

    width: 28,

    height: 42,

    speed: 210,

    moving: false,

    direction: "down",

    animation: 0,

    mate: false,

    money: 150,

    bread: 0

};


/* =========================================================
   CAMERA
========================================================= */

const camera = {

    x: 0,

    y: 0,

    smooth: 0.12

};


/* =========================================================
   TECLADO
========================================================= */

const keys = {};


document.addEventListener(
    "keydown",
    event => {

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

    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;

    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =========================================================
   CALLES
   LOS VEHÍCULOS SOLO PUEDEN CIRCULAR AQUÍ
========================================================= */

const roads = [

    {
        x: 0,
        y: 1480,
        width: WORLD_WIDTH,
        height: 130,
        type: "avenue"
    },

    {
        x: 0,
        y: 2050,
        width: WORLD_WIDTH,
        height: 110,
        type: "street"
    },

    {
        x: 1050,
        y: 0,
        width: 120,
        height: WORLD_HEIGHT,
        type: "street"
    },

    {
        x: 2450,
        y: 0,
        width: 130,
        height: WORLD_HEIGHT,
        type: "avenue"
    },

    {
        x: 3650,
        y: 0,
        width: 120,
        height: WORLD_HEIGHT,
        type: "street"
    },

    {
        x: 4300,
        y: 800,
        width: 900,
        height: 95,
        type: "rural"
    },

    {
        x: 800,
        y: 2750,
        width: 3500,
        height: 100,
        type: "rural"
    }

];


/* =========================================================
   EDIFICIOS
========================================================= */

const buildings = [

    {
        id: "panaderia",

        x: 1750,
        y: 1280,

        width: 300,
        height: 230,

        type: "bakery",

        name: "PANADERÍA EL CHAÑAR",

        color: "#c98c5d",

        interior: true,

        locked: false
    },


    {
        id: "radio",

        x: 2750,
        y: 1250,

        width: 350,
        height: 250,

        type: "radio",

        name: "RADIO OCARINA",

        color: "#6c7567",

        interior: true,

        locked: false
    },


    {
        id: "municipalidad",

        x: 3150,
        y: 1220,

        width: 360,
        height: 260,

        type: "government",

        name: "MUNICIPALIDAD",

        color: "#a99b80",

        interior: true,

        locked: true
    },


    {
        id: "casa1",

        x: 1350,
        y: 1000,

        width: 230,
        height: 170,

        type: "house",

        name: "Casa de Rosa",

        color: "#a86f52",

        interior: true,

        locked: false
    },


    {
        id: "casa2",

        x: 3550,
        y: 1080,

        width: 250,
        height: 180,

        type: "house",

        name: "Casa de Don Pedro",

        color: "#88715e",

        interior: true,

        locked: false
    },


    {
        id: "club",

        x: 3150,
        y: 2350,

        width: 600,

        height: 430,

        type: "stadium",

        name: "CLUB SOCIAL Y DEPORTIVO",

        color: "#7d654f",

        interior: true,

        locked: false
    },


    {
        id: "almacen",

        x: 750,
        y: 1900,

        width: 260,

        height: 190,

        type: "store",

        name: "ALMACÉN DE LA ESQUINA",

        color: "#92704f",

        interior: true,

        locked: false
    },


    {
        id: "escuela",

        x: 700,
        y: 1150,

        width: 390,

        height: 250,

        type: "school",

        name: "ESCUELA",

        color: "#b27d59",

        interior: true,

        locked: true
    }

];


/* =========================================================
   CHACRAS
========================================================= */

const chacras = [

    {
        x: 100,
        y: 500,
        width: 850,
        height: 550
    },

    {
        x: 3800,
        y: 350,
        width: 1150,
        height: 500
    },

    {
        x: 100,
        y: 3000,
        width: 900,
        height: 450
    },

    {
        x: 4000,
        y: 2850,
        width: 1000,
        height: 500
    }

];


/* =========================================================
   VIÑEDOS
========================================================= */

const vineyards = [

    {
        x: 200,
        y: 600,
        rows: 11,
        cols: 18
    },

    {
        x: 3900,
        y: 420,
        rows: 10,
        cols: 17
    },

    {
        x: 4200,
        y: 2900,
        rows: 10,
        cols: 16
    }

];


/* =========================================================
   RÍO
   ALEJADO DEL CASCO URBANO
========================================================= */

const river = {

    x: 0,

    y: 3350,

    width: WORLD_WIDTH,

    height: 250

};


/* =========================================================
   CANALES
========================================================= */

const canals = [

    {
        x: 0,
        y: 920,
        width: 5200,
        height: 35
    },

    {
        x: 1250,
        y: 0,
        width: 30,
        height: 3600
    },

    {
        x: 4050,
        y: 850,
        width: 30,
        height: 2600
    }

];


/* =========================================================
   ÁRBOLES
========================================================= */

const trees = [];

function generateTrees() {

    for (
        let i = 0;
        i < 220;
        i++
    ) {

        const x =
            100 +
            Math.random() *
            (WORLD_WIDTH - 200);

        const y =
            100 +
            Math.random() *
            (WORLD_HEIGHT - 400);

        if (
            insideAnyBuilding(x, y)
        ) {

            continue;

        }

        if (
            insideRoad(x, y)
        ) {

            continue;

        }

        trees.push({
            x,
            y,
            size:
                0.7 +
                Math.random() * 0.7
        });

    }

}


/* =========================================================
   FLORES
========================================================= */

const flowers = [];

function generateFlowers() {

    for (
        let i = 0;
        i < 320;
        i++
    ) {

        const x =
            Math.random() *
            WORLD_WIDTH;

        const y =
            Math.random() *
            3300;

        if (
            insideRoad(x, y) ||
            insideAnyBuilding(x, y)
        ) {

            continue;

        }

        flowers.push({
            x,
            y,
            type:
                Math.floor(
                    Math.random() * 4
                )
        });

    }

}


/* =========================================================
   NPC
========================================================= */

const npcs = [

    {
        name: "Don Pedro",

        x: 3460,
        y: 1350,

        role: "Vecino",

        color: "#52605a",

        activity: "mate",

        dialogue: [

            "Buen día, vecino.",

            "Acá nos conocemos casi todos.",

            "Si querés conocer Chañar, caminá. No te quedes mirando solamente.",

            "Hay historias que no aparecen en ningún cartel."
        ],

        mission: true

    },


    {
        name: "Rosa",

        x: 1450,
        y: 1250,

        role: "Panadera",

        color: "#9b6547",

        activity: "work",

        dialogue: [

            "Buen día. ¿Pan calentito?",

            "Recién salieron las tortas fritas.",

            "A la mañana el pueblo empieza por acá.",

            "Llevate algo para el mate."
        ]

    },


    {
        name: "Miguel",

        x: 2200,
        y: 1500,

        role: "Trabajador rural",

        color: "#596d45",

        activity: "work",

        dialogue: [

            "¿Venís de la chacra?",

            "Por acá el agua vale oro.",

            "Entre canales, chacras y viñedos se armó buena parte de la historia productiva.",

            "No todo lo que parece desierto está seco."
        ]

    },


    {
        name: "María",

        x: 2550,
        y: 1700,

        role: "Vecina",

        color: "#754d58",

        activity: "walk",

        dialogue: [

            "Hola.",

            "Qué lindo día para caminar.",

            "¿Ya conociste la plaza?",

            "Después pasá por la radio."
        ]

    },


    {
        name: "Julián",

        x: 2950,
        y: 1450,

        role: "Comunicador",

        color: "#3e5362",

        activity: "radio",

        dialogue: [

            "La radio tiene una historia larga en los pueblos.",

            "Acá la gente llama, pregunta, saluda y cuenta cosas.",

            "Un pueblo también se construye con las historias que cuenta."
        ]

    },


    {
        name: "Ana",

        x: 900,
        y: 1550,

        role: "Docente",

        color: "#8a694c",

        activity: "walk",

        dialogue: [

            "Buen día.",

            "Los chicos conocen el pueblo de una manera distinta.",

            "Preguntales por sus lugares favoritos."
        ]

    }

];


/* =========================================================
   ANIMALES
========================================================= */

const animals = [

    {
        type: "dog",
        x: 1250,
        y: 1900,
        vx: 20,
        vy: 0
    },

    {
        type: "dog",
        x: 3300,
        y: 1600,
        vx: -15,
        vy: 0
    },

    {
        type: "cat",
        x: 1550,
        y: 1100,
        vx: 8,
        vy: 4
    },

    {
        type: "horse",
        x: 4700,
        y: 3000,
        vx: 0,
        vy: 0
    }

];


/* =========================================================
   VEHÍCULOS
========================================================= */

const vehicles = [

    {
        type: "car",
        x: 400,
        y: 1545,
        speed: 110,
        direction: 1
    },

    {
        type: "car",
        x: 2200,
        y: 2105,
        speed: 85,
        direction: -1
    },

    {
        type: "tractor",
        x: 700,
        y: 2800,
        speed: 45,
        direction: 1
    },

    {
        type: "tractor",
        x: 4100,
        y: 845,
        speed: 42,
        direction: -1
    }

];


/* =========================================================
   OBJETOS
========================================================= */

const objects = [

    {
        type: "photo",
        name: "Fotografía antigua",
        x: 820,
        y: 1300,
        collected: false
    },

    {
        type: "document",
        name: "Documento de la comunidad",
        x: 3050,
        y: 1350,
        collected: false
    },

    {
        type: "history",
        name: "Historia del Chañar",
        x: 2800,
        y: 1350,
        collected: false
    },

    {
        type: "mate",
        name: "Mate",
        x: 1500,
        y: 1400,
        collected: false
    }

];


/* =========================================================
   INVENTARIO
========================================================= */

const inventory = [];


/* =========================================================
   MISIÓN
========================================================= */

const mission = {

    stage: 0,

    title:
        "Los primeros secretos",

    description:
        "Hablá con Don Pedro y descubrí qué historia guarda el pueblo.",

    completed:
        false

};


/* =========================================================
   UTILIDADES
========================================================= */

function distance(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function insideRoad(x, y) {

    return roads.some(
        road =>

            x >= road.x &&
            x <= road.x + road.width &&
            y >= road.y &&
            y <= road.y + road.height
    );

}


function insideAnyBuilding(x, y) {

    return buildings.some(
        building =>

            x >= building.x &&
            x <= building.x + building.width &&
            y >= building.y &&
            y <= building.y + building.height
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
   MOVIMIENTO PLAYER
========================================================= */

function updatePlayer(dt) {

    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -= 1;

        player.direction =
            "up";

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy += 1;

        player.direction =
            "down";

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -= 1;

        player.direction =
            "left";

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx += 1;

        player.direction =
            "right";

    }


    if (
        joystick.dx ||
        joystick.dy
    ) {

        dx += joystick.dx;
        dy += joystick.dy;

    }


    const magnitude =
        Math.hypot(dx, dy);


    if (
        magnitude > 0
    ) {

        dx /= magnitude;
        dy /= magnitude;

        player.moving =
            true;

        player.animation +=
            dt * 8;

    } else {

        player.moving =
            false;

    }


    const nextX =
        player.x +
        dx *
        player.speed *
        dt;


    const nextY =
        player.y +
        dy *
        player.speed *
        dt;


    if (
        canPlayerMove(
            nextX,
            player.y
        )
    ) {

        player.x =
            nextX;

    }


    if (
        canPlayerMove(
            player.x,
            nextY
        )
    ) {

        player.y =
            nextY;

    }


    player.x =
        Math.max(
            20,
            Math.min(
                WORLD_WIDTH - 20,
                player.x
            )
        );


    player.y =
        Math.max(
            20,
            Math.min(
                WORLD_HEIGHT - 280,
                player.y
            )
        );

}


function canPlayerMove(x, y) {

    const body = {

        x: x - 12,
        y: y - 18,

        width: 24,
        height: 36

    };


    for (
        const building
        of buildings
    ) {

        if (
            collision(
                body,
                building
            )
        ) {

            return false;

        }

    }


    /* RÍO */

    if (
        y >
        river.y - 10
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   CÁMARA
========================================================= */

function updateCamera() {

    const targetX =
        player.x -
        window.innerWidth / 2;

    const targetY =
        player.y -
        window.innerHeight / 2;


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
                window.innerWidth,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT -
                window.innerHeight,
                camera.y
            )
        );

}


/* =========================================================
   MUNDO
========================================================= */

function drawWorld() {

    const w =
        window.innerWidth;

    const h =
        window.innerHeight;


    ctx.fillStyle =
        "#b9a070";

    ctx.fillRect(
        camera.x,
        camera.y,
        w,
        h
    );


    drawRelief();

    drawChacras();

    drawCanals();

    drawRiver();

    drawRoads();

    drawVineyards();

    drawFlowers();

    drawTrees();

    drawBuildings();

    drawAnimals();

    drawVehicles();

    drawNPCs();

    drawObjects();

    drawPlayer();

}


/* =========================================================
   RELIEVE
========================================================= */

function drawRelief() {

    ctx.fillStyle =
        "#927d63";

    ctx.beginPath();

    ctx.moveTo(
        0,
        650
    );

    ctx.lineTo(
        600,
        390
    );

    ctx.lineTo(
        1200,
        620
    );

    ctx.lineTo(
        1900,
        370
    );

    ctx.lineTo(
        2600,
        650
    );

    ctx.lineTo(
        3400,
        420
    );

    ctx.lineTo(
        4200,
        650
    );

    ctx.lineTo(
        5200,
        390
    );

    ctx.lineTo(
        5200,
        0
    );

    ctx.lineTo(
        0,
        0
    );

    ctx.closePath();

    ctx.fill();


    ctx.fillStyle =
        "rgba(70,58,45,.15)";

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        ctx.beginPath();

        ctx.ellipse(
            i * 320,
            720 + Math.sin(i) * 40,
            250,
            90,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   CHACRAS
========================================================= */

function drawChacras() {

    for (
        const c
        of chacras
    ) {

        ctx.fillStyle =
            "#9c875e";

        ctx.fillRect(
            c.x,
            c.y,
            c.width,
            c.height
        );


        ctx.strokeStyle =
            "rgba(70,80,45,.35)";

        ctx.lineWidth =
            2;


        for (
            let y = c.y + 20;
            y < c.y + c.height;
            y += 30
        ) {

            ctx.beginPath();

            ctx.moveTo(
                c.x,
                y
            );

            ctx.lineTo(
                c.x + c.width,
                y
            );

            ctx.stroke();

        }

    }

}


/* =========================================================
   CANALES
========================================================= */

function drawCanals() {

    for (
        const canal
        of canals
    ) {

        ctx.fillStyle =
            "#527f87";

        ctx.fillRect(
            canal.x,
            canal.y,
            canal.width,
            canal.height
        );


        ctx.fillStyle =
            "rgba(255,255,255,.18)";


        if (
            canal.width >
            canal.height
        ) {

            for (
                let x = canal.x;
                x < canal.x + canal.width;
                x += 90
            ) {

                ctx.fillRect(
                    x,
                    canal.y + 8,
                    45,
                    3
                );

            }

        }

    }

}


/* =========================================================
   RÍO
========================================================= */

function drawRiver() {

    ctx.fillStyle =
        "#426f7e";

    ctx.fillRect(
        river.x,
        river.y,
        river.width,
        river.height
    );


    ctx.fillStyle =
        "rgba(255,255,255,.14)";


    for (
        let x = 0;
        x < WORLD_WIDTH;
        x += 150
    ) {

        ctx.fillRect(
            x,
            river.y + 35,
            75,
            3
        );

        ctx.fillRect(
            x + 60,
            river.y + 120,
            90,
            3
        );

    }


    ctx.fillStyle =
        "#d7c79e";

    ctx.font =
        "24px Georgia";

    ctx.fillText(
        "RÍO NEUQUÉN",
        2200,
        river.y + 140
    );

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
            road.type === "rural"
                ? "#917653"
                : "#625b50";


        ctx.fillRect(
            road.x,
            road.y,
            road.width,
            road.height
        );


        if (
            road.type !==
            "rural"
        ) {

            ctx.strokeStyle =
                "#d8c58b";

            ctx.lineWidth =
                3;

            ctx.setLineDash(
                [25, 20]
            );


            if (
                road.width >
                road.height
            ) {

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

}


/* =========================================================
   VIÑEDOS
========================================================= */

function drawVineyards() {

    for (
        const vineyard
        of vineyards
    ) {

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
                    col * 34;

                const y =
                    vineyard.y +
                    row * 34;


                ctx.strokeStyle =
                    "#53643b";

                ctx.lineWidth =
                    3;


                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y
                );

                ctx.lineTo(
                    x,
                    y + 22
                );

                ctx.stroke();


                ctx.fillStyle =
                    "#46683d";

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    8,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }

    }

}


/* =========================================================
   FLORES
========================================================= */

function drawFlowers() {

    for (
        const flower
        of flowers
    ) {

        let petal =
            "#d6b5a1";

        if (
            flower.type === 1
        )
            petal =
                "#e1c36d";

        if (
            flower.type === 2
        )
            petal =
                "#c79ab8";

        if (
            flower.type === 3
        )
            petal =
                "#f0e6ca";


        ctx.fillStyle =
            petal;


        ctx.beginPath();

        ctx.arc(
            flower.x,
            flower.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   ÁRBOLES
========================================================= */

function drawTrees() {

    for (
        const tree
        of trees
    ) {

        ctx.fillStyle =
            "#63452f";

        ctx.fillRect(
            tree.x - 6,
            tree.y,
            12,
            34
        );


        ctx.fillStyle =
            "#49673c";

        ctx.beginPath();

        ctx.arc(
            tree.x,
            tree.y - 5,
            27 * tree.size,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#5b7546";

        ctx.beginPath();

        ctx.arc(
            tree.x + 18,
            tree.y + 5,
            18 * tree.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   EDIFICIOS
========================================================= */

function drawBuildings() {

    for (
        const b
        of buildings
    ) {

        /* sombra */

        ctx.fillStyle =
            "rgba(0,0,0,.22)";

        ctx.fillRect(
            b.x + 12,
            b.y + 15,
            b.width,
            b.height
        );


        /* edificio */

        ctx.fillStyle =
            b.color;

        ctx.fillRect(
            b.x,
            b.y,
            b.width,
            b.height
        );


        /* techo */

        ctx.fillStyle =
            "#4b3b32";


        ctx.beginPath();

        ctx.moveTo(
            b.x - 15,
            b.y
        );

        ctx.lineTo(
            b.x +
            b.width / 2,
            b.y - 65
        );

        ctx.lineTo(
            b.x +
            b.width + 15,
            b.y
        );

        ctx.closePath();

        ctx.fill();


        /* ventanas */

        ctx.fillStyle =
            "#b9d1cc";


        const windowCount =
            Math.max(
                2,
                Math.floor(
                    b.width / 120
                )
            );


        for (
            let i = 0;
            i < windowCount;
            i++
        ) {

            const wx =
                b.x +
                30 +
                i * 100;


            ctx.fillRect(
                wx,
                b.y + 45,
                42,
                48
            );

        }


        /* puerta */

        ctx.fillStyle =
            "#49372d";

        ctx.fillRect(
            b.x +
            b.width / 2 -
            22,
            b.y +
            b.height -
            72,
            44,
            72
        );


        /* CARTEL */

        ctx.fillStyle =
            "#f3dfb6";

        ctx.font =
            "bold 15px Georgia";

        ctx.fillText(
            b.name,
            b.x,
            b.y +
            b.height +
            25
        );


        /* detalles */

        if (
            b.type ===
            "bakery"
        ) {

            drawBakeryDetails(b);

        }


        if (
            b.type ===
            "radio"
        ) {

            drawRadioDetails(b);

        }


        if (
            b.type ===
            "stadium"
        ) {

            drawStadium(b);

        }

    }

}


/* =========================================================
   PANADERÍA
========================================================= */

function drawBakeryDetails(b) {

    ctx.fillStyle =
        "#f0d5a4";

    ctx.fillRect(
        b.x + 90,
        b.y - 45,
        120,
        28
    );


    ctx.fillStyle =
        "#7b4d31";

    ctx.font =
        "bold 14px Georgia";

    ctx.fillText(
        "PAN",
        b.x + 135,
        b.y - 25
    );

}


/* =========================================================
   RADIO
========================================================= */

function drawRadioDetails(b) {

    ctx.strokeStyle =
        "#4c4035";

    ctx.lineWidth =
        5;


    ctx.beginPath();

    ctx.moveTo(
        b.x +
        b.width - 50,
        b.y
    );

    ctx.lineTo(
        b.x +
        b.width - 20,
        b.y - 170
    );

    ctx.stroke();


    ctx.fillStyle =
        "#403d35";

    ctx.fillRect(
        b.x +
        b.width - 30,
        b.y - 175,
        20,
        10
    );

}


/* =========================================================
   ESTADIO
========================================================= */

function drawStadium(b) {

    const fieldX =
        b.x + 65;

    const fieldY =
        b.y + 80;

    const fieldW =
        b.width - 130;

    const fieldH =
        b.height - 130;


    ctx.fillStyle =
        "#477347";

    ctx.fillRect(
        fieldX,
        fieldY,
        fieldW,
        fieldH
    );


    ctx.strokeStyle =
        "#e4e5ce";

    ctx.lineWidth =
        3;

    ctx.strokeRect(
        fieldX,
        fieldY,
        fieldW,
        fieldH
    );


    ctx.beginPath();

    ctx.moveTo(
        fieldX +
        fieldW / 2,
        fieldY
    );

    ctx.lineTo(
        fieldX +
        fieldW / 2,
        fieldY +
        fieldH
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        fieldX +
        fieldW / 2,
        fieldY +
        fieldH / 2,
        45,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /* tribunas */

    ctx.fillStyle =
        "#54483e";

    ctx.fillRect(
        b.x + 15,
        b.y + 45,
        35,
        b.height - 70
    );

    ctx.fillRect(
        b.x + b.width - 50,
        b.y + 45,
        35,
        b.height - 70
    );

}


/* =========================================================
   PERSONAS
========================================================= */

function drawNPCs() {

    for (
        const npc
        of npcs
    ) {

        const bob =
            npc.activity === "walk"
                ? Math.sin(
                    performance.now() / 180
                ) * 2
                : 0;


        drawPerson(
            npc.x,
            npc.y + bob,
            npc.color,
            npc.activity
        );


        ctx.fillStyle =
            "#fff";

        ctx.font =
            "12px Georgia";

        ctx.fillText(
            npc.name,
            npc.x - 30,
            npc.y + 38
        );


        if (
            npc.mission &&
            !mission.completed
        ) {

            ctx.fillStyle =
                "#f0c84b";

            ctx.font =
                "bold 24px Arial";

            ctx.fillText(
                "!",
                npc.x - 5,
                npc.y - 55
            );

        }

    }

}


/* =========================================================
   FIGURA HUMANA
========================================================= */

function drawPerson(
    x,
    y,
    clothes,
    activity
) {

    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.22)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 28,
        18,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#3d3b37";

    ctx.lineWidth =
        6;


    ctx.beginPath();

    ctx.moveTo(
        x - 5,
        y + 10
    );

    ctx.lineTo(
        x - 8,
        y + 29
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x + 5,
        y + 10
    );

    ctx.lineTo(
        x + 8,
        y + 29
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        clothes;

    ctx.fillRect(
        x - 10,
        y - 3,
        20,
        20
    );


    /* brazos */

    ctx.strokeStyle =
        clothes;

    ctx.lineWidth =
        5;


    ctx.beginPath();

    ctx.moveTo(
        x - 8,
        y
    );

    ctx.lineTo(
        x - 18,
        y + 13
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x + 8,
        y
    );

    ctx.lineTo(
        x + 18,
        y + 13
    );

    ctx.stroke();


    /* cabeza */

    ctx.fillStyle =
        "#d39d79";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 15,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#352820";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 20,
        10,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* herramienta */

    if (
        activity === "work"
    ) {

        ctx.strokeStyle =
            "#624a36";

        ctx.lineWidth =
            3;

        ctx.beginPath();

        ctx.moveTo(
            x + 17,
            y + 10
        );

        ctx.lineTo(
            x + 26,
            y - 8
        );

        ctx.stroke();

    }


    /* mate */

    if (
        activity === "mate"
    ) {

        ctx.fillStyle =
            "#704f38";

        ctx.beginPath();

        ctx.arc(
            x + 20,
            y + 8,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   ANIMALES
========================================================= */

function drawAnimals() {

    for (
        const animal
        of animals
    ) {

        animal.x +=
            animal.vx *
            0.016;

        animal.y +=
            animal.vy *
            0.016;


        if (
            animal.type ===
            "horse"
        ) {

            drawHorse(
                animal.x,
                animal.y
            );

        } else {

            drawSmallAnimal(
                animal.x,
                animal.y,
                animal.type
            );

        }

    }

}


function drawSmallAnimal(
    x,
    y,
    type
) {

    ctx.fillStyle =
        type === "cat"
            ? "#66574c"
            : "#704f3b";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        20,
        11,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x + 17,
        y - 4,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#48362b";

    ctx.lineWidth =
        3;


    ctx.beginPath();

    ctx.moveTo(
        x - 17,
        y
    );

    ctx.lineTo(
        x - 28,
        y - 8
    );

    ctx.stroke();

}


function drawHorse(
    x,
    y
) {

    ctx.fillStyle =
        "#6b4b36";

    ctx.fillRect(
        x - 25,
        y - 20,
        55,
        35
    );


    ctx.beginPath();

    ctx.arc(
        x + 35,
        y - 23,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#493428";

    ctx.lineWidth =
        5;


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x - 18 + i * 15,
            y + 10
        );

        ctx.lineTo(
            x - 18 + i * 15,
            y + 35
        );

        ctx.stroke();

    }

}


/* =========================================================
   VEHÍCULOS
========================================================= */

function drawVehicles() {

    for (
        const v
        of vehicles
    ) {

        v.x +=
            v.speed *
            v.direction *
            0.016;


        if (
            v.x >
            WORLD_WIDTH + 100
        ) {

            v.x = -100;

        }


        if (
            v.x <
            -100
        ) {

            v.x =
                WORLD_WIDTH + 100;

        }


        if (
            v.type ===
            "tractor"
        ) {

            drawTractor(
                v.x,
                v.y,
                v.direction
            );

        } else {

            drawCar(
                v.x,
                v.y,
                v.direction
            );

        }

    }

}


/* =========================================================
   AUTO
========================================================= */

function drawCar(
    x,
    y,
    direction
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    if (
        direction < 0
    ) {

        ctx.scale(
            -1,
            1
        );

    }


    ctx.fillStyle =
        "#303b45";

    ctx.fillRect(
        -38,
        -20,
        76,
        38
    );


    ctx.fillStyle =
        "#a7c0c3";

    ctx.fillRect(
        -18,
        -17,
        30,
        17
    );


    ctx.fillStyle =
        "#191919";


    ctx.beginPath();

    ctx.arc(
        -24,
        20,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        25,
        20,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   TRACTOR
========================================================= */

function drawTractor(
    x,
    y,
    direction
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );


    if (
        direction < 0
    ) {

        ctx.scale(
            -1,
            1
        );

    }


    /* ruedas */

    ctx.fillStyle =
        "#242323";


    ctx.beginPath();

    ctx.arc(
        -25,
        15,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        30,
        19,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* carrocería */

    ctx.fillStyle =
        "#b45c31";

    ctx.fillRect(
        -25,
        -5,
        58,
        30
    );


    /* cabina */

    ctx.fillStyle =
        "#7d432d";

    ctx.fillRect(
        -2,
        -35,
        30,
        30
    );


    /* vidrio */

    ctx.fillStyle =
        "#9ab7b8";

    ctx.fillRect(
        3,
        -31,
        23,
        18
    );


    /* capó */

    ctx.fillStyle =
        "#c16b35";

    ctx.fillRect(
        -48,
        -2,
        27,
        18
    );


    /* escape */

    ctx.strokeStyle =
        "#333";

    ctx.lineWidth =
        4;

    ctx.beginPath();

    ctx.moveTo(
        -38,
        -2
    );

    ctx.lineTo(
        -38,
        -30
    );

    ctx.stroke();


    ctx.restore();

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
        )
            continue;


        let symbol =
            "◆";


        if (
            object.type ===
            "photo"
        )
            symbol = "▣";


        if (
            object.type ===
            "document"
        )
            symbol = "▤";


        if (
            object.type ===
            "mate"
        )
            symbol = "●";


        ctx.fillStyle =
            "#f2d18a";

        ctx.font =
            "22px Arial";

        ctx.fillText(
            symbol,
            object.x,
            object.y
        );

    }

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer() {

    drawPerson(
        player.x,
        player.y,
        "#304d62",
        player.moving
            ? "walk"
            : "idle"
    );

}


/* =========================================================
   INTERACCIÓN
========================================================= */

function interact() {

    if (
        !gameStarted
    )
        return;


    /* NPC */

    let closestNPC =
        null;

    let npcDistance =
        Infinity;


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
            d < npcDistance
        ) {

            closestNPC =
                npc;

            npcDistance =
                d;

        }

    }


    if (
        closestNPC &&
        npcDistance < 90
    ) {

        talkToNPC(
            closestNPC
        );

        return;

    }


    /* EDIFICIO */

    for (
        const building
        of buildings
    ) {

        const center = {

            x:
                building.x +
                building.width / 2,

            y:
                building.y +
                building.height / 2

        };


        if (
            distance(
                player,
                center
            ) < 170
        ) {

            enterBuilding(
                building
            );

            return;

        }

    }


    /* OBJETOS */

    for (
        const object
        of objects
    ) {

        if (
            object.collected
        )
            continue;


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


    showToast(
        "No hay nada para interactuar acá."
    );

}


/* =========================================================
   NPC
========================================================= */

function talkToNPC(npc) {

    const text =
        npc.dialogue[
            Math.floor(
                Math.random() *
                npc.dialogue.length
            )
        ];


    showDialogue(
        npc.name,
        text
    );


    showSpeech(
        npc,
        text
    );


    if (
        npc.mission &&
        mission.stage === 0
    ) {

        mission.stage =
            1;

        mission.description =
            "Encontrá una fotografía antigua y llevá la memoria del pueblo un paso más adelante.";

        setMissionHUD();

        setTimeout(
            showMission,
            350
        );

    }

}


/* =========================================================
   DIALOGO
========================================================= */

function showDialogue(
    name,
    text
) {

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
        text;


    document
        .getElementById(
            "dialogue"
        )
        .classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   GLOBO
========================================================= */

function showSpeech(
    npc,
    text
) {

    const bubble =
        document.getElementById(
            "speech-bubble"
        );


    bubble.textContent =
        text;


    const sx =
        npc.x -
        camera.x;


    const sy =
        npc.y -
        camera.y;


    bubble.style.left =
        Math.max(
            10,
            Math.min(
                window.innerWidth - 280,
                sx
            )
        ) +
        "px";


    bubble.style.top =
        Math.max(
            10,
            sy - 80
        ) +
        "px";


    bubble.classList.remove(
        "hidden"
    );


    clearTimeout(
        speechTimer
    );


    speechTimer =
        setTimeout(
            () => {

                bubble.classList.add(
                    "hidden"
                );

            },
            4000
        );

}


/* =========================================================
   EDIFICIOS / INTERIORES
========================================================= */

function enterBuilding(
    building
) {

    if (
        building.locked
    ) {

        showToast(
            "Todavía no podés entrar. Primero descubrí más del pueblo."
        );

        return;

    }


    currentBuilding =
        building;


    document
        .getElementById(
            "interior-title"
        )
        .textContent =
        building.name;


    const content =
        document.getElementById(
            "interior-content"
        );


    content.innerHTML =
        "";


    drawInteriorHTML(
        content,
        building
    );


    document
        .getElementById(
            "interior-panel"
        )
        .classList
        .remove(
            "hidden"
        );

}


function drawInteriorHTML(
    content,
    building
) {

    if (
        building.type ===
        "bakery"
    ) {

        content.innerHTML = `

            <div class="interior-object"
                 style="
                 position:absolute;
                 left:15%;
                 top:25%;
                 font-size:60px;">
                 🍞
            </div>

            <div style="
                 position:absolute;
                 left:35%;
                 top:20%;
                 font-size:22px;">
                 Horno
            </div>

            <div style="
                 position:absolute;
                 left:65%;
                 top:40%;
                 font-size:55px;">
                 🥖
            </div>

            <div style="
                 position:absolute;
                 left:30%;
                 bottom:20%;
                 font-size:20px;">
                 Pan recién horneado
            </div>

            <button
                onclick="buyBread()"
                style="
                position:absolute;
                bottom:20px;
                left:20px;
                padding:12px 20px;">
                Comprar pan — $30
            </button>

        `;

    }


    else if (
        building.type ===
        "radio"
    ) {

        content.innerHTML = `

            <div style="
                 position:absolute;
                 left:15%;
                 top:25%;
                 font-size:70px;">
                 🎙️
            </div>

            <div style="
                 position:absolute;
                 left:50%;
                 top:30%;
                 font-size:60px;">
                 📻
            </div>

            <div style="
                 position:absolute;
                 left:30%;
                 bottom:20%;
                 font-size:20px;">
                 Estudio de radio
            </div>

            <button
                onclick="radioInteraction()"
                style="
                position:absolute;
                bottom:20px;
                left:20px;
                padding:12px 20px;">
                Escuchar la radio
            </button>

        `;

    }


    else if (
        building.type ===
        "stadium"
    ) {

        content.innerHTML = `

            <div style="
                 position:absolute;
                 left:10%;
                 top:20%;
                 width:80%;
                 height:55%;
                 background:#4b8248;
                 border:4px solid white;">

                <div style="
                    position:absolute;
                    left:50%;
                    top:0;
                    bottom:0;
                    border-left:3px solid white;">
                </div>

            </div>

            <div style="
                 position:absolute;
                 bottom:15%;
                 width:100%;
                 text-align:center;
                 font-size:22px;">
                 Cancha del club
            </div>

        `;

    }


    else {

        content.innerHTML = `

            <div style="
                padding:40px;
                font-size:20px;
                line-height:1.6;">
                Un interior sencillo del pueblo.
                Hay más cosas para descubrir
                a medida que avanzás.
            </div>

        `;

    }

}


/* =========================================================
   SALIR
========================================================= */

document
    .getElementById(
        "exit-building"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "interior-panel"
                )
                .classList
                .add(
                    "hidden"
                );


            currentBuilding =
                null;

        }
    );


/* =========================================================
   PAN
========================================================= */

function buyBread() {

    if (
        player.money < 30
    ) {

        showToast(
            "No tenés suficiente dinero."
        );

        return;

    }


    player.money -=
        30;

    player.bread +=
        1;


    inventory.push(
        "Pan casero"
    );


    updateInventory();

    showToast(
        "Compraste pan recién hecho."
    );

}


/* =========================================================
   MATE
========================================================= */

function prepareMate() {

    if (
        player.bread <= 0
    ) {

        showToast(
            "Necesitás algo para acompañar el mate."
        );

        return;

    }


    player.mate =
        true;


    inventory.push(
        "Mate preparado"
    );


    updateInventory();

    showToast(
        "Preparaste el mate. Ahora sí, a caminar."
    );

}


/* =========================================================
   RADIO
========================================================= */

function radioInteraction() {

    showDialogue(
        "RADIO OCARINA",
        "Una voz sale al aire. El pueblo empieza a despertarse."
    );

}


/* =========================================================
   OBJETOS
========================================================= */

function collectObject(
    object
) {

    object.collected =
        true;


    inventory.push(
        object.name
    );


    updateInventory();


    if (
        object.type ===
        "photo"
    ) {

        if (
            mission.stage === 1
        ) {

            mission.stage =
                2;

            mission.title =
                "Una fotografía";

            mission.description =
                "Volvé con Don Pedro y mostrá lo que encontraste.";

            setMissionHUD();

        }

    }


    showToast(
        "Encontraste: " +
        object.name
    );

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
        .toggle(
            "hidden"
        );

}


function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );


    let html =
        "";


    html +=
        `<p>Dinero: $${player.money}</p>`;


    html +=
        `<p>Pan: ${player.bread}</p>`;


    if (
        player.mate
    ) {

        html +=
            `<p>🧉 Mate preparado</p>`;

    }


    if (
        inventory.length === 0
    ) {

        html +=
            `<p>La mochila está vacía.</p>`;

    } else {

        html +=
            inventory
                .map(
                    item =>
                        `<p>• ${item}</p>`
                )
                .join("");

    }


    html += `

        <button
            onclick="prepareMate()">
            Preparar mate
        </button>

    `;


    container.innerHTML =
        html;

}


/* =========================================================
   MISION
========================================================= */

function setMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );


    if (
        mission.completed
    ) {

        hud.textContent =
            "✓ Historia descubierta";

        return;

    }


    if (
        mission.stage === 0
    ) {

        hud.textContent =
            "Explorá el pueblo";

    }


    else if (
        mission.stage === 1
    ) {

        hud.textContent =
            "Buscá una fotografía";

    }


    else if (
        mission.stage === 2
    ) {

        hud.textContent =
            "Volvé con Don Pedro";

    }

}


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
        .remove(
            "hidden"
        );

}


/* =========================================================
   DIALOG CLOSE
========================================================= */

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
                .add(
                    "hidden"
                );

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
                .add(
                    "hidden"
                );

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
                .add(
                    "hidden"
                );

        }
    );


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.remove(
        "hidden"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.add(
                    "hidden"
                );

            },
            2500
        );

}


/* =========================================================
   TIEMPO
========================================================= */

function updateTime(dt) {

    worldMinutes +=
        dt *
        2;


    if (
        worldMinutes >=
        24 * 60
    ) {

        worldMinutes =
            0;

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
        String(hours).padStart(2, "0")
        +
        ":" +
        String(minutes).padStart(2, "0");


    drawLighting();

}


/* =========================================================
   LUZ
========================================================= */

function drawLighting() {

    const hour =
        worldMinutes / 60;


    let darkness =
        0;


    if (
        hour < 7
    ) {

        darkness =
            .35;

    }


    if (
        hour >= 20
    ) {

        darkness =
            .45;

    }


    if (
        hour >= 22
    ) {

        darkness =
            .62;

    }


    if (
        hour >= 7 &&
        hour < 9
    ) {

        darkness =
            .12;

    }


    ctx.fillStyle =
        `rgba(24,31,60,${darkness})`;


    ctx.fillRect(
        camera.x,
        camera.y,
        window.innerWidth,
        window.innerHeight
    );

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


    const sx =
        minimap.width /
        WORLD_WIDTH;


    const sy =
        minimap.height /
        WORLD_HEIGHT;


    miniCtx.fillStyle =
        "#b9a070";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* río */

    miniCtx.fillStyle =
        "#426f7e";

    miniCtx.fillRect(
        0,
        river.y * sy,
        minimap.width,
        river.height * sy
    );


    /* calles */

    miniCtx.fillStyle =
        "#6a6256";


    for (
        const road
        of roads
    ) {

        miniCtx.fillRect(
            road.x * sx,
            road.y * sy,
            road.width * sx,
            road.height * sy
        );

    }


    /* edificios */

    miniCtx.fillStyle =
        "#684e3f";


    for (
        const b
        of buildings
    ) {

        miniCtx.fillRect(
            b.x * sx,
            b.y * sy,
            b.width * sx,
            b.height * sy
        );

    }


    /* jugador */

    miniCtx.fillStyle =
        "#ffdb4d";

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


/* =========================================================
   JOYSTICK
========================================================= */

const joystick = {

    dx: 0,
    dy: 0

};


const joystickArea =
    document.getElementById(
        "joystick-area"
    );


const joystickElement =
    document.getElementById(
        "joystick"
    );


let joystickActive =
    false;


function updateJoystick(
    event
) {

    const rect =
        joystickArea.getBoundingClientRect();


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
        45;


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
            dx / length *
            max;

        dy =
            dy / length *
            max;

    }


    joystickElement.style.transform =
        `translate(${dx}px, ${dy}px)`;


    joystick.dx =
        dx / max;

    joystick.dy =
        dy / max;

}


joystickArea.addEventListener(
    "pointerdown",
    event => {

        joystickActive =
            true;

        joystickArea.setPointerCapture(
            event.pointerId
        );

        updateJoystick(
            event
        );

    }
);


joystickArea.addEventListener(
    "pointermove",
    event => {

        if (
            joystickActive
        ) {

            updateJoystick(
                event
            );

        }

    }
);


joystickArea.addEventListener(
    "pointerup",
    resetJoystick
);


joystickArea.addEventListener(
    "pointercancel",
    resetJoystick
);


function resetJoystick() {

    joystickActive =
        false;

    joystick.dx =
        0;

    joystick.dy =
        0;

    joystickElement.style.transform =
        "translate(0,0)";

}


/* =========================================================
   BOTONES CELULAR
========================================================= */

document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "click",
        interact
    );


document
    .getElementById(
        "mobile-inventory"
    )
    .addEventListener(
        "click",
        toggleInventory
    );


/* =========================================================
   START
========================================================= */

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


            showToast(
                "Bienvenido a San Patricio del Chañar."
            );

        }
    );


/* =========================================================
   UPDATE
========================================================= */

function update(
    dt
) {

    if (
        !gameStarted
    )
        return;


    updatePlayer(
        dt
    );


    updateCamera();

    updateTime(
        dt
    );


    if (
        mission.stage === 2
    ) {

        const pedro =
            npcs.find(
                n =>
                    n.name ===
                    "Don Pedro"
            );


        if (
            distance(
                player,
                pedro
            ) < 90
        ) {

            mission.stage =
                3;

            mission.completed =
                true;

            mission.title =
                "La memoria comienza";

            mission.description =
                "Encontraste una primera pieza de la memoria del Chañar.";

            setMissionHUD();

            showMission();

        }

    }

}


/* =========================================================
   DRAW
========================================================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );


    drawWorld();


    ctx.restore();


    drawMinimap();

}


/* =========================================================
   LOOP
========================================================= */

function gameLoop(
    timestamp
) {

    if (
        !lastTime
    ) {

        lastTime =
            timestamp;

    }


    const dt =
        Math.min(
            (timestamp -
            lastTime) /
            1000,
            0.05
        );


    lastTime =
        timestamp;


    update(
        dt
    );


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   INICIO
========================================================= */

generateTrees();

generateFlowers();

updateInventory();

setMissionHUD();

requestAnimationFrame(
    gameLoop
);
