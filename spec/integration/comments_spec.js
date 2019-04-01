// #1
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

  beforeEach((done) => {

// #2
    this.user;
    this.topic;
    this.post;
    this.comment;

    sequelize.sync({ force: true }).then((res) => {

// #3
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
      })
      .then((user) => {
        this.user = user;  // store user

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id,
          }],
        }, {
          include: {                        //nested creation of posts
            model: Post,
            as: "posts",
          },
        })
        .then((topic) => {
          this.topic = topic;                 // store topic
          this.post = this.topic.posts[0];  // store post

          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            postId: this.post.id,
          })
          .then((coment) => {
            this.comment = coment;             // store comment
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  //test suites will go there
  describe("guest attempting to perform CRUD actions for a Comment", () => {
    beforeEach((done) => {                      //before each suite in this context
      request.get({                             //mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0 //flag to indicate mock auth to destroy any session
        },
      },
        (err, res, body) => {
          done();
        },
      );
    });
  });

});
