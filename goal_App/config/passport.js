const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'empId',
  passwordField: 'password',
}, (empId, password, done) => {
  Users.findOne({ empId })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'employee id or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));