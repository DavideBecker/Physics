'use strict';

// From http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4();
    }

function Properties() {
    var that = this;
    var _prop = {};

    that.set = function(key, value) {
        _prop[key] = value;
    }

    that.get = function(key) {
        return _prop[key];
    }
};

function KeyboardInput() {
    var that = this;

    that._pressed = {};

    that.keyPressed = function(event) {
        that._pressed[event.keyCode] = true;
    };

    that.keyReleased = function(event) {
        that._pressed[event.keyCode] = false;
    };

    that.isPressed = function(key) {
        if(that._pressed[key]) {
            return true;
        }

        return false;
    }
}

function ControllerInput(gamepadEvent) {
    var that = this;

    that._pressed = {};
    that.gpe = gamepadEvent();
}

function InputHandler() {
    this.devices = {
        keyboard: new KeyboardInput(),
        controller: {}
    }
}

var input = new InputHandler();

window.onload = function() {
    document.addEventListener('keydown', input.devices.keyboard.keyPressed, false);
    document.addEventListener('keyup', input.devices.keyboard.keyReleased, false);

    document.addEventListener('gamepadconnected', function(event) {
        console.info('New gamepad with ID #' + event.gamepad.id + ' connected');
        input.devices.gamepads[event.gamepad.id] = new ControllerInput(event.gamepad);
    });
    document.addEventListener('gamepaddisconnected', function(event) {
        console.info('Gamepad #' + event.gamepad.id + ' disconnected');
        delete input.devices.gamepads[event.gamepad.id];
    });
}

