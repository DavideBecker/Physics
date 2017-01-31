'use strict';

// For the example we will use neuter to insert the engine directly into this
// js file, but it can just as well be included in a html <script> tag
require('engine');

// Anything that uses p5.js' core values should be set in the setup() function
function setup() {
    frameRate(config.FPS);
    createCanvas(windowWidth - 5, windowHeight - 5);
}

// This should always be in your code to adapt the size of the canvas to the
// browser window
function windowResized() {
  resizeCanvas(windowWidth - 5, windowHeight - 5);
}


 require('demo/introduction');
// require('demo/runner');
