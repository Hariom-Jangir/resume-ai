const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const {loginUsercontroller, registerUsercontroller, logoutUsercontroller} = authController;
const authMiddleware = require('../middleware/auth.middleware');
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public  
 */

authRouter.post('/register',registerUsercontroller);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

authRouter.post('/login',loginUsercontroller);


/** 
 * @route GET /api/auth/logout
 * @desc Logout a user (blacklist token)
 * @access Public
 */

authRouter.get('/logout',logoutUsercontroller);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
authRouter.get('/get-me',authMiddleware.authUser,authController.getMeController);

module.exports = authRouter;
