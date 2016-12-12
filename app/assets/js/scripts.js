var STICKY_THRESHOLD = 0.001;
var GRAVITY_X = 0.5;
var GRAVITY_Y = 0.5;

var keys = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,

    SPACE: 32,
    ENTER: 13,
    ESCAPE: 27,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,

    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
}


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
                var ce = c;
                for (var ii in engine.entities) {
                    var e = engine.entities[ii];
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
                entity = entities[index];
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





var PhysicsEntity = function (x, y, w, h) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = w || 0;
    this.height = h || 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.gx = 0;
    this.gy = GRAVITY_Y;
    this.restitution = 0.3;
    this.halfWidth = 0;
    this.halfHeight = 0;

    this.getTop = function () { return this.y; };
    this.getLeft = function () { return this.x; };
    this.getBottom = function () { return this.y + this.height; };
    this.getRight = function () { return this.x + this.width; };

    this.getMidX = function () { return this.x + this.halfWidth; };
    this.getMidY = function () { return this.y + this.halfHeight; };

    this.updateHitbox = function () {
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    };

    this.updateHitbox();
};



var Box = function (x, y, w, h) {
    PhysicsEntity.apply(this, arguments);

    this.setX = function (x) {
        this.x = x || 0;
    };

    this.setY = function (x) {
        this.y = y || 0;
    };

    this.setWidth = function (w) {
        this.width = w || 0;
    };

    this.setHeight = function (h) {
        this.height = h || 0;
    };

    this.setX(x);
    this.setY(y);
    this.setWidth(w);
    this.setHeight(h);
    this.updateHitbox();

    this.render = function (rx, ry) {
        rx = this.x;
        ry = this.y;
        fill(255, 0, 0);
        rect(rx, ry, this.width, this.height);
    };

    this.isCollidingWith = function (Entity) {
        var te = this;

        var t1 = te.getTop();
        var l1 = te.getLeft();
        var b1 = te.getBottom();
        var r1 = te.getRight();

        var t2 = Entity.getTop();
        var l2 = Entity.getLeft();
        var b2 = Entity.getBottom();
        var r2 = Entity.getRight();
        if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
            return false;
        }
        return true;
    };

    this.showPhysics = function () {
        fill(50 + 200 * this.restitution, 50 + 200 * this.restitution, 0);
        rect(this.x, this.y, this.width, this.height);
        stroke(70, 255, 33);
        strokeWeight(3);
        line(this.getMidX(), this.getMidY(), this.getMidX() + this.vx * 3, this.getMidY() + this.vy * 3);
        noStroke();
    };

    this.destroy = function () {
        game.entities.splice(this.id, 1);
    };

    this.id = game.entities.length;
    game.entities[this.id] = this;
};



//require('materials');

var keysDown = {};

var b1 = new Box(50, 100, 50, 50);
var b2 = new Box(250, 100, 50, 50);

game.showPhysics = true;

b1.gy = 0;
b1.ax = 0.01;

b2.gy = 0;
b2.ax = -0.5;

function setup() {
    createCanvas(windowWidth - 10, windowHeight - 10);
}

function keyPressed() {
    keysDown[keyCode] = true;
};

function keyReleased() {
    keysDown[keyCode] = false;
};

function draw() {

    if (keysDown[keys.SPACE]) {
        b1.vy = -12;
    }

    if (keysDown[keys.D]) {
        b1.vx = 3;
    }

    if (keysDown[keys.A]) {
        b1.vx = -3;
    }

    if (keysDown[keys.S]) {
        b1.vy = 3;
    }

    if (keysDown[keys.W]) {
        b1.vy = -3;
    }

    background(255);
    game.positions.update(1);
    game.collider.detectCollisions();
    game.render.all();
};
//@ sourceMappingURL=..\..\..\app\assets\js\js.map