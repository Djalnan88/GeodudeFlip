const SIZE = 5;
const BOMB_COUNT = 5;

let board = [];
let score = 1;
let gameOver = false;

let rowSum = [];
let colSum = [];
let rowBomb = [];
let colBomb = [];

function init() {
    board = [];
    gameOver = false;
    for (let i = 0; i < SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = {
                value: Math.random() < 0.3 ? -1 : Math.ceil(Math.random() ** 2 * 3),
                revealed: false,
                memo: false
            };
        }
    }

    calculateSum();
    render();
}

function calculateSum() {
    rowSum = Array(SIZE).fill(0);
    colSum = Array(SIZE).fill(0);
    rowBomb = Array(SIZE).fill(0);
    colBomb = Array(SIZE).fill(0);

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j].value === -1) {
                rowBomb[i]++;
                colBomb[j]++;
            } else {
                rowSum[i] += board[i][j].value;
                colSum[j] += board[i][j].value;
            }
        }
    }
}

function onCellClick(i, j) {
    if (gameOver) return;

    let cell = board[i][j];
    if (cell.revealed) return;

    cell.revealed = true;
    cell.memo = false;

    render();

    if (cell.value === -1) {
        gameOver = true;
        setTimeout(() => {
            alert(`꼬마돌! 대폭발! ${score}점...`);
            score = 1;
            init();
        }, 50);
    } else {
        score *= cell.value;
        if (checkWin()) {
            setTimeout(() => {
                alert(`승리! ${score}점!`);
                init();
            }, 50);
        }
    }
}

function onCellRightClick(e, i, j) {
    e.preventDefault();
    if (gameOver) return;

    let cell = board[i][j];
    if (cell.revealed) return;

    cell.memo = !cell.memo;
    render();
}

function render() {
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let i = 0; i <= SIZE; i++) {
        for (let j = 0; j <= SIZE; j++) {
            const div = document.createElement("div");

            if (i < SIZE && j < SIZE) {
                // 게임 칸
                const cell = board[i][j];
                div.className = "cell";

                if (cell.revealed) {
                    div.classList.add("revealed");
                    if (cell.value === -1) {
                        div.classList.add("bomb");
                    } else {
                        div.innerText = cell.value;
                    }
                } else if (cell.memo) {
                    div.classList.add("memo");
                }

                div.onclick = () => onCellClick(i, j);
                div.oncontextmenu = (e) => onCellRightClick(e, i, j);
            } else if (i < SIZE && j === SIZE) {
                // 가로 힌트
                div.className = "cell hint";
                div.innerHTML = `<div class="hint-top">${rowSum[i]}</div><div class="hint-bottom"><img src="Bomb.png" alt="Bomb" style="width:30px; height:16px;"> ${rowBomb[i]}</div>`;
            } else if (i === SIZE && j < SIZE) {
                // 세로 힌트
                div.className = "cell hint";
                div.innerHTML = `<div class="hint-top">${colSum[j]}</div><div class="hint-bottom"><img src="Bomb.png" alt="Bomb" style="width:30px; height:16px;"> ${colBomb[j]}</div>`;
            } else {
                // 우측 하단 빈 칸
                div.className = "cell empty";
            }

            boardElement.appendChild(div);
        }
    }

    document.getElementById("score").innerText = score;
}

function checkWin() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j].value === 2 || board[i][j].value === 3) {
                if (!board[i][j].revealed) {
                    return false;
                }
            }
        }
    }
    return true;
}

function onReset() {
    init();
}

document.getElementById("reset").onclick = onReset;

init();