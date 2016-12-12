

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
    this.Entity = new PhysicsEntity();

    this.setX = function (x) {
        this.Entity.x = x || 0;
    };

    this.setY = function (x) {
        this.Entity.y = y || 0;
    };

    this.setWidth = function (w) {
        this.Entity.width = w || 0;
    };

    this.setHeight = function (h) {
        this.Entity.height = h || 0;
    };

    this.setX(x);
    this.setY(y);
    this.setWidth(w);
    this.setHeight(h);
    this.Entity.updateHitbox();

    this.render = function (rx, ry) {
        rx = this.Entity.x;
        ry = this.Entity.y;
        fill(255, 0, 0);
        rect(rx, ry, this.Entity.width, this.Entity.height);
    };

    this.isCollidingWith = function (Entity) {
        var te = this.Entity;

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
        fill(50 + 200 * this.Entity.restitution, 50 + 200 * this.Entity.restitution, 0);
        rect(this.Entity.x, this.Entity.y, this.Entity.width, this.Entity.height);
        stroke(70, 255, 33);
        strokeWeight(3);
        line(this.Entity.getMidX(), this.Entity.getMidY(), this.Entity.getMidX() + this.Entity.vx * 3, this.Entity.getMidY() + this.Entity.vy * 3);
        noStroke();
    };

    this.destroy = function () {
        game.entities.splice(this.id, 1);
    };

    this.Entity.id = game.entities.length;
    game.entities[this.Entity.id] = this;
};
