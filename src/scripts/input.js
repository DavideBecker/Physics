function KeyboardInput() {
    var kb = this;
    kb._pressed = {};

    kb.keyPressed = function(e) {
        kb._pressed[e.keyCode] = true;
    };

    kb.keyReleased = function(e) {
        kb._pressed[e.keyCode] = false;
    };

    kb.isPressed = function(k) {
        if(kb._pressed[k])
            return true;
        return false;
    }
};

var keyboard = new KeyboardInput();

window.onload = function(){
    document.addEventListener("keydown", keyboard.keyPressed, false);
    document.addEventListener("keyup", keyboard.keyReleased, false);
}
