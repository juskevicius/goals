const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieValid');
const authorization = require('../controllers/authorization');

//GET create user
router.get('/users', auth.optional, userController.user_create_get);

//POST create user
router.post('/users', auth.optional, userController.user_create_post);

//POST update user
router.post('/usersUpdate', auth.optional, userController.user_update_post);

//POST delete user
router.post('/usersDelete', auth.optional, userController.user_delete_post);

//GET login route
router.get('/login', auth.optional, userController.user_login_get);

//POST login route
router.post('/login', auth.optional, userController.user_login_post);

/* GET unit management */
router.get('/units', cookieController.validate_cookie, auth.required, authorization.restrict_to_admin, userController.unit_create_get);

/* POST unit management */
router.post('/units', auth.required, userController.unit_create_post);

module.exports = router;