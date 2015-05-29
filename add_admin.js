'use strict';

var express = require('express');
var prompt = require('prompt');
require('./components/mongoose_init');
var mongoose = require('mongoose');
var userModel = require('./models/user');

var schema = {
  properties: {
    username: {
      required: true
    },
    password: {
      hidden: true,
      required: true
    }
  }
}

prompt.start();

prompt.get(schema, function(err, result){
  console.log(result);
  var User = mongoose.model('User');
  var user = new User({
    username: result.username,
    password: result.password,
    roles: ['admin']
  });
  user.save(function (err){
    if (err) {
      console.log(err);
    } else {
      console.log('Created user %s with roles %s', user.username, user.roles);
    }
  })
});