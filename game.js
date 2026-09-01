/* =========================================================
   LOS SECRETOS DEL CHAÑAR
   V18.0
   CHAÑAR VIVO

   Juego creado por Elías Martínez
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
   ESTADO
========================================================= */

let gameStarted = false;

let worldTime = 0;

let notificationTimer = null;


/* =========================================================
   JUGADOR
========================================================= */

const player = {

    x: 2070,

    y: 1460,

    width: 30,

    height: 38,

    speed: 4.3,

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

    smooth: 0.12

};


/* =========================================================
   PROGRESO
========================================================= */

const progress = {

    xp: 0,

    photos: 0,

    history: 0,

    discoveries: 0,

    zones: 1,

    mission: 0

};


/* =========================================================
   INVENTARIO
========================================================= */

const inventory = [];


/* =========================================================
   ZONAS
========================================================= */

const zones = [

    {
        id: "center",
        name: "Centro del Chañar",
        x: 1500,
        y: 1050,
        width: 1100,
        height: 850,
        unlocked: true
    },

    {
        id: "chacras",
        name: "Zona de Chacras",
        x: 300,
        y: 1000,
        width: 1050,
        height: 1100,
        unlocked: false,
        requirement: 1
    },

    {
        id: "river",
        name: "Ribera del río Neuquén",
        x: 0,
        y: 2250,
        width: 4200,
        height: 500,
        unlocked: false,
        requirement: 2
    },

    {
        id: "vineyards",
        name: "Circuito Vitivinícola",
        x: 2750,
        y: 450,
        width: 1250,
        height: 900,
        unlocked: false,
        requirement: 3
    },

    {
        id: "old",
        name: "Memoria del Chañar",
        x: 400,
        y: 200,
        width: 1000,
        height: 600,
        unlocked: false,
        requirement: 4
    }

];


/* =========================================================
   EDIFICIOS
========================================================= */

const buildings = [

    {
        x: 1750,
        y: 980,
        width: 350,
        height: 210,
        color: "#b97852",
        name: "MUNICIPALIDAD",
        zone: "center"
    },

    {
        x: 2250,
        y: 990,
        width: 330,
        height: 210,
        color: "#9d765c",
        name: "RADIO OCARINA",
        zone: "center"
    },

    {
        x: 1800,
        y: 1510,
        width: 370,
        height: 220,
        color: "#a88668",
        name: "ESCUELA 273",
        zone: "center"
    },

    {
        x: 2380,
        y: 1530,
        width: 360,
        height: 230,
        color: "#80654e",
        name: "CLUB SAN PATRICIO",
        zone: "center"
    },

    {
        x: 1250,
        y: 1220,
        width: 250,
        height: 170,
        color: "#9d8068",
        name: "ALMACÉN",
        zone: "center"
    },

    {
        x: 3050,
        y: 610,
        width: 420,
        height: 230,
        color: "#80634c",
        name: "BODEGA",
        zone: "vineyards"
    },

    {
        x: 560,
        y: 1420,
        width: 300,
        height: 180,
        color: "#9e7454",
        name: "GALPÓN",
        zone: "chacras"
    },

    {
        x: 760,
        y: 360,
        width: 340,
        height: 200,
        color: "#89735d",
        name: "ANTIGUA POSTA",
        zone: "old"
    }

];


/* =========================================================
   ÁRBOLES / ALAMEDAS
========================================================= */

const trees = [];


function generateTrees() {

    trees.length = 0;

    for (
        let i = 0;
        i < 90;
        i++
    ) {

        const x =
            100 +
            Math.random() *
            (WORLD_WIDTH - 200);

        const y =
            100 +
            Math.random() *
            (WORLD_HEIGHT - 200);

        trees.push({
            x,
            y,
            size:
                0.8 +
                Math.random() *
                .6
        });

    }

}


generateTrees();


/* =========================================================
   PERSONAJES
========================================================= */

