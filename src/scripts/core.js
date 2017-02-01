var isActive = true;

window.onfocus = function() {
    isActive = true;
    input.devices.keyboard._pressed = {};
};

window.onblur = function() {
    isActive = false;
};

function Core() {
    var that = this;

    that.showPhysics = false;
    that.entities = {};
    that.cameras = {};
    that.activeCamera = {};
    that.animations = [];
    that.renderOffset = new Position();

    that.resolver = new Resolver();
    that.collider = new Collider();
    that.shapes = new Shapes();

    // This bit is used for the delta time to handle frame skips and slowdowns
    that.timing = {
        prev: new Date().getTime(),
        curr: null
    };

    that.generateUniqueId = function(Obj, container) {
        var newId = guid();

        if(container[newId]) {
            that.generateUniqueId(Obj, container);
        } else {
            Obj.id = guid();
            container[newId] = Obj;
        }
    };

    // TODO: Implement something like spatial hashing to improve performance
    // Right now this function checks every entity with every entity,
    // making it redundant and not well optimized
    that.detectCollisions = function() {
        var traversed = {};

        for(var e1id in that.entities) {
            var E1 = that.entities[e1id];

            traversed[E1.id] = true;

            if(!E1.isVisible) {
                continue;
            }

            for(var e2id in that.entities) {
                var E2 = that.entities[e2id];

                if(traversed[E2.id] || !E2.isVisible) {
                    continue;
                }

                delete E1.collidesWith[E2.id];
                delete E2.collidesWith[E1.id];

                if(that.collider.isColliding(E1, E2)) {
                    that.resolver.resolve(E1, E2);
                    // console.log(e1, ' and ', e2, ' are colliding.');
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

    that.positions = {
        update: function(elapsed) {
            var entity;

            var entities = that.entities;

            for(var index in entities) {
                entity = entities[index];
                if(!entity.isVisible || entity.isStatic) {
                    continue;
                }
                // TODO: elapsed doesn't seem to be working as intended
                // entity.velocity.x = lerp(entity.velocity.x, 0, entity.gravity.x) * elapsed;
                entity.velocity.x += entity.acceleration.x;
                entity.velocity.x = lerp(entity.velocity.x, 0, config.GRAVITY_X);
                entity.velocity.y += entity.acceleration.y + entity.gravity.y;
                entity.position.x += entity.velocity.x * elapsed;
                entity.position.y += entity.velocity.y * elapsed;
            }
        }
    };

    that.render = {
        entities: function() {
            for(var e1id in that.entities) {
                var E1 = that.entities[e1id];

                if(!E1.isVisible) {
                    continue;
                }
                that.shapes.render(E1);
                if(that.showPhysics) {
                    that.shapes.renderPhysicsOf(E1);
                }
            }

            if(that.showPhysics) {
                for(var e1idpy in that.entities) {
                    var E1py = that.entities[e1idpy];

                    if(!E1py.isVisible) {
                        continue;
                    }
                    that.shapes.renderDebugOf(E1py);
                }
            }
        },
        animations: function() {
            for(var index in that.animations) {
                that.animations[index].animate();
            }
        },
        all: function() {
            that.render.entities();
            that.render.animations();
        }
    };

    that.tick = function() {
        that.timing.curr = new Date().getTime();
        var diff = that.timing.curr - that.timing.prev;

        if(isActive) {
            that.positions.update(diff / 20);
            that.detectCollisions();
        }

        that.activeCamera.render();
        that.render.all();
        that.timing.prev = that.timing.curr;
    };
}

var game = new Core();
