require('config');
require('shapes');
require('collisions');
require('resolver');

var Core = function() {
    var core = this;

    core.showPhysics = false;
    core.entities = {};
    core.animations = [];
    core.keysPressed = {};

    // This bit is used for the delta time to handle frame skips and slowdowns
    core.timing = {
        prev: new Date().getTime(),
        curr: null
    };

    core.generateEntityId = function(E) {
        var newId = guid();
        if(!game.entities[newId]) {
            E.id = guid();
            game.entities[newId] = E;
        } else
            core.generateEntityId(E);
    };

    core.resolver = new Resolver();
    core.collider = new Collider();

    // TODO: Implement something like spatial hashing to improve performance
    // Right now this function checks every entity with every entity,
    // making it redundant and not well optimized
    //
    // TODO: Don't check for entities in the 2nd for loop that already went
    // through the first for loop, or else every element gets checked twice,
    // once at first position and once in 2nd. Super redundant!
    core.detectCollisions = function() {
        var traversed = {};

        for (var i in core.entities) {
            var e1 = core.entities[i];
            traversed[e1.id] = true;

            for (var ii in core.entities) {
                var e2 = core.entities[ii];

                if(traversed[e2.id])
                    continue;

                if(core.collider.isColliding(e1, e2)) {
                    core.resolver.resolve(e1, e2);
                    //console.log(e1, ' and ', e2, ' are colliding.');
                }

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
                entity.velocity.x = lerp(entity.velocity.x, 0, entity.gravity.x);
                entity.velocity.x += entity.acceleration.x * elapsed + entity.gravity.x;
                entity.velocity.y += entity.acceleration.y * elapsed + entity.gravity.y;
                entity.position.x += entity.velocity.x * elapsed;
                entity.position.y += entity.velocity.y * elapsed;
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

    core.tick = function() {
        core.timing.curr = new Date().getTime();
        var diff = core.timing.curr - core.timing.prev;

        if(isActive) {
            core.positions.update(diff / 20);
            core.detectCollisions();
        }

        core.render.all();
        core.timing.prev = core.timing.curr;
    };
};

var game = new Core();
