const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const userController = require('../controllers/userController');

//POST new user route (optional, everyone has access)
router.post('/savenewcred', auth.optional, userController.user_save_new_credentials);

//GET login route
router.get('/login', auth.optional, userController.user_login_get);

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, userController.user_login_post);

/* GET user management */
router.get('/userManagement', auth.required, userController.user_create_get);

/* POST user management */
router.post('/createUser', auth.required, userController.user_create_post);

module.exports = router;