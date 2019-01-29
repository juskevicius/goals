const mongoose = require('mongoose');
const each = require('async/each');
const Goal = require('../models/Goal');
const HData = require('../models/hData');
const Unit = require('../models/Unit');

const User = mongoose.model('User');

exports.goal_homePage_get = (req, res, next) => {

  Unit /* extract the whole org. chart structure */
    .findOne({ name: 'Enterprise' })
    .populate({ path: 'parentTo', populate: { path: 'parentTo' }})
    .exec((err, orgChart) => {
      if (err) { return next(err); }
      Unit /* find owner's unit */
        .findOne({ owner: req.payload.id })
        .populate('parentTo')
        .exec((err2, ownerUnit) => {
          if (err2) { return next(err2); }
          Goal /* find owner's goals */
            .find({ owner: ownerUnit._id })
            .populate('history owner')
            .populate({ path: 'parentTo', populate: { path: 'history owner' }})
            .exec((err3, ownerGoals) => {
              if (err3) { return next(err3); }
              User
                .findById(req.payload.id)
                .exec((err4, user) => {
                  if (err4) { return next(err4); }
                  const myApproved = ownerGoals.filter(goal => (goal.statusOwner === 'Approved' && goal.statusApprover === 'Approved'));
                  return res.send({
                    goalToDisplay: myApproved[0],
                    orgChart,
                    ownerUnit,
                    userRole: user.role,
                  });
                });
            });
        });
    });
};

// Handle Goal create on POST.
exports.goal_add_post = (req, res, next) => {
  Unit
    .findOne({ owner: req.payload.id })
    .populate('parentTo')
    .exec((err, ownerUnit) => {
      if (err) { return next(err); }
      // Create a Goal object with escaped and trimmed data.
      const goal = new Goal(
        {
          name: req.body.name.replace('&#x27;', '’'),
          owner: ownerUnit._id,
          initScore: req.body.initScore,
          targScore: req.body.targScore,
          statusOwner: 'Approved',
          statusApprover: ownerUnit.childTo.length ? 'Pending' : 'Approved',
          created: new Date(),
          comment: req.body.comment,
          task: req.body.task,
        },
      );
      const hData = new HData(
        {
          data: [{
            date: new Date('2019-01-01'),
            value: req.body.initScore ? req.body.initScore : 0,
          }],
        },
      );
      // save historical data object and assign it to the goal
      hData.save((err2, hDataDoc) => {
        if (err2) { return next(err2); }
        goal.history = hDataDoc._id;
        goal.save((err3, goalOffer) => {
          if (err3) { return next(err3); }
          // create a copy and assign it as the offer to the original goal
          const currId = goalOffer._id;
          goalOffer.set({
            _id: mongoose.Types.ObjectId(),
            statusOwner: 'Pending', // this way it will not appear owner's in goal list
            statusApprover: 'Pending', // this way it will not appear owner's in goal list
          });
          goalOffer.isNew = true;
          goalOffer.save((err4, newGoalOffer) => {
            if (err4) { return next(err4); }
            // assign offer's id to the original goal
            Goal
              .findById(currId)
              .exec((err5, goalDoc) => {
                if (err5) { return next(err5); }
                goalDoc.set({ ownersOffer: newGoalOffer._id });
                goalDoc.save((err6) => {
                  if (err6) { return next(err6); }
                  return res.send('successfuly added a goal');
                });
              });
          });
        });
      });
    });
};


// Handle Goal details on GET.

exports.goal_details_get = (req, res, next) => {
  Goal /* find details about the current goal */
    .findById(req.params.id) /* req params - included in url */
    .populate({ path: 'history parentTo', populate: { path: 'owner history' } })
    .populate({ path: 'parentTo', populate: { path: 'parentTo', populate: { path: 'owner' } } })
    .populate('owner')
    .exec((err, goalToDisplay) => {
      if (err) { return next(err); }
      return res.send({ goalToDisplay });
    });
};

// Handle Goal add Current Score on POST.

