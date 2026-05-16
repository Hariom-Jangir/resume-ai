const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteerCore = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const FINAL_SCHEMA = z.object({
  title: z.string().min(2),
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z
    .array(
      z.object({
        question: z.string().min(5),
        intention: z.string().min(10),
        answer: z.string().min(20),
      })
    )
    .length(5),
  behavioralQuestions: z
    .array(
      z.object({
        question: z.string().min(5),
        intention: z.string().min(10),
        answer: z.string().min(20),
      })
    )
    .length(5),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().min(2),
        severity: z.enum(["low", "medium", "high"]),
      })
    )
    .min(3),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().int().min(1),
        focus: z.string().min(3),
        tasks: z.array(z.string().min(3)).min(2),
      })
    )
    .length(7),
});

function clean(v) {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";
}

function extractJson(text) {
  const raw = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(raw);
  } catch {
    const s = raw.indexOf("{");
    const e = raw.lastIndexOf("}");
    if (s === -1 || e === -1 || e <= s)
      throw new Error("No valid JSON in model output");
    return JSON.parse(raw.slice(s, e + 1));
  }
}

function normalizeQuestion(item, kind, index) {
  const fallbackQ =
    kind === "technical"
      ? `Technical question ${index + 1} about the role`
      : `Behavioral question ${index + 1} about past experience`;

  if (!item || (typeof item !== "string" && typeof item !== "object")) {
    return {
      question: fallbackQ,
      intention: `Assess the candidate's knowledge relevant to the role.`,
      answer: `Draw from your experience and projects to answer this question clearly.`,
    };
  }

  const q =
    typeof item === "string"
      ? clean(item)
      : clean(item.question);

  const intention =
    typeof item === "object" ? clean(item.intention) : "";
  const answer =
    typeof item === "object" ? clean(item.answer) : "";

  return {
    question: q || fallbackQ,
    intention: intention || `Assess the candidate's knowledge relevant to the role.`,
    answer: answer || `Draw from your experience and projects to answer this question clearly.`,
  };
}

function normalizeSkillGap(item, index) {
  if (typeof item === "string") {
    const text = clean(item);
    const severity = /high/i.test(text)
      ? "high"
      : /low/i.test(text)
      ? "low"
      : "medium";
    return { skill: text || `Skill gap ${index + 1}`, severity };
  }
  if (item && typeof item === "object") {
    const skill = clean(item.skill) || `Skill gap ${index + 1}`;
    const severity = ["low", "medium", "high"].includes(item.severity)
      ? item.severity
      : "medium";
    return { skill, severity };
  }
  return { skill: `Skill gap ${index + 1}`, severity: "medium" };
}

function normalizePlan(item, index) {
  if (typeof item === "string") {
    const focus = clean(item) || `Preparation day ${index + 1}`;
    return {
      day: index + 1,
      focus,
      tasks: [`Study ${focus}`, `Practice exercises for ${focus}`],
    };
  }
  if (item && typeof item === "object") {
    const day = Number(item.day);
    const focus = clean(item.focus) || `Preparation day ${index + 1}`;
    const tasks = Array.isArray(item.tasks)
      ? item.tasks.map(clean).filter(Boolean)
      : [];
    return {
      day: Number.isFinite(day) && day > 0 ? Math.floor(day) : index + 1,
      focus,
      tasks:
        tasks.length >= 2
          ? tasks
          : [`Study ${focus}`, `Practice exercises for ${focus}`],
    };
  }
  return {
    day: index + 1,
    focus: `Preparation day ${index + 1}`,
    tasks: [`Study the topic`, `Practice exercises`],
  };
}

function buildNormalizedReport(raw) {
  let tq = Array.isArray(raw?.technicalQuestions)
    ? raw.technicalQuestions.map((x, i) => normalizeQuestion(x, "technical", i))
    : [];
  while (tq.length < 5)
    tq.push(normalizeQuestion(null, "technical", tq.length));
  tq = tq.slice(0, 5);

  let bq = Array.isArray(raw?.behavioralQuestions)
    ? raw.behavioralQuestions.map((x, i) => normalizeQuestion(x, "behavioral", i))
    : [];
  while (bq.length < 5)
    bq.push(normalizeQuestion(null, "behavioral", bq.length));
  bq = bq.slice(0, 5);

  let sg = Array.isArray(raw?.skillGaps)
    ? raw.skillGaps.map((x, i) => normalizeSkillGap(x, i))
    : [];
  while (sg.length < 3)
    sg.push({ skill: `Skill gap ${sg.length + 1}`, severity: "medium" });

  let pp = Array.isArray(raw?.preparationPlan)
    ? raw.preparationPlan.map((x, i) => normalizePlan(x, i))
    : [];
  while (pp.length < 7) pp.push(normalizePlan(null, pp.length));
  pp = pp.slice(0, 7).map((d, i) => ({ ...d, day: i + 1 }));

  const match = Number(raw?.matchScore);
  return {
    title: clean(raw?.title) || "Interview Preparation Report",
    matchScore: Number.isFinite(match)
      ? Math.max(0, Math.min(100, match))
      : 70,
    technicalQuestions: tq,
    behavioralQuestions: bq,
    skillGaps: sg,
    preparationPlan: pp,
  };
}

