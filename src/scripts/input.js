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
