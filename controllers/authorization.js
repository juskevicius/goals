const mongoose = require('mongoose');
const { sanitizeBody } = require('express-validator/filter');
const Goal = require('../models/Goal');
const Unit = require('../models/Unit');

const User = mongoose.model('User');

exports.restrict_to_admin = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, 'role', (err, user) => {
      if (err) { return next(err); }
      if (user.role === 'admin') {
        return next();
      }
      return res.status(401).json({ errors: { message: 'You are not authorised to perform this action' } });
    });
  },
];

/* restrict to owner. ID - history ID */

exports.restrict_to_owner_h_id = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, '_id, role', (err, user) => {
      if (err) { return next(err); }
      Goal
        .findOne({ history: req.body.id })
        .select({ owner: 1 })
        .populate('owner')
        .exec((err2, goal) => {
          if (err2) { return next(err2); }
          if (user._id.equals(goal.owner.owner) && user.role !== 'guest') {
            return next();
          }
          return res.status(401).json({ errors: { message: 'You are not authorised to perform this action' } });
        });
    });
  },
];

exports.restrict_to_owner = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, '_id, role', (err, user) => {
      if (err) { return next(err); }
      Goal
        .findById(req.body.id)
        .select({ owner: 1 })
        .populate('owner')
        .exec((err2, goal) => {
          if (err2) { return next(err2); }
          if (user._id.equals(goal.owner.owner) && user.role !== 'guest') {
            return next();
          }
          return res.status(401).json({ errors: { message: 'You are not authorised to perform this action' } });
        });
    });
  },
];

exports.restrict_to_guest = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User.findById(req.payload.id, '_id, role', (err, user) => {
      if (err) { return next(err); }
      if (user.role !== 'guest') {
        return next();
      }
      return res.status(401).json({ errors: { message: 'You are not authorised to perform this action' } });
    });
  },
];

exports.restrict_to_approver = [
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    User
      .findById(req.payload.id, '_id', (err, currUser) => {
        if (err) { return next(err); }
        Unit
          .findOne({ owner: currUser._id })
          .select({ _id: 1 })
          .exec((err2, currUnit) => {
            if (err2) { return next(err2); }
            Goal
              .findById(req.body.id)
              .select({ owner: 1 })
              .populate('owner')
              .exec((err3, goal) => {
                if (err3) { return next(err3); }
                if (currUnit._id.equals(goal.owner.childTo[0])) {
                  return next();
                }
                return res.status(401).json({ errors: { message: 'You are not authorised to perform this action' } });
              });
          });
      });
  },
];
