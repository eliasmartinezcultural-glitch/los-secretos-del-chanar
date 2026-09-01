/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   V18.0 — PUEBLO VIVO
   Juego creado por Elías Martínez
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

const WORLD = {

    width: 4200,
    height: 3000

};


/* =====================================================
   RESIZE
===================================================== */

function resizeCanvas() {

    canvas.width =
        window.innerWidth *
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.height =
        window.innerHeight *
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";

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

        if (key === "e") {

            interact();

        }

        if (key === "m") {

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
   ESTADO
===================================================== */

let gameStarted = false;

let gameTime = 8 * 60;

let lastTime = performance.now();

let notificationTimer = 0;

let historyFound = 0;

let discoveries = 0;

let reputation = 0;

let money = 120;

let insideBuilding = null;


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2020,

    y: 1420,

    width: 28,

    height: 42,

    speed: 230,

    direction: "down",

    moving: false,

    frame: 0

};


/* =====================================================
   CAMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth: 7

};


/* =====================================================
   INVENTARIO
===================================================== */

const inventory = {

    photos: 0,

    documents: 0,

    bread: 0,

    items: []

};


/* =====================================================
   MISION
===================================================== */

const mission = {

    stage: 0,

    title:
        "Los secretos del Chañar",

    text:
        "Recorré el pueblo y empezá a conocer " +
        "a sus habitantes."

};


/* =====================================================
   COLORES
===================================================== */

const COLORS = {

    ground:
        "#c9ad78",

    dirt:
        "#a98358",

    road:
        "#77706a",

    roadEdge:
        "#5c5651",

    grass:
        "#6f9657",

    green:
        "#4e7544",

    water:
        "#4e8da0",

    wall:
        "#b98a67",

    roof:
        "#5a4035",

    window:
        "#9ec0c1",

    skin:
        "#d99e78",

    shirt:
        "#40566b"

};


/* =====================================================
   CALLES
===================================================== */

const roads = [

    {
        x: 0,
        y: 1280,
        width: WORLD.width,
        height: 180,
        type: "main"
    },

    {
        x: 1920,
        y: 0,
        width: 190,
        height: WORLD.height,
        type: "main"
    },

    {
        x: 0,
        y: 720,
        width: WORLD.width,
        height: 120,
        type: "street"
    },

    {
        x: 0,
        y: 2180,
        width: WORLD.width,
        height: 110,
        type: "street"
    },

    {
        x: 820,
        y: 0,
        width: 110,
        height: WORLD.height,
        type: "street"
    },

    {
        x: 3150,
        y: 0,
        width: 110,
        height: WORLD.height,
        type: "street"
    }

];


/* =====================================================
   CANALES
===================================================== */

const canals = [

    {
        x: 0,
        y: 2500,
        width: WORLD.width,
        height: 45
    },

    {
        x: 1080,
        y: 0,
        width: 35,
        height: WORLD.height
    }

];


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        id: "municipalidad",

        x: 1450,
        y: 980,

        w: 300,
        h: 190,

        type: "municipality",

        name:
            "Municipalidad",

        interior:
            "Oficina Municipal",

        color:
            "#4d958c"

    },


    {
        id: "panaderia",

        x: 1050,
        y: 920,

        w: 220,
        h: 150,

        type: "bakery",

        name:
            "Panadería La Esquina",

        interior:
            "Panadería",

        color:
            "#c87945"

    },


    {
        id: "radio",

        x: 2320,
        y: 900,

        w: 300,
        h: 170,

        type: "radio",

        name:
            "Radio Ocarina",

        interior:
            "Estudio de Radio",

        color:
            "#67576e"

    },


    {
        id: "school",

        x: 700,
        y: 440,

        w: 370,
        h: 200,

        type: "school",

        name:
            "Escuela",

        interior:
            "Escuela",

        color:
            "#d1aa67"

    },


    {
        id: "almacen",

        x: 3350,
        y: 850,

        w: 230,
        h: 150,

        type: "shop",

        name:
            "Almacén del Barrio",

        interior:
            "Almacén",

        color:
            "#8c765b"

    },


    {
        id: "club",

        x: 2780,
        y: 1260,

        w: 300,
        h: 150,

        type: "club",

        name:
            "Club San Patricio",

        interior:
            "Club",

        color:
            "#4f7161"

    },


    {
        id: "house1",

        x: 300,
        y: 980,

        w: 210,

        h: 150,

        type: "house",

        name:
            "Casa de Don Pedro",

        interior:
            "Casa",

        color:
            "#a87559"

    },


    {
        id: "house2",

        x: 450,
        y: 1550,

        w: 230,

        h: 155,

        type: "house",

        name:
            "Casa de María",

        interior:
            "Casa",

        color:
            "#8c806d"

    },


    {
        id: "house3",

        x: 3350,
        y: 1550,

        w: 230,

        h: 150,

        type: "house",

        name:
            "Casa de Julián",

        interior:
            "Casa",

        color:
            "#9c6d53"

    }

];


/* =====================================================
   ESTADIO
===================================================== */

const stadium = {

    x: 3000,

    y: 1750,

    w: 800,

    h: 520

};


/* =====================================================
   CHACRAS
===================================================== */

