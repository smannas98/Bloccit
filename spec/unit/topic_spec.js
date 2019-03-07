const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({ force: true }).then((res) => {
      Topic.create({
        title: "main topic",
        description: "this is the main topic",
      })
      .then((topic) => {
        this.topic = topic;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
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
