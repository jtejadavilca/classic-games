// Tetris Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

// Game constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 24;

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let isPaused = false;
let dropCounter = 0;
let dropInterval = 1000; // ms
let lastTime = 0;

// Tetromino shapes
const SHAPES = {
    I: {
        shape: [[1, 1, 1, 1]],
        color: '#00F0FF'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#FFFF00'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: '#FF00FF'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: '#00FF00'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: '#FF0040'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: '#0000FF'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: '#FF8000'
    }
};

// Initialize the game board
function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

// Create a random piece
function createPiece() {
    const pieces = Object.keys(SHAPES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const pieceData = SHAPES[randomPiece];
    
    return {
        shape: pieceData.shape,
        color: pieceData.color,
        x: Math.floor(COLS / 2) - Math.floor(pieceData.shape[0].length / 2),
        y: 0
    };
}

// Draw a single block
function drawBlock(ctx, x, y, color, blockSize) {
    // Outer block
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    // Inner highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x * blockSize + 2, y * blockSize + 2, blockSize - 4, blockSize - 4);
    
    // Border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    ctx.shadowBlur = 0;
}

// Draw the game board
function drawBoard() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    
    // Draw placed blocks
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(ctx, col, row, board[row][col], BLOCK_SIZE);
            }
        }
    }
}

// Draw the current piece
function drawPiece() {
    if (!currentPiece) return;
    
    currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                drawBlock(ctx, currentPiece.x + dx, currentPiece.y + dy, currentPiece.color, BLOCK_SIZE);
            }
        });
    });
}

// Draw next piece preview
function drawNextPiece() {
    nextCtx.fillStyle = '#050505';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (!nextPiece) return;
    
    const offsetX = (nextCanvas.width / NEXT_BLOCK_SIZE - nextPiece.shape[0].length) / 2;
    const offsetY = (nextCanvas.height / NEXT_BLOCK_SIZE - nextPiece.shape.length) / 2;
    
    nextPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                drawBlock(nextCtx, offsetX + dx, offsetY + dy, nextPiece.color, NEXT_BLOCK_SIZE);
            }
        });
    });
}

// Check collision
function checkCollision(piece, offsetX = 0, offsetY = 0) {
    for (let dy = 0; dy < piece.shape.length; dy++) {
        for (let dx = 0; dx < piece.shape[dy].length; dx++) {
            if (piece.shape[dy][dx]) {
                const newX = piece.x + dx + offsetX;
                const newY = piece.y + dy + offsetY;
                
                // Check boundaries
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                
                // Check collision with placed blocks
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge piece into board
function mergePiece() {
    currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) {
                const boardY = currentPiece.y + dy;
                const boardX = currentPiece.x + dx;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        });
    });
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        // Scoring: 1 line = 100, 2 = 300, 3 = 500, 4 = 800
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] * level;
        
        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        
        updateScore();
    }
}

// Rotate piece
function rotate(piece) {
    const rotated = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
}

// Move piece
function movePiece(direction) {
    if (gameOver || isPaused) return;
    
    const offset = { x: 0, y: 0 };
    
    switch (direction) {
        case 'left':
            offset.x = -1;
            break;
        case 'right':
            offset.x = 1;
            break;
        case 'down':
            offset.y = 1;
            break;
    }
    
    if (!checkCollision(currentPiece, offset.x, offset.y)) {
        currentPiece.x += offset.x;
        currentPiece.y += offset.y;
        
        if (direction === 'down') {
            score += 1;
            updateScore();
        }
    } else if (direction === 'down') {
        // Piece has landed
        mergePiece();
        clearLines();
        spawnNewPiece();
    }
}

// Hard drop
function hardDrop() {
    if (gameOver || isPaused) return;
    
    while (!checkCollision(currentPiece, 0, 1)) {
        currentPiece.y++;
        score += 2;
    }
    
    updateScore();
    mergePiece();
    clearLines();
    spawnNewPiece();
}

// Rotate current piece
function rotatePiece() {
    if (gameOver || isPaused) return;
    
    const rotated = rotate(currentPiece);
    
    if (!checkCollision(rotated)) {
        currentPiece = rotated;
    } else {
        // Try wall kick
        for (let offset = 1; offset <= 2; offset++) {
            if (!checkCollision(rotated, offset, 0)) {
                currentPiece = { ...rotated, x: rotated.x + offset };
                return;
            }
            if (!checkCollision(rotated, -offset, 0)) {
                currentPiece = { ...rotated, x: rotated.x - offset };
                return;
            }
        }
    }
}

// Spawn new piece
function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece();
    
    if (checkCollision(currentPiece)) {
        endGame();
    }
    
    drawNextPiece();
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('lines').textContent = lines;
    document.getElementById('level').textContent = level;
}

// End game
function endGame() {
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Toggle pause
function togglePause() {
    if (gameOver) return;
    isPaused = !isPaused;
    
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = isPaused ? 'REANUDAR' : 'PAUSA';
}

// Game loop
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (!isPaused && !gameOver) {
        dropCounter += deltaTime;
        
        if (dropCounter > dropInterval) {
            movePiece('down');
            dropCounter = 0;
        }
    }
    
    drawBoard();
    drawPiece();
    
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece('right');
            break;
        case 'ArrowDown':
            e.preventDefault();
            movePiece('down');
            dropCounter = 0;
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotatePiece();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
        case 'p':
        case 'P':
            e.preventDefault();
            togglePause();
            break;
    }
});

// Button controls
document.getElementById('pauseButton').addEventListener('click', togglePause);
document.getElementById('restartButton').addEventListener('click', () => {
    location.reload();
});

// Initialize game
function init() {
    createBoard();
    currentPiece = createPiece();
    nextPiece = createPiece();
    drawNextPiece();
    updateScore();
    gameLoop();
}

// Start the game
init();
