const express = require('express');
const router = express.Router();

const goalController = require('../controllers/goalController');
const userController = require('../controllers/userController');

router.use('/api', require('./api'));

/* GET home page. */
/*router.get('/', goalController.index);*/

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
router.get('/userManagement', userController.user_create_get);

/* POST user management */
router.post('/createUser', userController.user_create_post);


module.exports = router;
