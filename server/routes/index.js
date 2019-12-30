const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");

const AuthController = require("../controllers/AuthController");
const ChatController = require("../controllers/ChatController");

router.get("/users", Auth.verifyToken, AuthController.index);
router.get("/users/:id", Auth.verifyToken, AuthController.show);
router.put("/users", Auth.verifyToken, AuthController.update);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

router.get("/chat/:id", Auth.verifyToken, ChatController.show);
router.put("/chat", Auth.verifyToken, ChatController.update);
router.get("/chats", Auth.verifyToken, ChatController.index);
router.post("/chats", Auth.verifyToken, ChatController.store);
router.get("/chats/:id/messages", Auth.verifyToken, ChatController.messages);
router.post("/chats/messages", Auth.verifyToken, ChatController.send);

router.post("/request", Auth.verifyToken, ChatController.access);
router.get("/access/:chatId/:userId", ChatController.confirm);

module.exports = router;
