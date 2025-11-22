// Frog Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const TILE_SIZE = 40;
const COLS = 13;
const ROWS = 15;
const FROG_START_X = 6;
const FROG_START_Y = 14;

// Game state
let frog = { x: FROG_START_X, y: FROG_START_Y };
let score = 0;
let lives = 3;
let level = 1;
let time = 60;
let gameOver = false;
let gameWon = false;
let homeSlots = [false, false, false, false, false];
let frogsHome = 0;

// Obstacles and platforms
let cars = [];
let logs = [];
let turtles = [];

// Timer
let timerInterval;

// Lane definitions
const lanes = [
    { y: 13, type: 'safe' },   // Start
    { y: 12, type: 'road', speed: 2, direction: 1 },
    { y: 11, type: 'road', speed: 1.5, direction: -1 },
    { y: 10, type: 'road', speed: 2.5, direction: 1 },
    { y: 9, type: 'road', speed: 1.8, direction: -1 },
    { y: 8, type: 'road', speed: 2.2, direction: 1 },
    { y: 7, type: 'safe' },    // Middle safe zone
    { y: 6, type: 'water', speed: 1.5, direction: -1, platform: 'log', length: 3 },
    { y: 5, type: 'water', speed: 2, direction: 1, platform: 'turtle', length: 2 },
    { y: 4, type: 'water', speed: 1.3, direction: -1, platform: 'log', length: 4 },
    { y: 3, type: 'water', speed: 2.2, direction: 1, platform: 'turtle', length: 3 },
    { y: 2, type: 'water', speed: 1.7, direction: -1, platform: 'log', length: 3 },
    { y: 1, type: 'goal' },
    { y: 0, type: 'safe' }     // Top
];

// Initialize obstacles
function initObstacles() {
    cars = [];
    logs = [];
    turtles = [];

    lanes.forEach(lane => {
        if (lane.type === 'road') {
            const numCars = 3 + Math.floor(Math.random() * 2);
            for (let i = 0; i < numCars; i++) {
                cars.push({
                    x: (i * COLS / numCars) * TILE_SIZE,
                    y: lane.y,
                    speed: lane.speed * level * 0.3,
                    direction: lane.direction,
                    width: TILE_SIZE * (1 + Math.random() * 0.5),
                    color: ['#FF0040', '#FF8000', '#FFFF00', '#00F0FF'][Math.floor(Math.random() * 4)]
                });
            }
        } else if (lane.type === 'water') {
            const numPlatforms = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < numPlatforms; i++) {
                const platform = {
                    x: (i * COLS / numPlatforms) * TILE_SIZE,
                    y: lane.y,
                    speed: lane.speed * level * 0.3,
                    direction: lane.direction,
                    length: lane.length
                };

                if (lane.platform === 'log') {
                    logs.push(platform);
                } else {
                    turtles.push(platform);
                }
            }
        }
    });
}

// Draw frog
function drawFrog() {
    ctx.fillStyle = '#00FF00';
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 10;
    
    const x = frog.x * TILE_SIZE;
    const y = frog.y * TILE_SIZE;
    
    // Body
    ctx.fillRect(x + 8, y + 8, 24, 24);
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 10, y + 10, 6, 6);
    ctx.fillRect(x + 24, y + 10, 6, 6);
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 12, y + 12, 3, 3);
    ctx.fillRect(x + 26, y + 12, 3, 3);
    
    ctx.shadowBlur = 0;
}

// Draw game board
function drawBoard() {
    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    lanes.forEach(lane => {
        const y = lane.y * TILE_SIZE;
        
        if (lane.type === 'road') {
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, y, canvas.width, TILE_SIZE);
            // Road markings
            ctx.fillStyle = '#FFFF00';
            for (let i = 0; i < COLS; i += 2) {
                ctx.fillRect(i * TILE_SIZE + 15, y + 18, 10, 4);
            }
        } else if (lane.type === 'water') {
            ctx.fillStyle = '#0066CC';
            ctx.fillRect(0, y, canvas.width, TILE_SIZE);
            // Water ripples
            ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
            for (let i = 0; i < COLS; i++) {
                ctx.fillRect(i * TILE_SIZE + Math.sin(Date.now() / 200 + i) * 5, y + 10, 15, 2);
            }
        } else if (lane.type === 'safe') {
            ctx.fillStyle = '#1a4d1a';
            ctx.fillRect(0, y, canvas.width, TILE_SIZE);
        } else if (lane.type === 'goal') {
            ctx.fillStyle = '#003300';
            ctx.fillRect(0, y, canvas.width, TILE_SIZE);
            // Draw home slots
            const slotPositions = [1, 3, 5, 7, 9, 11];
            slotPositions.forEach((pos, idx) => {
                if (idx < 5) {
                    ctx.fillStyle = homeSlots[idx] ? '#00FF00' : '#006600';
                    ctx.fillRect(pos * TILE_SIZE, y, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(pos * TILE_SIZE, y, TILE_SIZE, TILE_SIZE);
                }
            });
        }
    });
}

// Draw cars
function drawCars() {
    cars.forEach(car => {
        ctx.fillStyle = car.color;
        ctx.shadowColor = car.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(car.x, car.y * TILE_SIZE + 10, car.width, 20);
        // Headlights/taillights
        ctx.fillStyle = '#FFFFFF';
        const lightX = car.direction > 0 ? car.x + car.width - 5 : car.x;
        ctx.fillRect(lightX, car.y * TILE_SIZE + 12, 3, 6);
        ctx.fillRect(lightX, car.y * TILE_SIZE + 22, 3, 6);
        ctx.shadowBlur = 0;
    });
}

