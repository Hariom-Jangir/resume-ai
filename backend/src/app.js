
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['set-cookie']  // ✅ add this
}));

app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.route');


app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports =app;