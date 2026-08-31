/* =========================================================
   LOS SECRETOS DEL CHAÑAR
   MOTOR PRINCIPAL
   VERSION ESTRUCTURAL 1.0
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
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

    worldWidth: 4200,

    worldHeight: 3000,

    playerSpeed: 4.2,

    cameraSmooth: 0.12,

    interactionDistance: 85,

    saveKey:
        "los_secretos_del_chanar_save"

};


/* =========================================================
   ESTADO DEL JUEGO
========================================================= */

const game = {

    started: false,

    paused: false,

    elapsed: 0,

    dayTime: 0.35,

    lastTime: 0

};


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
            key === "e" ||
            key === "enter"
        ) {

            if (
                game.started &&
                !game.paused
            ) {

                interact();

            }

        }


        if (
            key === "m"
        ) {

            toggleInventory();

        }


        if (
            key === "escape"
        ) {

            togglePause();

        }


        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                " "
            ].includes(key)
        ) {

            event.preventDefault();

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
   JUGADOR
========================================================= */

const player = {

    x: 2040,

    y: 1450,

    width: 32,

    height: 32,

    speed:
        CONFIG.playerSpeed,

    moving: false,

    frame: 0,

    direction: "down"

};


/* =========================================================
   CÁMARA
========================================================= */

const camera = {

    x: 0,

    y: 0,

    smooth:
        CONFIG.cameraSmooth

};


/* =========================================================
   EDIFICIOS
========================================================= */

const buildings = [

    {
        id: "escuela",

        x: 450,
        y: 470,

        width: 430,
        height: 240,

        color: "#b56c4d",

        name:
            "ESCUELA"

    },

    {
        id: "radio",

        x: 2850,
        y: 470,

        width: 470,
        height: 240,

        color: "#806b58",

        name:
            "RADIO OCARINA"

    },

    {
        id: "almacen",

        x: 430,
        y: 1750,

        width: 360,
        height: 220,

        color: "#9d8068",

        name:
            "ALMACÉN"

    },

    {
        id: "casa",

        x: 2980,
        y: 1820,

        width: 390,
        height: 220,

        color: "#98725b",

        name:
            "CASA"

    },

    {
        id: "museo",

        x: 1880,
        y: 180,

        width: 430,
        height: 230,

        color: "#8e715d",

        name:
            "MUSEO"

    },

    {
        id: "municipalidad",

        x: 1850,
        y: 1050,

        width: 470,
        height: 260,

        color: "#8b735f",

        name:
            "MUNICIPALIDAD"

    },

    {
        id: "iglesia",

        x: 2500,
        y: 1050,

        width: 330,
        height: 390,

        color: "#a38c76",

        name:
            "IGLESIA"

    }

];


/* =========================================================
   ÁRBOLES
========================================================= */

const trees = [

    [180, 180],
    [650, 180],
    [1150, 240],
    [1650, 150],
    [2400, 180],
    [3200, 180],
    [3900, 250],

    [180, 900],
    [900, 850],
    [1350, 700],
    [2400, 760],
    [3500, 820],
    [3950, 950],

    [180, 1500],
    [1000, 1450],
    [1650, 1550],
    [2750, 1500],
    [3650, 1500],

    [170, 2450],
    [800, 2550],
    [1450, 2450],
    [2350, 2600],
    [3200, 2500],
    [3950, 2400]

];


/* =========================================================
   NPC
========================================================= */

const npcs = [

    {

        id: "don-pedro",

        x: 1600,
        y: 1390,

        name:
            "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission:
            true

    },


    {

        id: "maria",

        x: 2180,
        y: 1530,

        name:
            "María",

        text:
            "Las fotografías antiguas " +
            "pueden contar cosas que " +
            "los documentos olvidaron."

    },


    {

        id: "julian",

        x: 2760,
        y: 870,

        name:
            "Julián",

        text:
            "La radio fue durante mucho tiempo " +
            "una de las formas de mantener " +
            "conectada a la comunidad."

    },


    {

        id: "maestra",

        x: 950,
        y: 900,

        name:
            "La maestra",

        text:
            "Preguntá a los vecinos. " +
            "Cada persona guarda una parte " +
            "de la memoria del pueblo."

    }

];


/* =========================================================
   OBJETOS
========================================================= */

const objects = [

    {

        id:
            "foto-01",

        x:
            1120,

        y:
            1420,

        type:
            "photo",

        name:
            "Fotografía antigua",

        description:
            "Una fotografía que muestra " +
            "una escena antigua del pueblo.",

        collected:
            false

    },


    {

        id:
            "doc-01",

        x:
            1450,

        y:
            1950,

        type:
            "document",

        name:
            "Documento antiguo",

        description:
            "Un documento que puede ayudar " +
            "a reconstruir parte de la historia local.",

        collected:
            false

    },


    {

        id:
            "foto-02",

        x:
            2140,

        y:
            650,

        type:
            "photo",

        name:
            "Fotografía del pueblo",

        description:
            "Una antigua imagen relacionada " +
            "con la vida cotidiana.",

        collected:
            false

    },


    {

        id:
            "documento-02",

        x:
            3370,

        y:
            1400,

        type:
            "document",

        name:
            "Documento de archivo",

        description:
            "Un pequeño fragmento documental " +
            "de la memoria del territorio.",

        collected:
            false

    },

    {

        id:
            "foto-03",

        x:
            720,

        y:
            2350,

        type:
            "photo",

        name:
            "Fotografía del paisaje",

        description:
            "Una imagen del paisaje del Chañar.",

        collected:
            false

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

    active:
        false,

    completed:
        false,

    title:
        "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía " +
        "antigua que considera muy importante. " +
        "Encontrala y devolvela."

};


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
   UTILIDADES
========================================================= */

function distance(a, b) {

    const dx =
        a.x - b.x;

    const dy =
        a.y - b.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
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


function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


/* =========================================================
   COLISIONES
========================================================= */

function canMove(x, y) {

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


    return true;

}


/* =========================================================
   MOVIMIENTO
========================================================= */

const mobileInput = {

    x: 0,

    y: 0

};


function updatePlayer(delta) {

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


    dx +=
        mobileInput.x;

    dy +=
        mobileInput.y;


    const magnitude =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        magnitude > 1
    ) {

        dx /=
            magnitude;

        dy /=
            magnitude;

    }


    player.moving =
        Math.abs(dx) > 0.01 ||
        Math.abs(dy) > 0.01;


    if (
        player.moving
    ) {

        player.frame +=
            delta * 10;


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            player.direction =
                dx > 0
                    ? "right"
                    : "left";

        }
        else {

            player.direction =
                dy > 0
                    ? "down"
                    : "up";

        }

    }


    const movement =
        player.speed *
        delta *
        60;


    const nextX =
        player.x +
        dx *
        movement;


    const nextY =
        player.y +
        dy *
        movement;


    if (
        canMove(
            nextX,
            player.y
        )
    ) {

        player.x =
            nextX;

    }


    if (
        canMove(
            player.x,
            nextY
        )
    ) {

        player.y =
            nextY;

    }


    player.x =
        clamp(
            player.x,
            0,
            CONFIG.worldWidth -
            player.width
        );


    player.y =
        clamp(
            player.y,
            0,
            CONFIG.worldHeight -
            player.height
        );

}


/* =========================================================
   CÁMARA
========================================================= */

function updateCamera() {

    const targetX =
        player.x +
        player.width / 2 -
        window.innerWidth / 2;


    const targetY =
        player.y +
        player.height / 2 -
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


    const maxX =
        Math.max(
            0,
            CONFIG.worldWidth -
            window.innerWidth
        );


    const maxY =
        Math.max(
            0,
            CONFIG.worldHeight -
            window.innerHeight
        );


    camera.x =
        clamp(
            camera.x,
            0,
            maxX
        );


    camera.y =
        clamp(
            camera.y,
            0,
            maxY
        );

}


/* =========================================================
   MUNDO
========================================================= */

function drawWorld() {

    /* TIERRA */

    ctx.fillStyle =
        "#c9ac77";

    ctx.fillRect(
        0,
        0,
        CONFIG.worldWidth,
        CONFIG.worldHeight
    );


    /* CAMINOS */

    ctx.fillStyle =
        "#9e8157";


    ctx.fillRect(
        0,
        1260,
        CONFIG.worldWidth,
        190
    );


    ctx.fillRect(
        2000,
        0,
        200,
        CONFIG.worldHeight
    );


    /* CAMINO SECUNDARIO */

    ctx.fillRect(
        600,
        0,
        120,
        CONFIG.worldHeight
    );


    /* PLAZA */

    ctx.fillStyle =
        "#71965a";

    ctx.fillRect(
        1550,
        1100,
        950,
        520
    );


    /* BORDES PLAZA */

    ctx.strokeStyle =
        "rgba(255,255,255,.08)";

    ctx.lineWidth = 5;

    ctx.strokeRect(
        1550,
        1100,
        950,
        520
    );


    /* FUENTE */

    ctx.fillStyle =
        "#7ba0a5";

    ctx.beginPath();

    ctx.arc(
        2025,
        1360,
        90,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#d5e2df";

    ctx.lineWidth =
        5;

    ctx.stroke();


    /* CANAL */

    ctx.fillStyle =
        "#57899a";

    ctx.fillRect(
        0,
        2400,
        CONFIG.worldWidth,
        60
    );


    /* MARGEN CANAL */

    ctx.fillStyle =
        "#66834e";

    ctx.fillRect(
        0,
        2370,
        CONFIG.worldWidth,
        30
    );


    ctx.fillRect(
        0,
        2460,
        CONFIG.worldWidth,
        30
    );


    /* CERROS */

    drawMountains();


    /* VIÑEDOS */

    drawVineyard(
        900,
        560,
        14,
        10
    );


    drawVineyard(
        3400,
        500,
        12,
        10
    );


    drawVineyard(
        900,
        2100,
        14,
        9
    );


    /* ÁRBOLES */

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
   CERROS
========================================================= */

function drawMountains() {

    ctx.fillStyle =
        "#8e795f";


    ctx.beginPath();

    ctx.moveTo(
        0,
        420
    );

    ctx.lineTo(
        450,
        100
    );

    ctx.lineTo(
        850,
        390
    );

    ctx.lineTo(
        1250,
        120
    );

    ctx.lineTo(
        1700,
        400
    );

    ctx.lineTo(
        2200,
        80
    );

    ctx.lineTo(
        2700,
        400
    );

    ctx.lineTo(
        3250,
        120
    );

    ctx.lineTo(
        3700,
        390
    );

    ctx.lineTo(
        CONFIG.worldWidth,
        180
    );

    ctx.lineTo(
        CONFIG.worldWidth,
        0
    );

    ctx.lineTo(
        0,
        0
    );

    ctx.closePath();

    ctx.fill();

}


/* =========================================================
   ÁRBOLES
========================================================= */

function drawTree(x, y) {

    ctx.fillStyle =
        "#65442f";

    ctx.fillRect(
        x - 8,
        y,
        16,
        50
    );


    ctx.fillStyle =
        "#41683c";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        42,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#507b46";

    ctx.beginPath();

    ctx.arc(
        x - 16,
        y - 12,
        27,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   VIÑEDOS
========================================================= */

function drawVineyard(
    x,
    y,
    columns,
    rows
) {

    ctx.lineWidth = 3;

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < columns;
            col++
        ) {

            const px =
                x +
                col * 38;

            const py =
                y +
                row * 34;


            ctx.strokeStyle =
                "#48643d";

            ctx.beginPath();

            ctx.moveTo(
                px,
                py
            );

            ctx.lineTo(
                px,
                py + 24
            );

            ctx.stroke();


            ctx.fillStyle =
                "#4f7a43";

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
            "rgba(0,0,0,.22)";

        ctx.fillRect(
            building.x + 10,
            building.y + 12,
            building.width,
            building.height
        );


        /* cuerpo */

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
            "#49352d";

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


        /* puerta */

        ctx.fillStyle =
            "#49352d";

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
            "#b9d0c9";


        ctx.fillRect(
            building.x + 40,
            building.y + 45,
            48,
            48
        );


        ctx.fillRect(
            building.x +
            building.width -
            88,

            building.y + 45,

            48,
            48
        );


        /* cartel */

        ctx.fillStyle =
            "rgba(0,0,0,.5)";

        ctx.fillRect(
            building.x + 15,
            building.y + 15,
            Math.min(
                180,
                building.width - 30
            ),
            32
        );


        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 16px Arial";

        ctx.fillText(
            building.name,
            building.x + 25,
            building.y + 37
        );

    }

}


/* =========================================================
   NPC
========================================================= */

function drawNPC(npc) {

    const bob =
        Math.sin(
            game.elapsed * 3 +
            npc.x
        ) * 1.5;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.22)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 20,
        19,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#634261";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y + bob,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cabeza */

    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 24 + bob,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* nombre */

    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 13px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 48
    );

    ctx.textAlign =
        "left";


    /* misión */

    if (
        npc.mission &&
        !mission.completed
    ) {

        const pulse =
            1 +
            Math.sin(
                game.elapsed * 5
            ) * .12;

        ctx.save();

        ctx.translate(
            npc.x,
            npc.y - 60
        );

        ctx.scale(
            pulse,
            pulse
        );

        ctx.fillStyle =
            "#f4c542";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            15,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#392b16";

        ctx.font =
            "bold 18px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "!",
            0,
            6
        );

        ctx.restore();

    }

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


        const pulse =
            Math.sin(
                game.elapsed * 4 +
                object.x
            ) * 4;


        ctx.save();

        ctx.translate(
            object.x,
            object.y + pulse
        );


        ctx.shadowBlur =
            20;

        ctx.shadowColor =
            "rgba(255,220,100,.8)";


        ctx.font =
            "30px Arial";


        if (
            object.type ===
            "photo"
        ) {

            ctx.fillText(
                "📷",
                -15,
                10
            );

        }
        else {

            ctx.fillText(
                "📜",
                -15,
                10
            );

        }


        ctx.restore();

    }

}


