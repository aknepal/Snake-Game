var canvas, ctx;
var head, apple, ball;
var dots, apple_x, apple_y;
var leftDirection = false, rightDirection = true, upDirection = false, downDirection = false, inGame = true, isPaused = false;

const DOT_SIZE = 10;
const ALL_DOTS = 2000; 
const MAX_RAND_X = 99;
const MAX_RAND_Y = 49;
const DELAY = 100; // Slowed down
const C_HEIGHT = 500;
const C_WIDTH = 1000;
const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40, PAUSE_KEY = 80, RESTART_KEY = 82;

var x = new Array(ALL_DOTS);
var y = new Array(ALL_DOTS);

function init() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');

    loadImages();
    createSnake();
    locateApple();
    requestAnimationFrame(gameCycle);
}

function loadImages() {
    head = new Image(); head.src = 'head.png';
    ball = new Image(); ball.src = 'dot.png';
    apple = new Image(); apple.src = 'apple.png';
}

function createSnake() {
    dots = 3;
    for (var z = 0; z < dots; z++) {
        x[z] = 50 - z * DOT_SIZE;
        y[z] = 50;
    }
}

function checkApple() {
    if ((x[0] === apple_x) && (y[0] === apple_y)) {
        dots++;
        locateApple();
    }
}

function doDrawing() {
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    if (inGame) {
        ctx.drawImage(apple, apple_x, apple_y);
        for (var z = 0; z < dots; z++) {
            ctx.drawImage(z === 0 ? head : ball, x[z], y[z]);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = 'normal bold 18px serif';
    ctx.fillText('Game Over. Press R to Restart.', C_WIDTH / 2, C_HEIGHT / 2);
}

function move() {
    for (var z = dots; z > 0; z--) {
        x[z] = x[z - 1];
        y[z] = y[z - 1];
    }

    if (leftDirection) x[0] -= DOT_SIZE;
    if (rightDirection) x[0] += DOT_SIZE;
    if (upDirection) y[0] -= DOT_SIZE;
    if (downDirection) y[0] += DOT_SIZE;
}

function checkCollision() {
    for (var z = dots; z > 0; z--) {
        if (z > 4 && x[0] === x[z] && y[0] === y[z]) inGame = false;
    }
    if (y[0] >= C_HEIGHT || y[0] < 0 || x[0] >= C_WIDTH || x[0] < 0) inGame = false;
}

function locateApple() {
    apple_x = Math.floor(Math.random() * MAX_RAND_X) * DOT_SIZE;
    apple_y = Math.floor(Math.random() * MAX_RAND_Y) * DOT_SIZE;
}

var lastTime = 0;

function gameCycle(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    if (elapsed > DELAY) {
        if (inGame) {
            if (!isPaused) {
                checkApple();
                checkCollision();
                move();
                doDrawing();
            }
        }
        lastTime = timestamp;
    }
    
    if (inGame) {
        requestAnimationFrame(gameCycle);
    }
}

onkeydown = function (e) {
    var key = e.keyCode;
    if ((key === LEFT_KEY) && (!rightDirection)) { leftDirection = true; upDirection = downDirection = false; }
    if ((key === RIGHT_KEY) && (!leftDirection)) { rightDirection = true; upDirection = downDirection = false; }
    if ((key === UP_KEY) && (!downDirection)) { upDirection = true; rightDirection = leftDirection = false; }
    if ((key === DOWN_KEY) && (!upDirection)) { downDirection = true; rightDirection = leftDirection = false; }
    if (key === PAUSE_KEY) { isPaused = !isPaused; }
    if (key === RESTART_KEY) { resetGame(); }
};

function resetGame() {
    inGame = true;
    leftDirection = false;
    rightDirection = true;
    upDirection = false;
    downDirection = false;
    createSnake();
    locateApple();
    requestAnimationFrame(gameCycle);
}

// Mobile touch controls (optional)
document.addEventListener('touchstart', function(e) {
    var touchX = e.touches[0].clientX;
    var touchY = e.touches[0].clientY;

    if (touchX < canvas.width / 2 && !rightDirection) {
        leftDirection = true; upDirection = downDirection = false;
    } else if (touchX > canvas.width / 2 && !leftDirection) {
        rightDirection = true; upDirection = downDirection = false;
    } else if (touchY < canvas.height / 2 && !downDirection) {
        upDirection = true; leftDirection = rightDirection = false;
    } else if (touchY > canvas.height / 2 && !upDirection) {
        downDirection = true; leftDirection = rightDirection = false;
    }
});
