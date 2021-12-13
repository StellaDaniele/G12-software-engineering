//////////////// CONSTANTS
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
// [TO-DO] Add swaggerOptions

// MongoDB
const mongodb = require('mongodb').MongoClient;
const { type } = require('os');
const CONNECTION_STRING = "mongodb+srv://G12:1aRI17qvJk67R@g12-nutritionfacts.sxr24.mongodb.net/test";
const DATABASE = "Food";
let database;

// XML
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API for My Project',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Group12',
                url: 'http://localhost:5000/',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000/',
                description: 'Development server',
            },
        ],
    },
    apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static(path.join(__dirname, '../static'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/schede'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../static/styles'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, '../data'), { extensions: ['html'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
var cors = require('cors')
app.use(cors())

/*app.get('/',(req,res)=>{
    console.log("HOME PAGE");
});*/




//////////////// GET APIs

// [DONE] Api per JSON dati allenatore
/**
 * @swagger
 * /api/datiAllenatore:
 *   get:
 *     summary: Retrieve the information about the trainer.
 *     description: Retrieve the trainer's attributes from the Server.
 *     responses:
 *       200:
 *         description: The trainer's information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                    type: string
 *                    description: The trainer's name.
 *                    example: Marco
 *                 cognome:
 *                    type: string
 *                    description: The trainer's last name.
 *                    example: Matteazzi
 *                 eta:
 *                    type: integer
 *                    description: The trainer's age.
 *                    example: 36
 *                 certificazione:
 *                    type: string
 *                    description: The triner's certification.
 *                    example: FIPE
 */
app.get('/api/datiAllenatore', (req, res) => {
    res.sendFile((path.join(__dirname, '../data/info_allenatore.json')));
    //console.log("Pagina dei dati allenatore");
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
    var riepilogo = JSON.parse('[]');

    for (let [i] of myObject.entries()) {
        var equal = true;
        for (var j = 0; j < 10 && equal; j++) {
            equal = (myObject[i].data).toString().charAt(j) == today.charAt(j);
        }

        if (equal) {
            riepilogo.push(myObject[i]);
        }
    }
    response.send(riepilogo);

})

// [DONE] Api per riepilogo giornaliero alimentazione
app.get('/api/riepilogo_alimentazione', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;

    var myObject = JSON.parse(data);
    var riepilogo = JSON.parse('[]');

    for (let [i] of myObject.entries()) {
        var equal = true;

        for (var j = 0; j < 10 && equal; j++) {
            equal = (myObject[i].data).toString().charAt(j) == today.charAt(j);
        }

        if (equal) {
            riepilogo.push(myObject[i]);
        }
    }

    response.send(riepilogo);
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

    database.collection("Food").findOne({ nome: alimento }, function (err, result) {
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
        result["quantita"] = parseFloat(request.params.quantita);
        response.send(result);
    });

})


//////////////// POST APIs

// Api per inserimento nel JSON cronologia_alimentazione
app.post('/api/cronologia_alimentazione/:nome/:quantita', (request, response) => {
    // chiamiamo l'altra API
    var valori_nutrizionali = new XMLHttpRequest();

    var stringa = 'http://localhost:5000/api/valori_nutrizionali/' + request.params.nome + '/' + request.params.quantita;

    valori_nutrizionali.open('GET', stringa);
    valori_nutrizionali.send();

    // inserire if di stato risposta api
    var risposta;
    valori_nutrizionali.onload = function () {
        risposta = this.response;

        // lettura file json e estrazione dati
        var data = fs.readFileSync('cronologia_alimentazione.json');
        var myObject = JSON.parse(data);

        //aggiunta nuovo elemento
        myObject.push(JSON.parse(risposta));

        //aggiornamento file json con il nuovo elemento
        var newData = JSON.stringify(myObject);
        fs.writeFile('cronologia_alimentazione.json', newData, err => {
            // error checking
            if (err) throw err;

        });

        response.json("Prodotto Aggiunto Correttamente: (" + myObject.length + ")");
    }
})


// Api per inserimento nel JSON cronologia_allenamento
// l'inserimento della data deve essere automatico, non manuale
app.post('/api/cronologia_allenamento', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;

    // creazione nuovo elemento da inserire da Request Parameter
    let nuovaAttività = {
        "nome": request.body['nome'],
        "tempo": request.body['tempo'],
        "energia_bruciata": request.body['energia_bruciata'],
        "data": today
    };

    //aggiunta nuovo elemento
    myObject.push(nuovaAttività);

    //aggiornamento file json con il nuovo elemento
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_allenamento.json', newData, err => {
        // error checking
        if (err) throw err;

    });

    response.json("Attività aggiunta correttamente: (" + myObject.length + ")");
})




//////////////// DELETE APIs
// [DONE] Api per eliminazione da cronologia_alimentazione
app.delete('/api/cronologia_alimentazione/:nome/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);

    for (let [i] of myObject.entries()) {
        if (myObject[i].nome === request.params.nome && myObject[i].data === request.params.data) {
            myObject.splice(i, 1);
        }
    }
    //memorizzo il nuovo JSON dopo la cancellazione
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_alimentazione.json', newData, err => {
        // error checking
        if (err) throw err;
    });
    response.json("Deleted Successfully: " + myObject.length);
})

// [DONE] Api per eliminazione da cronologia_allenamento
app.delete('/api/cronologia_allenamento/:nome/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);

    for (let [i] of myObject.entries()) {

        if (myObject[i].nome == request.params.nome && myObject[i].data == request.params.data) {
            myObject.splice(i, 1);
        }
    }
    //memorizzo il nuovo JSON dopo la cancellazione
    var newData = JSON.stringify(myObject);
    fs.writeFile('cronologia_allenamento.json', newData, err => {
        // error checking
        if (err) throw err;
    });
    response.json("Deleted Successfully: " + myObject.length);
})




//////////////// UTILITY APIs

// Api per calorie assunte
app.get('/api/calorie_assunte', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;

    var myObject = JSON.parse(data);

    var totale = 0;
    for (let [i] of myObject.entries()) {
        var equal = true;

        for (var j = 0; j < 10 && equal; j++) {
            equal = (myObject[i].data).toString().charAt(j) == today.charAt(j);
        }

        if (equal) {
            totale += parseFloat(myObject[i].energia);
        }
    }

    response.json(totale);
})


// Api per calorie bruciate
app.get('/api/calorie_bruciate', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;

    var myObject = JSON.parse(data);

    var totale = 0;
    for (let [i] of myObject.entries()) {
        var equal = true;

        for (var j = 0; j < 10 && equal; j++) {
            equal = (myObject[i].data).toString().charAt(j) == today.charAt(j);
        }

        if (equal) {
            totale += parseFloat(myObject[i].energia_bruciata);
        }
    }

    response.json(totale);
})




app.listen(5000, () => {
    console.log("APIs Running");
    mongodb.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log("Errore: " + error);
        }
        else {
            database = client.db(DATABASE);
            console.log("DB Connected");
        }
    })

})
