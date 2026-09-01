/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   game.js
   VERSIÓN 1.0
   MOTOR TERRITORIAL
   PC + CELULAR
===================================================== */


/* =====================================================
   1. CANVAS
===================================================== */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const miniCtx = minimap.getContext("2d");


/* =====================================================
   2. CONFIGURACIÓN DEL MUNDO
===================================================== */

const WORLD = {
    width: 4200,
    height: 3000
};


/* =====================================================
   3. CONFIGURACIÓN DEL CANVAS
===================================================== */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =====================================================
   4. ESTADO DEL JUEGO
===================================================== */

let gameStarted = false;
let paused = false;

let worldTime = 0;

const keys = {};

const inventory = [];


/* =====================================================
   5. CÁMARA
===================================================== */

const camera = {

    x: 0,
    y: 0,

    smooth: 0.10

};


/* =====================================================
   6. JUGADOR
===================================================== */

const player = {

    x: 2070,
    y: 1450,

    width: 30,
    height: 30,

    speed: 4.5,

    moving: false,

    frame: 0,

    direction: "down"

};


/* =====================================================
   7. ESTADO DE MISIÓN
===================================================== */

const mission = {

    active: false,

    completed: false,

    title: "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía antigua. " +
        "Recorré el pueblo y encontrala.",

    target: "photo_01"

};


/* =====================================================
   8. EDIFICIOS
===================================================== */

const buildings = [

    {
        id: "school",

        x: 500,
        y: 500,

        width: 430,
        height: 230,

        color: "#b56c4d",

        name: "ESCUELA"
    },


    {
        id: "museum",

        x: 1850,
        y: 300,

        width: 430,
        height: 230,

        color: "#8e715d",

        name: "MUSEO"
    },


    {
        id: "radio",

        x: 3100,
        y: 550,

        width: 470,
        height: 240,

        color: "#806b58",

        name: "RADIO OCARINA"
    },


    {
        id: "store",

        x: 480,
        y: 1900,

        width: 350,
        height: 220,

        color: "#9d8068",

        name: "ALMACÉN"
    },


    {
        id: "house",

        x: 3200,
        y: 2050,

        width: 400,
        height: 230,

        color: "#98725b",

        name: "CASA"
    },


    {
        id: "municipal",

        x: 1750,
        y: 2150,

        width: 470,
        height: 250,

        color: "#927762",

        name: "MUNICIPALIDAD"
    }

];


/* =====================================================
   9. ÁRBOLES
===================================================== */

const trees = [

    [180,180],
    [650,200],
    [1200,180],
    [2700,190],
    [3700,220],

    [250,1050],
    [1000,900],
    [2850,1000],
    [3900,1050],

    [200,2500],
    [900,2700],
    [1500,2550],
    [2700,2700],
    [3900,2500],

    [1100,1500],
    [2900,1500],

    [1250,450],
    [2800,450]

];


/* =====================================================
   10. NPC
===================================================== */

const npcs = [

    {
        id: "pedro",

        x: 1150,
        y: 1370,

        name: "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission: true
    },


    {
        id: "maria",

        x: 2300,
        y: 1450,

        name: "María",

        text:
            "Las fotografías antiguas " +
            "pueden contarnos cómo era " +
            "el Chañar antes."
    },


    {
        id: "julian",

        x: 2950,
        y: 1200,

        name: "Julián",

        text:
            "La radio siempre fue una forma " +
            "de unir a la gente del pueblo."
    },


    {
        id: "teacher",

        x: 1050,
        y: 700,

        name: "El maestro",

        text:
            "Las escuelas también guardan " +
            "parte de la memoria de un pueblo."
    }

];


/* =====================================================
   11. OBJETOS COLECCIONABLES
===================================================== */

