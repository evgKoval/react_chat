const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");

const AuthController = require("../controllers/AuthController");
const ChatController = require("../controllers/ChatController");

router.get("/users", Auth.verifyToken, AuthController.index);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

router.get("/chats", Auth.verifyToken, ChatController.index);
router.post("/chats", Auth.verifyToken, ChatController.store);

module.exports = router;