const farms = [

    {
        x: 100,
        y: 100,

        w: 650,
        h: 520,

        type:
            "orchard",

        name:
            "Chacras del Chañar"

    },

    {
        x: 3350,
        y: 100,

        w: 700,

        h: 550,

        type:
            "vineyard",

        name:
            "Viñedos"

    },

    {
        x: 100,
        y: 2300,

        w: 850,
        h: 500,

        type:
            "orchard",

        name:
            "Chacra productiva"

    }

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        id:
            "pedro",

        name:
            "Don Pedro",

        x:
            620,

        y:
            1120,

        role:
            "Vecino",

        shirt:
            "#596b52",

        routine:
            "walk",

        dialogue: [

            "Buen día, vecino. ¿Cómo anda?",

            "Acá estamos, como siempre.",

            "El Chañar cambió muchísimo.",

            "Antes había que pensar cada gota de agua.",

            "Si querés conocer el pueblo, caminá. No tengas apuro."

        ],

        history:
            "Cuando yo llegué esto era muy distinto. " +
            "La historia del pueblo está muy ligada al trabajo, " +
            "al agua y a las chacras."

    },


    {
        id:
            "maria",

        name:
            "María",

        x:
            920,

        y:
            1220,

        role:
            "Panadera",

        shirt:
            "#a65e45",

        routine:
            "shop",

        dialogue: [

            "Buen día. ¿Pan calentito?",

            "Recién salieron unas tortas fritas.",

            "Si venís temprano, todavía queda pan casero.",

            "Acá todos nos conocemos."

        ],

        history:
            "Los comercios también cuentan la historia de un pueblo. " +
            "Acá la gente se cruza, conversa y se entera de todo."

    },


    {
        id:
            "raul",

        name:
            "Raúl",

        x:
            1500,

        y:
            820,

        role:
            "Trabajador municipal",

        shirt:
            "#3e6873",

        routine:
            "work",

        dialogue: [

            "Buen día.",

            "Estamos arreglando unas cosas de la plaza.",

            "Acá siempre aparece algo para hacer.",

            "¿Viste cómo creció el pueblo?"

        ],

        history:
            "El crecimiento de Chañar transformó la relación entre el casco urbano y las zonas productivas."

    },


    {
        id:
            "lucia",

        name:
            "Lucía",

        x:
            1980,

        y:
            1050,

        role:
            "Docente",

        shirt:
            "#785b79",

        routine:
            "walk",

        dialogue: [

            "Hola, ¿todo bien?",

            "Estoy yendo a la escuela.",

            "Los chicos saben un montón de historias del pueblo.",

            "Algún día tendríamos que hacer una memoria oral."

        ],

        history:
            "La memoria de un pueblo también vive en las voces de sus vecinos."

    },


    {
        id:
            "julian",

        name:
            "Julián",

        x:
            2250,

        y:
            1170,

        role:
            "Operador de radio",

        shirt:
            "#574c77",

        routine:
            "radio",

        dialogue: [

            "¡Buenas!",

            "¿Escuchaste la radio hoy?",

            "Acá siempre hay alguien que tiene algo para contar.",

            "La radio en los pueblos es mucho más que música.",

            "Una noticia puede recorrer todo Chañar en minutos."

        ],

        history:
            "La comunicación forma parte de la identidad cotidiana del pueblo."

    },


    {
        id:
            "oscar",

        name:
            "Oscar",

        x:
            3650,

        y:
            1050,

        role:
            "Productor",

        shirt:
            "#536b45",

        routine:
            "farm",

        dialogue: [

            "Buen día.",

            "Hoy toca revisar el riego.",

            "La chacra no espera.",

            "Acá el agua manda.",

            "Mirá esos frutales. Costó años llegar hasta acá."

        ],

        history:
            "El desarrollo agrícola del Chañar estuvo profundamente vinculado a la infraestructura de riego."

    },


    {
        id:
            "sofia",

        name:
            "Sofía",

        x:
            2950,

        y:
            1520,

        role:
            "Jugadora",

        shirt:
            "#a94949",

        routine:
            "sport",

        dialogue: [

            "¿Venís a la cancha?",

            "Hoy entrenamos.",

            "Acá el club es parte de la vida del barrio.",

            "Después del trabajo siempre hay alguno que viene a patear."

        ],

        history:
            "El Club Atlético San Patricio fue fundado en 1976 y está ligado a la historia social de la localidad."

    }

];


/* =====================================================
   ANIMALES
===================================================== */

const animals = [

    {
        type:
            "dog",

        x:
            570,

        y:
            1450,

        dx:
            25,

        dy:
            10

    },

    {
        type:
            "dog",

        x:
            3150,

        y:
            1120,

        dx:
            -15,

        dy:
            10

    },

    {
        type:
            "horse",

        x:
            500,

        y:
            2600,

        dx:
            10,

        dy:
            -5

    },

    {
        type:
            "cow",

        x:
            3700,

        y:
            420,

        dx:
            -8,

        dy:
            3

    }

];


/* =====================================================
   VEHICULOS
===================================================== */

const vehicles = [

    {
        type:
            "car",

        x:
            100,

        y:
            1360,

        direction:
            "right",

        speed:
            110,

        color:
            "#b94f46"

    },

    {
        type:
            "car",

        x:
            3800,

        y:
            1360,

        direction:
            "left",

        speed:
            90,

        color:
            "#47708c"

    },

    {
        type:
            "tractor",

        x:
            150,

        y:
            770,

        direction:
            "right",

        speed:
            55,

        color:
            "#557c42"

    },

    {
        type:
            "car",

        x:
            1980,

        y:
            2500,

        direction:
            "up",

        speed:
            100,

        color:
            "#73566f"

    }

];


/* =====================================================
   OBJETOS HISTÓRICOS
===================================================== */

const historicalObjects = [

    {
        x:
            1350,

        y:
            500,

        type:
            "document",

        title:
            "El origen del pueblo",

        text:
            "San Patricio del Chañar fue fundado el 21 de mayo de 1973. " +
            "La Comisión de Fomento fue creada mediante el Decreto Provincial 1339.",

        found:
            false

    },

    {
        x:
            1250,

        y:
            2600,

        type:
            "water",

        title:
            "El agua",

        text:
            "El desarrollo productivo estuvo ligado a la sistematización del riego " +
            "y al aprovechamiento del agua del río Neuquén.",

        found:
            false

    },

    {
        x:
            3650,

        y:
            300,

        type:
            "vine",

        title:
            "El vino",

        text:
            "El desarrollo vitivinícola moderno comenzó a consolidarse desde fines " +
            "de la década de 1990.",

        found:
            false

    },

    {
        x:
            3250,

        y:
            1980,

        type:
            "club",

        title:
            "El club",

        text:
            "El Club Atlético San Patricio nació en 1976 y forma parte de la historia " +
            "social y deportiva de la localidad.",

        found:
            false

    }

];


