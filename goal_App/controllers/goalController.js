var Goal = require('../models/Goal');
var hData = require('../models/hData');
var Unit = require('../models/Unit');
var async = require('async');
var each = require('async/each');
const mongoose = require('mongoose');
//import each from '../node_modules/async/each'


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
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
    body('name').isLength({ min: 1 }).trim().withMessage('Goal is not set'),
    body('initScore').trim(),
    body('targScore').trim(),
    body('comment').trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Unit.
            findOne({ owner: req.payload.id }).
            populate('parentTo').
            exec( function (err, ownerUnit) {
                if (err) { return err; }
                // Create a Goal object with escaped and trimmed data.
                        const goal = new Goal(
                            {
                                name: req.body.name.replace('&#x27;', '’'),
                                owner: ownerUnit._id,
                                initScore: req.body.initScore ? req.body.initScore : '',
                                targScore: req.body.targScore ? req.body.targScore : '',
                                //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                                //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                                statusOwner: 'Approved',
                                statusApprover: ownerUnit.childTo.length ? 'Pending' : 'Approved',
                                //history: hDataObj._id, - implemented below
                                created: Date(Date.now()),
                                //updated: {type: Date},
                                comment: req.body.comment ? req.body.comment : '',
                                //offer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                                //weight: {type: Number, default: 1}
                            }
                        );
                        
                        //create historical data object
                        const hdata = new hData(
                            {
                                data: [{
                                    date: new Date('2019-01-01'),
                                    value: req.body.initScore ? req.body.initScore : 0
                                }]  
                            }
                        );

                        //save historical data object and assign it to the goal
                        hdata.save( function(err, hdataDoc) {
                            if (err) { return (err); }
                            goal.history = hdataDoc.id;
                            goal.save( function (err, goalDoc) {
                                if (err) { return (err); }
                                //create a copy and assign it as an offer to the original goal
                                let currId = goalDoc.id;
                                goalDoc.set({
                                    _id: mongoose.Types.ObjectId(),
                                    owner: ownerUnit.childTo[0],
                                    statusOwner: 'Pending', //this way it will not appear owner's in goal list
                                    statusApprover: 'Pending' //this way it will not appear owner's in goal list
                                });
                                goalDoc.isNew = true;
                                goalDoc.save(function (err, newGoalOffer){
                                    if (err) { return err; }
                                    //assign offer's id to the original goal
                                    Goal.
                                    findById(currId).
                                    exec( function(err, goalDoc) {
                                        if (err) { return err; }
                                        goalDoc.set({offer: newGoalOffer.id});
                                        goalDoc.save(function(err, updatedGoalDoc){
                                            if (err) { return err; }
                                            return res.redirect('/');
                                        });    
                                    });
                                });
                            });
                        });
            });
    }
];

/////////////////////////////////////////// MY OWN GOALS:

// Handle Goal myOwn on GET.
exports.goal_myOwn_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            res.render('f_myOwn_', {children: ownerUnit.parentTo, goals: ownerGoals});
        }); 
    });
};

// Handle Goal edit on GET.
exports.goal_edit_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            exec( function(err, goalToEdit) {
                if(err) { return err; }
                res.render('f_myOwn_edit', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToEdit});
            });
        }); 
    });
}

// Handle Goal edit on POST.
exports.goal_edit_post = [
    body('goal').isLength({ min: 1 }).trim().withMessage('Goal is not set'),
    body('initScore').trim(),
    body('targScore').trim(),
    body('comment').trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Unit.
            findOne({ owner: req.payload.id }).
            populate('parentTo').
            exec( function (err, ownerUnit) {
                if (err) { return err; }
                Goal.
                findById(req.body.id).
                populate('history').
                exec( function(err, goalToUpdate) {
                    if(err) { return err; } 
                    goalToUpdate.set(
                        {
                            name: req.body.name.replace('&#x27;', '’'),
                            initScore: req.body.initScore ? req.body.initScore : '',
                            targScore: req.body.targScore ? req.body.targScore : '',
                            //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                            //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                            //statusOwner: 'Approved',
                            statusApprover: ownerUnit.childTo.length ? 'Pending' : 'Approved',
                            //history: hDataObj._id, - implemented below
                            //created: Date(Date.now()),
                            updated: Date(Date.now()),
                            comment: req.body.comment ? req.body.comment : '',
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
                                res.redirect('/myOwn');  
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
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            exec( function(err, goalToDelete) {
                if(err) { return err; }
                res.render('f_myOwn_delete', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToDelete});
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
        res.redirect('/myOwn');
    });
};

// Handle Goal offerTo on GET.
exports.goal_offerTo_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            exec( function(err, goalToEdit) {
                if(err) { return err; }
                res.render('f_myOwn_offerTo', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToEdit});
            });
        }); 
    });
};


