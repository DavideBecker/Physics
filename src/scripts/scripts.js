require('engine');
require('entities');
//require('materials');

var keysDown = {};

var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(250, 100, 50, 50);

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
        b1.vy = -12;
    }

    if (keysDown[keys.D]) {
        b1.vx = 3;
    }

    if (keysDown[keys.A]) {
        b1.vx = -3;
    }

    if (keysDown[keys.S]) {
        b1.vy = 3;
    }

    if (keysDown[keys.W]) {
        b1.vy = -3;
    }

    background(255);
    game.positions.update(1);
    game.collider.detectCollisions();
    game.render.all();
};
