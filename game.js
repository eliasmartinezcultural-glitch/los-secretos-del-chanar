/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   V19.0
   MOTOR PRINCIPAL

   PC + CELULAR
   MUNDO ABIERTO
   DIA / NOCHE
   CLIMA
   TRAFICO
   NPC
   ANIMALES
   CASAS
   NEGOCIOS
   INTERIORES
   MISIONES
   INVENTARIO
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
   CONFIGURACION
===================================================== */

const WORLD_WIDTH = 5200;
const WORLD_HEIGHT = 3600;

const TILE = 40;

const keys = {};

let gameStarted = false;

let paused = false;


/* =====================================================
   RESIZE
===================================================== */

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


/* =====================================================
   CAMARA
===================================================== */

const camera = {

    x: 0,
    y: 0,

    smooth: .13

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2500,
    y: 1800,

    width: 28,
    height: 34,

    speed: 3.7,

    moving: false,

    direction: "down",

    frame: 0,

    inside: false,

    currentBuilding: null,

    bread: 0,

    mate: 0

};


/* =====================================================
   TIEMPO
===================================================== */

const world = {

    day: 1,

    hour: 8,

    minute: 0,

    timeSpeed: .025,

    weather: "clear",

    weatherTimer: 0,

    rain: false

};


/* =====================================================
   CLIMA
===================================================== */

const weatherTypes = [

    {
        id: "clear",
        name: "Despejado",
        icon: "☀",
        darkness: 0
    },

    {
        id: "cloudy",
        name: "Nublado",
        icon: "☁",
        darkness: .08
    },

    {
        id: "rain",
        name: "Lluvia",
        icon: "🌧",
        darkness: .20
    }

];


/* =====================================================
   CARRETERAS
===================================================== */

const roads = [

    {
        x: 0,
        y: 1670,
        width: WORLD_WIDTH,
        height: 150,
        type: "avenue"
    },

    {
        x: 2420,
        y: 0,
        width: 160,
        height: WORLD_HEIGHT,
        type: "street"
    },

    {
        x: 500,
        y: 2450,
        width: 4200,
        height: 120,
        type: "route"
    },

    {
        x: 4000,
        y: 700,
        width: 130,
        height: 1850,
        type: "route"
    }

];


/* =====================================================
   ZONAS
===================================================== */

const zones = [

    {
        name: "CENTRO DEL CHAÑAR",
        x: 1450,
        y: 1000,
        width: 1800,
        height: 1250
    },

    {
        name: "CHACRAS",
        x: 100,
        y: 400,
        width: 1250,
        height: 1900
    },

    {
        name: "SECTOR RURAL",
        x: 200,
        y: 2550,
        width: 3700,
        height: 850
    },

    {
        name: "RIBERA",
        x: 4200,
        y: 2550,
        width: 1000,
        height: 1050
    }

];


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        id: "bakery",
        x: 1650,
        y: 1320,
        width: 260,
        height: 180,
        type: "business",
        name: "PANADERÍA EL CHAÑAR",
        color: "#c9895f",
        roof: "#704634",
        interior: true
    },

    {
        id: "radio",
        x: 2870,
        y: 1190,
        width: 340,
        height: 210,
        type: "radio",
        name: "RADIO OCARINA",
        color: "#6f665b",
        roof: "#423c37",
        interior: true
    },

    {
        id: "school",
        x: 1660,
        y: 1950,
        width: 400,
        height: 230,
        type: "school",
        name: "ESCUELA",
        color: "#b87355",
        roof: "#583b31",
        interior: true
    },

    {
        id: "stadium",
        x: 3250,
        y: 1750,
        width: 700,
        height: 450,
        type: "stadium",
        name: "ESTADIO",
        color: "#8a806b",
        roof: "#635c50",
        interior: true
    },

    {
        id: "museum",
        x: 2220,
        y: 1050,
        width: 300,
        height: 200,
        type: "museum",
        name: "MUSEO LOCAL",
        color: "#927a62",
        roof: "#4d4035",
        interior: true
    },

    {
        id: "market",
        x: 1970,
        y: 1350,
        width: 260,
        height: 180,
        type: "business",
        name: "ALMACÉN DEL BARRIO",
        color: "#a98b65",
        roof: "#5b4636",
        interior: true
    },

    {
        id: "house1",
        x: 1480,
        y: 1480,
        width: 250,
        height: 160,
        type: "house",
        name: "CASA DE ROSA",
        color: "#d19a70",
        roof: "#774a39",
        interior: true
    },

    {
        id: "house2",
        x: 2300,
        y: 1500,
        width: 260,
        height: 170,
        type: "house",
        name: "CASA DE DON PEDRO",
        color: "#c7a174",
        roof: "#594437",
        interior: true
    },

    {
        id: "house3",
        x: 2700,
        y: 1740,
        width: 270,
        height: 170,
        type: "house",
        name: "CASA DE MARÍA",
        color: "#d4a879",
        roof: "#624639",
        interior: true
    },

    {
        id: "farmhouse",
        x: 650,
        y: 850,
        width: 330,
        height: 200,
        type: "farm",
        name: "CHACRA",
        color: "#b78860",
        roof: "#594336",
        interior: true
    }

];


/* =====================================================
   ARBOLES
===================================================== */

const trees = [];

function generateTrees() {

    const positions = [

        [300,300],
        [600,250],
        [1000,330],
        [1250,650],

        [400,1300],
        [800,1450],
        [1100,1650],

        [350,2100],
        [850,2200],

        [1450,700],
        [3200,800],
        [3500,950],

        [4300,700],
        [4800,900],

        [500,2900],
        [1200,3000],
        [1900,2850],
        [2700,3100],
        [3400,2900],

        [4500,2900],
        [4900,3200]
    ];

    positions.forEach(
        p => {

            trees.push({
                x: p[0],
                y: p[1],
                size:
                    26 +
                    Math.random() * 14
            });

        }
    );

}

