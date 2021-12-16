const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// MongoDB
const mongodb = require('mongodb').MongoClient;
const { type } = require('os');
const DATABASE = "Food";
let database;

///////// The CONNECTION_STIRNG is given in the document, the password will be changed as soon as the results will be published.
const CONNECTION_STRING = "mongodb+srv://G12:1aRI17qvJk67R@g12-nutritionfacts.sxr24.mongodb.net/test";

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
            title: 'Documentazione API sviluppate SmartFit gruppo G12',
            version: '1.0.0',
            description:
                "Questa è un'applicazione REST API sviluppata con Express.",
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Groupo G12',
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


//////////////// GET APIs

// [DONE] Api per JSON dati allenatore
/**
 * @swagger
 * /api/datiAllenatore:
 *   get:
 *     summary: Recupera le informazioni riguardanti l'allenatore.
 *     description: Recupera le informazioni riguardanti l'allenatore dal server, in formato JSON.
 *     tags:
 *       - GET APIs
 *     responses:
 *       200:
 *         description: Le informazioni dell'allenatore.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                    type: string
 *                    description: Il nome dell'allenatore.
 *                    example: Marco
 *                 cognome:
 *                    type: string
 *                    description: Il cognome dell'allenatore.
 *                    example: Matteazzi
 *                 eta:
 *                    type: integer
 *                    description: L'età dell'allenatore.
 *                    example: 36
 *                 certificazione:
 *                    type: string
 *                    description: La certificazione dell'allenatore.
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
 *     summary: Recupera la cronologia della dieta dell'utente.
 *     description: Recupera la cronologia delle consumazioni, ovvero la lista dei pasti assunti dall'utente, dal server.
 *     tags:
 *       - GET APIs
 *     responses:
 *       200:
 *         description: Una lista di pietanze. L'energia fornita è in kcal, i macro-nutrienti sono in grammi (standard) e i micro-nutrienti sono in milligrammi (standard).
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
 *                         description: Il nome della pietanza.
 *                         example: Banana
 *                       energia:
 *                         type: number
 *                         format: float
 *                         description: L'energia assunta con la consumazione della pietanza [kcal].
 *                         example: 78.072
 *                       grassi:
 *                         type: number
 *                         format: float
 *                         description: I grassi contenuti.
 *                         example: 0.13
 *                       carboidrati:
 *                         type: number
 *                         format: float
 *                         description: I carboidrati contenuti.
 *                         example: 26.024
 *                       proteine:
 *                         type: number
 *                         format: float
 *                         description: Le proteine contenute.
 *                         example: 1.04
 *                       fibre:
 *                         type: number
 *                         format: float
 *                         description: Le fibre contenute.
 *                         example: 13.012
 *                       ferro:
 *                         type: number
 *                         format: float
 *                         description: Il ferro contenuto.
 *                         example: 1.17
 *                       iodio:
 *                         type: number
 *                         format: float
 *                         description: Lo iodio contenuto.
 *                         example: 0.013
 *                       magnesio:
 *                         type: number
 *                         format: float
 *                         description: Il magnesio contenuto.
 *                         example: 1.171
 *                       data:
 *                          type: string
 *                          description: La data di consumazione.
 *                          example: 12_12_2021:21.43
 *                       quantita:
 *                          type: number
 *                          format: float
 *                          description: La quantità consumata.
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
 *     summary: Recupera la cronologia dell'allenamento dell'utente.
 *     description: Recupera la cronologia dell'allenamento, ovvero la lista di attività svolte dall'utente, dal server.
 *     tags:
 *       - GET APIs
 *     responses:
 *       200:
 *         description: Una lista di attività. L'energia bruciata è espressa in kcal, il tempo in minuti.
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
 *                         description: Il nome dell'attività.
 *                         example: Salti
 *                       tempo:
 *                         type: integer
 *                         description: La durata dell'attività svolta.
 *                         example: 85
 *                       energia_bruciata:
 *                         type: number
 *                         format: float
 *                         description: L'energia bruciata [kcal].
 *                         example: 654.1
 *                       data:
 *                          type: string
 *                          description: La data di svolgimento.
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
 *     summary: Recupera il riepilogo giornaliero dell'allenamento dell'utente.
 *     description: Recupera una lista di attività, che sono quelle svolte nella giornata corrente dall'utente, dal server.
 *     tags:
 *       - GET APIs
 *     responses:
 *       200:
 *         description: Una lista di attività. L'energia bruciata è espressa in kcal, il tempo in minuti.
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
 *                         description: Il nome dell'attività.
 *                         example: Salti
 *                       tempo:
 *                         type: integer
 *                         description: La durata dell'attività svolta.
 *                         example: 85
 *                       energia_bruciata:
 *                         type: number
 *                         format: float
 *                         description: L'energia bruciata [kcal].
 *                         example: 654.1
 *                       data:
 *                          type: string
 *                          description: La data di svolgimento.
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
 *     summary: Recupera il riepilogo giornaliero della dieta dell'utente.
 *     description: Recupera una lista di pietanze, che sono quelle consumate dall'utente nella giornata corrente, dal server.
 *     tags:
 *       - GET APIs
 *     responses:
 *       200:
 *         description: Una lista di pietanze. L'energia fornita è in kcal, i macro-nutrienti sono in grammi (standard) e i micro-nutrienti sono in milligrammi (standard).
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
 *                         description: Il nome della pietanza.
 *                         example: Banana
 *                       energia:
 *                         type: number
 *                         format: float
 *                         description: L'energia assunta con la consumazione della pietanza [kcal].
 *                         example: 78.072
 *                       grassi:
 *                         type: number
 *                         format: float
 *                         description: I grassi contenuti.
 *                         example: 0.13
 *                       carboidrati:
 *                         type: number
 *                         format: float
 *                         description: I carboidrati contenuti.
 *                         example: 26.024
 *                       proteine:
 *                         type: number
 *                         format: float
 *                         description: Le proteine contenute.
 *                         example: 1.04
 *                       fibre:
 *                         type: number
 *                         format: float
 *                         description: Le fibre contenute.
 *                         example: 13.012
 *                       ferro:
 *                         type: number
 *                         format: float
 *                         description: Il ferro contenuto.
 *                         example: 1.17
 *                       iodio:
 *                         type: number
 *                         format: float
 *                         description: Lo iodio contenuto.
 *                         example: 0.013
 *                       magnesio:
 *                         type: number
 *                         format: float
 *                         description: Il magnesio contenuto.
 *                         example: 1.171
 *                       data:
 *                          type: string
 *                          description: La data di consumazione.
 *                          example: 12_12_2021:21.43
 *                       quantita:
 *                          type: number
 *                          format: float
 *                          description: La quantità consumata.
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
 * /api/cronologia_alimentazione/{nome}/{quantità}:
 *   post:
 *     summary: Inserisce la pietanza fornita nella cronologia della dieta dell'utente.
 *     description: Inserisce la pietanza fornita nella cronologia della dieta dell'utente, dopo aver chiamato un'altra API che si occupa di contattare un server esterno per calcolare, in base alla quantità consumata, i valori nutritivi assunti.  Non viene richiesto di inserire la data di svolgimento perché prende in automatico dal sistema.
 *     tags:
 *       - POST APIs
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *             type: string
 *             example: Pera
 *         required: true
 *         description: Il nome della piatanza.
 *       - in: path
 *         name: quantità
 *         schema:
 *             type: number
 *             format: float
 *             example: 180.5
 *         required: true
 *         description: La quantità consumata [g].
 *     responses:
 *       201:
 *         description: Conferma dell'inserimento della pietanza fornita dall'utente nella cronologia.
 *       400:   
 *         description: "Bad request: la quantità inserita non era un numero oppure era negativa o nulla."
 *       404:   
 *         description: La pietanza ricercata non è presente nel database.
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
            response.status(201);
            response.send("Consumazione aggiunta correttamente alla cronologia.");
        }
    }
})


// Api per inserimento nel JSON cronologia_allenamento
/**
 * @swagger
 * /api/cronologia_allenamento:
 *   post:
 *     summary: Inserisce l'attività fornita nella cronologia dell'allenamento dell'utente.
 *     description: Inserisce l'attività fornita nella cronologia dell'allenamento dell'utente. È stato deciso di richiedere un JSON in questa API POST al posto di parametri in ingresso perché si è assunto che fosse più facile poi da gestire utilizzandola con dispositivi smart come era descritto nelle specifiche del progetto. Non viene richiesto di inserire la data di svolgimento perché prende in automatico dal sistema.
 *     tags:
 *       - POST APIs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Il nome dell'attività.
 *                 example: Salti
 *               tempo:
 *                 type: integer
 *                 description: La durata dell'attività svolta.
 *                 example: 85
 *               energia_bruciata:
 *                 type: number
 *                 format: float
 *                 description: L'energia bruciata [kcal].
 *                 example: 654.1
 *     responses:
 *       201:
 *         description: Conferma inserimento dell'attività fornita dall'utente nella cronologia.
 *       400:   
 *         description: "Il JSON inserito è malformato o il contenuto non soddisfa i requisiti richiesti. I requisiti sono i controlli sull'input, soprattutto per energia e tempo: non devono essere negativi, nulli, NaN, ecc."
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
        response.status(201);
        response.send("Attività aggiunta correttamente alla cronologia.");
    } catch (e) {
        response.status(400);
        response.send("Il JSON inserito è malformato o il contenuto non soddisfa i requisiti richiesti. I requisiti sono i controlli sull'input, soprattutto per energia e tempo: non devono essere negativi, nulli, NaN, ecc.");
    }
})




//////////////// DELETE APIs
// [DONE] Api per eliminazione da cronologia_alimentazione
/**
 * @swagger
 * /api/cronologia_alimentazione/{nome}/{data}:
 *   delete:
 *     summary: Elimina la consumazione fornita dalla cronologia della dieta dell'utente.
 *     description: Elimina la consumazione fornita dalla cronologia della dieta dell'utente. La data deve essere del formato [dd_mm_yyyy:hh.mm]. Si faccia attenzione che l'orario è in formato 24h e che per ore e minuti non ci va lo zero davanti quando minori di dieci, ad esempio 09.03 va scritto 9.3.
 *     tags:
 *       - DELETE APIs
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *             type: string
 *             example: Mela
 *         required: true
 *         description: Il nome della pietanza.
 *       - in: path
 *         name: data
 *         schema:
 *             type: string
 *             example: 12_12_2021:12.19
 *         required: true
 *         description: La data di consumazione dd_mm_yyyy:hh.mm .
 *     responses:
 *       200:
 *         description: Conferma eliminazione della consumazione fornita dall'utente dalla cronologia.
 *       304:
 *         description: Nessuna eliminazione effettuata, la consumazione cercata non è stata trovata nella cronologia.
 *       400:
 *         description: I dati forniti non rispettano i requisiti. Si controlli che la data inserita soddisfi i requisiti richiesti (formato sopracitato).
 */
