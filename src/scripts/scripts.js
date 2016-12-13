require('engine');
require('entities');
//require('materials');

var keysDown = {};

var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(250, 100, 50, 50);

var times = {
    prev: new Date().getTime(),
    curr: null
};

game.showPhysics = true;

b1.gy = 0;
b1.ax = 0.01;

b2.gy = 0;
b2.ax = -0.5;

function setup() {
    createCanvas(windowWidth - 10, windowHeight - 10);
}

function keyPressed() {
    keysDown[keyCode] = true;
};

function keyReleased() {
    keysDown[keyCode] = false;
};

function draw() {
    if (keysDown[keys.SPACE]) {
        b1.vx = 0;
        b1.vy = 0;
        b1.ax = 0;
        b1.ay = 0;
    }

    if (keysDown[keys.D]) {
        b1.ax += 0.001;
    }

    if (keysDown[keys.A]) {
        b1.ax += -0.001;
    }

    if (keysDown[keys.S]) {
        b1.ay += 0.001;
    }

    if (keysDown[keys.W]) {
        b1.ay += -0.001;
    }

    background(255);
    times.curr = new Date().getTime();
    var diff = times.curr - times.prev;
    game.positions.update(diff / 20);
    times.prev = times.curr;
    game.collider.detectCollisions();
    game.render.all();
};