generateTrees();


/* =====================================================
   FLORES
===================================================== */

const flowers = [];

function generateFlowers() {

    for (
        let i = 0;
        i < 180;
        i++
    ) {

        flowers.push({

            x:
                100 +
                Math.random() *
                (WORLD_WIDTH - 200),

            y:
                200 +
                Math.random() *
                (WORLD_HEIGHT - 400),

            type:
                Math.floor(
                    Math.random() * 3
                )

        });

    }

}

generateFlowers();


/* =====================================================
   VIÑEDOS
===================================================== */

const vineyards = [

    {
        x: 180,
        y: 650,
        rows: 13,
        cols: 20
    },

    {
        x: 150,
        y: 1750,
        rows: 9,
        cols: 22
    },

    {
        x: 650,
        y: 2600,
        rows: 9,
        cols: 25
    }

];


/* =====================================================
   RIO
   IMPORTANTE:
   SECTOR ALEJADO DEL CENTRO URBANO
===================================================== */

const river = {

    x: 4250,

    y: 2550,

    width: 950,

    height: 1050

};


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        id: "pedro",

        x: 2260,
        y: 1680,

        name: "Don Pedro",

        role: "Vecino histórico",

        personality: "mayor",

        speed: 1,

        destination: null,

        text: [

            "Buen día, chango. ¿Cómo andás?",

            "Este pueblo parece tranquilo, pero tiene muchísima historia.",

            "Si querés conocer Chañar, caminá. Mirá las calles, hablá con la gente.",

            "Las historias más interesantes muchas veces aparecen en una charla cualquiera."

        ],

        mission: true
    },

    {
        id: "maria",

        x: 2810,
        y: 1580,

        name: "María",

        role: "Vecina",

        personality: "woman",

        speed: 1.2,

        destination: "bakery",

        text: [

            "Hola, ¿vas para el centro?",

            "Yo tengo que pasar por la panadería.",

            "Acá uno siempre termina conociendo a alguien en la calle.",

            "Después de comprar el pan me voy para casa."
        ]
    },

    {
        id: "juan",

        x: 1900,
        y: 1700,

        name: "Juan",

        role: "Trabajador rural",

        personality: "worker",

        speed: 1.4,

        destination: "farm",

        text: [

            "Buen día.",

            "Hoy toca trabajar en la chacra.",

            "Cuando llega la temporada, acá hay movimiento por todos lados.",

            "El campo y el pueblo están mucho más conectados de lo que parece."
        ]
    },

    {
        id: "ana",

        x: 3060,
        y: 1510,

        name: "Ana",

        role: "Comunicadora",

        personality: "woman",

        speed: 1,

        destination: "radio",

        text: [

            "¿Escuchaste la radio hoy?",

            "La radio sirve para enterarse de todo lo que pasa.",

            "En un pueblo, la comunicación tiene otra dimensión.",

            "Siempre aparece alguna historia para contar."
        ]
    },

    {
        id: "luis",

        x: 1780,
        y: 1840,

        name: "Luis",

        role: "Vecino",

        personality: "man",

        speed: .8,

        destination: "market",

        text: [

            "Hola.",

            "¿Todo tranquilo?",

            "Yo voy al almacén y vuelvo.",

            "Nos vemos después."
        ]
    }

];


/* =====================================================
   ANIMALES
===================================================== */

const animals = [

    {
        x: 800,
        y: 1150,
        type: "horse",
        dx: .2,
        dy: 0
    },

    {
        x: 1000,
        y: 1200,
        type: "cow",
        dx: -.1,
        dy: 0
    },

    {
        x: 1250,
        y: 2800,
        type: "horse",
        dx: .15,
        dy: .1
    },

    {
        x: 4550,
        y: 3000,
        type: "dog",
        dx: .3,
        dy: .1
    },

    {
        x: 2900,
        y: 2300,
        type: "dog",
        dx: -.2,
        dy: .15
    }

];


/* =====================================================
   VEHICULOS
===================================================== */

const vehicles = [

    {
        x: 100,
        y: 1730,
        width: 70,
        height: 35,
        speed: 2.2,
        direction: 1,
        type: "car",
        color: "#b74d3d"
    },

    {
        x: 1100,
        y: 1780,
        width: 70,
        height: 35,
        speed: 1.7,
        direction: -1,
        type: "car",
        color: "#4b6879"
    },

    {
        x: 600,
        y: 2510,
        width: 80,
        height: 38,
        speed: 1.5,
        direction: 1,
        type: "tractor",
        color: "#c69a2c"
    },

    {
        x: 2700,
        y: 2510,
        width: 75,
        height: 38,
        speed: 1.9,
        direction: -1,
        type: "truck",
        color: "#64725c"
    },

    {
        x: 4200,
        y: 1200,
        width: 75,
        height: 36,
        speed: 1.8,
        direction: 1,
        type: "car",
        color: "#80515a"
    }

];


/* =====================================================
   SEMAFOROS
===================================================== */

const trafficLights = [

    {
        x: 2400,
        y: 1600,
        state: 0,
        timer: 0
    },

    {
        x: 2550,
        y: 1670,
        state: 2,
        timer: 0
    }

];


/* =====================================================
   OBJETOS HISTORICOS
===================================================== */

const objects = [

    {
        x: 2130,
        y: 1080,
        type: "photo",
        name: "Fotografía antigua del Chañar",
        collected: false
    },

    {
        x: 2320,
        y: 1130,
        type: "document",
        name: "Documento histórico",
        collected: false
    },

    {
        x: 1250,
        y: 900,
        type: "photo",
        name: "Fotografía de las chacras",
        collected: false
    },

    {
        x: 4460,
        y: 2880,
        type: "document",
        name: "Documento encontrado junto al río",
        collected: false
    }

];


