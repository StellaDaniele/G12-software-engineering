const fs = require('fs');
var test = require('tape');
var request = require('supertest');
var app = require('..');
const { response } = require('express');
const { execSync } = require('child_process');
//const { rejects } = require('assert');


test('TEST1: Informazioni allenatore', function (assert) {
    request(app)
        .get('/api/datiAllenatore')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (e, response) {
            var data = fs.readFileSync('../data/info_allenatore.json');
            var expectedTrainer = JSON.parse(data);

            assert.error(e, 'Nessun errore');
            assert.same(response.body, expectedTrainer, 'Informazioni allenatore recuperate correttamente');
            assert.end();
        });
});

test('TEST2: Aggiunta attività alla cronologia allenamenti', function (assert) {
    request(app)
        .post('/api/cronologia_allenamento')
        .send({
            "nome": "Trazioni",
            "tempo": 20,
            "energia_bruciata": 400.2
        })
        .expect(201)
        .end(function (err, response) {
            if (err) {
                reject(new Error("Un errore si è presenttato nell'esecuzione della API, errore: " + err));
            }
            assert.error(err, 'Nessun errore');
            assert.isEqual(response.text, "Attività aggiunta correttamente alla cronologia.", "Attività aggiunta correttamente");
            //assert.end();
        });
    request(app)
        .post('/api/cronologia_allenamento')
        .send({
            "nome": "Trazioni",
            "tempo": -20,
            "energia_bruciata": 400.2
        })
        .expect(400)
        .end(function (err, response) {
            if (err) {
                reject(new Error("Un errore si è presenttato nell'esecuzione della API, errore: " + err));
            }
            //assert.error(err, 'Nessun errore');
            assert.isEqual(response.text, "Il JSON inserito è malformato o il contenuto non soddisfa i requisiti richiesti. I requisiti sono i controlli sull'input, soprattutto per energia e tempo: non devono essere negativi, nulli, NaN, ecc.", "API robusta e protetta da JSON malformati e/o con contenuto incorretto");
            assert.end();
        });
});

test('TEST3: Attività eliminata correttamente dalla cronologia allenamenti', function (assert) {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);
    var nome = myObject[myObject.length - 1].nome;
    var data = myObject[myObject.length - 1].data;
    request(app)
        .del('/api/cronologia_allenamento/' + nome + '/' + data)
        .expect(200)
        .end(function (err, response) {
            if (err) {
                reject(new Error("Un errore si è presentato nell'esecuzione della API, errore: " + err));
            }
            else {
                assert.error(err, 'Nessun errore');
                assert.isEqual("Attività eliminata correttamente dalla cronologia.", response.text, "Attività eliminata correttamente")
                assert.end();
            }
        });
});

test('TEST4: Robustezza API eliminazione attività da cronologia allenamento', function (assert) {
    var data = fs.readFileSync('cronologia_allenamento.json');
    var myObject = JSON.parse(data);
    var nome = myObject[myObject.length - 1].nome;
    var data = myObject[myObject.length - 1].data;
    request(app)
        .del('/api/cronologia_allenamento/nome/00_00_0000:0')
        .expect(400)
        .end(function (err, response) {
            if (err) {
                reject(new Error("Un errore si è presentato nell'esecuzione della API, errore: " + err));
            }
            else {
                assert.error(err, 'Nessun errore');
                assert.isEqual("La data inserita non soddisfa i requisiti richiesti.", response.text, "API robusta e protetta da date che non rispettano il formato specificato")
                //assert.end();
            }
        });
    request(app)
        .del('/api/cronologia_allenamento/idk/00_00_0000:00.00')
        .expect(304)
        .end(function (err, response) {
            if (err) {
                reject(new Error("Un errore si è presentato nell'esecuzione della API, errore: " + err));
            }
            else {
                //assert.error(err, 'Nessun errore');
                assert.isEqual("", response.text, "La API non genera errori in caso si cerchi di eliminare attività non presenti nella cronologia")
                assert.end();
            }
        });
});

