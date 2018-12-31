const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const goalController = require('../controllers/goalController');
const hDataController = require('../controllers/hDataController');

/* Home page routes */

/* GET home page. */
router.get('/', auth.required, goalController.goal_homePage_get);

/* POST add */
router.post('/add', auth.required, goalController.goal_add_post);

/* GET details */
router.get('/details/:id', auth.required, goalController.goal_details_get);

/* POST add current score */
router.post('/addCurrentScore', auth.required, goalController.goal_addCurrentScore_post, hDataController.hData_update_post);

/* POST edit weight */
router.post('/editWeight', auth.required, goalController.goal_editWeight_post, hDataController.hData_update_post);

/* POST edit task implementation */
router.post('/taskImplementation', auth.required, goalController.goal_taskImplementation_post, hDataController.updateOneTaskImplementation);


/* Routes for my own goals */

/* GET myOwn */
router.get('/myOwn', auth.required, goalController.goal_myOwn_get);

/* POST edit */
router.post('/edit', auth.required, goalController.goal_edit_post);

/* POST delete */
router.post('/delete', auth.required, goalController.goal_delete_post, hDataController.hData_update_post);

/* POST offerTo */
router.post('/offerTo', auth.required, goalController.goal_offerTo_post);

/* POST accept */
router.post('/acceptOffer', auth.required, goalController.goal_acceptOffer_post, hDataController.updateAllTasksImplementation);

/* POST owners offer */
router.post('/ownersOffer', auth.required, goalController.goal_ownersOffer_post);


/* Routes for others' goals */

/* GET others */
router.get('/others', auth.required, goalController.goal_others_get);

/* POST approvers offer */
router.post('/approversOffer', auth.required, goalController.goal_approversOffer_post);

/* POST approve */
router.post('/approve', auth.required, goalController.goal_approve_post);

/* POST reject */
router.post('/reject', auth.required, goalController.goal_reject_post);


module.exports = router;
