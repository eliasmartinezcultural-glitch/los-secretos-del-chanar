/* =========================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 16.0

   MOTOR PRINCIPAL

   OBJETIVOS:
   - PC
   - CELULAR
   - COLISIONES ROBUSTAS
   - SPAWN SEGURO
   - CÁMARA
   - NPC
   - MISIONES
   - INVENTARIO
   - OBJETOS
   - MINIMAPA
   - JOYSTICK
   - RECUPERACIÓN DEL JUGADOR
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

const WORLD_WIDTH = 3600;

const WORLD_HEIGHT = 2400;


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

    playerSpeed: 4.5,

    mobileSpeed: 4.5,

    cameraSmooth: 0.12,

    interactionDistance: 90,

    objectDistance: 75,

    safeMargin: 45

};


/* =========================================================
   CANVAS RESPONSIVE
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
            key === "r" &&
            !event.repeat
        ) {

            resetPlayerSafe();

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
   CÁMARA
========================================================= */

const camera = {

    x: 0,

    y: 0,

    smooth:
        CONFIG.cameraSmooth

};


/* =========================================================
   PUNTO SEGURO
========================================================= */

/*
    IMPORTANTE:

    Este punto NO está dentro de ninguna casa.

    Además el sistema lo valida antes de colocar
    al jugador.
*/

const SAFE_START = {

    x: 1540,

    y: 1120

};


/* =========================================================
   JUGADOR
========================================================= */

const player = {

    x: SAFE_START.x,

    y: SAFE_START.y,

    width: 30,

    height: 30,

    speed:
        CONFIG.playerSpeed,

    moving: false,

    frame: 0,

    direction: "down"

};


/* =========================================================
   EDIFICIOS
========================================================= */

const buildings = [

    {
        x: 300,
        y: 350,
        width: 430,
        height: 230,
        color: "#a96d50",
        name: "ESCUELA"
    },

    {
        x: 2150,
        y: 350,
        width: 470,
        height: 230,
        color: "#806956",
        name: "RADIO OCARINA"
    },

    {
        x: 300,
        y: 1430,
        width: 350,
        height: 220,
        color: "#9d8068",
        name: "ALMACÉN"
    },

    {
        x: 2250,
        y: 1480,
        width: 390,
        height: 230,
        color: "#98725b",
        name: "CASA"
    },

    {
        x: 1280,
        y: 100,
        width: 400,
        height: 220,
        color: "#8e715d",
        name: "MUSEO"
    },

    {
        x: 2550,
        y: 1950,
        width: 430,
        height: 220,
        color: "#876a55",
        name: "GALPÓN"
    }

];


/* =========================================================
   ÁRBOLES
========================================================= */

const trees = [

    [130,150],
    [900,180],
    [1800,160],
    [2900,200],
    [3400,300],

    [160,920],
    [850,620],
    [1900,700],
    [3000,900],

    [180,2050],
    [900,1900],
    [1850,2100],
    [3200,1900],

    [1050,350],
    [1950,400],
    [2850,1200],
    [700,1250]

];


/* =========================================================
   NPC
========================================================= */

const npcs = [

    {
        x: 1040,
        y: 920,

        name:
            "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission: true

    },

    {
        x: 1730,
        y: 1120,

        name:
            "María",

        text:
            "Si encontrás una fotografía antigua, " +
            "no la dejes tirada. " +
            "Puede contar una historia."

    },

    {
        x: 2040,
        y: 900,

        name:
            "Julián",

        text:
            "La radio siempre fue una forma " +
            "de unir a la gente del pueblo."

    },

    {
        x: 850,
        y: 1150,

        name:
            "Rosa",

        text:
            "Acá las historias pasan de generación " +
            "en generación. Algunas todavía esperan " +
            "que alguien las escuche."

    }

];


/* =========================================================
   OBJETOS
========================================================= */

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
        y: 1280,

        type:
            "document",

        name:
            "Documento antiguo",

        collected:
            false

    },

    {
        x: 1500,
        y: 520,

        type:
            "photo",

        name:
            "Fotografía del pueblo",

        collected:
            false

    },

    {
        x: 2850,
        y: 1150,

        type:
            "document",

        name:
            "Documento de la colonia",

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

    active: false,

    completed: false,

    title:
        "La fotografía perdida",

    description:
        "Encontrá la fotografía que perdió Don Pedro."

};


/* =========================================================
   ESTADO
========================================================= */

let gameStarted = false;

let worldTime = 0;


