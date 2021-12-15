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
//const { request, response } = require("express");
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
var cors = require('cors');
const e = require('express');
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
 *     tags:
 *       - Main GET APIs
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
app.get('/api/datiAllenatore', (request, response) => {
    var data = fs.readFileSync('../data/info_allenatore.json');
    var myObject = JSON.parse(data);
    response.send(myObject);
});


// [DONE] Api per JSON cronologia alimentazione
/**
 * @swagger
 * /api/cronologia_alimentazione:
 *   get:
 *     summary: Retrieve the consummations history.
 *     description: Retrieve a list of foods, which is the consummations history, from the Server.
 *     tags:
 *       - Main GET APIs
 *     responses:
 *       200:
 *         description: A list of foods.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         description: The food's name.
 *                         example: Banana
 *                       energia:
 *                         type: number
 *                         format: float
 *                         description: The food's energy [kcal].
 *                         example: 78.072
 *                       grassi:
 *                         type: number
 *                         format: float
 *                         description: The food's fats.
 *                         example: 0.13
 *                       carboidrati:
 *                         type: number
 *                         format: float
 *                         description: The food's carbs.
 *                         example: 26.024
 *                       proteine:
 *                         type: number
 *                         format: float
 *                         description: The food's proteins.
 *                         example: 1.04
 *                       fibre:
 *                         type: number
 *                         format: float
 *                         description: The food's fibers.
 *                         example: 13.012
 *                       ferro:
 *                         type: number
 *                         format: float
 *                         description: The food's iron.
 *                         example: 1.17
 *                       iodio:
 *                         type: number
 *                         format: float
 *                         description: The food's iodine.
 *                         example: 0.013
 *                       magnesio:
 *                         type: number
 *                         format: float
 *                         description: The food's magnesium.
 *                         example: 1.171
 *                       data:
 *                          type: string
 *                          description: The food's consummation date.
 *                          example: 12_12_2021:21.43
 *                       quantita:
 *                          type: number
 *                          format: float
 *                          description: The food's quantity consummed.
 *                          example: 130.12
 */
app.get('/api/cronologia_alimentazione', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);

    response.send(myObject);

})



// [DONE] Api per JSON cronologia allenamento
/**
 * @swagger
 * /api/cronologia_allenamento:
 *   get:
 *     summary: Retrieve the workouts history.
 *     description: Retrieve a list of activities, which is the workouts history, from the Server.
 *     tags:
 *       - Main GET APIs
 *     responses:
 *       200:
 *         description: A list of activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         description: The activity's name.
 *                         example: Salti
 *                       tempo:
 *                         type: integer
 *                         description: The training time.
 *                         example: 85
 *                       energia_bruciata:
 *                         type: number
 *                         format: float
 *                         description: The energy burnt [kcal].
 *                         example: 654.1
 *                       data:
 *                          type: string
 *                          description: The workout date.
 *                          example: 12_12_2021:16.44
 */
app.get('/api/cronologia_allenamento', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);

    response.send(myObject);

})


// [DONE] Api per riepilogo giornaliero allenamento
/**
 * @swagger
 * /api/riepilogo_allenamento:
 *   get:
 *     summary: Retrieve the daily workout summary.
 *     description: Retrieve a list of activities, which is the daily workout summary, from the Server.
 *     tags:
 *       - Main GET APIs
 *     responses:
 *       200:
 *         description: A list of activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         description: The activity's name.
 *                         example: Salti
 *                       tempo:
 *                         type: integer
 *                         description: The training time.
 *                         example: 85
 *                       energia_bruciata:
 *                         type: number
 *                         format: float
 *                         description: The energy burnt [kcal].
 *                         example: 654.1
 *                       data:
 *                          type: string
 *                          description: The workout date.
 *                          example: 12_12_2021:16.44
 */
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
    //response.status(200);
    response.send(riepilogo);

})