const objects = [

    {
        id: "photo_01",

        x: 900,
        y: 1450,

        type: "photo",

        name: "Fotografía antigua",

        description:
            "Una fotografía que podría ayudar " +
            "a reconstruir la memoria del pueblo.",

        collected: false
    },


    {
        id: "photo_02",

        x: 1500,
        y: 650,

        type: "photo",

        name: "Fotografía del pueblo",

        description:
            "Una vieja imagen del paisaje " +
            "del Chañar.",

        collected: false
    },


    {
        id: "document_01",

        x: 2600,
        y: 1700,

        type: "document",

        name: "Documento antiguo",

        description:
            "Un documento que contiene " +
            "información sobre el territorio.",

        collected: false
    },


    {
        id: "document_02",

        x: 2350,
        y: 2450,

        type: "document",

        name: "Registro histórico",

        description:
            "Un antiguo registro encontrado " +
            "en las cercanías del pueblo.",

        collected: false
    }

];


/* =====================================================
   12. CAMINOS
===================================================== */

const roads = [

    {
        x: 0,
        y: 1250,
        width: WORLD.width,
        height: 220
    },


    {
        x: 1960,
        y: 0,
        width: 220,
        height: WORLD.height
    },


    {
        x: 700,
        y: 650,
        width: 1450,
        height: 110
    },


    {
        x: 2200,
        y: 1500,
        width: 1500,
        height: 110
    }

];


/* =====================================================
   13. VIÑEDOS
===================================================== */

const vineyards = [

    {
        x: 300,
        y: 850,

        rows: 10,
        columns: 16
    },


    {
        x: 2700,
        y: 850,

        rows: 10,
        columns: 18
    },


    {
        x: 800,
        y: 2250,

        rows: 9,
        columns: 16
    }

];


/* =====================================================
   14. CANALES
===================================================== */

const canals = [

    {
        x: 0,
        y: 2580,

        width: WORLD.width,
        height: 55
    },


    {
        x: 1150,
        y: 0,

        width: 45,
        height: 900
    }

];


/* =====================================================
   15. TECLADO
===================================================== */

document.addEventListener("keydown", function(e) {

    const key = e.key.toLowerCase();

    keys[key] = true;


    if (
        key === "e" &&
        gameStarted &&
        !paused
    ) {

        interact();

    }


    if (
        key === "m" &&
        gameStarted
    ) {

        toggleInventory();

    }


    if (
        key === "escape" &&
        gameStarted
    ) {

        togglePause();

    }

});


document.addEventListener("keyup", function(e) {

    keys[e.key.toLowerCase()] = false;

});


/* =====================================================
   16. BOTÓN COMENZAR
===================================================== */

const startButton =
    document.getElementById("start-button");


startButton.addEventListener("click", function() {

    gameStarted = true;

    paused = false;

    const screen =
        document.getElementById("start-screen");

    screen.classList.add("hidden");

    showMessage(
        "Bienvenido a San Patricio del Chañar"
    );

    saveGame();

});


/* =====================================================
   17. PAUSA
===================================================== */

function togglePause() {

    paused = !paused;

    const panel =
        document.getElementById("pause-panel");

    if (paused) {

        panel.classList.remove("hidden");

    } else {

        panel.classList.add("hidden");

    }

}


const resumeButton =
    document.getElementById("resume-button");


if (resumeButton) {

    resumeButton.addEventListener(
        "click",
        function() {

            paused = false;

            document
                .getElementById("pause-panel")
                .classList.add("hidden");

        }
    );

}


/* =====================================================
   18. UTILIDADES
===================================================== */

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


/* =====================================================
   19. MOVIMIENTO
===================================================== */

