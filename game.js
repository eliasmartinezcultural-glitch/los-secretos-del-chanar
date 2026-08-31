/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 1.0
   MUNDO OASIS PATAGÓNICO
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

const WORLD_WIDTH =
    4200;

const WORLD_HEIGHT =
    2800;


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const config = {

    playerSpeed: 4.2,

    interactionDistance: 95,

    cameraSmooth: .09,

    daySpeed: .00025

};


/* =====================================================
   CANVAS
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
            key === "e"
        ) {

            interact();

        }


        if (
            key === "m"
        ) {

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


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2050,

    y: 1420,

    width: 28,

    height: 28,

    speed:
        config.playerSpeed,

    frame: 0,

    direction:
        "down",

    moving:
        false

};


/* =====================================================
   CÁMARA
===================================================== */

const camera = {

    x: 0,

    y: 0

};


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        x: 1650,
        y: 1200,
        width: 260,
        height: 170,
        name: "MUNICIPALIDAD",
        color: "#aa7457"
    },

    {
        x: 2010,
        y: 1180,
        width: 300,
        height: 190,
        name: "ESCUELA",
        color: "#a4775d"
    },

    {
        x: 2410,
        y: 1210,
        width: 270,
        height: 170,
        name: "COMERCIO",
        color: "#987359"
    },

    {
        x: 1660,
        y: 1540,
        width: 240,
        height: 160,
        name: "VIVIENDA",
        color: "#96715b"
    },

    {
        x: 2010,
        y: 1580,
        width: 270,
        height: 160,
        name: "VIVIENDA",
        color: "#ad8265"
    },

    {
        x: 2380,
        y: 1570,
        width: 250,
        height: 160,
        name: "ALMACÉN",
        color: "#96705a"
    },

    {
        x: 2760,
        y: 1140,
        width: 390,
        height: 220,
        name: "RADIO OCARINA",
        color: "#765d4d"
    }

];


/* =====================================================
   PLAZA
===================================================== */

const plaza = {

    x: 1850,

    y: 1320,

    width: 720,

    height: 430

};


/* =====================================================
   ÁRBOLES
===================================================== */

const trees = [];


function generateTrees() {

    const rows = [

        [250, 300, 18],
        [900, 450, 16],
        [3100, 350, 20],
        [350, 2200, 22],
        [3300, 2150, 22]

    ];


    rows.forEach(
        row => {

            const [
                startX,
                startY,
                amount
            ] = row;


            for (
                let i = 0;
                i < amount;
                i++
            ) {

                trees.push({

                    x:
                        startX +
                        i * 75,

                    y:
                        startY +
                        Math.sin(i) * 45

                });

            }

        }
    );


    /* CORTINAS DE ÁLAMOS */

    for (
        let i = 0;
        i < 38;
        i++
    ) {

        trees.push({

            x:
                500 +
                i * 85,

            y:
                850 +
                Math.sin(i * .7) * 12

        });

    }


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        trees.push({

            x:
                650 +
                i * 85,

            y:
                2050 +
                Math.sin(i) * 15

        });

    }

}


generateTrees();


/* =====================================================
   VIÑEDOS
===================================================== */

const vineyards = [

    {
        x: 450,
        y: 1050,
        rows: 12,
        columns: 25
    },

    {
        x: 2850,
        y: 1650,
        rows: 11,
        columns: 23
    },

    {
        x: 450,
        y: 1500,
        rows: 8,
        columns: 18
    }

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {

        x: 1780,

        y: 1450,

        name:
            "Don Pedro",

        text:
            "Viví buena parte de mi vida acá. " +
            "El Chañar cambió muchísimo, pero " +
            "si mirás con atención todavía podés " +
            "encontrar las huellas de lo que fue.",

        mission:
            true

    },

    {

        x: 2250,

        y: 1450,

        name:
            "María",

        text:
            "Mirá los árboles. Las chacras, " +
            "los canales y las cortinas de álamos " +
            "cuentan una historia que no aparece " +
            "en ningún cartel."

    },

    {

        x: 2940,

        y: 1450,

        name:
            "Julián",

        text:
            "La radio siempre fue importante " +
            "para que las historias circularan " +
            "por el pueblo."

    },

    {

        x: 3200,

        y: 2050,

        name:
            "Chacarero",

        text:
            "Acá el agua lo cambia todo. " +
            "Sin riego, este paisaje sería " +
            "completamente distinto."

    }

];


