const mongoose = require('mongoose');
const each = require('async/each');
const User = mongoose.model('User');
const Goal = require('../models/Goal');
const hData = require('../models/hData');
const Unit = require('../models/Unit');

exports.goal_homePage_get = (req, res) => {
    
    Unit. /* extract the whole org. chart structure */
    findOne({name: 'Lithuania'}). 
    populate({ path: 'parentTo', populate: { path: 'parentTo' }}).
    exec((err, orgChart) => {
        if (err) { return next(err); }
        Unit. /* find owner's unit */
        findOne({ owner: req.payload.id }).
        populate('parentTo').
        exec((err, ownerUnit) => {
            if (err) { return next(err); }
            Goal. /* find owner's goals */
            find({ owner: ownerUnit.id}).
            populate('history owner').
            populate({ path: 'parentTo', populate: { path: 'history owner' }}).
            exec((err, ownerGoals) => {
                if (err) { return next(err); }
                User.
                findById(req.payload.id).
                exec((err, user) => {
                    if (err) { return next(err); }
                    const myApproved = ownerGoals.filter((goal) => { return goal.statusOwner === 'Approved' && goal.statusApprover === 'Approved'; });
                    return res.send({goalToDisplay: myApproved[0], orgChart, ownerUnit, userRole: user.role});
                });
            }); 
        });
    });
};

// Handle Goal create on POST.
exports.goal_add_post = (req, res) => {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec((err, ownerUnit) => {
        if (err) { return next(err); }
        
        // Create a Goal object with escaped and trimmed data.
        const goal = new Goal(
            {
                name: req.body.name.replace('&#x27;', '’'),
                owner: ownerUnit._id,
                initScore: req.body.initScore,
                targScore: req.body.targScore,
                //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                statusOwner: 'Approved',
                statusApprover: ownerUnit.childTo.length ? 'Pending' : 'Approved',
                //history: hDataObj._id, - implemented below
                created: new Date(),
                //updated: {type: Date},
                comment: req.body.comment,
                task: req.body.task,
                //ownersOffer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                //approversOffer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                //weight: {type: Number}
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
        hdata.save((err, hdataDoc) => {
            if (err) { return next(err); }
            goal.history = hdataDoc.id;
            goal.save((err, goalDoc) => {
                if (err) { return next(err); }
                //create a copy and assign it as the offer to the original goal
                const currId = goalDoc.id;
                goalDoc.set({
                    _id: mongoose.Types.ObjectId(),
                    statusOwner: 'Pending', //this way it will not appear owner's in goal list
                    statusApprover: 'Pending' //this way it will not appear owner's in goal list
                });
                goalDoc.isNew = true;
                goalDoc.save((err, newGoalOffer) => {
                    if (err) { return next(err); }
                    //assign offer's id to the original goal
                    Goal.
                    findById(currId).
                    exec((err, goalDoc) => {
                        if (err) { return next(err); }
                        goalDoc.set({ownersOffer: newGoalOffer.id});
                        goalDoc.save((err, updatedGoalDoc) => {
                            if (err) { return next(err); }
                            return res.send(updatedGoalDoc)
                        
                        });    
                    });
                });
            });
        });
    });
}


// Handle Goal details on GET.

exports.goal_details_get = (req, res) => {
    Goal. /* find details about the current goal */
    findById(req.params.id). /* req params - included in url */
    populate({path: 'history parentTo', populate: { path: 'owner history' }}).
    populate('owner').
    exec((err, goalToDisplay) => {
        if (err) { return next(err); }   
        res.send({goalToDisplay});
    });
}

// Handle Goal add Current Score on POST.

exports.goal_score_post = (req, res, next) => {
    
    if (req.body.entryId) {
        
        /* update entry */
        hData.
        updateOne(
            { "_id": req.body.id, "data._id": req.body.entryId },
            { "$set": { "data.$.date": req.body.date, "data.$.value": req.body.value }},
            (err) => {
                if (err) { return next(err); }

                Goal. 
                findOne({ history: req.body.id}).
                populate({path: 'childTo', populate: { path: 'childTo'}}).
                exec((err, goal) => {
                    if (err) { return next(err); }
                    if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
                        res.locals.parent = goal.childTo[0];
                        res.locals.currGoal = goal.id;
                        next();
                    } else {
                        return res.send('successfuly updated the current score');
                    }
                });
            });

    } else {

        /* new entry */
        hData.
        findById(req.body.id).
        exec((err, history) => {
            if(err) { return next(err); }
            
            const newDate = new Date(req.body.date);
            const index = history.data.findIndex(i => (i.date.getFullYear() === newDate.getFullYear()) && (i.date.getMonth() === newDate.getMonth()) && (i.date.getDate() === newDate.getDate()));
            if (index > -1) {
                history.data.splice(index, 1);
            }
            history.data.push({
                date: newDate,
                value: req.body.value
            });
            history.save((err) => {
                if (err) { return next(err); }
                
                Goal. 
                findOne({ history: req.body.id}).
                populate({path: 'childTo', populate: { path: 'childTo'}}).
                exec((err, goal) => {
                    if (err) { return next(err); }
                    if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
                        res.locals.parent = goal.childTo[0];
                        res.locals.currGoal = goal.id;
                        next();
                    } else {
                        return res.send('successfuly updated the current score');
                    }
                });
            });
        }); 
    }
}


