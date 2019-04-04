const express = require("express");
const voteController = require("../controllers/voteController");

const router = express.Router();

router.get("/topics/:topicId/posts/:postId/votes/upvote", voteController.upVote);
router.get("/topics/:topicId/posts/:postId/votes/downvote", voteController.downVote);

module.exports = router;
