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

window.onload = function() {
    document.addEventListener('keydown', input.devices.keyboard.keyPressed, false);
    document.addEventListener('keyup', input.devices.keyboard.keyReleased, false);

    document.addEventListener('gamepadconnected', function(event) {
        console.info('New gamepad with ID #' + event.gamepad.id + ' connected');
        input.devices.gamepads[event.gamepad.id] = new ControllerInput(event.gamepad);
    });
    document.addEventListener('gamepaddisconnected', function(event) {
        console.info('Gamepad #' + event.gamepad.id + ' disconnected');
        delete input.devices.gamepads[event.gamepad.id];
    });
}
