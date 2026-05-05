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


/**
 * @route GET /api/interview/report/:interviewId
 * @desc Retrieve a specific interview report by its ID.
 * @access Private
 */
interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController);
 


module.exports=interviewRouter;