// Handle Goal delete score on POST.

exports.goal_scoreDelete_post = (req, res, next) => {
    
    hData.
    updateOne(
        { "_id": req.body.id },
        { "$pull": { data: { "_id": req.body.entryId }}},
        (err) => {
            if (err) { return next(err); }

            Goal. 
            findOne({ history: req.body.id}).
            populate({path: 'childTo', populate: { path: 'childTo'}}).
            exec((err, goal) => {
                if (err) { return next(err); }
                if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
                    res.locals.parent = goal.childTo[0];
                    res.locals.currGoal = goal.id;
                    next();
                } else {
                    return res.send('successfuly updated the current score');
                }
            });
        });
}

// Handle Goal edit weight on POST.

exports.goal_editWeight_post = (req, res, next) => {
    Goal.
    findById(req.body.id).
    exec((err, goalToUpdate) => {
        if(err) { return next(err); } 
        goalToUpdate.set({
            weight: req.body.weight
        });
        goalToUpdate.save((err, goalUpdated) => {
            if (err) { return next(err); }
            Goal. 
            findOne({ parentTo: goalUpdated.id}).
            exec((err, parent) => {
                if (err) { return next(err); }
                if (parent) { /* if the goal has a parent then update the parent's history */
                    res.locals.parent = parent._id;
                    return next();
                } else {
                    return res.send('successfuly edited the weight');  
                }
            });
        });
    });  
}

// Handle Goal edit task implementation on POST.

exports.goal_taskImplementation_post = (req, res, next) => {
    Goal.
    updateOne(
        { "_id": req.body.id, "task._id": req.body.taskId },
        { "$set": { "task.$.implemented": req.body.implemented, "task.$.weight": req.body.weight }},
        (err) => {
            if (err) { return next(err); }
            res.send('successfuly updated task immplementation');

            Goal.findById(req.body.id, 'history task initScore', (err, goal) => {
                if (err) { return next(err); }
                let sumTaskImpl = goal.initScore ? goal.initScore : 0;
                for (let i = 0; i < goal.task.length; i++) {
                    sumTaskImpl = sumTaskImpl + Math.round(goal.task[i].implemented / 100 * goal.task[i].weight);
                }
                hData.
                findById(goal.history).
                exec((err, history) => {
                    if (err) { return next(err); }
                    const index = history.data.findIndex(i => (i.date.getFullYear() === new Date().getFullYear()) && (i.date.getMonth() === new Date().getMonth()) && (i.date.getDate() === new Date().getDate()));
                    if (index > -1) {
                        history.data.splice(index, 1);
                    }
                    history.data.push({
                        date: new Date(),
                        value: sumTaskImpl
                    });
                    history.save((err) => {
                        if (err) { return next(err); }
                    });            
                });
            });
            next();
        }
    );
}



/////////////////////////////////////////// MY OWN GOALS:

// Handle Goal myOwn on GET.

exports.goal_myOwn_get = (req, res, next) => {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec((err, ownerUnit) => {
        if (err) { return next(err); }
        Goal. /* find owner's goals */
        find({ owner: req.params.id || ownerUnit._id}). /* req.params.id - included in url (when searching for others' goals) */
        populate({ path: 'ownersOffer approversOffer', populate: { path: 'owner' }}).
        populate('history owner').
        populate({ path: 'parentTo', populate: { path: 'owner history' }}).
        populate({ path: 'childTo', populate: { path: 'owner' }}).
        populate({ path: 'owner', populate: { path: 'parentTo' }}).
        exec((err, ownerGoals) => {
            if (err) { return next(err); }
            return res.send({ownerGoals, ownerUnit});
        });
        
    });
};