// [DONE] Api per riepilogo giornaliero alimentazione
/**
 * @swagger
 * /api/riepilogo_alimentazione:
 *   get:
 *     summary: Retrieve the daily consummations summary.
 *     description: Retrieve a list of foods, which is the daily consummations summary, from the Server.
 *     tags:
 *       - Main GET APIs
 *     responses:
 *       200:
 *         description: A list of foods.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         description: The food's name.
 *                         example: Banana
 *                       energia:
 *                         type: number
 *                         format: float
 *                         description: The food's energy [kcal].
 *                         example: 78.072
 *                       grassi:
 *                         type: number
 *                         format: float
 *                         description: The food's fats.
 *                         example: 0.13
 *                       carboidrati:
 *                         type: number
 *                         format: float
 *                         description: The food's carbs.
 *                         example: 26.024
 *                       proteine:
 *                         type: number
 *                         format: float
 *                         description: The food's proteins.
 *                         example: 1.04
 *                       fibre:
 *                         type: number
 *                         format: float
 *                         description: The food's fibers.
 *                         example: 13.012
 *                       ferro:
 *                         type: number
 *                         format: float
 *                         description: The food's iron.
 *                         example: 1.17
 *                       iodio:
 *                         type: number
 *                         format: float
 *                         description: The food's iodine.
 *                         example: 0.013
 *                       magnesio:
 *                         type: number
 *                         format: float
 *                         description: The food's magnesium.
 *                         example: 1.171
 *                       data:
 *                          type: string
 *                          description: The food's consummation date.
 *                          example: 12_12_2021:21.43
 *                       quantita:
 *                          type: number
 *                          format: float
 *                          description: The food's quantity consummed.
 *                          example: 130.12
 */
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



//////////////// POST APIs

// Api per inserimento nel JSON cronologia_alimentazione
/**
 * @swagger
 * /api/cronologia_alimentazione/{name}/{quantity}:
 *   post:
 *     summary: Insert the given food into the consummation history.
 *     description: Insert in the consummations history the given food's information after the call to the external DB.
 *     tags:
 *       - Main POST APIs
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: the food's name.
 *       - in: path
 *         name: quantity
 *         schema:
 *             type: number
 *             format: float
 *         required: true
 *         description: the quantity consummed.
 *     responses:
 *       201:
 *         description: The given food's information.
 *       400:   
 *         description: Bad request, the quantity entered was either negative or not a number.
 *       404:   
 *         description: The food searched is not available in the database.
 */
app.post('/api/cronologia_alimentazione/:nome/:quantita', (request, response) => {
    // chiamiamo l'altra API
    var valori_nutrizionali = new XMLHttpRequest();

    var stringa = 'http://localhost:5000/api/valori_nutrizionali/' + request.params.nome + '/' + request.params.quantita;

    valori_nutrizionali.open('GET', stringa);
    valori_nutrizionali.send();

    valori_nutrizionali.onload = function () {
        if (this.status === 404 || this.status === 400) {
            response.status(this.status);
            response.send(this.response);
        }
        else {
            // lettura file json e estrazione dati
            var data = fs.readFileSync('cronologia_alimentazione.json');
            var myObject = JSON.parse(data);

            //aggiunta nuovo elemento
            myObject.push(JSON.parse(this.response));

            //aggiornamento file json con il nuovo elemento
            var newData = JSON.stringify(myObject);
            fs.writeFile('cronologia_alimentazione.json', newData, err => {
                // error checking
                if (err) throw err;

            });

            response.json("Prodotto Aggiunto Correttamente: (" + myObject.length + ")");
        }
    }
})


// Api per inserimento nel JSON cronologia_allenamento
// l'inserimento della data deve essere automatico, non manuale
/**
 * @swagger
 * /api/cronologia_allenamento:
 *   post:
 *     summary: Insert the given activity into the workouts history.
 *     description: Insert the given activity into the workouts history
 *     tags:
 *       - Main POST APIs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: The activity's name.
 *                 example: Salti
 *               tempo:
 *                 type: integer
 *                 description: The training time.
 *                 example: 85
 *               energia_bruciata:
 *                 type: number
 *                 format: float
 *                 description: The energy burnt [kcal].
 *                 example: 654.1
 *     responses:
 *       201:
 *         description: successful executed
 *       400:   
 *         description: The JSON entered was malformed or the content didn't satisfy the requirements (a negative or NaN time, energy, ...)
*/
app.post('/api/cronologia_allenamento', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('cronologia_allenamento.json');
    try {
        var myObject = JSON.parse(data);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var time = today.getHours() + "." + today.getMinutes();
        today = dd + '_' + mm + '_' + yyyy + ':' + time;

        // creazione nuovo elemento da inserire da Request Parameter
        if (request.body['nome'] == null || isNaN(parseInt(request.body['tempo']))
            || parseInt(request.body['tempo']) <= 0
            || isNaN(parseInt(request.body['energia_bruciata']))
            || parseFloat(request.body['energia_bruciata']) <= 0.0)
            throw e;
        let nuovaAttività = {
            "nome": request.body['nome'],
            "tempo": parseInt(request.body['tempo']),
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
    } catch (e) {
        response.status(400);
        response.send("The JSON entered was malformed or the content didn't satisfy the requirements (a negative or NaN time, energy, ...)");
    }
})




