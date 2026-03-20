const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public  
 */
authRouter.post('/register',registerUsercontroller);
module.exports = authRouter;
