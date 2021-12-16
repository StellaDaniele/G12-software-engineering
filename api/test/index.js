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
    request(app)
        .del('/api/cronologia_allenamento/Trazioni/16_12_2021:14.23')
        .expect(200)
        .end(function (err,response){
            if(err){
                reject(new Error('An error occured with the activity deleting API, err: ' + err));
            }
            else{
                assert.error(err, 'No error');
                assert.isEqual("Deleted Successfully", res.text, "Activity deleted correctly")
                assert.end();
            }
        });
});