/* =====================================================
   OBJETOS
===================================================== */

const objects = [

    {

        x: 1450,

        y: 1470,

        type:
            "photo",

        name:
            "Fotografía antigua",

        description:
            "Una fotografía que muestra " +
            "una parte desconocida del pueblo.",

        collected:
            false

    },

    {

        x: 1300,

        y: 1020,

        type:
            "document",

        name:
            "Documento de archivo",

        description:
            "Un documento relacionado con " +
            "la historia productiva de la zona.",

        collected:
            false

    },

    {

        x: 3000,

        y: 900,

        type:
            "photo",

        name:
            "Fotografía de los viñedos",

        description:
            "Una imagen de las primeras " +
            "hileras de producción.",

        collected:
            false

    },

    {

        x: 3500,

        y: 1950,

        type:
            "document",

        name:
            "Registro del agua",

        description:
            "Un viejo registro relacionado " +
            "con los canales de riego.",

        collected:
            false

    }

];


/* =====================================================
   DESCUBRIMIENTOS
===================================================== */

const discoveries = [

    {

        x: 900,

        y: 700,

        name:
            "Las bardas",

        discovered:
            false

    },

    {

        x: 1850,

        y: 1320,

        name:
            "La plaza",

        discovered:
            false

    },

    {

        x: 3500,

        y: 700,

        name:
            "El oasis productivo",

        discovered:
            false

    },

    {

        x: 3650,

        y: 2350,

        name:
            "El río Neuquén",

        discovered:
            false

    }

];


/* =====================================================
   INVENTARIO
===================================================== */

const inventory = [];


/* =====================================================
   MISIÓN
===================================================== */

const mission = {

    active:
        false,

    completed:
        false,

    title:
        "La fotografía perdida",

    description:
        "Don Pedro recuerda una fotografía " +
        "antigua que puede ayudar a reconstruir " +
        "una parte de la memoria del pueblo."

};


/* =====================================================
   ESTADO
===================================================== */

let gameStarted =
    false;

let worldTime =
    0;

let discoveryCount =
    0;

let toastTimer =
    null;


/* =====================================================
   UTILIDADES
===================================================== */

function distance(
    a,
    b
) {

    return Math.hypot(

        a.x - b.x,

        a.y - b.y

    );

}


