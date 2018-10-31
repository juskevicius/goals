var orgChart = require('../models/orgChart');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Handle Goal create on POST.
exports.user_create_get = function(req, res) {
    orgChart.find({}, function(err, docs) {
        if (err) { return next(err); }
        console.log(JSON.stringify(req.headers));
        res.render("userCreate", { units: docs});
    });
    
};

exports.user_create_post = function(req, res) {
    
    orgChart.find({name: req.body.name}, function (err, docs) {
        if (err) { return next(err); }
        if (docs.length > 0) {
            
            /* Update existing user */
            docs[0].name = req.body.name ? req.body.name : docs[0].name;
            docs[0].owner = req.body.owner ? req.body.owner : docs[0].owner;
            docs[0].unitType = req.body.unitType ? req.body.unitType : docs[0].unitType;
            docs[0].parentTo = req.body.parentTo ? req.body.parentTo : docs[0].parentTo;
            docs[0].childTo = req.body.childTo ? req.body.childTo : docs[0].childTo;

            docs[0].save(
                function (err) {
                    if (err) { return next(err); }
                    res.redirect('/userManagement');
                }
            );
            
        } else {

            /* Create a new user */
            var unit = new orgChart({
                name: req.body.name,
                owner: req.body.owner,
                unitType: req.body.unitType,
                parentTo: req.body.parentTo,
                childTo: req.body.childTo,
            });
            unit.save(
                function (err) {
                    if (err) { return next(err); }
                    res.redirect('/userManagement');
                }
            );

        }
    })

};