const request = require('request');
const server = require('../../src/server');
const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;

const base = 'http://localhost:3000/topics';

describe('routes : posts', () => {
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
          title: "Winter Games",
          description: "Post your Winter Games stories.",
          posts: [{
            title: "Snowball fighting",
            body: "So much snow!",
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
  describe('Guest user should only be able to view the posts', () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "guest",
        },
      },
        (err, res, body) => {
          done();
        },
      );
    });
    describe('GET /topics/:topicId/posts/new', () => {
      xit('should redirect to post view', (done) => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          //console.log(body);
          expect(err).toBeNull();
          expect(body).not.toContain('New Post');
          expect(body).toContain('Snowball fighting');
          done();
        });
      });
    });
    describe('POST /topics/:topicId/posts/create', () => {
      xit('should not create a new post and redirect', (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: 'Watching snow melt',
            body: 'without a doubt my favorite things to do besides watching paint dry!',
          },
        };
        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: 'Watching snow melt' } })
          .then((post) => {
            expect(post).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
    describe('GET /topics/:topicId/posts/:id', () => {
      xit('should render a view with the selected post', (done) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('Snowball fighting');
          done();
        });
      });
    });
    describe('POST /topics/:topicId/posts/:id/destroy', () => {
      xit('should not delete the post with the associated ID', (done) => {
        expect(this.post.id).toBe(1);
        request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
          console.log(`body`, body);
          Post.findById(1).then((post) => {
            expect(err).toBeNull();
            expect(body).toContain('Found. Redirecting to /topics/1/posts/1');
            done();
          });
        });
      });
    });
    describe('GET /topics/:topicId/posts/:id/edit', () => {
      xit('should redirect to post view', (done) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Post");
          expect(body).toContain("Snowball fighting");
          done();
        });
      });
    });
    describe('POST /topics/:topicId/posts/:id/update', () => {
      xit('should not update the post with the given values', (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Snowman Building Competition",
            body: "I love watching them melt slowly.",
          },
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Post.findOne({
            where: { id: this.post.id },
          })
          .then((post) => {
            expect(post.title).toBe("Snowball fighting");
            done();
          });
        });
      });
    });
  });
  describe('Member user should be able to perform all CRUD ops on posts they own', () => {
    beforeEach((done) => {
      User.create({
        email: "member@example.com",
        password: "1234567",
        role: "member",
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email,
          },
        },
          (err, res, body) => {
            done();
          },
        );
      });
    });
    describe('GET /topics/:topicId/posts/new', () => {
      it('should render a new post form', (done) => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('New Post');
          done();
        });
      });
    });
    describe('POST /topics/:topicId/posts/create', () => {
      it("should not create a new post that fails validations", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "a",
            body: "b",
          }
        };
        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "a" }})
          .then((post) => {
            expect(post).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
      xit('should create a new post and redirect', (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: 'Watching snow melt',
            body: 'without a doubt my favorite things to do besides watching paint dry!',
          },
        };
        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: 'Watching snow melt' }})
          .then((post) => {
            expect(post).not.toBeNull();
            expect(post.title).toBe('Watching snow melt');
            expect(post.body).toBe('without a doubt my favorite things to do besides watching paint dry!');
            expect(post.topicId).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
    describe('GET /topics/:topicId/posts/:id', () => {
      it('should render a view with the selected post', (done) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain('Snowball fighting');
          done();
        });
      });
    });
    describe('POST /topics/:topicId/posts/:id/destroy', () => {
      xit('should delete the post with the associated ID', (done) => {
        expect(this.post.id).toBe(1);
        console.log(this.post.userId);
        console.log(this.user.id);
        request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
          Post.findById(1).then((post) => {
            console.log(this.post.userId);
            console.log(this.user.id);
            expect(err).toBeNull();
            expect(post).toBeNull();
            done();
          });
        });
      });
    });
    describe('GET /topics/:topicId/posts/:id/edit', () => {
      xit('should render a view with an edit post form', (done) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Post");
          expect(body).toContain("Snowball fighting");
          done();
        });
      });
    });
    describe('POST /topics/:topicId/posts/:id/update', () => {
      xit('should return a status code 302', (done) => {
        request.post({
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Snowman Building Competition",
            body: "I love watching them melt slowly.",
          },
        }, (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        });
      });
      xit('should update the post with the given values', (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Snowman Building Competition",
            body: "I love watching them melt slowly.",
          },
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Post.findOne({
            where: { id: this.post.id },
          })
          .then((post) => {
            expect(post.title).toBe("Snowman Building Competition");
            done();
          });
        });
      });
    });
  });
});