/* =========================================================
   JOYSTICK
========================================================= */

const joystick =
    document.getElementById(
        "joystick"
    );

const joystickKnob =
    document.getElementById(
        "joystick-knob"
    );


const joystickState = {

    active: false,

    x: 0,

    y: 0

};


function updateJoystick(
    event
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
        event.clientX -
        centerX;

    let dy =
        event.clientY -
        centerY;


    const maxDistance =
        rect.width * 0.32;


    const distanceValue =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distanceValue >
        maxDistance
    ) {

        const ratio =
            maxDistance /
            distanceValue;

        dx *= ratio;

        dy *= ratio;

    }


    joystickState.x =
        dx / maxDistance;

    joystickState.y =
        dy / maxDistance;


    joystickKnob.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

}


function resetJoystick() {

    joystickState.active =
        false;

    joystickState.x = 0;

    joystickState.y = 0;


    joystickKnob.style.transform =
        "translate(-50%, -50%)";

}


joystick.addEventListener(
    "pointerdown",
    function(event) {

        joystickState.active =
            true;

        joystick.setPointerCapture(
            event.pointerId
        );

        updateJoystick(event);

    }
);


joystick.addEventListener(
    "pointermove",
    function(event) {

        if (
            !joystickState.active
        ) {

            return;

        }

        updateJoystick(event);

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
   BOTÓN MOBILE INTERACT
========================================================= */

document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "pointerdown",
        function() {

            interact();

        }
    );


/* =========================================================
   UTILIDADES
========================================================= */

function distance(
    a,
    b
) {

    const dx =
        a.x -
        b.x;

    const dy =
        a.y -
        b.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =========================================================
   RECTÁNGULO DEL JUGADOR
========================================================= */

function playerRect(
    x,
    y
) {

    return {

        x: x,

        y: y,

        width:
            player.width,

        height:
            player.height

    };

}


/* =========================================================
   COLISIÓN RECTÁNGULO
========================================================= */

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


/* =========================================================
   POSICIÓN SEGURA
========================================================= */

function isSafePosition(
    x,
    y
) {

    const test =
        playerRect(
            x,
            y
        );


    /*
       LÍMITES
    */

    if (
        x < 0 ||
        y < 0 ||
        x + player.width >
            WORLD_WIDTH ||
        y + player.height >
            WORLD_HEIGHT
    ) {

        return false;

    }


    /*
       EDIFICIOS
    */

    for (
        const building
        of buildings
    ) {

        const expanded = {

            x:
                building.x -
                CONFIG.safeMargin,

            y:
                building.y -
                CONFIG.safeMargin,

            width:
                building.width +
                CONFIG.safeMargin * 2,

            height:
                building.height +
                CONFIG.safeMargin * 2

        };


        if (
            collision(
                test,
                expanded
            )
        ) {

            return false;

        }

    }


    return true;

}


/* =========================================================
   ENCONTRAR POSICIÓN SEGURA
========================================================= */

function findSafePosition() {

    /*
       Primero probamos el punto principal.
    */

    if (
        isSafePosition(
            SAFE_START.x,
            SAFE_START.y
        )
    ) {

        return {

            x: SAFE_START.x,

            y: SAFE_START.y

        };

    }


    /*
       Si algo cambió, buscamos automáticamente.
    */

    const positions = [

        [1500,1100],
        [1450,1100],
        [1600,1100],
        [1500,1150],
        [1450,1150],
        [1600,1150],
        [1300,1100],
        [1800,1100],
        [1000,1000],
        [2000,1000]

    ];


    for (
        const position
        of positions
    ) {

        if (
            isSafePosition(
                position[0],
                position[1]
            )
        ) {

            return {

                x: position[0],

                y: position[1]

            };

        }

    }


    /*
       Último recurso:
       búsqueda automática.
    */

    for (
        let y = 400;
        y < WORLD_HEIGHT;
        y += 100
    ) {

        for (
            let x = 400;
            x < WORLD_WIDTH;
            x += 100
        ) {

            if (
                isSafePosition(
                    x,
                    y
                )
            ) {

                return {

                    x,
                    y

                };

            }

        }

    }


    return {

        x: 1500,

        y: 1100

    };

}


/* =========================================================
   REINICIO SEGURO
========================================================= */

function resetPlayerSafe() {

    const safe =
        findSafePosition();


    player.x =
        safe.x;

    player.y =
        safe.y;


    camera.x =
        player.x -
        canvas.width / 2;

    camera.y =
        player.y -
        canvas.height / 2;


    updateCamera();


    showTemporaryMessage(
        "Posición restaurada"
    );

}


/* =========================================================
   MOVIMIENTO
========================================================= */

function updatePlayer() {

    let dx = 0;

    let dy = 0;


    /*
       TECLADO
    */

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


    /*
       JOYSTICK
    */

    if (
        joystickState.active
    ) {

        dx =
            joystickState.x;

        dy =
            joystickState.y;


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            player.direction =
                dx > 0
                    ? "right"
                    : "left";

        } else {

            player.direction =
                dy > 0
                    ? "down"
                    : "up";

        }

    }


    /*
       NORMALIZACIÓN

       Evita que diagonal sea más rápida.
    */

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
        magnitude > 0.05;


    if (
        player.moving
    ) {

        player.frame +=
            0.18;

    }


    /*
       VELOCIDAD
    */

    const speed =
        CONFIG.playerSpeed;


    const moveX =
        dx * speed;

    const moveY =
        dy * speed;


    /*
       COLISIÓN POR EJE X
    */

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


    /*
       COLISIÓN POR EJE Y
    */

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


    /*
       LÍMITES
    */

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


    /*
       SEGURIDAD EXTRA

       Si por alguna razón externa
       el personaje terminó dentro
       de una estructura, lo sacamos.
    */

    if (
        !isSafePosition(
            player.x,
            player.y
        )
    ) {

        recoverFromCollision();

    }

}


/* =========================================================
   COMPROBAR MOVIMIENTO
========================================================= */

function canMove(
    x,
    y
) {

    const test =
        playerRect(
            x,
            y
        );


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

        x +
        player.width <=
        WORLD_WIDTH &&

        y +
        player.height <=
        WORLD_HEIGHT

    );

}