/* =====================================================
   UTILIDADES
===================================================== */

function distance(a,b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function rectCollision(a,b) {

    return (

        a.x <
        b.x + b.w &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.h &&

        a.y + a.height >
        b.y

    );

}


function pointInRect(x,y,r) {

    return (

        x >= r.x &&
        x <= r.x+r.w &&
        y >= r.y &&
        y <= r.y+r.h

    );

}


/* =====================================================
   CAMINOS
===================================================== */

function isRoad(x,y) {

    return roads.some(
        r =>
            pointInRect(
                x,
                y,
                {
                    x:r.x,
                    y:r.y,
                    w:r.width,
                    h:r.height
                }
            )
    );

}


/* =====================================================
   COLISIONES
===================================================== */

function canMove(x,y) {

    const test = {

        x:x,

        y:y,

        width:
            player.width,

        height:
            player.height

    };


    if (
        x < 10 ||
        y < 10 ||
        x >
        WORLD.width -
        player.width -
        10 ||
        y >
        WORLD.height -
        player.height -
        10
    ) {

        return false;

    }


    if (
        insideBuilding
    ) {

        return true;

    }


    for (
        const b of buildings
    ) {

        if (
            rectCollision(
                test,
                {
                    x:b.x,
                    y:b.y,
                    w:b.w,
                    h:b.h
                }
            )
        ) {

            return false;

        }

    }


    return true;

}


/* =====================================================
   MOVIMIENTO
===================================================== */

function updatePlayer(dt) {

    if (
        insideBuilding
    ) {

        updateInteriorPlayer(dt);

        return;

    }


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


    const length =
        Math.hypot(dx,dy);


    if (
        length > 0
    ) {

        dx /= length;
        dy /= length;

        player.moving =
            true;

        player.frame +=
            dt * 10;

    } else {

        player.moving =
            false;

    }


    const speed =
        player.speed *
        dt;


    const nx =
        player.x +
        dx * speed;

    const ny =
        player.y +
        dy * speed;


    if (
        canMove(
            nx,
            player.y
        )
    ) {

        player.x =
            nx;

    }


    if (
        canMove(
            player.x,
            ny
        )
    ) {

        player.y =
            ny;

    }

}


/* =====================================================
   INTERIOR
===================================================== */

let interiorPlayer = {

    x: 400,

    y: 350

};


function enterBuilding(building) {

    insideBuilding =
        building;

    interiorPlayer.x =
        400;

    interiorPlayer.y =
        360;

    notify(
        "Entraste en " +
        building.interior
    );

}


function exitBuilding() {

    if (
        !insideBuilding
    ) {

        return;

    }


    const b =
        insideBuilding;


    player.x =
        b.x +
        b.w / 2;

    player.y =
        b.y +
        b.h +
        35;


    insideBuilding =
        null;

    notify(
        "Saliste de " +
        b.name
    );

}


function updateInteriorPlayer(dt) {

    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) dy--;

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) dy++;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) dx--;

    if (
        keys["d"] ||
        keys["arrowright"]
    ) dx++;


    const len =
        Math.hypot(dx,dy);


    if (
        len
    ) {

        dx/=len;
        dy/=len;

        interiorPlayer.x +=
            dx * 220 * dt;

        interiorPlayer.y +=
            dy * 220 * dt;

    }


    interiorPlayer.x =
        Math.max(
            40,
            Math.min(
                760,
                interiorPlayer.x
            )
        );


    interiorPlayer.y =
        Math.max(
            60,
            Math.min(
                560,
                interiorPlayer.y
            )
        );

}


/* =====================================================
   VEHICULOS
===================================================== */

function updateVehicles(dt) {

    for (
        const v of vehicles
    ) {

        if (
            v.direction ===
            "right"
        ) {

            v.x +=
                v.speed * dt;

            if (
                v.x >
                WORLD.width + 100
            )
                v.x = -100;

        }


        if (
            v.direction ===
            "left"
        ) {

            v.x -=
                v.speed * dt;

            if (
                v.x <
                -100
            )
                v.x =
                    WORLD.width + 100;

        }


        if (
            v.direction ===
            "up"
        ) {

            v.y -=
                v.speed * dt;

            if (
                v.y <
                -100
            )
                v.y =
                    WORLD.height + 100;

        }


        if (
            v.direction ===
            "down"
        ) {

            v.y +=
                v.speed * dt;

            if (
                v.y >
                WORLD.height + 100
            )
                v.y = -100;

        }

    }

}


/* =====================================================
   ANIMALES
===================================================== */

function updateAnimals(dt) {

    for (
        const a of animals
    ) {

        a.x +=
            a.dx * dt;

        a.y +=
            a.dy * dt;


        if (
            Math.random() < .005
        ) {

            a.dx =
                (Math.random()-.5) *
                20;

            a.dy =
                (Math.random()-.5) *
                20;

        }

    }

}


/* =====================================================
   NPC
===================================================== */

function updateNPCs(dt) {

    for (
        const npc of npcs
    ) {

        if (
            npc.routine ===
            "work"
        ) {

            npc.x +=
                Math.sin(
                    gameTime / 90
                ) *
                dt *
                8;

        }


        if (
            npc.routine ===
            "walk"
        ) {

            npc.x +=
                Math.sin(
                    gameTime / 70 +
                    npc.x
                ) *
                dt *
                12;

        }


        if (
            npc.routine ===
            "farm"
        ) {

            npc.y +=
                Math.sin(
                    gameTime / 100
                ) *
                dt *
                8;

        }

    }

}


