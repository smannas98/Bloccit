const postQueries = require("../db/queries.posts.js");
const Authorizer = require('../policies/post');

module.exports = {
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("posts/new", { topicId: req.params.topicId });
    } else {
      req.flash("notice", "you are not authorized to do that.");
      res.redirect(`/topics/${req.params.topicId}`);
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if (authorized) {
      let newPost = {
        title: req.body.title,
        body: req.body.body,
        topicId: req.params.topicId,
        userId: req.user.id,
      };
      postQueries.addPost(newPost, (err, post) => {
        if (err) {
          res.redirect("/posts/new");
        } else {
          res.redirect(`/topics/${newPost.topicId}/posts/${post.id}`);
        }
      });
    } else {
      req.flash("notice", "you are not authorized to do that");
      res.redirect(`/topics/${req.params.TopicId}`);
    }
  },
  show(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect("/");
      } else {
        res.render("posts/show", { post });
      }
    });
  },
  destroy(req, res, next) {
    postQueries.deletePost(req, (err, post) => {
      if (err) {
        res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
      } else {
        res.redirect(`/topics/${req.params.topicId}`);
      }
    });
  },
  edit(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        console.log('DEBUG: postController.edit -> error on first if statement');
        console.log("\n------------------\n\n");
        console.log(err);
        console.log("\n------------------\n\n");
        res.redirect('/');
      } else {
        const authorized = new Authorizer(req.user).edit();
        console.log("DEBUG: postController.edit -> user id = " + req.user.id);
        console.log("DEBUG: postController.edit -> post userId = " + req.params.userId);
        console.log('DEBUG: postController.edit -> fetch Authorizer');
        if (authorized) {
          console.log('DEBUG: postController.edit -> user authorized');
          res.render('posts/edit', { post });
        } else {
          console.log('DEBUG: postController.edit -> not authorized');
          req.flash("you are not authorized to do that");
          res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
        }
      }
    });
  },
  update(req, res, next) {
    postQueries.updatePost(req, req.body, (err, post) => {
      if (err || post == null) {
        res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
      }
    });
  },
};