// Handle Goal delete on POST.
exports.goal_offerTo_post = function(req, res) {
    
    //Detect the unit which is making the offer
    Unit.
    findOne({ owner: req.payload.id }).
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        //create an array for offers' historical data
        var hDataArr = [];
        for (let i = 0; i < req.body.owner.length; i++) {
            if (req.body.owner[i]) {
                hDataArr.push({
                    data: [{
                        date: new Date('2019-01-01'),
                        value: req.body.oInitScore[i] ? req.body.oInitScore[i] : 0
                    }]  
                });
            }
        }
        //create docs for historical data from the array
        hData.
        create(hDataArr, function(err, hDataDocs){
            if (err) { return err; }
            //create an array for offered goals
            var goalArr = [];
            for (let i = 0; i < req.body.owner.length; i++) {
                if (req.body.owner[i]) {
                    goalArr.push({
                        name: req.body.name[i],
                        owner: req.body.owner[i],
                        initScore: req.body.oInitScore[i],
                        targScore: req.body.oTargScore[i],
                        childTo: [req.body.childTo[i]],
                        //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}], - not relevant in this case
                        statusOwner: 'Pending',
                        statusApprover: 'Approved',
                        history: hDataDocs[i].id,
                        created: Date(Date.now()),
                        //updated: Date(Date.now()), - not relevant in this case
                        comment: req.body.oComment[i],
                        //offer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                        weight: req.body.weight[i],
                    });  
                }
            }
            //create docs for offered goals (goals are owned by recipients)
            Goal.
                create(goalArr, function(err, goalDocs) {
                if (err) { return err; }
                //create their copies, assign new id and owner (the one who made the offer). Bind to offered goals
                each(goalDocs, function(goalOffer, callback) {
                    let currId = goalOffer.id;
                    goalOffer.set({
                        _id: mongoose.Types.ObjectId(),
                        owner: ownerUnit,
                        statusOwner: 'Pending', //this way it will not appear owner's in goal list
                        statusApprover: 'Pending' //this way it will not appear owner's in goal list
                    });
                    goalOffer.isNew = true;
                    goalOffer.save(function (err, newGoalOffer){
                        if (err) { return err; }
                        //assign offer's id to the original goal
                        Goal.
                        findById(currId).
                        exec( function(err, goalDoc) {
                            if (err) { return err; }
                            goalDoc.set({offer: newGoalOffer.id});
                            goalDoc.save(function(err, updatedGoalDoc){
                                if (err) { return err; }
                                callback();
                            });    
                        });
                    });
                }, 
                function(err){    
                    Goal.
                    findById(req.body.childTo[0]).
                    exec( function(err, goalDoc){
                        if (err) { return err; }
                        //create an array for offered goal ids
                        let parentToGoals = goalDocs.map((goal)=>{ return goal._id; });
                        //and assign it to their parent goal
                        goalDoc.parentTo = parentToGoals;
                        goalDoc.save(function(err, updatedGoal) {
                            if (err) { return err; }              
                            res.redirect('/myOwn');
                        }); 
                    });
                });
            });
        });
    });
};


// Handle Goal accept offer on GET.
exports.goal_acceptOffer_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            populate('offer').
            exec( function(err, goalToAccept) {
                if(err) { return err; }
                res.render('f_myOwn_acceptOffer', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToAccept});
            });
        }); 
    });
}

// Handle Goal accept offer on POST.
exports.goal_acceptOffer_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Goal.
        findById(req.body.id).
        populate('offer').
        exec( function(err, goal) {
            if(err) { return err; } 
            goal.set({
                name: goal.offer.name,
                initScore: goal.offer.initScore,
                targScore: goal.offer.targScore,
                comment: goal.offer.comment,
                statusOwner: 'Approved'
            });
            goal.save( function (err, goalAccepted) {
                if (err) { return err; }
                res.redirect('/myOwn');
            });
        });       
    }
];


// Display Goal negotiate offered form on GET.
exports.goal_negotiateOffered_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            populate({ path: 'offer', populate: { path: 'owner', populate: { path: 'owner'}}}).
            exec( function(err, goalToNegotiate) {
                if(err) { return err; }
                res.render('f_myOwn_negotiateOffered', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToNegotiate});
            });
        }); 
    });
};

