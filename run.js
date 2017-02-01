var express = require('express');
var colors = require('colors');
var argv = require('optimist').argv;
var portfinder = require('portfinder');

var port = argv.p;
var logger = argv.l;
var log = console.log;
var app = express();

if(!argv.p) {
    portfinder.basePort = 8080;
    portfinder.getPort(function(err, port) {
        if(err) {
            throw err
        }

        listen(port);
    });
} else {
        listen(port);
}

function listen(port) {

    app.use(express.static('app'));
    var server = app.listen(port);

    log('Starting up Server, serving '.yellow
        + __dirname.green
        + ' on port: '.yellow
        + port.toString().cyan);

    log('Hit CTRL-C to stop the server');

}

app.use(function(req, res, next) {
    console.log(req.method + ' ' + req.path);
    next();
});