exports.goal_score_post = (req, res, next) => {
  if (req.body.entryId) {
    /* update entry */
    HData
      .updateOne(
        { _id: req.body.id, 'data._id': req.body.entryId },
        {
          $set: {
            'data.$.date': req.body.date,
            'data.$.value': req.body.value,
          },
        },
        (err) => {
          if (err) { return next(err); }
          Goal
            .findOne({ history: req.body.id })
            .populate({ path: 'childTo', populate: { path: 'childTo' } })
            .exec((err2, goal) => {
              if (err2) { return next(err2); }
              if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
                res.locals.parent = goal.childTo[0];
                return next();
              }
              return res.send('successfuly updated the current score');
            });
        },
      );
  } else {
    /* new entry */
    HData
      .findById(req.body.id)
      .exec((err, history) => {
        if (err) { return next(err); }
        const newDate = new Date(req.body.date);
        const index = history.data.findIndex(i => (i.date.getFullYear() === newDate.getFullYear())
        && (i.date.getMonth() === newDate.getMonth()) && (i.date.getDate() === newDate.getDate()));
        if (index > -1) {
          history.data.splice(index, 1);
        }
        history.data.push({
          date: newDate,
          value: req.body.value,
        });
        history.save((err2) => {
          if (err2) { return next(err2); }
          Goal
            .findOne({ history: req.body.id })
            .populate({ path: 'childTo', populate: { path: 'childTo' } })
            .exec((err3, goal) => {
              if (err3) { return next(err3); }
              if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
                res.locals.parent = goal.childTo[0];
                return next();
              }
              return res.send('successfuly updated the current score');
            });
        });
      });
  }
};


// Handle Goal delete score on POST.

exports.goal_scoreDelete_post = (req, res, next) => {
  HData
    .updateOne(
      { _id: req.body.id },
      { $pull: { data: { _id: req.body.entryId } } },
      (err) => {
        if (err) { return next(err); }
        Goal
          .findOne({ history: req.body.id })
          .populate({ path: 'childTo', populate: { path: 'childTo' } })
          .exec((err2, goal) => {
            if (err2) { return next(err2); }
            if (goal.childTo[0]) { /* if the goal has a parent then update the parent's history */
              res.locals.parent = goal.childTo[0];
              return next();
            }
            return res.send('successfuly updated the current score');
          });
      },
    );
};

// Handle Goal edit weight on POST.

exports.goal_editWeight_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .exec((err, goalToUpdate) => {
      if (err) { return next(err); }
      goalToUpdate.set({
        weight: req.body.weight,
      });
      goalToUpdate.save((err2, goalUpdated) => {
        if (err2) { return next(err2); }
        Goal
          .findOne({ parentTo: goalUpdated._id })
          .exec((err3, parent) => {
            if (err3) { return next(err3); }
            if (parent) { /* if the goal has a parent then update the parent's history */
              res.locals.parent = parent._id;
              res.locals.updateTasks = true;
              return next();
            }
            return res.send('successfuly modified the weight'); 
          });
      });
    });
};

// Handle Goal edit task implementation on POST.

exports.goal_taskImplementation_post = (req, res, next) => {
  Goal
    .updateOne(
      { _id: req.body.id, 'task._id': req.body.taskId },
      { $set: { 'task.$.implemented': req.body.implemented, 'task.$.weight': req.body.weight } },
      (err) => {
        if (err) { return next(err); }
        Goal
          .findById(req.body.id, 'history task initScore childTo', (err2, goal) => {
            if (err2) { return next(err2); }
            let sumTaskImpl = goal.initScore ? goal.initScore : 0;
            for (let i = 0; i < goal.task.length; i += 1) {
              sumTaskImpl = Math.round(goal.task[i].implemented / 100 * goal.task[i].weight) 
              + sumTaskImpl;
            }
            HData
              .findById(goal.history)
              .exec((err3, history) => {
                if (err3) { return next(err3); }
                const index = history.data.findIndex(i => (i.date.getFullYear() === new Date().getFullYear())
                && (i.date.getMonth() === new Date().getMonth()) && (i.date.getDate() === new Date().getDate()));
                if (index > -1) {
                  history.data.splice(index, 1);
                }
                history.data.push({
                  date: new Date(),
                  value: sumTaskImpl,
                });
                history.save((err4) => {
                  if (err4) { return next(err4); }
                  if (goal.childTo.length > 0) {
                    res.locals.parent = goal.childTo[0];
                    res.locals.updateTasks = true;
                    return next();
                  }
                  return res.send('successfuly updated task implementation');
                });
              });
          });
      },
    );
};


// MY OWN GOALS:

// Handle Goal myOwn on GET.

