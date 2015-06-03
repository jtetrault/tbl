'use strict';

var mongoose = require('mongoose');
var path = require('path');

var loreSchema = mongoose.Schema({
  title: {type: String, required: true},
  link_name: {type: String, required: true, unique: true},
  text: {type: String, required: true},
  //image: {type: String, required: false},
});

var Lore = mongoose.model('Lore', loreSchema);

exports.Lore = Lore;
