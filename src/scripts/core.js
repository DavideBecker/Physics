require('config');
require('shapes');
require('collisions');

function elasticResolve(Entitiy1, Entitiy2) {
    // TODO: Rewrite the whole resolve function to be more accurate
    // --> https://en.wikipedia.org/wiki/Elastic_collision
    //

    var pMidX = Entitiy1.getMidX();
    var pMidY = Entitiy1.getMidY();
    var aMidX = Entitiy2.getMidX();
    var aMidY = Entitiy2.getMidY();
    var dx = (aMidX - pMidX) / Entitiy2.halfWidth;
    var dy = (aMidY - pMidY) / Entitiy2.halfHeight;
    var absDX = abs(dx);
    var absDY = abs(dy);
    if (abs(absDX - absDY) < 0.1) {
        if (dx < 0) {
            Entitiy1.x = Entitiy2.getRight();
        } else {
            Entitiy1.x = Entitiy2.getLeft() - Entitiy1.width;
        }
        if (dy < 0) {
            Entitiy1.y = Entitiy2.getBottom();
        } else {
            Entitiy1.y = Entitiy2.getTop() - Entitiy1.height;
        }
        if (Math.random() < 0.5) {
            Entitiy1.vx = -Entitiy1.vx * Entitiy2.restitution;
            if (abs(Entitiy1.vx) < config.STICKY_THRESHOLD) {
                Entitiy1.vx = 0;
            }
        } else {
            Entitiy1.vy = -Entitiy1.vy * Entitiy2.restitution;
            if (abs(Entitiy1.vy) < config.STICKY_THRESHOLD) {
                Entitiy1.vy = 0;
            }
        }
    } else if (absDX > absDY) {
        if (dx < 0) {
            Entitiy1.x = Entitiy2.getRight();
        } else {
            Entitiy1.x = Entitiy2.getLeft() - Entitiy1.width;
        }
        Entitiy1.vx = -Entitiy1.vx * Entitiy2.restitution;
        if (abs(Entitiy1.vx) < config.STICKY_THRESHOLD) {
            Entitiy1.vx = 0;
        }
    } else {
        if (dy < 0) {
            Entitiy1.y = Entitiy2.getBottom();
        } else {
            Entitiy1.y = Entitiy2.getTop() - Entitiy1.height;
        }
        Entitiy1.vy = -Entitiy1.vy * Entitiy2.restitution;
        if (abs(Entitiy1.vy) < config.STICKY_THRESHOLD) {
            Entitiy1.vy = 0;
        }
    }
};


var Core = function() {
    var core = this;

    core.showPhysics = false;
    core.entities = {};
    core.animations = [];
    core.keysPressed = {};

    core.generateEntityId = function(E) {
        var newId = guid();
        if(!game.entities[newId]) {
            E.id = guid();
            game.entities[newId] = E;
        } else
            core.generateEntityId(E);
    };
    core.collider = new Collider();

    // TODO: Implement something like spatial hashing to improve performance
    // Right now this function checks every entity with every entity,
    // making it redundant and not well optimized
    //
    // TODO: Don't check for entities in the 2nd for loop that already went
    // through the first for loop, or else every element gets checked twice,
    // once at first position and once in 2nd. Super redundant!
    core.detectCollisions = function() {
        for (var i in core.entities) {
            var e1 = core.entities[i];
            for (var ii in core.entities) {
                var e2 = core.entities[ii];

                if(core.collider.isColliding(e1, e2))
                    console.log(e1, ' and ', e2, ' are colliding.');

                // if (c.isCollidingWith(e) && ce.id !== e.id) {
                //     if (ce.restitution === e.restitution) {
                //         elasticResolve(ce, e);
                //     }
                //     if (ce.restitution > e.restitution) {
                //         elasticResolve(ce, e);
                //     } else if (ce.restitution < e.restitution) {
                //         elasticResolve(e, ce);
                //     }
                // }
            }
        }
    };

    core.positions = {
        update: function(elapsed) {
            var entity;
            var entities = core.entities;
            for (var index in entities) {
                entity = entities[index];
                // TODO: Position calculation still feels a bit off
                entity.vx = lerp(entity.vx, 0, entity.gx);
                entity.vx += entity.ax * elapsed + entity.gx;
                entity.vy += entity.ay * elapsed + entity.gy;
                entity.x += entity.vx * elapsed;
                entity.y += entity.vy * elapsed;
            }
        }
    };

    core.shapeRenderer = new Shapes();

    core.render = {
        entities: function() {
            for (var index in core.entities) {
                var e = core.entities[index];
                core.shapeRenderer.render(e);
                if(core.showPhysics)
                    core.shapeRenderer.renderPhysicsOf(e);
            }
        },
        animations: function() {
            for (var index in core.animations) {
                core.animations[index].animate();
            }
        },
        all: function() {
            core.render.entities();
            core.render.animations();
        }
    };
};

var game = new Core();
