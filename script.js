window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('gameBody').style.display = 'block';
    }, 2500); // 2.5 seconds loading
});

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const winModal = document.getElementById('winModal');
const winTitle = document.getElementById('winTitle');
const winMessage = document.getElementById('winMessage');
const modalIcon = document.getElementById('modalIcon');

let board = ["", "", "", "", "", "", "", "", ""];
let human = "X", ai = "O", scoreX = 0, scoreO = 0, isThinking = false;

cells.forEach(cell => cell.addEventListener('click', handleClick));

function handleClick(e) {
    const index = e.target.dataset.index;
    if (isThinking || board[index] !== "" || checkWinner(board)) return;

    makeMove(index, human);

    if (!checkWinner(board) && board.includes("")) {
        isThinking = true;
        statusText.innerText = "AI is analyzing...";
        statusText.style.color = "#ff007f";
        setTimeout(() => {
            aiMove();
            isThinking = false;
        }, 800);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());
    cells[index].style.animation = "fadeIn 0.3s ease";
    
    let result = checkWinner(board);
    if (result || !board.includes("")) setTimeout(() => showPopup(result), 400);
}

function aiMove() {
    let bestMove = getBestMove();
    makeMove(bestMove, ai);
    if (!checkWinner(board)) {
        statusText.innerText = "YOUR TURN";
        statusText.style.color = "#00f2ff";
    }
}

function getBestMove() {
    let bestScore = -Infinity, move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = ai;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) { bestScore = score; move = i; }
        }
    }
    return move;
}



function minimax(b, depth, isMax) {
    let res = checkWinner(b);
    if (res === ai) return 10 - depth;
    if (res === human) return depth - 10;
    if (!b.includes("")) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === "") {
                b[i] = ai;
                best = Math.max(best, minimax(b, depth + 1, false));
                b[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === "") {
                b[i] = human;
                best = Math.min(best, minimax(b, depth + 1, true));
                b[i] = "";
            }
        }
        return best;
    }
}

function checkWinner(b) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let c of wins) {
        if (b[c[0]] && b[c[0]] === b[c[1]] && b[c[0]] === b[c[2]]) return b[c[0]];
    }
    return null;
}

function showPopup(winner) {
    winModal.style.display = 'flex';
    if (winner === "X") {
        winTitle.innerText = "VICTORY!";
        winMessage.innerText = "You found a flaw in my system! Impossible.";
        modalIcon.innerText = "⚡";
        scoreX++;
        document.getElementById('scoreX').innerText = scoreX;
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else if (winner === "O") {
        winTitle.innerText = "AI DOMINATION";
        winMessage.innerText = "Calculated. You never stood a chance, human.";
        modalIcon.innerText = "🤖";
        scoreO++;
        document.getElementById('scoreO').innerText = scoreO;
    } else {
        winTitle.innerText = "STALEMATE";
        winMessage.innerText = "A perfect draw. We are equally matched.";
        modalIcon.innerText = "⚖️";
    }
}

function closeModal() { winModal.style.display = 'none'; reset(); }

function reset() {
    board = ["", "", "", "", "", "", "", "", ""];
    isThinking = false;
    cells.forEach(c => { c.innerText = ""; c.classList.remove('x', 'o'); });
    statusText.innerText = "Next Round: Begin!";
}

document.getElementById('restartBtn').onclick = reset;