/* =====================================================
   TIEMPO
===================================================== */

function updateTime(dt) {

    gameTime +=
        dt *
        3;


    if (
        gameTime >=
        1440
    ) {

        gameTime =
            0;

    }


    const hours =
        Math.floor(
            gameTime / 60
        );

    const minutes =
        Math.floor(
            gameTime % 60
        );


    document
        .getElementById(
            "clock"
        )
        .textContent =

        String(hours)
            .padStart(2,"0")

        +

        ":" +

        String(minutes)
            .padStart(2,"0");

}


/* =====================================================
   DÍA / NOCHE
===================================================== */

function nightAlpha() {

    const hour =
        gameTime / 60;


    if (
        hour >= 7 &&
        hour < 18
    ) {

        return 0;

    }


    if (
        hour >= 18 &&
        hour < 21
    ) {

        return (
            hour - 18
        ) / 3 *
        .45;

    }


    if (
        hour >= 21 ||
        hour < 6
    ) {

        return .55;

    }


    return .25;

}


/* =====================================================
   FONDO
===================================================== */

function drawGround() {

    ctx.fillStyle =
        COLORS.ground;

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );


    /* zonas verdes */

    ctx.fillStyle =
        COLORS.grass;


    ctx.fillRect(
        80,
        100,
        700,
        500
    );


    ctx.fillRect(
        3350,
        80,
        750,
        560
    );


    ctx.fillRect(
        80,
        2320,
        850,
        450
    );

}


/* =====================================================
   CALLES
===================================================== */

function drawRoads() {

    for (
        const r of roads
    ) {

        ctx.fillStyle =
            COLORS.road;

        ctx.fillRect(
            r.x,
            r.y,
            r.width,
            r.height
        );


        ctx.strokeStyle =
            COLORS.roadEdge;

        ctx.lineWidth =
            8;

        ctx.strokeRect(
            r.x,
            r.y,
            r.width,
            r.height
        );


        if (
            r.width >
            r.height
        ) {

            ctx.strokeStyle =
                "#b8a26c";

            ctx.lineWidth =
                4;

            ctx.setLineDash(
                [30,30]
            );

            ctx.beginPath();

            ctx.moveTo(
                r.x,
                r.y +
                r.height / 2
            );

            ctx.lineTo(
                r.x +
                r.width,
                r.y +
                r.height / 2
            );

            ctx.stroke();

        }

        else {

            ctx.strokeStyle =
                "#b8a26c";

            ctx.lineWidth =
                4;

            ctx.setLineDash(
                [30,30]
            );

            ctx.beginPath();

            ctx.moveTo(
                r.x +
                r.width / 2,
                r.y
            );

            ctx.lineTo(
                r.x +
                r.width / 2,
                r.y +
                r.height
            );

            ctx.stroke();

        }

        ctx.setLineDash([]);

    }

}


/* =====================================================
   CANALES
===================================================== */

function drawCanals() {

    ctx.fillStyle =
        COLORS.water;


    for (
        const c of canals
    ) {

        ctx.fillRect(
            c.x,
            c.y,
            c.width,
            c.height
        );

    }

}


/* =====================================================
   MONTAÑAS
===================================================== */

function drawMountains() {

    ctx.fillStyle =
        "#8a765d";

    ctx.beginPath();

    ctx.moveTo(
        0,
        350
    );

    ctx.lineTo(
        500,
        100
    );

    ctx.lineTo(
        900,
        340
    );

    ctx.lineTo(
        1400,
        90
    );

    ctx.lineTo(
        1900,
        340
    );

    ctx.lineTo(
        2500,
        80
    );

    ctx.lineTo(
        3100,
        340
    );

    ctx.lineTo(
        3600,
        100
    );

    ctx.lineTo(
        WORLD.width,
        320
    );

    ctx.lineTo(
        WORLD.width,
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
   CHACRAS
===================================================== */

function drawFarms() {

    for (
        const farm of farms
    ) {

        ctx.strokeStyle =
            "#405d37";

        ctx.lineWidth =
            3;


        const rows =
            farm.type ===
            "vineyard"
                ? 14
                : 8;


        for (
            let i=0;
            i<rows;
            i++
        ) {

            const y =
                farm.y +
                35 +
                i * 32;


            ctx.beginPath();

            ctx.moveTo(
                farm.x + 15,
                y
            );

            ctx.lineTo(
                farm.x +
                farm.w -
                15,
                y
            );

            ctx.stroke();


            for (
                let j=0;
                j<20;
                j++
            ) {

                const x =
                    farm.x +
                    25 +
                    j *
                    (
                        farm.w /
                        20
                    );


                ctx.fillStyle =
                    farm.type ===
                    "vineyard"
                        ? "#3e693d"
                        : "#62814a";


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    7,
                    0,
                    Math.PI*2
                );

                ctx.fill();

            }

        }

    }

}


/* =====================================================
   CASAS / EDIFICIOS
===================================================== */

function drawBuildings() {

    for (
        const b of buildings
    ) {

        drawBuilding(
            b
        );

    }

}


function drawBuilding(b) {

    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.2)";

    ctx.fillRect(
        b.x + 12,
        b.y + 14,
        b.w,
        b.h
    );


    /* edificio */

    ctx.fillStyle =
        b.color;

    ctx.fillRect(
        b.x,
        b.y,
        b.w,
        b.h
    );


    /* techo */

    ctx.fillStyle =
        COLORS.roof;

    ctx.beginPath();

    ctx.moveTo(
        b.x - 15,
        b.y
    );

    ctx.lineTo(
        b.x +
        b.w / 2,
        b.y - 55
    );

    ctx.lineTo(
        b.x +
        b.w + 15,
        b.y
    );

    ctx.closePath();

    ctx.fill();


    /* ventanas */

    ctx.fillStyle =
        COLORS.window;


    ctx.fillRect(
        b.x + 30,
        b.y + 35,
        42,
        38
    );


    if (
        b.w > 250
    ) {

        ctx.fillRect(
            b.x +
            b.w -
            72,
            b.y + 35,
            42,
            38
        );

    }


    /* puerta */

    ctx.fillStyle =
        "#51382d";

    ctx.fillRect(
        b.x +
        b.w / 2 -
        20,

        b.y +
        b.h -
        65,

        40,
        65
    );


    /* características */

    if (
        b.type ===
        "bakery"
    ) {

        ctx.fillStyle =
            "#f3d19c";

        ctx.fillRect(
            b.x + 75,
            b.y + 88,
            75,
            30
        );

        ctx.fillStyle =
            "#5c3829";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            "PAN",
            b.x + 95,
            b.y + 109
        );

    }


    if (
        b.type ===
        "radio"
    ) {

        ctx.strokeStyle =
            "#252525";

        ctx.lineWidth =
            5;

        ctx.beginPath();

        ctx.moveTo(
            b.x +
            b.w / 2,
            b.y
        );

        ctx.lineTo(
            b.x +
            b.w / 2,
            b.y - 110
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.arc(
            b.x +
            b.w / 2,
            b.y - 110,
            18,
            0,
            Math.PI*2
        );

        ctx.stroke();

    }


    if (
        b.type ===
        "school"
    ) {

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "18px Arial";

        ctx.fillText(
            "ESCUELA",
            b.x + 100,
            b.y + 115
        );

    }


    if (
        b.type ===
        "municipality"
    ) {

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "15px Arial";

        ctx.fillText(
            "MUNICIPALIDAD",
            b.x + 75,
            b.y + 115
        );

    }


    ctx.fillStyle =
        "#fff";

    ctx.font =
        "14px Arial";

    ctx.fillText(
        b.name,
        b.x,
        b.y +
        b.h +
        24
    );

}