function collision(
    a,
    b
) {

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


/* =====================================================
   MOVIMIENTO
===================================================== */

function canMove(
    x,
    y
) {

    const test = {

        x,
        y,

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


    return (

        x >= 0 &&

        y >= 0 &&

        x <=
            WORLD_WIDTH -
            player.width &&

        y <=
            WORLD_HEIGHT -
            player.height

    );

}


function updatePlayer() {

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


    player.moving =
        dx !== 0 ||
        dy !== 0;


    if (
        player.moving
    ) {

        const length =
            Math.hypot(
                dx,
                dy
            );


        dx /=
            length;

        dy /=
            length;


        const moveX =
            dx *
            player.speed;

        const moveY =
            dy *
            player.speed;


        if (
            canMove(
                player.x +
                moveX,
                player.y
            )
        ) {

            player.x +=
                moveX;

        }


        if (
            canMove(
                player.x,
                player.y +
                moveY
            )
        ) {

            player.y +=
                moveY;

        }


        player.frame +=
            .18;

    }

}


/* =====================================================
   CÁMARA
===================================================== */

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
        )
        *
        config.cameraSmooth;


    camera.y +=
        (
            targetY -
            camera.y
        )
        *
        config.cameraSmooth;


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


/* =====================================================
   SUELO
===================================================== */

function drawGround() {

    ctx.fillStyle =
        "#c8aa73";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* TEXTURA DE ESTEPA */

    ctx.fillStyle =
        "rgba(92,70,45,.12)";


    for (
        let x = 0;
        x < WORLD_WIDTH;
        x += 90
    ) {

        for (
            let y = 0;
            y < WORLD_HEIGHT;
            y += 90
        ) {

            const offset =
                Math.sin(
                    x * .03 +
                    y * .02
                ) * 12;


            ctx.fillRect(
                x + offset,
                y,
                18,
                3
            );

        }

    }

}


/* =====================================================
   CAMINOS
===================================================== */

function drawRoads() {

    ctx.fillStyle =
        "#9b7b52";


    /* AVENIDA */

    ctx.fillRect(
        0,
        1370,
        WORLD_WIDTH,
        125
    );


    /* CAMINO NORTE */

    ctx.fillRect(
        0,
        700,
        WORLD_WIDTH,
        90
    );


    /* CAMINO VERTICAL */

    ctx.fillRect(
        1850,
        0,
        100,
        WORLD_HEIGHT
    );


    /* CAMINOS RURALES */

    ctx.fillRect(
        300,
        900,
        3000,
        35
    );


    ctx.fillRect(
        500,
        1950,
        3000,
        35
    );


    /* BORDES */

    ctx.strokeStyle =
        "rgba(70,50,30,.25)";

    ctx.lineWidth =
        3;


    ctx.beginPath();

    ctx.moveTo(
        0,
        1370
    );

    ctx.lineTo(
        WORLD_WIDTH,
        1370
    );

    ctx.stroke();

}


/* =====================================================
   PLAZA
===================================================== */

function drawPlaza() {

    ctx.fillStyle =
        "#71915d";

    ctx.fillRect(
        plaza.x,
        plaza.y,
        plaza.width,
        plaza.height
    );


    /* CAMINOS */

    ctx.strokeStyle =
        "#a88b62";

    ctx.lineWidth =
        16;


    ctx.beginPath();

    ctx.moveTo(
        plaza.x,
        plaza.y +
        plaza.height / 2
    );

    ctx.lineTo(
        plaza.x +
        plaza.width,
        plaza.y +
        plaza.height / 2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        plaza.x +
        plaza.width / 2,
        plaza.y
    );

    ctx.lineTo(
        plaza.x +
        plaza.width / 2,
        plaza.y +
        plaza.height
    );

    ctx.stroke();


    /* FUENTE */

    ctx.fillStyle =
        "#668f9b";

    ctx.beginPath();

    ctx.arc(
        plaza.x +
        plaza.width / 2,
        plaza.y +
        plaza.height / 2,
        62,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#d7ddd2";

    ctx.lineWidth =
        5;

    ctx.stroke();


    /* ÁRBOLES DE PLAZA */

    const positions = [

        [1900, 1380],
        [2500, 1380],
        [1900, 1680],
        [2500, 1680]

    ];


    positions.forEach(
        p =>
            drawTree(
                p[0],
                p[1]
            )
    );

}


/* =====================================================
   CANALES
===================================================== */

function drawCanals() {

    const canals = [

        {
            x: 0,
            y: 2140,
            width:
                WORLD_WIDTH,
            height:
                42
        },

        {
            x: 850,
            y: 950,
            width:
                40,
            height:
                1100
        },

        {
            x: 3300,
            y: 700,
            width:
                45,
            height:
                1400
        }

    ];


    canals.forEach(
        canal => {

            ctx.fillStyle =
                "#6f5a3f";

            ctx.fillRect(
                canal.x - 7,
                canal.y - 7,
                canal.width + 14,
                canal.height + 14
            );


            ctx.fillStyle =
                "#4e8290";

            ctx.fillRect(
                canal.x,
                canal.y,
                canal.width,
                canal.height
            );


            ctx.fillStyle =
                "rgba(255,255,255,.16)";


            if (
                canal.width >
                canal.height
            ) {

                for (
                    let x =
                        canal.x;
                    x <
                        canal.x +
                        canal.width;
                    x += 60
                ) {

                    ctx.fillRect(
                        x,
                        canal.y + 12,
                        30,
                        3
                    );

                }

            }

        }
    );

}


/* =====================================================
   RÍO
===================================================== */

function drawRiver() {

    ctx.fillStyle =
        "#4f7f8d";


    ctx.beginPath();

    ctx.moveTo(
        0,
        2580
    );

    ctx.bezierCurveTo(
        800,
        2500,
        1200,
        2700,
        1900,
        2600
    );

    ctx.bezierCurveTo(
        2600,
        2500,
        3200,
        2700,
        4200,
        2520
    );

    ctx.lineTo(
        4200,
        2800
    );

    ctx.lineTo(
        0,
        2800
    );

    ctx.closePath();

    ctx.fill();


    /* REFLEJOS */

    ctx.strokeStyle =
        "rgba(210,225,220,.25)";

    ctx.lineWidth =
        4;


    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const x =
            100 +
            i * 160;

        const y =
            2630 +
            Math.sin(i) * 35;


        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x + 70,
            y
        );

        ctx.stroke();

    }

}


