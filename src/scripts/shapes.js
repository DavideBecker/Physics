// Responsible for rendering the differnet shapes

function Shapes() {
    var renderShape = {
        box: function(E) {
            rx = E.position.x;
            ry = E.position.y;
            fill(255, 0, 0);
            rect(rx, ry, E.size.width, E.size.height);
        }
    };

    var renderPhysicsOfShape = {
        box: function(E) {
            fill('#333');
            rect(E.position.x, E.position.y, E.size.width, E.size.height);
            stroke(70, 255, 33);
            strokeWeight(2);
            line(E.getMidX(), E.getMidY(), E.getMidX() + E.velocity.x * 5, E.getMidY() + E.velocity.y * 5);
            stroke('#00A0E2');
            line(E.getMidX(), E.getMidY(), E.getMidX() + E.acceleration.x * 25, E.getMidY() + E.acceleration.y * 25);
            stroke('#D42322');
            line(E.getMidX(), E.getMidY(), E.getMidX() + (E.velocity.x - E.acceleration.x) * 5, E.getMidY() + (E.velocity.y - E.acceleration.y) * 5);
            noStroke();
            fill('#444');
            text(
                "pos: " + E.position.x.toFixed(2) + ' | ' + E.position.y.toFixed(2)
                + "\nacc: " + E.acceleration.x.toFixed(2) + ' | ' + E.acceleration.y.toFixed(2)
                + "\nvel: " + E.velocity.x.toFixed(2) + ' | ' + E.velocity.y.toFixed(2),
                E.position.x,
                E.position.y + E.size.height + 14
             );
        }
    }

    this.render = function(E) {
        renderShape[E.getType()](E);
    }

    this.renderPhysicsOf = function(E) {
        renderPhysicsOfShape[E.getType()](E);
    }
}
