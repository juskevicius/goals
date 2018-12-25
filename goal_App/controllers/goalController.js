var Goal = require('../models/Goal');
var hData = require('../models/hData');
var Unit = require('../models/Unit');
var each = require('async/each');
const mongoose = require('mongoose');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.goal_homePage_get = function(req, res) {
    
    

    Unit. /* extract the whole org. chart structure */
    findOne({name: 'Lithuania'}). 
    populate({ path: 'parentTo', populate: { path: 'parentTo' }}).
    exec( function (err, orgChart) {
        if (err) { return err; }

        
        Unit. /* find owner's unit */
        findOne({ owner: res.locals.currUser }).
        populate('parentTo').
        exec( function (err, ownerUnit) {
            if (err) { return err; }
            console.log(ownerUnit.name);
            Goal. /* find owner's goals */
            find({ owner: ownerUnit.id}).
            populate({ path: 'offer', populate: { path: 'owner' }}).
            populate('history owner').
            populate({ path: 'parentTo', populate: { path: 'owner history' }}).
            populate({ path: 'childTo', populate: { path: 'owner' }}).
            populate({ path: 'owner', populate: { path: 'parentTo' }}).
            exec( function (err, ownerGoals) {
                if (err) { return err; }
                
                Goal. /* find childrens' goals */
                find().
                where('owner').
                in(ownerUnit.parentTo).
                populate('owner offer').
                exec( function (err, childrenGoals) {
                if (err) { return err; }
                
                    let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
                    let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});
                    
                    let offeredToMe = ownerGoals.filter((goal) => { return goal.statusOwner == 'Pending' && goal.statusApprover == 'Approved';});
                    let createdByMe = ownerGoals.filter((goal) => { return goal.statusOwner == 'Approved' && goal.statusApprover == 'Pending';});
                    let myApproved = ownerGoals.filter((goal) => { return goal.statusOwner == 'Approved' && goal.statusApprover == 'Approved';});
                    
                    
                    return res.send({orgChart, ownerGoals, childrenGoals, ownerUnit});

                    if (req.url == "/add") {
                        res.render('b_body.jsx', {goal: myApproved[0], chart: orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers, displayAddForm: true});
                        return;
                    }

                    if (req.url == "/myOwn") {
                        res.render('b_body.jsx', {goal: myApproved[0], chart: orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers, displayMyOwnForm: true});
                        return;
                    }

                    if (req.url == "/others") {
                        res.render('b_body.jsx', {goal: myApproved[0], chart: orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers, displayOthersForm: true});
                        return;
                    }

                    /* if the user doesn't have own goals, then load Add form*/
                    if (offeredToMe.length + createdByMe.length + myApproved.length == 0) {
                        /*res.render('b_body.jsx', {goal: myApproved[0], chart: orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers, displayAddForm: true});*/
                        /*return res.send(myApproved[0], orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers);*/
                        
                    }
                    
                    /* othervise load the myOwn form*/
                    res.render('b_body.jsx', {goal: myApproved[0], chart: orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers, displayMyOwnForm: true});

                });  
            }); 
        });
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
    body('task').trim(),
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log(errors);

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
                    task: req.body.task.filter((task) => { return task.description; }),
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
                                return res.send(updatedGoalDoc)
                            
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
        
        Goal. /* find owner's goals */
        find({ owner: ownerUnit._id}).
        populate({ path: 'offer', populate: { path: 'owner' }}).
        populate('history owner').
        populate({ path: 'parentTo', populate: { path: 'owner history' }}).
        populate({ path: 'childTo', populate: { path: 'owner' }}).
        populate({ path: 'owner', populate: { path: 'parentTo' }}).
        exec( function (err, ownerGoals) {
            if (err) { return err; }
            return res.send({ownerGoals, ownerUnit});
        });
        
    });
};


// Handle Goal edit on POST.
exports.goal_edit_post = [
    body('name').isLength({ min: 1 }).trim().withMessage('Goal is not set'),
    body('initScore').trim(),
    body('targScore').trim(),
    body('comment').trim(),
    body('task').trim(),

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
                    let tasks = [];
                    req.body.task.forEach((task) => { if (task.description) { tasks.push({ _id: task._id, description: task.description, weight: Number(task.weight) }); } });
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
                            task: tasks,
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
                                if (err) { return err; }
                                res.locals.currGoal = goalUpdated.id;
                                return res.send(goalUpdated);  
                            });
                        });
                    });
                });
            });       
    }
];

