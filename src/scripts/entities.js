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