/* =========================================================
   RECUPERACIÓN DE EMERGENCIA
========================================================= */

function recoverFromCollision() {

    /*
       Busca una posición cercana.
    */

    const attempts = [

        [60,0],
        [-60,0],
        [0,60],
        [0,-60],

        [120,0],
        [-120,0],
        [0,120],
        [0,-120],

        [180,0],
        [-180,0],
        [0,180],
        [0,-180]

    ];


    for (
        const attempt
        of attempts
    ) {

        const x =
            player.x +
            attempt[0];

        const y =
            player.y +
            attempt[1];


        if (
            isSafePosition(
                x,
                y
            )
        ) {

            player.x =
                x;

            player.y =
                y;

            return;

        }

    }


    /*
       Si no encuentra lugar:
       punto seguro general.
    */

    const safe =
        findSafePosition();


    player.x =
        safe.x;

    player.y =
        safe.y;

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


/* =========================================================
   FONDO DEL MUNDO
========================================================= */

function drawWorld() {

    /*
       TIERRA
    */

    ctx.fillStyle =
        "#c9ac77";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /*
       CAMINOS
    */

    ctx.fillStyle =
        "#9d8158";


    ctx.fillRect(
        0,
        850,
        WORLD_WIDTH,
        190
    );


    ctx.fillRect(
        1510,
        0,
        190,
        WORLD_HEIGHT
    );


    /*
       PLAZA
    */

    ctx.fillStyle =
        "#719655";


    ctx.fillRect(
        1240,
        700,
        720,
        410
    );


    /*
       FUENTE
    */

    ctx.fillStyle =
        "#7ba4aa";


    ctx.beginPath();

    ctx.arc(
        1600,
        900,
        70,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       CANAL
    */

    ctx.fillStyle =
        "#558b9d";


    ctx.fillRect(
        0,
        1780,
        WORLD_WIDTH,
        50
    );


    /*
       MONTAÑAS
    */

    drawMountains();


    /*
       ÁRBOLES
    */

    for (
        const tree
        of trees
    ) {

        drawTree(
            tree[0],
            tree[1]
        );

    }


    /*
       VIÑEDOS
    */

    drawVineyard(
        400,
        720
    );


    drawVineyard(
        2100,
        760
    );

}


/* =========================================================
   MONTAÑAS
========================================================= */

function drawMountains() {

    ctx.fillStyle =
        "#89755e";


    ctx.beginPath();

    ctx.moveTo(
        0,
        330
    );

    ctx.lineTo(
        350,
        80
    );

    ctx.lineTo(
        700,
        320
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
        90
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


/* =========================================================
   ÁRBOL
========================================================= */

function drawTree(
    x,
    y
) {

    /*
       TRONCO
    */

    ctx.fillStyle =
        "#62432e";


    ctx.fillRect(
        x - 8,
        y,
        16,
        42
    );


    /*
       COPA
    */

    ctx.fillStyle =
        "#426a3d";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        39,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   VIÑEDO
========================================================= */

function drawVineyard(
    x,
    y
) {

    ctx.strokeStyle =
        "#506941";

    ctx.lineWidth =
        2;


    for (
        let row = 0;
        row < 9;
        row++
    ) {

        for (
            let col = 0;
            col < 13;
            col++
        ) {

            const px =
                x +
                col * 34;

            const py =
                y +
                row * 34;


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
                "#4e7945";


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

        /*
           SOMBRA
        */

        ctx.fillStyle =
            "rgba(0,0,0,.20)";


        ctx.fillRect(
            building.x + 9,
            building.y + 11,
            building.width,
            building.height
        );


        /*
           EDIFICIO
        */

        ctx.fillStyle =
            building.color;


        ctx.fillRect(
            building.x,
            building.y,
            building.width,
            building.height
        );


        /*
           TECHO
        */

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
            building.y - 58
        );

        ctx.lineTo(
            building.x +
            building.width + 15,
            building.y
        );

        ctx.closePath();

        ctx.fill();


        /*
           PUERTA
        */

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


        /*
           VENTANAS
        */

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


        /*
           NOMBRE
        */

        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 17px Arial";


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

function drawNPC(
    npc
) {

    /*
       CUERPO
    */

    ctx.fillStyle =
        "#62445f";


    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       CABEZA
    */

    ctx.fillStyle =
        "#e1b18b";


    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 24,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       NOMBRE
    */

    ctx.fillStyle =
        "white";

    ctx.font =
        "14px Arial";


    ctx.fillText(
        npc.name,
        npc.x - 35,
        npc.y + 42
    );


    /*
       MISIÓN
    */

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
            npc.y - 48
        );

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


        ctx.font =
            "27px Arial";


        if (
            object.type ===
            "photo"
        ) {

            ctx.fillText(
                "📷",
                object.x,
                object.y
            );

        }


        if (
            object.type ===
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


/* =========================================================
   JUGADOR
========================================================= */

function drawPlayer() {

    const bob =
        player.moving
            ? Math.sin(
                player.frame * 7
            ) * 3
            : 0;


    const x =
        player.x;

    const y =
        player.y +
        bob;


    /*
       SOMBRA
    */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";


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


    /*
       CUERPO
    */

    ctx.fillStyle =
        "#263b4c";


    ctx.fillRect(
        x,
        y,
        30,
        30
    );


    /*
       CABEZA
    */

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


    /*
       PELO
    */

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


/* =========================================================
   INTERACCIÓN
========================================================= */

function interact() {

    if (
        !gameStarted
    ) {

        return;

    }


    /*
       NPC
    */

    for (
        const npc
        of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) <
            CONFIG.interactionDistance
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
                    350
                );

            }


            return;

        }

    }


    /*
       OBJETOS
    */

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
            CONFIG.objectDistance
        ) {

            collectObject(
                object
            );

            return;

        }

    }

}


/* =========================================================
   DETECTAR OBJETIVO CERCANO
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


    if (
        !gameStarted
    ) {

        hint.classList.add(
            "hidden"
        );

        return;

    }


    for (
        const npc
        of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) <
            CONFIG.interactionDistance
        ) {

            text.textContent =
                "Presioná E para hablar";

            hint.classList.remove(
                "hidden"
            );

            return;

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


        if (
            distance(
                player,
                object
            ) <
            CONFIG.objectDistance
        ) {

            text.textContent =
                "Presioná E para recoger";

            hint.classList.remove(
                "hidden"
            );

            return;

        }

    }


    hint.classList.add(
        "hidden"
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


    inventory.push(
        object.name
    );


    updateInventory();


    updateCounters();


    showTemporaryMessage(
        "Objeto encontrado: " +
        object.name
    );


    /*
       MISIÓN
    */

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

                    "Encontraste una fotografía " +
                    "que puede ayudarnos a reconstruir " +
                    "la memoria del pueblo."
                );

            },
            400
        );

    }

}


