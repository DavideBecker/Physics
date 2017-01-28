require('engine');

// Some of the essential engine components were copied from
// https://www.ibm.com/developerworks/library/wa-build2dphysicsengine/
// as a base to modify.

// Some examples what the engine is capable of:

// We can easily create new physic entities, that interact with each other
var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(0, 200, 1000, 500);
var b3 = new Box(300, 300, 50, 50);

b1.velocity.x = 10;

// If an entity is static it won't be pushed back when colliding, but can push
// other entities away. Two static objects don't interact with each other at all
b2.isStatic = true;
b3.isStatic = true;

// We can make an entity temporarily invisible, this prevents it
// from interacting with anything
//b2.isVisible = false;
b3.isVisible = false;

// We can use layers to render objects ontop of each other. By default every
// element sits on layer 1000, so you can move elements to the background or in
// front of the game scene.
// Elements only collide with other elements that are within 100 layers of each
// other.
b3.changeLayer(101);

// We can change the velocity, acceleration etc anywhere we want to.
// Either at the start to give them some initial momentum or on demand.
// Another example below changes the velocity of an entity when keys are pressed.
b1.gravity.y = 1;
b2.gravity.y = 0;
b3.gravity.y = 0;

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
//anim.isRunning = true;
anim.isLooping = true;

// Anything that uses p5.js values should be set in the setup() function
function setup() {
    frameRate(config.FPS);
    createCanvas(windowWidth - 10, windowHeight - 10);
}

var bvel = 5;

function draw() {

    // This bit allows to control one of the rectangles by changing its velocity
    // when W, A, S or D is pressed or stopping its momentum by pressing space
    if (keyboard.isPressed(keys.SPACE)) {
        b1.velocity.y = -bvel * 2;
    }

    if (keyboard.isPressed(keys.D)) {
        b1.velocity.x = bvel * 3;
    }

    if (keyboard.isPressed(keys.A)) {
        b1.velocity.x = -bvel * 3;
    }

    if (keyboard.isPressed(keys.S)) {
        b1.velocity.y = bvel;
    }

    if (keyboard.isPressed(keys.W)) {
        //b1.velocity.y = -bvel * 5;
    }

    // This is where the engine magic happens
    background(255);
    game.tick();
};
