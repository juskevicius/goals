const mongoose = require('mongoose');
const User = mongoose.model('User');

const { sanitizeBody } = require('express-validator/filter');

exports.restrict_to_admin = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, "role", function(err, user) {
      if (err) {return err;}
      if (user.role == 'admin') {
        next();
      } else {
        return res.send('You are unauthorised to perform this action');
      }
    });
  }
];
