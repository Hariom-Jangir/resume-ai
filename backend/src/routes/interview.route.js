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
 
/**
 * @route GET /api/interview/
 * @desc Retrieve all interview reports for the logged-in user.
 * @access Private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @desc Generate a resume PDF for a specific interview report.
 * @access Private
 */
interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware.authUser, interviewController.generateResumePdfController);



module.exports=interviewRouter;