/* =====================================================
   ESTADIO
===================================================== */

function drawStadium() {

    ctx.fillStyle =
        "#817c73";

    ctx.fillRect(
        stadium.x,
        stadium.y,
        stadium.w,
        stadium.h
    );


    /* cancha */

    ctx.fillStyle =
        "#4e874c";

    ctx.fillRect(
        stadium.x + 90,
        stadium.y + 80,
        stadium.w - 180,
        stadium.h - 160
    );


    ctx.strokeStyle =
        "#eeeeee";

    ctx.lineWidth =
        4;

    ctx.strokeRect(
        stadium.x + 90,
        stadium.y + 80,
        stadium.w - 180,
        stadium.h - 160
    );


    /* círculo central */

    ctx.beginPath();

    ctx.arc(
        stadium.x +
        stadium.w/2,

        stadium.y +
        stadium.h/2,

        70,

        0,
        Math.PI*2
    );

    ctx.stroke();


    /* arcos */

    ctx.strokeRect(
        stadium.x + 90,
        stadium.y + 170,
        90,
        180
    );


    ctx.strokeRect(
        stadium.x +
        stadium.w -
        180,

        stadium.y + 170,

        90,
        180
    );


    /* tribunas */

    ctx.fillStyle =
        "#b8b0a6";

    ctx.fillRect(
        stadium.x + 80,
        stadium.y + 15,
        stadium.w - 160,
        40
    );


    ctx.fillStyle =
        "#a44c4c";

    ctx.fillRect(
        stadium.x + 110,
        stadium.y + 20,
        stadium.w - 220,
        12
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "CLUB ATLÉTICO SAN PATRICIO",
        stadium.x + 180,
        stadium.y +
        stadium.h +
        35
    );

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(npc) {

    const bob =
        npc.moving
            ? Math.sin(
                npc.frame
            ) * 2
            : 0;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 18,
        18,
        7,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#292929";

    ctx.lineWidth =
        6;

    ctx.beginPath();

    ctx.moveTo(
        npc.x - 5,
        npc.y + 8
    );

    ctx.lineTo(
        npc.x - 7,
        npc.y + 28
    );

    ctx.moveTo(
        npc.x + 5,
        npc.y + 8
    );

    ctx.lineTo(
        npc.x + 7,
        npc.y + 28
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        npc.shirt;

    ctx.fillRect(
        npc.x - 13,
        npc.y - 10 + bob,
        26,
        25
    );


    /* cabeza */

    ctx.fillStyle =
        COLORS.skin;

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 25 + bob,
        11,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#35271f";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 31 + bob,
        11,
        Math.PI,
        Math.PI*2
    );

    ctx.fill();


    /* nombre */

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "12px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 48
    );

    ctx.textAlign =
        "left";

}


/* =====================================================
   ANIMALES
===================================================== */