/* =====================================================
   INVENTARIO
===================================================== */

const inventory = [];


/* =====================================================
   MISION
===================================================== */

const mission = {

    active: false,

    completed: false,

    title:
        "La memoria del pueblo",

    description:
        "Don Pedro quiere recuperar " +
        "una fotografía antigua. " +
        "Recorré el pueblo y encontrala."

};


/* =====================================================
   DISTANCIA
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


/* =====================================================
   COLISION
===================================================== */

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
   EDIFICIOS SOLIDOS
===================================================== */

function buildingCollision(x, y) {

    if (player.inside) {
        return false;
    }

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

            return true;

        }

    }

    return false;

}


/* =====================================================
   RIO
===================================================== */

function riverCollision(x, y) {

    if (player.inside) {
        return false;
    }

    const riverRect = {

        x: river.x,
        y: river.y,

        width:
            river.width,

        height:
            river.height

    };

    return collision(
        {
            x,
            y,
            width: player.width,
            height: player.height
        },
        riverRect
    );

}


/* =====================================================
   MOVIMIENTO
===================================================== */

function updatePlayer() {

    if (
        !gameStarted ||
        paused ||
        player.inside
    ) {
        return;
    }

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

    if (
        dx !== 0 &&
        dy !== 0
    ) {

        dx *= .707;
        dy *= .707;

    }

    player.moving =
        dx !== 0 ||
        dy !== 0;

    if (player.moving) {

        player.frame += .15;

    }

    const newX =
        player.x + dx;

    const newY =
        player.y + dy;

    if (
        newX >= 0 &&
        newX <
        WORLD_WIDTH -
        player.width &&
        !buildingCollision(
            newX,
            player.y
        ) &&
        !riverCollision(
            newX,
            player.y
        )
    ) {

        player.x = newX;

    }

    if (
        newY >= 0 &&
        newY <
        WORLD_HEIGHT -
        player.height &&
        !buildingCollision(
            player.x,
            newY
        ) &&
        !riverCollision(
            player.x,
            newY
        )
    ) {

        player.y = newY;

    }

}


/* =====================================================
   CAMARA
===================================================== */

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


/* =====================================================
   RELOJ
===================================================== */

function updateTime() {

    if (!gameStarted) {
        return;
    }

    world.minute +=
        world.timeSpeed;

    if (
        world.minute >= 60
    ) {

        world.minute = 0;

        world.hour++;

    }

    if (
        world.hour >= 24
    ) {

        world.hour = 0;

        world.day++;

        chooseWeather();

        notify(
            "Comenzó un nuevo día."
        );

    }

    updateClockHUD();

}


/* =====================================================
   CLIMA
===================================================== */

function chooseWeather() {

    const r =
        Math.random();

    if (r < .62) {

        world.weather =
            "clear";

    } else if (r < .84) {

        world.weather =
            "cloudy";

    } else {

        world.weather =
            "rain";

    }

    world.weatherTimer =
        1000 +
        Math.random() * 2000;

}


/* =====================================================
   HUD RELOJ
===================================================== */

function updateClockHUD() {

    const h =
        String(
            Math.floor(
                world.hour
            )
        ).padStart(
            2,
            "0"
        );

    const m =
        String(
            Math.floor(
                world.minute
            )
        ).padStart(
            2,
            "0"
        );

    document
        .getElementById(
            "clock"
        )
        .textContent =
        `${h}:${m}`;

    document
        .getElementById(
            "day-label"
        )
        .textContent =
        `Día ${world.day}`;

    const weather =
        weatherTypes.find(
            w =>
                w.id ===
                world.weather
        );

    document
        .getElementById(
            "weather-label"
        )
        .textContent =
        `${weather.icon} ${weather.name}`;

}


/* =====================================================
   FONDO
===================================================== */

function drawGround() {

    ctx.fillStyle =
        "#b9a06f";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    drawZones();

    drawRoads();

    drawRiver();

    drawFields();

    drawFlowers();

    drawTrees();

    drawVineyards();

}


/* =====================================================
   ZONAS
===================================================== */

function drawZones() {

    ctx.fillStyle =
        "#aeb276";

    ctx.fillRect(
        1450,
        1000,
        1800,
        1250
    );

    ctx.fillStyle =
        "#9ba86b";

    ctx.fillRect(
        100,
        400,
        1250,
        1900
    );

    ctx.fillStyle =
        "#b09a68";

    ctx.fillRect(
        200,
        2550,
        3700,
        850
    );

}


/* =====================================================
   CAMINOS
===================================================== */