// Display Goal negotiate own form on GET.
exports.goal_negotiateOwn_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            populate({ path: 'offer', populate: { path: 'owner', populate: { path: 'owner'}}}).
            exec( function(err, goalToNegotiate) {
                if(err) { return err; }
                res.render('f_myOwn_negotiateOwn', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToNegotiate});
            });
        }); 
    });
};

// Handle Goal negotiate on POST.
exports.goal_negotiate_post = function(req, res) {
    Goal.
    findById(req.body.id).
    populate('offer').
    exec(function(err, goal) {
        if (err) { return err; }
        //if my response matches the offer, then Approve the offer
        if (req.body.name == goal.offer.name && req.body.initScore == goal.offer.initScore && req.body.targScore == goal.offer.targScore) {
            goal.set({statusOwner: 'Approved'});
            goal.save(function(err, goalUpdated) {
                if (err) { return err; }
                res.redirect('/myOwn');
            });
        } else {
            //if my response doesn't match the offer, then update the goal
            goal.set({
                name: req.body.name,
                initScore: req.body.initScore,
                targScore: req.body.targScore,
                comment: req.body.comment,
                updated: Date(Date.now())
            });
            goal.save(function(err, goalUpdated) {
                if (err) { return err; }
                res.redirect('/myOwn');
            });
        }
    });
};

/////////////////////////////////////////// OTHERS' GOALS:

// Display others' goals on GET.
exports.goal_others_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        
        //find childrens' goals
        Goal.find()
            .where('owner')
            .in(ownerUnit.parentTo)
            .populate('owner')
            .populate('offer')
            .exec( function (err, childrenGoals) {
            if (err) { return err; }
            res.render('f_others_', {children: ownerUnit.parentTo, goals: childrenGoals});
        });  
    });
};

// Display Goal negotiate my offered form on GET.
exports.goal_negotiateMyOffered_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            populate({ path: 'owner', populate: { path: 'owner'}}).
            populate('offer').
            exec( function(err, goalToNegotiate) {
                if(err) { return err; }
                res.render('f_others_negotiateMyOffered', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToNegotiate});
            });
        }); 
    });
};

// Display Goal negotiate their own form on GET.
exports.goal_negotiateTheirOwn_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            populate({ path: 'owner', populate: { path: 'owner'}}).
            populate('offer').
            exec( function(err, goalToNegotiate) {
                if(err) { return err; }
                res.render('f_others_negotiateTheirOwn', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToNegotiate});
            });
        }); 
    });
};

// Handle Goal negotiate on POST.
exports.goal_negotiateOthers_post = function(req, res) {
    Goal.
    findById(req.body.id).
    populate('offer').
    exec(function(err, goal) {
        if (err) { return err; }
        //if my offer matches the original goal, then Approve the offer
        if (req.body.name == goal.name && req.body.initScore == goal.initScore && req.body.targScore == goal.targScore) {
            goal.set({statusApprover: 'Approved'});
            goal.save(function(err, goalUpdated) {
                if (err) { return err; }
                res.redirect('/others');
            });
        } else {
            //if my offer doesn't match the original goal, then update the offer
            Goal.
            findById(goal.offer.id).
            exec( function(err, offerToUpdate) {
                if (err) { return err; }
                offerToUpdate.set({
                    name: req.body.name,
                    initScore: req.body.initScore,
                    targScore: req.body.targScore,
                    comment: req.body.comment,
                    updated: Date(Date.now())
                });
                offerToUpdate.save(function(err, offerUpdated) {
                    if (err) { return err; }
                    res.redirect('/others');
                });
            });
        }
    });
};


// Handle Goal approve on GET.
exports.goal_approve_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.
        find({ owner: ownerUnit.id}).
        populate('childTo').
        populate('parentTo').
        populate('history').
        populate('offer').
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            Goal.
            findById(req.params.id).
            populate('offer').
            exec( function(err, goalToApprove) {
                if(err) { return err; }
                res.render('f_others_approve', {children: ownerUnit.parentTo, goals: ownerGoals, goal: goalToApprove});
            });
        }); 
    });
}

// Handle Goal approve on POST.
exports.goal_approve_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Goal.
        findById(req.body.id).
        exec( function(err, goal) {
            if(err) { return err; } 
            goal.set({statusApprover: 'Approved'});
            goal.save( function (err, goalAccepted) {
                if (err) { return err; }
                res.redirect('/others');
            });
        });       
    }
];
