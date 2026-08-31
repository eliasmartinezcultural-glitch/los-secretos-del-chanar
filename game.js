/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 0.5

   MOTOR BASE
   PC + CELULAR
   EXPLORACIÓN
   NPC
   MISIONES
   INVENTARIO
   DIARIO
   GUARDADO
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
   CONFIGURACIÓN
===================================================== */

const CONFIG = {

    worldWidth: 4200,

    worldHeight: 2800,

    playerSpeed: 4.5,

    interactionDistance: 95,

    saveKey:
        "secretos_chanar_v05"

};


/* =====================================================
   ESTADO
===================================================== */

const game = {

    started: false,

    paused: false,

    time: 0,

    discoveredLocations: [],

    notifications: []

};


/* =====================================================
   CÁMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth: .10

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2050,

    y: 1400,

    width: 30,

    height: 30,

    speed:
        CONFIG.playerSpeed,

    moving: false,

    frame: 0,

    direction: "down"

};


/* =====================================================
   ENTRADA
===================================================== */

const keys = {};

const touchInput = {

    active: false,

    x: 0,

    y: 0,

    centerX: 0,

    centerY: 0,

    radius: 55

};


/* =====================================================
   MUNDO
===================================================== */

const buildings = [

    {
        id: "escuela",

        x: 520,
        y: 480,

        width: 430,
        height: 240,

        color: "#a9684b",

        name: "ESCUELA",

        location: true,

        description:
            "Un lugar donde generaciones " +
            "de habitantes del Chañar " +
            "aprendieron sus primeras letras."
    },


    {
        id: "radio",

        x: 3050,
        y: 520,

        width: 500,
        height: 250,

        color: "#765e50",

        name: "RADIO OCARINA",

        location: true,

        description:
            "La radio es una de las formas " +
            "en que las historias de una comunidad " +
            "pueden viajar de una persona a otra."
    },


    {
        id: "almacen",

        x: 500,
        y: 1650,

        width: 360,
        height: 220,

        color: "#99745e",

        name: "ALMACÉN",

        location: true,

        description:
            "Un antiguo almacén de barrio. " +
            "Los comercios también guardan " +
            "la memoria cotidiana de un pueblo."
    },


    {
        id: "casa",

        x: 3000,
        y: 1700,

        width: 400,
        height: 240,

        color: "#9b7158",

        name: "CASA",

        location: true,

        description:
            "Una casa tradicional del pueblo."
    },


    {
        id: "museo",

        x: 1850,
        y: 280,

        width: 430,

        height: 230,

        color: "#806a59",

        name: "ARCHIVO",

        location: true,

        description:
            "Un espacio dedicado a conservar " +
            "documentos, fotografías y testimonios."
    }

];


/* =====================================================
   ZONAS NATURALES
===================================================== */

const natureZones = [

    {
        x: 0,
        y: 2150,
        width: 4200,
        height: 650,

        type: "river"
    },

    {
        x: 250,
        y: 1000,
        width: 1100,
        height: 700,

        type: "vineyard"
    },

    {
        x: 2700,
        y: 950,
        width: 1200,
        height: 650,

        type: "vineyard"
    }

];


/* =====================================================
   ÁRBOLES
===================================================== */

const trees = [

    [180,180],
    [500,160],
    [1000,220],
    [1450,150],
    [1800,180],
    [2500,150],
    [3000,220],
    [3800,170],

    [180,900],
    [1450,850],
    [2600,850],
    [3900,900],

    [200,1950],
    [1100,2000],
    [1700,1900],
    [2600,2050],
    [3800,1950],

    [350,2450],
    [900,2500],
    [1700,2450],
    [2700,2500],
    [3700,2450]

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {

        id: "pedro",

        x: 1450,

        y: 1350,

        name: "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission: "photo"

    },


    {

        id: "maria",

        x: 2300,

        y: 1450,

        name: "María",

        text:
            "Si encontrás una fotografía antigua, " +
            "no la dejes tirada. " +
            "Puede contar una historia."

    },


    {

        id: "julian",

        x: 2800,

        y: 1050,

        name: "Julián",

        text:
            "La radio siempre fue una forma " +
            "de unir a la gente del pueblo."

    },


    {

        id: "ana",

        x: 1100,

        y: 1150,

        name: "Ana",

        text:
            "Mirá bien el paisaje. " +
            "El agua, las chacras y los caminos " +
            "también cuentan la historia."

    }

];


