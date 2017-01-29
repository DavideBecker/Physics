// Responsible for rendering the differnet shapes

function Shapes() {
    var renderShape = {
        box: function(E1) {
            var rx = E1.position.x;
            var ry = E1.position.y;

            noStroke();
            fill(255, 0, 0);
            rect(rx, ry, E1.size.width, E1.size.height);
        }
    };

    var renderPhysicsOfShape = {
        box: function(E1) {
            noStroke();
            fill('#333');
            rect(E1.position.x, E1.position.y, E1.size.width, E1.size.height);
            stroke(70, 255, 33);
            strokeWeight(2);
            line(
                E1.getMidX(),
                E1.getMidY(),
                E1.getMidX() + E1.velocity.x * 5,
                E1.getMidY() + E1.velocity.y * 5
            );
            stroke('#00A0E12');
            line(
                E1.getMidX(),
                E1.getMidY(),
                E1.getMidX() + E1.acceleration.x * 25,
                E1.getMidY() + E1.acceleration.y * 25
            );
            stroke('#D42322');
            line(
                E1.getMidX(),
                E1.getMidY(),
                E1.getMidX() + E1.velocity.x - E1.acceleration.x * 5,
                E1.getMidY() + E1.velocity.y - E1.acceleration.y * 5
            );
        }
    };

    function renderDebug(E1) {
        noStroke();
        fill('#33A6AA');
        text(
            'id: ' + E1.id +
            '\ncollides with: ' + Object.keys(E1.collidesWith) +
            '\ntype: ' + E1.getType() +
            '\npos: ' + E1.position.x.toFixed(2) + ' | ' + E1.position.y.toFixed(2) +
            '\nacc: ' + E1.acceleration.x.toFixed(2) + ' | ' + E1.acceleration.y.toFixed(2) +
            '\nvel: ' + E1.velocity.x.toFixed(2) + ' | ' + E1.velocity.y.toFixed(2),
            E1.position.x,
            E1.position.y + E1.size.height + 14
         );

        for(var collid in E1.collidesWith) {
            var E2 = E1.collidesWith[collid];

            stroke('#8C3EB5')
            line(E1.getMidX(), E1.getMidY(), E2.getMidX(), E2.getMidY());
        }
    }

    this.render = function(E1) {
        renderShape[E1.getType()](E1);
    }

    this.renderPhysicsOf = function(E1) {
        renderPhysicsOfShape[E1.getType()](E1);
    }

    this.renderDebugOf = function(E1) {
        renderDebug(E1);
    }
}
