function Collider() {
    var detectors = {
        box2box: function(a, b) {
            var t1 = a.getTop();
            var l1 = a.getLeft();
            var b1 = a.getBottom();
            var r1 = a.getRight();

            var t2 = b.getTop();
            var l2 = b.getLeft();
            var b2 = b.getBottom();
            var r2 = b.getRight();

            if(a.isStatic && b.isStatic)
                return false;

            if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
                return false;
            }
            return true;
        }
    };

    this.isColliding = function(E1, E2) {
        if(E1.id === E2.id)
            return false;

        var entities = [E1, E2];

        if(E1.type > E2.type)
            entities = [E2, E1];

        return detectors[entities[0].getType() + '2' + entities[1].getType()](E1, E2);
    }
};
