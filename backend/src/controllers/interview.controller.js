const pdfParse = require('pdf-parse');
const generateInterviewReport = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');



async function generateInterviewReportController(req, res) {
const resumeFile = req.file; // Access the uploaded resume file
const resumeContent= await new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer)).gettext();

const { selfDescription, jobDescription } = req.body;

const interviewReportByAI = await generateInterviewReport({
    resume : resumeContent.text,
     selfDescription,
      jobDescription});

const interviewReport= await interviewReportModel.create({
    user:req.user._id,
   resume:resumeContent.text,   
    selfDescription,
     jobDescription,
      ...interviewReportByAI
})

res.status(201).json({
    message:"Interview report generated successfully",
    interviewReport
})

}

module.exports={
    generateInterviewReportController
}