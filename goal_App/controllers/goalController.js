var Goal = require('../models/Goal');
var hData = require('../models/hData');
var Unit = require('../models/Unit');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate("parentTo").
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        res.render('a_primary', {children: ownerUnit.parentTo, displayAddForm: false});
    });
};

// Handle Goal create on get
/* Is loaded in the background together with the home page. 
Gets displayed when clicked. Gets hidden when submitted or clicked on the background */

// Handle Goal create on POST.
exports.goal_add_post = [
    body("goal").isLength({ min: 1 }).trim().withMessage("Goal is not set"),
    body("initScore").trim(),
    body("targScore").trim(),
    body("comment").trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Unit.
            findOne({ owner: req.payload.id }).
            populate("parentTo").
            exec( function (err, ownerUnit) {
                if (err) { return err; }
                // Create a Goal object with escaped and trimmed data.
                        const goal = new Goal(
                            {
                                goal: req.body.goal,
                                owner: ownerUnit._id,
                                initScore: req.body.initScore ? req.body.initScore : "",
                                targScore: req.body.targScore ? req.body.targScore : "",
                                //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                                //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                                statusOwner: 'Approved',
                                statusApprover: ownerUnit.childTo.length ? 'Pending' : 'Approved',
                                //history: hDataObj._id, - implemented below
                                created: Date(Date.now()),
                                //updated: {type: Date},
                                comments: req.body.comment ? req.body.comment : "",
                                //offer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                                //weight: {type: Number, default: 1}
                            }
                        );

                        if (req.body.initScore) {
                            const hdata = new hData(
                                {
                                    data: [{
                                        date: new Date("2019-01-01"),
                                        value: req.body.initScore
                                    }]  
                                }
                            );
                            hdata.save( function(err, hdataObj) {
                                if (err) { return (err); }
                                goal.history = hdataObj.id;
                                goal.save( function (err, goalObj) {
                                    if (err) { return (err); }
                                    return res.send(goalObj);
                                });
                            });
                        } else {
                            goal.save( function (err, goalObj) {
                                if (err) { return (err); }
                                return res.send(goalObj);
                            });
                        }
            });
    }
];

// Handle Goal delete on POST.
exports.goal_offerTo_post = function(req, res) {
    res.send(req.body);
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
    res.render('a_primary');
};

// Display list of all accepted Goals.
exports.goal_accepted_list = function(req, res) {
    res.render('f_accepted');
};

// Display list of all own pending Goals.
exports.goal_own_pending_list = function(req, res) {
    res.render('f_pendingOwn');
};

// Display list of all offered pending Goals.
exports.goal_off_pending_list = function(req, res) {
    res.render('f_pendingOff');
};

// Display list of all rejected Goals.
exports.goal_rejected_list = function(req, res) {
    res.send('display rejected goals');
};