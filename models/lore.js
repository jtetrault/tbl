'use strict';

var mongoose = require('mongoose');
var path = require('path');

var imageSchema = mongoose.Schema({
  extension: {type: String, required: true},
  caption: String,
  path: String
});

var loreSchema = mongoose.Schema({
  title: {type: String, required: true},
  link_name: {type: String, required: true, unique: true},
  text: {type: String, required: true},
  images: [imageSchema],
});

loreSchema.methods.imageFsDir = function() {
  return path.join('app', 'uploads', 'images', 'lore', this._id.toString());
};

loreSchema.methods.imageFsPath = function(image) {
  return path.join('app', 'uploads', 'images', 'lore', this._id.toString(), image._id.toString() + '.' + image.extension);
}

loreSchema.methods.imageWebPath = function(image) {
  return path.join('uploads', 'images', 'lore', this._id.toString(), image._id.toString() + '.' + image.extension);
}

var Lore = mongoose.model('Lore', loreSchema);

exports.Lore = Lore;
