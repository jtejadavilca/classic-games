// Pong Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const winScore = 11;

let player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6,
    score: 0
};

let ai = {
    x: canvas.width - 30,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 2.5,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 4,
    dy: 4,
    size: ballSize,
    speed: 4
};

let keys = {};
let gameOver = false;
let isPaused = false;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawNet() {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawScore() {
    ctx.fillStyle = '#00F0FF';
    ctx.font = '48px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(player.score, canvas.width / 4, 60);
    ctx.fillText(ai.score, (canvas.width * 3) / 4, 60);
}

function draw() {
    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Net
    drawNet();

    // Paddles
    drawRect(player.x, player.y, player.width, player.height, '#00FF00');
    drawRect(ai.x, ai.y, ai.width, ai.height, '#FF00FF');

    // Ball
    drawCircle(ball.x, ball.y, ball.size, '#FFFF00');

    // Score
    drawScore();

    // Paused text
    if (isPaused) {
        ctx.fillStyle = '#00F0FF';
        ctx.font = '36px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSA', canvas.width / 2, canvas.height / 2);
    }
}

function update() {
    if (gameOver || isPaused) return;

    // Player movement
    if (keys['w'] || keys['W']) {
        player.y -= player.speed;
    }
    if (keys['s'] || keys['S']) {
        player.y += player.speed;
    }

    // Keep player paddle in bounds
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // AI movement
    const aiCenter = ai.y + ai.height / 2;
    const ballCenter = ball.y;
    
    if (aiCenter < ballCenter - 35) {
        ai.y += ai.speed;
    } else if (aiCenter > ballCenter + 35) {
        ai.y -= ai.speed;
    }

    // Keep AI paddle in bounds
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if (ball.y - ball.size <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with player paddle
    if (ball.x - ball.size <= player.x + player.width &&
        ball.y >= player.y &&
        ball.y <= player.y + player.height) {
        
        ball.dx = Math.abs(ball.dx);
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.dy = hitPos * 5;
        ball.dx += 0.5;
    }

    // Ball collision with AI paddle
    if (ball.x + ball.size >= ai.x &&
        ball.y >= ai.y &&
        ball.y <= ai.y + ai.height) {
        
        ball.dx = -Math.abs(ball.dx);
        const hitPos = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
        ball.dy = hitPos * 5;
        ball.dx -= 0.5;
    }

    // Ball out of bounds (scoring)
    if (ball.x - ball.size <= 0) {
        ai.score++;
        resetBall();
        checkWin();
    } else if (ball.x + ball.size >= canvas.width) {
        player.score++;
        resetBall();
        checkWin();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.dy = (Math.random() * 2 - 1) * 4;
}

function checkWin() {
    if (player.score >= winScore || ai.score >= winScore) {
        gameOver = true;
        const winner = player.score >= winScore ? 'JUGADOR' : 'CPU';
        document.getElementById('gameOverTitle').textContent = winner + ' GANÓ';
        document.getElementById('finalScore').textContent = player.score + ' - ' + ai.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
        if (!gameOver) {
            isPaused = !isPaused;
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

// Start game
gameLoop();
