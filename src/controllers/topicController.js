const topicQueries = require("../db/queries.topics.js");
const Authorizer = require("../policies/topic");

const errorHandler = (res) => {
  res.redirect(500, "static/index");
};

module.exports = {
    index(req, res, next) {
        topicQueries.getAllTopics(
          (topics) => {
                res.render("topics/index", { topics });
          },
          () => errorHandler(res),
        );
    },
    new(req, res, next) {
      const authorized = new Authorizer(req.user).new();
      if (authorized) {
        res.render("topics/new");
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/topics");
      }
    },
    create(req, res, next) {
      const authorized = new Authorizer(req.user).create();
      console.log("DEBUG: topicController#create - Authorized?" + authorized);
      if (authorized) {
          let newTopic = {
              title: req.body.title,
              description: req.body.description,
          };
          topicQueries.addTopic(newTopic, (err, topic) => {
              if (err) {
                  res.redirect(500, "/topics/new");
              } else {
                  res.redirect(303, `/topics/${topic.id}`);
              }
          });
      } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/topics");
      }
    },
    show(req, res, next) {
        topicQueries.getTopic(req.params.id, (err, topic) => {
            if (err || topic == null) {
                res.redirect(404, "/");
            } else {
                res.render("topics/show", { topic });
            }
        });
    },
    destroy(req, res, next) {
      topicQueries.deleteTopic(req, (err, topic) => {
        if (err) {
          res.redirect(err, `/topics/${req.params.id}`);
        } else {
          res.redirect(303, "/topics");
        }
      });
    },
    edit(req, res, next) {
        topicQueries.getTopic(req.params.id, (err, topic) => {
          if (err || topic == null) {
            if (err) {
              console.log("DEBUG: topicController#edit - ERROR:");
              console.log(err);
              console.log("---------\n\n");
              res.redirect(404, "/");
            } else {
              console.log("DEBUG: topicController#edit - TOPIC is NULL");
              console.log("\n\n");
              res.redirect(404, "/");
              end;
            }
          } else {
            const authorized = new Authorizer(req.user, topic).edit();
            if (authorized) {
              res.render("topics/edit", { topic });
            } else {
              req.flash("You are not authorized to do that.");
              res.redirect(`/topics/${req.params.id}`);
            }
          }
        });
    },
    update(req, res, next) {
        topicQueries.updateTopic(req, req.body, (err, topic) => {
            if (err || topic == null) {
                res.redirect(404, `/topics/${req.params.id}/edit`);
            } else {
                res.redirect(`/topics/${topic.id}`);
            }
        });
    },
};
