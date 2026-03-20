
const express = require("express");
const app = express();

app.use(express.json());

const authRouter = require('./routes/auth.route');
app.use('/api/auth',authRouter);


module.exports =app;