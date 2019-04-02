const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Authorizer = require("../policies/post");

module.exports = {
  addPost(newPost, callback) {
    return Post.create(newPost).then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getPost(id, callback) {
    return Post.findById(id).then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    });
  },
  deletePost(req, callback) {
    return Post.findById(req.params.id).then((post) => {
      const authorized = new Authorizer(req.user, post).destroy();
      if (authorized) {
        post.destroy().then((res) => {
          callback(null, post);
        });
      } else {
        req.flash("notice", "you are not authorized to do that");
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
  updatePost(req, updatedPost, callback) {
    return Post.findById(req.params.id).then((post) => {
      if (!post) {
        return callback("Post not found");
      }
      const authorized = new Authorizer(req.user, post).update();
      if (authorized) {
        console.log("DEBUG: postController.update -> user is authorized");
        post.update(updatedPost, {
          fields: Object.keys(updatedPost),
        })
        .then(() => {
          callback(null, post);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        console.log("DEBUG: postController.update -> user is not authorized");
        req.flash("notice", "you are not authorized to do that");
        callback("forbidden");
      }
    });
  },
};