// Handle Goal edit on POST.

exports.goal_edit_post = (req, res, next) => {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec((err, ownerUnit) => {
        if (err) { return next(err); }
        Goal.
        findById(req.body.id).
        populate('history').
        exec((err, goal) => {
            if(err) { return next(err); }
            goal.set(
                {
                    //name: {type: String, required: true},
                    //owner: {type: Schema.Types.ObjectId, ref: 'Unit'},
                    initScore: ownerUnit.childTo.length > 0 ? goal.initScore : req.body.initScore,
                    targScore: ownerUnit.childTo.length > 0 ? goal.targScore : req.body.targScore,
                    //childTo: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
                    //parentTo: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
                    //statusOwner: {type: String, enum: ['Approved', 'Pending', 'Rejected']},
                    statusApprover: ownerUnit.childTo.length > 0 ? 'Pending' : 'Approved',
                    //history: {type: Schema.Types.ObjectId, ref: 'hData'},
                    //created: {type: Date},
                    updated: ownerUnit.childTo.length > 0 ? goal.updated : new Date(),
                    comment: ownerUnit.childTo.length > 0 ? goal.comment : req.body.comment,
                    task: ownerUnit.childTo.length > 0 ? goal.task : req.body.task,
                    //ownersOffer: {type: Schema.Types.ObjectId, ref: 'Goal'},
                    //approversOffer: {type: Schema.Types.ObjectId, ref: 'Goal'},
                    //weight: {type: Number}
                    _id: req.body.id
                }
            );
            goal.save((err, goalUpdated) => {
                if (err) { return next(err); }
                if (goalUpdated.ownersOffer) {
                    Goal. 
                    findById(goalUpdated.ownersOffer).
                    exec((err, ownersOffer) => {
                        if (err) { return next(err); }
                        ownersOffer.set({
                            name: req.body.name.replace('&#x27;', '’'),
                            initScore: req.body.initScore,
                            targScore: req.body.targScore,
                            //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                            //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                            //statusOwner: 'Pending',
                            //statusApprover: 'Pending',
                            //history: hDataObj._id, - implemented below
                            //created: Date(Date.now()),
                            updated: new Date(),
                            comment: req.body.comment,
                            task: req.body.task,
                            //ownersOffer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                            //approversOffer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                            //weight: {type: Number, default: 1}
                            _id: ownersOffer.id
                        });
                        ownersOffer.save((err) => {
                            if (err) { return next(err); }
                            res.locals.currGoal = goalUpdated.id;
                            return res.send(goalUpdated);  
                        });
                    });
                } else {
                    goal.set(
                        {
                            name: req.body.name,
                            owner: ownerUnit.id,
                            initScore: req.body.initScore,
                            targScore: req.body.targScore,
                            //childTo: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
                            //parentTo: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
                            statusOwner: 'Pending',
                            statusApprover: 'Pending',
                            history: goalUpdated.history.id,
                            created: new Date(),
                            updated: ownerUnit.childTo.length > 0 ? goal.updated : new Date(),
                            comment: ownerUnit.childTo.length > 0 ? goal.comment : req.body.comment,
                            task: ownerUnit.childTo.length > 0 ? goal.task : req.body.task,
                            //ownersOffer: {type: Schema.Types.ObjectId, ref: 'Goal'},
                            //approversOffer: {type: Schema.Types.ObjectId, ref: 'Goal'},
                            //weight: {type: Number}
                        }
                    );
                    goal.isNew = true;
                    goal.save((err, newOwnersOffer) => {
                        if (err) { return next(err); }
                        Goal. 
                        findById(req.body.id). 
                        exec((err, mainGoal) => {
                            if (err) { return next(err); }
                            mainGoal.set({
                                ownersOffer: newOwnersOffer,
                                _id: req.body.id
                            });
                            mainGoal.save((err, goalUpdated) => {
                                if (err) { return next(err); }
                                res.locals.currGoal = goalUpdated.id;
                                return res.send(goalUpdated);  
                            });
                        });
                    });
                }
            });
        });
    });
}

// Handle Goal delete on POST.

