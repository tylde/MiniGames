//'use strict';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// ****************************************************************************************

class Ball {
    constructor(x, y, type) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.dx = 6;
        this.dy = 0;
        this.r = 6;
        this.speed = 7;
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    moveY() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.y > canvas.height - this.r) {
            this.y = canvas.height - this.r;
            this.dy = -this.dy;
        }
        if (this.y < 0 + this.r) {
            this.y = 0 + this.r;
            this.dy = -this.dy;
        }
    }
    moveX() {
        // bouncing back from right paddle
        if (this.x > rightPaddle.x - rightPaddle.w / 2 - this.r && this.x < rightPaddle.x - rightPaddle.w / 2 + this.speed) {
            if (this.y > rightPaddle.y - rightPaddle.h / 2 && this.y < rightPaddle.y + rightPaddle.h / 2) {
                this.dy = -Math.sin((rightPaddle.y - this.y) * 1.57075 / (rightPaddle.h / 2) * 0.8) * this.speed;
                this.dx = Math.cos((rightPaddle.y - this.y) * 1.57075 / (rightPaddle.h / 2) * 0.8) * this.speed;
                this.dx = -this.dx;
            }
        }
        // bouncing back from left paddle
        if (this.x < leftPaddle.x + leftPaddle.w / 2 + this.r) {
            if (this.y > leftPaddle.y - leftPaddle.h / 2 && this.y < leftPaddle.y + leftPaddle.h / 2) {
                this.dy = -Math.sin((leftPaddle.y - this.y) * 1.57075 / (leftPaddle.h / 2) * 0.8) * this.speed;
                this.dx = Math.cos((leftPaddle.y - this.y) * 1.57075 / (leftPaddle.h / 2) * 0.8) * this.speed;
            }
        }

        // passing horizontal boudnaries - goal
        if (this.x > canvas.width) {

        }
        if (this.x < 0) {
            this.x = 400;
            this.y = 300
            this.dx = -6;
            this.dy = 0;
            rightPaddle.score++;
        }
        if (this.x > canvas.width) {
            this.x = 400;
            this.y = 300
            this.dx = 6;
            this.dy = 0;
            leftPaddle.score++;
        }
    }
}   

// function bounce(p) {
//     if (p.type === 'right') {
//         if (this.x > p.x - p.w / 2 - this.r && this.x < p.x - p.w / 2 + this.speed) {
//             if (this.y > p.y - p.h / 2 && this.y < p.y + p.h / 2) {
//                 this.dy = -Math.sin((p.y - this.y) * 1.57075 / (p.h / 2) * 0.8) * this.speed;
//                 this.dx = Math.cos((p.y - this.y) * 1.57075 / (p.h / 2) * 0.8) * this.speed;
//                 this.dx = -this.dx;
//             }
//         }
//     }
//     else {
//         if (this.x < p.x + p.w / 2 + this.r) {
//             if (this.y > p.y - p.h / 2 && this.y < p.y + p.h / 2) {
//                 this.dy = -Math.sin((p.y - this.y) * 1.57075 / (p.h / 2) * 0.8) * this.speed;
//                 this.dx = Math.cos((p.y - this.y) * 1.57075 / (p.h / 2) * 0.8) * this.speed;
//             }
//         }
//     }
// }



class Paddle {
    constructor(x, y) {
        this.w = 10;
        this.h = 70;
        this.x = x;
        this.y = y;
        this.dy = 0;
        this.speed = 6;
        this.up = false;
        this.down = false;

        this.score = 0;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
    drawScore(x) {
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.font = '40px Arial';
        ctx.fillText(this.score, x, 50);
    }

    move() {
        if (this.up === true && this.down === false) this.dy = -this.speed;
        else if (this.up === false && this.down === true) this.dy = this.speed;
        else this.dy = 0;

        this.y += this.dy;

        if (this.y > canvas.height - this.h / 2) this.y = canvas.height - this.h / 2;
        if (this.y < 0 + this.h / 2) this.y = + this.h / 2;
    }
}

var leftPaddle = new Paddle(10, 300, 'left');
var rightPaddle = new Paddle(790, 300, 'right');
var ball = new Ball(400, 300);

// ****************************************************************************************

var timer = setInterval(game, 1000 / 60);


function game() {
    set();
    draw();
}

function set() {
    leftPaddle.move();
    rightPaddle.move();
    ball.moveY();
    ball.moveX();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    leftPaddle.draw();
    rightPaddle.draw();
    leftPaddle.drawScore(150);
    rightPaddle.drawScore(650);
    ball.draw();
}

// ****************************************************************************************

// Left player controller
document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 87: // W
            leftPaddle.up = true;
            break;
        case 83: // S
            leftPaddle.down = true;
            break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 87: // W
            leftPaddle.up = false;
            break;
        case 83: // S
            leftPaddle.down = false;
            break;
    }
});

// Right player controller
document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 38: // W
            rightPaddle.up = true;
            break;
        case 40: // S
            rightPaddle.down = true;
            break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 38: // W
            rightPaddle.up = false;
            break;
        case 40: // S
            rightPaddle.down = false;
            break;
    }
});