//////////////// CONSTANTS
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
// [TO-DO] Add swaggerOptions

// MongoDB
const mongodb = require('mongodb').MongoClient;
const { type } = require('os');
const CONNECTION_STRING = "mongodb+srv://G12:1aRI17qvJk67R@g12-nutritionfacts.sxr24.mongodb.net/test";
const DATABASE = "Food";
let database;

app.use(express.static(path.join(__dirname, '../static'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/schede'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/styles'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../data'), { extensions: ['html'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.get('/',(req,res)=>{
    console.log("HOME PAGE");
});*/




//////////////// GET APIs

// [DONE] Api per JSON dati allenatore
app.get('/datiAllenatore', (req, res) => {
    res.sendFile((path.join(__dirname, '../data/info_allenatore.json')))
    console.log("Pagina dei dati allenatore");
});


// [DONE] Api per JSON cronologia alimentazione
app.get('/api/cronologia_alimentazione', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);

    response.send(myObject);

})


// [DONE] Api per JSON cronologia allenamento
app.get('/api/cronologia_allenamento', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);

    response.send(myObject);

})


// [DONE] Api per riepilogo giornaliero allenamento
app.get('/api/riepilogo_allenamento', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;

    var myObject = JSON.parse(data);

    for (let [i, attività] of myObject.attività.entries()) {

        if (myObject.attività.Data != today) {
            myObject.attività.splice(i, 1);
        }
    }

    response.send(myObject);

})


// [DONE] Api per ricerca nel DB di un alimento
app.get('/api/valori_nutrizionali/:nome/:quantita', (request, response) => {

    var alimento = request.params.nome;
    var quantità = parseFloat(request.params.quantita) / 100;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;

    database.collection("Food").findOne({ nome: alimento}, function (err, result) {
        if (err) throw err;

        result["energia"] = result["energia"] * quantità; 
        result["grassi"] = result["grassi"] * quantità; 
        result["carboidrati"] = result["carboidrati"] * quantità; 
        result["proteine"] = result["proteine"] * quantità; 
        result["fibre"] = result["fibre"] * quantità; 
        result["ferro"] = result["ferro"] * quantità; 
        result["iodio"] = result["iodio"] * quantità; 
        result["magnesio"] = result["magnesio"] * quantità; 
        result["data"] = today;
        result["quantita"] = request.params.quantita;
        response.send(result);
    });

})


//////////////// POST APIs

// Api per inserimento nel JSON cronologia_alimentazione
app.post('/api/cronologia_alimentazione/:nome/:quantita', (request, response) => {
    // chiamiamo l'altra API
    var valori_nutrizionali = new XMLHttpRequest();
    valori_nutrizionali.open('GET', 'localhost:5000/api/valori_nutrizionali/' + valori_nutrizionali.params.nome + valori_nutrizionali.params.quantita, true);
// inserire if di stato risposta api
    var risposta;
    valori_nutrizionali.onload = function () {
        risposta = this.response;
    }

    // lettura file json e estrazione dati
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);

/*
    // creazione nuovo elemento da inserire da Request Parameter
    let newProduct = {
        "Name": request.body['Name'],
        "Price": request.body['Price'],
        "Location": request.body['Location']
    };
*/
    //aggiunta nuovo elemento
    myObject.products.push(risposta);

    //aggiornamento file json con il nuovo elemento
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_alimentazione.json', newData, err => {
        // error checking
        if (err) throw err;

    });

    response.json("Prodotto Aggiunto Correttamente: (" + myObject.products.length + ")");
})


// Api per inserimento nel JSON cronologia_allenamento
// l'inserimento della data deve essere automatico, non manuale
app.post('/api/cronologia_allenamento', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);


    // creazione nuovo elemento da inserire da Request Parameter
    let nuovaAttività = {
        "Nome": request.body['Nome'],
        "Tempo": request.body['Tempo'],
        "Energia_bruciata": request.body['Energia_bruciata'],
        "Data": request.body['Data']
    };

    //aggiunta nuovo elemento
    myObject.attività.push(nuovaAttività);

    //aggiornamento file json con il nuovo elemento
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_allenamento.json', newData, err => {
        // error checking
        if (err) throw err;

    });

    response.json("Attività aggiunta correttamente: (" + myObject.attività.length + ")");
})




//////////////// DELETE APIs
// Api per eliminazione da cronologia_alimentazione
app.delete('/api/cronologia_alimentazione/:name/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);
    for (let [i, product] of myObject.products.entries()) {

        if (product.Name == request.params.name && product.Data == request.params.data) {
            myObject.products.splice(i, 1);
        }
    }
    //memorizzo il nuovo JSON dopo la cancellazione
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_alimentazione.json', newData, err => {
        // error checking
        if (err) throw err;
    });
    response.json("Deleted Successfully: " + myObject.products.length);
})

// [DONE] Api per eliminazione da cronologia_allenamento
app.delete('/api/cronologia_allenamento/:nome/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);
    for (let [i, attività] of myObject.attività.entries()) {

        if (attività.Nome == request.params.nome && attività.Data == request.params.data) {
            myObject.attività.splice(i, 1);
        }
    }
    //memorizzo il nuovo JSON dopo la cancellazione
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_allenamento.json', newData, err => {
        // error checking
        if (err) throw err;
    });
    response.json("Deleted Successfully: " + myObject.attività.length);
})



































app.listen(5000, () => {
    console.log("APIs Running");
    mongodb.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log("Errore: " + error);
        }
        else {
            database = client.db(DATABASE);
            console.log("DB connesso");
        }
    })

})