// Handle Goal delete on POST.
exports.goal_delete_post = function(req, res, next) {
    
    Goal.
    findByIdAndDelete(req.body.id).
    exec( function(err) {
        if(err) { return err; }
        Goal.
        findOne({ parentTo: req.body.id }).
        exec( function(err, goal) {
            if(err) { return err; }
            if (goal) {
                let index = goal.parentTo.indexOf(req.body.id);
                goal.parentTo.splice(index, 1);
                goal.save(function (err, updatedGoal) {
                    if(err) { return err; }
                    res.locals.parent = updatedGoal.id;
                    next();
                });
            } else {
                res.send("successfully deleted the goal");
            }
        });
    });
};

// Handle Goal offerTo on POST.
exports.goal_offerTo_post = function(req, res) {

    //Detect the unit which is making the offer
    Unit.
    findOne({ owner: req.payload.id }).
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        //create an array for offers' historical data
        var hDataArr = [];
        for (let i = 0; i < req.body.offers.length; i++) {
            if (req.body.offers[i].owner) {
                hDataArr.push({
                    data: [{
                        date: new Date('2019-01-01'),
                        value: req.body.offers[i].initScore ? req.body.offers[i].initScore : 0
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
            for (let i = 0; i < req.body.offers.length; i++) {
                if (req.body.offers[i].owner) {
                    let tasks = [];
                    req.body.offers[i].task.forEach((task) => { if (task.description) {tasks.push({ description: task.description, weight: task.weight});}});
                    goalArr.push({
                        name: req.body.name,
                        owner: req.body.offers[i].owner,
                        initScore: req.body.offers[i].initScore,
                        targScore: req.body.offers[i].targScore,
                        childTo: [req.body.childTo],
                        //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}], - not relevant in this case
                        statusOwner: 'Pending',
                        statusApprover: 'Approved',
                        history: hDataDocs[i].id,
                        created: Date(Date.now()),
                        //updated: Date(Date.now()), - not relevant in this case
                        comment: req.body.offers[i].comment,
                        task: tasks,
                        //offer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                        weight: req.body.offers[i].weight,
                    });  
                }
            }
            //create docs for offered goals (goals are owned by recipients)
            Goal.
                create(goalArr, function(err, goalDocs) {
                if (err) { return err; }
                let offeredGoals = goalDocs;
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
                                //make original goal a child to the parent goal 
                                Goal.
                                findById(req.body.childTo).
                                exec( function(err, parentGoal){
                                    if (err) { return err; }
                                    parentGoal.parentTo.push(updatedGoalDoc.id);
                                    parentGoal.save(function(err, updatedParentGoal) {
                                        if (err) { return err; }
                                        callback();          
                                    }); 
                                });
                            });    
                        });
                    });
                }, 
                function(err){
                    if (err) { return err; }
                    return res.send('successfully made some offers');
                });
            });
        });
    });
};

// Handle Goal accept offer on POST.
exports.goal_acceptOffer_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Goal.
        findById(req.body.id).
        populate('offer').
        populate('history').
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
                hData. 
                findById(goalAccepted.history._id).
                exec( function(err, hDataToUpdate) {
                    if (err) { return err; }
                    hDataToUpdate.data[0].value = goal.offer.initScore ? goal.offer.initScore : 0;
                    hDataToUpdate._id = goalAccepted.history.id;
                    hDataToUpdate.save(function(err, hdataUpdated) {
                        if (err) { return err; }
                        res.redirect('/myOwn');  
                        next();
                    });
                });
            });
        });     
    }
];

// Handle Goal negotiate on POST.
exports.goal_negotiate_post = function(req, res) {
    Goal.
    findById(req.body.id).
    exec(function(err, goal) {
        if (err) { return err; }
        // update the goal
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
    });
};

/////////////////////////////////////////// OTHERS' GOALS:

// Display others' goals on GET.
/*
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
            let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
            let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});
            res.render('f_others_.pug', {children: ownerUnit.parentTo, offeredByMe, createdByOthers});
        });  
    });
};*/

// Display Goal negotiate my offered form on GET.
/*
exports.goal_negotiateMyOffered_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.find()
            .where('owner')
            .in(ownerUnit.parentTo)
            .populate('owner')
            .populate('offer')
            .exec( function (err, childrenGoals) {
            if (err) { return err; }
            let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
            let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});    
            Goal.
            findById(req.params.id).
            populate({ path: 'owner', populate: { path: 'owner'}}).
            populate('offer').
            exec( function(err, goalToNegotiate) {
                if(err) { return err; }
                res.render('f_others_negotiateMyOffered.pug', {children: ownerUnit.parentTo, offeredByMe, createdByOthers, goal: goalToNegotiate});
            });
        });  
    });
};*/

