'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var passportLocalStrategy = require('passport-local');
var User = mongoose.model('User');

var authStrategy = new passportLocalStrategy(
  function (username, password, done) {
    User.authenticate(username, password, function (error, user) {
      return done(error, user, error ? error.message : null);
    });
  }
);

var authSerializer = function(user, done) {
  done(null, user.id);
};

var authDeserializer = function(id, done) {
  User.findById(id, function (error, user) {
    done(error, user);
  });
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);