/* =========================================================
   CONTADORES
========================================================= */

function updateCounters() {

    const photos =
        objects.filter(
            object =>
                object.collected &&
                object.type ===
                "photo"
        ).length;


    const documents =
        objects.filter(
            object =>
                object.collected &&
                object.type ===
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


/* =========================================================
   CERRAR DIÁLOGO
========================================================= */

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


/* =========================================================
   CERRAR MISIÓN
========================================================= */

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


/* =========================================================
   HUD MISIÓN
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
                    item
            )
            .join(
                "<br>"
            );

}


/* =========================================================
   AYUDA
========================================================= */

document
    .getElementById(
        "help-button"
    )
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "help-panel"
                )
                .classList
                .remove(
                    "hidden"
                );

        }
    );


document
    .getElementById(
        "help-close"
    )
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "help-panel"
                )
                .classList
                .add(
                    "hidden"
                );

        }
    );


/* =========================================================
   CERRAR PANELES
========================================================= */

function closePanels() {

    document
        .getElementById(
            "dialogue"
        )
        .classList
        .add(
            "hidden"
        );


    document
        .getElementById(
            "mission-panel"
        )
        .classList
        .add(
            "hidden"
        );


    document
        .getElementById(
            "inventory-panel"
        )
        .classList
        .add(
            "hidden"
        );


    document
        .getElementById(
            "help-panel"
        )
        .classList
        .add(
            "hidden"
        );

}


