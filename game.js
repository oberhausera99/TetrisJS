
const canvas = document.getElementById('palya');
const context = canvas.getContext('2d');
const WIDTH = 12;
const HEIGHT = 20;
let highscore = [0, 0, 0, 0, 0];
const COLORS = [
    null,
    '#1E90FF',
    '#FF00FF',
    '#006400',
    '#FF0000',
    '#F0FFFF',
    '#FFD700',
    '#8B4513'
];
let szamlalo = 0;
let irany = 0;
context.scale(26,26);
let score = 0;

let Piece = {
    pos: {x: 0, y: 0},
    matrix: null,
    xlength: 0,
    ylength: 0,
};
let futas = true;
function jatekterGeneralas(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


let gameArea = jatekterGeneralas(WIDTH, HEIGHT);

function createAlakzat() {
    var shape;
    var a = Math.floor(Math.random() * 7) + 1;
    if (a === 1) {
        shape = [
            [1, 1],
            [1, 1],
        ];
        Piece.xlength = 2;
        Piece.ylenght = 2;
    } else if (a === 2) {
        shape = [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
        ];
        Piece.xlength = 4;
        Piece.ylenght = 4;
    } else if (a === 3) {
        shape = [
            [0, 3, 3],
            [3, 3, 0],
            [0, 0, 0],
        ];
        Piece.xlength = 3;
        Piece.ylenght = 3;
    } else if (a === 4) {
        shape = [
            [4, 4, 0],
            [0, 4, 4],
            [0, 0, 0],
        ];
        Piece.xlength = 3;
        Piece.ylenght = 3;
    } else if (a === 5) {
        shape = [
            [0, 5, 0],
            [0, 5, 0],
            [0, 5, 5],
        ];
        Piece.xlength = 3;
        Piece.ylenght = 3;
    } else if (a === 6) {
        shape = [
            [0, 6, 0],
            [0, 6, 0],
            [6, 6, 0],
        ];
        Piece.xlength = 3;
        Piece.ylenght = 3;
    } else if (a === 7) {
        shape = [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
        Piece.xlength = 3;
        Piece.ylenght = 3;

    }

    Piece.matrix = shape;
    Piece.pos.x = 0;
    Piece.pos.y = 0;
}


function rajzolAlakzat(tomb, xoffset, yoffset) {
    tomb.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + xoffset, y + yoffset, 1, 1);
            }
        });
    });
}


function palyanBelul(Piece, xoffset, yoffset) {
    if(Piece.ylenght + yoffset < HEIGHT) {
        return true;
    } else {
        return false;
    }
}

function utkozes(gameArea, Piece, xpoz, ypoz) {
    for(let i=0;i<Piece.xlength; i++){
        for(let j=0;j<Piece.ylenght;j++){
            if(Piece.matrix[i][j]!==0 &&(gameArea[i+ypoz]&& gameArea[i+ypoz][j+xpoz])!==0){
                return true;
            }
        }
    }
    return false;
}

let eses = 0;
let esesMax = 1000;
let previous = 0;
var yoffset = 0;
var xoffset = 4;

    var Zene = new Audio('TetrisMusic.mp3');
    if (typeof Zene.loop == 'boolean') {
        Zene.loop = true;
    } else {
        Zene.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
        Zene.volume = 0.2;

    Zene.play();




function update(time = 0) {
    if(futas === true) {
        const current = time - previous;
        console.log(time);
        previous = time;
        eses += current;
        if (eses > esesMax) {
            if (utkozes(gameArea, Piece, xoffset, yoffset + 1) !== true) {
                yoffset++;
                eses = 0;

            } else {
                var x = xoffset;
                var y = yoffset
                palyatFrissit(gameArea, Piece, x, y);
                torles(gameArea)
                eses = 0;
                yoffset = 0;
                createAlakzat();
                rajzolAlakzat(Piece.matrix, x, y);
            }
        }
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        rajzolAlakzat(gameArea, 0, 0);
        rajzolAlakzat(Piece.matrix, xoffset, yoffset);
        requestAnimationFrame(update);
        gameOver();
    } else {
        context.fillStyle = '#000';
    }
}

function palyatFrissit(gameArea, Piece, xpoz, ypoz) {

    for(let i = 0; i < Piece.xlength; i++ ) {
        for(let j = 0; j < Piece.ylenght; j++) {
            if(Piece.matrix[i][j] !== 0) {
                gameArea[i + ypoz][j + xpoz] = Piece.matrix[i][j];
                xoffset = 4;
            }
        }
    }
   /* Piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameArea[y + ypoz][x + xpoz] = value;
                xoffset = 4;
            }
        });
    }); */
}



function torles(gameArea) {
    let szamlalo = 1;
    del: for (let y = HEIGHT - 1; y > 0; --y) {
        for (let x = 0; x < WIDTH; ++x) {
            if (gameArea[y][x] === 0) {
                continue del;
            }
        }

        const row = gameArea.splice(y, 1)[0].fill(0);
        gameArea.unshift(row);
        ++y;
        score += szamlalo * WIDTH * 5;
        szamlalo *= 2;
        pontszamotTarol();
        updateScore();
    }
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37 && utkozes(gameArea, Piece, xoffset-1, yoffset  ) === false) {
        xoffset -= 1;
    } else if (event.keyCode === 39 && utkozes(gameArea, Piece, xoffset+1, yoffset  ) === false) {
        xoffset += 1;
    } else if(event.keyCode === 40 && utkozes(gameArea, Piece, xoffset, yoffset + 1) === false) {
        yoffset += 1;
    }
});


function pontszamotTarol() {
    for (let i = 0; i < 5; i++) {
        if (highscore[i] < score) {
            highscore[i] = score;
            break;
        }
    }
}
function pontszamotMegjelenit() {
    document.getElementById("leaderboard").innerText =
    "Highscores:\n" + highscore[0] + "\n" + highscore[1] + "\n" + highscore[2] + "\n" + highscore[3] + "\n"
    + highscore[4] + "\n";
}

function updateScore() {
    Hang();
    document.getElementById('score').innerText = "Score: " + score;
}


function gameOver() {
        if (utkozes(gameArea, Piece, xoffset, yoffset)) {
            gameArea.forEach(row => row.fill(0));
            futas = false;
            document.getElementById('message').innerText = "Game Over";
            Zene.pause();
            pontszamotMegjelenit();
        }

}

function Hang() {
    var audio = new Audio("ScoreSound.mp3");
        audio.play();
    }



document.getElementById('score').innerText = "Score: " + score;
createAlakzat();
rajzolAlakzat(Piece.matrix, xoffset, yoffset);


    var button = document.createElement("button");
    button.innerHTML = "New Game";
    var th = document.getElementsByTagName("tr")[1];
    th.appendChild(button);
    button.addEventListener("click", function () {
        futas = true;
        document.getElementById('message').innerText = "";
        yoffset = 0;
        score = 0;
        document.getElementById('score').innerText = "Score: " + score;
        Zene.volume = 0.2;
        Zene.currentTime = 0;
        Zene.play();
        update();
    });


update();








