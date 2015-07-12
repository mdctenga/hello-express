var express = require('express');
var app = express();
var jade = require('jade');
var bodyParser = require('body-parser');
var config = require('./config.json');

var path = require('path');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var LocalStrategy = require ('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    var admin = config.admin;
    if (!admin){
      return done(new Error('No admin configured!'));
    }
    if (username !== admin.username) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== admin.password) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    return done(null, admin);
  })
);

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

app.use(passport.initialize());
// app.use(passport.session());

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

app.post('/login',
  passport.authenticate('local', {successRedirect: '/secret',
                                  failureRedirect: '/',
                                  session: false})
);

app.get('/secret', function(req, res, next) {
  res.send('SECRET!');
});

var server = app.listen (config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});