exports.goal_myOwn_get = (req, res, next) => {
  Unit
    .findOne({ owner: req.payload.id })
    .populate('parentTo')
    .exec((err, ownerUnit) => {
      if (err) { return next(err); }
      Goal /* find owner's goals */
        .find({ owner: req.params.id || ownerUnit._id }) /* req.params.id - included in url (when searching for others' goals) */
        .populate({ path: 'ownersOffer approversOffer', populate: { path: 'owner' } })
        .populate('history owner')
        .populate({ path: 'parentTo', populate: { path: 'owner history' } })
        .populate({ path: 'childTo', populate: { path: 'owner' } })
        .populate({ path: 'owner', populate: { path: 'parentTo' } })
        .exec((err2, ownerGoals) => {
          if (err2) { return next(err2); }
          return res.send({ ownerGoals });
        });
    });
};

// Handle Goal edit on POST.

exports.goal_edit_post = (req, res, next) => {
  Unit
    .findOne({ owner: req.payload.id })
    .populate('parentTo')
    .exec((err, ownerUnit) => {
      if (err) { return next(err); }
      Goal
        .findById(req.body.id)
        .populate('history')
        .exec((err2, goal) => {
          if (err2) { return next(err2); }
          let approversStatus = 'Approved';
          /* if the user has modified name, initScore or targScore then set status as pending */
          if (req.body.name !== goal.name
            || (req.body.initScore && (req.body.initScore !== goal.initScore))
            || (req.body.targScore && (req.body.targScore !== goal.targScore))) {
            approversStatus = 'Pending';
          }
          if (req.body.task) { /* if the user has modified the tasks then set status as pending */
            if (req.body.task.length === goal.task.length) {
              for (let i = 0; i < req.body.task.length; i += 1) {
                if (req.body.task[i].description !== goal.task[i].description) {
                  approversStatus = 'Pending';
                  i = req.body.task.length;
                  break;
                }
              }
            } else {
              approversStatus = 'Pending';
            }
          }
          /* if the user has no parents then set status as approved */
          if (ownerUnit.childTo.length === 0) {
            approversStatus = 'Approved';
          }
          goal.set(
            {
              name: req.body.name,
              initScore: req.body.initScore ? req.body.initScore : goal.initScore,
              targScore: req.body.targScore ? req.body.targScore : goal.targScore,
              statusApprover: approversStatus,
              updated: new Date(),
              comment: req.body.comment ? req.body.comment : goal.comment,
              task: req.body.task ? req.body.task : goal.task,
              _id: req.body.id,
            },
          );
          goal.save((err3, goalUpdated) => {
            if (err3) { return next(err3); }
            if (goalUpdated.ownersOffer) {
              Goal
                .findById(goalUpdated.ownersOffer)
                .exec((err4, ownersOffer) => {
                  if (err4) { return next(err4); }
                  ownersOffer.set({
                    name: req.body.name,
                    initScore: req.body.initScore ? req.body.initScore : ownersOffer.initScore,
                    targScore: req.body.targScore ? req.body.targScore : ownersOffer.targScore,
                    updated: new Date(),
                    comment: req.body.comment ? req.body.comment : ownersOffer.comment,
                    task: req.body.task ? req.body.task : ownersOffer.task,
                    _id: ownersOffer._id,
                  });
                  ownersOffer.save((err5) => {
                    if (err5) { return next(err5); }
                    if (approversStatus === 'Pending' && goalUpdated.childTo.length > 0) {
                      res.locals.parent = goalUpdated.childTo[0];
                      res.locals.updateTasks = true;
                      return next();
                    }
                    return res.send('successfuly modified the goal');
                  });
                });
            } else {
              goal.set(
                {
                  name: req.body.name,
                  owner: ownerUnit._id,
                  initScore: goalUpdated.initScore,
                  targScore: goalUpdated.targScore,
                  statusOwner: 'Pending',
                  statusApprover: 'Pending',
                  history: goalUpdated.history._id,
                  created: new Date(),
                  comment: goalUpdated.comment,
                  task: goalUpdated.task,
                  _id: mongoose.Types.ObjectId(),
                },
              );
              goal.isNew = true;
              goal.save((err4, newOwnersOffer) => {
                if (err4) { return next(err4); }
                Goal
                  .findById(req.body.id)
                  .exec((err5, mainGoal) => {
                    if (err5) { return next(err5); }
                    mainGoal.set({
                      ownersOffer: newOwnersOffer,
                      _id: req.body.id,
                    });
                    mainGoal.save((err6, goalUpdated) => {
                      if (err6) { return next(err6); }
                      if (approversStatus === 'Pending' && goalUpdated.childTo.length > 0) {
                        res.locals.parent = goalUpdated.childTo[0];
                        res.locals.updateTasks = true;
                        return next(); /* calc history */
                      }
                      return res.send('successfuly modified the goal');
                    });
                  });
              });
            }
          });
        });
    });
};