function drawAnimals() {

    for (
        const a of animals
    ) {

        if (
            a.type ===
            "dog"
        ) {

            ctx.fillStyle =
                "#704b35";

            ctx.beginPath();

            ctx.ellipse(
                a.x,
                a.y,
                20,
                11,
                0,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.beginPath();

            ctx.arc(
                a.x + 17,
                a.y - 5,
                8,
                0,
                Math.PI*2
            );

            ctx.fill();

        }


        if (
            a.type ===
            "horse"
        ) {

            ctx.fillStyle =
                "#6c4937";

            ctx.fillRect(
                a.x - 25,
                a.y - 15,
                50,
                25
            );

            ctx.beginPath();

            ctx.arc(
                a.x + 27,
                a.y - 15,
                14,
                0,
                Math.PI*2
            );

            ctx.fill();

        }


        if (
            a.type ===
            "cow"
        ) {

            ctx.fillStyle =
                "#f0eee4";

            ctx.fillRect(
                a.x - 24,
                a.y - 12,
                48,
                25
            );

            ctx.fillStyle =
                "#49433d";

            ctx.fillRect(
                a.x - 5,
                a.y - 8,
                12,
                15
            );

        }

    }

}


/* =====================================================
   VEHICULOS
===================================================== */

function drawVehicles() {

    for (
        const v of vehicles
    ) {

        ctx.save();

        ctx.translate(
            v.x,
            v.y
        );


        if (
            v.direction ===
            "up"
        ) {

            ctx.rotate(
                -Math.PI/2
            );

        }

        if (
            v.direction ===
            "left"
        ) {

            ctx.scale(
                -1,
                1
            );

        }


        if (
            v.type ===
            "car"
        ) {

            ctx.fillStyle =
                v.color;

            ctx.fillRect(
                -28,
                -13,
                56,
                26
            );

            ctx.fillStyle =
                "#a9c5cc";

            ctx.fillRect(
                -10,
                -10,
                18,
                20
            );

            ctx.fillRect(
                12,
                -10,
                12,
                20
            );

        }


        if (
            v.type ===
            "tractor"
        ) {

            ctx.fillStyle =
                v.color;

            ctx.fillRect(
                -28,
                -14,
                48,
                28
            );

            ctx.fillStyle =
                "#333";

            ctx.beginPath();

            ctx.arc(
                -20,
                16,
                12,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.beginPath();

            ctx.arc(
                20,
                16,
                8,
                0,
                Math.PI*2
            );

            ctx.fill();

        }


        ctx.restore();

    }

}


/* =====================================================
   OBJETOS HISTÓRICOS
===================================================== */

function drawHistoricalObjects() {

    for (
        const o of historicalObjects
    ) {

        if (
            o.found
        )
            continue;


        ctx.fillStyle =
            "#e8c55e";

        ctx.beginPath();

        ctx.arc(
            o.x,
            o.y,
            12 +
            Math.sin(
                Date.now()/300
            )*3,
            0,
            Math.PI*2
        );

        ctx.fill();


        ctx.fillStyle =
            "#3d301d";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            "?",
            o.x - 4,
            o.y + 5
        );

    }

}


/* =====================================================
   JUGADOR
===================================================== */

function drawPlayer() {

    if (
        insideBuilding
    ) {

        drawInteriorPlayer();

        return;

    }


    const x =
        player.x;

    const y =
        player.y;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.3)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 18,
        20,
        7,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#20262b";

    ctx.lineWidth =
        7;

    ctx.beginPath();

    ctx.moveTo(
        x - 6,
        y + 8
    );

    ctx.lineTo(
        x - 8,
        y + 28
    );

    ctx.moveTo(
        x + 6,
        y + 8
    );

    ctx.lineTo(
        x + 8,
        y + 28
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        COLORS.shirt;

    ctx.fillRect(
        x - 14,
        y - 14,
        28,
        26
    );


    /* cabeza */

    ctx.fillStyle =
        COLORS.skin;

    ctx.beginPath();

    ctx.arc(
        x,
        y - 28,
        12,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#2f241f";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 34,
        12,
        Math.PI,
        Math.PI*2
    );

    ctx.fill();


}


/* =====================================================
   INTERIOR
===================================================== */

function drawInterior() {

    ctx.fillStyle =
        "#b59a76";

    ctx.fillRect(
        0,
        0,
        800,
        600
    );


    ctx.fillStyle =
        "#725944";

    ctx.fillRect(
        0,
        0,
        800,
        60
    );


    ctx.fillStyle =
        "#f0e3c5";

    ctx.fillRect(
        80,
        100,
        640,
        400
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "22px Arial";

    ctx.fillText(
        insideBuilding.name,
        100,
        135
    );


    /* mostrador */

    if (
        insideBuilding.type ===
        "bakery"
    ) {

        ctx.fillStyle =
            "#875438";

        ctx.fillRect(
            120,
            260,
            560,
            90
        );


        ctx.fillStyle =
            "#e0a15d";

        for (
            let i=0;
            i<7;
            i++
        ) {

            ctx.beginPath();

            ctx.arc(
                170+i*75,
                250,
                15,
                0,
                Math.PI*2
            );

            ctx.fill();

        }

    }


    /* radio */

    if (
        insideBuilding.type ===
        "radio"
    ) {

        ctx.fillStyle =
            "#29282c";

        ctx.fillRect(
            130,
            200,
            540,
            210
        );


        ctx.fillStyle =
            "#64a6a2";

        ctx.fillRect(
            180,
            240,
            180,
            80
        );

        ctx.fillRect(
            400,
            240,
            180,
            80
        );

    }


    /* escuela */

    if (
        insideBuilding.type ===
        "school"
    ) {

        ctx.fillStyle =
            "#333";

        ctx.fillRect(
            160,
            180,
            480,
            160
        );


        ctx.fillStyle =
            "#fff";

        ctx.font =
            "24px Arial";

        ctx.fillText(
            "PIZARRÓN",
            300,
            265
        );

    }


    /* casa */

    if (
        insideBuilding.type ===
        "house"
    ) {

        ctx.fillStyle =
            "#8a684d";

        ctx.fillRect(
            130,
            330,
            180,
            40
        );


        ctx.fillStyle =
            "#6d513c";

        ctx.fillRect(
            480,
            200,
            100,
            170
        );

    }

}


/* =====================================================
   JUGADOR INTERIOR
===================================================== */

function drawInteriorPlayer() {

    ctx.fillStyle =
        COLORS.skin;

    ctx.beginPath();

    ctx.arc(
        interiorPlayer.x,
        interiorPlayer.y - 15,
        10,
        0,
        Math.PI*2
    );

    ctx.fill();


    ctx.fillStyle =
        COLORS.shirt;

    ctx.fillRect(
        interiorPlayer.x - 12,
        interiorPlayer.y - 5,
        24,
        25
    );

}


/* =====================================================
   INTERACCIÓN
===================================================== */

function interact() {

    if (
        !gameStarted
    )
        return;


    if (
        insideBuilding
    ) {

        if (
            distance(
                {
                    x:
                        interiorPlayer.x,

                    y:
                        interiorPlayer.y
                },
                {
                    x:
                        400,

                    y:
                        560
                }
            ) < 100
        ) {

            exitBuilding();

            return;

        }


        if (
            insideBuilding.type ===
            "bakery"
        ) {

            buyBread();

            return;

        }


        showDialogue(
            insideBuilding.name,
            "Hay muchas cosas para descubrir acá."
        );

        return;

    }


    /* edificios */

    for (
        const b of buildings
    ) {

        const center = {

            x:
                b.x +
                b.w/2,

            y:
                b.y +
                b.h/2

        };


        if (
            distance(
                player,
                center
            ) < 150
        ) {

            enterBuilding(
                b
            );

            return;

        }

    }


    /* NPC */

    for (
        const npc of npcs
    ) {

        if (
            distance(
                player,
                npc
            ) < 100
        ) {

            talkToNPC(
                npc
            );

            return;

        }

    }


    /* historia */

    for (
        const o of historicalObjects
    ) {

        if (
            !o.found &&
            distance(
                player,
                o
            ) < 100
        ) {

            discoverHistory(
                o
            );

            return;

        }

    }


    notify(
        "No hay nada para interactuar acá."
    );

}


/* =====================================================
   NPC
===================================================== */

function talkToNPC(npc) {

    const index =
        Math.floor(
            Math.random() *
            npc.dialogue.length
        );


    showDialogue(
        npc.name,
        npc.dialogue[index]
    );


    if (
        Math.random() < .35
    ) {

        showDialogueOption(
            npc
        );

    }

}


function showDialogueOption(npc) {

    const options =
        document.getElementById(
            "dialogue-options"
        );


    options.innerHTML =
        "";


    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "Preguntar por la historia del pueblo";


    button.onclick =
        () => {

            showDialogue(
                npc.name,
                npc.history
            );

            reputation +=
                1;

        };


    options.appendChild(
        button
    );

}


/* =====================================================
   HISTORIA
===================================================== */

function discoverHistory(o) {

    o.found =
        true;

    discoveries++;

    historyFound++;

    reputation +=
        5;


    showDialogue(
        o.title,
        o.text
    );


    notify(
        "📜 Nuevo descubrimiento histórico"
    );


    updateMission();

}


/* =====================================================
   PAN
===================================================== */

function buyBread() {

    if (
        money < 20
    ) {

        showDialogue(
            "María",
            "Te falta plata para el pan."
        );

        return;

    }


    money -=
        20;

    inventory.bread++;

    inventory.items.push(
        "Pan casero"
    );


    updateInventory();


    showDialogue(
        "Panadería",
        "Listo. Pan calentito. Son $20."
    );

}


/* =====================================================
   MISIONES
===================================================== */

function updateMission() {

    if (
        mission.stage === 0 &&
        discoveries >= 1
    ) {

        mission.stage =
            1;

        mission.title =
            "Seguí caminando";

        mission.text =
            "Encontraste una parte de la historia. " +
            "Ahora conocé a los vecinos.";

        showMission();

    }


    if (
        mission.stage === 1 &&
        discoveries >= 2
    ) {

        mission.stage =
            2;

        mission.title =
            "El agua y la tierra";

        mission.text =
            "Descubriste que el agua es una pieza " +
            "fundamental de la historia productiva.";

        showMission();

    }


    if (
        mission.stage === 2 &&
        discoveries >= 3
    ) {

        mission.stage =
            3;

        mission.title =
            "El pueblo se transforma";

        mission.text =
            "Ya conocés parte de la historia. " +
            "Todavía quedan secretos.";

        showMission();

    }

}


/* =====================================================
   HUD
===================================================== */

function setMissionHUD() {

    document
        .getElementById(
            "mission-hud"
        )
        .textContent =
        mission.text;

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
        mission.text;


    document
        .getElementById(
            "history-progress"
        )
        .textContent =
        historyFound;


    document
        .getElementById(
            "discovery-progress"
        )
        .textContent =
        discoveries;


    document
        .getElementById(
            "mission-panel"
        )
        .classList
        .remove(
            "hidden"
        );

}


/* =====================================================
   DIALOGO
===================================================== */

function showDialogue(name,text) {

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
            "dialogue-options"
        )
        .innerHTML =
        "";


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
    .onclick =
        () => {

            document
                .getElementById(
                    "dialogue"
                )
                .classList
                .add(
                    "hidden"
                );

        };


/* =====================================================
   INVENTARIO
===================================================== */

function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );


    if (
        inventory.items.length === 0
    ) {

        container.textContent =
            "Todavía no llevás nada.";

    } else {

        container.innerHTML =
            inventory.items
                .map(
                    x =>
                        "• " + x
                )
                .join(
                    "<br>"
                );

    }


    document
        .getElementById(
            "photo-count"
        )
        .textContent =
        inventory.photos;


    document
        .getElementById(
            "document-count"
        )
        .textContent =
        inventory.documents;


    document
        .getElementById(
            "bread-count"
        )
        .textContent =
        inventory.bread;

}


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
    .onclick =
        toggleInventory;


