const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const userController = require('../controllers/userController');
const goalController = require('../controllers/goalController');
const validationController = require('../controllers/validationController');
const authorization = require('../controllers/authorization');

//GET create user
router.get('/users', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.user_create_get
);

//POST create user
router.post('/users', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.user_create_post
);

//POST update user
router.post('/usersUpdate', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.user_update_post
);

//POST delete user
router.post('/usersDelete', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.user_delete_post
);

//POST login route
router.post('/login', 
  auth.optional, 
  validationController.user_login_post,
  userController.user_login_post, 
  goalController.goal_homePage_get
);

/* GET unit management */
router.get('/units', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.unit_create_get
);

/* POST create unit */
router.post('/units', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.unit_create_post
);

/* POST update unit */
router.post('/unitsUpdate', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.unit_update_post
);

//POST delete unit
router.post('/unitsDelete', 
  validationController.validate_cookie, 
  auth.required, 
  authorization.restrict_to_admin, 
  userController.unit_delete_post
);

/* POST unit management */
router.get('/logout', 
  validationController.validate_cookie, 
  auth.required, 
  userController.logout_get
);

module.exports = router;