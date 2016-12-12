
var keysDown = {};

var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(250, 100, 50, 50);

game.showPhysics = true;

b1.Entity.gy = 0;
b1.Entity.ax = 0.01;

b2.Entity.gy = 0;
b2.Entity.ax = -0.5;

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

    if (keysDown[32]) {
        b1.Entity.vy = -12;
    }
    if (keysDown[68]) {
        b1.Entity.vx = 3;
    }
    if (keysDown[65]) {
        b1.Entity.vx = -3;
    }

    background(255);
    game.positions.update(1);
    game.collider.detectCollisions();
    game.render.all();
};
