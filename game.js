const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 700;

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

const player = {
    x: 600,
    y: 350,
    size: 28,
    speed: 4
};

const npcs = [
    {
        x: 450,
        y: 300,
        name: "Don Pedro",
        text: "Bienvenido al Chañar. Este pueblo guarda muchas historias."
    },
    {
        x: 800,
        y: 420,
        name: "María",
        text: "Dicen que si buscás bien, todavía quedan recuerdos del viejo Chañar."
    }
];

function drawBackground() {

    // Tierra
    ctx.fillStyle = "#c8a875";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Camino principal
    ctx.fillStyle = "#9c8057";
    ctx.fillRect(0, 310, canvas.width, 120);

    // Camino vertical
    ctx.fillRect(540, 0, 120, canvas.height);

    // Plaza
    ctx.fillStyle = "#769b58";
    ctx.fillRect(480, 250, 240, 200);

    // Árboles
    drawTree(100, 100);
    drawTree(1050, 120);
    drawTree(180, 550);
    drawTree(1000, 560);

    // Viñedos
    drawVineyard(850, 100);

    // Edificios
    drawBuilding(100, 250, 150, 100, "#b66d4a", "ESCUELA");

    drawBuilding(850, 350, 180, 110, "#806b58", "RADIO");

    drawBuilding(80, 420, 150, 100, "#a88c72", "CASA");

}

function drawBuilding(x, y, w, h, color, name) {

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#60483c";
    ctx.fillRect(x + 20, y + 35, 35, 45);

    ctx.fillRect(x + w - 55, y + 35, 35, 45);

    ctx.fillStyle = "#3c2923";

    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + w / 2, y - 45);
    ctx.lineTo(x + w + 10, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(name, x + 15, y + h + 22);
}

function drawTree(x, y) {

    ctx.fillStyle = "#69452e";
    ctx.fillRect(x - 8, y, 16, 40);

    ctx.fillStyle = "#476d3a";

    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
}

function drawVineyard(x, y) {

    for (let row = 0; row < 6; row++) {

        for (let plant = 0; plant < 7; plant++) {

            const px = x + plant * 30;
            const py = y + row * 35;

            ctx.fillStyle = "#385c35";
            ctx.fillRect(px, py, 7, 22);

            ctx.fillStyle = "#547b43";
            ctx.beginPath();
            ctx.arc(px + 3, py, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("VIÑEDOS", x, y - 15);
}

function drawPlayer() {

    ctx.fillStyle = "#222";

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e0b08a";

    ctx.beginPath();
    ctx.arc(player.x, player.y - 18, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#333";
    ctx.fillRect(player.x - 12, player.y - 8, 24, 30);
}

function drawNPC(npc) {

    ctx.fillStyle = "#6b3f65";

    ctx.beginPath();
    ctx.arc(npc.x, npc.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f0c09a";

    ctx.beginPath();
    ctx.arc(npc.x, npc.y - 20, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(npc.name, npc.x - 35, npc.y + 35);
}

function movePlayer() {

    if (keys["arrowup"] || keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["arrowdown"] || keys["s"]) {
        player.y += player.speed;
    }

    if (keys["arrowleft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        player.x += player.speed;
    }

    player.x = Math.max(15, Math.min(canvas.width - 15, player.x));
    player.y = Math.max(15, Math.min(canvas.height - 15, player.y));
}

function distance(a, b) {

    return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2)
    );
}

function checkNPCInteraction() {

    for (const npc of npcs) {

        if (distance(player, npc) < 50) {

            showDialogue(
                npc.name,
                npc.text
            );

            break;
        }
    }
}

function showDialogue(name, text) {

    const dialogue = document.getElementById("dialogue");
    const dialogueText = document.getElementById("dialogue-text");

    dialogueText.innerHTML =
        "<strong>" + name + "</strong><br><br>" + text;

    dialogue.classList.remove("hidden");
}

document
    .getElementById("close-dialogue")
    .addEventListener("click", () => {

        document
            .getElementById("dialogue")
            .classList.add("hidden");

    });

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "e") {

        checkNPCInteraction();

    }

});

function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    movePlayer();

    drawBackground();

    for (const npc of npcs) {
        drawNPC(npc);
    }

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
