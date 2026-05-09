
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.route');


app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports =app;