/* =========================================================
   MENSAJE TEMPORAL
========================================================= */

let temporaryMessageTimer = null;


function showTemporaryMessage(
    message
) {

    const hint =
        document.getElementById(
            "interaction-hint"
        );

    const text =
        document.getElementById(
            "interaction-text"
        );


    clearTimeout(
        temporaryMessageTimer
    );


    text.textContent =
        message;


    hint.classList.remove(
        "hidden"
    );


    temporaryMessageTimer =
        setTimeout(
            function() {

                updateInteractionHint();

            },
            1800
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


    const scaleX =
        minimap.width /
        WORLD_WIDTH;


    const scaleY =
        minimap.height /
        WORLD_HEIGHT;


    /*
       TERRENO
    */

    miniCtx.fillStyle =
        "#c9ac77";


    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /*
       PLAZA
    */

    miniCtx.fillStyle =
        "#719655";


    miniCtx.fillRect(
        1240 * scaleX,
        700 * scaleY,
        720 * scaleX,
        410 * scaleY
    );


    /*
       CANAL
    */

    miniCtx.fillStyle =
        "#558b9d";


    miniCtx.fillRect(
        0,
        1780 * scaleY,
        minimap.width,
        50 * scaleY
    );


    /*
       EDIFICIOS
    */

    miniCtx.fillStyle =
        "#654d40";


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


    /*
       NPC
    */

    miniCtx.fillStyle =
        "#e7bd43";


    for (
        const npc
        of npcs
    ) {

        miniCtx.beginPath();

        miniCtx.arc(
            npc.x * scaleX,
            npc.y * scaleY,
            3,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    }


    /*
       OBJETOS
    */

    miniCtx.fillStyle =
        "#ffffff";


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
            object.x * scaleX,
            object.y * scaleY,
            2,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    }


    /*
       JUGADOR
    */

    miniCtx.fillStyle =
        "#e53935";


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
   CICLO DÍA / NOCHE
========================================================= */

function drawLighting() {

    worldTime +=
        0.0003;


    const darkness =
        (
            Math.sin(
                worldTime
            ) +
            1
        ) / 2;


    ctx.fillStyle =
        `rgba(20,30,70,${darkness * 0.16})`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* =========================================================
   INICIO DEL JUEGO
========================================================= */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        function() {

            /*
               Validación crítica:
               nunca iniciar dentro de una casa.
            */

            const safe =
                findSafePosition();


            player.x =
                safe.x;

            player.y =
                safe.y;


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


            updateCamera();

        }
    );


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


    ctx.translate(
        -camera.x,
        -camera.y
    );


    /*
       ORDEN DE DIBUJO
    */

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


    /*
       ELEMENTOS UI
    */

    drawMinimap();

    updateInteractionHint();

}


/* =========================================================
   MOTOR PRINCIPAL
========================================================= */

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


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function initializeGame() {

    /*
       Buscamos una posición segura
       antes de dibujar.
    */

    const safe =
        findSafePosition();


    player.x =
        safe.x;

    player.y =
        safe.y;


    camera.x =
        player.x -
        canvas.width / 2;

    camera.y =
        player.y -
        canvas.height / 2;


    updateInventory();

    updateCounters();

    setMissionHUD();


    /*
       Comenzar en estado pausado.
    */

    gameStarted =
        false;


    gameLoop();

}


/* =========================================================
   ARRANCAR
========================================================= */

initializeGame();
