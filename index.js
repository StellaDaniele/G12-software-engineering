const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'static'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static/schede'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static/styles'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static/data'), { extensions: ['html'] }));

app.listen(5000, ()=>{
    console.log("Starting...");
})
