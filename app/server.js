/**
 * @author Fernando
 */
var express = require('express');
var vlcControlIo = require('vlc-control-io');
var app = express();
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
app.use('/', express.static(__dirname + '/public'));

app.listen(3000, function() {
	console.log('listening');
});