exports.goal_delete_post = (req, res, next) => {
    Goal.
    findById(req.body.id).
    exec((err, goalToDelete) => {
        if (err) { return next(err); }
        Goal.findByIdAndDelete(goalToDelete.ownersOffer).exec();
        Goal.findByIdAndDelete(goalToDelete.approversOffer).exec();
        hData.findByIdAndDelete(goalToDelete.history).exec();
        Goal.findByIdAndDelete(req.body.id).
        exec((err) => {
            if(err) { return next(err); }
            Goal.
            findOne({ childTo: req.body.id }).
            exec((err, childGoal) => {
                if(err) { return next(err); }
                if (childGoal) {
                    const index = childGoal.childTo.indexOf(req.body.id);
                    childGoal.childTo.splice(index, 1);
                    childGoal.save((err) => {
                        if(err) { return next(err); }
                    });
                }
            });
            Goal.
            findOne({ parentTo: req.body.id }).
            exec((err, parentGoal) => {
                if(err) { return next(err); }
                if (parentGoal) {
                    const index = parentGoal.parentTo.indexOf(req.body.id);
                    parentGoal.parentTo.splice(index, 1);
                    parentGoal.save((err, updatedParentGoal) => {
                        if(err) { return next(err); }
                        res.locals.parent = updatedParentGoal.id;
                        next();
                    });
                } else {
                    res.send("successfully deleted the goal");
                }
            });
        });
    });
};

// Handle Goal offerTo on POST.

exports.goal_offerTo_post = (req, res) => {
    //Detect the unit which is making the offer
    Unit.
    findOne({ owner: req.payload.id }).
    exec((err, ownerUnit) => {
        if (err) { return next(err); }
        //create an array for offers' historical data
        let hDataArr = [];
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
        create(hDataArr, (err, hDataDocs) => {
            if (err) { return next(err); }
            //create an array for offered goals
            let goalArr = [];
            for (let i = 0; i < req.body.offers.length; i++) {
                if (req.body.offers[i].owner) {
                    let tasks = [];
                    req.body.offers[i].task.forEach((task) => { if (task.description) {tasks.push({ description: task.description, weight: task.weight}); }});
                    goalArr.push({
                        name: req.body.name,
                        owner: req.body.offers[i].owner,
                        initScore: req.body.offers[i].initScore,
                        targScore: req.body.offers[i].targScore,
                        childTo: [req.body.id],
                        //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}], - not relevant in this case
                        statusOwner: 'Pending',
                        statusApprover: 'Approved',
                        history: hDataDocs[i].id,
                        created: Date(Date.now()),
                        //updated: Date(Date.now()), - not relevant in this case
                        comment: req.body.offers[i].comment,
                        task: tasks,
                        //ownersOffer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                        //approversOffer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                        weight: req.body.offers[i].weight,
                    });  
                }
            }
            //create docs for offered goals (goals are owned by recipients)
            Goal.
                create(goalArr, (err, goalDocs) => {
                if (err) { return next(err); }
                //create their copies, assign new id and owner (the one who made the offer). Bind to offered goals
                each(goalDocs, (goalOffer, callback) => {
                    const currId = goalOffer.id;
                    goalOffer.set({
                        _id: mongoose.Types.ObjectId(),
                        owner: ownerUnit,
                        statusOwner: 'Pending', //this way it will not appear owner's in goal list
                        statusApprover: 'Pending' //this way it will not appear owner's in goal list
                    });
                    goalOffer.isNew = true;
                    goalOffer.save((err, newGoalOffer) => {
                        if (err) { return next(err); }
                        //assign offer's id to the original goal
                        Goal.
                        findById(currId).
                        exec((err, goalDoc) => {
                            if (err) { return next(err); }
                            goalDoc.set({approversOffer: newGoalOffer.id});
                            goalDoc.save((err, updatedGoalDoc) => {
                                if (err) { return next(err); }
                                //make original goal a child to the parent goal 
                                Goal.
                                findById(req.body.id).
                                exec((err, parentGoal) => {
                                    if (err) { return next(err); }
                                    parentGoal.parentTo.push(updatedGoalDoc.id);
                                    parentGoal.save((err) => {
                                        if (err) { return next(err); }
                                        callback();          
                                    }); 
                                });
                            });    
                        });
                    });
                }, 
                (err) => {
                    if (err) { return next(err); }
                    return res.send('successfully made some offers');
                });
            });
        });
    });
};

// Handle Goal accept offer on POST.

