const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const goalController = require('../controllers/goalController');
const hDataController = require('../controllers/hDataController');

/* GET home page. */
router.get('/', auth.required, goalController.goal_homePage_get);

/* GET add */
router.get('/add', auth.required, goalController.goal_homePage_get);

/* POST add */
router.post('/add', auth.required, goalController.goal_add_post);



/* GET myOwn */
router.get('/myOwn', auth.required, goalController.goal_myOwn_get);

/* GET myOwn - goals of others */
router.get('/myOwn/:id', auth.required, goalController.goal_homePage_get);

/* GET edit */
//router.get('/edit/:id', auth.required, goalController.goal_edit_get);

/* POST edit */
router.post('/edit', auth.required, goalController.goal_edit_post);

/* GET delete */
//router.get('/delete/:id', auth.required, goalController.goal_delete_get);

/* POST delete */
router.post('/delete', auth.required, goalController.goal_delete_post, hDataController.hData_update_post);

/* GET offerTo */
//router.get('/offerTo/:id', auth.required, goalController.goal_offerTo_get);

/* POST offerTo */
router.post('/offerTo', auth.required, goalController.goal_offerTo_post);

/* GET accept */
//router.get('/acceptOffer/:id', auth.required, goalController.goal_acceptOffer_get);

/* POST accept */
router.post('/acceptOffer', auth.required, goalController.goal_acceptOffer_post, hDataController.updateAllTasksImplementation);

/* GET negotiate offered */
//router.get('/negotiateOffered/:id', auth.required, goalController.goal_negotiateOffered_get);

/* GET negotiate own */
//router.get('/negotiateOwn/:id', auth.required, goalController.goal_negotiateOwn_get);

/* POST negotiate my own goals */
router.post('/negotiate', auth.required, goalController.goal_negotiate_post);



/* GET others */
router.get('/others', auth.required, goalController.goal_others_get);

/* GET negotiate my offered */
//router.get('/negotiateMyOffered/:id', auth.required, goalController.goal_negotiateMyOffered_get);

/* GET negotiate their own */
//router.get('/negotiateTheirOwn/:id', auth.required, goalController.goal_negotiateTheirOwn_get);

/* POST negotiate others' goals*/
router.post('/negotiateOthers', auth.required, goalController.goal_negotiateOthers_post);

/* GET approve */
//router.get('/approve/:id', auth.required, goalController.goal_approve_get);

/* POST approve */
router.post('/approve', auth.required, goalController.goal_approve_post);

/* GET reject */
//router.get('/reject/:id', auth.required, goalController.goal_reject_get);

/* POST reject */
router.post('/reject', auth.required, goalController.goal_reject_post);

/* GET details */
router.get('/details/:id', auth.required, goalController.goal_details_get);

/* POST add current score */
router.post('/addCurrentScore', auth.required, goalController.goal_addCurrentScore_post, hDataController.hData_update_post);

/* POST edit weight */
router.post('/editWeight', auth.required, goalController.goal_editWeight_post, hDataController.hData_update_post);

/* POST edit task implementation */
router.post('/taskImplementation', auth.required, goalController.goal_taskImplementation_post, hDataController.updateOneTaskImplementation);

module.exports = router;
