var express = require('express');
var router = express.Router();

var goalController = require('../controllers/goalController');
var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', goalController.index);

/* GET create */
router.get('/create', goalController.goal_create_get);

/* POST create */
router.post('/create', goalController.goal_create_post);

/* GET goalView */
router.get('/goalDetails', goalController.goal_detail);

/* GET approved goals */
router.get('/approved', goalController.goal_approved_list);

/* GET own pending goals */
router.get('/pending/own', goalController.goal_own_pending_list);

/* GET offered pending goals */
router.get('/pending/offered', goalController.goal_off_pending_list);

/* GET rejected */
router.get('/rejected', goalController.goal_rejected_list);

module.exports = router;
