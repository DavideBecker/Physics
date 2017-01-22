function Resolver() {
    var resolvers = {
        box_box: function(a, b) {
            fill(0);

            var wy = (a.width + b.width) * (a.getMidX() - b.getMidX());
            var hx = (a.height + b.height) * (a.getMidY() - b.getMidY());

            stroke(100);
            line(a.getMidX(), a.getMidY(), b.getMidX(), b.getMidY());

            if (wy > hx) {
                if (wy > -hx) {
                    // Right
                    // a.x = b.getRight() + 1;

                    fill(255, 0, 0);
                    rect(b.getRight(), b.getTop(), 5, b.height);
                } else {
                    // Top
                    // a.y = b.getTop() - 1 - a.height;
                    fill(0, 255, 0);
                    rect(b.getLeft(), b.getTop() - 5, b.width, 5);
                }
            } else {
                if (wy > -hx) {
                    // Bottom
                    // a.y = b.getBottom() + 1;
                    fill(0, 0, 255);
                    rect(b.getLeft(), b.getBottom(), b.width, 5);
                } else {
                    // Left
                    // a.x = b.getLeft() - 1 - a.width;
                    fill(255, 255, 0);
                    rect(b.getLeft() - 5, b.getTop(), 5, b.height);
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