// Display Goal negotiate their own form on GET.
/*
exports.goal_negotiateTheirOwn_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.find()
            .where('owner')
            .in(ownerUnit.parentTo)
            .populate('owner')
            .populate('offer')
            .exec( function (err, childrenGoals) {
            if (err) { return err; }
            let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
            let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});    
            Goal.
            findById(req.params.id).
            populate({ path: 'owner', populate: { path: 'owner'}}).
            populate('offer').
            exec( function(err, goalToNegotiate) {
                if(err) { return err; }
                res.render('f_others_negotiateTheirOwn.pug', {children: ownerUnit.parentTo, offeredByMe, createdByOthers, goal: goalToNegotiate});
            });
        });  
    });
};*/

// Handle Goal negotiate on POST.
exports.goal_negotiateOthers_post = function(req, res) {
    Goal.
    findById(req.body.id).
    populate('offer').
    populate('history').    
    exec(function(err, goal) {
        if (err) { return err; }
        
        //update the offer
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
    
    });
};

// Handle Goal approve on GET.
/*
exports.goal_approve_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.find()
            .where('owner')
            .in(ownerUnit.parentTo)
            .populate('owner')
            .populate('offer')
            .exec( function (err, childrenGoals) {
            if (err) { return err; }
            let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
            let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});    
            Goal.
            findById(req.params.id).
            populate({ path: 'owner', populate: { path: 'owner'}}).
            populate('offer').
            exec( function(err, goalToApprove) {
                if(err) { return err; }
                res.render('f_others_approve.pug', {children: ownerUnit.parentTo, offeredByMe, createdByOthers, goal: goalToApprove});
            });
        });  
    });
}*/

// Handle Goal approve on POST.
exports.goal_approve_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Goal.
        findById(req.body.id).
        populate('history').
        exec( function(err, goal) {
            if(err) { return err; } 
            goal.set({
                statusApprover: 'Approved',
                statusOwner: 'Approved'
            });
            goal.save( function (err, goalAccepted) {
                if (err) { return err; }
                hData. 
                findById(goalAccepted.history.id).
                exec( function(err, hDataToUpdate) {
                    if (err) { return err; }
                    hDataToUpdate.data[0].value = goalAccepted.initScore ? goalAccepted.initScore : 0;
                    hDataToUpdate._id = goalAccepted.history.id;
                    hDataToUpdate.save(function(err, hdataUpdated) {
                        if (err) { return err; }
                        res.redirect('/others');  
                    });
                });
            });
        });       
    }
];

// Handle Goal reject on GET.
/*
exports.goal_reject_get = function(req, res) {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec( function (err, ownerUnit) {
        if (err) { return err; }
        Goal.find()
            .where('owner')
            .in(ownerUnit.parentTo)
            .populate('owner')
            .populate('offer')
            .exec( function (err, childrenGoals) {
            if (err) { return err; }
            let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
            let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});    
            Goal.
            findById(req.params.id).
            populate({ path: 'owner', populate: { path: 'owner'}}).
            populate('offer').
            exec( function(err, goalToReject) {
                if(err) { return err; }
                if (goalToReject.statusOwner == "Pending" && goalToReject.statusApprover == "Approved") {
                    //Rejet a goal that is offered by me:
                    res.render('f_others_reject.pug', {children: ownerUnit.parentTo, offeredByMe, createdByOthers, goal: goalToReject, goalName: goalToReject.offer.name});
                } else {
                    //Rejet a goal that is created by others:
                    res.render('f_others_reject.pug', {children: ownerUnit.parentTo, offeredByMe, createdByOthers, goal: goalToReject, goalName: goalToReject.name});
                }
            });
        });  
    });
}*/

// Handle Goal reject on POST.
exports.goal_reject_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        Goal.
        findById(req.body.id).
        exec( function(err, goal) {
            if(err) { return err; } 
            goal.set({statusApprover: 'Rejected'});
            goal.save( function (err, goalRejected) {
                if (err) { return err; }
                console.log(goalRejected.childTo);
                Goal.
                findById(goalRejected.childTo[0]).
                exec( function(err, parentGoal) {
                    if (err) { return err; }
                    if (parentGoal) {
                        let index = parentGoal.parentTo.indexOf(goalRejected.id);
                        if (index > -1) {
                            parentGoal.parentTo.splice(index, 1);
                            parentGoal.save( function(err, updatedParentGoal) {
                                if (err) { return err; }
                            });
                        }
                    }
                    res.redirect('/others');
                });
            });
        });       
    }
];


/////////////////////////////////////////// GOAL DETAILS:

// Handle Goal details on GET.
// PUG:
/*
exports.goal_details_get = function(req, res) {
    Goal.
    findById(req.params.id).
    populate({path: 'owner', populate: { path: 'owner'}}).
    populate({ path: 'offer', populate: { path: 'owner', populate: { path: 'owner' }}}).
    populate({path: 'parentTo', populate: { path: 'owner' }}).
    populate('history').
    exec( function(err, goal) {
        if (err) { return err; }
        res.render('b_body.pug', {goal});
    });
}
*/

// Handle Goal details on GET.
// REACT:
exports.goal_details_get = function(req, res) {
    
    Goal. /* find details about the current goal */
    findById(req.params.id).
    populate({ path: 'owner', populate: { path: 'owner parentTo' }}).
    populate({ path: 'offer', populate: { path: 'owner', populate: { path: 'owner' }}}).
    populate({ path: 'parentTo', populate: { path: 'owner' }}).
    populate({ path: 'parentTo', populate: { path: 'history' }}).
    populate({ path: 'childTo', populate: { path: 'owner' }}).
    populate('history').
    exec( function(err, goal) {
        if (err) { return err; }
        
        Unit. /* extract the whole org. chart structure */
        findOne({name: 'Lithuania'}). 
        populate({ path: 'parentTo owner', populate: { path: 'parentTo owner', populate: { path: 'owner' }}}).
        exec( function (err, orgChart) {
            if (err) { return err; }
            
            Goal. /* find owner's goals */
            find({ owner: goal.owner}).
            populate({ path: 'offer', populate: { path: 'owner', populate: { path: 'owner' }}}).
            exec( function (err, ownerGoals) {
                if (err) { return err; }
                
                Goal. /* find children's goals */
                find().
                where('owner').
                in(goal.owner.parentTo).
                populate('owner offer').
                exec( function (err, childrenGoals) {
                if (err) { return err; }

                    let offeredByMe = childrenGoals.filter((goal) => { return goal.statusOwner == "Pending" && goal.statusApprover == "Approved";});
                    let createdByOthers = childrenGoals.filter((goal) => { return goal.statusOwner == "Approved" && goal.statusApprover == "Pending";});
                    
                    let offeredToMe = ownerGoals.filter((goal) => { return goal.statusOwner == 'Pending' && goal.statusApprover == 'Approved';});
                    let createdByMe = ownerGoals.filter((goal) => { return goal.statusOwner == 'Approved' && goal.statusApprover == 'Pending';});
                    let myApproved = ownerGoals.filter((goal) => { return goal.statusOwner == 'Approved' && goal.statusApprover == 'Approved';});
                    
                    res.render('b_body.jsx', {goal, chart: orgChart, offeredToMe, createdByMe, myApproved, offeredByMe, createdByOthers});
                });  
            }); 
        });
    });
}

exports.goal_addCurrentScore_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        hData.
        findById(req.body.id).
        exec( function(err, history) {
            if(err) { return err; }
            let newDate = new Date(req.body.date);
            let index = history.data.findIndex(i => i.date.getTime() == newDate.getTime());
            if (index > -1) {
                history.data.splice(index, 1);
            }
            history.data.push({
                date: newDate,
                value: req.body.value
            });
            history.save( function (err, historyUpdated) {
                if (err) { return err; }
                
                Goal. 
                findOne({ history: historyUpdated.id}).
                populate({path: 'childTo', populate: { path: 'childTo'}}).
                exec( function(err, goal) {
                    if (err) { return err; }
                    if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
                        res.locals.parent = goal.childTo[0];
                        res.locals.currGoal = goal.id;
                        next();
                    } else {
                        res.redirect('/details/' + goal.id);
                    }
                });
            });
        });       
    }
];

exports.goal_editWeight_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        Goal.
        findById(req.body.id).
        exec( function(err, goalToUpdate) {
            if(err) { return err; } 
            goalToUpdate.set({
                weight: req.body.weight
            });
            goalToUpdate.save( function (err, goalUpdated) {
                if (err) { return err; }
                Goal. 
                findOne({ parentTo: goalUpdated.id}).
                exec( function(err, parent) {
                    if (err) { return err; }
                    
                    if (parent) { /* if the goal has a parent then update the parent's history */
                        res.locals.parent = parent._id;
                        res.locals.currGoal = parent.id;
                        next();
                    } else {
                        res.redirect('/details/' + goal.id);  
                    }
                });
            });
        });       
    }
];


exports.goal_taskImplementation_post = [
    
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        Goal.
        updateOne(
            { "_id": req.body.id, "task._id": req.body.taskId },
            { 
                "$set": {
                    "task.$.implemented": req.body.implemented
                }
            },
            (err) => {
                if (err) { return err; }
                
                res.redirect('/details/' + req.body.id);
                next();
            }
        );
    }
];