function buildPrompt({ resume, selfDescription, jobDescription, retry }) {
  return `You are a senior hiring manager and interview coach preparing a candidate for a real job interview.

You will be given the candidate's resume, their self-description, and the job description.
Your job is to deeply analyze all three and generate a JSON interview report.

=== CANDIDATE RESUME ===
${resume}

=== CANDIDATE SELF DESCRIPTION ===
${selfDescription}

=== JOB DESCRIPTION ===
${jobDescription}

=== OUTPUT FORMAT ===
Return ONLY a single valid JSON object. No markdown, no explanation outside the JSON.

=== FIELD RULES ===

"title": A specific title for this report, e.g. "Full Stack Developer Interview Report - [Candidate Name]"

"matchScore": A number 0-100 representing how well this candidate matches the job based on their skills, experience, and projects.

"technicalQuestions": Exactly 5 question objects.
  Each object must have:
  - "question": A technical question crafted from the actual skills, technologies, and projects mentioned in THIS candidate's resume that are relevant to THIS job. Each question must be unique and specific — not generic.
  - "intention": A 1-2 sentence explanation of WHICH specific job requirement this question tests, and WHY it matters for THIS role. Must reference actual requirements from the job description.
  - "answer": A specific guide telling the candidate exactly which part of THEIR background to reference, which project or experience to highlight, what technical depth to show, and what outcome or metric to mention. Must be grounded in what is actually in the resume.

"behavioralQuestions": Exactly 5 question objects.
  Each object must have:
  - "question": A behavioral question based on a real situation the candidate has faced, inferred from their resume (e.g. learning a new technology, working on a project with constraints, debugging a hard problem). Each question must be unique.
  - "intention": Which soft skill or behavioral trait this question is testing, and why it is important for THIS specific role and team context described in the job description.
  - "answer": Specific coaching on which story from the candidate's background to use, what details to include (context, actions, result), and what the ideal answer demonstrates to the interviewer.

"skillGaps": At least 3 objects with "skill" and "severity" (low/medium/high).
  Compare the job's required skills to the candidate's actual skills and experience. Only list real gaps — skills the job explicitly needs that the candidate has not demonstrated.

"preparationPlan": Exactly 7 objects, one per day.
  Each with:
  - "day": Day number (1-7)
  - "focus": The main topic or goal for that day, chosen based on the candidate's actual skill gaps and the job's requirements.
  - "tasks": At least 2 specific, actionable tasks. Tasks must be concrete (e.g. "Build a small Next.js app with SSR" not "Learn Next.js"). Reference actual technologies from the job or the candidate's profile.

=== CRITICAL RULES ===
- Every field must be grounded in the actual resume and job description provided above.
- Do NOT write generic intentions like "evaluate technical depth" or "assess communication skills".
- Do NOT write generic answers like "use STAR format" or "provide a structured response" — these are useless to the candidate.
- Intentions must name the specific job requirement being tested.
- Answers must name the specific experience or project from the candidate's resume to reference.
- This must work for ANY candidate with ANY background — a student, a senior engineer, a designer. Tailor everything to what is actually in the resume.
${retry ? "\nIMPORTANT: Your previous response had generic or template-like content. Rewrite ALL intention and answer fields. They must reference specific technologies, projects, or experiences from the candidate's resume and specific requirements from the job description." : ""}`;
}

async function callModel(promptText) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text =
    typeof response.text === "function" ? response.text() : response.text;
  console.log("AI RAW TEXT:\n", text);
  const parsed = extractJson(text);
  return buildNormalizedReport(parsed);
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  let report = await callModel(
    buildPrompt({ resume, selfDescription, jobDescription, retry: false })
  );

  const firstCheck = FINAL_SCHEMA.safeParse(report);

  if (!firstCheck.success) {
    console.warn(
      "First attempt failed Zod validation, retrying...",
      firstCheck.error.issues
    );
    report = await callModel(
      buildPrompt({ resume, selfDescription, jobDescription, retry: true })
    );
    const finalCheck = FINAL_SCHEMA.safeParse(report);
    if (!finalCheck.success) {
      throw new Error(
        `AI response did not match schema after retry: ${JSON.stringify(
          finalCheck.error.issues
        )}`
      );
    }
    return finalCheck.data;
  }

  return firstCheck.data;
}

async function launchPdfBrowser() {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
        return puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
    }

    const puppeteer = require("puppeteer");
    return puppeteer.launch();
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await launchPdfBrowser();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }


