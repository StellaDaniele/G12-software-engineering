const express = require('express');
const path = require('path');
const app = express();
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// [TO-DO] Add swaggerOptions
const CONNECTION_STRING="mongodb+srv://G12:1aRI17qvJk67R@g12-nutritionfacts.sxr24.mongodb.net/test";
const DATABASE= "Food";
let db;

app.use(express.static(path.join(__dirname, '../static'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/schede'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/styles'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../data'), { extensions: ['html'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/*app.get('/',(req,res)=>{
    console.log("HOME PAGE");
});*/

app.get('/datiAllenatore',(req,res)=>{
    res.sendFile((path.join(__dirname, '../data/info_allenatore.json')))
    console.log("Pagina dei dati allenatore");
});

app.listen(5000, ()=>{
    console.log("APIs Running");
    mongodb.connect(CONNECTION_STRING,{ useNewUrlParser:true,useUnifiedTopology:true},(error,client)=>{
        if(error){
            console.log("Errore: "+error);
        }
        else{
            db=client.db(DATABASE);
            console.log("DB connesso");
            db.collection("Food").find({},{projection:{_id:0,nome:1}}).toArray(function(err,res){
                if(err){
                    console.log("Errore nel db"+err);
                }
                else{
                    console.log(res);
                }
            })
        }
    })
    
})
