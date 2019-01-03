const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const authorization = require('../controllers/authorization');
const goalController = require('../controllers/goalController');
const hDataController = require('../controllers/hDataController');
const validationController = require('../controllers/validationController');

/* Home page routes */

/* GET home page. */
router.get('/', 
  validationController.validate_cookie, 
  auth.required, 
  goalController.goal_homePage_get
);

/* POST add */
router.post('/add', 
  validationController.validate_cookie, 
  auth.required, 
  validationController.goal_add_post, 
  goalController.goal_add_post
);

/* GET details */
router.get('/details/:id', 
  validationController.validate_cookie, 
  auth.required, 
  validationController.goal_details_get, 
  goalController.goal_details_get
);

/* POST add current score */
router.post('/addCurrentScore', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_owner_h_id, 
  validationController.goal_addCurrentScore_post, 
  goalController.goal_addCurrentScore_post, 
  hDataController.hData_update_post
);

/* POST edit weight */
router.post('/editWeight', 
  validationController.validate_cookie, 
  auth.required,
  /*authorization.restrict_to_owner, */
  validationController.goal_editWeight_post, 
  goalController.goal_editWeight_post, 
  hDataController.hData_update_post
);

/* POST edit task implementation */
router.post('/taskImplementation', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_owner,
  validationController.goal_taskImplementation_post,
  goalController.goal_taskImplementation_post, 
  hDataController.updateOneTaskImplementation
);


/* Routes for my own goals */

/* GET myOwn */
router.get('/myOwn', 
  validationController.validate_cookie, 
  auth.required, 
  goalController.goal_myOwn_get
);

/* GET myOwn (others' goals) */
router.get('/myOwn/:id', 
  validationController.validate_cookie, 
  auth.required, 
  goalController.goal_myOwn_get
);

/* POST edit */
router.post('/edit', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_owner, 
  validationController.goal_edit_post, 
  goalController.goal_edit_post
);

/* POST delete */
router.post('/delete', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_owner,
  validationController.goal_delete_post, 
  goalController.goal_delete_post, 
  hDataController.hData_update_post
);

/* POST offerTo */
router.post('/offerTo', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_owner,
  validationController.goal_offerTo_post,
  goalController.goal_offerTo_post
);

/* POST accept */
router.post('/acceptOffer', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_owner,
  validationController.goal_acceptOffer_post,
  goalController.goal_acceptOffer_post, 
  hDataController.updateAllTasksImplementation
);

/* POST owners offer */
router.post('/ownersOffer', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_owner, 
  validationController.goal_ownersOffer_post,
  goalController.goal_ownersOffer_post
);


/* Routes for others' goals */

/* GET others' goals */
router.get('/others', 
  validationController.validate_cookie, 
  auth.required, 
  goalController.goal_others_get
);

/* POST approvers offer */
router.post('/approversOffer', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_approver, 
  validationController.goal_approversOffer_post,
  goalController.goal_approversOffer_post
);

/* POST approve */
router.post('/approve', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_approver, 
  validationController.goal_approve_post,
  goalController.goal_approve_post
);

/* POST reject */
router.post('/reject', 
  validationController.validate_cookie, 
  auth.required,
  authorization.restrict_to_approver,
  validationController.goal_reject_post,
  goalController.goal_reject_post
);

module.exports = router;
