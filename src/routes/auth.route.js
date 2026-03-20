const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const {loginUsercontroller, registerUsercontroller} = authController;
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

module.exports = authRouter;