function Position(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function Size(w, h) {
    this.width = w || 0;
    this.height = h || 0;

    this.updateCenter = function() {
        this.center = new Position(this.width / 2, this.height / 2);
    }

    this.updateCenter();
}

function Velocity(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function Acceleration(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function Gravity(x, y) {
    this.x = x || config.GRAVITY_X;
    this.y = y || config.GRAVITY_Y;
}

function DimensionWrapper(pos, size, vel, acc, grav) {
    this.position = new Position(pos.x, pos.y);
    this.size = new Size(size.width, size.height);
    this.velocity = new Velocity(vel.x, vel.y);
    this.acceleration = new Acceleration(acc.x, acc.y);
    this.gravity = new Gravity(grav.x, grav.y);

    this.getTop = function() { return this.position.y; };
    this.getLeft = function() { return this.position.x; };
    this.getBottom = function() { return this.position.y + this.size.height; };
    this.getRight = function() { return this.position.x + this.size.width; };

    this.getMidX = function() { return this.position.x + this.size.center.x; };
    this.getMidY = function() { return this.position.y + this.size.center.y; };
}

var config = {
    STICKY_THRESHOLD: 0.001,
    GRAVITY_X: 0.5,
    GRAVITY_Y: 0.5,
    FPS: 60
};

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

var shapes = {
    box: 'box',
    //circle: "circle",
    //line: "line"
};

// Responsible for rendering the differnet shapes

function Shapes() {
    var renderShape = {
        box: function(E1) {
            var rx = E1.position.x;
            var ry = E1.position.y;

            noStroke();
            fill(55, 189, 255);
            rect(rx - game.renderOffset.x, ry + game.renderOffset.y, E1.size.width, E1.size.height);
        }
    };

    var renderPhysicsOfShape = {
        box: function(E1) {
            var pyX = E1.position.x - game.renderOffset.x;
            var pyY = E1.position.y + game.renderOffset.y;
            var pyMidX = E1.getMidX() - game.renderOffset.x;
            var pyMidY = E1.getMidY() + game.renderOffset.y;

            noStroke();
            fill('#333');
            rect(pyX, pyY, E1.size.width, E1.size.height);
            stroke(70, 255, 33);
            strokeWeight(2);
            line(
                pyMidX,
                pyMidY,
                pyMidX + E1.velocity.x * 5,
                pyMidY + E1.velocity.y * 5
            );
            stroke('#00A0E12');
            line(
                pyMidX,
                pyMidY,
                pyMidX + E1.acceleration.x * 25,
                pyMidY + E1.acceleration.y * 25
            );
            stroke('#D42322');
            line(
                pyMidX,
                pyMidY,
                pyMidX + E1.velocity.x - E1.acceleration.x * 5,
                pyMidY + E1.velocity.y - E1.acceleration.y * 5
            );
        }
    };

    function renderDebug(E1) {
        var pyMidX = E1.getMidX();
        var pyMidY = E1.getMidY();

        noStroke();
        fill('#33A6AA');
        text(
            'ID: ' + E1.id +
            '\nCollides with: ' + Object.keys(E1.collidesWith) +
            '\nShape: ' + E1.properties.get('shape') +
            '\nType: ' + E1.properties.get('type') +
            '\nPos: x-' + E1.position.x.toFixed(2) + ' | ' + E1.position.y.toFixed(2) +
            '\nAcc: ' + E1.acceleration.x.toFixed(2) + ' | ' + E1.acceleration.y.toFixed(2) +
            '\nVel: ' + E1.velocity.x.toFixed(2) + ' | ' + E1.velocity.y.toFixed(2),
            E1.position.x - game.renderOffset.x,
            E1.position.y + game.renderOffset.y + E1.size.height + 14
         );

        for(var collid in E1.collidesWith) {
            var E2 = E1.collidesWith[collid];

            stroke('#8C3EB5')
            line(
                E1.getMidX() - game.renderOffset.x,
                E1.getMidY() + game.renderOffset.y,
                E2.getMidX() - game.renderOffset.x,
                E2.getMidY() + game.renderOffset.y
            );
        }
    }

    this.render = function(E1) {
        renderShape[E1.properties.get('shape')](E1);
    }

    this.renderPhysicsOf = function(E1) {
        renderPhysicsOfShape[E1.properties.get('shape') ](E1);
    }

    this.renderDebugOf = function(E1) {
        renderDebug(E1);
    }
}

function Collider() {
    var detectors = {
        box2box: function(E1, E2) {
            var t1 = E1.getTop();
            var l1 = E1.getLeft();
            var b1 = E1.getBottom();
            var r1 = E1.getRight();

            var t2 = E2.getTop();
            var l2 = E2.getLeft();
            var b2 = E2.getBottom();
            var r2 = E2.getRight();

            if(E1.isStatic && E2.isStatic) {
                return false;
            }

            if(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
                return false;
            }

            E1.collidesWith[E2.id] = E2;
            E2.collidesWith[E1.id] = E1;

            return true;
        }
    };

    this.isColliding = function(E1, E2) {
        if(E1.id === E2.id) {
            return false;
        }

        var entities = [E1, E2];

        if(E1.properties.get('shape') > E2.properties.get('shape')) {
            entities = [E2, E1];
        }

        return detectors[entities[0].properties.get('shape') + '2' + entities[1].properties.get('shape')](E1, E2);
    }
}

// TODO: Implement elastic collisions
function Resolver() {
    var resolvers = {
        boxandbox: function(E1, E2) {
            var pyTop = E2.getTop() + game.renderOffset.y;
            var pyLeft = E2.getLeft() - game.renderOffset.x;
            var pyRight = E2.getRight() - game.renderOffset.x;
            var pyBottom = E2.getBottom() + game.renderOffset.y;

            fill(0);

            // Minkowski sum from
            // http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-collision-algorithm-that-also-determines-which-sides-that

            var w = 0.5 * (E1.size.width + E2.size.width);
            var h = 0.5 * (E1.size.height + E2.size.height);

            var dx = E1.getMidX() - E2.getMidX();
            var dy = E1.getMidY() - E2.getMidY();

            if(Math.abs(dx) <= w && Math.abs(dy) <= h) {
                // collision!
                var wy = w * dy;
                var hx = h * dx;

                noStroke();

                if(wy > hx) {
                    if(wy > -hx) {
                        // Bottom
                        E1.position.y = E2.getBottom();
                        E1.velocity.y = 0;
                        fill(0, 0, 255);
                        if(game.showPhysics) {
                            rect(pyLeft, pyBottom, E2.size.width, 5);
                        }
                    } else {
                        // Left
                        E1.position.x = E2.getLeft() - E1.size.width;
                        E1.velocity.x = 0;
                        fill(255, 255, 0);
                        if(game.showPhysics) {
                            rect(pyLeft - 5, pyTop, 5, E2.size.height);
                        }
                    }
                } else if(wy > -hx) {
                    // Right
                    E1.position.x = E2.getRight();
                    E1.velocity.x = 0;
                    fill(255, 0, 0);
                    if(game.showPhysics) {
                        rect(pyRight, pyTop, 5, E2.size.height);
                    }
                } else {
                    // Top
                    E1.position.y = E2.getTop() - E1.size.height;
                    E1.velocity.y = 0;
                    if(game.showPhysics) {
                        fill(0, 255, 0);
                        rect(pyLeft, pyTop - 5, E2.size.width, 5);
                    }
                }
            }
        }
    };

    this.resolve = function(E1, E2) {
        if(E1.id === E2.id) {
            return false;
        }

        var entities = [E1, E2];

        if(E1.properties.get('shape') > E2.properties.get('shape')) {
            entities = [E2, E1];
        }

        return resolvers[entities[0].properties.get('shape') + 'and' + entities[1].properties.get('shape')](E1, E2);
    }
}

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
            var E1;

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

function Camera(Obj) {
    var that = this;

    that.tracking = Obj || false;
    that.position = new Position();
    that.offset = new Position();
    that.scrollX = true;
    that.scrollY = false;
    var newOffset = new Position();

    that.setAsActiveCamera = function() {
        game.activeCamera = that;
    };

    that.track = function(NewObj) {
        that.tracking = NewObj;
    }

    that.update = function() {
        that.position = that.tracking.position;
        if(that.scrollX) {
            newOffset.x = that.position.x + that.offset.x
        } else {
            newOffset.x = that.offset.x;
        }

        if(that.scrollY) {
            newOffset.y = that.position.y + that.offset.y
        } else {
            newOffset.y = that.offset.y;
        }
    };

    that.render = function() {
        if(that.tracking) {
            that.update();
        }

        if(game.activeCamera.id === that.id) {
            game.renderOffset.x = newOffset.x;
            game.renderOffset.y = newOffset.y;
        }
    }

    game.generateUniqueId(that, game.cameras);
}

game.activeCamera = new Camera();

function PhysicsEntity(x, y, w, h) {
    DimensionWrapper.apply(this, [
        new Position(x, y),
        new Size(w, h),
        new Velocity(),
        new Acceleration(),
        new Gravity(),
    ]);

    this.restitution = 0.3;

    this.isStatic = false;
    this.isVisible = true;
}

function GameEntity(x, y, w, h, ty) {
    PhysicsEntity.apply(this, arguments);

    this.properties = new Properties();
    this.collidesWith = {};

    var shape = false;

    if(shapes[ty]) {
        shape = shapes[ty]
    } else {
        return false;
    }

    this.properties.set('shape', shape);
    this.properties.set('type', 'entity');
    this.properties.set('layer', 1000);

    this.destroy = function() {
        game.entities.splice(this.id, 1);
    };

    game.generateUniqueId(this, game.entities);
}

function Box(x, y, w, h) {
    var shape = shapes.box;

    GameEntity.apply(this, [x, y, w, h, shape]);
}

function Map() {
    var that = this;

    that.mapMatrix = [[]];
    that.tiles = [];
    that.tileSize = 50;

    that.getTileAt = function(x, y) {
        return mapMatrix[y][x];
    }

    that.setTileAt = function(x, y, tile) {
        var tileid = tile.maps[that.id] || tile;

        that.mapMatrix[y][x] = tileid;
    }

    that.renderMap = function() {
        for(var y in that.mapMatrix) {
            for(var x in that.mapMatrix) {
                var currentTileID = that.mapMatrix[x][y];

                if(currentTileID) {
                    // var currentTile = that.tiles[currentTileID];

                    fill(100);
                    rect(x * that.tileSize - game.renderOffset.x, y * that.tileSize + game.renderOffset.y, that.tileSize, that.tileSize);
                }
            }
        }
    }

    that.addTileToMap = function(T1) {
        return that.tiles.push(T1) - 1;
    }

    game.generateUniqueId(that, game.maps);
}

function Tile(InitialM1) {
    var that = this;

    that.maps = {};

    that.addToMap = function(M1) {
        that.maps[M1.id] = M1.addTileToMap(that);
    }

    if(InitialM1) {
        that.addToMap(InitialM1);
    }
}



// Bezier implementation from http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/


/** MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
 /**
 * KeySpline - use bezier curve for transition easing function
 * is inspired from Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 */
function KeySpline (bezier) {
    var mX1 = bezier[0];
    var mY1 = bezier[1];
    var mX2 = bezier[2];
    var mY2 = bezier[3];

    this.get = function(aX) {
        if (mX1 == mY1 && mX2 == mY2) return aX; // linear
        return CalcBezier(GetTForX(aX), mY1, mY2);
    }

    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1)      { return 3.0 * aA1; }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function CalcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function GetSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function GetTForX(aX) {
        // Newton raphson iteration
        var aGuessT = aX;
        for (var i = 0; i < 4; ++i) {
            var currentSlope = GetSlope(aGuessT, mX1, mX2);
            if (currentSlope == 0.0) return aGuessT;
            var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
}


function Animation(anim, duration, easing) {

    var bezierTransitions = {
        'ease':        [0.25, 0.1, 0.25, 1.0],
        'linear':      [0.00, 0.0, 1.00, 1.0],
        'ease-in':     [0.42, 0.0, 1.00, 1.0],
        'ease-out':    [0.00, 0.0, 0.58, 1.0],
        'ease-in-out': [0.42, 0.0, 0.58, 1.0]
    }

    this.duration = duration || 500;
    this.easing = bezierTransitions[easing] || bezierTransitions.ease;
    this.spline = new KeySpline(this.easing);

    this.frame = 1;
    this.frameDuration = this.duration / 1000 * config.FPS;
    this.progress = 0;
    this.isRunning = false;
    this.isLooping = false;

    var dir = 1;

    this.start = new Date().getTime();

    this.animate = function() {
        this.progress = this.frame / this.frameDuration;

        if(this.progress <= 0) {
            dir = 1;
            // console.log(new Date().getTime() - this.start)
        }

        if(this.isLooping) {
            this.progress *= 2;
        }

        if(this.isRunning) {
            if(this.progress <= 1) {
                anim(this.spline.get(this.progress));
                this.frame += dir;
            } else if(this.isLooping) {
                // this.frame = 1;
                anim(this.spline.get(this.progress));
                dir = -1;
                this.frame += dir;
                if(this.progress >= 2) {
                    this.frame = 1;
                }
            } else {
                anim(this.spline.get(1));
            }
        }
    };

    game.animations.push(this);
}

//require materials.js
