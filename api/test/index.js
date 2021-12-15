const fs = require('fs');
var test = require('tape');
var request = require('supertest');
var app = require('..');


test('Correct trainer returned', function (assert) {
    request(app)
        .get('/api/datiAllenatore')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (e, response) {
            var data = fs.readFileSync('../data/info_allenatore.json');
            var expectedTrainer = JSON.parse(data);
          
            assert.error(e, 'No error');
            assert.same(response.body, expectedTrainer, 'Trainer as expected');
            assert.end();
        });
});