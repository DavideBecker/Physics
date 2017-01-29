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
