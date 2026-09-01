/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   GAME ENGINE V8.0
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
    5000;

const WORLD_HEIGHT =
    3500;


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

        const key =
            e.key.toLowerCase();

        keys[key] =
            true;


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
            key === "escape"
        ) {

            closePanels();

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

    smooth: .08

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 2460,

    y: 1740,

    width: 32,

    height: 32,

    speed: 4.5,

    moving: false,

    frame: 0,

    energy: 100

};


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        x: 2250,
        y: 1350,
        width: 420,
        height: 230,
        color: "#ad7052",
        name: "PLAZA / MUNICIPALIDAD",
        location: "Centro"
    },

    {
        x: 950,
        y: 850,
        width: 420,
        height: 230,
        color: "#a76f54",
        name: "ESCUELA",
        location: "Barrio histórico"
    },

    {
        x: 3400,
        y: 800,
        width: 470,
        height: 240,
        color: "#806d5c",
        name: "RADIO OCARINA",
        location: "Zona norte"
    },

    {
        x: 650,
        y: 2300,
        width: 380,
        height: 220,
        color: "#96745e",
        name: "ALMACÉN",
        location: "Zona rural"
    },

    {
        x: 3250,
        y: 2450,
        width: 420,
        height: 230,
        color: "#9a725b",
        name: "CASA",
        location: "Zona rural"
    },

    {
        x: 2250,
        y: 400,
        width: 430,
        height: 230,
        color: "#88715e",
        name: "MUSEO",
        location: "Zona histórica"
    }

];


/* =====================================================
   ZONAS TERRITORIALES
===================================================== */

const zones = [

    {
        x: 0,
        y: 0,
        width: 5000,
        height: 900,
        name: "Zona norte"
    },

    {
        x: 0,
        y: 900,
        width: 1800,
        height: 1300,
        name: "Barrio histórico"
    },

    {
        x: 1800,
        y: 900,
        width: 1800,
        height: 1300,
        name: "Centro"
    },

    {
        x: 3600,
        y: 900,
        width: 1400,
        height: 1300,
        name: "Zona productiva"
    },

    {
        x: 0,
        y: 2200,
        width: 5000,
        height: 1300,
        name: "Zona rural"
    }

];


/* =====================================================
   ÁRBOLES
===================================================== */

const trees = [];

function generateTrees() {

    const positions = [

        [180,180],
        [600,300],
        [1050,180],
        [1500,300],
        [1950,170],
        [3000,220],
        [3800,260],
        [4600,180],

        [200,1250],
        [500,1550],
        [800,1300],
        [1400,1450],
        [1750,1200],

        [4050,1250],
        [4550,1450],

        [250,2800],
        [700,3100],
        [1250,2700],
        [1800,3150],
        [2900,3000],
        [3700,2900],
        [4400,3150]

    ];

    positions.forEach(
        p => trees.push(p)
    );

}

generateTrees();


/* =====================================================
   VIÑEDOS
===================================================== */

const vineyards = [

    {
        x: 450,
        y: 1150,
        rows: 10,
        cols: 18
    },

    {
        x: 3800,
        y: 1650,
        rows: 10,
        cols: 20
    },

    {
        x: 1200,
        y: 2700,
        rows: 12,
        cols: 22
    }

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        x: 2050,
        y: 1680,

        name:
            "Don Pedro",

        text:
            "Este pueblo guarda historias " +
            "que todavía no aparecen en ningún libro.",

        mission:
            true
    },

    {
        x: 2850,
        y: 1750,

        name:
            "María",

        text:
            "Las fotografías antiguas pueden " +
            "mostrar cómo cambió el pueblo."
    },

    {
        x: 3150,
        y: 1100,

        name:
            "Julián",

        text:
            "La radio siempre fue una forma " +
            "de unir a la comunidad."
    },

    {
        x: 1600,
        y: 2400,

        name:
            "Rosa",

        text:
            "Acá la tierra y el agua son parte " +
            "de la historia de muchas familias."
    },

    {
        x: 4200,
        y: 2100,

        name:
            "Miguel",

        text:
            "Si querés conocer el Chañar, " +
            "mirá también lo que hay fuera del centro."
    }

];


/* =====================================================
   OBJETOS
===================================================== */