//////////////// DELETE APIs
// [DONE] Api per eliminazione da cronologia_alimentazione
/**
 * @swagger
 * /api/cronologia_alimentazione/{name}/{date}:
 *   delete:
 *     summary: Delete the given food from the consummation history.
 *     description: Delete the given food from the consummation history.
 *     tags:
 *       - Main DELETE APIs
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: the food's name.
 *       - in: path
 *         name: date
 *         schema:
 *             type: string
 *         required: true
 *         description: the date of consummation [dd_mm_yyyy:hh.mm].
 *     responses:
 *       201:
 *         description: the food was deleted.
 *       304:
 *         description: Nothing has been deleted, the data you want to delete is not in the consummation history.
 *       400:
 *         description: The date entered doesn't satisfy the requirements.
 */
app.delete('/api/cronologia_alimentazione/:nome/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);

    if (request.params.data.length < 14) {
        response.status(400);
        response.send("The date entered doesn't satisfy the requirements.");
    }
    else {
        var contenuti_prima = 0;
        for (let [i] of myObject.entries()) {
            contenuti_prima++;
        }

        for (let [i] of myObject.entries()) {
            if (myObject[i].nome === request.params.nome && myObject[i].data === request.params.data) {
                myObject.splice(i, 1);
            }
        }

        var contenuti_dopo = 0;
        for (let [i] of myObject.entries()) {
            contenuti_dopo++;
        }

        if (contenuti_prima == contenuti_dopo) {
            response.status(304);
            response.send("Nothing has been deleted, the data you want to delete is not in the consummation history.");
        }
        else {
            //memorizzo il nuovo JSON dopo la cancellazione
            var newData = JSON.stringify(myObject);
            fs.writeFile('cronologia_alimentazione.json', newData, err => {
                // error checking
                if (err) throw err;
            });
            response.json("Deleted Successfully: " + myObject.length);
        }
    }
})

// [DONE] Api per eliminazione da cronologia_allenamento
/**
 * @swagger
 * /api/cronologia_allenamento/{name}/{date}:
 *   delete:
 *     summary: Delete the given activity from the workouts history.
 *     description: Delete the given activity from the workouts history.
 *     tags:
 *       - Main DELETE APIs
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: the activity's name.
 *       - in: path
 *         name: date
 *         schema:
 *             type: string
 *         required: true
 *         description: the workout date [dd_mm_yyyy:hh.mm].
 *     responses:
 *       201:
 *         description: the activity was deleted.
 *       304:
 *         description: Nothing has been deleted, the data you want to delete is not in the workouts history.
 *       400:
 *         description: The date entered doesn't satisfy the requirements.
 */
app.delete('/api/cronologia_allenamento/:nome/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);

    if (request.params.data.length < 14) {
        response.status(400);
        response.send("The date entered doesn't satisfy the requirements.");
    }
    else {
        var contenuti_prima = 0;
        for (let [i] of myObject.entries()) {
            contenuti_prima++;
        }

        for (let [i] of myObject.entries()) {
            if (myObject[i].nome === request.params.nome && myObject[i].data === request.params.data) {
                myObject.splice(i, 1);
            }
        }

        var contenuti_dopo = 0;
        for (let [i] of myObject.entries()) {
            contenuti_dopo++;
        }

        if (contenuti_prima == contenuti_dopo) {
            response.status(304);
            response.send("Nothing has been deleted, the data you want to delete is not in the workouts history.");
        }
        else {
            //memorizzo il nuovo JSON dopo la cancellazione
            var newData = JSON.stringify(myObject);
            fs.writeFile('cronologia_allenamento.json', newData, err => {
                // error checking
                if (err) throw err;
            });
            response.json("Deleted Successfully: " + myObject.length);
        }
    }
})



//////////////// UTILITY GET APIs

