var express = require('express');

var app = express();

app.use(function(req, res, next) {
    console.log(req.method + ' ' + req.path);
    next();
});

app.use(express.static('app'));

var server = app.listen(8000);

console.log("Server running at http://localhost:8000");
