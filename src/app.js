
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth.route');
app.use('/api/auth',authRouter);


module.exports =app;