/* =========================================================
   JUGADOR
========================================================= */

function drawPlayer() {

    const bob =
        player.moving
            ?
            Math.sin(
                player.frame * 8
            ) * 3
            :
            0;


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
        x + 16,
        y + 34,
        23,
        8,
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
        32
    );


    /* cabeza */

    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        x + 16,
        y - 11,
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
        y - 17,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* dirección */

    ctx.fillStyle =
        "rgba(255,255,255,.8)";

    ctx.beginPath();

    if (
        player.direction ===
        "right"
    ) {

        ctx.arc(
            x + 29,
            y + 15,
            2,
            0,
            Math.PI * 2
        );

    }
    else if (
        player.direction ===
        "left"
    ) {

        ctx.arc(
            x + 3,
            y + 15,
            2,
            0,
            Math.PI * 2
        );

    }

    ctx.fill();

}


/* =========================================================
   INTERACCIÓN
========================================================= */

function getNearbyInteraction() {

    let nearest =
        null;

    let nearestDistance =
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
            d <
            CONFIG.interactionDistance &&
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


    for (
        const object
        of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        const d =
            distance(
                player,
                object
            );


        if (
            d <
            CONFIG.interactionDistance &&
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


    return nearest;

}


function updateInteractionHint() {

    const hint =
        document.getElementById(
            "interaction-hint"
        );

    const text =
        document.getElementById(
            "interaction-text"
        );


    if (
        !game.started ||
        game.paused
    ) {

        hint.classList.add(
            "hidden"
        );

        return;

    }


    const nearby =
        getNearbyInteraction();


    if (
        !nearby
    ) {

        hint.classList.add(
            "hidden"
        );

        return;

    }


    if (
        nearby.type ===
        "npc"
    ) {

        text.textContent =
            "E · Hablar con " +
            nearby.target.name;

    }
    else {

        text.textContent =
            "E · Recoger " +
            nearby.target.name;

    }


    hint.classList.remove(
        "hidden"
    );

}


function interact() {

    const nearby =
        getNearbyInteraction();


    if (
        !nearby
    ) {

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
                350
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


/* =========================================================
   COLECCIONAR
========================================================= */

function collectObject(object) {

    object.collected =
        true;


    inventory.push(
        object
    );


    updateInventory();

    updateCounters();

    saveGame();


    showNotification(
        "Encontraste: " +
        object.name
    );


    if (
        mission.active &&
        object.type ===
        "photo"
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
                    "Una pequeña pieza de la memoria " +
                    "del pueblo vuelve a aparecer."

                );

            },
            400
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
        function() {

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
        function() {

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
        "Explorá el pueblo";

}


/* =========================================================
   INVENTARIO
========================================================= */

function toggleInventory() {

    const panel =
        document.getElementById(
            "inventory-panel"
        );


    panel.classList.toggle(
        "hidden"
    );

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

        return;

    }


    container.innerHTML =
        inventory
            .map(
                item =>
                    "• " +
                    item.name
            )
            .join(
                "<br>"
            );

}


function updateCounters() {

    const photos =
        inventory.filter(
            item =>
                item.type ===
                "photo"
        ).length;


    const documents =
        inventory.filter(
            item =>
                item.type ===
                "document"
        ).length;


    document
        .getElementById(
            "photo-count"
        )
        .textContent =
        photos;


    document
        .getElementById(
            "document-count"
        )
        .textContent =
        documents;

}


document
    .getElementById(
        "inventory-button"
    )
    .addEventListener(
        "click",
        toggleInventory
    );


document
    .getElementById(
        "inventory-close"
    )
    .addEventListener(
        "click",
        function() {

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
   PAUSA
========================================================= */

function togglePause() {

    if (
        !game.started
    ) {

        return;

    }


    game.paused =
        !game.paused;


    document
        .getElementById(
            "pause-panel"
        )
        .classList.toggle(
            "hidden",
            !game.paused
        );

}


document
    .getElementById(
        "pause-button"
    )
    .addEventListener(
        "click",
        togglePause
    );


document
    .getElementById(
        "resume-button"
    )
    .addEventListener(
        "click",
        togglePause
    );


document
    .getElementById(
        "restart-button"
    )
    .addEventListener(
        "click",
        restartGame
    );


/* =========================================================
   NOTIFICACIONES
========================================================= */

function showNotification(
    message
) {

    const container =
        document.getElementById(
            "notification-container"
        );


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "notification";


    notification.textContent =
        message;


    container.appendChild(
        notification
    );


    setTimeout(
        function() {

            notification.remove();

        },
        2500
    );

}


/* =========================================================
   MINIMAPA
========================================================= */

function drawMinimap() {

    const width =
        minimap.width;

    const height =
        minimap.height;


    miniCtx.clearRect(
        0,
        0,
        width,
        height
    );


    const scaleX =
        width /
        CONFIG.worldWidth;


    const scaleY =
        height /
        CONFIG.worldHeight;


    /* fondo */

    miniCtx.fillStyle =
        "#c9ac77";

    miniCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /* caminos */

    miniCtx.fillStyle =
        "#9e8157";

    miniCtx.fillRect(
        0,
        1260 * scaleY,
        width,
        190 * scaleY
    );


    miniCtx.fillRect(
        2000 * scaleX,
        0,
        200 * scaleX,
        height
    );


    /* plaza */

    miniCtx.fillStyle =
        "#71965a";

    miniCtx.fillRect(
        1550 * scaleX,
        1100 * scaleY,
        950 * scaleX,
        520 * scaleY
    );


    /* edificios */

    miniCtx.fillStyle =
        "#76594a";


    for (
        const building
        of buildings
    ) {

        miniCtx.fillRect(

            building.x *
            scaleX,

            building.y *
            scaleY,

            building.width *
            scaleX,

            building.height *
            scaleY

        );

    }


    /* objetos */

    miniCtx.fillStyle =
        "#e2b75e";


    for (
        const object
        of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        miniCtx.beginPath();

        miniCtx.arc(

            object.x *
            scaleX,

            object.y *
            scaleY,

            2,

            0,
            Math.PI * 2

        );

        miniCtx.fill();

    }


    /* jugador */

    miniCtx.fillStyle =
        "#ff3333";


    miniCtx.beginPath();

    miniCtx.arc(

        player.x *
        scaleX,

        player.y *
        scaleY,

        4,

        0,
        Math.PI * 2

    );

    miniCtx.fill();

}


/* =========================================================
   DÍA / NOCHE
========================================================= */

function updateDayNight(delta) {

    game.dayTime +=
        delta *
        0.015;


    if (
        game.dayTime > 1
    ) {

        game.dayTime = 0;

    }

}


function drawLighting() {

    const angle =
        game.dayTime *
        Math.PI *
        2;


    const darkness =
        (
            Math.sin(angle) +
            1
        ) / 2;


    const alpha =
        darkness *
        0.20;


    ctx.fillStyle =
        `rgba(20,30,70,${alpha})`;


    ctx.fillRect(
        0,
        0,
        CONFIG.worldWidth,
        CONFIG.worldHeight
    );

}


/* =========================================================
   GUARDADO
========================================================= */

function saveGame() {

    const data = {

        player: {

            x:
                player.x,

            y:
                player.y

        },

        inventory:
            inventory.map(
                item =>
                    item.id
            ),

        mission: {

            active:
                mission.active,

            completed:
                mission.completed

        }

    };


    try {

        localStorage.setItem(

            CONFIG.saveKey,

            JSON.stringify(
                data
            )

        );

    }
    catch(error) {

        console.warn(
            "No se pudo guardar la partida.",
            error
        );

    }

}


/* =========================================================
   CARGAR PARTIDA
========================================================= */

function loadGame() {

    try {

        const raw =
            localStorage.getItem(
                CONFIG.saveKey
            );


        if (
            !raw
        ) {

            return;

        }


        const data =
            JSON.parse(
                raw
            );


        if (
            data.player
        ) {

            player.x =
                data.player.x;

            player.y =
                data.player.y;

        }


        if (
            Array.isArray(
                data.inventory
            )
        ) {

            for (
                const id
                of data.inventory
            ) {

                const object =
                    objects.find(
                        item =>
                            item.id ===
                            id
                    );


                if (
                    object
                ) {

                    object.collected =
                        true;

                    inventory.push(
                        object
                    );

                }

            }

        }


        if (
            data.mission
        ) {

            mission.active =
                data.mission.active;

            mission.completed =
                data.mission.completed;

        }


        updateInventory();

        updateCounters();

        setMissionHUD();

    }
    catch(error) {

        console.warn(
            "No se pudo cargar la partida.",
            error
        );

    }

}


/* =========================================================
   REINICIAR
========================================================= */

function restartGame() {

    localStorage.removeItem(
        CONFIG.saveKey
    );


    location.reload();

}


/* =========================================================
   START
========================================================= */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        function() {

            game.started =
                true;

            game.paused =
                false;


            document
                .getElementById(
                    "start-screen"
                )
                .classList
                .add(
                    "hidden"
                );


            showNotification(
                "Bienvenido a San Patricio del Chañar"
            );


            saveGame();

        }
    );


/* =========================================================
   JOYSTICK
========================================================= */

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

let joystickPointerId =
    null;


function updateJoystick(
    clientX,
    clientY
) {

    const rect =
        joystick.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    let dx =
        clientX -
        centerX;


    let dy =
        clientY -
        centerY;


    const max =
        rect.width / 2 -
        26;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
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


    knob.style.transform =
        `translate(${dx}px, ${dy}px)`;


    mobileInput.x =
        dx / max;


    mobileInput.y =
        dy / max;

}


function resetJoystick() {

    joystickActive =
        false;

    joystickPointerId =
        null;

    mobileInput.x =
        0;

    mobileInput.y =
        0;

    knob.style.transform =
        "translate(0px,0px)";

}


joystick.addEventListener(
    "pointerdown",
    function(event) {

        joystickActive =
            true;

        joystickPointerId =
            event.pointerId;

        joystick.setPointerCapture(
            event.pointerId
        );

        updateJoystick(
            event.clientX,
            event.clientY
        );

    }
);


joystick.addEventListener(
    "pointermove",
    function(event) {

        if (
            !joystickActive ||
            event.pointerId !==
            joystickPointerId
        ) {

            return;

        }


        updateJoystick(
            event.clientX,
            event.clientY
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


/* =========================================================
   BOTÓN INTERACTUAR MOBILE
========================================================= */

document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            if (
                game.started &&
                !game.paused
            ) {

                interact();

            }

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
   DIBUJADO PRINCIPAL
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

    drawBuildings();

    drawObjects();


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


    ctx.restore();


    drawMinimap();

}


/* =========================================================
   MOTOR
========================================================= */

function gameLoop(timestamp) {

    if (
        !game.lastTime
    ) {

        game.lastTime =
            timestamp;

    }


    let delta =
        (
            timestamp -
            game.lastTime
        ) / 1000;


    game.lastTime =
        timestamp;


    delta =
        Math.min(
            delta,
            0.05
        );


    if (
        game.started &&
        !game.paused
    ) {

        game.elapsed +=
            delta;


        updatePlayer(
            delta
        );

        updateCamera();

        updateDayNight(
            delta
        );

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

loadGame();

updateInventory();

updateCounters();

setMissionHUD();

requestAnimationFrame(
    gameLoop
);
