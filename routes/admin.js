var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Create new user
router.post('/', function(req, res, next) {
  user = new User(req.body);
  user.save(function (err) {
    if(err) {
      next(err);
    }
    res.status(200);
    res.send();
  });
});

router.post('/:id', function (req, res, next) {
  user = User.findById(req.params.id, function (err, user) {
    if (err) {
      next(err);
    }
    user.username = req.body.username;
    user.password = req.body.password;
    user.roles = req.body.roles;
    user.save(function (err) {
      if (err) {
        next(err);
      }
      res.status(200);
      res.send();
    });
  });
});

module.exports = router;