/* =====================================================
   BARDAS
===================================================== */

function drawBardas() {

    ctx.fillStyle =
        "#90745a";


    ctx.beginPath();

    ctx.moveTo(
        0,
        0
    );

    ctx.lineTo(
        WORLD_WIDTH,
        0
    );

    ctx.lineTo(
        WORLD_WIDTH,
        420
    );

    ctx.lineTo(
        3600,
        350
    );

    ctx.lineTo(
        3000,
        500
    );

    ctx.lineTo(
        2300,
        410
    );

    ctx.lineTo(
        1500,
        520
    );

    ctx.lineTo(
        700,
        390
    );

    ctx.lineTo(
        0,
        500
    );

    ctx.closePath();

    ctx.fill();


    /* ROCAS */

    ctx.fillStyle =
        "rgba(80,60,45,.25)";


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const x =
            (i * 173) %
            WORLD_WIDTH;

        const y =
            100 +
            ((i * 67) %
            330);


        ctx.beginPath();

        ctx.moveTo(
            x,
            y + 20
        );

        ctx.lineTo(
            x + 18,
            y
        );

        ctx.lineTo(
            x + 35,
            y + 22
        );

        ctx.closePath();

        ctx.fill();

    }

}


/* =====================================================
   ÁRBOLES
===================================================== */

