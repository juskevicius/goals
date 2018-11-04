const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const goalController = require('../controllers/goalController');

/* GET home page. */
router.get('/', auth.required, goalController.index);

/* POST create */
router.post('/create', auth.required, goalController.goal_create_post);

/* GET goalView */
router.get('/goalDetails', auth.required, goalController.goal_detail);

/* GET approved goals */
router.get('/accepted', auth.required, goalController.goal_accepted_list);

/* GET own pending goals */
router.get('/pending/own', auth.required, goalController.goal_own_pending_list);

/* GET offered pending goals */
router.get('/pending/offered', auth.required, goalController.goal_off_pending_list);

/* GET rejected */
router.get('/rejected', auth.required, goalController.goal_rejected_list);


module.exports = router;
