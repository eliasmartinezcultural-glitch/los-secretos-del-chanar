```javascript
/* =====================================================
   LOS SECRETOS DEL CHAÑAR
   MOTOR BASE — VERSIÓN ESTRUCTURAL 1.0

   ARCHIVOS:
   index.html
   style.css
   game.js

   SIN LIBRERÍAS EXTERNAS
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const CONFIG = {

    worldWidth: 3200,
    worldHeight: 2200,

    playerSpeed: 4.5,

    interactionDistance: 85,

    cameraSmooth: 0.10,

    saveKey:
        "los-secretos-del-chanar-save-v1"

};


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
   ESTADO GENERAL
===================================================== */

const game = {

    started: false,

    paused: false,

    initialized: false,

    time: 0,

    lastFrame: 0,

    delta: 0

};


/* =====================================================
   ENTRADA
===================================================== */

const keys = {};

const input = {

    joystickX: 0,

    joystickY: 0,

    joystickActive: false

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 1400,

    y: 1100,

    width: 30,

    height: 30,

    speed:
        CONFIG.playerSpeed,

    moving: false,

    frame: 0,

    direction: "down"

};


/* =====================================================
   CÁMARA
===================================================== */

const camera = {

    x: 0,

    y: 0,

    smooth:
        CONFIG.cameraSmooth

};


/* =====================================================
   EDIFICIOS
===================================================== */

const buildings = [

    {
        id: "school",

        x: 350,
        y: 350,

        width: 380,
        height: 220,

        color: "#b56c4d",

        name: "ESCUELA"
    },

    {
        id: "radio",

        x: 2150,
        y: 400,

        width: 420,
        height: 220,

        color: "#806b58",

        name: "RADIO OCARINA"
    },

    {
        id: "store",

        x: 350,
        y: 1400,

        width: 330,
        height: 210,

        color: "#9d8068",

        name: "ALMACÉN"
    },

    {
        id: "house",

        x: 2200,
        y: 1450,

        width: 360,
        height: 210,

        color: "#98725b",

        name: "CASA"
    },

    {
        id: "museum",

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
    [2900,1850],

    [1100,500],
    [2500,1050],
    [700,1150],
    [2700,1650]

];


/* =====================================================
   NPC
===================================================== */

const npcs = [

    {
        id: "don-pedro",

        x: 1000,
        y: 920,

        name: "Don Pedro",

        text:
            "Hace años que vivo acá. " +
            "Este pueblo guarda más historias " +
            "de las que imaginás.",

        mission: "photo-mission"
    },

    {
        id: "maria",

        x: 1700,
        y: 1100,

        name: "María",

        text:
            "Si encontrás una fotografía antigua, " +
            "no la dejes tirada. Puede contar " +
            "una historia."
    },

    {
        id: "julian",

        x: 2050,
        y: 900,

        name: "Julián",

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
        id: "photo-1",

        x: 760,
        y: 1120,

        type: "photo",

        name: "Fotografía antigua",

        collected: false
    },

    {
        id: "document-1",

        x: 1850,
        y: 1250,

        type: "document",

        name: "Documento antiguo",

        collected: false
    },

    {
        id: "photo-2",

        x: 1500,
        y: 500,

        type: "photo",

        name: "Fotografía del pueblo",

        collected: false
    },

    {
        id: "document-2",

        x: 2450,
        y: 1150,

        type: "document",

        name: "Documento histórico",

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

    photoMission: {

        id: "photo-mission",

        active: false,

        completed: false,

        title:
            "La fotografía perdida",

        description:
            "Don Pedro perdió una fotografía " +
            "importante. Explorá el pueblo y " +
            "encontrala."

    }

};


/* =====================================================
   INICIALIZACIÓN
===================================================== */

function init() {

    resizeCanvas();

    setupKeyboard();

    setupButtons();

    setupTouchControls();

    loadGame();

    updateHUD();

    updateInventory();

    updateMissionHUD();

    game.initialized = true;

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   CANVAS
===================================================== */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        Math.floor(
            window.innerWidth * dpr
        );

    canvas.height =
        Math.floor(
            window.innerHeight * dpr
        );

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


/* =====================================================
   TECLADO
===================================================== */

function setupKeyboard() {

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
                key === "escape" &&
                !event.repeat
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

}


/* =====================================================
   BOTONES
===================================================== */

function setupButtons() {

    const startButton =
        document.getElementById(
            "start-button"
        );

    const pauseButton =
        document.getElementById(
            "pause-button"
        );

    const resumeButton =
        document.getElementById(
            "resume-button"
        );

    const restartButton =
        document.getElementById(
            "restart-button"
        );


    startButton.addEventListener(
        "click",
        startGame
    );


    pauseButton.addEventListener(
        "click",
        togglePause
    );


    resumeButton.addEventListener(
        "click",
        togglePause
    );


    restartButton.addEventListener(
        "click",
        restartGame
    );


    document
        .getElementById(
            "dialogue-close"
        )
        .addEventListener(
            "click",
            closeDialogue
        );


    document
        .getElementById(
            "mission-close"
        )
        .addEventListener(
            "click",
            closeMission
        );


    document
        .getElementById(
            "inventory-close"
        )
        .addEventListener(
            "click",
            closeInventory
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

}


/* =====================================================
   COMENZAR
===================================================== */

function startGame() {

    game.started = true;

    game.paused = false;

    document
        .getElementById(
            "start-screen"
        )
        .classList
        .add("hidden");

    document
        .getElementById(
            "pause-screen"
        )
        .classList
        .add("hidden");

    showMessage(
        "¡Bienvenido a San Patricio del Chañar!"
    );

}


/* =====================================================
   PAUSA
===================================================== */

function togglePause() {

    if (!game.started) {

        return;

    }


    game.paused =
        !game.paused;


    document
        .getElementById(
            "pause-screen"
        )
        .classList
        .toggle(
            "hidden",
            !game.paused
        );

}


/* =====================================================
   REINICIAR
===================================================== */

function restartGame() {

    localStorage.removeItem(
        CONFIG.saveKey
    );

    location.reload();

}


/* =====================================================
   MOVIMIENTO
===================================================== */

function updatePlayer(delta) {

    if (
        !game.started ||
        game.paused
    ) {

        player.moving = false;

        return;

    }


    let dx = 0;

    let dy = 0;


    /* TECLADO */

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


    /* JOYSTICK */

    if (
        input.joystickActive
    ) {

        dx =
            input.joystickX;

        dy =
            input.joystickY;

    }


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        length > 0
    ) {

        dx /= length;

        dy /= length;

        player.moving = true;

        player.frame +=
            delta * 0.015;


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

        player.moving = false;

    }


    const moveX =
        dx *
        player.speed *
        delta /
        16.67;


    const moveY =
        dy *
        player.speed *
        delta /
        16.67;


    movePlayer(
        moveX,
        moveY
    );

}


/* =====================================================
   MOVER JUGADOR
===================================================== */

function movePlayer(
    dx,
    dy
) {

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
   CÁMARA
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
   DISTANCIA
===================================================== */

function distance(
    a,
    b
) {

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


/* =====================================================
   INTERACCIÓN
===================================================== */

function interact() {

    if (
        !game.started ||
        game.paused
    ) {

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
            ) <
            CONFIG.interactionDistance
        ) {

            showDialogue(
                npc.name,
                npc.text
            );


            if (
                npc.mission
            ) {

                startMission(
                    npc.mission
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
            CONFIG.interactionDistance
        ) {

            collectObject(
                object
            );

            return;

        }

    }

}


/* =====================================================
   OBJETOS
===================================================== */

function collectObject(
    object
) {

    object.collected = true;

    inventory.push(
        object.name
    );


    updateInventory();

    updateHUD();


    showMessage(
        "Encontraste: " +
        object.name
    );


    if (
        object.type === "photo"
    ) {

        const mission =
            missions.photoMission;


        if (
            mission.active &&
            !mission.completed
        ) {

            mission.active = false;

            mission.completed = true;

            updateMissionHUD();

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


    saveGame();

}


/* =====================================================
   MISIONES
===================================================== */

function startMission(
    missionId
) {

    const mission =
        Object.values(
            missions
        ).find(
            item =>
                item.id ===
                missionId
        );


    if (!mission) {

        return;

    }


    if (
        mission.completed
    ) {

        return;

    }


    if (
        !mission.active
    ) {

        mission.active = true;

        updateMissionHUD();

        showMission(
            mission
        );

        saveGame();

    }

}


/* =====================================================
   MOSTRAR MISIÓN
===================================================== */

function showMission(
    mission
) {

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


function closeMission() {

    document
        .getElementById(
            "mission-panel"
        )
        .classList
        .add(
            "hidden"
        );

}


function updateMissionHUD() {

    const mission =
        missions.photoMission;


    const hud =
        document.getElementById(
            "mission-hud"
        );


    if (
        mission.completed
    ) {

        hud.textContent =
            "✓ La fotografía fue encontrada";

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


function closeDialogue() {

    document
        .getElementById(
            "dialogue"
        )
        .classList
        .add(
            "hidden"
        );

}


/* =====================================================
   INVENTARIO
===================================================== */

function toggleInventory() {

    if (
        !game.started
    ) {

        return;

    }


    document
        .getElementById(
            "inventory-panel"
        )
        .classList
        .toggle(
            "hidden"
        );

}


function closeInventory() {

    document
        .getElementById(
            "inventory-panel"
        )
        .classList
        .add(
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
                    "• " + item
            )
            .join(
                "<br>"
            );

}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    const photos =
        inventory.filter(
            item =>
                item.includes(
                    "Fotografía"
                )
        ).length;


    const documents =
        inventory.filter(
            item =>
                item.includes(
                    "Documento"
                )
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


/* =====================================================
   HINT INTERACCIÓN
===================================================== */

function updateInteractionHint() {

    if (
        !game.started ||
        game.paused
    ) {

        document
            .getElementById(
                "interaction-hint"
            )
            .style.display =
            "none";

        return;

    }


    let nearby = false;


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

            nearby = true;

            break;

        }

    }


    if (!nearby) {

        for (
            const object
            of objects
        ) {

            if (
                !object.collected &&
                distance(
                    player,
                    object
                ) <
                CONFIG.interactionDistance
            ) {

                nearby = true;

                break;

            }

        }

    }


    document
        .getElementById(
            "interaction-hint"
        )
        .style.display =
        nearby
            ? "flex"
            : "none";

}


/* =====================================================
   MENSAJES
===================================================== */

let messageTimeout = null;


function showMessage(
    text
) {

    const element =
        document.getElementById(
            "game-message"
        );


    element.textContent =
        text;


    element.classList.add(
        "show"
    );


    clearTimeout(
        messageTimeout
    );


    messageTimeout =
        setTimeout(
            function() {

                element.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   GUARDADO
===================================================== */

function saveGame() {

    try {

        const saveData = {

            player: {

                x: player.x,

                y: player.y

            },

            inventory: [
                ...inventory
            ],

            objects:
                objects.map(
                    object => ({
                        id:
                            object.id,

                        collected:
                            object.collected
                    })
                ),

            missions: {

                photoMission: {

                    active:
                        missions.photoMission.active,

                    completed:
                        missions.photoMission.completed

                }

            }

        };


        localStorage.setItem(
            CONFIG.saveKey,
            JSON.stringify(
                saveData
            )
        );

    } catch (error) {

        console.warn(
            "No se pudo guardar la partida.",
            error
        );

    }

}


/* =====================================================
   CARGAR PARTIDA
===================================================== */

function loadGame() {

    try {

        const saved =
            localStorage.getItem(
                CONFIG.saveKey
            );


        if (!saved) {

            return;

        }


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
                savedObject => {

                    const object =
                        objects.find(
                            item =>
                                item.id ===
                                savedObject.id
                        );


                    if (object) {

                        object.collected =
                            savedObject.collected;

                    }

                }
            );

        }


        if (
            data.missions &&
            data.missions.photoMission
        ) {

            missions
                .photoMission
                .active =
                data.missions
                    .photoMission
                    .active;

            missions
                .photoMission
                .completed =
                data.missions
                    .photoMission
                    .completed;

        }


    } catch (error) {

        console.warn(
            "No se pudo cargar la partida.",
            error
        );

    }

}


/* =====================================================
   JOYSTICK
===================================================== */

function setupTouchControls() {

    const area =
        document.getElementById(
            "joystick-area"
        );

    const base =
        document.getElementById(
            "joystick-base"
        );

    const stick =
        document.getElementById(
            "joystick-stick"
        );


    let pointerId = null;


    function updateJoystick(
        event
    ) {

        const rect =
            base.getBoundingClientRect();


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
            rect.width / 2 -
            stick.offsetWidth / 2;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance >
            maxDistance
        ) {

            dx =
                dx /
                distance *
                maxDistance;

            dy =
                dy /
                distance *
                maxDistance;

        }


        stick.style.transform =
            `translate(
                calc(-50% + ${dx}px),
                calc(-50% + ${dy}px)
            )`;


        input.joystickX =
            dx /
            maxDistance;


        input.joystickY =
            dy /
            maxDistance;

    }


    function resetJoystick() {

        pointerId = null;

        input.joystickActive =
            false;

        input.joystickX = 0;

        input.joystickY = 0;


        stick.style.transform =
            "translate(-50%, -50%)";

    }


    area.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            pointerId =
                event.pointerId;

            input.joystickActive =
                true;

            area.setPointerCapture(
                pointerId
            );

            updateJoystick(
                event
            );

        }
    );


    area.addEventListener(
        "pointermove",
        function(event) {

            if (
                event.pointerId !==
                pointerId
            ) {

                return;

            }

            updateJoystick(
                event
            );

        }
    );


    area.addEventListener(
        "pointerup",
        function(event) {

            if (
                event.pointerId ===
                pointerId
            ) {

                resetJoystick();

            }

        }
    );


    area.addEventListener(
        "pointercancel",
        resetJoystick
    );

}


/* =====================================================
   MUNDO
===================================================== */

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
        850,
        CONFIG.worldWidth,
        180
    );

    ctx.fillRect(
        1500,
        0,
        180,
        CONFIG.worldHeight
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
        CONFIG.worldWidth,
        45
    );


    drawMountains();

    drawTrees();

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
        CONFIG.worldWidth,
        320
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

function drawTrees() {

    trees.forEach(
        tree => {

            drawTree(
                tree[0],
                tree[1]
            );

        }
    );

}


function drawTree(
    x,
    y
) {

    ctx.fillStyle =
        "#65442f";

    ctx.fillRect(
        x - 8,
        y,
        16,
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

            ctx.lineWidth = 3;


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

    buildings.forEach(
        building => {

            /* SOMBRA */

            ctx.fillStyle =
                "rgba(0,0,0,.2)";

            ctx.fillRect(
                building.x + 8,
                building.y + 10,
                building.width,
                building.height
            );


            /* CUERPO */

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
    );

}


/* =====================================================
   NPC
===================================================== */

function drawNPC(
    npc
) {

    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
        npc.x,
        npc.y + 18,
        20,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CUERPO */

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


    /* CABEZA */

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
        npc.y + 42
    );

    ctx.textAlign =
        "left";


    /* MISIÓN */

    if (
        npc.mission
    ) {

        const mission =
            missions.photoMission;


        if (
            !mission.completed
        ) {

            ctx.fillStyle =
                "#f4c542";

            ctx.font =
                "22px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                mission.active
                    ? "?"
                    : "!",
                npc.x,
                npc.y - 48
            );

            ctx.textAlign =
                "left";

        }

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
                    game.time * 0.005
                ) * 3;


            ctx.beginPath();

            ctx.arc(
                object.x,
                object.y - 5,
                18 + pulse,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "rgba(255,220,100,.15)";

            ctx.fill();


            ctx.font =
                "25px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(

                object.type === "photo"
                    ? "📷"
                    : "📜",

                object.x,
                object.y
            );


            ctx.textAlign =
                "left";

        }
    );

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
        "rgba(0,0,0,.25)";

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
   ILUMINACIÓN
===================================================== */

function drawLighting() {

    const cycle =
        (
            Math.sin(
                game.time *
                0.00003
            ) + 1
        ) / 2;


    const alpha =
        cycle * 0.12;


    ctx.fillStyle =
        `rgba(
            20,
            30,
            70,
            ${alpha}
        )`;


    ctx.fillRect(
        0,
        0,
        CONFIG.worldWidth,
        CONFIG.worldHeight
    );

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


    const scaleX =
        width /
        CONFIG.worldWidth;


    const scaleY =
        height /
        CONFIG.worldHeight;


    /* CAMINOS */

    miniCtx.fillStyle =
        "#9e8157";


    miniCtx.fillRect(
        0,
        850 * scaleY,
        width,
        180 * scaleY
    );


    miniCtx.fillRect(
        1500 * scaleX,
        0,
        180 * scaleX,
        height
    );


    /* EDIFICIOS */

    miniCtx.fillStyle =
        "#76594a";


    buildings.forEach(
        building => {

            miniCtx.fillRect(

                building.x * scaleX,

                building.y * scaleY,

                building.width * scaleX,

                building.height * scaleY

            );

        }
    );


    /* NPC */

    miniCtx.fillStyle =
        "#f4c542";


    npcs.forEach(
        npc => {

            miniCtx.beginPath();

            miniCtx.arc(
                npc.x * scaleX,
                npc.y * scaleY,
                2,
                0,
                Math.PI * 2
            );

            miniCtx.fill();

        }
    );


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
   RENDER
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


    drawWorld();

    drawBuildings();

    drawObjects();


    npcs.forEach(
        npc =>
            drawNPC(npc)
    );


    drawPlayer();

    drawLighting();


    ctx.restore();


    drawMinimap();

}


/* =====================================================
   LOOP PRINCIPAL
===================================================== */

function gameLoop(
    timestamp
) {

    if (
        !game.lastFrame
    ) {

        game.lastFrame =
            timestamp;

    }


    game.delta =
        Math.min(
            40,
            timestamp -
            game.lastFrame
        );


    game.lastFrame =
        timestamp;


    game.time =
        timestamp;


    updatePlayer(
        game.delta
    );


    updateCamera();

    updateInteractionHint();

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   INICIO
===================================================== */

init();
```
