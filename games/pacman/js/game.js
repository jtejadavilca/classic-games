// Pac-Man Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const TILE_SIZE = 20;
const COLS = 28;
const ROWS = 31;

// Simplified maze (1 = wall, 0 = path, 2 = pellet, 3 = power pellet)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Game state
let pacman = { x: 14, y: 23, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, speed: 0.15 };
let ghosts = [
    { x: 12, y: 14, color: '#FF0000', mode: 'chase' }, // Blinky (red)
    { x: 14, y: 14, color: '#FFB8FF', mode: 'chase' }, // Pinky (pink)
    { x: 15, y: 14, color: '#00FFFF', mode: 'chase' }, // Inky (cyan)
    { x: 13, y: 14, color: '#FFB851', mode: 'chase' }  // Clyde (orange)
];
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;
let powerMode = false;
let powerModeTimer = 0;
let totalPellets = 0;
let pelletsEaten = 0;

// Count pellets
function countPellets() {
    totalPellets = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 2 || maze[row][col] === 3) {
                totalPellets++;
            }
        }
    }
}

// Draw maze
function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;
            
            if (maze[row][col] === 1) {
                // Wall
                ctx.fillStyle = '#0000AA';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#0066FF';
                ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (maze[row][col] === 2) {
                // Pellet
                ctx.fillStyle = '#FFB8FF';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (maze[row][col] === 3) {
                // Power pellet
                ctx.fillStyle = '#FFB8FF';
                ctx.shadowColor = '#FFB8FF';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
}

// Draw Pac-Man
function drawPacman() {
    const x = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const y = pacman.y * TILE_SIZE + TILE_SIZE / 2;
    
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, TILE_SIZE / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        const x = ghost.x * TILE_SIZE + TILE_SIZE / 2;
        const y = ghost.y * TILE_SIZE + TILE_SIZE / 2;
        
        ctx.fillStyle = powerMode ? '#0000FF' : ghost.color;
        ctx.shadowColor = powerMode ? '#0000FF' : ghost.color;
        ctx.shadowBlur = 10;
        
        // Body
        ctx.beginPath();
        ctx.arc(x, y - 3, TILE_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(x + TILE_SIZE / 2 - 2, y + TILE_SIZE / 2);
        ctx.lineTo(x, y + 2);
        ctx.lineTo(x - TILE_SIZE / 2 + 2, y + TILE_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        if (!powerMode) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x - 4, y - 6, 3, 5);
            ctx.fillRect(x + 1, y - 6, 3, 5);
        }
        
        ctx.shadowBlur = 0;
    });
}

// Check collision with wall
function isWall(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
    return maze[Math.floor(y)][Math.floor(x)] === 1;
}

// Move Pac-Man
function movePacman() {
    // Try to change direction
    const nextX = pacman.x + pacman.nextDir.x * pacman.speed;
    const nextY = pacman.y + pacman.nextDir.y * pacman.speed;
    
    if (!isWall(nextX, nextY)) {
        pacman.dir = { ...pacman.nextDir };
    }
    
    // Move in current direction
    const newX = pacman.x + pacman.dir.x * pacman.speed;
    const newY = pacman.y + pacman.dir.y * pacman.speed;
    
    if (!isWall(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        
        // Wrap around edges
        if (pacman.x < 0) pacman.x = COLS - 1;
        if (pacman.x >= COLS) pacman.x = 0;
        
        // Check pellet collision
        const gridX = Math.floor(pacman.x);
        const gridY = Math.floor(pacman.y);
        
        if (maze[gridY][gridX] === 2) {
            maze[gridY][gridX] = 0;
            score += 10;
            pelletsEaten++;
            updateScore();
        } else if (maze[gridY][gridX] === 3) {
            maze[gridY][gridX] = 0;
            score += 50;
            pelletsEaten++;
            powerMode = true;
            powerModeTimer = 200; // ~6 seconds
            updateScore();
        }
        
        // Check win
        if (pelletsEaten >= totalPellets) {
            nextLevel();
        }
    }
}

// Simple ghost AI
function moveGhosts() {
    ghosts.forEach(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        
        let moveX = 0, moveY = 0;
        
        if (powerMode) {
            // Run away from Pac-Man
            moveX = dx > 0 ? -1 : dx < 0 ? 1 : 0;
            moveY = dy > 0 ? -1 : dy < 0 ? 1 : 0;
        } else {
            // Chase Pac-Man
            moveX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
            moveY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        }
        
        // Try to move
        const speed = 0.08;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (!isWall(ghost.x + moveX * speed, ghost.y)) {
                ghost.x += moveX * speed;
            } else if (!isWall(ghost.x, ghost.y + moveY * speed)) {
                ghost.y += moveY * speed;
            }
        } else {
            if (!isWall(ghost.x, ghost.y + moveY * speed)) {
                ghost.y += moveY * speed;
            } else if (!isWall(ghost.x + moveX * speed, ghost.y)) {
                ghost.x += moveX * speed;
            }
        }
    });
}

// Check ghost collisions
function checkGhostCollisions() {
    ghosts.forEach((ghost, index) => {
        const dist = Math.sqrt(Math.pow(pacman.x - ghost.x, 2) + Math.pow(pacman.y - ghost.y, 2));
        if (dist < 0.5) {
            if (powerMode) {
                // Eat ghost
                score += 200;
                ghost.x = 14;
                ghost.y = 14;
                updateScore();
            } else {
                // Lose life
                loseLife();
            }
        }
    });
}

// Update functions
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

function updateLives() {
    document.getElementById('lives').textContent = lives;
    const livesDisplay = document.getElementById('livesDisplay');
    livesDisplay.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const pacIcon = document.createElement('span');
        pacIcon.textContent = '🟡';
        pacIcon.style.fontSize = '1.5rem';
        livesDisplay.appendChild(pacIcon);
    }
}

function loseLife() {
    lives--;
    updateLives();
    
    if (lives <= 0) {
        endGame();
    } else {
        // Reset positions
        pacman.x = 14;
        pacman.y = 23;
        pacman.dir = { x: 0, y: 0 };
        ghosts.forEach((ghost, i) => {
            ghost.x = 12 + i;
            ghost.y = 14;
        });
    }
}

function nextLevel() {
    level++;
    pelletsEaten = 0;
    pacman.speed += 0.02;
    
    // Reset maze
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 0) {
                // Restore pellets (simplified)
                if (Math.random() > 0.3) {
                    maze[row][col] = 2;
                }
            }
        }
    }
    
    countPellets();
    updateScore();
}

function endGame() {
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Game loop
function gameLoop() {
    if (gameOver) return;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawMaze();
    drawGhosts();
    drawPacman();
    
    movePacman();
    moveGhosts();
    checkGhostCollisions();
    
    // Power mode timer
    if (powerMode) {
        powerModeTimer--;
        if (powerModeTimer <= 0) {
            powerMode = false;
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            pacman.nextDir = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            e.preventDefault();
            pacman.nextDir = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            e.preventDefault();
            pacman.nextDir = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            e.preventDefault();
            pacman.nextDir = { x: 1, y: 0 };
            break;
    }
});

document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

// Initialize
countPellets();
updateScore();
updateLives();
gameLoop();
