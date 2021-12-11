const express = require('express');
const path = require('path');
const app = express();
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// [TO-DO] Add swaggerOptions
const CONNECTION_STRING = "mongodb+srv://G12:1aRI17qvJk67R@g12-nutritionfacts.sxr24.mongodb.net/test";
const DATABASE = "Food";
const fs = require('fs');


let db;

app.use(express.static(path.join(__dirname, '../static'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/schede'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/styles'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../data'), { extensions: ['html'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.get('/',(req,res)=>{
    console.log("HOME PAGE");
});*/

// Api per JSON dati allenatore
app.get('/datiAllenatore', (req, res) => {
    res.sendFile((path.join(__dirname, '../data/info_allenatore.json')))
    console.log("Pagina dei dati allenatore");
});


// Api per JSON cronologia alimentazione
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

// Api per riepilogo giornaliero allenamento
app.get('/api/riepilogo_allenamento', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '_' + mm + '_' + yyyy;

    var myObject = JSON.parse(data);

    for (let [i, attività] of myObject.attività.entries()) {

        if (myObject.attività.Data != today) {
            myObject.attività.splice(i, 1);
        }
    }

    response.send(myObject);

})


// Api per inserimento nel JSON cronologia_alimentazione
app.post('/api/cronologia_alimentazione', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);


    // creazione nuovo elemento da inserire da Request Parameter
    let newProduct = {
        "Name": request.body['Name'],
        "Price": request.body['Price'],
        "Location": request.body['Location']
    };

    //aggiunta nuovo elemento
    myObject.products.push(newProduct);

    //aggiornamento file json con il nuovo elemento
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_alimentazione.json', newData, err => {
        // error checking
        if (err) throw err;

    });

    response.json("Prodotto Aggiunto Correttamente: (" + myObject.products.length + ")");
})


// [DONE] Api per inserimento nel JSON cronologia_allenamento
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
            db = client.db(DATABASE);
            console.log("DB connesso");
            db.collection("Food").findOne({nome:"Pera"}, function(err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
    })

})
