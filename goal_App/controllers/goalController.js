var Goal = require('../models/aGoal');
var hData = require('../models/hData');
var orgChart = require('../models/orgChart');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal update POST---------');
    /*res.render('aprimary');*/
};

// Handle Goal create on POST.
exports.goal_create_post = function(req, res) {
    res.send('will try to create a goal');
};

// Handle Goal delete on POST.
exports.goal_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal delete POST---------');
};

// Display Goal update form on GET.
exports.goal_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal update GET---------');
};

// Handle Goal update on POST.
exports.goal_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal update POST---------');
};

// Display detail page for a specific Goal.
exports.goal_detail = function(req, res) {
    res.send('display details of a goal ' + req.params.id);
};

// Display list of all accepted Goals.
exports.goal_accepted_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal update POST---------');
};

// Display list of all own pending Goals.
exports.goal_own_pending_list = function(req, res) {
    res.send('display all own pending goals');
};

// Display list of all offered pending Goals.
exports.goal_off_pending_list = function(req, res) {
    res.send('display all offered pending goals');
};

// Display list of all rejected Goals.
exports.goal_rejected_list = function(req, res) {
    res.send('display rejected goals');
};