const objects = [

    {
        x: 1750,
        y: 1750,
        type: "photo",
        name: "Fotografía antigua",
        description:
            "Una fotografía que conserva " +
            "una parte de la memoria local.",
        collected: false
    },

    {
        x: 2920,
        y: 2050,
        type: "document",
        name: "Documento histórico",
        description:
            "Un documento que puede ayudar " +
            "a reconstruir una historia.",
        collected: false
    },

    {
        x: 2450,
        y: 720,
        type: "photo",
        name: "Fotografía del pueblo",
        description:
            "Una imagen antigua del territorio.",
        collected: false
    },

    {
        x: 850,
        y: 2100,
        type: "document",
        name: "Cuaderno escolar",
        description:
            "Un viejo registro relacionado " +
            "con la vida escolar.",
        collected: false
    },

    {
        x: 4300,
        y: 1750,
        type: "photo",
        name: "Fotografía de chacra",
        description:
            "Una imagen relacionada " +
            "con la producción local.",
        collected: false
    },

    {
        x: 1550,
        y: 2900,
        type: "document",
        name: "Mapa antiguo",
        description:
            "Un mapa que permite imaginar " +
            "cómo era el territorio."
        ,
        collected: false
    }

];


/* =====================================================
   LUGARES DESCUBRIBLES
===================================================== */

const locations = [

    {
        x: 2460,
        y: 1500,
        name: "Centro del Chañar",
        discovered: false
    },

    {
        x: 2450,
        y: 550,
        name: "Zona histórica",
        discovered: false
    },

    {
        x: 3650,
        y: 900,
        name: "Zona norte",
        discovered: false
    },

    {
        x: 900,
        y: 950,
        name: "Barrio histórico",
        discovered: false
    },

    {
        x: 1200,
        y: 2850,
        name: "Zona rural",
        discovered: false
    },

    {
        x: 4000,
        y: 1850,
        name: "Zona productiva",
        discovered: false
    },

    {
        x: 1570,
        y: 1750,
        name: "Plaza",
        discovered: false
    },

    {
        x: 2500,
        y: 2500,
        name: "Sector de chacras",
        discovered: false
    }

];


/* =====================================================
   INVENTARIO
===================================================== */

let inventory = [];


/* =====================================================
   MISIÓN
===================================================== */

let mission = {

    active: false,

    completed: false,

    title:
        "La fotografía perdida",

    description:
        "Encontrá una fotografía " +
        "antigua para ayudar a Don Pedro."

};


/* =====================================================
   TIEMPO
===================================================== */

let worldTime =
    8 * 60;


/* =====================================================
   JUEGO
===================================================== */

let gameStarted =
    false;


/* =====================================================
   UTILIDADES
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


    if (
        dx !== 0 &&
        dy !== 0
    ) {

        dx *=
            .707;

        dy *=
            .707;

    }


    player.moving =
        dx !== 0 ||
        dy !== 0;


    if (
        player.moving
    ) {

        player.frame +=
            .15;

        player.energy -=
            .015;

    } else {

        player.energy +=
            .04;

    }


    player.energy =
        Math.max(
            0,
            Math.min(
                100,
                player.energy
            )
        );


    if (
        player.energy > 0
    ) {

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


    const maxX =
        Math.max(
            0,
            WORLD_WIDTH -
            canvas.width
        );

    const maxY =
        Math.max(
            0,
            WORLD_HEIGHT -
            canvas.height
        );


    camera.x =
        Math.max(
            0,
            Math.min(
                maxX,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                maxY,
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
        "#c8ad7b";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* ZONAS */

    ctx.fillStyle =
        "#bda06d";

    ctx.fillRect(
        0,
        900,
        1800,
        1300
    );


    ctx.fillStyle =
        "#c3a873";

    ctx.fillRect(
        1800,
        900,
        1800,
        1300
    );


    ctx.fillStyle =
        "#b69b6c";

    ctx.fillRect(
        0,
        2200,
        WORLD_WIDTH,
        1300
    );


    /* CAMINOS PRINCIPALES */

    ctx.fillStyle =
        "#9a7e57";


    ctx.fillRect(
        0,
        1600,
        WORLD_WIDTH,
        170
    );


    ctx.fillRect(
        2370,
        0,
        190,
        WORLD_HEIGHT
    );


    /* CAMINO SECUNDARIO */

    ctx.fillStyle =
        "#aa8e63";


    ctx.fillRect(
        0,
        2050,
        WORLD_WIDTH,
        90
    );


    /* CANAL */

    ctx.fillStyle =
        "#4f8798";


    ctx.fillRect(
        0,
        3180,
        WORLD_WIDTH,
        55
    );


    /* PLAZA */

    ctx.fillStyle =
        "#71955d";


    ctx.fillRect(
        1950,
        1250,
        900,
        600
    );


    /* FUENTE */

    ctx.fillStyle =
        "#75a3a8";

    ctx.beginPath();

    ctx.arc(
        2400,
        1530,
        80,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CERROS */

    drawMountains();


    /* VIÑEDOS */

    vineyards.forEach(
        vineyard =>
            drawVineyard(
                vineyard
            )
    );


    /* ÁRBOLES */

    trees.forEach(
        tree =>
            drawTree(
                tree[0],
                tree[1]
            )
    );

}


