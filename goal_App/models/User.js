const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  empId: {type: String, required: true, max: 8},
  role: {type: String, required: true},
  name: {type: String, required: true},
  hash: String,
  salt: String,
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationTime = today.getTime() + 28800000; /* 8 hours from now */
  return jwt.sign({
    id: this._id,
    exp: parseInt(expirationTime, 10),
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    token: this.generateJWT(),
  };
};

mongoose.model('User', UsersSchema);