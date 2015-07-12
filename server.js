var express = require('express');
var app = express();
var jade = require('jade');
var config = require('./config.js');

var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('hello-express', {title: "hi", message: "Praise Helix!"});
});

var server = app.listen (config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
});