const express = require("express");
const favoriteController = require("../controllers/favoriteController");

const router = express.Router();

router.post("/topics/:topicId/posts/:postId/favorites/create", favoriteController.create);
router.post("/topics/:topicId/posts/:postId/favorites/:id/destroy", favoriteController.destroy);

module.exports = router;