// Handle Goal delete on POST.

exports.goal_delete_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .exec((err, goalToDelete) => {
      if (err) { return next(err); }
      Goal.findByIdAndDelete(goalToDelete.ownersOffer).exec();
      Goal.findByIdAndDelete(goalToDelete.approversOffer).exec();
      HData.findByIdAndDelete(goalToDelete.history).exec();
      Goal.findByIdAndDelete(req.body.id)
        .exec((err2) => {
          if (err2) { return next(err2); }
          Goal
            .findOne({ childTo: req.body.id })
            .exec((err3, childGoal) => {
              if (err3) { return next(err3); }
              if (childGoal) {
                const index = childGoal.childTo.indexOf(req.body.id);
                childGoal.childTo.splice(index, 1);
                childGoal.save((err4) => {
                  if (err4) { return next(err4); }
                });
              }
            });
          Goal
            .findOne({ parentTo: req.body.id })
            .exec((err3, parentGoal) => {
              if (err3) { return next(err3); }
              if (parentGoal) {
                const index = parentGoal.parentTo.indexOf(req.body.id);
                parentGoal.parentTo.splice(index, 1);
                parentGoal.save((err4, updatedParentGoal) => {
                  if (err) { return next(err); }
                  res.locals.parent = updatedParentGoal._id;
                  res.locals.updateTasks = true;
                  return next();
                });
              } else {
                return res.send('successfuly deleted the goal');
              }
            });
        });
    });
};

// Handle Goal offerTo on POST.

exports.goal_offerTo_post = (req, res, next) => {
  // Detect the unit which is making the offer
  Unit
    .findOne({ owner: req.payload.id })
    .exec((err, ownerUnit) => {
      if (err) { return next(err); }
      // create an array for offers' historical data
      let HDataArr = [];
      for (let i = 0; i < req.body.offers.length; i += 1) {
        if (req.body.offers[i].owner) {
          HDataArr.push({
            data: [{
              date: new Date('2019-01-01'),
              value: req.body.offers[i].initScore ? req.body.offers[i].initScore : 0,
            }],
          });
        }
      }
      // create docs for historical data from the array
      HData
        .create(HDataArr, (err2, HDataDocs) => {
          if (err2) { return next(err2); }
          // create an array for offered goals
          let goalArr = [];
          for (let i = 0; i < req.body.offers.length; i += 1) {
            if (req.body.offers[i].owner) {
              let tasks = [];
              req.body.offers[i].task.forEach((task) => { if (task.description) { tasks.push({ description: task.description, weight: task.weight }); } });
              goalArr.push({
                name: req.body.name,
                owner: req.body.offers[i].owner,
                initScore: req.body.offers[i].initScore,
                targScore: req.body.offers[i].targScore,
                childTo: [req.body.id],
                statusOwner: 'Pending',
                statusApprover: 'Approved',
                history: HDataDocs[i]._id,
                created: Date(Date.now()),
                comment: req.body.offers[i].comment,
                task: tasks,
                weight: req.body.offers[i].weight,
              });
            }
          }
          // create docs for offered goals (goals are owned by recipients)
          Goal
            .create(goalArr, (err3, goalDocs) => {
              if (err3) { return next(err3); }
              // create their copies, assign new id and owner (the one who made the offer). Bind to offered goals
              each(goalDocs, (goalOffer, callback) => {
                const currId = goalOffer._id;
                goalOffer.set({
                  _id: mongoose.Types.ObjectId(),
                  owner: ownerUnit,
                  statusOwner: 'Pending', // this way it will not appear owner's in goal list
                  statusApprover: 'Pending', // this way it will not appear owner's in goal list
                });
                goalOffer.isNew = true;
                goalOffer.save((err4, newGoalOffer) => {
                  if (err4) { return next(err4); }
                  // assign offer's id to the original goal
                  Goal
                    .findById(currId)
                    .exec((err5, goalDoc) => {
                      if (err5) { return next(err5); }
                      goalDoc.set({approversOffer: newGoalOffer.id });
                      goalDoc.save((err6, updatedGoalDoc) => {
                        if (err6) { return next(err6); }
                        // make original goal a child to the parent goal
                        Goal
                          .findById(req.body.id)
                          .exec((err7, parentGoal) => {
                            if (err7) { return next(err7); }
                            parentGoal.parentTo.push(updatedGoalDoc.id);
                            parentGoal.save((err8) => {
                              if (err8) { return next(err8); }
                              callback();
                            });
                          });
                      });
                    });
                });
              },
              (err4) => {
                if (err4) { return next(err4); }
                return res.send('successfuly made some offers');
              });
            });
        });
    });
};

