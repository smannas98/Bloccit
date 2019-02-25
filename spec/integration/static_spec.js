const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000';
const test = '/marco';
const about = 'http://localhost:3000/about';

describe('routes : static', () => {
    describe('GET /', () => {
        it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response ", () => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toContain('Welcome to Bloccit');
            });
        });

       // it('should return status code 200 and string saying "polo"', (done) => {
        //    request.get(test, (err, res, body) => {
        //        expect(res.statusCode).toBe(200);
        //        expect(body).toBe('polo');
       //         done();
       //     });
       // });

        it("should return status code 200 and string saying 'About Us.'", (done) => {
            request.get(about, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toContain('About Us.');
                done();
            })
        })
    });
});