const mongoose = require('mongoose');
const Users = mongoose.model('Users');

/*validate and sanitize!!!*/

exports.restrict_to_admin = function(req, res, next) {
  
  Users.findById(req.payload.id, "role", function(err, user) {
    if (err) {return err;}
    if (user.role == 'admin') {
      next();
    } else {
      res.send('You are unauthorised to perform this action');
    }
  });
};
