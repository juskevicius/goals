var Goal = require('../models/Goal');
var hData = require('../models/hData');
const mongoose = require('mongoose');

exports.hData_update_post = (req, res, next) => {
  
  /* function to calculate historical data from children goals and/or grandchildren goals */
  function calcHistoricalData(theGoal) {
    theGoal.parentTo = theGoal.parentTo.filter((child) => { return child.status === 'Approved'; });
    /*let weights = theGoal.parentTo.filter((childGoal) => { return childGoal.weight > 0;});*/
    let newHistory = [];
    /*if (theGoal.parentTo.length === weights.length || !weights.length) {*/ /* if either all weights or none of the weights are defned, then continue */
        let dates = theGoal.parentTo.map((child) => { return child.history.data.map((entry) => { return entry.date.getTime();})}); /* extract all dates from child goals */
        let datesArr = dates.reduce((arr, val) => { return arr.concat(val);}).sort((a, b) => { return a - b; }); /* build an array and sort it in ascending order */
        let uniqueDates = datesArr.filter((v, i) => { return datesArr.indexOf(v) === i;}); /* remove duplicates */
        let childData = theGoal.parentTo.map((child) => { return child.history.data.map((entry) => { return [entry.date.getTime(), entry.value, child.weight];})}); /* build ar array of arrays for children data [date, value, weight] */
        let childArr = childData.map((unit) => { return unit.sort((a, b) => { return a[0] - b[0]; });}) /* sort children dates in ascending order  */
        let currChildScore = [];
        let calcHistData = [];
        for (let i = 0; i < uniqueDates.length; i++) { /* loop through unique dates */
            let sum = 0;
            let weight = 0;
            let currWeight = 0;
            for (let j = 0; j < childArr.length; j++) { /* loop through children */
                if (uniqueDates[i] == childArr[j][0][0]) { /* if the date matches with the first date in child's array, then take it's current score */
                    currChildScore[j] = childArr[j][0][1]; 
                } else if (uniqueDates[i] > childArr[j][childArr[j].length - 1][0]) { /* if the date goes after the last date in the child, then take the last known score */
                        currChildScore[j] = childArr[j][childArr[j].length - 1][1];
                } else if (uniqueDates[i] == childArr[j][1][0]) { /* if the date matches with the second date in array, set it's current score and remove the first date from array*/
                    currChildScore[j] = childArr[j][1][1];
                    childArr[j].shift();
                } else { /* if the dates doesn't match (uniqueDates[i] > childArr[j][0][0] && uniqueDates[i] < childArr[j][1][0]) then calculate the current score */
                    currChildScore[j] = ((uniqueDates[i] - childArr[j][0][0]) / (childArr[j][1][0] - childArr[j][0][0])) * (childArr[j][1][1] - childArr[j][0][1]) + childArr[j][0][1];
                }
                currWeight = childArr[j][0][2] ? childArr[j][0][2] : 100; /* If weight is not defined, then set  it as 100  */
                sum = sum + currChildScore[j] * currWeight; /* multiply the current score by it's weight and add to the sum */
                weight = weight + currWeight; /* calculate the sum of weights*/
            }
            let dataToAdd = { date: new Date(uniqueDates[i]), value: Math.round(sum/weight) || 0 } 
            calcHistData.push(dataToAdd);
        }
        newHistory = calcHistData;
   /* } else {
        newHistory = [{ *//* not all weights for children goals are defined. Must be either all or none. Reset the historical data */
            /*date: new Date('2019-01-01'),
            value: 0
        }];
    }*/

    hData.
    updateOne( 
        { "_id": theGoal.history }, 
        { "$set": { "data": newHistory }},
        (err) => {
            if (err) { return next(err); }
        }
    );
  }

  let parent = res.locals.parent; 
  Goal.
  findById(parent).
  populate({path: 'childTo parentTo', populate: { path: 'history' }}).
  exec((err, parentGoal) => {
      if (err) { return next(err); }
      calcHistoricalData(parentGoal); /* calculate historical data for parent goal */
        if (parentGoal.childTo[0]) { 
            let grandparent = parentGoal.childTo[0];
            Goal.
            findById(grandparent).
            populate({path: 'parentTo', populate: { path: 'history' }}).
            exec((err, grandparentGoal) => {
                if (err) { return next(err); }
                calcHistoricalData(grandparentGoal); /* calculate historical data for grandparent goal */
                if (res.locals.updateTasks) {
                    next();
                } else {
                    return res.send("successfuly updated parent's and grandparent's history"); 
                } 
            });
        } else {
            if (res.locals.updateTasks) {
                next();
            } else {
                return res.send("successfuly updated parent's history");
            }            
        }
  });
}