function canMove(x, y) {

    const test = {

        x: x,

        y: y,

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


/* =====================================================
   20. ACTUALIZAR JUGADOR
===================================================== */

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


    /* JOYSTICK */

    dx += joystick.x;
    dy += joystick.y;


    const length =
        Math.hypot(dx, dy);


    if (length > 0) {

        dx /= length;
        dy /= length;

    }


    dx *= player.speed;
    dy *= player.speed;


    player.moving =
        Math.abs(dx) > 0 ||
        Math.abs(dy) > 0;


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


    player.x =
        Math.max(
            0,
            Math.min(
                WORLD.width -
                player.width,
                player.x
            )
        );


    player.y =
        Math.max(
            0,
            Math.min(
                WORLD.height -
                player.height,
                player.y
            )
        );

}


/* =====================================================
   21. CÁMARA
===================================================== */

function updateCamera() {

    const targetX =
        player.x +
        player.width / 2 -
        canvas.width / 2;


    const targetY =
        player.y +
        player.height / 2 -
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
            WORLD.width -
            canvas.width
        );


    const maxCameraY =
        Math.max(
            0,
            WORLD.height -
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


/* =====================================================
   22. DIBUJAR TERRENO
===================================================== */

function drawWorld() {

    /* TIERRA */

    ctx.fillStyle =
        "#c7ad7b";

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );


    /* ZONA DE CERROS */

    drawMountains();


    /* CAMINOS */

    drawRoads();


    /* PLAZA CENTRAL */

    ctx.fillStyle =
        "#72945d";

    ctx.fillRect(
        1450,
        1050,
        800,
        480
    );


    /* BORDE DE PLAZA */

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.lineWidth = 5;

    ctx.strokeRect(
        1450,
        1050,
        800,
        480
    );


    /* FUENTE */

    ctx.fillStyle =
        "#759ba0";

    ctx.beginPath();

    ctx.arc(
        1850,
        1290,
        75,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "rgba(255,255,255,0.25)";

    ctx.beginPath();

    ctx.arc(
        1830,
        1270,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CANALES */

    drawCanals();


    /* VIÑEDOS */

    for (
        const vineyard of vineyards
    ) {

        drawVineyard(vineyard);

    }


    /* ÁRBOLES */

    for (
        const tree of trees
    ) {

        drawTree(
            tree[0],
            tree[1]
        );

    }

}


/* =====================================================
   23. CERROS
===================================================== */

function drawMountains() {

    ctx.fillStyle =
        "#8c7a62";


    ctx.beginPath();

    ctx.moveTo(0, 400);

    ctx.lineTo(500, 100);

    ctx.lineTo(1000, 390);

    ctx.lineTo(1500, 120);

    ctx.lineTo(2050, 420);

    ctx.lineTo(2600, 100);

    ctx.lineTo(3150, 390);

    ctx.lineTo(3700, 130);

    ctx.lineTo(WORLD.width, 430);

    ctx.lineTo(WORLD.width, 0);

    ctx.lineTo(0, 0);

    ctx.closePath();

    ctx.fill();


    /* SEGUNDA CAPA */

    ctx.fillStyle =
        "rgba(75,68,59,0.22)";


    ctx.beginPath();

    ctx.moveTo(0, 530);

    ctx.lineTo(600, 280);

    ctx.lineTo(1150, 520);

    ctx.lineTo(1750, 250);

    ctx.lineTo(2350, 530);

    ctx.lineTo(3000, 270);

    ctx.lineTo(3600, 500);

    ctx.lineTo(WORLD.width, 300);

    ctx.lineTo(WORLD.width, 650);

    ctx.lineTo(0, 650);

    ctx.closePath();

    ctx.fill();

}


/* =====================================================
   24. CAMINOS
===================================================== */

function drawRoads() {

    for (
        const road of roads
    ) {

        ctx.fillStyle =
            "#9d8059";

        ctx.fillRect(
            road.x,
            road.y,
            road.width,
            road.height
        );


        /* BORDES */

        ctx.strokeStyle =
            "rgba(85,65,45,0.25)";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            road.x,
            road.y,
            road.width,
            road.height
        );

    }

}


/* =====================================================
   25. CANALES
===================================================== */

function drawCanals() {

    for (
        const canal of canals
    ) {

        ctx.fillStyle =
            "#568a98";

        ctx.fillRect(
            canal.x,
            canal.y,
            canal.width,
            canal.height
        );


        ctx.fillStyle =
            "rgba(255,255,255,0.18)";


        if (
            canal.width >
            canal.height
        ) {

            for (
                let x = canal.x;
                x < canal.x + canal.width;
                x += 70
            ) {

                ctx.fillRect(
                    x,
                    canal.y + 10,
                    35,
                    3
                );

            }

        } else {

            for (
                let y = canal.y;
                y < canal.y + canal.height;
                y += 70
            ) {

                ctx.fillRect(
                    canal.x + 10,
                    y,
                    3,
                    35
                );

            }

        }

    }

}


/* =====================================================
   26. ÁRBOLES
===================================================== */

function drawTree(x, y) {

    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,0.18)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 38,
        30,
        10,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* TRONCO */

    ctx.fillStyle =
        "#65462f";

    ctx.fillRect(
        x - 7,
        y,
        14,
        42
    );


    /* COPA */

    ctx.fillStyle =
        "#3e673d";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 4,
        38,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#527c47";

    ctx.beginPath();

    ctx.arc(
        x - 15,
        y - 14,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   27. VIÑEDOS
===================================================== */

function drawVineyard(vineyard) {

    for (
        let row = 0;
        row < vineyard.rows;
        row++
    ) {

        for (
            let col = 0;
            col < vineyard.columns;
            col++
        ) {

            const x =
                vineyard.x +
                col * 38;


            const y =
                vineyard.y +
                row * 38;


            /* POSTE */

            ctx.strokeStyle =
                "#4c5e39";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y + 27
            );

            ctx.stroke();


            /* PLANTA */

            ctx.fillStyle =
                "#4f7744";

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


/* =====================================================
   28. EDIFICIOS
===================================================== */

function drawBuildings() {

    for (
        const building of buildings
    ) {

        /* SOMBRA */

        ctx.fillStyle =
            "rgba(0,0,0,0.22)";

        ctx.fillRect(
            building.x + 12,
            building.y + 14,
            building.width,
            building.height
        );


        /* EDIFICIO */

        ctx.fillStyle =
            building.color;

        ctx.fillRect(
            building.x,
            building.y,
            building.width,
            building.height
        );


        /* TECHO */

        ctx.fillStyle =
            "#49352d";

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


        /* PUERTA */

        ctx.fillStyle =
            "#49352d";

        ctx.fillRect(

            building.x +
            building.width / 2 - 22,

            building.y +
            building.height - 75,

            44,
            75

        );


        /* VENTANAS */

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


        /* NOMBRE */

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 18px Arial";

        ctx.fillText(
            building.name,
            building.x,
            building.y +
            building.height +
            28
        );

    }

}


/* =====================================================
   29. NPC
===================================================== */

function drawNPC(npc) {

    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,0.22)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 15,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CUERPO */

    ctx.fillStyle =
        "#5e405b";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CABEZA */

    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 22,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* NOMBRE */

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "14px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 42
    );

    ctx.textAlign =
        "left";


    /* MISIÓN */

    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle =
            "#f3c442";

        ctx.font =
            "bold 25px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "!",
            npc.x,
            npc.y - 48
        );

        ctx.textAlign =
            "left";

    }

}


/* =====================================================
   30. OBJETOS
===================================================== */

function drawObjects() {

    for (
        const object of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        /* BRILLO */

        const pulse =
            Math.sin(
                performance.now() / 300
            ) * 3;


        ctx.globalAlpha =
            0.18;


        ctx.fillStyle =
            "#f3cf65";


        ctx.beginPath();

        ctx.arc(
            object.x,
            object.y - 5,
            22 + pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.globalAlpha = 1;


        /* ICONO */

        ctx.font =
            "27px Arial";


        if (
            object.type === "photo"
        ) {

            ctx.fillText(
                "📷",
                object.x - 14,
                object.y + 7
            );

        } else {

            ctx.fillText(
                "📜",
                object.x - 14,
                object.y + 7
            );

        }

    }

}


/* =====================================================
   31. JUGADOR
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


    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,0.28)";

    ctx.beginPath();

    ctx.ellipse(
        x + 15,
        y + 34,
        22,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CUERPO */

    ctx.fillStyle =
        "#263b4c";

    ctx.fillRect(
        x,
        y,
        30,
        30
    );


    /* CABEZA */

    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 10,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* PELO */

    ctx.fillStyle =
        "#33251e";

    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 16,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* INDICADOR */

    ctx.strokeStyle =
        "rgba(255,255,255,0.55)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x - 3,
        y - 14,
        36,
        48
    );

}