// Draw logs and turtles
function drawPlatforms() {
    logs.forEach(log => {
        ctx.fillStyle = '#8B4513';
        ctx.shadowColor = '#8B4513';
        ctx.shadowBlur = 5;
        ctx.fillRect(log.x, log.y * TILE_SIZE + 10, log.length * TILE_SIZE, 20);
        ctx.shadowBlur = 0;
    });

    turtles.forEach(turtle => {
        ctx.fillStyle = '#00AA00';
        for (let i = 0; i < turtle.length; i++) {
            ctx.shadowColor = '#00AA00';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.ellipse(turtle.x + i * TILE_SIZE + 20, turtle.y * TILE_SIZE + 20, 15, 12, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    });
}

// Update game objects
function update(deltaTime) {
    if (gameOver || gameWon) return;

    // Update cars
    cars.forEach(car => {
        car.x += car.speed * car.direction;
        if (car.direction > 0 && car.x > canvas.width) {
            car.x = -car.width;
        } else if (car.direction < 0 && car.x < -car.width) {
            car.x = canvas.width;
        }
    });

    // Update logs and turtles
    [...logs, ...turtles].forEach(platform => {
        platform.x += platform.speed * platform.direction;
        if (platform.direction > 0 && platform.x > canvas.width) {
            platform.x = -platform.length * TILE_SIZE;
        } else if (platform.direction < 0 && platform.x < -platform.length * TILE_SIZE) {
            platform.x = canvas.width;
        }
    });

    // If frog is on water, move with platform
    const currentLane = lanes.find(l => l.y === frog.y);
    if (currentLane && currentLane.type === 'water') {
        let onPlatform = false;
        
        [...logs, ...turtles].forEach(platform => {
            if (platform.y === frog.y) {
                const platformStart = platform.x;
                const platformEnd = platform.x + platform.length * TILE_SIZE;
                const frogStart = frog.x * TILE_SIZE;
                const frogEnd = frogStart + TILE_SIZE;
                
                if (frogStart < platformEnd && frogEnd > platformStart) {
                    onPlatform = true;
                    frog.x += (platform.speed * platform.direction) / TILE_SIZE;
                }
            }
        });

        if (!onPlatform || frog.x < 0 || frog.x >= COLS) {
            loseLife();
        }
    }

    // Check collision with cars
    cars.forEach(car => {
        if (car.y === frog.y) {
            const frogStart = frog.x * TILE_SIZE;
            const frogEnd = frogStart + TILE_SIZE;
            
            if (frogStart < car.x + car.width && frogEnd > car.x) {
                loseLife();
            }
        }
    });
}

// Move frog
function moveFrog(dx, dy) {
    if (gameOver || gameWon) return;

    const newX = frog.x + dx;
    const newY = frog.y + dy;

    if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
        frog.x = newX;
        frog.y = newY;

        // Score for moving forward
        if (dy < 0) {
            score += 10;
            updateScore();
        }

        // Check if reached goal
        if (newY === 1) {
            checkGoal();
        }
    }
}

// Check if frog reached goal
function checkGoal() {
    const slotPositions = [1, 3, 5, 7, 9];
    let foundSlot = false;

    slotPositions.forEach((pos, idx) => {
        if (frog.x === pos && !homeSlots[idx]) {
            homeSlots[idx] = true;
            frogsHome++;
            score += 100;
            foundSlot = true;
            resetFrog();

            if (frogsHome >= 5) {
                winLevel();
            }
        }
    });

    if (!foundSlot) {
        loseLife();
    }
}

// Reset frog position
function resetFrog() {
    frog.x = FROG_START_X;
    frog.y = FROG_START_Y;
}

// Lose a life
function loseLife() {
    lives--;
    updateLives();
    resetFrog();

    if (lives <= 0) {
        endGame();
    }
}

// Win level
function winLevel() {
    gameWon = true;
    clearInterval(timerInterval);
    score += time * 10;
    level++;
    
    setTimeout(() => {
        homeSlots = [false, false, false, false, false];
        frogsHome = 0;
        time = 60;
        gameWon = false;
        resetFrog();
        initObstacles();
        startTimer();
        updateScore();
    }, 2000);
}

// End game
function endGame() {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverTitle').textContent = 'GAME OVER';
    document.getElementById('gameOver').classList.remove('hidden');
}

// Update displays
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

function updateLives() {
    document.getElementById('lives').textContent = lives;
    const livesDisplay = document.getElementById('livesDisplay');
    livesDisplay.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const frogIcon = document.createElement('span');
        frogIcon.textContent = '🐸';
        frogIcon.style.fontSize = '1.5rem';
        livesDisplay.appendChild(frogIcon);
    }
}

function updateTime() {
    document.getElementById('time').textContent = time;
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (!gameOver && !gameWon) {
            time--;
            updateTime();
            if (time <= 0) {
                loseLife();
                time = 60;
            }
        }
    }, 1000);
}

// Game loop
function gameLoop() {
    drawBoard();
    drawPlatforms();
    drawCars();
    drawFrog();
    update(1/60);
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            moveFrog(0, -1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveFrog(0, 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            moveFrog(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveFrog(1, 0);
            break;
    }
});

// Restart button
document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

// Initialize game
function init() {
    initObstacles();
    updateScore();
    updateLives();
    updateTime();
    startTimer();
    gameLoop();
}

init();