function drawTree(
    x,
    y
) {

    /* tronco */

    ctx.fillStyle =
        "#664631";

    ctx.fillRect(
        x - 7,
        y,
        14,
        42
    );


    /* copa */

    ctx.fillStyle =
        "#42643d";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 4,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#557a46";

    ctx.beginPath();

    ctx.arc(
        x - 15,
        y - 12,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 10,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   ÁLAMOS
===================================================== */

function drawPoplar(
    x,
    y
) {

    ctx.fillStyle =
        "#684733";

    ctx.fillRect(
        x - 5,
        y,
        10,
        65
    );


    ctx.fillStyle =
        "#476a42";

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 45
    );

    ctx.lineTo(
        x - 22,
        y + 15
    );

    ctx.lineTo(
        x + 22,
        y + 15
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 20
    );

    ctx.lineTo(
        x - 25,
        y + 35
    );

    ctx.lineTo(
        x + 25,
        y + 35
    );

    ctx.closePath();

    ctx.fill();

}


/* =====================================================
   VIÑEDOS
===================================================== */

function drawVineyard(
    vineyard
) {

    const spacingX =
        32;

    const spacingY =
        40;


    for (
        let row = 0;
        row <
        vineyard.rows;
        row++
    ) {

        for (
            let col = 0;
            col <
            vineyard.columns;
            col++
        ) {

            const x =
                vineyard.x +
                col *
                spacingX;

            const y =
                vineyard.y +
                row *
                spacingY;


            /* POSTE */

            ctx.fillStyle =
                "#695139";

            ctx.fillRect(
                x,
                y,
                4,
                24
            );


            /* PLANTA */

            ctx.fillStyle =
                "#4f713f";

            ctx.beginPath();

            ctx.arc(
                x + 2,
                y,
                9,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}


/* =====================================================
   EDIFICIOS
===================================================== */

function drawBuildings() {

    buildings.forEach(
        building => {

            /* sombra */

            ctx.fillStyle =
                "rgba(0,0,0,.22)";

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
                "#4b372d";


            ctx.beginPath();

            ctx.moveTo(
                building.x - 15,
                building.y
            );

            ctx.lineTo(
                building.x +
                building.width / 2,
                building.y - 45
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
                "#49342a";

            ctx.fillRect(
                building.x +
                building.width / 2 -
                18,

                building.y +
                building.height -
                60,

                36,
                60
            );


            /* ventanas */

            ctx.fillStyle =
                "#abc2bd";


            ctx.fillRect(
                building.x + 28,
                building.y + 35,
                42,
                40
            );


            ctx.fillRect(
                building.x +
                building.width -
                70,

                building.y + 35,

                42,
                40
            );


            /* nombre */

            ctx.fillStyle =
                "#fff5df";

            ctx.font =
                "bold 14px Arial";

            ctx.fillText(
                building.name,
                building.x,
                building.y +
                building.height +
                22
            );

        }
    );

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(
    npc
) {

    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 12,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#536071";

    ctx.fillRect(
        npc.x - 13,
        npc.y - 2,
        26,
        30
    );


    /* cabeza */

    ctx.fillStyle =
        "#dca985";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 17,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* nombre */

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "13px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 50
    );

    ctx.textAlign =
        "left";


    /* misión */

    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle =
            "#f0c34e";

        ctx.font =
            "bold 25px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "!",
            npc.x,
            npc.y - 45
        );

        ctx.textAlign =
            "left";

    }

}


/* =====================================================
   OBJETOS
===================================================== */

function drawObjects() {

    objects.forEach(
        object => {

            if (
                object.collected
            ) {

                return;

            }


            const pulse =
                Math.sin(
                    Date.now() *
                    .004
                ) * 4;


            /* halo */

            ctx.fillStyle =
                "rgba(236,202,123,.18)";

            ctx.beginPath();

            ctx.arc(
                object.x,
                object.y,
                20 + pulse,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* objeto */

            ctx.font =
                "26px Arial";

            ctx.fillText(

                object.type ===
                "photo"
                    ? "📷"
                    : "📜",

                object.x - 13,
                object.y + 9

            );

        }
    );

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
        x + 14,
        y + 29,
        20,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#263c4e";

    ctx.fillRect(
        x,
        y,
        28,
        30
    );


    /* cabeza */

    ctx.fillStyle =
        "#dfa986";

    ctx.beginPath();

    ctx.arc(
        x + 14,
        y - 9,
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
        x + 14,
        y - 15,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   INTERACCIÓN
===================================================== */

function getNearbyInteraction() {

    let nearest =
        null;

    let nearestDistance =
        Infinity;


    npcs.forEach(
        npc => {

            const d =
                distance(
                    player,
                    npc
                );


            if (
                d <
                nearestDistance
            ) {

                nearest =
                    {
                        type:
                            "npc",

                        target:
                            npc
                    };

                nearestDistance =
                    d;

            }

        }
    );


    objects.forEach(
        object => {

            if (
                object.collected
            ) {

                return;

            }


            const d =
                distance(
                    player,
                    object
                );


            if (
                d <
                nearestDistance
            ) {

                nearest =
                    {
                        type:
                            "object",

                        target:
                            object
                    };

                nearestDistance =
                    d;

            }

        }
    );


    if (
        nearest &&
        nearestDistance <=
        config.interactionDistance
    ) {

        return nearest;

    }


    return null;

}


function interact() {

    if (
        !gameStarted
    ) {

        return;

    }


    const nearby =
        getNearbyInteraction();


    if (
        !nearby
    ) {

        showToast(
            "No hay nada para interactuar acá."
        );

        return;

    }


    if (
        nearby.type ===
        "npc"
    ) {

        const npc =
            nearby.target;


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
                400
            );

        }


        return;

    }


    if (
        nearby.type ===
        "object"
    ) {

        collectObject(
            nearby.target
        );

    }

}


/* =====================================================
   COLECCIONAR
===================================================== */

function collectObject(
    object
) {

    object.collected =
        true;


    inventory.push(
        object
    );


    updateInventory();


    if (
        object.type ===
        "photo"
    ) {

        const count =
            inventory.filter(
                item =>
                    item.type ===
                    "photo"
            ).length;


        document
            .getElementById(
                "photo-count"
            )
            .textContent =
            count;

    }


    if (
        object.type ===
        "document"
    ) {

        const count =
            inventory.filter(
                item =>
                    item.type ===
                    "document"
            ).length;


        document
            .getElementById(
                "document-count"
            )
            .textContent =
            count;

    }


    showToast(
        "Descubriste: " +
        object.name
    );


    if (
        mission.active &&
        object.type ===
        "photo"
    ) {

        mission.active =
            false;

        mission.completed =
            true;

        setMissionHUD();


        setTimeout(
            () => {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "La fotografía puede ayudarnos " +
                    "a reconstruir una parte de " +
                    "la memoria del pueblo."
                );

            },
            500
        );

    }

}


/* =====================================================
   DESCUBRIMIENTOS
===================================================== */

function updateDiscoveries() {

    discoveries.forEach(
        discovery => {

            if (
                discovery.discovered
            ) {

                return;

            }


            if (
                distance(
                    player,
                    discovery
                ) <
                150
            ) {

                discovery.discovered =
                    true;

                discoveryCount++;


                document
                    .getElementById(
                        "discovery-count"
                    )
                    .textContent =
                    discoveryCount;


                showToast(
                    "Lugar descubierto: " +
                    discovery.name
                );

            }

        }
    );

}


/* =====================================================
   DIÁLOGOS
===================================================== */

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


/* =====================================================
   MISIONES
===================================================== */

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


function setMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );


    if (
        mission.completed
    ) {

        hud.textContent =
            "✓ Historia completada";

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


/* =====================================================
   INVENTARIO
===================================================== */

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
                item =>
                    `<div>
                        ${item.type === "photo" ? "📷" : "📜"}
                        <strong>${item.name}</strong>
                        <br>
                        <small>${item.description}</small>
                    </div>`
            )
            .join(
                "<hr>"
            );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    text
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        text;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   MINIMAPA
===================================================== */

function drawMinimap() {

    const w =
        minimap.width;

    const h =
        minimap.height;


    miniCtx.clearRect(
        0,
        0,
        w,
        h
    );


    const sx =
        w /
        WORLD_WIDTH;

    const sy =
        h /
        WORLD_HEIGHT;


    miniCtx.fillStyle =
        "#c8aa73";

    miniCtx.fillRect(
        0,
        0,
        w,
        h
    );


    /* río */

    miniCtx.fillStyle =
        "#4f7f8d";

    miniCtx.fillRect(
        0,
        h * .9,
        w,
        h * .1
    );


    /* plaza */

    miniCtx.fillStyle =
        "#71915d";

    miniCtx.fillRect(
        plaza.x * sx,
        plaza.y * sy,
        plaza.width * sx,
        plaza.height * sy
    );


    /* edificios */

    miniCtx.fillStyle =
        "#654a3d";


    buildings.forEach(
        building => {

            miniCtx.fillRect(
                building.x * sx,
                building.y * sy,
                building.width * sx,
                building.height * sy
            );

        }
    );


    /* viñedos */

    miniCtx.fillStyle =
        "#527343";


    vineyards.forEach(
        vineyard => {

            miniCtx.fillRect(
                vineyard.x * sx,
                vineyard.y * sy,
                vineyard.columns *
                32 *
                sx,
                vineyard.rows *
                40 *
                sy
            );

        }
    );


    /* jugador */

    miniCtx.fillStyle =
        "#ff3d3d";


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
   DÍA / NOCHE
===================================================== */

function drawLighting() {

    worldTime +=
        config.daySpeed;


    const darkness =
        (
            Math.sin(
                worldTime
            ) + 1
        ) / 2;


    ctx.fillStyle =
        `rgba(
            20,
            30,
            65,
            ${darkness * .16}
        )`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* =====================================================
   PAISAJE COMPLETO
===================================================== */

function drawWorld() {

    drawGround();

    drawBardas();

    drawRoads();

    drawPlaza();

    drawCanals();

    drawRiver();


    /* viñedos */

    vineyards.forEach(
        drawVineyard
    );


    /* álamos */

    for (
        let i = 0;
        i < 38;
        i++
    ) {

        drawPoplar(
            500 + i * 85,
            850
        );

    }


    /* árboles */

    trees.forEach(
        tree =>
            drawTree(
                tree.x,
                tree.y
            )
    );

}


/* =====================================================
   DIBUJO PRINCIPAL
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
        drawNPC
    );


    drawPlayer();

    drawLighting();


    ctx.restore();


    drawMinimap();


    /* interacción */

    const nearby =
        getNearbyInteraction();


    const hint =
        document.getElementById(
            "interaction-hint"
        );


    if (
        nearby &&
        gameStarted
    ) {

        hint.style.display =
            "flex";

    } else {

        hint.style.display =
            "none";

    }

}


/* =====================================================
   BOTÓN COMENZAR
===================================================== */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

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
        "Bienvenido a San Patricio del Chañar"
    );

}


/* =====================================================
   JOYSTICK MÓVIL
===================================================== */

const joystick =
    document.getElementById(
        "joystick"
    );

const knob =
    document.getElementById(
        "joystick-knob"
    );


let joystickActive =
    false;


let joystickCenter = {

    x: 0,

    y: 0

};


function joystickStart(
    e
) {

    joystickActive =
        true;


    const rect =
        joystick.getBoundingClientRect();


    joystickCenter.x =
        rect.left +
        rect.width / 2;

    joystickCenter.y =
        rect.top +
        rect.height / 2;


    joystickMove(e);

}


function joystickMove(
    e
) {

    if (
        !joystickActive
    ) {

        return;

    }


    const touch =
        e.touches
            ? e.touches[0]
            : e;


    let dx =
        touch.clientX -
        joystickCenter.x;

    let dy =
        touch.clientY -
        joystickCenter.y;


    const max =
        38;


    const len =
        Math.hypot(
            dx,
            dy
        );


    if (
        len > max
    ) {

        dx =
            dx / len *
            max;

        dy =
            dy / len *
            max;

    }


    knob.style.transform =
        `translate(${dx}px, ${dy}px)`;


    keys["w"] =
        dy < -10;

    keys["s"] =
        dy > 10;

    keys["a"] =
        dx < -10;

    keys["d"] =
        dx > 10;

}


function joystickEnd() {

    joystickActive =
        false;


    knob.style.transform =
        "translate(0,0)";


    keys["w"] =
        false;

    keys["s"] =
        false;

    keys["a"] =
        false;

    keys["d"] =
        false;

}


joystick.addEventListener(
    "touchstart",
    joystickStart,
    {
        passive:
            true
    }
);


joystick.addEventListener(
    "touchmove",
    joystickMove,
    {
        passive:
            true
    }
);


joystick.addEventListener(
    "touchend",
    joystickEnd
);


/* =====================================================
   BOTONES MÓVILES
===================================================== */

document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            interact();

        }
    );


