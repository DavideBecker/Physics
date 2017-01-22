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
    this.gy = config.GRAVITY_Y;
    this.restitution = 0.3;
    this.halfWidth = 0;
    this.halfHeight = 0;

    this.getTop = function() { return this.y; };
    this.getLeft = function() { return this.x; };
    this.getBottom = function() { return this.y + this.height; };
    this.getRight = function() { return this.x + this.width; };

    this.getMidX = function() { return this.x + this.halfWidth; };
    this.getMidY = function() { return this.y + this.halfHeight; };

    this.getCenterX = function() { return this.width / 2 };
    this.getCenterY = function() { return this.height / 2 };

    this.updateHitbox = function() {
        this.halfWidth = this.getCenterX();
        this.halfHeight = this.getCenterY();
    };

    // TODO: Simple function to approach specified coordinates
    this.moveTo = function(x, y) {

    };

    this.updateHitbox();
};

var GameEntity = function(x, y, w, h, t) {
    PhysicsEntity.apply(this, arguments);

    var type = t;

    this.getType = function() {
        return type;
    };

    this.setType = function(t) {
        if(types[t])
            type = types[t]
        else
            return false;
        return true;
    }

    this.destroy = function() {
        game.entities.splice(this.id, 1);
    };

    game.generateEntityId(this);
};

var Box = function(x, y, w, h) {
    var type = types.box;

    GameEntity.apply(this, [x, y, w, h, type]);
};
