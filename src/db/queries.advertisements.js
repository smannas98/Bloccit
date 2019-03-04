const Advertisements = require("./models").Advertisements;

module.exports = {
    getAllAds(callback) {
        return Advertisements.all().then((advertisements) => {
            callback(null, advertisements);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addAdvertisement(newAd, callback) {
        return Advertisements.create({
            title: newAd.title,
            description: newAd.description
        })
        .then((advertisement) => {
            callback(null, advertisement);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getAd(id, callback) {
        return Advertisements.findById(id).then((advertisement) => {
            callback(null, advertisement);
        }) 
        .catch((err) => {
            callback(err);
        })
    },
    deleteAd(id, callback) {
        return Advertisements.destroy({
            where: {id}
        })
        .then((advertisement) => {
            callback(null, advertisement);
        })
        .catch((err) => {
            callback(err);
        })
    },
    updateAd(id, updatedAd, callback) {
        return Advertisements.findById(id).then((advertisement) => {
            if(!advertisement) {
                return callback("Advertisement not found");
            }
            Advertisements.update(updatedAd, {
                fields: Object.keys(updatedAd)
            })
            .then(() => {
                callback(null, advertisement);
            })
            .catch((err) => {
                callback(err);
            });
        });
    }
}