const { PDFParse } = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");

async function generateInterViewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF file is required." });
    }

    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription || !selfDescription) {
      return res
        .status(400)
        .json({ message: "jobDescription and selfDescription are required." });
    }

    const parser = new PDFParse(Uint8Array.from(req.file.buffer));
    const resumeContent = await parser.getText();
    const resumeText = resumeContent?.text || "";

    if (!resumeText.trim()) {
      return res.status(400).json({ message: "Could not extract text from resume PDF." });
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.userId,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    return res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (err) {
    console.error("Controller error:", err);
    return res.status(500).json({
      message: err.message || "Failed to generate interview report",
    });
  }
}

/**
 * @desc controller to get a specific interview report by its ID.
 */

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.userId,
    });
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found." });
    }
    return res.status(200).json({
      message: "Interview report retrieved successfully.",
      interviewReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch interview report.",
    });
  }
}

/**
 * @desc controller to get all interview reports of a user.
 * 
 */

async function getAllInterviewReportsController(req, res) {
    try {
      const interviewReports = await interviewReportModel.find({ user: req.userId }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

      return res.status(200).json({
          message: "Interview reports fetched successfully.",
          interviewReports
      })
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to fetch interview reports.",
      });
    }
}

async function generateResumePdfController(req, res) {
    try {
      const { interviewReportId } = req.params;

      const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.userId,
      });

      if (!interviewReport) {
        return res.status(404).json({
          message: "Interview report not found."
        });
      }

      const { resume, jobDescription, selfDescription } = interviewReport;
      const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
      });

      return res.send(pdfBuffer);
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to generate resume PDF."
      });
    }
}


module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController };