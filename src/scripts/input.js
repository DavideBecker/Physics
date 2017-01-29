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

var keyboard = new KeyboardInput();

window.onload = function() {
    document.addEventListener('keydown', keyboard.keyPressed, false);
    document.addEventListener('keyup', keyboard.keyReleased, false);
}
