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
const jumpPower = 10;
const friction = 1;
const xAcceleration = 0.2;

window.onresize = function (event) {
    canvas.width = document.body.clientWidth - 72;
    canvas.height = document.body.clientHeight - 72;
}

let objects = {
    block: {
        width: 20,
        height: 20,
        color: "white",
        x: 200,
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
    },
    step: {
        x: 100,
        y: 50,
        width: 30,
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
        jumping = false;
    } else {
        objects.block.ay = -g;
    }

    if ((objects.block.x + objects.block.width >= objects.step.x && objects.block.x <= objects.step.x)) {
        objects.block.ax = 0;
        objects.block.vx = 0;
        objects.block.x = objects.step.x - objects.block.width;
    }

    if ((objects.block.x <= objects.step.x + objects.step.width && objects.block.x + objects.block.width >= objects.step.x + objects.step.width)) {
        objects.block.ax = 0;
        objects.block.vx = 0;
        objects.block.x = objects.step.x + objects.step.width;
    }
    if (inputs.left && inputs.right) {
        objects.block.vx = 0;

    }  else if (inputs.left) {
        objects.block.ax = -xAcceleration;
    } else if (inputs.right) {
        objects.block.ax = xAcceleration;
    } 

    if (!inputs.left && !inputs.right) { 
        if (objects.block.vx > 0) {
            objects.block.ax = -friction;
        } else if (objects.block.vx < 0) {
            objects.block.ax = friction;
        }
    }

    if (Math.abs(objects.block.vx) < 0.5 && !inputs.right && !inputs.left) {
        objects.block.ax = 0;
        objects.block.vx = 0;
    }

    objects.block.vx += objects.block.ax;
    objects.block.vy += objects.block.ay;
    objects.block.x += objects.block.vx;
    objects.block.y += objects.block.vy;

    objects.ground.draw();
    objects.block.draw();
    objects.step.draw();
}, 1000 / 60);

onkeydown = function (event) {
    keydown = true;
    if (event.key === "ArrowRight") {
        inputs.right = true;
    }

    if (event.key === "ArrowLeft") {
        inputs.left = true;
    }
    
    if (event.key === "ArrowUp" && !jumping) {
        objects.block.y += 1;
        objects.block.vy += jumpPower;
        jumping = true;
    }
}

onkeyup = function (event) {
    inputs.left = false;
    inputs.right = false;
    inputs.up = false;
}