app.delete('/api/cronologia_alimentazione/:nome/:data', (request, response) => {
    var data = fs.readFileSync('cronologia_alimentazione.json');
    var myObject = JSON.parse(data);

    if (request.params.data.length < 14) {
        response.status(400);
        response.send("La data inserita non soddisfa i requisiti richiesti.");
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
            response.send("Non è stata apportata alcuna modifica, la consumazione che si vuole eliminare non è presente nella cronologia.");
        }
        else {
            //memorizzo il nuovo JSON dopo la cancellazione
            var newData = JSON.stringify(myObject);
            fs.writeFile('cronologia_alimentazione.json', newData, err => {
                // error checking
                if (err) throw err;
            });
            response.status(200);
            response.send("Consumazione eliminata correttamente dalla cronologia.");
        }
    }
})

// [DONE] Api per eliminazione da cronologia_allenamento
/**
 * @swagger
 * /api/cronologia_allenamento/{nome}/{data}:
 *   delete:
 *     summary: Elimina l'attività fornita dalla cronologia dell'allenamento dell'utente.
 *     description: Elimina l'attività fornita dalla cronologia dell'allenamento dell'utente. La data deve essere del formato [dd_mm_yyyy:hh.mm]. Si faccia attenzione che l'orario è in formato 24h e che per ore e minuti non ci va lo zero davanti quando minori di dieci, ad esempio 09.03 va scritto 9.3.
 *     tags:
 *       - DELETE APIs
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *             type: string
 *             example: Corsa
 *         required: true
 *         description: Il nome dell'attività.
 *       - in: path
 *         name: data
 *         schema:
 *             type: string
 *             example: 13_12_2021:19.6
 *         required: true
 *         description: La data di svolgimento dd_mm_yyyy:hh.mm .
 *     responses:
 *       200:
 *         description: Conferma eliminazione dell'attività fornita dall'utente dalla cronologia.
 *       304:
 *         description: Nessuna eliminazione effettuata, l'attività cercata non è stata trovata nella cronologia.
 *       400:
 *         description: I dati forniti non rispettano i requisiti. Si controlli che la data inserita soddisfi i requisiti richiesti (formato sopracitato).
 */
