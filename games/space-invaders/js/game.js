// Space Invaders Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let player = { x: 275, y: 550, width: 50, height: 30, speed: 5 };
let bullets = [];
let aliens = [];
let alienBullets = [];
let shields = [];
let score = 0;
let highScore = 0;
let lives = 3;
let wave = 1;
let gameOver = false;
let alienDirection = 1;
let alienSpeed = 0.5;
let alienDropDistance = 20;

// Controls
let keys = {};

// Initialize aliens
function createAliens() {
    aliens = [];
    const rows = 5;
    const cols = 11;
    const alienWidth = 30;
    const alienHeight = 20;
    const padding = 10;
    const offsetX = 50;
    const offsetY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            aliens.push({
                x: offsetX + col * (alienWidth + padding),
                y: offsetY + row * (alienHeight + padding),
                width: alienWidth,
                height: alienHeight,
                alive: true,
                points: row < 2 ? 30 : row < 4 ? 20 : 10,
                color: row < 2 ? '#FF00FF' : row < 4 ? '#00F0FF' : '#00FF00'
            });
        }
    }
}

// Initialize shields
function createShields() {
    shields = [];
    const shieldWidth = 60;
    const shieldHeight = 40;
    const shieldY = 480;
    const spacing = 120;
    
    for (let i = 0; i < 4; i++) {
        const shield = {
            x: 70 + i * spacing,
            y: shieldY,
            width: shieldWidth,
            height: shieldHeight,
            blocks: []
        };
        
        // Create shield blocks
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 6; x++) {
                shield.blocks.push({
                    x: shield.x + x * 10,
                    y: shield.y + y * 10,
                    size: 10,
                    active: true
                });
            }
        }
        shields.push(shield);
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = '#00FF00';
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 10;
    
    // Ship body
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Cannon
    ctx.fillRect(player.x + player.width / 2 - 5, player.y - 10, 10, 10);
    ctx.shadowBlur = 0;
}

// Draw aliens
function drawAliens() {
    aliens.forEach(alien => {
        if (alien.alive) {
            ctx.fillStyle = alien.color;
            ctx.shadowColor = alien.color;
            ctx.shadowBlur = 5;
            
            // Simple alien shape
            ctx.fillRect(alien.x + 5, alien.y, alien.width - 10, alien.height);
            ctx.fillRect(alien.x, alien.y + 5, alien.width, alien.height - 10);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(alien.x + 8, alien.y + 6, 5, 5);
            ctx.fillRect(alien.x + alien.width - 13, alien.y + 6, 5, 5);
            
            ctx.shadowBlur = 0;
        }
    });
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 10;
    
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 3, 10);
    });
    
    ctx.fillStyle = '#FF0040';
    ctx.shadowColor = '#FF0040';
    alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 3, 10);
    });
    
    ctx.shadowBlur = 0;
}

// Draw shields
function drawShields() {
    ctx.fillStyle = '#00F0FF';
    shields.forEach(shield => {
        shield.blocks.forEach(block => {
            if (block.active) {
                ctx.fillRect(block.x, block.y, block.size, block.size);
            }
        });
    });
}

// Update game
function update() {
    if (gameOver) return;

    // Move player
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Move bullets
    bullets = bullets.filter(bullet => {
        bullet.y -= 5;
        return bullet.y > 0;
    });

    // Move alien bullets
    alienBullets = alienBullets.filter(bullet => {
        bullet.y += 3;
        return bullet.y < canvas.height;
    });

    // Move aliens
    let shouldDrop = false;
    let edgeReached = false;

    aliens.forEach(alien => {
        if (alien.alive) {
            alien.x += alienSpeed * alienDirection;
            
            if (alien.x <= 0 || alien.x >= canvas.width - alien.width) {
                edgeReached = true;
            }
        }
    });

    if (edgeReached) {
        alienDirection *= -1;
        aliens.forEach(alien => {
            if (alien.alive) {
                alien.y += alienDropDistance;
                if (alien.y + alien.height >= player.y) {
                    endGame();
                }
            }
        });
    }

    // Aliens shoot randomly
    if (Math.random() < 0.01) {
        const aliveAliens = aliens.filter(a => a.alive);
        if (aliveAliens.length > 0) {
            const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            alienBullets.push({
                x: shooter.x + shooter.width / 2,
                y: shooter.y + shooter.height
            });
        }
    }

    // Check bullet-alien collisions
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach(alien => {
            if (alien.alive &&
                bullet.x >= alien.x &&
                bullet.x <= alien.x + alien.width &&
                bullet.y >= alien.y &&
                bullet.y <= alien.y + alien.height) {
                alien.alive = false;
                bullets.splice(bIndex, 1);
                score += alien.points;
                updateScore();
            }
        });
    });

    // Check bullet-shield collisions
    [...bullets, ...alienBullets].forEach((bullet, bIndex, arr) => {
        shields.forEach(shield => {
            shield.blocks.forEach(block => {
                if (block.active &&
                    bullet.x >= block.x &&
                    bullet.x <= block.x + block.size &&
                    bullet.y >= block.y &&
                    bullet.y <= block.y + block.size) {
                    block.active = false;
                    arr.splice(bIndex, 1);
                }
            });
        });
    });

    // Check alien bullet-player collision
    alienBullets.forEach((bullet, index) => {
        if (bullet.x >= player.x &&
            bullet.x <= player.x + player.width &&
            bullet.y >= player.y &&
            bullet.y <= player.y + player.height) {
            alienBullets.splice(index, 1);
            loseLife();
        }
    });

    // Check if all aliens destroyed
    if (aliens.every(a => !a.alive)) {
        nextWave();
    }
}

// Draw everything
function draw() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 53) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }

    drawShields();
    drawPlayer();
    drawAliens();
    drawBullets();
}

// Shoot bullet
function shoot() {
    if (bullets.length < 3) {
        bullets.push({
            x: player.x + player.width / 2,
            y: player.y
        });
    }
}

// Lose life
function loseLife() {
    lives--;
    updateLives();
    if (lives <= 0) {
        endGame();
    }
}

// Next wave
function nextWave() {
    wave++;
    alienSpeed += 0.2;
    createAliens();
    bullets = [];
    alienBullets = [];
    updateScore();
}

// End game
function endGame() {
    gameOver = true;
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
    }
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Update displays
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('wave').textContent = wave;
}

function updateLives() {
    document.getElementById('lives').textContent = lives;
    const livesDisplay = document.getElementById('livesDisplay');
    livesDisplay.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const shipIcon = document.createElement('span');
        shipIcon.textContent = '🚀';
        shipIcon.style.fontSize = '1.5rem';
        livesDisplay.appendChild(shipIcon);
    }
}

// Game loop
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
        if (!gameOver) shoot();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Restart
document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

// Initialize
function init() {
    createAliens();
    createShields();
    updateScore();
    updateLives();
    gameLoop();
}

init();
