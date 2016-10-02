const path = require('path');
const config = require('config');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swig = require('swig');
const session = require('express-session');
const passport = require('passport');
const passportFacebook = require('passport-facebook');

const routeHome = require('./routes/index');
const routeContent = require('./routes/content');

const app = express();
const facebook = passportFacebook.Strategy;

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// view engine setup
app.engine('html', swig.renderFile);
app.set('view cache', false);
swig.setDefaults({cache: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// session setup
app.use(cookieParser());
app.use(session({
  secret: config.api.secret,
  saveUninitialized: true
}));

// auth setup
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(new facebook({
  clientID: config.facebook.appID,
  clientSecret: config.facebook.appSecret,
  callbackURL: config.facebook.authCallback
},
(accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  done(null, profile);
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  const session = req.session;
  session.isAuthenticated = session.passport && session.passport.user !== undefined;
  if (session.isAuthenticated) {
    res.locals.user = session.passport.user;
  }
  next();
});

// other middleware
app.use(favicon(path.join(__dirname, '/dist/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'dist'))); // Should be done by a reverse proxy

// routes setup
app.get('/auth', passport.authenticate('facebook'));
app.get(config.facebook.authCallback, passport.authenticate(
  'facebook',
  {successRedirect: '/', failureRedirect: '/auth', failureFlash: true}
));
app.get('/logout', (req, res) => {
  const session = req.session;
  if (session.passport) {
    const user = session.passport.user;
    res.redirect(`https://www.facebook.com/logout.php?next=${config.server.url}/logout-callback&access_token=${user.accessToken}`);
  }
});
app.get('/logout-callback', (req, res) => {
  req.session.isAuthenticated = false;
  req.logout();
  res.redirect('/auth');
});
app.use('/', routeHome);
app.use('/content', routeContent);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.url}`);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
