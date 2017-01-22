require('engine');

// Some of the essential engine components were copied from
// https://www.ibm.com/developerworks/library/wa-build2dphysicsengine/
// as a base to modify.

// Some examples what the engine is capable of:

// We can easily create new physic entities, that interact with each other
var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(100, 200, 500, 50);
var b3 = new Box(300, 300, 50, 50);

// We can change the velocity, acceleration etc anywhere we want to.
// Either at the start to give them some initial momentum or on demand.
// Another example below changes the velocity of an entity when keys are pressed.
b1.gy = 0;
b2.gy = 0;
b3.gy = 0;

// This shows us some graphs and stuff to visualize momentum and collisions
game.showPhysics = true;

// We can also animate stuff pretty easily. First we define how our animation
// should look
var anim = new Animation(function(step) {
    // step is always between 0 (start) and 1 (end) so we can use that as a
    // multiplier to animate to a specific value
    // Note that this isn't a phyics entity, so it won't interact with them
    // Although it could
    rect(100 * step, 100 * step, 100, 100);
}, 2000);
// When we're ready to run it we can set isRunning to true and it will animate
anim.isRunning = true;
anim.isLooping = true;

// This bit is used for the delta time to handle frame skips and slowdowns
var times = {
    prev: new Date().getTime(),
    curr: null
};

// Anything that uses p5.js values should be set in the setup() function
function setup() {
    frameRate(config.FPS);
    createCanvas(windowWidth - 10, windowHeight - 10);
}

// This, along with the keyReleased() function allows us to have a super
// flexible way to check if a key is pressed (core.keysPresed[32] for space)
function keyPressed() {
    game.keysPressed[keyCode] = true;
};

function keyReleased() {
    game.keysPressed[keyCode] = false;
};

function draw() {
    b1.vx = 0;
    b1.vy = 0;

    // This bit allows to control one of the rectangles by changing its velocity
    // when W, A, S or D is pressed or stopping its momentum by pressing space
    if (game.keysPressed[keys.SPACE]) {
        b1.vx = 0;
        b1.vy = 0;
        b1.ax = 0;
        b1.ay = 0;
    }

    if (game.keysPressed[keys.D]) {
        b1.vx = 5;
    }

    if (game.keysPressed[keys.A]) {
        b1.vx = -5;
    }

    if (game.keysPressed[keys.S]) {
        b1.vy = 5;
    }

    if (game.keysPressed[keys.W]) {
        b1.vy = -5;
    }

    // This is where the engine magic happens
    background(255);
    times.curr = new Date().getTime();
    var diff = times.curr - times.prev;
    game.positions.update(diff / 20);
    times.prev = times.curr;
    game.detectCollisions();
    game.render.all();
};