exports.goal_acceptOffer_post = (req, res, next) => {
    Goal.
    findById(req.body.id).
    populate('approversOffer').
    populate('history').
    exec((err, goal) => {
        if(err) { return next(err); } 
        goal.set({
            name: goal.approversOffer.name,
            initScore: goal.approversOffer.initScore,
            targScore: goal.approversOffer.targScore,
            comment: goal.approversOffer.comment,
            task: goal.approversOffer.task,
            statusOwner: 'Approved',
            statusApprover: 'Approved',
            updated: new Date(),
            _id: req.body.id
        });
        goal.save((err, goalAccepted) => {
            if (err) { return next(err); }
            if (goalAccepted.ownersOffer) {
                Goal.
                findById(goalAccepted.ownersOffer).
                exec((err, ownersOffer) => {
                    if (err) { return next(err); }
                    ownersOffer.set({
                        name: goal.approversOffer.name,
                        initScore: goal.approversOffer.initScore,
                        targScore: goal.approversOffer.targScore,
                        comment: goal.approversOffer.comment,
                        task: goal.approversOffer.task,
                        updated: new Date(),
                        _id: ownersOffer.id
                    });
                    ownersOffer.save((err) => {
                        if (err) { return next(err); }
                    })
                });
            }
            hData. 
            findById(goalAccepted.history._id).
            exec((err, hDataToUpdate) => {
                if (err) { return next(err); }
                hDataToUpdate.data[0].value = goal.approversOffer.initScore ? goal.approversOffer.initScore : 0;
                hDataToUpdate._id = goalAccepted.history.id;
                hDataToUpdate.save((err) => {
                    if (err) { return next(err); }
                    res.send('successfuly accepted the offer');  
                    next();
                });
            });
        });
    });     
}

// Handle Goal negotiate on POST. - owners offer

exports.goal_ownersOffer_post = (req, res) => {
    Goal.
    findById(req.body.id).
    exec((err, goal) => {
        if (err) { return next(err); }
        if (goal.ownersOffer) {
            Goal. 
            findById(goal.ownersOffer). 
            exec((err, ownersOffer) => {
                if (err) { return next(err); }
                ownersOffer.set({
                    name: req.body.name,
                    initScore: req.body.initScore,
                    targScore: req.body.targScore,
                    comment: req.body.comment,
                    updated: new Date(),
                    task: req.body.task,
                    _id: ownersOffer.id
                });
                ownersOffer.save((err) => {
                    if (err) { return next(err); }
                    res.send('owners offer has been updated');
                });
            });
        } else {
            const ownersOffer = new Goal(
                {
                    name: req.body.name.replace('&#x27;', '’'),
                    owner: goal.owner,
                    initScore: req.body.initScore,
                    targScore: req.body.targScore,
                    //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                    //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                    statusOwner: 'Pending',
                    statusApprover:'Pending',
                    //history: hDataObj._id, - implemented below
                    created: new Date(),
                    //updated: {type: Date},
                    comment: req.body.comment,
                    task: req.body.task,
                    //ownersOffer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                    //approversOffer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                    //weight: {type: Number}
                }
                
            );
            ownersOffer.save((err, newOwnersOffer) => {
                if (err) { return next(err); }
                goal.set(
                    {
                        ownersOffer: newOwnersOffer.id,
                        _id: goal.id
                    }
                );
                goal.save((err) => {
                    if (err) { return next(err); }
                    res.send('owners offer has been submitted');
                });
            });
        }
    });
};

/////////////////////////////////////////// OTHERS' GOALS:

// Display others' goals on GET.

exports.goal_others_get = (req, res) => {
    Unit.
    findOne({ owner: req.payload.id }).
    populate('parentTo').
    exec((err, ownerUnit) => {
        if (err) { return next(err); }
        
        //find childrens' goals
        Goal.find()
            .where('owner')
            .in(ownerUnit.parentTo)
            .populate('owner')
            .populate({ path: 'ownersOffer approversOffer', populate: { path: 'owner' }})
            .exec((err, othersGoals) => {
            if (err) { return next(err); }
            return res.send({othersGoals});
        });  
    });
};