// Handle Goal accept offer on POST.

exports.goal_acceptOffer_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .populate('approversOffer')
    .populate('history')
    .exec((err, goal) => {
      if (err) { return next(err); } 
      goal.set({
        name: goal.approversOffer.name,
        initScore: goal.approversOffer.initScore,
        targScore: goal.approversOffer.targScore,
        comment: goal.approversOffer.comment,
        task: goal.approversOffer.task,
        statusOwner: 'Approved',
        statusApprover: 'Approved',
        updated: new Date(),
        _id: req.body.id,
      });
      goal.save((err2, goalAccepted) => {
        if (err2) { return next(err2); }
        if (goalAccepted.ownersOffer) {
          Goal
            .findById(goalAccepted.ownersOffer)
            .exec((err3, ownersOffer) => {
              if (err3) { return next(err3); }
              ownersOffer.set({
                name: goal.approversOffer.name,
                initScore: goal.approversOffer.initScore,
                targScore: goal.approversOffer.targScore,
                comment: goal.approversOffer.comment,
                task: goal.approversOffer.task,
                updated: new Date(),
                _id: ownersOffer._id,
              });
              ownersOffer.save((err4) => {
                if (err4) { return next(err4); }
              });
            });
        }
        HData
          .findById(goalAccepted.history._id)
          .exec((err3, HDataToUpdate) => {
            if (err3) { return next(err3); }
            HDataToUpdate.data[0].value = goal.approversOffer.initScore ? goal.approversOffer.initScore : 0;
            HDataToUpdate._id = goalAccepted.history._id;
            HDataToUpdate.save((err4) => {
              if (err4) { return next(err4); }
              if (goal.childTo.length > 0) {
                res.locals.parent = goal.childTo[0];
                res.locals.updateTasks = true;
                return next();
              }
              return res.send('accepted the offer');
            });
          });
      });
    });
};

// Handle Goal negotiate on POST. - owners offer

exports.goal_ownersOffer_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .exec((err, goal) => {
      if (err) { return next(err); }
      if (goal.ownersOffer) {
        Goal
          .findById(goal.ownersOffer)
          .exec((err2, ownersOffer) => {
            if (err2) { return next(err2); }
            ownersOffer.set({
              name: req.body.name,
              initScore: req.body.initScore,
              targScore: req.body.targScore,
              comment: req.body.comment,
              updated: new Date(),
              task: req.body.task,
              _id: ownersOffer.id,
            });
            ownersOffer.save((err3) => {
              if (err3) { return next(err3); }
              return res.send('owners offer has been updated');
            });
          });
      } else {
        const ownersOffer = new Goal(
          {
            name: req.body.name.replace('&#x27;', '’'),
            owner: goal.owner,
            initScore: req.body.initScore,
            targScore: req.body.targScore,
            statusOwner: 'Pending',
            statusApprover: 'Pending',
            created: new Date(),
            comment: req.body.comment,
            task: req.body.task,
          },
        );
        ownersOffer.save((err2, newOwnersOffer) => {
          if (err2) { return next(err2); }
          const status = goal.statusOwner === 'Aproved' ? 'Pending' : 'Approved';
          goal.set(
            {
              ownersOffer: newOwnersOffer.id,
              statusApprover: status,
              _id: goal._id,
            },
          );
          goal.save((err3) => {
            if (err3) { return next(err3); }
            return res.send('owners offer has been submitted');
          });
        });
      }
    });
};

//                OTHERS' GOALS:

// Display others' goals on GET.

exports.goal_others_get = (req, res, next) => {
  Unit
    .findOne({ owner: req.payload.id })
    .populate('parentTo')
    .exec((err, ownerUnit) => {
      if (err) { return next(err); }
      // find childrens' goals
      Goal.find()
        .where('owner')
        .in(ownerUnit.parentTo)
        .populate('owner')
        .populate({ path: 'ownersOffer approversOffer', populate: { path: 'owner' } })
        .exec((err2, othersGoals) => {
          if (err2) { return next(err2); }
          return res.send({ othersGoals });
        });
    });
};

