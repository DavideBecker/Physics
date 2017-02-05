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
    that.maps = {};
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

            // Collision between two entities
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
            var E1 = null;

            var entities = that.entities;

            for(var e1id in entities) {
                E1 = entities[e1id];
                if(!E1.isVisible || E1.isStatic) {
                    continue;
                }
                // TODO: elapsed doesn't seem to be working as intended
                // E1.velocity.x = lerp(E1.velocity.x, 0, E1.gravity.x) * elapsed;
                E1.velocity.x += E1.acceleration.x;
                E1.velocity.x = lerp(E1.velocity.x, 0, config.GRAVITY_X);
                E1.velocity.y += E1.acceleration.y + E1.gravity.y;
                E1.position.x += E1.velocity.x * elapsed;
                E1.position.y += E1.velocity.y * elapsed;
                E1.pos = new Position(50, 50);

                if(!E1.properties.get('fixed')) {
                    E1.pos.x += that.renderOffset.x;
                    E1.pos.y += that.renderOffset.y;
                }
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
        maps: function() {
            for(var m1id in that.maps) {
                var M1 = that.maps[m1id];

                M1.renderMap();
            }
        },
        animations: function() {
            for(var index in that.animations) {
                that.animations[index].animate();
            }
        },
        all: function() {
            that.render.maps();
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