/* =====================================================
   OBJETOS
===================================================== */

const objects = [

    {

        id: "photo1",

        x: 1100,

        y: 1420,

        type: "photo",

        name: "Fotografía antigua",

        description:
            "Una fotografía que puede revelar " +
            "una parte desconocida de la memoria local.",

        collected: false

    },


    {

        id: "document1",

        x: 2300,

        y: 650,

        type: "document",

        name: "Documento antiguo",

        description:
            "Un documento relacionado con la historia " +
            "del desarrollo de la localidad.",

        collected: false

    },


    {

        id: "photo2",

        x: 1950,

        y: 650,

        type: "photo",

        name: "Fotografía del pueblo",

        description:
            "Una imagen antigua del territorio.",

        collected: false

    },


    {

        id: "document2",

        x: 3350,

        y: 1300,

        type: "document",

        name: "Registro histórico",

        description:
            "Un registro que puede abrir una nueva línea " +
            "de investigación.",

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

const mission = {

    active: false,

    completed: false,

    title:
        "La fotografía perdida",

    description:
        "Don Pedro perdió una fotografía " +
        "que considera importante. " +
        "Explorá el pueblo y encontrala."

};


/* =====================================================
   UTILIDADES
===================================================== */

function distance(a, b) {

    return Math.hypot(

        a.x - b.x,

        a.y - b.y

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
   RESIZE
===================================================== */

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    updateCamera();

}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        keys[key] = true;


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


        if (key === "e") {

            interact();

        }


        if (key === "m") {

            toggleDiary();

        }


        if (key === "escape") {

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


/* =====================================================
   MOVIMIENTO
===================================================== */

function updateKeyboardMovement() {

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


    return {
        x: dx,
        y: dy
    };

}


/* =====================================================
   MOVIMIENTO TOUCH
===================================================== */

function updateTouchMovement() {

    if (
        !touchInput.active
    ) {

        return {
            x: 0,
            y: 0
        };

    }


    let dx =
        touchInput.x -
        touchInput.centerX;

    let dy =
        touchInput.y -
        touchInput.centerY;


    const length =
        Math.hypot(dx, dy);


    if (length < 8) {

        return {
            x: 0,
            y: 0
        };

    }


    dx /=
        touchInput.radius;

    dy /=
        touchInput.radius;


    const magnitude =
        Math.min(
            1,
            length /
            touchInput.radius
        );


    return {

        x:
            dx * magnitude,

        y:
            dy * magnitude

    };

}


/* =====================================================
   UPDATE PLAYER
===================================================== */

function updatePlayer() {

    const keyboard =
        updateKeyboardMovement();

    const touch =
        updateTouchMovement();


    let dx =
        keyboard.x ||
        touch.x;

    let dy =
        keyboard.y ||
        touch.y;


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const magnitude =
            Math.hypot(dx, dy);


        if (
            magnitude > 1
        ) {

            dx /=
                magnitude;

            dy /=
                magnitude;

        }


        dx *=
            player.speed;

        dy *=
            player.speed;


        player.moving =
            true;


        player.frame +=
            .18;


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

    } else {

        player.moving =
            false;

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
                CONFIG.worldWidth -
                player.width,
                player.x
            )
        );


    player.y =
        Math.max(
            0,
            Math.min(
                CONFIG.worldHeight -
                player.height,
                player.y
            )
        );

}


/* =====================================================
   COLISIONES
===================================================== */

function canMove(x, y) {

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
                Math.max(
                    0,
                    CONFIG.worldWidth -
                    canvas.width
                ),
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                Math.max(
                    0,
                    CONFIG.worldHeight -
                    canvas.height
                ),
                camera.y
            )
        );

}


/* =====================================================
   FONDO
===================================================== */

