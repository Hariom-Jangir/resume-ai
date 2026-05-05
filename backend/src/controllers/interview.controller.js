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

/**
 * @desc controller to get a specific interview report by its ID.
 */

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.userId,
  });
  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found." });

  }
  res.status(200).json({
    message: "Interview report retrieved successfully.",
    interviewReport,
  });
}

/**
 * @desc controller to get all interview reports of a user.
 * 
 */

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}


module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController };