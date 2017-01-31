function Properties() {
    var that = this;
    var _prop = {};

    that.set = function(key, value) {
        _prop[key] = value;
    }

    that.get = function(key) {
        return _prop[key];
    }
};
