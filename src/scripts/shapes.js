// Responsible for rendering the differnet shapes

function Shapes() {
    var renderShape = {
        box: function(E1) {
            var rx = E1.position.x;
            var ry = E1.position.y;

            noStroke();
            fill(255, 0, 0);
            rect(rx - game.renderOffset.x, ry + game.renderOffset.y, E1.size.width, E1.size.height);
        }
    };

    var renderPhysicsOfShape = {
        box: function(E1) {
            var pyX = E1.position.x - game.renderOffset.x;
            var pyY = E1.position.y + game.renderOffset.y;
            var pyMidX = E1.getMidX() - game.renderOffset.x;
            var pyMidY = E1.getMidY() + game.renderOffset.y;

            noStroke();
            fill('#333');
            rect(pyX, pyY, E1.size.width, E1.size.height);
            stroke(70, 255, 33);
            strokeWeight(2);
            line(
                pyMidX,
                pyMidY,
                pyMidX + E1.velocity.x * 5,
                pyMidY + E1.velocity.y * 5
            );
            stroke('#00A0E12');
            line(
                pyMidX,
                pyMidY,
                pyMidX + E1.acceleration.x * 25,
                pyMidY + E1.acceleration.y * 25
            );
            stroke('#D42322');
            line(
                pyMidX,
                pyMidY,
                pyMidX + E1.velocity.x - E1.acceleration.x * 5,
                pyMidY + E1.velocity.y - E1.acceleration.y * 5
            );
        }
    };

    function renderDebug(E1) {
        var pyMidX = E1.getMidX();
        var pyMidY = E1.getMidY();

        noStroke();
        fill('#33A6AA');
        text(
            'ID: ' + E1.id +
            '\nCollides with: ' + Object.keys(E1.collidesWith) +
            '\nShape: ' + E1.properties.get('shape') +
            '\nType: ' + E1.properties.get('type') +
            '\nPos: x-' + E1.position.x.toFixed(2) + ' | ' + E1.position.y.toFixed(2) +
            '\nAcc: ' + E1.acceleration.x.toFixed(2) + ' | ' + E1.acceleration.y.toFixed(2) +
            '\nVel: ' + E1.velocity.x.toFixed(2) + ' | ' + E1.velocity.y.toFixed(2),
            E1.position.x - game.renderOffset.x,
            E1.position.y + game.renderOffset.y + E1.size.height + 14
         );

        for(var collid in E1.collidesWith) {
            var E2 = E1.collidesWith[collid];

            stroke('#8C3EB5')
            line(
                E1.getMidX() - game.renderOffset.x,
                E1.getMidY() + game.renderOffset.y,
                E2.getMidX() - game.renderOffset.x,
                E2.getMidY() + game.renderOffset.y
            );
        }
    }

    this.render = function(E1) {
        renderShape[E1.properties.get('shape')](E1);
    }

    this.renderPhysicsOf = function(E1) {
        renderPhysicsOfShape[E1.properties.get('shape') ](E1);
    }

    this.renderDebugOf = function(E1) {
        renderDebug(E1);
    }
}
