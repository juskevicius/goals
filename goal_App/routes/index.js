var express = require('express');
var router = express.Router();

var goalController = require('../controllers/goalController');
var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', goalController.index);

/* POST create */
router.post('/create', goalController.goal_create_post);

/* GET goalView */
router.get('/goalDetails', goalController.goal_detail);

/* GET approved goals */
router.get('/accepted', goalController.goal_accepted_list);

/* GET own pending goals */
router.get('/pending/own', goalController.goal_own_pending_list);

/* GET offered pending goals */
router.get('/pending/offered', goalController.goal_off_pending_list);

/* GET rejected */
router.get('/rejected', goalController.goal_rejected_list);

/* GET user management */
router.get('/users', userController.user_smth);


module.exports = router;
