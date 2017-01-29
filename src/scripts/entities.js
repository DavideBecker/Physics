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

    this.collidesWith = {};

    var type = ty;

    this.getType = function() {
        return type;
    };

    this.setType = function(st) {
        if(types[st]) {
            type = types[st]
        } else {
            return false;
        }

        return true;
    }

    this.destroy = function() {
        game.entities.splice(this.id, 1);
    };

    var layer = 100;

    this.getLayer = function() {
        return layer;
    };

    this.changeLayer = function(lay) {
        layer = lay;
    };

    game.generateEntityId(this);
}

function Box(x, y, w, h) {
    var type = types.box;

    GameEntity.apply(this, [x, y, w, h, type]);
}
