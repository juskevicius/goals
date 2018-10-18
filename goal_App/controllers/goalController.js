var Goal = require('../models/aGoal');
var hData = require('../models/hData');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display Goal create form on GET.
exports.goal_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal create GET');
};

// Handle Goal create on POST.
exports.goal_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal create POST');
};

// Handle Goal delete on POST.
exports.goal_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal delete POST');
};

// Display Goal update form on GET.
exports.goal_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal update GET');
};

// Handle Goal update on POST.
exports.goal_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal update POST');
};

// Display detail page for a specific Goal.
exports.goal_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal detail: ' + req.params.id);
};

// Display list of all accepted Goals.
exports.goal_accepted_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal acc list');
};

// Display list of all pending Goals.
exports.goal_pending_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal pen list');
};

// Display list of all rejected Goals.
exports.goal_rejected_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Goal rej list');
};