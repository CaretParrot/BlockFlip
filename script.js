const canvas = document.getElementById("canvas");

canvas.width = document.body.clientWidth - 72;
canvas.height = document.body.clientHeight - 72;
let painter = canvas.getContext("2d");
let keydown = false;
let right = false;
let left = false;


window.onresize = function (event) {
    canvas.width = document.body.clientWidth - 72;
    canvas.height = document.body.clientHeight - 72;
}

let objects = {
    block: {
        width: 20,
        height: 20,
        color: "white",
        x: 0,
        y: 150,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: -9.8,
        draw: function () {
            painter.fillStyle = this.color;
            painter.fillRect(this.x, canvas.height - this.y - this.height, this.width, this.height);
        }
    },
    ground: {
        x: 0,
        y: 0,
        width: canvas.width,
        height: 20,
        color: "hsl(0, 0%, 50%)",
        draw: function () {
            painter.fillStyle = this.color;
            painter.fillRect(this.x, canvas.height - this.y - this.height, this.width, this.height);
        }
    }
}


setInterval(function () {
    painter.clearRect(0, 0, canvas.width, canvas.height);
    if (objects.block.y <= objects.ground.height) {
        objects.block.ay = 0;
        objects.block.vy = 0;
        objects.block.y = objects.ground.height;
    } else {
        objects.block.ay = -9.8;
    }

    if (Math.abs(objects.block.vx) < 0.1 && !keydown) {
        objects.block.ax = 0;
        objects.block.vx = 0;
    }

    objects.block.vx += objects.block.ax;
    objects.block.vy += objects.block.ay;
    objects.block.x += objects.block.vx;
    objects.block.y += objects.block.vy;
    objects.ground.draw();
    objects.block.draw();
}, 1000 / 60);

onkeydown = function (event) {
    keydown = true;
    if (event.key === "ArrowRight" && !left) {
        objects.block.ax = 0.1;
    }
    if (event.key === "ArrowLeft" && !right) {
        objects.block.ax = -0.1;
    }
}

onkeyup = function (event) {
    keydown = false;
    if (objects.block.vx > 0) {
        objects.block.ax = -0.3;
    } else if (objects.block.vx < 0) {
        objects.block.ax = 0.3;
    }
}