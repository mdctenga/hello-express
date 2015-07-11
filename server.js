var express = require('express');
var app = express();
var jade = require('jade');
var config = require('./config.js');
console.log(config);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen (config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
});