function drawRoads() {

    for (
        const road
        of roads
    ) {

        ctx.fillStyle =
            road.type === "route"
                ? "#575753"
                : "#8a7860";

        ctx.fillRect(
            road.x,
            road.y,
            road.width,
            road.height
        );

        if (
            road.type ===
            "route"
        ) {

            ctx.strokeStyle =
                "#d7c98c";

            ctx.lineWidth = 5;

            ctx.setLineDash(
                [35, 25]
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


/* =====================================================
   CAMPOS
===================================================== */

function drawFields() {

    const fields = [

        [80,420,450,500],
        [600,400,650,350],
        [100,1450,500,300],
        [650,1250,600,500],
        [200,2700,600,500],
        [1100,2700,700,450],
        [2000,2750,600,400]
    ];

    for (
        const f
        of fields
    ) {

        ctx.fillStyle =
            "#9aa15e";

        ctx.fillRect(
            f[0],
            f[1],
            f[2],
            f[3]
        );

        ctx.strokeStyle =
            "rgba(80,80,40,.3)";

        ctx.lineWidth = 2;

        for (
            let x =
                f[0] + 20;
            x <
                f[0] + f[2];
            x += 25
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                f[1]
            );

            ctx.lineTo(
                x,
                f[1] + f[3]
            );

            ctx.stroke();

        }

    }

}


/* =====================================================
   RIO
===================================================== */

function drawRiver() {

    ctx.fillStyle =
        "#4f8193";

    ctx.fillRect(
        river.x,
        river.y,
        river.width,
        river.height
    );

    ctx.fillStyle =
        "rgba(255,255,255,.15)";

    for (
        let y =
            river.y + 40;
        y <
            river.y +
            river.height;
        y += 70
    ) {

        ctx.fillRect(
            river.x + 20,
            y,
            river.width - 40,
            3
        );

    }

    ctx.fillStyle =
        "#6e8450";

    ctx.fillRect(
        river.x - 35,
        river.y,
        35,
        river.height
    );

}


/* =====================================================
   FLORES
===================================================== */

function drawFlowers() {

    for (
        const flower
        of flowers
    ) {

        ctx.fillStyle =
            flower.type === 0
                ? "#d7c46d"
                : flower.type === 1
                    ? "#b98aa1"
                    : "#e2d6a4";

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


/* =====================================================
   ARBOLES
===================================================== */

function drawTrees() {

    for (
        const tree
        of trees
    ) {

        ctx.fillStyle =
            "#664733";

        ctx.fillRect(
            tree.x - 6,
            tree.y,
            12,
            34
        );

        ctx.fillStyle =
            "#496d3e";

        ctx.beginPath();

        ctx.arc(
            tree.x,
            tree.y - 8,
            tree.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#5b7c46";

        ctx.beginPath();

        ctx.arc(
            tree.x - 15,
            tree.y - 15,
            tree.size * .65,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =====================================================
   VIÑEDOS
===================================================== */

function drawVineyards() {

    for (
        const v
        of vineyards
    ) {

        for (
            let r = 0;
            r < v.rows;
            r++
        ) {

            for (
                let c = 0;
                c < v.cols;
                c++
            ) {

                const x =
                    v.x +
                    c * 30;

                const y =
                    v.y +
                    r * 42;

                ctx.strokeStyle =
                    "#526b3e";

                ctx.lineWidth = 2;

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
                    "#527844";

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


/* =====================================================
   EDIFICIOS
===================================================== */

function drawBuildings() {

    for (
        const b
        of buildings
    ) {

        drawBuilding(
            b
        );

    }

}


/* =====================================================
   EDIFICIO INDIVIDUAL
===================================================== */

function drawBuilding(b) {

    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.22)";

    ctx.fillRect(
        b.x + 10,
        b.y + 12,
        b.width,
        b.height
    );


    /* cuerpo */

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
        b.roof;

    ctx.beginPath();

    ctx.moveTo(
        b.x - 20,
        b.y
    );

    ctx.lineTo(
        b.x +
        b.width / 2,
        b.y - 65
    );

    ctx.lineTo(
        b.x +
        b.width +
        20,
        b.y
    );

    ctx.closePath();

    ctx.fill();


    /* ventanas */

    drawWindows(
        b
    );


    /* puerta */

    ctx.fillStyle =
        "#49362d";

    ctx.fillRect(
        b.x +
        b.width / 2 -
        18,

        b.y +
        b.height -
        65,

        36,
        65
    );


    /* manija */

    ctx.fillStyle =
        "#d3b766";

    ctx.beginPath();

    ctx.arc(
        b.x +
        b.width / 2 +
        8,

        b.y +
        b.height -
        32,

        3,

        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cartel */

    ctx.fillStyle =
        "rgba(30,25,20,.82)";

    ctx.fillRect(
        b.x +
        15,

        b.y +
        12,

        Math.min(
            b.width - 30,
            190
        ),

        28
    );

    ctx.fillStyle =
        "#f2dfb2";

    ctx.font =
        "bold 12px Arial";

    ctx.fillText(
        b.name,
        b.x + 22,
        b.y + 31
    );


    /* detalles especiales */

    if (
        b.type ===
        "bakery"
    ) {

        drawBakeryDetails(
            b
        );

    }

    if (
        b.type ===
        "radio"
    ) {

        drawRadioDetails(
            b
        );

    }

    if (
        b.type ===
        "stadium"
    ) {

        drawStadium(
            b
        );

    }

}


/* =====================================================
   VENTANAS
===================================================== */

function drawWindows(b) {

    const positions = [

        [30,45],
        [b.width - 75,45]
    ];

    for (
        const p
        of positions
    ) {

        ctx.fillStyle =
            "#8fb0ae";

        ctx.fillRect(
            b.x + p[0],
            b.y + p[1],
            45,
            42
        );

        ctx.strokeStyle =
            "#493b34";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            b.x + p[0],
            b.y + p[1],
            45,
            42
        );

        ctx.beginPath();

        ctx.moveTo(
            b.x + p[0] + 22,
            b.y + p[1]
        );

        ctx.lineTo(
            b.x + p[0] + 22,
            b.y + p[1] + 42
        );

        ctx.stroke();

    }

}


/* =====================================================
   PANADERIA
===================================================== */

function drawBakeryDetails(b) {

    ctx.fillStyle =
        "#e9d7b0";

    ctx.beginPath();

    ctx.arc(
        b.x + b.width - 35,
        b.y + 105,
        23,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "#9b5d38";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "PAN",
        b.x + b.width - 53,
        b.y + 112
    );

}


/* =====================================================
   RADIO
===================================================== */

function drawRadioDetails(b) {

    ctx.fillStyle =
        "#332d2a";

    ctx.fillRect(
        b.x + 130,
        b.y + 85,
        80,
        70
    );

    ctx.strokeStyle =
        "#c2a764";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        b.x + 170,
        b.y + 85
    );

    ctx.lineTo(
        b.x + 170,
        b.y + 35
    );

    ctx.stroke();

}


/* =====================================================
   ESTADIO
===================================================== */

function drawStadium(b) {

    ctx.fillStyle =
        "#628153";

    ctx.fillRect(
        b.x + 70,
        b.y + 95,
        b.width - 140,
        b.height - 150
    );

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        b.x + 100,
        b.y + 120,
        b.width - 200,
        b.height - 200
    );

    ctx.beginPath();

    ctx.arc(
        b.x +
        b.width / 2,

        b.y +
        b.height / 2,

        40,

        0,
        Math.PI * 2
    );

    ctx.stroke();

}


/* =====================================================
   VEHICULOS
===================================================== */

function updateVehicles() {

    for (
        const v
        of vehicles
    ) {

        if (
            v.type ===
            "car" ||
            v.type ===
            "truck" ||
            v.type ===
            "tractor"
        ) {

            if (
                v.y >
                1600 &&
                v.y <
                1850
            ) {

                v.x +=
                    v.speed *
                    v.direction;

            }

            if (
                v.y >
                2450 &&
                v.y <
                2600
            ) {

                v.x +=
                    v.speed *
                    v.direction;

            }

            if (
                v.x >
                3900 &&
                v.y >
                600
            ) {

                v.y +=
                    v.speed;

            }

        }

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
            v.y >
            WORLD_HEIGHT + 100
        ) {

            v.y = -100;

        }

    }

}


/* =====================================================
   DIBUJAR VEHICULOS
===================================================== */

function drawVehicles() {

    for (
        const v
        of vehicles
    ) {

        if (
            v.type ===
            "tractor"
        ) {

            drawTractor(v);

        } else {

            drawCar(v);

        }

    }

}


/* =====================================================
   AUTO
===================================================== */

function drawCar(v) {

    ctx.fillStyle =
        "rgba(0,0,0,.2)";

    ctx.fillRect(
        v.x + 4,
        v.y + 7,
        v.width,
        v.height
    );

    ctx.fillStyle =
        v.color;

    ctx.fillRect(
        v.x,
        v.y,
        v.width,
        v.height
    );

    ctx.fillStyle =
        "#6f9094";

    ctx.fillRect(
        v.x + 15,
        v.y + 5,
        30,
        14
    );

    ctx.fillStyle =
        "#202020";

    ctx.beginPath();

    ctx.arc(
        v.x + 16,
        v.y + v.height,
        7,
        0,
        Math.PI * 2
    );

    ctx.arc(
        v.x + v.width - 16,
        v.y + v.height,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   TRACTOR
===================================================== */

function drawTractor(v) {

    /* ruedas grandes */

    ctx.fillStyle =
        "#252525";

    ctx.beginPath();

    ctx.arc(
        v.x + 18,
        v.y + 30,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        v.x + 65,
        v.y + 30,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        v.color;

    ctx.fillRect(
        v.x + 10,
        v.y + 8,
        55,
        22
    );


    /* cabina */

    ctx.fillStyle =
        "#334943";

    ctx.fillRect(
        v.x + 28,
        v.y - 10,
        28,
        25
    );


    /* vidrio */

    ctx.fillStyle =
        "#9eb5ae";

    ctx.fillRect(
        v.x + 32,
        v.y - 6,
        20,
        13
    );


    /* escape */

    ctx.fillStyle =
        "#333";

    ctx.fillRect(
        v.x + 56,
        v.y - 20,
        5,
        25
    );

}


/* =====================================================
   NPC
===================================================== */

function updateNPCs() {

    for (
        const npc
        of npcs
    ) {

        if (
            !npc.destination
        ) {

            continue;

        }

        const destination =
            buildings.find(
                b =>
                    b.id ===
                    npc.destination
            );

        if (!destination) {
            continue;
        }

        const target = {

            x:
                destination.x +
                destination.width / 2,

            y:
                destination.y +
                destination.height / 2
        };

        const dx =
            target.x -
            npc.x;

        const dy =
            target.y -
            npc.y;

        const d =
            Math.hypot(
                dx,
                dy
            );

        if (
            d > 50
        ) {

            npc.x +=
                dx / d *
                npc.speed;

            npc.y +=
                dy / d *
                npc.speed;

        }

    }

}


/* =====================================================
   NPC HUMANOIDE
===================================================== */

function drawNPC(npc) {

    const bob =
        Math.sin(
            performance.now() / 180 +
            npc.x
        ) *
        (
            npc.speed > 1
                ? 2
                : .5
        );


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.22)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 25,
        17,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#29333a";

    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(
        npc.x - 5,
        npc.y + 12
    );

    ctx.lineTo(
        npc.x - 7 +
        bob,
        npc.y + 27
    );

    ctx.moveTo(
        npc.x + 5,
        npc.y + 12
    );

    ctx.lineTo(
        npc.x + 7 -
        bob,
        npc.y + 27
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        npc.personality ===
        "worker"
            ? "#6b7654"
            : npc.personality ===
              "woman"
                ? "#80576b"
                : "#536b76";

    ctx.fillRect(
        npc.x - 11,
        npc.y - 2,
        22,
        20
    );


    /* brazos */

    ctx.strokeStyle =
        "#c58e70";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        npc.x - 10,
        npc.y + 2
    );

    ctx.lineTo(
        npc.x - 17,
        npc.y + 15
    );

    ctx.moveTo(
        npc.x + 10,
        npc.y + 2
    );

    ctx.lineTo(
        npc.x + 17,
        npc.y + 15
    );

    ctx.stroke();


    /* cabeza */

    ctx.fillStyle =
        "#c58e70";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 14,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        npc.personality ===
        "mayor"
            ? "#aaa39a"
            : "#3b2923";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 20,
        10,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* ojos */

    ctx.fillStyle =
        "#211b18";

    ctx.beginPath();

    ctx.arc(
        npc.x - 4,
        npc.y - 15,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.arc(
        npc.x + 4,
        npc.y - 15,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* nombre */

    ctx.font =
        "11px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "rgba(255,255,255,.9)";

    ctx.fillText(
        npc.name,
        npc.x,
        npc.y + 47
    );

    ctx.textAlign =
        "left";


    /* globo */

    if (
        distance(
            player,
            npc
        ) < 95
    ) {

        drawSpeechBubble(
            npc.x,
            npc.y - 65,
            "Hola"
        );

    }

}


/* =====================================================
   GLOBO DE DIALOGO
===================================================== */

function drawSpeechBubble(
    x,
    y,
    text
) {

    ctx.font =
        "bold 11px Arial";

    const width =
        ctx.measureText(
            text
        ).width +
        20;

    ctx.fillStyle =
        "rgba(255,255,255,.94)";

    ctx.beginPath();

    ctx.roundRect(
        x - width / 2,
        y - 17,
        width,
        25,
        8
    );

    ctx.fill();

    ctx.fillStyle =
        "#2b302c";

    ctx.textAlign =
        "center";

    ctx.fillText(
        text,
        x,
        y
    );

    ctx.textAlign =
        "left";

}


/* =====================================================
   ANIMALES
===================================================== */

function updateAnimals() {

    for (
        const animal
        of animals
    ) {

        animal.x +=
            animal.dx;

        animal.y +=
            animal.dy;

        if (
            Math.random() <
            .005
        ) {

            animal.dx =
                (
                    Math.random() -
                    .5
                ) * .5;

            animal.dy =
                (
                    Math.random() -
                    .5
                ) * .5;

        }

    }

}


/* =====================================================
   DIBUJAR ANIMALES
===================================================== */

function drawAnimals() {

    for (
        const a
        of animals
    ) {

        if (
            a.type ===
            "horse"
        ) {

            drawHorse(a);

        }

        if (
            a.type ===
            "cow"
        ) {

            drawCow(a);

        }

        if (
            a.type ===
            "dog"
        ) {

            drawDog(a);

        }

    }

}


/* =====================================================
   CABALLO
===================================================== */

function drawHorse(a) {

    ctx.fillStyle =
        "#654534";

    ctx.fillRect(
        a.x - 25,
        a.y - 13,
        48,
        25
    );

    ctx.beginPath();

    ctx.arc(
        a.x + 28,
        a.y - 18,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
        "#463328";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        a.x - 15,
        a.y + 10
    );

    ctx.lineTo(
        a.x - 15,
        a.y + 30
    );

    ctx.moveTo(
        a.x + 10,
        a.y + 10
    );

    ctx.lineTo(
        a.x + 10,
        a.y + 30
    );

    ctx.stroke();

}


/* =====================================================
   VACA
===================================================== */

function drawCow(a) {

    ctx.fillStyle =
        "#eee7d9";

    ctx.fillRect(
        a.x - 25,
        a.y - 14,
        50,
        28
    );

    ctx.fillStyle =
        "#50473e";

    ctx.fillRect(
        a.x - 10,
        a.y - 10,
        13,
        12
    );

    ctx.beginPath();

    ctx.arc(
        a.x + 29,
        a.y - 10,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   PERRO
===================================================== */

function drawDog(a) {

    ctx.fillStyle =
        "#8c684c";

    ctx.fillRect(
        a.x - 18,
        a.y - 10,
        35,
        18
    );

    ctx.beginPath();

    ctx.arc(
        a.x + 20,
        a.y - 8,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   OBJETOS
===================================================== */

function drawObjects() {

    for (
        const o
        of objects
    ) {

        if (
            o.collected
        ) {

            continue;

        }

        const pulse =
            Math.sin(
                performance.now() / 250
            ) * 3;

        ctx.fillStyle =
            "#e6c36e";

        ctx.beginPath();

        ctx.arc(
            o.x,
            o.y - 10,
            13 + pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#40382d";

        ctx.font =
            "18px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            o.type === "photo"
                ? "F"
                : "D",
            o.x,
            o.y - 4
        );

        ctx.textAlign =
            "left";

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
            ) * 2
            : 0;

    const x =
        player.x +
        player.width / 2;

    const y =
        player.y +
        player.height / 2 +
        bob;


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 18,
        18,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* piernas */

    ctx.strokeStyle =
        "#29343c";

    ctx.lineWidth = 6;

    const step =
        player.moving
            ? Math.sin(
                player.frame * 8
            ) * 5
            : 0;

    ctx.beginPath();

    ctx.moveTo(
        x - 5,
        y + 10
    );

    ctx.lineTo(
        x - 6 + step,
        y + 28
    );

    ctx.moveTo(
        x + 5,
        y + 10
    );

    ctx.lineTo(
        x + 6 - step,
        y + 28
    );

    ctx.stroke();


    /* cuerpo */

    ctx.fillStyle =
        "#31516a";

    ctx.fillRect(
        x - 12,
        y - 8,
        24,
        24
    );


    /* brazos */

    ctx.strokeStyle =
        "#c58f72";

    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(
        x - 10,
        y - 3
    );

    ctx.lineTo(
        x - 18,
        y + 10
    );

    ctx.moveTo(
        x + 10,
        y - 3
    );

    ctx.lineTo(
        x + 18,
        y + 10
    );

    ctx.stroke();


    /* cuello */

    ctx.fillStyle =
        "#c58f72";

    ctx.fillRect(
        x - 5,
        y - 16,
        10,
        8
    );


    /* cabeza */

    ctx.beginPath();

    ctx.arc(
        x,
        y - 25,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pelo */

    ctx.fillStyle =
        "#30231e";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 32,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* ojos */

    ctx.fillStyle =
        "#1b1714";

    ctx.beginPath();

    ctx.arc(
        x - 4,
        y - 26,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 4,
        y - 26,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   SEMAFOROS
===================================================== */

function updateTrafficLights() {

    for (
        const light
        of trafficLights
    ) {

        light.timer++;

        if (
            light.timer >
            180
        ) {

            light.timer = 0;

            light.state =
                (
                    light.state + 1
                ) % 3;

        }

    }

}


function drawTrafficLights() {

    for (
        const light
        of trafficLights
    ) {

        ctx.fillStyle =
            "#292929";

        ctx.fillRect(
            light.x,
            light.y,
            12,
            55
        );

        const colors = [
            "#d84b42",
            "#e0bd52",
            "#55a65b"
        ];

        ctx.fillStyle =
            colors[
                light.state
            ];

        ctx.beginPath();

        ctx.arc(
            light.x + 6,
            light.y + 10 +
            light.state * 16,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =====================================================
   DIA / NOCHE
===================================================== */

function drawLighting() {

    let alpha = 0;

    const hour =
        world.hour +
        world.minute / 60;

    if (
        hour < 6
    ) {

        alpha = .43;

    } else if (
        hour < 8
    ) {

        alpha =
            .43 -
            (
                hour - 6
            ) *
            .215;

    } else if (
        hour < 18
    ) {

        alpha = 0;

    } else if (
        hour < 21
    ) {

        alpha =
            (
                hour - 18
            ) *
            .13;

    } else {

        alpha = .39;

    }

    const weather =
        weatherTypes.find(
            w =>
                w.id ===
                world.weather
        );

    alpha +=
        weather.darkness;

    if (
        alpha > 0
    ) {

        ctx.fillStyle =
            `rgba(20,30,60,${alpha})`;

        ctx.fillRect(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT
        );

    }

}


/* =====================================================
   LLUVIA
===================================================== */

function drawRain() {

    if (
        world.weather !==
        "rain"
    ) {

        return;

    }

    ctx.strokeStyle =
        "rgba(210,230,240,.42)";

    ctx.lineWidth = 1;

    for (
        let i = 0;
        i < 150;
        i++
    ) {

        const x =
            camera.x +
            Math.random() *
            window.innerWidth;

        const y =
            camera.y +
            Math.random() *
            window.innerHeight;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x - 4,
            y + 15
        );

        ctx.stroke();

    }

}


/* =====================================================
   INTERACCION
===================================================== */

function interact() {

    if (!gameStarted) {
        return;
    }


    /* NPC */

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

            talkToNPC(
                npc
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


    /* EDIFICIOS */

    for (
        const building
        of buildings
    ) {

        if (
            nearDoor(
                building
            )
        ) {

            enterBuilding(
                building
            );

            return;

        }

    }

}


/* =====================================================
   PUERTA
===================================================== */

function nearDoor(
    building
) {

    const door = {

        x:
            building.x +
            building.width / 2,

        y:
            building.y +
            building.height -
            25

    };

    return Math.hypot(
        player.x +
            player.width / 2 -
            door.x,

        player.y +
            player.height / 2 -
            door.y
    ) < 75;

}


/* =====================================================
   ENTRAR
===================================================== */

function enterBuilding(
    building
) {

    player.inside =
        true;

    player.currentBuilding =
        building;

    paused = true;

    showInterior(
        building
    );

}


/* =====================================================
   INTERIOR
===================================================== */

function showInterior(
    building
) {

    const panel =
        document.getElementById(
            "interaction-panel"
        );

    const title =
        document.getElementById(
            "interaction-title"
        );

    const description =
        document.getElementById(
            "interaction-description"
        );

    const actions =
        document.getElementById(
            "interaction-actions"
        );

    title.textContent =
        building.name;

    actions.innerHTML = "";

    if (
        building.id ===
        "bakery"
    ) {

        description.textContent =
            "El olor a pan recién horneado llena el local.";

        addAction(
            actions,
            "Comprar pan",
            buyBread
        );

    } else if (
        building.id ===
        "radio"
    ) {

        description.textContent =
            "Un pequeño estudio de radio. Micrófonos, consola y vecinos entrando y saliendo.";

        addAction(
            actions,
            "Escuchar la radio",
            listenRadio
        );

    } else if (
        building.id ===
        "market"
    ) {

        description.textContent =
            "Un almacén de barrio donde siempre hay alguien conversando.";

        addAction(
            actions,
            "Comprar pan",
            buyBread
        );

    } else if (
        building.type ===
        "museum"
    ) {

        description.textContent =
            "Fotografías, documentos y objetos que ayudan a reconstruir la memoria local.";

        addAction(
            actions,
            "Investigar",
            investigateMuseum
        );

    } else if (
        building.type ===
        "school"
    ) {

        description.textContent =
            "Una escuela del pueblo. Se escuchan voces y movimiento durante el día.";

    } else if (
        building.type ===
        "stadium"
    ) {

        description.textContent =
            "Una cancha, tribunas y espacio para el deporte local.";

    } else if (
        building.type ===
        "house"
    ) {

        description.textContent =
            "Una casa de barrio. Una mesa, algunas sillas y objetos de la vida cotidiana.";

        addAction(
            actions,
            "Preparar mate",
            prepareMate
        );

    } else {

        description.textContent =
            "Un lugar de la vida cotidiana del pueblo.";

    }

    panel.classList.remove(
        "hidden"
    );

}


/* =====================================================
   ACCIONES INTERIORES
===================================================== */

function addAction(
    container,
    label,
    callback
) {

    const button =
        document.createElement(
            "button"
        );

    button.textContent =
        label;

    button.onclick =
        callback;

    container.appendChild(
        button
    );

}


function buyBread() {

    player.bread++;

    inventory.push(
        "Pan fresco"
    );

    updateInventory();

    notify(
        "Compraste pan fresco."
    );

}


function prepareMate() {

    player.mate++;

    inventory.push(
        "Mate preparado"
    );

    updateInventory();

    notify(
        "Preparaste un mate."
    );

}


function listenRadio() {

    showDialogue(
        "Radio Ocarina",
        "La radio está al aire. En un pueblo, una voz puede conectar a muchísima gente."
    );

}


function investigateMuseum() {

    showDialogue(
        "Museo Local",
        "Las fotografías y documentos permiten reconstruir fragmentos de la historia del territorio."
    );

}


/* =====================================================
   SALIR
===================================================== */

function exitBuilding() {

    player.inside =
        false;

    player.currentBuilding =
        null;

    paused = false;

    document
        .getElementById(
            "interaction-panel"
        )
        .classList.add(
            "hidden"
        );

}


document
    .getElementById(
        "interaction-close"
    )
    .addEventListener(
        "click",
        exitBuilding
    );


/* =====================================================
   DIALOGO NPC
===================================================== */

function talkToNPC(
    npc
) {

    const index =
        Math.floor(
            Math.random() *
            npc.text.length
        );

    showDialogue(
        npc.name,
        npc.text[index]
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

}


/* =====================================================
   DIALOGO
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
        .classList.remove(
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
                .classList.add(
                    "hidden"
                );

        }
    );


/* =====================================================
   OBJETOS
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

    notify(
        "Encontraste: " +
        object.name
    );


    if (
        object.type ===
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
        object.type ===
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

                    "Encontraste una fotografía que puede ayudar a reconstruir la memoria del pueblo."
                );

            },
            300
        );

    }

}


/* =====================================================
   INVENTARIO
===================================================== */

function toggleInventory() {

    document
        .getElementById(
            "inventory-panel"
        )
        .classList.toggle(
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
        toggleInventory
    );


function updateInventory() {

    const container =
        document.getElementById(
            "inventory-items"
        );

    document
        .getElementById(
            "bread-count"
        )
        .textContent =
        player.bread;

    document
        .getElementById(
            "mate-count"
        )
        .textContent =
        player.mate;

    if (
        inventory.length === 0
    ) {

        container.textContent =
            "Todavía no tenés objetos.";

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
   MISION
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
        .classList.remove(
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
                .classList.add(
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
            "✓ Memoria recuperada";

    } else if (
        mission.active
    ) {

        hud.textContent =
            "Encontrá una fotografía antigua";

    } else {

        hud.textContent =
            "Explorá el pueblo";

    }

}


/* =====================================================
   NOTIFICACION
===================================================== */

let notificationTimer;

function notify(
    text
) {

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
            () => {

                element.classList.remove(
                    "show"
                );

            },
            2400
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

    const sx =
        minimap.width /
        WORLD_WIDTH;

    const sy =
        minimap.height /
        WORLD_HEIGHT;


    miniCtx.fillStyle =
        "#a89a6c";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* ciudad */

    miniCtx.fillStyle =
        "#77725e";

    miniCtx.fillRect(
        1450 * sx,
        1000 * sy,
        1800 * sx,
        1250 * sy
    );


    /* chacras */

    miniCtx.fillStyle =
        "#78915a";

    miniCtx.fillRect(
        100 * sx,
        400 * sy,
        1250 * sx,
        1900 * sy
    );


    /* rio */

    miniCtx.fillStyle =
        "#477f93";

    miniCtx.fillRect(
        river.x * sx,
        river.y * sy,
        river.width * sx,
        river.height * sy
    );


    /* rutas */

    miniCtx.fillStyle =
        "#464646";

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
        "#9c6047";

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
        "#ff4239";

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
   DIBUJAR TODO
===================================================== */

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


    drawGround();

    drawBuildings();

    drawTrafficLights();

    drawVehicles();

    drawAnimals();

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

    drawRain();


    ctx.restore();


    drawMinimap();

}


/* =====================================================
   TECLADO
===================================================== */

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

        if (
            key === "escape"
        ) {

            if (
                player.inside
            ) {

                exitBuilding();

            }

            document
                .getElementById(
                    "dialogue"
                )
                .classList.add(
                    "hidden"
                );

            document
                .getElementById(
                    "mission-panel"
                )
                .classList.add(
                    "hidden"
                );

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
   CONTROLES MOVILES
===================================================== */

document
    .querySelectorAll(
        ".move-btn"
    )
    .forEach(
        button => {

            const key =
                button.dataset.key;

            button.addEventListener(
                "touchstart",
                e => {

                    e.preventDefault();

                    keys[key] = true;

                },
                {
                    passive: false
                }
            );

            button.addEventListener(
                "touchend",
                e => {

                    e.preventDefault();

                    keys[key] = false;

                },
                {
                    passive: false
                }
            );

            button.addEventListener(
                "mousedown",
                () => {

                    keys[key] = true;

                }
            );

            button.addEventListener(
                "mouseup",
                () => {

                    keys[key] = false;

                }
            );

            button.addEventListener(
                "mouseleave",
                () => {

                    keys[key] = false;

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
        e => {

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
        e => {

            e.preventDefault();

            toggleInventory();

        },
        {
            passive: false
        }
    );


/* =====================================================
   INICIO
===================================================== */

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
                .classList.add(
                    "hidden"
                );

            notify(
                "Bienvenido a Chañar. Empezá a recorrer."
            );

        }
    );


/* =====================================================
   LOOP
===================================================== */

let lastTime =
    performance.now();

let timeAccumulator = 0;

function gameLoop(
    now
) {

    const delta =
        now -
        lastTime;

    lastTime =
        now;

    if (
        gameStarted
    ) {

        timeAccumulator +=
            delta;

        if (
            timeAccumulator >
            50
        ) {

            updateTime();

            updateVehicles();

            updateNPCs();

            updateAnimals();

            updateTrafficLights();

            timeAccumulator = 0;

        }

        updatePlayer();

        updateCamera();

    }

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   INICIALIZACION
===================================================== */

chooseWeather();

updateInventory();

setMissionHUD();

updateClockHUD();

gameLoop(
    performance.now()
);
