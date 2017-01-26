function Resolver() {
    var resolvers = {
        box_box: function(a, b) {
            fill(0);

            // Minkowski sum from
            // http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-collision-algorithm-that-also-determines-which-sides-that

            var w = 0.5 * (a.size.width + b.size.width);
            var h = 0.5 * (a.size.height + b.size.height);

            var dx = a.getMidX() - b.getMidX();
            var dy = a.getMidY() - b.getMidY();

            if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
                /* collision! */
                var wy = w * dy;
                var hx = h * dx;

                if (wy > hx) {
                    if (wy > -hx) {
                        // Bottom
                        a.position.y = b.getBottom();
                        fill(0, 0, 255);
                        rect(b.getLeft(), b.getBottom(), b.size.width, 5);
                    } else {
                        // Left
                        a.position.x = b.getLeft() - a.size.width;
                        fill(255, 255, 0);
                        rect(b.getLeft() - 5, b.getTop(), 5, b.size.height);
                    }
                } else {
                    if (wy > -hx) {
                        // Right
                        a.position.x = b.getRight();

                        fill(255, 0, 0);
                        rect(b.getRight(), b.getTop(), 5, b.size.height);
                    } else {
                        // Top
                        a.position.y = b.getTop() - a.size.height;
                        fill(0, 255, 0);
                        rect(b.getLeft(), b.getTop() - 5, b.size.width, 5);
                    }
                }
            }
        }
    };

    this.resolve = function(E1, E2) {
        if(E1.id === E2.id)
            return false;

        var entities = [E1, E2];

        if(E1.type > E2.type)
            entities = [E2, E1];

        return resolvers[entities[0].getType() + '_' + entities[1].getType()](E1, E2);
    }
};
