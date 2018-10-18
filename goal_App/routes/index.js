var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/goalList');
});

/*
/goalList/create
/goalList/<id>/edit
/goalList/approved
/goalList/pending
/goalList/rejected


*/

module.exports = router;
