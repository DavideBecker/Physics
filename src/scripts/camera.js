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
