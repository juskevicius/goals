const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const userController = require('../controllers/userController');

//POST new user route (optional, everyone has access)
router.post('/savenewcred', auth.optional, userController.user_save_new_credentials);

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, userController.user_login);

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, userController.user_current);

/* GET user management */
router.get('/userManagement', userController.user_create_get);

/* POST user management */
router.post('/createUser', userController.user_create_post);

module.exports = router;