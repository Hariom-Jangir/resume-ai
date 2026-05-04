const express=require('express');
const authMiddleware=require('../middleware/auth.middleware');
const interviewController=require('../controllers/interview.controller');

const interviewRouter=express.Router();
const upload=require('../middleware/file.middleware');
/**
 * @route POST /api/interview/report
 * @desc Generate an interview report based on the provided resume, self-description, and job description.
 * @access Private
 */
interviewRouter.post('/', authMiddleware.authUser,upload.single("resume"), interviewController.generateInterViewReportController);

module.exports=interviewRouter;