/* =====================================================
   32. INTERACCIÓN
===================================================== */

function interact() {

    /* NPC */

    let nearestNPC = null;
    let nearestDistance = Infinity;


    for (
        const npc of npcs
    ) {

        const d =
            distance(
                player,
                npc
            );


        if (
            d < 95 &&
            d < nearestDistance
        ) {

            nearestNPC = npc;
            nearestDistance = d;

        }

    }


    if (nearestNPC) {

        showDialogue(
            nearestNPC.name,
            nearestNPC.text
        );


        if (
            nearestNPC.mission &&
            !mission.active &&
            !mission.completed
        ) {

            mission.active = true;

            setMissionHUD();

            setTimeout(
                showMission,
                400
            );

        }


        return;

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
            ) < 75
        ) {

            collectObject(object);

            return;

        }

    }

}


/* =====================================================
   33. COLECCIONAR
===================================================== */

function collectObject(object) {

    object.collected = true;


    inventory.push({

        id: object.id,

        name: object.name,

        type: object.type,

        description:
            object.description

    });


    updateInventory();


    updateCounters();


    showMessage(
        "Encontraste: " +
        object.name
    );


    if (
        mission.active &&
        object.id === mission.target
    ) {

        mission.completed = true;

        mission.active = false;

        setMissionHUD();


        setTimeout(
            function() {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "Encontraste la fotografía perdida. " +
                    "Ahora podemos empezar a reconstruir " +
                    "parte de la memoria del pueblo."
                );

            },
            500
        );

    }


    saveGame();

}


