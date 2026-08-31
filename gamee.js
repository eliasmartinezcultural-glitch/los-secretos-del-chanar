/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   VERSIÓN 1.0
   OCARINA PRODUCCIONES
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

const WORLD_WIDTH = 4200;
const WORLD_HEIGHT = 3000;

const SAVE_KEY =
    "los_secretos_del_chanar_v1";


/* =====================================================
   RESIZE
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
    function(event) {

        const key =
            event.key.toLowerCase();

        keys[key] = true;


        if (
            key === "e" &&
            gameStarted
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
            key === "h" &&
            gameStarted
        ) {

            showHistory(
                "La memoria del Chañar",
                "El territorio que hoy conocemos como San Patricio del Chañar tuvo antes otros nombres y otras historias."
            );

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


/* =====================================================
   CÁMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth: 0.08

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 1950,

    y: 1430,

    width: 34,

    height: 34,

    speed: 3.4,

    runSpeed: 5.8,

    moving: false,

    frame: 0,

    direction: "down"

};


/* =====================================================
   DATOS DEL MUNDO
===================================================== */

const locations = [

    {
        x: 2000,
        y: 1300,
        name: "PLAZA CENTRAL",
        color: "#6e9356"
    },

    {
        x: 350,
        y: 350,
        name: "ESCUELA 273",
        color: "#9b6c50"
    },

    {
        x: 3200,
        y: 450,
        name: "BODEGAS",
        color: "#7c654e"
    },

    {
        x: 600,
        y: 2200,
        name: "TRATAYÉN",
        color: "#80664c"
    },

    {
        x: 3200,
        y: 2200,
        name: "CHACRAS",
        color: "#557b4c"
    }

];


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        x: 350,
        y: 350,
        width: 500,
        height: 280,
        color: "#a86e50",
        name: "ESCUELA 273",
        type: "school"
    },

    {
        x: 1700,
        y: 1080,
        width: 600,
        height: 260,
        color: "#86684f",
        name: "MUNICIPIO",
        type: "municipality"
    },

    {
        x: 3050,
        y: 330,
        width: 600,
        height: 300,
        color: "#785c4a",
        name: "BODEGA",
        type: "winery"
    },

    {
        x: 3200,
        y: 1850,
        width: 500,
        height: 260,
        color: "#99765a",
        name: "CHACRA",
        type: "farm"
    },

    {
        x: 500,
        y: 2050,
        width: 420,
        height: 260,
        color: "#8d7056",
        name: "TRATAYÉN",
        type: "history"
    },

    {
        x: 2850,
        y: 1080,
        width: 430,
        height: 220,
        color: "#806854",
        name: "RADIO OCARINA",
        type: "radio"
    }

];


/* =====================================================
   ÁRBOLES
===================================================== */

const trees = [

    [150,180],
    [480,160],
    [950,230],
    [1400,180],
    [2500,190],
    [3900,180],

    [150,900],
    [700,760],
    [1100,950],
    [2800,780],
    [3900,900],

    [150,1500],
    [850,1550],
    [2900,1500],
    [3900,1550],

    [200,2750],
    [1100,2700],
    [2200,2750],
    [3200,2700],
    [4000,2800]

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        x: 1450,
        y: 1400,

        name: "Don Pedro",

        color: "#654263",

        text:
            "El Chañar tiene muchas capas. " +
            "Antes de ser ciudad hubo caminos, agua, chacras y gente que soñó con hacer producir este desierto.",

        mission: "history"

    },

    {
        x: 2250,
        y: 1500,

        name: "María",

        color: "#665d86",

        text:
            "Las fotografías antiguas son pequeñas máquinas del tiempo. " +
            "Una imagen puede decirte dónde estaba una calle, una escuela o una familia.",

        mission: null

    },

    {
        x: 2750,
        y: 1200,

        name: "Julián",

        color: "#76543d",

        text:
            "La radio tiene algo especial: permite que una historia llegue a toda la comunidad al mismo tiempo.",

        mission: "radio"

    },

    {
        x: 1000,
        y: 2250,

        name: "El historiador",

        color: "#4d684d",

        text:
            "Acá tenés una pista sobre Tratayén. La antigua colonia habría ocupado unas veinte manzanas y una gran crecida del Neuquén pudo haber contribuido a su desaparición.",

        mission: "tratayen"

    },

    {
        x: 2850,
        y: 500,

        name: "La bodeguera",

        color: "#704e43",

        text:
            "Donde antes había monte y desierto hoy existen viñedos. El agua cambió completamente este territorio.",

        mission: "water"

    }

];


