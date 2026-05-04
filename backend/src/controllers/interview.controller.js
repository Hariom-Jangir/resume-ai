const { PDFParse } = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport } = require("../services/ai.service");

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

    console.log("AI OBJECT TO SAVE:", interViewReportByAi);

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

module.exports = { generateInterViewReportController };