// [DONE] Api per ricerca nel DB di un alimento
/**
 * @swagger
 * /api/valori_nutrizionali/{name}/{quantity}:
 *   get:
 *     summary: Retrieve the information about a given food.
 *     description: Retrieve the given food's information from the external DB.
 *     tags:
 *       - Utility APIs
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: the food's name.
 *       - in: path
 *         name: quantity
 *         schema:
 *             type: number
 *             format: float
 *         required: true
 *         description: the quantity consummed.
 *     responses:
 *       200:
 *         description: The given food's information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                    type: string
 *                    description: The food's name.
 *                    example: Banana
 *                 energia:
 *                    type: number
 *                    format: float
 *                    description: The food's energy [kcal].
 *                    example: 78.072
 *                 grassi:
 *                    type: number
 *                    format: float
 *                    description: The food's fats.
 *                    example: 0.13
 *                 carboidrati:
 *                    type: number
 *                    format: float
 *                    description: The food's carbs.
 *                    example: 26.024
 *                 proteine:
 *                    type: number
 *                    format: float
 *                    description: The food's proteins.
 *                    example: 1.04
 *                 fibre:
 *                    type: number
 *                    format: float
 *                    description: The food's fibers.
 *                    example: 13.012
 *                 ferro:
 *                    type: number
 *                    format: float
 *                    description: The food's iron.
 *                    example: 1.17
 *                 iodio:
 *                    type: number
 *                    format: float
 *                    description: The food's iodine.
 *                    example: 0.013
 *                 magnesio:
 *                    type: number
 *                    format: float
 *                    description: The food's magnesium.
 *                    example: 1.171
 *                 data:
 *                    type: string
 *                    description: The food's consummation date.
 *                    example: 12_12_2021:21.43
 *                 quantita:
 *                    type: number
 *                    format: float
 *                    description: The food's quantity consummed.
 *                    example: 130.12
 *       400:   
 *         description: Bad request, the quantity entered was either negative or not a number.
 *       404:   
 *         description: The food searched is not available in the database.
 */
app.get('/api/valori_nutrizionali/:nome/:quantita', (request, response) => {
    var alimento = request.params.nome;

    try {
        var quantità = parseFloat(request.params.quantita) / 100;
        if (isNaN(quantità) || quantità <= 0) throw e;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var time = today.getHours() + "." + today.getMinutes();
        today = dd + '_' + mm + '_' + yyyy + ':' + time;

        database.collection("Food").findOne({ nome: alimento }, function (err, result) {
            if (err) throw err;
            if (result == null) {
                response.status(404);
                response.send("The food you are looking for is not available in the DB.");
            }
            else {
                result["energia"] = Math.round(result["energia"] * quantità * 1000) / 1000;
                result["grassi"] = Math.round(result["grassi"] * quantità * 1000) / 1000;
                result["carboidrati"] = Math.round(result["carboidrati"] * quantità * 1000) / 1000;
                result["proteine"] = Math.round(result["proteine"] * quantità * 1000) / 1000;
                result["fibre"] = Math.round(result["fibre"] * quantità * 1000) / 1000;
                result["ferro"] = Math.round(result["ferro"] * quantità * 1000) / 1000;
                result["iodio"] = Math.round(result["iodio"] * quantità * 1000) / 1000;
                result["magnesio"] = Math.round(result["magnesio"] * quantità * 1000) / 1000;
                result["data"] = today;
                result["quantita"] = parseFloat(request.params.quantita);
                response.send(result);
            }
        });
    } catch (e) {
        response.status(400);
        response.send("The quantity entered is invalid, either negative or not a number.");
    }

})

// Api per calorie assunte
/**
 * @swagger
 * /api/calorie_assunte:
 *   get:
 *     summary: Retrieve the daily energy intake [kcal].
 *     description: Retrieve the daily energy intake [kcal] from the Server.
 *     tags:
 *       - Utility APIs
 *     responses:
 *       200:
 *         description: The daily energy intake [kcal].
 *         schema:
 *           type: object
 *           properties:
 *             kcal:
 *                type: string
 *                description: The daily intake [kcal].
 *                example: 432
 */
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
/**
 * @swagger
 * /api/calorie_bruciate:
 *   get:
 *     summary: Retrieve the daily burnt kcal.
 *     description: Retrieve the daily burnt kcal from the Server.
 *     tags:
 *       - Utility APIs
 *     responses:
 *       200:
 *         description: The daily burnt kcal.
 *         schema:
 *           type: object
 *           properties:
 *             kcal:
 *                type: string
 *                description: The kcal burnt.
 *                example: 432
 */
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




/*
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

})*/

module.exports = app;