/* =====================================================
   OBJETOS HISTÓRICOS
===================================================== */

const objects = [

    {
        id: "photo1",

        x: 1180,
        y: 1360,

        type: "photo",

        name: "Fotografía antigua",

        description:
            "Una fotografía encontrada cerca de la plaza.",

        clue:
            "Las fotografías permiten reconstruir la transformación urbana.",

        collected: false
    },

    {
        id: "doc1973",

        x: 2050,
        y: 900,

        type: "document",

        name: "Documento de 1973",

        description:
            "Referencia al nacimiento institucional de San Patricio del Chañar.",

        clue:
            "El Decreto Provincial 1339 creó la localidad el 21 de mayo de 1973.",

        history: true,

        collected: false
    },

    {
        id: "photo273",

        x: 900,
        y: 720,

        type: "photo",

        name: "Fotografía de la Escuela 273",

        description:
            "Una imagen escolar que recuerda los primeros años educativos de la localidad.",

        clue:
            "La Escuela Nº 273 comenzó a funcionar en 1975.",

        collected: false
    },

    {
        id: "water",

        x: 1550,
        y: 2150,

        type: "clue",

        name: "Pista del agua",

        description:
            "Un registro relacionado con las primeras obras de riego.",

        clue:
            "La primera bocatoma fue inaugurada en 1971.",

        history: true,

        collected: false
    },

    {
        id: "tratayen",

        x: 720,
        y: 2500,

        type: "document",

        name: "Mapa de Tratayén",

        description:
            "Un viejo mapa señala el antiguo asentamiento.",

        clue:
            "Tratayén existió antes de la formación de la localidad actual.",

        history: true,

        collected: false
    },

    {
        id: "wine",

        x: 3450,
        y: 780,

        type: "clue",

        name: "Etiqueta de vino",

        description:
            "Una etiqueta que representa la nueva identidad productiva.",

        clue:
            "San Patricio del Chañar es uno de los principales polos vitivinícolas de Neuquén.",

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

const missions = {

    history: {

        title:
            "La memoria perdida",

        description:
            "Encontrá dos documentos históricos y una fotografía para comenzar a reconstruir la historia del Chañar.",

        required: 3,

        progress: 0,

        completed: false

    },

    tratayen: {

        title:
            "El pueblo que desapareció",

        description:
            "Encontrá el mapa de Tratayén y descubrí qué ocurrió con la antigua colonia.",

        required: 1,

        progress: 0,

        completed: false

    },

    water: {

        title:
            "El agua que cambió todo",

        description:
            "Encontrá la pista de la primera bocatoma.",

        required: 1,

        progress: 0,

        completed: false

    },

    radio: {

        title:
            "La voz del pueblo",

        description:
            "Encontrá una fotografía y llevála a la zona de Radio Ocarina.",

        required: 1,

        progress: 0,

        completed: false

    }

};


/* =====================================================
   HISTORIA
===================================================== */

const historyEvents = [

    {
        year: "1881-1883",

        title: "Los primeros registros",

        text:
            "Planos y mensuras documentaron el territorio y referencias al antiguo Mangrullo Chañar y las rastrilladas de la región."
    },

    {
        year: "1913",

        title: "Tratayén",

        text:
            "Una mensura registró una colonia de alrededor de veinte manzanas en la zona de Tratayén."
    },

    {
        year: "1968",

        title: "Comienza la transformación",

        text:
            "Se inicia una gran operación de sistematización productiva de tierras que hasta entonces eran monte y desierto."
    },

    {
        year: "1971",

        title: "El agua",

        text:
            "La primera bocatoma permitió llevar agua para el desarrollo de la primera etapa productiva."
    },

    {
        year: "1973",

        title: "Nace San Patricio del Chañar",

        text:
            "El 21 de mayo de 1973, mediante el Decreto Provincial 1339, se crea la localidad."
    },

    {
        year: "1975",

        title: "La Escuela 273",

        text:
            "Comienza a funcionar la Escuela Nº 273, primera escuela de la localidad."
    }

];


/* =====================================================
   ESTADO
===================================================== */

let gameStarted = false;

let worldTime = 8;

let notificationTimer = null;

let lastTime = 0;

let interactionTarget = null;


/* =====================================================
   UTILIDADES
===================================================== */

function distance(a, b) {

    const ax =
        a.x +
        (a.width || 0) / 2;

    const ay =
        a.y +
        (a.height || 0) / 2;

    const bx =
        b.x +
        (b.width || 0) / 2;

    const by =
        b.y +
        (b.height || 0) / 2;

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
   MOVIMIENTO
===================================================== */

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


function updatePlayer(delta) {

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


    const moving =
        dx !== 0 ||
        dy !== 0;


    player.moving =
        moving;


    if (!moving) {

        return;

    }


    const length =
        Math.hypot(dx, dy);


    dx /= length;
    dy /= length;


    const running =
        keys["shift"];


    const speed =
        running
            ? player.runSpeed
            : player.speed;


    const movement =
        speed *
        delta;


    if (
        canMove(
            player.x +
            dx * movement,
            player.y
        )
    ) {

        player.x +=
            dx * movement;

    }


    if (
        canMove(
            player.x,
            player.y +
            dy * movement
        )
    ) {

        player.y +=
            dy * movement;

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


    player.frame +=
        delta * 8;

}


/* =====================================================
   CÁMARA
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
   MUNDO
===================================================== */

function drawWorld() {

    /* TERRENO */

    ctx.fillStyle =
        "#c7aa76";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* BARDA */

    ctx.fillStyle =
        "#9b805e";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        330
    );


    drawMountains();


    /* CAMINO PRINCIPAL */

    ctx.fillStyle =
        "#a4865a";

    ctx.fillRect(
        0,
        1300,
        WORLD_WIDTH,
        180
    );


    ctx.fillRect(
        1950,
        0,
        180,
        WORLD_HEIGHT
    );


    /* CAMINOS SECUNDARIOS */

    ctx.fillStyle =
        "#b19162";

    ctx.fillRect(
        700,
        2150,
        3000,
        80
    );


    ctx.fillRect(
        950,
        550,
        80,
        1900
    );


    /* PLAZA */

    ctx.fillStyle =
        "#709656";

    ctx.fillRect(
        1600,
        1350,
        700,
        500
    );


    drawPlaza();


    /* RÍO NEUQUÉN */

    drawRiver();


    /* CANALES */

    drawCanals();


    /* VIÑEDOS */

    drawVineyard(
        2850,
        700,
        16,
        12
    );


    drawVineyard(
        3100,
        2250,
        15,
        10
    );


    drawVineyard(
        1100,
        2500,
        15,
        8
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
        "#81715e";


    ctx.beginPath();

    ctx.moveTo(0,330);

    ctx.lineTo(400,80);

    ctx.lineTo(800,310);

    ctx.lineTo(1200,100);

    ctx.lineTo(1600,320);

    ctx.lineTo(2050,70);

    ctx.lineTo(2500,300);

    ctx.lineTo(3000,90);

    ctx.lineTo(3500,320);

    ctx.lineTo(3900,100);

    ctx.lineTo(4200,300);

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
   PLAZA
===================================================== */

function drawPlaza() {

    ctx.strokeStyle =
        "rgba(255,255,255,.12)";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        1600,
        1350,
        700,
        500
    );


    /* FUENTE */

    ctx.fillStyle =
        "#6e9ba0";

    ctx.beginPath();

    ctx.arc(
        1950,
        1600,
        75,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#aac6c4";

    ctx.beginPath();

    ctx.arc(
        1950,
        1600,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CAMINOS */

    ctx.fillStyle =
        "#c8ae7d";

    ctx.fillRect(
        1935,
        1350,
        30,
        500
    );

    ctx.fillRect(
        1600,
        1585,
        700,
        30
    );

}


/* =====================================================
   RÍO
===================================================== */

function drawRiver() {

    ctx.fillStyle =
        "#4d8493";

    ctx.beginPath();

    ctx.moveTo(
        0,
        2580
    );

    ctx.bezierCurveTo(
        900,
        2480,
        1250,
        2700,
        1900,
        2580
    );

    ctx.bezierCurveTo(
        2600,
        2450,
        3300,
        2700,
        4200,
        2500
    );

    ctx.lineTo(
        4200,
        3000
    );

    ctx.lineTo(
        0,
        3000
    );

    ctx.closePath();

    ctx.fill();


    /* REFLEJOS */

    ctx.strokeStyle =
        "rgba(255,255,255,.18)";

    ctx.lineWidth = 3;


    for (
        let i = 0;
        i < 14;
        i++
    ) {

        const y =
            2620 +
            i * 24;

        ctx.beginPath();

        ctx.moveTo(
            300 + i * 250,
            y
        );

        ctx.lineTo(
            500 + i * 230,
            y
        );

        ctx.stroke();

    }

}


/* =====================================================
   CANALES
===================================================== */

function drawCanals() {

    ctx.fillStyle =
        "#4f8490";


    ctx.fillRect(
        500,
        1120,
        3000,
        30
    );


    ctx.fillRect(
        1100,
        700,
        30,
        1850
    );


    ctx.fillRect(
        2800,
        700,
        30,
        1900
    );


    ctx.strokeStyle =
        "rgba(255,255,255,.18)";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        500,
        1130
    );

    ctx.lineTo(
        3500,
        1130
    );

    ctx.stroke();

}


/* =====================================================
   ÁRBOLES
===================================================== */

function drawTree(x, y) {

    ctx.fillStyle =
        "#60422f";

    ctx.fillRect(
        x - 7,
        y,
        14,
        38
    );


    ctx.fillStyle =
        "#41673e";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 5,
        32,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#4e7846";

    ctx.beginPath();

    ctx.arc(
        x - 18,
        y + 4,
        22,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 18,
        y + 4,
        22,
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
    y,
    columns,
    rows
) {

    ctx.strokeStyle =
        "#48663d";

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
                col * 35;

            const py =
                y +
                row * 38;


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
                "#4d7743";

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

        /* sombra */

        ctx.fillStyle =
            "rgba(0,0,0,.2)";

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
            building.x - 20,
            building.y
        );

        ctx.lineTo(
            building.x +
            building.width / 2,
            building.y - 70
        );

        ctx.lineTo(
            building.x +
            building.width +
            20,
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
            25,

            building.y +
            building.height -
            80,

            50,
            80
        );


        /* ventanas */

        ctx.fillStyle =
            "#b9d0ca";


        const windowY =
            building.y + 45;


        ctx.fillRect(
            building.x + 45,
            windowY,
            55,
            50
        );


        ctx.fillRect(
            building.x +
            building.width -
            100,

            windowY,

            55,
            50
        );


        /* cartel */

        ctx.fillStyle =
            "rgba(20,20,20,.65)";

        ctx.fillRect(
            building.x,
            building.y +
            building.height +
            12,

            Math.min(
                building.width,
                260
            ),

            30
        );


        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 15px Arial";

        ctx.fillText(
            building.name,
            building.x + 10,
            building.y +
            building.height +
            33
        );

    }

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(npc) {

    const bob =
        npc.mission &&
        !isMissionCompleted(
            npc.mission
        )
            ? Math.sin(
                performance.now() / 250
            ) * 2
            : 0;


    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 25,
        20,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        npc.color;

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#e0ad87";

    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y - 24 + bob,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 13px Arial";

    ctx.fillText(
        npc.name,
        npc.x - 35,
        npc.y + 48
    );


    if (
        npc.mission &&
        !isMissionCompleted(
            npc.mission
        )
    ) {

        ctx.fillStyle =
            "#e8bd4d";

        ctx.font =
            "bold 26px Arial";

        ctx.fillText(
            "!",
            npc.x - 5,
            npc.y - 47
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
                performance.now() / 300
            ) * 3;


        ctx.fillStyle =
            "rgba(255,210,100,.12)";

        ctx.beginPath();

        ctx.arc(
            object.x,
            object.y,
            22 + pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.font =
            "27px Arial";


        let icon =
            "◆";


        if (
            object.type ===
            "photo"
        ) {

            icon =
                "▣";

        }


        if (
            object.type ===
            "document"
        ) {

            icon =
                "▤";

        }


        if (
            object.type ===
            "clue"
        ) {

            icon =
                "?";

        }


        ctx.fillStyle =
            "#f3d16a";

        ctx.fillText(
            icon,
            object.x - 10,
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
                player.frame * 5
            ) * 3
            : 0;


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
        x + 17,
        y + 37,
        23,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#273c4d";

    ctx.fillRect(
        x + 2,
        y + 5,
        30,
        30
    );


    /* mochila */

    ctx.fillStyle =
        "#6f533b";

    ctx.fillRect(
        x - 4,
        y + 8,
        8,
        22
    );


    /* cabeza */

    ctx.fillStyle =
        "#e1b18b";

    ctx.beginPath();

    ctx.arc(
        x + 17,
        y - 8,
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
        x + 17,
        y - 13,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   INTERACCIÓN
===================================================== */

function findInteractionTarget() {

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
            d < 90 &&
            d < closestDistance
        ) {

            closest =
                npc;

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
            d < 80 &&
            d < closestDistance
        ) {

            closest =
                object;

            closestDistance =
                d;

        }

    }


    return closest;

}


function updateInteractionHint() {

    interactionTarget =
        findInteractionTarget();


    const hint =
        document.getElementById(
            "interaction-hint"
        );


    if (
        interactionTarget
    ) {

        hint.textContent =
            `E · Interactuar con ${
                interactionTarget.name
            }`;

        return;

    }


    hint.textContent =
        "Explorá San Patricio del Chañar";

}


/* =====================================================
   INTERACTUAR
===================================================== */

function interact() {

    const target =
        findInteractionTarget();


    if (!target) {

        notify(
            "No hay nada con qué interactuar."
        );

        return;

    }


    if (
        target.text
    ) {

        showDialogue(
            target.name,
            target.text
        );


        if (
            target.mission
        ) {

            startMission(
                target.mission
            );

        }


        return;

    }


    collectObject(
        target
    );

}


/* =====================================================
   OBJETOS
===================================================== */

function collectObject(object) {

    object.collected =
        true;


    inventory.push(
        object
    );


    if (
        object.type ===
        "photo"
    ) {

        updateCount(
            "photo-count",
            "photo"
        );

    }


    if (
        object.type ===
        "document"
    ) {

        updateCount(
            "document-count",
            "document"
        );

    }


    if (
        object.type ===
        "clue"
    ) {

        updateCount(
            "clue-count",
            "clue"
        );

    }


    updateInventory();

    updateMissions();

    saveGame();


    notify(
        `Encontraste: ${object.name}`
    );


    if (
        object.history
    ) {

        showHistory(
            object.name,
            object.clue
        );

    }

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
            "Todavía no encontraste objetos.";

        return;

    }


    container.innerHTML =
        inventory
            .map(
                item => {

                    return `
                        <div class="inventory-item">
                            <strong>
                                ${item.name}
                            </strong>
                            <br>
                            <span>
                                ${item.description}
                            </span>
                        </div>
                    `;

                }
            )
            .join("");

}


function updateCount(
    elementId,
    type
) {

    const count =
        inventory.filter(
            item =>
                item.type ===
                type
        ).length;


    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            count;

    }

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


/* =====================================================
   MISIONES
===================================================== */

function startMission(id) {

    const mission =
        missions[id];


    if (!mission) {

        return;

    }


    if (
        mission.completed
    ) {

        return;

    }


    showMission(
        mission.title,
        mission.description
    );


    updateMissions();

}


function showMission(
    title,
    description
) {

    document
        .getElementById(
            "mission-title"
        )
        .textContent =
        title;


    document
        .getElementById(
            "mission-description"
        )
        .textContent =
        description;


    document
        .getElementById(
            "mission-panel"
        )
        .classList
        .remove(
            "hidden"
        );

}


function updateMissions() {

    /* MISIÓN HISTÓRICA */

    const historyItems =
        inventory.filter(
            item =>
                item.history
        ).length;


    missions.history.progress =
        Math.min(
            historyItems,
            missions.history.required
        );


    /* TRATAYÉN */

    missions.tratayen.progress =
        inventory.some(
            item =>
                item.id ===
                "tratayen"
        )
            ? 1
            : 0;


    /* AGUA */

    missions.water.progress =
        inventory.some(
            item =>
                item.id ===
                "water"
        )
            ? 1
            : 0;


    /* RADIO */

    missions.radio.progress =
        inventory.some(
            item =>
                item.type ===
                "photo"
        )
            ? 1
            : 0;


    for (
        const id
        in missions
    ) {

        const mission =
            missions[id];


        if (
            mission.progress >=
            mission.required
        ) {

            if (
                !mission.completed
            ) {

                mission.completed =
                    true;

                notify(
                    `Misión completada: ${mission.title}`
                );

            }

        }

    }


    updateMissionHUD();

}


function isMissionCompleted(id) {

    return missions[id]
        ?.completed;

}


function updateMissionHUD() {

    const hud =
        document.getElementById(
            "mission-hud"
        );


    if (
        missions.history.completed
    ) {

        hud.textContent =
            "✓ Memoria histórica reconstruida";

        return;

    }


    if (
        missions.tratayen.completed
    ) {

        hud.textContent =
            "✓ Descubriste el misterio de Tratayén";

        return;

    }


    if (
        missions.water.completed
    ) {

        hud.textContent =
            "✓ Descubriste la historia del agua";

        return;

    }


    hud.textContent =
        "Explorá el pueblo y hablá con sus habitantes";

}


/* =====================================================
   HISTORIA
===================================================== */

function showHistory(
    title,
    text
) {

    document
        .getElementById(
            "history-title"
        )
        .textContent =
        title;


    document
        .getElementById(
            "history-text"
        )
        .textContent =
        text;


    document
        .getElementById(
            "history-panel"
        )
        .classList
        .remove(
            "hidden"
        );

}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function notify(text) {

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
            3000
        );

}


/* =====================================================
   CERRAR PANELES
===================================================== */

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
   CICLO DÍA / NOCHE
===================================================== */

function updateTime(delta) {

    worldTime +=
        delta *
        0.15;


    if (
        worldTime >= 24
    ) {

        worldTime =
            0;

    }


    const hours =
        Math.floor(
            worldTime
        );


    const minutes =
        Math.floor(
            (
                worldTime -
                hours
            ) *
            60
        );


    document
        .getElementById(
            "clock"
        )
        .textContent =
        `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}`;

}


function drawLighting() {

    const angle =
        (
            worldTime -
            12
        ) /
        12 *
        Math.PI;


    const darkness =
        Math.max(
            0,
            (
                Math.cos(angle) +
                1
            ) / 2
        );


    ctx.fillStyle =
        `rgba(20,30,70,${darkness * .28})`;


    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


/* =====================================================
   MINIMAPA
===================================================== */

function drawMinimap() {

    const scaleX =
        minimap.width /
        WORLD_WIDTH;


    const scaleY =
        minimap.height /
        WORLD_HEIGHT;


    miniCtx.clearRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* fondo */

    miniCtx.fillStyle =
        "#c7aa76";

    miniCtx.fillRect(
        0,
        0,
        minimap.width,
        minimap.height
    );


    /* río */

    miniCtx.fillStyle =
        "#4d8493";

    miniCtx.fillRect(
        0,
        2550 * scaleY,
        minimap.width,
        450 * scaleY
    );


    /* edificios */

    for (
        const building
        of buildings
    ) {

        miniCtx.fillStyle =
            "#705442";

        miniCtx.fillRect(
            building.x * scaleX,
            building.y * scaleY,
            building.width * scaleX,
            building.height * scaleY
        );

    }


    /* plaza */

    miniCtx.fillStyle =
        "#62854d";

    miniCtx.fillRect(
        1600 * scaleX,
        1350 * scaleY,
        700 * scaleX,
        500 * scaleY
    );


    /* objetos */

    miniCtx.fillStyle =
        "#e7bd51";


    for (
        const object
        of objects
    ) {

        if (
            object.collected
        ) {

            continue;

        }


        miniCtx.fillRect(
            object.x * scaleX - 2,
            object.y * scaleY - 2,
            4,
            4
        );

    }


    /* jugador */

    miniCtx.fillStyle =
        "#e53d3d";

    miniCtx.beginPath();

    miniCtx.arc(
        player.x * scaleX,
        player.y * scaleY,
        5,
        0,
        Math.PI * 2
    );

    miniCtx.fill();

}


/* =====================================================
   GUARDAR
===================================================== */

function saveGame() {

    const data = {

        player: {

            x: player.x,

            y: player.y

        },

        inventory:
            inventory.map(
                item =>
                    item.id
            ),

        missions,

        worldTime

    };


    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );

}


function loadGame() {

    const saved =
        localStorage.getItem(
            SAVE_KEY
        );


    if (!saved) {

        return;

    }


    try {

        const data =
            JSON.parse(
                saved
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
                            item.id === id
                    );


                if (
                    object &&
                    !object.collected
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
            data.missions
        ) {

            for (
                const id
                in missions
            ) {

                if (
                    data.missions[id]
                ) {

                    missions[id] =
                        data.missions[id];

                }

            }

        }


        if (
            typeof data.worldTime ===
            "number"
        ) {

            worldTime =
                data.worldTime;

        }


    } catch(error) {

        console.warn(
            "No se pudo cargar la partida.",
            error
        );

    }

}


/* =====================================================
   INICIO
===================================================== */

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


            notify(
                "Bienvenido a San Patricio del Chañar."
            );


            saveGame();

        }
    );


/* =====================================================
   BOTONES
===================================================== */

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


document
    .getElementById(
        "inventory-button"
    )
    .addEventListener(
        "click",
        toggleInventory
    );


/* =====================================================
   CONTROLES MÓVILES
===================================================== */

document
    .querySelectorAll(
        "[data-key]"
    )
    .forEach(
        button => {

            const key =
                button.dataset.key;


            button.addEventListener(
                "touchstart",
                event => {

                    event.preventDefault();

                    keys[key] =
                        true;

                }
            );


            button.addEventListener(
                "touchend",
                event => {

                    event.preventDefault();

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
        function(event) {

            event.preventDefault();

            interact();

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
   GAME LOOP
===================================================== */

function gameLoop(timestamp) {

    if (!lastTime) {

        lastTime =
            timestamp;

    }


    const rawDelta =
        (
            timestamp -
            lastTime
        ) /
        16.666;


    const delta =
        Math.min(
            rawDelta,
            2
        );


    lastTime =
        timestamp;


    if (
        gameStarted
    ) {

        updatePlayer(
            delta
        );

        updateCamera();

        updateTime(
            delta
        );

        updateInteractionHint();

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   CARGA INICIAL
===================================================== */

loadGame();

updateInventory();

updateCount(
    "photo-count",
    "photo"
);

updateCount(
    "document-count",
    "document"
);

updateCount(
    "clue-count",
    "clue"
);

updateMissionHUD();

requestAnimationFrame(
    gameLoop
);
