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

                        const hdata = new hData(
                            {
                                data: [{
                                    date: new Date("2019-01-01"),
                                    value: req.body.initScore ? req.body.initScore : 0
                                }]  
                            }
                        );

                        hdata.save( function(err, hdataObj) {
                            if (err) { return (err); }
                            goal.history = hdataObj.id;
                            goal.save( function (err, goalObj) {
                                if (err) { return (err); }
                                return res.redirect('/');
                            });
                        });
            });
    }
];

// Handle Goal all on GET.
exports.goal_all_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate("parentTo").
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate("childTo").
        populate("parentTo").
        populate("history").
        populate("offer").
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            res.render('f_all', {children: ownerUnit.parentTo, goals: ownerGoals});
        }); 
    });
};

// Handle Goal edit on GET.
exports.goal_edit_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate("parentTo").
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate("childTo").
        populate("parentTo").
        populate("history").
        populate("offer").
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            exec( function(err, goalToEdit) {
                if(err) { return err; }
                res.render('f_edit', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToEdit});
            });
        }); 
    });
}

// Handle Goal edit on POST.
exports.goal_edit_post = [
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
                Goal.
                findById(req.body.id).
                populate('history').
                exec( function(err, goalToUpdate) {
                    if(err) { return err; } 
                    goalToUpdate.set(
                        {
                            goal: req.body.goal,
                            initScore: req.body.initScore ? req.body.initScore : "",
                            targScore: req.body.targScore ? req.body.targScore : "",
                            //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                            //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                            //statusOwner: 'Approved',
                            statusApprover: ownerUnit.childTo.length ? 'Pending' : 'Approved',
                            //history: hDataObj._id, - implemented below
                            //created: Date(Date.now()),
                            updated: Date(Date.now()),
                            comments: req.body.comment ? req.body.comment : "",
                            //offer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                            //weight: {type: Number, default: 1}
                            _id: req.body.id
                        }
                    );
                    goalToUpdate.save( function (err, goalUpdated) {
                        if (err) { return err; }
                        hData. 
                        findById(goalUpdated.history.id).
                        exec( function(err, hDataToUpdate) {
                            if (err) { return err; }
                            hDataToUpdate.data[0].value = req.body.initScore ? req.body.initScore : 0;
                            hDataToUpdate._id = goalUpdated.history.id;
                            hDataToUpdate.save(function(err, hdataUpdated) {
                                res.redirect('/all');  
                            });
                            //res.redirect('/all');
                            //res.send(goalUpdated);
                        });
                    });
                });
            });       
    }
];

// Handle Goal delete on GET.
exports.goal_delete_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate("parentTo").
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate("childTo").
        populate("parentTo").
        populate("history").
        populate("offer").
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            exec( function(err, goalToDelete) {
                if(err) { return err; }
                res.render('f_delete', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToDelete});
            });
        }); 
    });
}

// Handle Goal delete on POST.
exports.goal_delete_post = function(req, res) {
    Goal.
    findByIdAndDelete(req.body.id).
    exec( function(err, goalToDelete) {
        if(err) { return err; }
        res.redirect('/all');
    });
};

// Handle Goal offerTo on GET.
exports.goal_offerTo_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate("parentTo").
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate("childTo").
        populate("parentTo").
        populate("history").
        populate("offer").
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            exec( function(err, goalToEdit) {
                if(err) { return err; }
                res.render('f_offerTo', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToEdit});
            });
        }); 
    });
};


// Handle Goal delete on POST.
exports.goal_offerTo_post = function(req, res) {
    
    var hDataArr = [];
    for (let i = 0; i < req.body.owner.length; i++) {
        if (req.body.owner[i]) {
            hDataArr.push({
                data: [{
                    date: new Date("2019-01-01"),
                    value: req.body.oInitScore[i] ? req.body.oInitScore[i] : 0
                }]  
            });
        }
    }
    hData.create(hDataArr, function(err, hDataDocs){
        if (err) { return err; }
        var goalArr = [];
        for (let i = 0; i < req.body.owner.length; i++) {
            if (req.body.owner[i]) {
                goalArr.push({
                    goal: req.body.goal[i],
                    owner: req.body.owner[i],
                    initScore: req.body.oInitScore[i],
                    targScore: req.body.oTarget[i],
                    childTo: [req.body.childTo[i]],
                    //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                    statusOwner: 'Pending',
                    statusApprover: 'Approved',
                    history: hDataDocs[i].id,
                    created: Date(Date.now()),
                    //updated: Date(Date.now()),
                    comments: req.body.oComment[i],
                    //offer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                    weight: req.body.weight[i],
                });  
            }
        }
        Goal.create(goalArr, function(err, goalDocs) {
            if (err) { return err; }
            var parentToGoals = goalDocs.map((goal)=>{ return goal._id; });
            Goal.updateOne({id: req.body.childTo[0]}, {parentTo: parentToGoals}, {}, function(err, updatedGoal) {
                if(err) { return err; }
                Goal.findById(req.body.childTo[0], function(err, docc){
                    res.send(docc);
                });
                //res.send(updatedGoal);
                //res.redirect('/all');
            });
        });
    });
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
    Unit.
    findOne({ owner: req.payload.id }).
    populate("parentTo").
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        res.render('f_accepted', {children: ownerUnit.parentTo, displayAddForm: false});
    });
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