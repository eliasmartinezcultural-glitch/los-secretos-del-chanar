/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 0.4
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
    3200;

const WORLD_HEIGHT =
    2200;


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
    function(e) {

        keys[
            e.key.toLowerCase()
        ] = true;


        if (
            e.key.toLowerCase()
            === "e"
        ) {

            interact();

        }


        if (
            e.key.toLowerCase()
            === "m"
        ) {

            toggleInventory();

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


/* =====================================================
   CÁMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth: 0.10

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 1400,

    y: 1050,

    width: 30,

    height: 30,

    speed: 4.5,

    moving: false,

    frame: 0

};


/* =====================================================
   MUNDO / EDIFICIOS
===================================================== */

const buildings = [

    {
        x: 350,
        y: 350,
        width: 380,
        height: 220,
        color: "#b56c4d",
        name: "ESCUELA"
    },

    {
        x: 2150,
        y: 400,
        width: 420,
        height: 220,
        color: "#806b58",
        name: "RADIO OCARINA"
    },

    {
        x: 350,
        y: 1400,
        width: 330,
        height: 210,
        color: "#9d8068",
        name: "ALMACÉN"
    },

    {
        x: 2200,
        y: 1450,
        width: 360,
        height: 210,
        color: "#98725b",
        name: "CASA"
    },

    {
        x: 1200,
        y: 100,
        width: 380,
        height: 210,
        color: "#8e715d",
        name: "MUSEO"
    }

];


/* =====================================================
   ÁRBOLES
===================================================== */

const trees = [

    [150,150],
    [900,180],
    [1750,160],
    [2850,200],

    [180,900],
    [850,600],
    [1800,700],
    [2900,900],

    [200,1900],
    [900,1850],
    [1800,1900],
    [2900,1850]

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        x: 1000,
        y: 920,

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
        x: 1700,
        y: 1100,

        name:
            "María",

        text:
            "Si encontrás una fotografía antigua, " +
            "no la dejes tirada. " +
            "Puede contar una historia."
    },

    {
        x: 2050,
        y: 900,

        name:
            "Julián",

        text:
            "La radio siempre fue una forma " +
            "de unir a la gente del pueblo."
    }

];


/* =====================================================
   OBJETOS
===================================================== */

const objects = [

    {
        x: 760,
        y: 1120,

        type:
            "photo",

        name:
            "Fotografía antigua",

        collected:
            false
    },

    {
        x: 1850,
        y: 1250,

        type:
            "document",

        name:
            "Documento antiguo",

        collected:
            false
    },

    {
        x: 1500,
        y: 500,

        type:
            "photo",

        name:
            "Fotografía del pueblo",

        collected:
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

let mission = {

    active:
        false,

    completed:
        false,

    title:
        "La fotografía perdida",

    description:
        "Encontrá la fotografía " +
        "que perdió Don Pedro."

};


/* =====================================================
   UTILIDADES
===================================================== */

function distance(
    a,
    b
) {

    return Math.sqrt(

        Math.pow(
            a.x - b.x,
            2
        )

        +

        Math.pow(
            a.y - b.y,
            2
        )

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


    return true;

}


function updatePlayer() {

    let dx = 0;

    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -=
            player.speed;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy +=
            player.speed;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -=
            player.speed;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx +=
            player.speed;

    }


    player.moving =
        dx !== 0 ||
        dy !== 0;


    if (
        player.moving
    ) {

        player.frame +=
            0.15;

    }


    if (
        canMove(
            player.x + dx,
            player.y
        )
    ) {

        player.x +=
            dx;

    }


    if (
        canMove(
            player.x,
            player.y + dy
        )
    ) {

        player.y +=
            dy;

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
        camera.smooth;


    camera.y +=
        (
            targetY -
            camera.y
        )
        *
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


/* =====================================================
   FONDO
===================================================== */

function drawWorld() {

    /* TIERRA */

    ctx.fillStyle =
        "#c9ac77";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* CAMINOS */

    ctx.fillStyle =
        "#9e8157";

    ctx.fillRect(
        0,
        850,
        WORLD_WIDTH,
        180
    );


    ctx.fillRect(
        1500,
        0,
        180,
        WORLD_HEIGHT
    );


    /* PLAZA */

    ctx.fillStyle =
        "#709655";

    ctx.fillRect(
        1250,
        700,
        650,
        380
    );


    /* FUENTE */

    ctx.fillStyle =
        "#7ba0a5";

    ctx.beginPath();

    ctx.arc(
        1575,
        890,
        65,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CANAL */

    ctx.fillStyle =
        "#57899a";

    ctx.fillRect(
        0,
        1750,
        WORLD_WIDTH,
        45
    );


    /* CERROS */

    drawMountains();


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


    /* VIÑEDOS */

    drawVineyard(
        400,
        720
    );


    drawVineyard(
        2100,
        750
    );

}


/* =====================================================
   CERROS
===================================================== */

function drawMountains() {

    ctx.fillStyle =
        "#8e795f";


    ctx.beginPath();

    ctx.moveTo(
        0,
        300
    );

    ctx.lineTo(
        350,
        80
    );

    ctx.lineTo(
        700,
        310
    );

    ctx.lineTo(
        1100,
        100
    );

    ctx.lineTo(
        1450,
        300
    );

    ctx.lineTo(
        1800,
        70
    );

    ctx.lineTo(
        2200,
        300
    );

    ctx.lineTo(
        2700,
        100
    );

    ctx.lineTo(
        WORLD_WIDTH,
        320
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


/* =====================================================
   ÁRBOLES
===================================================== */

function drawTree(
    x,
    y
) {

    ctx.fillStyle =
        "#65442f";

    ctx.fillRect(
        x - 9,
        y,
        18,
        45
    );


    ctx.fillStyle =
        "#41683c";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        40,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   VIÑEDOS
===================================================== */

function drawVineyard(
    x,
    y
) {

    for (
        let row = 0;
        row < 8;
        row++
    ) {

        for (
            let col = 0;
            col < 12;
            col++
        ) {

            const px =
                x +
                col * 34;

            const py =
                y +
                row * 35;


            ctx.strokeStyle =
                "#48643d";

            ctx.lineWidth =
                3;

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


/* =====================================================
   EDIFICIOS
===================================================== */

function drawBuildings() {

    for (
        const building
        of buildings
    ) {

        /* SOMBRA */

        ctx.fillStyle =
            "rgba(0,0,0,0.2)";

        ctx.fillRect(
            building.x + 8,
            building.y + 10,
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
            building.x - 15,
            building.y
        );

        ctx.lineTo(
            building.x +
            building.width / 2,

            building.y - 60
        );

        ctx.lineTo(
            building.x +
            building.width +
            15,

            building.y
        );

        ctx.closePath();

        ctx.fill();


        /* PUERTA */

        ctx.fillStyle =
            "#49352d";

        ctx.fillRect(

            building.x +
            building.width / 2 -
            20,

            building.y +
            building.height -
            70,

            40,
            70

        );


        /* VENTANAS */

        ctx.fillStyle =
            "#b9d0c9";


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


        /* NOMBRE */

        ctx.fillStyle =
            "white";

        ctx.font =
            "18px Arial";

        ctx.fillText(
            building.name,
            building.x,
            building.y +
            building.height +
            25
        );

    }

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(
    npc
) {

    ctx.fillStyle =
        "#634261";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 23,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "white";

    ctx.font =
        "14px Arial";

    ctx.fillText(
        npc.name,
        npc.x - 35,
        npc.y + 40
    );


    /* INDICADOR DE MISIÓN */

    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle =
            "#f4c542";

        ctx.font =
            "22px Arial";

        ctx.fillText(
            "!",
            npc.x - 5,
            npc.y - 45
        );

    }

}


/* =====================================================
   OBJETOS
===================================================== */

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
            "25px Arial";


        if (
            object.type
            ===
            "photo"
        ) {

            ctx.fillText(
                "📷",
                object.x,
                object.y
            );

        }


        if (
            object.type
            ===
            "document"
        ) {

            ctx.fillText(
                "📜",
                object.x,
                object.y
            );

        }

    }

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


    /* SOMBRA */

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


}


/* =====================================================
   INTERACCIÓN
===================================================== */

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
            ) <
            80
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
                    500
                );

            }


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
        ) {

            continue;

        }


        if (
            distance(
                player,
                object
            ) <
            70
        ) {

            collectObject(
                object
            );

            return;

        }

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
        object.name
    );


    updateInventory();


    if (
        object.type
        ===
        "photo"
    ) {

        document
            .getElementById(
                "photo-count"
            )
            .textContent =
            inventory.filter(
                item =>
                    item.includes(
                        "Fotografía"
                    )
            ).length;

    }


    if (
        object.type
        ===
        "document"
    ) {

        document
            .getElementById(
                "document-count"
            )
            .textContent =
            inventory.filter(
                item =>
                    item.includes(
                        "Documento"
                    )
            ).length;

    }


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
            () => {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "Encontraste una fotografía " +
                    "que puede ayudarnos a reconstruir " +
                    "la memoria del pueblo."
                );

            },
            300
        );

    }

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
                    "• " + item
            )
            .join(
                "<br>"
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


    const scaleX =
        minimap.width /
        WORLD_WIDTH;

    const scaleY =
        minimap.height /
        WORLD_HEIGHT;


    miniCtx.fillStyle =
        "#c9ac77";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* edificios */

    miniCtx.fillStyle =
        "#76594a";


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


/* =====================================================
   CICLO DÍA / NOCHE
===================================================== */

let worldTime =
    0;


function drawLighting() {

    worldTime +=
        0.0003;


    const darkness =
        (
            Math.sin(
                worldTime
            )
            + 1
        )
        / 2;


    ctx.fillStyle =
        `rgba(20,30,70,${darkness * 0.18})`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* =====================================================
   INICIO
===================================================== */

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
                .add(
                    "hidden"
                );

        }
    );


/* =====================================================
   DIBUJAR
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


/* =====================================================
   MOTOR
===================================================== */

function gameLoop() {

    if (
        gameStarted
    ) {

        updatePlayer();

        updateCamera();

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


updateInventory();

setMissionHUD();

gameLoop();
