// Minesweeper Game Logic
const board = document.getElementById('gameBoard');
const minesLeftDisplay = document.getElementById('minesLeft');
const timerDisplay = document.getElementById('timer');
const gameOverDiv = document.getElementById('gameOver');
const gameOverTitle = document.getElementById('gameOverTitle');
const finalTimeDisplay = document.getElementById('finalTime');

// Game settings
const ROWS = 9;
const COLS = 9;
const MINES = 10;

// Game state
let grid = [];
let gameStarted = false;
let gameOver = false;
let timer = 0;
let timerInterval = null;
let minesLeft = MINES;
let cellsRevealed = 0;

// Initialize game
function initGame() {
    grid = [];
    gameStarted = false;
    gameOver = false;
    timer = 0;
    minesLeft = MINES;
    cellsRevealed = 0;
    
    clearInterval(timerInterval);
    timerDisplay.textContent = '0';
    minesLeftDisplay.textContent = MINES;
    gameOverDiv.classList.add('hidden');
    
    createGrid();
    renderBoard();
}

// Create grid structure
function createGrid() {
    for (let row = 0; row < ROWS; row++) {
        grid[row] = [];
        for (let col = 0; col < COLS; col++) {
            grid[row][col] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
                row,
                col
            };
        }
    }
}

// Place mines randomly (after first click)
function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;
    
    while (minesPlaced < MINES) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        
        // Don't place mine on first click or if already a mine
        if ((row === firstRow && col === firstCol) || grid[row][col].isMine) {
            continue;
        }
        
        grid[row][col].isMine = true;
        minesPlaced++;
    }
    
    calculateAdjacentMines();
}

// Calculate adjacent mines for all cells
function calculateAdjacentMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (!grid[row][col].isMine) {
                grid[row][col].adjacentMines = countAdjacentMines(row, col);
            }
        }
    }
}

// Count mines around a cell
function countAdjacentMines(row, col) {
    let count = 0;
    
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (grid[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    
    return count;
}

// Render the board
function renderBoard() {
    board.innerHTML = '';
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const cellData = grid[row][col];
            
            if (cellData.isRevealed) {
                cell.classList.add('revealed');
                if (cellData.isMine) {
                    cell.textContent = '💣';
                    cell.classList.add('mine');
                } else if (cellData.adjacentMines > 0) {
                    cell.textContent = cellData.adjacentMines;
                    cell.dataset.count = cellData.adjacentMines;
                }
            } else if (cellData.isFlagged) {
                cell.classList.add('flagged');
            }
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            cell.addEventListener('contextmenu', (e) => handleRightClick(e, row, col));
            
            board.appendChild(cell);
        }
    }
}

// Handle cell click (reveal)
function handleCellClick(row, col) {
    if (gameOver || grid[row][col].isRevealed || grid[row][col].isFlagged) {
        return;
    }
    
    // First click: place mines and start timer
    if (!gameStarted) {
        gameStarted = true;
        placeMines(row, col);
        startTimer();
    }
    
    const cell = grid[row][col];
    
    if (cell.isMine) {
        // Game over - hit a mine
        revealAllMines();
        endGame(false);
    } else {
        // Reveal cell
        revealCell(row, col);
        checkWin();
    }
}

// Reveal a single cell (and adjacent if empty)
function revealCell(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return;
    }
    
    const cell = grid[row][col];
    
    if (cell.isRevealed || cell.isFlagged || cell.isMine) {
        return;
    }
    
    cell.isRevealed = true;
    cellsRevealed++;
    
    // If empty (no adjacent mines), reveal neighbors recursively
    if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                revealCell(row + dr, col + dc);
            }
        }
    }
    
    renderBoard();
}

// Handle right click (flag)
function handleRightClick(e, row, col) {
    e.preventDefault();
    
    if (gameOver || grid[row][col].isRevealed) {
        return;
    }
    
    const cell = grid[row][col];
    cell.isFlagged = !cell.isFlagged;
    
    minesLeft += cell.isFlagged ? -1 : 1;
    minesLeftDisplay.textContent = minesLeft;
    
    renderBoard();
}

// Reveal all mines (on game over)
function revealAllMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col].isMine) {
                grid[row][col].isRevealed = true;
            }
        }
    }
    renderBoard();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

// Check win condition
function checkWin() {
    const totalCells = ROWS * COLS;
    const nonMineCells = totalCells - MINES;
    
    if (cellsRevealed === nonMineCells) {
        endGame(true);
    }
}

// End game
function endGame(won) {
    gameOver = true;
    clearInterval(timerInterval);
    
    const gameOverContent = document.querySelector('.game-over-content');
    
    if (won) {
        gameOverTitle.textContent = '¡VICTORIA!';
        gameOverContent.classList.add('win');
    } else {
        gameOverTitle.textContent = 'GAME OVER';
        gameOverContent.classList.remove('win');
    }
    
    finalTimeDisplay.textContent = timer;
    gameOverDiv.classList.remove('hidden');
}

// Button handlers
document.getElementById('newGameBtn').addEventListener('click', initGame);
document.getElementById('restartButton').addEventListener('click', initGame);

// Initialize
initGame();
