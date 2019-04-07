'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Post.associate = (models) => {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE",
    });
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments",
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes",
    });
  };
  Post.prototype.getPoints = function () {
    const votes = this.getVotes();

    if (votes.length === 0) return 0;
    return votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };
  Post.prototype.hasUpvoteFor = function (userId) {
    return this.getVotes({ where: { userId, postId: this.id, value: 1 } })
    .then((votes) => {
      if (votes.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  };
  Post.prototype.hasDownvoteFor = function (userId) {
    return this.getVotes({ where: { userId, postId: this.id, value: -1 } })
    .then((votes) => {
      if (votes.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  };
  return Post;
};
