function Properties() {
    var that = this;
    var _props = {};

    that.set = function(key, value) {
        _props[key] = value;
    }

    that.get = function(key) {
        if(key) {
            return _props[key];
        }

        return _props;
    }
}