const npcs = [

    {
        id: "pedro",
        x: 1650,
        y: 1350,
        name: "Don Pedro",
        type: "elder",
        emoji: "👴",

        text:
            "Yo llegué cuando todavía había mucho viento, " +
            "tierra y trabajo por hacer. El Chañar no siempre " +
            "fue como lo ves ahora.",

        mission: 0

    },

    {
        id: "maria",
        x: 2150,
        y: 1370,
        name: "María",
        type: "teacher",
        emoji: "👩",

        text:
            "La Escuela 273 comenzó a funcionar en 1975. " +
            "La escuela fue mucho más que un edificio: " +
            "era un lugar de encuentro para las familias.",

        history: true

    },

    {
        id: "juan",
        x: 2600,
        y: 1360,
        name: "Juan",
        type: "farmer",
        emoji: "👨‍🌾",

        text:
            "Acá el agua es parte de la historia. " +
            "Sin riego no se entiende cómo este desierto " +
            "terminó convertido en una zona productiva.",

        mission: 1

    },

    {
        id: "sofia",
        x: 2350,
        y: 1100,
        name: "Sofía",
        type: "radio",
        emoji: "🎙️",

        text:
            "La radio tiene algo especial: permite que " +
            "las historias de la gente circulen por todo el pueblo.",

        history: true

    },

    {
        id: "miguel",
        x: 2800,
        y: 1660,
        name: "Miguel",
        type: "football",
        emoji: "⚽",

        text:
            "El Club Atlético San Patricio nació en 1976. " +
            "Para muchos vecinos fue un lugar de encuentro " +
            "después de la jornada de trabajo.",

        history: true

    },

    {
        id: "ana",
        x: 3350,
        y: 1050,
        name: "Ana",
        type: "wine",
        emoji: "🍇",

        text:
            "El desarrollo vitivinícola moderno tomó fuerza " +
            "a fines de los años 90. Los viñedos cambiaron " +
            "para siempre el paisaje productivo del Chañar.",

        mission: 3

    }

];


/* =========================================================
   ANIMALES
========================================================= */

const animals = [

    {
        x: 500,
        y: 1300,
        type: "sheep"
    },

    {
        x: 850,
        y: 1800,
        type: "horse"
    },

    {
        x: 3200,
        y: 900,
        type: "horse"
    },

    {
        x: 3600,
        y: 700,
        type: "sheep"
    }

];


/* =========================================================
   TRACTORES
========================================================= */

const tractors = [

    {
        x: 850,
        y: 1550,
        vx: 0.8,
        vy: 0,
        color: "#6c7835"
    },

    {
        x: 3200,
        y: 1250,
        vx: -0.6,
        vy: 0,
        color: "#8b6a35"
    }

];


/* =========================================================
   OBJETOS
========================================================= */

const objects = [

    {
        id: "photo1",
        x: 1450,
        y: 1450,
        type: "photo",
        name: "Fotografía del viejo Chañar",
        collected: false
    },

    {
        id: "document1",
        x: 1920,
        y: 1300,
        type: "document",
        name: "Documento sobre la fundación",
        collected: false
    },

    {
        id: "water1",
        x: 1150,
        y: 1950,
        type: "history",
        name: "Registro del riego",
        collected: false
    },

    {
        id: "photo2",
        x: 3500,
        y: 700,
        type: "photo",
        name: "Fotografía de los viñedos",
        collected: false
    },

    {
        id: "old1",
        x: 930,
        y: 500,
        type: "history",
        name: "Memoria de la antigua posta",
        collected: false
    }

];


/* =========================================================
   HISTORIA
========================================================= */

const historyEntries = [

    {
        id: "foundation",

        title:
            "21 de mayo de 1973",

        text:
            "San Patricio del Chañar fue fundado " +
            "mediante el Decreto Provincial Nº 1339. " +
            "La localidad comenzó a organizarse como " +
            "un nuevo núcleo urbano ligado al desarrollo " +
            "productivo de las chacras."

    },

    {
        id: "irrigation",

        title:
            "El agua y el nacimiento del oasis",

        text:
            "Las obras de riego fueron fundamentales " +
            "para transformar un territorio árido en " +
            "una zona agrícola productiva. Las primeras " +
            "bocatomas y obras de riego marcaron un " +
            "momento decisivo."

    },

    {
        id: "school",

        title:
            "La Escuela 273",

        text:
            "La Escuela Nº 273 comenzó a funcionar " +
            "en marzo de 1975 y se convirtió en uno " +
            "de los espacios fundamentales para la " +
            "vida comunitaria."

    },

    {
        id: "club",

        title:
            "Club Atlético San Patricio",

        text:
            "El Club Atlético San Patricio fue creado " +
            "en 1976. El deporte acompañó desde temprano " +
            "la construcción de identidad comunitaria."

    },

    {
        id: "wine",

        title:
            "El nuevo paisaje vitivinícola",

        text:
            "Desde fines de la década de 1990 comenzaron " +
            "a desarrollarse grandes proyectos vitivinícolas. " +
            "Los viñedos y las bodegas se incorporaron al " +
            "paisaje productivo del Chañar."

    }

];