exports.updateOneTaskImplementation = (req, res, next) => {
      
    function calcTaskImpl(theGoal) {
        for (let t = 0; t < theGoal.task.length; t++) {
            if (theGoal.task[t].description === req.body.description) { /* loop through the parent's tasks and find the current task */
                let impl = [];
                let weight = [];
                let sumWeight = 0;
                let sum = 0;
                for (let i = 0; i < theGoal.parentTo.length; i++) { /* loop through goals of children */
                    for (let j = 0; j < theGoal.parentTo[i].task.length; j++) { /* loop through tasks in children goals */
                        if (req.body.description === theGoal.parentTo[i].task[j].description && theGoal.parentTo[i].status === 'Approved') { /* if current task is found in a child's goal  */
                            impl.push(theGoal.parentTo[i].task[j].implemented ? theGoal.parentTo[i].task[j].implemented : 0); /* then copy its implementation status into an array */
                            weight.push(theGoal.parentTo[i].weight ? theGoal.parentTo[i].weight : 100); /* also copy child goal's weight  */
                            sumWeight = sumWeight + (theGoal.parentTo[i].weight ? theGoal.parentTo[i].weight : 100); /* a sum of all weights. Required to be able to calculate the weighted average */
                        }
                    }
                }
               
                for (let i = 0; i < impl.length; i++) {
                    sum = sum + impl[i] * weight[i]; /* multiply weights and implementation statuses */
                }
                const implemented = (sum / sumWeight) ? Math.round(sum / sumWeight) : 0;
                Goal.
                updateOne( 
                    { "_id": theGoal._id, "task._id": theGoal.task[t]._id }, 
                    { "$set": { "task.$.implemented": implemented }},
                    (err) => {
                        if (err) { return next(err); }
                    }
                );
            }
        }
    }

    Goal. 
    findOne({ parentTo: req.body.id }). 
    populate('parentTo'). 
    exec((err, parentGoal) => {
        if (err) { return next(err); }
        if (parentGoal) {
            calcTaskImpl(parentGoal);
            Goal.
            findOne({ parentTo: parentGoal._id }). 
            populate('parentTo'). 
            exec((err, grandparentGoal) => {
                if (err) { return next(err); }
                if (grandparentGoal) {
                    calcTaskImpl(grandparentGoal);
                    if (res.locals.updateHistory) {
                        next();
                    } else {
                        return res.send("successfuly updated grandparent's task implementation");
                    }
                } else {
                    if (res.locals.updateHistory) {
                        next();
                    } else {
                        return res.send("successfuly updated parent's task implementation");
                    }
                }
            }); 
        } else {
            if (res.locals.updateHistory) {
                next();
            } else {
                return res.send("parent goal not found. Task implementation was not updated");
            }
        }
    });
}


exports.updateAllTasksImplementation =  (req, res, next) => {
    
    function calcTaskImpl(theGoal) {
        for (let t = 0; t < theGoal.task.length; t++) {
            let currTask = theGoal.task[t].description;
            let impl = [];
            let weight = [];
            let sumWeight = 0;
            let sum = 0;
            for (let i = 0; i < theGoal.parentTo.length; i++) { /* loop through goals of children */
                for (let j = 0; j < theGoal.parentTo[i].task.length; j++) { /* loo through tasks in children goals */
                    if (currTask == theGoal.parentTo[i].task[j].description && theGoal.parentTo[i].status == 'Approved') { /* if current task is found in a child's goal  */
                        impl.push(theGoal.parentTo[i].task[j].implemented ? theGoal.parentTo[i].task[j].implemented : 0); /* then copy its implementation status into an array */
                        weight.push(theGoal.parentTo[i].weight ? theGoal.parentTo[i].weight : 100); /* also copy child goal's weight  */
                        sumWeight = sumWeight + (theGoal.parentTo[i].weight ? theGoal.parentTo[i].weight : 100); /* a sum of all weights. Required to be able to calculate the weighted average */
                    }
                }
            }
            for (let i = 0; i < impl.length; i++) {
                sum = sum + impl[i] * weight[i]; /* multiply weights and implementation statuses */
            }
            const implemented = (sum / sumWeight) ? Math.round(sum / sumWeight) : 0;
            Goal.
            updateOne( 
                { "_id": theGoal._id, "task._id": theGoal.task[t]._id }, 
                { "$set": { "task.$.implemented": implemented }},
                (err) => {
                    if (err) { return next(err); }
                }
            );
        }
    }

    Goal. 
    findOne({ parentTo: req.body.id }). 
    populate('parentTo'). 
    exec((err, parentGoal) => {
        if (err) { return next(err); }
        if (parentGoal) {
            calcTaskImpl(parentGoal);
            Goal. 
            findOne({ parentTo: parentGoal._id }). 
            populate('parentTo'). 
            exec((err, grandparentGoal) => {
                if (err) { return next(err); }
                if (grandparentGoal) {
                    calcTaskImpl(grandparentGoal);
                    return res.send('successfuly updated task implementation');
                } else {
                    return res.send('successfuly updated task implementation');
                }
            });                
        } else {
            return res.send('successfuly updated task implementation');
        }
    });
}

