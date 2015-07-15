var mongoose = require('mongoose');
var path = require('path');

var playerSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  link_name: String,
  blurb: String,
  image: {type: String, required: false},
  attributes: [{key: String, value: String}]
});

playerSchema.methods.imageFsPath = function(filename) {
  return path.join('app', 'uploads', 'images', 'players', filename);
}

var Player = mongoose.model('Player', playerSchema);

exports.Player = Player;