document
    .getElementById(
        "mobile-inventory"
    )
    .addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            toggleInventory();

        }
    );


/* =====================================================
   GUARDADO LOCAL
===================================================== */

function saveGame() {

    const save = {

        player: {

            x:
                player.x,

            y:
                player.y

        },

        inventory:
            inventory.map(
                item =>
                    item.name
            ),

        missionCompleted:
            mission.completed,

        discoveries:
            discoveries.map(
                d =>
                    d.discovered
            )

    };


    localStorage.setItem(
        "chanar-save",
        JSON.stringify(
            save
        )
    );

}


function loadGame() {

    const raw =
        localStorage.getItem(
            "chanar-save"
        );


    if (
        !raw
    ) {

        return;

    }


    try {

        const save =
            JSON.parse(
                raw
            );


        if (
            save.player
        ) {

            player.x =
                save.player.x;

            player.y =
                save.player.y;

        }


        if (
            save.missionCompleted
        ) {

            mission.completed =
                true;

        }


        if (
            save.discoveries
        ) {

            save.discoveries.forEach(
                (
                    discovered,
                    index
                ) => {

                    if (
                        discoveries[index]
                    ) {

                        discoveries[index]
                            .discovered =
                            discovered;

                    }

                }
            );

        }

        setMissionHUD();

    }
    catch (
        error
    ) {

        console.warn(
            "No se pudo cargar la partida."
        );

    }

}


/* =====================================================
   AUTOGUARDADO
===================================================== */

setInterval(
    saveGame,
    10000
);


/* =====================================================
   MOTOR
===================================================== */

function gameLoop() {

    if (
        gameStarted
    ) {

        updatePlayer();

        updateCamera();

        updateDiscoveries();

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   INICIO
===================================================== */

loadGame();

updateInventory();

setMissionHUD();

gameLoop();
