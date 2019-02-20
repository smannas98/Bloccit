const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000';
const test = '/marco';

describe('routes : static', () => {
    describe('GET /', () => {
        it('should return status code 200', (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        it('should return status code 200 and string saying "polo"', (done) => {
            request.get(test, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toBe('polo');
                done();
            });
        });
    });
});