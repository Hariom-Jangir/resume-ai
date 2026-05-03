const express=require('express');
const authMiddleware=require('../middleware/auth.middleware');
const interviewController=require('../controllers/interview.controller');

const interviewRouter=express.Router();

/**
 * @route POST /api/interview/report
 * @desc Generate an interview report based on the provided resume, self-description, and job description.
 * @access Private
 */
interviewRouter.post('/report', authMiddleware.authUser, interviewController.generateInterviewReportController);

module.exports=interviewRouter;