require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');
const { resume, selfDescription, jobDescription } = require('./src/services/temp');
const generateInterviewReport = require('./src/services/ai.service');

connectDB();

(async () => {
    try {
        console.log("Calling Gemini AI...");
        const result = await generateInterviewReport({ resume, selfDescription, jobDescription });
        console.log("Gemini Response ✅:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Gemini Error ❌:", error.message);
    }
})();

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});