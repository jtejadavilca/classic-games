// Snake Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRID_SIZE = 25;
const TILE_COUNT = canvas.width / GRID_SIZE;

// Game state
let snake = [{ x: 10, y: 10 }];
let dx = 1;
let dy = 0;
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameOver = false;
let gameSpeed = 100;
let lastRenderTime = 0;
let nextDirection = { dx: 1, dy: 0 };

// Update high score display
document.getElementById('highScore').textContent = highScore;

// Draw functions
function drawSnake() {
    snake.forEach((segment, index) => {
        // Head is brighter
        const color = index === 0 ? '#00FF00' : '#00AA00';
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
        
        // Eyes on head
        if (index === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 5, 4, 4);
            ctx.fillRect(segment.x * GRID_SIZE + 14, segment.y * GRID_SIZE + 5, 4, 4);
        }
    });
    ctx.shadowBlur = 0;
}

function drawFood() {
    ctx.fillStyle = '#FF0040';
    ctx.shadowColor = '#FF0040';
    ctx.shadowBlur = 15;
    ctx.fillRect(
        food.x * GRID_SIZE + 1,
        food.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
    );
    ctx.shadowBlur = 0;
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid();

    // Draw food
    drawFood();

    // Draw snake
    drawSnake();
}

function update() {
    if (gameOver) return;

    // Apply queued direction change
    dx = nextDirection.dx;
    dy = nextDirection.dy;

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        spawnFood();
        // Increase speed slightly
        gameSpeed = Math.max(50, gameSpeed - 2);
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('length').textContent = snake.length;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

function endGame() {
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Game loop
function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);

    const timeSinceLastRender = currentTime - lastRenderTime;
    
    if (timeSinceLastRender < gameSpeed) return;

    lastRenderTime = currentTime;

    update();
    draw();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            if (dy === 0) {
                nextDirection = { dx: 0, dy: -1 };
            }
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (dy === 0) {
                nextDirection = { dx: 0, dy: 1 };
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (dx === 0) {
                nextDirection = { dx: -1, dy: 0 };
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (dx === 0) {
                nextDirection = { dx: 1, dy: 0 };
            }
            break;
    }
});

// Restart button
document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

// Initialize
updateScore();
gameLoop(0);
