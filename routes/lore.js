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

router.post('/:link_name/images', multer({
  'dest': './app/uploads/images/lore/',
  'rename': function(fieldname, filename, req, res) {
    return 'temp'; 
  }
}));

router.post('/:link_name/images', function(req, res, next) {
  Lore.findOne({link_name: req.params.link_name}, function (err, lore) {
    if (err) {
      return next(err);
    } else if (!lore) {
      return new Error('Lore not found');
    }
    if (req.files && req.files.image) {
      var image = req.files.image;
      var imageDoc = lore.images.create({extension: image.extension});
      imageDoc.path = lore.imageWebPath(imageDoc);
      fs.mkdir(lore.imageFsDir(), function (err){
        if (err && err.code !== 'EEXIST') {
          return (next(err));
        }
        fs.rename(image.path, lore.imageFsPath(imageDoc), function (err){
          if (err) {
            return next(err);
          }
          lore.images.push(imageDoc);
          lore.save(function (err) {
            if (err) {
              return next(err);
            }
            res.json({images: lore.images});
          });
        });
      });
    }
  });
});

router.delete('/:link_name/images/:imageId', function (req, res, next) {
  Lore.findOne({link_name: req.params.link_name}, function (err, lore) {
    if (err) {
      return next(err);
    } else if (!lore) {
      return new Error('Lore not found');
    }
    console.log('Delete image from lore %s', lore.title);
    var image = lore.images.id(req.params.imageId);
    fs.unlink(lore.imageFsPath(image));
    image.remove();
    lore.save(function (err) {
      if (err) { 
        return next(err)
      }
      res.json(lore);
    });
  });
});

router.post('/:link_name', function (req, res, next) {
  Lore.findOne({link_name: req.params.link_name}, function (err, lore) {
    if (err) {
      return next(err);
    } else if (!lore) {
      return next(new Error('Lore not found'));
    }
    lore.title = req.body.title;
    lore.link_name = req.body.link_name;
    lore.text = req.body.text;
    lore.images = req.body.images;
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
});

module.exports = router;
