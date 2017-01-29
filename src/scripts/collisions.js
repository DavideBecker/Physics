function Collider() {
    var detectors = {
        box2box: function(E1, E2) {
            var t1 = E1.getTop();
            var l1 = E1.getLeft();
            var b1 = E1.getBottom();
            var r1 = E1.getRight();

            var t2 = E2.getTop();
            var l2 = E2.getLeft();
            var b2 = E2.getBottom();
            var r2 = E2.getRight();

            if(E1.isStatic && E2.isStatic) {
                return false;
            }

            if(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
                return false;
            }

            E1.collidesWith[E2.id] = E2;
            E2.collidesWith[E1.id] = E1;

            return true;
        }
    };

    this.isColliding = function(E1, E2) {
        if(E1.id === E2.id) {
            return false;
        }

        var entities = [E1, E2];

        if(E1.type > E2.type) {
            entities = [E2, E1];
        }

        return detectors[entities[0].getType() + '2' + entities[1].getType()](E1, E2);
    }
}
