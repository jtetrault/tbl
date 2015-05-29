'use strict';

var mongoose = require('mongoose');
var hash = require('password-hash');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String },
  password: {type: String, set: function (newValue) {
    return hash.isHashed(newValue) ? newValue : hash.generate(newValue);
  }},
});

userSchema.statics.authenticate = function (username, password, cb) {
  this.findOne({username: username}, function (error, user) {
    if (error) {
      return cb(error);
    }
    if (user && hash.verify(password, user.password)) {
      cb(null, user);
    } else if (user || !error) {
      error = new Error("Your username or password is invalid. Please try again.");
      console.log('hello');
      error.status = 403;
      return cb(error, null);
    } else {
      return cb(error, null);
    }
  });
};

var User = mongoose.model('User', userSchema);

exports.User = User;