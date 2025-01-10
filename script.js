const canvas = document.getElementById("canvas");

canvas.width = document.body.clientWidth - 72;
canvas.height = document.body.clientHeight - 72;
let painter = canvas.getContext("2d");
let jumping = false;

let inputs = {
    left: false,
    right: false,
    up: false
}

const g = 9.8 / 10;
const jumpPower = 12;
const friction = 1;
const xAcceleration = 0.2;
const maxVelocity = 5;
const velocityLimit = 0.3;

window.onresize = function (event) {
    canvas.width = document.body.clientWidth - 72;
    canvas.height = document.body.clientHeight - 72;
}

let GameObject = function (x, y, width, height, color, vx = 0, vy = 0, ax = 0, ay = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.draw = function () {
        painter.fillStyle = this.color;
        painter.fillRect(this.x, canvas.height - this.y - this.height, this.width, this.height);
    }
}

let objects = {
    block: new GameObject(30, 200, 20, 20, "hsl(0, 0%, 100%)"),
    platforms: {
        ground: new GameObject(0, 0, canvas.width, 20, "hsl(0, 0%, 50%)"),
        step: new GameObject(100, 20, 100, 20, "hsl(0, 0%, 50%)"),
        leftWall: new GameObject(0, 0, 20, canvas.height, "hsl(0, 0%, 50%)"),
        rightWall: new GameObject(canvas.width - 20, 0, 20, canvas.height, "hsl(0, 0%, 50%)"),
        ceiling: new GameObject(0, canvas.height - 20, canvas.width, 20, "hsl(0, 0%, 50%)"),
        step1: new GameObject(200, 20, 100, 40, "hsl(0, 0%, 50%)"),
    }
}


setInterval(function () {
    painter.clearRect(0, 0, canvas.width, canvas.height);

    for (const [key, value] of Object.entries(objects.platforms)) {
        if (objects.block.x + objects.block.width >= objects.platforms[key].x && objects.block.x <= objects.platforms[key].x && objects.block.y < objects.platforms[key].y + objects.platforms[key].height && objects.block.y + objects.block.height > objects.platforms[key].y) {
            objects.block.ax = 0;
            objects.block.vx = 0;
            objects.block.x = objects.platforms[key].x - objects.block.width;
        }

        if (objects.block.x <= objects.platforms[key].x + objects.platforms[key].width && objects.block.x + objects.block.width >= objects.platforms[key].x + objects.platforms[key].width && objects.block.y < objects.platforms[key].y + objects.platforms[key].height && objects.block.y + objects.block.height > objects.platforms[key].y) {
            objects.block.ax = 0;
            objects.block.vx = 0;
            objects.block.x = objects.platforms[key].x + objects.platforms[key].width;
        }

        if (objects.block.y <= objects.platforms[key].y + objects.platforms[key].height && objects.block.y + objects.block.height >= objects.platforms[key].y + objects.platforms[key].height && objects.block.x < objects.platforms[key].x + objects.platforms[key].width && objects.block.x + objects.block.width > objects.platforms[key].x) {
            objects.block.ay = 0;
            objects.block.vy = 0;
            objects.block.y = objects.platforms[key].y + objects.platforms[key].height;
            jumping = false;
        } else {
            objects.block.ay = -g;
        }
    }

    if (inputs.left) {
        objects.block.ax = -xAcceleration;
    } else if (inputs.right) {
        objects.block.ax = xAcceleration;
    }

    if (Math.abs(objects.block.vx) > maxVelocity) {
        objects.block.ax = 0;
    }

    if (!inputs.left && !inputs.right) {
        if (objects.block.vx > velocityLimit) {
            objects.block.ax = -xAcceleration;
        } else if (objects.block.vx < -velocityLimit) {
            objects.block.ax = xAcceleration;
        } else if (Math.abs(objects.block.vx) < velocityLimit) {
            objects.block.ax = 0;
            objects.block.vx = 0;
        }
    }

    objects.block.vx += objects.block.ax;
    objects.block.vy += objects.block.ay;
    objects.block.x += objects.block.vx;
    objects.block.y += objects.block.vy;

    objects.block.draw();

    for (const [key, value] of Object.entries(objects.platforms)) {
        objects.platforms[key].draw();
    }
    
}, 1000 / 60);

onkeydown = function (event) {
    if (event.key === "ArrowRight") {
        inputs.right = true;
    }

    if (event.key === "ArrowLeft") {
        inputs.left = true;
    }

    if (event.key === "ArrowUp" && !jumping) {
        objects.block.y += 5;
        objects.block.vy += jumpPower;
        jumping = true;
    }
}

onkeyup = function (event) {
    if (event.key === "ArrowRight") {
        inputs.right = false;
    }

    if (event.key === "ArrowLeft") {
        inputs.left = false;
    }

    if (event.key === "ArrowUp") {
        inputs.up = false;
    }
}