/* =====================================================
   34. DIÁLOGOS
===================================================== */

function showDialogue(name, text) {

    const dialogue =
        document.getElementById(
            "dialogue"
        );


    document.getElementById(
        "dialogue-name"
    ).textContent = name;


    document.getElementById(
        "dialogue-text"
    ).textContent = text;


    dialogue.classList.remove(
        "hidden"
    );

}


document
    .getElementById("dialogue-close")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("dialogue")
                .classList
                .add("hidden");

        }
    );


/* =====================================================
   35. MISIONES
===================================================== */

function showMission() {

    document.getElementById(
        "mission-title"
    ).textContent =
        mission.title;


    document.getElementById(
        "mission-description"
    ).textContent =
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
        function() {

            document
                .getElementById("mission-panel")
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
            "✓ Misión completada";

        return;

    }


    if (
        mission.active
    ) {

        hud.textContent =
            "Misión: encontrá la fotografía";

        return;

    }


    hud.textContent =
        "Explorá el pueblo";

}


/* =====================================================
   36. INVENTARIO
===================================================== */

function toggleInventory() {

    const panel =
        document.getElementById(
            "inventory-panel"
        );


    panel.classList.toggle(
        "hidden"
    );

}


document
    .getElementById("inventory-close")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("inventory-panel")
                .classList
                .add("hidden");

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
            .join("<br>");

}


function updateCounters() {

    const photos =
        inventory.filter(
            item =>
                item.type === "photo"
        ).length;


    const documents =
        inventory.filter(
            item =>
                item.type === "document"
        ).length;


    document.getElementById(
        "photo-count"
    ).textContent = photos;


    document.getElementById(
        "document-count"
    ).textContent = documents;

}


