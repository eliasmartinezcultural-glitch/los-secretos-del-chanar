```javascript
/* ============================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 17.0
   ------------------------------------------------------------
   REPRESENTACIÓN TERRITORIAL + MUNDO VIVO
   San Patricio del Chañar
   ============================================================ */

"use strict";

/* ============================================================
   1. CANVAS
   ============================================================ */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const miniCtx = minimap ? minimap.getContext("2d") : null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


/* ============================================================
   2. MUNDO
   ============================================================ */

const WORLD_WIDTH = 4200;
const WORLD_HEIGHT = 3000;


/* ============================================================
   3. ESTADO DEL JUEGO
   ============================================================ */

let gameStarted = false;

let gameTime = 8 * 60; // 08:00
let gameSpeed = 0.35;

let worldDay = 1;

const keys = {};

const camera = {
    x: 0,
    y: 0,
    smooth: 0.10
};


/* ============================================================
   4. JUGADOR
   ============================================================ */

const player = {
    x: 2050,
    y: 1420,

    width: 30,
    height: 30,

    speed: 4.2,

    moving: false,
    frame: 0,

    direction: "down"
};


/* ============================================================
   5. INVENTARIO
   ============================================================ */

const inventory = [];


/* ============================================================
   6. MISION
   ============================================================ */

const mission = {
    active: false,
    completed: false,

    title: "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía antigua. " +
        "Recorré el pueblo y encontrala."
};


/* ============================================================
   7. EDIFICIOS
   ============================================================ */

const buildings = [

    {
        x: 1750,
        y: 1120,
        width: 500,
        height: 250,
        color: "#b86d4f",
        name: "ESCUELA"
    },

    {
        x: 2700,
        y: 1050,
        width: 470,
        height: 250,
        color: "#806b58",
        name: "RADIO OCARINA"
    },

    {
        x: 1050,
        y: 1750,
        width: 360,
        height: 220,
        color: "#a38368",
        name: "ALMACÉN"
    },

    {
        x: 2850,
        y: 1900,
        width: 380,
        height: 230,
        color: "#98725b",
        name: "CASA"
    },

    {
        x: 1850,
        y: 650,
        width: 430,
        height: 230,
        color: "#8e715d",
        name: "MUSEO"
    },

    {
        x: 3300,
        y: 1500,
        width: 430,
        height: 250,
        color: "#765a45",
        name: "TALLER"
    },

    {
        x: 750,
        y: 1250,
        width: 350,
        height: 220,
        color: "#927257",
        name: "PANADERÍA"
    },

    {
        x: 2350,
        y: 1750,
        width: 420,
        height: 230,
        color: "#83654e",
        name: "FERRETERÍA"
    }

];


/* ============================================================
   8. ÁRBOLES / ALAMEDAS
   ============================================================ */

const trees = [];


/* Generador de árboles */

function generateTrees() {

    trees.length = 0;

    /* Alameda norte */

    for (let i = 0; i < 28; i++) {

        trees.push([
            400 + i * 110,
            430
        ]);

    }

    /* Alameda sur */

    for (let i = 0; i < 30; i++) {

        trees.push([
            450 + i * 110,
            2450
        ]);

    }

    /* Sector oeste */

    for (let i = 0; i < 16; i++) {

        trees.push([
            350,
            700 + i * 100
        ]);

    }

    /* Sector este */

    for (let i = 0; i < 16; i++) {

        trees.push([
            3900,
            700 + i * 100
        ]);

    }

}

generateTrees();


/* ============================================================
   9. VIÑEDOS
   ============================================================ */

const vineyards = [

    {
        x: 450,
        y: 850,
        rows: 15,
        cols: 24
    },

    {
        x: 2900,
        y: 500,
        rows: 13,
        cols: 22
    },

    {
        x: 650,
        y: 2150,
        rows: 10,
        cols: 20
    }

];


/* ============================================================
   10. CHACRAS
   ============================================================ */

const farms = [

    {
        x: 300,
        y: 1250,
        width: 600,
        height: 750,
        type: "frutales",
        name: "Chacra frutícola"
    },

    {
        x: 3200,
        y: 500,
        width: 650,
        height: 500,
        type: "viñedo",
        name: "Finca vitivinícola"
    }

];


/* ============================================================
   11. NPC
   ============================================================ */

const npcs = [

    {
        x: 1550,
        y: 1400,

        name: "Don Pedro",

        role: "Vecino",

        color: "#6b4350",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission: true,

        homeX: 1550,
        homeY: 1400,

        targetX: 1550,
        targetY: 1400,

        moving: false
    },

    {
        x: 2450,
        y: 1430,

        name: "María",

        role: "Fotógrafa",

        color: "#704c61",

        text:
            "Si encontrás una fotografía antigua, " +
            "guardala. Las imágenes también " +
            "cuentan la historia del pueblo.",

        homeX: 2450,
        homeY: 1430,

        targetX: 2450,
        targetY: 1430,

        moving: false
    },

    {
        x: 2900,
        y: 900,

        name: "Julián",

        role: "Locutor",

        color: "#435c69",

        text:
            "La radio siempre fue una forma " +
            "de unir a la gente del pueblo.",

        homeX: 2900,
        homeY: 900,

        targetX: 2900,
        targetY: 900,

        moving: false
    },

    {
        x: 850,
        y: 1150,

        name: "Rosa",

        role: "Panadera",

        color: "#8b6048",

        text:
            "A esta hora ya salió el pan. " +
            "El olor llega hasta la calle.",

        homeX: 850,
        homeY: 1150,

        targetX: 850,
        targetY: 1150,

        moving: false
    },

    {
        x: 850,
        y: 1550,

        name: "Miguel",

        role: "Productor",

        color: "#536b45",

        text:
            "La chacra necesita agua, trabajo " +
            "y paciencia. Todo empieza por ahí.",

        homeX: 850,
        homeY: 1550,

        targetX: 850,
        targetY: 1550,

        moving: true
    },

    {
        x: 3450,
        y: 1350,

        name: "Carlos",

        role: "Mecánico",

        color: "#554c42",

        text:
            "Si una máquina falla en plena cosecha, " +
            "hay que arreglarla rápido.",

        homeX: 3450,
        homeY: 1350,

        targetX: 3450,
        targetY: 1350,

        moving: false
    },

    {
        x: 3200,
        y: 2100,

        name: "Elena",

        role: "Vecina",

        color: "#715e76",

        text:
            "El río tiene otro ritmo. " +
            "Cuando quieras conocerlo, seguí hacia el sur.",

        homeX: 3200,
        homeY: 2100,

        targetX: 3200,
        targetY: 2100,

        moving: true
    }

];


/* ============================================================
   12. TRACTOR
   ============================================================ */

const tractors = [

    {
        x: 500,
        y: 1500,

        width: 65,
        height: 35,

        speed: 1.1,

        direction: 1,

        minX: 400,
        maxX: 900
    },

    {
        x: 3150,
        y: 750,

        width: 65,
        height: 35,

        speed: 0.9,

        direction: -1,

        minX: 2900,
        maxX: 3800
    }

];


/* ============================================================
   13. VEHÍCULOS
   ============================================================ */

const vehicles = [

    {
        x: 1200,
        y: 1000,

        width: 70,
        height: 35,

        type: "camioneta",

        speed: 1.4,

        direction: 1,

        minX: 1000,
        maxX: 1700
    },

    {
        x: 3400,
        y: 1200,

        width: 80,
        height: 38,

        type: "camión",

        speed: 1.0,

        direction: -1,

        minX: 2600,
        maxX: 3800
    },

    {
        x: 1600,
        y: 2300,

        width: 65,
        height: 32,

        type: "auto",

        speed: 1.2,

        direction: 1,

        minX: 1200,
        maxX: 2300
    }

];


/* ============================================================
   14. ANIMALES
   ============================================================ */

const animals = [

    {
        x: 500,
        y: 1800,
        type: "perro",
        dx: 0.5,
        dy: 0.2
    },

    {
        x: 700,
        y: 1900,
        type: "perro",
        dx: -0.3,
        dy: 0.3
    },

    {
        x: 3300,
        y: 2300,
        type: "caballo",
        dx: 0.2,
        dy: 0
    },

    {
        x: 3500,
        y: 2350,
        type: "caballo",
        dx: -0.2,
        dy: 0
    }

];


/* ============================================================
   15. PERSONAS CAMINANDO
   ============================================================ */

const walkers = [

    {
        x: 1300,
        y: 930,
        targetX: 1600,
        targetY: 930,
        speed: 0.6,
        name: "Vecino"
    },

    {
        x: 2100,
        y: 1500,
        targetX: 2450,
        targetY: 1500,
        speed: 0.55,
        name: "Vecina"
    },

    {
        x: 2500,
        y: 1000,
        targetX: 2800,
        targetY: 1000,
        speed: 0.5,
        name: "Trabajador"
    }

];


/* ============================================================
   16. OBJETOS COLECCIONABLES
   ============================================================ */

const objects = [

    {
        x: 1450,
        y: 1500,

        type: "photo",

        name: "Fotografía antigua",

        description:
            "Una fotografía que muestra una escena " +
            "del antiguo pueblo.",

        collected: false
    },

    {
        x: 2050,
        y: 560,

        type: "document",

        name: "Documento antiguo",

        description:
            "Un documento relacionado con la historia " +
            "del territorio.",

        collected: false
    },

    {
        x: 900,
        y: 2100,

        type: "photo",

        name: "Fotografía de la chacra",

        description:
            "Una imagen de una antigua producción rural.",

        collected: false
    },

    {
        x: 3500,
        y: 2200,

        type: "artifact",

        name: "Objeto encontrado",

        description:
            "Algo que parece tener relación con " +
            "la historia del lugar.",

        collected: false
    }

];


/* ============================================================
   17. UTILIDADES
   ============================================================ */

function distance(a, b) {

    const ax = a.x;
    const ay = a.y;

    const bx = b.x;
    const by = b.y;

    return Math.hypot(
        ax - bx,
        ay - by
    );
}


function collision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


function random(min, max) {

    return Math.random() *
        (max - min) +
        min;
}


/* ============================================================
   18. MOVIMIENTO DEL JUGADOR
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


    /* No permitir entrar al río */

    if (
        y + player.height > 2640
    ) {

        return false;

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


    /* Movimiento diagonal normalizado */

    if (dx !== 0 && dy !== 0) {

        dx *= 0.7071;
        dy *= 0.7071;

    }


    player.moving =
        dx !== 0 ||
        dy !== 0;


    if (player.moving) {

        player.frame += 0.15;

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


    player.x = Math.max(
        20,
        Math.min(
            WORLD_WIDTH - player.width - 20,
            player.x
        )
    );


    player.y = Math.max(
        20,
        Math.min(
            WORLD_HEIGHT - player.height - 350,
            player.y
        )
    );

}


/* ============================================================
   19. CÁMARA
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


    const maxCameraX =
        Math.max(
            0,
            WORLD_WIDTH -
            canvas.width
        );


    const maxCameraY =
        Math.max(
            0,
            WORLD_HEIGHT -
            canvas.height
        );


    camera.x =
        Math.max(
            0,
            Math.min(
                maxCameraX,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                maxCameraY,
                camera.y
            )
        );

}


/* ============================================================
   20. RELOJ
   ============================================================ */

function updateWorldTime() {

    if (!gameStarted) return;

    gameTime +=
        gameSpeed / 60;

    if (gameTime >= 1440) {

        gameTime = 0;

        worldDay++;

    }

}


function getHour() {

    return Math.floor(
        gameTime / 60
    );

}


function getMinutes() {

    return Math.floor(
        gameTime % 60
    );

}


function getTimeText() {

    const hour =
        String(
            getHour()
        ).padStart(
            2,
            "0"
        );

    const minutes =
        String(
            getMinutes()
        ).padStart(
            2,
            "0"
        );

    return `${hour}:${minutes}`;

}


/* ============================================================
   21. MOVIMIENTO DE TRACTORES
   ============================================================ */

function updateTractors() {

    for (
        const tractor
        of tractors
    ) {

        tractor.x +=
            tractor.speed *
            tractor.direction;


        if (
            tractor.x >
            tractor.maxX
        ) {

            tractor.direction = -1;

        }


        if (
            tractor.x <
            tractor.minX
        ) {

            tractor.direction = 1;

        }

    }

}


/* ============================================================
   22. MOVIMIENTO DE VEHÍCULOS
   ============================================================ */

function updateVehicles() {

    for (
        const vehicle
        of vehicles
    ) {

        vehicle.x +=
            vehicle.speed *
            vehicle.direction;


        if (
            vehicle.x >
            vehicle.maxX
        ) {

            vehicle.direction = -1;

        }


        if (
            vehicle.x <
            vehicle.minX
        ) {

            vehicle.direction = 1;

        }

    }

}


/* ============================================================
   23. MOVIMIENTO DE ANIMALES
   ============================================================ */

function updateAnimals() {

    for (
        const animal
        of animals
    ) {

        animal.x += animal.dx;
        animal.y += animal.dy;


        if (
            animal.x < 300 ||
            animal.x > 3800
        ) {

            animal.dx *= -1;

        }


        if (
            animal.y < 1500 ||
            animal.y > 2450
        ) {

            animal.dy *= -1;

        }

    }

}


/* ============================================================
   24. PERSONAS CAMINANDO
   ============================================================ */

function updateWalkers() {

    for (
        const walker
        of walkers
    ) {

        const dx =
            walker.targetX -
            walker.x;

        const dy =
            walker.targetY -
            walker.y;

        const d =
            Math.hypot(
                dx,
                dy
            );


        if (d < 10) {

            const oldX =
                walker.targetX;

            const oldY =
                walker.targetY;


            walker.targetX =
                oldX +
                random(
                    -350,
                    350
                );


            walker.targetY =
                oldY +
                random(
                    -250,
                    250
                );

        } else {

            walker.x +=
                dx / d *
                walker.speed;

            walker.y +=
                dy / d *
                walker.speed;

        }

    }

}


/* ============================================================
   25. NPCs
   ============================================================ */

function updateNPCs() {

    const hour = getHour();


    for (
        const npc
        of npcs
    ) {

        /*
         * Productores trabajan durante el día.
         */

        if (
            npc.role === "Productor" &&
            hour >= 7 &&
            hour <= 18
        ) {

            npc.moving = true;

        }


        /*
         * Por la noche vuelven aproximadamente
         * a su zona de origen.
         */

        if (
            hour >= 21 ||
            hour < 7
        ) {

            npc.targetX =
                npc.homeX;

            npc.targetY =
                npc.homeY;

            npc.moving = true;

        }


        if (!npc.moving) {

            continue;

        }


        const dx =
            npc.targetX -
            npc.x;

        const dy =
            npc.targetY -
            npc.y;

        const d =
            Math.hypot(
                dx,
                dy
            );


        if (d < 15) {

            npc.targetX =
                npc.homeX +
                random(
                    -180,
                    180
                );

            npc.targetY =
                npc.homeY +
                random(
                    -180,
                    180
                );

        } else {

            npc.x +=
                dx / d *
                0.45;

            npc.y +=
                dy / d *
                0.45;

        }

    }

}


/* ============================================================
   26. FONDO TERRITORIAL
   ============================================================ */

function drawWorld() {

    /* Tierra */

    ctx.fillStyle =
        "#c8aa76";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* Desierto */

    ctx.fillStyle =
        "#b99761";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        600
    );


    /* Bardas */

    drawMountains();


    /* Caminos principales */

    ctx.fillStyle =
        "#947653";


    ctx.fillRect(
        0,
        1280,
        WORLD_WIDTH,
        150
    );


    ctx.fillRect(
        2000,
        0,
        170,
        WORLD_HEIGHT
    );


    /* Caminos secundarios */

    ctx.fillStyle =
        "#a4875e";


    ctx.fillRect(
        850,
        600,
        100,
        1900
    );


    ctx.fillRect(
        2800,
        500,
        100,
        2100
    );


    /* Plaza */

    drawPlaza();


    /* Río Neuquén */

    drawRiver();


    /* Chacras */

    drawFarms();


    /* Viñedos */

    for (
        const vineyard
        of vineyards
    ) {

        drawVineyard(
            vineyard
        );

    }


    /* Alamedas */

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


/* ============================================================
   27. CERROS
   ============================================================ */

function drawMountains() {

    ctx.fillStyle =
        "#8b765d";


    ctx.beginPath();

    ctx.moveTo(
        0,
        400
    );

    ctx.lineTo(
        450,
        100
    );

    ctx.lineTo(
        900,
        380
    );

    ctx.lineTo(
        1350,
        90
    );

    ctx.lineTo(
        1800,
        350
    );

    ctx.lineTo(
        2250,
        70
    );

    ctx.lineTo(
        2700,
        370
    );

    ctx.lineTo(
        3200,
        110
    );

    ctx.lineTo(
        WORLD_WIDTH,
        360
    );

    ctx.lineTo(
        WORLD_WIDTH,
        0
    );

    ctx.lineTo(
        0,
        0
    );

    ctx.closePath();

    ctx.fill();

}


/* ============================================================
   28. PLAZA
   ============================================================ */

function drawPlaza() {

    ctx.fillStyle =
        "#6f9557";


    ctx.fillRect(
        1550,
        1150,
        700,
        420
    );


    /* Senderos */

    ctx.fillStyle =
        "#b69b6d";


    ctx.fillRect(
        1880,
        1150,
        40,
        420
    );


    ctx.fillRect(
        1550,
        1340,
        700,
        40
    );


    /* Fuente */

    ctx.fillStyle =
        "#719da2";

    ctx.beginPath();

    ctx.arc(
        1900,
        1340,
        70,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Bancos */

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        ctx.fillStyle =
            "#634b3b";

        ctx.fillRect(
            1650 + i * 120,
            1200,
            60,
            15
        );

    }

}


/* ============================================================
   29. RÍO
   ============================================================ */

function drawRiver() {

    ctx.fillStyle =
        "#4e8294";


    ctx.fillRect(
        0,
        2650,
        WORLD_WIDTH,
        180
    );


    /* brillo */

    ctx.fillStyle =
        "rgba(255,255,255,0.18)";


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        ctx.fillRect(
            150 + i * 230,
            2690 + (i % 3) * 30,
            100,
            5
        );

    }

}


/* ============================================================
   30. CHACRAS
   ============================================================ */

function drawFarms() {

    for (
        const farm
        of farms
    ) {

        ctx.fillStyle =
            "#78975a";


        ctx.fillRect(
            farm.x,
            farm.y,
            farm.width,
            farm.height
        );


        /* Líneas de cultivo */

        ctx.strokeStyle =
            "rgba(60,90,50,0.45)";

        ctx.lineWidth = 3;


        for (
            let y =
                farm.y + 30;
            y <
            farm.y +
            farm.height;
            y += 45
        ) {

            ctx.beginPath();

            ctx.moveTo(
                farm.x,
                y
            );

            ctx.lineTo(
                farm.x +
                farm.width,
                y
            );

            ctx.stroke();

        }

    }

}


/* ============================================================
   31. VIÑEDOS
   ============================================================ */

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
                col * 35;

            const y =
                vineyard.y +
                row * 32;


            ctx.strokeStyle =
                "#48633d";

            ctx.lineWidth = 2;


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
                "#4d7642";


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


/* ============================================================
   32. ÁRBOLES
   ============================================================ */

function drawTree(x, y) {

    /* tronco */

    ctx.fillStyle =
        "#63452f";


    ctx.fillRect(
        x - 7,
        y,
        14,
        50
    );


    /* copa */

    ctx.fillStyle =
        "#477044";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 8,
        34,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* ============================================================
   33. EDIFICIOS
   ============================================================ */

function drawBuildings() {

    for (
        const building
        of buildings
    ) {

        /* sombra */

        ctx.fillStyle =
            "rgba(0,0,0,0.20)";


        ctx.fillRect(
            building.x + 10,
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
            "#49362d";


        ctx.beginPath();

        ctx.moveTo(
            building.x - 20,
            building.y
        );

        ctx.lineTo(
            building.x +
            building.width / 2,
            building.y - 65
        );

        ctx.lineTo(
            building.x +
            building.width + 20,
            building.y
        );

        ctx.closePath();

        ctx.fill();


        /* puerta */

        ctx.fillStyle =
            "#46332b";


        ctx.fillRect(
            building.x +
            building.width / 2 -
            22,

            building.y +
            building.height -
            75,

            44,
            75
        );


        /* ventanas */

        ctx.fillStyle =
            "#b9d3d2";


        ctx.fillRect(
            building.x + 35,
            building.y + 45,
            48,
            48
        );


        ctx.fillRect(
            building.x +
            building.width -
            83,

            building.y + 45,

            48,
            48
        );


        /* cartel */

        ctx.fillStyle =
            "rgba(0,0,0,0.30)";


        ctx.fillRect(
            building.x + 15,
            building.y + 10,
            Math.min(
                180,
                building.width - 30
            ),
            30
        );


        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 16px Arial";


        ctx.fillText(
            building.name,
            building.x + 25,
            building.y + 31
        );

    }

}


/* ============================================================
   34. TRACTORES
   ============================================================ */

function drawTractors() {

    for (
        const tractor
        of tractors
    ) {

        const x =
            tractor.x;

        const y =
            tractor.y;


        /* ruedas */

        ctx.fillStyle =
            "#242424";


        ctx.beginPath();

        ctx.arc(
            x + 15,
            y + 32,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            x + 55,
            y + 32,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* cuerpo */

        ctx.fillStyle =
            "#567344";


        ctx.fillRect(
            x + 10,
            y + 10,
            48,
            22
        );


        /* cabina */

        ctx.fillStyle =
            "#9ab0a2";


        ctx.fillRect(
            x + 25,
            y - 2,
            25,
            20
        );

    }

}


/* ============================================================
   35. VEHÍCULOS
   ============================================================ */

function drawVehicles() {

    for (
        const vehicle
        of vehicles
    ) {

        const x =
            vehicle.x;

        const y =
            vehicle.y;


        ctx.fillStyle =
            vehicle.type === "camión"
                ? "#69584b"
                : "#40586a";


        ctx.fillRect(
            x,
            y,
            vehicle.width,
            vehicle.height
        );


        /* ruedas */

        ctx.fillStyle =
            "#242424";


        ctx.beginPath();

        ctx.arc(
            x + 18,
            y + vehicle.height,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            x + vehicle.width - 18,
            y + vehicle.height,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* ============================================================
   36. ANIMALES
   ============================================================ */

function drawAnimals() {

    for (
        const animal
        of animals
    ) {

        ctx.fillStyle =
            animal.type === "perro"
                ? "#654936"
                : "#76523b";


        ctx.beginPath();

        ctx.ellipse(
            animal.x,
            animal.y,
            22,
            12,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* cabeza */

        ctx.beginPath();

        ctx.arc(
            animal.x + 18,
            animal.y - 5,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* ============================================================
   37. NPC
   ============================================================ */

function drawNPC(npc) {

    /* cuerpo */

    ctx.fillStyle =
        npc.color;


    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cabeza */

    ctx.fillStyle =
        "#dca884";


    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 23,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* nombre */

    ctx.fillStyle =
        "white";

    ctx.font =
        "13px Arial";


    ctx.fillText(
        npc.name,
        npc.x - 32,
        npc.y + 38
    );


    /* indicador */

    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle =
            "#f4c542";

        ctx.font =
            "bold 24px Arial";


        ctx.fillText(
            "!",
            npc.x - 5,
            npc.y - 45
        );

    }

}


/* ============================================================
   38. PERSONAS CAMINANDO
   ============================================================ */

function drawWalkers() {

    for (
        const walker
        of walkers
    ) {

        ctx.fillStyle =
            "#5c4960";


        ctx.beginPath();

        ctx.arc(
            walker.x,
            walker.y,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#e0aa87";


        ctx.beginPath();

        ctx.arc(
            walker.x,
            walker.y - 14,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* ============================================================
   39. OBJETOS
   ============================================================ */

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


        const pulse =
            Math.sin(
                Date.now() / 300
            ) *
            3;


        ctx.fillStyle =
            "#f0c94b";


        ctx.beginPath();

        ctx.arc(
            object.x,
            object.y - 8,
            16 + pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#5c4434";


        ctx.font =
            "20px Arial";


        if (
            object.type === "photo"
        ) {

            ctx.fillText(
                "▣",
                object.x - 7,
                object.y
            );

        } else if (
            object.type === "document"
        ) {

            ctx.fillText(
                "▤",
                object.x - 7,
                object.y
            );

        } else {

            ctx.fillText(
                "◆",
                object.x - 7,
                object.y
            );

        }

    }

}


/* ============================================================
   40. JUGADOR
   ============================================================ */

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
        "rgba(0,0,0,0.25)";


    ctx.beginPath();

    ctx.ellipse(
        x + 15,
        y + 32,
        22,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#263d50";


    ctx.fillRect(
        x,
        y,
        30,
        30
    );


    /* cabeza */

    ctx.fillStyle =
        "#e0aa86";


    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 10,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#30251f";


    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 16,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

}


/* ============================================================
   41. INTERACCIÓN
   ============================================================ */

function interact() {

    /* NPC */

    for (
        const npc
        of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 85
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
            ) < 75
        ) {

            collectObject(
                object
            );

            return;

        }

    }


    /* vehículos */

    for (
        const vehicle
        of vehicles
    ) {

        if (
            distance(
                player,
                vehicle
            ) < 80
        ) {

            showDialogue(
                "Vehículo",
                "Es parte de la vida cotidiana " +
                "del pueblo."
            );

            return;

        }

    }


    /* tractor */

    for (
        const tractor
        of tractors
    ) {

        if (
            distance(
                player,
                tractor
            ) < 90
        ) {

            showDialogue(
                "Trabajador rural",
                "Estamos trabajando en la chacra."
            );

            return;

        }

    }

}


/* ============================================================
   42. COLECCIONAR
   ============================================================ */

function collectObject(object) {

    object.collected =
        true;


    inventory.push(
        object.name
    );


    updateInventory();


    updateCounters();


    if (
        mission.active &&
        object.type === "photo"
    ) {

        mission.completed =
            true;

        mission.active =
            false;


        setMissionHUD();


        setTimeout(
            function() {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "Encontraste la fotografía. " +
                    "Tal vez sea una pequeña pieza " +
                    "de una historia mucho más grande."
                );

            },
            300
        );

    }

}


/* ============================================================
   43. CONTADORES
   ============================================================ */

function updateCounters() {

    const photoCount =
        document.getElementById(
            "photo-count"
        );


    const documentCount =
        document.getElementById(
            "document-count"
        );


    if (photoCount) {

        photoCount.textContent =
            inventory.filter(
                item =>
                    item.includes(
                        "Fotografía"
                    )
            ).length;

    }


    if (documentCount) {

        documentCount.textContent =
            inventory.filter(
                item =>
                    item.includes(
                        "Documento"
                    )
            ).length;

    }

}


/* ============================================================
   44. DIÁLOGOS
   ============================================================ */

function showDialogue(
    name,
    text
) {

    const nameElement =
        document.getElementById(
            "dialogue-name"
        );


    const textElement =
        document.getElementById(
            "dialogue-text"
        );


    const dialogue =
        document.getElementById(
            "dialogue"
        );


    if (!dialogue) return;


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    if (textElement) {

        textElement.textContent =
            text;

    }


    dialogue.classList.remove(
        "hidden"
    );

}


/* ============================================================
   45. MISIÓN
   ============================================================ */

function showMission() {

    const title =
        document.getElementById(
            "mission-title"
        );


    const description =
        document.getElementById(
            "mission-description"
        );


    const panel =
        document.getElementById(
            "mission-panel"
        );


    if (!panel) return;


    if (title) {

        title.textContent =
            mission.title;

    }


    if (description) {

        description.textContent =
            mission.description;

    }


    panel.classList.remove(
        "hidden"
    );

}


function setMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );


    if (!hud) return;


    if (
        mission.completed
    ) {

        hud.textContent =
            "✓ Misión completada";

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
        "Explorá San Patricio del Chañar";

}


/* ============================================================
   46. INVENTARIO
   ============================================================ */

function toggleInventory() {

    const panel =
        document.getElementById(
            "inventory-panel"
        );


    if (!panel) return;


    panel.classList.toggle(
        "hidden"
    );

}


function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );


    if (!container) return;


    if (
        inventory.length === 0
    ) {

        container.innerHTML =
            "Inventario vacío.";

        return;

    }


    container.innerHTML =
        inventory
            .map(
                item =>
                    "• " + item
            )
            .join(
                "<br>"
            );

}


/* ============================================================
   47. MINIMAPA
   ============================================================ */

function drawMinimap() {

    if (!miniCtx) return;


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


    /* fondo */

    miniCtx.fillStyle =
        "#b99761";


    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* río */

    miniCtx.fillStyle =
        "#4e8294";


    miniCtx.fillRect(
        0,
        2650 * scaleY,
        minimap.width,
        180 * scaleY
    );


    /* edificios */

    miniCtx.fillStyle =
        "#684c40";


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


    /* plaza */

    miniCtx.fillStyle =
        "#679052";


    miniCtx.fillRect(
        1550 * scaleX,
        1150 * scaleY,
        700 * scaleX,
        420 * scaleY
    );


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


    /* NPC */

    miniCtx.fillStyle =
        "#f1cf4c";


    for (
        const npc
        of npcs
    ) {

        miniCtx.fillRect(
            npc.x * scaleX - 2,
            npc.y * scaleY - 2,
            4,
            4
        );

    }

}


/* ============================================================
   48. ILUMINACIÓN
   ============================================================ */

function drawLighting() {

    const hour =
        getHour();


    let darkness =
        0;


    if (
        hour < 6
    ) {

        darkness =
            0.35;

    } else if (
        hour < 8
    ) {

        darkness =
            0.18;

    } else if (
        hour > 19 &&
        hour < 22
    ) {

        darkness =
            0.18;

    } else if (
        hour >= 22
    ) {

        darkness =
            0.38;

    }


    if (
        darkness <= 0
    ) {

        return;

    }


    ctx.fillStyle =
        `rgba(20,30,65,${darkness})`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* ============================================================
   49. HUD DEL RELOJ
   ============================================================ */

function drawClock() {

    ctx.save();

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );


    ctx.fillStyle =
        "rgba(0,0,0,0.55)";


    ctx.fillRect(
        20,
        20,
        135,
        42
    );


    ctx.fillStyle =
        "white";


    ctx.font =
        "bold 18px Arial";


    ctx.fillText(
        getTimeText(),
        35,
        47
    );


    ctx.font =
        "12px Arial";


    ctx.fillText(
        "Día " + worldDay,
        95,
        47
    );


    ctx.restore();

}


/* ============================================================
   50. INDICADOR DE INTERACCIÓN
   ============================================================ */

function drawInteractionHint() {

    let nearby = false;


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

            nearby = true;

        }

    }


    for (
        const object
        of objects
    ) {

        if (
            !object.collected &&
            distance(
                player,
                object
            ) < 80
        ) {

            nearby = true;

        }

    }


    if (!nearby) return;


    ctx.save();


    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );


    ctx.fillStyle =
        "rgba(0,0,0,0.65)";


    ctx.fillRect(
        canvas.width / 2 - 90,
        canvas.height - 85,
        180,
        40
    );


    ctx.fillStyle =
        "white";


    ctx.font =
        "bold 16px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "E  INTERACTUAR",
        canvas.width / 2,
        canvas.height - 60
    );


    ctx.restore();

}


/* ============================================================
   51. TECLADO
   ============================================================ */

document.addEventListener(
    "keydown",
    function(e) {

        const key =
            e.key.toLowerCase();


        keys[key] = true;


        if (
            key === "e"
        ) {

            interact();

        }


        if (
            key === "m"
        ) {

            toggleInventory();

        }


        /* ESC */

        if (
            key === "escape"
        ) {

            closePanels();

        }

    }
);


document.addEventListener(
    "keyup",
    function(e) {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);


/* ============================================================
   52. BOTONES
   ============================================================ */

const startButton =
    document.getElementById(
        "start-button"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        function() {

            gameStarted =
                true;


            const startScreen =
                document.getElementById(
                    "start-screen"
                );


            if (startScreen) {

                startScreen.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* diálogo */

const dialogueClose =
    document.getElementById(
        "dialogue-close"
    );


if (dialogueClose) {

    dialogueClose.addEventListener(
        "click",
        function() {

            const dialogue =
                document.getElementById(
                    "dialogue"
                );


            if (dialogue) {

                dialogue.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* misión */

const missionClose =
    document.getElementById(
        "mission-close"
    );


if (missionClose) {

    missionClose.addEventListener(
        "click",
        function() {

            const panel =
                document.getElementById(
                    "mission-panel"
                );


            if (panel) {

                panel.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* inventario */

const inventoryClose =
    document.getElementById(
        "inventory-close"
    );


if (inventoryClose) {

    inventoryClose.addEventListener(
        "click",
        function() {

            const panel =
                document.getElementById(
                    "inventory-panel"
                );


            if (panel) {

                panel.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* ============================================================
   53. CERRAR PANELES
   ============================================================ */

function closePanels() {

    const ids = [

        "dialogue",
        "mission-panel",
        "inventory-panel"

    ];


    for (
        const id
        of ids
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.classList.add(
                "hidden"
            );

        }

    }

}


/* ============================================================
   54. DIBUJAR
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


    /* mundo */

    drawWorld();


    /* edificios */

    drawBuildings();


    /* objetos */

    drawObjects();


    /* personas */

    drawWalkers();


    for (
        const npc
        of npcs
    ) {

        drawNPC(
            npc
        );

    }


    /* animales */

    drawAnimals();


    /* vehículos */

    drawVehicles();


    /* tractores */

    drawTractors();


    /* jugador */

    drawPlayer();


    /* iluminación */

    drawLighting();


    ctx.restore();


    /* interfaz */

    drawMinimap();

    drawClock();

    drawInteractionHint();

}


/* ============================================================
   55. MOTOR
   ============================================================ */

function update() {

    if (!gameStarted) return;


    updatePlayer();

    updateCamera();

    updateWorldTime();

    updateTractors();

    updateVehicles();

    updateAnimals();

    updateWalkers();

    updateNPCs();

}


function gameLoop() {

    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* ============================================================
   56. INICIALIZACIÓN
   ============================================================ */

updateInventory();

updateCounters();

setMissionHUD();

gameLoop();


/* ============================================================
   FIN — VERSIÓN 17.0
   ============================================================ */
```
