const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost/hostel');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/', routes);

app.use('*',(req, res)=>{
    res.send("bad request");
})

app.listen(PORT,()=>{
    console.log("listeming on port",PORT);
})