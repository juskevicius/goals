var Goal = require('../models/Goal');
var hData = require('../models/hData');
const mongoose = require('mongoose');

exports.hData_update_post = function(req, res) {
  
  /* function to calculate historical data from children goals and/or grandchildren goals */
  function calcHistoricalData(theGoal, theHistory) {
    theGoal.parentTo = theGoal.parentTo.filter((child) => { return child.status == 'Approved'; });
    if (theGoal.parentTo.length > 0) {
        let weights = theGoal.parentTo.filter((childGoal) => { return childGoal.weight > 0;});
        if (theGoal.parentTo.length == weights.length || !weights.length) { /* if either all weights or none of the weights are defned, then continue */
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
                for (let j = 0; j < childArr.length; j++) { /* loop through children */
                    for (let k = 0; k < childArr[j].length; k++) { /* loop through children array of data [0..n].[date, value, weight] */
                        if (uniqueDates[i] == childArr[j][k][0]) { /* if the dates match, then set a new child's current score */
                            currChildScore[j] = childArr[j][k][1];
                            break;
                        } 
                    }
                    if (currChildScore[j]) { /* if the child has a current score */
                        currWeight = childArr[j][0][2] ? childArr[j][0][2] : 1; /* If weight is not defined, then set  it as 1  */
                        sum = sum + currChildScore[j] * currWeight; /* multiply the current score by it's weight and add to the sum */
                        weight = weight + currWeight; /* calculate the sum of weights*/
                    }
                }
                let dataToAdd = { date: new Date(uniqueDates[i]), value: Math.round(sum/weight) || 0 } 
                calcHistData.push(dataToAdd);
            }
            theHistory.data = calcHistData;
        }
    } else {
        theHistory.data = [{
            date: new Date('2019-01-01'),
            value: 0
        }];
    }
  }


  let parent = res.locals.parent; 
  Goal.
  findById(parent).
  populate({path: 'childTo parentTo', populate: { path: 'history' }}).
  exec( function (err, parentGoal) {
      if (err) { return err; }
      hData.
      findById(parentGoal.history).
      exec(function (err, parentHistory) {
          if (err) { return err; }
          calcHistoricalData(parentGoal, parentHistory); /* calculate historical data for parent goal */
          parentHistory.save(function (err) {
              if (err) { return err;}
              if (parentGoal.childTo[0]) { 
                  let grandparent = parentGoal.childTo[0];
                  Goal.
                  findById(grandparent).
                  populate({path: 'parentTo', populate: { path: 'history' }}).
                  exec( function (err, grandparentGoal) {
                      if (err) { return err; }
                      hData.
                      findById(grandparent.history).
                      exec(function (err, grandparentHistory) {
                          if (err) { return err; }
                          calcHistoricalData(grandparentGoal, grandparentHistory); /* calculate historical data for grandparent goal */
                          grandparentHistory.save(function (err) {
                              if (err) { return err;}
                              if (res.locals.formToDisplay) {
                                res.redirect(res.locals.formToDisplay);  
                              } else {
                                res.redirect('/details/' + res.locals.currGoal);
                              }        
                          });
                      });
                  });
              } else {
                if (res.locals.formToDisplay) {
                    res.redirect(res.locals.formToDisplay);  
                } else {
                    res.redirect('/details/' + res.locals.currGoal);
                }                
              }
          });
      });
  });
}