/* =========================================================
   MISIONES
========================================================= */

const missions = [

    {

        id: 0,

        title:
            "La fotografía perdida",

        description:
            "Don Pedro necesita recuperar una fotografía " +
            "que puede ayudar a reconstruir una historia " +
            "del viejo Chañar.",

        target:
            "photo1",

        reward:
            100

    },

    {

        id: 1,

        title:
            "El camino del agua",

        description:
            "Encontrá el antiguo registro del sistema " +
            "de riego y descubrí por qué el agua fue " +
            "fundamental para transformar el territorio.",

        target:
            "water1",

        reward:
            150

    },

    {

        id: 2,

        title:
            "Las voces del pueblo",

        description:
            "Visitá la radio, la escuela y el club. " +
            "Cada lugar conserva una parte de la memoria " +
            "social del Chañar.",

        target:
            null,

        reward:
            200

    },

    {

        id: 3,

        title:
            "El nuevo paisaje",

        description:
            "Llegá hasta la zona vitivinícola y descubrí " +
            "cómo los viñedos transformaron el paisaje " +
            "productivo.",

        target:
            "photo2",

        reward:
            250

    },

    {

        id: 4,

        title:
            "Memoria del territorio",

        description:
            "Encontrá el antiguo registro de la zona " +
            "histórica y reconstruí una parte de la " +
            "memoria territorial del Chañar.",

        target:
            "old1",

        reward:
            350

    }

];


/* =========================================================
   TECLADO
========================================================= */