function drawWorld() {

    ctx.fillStyle =
        "#c9ac77";

    ctx.fillRect(
        0,
        0,
        CONFIG.worldWidth,
        CONFIG.worldHeight
    );


    /* CERROS */

    drawMountains();


    /* CAMINOS */

    ctx.fillStyle =
        "#9e8056";


    ctx.fillRect(
        0,
        1120,
        CONFIG.worldWidth,
        190
    );


    ctx.fillRect(
        2020,
        0,
        190,
        CONFIG.worldHeight
    );


    /* PLAZA */

    ctx.fillStyle =
        "#6f975a";


    ctx.fillRect(
        1650,
        1050,
        800,
        430
    );


    /* PLAZA CENTRAL */

    ctx.fillStyle =
        "#789e61";


    ctx.fillRect(
        1780,
        1130,
        540,
        270
    );


    /* FUENTE */

    ctx.fillStyle =
        "#6d9aa0";


    ctx.beginPath();

    ctx.arc(
        2050,
        1260,
        75,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* RÍO */

    ctx.fillStyle =
        "#4d8497";


    ctx.fillRect(
        0,
        2150,
        CONFIG.worldWidth,
        500
    );


    /* COSTA */

    ctx.fillStyle =
        "#8d875f";


    ctx.fillRect(
        0,
        2125,
        CONFIG.worldWidth,
        35
    );


    /* VIÑEDOS */

    drawVineyard(
        300,
        1050
    );


    drawVineyard(
        2750,
        1050
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


/* =====================================================
   CERROS
===================================================== */

function drawMountains() {

    ctx.fillStyle =
        "#88755e";


    ctx.beginPath();

    ctx.moveTo(
        0,
        390
    );

    ctx.lineTo(
        400,
        100
    );

    ctx.lineTo(
        800,
        350
    );

    ctx.lineTo(
        1250,
        80
    );

    ctx.lineTo(
        1700,
        350
    );

    ctx.lineTo(
        2150,
        90
    );

    ctx.lineTo(
        2600,
        350
    );

    ctx.lineTo(
        3150,
        100
    );

    ctx.lineTo(
        3650,
        350
    );

    ctx.lineTo(
        CONFIG.worldWidth,
        130
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


/* =====================================================
   ÁRBOLES
===================================================== */

function drawTree(x, y) {

    ctx.fillStyle =
        "#61452f";

    ctx.fillRect(
        x - 8,
        y,
        16,
        45
    );


    ctx.fillStyle =
        "#416b3d";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        38,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#527d45";

    ctx.beginPath();

    ctx.arc(
        x - 15,
        y - 10,
        22,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   VIÑEDOS
===================================================== */

function drawVineyard(x, y) {

    for (
        let row = 0;
        row < 11;
        row++
    ) {

        for (
            let col = 0;
            col < 18;
            col++
        ) {

            const px =
                x +
                col * 42;

            const py =
                y +
                row * 42;


            ctx.strokeStyle =
                "#4b663e";

            ctx.lineWidth =
                3;


            ctx.beginPath();

            ctx.moveTo(
                px,
                py
            );

            ctx.lineTo(
                px,
                py + 28
            );

            ctx.stroke();


            ctx.fillStyle =
                "#507c42";

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
            "rgba(0,0,0,.2)";

        ctx.fillRect(
            building.x + 10,
            building.y + 12,
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
            "#4b382f";

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
            building.width +
            20,

            building.y
        );

        ctx.closePath();

        ctx.fill();


        /* PUERTA */

        ctx.fillStyle =
            "#4a352c";

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


        /* VENTANAS */

        ctx.fillStyle =
            "#b6d0cb";

        ctx.fillRect(
            building.x + 40,
            building.y + 45,
            50,
            48
        );


        ctx.fillRect(

            building.x +
            building.width -
            90,

            building.y + 45,

            50,
            48

        );


        /* NOMBRE */

        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 16px Arial";

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

function drawNPC(npc) {

    const bob =
        Math.sin(
            game.time * 3 +
            npc.x
        ) * 1.5;


    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 20,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CUERPO */

    ctx.fillStyle =
        "#634563";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y + bob,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CABEZA */

    ctx.fillStyle =
        "#dfad86";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 23 + bob,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* NOMBRE */

    ctx.fillStyle =
        "white";

    ctx.font =
        "14px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 45
    );

    ctx.textAlign =
        "left";


    /* MISIÓN */

    if (
        npc.mission === "photo" &&
        !mission.completed
    ) {

        ctx.fillStyle =
            "#f4c542";

        ctx.font =
            "bold 25px Arial";

        ctx.fillText(
            "!",
            npc.x - 6,
            npc.y - 48
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


        const pulse =
            Math.sin(
                game.time * 4 +
                object.x
            ) * 4;


        ctx.beginPath();

        ctx.arc(
            object.x,
            object.y,
            18 + pulse,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(244,197,66,.15)";

        ctx.fill();


        ctx.font =
            "27px Arial";


        ctx.fillText(

            object.type === "photo"
                ? "📷"
                : "📜",

            object.x - 13,
            object.y + 10

        );

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
        "rgba(0,0,0,.3)";

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
        "#243d4e";

    ctx.fillRect(
        x,
        y,
        30,
        31
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


    /* DIRECCIÓN */

    ctx.fillStyle =
        "white";


    if (
        player.direction ===
        "right"
    ) {

        ctx.fillRect(
            x + 21,
            y - 12,
            3,
            3
        );

    }

    else if (
        player.direction ===
        "left"
    ) {

        ctx.fillRect(
            x + 6,
            y - 12,
            3,
            3
        );

    }

}


/* =====================================================
   LUGAR CERCANO
===================================================== */

function getNearbyTarget() {

    let closest = null;

    let closestDistance =
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
            closestDistance
        ) {

            closest =
                {
                    type: "npc",
                    data: npc
                };

            closestDistance =
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
            closestDistance
        ) {

            closest =
                {
                    type: "object",
                    data: object
                };

            closestDistance =
                d;

        }

    }


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


        const d =
            distance(
                player,
                center
            );


        if (
            d <
            CONFIG.interactionDistance +
            80 &&
            d <
            closestDistance
        ) {

            closest =
                {
                    type: "location",
                    data: building
                };

            closestDistance =
                d;

        }

    }


    return closest;

}


/* =====================================================
   INTERACCIÓN
===================================================== */

function interact() {

    if (
        !game.started
    ) {

        return;

    }


    const target =
        getNearbyTarget();


    if (
        !target
    ) {

        showNotification(
            "No hay nada para explorar aquí."
        );

        return;

    }


    if (
        target.type === "npc"
    ) {

        interactNPC(
            target.data
        );

        return;

    }


    if (
        target.type === "object"
    ) {

        collectObject(
            target.data
        );

        return;

    }


    if (
        target.type === "location"
    ) {

        discoverLocation(
            target.data
        );

    }

}


/* =====================================================
   NPC
===================================================== */

function interactNPC(npc) {

    showDialogue(
        npc.name,
        npc.text
    );


    if (
        npc.mission === "photo" &&
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


    updateInventory();


    if (
        object.type === "photo"
    ) {

        updateCounter(
            "photo-count",
            "Fotografía"
        );

    }


    if (
        object.type === "document"
    ) {

        updateCounter(
            "document-count",
            "Documento"
        );

    }


    showNotification(
        "Encontraste: " +
        object.name
    );


    if (
        mission.active &&
        object.type === "photo"
    ) {

        mission.active =
            false;

        mission.completed =
            true;


        setMissionHUD();


        saveGame();


        setTimeout(
            function() {

                showDialogue(

                    "MISIÓN COMPLETADA",

                    "Encontraste una fotografía " +
                    "que puede ayudarnos a reconstruir " +
                    "la memoria del pueblo."

                );

            },
            500
        );

    }


    saveGame();

}


/* =====================================================
   DESCUBRIR LUGAR
===================================================== */

function discoverLocation(building) {

    if (
        !game.discoveredLocations.includes(
            building.id
        )
    ) {

        game.discoveredLocations.push(
            building.id
        );


        document
            .getElementById(
                "location-count"
            )
            .textContent =
            game.discoveredLocations.length;


        addDiaryEntry(
            "📍 " +
            building.name +
            "<br>" +
            building.description
        );


        showNotification(
            "Lugar descubierto: " +
            building.name
        );


        saveGame();

    } else {

        showDialogue(
            building.name,
            building.description
        );

    }

}


/* =====================================================
   DIÁLOGO
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


/* =====================================================
   MISIÓN
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
   INVENTARIO
===================================================== */

function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );


    if (
        inventory.length === 0
    ) {

        container.textContent =
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


function updateCounter(
    elementId,
    search
) {

    const count =
        inventory.filter(
            item =>
                item.includes(search)
        ).length;


    document
        .getElementById(
            elementId
        )
        .textContent =
        count;

}


/* =====================================================
   DIARIO
===================================================== */

const diaryEntries = [];


function addDiaryEntry(text) {

    if (
        diaryEntries.includes(text)
    ) {

        return;

    }


    diaryEntries.push(
        text
    );


    renderDiary();

}


function renderDiary() {

    const container =
        document.getElementById(
            "diary-items"
        );


    if (
        diaryEntries.length === 0
    ) {

        container.innerHTML =
            "Todavía no descubriste nada.";

        return;

    }


    container.innerHTML =
        diaryEntries
            .map(
                entry =>
                    "<div class='diary-entry'>" +
                    entry +
                    "</div>"
            )
            .join(
                "<hr>"
            );

}


function toggleDiary() {

    document
        .getElementById(
            "diary-panel"
        )
        .classList
        .toggle(
            "hidden"
        );

}


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
   NOTIFICACIONES
===================================================== */

let notificationTimer = null;


function showNotification(text) {

    const element =
        document.getElementById(
            "notification"
        );


    element.textContent =
        text;


    element.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            function() {

                element.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =====================================================
   INTERACCIÓN HUD
===================================================== */

function updateInteractionHint() {

    const hint =
        document.getElementById(
            "interaction-hint"
        );


    const text =
        document.getElementById(
            "interaction-text"
        );


    const target =
        getNearbyTarget();


    if (
        !game.started ||
        !target
    ) {

        hint.classList.add(
            "hidden"
        );

        return;

    }


    hint.classList.remove(
        "hidden"
    );


    if (
        target.type === "npc"
    ) {

        text.textContent =
            "HABLAR";

    }

    else if (
        target.type === "object"
    ) {

        text.textContent =
            "RECOGER";

    }

    else {

        text.textContent =
            "EXPLORAR";

    }

}


/* =====================================================
   MINIMAPA
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


    miniCtx.fillStyle =
        "#c9ac77";

    miniCtx.fillRect(
        0,
        0,
        width,
        height
    );


    const sx =
        width /
        CONFIG.worldWidth;

    const sy =
        height /
        CONFIG.worldHeight;


    /* RÍO */

    miniCtx.fillStyle =
        "#4d8497";

    miniCtx.fillRect(
        0,
        2150 * sy,
        width,
        500 * sy
    );


    /* PLAZA */

    miniCtx.fillStyle =
        "#6f975a";

    miniCtx.fillRect(
        1650 * sx,
        1050 * sy,
        800 * sx,
        430 * sy
    );


    /* EDIFICIOS */

    miniCtx.fillStyle =
        "#5d4437";


    for (
        const building
        of buildings
    ) {

        miniCtx.fillRect(

            building.x * sx,

            building.y * sy,

            building.width * sx,

            building.height * sy

        );

    }


    /* NPC */

    miniCtx.fillStyle =
        "#7c5279";


    for (
        const npc
        of npcs
    ) {

        miniCtx.beginPath();

        miniCtx.arc(
            npc.x * sx,
            npc.y * sy,
            2,
            0,
            Math.PI * 2
        );

        miniCtx.fill();

    }


    /* JUGADOR */

    miniCtx.fillStyle =
        "#ff3e3e";


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

    const cycle =
        (
            Math.sin(
                game.time * .08
            ) + 1
        ) / 2;


    const darkness =
        .03 +
        cycle * .18;


    ctx.fillStyle =
        `rgba(20,30,70,${darkness})`;


    ctx.fillRect(
        0,
        0,
        CONFIG.worldWidth,
        CONFIG.worldHeight
    );

}


/* =====================================================
   GUARDADO
===================================================== */

function saveGame() {

    try {

        const data = {

            player: {

                x: player.x,

                y: player.y

            },

            inventory: inventory,

            objects: objects.map(
                object => ({
                    id: object.id,
                    collected:
                        object.collected
                })
            ),

            mission: {

                active:
                    mission.active,

                completed:
                    mission.completed

            },

            locations:
                game.discoveredLocations,

            diary:
                diaryEntries

        };


        localStorage.setItem(
            CONFIG.saveKey,
            JSON.stringify(data)
        );

    }

    catch (error) {

        console.warn(
            "No se pudo guardar la partida.",
            error
        );

    }

}


/* =====================================================
   CARGAR
===================================================== */

function loadGame() {

    try {

        const raw =
            localStorage.getItem(
                CONFIG.saveKey
            );


        if (!raw) {

            return false;

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
            Array.isArray(
                data.objects
            )
        ) {

            data.objects.forEach(
                saved => {

                    const object =
                        objects.find(
                            item =>
                                item.id ===
                                saved.id
                        );


                    if (object) {

                        object.collected =
                            saved.collected;

                    }

                }
            );

        }


        if (
            data.mission
        ) {

            mission.active =
                data.mission.active;

            mission.completed =
                data.mission.completed;

        }


        if (
            Array.isArray(
                data.locations
            )
        ) {

            game.discoveredLocations =
                data.locations;

        }


        if (
            Array.isArray(
                data.diary
            )
        ) {

            diaryEntries.length = 0;

            diaryEntries.push(
                ...data.diary
            );

        }


        updateInventory();

        updateCounter(
            "photo-count",
            "Fotografía"
        );

        updateCounter(
            "document-count",
            "Documento"
        );


        document
            .getElementById(
                "location-count"
            )
            .textContent =
            game.discoveredLocations.length;


        renderDiary();

        setMissionHUD();


        return true;

    }

    catch (error) {

        console.warn(
            "No se pudo cargar la partida.",
            error
        );


        return false;

    }

}


/* =====================================================
   JOYSTICK
===================================================== */

const joystick =
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


function joystickPosition(
    event
) {

    const rect =
        joystickBase.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    let x =
        event.clientX;

    let y =
        event.clientY;


    let dx =
        x -
        centerX;

    let dy =
        y -
        centerY;


    const max =
        rect.width / 2 -
        31;


    const length =
        Math.hypot(
            dx,
            dy
        );


    if (
        length > max
    ) {

        dx =
            dx / length *
            max;

        dy =
            dy / length *
            max;

    }


    touchInput.x =
        centerX +
        dx;

    touchInput.y =
        centerY +
        dy;

    touchInput.centerX =
        centerX;

    touchInput.centerY =
        centerY;

    touchInput.radius =
        max;


    joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;

}


joystick.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        touchInput.active =
            true;

        joystick.setPointerCapture(
            event.pointerId
        );

        joystickPosition(
            event
        );

    }
);


joystick.addEventListener(
    "pointermove",
    function(event) {

        if (
            !touchInput.active
        ) {

            return;

        }

        event.preventDefault();

        joystickPosition(
            event
        );

    }
);


function resetJoystick() {

    touchInput.active =
        false;

    touchInput.x =
        touchInput.centerX;

    touchInput.y =
        touchInput.centerY;

    joystickStick.style.transform =
        "translate(0px, 0px)";

}


joystick.addEventListener(
    "pointerup",
    resetJoystick
);

joystick.addEventListener(
    "pointercancel",
    resetJoystick
);


/* =====================================================
   BOTONES MOBILE
===================================================== */

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
        "mobile-diary"
    )
    .addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            toggleDiary();

        }
    );


/* =====================================================
   BOTONES DE INTERFAZ
===================================================== */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        function() {

            startGame(
                false
            );

        }
    );


document
    .getElementById(
        "continue-button"
    )
    .addEventListener(
        "click",
        function() {

            startGame(
                true
            );

        }
    );


document
    .getElementById(
        "diary-button"
    )
    .addEventListener(
        "click",
        toggleDiary
    );


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


document
    .getElementById(
        "diary-close"
    )
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "diary-panel"
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


/* =====================================================
   INICIO DEL JUEGO
===================================================== */

function startGame(
    continueGame
) {

    if (
        continueGame
    ) {

        const loaded =
            loadGame();


        if (!loaded) {

            showNotification(
                "No hay una partida guardada."
            );

        }

    }


    game.started =
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

    showNotification(
        continueGame
            ? "Partida cargada."
            : "Bienvenido al Chañar."
    );

}


/* =====================================================
   RENDER
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
   GAME LOOP
===================================================== */

function gameLoop() {

    game.time +=
        .016;


    if (
        game.started
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
   INICIALIZACIÓN
===================================================== */

updateInventory();

setMissionHUD();

renderDiary();

gameLoop();