// Handle Goal negotiate on POST. - approvers
exports.goal_approversOffer_post = (req, res) => {
    Goal.
    findById(req.body.id).
    exec((err, goal) => {
        if (err) { return next(err); }
        if (goal.approversOffer) {
            Goal. 
            findById(goal.approversOffer). 
            exec((err, approversOffer) => {
                if (err) { return next(err); }
                approversOffer.set({
                    name: req.body.name,
                    initScore: req.body.initScore,
                    targScore: req.body.targScore,
                    comment: req.body.comment,
                    updated: new Date(),
                    task: req.body.task,
                    _id: approversOffer.id
                });
                approversOffer.save((err) => {
                    if (err) { return next(err); }
                    res.send('approvers offer has been updated');
                });
            });
        } else {
            Unit.
            findOne({ owner: req.payload.id }).
            exec((err, ownerUnit) => {
                if (err) { return next(err); }

                const approversOffer = new Goal(
                    {
                        name: req.body.name.replace('&#x27;', '’'),
                        owner: ownerUnit._id,
                        initScore: req.body.initScore,
                        targScore: req.body.targScore,
                        //childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                        //parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
                        statusOwner: 'Pending',
                        statusApprover:'Pending',
                        //history: hDataObj._id, - implemented below
                        created: new Date(),
                        //updated: {type: Date},
                        comment: req.body.comment,
                        task: req.body.task,
                        //ownersOffer: {type: Schema.Types.ObjectId, ref: 'goalList'}, - implemented below
                        //approversOffer: {type: Schema.Types.ObjectId, ref: 'goalList'},
                        //weight: {type: Number}
                    }
                    
                );
                approversOffer.save((err, newApproversOffer) => {
                    if (err) { return next(err); }
                    goal.set(
                        {
                            approversOffer: newApproversOffer.id,
                            _id: goal.id
                        }
                    );
                    goal.save((err) => {
                        if (err) { return next(err); }
                        res.send('approvers offer has been submitted');
                    });
                });
            });
        }
    });
};

// Handle Goal approve on POST.
exports.goal_approve_post = (req, res, next) => {
    Goal.
    findById(req.body.id).
    populate('ownersOffer').
    populate('history').
    exec((err, goal) => {
        if(err) { return next(err); } 
        goal.set({
            name: goal.ownersOffer.name,
            initScore: goal.ownersOffer.initScore,
            targScore: goal.ownersOffer.targScore,
            comment: goal.ownersOffer.comment,
            task: goal.ownersOffer.task,
            statusApprover: 'Approved',
            statusOwner: 'Approved',
            updated: new Date(),
            _id: goal.id
        });
        goal.save((err, goalAccepted) => {
            if (err) { return next(err); }
            if (goalAccepted.approversOffer) {
                Goal.
                findById(goalAccepted.approversOffer).
                exec((err, approversOffer) => {
                    if (err) { return next(err); }
                    approversOffer.set({
                        name: goal.ownersOffer.name,
                        initScore: goal.ownersOffer.initScore,
                        targScore: goal.ownersOffer.targScore,
                        comment: goal.ownersOffer.comment,
                        task: goal.ownersOffer.task,
                        updated: new Date(),
                        _id: approversOffer.id
                    });
                    approversOffer.save((err) => {
                        if (err) { return next(err); }
                    })
                });
            }
            hData. 
            findById(goalAccepted.history._id).
            exec((err, hDataToUpdate) => {
                if (err) { return next(err); }
                hDataToUpdate.data[0].value = goal.ownersOffer.initScore ? goal.ownersOffer.initScore : 0;
                hDataToUpdate._id = goalAccepted.history.id;
                hDataToUpdate.save((err) => {
                    if (err) { return next(err); }
                    res.send('successfuly accepted the offer');  
                    next();
                });
            });
        });
    });     
}

// Handle Goal reject on POST.
exports.goal_reject_post = (req, res, next) => {
    Goal.
    findById(req.body.id).
    exec((err, goal) => {
        if(err) { return next(err); } 
        goal.set({statusApprover: 'Rejected'});
        goal.save((err, goalRejected) => {
            if (err) { return next(err); }
            Goal.
            findById(goalRejected.childTo[0]).
            exec((err, parentGoal) => {
                if (err) { return next(err); }
                if (parentGoal) {
                    const index = parentGoal.parentTo.indexOf(goalRejected.id);
                    if (index > -1) {
                        parentGoal.parentTo.splice(index, 1);
                        parentGoal.save((err) => {
                            if (err) { return next(err); }
                            return res.send('successfuly rejected the goal');
                        });
                    }
                }
                return res.send('successfuly rejected the goal');
            });
        });
    });       
}