var PhysicsEntity = function (x, y, w, h) {
    DimensionWrapper.apply(this, [
        new Position(x, y),
        new Size(w, h),
        new Velocity(),
        new Acceleration(),
        new Gravity(),
    ]);

    this.restitution = 0.3;
    this.isStatic = false;
    this.layer = 100;
    this.isVisible = true;

    // TODO: Simple function to approach specified coordinates
    this.moveTo = function(x, y) {

    };
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
