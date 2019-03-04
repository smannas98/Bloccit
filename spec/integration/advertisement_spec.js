const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisements = require("../../src/db/models").Advertisements;

describe("routes : advertisements", () => {
    beforeEach((done) => {
        this.advertisement;
        sequelize.sync({force: true}).then((res) => {
            Advertisements.create({
                title: "Best Ads of 2019",
                description: "There is a lot of them"
            })
            .then((advertisement) => {
                this.advertisement = advertisement;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
    describe("GET /advertisements", () => {
        it("should return status code 200 and all advertisements", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Advertisements");
                expect(body).toContain("Best Ads of 2019")
                done();
            })
        })
    })
    describe("GET /advertisements/new", () => {
        it("should render a new advertisement form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Advertisement");
                done();
            });
        });
    });
    describe("POST /advertisements/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "Best Ads of 2019",
                description: "There is a lot of them"
            }
        };
        it("should create a new advertisement and redirect", (done) => {
            request.post(options, (err, res, body) => {
                Advertisements.findOne({where: {title: "Best Ads of 2019"}}).then((advertisement) => {
                    expect(res.statusCode).toBe(303);
                    expect(advertisement.title).toBe("Best Ads of 2019");
                    expect(advertisement.description).toBe("There is a lot of them");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });
    describe("GET /advertisements/:id", () => {
        it("should render a view with the selected ad", (done) => {
            request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Best Ads of 2019");
                done();
            });
        });
    });
    describe("POST /advertisements/:id/destroy", () => {
        it("should delete the topic with the associated ID", (done) => {
            Advertisements.all().then((advertisements) => {
                const adCountBeforeDelete = advertisements.length;
                expect(adCountBeforeDelete).toBe(1);
                request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
                    Advertisements.all().then((advertisements) => {
                        expect(err).toBeNull();
                        expect(advertisements.length).toBe(adCountBeforeDelete - 1);
                        done();
                    })
                });
            });
        });
    });
    describe("GET /advertisements/:id/edit", () => {
        it("should render a view with an edit topic form", (done) => {
            request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Ad");
                expect(body).toContain("Advertisement");
                done();
            });
        });
    });
   describe("POST /advertisements/:id/update", () => {
        it("should update the ad with the given values", (done) => {
            const options = {
                url: `${base}${this.advertisement.id}/update`,
                form: {
                    title: "Best Ads of 2018",
                    description: "Check out last year's most popular Ads"
                }
            };
            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                Advertisements.findOne({
                    where: { id: this.advertisement.id}
                })
                .then((advertisement) => {
                    expect(advertisement.title).toBe("Best Ads of 2018");
                    done();
                });
            });
        });
    });
});