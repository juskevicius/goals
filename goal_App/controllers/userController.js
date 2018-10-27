var orgChart = require('../models/orgChart');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Handle Goal create on POST.
exports.user_smth = function(req, res) {
  res.send("testing if it works");  
  /*res.render("userMng");*/
};