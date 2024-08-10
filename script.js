const cells = document.querySelectorAll('.cell');
const gameBoard = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const resultMessage = document.getElementById('resultMessage');
const resultText = document.getElementById('resultText');
const resultImage = document.getElementById('resultImage');
let currentPlayer = 'X';  // El jugador comienza con 'X'
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const difficulty = window.location.pathname.includes('dificil') ? 'dificil' :
                   window.location.pathname.includes('normal') ? 'normal' : 'facil';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    makeMove(clickedCellIndex);

    if (!gameActive) return;

    if (difficulty === 'facil') {
        setTimeout(() => makeRobotMove(), 1000); // Ajusta la velocidad aquí (en milisegundos)
    } else {
        setTimeout(() => makeRobotMove(), 500);
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    cells[index].innerHTML = currentPlayer;

    if (checkWinner()) {
        setTimeout(() => {
            if (currentPlayer === 'X') {
                handleLoss(); // Si el jugador con 'X' gana, se maneja la pérdida para el jugador
            } else {
                handleWin(); // Si el robot con 'O' gana, se maneja la victoria del robot
            }
        }, 10);
        return;
    }

    if (!board.includes('')) {
        setTimeout(() => handleDraw(), 10);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Alternar entre 'X' y 'O'
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';  // Reiniciar al jugador como 'X'
    cells.forEach(cell => cell.innerHTML = '');
    resultMessage.style.display = 'none';
    resultMessage.classList.add('hidden');
}

function handleWin() {
    resultText.innerText = `¡Perdiste ${currentPlayer}! El robot ha  ganado en modo ${difficulty}.`;
    resultImage.src = 'https://i.graphicmama.com/resources/toons/chubby-robot-cartoon-character/9530/siteSmallImages/82-winner(concepts).jpg'; // Reemplaza con el path a tu imagen

    resultMessage.style.display = 'block';
    resultMessage.classList.remove('hidden');
    gameActive = false;
}

function handleDraw() {
    resultText.innerText = '¡Es un empate!';
    resultImage.src = 'https://fcit.usf.edu/matrix/wp-content/uploads/2016/12/Robot-10-C.png'; // Reemplaza con el path a tu imagen de empate
    resultMessage.style.display = 'block';
    resultMessage.classList.remove('hidden');
    gameActive = false;
}

function handleLoss() {
    resultText.innerText = 'Has ganado.';
    resultImage.src = 'https://cdn3d.iconscout.com/3d/premium/thumb/robot-lifting-trophy-10762083-8807594.png'; // Reemplaza con el path a tu imagen

    resultMessage.style.display = 'block';
    resultMessage.classList.remove('hidden');
    gameActive = false;
}

function makeRobotMove() {
    let move;

    if (difficulty === 'normal') {
        move = makeRandomMove();
    } else if (difficulty === 'dificil') {
        move = minimax(board, 'O').index;
    } else { // 'facil'
        move = makeRandomMove();
    }

    makeMove(move);

    // Si el robot gana, mostrar el mensaje de pérdida para el jugador
    if (checkWinner()) {
        handleLoss();
    }
}

function makeRandomMove() {
    const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWinning(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinning(newBoard, 'O')) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;

    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinning(board, player) {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === player;
        });
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
