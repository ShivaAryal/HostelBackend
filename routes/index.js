const express = require('express');
const app = express();

const students = require('./student');
const wardens = require('./warden');
const guards = require('./guard')

app.use('/student',students);
app.use('/warden',wardens);
app.use('/guard',guards);

module.exports = app;