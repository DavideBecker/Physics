function Map() {
    var that = this;

    that.mapMatrix = [[]];
    that.tiles = [];
    that.tileSize = 50;

    that.getTileAt = function(x, y, full) {
        var fullTileObject = full || false;

        if(that.tileAt(x, y)) {
            var T1 = that.mapMatrix[y][x];

            if(!fullTileObject) {
                var instance = T1.entityInstances[that.id];

                instance.position.x = x * that.tileSize;
                instance.position.y = y * that.tileSize;
                instance.size.width = that.tileSize;
                instance.size.height = that.tileSize;

                return instance;
            }

            return T1;
        }

        return false;
    }

    that.tileAt = function(x, y) {
        if(!that.mapMatrix[y]) {
            return false
        }

        if(!that.mapMatrix[y][x]) {
            return false;
        }

        return true;
    }

    that.setTileAt = function(x, y, tile) {
        if(!that.mapMatrix[y]) {
            that.mapMatrix[y] = [];
        }

        that.mapMatrix[y][x] = tile;
    }

    that.traverseTiles = function(fn) {
        for(var y in that.mapMatrix) {
            var ty = that.mapMatrix[y];
            //console.log(ty)

            for(var x in ty) {
                var T1 = that.mapMatrix[y][x];

                if(T1 !== undefined) {
                    fn(x, y, T1.entityInstances[that.id]);
                }
                //rect(x * that.tileSize, y * that.tileSize, that.tileSize, that.tileSize);
            }
        }
    }

    that.renderMap = function() {
        that.traverseTiles(function(x, y) {
            fill(100);
            rect(
                x * that.tileSize - game.renderOffset.x,
                y * that.tileSize + game.renderOffset.y,
                that.tileSize,
                that.tileSize
            );
        })
    }

    that.addTileToMap = function(T1) {
        return that.tiles.push(T1) - 1;
    }

    // that.import = function(file) {
    //     var tmpCanvas = document.createElement('canvas');
    // }

    game.generateUniqueId(that, game.maps);
}

function Tile(InitialM1) {
    var that = this;

    that.entityInstances = {};

    that.maps = {};

    that.addToMap = function(M1) {
        that.entityInstances[M1.id] = new GameEntity();
        var inst = that.entityInstances[M1.id];

        inst.properties.set('shape', 'box');
        inst.properties.set('type', 'tile');
        inst.id = that.id;

        that.maps[M1.id] = M1.addTileToMap(that);
    }

    game.generateUniqueId(that, game.tiles);

    if(InitialM1) {
        that.addToMap(InitialM1);
    }
}