/* =====================================================
   MONTAÑAS
===================================================== */

function drawMountains() {

    ctx.fillStyle =
        "#88745f";


    ctx.beginPath();

    ctx.moveTo(
        0,
        550
    );

    ctx.lineTo(
        500,
        120
    );

    ctx.lineTo(
        1000,
        520
    );

    ctx.lineTo(
        1600,
        170
    );

    ctx.lineTo(
        2150,
        530
    );

    ctx.lineTo(
        2800,
        110
    );

    ctx.lineTo(
        3400,
        500
    );

    ctx.lineTo(
        4050,
        150
    );

    ctx.lineTo(
        5000,
        520
    );

    ctx.lineTo(
        5000,
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
   ÁRBOL
===================================================== */

function drawTree(x, y) {

    ctx.fillStyle =
        "#624832";


    ctx.fillRect(
        x - 8,
        y,
        16,
        42
    );


    ctx.fillStyle =
        "#466c3d";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        35,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#557e47";


    ctx.beginPath();

    ctx.arc(
        x - 16,
        y + 4,
        22,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   VIÑEDO
===================================================== */

function drawVineyard(vineyard) {

    for (
        let row = 0;
        row < vineyard.rows;
        row++
    ) {

        for (
            let col = 0;
            col < vineyard.cols;
            col++
        ) {

            const x =
                vineyard.x +
                col * 30;

            const y =
                vineyard.y +
                row * 32;


            ctx.strokeStyle =
                "#48653d";

            ctx.lineWidth =
                2;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y + 22
            );

            ctx.stroke();


            ctx.fillStyle =
                "#4f7842";


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
                "#49362d";


            ctx.beginPath();

            ctx.moveTo(
                building.x - 18,
                building.y
            );

            ctx.lineTo(
                building.x +
                building.width / 2,
                building.y - 65
            );

            ctx.lineTo(
                building.x +
                building.width + 18,
                building.y
            );

            ctx.closePath();

            ctx.fill();


            /* puerta */

            ctx.fillStyle =
                "#49362d";


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
                "#b9d1ca";


            ctx.fillRect(
                building.x + 35,
                building.y + 45,
                50,
                45
            );


            ctx.fillRect(
                building.x +
                building.width -
                85,

                building.y + 45,

                50,
                45
            );


            /* nombre */

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
    );

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(npc) {

    const bob =
        Math.sin(
            player.frame * 3 +
            npc.x
        ) * 2;


    ctx.fillStyle =
        "#62435e";


    ctx.beginPath();

    ctx.arc(
        npc.x,
        npc.y + bob,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#e1b18b";


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
        "14px Arial";


    ctx.fillText(
        npc.name,
        npc.x - 35,
        npc.y + 43
    );


    if (
        npc.mission &&
        !mission.completed
    ) {

        ctx.fillStyle =
            "#f1c64e";

        ctx.font =
            "bold 25px Arial";


        ctx.fillText(
            "!",
            npc.x - 5,
            npc.y - 48
        );

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
                    Date.now() / 250
                ) * 3;


            ctx.font =
                "27px Arial";


            ctx.fillText(

                object.type === "photo"
                    ? "📷"
                    : "📜",

                object.x,
                object.y + pulse

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
        x + 16,
        y + 34,
        23,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cuerpo */

    ctx.fillStyle =
        "#263d50";


    ctx.fillRect(
        x,
        y,
        32,
        32
    );


    /* cabeza */

    ctx.fillStyle =
        "#e2b38d";


    ctx.beginPath();

    ctx.arc(
        x + 16,
        y - 10,
        11,
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

function getNearestInteraction() {

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
                d < nearestDistance
            ) {

                nearest =
                    {
                        type: "npc",
                        object: npc
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
                d < nearestDistance
            ) {

                nearest =
                    {
                        type: "object",
                        object: object
                    };

                nearestDistance =
                    d;

            }

        }
    );


    if (
        nearestDistance < 95
    ) {

        return nearest;

    }


    return null;

}


function interact() {

    const target =
        getNearestInteraction();


    if (!target) {

        showToast(
            "No hay nada para interactuar aquí."
        );

        return;

    }


    if (
        target.type === "npc"
    ) {

        const npc =
            target.object;


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
                300
            );

        }


        return;

    }


    if (
        target.type === "object"
    ) {

        collectObject(
            target.object
        );

    }

}


/* =====================================================
   COLECCIONAR
===================================================== */

function collectObject(object) {

    object.collected =
        true;


    inventory.push(
        object.name
    );


    updateInventory();


    updateCounters();


    showToast(
        "Encontraste: " +
        object.name
    );


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
            function() {

                showDialogue(
                    "MISIÓN COMPLETADA",

                    "La fotografía puede ayudarnos " +
                    "a reconstruir parte de la memoria " +
                    "del pueblo."
                );

            },
            400
        );

    }


    saveGame();

}


/* =====================================================
   DESCUBRIMIENTOS
===================================================== */

function updateDiscoveries() {

    locations.forEach(
        location => {

            if (
                location.discovered
            ) {

                return;

            }


            const d =
                distance(
                    player,
                    location
                );


            if (
                d < 130
            ) {

                location.discovered =
                    true;


                showDiscovery(
                    location.name
                );


                updateCounters();

                saveGame();

            }

        }
    );

}


function showDiscovery(name) {

    document
        .getElementById(
            "discovery-name"
        )
        .textContent =
        name;


    const panel =
        document.getElementById(
            "discovery-panel"
        );


    panel.classList.remove(
        "hidden"
    );


    setTimeout(
        function() {

            panel.classList.add(
                "hidden"
            );

        },
        3000
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

        container.textContent =
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
   CONTADORES
===================================================== */

function updateCounters() {

    const discoveries =
        locations.filter(
            location =>
                location.discovered
        ).length;


    document
        .getElementById(
            "discoveries"
        )
        .textContent =
        discoveries +
        " / " +
        locations.length;


    document
        .getElementById(
            "energy-fill"
        )
        .style.width =
        player.energy +
        "%";

}


/* =====================================================
   UBICACIÓN
===================================================== */

function updateLocation() {

    let current =
        "Territorio del Chañar";


    for (
        const zone
        of zones
    ) {

        if (

            player.x >= zone.x &&

            player.x <=
            zone.x +
            zone.width &&

            player.y >= zone.y &&

            player.y <=
            zone.y +
            zone.height

        ) {

            current =
                zone.name;

            break;

        }

    }


    document
        .getElementById(
            "location-name"
        )
        .textContent =
        current;

}


/* =====================================================
   INTERACTION HUD
===================================================== */

function updateInteractionHint() {

    const target =
        getNearestInteraction();


    const hint =
        document.getElementById(
            "interaction-hint"
        );


    if (target) {

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


    const scaleX =
        width /
        WORLD_WIDTH;

    const scaleY =
        height /
        WORLD_HEIGHT;


    miniCtx.fillStyle =
        "#c7aa76";


    miniCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /* caminos */

    miniCtx.fillStyle =
        "#957957";


    miniCtx.fillRect(
        0,
        1600 * scaleY,
        width,
        170 * scaleY
    );


    miniCtx.fillRect(
        2370 * scaleX,
        0,
        190 * scaleX,
        height
    );


    /* edificios */

    miniCtx.fillStyle =
        "#654d40";


    buildings.forEach(
        building => {

            miniCtx.fillRect(

                building.x * scaleX,

                building.y * scaleY,

                building.width *
                scaleX,

                building.height *
                scaleY

            );

        }
    );


    /* objetos */

    miniCtx.fillStyle =
        "#e5c14f";


    objects.forEach(
        object => {

            if (
                object.collected
            ) {

                return;

            }


            miniCtx.fillRect(
                object.x * scaleX,
                object.y * scaleY,
                3,
                3
            );

        }
    );


    /* jugador */

    miniCtx.fillStyle =
        "#e43e3e";


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
   DÍA / NOCHE
===================================================== */

function updateWorldTime() {

    worldTime +=
        .015;


    if (
        worldTime >=
        1440
    ) {

        worldTime =
            0;

    }


    const hours =
        Math.floor(
            worldTime / 60
        );

    const minutes =
        Math.floor(
            worldTime % 60
        );


    document
        .getElementById(
            "game-time"
        )
        .textContent =

        String(hours)
            .padStart(2, "0")

        +

        ":" +

        String(minutes)
            .padStart(2, "0");

}


function drawLighting() {

    const hour =
        worldTime / 60;


    let alpha =
        0;


    if (
        hour < 7
    ) {

        alpha =
            .30;

    }


    if (
        hour > 19
    ) {

        alpha =
            .35;

    }


    if (
        hour >= 17 &&
        hour <= 19
    ) {

        alpha =
            (
                hour - 17
            ) * .12;

    }


    if (
        alpha > 0
    ) {

        ctx.fillStyle =
            `rgba(25,35,75,${alpha})`;

        ctx.fillRect(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT
        );

    }

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =====================================================
   GUARDAR PARTIDA
===================================================== */

function saveGame() {

    const save = {

        player: {

            x:
                player.x,

            y:
                player.y,

            energy:
                player.energy

        },

        inventory,

        mission,

        locations:

            locations.map(
                location => ({
                    name:
                        location.name,

                    discovered:
                        location.discovered
                })
            ),

        objects:

            objects.map(
                object => ({
                    name:
                        object.name,

                    collected:
                        object.collected
                })
            )

    };


    localStorage.setItem(
        "secretos_chanar_v8",
        JSON.stringify(save)
    );

}


/* =====================================================
   CARGAR PARTIDA
===================================================== */

function loadGame() {

    const raw =
        localStorage.getItem(
            "secretos_chanar_v8"
        );


    if (!raw) {

        showToast(
            "No hay una partida guardada."
        );

        return;

    }


    try {

        const save =
            JSON.parse(
                raw
            );


        player.x =
            save.player.x;

        player.y =
            save.player.y;

        player.energy =
            save.player.energy;


        inventory =
            save.inventory || [];


        mission =
            save.mission ||
            mission;


        if (
            save.locations
        ) {

            save.locations.forEach(
                saved => {

                    const location =
                        locations.find(
                            item =>
                                item.name ===
                                saved.name
                        );


                    if (
                        location
                    ) {

                        location.discovered =
                            saved.discovered;

                    }

                }
            );

        }


        if (
            save.objects
        ) {

            save.objects.forEach(
                saved => {

                    const object =
                        objects.find(
                            item =>
                                item.name ===
                                saved.name
                        );


                    if (
                        object
                    ) {

                        object.collected =
                            saved.collected;

                    }

                }
            );

        }


        updateInventory();

        updateCounters();

        setMissionHUD();

        showToast(
            "Partida cargada."
        );


    } catch (
        error
    ) {

        console.error(
            error
        );

        showToast(
            "No se pudo cargar la partida."
        );

    }

}


/* =====================================================
   REINICIAR
===================================================== */

function resetGame() {

    const confirmReset =
        confirm(
            "¿Querés comenzar una nueva partida?"
        );


    if (!confirmReset) {

        return;

    }


    localStorage.removeItem(
        "secretos_chanar_v8"
    );


    location.reload();

}


document
    .getElementById(
        "save-button"
    )
    .addEventListener(
        "click",
        function() {

            saveGame();

            showToast(
                "Partida guardada."
            );

        }
    );


document
    .getElementById(
        "reset-button"
    )
    .addEventListener(
        "click",
        resetGame
    );


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


            showToast(
                "Bienvenido al Chañar."
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

            loadGame();

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
   CONTROLES TÁCTILES
===================================================== */

document
    .querySelectorAll(
        ".move-btn"
    )
    .forEach(
        button => {

            const key =
                button.dataset.key;


            function press(e) {

                e.preventDefault();

                keys[key] =
                    true;

            }


            function release(e) {

                e.preventDefault();

                keys[key] =
                    false;

            }


            button.addEventListener(
                "touchstart",
                press,
                {
                    passive: false
                }
            );


            button.addEventListener(
                "touchend",
                release,
                {
                    passive: false
                }
            );


            button.addEventListener(
                "mousedown",
                press
            );


            button.addEventListener(
                "mouseup",
                release
            );


            button.addEventListener(
                "mouseleave",
                release
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
        "mobile-interact"
    )
    .addEventListener(
        "click",
        interact
    );


document
    .getElementById(
        "mobile-inventory"
    )
    .addEventListener(
        "click",
        toggleInventory
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


    npcs.forEach(
        npc =>
            drawNPC(
                npc
            )
    );


    drawPlayer();

    drawLighting();


    ctx.restore();


    drawMinimap();

}


/* =====================================================
   MOTOR
===================================================== */

let lastTime =
    performance.now();


function gameLoop(timestamp) {

    const delta =
        timestamp -
        lastTime;


    lastTime =
        timestamp;


    if (
        gameStarted
    ) {

        updatePlayer();

        updateCamera();

        updateDiscoveries();

        updateLocation();

        updateInteractionHint();

        updateWorldTime();

        updateCounters();

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

updateCounters();

gameLoop(
    performance.now()
);
