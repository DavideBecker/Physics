function Map() {
    var that = this;

    that.mapMatrix = [[]];
    that.tiles = [];
    that.tileSize = 50;

    that.getTileAt = function(x, y) {
        return mapMatrix[y][x];
    }

    that.setTileAt = function(x, y, tile) {
        var tileid = tile.maps[that.id] || tile;

        that.mapMatrix[y][x] = tileid;
    }

    that.renderMap = function() {
        for(var y in that.mapMatrix) {
            for(var x in that.mapMatrix) {
                var currentTileID = that.mapMatrix[x][y];

                if(currentTileID) {
                    // var currentTile = that.tiles[currentTileID];

                    fill(100);
                    rect(x * that.tileSize - game.renderOffset.x, y * that.tileSize + game.renderOffset.y, that.tileSize, that.tileSize);
                }
            }
        }
    }

    that.addTileToMap = function(T1) {
        return that.tiles.push(T1) - 1;
    }

    game.generateUniqueId(that, game.maps);
}

function Tile(InitialM1) {
    var that = this;

    that.maps = {};

    that.addToMap = function(M1) {
        that.maps[M1.id] = M1.addTileToMap(that);
    }

    if(InitialM1) {
        that.addToMap(InitialM1);
    }
}
