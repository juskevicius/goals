var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/about', function(req, res, next) {
  res.send('Testing321');
});

/*
/create
/goalView
/goalList/<id>/edit
/goalList/approved
/goalList/pending/own
/goalList/pending/offered
/goalList/rejected


*/

module.exports = router;
