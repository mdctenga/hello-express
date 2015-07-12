var express = require('express');
var app = express();
var jade = require('jade');
var bodyParser = require('body-parser');
var config = require('./config.json');

var path = require('path');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

//after static, but before routes
app.use(session({
  store: new RedisStore(),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 1000// 10 seconds
  }
}));

app.use(function (req, res, next) {
  var session = req.session;

  if (session.views) {
    session.views += 1;
  } else {
    session.views = 1;
  }

  console.log('viewed ', session.views );
  next();
});

app.get('/', function (req, res) {
  res.render('hello-express', {
                                title: "Login",
                                user: req.session.user
                              });
});

app.post('/sign-in', function (req, res) {
  var userName = req.body.userName;

  if (userName) {
    req.session.user = userName;
  }

  res.redirect('/');
});

var server = app.listen (config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});