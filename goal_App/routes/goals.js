const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const goalController = require('../controllers/goalController');

/* GET home page. */
router.get('/', auth.required, goalController.index);

/* GET add */
/* Is loaded in the background together with the home page. 
Gets displayed when clicked. Gets hidden when submitted or clicked on the background */

/* POST add */
router.post('/add', auth.required, goalController.goal_add_post);

/* GET myOwn */
router.get('/myOwn', auth.required, goalController.goal_myOwn_get);

/* GET edit */
router.get('/edit/:id', auth.required, goalController.goal_edit_get);

/* POST edit */
router.post('/edit', auth.required, goalController.goal_edit_post);

/* GET delete */
router.get('/delete/:id', auth.required, goalController.goal_delete_get);

/* POST delete */
router.post('/delete', auth.required, goalController.goal_delete_post);

/* GET offerTo */
router.get('/offerTo/:id', auth.required, goalController.goal_offerTo_get);

/* POST offerTo */
router.post('/offerTo', auth.required, goalController.goal_offerTo_post);

/* GET accept */
router.get('/accept/:id', auth.required, goalController.goal_accept_get);

/* POST accept */
router.post('/accept', auth.required, goalController.goal_accept_post);

/* GET negotiate */
router.get('/negotiate/:id', auth.required, goalController.goal_negotiate_get);

/* POST negotiate */
router.post('/negotiate', auth.required, goalController.goal_negotiate_post);


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
