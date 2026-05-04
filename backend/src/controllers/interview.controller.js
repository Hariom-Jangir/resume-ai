   const { PDFParse } = require('pdf-parse');

const interviewReportModel = require('../models/interviewReport.model');
const { generateInterviewReport } = require('../services/ai.service');
async function generateInterViewReportController(req, res) {
    try {
        // ✅ PDFParse is a class, instantiate and call getText()
        const parser = new PDFParse(Uint8Array.from(req.file.buffer));
        const resumeContent = await parser.getText();

        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.userId,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = { generateInterViewReportController };

