const orgChart = require('../models/orgChart');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const passport = require('passport');

const async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Handle user create on GET

exports.user_create_get = function(req, res, next) {
    res.render('userCreate');
};

// Handle user create on POST
exports.user_create_post = [

    body('empId').isLength({ min: 1 }).trim().withMessage('EmpId empty.'),
    body('name').isLength({ min: 1 }).trim().withMessage('Name empty.'),
    body('password').isLength({ min: 1 }).trim().withMessage('Password empty.'),
    body('role').isLength({ min: 1 }).trim().withMessage('Role empty.'),
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a User object with escaped and trimmed data.
        const finalUser = new Users(
            {
                empId: req.body.empId,
                name: req.body.name,
                role: req.body.role
            }
          );

        if (!errors.isEmpty()) {
            // There are errors
            return res.status(422).json({ errors: errors.array() });
        }
        else {
            // Data from form is valid. Save final user
            finalUser.setPassword(req.body.password);
            return finalUser.save()
                .then(() => res.json({ user: finalUser.toAuthJSON() }));
        }
    }

];


// Handle user login on GET

exports.user_login_get = function(req, res, next) {
    res.render('login');
};

// Handle user login on POST

exports.user_login_post = [
    
    body('empId').isLength({ min: 1 }).trim().withMessage('EmpId empty.'),
    body('password').isLength({ min: 1 }).trim().withMessage('Password empty.'),
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors
            return res.status(422).json({ errors: errors.array() });
        }
        else {
    
            passport.authenticate('local', { session: false }, function(err, passportUser, info) {
                if(err) {
                return next(err);   
                }
                if(passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
                res.cookie("Token", user.token, {httpOnly: true, secure: false, maxAge: 2592000000});
                return res.redirect("/goalDetails");
                }
                return res.status(422).json({ "Login": "Unsuccessful. Either id or password is incorrect" });
            })(req, res, next);
        }
    }
];

// Handle unit create on GET.
exports.unit_create_get = function(req, res) {
    orgChart.find({}, function(err, docs) {
        if (err) { return next(err); }
        console.log(JSON.stringify(req.headers));
        res.render("unitCreate", { units: docs});
    });
    
};

exports.unit_create_post = function(req, res) {
    
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