app.delete('/api/cronologia_allenamento/:nome/:data', (request, response) => {
    if (request.params.data.length < 14) {
        response.status(400);
        response.send("La data inserita non soddisfa i requisiti richiesti.");
    }
    else {
        var data = fs.readFileSync('cronologia_allenamento.json');
        var myObject = JSON.parse(data);
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
            response.send("Non è stata apportata alcuna modifica, l'attività che si vuole eliminare non è presente nella cronologia.");
        }
        else {
            //memorizzo il nuovo JSON dopo la cancellazione
            var newData = JSON.stringify(myObject);
            fs.writeFile('cronologia_allenamento.json', newData, err => {
                // error checking
                if (err) throw err;
            });
            response.status(200);
            response.send("Attività eliminata correttamente dalla cronologia.");
        }
    }
})



//////////////// UTILITY GET APIs

// [DONE] Api per ricerca nel DB di un alimento
/**
 * @swagger
 * /api/valori_nutrizionali/{nome}/{quantità}:
 *   get:
 *     summary: Recupera le informazioni nutrizionali di un alimento fornito.
 *     description: Recupera le informazioni nutrizionali di un alimento fornito contattando un server esterno. Riscala i valori in base alla quantità consumata dall'utente.
 *     tags:
 *       - Utility APIs
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *             type: string
 *             example: Banana
 *         required: true
 *         description: Il nome della pietanza.
 *       - in: path
 *         name: quantità
 *         schema:
 *             type: number
 *             format: float
 *             example: 130.12
 *         required: true
 *         description: La quantità consumata.
 *     responses:
 *       200:
 *         description: Le informazioni nutrizionali della pietanza inserita, in base alla quantità consumata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                   description: Il nome della pietanza.
 *                   example: Banana
 *                 energia:
 *                   type: number
 *                   format: float
 *                   description: L'energia assunta con la consumazione della pietanza [kcal].
 *                   example: 78.072
 *                 grassi:
 *                   type: number
 *                   format: float
 *                   description: I grassi contenuti.
 *                   example: 0.13
 *                 carboidrati:
 *                   type: number
 *                   format: float
 *                   description: I carboidrati contenuti.
 *                   example: 26.024
 *                 proteine:
 *                   type: number
 *                   format: float
 *                   description: Le proteine contenute.
 *                   example: 1.04
 *                 fibre:
 *                   type: number
 *                   format: float
 *                   description: Le fibre contenute.
 *                   example: 13.012
 *                 ferro:
 *                   type: number
 *                   format: float
 *                   description: Il ferro contenuto.
 *                   example: 1.17
 *                 iodio:
 *                   type: number
 *                   format: float
 *                   description: Lo iodio contenuto.
 *                   example: 0.013
 *                 magnesio:
 *                   type: number
 *                   format: float
 *                   description: Il magnesio contenuto.
 *                   example: 1.171
 *                 data:
 *                   type: string
 *                   description: La data di consumazione.
 *                   example: 12_12_2021:21.43
 *                 quantita:
 *                   type: number
 *                   format: float
 *                   description: La quantità consumata.
 *                   example: 130.12
 *       400:   
 *         description: "Bad request: la quantità inserita non era un numero oppure era negativa o nulla."
 *       404:   
 *         description: La pietanza ricercata non è presente nel database.
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
                response.send("La pietanza ricercata non è presente nel database.");
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
        response.send("La quantità inserita non è valida, potrebbe essere negativa, nulla, o non essere un numero.");
    }

})

// Api per calorie assunte
/**
 * @swagger
 * /api/calorie_assunte:
 *   get:
 *     summary: Restituisce l'assunzione energetica giornaliera da parte dell'utente in kcal.
 *     description: Restituisce l'assunzione energetica giornaliera da parte dell'utente in kcal.
 *     tags:
 *       - Utility APIs
 *     responses:
 *       200:
 *         description: L'assunzione energetica [kcal].
 *         content:
 *           schema:
 *             type: number
 *             format: float
 *             description: Energia assunta [kcal].
 *             example: 780.6
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
 *     summary: Restituisce l'energia bruciata dall'utente nella giornata corrente in kcal.
 *     description: Restituisce l'energia bruciata dall'utente nella giornata corrente in kcal.
 *     tags:
 *       - Utility APIs
 *     responses:
 *       200:
 *         description: Viene restituito il numero di kcal bruciate.
 *         content:
 *           schema:
 *             type: number
 *             format: float
 *             description: Energia bruciata [kcal].
 *             example: 350.1
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





app.listen(5000, () => {
    console.log("Running on localhost:5000/");
    console.log("APIs Documentation on localhost:5000/api-docs");
    mongodb.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log("An error has occurred trying to connect to the DB: " + error);
        }
        else {
            database = client.db(DATABASE);
            console.log("DB Connected successfully.");
        }
    })

})

module.exports = app;