document
    .getElementById(
        "inventory-close"
    )
    .onclick =
        toggleInventory;


document
    .getElementById(
        "mobile-inventory"
    )
    .onclick =
        toggleInventory;


/* =====================================================
   MAPA
===================================================== */

function toggleMap() {

    document
        .getElementById(
            "map-panel"
        )
        .classList
        .toggle(
            "hidden"
        );

}


document
    .getElementById(
        "map-button"
    )
    .onclick =
        toggleMap;


document
    .getElementById(
        "map-close"
    )
    .onclick =
        toggleMap;


document
    .getElementById(
        "mobile-map"
    )
    .onclick =
        toggleMap;


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


    const sx =
        minimap.width /
        WORLD.width;

    const sy =
        minimap.height /
        WORLD.height;


    miniCtx.fillStyle =
        "#c9ad78";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* calles */

    miniCtx.fillStyle =
        "#777";

    for (
        const r of roads
    ) {

        miniCtx.fillRect(
            r.x*sx,
            r.y*sy,
            r.width*sx,
            r.height*sy
        );

    }


    /* chacras */

    miniCtx.fillStyle =
        "#628b50";

    for (
        const f of farms
    ) {

        miniCtx.fillRect(
            f.x*sx,
            f.y*sy,
            f.w*sx,
            f.h*sy
        );

    }


    /* edificios */

    miniCtx.fillStyle =
        "#76584b";

    for (
        const b of buildings
    ) {

        miniCtx.fillRect(
            b.x*sx,
            b.y*sy,
            b.w*sx,
            b.h*sy
        );

    }


    /* estadio */

    miniCtx.fillStyle =
        "#42814b";

    miniCtx.fillRect(
        stadium.x*sx,
        stadium.y*sy,
        stadium.w*sx,
        stadium.h*sy
    );


    /* jugador */

    miniCtx.fillStyle =
        "#ff3333";

    miniCtx.beginPath();

    miniCtx.arc(
        player.x*sx,
        player.y*sy,
        7,
        0,
        Math.PI*2
    );

    miniCtx.fill();

}


