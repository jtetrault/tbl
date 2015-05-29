'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var https = require('https');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var config = require('config');
var passport = require('passport');

var mongoose = require('./components/mongoose_init');
require('./components/passport_init')
var players = require('./routes/players');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dsagsdfv34534v1432fdgw',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', passport.authenticate('local'));
app.post('/login', function (req, res, next) {
  if (req.user) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }
});

// Allow users to determine if they are authenticated
app.get('/authenticated', function (req, res, next) {
  if (req.user) {
    return res.status(200).send();
  }
  return res.status(403).send();
});
app.use('/', express.static('app'));

app.use('/players', players);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500).send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({
    message: err.message,
    error: {}
  });
});

if (config.get('server.https')) { // HTTPS server
  var httpsConfig = {
    key: fs.readFileSync(config.get('server.key')),
    cert: fs.readFileSync(config.get('server.cert'))
  };

  var server = https.createServer(httpsConfig, app).listen(config.get('server.port'), function() {
    var port = server.address().port;
    console.log('HTTPS server listening on port %s', port);
  });
  
} else {  // HTTP server
  var server = app.listen(config.get('server.port'), function () {
    var port = server.address().port;
    console.log('HTTP server listening on port %s', port);
  });
}
