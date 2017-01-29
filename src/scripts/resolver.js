// TODO: Implement elastic collisions
function Resolver() {
    var resolvers = {
        boxandbox: function(E1, E2) {
            fill(0);

            // Minkowski sum from
            // http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-collision-algorithm-that-also-determines-which-sides-that

            var w = 0.5 * (E1.size.width + E2.size.width);
            var h = 0.5 * (E1.size.height + E2.size.height);

            var dx = E1.getMidX() - E2.getMidX();
            var dy = E1.getMidY() - E2.getMidY();

            if(Math.abs(dx) <= w && Math.abs(dy) <= h) {
                // collision!
                var wy = w * dy;
                var hx = h * dx;

                if(wy > hx) {
                    if(wy > -hx) {
                        // Bottom
                        E1.position.y = E2.getBottom();
                        E1.velocity.y = 0;
                        fill(0, 0, 255);
                        if(game.showPhysics) {
                            rect(E2.getLeft(), E2.getBottom(), E2.size.width, 5);
                        }
                    } else {
                        // Left
                        E1.position.x = E2.getLeft() - E1.size.width;
                        E1.velocity.x = 0;
                        fill(255, 255, 0);
                        if(game.showPhysics) {
                            rect(E2.getLeft() - 5, E2.getTop(), 5, E2.size.height);
                        }
                    }
                } else if(wy > -hx) {
                    // Right
                    E1.position.x = E2.getRight();
                    E1.velocity.x = 0;
                    fill(255, 0, 0);
                    if(game.showPhysics) {
                        rect(E2.getRight(), E2.getTop(), 5, E2.size.height);
                    }
                } else {
                    // Top
                    E1.position.y = E2.getTop() - E1.size.height;
                    E1.velocity.y = 0;
                    if(game.showPhysics) {
                        fill(0, 255, 0);
                        rect(E2.getLeft(), E2.getTop() - 5, E2.size.width, 5);
                    }
                }
            }
        }
    };

    this.resolve = function(E1, E2) {
        if(E1.id === E2.id) {
            return false;
        }

        var entities = [E1, E2];

        if(E1.type > E2.type) {
            entities = [E2, E1];
        }

        return resolvers[entities[0].getType() + 'and' + entities[1].getType()](E1, E2);
    }
}
