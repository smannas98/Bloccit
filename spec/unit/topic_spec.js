const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Topic", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;
    sequelize.sync({ force: true }).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "password",
      })
      .then((user) => {
        this.user = user;
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent vists to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id,
          }],
        }, {
          include: {
            model: Post,
            as: "posts",
          },
        })
        .then((topic) => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });
  describe("#create", () => {
    it("should create a Topic", (done) => {
      this.topic;
      Topic.create({
        title: "this is a topic",
        description: "this is the description",
      })
      .then((topic) => {
        this.topic = topic;
        expect(topic.title).toBe("this is a topic");
        expect(topic.description).toBe("this is the description");
        done();
      });
    });
  });
  describe("#getPosts", () => {
    it("should get a post associated with the topic", (done) => {
      Post.create({
        title: "this is a post",
        body: "this is the body of the post",
        topicId: this.topic.id,
      })
      .then((post) => {
        this.post = post;
        this.topic.getPosts(post).then((associatedPost) => {
          expect(associatedPost.title).toBe("this is a post");
          expect(associatedPost.body).toBe("this is the body of the post");
          expect(associatedPost.topicId).toBe(this.topic.id);
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
