// Some of the essential engine components were copied from
// https://www.ibm.com/developerworks/library/wa-build2dphysicsengine/
// as a base, but heavily modified.

// Some examples what the engine is capable of:

// We can easily create new physic entities, that interact with each other
var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(0, 200, 500, 200);
var b3 = new Box(500, 175, 500, 200);
var b4 = new Box(400, 100, 50, 50);

// If an entity is static it won't be pushed back when colliding, but can push
// other entities away. Two static objects don't interact with each other at all
b2.isStatic = true;
b3.isStatic = true;
b4.isStatic = true;

// By default the engine has a static camera at 0,0
// You can use game.activeCamera to access its functionality
// In this example we track the controllable box and set an offset
game.activeCamera.track(b1);
game.activeCamera.offset.x = -50;
game.activeCamera.offset.y = 100;

// We can make an entity temporarily invisible, this prevents it
// from interacting with anything
// b2.isVisible = false;
// b3.isVisible = false;

// We can use layers to render objects ontop of each other. By default every
// element sits on layer 1000, so you can move elements to the background or in
// front of the game scene.
// Elements only collide with other elements that are within 100 layers of each
// other. This allows you to have a foreground and background that have
// completely seperate physics, or only partially interact
b3.properties.set('layer', 1001);

// We can change the velocity, acceleration etc anywhere we want to.
// Either at the start to give them some initial momentum or on demand.
// Another example below changes the velocity of an entity when keys are
// pressed.
b1.gravity.y = 1;
b2.gravity.y = 0;
b3.gravity.y = 0;

// This shows us some graphs and stuff to visualize momentum and collisions
// Enabling this overwrites most colors, strokes etc you set
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
// anim.isRunning = true;
anim.isLooping = true;

// This is just a variable for the example below, so you can experiment with
// different velocities
var bvel = 5;

function draw() {

    // This bit allows you to control one of the rectangles by changing its
    // velocity when W, A, S, D or space is pressed
    if(input.devices.keyboard.isPressed(keys.SPACE)) {
        b1.velocity.y = -bvel * 2;
    }

    if(input.devices.keyboard.isPressed(keys.D)) {
        b1.velocity.x = bvel * 3;
    }

    if(input.devices.keyboard.isPressed(keys.A)) {
        b1.velocity.x = -bvel * 3;
    }

    if(input.devices.keyboard.isPressed(keys.S)) {
        b1.velocity.y = bvel;
    }

    if(input.devices.keyboard.isPressed(keys.W)) {
        b1.velocity.y = -bvel * 5;
    }

    // This is where the engine magic happens
    background(255);
    game.tick();
}
