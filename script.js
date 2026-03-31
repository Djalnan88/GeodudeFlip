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
    score = 1;

    let boardElement = document.getElementById("board");
    if (boardElement) boardElement.innerHTML = "";

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
            init();
        }, 50);
    } else {
        score *= cell.value;
        render();
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

    if (boardElement.children.length === 0) {
        for (let i = 0; i <= SIZE; i++) {
            for (let j = 0; j <= SIZE; j++) {
                const div = document.createElement("div");
                div.id = `cell-${i}-${j}`;
                boardElement.appendChild(div);

                if (i < SIZE && j < SIZE) {
                    div.onclick = () => onCellClick(i, j);
                    div.oncontextmenu = (e) => onCellRightClick(e, i, j);

                    let touchTimer;
                    let touchMoved = false;
                    let isLongPress = false;

                    div.ontouchstart = (e) => {
                        if (e.touches.length > 1) return;
                        touchMoved = false;
                        isLongPress = false;
                        touchTimer = setTimeout(() => {
                            touchTimer = null;
                            if (!touchMoved) {
                                isLongPress = true;
                            }
                        }, 400);
                    };

                    div.ontouchmove = () => {
                        touchMoved = true;
                        if (touchTimer) {
                            clearTimeout(touchTimer);
                            touchTimer = null;
                        }
                    };

                    div.ontouchend = (e) => {
                        if (touchTimer) {
                            clearTimeout(touchTimer);
                            touchTimer = null;
                            if (!touchMoved) {
                                onCellClick(i, j);
                            }
                        } else {
                            if (isLongPress && !touchMoved) {
                                onCellRightClick({ preventDefault: () => {} }, i, j);
                            }
                        }
                        isLongPress = false;
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                    };
                }
            }
        }
    }

    for (let i = 0; i <= SIZE; i++) {
        for (let j = 0; j <= SIZE; j++) {
            const div = document.getElementById(`cell-${i}-${j}`);

            if (i < SIZE && j < SIZE) {
                const cell = board[i][j];
                let newClassList = "cell";
                if (cell.revealed) newClassList += " revealed";
                if (cell.memo && !cell.revealed) newClassList += " memo";
                div.className = newClassList;

                if (div.innerHTML === "") {
                    let backContent = cell.value === -1 ? "" : cell.value;
                    let backClass = cell.value === -1 ? "cell-back bomb" : "cell-back";
                    
                    div.innerHTML = `
                        <div class="cell-inner">
                            <div class="cell-front"></div>
                            <div class="${backClass}">${backContent}</div>
                        </div>
                    `;
                }
            } else if (i < SIZE && j === SIZE) {
                div.className = "cell hint";
                div.innerHTML = `<div class="hint-top">${rowSum[i]}</div><div class="hint-bottom"><img src="Bomb.png" alt="Bomb" style="width:30px; height:16px;"> ${rowBomb[i]}</div>`;
            } else if (i === SIZE && j < SIZE) {
                div.className = "cell hint";
                div.innerHTML = `<div class="hint-top">${colSum[j]}</div><div class="hint-bottom"><img src="Bomb.png" alt="Bomb" style="width:30px; height:16px;"> ${colBomb[j]}</div>`;
            } else {
                div.className = "cell empty";
            }
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