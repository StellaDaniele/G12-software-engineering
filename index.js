const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'static'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static/schede'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static/styles'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static/data'), { extensions: ['html'] }));

app.get('/',(req,res)=>{
    console.log("HOME PAGE");
});

app.get('/datiAlenatore',(req,res)=>{
    res.sendFile((path.join(__dirname, './static/data/info_allenatore.json')))
});

app.listen(5000, ()=>{
    console.log("Starting...");
})
