var STICKY_THRESHOLD = 0.001;
var GRAVITY_X = 0.5;
var GRAVITY_Y = 0.5;


function elasticResolve(Entitiy1, Entitiy2) {
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
            if (abs(Entitiy1.vx) < STICKY_THRESHOLD) {
                Entitiy1.vx = 0;
            }
        } else {
            Entitiy1.vy = -Entitiy1.vy * Entitiy2.restitution;
            if (abs(Entitiy1.vy) < STICKY_THRESHOLD) {
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
        if (abs(Entitiy1.vx) < STICKY_THRESHOLD) {
            Entitiy1.vx = 0;
        }
    } else {
        if (dy < 0) {
            Entitiy1.y = Entitiy2.getBottom();
        } else {
            Entitiy1.y = Entitiy2.getTop() - Entitiy1.height;
        }
        Entitiy1.vy = -Entitiy1.vy * Entitiy2.restitution;
        if (abs(Entitiy1.vy) < STICKY_THRESHOLD) {
            Entitiy1.vy = 0;
        }
    }
};


var Engine = function () {
    var engine = this;
    
    engine.showPhysics = false;
    engine.entities = [];

    engine.collider = {
        detectCollisions: function () {
            for (var i in engine.entities) {
                var c = engine.entities[i]
                var ce = c.Entity;
                for (var ii in engine.entities) {
                    var e = engine.entities[ii].Entity;
                    if (c.isCollidingWith(e) && ce.id !== e.id) {
                        if (ce.restitution === e.restitution) {
                            elasticResolve(ce, e);
                        }
                        if (ce.restitution > e.restitution) {
                            elasticResolve(ce, e);
                        } else if (ce.restitution < e.restitution) {
                            elasticResolve(e, ce);
                        }
                    }
                }
            }
        }
    };

    engine.positions = {
        update: function (elapsed) {
            var entity;
            var entities = engine.entities;
            for (var index in entities) {
                entity = entities[index].Entity;
                entity.vx = lerp(entity.vx, 0, 0.1);
                entity.vx += entity.ax * elapsed + entity.gx;
                entity.vy += entity.ay * elapsed + entity.gy;
                entity.x += entity.vx * elapsed;
                entity.y += entity.vy * elapsed;
            }
        }
    };

    engine.render = {
        all: function () {
            for (var index in engine.entities) {
                var e = engine.entities[index];
                e.render();
                if (engine.showPhysics) {
                    e.showPhysics();
                }
            }
        }
    };
};

var game = new Engine();
