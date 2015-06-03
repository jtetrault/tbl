'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Lore= mongoose.model('Lore');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

function allLore(req, res, next) {
  Lore.find(function (err, lore) {
    if (err) {
      return next(err);
    }
    res.json(lore);
  });  
}

/* Unauthenticated Requests */

router.get('/', allLore);

router.get('/:link_name', function(req, res, next) {
  Lore.findOne({link_name: req.params.link_name}, function (err, lore) {
    if (err) {
      return next(err);
    } else if (!lore) {
      return next(new Error('Lore not found'));
    }
    res.json(lore);
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
  var newLore = new Lore(req.body);
  newLore.save(function(err) {
    if (err) {
      return next(err);
    }
    res.json(newLore);
  });
});
/*
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
*/

router.post('/:link_name', function (req, res, next) {
  Lore.findOne({link_name: req.params.link_name}, function (err, lore) {
    if (err) {
      return next(err);
    } else if (!lore) {
      return next(new Error('Lore not found'));
    }
    lore.title= req.body.title;
    lore.link_name = req.body.link_name;
    lore.text = req.body.text;
    lore.save(function(err){
      if (err) {
        return next(err);
      }
      res.json(lore);
    });
  });
});

router.delete('/:link_name', function (req, res, next) {
  Lore.findOneAndRemove({link_name: req.params.link_name}, function (err, lore) {
    if (err) {
      return next(err);
    } else if (!lore) {
      return next(new Error('Lore not found'));
    }
    res.status(200).send();
  });
})

module.exports = router;