/* =====================================================
   NOTIFICACION
===================================================== */

function notify(text) {

    const n =
        document.getElementById(
            "notification"
        );


    n.textContent =
        text;

    n.classList.remove(
        "hidden"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                n.classList.add(
                    "hidden"
                );

            },
            2500
        );

}


/* =====================================================
   ILUMINACION
===================================================== */

function drawLighting() {

    const alpha =
        nightAlpha();


    if (
        alpha <= 0
    )
        return;


    ctx.fillStyle =
        `rgba(15,25,55,${alpha})`;


    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.height
    );


    /* luces */

    if (
        alpha > .2
    ) {

        ctx.fillStyle =
            "rgba(255,220,130,.8)";


        for (
            const b of buildings
        ) {

            ctx.beginPath();

            ctx.arc(
                b.x +
                b.w/2,

                b.y +
                35,

                10,

                0,
                Math.PI*2
            );

            ctx.fill();

        }

    }

}


/* =====================================================
   DIBUJO GENERAL
===================================================== */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (
        insideBuilding
    ) {

        ctx.save();

        ctx.setTransform(
            1,
            0,
            0,
            1,
            0,
            0
        );

        drawInterior();

        drawPlayer();

        ctx.restore();

        return;

    }


    ctx.save();


    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );


    ctx.translate(
        -camera.x,
        -camera.y
    );


    drawGround();

    drawMountains();

    drawFarms();

    drawRoads();

    drawCanals();

    drawStadium();

    drawBuildings();

    drawVehicles();

    drawAnimals();

    drawHistoricalObjects();


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


/* =====================================================
   CAMARA
===================================================== */

function updateCamera(dt) {

    if (
        insideBuilding
    )
        return;


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
        Math.min(
            1,
            dt *
            camera.smooth
        );


    camera.y +=
        (
            targetY -
            camera.y
        ) *
        Math.min(
            1,
            dt *
            camera.smooth
        );


    camera.x =
        Math.max(
            0,
            Math.min(
                WORLD.width -
                canvas.width,

                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD.height -
                canvas.height,

                camera.y
            )
        );

}


/* =====================================================
   BOTONES MOVILES
===================================================== */

function setupMobileControls() {

    const buttons =
        document.querySelectorAll(
            "#joystick button"
        );


    buttons.forEach(
        button => {

            const dir =
                button.dataset.dir;


            const keyMap = {

                up:
                    "arrowup",

                down:
                    "arrowdown",

                left:
                    "arrowleft",

                right:
                    "arrowright"

            };


            const key =
                keyMap[dir];


            button.addEventListener(
                "pointerdown",
                e => {

                    e.preventDefault();

                    keys[key] =
                        true;

                }
            );


            button.addEventListener(
                "pointerup",
                e => {

                    e.preventDefault();

                    keys[key] =
                        false;

                }
            );


            button.addEventListener(
                "pointercancel",
                () => {

                    keys[key] =
                        false;

                }
            );


            button.addEventListener(
                "pointerleave",
                () => {

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
        .onclick =
            interact;

}


setupMobileControls();


/* =====================================================
   INICIO
===================================================== */

document
    .getElementById(
        "start-button"
    )
    .onclick =
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

            notify(
                "Bienvenido a San Patricio del Chañar"
            );

            setMissionHUD();

        };


/* =====================================================
   MISION INICIAL
===================================================== */

document
    .getElementById(
        "mission-close"
    )
    .onclick =
        () => {

            document
                .getElementById(
                    "mission-panel"
                )
                .classList
                .add(
                    "hidden"
                );

        };


/* =====================================================
   MOTOR PRINCIPAL
===================================================== */

function gameLoop(now) {

    const dt =
        Math.min(
            .05,
            (now - lastTime) /
            1000
        );


    lastTime =
        now;


    if (
        gameStarted
    ) {

        updatePlayer(
            dt
        );

        updateVehicles(
            dt
        );

        updateAnimals(
            dt
        );

        updateNPCs(
            dt
        );

        updateTime(
            dt
        );

        updateCamera(
            dt
        );

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   ARRANQUE
===================================================== */

updateInventory();

setMissionHUD();

requestAnimationFrame(
    gameLoop
);
