var player = new Box(0, 0, 50, 50);

game.showPhysics = true;

game.activeCamera.track(player);
game.activeCamera.offset.x = -50;
game.activeCamera.offset.y = 100;

var progress = 0;
var score = 0;
var holding = 0;
var speed = 15;
var multiplier = 1;

var startPlatform = new Box(-50, 200, 1950, 100);
startPlatform.isStatic = true;

function rand(min, max) {
    return Math.random(min, max) * (max - min) + min;
}

function placeRandomObstackle() {
    if(rand(1, 3)) {
        var newObstackle = new Box(progress + 2000, 200, rand(2, 6) * 50, rand(2, 4) * 50);
        newObstackle.isStatic = true;
    }
}

placeRandomObstackle();

function draw() {
    if(input.devices.keyboard.isPressed(keys.SPACE) && (Object.keys(player.collidesWith).length || holding)) {
        player.velocity.y = -5;
        holding = 1;
    } else {
        holding = 0;
    }

    player.velocity.x = speed;

    // This is where the engine magic happens
    background(255);
    game.tick();
    progress = player.position.x
    score = Math.floor(progress / 10);
    fill(0);
    textSize(32);

    if(score % 50 == 0) {
        placeRandomObstackle();
        speed += 0.2;
    }

    if(player.position.y >= 650) {
        score = Math.round(score * multiplier);
        multiplier = multiplier.toString();
        speed = 0;
        background(255);
    } else {
        multiplier = Math.floor(speed) / 10;
    }

    text("SCORE: " + score + ' (x' + multiplier + ')', 5, 32);

    for(var index in game.entities) {
        var entity = game.entities[index];
        if(entity.position.x + entity.size.width - game.renderOffset.x <= 0 && entity.id != player.id) {
            delete game.entities[index];
        }
    }
}
