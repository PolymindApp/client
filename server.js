var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

app = express();
app.use(serveStatic(__dirname + "/dist"));
app.get('*', function(request, response, next) {
	response.sendfile(__dirname + '/dist/index.html');
});

var port = process.env.PORT || 5000;
app.listen(port);
