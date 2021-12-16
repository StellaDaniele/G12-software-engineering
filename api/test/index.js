const fs = require('fs');
var test = require('tape');
var request = require('supertest');
var app = require('..');
const { response } = require('express');
//const { rejects } = require('assert');


test('TEST1: Correct trainer returned', function (assert) {
    request(app)
        .get('/api/datiAllenatore')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (e, response) {
            var data = fs.readFileSync('../data/info_allenatore.json');
            var expectedTrainer = JSON.parse(data);
          
            assert.error(e, 'No error');
            assert.same(response.body, expectedTrainer, 'Trainer retrieved correctly');
            assert.end();
        });
});

test('TEST2: Correct activity added', function (assert) {
    request(app)
        .post('/api/cronologia_allenamento')
        .send({
            "nome": "Trazioni",
            "tempo": 20,
            "energia_bruciata": 400.2
        })
        .expect(201)
        .end(function (err, response) {
            if (err){
               reject(new Error('An error occured with the acitity adding API, err: ' + err));
            }
            assert.error(err, 'No error');
            assert.isEqual(response.text, "Attività aggiunta correttamente alla cronologia.", "Activity added correctly");
            assert.end();
        });
});

test('TEST3: Activity deleted correcytly',function(assert){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var time = today.getHours() + "." + today.getMinutes();
    today = dd + '_' + mm + '_' + yyyy + ':' + time;
    request(app)
        .del('/api/cronologia_allenamento/Trazioni/'+today)
        .expect(200)
        .end(function (err,response){
            if(err){
                //reject(new Error('An error occured with the activity deleting API, err: ' + err));
            }
            else{
                assert.error(err, 'No error');
                assert.isEqual("Deleted Successfully", response.body, "Activity deleted correctly")
                assert.end();
            }
        });
});