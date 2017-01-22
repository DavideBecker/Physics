// Responsible for rendering the differnet shapes

function Shapes() {
    var renderShape = {
        box: function(E) {
            rx = E.x;
            ry = E.y;
            fill(255, 0, 0);
            rect(rx, ry, E.width, E.height);
        }
    };

    var renderPhysicsOfShape = {
        box: function(E) {
            fill('#333');
            rect(E.x, E.y, E.width, E.height);
            stroke(70, 255, 33);
            strokeWeight(2);
            line(E.getMidX(), E.getMidY(), E.getMidX() + E.vx * 5, E.getMidY() + E.vy * 5);
            stroke('#00A0E2');
            line(E.getMidX(), E.getMidY(), E.getMidX() + E.ax * 25, E.getMidY() + E.ay * 25);
            stroke('#D42322');
            line(E.getMidX(), E.getMidY(), E.getMidX() + (E.vx - E.ax) * 5, E.getMidY() + (E.vy - E.ay) * 5);
            noStroke();
            fill('#444');
            text(
                "pos: " + E.x.toFixed(2) + ' | ' + E.y.toFixed(2)
                + "\nacc: " + E.ax.toFixed(2) + ' | ' + E.ay.toFixed(2)
                + "\nvel: " + E.vx.toFixed(2) + ' | ' + E.vy.toFixed(2),
                E.x,
                E.y + E.height + 14
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