/* =====================================================
   37. MENSAJES
===================================================== */

let messageTimer = null;


function showMessage(text) {

    const message =
        document.getElementById(
            "game-message"
        );


    const messageText =
        document.getElementById(
            "game-message-text"
        );


    messageText.textContent =
        text;


    message.classList.remove(
        "hidden"
    );


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            function() {

                message.classList.add(
                    "hidden"
                );

            },
            2500
        );

}


/* =====================================================
   38. INDICADOR DE INTERACCIÓN
===================================================== */

function updateInteractionHint() {

    const hint =
        document.getElementById(
            "interaction-hint"
        );


    let nearby = false;


    for (
        const npc of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 95
        ) {

            nearby = true;

            break;

        }

    }


    if (!nearby) {

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
                ) < 75
            ) {

                nearby = true;

                break;

            }

        }

    }


    if (
        nearby &&
        gameStarted &&
        !paused
    ) {

        hint.classList.remove(
            "hidden"
        );

    } else {

        hint.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   39. MINIMAPA
===================================================== */

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
        WORLD.width;


    const scaleY =
        height /
        WORLD.height;


    /* TERRENO */

    miniCtx.fillStyle =
        "#c7ad7b";

    miniCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /* CAMINOS */

    miniCtx.fillStyle =
        "#9d8059";


    for (
        const road of roads
    ) {

        miniCtx.fillRect(
            road.x * scaleX,
            road.y * scaleY,
            road.width * scaleX,
            road.height * scaleY
        );

    }


    /* PLAZA */

    miniCtx.fillStyle =
        "#72945d";

    miniCtx.fillRect(
        1450 * scaleX,
        1050 * scaleY,
        800 * scaleX,
        480 * scaleY
    );


    /* EDIFICIOS */

    miniCtx.fillStyle =
        "#76594a";


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


    /* CANALES */

    miniCtx.fillStyle =
        "#568a98";


    for (
        const canal of canals
    ) {

        miniCtx.fillRect(
            canal.x * scaleX,
            canal.y * scaleY,
            canal.width * scaleX,
            canal.height * scaleY
        );

    }


    /* OBJETOS */

    miniCtx.fillStyle =
        "#e7c75c";


    for (
        const object of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        miniCtx.beginPath();

        miniCtx.arc(
            object.x * scaleX,
            object.y * scaleY,
            2,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    }


    /* NPC */

    miniCtx.fillStyle =
        "#70456a";


    for (
        const npc of npcs
    ) {

        miniCtx.beginPath();

        miniCtx.arc(
            npc.x * scaleX,
            npc.y * scaleY,
            2.5,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    }


    /* JUGADOR */

    miniCtx.fillStyle =
        "#ff3333";


    miniCtx.beginPath();

    miniCtx.arc(
        (
            player.x +
            player.width / 2
        ) * scaleX,

        (
            player.y +
            player.height / 2
        ) * scaleY,

        4,

        0,
        Math.PI * 2
    );

    miniCtx.fill();

}


/* =====================================================
   40. CICLO DÍA / NOCHE
===================================================== */

function drawLighting() {

    worldTime += 0.00025;


    const cycle =
        (
            Math.sin(
                worldTime
            ) + 1
        ) / 2;


    const darkness =
        cycle * 0.16;


    ctx.fillStyle =
        `rgba(20,30,70,${darkness})`;


    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );

}


/* =====================================================
   41. JOYSTICK
===================================================== */

const joystick = {

    x: 0,
    y: 0,

    active: false,

    pointerId: null

};


const joystickArea =
    document.getElementById(
        "joystick-area"
    );


const joystickBase =
    document.getElementById(
        "joystick-base"
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
        joystickBase.getBoundingClientRect();


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


    const maxDistance =
        rect.width / 2 -
        20;


    const length =
        Math.hypot(
            dx,
            dy
        );


    if (
        length >
        maxDistance
    ) {

        dx =
            dx /
            length *
            maxDistance;


        dy =
            dy /
            length *
            maxDistance;

    }


    joystick.x =
        dx /
        maxDistance;


    joystick.y =
        dy /
        maxDistance;


    joystickStick.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

}


function resetJoystick() {

    joystick.x = 0;
    joystick.y = 0;

    joystick.active = false;

    joystickStick.style.transform =
        "translate(-50%, -50%)";

}


if (joystickArea) {

    joystickArea.addEventListener(
        "pointerdown",
        function(e) {

            joystick.active = true;

            joystick.pointerId =
                e.pointerId;

            joystickArea.setPointerCapture(
                e.pointerId
            );

            updateJoystick(
                e.clientX,
                e.clientY
            );

        }
    );


    joystickArea.addEventListener(
        "pointermove",
        function(e) {

            if (
                !joystick.active
            ) {

                return;

            }


            updateJoystick(
                e.clientX,
                e.clientY
            );

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

}


/* =====================================================
   42. BOTONES CELULAR
===================================================== */

const mobileInteract =
    document.getElementById(
        "mobile-interact"
    );


if (mobileInteract) {

    mobileInteract.addEventListener(
        "pointerdown",
        function(e) {

            e.preventDefault();

            if (
                gameStarted &&
                !paused
            ) {

                interact();

            }

        }
    );

}


const mobileInventory =
    document.getElementById(
        "mobile-inventory"
    );


if (mobileInventory) {

    mobileInventory.addEventListener(
        "pointerdown",
        function(e) {

            e.preventDefault();

            if (gameStarted) {

                toggleInventory();

            }

        }
    );

}


/* =====================================================
   43. GUARDADO LOCAL
===================================================== */

function saveGame() {

    const saveData = {

        player: {

            x: player.x,
            y: player.y

        },

        inventory: inventory,

        mission: {

            active:
                mission.active,

            completed:
                mission.completed

        },

        objects:
            objects.map(
                object => ({

                    id: object.id,

                    collected:
                        object.collected

                })
            )

    };


    try {

        localStorage.setItem(
            "secretos_chanar_save",
            JSON.stringify(saveData)
        );

    } catch (error) {

        console.warn(
            "No se pudo guardar la partida."
        );

    }

}


/* =====================================================
   44. CARGAR PARTIDA
===================================================== */

function loadGame() {

    try {

        const raw =
            localStorage.getItem(
                "secretos_chanar_save"
            );


        if (!raw) {

            return;

        }


        const data =
            JSON.parse(raw);


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

            inventory.length = 0;

            inventory.push(
                ...data.inventory
            );

        }


        if (
            data.mission
        ) {

            mission.active =
                !!data.mission.active;

            mission.completed =
                !!data.mission.completed;

        }


        if (
            Array.isArray(
                data.objects
            )
        ) {

            for (
                const savedObject
                of data.objects
            ) {

                const object =
                    objects.find(
                        item =>
                            item.id ===
                            savedObject.id
                    );


                if (object) {

                    object.collected =
                        !!savedObject.collected;

                }

            }

        }


    } catch (error) {

        console.warn(
            "No se pudo cargar la partida."
        );

    }

}


/* =====================================================
   45. AUTOGUARDADO
===================================================== */

setInterval(
    function() {

        if (gameStarted) {

            saveGame();

        }

    },
    10000
);


/* =====================================================
   46. DIBUJADO PRINCIPAL
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


    for (
        const npc of npcs
    ) {

        drawNPC(npc);

    }


    drawPlayer();

    drawLighting();


    ctx.restore();


    drawMinimap();

}


/* =====================================================
   47. MOTOR PRINCIPAL
===================================================== */

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


/* =====================================================
   48. INICIALIZACIÓN
===================================================== */

loadGame();

updateInventory();

updateCounters();

setMissionHUD();

gameLoop();


/* =====================================================
   FIN
   LOS SECRETOS DEL CHAÑAR — V1.0
===================================================== */
