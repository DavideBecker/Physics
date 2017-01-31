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

    if(types[ty]) {
        var type = types[ty]
    } else {
        return false;
    }

    this.properties.set('type', type);
    this.properties.set('layer', 1000);

    this.destroy = function() {
        game.entities.splice(this.id, 1);
    };

    game.generateUniqueId(this, game.entities);
}

function Box(x, y, w, h) {
    var type = types.box;

    GameEntity.apply(this, [x, y, w, h, type]);
}
