const mongoose = require('mongoose');
const User = mongoose.model('User');
const Goal = require('../models/Goal');
const Unit = require('../models/Unit');

const { sanitizeBody } = require('express-validator/filter');

exports.restrict_to_admin = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, "role", (err, user) => {
      if (err) { return next(err); }
      if (user.role == 'admin') {
        return next();
      } else {
        return res.status(401).json({
          errors: {
            message: 'You are not authorised to perform this action'
          }
        });
      }
    });
  }
];

exports.restrict_to_owner_h_id = [ /* restrict to owner. ID - history ID*/
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, "_id, role", (err, user) => {
      if (err) { return next(err); }
      Goal.
        findOne({ history: req.body.id }).
        select({ owner: 1 }).
        populate('owner').
        exec((err, goal) => {
          if (err) { return next(err); }
          if (user._id.equals(goal.owner.owner) && user.role !== 'guest') {
            return next();
          } else {
            return res.status(401).json({
              errors: {
                message: 'You are not authorised to perform this action'
              }
            });
          }
        });
    });
  }
];

exports.restrict_to_owner = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, "_id, role", (err, user) => {
      if (err) { return next(err); }
      Goal.
        findById(req.body.id).
        select({ owner: 1 }).
        populate('owner').
        exec((err, goal) => {
          if (err) { return next(err); }
          if (user._id.equals(goal.owner.owner) && user.role !== 'guest') {
            return next();
          } else {
            return res.status(401).json({
              errors: {
                message: 'You are not authorised to perform this action'
              }
            });
          }
        });
    });
  }
];

exports.restrict_to_guest = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, "_id, role", (err, user) => {
      if (err) { return next(err); }
      if (user.role !== 'guest') {
        return next();
      } else {
        return res.status(401).json({
          errors: {
            message: 'You are not authorised to perform this action'
          }
        });
      }
    });
  }
];

exports.restrict_to_approver = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.
    findById(req.payload.id, "_id", (err, currUser) => {
      if (err) { return next(err); }
      Unit.
      findOne({ owner: currUser._id }).
      select({ _id: 1 }).
      exec((err, currUnit) => {
        if (err) { return next(err); }
        Goal.
        findById(req.body.id).
        select({ owner: 1 }).
        populate('owner').
        exec((err, goal) => {
          if (err) { return next(err); }
          if (currUnit._id.equals(goal.owner.childTo[0])) {
            return next();
          } else {
            return res.status(401).json({
              errors: {
                message: 'You are not authorised to perform this action'
              }
            });
          }
        });
      });
    });
  }
];