// Handle Goal negotiate on POST. - approvers
exports.goal_approversOffer_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .exec((err, goal) => {
      if (err) { return next(err); }
      if (goal.approversOffer) {
        Goal
          .findById(goal.approversOffer)
          .exec((err2, approversOffer) => {
            if (err2) { return next(err2); }
            approversOffer.set({
              name: req.body.name,
              initScore: req.body.initScore,
              targScore: req.body.targScore,
              comment: req.body.comment,
              updated: new Date(),
              task: req.body.task,
              _id: approversOffer._id,
            });
            approversOffer.save((err3) => {
              if (err3) { return next(err3); }
              return res.send('approvers offer has been updated');
            });
          });
      } else {
        Unit
          .findOne({ owner: req.payload.id })
          .exec((err2, ownerUnit) => {
            if (err2) { return next(err2); }

            const approversOffer = new Goal(
              {
                name: req.body.name.replace('&#x27;', '’'),
                owner: ownerUnit._id,
                initScore: req.body.initScore,
                targScore: req.body.targScore,
                statusOwner: 'Pending',
                statusApprover: 'Pending',
                created: new Date(),
                comment: req.body.comment,
                task: req.body.task,
              },
            );
            approversOffer.save((err3, newApproversOffer) => {
              if (err3) { return next(err3); }
              const status = goal.statusApprover === 'Aproved' ? 'Pending' : 'Approved';
              goal.set(
                {
                  approversOffer: newApproversOffer.id,
                  statusOwner: status,
                  _id: goal._id,
                },
              );
              goal.save((err4) => {
                if (err4) { return next(err4); }
                return res.send('approvers offer has been submitted');
              });
            });
          });
      }
    });
};

// Handle Goal approve on POST.
exports.goal_approve_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .populate('ownersOffer')
    .populate('history')
    .exec((err, goal) => {
      if (err) { return next(err); }
      goal.set({
        name: goal.ownersOffer.name,
        initScore: goal.ownersOffer.initScore,
        targScore: goal.ownersOffer.targScore,
        comment: goal.ownersOffer.comment,
        task: goal.ownersOffer.task,
        statusApprover: 'Approved',
        statusOwner: 'Approved',
        updated: new Date(),
        _id: goal._id,
      });
      goal.save((err2, goalAccepted) => {
        if (err2) { return next(err2); }
        if (goalAccepted.approversOffer) {
          Goal
            .findById(goalAccepted.approversOffer)
            .exec((err3, approversOffer) => {
              if (err3) { return next(err3); }
              approversOffer.set({
                name: goal.ownersOffer.name,
                initScore: goal.ownersOffer.initScore,
                targScore: goal.ownersOffer.targScore,
                comment: goal.ownersOffer.comment,
                task: goal.ownersOffer.task,
                updated: new Date(),
                _id: approversOffer._id,
              });
              approversOffer.save((err4) => {
                if (err4) { return next(err4); }
              });
            });
        }
        HData
          .findById(goalAccepted.history._id)
          .exec((err3, HDataToUpdate) => {
            if (err3) { return next(err3); }
            HDataToUpdate.data[0].value = goal.ownersOffer.initScore ? goal.ownersOffer.initScore : 0;
            HDataToUpdate._id = goalAccepted.history._id;
            HDataToUpdate.save((err4) => {
              if (err4) { return next(err4); }
              if (goal.childTo.length > 0) {
                res.locals.parent = goal.childTo[0];
                res.locals.updateTasks = true;
                return next();
              }
              return res.send('successfuly approved a goal');
            });
          });
      });
    });
};

// Handle Goal reject on POST.
exports.goal_reject_post = (req, res, next) => {
  Goal
    .findById(req.body.id)
    .exec((err, goal) => {
      if (err) { return next(err); }
      goal.set({ statusApprover: 'Rejected' });
      goal.save((err2, goalRejected) => {
        if (err2) { return next(err2); }
        Goal
          .findById(goalRejected.childTo[0])
          .exec((err3, parentGoal) => {
            if (err3) { return next(err3); }
            if (parentGoal) {
              const index = parentGoal.parentTo.indexOf(goalRejected._id);
              parentGoal.parentTo.splice(index, 1);
              parentGoal.save((err4) => {
                if (err4) { return next(err4); }
                return res.send('successfuly rejected the goal');
              });
            } else {
              return res.send('successfuly rejected the goal');
            }
          });
      });
    });
};
