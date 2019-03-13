const express = require("express");
const userController = require("../controllers/userController");
const validation = require("./validation");

const router = express.Router();

router.get("/users/sign_up", userController.signUp);

router.post("/users", validation.validateUsers, userController.create);

module.exports = router;