const keys = {};


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


        if (
            key === "h"
        ) {

            toggleHistory();

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


/* =========================================================
   CANVAS
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
   UTILIDADES
========================================================= */

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


/* =========================================================
   ZONA DEL JUGADOR
========================================================= */

function getCurrentZone() {

    for (
        const zone of zones
    ) {

        if (

            player.x >= zone.x &&

            player.x <=
            zone.x + zone.width &&

            player.y >= zone.y &&

            player.y <=
            zone.y + zone.height

        ) {

            return zone;

        }

    }

    return zones[0];

}


/* =========================================================
   MOVIMIENTO
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


    /* EDIFICIOS */

    for (
        const building of buildings
    ) {

        const zone =
            zones.find(
                z =>
                    z.id ===
                    building.zone
            );


        if (
            zone &&
            !zone.unlocked
        ) {

            continue;

        }


        if (
            collision(
                test,
                building
            )
        ) {

            return false;

        }

    }


    /* LÍMITES */

    if (
        x < 0 ||
        y < 0 ||
        x >
            WORLD_WIDTH -
            player.width ||
        y >
            WORLD_HEIGHT -
            player.height
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

        dx *=
            0.707;

        dy *=
            0.707;

    }


    player.moving =
        dx !== 0 ||
        dy !== 0;


    if (
        player.moving
    ) {

        player.frame +=
            0.18;

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


    checkZoneUnlocks();

}


/* =========================================================
   DESBLOQUEO
========================================================= */

function checkZoneUnlocks() {

    for (
        const zone of zones
    ) {

        if (
            zone.unlocked
        ) {

            continue;

        }


        if (
            progress.mission >=
            zone.requirement
        ) {

            zone.unlocked =
                true;

            progress.zones++;

            notify(
                "🗺️ Nueva zona desbloqueada: " +
                zone.name
            );

        }

    }

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


/* =========================================================
   MUNDO
========================================================= */

function drawWorld() {

    /* TIERRA */

    ctx.fillStyle =
        "#c8aa76";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* BARDA NORTE */

    ctx.fillStyle =
        "#8d735d";

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
        3400,
        300
    );

    ctx.lineTo(
        2800,
        460
    );

    ctx.lineTo(
        2200,
        330
    );

    ctx.lineTo(
        1500,
        450
    );

    ctx.lineTo(
        900,
        300
    );

    ctx.lineTo(
        0,
        470
    );

    ctx.closePath();

    ctx.fill();


    /* CALLES */

    ctx.fillStyle =
        "#a4865d";


    ctx.fillRect(
        0,
        1360,
        WORLD_WIDTH,
        150
    );


    ctx.fillRect(
        1980,
        0,
        160,
        WORLD_HEIGHT
    );


    ctx.fillRect(
        1000,
        900,
        260,
        WORLD_HEIGHT
    );


    /* PLAZA */

    ctx.fillStyle =
        "#6d965b";

    ctx.fillRect(
        1650,
        1190,
        650,
        360
    );


    /* CAMINOS DE TIERRA */

    ctx.strokeStyle =
        "#8d704d";

    ctx.lineWidth =
        35;

    ctx.beginPath();

    ctx.moveTo(
        300,
        1550
    );

    ctx.quadraticCurveTo(
        700,
        1400,
        1200,
        1550
    );

    ctx.stroke();


    /* CANALES */

    drawCanals();


    /* VIÑEDOS */

    if (
        zones.find(
            z => z.id === "vineyards"
        ).unlocked
    ) {

        drawVineyard(
            2900,
            700
        );

        drawVineyard(
            3500,
            850
        );

    }


    /* CHACRAS */

    drawOrchards();


    /* ÁRBOLES */

    for (
        const tree of trees
    ) {

        drawTree(
            tree.x,
            tree.y,
            tree.size
        );

    }


    /* MONTAÑAS */

    drawDistantMountains();

}


/* =========================================================
   MONTAÑAS
========================================================= */

function drawDistantMountains() {

    ctx.fillStyle =
        "rgba(98,83,68,.45)";

    ctx.beginPath();

    ctx.moveTo(
        0,
        470
    );

    ctx.lineTo(
        500,
        180
    );

    ctx.lineTo(
        950,
        440
    );

    ctx.lineTo(
        1500,
        160
    );

    ctx.lineTo(
        2050,
        430
    );

    ctx.lineTo(
        2600,
        190
    );

    ctx.lineTo(
        3300,
        450
    );

    ctx.lineTo(
        4000,
        160
    );

    ctx.lineTo(
        WORLD_WIDTH,
        450
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
   CANALES
========================================================= */

function drawCanals() {

    ctx.fillStyle =
        "#4e8794";

    ctx.fillRect(
        0,
        1950,
        WORLD_WIDTH,
        35
    );


    ctx.fillRect(
        1350,
        500,
        30,
        1700
    );


    ctx.fillStyle =
        "rgba(255,255,255,.15)";

    ctx.fillRect(
        0,
        1955,
        WORLD_WIDTH,
        4
    );

}


/* =========================================================
   ÁRBOLES
========================================================= */

function drawTree(
    x,
    y,
    size = 1
) {

    ctx.fillStyle =
        "#65442e";

    ctx.fillRect(
        x - 7 * size,
        y,
        14 * size,
        42 * size
    );


    ctx.fillStyle =
        "#476d3c";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        32 * size,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#5a7e43";

    ctx.beginPath();

    ctx.arc(
        x - 16 * size,
        y + 4 * size,
        20 * size,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   CHACRAS
========================================================= */

function drawOrchards() {

    ctx.strokeStyle =
        "#536c3f";

    ctx.lineWidth =
        2;


    for (
        let row = 0;
        row < 14;
        row++
    ) {

        for (
            let col = 0;
            col < 18;
            col++
        ) {

            const x =
                350 +
                col * 42;

            const y =
                1100 +
                row * 48;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y + 25
            );

            ctx.stroke();


            ctx.fillStyle =
                "#4d753e";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                11,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}


/* =========================================================
   VIÑEDO
========================================================= */

function drawVineyard(
    x,
    y
) {

    for (
        let row = 0;
        row < 10;
        row++
    ) {

        ctx.strokeStyle =
            "#526b3d";

        ctx.lineWidth =
            3;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y + row * 38
        );

        ctx.lineTo(
            x + 900,
            y + row * 38
        );

        ctx.stroke();


        for (
            let col = 0;
            col < 28;
            col++
        ) {

            const px =
                x +
                col * 34;

            const py =
                y +
                row * 38;


            ctx.fillStyle =
                "#4b723b";

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                7,
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
        const building of buildings
    ) {

        const zone =
            zones.find(
                z =>
                    z.id ===
                    building.zone
            );


        if (
            zone &&
            !zone.unlocked
        ) {

            continue;

        }


        /* SOMBRA */

        ctx.fillStyle =
            "rgba(0,0,0,.22)";

        ctx.fillRect(
            building.x + 9,
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
            "#4a382d";

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


        /* PUERTA */

        ctx.fillStyle =
            "#3c3029";

        ctx.fillRect(
            building.x +
            building.width / 2 -
            20,

            building.y +
            building.height -
            65,

            40,
            65
        );


        /* VENTANAS */

        ctx.fillStyle =
            "#a9c5c2";

        ctx.fillRect(
            building.x + 30,
            building.y + 35,
            45,
            40
        );

        ctx.fillRect(
            building.x +
            building.width -
            75,

            building.y + 35,

            45,
            40
        );


        /* CARTEL */

        ctx.fillStyle =
            "rgba(40,30,20,.75)";

        ctx.fillRect(
            building.x,
            building.y +
            building.height +
            10,

            building.width,
            30
        );


        ctx.fillStyle =
            "#f4e8cb";

        ctx.font =
            "bold 13px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            building.name,
            building.x +
            building.width / 2,

            building.y +
            building.height +
            30
        );

        ctx.textAlign =
            "left";

    }

}


/* =========================================================
   TRACTORES
========================================================= */

function updateTractors() {

    for (
        const tractor of tractors
    ) {

        tractor.x +=
            tractor.vx;


        if (
            tractor.x > 3800 ||
            tractor.x < 400
        ) {

            tractor.vx *=
                -1;

        }

    }

}


function drawTractor(
    tractor
) {

    ctx.fillStyle =
        "#333";

    ctx.beginPath();

    ctx.arc(
        tractor.x - 20,
        tractor.y + 20,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        tractor.x + 25,
        tractor.y + 20,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        tractor.color;

    ctx.fillRect(
        tractor.x - 30,
        tractor.y - 5,
        65,
        35
    );


    ctx.fillStyle =
        "#8eb1ad";

    ctx.fillRect(
        tractor.x - 5,
        tractor.y - 35,
        35,
        30
    );


    ctx.fillStyle =
        "#55402c";

    ctx.fillRect(
        tractor.x + 35,
        tractor.y + 5,
        35,
        12
    );

}


/* =========================================================
   ANIMALES
========================================================= */

function drawAnimal(animal) {

    if (
        animal.type === "sheep"
    ) {

        ctx.fillStyle =
            "#e8e0ce";

        ctx.beginPath();

        ctx.arc(
            animal.x,
            animal.y,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#333";

        ctx.beginPath();

        ctx.arc(
            animal.x + 14,
            animal.y - 3,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    if (
        animal.type === "horse"
    ) {

        ctx.fillStyle =
            "#684c38";

        ctx.fillRect(
            animal.x - 25,
            animal.y - 10,
            50,
            25
        );

        ctx.fillRect(
            animal.x + 15,
            animal.y - 25,
            20,
            30
        );

    }

}


/* =========================================================
   NPC
========================================================= */

function drawNPC(npc) {

    const bob =
        Math.sin(
            performance.now() / 500 +
            npc.x
        ) * 1.5;


    ctx.fillStyle =
        "#5b3f45";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y + bob,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#d7a77f";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 23 + bob,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "white";

    ctx.font =
        "13px Arial";

    ctx.fillText(
        npc.name,
        npc.x - 30,
        npc.y + 43
    );


    /* INDICADOR */

    if (
        npc.mission !== undefined
    ) {

        ctx.fillStyle =
            "#e5bb45";

        ctx.font =
            "bold 20px Arial";

        ctx.fillText(
            "!",
            npc.x - 5,
            npc.y - 45
        );

    }

}


/* =========================================================
   OBJETOS
========================================================= */

function drawObjects() {

    for (
        const object of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        let icon =
            "✦";


        if (
            object.type ===
            "photo"
        ) {

            icon =
                "📷";

        }


        if (
            object.type ===
            "document"
        ) {

            icon =
                "📜";

        }


        if (
            object.type ===
            "history"
        ) {

            icon =
                "📖";

        }


        ctx.font =
            "25px Arial";

        ctx.fillText(
            icon,
            object.x,
            object.y
        );


        ctx.fillStyle =
            "rgba(255,220,100,.4)";

        ctx.beginPath();

        ctx.arc(
            object.x + 8,
            object.y - 8,
            18 +
            Math.sin(
                performance.now()/300
            ) * 4,
            0,
            Math.PI * 2
        );

        ctx.stroke();

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
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        x + 15,
        y + 38,
        22,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#304759";

    ctx.fillRect(
        x,
        y,
        30,
        30
    );


    /* cabeza */

    ctx.fillStyle =
        "#d9a67d";

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
        "#35271f";

    ctx.beginPath();

    ctx.arc(
        x + 15,
        y - 16,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* mochila */

    ctx.fillStyle =
        "#72563b";

    ctx.fillRect(
        x - 5,
        y + 5,
        7,
        20
    );

}


/* =========================================================
   INTERACCIÓN
========================================================= */

function interact() {

    /* NPC */

    for (
        const npc of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 90
        ) {

            showDialogue(
                npc
            );

            return;

        }

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
            ) < 80
        ) {

            collectObject(
                object
            );

            return;

        }

    }


    notify(
        "No hay nada para interactuar acá."
    );

}


/* =========================================================
   DIÁLOGOS
========================================================= */

function showDialogue(npc) {

    const dialogue =
        document.getElementById(
            "dialogue"
        );


    document.getElementById(
        "dialogue-name"
    ).textContent =
        npc.name;


    document.getElementById(
        "dialogue-text"
    ).textContent =
        npc.text;


    document.getElementById(
        "dialogue-avatar"
    ).textContent =
        npc.emoji;


    dialogue.classList.remove(
        "hidden"
    );


    /* MISIÓN */

    if (
        npc.mission !== undefined &&
        progress.mission ===
        npc.mission
    ) {

        startMission(
            npc.mission
        );

    }


    /* HISTORIA */

    if (
        npc.history
    ) {

        addXP(
            20
        );

    }

}


/* =========================================================
   MISIÓN
========================================================= */

function startMission(index) {

    const mission =
        missions[index];


    if (
        !mission
    ) {

        return;

    }


    if (
        progress.mission >
        index
    ) {

        return;

    }


    showMission(
        mission
    );

}


/* =========================================================
   MOSTRAR MISIÓN
========================================================= */

function showMission(mission) {

    document.getElementById(
        "mission-title"
    ).textContent =
        mission.title;


    document.getElementById(
        "mission-description"
    ).textContent =
        mission.description;


    document.getElementById(
        "mission-panel"
    ).classList.remove(
        "hidden"
    );


    updateMissionHUD();

}


/* =========================================================
   COLECCIONAR
========================================================= */

function collectObject(object) {

    object.collected =
        true;


    inventory.push(
        object.name
    );


    if (
        object.type ===
        "photo"
    ) {

        progress.photos++;

    }


    if (
        object.type ===
        "history" ||
        object.type ===
        "document"
    ) {

        progress.history++;

        addHistoryItem(
            object
        );

    }


    progress.discoveries++;


    addXP(
        50
    );


    notify(
        "📖 Descubriste: " +
        object.name
    );


    /* MISIÓN */

    const currentMission =
        missions[
            progress.mission
        ];


    if (
        currentMission &&
        currentMission.target ===
        object.id
    ) {

        completeMission();

    }


    updateHUD();

}


/* =========================================================
   COMPLETAR MISIÓN
========================================================= */

function completeMission() {

    const mission =
        missions[
            progress.mission
        ];


    if (
        !mission
    ) {

        return;

    }


    addXP(
        mission.reward
    );


    progress.mission++;


    notify(
        "🎯 Misión completada: " +
        mission.title
    );


    checkZoneUnlocks();


    updateMissionHUD();

}


/* =========================================================
   XP
========================================================= */

function addXP(amount) {

    progress.xp +=
        amount;

    updateHUD();

}


/* =========================================================
   HISTORIA
========================================================= */

function addHistoryItem(object) {

    const entry =
        historyEntries[
            Math.min(
                progress.history,
                historyEntries.length - 1
            )
        ];


    if (
        entry
    ) {

        notify(
            "📜 Nueva historia desbloqueada"
        );

    }

}


/* =========================================================
   PANEL HISTÓRICO
========================================================= */

function toggleHistory() {

    const panel =
        document.getElementById(
            "history-panel"
        );


    panel.classList.toggle(
        "hidden"
    );


    if (
        !panel.classList.contains(
            "hidden"
        )
    ) {

        renderHistory();

    }

}


function renderHistory() {

    const container =
        document.getElementById(
            "history-content"
        );


    let html =
        "";


    const unlocked =
        Math.min(
            progress.history + 1,
            historyEntries.length
        );


    for (
        let i = 0;
        i < unlocked;
        i++
    ) {

        const entry =
            historyEntries[i];


        html += `

            <div class="history-entry">

                <h3>
                    ${entry.title}
                </h3>

                <p>
                    ${entry.text}
                </p>

            </div>

        `;

    }


    container.innerHTML =
        html;

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
            "Todavía no encontraste objetos.";

    }

    else {

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


    document.getElementById(
        "inventory-xp"
    ).textContent =
        progress.xp;


    document.getElementById(
        "inventory-history"
    ).textContent =
        progress.history;


    document.getElementById(
        "inventory-zones"
    ).textContent =
        progress.zones;

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    document.getElementById(
        "xp"
    ).textContent =
        progress.xp;


    document.getElementById(
        "photo-count"
    ).textContent =
        progress.photos;


    document.getElementById(
        "history-count"
    ).textContent =
        progress.history;


    updateMissionHUD();

}


function updateMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );


    const mission =
        missions[
            progress.mission
        ];


    if (
        !mission
    ) {

        hud.textContent =
            "🏆 Historia completada";

        return;

    }


    hud.textContent =
        "🎯 " +
        mission.title;

}


/* =========================================================
   ZONA HUD
========================================================= */

function updateZoneHUD() {

    const zone =
        getCurrentZone();


    document.getElementById(
        "zone-name"
    ).textContent =
        zone.name;

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function notify(text) {

    const element =
        document.getElementById(
            "notification"
        );


    element.textContent =
        text;


    element.classList.remove(
        "hidden"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            function() {

                element.classList.add(
                    "hidden"
                );

            },
            2800
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
        "#c8aa76";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* ZONAS */

    for (
        const zone of zones
    ) {

        miniCtx.fillStyle =
            zone.unlocked
                ?
                "#7e9b68"
                :
                "#6c6252";


        miniCtx.fillRect(
            zone.x * sx,
            zone.y * sy,
            zone.width * sx,
            zone.height * sy
        );

    }


    /* AGUA */

    miniCtx.fillStyle =
        "#4e8794";

    miniCtx.fillRect(
        0,
        1950 * sy,
        minimap.width,
        35 * sy
    );


    /* EDIFICIOS */

    miniCtx.fillStyle =
        "#554237";


    for (
        const building of buildings
    ) {

        const zone =
            zones.find(
                z =>
                    z.id ===
                    building.zone
            );


        if (
            zone &&
            !zone.unlocked
        ) {

            continue;

        }


        miniCtx.fillRect(
            building.x * sx,
            building.y * sy,
            building.width * sx,
            building.height * sy
        );

    }


    /* OBJETOS */

    miniCtx.fillStyle =
        "#e8c34f";


    for (
        const object of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        miniCtx.fillRect(
            object.x * sx,
            object.y * sy,
            4,
            4
        );

    }


    /* PLAYER */

    miniCtx.fillStyle =
        "#e74c3c";


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
   DÍA / NOCHE
========================================================= */

function drawLighting() {

    worldTime +=
        0.00025;


    const darkness =
        (
            Math.sin(
                worldTime
            ) + 1
        ) / 2;


    ctx.fillStyle =
        `rgba(20,30,70,${darkness * .15})`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* =========================================================
   GUARDADO
========================================================= */

function saveGame() {

    const data = {

        progress,

        inventory,

        player: {

            x:
                player.x,

            y:
                player.y

        },

        zones:
            zones.map(
                zone => ({
                    id:
                        zone.id,

                    unlocked:
                        zone.unlocked
                })
            ),

        objects:
            objects.map(
                object => ({
                    id:
                        object.id,

                    collected:
                        object.collected
                })
            )

    };


    localStorage.setItem(
        "chanar-save-v18",
        JSON.stringify(
            data
        )
    );

}


function loadGame() {

    const raw =
        localStorage.getItem(
            "chanar-save-v18"
        );


    if (
        !raw
    ) {

        return false;

    }


    try {

        const data =
            JSON.parse(
                raw
            );


        Object.assign(
            progress,
            data.progress
        );


        inventory.push(
            ...(data.inventory || [])
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
            data.zones
        ) {

            for (
                const saved of
                data.zones
            ) {

                const zone =
                    zones.find(
                        z =>
                            z.id ===
                            saved.id
                    );


                if (
                    zone
                ) {

                    zone.unlocked =
                        saved.unlocked;

                }

            }

        }


        if (
            data.objects
        ) {

            for (
                const saved of
                data.objects
            ) {

                const object =
                    objects.find(
                        o =>
                            o.id ===
                            saved.id
                    );


                if (
                    object
                ) {

                    object.collected =
                        saved.collected;

                }

            }

        }


        return true;

    }

    catch(error) {

        console.error(
            "Error cargando partida:",
            error
        );

        return false;

    }

}


/* =========================================================
   AUTOSAVE
========================================================= */

setInterval(
    saveGame,
    10000
);


/* =========================================================
   BOTONES
========================================================= */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById(
        "continue-button"
    )
    .addEventListener(
        "click",
        function() {

            loadGame();

            startGame();

        }
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


    notify(
        "🌿 Bienvenido a San Patricio del Chañar"
    );

}


/* =========================================================
   BOTONES MODALES
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


document
    .getElementById(
        "history-close"
    )
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "history-panel"
                )
                .classList
                .add(
                    "hidden"
                );

        }
    );


/* =========================================================
   CONTROLES MÓVILES
========================================================= */

document
    .querySelectorAll(
        ".mobile-key"
    )
    .forEach(
        function(button) {

            const key =
                button.dataset.key;


            button.addEventListener(
                "touchstart",
                function(e) {

                    e.preventDefault();

                    keys[key] =
                        true;

                },
                {
                    passive: false
                }
            );


            button.addEventListener(
                "touchend",
                function(e) {

                    e.preventDefault();

                    keys[key] =
                        false;

                },
                {
                    passive: false
                }
            );


            button.addEventListener(
                "touchcancel",
                function() {

                    keys[key] =
                        false;

                }
            );

        }
    );


document
    .getElementById(
        "mobile-interact"
    )
    .addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            interact();

        },
        {
            passive: false
        }
    );


document
    .getElementById(
        "mobile-inventory"
    )
    .addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            toggleInventory();

        },
        {
            passive: false
        }
    );


/* =========================================================
   CICLO PRINCIPAL
========================================================= */

function update() {

    if (
        !gameStarted
    ) {

        return;

    }


    updatePlayer();

    updateCamera();

    updateTractors();

    updateZoneHUD();

    saveGame();

}


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
        const animal of animals
    ) {

        drawAnimal(
            animal
        );

    }


    for (
        const tractor of tractors
    ) {

        drawTractor(
            tractor
        );

    }


    for (
        const npc of npcs
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


function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   INICIO
========================================================= */

const hasSave =
    localStorage.getItem(
        "chanar-save-v18"
    );


if (
    hasSave
) {

    document
        .getElementById(
            "continue-button"
        )
        .classList
        .remove(
            "hidden"
        );

}


updateHUD();

updateInventory();

gameLoop();
