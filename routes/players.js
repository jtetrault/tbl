'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

function allPlayers (req, res, next) {
  Player.find(function (err, players) {
    if (err) {
      next(err);
    }
    res.json(players);
  });  
}

/* Unauthenticated Requests */

router.get('/', allPlayers);

router.get('/:link_name', function(req, res, next) {
  Player.findOne({link_name: req.params.link_name}, function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return next(new Error('Player not found'));
    }
    res.json(player);
  });
});

/* Authenticated Requests */

router.use(function (req, res, next){
  /* Ensure all users are authenticated by checking req.user, set by passport session middleware */
  if (!req.user) {
    var err = new Error('You must login to access this page');
    err.status = 403;
    return next(err);
  }
  next();
});

router.post('/', function(req, res, next) {
  var newPlayer = new Player(req.body);
  newPlayer.save(function(err) {
    if (err) {
      return next(err);
    }
    res.json(newPlayer);
  });
});

router.post('/:link_name/image', multer({
  'dest': 'app/uploads/images/players/',
  'rename': function(fieldname, filename, req, res) {
    return req.params.link_name;
  }
}));

router.post('/:link_name/image', function(req, res, next) {
  Player.findOne({link_name: req.params.link_name}, function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return new Error('Player not found');
    }
    if (req.files && req.files.image) {
      var image = req.files.image;
      if (player.image && player.imageFsPath(image.name) !== image.path) {
        fs.unlinkSync(player.imageFsPath(image.name));
      }
      player.image = path.join('uploads', 'images', 'players', image.name);
      player.save(function (err) {
        if (err) {
          return next(err);
        }
        res.json({image: player.image});
      });
    }
  });
});

router.post('/:link_name', function (req, res, next) {
  Player.findOne({link_name: req.params.link_name}, function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return next(new Error('Player not found'));
    }
    player.first_name = req.body.first_name;
    player.last_name = req.body.last_name;
    player.link_name = req.body.link_name;
    player.blurb = req.body.blurb;
    player.attributes = req.body.attributes;
    player.save(function(err){
      if (err) {
        return next(err);
      }
      res.json(player);
    });
  });
});

router.delete('/:link_name', function (req, res, next) {
  Player.findOneAndRemove({link_name: req.params.link_name}, function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return next(new Error('Player not found'));
    }
    res.status(200).send();
  });
})

module.exports = router;
