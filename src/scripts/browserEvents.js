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

    isActive = true;

    window.onfocus = function() {
        isActive = true;
        input.devices.keyboard._pressed = {};
    };

    window.onblur = function() {
        isActive = false;
    };
}
