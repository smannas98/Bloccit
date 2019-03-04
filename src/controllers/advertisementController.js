const advertisementQueries = require("../db/queries.advertisements.js");

module.exports = {
    index(req, res, next) {
        advertisementQueries.getAllAds((err, advertisements) => {
            if(err) {
                res.redirect(500, "/static/index");
            } else {
                res.render("ads/index", {advertisements});
            }
        })
    },
    new(req, res, next) {
        res.render("ads/new");
    },
    create(req, res, next) {
        let newAd = {
            title: req.body.title,
            description: req.body.description
        };
        advertisementQueries.addAdvertisement(newAd, (err, advertisement) => {
            if(err) {
                res.redirect(500, "/advertisements/new");
            } else {
                res.redirect(303, `/advertisements/${advertisement.id}`);
            }
        });
    },
    show(req, res, next) {
        advertisementQueries.getAd(req.params.id, (err, advertisement) => {
            if(err || advertisement == null) {
                res.redirect(404, "/");
            } else {
                res.render("ads/show", {advertisement});
            }
        });
    },
    destroy(req, res, next) {
        advertisementQueries.deleteAd(req.params.id, (err, advertisement) => {
            if(err) {
                res.redirect(500, `/advertisements/${advertisement.id}`);
            } else {
                res.redirect(303, "/advertisements");
            }
        });
    },
    edit(req, res, next) {
        advertisementQueries.getAd(req.params.id, (err, advertisement) => {
            if(err || advertisement == null) {
                res.redirect(404, "/");
            } else {
                res.render("ads/edit", {advertisement});
            }
        })
    },
    update(req, res, next) {
        advertisementQueries.updateAd(req.params.id, (err, advertisement) => {
            if(err || advertisement == null) {
                res.redirect(404, `/advertisements/${req.params.id}/edit`);
            } else {
                res.redirect(`advertisements/${advertisement.id}`);
            }
        });
    }

}